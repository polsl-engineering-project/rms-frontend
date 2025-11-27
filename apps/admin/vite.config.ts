import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: {
    outDir: 'dist',
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
    // Force resolution to UI package source files for proper HMR
    alias: {
      '@repo/ui/styles.css': path.resolve(__dirname, '../../packages/ui/src/styles/globals.css'),
      '@repo/ui': path.resolve(__dirname, '../../packages/ui/src'),
    },
  },
  optimizeDeps: {
    // Prevent Vite from pre-bundling the UI package
    exclude: ['@repo/ui'],
  },
  server: {
    port: 5173,
    watch: {
      // Explicitly watch the UI package inside node_modules for changes
      ignored: ['!**/node_modules/@repo/ui/**'],
    },
    proxy: {
      '/api': {
        target: 'https://rms-backend-1045457934254.europe-central2.run.app',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
