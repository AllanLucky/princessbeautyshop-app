import { userRequest } from "../requestMethod";
import { loginFailure, loginStart, loginSuccess } from "./userRedux";

export const login = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    const res = await userRequest.post("/auth/login", user);
    dispatch(loginSuccess(res.data));
  } catch (error) {
    console.error("Login error:", error);

    // Optional: log backend message if available
    if (error.response && error.response.data?.message) {
      console.error("Backend message:", error.response.data.message);
    }

    dispatch(loginFailure());
  }
};