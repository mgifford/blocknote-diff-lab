const $ = id => document.getElementById(id);
let config = null;
let state = null;
const observations = {};
const VIEWPORT_HEIGHT = 740;

function element(tag, text, cls) {
  const e = document.createElement(tag);
  if (text !== undefined) e.textContent = text;
  if (cls) e.className = cls;
  return e;
}

function itemKey() { return `diff-lab:${config.comparison.id}:${state?.sha || 'demo'}`; }

function fitFrames() {
  const width = Number($('viewport').value);
  for (const side of ['before', 'after']) {
    const stage = $(`${side}-stage`);
    const iframe = $(side);
    const availableWidth = stage.clientWidth;
    const scale = Math.min(1, availableWidth / width);
    iframe.style.width = `${width}px`;
    iframe.style.height = `${VIEWPORT_HEIGHT}px`;
    iframe.style.transform = `scale(${scale})`;
    stage.style.height = `${Math.ceil(VIEWPORT_HEIGHT * scale)}px`;
  }
}

function saveDraft() {
  const data = { ...observations, notes: $('notes').value };
  try { localStorage.setItem(itemKey(), JSON.stringify(data)); } catch { /* storage may be disabled */ }
}

function renderSteps() {
  let stored = {};
  try { stored = JSON.parse(localStorage.getItem(itemKey()) || '{}'); } catch { /* ignore stale data */ }
  const wrapper = $('steps');
  wrapper.replaceChildren();
  config.comparison.steps.forEach((step, i) => {
    const row = element('section', undefined, 'step');
    const top = element('div', undefined, 'step-header');
    top.append(element('h3', `${i + 1}. ${step.instruction}`));
    const checkLabel = element('label');
    const checked = document.createElement('input');
    checked.type = 'checkbox';
    checked.checked = !!stored[step.id]?.completed;
    checkLabel.append(checked, document.createTextNode(' Reviewed both'));
    top.append(checkLabel);
    const verdictLabel = element('label', ' Overall result: ');
    const verdict = element('select');
    for (const [value, text] of [['unassessed', 'Not assessed'], ['improved', 'Improved'], ['unchanged', 'Unchanged'], ['regressed', 'Regressed'], ['inconclusive', 'Inconclusive']]) {
      const option = element('option', text);
      option.value = value;
      verdict.append(option);
    }
    verdict.value = stored[step.id]?.verdict || 'unassessed';
    verdict.addEventListener('change', () => {
      observations[step.id] = { ...(observations[step.id] || {}), verdict: verdict.value };
      saveDraft();
    });
    verdictLabel.append(verdict);
    top.append(verdictLabel);
    row.append(top);
    const ex = element('div', undefined, 'expect');
    for (const [side, field] of [['Before', 'expectedBefore'], ['After', 'expectedAfter']]) {
      const col = element('div');
      col.append(element('strong', `${side}: what to check`), element('p', step[field]));
      const label = element('label', `${side} observation`);
      const input = element('textarea');
      input.rows = 2;
      input.placeholder = `What happened in ${side.toLowerCase()}?`;
      const key = side.toLowerCase();
      input.value = stored[step.id]?.[key] || '';
      const change = () => {
        observations[step.id] = { ...(observations[step.id] || {}), [key]: input.value, completed: checked.checked };
        saveDraft();
      };
      input.addEventListener('input', change);
      label.append(input);
      col.append(label);
      ex.append(col);
    }
    checked.addEventListener('change', () => {
      observations[step.id] = { ...(observations[step.id] || {}), completed: checked.checked };
      saveDraft();
    });
    observations[step.id] = { ...(stored[step.id] || {}) };
    row.append(ex);
    wrapper.append(row);
  });
  $('notes').value = stored.notes || '';
}

async function postApi(endpoint, body = {}) {
  const response = await fetch(endpoint, { method:'POST', headers:{ 'Content-Type':'application/json' }, body:JSON.stringify(body) });
  const result = await response.json();
  if (!response.ok || !result.ok) throw new Error(result.error || `Request failed: ${response.status}`);
  return result.result;
}

