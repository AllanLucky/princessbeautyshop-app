import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    currentAdmin: JSON.parse(localStorage.getItem("admin")) || null,
    isFetching: false,
    error: false,
  },

  reducers: {
    // ================= LOGIN START =================
    loginStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },

    // ================= LOGIN SUCCESS =================
    loginSuccess: (state, action) => {
      state.isFetching = false;
      state.currentAdmin = action.payload;
      state.error = false;

      // 🔐 persist admin
      localStorage.setItem("admin", JSON.stringify(action.payload));
    },

    // ================= LOGIN FAILURE =================
    loginFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },

    // ================= LOGOUT =================
    logout: (state) => {
      state.currentAdmin = null;
      state.isFetching = false;
      state.error = false;

      localStorage.removeItem("admin");
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = adminSlice.actions;
export default adminSlice.reducer;