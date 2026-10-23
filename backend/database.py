"""
FraudShield AI — Database Storage Engine (SQLite with PostgreSQL migration path)
Handles persistent storage of analyzed transactions, risk scores, analyst review statuses,
audit logs, and statistical aggregations for the cybersecurity dashboard.
"""

import os
import sys
import json
import sqlite3
import random
import tempfile
import shutil
from datetime import datetime, timedelta

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(CURRENT_DIR)
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

DB_FILE = os.path.join(CURRENT_DIR, "fraudshield.db")

def resolve_db_path():
    """Ensures database is in a writable location, copying to /tmp in read-only container environments."""
    db_dir = os.path.dirname(DB_FILE)
    try:
        if os.path.exists(DB_FILE):
            try:
                os.chmod(DB_FILE, 0o666)
            except Exception:
                pass
        test_file = os.path.join(db_dir, ".write_test")
        with open(test_file, "w") as f:
            f.write("ok")
        if os.path.exists(test_file):
            os.remove(test_file)
        return DB_FILE
    except Exception:
        tmp_db = os.path.join(tempfile.gettempdir(), "fraudshield.db")
        if not os.path.exists(tmp_db) and os.path.exists(DB_FILE):
            try:
                shutil.copy2(DB_FILE, tmp_db)
                os.chmod(tmp_db, 0o666)
            except Exception:
                pass
        return tmp_db

ACTIVE_DB_FILE = resolve_db_path()

# Path to PostgreSQL configuration:
# When migrating from SQLite prototype to production PostgreSQL:
# set DATABASE_URL=postgresql://user:password@hostname:5432/fraudshield
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{ACTIVE_DB_FILE}")


def get_connection():
    global ACTIVE_DB_FILE
    try:
        conn = sqlite3.connect(ACTIVE_DB_FILE, check_same_thread=False, timeout=15)
        conn.row_factory = sqlite3.Row
        return conn
    except sqlite3.OperationalError:
        tmp_db = os.path.join(tempfile.gettempdir(), "fraudshield.db")
        if ACTIVE_DB_FILE != tmp_db and os.path.exists(DB_FILE):
            try:
                shutil.copy2(DB_FILE, tmp_db)
            except Exception:
                pass
            ACTIVE_DB_FILE = tmp_db
            conn = sqlite3.connect(ACTIVE_DB_FILE, check_same_thread=False, timeout=15)
            conn.row_factory = sqlite3.Row
            return conn
        raise


def init_db():
    """Initializes the database schema and seeds initial transactions if empty."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        timestamp TEXT NOT NULL,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        amount REAL NOT NULL,
        currency TEXT DEFAULT 'USD',
        merchant_category TEXT NOT NULL,
        merchant_name TEXT NOT NULL,
        card_type TEXT NOT NULL,
        card_last4 TEXT NOT NULL,
        ip_country TEXT NOT NULL,
        billing_country TEXT NOT NULL,
        shipping_country TEXT NOT NULL,
        shipping_billing_match INTEGER NOT NULL,
        foreign_transaction INTEGER NOT NULL,
        distance_from_home_km REAL NOT NULL,
        tx_velocity_24h INTEGER NOT NULL,
        account_age_days INTEGER NOT NULL,
        failed_attempts_1h INTEGER NOT NULL,
        ip_risk_score REAL NOT NULL,
        device_type TEXT NOT NULL,
        browser TEXT NOT NULL,
        risk_score REAL NOT NULL,
        risk_tier TEXT NOT NULL,
        prediction_label TEXT NOT NULL,
        recommendation TEXT NOT NULL,
        decision_label TEXT NOT NULL,
        summary_explanation TEXT,
        top_risk_factors TEXT,
        protective_factors TEXT,
        status TEXT NOT NULL DEFAULT 'Approved',
        reviewer_notes TEXT DEFAULT '',
        reviewed_at TEXT,
        is_simulated INTEGER DEFAULT 0
    )
    """)

    cursor.execute("CREATE INDEX IF NOT EXISTS idx_txn_timestamp ON transactions(timestamp)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_txn_risk_tier ON transactions(risk_tier)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_txn_status ON transactions(status)")

    conn.commit()

    # Check if empty; if so, seed realistic baseline demo transactions
    cursor.execute("SELECT COUNT(*) FROM transactions")
    count = cursor.fetchone()[0]
    conn.close()

    if count == 0:
        print("[Database] Initializing baseline seed transactions...")
        seed_initial_transactions()


