import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      
      devOptions: {
        enabled: true,
        type: 'module',
      },

      strategies: 'generateSW',

      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,ts,tsx}'],
        cleanupOutdatedCaches: true,
        navigateFallback: 'index.html',
      },

      manifest: {
        name: 'Expenditures Tracker',
        short_name: 'Expenditures',
        description: 'Offline-first приложение для учета затрат',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'favicon.svg',
            sizes: '192x192',
            type: 'svg+xml'
          },
          {
            src: 'favicon.svg',
            sizes: '512x512',
            type: 'svg+xml'
          }
        ]
      }
    })
  ]
});
