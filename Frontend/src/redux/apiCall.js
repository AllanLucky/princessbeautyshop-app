import { userRequest } from "../requestMethod";
import { loginFailure, loginStart, loginSuccess, logout } from "./userRedux";

// Login user
export const login = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    const res = await userRequest.post("/auth/login/", user);
    dispatch(loginSuccess(res.data)); // res.data should include currentUser info
  } catch (error) {
    dispatch(loginFailure());
    console.error("Login failed:", error.response?.data?.message || error.message);
  }
};

// Logout user
export const logoutUser = async (dispatch) => {
  try {
    // Make a request to backend to destroy the cookie / token
    await userRequest.post("/auth/logout");
  } catch (error) {
    console.error("Logout failed:", error.response?.data?.message || error.message);
  } finally {
    // Clear Redux state
    dispatch(logout());
  }
};


