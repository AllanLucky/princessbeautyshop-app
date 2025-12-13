import express from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/authController.js";
const router = express.Router();

// REGISTER USER ROUTE
router.post("/register", registerUser);

// LOGIN USER ROUTE
router.post("/login", loginUser);

//LOGOUT USER ROUTE
router.post("/logout", logoutUser);



export default router