import React, { useState, useEffect } from 'react';
import { 
  Upload, Image as ImageIcon, FileText, CheckCircle, X, 
  Lock, Ghost, Sparkles, AlertCircle, ShieldCheck, ChevronLeft, ChevronRight, Plus, Globe
} from 'lucide-react';
import { ALL_KRMU_SCHOOLS, ALL_SEMESTERS } from '../data/krMangalamCourses';
import { sanitizeImageAndStripExif, autoRedactPersonalData, generateGhostAlias } from '../utils/privacySecurity';
import { detectAbusiveContent } from '../utils/moderation';
import confetti from 'canvas-confetti';

export default function AnonymousDropModal({ 
  isOpen, 
  onClose, 
  onSave, 
  prefill = null,
  groups = [],
  currentDepartment = 'SOET',
  currentUser = null
}) {
  const [school, setSchool] = useState(currentDepartment);
  const [course, setCourse] = useState('B.Tech CSE (Core)');
  const [subject, setSubject] = useState('Operating Systems');
  const [paperCode, setPaperCode] = useState('');
  const [semester, setSemester] = useState('Semester 4');
  const [examType, setExamType] = useState('End-Term Examination (ETE)');
  
  // Paper Content (Multi-Page Images or Text)
  const [activeInputMode, setActiveInputMode] = useState('image'); // 'image' or 'text'
  const [imageUrls, setImageUrls] = useState([]);
  const [paperText, setPaperText] = useState('');
  const [targetGroupId, setTargetGroupId] = useState('public');
  const [isStrippingExif, setIsStrippingExif] = useState(false);
  const [formError, setFormError] = useState('');

  // Prefill handling
  useEffect(() => {
    if (prefill) {
      if (prefill.school) setSchool(prefill.school);
      if (prefill.semester) setSemester(prefill.semester);
      if (prefill.subject) setSubject(prefill.subject);
      if (prefill.id) setTargetGroupId(prefill.id);
    } else if (isOpen) {
      setSchool(currentDepartment);
      const target = ALL_KRMU_SCHOOLS.find((s) => s.id === currentDepartment);
      if (target && target.programs.length > 0) {
        setCourse(target.programs[0].name);
      }
    }
  }, [prefill, isOpen, currentDepartment]);

  if (!isOpen) return null;

  const currentSchoolData = ALL_KRMU_SCHOOLS.find((s) => s.id === school) || ALL_KRMU_SCHOOLS[0];

  const handleSelectSchool = (schoolId) => {
    setSchool(schoolId);
    const target = ALL_KRMU_SCHOOLS.find((s) => s.id === schoolId);
    if (target && target.programs.length > 0) {
      setCourse(target.programs[0].name);
    }
    if (target && target.commonSubjects.length > 0) {
      setSubject(target.commonSubjects[0]);
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsStrippingExif(true);
    setFormError('');
    try {
      const sanitizedBatch = [];
      for (const file of files) {
        if (file.size > 15 * 1024 * 1024) {
          setFormError(`"${file.name}" exceeds 15MB limit.`);
          continue;
        }
        const cleanDataUrl = await sanitizeImageAndStripExif(file);
        sanitizedBatch.push(cleanDataUrl);
      }
      if (sanitizedBatch.length > 0) {
        setImageUrls((prev) => [...prev, ...sanitizedBatch]);
      }
    } catch (err) {
      if (err.message && err.message.startsWith('NSFW_BLOCKED:')) {
        setFormError(err.message.replace('NSFW_BLOCKED:', '').trim());
      } else {
        setFormError('Could not process some images. Please upload standard JPG or PNG images.');
      }
    } finally {
      setIsStrippingExif(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = (index) => {
    setImageUrls((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleMoveImage = (index, direction) => {
    setImageUrls((prev) => {
      const copy = [...prev];
      const targetIdx = index + direction;
      if (targetIdx < 0 || targetIdx >= copy.length) return prev;
      const temp = copy[index];
      copy[index] = copy[targetIdx];
      copy[targetIdx] = temp;
      return copy;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim()) {
      setFormError('Subject Name is required');
      return;
    }

    if (activeInputMode === 'image' && imageUrls.length === 0) {
      setFormError('Please upload at least one page/slip photo of the question paper.');
      return;
    }

    if (activeInputMode === 'text' && !paperText.trim()) {
      setFormError('Please enter or paste the question paper text.');
      return;
    }

    // Strict Universal Abuse & Profanity Filter
    const combinedContent = `${subject} ${paperCode} ${paperText}`;
    const abuseCheck = detectAbusiveContent(combinedContent);
    if (abuseCheck.isAbusive) {
      setFormError(`Prohibited Content: ${abuseCheck.reason || 'Abusive or vulgar language is strictly prohibited.'}`);
      return;
    }

    const marksWeightage = examType.includes('Mid') ? '20 Marks' : '40 Marks';

    const isImageMode = activeInputMode === 'image';

    const isSquadTarget = targetGroupId && targetGroupId !== 'public';
    const targetGroupObj = isSquadTarget ? groups.find((g) => g.id === targetGroupId) : null;
    const squadTitle = targetGroupObj?.name || prefill?.name || null;

    const paperData = {
      id: `paper-drop-${Date.now()}`,
      title: `${subject.trim()} (${paperCode ? paperCode.trim() + ' • ' : ''}${semester})`,
      subject: subject.trim(),
      paperCode: paperCode.trim(),
      school,
      course,
      semester,
      examType,
      marks: marksWeightage,
      contentType: isImageMode ? 'image' : 'text',
      hasImage: isImageMode,
      paperImageUrl: isImageMode ? (imageUrls[0] || '') : '',
      paperImageUrls: isImageMode ? imageUrls : [],
      pagesCount: isImageMode ? imageUrls.length : 0,
      hasText: !isImageMode,
      paperText: isImageMode ? '' : autoRedactPersonalData(paperText.trim()),
      isAnonymousDrop: true,
      contributorAlias: currentUser?.alias || generateGhostAlias(),
      groupId: isSquadTarget ? targetGroupId : null,
      squadName: squadTitle,
      isSquadExclusive: isSquadTarget,
      isPublic: !isSquadTarget, // Squad drops stay private inside the locked squad until admin makes public!
      createdAt: new Date().toISOString(),
      likes: 0,
      isBookmarked: false,
    };

    onSave(paperData);

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#4f46e5', '#3b82f6', '#10b981'],
      });
    } catch (err) {}

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r from-indigo-50/50 via-white to-purple-50/50">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600">
              <Upload className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Upload Question Paper
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 pt-0.5 font-medium">
                <span>Dropping as:</span>
                <span className="text-indigo-600 font-bold">{currentUser?.alias || 'Anonymous Scholar'}</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold border border-indigo-200 bg-indigo-50 text-indigo-700">
                  {currentUser?.icon || '🕶️'} Untraceable
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Destination Selector: Public Vault vs Secret Squad */}
          <div className="space-y-1.5 p-3 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs">
            <label className="block text-slate-700 font-bold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-600" />
                <span>Paper Destination &bull; Privacy Scope</span>
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                targetGroupId === 'public'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-purple-100 text-purple-800'
              }`}>
                {targetGroupId === 'public' ? 'Public Vault' : 'Secret Squad Only'}
              </span>
            </label>
            <select
              value={targetGroupId}
              onChange={(e) => setTargetGroupId(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none focus:border-indigo-500 shadow-xs"
            >
              <option value="public">🌐 Public Question Bank (Visible to all students)</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  🔒 {g.name} ({g.school} &bull; {g.semester}) — Locked Squad
                </option>
              ))}
            </select>
            {targetGroupId !== 'public' ? (
              <p className="text-[11px] text-purple-700 font-medium flex items-center gap-1 mt-1">
                <Lock className="w-3 h-3 shrink-0" />
                <span>Squad Lock Rule: This paper remains PRIVATE to this squad. It will NOT appear on the public page until approved by Master Admin.</span>
              </p>
            ) : (
              <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-1">
                <Globe className="w-3 h-3 shrink-0" />
                <span>Public Drop: Verified paper will be visible in the main public question bank for all students.</span>
              </p>
            )}
          </div>

          {/* Grid: School, Course, Semester, Exam Weightage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* School */}
            <div>
              <label className="block text-slate-600 font-bold mb-1">School</label>
              <select
                value={school}
                onChange={(e) => handleSelectSchool(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:bg-white focus:outline-none focus:border-indigo-500"
              >
                {ALL_KRMU_SCHOOLS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.id} — {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Course */}
            <div>
              <label className="block text-slate-600 font-bold mb-1">Course / Degree</label>
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:bg-white focus:outline-none focus:border-indigo-500"
              >
                {currentSchoolData.programs.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Semester */}
            <div>
              <label className="block text-slate-600 font-bold mb-1">Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:bg-white focus:outline-none focus:border-indigo-500"
              >
                {ALL_SEMESTERS.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            </div>

            {/* Exam & Marks Weightage */}
            <div>
              <label className="block text-slate-600 font-bold mb-1">Exam &amp; Weightage</label>
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-indigo-700 font-bold focus:bg-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Mid-Term Examination (MTE)">Mid-Term (MTE) — 20 Marks</option>
                <option value="End-Term Examination (ETE)">End-Term (ETE) — 40 Marks</option>
              </select>
            </div>
          </div>

          {/* Subject & Code */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-slate-600 font-bold mb-1">Subject Name</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Operating Systems, Financial Management"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-bold mb-1">Paper Code (Optional)</label>
              <input
                type="text"
                value={paperCode}
                onChange={(e) => setPaperCode(e.target.value)}
                placeholder="e.g. CST-204"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono focus:bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Input Mode Switcher: Upload Photo vs Type Paper Text */}
          <div className="pt-2">
            <label className="block text-slate-700 font-bold mb-2">Paper Content (Upload Photo or Paste Text):</label>
            <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 border border-slate-200 mb-3">
              <button
                type="button"
                onClick={() => setActiveInputMode('image')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeInputMode === 'image'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Upload Paper Photo / Slip</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveInputMode('text')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeInputMode === 'text'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Type / Paste Paper Text</span>
              </button>
            </div>

            {activeInputMode === 'image' ? (
              /* Drag & Drop Multi-Page Photo Zone */
              <div className="space-y-3">
                <label className="block border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-6 text-center cursor-pointer transition-all bg-slate-50 hover:bg-indigo-50/20 group">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="space-y-2">
                    <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-slate-800 font-bold text-xs">
                        Click or drag exam paper pages / slips here
                      </p>
                      <p className="text-[11px] text-indigo-600 font-semibold mt-0.5">
                        ✨ Select multiple pages at once (Page 1, 2, 3...)
                      </p>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      PNG, JPG, JPEG &bull; EXIF &amp; GPS auto-stripped for privacy
                    </p>
                  </div>
                </label>

                {isStrippingExif && (
                  <div className="text-center text-xs text-indigo-600 font-semibold animate-pulse flex items-center justify-center gap-1.5 py-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    Cleaning image metadata &amp; securing pages...
                  </div>
                )}

                {imageUrls.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-600 font-semibold px-1">
                      <span>Uploaded Pages ({imageUrls.length})</span>
                      <label className="text-indigo-600 hover:text-indigo-700 cursor-pointer flex items-center gap-1 font-bold">
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add More Pages</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {imageUrls.map((url, idx) => (
                        <div
                          key={idx}
                          className="relative rounded-xl overflow-hidden border border-slate-200 bg-white p-1.5 shadow-sm group hover:border-indigo-300 transition-all"
                        >
                          <div className="relative aspect-[3/4] bg-slate-100 rounded-lg overflow-hidden">
                            <img
                              src={url}
                              alt={`Page ${idx + 1}`}
                              className="w-full h-full object-contain"
                            />
                            <div className="absolute top-1 left-1 bg-black/70 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-bold">
                              Page {idx + 1}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="absolute top-1 right-1 p-1 rounded bg-rose-600 text-white shadow hover:bg-rose-700 transition-colors"
                              title="Remove page"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Reordering Controls */}
                          <div className="flex items-center justify-between mt-1 px-1">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleMoveImage(idx, -1)}
                              className={`p-1 rounded text-xs ${
                                idx === 0
                                  ? 'text-slate-300 cursor-not-allowed'
                                  : 'text-slate-600 hover:bg-slate-100 hover:text-indigo-600'
                              }`}
                              title="Move page earlier"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-[10px] font-semibold text-slate-500">
                              #{idx + 1}
                            </span>
                            <button
                              type="button"
                              disabled={idx === imageUrls.length - 1}
                              onClick={() => handleMoveImage(idx, 1)}
                              className={`p-1 rounded text-xs ${
                                idx === imageUrls.length - 1
                                  ? 'text-slate-300 cursor-not-allowed'
                                  : 'text-slate-600 hover:bg-slate-100 hover:text-indigo-600'
                              }`}
                              title="Move page later"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-[11px] text-emerald-600 font-semibold flex items-center justify-center gap-1.5 pt-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{imageUrls.length} page{imageUrls.length > 1 ? 's' : ''} verified, EXIF wiped &amp; attached</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Paper Textarea */
              <div>
                <textarea
                  rows={8}
                  value={paperText}
                  onChange={(e) => setPaperText(e.target.value)}
                  placeholder="Paste question paper text here (e.g. Section A: 1. Explain... Section B: 2. Solve...)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 text-xs font-mono leading-relaxed focus:bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}
          </div>

          {/* Footer Submit Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <span className="text-slate-500 text-[11px] flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified &bull; Sent to Admin Desk
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
              >
                Submit Paper to Vault
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
