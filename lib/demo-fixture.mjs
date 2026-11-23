// Synthetic demo fixture for the viewer. This is deliberately simple HTML, not
// BlockNote, and the "collaboration" is a local scripted animation. It exists
// only to exercise the viewer and to illustrate the kind of multi-author
// document a real BlockNote comparison would contain.

export function renderDemoFixture(side) {
  const altered = side === 'after';
  const sideLabel = altered ? 'AFTER' : 'BEFORE';
  const focusCss = altered
    ? 'button:focus-visible, [contenteditable]:focus-visible, a:focus-visible { outline:3px solid Highlight; outline-offset:3px; }'
    : 'button:focus-visible, [contenteditable]:focus-visible, a:focus-visible { outline:none; }';
  const closeFocus = altered
    ? 'menuButton.focus();'
    : "document.body.setAttribute('tabindex','-1'); document.body.focus(); document.body.removeAttribute('tabindex');";

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${altered ? 'After' : 'Before'} — simulated collaborative review</title>
<style>
  :root { color-scheme:light dark; --maya:#b45309; --sam:#1d4ed8; --paper:Canvas; --ink:CanvasText; --line:GrayText; --tint:color-mix(in srgb, CanvasText 6%, Canvas); }
  @media (prefers-color-scheme: dark) { :root { --maya:#fbbf24; --sam:#93c5fd; } }
  * { box-sizing:border-box; }
  body { margin:0; padding:1rem 1.2rem 2rem; background:var(--paper); color:var(--ink); font:16px/1.6 system-ui,-apple-system,sans-serif; }
  .banner { margin:0 0 1rem; padding:.55rem .7rem; border:1px solid var(--line); background:var(--tint); font-size:.8rem; font-weight:700; }
  .doc-header h1 { font-size:1.65rem; line-height:1.2; margin:.2rem 0 .4rem; }
  .eyebrow { margin:0; text-transform:uppercase; letter-spacing:.08em; font-size:.72rem; font-weight:700; }
  .byline { margin:.2rem 0 .7rem; font-size:.86rem; }
  .muted { opacity:.75; }
  .presence { display:flex; flex-wrap:wrap; gap:.5rem .9rem; align-items:center; padding:.5rem .65rem; border:1px solid var(--line); background:var(--tint); font-size:.82rem; position:sticky; top:0; z-index:2; }
  .person { display:inline-flex; align-items:center; gap:.4rem; }
  .avatar { display:inline-grid; place-items:center; width:1.6rem; height:1.6rem; border-radius:50%; font-size:.65rem; font-weight:700; color:#fff; background:var(--maya); }
  .avatar.sam { background:var(--sam); }
  .state { font-size:.7rem; text-transform:uppercase; letter-spacing:.05em; padding:.1rem .35rem; border:1px solid var(--line); }
  .toolbar { display:flex; flex-wrap:wrap; gap:.5rem; align-items:flex-start; margin:.9rem 0 .6rem; }
  button { font:inherit; color:inherit; background:var(--paper); border:1px solid var(--line); border-radius:.25rem; padding:.35em .65em; cursor:pointer; }
  button:hover { background:var(--tint); }
  #menu { display:flex; flex-wrap:wrap; gap:.4rem; padding:.35rem; border:1px dashed var(--line); }
  #menu[hidden] { display:none; }
  .status { margin:.3rem 0 .8rem; font-size:.8rem; }
  .doc { max-width:64ch; padding:1rem 1.1rem; border:1px solid var(--line); background:var(--paper); }
  .doc h2 { font-size:1.05rem; margin:1.1rem 0 .35rem; }
  .doc h2:first-child { margin-top:.1rem; }
  .doc p { margin:.35rem 0 .6rem; }
  .doc ul { margin:.3rem 0 .8rem; padding-inline-start:1.4rem; }
  .doc blockquote { margin:.6rem 0; padding:.3rem .8rem; border-inline-start:3px solid var(--line); }
  .doc cite { font-style:normal; font-size:.82rem; }
  .placeholder { opacity:.65; }
  .edit.maya { border-bottom:2px solid var(--maya); background:color-mix(in srgb, var(--maya) 13%, transparent); }
  .edit.sam { border-bottom:2px solid var(--sam); background:color-mix(in srgb, var(--sam) 13%, transparent); }
  .attribution { font-size:.72rem; font-weight:700; text-transform:uppercase; letter-spacing:.04em; }
  .author.maya { color:var(--maya); }
  .author.sam { color:var(--sam); }
  .remote-edit { border-bottom:2px solid currentColor; background:var(--tint); }
  .remote-edit.edit-maya { border-color:var(--maya); background:color-mix(in srgb, var(--maya) 13%, transparent); }
  .remote-edit.edit-sam { border-color:var(--sam); background:color-mix(in srgb, var(--sam) 13%, transparent); }
  .remote-caret { display:inline-block; width:0; border-left:2px solid currentColor; height:1.15em; vertical-align:-.18em; position:relative; }
  .remote-caret::after { content:attr(data-label); position:absolute; left:-2px; bottom:1.25em; background:Highlight; color:HighlightText; font-size:.62rem; font-weight:700; padding:.05rem .25rem; white-space:nowrap; }
  .comment { max-width:64ch; margin-top:.8rem; padding:.6rem .8rem; border:1px solid var(--line); border-inline-start:4px solid var(--sam); background:var(--tint); font-size:.86rem; }
  .comment p { margin:.2rem 0 .45rem; }
  .comment button { font-size:.8rem; }
  ${focusCss}
  @media (forced-colors: active) { .banner,.presence,.doc,.comment,#menu { border-color:CanvasText; } .edit.maya,.edit.sam,.remote-edit { border-bottom:1px solid CanvasText; } }
  @media (prefers-reduced-motion: no-preference) { .remote-caret { animation:blink 1s step-end infinite; } }
  @keyframes blink { 50% { opacity:0; } }
  @media (max-width:520px) { body { padding:.8rem; } .doc { padding:.8rem; } .presence { position:static; } }
</style>
</head>
<body>
<p class="banner">SIMULATED ${sideLabel} FIXTURE — not BlockNote. The two-author history and the collaboration below are scripted for this viewer demo.</p>
<header class="doc-header">
  <p class="eyebrow">Draft 2 · Accessibility review</p>
  <h1>Keyboard navigation in the editor</h1>
  <p class="byline">Started by <strong>Maya Chen</strong> · Edited by <strong>Sam Okafor</strong> · <span class="muted">last edit 4 minutes ago</span></p>
  <div class="presence" role="group" aria-label="People in this document">
    <span class="person"><span class="avatar" aria-hidden="true">MC</span> Maya Chen <span class="state" id="maya-state">viewing</span></span>
    <span class="person"><span class="avatar sam" aria-hidden="true">SO</span> Sam Okafor <span class="state" id="sam-state">viewing</span></span>
  </div>
</header>
<div class="toolbar">
  <button id="menuButton" type="button" aria-expanded="false" aria-controls="menu">Formatting options</button>
  <div id="menu" hidden>
    <button type="button" data-command="bold">Bold</button>
    <button type="button" data-command="italic">Italic</button>
    <button type="button" data-command="insertUnorderedList">Bulleted list</button>
    <button id="close" type="button">Close</button>
  </div>
  <button id="collaborateLocal" type="button">Simulate collaborators</button>
</div>
<p id="status" class="status" role="status">Synthetic document. Use “Simulate collaborators” or the viewer button to run a scripted two-person edit.</p>
<main>
  <div class="doc" id="doc" contenteditable="true" role="textbox" aria-multiline="true" aria-label="Simulated collaborative document">
    <h2>What we tested</h2>
    <p>We opened the minimal editor, selected text with the keyboard and tried to reach the formatting toolbar. <mark class="edit maya" title="Inserted by Maya">At 320px the toolbar is clipped and the focus ring disappears.</mark> <span class="attribution">Maya</span></p>
    <h2>Live notes</h2>
    <p><strong class="author maya">Maya</strong> <span id="maya-edit" class="edit-slot"><span class="placeholder">No note yet.</span></span></p>
    <p><strong class="author sam">Sam</strong> <span id="sam-edit" class="edit-slot"><span class="placeholder">No note yet.</span></span></p>
    <h2>What still needs a person</h2>
    <ul>
      <li>Confirm the Escape behavior with a real screen reader.</li>
      <li>Check the 320px layout under forced colours.</li>
      <li>Repeat the toolbar test in Firefox.</li>
    </ul>
    <blockquote>“The focus ring vanishes after the menu closes.” <cite>— Sam, in review</cite></blockquote>
    <p><mark class="edit sam" title="Edited by Sam">The After fixture keeps a visible focus indicator and returns focus to the menu button.</mark> <span class="attribution">Sam</span></p>
  </div>
  <aside class="comment" aria-labelledby="comment-heading">
    <p id="comment-heading"><strong>Sam Okafor</strong> <span class="muted">4 min ago</span></p>
    <p>Can we confirm the Escape behavior on Firefox before we call this fixed?</p>
    <button id="resolveComment" type="button" aria-pressed="false">Resolve</button>
  </aside>
</main>
<script>
  const menuButton = document.getElementById('menuButton');
  const menu = document.getElementById('menu');
  const closeButton = document.getElementById('close');
  const status = document.getElementById('status');
  const mayaState = document.getElementById('maya-state');
  const samState = document.getElementById('sam-state');
  const resolve = document.getElementById('resolveComment');
  let running = false;
  let cancelled = false;

  function announce(message) { status.textContent = message; }
  function setMenu(open) {
    menu.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    if (open) menu.querySelector('[data-command]').focus();
  }
  menuButton.addEventListener('click', function () { setMenu(menu.hidden); });
  closeButton.addEventListener('click', function () {
    setMenu(false);
    ${closeFocus}
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !menu.hidden) closeButton.click();
  });
  menu.querySelectorAll('[data-command]').forEach(function (button) {
    button.addEventListener('mousedown', function (event) { event.preventDefault(); });
    button.addEventListener('click', function () {
      document.execCommand(button.dataset.command, false, null);
      announce('Applied ' + button.textContent.toLowerCase() + ' in this synthetic demo.');
    });
  });

  function sleep(ms) { return new Promise(function (resolvePromise) { setTimeout(resolvePromise, ms); }); }
  function reducedMotion() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }

  async function typeInto(target, text, authorClass, authorLabel) {
    target.textContent = '';
    const edit = document.createElement('span');
    edit.className = 'remote-edit ' + authorClass;
    edit.dataset.remoteEdit = '';
    edit.dataset.author = authorLabel;
    const caret = document.createElement('span');
    caret.className = 'remote-caret';
    caret.dataset.label = authorLabel;
    caret.setAttribute('aria-hidden', 'true');
    target.append(edit, caret);
    if (reducedMotion()) {
      edit.textContent = text;
      caret.remove();
      return;
    }
    for (const char of text) {
      if (cancelled) break;
      edit.textContent += char;
      await sleep(38);
    }
    caret.remove();
  }

  async function runCollaboration() {
    if (running) return;
    running = true;
    cancelled = false;
    const mayaTarget = document.getElementById('maya-edit');
    const samTarget = document.getElementById('sam-edit');
    if (!mayaTarget || !samTarget) { running = false; return; }
    mayaState.textContent = 'editing';
    samState.textContent = 'editing';
    announce('Maya and Sam joined and are typing in the live notes. This is a scripted simulation, not a real session.');
    await Promise.all([
      typeInto(mayaTarget, "I can still reproduce the Escape problem in today's build.", 'edit-maya', 'Maya'),
      typeInto(samTarget, 'Focus returns in the After fixture, but only when the menu is closed from the keyboard.', 'edit-sam', 'Sam')
    ]);
    mayaState.textContent = 'viewing';
    samState.textContent = 'viewing';
    announce(cancelled ? 'Simulation stopped.' : 'Maya and Sam finished editing. Two scripted remote edits were added.');
    running = false;
  }

  document.getElementById('collaborateLocal').addEventListener('click', runCollaboration);
  resolve.addEventListener('click', function () {
    const pressed = resolve.getAttribute('aria-pressed') === 'true';
    resolve.setAttribute('aria-pressed', String(!pressed));
    resolve.textContent = !pressed ? 'Resolved' : 'Resolve';
    announce(!pressed ? 'Sam’s comment marked resolved in this demo.' : 'Sam’s comment reopened in this demo.');
  });
  window.addEventListener('message', function (event) {
    if (event.source !== window.parent || !event.data) return;
    if (event.data.type === 'diff-lab:collaborate') runCollaboration();
    if (event.data.type === 'diff-lab:reset') { cancelled = true; window.location.reload(); }
  });
</script>
</body>
</html>`;
}
