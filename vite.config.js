import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  publicDir: 'static',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 900,
  },
  server: {
    port: 5180,
    open: true,
  },
});
