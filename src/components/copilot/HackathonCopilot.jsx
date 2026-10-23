import React, { useState } from 'react';
import { 
  Bot, Sparkles, Send, Copy, Check, Wand2, 
  HelpCircle, ShieldAlert, Cpu, Terminal, ArrowRight, RefreshCw, Zap 
} from 'lucide-react';

export const COPILOT_SHORTCUTS = [
  { id: 'roast', label: '🔥 Roast My Idea', prompt: 'Be a tough Silicon Valley & Hackathon judge. Brutally critique this hackathon idea and point out its 3 biggest vulnerabilities, then suggest how to fix them.' },
  { id: 'refine', label: '🎯 Refine Problem Statement', prompt: 'Turn this vague problem statement into a crisp, quantifiable $10B pain point that makes hackathon judges immediately lean forward.' },
  { id: 'stack', label: '⚡ Recommend Tech Stack', prompt: 'Recommend the fastest, most impressive modern tech stack to build this prototype within a 24-hour hackathon sprint. Highlight sponsor-track APIs.' },
  { id: 'judge-qa', label: '🛡️ Simulate Tough Judge Questions', prompt: 'What are the 5 hardest, most skeptical questions hackathon judges will ask during the 2-minute Q&A round? Provide knockout winning answers for each.' },
  { id: 'architecture', label: '🛠️ Suggest System Architecture', prompt: 'Outline the full end-to-end system architecture for this project, including client, API gateway, async worker queues, LLM reasoning loops, and database storage.' },
  { id: 'demo-script', label: '🎬 2-Minute Demo Script', prompt: 'Write a high-energy, word-for-word 2-minute hackathon stage demo script following the Hook -> Problem -> Live Demo -> Tech Depth -> Close structure.' }
];

