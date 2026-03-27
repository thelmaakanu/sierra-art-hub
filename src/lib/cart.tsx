import { createContext, useContext, useState, ReactNode } from "react";
import { Artwork } from "./data";

interface CartContextType {
  items: Artwork[];
  addItem: (artwork: Artwork) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  currency: string;
  setCurrency: (c: string) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Artwork[]>([]);
  const [currency, setCurrency] = useState("NLE");

  const addItem = (artwork: Artwork) => {
    if (!items.find(i => i.id === artwork.id)) {
      setItems(prev => [...prev, artwork]);
    }
  };

  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id));
  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, currency, setCurrency }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}
