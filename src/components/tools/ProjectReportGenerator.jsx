import React, { useState } from 'react';
import { 
  FileText, Printer, Download, Copy, Check, 
  Sparkles, BookOpen, Layers, CheckCircle2, ChevronRight 
} from 'lucide-react';

export default function ProjectReportGenerator({ initialData = null }) {
  const [report, setReport] = useState(initialData || {
    title: 'NexusOps: Autonomous Incident Triage and Self-Healing Infrastructure Agent',
    team: 'Team CyberSentinels (Alex Rivera, Priya Sharma, David Chen)',
    college: 'School of Engineering & Technology — Hackathon 2026',
    abstract: 'Cloud outages cost global enterprises over $4.2B annually. Traditional APM monitoring tools merely alert exhausted on-call engineers at 3 AM without diagnosing root causes. This project introduces NexusOps, an autonomous incident remediation agent combining Linux eBPF kernel tracing with deterministic Abstract Syntax Tree (AST) code synthesis to triage, reproduce, and hotfix production failures in under 90 seconds.',
    problemStatement: 'Modern microservice architectures generate millions of unindexed telemetry lines per minute during failure cascades. Human Mean-Time-To-Resolution (MTTR) averages 4.8 hours per critical outage.',
    objectives: [
      'Implement real-time Linux kernel telemetry ingestion via eBPF probes with sub-400ms anomaly detection.',
      'Develop an LLM agentic repair loop leveraging Claude 3.5 Sonnet to synthesize deterministic AST git patches.',
      'Deploy ephemeral Docker staging preview sandboxes to run end-to-end integration tests prior to code commit.',
      'Provide interactive Slack/Teams approval cards enabling 1-click human verification and deployment.'
    ],
    methodology: 'The system utilizes a 4-tier pipeline: (1) Kernel Telemetry via eBPF daemon, (2) Vector-based contextual RAG over git blame histories, (3) Iterative AST synthesis avoiding unstructured hallucination, and (4) Ephemeral sandbox container verification.',
    implementation: 'Built with React 19, FastAPI, Vector Daemon, Docker Engine, and Kafka. Evaluated across 25 historical open-source outages from the BugSwarm dataset.',
    results: 'Achieved an 88% autonomous resolution rate across 25 simulated test outages, reducing average MTTR from 4.8 hours to 92 seconds. Average inference cost was $0.14 per incident compared to $600 human engineering on-call cost.',
    limitations: 'Complex multi-database distributed deadlocks requiring manual architectural redesign still require senior staff intervention.',
    futureScope: 'Multi-cloud orchestration across AWS, GCP, and Azure, plus automated SOC2 compliance auditing logs.'
  });

  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleExportMarkdown = () => {
    let md = `# ${report.title}\n\n`;
    md += `**Team:** ${report.team}  \n`;
    md += `**Institution:** ${report.college}\n\n`;
    md += `## Abstract\n${report.abstract}\n\n`;
    md += `## 1. Problem Statement\n${report.problemStatement}\n\n`;
    md += `## 2. Objectives\n`;
    report.objectives.forEach((obj, i) => { md += `${i + 1}. ${obj}\n`; });
    md += `\n## 3. Methodology & Architecture\n${report.methodology}\n\n`;
    md += `## 4. Implementation Details\n${report.implementation}\n\n`;
    md += `## 5. Experimental Results & Benchmarks\n${report.results}\n\n`;
    md += `## 6. Limitations\n${report.limitations}\n\n`;
    md += `## 7. Future Scope\n${report.futureScope}\n`;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project-report-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col h-full overflow-hidden select-none">
      
      {/* Top action bar */}
      <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between no-print">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-sm">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 font-sans">
              SIH & College Project Report Generator
            </h2>
            <p className="text-[11px] text-slate-500 font-sans">
              Standard academic documentation with printable PDF and Markdown export.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportMarkdown}
            className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Markdown</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Main Document Workspace */}
      <div className="flex-1 overflow-y-auto p-4 md:p-10 flex justify-center">
        
        {/* Printable Paper Document (A4 Styling) */}
        <div className="w-full max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-xl p-8 md:p-14 text-slate-800 font-sans space-y-6">
          
          {/* Header & Title */}
          <div className="text-center border-b border-slate-200 pb-6">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 mb-2">
              PROJECT DOCUMENTATION REPORT &bull; HACKATHON DELIVERABLE
            </div>
            <input
              type="text"
              value={report.title}
              onChange={(e) => setReport({ ...report, title: e.target.value })}
              className="text-2xl md:text-3xl font-black text-slate-900 w-full text-center border-b border-dashed border-slate-300 pb-2 focus:outline-none focus:border-emerald-500"
            />
            <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-500">
              <input
                type="text"
                value={report.team}
                onChange={(e) => setReport({ ...report, team: e.target.value })}
                className="text-center bg-transparent border-b border-slate-200 w-80 focus:outline-none"
              />
              <span>&bull;</span>
              <input
                type="text"
                value={report.college}
                onChange={(e) => setReport({ ...report, college: e.target.value })}
                className="text-center bg-transparent border-b border-slate-200 w-72 focus:outline-none"
              />
            </div>
          </div>

          {/* Abstract Box */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-600" /> Executive Abstract
            </h3>
            <textarea
              value={report.abstract}
              onChange={(e) => setReport({ ...report, abstract: e.target.value })}
              rows={4}
              className="w-full bg-transparent border-none text-xs md:text-sm text-slate-700 leading-relaxed resize-none focus:outline-none"
            />
          </div>

          {/* 1. Problem Statement */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 font-mono flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs flex items-center justify-center font-bold">1</span>
              Problem Statement & Background
            </h3>
            <textarea
              value={report.problemStatement}
              onChange={(e) => setReport({ ...report, problemStatement: e.target.value })}
              rows={3}
              className="w-full p-3 rounded-lg border border-slate-200 text-xs md:text-sm text-slate-700 leading-relaxed focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* 2. Objectives */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 font-mono flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs flex items-center justify-center font-bold">2</span>
              Key Project Objectives
            </h3>
            <div className="space-y-2">
              {report.objectives.map((obj, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs md:text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <input
                    type="text"
                    value={obj}
                    onChange={(e) => {
                      const updated = [...report.objectives];
                      updated[idx] = e.target.value;
                      setReport({ ...report, objectives: updated });
                    }}
                    className="w-full border-b border-dashed border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 3. Methodology & System Architecture */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 font-mono flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs flex items-center justify-center font-bold">3</span>
              Methodology & Proposed Solution
            </h3>
            <textarea
              value={report.methodology}
              onChange={(e) => setReport({ ...report, methodology: e.target.value })}
              rows={3}
              className="w-full p-3 rounded-lg border border-slate-200 text-xs md:text-sm text-slate-700 leading-relaxed focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* 4. Results & Benchmarks */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 font-mono flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs flex items-center justify-center font-bold">4</span>
              Experimental Results & Metrics
            </h3>
            <textarea
              value={report.results}
              onChange={(e) => setReport({ ...report, results: e.target.value })}
              rows={3}
              className="w-full p-3 rounded-lg border border-slate-200 text-xs md:text-sm text-slate-700 leading-relaxed focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* 5. Future Scope */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 font-mono flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs flex items-center justify-center font-bold">5</span>
              Future Scope & Commercial Roadmap
            </h3>
            <textarea
              value={report.futureScope}
              onChange={(e) => setReport({ ...report, futureScope: e.target.value })}
              rows={2}
              className="w-full p-3 rounded-lg border border-slate-200 text-xs md:text-sm text-slate-700 leading-relaxed focus:outline-none focus:border-emerald-500"
            />
          </div>

        </div>

      </div>

    </div>
  );
}
