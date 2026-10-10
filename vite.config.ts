import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' laat de build overal werken, ook op een submap zoals GitHub Pages.
export default defineConfig({
  base: './',
  plugins: [react()],
});
