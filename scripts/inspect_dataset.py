import os
import sys
import pandas as pd
import numpy as np

DATA_DIR = 'backend/data'
files = [
    'train_transaction.csv',
    'train_identity.csv',
    'test_transaction.csv',
    'test_identity.csv',
    'sample_submission.csv'
]

print("=" * 60)
print("1. FILE EXISTENCE & INTEGRITY CHECK")
print("=" * 60)
all_exist = True
for f in files:
    path = os.path.join(DATA_DIR, f)
    exists = os.path.exists(path)
    if not exists:
        all_exist = False
    size = os.path.getsize(path) if exists else 0
    print(f"  {f:<22} : Exists={exists:<5} Size={size:>10,} bytes ({size/(1024*1024):>6.2f} MB)")

if not all_exist:
    print("\n[ERROR] Not all files are present!")
    sys.exit(1)

print("\n" + "=" * 60)
print("2. DETAILED DATASET INSPECTION")
print("=" * 60)

dfs = {}
for f in files:
    path = os.path.join(DATA_DIR, f)
    print(f"\n--- Loading: {f} ---")
    df = pd.read_csv(path)
    dfs[f] = df
    
    rows, cols = df.shape
    missing_cells = df.isna().sum().sum()
    total_cells = rows * cols
    missing_pct = (missing_cells / total_cells * 100) if total_cells > 0 else 0
    
    print(f"  Rows                  : {rows:,}")
    print(f"  Columns               : {cols:,}")
    print(f"  Missing Cells         : {missing_cells:,} ({missing_pct:.2f}%)")
    
    # TransactionID check
    if 'TransactionID' in df.columns:
        n_unique = df['TransactionID'].nunique()
        is_unique = (n_unique == rows)
        min_id = df['TransactionID'].min()
        max_id = df['TransactionID'].max()
        print(f"  TransactionID Unique  : {is_unique} ({n_unique:,} unique / {rows:,} rows)")
        print(f"  TransactionID Range   : [{min_id:,} -> {max_id:,}]")
    else:
        print("  TransactionID         : NOT PRESENT")
        
    # Target check
    if 'isFraud' in df.columns:
        counts = df['isFraud'].value_counts(dropna=False).to_dict()
        mean_fraud = df['isFraud'].mean()
        print(f"  Target 'isFraud'      : Present")
        print(f"    Distribution        : {counts}")
        print(f"    Fraud Rate          : {mean_fraud*100:.3f}% ({mean_fraud:.5f})")
    else:
        print("  Target 'isFraud'      : Not Present")
        
    # Column types preview
    dtypes = df.dtypes.value_counts().to_dict()
    print(f"  Data Types Breakdown  : {dtypes}")
    print(f"  Sample Columns (first 10): {list(df.columns[:10])}")

print("\n" + "=" * 60)
print("3. MERGE & ALIGNMENT VERIFICATION")
print("=" * 60)

train_tx = dfs['train_transaction.csv']
train_id = dfs['train_identity.csv']
test_tx = dfs['test_transaction.csv']
test_id = dfs['test_identity.csv']
sub = dfs['sample_submission.csv']

# Check identity overlap with transaction
train_id_in_tx = train_id['TransactionID'].isin(train_tx['TransactionID']).all()
test_id_in_tx = test_id['TransactionID'].isin(test_tx['TransactionID']).all()
print(f"All train_identity IDs in train_transaction: {train_id_in_tx} ({len(train_id):,} / {len(train_tx):,} have identity)")
print(f"All test_identity IDs in test_transaction  : {test_id_in_tx} ({len(test_id):,} / {len(test_tx):,} have identity)")

# Check test vs sample_submission alignment
test_tx_ids = test_tx['TransactionID'].tolist()
sub_ids = sub['TransactionID'].tolist()

print(f"\nTest Transaction Rows : {len(test_tx):,}")
print(f"Submission Rows       : {len(sub):,}")
print(f"Rows Match            : {len(test_tx) == len(sub)}")

if len(test_tx) == len(sub):
    exact_id_match = (test_tx_ids == sub_ids)
    print(f"TransactionIDs match exactly in order: {exact_id_match}")
else:
    common_ids = len(set(test_tx_ids).intersection(set(sub_ids)))
    print(f"Common TransactionIDs between test and sub: {common_ids:,}")
    print(f"Test IDs not in sub: {len(set(test_tx_ids) - set(sub_ids)):,}")
    print(f"Sub IDs not in test: {len(set(sub_ids) - set(test_tx_ids)):,}")

print(f"Submission Columns    : {list(sub.columns)}")

print("\n" + "=" * 60)
print("4. FEATURE OVERLAP & DIFFERENCES")
print("=" * 60)
train_cols = set(train_tx.columns)
test_cols = set(test_tx.columns)

diff_train_test = train_cols - test_cols
diff_test_train = test_cols - train_cols

print(f"Columns in train_transaction but not test_transaction: {diff_train_test}")
print(f"Columns in test_transaction but not train_transaction: {diff_test_train}")

train_id_cols = set(train_id.columns)
test_id_cols = set(test_id.columns)
print(f"Columns in train_identity: {len(train_id_cols)}")
print(f"Columns in test_identity : {len(test_id_cols)}")
print(f"train_identity vs test_identity diff: {train_id_cols ^ test_id_cols}")

print("\nInspection complete.")
