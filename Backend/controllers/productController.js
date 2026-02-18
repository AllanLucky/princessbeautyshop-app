import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";


// ================= CREATE PRODUCT =================
const createProduct = asyncHandler(async (req, res) => {
  const newProduct = new Product({
    ...req.body,
    createdBy: req.user?._id || null,
  });

  const product = await newProduct.save();

  if (!product) {
    res.status(400);
    throw new Error("Product was not created");
  }

  res.status(201).json(product);
});


// ================= UPDATE PRODUCT =================
const updateProduct = asyncHandler(async (req, res) => {
  const updateData = { ...req.body };

  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (updateData.features) {
    product.features = updateData.features;
    delete updateData.features;
  }

  if (updateData.specifications) {
    product.specifications = updateData.specifications;
    delete updateData.specifications;
  }

  Object.keys(updateData).forEach((key) => {
    product[key] = updateData[key];
  });

  await product.save({ validateBeforeSave: true });

  res.status(200).json(product);
});


// ================= DELETE PRODUCT =================
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.status(200).json({ success: true, message: "Product deleted successfully" });
});


// ================= GET SINGLE PRODUCT =================
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("ratings.postedBy", "name email");

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  let avgRating = 0;
  const totalReviews = product.ratings.length;

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


// ================= GET ALL PRODUCTS =================
const getALLproducts = asyncHandler(async (req, res) => {
  const { new: qNew, category, brand, concern, search, sort } = req.query;

  let query = {};

  if (category) query.categories = { $in: [category] };
  if (brand) query.brand = brand;
  if (concern) query.concern = { $in: [concern] };

  if (search) {
    query.$text = { $search: search };
  }

  let productsQuery = Product.find(query);

  if (qNew) productsQuery = productsQuery.sort({ createdAt: -1 });

  if (sort === "asc") {
    productsQuery = productsQuery.sort({ discountedPrice: 1, originalPrice: 1 });
  }

  if (sort === "desc") {
    productsQuery = productsQuery.sort({ discountedPrice: -1, originalPrice: -1 });
  }

  const products = await productsQuery;

  res.status(200).json(products);
});


// ================= RATE / REVIEW PRODUCT =================
const ratingProduct = asyncHandler(async (req, res) => {
  const { star, comment } = req.body;

  if (!req.user || !req.user._id) {
    res.status(401);
    throw new Error("User not logged in");
  }

  const userId = req.user._id;

  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

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
    });
  }

  await product.save();

  const total = product.ratings.reduce((sum, r) => sum + r.star, 0);
  const avgRating = (total / product.ratings.length).toFixed(1);

  res.status(200).json({
    success: true,
    message: existingReview ? "Review updated" : "Review added",
    avgRating,
    totalReviews: product.ratings.length,
  });
});


// ================= ADMIN DELETE BAD REVIEW =================
const deleteReview = asyncHandler(async (req, res) => {
  const { productId, reviewId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const review = product.ratings.id(reviewId);
  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  review.deleteOne();
  await product.save();

  let avgRating = 0;
  if (product.ratings.length > 0) {
    const total = product.ratings.reduce((sum, r) => sum + r.star, 0);
    avgRating = (total / product.ratings.length).toFixed(1);
  }

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
    avgRating,
    totalReviews: product.ratings.length,
  });
});


// ================= ADD / REMOVE WISHLIST =================
const toggleWishlist = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Login required");
  }

  const userId = req.user._id;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const index = product.wishlistUsers.findIndex(
    (id) => id.toString() === userId.toString()
  );

  if (index > -1) {
    product.wishlistUsers.splice(index, 1);
    await product.save();
    return res.json({ success: true, message: "Removed from wishlist" });
  }

  product.wishlistUsers.push(userId);
  await product.save();

  res.json({ success: true, message: "Added to wishlist" });
});


// ================= USER GET MY WISHLIST =================
const getMyWishlist = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Login required");
  }

  const userId = req.user._id;

  const products = await Product.find({
    wishlistUsers: { $in: [userId] },
  });

  res.status(200).json({
    success: true,
    count: products.length,
    wishlist: products,
  });
});


// ================= ADMIN GET ALL REVIEWS =================
const getProductReviews = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("ratings.postedBy", "name email");

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.status(200).json({
    success: true,
    reviews: product.ratings.map((r) => ({
      _id: r._id,
      name: r.postedBy?.name || "User",
      email: r.postedBy?.email || "",
      star: r.star,
      comment: r.comment,
      createdAt: r.createdAt,
    })),
  });
});


// ================= ADMIN GET WISHLIST USERS =================
const getProductWishlist = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("wishlistUsers", "name email");

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.status(200).json({
    success: true,
    users: product.wishlistUsers.map((user) => ({
      _id: user._id,
      name: user.name,
      email: user.email,
    })),
    productId: product._id,
    title: product.title,
  });
});


// ================= EXPORT =================
export {
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getALLproducts,
  ratingProduct,
  toggleWishlist,
  deleteReview,
  getProductReviews,
  getProductWishlist,
  getMyWishlist,
};