import { isDefaultPaper } from '../data/defaultPyqs';
import { isDefaultRequest, isDefaultGroup } from '../data/studyGroups';

const STORAGE_KEY = 'krmu_paper_vault_v4';
const USER_CUSTOM_PAPERS_KEY = 'krmu_user_custom_dropped_papers_v1';
const TEST_HISTORY_KEY = 'krmu_pyq_test_history_v2';
const GROUPS_STORAGE_KEY = 'krmu_study_groups_v1';
const REQUESTS_STORAGE_KEY = 'krmu_question_requests_v1';

export const HARD_RESET_INTERVAL_MS = 12 * 60 * 60 * 1000; // 12 hours
export const LAST_HARD_RESET_KEY = 'krmu_last_hard_reset_timestamp';

// -------------------------------------------------------------
// NATIVE INDEXED-DB HIGH-CAPACITY BACKUP STORAGE (No Quota Limit)
// -------------------------------------------------------------
const IDB_NAME = 'krmu_vault_idb_v1';
const IDB_STORE = 'papers_store';

function getIndexedDb() {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) return resolve(null);
    try {
      const req = window.indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE, { keyPath: 'id' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch (e) {
      resolve(null);
    }
  });
}

export async function saveToIndexedDb(papers) {
  try {
    const db = await getIndexedDb();
    if (!db || !Array.isArray(papers)) return;
    const tx = db.transaction(IDB_STORE, 'readwrite');
    const store = tx.objectStore(IDB_STORE);
    papers.forEach((p) => {
      if (p && p.id) store.put(p);
    });
  } catch (e) {}
}

export async function clearIndexedDb() {
  try {
    const db = await getIndexedDb();
    if (!db) return;
    const tx = db.transaction(IDB_STORE, 'readwrite');
    const store = tx.objectStore(IDB_STORE);
    store.clear();
  } catch (e) {}
}

export async function loadFromIndexedDb() {
  try {
    const db = await getIndexedDb();
    if (!db) return [];
    return new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const store = tx.objectStore(IDB_STORE);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  } catch (e) {
    return [];
  }
}

// -------------------------------------------------------------
// LOAD & SAVE QUESTIONS (Ultra-Resilient + Permanent Drops)
// -------------------------------------------------------------
export function loadQuestions() {
  try {
    // Purge old legacy keys
    localStorage.removeItem('krmu_pyq_vault_questions_v2');
    localStorage.removeItem('krmu_pyq_vault_questions_v3');
    
    // 1. Load standalone user custom drops backup first
    let userDrops = [];
    try {
      const rawUserDrops = localStorage.getItem(USER_CUSTOM_PAPERS_KEY);
      if (rawUserDrops) {
        userDrops = JSON.parse(rawUserDrops) || [];
      }
    } catch (e) {}

    // 2. Load main storage
    let parsed = [];
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        parsed = JSON.parse(raw) || [];
      } catch (e) {}
    }

    // Strictly filter and keep ONLY real papers (purging all demo showcase papers)
    const map = new Map();
    if (Array.isArray(parsed)) {
      parsed.forEach((p) => {
        if (p && p.id && !isDefaultPaper(p)) {
          map.set(p.id, { ...p, isDemo: false, isShowcaseDemo: false });
        }
      });
    }
    if (Array.isArray(userDrops)) {
      userDrops.forEach((p) => {
        if (p && p.id && !isDefaultPaper(p)) {
          map.set(p.id, { ...p, isDemo: false, isShowcaseDemo: false });
        }
      });
    }

    const merged = Array.from(map.values());
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    } catch (e) {}
    
    // Async background sync with IndexedDB
    saveToIndexedDb(merged).catch(() => {});
    return merged;
  } catch (e) {
    console.error('Failed to load papers from storage:', e);
    return [];
  }
}

/**
 * Manual Hard Reset Engine (Master Admin Authorized Only)
 * Auto-reset is completely disabled per security policy.
 * Only triggers when Master Admin explicitly executes a manual reset:
 * - Wipes ALL question papers completely (0 papers remain)
 * - Wipes ALL live squad chat history (all previous chat messages purged)
 * - Strictly PRESERVES Secret Squads (groups remain untouched)
 * - Purges stale violation tokens & temporary shields
 * - Cleans expired moderation suspensions (>12h old)
 * - Updates reset timestamp
 */
