import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { ControlledBrowser } from './browser.mjs';
import { readState } from './config.mjs';
import { renderDemoFixture } from './demo-fixture.mjs';

function contentType(file) {
  return ({ '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml' })[path.extname(file)] || 'application/octet-stream';
}

// The viewer may be opened through any loopback spelling. Browsers send the
// Origin header for POSTs, so accept the loopback hosts we document without
// opening the browser-control API to other origins.
export function viewerOrigins(port) {
  return new Set([
    `http://localhost:${port}`,
    `http://127.0.0.1:${port}`,
    `http://[::1]:${port}`,
  ]);
}

export function isAllowedOrigin(origin, port) {
  return typeof origin === 'string' && viewerOrigins(port).has(origin);
}

export function safeFile(root, reqPath) {
  let pathname;
  try { pathname = decodeURIComponent(new URL(reqPath, 'http://localhost').pathname); }
  catch { return null; }
  if (pathname.includes('\0') || pathname.split('/').includes('..') || pathname.includes('\\')) return null;
  const base = path.resolve(root);
  let candidate = path.resolve(base, '.' + pathname);
  if (candidate !== base && !candidate.startsWith(base + path.sep)) return null;
  if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) candidate = path.join(candidate, 'index.html');
  return candidate;
}

function serveFile(res, root, reqPath) {
  const file = safeFile(root, reqPath);
  if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('not found');
    return;
  }
  res.writeHead(200, { 'Content-Type': contentType(file), 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  fs.createReadStream(file).pipe(res);
}

async function readRequest(req) {
  const chunks = [];
  let length = 0;
  for await (const chunk of req) {
    length += chunk.length;
    if (length > 8192) throw new Error('Request too large');
    chunks.push(chunk);
  }
  return chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {};
}

export async function isServing(port) {
  return new Promise(resolve => {
    const request = http.get({ host: '127.0.0.1', port, path: '/', timeout: 1000 }, res => {
      res.resume();
      resolve(res.statusCode < 500);
    });
    request.on('timeout', () => { request.destroy(); resolve(false); });
    request.on('error', () => resolve(false));
  });
}

export function createLabServer(root, config, options = {}) {
  const browser = new ControlledBrowser(root, config);
  const rootSite = path.join(root, 'site');
  const rootReports = path.join(root, 'reports');
  const expectedOrigin = `http://localhost:${config.ports.viewer}`;
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, expectedOrigin);
    const json = (status, data) => {
      res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(JSON.stringify(data));
    };
    if (req.method === 'GET' && url.pathname === '/api/status') {
      json(200, { mode: options.demo ? 'DEMO FIXTURES ONLY, NOT BLOCKNOTE' : 'LIVE BLOCKNOTE GIT WORKTREES',
        config, state: readState(root),
        serving: { before: await isServing(config.ports.before), after: await isServing(config.ports.after) } });
      return;
    }
    if (req.method === 'GET' && url.pathname === '/api/browser/status') {
      json(200, await browser.status()); return;
    }
    if (req.method === 'GET' && url.pathname === '/api/report/latest') {
      const f = path.join(rootReports, 'latest.json');
      if (!fs.existsSync(f)) { json(200, { available: false }); return; }
      json(200, JSON.parse(fs.readFileSync(f, 'utf8'))); return;
    }
    if (url.pathname.startsWith('/api/browser/') && req.method === 'POST') {
      // Only accept same-origin browser requests; do not allow arbitrary pages to control a local Chromium instance.
      if (!isAllowedOrigin(req.headers.origin, config.ports.viewer)) { json(403, { error: `Same-origin request required. Open the viewer at http://localhost:${config.ports.viewer}/ or http://127.0.0.1:${config.ports.viewer}/.` }); return; }
      try {
        const body = await readRequest(req);
        const result = url.pathname === '/api/browser/open' ? await browser.start()
          : url.pathname === '/api/browser/mode' ? await browser.setMode(body.mode)
          : url.pathname === '/api/browser/close' ? await browser.stop()
          : null;
        if (result === null) { json(404, { error: 'Unknown endpoint' }); return; }
        json(200, { ok: true, result });
      } catch (e) { json(400, { ok: false, error: e.message }); }
      return;
    }
    if (req.method !== 'GET') { json(405, { error: 'Method not allowed' }); return; }
    if (url.pathname.startsWith('/reports/')) {
      serveFile(res, rootReports, url.pathname.slice('/reports'.length)); return;
    }
    serveFile(res, rootSite, url.pathname);
  });
  server.on('close', () => browser.stop());
  return server;
}

export function createDemoServer(side) {
  const html = renderDemoFixture(side);
  return http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Diff-Lab-Demo': '1' });
    res.end(html);
  });
}
