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

// ==================================================
// 🔐 LOGIN ADMIN
// ==================================================
export const loginAdmin = async (dispatch, adminCredentials) => {
  dispatch(loginStart());

  try {
    const res = await userRequest.post("/auth/login", adminCredentials);

    const { user, access_token } = res.data;

    // Allow admin + super_admin
    if (!["admin", "super_admin"].includes(user.role)) {
      dispatch(loginFailure());
      return { error: "Access denied. Admin only." };
    }

    const adminData = {
      ...user,
      access_token,
    };

    dispatch(loginSuccess(adminData));

    return { success: true };

  } catch (err) {
    dispatch(loginFailure());
    return {
      error: err.response?.data?.message || "Login failed",
    };
  }
};

// ==================================================
// ✏️ UPDATE ADMIN PROFILE
// ==================================================
export const updateAdminCredentials = async (
  dispatch,
  adminId,
  updatedData
) => {
  try {
    const res = await userRequest.put(`/users/${adminId}`, updatedData);

    // Backend returns { success, message, user }
    const updatedAdmin = res.data.user;

    dispatch(updateAdmin(updatedAdmin));

    return { success: true, data: updatedAdmin };

  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.message || "Update failed",
    };
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

    return { success: true };

  } catch (err) {
    dispatch(deleteAccountFailure());

    return {
      success: false,
      error: err.response?.data?.message || "Account deletion failed",
    };
  }
};