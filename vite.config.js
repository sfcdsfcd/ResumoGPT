import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { copyFileSync, cpSync, rmSync } from 'fs';

const htmlInputs = {
  popup: resolve(__dirname, 'public/popup.html'),
  dashboard: resolve(__dirname, 'public/dashboard.html')
};

export default defineConfig({
  publicDir: false,
  plugins: [
    vue(),
    {
      name: 'copy-static',
      closeBundle() {
        copyFileSync('public/manifest.json', 'build/manifest.json');
        cpSync('public/icons', 'build/icons', { recursive: true });
        copyFileSync('public/style.css', 'build/style.css');
        copyFileSync('public/config.js', 'build/config.js');
        // move processed html from public directory to build root
        copyFileSync('build/public/popup.html', 'build/popup.html');
        copyFileSync('build/public/dashboard.html', 'build/dashboard.html');
        rmSync('build/public', { recursive: true, force: true });
      }
    }
  ],
  build: {
    outDir: 'build',
    sourcemap: true,
    rollupOptions: {
      input: {
        ...htmlInputs,
        background: resolve(__dirname, 'src/background/index.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name].js',
        assetFileNames: '[name][extname]'
      }
    }
  }
});
