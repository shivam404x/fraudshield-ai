// Vercel Serverless Function: /api/papers
// Handles GET, POST, OPTIONS with CORS, Dedicated Cloud Backend Proxy, and Cloud Sync

const DEDICATED_BACKEND = process.env.CLOUD_SERVER_URL || process.env.BACKEND_URL || 'https://krmu-vault.onrender.com';
const CLOUD_PAPERS_URL = 'https://api.restful-api.dev/objects/ff808181a09d98f701a14f1bbb610c21';

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, x-admin-key');
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // 1. If a dedicated backend server is configured in Vercel env, proxy directly to it!
  if (DEDICATED_BACKEND) {
    try {
      const cleanBase = DEDICATED_BACKEND.replace(/\/+$/, '');
      const urlObj = new URL(req.url, 'http://localhost');
      const pathname = urlObj.pathname;
      const targetId = req.query?.id || (pathname.includes('/papers/') ? pathname.split('/papers/')[1].split('/')[0] : '');
      const proxyUrl = targetId ? `${cleanBase}/api/papers/${targetId}` : `${cleanBase}/api/papers`;

      const proxyRes = await fetch(proxyUrl, {
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
          ...(req.headers['x-admin-key'] ? { 'x-admin-key': req.headers['x-admin-key'] } : {}),
        },
        body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
      });

      const data = await proxyRes.json();
      return res.status(proxyRes.status).json(data);
    } catch (proxyErr) {
      console.warn('[Proxy Warning] Dedicated backend unreachable, falling back to relay:', proxyErr.message);
    }
  }

  // 2. Fallback: Cloud Store Relay
  if (req.method === 'GET') {
    try {
      const cloudRes = await fetch(CLOUD_PAPERS_URL, { headers: { Accept: 'application/json' } });
      if (cloudRes.ok) {
        const json = await cloudRes.json();
        const papers = json && json.data && Array.isArray(json.data.papers) ? json.data.papers : [];
        return res.status(200).json(papers);
      }
    } catch (e) {}
    return res.status(200).json([]);
  }

  if (req.method === 'POST') {
    try {
      const paperData = req.body;
      if (!paperData || !paperData.id) {
        return res.status(400).json({ error: 'Missing paper data' });
      }

      let papers = [];
      try {
        const cloudRes = await fetch(CLOUD_PAPERS_URL, { headers: { Accept: 'application/json' } });
        if (cloudRes.ok) {
          const json = await cloudRes.json();
          if (json && json.data && Array.isArray(json.data.papers)) {
            papers = json.data.papers;
          }
        }
      } catch (e) {}

      const idx = papers.findIndex((p) => p.id === paperData.id);
      if (idx >= 0) {
        papers[idx] = { ...papers[idx], ...paperData };
      } else {
        papers.unshift(paperData);
      }

      if (papers.length > 100) {
        papers = papers.slice(0, 100);
      }

      await fetch(CLOUD_PAPERS_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'krmu_vault_shared_papers',
          data: { papers },
        }),
      });

      return res.status(201).json({ success: true, paper: paperData });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'DELETE') {
    const adminKey = req.headers['x-admin-key'] || req.query?.adminKey;
    if (adminKey !== 'SECTIONc') {
      return res.status(403).json({ error: 'Master Admin Key required to delete question paper.' });
    }

    const urlObj = new URL(req.url, 'http://localhost');
    const pathname = urlObj.pathname;
    const targetId = req.query?.id || (pathname.includes('/papers/') ? pathname.split('/papers/')[1].split('/')[0] : '');

    try {
      let papers = [];
      const cloudRes = await fetch(CLOUD_PAPERS_URL, { headers: { Accept: 'application/json' } });
      if (cloudRes.ok) {
        const json = await cloudRes.json();
        if (json && json.data && Array.isArray(json.data.papers)) {
          papers = json.data.papers;
        }
      }
      const filtered = papers.filter((p) => p.id !== targetId);
      await fetch(CLOUD_PAPERS_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'krmu_vault_shared_papers',
          data: { papers: filtered },
        }),
      });
      return res.status(200).json({ success: true, deletedId: targetId });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
