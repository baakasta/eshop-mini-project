import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService } from '../services';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], total: 0, itemCount: 0 });
  const { user } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!user) { setCart({ items: [], total: 0, itemCount: 0 }); return; }
    try {
      const res = await cartService.get();
      setCart(res.data);
    } catch { setCart({ items: [], total: 0, itemCount: 0 }); }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId, quantite = 1) => {
    const res = await cartService.add({ productId, quantite });
    setCart(res.data);
  };

  const updateItem = async (itemId, quantite) => {
    const res = await cartService.updateItem(itemId, quantite);
    setCart(res.data);
  };

  const removeItem = async (itemId) => {
    const res = await cartService.removeItem(itemId);
    setCart(res.data);
  };

  const clearCart = async () => {
    await cartService.clear();
    setCart({ items: [], total: 0, itemCount: 0 });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateItem, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
