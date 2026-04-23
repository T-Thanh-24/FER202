import { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext(undefined);

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('fivepigs_wishlist');
    if (saved) {
      try { setWishlist(JSON.parse(saved)); } catch {}
    }
  }, []);

  const save = (items) => {
    setWishlist(items);
    localStorage.setItem('fivepigs_wishlist', JSON.stringify(items));
  };

  const addToWishlist = (product) => {
    if (!wishlist.find(p => p.id === product.id)) {
      save([...wishlist, product]);
    }
  };

  const removeFromWishlist = (productId) => {
    save(wishlist.filter(p => p.id !== productId));
  };

  const toggleWishlist = (product) => {
    if (wishlist.find(p => p.id === product.id)) {
      removeFromWishlist(product.id);
      return false;
    } else {
      addToWishlist(product);
      return true;
    }
  };

  const isWishlisted = (productId) => {
    return wishlist.some(p => p.id === productId);
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isWishlisted,
      totalWishlist: wishlist.length,
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
