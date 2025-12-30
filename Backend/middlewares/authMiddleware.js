import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

// Protect routes — only logged-in users
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user object to request (exclude password)
    req.user = await User.findById(decodedToken.id).select("-password");

    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, token failed");
  }
});

// Admin-only middleware — only allow admins
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403);
    throw new Error("Admin access only");
  }
};

export { protect, adminOnly };
