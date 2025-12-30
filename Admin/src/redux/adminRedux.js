import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    currentAdmin: null,
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
    },
    loginFailure: (state) => {   // ✅ This is the function you need
      state.isFetching = false;
      state.error = true;
    },
    logOut: (state) => {
      state.currentAdmin = null;
      state.isFetching = false;
      state.error = false;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logOut } = adminSlice.actions; // ✅ Named exports
export default adminSlice.reducer;
