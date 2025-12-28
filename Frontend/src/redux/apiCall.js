import { loginStart, loginSuccess, loginFailure, logOut } from "./userRedux";
import { userRequest } from "../requestMethod";

export const login = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    const res = await userRequest.post("/auth/login", user);
    dispatch(loginSuccess(res.data));
  } catch (err) {
    dispatch(loginFailure());
    console.error(err.response?.data?.message || err.message);
  }
};

// Optional: logout from backend and clear redux state
export const logoutUser = async (dispatch) => {
  try {
    await userRequest.post("/auth/logout");
  } catch (err) {
    console.error(err.response?.data?.message || err.message);
  } finally {
    dispatch(logOut());
  }
};
