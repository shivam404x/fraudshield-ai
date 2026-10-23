// Vercel Serverless Function: /api/groups
// Handles GET, POST, OPTIONS with CORS, Dedicated Cloud Backend Proxy, and Cloud Sync

const DEDICATED_BACKEND = process.env.CLOUD_SERVER_URL || process.env.BACKEND_URL || 'https://krmu-vault.onrender.com';
const CLOUD_GROUPS_URL = 'https://api.restful-api.dev/objects/ff808181a09d98f701a14f1bc02f0c23';

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // 1. Proxy to dedicated backend if configured
  if (DEDICATED_BACKEND) {
    try {
      const cleanBase = DEDICATED_BACKEND.replace(/\/+$/, '');
      const urlObj = new URL(req.url, 'http://localhost');
      const pathname = urlObj.pathname;
      const targetId = req.query?.id || (pathname.includes('/groups/') ? pathname.split('/groups/')[1].split('/')[0] : '');
      
      let proxyUrl = `${cleanBase}/api/groups`;
      if (pathname.includes('/messages')) {
        const parts = pathname.split('/groups/')[1]?.split('/messages')[0];
        const gid = req.query?.id || parts || '';
        proxyUrl = `${cleanBase}/api/groups/${gid}/messages`;
      } else if (pathname.includes('/typing')) {
        const parts = pathname.split('/groups/')[1]?.split('/typing')[0];
        const gid = req.query?.id || parts || '';
        proxyUrl = `${cleanBase}/api/groups/${gid}/typing`;
      } else if (targetId) {
        proxyUrl = `${cleanBase}/api/groups/${targetId}`;
      }

      const adminKey = req.headers['x-admin-key'];
      const headers = { 'Content-Type': 'application/json' };
      if (adminKey) headers['x-admin-key'] = adminKey;

      const proxyRes = await fetch(proxyUrl, {
        method: req.method,
        headers,
        body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
      });

      const data = await proxyRes.json();
      return res.status(proxyRes.status).json(data);
    } catch (proxyErr) {
      console.warn('[Proxy Warning] Dedicated backend unreachable for groups:', proxyErr.message);
    }
  }

  // 2. Fallback: Cloud Store Relay
  if (req.method === 'GET') {
    try {
      const cloudRes = await fetch(CLOUD_GROUPS_URL, { headers: { Accept: 'application/json' } });
      if (cloudRes.ok) {
        const json = await cloudRes.json();
        const groups = json && json.data && Array.isArray(json.data.groups) ? json.data.groups : [];
        return res.status(200).json(groups);
      }
    } catch (e) {}
    return res.status(200).json([]);
  }

  if (req.method === 'POST') {
    try {
      const groupData = req.body;
      if (!groupData || !groupData.id) {
        return res.status(400).json({ error: 'Missing group data' });
      }

      let groups = [];
      try {
        const cloudRes = await fetch(CLOUD_GROUPS_URL, { headers: { Accept: 'application/json' } });
        if (cloudRes.ok) {
          const json = await cloudRes.json();
          if (json && json.data && Array.isArray(json.data.groups)) {
            groups = json.data.groups;
          }
        }
      } catch (e) {}

      const idx = groups.findIndex((g) => g.id === groupData.id);
      if (idx >= 0) {
        groups[idx] = { ...groups[idx], ...groupData };
      } else {
        groups.unshift(groupData);
      }

      if (groups.length > 50) {
        groups = groups.slice(0, 50);
      }

      await fetch(CLOUD_GROUPS_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'krmu_vault_shared_groups',
          data: { groups },
        }),
      });

      return res.status(201).json({ success: true, group: groupData });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'DELETE') {
    const adminKey = req.headers['x-admin-key'] || req.query?.adminKey;
    if (adminKey !== 'SECTIONc') {
      return res.status(403).json({ error: 'Master Admin Key required to delete Secret Squad.' });
    }

    const urlObj = new URL(req.url, 'http://localhost');
    const pathname = urlObj.pathname;
    const targetId = req.query?.id || (pathname.includes('/groups/') ? pathname.split('/groups/')[1].split('/')[0] : '');

    try {
      let groups = [];
      const cloudRes = await fetch(CLOUD_GROUPS_URL, { headers: { Accept: 'application/json' } });
      if (cloudRes.ok) {
        const json = await cloudRes.json();
        if (json && json.data && Array.isArray(json.data.groups)) {
          groups = json.data.groups;
        }
      }
      const filtered = groups.filter((g) => g.id !== targetId);
      await fetch(CLOUD_GROUPS_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'krmu_vault_shared_groups',
          data: { groups: filtered },
        }),
      });
      return res.status(200).json({ success: true, deletedId: targetId });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
