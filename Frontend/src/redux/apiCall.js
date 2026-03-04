import { userRequest } from "../requestMethod";
import {
  loginFailure,
  loginStart,
  loginSuccess,
  logout,
} from "./userRedux";


// ================= LOGIN USER =================
export const login = async (dispatch, credentials) => {
  dispatch(loginStart());

  try {
    const res = await userRequest.post("/auth/login/", credentials);

    const loggedInUser = res.data?.user;

    if (!loggedInUser) {
      throw new Error("User data not received from backend");
    }

    // Update Redux state
    dispatch(loginSuccess(loggedInUser));

    // ⭐ Return backend response to frontend
    return res.data;

  } catch (error) {
    const message =
      error.response?.data?.message ||
      "Login failed. Please try again.";

    dispatch(loginFailure(message));

    console.error("Login failed:", message);

    // ⭐ Important: Throw error so Login.jsx catch block works
    throw error;
  }
};


// ================= LOGOUT USER =================
export const logoutUser = async (dispatch) => {
  try {
    await userRequest.post("/auth/logout");
  } catch (error) {
    console.error(
      "Logout failed:",
      error.response?.data?.message || error.message
    );
  } finally {
    dispatch(logout());
    localStorage.clear();
  }
};