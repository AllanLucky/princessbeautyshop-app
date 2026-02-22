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

    // ================= UPDATE ADMIN =================
    updateAdmin: (state, action) => {
      state.currentAdmin = action.payload;
      localStorage.setItem("admin", JSON.stringify(action.payload));
    },

    // ================= DELETE ACCOUNT =================
    deleteAccountStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },

    deleteAccountSuccess: (state) => {
      state.isFetching = false;
      state.currentAdmin = null;
      state.error = false;

      // Remove admin from storage after deletion
      localStorage.removeItem("admin");
    },

    deleteAccountFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateAdmin,
  deleteAccountStart,
  deleteAccountSuccess,
  deleteAccountFailure,
} = adminSlice.actions;

export default adminSlice.reducer;