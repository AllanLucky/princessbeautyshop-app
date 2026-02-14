import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();

// =======================================================
// 🔐 PROTECT ROUTES (LOGIN REQUIRED)
// =======================================================
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // read token from cookie
  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, please login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      res.status(401);
      throw new Error("User not found");
    }

    // attach user to request
    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, invalid token");
  }
});

// =======================================================
// 👑 ADMIN ONLY
// =======================================================
const adminOnly = (req, res, next) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authorized");
  }

  if (req.user.role === "admin" || req.user.role === "superadmin") {
    next();
  } else {
    res.status(403);
    throw new Error("Admin access only");
  }
};

// =======================================================
// 🧠 SUPER ADMIN ONLY
// =======================================================
const superAdminOnly = (req, res, next) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authorized");
  }

  if (req.user.role === "superadmin") {
    next();
  } else {
    res.status(403);
    throw new Error("Super admin only");
  }
};

export { protect, adminOnly, superAdminOnly };
export default protect;
