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

// RATING PRODUCT
const ratingProduct = asyncHandler(async (req, res) => {
  const { star, comment } = req.body;

  if (!star) {
    res.status(400);
    throw new Error("Rating must be provided");
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    { $push: { ratings: { star, comment, postedBy: req.user._id, name: req.user.name } } },
    { new: true }
  );

  if (!updatedProduct) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.status(200).json(updatedProduct);
});



export {
  ratingProduct,
  getALLproducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
