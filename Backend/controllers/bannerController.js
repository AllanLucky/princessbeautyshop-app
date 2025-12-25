import Banner from "../models/bannerModel.js";
import asyncHandler from "express-async-handler";

/**
 * @desc    Create Banner
 * @route   POST /api/v1/banners
 * @access  Private/Admin
 */
const createBanner = asyncHandler(async (req, res) => {
  const banner = new Banner(req.body);

  const savedBanner = await banner.save();

  if (!savedBanner) {
    res.status(400);
    throw new Error("Failed to create banner");
  }

  res.status(201).json(savedBanner);
});

/**
 * @desc    Get All Banners
 * @route   GET /api/v1/banners
 * @access  Public
 */
const getAllBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find();
  res.status(200).json(banners);
});

/**
 * @desc    Get Random Banner
 * @route   GET /api/v1/banners/random
 * @access  Public
 */
const getRandomBanner = asyncHandler(async (req, res) => {
  // Efficient MongoDB way: sample one random document
  const [randomBanner] = await Banner.aggregate([{ $sample: { size: 1 } }]);

  if (!randomBanner) {
    res.status(404);
    throw new Error("No banners found");
  }

  res.status(200).json(randomBanner);
});

/**
 * @desc    Get Single Banner by ID
 * @route   GET /api/v1/banners/:id
 * @access  Public
 */
const getBannerById = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);

  if (!banner) {
    res.status(404);
    throw new Error("Banner not found");
  }

  res.status(200).json(banner);
});

/**
 * @desc    Delete Banner
 * @route   DELETE /api/v1/banners/:id
 * @access  Private/Admin
 */
const deleteBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findByIdAndDelete(req.params.id);

  if (!banner) {
    res.status(404);
    throw new Error("Banner not found");
  }

  res.status(200).json({ message: "Banner deleted successfully" });
});

export {
  createBanner,
  getAllBanners,
  getRandomBanner,
  getBannerById,
  deleteBanner,
};
