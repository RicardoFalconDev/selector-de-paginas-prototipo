import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  // En build se publica en https://ricardofalcondev.github.io/selector-de-paginas-prototipo/
  base: command === 'build' ? '/selector-de-paginas-prototipo/' : '/',
  plugins: [react()],
  server: { port: 5173 },
}));
