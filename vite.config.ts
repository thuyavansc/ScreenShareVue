import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

import { nodePolyfills } from "vite-plugin-node-polyfills";

import tailwind from "tailwindcss";
import autoprefixer from "autoprefixer";

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },
  plugins: [
    vue(),
    vueDevTools(),
    // nodePolyfills({ protocolImports: true }), // Add Node polyfills
    // nodePolyfills({}),
    nodePolyfills({ exclude: [] }),
  ],
  define: {
    // global: {},
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  //for debugger
  build: {
    sourcemap: true,
  },
  server: {
    port: 5174, // Ensure this port matches where the server is running
  },
});
