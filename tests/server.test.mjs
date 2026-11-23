import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { safeFile, isAllowedOrigin, createDemoServer } from '../lib/server.mjs';

const site = path.resolve('/tmp/diff-lab-fixtures');
test('static file resolution remains below root', () => {
  assert.equal(safeFile(site, '/index.html'), path.join(site, 'index.html'));
  assert.equal(safeFile(site, '/../../../etc/passwd'), path.join(site, 'etc', 'passwd'));
  assert.equal(safeFile(site, '/%5c..%5csecret'), null);
});

test('only loopback viewer origins may control the browser', () => {
  for (const origin of ['http://localhost:8100', 'http://127.0.0.1:8100', 'http://[::1]:8100']) {
    assert.equal(isAllowedOrigin(origin, 8100), true, origin);
  }
  for (const origin of [undefined, null, 'http://evil.example:8100', 'http://localhost:9999', 'https://localhost:8100', 'null']) {
    assert.equal(isAllowedOrigin(origin, 8100), false, String(origin));
  }
});

test('demo fixtures identify themselves so capture can label them', async () => {
  const server = createDemoServer('after');
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  try {
    const { port } = server.address();
    const response = await fetch(`http://127.0.0.1:${port}/`);
    assert.equal(response.headers.get('x-diff-lab-demo'), '1');
    assert.match(await response.text(), /SIMULATED AFTER FIXTURE/);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});
