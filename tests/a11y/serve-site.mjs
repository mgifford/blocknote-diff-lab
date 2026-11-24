import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const site = path.join(root, '_site');
const port = Number(process.env.A11Y_PORT || 8130);
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.patch': 'text/plain; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

execFileSync(process.execPath, [path.join(root, 'scripts', 'build-pages.mjs')], { stdio: 'inherit' });
fs.mkdirSync(path.join(root, 'reports', 'a11y'), { recursive: true });

const server = http.createServer((request, response) => {
  const url = new URL(request.url, 'http://localhost');
  let file = path.join(site, decodeURIComponent(url.pathname));
  if (url.pathname.endsWith('/')) file = path.join(file, 'index.html');
  if (!file.startsWith(site)) { response.writeHead(403).end(); return; }
  fs.readFile(file, (error, data) => {
    if (error) { response.writeHead(404).end('not found'); return; }
    response.writeHead(200, {
      'content-type': mime[path.extname(file)] || 'application/octet-stream',
      'cache-control': 'no-store',
    });
    response.end(data);
  });
});
server.listen(port, '127.0.0.1', () => console.log(`a11y test site on http://127.0.0.1:${port}`));
