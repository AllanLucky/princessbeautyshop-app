import rateLimit from "express-rate-limit";

// ================= GLOBAL LIMIT =================
// protect entire API from spam
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 500, // max requests per IP
  message: "Too many requests from this IP, try again later",
  standardHeaders: true,
  legacyHeaders: false,
});


// ================= LOGIN LIMIT =================
export const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 5, // only 5 login attempts
  message: "Too many login attempts. Try again in 10 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
});


// ================= REGISTER LIMIT =================
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: "Too many accounts created from this IP, try later",
});


// ================= VERIFY EMAIL LIMIT =================
export const verifyLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 6,
  message: "Too many verification attempts. Try again later.",
});


// ================= FORGOT PASSWORD LIMIT =================
export const forgotLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 3,
  message: "Too many reset requests. Try again later.",
});