import { loginStart, loginSuccess, loginFailure } from "./adminRedux";
import { userRequest } from "../requestMethods";

// ================= LOGIN ADMIN =================
export const loginAdmin = async (dispatch, adminCredentials) => {
  dispatch(loginStart());

  try {
    const res = await userRequest.post("/auth/login", adminCredentials);
    console.log("LOGIN RESPONSE:", res.data);

    // 🔐 Ensure admin role (correct path)
    if (res.data.user.role !== "admin") {
      dispatch(loginFailure());
      return { error: "Access denied. Admin only." };
    }

    // store admin + token
    const adminData = {
      ...res.data.user,
      access_token: res.data.access_token,
    };

    dispatch(loginSuccess(adminData));
    localStorage.setItem("admin", JSON.stringify(adminData));

    return { success: true };

  } catch (err) {
    console.log("LOGIN ERROR:", err.response?.data);
    dispatch(loginFailure());
    return { error: err.response?.data?.message || "Login failed" };
  }
};


// ================= UPDATE ADMIN =================
export const updateAdminCredentials = async (dispatch, adminId, updatedData) => {
  try {
    const res = await userRequest.put(`/users/${adminId}`, updatedData);

    // update redux + localStorage if needed
    dispatch(loginSuccess(res.data));
    localStorage.setItem("admin", JSON.stringify(res.data));

    return { success: true, data: res.data };

  } catch (err) {
    return { 
      success: false, 
      error: err.response?.data?.message || "Update failed" 
    };
  }
};