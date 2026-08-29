import { createSlice } from "@reduxjs/toolkit";

const saved = JSON.parse(localStorage.getItem("cart") || "[]");
const slice = createSlice({
  name: "cart",
  initialState: { items: saved },
  reducers: {
    addToCart(state, action) {
      const item = action.payload;
      const found = state.items.find(i => i.product === item.product);
      if (found) found.quantity += item.quantity || 1;
      else state.items.push({ ...item, quantity: item.quantity || 1 });
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    removeFromCart(state, action) {
      state.items = state.items.filter(i => i.product !== action.payload);
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    clearCart(state) {
      state.items = [];
      localStorage.removeItem("cart");
    }
  }
});
export const { addToCart, removeFromCart, clearCart } = slice.actions;
export default slice.reducer;
