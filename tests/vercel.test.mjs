import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import handler from '../api/chat.js';

test('Vercel adapter accepts Web Requests and returns chat JSON without exposing secrets', async () => {
  const oldFetch = globalThis.fetch;
  const oldKey = process.env.GROQ_API_KEY;
  const oldVercel = process.env.VERCEL;
  process.env.GROQ_API_KEY = 'adapter-test-secret';
  process.env.VERCEL = '1';
  globalThis.fetch = async (_url, options) => {
    assert.equal(options.headers.Authorization, 'Bearer adapter-test-secret');
    assert.equal(JSON.parse(options.body).messages.at(-1).content, 'Quiero una cotización.');
    return Response.json({ choices: [{ message: { content: 'El equipo puede ayudarte. [[WHATSAPP]]' } }] });
  };
  try {
    const request = new Request('https://kde.example/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: 'https://kde.example', 'X-Forwarded-For': '192.0.2.10' },
      body: JSON.stringify({ messages: [{ role: 'user', content: 'Quiero una cotización.' }] }),
    });
    const response = await handler.fetch(request);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.deepEqual(await response.json(), { reply: 'El equipo puede ayudarte.', whatsapp: true });
    assert.equal((await handler.fetch(new Request('https://kde.example/api/chat'))).status, 405);
  } finally {
    globalThis.fetch = oldFetch;
    if (oldKey === undefined) delete process.env.GROQ_API_KEY; else process.env.GROQ_API_KEY = oldKey;
    if (oldVercel === undefined) delete process.env.VERCEL; else process.env.VERCEL = oldVercel;
  }
});

test('Vercel build exposes only frontend files and preserves API routing', () => {
  const root = path.resolve(import.meta.dirname, '..');
  execFileSync(process.execPath, ['scripts/build-vercel.mjs'], { cwd: root });
  const config = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
  assert.equal(config.framework, null);
  assert.equal(config.outputDirectory, 'vercel-public');
  assert.equal(config.functions['api/chat.js'].maxDuration, 30);
  assert.equal(config.rewrites, undefined);
  const files = fs.readdirSync(path.join(root, config.outputDirectory), { recursive: true });
  assert.ok(files.includes('index.html'));
  assert.ok(files.includes('chat.js'));
  for (const name of ['logo', 'port', 'dga', 'telcor', 'ipsa', 'minsa']) {
    assert.ok(fs.existsSync(path.join(root, config.outputDirectory, 'assets', name + '.jpg')));
  }
  assert.ok(!files.some(file => /(?:\.env|\.openai|server|worker)/.test(file)));
  assert.match(fs.readFileSync(path.join(root, config.outputDirectory, 'chat.js'), 'utf8'), /fetch\('\/api\/chat'/);
});
