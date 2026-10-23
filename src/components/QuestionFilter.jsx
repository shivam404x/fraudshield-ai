import React from 'react';
import { Search, Filter, X, BookmarkCheck, RotateCcw, Ghost } from 'lucide-react';
import { ALL_KRMU_SCHOOLS, ALL_SEMESTERS } from '../data/krMangalamCourses';
import { DIFFICULTIES } from '../data/examCategories';

export default function QuestionFilter({
  searchQuery,
  setSearchQuery,
  selectedSchool,
  setSelectedSchool,
  selectedCourse,
  setSelectedCourse,
  selectedSemester,
  setSelectedSemester,
  selectedSubject,
  setSelectedSubject,
  selectedExamType,
  setSelectedExamType,
  selectedDifficulty,
  setSelectedDifficulty,
  anonymousOnly,
  setAnonymousOnly,
  bookmarkedOnly,
  setBookmarkedOnly,
  totalCount,
  filteredCount,
  onResetFilters,
  onSelectSchool,
}) {
  const hasActiveFilters =
    searchQuery ||
    selectedSchool !== 'All' ||
    selectedCourse !== 'All' ||
    selectedSemester !== 'All' ||
    selectedSubject !== 'All' ||
    selectedExamType !== 'All' ||
    selectedDifficulty !== 'All' ||
    anonymousOnly ||
    bookmarkedOnly;

  // Get available programs for selected school
  const currentSchoolData = ALL_KRMU_SCHOOLS.find((s) => s.id === selectedSchool);
  const availablePrograms = currentSchoolData 
    ? currentSchoolData.programs 
    : ALL_KRMU_SCHOOLS.flatMap((s) => s.programs);

  // Available subjects
  const availableSubjects = currentSchoolData
    ? currentSchoolData.commonSubjects
    : Array.from(new Set(ALL_KRMU_SCHOOLS.flatMap((s) => s.commonSubjects)));

  return (
    <div className="paper-glass-card rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
      {/* Top Search Bar & Toggle buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search question papers, subjects, codes, topics..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Anonymous Drops Only Toggle */}
        <button
          onClick={() => setAnonymousOnly(!anonymousOnly)}
          className={`flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-2xl border text-xs font-bold transition-all shrink-0 ${
            anonymousOnly
              ? 'bg-rose-50 border-rose-300 text-rose-700 ring-1 ring-rose-300'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Ghost className={`w-3.5 h-3.5 ${anonymousOnly ? 'text-rose-600' : 'text-slate-400'}`} />
          <span>🕶️ Anon Only</span>
        </button>

        {/* Starred / Bookmarked toggle */}
        <button
          onClick={() => setBookmarkedOnly(!bookmarkedOnly)}
          className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-2xl border text-xs font-bold transition-all shrink-0 ${
            bookmarkedOnly
              ? 'bg-amber-50 border-amber-300 text-amber-700 ring-1 ring-amber-300'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <BookmarkCheck className={`w-4 h-4 ${bookmarkedOnly ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
          <span>Starred</span>
        </button>
      </div>

      {/* Filter Selects Grid: Course, Semester, Subject, Marks Weightage */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
        {/* 1. School Select */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            School
          </label>
          <select
            value={selectedSchool}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedSchool(val);
              setSelectedCourse('All');
              setSelectedSubject('All');
              setSelectedSemester('All');
              setSelectedExamType('All');
              setSelectedDifficulty('All');
              if (onSelectSchool && val !== 'All') {
                onSelectSchool(val);
              }
            }}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Schools</option>
            {ALL_KRMU_SCHOOLS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Course / Specialization Select */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Specialization
          </label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Specializations</option>
            {availablePrograms.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Semester Select */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Semester
          </label>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Semesters</option>
            {ALL_SEMESTERS.map((sem) => (
              <option key={sem} value={sem}>
                {sem}
              </option>
            ))}
          </select>
        </div>

        {/* 4. Subject Select */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Subject
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Subjects</option>
            {availableSubjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* 5. Exam Type & Marks Weightage (Mid-Term: 20 Marks, End-Term: 40 Marks) */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Exam &amp; Weightage
          </label>
          <select
            value={selectedExamType}
            onChange={(e) => setSelectedExamType(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Exams &amp; Marks</option>
            <option value="Mid-Term">Mid-Term (MTE) — 20 Marks</option>
            <option value="End-Term">End-Term (ETE) — 40 Marks</option>
          </select>
        </div>

        {/* 6. Difficulty Select */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Difficulty
          </label>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Difficulties</option>
            {DIFFICULTIES.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter Summary & Reset Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
        <div className="text-slate-500 flex items-center gap-2">
          <span><strong>{filteredCount}</strong> of <strong>{totalCount}</strong> question papers</span>
          {hasActiveFilters && (
            <span className="text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200 font-semibold text-[11px]">
              Active Filters
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-semibold transition-colors text-xs"
          >
            <RotateCcw className="w-3 h-3" />
            Reset filters
          </button>
        )}
      </div>
    </div>
  );
}
