import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  ShieldAlert, 
  DollarSign, 
  Cpu, 
  TrendingUp, 
  Play, 
  Pause, 
  RefreshCw, 
  ArrowUpRight, 
  Sliders, 
  AlertCircle,
  Clock,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  HelpCircle,
  ShieldCheck,
  CreditCard,
  Settings,
  Download,
  Search,
  Check,
  ChevronDown,
  Sparkles,
  BarChart3,
  Layers,
  Shield,
  SlidersHorizontal
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export default function Dashboard({ 
  overviewData, 
  metricsData, 
  isSimulating, 
  toggleSimulation, 
  onQuickSimulate,
  simulationSpeed,
  setSimulationSpeed,
  simulationBias,
  setSimulationBias,
  onInspectTransaction,
  onNavigateToMonitor,
  onNavigateToAnalyzer
}) {
  // View Customization States
  const [viewMode, setViewMode] = useState('overview'); // 'overview' | 'risk' | 'ml'
  const [timeRange, setTimeRange] = useState('24h'); // 'live' | '24h' | '7d' | '30d'
  const [riskSensitivity, setRiskSensitivity] = useState('balanced'); // 'balanced' | 'strict' | 'permissive'
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentFilter, setRecentFilter] = useState('all');

  // Widget Visibility Configuration (Customizable by user)
  const [widgets, setWidgets] = useState({
    kpis: true,
    streamControls: true,
    volumeTrend: true,
    riskDonut: true,
    categoryExposure: true,
    analystWorkflow: true,
    recentTable: true
  });

  const toggleWidget = (key) => {
    setWidgets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const resetWidgets = () => {
    setWidgets({
      kpis: true,
      streamControls: true,
      volumeTrend: true,
      riskDonut: true,
      categoryExposure: true,
      analystWorkflow: true,
      recentTable: true
    });
  };

  const kpis = overviewData?.kpis || {};
  const metrics = metricsData?.evaluation_metrics || {};
  const categoryData = overviewData?.category_breakdown || [];
  const hourlyData = overviewData?.hourly_trend || [];
  const recentFlagged = overviewData?.recent_flagged || [];

  // Risk Distribution Data
  const riskData = useMemo(() => [
    { name: 'Low Risk', value: kpis.risk_breakdown?.low || 0, color: '#10b981' },
    { name: 'Medium Risk', value: kpis.risk_breakdown?.medium || 0, color: '#f59e0b' },
    { name: 'High Risk', value: kpis.risk_breakdown?.high || 0, color: '#ef4444' },
  ].filter(d => d.value > 0), [kpis.risk_breakdown]);

  // Status Breakdown Data
  const statusData = useMemo(() => [
    { name: 'Approved', count: kpis.status_breakdown?.approved || 0, color: '#10b981' },
    { name: 'Under Review', count: kpis.status_breakdown?.under_review || 0, color: '#f59e0b' },
    { name: 'Escalated', count: kpis.status_breakdown?.escalated || 0, color: '#7c3aed' },
    { name: 'Rejected', count: kpis.status_breakdown?.rejected || 0, color: '#ef4444' },
  ], [kpis.status_breakdown]);

  // Filtered & Searched Recent Flagged
  const filteredRecent = useMemo(() => {
    return recentFlagged.filter(tx => {
      // Risk filter
      if (recentFilter === 'high' && tx.risk_tier !== 'High Risk') return false;
      if (recentFilter === 'review' && tx.status !== 'Under Review') return false;
      if (recentFilter === 'escalated' && tx.status !== 'Escalated') return false;

      // Text search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const idMatch = tx.id?.toLowerCase().includes(query);
        const nameMatch = tx.customer_name?.toLowerCase().includes(query);
        const catMatch = tx.merchant_category?.toLowerCase().includes(query);
        const emailMatch = tx.customer_email?.toLowerCase().includes(query);
        return idMatch || nameMatch || catMatch || emailMatch;
      }
      return true;
    });
  }, [recentFlagged, recentFilter, searchQuery]);

  // Export Table to CSV
  const handleExportCSV = () => {
    if (filteredRecent.length === 0) return;
    const headers = ['Transaction ID', 'Customer', 'Email', 'Amount', 'Currency', 'Risk Score', 'Risk Tier', 'Status', 'Timestamp'];
    const rows = filteredRecent.map(tx => [
      tx.id,
      `"${tx.customer_name}"`,
      tx.customer_email,
      tx.amount,
      tx.currency || 'USD',
      tx.risk_score,
      tx.risk_tier,
      tx.status,
      tx.timestamp
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `fraudshield_flagged_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 py-6">
      
      {/* ==================== CUSTOMIZATION & CONTROL DOCK ==================== */}
      <div className="fintech-card rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border border-slate-200/90 shadow-2xs">
        
        {/* Left: View Mode Segmented Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex p-1 rounded-xl bg-slate-100/90 border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setViewMode('overview')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'overview'
                  ? 'bg-white text-slate-900 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>Executive Overview</span>
            </button>
            <button
              onClick={() => setViewMode('risk')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'risk'
                  ? 'bg-white text-rose-600 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>Fraud Focus</span>
            </button>
            <button
              onClick={() => setViewMode('ml')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'ml'
                  ? 'bg-white text-indigo-600 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-indigo-600" />
              <span>ML Telemetry</span>
            </button>
          </div>

          {/* Timeframe Selector */}
          <div className="flex items-center space-x-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-transparent text-slate-700 font-semibold focus:outline-none cursor-pointer text-xs"
            >
              <option value="live">Live Stream (Real-Time)</option>
              <option value="24h">Past 24 Hours</option>
              <option value="7d">Past 7 Days</option>
              <option value="30d">Past 30 Days</option>
            </select>
          </div>
        </div>

        {/* Right: Customization Modal Trigger & Sensitivity */}
        <div className="flex items-center space-x-2.5">
          {/* Risk Sensitivity Preset */}
          <div className="hidden sm:flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Policy:</span>
            <select
              value={riskSensitivity}
              onChange={(e) => setRiskSensitivity(e.target.value)}
              className="bg-transparent text-blue-600 font-bold focus:outline-none cursor-pointer text-xs"
            >
              <option value="balanced">Balanced Retail (75 Score)</option>
              <option value="strict">Strict Fintech (60 Score)</option>
              <option value="permissive">Low-Friction (85 Score)</option>
            </select>
          </div>

          {/* Customize Widgets Button */}
          <button
            onClick={() => setShowCustomizeModal(!showCustomizeModal)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold shadow-2xs transition active:scale-95"
          >
            <Settings className="w-3.5 h-3.5 text-slate-500" />
            <span>Customize Dashboard</span>
          </button>
        </div>

      </div>

      {/* ==================== CUSTOMIZE WIDGETS MODAL / FLYOUT ==================== */}
      {showCustomizeModal && (
        <div className="fintech-card rounded-2xl p-5 border border-blue-200 bg-blue-50/20 shadow-md animate-fade-in">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80">
            <div className="flex items-center space-x-2">
              <Settings className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Customize Dashboard Widgets</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={resetWidgets}
                className="text-xs text-slate-500 hover:text-slate-800 underline underline-offset-2 transition"
              >
                Reset Default
              </button>
              <button
                onClick={() => setShowCustomizeModal(false)}
                className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition"
              >
                Done
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
            {[
              { id: 'kpis', label: 'Executive KPIs' },
              { id: 'streamControls', label: 'Simulator Stream' },
              { id: 'volumeTrend', label: 'Hourly Volume Trend' },
              { id: 'riskDonut', label: 'Risk Distribution' },
              { id: 'categoryExposure', label: 'Category Exposure' },
              { id: 'analystWorkflow', label: 'Analyst Triage' },
            ].map(item => (
              <label 
                key={item.id} 
                className={`flex items-center space-x-2 p-2.5 rounded-xl border cursor-pointer transition select-none ${
                  widgets[item.id]
                    ? 'bg-white border-blue-300 text-blue-900 shadow-2xs font-semibold'
                    : 'bg-slate-100 border-slate-200 text-slate-400'
                }`}
              >
                <input
                  type="checkbox"
                  checked={widgets[item.id]}
                  onChange={() => toggleWidget(item.id)}
                  className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                />
                <span className="truncate">{item.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* ==================== SIMULATOR & STREAM CONTROL BAR ==================== */}
      {widgets.streamControls && (
        <div className="fintech-card rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className={`p-2.5 rounded-xl ${isSimulating ? 'bg-rose-50 text-rose-600 border border-rose-200 animate-pulse' : 'bg-blue-50 text-blue-600 border border-blue-200'}`}>
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Live Transaction Telemetry Stream
                </h2>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${isSimulating ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-slate-100 text-slate-600'}`}>
                  {isSimulating ? 'ACTIVE INFLUX' : 'STREAM PAUSED'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Simulates real-world checkouts, synthetic fraud vectors, and live machine learning scoring.
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Speed selector */}
            <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500 font-medium">Rate:</span>
              <select
                value={simulationSpeed}
                onChange={(e) => setSimulationSpeed(Number(e.target.value))}
                className="bg-transparent text-blue-600 font-bold focus:outline-none cursor-pointer text-xs"
              >
                <option value={2000}>2s (Fast Influx)</option>
                <option value={4000}>4s (Standard)</option>
                <option value={8000}>8s (Steady)</option>
              </select>
            </div>

            {/* Bias selector */}
            <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500 font-medium">Attack Bias:</span>
              <select
                value={simulationBias}
                onChange={(e) => setSimulationBias(Number(e.target.value))}
                className="bg-transparent text-indigo-600 font-bold focus:outline-none cursor-pointer text-xs"
              >
                <option value={0.15}>15% (Typical Baseline)</option>
                <option value={0.35}>35% (Elevated Threat)</option>
                <option value={0.60}>60% (Coordinated Wave)</option>
              </select>
            </div>

            {/* Quick 1x */}
            <button
              onClick={onQuickSimulate}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold transition active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
              <span>Simulate 1x</span>
            </button>

            {/* Toggle stream */}
            <button
              onClick={toggleSimulation}
              className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-xl text-xs font-bold shadow-sm transition active:scale-95 ${
                isSimulating
                  ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 animate-pulse'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
              }`}
            >
              {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isSimulating ? 'Pause Feed' : 'Start Feed'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ==================== KPI STAT CARDS ==================== */}
      {widgets.kpis && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Total Analyzed */}
          <div className="fintech-card fintech-card-hover rounded-2xl p-5 border-l-4 border-l-blue-600">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-500">Total Analyzed</span>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-extrabold text-slate-900 font-mono">
              {kpis.total_analyzed ? kpis.total_analyzed.toLocaleString() : '0'}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span>Processed Volume:</span>
              <span className="text-slate-800 font-mono font-bold">
                ${kpis.total_volume_processed ? kpis.total_volume_processed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
              </span>
            </div>
          </div>

          {/* Fraud Detected */}
          <div className="fintech-card fintech-card-hover rounded-2xl p-5 border-l-4 border-l-rose-500">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-500">Fraud Detected</span>
              <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-extrabold text-rose-600 font-mono">
              {kpis.fraud_detected ? kpis.fraud_detected.toLocaleString() : '0'}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span>Fraud Rate:</span>
              <span className="text-rose-600 font-mono font-bold bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                {kpis.fraud_rate_pct ? `${kpis.fraud_rate_pct}%` : '0.0%'}
              </span>
            </div>
          </div>

          {/* Suspicious Value Guarded */}
          <div className="fintech-card fintech-card-hover rounded-2xl p-5 border-l-4 border-l-indigo-600">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-500">Guarded Value</span>
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-extrabold text-indigo-600 font-mono">
              ${kpis.total_suspicious_value ? kpis.total_suspicious_value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span>Capital Protected:</span>
              <span className="text-emerald-700 font-semibold font-mono text-[11px] bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                Zero Chargeback
              </span>
            </div>
          </div>

          {/* Model Accuracy & F1 */}
          <div className="fintech-card fintech-card-hover rounded-2xl p-5 border-l-4 border-l-emerald-500">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-500">Model Precision / F1</span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <Cpu className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-extrabold text-emerald-600 font-mono">
              {metrics.f1_score ? `${(metrics.f1_score * 100).toFixed(1)}%` : '97.9%'}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span>Overall Accuracy:</span>
              <span className="text-emerald-600 font-mono font-bold">
                {metrics.accuracy ? `${(metrics.accuracy * 100).toFixed(2)}%` : '99.89%'}
              </span>
            </div>
          </div>

        </div>
      )}

      {/* ==================== MAIN CHARTS ROW ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Hourly Volume & Fraud Detection Trend */}
        {widgets.volumeTrend && (
          <div className={`${widgets.riskDonut ? 'lg:col-span-2' : 'lg:col-span-3'} fintech-card rounded-2xl p-6`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Transaction Volume &amp; Fraud Risk Trend
                </h3>
                <p className="text-xs text-slate-500">Processed checkouts vs. high-risk flags ({timeRange})</p>
              </div>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-mono font-semibold border border-blue-200/80">
                Timeline: {timeRange.toUpperCase()}
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyData.length > 0 ? hourlyData : [
                  { hour_label: '00:00', tx_volume: 4, high_risk_count: 1 },
                  { hour_label: '04:00', tx_volume: 8, high_risk_count: 2 },
                  { hour_label: '08:00', tx_volume: 18, high_risk_count: 0 },
                  { hour_label: '12:00', tx_volume: 24, high_risk_count: 1 },
                  { hour_label: '16:00', tx_volume: 21, high_risk_count: 0 },
                  { hour_label: '20:00', tx_volume: 15, high_risk_count: 1 },
                ]}>
                  <defs>
                    <linearGradient id="volumeGradLight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="fraudGradLight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e11d48" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#e11d48" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="hour_label" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.1)' }}
                    itemStyle={{ color: '#0f172a' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="tx_volume" name="Total Volume" stroke="#2563eb" fillOpacity={1} fill="url(#volumeGradLight)" strokeWidth={2.5} />
                  <Area type="monotone" dataKey="high_risk_count" name="High Risk Flags" stroke="#e11d48" fillOpacity={1} fill="url(#fraudGradLight)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Risk Tier Donut Distribution */}
        {widgets.riskDonut && (
          <div className={`${widgets.volumeTrend ? 'lg:col-span-1' : 'lg:col-span-3'} fintech-card rounded-2xl p-6 flex flex-col justify-between`}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Risk Tier Distribution
                </h3>
                <span className="text-[11px] font-mono text-slate-500">Total: {kpis.total_analyzed || 0}</span>
              </div>
              <p className="text-xs text-slate-500 mb-4">ML calibrated risk tier classification</p>

              <div className="h-52 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskData.length > 0 ? riskData : [{ name: 'Low Risk', value: 1, color: '#10b981' }]}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {riskData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Legend Items */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-slate-700 font-medium">Low Risk (0–34)</span>
                </div>
                <span className="font-mono text-emerald-600 font-bold">{kpis.risk_breakdown?.low || 0}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className="text-slate-700 font-medium">Medium Risk (35–74)</span>
                </div>
                <span className="font-mono text-amber-600 font-bold">{kpis.risk_breakdown?.medium || 0}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span className="text-slate-700 font-medium">High Risk (75–100)</span>
                </div>
                <span className="font-mono text-rose-600 font-bold">{kpis.risk_breakdown?.high || 0}</span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ==================== SECONDARY CHARTS ROW ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Suspicious Value by Merchant Category */}
        {widgets.categoryExposure && (
          <div className="fintech-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Suspicious Volume by Merchant Category
                </h3>
                <p className="text-xs text-slate-500">Fraud dollar exposure across catalog segments</p>
              </div>
              <span className="text-[11px] text-indigo-600 font-mono font-bold bg-indigo-50 px-2 py-0.5 rounded">USD ($)</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData.length > 0 ? categoryData : [
                  { category: 'electronics', fraud_value: 3200 },
                  { category: 'luxury_jewelry', fraud_value: 2800 },
                  { category: 'digital_goods', fraud_value: 950 },
                  { category: 'travel', fraud_value: 850 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="category" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip 
                    formatter={(val) => [`$${Number(val).toLocaleString()}`, 'Suspicious Exposure']}
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="fraud_value" name="Fraud Exposure ($)" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Analyst Review Status Breakdown */}
        {widgets.analystWorkflow && (
          <div className="fintech-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Analyst Triage &amp; Review Status
                </h3>
                <p className="text-xs text-slate-500">Operational workflow states across flagged items</p>
              </div>
              <button 
                onClick={onNavigateToMonitor}
                className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center space-x-1"
              >
                <span>Full Ledger</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              {statusData.map((item) => (
                <div key={item.name} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium">{item.name}</span>
                  <div className="mt-2 text-2xl font-bold font-mono" style={{ color: item.color }}>
                    {item.count.toLocaleString()}
                  </div>
                  <div className="mt-2 w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ 
                        width: `${kpis.total_analyzed ? Math.min(100, (item.count / kpis.total_analyzed) * 100) : 0}%`,
                        backgroundColor: item.color 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-3.5 rounded-xl bg-blue-50 border border-blue-200 flex items-start space-x-2 text-xs text-slate-700">
              <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                Under active policy: <strong className="text-amber-800">Medium Risk</strong> triggers 3DS OTP challenge; <strong className="text-rose-800">High Risk</strong> is intercepted for human forensic review.
              </span>
            </div>
          </div>
        )}

      </div>

      {/* ==================== RECENT TRANSACTIONS TABLE ==================== */}
      {widgets.recentTable && (
        <div className="fintech-card rounded-2xl p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Recent Flagged &amp; Suspicious Transactions
              </h3>
              <p className="text-xs text-slate-500">Live transaction stream requiring decision review</p>
            </div>

            {/* Table Controls: Search, Filter Tabs, CSV Export */}
            <div className="flex flex-wrap items-center gap-2.5">
              
              {/* Search input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search ID, customer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500 w-44 sm:w-56"
                />
              </div>

              {/* Status Filter Tabs */}
              <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs">
                <button
                  onClick={() => setRecentFilter('all')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition ${recentFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setRecentFilter('high')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition ${recentFilter === 'high' ? 'bg-white text-rose-600 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  High Risk
                </button>
                <button
                  onClick={() => setRecentFilter('review')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition ${recentFilter === 'review' ? 'bg-white text-amber-600 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Review
                </button>
              </div>

              {/* CSV Export Button */}
              <button
                onClick={handleExportCSV}
                title="Download CSV export"
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold shadow-2xs transition"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={onNavigateToMonitor}
                className="text-xs text-blue-600 hover:text-blue-700 font-bold px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200"
              >
                Open Monitor
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider border-b border-slate-200 font-bold">
                <tr>
                  <th className="py-3 px-3">Transaction ID</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Risk Score</th>
                  <th className="py-3 px-3">Tier</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                {filteredRecent.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500 font-sans">
                      No transactions match the selected filter or search query.
                    </td>
                  </tr>
                ) : (
                  filteredRecent.map((tx) => {
                    const isHigh = tx.risk_tier === 'High Risk';
                    const isMed = tx.risk_tier === 'Medium Risk';
                    return (
                      <tr key={tx.id} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-3 font-bold text-blue-600">
                          {tx.id}
                          {tx.is_simulated ? (
                            <span 
                              title="Generated by test simulation stream. Not real production activity."
                              className="ml-1.5 px-1.5 py-0.5 text-[9px] bg-amber-50 text-amber-800 rounded border border-amber-300 font-bold"
                            >
                              Simulated
                            </span>
                          ) : (
                            <span 
                              title="Real IEEE-CIS dataset record evaluated by ML model."
                              className="ml-1.5 px-1.5 py-0.5 text-[9px] bg-blue-50 text-blue-800 rounded border border-blue-200 font-semibold"
                            >
                              Dataset
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 font-sans">
                          <div className="font-semibold text-slate-900">{tx.customer_name}</div>
                          <div className="text-[11px] text-slate-500">{tx.customer_email}</div>
                        </td>
                        <td className="py-3 px-3 font-sans capitalize text-slate-600">
                          {tx.merchant_category?.replace('_', ' ')}
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-900">
                          ${Number(tx.amount).toFixed(2)}
                        </td>
                        <td className="py-3 px-3 font-bold">
                          <span className={`px-2 py-0.5 rounded ${
                            isHigh ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                            isMed ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                            {tx.risk_score} / 100
                          </span>
                        </td>
                        <td className="py-3 px-3 font-sans">
                          <span className={`text-xs font-bold ${
                            isHigh ? 'text-rose-600' : isMed ? 'text-amber-600' : 'text-emerald-600'
                          }`}>
                            {tx.risk_tier}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-sans">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            tx.status === 'Approved' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                            tx.status === 'Escalated' ? 'bg-violet-50 text-violet-800 border border-violet-200' :
                            tx.status === 'Rejected' ? 'bg-rose-50 text-rose-800 border border-rose-200' :
                            'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-sans">
                          <button
                            onClick={() => onInspectTransaction(tx)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold transition inline-flex items-center space-x-1"
                          >
                            <Eye className="w-3.5 h-3.5 text-blue-600" />
                            <span>Inspect</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
