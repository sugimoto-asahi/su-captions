import path from 'path';
import http from 'http';
import fs from 'fs';
import { defineConfig, Plugin } from 'vitest/config';
import { WebSocketServer, WebSocket } from 'ws';

const HOT_RELOAD_PORT = 7788;

// Snippet injected into the bundle in watch/dev mode only.
// Runs inside UXP: connects to the Vite WS server and reloads on every rebuild.
const wsClientSnippet = [
  '(function() {',
  '  var connect = function() {',
  `    var ws = new WebSocket("ws://localhost:${HOT_RELOAD_PORT}");`,
  '    ws.onmessage = function(event) { ',
  '        if (event.data === "reload") {',
  '            console.clear();',
  '            location.reload();',
  '        }',
  '    };',
  '    ws.onclose = function() { setTimeout(connect, 3000); };',
  '  };',
  '  connect();',
  '})();',
].join('\n');

// Starts a WS server in watch mode. After every rebuild, injects the WS client
// snippet into the bundle and broadcasts a reload signal to all connected UXP panels.
const hotReload = (): Plugin => {
  let clients: Set<WebSocket> = new Set();
  let server: http.Server | null = null;

  return {
    name: 'hot-reload',

    // When the build starts (as part of vite build --watch) we start our 
    // WebSocket server
    buildStart() {
      if (!this.meta.watchMode) return;
      if (server) return; // singleton guard — only start once

      server = http.createServer((_, res) => { res.writeHead(404); res.end(); });
      const webSocketServer = new WebSocketServer({ server });
      webSocketServer.on('connection', (ws) => {
        clients.add(ws);
        ws.on('close', () => clients.delete(ws));
      });
      server.listen(HOT_RELOAD_PORT, () => {
        console.log(`⚡ Hot reload server listening on: ${HOT_RELOAD_PORT}`);
      });
    },

    // A hot reload triggers this hook. We inject the WS client snippet into
    // the top of the entry point of the program.
    // This ideally results in the code being the first thing that executes
    // when the plugin loads.
    outputOptions(options) {
      if (!this.meta.watchMode) return null;
      return { ...options, banner: (chunk) => chunk.isEntry ? wsClientSnippet : '' };
    },

    // Broadcast reload to all connected UXP panels
    writeBundle() {
      if (!this.meta.watchMode) return;

      for (const client of clients) {
        if (client.readyState === WebSocket.OPEN) {
          client.send('reload');
        }
      }
    },
  };
};

// Appends a sourceURL directive so that UDT maps the file into a virtual path.
// This is necessary because the sourceMappingURL needs a path to resolve against,
// and without the sourceURL directive index.js will not be placed in a proper path,
// and sourceMappingURL will not resolve properly.
const sourceURLInserter = (): Plugin => ({
  name: 'source-url-inserter',
  writeBundle(options, bundle) {
    const outDir = options.dir ?? path.dirname(options.file ?? '');

    for (const [fileName, chunk] of Object.entries(bundle)) {
      if (chunk.type !== 'chunk') continue;

      const filePath = path.join(outDir, fileName);
      let code = fs.readFileSync(filePath, 'utf-8');
      const sourceURL = `\n//# sourceURL=uxp:///${fileName}`;

      // Insert immediately before sourceMappingURL so ordering is correct
      if (code.includes('//# sourceMappingURL=')) {
        code = code.replace('//# sourceMappingURL=', `${sourceURL}\n//# sourceMappingURL=`);
      } else {
        code += sourceURL;
      }

      fs.writeFileSync(filePath, code, 'utf-8');
    }
  }
});

console.log(__dirname);
console.log(import.meta.dirname);

export default defineConfig({
  base: './',
  resolve: {
    alias: [ 
        {find: "@core", replacement: path.resolve(import.meta.dirname, "./src/core")},
        {find: "@components", replacement: path.resolve(import.meta.dirname, "./src/components")},
        {find: "@localTypes", replacement: path.resolve(import.meta.dirname, "./src/types")},
     ],
  },
  plugins: [
    hotReload(),
    {
      name: 'configure-for-uxp',
      transformIndexHtml(html) {
        return html.replace(/type="module"/g, ''); // modules not supported in UXP
      }
    },
    sourceURLInserter(),
  ],
  build: {
    outDir: 'dist',
    minify: false,
    sourcemap: 'inline',
    modulePreload: false, // Prevent polyfills
    rollupOptions: {
      output: {
        esModule: false,
        format: 'cjs',
        preserveModules: false,
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      },
      external: [
        "uxp",
        "premierepro"
      ]
    },
    chunkSizeWarningLimit: 1000
  },
  test: {
    globals: true,
    alias: [
      { find: "@core/settings-store", replacement: path.resolve(import.meta.dirname, "./test/mock/settings-store.ts") },
      { find: "@core/api",            replacement: path.resolve(import.meta.dirname, "./test/mock/api.ts") },
      { find: "uxp",                  replacement: path.resolve(import.meta.dirname, "./test/mock/uxp.ts") },
    ],
    // silent: "passed-only"
  }
});
