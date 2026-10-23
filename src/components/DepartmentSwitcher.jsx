import React, { useState, useRef, useEffect } from 'react';
import { GraduationCap, ChevronDown, Check, Building2, Shield, User } from 'lucide-react';
import { ALL_KRMU_SCHOOLS } from '../data/krMangalamCourses';

export default function DepartmentSwitcher({
  currentDepartment,
  onSelectDepartment,
  currentUser,
  onOpenIdentityModal,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeSchool = ALL_KRMU_SCHOOLS.find((s) => s.id === currentDepartment) || ALL_KRMU_SCHOOLS[0];

  return (
    <div className="paper-glass-card flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl shadow-xs">
      
      {/* 1. Left: Department Selector */}
      <div className="flex flex-wrap items-center gap-2.5 relative" ref={dropdownRef}>
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600">
            <Building2 className="w-4 h-4" />
          </span>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Active Department
            </span>
            <span className="text-sm font-black text-slate-900">
              {activeSchool.id} &bull; {activeSchool.name.replace(/\(.*\)/, '').trim()}
            </span>
          </div>
        </div>

        {/* Switch Department Dropdown Toggle */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold transition-all shadow-xs"
        >
          <span>Switch</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-72 sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-fade-in space-y-1">
            <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
              Select Your School / Department
            </div>
            {ALL_KRMU_SCHOOLS.map((school) => {
              const isSelected = school.id === currentDepartment;
              return (
                <button
                  key={school.id}
                  onClick={() => {
                    onSelectDepartment(school.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-bold">{school.id}</span>
                    <span className="text-[11px] opacity-85 truncate max-w-[220px]">
                      {school.name.replace(/\(.*\)/, '').trim()}
                    </span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 shrink-0 text-white" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Right: Untraceable Anonymous Identity Badge */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenIdentityModal}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all hover:scale-[1.02] shadow-xs ${currentUser?.badgeColor || 'bg-white text-slate-700 border-slate-200'}`}
          title="Your untraceable anonymous persona (Zero personal data)"
        >
          <span className="text-sm">{currentUser?.icon || '🕶️'}</span>
          <span>{currentUser?.alias || 'Anonymous Scholar'}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600 font-semibold">
            New ID
          </span>
        </button>
      </div>

    </div>
  );
}
