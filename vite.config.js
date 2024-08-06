import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// `base:` is the full subpath of the URL.
// Set it dynamically from an env variable,
// as different gh branches are deployed to different subpaths

export default defineConfig({
  plugins: [react()],
  base: process.env.BRANCH_SUBPATH || "",
});
