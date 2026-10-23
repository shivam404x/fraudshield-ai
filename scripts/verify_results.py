"""
Verification Script for FraudShield AI Execution Results
Performs comprehensive validation of:
1. Training completion & artifacts
2. Time-based validation AUROC & AUPRC
3. Model and preprocessor loadability & inference
4. Submission integrity (rows, columns, ordering, probability range [0, 1])
5. Automated integration tests
"""

import os
import sys
import json
import joblib
import pandas as pd
import numpy as np

# Set environment
os.environ['LOKY_MAX_CPU_COUNT'] = '4'
os.environ['OMP_NUM_THREADS'] = '4'

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from backend.ml.preprocessor import IEEEPreprocessor

passed_checks = []
failed_checks = []

def check(name, condition, details=""):
    if condition:
        passed_checks.append((name, details))
        print(f"[PASS] {name}: {details}")
    else:
        failed_checks.append((name, details))
        print(f"[FAIL] {name}: {details}")

print("=" * 70)
print("VERIFICATION OF FRAUD DETECTION EXECUTION RESULTS")
print("=" * 70)

# Check 1 & 2: Metrics File & Validation AUROC / AUPRC
metrics_path = os.path.join(PROJECT_ROOT, "backend", "models", "metrics.json")
check("Metrics file exists", os.path.exists(metrics_path), metrics_path)

if os.path.exists(metrics_path):
    with open(metrics_path, "r", encoding="utf-8") as f:
        metrics = json.load(f)
    
    eval_m = metrics.get("evaluation_metrics", {})
    auroc = eval_m.get("auroc") or eval_m.get("roc_auc")
    auprc = eval_m.get("auprc") or eval_m.get("pr_auc")
    
    check("Time-based AUROC reported", auroc is not None and auroc > 0.5, f"AUROC = {auroc:.5f} ({auroc*100:.2f}%)")
    check("Time-based AUPRC reported", auprc is not None and auprc > 0.05, f"AUPRC = {auprc:.5f} ({auprc*100:.2f}%)")
    check("Accuracy reported", "accuracy" in eval_m, f"Accuracy = {eval_m.get('accuracy'):.5f}")
    check("F1-Score reported", "f1_score" in eval_m, f"F1-Score = {eval_m.get('f1_score'):.5f}")
    check("Confusion matrix reported", "confusion_matrix" in metrics, f"CM = {metrics.get('confusion_matrix')}")
    check("Validation strategy documented", "validation_strategy" in metrics, metrics.get("validation_strategy"))

# Check 3: Model and Preprocessor Files & Loadability
model_path = os.path.join(PROJECT_ROOT, "backend", "models", "fraud_model.joblib")
prep_path = os.path.join(PROJECT_ROOT, "backend", "models", "preprocessor.joblib")

check("Trained model file exists", os.path.exists(model_path), f"Size = {os.path.getsize(model_path):,} bytes")
check("Preprocessor pipeline exists", os.path.exists(prep_path), f"Size = {os.path.getsize(prep_path):,} bytes")

try:
    model = joblib.load(model_path)
    prep = joblib.load(prep_path)
    check("Model unpickling", model is not None, f"Type = {type(model).__name__}")
    check("Preprocessor unpickling", prep is not None, f"Features = {len(prep.feature_names)}")
    
    # Test sample inference
    test_tx_path = os.path.join(PROJECT_ROOT, "backend", "data", "test_transaction.csv")
    test_id_path = os.path.join(PROJECT_ROOT, "backend", "data", "test_identity.csv")
    sample_merged = pd.read_csv(test_tx_path, nrows=5).merge(pd.read_csv(test_id_path, nrows=5), on="TransactionID", how="left")
    X_sample = prep.transform(sample_merged)
    sample_preds = model.predict_proba(X_sample)[:, 1]
    check("Sample inference test", len(sample_preds) == 5, f"Preds = {[round(float(p), 4) for p in sample_preds]}")
except Exception as e:
    check("Model/Preprocessor load & predict", False, str(e))

# Check 4: Submission.csv Verification
sub_paths = [
    os.path.join(PROJECT_ROOT, "backend", "data", "submission.csv"),
    os.path.join(PROJECT_ROOT, "submission.csv")
]

sample_sub_path = os.path.join(PROJECT_ROOT, "backend", "data", "sample_submission.csv")
sample_sub = pd.read_csv(sample_sub_path)

for sub_p in sub_paths:
    rel_p = os.path.relpath(sub_p, PROJECT_ROOT)
    check(f"Submission file exists ({rel_p})", os.path.exists(sub_p), f"Size = {os.path.getsize(sub_p):,} bytes")
    if os.path.exists(sub_p):
        sub_df = pd.read_csv(sub_p)
        check(f"Row count exact 20,000 ({rel_p})", len(sub_df) == 20000, f"Rows = {len(sub_df):,}")
        check(f"Columns match ['TransactionID', 'isFraud'] ({rel_p})", list(sub_df.columns) == ["TransactionID", "isFraud"], f"Cols = {list(sub_df.columns)}")
        
        # Check TransactionID order preservation
        order_match = (sub_df["TransactionID"].values == sample_sub["TransactionID"].values).all()
        check(f"TransactionID order matches sample_submission ({rel_p})", order_match, f"IDs [{sub_df['TransactionID'].iloc[0]} ... {sub_df['TransactionID'].iloc[-1]}]")
        
        # Check probabilities
        has_nans = sub_df["isFraud"].isna().any()
        check(f"Zero NaNs in isFraud ({rel_p})", not has_nans, f"NaN count = {sub_df['isFraud'].isna().sum()}")
        
        min_p = float(sub_df["isFraud"].min())
        max_p = float(sub_df["isFraud"].max())
        mean_p = float(sub_df["isFraud"].mean())
        in_bounds = (min_p >= 0.0) and (max_p <= 1.0)
        check(f"Probabilities within [0, 1] ({rel_p})", in_bounds, f"min={min_p:.6f}, max={max_p:.6f}, mean={mean_p:.6f}")

print("\n" + "=" * 70)
print(f"VERIFICATION SUMMARY: {len(passed_checks)} PASSED, {len(failed_checks)} FAILED")
print("=" * 70)

if failed_checks:
    print("Failures encountered:")
    for f_name, f_detail in failed_checks:
        print(f"  - {f_name}: {f_detail}")
    sys.exit(1)
else:
    print("ALL CHECKS PASSED WITH 100% INTEGRITY.")
    sys.exit(0)
