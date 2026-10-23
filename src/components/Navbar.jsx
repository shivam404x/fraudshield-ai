import React, { useState } from 'react';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Activity, 
  Zap, 
  Cpu, 
  BookOpen, 
  Home, 
  Play, 
  Pause,
  RefreshCw,
  Menu,
  X,
  Radio
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  isSimulating, 
  toggleSimulation, 
  onQuickSimulate,
  metricsData
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSimulatingSingle, setIsSimulatingSingle] = useState(false);

  const evalMetrics = metricsData?.evaluation_metrics || {};
  const aurocDisplay = evalMetrics.auroc ? (evalMetrics.auroc * 100).toFixed(1) : '89.9';
  const auprcDisplay = evalMetrics.auprc ? (evalMetrics.auprc * 100).toFixed(1) : '55.8';

  const handleSingleSimClick = async () => {
    setIsSimulatingSingle(true);
    try {
      await onQuickSimulate();
    } finally {
      setTimeout(() => setIsSimulatingSingle(false), 500);
    }
  };

  const navItems = [
    { id: 'landing', label: 'Overview', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'monitor', label: 'Live Monitoring', icon: Activity },
    { id: 'analyzer', label: 'Fraud Sandbox', icon: Zap },
    { id: 'performance', label: 'Model Metrics', icon: Cpu },
    { id: 'hackathon', label: 'Hackathon Docs', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_2px_15px_-3px_rgba(15,23,42,0.03)] transition-all">
      
      {/* Top Micro-Bar for Hackathon Identity */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white text-[11px] font-medium py-1 px-4 sm:px-6 lg:px-8 border-b border-white/10 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-0.2 rounded-full bg-white/20 text-white font-bold text-[10px] tracking-wide uppercase">
              PS3 • Deep Data 2026
            </span>
            <span className="text-blue-100">
              E-Commerce Transaction Fraud Detection System • Balanced Machine Learning &amp; XAI
            </span>
          </div>
          <div className="flex items-center space-x-4 text-blue-200">
            <span className="flex items-center space-x-1.5" title="Strict Chronological Validation Metrics (IEEE-CIS 16,000 Holdout)">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              <span className="font-mono text-[11px] text-white">AUROC: {aurocDisplay}% • PR-AUC: {auprcDisplay}%</span>
            </span>
            <span className="text-white/30">•</span>
            <button 
              onClick={() => setActiveTab('hackathon')} 
              className="text-white hover:text-blue-200 font-semibold underline underline-offset-2 transition"
            >
              Architecture &amp; Docs
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-[4.25rem]">
          
          {/* Logo & Brand Anchor */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group select-none"
            onClick={() => setActiveTab('landing')}
          >
            {/* Layered Custom Shield Badge */}
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 shadow-md shadow-blue-500/20 group-hover:scale-105 group-hover:shadow-blue-500/30 transition-all duration-200 ring-1 ring-black/5">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900 font-sans">
                  FraudShield<span className="text-blue-600 font-black">.AI</span>
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-extrabold tracking-wider uppercase rounded-md bg-blue-50 text-blue-700 border border-blue-200/80">
                  v2.0 PROD
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium hidden sm:block -mt-0.5">
                E-Commerce Risk Intelligence
              </span>
            </div>
          </div>

          {/* Desktop Segmented Navigation Pills (Linear / Apple style) */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200/90 font-bold scale-[1.02]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Simulation Controls */}
          <div className="hidden md:flex items-center space-x-2.5">
            {/* Quick Simulate 1x Event */}
            <button
              onClick={handleSingleSimClick}
              disabled={isSimulatingSingle}
              title="Inject a realistic checkout event"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200/90 hover:border-slate-300 text-xs font-semibold shadow-2xs active:scale-95 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isSimulatingSingle ? 'animate-spin' : ''}`} />
              <span>Simulate 1x</span>
            </button>

            {/* Live Feed Toggle */}
            <button
              onClick={toggleSimulation}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 shadow-sm active:scale-95 ${
                isSimulating
                  ? 'bg-rose-50 text-rose-700 border border-rose-300 hover:bg-rose-100 shadow-rose-500/10 ring-2 ring-rose-400/20 animate-pulse'
                  : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/25 hover:shadow-blue-500/35'
              }`}
            >
              {isSimulating ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-rose-600 animate-ping"></span>
                  <Pause className="w-3.5 h-3.5 text-rose-600" />
                  <span>Stop Stream</span>
                </>
              ) : (
                <>
                  <Radio className="w-3.5 h-3.5" />
                  <span>Start Live Feed</span>
                </>
              )}
            </button>
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-900 transition"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Dropdown Tray */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 shadow-xl animate-slide-up">
          
          {/* Navigation Links */}
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 font-bold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
          
          {/* Action Simulation Buttons */}
          <div className="pt-3 border-t border-slate-200/80 grid grid-cols-2 gap-2">
            <button
              onClick={handleSingleSimClick}
              disabled={isSimulatingSingle}
              className="flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isSimulatingSingle ? 'animate-spin' : ''}`} />
              <span>Simulate 1x</span>
            </button>
            
            <button
              onClick={toggleSimulation}
              className={`flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition shadow-sm ${
                isSimulating 
                  ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isSimulating ? 'Stop Stream' : 'Live Feed'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
