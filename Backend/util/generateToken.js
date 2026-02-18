import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

/**
 * Generate JWT token and set HTTP-only cookie
 */
const generateToken = (res, userId, role = null, options = {}) => {
  const defaultOptions = { expiresIn: "10d" };
  const tokenOptions = { ...defaultOptions, ...options };

  // ===== PAYLOAD =====
  const payload = { userId };
  if (role) payload.role = role;

  // ===== SIGN TOKEN =====
  const token = jwt.sign(payload, process.env.JWT_SECRET, tokenOptions);

  // ===== COOKIE MAX AGE =====
  const maxAge = tokenOptions.expiresIn
    ? parseJwtExpiry(tokenOptions.expiresIn)
    : 10 * 24 * 60 * 60 * 1000;

  // ===== COOKIE OPTIONS =====
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // true on production
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
    // 🔥 VERY IMPORTANT:
    // lax for localhost
    // none for production with https
    maxAge,
  };

  // ===== SET COOKIE =====
  res.cookie("jwt", token, cookieOptions);
};

/**
 * Convert expiry string → milliseconds
 */
const parseJwtExpiry = (expiresIn) => {
  const num = parseInt(expiresIn.slice(0, -1));
  const unit = expiresIn.slice(-1);

  switch (unit) {
    case "s":
      return num * 1000;
    case "m":
      return num * 60 * 1000;
    case "h":
      return num * 60 * 60 * 1000;
    case "d":
      return num * 24 * 60 * 60 * 1000;
    default:
      return 10 * 24 * 60 * 60 * 1000;
  }
};

export default generateToken;