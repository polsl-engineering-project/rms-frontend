import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  version: number;
  addedAt: number;
}

interface CartState {
  items: CartItem[];
  expiresAt: number;
}

interface CartActions {
  addItem: (item: Omit<CartItem, 'quantity' | 'addedAt'>, quantity?: number) => void;
  removeItem: (itemId: string, version: number) => void;
  updateQuantity: (itemId: string, version: number, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (itemId: string, version: number) => number;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getCartForOrder: () => Array<{ menuItemId: string; quantity: number; version: number }>;
}

type CartStore = CartState & CartActions;

const getExpirationTime = (): number => {
  const now = new Date();
  const currentHour = now.getHours();

  // If after 11pm (23:00), expire in 1 hour
  if (currentHour >= 23) {
    return Date.now() + 60 * 60 * 1000; // 1 hour from now
  }

  // Otherwise, expire at midnight
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight.getTime();
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      expiresAt: getExpirationTime(),

      addItem: (item, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (i) => i.itemId === item.itemId && i.version === item.version
          );

          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.itemId === item.itemId && i.version === item.version
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                ...item,
                quantity,
                addedAt: Date.now(),
              },
            ],
          };
        });
      },

      removeItem: (itemId, version) => {
        set((state) => ({
          items: state.items.filter((i) => !(i.itemId === itemId && i.version === version)),
        }));
      },

      updateQuantity: (itemId, version, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId, version);
          return;
        }

        set((state) => ({
          items: state.items.map((i) =>
            i.itemId === itemId && i.version === version ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => {
        set({
          items: [],
          expiresAt: getExpirationTime(),
        });
      },

      getItemQuantity: (itemId, version) => {
        const item = get().items.find((i) => i.itemId === itemId && i.version === version);
        return item?.quantity ?? 0;
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getCartForOrder: () => {
        return get().items.map((item) => ({
          menuItemId: item.itemId,
          quantity: item.quantity,
          version: item.version,
        }));
      },
    }),
    {
      name: 'cart-storage',
      onRehydrateStorage: () => (state) => {
        // Check if cart has expired on hydration
        if (state && Date.now() > state.expiresAt) {
          state.clearCart();
        }
      },
    }
  )
);
