import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = mongoose.Schema(
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
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    address: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    role: {
      type: String,
      enum: ["user", "admin", "super_admin"],
      default: "user",
    },

    status: {
      type: Number,
      default: 0,
    },

    // ================= EMAIL VERIFICATION =================
    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationCode: {
      type: String,
    },

    verificationCodeExpire: {
      type: Date,
    },

    // ================= RESET PASSWORD =================
    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpire: {
      type: Date,
    },

    // ================= SECURITY =================
    loginAttempts: {
      type: Number,
      default: 0,
    },

    lockUntil: Date,
  },
  {
    timestamps: true,
  }
);


// ================= HASH PASSWORD =================
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


// ================= MATCH PASSWORD =================
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


// ================= GENERATE RESET TOKEN =================
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15min

  return resetToken;
};


// ================= ACCOUNT LOCK (SECURITY) =================
userSchema.methods.incLoginAttempts = async function () {
  if (this.lockUntil && this.lockUntil > Date.now()) {
    return;
  }

  this.loginAttempts += 1;

  // lock after 5 failed
  if (this.loginAttempts >= 5) {
    this.lockUntil = Date.now() + 30 * 60 * 1000; // lock 30min
  }

  await this.save();
};

userSchema.methods.resetLoginAttempts = async function () {
  this.loginAttempts = 0;
  this.lockUntil = undefined;
  await this.save();
};


const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;