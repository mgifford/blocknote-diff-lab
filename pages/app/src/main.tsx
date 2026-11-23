import "@mantine/core/styles.css";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { MantineProvider } from "@mantine/core";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { createRoot } from "react-dom/client";
import "./app.css";

const theme = new URLSearchParams(window.location.search).get("theme");
const forced = theme === "light" || theme === "dark" ? theme : undefined;

function App() {
  const editor = useCreateBlockNote({
    initialContent: [
      { type: "paragraph", content: "First paragraph" },
      { type: "paragraph", content: "Second paragraph" },
    ],
  });
  return <BlockNoteView editor={editor} />;
}

createRoot(document.getElementById("root")!).render(
  <MantineProvider defaultColorScheme="auto" forceColorScheme={forced}>
    <App />
  </MantineProvider>,
);
