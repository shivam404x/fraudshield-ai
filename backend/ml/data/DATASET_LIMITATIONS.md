# Dataset Methodology & Production Limitations Documentation
**Project:** FraudShield AI — Intelligent E-commerce Fraud Detection System  
**Hackathon:** Deep Data Hackathon 2026 — Track: E-commerce Transaction Fraud Detection  

---

## 1. Executive Summary & Context
In benchmark research, public datasets such as the **Credit Card Fraud Detection dataset (ULB Machine Learning Group)** are widely cited. However, directly applying ULB-style datasets to production e-commerce environments presents critical domain gaps that every competitive data science team must acknowledge:

1. **Feature Anonymization vs. Semantic Domain Signals**:
   - The ULB dataset utilizes Principal Component Analysis (PCA) transformations yielding 28 anonymized mathematical dimensions ($V_1$ to $V_{28}$).
   - While effective for abstract linear benchmarking, PCA removes rich **e-commerce domain primitives** essential for risk triage: shipping vs. billing address verification, IP reputation scores, device fingerprinting, card-not-present velocity, and merchant category risk.
2. **Context-Specific Attack Vectors**:
   - E-commerce fraud involves account takeovers (ATO), synthetic identities, card testing micro-transactions, and foreign freight-forwarding scams that depend heavily on velocity and geolocation attributes.

To solve this for the **Deep Data Hackathon 2026**, **FraudShield AI** couples public credit card transaction statistical properties (such as severe class imbalance, heavy-tailed spending amounts, and temporal clustering) with **ground-truth e-commerce behavioral signals**.

---

## 2. Dataset Composition & Benchmark Structure
- **Dataset Source:** Official IEEE-CIS E-Commerce Fraud Detection Benchmark.
- **Labeled Training Set:** 80,000 transactions (`train_transaction.csv` joined with `train_identity.csv` on `TransactionID`).
- **Held-Out Test Set:** Exactly 20,000 transactions (`test_transaction.csv` joined with `test_identity.csv`), preserving original row count and ID sequence.
- **Validation Strategy:** Strict chronological out-of-time split (80% train / 20% validation on `TransactionDT`, zero temporal overlap).
- **Validation Size:** 16,000 held-out transactions (15,580 legitimate, 420 fraudulent; 2.625% minority fraud rate).
- **Feature Space:** 437 total engineered and preprocessed features across payment, identity, temporal, and device dimensions.

### Primary Feature Dimensions & Domain Primitives
| Feature Dimension | Source Attributes | Domain & Behavioral Relevance |
| :--- | :--- | :--- |
| **Transaction Amount** | `TransactionAmt`, `TransactionAmt_log`, decimal component | Financial magnitude; high values in liquid resale categories indicate asset extraction. |
| **Temporal Dynamics** | `TransactionDT`, `Transaction_hour`, `Transaction_day` | Time-step ordering; nocturnal off-peak hours reflect cardholder inactivity windows. |
| **Card & Identity** | `card1`–`card6`, `addr1`, `dist1`, `P_emaildomain` | Issuing bank risk clusters, billing region, geographical proxy, and email reputation. |
| **Network & Device** | `DeviceInfo`, `DeviceType`, `id_01`–`id_38` | Hardware fingerprinting, operating systems, proxy/Tor exit node identification. |
| **Velocity & Delta** | `C1`–`C14`, `D1`–`D15` | Rolling purchase frequencies and elapsed days between card events. |

---

## 3. Explicit Model & Dataset Limitations
In accordance with ethical AI standards and hackathon requirements:

1. **Probabilistic Risk vs. Absolute Guilt**:
   - **Crucial Rule:** High model risk score ($\ge 75/100$) indicates **elevated statistical anomaly**, **never proof of fraud**. Legitimate shoppers who travel internationally or ship holiday gifts to relatives must not be permanently branded fraudulent.
   - The platform enforces an **intervention tier** (Step-Up 2FA / 3D-Secure 2.0) rather than immediate irreversible account cancellation.
2. **Concept Drift & Adversarial Adaptation**:
   - Fraudsters evolve tactics when automated rules detect specific amounts or velocities. Offline-trained models without online retraining will degrade over time.
3. **Simulated Streams vs. Production Feeds**:
   - The live simulation feed (`/api/simulate/single`) is explicitly labeled as test data (`is_simulated = 1`) to demonstrate reactive UI handling under simulated traffic bursts without misrepresenting synthetic data as real production traffic.
