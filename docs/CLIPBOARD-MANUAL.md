# Headed clipboard probe

ATAG B.1.2.2 asks whether copy/paste inside the tool preserves accessibility
information. The regular test reads the editor's `copy` event `text/html`.
Headless Chromium in this environment exposes only `text/plain` on the system
clipboard, so the OS clipboard needs a headed run.

## Command

```sh
pnpm exec playwright install chromium
pnpm check:clipboard-headed
```

If Chromium is not in Playwright's cache, set `CHROME` to the executable:

```sh
CHROME="/path/to/chrome" pnpm check:clipboard-headed
```

The script opens a headed Chromium window, seeds the minimal editor with an image
and a bullet list, copies with the platform shortcut, and reads
`navigator.clipboard`.

## Observed result

macOS arm64, Chromium 148.0.7778.96, Playwright 1.60.0:

```json
{
  "types": ["text/plain", "text/html"],
  "htmlHasAlt": true,
  "htmlHasList": true
}
```

The HTML clipboard entry contains:

```html
<img src="…" alt="A small cat" …><ul><li><p>One</p></li><li><p>Two</p></li></ul>
```

The plain-text entry contains the Markdown image and list.

## What this establishes

- The headed OS clipboard preserves image alt text and list structure for this
  case.
- Headless Chromium's `text/plain`-only result is a harness limitation, not a
  product failure.
- The check remains manual: CI is headless and is not gated on it.

## Still untested

- Language-tagged content and table `scope`/`headers` in the OS clipboard.
- Paste-back of the copied HTML into a different app.
- Firefox, Safari and Windows clipboards.

## Related

- [B-02 gap record](gaps/atag-b-02-transform-preservation.md)
- [Support matrix](SUPPORT-MATRIX.md)
- [Evidence retention](EVIDENCE.md)