def row_to_dict(row):
    if row is None:
        return None
    d = dict(row)
    if "top_risk_factors" in d and d["top_risk_factors"]:
        try:
            d["top_risk_factors"] = json.loads(d["top_risk_factors"])
        except Exception:
            d["top_risk_factors"] = []
    else:
        d["top_risk_factors"] = []

    if "protective_factors" in d and d["protective_factors"]:
        try:
            d["protective_factors"] = json.loads(d["protective_factors"])
        except Exception:
            d["protective_factors"] = []
    else:
        d["protective_factors"] = []

    d["shipping_billing_match"] = bool(d.get("shipping_billing_match", 1))
    d["foreign_transaction"] = bool(d.get("foreign_transaction", 0))
    d["is_simulated"] = bool(d.get("is_simulated", 0))
    return d


def insert_transaction(txn: dict) -> dict:
    conn = get_connection()
    cursor = conn.cursor()

    top_risks = txn.get("top_risk_factors", [])
    if isinstance(top_risks, list):
        top_risks_json = json.dumps(top_risks)
    else:
        top_risks_json = json.dumps([])

    protective = txn.get("protective_factors", [])
    if isinstance(protective, list):
        protective_json = json.dumps(protective)
    else:
        protective_json = json.dumps([])

    cursor.execute("""
    INSERT INTO transactions (
        id, timestamp, customer_name, customer_email, amount, currency,
        merchant_category, merchant_name, card_type, card_last4,
        ip_country, billing_country, shipping_country,
        shipping_billing_match, foreign_transaction, distance_from_home_km,
        tx_velocity_24h, account_age_days, failed_attempts_1h, ip_risk_score,
        device_type, browser, risk_score, risk_tier,
        prediction_label, recommendation, decision_label, summary_explanation,
        top_risk_factors, protective_factors, status, reviewer_notes,
        reviewed_at, is_simulated
    ) VALUES (
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?
    )
    """, (
        txn["id"],
        txn.get("timestamp", datetime.utcnow().isoformat() + "Z"),
        txn.get("customer_name", "Anonymous Shopper"),
        txn.get("customer_email", "shopper@example.com"),
        float(txn.get("amount", 0.0)),
        txn.get("currency", "USD"),
        txn.get("merchant_category", "electronics"),
        txn.get("merchant_name", "CyberRetail Inc."),
        txn.get("card_type", "Visa"),
        str(txn.get("card_last4", "4242")),
        txn.get("ip_country", "US"),
        txn.get("billing_country", "US"),
        txn.get("shipping_country", "US"),
        1 if txn.get("shipping_billing_match", True) else 0,
        1 if txn.get("foreign_transaction", False) else 0,
        float(txn.get("distance_from_home_km", 10.0)),
        int(txn.get("tx_velocity_24h", 1)),
        int(txn.get("account_age_days", 90)),
        int(txn.get("failed_attempts_1h", 0)),
        float(txn.get("ip_risk_score", 0.05)),
        txn.get("device_type", "desktop"),
        txn.get("browser", "Chrome"),
        float(txn.get("risk_score", 0.0)),
        txn.get("risk_tier", "Low Risk"),
        txn.get("prediction_label", "Legitimate"),
        txn.get("recommendation", "APPROVE"),
        txn.get("decision_label", "Frictionless Pass"),
        txn.get("summary_explanation", ""),
        top_risks_json,
        protective_json,
        txn.get("status", "Approved"),
        txn.get("reviewer_notes", ""),
        txn.get("reviewed_at", None),
        1 if txn.get("is_simulated", False) else 0
    ))

    conn.commit()
    conn.close()
    return get_transaction_by_id(txn["id"])


def get_transaction_by_id(txn_id: str) -> dict | None:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM transactions WHERE id = ?", (txn_id,))
    row = cursor.fetchone()
    conn.close()
    return row_to_dict(row)


def update_transaction_status(txn_id: str, status: str, notes: str = "") -> dict | None:
    conn = get_connection()
    cursor = conn.cursor()
    now_str = datetime.utcnow().isoformat() + "Z"
    cursor.execute("""
    UPDATE transactions
    SET status = ?, reviewer_notes = ?, reviewed_at = ?
    WHERE id = ?
    """, (status, notes, now_str, txn_id))
    conn.commit()
    conn.close()
    return get_transaction_by_id(txn_id)


