import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: 'src/html',
  publicDir: '../../public',
  plugins: [
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '/js': path.resolve(__dirname, 'src/js'),
      '/css': path.resolve(__dirname, 'src/css'),
    },
  },
  build: {
    outDir: '../../dist',
  },
  server: {
    port: 5173,
    open: false,
    fs: {
      allow: [__dirname],
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
