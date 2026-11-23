// Proposed upstream regression test for #2854.
// Intended location: tests/src/end-to-end/sidemenu/sideMenuKeyboardFocus.test.tsx
// Run with BlockNote's Docker e2e environment, not natively.
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { afterEach, describe, expect, test } from "vite-plus/test";
import { cleanup, render } from "vitest-browser-react";

import { userEvent } from "../../utils/context.js";
import { sleep, waitForSelector } from "../../utils/editor.js";
import { mouseSequence } from "../../utils/mouse.js";

function KeyboardFixture() {
  const editor = useCreateBlockNote({
    initialContent: [
      { type: "paragraph", content: "First paragraph" },
      { type: "paragraph", content: "Second paragraph" },
    ],
  });

  return (
    <div>
      <button data-test="before-editor" type="button">
        Before editor
      </button>
      <BlockNoteView editor={editor} />
      <button data-test="after-editor" type="button">
        After editor
      </button>
    </div>
  );
}

async function showSideMenuOnFirstBlock() {
  await render(<KeyboardFixture />);
  const block = await waitForSelector(".bn-block-content");
  const rect = block.getBoundingClientRect();
  await mouseSequence([
    { type: "move", x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 },
  ]);
  await userEvent.click(block as HTMLElement);
  await waitForSelector(".bn-side-menu");
  await sleep(150);
  const editor = document.querySelector(".bn-editor") as HTMLElement;
  editor.focus();
  expect(document.activeElement).toBe(editor);
}

afterEach(async () => {
  await mouseSequence([{ type: "move", x: 1, y: 1 }]);
  await cleanup();
});

describe("#2854 side menu keyboard focus", () => {
  test("Tab leaves the editor instead of focusing the closing copy", async () => {
    await showSideMenuOnFirstBlock();

    await userEvent.keyboard("{Tab}");

    const active = document.activeElement as HTMLElement | null;
    expect(active?.dataset.test).toBe("after-editor");
    await sleep(400);
    expect((document.activeElement as HTMLElement | null)?.dataset.test).toBe(
      "after-editor",
    );
  });

  test("Enter and Space activate the live Add block button", async () => {
    await showSideMenuOnFirstBlock();
    const addBlock = document.querySelector(
      '.bn-side-menu button[aria-label="Add block"]',
    ) as HTMLButtonElement;

    addBlock.focus();
    await userEvent.keyboard("{Enter}");
    await sleep(250);
    expect(document.querySelector(".bn-suggestion-menu")).not.toBeNull();

    await userEvent.keyboard("{Escape}");
    await sleep(250);
    addBlock.focus();
    await userEvent.keyboard(" ");
    await sleep(250);
    expect(document.querySelector(".bn-suggestion-menu")).not.toBeNull();
  });
});
