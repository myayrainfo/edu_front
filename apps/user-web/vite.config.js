import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  plugins: [react()],
  cacheDir: "../../node_modules/.vite/user-web",
  server: {
    host: "localhost",
    port: 5176,
    strictPort: true,
  },
  resolve: {
    alias: {
      react: fileURLToPath(new URL("../../node_modules/react", import.meta.url)),
      "react-dom": fileURLToPath(new URL("../../node_modules/react-dom", import.meta.url)),
    },
  },
});
