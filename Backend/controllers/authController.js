import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import generateToken from "../util/generateToken.js";
import crypto from "crypto";
import sendEmail from "../util/sendEmail.js"; // <-- your email helper

// Helper: generate 6-digit verification code
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
  const hashedCode = crypto.createHash("sha256").update(verificationCode).digest("hex");

  const user = await User.create({
    name,
    email,
    password,
    role: role || "customer",
    isVerified: false,
    verificationCode: hashedCode,
    verificationCodeExpire: Date.now() + 10 * 60 * 1000, // 10 minutes
  });

  // Send verification email
  await sendEmail(
    user.email,
    "Verify Your Email",
    `Hello ${user.name},\n\nYour verification code is: ${verificationCode}\nIt expires in 10 minutes.\n\nThank you!`
  );

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
    throw new Error("Email and code are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.isVerified) {
    return res.status(200).json({
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

  res.status(200).json({
    success: true,
    message: "Email verified successfully. You can now login",
  });
});

// ================= RESEND VERIFICATION CODE =================
const resendVerificationCode = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Email is required");
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

  // Send verification email
  await sendEmail(
    user.email,
    "Resend Verification Code",
    `Hello ${user.name},\n\nYour new verification code is: ${newCode}\nIt expires in 10 minutes.\n\nThank you!`
  );

  res.status(200).json({
    success: true,
    message: "New verification code sent",
  });
});

// ================= LOGIN =================
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (!user.isVerified && user.role !== "admin") {
    res.status(403);
    throw new Error("Please verify your email first");
  }

  if (user.isLocked()) {
    res.status(403);
    throw new Error("Account locked. Try again later.");
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    await user.incLoginAttempts();
    res.status(401);
    throw new Error("Invalid email or password");
  }

  await user.resetLoginAttempts();
  user.lastLogin = new Date();
  user.lastLoginIP = req.ip;
  await user.save();

  // Include role in JWT for role-based access
  generateToken(res, user._id, user.role);

  res.status(200).json({
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

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// ================= FORGOT PASSWORD =================
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Email is required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("No user found with that email");
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  // Send password reset email
  await sendEmail(
    user.email,
    "Password Reset Request",
    `Hello ${user.name},\n\nYou requested a password reset. Click the link below or use the token:\n\n${resetUrl}\n\nThis link expires in 15 minutes.\n\nIf you did not request this, ignore this email.`
  );

  res.status(200).json({
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
    throw new Error("New password is required");
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
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
