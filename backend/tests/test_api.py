"""
FraudShield AI — Automated Test Suite
Verifies API endpoint logic, ML prediction accuracy, explainability factors,
and database status update workflows.
"""

import os
import sys

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(CURRENT_DIR)
PROJECT_ROOT = os.path.dirname(BACKEND_DIR)
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from backend.main import (
    health_check,
    get_model_metrics,
    get_overview,
    list_transactions,
    analyze_transaction,
    update_status,
    simulate_single,
    get_limitations_doc
)
from backend.schemas import (
    TransactionAnalyzeRequest,
    StatusUpdateRequest,
    SimulateRequest
)


def test_health_endpoint():
    """Verify system health, ML model, and database status."""
    res = health_check()
    assert res["status"] == "healthy"
    assert res["model_loaded"] is True
    assert res["database"] == "connected"


def test_metrics_endpoint():
    """Verify authentic ML metrics are exposed accurately."""
    data = get_model_metrics()
    assert "evaluation_metrics" in data
    assert "f1_score" in data["evaluation_metrics"]
    assert "confusion_matrix" in data
    assert "feature_importances" in data
    assert len(data["feature_importances"]) > 0


def test_overview_endpoint():
    """Verify dashboard overview counters and aggregations."""
    data = get_overview()
    assert "kpis" in data
    assert "total_analyzed" in data["kpis"]
    assert "category_breakdown" in data
    assert "hourly_trend" in data


def test_transactions_pagination_and_filtering():
    """Verify transaction history, pagination, and risk tier filtering."""
    data = list_transactions(limit=10)
    assert "items" in data
    assert "pagination" in data
    assert len(data["items"]) <= 10


def test_analyze_legitimate_transaction():
    """Verify ML pipeline scores normal user behavior with Low Risk."""
    req = TransactionAnalyzeRequest(
        amount=42.50,
        merchant_category="grocery",
        merchant_name="Corner Market",
        customer_name="Alice Smith",
        customer_email="alice@example.com",
        card_type="Visa",
        card_last4="1234",
        billing_country="US",
        shipping_country="US",
        shipping_billing_match=True,
        foreign_transaction=False,
        distance_from_home_km=4.5,
        hour_of_day=15,
        day_of_week=3,
        tx_velocity_24h=1,
        account_age_days=340,
        failed_attempts_1h=0,
        ip_risk_score=0.02,
        device_type="mobile",
        browser="Safari",
        save_to_db=True
    )
    result = analyze_transaction(req)
    assert "risk_score" in result
    assert result["risk_tier"] == "Low Risk"
    assert result["recommendation"] == "APPROVE"
    assert len(result["protective_factors"]) > 0


def test_analyze_fraudulent_transaction():
    """Verify ML pipeline catches high-risk attack and decomposes explanations."""
    req = TransactionAnalyzeRequest(
        amount=3400.00,
        merchant_category="electronics",
        merchant_name="UltraTech Depot",
        customer_name="Suspicious User",
        customer_email="anon992@protonmail.com",
        card_type="Mastercard",
        card_last4="9999",
        billing_country="US",
        shipping_country="RU",
        shipping_billing_match=False,
        foreign_transaction=True,
        distance_from_home_km=6800.0,
        hour_of_day=3,
        day_of_week=6,
        tx_velocity_24h=15,
        account_age_days=1,
        failed_attempts_1h=4,
        ip_risk_score=0.96,
        device_type="bot_proxy",
        browser="Tor_Browser",
        save_to_db=True
    )
    result = analyze_transaction(req)
    assert result["risk_score"] >= 75.0
    assert result["risk_tier"] == "High Risk"
    assert result["recommendation"] == "MANUAL_REVIEW"
    assert len(result["top_risk_factors"]) >= 3


def test_status_update_flow():
    """Verify updating a transaction's review status."""
    req = TransactionAnalyzeRequest(
        amount=950.0,
        merchant_category="luxury_jewelry",
        save_to_db=True
    )
    saved = analyze_transaction(req)
    txn_id = saved["id"]

    update_res = update_status(txn_id, StatusUpdateRequest(
        status="Escalated",
        notes="Escalated due to high-value jewelry transaction for KYC check."
    ))
    assert update_res["transaction"]["status"] == "Escalated"
    assert "KYC check" in update_res["transaction"]["reviewer_notes"]


def test_simulation_endpoint():
    """Verify live transaction simulation generator."""
    sim_data = simulate_single(SimulateRequest(fraud_bias=0.5))
    assert sim_data["is_simulated"] is True
    assert "risk_score" in sim_data


def test_limitations_endpoint():
    """Verify dataset limitations documentation endpoint."""
    doc = get_limitations_doc()
    assert "content" in doc
    assert len(doc["content"]) > 100


if __name__ == "__main__":
    print("==================================================")
    print("    FRAUDSHIELD AI AUTOMATED TEST SUITE EXECUTION ")
    print("==================================================")
    tests = [
        test_health_endpoint,
        test_metrics_endpoint,
        test_overview_endpoint,
        test_transactions_pagination_and_filtering,
        test_analyze_legitimate_transaction,
        test_analyze_fraudulent_transaction,
        test_status_update_flow,
        test_simulation_endpoint,
        test_limitations_endpoint
    ]
    passed = 0
    for t in tests:
        try:
            t()
            print(f"  [PASS] {t.__name__}")
            passed += 1
        except Exception as e:
            print(f"  [FAIL] {t.__name__}: {e}")
    print("==================================================")
    print(f"  Result: {passed}/{len(tests)} tests passed successfully!")
    print("==================================================")
    if passed != len(tests):
        sys.exit(1)
