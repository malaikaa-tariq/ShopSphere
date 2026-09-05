import { createSlice } from "@reduxjs/toolkit";

const storedCart = localStorage.getItem("shopsphere_cart");

const initialState = {
  items: storedCart ? JSON.parse(storedCart) : [],
};

const persist = (items) => {
  localStorage.setItem("shopsphere_cart", JSON.stringify(items));
};

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;

      const existing = state.items.find(
        (item) => item.product === product.product
      );

      if (existing) {
        existing.quantity = Math.min(
          existing.quantity + 1,
          product.stock
        );
      } else {
        state.items.push({
          ...product,
          quantity: 1,
        });
      }

      persist(state.items);
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => item.product !== action.payload
      );

      persist(state.items);
    },

    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;

      const item = state.items.find(
        (entry) => entry.product === productId
      );

      if (!item) return;

      item.quantity = Math.max(
        1,
        Math.min(quantity, item.stock)
      );

      persist(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      persist(state.items);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;