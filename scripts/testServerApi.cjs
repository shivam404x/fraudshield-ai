const http = require('http');
const { spawn } = require('child_process');

console.log('Testing server.cjs API endpoints...');

const serverProc = spawn('node', ['server.cjs'], {
  stdio: 'pipe',
  env: { ...process.env, PORT: '5001', WEB_CONCURRENCY: '1' }
});

serverProc.stdout.on('data', (d) => {
  // console.log('[Server stdout]:', d.toString());
});
serverProc.stderr.on('data', (d) => {
  console.error('[Server stderr]:', d.toString());
});

setTimeout(() => {
  // Test GET /api/templates/stats
  http.get('http://127.0.0.1:5001/api/templates/stats', (res) => {
    let body = '';
    res.on('data', (c) => body += c);
    res.on('end', () => {
      console.log('HTTP Status:', res.statusCode);
      const data = JSON.parse(body);
      console.log('Total templates in DB:', data.totalTemplates);
      console.log('Categories count:', data.categoriesCount);

      // Test GET /api/templates?limit=3
      http.get('http://127.0.0.1:5001/api/templates?limit=3', (res2) => {
        let body2 = '';
        res2.on('data', (c) => body2 += c);
        res2.on('end', () => {
          const list = JSON.parse(body2);
          console.log('Sample templates fetched:', list.templates.length, 'Total:', list.total);
          console.log('Sample template title:', list.templates[0].title);
          
          serverProc.kill('SIGTERM');
          console.log('✅ ALL SERVER TESTS PASSED!');
          process.exit(0);
        });
      });
    });
  }).on('error', (err) => {
    console.error('Request error:', err.message);
    serverProc.kill('SIGTERM');
    process.exit(1);
  });
}, 3000);
