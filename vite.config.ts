import vue from '@vitejs/plugin-vue';
import { rmSync } from 'fs';
import { defineConfig } from 'vite';
import electron from 'vite-plugin-electron';
import pkg from './package.json';

rmSync('dist-electron', { recursive: true, force: true });
const sourcemap = !!process.env.VSCODE_DEBUG;
const isBuild = process.argv.slice(2).includes('build');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    electron([
      {
        // Main-Process entry file of the Electron App.
        entry: 'electron/main.ts',
        onstart(options) {
          if (process.env.VSCODE_DEBUG) {
            console.log(
              /* For `.vscode/.debug.script.mjs` */ '[startup] Electron App'
            );
          } else {
            options.startup();
          }
        },
        vite: {
          build: {
            sourcemap,
            minify: isBuild,
            outDir: 'dist-electron',
            rollupOptions: {
              external: Object.keys(pkg.dependencies),
            },
          },
        },
      },
      {
        entry: 'electron/preload.ts',
        onstart(options) {
          // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
          // instead of restarting the entire Electron App.
          options.reload();
        },
        vite: {
          build: {
            sourcemap,
            minify: isBuild,
            outDir: 'dist-electron',
            rollupOptions: {
              external: Object.keys(pkg.dependencies),
            },
          },
        },
      },
    ]),
  ],
  server: process.env.VSCODE_DEBUG
    ? (() => {
        const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL);
        return {
          host: url.hostname,
          port: +url.port,
        };
      })()
    : undefined,
  clearScreen: false,
});
