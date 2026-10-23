import React, { useState } from 'react';
import { Video, Clock, Plus, Trash2, Copy, Check } from 'lucide-react';

export default function DemoVideoPlanner() {
  const [scenes, setScenes] = useState([
    { id: '1', time: '0:00 - 0:20', title: 'The Hook & Broken Reality', visual: 'Show frustrated engineer receiving 3 AM PagerDuty alarm with 10k cryptic logs.', voiceover: 'Every software engineer dreads the 3 AM on-call pager buzz. Today, cloud outages bleed $9,000 every single minute.' },
    { id: '2', time: '0:20 - 0:50', title: 'Triggering Outage Live', visual: 'Terminal script injecting simulated memory deadlock in Kubernetes cluster pod.', voiceover: 'Watch what happens when we crash our production container right now. The pod halts immediately.' },
    { id: '3', time: '0:50 - 1:25', title: 'NexusOps Autonomous Repair', visual: 'Screen recording showing eBPF probe catching panic in 400ms and Claude synthesizing AST git patch.', voiceover: 'NexusOps kernel sensor intercepts the SIGSEGV instantly and generates an AST diff with 100% syntactic precision.' },
    { id: '4', time: '1:25 - 1:45', title: 'Docker Staging Run & Slack Approval', visual: 'Ephemeral preview environment passing all 142 tests and Slack interactive webhook popping up.', voiceover: 'Before touching master, NexusOps runs the full test suite in an isolated sandbox, ready to merge in Slack.' },
    { id: '5', time: '1:45 - 2:00', title: 'Conclusion & Benchmark Recap', visual: 'Closing slide showing 94% MTTR reduction and Devpost repository link.', voiceover: 'From 4.8 hours down to 92 seconds. NexusOps turns hours of downtime into seconds of peace. Thank you!' }
  ]);

  const [copied, setCopied] = useState(false);

  const copyScript = () => {
    let script = "=== 2-MINUTE HACKATHON DEMO VIDEO STORYBOARD ===\n\n";
    scenes.forEach(s => {
      script += `[SCENE: ${s.title.toUpperCase()} (${s.time})]\n`;
      script += `VISUAL ACTION: ${s.visual}\n`;
      script += `VOICEOVER: "${s.voiceover}"\n\n`;
    });
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col h-full overflow-hidden select-none">
      
      {/* Top Header */}
      <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-fuchsia-600 to-pink-600 text-white flex items-center justify-center shadow-sm">
            <Video className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 font-sans">
              Demo Video Planner & Storyboard
            </h2>
            <p className="text-[11px] text-slate-500 font-sans">
              Plan your 2-minute hackathon video submission with scenes, shot lists, and narration scripts.
            </p>
          </div>
        </div>

        <button
          onClick={copyScript}
          className="px-3.5 py-1.5 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold text-xs flex items-center gap-1.5 shadow"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied Script!' : 'Copy Video Script'}</span>
        </button>
      </div>

      {/* Storyboard Scenes Grid */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-4">
        {scenes.map((scene, idx) => (
          <div key={scene.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono text-xs flex items-center justify-center font-bold">
                  {idx + 1}
                </span>
                <span className="font-bold text-sm text-slate-900">{scene.title}</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono text-xs font-bold">
                ⏱️ {scene.time}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">On-Screen Action / Shot:</span>
                <p className="mt-1 text-slate-700 leading-relaxed">{scene.visual}</p>
              </div>
              <div className="p-3 rounded-xl bg-fuchsia-50/50 border border-fuchsia-200">
                <span className="text-[10px] font-mono font-bold text-fuchsia-700 uppercase">Voiceover Narration:</span>
                <p className="mt-1 text-slate-800 leading-relaxed font-medium">"{scene.voiceover}"</p>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
