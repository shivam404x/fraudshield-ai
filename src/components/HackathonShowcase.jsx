import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Layers, 
  Cpu, 
  ShieldAlert, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight, 
  Database, 
  Server, 
  Layout, 
  GitBranch, 
  Activity, 
  FileText,
  Lock,
  Compass
} from 'lucide-react';
import { api } from '../services/api';

export default function HackathonShowcase({ onNavigateToAnalyzer }) {
  const [limitationsContent, setLimitationsContent] = useState('');

  useEffect(() => {
    api.getLimitations().then(res => {
      if (res && res.content) {
        setLimitationsContent(res.content);
      }
    }).catch(() => {});
  }, []);

  return (
    <div className="space-y-12 py-6 max-w-5xl mx-auto">
      
      {/* Title Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          <span>Hackathon Presentation & Architecture Blueprint</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          FraudShield AI — System Design & Methodology
        </h1>
        <p className="text-slate-600 text-sm max-w-2xl mx-auto">
          Deep Data Hackathon 2026 — Problem Statement 3 (PS3): E-Commerce Transaction Fraud Detection
        </p>
      </div>

      {/* Section 1: Problem Statement */}
      <section className="fintech-card rounded-3xl p-8 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider">
              1. The Problem Statement & Industry Reality
            </h2>
            <p className="text-xs text-slate-500">The $48 Billion Crisis in Digital Commerce</p>
          </div>
        </div>

        <p className="text-sm text-slate-700 leading-relaxed">
          Modern e-commerce has grown exponentially, yet global merchants lose over <strong>$48 Billion annually</strong> to online payment fraud. The core challenge stems from card-not-present (CNP) transactions, where fraudsters leverage credential stuffing, proxy rotations, and stolen credit card numbers to simulate legitimate shopper behavior.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 className="text-xs font-bold text-slate-900 mb-1">Traditional Rule-Based Vulnerability</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Static velocity and country-code rules fail against botnets that disperse hits across different IP addresses, leaving merchants exposed to chargeback penalties and merchant account termination.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 className="text-xs font-bold text-slate-900 mb-1">The Destructive False Decline Tax</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              When overzealous rules decline genuine cardholders who are simply traveling or shipping gifts, 33% of shoppers abandon the brand forever. Merchants sacrifice $3 in lifetime customer value for every $1 in fraud averted.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: System Architecture Diagram */}
      <section className="fintech-card rounded-3xl p-8 space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider">
              2. End-to-End System Architecture
            </h2>
            <p className="text-xs text-slate-500">Full-Stack Data Flow & Service Integration</p>
          </div>
        </div>

        {/* Visual Architecture Flow */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs overflow-x-auto text-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            
            <div className="p-4 rounded-xl bg-white border border-blue-200 shadow-sm flex flex-col justify-between">
              <div>
                <Layout className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="font-bold text-slate-900 text-xs">React Frontend</div>
                <div className="text-[10px] text-slate-500 mt-1">Vite + Tailwind CSS + Recharts</div>
              </div>
              <div className="mt-3 text-[10px] text-blue-700 bg-blue-50 py-1 rounded font-bold">
                UI & Telemetry Stream
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-indigo-200 shadow-sm flex flex-col justify-between">
              <div>
                <Server className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                <div className="font-bold text-slate-900 text-xs">FastAPI REST API</div>
                <div className="text-[10px] text-slate-500 mt-1">Uvicorn + Pydantic + CORS</div>
              </div>
              <div className="mt-3 text-[10px] text-indigo-700 bg-indigo-50 py-1 rounded font-bold">
                Sub-15ms Async Endpoints
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-purple-200 shadow-sm flex flex-col justify-between">
              <div>
                <Cpu className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <div className="font-bold text-slate-900 text-xs">ML & XAI Engine</div>
                <div className="text-[10px] text-slate-500 mt-1">Scikit-learn + Imblearn</div>
              </div>
              <div className="mt-3 text-[10px] text-purple-700 bg-purple-50 py-1 rounded font-bold">
                0–100 Calibrated Risk Score
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-emerald-200 shadow-sm flex flex-col justify-between">
              <div>
                <Database className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                <div className="font-bold text-slate-900 text-xs">Audit Ledger (SQLite)</div>
                <div className="text-[10px] text-slate-500 mt-1">Thread-Safe (Postgres Ready)</div>
              </div>
              <div className="mt-3 text-[10px] text-emerald-700 bg-emerald-50 py-1 rounded font-bold">
                Audited Decision History
              </div>
            </div>

          </div>

          <div className="mt-6 text-center text-slate-500 text-[11px] font-sans">
            Payment Event → FastAPI Ingestion → Preprocessing & Feature Scaling → Balanced RF Classifier → Local XAI Decomposition → Persistent Audit Ledger → Live React Dashboard
          </div>
        </div>
      </section>

      {/* Section 3: Machine Learning & XAI Methodology */}
      <section className="fintech-card rounded-3xl p-8 space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-200">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider">
              3. Machine Learning & Explainable AI (XAI)
            </h2>
            <p className="text-xs text-slate-500">Data Science Formulation & Attribution Algorithm</p>
          </div>
        </div>

        <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
          <p>
            The core predictive engine is a <strong>Cost-Sensitive Balanced Random Forest Classifier</strong> trained on 14,000 transactions representing real e-commerce distributions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-blue-700 uppercase">1. Feature Engineering (13 Signals)</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li><strong className="text-slate-800">Financial:</strong> Amount ($), Resale Category Liquidity</li>
                <li><strong className="text-slate-800">Temporal:</strong> Hour of Day (01:00-04:00 nocturnal window)</li>
                <li><strong className="text-slate-800">Identity:</strong> Address Verification (AVS match), Account Age</li>
                <li><strong className="text-slate-800">Network:</strong> IP Threat Score, Distance from billing address</li>
                <li><strong className="text-slate-800">Velocity:</strong> 24h Purchase Count, 1h Failed CVVs</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-purple-700 uppercase">2. Explainable AI (XAI) Formula</h4>
              <p className="text-slate-600 leading-relaxed">
                Rather than an opaque binary output, FraudShield calculates a composite risk index:
              </p>
              <div className="p-2.5 rounded bg-white border border-purple-200 font-mono text-[11px] text-purple-800 font-bold">
                Risk = (P_model × 0.70) + Σ(Impact_weights) - Mitigations
              </div>
              <p className="text-slate-600 text-[11px]">
                Enables clear, human-understandable explanations (+36% Proxy IP, +30% Velocity burst) for fraud compliance analysts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Dataset Limitations & Ethical AI */}
      <section className="fintech-card rounded-3xl p-8 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider">
              4. Dataset Limitations & Ethical AI Safeguards
            </h2>
            <p className="text-xs text-slate-500">Rigorous Hackathon Compliance</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-slate-700 space-y-2">
          <div className="flex items-center space-x-2 text-amber-900 font-bold">
            <Lock className="w-4 h-4 text-amber-700" />
            <span>Core Ethical Principle: Never Conclude Guilt Deterministically</span>
          </div>
          <p className="leading-relaxed text-slate-600">
            FraudShield AI strictly enforces that high risk scores are <strong>probabilistic signals</strong>, not legal verdicts. A high score flags elevated statistical deviation (such as purchasing during international vacation). The system routes transactions to friction-right interventions (3D-Secure 2.0 / OTP challenge) rather than automatic unappealable bans.
          </p>
        </div>

        {limitationsContent && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 max-h-60 overflow-y-auto font-mono text-[11px] text-slate-600 whitespace-pre-wrap">
            {limitationsContent}
          </div>
        )}
      </section>

      {/* Section 5: Future Production Scope */}
      <section className="fintech-card rounded-3xl p-8 space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider">
              5. Production Roadmap & Future Scope
            </h2>
            <p className="text-xs text-slate-500">Scaling from Prototype to Multi-Billion Dollar Enterprise</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h3 className="font-bold text-emerald-800 uppercase">1. Distributed Streaming</h3>
            <p className="text-slate-600 mt-1 leading-relaxed">
              Replace prototype HTTP polling with Apache Kafka / RabbitMQ consumer pipelines capable of analyzing 50,000+ transactions per second.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h3 className="font-bold text-emerald-800 uppercase">2. Graph Neural Networks</h3>
            <p className="text-slate-600 mt-1 leading-relaxed">
              Integrate Neo4j / GNNs to uncover organized fraud syndicates sharing stolen device fingerprints and mule bank accounts across merchants.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h3 className="font-bold text-emerald-800 uppercase">3. Online Drift Retraining</h3>
            <p className="text-slate-600 mt-1 leading-relaxed">
              Automated concept drift detection pipelines that retrain models weekly against emerging attack archetypes without system downtime.
            </p>
          </div>
        </div>

        <div className="text-center pt-4">
          <button
            onClick={onNavigateToAnalyzer}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition"
          >
            <span>Run the Live Demonstration in the Sandbox</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
}
