// Vercel Serverless Function: /api/requests
// Handles GET, POST, OPTIONS with CORS, Dedicated Cloud Backend Proxy, and Cloud Sync

const DEDICATED_BACKEND = process.env.CLOUD_SERVER_URL || process.env.BACKEND_URL || 'https://krmu-vault.onrender.com';
const CLOUD_REQUESTS_URL = 'https://api.restful-api.dev/objects/ff808181a09d98f701a14f1bbe2d0c22';

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
      const targetId = req.query?.id || (pathname.includes('/requests/') ? pathname.split('/requests/')[1].split('/')[0] : '');
      const proxyUrl = targetId ? `${cleanBase}/api/requests/${targetId}` : `${cleanBase}/api/requests`;

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
      console.warn('[Proxy Warning] Dedicated backend unreachable for requests:', proxyErr.message);
    }
  }

  // 2. Fallback: Cloud Store Relay
  if (req.method === 'GET') {
    try {
      const cloudRes = await fetch(CLOUD_REQUESTS_URL, { headers: { Accept: 'application/json' } });
      if (cloudRes.ok) {
        const json = await cloudRes.json();
        const requests = json && json.data && Array.isArray(json.data.requests) ? json.data.requests : [];
        return res.status(200).json(requests);
      }
    } catch (e) {}
    return res.status(200).json([]);
  }

  if (req.method === 'POST') {
    try {
      const reqData = req.body;
      if (!reqData || !reqData.id) {
        return res.status(400).json({ error: 'Missing request data' });
      }

      let requests = [];
      try {
        const cloudRes = await fetch(CLOUD_REQUESTS_URL, { headers: { Accept: 'application/json' } });
        if (cloudRes.ok) {
          const json = await cloudRes.json();
          if (json && json.data && Array.isArray(json.data.requests)) {
            requests = json.data.requests;
          }
        }
      } catch (e) {}

      const idx = requests.findIndex((r) => r.id === reqData.id);
      if (idx >= 0) {
        requests[idx] = { ...requests[idx], ...reqData };
      } else {
        requests.unshift(reqData);
      }

      if (requests.length > 100) {
        requests = requests.slice(0, 100);
      }

      await fetch(CLOUD_REQUESTS_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'krmu_vault_shared_requests',
          data: { requests },
        }),
      });

      return res.status(201).json({ success: true, request: reqData });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'DELETE') {
    const urlObj = new URL(req.url, 'http://localhost');
    const pathname = urlObj.pathname;
    const targetId = req.query?.id || (pathname.includes('/requests/') ? pathname.split('/requests/')[1].split('/')[0] : '');

    try {
      let requests = [];
      const cloudRes = await fetch(CLOUD_REQUESTS_URL, { headers: { Accept: 'application/json' } });
      if (cloudRes.ok) {
        const json = await cloudRes.json();
        if (json && json.data && Array.isArray(json.data.requests)) {
          requests = json.data.requests;
        }
      }
      const filtered = requests.filter((r) => r.id !== targetId);
      await fetch(CLOUD_REQUESTS_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'krmu_vault_shared_requests',
          data: { requests: filtered },
        }),
      });
      return res.status(200).json({ success: true, deletedId: targetId });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
