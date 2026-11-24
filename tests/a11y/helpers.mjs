import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const axeSource = fs.readFileSync(path.join(root, 'node_modules', 'axe-core', 'axe.min.js'), 'utf8');
export const virtualSource = fs.readFileSync(
  fileURLToPath(import.meta.resolve('@guidepup/virtual-screen-reader/browser.js')),
  'utf8',
);
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'pages', 'issues.json'), 'utf8'));
export const issues = catalog.issues;

export function issue(number) {
  const found = issues.find((candidate) => candidate.number === number);
  if (!found) throw new Error(`Unknown issue #${number}`);
  return found;
}

export function previewUrl(number, role) {
  const found = issue(number);
  const url = role === 'before' ? found.fix.beforeUrl : found.fix.previewUrl;
  if (!url) throw new Error(`#${number} has no ${role} URL`);
  return url;
}

export async function scan(page, { tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'], rules, include } = {}) {
  await page.addScriptTag({ content: axeSource });
  return page.evaluate(async ({ tags: runTags, rules: runRules, include: runInclude }) => {
    const options = { runOnly: { type: 'tag', values: runTags } };
    if (runRules) {
      options.runOnly = { type: 'rule', values: runRules };
      options.rules = Object.fromEntries(runRules.map((id) => [id, { enabled: true }]));
    }
    const context = runInclude ? { include: runInclude.map((selector) => [selector]) } : document;
    const result = await window.axe.run(context, options);
    return {
      violations: result.violations.map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        description: violation.description,
        helpUrl: violation.helpUrl,
        count: violation.nodes.length,
        targets: violation.nodes.slice(0, 5).map((node) => node.target),
      })),
      incomplete: result.incomplete.length,
      passes: result.passes.length,
      inapplicable: result.inapplicable.length,
    };
  }, { tags, rules, include });
}

export async function spokenPhrases(page, selector = '.bn-editor') {
  return page.evaluate(async ({ source, containerSelector }) => {
    const moduleUrl = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
    const { virtual } = await import(moduleUrl);
    const container = document.querySelector(containerSelector) || document.body;
    await virtual.start({ container });
    try {
      for (let step = 0; step < 500; step++) {
        await virtual.next();
        if ((await virtual.lastSpokenPhrase()) === 'end of document') break;
      }
      return await virtual.spokenPhraseLog();
    } finally {
      await virtual.stop();
    }
  }, { source: virtualSource, containerSelector: selector });
}

const runStamp = new Date().toISOString().replace(/[:.]/g, '-');
const evidenceDir = path.join(root, 'reports', 'a11y', runStamp);

export function evidencePath(name) {
  fs.mkdirSync(evidenceDir, { recursive: true });
  return path.join(evidenceDir, name);
}

export function saveEvidence(name, data) {
  const file = evidencePath(name);
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
  return file;
}
