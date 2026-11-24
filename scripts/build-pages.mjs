import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, '_site');
const assets = path.join(out, 'assets');
const evidence = path.join(root, 'issues', '2854', 'evidence');

let buildSha = process.env.GITHUB_SHA || '';
if (!buildSha) {
  try { buildSha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(); }
  catch { buildSha = 'unknown'; }
}
if (!/^[0-9a-f]{7,40}$/i.test(buildSha)) buildSha = 'unknown';

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(assets, { recursive: true });
fs.copyFileSync(path.join(root, 'pages', 'style.css'), path.join(out, 'style.css'));
for (const side of ['before', 'after', 'after-inert', 'after-activation']) {
  fs.cpSync(path.join(root, 'pages', side), path.join(out, side), { recursive: true });
}
fs.copyFileSync(path.join(root, 'pages', 'LICENSE-BlockNote.txt'), path.join(out, 'LICENSE-BlockNote.txt'));

const files = [
  ['before/forced-light-menu.png', 'before-forced-light-menu.png'],
  ['after/forced-light-after-tab.png', 'after-forced-light-after-tab.png'],
  ['after/forced-dark-after-tab.png', 'after-forced-dark-after-tab.png'],
  ['before/focus.json', 'before-focus.json'],
  ['after/focus.json', 'after-focus.json'],
  ['before/modes.json', 'before-modes.json'],
  ['after/modes.json', 'after-modes.json'],
  ['before/activation.json', 'before-activation.json'],
  ['after/activation.json', 'after-activation.json'],
  ['before/keyboard-route.json', 'before-keyboard-route.json'],
  ['after/keyboard-route.json', 'after-keyboard-route.json'],
  ['before/reflow-320.json', 'before-reflow-320.json'],
  ['after/reflow-320.json', 'after-reflow-320.json'],
  ['viewer-fixture.png', 'viewer-fixture.png'],
  ['viewer-fixture.json', 'viewer-fixture.json'],
];
for (const [from, to] of files) {
  const source = path.join(evidence, from);
  if (!fs.existsSync(source)) throw new Error(`Missing evidence file: ${source}`);
  fs.copyFileSync(source, path.join(assets, to));
}
for (const [from, to] of [
  ['issues/2854/patch/2854.patch', '2854.patch'],
  ['issues/2854/patch/inert.patch', 'inert.patch'],
  ['issues/2854/patch/activation.patch', 'activation.patch'],
  ['issues/2854/fixture.patch', 'fixture.patch'],
]) {
  const source = path.join(root, from);
  if (!fs.existsSync(source)) throw new Error(`Missing file: ${source}`);
  fs.copyFileSync(source, path.join(assets, to));
}

const escapeHtml = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const patches = {
  BOTH: fs.readFileSync(path.join(root, 'issues', '2854', 'patch', '2854.patch'), 'utf8'),
  INERT: fs.readFileSync(path.join(root, 'issues', '2854', 'patch', 'inert.patch'), 'utf8'),
  ACTIVATION: fs.readFileSync(path.join(root, 'issues', '2854', 'patch', 'activation.patch'), 'utf8'),
};
let template = fs.readFileSync(path.join(root, 'pages', 'index.template.html'), 'utf8');
for (const [name, patch] of Object.entries(patches)) {
  const placeholder = `{{PATCH_${name}}}`;
  if (!template.includes(placeholder)) throw new Error(`Template is missing ${placeholder}`);
  template = template.replace(placeholder, escapeHtml(patch));
}
const issuesJson = fs.readFileSync(path.join(root, 'pages', 'issues.json'), 'utf8');
JSON.parse(issuesJson);
const safeIssuesJson = JSON.stringify(JSON.parse(issuesJson)).replace(/</g, '\\u003c');
if (!template.includes('{{ISSUES}}')) throw new Error('Template is missing the {{ISSUES}} placeholder');
template = template.replace('{{ISSUES}}', safeIssuesJson);
if (!template.includes('{{BUILD_SHA}}')) throw new Error('Template is missing the {{BUILD_SHA}} placeholder');
template = template.replaceAll('{{BUILD_SHA}}', buildSha);
fs.writeFileSync(path.join(out, 'index.html'), template);
fs.copyFileSync(path.join(root, 'pages', 'issues.json'), path.join(out, 'issues.json'));
fs.writeFileSync(path.join(out, '.nojekyll'), '');
console.log(`Built ${out} from ${buildSha} with ${files.length} evidence files and the patch.`);
