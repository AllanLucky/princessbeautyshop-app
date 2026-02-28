import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
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
      index: true, // 🔥 Faster email lookups
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ["customer", "admin", "superadmin"],
      default: "customer",
      index: true, // 🔥 Faster role-based queries
    },

    avatar: {
      type: String,
      default: "",
    },

    isVerified: {
      type: Boolean,
      default: false,
      index: true, // 🔥 Faster verification checks
    },

    verificationCode: String,
    verificationCodeExpire: Date,

    // ===== PASSWORD RESET =====
    resetPasswordToken: {
      type: String,
      index: true, // 🔥 Faster reset lookups
    },
    resetPasswordExpire: Date,

    // ===== LOGIN SECURITY =====
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: Date,

    lastLogin: Date,
    lastLoginIP: String,
  },
  {
    timestamps: true,
    versionKey: false, // 🔥 Removes __v (slightly lighter docs)
  }
);

// ================= PASSWORD HASH =================
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  // 🔥 Reduced salt rounds for faster hashing (safe balance)
  const salt = await bcrypt.genSalt(8);
  this.password = await bcrypt.hash(this.password, salt);
});

// ================= MATCH PASSWORD =================
userSchema.methods.matchPassword = function (enteredPassword) {
  // 🔥 No need for async wrapper here
  return bcrypt.compare(enteredPassword, this.password);
};

// ================= ACCOUNT LOCK CHECK =================
userSchema.methods.isLocked = function () {
  return this.lockUntil && this.lockUntil > Date.now();
};

// ================= INCREASE LOGIN ATTEMPTS =================
userSchema.methods.incLoginAttempts = async function () {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    this.loginAttempts = 1;
    this.lockUntil = undefined;
  } else {
    this.loginAttempts += 1;

    if (this.loginAttempts >= 5) {
      this.lockUntil = Date.now() + 30 * 60 * 1000;
    }
  }

  return this.save({ validateBeforeSave: false });
};

// ================= RESET LOGIN ATTEMPTS =================
userSchema.methods.resetLoginAttempts = function () {
  this.loginAttempts = 0;
  this.lockUntil = undefined;

  return this.save({ validateBeforeSave: false });
};

// ================= MODEL =================
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;