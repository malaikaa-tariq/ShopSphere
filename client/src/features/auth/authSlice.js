import { createSlice } from "@reduxjs/toolkit";

const saved = localStorage.getItem("user");
const initialState = { user: saved ? JSON.parse(saved) : null, token: localStorage.getItem("token") };

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },
    logout(state) {
      state.user = null; state.token = null;
      localStorage.removeItem("user"); localStorage.removeItem("token");
    }
  }
});
export const { setSession, logout } = slice.actions;
export default slice.reducer;
