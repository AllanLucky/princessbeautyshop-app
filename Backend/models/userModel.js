import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    // ================= BASIC =================
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    // ================= AVATAR =================
    avatar: {
      type: String,
      default: "", // /uploads/filename.jpg
    },

    // ================= CONTACT =================
    address: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    // ================= ROLE =================
    role: {
      type: String,
      enum: ["user", "admin", "super_admin"],
      default: "user",
    },

    // ================= STATUS =================
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },

    // ================= EMAIL VERIFICATION =================
    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationCode: String,
    verificationCodeExpire: Date,

    // ================= RESET PASSWORD =================
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    // ================= SECURITY =================
    loginAttempts: {
      type: Number,
      default: 0,
    },

    lockUntil: Date,

    passwordChangedAt: Date,

    // ================= AUDIT =================
    lastLogin: Date,
    lastLoginIP: String,

    // ================= ACCOUNT DELETE =================
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);



// =======================================================
// 🔐 HASH PASSWORD BEFORE SAVE
// =======================================================
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  this.passwordChangedAt = Date.now();
});



// =======================================================
// 🔑 MATCH PASSWORD
// =======================================================
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};



// =======================================================
// 📩 GENERATE EMAIL VERIFICATION CODE
// =======================================================
userSchema.methods.generateVerificationCode = function () {
  const code = crypto.randomInt(100000, 999999).toString();

  this.verificationCode = crypto
    .createHash("sha256")
    .update(code)
    .digest("hex");

  this.verificationCodeExpire = Date.now() + 10 * 60 * 1000;

  return code;
};



// =======================================================
// 🔐 GENERATE RESET PASSWORD TOKEN
// =======================================================
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};



// =======================================================
// 🚫 LOGIN ATTEMPTS SECURITY (ANTI BRUTE FORCE)
// =======================================================
userSchema.methods.incLoginAttempts = async function () {
  if (this.lockUntil && this.lockUntil > Date.now()) return;

  this.loginAttempts += 1;

  if (this.loginAttempts >= 5) {
    this.lockUntil = Date.now() + 30 * 60 * 1000; // lock 30 mins
  }

  await this.save();
};

userSchema.methods.resetLoginAttempts = async function () {
  this.loginAttempts = 0;
  this.lockUntil = undefined;
  await this.save();
};



// =======================================================
// 🧠 CHECK IF ACCOUNT LOCKED
// =======================================================
userSchema.methods.isLocked = function () {
  return this.lockUntil && this.lockUntil > Date.now();
};



// =======================================================
// 🛡 SAFE EXPORT MODEL
// =======================================================
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;