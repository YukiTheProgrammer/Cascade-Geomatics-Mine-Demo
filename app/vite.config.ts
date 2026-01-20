import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      // Local bundled renderer - points to copied file in lib directory
      'custom-pointcloud-renderer': path.resolve(__dirname, './lib/custom-pointcloud-renderer'),
    },
    // Only preserve symlinks in development (for npm link)
    preserveSymlinks: process.env.NODE_ENV !== 'production',
  },
  optimizeDeps: {
    // Include the renderer in optimization since it's now local
    include: ['custom-pointcloud-renderer'],
  },
  server: {
    fs: {
      // Only allow parent directory access in development
      allow: process.env.NODE_ENV !== 'production' ? ['..'] : [],
    },
  },
})
