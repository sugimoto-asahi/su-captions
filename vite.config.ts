import fs from 'fs';
import path from 'path';
import http from 'http';
import { defineConfig, Plugin } from 'vite';
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
    writeBundle(options, bundle) {
      if (!this.meta.watchMode) return;

      const outDir = options.dir ?? 'dist';
      for (const fileName of Object.keys(bundle)) {
        const chunk = bundle[fileName];
        // inject the websocket snippet to the start of index.js
        if (chunk.type === 'chunk' && chunk.isEntry) {
          const filePath = path.resolve(outDir, fileName);
          const existing = fs.readFileSync(filePath, 'utf-8');
          fs.writeFileSync(filePath, wsClientSnippet + existing);
        }
      }

      // Broadcast reload to all connected UXP panels
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
  enforce: 'post',
  writeBundle(options, bundle) {
    const outDir = options.dir ?? 'dist';
    for (const fileName in bundle) {
      const chunk = bundle[fileName];
      if (chunk.type === 'chunk') {
        const filePath = path.resolve(outDir, fileName);
        fs.appendFileSync(filePath, `\n//# sourceURL=uxp:///${fileName}`);
      }
    }
  },
});

export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, './src/core'),
      '@components': path.resolve(__dirname, './src/components'),
    },
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
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
