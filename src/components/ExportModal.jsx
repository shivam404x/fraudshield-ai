import React, { useState } from 'react';
import { 
  X, Download, FileText, Printer, Code2, 
  Check, Sparkles, ShieldCheck, Terminal 
} from 'lucide-react';
import { exportDeckToPptx } from '../utils/pptxExport';

export default function ExportModal({
  isOpen = false,
  onClose,
  deck
}) {
  const [downloadSuccess, setDownloadSuccess] = useState(null);

  if (!isOpen || !deck) return null;

  // 1. Working PPTX Export
  const handleDownloadPptx = () => {
    try {
      exportDeckToPptx(deck);
      setDownloadSuccess('Downloaded PowerPoint (.pptx) file successfully!');
      setTimeout(() => setDownloadSuccess(null), 4000);
    } catch (e) {
      console.error(e);
      alert('Error exporting PPTX: ' + e.message);
    }
  };

  // 2. Export Pitch Script Markdown
  const handleDownloadMarkdown = () => {
    try {
      let md = `# ${deck.name}\n\n`;
      md += `**Hackathon Track:** ${deck.track || 'General'}\n`;
      md += `**Total Slides:** ${deck.slides?.length || 0}\n\n`;
      md += `---\n\n`;

      (deck.slides || []).forEach((s, idx) => {
        md += `## Slide ${idx + 1}: ${s.title}\n`;
        if (s.subtitle) md += `*${s.subtitle}*\n\n`;
        if (s.badge) md += `**Badge:** \`${s.badge}\`\n\n`;

        if (s.bulletList && s.bulletList.length > 0) {
          md += `### Key Highlights:\n`;
          s.bulletList.forEach(b => { md += `- ${b}\n`; });
          md += `\n`;
        }

        if (s.cards && s.cards.length > 0) {
          md += `### Architecture / Core Pillars:\n`;
          s.cards.forEach(c => { md += `- **${c.title}** (${c.tag}): ${c.description}\n`; });
          md += `\n`;
        }

        if (s.speakerNotes) {
          md += `### 🎙️ Speaker Script (What to say to judges):\n> ${s.speakerNotes}\n\n`;
        }

        if (s.judgeQA) {
          md += `### 🛡️ Anticipated Judge Q&A:\n`;
          md += `**Q:** ${s.judgeQA.q}\n`;
          md += `**A:** ${s.judgeQA.a}\n\n`;
        }

        md += `---\n\n`;
      });

      const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${deck.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_pitch.md`;
      link.click();
      URL.revokeObjectURL(url);

      setDownloadSuccess('Downloaded Pitch Deck Markdown (.md)!');
      setTimeout(() => setDownloadSuccess(null), 4000);
    } catch (e) {
      alert('Error exporting Markdown: ' + e.message);
    }
  };

  // 3. Export JSON Backup
  const handleDownloadJson = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(deck, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `${deck.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_project.json`);
      downloadAnchor.click();

      setDownloadSuccess('Exported Project JSON backup!');
      setTimeout(() => setDownloadSuccess(null), 4000);
    } catch (e) {
      alert('Error exporting JSON: ' + e.message);
    }
  };

  // 4. Print / PDF
  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none font-sans">
      <div className="bg-[#18191B] border border-stone-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-fade-in text-stone-100">
        
        {/* MODAL HEADER */}
        <div className="p-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-200">Export Presentation Center</h3>
              <p className="text-[11px] text-stone-400 font-mono">Real native exports for hackathon submission & judge reviews</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NOTIFICATION FEEDBACK */}
        {downloadSuccess && (
          <div className="mx-4 mt-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* EXPORT OPTIONS CARDS */}
        <div className="p-4 space-y-3">
          
          {/* OPTION 1: PPTX */}
          <div className="p-4 rounded-xl border border-indigo-500/40 bg-gradient-to-r from-indigo-950/30 to-purple-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-white">Microsoft PowerPoint (.pptx)</span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-400 text-black">RECOMMENDED</span>
              </div>
              <p className="text-[11px] text-stone-300">
                Native binary OpenXML file. Opens directly in Microsoft PowerPoint, Apple Keynote, and Google Slides.
              </p>
            </div>

            <button
              onClick={handleDownloadPptx}
              className="shrink-0 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-transform active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .pptx</span>
            </button>
          </div>

          {/* OPTION 2: PDF / PRINT */}
          <div className="p-3.5 rounded-xl border border-stone-800 bg-stone-900/60 flex items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-xs text-stone-200">Print or Save as PDF</h4>
              <p className="text-[11px] text-stone-400">Standard vector slide handout format for judging panels and expo tables.</p>
            </div>

            <button
              onClick={handlePrintPdf}
              className="shrink-0 px-3.5 py-2 rounded-xl border border-stone-700 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
          </div>

          {/* OPTION 3: MARKDOWN SCRIPT */}
          <div className="p-3.5 rounded-xl border border-stone-800 bg-stone-900/60 flex items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-xs text-stone-200">Speaker Script & Pitch Deck (.md)</h4>
              <p className="text-[11px] text-stone-400">Complete text transcript with talking points and judge Q&A for your GitHub README.</p>
            </div>

            <button
              onClick={handleDownloadMarkdown}
              className="shrink-0 px-3.5 py-2 rounded-xl border border-stone-700 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Download .md</span>
            </button>
          </div>

          {/* OPTION 4: JSON BACKUP */}
          <div className="p-3.5 rounded-xl border border-stone-800 bg-stone-900/60 flex items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-xs text-stone-200">HackForge Project Backup (.json)</h4>
              <p className="text-[11px] text-stone-400">Full structured project data for seamless migration and backup.</p>
            </div>

            <button
              onClick={handleDownloadJson}
              className="shrink-0 px-3.5 py-2 rounded-xl border border-stone-700 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
          </div>

        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400 bg-stone-900/40">
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero telemetry • 100% offline generation</span>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg hover:bg-stone-800 text-stone-300"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
