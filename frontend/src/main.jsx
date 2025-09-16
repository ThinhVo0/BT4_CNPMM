import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './components/context/auth.context.jsx';
import { CartProvider } from './components/context/cart.context.jsx';
import { WishlistProvider } from './components/context/wishlist.context.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <App />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);