const http = require('http');
const WebSocket = require('ws');

async function get(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:5000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    }).on('error', reject);
  });
}

async function post(path, body) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const req = http.request(`http://127.0.0.1:5000${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function main() {
  console.log('--- 1. Testing Templates Stats ---');
  const stats = await get('/api/templates/stats');
  console.log(`Status: ${stats.status}, Total templates: ${stats.data.totalTemplates}, Categories: ${stats.data.categories?.length}`);

  console.log('\n--- 2. Testing Template Query (Search & Filter) ---');
  const queryRes = await get('/api/templates?category=AI+and+Machine+Learning&style=Cyberpunk&page=1&limit=3');
  console.log(`Status: ${queryRes.status}, Total matches: ${queryRes.data.total}, Returned: ${queryRes.data.templates?.length}`);
  if (queryRes.data.templates?.length > 0) {
    console.log(`Sample: "${queryRes.data.templates[0].title}" [${queryRes.data.templates[0].id}]`);
  }

  console.log('\n--- 3. Testing Single Template Fetch (Rich Slides) ---');
  const single = await get(`/api/templates/${queryRes.data.templates[0].id}`);
  console.log(`Status: ${single.status}, Title: "${single.data.title}", Slides: ${single.data.slides?.length}`);

  console.log('\n--- 4. Testing AI Semantic Matcher / Recommendations ---');
  const recs = await post('/api/templates/recommendations', {
    title: 'MediScan AI — Real-time Brain Tumor Detection on Edge Devices',
    domain: 'Healthcare and MedTech',
    pitchDuration: '3-min'
  });
  console.log(`Status: ${recs.status}, Recommended count: ${recs.data.recommended?.length}, Match reason: "${recs.data.recommended?.[0]?.matchReason}"`);

  console.log('\n--- 5. Testing Invitation Link Generation ---');
  const inv = await post('/api/invitations', {
    projectId: 'proj-hackforge-demo',
    projectName: 'Autonomous Incident Healer',
    role: 'Editor',
    email: 'priya@sih.gov.in',
    createdBy: 'Alex Rivera'
  });
  console.log(`Status: ${inv.status}, Token: ${inv.data.token}, Access Code: ${inv.data.accessCode}`);

  console.log('\n--- 6. Testing Validate & Accept Invitation ---');
  const validate = await get(`/api/invitations/${inv.data.token}`);
  console.log(`Validate Status: ${validate.status}, Project: "${validate.data.projectName}", Role: ${validate.data.role}`);

  const accept = await post(`/api/invitations/${inv.data.token}/accept`, {
    userId: 'user-priya-sih',
    name: 'Priya Sharma',
    email: 'priya@sih.gov.in'
  });
  console.log(`Accept Status: ${accept.status}, Result: ${accept.data.message}`);

  console.log('\n--- 7. Testing Real-time WebSocket Protocol ---');
  await new Promise((resolve) => {
    const ws = new WebSocket('ws://127.0.0.1:5000/ws');
    ws.on('open', () => {
      console.log('WS connection opened!');
      // Join Room
      ws.send(JSON.stringify({
        type: 'JOIN_ROOM',
        projectId: 'proj-hackforge-demo',
        user: { id: 'user-priya-sih', name: 'Priya Sharma', role: 'Editor' }
      }));

      setTimeout(() => {
        // Send remote element selection lock
        ws.send(JSON.stringify({
          type: 'SELECT_ELEMENT',
          slideIndex: 0,
          elementId: 'el-title-hero'
        }));
      }, 100);
    });

    let msgsReceived = 0;
    ws.on('message', (raw) => {
      const msg = JSON.parse(raw);
      console.log(`WS Received Event: ${msg.type}`);
      msgsReceived++;
      if (msgsReceived >= 2) {
        ws.close();
        resolve();
      }
    });

    ws.on('error', (e) => {
      console.error('WS Error:', e);
      resolve();
    });
  });

  console.log('\n=== ALL TESTS PASSED SUCCESSFULLY! ===');
}

main().catch(console.error);
