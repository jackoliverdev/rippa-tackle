"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/types/product";

// Extend Product to include quantity for cart items
export interface CartItem extends Product {
  quantity: number;
}

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  getCartQuantity: (productId: string) => number;
  cartCount: number;
  cartTotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  
  // Load cart from localStorage on first render
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("rippa-cart");
      if (storedCart) {
        try {
          setCart(JSON.parse(storedCart));
        } catch (e) {
          console.error("Error parsing cart from localStorage:", e);
          localStorage.removeItem("rippa-cart");
        }
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("rippa-cart", JSON.stringify(cart));
    }
  }, [cart]);

  // Calculate total quantity and price whenever cart changes
  useEffect(() => {
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    
    const total = cart.reduce((acc, item) => {
      const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
      return acc + (price * item.quantity);
    }, 0);
    
    setCartCount(count);
    setCartTotal(total);
  }, [cart]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((current) => {
      // Check if product already exists in cart
      const existingIndex = current.findIndex(item => item.id === product.id);
      
      if (existingIndex !== -1) {
        // Update quantity if product already in cart
        const updatedCart = [...current];
        updatedCart[existingIndex].quantity += quantity;
        return updatedCart;
      } else {
        // Add new product to cart
        return [...current, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((current) => current.filter((product) => product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart((current) => 
      current.map((item) => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const isInCart = (productId: string) => {
    return cart.some((product) => product.id === productId);
  };

  const getCartQuantity = (productId: string) => {
    const item = cart.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        getCartQuantity,
        cartCount,
        cartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
} 