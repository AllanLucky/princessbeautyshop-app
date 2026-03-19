import {
  loginStart,
  loginSuccess,
  loginFailure,
  deleteAccountStart,
  deleteAccountSuccess,
  deleteAccountFailure,
  updateAdmin,
} from "./adminRedux";

import { userRequest } from "../requestMethods";
import { toast } from "react-toastify";

// ==================================================
// 🔐 LOGIN ADMIN
// ==================================================
export const loginAdmin = async (dispatch, adminCredentials) => {
  dispatch(loginStart());

  try {
    const res = await userRequest.post("/auth/login", adminCredentials);
    const { user, access_token } = res.data;

    // Only allow admin + super_admin
    if (!["admin", "super_admin"].includes(user.role)) {
      dispatch(loginFailure());
      toast.error("Access denied. Admin only.");
      return { success: false, error: "Access denied. Admin only." };
    }

    const adminData = {
      ...user,
      access_token,
    };

    dispatch(loginSuccess(adminData));
    toast.success("Logged in successfully!");
    return { success: true, data: adminData };
  } catch (err) {
    dispatch(loginFailure());
    const message = err.response?.data?.message || "Login failed";
    toast.error(message);
    return { success: false, error: message };
  }
};

// ==================================================
// ✏️ UPDATE ADMIN PROFILE
// ==================================================
export const updateAdminCredentials = async (dispatch, adminId, updatedData) => {
  try {
    const res = await userRequest.put(`/users/${adminId}`, updatedData);
    const updatedAdmin = res.data.user;

    dispatch(updateAdmin(updatedAdmin));
    toast.success("Profile updated successfully!");
    return { success: true, data: updatedAdmin };
  } catch (err) {
    const message = err.response?.data?.message || "Update failed";
    toast.error(message);
    return { success: false, error: message };
  }
};

// ==================================================
// ❌ DELETE ADMIN ACCOUNT
// ==================================================
export const deleteAdminAccount = async (dispatch) => {
  dispatch(deleteAccountStart());

  try {
    await userRequest.delete("/users/delete-account");
    dispatch(deleteAccountSuccess());
    toast.success("Account deleted successfully!");
    return { success: true };
  } catch (err) {
    dispatch(deleteAccountFailure());
    const message = err.response?.data?.message || "Account deletion failed";
    toast.error(message);
    return { success: false, error: message };
  }
};