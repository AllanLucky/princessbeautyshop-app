import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";

// ========================
// CREATE PRODUCT
// POST /api/v1/products
// ACCESS: PRIVATE/ADMIN
// ========================
const createProduct = asyncHandler(async (req, res) => {
  const newProduct = new Product(req.body);
  const product = await newProduct.save();

  if (product) {
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } else {
    res.status(400);
    throw new Error("Failed to create product");
  }
});

// ========================
// GET ALL PRODUCTS
// GET /api/v1/products
// ACCESS: PUBLIC
// ========================
const getProducts = asyncHandler(async (req, res) => {
  const { new: qNew, category: qCategory, search: qSearch } = req.query;
  let products;

  if (qNew) {
    products = await Product.find().sort({ createdAt: -1 }).limit(5);
  } else if (qCategory) {
    products = await Product.find({
      categories: { $in: [qCategory] },
    });
  } else if (qSearch) {
    products = await Product.find({
      title: { $regex: qSearch, $options: "i" },
    });
  } else {
    products = await Product.find().sort({ createdAt: -1 });
  }

  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
});

// ========================
// GET SINGLE PRODUCT
// GET /api/v1/products/:id
// ACCESS: PUBLIC
// ========================
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.status(200).json({
      success: true,
      product,
    });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// ========================
// UPDATE PRODUCT
// PUT /api/v1/products/:id
// ACCESS: PRIVATE/ADMIN
// ========================
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  if (product) {
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } else {
    res.status(404);
    throw new Error("Product not found or could not be updated");
  }
});

// ========================
// DELETE PRODUCT
// DELETE /api/v1/products/:id
// ACCESS: PRIVATE/ADMIN
// ========================
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (product) {
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// ========================
// RATE PRODUCT
// POST /api/v1/products/:id/rate
// ACCESS: PUBLIC (or PRIVATE if login required)
// ========================
const rateProduct = asyncHandler(async (req, res) => {
  const { star, name, comment, postedBy } = req.body;

  if (!star || !name || !postedBy) {
    res.status(400);
    throw new Error("Star rating, name, and postedBy are required");
  }

  const starNumber = Number(star);
  if (isNaN(starNumber) || starNumber < 1 || starNumber > 5) {
    res.status(400);
    throw new Error("Star rating must be a number between 1 and 5");
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      $push: { rating: { star: starNumber, name, comment, postedBy } },
    },
    { new: true, runValidators: true }
  );

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.status(200).json({
    success: true,
    message: "Product rated successfully",
    product,
  });
});

export {
  createProduct, getProducts, getProductById, updateProduct, deleteProduct, rateProduct,
};






