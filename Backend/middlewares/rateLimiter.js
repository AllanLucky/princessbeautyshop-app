import rateLimit from "express-rate-limit";

// ================= GLOBAL LIMIT =================
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000, // increase for dev
  message: "Too many requests from this IP",
  standardHeaders: true,
  legacyHeaders: false,
});

// ================= LOGIN LIMIT =================
export const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 1000, // increase
  message: "Too many login attempts",
});

// ================= REGISTER LIMIT =================
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 1000, // increase
  message: "Too many accounts created from this IP",
});

// ================= VERIFY EMAIL LIMIT =================
export const verifyLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 1000,
  message: "Too many verification attempts",
});

// ================= FORGOT PASSWORD LIMIT =================
export const forgotLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 1000,
  message: "Too many reset requests",
});