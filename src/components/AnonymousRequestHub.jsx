import React, { useState } from 'react';
import { 
  HelpCircle, Plus, CheckCircle2, Clock, 
  X, AlertCircle, Heart, MessageSquare, Send, ChevronDown, ChevronUp
} from 'lucide-react';
import { ALL_KRMU_SCHOOLS, ALL_SEMESTERS } from '../data/krMangalamCourses';
import { EXAM_TYPES } from '../data/examCategories';
import { detectAbusiveContent } from '../utils/moderation';

export default function AnonymousRequestHub({
  requests,
  onSaveRequest,
  onUpdateRequest,
  onOpenAnonymousDrop,
  currentUser,
  currentDepartment = 'SOET',
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterSchool, setFilterSchool] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [expandedComments, setExpandedComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  // Request form state
  const [school, setSchool] = useState(currentDepartment);
  const [course, setCourse] = useState('B.Tech CSE (Core)');
  const [semester, setSemester] = useState('Semester 4');
  const [subject, setSubject] = useState('');
  const [examType, setExamType] = useState('End-Term Examination (ETE)');
  const [requestText, setRequestText] = useState('');
  const [formError, setFormError] = useState('');

  const currentSchoolData = ALL_KRMU_SCHOOLS.find((s) => s.id === school) || ALL_KRMU_SCHOOLS[0];

  const handleSelectSchool = (schoolId) => {
    setSchool(schoolId);
    const target = ALL_KRMU_SCHOOLS.find((s) => s.id === schoolId);
    if (target && target.programs.length > 0) {
      setCourse(target.programs[0].name);
    }
  };

  const handleCreateRequest = (e) => {
    e.preventDefault();
    if (!subject.trim()) {
      setFormError('Please enter the subject name you need a paper for.');
      return;
    }
    if (!requestText.trim()) {
      setFormError('Please describe which semester / unit / exam paper you need.');
      return;
    }

    // Strict Universal Abuse & Profanity Filter
    const abuseCheck = detectAbusiveContent(`${subject} ${requestText}`);
    if (abuseCheck.isAbusive) {
      setFormError(`Prohibited Content: ${abuseCheck.reason || 'Abusive or vulgar language is strictly prohibited.'}`);
      return;
    }

    // 1. DUPLICATE CHECK: Prevent another person from requesting the same paper
    const isDuplicate = requests.some(
      (r) =>
        r.status === 'open' &&
        r.school.toLowerCase() === school.toLowerCase() &&
        r.semester.toLowerCase() === semester.toLowerCase() &&
        r.subject.trim().toLowerCase() === subject.trim().toLowerCase()
    );

    if (isDuplicate) {
      setFormError(
        `A request for "${subject.trim()}" in ${semester} (${school}) already exists! Another student cannot post the exact same request. Please find the existing request on the board and like (+1) or comment on it.`
      );
      return;
    }

    const newReq = {
      id: `req-${Date.now()}`,
      school,
      course,
      semester,
      subject: subject.trim(),
      examType,
      requestText: requestText.trim(),
      seekerAlias: currentUser?.alias || 'Anonymous Scholar',
      status: 'open',
      likesCount: 1,
      likedBy: [currentUser?.id || 'anon_self'],
      comments: [],
      createdAt: new Date().toISOString(),
    };

    onSaveRequest(newReq);
    setIsModalOpen(false);
    setSubject('');
    setRequestText('');
    setFormError('');
  };

  // Handle Like / +1 on existing request
  const handleToggleLike = (req) => {
    const userId = currentUser?.id || 'anon_self';
    const likedList = Array.isArray(req.likedBy) ? [...req.likedBy] : [];
    const isLiked = likedList.includes(userId);

    let updatedLikedBy;
    let nextCount;

    if (isLiked) {
      updatedLikedBy = likedList.filter((id) => id !== userId);
      nextCount = Math.max(0, (req.likesCount || 1) - 1);
    } else {
      updatedLikedBy = [...likedList, userId];
      nextCount = (req.likesCount || 0) + 1;
    }

    const updated = {
      ...req,
      likedBy: updatedLikedBy,
      likesCount: nextCount,
    };

    if (onUpdateRequest) {
      onUpdateRequest(updated);
    }
  };

  // Toggle comments expand/collapse
  const toggleComments = (reqId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [reqId]: !prev[reqId],
    }));
  };

  // Handle Add Comment
  const handleAddComment = (req) => {
    const text = (commentInputs[req.id] || '').trim();
    if (!text) return;

    // Strict Universal Abuse & Profanity Filter
    const abuseCheck = detectAbusiveContent(text);
    if (abuseCheck.isAbusive) {
      alert(`Comment blocked: ${abuseCheck.reason || 'Abusive or vulgar language is strictly prohibited.'}`);
      return;
    }

    const newComment = {
      id: `c-${Date.now()}`,
      text: text,
      authorAlias: currentUser?.alias || 'Anonymous Scholar',
      createdAt: new Date().toISOString(),
    };

    const updated = {
      ...req,
      comments: [...(req.comments || []), newComment],
    };

    if (onUpdateRequest) {
      onUpdateRequest(updated);
    }

    setCommentInputs((prev) => ({
      ...prev,
      [req.id]: '',
    }));

    // Ensure comments section is open
    setExpandedComments((prev) => ({
      ...prev,
      [req.id]: true,
    }));
  };

  const filtered = requests.filter((r) => {
    if (filterSchool !== 'All' && r.school !== filterSchool) return false;
    if (filterStatus !== 'All' && r.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-50 via-white to-purple-50 border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Anonymous Paper Request Board</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            KRMU Question Paper Request Hub
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            Need past exam papers for any KRMU course or semester? Post an anonymous request here. If a request already exists, you can like (+1) or comment below to boost demand!
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Request a Paper</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl p-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterStatus('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStatus === 'All' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Requests ({requests.length})
          </button>
          <button
            onClick={() => setFilterStatus('open')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStatus === 'open' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Needs Paper (Open)
          </button>
          <button
            onClick={() => setFilterStatus('fulfilled')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStatus === 'fulfilled' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Fulfilled &bull; Solved
          </button>
        </div>

        <select
          value={filterSchool}
          onChange={(e) => setFilterSchool(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-xs text-slate-700 rounded-xl px-3 py-1.5 focus:bg-white focus:outline-none"
        >
          <option value="All">All KRMU Schools</option>
          {ALL_KRMU_SCHOOLS.map((s) => (
            <option key={s.id} value={s.id}>{s.id}</option>
          ))}
        </select>
      </div>

      {/* Requests Grid */}
      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((req) => {
            const userId = currentUser?.id || 'anon_self';
            const isLiked = Array.isArray(req.likedBy) && req.likedBy.includes(userId);
            const likesCount = req.likesCount || (req.likedBy ? req.likedBy.length : 0);
            const commentsList = req.comments || [];
            const isCommentsOpen = Boolean(expandedComments[req.id]);

            return (
              <div
                key={req.id}
                className="paper-glass-card rounded-2xl p-5 sm:p-6 shadow-xs space-y-4 transition-all"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {req.school}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
                      {req.semester}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-black text-amber-800 bg-amber-50 border border-amber-200">
                      {req.subject}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {req.examType}
                    </span>

                    {req.status === 'open' ? (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Waiting for Paper
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Fulfilled
                      </span>
                    )}
                  </div>

                  {/* Fulfill Action Button */}
                  <div className="shrink-0 flex items-center gap-2">
                    {req.status === 'open' ? (
                      <button
                        onClick={() => onOpenAnonymousDrop({
                          subject: req.subject,
                          school: req.school,
                          semester: req.semester,
                          requestId: req.id,
                        })}
                        className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white font-bold text-xs shadow-xs transition-all hover:scale-[1.02]"
                      >
                        <span>🕶️</span>
                        <span>Drop Paper (Fulfill)</span>
                      </button>
                    ) : (
                      <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                        In KRMU Vault ✓
                      </span>
                    )}
                  </div>
                </div>

                {/* Request Content Body */}
                <p className="text-sm text-slate-800 font-medium leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  "{req.requestText}"
                </p>

                {/* Metadata & Actions: Like + Comments count + Seeker alias */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-3">
                    {/* Seeker Alias */}
                    <span className="flex items-center gap-1.5">
                      <span>🕶️</span>
                      <span>Requested by <strong className="text-slate-800">{req.seekerAlias || 'Anonymous Scholar'}</strong></span>
                    </span>

                    {req.status === 'fulfilled' && (
                      <span className="text-emerald-600 flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Fulfilled by {req.fulfilledByAlias}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Like / +1 Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleLike(req)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                        isLiked
                          ? 'bg-rose-50 text-rose-600 border-rose-300 shadow-xs'
                          : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                      title="Click if you also need this question paper"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                      <span>{likesCount} {likesCount === 1 ? 'needs this' : 'need this'}</span>
                    </button>

                    {/* Toggle Comments Button */}
                    <button
                      type="button"
                      onClick={() => toggleComments(req.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold border border-slate-200 transition-colors shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Comments ({commentsList.length})</span>
                      {isCommentsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Collapsible Comments Section */}
                {isCommentsOpen && (
                  <div className="space-y-3 pt-3 border-t border-slate-200 bg-slate-50/70 -mx-5 sm:-mx-6 -mb-5 sm:-mb-6 p-4 sm:p-5 rounded-b-2xl">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Student Discussions &amp; Notes</span>
                    </h5>

                    {/* Comments List */}
                    {commentsList.length > 0 ? (
                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {commentsList.map((comm) => (
                          <div
                            key={comm.id}
                            className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs space-y-1 shadow-xs"
                          >
                            <div className="flex items-center justify-between text-[11px] text-slate-500">
                              <span className="flex items-center gap-1.5 font-bold text-slate-800">
                                <span>🕶️</span>
                                <span>{comm.authorAlias || 'Anonymous Scholar'}</span>
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {new Date(comm.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                            <p className="text-slate-700 text-xs pl-5">
                              {comm.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">
                        No comments yet. Have notes or need specific units? Leave a comment below!
                      </p>
                    )}

                    {/* Add Comment Input Bar */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={commentInputs[req.id] || ''}
                        onChange={(e) => setCommentInputs({ ...commentInputs, [req.id]: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddComment(req);
                          }
                        }}
                        placeholder={`Comment anonymously as ${currentUser?.alias || 'Anonymous Scholar'}...`}
                        className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddComment(req)}
                        className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-xs"
                        title="Post comment"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white border border-slate-200 rounded-3xl space-y-3 shadow-xs">
            <HelpCircle className="w-10 h-10 text-slate-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-900">No requests found</h4>
            <p className="text-xs text-slate-500">Be the first to post a past paper request!</p>
          </div>
        )}
      </div>

      {/* Modal: Post a Request */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                <HelpCircle className="w-5 h-5 text-indigo-600" />
                <span>Request a Question Paper</span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateRequest} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">School</label>
                  <select
                    value={school}
                    onChange={(e) => handleSelectSchool(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 focus:bg-white focus:outline-none"
                  >
                    {ALL_KRMU_SCHOOLS.map((s) => (
                      <option key={s.id} value={s.id}>{s.id}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Semester</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 focus:bg-white focus:outline-none"
                  >
                    {ALL_SEMESTERS.map((sem) => (
                      <option key={sem} value={sem}>{sem}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Course / Specialization</label>
                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 focus:bg-white focus:outline-none"
                >
                  {currentSchoolData.programs.map((p) => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Subject Name *</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Operating Systems, Constitutional Law, Microeconomics"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Exam Type</label>
                <select
                  value={examType}
                  onChange={(e) => setExamType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 focus:bg-white focus:outline-none"
                >
                  {EXAM_TYPES.map((et) => (
                    <option key={et.id} value={et.name}>{et.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Request Details *</label>
                <textarea
                  rows={3}
                  value={requestText}
                  onChange={(e) => setRequestText(e.target.value)}
                  placeholder="e.g. Need 2023 or 2024 End-term paper slip urgently for upcoming exams..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none resize-none"
                />
              </div>

              {/* Anonymous Seeker Preview */}
              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between text-xs text-indigo-700">
                <span>Posting as: <strong>{currentUser?.alias || 'Anonymous Scholar'}</strong></span>
                <span className="text-[11px] text-indigo-600 font-bold">100% Untraceable</span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-md shadow-indigo-600/20"
                >
                  Post Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
