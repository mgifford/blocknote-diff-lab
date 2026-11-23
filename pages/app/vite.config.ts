import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig } from "vite-plus";

const worktree =
  process.env.BLOCKNOTE_WORKTREE || resolve(__dirname, "../..");

export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: {
    alias: {
      "@blocknote/core": resolve(worktree, "packages/core/src"),
      "@blocknote/react": resolve(worktree, "packages/react/src"),
      "@blocknote/mantine": resolve(worktree, "packages/mantine/src"),
    },
  },
  build: { outDir: "dist", emptyOutDir: true },
});
