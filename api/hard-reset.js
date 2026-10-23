// Vercel Serverless Function: /api/hard-reset
// Handles GET and POST for Master Admin Vault Hard Reset

const DEDICATED_BACKEND = process.env.CLOUD_SERVER_URL || process.env.BACKEND_URL || 'https://krmu-vault.onrender.com';
const CLOUD_PAPERS_URL = 'https://api.restful-api.dev/objects/ff808181a09d98f701a14f1bbb610c21';

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, x-admin-key');
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'manual_only',
      autoResetEnabled: false,
      mode: 'master_admin_on_demand',
    });
  }

  if (req.method === 'POST') {
    const adminKey = req.headers['x-admin-key'] || req.query?.adminKey;
    const isAuthorized = adminKey === 'SECTIONc';

    // 1. Forward to Dedicated Backend if accessible
    if (DEDICATED_BACKEND) {
      try {
        const cleanBase = DEDICATED_BACKEND.replace(/\/+$/, '');
        const proxyRes = await fetch(`${cleanBase}/api/hard-reset`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(adminKey ? { 'x-admin-key': adminKey } : {}),
          },
        });
        if (proxyRes.ok) {
          const data = await proxyRes.json();
          // Also purge cloud relay papers
          try {
            await fetch(CLOUD_PAPERS_URL, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: 'krmu_vault_shared_papers',
                data: { papers: [] },
              }),
            });
          } catch (e) {}
          return res.status(200).json(data);
        }
      } catch (proxyErr) {
        console.warn('[Hard Reset Proxy Warning]:', proxyErr.message);
      }
    }

    if (!isAuthorized) {
      return res.status(401).json({ error: 'Master Admin passkey required for manual vault reset.' });
    }

    // 2. Wipe cloud papers relay
    try {
      await fetch(CLOUD_PAPERS_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'krmu_vault_shared_papers',
          data: { papers: [] },
        }),
      });
    } catch (e) {}

    // Note: CLOUD_GROUPS_URL is strictly preserved and untouched!

    return res.status(200).json({
      success: true,
      message: 'Manual Hard Reset executed successfully: All questions purged; Secret Squads preserved intact.',
      resetAt: new Date().toISOString(),
    });
  }

  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
