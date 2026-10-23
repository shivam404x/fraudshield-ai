# FraudShield AI — Intelligent E-commerce Fraud Detection System
> **Deep Data Hackathon 2026 — Problem Statement 3 (PS3): E-commerce Transaction Fraud Detection**  
> Autonomous, Explainable Machine Learning Platform for Real-Time Payment Risk Scoring & Forensic Audit Triage.

[![FastAPI](https://img.shields.io/badge/FastAPI-0.161.0-009688.svg?style=flat&logo=FastAPI&logoColor=white)](https://fastapi.tiangolo.com)
[![Scikit-Learn](https://img.shields.io/badge/scikit--learn-1.7.2-F7931E.svg?style=flat&logo=scikit-learn&logoColor=white)](https://scikit-learn.org)
[![React](https://img.shields.io/badge/React-19.2-61DAFB.svg?style=flat&logo=React&logoColor=black)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/shivam404x/fraudshield-ai)

---

## 1. Executive Summary & Problem Statement

In 2026, global e-commerce merchants lose over **$48 Billion annually** to online payment fraud. The rise of automated botnets, proxy rotations, and credential stuffing attacks makes traditional rule-based filters (such as static velocity checks or IP blacklists) increasingly brittle.

Worse, crude rule systems create devastating **false declines**: legitimate shoppers whose cards are blocked when traveling or ordering gifts. Research reveals that merchants lose **$3.00 in customer lifetime value** for every $1.00 of fraud avoided.

**FraudShield AI** solves both challenges by combining:
1. **Balanced Ensemble Machine Learning:** Cost-sensitive Random Forest trained to overcome extreme 1:37 class imbalance.
2. **Sub-15ms Real-Time Inference:** Continuous scoring returning calibrated **0–100 Fraud Risk Probabilities**.
3. **Explainable AI (XAI):** Local factor attribution decomposing why transactions are flagged (+36% Proxy IP, +30% Velocity burst).
4. **Dynamic Tiered Intervention:** Low risk passes friction-free, medium risk triggers 3D-Secure 2.0 / OTP, and high risk routes to forensic investigator queues.
5. **Persistent Audit Ledger:** Thread-safe SQLite transactional database with documented migration to PostgreSQL.

---

## 2. System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FRAUDSHIELD AI ARCHITECTURE                     │
└────────────────────────────────────────────────────────────────────────┘

 [ Real-Time Customer Checkout / Simulated Live Feed ]
                         │
                         ▼
        ┌───────────────────────────────────┐
        │       React 19 + Vite UI          │
        │  • Dark Navy Cyber Dashboard      │
        │  • Recharts Visualizations        │
        │  • Forensic Inspection Modal      │
        │  • Interactive Fraud Sandbox      │
        └─────────────────┬─────────────────┘
                          │ HTTP REST / Proxy
                          ▼
        ┌───────────────────────────────────┐
        │      FastAPI Python Server        │
        │  • Async Endpoints (port 8000)    │
        │  • Pydantic Request Validation    │
        │  • CORS & Error Middleware        │
        └───────┬───────────────────┬───────┘
                │                   │
                ▼                   ▼
  ┌────────────────────────┐  ┌────────────────────────┐
  │   ML & XAI Engine      │  │ SQLite Audit Ledger    │
  │ • StandardScaler       │  │ • Transaction History  │
  │ • OneHotEncoder        │  │ • Risk Scores & Status │
  │ • Balanced RF Model    │  │ • Analyst Review Notes │
  │ • Local Attribution    │  │ • Postgres Ready URL   │
  └────────────────────────┘  └────────────────────────┘
```

---

## 3. Machine Learning & Data Science Methodology

### Realistic E-commerce Benchmark Dataset
**FraudShield AI** models the official IEEE-CIS E-Commerce Transaction Fraud Detection dataset (80,000 labeled training transactions, 20,000 held-out test transactions, 437 features):
- **Financial Signals:** `TransactionAmt` (log-transformed & decimal component), Product Category (`ProductCD`).
- **Card & Identity Telemetry:** Card types (`card1`–`card6`), Address Verification Service (`addr1`), Distance proxy (`dist1`).
- **Temporal Patterns:** Continuous time-step (`TransactionDT`), calculated transaction hour & day of week.
- **Network & Device Telemetry:** High-cardinality device frequency (`DeviceInfo`), operating system (`DeviceType`), IP risk indicators (`id_01`–`id_38`).
- **Velocity Metrics:** Rolling counts and behavioral velocity columns (`C1`–`C14`, `D1`–`D15`).

### Class Imbalance Handling
- **Prevalence:** Highly skewed real-world minority fraud distribution (~2.6%–3.5% fraud rate).
- **Mitigation:** Strict chronological out-of-time train-validation split (80% train / 20% validation on `TransactionDT`, zero time overlap) + `class_weight='balanced'` in `HistGradientBoostingClassifier`.

### Authentic Evaluation Results (Held-Out 20% Chronological Test Split: 16,000 Tx)
| Metric | Value | Technical Relevance |
| :--- | :--- | :--- |
| **AUROC (ROC-AUC)** | **0.89878 (89.88%)** | High discriminative separability on unseen future time horizon |
| **AUPRC (PR-AUC)** | **0.55792 (55.79%)** | Primary benchmark metric directly penalizing false positive classifications |
| **Accuracy (thresh=0.5)** | **97.18%** | Total classification accuracy across 16,000 holdout transactions |
| **F1-Score (thresh=0.5)** | **51.14%** | Harmonic mean of precision (46.92%) and recall (56.19%) at 0.5 threshold |
| **Optimal F1-Score** | **56.04%** | Reached at calibrated optimal threshold of 0.66 |

### Confusion Matrix (Chronological Holdout: 16,000 Transactions)
- **True Negatives (TN):** `15,313` — Legitimate checkouts passed without friction.
- **False Positives (FP):** `267` — Legitimate customers flagged for review (only 1.7% FPR out of 15,580 legitimate).
- **False Negatives (FN):** `184` — Stealth fraud transactions missed by initial threshold.
- **True Positives (TP):** `236` — High-risk fraud attacks successfully intercepted.

### Top Feature Importances (Gini Impurity / Permutation)
1. `TransactionAmt_log` (13.8%) — Normalized financial scale of purchase.
2. `C1` / `C13` (11.4% / 9.3%) — Rolling transaction velocity metrics.
3. `card1` / `card2` (8.4% / 7.4%) — Cardholder profile and issuing bank risk clustering.
4. `addr1` / `dist1` (6.3% / 5.7%) — Billing address and geographical proximity.
5. `Transaction_hour` (5.0%) — Nocturnal and off-peak purchase window patterns.

---

## 4. Key Application Features

1. **Cybersecurity Executive Dashboard:**
   - Real-time KPIs: Transactions Analyzed, Fraud Count, Protected Capital ($), Model F1-Score.
   - Interactive Recharts: 24-hour volume trend, risk distribution donut, suspicious exposure by product category, analyst status funnel.
   - Real-time telemetry feed controls (speed intervals, attack rate bias).

2. **Live Transaction Monitoring Ledger:**
   - Multi-parameter search (ID, customer name, email, card last 4, merchant).
   - Filtering by Risk Tier (Low, Medium, High) and Review Status (Approved, Under Review, Escalated, Rejected).
   - Clear labeling of simulated vs. live checkout events.
   - Direct inline triage buttons (Approve, Escalate, Reject).

3. **Interactive Forensic Inspector (Modal):**
   - Detailed radial gauge meter (0–100).
   - Local Explainable AI (XAI) breakdown with weighted impact bars (+36% Proxy IP, +28% Velocity).
   - Mitigating protective factors (-15% Verified Billing Match).
   - Full device, IP, and cardholder audit records with analyst note persistence.

4. **AI Fraud Sandbox & Live Predictor:**
   - Interactive input form for testing custom parameters.
   - 1-click preset scenarios: *Normal Shopper*, *Midnight Electronics Rush*, *Foreign Luxury Spree*, *Card Testing Bot*, *Traveling Executive*.
   - Instant ML scoring with option to commit directly into the live audit ledger.

5. **Model Trust & Hackathon Blueprint Center:**
   - Transparent scikit-learn metrics display.
   - Documented limitations regarding public datasets, class imbalance, and why ML scores are probabilistic rather than definitive proof.

---

## 5. Quick Start & Setup Instructions

### Prerequisites
- **Node.js:** v18+ (tested on v20+)
- **Python:** v3.10+ with pip

### Step 1: Install Python ML & Backend Dependencies
```bash
pip install scikit-learn imbalanced-learn pandas numpy fastapi uvicorn pydantic httpx pytest
```

### Step 2: Install Frontend Dependencies
```bash
npm install
```

### Step 3: Run Reproducible Machine Learning Pipeline & Verification
```bash
# Executes end-to-end training, chronological validation, model retraining, and generates submission.csv:
python backend/ml/train_pipeline.py

# Verifies all 24 evaluation and submission integrity criteria:
python scripts/verify_results.py
```

### Step 4: Run Automated Tests & Full System Audit
```bash
# Run backend pytest suite (9 passed, 0 failed):
python -m pytest backend/tests/test_api.py -v

# Run the comprehensive 6-module Hackathon Readiness Audit:
python scripts/hackathon_audit.py
```

### Step 5: Start the Application

#### Option A: Full Production Gateway (Frontend + Backend on port 5000)
```bash
npm run build
npm start
```
- Open your browser at: **`http://127.0.0.1:5000`**
- FastAPI interactive Swagger documentation: **`http://127.0.0.1:5000/docs`**

#### Option B: Independent Development Servers
```bash
# Terminal 1 (Python FastAPI Backend):
python backend/run_server.py

# Terminal 2 (Vite Hot-Reloading Frontend):
npm run dev
```
- Open Vite dev server at: **`http://127.0.0.1:5173`**

---

## 6. REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | System health, loaded ML model status, SQLite connectivity |
| `GET` | `/api/metrics` | Genuine scikit-learn evaluation metrics, confusion matrix, feature importances |
| `GET` | `/api/overview` | Aggregated dashboard KPIs, hourly trends, category breakdown |
| `GET` | `/api/transactions` | Paginated & filtered transaction ledger |
| `GET` | `/api/transactions/{id}` | Full transaction details and forensic XAI breakdown |
| `POST` | `/api/analyze` | Evaluates a transaction through ML model, computes 0-100 risk score, returns XAI factors |
| `POST` | `/api/transactions/{id}/status` | Updates analyst review status (Approved, Under Review, Escalated, Rejected) |
| `POST` | `/api/simulate/single` | Generates a single labeled simulated transaction event |
| `GET` | `/api/dataset/limitations` | Returns dataset methodology and production limitations markdown |

---

## 7. Ethical AI Compliance & Safeguards

> [!IMPORTANT]
> **Probabilistic Risk vs. Absolute Guilt:**  
> FraudShield AI strictly enforces that high risk scores ($\ge 75/100$) represent **statistical anomalies against baseline distributions**, never deterministic proof of fraudulent intent. The platform enforces an intervention tier (Step-Up 3D-Secure 2.0 / OTP verification) rather than immediate irreversible account cancellation, protecting legitimate traveling customers.

---

## 8. Technology Stack

- **Frontend:** React 19, Vite, Tailwind CSS, Lucide React, Recharts
- **Backend:** Python 3.10+, FastAPI, Uvicorn, Pydantic
- **Machine Learning:** Scikit-learn 1.7.2, Imbalanced-learn, Pandas, NumPy, Joblib
- **Database:** SQLite3 (with clean migration path to PostgreSQL via `DATABASE_URL`)
- **Testing:** Pytest / Python Automated Test Client

---

## 9. Hackathon Credentials

- **Project:** FraudShield AI — Intelligent E-commerce Fraud Detection System
- **Event:** Deep Data Hackathon 2026
- **Track:** E-commerce Transaction Fraud Detection