// The demo fixtures are cross-origin frames. Send a message to each frame's
// origin; the fixture checks that the sender is its parent before acting.
function postToPreviews(message) {
  let sent = 0;
  for (const side of ['before', 'after']) {
    const frame = $(side);
    if (!frame?.contentWindow) continue;
    try {
      frame.contentWindow.postMessage(message, new URL(frame.src).origin);
      sent++;
    } catch { /* frame not ready yet */ }
  }
  return sent;
}

function describeObservation(observation) {
  return `forced colours ${observation.forcedColors ? 'on' : 'off'}, OS-dark ${observation.dark ? 'on' : 'off'}, reduced motion ${observation.reducedMotion ? 'on' : 'off'}`;
}

async function updateBrowserStatus() {
  const status = await (await fetch('/api/browser/status', { cache:'no-store' })).json();
  if (!status.open) { $('browser-status').textContent = 'Controlled Chromium not started. You can still use both editors normally.'; return; }
  const observed = status.observed;
  $('browser-status').textContent = `Controlled Chromium: ${status.mode}. ${observed ? `Before: ${describeObservation(observed.before)}. After: ${describeObservation(observed.after)}.` : status.error || 'Awaiting both frames'}`;
}

function displayReport(report) {
  const container = $('evidence-results');
  if (report?.failed) {
    container.replaceChildren(element('p', `Capture failed at ${report.timestamp}. ${report.error || 'No error detail was recorded.'} Do not cite this run as evidence.`));
    return;
  }
  if (!report?.available) { container.textContent = 'No automated report yet. Run pnpm capture after starting the two editor servers.'; return; }
  container.replaceChildren(element('p', `Capture: ${report.timestamp}. ${report.runs.length} side-by-side conditions. Results are partial evidence.`));
  const source = report.source || {};
  if (source.unprepared) {
    container.append(element('p', 'No pinned source snapshot was present for this capture.', 'meta'));
  } else if (source.sha) {
    const patch = source.patched ? `patch SHA-256 ${source.patchHash}` : 'no patch configured';
    container.append(element('p', `Source ${source.sha}; ${patch}; diff base ${source.diffBase || source.sha}.`, 'meta'));
  }
  if (source.currentDiff?.error) container.append(element('p', source.currentDiff.error, 'meta'));
  else if (source.currentDiff) container.append(element('p', `Tracked change from the pinned SHA: ${source.currentDiff.changed ? 'yes' : 'none'}.`, 'meta'));
  if (source.demoFixtures) {
    container.append(element('p', 'This capture used demo fixtures, not BlockNote. Do not cite it as editor evidence.', 'notice'));
  }
  if (report.folder) {
    const reportLink = element('a', 'Open report JSON');
    reportLink.href = `/reports/${report.folder}/report.json`;
    reportLink.target = '_blank';
    reportLink.rel = 'noopener noreferrer';
    container.append(reportLink);
  }
  const conditions = [...new Set(report.runs.map(r => r.condition))];
  for (const condition of conditions) {
    const block = element('div', undefined, 'evidence-item');
    block.append(element('h3', condition));
    const links = element('div', undefined, 'screenshots');
    for (const side of ['before', 'after']) {
      const run = report.runs.find(r => r.condition === condition && r.side === side);
      if (!run || run.error) { links.append(element('span', `${side}: ${run?.error || 'No result'}`)); continue; }
      const a = element('a', `${side} screenshot`);
      a.href = `/reports/${run.screenshot}`;
      a.target = '_blank'; a.rel = 'noopener noreferrer';
      links.append(a, element('span', `${run.axe?.violations?.length ?? 'n/a'} axe rule(s) with violations`));
    }
    block.append(links);
    container.append(block);
  }
}

