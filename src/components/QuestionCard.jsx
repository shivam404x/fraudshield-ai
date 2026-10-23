import React, { useState } from 'react';
import { 
  Bookmark, BookmarkCheck, FileText, Image as ImageIcon, 
  Eye, Check, Trash2, Edit3, Clock, 
  Sparkles, ExternalLink, Heart, Flame, ChevronRight, Layers,
  Lock, Globe
} from 'lucide-react';
import QuestionPaperModal from './QuestionPaperModal';

export default function QuestionCard({
  question, // Represents a Question Paper
  onEdit,
  onDelete,
  onToggleBookmark,
  onDuplicate,
  onToggleLike,
  isLiked = false,
  layoutMode = 'grid', // 'grid' | 'list'
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHeartPopping, setIsHeartPopping] = useState(false);

  const paper = question;
  const isMid = paper.examType?.includes('Mid') || paper.marks?.includes('20');
  const marksBadge = isMid ? 'Mid-Term (20M)' : 'End-Term (40M)';
  const isTrending = (paper.likes || 0) >= 80;
  const pagesCount = paper.pagesCount || (paper.paperImageUrls?.length || (paper.paperImageUrl ? 1 : 0));
  const hasImage = Boolean(paper.paperImageUrl) || (paper.paperImageUrls && paper.paperImageUrls.length > 0);
  const isImagePaper = paper.contentType === 'image' || (hasImage && paper.contentType !== 'text');

  const handleLikeClick = (e) => {
    e.stopPropagation();
    setIsHeartPopping(true);
    setTimeout(() => setIsHeartPopping(false), 450);
    if (onToggleLike) {
      onToggleLike(paper.id);
    }
  };

  // ==========================================
  // VIEW MODE: COMPACT LIST ROW (Clean White Theme)
  // ==========================================
  if (layoutMode === 'list') {
    return (
      <>
        <div 
          onContextMenu={(e) => e.preventDefault()}
          onClick={() => setIsModalOpen(true)}
          className="group relative flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-white hover:bg-slate-50/80 border border-slate-200 hover:border-indigo-300 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md hover:shadow-indigo-500/5"
        >
          {/* Left: Indicator, Paper Code & Subject */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Paper Slip Thumbnail / Icon */}
            {isImagePaper && paper.paperImageUrl ? (
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                <img
                  src={paper.paperImageUrl}
                  alt="slip"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 text-emerald-600">
                <FileText className="w-5 h-5" />
              </div>
            )}

            {/* Subject, Code & Details */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                  {paper.title || `${paper.subject} Question Paper`}
                </h4>
                {paper.paperCode && (
                  <span className="shrink-0 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {paper.paperCode}
                  </span>
                )}
                <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Verified Drop</span>
                </span>
                {pagesCount > 1 && (
                  <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                    <Layers className="w-2.5 h-2.5" />
                    {pagesCount} Pgs
                  </span>
                )}
                {isTrending && (
                  <span className="shrink-0 shimmer-badge inline-flex items-center gap-0.5 px-2 py-0.2 rounded-full text-[10px] font-black bg-gradient-to-r from-rose-50 to-amber-50 text-rose-700 border border-rose-200">
                    <Flame className="w-3 h-3 text-rose-500" />
                    <span>Hot</span>
                  </span>
                )}
                {(paper.groupId || paper.isSquadExclusive) && !paper.isPublic && (
                  <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                    <Lock className="w-2.5 h-2.5" />
                    <span>Squad Locked</span>
                  </span>
                )}
                {(paper.groupId || paper.isSquadExclusive) && paper.isPublic && (
                  <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                    <Globe className="w-2.5 h-2.5" />
                    <span>Public Approved</span>
                  </span>
                )}
                {paper.groupId && paper.isPublic && (
                  <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                    <Globe className="w-2.5 h-2.5" />
                    <span>Public Approved</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 pt-0.5 truncate font-medium">
                <span className="text-slate-700 font-semibold">{paper.course || paper.school}</span>
                <span>&bull;</span>
                <span className="text-indigo-600">{paper.semester}</span>
                <span>&bull;</span>
                <span className={isMid ? 'text-amber-700 font-bold' : 'text-indigo-700 font-bold'}>{marksBadge}</span>
              </div>
            </div>
          </div>

          {/* Right: Actions, Upvotes & Quick View Button */}
          <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
            {/* Heart Upvote */}
            <button
              type="button"
              onClick={handleLikeClick}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border text-xs font-bold transition-all ${
                isLiked
                  ? 'bg-rose-50 border-rose-300 text-rose-600 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50/50'
              }`}
              title="Upvote / Like this Question Paper"
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''} ${isHeartPopping ? 'animate-heart-pop' : ''}`} />
              <span>{paper.likes || 0}</span>
            </button>

            {/* Bookmark */}
            <button
              type="button"
              onClick={() => onToggleBookmark(paper.id)}
              className={`p-1.5 rounded-xl border transition-colors ${
                paper.isBookmarked
                  ? 'bg-amber-50 border-amber-300 text-amber-600'
                  : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50'
              }`}
              title={paper.isBookmarked ? 'Remove Star' : 'Star this Paper'}
            >
              {paper.isBookmarked ? <BookmarkCheck className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> : <Bookmark className="w-3.5 h-3.5" />}
            </button>

            {/* Open Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1 px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm shadow-indigo-600/20 transition-all hover:scale-[1.02]"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Open</span>
            </button>
          </div>
        </div>

        {/* Full Question Paper Modal */}
        <QuestionPaperModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          paper={paper}
        />
      </>
    );
  }

  // ==========================================
  // VIEW MODE: RICH GRID / CARD VIEW (Clean White Theme)
  // ==========================================
  return (
    <>
      <div 
        onContextMenu={(e) => e.preventDefault()}
        className="paper-glass-card card-hover-lift animate-slide-up group rounded-3xl p-5 sm:p-6 space-y-4 relative overflow-hidden"
      >
        {/* Subtle Ambient Hover Glow */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-amber-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* 1. Header Badges: Exam Weightage, Course, Semester, Code */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-slate-100 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Marks Weightage Badge */}
            <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black tracking-wide ${
              isMid 
                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                : 'bg-indigo-50 text-indigo-800 border border-indigo-200'
            }`}>
              {marksBadge}
            </span>

            {/* Course / School */}
            {(paper.course || paper.school) && (
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                {paper.course || paper.school}
              </span>
            )}

            {/* Semester */}
            {paper.semester && (
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
                {paper.semester}
              </span>
            )}

            {/* Paper Code */}
            {paper.paperCode && (
              <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                {paper.paperCode}
              </span>
            )}

            {/* Live Student Drop Badge */}
            <span 
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs"
              title="Encrypted Zero-Trace Anonymous Drop"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>🕶️ Verified Scholar Drop</span>
            </span>

            {/* Trending indicator */}
            {isTrending && (
              <span className="shimmer-badge inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-rose-50 to-amber-50 text-rose-700 border border-rose-200 shadow-xs animate-badge-float">
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                <span>Trending Hot</span>
              </span>
            )}

            {/* Squad Locked Indicator */}
            {(paper.groupId || paper.isSquadExclusive) && !paper.isPublic && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs">
                <Lock className="w-3 h-3 text-purple-600" />
                <span>Squad Locked</span>
              </span>
            )}
            {(paper.groupId || paper.isSquadExclusive) && paper.isPublic && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs">
                <Globe className="w-3 h-3 text-indigo-600" />
                <span>Public Approved</span>
              </span>
            )}
          </div>

          {/* Quick Like & Bookmark */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleLikeClick}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                isLiked
                  ? 'bg-rose-50 border-rose-300 text-rose-600 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50/50'
              }`}
              title="Upvote / Like this Question Paper"
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''} ${isHeartPopping ? 'animate-heart-pop' : ''}`} />
              <span>{paper.likes || 0}</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleBookmark(paper.id)}
              className={`p-1.5 rounded-xl border transition-colors ${
                paper.isBookmarked
                  ? 'bg-amber-50 border-amber-300 text-amber-600'
                  : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50'
              }`}
              title={paper.isBookmarked ? 'Remove Star' : 'Star this Paper'}
            >
              {paper.isBookmarked ? <BookmarkCheck className="w-4 h-4 fill-amber-500 text-amber-500" /> : <Bookmark className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 2. Paper Title & Layout Preview (Image + Text Snippet) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <h3 
              onClick={() => setIsModalOpen(true)}
              className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer flex items-center gap-2"
            >
              <span>{paper.title || `${paper.subject} Question Paper`}</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0" />
            </h3>
            
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
              Official {paper.examType || 'Examination'} Paper for <strong className="text-slate-800 font-semibold">{paper.course}</strong>, {paper.semester}. Complete syllabus questions &amp; marks distribution.
            </p>

            <div className="flex items-center gap-3 pt-1 text-xs text-slate-500 font-medium">
              {isImagePaper ? (
                <span className="flex items-center gap-1 text-indigo-600 font-semibold">
                  <ImageIcon className="w-3.5 h-3.5" /> {pagesCount > 1 ? `${pagesCount} Pages Slip` : 'Paper Slip'}
                </span>
              ) : (
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <FileText className="w-3.5 h-3.5" /> Paper Text
                </span>
              )}
              <span>&bull;</span>
              <span className="font-mono text-slate-600">{paper.marks || '40 Marks'}</span>
            </div>
          </div>

          {/* Paper Image Thumbnail with sleek click overlay (ONLY if image paper) */}
          {isImagePaper && paper.paperImageUrl && (
            <div 
              onClick={() => setIsModalOpen(true)}
              className="relative w-28 sm:w-32 h-36 rounded-2xl overflow-hidden border-2 border-slate-200 hover:border-indigo-500 shadow-md cursor-pointer shrink-0 transition-transform duration-300 hover:scale-105 bg-slate-50"
            >
              <img
                src={paper.paperImageUrl}
                alt="Question paper preview slip"
                className="w-full h-full object-cover object-top opacity-95 group-hover:opacity-100 transition-opacity"
              />
              {pagesCount > 1 && (
                <div className="absolute top-2 left-2 bg-indigo-950/80 backdrop-blur-sm text-white px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-sm border border-indigo-400/30">
                  <Layers className="w-3 h-3 text-indigo-300" />
                  {pagesCount} Pgs
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent flex items-end justify-center pb-2 opacity-90 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-bold text-white flex items-center gap-1 bg-slate-900/90 px-2 py-0.5 rounded-full border border-slate-700 shadow-sm">
                  <Eye className="w-3 h-3 text-indigo-400" /> View Slip
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 3. Action Buttons Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-sm shadow-indigo-600/20 hover:scale-[1.02]"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isImagePaper ? 'View Paper Slip' : 'Read Paper Text'}</span>
            </button>

            <button
              type="button"
              onClick={handleLikeClick}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold transition-all ${
                isLiked
                  ? 'bg-rose-50 border-rose-300 text-rose-600 shadow-xs'
                  : 'bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 border-slate-200 hover:border-rose-200'
              }`}
              title="Upvote this Question Paper"
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''} ${isHeartPopping ? 'animate-heart-pop' : ''}`} />
              <span>{isLiked ? 'Upvoted' : 'Upvote'} ({paper.likes || 0})</span>
            </button>
          </div>

          {/* Delete / Edit options for admin or creator */}
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(paper)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100"
                title="Edit Paper Details"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            )}

            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(paper)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                title="Delete Paper (Admin Approval Required)"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Full Question Paper Modal */}
      <QuestionPaperModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        paper={paper}
      />
    </>
  );
}
