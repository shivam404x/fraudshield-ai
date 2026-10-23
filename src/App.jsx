import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import TransactionMonitoring from './components/TransactionMonitoring';
import TransactionModal from './components/TransactionModal';
import FraudAnalyzer from './components/FraudAnalyzer';
import ModelPerformance from './components/ModelPerformance';
import HackathonShowcase from './components/HackathonShowcase';
import Toast from './components/Toast';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('landing');
  const [overviewData, setOverviewData] = useState(null);
  const [metricsData, setMetricsData] = useState(null);
  const [healthStatus, setHealthStatus] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Simulation controls
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(4000);
  const [simulationBias, setSimulationBias] = useState(0.25);
  const simTimerRef = useRef(null);

  // Toast notification helper
  const notify = (message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev.slice(-4), { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Initial Data Fetch
  const refreshAllData = async () => {
    try {
      const [h, o, m] = await Promise.all([
        api.getHealth().catch(() => null),
        api.getOverview().catch(() => null),
        api.getMetrics().catch(() => null),
      ]);
      if (h) setHealthStatus(h);
      if (o) setOverviewData(o);
      if (m) setMetricsData(m);
    } catch (err) {
      console.error('Data refresh error:', err);
    }
  };

  useEffect(() => {
    refreshAllData();
    const interval = setInterval(refreshAllData, 15000);
    return () => clearInterval(interval);
  }, []);

  // Quick 1x Simulation
  const handleQuickSimulate = async () => {
    try {
      const tx = await api.simulateSingle(simulationBias);
      notify(`Simulated checkout: ${tx.id} (${tx.risk_tier} - $${tx.amount.toFixed(2)})`, 
        tx.risk_tier === 'High Risk' ? 'error' : tx.risk_tier === 'Medium Risk' ? 'warning' : 'success'
      );
      refreshAllData();
    } catch (err) {
      notify(`Simulation failed: ${err.message}`, 'error');
    }
  };

  // Continuous Simulation Feed
  const toggleSimulation = () => {
    setIsSimulating((prev) => {
      const next = !prev;
      if (next) {
        notify('Live simulation stream started. Generating transaction feed.', 'info');
      } else {
        notify('Simulation stream paused.', 'info');
      }
      return next;
    });
  };

  useEffect(() => {
    if (isSimulating) {
      simTimerRef.current = setInterval(async () => {
        try {
          const tx = await api.simulateSingle(simulationBias);
          if (tx.risk_tier === 'High Risk') {
            notify(`🚨 High-Risk Intercepted: ${tx.id} ($${tx.amount.toFixed(2)})`, 'error');
          }
          api.getOverview().then(setOverviewData).catch(() => {});
        } catch (err) {
          console.error('Simulation loop error:', err);
        }
      }, simulationSpeed);
    } else {
      if (simTimerRef.current) clearInterval(simTimerRef.current);
    }
    return () => {
      if (simTimerRef.current) clearInterval(simTimerRef.current);
    };
  }, [isSimulating, simulationSpeed, simulationBias]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col fintech-grid font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSimulating={isSimulating}
        toggleSimulation={toggleSimulation}
        onQuickSimulate={handleQuickSimulate}
        healthStatus={healthStatus}
        overviewData={overviewData}
        metricsData={metricsData}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {activeTab === 'landing' && (
          <LandingPage
            onGetStarted={() => setActiveTab('dashboard')}
            onTrySandbox={() => setActiveTab('analyzer')}
            overviewData={overviewData}
            metricsData={metricsData}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard
            overviewData={overviewData}
            metricsData={metricsData}
            isSimulating={isSimulating}
            toggleSimulation={toggleSimulation}
            onQuickSimulate={handleQuickSimulate}
            simulationSpeed={simulationSpeed}
            setSimulationSpeed={setSimulationSpeed}
            simulationBias={simulationBias}
            setSimulationBias={setSimulationBias}
            onInspectTransaction={(tx) => setSelectedTransaction(tx)}
            onNavigateToMonitor={() => setActiveTab('monitor')}
            onNavigateToAnalyzer={() => setActiveTab('analyzer')}
          />
        )}

        {activeTab === 'monitor' && (
          <TransactionMonitoring
            onInspectTransaction={(tx) => setSelectedTransaction(tx)}
            onNotify={notify}
          />
        )}

        {activeTab === 'analyzer' && (
          <FraudAnalyzer
            onInspectTransaction={(tx) => setSelectedTransaction(tx)}
            onNavigateToMonitor={() => setActiveTab('monitor')}
            onNotify={notify}
          />
        )}

        {activeTab === 'performance' && (
          <ModelPerformance
            metricsData={metricsData}
          />
        )}

        {activeTab === 'hackathon' && (
          <HackathonShowcase
            onNavigateToAnalyzer={() => setActiveTab('analyzer')}
          />
        )}
      </main>

      {/* Forensic Inspection Modal */}
      {selectedTransaction && (
        <TransactionModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          onStatusUpdated={() => {
            refreshAllData();
          }}
          onNotify={notify}
        />
      )}

      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Modern Fintech Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-xs text-slate-500 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <div className="font-bold text-slate-800">
              FraudShield AI — Intelligent E-Commerce Fraud Detection System
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Deep Data Hackathon 2026 • Real-Time Scikit-Learn Inference & XAI Engine
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono">
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-blue-700 font-bold">
              React 19 + Vite
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-indigo-700 font-bold">
              FastAPI Python
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-purple-700 font-bold">
              Balanced RF Model
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-emerald-700 font-bold">
              SQLite Audit Ledger
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
