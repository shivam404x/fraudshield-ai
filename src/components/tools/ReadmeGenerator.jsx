import React, { useState } from 'react';
import { FileCode, Copy, Check, Download, Sparkles } from 'lucide-react';

export default function ReadmeGenerator() {
  const [repoName, setRepoName] = useState('nexusops-agent');
  const [description, setDescription] = useState('Autonomous DevOps agent that triages and hotfixes Kubernetes outages in 90 seconds.');
  const [techStack, setTechStack] = useState('React, TypeScript, FastAPI, Claude 3.5, Docker, eBPF');
  const [installCmd, setInstallCmd] = useState('npm install && npm run dev');
  const [copied, setCopied] = useState(false);

  const generateMarkdown = () => {
    return `# 🚀 ${repoName}

> ${description}

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Hackathon 2026](https://img.shields.io/badge/Hackathon-Shipped%20in%2024h-blue.svg)](https://devpost.com)

---

## 🌟 Key Features
- ⚡ **Sub-90s MTTR**: Autonomously triages microservice failure cascades in seconds.
- 🧠 **Deterministic AST Patching**: Zero-hallucination syntax tree git diff generation.
- 🛡️ **Ephemeral Preview Sandbox**: End-to-end containerized regression testing before PR.
- 💬 **1-Click Slack Integration**: Interactive incident cards for human-in-the-loop approvals.

---

## 🛠️ Tech Stack
${techStack.split(',').map(s => `- **${s.trim()}**`).join('\n')}

---

## 🚀 Quick Start

### 1. Clone Repository
\`\`\`bash
git clone https://github.com/hackforge/${repoName}.git
cd ${repoName}
\`\`\`

### 2. Install & Run
\`\`\`bash
${installCmd}
\`\`\`

---

## 👥 Team & Hackathon Credentials
- **Lead Architect**: Backend pipeline and eBPF telemetry
- **Core AI Engineer**: Claude 3.5 AST synthesis loop
- **Product & Frontend**: Interactive UI and presentation

---
*Built with ❤️ during Hackathon 2026.*`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generateMarkdown()], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col h-full overflow-hidden select-none">
      
      {/* Top Header */}
      <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-stone-700 to-stone-900 text-white flex items-center justify-center shadow-sm">
            <FileCode className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 font-sans">
              GitHub README & Badge Generator
            </h2>
            <p className="text-[11px] text-slate-500 font-sans">
              Generate a star-worthy GitHub README.md file with badges and install scripts.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download README.md</span>
          </button>
          <button
            onClick={handleCopy}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Markdown!' : 'Copy Markdown'}</span>
          </button>
        </div>
      </div>

      {/* Main Split View: Editor & Live Preview */}
      <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Inputs */}
        <div className="w-full md:w-1/2 p-6 bg-white border-r border-slate-200 overflow-y-auto space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
              Repository Name:
            </label>
            <input
              type="text"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
              Elevator Pitch / Tagline:
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
              Tech Stack (Comma Separated):
            </label>
            <input
              type="text"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
              Install & Run Command:
            </label>
            <input
              type="text"
              value={installCmd}
              onChange={(e) => setInstallCmd(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
            />
          </div>
        </div>

        {/* Right Live Markdown Preview */}
        <div className="w-full md:w-1/2 p-6 bg-slate-900 text-slate-100 overflow-y-auto font-mono text-xs leading-relaxed select-text">
          <pre className="whitespace-pre-wrap">{generateMarkdown()}</pre>
        </div>

      </div>

    </div>
  );
}
