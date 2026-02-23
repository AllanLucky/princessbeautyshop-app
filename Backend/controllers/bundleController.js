import Bundle from "../models/bundleModel.js";
import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";

/*
=====================================================
HELPER FUNCTIONS
=====================================================
*/

// Safe number parser
const safeNumber = (value) => {
  return isNaN(Number(value)) ? 0 : Number(value);
};

/*
=====================================================
CREATE BUNDLE
=====================================================
*/

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

/*
=====================================================
UPDATE BUNDLE
=====================================================
*/

const updateBundle = asyncHandler(async (req, res) => {
  const updatedBundle = await Bundle.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  )
    .populate("products.productId")
    .populate("customBundleProducts");

  if (!updatedBundle) {
    res.status(404);
    throw new Error("Bundle not found");
  }

  res.status(200).json(updatedBundle);
});

/*
=====================================================
DELETE BUNDLE
=====================================================
*/

const deleteBundle = asyncHandler(async (req, res) => {
  const bundle = await Bundle.findByIdAndDelete(req.params.id);

  if (!bundle) {
    res.status(404);
    throw new Error("Bundle not found");
  }

  res.status(200).json({
    message: "Bundle deleted successfully",
  });
});

/*
=====================================================
GET SINGLE BUNDLE
=====================================================
*/

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

/*
=====================================================
GET ALL BUNDLES
=====================================================
*/

const getAllBundles = asyncHandler(async (req, res) => {
  let {
    page = 1,
    limit = 20,
    type,
    category,
    concern: skinConcern,
    skintype,
    search,
  } = req.query;

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

/*
=====================================================
CUSTOM BUNDLE CREATION
=====================================================
*/

const createCustomBundle = asyncHandler(async (req, res) => {
  const { name, description, productIds } = req.body;
  const userId = req.user?._id;

  if (!Array.isArray(productIds) || !productIds.length) {
    res.status(400);
    throw new Error("At least one product is required");
  }

  const products = await Product.find({
    _id: { $in: productIds },
  });

  if (products.length !== productIds.length) {
    res.status(400);
    throw new Error("Some products not found");
  }

  const originalPrice = products.reduce(
    (sum, p) => sum + safeNumber(p.originalPrice),
    0
  );

  const discountedPrice = products.reduce(
    (sum, p) =>
      sum + safeNumber(p.discountedPrice || p.originalPrice),
    0
  );

  const bundleProducts = products.map((product) => ({
    productId: product._id,
    title: product.title,
    desc: product.desc,
    img: product.img,
    originalPrice: safeNumber(product.originalPrice),
    discountedPrice: safeNumber(
      product.discountedPrice || product.originalPrice
    ),
    quantity: 1,
  }));

  const newBundle = new Bundle({
    name:
      name ||
      `My Custom Bundle - ${new Date().toLocaleDateString()}`,
    description: description || "Custom created bundle",
    image:
      products[0]?.img?.[0] ||
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348",
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

/*
=====================================================
EXPORTS ⭐ IMPORTANT
=====================================================
*/

export {
  createBundle,
  updateBundle,
  deleteBundle,
  getBundle,
  getAllBundles,
  createCustomBundle,
};