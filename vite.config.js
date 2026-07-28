import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/** Missing /assets/* files must 404 — never fall back to index.html (breaks <img>). */
function assetsStrict404() {
  return {
    name: "assets-strict-404",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = (req.url || "").split("?")[0];
        if (!url.startsWith("/assets/")) {
          next();
          return;
        }
        const filePath = path.join(server.config.publicDir, url.slice(1));
        if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
          res.statusCode = 404;
          res.setHeader("Content-Type", "text/plain; charset=utf-8");
          res.end("Not found");
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), assetsStrict404()],
  server: {
    host: true,
    port: 5173,
    strictPort: false,
  },
  build: {
    // Single-page app bundle is intentionally larger than Vite’s default hint.
    chunkSizeWarningLimit: 1200,
  },
});
