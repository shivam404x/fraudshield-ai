"""
FraudShield AI — Pydantic Schemas for Request & Response Validation
"""

from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field


class TransactionAnalyzeRequest(BaseModel):
    amount: float = Field(..., ge=0.01, description="Transaction amount in USD")
    merchant_category: str = Field(..., description="e.g. electronics, luxury_jewelry, digital_goods, fashion, grocery, home_goods, travel")
    merchant_name: Optional[str] = Field("Online Store", description="Name of merchant")
    customer_name: Optional[str] = Field("Guest Shopper", description="Customer full name")
    customer_email: Optional[str] = Field("customer@example.com", description="Customer email")
    card_type: Optional[str] = Field("Visa", description="Visa, Mastercard, Amex, Discover")
    card_last4: Optional[str] = Field("4242", description="Last 4 digits of card")
    billing_country: Optional[str] = Field("US", description="ISO country code")
    shipping_country: Optional[str] = Field("US", description="ISO country code")
    shipping_billing_match: Optional[bool] = Field(True, description="True if shipping country matches billing")
    foreign_transaction: Optional[bool] = Field(False, description="True if IP/foreign transaction")
    distance_from_home_km: Optional[float] = Field(15.0, ge=0.0, description="Estimated distance from billing address in km")
    hour_of_day: Optional[int] = Field(14, ge=0, le=23, description="Local transaction hour (0-23)")
    day_of_week: Optional[int] = Field(2, ge=0, le=6, description="Day of week (0=Mon, 6=Sun)")
    tx_velocity_24h: Optional[int] = Field(1, ge=1, le=100, description="Number of transactions in rolling 24h")
    account_age_days: Optional[int] = Field(180, ge=0, le=10000, description="Account age in days")
    failed_attempts_1h: Optional[int] = Field(0, ge=0, le=20, description="Failed verification attempts in past hour")
    ip_risk_score: Optional[float] = Field(0.05, ge=0.0, le=1.0, description="IP proxy/threat score 0.0 - 1.0")
    device_type: Optional[str] = Field("desktop", description="desktop, mobile, tablet, bot_proxy")
    browser: Optional[str] = Field("Chrome", description="Chrome, Safari, Edge, Firefox, Tor_Browser")
    save_to_db: Optional[bool] = Field(True, description="Whether to commit this transaction to the audit ledger")


class StatusUpdateRequest(BaseModel):
    status: str = Field(..., description="Approved, Under Review, Escalated, Rejected")
    notes: Optional[str] = Field("", description="Fraud analyst review rationale")


class SimulateRequest(BaseModel):
    fraud_bias: Optional[float] = Field(0.2, ge=0.0, le=1.0, description="Probability of generating a high-risk transaction")
    count: Optional[int] = Field(1, ge=1, le=20, description="Number of transactions to generate")
