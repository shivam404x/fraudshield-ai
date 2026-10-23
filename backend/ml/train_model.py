"""
FraudShield AI — Model Training & Evaluation Pipeline
Trains a genuine scikit-learn classifier with class imbalance handling,
evaluates precision, recall, F1, PR-AUC, ROC-AUC, and exports metrics.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from datetime import datetime

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    average_precision_score,
    confusion_matrix,
    classification_report
)

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(CURRENT_DIR, "data", "ecommerce_fraud_dataset.csv")
MODELS_DIR = os.path.join(CURRENT_DIR, "models")
MODEL_FILE = os.path.join(MODELS_DIR, "fraud_model.joblib")
PREPROCESSOR_FILE = os.path.join(MODELS_DIR, "preprocessor.joblib")
METRICS_FILE = os.path.join(MODELS_DIR, "metrics.json")

os.makedirs(MODELS_DIR, exist_ok=True)

NUMERIC_FEATURES = [
    "amount",
    "hour_of_day",
    "day_of_week",
    "shipping_billing_match",
    "foreign_transaction",
    "distance_from_home_km",
    "tx_velocity_24h",
    "account_age_days",
    "failed_attempts_1h",
    "ip_risk_score"
]

CATEGORICAL_FEATURES = [
    "merchant_category",
    "device_type",
    "browser"
]

ALL_FEATURES = NUMERIC_FEATURES + CATEGORICAL_FEATURES


def train_and_evaluate():
    print("[TrainPipeline] Loading dataset...")
    if not os.path.exists(DATA_FILE):
        raise FileNotFoundError(f"Dataset not found at {DATA_FILE}. Run dataset_generator.py first.")

    df = pd.read_csv(DATA_FILE)
    total_samples = len(df)
    total_fraud = int(df["is_fraud"].sum())
    total_legit = total_samples - total_fraud

    X = df[ALL_FEATURES]
    y = df["is_fraud"].values

    print(f"[TrainPipeline] Total Samples: {total_samples}, Fraud: {total_fraud} ({total_fraud/total_samples*100:.2f}%)")

    # Stratified Train-Test Split (80% train, 20% test)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    # Preprocessing pipeline
    preprocessor = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), NUMERIC_FEATURES),
            ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), CATEGORICAL_FEATURES)
        ]
    )

    # Fit preprocessor on train data
    X_train_processed = preprocessor.fit_transform(X_train)
    X_test_processed = preprocessor.transform(X_test)

    # Class imbalance handling:
    # Random Forest with balanced subsample weights to handle 1:37 fraud imbalance
    print("[TrainPipeline] Training Balanced Random Forest Classifier...")
    model = RandomForestClassifier(
        n_estimators=120,
        max_depth=12,
        min_samples_split=6,
        min_samples_leaf=2,
        class_weight="balanced_subsample",
        random_state=42,
        n_jobs=-1
    )
    model.fit(X_train_processed, y_train)

    # Inference on held-out test set
    y_pred = model.predict(X_test_processed)
    y_proba = model.predict_proba(X_test_processed)[:, 1]

    # Authentic Evaluation Metrics
    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred))
    rec = float(recall_score(y_test, y_pred))
    f1 = float(f1_score(y_test, y_pred))
    pr_auc = float(average_precision_score(y_test, y_proba))
    roc_auc = float(roc_auc_score(y_test, y_proba))

    cm = confusion_matrix(y_test, y_pred)
    tn, fp, fn, tp = [int(val) for val in cm.ravel()]

    # Extract Feature Importances
    cat_feature_names = preprocessor.named_transformers_["cat"].get_feature_names_out(CATEGORICAL_FEATURES).tolist()
    all_transformed_feature_names = NUMERIC_FEATURES + cat_feature_names
    importances = model.feature_importances_

    feature_ranking = []
    for name, imp in zip(all_transformed_feature_names, importances):
        feature_ranking.append({
            "feature": name,
            "display_name": name.replace("_", " ").title(),
            "importance": round(float(imp), 4)
        })
    feature_ranking.sort(key=lambda x: x["importance"], reverse=True)

    metrics_payload = {
        "model_name": "FraudShield Random Forest Ensemble (Cost-Sensitive Balanced)",
        "algorithm": "RandomForestClassifier",
        "imbalance_handling": "Balanced Subsample Class Weighting + Stratified Splitting",
        "training_timestamp": datetime.utcnow().isoformat() + "Z",
        "dataset": {
            "total_records": total_samples,
            "train_records": len(X_train),
            "test_records": len(X_test),
            "fraud_count": total_fraud,
            "legit_count": total_legit,
            "fraud_prevalence_pct": round((total_fraud / total_samples) * 100, 2)
        },
        "evaluation_metrics": {
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1_score": round(f1, 4),
            "pr_auc": round(pr_auc, 4),
            "roc_auc": round(roc_auc, 4)
        },
        "confusion_matrix": {
            "tn": tn,
            "fp": fp,
            "fn": fn,
            "tp": tp,
            "matrix_2x2": [[tn, fp], [fn, tp]]
        },
        "feature_importances": feature_ranking[:12]
    }

    # Save artifacts safely
    joblib.dump(model, MODEL_FILE)
    joblib.dump(preprocessor, PREPROCESSOR_FILE)
    with open(METRICS_FILE, "w", encoding="utf-8") as f:
        json.dump(metrics_payload, f, indent=2)

    print("\n" + "="*50)
    print("      FRAUDSHIELD AI MODEL EVALUATION REPORT     ")
    print("="*50)
    print(f"Accuracy:   {acc*100:.2f}%")
    print(f"Precision:  {prec*100:.2f}%")
    print(f"Recall:     {rec*100:.2f}%")
    print(f"F1 Score:   {f1*100:.2f}%")
    print(f"PR-AUC:     {pr_auc:.4f}")
    print(f"ROC-AUC:    {roc_auc:.4f}")
    print(f"Confusion:  TN={tn}, FP={fp}, FN={fn}, TP={tp}")
    print("="*50)
    print(f"Artifacts saved ->\n  {MODEL_FILE}\n  {PREPROCESSOR_FILE}\n  {METRICS_FILE}")

    return metrics_payload


if __name__ == "__main__":
    train_and_evaluate()
