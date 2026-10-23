import React, { useState, useEffect } from 'react';
import { 
  X, Plus, Trash2, Eye, Edit3, Image as ImageIcon, CheckCircle, 
  HelpCircle, Sparkles, Tag, Layers, Calendar, BookOpen, Award
} from 'lucide-react';
import { ALL_KRMU_SCHOOLS, ALL_SEMESTERS } from '../data/krMangalamCourses';
import { EXAM_TYPES, QUESTION_TYPES, DIFFICULTIES, SAMPLE_TAGS } from '../data/examCategories';
import LatexRenderer from './LatexRenderer';
import confetti from 'canvas-confetti';
import { sanitizeImageAndStripExif } from '../utils/privacySecurity';
import { detectAbusiveContent } from '../utils/moderation';

const FORMULA_SNIPPETS = [
  { label: 'Fraction', latex: '$\\frac{a}{b}$' },
  { label: 'Power', latex: '$x^2$' },
  { label: 'Subscript', latex: '$x_1$' },
  { label: 'Square Root', latex: '$\\sqrt{x}$' },
  { label: 'Integral', latex: '$\\int_{0}^{t} f(x) \\, dx$' },
  { label: 'Summation', latex: '$\\sum_{i=1}^{n} x_i$' },
  { label: 'Limit', latex: '$\\lim_{x \\to 0} f(x)$' },
  { label: 'Delta', latex: '$\\Delta$' },
  { label: 'Degree', latex: '$90^\\circ$' },
  { label: 'Vector', latex: '$\\vec{v}$' },
];

