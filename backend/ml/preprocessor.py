"""
FraudShield AI — IEEE-CIS Preprocessor Module
Reusable preprocessor class for training and production inference.
"""

import numpy as np
import pandas as pd
from sklearn.preprocessing import OrdinalEncoder


class IEEEPreprocessor:
    """Handles feature engineering, frequency encodings, and ordinal encodings."""
    def __init__(self):
        self.device_counts = {}
        self.top_devices = []
        self.encoder = None
        self.cat_cols = []
        self.feature_names = []
        self.cat_indices = []

    def fit_transform(self, df: pd.DataFrame) -> pd.DataFrame:
        df_out = df.copy()

        # 1. Temporal feature engineering from TransactionDT
        if 'TransactionDT' in df_out.columns:
            df_out['Transaction_hour'] = (df_out['TransactionDT'] // 3600) % 24
            df_out['Transaction_day'] = (df_out['TransactionDT'] // 86400) % 7

        # 2. Transaction Amount feature engineering
        if 'TransactionAmt' in df_out.columns:
            df_out['TransactionAmt_log'] = np.log1p(df_out['TransactionAmt'])
            df_out['TransactionAmt_decimal'] = (df_out['TransactionAmt'] - np.floor(df_out['TransactionAmt'])).round(4)

        # 3. High-cardinality DeviceInfo handling
        if 'DeviceInfo' in df_out.columns:
            self.device_counts = df_out['DeviceInfo'].value_counts()
            self.top_devices = self.device_counts.index[:240].tolist()
            df_out['DeviceInfo_top'] = df_out['DeviceInfo'].apply(
                lambda x: x if (x in self.top_devices or pd.isna(x)) else 'Other'
            )
            df_out['DeviceInfo_freq'] = df_out['DeviceInfo'].map(self.device_counts / len(df_out)).fillna(0)
            df_out = df_out.drop(columns=['DeviceInfo'])

        # 4. Identify categorical columns
        self.cat_cols = df_out.select_dtypes(include=['object', 'category']).columns.tolist()

        # 5. Fit OrdinalEncoder on categorical columns
        self.encoder = OrdinalEncoder(handle_unknown='use_encoded_value', unknown_value=-1)
        df_out[self.cat_cols] = df_out[self.cat_cols].fillna('__MISSING__').astype(str)
        df_out[self.cat_cols] = self.encoder.fit_transform(df_out[self.cat_cols])

        # Drop identifiers & target if present
        cols_to_drop = [c for c in ['TransactionID', 'isFraud'] if c in df_out.columns]
        X = df_out.drop(columns=cols_to_drop)

        self.feature_names = list(X.columns)
        self.cat_indices = [X.columns.get_loc(c) for c in self.cat_cols if c in X.columns]
        return X

    def transform(self, df: pd.DataFrame) -> pd.DataFrame:
        df_out = df.copy()

        if 'TransactionDT' in df_out.columns:
            df_out['Transaction_hour'] = (df_out['TransactionDT'] // 3600) % 24
            df_out['Transaction_day'] = (df_out['TransactionDT'] // 86400) % 7

        if 'TransactionAmt' in df_out.columns:
            df_out['TransactionAmt_log'] = np.log1p(df_out['TransactionAmt'])
            df_out['TransactionAmt_decimal'] = (df_out['TransactionAmt'] - np.floor(df_out['TransactionAmt'])).round(4)

        if 'DeviceInfo' in df_out.columns:
            df_out['DeviceInfo_top'] = df_out['DeviceInfo'].apply(
                lambda x: x if (x in self.top_devices or pd.isna(x)) else 'Other'
            )
            df_out['DeviceInfo_freq'] = df_out['DeviceInfo'].map(self.device_counts / len(df_out)).fillna(0)
            df_out = df_out.drop(columns=['DeviceInfo'])
        else:
            df_out['DeviceInfo_top'] = '__MISSING__'
            df_out['DeviceInfo_freq'] = 0.0

        # Ensure all expected categorical columns exist
        for col in self.cat_cols:
            if col not in df_out.columns:
                df_out[col] = '__MISSING__'

        df_out[self.cat_cols] = df_out[self.cat_cols].fillna('__MISSING__').astype(str)
        df_out[self.cat_cols] = self.encoder.transform(df_out[self.cat_cols])

        cols_to_drop = [c for c in ['TransactionID', 'isFraud'] if c in df_out.columns]
        X = df_out.drop(columns=cols_to_drop, errors='ignore')

        # Align with fitted feature names
        missing_cols = [c for c in self.feature_names if c not in X.columns]
        if missing_cols:
            missing_df = pd.DataFrame(np.nan, index=X.index, columns=missing_cols)
            X = pd.concat([X, missing_df], axis=1)
        X = X[self.feature_names]
        return X
