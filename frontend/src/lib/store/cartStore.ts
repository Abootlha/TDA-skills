import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  type?: 'test' | 'course' | 'nvq';
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  setItems: (items: CartItem[]) => void;
}

const syncWithRedis = (items: CartItem[]) => {
  // Safe check for browser environment
  if (typeof window === 'undefined') return;

  let sessionId = localStorage.getItem("tda_checkout_session");
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem("tda_checkout_session", sessionId);
  }

  axios.post("http://localhost:8080/api/v1/checkout/draft", { cartItems: items }, {
    headers: {
      "Content-Type": "application/json",
      "X-Session-ID": sessionId
    }
  }).catch(err => console.error("Failed to save cart to Redis:", err));
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const state = get();
        if (state.items.find(i => i.id === item.id)) {
          return;
        }
        if (state.items.length >= 4) {
          alert("You can only book up to 4 tests at a time.");
          return;
        }
        const newItems = [...state.items, item];
        set({ items: newItems });
        syncWithRedis(newItems);
      },
      removeItem: (id) => {
        const state = get();
        const newItems = state.items.filter(i => i.id !== id);
        set({ items: newItems });
        syncWithRedis(newItems);
      },
      clearCart: () => {
        set({ items: [] });
        syncWithRedis([]);
      },
      setItems: (items) => {
        set({ items });
      }
    }),
    {
      name: 'tda-cart-storage',
    }
  )
);

