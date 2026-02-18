import express from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getALLproducts,
  ratingProduct,
  toggleWishlist,
  getProductReviews,
  getProductWishlist,
} from "../controllers/productController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ================= PUBLIC ROUTES =================
router.get("/", getALLproducts);
router.get("/find/:id", getProduct);

// ================= USER ROUTES =================
router.post("/review/:id", protect, ratingProduct);
router.post("/wishlist/:id", protect, toggleWishlist);

// ================= ADMIN PRODUCT MANAGEMENT =================
router.post("/", protect, adminOnly, createProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

// ================= ADMIN EXTRA ROUTES =================

// Get all reviews of a product
router.get("/reviews/:id", protect, adminOnly, getProductReviews);

// Get all users who wishlisted product
router.get("/wishlist-users/:id", protect, adminOnly, getProductWishlist);

export default router;