import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import ViteSitemap from 'vite-plugin-sitemap';

export default defineConfig({
  plugins: [
    vue(),
    ViteSitemap({
      hostname: 'https://byteslim.com',
      dynamicRoutes: [
        '/',
        '/pptx-compressor',
        '/audio-compressor',
        '/privacy',
        '/terms',
        '/about',
        '/faq',
        '/contact'
      ],
      outDir: 'dist'
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@views': resolve(__dirname, 'src/views'),
      '@stores': resolve(__dirname, 'src/stores'),
      '@workers': resolve(__dirname, 'src/workers'),
      '@composables': resolve(__dirname, 'src/composables'),
      '@types': resolve(__dirname, 'src/types'),
    },
  },
  server: {
    port: 3000,
    host: true,
    strictPort: true,
    hmr: {
      host: 'localhost',
      port: 3000,
      protocol: 'ws',
      clientPort: 3000,
      timeout: 5000,
      overlay: true,
    },
  },
  css: {
    preprocessorOptions: {
      css: {
        charset: false, // Avoid charset issues
      },
    },
    // Explicitly configure PostCSS for Tailwind
    postcss: './postcss.config.js', // Ensure PostCSS config is used
    devSourcemap: true, // Enable source maps for easier debugging in dev
  },
  assetsInclude: ['**/*.css'], // Treat .css files as assets
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'assets/[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
});