export default function HackathonCopilot({ onInsertToProject }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `👋 **Hey hacker! I am your Hackathon AI Copilot.**\n\nI can help you:\n- **Validate and refine your idea** into a winning narrative\n- **Design system architecture** and database schemas\n- **Anticipate brutal judge Q&A questions** and craft defense scripts\n- **Prioritize your MVP** for the 24-hour sprint\n\nType your project details below or click one of the quick power prompts!`
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);

  const handleSend = (textToSend = null) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { role: 'user', content: query };
    const updated = [...messages, userMsg];
    setMessages(updated);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // AI Copilot simulation response
    setTimeout(() => {
      let reply = '';
      const lower = query.toLowerCase();

      if (lower.includes('roast') || lower.includes('critique')) {
        reply = `### 🔥 Brutal Judge Roast & Winning Pivot:

**1. The "OpenAI Wrapper" Risk:**
If your project is just a system prompt over Claude or GPT-4, judges will dismiss it in 20 seconds.
- *How to fix:* Add deterministic edge filtering, eBPF telemetry, local AST tree rewriting, or a custom vector indexing strategy.

**2. The 24-Hour Scope Trap:**
You are trying to build an entire platform instead of nailing 1 killer workflow.
- *How to fix:* Build a vertical slice that executes in under 3 seconds live on stage.

**3. Business Viability Skepticism:**
"Why won't Datadog or GitHub build this next week?"
- *Winning defense:* Datadog charges per gigabyte of ingested logs; their business model relies on log volume, while your engine reduces log bloat autonomously.`;
      } else if (lower.includes('refine') || lower.includes('problem')) {
        reply = `### 🎯 High-Impact Problem Statement Formula:

**Weak Problem:** *"Developers spend too much time debugging outages on-call."*

**Winning Hackathon Problem:**
> *"Software teams bleed **$9,000 per minute of production downtime**, with engineers spending **42% of on-call shifts** drowning in 10,000+ unindexed telemetry logs. Existing APM monitors scream that the house is on fire, but force exhausted humans to debug at 3 AM."*

**Judges' Reaction:** Quantifiable dollar loss + emotional relatable agony = instant attention!`;
      } else if (lower.includes('judge') || lower.includes('q&a')) {
        reply = `### 🛡️ Top 3 Judge Traps & Knockout Answers:

**Q1: "Can this scale to enterprise workloads?"**
> *You say:* "Yes. Our workers are completely stateless and containerized on Docker, allowing auto-scaling across AWS Graviton nodes with zero database lock contention."

**Q2: "What if your AI hallucinates a breaking code change?"**
> *You say:* "Our agent generates AST tree diffs rather than unstructured text, and passes them through an ephemeral sandbox with our existing test suite before asking for 1-click human Slack approval."

**Q3: "Did you actually build this in the hackathon?"**
> *You say:* "Every single microservice running here was written in the last 20 hours. You can inspect our initial git commit timestamp and GitHub commit graph right now."`;
      } else {
        reply = `### 🚀 Hackathon Strategy Blueprint for: "${query.substring(0, 40)}..."

1. **The 3-Minute Pitch Hook:**
   - Open with the agony: *"Every day, users waste 3 hours doing X manually..."*
   - Show the live fix at minute 1:00 (never wait until the end!).

2. **Recommended 24h Architecture:**
   - **Frontend:** Next.js 15 or React + Tailwind for instant slick UI.
   - **Backend:** FastAPI or Fastify for sub-10ms response times.
   - **Intelligence:** Claude 3.5 Sonnet + function-calling tools.
   - **Storage:** Supabase / PostgreSQL with pgvector.

3. **Winning Metric to Show:**
   - Show a benchmark comparison graph: **10x Speedup** and **85% Cost Drop**.`;
      }

      setMessages([...updated, { role: 'assistant', content: reply }]);
      setIsTyping(false);
    }, 700);
  };

  const handleCopy = (idx, text) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col h-full overflow-hidden select-none">
      
      {/* Header */}
      <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 font-sans flex items-center gap-1.5">
              <span>Hackathon AI Copilot</span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-700">Claude 3.5</span>
            </h2>
            <p className="text-[11px] text-slate-500 font-sans">
              Real-time advice on idea validation, architecture, judge Q&A, and pitch scripts.
            </p>
          </div>
        </div>

        <button
          onClick={() => setMessages([messages[0]])}
          className="text-xs font-mono text-slate-400 hover:text-slate-700 flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" /> Reset Chat
        </button>
      </div>

      {/* Quick Prompt Shortcuts Bar */}
      <div className="bg-slate-100/80 px-4 py-2 border-b border-slate-200 overflow-x-auto flex items-center gap-2 scrollbar-none">
        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase shrink-0">Prompts:</span>
        {COPILOT_SHORTCUTS.map(sc => (
          <button
            key={sc.id}
            onClick={() => handleSend(sc.prompt)}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 text-xs font-sans whitespace-nowrap shadow-2xs transition-colors shrink-0 font-medium"
          >
            {sc.label}
          </button>
        ))}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {messages.map((m, idx) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={idx}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold ${
                isUser ? 'bg-slate-900 text-white' : 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-sm'
              }`}>
                {isUser ? 'You' : <Bot className="w-4 h-4" />}
              </div>

              <div className={`relative max-w-2xl rounded-2xl p-4 text-xs md:text-sm font-sans leading-relaxed ${
                isUser 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'bg-white border border-slate-200/90 text-slate-800 shadow-xs'
              }`}>
                {/* Content formatted with markdown lines */}
                <div className="whitespace-pre-line">
                  {m.content}
                </div>

                {!isUser && (
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <button
                      onClick={() => handleCopy(idx, m.content)}
                      className="hover:text-slate-700 flex items-center gap-1 font-mono"
                    >
                      {copiedIdx === idx ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedIdx === idx ? 'Copied to clipboard' : 'Copy response'}</span>
                    </button>

                    {onInsertToProject && (
                      <button
                        onClick={() => onInsertToProject(m.content)}
                        className="text-indigo-600 font-bold hover:underline flex items-center gap-1"
                      >
                        <span>Insert to Presentation</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 pl-11">
            <Sparkles className="w-3.5 h-3.5 animate-spin text-purple-600" />
            <span>AI Copilot is formulating answer...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="relative max-w-4xl mx-auto flex items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Copilot anything: 'How to structure my 3-minute pitch?', 'Architecture for eBPF agent'..."
            className="w-full pl-4 pr-24 py-3 rounded-2xl bg-slate-100 border border-slate-200 text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-sans"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="absolute right-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center gap-1 disabled:opacity-40 transition-transform active:scale-95"
          >
            <span>Send</span>
            <Send className="w-3 h-3" />
          </button>
        </form>
      </div>

    </div>
  );
}
