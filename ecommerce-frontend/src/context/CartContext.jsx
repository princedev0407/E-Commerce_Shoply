import { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Load cart from LocalStorage on startup
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save to LocalStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Function to add item
  const addToCart = (product) => {
    setCart((prevCart) => {
      // Check if item already exists
      const existingItem = prevCart.find((item) => item.id === product.id);
      
      if (existingItem) {
        // If yes, just increase quantity
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // If no, add new item with quantity 1
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // Function to remove item
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // 3. Increment Quantity (+)
  const incrementQuantity = (productId) => {
    setCart((prevCart) => 
      prevCart.map((item) => 
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // 4. Decrement Quantity (-)
  const decrementQuantity = (productId) => {
    setCart((prevCart) => 
      prevCart.map((item) => 
        // Prevent going below 1
        item.id === productId && item.quantity > 1 
          ? { ...item, quantity: item.quantity - 1 } 
          : item
      )
    );
  };

  // Clear cart (for checkout later)
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        addToCart, 
        removeFromCart, 
        incrementQuantity, 
        decrementQuantity, 
        clearCart          
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart easily
export const useCart = () => useContext(CartContext);