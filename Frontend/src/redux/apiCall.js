import { loginStart, loginSuccess, loginFailure, logOut } from "./userRedux";
import { userRequest, publicRequest } from "../requestMethod"; 

// Login user
export const login = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    // Use publicRequest for login (no token needed yet)
    const res = await publicRequest.post("/auth/login", user);
    dispatch(loginSuccess(res.data)); // includes role
  } catch (err) {
    dispatch(loginFailure());
    console.error(err.response?.data?.message || err.message);
  }
};

// Logout user
export const logoutUser = async (dispatch) => {
  try {
    // Use userRequest for logout (needs token/cookie)
    await userRequest.post("/auth/logout");
  } catch (err) {
    console.error(err.response?.data?.message || err.message);
  } finally {
    dispatch(logOut());
  }
};

