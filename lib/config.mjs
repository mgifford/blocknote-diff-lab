import fs from 'node:fs';
import path from 'node:path';

export function readConfig(root) {
  const config = JSON.parse(fs.readFileSync(path.join(root, 'compare.config.json'), 'utf8'));
  return validateConfig(config);
}

export function validateConfig(config) {
  if (!config || typeof config !== 'object') throw new Error('Config must be an object');
  const { source, comparison, ports } = config;
  if (!source || typeof source.url !== 'string' || !/^https:\/\//.test(source.url)) throw new Error('source.url must be HTTPS');
  if (!source.branch || !/^[a-zA-Z0-9_./-]+$/.test(source.branch) || source.branch.startsWith('-') || source.branch.includes('..')) throw new Error('Invalid source.branch');
  if (!comparison?.id || !/^[a-z0-9][a-z0-9-]*$/.test(comparison.id)) throw new Error('comparison.id must be a slug');
  if (!comparison.title || typeof comparison.title !== 'string') throw new Error('comparison.title is required');
  if (!comparison.path || !comparison.path.startsWith('/') || comparison.path.startsWith('//')) throw new Error('comparison.path must be an absolute site path');
  const normalized = new URL(comparison.path, 'http://example.invalid');
  if (normalized.origin !== 'http://example.invalid') throw new Error('comparison.path must remain on the comparison site');
  if (!Array.isArray(comparison.steps) || !comparison.steps.length) throw new Error('At least one reproduction step required');
  const ids = new Set();
  for (const step of comparison.steps) {
    if (!/^[a-z0-9-]+$/.test(step.id || '') || ids.has(step.id)) throw new Error('Reproduction step ids must be unique slugs');
    ids.add(step.id);
    for (const key of ['instruction', 'expectedBefore', 'expectedAfter']) if (typeof step[key] !== 'string' || !step[key].trim()) throw new Error(`Step ${step.id} missing ${key}`);
  }
  if (comparison.patchFile !== null && comparison.patchFile !== undefined && typeof comparison.patchFile !== 'string') throw new Error('comparison.patchFile must be a file path or null');
  if (!ports || new Set(Object.values(ports)).size !== 3) throw new Error('All three ports must differ');
  for (const key of ['viewer', 'before', 'after']) if (!Number.isInteger(ports[key]) || ports[key] < 1024 || ports[key] > 65535) throw new Error(`Invalid ${key} port`);
  return config;
}

export function projectPaths(root) {
  const lab = path.join(root, '.lab');
  return {
    lab,
    source: path.join(lab, 'source'),
    before: path.join(lab, 'worktrees', 'before'),
    after: path.join(lab, 'worktrees', 'after'),
    state: path.join(lab, 'state.json'),
    profile: path.join(lab, 'chromium-profile'),
  };
}

export function readState(root) {
  const file = projectPaths(root).state;
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : null;
}
