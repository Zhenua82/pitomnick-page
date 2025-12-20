import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { plants } from "@/data/plants";

/* =========================
   Types
========================= */

export type CartItem = {
  slug: string;
  title: string;
  age: string;
  price: number;
  photo: string;
  quantity: number;
};

export type CartState = {
  items: CartItem[];
};

/* =========================
   Initial State
========================= */

const initialState: CartState = {
  items: [],
};

/* =========================
   Slice
========================= */

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    /* Восстановление корзины (данные приходят извне) */
    restoreCart(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload.map((item) => {
        const plant = plants[item.slug];
        if (!plant) return item;

        const ageKey = item.age as keyof typeof plant.cena;
        const priceStr = plant.cena[ageKey];
        if (!priceStr) return item;

        const parsedPrice = parseInt(priceStr.replace(/\D/g, ""), 10);

        return {
          ...item,
          price: Number.isNaN(parsedPrice) ? item.price : parsedPrice,
        };
      });
    },

    addItem(state, action: PayloadAction<CartItem>) {
      const { slug, age, quantity } = action.payload;

      const existing = state.items.find(
        (i) => i.slug === slug && i.age === age
      );

      if (existing) {
        existing.quantity = quantity;
      } else {
        state.items.push(action.payload);
      }
    },

    updateQuantity(
      state,
      action: PayloadAction<{ slug: string; age: string; qty: number }>
    ) {
      const { slug, age, qty } = action.payload;

      const item = state.items.find(
        (i) => i.slug === slug && i.age === age
      );
      if (!item) return;

      item.quantity = Math.max(0, Math.min(1000, qty));
    },

    removeItem(
      state,
      action: PayloadAction<{ slug: string; age: string }>
    ) {
      state.items = state.items.filter(
        (i) =>
          !(
            i.slug === action.payload.slug &&
            i.age === action.payload.age
          )
      );
    },

    clearCart(state) {
      state.items = [];
    },
  },
});

export const {
  addItem,
  updateQuantity,
  removeItem,
  clearCart,
  restoreCart,
} = cartSlice.actions;

export default cartSlice.reducer;
