import express from "express";
import {
  createBanner,
  deleteBanner,
  getAllBanners,
  getRandomBanner,
  getBannerById,
} from "../controllers/bannerController.js";

const router = express.Router();
import {
  createBanner,
  getAllBanners,
  getRandomBanner,
  deleteBanner,
} from "../controllers/bannerController.js";

// CREATE BANNER ROUTE
router.post("/", createBanner);

// GET ALL BANNERS
router.get("/", getAllBanners);

// GET RANDOM BANNER
router.get("/random", getRandomBanner);

// GET SINGLE BANNER BY ID
router.get("/:id", getBannerById);

router.delete("/:id", deleteBanner);

export default router;
