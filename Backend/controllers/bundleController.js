import Bundle from "../models/bundleModel.js";
import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";
import fs from "fs";
import path from "path";

// Safe number parser
const safeNumber = (value) => (isNaN(Number(value)) ? 0 : Number(value));

/* =====================================================
CREATE BUNDLE
===================================================== */
const createBundle = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    image,
    badge,
    originalPrice,
    discountedPrice,
    products,
    categories,
    concern,
    skintype,
    isPrebuilt = true,
  } = req.body;

  // Validate products exist
  if (products?.length) {
    for (const product of products) {
      const productExists = await Product.findById(product.productId);
      if (!productExists) {
        res.status(400);
        throw new Error(`Product with ID ${product.productId} not found`);
      }
    }
  }

  const newBundle = new Bundle({
    name,
    description,
    image,
    badge,
    originalPrice: safeNumber(originalPrice),
    discountedPrice: safeNumber(discountedPrice),
    products,
    categories,
    concern,
    skintype,
    isPrebuilt,
    createdBy: isPrebuilt ? null : req.user?._id,
  });

  const savedBundle = await newBundle.save();
  res.status(201).json(savedBundle);
});

/* =====================================================
UPDATE BUNDLE
===================================================== */
const updateBundle = asyncHandler(async (req, res) => {
  const bundleId = req.params.id;
  const {
    name,
    description,
    originalPrice,
    discountedPrice,
    products,
    badge,
    categories,
    concern,
    skintype,
    isPrebuilt,
  } = req.body;

  const bundle = await Bundle.findById(bundleId);
  if (!bundle) {
    res.status(404);
    throw new Error("Bundle not found");
  }

  // Handle image upload
  if (req.file) {
    if (bundle.image) {
      const oldImagePath = path.join(process.cwd(), "uploads", bundle.image);
      fs.existsSync(oldImagePath) && fs.unlinkSync(oldImagePath);
    }
    bundle.image = req.file.filename;
  }

  // Validate and update products
  let bundleProducts = bundle.products || [];
  if (products && Array.isArray(products)) {
    bundleProducts = [];
    for (const prod of products) {
      const productExists = await Product.findById(prod.productId);
      if (!productExists) {
        res.status(400);
        throw new Error(`Product with ID ${prod.productId} not found`);
      }
      bundleProducts.push({
        productId: prod.productId,
        title: prod.title || productExists.title,
        desc: prod.desc || productExists.desc,
        img: prod.img || productExists.img,
        originalPrice: safeNumber(prod.originalPrice || productExists.originalPrice),
        discountedPrice: safeNumber(
          prod.discountedPrice || productExists.discountedPrice || productExists.originalPrice
        ),
        quantity: prod.quantity || 1,
      });
    }
  }

  // Update fields
  bundle.name = name ?? bundle.name;
  bundle.description = description ?? bundle.description;
  bundle.originalPrice = safeNumber(originalPrice ?? bundle.originalPrice);
  bundle.discountedPrice = safeNumber(discountedPrice ?? bundle.discountedPrice);
  bundle.isPrebuilt = isPrebuilt !== undefined ? isPrebuilt : bundle.isPrebuilt;
  bundle.products = bundleProducts;
  bundle.badge = badge ?? bundle.badge;
  bundle.categories = categories ?? bundle.categories;
  bundle.concern = concern ?? bundle.concern;
  bundle.skintype = skintype ?? bundle.skintype;

  const updatedBundle = await bundle.save();

  const populatedBundle = await Bundle.findById(updatedBundle._id)
    .populate("products.productId")
    .populate("customBundleProducts");

  res.status(200).json(populatedBundle);
});

/* =====================================================
DELETE BUNDLE
===================================================== */
const deleteBundle = asyncHandler(async (req, res) => {
  const bundle = await Bundle.findByIdAndDelete(req.params.id);
  if (!bundle) {
    res.status(404);
    throw new Error("Bundle not found");
  }
  res.status(200).json({ message: "Bundle deleted successfully" });
});

/* =====================================================
GET SINGLE BUNDLE
===================================================== */
const getBundle = asyncHandler(async (req, res) => {
  const bundle = await Bundle.findById(req.params.id)
    .populate("products.productId")
    .populate("customBundleProducts");

  if (!bundle) {
    res.status(404);
    throw new Error("Bundle not found");
  }

  res.status(200).json(bundle);
});

/* =====================================================
GET ALL BUNDLES
===================================================== */
const getAllBundles = asyncHandler(async (req, res) => {
  let { page = 1, limit = 20, type, category, concern: skinConcern, skintype, search } = req.query;
  page = Math.max(1, parseInt(page));
  limit = Math.max(1, parseInt(limit));

  const filter = {};
  if (type === "prebuilt") filter.isPrebuilt = true;
  if (type === "custom") filter.isPrebuilt = false;
  if (category) filter.categories = { $in: [category] };
  if (skinConcern) filter.concern = { $in: [skinConcern] };
  if (skintype) filter.skintype = { $in: [skintype] };
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const bundles = await Bundle.find(filter)
    .populate("products.productId")
    .populate("customBundleProducts")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Bundle.countDocuments(filter);

  res.status(200).json({
    data: bundles,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalRecords: total,
    },
  });
});

/* =====================================================
CREATE CUSTOM BUNDLE
===================================================== */
const createCustomBundle = asyncHandler(async (req, res) => {
  const { name, description, productIds } = req.body;
  const userId = req.user?._id;

  if (!Array.isArray(productIds) || !productIds.length) {
    res.status(400);
    throw new Error("At least one product is required");
  }

  const products = await Product.find({ _id: { $in: productIds } });
  if (products.length !== productIds.length) {
    res.status(400);
    throw new Error("Some products not found");
  }

  const originalPrice = products.reduce((sum, p) => sum + safeNumber(p.originalPrice), 0);
  const discountedPrice = products.reduce((sum, p) => sum + safeNumber(p.discountedPrice || p.originalPrice), 0);

  const bundleProducts = products.map((product) => ({
    productId: product._id,
    title: product.title,
    desc: product.desc,
    img: product.img,
    originalPrice: safeNumber(product.originalPrice),
    discountedPrice: safeNumber(product.discountedPrice || product.originalPrice),
    quantity: 1,
  }));

  const newBundle = new Bundle({
    name: name || `My Custom Bundle - ${new Date().toLocaleDateString()}`,
    description: description || "Custom created bundle",
    image: products[0]?.img?.[0] || "https://images.unsplash.com/photo-1596462502278-27bfdc403348",
    originalPrice,
    discountedPrice,
    products: bundleProducts,
    isPrebuilt: false,
    createdBy: userId,
    categories: [...new Set(products.flatMap((p) => p.categories || []))],
    concern: [...new Set(products.flatMap((p) => p.concern || []))],
    skintype: [...new Set(products.flatMap((p) => p.skintype || []))],
  });

  const savedBundle = await newBundle.save();
  res.status(201).json(savedBundle);
});

/* =====================================================
EXPORT CONTROLLERS
===================================================== */
export {
  createBundle,
  updateBundle,
  deleteBundle,
  getBundle,
  getAllBundles,
  createCustomBundle,
};