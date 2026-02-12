import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import generateToken from "../util/generateToken.js";
import crypto from "crypto";

<<<<<<< HEAD
// Helper: generate 6-digit code
=======
// helper: generate 6 digit code
>>>>>>> 394ec647ed6702b78cfac3a11951ae5e12d7ea0d
const generateCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// ================= REGISTER =================
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    res.status(400);
<<<<<<< HEAD
    throw new Error("Please provide name, email, and password");
=======
    throw new Error("Please provide name, email and password");
>>>>>>> 394ec647ed6702b78cfac3a11951ae5e12d7ea0d
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const verificationCode = generateCode();
<<<<<<< HEAD
  const hashedCode = crypto
    .createHash("sha256")
    .update(verificationCode)
    .digest("hex");
=======
  const hashedCode = crypto.createHash("sha256").update(verificationCode).digest("hex");
>>>>>>> 394ec647ed6702b78cfac3a11951ae5e12d7ea0d

  const user = await User.create({
    name,
    email,
    password,
<<<<<<< HEAD
    role: role || "customer", // Default role
    isVerified: false, // Default unverified
    verificationCode: hashedCode,
    verificationCodeExpire: Date.now() + 10 * 60 * 1000, // 10 minutes
  });

  console.log("Verification code:", verificationCode); // For dev/testing
=======
    role: role || "customer", // ✅ default role is now 'customer'
    isVerified: false, // default false for all
    verificationCode: hashedCode,
    verificationCodeExpire: Date.now() + 10 * 60 * 1000,
  });

  console.log("Verification code:", verificationCode);
>>>>>>> 394ec647ed6702b78cfac3a11951ae5e12d7ea0d

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
<<<<<<< HEAD
    throw new Error("Email and verification code are required");
=======
    throw new Error("Email and code required");
>>>>>>> 394ec647ed6702b78cfac3a11951ae5e12d7ea0d
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

<<<<<<< HEAD
  if (user.verificationCode !== hashedCode || user.verificationCodeExpire < Date.now()) {
=======
  if (
    user.verificationCode !== hashedCode ||
    user.verificationCodeExpire < Date.now()
  ) {
>>>>>>> 394ec647ed6702b78cfac3a11951ae5e12d7ea0d
    res.status(400);
    throw new Error("Invalid or expired verification code");
  }

  user.isVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpire = undefined;
<<<<<<< HEAD
=======

>>>>>>> 394ec647ed6702b78cfac3a11951ae5e12d7ea0d
  await user.save();

  res.json({
    success: true,
    message: "Email verified successfully. You can now login",
  });
});

<<<<<<< HEAD
// ================= RESEND VERIFICATION CODE =================
=======
// ================= RESEND CODE =================
>>>>>>> 394ec647ed6702b78cfac3a11951ae5e12d7ea0d
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
<<<<<<< HEAD
  await user.save();

  console.log("New verification code:", newCode); // For dev/testing
=======

  await user.save();

  console.log("New verification code:", newCode);
>>>>>>> 394ec647ed6702b78cfac3a11951ae5e12d7ea0d

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

<<<<<<< HEAD
  // Only admins can skip verification
=======
  // 🔥 CHECK VERIFIED (skip for admins)
>>>>>>> 394ec647ed6702b78cfac3a11951ae5e12d7ea0d
  if (!user.isVerified && user.role !== "admin") {
    res.status(403);
    throw new Error("Please verify your email first");
  }

<<<<<<< HEAD
  // Account lock check
  if (user.isLocked()) {
    res.status(403);
    throw new Error("Account locked due to multiple failed login attempts. Try later.");
=======
  // 🔥 LOCK CHECK
  if (user.isLocked()) {
    res.status(403);
    throw new Error("Account locked. Try later.");
>>>>>>> 394ec647ed6702b78cfac3a11951ae5e12d7ea0d
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    await user.incLoginAttempts();
    res.status(401);
    throw new Error("Invalid email or password");
  }

<<<<<<< HEAD
  // Reset failed login attempts
=======
>>>>>>> 394ec647ed6702b78cfac3a11951ae5e12d7ea0d
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

<<<<<<< HEAD
  user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
=======
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
>>>>>>> 394ec647ed6702b78cfac3a11951ae5e12d7ea0d

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
<<<<<<< HEAD
  const hashedToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");
=======
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");
>>>>>>> 394ec647ed6702b78cfac3a11951ae5e12d7ea0d

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
