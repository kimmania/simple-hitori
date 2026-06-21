import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const buildStamp = process.env.GITHUB_SHA?.slice(0, 7) || Date.now().toString(36);

export default defineConfig({
  base: '/simple-hitori/',
  define: {
    __PUZZLE_STAMP__: JSON.stringify(buildStamp),
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/apple-touch-icon.png'],
      manifest: {
        name: 'Simple Hitori',
        short_name: 'Hitori',
        description:
          'Mobile-first Hitori with four difficulty levels, undo, and mistake counting',
        theme_color: '#1a1a2e',
        background_color: '#1a1a2e',
        display: 'standalone',
        orientation: 'any',
        start_url: '/simple-hitori/',
        scope: '/simple-hitori/',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
        globIgnores: ['**/puzzles/**'],
        navigateFallback: '/simple-hitori/index.html',
        runtimeCaching: [
          {
            urlPattern: ({ url }: { url: URL }) =>
              url.pathname.includes('/puzzles/') && url.pathname.endsWith('.json'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'puzzle-banks',
              expiration: {
                maxEntries: 4,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
        ],
      },
    }),
  ],
});
