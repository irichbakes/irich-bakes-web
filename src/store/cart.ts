import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { OrderItem } from "@/lib/types/database";

interface CartState {
  items: OrderItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: OrderItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.product_id === item.product_id);
          let newItems: OrderItem[];
          if (existing) {
            newItems = state.items.map((i) =>
              i.product_id === item.product_id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            );
          } else {
            newItems = [...state.items, item];
          }
          return { items: newItems, isOpen: true };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.product_id !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((i) => i.product_id !== productId) };
          }
          return {
            items: state.items.map((i) =>
              i.product_id === productId ? { ...i, quantity } : i
            ),
          };
        }),

      clearCart: () => set({ items: [] }),

      getTotal: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

      getItemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: "irich-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
