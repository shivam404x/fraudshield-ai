/**
 * KRMU Question Paper Vault — Resilient Backend & Real-Time Multi-User Cloud Sync
 * Ensures that whenever ANY student drops a paper, request, or squad,
 * it is permanently listed, visible to EVERYONE across all devices, and persists on reload!
 */

export function getCloudServerUrl() {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('krmu_cloud_server_url');
    if (saved && saved.trim()) return saved.trim().replace(/\/+$/, '');

    // If running on local dev machine, use local server /api
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return '';
    }
  }
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      if (import.meta.env.VITE_API_SERVER_URL) {
        return import.meta.env.VITE_API_SERVER_URL.trim().replace(/\/+$/, '');
      }
      if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL.trim().replace(/\/+$/, '');
      }
    }
  } catch (e) {}

  // Official Dedicated KRMU Vault Cloud Server on Render
  return 'https://krmu-vault.onrender.com';
}

export function setCloudServerUrl(url) {
  if (typeof window === 'undefined') return;
  if (!url || !url.trim()) {
    localStorage.removeItem('krmu_cloud_server_url');
  } else {
    localStorage.setItem('krmu_cloud_server_url', url.trim().replace(/\/+$/, ''));
  }
  broadcastVaultUpdate('SERVER_URL_CHANGED', { url: url ? url.trim() : '' });
}

export async function checkServerHealth(customUrl = null) {
  const base = customUrl !== null ? (customUrl ? customUrl.trim().replace(/\/+$/, '') : '') : getCloudServerUrl();
  const endpoint = base ? `${base}/api/health` : `/api/health`;
  const start = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    const latency = Date.now() - start;
    if (res.ok) {
      const data = await res.json();
      return { online: true, latency, data, url: endpoint };
    }
    return { online: false, latency, error: `HTTP ${res.status}`, url: endpoint };
  } catch (err) {
    clearTimeout(timeoutId);
    return { online: false, latency: Date.now() - start, error: err.message, url: endpoint };
  }
}

// Permanent Global Cloud Relay Buckets (Accessible from Vercel, Mobile & Desktop)
const CLOUD_PAPERS_URL = 'https://api.restful-api.dev/objects/ff808181a09d98f701a14f1bbb610c21';
const CLOUD_REQUESTS_URL = 'https://api.restful-api.dev/objects/ff808181a09d98f701a14f1bbe2d0c22';
const CLOUD_GROUPS_URL = 'https://api.restful-api.dev/objects/ff808181a09d98f701a14f1bc02f0c23';

// Cross-tab real-time broadcast channel
let syncChannel = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    syncChannel = new BroadcastChannel('krmu_vault_sync_channel');
  }
} catch (e) {}

export function broadcastVaultUpdate(type, payload) {
  try {
    if (syncChannel) {
      syncChannel.postMessage({ type, payload, timestamp: Date.now() });
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('krmu_vault_update', { detail: { type, payload } }));
    }
  } catch (e) {}
}

export function subscribeVaultUpdates(callback) {
  if (typeof window === 'undefined') return () => {};
  const handler = (e) => {
    if (e.data) callback(e.data);
  };
  const eventHandler = (e) => {
    if (e.detail) callback(e.detail);
  };

  if (syncChannel) syncChannel.addEventListener('message', handler);
  window.addEventListener('krmu_vault_update', eventHandler);

  return () => {
    if (syncChannel) syncChannel.removeEventListener('message', handler);
    window.removeEventListener('krmu_vault_update', eventHandler);
  };
}

