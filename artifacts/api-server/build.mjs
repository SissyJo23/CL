import { execSync } from 'child_process';
import { rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function buildAll() {
  const distDir = path.resolve(__dirname, "dist");
  console.log('🧹 Cleaning dist directory...');
  await rm(distDir, { recursive: true, force: true });

  console.log('📦 Compiling TypeScript with tsc...');
  
  try {
    execSync('npx tsc -p tsconfig.json', { 
      stdio: 'inherit', 
      cwd: __dirname
    });
    console.log('✅ Build completed successfully!');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

buildAll().catch((err) => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