def get_transactions(
    risk_tier: str = None,
    status: str = None,
    search: str = None,
    min_amount: float = None,
    max_amount: float = None,
    limit: int = 50,
    offset: int = 0
):
    conn = get_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM transactions WHERE 1=1"
    params = []

    if risk_tier and risk_tier.lower() != "all":
        query += " AND LOWER(risk_tier) = LOWER(?)"
        params.append(risk_tier)

    if status and status.lower() != "all":
        query += " AND LOWER(status) = LOWER(?)"
        params.append(status)

    if min_amount is not None:
        query += " AND amount >= ?"
        params.append(min_amount)

    if max_amount is not None:
        query += " AND amount <= ?"
        params.append(max_amount)

    if search:
        search_like = f"%{search}%"
        query += " AND (id LIKE ? OR customer_name LIKE ? OR customer_email LIKE ? OR card_last4 LIKE ? OR merchant_name LIKE ?)"
        params.extend([search_like, search_like, search_like, search_like, search_like])

    # Count total matching
    count_query = query.replace("SELECT *", "SELECT COUNT(*)")
    cursor.execute(count_query, params)
    total_count = cursor.fetchone()[0]

    # Fetch ordered page
    query += " ORDER BY timestamp DESC LIMIT ? OFFSET ?"
    params.extend([limit, offset])

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    return [row_to_dict(r) for r in rows], total_count


def get_dashboard_overview():
    conn = get_connection()
    cursor = conn.cursor()

    # Total counts and sums
    cursor.execute("""
    SELECT 
        COUNT(*) as total_count,
        COALESCE(SUM(amount), 0) as total_volume,
        COALESCE(SUM(CASE WHEN risk_tier = 'High Risk' OR status IN ('Escalated', 'Rejected') THEN 1 ELSE 0 END), 0) as fraud_count,
        COALESCE(SUM(CASE WHEN risk_tier = 'High Risk' OR status IN ('Escalated', 'Rejected') THEN amount ELSE 0 END), 0) as suspicious_value,
        COALESCE(SUM(CASE WHEN risk_tier = 'Low Risk' THEN 1 ELSE 0 END), 0) as low_risk_count,
        COALESCE(SUM(CASE WHEN risk_tier = 'Medium Risk' THEN 1 ELSE 0 END), 0) as medium_risk_count,
        COALESCE(SUM(CASE WHEN risk_tier = 'High Risk' THEN 1 ELSE 0 END), 0) as high_risk_count,
        COALESCE(SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END), 0) as status_approved,
        COALESCE(SUM(CASE WHEN status = 'Under Review' THEN 1 ELSE 0 END), 0) as status_review,
        COALESCE(SUM(CASE WHEN status = 'Escalated' THEN 1 ELSE 0 END), 0) as status_escalated,
        COALESCE(SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END), 0) as status_rejected
    FROM transactions
    """)
    totals = dict(cursor.fetchone())

    total_count = totals["total_count"]
    fraud_count = totals["fraud_count"]
    fraud_rate = round((fraud_count / total_count * 100) if total_count > 0 else 0, 2)

    # Fraud by category
    cursor.execute("""
    SELECT 
        merchant_category as category,
        COUNT(*) as total,
        SUM(CASE WHEN risk_tier = 'High Risk' THEN 1 ELSE 0 END) as fraud_count,
        ROUND(COALESCE(SUM(CASE WHEN risk_tier = 'High Risk' THEN amount ELSE 0 END), 0), 2) as fraud_value
    FROM transactions
    GROUP BY merchant_category
    ORDER BY fraud_value DESC
    """)
    category_rows = [dict(r) for r in cursor.fetchall()]

    # Hourly Trend (aggregating transactions)
    cursor.execute("""
    SELECT 
        strftime('%H:00', timestamp) as hour_label,
        COUNT(*) as tx_volume,
        SUM(CASE WHEN risk_tier = 'High Risk' THEN 1 ELSE 0 END) as high_risk_count,
        SUM(CASE WHEN risk_tier = 'Medium Risk' THEN 1 ELSE 0 END) as medium_risk_count,
        SUM(CASE WHEN risk_tier = 'Low Risk' THEN 1 ELSE 0 END) as low_risk_count
    FROM transactions
    GROUP BY hour_label
    ORDER BY hour_label ASC
    LIMIT 24
    """)
    hourly_trend = [dict(r) for r in cursor.fetchall()]

    # Recent flagged transactions
    cursor.execute("""
    SELECT * FROM transactions 
    WHERE risk_tier IN ('Medium Risk', 'High Risk') OR status IN ('Under Review', 'Escalated', 'Rejected')
    ORDER BY timestamp DESC
    LIMIT 8
    """)
    flagged_rows = [row_to_dict(r) for r in cursor.fetchall()]

    conn.close()

    return {
        "kpis": {
            "total_analyzed": total_count,
            "fraud_detected": fraud_count,
            "fraud_rate_pct": fraud_rate,
            "total_suspicious_value": round(totals["suspicious_value"], 2),
            "total_volume_processed": round(totals["total_volume"], 2),
            "risk_breakdown": {
                "low": totals["low_risk_count"],
                "medium": totals["medium_risk_count"],
                "high": totals["high_risk_count"]
            },
            "status_breakdown": {
                "approved": totals["status_approved"],
                "under_review": totals["status_review"],
                "escalated": totals["status_escalated"],
                "rejected": totals["status_rejected"]
            }
        },
        "category_breakdown": category_rows,
        "hourly_trend": hourly_trend,
        "recent_flagged": flagged_rows
    }


