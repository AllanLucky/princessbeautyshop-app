import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    currentAdmin: JSON.parse(localStorage.getItem("admin")) || null,
    isFetching: false,
    error: false,
  },
  reducers: {
    loginStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    loginSuccess: (state, action) => {
      state.isFetching = false;
      state.currentAdmin = action.payload;
      state.error = false;
    },
    loginFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    logOut: (state) => {
      state.currentAdmin = null;
      state.isFetching = false;
      state.error = false;
      localStorage.removeItem("admin");
      localStorage.removeItem("access_token");
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logOut } = adminSlice.actions;
export default adminSlice.reducer;
