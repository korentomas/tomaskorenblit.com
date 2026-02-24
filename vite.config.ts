import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import { vercelPreset } from "@vercel/remix/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from "path";

installGlobals();

export default defineConfig({
  plugins: [remix({ presets: [vercelPreset()] }), tsconfigPaths()],
  resolve: {
    alias: {
      // React 18 doesn't export ./compiler-runtime, but @sanity/ui
      // pulls in react-compiler-runtime which tries to import it.
      "react/compiler-runtime": resolve(__dirname, "react-compiler-shim.js"),
    },
  },
  ssr: {
    // Sanity Studio (v5.3.0) requires React 19 + styled-components.
    // Only @sanity/client is used by the app; externalize the full Studio.
    external: ["sanity", "sanity/structure", "@sanity/vision", "styled-components"],
  },
  build: {
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      external: [/^sanity(?:\/|$)/, "styled-components", "@sanity/vision"],
    },
  }
});
