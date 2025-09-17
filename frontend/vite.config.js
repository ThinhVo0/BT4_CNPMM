import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  server: {
    proxy: {
      '/v1/api': 'http://localhost:8080'  
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'antd-vendor': ['antd', '@ant-design/icons'],
          'utils-vendor': ['axios'],
          
          // Page chunks
          'auth-pages': [
            './src/pages/login.jsx',
            './src/pages/register.jsx',
            './src/pages/forgotPassword.jsx',
            './src/pages/resetPassword.jsx'
          ],
          'product-pages': [
            './src/pages/Products.jsx',
            './src/pages/ProductDetail.jsx'
          ],
          'user-pages': [
            './src/pages/Cart.jsx',
            './src/pages/Wishlist.jsx',
            './src/pages/home.jsx'
          ],
          
          // Component chunks
          'product-components': [
            './src/components/ProductGrid.jsx',
            './src/components/ProductCard.jsx',
            './src/components/ProductFilters.jsx',
            './src/components/SearchResults.jsx',
            './src/components/SearchAutocomplete.jsx'
          ],
          'layout-components': [
            './src/components/layout/header.jsx',
            './src/components/CategoryList.jsx'
          ]
        }
      }
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable source maps for debugging
    sourcemap: true
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'antd',
      '@ant-design/icons',
      'axios'
    ]
  }
});