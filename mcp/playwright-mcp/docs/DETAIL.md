# Playwright MCP — BlockNote Diff Lab

This configuration-only bundle starts `@playwright/mcp` over stdio using the
installed Google Chrome in headless mode.

It is for **interactive inspection**: navigate the comparator, snapshot the
accessibility tree, click blocks, evaluate DOM/axe queries, and take screenshots.
It is **not** the keyboard or screen-reader evidence path. See
`docs/PLAYWRIGHT-MCP.md` for the boundary and recipes.
