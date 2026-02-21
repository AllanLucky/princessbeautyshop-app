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

    // ✅ Backend returns { success, message, user }
    const loggedInUser = res.data.user;

    if (!loggedInUser) {
      throw new Error("User data not received");
    }

    dispatch(loginSuccess(loggedInUser));

  } catch (error) {
    const message =
      error.response?.data?.message || "Login failed. Please try again.";

    dispatch(loginFailure(message));
    console.error("Login failed:", message);
  }
};


// ================= LOGOUT USER =================
export const logoutUser = async (dispatch) => {
  try {
    // Destroy cookie on backend
    await userRequest.post("/auth/logout");
  } catch (error) {
    console.error(
      "Logout failed:",
      error.response?.data?.message || error.message
    );
  } finally {
    // Always clear Redux + localStorage
    dispatch(logout());
  }
};