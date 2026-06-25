import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  type?: 'test' | 'course' | 'nvq';
  quantity?: number;
}

interface CartStore {
  items: CartItem[];
  isSidebarOpen: boolean;
  checkoutFormData: any;
  setSidebarOpen: (isOpen: boolean) => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  setItems: (items: CartItem[]) => void;
  setCheckoutFormData: (data: any) => void;
}

const syncWithRedis = (items: CartItem[], formData?: any) => {
  if (typeof window === 'undefined') return;

  let sessionId = localStorage.getItem("tda_checkout_session");
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem("tda_checkout_session", sessionId);
  }

  const payload: any = { cartItems: items };
  if (formData) {
    payload.formData = formData;
  }

  axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout/draft`, payload, {
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
      isSidebarOpen: false,
      checkoutFormData: null,
      setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
      addItem: (item) => {
        const state = get();
        if (state.items.find(i => i.id === item.id)) {
          set({ isSidebarOpen: true });
          return;
        }
        if (state.items.length >= 4) {
          alert("You can only book up to 4 tests at a time.");
          return;
        }
        const newItems = [...state.items, item];
        set({ items: newItems, isSidebarOpen: true });
        syncWithRedis(newItems, state.checkoutFormData);
      },
      removeItem: (id) => {
        const state = get();
        const newItems = state.items.filter(i => i.id !== id);
        set({ items: newItems });
        syncWithRedis(newItems, state.checkoutFormData);
      },
      clearCart: () => {
        const state = get();
        set({ items: [] });
        syncWithRedis([], state.checkoutFormData);
      },
      setItems: (items) => {
        set({ items });
      },
      setCheckoutFormData: (data) => {
        const state = get();
        set({ checkoutFormData: data });
        syncWithRedis(state.items, data);
      }
    }),
    {
      name: 'tda-cart-storage',
    }
  )
);

