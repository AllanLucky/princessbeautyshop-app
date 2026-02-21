import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

/*
=======================================================
 PROTECT ROUTES (LOGIN REQUIRED)
=======================================================
*/

const protect = asyncHandler(async (req, res, next) => {
  try {
    let token;

    if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        message: "Not authorized, please login",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized, invalid token",
    });
  }
});

/*
=======================================================
 ADMIN ONLY
=======================================================
*/

const adminOnly = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    if (["admin", "superadmin"].includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({
      message: "Admin access only",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

/*
=======================================================
 SUPER ADMIN ONLY
=======================================================
*/

const superAdminOnly = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    if (req.user.role === "superadmin") {
      return next();
    }

    return res.status(403).json({
      message: "Super admin only",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export { protect, adminOnly, superAdminOnly };
export default protect;