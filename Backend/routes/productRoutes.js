import express from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getALLproducts,
  ratingProduct,
  toggleWishlist,
} from "../controllers/productController.js";

import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* =========================================================
   PUBLIC ROUTES
========================================================= */

// Get all products
router.get("/", getALLproducts);

// Get single product by ID
router.get("/find/:id", getProduct);

/* =========================================================
   USER ROUTES (Logged in users)
========================================================= */

// Rate / review product
router.post("/review/:id", protect, ratingProduct);

// Toggle wishlist
router.post("/wishlist/:id", protect, toggleWishlist);

/* =========================================================
   ADMIN ROUTES
========================================================= */

// Create product
router.post("/", protect, adminOnly, createProduct);

// Update product
router.put("/:id", protect, adminOnly, updateProduct);

// Delete product
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
