import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";


// =====================================================
// 🔐 GET MY PROFILE
// =====================================================
const getMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  res.status(200).json({
    success: true,
    user,
  });
});


// =====================================================
// ✏️ UPDATE MY PROFILE
// =====================================================
const updateMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;

  const updatedUser = await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
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

  const user = await User.findById(req.user._id);

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    res.status(400);
    throw new Error("Current password is incorrect");
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

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
// 👑 ADMIN UPDATE USER
// =====================================================
const updateUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  // allow self or admin
  if (
    req.user._id.toString() !== userId &&
    req.user.role !== "admin" &&
    req.user.role !== "super_admin"
  ) {
    res.status(403);
    throw new Error("Not authorized");
  }

  // prevent normal user editing role/status
  if (req.user.role !== "admin" && req.user.role !== "super_admin") {
    delete req.body.role;
    delete req.body.isVerified;
    delete req.body.status;
  }

  // hash password if updating
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: req.body },
    { new: true }
  ).select("-password");

  if (!updatedUser) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    user: updatedUser,
  });
});


// =====================================================
// 👑 GET SINGLE USER (ADMIN)
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
  // user
  getMyProfile,
  updateMyProfile,
  changePassword,
  uploadAvatar,
  deleteMyAccount,

  // admin
  updateUser,
  getAllUsers,
  getSingleUser,
  deleteUser
};