import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import generateToken from "../util/generateToken.js";
import crypto from "crypto";

// Helper: generate 6-digit code
const generateCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// ================= REGISTER =================
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide name, email, and password");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const verificationCode = generateCode();
  const hashedCode = crypto
    .createHash("sha256")
    .update(verificationCode)
    .digest("hex");

  const user = await User.create({
    name,
    email,
    password,
    role: role || "customer", // Default role
    isVerified: false, // Default unverified
    verificationCode: hashedCode,
    verificationCodeExpire: Date.now() + 10 * 60 * 1000, // 10 minutes
  });

  console.log("Verification code:", verificationCode); // For dev/testing

  res.status(201).json({
    success: true,
    message: "Registered successfully. Verification code sent to email",
    email: user.email,
  });
});

// ================= VERIFY EMAIL =================
const verifyEmailCode = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    res.status(400);
    throw new Error("Email and verification code are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.isVerified) {
    return res.json({
      success: true,
      message: "Email already verified",
    });
  }

  const hashedCode = crypto.createHash("sha256").update(code).digest("hex");

  if (user.verificationCode !== hashedCode || user.verificationCodeExpire < Date.now()) {
    res.status(400);
    throw new Error("Invalid or expired verification code");
  }

  user.isVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpire = undefined;
  await user.save();

  res.json({
    success: true,
    message: "Email verified successfully. You can now login",
  });
});

// ================= RESEND VERIFICATION CODE =================
const resendVerificationCode = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Email required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.isVerified) {
    res.status(400);
    throw new Error("Email already verified");
  }

  const newCode = generateCode();
  const hashedCode = crypto.createHash("sha256").update(newCode).digest("hex");

  user.verificationCode = hashedCode;
  user.verificationCodeExpire = Date.now() + 10 * 60 * 1000;
  await user.save();

  console.log("New verification code:", newCode); // For dev/testing

  res.json({
    success: true,
    message: "New verification code sent",
  });
});

// ================= LOGIN =================
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password required");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Only admins can skip verification
  if (!user.isVerified && user.role !== "admin") {
    res.status(403);
    throw new Error("Please verify your email first");
  }

  // Account lock check
  if (user.isLocked()) {
    res.status(403);
    throw new Error("Account locked due to multiple failed login attempts. Try later.");
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    await user.incLoginAttempts();
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Reset failed login attempts
  await user.resetLoginAttempts();
  user.lastLogin = new Date();
  user.lastLoginIP = req.ip;
  await user.save();

  generateToken(res, user._id);

  res.json({
    success: true,
    message: "Login successful",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// ================= LOGOUT =================
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

// ================= FORGOT PASSWORD =================
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Email required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("No user found with that email");
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

  await user.save({ validateBeforeSave: false });

  const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
  console.log("Reset URL:", resetUrl);

  res.json({
    success: true,
    message: "Password reset link sent to email",
  });
});

// ================= RESET PASSWORD =================
const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  }).select("+password");

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired reset token");
  }

  const { password } = req.body;

  if (!password) {
    res.status(400);
    throw new Error("New password required");
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save({ validateBeforeSave: false });

  res.json({
    success: true,
    message: "Password reset successful. You can now login",
  });
});

export {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  verifyEmailCode,
  resendVerificationCode,
};
