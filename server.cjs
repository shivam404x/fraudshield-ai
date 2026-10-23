/**
 * FraudShield AI — Production Web & Gateway Server
 * Serves the React frontend (dist/) and reverse-proxies /api requests
 * to the Python FastAPI ML backend running on port 8000.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = process.env.PORT || 5000;
const BACKEND_PORT = process.env.BACKEND_PORT || 8000;
const DIST_DIR = path.resolve(__dirname, 'dist');

// MIME types
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

// Check if Python backend should be spawned
let pythonProcess = null;
if (process.env.AUTO_START_PYTHON !== 'false') {
  console.log('[Gateway] Starting Python FastAPI backend...');
  pythonProcess = spawn('python', ['backend/run_server.py'], {
    stdio: 'inherit',
    shell: true,
  });

  pythonProcess.on('error', (err) => {
    console.error('[Gateway] Python spawn error:', err.message);
  });
}

function proxyRequest(req, res) {
  const options = {
    hostname: '127.0.0.1',
    port: BACKEND_PORT,
    path: req.url,
    method: req.method,
    headers: req.headers,
  };

  const proxy = http.request(options, (targetRes) => {
    res.writeHead(targetRes.statusCode, targetRes.headers);
    targetRes.pipe(res);
  });

  proxy.on('error', (err) => {
    console.error('[Gateway] Proxy error:', err.message);
    res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      error: 'Bad Gateway', 
      message: 'Python FastAPI server is starting or not reachable on port ' + BACKEND_PORT,
      detail: err.message
    }));
  });

  req.pipe(proxy);
}

function serveStatic(req, res) {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';

  let filePath = path.join(DIST_DIR, reqPath);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      return;
    }
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
    });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/api') || req.url.startsWith('/docs') || req.url.startsWith('/openapi.json')) {
    proxyRequest(req, res);
  } else {
    serveStatic(req, res);
  }
});

server.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`  FraudShield AI Production Server Running!       `);
  console.log(`  Web URL:      http://127.0.0.1:${PORT}          `);
  console.log(`  FastAPI Docs: http://127.0.0.1:${PORT}/docs     `);
  console.log(`==================================================`);
});

process.on('SIGINT', () => {
  if (pythonProcess) pythonProcess.kill();
  process.exit();
});
process.on('SIGTERM', () => {
  if (pythonProcess) pythonProcess.kill();
  process.exit();
});
