import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  root: 'src/html',
  publicDir: '../../public',
  plugins: [
    tailwindcss(),
  ],
  build: {
    outDir: '../../dist',
  },
  server: {
    port: 5173,
    open: false,
  },
});
