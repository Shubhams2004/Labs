import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

export default defineConfig(({ command }) => {
  return {
    base: process.env.VITE_BASE_PATH || (command === 'build' ? '/Labs/' : '/'),
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'github-pages-spa',
        closeBundle() {
          const rootDir = process.cwd();
          const distDir = path.resolve(rootDir, 'dist');
          const indexPath = path.join(distDir, 'index.html');
          const fallbackPath = path.join(distDir, '404.html');
          const noJekyllPath = path.join(distDir, '.nojekyll');

          if (!fs.existsSync(distDir)) {
            fs.mkdirSync(distDir, { recursive: true });
          }

          // Ensure .nojekyll exists so GitHub Pages does not run Jekyll
          if (!fs.existsSync(noJekyllPath)) {
            fs.writeFileSync(noJekyllPath, '');
          }

          // Ensure 404.html is provided for SPA direct route reloads
          if (fs.existsSync(indexPath)) {
            fs.copyFileSync(indexPath, fallbackPath);
          }
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname || path.resolve(), '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
