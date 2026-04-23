import { createContext, useContext, useState, useEffect, } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const { user, syncUserSession } = useAuth();

  // Load cart when user changes
  useEffect(() => {
    if (user) {
      setItems(user.cart || []);
    } else {
      setItems([]);
    }
  }, [user]);

  // Sync cart with DB whenever it changes
  const updateCartInDB = async (newItems) => {
    if (user) {
      try {
        await api.patch(`/users/${user.id}`, { cart: newItems });
        // Optionally sync user session to keep AuthContext in sync
        syncUserSession();
      } catch (error) {
        console.error("Failed to sync cart with DB", error);
      }
    }
  };

  const addToCart = (product, size, quantity) => {
    setItems(currentItems => {
      const existingItemIndex = currentItems.findIndex(
        item => item.product.id === product.id && item.size === size
      );

      let newItems;
      if (existingItemIndex > -1) {
        newItems = [...currentItems];
        newItems[existingItemIndex].quantity += quantity;
      } else {
        newItems = [...currentItems, { product, size, quantity }];
      }
      
      updateCartInDB(newItems);
      return newItems;
    });
  };

  const removeFromCart = (productId, size) => {
    setItems(currentItems => {
      const newItems = currentItems.filter(item => !(item.product.id === productId && item.size === size));
      updateCartInDB(newItems);
      return newItems;
    });
  };

  const updateQuantity = (productId, size, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }

    setItems(currentItems => {
      const newItems = currentItems.map(item =>
        item.product.id === productId && item.size === size
          ? { ...item, quantity }
          : item
      );
      updateCartInDB(newItems);
      return newItems;
    });
  };

  const clearCart = () => {
    setItems([]);
    updateCartInDB([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
