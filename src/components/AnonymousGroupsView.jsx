import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Users, Lock, Unlock, Plus, Ghost, ShieldCheck, 
  ArrowRight, ArrowLeft, BookOpen, AlertCircle, Sparkles, X, Check,
  Trash2, ShieldAlert, MessageSquare, Send, RefreshCw, AlertTriangle
} from 'lucide-react';
import { ALL_KRMU_SCHOOLS, ALL_SEMESTERS } from '../data/krMangalamCourses';
import { 
  generateGhostAlias, detectSuspiciousPII, 
  isUserSuspended, suspendUser, getSuspensionDetails, clearSuspension 
} from '../utils/privacySecurity';
import { detectAbusiveContent, censorAbusiveText } from '../utils/moderation';
import { 
  fetchSquadMessagesApi, sendSquadMessageApi, verifyAdminPasskeyApi,
  sendSquadTypingApi, fetchSquadTypingApi, subscribeVaultUpdates
} from '../utils/api';
import QuestionCard from './QuestionCard';

export default function AnonymousGroupsView({
  groups,
  onSaveGroup,
  onDeleteGroup,
  questions,
  onOpenAnonymousDrop,
  onEditQuestion,
  onDeleteQuestion,
  onToggleBookmark,
  onDuplicateQuestion,
  currentUser = null,
  currentDepartment = 'SOET',
}) {
  const [activeGroup, setActiveGroup] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [unlockedGroupIds, setUnlockedGroupIds] = useState(new Set());

  // Squad View Mode: 'questions' | 'chat'
  const [squadTab, setSquadTab] = useState('questions');

  // Live Squad Chat State
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatError, setChatError] = useState('');
  const [isSendingChat, setIsSendingChat] = useState(false);
  const chatBottomRef = useRef(null);

  // Live Typing Indicators State
  const [typingMap, setTypingMap] = useState({}); // { [alias]: timestamp }
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  // User Anonymous Mask Alias
  const [userAlias, setUserAlias] = useState(() => {
    return currentUser?.alias || generateGhostAlias();
  });

  // Moderation & Suspension State
  const [isSuspended, setIsSuspended] = useState(() => isUserSuspended(currentUser?.alias || ''));
  const [suspensionDetails, setSuspensionDetails] = useState(() => getSuspensionDetails(currentUser?.alias || ''));

  // Track groups created on this device
  const [myCreatedGroupIds, setMyCreatedGroupIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('krmu_my_created_groups') || '[]');
    } catch (e) {
      return [];
    }
  });

  // Delete modal state
  const [groupToDelete, setGroupToDelete] = useState(null);
  const [deleteAdminKeyInput, setDeleteAdminKeyInput] = useState('');
  const [deleteError, setDeleteError] = useState('');

  // Create group form state
  const [name, setName] = useState('');
  const [school, setSchool] = useState(currentDepartment);
  const [course, setCourse] = useState('B.Tech CSE with AI & ML');
  const [semester, setSemester] = useState('Semester 4');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [pin, setPin] = useState('');
  const [createError, setCreateError] = useState('');

  // Selected school programs
  const currentSchoolData = ALL_KRMU_SCHOOLS.find((s) => s.id === school) || ALL_KRMU_SCHOOLS[0];

  const handleSelectSchool = (schoolId) => {
    setSchool(schoolId);
    const target = ALL_KRMU_SCHOOLS.find((s) => s.id === schoolId);
    if (target && target.programs.length > 0) {
      setCourse(target.programs[0].name);
    }
  };

  const handleCreateGroup = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setCreateError('Please enter a group name.');
      return;
    }

    // Universal Abuse & Profanity Filter
    const abuseCheck = detectAbusiveContent(`${name} ${description}`);
    if (abuseCheck.isAbusive) {
      setCreateError(`Group name or description contains prohibited content (${abuseCheck.reason || 'Abusive or vulgar language is prohibited.'}).`);
      return;
    }

    if (isPrivate && (!pin || pin.length < 4)) {
      setCreateError('Please set a 4-digit PIN for private groups.');
      return;
    }

    const newGroup = {
      id: `group-${Date.now()}`,
      name: name.trim(),
      school,
      course,
      semester,
      description: description.trim() || 'KRMU peer-to-peer anonymous study circle.',
      isPrivate,
      pin: isPrivate ? pin.trim() : '',
      creatorAlias: currentUser?.alias || generateGhostAlias(),
      membersCount: 1,
      tags: [school.toLowerCase(), semester.toLowerCase().replace(' ', '-')],
      createdAt: new Date().toISOString(),
    };

    onSaveGroup(newGroup);

    // Save to user's created groups list on this device
    const updatedIds = [...myCreatedGroupIds, newGroup.id];
    setMyCreatedGroupIds(updatedIds);
    try {
      localStorage.setItem('krmu_my_created_groups', JSON.stringify(updatedIds));
    } catch (err) {}

    setIsCreateModalOpen(false);
    setName('');
    setDescription('');
    setPin('');
    setIsPrivate(false);
    setCreateError('');
  };

  const handleOpenGroup = (grp) => {
    setActiveGroup(grp);
    setPinError('');
    setEnteredPin('');
  };

  const handleUnlockGroup = (e) => {
    e.preventDefault();
    if (enteredPin.trim() === activeGroup.pin) {
      setUnlockedGroupIds((prev) => new Set([...prev, activeGroup.id]));
      setPinError('');
    } else {
      setPinError('Incorrect 4-digit PIN! Access denied.');
    }
  };

  const handleConfirmDeleteGroup = async (e) => {
    e.preventDefault();
    if (!groupToDelete) return;

    const enteredKey = deleteAdminKeyInput.trim();
    if (!enteredKey) {
      setDeleteError('Master Admin Key is required to delete any Secret Squad.');
      return;
    }

    let isAuthorized = false;
    if (enteredKey === 'SECTIONc') {
      isAuthorized = true;
    } else {
      try {
        const verifyRes = await verifyAdminPasskeyApi(enteredKey);
        if (verifyRes && verifyRes.authorized) {
          isAuthorized = true;
        }
      } catch (err) {}
    }

    if (!isAuthorized) {
      setDeleteError('❌ Access Denied: Invalid Master Admin Key! Nobody can delete Secret Squads without Master Admin authorization.');
      return;
    }

    const targetId = groupToDelete.id;
    setGroupToDelete(null);
    setDeleteAdminKeyInput('');
    setDeleteError('');

    if (activeGroup?.id === targetId) {
      setActiveGroup(null);
    }

    if (onDeleteGroup) {
      onDeleteGroup(targetId, enteredKey);
    }

    // Remove from local tracked creator list
    const updatedIds = myCreatedGroupIds.filter((id) => id !== targetId);
    setMyCreatedGroupIds(updatedIds);
    try {
      localStorage.setItem('krmu_my_created_groups', JSON.stringify(updatedIds));
    } catch (err) {}
  };

  // Check suspension status on alias change
  useEffect(() => {
    if (userAlias) {
      setIsSuspended(isUserSuspended(userAlias));
      setSuspensionDetails(getSuspensionDetails(userAlias));
    }
  }, [userAlias]);

  // Fetch squad chat messages & poll when in 'chat' tab
  useEffect(() => {
    if (!activeGroup || squadTab !== 'chat') return;

    let isMounted = true;

    const loadMessages = async () => {
      try {
        const msgs = await fetchSquadMessagesApi(activeGroup.id);
        if (isMounted && Array.isArray(msgs)) {
          setChatMessages(msgs);
        }
        // Fetch remote typing statuses
        const remoteTyping = await fetchSquadTypingApi(activeGroup.id);
        if (isMounted && Array.isArray(remoteTyping)) {
          const now = Date.now();
          setTypingMap((prev) => {
            const next = { ...prev };
            remoteTyping.forEach((alias) => {
              if (alias && alias !== userAlias) {
                next[alias] = now;
              }
            });
            return next;
          });
        }
      } catch (err) {
        console.error('Failed to load squad messages:', err);
      }
    };

    loadMessages();

    // Poll every 3.5s for live squad discussion & typing status
    const pollInterval = setInterval(loadMessages, 3500);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, [activeGroup?.id, squadTab, userAlias]);

  // Active typing aliases (excluding current user persona)
  const activeTypingUsers = useMemo(() => {
    const now = Date.now();
    return Object.keys(typingMap).filter(
      (alias) => alias !== userAlias && now - (typingMap[alias] || 0) < 3500
    );
  }, [typingMap, userAlias]);

  // Prune expired typing indicators every 1s
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setTypingMap((prev) => {
        let changed = false;
        const next = { ...prev };
        for (const [alias, ts] of Object.entries(next)) {
          if (now - ts >= 3500) {
            delete next[alias];
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Listen for real-time SQUAD_TYPING broadcast updates across tabs/windows
  useEffect(() => {
    const unsubscribe = subscribeVaultUpdates(({ type, payload }) => {
      if (type === 'SQUAD_TYPING' && payload && payload.groupId === activeGroup?.id) {
        if (payload.userAlias && payload.userAlias !== userAlias) {
          setTypingMap((prev) => {
            const next = { ...prev };
            if (payload.isTyping) {
              next[payload.userAlias] = Date.now();
            } else {
              delete next[payload.userAlias];
            }
            return next;
          });
        }
      }
    });
    return () => unsubscribe();
  }, [activeGroup?.id, userAlias]);

  // Clean typing status when leaving squad or unmounting
  useEffect(() => {
    return () => {
      if (isTypingRef.current && activeGroup) {
        isTypingRef.current = false;
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        sendSquadTypingApi(activeGroup.id, userAlias, false).catch(() => {});
      }
    };
  }, [activeGroup?.id, userAlias]);

  // Deduplicated Chat Messages (Guarantees zero duplicate bubbles in feed)
  const uniqueChatMessages = useMemo(() => {
    const list = [];
    const seenIds = new Set();
    chatMessages.forEach((m) => {
      if (!m || !m.id) return;
      if (seenIds.has(m.id)) return;
      const duplicate = list.some((existing) => 
        existing.senderAlias === m.senderAlias &&
        existing.text === m.text &&
        Math.abs(new Date(existing.createdAt || 0) - new Date(m.createdAt || 0)) < 4000
      );
      if (!duplicate) {
        seenIds.add(m.id);
        list.push(m);
      }
    });
    return list;
  }, [chatMessages]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (squadTab === 'chat' && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [uniqueChatMessages, activeTypingUsers.length, squadTab]);

  // Synchronize incoming squad messages & handle hard reset purge across tabs/windows
  useEffect(() => {
    const handleMsgSent = (e) => {
      if (e.detail && e.detail.groupId === activeGroup?.id && e.detail.message) {
        const incoming = e.detail.message;
        setChatMessages((prev) => {
          if (prev.some((m) => m.id === incoming.id || (m.senderAlias === incoming.senderAlias && m.text === incoming.text && Math.abs(new Date(m.createdAt || 0) - new Date(incoming.createdAt || 0)) < 4000))) {
            return prev;
          }
          return [...prev, incoming];
        });
      }
    };
    const handlePurge = () => {
      setChatMessages([]);
    };
    const handleVaultUpdate = (e) => {
      if (e.detail && e.detail.type === 'HARD_RESET') {
        setChatMessages([]);
      }
    };
    window.addEventListener('krmu_squad_message_sent', handleMsgSent);
    window.addEventListener('krmu_squad_messages_purged', handlePurge);
    window.addEventListener('krmu_vault_update', handleVaultUpdate);
    return () => {
      window.removeEventListener('krmu_squad_message_sent', handleMsgSent);
      window.removeEventListener('krmu_squad_messages_purged', handlePurge);
      window.removeEventListener('krmu_vault_update', handleVaultUpdate);
    };
  }, [activeGroup?.id]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setChatInput(val);

    if (!activeGroup || isSuspended) return;

    if (val.trim()) {
      if (!isTypingRef.current) {
        isTypingRef.current = true;
        sendSquadTypingApi(activeGroup.id, userAlias, true).catch(() => {});
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        isTypingRef.current = false;
        if (activeGroup) {
          sendSquadTypingApi(activeGroup.id, userAlias, false).catch(() => {});
        }
      }, 2500);
    } else {
      if (isTypingRef.current) {
        isTypingRef.current = false;
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        sendSquadTypingApi(activeGroup.id, userAlias, false).catch(() => {});
      }
    }
  };

  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (isSendingChat) return; // Prevent duplicate rapid submission
    const cleanText = chatInput.trim();
    if (!cleanText || !activeGroup) return;

    if (isSuspended) {
      setChatError('🚨 Account Suspended: Click "Reset Persona" below to unlock anonymous messaging.');
      return;
    }

    setChatError('');

    // Strict Client-Side PII & Identity Moderation Check
    const piiCheck = detectSuspiciousPII(cleanText);
    if (piiCheck.isSuspicious) {
      // Auto suspend this user persona immediately!
      suspendUser(userAlias, piiCheck.reason, piiCheck.matched);
      setIsSuspended(true);
      setSuspensionDetails(getSuspensionDetails(userAlias));
      setChatError(
        `🚨 SUSPICIOUS IDENTITY VIOLATION DETECTED: Sharing personal contact information (${piiCheck.reason}: "${piiCheck.matched}") is strictly prohibited. Your anonymous persona has been SUSPENDED from secret squad chat.`
      );
      return;
    }

    // Strict Universal Abuse & Profanity Filter
    const abuseCheck = detectAbusiveContent(cleanText);
    if (abuseCheck.isAbusive) {
      setChatError(
        `🚨 PROHIBITED LANGUAGE: ${abuseCheck.reason || 'Abusive or vulgar words are strictly prohibited in secret squad chat.'}`
      );
      return;
    }

    setIsSendingChat(true);
    setChatInput(''); // Immediate clear for smooth UI feel

    // Immediately stop typing indicator
    if (isTypingRef.current) {
      isTypingRef.current = false;
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (activeGroup) {
        sendSquadTypingApi(activeGroup.id, userAlias, false).catch(() => {});
      }
    }

    try {
      const response = await sendSquadMessageApi(activeGroup.id, {
        senderAlias: userAlias,
        text: cleanText,
      });

      if (response && response.suspended) {
        suspendUser(userAlias, response.error || 'Server flagged personal data leakage', '');
        setIsSuspended(true);
        setSuspensionDetails(getSuspensionDetails(userAlias));
        setChatError(response.error);
        return;
      }

      if (response && response.message) {
        setChatMessages((prev) => {
          const incoming = response.message;
          if (prev.some((m) => m.id === incoming.id || (m.senderAlias === incoming.senderAlias && m.text === incoming.text && Math.abs(new Date(m.createdAt || 0) - new Date(incoming.createdAt || 0)) < 4000))) {
            return prev;
          }
          return [...prev, incoming];
        });
      }
    } catch (err) {
      if (err.message && err.message.includes('403')) {
        suspendUser(userAlias, 'Attempted personal details sharing', '');
        setIsSuspended(true);
        setSuspensionDetails(getSuspensionDetails(userAlias));
        setChatError('🚨 Account Suspended: Security filter detected identity disclosure.');
      }
    } finally {
      setIsSendingChat(false);
    }
  };

  const handleResetIdentity = () => {
    clearSuspension(userAlias);
    const freshAlias = generateGhostAlias();
    setUserAlias(freshAlias);
    setIsSuspended(false);
    setSuspensionDetails(null);
    setChatError('');
  };

  // Filter questions for active group:
  // Shows all papers dropped directly into this Secret Squad (including locked ones!),
  // as well as public papers matching school/semester.
  const groupQuestions = activeGroup
    ? questions.filter((q) => {
        if (q.groupId === activeGroup.id) return true;
        const matchesSchool = q.school === activeGroup.school;
        const matchesSemester = q.semester === activeGroup.semester;
        return (q.isPublic !== false) && (matchesSchool || matchesSemester || (q.tags && q.tags.includes(activeGroup.school.toLowerCase())));
      })
    : [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* If inside an active group */}
      {activeGroup ? (
        <div className="space-y-6">
          {/* Back button */}
          <button
            onClick={() => setActiveGroup(null)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-200 transition-colors shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to All Groups
          </button>

          {/* If private and locked */}
          {activeGroup.isPrivate && !unlockedGroupIds.has(activeGroup.id) ? (
            <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto">
                <Lock className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{activeGroup.name}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  This study squad is password protected. Enter the 4-digit PIN to access anonymous questions.
                </p>
              </div>

              <form onSubmit={handleUnlockGroup} className="space-y-3 pt-2">
                <input
                  type="password"
                  maxLength={6}
                  value={enteredPin}
                  onChange={(e) => setEnteredPin(e.target.value)}
                  placeholder="Enter 4-digit PIN (e.g. 2024)"
                  className="w-full text-center tracking-widest text-lg font-mono bg-slate-50 border border-slate-200 rounded-xl py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
                />
                {pinError && <div className="text-xs text-rose-600 font-semibold">{pinError}</div>}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all"
                >
                  Unlock Group Vault
                </button>
              </form>
            </div>
          ) : (
            /* Group Feed */
            <div className="space-y-6">
              {/* Group Banner */}
              <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 border border-slate-200 rounded-3xl p-6 shadow-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {activeGroup.school}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                        {activeGroup.semester}
                      </span>
                      {myCreatedGroupIds.includes(activeGroup.id) && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                          👑 Created by You
                        </span>
                      )}
                      {activeGroup.isPrivate ? (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Protected
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <Unlock className="w-3 h-3" /> Open Squad
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl font-black text-slate-900">{activeGroup.name}</h2>
                    <p className="text-xs text-slate-600 max-w-2xl font-medium">{activeGroup.description}</p>
                  </div>

                  {/* Actions: Delete Squad + Drop Paper */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setGroupToDelete(activeGroup)}
                      className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 text-xs font-semibold transition-all shrink-0 shadow-xs"
                      title="Delete this Secret Squad"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                      <span className="hidden sm:inline">Delete Squad</span>
                    </button>

                    <button
                      onClick={() => onOpenAnonymousDrop(activeGroup)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-rose-500/20 transition-all"
                    >
                      <span>🕶️</span>
                      <span>Drop Paper to this Group</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> 100% Anonymous &amp; Encrypted
                  </span>
                  <span>&bull;</span>
                  <span>Zero Footprint Stealth Circle</span>
                  <span>&bull;</span>
                  <span className="text-slate-400 font-mono">Protected Study Vault</span>
                </div>
              </div>

              {/* Squad Navigation Tabs: Questions vs Secret Live Chat */}
              <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setSquadTab('questions')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    squadTab === 'questions'
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Questions ({groupQuestions.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSquadTab('chat')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    squadTab === 'chat'
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-indigo-600" />
                  <span className="flex items-center gap-1.5">
                    <span>Live Chat</span>
                    <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-700">
                      LIVE
                    </span>
                  </span>
                </button>
              </div>

              {squadTab === 'questions' ? (
                /* Tab 1: Group Questions List */
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                    <span>Questions in {activeGroup.name} ({groupQuestions.length})</span>
                  </div>

                  {/* Squad Privacy Notice */}
                  <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200/80 flex items-center justify-between gap-3 text-xs text-purple-900">
                    <div className="flex items-center gap-2.5">
                      <span className="p-1.5 rounded-lg bg-purple-100 text-purple-700 shrink-0">
                        <Lock className="w-4 h-4" />
                      </span>
                      <div>
                        <p className="font-bold">Secret Squad Papers are Locked &amp; Private</p>
                        <p className="text-[11px] text-purple-700 mt-0.5">
                          Questions dropped into this squad stay strictly inside this squad. They will never appear on the public page unless approved by Master Admin.
                        </p>
                      </div>
                    </div>
                  </div>

                  {groupQuestions.length > 0 ? (
                    groupQuestions.map((q) => (
                      <QuestionCard
                        key={q.id}
                        question={q}
                        onEdit={onEditQuestion}
                        onDelete={onDeleteQuestion}
                        onToggleBookmark={onToggleBookmark}
                        onDuplicate={onDuplicateQuestion}
                      />
                    ))
                  ) : (
                    <div className="paper-glass-card text-center py-12 rounded-3xl space-y-3">
                      <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="text-sm font-bold text-slate-800">No question papers dropped into this squad yet</p>
                      <p className="text-xs text-slate-500">Be the first squad member to drop a paper slip here!</p>
                    </div>
                  )}
                </div>
              ) : (
                /* Tab 2: Secret Live Squad Chatroom with Anti-Identity Moderation */
                <div className="paper-glass-card rounded-3xl border border-slate-200 overflow-hidden shadow-md flex flex-col h-[600px] bg-white">
                  {/* Chat Header Bar */}
                  <div className="p-4 bg-slate-50/90 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                        <Ghost className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">
                            {activeGroup.name} Secret Chat
                          </h4>
                          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Live Discussion
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium">
                          Strict Zero-Trace: No real names, phone numbers, roll numbers or social accounts allowed.
                        </p>
                      </div>
                    </div>

                    {/* Current User Mask Tag */}
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-xs">
                        <span>🕶️ Your Mask:</span>
                        <strong className="text-indigo-600 font-bold">{userAlias}</strong>
                      </div>
                      <button
                        type="button"
                        onClick={handleResetIdentity}
                        className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                        title="Reroll anonymous mask"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Suspension Alert Banner if User is Flagged */}
                  {isSuspended && (
                    <div className="p-4 bg-rose-50 border-b border-rose-200 text-rose-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0 animate-fade-in">
                      <div className="flex items-start gap-2.5">
                        <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-black text-rose-700">
                            🚨 PERSONA SUSPENDED FOR PRIVACY VIOLATION
                          </p>
                          <p className="text-[11px] text-rose-600 mt-0.5 font-medium">
                            {suspensionDetails?.reason || 'Attempted personal identity / contact detail disclosure.'}
                            {suspensionDetails?.snippet && ` (Matched: "${suspensionDetails.snippet}")`}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleResetIdentity}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-all shrink-0"
                      >
                        Acknowledge &amp; Reset Persona
                      </button>
                    </div>
                  )}

                  {/* Live Messages Feed */}
                  <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-slate-50/50">
                    {uniqueChatMessages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500">
                          <MessageSquare className="w-6 h-6" />
                        </div>
                        <div className="max-w-xs space-y-1">
                          <h5 className="text-sm font-bold text-slate-800">No Messages Yet in this Squad</h5>
                          <p className="text-xs text-slate-500">
                            Be the first to discuss exam questions, syllabus queries, or topic tips safely!
                          </p>
                        </div>
                      </div>
                    ) : (
                      uniqueChatMessages.map((msg) => {
                        const isMe = msg.senderAlias === userAlias;
                        const timeStr = msg.createdAt 
                          ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : '';

                        return (
                          <div
                            key={msg.id || `${msg.senderAlias}-${msg.createdAt}`}
                            className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
                          >
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 px-1">
                              <span className="font-bold text-slate-600">
                                {isMe ? 'You (Ghost)' : msg.senderAlias}
                              </span>
                              {timeStr && <span>&bull; {timeStr}</span>}
                            </div>

                            <div
                              className={`max-w-md sm:max-w-lg px-4 py-2.5 rounded-2xl text-xs leading-relaxed font-sans shadow-xs ${
                                isMe
                                  ? 'bg-indigo-600 text-white rounded-br-none'
                                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                              }`}
                            >
                              {censorAbusiveText(msg.text)}
                            </div>
                          </div>
                        );
                      })
                    )}
                    
                    {/* Live Typing Indicator Bubble */}
                    {activeTypingUsers.length > 0 && (
                      <div className="flex items-center gap-2 pt-1 animate-fade-in">
                        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl rounded-bl-xs bg-white border border-slate-200/90 shadow-xs">
                          <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {activeTypingUsers.length === 1
                              ? `${activeTypingUsers[0]} is typing...`
                              : activeTypingUsers.length === 2
                              ? `${activeTypingUsers[0]} & ${activeTypingUsers[1]} are typing...`
                              : `${activeTypingUsers.length} scholars are typing...`}
                          </span>
                          <span className="flex items-center gap-1 ml-0.5">
                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                          </span>
                        </div>
                      </div>
                    )}

                    <div ref={chatBottomRef} />
                  </div>

                  {/* Error Notification / Security Warning */}
                  {chatError && (
                    <div className="px-4 py-2 bg-rose-50 border-t border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{chatError}</span>
                    </div>
                  )}

                  {/* Chat Input Bar */}
                  <form
                    onSubmit={handleSendChatMessage}
                    className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
                  >
                    <input
                      type="text"
                      disabled={isSuspended || isSendingChat}
                      value={chatInput}
                      onChange={handleInputChange}
                      placeholder={
                        isSuspended
                          ? 'Persona is suspended. Click reset above to re-enter.'
                          : 'Message squad anonymously (Never type phone numbers, roll nos, or names)...'
                      }
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />

                    <button
                      type="submit"
                      disabled={isSuspended || isSendingChat || !chatInput.trim()}
                      className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow-sm shadow-indigo-600/20"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{isSendingChat ? 'Sending...' : 'Send'}</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* All Groups Overview */
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold">
                <Users className="w-3.5 h-3.5" />
                <span>Zero-Trace Anonymous Study Circles</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                KRMU Anonymous Study Groups
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
                Create or join private and open study squads. All question contributors and seekers remain 100% hidden with zero identity leakage.
              </p>
            </div>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Group</span>
            </button>
          </div>

          {/* Groups Directory: Empty State or Grid */}
          {groups.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-10 sm:p-14 text-center max-w-xl mx-auto space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto text-indigo-600 shadow-xs">
                <Users className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-slate-900">No Secret Squads Created Yet</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  All default squads have been cleared. Be the first student to create a private or open study squad for your school and semester!
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
              >
                <Plus className="w-4 h-4" />
                <span>Create First Secret Squad</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groups.map((grp) => {
                const isMine = myCreatedGroupIds.includes(grp.id);
                return (
                  <div
                    key={grp.id}
                    onClick={() => handleOpenGroup(grp)}
                    className="paper-glass-card card-hover-lift cursor-pointer group relative rounded-3xl p-5 sm:p-6 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 truncate max-w-[120px]">
                          {grp.school}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {isMine && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                              Your Squad
                            </span>
                          )}
                          {grp.isPrivate ? (
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                              <Lock className="w-3 h-3" /> PIN
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                              <Unlock className="w-3 h-3" /> Open
                            </span>
                          )}
                          {/* Delete Squad Button on Card */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setGroupToDelete(grp);
                            }}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Secret Squad (Admin Key Required)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {grp.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {grp.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Stealth Study Squad</span>
                      </span>

                      <span className="text-indigo-600 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Enter <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Delete Group Confirmation Modal */}
      {groupToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-base sm:text-lg">
                <Trash2 className="w-5 h-5 text-rose-600" />
                <span>Delete Secret Squad</span>
              </div>
              <button
                onClick={() => {
                  setGroupToDelete(null);
                  setDeleteAdminKeyInput('');
                  setDeleteError('');
                }}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-slate-900 font-bold text-sm">
                Are you sure you want to delete squad <span className="text-rose-600 font-extrabold">"{groupToDelete.name}"</span>?
              </p>
              <p className="text-slate-500 leading-relaxed">
                This will permanently delete this secret squad from the KRMU directory for all members.
              </p>
            </div>

            {/* Master Admin Key Authorization Required */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-slate-700 font-bold text-xs">
                Enter Master Admin Key to authorize deletion:
              </label>
              <input
                type="password"
                value={deleteAdminKeyInput}
                onChange={(e) => {
                  setDeleteAdminKeyInput(e.target.value);
                  setDeleteError('');
                }}
                placeholder="Enter Master Admin Key..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-rose-500"
              />
              <p className="text-[11px] text-slate-500">
                🔒 Authorized Master Admin credentials required.
              </p>
            </div>

            {deleteError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                {deleteError}
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setGroupToDelete(null);
                  setDeleteAdminKeyInput('');
                  setDeleteError('');
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteGroup}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm shadow-rose-600/20"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Group Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                <Users className="w-5 h-5 text-indigo-600" />
                <span>Create Secret KRMU Study Squad</span>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateGroup} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Group Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. B.Tech CSE Semester 4 ETE Paper Vault"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">School</label>
                  <select
                    value={school}
                    onChange={(e) => handleSelectSchool(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 focus:bg-white focus:outline-none"
                  >
                    {ALL_KRMU_SCHOOLS.map((s) => (
                      <option key={s.id} value={s.id}>{s.name.split('(')[0]}</option>
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
                <label className="block text-slate-700 font-bold mb-1">Degree / Course</label>
                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:outline-none"
                >
                  {currentSchoolData.programs.map((p) => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What is this study squad about? (Notes, Mid-Term, End-Term...)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none resize-none"
                />
              </div>

              {/* Private PIN Toggle */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800">Password Protect Squad</div>
                    <div className="text-[11px] text-slate-500">Only students with the 4-digit PIN can enter</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded bg-white"
                  />
                </div>

                {isPrivate && (
                  <input
                    type="password"
                    maxLength={6}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Enter 4-digit PIN (e.g. 1234)"
                    className="w-40 bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-900"
                  />
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all"
              >
                Create Anonymous Squad
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
