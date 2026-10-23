import React, { useState } from 'react';
import { 
  X, Wand2, Sparkles, ArrowRight, ArrowLeft, 
  Check, Layers, Cpu, ShieldCheck, Flame, Loader2 
} from 'lucide-react';

export default function AIPitchWizard({
  isOpen = false,
  onClose,
  onGenerateDeck
}) {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genStage, setGenStage] = useState('');

  // Form inputs
  const [formData, setFormData] = useState({
    projectName: 'PulseGuard AI',
    track: 'AI Agents & Cybersecurity',
    pitchFormat: '3-min', // '3-min', '5-min', '10-min'
    tone: 'bold', // 'bold', 'technical', 'investor'
    problemStatement: 'Modern cloud infrastructures suffer from cascading microservice outages that take 4+ hours to diagnose, costing companies $12,000/minute.',
    proposedSolution: 'An autonomous agent that inspects kernel eBPF probes, isolates bad worker pods in under 400ms, and drafts deterministic AST hotfix PRs.',
    targetAudience: 'DevOps engineers, SRE leads, and cloud platform architects.',
    techStack: 'Rust, Claude 3.5 Sonnet, eBPF, Kubernetes Operator, React 19, ClickHouse',
    uniqueMoat: 'Kernel-level deterministic AST patch synthesis with zero hallucinations.',
    theme: 'kraft',
    fontStyle: 'hand'
  });

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStartGeneration = () => {
    setIsGenerating(true);

    const stages = [
      'Deconstructing problem statement & market friction...',
      'Synthesizing 4-stage technical architecture pipeline...',
      'Injecting anticipated hackathon judge Q&A defenses...',
      'Generating 8 high-impact slides with speaker notes...'
    ];

    let current = 0;
    setGenStage(stages[0]);

    const interval = setInterval(() => {
      current++;
      if (current < stages.length) {
        setGenStage(stages[current]);
      } else {
        clearInterval(interval);
        finalizeGeneration();
      }
    }, 700);
  };

  const finalizeGeneration = () => {
    const generatedDeck = {
      id: `deck-${Date.now()}`,
      name: `${formData.projectName} — AI Pitch Deck`,
      track: formData.track,
      theme: formData.theme || 'kraft',
      fontStyle: formData.fontStyle || 'hand',
      highlighterColor: 'yellow',
      slides: [
        {
          id: `s1-${Date.now()}`,
          layout: 'title-hero',
          badge: `🚀 ${formData.track.toUpperCase()}`,
          title: formData.projectName,
          subtitle: formData.proposedSolution,
          stamp: '100% SHIPPED MVP',
          bulletList: [
            `⚡ Tech Stack: ${formData.techStack}`,
            `🎯 Built for: ${formData.targetAudience}`,
            `🛡️ Key Moat: ${formData.uniqueMoat}`
          ],
          stickyNotes: [
            { id: 'sn-1', title: 'HACKATHON HOOK', text: 'Kick off with the raw metric: why existing solutions bleed money.', color: 'yellow', angle: '-2deg' }
          ],
          stickers: [
            { type: 'rocket', label: '10x Faster', x: '82%', y: '16%' }
          ],
          speakerNotes: `Judges, meet ${formData.projectName}. We built this project to solve the critical crisis in ${formData.track.toLowerCase()}. Let us show you how we solve it deterministically in seconds.`,
          judgeQA: {
            q: `What was the hardest technical hurdle while building ${formData.projectName}?`,
            a: `Integrating ${formData.techStack.split(',')[0] || 'the core engine'} in a low-latency loop while ensuring zero downtime.`
          },
          timeSeconds: 20
        },
        {
          id: `s2-${Date.now()}`,
          layout: 'old-vs-new',
          badge: '⚠️ THE BREAKING POINT',
          title: 'The Outdated Legacy Workflow',
          subtitle: 'Why current market alternatives fail under stress.',
          leftCol: {
            title: 'Current Painful Status Quo',
            items: [
              formData.problemStatement,
              'Slow manual intervention requiring hours of human debugging',
              'Fragmented tooling with zero automated remediation',
              'Excessive operational burn and lost revenue'
            ]
          },
          rightCol: {
            title: `Our Hack: ${formData.projectName}`,
            items: [
              formData.proposedSolution,
              formData.uniqueMoat,
              'Automated end-to-end execution loop in under 2 seconds',
              'Deterministic sandbox verification before deployment'
            ]
          },
          stickyNotes: [
            { id: 'sn-2', title: 'JUDGE PROOF', text: 'Contrast the legacy 4-hour delay against our sub-second benchmark.', color: 'pink', angle: '2deg' }
          ],
          speakerNotes: 'Look at the comparison. Current workflows are manual, brittle, and expensive. We engineered our hack to deliver an automated, sub-second paradigm shift.',
          judgeQA: {
            q: 'Why hasn’t an established incumbent solved this already?',
            a: 'Incumbents are constrained by legacy SaaS architecture and revenue models tied to manual billable hours.'
          },
          timeSeconds: 25
        },
        {
          id: `s3-${Date.now()}`,
          layout: 'bento-grid',
          badge: '💡 CORE INNOVATION',
          title: 'Three Pillars of Our Breakthrough',
          subtitle: 'Engineered for reliability, instant deployment, and zero hallucinations.',
          cards: [
            { icon: '⚡', title: '1. Intelligent Ingestion', description: `Processes real-time telemetry with sub-millisecond overhead.`, tag: 'Low Overhead' },
            { icon: '🧠', title: '2. Reasoning Core', description: `${formData.uniqueMoat} with self-correcting logic.`, tag: 'Automated AI' },
            { icon: '🛡️', title: '3. Verified Execution', description: 'Deterministic safety sandbox running automated tests before approval.', tag: 'Zero Risk' }
          ],
          stickyNotes: [
            { id: 'sn-3', title: 'TECHNICAL MOAT', text: 'Judges love seeing deterministic pipelines rather than blind LLM prompts.', color: 'yellow', angle: '-3deg' }
          ],
          speakerNotes: 'Here is our core three-pillar foundation. Telemetry ingestion, deterministic reasoning, and sandboxed verification.',
          judgeQA: {
            q: 'How do you prevent false positives?',
            a: 'Every generated action passes through an isolated simulation container with integration test verification before reaching production.'
          },
          timeSeconds: 25
        },
        {
          id: `s4-${Date.now()}`,
          layout: 'architecture-flow',
          badge: '🛠️ SYSTEM ARCHITECTURE',
          title: 'End-to-End Pipeline',
          subtitle: 'From incoming telemetry to verified automated execution.',
          steps: [
            { number: '01', title: 'Telemetry Listener', detail: 'Captures raw signals & anomalies directly at the source.' },
            { number: '02', title: 'Stateless Queue', detail: 'Parallel worker routing across low-latency edge nodes.' },
            { number: '03', title: 'Inference Engine', detail: `Powered by ${formData.techStack.split(',')[1] || 'LLM Agent'} with strict schema validation.` },
            { number: '04', title: 'Verified Hotfix', detail: '1-click deployment with signed cryptographic verification.' }
          ],
          speakerNotes: 'Walking through our architecture: Data enters via our telemetry listener, gets routed through our queue, processed by our reasoning engine, and produces a verified result.',
          judgeQA: {
            q: 'Does this architecture scale horizontally?',
            a: 'Yes, our listener and worker queue are completely stateless and can scale to millions of concurrent requests on Kubernetes.'
          },
          timeSeconds: 30
        },
        {
          id: `s5-${Date.now()}`,
          layout: 'metrics-traction',
          badge: '📊 TRACTION & BENCHMARKS',
          title: 'Validated Hackathon Metrics',
          subtitle: 'Real empirical results measured during our 24-hour build.',
          stats: [
            { value: '12x', label: 'Faster Resolution', note: 'Validated vs manual on-call baseline' },
            { value: '99.4%', label: 'Deterministic Accuracy', note: 'Over 120 synthetic test suites' },
            { value: '$0.002', label: 'Cost Per Remediation', note: 'Through edge caching & pruned models' }
          ],
          speakerNotes: 'We did not just write code; we benchmarked it. We achieved a 12x speedup and 99.4% deterministic accuracy across over a hundred test scenarios.',
          judgeQA: {
            q: 'How was the 99.4% accuracy benchmark calculated?',
            a: 'We ran 120 automated test cases against simulated microservice failure scenarios in an isolated staging cluster.'
          },
          timeSeconds: 25
        },
        {
          id: `s6-${Date.now()}`,
          layout: 'judge-defense',
          badge: '🛡️ JUDGE PRE-EMPTION',
          title: 'Why Our Solution Wins',
          subtitle: 'Direct defense against the hardest judging questions.',
          defensePoints: [
            { title: 'Deterministic Safety over Hallucinations', desc: 'No open-ended unvalidated prompts. Every diff is verified on a concrete Abstract Syntax Tree.' },
            { title: 'Zero Cold Start Overhead', desc: `Built with ${formData.techStack.split(',')[0] || 'Rust'} for instant sub-millisecond execution.` },
            { title: 'Extensible Developer Experience', desc: 'Ships with native CLI, REST API endpoints, and real-time webhook listeners.' }
          ],
          speakerNotes: 'Judges will inevitably ask about safety and feasibility. We designed every layer to be deterministic, sandboxed, and backward-compatible.',
          judgeQA: {
            q: 'What happens if a network partition occurs mid-execution?',
            a: 'Our queue utilizes idempotent transactional state rollback so no partial updates can ever corrupt the system.'
          },
          timeSeconds: 25
        },
        {
          id: `s7-${Date.now()}`,
          layout: 'team-hackers',
          badge: '👥 TEAM & CREDENTIALS',
          title: 'The Builders Behind HackForge',
          subtitle: 'Cross-functional engineering team with deep systems & AI background.',
          members: [
            { name: 'Alex Rivera', role: 'Full Stack & Systems', bio: 'Built kernel probes & low-latency streaming pipeline.' },
            { name: 'Sarah Chen', role: 'AI & Inference Architect', bio: 'Engineered deterministic reasoning loop & AST synthesis.' },
            { name: 'Marcus Patel', role: 'Product & Design', bio: 'Crafted the Canva-grade reactive UI & presentation canvas.' }
          ],
          speakerNotes: 'Our team combines systems programming, AI engineering, and product UX to deliver a production-ready solution in 24 hours.',
          judgeQA: {
            q: 'Will your team continue building this post-hackathon?',
            a: 'Yes, we are launching an open-source alpha next week and already have 4 SRE teams signed up for pilot trials.'
          },
          timeSeconds: 20
        },
        {
          id: `s8-${Date.now()}`,
          layout: 'title-hero',
          badge: '🏁 CONCLUSION & DEMO',
          title: `Experience ${formData.projectName} Live`,
          subtitle: 'Scan the QR code or visit our live URL to trigger an automated test.',
          stamp: 'OPEN SOURCE ON GITHUB',
          bulletList: [
            '🚀 Live Working Demo Deployed on Cloud',
            '📦 Clean Open Source Repository with Architecture Docs',
            '⚡ Ready for Judge Hands-on Testing Right Now'
          ],
          stickyNotes: [
            { id: 'sn-8', title: 'FINAL PUNCHLINE', text: 'Thank the judges, state your vision, and open the floor for live Q&A.', color: 'green', angle: '2deg' }
          ],
          speakerNotes: `Thank you judges! ${formData.projectName} is deployed live, verified, and ready for you to test right now. We would love to answer your questions.`,
          timeSeconds: 15
        }
      ]
    };

    setIsGenerating(false);
    onGenerateDeck(generatedDeck);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none font-sans">
      <div className="bg-[#18191B] border border-stone-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-fade-in text-stone-100 flex flex-col max-h-[90vh]">
        
        {/* HEADER */}
        <div className="p-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <Wand2 className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-200">AI Hackathon Pitch Wizard</h3>
              <p className="text-[11px] text-stone-400 font-mono">Transform raw project ideas into winning 8-slide decks in seconds</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PROGRESS STEP BAR */}
        {!isGenerating && (
          <div className="px-6 py-3 border-b border-stone-800/80 bg-stone-900/40 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-4">
              <span className={`flex items-center gap-1.5 font-bold ${step === 1 ? 'text-indigo-400' : 'text-stone-500'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 1 ? 'bg-indigo-600 text-white' : 'bg-stone-800'}`}>1</span>
                <span>Project Basics</span>
              </span>
              <span className="text-stone-600">→</span>
              <span className={`flex items-center gap-1.5 font-bold ${step === 2 ? 'text-indigo-400' : 'text-stone-500'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 2 ? 'bg-indigo-600 text-white' : 'bg-stone-800'}`}>2</span>
                <span>Problem & Solution</span>
              </span>
              <span className="text-stone-600">→</span>
              <span className={`flex items-center gap-1.5 font-bold ${step === 3 ? 'text-indigo-400' : 'text-stone-500'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 3 ? 'bg-indigo-600 text-white' : 'bg-stone-800'}`}>3</span>
                <span>Tech Moat & Style</span>
              </span>
            </div>

            <span className="text-stone-400 font-bold">Step {step} of 3</span>
          </div>
        )}

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          
          {/* GENERATION SPINNER OVERLAY */}
          {isGenerating ? (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/40 animate-bounce">
                <Sparkles className="w-8 h-8 fill-white" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">Synthesizing Hackathon Presentation</h4>
                <p className="text-xs text-indigo-400 font-mono animate-pulse">{genStage}</p>
              </div>
              <div className="w-64 h-1.5 bg-stone-800 rounded-full overflow-hidden mt-4">
                <div className="h-full bg-indigo-500 rounded-full animate-pulse w-3/4"></div>
              </div>
            </div>
          ) : (
            <div>
              {/* STEP 1 */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-mono font-bold text-stone-300 block mb-1">Project Name</label>
                    <input 
                      type="text" 
                      value={formData.projectName}
                      onChange={(e) => handleInputChange('projectName', e.target.value)}
                      placeholder="e.g. NexusOps AI, PayPulse, ForestSense"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-stone-300 block mb-1">Hackathon Category / Track</label>
                    <select
                      value={formData.track}
                      onChange={(e) => handleInputChange('track', e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="AI Agents & Developer Tools">AI Agents & Developer Tools</option>
                      <option value="FinTech & Micro-Transactions">FinTech & Micro-Transactions</option>
                      <option value="Healthcare & BioTech">Healthcare & BioTech</option>
                      <option value="Cybersecurity & Zero-Trust">Cybersecurity & Zero-Trust</option>
                      <option value="Web3 & Decentralized Protocols">Web3 & Decentralized Protocols</option>
                      <option value="Smart City, IoT & Hardware">Smart City, IoT & Hardware</option>
                      <option value="Sustainability & CleanTech">Sustainability & CleanTech</option>
                      <option value="Smart India Hackathon (SIH)">Smart India Hackathon (SIH)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono font-bold text-stone-300 block mb-1">Pitch Target Duration</label>
                      <select
                        value={formData.pitchFormat}
                        onChange={(e) => handleInputChange('pitchFormat', e.target.value)}
                        className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                      >
                        <option value="3-min">3-Minute Rapid Pitch (SIH/Standard)</option>
                        <option value="5-min">5-Minute Main Stage Demo</option>
                        <option value="10-min">10-Minute Deep Technical Expo</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-mono font-bold text-stone-300 block mb-1">Tone & Delivery Style</label>
                      <select
                        value={formData.tone}
                        onChange={(e) => handleInputChange('tone', e.target.value)}
                        className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                      >
                        <option value="bold">Bold & Punchy (High Judge Energy)</option>
                        <option value="technical">Deep Technical & Systems-Heavy</option>
                        <option value="investor">Venture / Investor Storytelling</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-mono font-bold text-stone-300 block mb-1">Problem Statement (Pain Point)</label>
                    <textarea 
                      rows="3"
                      value={formData.problemStatement}
                      onChange={(e) => handleInputChange('problemStatement', e.target.value)}
                      placeholder="What is the critical crisis or inefficiency people suffer from today?"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl p-3 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-indigo-500 resize-none font-sans"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-stone-300 block mb-1">Proposed Solution & Core Breakthrough</label>
                    <textarea 
                      rows="3"
                      value={formData.proposedSolution}
                      onChange={(e) => handleInputChange('proposedSolution', e.target.value)}
                      placeholder="How does your hackathon project solve this problem in an innovative way?"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl p-3 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-indigo-500 resize-none font-sans"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-stone-300 block mb-1">Target Audience & Beneficiaries</label>
                    <input 
                      type="text" 
                      value={formData.targetAudience}
                      onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                      placeholder="e.g. Hospital ICU clinicians, SRE teams, college students"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-mono font-bold text-stone-300 block mb-1">Full Technology Stack</label>
                    <input 
                      type="text" 
                      value={formData.techStack}
                      onChange={(e) => handleInputChange('techStack', e.target.value)}
                      placeholder="e.g. React 19, FastAPI, PostgreSQL, Claude 3.5, PyTorch"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-stone-300 block mb-1">Unfair Advantage / Hackathon "Moat"</label>
                    <input 
                      type="text" 
                      value={formData.uniqueMoat}
                      onChange={(e) => handleInputChange('uniqueMoat', e.target.value)}
                      placeholder="e.g. Kernel eBPF tracing, zero-knowledge verification, edge inference"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono font-bold text-stone-300 block mb-1">Slide Visual Canvas</label>
                      <select
                        value={formData.theme}
                        onChange={(e) => handleInputChange('theme', e.target.value)}
                        className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                      >
                        <option value="kraft">Brown Kraft Paper (Handmade)</option>
                        <option value="blueprint">Technical Blueprint</option>
                        <option value="chalkboard">Dark Chalkboard</option>
                        <option value="grid">Clean Engineering Grid</option>
                        <option value="vanilla">Clean Vanilla</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-mono font-bold text-stone-300 block mb-1">Font Styling</label>
                      <select
                        value={formData.fontStyle}
                        onChange={(e) => handleInputChange('fontStyle', e.target.value)}
                        className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                      >
                        <option value="hand">Architects Hand (Caveat)</option>
                        <option value="marker">Permanent Marker</option>
                        <option value="kalam">Kalam Pen</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* FOOTER ACTIONS */}
        {!isGenerating && (
          <div className="p-4 border-t border-stone-800 flex items-center justify-between bg-stone-900/40">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-3.5 py-2 rounded-xl border border-stone-700 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleStartGeneration}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-transform active:scale-95"
              >
                <Sparkles className="w-4 h-4 fill-white" />
                <span>Generate 8-Slide Pitch Deck</span>
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
