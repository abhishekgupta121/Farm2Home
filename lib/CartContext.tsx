"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

interface CartItem {
  productId: any; // Populated Crop object
  quantity: number;
  _id: string;
}

interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
}

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<boolean>;
  updateQuantity: (productId: string, quantity: number) => Promise<boolean>;
  removeFromCart: (productId: string) => Promise<boolean>;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to get headers with fallback auth
  const getHeaders = () => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    
    // In a real app we'd get the JWT from cookies/localStorage. 
    // Here we pass the x-user-id header as fallback since login relies on localStorage
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user._id) {
          headers["x-user-id"] = user._id;
        }
      } catch (e) {}
    }
    return headers;
  };

  const fetchCart = async () => {
    try {
      const headers = getHeaders();
      if (!headers["x-user-id"]) {
        setLoading(false);
        return; // Not logged in
      }

      const res = await fetch("/api/cart", { headers });
      if (res.ok) {
        const data = await res.json();
        setCart(data.cart || null);
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    
    // Custom event to trigger cart fetch when user logs in
    const handleAuthChange = () => fetchCart();
    window.addEventListener("auth-changed", handleAuthChange);
    return () => window.removeEventListener("auth-changed", handleAuthChange);
  }, []);

  const addToCart = async (productId: string, quantity = 1) => {
    try {
      const headers = getHeaders();
      if (!headers["x-user-id"]) {
        toast.error("Please login to add items to cart");
        return false;
      }

      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers,
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to add to cart");
        return false;
      }

      setCart(data.cart);
      toast.success("Added to cart!");
      return true;
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Something went wrong");
      return false;
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      const res = await fetch("/api/cart/update", {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to update quantity");
        return false;
      }

      setCart(data.cart);
      return true;
    } catch (error) {
      console.error("Update quantity error:", error);
      toast.error("Something went wrong");
      return false;
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      const res = await fetch(`/api/cart/remove/${productId}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to remove item");
        return false;
      }

      setCart(data.cart);
      toast.success("Item removed");
      return true;
    } catch (error) {
      console.error("Remove from cart error:", error);
      toast.error("Something went wrong");
      return false;
    }
  };

  const clearCart = () => {
    setCart(null);
  };

  const totalItems = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;
  
  const totalPrice = cart?.items.reduce((acc, item) => {
    const price = item.productId?.pricePerKg || 0;
    return acc + (price * item.quantity);
  }, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