def seed_initial_transactions():
    """Seeds 60 realistic transactions (some safe, some suspicious, some critical fraud) for immediate demo readiness."""
    from backend.ml.explainer import predict_and_explain

    merchants = {
        "electronics": ["Apex Tech Store", "Nova Gadgets", "Volt Electro Mart"],
        "luxury_jewelry": ["Aura Jewels", "Grand Horology", "Sovereign Diamonds"],
        "digital_goods": ["Nexus Gaming Hub", "StreamCloud Global", "BitGift Express"],
        "fashion": ["Urban Threads", "Velvet & Silk", "Nordic Wardrobe"],
        "grocery": ["FreshCart Organic", "Metro Foods", "PantryPrime"],
        "home_goods": ["Haven Living", "Modena Home", "Timber & Stone"],
        "travel": ["SkyWing Air", "Voyager Booking", "Starlight Resorts"]
    }

    now = datetime.utcnow()
    demo_cases = [
        # 1. Critical fraud attack: High value, foreign proxy, fast velocity, midnight, new account
        {
            "amount": 2499.99,
            "merchant_category": "electronics",
            "hour_of_day": 3,
            "device_type": "bot_proxy",
            "browser": "Tor_Browser",
            "shipping_billing_match": 0,
            "foreign_transaction": 1,
            "distance_from_home_km": 7240.0,
            "tx_velocity_24h": 12,
            "account_age_days": 2,
            "failed_attempts_1h": 4,
            "ip_risk_score": 0.96,
            "customer_name": "Viktor Kozlov",
            "customer_email": "v.kozlov92@protonmail.com",
            "card_type": "Visa",
            "card_last4": "8812",
            "billing_country": "US",
            "shipping_country": "RU",
            "status": "Escalated",
            "reviewer_notes": "Immediate escalation: Tor exit node detected with 12 velocity bursts.",
            "is_simulated": 1
        },
        # 2. Luxury Jewelry proxy spree
        {
            "amount": 3850.00,
            "merchant_category": "luxury_jewelry",
            "hour_of_day": 2,
            "device_type": "desktop",
            "browser": "Firefox",
            "shipping_billing_match": 0,
            "foreign_transaction": 1,
            "distance_from_home_km": 5400.0,
            "tx_velocity_24h": 8,
            "account_age_days": 1,
            "failed_attempts_1h": 2,
            "ip_risk_score": 0.88,
            "customer_name": "Elena Rostova",
            "customer_email": "elena.r33@securemail.org",
            "card_type": "Mastercard",
            "card_last4": "3319",
            "billing_country": "US",
            "shipping_country": "NG",
            "status": "Rejected",
            "reviewer_notes": "Rejected by automated risk rule. Address mismatch and luxury order.",
            "is_simulated": 1
        },
        # 3. Card testing micro-charges
        {
            "amount": 12.99,
            "merchant_category": "digital_goods",
            "hour_of_day": 4,
            "device_type": "bot_proxy",
            "browser": "Chrome",
            "shipping_billing_match": 1,
            "foreign_transaction": 1,
            "distance_from_home_km": 3900.0,
            "tx_velocity_24h": 22,
            "account_age_days": 1,
            "failed_attempts_1h": 5,
            "ip_risk_score": 0.94,
            "customer_name": "David Sterling",
            "customer_email": "d.sterl@tempmail.io",
            "card_type": "Visa",
            "card_last4": "1044",
            "billing_country": "GB",
            "shipping_country": "GB",
            "status": "Under Review",
            "reviewer_notes": "Suspected card testing bot script with 22 hits in 24h.",
            "is_simulated": 1
        },
        # 4. Borderline Medium Risk: Travel booking with international IP but older account
        {
            "amount": 850.00,
            "merchant_category": "travel",
            "hour_of_day": 19,
            "device_type": "mobile",
            "browser": "Safari",
            "shipping_billing_match": 1,
            "foreign_transaction": 1,
            "distance_from_home_km": 1850.0,
            "tx_velocity_24h": 3,
            "account_age_days": 420,
            "failed_attempts_1h": 1,
            "ip_risk_score": 0.45,
            "customer_name": "Sarah Jenkins",
            "customer_email": "sarah.jenkins@gmail.com",
            "card_type": "Amex",
            "card_last4": "7002",
            "billing_country": "US",
            "shipping_country": "US",
            "status": "Under Review",
            "reviewer_notes": "Account holder traveling abroad. 3DS verification requested.",
            "is_simulated": 1
        }
    ]

    # Generate 50 safe legitimate shopping transactions
    safe_names = [
        ("Michael", "Scott"), ("Pam", "Beesly"), ("Jim", "Halpert"), ("Dwight", "Schrute"),
        ("Angela", "Martin"), ("Stanley", "Hudson"), ("Phyllis", "Vance"), ("Oscar", "Martinez"),
        ("Kevin", "Malone"), ("Toby", "Flenderson"), ("Kelly", "Kapoor"), ("Ryan", "Howard"),
        ("Andy", "Bernard"), ("Erin", "Hannon"), ("Darryl", "Philbin"), ("Meredith", "Palmer")
    ]

    for i in range(50):
        first, last = random.choice(safe_names)
        cat = random.choice(list(merchants.keys()))
        amt = round(float(random.uniform(18.0, 320.0)), 2)
        demo_cases.append({
            "amount": amt,
            "merchant_category": cat,
            "hour_of_day": random.randint(8, 22),
            "device_type": random.choice(["desktop", "mobile"]),
            "browser": random.choice(["Chrome", "Safari", "Edge"]),
            "shipping_billing_match": 1 if random.random() < 0.95 else 0,
            "foreign_transaction": 0,
            "distance_from_home_km": round(float(random.uniform(1.5, 45.0)), 1),
            "tx_velocity_24h": random.randint(1, 3),
            "account_age_days": random.randint(60, 850),
            "failed_attempts_1h": 0,
            "ip_risk_score": round(float(random.uniform(0.01, 0.15)), 3),
            "customer_name": f"{first} {last}",
            "customer_email": f"{first.lower()}.{last.lower()}@gmail.com",
            "card_type": random.choice(["Visa", "Mastercard", "Amex"]),
            "card_last4": str(random.randint(1000, 9999)),
            "billing_country": "US",
            "shipping_country": "US",
            "status": "Approved",
            "reviewer_notes": "",
            "is_simulated": 1
        })

    # Shuffle and insert
    random.shuffle(demo_cases)
    for idx, case in enumerate(demo_cases):
        time_offset = timedelta(minutes=random.randint(5, 1440))
        txn_time = (now - time_offset).isoformat() + "Z"
        txn_id = f"TXN-{random.randint(100000, 999999)}"

        analysis = predict_and_explain(case)

        m_name = random.choice(merchants.get(case["merchant_category"], ["General Store"]))

        record = {
            "id": txn_id,
            "timestamp": txn_time,
            "customer_name": case["customer_name"],
            "customer_email": case["customer_email"],
            "amount": case["amount"],
            "currency": "USD",
            "merchant_category": case["merchant_category"],
            "merchant_name": m_name,
            "card_type": case["card_type"],
            "card_last4": case["card_last4"],
            "ip_country": case.get("billing_country", "US"),
            "billing_country": case["billing_country"],
            "shipping_country": case["shipping_country"],
            "shipping_billing_match": case["shipping_billing_match"],
            "foreign_transaction": case["foreign_transaction"],
            "distance_from_home_km": case["distance_from_home_km"],
            "tx_velocity_24h": case["tx_velocity_24h"],
            "account_age_days": case["account_age_days"],
            "failed_attempts_1h": case["failed_attempts_1h"],
            "ip_risk_score": case["ip_risk_score"],
            "device_type": case["device_type"],
            "browser": case["browser"],
            "risk_score": analysis["risk_score"],
            "risk_tier": analysis["risk_tier"],
            "prediction_label": analysis["prediction_label"],
            "recommendation": analysis["recommendation"],
            "decision_label": analysis["decision_label"],
            "summary_explanation": analysis["summary_explanation"],
            "top_risk_factors": analysis["top_risk_factors"],
            "protective_factors": analysis["protective_factors"],
            "status": case.get("status", "Approved" if analysis["risk_tier"] == "Low Risk" else "Under Review"),
            "reviewer_notes": case.get("reviewer_notes", ""),
            "is_simulated": 1
        }

        insert_transaction(record)

    print(f"[Database] Seeded {len(demo_cases)} transactions.")


if __name__ == "__main__":
    init_db()
    overview = get_dashboard_overview()
    print("[Database] Overview KPI Sample:", overview["kpis"])
