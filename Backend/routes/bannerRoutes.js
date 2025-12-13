import express from "express";
import { createBanner, deleteBanner, getAllBanners, getSingleBanner } from "../controllers/bannerController.js";
const router = express.Router();

// CREATE BANNER
router.post("/", createBanner);
// GET ALL BANNERS

router.get("/", getAllBanners);

// GET SINGLE BANNER
router.get("/:id", getSingleBanner);

// DELETE BANNER
router.delete("/:id", deleteBanner);


export default router;