// Helper for fetch with dynamic Cloud Server resolution and timeout
async function apiRequest(endpoint, options = {}, timeoutMs = 6000) {
  const base = getCloudServerUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = base ? `${base}/api${cleanEndpoint}` : `/api${cleanEndpoint}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    clearTimeout(timeoutId);
    
    // Check if response is JSON (avoid HTML fallback from static rewrite)
    const contentType = res.headers.get('content-type') || '';
    if (!res.ok || !contentType.includes('application/json')) {
      throw new Error(`API error: ${res.status} (non-json)`);
    }
    return await res.json();
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// Cloud Relay Helper
async function fetchCloudStore(url) {
  try {
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (res.ok) {
      const json = await res.json();
      return json && json.data ? json.data : null;
    }
  } catch (e) {}
  return null;
}

async function updateCloudStore(url, name, data) {
  try {
    await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, data }),
    });
  } catch (e) {}
}

// -------------------------------------------------------------
// PAPERS API (Backend + Global Multi-User Cloud Sync)
// -------------------------------------------------------------
export async function fetchPapersApi() {
  const papersMap = new Map();

  // 1. Try local or Vercel serverless /api/papers
  try {
    const localData = await apiRequest('/papers', {}, 3000);
    if (Array.isArray(localData)) {
      localData.forEach((p) => {
        if (p && p.id) papersMap.set(p.id, p);
      });
    }
  } catch (err) {}

  // 2. Query Global Multi-User Cloud Store
  try {
    const cloudData = await fetchCloudStore(CLOUD_PAPERS_URL);
    if (cloudData && Array.isArray(cloudData.papers)) {
      cloudData.papers.forEach((p) => {
        if (p && p.id) {
          // If already exists, take the version with more likes/newer timestamp
          if (!papersMap.has(p.id)) {
            papersMap.set(p.id, p);
          } else {
            const existing = papersMap.get(p.id);
            if ((p.likes || 0) > (existing.likes || 0)) {
              papersMap.set(p.id, { ...existing, ...p });
            }
          }
        }
      });
    }
  } catch (err) {}

  return Array.from(papersMap.values());
}

export async function savePaperApi(paperData) {
  // 1. Broadcast to all open tabs immediately
  broadcastVaultUpdate('PAPER_SAVED', paperData);

  // 2. Save to local/server REST API
  apiRequest('/papers', {
    method: 'POST',
    body: JSON.stringify(paperData),
  }).catch(() => {});

  // 3. Save to Global Multi-User Cloud Store so ALL other students see it instantly
  try {
    const current = await fetchCloudStore(CLOUD_PAPERS_URL);
    const existingList = current && Array.isArray(current.papers) ? current.papers : [];
    const index = existingList.findIndex((p) => p.id === paperData.id);
    let updatedList;
    if (index >= 0) {
      updatedList = [...existingList];
      updatedList[index] = { ...existingList[index], ...paperData };
    } else {
      updatedList = [paperData, ...existingList];
    }
    // Keep last 150 live community papers in cloud relay
    if (updatedList.length > 150) {
      updatedList = updatedList.slice(0, 150);
    }
    await updateCloudStore(CLOUD_PAPERS_URL, 'krmu_vault_shared_papers', { papers: updatedList });
  } catch (err) {}

  return { success: true, paper: paperData };
}

export async function deletePaperApi(paperId, adminKey = 'SECTIONc') {
  broadcastVaultUpdate('PAPER_DELETED', { paperId });

  apiRequest(`/papers/${encodeURIComponent(paperId)}`, {
    method: 'DELETE',
    headers: { 'x-admin-key': adminKey },
  }).catch(() => {});

  try {
    const current = await fetchCloudStore(CLOUD_PAPERS_URL);
    if (current && Array.isArray(current.papers)) {
      const filtered = current.papers.filter((p) => p.id !== paperId);
      await updateCloudStore(CLOUD_PAPERS_URL, 'krmu_vault_shared_papers', { papers: filtered });
    }
  } catch (err) {}

  return { success: true, deletedId: paperId };
}

export async function likePaperApi(paperId, delta = 1) {
  broadcastVaultUpdate('PAPER_LIKED', { paperId, delta });

  apiRequest(`/papers/${encodeURIComponent(paperId)}/like`, {
    method: 'POST',
    body: JSON.stringify({ delta }),
  }).catch(() => {});

  try {
    const current = await fetchCloudStore(CLOUD_PAPERS_URL);
    if (current && Array.isArray(current.papers)) {
      const updated = current.papers.map((p) => {
        if (p.id === paperId) {
          const currentLikes = typeof p.likes === 'number' ? p.likes : 0;
          return { ...p, likes: Math.max(0, currentLikes + delta) };
        }
        return p;
      });
      await updateCloudStore(CLOUD_PAPERS_URL, 'krmu_vault_shared_papers', { papers: updated });
    }
  } catch (err) {}
}

// -------------------------------------------------------------
// REQUESTS API (Backend + Global Multi-User Cloud Sync)
// -------------------------------------------------------------
export async function fetchRequestsApi() {
  const reqMap = new Map();

  try {
    const local = await apiRequest('/requests', {}, 3000);
    if (Array.isArray(local)) local.forEach((r) => r && r.id && reqMap.set(r.id, r));
  } catch (err) {}

  try {
    const cloud = await fetchCloudStore(CLOUD_REQUESTS_URL);
    if (cloud && Array.isArray(cloud.requests)) {
      cloud.requests.forEach((r) => r && r.id && reqMap.set(r.id, r));
    }
  } catch (err) {}

  return Array.from(reqMap.values());
}

export async function saveRequestApi(requestData) {
  broadcastVaultUpdate('REQUEST_SAVED', requestData);

  apiRequest('/requests', {
    method: 'POST',
    body: JSON.stringify(requestData),
  }).catch(() => {});

  try {
    const current = await fetchCloudStore(CLOUD_REQUESTS_URL);
    const existingList = current && Array.isArray(current.requests) ? current.requests : [];
    const idx = existingList.findIndex((r) => r.id === requestData.id);
    let updated;
    if (idx >= 0) {
      updated = [...existingList];
      updated[idx] = { ...existingList[idx], ...requestData };
    } else {
      updated = [requestData, ...existingList];
    }
    await updateCloudStore(CLOUD_REQUESTS_URL, 'krmu_vault_shared_requests', { requests: updated.slice(0, 100) });
  } catch (err) {}

  return { success: true, request: requestData };
}

export async function deleteRequestApi(requestId) {
  broadcastVaultUpdate('REQUEST_DELETED', { requestId });

  apiRequest(`/requests/${encodeURIComponent(requestId)}`, {
    method: 'DELETE',
  }).catch(() => {});

  try {
    const current = await fetchCloudStore(CLOUD_REQUESTS_URL);
    if (current && Array.isArray(current.requests)) {
      const filtered = current.requests.filter((r) => r.id !== requestId);
      await updateCloudStore(CLOUD_REQUESTS_URL, 'krmu_vault_shared_requests', { requests: filtered });
    }
  } catch (err) {}

  return { success: true };
}

// -------------------------------------------------------------
// SECRET SQUADS (GROUPS) API (Backend + Global Multi-User Cloud Sync)
// -------------------------------------------------------------
export async function fetchGroupsApi() {
  const groupMap = new Map();

  try {
    const local = await apiRequest('/groups', {}, 3000);
    if (Array.isArray(local)) local.forEach((g) => g && g.id && groupMap.set(g.id, g));
  } catch (err) {}

  try {
    const cloud = await fetchCloudStore(CLOUD_GROUPS_URL);
    if (cloud && Array.isArray(cloud.groups)) {
      cloud.groups.forEach((g) => g && g.id && groupMap.set(g.id, g));
    }
  } catch (err) {}

  return Array.from(groupMap.values());
}

export async function saveGroupApi(groupData) {
  broadcastVaultUpdate('GROUP_SAVED', groupData);

  apiRequest('/groups', {
    method: 'POST',
    body: JSON.stringify(groupData),
  }).catch(() => {});

  try {
    const current = await fetchCloudStore(CLOUD_GROUPS_URL);
    const existingList = current && Array.isArray(current.groups) ? current.groups : [];
    const idx = existingList.findIndex((g) => g.id === groupData.id);
    let updated;
    if (idx >= 0) {
      updated = [...existingList];
      updated[idx] = { ...existingList[idx], ...groupData };
    } else {
      updated = [groupData, ...existingList];
    }
    await updateCloudStore(CLOUD_GROUPS_URL, 'krmu_vault_shared_groups', { groups: updated.slice(0, 100) });
  } catch (err) {}

  return { success: true, group: groupData };
}

export async function deleteGroupApi(groupId, adminKey = '') {
  broadcastVaultUpdate('GROUP_DELETED', { groupId });

  const headers = {};
  if (adminKey) {
    headers['x-admin-key'] = adminKey;
  }

  let result = { success: true };
  try {
    result = await apiRequest(`/groups/${encodeURIComponent(groupId)}`, {
      method: 'DELETE',
      headers,
    });
  } catch (err) {
    // Re-throw 401 or 403 authorization failures
    if (err.message && (err.message.includes('403') || err.message.includes('401'))) {
      throw err;
    }
  }

  try {
    const current = await fetchCloudStore(CLOUD_GROUPS_URL);
    if (current && Array.isArray(current.groups)) {
      const filtered = current.groups.filter((g) => g.id !== groupId);
      await updateCloudStore(CLOUD_GROUPS_URL, 'krmu_vault_shared_groups', { groups: filtered });
    }
  } catch (err) {}

  return result;
}

// -------------------------------------------------------------
// HEALTH & SERVER STATS API
// -------------------------------------------------------------
export async function fetchHealthApi() {
  return await apiRequest('/health');
}

// -------------------------------------------------------------
// MASTER ADMIN PASSKEY API
// -------------------------------------------------------------
export async function verifyAdminPasskeyApi(passkey) {
  return await apiRequest('/admin/verify', {
    method: 'POST',
    body: JSON.stringify({ passkey }),
  });
}

export async function updateAdminPasskeyApi(currentPasskey, newPasskey) {
  return await apiRequest('/admin/passkey', {
    method: 'POST',
    body: JSON.stringify({ currentPasskey, newPasskey }),
  });
}

export async function fetchAdminPasskeyStatusApi() {
  return await apiRequest('/admin/passkey/status');
}

// -------------------------------------------------------------
// SQUAD LIVE CHAT API (Resilient Backend + LocalStorage Offline Sync)
// -------------------------------------------------------------
const getLocalSquadMessages = (groupId) => {
  try {
    const raw = localStorage.getItem(`krmu_squad_messages_${groupId}`);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const saveLocalSquadMessages = (groupId, msgs) => {
  try {
    localStorage.setItem(`krmu_squad_messages_${groupId}`, JSON.stringify(msgs));
  } catch (e) {}
};

export async function fetchSquadMessagesApi(groupId) {
  try {
    const serverMsgs = await apiRequest(`/groups/${encodeURIComponent(groupId)}/messages`);
    if (Array.isArray(serverMsgs)) {
      // Merge with any offline messages with strict deduplication
      const local = getLocalSquadMessages(groupId);
      const deduplicated = [];
      const seenIds = new Set();

      const isDuplicate = (candidate, list) => {
        if (!candidate || !candidate.id) return true;
        if (seenIds.has(candidate.id)) return true;
        return list.some((existing) => 
          existing.senderAlias === candidate.senderAlias &&
          existing.text === candidate.text &&
          Math.abs(new Date(existing.createdAt || 0) - new Date(candidate.createdAt || 0)) < 4000
        );
      };

      [...serverMsgs, ...local].forEach((m) => {
        if (!isDuplicate(m, deduplicated)) {
          seenIds.add(m.id);
          deduplicated.push(m);
        }
      });

      const merged = deduplicated.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
      saveLocalSquadMessages(groupId, merged);
      return merged;
    }
  } catch (err) {
    // Graceful offline fallback
  }
  return getLocalSquadMessages(groupId);
}

export async function sendSquadMessageApi(groupId, messageData) {
  const newMsg = {
    id: messageData.id || `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    groupId,
    text: messageData.text,
    senderAlias: messageData.senderAlias || 'Anonymous Scholar',
    senderIcon: messageData.senderIcon || '🕶️',
    createdAt: messageData.createdAt || new Date().toISOString(),
  };

  // Always save immediately locally so messages never disappear or fail
  const localList = getLocalSquadMessages(groupId);
  const alreadyExists = localList.some((m) => 
    m.id === newMsg.id || 
    (m.senderAlias === newMsg.senderAlias && m.text === newMsg.text && Math.abs(new Date(m.createdAt || 0) - new Date(newMsg.createdAt || 0)) < 4000)
  );

  if (!alreadyExists) {
    localList.push(newMsg);
    saveLocalSquadMessages(groupId, localList);
  }

  // Notify active listeners across tabs/windows
  try {
    window.dispatchEvent(new CustomEvent('krmu_squad_message_sent', { detail: { groupId, message: newMsg } }));
  } catch (e) {}

  try {
    const serverResp = await apiRequest(`/groups/${encodeURIComponent(groupId)}/messages`, {
      method: 'POST',
      body: JSON.stringify(newMsg),
    });
    if (serverResp && serverResp.message) {
      return serverResp;
    }
  } catch (err) {
    // If server responded with 403 suspension, bubble up the suspension
    if (err.message && err.message.includes('403')) {
      throw err;
    }
    // Network or server offline: local delivery succeeded!
  }

  return { success: true, message: newMsg, offline: true };
}

