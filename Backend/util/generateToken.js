import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

/**
 * Generate a JWT token and set it as an HTTP-only cookie.
 *
 * @param {object} res - Express response object
 * @param {string} userId - MongoDB User ID
 * @param {string} [role] - Optional user role for quick access in JWT
 * @param {object} [options] - Optional JWT options (e.g., expiresIn)
 */
const generateToken = (res, userId, role = null, options = {}) => {
  // Default token expiry: 10 days
  const defaultOptions = { expiresIn: "10d" };
  const tokenOptions = { ...defaultOptions, ...options };

  // JWT payload
  const payload = { userId };
  if (role) payload.role = role;

  // Sign the token
  const token = jwt.sign(payload, process.env.JWT_SECRET, tokenOptions);

  // Cookie configuration
  const maxAge = tokenOptions.expiresIn
    ? parseJwtExpiry(tokenOptions.expiresIn)
    : 10 * 24 * 60 * 60 * 1000; // fallback 10 days

  const cookieOptions = {
    httpOnly: true, // prevents client-side JS from reading the cookie
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "strict", // CSRF protection
    maxAge,
  };

  // Set cookie
  res.cookie("jwt", token, cookieOptions);
};

/**
 * Convert JWT expiry string (like "10d", "2h") to milliseconds
 * @param {string} expiresIn
 * @returns {number} milliseconds
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
      return 10 * 24 * 60 * 60 * 1000; // default 10 days
  }
};

export default generateToken;
