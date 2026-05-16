import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// ============================================================
// GITHUB PAGES DEPLOYMENT:
// Before deploying, change REPOSITORY_NAME to your repo name.
//
// Example: if your repo URL is
//   https://github.com/yourusername/cabs-online-part2
// then set:
//   const REPOSITORY_NAME = "/cabs-online-part2/";
//
// When running locally or on Replit, leave it as:
//   const REPOSITORY_NAME = undefined;
// ============================================================
const REPOSITORY_NAME = "/Taxi-Online/";
// const REPOSITORY_NAME = "/YOUR_REPOSITORY_NAME/";  // <-- uncomment & fill in for GitHub Pages

const base = REPOSITORY_NAME ?? (process.env.BASE_PATH || "/");
const port = process.env.PORT ? Number(process.env.PORT) : 5173;

export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
    strictPort: false,
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
