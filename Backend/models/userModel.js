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
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    // ✅ Role enum with default customer
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
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

    // ================= LOGIN SECURITY =================
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
  }
);

// ================= PASSWORD HASH =================
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ================= MATCH PASSWORD =================
userSchema.methods.matchPassword = async function (enteredPassword) {
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
      this.lockUntil = Date.now() + 30 * 60 * 1000; // 30 mins
    }
  }

  await this.save({ validateBeforeSave: false });
};

// ================= RESET LOGIN ATTEMPTS =================
userSchema.methods.resetLoginAttempts = async function () {
  this.loginAttempts = 0;
  this.lockUntil = undefined;

  await this.save({ validateBeforeSave: false });
};

const User = mongoose.model("User", userSchema);

export default User;
