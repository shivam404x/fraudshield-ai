import React, { useState } from 'react';
import { 
  Zap, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  Sliders, 
  RotateCcw, 
  ArrowRight, 
  Sparkles, 
  HelpCircle,
  Cpu,
  Save,
  Compass,
  FileCheck,
  CreditCard
} from 'lucide-react';
import { api } from '../services/api';

const PRESETS = [
  {
    id: 'safe',
    name: 'Normal Shopper',
    desc: 'Regular customer buying groceries from verified home address.',
    expected: 'Low Risk',
    color: 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-800',
    data: {
      amount: 48.50,
      merchant_category: 'grocery',
      merchant_name: 'Metro Organic Foods',
      customer_name: 'Sarah Connor',
      customer_email: 'sarah.c@gmail.com',
      card_type: 'Visa',
      card_last4: '4242',
      billing_country: 'US',
      shipping_country: 'US',
      shipping_billing_match: true,
      foreign_transaction: false,
      distance_from_home_km: 4.2,
      hour_of_day: 14,
      day_of_week: 2,
      tx_velocity_24h: 1,
      account_age_days: 340,
      failed_attempts_1h: 0,
      ip_risk_score: 0.04,
      device_type: 'mobile',
      browser: 'Safari'
    }
  },
  {
    id: 'midnight_rush',
    name: 'Midnight Electronics Rush',
    desc: 'New account buying high-value tech at 3 AM with proxy IP and high velocity.',
    expected: 'High Risk',
    color: 'border-rose-200 bg-rose-50/50 hover:bg-rose-50 text-rose-800',
    data: {
      amount: 2399.00,
      merchant_category: 'electronics',
      merchant_name: 'Volt Tech Megastore',
      customer_name: 'Alex Mercer',
      customer_email: 'alex991@tempmail.org',
      card_type: 'Mastercard',
      card_last4: '8832',
      billing_country: 'US',
      shipping_country: 'RU',
      shipping_billing_match: false,
      foreign_transaction: true,
      distance_from_home_km: 6800.0,
      hour_of_day: 3,
      day_of_week: 6,
      tx_velocity_24h: 14,
      account_age_days: 2,
      failed_attempts_1h: 4,
      ip_risk_score: 0.95,
      device_type: 'bot_proxy',
      browser: 'Tor_Browser'
    }
  },
  {
    id: 'luxury_spree',
    name: 'Foreign Luxury Spree',
    desc: 'Large jewelry order shipped overseas with high-risk IP reputation.',
    expected: 'High Risk',
    color: 'border-rose-200 bg-rose-50/50 hover:bg-rose-50 text-rose-800',
    data: {
      amount: 4150.00,
      merchant_category: 'luxury_jewelry',
      merchant_name: 'Sovereign Diamonds',
      customer_name: 'Viktor Sterling',
      customer_email: 'v.sterling@protonmail.com',
      card_type: 'Visa',
      card_last4: '1990',
      billing_country: 'US',
      shipping_country: 'NG',
      shipping_billing_match: false,
      foreign_transaction: true,
      distance_from_home_km: 8400.0,
      hour_of_day: 2,
      day_of_week: 5,
      tx_velocity_24h: 8,
      account_age_days: 4,
      failed_attempts_1h: 2,
      ip_risk_score: 0.91,
      device_type: 'desktop',
      browser: 'Chrome'
    }
  },
  {
    id: 'card_testing',
    name: 'Card Testing Bot Drips',
    desc: 'Automated script making repeated small digital purchases with failed CVVs.',
    expected: 'High Risk',
    color: 'border-amber-200 bg-amber-50/50 hover:bg-amber-50 text-amber-800',
    data: {
      amount: 14.99,
      merchant_category: 'digital_goods',
      merchant_name: 'SteamPlay Direct',
      customer_name: 'Bot Runner',
      customer_email: 'script.tester@mail.ru',
      card_type: 'Visa',
      card_last4: '0012',
      billing_country: 'GB',
      shipping_country: 'GB',
      shipping_billing_match: true,
      foreign_transaction: true,
      distance_from_home_km: 3200.0,
      hour_of_day: 4,
      day_of_week: 1,
      tx_velocity_24h: 22,
      account_age_days: 1,
      failed_attempts_1h: 5,
      ip_risk_score: 0.94,
      device_type: 'bot_proxy',
      browser: 'Tor_Browser'
    }
  },
  {
    id: 'traveler',
    name: 'Traveling Executive',
    desc: 'Established customer buying flight ticket abroad. Medium risk prompts 3DS.',
    expected: 'Medium Risk',
    color: 'border-amber-200 bg-amber-50/50 hover:bg-amber-50 text-amber-800',
    data: {
      amount: 980.00,
      merchant_category: 'travel',
      merchant_name: 'SkyWing Airways',
      customer_name: 'David Kim',
      customer_email: 'david.kim@acme-corp.com',
      card_type: 'Amex',
      card_last4: '3005',
      billing_country: 'US',
      shipping_country: 'US',
      shipping_billing_match: true,
      foreign_transaction: true,
      distance_from_home_km: 2400.0,
      hour_of_day: 19,
      day_of_week: 3,
      tx_velocity_24h: 2,
      account_age_days: 520,
      failed_attempts_1h: 0,
      ip_risk_score: 0.35,
      device_type: 'mobile',
      browser: 'Safari'
    }
  }
];

