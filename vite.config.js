import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { copyFileSync, cpSync } from 'fs';

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'copy-static',
      closeBundle() {
        copyFileSync('public/manifest.json', 'build/manifest.json');
        cpSync('public/icons', 'build/icons', { recursive: true });
      }
    }
  ],
  build: {
    outDir: 'build',
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'public/popup.html'),
        dashboard: resolve(__dirname, 'public/dashboard.html'),
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
