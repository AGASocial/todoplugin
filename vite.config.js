import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/todo-plugin.js',
      name: 'TodoPlugin',
      fileName: 'todo-plugin',
      formats: ['iife', 'es']
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Keep the SVG files in an images directory
          if (assetInfo.name.endsWith('.svg')) {
            return 'images/[name][extname]';
          }
          return '[name][extname]';
        },
        // Ensure proper chunk naming
        chunkFileNames: 'chunks/[name]-[hash].js',
        entryFileNames: '[name].[format].js'
      }
    },
    // Optimize the build
    minify: 'terser',
    sourcemap: true,
    // Ensure assets are properly copied
    assetsDir: '.',
    // Optimize CSS
    cssCodeSplit: false,
    // Improve loading performance
    modulePreload: {
      polyfill: false
    }
  },
  // Handle SVG files
  assetsInclude: ['**/*.svg'],
  // Resolve paths
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});