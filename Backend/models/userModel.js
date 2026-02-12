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
<<<<<<< HEAD
      trim: true,
=======
>>>>>>> 394ec647ed6702b78cfac3a11951ae5e12d7ea0d
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
<<<<<<< HEAD
      select: false, 
    },

   
    role: {
      type: String,
      enum: ["customer", "admin", "superadmin"],
      default: "customer",
    },

    
=======
      select: false,
    },

    // ✅ Role enum with default customer
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },

    // ================= EMAIL VERIFICATION =================
>>>>>>> 394ec647ed6702b78cfac3a11951ae5e12d7ea0d
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: String,
    verificationCodeExpire: Date,

<<<<<<< HEAD
    // ===== PASSWORD RESET =====
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    // ===== LOGIN SECURITY =====
=======
    // ================= RESET PASSWORD =================
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    // ================= LOGIN SECURITY =================
>>>>>>> 394ec647ed6702b78cfac3a11951ae5e12d7ea0d
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
<<<<<<< HEAD
    // lock expired, reset attempts
=======
>>>>>>> 394ec647ed6702b78cfac3a11951ae5e12d7ea0d
    this.loginAttempts = 1;
    this.lockUntil = undefined;
  } else {
    this.loginAttempts += 1;

<<<<<<< HEAD
    // lock account if attempts exceed limit
=======
>>>>>>> 394ec647ed6702b78cfac3a11951ae5e12d7ea0d
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

<<<<<<< HEAD


// ================= MODEL =================
const User = mongoose.models.User || mongoose.model("User", userSchema);
=======
const User = mongoose.model("User", userSchema);
>>>>>>> 394ec647ed6702b78cfac3a11951ae5e12d7ea0d

export default User;
