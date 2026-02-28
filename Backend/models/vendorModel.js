import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const vendorSchema = new mongoose.Schema(
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
      select: false,
    },

    phone: {
      type: String,
      default: "",
    },

    storeName: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    role: {
      type: String,
      enum: ["vendor"],
      default: "vendor",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/*
====================================
 PASSWORD HASHING
====================================
*/

vendorSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/*
====================================
 PASSWORD MATCH METHOD
====================================
*/

vendorSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const Vendor =
  mongoose.models.Vendor || mongoose.model("Vendor", vendorSchema);

export default Vendor;