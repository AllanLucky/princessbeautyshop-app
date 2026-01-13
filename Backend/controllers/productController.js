import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";

// CREATE PRODUCT
const createProduct = asyncHandler(async (req, res) => {
  const newProduct = new Product(req.body);
  const product = await newProduct.save();

  if (product) {
    res.status(201).json(product);
  } else {
    res.status(400);
    throw new Error("Product was not created");
  }
});

// UPDATE PRODUCT
const updateProduct = asyncHandler(async (req, res) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );

  if (!updatedProduct) {
    res.status(400);
    throw new Error("Product has not been updated");
  } else {
    res.status(200).json(updatedProduct);
  }
});

// DELETE PRODUCT
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    res.status(400);
    throw new Error("Product was not deleted");
  } else {
    res.status(200).json({ message: "Product deleted successfully" });
  }
});

// GET PRODUCT
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  } else {
    res.status(200).json(product);
  }
});

// GET ALL PRODUCTS
const getALLproducts = asyncHandler(async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  const qsearch = req.query.search;

  let products;

  if (qNew) {
    products = await Product.find().sort({ createdAt: -1 });
  } else if (qCategory) {
    products = await Product.find({ categories: { $in: [qCategory] } });
  } else if (qsearch) {
    products = await Product.find({
      $text: {
        $search: qsearch,
        $caseSensitive: false,
        $diacriticSensitive: false,
      },
    });
  } else {
    products = await Product.find().sort({ createdAt: -1 });
  }

  res.status(200).json(products);
});

// RATE PRODUCT
const ratingProduct = asyncHandler(async (req, res) => {
  const { star, comment } = req.body;
  const userId = req.user._id;

  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Check if user already reviewed
  const existingReview = product.ratings.find(
    (r) => r.postedBy.toString() === userId.toString()
  );

  if (existingReview) {
    // UPDATE existing review
    existingReview.star = star;
    existingReview.comment = comment;
  } else {
    // ADD new review
    product.ratings.push({
      star,
      comment,
      postedBy: userId,
      name: req.user.name,
    });
  }

  await product.save();

  res.status(200).json({
    message: existingReview ? "Review updated" : "Review added",
    ratings: product.ratings,
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
