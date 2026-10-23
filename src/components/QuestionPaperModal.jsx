import React, { useState, useEffect } from 'react';
import { 
  X, Eye, FileText, Image as ImageIcon, 
  ZoomIn, ZoomOut, CheckCircle, Copy,
  Maximize2, Minimize2, ChevronLeft, ChevronRight,
  Type, Sparkles, BookOpen, Layers, ShieldAlert, Lock
} from 'lucide-react';
import LatexRenderer from './LatexRenderer';
import KrmuLogo from './KrmuLogo';

export default function QuestionPaperModal({
  isOpen,
  onClose,
  paper,
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [copied, setCopied] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [fontSize, setFontSize] = useState('base'); // 'sm' | 'base' | 'lg'
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  if (!isOpen || !paper) return null;

  // Multi-page image array normalization
  const pages = paper.paperImageUrls && paper.paperImageUrls.length > 0 
    ? paper.paperImageUrls 
    : (paper.paperImageUrl ? [paper.paperImageUrl] : []);
  const activeImage = pages[currentPageIndex] || paper.paperImageUrl || '';

  // Determine if this paper was dropped as an image slip or as formatted text
  const hasImages = pages.length > 0;
  const isImagePaper = paper.contentType === 'image' || (hasImages && paper.contentType !== 'text');

  const handleCopyText = () => {
    if (paper.paperText) {
      navigator.clipboard.writeText(paper.paperText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isMid = paper.marks?.includes('20') || paper.examType?.toLowerCase().includes('mid');

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto ${isFocusMode ? 'p-0' : ''}`}>
      <div className={`relative w-full ${isFocusMode ? 'max-w-7xl h-[96vh]' : 'max-w-4xl max-h-[92vh]'} bg-white border border-slate-200/90 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col transition-all duration-300`}>
        
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between p-3.5 sm:p-4 border-b border-slate-200 bg-white/95 shrink-0 gap-3">
          <div className="flex items-center gap-3">
            <KrmuLogo size="sm" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  {paper.subject}
                </h3>
                {paper.paperCode && (
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {paper.paperCode}
                  </span>
                )}
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isMid 
                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                    : 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                }`}>
                  {isMid ? 'Mid-Term (20M)' : 'End-Term (40M)'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {paper.school} &bull; {paper.course} &bull; <strong className="text-indigo-600 font-bold">{paper.semester}</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Live Student Drop Badge */}
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>🕶️ Verified Scholar Drop</span>
            </span>

            {/* Format Indicator (Static Badge — NO switching option for reader) */}
            {isImagePaper ? (
              <span className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold flex items-center gap-1.5 shadow-xs">
                <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                <span>Paper Slip</span>
              </span>
            ) : (
              <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1.5 shadow-xs">
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                <span>Paper Text</span>
              </span>
            )}

            {/* DRM Protected Document Badge */}
            <div 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold shadow-xs select-none"
              title="Official KRMU DRM Protected Examination Document"
            >
              <Lock className="w-3.5 h-3.5 text-indigo-600" />
              <span>DRM Protected View</span>
            </div>

            {/* Focus Study Mode Toggle */}
            <button
              type="button"
              onClick={() => setIsFocusMode(!isFocusMode)}
              className={`p-2 rounded-xl border transition-all ${
                isFocusMode
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
              title={isFocusMode ? 'Exit Focus Mode' : 'Enter Focus Study Mode'}
            >
              {isFocusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Viewer */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/70">
          {isImagePaper ? (
            /* Mode 1: Question Paper Image Slip Viewer */
            <div className="flex flex-col items-center space-y-4">
              {/* Zoom and multi-page tools */}
              <div className="flex flex-wrap items-center justify-between w-full max-w-2xl px-4 py-2.5 rounded-2xl bg-white border border-slate-200 shadow-xs text-xs gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-slate-700 font-bold">
                    {paper.isAnonymousDrop ? '🕶️ Scanned Exam Paper Slip' : '🏛️ Official KRMU Paper Document'}
                  </span>
                  {pages.length > 1 && (
                    <span className="px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-bold flex items-center gap-1">
                      <Layers className="w-3 h-3" />
                      {pages.length} Pages
                    </span>
                  )}
                </div>

                {/* Multi-page switcher when more than 1 page */}
                {pages.length > 1 && (
                  <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      disabled={currentPageIndex === 0}
                      onClick={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
                      className={`p-1 rounded-lg ${
                        currentPageIndex === 0
                          ? 'text-slate-300 cursor-not-allowed'
                          : 'text-slate-700 hover:bg-white hover:text-indigo-600 shadow-xs'
                      }`}
                      title="Previous Page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <span className="px-2 font-mono font-bold text-slate-800 text-[11px]">
                      Page {currentPageIndex + 1} / {pages.length}
                    </span>

                    <button
                      type="button"
                      disabled={currentPageIndex === pages.length - 1}
                      onClick={() => setCurrentPageIndex((prev) => Math.min(pages.length - 1, prev + 1))}
                      className={`p-1 rounded-lg ${
                        currentPageIndex === pages.length - 1
                          ? 'text-slate-300 cursor-not-allowed'
                          : 'text-slate-700 hover:bg-white hover:text-indigo-600 shadow-xs'
                      }`}
                      title="Next Page"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.15))}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                    title="Zoom out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-mono font-bold text-slate-600 w-12 text-center">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(1.8, z + 0.15))}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                    title="Zoom in"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setZoomLevel(1)}
                    className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Rendered Paper Image with DRM Protection & Watermark */}
              <div 
                onContextMenu={(e) => e.preventDefault()}
                className="drm-protected-paper relative overflow-auto max-w-2xl w-full border-2 border-slate-200 rounded-2xl bg-white shadow-md p-3 flex justify-center select-none"
              >

                <img
                  src={activeImage}
                  alt={`Question Paper for ${paper.subject} - Page ${currentPageIndex + 1}`}
                  style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
                  className="transition-transform duration-200 w-full h-auto max-h-[75vh] object-contain rounded select-none pointer-events-none"
                  draggable="false"
                  onContextMenu={(e) => e.preventDefault()}
                />

                {/* Forensic Anti-Screenshot Watermark Matrix (Full-Coverage Repeating Grid) */}
                <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-20 opacity-25">
                  <div 
                    className="w-full h-full"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='280' height='160' viewBox='0 0 280 160'%3E%3Ctext x='20' y='75' fill='%23e11d48' font-size='12' font-family='sans-serif' font-weight='900' transform='rotate(-22 140 80)' opacity='0.75'%3E%E2%9A%A0%EF%B8%8F KRMU VAULT CONFIDENTIAL%3C/text%3E%3Ctext x='25' y='98' fill='%234338ca' font-size='9' font-family='sans-serif' font-weight='800' transform='rotate(-22 140 80)' opacity='0.65'%3EUNAUTHORIZED SCREENSHOT PROHIBITED%3C/text%3E%3C/svg%3E")`,
                      backgroundRepeat: 'repeat'
                    }}
                  />
                </div>

                {/* Central Security Seal */}
                <div className="absolute inset-0 pointer-events-none select-none overflow-hidden flex items-center justify-center opacity-15 z-20">
                  <div className="text-slate-900 font-black text-xl sm:text-2xl rotate-[-22deg] tracking-widest uppercase text-center border-4 border-slate-900 px-6 py-3 rounded-2xl">
                    KRMU VAULT &bull; CONFIDENTIAL &bull; DO NOT COPY
                  </div>
                </div>
              </div>

              {/* Multi-page Thumbnail strip when pages > 1 */}
              {pages.length > 1 && (
                <div className="flex items-center justify-center gap-2 max-w-2xl w-full overflow-x-auto py-2">
                  {pages.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentPageIndex(idx)}
                      className={`relative w-14 h-18 rounded-lg overflow-hidden border-2 transition-all p-0.5 shrink-0 ${
                        currentPageIndex === idx
                          ? 'border-indigo-600 ring-2 ring-indigo-200 shadow-md scale-105'
                          : 'border-slate-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover rounded pointer-events-none" draggable="false" />
                      <span className="absolute bottom-0.5 right-0.5 bg-black/75 text-white text-[9px] px-1 rounded font-mono font-bold">
                        {idx + 1}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Tab 2: Question Paper Text Viewer with Font Sizing & DRM Watermark */
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-xs text-xs">
                {/* Font Size Selector */}
                <div className="flex items-center gap-1 text-slate-600">
                  <Type className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  <span className="font-medium">Font:</span>
                  {[
                    { id: 'sm', label: 'A-' },
                    { id: 'base', label: 'A' },
                    { id: 'lg', label: 'A+' }
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setFontSize(s.id)}
                      className={`px-2 py-0.5 rounded font-bold transition-colors ${
                        fontSize === s.id ? 'bg-indigo-600 text-white' : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>DRM Protected Read-Only</span>
                </div>
              </div>

              <div 
                onContextMenu={(e) => e.preventDefault()}
                className={`drm-protected-paper relative p-6 sm:p-8 bg-white border border-slate-200 rounded-2xl text-slate-800 leading-relaxed font-sans shadow-sm select-none ${
                fontSize === 'sm' ? 'text-xs' : fontSize === 'lg' ? 'text-base' : 'text-sm'
              }`}>
                {/* Forensic Anti-Screenshot Watermark Matrix (Full-Coverage Repeating Grid) */}
                <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-20 opacity-25">
                  <div 
                    className="w-full h-full"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='280' height='160' viewBox='0 0 280 160'%3E%3Ctext x='20' y='75' fill='%23e11d48' font-size='12' font-family='sans-serif' font-weight='900' transform='rotate(-22 140 80)' opacity='0.75'%3E%E2%9A%A0%EF%B8%8F KRMU VAULT CONFIDENTIAL%3C/text%3E%3Ctext x='25' y='98' fill='%234338ca' font-size='9' font-family='sans-serif' font-weight='800' transform='rotate(-22 140 80)' opacity='0.65'%3EUNAUTHORIZED SCREENSHOT PROHIBITED%3C/text%3E%3C/svg%3E")`,
                      backgroundRepeat: 'repeat'
                    }}
                  />
                </div>

                {/* Central Security Seal */}
                <div className="absolute inset-0 pointer-events-none select-none overflow-hidden flex items-center justify-center opacity-15 z-20">
                  <div className="text-slate-900 font-black text-xl sm:text-2xl rotate-[-22deg] tracking-widest uppercase text-center border-4 border-slate-900 px-6 py-3 rounded-2xl">
                    KRMU VAULT &bull; CONFIDENTIAL &bull; DO NOT COPY
                  </div>
                </div>
                <div className="relative z-10 select-none">
                  <LatexRenderer text={paper.paperText || 'No text transcription available for this paper slip.'} block />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions Footer (NO Download option anywhere) */}
        <div className="p-3.5 sm:p-4 border-t border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-emerald-700 font-semibold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Official Examination Paper
            </span>
            <span className="text-slate-300">&bull;</span>
            <span className="text-slate-600 font-medium">{paper.course}</span>
            <span className="text-slate-300">&bull;</span>
            <span className="text-indigo-600 font-bold">{paper.semester}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
