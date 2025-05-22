import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mindspring-logo.svg'],
      manifest: {
        name: 'MindSpring Learning Platform',
        short_name: 'MindSpring',
        description: 'Interactive learning platform for languages, programming, math and more',
        theme_color: '#6366f1',
        start_url: '/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ],
server: {
allowedHosts: true,
host: true,
strictPort: true,
port: 5173
}
})
