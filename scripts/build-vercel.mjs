import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = path.resolve(import.meta.dirname, '..');
const output = path.resolve(root, 'vercel-public');
// Only replace this build's dedicated output directory, inside this checkout.
assert.equal(path.dirname(output), root);
assert.equal(path.basename(output), 'vercel-public');
assert.ok(!fs.lstatSync(output, { throwIfNoEntry: false })?.isSymbolicLink());
fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });

// Explicit public files: never copy the Worker, hosting metadata or env files.
const files = [
  'index.html', 'styles.css', 'app.js', 'chat.js', 'chat.css',
  'assets/logo.jpg', 'assets/port.jpg', 'assets/dga.jpg',
  'assets/telcor.jpg', 'assets/ipsa.jpg', 'assets/minsa.jpg',
];
for (const file of files) {
  const destination = path.join(output, file);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(path.join(root, 'dist', file), destination);
}
console.log(`Vercel: ${files.length} archivos públicos preparados en vercel-public/.`);
