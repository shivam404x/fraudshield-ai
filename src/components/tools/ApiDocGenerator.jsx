import React, { useState } from 'react';
import { Terminal, Copy, Check, Plus, Globe } from 'lucide-react';

export default function ApiDocGenerator() {
  const [endpoints, setEndpoints] = useState([
    {
      method: 'POST',
      path: '/api/v1/incidents/triage',
      description: 'Ingests kernel telemetry crash dump and initiates autonomous AST patch synthesis.',
      requestBody: '{\n  "service": "billing-api",\n  "cluster_id": "us-east-prod-04",\n  "trace_dump": "SIGSEGV in thread worker_pool.rs:142"\n}',
      responseJson: '{\n  "incident_id": "inc_98412",\n  "status": "patch_synthesized",\n  "resolution_time_ms": 842,\n  "git_diff_url": "https://github.com/org/repo/pull/482"\n}'
    },
    {
      method: 'GET',
      path: '/api/v1/incidents/{incident_id}/sandbox-status',
      description: 'Polls the ephemeral Docker staging container regression test status.',
      requestBody: 'None',
      responseJson: '{\n  "sandbox_id": "sbx_test_41",\n  "tests_passed": 142,\n  "tests_failed": 0,\n  "ready_to_merge": true\n}'
    }
  ]);

  const [copiedIdx, setCopiedIdx] = useState(null);

  const copyCurl = (ep, idx) => {
    const curl = `curl -X ${ep.method} "https://api.nexusops.dev${ep.path}" \\
  -H "Authorization: Bearer HACKATHON_TOKEN" \\
  -H "Content-Type: application/json" \\
  ${ep.requestBody !== 'None' ? `-d '${ep.requestBody.replace(/\n\s*/g, '')}'` : ''}`;

    navigator.clipboard.writeText(curl);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col h-full overflow-hidden select-none">
      
      {/* Top Header */}
      <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-700 to-teal-800 text-white flex items-center justify-center shadow-sm">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 font-sans">
              API Documentation Generator
            </h2>
            <p className="text-[11px] text-slate-500 font-sans">
              Document your backend endpoints with cURL testing snippets and JSON response schemas.
            </p>
          </div>
        </div>
      </div>

      {/* Endpoints List */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-4">
        {endpoints.map((ep, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono">
                <span className={`px-2 py-0.5 rounded text-xs font-black ${
                  ep.method === 'POST' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {ep.method}
                </span>
                <span className="text-sm font-bold text-slate-900">{ep.path}</span>
              </div>

              <button
                onClick={() => copyCurl(ep, idx)}
                className="px-3 py-1 rounded-lg border border-slate-200 text-xs font-mono font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
              >
                {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIdx === idx ? 'Copied cURL!' : 'Copy cURL'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-600 font-sans">{ep.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {ep.requestBody !== 'None' && (
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Request Body (JSON):</span>
                  <pre className="mt-1 p-3 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono overflow-x-auto">
                    {ep.requestBody}
                  </pre>
                </div>
              )}
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">200 OK Response (JSON):</span>
                <pre className="mt-1 p-3 rounded-xl bg-slate-900 text-emerald-300 text-xs font-mono overflow-x-auto">
                  {ep.responseJson}
                </pre>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
