import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";

<<<<<<< HEAD

=======
>>>>>>> 394ec64 (Updating productFeaturePage)
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

<<<<<<< HEAD

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

=======
// ================= UPDATE PRODUCT =================
const updateProduct = asyncHandler(async (req, res) => {
  const updateData = { ...req.body };

  // Merge arrays instead of overwriting
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Merge features array if provided
  if (updateData.features) {
    product.features = updateData.features;
    delete updateData.features;
  }

  // Merge specifications array if provided
  if (updateData.specifications) {
    product.specifications = updateData.specifications;
    delete updateData.specifications;
  }

  // Update the rest of the fields
  Object.keys(updateData).forEach((key) => {
    product[key] = updateData[key];
  });

  await product.save({ validateBeforeSave: true });

  res.status(200).json(product);
});
>>>>>>> 394ec64 (Updating productFeaturePage)

// ================= DELETE PRODUCT =================
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.status(200).json({ message: "Product deleted successfully" });
});

<<<<<<< HEAD

=======
>>>>>>> 394ec64 (Updating productFeaturePage)
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

<<<<<<< HEAD
  // ⭐ CALCULATE AVERAGE RATING (backend professional way)
  let avgRating = 0;
  let totalReviews = product.ratings.length;
=======
  // ⭐ CALCULATE AVERAGE RATING
  let avgRating = 0;
  const totalReviews = product.ratings.length;
>>>>>>> 394ec64 (Updating productFeaturePage)

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

<<<<<<< HEAD

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
=======
// ================= GET ALL PRODUCTS (WITH FILTER) =================
const getALLproducts = asyncHandler(async (req, res) => {
  const { new: qNew, category, brand, concern, search, sort } = req.query;

  let query = {};

  if (category) query.categories = { $in: [category] };
  if (brand) query.brand = brand;
  if (concern) query.concern = { $in: [concern] };
  if (search) query.$text = { $search: search, $caseSensitive: false, $diacriticSensitive: false };

  let productsQuery = Product.find(query);

  if (qNew) productsQuery = productsQuery.sort({ createdAt: -1 });
  if (sort === "asc") productsQuery = productsQuery.sort({ discountedPrice: 1, originalPrice: 1 });
  if (sort === "desc") productsQuery = productsQuery.sort({ discountedPrice: -1, originalPrice: -1 });
>>>>>>> 394ec64 (Updating productFeaturePage)

  const products = await productsQuery;

  res.status(200).json(products);
});

<<<<<<< HEAD

=======
>>>>>>> 394ec64 (Updating productFeaturePage)
// ================= RATE PRODUCT =================
const ratingProduct = asyncHandler(async (req, res) => {
  const { star, comment } = req.body;
  const userId = req.user._id;

  const product = await Product.findById(req.params.id);
<<<<<<< HEAD

=======
>>>>>>> 394ec64 (Updating productFeaturePage)
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

<<<<<<< HEAD
  // check if already reviewed
=======
  // Check if user already reviewed
>>>>>>> 394ec64 (Updating productFeaturePage)
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

<<<<<<< HEAD

export {
  ratingProduct,
  getALLproducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
=======
export {
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getALLproducts,
  ratingProduct,
};
>>>>>>> 394ec64 (Updating productFeaturePage)
