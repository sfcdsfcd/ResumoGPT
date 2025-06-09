import vue from '@vitejs/plugin-vue'
import { copyFileSync, cpSync, existsSync, rmSync } from 'fs'
import { resolve, basename, extname } from 'path'
import { defineConfig } from 'vite'

const htmlInputs = {
  popup: resolve(__dirname, 'public/popup.html'),
  dashboard: resolve(__dirname, 'public/dashboard.html'),
  ready: resolve(__dirname, 'public/ready.html')
};

export default defineConfig({
  publicDir: false,
  plugins: [
    vue(),
    {
      // Copies static files needed by the extension after Vite finishes
      // the bundle step.
      name: 'copy-static',
      closeBundle() {
        copyFileSync(resolve(__dirname, 'public/manifest.json'),
          resolve(__dirname, 'build/manifest.json'));
        cpSync(resolve(__dirname, 'public/icons'),
          resolve(__dirname, 'build/icons'), { recursive: true });
        copyFileSync(resolve(__dirname, 'public/config.js'),
          resolve(__dirname, 'build/config.js'));
        copyFileSync(resolve(__dirname, 'public/sidebar.css'),
          resolve(__dirname, 'build/sidebar.css'));
        // move processed html from public directory to the build root
        const popupHtml = resolve(__dirname, 'build/public/popup.html');
        const dashboardHtml = resolve(__dirname, 'build/public/dashboard.html');
        const readyHtml = resolve(__dirname, 'build/public/ready.html');
        if (existsSync(popupHtml)) {
          copyFileSync(popupHtml, resolve(__dirname, 'build/popup.html'));
        }
        if (existsSync(dashboardHtml)) {
          copyFileSync(dashboardHtml, resolve(__dirname, 'build/dashboard.html'));
        }
        if (existsSync(readyHtml)) {
          copyFileSync(readyHtml, resolve(__dirname, 'build/ready.html'));
        }
        // clean up the temporary public folder created by Vite
        if (existsSync(resolve(__dirname, 'build/public')))
          rmSync(resolve(__dirname, 'build/public'), { recursive: true, force: true });
      }
    }
  ],
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true
      }
    }
  },
  build: {
    outDir: 'build',
    sourcemap: true,
    rollupOptions: {
      input: {
        ...htmlInputs,
        background: resolve(__dirname, 'src/background/index.ts'),
        contentScript: resolve(__dirname, 'src/contentScript.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: chunk => {
          // Remove leading underscores from Rollup generated chunks so
          // Chrome treats them as normal resources.
          const name = chunk.name.replace(/^_/, '');
          return `chunks/${name}.js`;
        },
        assetFileNames: asset => {
          // Sanitize asset filenames to avoid the leading underscore that
          // Chrome ignores when loading extension resources.
          const ext = extname(asset.name ?? '');
          const base = basename(asset.name ?? '', ext).replace(/^_/, '');
          const filename = `${base}${ext}`;
          // Assets originally named with '_' are placed inside the chunks
          // directory so their references remain valid.
          if (asset.name?.startsWith('_')) {
            return `chunks/${filename}`;
          }
          return filename;
        }
      }
    }
  }
});
