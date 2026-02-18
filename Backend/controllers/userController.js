import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import logActivity from "../helpers/logActivity.js";

// =====================================================
// 🔐 GET MY PROFILE
// =====================================================
const getMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) throw new Error("User not found");

  res.status(200).json({
    success: true,
    user,
  });
});

// =====================================================
// ✏️ UPDATE MY PROFILE (Cloudinary ready)
// =====================================================
const updateMyProfile = asyncHandler(async (req, res) => {
  const { name, email, phone, address, avatar } = req.body; // <-- avatar added
  const user = await User.findById(req.user._id);
  if (!user) throw new Error("User not found");

  // Check email exists
  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) throw new Error("Email already in use");
    user.email = email;
  }

  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (address) user.address = address;
  if (avatar) user.avatar = avatar; // <-- save Cloudinary URL

  const updatedUser = await user.save();

  // Log activity
  await logActivity(user._id, "Updated profile", req);

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address,
      avatar: updatedUser.avatar,
      role: updatedUser.role,
    },
  });
});

// =====================================================
// 🔑 CHANGE PASSWORD
// =====================================================
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) throw new Error("Provide current and new password");

  const user = await User.findById(req.user._id).select("+password");
  if (!user) throw new Error("User not found");

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) throw new Error("Current password is incorrect");

  user.password = newPassword;
  await user.save();

  // Log activity
  await logActivity(user._id, "Changed password", req);

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});

// =====================================================
// 🖼 UPLOAD AVATAR (local storage)
// =====================================================
const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) throw new Error("Please upload image");

  const user = await User.findById(req.user._id);
  if (!user) throw new Error("User not found");

  user.avatar = `/uploads/avatars/${req.file.filename}`;
  await user.save();

  // Log activity
  await logActivity(user._id, "Updated avatar", req);

  res.status(200).json({
    success: true,
    message: "Avatar uploaded successfully",
    avatar: user.avatar,
  });
});

// =====================================================
// ❌ DELETE MY ACCOUNT
// =====================================================
const deleteMyAccount = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.user._id);
  if (!user) throw new Error("User not found");

  // Log activity
  await logActivity(req.user._id, "Deleted own account", req);

  res.status(200).json({
    success: true,
    message: "Your account deleted successfully",
  });
});

// =====================================================
// 👑 ADMIN UPDATE USER (EDIT USER PAGE)
// =====================================================
const updateUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  if (!["admin", "super_admin"].includes(req.user.role)) {
    res.status(403);
    throw new Error("Admin only can update users");
  }

  const { name, email, role, status, phone, address, password, avatar } = req.body;

  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) throw new Error("Email already exists");
    user.email = email;
  }

  if (name) user.name = name;
  if (role) user.role = role;
  if (status) user.status = status;
  if (phone) user.phone = phone;
  if (address) user.address = address;
  if (password) user.password = password;
  if (avatar) user.avatar = avatar; // <-- save Cloudinary URL

  const updatedUser = await user.save();

  await logActivity(req.user._id, `Updated user ${updatedUser._id}`, req);

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    user: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      status: updatedUser.status,
      avatar: updatedUser.avatar,
    },
  });
});

// =====================================================
// 👑 GET SINGLE USER (FOR EDIT PAGE)
// =====================================================
const getSingleUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) throw new Error("User not found");

  res.status(200).json({
    success: true,
    user,
  });
});

// =====================================================
// 👑 GET ALL USERS (ADMIN)
// =====================================================
const getAllUsers = asyncHandler(async (req, res) => {
  if (!["admin", "super_admin"].includes(req.user.role)) {
    res.status(403);
    throw new Error("Admin only access");
  }

  const users = await User.find().select("-password").sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    total: users.length,
    users,
  });
});

// =====================================================
// 👑 DELETE USER (ADMIN)
// =====================================================
const deleteUser = asyncHandler(async (req, res) => {
  if (!["admin", "super_admin"].includes(req.user.role)) {
    res.status(403);
    throw new Error("Admin only can delete users");
  }

  const deletedUser = await User.findByIdAndDelete(req.params.id);
  if (!deletedUser) throw new Error("User not found");

  await logActivity(req.user._id, `Deleted user ${deletedUser._id}`, req);

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

export {
  getMyProfile,
  updateMyProfile,
  changePassword,
  uploadAvatar,
  deleteMyAccount,
  updateUser,
  getAllUsers,
  getSingleUser,
  deleteUser,
};
