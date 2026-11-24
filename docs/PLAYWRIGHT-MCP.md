# Playwright MCP for the BlockNote Diff Lab

The lab ships a Playwright MCP server configuration so an agent or editor client
can drive the comparator interactively.

## Start it

```sh
pnpm pages:build
npx http-server _site -p 8811   # or: python3 -m http.server 8811 -d _site
pnpm mcp:playwright             # stdio MCP server, headless Chrome
```

`.mcp.json` contains the same command for clients that read the standard
project-level MCP file. The DSH profile can load the configuration-only bundle in
[`mcp/playwright-mcp/`](../mcp/playwright-mcp/):

```sh
# In DSH, install the local bundle through the plugin manager, then enable it.
# The bundle inserts @deepseek-ai/dsh-mcp-client with serverName "playwright".
```

After installation, the tools appear as `mcp__playwright__browser_navigate`,
`browser_snapshot`, `browser_click`, `browser_evaluate`,
`browser_take_screenshot`, and so on.

## What it is good for

- navigate the live comparator or a local `_site` build;
- take an accessibility-tree snapshot of a frame;
- click a block and inspect the toolbar/menu that appears;
- evaluate DOM queries (e.g. `th[scope]`, `td[headers]`, `img[alt]`);
- inject and read axe-core results in a page;
- capture annotated screenshots for a report.

Example prompts:

```text
Navigate to http://127.0.0.1:8811/#issue=2822 and snapshot the page.
In the After frame, evaluate [...document.querySelectorAll('.bn-editor img')].map(i => i.alt).
Navigate to #issue=2825 and compare th[scope] and td[headers] in both frames.
```

## What it must not be used for

**Do not treat Playwright MCP key presses as keyboard-operability or
screen-reader evidence.** The project's a11y testing guidance records that
MCP `browser_press_key` calls are silently dropped for many interactive widgets.
Use the Playwright test suite instead:

```sh
pnpm test:a11y:keyboard       # real page.keyboard events, #2854 focus/activation
pnpm test:a11y:guidepup       # Guidepup Virtual Screen Reader announcements
pnpm test:a11y                # all axe + Guidepup + keyboard + semantics
```

MCP is also not a substitute for VoiceOver/NVDA or testing with disabled
people. Real screen-reader evaluation is **out of scope** for this lab. See
[`docs/ATAG-2.0-A11YFIRST.md`](ATAG-2.0-A11YFIRST.md) for the evidence map and
[`docs/gaps/`](gaps/) for the gap records.

## Notes

- The MCP command uses `--browser chrome` because Google Chrome is installed on
  this machine; `--headless` and `--isolated` keep it from sharing a profile.
- The preview frames are cross-origin on GitHub Pages. `browser_evaluate` runs in
  the top document; to inspect a cross-origin frame, navigate the MCP browser
  directly to the preview URL instead of the comparator, or use the Playwright
  tests, which can evaluate inside frames.
- The MCP server has access to the workspace root only. Do not enable
  `--allow-unrestricted-file-access` for this lab.
