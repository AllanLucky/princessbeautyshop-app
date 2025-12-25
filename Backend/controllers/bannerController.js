import Banner from "../models/bannerModel.js";
import asyncHandler from "express-async-handler";

// CREATE BANNER
const createBanner = asyncHandler(async (req, res) => {
  const newBanner = new Banner(req.body);
  const savedBanner = await newBanner.save();

  if (!savedBanner) {
    res.status(400);
    throw new Error("Banner was not created");
  } else {
    res.status(201).json(savedBanner);
  }
});

// DELETE BANNER
const deleteBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findByIdAndDelete(req.params.id);
  if (!banner) {
    res.status(404);
    throw new Error("Banner not found");
  } else {
    res.status(200).json({ message: "Banner deleted successfully" });
  }
});

// GET ALL BANNERS
const getAllBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find();
  res.status(200).json(banners);
});

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

export { getAllBanners, createBanner, deleteBanner, getRandomBanner };
