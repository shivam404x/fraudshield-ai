import React, { useRef } from 'react';
import { ALL_KRMU_SCHOOLS } from '../data/krMangalamCourses';
import { ChevronLeft, ChevronRight, BookMarked, Sparkles } from 'lucide-react';

export default function SubjectPillBar({
  activeDepartment,
  selectedSubject,
  onSelectSubject,
  questions = [],
}) {
  const scrollContainerRef = useRef(null);

  // Get common subjects for active department from official directory
  const schoolDef = ALL_KRMU_SCHOOLS.find((s) => s.id === activeDepartment);
  const commonSubjects = schoolDef?.commonSubjects || [];

  // Count papers per subject in this department
  const subjectCounts = React.useMemo(() => {
    const counts = {};
    questions.forEach((q) => {
      if (q.school === activeDepartment || activeDepartment === 'All') {
        const sub = q.subject;
        if (sub) {
          counts[sub] = (counts[sub] || 0) + 1;
        }
      }
    });
    return counts;
  }, [questions, activeDepartment]);

  // Combine official subjects + subjects existing in questions
  const displayedSubjects = React.useMemo(() => {
    const set = new Set(commonSubjects);
    Object.keys(subjectCounts).forEach((s) => set.add(s));
    
    // Sort so subjects that have papers come first, ordered by count descending
    return Array.from(set).sort((a, b) => {
      const countA = subjectCounts[a] || 0;
      const countB = subjectCounts[b] || 0;
      if (countA !== countB) return countB - countA;
      return a.localeCompare(b);
    });
  }, [commonSubjects, subjectCounts]);

  const totalDepartmentPapers = React.useMemo(() => {
    return questions.filter((q) => activeDepartment === 'All' || q.school === activeDepartment).length;
  }, [questions, activeDepartment]);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -280 : 280;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group/pillbar w-full py-1">
      {/* Scroll Left Button */}
      <button
        type="button"
        onClick={() => scroll('left')}
        aria-label="Scroll left"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white border border-slate-200 shadow-md text-slate-600 hover:text-slate-900 flex items-center justify-center opacity-0 group-hover/pillbar:opacity-100 transition-opacity -ml-3"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth px-1 py-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* "All Subjects" Pill */}
        <button
          type="button"
          onClick={() => onSelectSubject('All')}
          className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            selectedSubject === 'All'
              ? 'glass-pill-active ring-2 ring-indigo-400/40'
              : 'glass-pill text-slate-700 hover:text-indigo-600'
          }`}
        >
          <Sparkles className={`w-3.5 h-3.5 ${selectedSubject === 'All' ? 'text-amber-300' : 'text-amber-500'}`} />
          <span>All Subjects</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
            selectedSubject === 'All'
              ? 'bg-white/20 text-white font-extrabold'
              : 'bg-slate-100 text-slate-600 font-semibold border border-slate-200'
          }`}>
            {totalDepartmentPapers}
          </span>
        </button>

        {/* Dynamic Subjects */}
        {displayedSubjects.map((subject) => {
          const count = subjectCounts[subject] || 0;
          const isSelected = selectedSubject === subject;

          return (
            <button
              key={subject}
              type="button"
              onClick={() => onSelectSubject(subject)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isSelected
                  ? 'glass-pill-active ring-2 ring-indigo-400/40 font-bold'
                  : 'glass-pill text-slate-700 hover:text-indigo-600'
              }`}
            >
              <BookMarked className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-indigo-600'}`} />
              <span className="whitespace-nowrap max-w-[200px] truncate" title={subject}>
                {subject}
              </span>
              {count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                  isSelected
                    ? 'bg-white/20 text-white font-extrabold'
                    : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Scroll Right Button */}
      <button
        type="button"
        onClick={() => scroll('right')}
        aria-label="Scroll right"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white border border-slate-200 shadow-md text-slate-600 hover:text-slate-900 flex items-center justify-center opacity-0 group-hover/pillbar:opacity-100 transition-opacity -mr-3"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
