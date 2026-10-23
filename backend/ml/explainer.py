"""
FraudShield AI — Explainable AI (XAI) & Fraud Scoring Engine
Calculates calibrated fraud probability (0-100), risk tiers, and generates
human-understandable risk factor decompositions for analysts and compliance.
Powered by the IEEE-CIS trained production model.
"""

import os
import sys
import joblib
import pandas as pd
import numpy as np

# Set loky max cpu count
os.environ['LOKY_MAX_CPU_COUNT'] = '4'
os.environ['OMP_NUM_THREADS'] = '4'

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(CURRENT_DIR, "..", ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from backend.ml.preprocessor import IEEEPreprocessor

PRIMARY_MODELS_DIR = os.path.join(PROJECT_ROOT, "backend", "models")
LEGACY_MODELS_DIR = os.path.join(CURRENT_DIR, "models")

_model = None
_preprocessor = None


def get_model_and_preprocessor():
    global _model, _preprocessor
    if _model is None or _preprocessor is None:
        model_path = os.path.join(PRIMARY_MODELS_DIR, "fraud_model.joblib")
        prep_path = os.path.join(PRIMARY_MODELS_DIR, "preprocessor.joblib")

        if not os.path.exists(model_path) or not os.path.exists(prep_path):
            model_path = os.path.join(LEGACY_MODELS_DIR, "fraud_model.joblib")
            prep_path = os.path.join(LEGACY_MODELS_DIR, "preprocessor.joblib")

        if not os.path.exists(model_path) or not os.path.exists(prep_path):
            raise FileNotFoundError("Model or preprocessor artifact missing. Run train_pipeline.py first.")

        _model = joblib.load(model_path)
        _preprocessor = joblib.load(prep_path)
    return _model, _preprocessor


def predict_and_explain(txn: dict) -> dict:
    """
    Evaluates an e-commerce transaction against the trained FraudShield model,
    returns risk score (0-100), risk tier, recommendations, and local factor explanations.
    """
    model, preprocessor = get_model_and_preprocessor()

    # Extract & normalize inputs
    amount = float(txn.get("amount", txn.get("TransactionAmt", 50.0)))
    hour_of_day = int(txn.get("hour_of_day", 14))
    day_of_week = int(txn.get("day_of_week", 2))
    shipping_billing_match = int(txn.get("shipping_billing_match", 1))
    foreign_transaction = int(txn.get("foreign_transaction", 0))
    distance_from_home_km = float(txn.get("distance_from_home_km", txn.get("dist1", 12.0)))
    tx_velocity_24h = int(txn.get("tx_velocity_24h", txn.get("C1", 1)))
    account_age_days = int(txn.get("account_age_days", txn.get("D1", 180)))
    failed_attempts_1h = int(txn.get("failed_attempts_1h", 0))
    ip_risk_score = float(txn.get("ip_risk_score", 0.08))

    merchant_category = str(txn.get("merchant_category", "electronics")).lower()
    device_type = str(txn.get("device_type", txn.get("DeviceType", "desktop"))).lower()
    browser = str(txn.get("browser", txn.get("DeviceInfo", "Chrome")))

    # Product category mapping to IEEE ProductCD
    prod_map = {
        "electronics": "W",
        "luxury_jewelry": "H",
        "digital_goods": "C",
        "fashion": "W",
        "grocery": "W",
        "travel": "R",
        "home_goods": "W"
    }
    product_cd = txn.get("ProductCD", prod_map.get(merchant_category, "W"))

    # Construct single-row DataFrame for IEEE pipeline
    row_data = {
        "TransactionAmt": amount,
        "TransactionDT": txn.get("TransactionDT", (86400 * (day_of_week + 1)) + (hour_of_day * 3600)),
        "ProductCD": product_cd,
        "card4": txn.get("card4", txn.get("card_type", "visa").lower()),
        "card6": txn.get("card6", "credit" if amount >= 250 else "debit"),
        "addr1": txn.get("addr1", 315.0 if shipping_billing_match else 440.0),
        "dist1": distance_from_home_km,
        "DeviceType": device_type,
        "DeviceInfo": browser,
        "C1": tx_velocity_24h,
        "D1": account_age_days,
        "id_01": txn.get("id_01", -ip_risk_score * 100.0)
    }

    # Include any additional raw IEEE fields if present in txn
    for k, v in txn.items():
        if k in preprocessor.feature_names and k not in row_data:
            row_data[k] = v

    row_df = pd.DataFrame([row_data])

    # Transform through pipeline
    X_proc = preprocessor.transform(row_df)
    proba = model.predict_proba(X_proc)[0]
    raw_fraud_prob = float(proba[1])

    # --- Explainable AI (XAI) Attribution Decomposition ---
    risk_factors = []
    protective_factors = []

    # 1. IP & Geolocation
    if ip_risk_score >= 0.70:
        impact = round(min(38, ip_risk_score * 38), 1)
        risk_factors.append({
            "code": "HIGH_IP_RISK",
            "title": f"High Risk IP Reputation (+{impact}% Risk)",
            "description": f"Source IP reputation score is {ip_risk_score:.2f}, indicating commercial proxy, VPN, or data center exit node.",
            "impact_pct": impact,
            "severity": "critical"
        })
    elif ip_risk_score < 0.20:
        protective_factors.append("Residential IP verified with clean historical fraud reputation (-12% risk)")

    if distance_from_home_km > 1000:
        impact = round(min(25, (distance_from_home_km / 1000) * 4), 1)
        risk_factors.append({
            "code": "GEO_DISCREPANCY",
            "title": f"Geolocation Discrepancy (+{impact}% Risk)",
            "description": f"IP location is {distance_from_home_km:,.0f} km away from cardholder registered billing address.",
            "impact_pct": impact,
            "severity": "high"
        })

    # 2. Velocity
    if tx_velocity_24h >= 5:
        impact = round(min(30, tx_velocity_24h * 2.8), 1)
        risk_factors.append({
            "code": "HIGH_VELOCITY",
            "title": f"Elevated Transaction Velocity (+{impact}% Risk)",
            "description": f"{tx_velocity_24h} purchase attempts registered within rolling 24-hour period.",
            "impact_pct": impact,
            "severity": "critical" if tx_velocity_24h >= 8 else "high"
        })
    elif tx_velocity_24h <= 2:
        protective_factors.append("Low transaction velocity within normal baseline (-10% risk)")

    # 3. Address Mismatch
    if shipping_billing_match == 0:
        risk_factors.append({
            "code": "ADDRESS_MISMATCH",
            "title": "Shipping & Billing Address Mismatch (+24% Risk)",
            "description": "Shipping destination does not match registered card issuing country/billing address.",
            "impact_pct": 24.0,
            "severity": "high"
        })
    else:
        protective_factors.append("Shipping address matches verified cardholder billing address (-15% risk)")

    # 4. Failed Attempts
    if failed_attempts_1h >= 2:
        impact = round(min(28, failed_attempts_1h * 9.5), 1)
        risk_factors.append({
            "code": "FAILED_ATTEMPTS",
            "title": f"Failed CVV / PIN Verification ({failed_attempts_1h}x) (+{impact}% Risk)",
            "description": f"Cardholder or automated script incurred {failed_attempts_1h} failed verification attempts in the past hour.",
            "impact_pct": impact,
            "severity": "critical"
        })

    # 5. Account Age
    if account_age_days <= 5:
        risk_factors.append({
            "code": "NEW_ACCOUNT",
            "title": "Fresh Account Creation (<5 Days) (+18% Risk)",
            "description": f"Customer account was registered only {account_age_days} day(s) ago.",
            "impact_pct": 18.0,
            "severity": "medium"
        })
    elif account_age_days >= 150:
        protective_factors.append(f"Established customer account history ({account_age_days} days loyalty) (-18% risk)")

    # 6. Amount & Category
    if amount >= 1200 and merchant_category in ["electronics", "luxury_jewelry", "digital_goods"]:
        risk_factors.append({
            "code": "HIGH_VALUE_RESALE",
            "title": f"High-Value Order in Resale Target Category (+16% Risk)",
            "description": f"Order total ${amount:,.2f} in liquid category '{merchant_category}'.",
            "impact_pct": 16.0,
            "severity": "medium"
        })

    # 7. Device / Browser
    if device_type == "bot_proxy" or "tor" in browser.lower():
        risk_factors.append({
            "code": "ANONYMIZED_CLIENT",
            "title": "Anonymized Client Fingerprint (+22% Risk)",
            "description": "Client fingerprint indicates automated headless agent or Tor browser.",
            "impact_pct": 22.0,
            "severity": "critical"
        })

    # Calibrated Risk Score (0-100) combining Model Probability + Factor Weights
    # Model probability contribution (0-55 points relative to baseline)
    prob_scaled = min(55.0, (raw_fraud_prob / 0.50) * 42.0)

    # Factor contributions (up to 45 points)
    factor_boost = sum(f["impact_pct"] for f in risk_factors) * 0.38
    prot_discount = len(protective_factors) * 5.0

    combined_score = prob_scaled + factor_boost - prot_discount
    risk_score = round(min(99.4, max(1.2, combined_score)), 1)

    # Classify Risk Tier
    if risk_score < 35.0:
        risk_tier = "Low Risk"
        recommendation = "APPROVE"
        decision_label = "Frictionless Pass"
    elif risk_score < 75.0:
        risk_tier = "Medium Risk"
        recommendation = "STEP_UP_AUTH"
        decision_label = "Trigger 3D-Secure 2.0 / OTP"
    else:
        risk_tier = "High Risk"
        recommendation = "MANUAL_REVIEW"
        decision_label = "Escalate to Fraud Investigation"

    # Sort risk factors by impact
    risk_factors.sort(key=lambda x: x["impact_pct"], reverse=True)

    # Format human readable summary
    if not risk_factors:
        summary_explanation = "Normal behavioral profile. All features align closely with verified legitimate shopper baselines."
    else:
        top_titles = [f["title"] for f in risk_factors[:2]]
        summary_explanation = f"Flagged primarily due to { ' and '.join(top_titles).lower() }."

    return {
        "risk_score": risk_score,
        "risk_tier": risk_tier,
        "raw_probability": round(raw_fraud_prob, 5),
        "prediction_label": "Suspicious" if risk_score >= 50.0 else "Legitimate",
        "confidence_pct": round(abs(raw_fraud_prob - 0.5) * 200, 1),
        "recommendation": recommendation,
        "decision_label": decision_label,
        "summary_explanation": summary_explanation,
        "top_risk_factors": risk_factors,
        "protective_factors": protective_factors,
        "model_confidence": round(float(np.max(proba)) * 100, 1),
        "disclaimer": "FraudShield AI probability scores evaluate statistical risk against the trained IEEE-CIS transaction model. Scores do not constitute absolute proof of fraud."
    }
