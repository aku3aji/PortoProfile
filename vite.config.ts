import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

/**
 * Nama repository GitHub — dipakai HANYA untuk deploy ke GitHub Pages.
 * Kalau repo kamu bernama lain, ganti string di bawah ini.
 * Vercel & `npm run dev` tetap memakai base '/'.
 */
const GITHUB_REPO_NAME = 'triajibnhrmwn';

export default defineConfig(() => ({
  base: process.env.DEPLOY_TARGET === 'gh-pages' ? `/${GITHUB_REPO_NAME}/` : '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    // Chunk `three` memang besar (~956 kB), tapi lazy-loaded dan tidak
    // memblokir first paint — jadi peringatannya tidak perlu.
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Pisahkan three.js supaya tidak memblokir first paint.
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three') || id.includes('@react-three')) return 'three';
            if (id.includes('gsap')) return 'gsap';
            if (id.includes('framer-motion') || id.includes('motion-dom') || id.includes('motion-utils')) {
              return 'motion';
            }
          }
          return undefined;
        },
      },
    },
  },
}));
