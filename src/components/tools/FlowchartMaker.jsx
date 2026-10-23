import React, { useState } from 'react';
import { GitFork, Plus, Copy, Check, Trash2, ArrowRight } from 'lucide-react';

export default function FlowchartMaker() {
  const [steps, setSteps] = useState([
    { id: '1', name: 'User Trigger / Webhook', type: 'start', desc: 'Receives webhook payload from GitHub or Slack' },
    { id: '2', name: 'Validate API Authentication', type: 'decision', desc: 'Is API key valid and within rate limits?' },
    { id: '3', name: 'eBPF Anomaly Parser', type: 'process', desc: 'Parses kernel stack traces into deterministic AST tokens' },
    { id: '4', name: 'Claude 3.5 Healer Agent', type: 'process', desc: 'Generates targeted git patch with regression tests' },
    { id: '5', name: 'Deploy Ephemeral Sandbox', type: 'end', desc: 'Runs end-to-end integration tests & awaits Slack approval' }
  ]);

  const [copied, setCopied] = useState(false);

  const handleAddStep = () => {
    const newStep = {
      id: String(steps.length + 1),
      name: `Step ${steps.length + 1}: Process Logic`,
      type: 'process',
      desc: 'Describe what occurs in this execution branch.'
    };
    setSteps([...steps, newStep]);
  };

  const handleDeleteStep = (id) => {
    setSteps(steps.filter(s => s.id !== id));
  };

  const getMermaidCode = () => {
    let code = "graph TD\n";
    steps.forEach((s, idx) => {
      const shape = s.type === 'decision' ? `{${s.name}}` : s.type === 'start' ? `([${s.name}])` : `[${s.name}]`;
      code += `  S${s.id}${shape}\n`;
      if (idx < steps.length - 1) {
        code += `  S${s.id} --> S${steps[idx + 1].id}\n`;
      }
    });
    return code;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getMermaidCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col h-full overflow-hidden select-none">
      
      {/* Top Header */}
      <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-600 text-white flex items-center justify-center shadow-sm">
            <GitFork className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 font-sans">
              Flowchart & Algorithm Workflow Maker
            </h2>
            <p className="text-[11px] text-slate-500 font-sans">
              Create process diagrams, decision logic, and export live Mermaid.js code.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddStep}
            className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Step</span>
          </button>
          <button
            onClick={handleCopy}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1 shadow"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Mermaid!' : 'Copy Mermaid Code'}</span>
          </button>
        </div>
      </div>

      {/* Main Flow Canvas */}
      <div className="flex-1 overflow-y-auto p-6 md:p-12 flex flex-col items-center">
        <div className="max-w-xl w-full space-y-4">
          {steps.map((step, idx) => (
            <div key={step.id} className="relative flex flex-col items-center">
              {/* Step Card */}
              <div className={`w-full p-4 rounded-2xl border-2 shadow-sm bg-white transition-all ${
                step.type === 'decision' 
                  ? 'border-amber-400 bg-amber-50/40' 
                  : step.type === 'start' 
                  ? 'border-indigo-400 bg-indigo-50/40' 
                  : 'border-slate-300'
              }`}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono text-xs flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <select
                      value={step.type}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSteps(steps.map(s => s.id === step.id ? { ...s, type: val } : s));
                      }}
                      className="text-[10px] font-mono font-bold uppercase rounded px-2 py-0.5 border border-slate-300 bg-white"
                    >
                      <option value="start">Start Trigger</option>
                      <option value="process">Execution Process</option>
                      <option value="decision">Decision Diamond</option>
                      <option value="end">Final Output</option>
                    </select>
                  </div>

                  {steps.length > 2 && (
                    <button
                      onClick={() => handleDeleteStep(step.id)}
                      className="p-1 rounded text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  value={step.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSteps(steps.map(s => s.id === step.id ? { ...s, name: val } : s));
                  }}
                  className="w-full font-bold text-sm text-slate-900 border-none outline-none focus:bg-slate-50 rounded px-1"
                />

                <textarea
                  value={step.desc}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSteps(steps.map(s => s.id === step.id ? { ...s, desc: val } : s));
                  }}
                  rows={2}
                  className="w-full text-xs text-slate-600 mt-1 border-none outline-none resize-none focus:bg-slate-50 rounded px-1"
                />
              </div>

              {/* Connecting Down Arrow */}
              {idx < steps.length - 1 && (
                <div className="py-2 flex flex-col items-center text-slate-400 font-bold">
                  <div className="w-0.5 h-6 bg-slate-300" />
                  <span className="text-xs">▼</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
