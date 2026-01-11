import { loginStart, loginSuccess, loginFailure } from "./adminRedux";
import { publicRequest } from "./requestMethods";

// Login Admin
export const loginAdmin = async (dispatch, adminCredentials) => {
  dispatch(loginStart());
  try {
    const res = await publicRequest.post("/auth/login", adminCredentials);

    // Only allow admin
    if (res.data.role !== "admin") {
      dispatch(loginFailure());
      return { error: "Access denied. Admin only." };
    }

    dispatch(loginSuccess(res.data));
    localStorage.setItem("admin", JSON.stringify(res.data));
    if (res.data.access_token) {
      localStorage.setItem("access_token", res.data.access_token);
    }

    return { success: true };
  } catch (err) {
    dispatch(loginFailure());
    return { error: err.response?.data?.message || "Login failed" };
  }
};

// Update Admin Credentials (Email & Password)
export const updateAdminCredentials = async (dispatch, adminId, credentials) => {
  try {
    // Make API call to update credentials
    const res = await publicRequest.put(`/admin/${adminId}`, credentials);

    // Update Redux and localStorage with new credentials
    dispatch(loginSuccess(res.data));
    localStorage.setItem("admin", JSON.stringify(res.data));

    return { success: true, data: res.data };
  } catch (err) {
    return { success: false, error: err.response?.data?.message || "Update failed" };
  }
};
