import mongoose from "mongoose";
<<<<<<< HEAD

const ProductSchema = mongoose.Schema(
  {
    // ===== BASIC INFO =====
    title: {
=======
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
>>>>>>> 394ec64 (Updating productFeaturePage)
      type: String,
      required: true,
      trim: true,
    },

<<<<<<< HEAD
    // 🔥 SHORT DESCRIPTION (card/product list)
    desc: {
      type: String,
      required: true,
      trim: true,
    },

    // 🔥 LONG PROFESSIONAL DESCRIPTION (details page)
    longDesc: {
      type: String,
      trim: true,
    },

    // 🔥 WHAT IN BOX
    whatinbox: {
      type: String,
      trim: true,
    },

    // 🔥 FEATURES LIST
    features: [
      {
        type: String,
        trim: true,
      },
    ],

    // 🔥 SPECIFICATIONS
    specifications: [
      {
        key: { type: String, trim: true },
        value: { type: String, trim: true },
      },
    ],

    // ===== MEDIA =====
    img: {
      type: [String],
      required: true,
    },

    video: String,

    // ===== WHOLESALE =====
    wholesalePrice: Number,
    wholesaleMinimumQuantity: Number,

    // ===== CATEGORY =====
    categories: [String],
    concern: [String],
    skintype: [String],

    brand: {
      type: String,
      trim: true,
    },

    // ===== PRICES =====
    originalPrice: Number,
    discountedPrice: Number,

    // ===== STOCK SYSTEM 🔥 =====
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    inStock: {
      type: Boolean,
      default: true,
    },

    // ===== RATINGS =====
    ratings: [
      {
        star: { type: Number, required: true },
        name: { type: String, trim: true },
        comment: { type: String, trim: true },
        postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
=======
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
>>>>>>> 394ec64 (Updating productFeaturePage)
  },
  {
    timestamps: true,
  }
);

<<<<<<< HEAD

// 🔥 AUTO UPDATE STOCK STATUS

ProductSchema.pre("save", function (next) {
  this.inStock = this.stock > 0;
  next();
});


// 🔥 ALSO UPDATE WHEN USING findByIdAndUpdate

ProductSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  if (update.stock !== undefined) {
    update.inStock = update.stock > 0;
  }

  next();
});


// 🔥 FULL TEXT SEARCH
ProductSchema.index({ "$**": "text" });


const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
=======
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
>>>>>>> 394ec64 (Updating productFeaturePage)
