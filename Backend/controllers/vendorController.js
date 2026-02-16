import asyncHandler from "express-async-handler";
import Vendor from "../models/vendorModel.js";
import bcrypt from "bcryptjs";

// @desc    Create a new vendor
// @route   POST /api/vendors
// @access  Admin
export const createVendor = asyncHandler(async (req, res) => {
  const { name, email, password, storeName, phone, avatar } = req.body;

  if (!name || !email || !password || !storeName) {
    res.status(400);
    throw new Error("All required fields must be provided");
  }

  const existingVendor = await Vendor.findOne({ email });
  if (existingVendor) {
    res.status(400);
    throw new Error("Vendor with this email already exists");
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const vendor = await Vendor.create({
    name,
    email,
    password: hashedPassword,
    storeName,
    phone,
    avatar,
    createdBy: req.user._id, // admin ID from auth middleware
  });

  res.status(201).json({
    success: true,
    message: "Vendor created successfully",
    vendor: {
      id: vendor._id,
      name: vendor.name,
      email: vendor.email,
      storeName: vendor.storeName,
      phone: vendor.phone,
      avatar: vendor.avatar,
      createdBy: vendor.createdBy,
    },
  });
});

// @desc    Get all vendors
// @route   GET /api/vendors
// @access  Admin
export const getVendors = asyncHandler(async (req, res) => {
  const vendors = await Vendor.find().select("-password");
  res.json({ success: true, vendors });
});

// @desc    Get single vendor by ID
// @route   GET /api/vendors/:id
// @access  Admin
export const getVendorById = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findById(req.params.id).select("-password");

  if (!vendor) {
    res.status(404);
    throw new Error("Vendor not found");
  }

  res.json({ success: true, vendor });
});

// @desc    Update a vendor
// @route   PUT /api/vendors/:id
// @access  Admin
export const updateVendor = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findById(req.params.id);
  if (!vendor) {
    res.status(404);
    throw new Error("Vendor not found");
  }

  const { password, ...rest } = req.body;

  // Update password if provided
  if (password) {
    const salt = await bcrypt.genSalt(10);
    vendor.password = await bcrypt.hash(password, salt);
  }

  // Update other fields
  Object.assign(vendor, rest);

  await vendor.save();

  res.json({
    success: true,
    message: "Vendor updated successfully",
    vendor: {
      id: vendor._id,
      name: vendor.name,
      email: vendor.email,
      storeName: vendor.storeName,
      phone: vendor.phone,
      avatar: vendor.avatar,
      isActive: vendor.isActive,
      role: vendor.role,
      createdBy: vendor.createdBy,
    },
  });
});

// @desc    Delete a vendor
// @route   DELETE /api/vendors/:id
// @access  Admin
export const deleteVendor = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findById(req.params.id);
  if (!vendor) {
    res.status(404);
    throw new Error("Vendor not found");
  }

  await vendor.remove();
  res.json({ success: true, message: "Vendor deleted successfully" });
});
