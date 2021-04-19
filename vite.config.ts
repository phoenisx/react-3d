import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";

// https://vitejs.dev/config/
export default defineConfig(
  /**
   * @type {import('vite').UserConfig}
   */
  {
    plugins: [reactRefresh()],
    resolve: {
      alias: [
        {
          find: /^three\/examples\/js\/(.*)/,
          replacement: "./node_modules/three/examples/js/$1.js",
        },
        {
          find: /^three$/,
          replacement: "https://unpkg.com/three@0.127.0/build/three.module.js",
        },
      ],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react"],
            "react-dom": ["react-dom"],
            "react3-fiber": ["@react-three/fiber"],
            "react3-postprocessing": ["@react-three/postprocessing"],
            "nice-color-palettes": ["nice-color-palettes"],
          },
        },
      },
    },
  }
);