// -------------------------------------------------------------
// SQUAD LIVE TYPING INDICATORS API
// -------------------------------------------------------------
export async function sendSquadTypingApi(groupId, userAlias, isTyping) {
  if (!groupId || !userAlias) return { success: false };

  // 1. Broadcast real-time typing status across tabs/windows
  broadcastVaultUpdate('SQUAD_TYPING', {
    groupId,
    userAlias,
    isTyping: Boolean(isTyping),
    timestamp: Date.now(),
  });

  // 2. Transmit to backend server for cross-device sync
  try {
    return await apiRequest(`/groups/${encodeURIComponent(groupId)}/typing`, {
      method: 'POST',
      body: JSON.stringify({ userAlias, isTyping: Boolean(isTyping) }),
    }, 2500);
  } catch (e) {
    return { success: false };
  }
}

export async function fetchSquadTypingApi(groupId) {
  if (!groupId) return [];
  try {
    const data = await apiRequest(`/groups/${encodeURIComponent(groupId)}/typing`, {}, 2500);
    return data && Array.isArray(data.typingUsers) ? data.typingUsers : [];
  } catch (e) {
    return [];
  }
}

// -------------------------------------------------------------
// MANUAL HARD RESET API (Master Admin Only)
// -------------------------------------------------------------
export async function triggerHardResetApi(adminKey = 'SECTIONc') {
  // 1. Wipe Global Multi-User Cloud Store for papers (Reset cloud to 0 papers)
  try {
    await updateCloudStore(CLOUD_PAPERS_URL, 'krmu_vault_shared_papers', { papers: [] });
  } catch (e) {}

  // 2. Clear all local squad chat history from browser localStorage
  if (typeof window !== 'undefined') {
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('krmu_squad_messages_') || key.startsWith('krmu_group_msgs_') || key === 'krmu_all_squad_chats')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
      window.dispatchEvent(new CustomEvent('krmu_squad_messages_purged'));
    } catch (e) {}
  }

  // 3. Broadcast real-time HARD_RESET signal across all tabs and windows
  broadcastVaultUpdate('HARD_RESET', { timestamp: Date.now() });

  // 4. Send authoritative hard-reset command to backend server
  try {
    return await apiRequest('/hard-reset', { 
      method: 'POST',
      headers: { 'x-admin-key': adminKey },
    });
  } catch (e) {
    return { success: false, error: e.message };
  }
}

export async function fetchHardResetStatusApi() {
  try {
    return await apiRequest('/hard-reset');
  } catch (e) {
    return { status: 'offline' };
  }
}

// -------------------------------------------------------------
// CLOUD SERVER BULK SYNC UTILITY
// -------------------------------------------------------------
export async function syncAllPapersToCloud(papers) {
  if (!Array.isArray(papers) || papers.length === 0) {
    return { success: false, count: 0, error: 'No papers to sync' };
  }
  let successCount = 0;
  for (const paper of papers) {
    if (paper && paper.id) {
      try {
        await savePaperApi(paper);
        successCount++;
      } catch (err) {}
    }
  }
  return { success: true, count: successCount };
}


