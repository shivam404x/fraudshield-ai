import React from 'react';
import { 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  AlertOctagon, 
  Cpu, 
  Zap, 
  Lock, 
  ArrowRight, 
  Clock, 
  Activity,
  Globe,
  Smartphone
} from 'lucide-react';

export default function PaymentPipelineVisual() {
  return (
    <div className="w-full rounded-2xl bg-gradient-to-br from-white via-slate-50 to-blue-50/30 border border-slate-200/90 shadow-sm p-4 sm:p-5 select-none transition-all hover:shadow-md">
      
      {/* Top Pipeline Bar */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 text-xs">
        <div className="flex items-center space-x-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-extrabold text-slate-800 text-[11px] tracking-wide uppercase">
            Real-Time Payment Security Pipeline
          </span>
        </div>
        <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-500">
          <span className="bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-700 border border-slate-200">
            Balanced RF v2.0
          </span>
          <span className="hidden sm:inline bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold border border-emerald-200">
            &lt; 15ms Latency
          </span>
        </div>
      </div>

      {/* 3-Stage Visual Pipeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        
        {/* Stage 1: Checkout Event Ingestion (4 cols) */}
        <div className="md:col-span-4 rounded-xl bg-white border border-slate-200/90 p-3.5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            <span className="flex items-center space-x-1.5 text-blue-600">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Checkout Event</span>
            </span>
            <span className="font-mono text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">
              0.8ms Ingest
            </span>
          </div>

          <div>
            <div className="text-[10px] text-slate-400 font-semibold">Order Total</div>
            <div className="text-xl font-extrabold text-slate-900 tracking-tight flex items-baseline space-x-1">
              <span>$489.50</span>
              <span className="text-[10px] text-slate-500 font-semibold">USD</span>
            </div>
          </div>

          {/* Telemetry Chips */}
          <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px] font-mono text-slate-600">
            <div className="flex items-center space-x-1 bg-slate-50 px-2 py-1 rounded border border-slate-200/70">
              <Globe className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">194.26.*.*</span>
            </div>
            <div className="flex items-center space-x-1 bg-slate-50 px-2 py-1 rounded border border-slate-200/70">
              <Smartphone className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">Win64 Chrome</span>
            </div>
          </div>
        </div>

        {/* Stage 2: Central AI Risk Engine (4 cols) */}
        <div className="md:col-span-4 rounded-xl bg-gradient-to-b from-blue-600 to-indigo-700 p-3.5 text-white shadow-md shadow-blue-500/15 flex flex-col justify-between space-y-2.5 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <div className="p-1 rounded-lg bg-white/20">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              <span className="font-black text-xs tracking-tight uppercase">AI Risk Engine</span>
            </div>
            <span className="text-[9px] font-mono font-bold bg-white/20 px-1.5 py-0.5 rounded">
              0–100 SCALE
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-blue-100 font-medium">Model:</span>
              <span className="font-bold text-white">Balanced Random Forest</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-blue-100 font-medium">Decision Latency:</span>
              <span className="font-mono font-bold text-emerald-300">11.4 ms</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-blue-100 font-medium">Explainability:</span>
              <span className="font-bold text-white">Local XAI Factors</span>
            </div>
          </div>

          <div className="bg-white/15 rounded-lg px-2.5 py-1 text-[10px] font-semibold flex items-center justify-between text-blue-50">
            <span>Validation AUROC</span>
            <span className="font-mono font-bold text-white">89.9%</span>
          </div>
        </div>

        {/* Stage 3: Real-Time Dual Triage Outcomes (4 cols) */}
        <div className="md:col-span-4 space-y-2">
          
          {/* Outcome A: Genuine Shopper Approved */}
          <div className="rounded-xl bg-white border border-emerald-200/90 p-2.5 shadow-2xs hover:border-emerald-300 transition-all flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 leading-tight">Genuine Shopper</div>
                <div className="text-[10px] text-emerald-600 font-semibold font-mono">Risk: 4/100 &bull; Auto-Approved</div>
              </div>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200/80">
              Zero Friction
            </span>
          </div>

          {/* Outcome B: Fraud Attack Intercepted */}
          <div className="rounded-xl bg-white border border-rose-200/90 p-2.5 shadow-2xs hover:border-rose-300 transition-all flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 shrink-0">
                <AlertOctagon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 leading-tight">Malicious Intercept</div>
                <div className="text-[10px] text-rose-600 font-semibold font-mono">Risk: 94/100 &bull; Proxy Burst</div>
              </div>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-200/80">
              Blocked
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
