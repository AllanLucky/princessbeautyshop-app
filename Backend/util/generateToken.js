import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const generateToken = (res, userId) => {
  // Create JWT
  const token = jwt.sign(
    { userId },
    process.env.JWT_SECRET, // Make sure this matches your env
    { expiresIn: "10d" }
  );

  // Set cookie options
  const cookieOptions = {
    httpOnly: true, // prevents client-side JS from accessing the cookie
    secure: process.env.NODE_ENV === "production", // only send cookie over HTTPS in production
    sameSite: "strict", // CSRF protection
    maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
  };

  res.cookie("jwt", token, cookieOptions);
};

export default generateToken;
