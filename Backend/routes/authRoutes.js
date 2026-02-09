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

const router = express.Router();

// REGISTER
router.post("/register", registerLimiter, registerUser);

// VERIFY EMAIL
router.post("/verify-email", verifyLimiter, verifyEmailCode);

// RESEND CODE
router.post("/resend-code", verifyLimiter, resendVerificationCode);

// LOGIN
router.post("/login", loginLimiter, loginUser);

// LOGOUT
router.post("/logout", logoutUser);

// FORGOT PASSWORD
router.post("/forgotpassword", forgotLimiter, forgotPassword);

// RESET PASSWORD
router.put("/resetpassword/:resetToken", forgotLimiter, resetPassword);

export default router;