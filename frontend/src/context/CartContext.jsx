import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Initialize state from localStorage to persist cart across refreshes
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
      return [];
    }
  });

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  /**
   * Adds a product to the cart. 
   * If the item exists, it increments quantity.
   * Supports an optional custom quantity (e.g., adding 3 at once).
   */
  const addToCart = (product, quantityToAdd = 1) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantityToAdd } 
            : item
        );
      }
      return [...prev, { ...product, quantity: quantityToAdd }];
    });
  };

  /**
   * Removes an item entirely from the cart by its ID.
   */
  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  /**
   * Updates the quantity of a specific item.
   * If quantity falls below 1, the item is removed.
   */
  const updateQuantity = (id, newQty) => {
    if (newQty < 1) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: newQty } : item
    ));
  };

  /**
   * Clears all items from the cart (useful after successful checkout).
   */
  const clearCart = () => {
    setCart([]);
  };

  // Derived State (Calculated automatically based on the cart array)
  const cartTotal = cart.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
  const cartCount = cart.length;

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      cartTotal, 
      cartCount 
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for easy access to the cart
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};