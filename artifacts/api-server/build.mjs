import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build as esbuild } from "esbuild";
import { rm } from "node:fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const require = createRequire(import.meta.url);
globalThis.require = require;

async function buildAll() {
  const distDir = path.resolve(__dirname, "dist");
  console.log('Cleaning dist directory...');
  await rm(distDir, { recursive: true, force: true });

  console.log('Building API server...');

  await esbuild({
    entryPoints: [path.resolve(__dirname, "src/index.ts")],
    platform: "node",
    target: "node20",
    bundle: true,
    format: "esm",
    outdir: distDir,
    outExtension: { ".js": ".mjs" },
    logLevel: "info",
    external: [
      "*.node",
      "better-sqlite3",
      "sqlite3",
      "pdf-parse",
      "mammoth",
    ],
    sourcemap: "linked",
    banner: {
      js: `import { createRequire as __bannerCrReq } from 'node:module';
import __bannerPath from 'node:path';
import __bannerUrl from 'node:url';

globalThis.require = __bannerCrReq(import.meta.url);
globalThis.__filename = __bannerUrl.fileURLToPath(import.meta.url);
globalThis.__dirname = __bannerPath.dirname(globalThis.__filename);
`,
    },
  });

  console.log('Build completed successfully!');
}

buildAll().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});
