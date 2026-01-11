import { loginStart, loginSuccess, loginFailure } from "./adminRedux";
import { adminRequest } from "./requestMethods";

export const loginAdmin = async (dispatch, credentials) => {
  dispatch(loginStart());
  try {
    const res = await adminRequest.post("/auth/login", credentials);

    // Check backend response
    console.log("Login response:", res.data);

    // Adjust if backend wraps user object inside "user"
    const adminData = res.data.user || res.data;

    if (adminData.role !== "admin") {
      throw new Error("You are not an admin");
    }

    dispatch(loginSuccess(adminData));
    return adminData;
  } catch (err) {
    dispatch(loginFailure());
    console.error("Admin login failed:", err);
    throw err;
  }
};