export default function FraudAnalyzer({ onInspectTransaction, onNavigateToMonitor, onNotify }) {
  const [formData, setFormData] = useState(PRESETS[0].data);
  const [saveToDb, setSaveToDb] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handlePresetSelect = (preset) => {
    setFormData({ ...preset.data });
    setResult(null);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAnalyzing(true);
    setResult(null);

    try {
      const payload = {
        ...formData,
        amount: Number(formData.amount),
        hour_of_day: Number(formData.hour_of_day),
        day_of_week: Number(formData.day_of_week),
        distance_from_home_km: Number(formData.distance_from_home_km),
        tx_velocity_24h: Number(formData.tx_velocity_24h),
        account_age_days: Number(formData.account_age_days),
        failed_attempts_1h: Number(formData.failed_attempts_1h),
        ip_risk_score: Number(formData.ip_risk_score),
        save_to_db: saveToDb
      };

      const res = await api.analyzeTransaction(payload);
      setResult(res);
      if (onNotify) {
        onNotify(`Analysis complete: Risk Score ${res.risk_score}/100 (${res.risk_tier})`, 
          res.risk_tier === 'High Risk' ? 'error' : res.risk_tier === 'Medium Risk' ? 'warning' : 'success'
        );
      }
    } catch (err) {
      if (onNotify) onNotify(`Analysis failed: ${err.message}`, 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 py-6">
      
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            AI Fraud Detection Sandbox & Interactive Analyzer
          </h1>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            ML INFERENCE LAB
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Test transactions in real time against the trained Balanced Random Forest model. Inspect instant risk scoring, decision directives, and Explainable AI (XAI) factor breakdowns.
        </p>
      </div>

      {/* Preset Scenarios Strip */}
      <div className="fintech-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Quick-Load Attack & Behavior Archetypes</span>
          </span>
          <span className="text-[11px] text-slate-400">Click to autofill test parameters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handlePresetSelect(preset)}
              className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${preset.color}`}
            >
              <div>
                <div className="text-xs font-bold text-slate-900">{preset.name}</div>
                <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {preset.desc}
                </p>
              </div>
              <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px]">
                <span className="text-slate-500 font-medium">Expected:</span>
                <span className="font-bold">{preset.expected}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Form on Left, Instant Result on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Column */}
        <div className="lg:col-span-7 fintech-card rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Transaction Attributes
              </h3>
              <div className="flex items-center space-x-2 text-xs">
                <input
                  type="checkbox"
                  id="saveLedger"
                  checked={saveToDb}
                  onChange={(e) => setSaveToDb(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="saveLedger" className="text-slate-700 font-medium cursor-pointer">
                  Save to Audit Ledger
                </label>
              </div>
            </div>

            {/* Row 1: Amount & Merchant Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Transaction Amount (USD) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400 font-mono text-xs">$</span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Merchant Category *
                </label>
                <select
                  value={formData.merchant_category}
                  onChange={(e) => handleInputChange('merchant_category', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 capitalize focus:outline-none focus:border-blue-500 focus:bg-white cursor-pointer font-medium"
                >
                  <option value="electronics">Electronics (High Resale Target)</option>
                  <option value="luxury_jewelry">Luxury Jewelry & Watches</option>
                  <option value="digital_goods">Digital Goods & Gift Cards</option>
                  <option value="fashion">Apparel & Fashion</option>
                  <option value="grocery">Grocery & Everyday Essentials</option>
                  <option value="home_goods">Home Goods & Furniture</option>
                  <option value="travel">Travel, Flights & Lodging</option>
                </select>
              </div>
            </div>

            {/* Row 2: Customer & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Customer Full Name
                </label>
                <input
                  type="text"
                  value={formData.customer_name}
                  onChange={(e) => handleInputChange('customer_name', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Customer Email
                </label>
                <input
                  type="email"
                  value={formData.customer_email}
                  onChange={(e) => handleInputChange('customer_email', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Row 3: Account Profile & Velocity */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Account Age (Days)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.account_age_days}
                  onChange={(e) => handleInputChange('account_age_days', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500 focus:bg-white"
                />
                <span className="text-[10px] text-slate-500">&lt;5 days = fresh risk</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Rolling 24h Velocity
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.tx_velocity_24h}
                  onChange={(e) => handleInputChange('tx_velocity_24h', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500 focus:bg-white"
                />
                <span className="text-[10px] text-slate-500">&gt;6 hits = burst</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Failed CVVs (Past 1h)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.failed_attempts_1h}
                  onChange={(e) => handleInputChange('failed_attempts_1h', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500 focus:bg-white"
                />
                <span className="text-[10px] text-slate-500">&gt;2x = brute force</span>
              </div>
            </div>

            {/* Row 4: Geolocation & Address Verification */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hour of Day (0–23)
                </label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={formData.hour_of_day}
                  onChange={(e) => handleInputChange('hour_of_day', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500 focus:bg-white"
                />
                <span className="text-[10px] text-slate-500">01:00-04:00 = nocturnal</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Distance from Home (km)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.distance_from_home_km}
                  onChange={(e) => handleInputChange('distance_from_home_km', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  IP Threat Score (0–1.0)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.0"
                  max="1.0"
                  value={formData.ip_risk_score}
                  onChange={(e) => handleInputChange('ip_risk_score', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500 focus:bg-white"
                />
                <span className="text-[10px] text-slate-500">&gt;0.70 = proxy/Tor</span>
              </div>
            </div>

            {/* Row 5: Toggles & Device */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="addressMatch"
                    checked={formData.shipping_billing_match}
                    onChange={(e) => handleInputChange('shipping_billing_match', e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="addressMatch" className="text-xs text-slate-700 font-medium cursor-pointer">
                    Shipping Matches Card Billing Address
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="foreignTx"
                    checked={formData.foreign_transaction}
                    onChange={(e) => handleInputChange('foreign_transaction', e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="foreignTx" className="text-xs text-slate-700 font-medium cursor-pointer">
                    Foreign Country / International IP
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Device Type</label>
                  <select
                    value={formData.device_type}
                    onChange={(e) => handleInputChange('device_type', e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 cursor-pointer font-medium"
                  >
                    <option value="desktop">Desktop</option>
                    <option value="mobile">Mobile</option>
                    <option value="tablet">Tablet</option>
                    <option value="bot_proxy">Bot / Proxy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Browser</label>
                  <select
                    value={formData.browser}
                    onChange={(e) => handleInputChange('browser', e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 cursor-pointer font-medium"
                  >
                    <option value="Chrome">Chrome</option>
                    <option value="Safari">Safari</option>
                    <option value="Edge">Edge</option>
                    <option value="Firefox">Firefox</option>
                    <option value="Tor_Browser">Tor Browser</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={analyzing}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <Zap className={`w-4 h-4 ${analyzing ? 'animate-spin' : ''}`} />
                <span>{analyzing ? 'Executing Machine Learning Scoring...' : 'Analyze Transaction with ML'}</span>
              </button>
            </div>

          </form>
        </div>

        {/* Prediction Results Column */}
        <div className="lg:col-span-5 space-y-6">
          
          {result ? (
            <div className="fintech-card rounded-2xl p-6 space-y-5 animate-slide-up">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Inference Result</span>
                  <div className="text-base font-bold text-slate-900 font-mono">{result.id || 'TXN-PREVIEW'}</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  result.risk_tier === 'High Risk' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                  result.risk_tier === 'Medium Risk' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                  'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {result.risk_tier}
                </div>
              </div>

              {/* Big Gauge Meter */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">Calibrated Fraud Probability</span>
                <div className={`mt-2 text-5xl font-black font-mono ${
                  result.risk_tier === 'High Risk' ? 'text-rose-600' :
                  result.risk_tier === 'Medium Risk' ? 'text-amber-600' :
                  'text-emerald-600'
                }`}>
                  {result.risk_score}
                  <span className="text-xl font-normal text-slate-400"> / 100</span>
                </div>
                <div className="mt-3 flex items-center justify-center space-x-2">
                  <span className="text-xs text-slate-500">Automated Recommendation:</span>
                  <span className={`px-2 py-0.5 rounded font-bold font-mono text-xs ${
                    result.recommendation === 'APPROVE' ? 'bg-emerald-100 text-emerald-800' :
                    result.recommendation === 'STEP_UP_AUTH' ? 'bg-amber-100 text-amber-800' :
                    'bg-rose-100 text-rose-800'
                  }`}>
                    {result.recommendation}
                  </span>
                </div>
                <p className="text-xs text-slate-700 font-bold mt-2">
                  {result.decision_label}
                </p>
              </div>

              {/* Summary Explanation */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                <p className="leading-relaxed">
                  <strong className="text-slate-900">Explanation: </strong>
                  {result.summary_explanation || 'Transaction evaluated against trained decision bounds.'}
                </p>
              </div>

              {/* Top Risk Factors Breakdown */}
              {result.top_risk_factors?.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                    Top Contributing Risk Drivers
                  </span>
                  {result.top_risk_factors.map((factor, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-slate-900">{factor.title}</span>
                        <span className="text-rose-600 font-mono">+{factor.impact_pct}%</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{factor.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Protective Factors */}
              {result.protective_factors?.length > 0 && (
                <div className="space-y-1.5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                  <span className="font-bold flex items-center space-x-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Protective Mitigating Factors</span>
                  </span>
                  <ul className="list-disc list-inside text-[11px] space-y-0.5">
                    {result.protective_factors.map((p, idx) => (
                      <li key={idx}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Next Actions */}
              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => onInspectTransaction(result)}
                  className="flex-1 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition flex items-center justify-center space-x-1"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Inspect Forensic Report</span>
                </button>
                {saveToDb && (
                  <button
                    type="button"
                    onClick={onNavigateToMonitor}
                    className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
                  >
                    View in Ledger
                  </button>
                )}
              </div>

            </div>
          ) : (
            <div className="fintech-card rounded-2xl p-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
                <Cpu className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Inference Awaiting Input</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                  Fill in the transaction attributes on the left or select a preset scenario above, then click <strong className="text-blue-600">Analyze Transaction with ML</strong>.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 text-left space-y-2 text-xs text-slate-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Sub-15ms ML evaluation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Instant 0–100 probability calibration</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>Automatic insertion into persistent audit ledger</span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
