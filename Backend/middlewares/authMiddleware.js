import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * Middleware to protect routes — only allow authenticated users
 */
const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies.jwt; // Get token from cookie

  if (token) {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SEC);
      req.user = await User.findById(decodedToken.userId).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, invalid token");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

/**
 * Middleware to allow only admins
 */
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


