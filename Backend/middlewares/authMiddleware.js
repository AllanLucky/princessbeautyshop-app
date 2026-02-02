import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();

// Protect routes — only authenticated users
const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt; // read token from cookie

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, invalid token");
  }
});

// Only admin access
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403);
    throw new Error("Admin access only");
  }
};

export default protect;
export { protect, adminOnly };