export function performManualHardReset() {
  try {
    const now = Date.now();
    console.log('[KRMU Hard Reset] Executing manual system hard reset by Master Admin...');

    // 1. Wipe ALL question papers completely (0 papers remain in vault)
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    localStorage.setItem(USER_CUSTOM_PAPERS_KEY, JSON.stringify([]));
    clearIndexedDb().catch(() => {});

    // 2. Wipe ALL live squad chat history (previous messages purged)
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('krmu_squad_messages_') || key.startsWith('krmu_group_msgs_') || key === 'krmu_all_squad_chats')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch (e) {}

    // 3. Secret Squads (GROUPS_STORAGE_KEY) are strictly preserved and untouched!

    // 4. Clear expired suspensions (>12 hours old) & device violation blocks
    try {
      const rawSusp = localStorage.getItem('krmu_suspended_users');
      if (rawSusp) {
        const suspList = JSON.parse(rawSusp);
        const activeSusp = suspList.filter((s) => {
          const suspTime = new Date(s.suspendedAt || 0).getTime();
          return (now - suspTime) < HARD_RESET_INTERVAL_MS;
        });
        localStorage.setItem('krmu_suspended_users', JSON.stringify(activeSusp));
      }
    } catch (e) {}

    localStorage.removeItem('krmu_tab_violations');
    localStorage.removeItem('krmu_device_blocked_until');
    localStorage.removeItem('krmu_device_blocked_at');
    sessionStorage.clear();

    // 5. Update timestamp
    localStorage.setItem(LAST_HARD_RESET_KEY, now.toString());

    // 6. Notify active listeners in this window
    if (typeof window !== 'undefined') {
      try {
        window.dispatchEvent(new CustomEvent('krmu_squad_messages_purged'));
      } catch (e) {}
    }

    return {
      didReset: true,
      freshQuestions: [],
      resetAt: now,
    };
  } catch (err) {
    console.error('[KRMU Hard Reset] Error executing reset:', err);
    return { didReset: false, freshQuestions: [], error: err.message };
  }
}

/**
 * Backward compatibility wrapper.
 * Automated reset is DISABLED. If force === true, performs manual hard reset.
 */
export function checkAndPerform12HourReset(force = false) {
  if (!force) {
    // Automated background reset is disabled
    return { didReset: false, autoReset: false };
  }
  return performManualHardReset();
}

/**
 * Returns status indicating reset is manual-only
 */
export function getNextHardResetInfo() {
  return { autoReset: false, manualOnly: true, hoursLeft: 0, minutesLeft: 0, progressPct: 0 };
}

export function saveQuestions(questions) {
  if (!Array.isArray(questions)) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
  } catch (e) {
    console.warn('Storage quota alert, saving essential metadata:', e);
  }

  // Also preserve custom user drops in dedicated backup key
  try {
    const userDrops = questions.filter((q) => q && !isDefaultPaper(q));
    localStorage.setItem(USER_CUSTOM_PAPERS_KEY, JSON.stringify(userDrops));
  } catch (e) {}

  // Save to IndexedDB (zero quota limits, multi-gigabyte capacity)
  saveToIndexedDb(questions).catch(() => {});
}

export function loadGroups() {
  try {
    const raw = localStorage.getItem(GROUPS_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    const cleaned = (Array.isArray(parsed) ? parsed : []).filter((g) => g && !isDefaultGroup(g));
    return cleaned;
  } catch (e) {
    return [];
  }
}

export function saveGroups(groups) {
  try {
    localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(groups));
  } catch (e) {
    console.error('Failed to save groups:', e);
  }
}

export function loadRequests() {
  try {
    const raw = localStorage.getItem(REQUESTS_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    const cleaned = (Array.isArray(parsed) ? parsed : []).filter((r) => r && !isDefaultRequest(r));
    return cleaned;
  } catch (e) {
    return [];
  }
}

export function saveRequests(requests) {
  try {
    localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(requests));
  } catch (e) {
    console.error('Failed to save requests:', e);
  }
}

export function exportQuestionsToJson(questions) {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(questions, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `krmu_vault_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function loadTestHistory() {
  try {
    const raw = localStorage.getItem(TEST_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveTestResult(result) {
  try {
    const history = loadTestHistory();
    const updated = [result, ...history].slice(0, 50); // Keep last 50
    localStorage.setItem(TEST_HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save test result:', e);
  }
}
