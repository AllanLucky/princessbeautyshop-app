import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: JSON.parse(localStorage.getItem("user")) || null,
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
      state.currentUser = action.payload;
      state.error = false;

      // persist user
      localStorage.setItem("user", JSON.stringify(action.payload));
    },

    // ================= LOGIN FAILURE =================
    loginFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },

    // ================= LOGOUT =================
    logout: (state) => {
      state.currentUser = null;
      state.isFetching = false;
      state.error = false;

      localStorage.removeItem("user");
    },

    // ================= UPDATE USER =================
    updateUser: (state, action) => {
      state.currentUser = { ...state.currentUser, ...action.payload };
      // persist updated profile
      localStorage.setItem("user", JSON.stringify(state.currentUser));
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateUser } =
  userSlice.actions;

export default userSlice.reducer;