import vue from '@vitejs/plugin-vue'
import { copyFileSync, cpSync, existsSync, mkdirSync, rmSync } from 'fs'
import { resolve } from 'path'
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
        // move processed html from public directory to build root
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
        if (existsSync(resolve(__dirname, 'build/public')))
          rmSync(resolve(__dirname, 'build/public'), { recursive: true, force: true });

        // Move arquivos que começam com _ para a pasta chunks/
        const buildDir = resolve(__dirname, 'build');
        const chunksDir = resolve(buildDir, 'chunks');
        if (!existsSync(chunksDir)) mkdirSync(chunksDir);
        const files = require('fs').readdirSync(buildDir);
        files.forEach(file => {
          if (file.startsWith('_')) {
            const oldPath = resolve(buildDir, file);
            const newPath = resolve(chunksDir, file);
            if (existsSync(oldPath)) {
              require('fs').renameSync(oldPath, newPath);
            }
          }
        });
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
        chunkFileNames: 'chunks/[name].js',
        assetFileNames: '[name][extname]'
      }
    }
  }
});
