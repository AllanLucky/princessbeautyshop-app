import { loginStart, loginSuccess, loginFailure } from "./adminRedux";
import { userRequest } from "../requestMethods";

// Login Admin
export const loginAdmin = async (dispatch, adminCredentials) => {
  dispatch(loginStart());

  try {
    const res = await userRequest.post("/auth/login", adminCredentials);

    // Ensure admin role
    if (res.data.role !== "admin") {
      dispatch(loginFailure());
      return { error: "Access denied. Admin only." };
    }

    // Store admin with token inside
    const adminData = {
      ...res.data,
      access_token: res.data.access_token,
    };

    dispatch(loginSuccess(adminData));
    localStorage.setItem("admin", JSON.stringify(adminData));

    return { success: true };
  } catch (err) {
    dispatch(loginFailure());
    return { error: err.response?.data?.message || "Login failed" };
  }
};


// Update Admin Credentials
export const updateAdminCredentials = async (dispatch, adminId, updatedData) => {
  try {
    const res = await userRequest.put(`/users/${adminId}`, updatedData);

    return { success: true, data: res.data };
  } catch (err) {
    return { 
      success: false, 
      error: err.response?.data?.message || "Update failed" 
    };
  }
};
