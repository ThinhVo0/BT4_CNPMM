import React, { createContext, useEffect, useState } from 'react';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem('wishlist_items');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('wishlist_items', JSON.stringify(items));
  }, [items]);

  const toggleWishlist = (product) => {
    setItems(prev => {
      const exists = prev.some(p => p._id === product._id);
      if (exists) return prev.filter(p => p._id !== product._id);
      return [...prev, product];
    });
  };

  return (
    <WishlistContext.Provider value={{ items, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};


