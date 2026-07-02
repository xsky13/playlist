import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
	base: '/playlist/',
	plugins: [react(), VitePWA({
		registerType: 'autoUpdate',
		includeAssets: ['play.png', 'loader.svg', 'loader_white.svg'],
		manifest: {
			name: 'Playlist',
			short_name: 'Playlist',
			start_url: '/playlist/',
			scope: '/playlist/',
			display: 'standalone',
			background_color: '#0c0c0b',
			theme_color: '#0c0c0b',
			icons: [
				{ src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
				{ src: 'icon-512.png', sizes: '512x512', type: 'image/png' }
			]
		},
		workbox: {
			runtimeCaching: [
				{
					urlPattern: ({ url }) => url.hostname.endsWith('onrender.com'),
					handler: 'NetworkOnly'
				}
			]
		}
	})],
})
