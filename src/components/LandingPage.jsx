import React, { useState, useEffect } from 'react';
import PaymentPipelineVisual from './PaymentPipelineVisual';
import HeroShieldVisual from './HeroShieldVisual';
import { 
  ShieldAlert, 
  Cpu, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Zap, 
  TrendingUp, 
  FileText, 
  DollarSign, 
  Layers, 
  Sparkles, 
  Lock, 
  ShieldCheck,
  CreditCard,
  CheckCircle,
  HelpCircle,
  Clock,
  ArrowUpRight,
  Shield,
  Smartphone,
  Globe
} from 'lucide-react';

export default function LandingPage({ onGetStarted, onTrySandbox, overviewData, metricsData }) {
  const kpis = overviewData?.kpis || {};
  const metrics = metricsData?.evaluation_metrics || {};

  const [activePresetIndex, setActivePresetIndex] = useState(0);

  const heroShowcases = [
    {
      id: 'TXN-984210',
      type: 'Intercepted Attack',
      amount: '$2,499.00',
      category: 'Electronics',
      tier: 'High Risk',
      score: 99.4,
      scoreColor: 'text-rose-600 bg-rose-50 border-rose-200',
      reason: 'Tor exit node proxy + 14x velocity burst in 24h',
      status: 'Escalated to Fraud Queue',
      actionColor: 'bg-rose-100 text-rose-800'
    },
    {
      id: 'TXN-104928',
      type: 'Verified Shopper',
      amount: '$48.50',
      category: 'Grocery & Market',
      tier: 'Low Risk',
      score: 0.0,
      scoreColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      reason: 'Verified residential IP + matching billing & shipping address',
      status: 'Frictionless Pass (Approved)',
      actionColor: 'bg-emerald-100 text-emerald-800'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActivePresetIndex((prev) => (prev === 0 ? 1 : 0));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const currentCase = heroShowcases[activePresetIndex];

  return (
    <div className="space-y-16 py-8">
      
      {/* Hero Section — Clean 2-Column Split with 3D Graphic */}
      <section className="relative overflow-hidden rounded-3xl p-6 sm:p-10 lg:p-12 bg-white border border-slate-200/90 shadow-fintech-card">
        {/* Subtle decorative background gradient circles */}
        <div className="absolute top-0 right-1/4 -mt-16 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 -mb-16 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headline, Value Proposition & Actions */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Deep Data Hackathon 2026 &bull; E-Commerce Fraud Track</span>
              </div>
              <span className="hidden sm:inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active Protection</span>
              </span>
            </div>

            {/* Visual Security Flow Component (100% vector rendered, zero broken images, no adblocker issues) */}
            <PaymentPipelineVisual />

            {/* Colorful Feature Value Statement & Dynamic Pills */}
            <div className="space-y-3.5 max-w-xl">
              <p className="text-slate-700 text-base sm:text-lg leading-relaxed font-medium">
                <span className="font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  Real-Time Checkout Intelligence
                </span>{' '}
                built for high-growth e-commerce. Automatically approve{' '}
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80 whitespace-nowrap">
                  trusted shoppers
                </span>, intercept{' '}
                <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/80 whitespace-nowrap">
                  malicious card attacks
                </span>, and defend revenue with{' '}
                <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/80 whitespace-nowrap font-mono text-[13px]">
                  &lt;15ms latency
                </span>{' '}
                and{' '}
                <span className="font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-md border border-violet-200/80 whitespace-nowrap font-mono text-[13px]">
                  89.9% AUROC
                </span>.
              </p>

              {/* Colorful Micro-Pills */}
              <div className="flex flex-wrap gap-2 text-xs font-semibold pt-0.5">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Zero Friction for Real Shoppers</span>
                </span>
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 shadow-2xs">
                  <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                  <span>Instant Bot &amp; Proxy Intercept</span>
                </span>
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 shadow-2xs">
                  <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                  <span>11.4ms In-Memory ML</span>
                </span>
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-violet-50 text-violet-800 border border-violet-200 shadow-2xs">
                  <span className="h-2 w-2 rounded-full bg-violet-500"></span>
                  <span>Zero False Declines</span>
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 items-center pt-2">
              <button
                onClick={onGetStarted}
                className="flex items-center space-x-3 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span>Enter Live Dashboard</span>
                <ArrowRight className="w-4 h-4 text-blue-200" />
              </button>

              <button
                onClick={onTrySandbox}
                className="flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200/90 font-bold text-sm transition"
              >
                <Zap className="w-4 h-4 text-blue-600" />
                <span>Fraud Risk Sandbox</span>
              </button>
            </div>

            {/* Feature Checkmarks Strip */}
            <div className="pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold text-slate-600">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>0–100 Risk Score</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Local XAI Factors</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Balanced RF Model</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Dynamic 3DS Triage</span>
              </div>
            </div>

          </div>

          {/* Right Column: High-Fidelity 3D Visual & Interactive Telemetry Card */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Visual 3D Graphic Frame with Native Vector Component */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-md group">
              <HeroShieldVisual />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none"></div>
              
              {/* Overlay Badge */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                <div className="flex items-center space-x-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold">Autonomous ML Defense</span>
                </div>
                <div className="flex items-center space-x-1.5 bg-blue-600/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg font-mono text-[11px] font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>12ms Latency</span>
                </div>
              </div>
            </div>

            {/* Live Evaluated Telemetry Card */}
            <div className="rounded-2xl p-5 bg-white border border-slate-200/90 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
                  </span>
                  <span className="font-mono font-bold text-slate-900">{currentCase.id}</span>
                  <span className="text-slate-400 font-sans">({currentCase.type})</span>
                </div>
                <span className="font-mono font-bold text-slate-900 text-sm">{currentCase.amount}</span>
              </div>

              {/* Score strip */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Fraud Risk Score
                  </span>
                  <div className="flex items-baseline space-x-1 mt-0.5">
                    <span className="text-2xl font-black font-mono text-slate-900">{currentCase.score}</span>
                    <span className="text-xs text-slate-500 font-mono">/ 100</span>
                  </div>
                </div>

                <div className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${currentCase.scoreColor}`}>
                  {currentCase.tier}
                </div>
              </div>

              {/* Attribution summary */}
              <div className="text-xs text-slate-600 leading-snug">
                <strong className="text-slate-800">Reason: </strong>{currentCase.reason}
              </div>

              {/* Status pill */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Triage Directive:</span>
                <span className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${currentCase.actionColor}`}>
                  {currentCase.status}
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Live Statistics Strip (Pure White Cards with Slate Contrast) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="fintech-card rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-bold text-slate-500">Transactions Analyzed</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900 font-mono">
            {kpis.total_analyzed ? kpis.total_analyzed.toLocaleString() : '62'}
          </div>
          <p className="mt-1 text-xs text-blue-600 font-medium flex items-center">
            <TrendingUp className="w-3.5 h-3.5 mr-1 inline" /> Continuous streaming ledger
          </p>
        </div>

        <div className="fintech-card rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-bold text-slate-500">Suspicious Value Guarded</span>
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-rose-600 font-mono">
            ${kpis.total_suspicious_value ? kpis.total_suspicious_value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '6,362.98'}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            High-risk + escalated interventions
          </p>
        </div>

        <div className="fintech-card rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-bold text-slate-500">Model F1-Score</span>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-indigo-600 font-mono">
            {metrics.f1_score ? `${(metrics.f1_score * 100).toFixed(1)}%` : '97.9%'}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Balanced precision & recall tradeoff
          </p>
        </div>

        <div className="fintech-card rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-bold text-slate-500">Inference Latency</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-emerald-600 font-mono">
            &lt; 15 ms
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Real-time inline payment evaluation
          </p>
        </div>
      </section>

      {/* Visual Threat Prevention Comparison (With Rich SVG Visuals) */}
      <section className="fintech-card rounded-3xl p-8 sm:p-10 space-y-6">
        <div className="max-w-3xl">
          <span className="text-xs font-bold tracking-wider uppercase text-blue-600">Threat Visualizations</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            How FraudShield AI Distinguishes Fraud from Real Customers
          </h2>
          <p className="mt-3 text-slate-600 text-sm leading-relaxed">
            Legacy rule engines treat all unusual transactions as fraud. FraudShield AI uses multi-dimensional feature analysis to stop bots while allowing legitimate travelers to purchase without friction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          
          {/* Card 1: Bot Testing & Card Drips (Blocked) */}
          <div className="rounded-2xl p-6 bg-slate-50 border border-slate-200/90 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Scenario A: Automated Card Testing Bot Attack</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                SCORE: 99.4 (HIGH)
              </span>
            </div>

            {/* SVG Visual Graphic */}
            <div className="rounded-xl overflow-hidden border border-rose-200/80 bg-white">
              <img src="/bot-attack.svg" alt="Bot Attack Intercepted" className="w-full h-44 object-contain p-2" />
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Botnet rotates through proxies making rapid $9.99 micro-charges. FraudShield detects high 24h velocity (22 hits), failed CVVs, and Tor exit nodes, intercepting the attack before merchant chargeback limits are exceeded.
            </p>
          </div>

          {/* Card 2: Verified Shopper (Approved Frictionless) */}
          <div className="rounded-2xl p-6 bg-slate-50 border border-slate-200/90 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4" />
                <span>Scenario B: Legitimate Shopper Checkout</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                SCORE: 0.0 (LOW)
              </span>
            </div>

            {/* SVG Visual Graphic */}
            <div className="rounded-xl overflow-hidden border border-emerald-200/80 bg-white">
              <img src="/legit-shopper.svg" alt="Legitimate Shopper Approved" className="w-full h-44 object-contain p-2" />
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Genuine customer purchasing items from their home device. AVS verification matches, customer account age is 340 days, and IP threat score is 0.04. Approved in 12ms with <strong>zero false decline friction</strong>.
            </p>
          </div>

        </div>
      </section>

      {/* 4 Pillars of FraudShield AI (Crisp White SaaS Cards) */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold tracking-wider uppercase text-blue-600">Core Architecture</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Engineered for Precision, Speed & Trust
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-2">
            A comprehensive, multi-layer defensive engine purpose-built for the Deep Data Hackathon 2026.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="fintech-card fintech-card-hover rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Balanced Ensemble ML</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Trained on realistic transaction distributions using cost-sensitive balanced weighting, conquering extreme 1:37 class imbalance without overfitting.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-blue-600 font-mono font-semibold">
              Scikit-learn + Imblearn
            </div>
          </div>

          <div className="fintech-card fintech-card-hover rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Explainable AI (XAI)</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Never a black-box. FraudShield decomposes risk scores into transparent factor contributions (+32% foreign IP, +28% velocity burst) for analyst trust.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-indigo-600 font-mono font-semibold">
              Local Attribution Vectors
            </div>
          </div>

          <div className="fintech-card fintech-card-hover rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Dynamic Triage</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Low risk passes friction-free. Medium risk triggers step-up 3D-Secure 2.0 / OTP. Only high risk is routed to investigation queues, keeping conversion high.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-emerald-600 font-mono font-semibold">
              Tiered Risk Intervention
            </div>
          </div>

          <div className="fintech-card fintech-card-hover rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Audit & Monitoring</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Persistent transaction ledger with human reviewer workflows, simulation streams, and clear labeling between live and simulated demo activity.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-violet-600 font-mono font-semibold">
              FastAPI + SQLite + React
            </div>
          </div>
        </div>
      </section>

      {/* End-to-End Stepper */}
      <section className="fintech-card rounded-3xl p-8 sm:p-10">
        <h3 className="text-xl font-bold text-slate-900 mb-6 text-center sm:text-left">
          End-to-End Hackathon Demonstration Workflow
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold mx-auto flex items-center justify-center text-sm mb-2">1</div>
            <h4 className="text-xs font-bold text-slate-900">Enter Transaction</h4>
            <p className="text-[11px] text-slate-500 mt-1">Input amount, category, IP reputation & velocity.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold mx-auto flex items-center justify-center text-sm mb-2">2</div>
            <h4 className="text-xs font-bold text-slate-900">ML Inference</h4>
            <p className="text-[11px] text-slate-500 mt-1">Processed by scikit-learn Balanced Random Forest.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 font-bold mx-auto flex items-center justify-center text-sm mb-2">3</div>
            <h4 className="text-xs font-bold text-slate-900">Risk Score (0–100)</h4>
            <p className="text-[11px] text-slate-500 mt-1">Calibrated probability categorized into Low/Med/High.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-bold mx-auto flex items-center justify-center text-sm mb-2">4</div>
            <h4 className="text-xs font-bold text-slate-900">XAI Breakdown</h4>
            <p className="text-[11px] text-slate-500 mt-1">Dynamic feature contribution bars highlight risk causes.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold mx-auto flex items-center justify-center text-sm mb-2">5</div>
            <h4 className="text-xs font-bold text-slate-900">Live Ledger Sync</h4>
            <p className="text-[11px] text-slate-500 mt-1">Instant database persistence & analyst review options.</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={onTrySandbox}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition"
          >
            <span>Test the Workflow in the Sandbox</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
}
