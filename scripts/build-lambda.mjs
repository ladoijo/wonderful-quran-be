import { mkdirSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const entryPoint = resolve(projectRoot, 'src/server.ts');
const outDir = resolve(projectRoot, 'dist-lambda');
const outFile = resolve(outDir, 'server.mjs');

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

await build({
  entryPoints: [entryPoint],
  outfile: outFile,
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: ['node20'],
  sourcemap: true,
  external: ['aws-sdk'],
  banner: {
    js: 'import { createRequire } from "module";const require = createRequire(import.meta.url);'
  },
  minify: false
});

console.log(`[build-lambda] bundle written to ${outFile}`);
