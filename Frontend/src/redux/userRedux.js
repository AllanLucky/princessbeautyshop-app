import { createSlice } from "@reduxjs/toolkit";

const storedUser = localStorage.getItem("user");

const initialState = {
  currentUser: storedUser ? JSON.parse(storedUser) : null,
  isFetching: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    // ================= LOGIN START =================
    loginStart: (state) => {
      state.isFetching = true;
      state.error = null;
    },

    // ================= LOGIN SUCCESS =================
    loginSuccess: (state, action) => {
      state.isFetching = false;
      state.error = null;

      if (!action.payload) return;

      state.currentUser = action.payload;

      localStorage.setItem("user", JSON.stringify(action.payload));
    },

    // ================= LOGIN FAILURE =================
    loginFailure: (state, action) => {
      state.isFetching = false;
      state.error = action.payload || "Login failed";
    },

    // ================= LOGOUT =================
    logout: (state) => {
      state.currentUser = null;
      state.isFetching = false;
      state.error = null;

      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },

    // ================= UPDATE USER =================
    updateUser: (state, action) => {
      if (!state.currentUser || !action.payload) return;

      state.currentUser = {
        ...state.currentUser,
        ...action.payload,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(state.currentUser)
      );
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUser,
} = userSlice.actions;

export default userSlice.reducer;