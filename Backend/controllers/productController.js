import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";


// ================= CREATE PRODUCT =================
const createProduct = asyncHandler(async (req, res) => {
  const newProduct = new Product(req.body);
  const product = await newProduct.save();

  if (!product) {
    res.status(400);
    throw new Error("Product was not created");
  }

  res.status(201).json(product);
});


// ================= UPDATE PRODUCT =================
const updateProduct = asyncHandler(async (req, res) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );

  if (!updatedProduct) {
    res.status(400);
    throw new Error("Product not updated");
  }

  res.status(200).json(updatedProduct);
});


// ================= DELETE PRODUCT =================
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.status(200).json({ message: "Product deleted successfully" });
});


// ================= GET SINGLE PRODUCT =================
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    "ratings.postedBy",
    "name"
  );

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // ⭐ CALCULATE AVERAGE RATING (backend professional way)
  let avgRating = 0;
  let totalReviews = product.ratings.length;

  if (totalReviews > 0) {
    const total = product.ratings.reduce((sum, r) => sum + r.star, 0);
    avgRating = (total / totalReviews).toFixed(1);
  }

  res.status(200).json({
    ...product._doc,
    avgRating,
    totalReviews,
  });
});


// ================= GET ALL PRODUCTS (WITH FILTER) =================
const getALLproducts = asyncHandler(async (req, res) => {
  const {
    new: qNew,
    category,
    brand,
    concern,
    search,
    sort,
  } = req.query;

  let query = {};

  // category filter
  if (category) {
    query.categories = { $in: [category] };
  }

  // brand filter
  if (brand) {
    query.brand = brand;
  }

  // concern filter
  if (concern) {
    query.concern = { $in: [concern] };
  }

  // search filter
  if (search) {
    query.$text = {
      $search: search,
      $caseSensitive: false,
      $diacriticSensitive: false,
    };
  }

  let productsQuery = Product.find(query);

  // newest
  if (qNew) {
    productsQuery = productsQuery.sort({ createdAt: -1 });
  }

  // price sorting
  if (sort === "asc") {
    productsQuery = productsQuery.sort({ discountedPrice: 1, originalPrice: 1 });
  }

  if (sort === "desc") {
    productsQuery = productsQuery.sort({ discountedPrice: -1, originalPrice: -1 });
  }

  const products = await productsQuery;

  res.status(200).json(products);
});


// ================= RATE PRODUCT =================
const ratingProduct = asyncHandler(async (req, res) => {
  const { star, comment } = req.body;
  const userId = req.user._id;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // check if already reviewed
  const existingReview = product.ratings.find(
    (r) => r.postedBy.toString() === userId.toString()
  );

  if (existingReview) {
    existingReview.star = star;
    existingReview.comment = comment;
  } else {
    product.ratings.push({
      star,
      comment,
      postedBy: userId,
      name: req.user.name,
    });
  }

  await product.save();

  // ⭐ recalc average
  const total = product.ratings.reduce((sum, r) => sum + r.star, 0);
  const avgRating = (total / product.ratings.length).toFixed(1);

  res.status(200).json({
    message: existingReview ? "Review updated" : "Review added",
    avgRating,
    totalReviews: product.ratings.length,
  });
});


export {
  ratingProduct,
  getALLproducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};