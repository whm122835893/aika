/**
 * Minimal static server for the offline replica.
 * Usage: node tools/serve.js [port]
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = 'C:/Users/12283/WorkBuddy/2026-10-06-22-09-15/output/h5.shenyuan.sc.cn';
const PORT = parseInt(process.argv[2] || '8899', 10);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webp': 'image/webp',
};

http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const abs = path.resolve(ROOT, '.' + p);
  const rootAbs = path.resolve(ROOT);
  if (!abs.toLowerCase().startsWith(rootAbs.toLowerCase())) { res.writeHead(403); return res.end(); }
  try {
    if (fs.existsSync(abs) && fs.statSync(abs).isDirectory()) {
      const idx = path.join(abs, 'index.html');
      if (fs.existsSync(idx)) { abs = idx; p = p.replace(/\/$/, '') + '/index.html'; }
    }
  } catch (e) {}
  fs.readFile(abs, (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found: ' + p); }
    res.writeHead(200, { 'content-type': MIME[path.extname(abs).toLowerCase()] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(PORT, () => console.log('Replica serving at http://localhost:' + PORT));
