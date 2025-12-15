// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import type { AgeKey, Plant } from "../data/plants";

// export type CartItem = {
//   slug: string;
//   age: AgeKey;
//   title: string;
//   price: number;
//   photo: string;
//   quantity: number;
// };

// type CartState = {
//   items: CartItem[];
// };

// const initialState: CartState = {
//   items: typeof window !== "undefined"
//     ? JSON.parse(localStorage.getItem("cart") || "[]")
//     : [],
// };

// const saveLS = (state: CartState) =>
//   localStorage.setItem("cart", JSON.stringify(state.items));

// const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     addItem(
//       state,
//       action: PayloadAction<{
//         plant: Plant;
//         age: AgeKey;
//         quantity: number;
//       }>
//     ) {
//       const { plant, age, quantity } = action.payload;

//       const existing = state.items.find(
//         (i) => i.slug === plant.slug && i.age === age
//       );

//       const price = Number(plant.cena[age].replace(/\D/g, ""));

//       if (existing) {
//         existing.quantity += quantity;
//       } else {
//         state.items.push({
//           slug: plant.slug,
//           age,
//           title: plant.title,
//           photo: plant.photo[age],
//           price,
//           quantity,
//         });
//       }

//       saveLS(state);
//     },

//     updateQuantity(
//       state,
//       action: PayloadAction<{ slug: string; age: AgeKey; quantity: number }>
//     ) {
//       const { slug, age, quantity } = action.payload;

//       const item = state.items.find(
//         (i) => i.slug === slug && i.age === age
//       );
//       if (!item) return;

//       item.quantity = quantity;
//       if (item.quantity <= 0) {
//         state.items = state.items.filter(
//           (i) => !(i.slug === slug && i.age === age)
//         );
//       }

//       saveLS(state);
//     },

//     clearCart(state) {
//       state.items = [];
//       saveLS(state);
//     },
//   },
// });

// export const { addItem, updateQuantity, clearCart } = cartSlice.actions;
// export default cartSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { Plant } from '../data/plants';
//Обновление актуальной цены в корзине из хардкорд даных в data/plants.ts:
import { plants } from "../data/plants";

export type CartItem = {
  slug: string;       // ключ растения
  title: string;      // название
  age: string;        // 1 год / 2 года и т.д.
  price: number;      // цена
  photo: string;      // ссылка на фото
  quantity: number;   // количество
};

type CartState = {
  items: CartItem[];
};

const initialState: CartState = {
  items: [],
};

// сохранение корзины в localStorage
const saveToLS = (items: CartItem[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cart', JSON.stringify(items));
  }
};

// восстановление корзины из localStorage
const loadFromLS = (): CartItem[] => {
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('cart');

    if (!raw) return [];

    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
      return [];
    } catch {
      return [];
    }
  }
  return [];
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // restoreCart(state) {
    //   state.items = loadFromLS();
    // },
    //Обновление актуальной цены в корзине из хардкорд даных в data/plants.ts:
    restoreCart(state) {
      const loaded = loadFromLS();
      state.items = loaded.map((item) => {
        const plant = plants[item.slug];
        if (!plant) return item; // если растения уже нет — не трогаем
        const ageKey = item.age as keyof typeof plant.cena;
        const newPriceStr = plant.cena[ageKey];
        if (!newPriceStr) return item; // если цена для такого возраста не найдена — не трогаем
        // Преобразуем "700 рубл" → 700
        const parsed = parseInt(newPriceStr.replace(/\D/g, ""), 10);
        return {
          ...item,
          price: isNaN(parsed) ? item.price : parsed, // если цена корректная — обновляем
        };
      });
    },

    addItem: (state, action: PayloadAction<CartItem>) => {
    const { slug, age, quantity, title, photo, price } = action.payload;

    const existing = state.items.find(
        (it) => it.slug === slug && it.age === age
    );

    if (existing) {
        // existing.quantity += quantity; //добавление количества к уже имеющемуся
        existing.quantity = quantity; //замена количества
    } else {
        state.items.push({
        slug,
        age,
        quantity,
        title,
        photo,
        price, // тут уже число
        });
    }

    saveToLS(state.items);
    },


    updateQuantity(
      state,
      action: PayloadAction<{ slug: string; age: string; qty: number }>
    ) {
      const { slug, age, qty } = action.payload;

      const item = state.items.find((i) => i.slug === slug && i.age === age);
      if (!item) return;

      item.quantity = Math.max(0, Math.min(1000, qty));

      saveToLS(state.items);
    },

    removeItem(
      state,
      action: PayloadAction<{ slug: string; age: string }>
    ) {
      state.items = state.items.filter(
        (i) => !(i.slug === action.payload.slug && i.age === action.payload.age)
      );
      saveToLS(state.items);
    },

    clearCart(state) {
      state.items = [];
      saveToLS(state.items);
    },
  },
});

export const { addItem, updateQuantity, removeItem, clearCart, restoreCart } = cartSlice.actions;
export default cartSlice.reducer;