async function init() {
  const response = await fetch('/api/status', { cache: 'no-store' });
  if (!response.ok) throw new Error('Could not read lab status');
  const status = await response.json();
  config = status.config;
  state = status.state;
  $('summary').textContent = `${config.comparison.title}. ${config.comparison.description}`;
  if (config.comparison.issueUrl) {
    try {
      const url = new URL(config.comparison.issueUrl);
      if (url.protocol === 'https:') { $('issue-link').href = url.href; $('issue-link').hidden = false; }
    } catch { /* optional invalid link remains hidden */ }
  }
  $('source').textContent = state ? `Source Git SHA: ${state.sha}. Patch: ${state.patched ? state.patchFile : 'none (both versions are identical unless After was manually edited)'}.` : 'No source snapshot prepared.';
  const warning = status.mode.startsWith('DEMO') ? 'DEMO MODE: Both panes contain synthetic fixtures. They are not BlockNote. Use this only to validate the viewer.'
    : !state ? 'No snapshot prepared. Run pnpm prepare and pnpm start.'
    : !state.patched ? 'NO PATCH CONFIGURED. Both worktrees start at the same Git commit. Supply a patch or edit only the After worktree to see a real difference.' : '';
  $('warning').textContent = warning;
  const isolated = new URLSearchParams(location.search).get('controlled') === '1';
  const demoMode = status.mode.startsWith('DEMO');
  $('demo-controls').hidden = !demoMode;
  if (demoMode) {
    $('collaborate').addEventListener('click', () => {
      const sent = postToPreviews({ type: 'diff-lab:collaborate' });
      $('demo-status').textContent = sent === 2
        ? 'Started a scripted two-collaborator edit in both previews. This is synthetic demo behavior, not a real session.'
        : 'Preview frames are not ready yet; reload the page and try again.';
    });
    $('reset-demo').addEventListener('click', () => {
      const sent = postToPreviews({ type: 'diff-lab:reset' });
      $('demo-status').textContent = sent === 2 ? 'Reloading both demo fixtures.' : 'Preview frames are not ready yet; reload the page and try again.';
    });
  }
  for (const side of ['before', 'after']) {
    // Ordinary browsers use direct loopback IPs (reliable without DNS). The controlled Chromium window
    // uses distinct .localhost hostnames so each iframe gets its own CDP target.
    const host = isolated ? `${side}.localhost` : '127.0.0.1';
    const url = `http://${host}:${config.ports[side]}${config.comparison.path}`;
    $(side).src = url;
    $(`${side}-link`).href = url;
  }
  renderSteps();
  fitFrames();
  new ResizeObserver(fitFrames).observe($('before-stage'));
  new ResizeObserver(fitFrames).observe($('after-stage'));
  $('viewport').addEventListener('change', fitFrames);
  $('notes').addEventListener('input', saveDraft);
  $('download').addEventListener('click', () => {
    const payload = { exportedAt: new Date().toISOString(), comparison: config.comparison, git: state ? { sha: state.sha, patchHash: state.patchHash } : null,
      viewport: Number($('viewport').value), preferenceRequested: $('mode').value,
      observations, notes: $('notes').value,
      warning: 'Manual observations do not establish WCAG conformance.' };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `diff-lab-${config.comparison.id}.json`; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  });
  $('browser').addEventListener('click', async () => {
    $('browser-status').textContent = 'Opening Chromium with isolated preview frames…';
    try { await postApi('/api/browser/open'); await updateBrowserStatus(); }
    catch (e) { $('browser-status').textContent = `Cannot open controlled browser: ${e.message}`; }
  });
  $('apply').addEventListener('click', async () => {
    $('browser-status').textContent = 'Applying browser preference to both isolated frames…';
    try { await postApi('/api/browser/mode', { mode: $('mode').value }); await updateBrowserStatus(); }
    catch (e) { $('browser-status').textContent = `Cannot apply mode: ${e.message}`; }
  });
  const report = await (await fetch('/api/report/latest', { cache:'no-store' })).json();
  displayReport(report);
  await updateBrowserStatus();
}

init().catch(e => { $('warning').textContent = `Lab initialization failed: ${e.message}`; });
