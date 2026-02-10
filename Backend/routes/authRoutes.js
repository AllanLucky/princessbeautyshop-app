import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  verifyEmailCode,
  resendVerificationCode,
} from "../controllers/authController.js";

import {
  loginLimiter,
  registerLimiter,
  forgotLimiter,
  verifyLimiter,
} from "../middlewares/rateLimiter.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();


// =======================================================
// 🔐 AUTH ROUTES
// base: /api/v1/auth
// =======================================================


// ================= REGISTER =================
router.post("/register", registerLimiter, registerUser);

// ================= EMAIL VERIFICATION =================
router.post("/verify-email", verifyLimiter, verifyEmailCode);
router.post("/resend-code", verifyLimiter, resendVerificationCode);

// ================= LOGIN =================
router.post("/login", loginLimiter, loginUser);

// ================= LOGOUT =================
router.post("/logout", protect, logoutUser);

// ================= FORGOT PASSWORD =================
router.post("/forgotpassword", forgotLimiter, forgotPassword);

// ================= RESET PASSWORD =================
router.put("/resetpassword/:resetToken", forgotLimiter, resetPassword);


// =======================================================
// 🔒 SESSION CHECK (VERY IMPORTANT FOR FRONTEND)
// =======================================================
// use this to auto-login if cookie exists
router.get("/me", protect, async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});


export default router;