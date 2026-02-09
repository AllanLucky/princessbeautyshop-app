import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";


// ================= UPDATE USER =================
const updateUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  // 🔐 allow only self or admin
  if (req.user._id.toString() !== userId && req.user.role !== "admin" && req.user.role !== "super_admin") {
    res.status(403);
    throw new Error("Not authorized to update this user");
  }

  // 🛑 prevent role/status manipulation by normal users
  if (req.user.role !== "admin" && req.user.role !== "super_admin") {
    delete req.body.role;
    delete req.body.isVerified;
    delete req.body.status;
  }

  // 🔑 hash password if updating
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


// ================= GET SINGLE USER =================
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


// ================= GET ALL USERS (ADMIN) =================
const getAllUsers = asyncHandler(async (req, res) => {

  // admin only
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


// ================= DELETE USER =================
const deleteUser = asyncHandler(async (req, res) => {

  // only admin or super admin
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
  updateUser,
  getAllUsers,
  getSingleUser,
  deleteUser
};