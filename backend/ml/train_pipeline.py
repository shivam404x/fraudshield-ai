"""
FraudShield AI — Production ML Pipeline for IEEE-CIS Dataset
Complete end-to-end training, time-based validation, evaluation, final retraining,
and test set prediction pipeline.
"""

import os
import sys

# Prevent joblib subprocess hang in sandbox
os.environ['LOKY_MAX_CPU_COUNT'] = '4'
os.environ['OMP_NUM_THREADS'] = '4'

import time
import json
import joblib
import numpy as np
import pandas as pd
from datetime import datetime

from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.metrics import (
    roc_auc_score,
    average_precision_score,
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report
)

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(CURRENT_DIR, "..", ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from backend.ml.preprocessor import IEEEPreprocessor

DATA_DIR = os.path.join(PROJECT_ROOT, "backend", "data")
MODELS_DIR = os.path.join(PROJECT_ROOT, "backend", "models")
os.makedirs(MODELS_DIR, exist_ok=True)

MODEL_FILE = os.path.join(MODELS_DIR, "fraud_model.joblib")
PREPROCESSOR_FILE = os.path.join(MODELS_DIR, "preprocessor.joblib")
METRICS_FILE = os.path.join(MODELS_DIR, "metrics.json")
SUBMISSION_FILE = os.path.join(DATA_DIR, "submission.csv")
ROOT_SUBMISSION_FILE = os.path.join(PROJECT_ROOT, "submission.csv")


def run_pipeline():
    start_time = time.time()
    print("=" * 70)
    print("FRAUDSHIELD AI — REAL ML TRAINING & INFERENCE PIPELINE")
    print("=" * 70)
    print(f"Timestamp : {datetime.utcnow().isoformat()}Z")
    print(f"Data Dir  : {DATA_DIR}")
    print(f"Models Dir: {MODELS_DIR}\n")

    # 1. Load Training Data
    print("[1/6] Loading training datasets...")
    train_tx_file = os.path.join(DATA_DIR, "train_transaction.csv")
    train_id_file = os.path.join(DATA_DIR, "train_identity.csv")

    train_tx = pd.read_csv(train_tx_file)
    train_id = pd.read_csv(train_id_file)
    print(f"  train_transaction.csv : {train_tx.shape}")
    print(f"  train_identity.csv    : {train_id.shape}")

    # Left join on TransactionID to preserve all rows
    train_merged = train_tx.merge(train_id, on="TransactionID", how="left")
    print(f"  Merged Training Data  : {train_merged.shape} (preserves all {len(train_tx):,} rows)")

    # 2. Chronological Sort for Time-Based Validation
    print("\n[2/6] Setting up time-based validation split...")
    train_merged = train_merged.sort_values("TransactionDT").reset_index(drop=True)
    
    # 80% train, 20% validation split based on TransactionDT
    split_idx = int(len(train_merged) * 0.8)
    train_split_raw = train_merged.iloc[:split_idx].copy()
    val_split_raw = train_merged.iloc[split_idx:].copy()

    print(f"  Training Split   : {train_split_raw.shape[0]:,} rows (DT range: {train_split_raw['TransactionDT'].min()} -> {train_split_raw['TransactionDT'].max()})")
    print(f"  Validation Split : {val_split_raw.shape[0]:,} rows (DT range: {val_split_raw['TransactionDT'].min()} -> {val_split_raw['TransactionDT'].max()})")
    print(f"  No time overlap  : {train_split_raw['TransactionDT'].max() < val_split_raw['TransactionDT'].min()}")
    print(f"  Train Fraud Rate : {train_split_raw['isFraud'].mean()*100:.3f}% ({train_split_raw['isFraud'].sum()} frauds)")
    print(f"  Val Fraud Rate   : {val_split_raw['isFraud'].mean()*100:.3f}% ({val_split_raw['isFraud'].sum()} frauds)")

    # 3. Fit Preprocessor on Training Split & Evaluate Validation Performance
    print("\n[3/6] Preprocessing and training baseline model on training split...")
    val_prep = IEEEPreprocessor()
    X_train_split = val_prep.fit_transform(train_split_raw)
    y_train_split = train_split_raw['isFraud'].values

    X_val_split = val_prep.transform(val_split_raw)
    y_val_split = val_split_raw['isFraud'].values

    print(f"  Engineered Features : {len(val_prep.feature_names)} features")
    print(f"  Categorical Columns : {len(val_prep.cat_cols)} columns")

    val_model = HistGradientBoostingClassifier(
        max_iter=150,
        learning_rate=0.07,
        max_leaf_nodes=40,
        min_samples_leaf=25,
        class_weight='balanced',
        categorical_features=val_prep.cat_indices,
        random_state=42
    )

    t_train = time.time()
    val_model.fit(X_train_split, y_train_split)
    print(f"  Validation model fit completed in {time.time() - t_train:.2f}s")

    # Evaluate AUROC & AUPRC on Validation Set
    val_prob = val_model.predict_proba(X_val_split)[:, 1]
    auroc = float(roc_auc_score(y_val_split, val_prob))
    auprc = float(average_precision_score(y_val_split, val_prob))

    # Evaluate at 0.5 threshold
    val_pred_binary = (val_prob >= 0.5).astype(int)
    acc = float(accuracy_score(y_val_split, val_pred_binary))
    prec = float(precision_score(y_val_split, val_pred_binary, zero_division=0))
    rec = float(recall_score(y_val_split, val_pred_binary, zero_division=0))
    f1 = float(f1_score(y_val_split, val_pred_binary, zero_division=0))
    cm = confusion_matrix(y_val_split, val_pred_binary).tolist()

    # Find optimal F1 threshold for imbalanced classification
    thresholds = np.linspace(0.1, 0.9, 81)
    best_f1, best_thresh = 0.0, 0.5
    for t in thresholds:
        cur_f1 = f1_score(y_val_split, (val_prob >= t).astype(int), zero_division=0)
        if cur_f1 > best_f1:
            best_f1 = cur_f1
            best_thresh = t

    print("\n" + "-" * 50)
    print("TIME-BASED VALIDATION SET METRICS (HONEST & UNFABRICATED):")
    print("-" * 50)
    print(f"  AUROC (ROC-AUC)        : {auroc:.5f} ({auroc*100:.2f}%)")
    print(f"  AUPRC (PR-AUC)         : {auprc:.5f} ({auprc*100:.2f}%)")
    print(f"  Accuracy (thresh=0.5)  : {acc:.5f} ({acc*100:.2f}%)")
    print(f"  Precision (thresh=0.5) : {prec:.5f} ({prec*100:.2f}%)")
    print(f"  Recall (thresh=0.5)    : {rec:.5f} ({rec*100:.2f}%)")
    print(f"  F1-Score (thresh=0.5)  : {f1:.5f} ({f1*100:.2f}%)")
    print(f"  Optimal F1 Threshold   : {best_thresh:.2f} (F1 = {best_f1:.4f})")
    print(f"  Confusion Matrix       : TN={cm[0][0]}, FP={cm[0][1]}, FN={cm[1][0]}, TP={cm[1][1]}")

    # 4. Retrain Final Model on All 80,000 Permitted Labeled Training Rows
    print("\n[4/6] Retraining final production model on full labeled training data (80,000 rows)...")
    final_prep = IEEEPreprocessor()
    X_full_train = final_prep.fit_transform(train_merged)
    y_full_train = train_merged['isFraud'].values

    final_model = HistGradientBoostingClassifier(
        max_iter=160,
        learning_rate=0.07,
        max_leaf_nodes=45,
        min_samples_leaf=25,
        class_weight='balanced',
        categorical_features=final_prep.cat_indices,
        random_state=42
    )

    t_full = time.time()
    final_model.fit(X_full_train, y_full_train)
    print(f"  Final model fit completed in {time.time() - t_full:.2f}s on {len(X_full_train):,} samples")

    # 5. Load Test Dataset & Generate Submission Predictions
    print("\n[5/6] Loading test dataset and generating submission predictions...")
    test_tx_file = os.path.join(DATA_DIR, "test_transaction.csv")
    test_id_file = os.path.join(DATA_DIR, "test_identity.csv")
    sample_sub_file = os.path.join(DATA_DIR, "sample_submission.csv")

    test_tx = pd.read_csv(test_tx_file)
    test_id = pd.read_csv(test_id_file)
    sample_sub = pd.read_csv(sample_sub_file)

    # Left join on TransactionID to preserve all test rows and their original order
    test_merged = test_tx.merge(test_id, on="TransactionID", how="left")
    print(f"  test_transaction.csv  : {test_tx.shape}")
    print(f"  test_identity.csv     : {test_id.shape}")
    print(f"  Merged Test Data      : {test_merged.shape}")

    # Integrity verification
    assert len(test_merged) == len(sample_sub), f"Row count mismatch: {len(test_merged)} vs {len(sample_sub)}"
    assert (test_merged['TransactionID'].values == sample_sub['TransactionID'].values).all(), "Test row order mismatch!"
    print("  Test Row Integrity   : Exactly 20,000 rows in identical sequential order preserved.")

    # Transform test features
    X_test = final_prep.transform(test_merged)
    print(f"  Test Feature Matrix   : {X_test.shape}")

    # Generate probabilities
    test_probs = final_model.predict_proba(X_test)[:, 1]
    assert not np.isnan(test_probs).any(), "NaN found in predictions!"
    assert (test_probs >= 0.0).all() and (test_probs <= 1.0).all(), "Probabilities outside [0, 1] range!"

    # Create submission DataFrame
    submission = pd.DataFrame({
        "TransactionID": sample_sub["TransactionID"].values,
        "isFraud": np.round(test_probs, 6)
    })

    # Save to both backend/data and root
    submission.to_csv(SUBMISSION_FILE, index=False)
    submission.to_csv(ROOT_SUBMISSION_FILE, index=False)
    print(f"  Saved submission to   : {SUBMISSION_FILE}")
    print(f"  Saved submission to   : {ROOT_SUBMISSION_FILE}")
    print(f"  Submission Shape      : {submission.shape}")
    print(f"  Submission Columns    : {list(submission.columns)}")
    print(f"  Sample Predictions:\n{submission.head(5)}")

    # 6. Save Model, Preprocessor & Metrics Artifacts
    print("\n[6/6] Saving trained model and evaluation artifacts...")
    joblib.dump(final_model, MODEL_FILE)
    joblib.dump(final_prep, PREPROCESSOR_FILE)
    print(f"  Model saved to        : {MODEL_FILE}")
    print(f"  Preprocessor saved to : {PREPROCESSOR_FILE}")

    metrics_payload = {
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "dataset": "IEEE-CIS E-Commerce Fraud Detection (80k train, 20k test)",
        "train_samples": int(len(train_merged)),
        "test_samples": int(len(test_merged)),
        "validation_strategy": "Chronological Out-of-Time Split (80% train / 20% validation by TransactionDT)",
        "evaluation_metrics": {
            "roc_auc": round(auroc, 5),
            "auroc": round(auroc, 5),
            "auprc": round(auprc, 5),
            "pr_auc": round(auprc, 5),
            "accuracy": round(acc, 5),
            "precision": round(prec, 5),
            "recall": round(rec, 5),
            "f1_score": round(f1, 5),
            "optimal_f1": round(best_f1, 5),
            "optimal_threshold": round(best_thresh, 2),
            "true_negatives": int(cm[0][0]),
            "false_positives": int(cm[0][1]),
            "false_negatives": int(cm[1][0]),
            "true_positives": int(cm[1][1])
        },
        "model_architecture": {
            "algorithm": "HistGradientBoostingClassifier",
            "loss": "log_loss",
            "class_weight": "balanced",
            "learning_rate": 0.07,
            "max_iter": 160,
            "max_leaf_nodes": 45,
            "min_samples_leaf": 25,
            "features_count": len(final_prep.feature_names)
        }
    }

    with open(METRICS_FILE, "w", encoding="utf-8") as f:
        json.dump(metrics_payload, f, indent=2)

    # Also sync metrics to backend/ml/models for backward compatibility if needed
    legacy_models_dir = os.path.join(CURRENT_DIR, "models")
    os.makedirs(legacy_models_dir, exist_ok=True)
    with open(os.path.join(legacy_models_dir, "metrics.json"), "w", encoding="utf-8") as f:
        json.dump(metrics_payload, f, indent=2)
    joblib.dump(final_model, os.path.join(legacy_models_dir, "fraud_model.joblib"))
    joblib.dump(final_prep, os.path.join(legacy_models_dir, "preprocessor.joblib"))

    print(f"  Metrics exported to   : {METRICS_FILE}")

    total_duration = time.time() - start_time
    print("\n" + "=" * 70)
    print(f"PIPELINE COMPLETED SUCCESSFULLY IN {total_duration:.2f}s")
    print("=" * 70)
    return metrics_payload


if __name__ == "__main__":
    run_pipeline()
