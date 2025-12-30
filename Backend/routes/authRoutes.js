import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

// REGISTER USER
router.post("/register", registerUser);

// LOGIN USER
router.post("/login", loginUser);

// LOGOUT USER
router.post("/logout", logoutUser);

// FORGOT PASSWORD
router.post("/forgotpassword", forgotPassword);

// RESET PASSWORD
router.put("/resetpassword/:resetToken", resetPassword);

export default router;