export default function AddQuestionModal({ 
  isOpen, 
  onClose, 
  onSave, 
  editingQuestion = null,
  currentDepartment = 'SOET',
  currentUser = null 
}) {
  const [activeTab, setActiveTab] = useState('edit'); // 'edit' or 'preview'
  const [school, setSchool] = useState(currentDepartment);
  const [course, setCourse] = useState('B.Tech CSE (Core)');
  const [semester, setSemester] = useState('Semester 4');
  const [examType, setExamType] = useState('End-Term Examination (ETE)');
  const [exam, setExam] = useState('KRMU End-Term');
  const [subject, setSubject] = useState('Operating Systems');
  const [customSubject, setCustomSubject] = useState('');
  const [marksWeightage, setMarksWeightage] = useState('40 Marks');
  const [shift, setShift] = useState('End-Term Paper');
  const [chapter, setChapter] = useState('');
  const [type, setType] = useState('descriptive');
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionText, setQuestionText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  // MCQ Options
  const [options, setOptions] = useState([
    { id: 'A', text: '' },
    { id: 'B', text: '' },
    { id: 'C', text: '' },
    { id: 'D', text: '' },
  ]);
  const [correctAnswer, setCorrectAnswer] = useState('A'); // Single choice
  const [correctAnswersMulti, setCorrectAnswersMulti] = useState(['A']); // Multi-choice
  const [numericalAnswer, setNumericalAnswer] = useState('');

  // Detailed solution
  const [solution, setSolution] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [formError, setFormError] = useState('');

  // Populate if editing
  useEffect(() => {
    if (editingQuestion) {
      setSchool(editingQuestion.school || 'SOET');
      setCourse(editingQuestion.course || 'B.Tech CSE with AI & ML');
      setSemester(editingQuestion.semester || 'Semester 4');
      setExamType(editingQuestion.examType || 'End-Term Examination (ETE)');
      setExam(editingQuestion.exam || 'KRMU Exam');
      setSubject(editingQuestion.subject || 'Operating Systems');
      setMarksWeightage(editingQuestion.marks || (editingQuestion.examType?.includes('Mid-Term') ? '20 Marks' : '40 Marks'));
      setShift(editingQuestion.shift || '');
      setChapter(editingQuestion.chapter || '');
      setType(editingQuestion.type || 'single_choice');
      setDifficulty(editingQuestion.difficulty || 'Medium');
      setQuestionText(editingQuestion.question || '');
      setImageUrl(editingQuestion.imageUrl || '');
      setSolution(editingQuestion.solution || '');
      setTagsInput(editingQuestion.tags ? editingQuestion.tags.join(', ') : '');

      if (editingQuestion.options && editingQuestion.options.length > 0) {
        setOptions(editingQuestion.options);
      }
      if (editingQuestion.type === 'numerical') {
        setNumericalAnswer(editingQuestion.correctAnswer || '');
      } else if (editingQuestion.type === 'multiple_choice') {
        setCorrectAnswersMulti(Array.isArray(editingQuestion.correctAnswer) ? editingQuestion.correctAnswer : [editingQuestion.correctAnswer]);
      } else {
        setCorrectAnswer(editingQuestion.correctAnswer || 'A');
      }
    } else {
      resetForm();
    }
  }, [editingQuestion, isOpen]);

  const resetForm = () => {
    setSchool('SOET');
    setCourse('B.Tech CSE with AI & ML');
    setSemester('Semester 4');
    setExamType('End-Term Examination (ETE)');
    setExam('KRMU End-Term');
    setSubject('Operating Systems');
    setCustomSubject('');
    setMarksWeightage('40 Marks');
    setShift('End-Term Paper');
    setChapter('');
    setType('descriptive');
    setDifficulty('Medium');
    setQuestionText('');
    setImageUrl('');
    setOptions([
      { id: 'A', text: '' },
      { id: 'B', text: '' },
      { id: 'C', text: '' },
      { id: 'D', text: '' },
    ]);
    setCorrectAnswer('A');
    setCorrectAnswersMulti(['A']);
    setNumericalAnswer('');
    setSolution('');
    setTagsInput('');
    setFormError('');
    setActiveTab('edit');
  };

  if (!isOpen) return null;

  // Insert formula snippet at cursor or append
  const handleInsertSnippet = (snippet) => {
    setQuestionText((prev) => prev + ' ' + snippet + ' ');
  };

  const handleInsertSolutionSnippet = (snippet) => {
    setSolution((prev) => prev + ' ' + snippet + ' ');
  };

  // Handle local image upload via privacy-sanitized canvas compression
  const handleFileUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (file.size > 12 * 1024 * 1024) {
        setFormError('Image size should be less than 12MB');
        return;
      }
      try {
        setFormError('');
        const cleanDataUrl = await sanitizeImageAndStripExif(file);
        setImageUrl(cleanDataUrl);
      } catch (err) {
        if (err.message && err.message.startsWith('NSFW_BLOCKED:')) {
          setFormError(err.message.replace('NSFW_BLOCKED:', '').trim());
        } else {
          setFormError('Could not process this image format. Please upload JPG or PNG.');
        }
      }
    }
  };

  // Option handlers
  const handleOptionChange = (idx, text) => {
    const newOptions = [...options];
    newOptions[idx].text = text;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length >= 6) return;
    const nextLetter = String.fromCharCode(65 + options.length);
    setOptions([...options, { id: nextLetter, text: '' }]);
  };

  const removeOption = (idx) => {
    if (options.length <= 2) return;
    const newOptions = options.filter((_, i) => i !== idx).map((opt, i) => ({
      ...opt,
      id: String.fromCharCode(65 + i),
    }));
    setOptions(newOptions);
    if (!newOptions.some((o) => o.id === correctAnswer)) {
      setCorrectAnswer(newOptions[0].id);
    }
  };

  const toggleMultiCorrect = (optId) => {
    if (correctAnswersMulti.includes(optId)) {
      if (correctAnswersMulti.length > 1) {
        setCorrectAnswersMulti(correctAnswersMulti.filter((id) => id !== optId));
      }
    } else {
      setCorrectAnswersMulti([...correctAnswersMulti, optId]);
    }
  };

  const handleSave = (addAnother = false) => {
    if (!questionText.trim()) {
      setFormError('Please enter the question text.');
      return;
    }

    if (type === 'single_choice' || type === 'multiple_choice') {
      const emptyOption = options.some((o) => !o.text.trim());
      if (emptyOption) {
        setFormError('Please fill in text for all options (A, B, C, D).');
        return;
      }
    }

    if (type === 'numerical' && !numericalAnswer.trim()) {
      setFormError('Please provide the correct numerical answer.');
      return;
    }

    const finalSubject = subject === 'Other Subject' && customSubject.trim() ? customSubject.trim() : subject;

    // Strict Universal Abuse & Profanity Filter
    const allInputText = `${questionText} ${solution} ${chapter} ${shift} ${finalSubject} ${options.map((o) => o.text).join(' ')}`;
    const abuseCheck = detectAbusiveContent(allInputText);
    if (abuseCheck.isAbusive) {
      setFormError(`Prohibited Content: ${abuseCheck.reason || 'Abusive or vulgar language is strictly prohibited.'}`);
      return;
    }

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    const questionData = {
      id: editingQuestion ? editingQuestion.id : `krmu-paper-${Date.now()}`,
      university: 'K.R. Mangalam University',
      school: school,
      course: course,
      semester: semester,
      examType: examType,
      exam: `KRMU ${examType.includes('End-Term') ? 'End-Term' : 'Mid-Term'}`,
      subject: finalSubject,
      marks: marksWeightage,
      shift: shift.trim() || 'General',
      chapter: chapter.trim() || `${semester} Topic`,
      type: type,
      difficulty: difficulty,
      question: questionText.trim(),
      paperText: questionText.trim(),
      imageUrl: imageUrl.trim() || null,
      paperImageUrl: imageUrl.trim() || null,
      options: (type === 'single_choice' || type === 'multiple_choice') ? options : [],
      correctAnswer: type === 'numerical' 
        ? numericalAnswer.trim() 
        : type === 'multiple_choice' 
        ? correctAnswersMulti 
        : correctAnswer,
      solution: solution.trim() || 'No detailed solution provided yet.',
      tags: parsedTags.length > 0 ? parsedTags : ['kr-mangalam', school.toLowerCase(), semester.toLowerCase().replace(' ', '-')],
      isBookmarked: editingQuestion ? editingQuestion.isBookmarked : false,
      contributorAlias: currentUser?.alias || 'Anonymous Scholar',
      createdAt: editingQuestion ? editingQuestion.createdAt : new Date().toISOString(),
    };

    onSave(questionData);

    // Confetti effect
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (e) {}

    if (addAnother) {
      setQuestionText('');
      setSolution('');
      setImageUrl('');
      setOptions([
        { id: 'A', text: '' },
        { id: 'B', text: '' },
        { id: 'C', text: '' },
        { id: 'D', text: '' },
      ]);
      setNumericalAnswer('');
      setFormError('');
      setActiveTab('edit');
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white/95 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                {editingQuestion ? 'Edit Question Paper' : 'Upload Question Paper'}
              </h2>
              <p className="text-xs text-slate-500">
                Formulae support ($...$), image upload, exam metadata & detailed step-by-step solutions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switch */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab('edit')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'edit'
                    ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                Editor
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'preview'
                    ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                Live Preview
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Error message */}
        {formError && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center justify-between">
            <span>{formError}</span>
            <button onClick={() => setFormError('')} className="text-rose-500 hover:text-rose-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'edit' ? (
            <>
              {/* Exam & Session Metadata Grid */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600">
                  <BookOpen className="w-4 h-4" />
                  1. Exam Details & Metadata
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {/* 1. School */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">KRMU School *</label>
                    <select
                      value={school}
                      onChange={(e) => {
                        const newSchool = e.target.value;
                        setSchool(newSchool);
                        const target = ALL_KRMU_SCHOOLS.find((s) => s.id === newSchool);
                        if (target && target.programs.length > 0) {
                          setCourse(target.programs[0].name);
                        }
                        if (target && target.commonSubjects.length > 0) {
                          setSubject(target.commonSubjects[0]);
                        }
                      }}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-600 shadow-xs font-medium"
                    >
                      {ALL_KRMU_SCHOOLS.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name.split('(')[0]}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 2. Degree / Course */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Course / Degree *</label>
                    <select
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-600 shadow-xs font-medium"
                    >
                      {(ALL_KRMU_SCHOOLS.find((s) => s.id === school) || ALL_KRMU_SCHOOLS[0]).programs.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 3. Semester */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Semester *</label>
                    <select
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-600 shadow-xs font-medium"
                    >
                      {ALL_SEMESTERS.map((sem) => (
                        <option key={sem} value={sem}>
                          {sem}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 4. Subject */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Subject Name *</label>
                    <input
                      type="text"
                      list="add-modal-subjects"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Operating Systems, Financial Accounting"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-600 shadow-xs font-medium"
                    />
                    <datalist id="add-modal-subjects">
                      {(ALL_KRMU_SCHOOLS.find((s) => s.id === school) || ALL_KRMU_SCHOOLS[0]).commonSubjects.map((sub) => (
                        <option key={sub} value={sub} />
                      ))}
                    </datalist>
                  </div>

                  {/* 5. Marks Weightage */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Marks Weightage *</label>
                    <select
                      value={marksWeightage}
                      onChange={(e) => setMarksWeightage(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-600 shadow-xs font-medium"
                    >
                      <option value="20 Marks">Mid-Term (MTE) — 20 Marks</option>
                      <option value="40 Marks">End-Term (ETE) — 40 Marks</option>
                      <option value="2 Marks">Short Answer (2 Marks)</option>
                      <option value="5 Marks">Medium Answer (5 Marks)</option>
                      <option value="10 Marks">Long / Subjective (10 Marks)</option>
                    </select>
                  </div>

                  {/* 6. Exam Type */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Exam Type</label>
                    <select
                      value={examType}
                      onChange={(e) => {
                        const val = e.target.value;
                        setExamType(val);
                        if (val.includes('Mid-Term')) {
                          setMarksWeightage('20 Marks');
                        } else if (val.includes('End-Term')) {
                          setMarksWeightage('40 Marks');
                        }
                      }}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-600 shadow-xs font-medium"
                    >
                      {EXAM_TYPES.map((et) => (
                        <option key={et} value={et}>
                          {et}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  {/* Chapter / Topic */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Chapter / Topic</label>
                    <input
                      type="text"
                      placeholder="e.g. Thermodynamics, Calculus, Polity"
                      value={chapter}
                      onChange={(e) => setChapter(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-600 shadow-xs"
                    />
                  </div>

                  {/* Question Type */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Question Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-600 shadow-xs font-medium"
                    >
                      {QUESTION_TYPES.map((qt) => (
                        <option key={qt.id} value={qt.id}>
                          {qt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Difficulty */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Difficulty</label>
                    <div className="flex gap-2">
                      {DIFFICULTIES.map((diff) => (
                        <button
                          key={diff.id}
                          type="button"
                          onClick={() => setDifficulty(diff.id)}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                            difficulty === diff.id
                              ? `${diff.color} border-current ring-1 ring-current shadow-xs`
                              : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                          }`}
                        >
                          {diff.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Question Text Box with Math snippets */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-indigo-600">
                    2. Question Statement *
                  </label>
                  <span className="text-xs text-slate-500">
                    Use <code className="text-indigo-600 font-bold">$x^2$</code> for inline or <code className="text-indigo-600 font-bold">$$\int$$</code> for display math
                  </span>
                </div>

                {/* Math helper toolbar */}
                <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-100 border border-slate-200 rounded-xl">
                  <span className="text-xs font-bold text-slate-600 mr-1 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Math:
                  </span>
                  {FORMULA_SNIPPETS.map((snip) => (
                    <button
                      key={snip.label}
                      type="button"
                      onClick={() => handleInsertSnippet(snip.latex)}
                      className="px-2 py-0.5 rounded-lg bg-white hover:bg-indigo-600 hover:text-white text-xs font-mono text-slate-700 border border-slate-200/80 transition-colors shadow-xs"
                      title={snip.latex}
                    >
                      {snip.label}
                    </button>
                  ))}
                </div>

                <textarea
                  rows={4}
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Enter question statement here... (e.g. Find the maximum height of a projectile projected with velocity $v_0$...)"
                  className="w-full bg-white border border-slate-300 rounded-xl p-3.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600 font-sans leading-relaxed shadow-xs"
                />
              </div>

              {/* Optional Diagram / Image */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <ImageIcon className="w-4 h-4 text-indigo-600" />
                  Diagram / Image (Optional)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Paste Image URL (https://...)"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-600 shadow-xs"
                  />
                  <div className="flex items-center">
                    <label className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl cursor-pointer text-xs font-semibold text-slate-700 transition-colors shadow-xs">
                      <ImageIcon className="w-4 h-4 text-slate-500" />
                      <span>Or Upload Image file from PC</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                {imageUrl && (
                  <div className="relative inline-block mt-2 rounded-xl overflow-hidden border border-slate-200 max-h-40 bg-slate-50 p-2 shadow-xs">
                    <img src={imageUrl} alt="Diagram preview" className="max-h-40 object-contain rounded-lg" />
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white hover:bg-rose-500 shadow-xs"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Options Section for MCQ */}
              {(type === 'single_choice' || type === 'multiple_choice') && (
                <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                        3. Options &amp; Correct Answer
                      </div>
                      <p className="text-xs text-slate-500">
                        {type === 'single_choice'
                          ? 'Click the radio button to select the single correct option'
                          : 'Select one or more checkboxes for multiple correct choices'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={addOption}
                      disabled={options.length >= 6}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors disabled:opacity-40 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Option
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {options.map((opt, idx) => {
                      const isSingleCorrect = type === 'single_choice' && correctAnswer === opt.id;
                      const isMultiCorrect = type === 'multiple_choice' && correctAnswersMulti.includes(opt.id);

                      return (
                        <div
                          key={opt.id}
                          className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                            isSingleCorrect || isMultiCorrect
                              ? 'bg-emerald-50 border-emerald-300 ring-1 ring-emerald-300/40'
                              : 'bg-white border-slate-200 shadow-xs'
                          }`}
                        >
                          {/* Correct marker */}
                          {type === 'single_choice' ? (
                            <button
                              type="button"
                              onClick={() => setCorrectAnswer(opt.id)}
                              className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center transition-all ${
                                isSingleCorrect
                                  ? 'bg-emerald-600 text-white shadow-sm'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              }`}
                              title="Set as correct answer"
                            >
                              {opt.id}
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => toggleMultiCorrect(opt.id)}
                              className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center transition-all ${
                                isMultiCorrect
                                  ? 'bg-emerald-600 text-white shadow-sm'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              }`}
                              title="Toggle correct answer"
                            >
                              {opt.id}
                            </button>
                          )}

                          {/* Option Input */}
                          <input
                            type="text"
                            value={opt.text}
                            onChange={(e) => handleOptionChange(idx, e.target.value)}
                            placeholder={`Option ${opt.id} text (e.g. $v_0 \\cos\\theta$ or plain text)`}
                            className="flex-1 bg-transparent border-none text-sm text-slate-800 placeholder-slate-400 focus:outline-none font-sans"
                          />

                          {/* Render preview pill if formula */}
                          {opt.text && (opt.text.includes('$') || opt.text.length > 0) && (
                            <div className="hidden sm:block text-xs bg-slate-100 px-2.5 py-1 rounded-md text-slate-700 max-w-[200px] truncate border border-slate-200">
                              <LatexRenderer text={opt.text} />
                            </div>
                          )}

                          {/* Remove option button */}
                          {options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeOption(idx)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete this option"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Numerical Answer Input */}
              {type === 'numerical' && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 shadow-xs">
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                    3. Correct Numerical Answer *
                  </div>
                  <input
                    type="text"
                    value={numericalAnswer}
                    onChange={(e) => setNumericalAnswer(e.target.value)}
                    placeholder="Enter correct numerical value, e.g. 16 or 3.14 or -5"
                    className="w-full sm:w-72 bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 font-mono focus:outline-none focus:border-indigo-600 shadow-xs"
                  />
                  <p className="text-xs text-slate-500">
                    Students will input this exact value during test practice.
                  </p>
                </div>
              )}

              {/* Detailed Step-by-Step Solution */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" />
                    4. Step-by-Step Solution &amp; Notes
                  </label>
                  <span className="text-xs text-slate-500">Markdown &amp; LaTeX formulas supported</span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-100 border border-slate-200 rounded-xl">
                  <span className="text-xs font-bold text-slate-600 mr-1 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Math:
                  </span>
                  {FORMULA_SNIPPETS.map((snip) => (
                    <button
                      key={snip.label}
                      type="button"
                      onClick={() => handleInsertSolutionSnippet(snip.latex)}
                      className="px-2 py-0.5 rounded-lg bg-white hover:bg-emerald-600 hover:text-white text-xs font-mono text-slate-700 border border-slate-200/80 transition-colors shadow-xs"
                    >
                      {snip.label}
                    </button>
                  ))}
                </div>

                <textarea
                  rows={4}
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  placeholder="Enter step-by-step solution / explanation... (Step 1: Formula used $R = \frac{v^2}{a_n}$...)"
                  className="w-full bg-white border border-slate-300 rounded-xl p-3.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 font-sans leading-relaxed shadow-xs"
                />
              </div>

              {/* Tags & Categorization */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  5. Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="e.g. high-weightage, formula-based, ncert-direct"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-600 shadow-xs"
                />
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-xs text-slate-500 font-medium">Quick suggestions:</span>
                  {SAMPLE_TAGS.map((sampleTag) => (
                    <button
                      key={sampleTag}
                      type="button"
                      onClick={() => {
                        const current = tagsInput ? tagsInput.split(',').map((t) => t.trim()) : [];
                        if (!current.includes(sampleTag)) {
                          setTagsInput(current.length > 0 ? `${tagsInput}, ${sampleTag}` : sampleTag);
                        }
                      }}
                      className="text-xs px-2.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 font-medium transition-colors"
                    >
                      #{sampleTag}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Live Preview Screen */
            <div className="space-y-4">
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-700 text-xs flex items-center gap-2 font-medium">
                <Eye className="w-4 h-4 text-indigo-600" />
                This is exactly how students will see this question paper in the Vault!
              </div>

              {/* Preview Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
                {/* Badges Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {exam} • {marksWeightage}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white text-slate-700 border border-slate-200 shadow-xs">
                      {subject === 'Other Subject' ? customSubject || 'Subject' : subject}
                    </span>
                    {shift && (
                      <span className="px-2 py-0.5 rounded text-xs text-slate-600 bg-slate-200/60">
                        {shift}
                      </span>
                    )}
                    {chapter && (
                      <span className="px-2 py-0.5 rounded text-xs text-slate-600 bg-slate-200/60">
                        {chapter}
                      </span>
                    )}
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    difficulty === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {difficulty}
                  </span>
                </div>

                {/* Question Text */}
                <div className="text-base text-slate-900 font-medium leading-relaxed">
                  {questionText ? (
                    <LatexRenderer text={questionText} block />
                  ) : (
                    <span className="text-slate-400 italic">No question statement entered yet...</span>
                  )}
                </div>

                {/* Image */}
                {imageUrl && (
                  <div className="rounded-xl overflow-hidden border border-slate-200 max-w-md bg-white p-2 shadow-xs">
                    <img src={imageUrl} alt="Question diagram" className="max-h-60 mx-auto object-contain rounded-lg" />
                  </div>
                )}

                {/* Options Preview */}
                {(type === 'single_choice' || type === 'multiple_choice') && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {options.map((opt) => {
                      const isCorrect = type === 'single_choice' 
                        ? correctAnswer === opt.id 
                        : correctAnswersMulti.includes(opt.id);

                      return (
                        <div
                          key={opt.id}
                          className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                            isCorrect
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                              : 'bg-white border-slate-200 text-slate-700 shadow-xs'
                          }`}
                        >
                          <span className={`w-6 h-6 rounded-md text-xs font-bold flex items-center justify-center shrink-0 ${
                            isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {opt.id}
                          </span>
                          <div className="text-sm font-medium">
                            <LatexRenderer text={opt.text || `Option ${opt.id}`} />
                          </div>
                          {isCorrect && (
                            <span className="ml-auto text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                              ✓ Correct
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Numerical Preview */}
                {type === 'numerical' && (
                  <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1 shadow-xs">
                    <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Correct Answer:</div>
                    <div className="text-lg font-mono font-bold text-emerald-600">
                      {numericalAnswer || 'Not set'}
                    </div>
                  </div>
                )}

                {/* Solution Preview */}
                <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
                    <CheckCircle className="w-4 h-4" />
                    Detailed Solution / Explanation:
                  </div>
                  <div className="text-sm text-slate-700 leading-relaxed">
                    {solution ? (
                      <LatexRenderer text={solution} block />
                    ) : (
                      <span className="text-slate-400 italic">No solution provided yet...</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 bg-white sticky bottom-0 z-10">
          <button
            type="button"
            onClick={resetForm}
            className="text-xs text-slate-500 hover:text-slate-800 transition-colors font-medium"
          >
            Clear / Reset
          </button>

          <div className="flex items-center gap-3">
            {!editingQuestion && (
              <button
                type="button"
                onClick={() => handleSave(true)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all"
              >
                Save & Add Another
              </button>
            )}

            <button
              type="button"
              onClick={() => handleSave(false)}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
            >
              <CheckCircle className="w-4 h-4" />
              {editingQuestion ? 'Update Question' : 'Save Question'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
