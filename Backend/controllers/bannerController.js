import Banner from "../models/bannerModel.js";
import asyncHandler from "express-async-handler";

/**
 * @desc    Create Banner
 * @route   POST /api/v1/banners
 * @access  Private/Admin
 */
const createBanner = asyncHandler(async (req, res) => {
  const newBanner = new Banner(req.body);
  const savedBanner = await newBanner.save();

  if (!savedBanner) {
    res.status(400);
    throw new Error("Banner was not created");
  } else {
    res.status(201).json(savedBanner);
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
  } else {
    res.status(200).json({ message: "Banner deleted successfully" });
  }
});

/**
 * @desc    Delete Banner
 * @route   DELETE /api/v1/banners/:id
 * @access  Private/Admin
 */
const deleteBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findByIdAndDelete(req.params.id);

// GET RANDOM BANNER
const getRandomBanner = asyncHandler(async (req, res) => {
  const count = await Banner.countDocuments();
  if (count === 0) {
    res.status(404);
    throw new Error("No banners found");
  } else {
    const randomIndex = Math.floor(Math.random() * count);
    const randomBanner = await Banner.findOne().skip(randomIndex);
    res.status(200).json(randomBanner);
  }
});

export {
  createBanner,
  getAllBanners,
  getRandomBanner,
  getBannerById,
  deleteBanner,
};
