import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";


// =====================================================
// 🔐 GET MY PROFILE
// =====================================================
const getMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    success: true,
    user,
  });
});


// =====================================================
// ✏️ UPDATE MY PROFILE
// =====================================================
const updateMyProfile = asyncHandler(async (req, res) => {
  const { name, email, phone, address } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // check email exists
  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      res.status(400);
      throw new Error("Email already in use");
    }
    user.email = email;
  }

  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (address) user.address = address;

  const updatedUser = await user.save();

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

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error("Please provide current and new password");
  }

  const user = await User.findById(req.user._id).select("+password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const isMatch = await user.matchPassword(currentPassword);

  if (!isMatch) {
    res.status(400);
    throw new Error("Current password is incorrect");
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});


// =====================================================
// 🖼 UPLOAD AVATAR
// =====================================================
const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("Please upload image");
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.avatar = `/uploads/avatars/${req.file.filename}`;
  await user.save();

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

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    success: true,
    message: "Your account deleted successfully",
  });
});


// =====================================================
// 👑 ADMIN UPDATE USER  (EDIT USER PAGE)
// =====================================================
const updateUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // 🔐 Only admin/super_admin can edit any user
  if (req.user.role !== "admin" && req.user.role !== "super_admin") {
    res.status(403);
    throw new Error("Admin only can update users");
  }

  const { name, email, role, status, phone, address, password } = req.body;

  // email check
  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      res.status(400);
      throw new Error("Email already exists");
    }
    user.email = email;
  }

  if (name) user.name = name;
  if (role) user.role = role;
  if (status) user.status = status;
  if (phone) user.phone = phone;
  if (address) user.address = address;

  if (password) {
    user.password = password; // model will hash
  }

  const updatedUser = await user.save();

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

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    success: true,
    user,
  });
});


// =====================================================
// 👑 GET ALL USERS (ADMIN)
// =====================================================
const getAllUsers = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin" && req.user.role !== "super_admin") {
    res.status(403);
    throw new Error("Admin only access");
  }

  const users = await User.find()
    .select("-password")
    .sort({ createdAt: -1 });

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
  if (req.user.role !== "admin" && req.user.role !== "super_admin") {
    res.status(403);
    throw new Error("Admin only can delete users");
  }

  const deletedUser = await User.findByIdAndDelete(req.params.id);

  if (!deletedUser) {
    res.status(404);
    throw new Error("User not found");
  }

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