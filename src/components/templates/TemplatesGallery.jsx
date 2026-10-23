import React, { useState, useEffect } from 'react';
import { 
  Layers, Search, ArrowRight, Clock, Sparkles, Filter, 
  Star, Heart, Flame, SlidersHorizontal, ChevronLeft, 
  ChevronRight, RefreshCw, Wand2, Check, Download, Eye, ExternalLink 
} from 'lucide-react';
import TemplatePreviewModal from './TemplatePreviewModal';

const CATEGORIES = [
  'All',
  'AI and Machine Learning',
  'Generative AI and LLMs',
  'Healthcare and MedTech',
  'FinTech and Banking',
  'EdTech',
  'Cybersecurity',
  'Web3 and Blockchain',
  'IoT and Smart Cities',
  'Climate and Sustainability',
  'Agriculture and Rural Innovation',
  'Social Impact',
  'SaaS and Startups',
  'Mobile Applications',
  'Web Development',
  'Data Science and Analytics',
  'Robotics',
  'Government and Smart India Hackathon',
  'Research and Academic Projects',
  'Business Models and Investor Pitches',
  'Product Demos and Technical Architecture'
];

export default function TemplatesGallery({ onSelectTemplate }) {
  // Filters & State
  const [selectedCat, setSelectedCat] = useState('All');
  const [search, setSearch] = useState('');
  const [themeFilter, setThemeFilter] = useState('');
  const [styleFilter, setStyleFilter] = useState('');
  const [purposeFilter, setPurposeFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [sortOption, setSortOption] = useState('popular'); // popular | rating | newest | slides
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(24);

  // Data from Backend API
  const [templates, setTemplates] = useState([]);
  const [totalCount, setTotalCount] = useState(10000);
  const [totalPages, setTotalPages] = useState(417);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  // AI Recommendation Section State
  const [recommendations, setRecommendations] = useState(null);
  const [aiProjectInput, setAiProjectInput] = useState('Autonomous Incident Triaging with eBPF and Claude 3.5');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showAiMatcher, setShowAiMatcher] = useState(false);

  // Preview Modal
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // 1. Fetch Templates from Backend API
  useEffect(() => {
    fetchTemplates();
  }, [selectedCat, search, themeFilter, styleFilter, purposeFilter, difficultyFilter, sortOption, page, limit]);

  // 2. Fetch Stats & Initial AI Recommendations on Mount
  useEffect(() => {
    fetchStats();
    fetchFavorites();
    fetchRecommendations();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/templates/stats');
      if (res.ok) {
        const data = await res.json();
        setTotalCount(data.totalTemplates || 10000);
      }
    } catch (e) {
      console.warn('Backend stats offline, using cache');
    }
  };

  const fetchFavorites = async () => {
    try {
      const res = await fetch('/api/templates/favorites');
      if (res.ok) {
        const data = await res.json();
        setFavorites(data || []);
      }
    } catch (e) {}
  };

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        category: selectedCat,
        search,
        theme: themeFilter,
        style: styleFilter,
        purpose: purposeFilter,
        difficulty: difficultyFilter,
        sort: sortOption
      });

      const res = await fetch(`/api/templates?${params.toString()}`);
      if (res.ok) {
        const result = await res.json();
        setTemplates(result.templates || []);
        setTotalCount(result.total || 0);
        setTotalPages(result.totalPages || 1);
      }
    } catch (err) {
      console.error('Fetch templates error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/templates/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: aiProjectInput,
          domain: selectedCat !== 'All' ? selectedCat : 'AI & Systems',
          pitchDuration: '3-min'
        })
      });
      if (res.ok) {
        const data = await res.json();
        setRecommendations(data);
      }
    } catch (e) {
      console.warn('Recommendations error:', e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleToggleFavorite = async (e, tplId) => {
    e.stopPropagation();
    try {
      const res = await fetch('/api/templates/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: tplId })
      });
      if (res.ok) {
        const data = await res.json();
        setFavorites(data.favorites || []);
      }
    } catch (e) {
      setFavorites(prev => prev.includes(tplId) ? prev.filter(id => id !== tplId) : [...prev, tplId]);
    }
  };

  const handleOpenPreview = async (e, tpl) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/templates/${tpl.id}`);
      if (res.ok) {
        const full = await res.json();
        setPreviewTemplate(full);
        setIsPreviewOpen(true);
      } else {
        setPreviewTemplate(tpl);
        setIsPreviewOpen(true);
      }
    } catch (e) {
      setPreviewTemplate(tpl);
      setIsPreviewOpen(true);
    }
  };

  const handleUseTemplate = async (tpl) => {
    try {
      const res = await fetch(`/api/templates/${tpl.id}`);
      if (res.ok) {
        const full = await res.json();
        onSelectTemplate(full.id, full);
      } else {
        onSelectTemplate(tpl.id, tpl);
      }
    } catch (e) {
      onSelectTemplate(tpl.id, tpl);
    }
    setIsPreviewOpen(false);
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col h-full overflow-hidden select-none font-sans text-slate-800">
      
      {/* 1. TOP HEADER WITH REAL STATS BADGE & SEARCH */}
      <div className="p-4 bg-white border-b border-slate-200/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 z-10 shrink-0">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
              <Layers className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-900 font-sans tracking-tight">
                  10,000+ Hackathon PPT Template Discovery
                </h2>
                <span className="flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{totalCount.toLocaleString()} Verified Templates</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-sans">
                Battle-tested slide decks across 20 judging tracks with real technical flows, metrics & speaker notes.
              </p>
            </div>
          </div>
        </div>

        {/* Search & AI Matcher Toggle */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by keywords, tech stack, track..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 bg-slate-50/80 shadow-xs"
            />
          </div>

          <button
            onClick={() => setShowAiMatcher(!showAiMatcher)}
            className={`px-3 py-2 rounded-xl text-xs font-bold font-sans flex items-center gap-1.5 transition-all shadow-xs shrink-0 ${
              showAiMatcher 
                ? 'bg-indigo-600 text-white shadow-indigo-600/30' 
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>AI Recommender</span>
          </button>
        </div>
      </div>

      {/* 2. COLLAPSIBLE AI PROJECT MATCHER PANEL */}
      {showAiMatcher && (
        <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white p-5 border-b border-indigo-800 animate-fade-in shrink-0">
          <div className="max-w-4xl mx-auto space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-amber-300 font-mono">
                  Personalized AI Template Recommendation Engine
                </h4>
              </div>
              <span className="text-[10px] font-mono text-indigo-200">
                Matches project keywords against 10,000 template vectors
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={aiProjectInput}
                onChange={(e) => setAiProjectInput(e.target.value)}
                placeholder="Enter your hackathon idea, problem statement, or tech stack..."
                className="flex-1 bg-black/40 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-stone-400 focus:outline-none focus:border-indigo-400"
              />
              <button
                onClick={fetchRecommendations}
                disabled={isAiLoading}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-transform active:scale-95 shadow-md shadow-amber-500/20 shrink-0"
              >
                {isAiLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5 fill-stone-950" />}
                <span>Get Recommendations</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. 20 CATEGORY PILLS BAR */}
      <div className="bg-white px-6 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto custom-scrollbar shrink-0">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => { setSelectedCat(cat); setPage(1); }}
            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              selectedCat === cat 
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <span>{cat}</span>
            {cat !== 'All' && (
              <span className={`text-[10px] font-mono px-1 rounded-full ${
                selectedCat === cat ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                500
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 4. SECONDARY FILTERS BAR (Theme, Style, Purpose, Difficulty, Sort) */}
      <div className="bg-slate-100/90 px-6 py-2 border-b border-slate-200/80 flex items-center justify-between gap-4 text-xs font-mono text-slate-600 shrink-0 overflow-x-auto">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 font-bold text-slate-700">
            <Filter className="w-3.5 h-3.5 text-indigo-600" />
            <span>Filters:</span>
          </div>

          {/* Theme */}
          <select
            value={themeFilter}
            onChange={(e) => { setThemeFilter(e.target.value); setPage(1); }}
            className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] focus:outline-none"
          >
            <option value="">All Themes</option>
            <option value="kraft">Kraft Paper</option>
            <option value="blueprint">Blueprint</option>
            <option value="chalkboard">Chalkboard</option>
            <option value="grid">Technical Grid</option>
            <option value="royal-indigo">Royal Indigo</option>
            <option value="neon-dark">Neon Dark</option>
          </select>

          {/* Visual Style */}
          <select
            value={styleFilter}
            onChange={(e) => { setStyleFilter(e.target.value); setPage(1); }}
            className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] focus:outline-none"
          >
            <option value="">All Styles</option>
            <option value="technical">Technical Architecture</option>
            <option value="minimal">Minimalist</option>
            <option value="bold-pitch">Bold Stage Pitch</option>
            <option value="investor-ready">Investor Ready</option>
            <option value="academic">Academic & SIH</option>
          </select>

          {/* Purpose */}
          <select
            value={purposeFilter}
            onChange={(e) => { setPurposeFilter(e.target.value); setPage(1); }}
            className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] focus:outline-none"
          >
            <option value="">All Purposes</option>
            <option value="Competition Pitch">Competition Pitch</option>
            <option value="Demo Day">Demo Day</option>
            <option value="SIH Presentation">SIH Presentation</option>
            <option value="Academic Defense">Academic Defense</option>
          </select>

          {/* Difficulty */}
          <select
            value={difficultyFilter}
            onChange={(e) => { setDifficultyFilter(e.target.value); setPage(1); }}
            className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] focus:outline-none"
          >
            <option value="">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced (High Moat)</option>
          </select>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2">
          <span>Sort By:</span>
          <select
            value={sortOption}
            onChange={(e) => { setSortOption(e.target.value); setPage(1); }}
            className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-800 focus:outline-none"
          >
            <option value="popular">🔥 Most Popular</option>
            <option value="rating">★ Highest Rated</option>
            <option value="slides">📄 Slide Count</option>
          </select>
        </div>
      </div>

      {/* 5. MAIN CONTENT AREA (AI RECOMMENDATIONS & CATALOG GRID) */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar">
        
        {/* A. PERSONALIZED RECOMMENDATIONS ROW */}
        {recommendations?.recommendedForYou && recommendations.recommendedForYou.length > 0 && (
          <div className="space-y-3 bg-gradient-to-r from-indigo-50/70 to-purple-50/70 p-5 rounded-3xl border border-indigo-100 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping" />
                <h3 className="font-extrabold text-sm text-slate-900 font-sans tracking-tight">
                  Recommended for Your Hackathon
                </h3>
              </div>
              <span className="text-[11px] font-mono text-indigo-700 font-bold">
                {recommendations.recommendedForYou.length} high-confidence matches
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recommendations.recommendedForYou.slice(0, 4).map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => handleUseTemplate(tpl)}
                  className="bg-white rounded-2xl border border-indigo-200/80 shadow-xs hover:shadow-lg hover:border-indigo-500 transition-all cursor-pointer overflow-hidden flex flex-col justify-between group p-3.5 relative"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                        {tpl.category.substring(0, 15)}
                      </span>
                      <span className="text-[9px] font-mono text-slate-500 font-bold">
                        {tpl.slideCount} slides
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-1">
                      {tpl.title}
                    </h4>

                    {/* Recommendation reason badge */}
                    <div className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md mb-2 border border-emerald-200/60 leading-tight">
                      ✓ {tpl.recommendationReason}
                    </div>

                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {tpl.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-indigo-600 group-hover:underline flex items-center gap-1 text-[11px]">
                      Use Template <ArrowRight className="w-3 h-3" />
                    </span>
                    <button
                      onClick={(e) => handleOpenPreview(e, tpl)}
                      className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-800"
                      title="Preview Slides"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* B. MAIN TEMPLATE CATALOG GRID */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-sm text-slate-900 font-sans tracking-tight">
              {selectedCat === 'All' ? 'All Hackathon Templates' : selectedCat} ({totalCount.toLocaleString()})
            </h3>
            <span className="text-[11px] font-mono text-slate-500">
              Showing {(page - 1) * limit + 1}–{Math.min(page * limit, totalCount)} of {totalCount.toLocaleString()} templates
            </span>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
              <p className="text-xs font-mono text-slate-500">Querying 10,000+ templates from database...</p>
            </div>
          ) : templates.length === 0 ? (
            <div className="py-20 text-center space-y-2">
              <p className="font-bold text-sm text-slate-700">No templates found matching your filters.</p>
              <button
                onClick={() => { setSelectedCat('All'); setSearch(''); setThemeFilter(''); setStyleFilter(''); }}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {templates.map((tpl) => {
                const isFav = favorites.includes(tpl.id);

                return (
                  <div
                    key={tpl.id}
                    onClick={() => handleUseTemplate(tpl)}
                    className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-indigo-500/80 transition-all cursor-pointer overflow-hidden flex flex-col justify-between group"
                  >
                    <div>
                      {/* THUMBNAIL (SVG Lazy Loaded) */}
                      <div className="h-40 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                        <img
                          src={tpl.thumbnail}
                          alt={tpl.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                          <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white">
                            {tpl.category.substring(0, 16)}
                          </span>

                          <button
                            onClick={(e) => handleToggleFavorite(e, tpl.id)}
                            className={`p-1.5 rounded-full transition-transform active:scale-75 ${
                              isFav ? 'bg-rose-500 text-white' : 'bg-black/40 text-white hover:bg-black/60'
                            }`}
                            title="Favorite"
                          >
                            <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-white' : ''}`} />
                          </button>
                        </div>

                        {/* Slide count pill */}
                        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-xs text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded">
                          ⏱️ ~{tpl.slideCount * 25}s • {tpl.slideCount} slides
                        </div>
                      </div>

                      {/* Details */}
                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                          <span className="flex items-center gap-1 text-amber-500 font-bold">
                            <Star className="w-3 h-3 fill-amber-500" /> {tpl.rating}
                          </span>
                          <span>{tpl.downloads.toLocaleString()} uses</span>
                        </div>

                        <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                          {tpl.title}
                        </h4>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-sans">
                          {tpl.description}
                        </p>

                        {/* Tag badges */}
                        <div className="flex items-center gap-1 flex-wrap pt-1">
                          {(tpl.tags || []).slice(0, 3).map((tag, i) => (
                            <span key={i} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Footer */}
                    <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <button
                        onClick={(e) => handleOpenPreview(e, tpl)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 text-[11px] font-bold flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3 text-slate-400" />
                        <span>Preview</span>
                      </button>

                      <button
                        onClick={() => handleUseTemplate(tpl)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm"
                      >
                        <span>Use Template</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 6. PAGINATION CONTROLS */}
          {!loading && totalPages > 1 && (
            <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">
                Page {page} of {totalPages.toLocaleString()} ({totalCount.toLocaleString()} total templates)
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 font-bold flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                {/* Direct Page Jump Buttons */}
                <div className="hidden sm:flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((pNum) => (
                    <button
                      key={pNum}
                      onClick={() => setPage(pNum)}
                      className={`w-8 h-8 rounded-lg font-bold flex items-center justify-center transition-colors ${
                        page === pNum ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {pNum}
                    </button>
                  ))}
                  {totalPages > 5 && <span className="px-1 text-slate-400">...</span>}
                  {totalPages > 5 && (
                    <button
                      onClick={() => setPage(totalPages)}
                      className={`w-8 h-8 rounded-lg font-bold flex items-center justify-center ${
                        page === totalPages ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {totalPages}
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 font-bold flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* FULL TEMPLATE SLIDE PREVIEW MODAL */}
      <TemplatePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        template={previewTemplate}
        onUseTemplate={handleUseTemplate}
      />

    </div>
  );
}
