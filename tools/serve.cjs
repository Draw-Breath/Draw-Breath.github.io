// Dependency-free local preview. Binds only to this machine.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.pdf': 'application/pdf' };
const port = Number(process.env.PORT || 4173);
const server = http.createServer((req, res) => {
  let file;
  try {
    const relative = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    file = path.resolve(root, '.' + (relative === '/' ? '/index.html' : relative));
    const within = path.relative(root, file);
    if (within.startsWith('..') || path.isAbsolute(within)) { res.writeHead(403); return res.end('Forbidden'); }
  } catch { res.writeHead(400); return res.end('Bad request'); }
  fs.stat(file, (error, stats) => {
    if (error || !stats.isFile()) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Content-Length': stats.size, 'Cache-Control': 'no-cache' });
    if (req.method === 'HEAD') return res.end();
    const stream = fs.createReadStream(file);
    stream.on('error', () => res.destroy());
    stream.pipe(res);
  });
});
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
server.listen(port, '127.0.0.1', () => console.log(`DrawBreath preview: http://127.0.0.1:${port}`));
