import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Flame, Heart, ChevronLeft, ChevronRight, Eye, Bookmark, 
  BookmarkCheck, TrendingUp, Trophy, ArrowUpRight,
  Layers, Clock, Award
} from 'lucide-react';

export default function TrendingCarousel({
  questions = [],
  onOpenPaper = () => {},
  onToggleLike = () => {},
  onToggleBookmark = () => {},
  userLikedIds = new Set(),
}) {
  // Sort questions by likes descending to get the top trending exams
  const trendingPapers = useMemo(() => {
    const list = [...questions];
    list.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    return list.slice(0, 8); // Top 8 trending papers
  }, [questions]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHeartPopping, setIsHeartPopping] = useState(false);
  const timerRef = useRef(null);

  // Auto-play slider effect (4.5s per slide)
  useEffect(() => {
    if (trendingPapers.length <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % trendingPapers.length);
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [trendingPapers.length, isPaused]);

  if (trendingPapers.length === 0) return null;

  const currentPaper = trendingPapers[currentIndex] || trendingPapers[0];
  const isLiked = userLikedIds.has(currentPaper.id);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + trendingPapers.length) % trendingPapers.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % trendingPapers.length);
  };

  return (
    <div 
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-indigo-50/20 to-purple-50/30 border border-slate-200/90 shadow-md p-5 sm:p-7 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Dynamic Ambient Glows */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-gradient-to-br from-rose-500/5 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-80 h-80 bg-gradient-to-tr from-amber-500/5 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Top Header of the Carousel */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white shadow-md shadow-rose-500/20 flex items-center justify-center">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>Trending Exam Papers</span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-black tracking-widest text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  Most Liked &bull; Live Upvotes
                </span>
              </h2>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Exam papers voted by students with highest popularity &amp; semester demand
            </p>
          </div>
        </div>

        {/* Carousel Slide Controls (Left / Right) */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-500 mr-1">
            <span className="text-slate-900 font-black">{currentIndex + 1}</span> / {trendingPapers.length}
          </span>
          <button
            onClick={handlePrev}
            className="p-2 rounded-xl bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 transition-all hover:scale-105 shadow-xs"
            title="Previous Trending Paper"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 rounded-xl bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 transition-all hover:scale-105 shadow-xs"
            title="Next Trending Paper"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Slide Card Content */}
      <div className="relative z-10 pt-5 flex flex-col lg:flex-row items-stretch justify-between gap-6">
        
        {/* Left Information Column */}
        <div className="flex-1 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            {/* Badges Row: Rank, Likes, School */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase shadow-xs ${
                currentIndex === 0 
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shimmer-badge' 
                  : currentIndex === 1 
                  ? 'bg-slate-200 text-slate-800 font-bold' 
                  : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
              }`}>
                <Trophy className="w-3.5 h-3.5" />
                <span>#{currentIndex + 1} Trending Exam</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-50 text-rose-700 border border-rose-200">
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
                <span>{currentPaper.likes || 0} Student Upvotes</span>
              </span>

              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                {currentPaper.school} &bull; {currentPaper.semester}
              </span>

              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {currentPaper.paperCode || 'KRMU-EXAM'}
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>🕶️ Live Student Drop</span>
              </span>
            </div>

            {/* Subject Title */}
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                {currentPaper.subject}
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-semibold">
                {currentPaper.course} &bull; {currentPaper.examType || 'Official Exam'} ({currentPaper.marks || 'Full Paper'})
              </p>
            </div>

            {/* Teaser Question Text */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 line-clamp-3 font-mono leading-relaxed shadow-xs">
              {currentPaper.paperText 
                ? currentPaper.paperText.replace(/[#*`$]/g, '').slice(0, 220) + '...'
                : 'Official KRMU Examination Paper with complete Section A, Section B, and numerical case studies.'}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onOpenPaper(currentPaper)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Eye className="w-4 h-4" />
              <span>Inspect Question Paper</span>
            </button>

            {/* Live Like / Upvote Button */}
            <button
              type="button"
              onClick={() => {
                setIsHeartPopping(true);
                setTimeout(() => setIsHeartPopping(false), 450);
                onToggleLike(currentPaper.id);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98] ${
                isLiked
                  ? 'bg-rose-50 border-rose-300 text-rose-600 shadow-xs'
                  : 'bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 border-slate-200'
              }`}
              title="Upvote this exam paper"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-400'} ${isHeartPopping ? 'animate-heart-pop' : ''}`} />
              <span>{isLiked ? 'Upvoted' : 'Upvote Exam'} ({currentPaper.likes || 0})</span>
            </button>

            {/* Bookmark */}
            <button
              type="button"
              onClick={() => onToggleBookmark(currentPaper.id)}
              className={`p-2.5 rounded-xl border transition-all ${
                currentPaper.isBookmarked
                  ? 'bg-amber-50 border-amber-300 text-amber-600'
                  : 'bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-700 border-slate-200'
              }`}
              title="Bookmark for exam revision"
            >
              {currentPaper.isBookmarked ? (
                <BookmarkCheck className="w-4 h-4 fill-amber-500 text-amber-500" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Right Slip Thumbnail Column */}
        {currentPaper.paperImageUrl && (
          <div 
            onClick={() => onOpenPaper(currentPaper)}
            className="relative lg:w-56 h-48 lg:h-auto rounded-2xl overflow-hidden border-2 border-slate-200 hover:border-indigo-500 shadow-md cursor-pointer shrink-0 transition-transform duration-300 hover:scale-[1.02] bg-slate-50 group"
            title="Click to view full high-res paper slip"
          >
            <img
              src={currentPaper.paperImageUrl}
              alt="Trending Exam Paper Slip"
              className="w-full h-full object-cover object-top opacity-95 group-hover:opacity-100 transition-opacity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent flex items-end justify-center pb-3">
              <span className="text-xs font-bold text-white flex items-center gap-1.5 bg-slate-900/90 px-3 py-1 rounded-full border border-slate-700 shadow-md">
                <Eye className="w-3.5 h-3.5 text-indigo-400" />
                <span>View Slip</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Dots Indicator */}
      <div className="relative z-10 flex items-center justify-center gap-2 pt-5">
        {trendingPapers.map((paper, idx) => (
          <button
            key={paper.id}
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-300 rounded-full ${
              currentIndex === idx
                ? 'w-8 h-2 bg-indigo-600 shadow-xs'
                : 'w-2 h-2 bg-slate-200 hover:bg-slate-300'
            }`}
            title={`Slide ${idx + 1}: ${paper.subject}`}
          />
        ))}
      </div>
    </div>
  );
}
