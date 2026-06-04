import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// `base: './'` emits relative asset URLs, so the build works under any
// GitHub Pages project path (https://<user>.github.io/<repo>/) without
// hardcoding the repo name. State lives in the query string, not the path,
// so there's no client-side routing that would need an absolute base.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
});
