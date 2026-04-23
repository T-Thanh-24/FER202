import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

const WishlistContext = createContext(undefined);

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const { user, syncUserSession } = useAuth();

  useEffect(() => {
    if (user) {
      setWishlist(user.wishlist || []);
    } else {
      setWishlist([]);
    }
  }, [user]);

  const saveToDB = async (items) => {
    if (user) {
      try {
        await api.patch(`/users/${user.id}`, { wishlist: items });
        syncUserSession();
      } catch (error) {
        console.error("Failed to sync wishlist with DB", error);
      }
    }
  };

  const addToWishlist = (product) => {
    if (!wishlist.find(p => p.id === product.id)) {
      const newWishlist = [...wishlist, product];
      setWishlist(newWishlist);
      saveToDB(newWishlist);
    }
  };

  const removeFromWishlist = (productId) => {
    const newWishlist = wishlist.filter(p => p.id !== productId);
    setWishlist(newWishlist);
    saveToDB(newWishlist);
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
