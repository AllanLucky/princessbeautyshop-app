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
  getWishlistUsers,
  getProductWishlist
} from "../controllers/productController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// PUBLIC ROUTES
router.get("/", getALLproducts);
router.get("/find/:id", getProduct);

// USER ROUTES
router.post("/review/:id", protect, ratingProduct);
router.post("/wishlist/:id", protect, toggleWishlist);

// ADMIN ROUTES
router.post("/", protect, adminOnly, createProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

// Get all reviews for a product
router.get("/reviews/:id", protect, adminOnly, getProductReviews);

// Get all wishlist users for a product
router.get("/wishlist-users/:id", protect, adminOnly, getProductWishlist);
// ADMIN: fetch reviews & wishlist separately
router.get("/reviews/:id", protect, adminOnly, getProductReviews);
router.get("/wishlist-users/:id", protect, adminOnly, getWishlistUsers);

export default router;

