import { fileURLToPath, URL } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

function routeRewritePlugin(): Plugin {
  return {
    name: 'route-rewrite-plugin',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url) {
          const path = req.url.split('?')[0];
          if (/^\/(?:blog|blogs)(?:\/.*)?$/.test(path) && !path.includes('.')) {
            req.url = '/blogs/index.html';
          } else if (/^\/(?:nostalgia-radio|radio)(?:\/.*)?$/.test(path) && !path.includes('.')) {
            req.url = '/nostalgia-radio/index.html';
          } else if (/^\/(?:privacy|privacy-policy)(?:\/.*)?$/.test(path) && !path.includes('.')) {
            req.url = '/privacy/index.html';
          } else if (/^\/(?:terms|terms-and-conditions)(?:\/.*)?$/.test(path) && !path.includes('.')) {
            req.url = '/terms/index.html';
          }
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), routeRewritePlugin()],
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        game: fileURLToPath(new URL('./game/index.html', import.meta.url)),
        blog: fileURLToPath(new URL('./blog/index.html', import.meta.url)),
        blogs: fileURLToPath(new URL('./blogs/index.html', import.meta.url)),
        nostalgiaRadio: fileURLToPath(new URL('./nostalgia-radio/index.html', import.meta.url)),
        privacy: fileURLToPath(new URL('./privacy/index.html', import.meta.url)),
        terms: fileURLToPath(new URL('./terms/index.html', import.meta.url)),
      },
      output: {
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber', '@react-three/drei', '@react-three/postprocessing', 'postprocessing'],
          gsap: ['gsap'],
          motion: ['lenis', 'framer-motion'],
        },
      },
    },
  },
});
