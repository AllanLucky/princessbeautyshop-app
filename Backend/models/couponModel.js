import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      default: "percentage",
    },

    discountValue: {
      type: Number,
      required: true,
      min: 1,
    },

    expiresAt: {
      type: Date,
    },

    usageLimit: {
      type: Number,
      default: 0, // 0 = unlimited
    },

    usedCount: {
      type: Number,
      default: 0,
    },

    minOrderAmount: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// ======================================
// VIRTUAL: CHECK IF COUPON IS EXPIRED
// ======================================
couponSchema.virtual("isExpired").get(function () {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
});

// ======================================
// METHOD: CHECK IF COUPON IS VALID
// ======================================
couponSchema.methods.isValidCoupon = function (orderTotal = 0) {
  if (!this.isActive) return false;

  if (this.expiresAt && new Date() > this.expiresAt) return false;

  if (this.usageLimit > 0 && this.usedCount >= this.usageLimit) return false;

  if (orderTotal < this.minOrderAmount) return false;

  return true;
};

export default mongoose.model("Coupon", couponSchema);
