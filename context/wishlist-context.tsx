"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/types/product";

type WishlistContextType = {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  
  // Load wishlist from localStorage on first render
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedWishlist = localStorage.getItem("rippa-wishlist");
      if (storedWishlist) {
        try {
          setWishlist(JSON.parse(storedWishlist));
        } catch (e) {
          console.error("Error parsing wishlist from localStorage:", e);
          localStorage.removeItem("rippa-wishlist");
        }
      }
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("rippa-wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist]);

  const addToWishlist = (product: Product) => {
    setWishlist((current) => {
      // Check if product already exists in wishlist
      if (current.some((item) => item.id === product.id)) {
        return current;
      }
      return [...current, product];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((current) => current.filter((product) => product.id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((product) => product.id === productId);
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
} 