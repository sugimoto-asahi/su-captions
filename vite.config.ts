import fs from 'fs';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

// Appends a sourceURL directive so that UDT maps index.js into a virtual path.
// This is necessary because the sourceMappingURL needs a path to resolve against,
// and without the sourceURL directive index.js will not be placed in a proper path,
// and sourceMappingURL will not resolve properly
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
  plugins: [{
    name: 'configure-for-uxp',
    transformIndexHtml(html) {
      return html
        .replace(/type="module"/g, ''); // modules not supported in UXP
    }
  }, sourceURLInserter()],
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
    }
  }
});
