import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { createHash } from 'node:crypto';

function listFiles(dir: string): string[] {
  let out: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out = out.concat(listFiles(p));
    else out.push(p);
  }
  return out;
}

/**
 * Writes dist/sw.js with a precache list of every built file, so the app
 * works fully offline after the first visit. Videos are cached on a
 * best-effort basis (missing files are simply skipped).
 */
function offlineServiceWorker(): Plugin {
  return {
    name: 'musclemap-offline-sw',
    apply: 'build',
    generateBundle(_options, bundle) {
      const publicDir = join(process.cwd(), 'public');
      const publicFiles = listFiles(publicDir)
        .map((f) => '/' + relative(publicDir, f).split('\\').join('/'))
        .filter((f) => !f.endsWith('README.md') && f !== '/sw-template.js');
      const assets = Object.keys(bundle).map((f) => '/' + f);
      const core = ['/', ...assets, ...publicFiles.filter((f) => !f.startsWith('/videos/'))];
      const videos = publicFiles.filter((f) => f.startsWith('/videos/'));
      const version = createHash('sha1').update(core.join('|') + Date.now()).digest('hex').slice(0, 10);
      const template = readFileSync(join(process.cwd(), 'src/sw-template.js'), 'utf8');
      const source = template
        .replace('__VERSION__', version)
        .replace('__CORE__', JSON.stringify(core))
        .replace('__VIDEOS__', JSON.stringify(videos));
      this.emitFile({ type: 'asset', fileName: 'sw.js', source });
    },
  };
}

export default defineConfig({
  plugins: [react(), offlineServiceWorker()],
  build: { chunkSizeWarningLimit: 900 },
});
