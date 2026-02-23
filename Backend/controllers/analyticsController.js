import Analytics from "../models/analyticsModel.js";
import asyncHandler from "express-async-handler";

/*
=====================================================
HELPER FUNCTIONS
=====================================================
*/

// Safe IP extraction (proxy + VPS compatible)
const getClientIp = (req) => {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.ip ||
    "unknown"
  );
};

/*
=====================================================
CREATE ANALYTICS RECORD
=====================================================
*/

const createAnalyticsRecord = asyncHandler(async (req, res) => {
  try {
    const analyticsData = {
      ...req.body,
      ipAddress: getClientIp(req),
    };

    const newAnalytics = new Analytics(analyticsData);
    const savedAnalytics = await newAnalytics.save();

    res.status(201).json({
      success: true,
      data: savedAnalytics,
      message: "Analytics record created successfully",
    });
  } catch (error) {
    console.error("Error creating analytics record:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create analytics record",
      error: error.message,
    });
  }
});

/*
=====================================================
GET ALL ANALYTICS
=====================================================
*/

const getAllAnalytics = asyncHandler(async (req, res) => {
  try {
    let {
      page = 1,
      limit = 50,
      userId,
      actionType,
      startDate,
      endDate,
    } = req.query;

    page = Math.max(1, parseInt(page));
    limit = Math.max(1, parseInt(limit));

    const query = {};

    if (userId) query.userId = userId;
    if (actionType) query.actionType = actionType;

    if (startDate || endDate) {
      query.createdAt = {};

      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const analytics = await Analytics.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .populate("userId", "name email");

    const total = await Analytics.countDocuments(query);

    res.status(200).json({
      success: true,
      data: analytics,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalRecords: total,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics records",
      error: error.message,
    });
  }
});

/*
=====================================================
GET ANALYTICS SUMMARY
=====================================================
*/

const getAnalyticsSummary = asyncHandler(async (req, res) => {
  try {
    let { days = 7 } = req.query;

    days = Math.max(1, parseInt(days));

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const baseMatch = {
      actionType: "page_view",
      createdAt: { $gte: startDate },
    };

    // Total page views
    const totalPageViews = await Analytics.countDocuments(baseMatch);

    // Unique visitors
    const uniqueVisitors = await Analytics.distinct("ipAddress", baseMatch);

    // Most visited pages
    const popularPages = await Analytics.aggregate([
      { $match: baseMatch },
      {
        $group: {
          _id: "$pageUrl",
          visits: { $sum: 1 },
          uniqueVisitors: { $addToSet: "$ipAddress" },
        },
      },
      {
        $project: {
          pageUrl: "$_id",
          visits: 1,
          uniqueVisitors: { $size: "$uniqueVisitors" },
        },
      },
      { $sort: { visits: -1 } },
      { $limit: 10 },
    ]);

    // Device breakdown
    const deviceBreakdown = await Analytics.aggregate([
      { $match: baseMatch },
      {
        $group: {
          _id: "$deviceType",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalPageViews,
        uniqueVisitors: uniqueVisitors.length,
        popularPages,
        deviceBreakdown,
        timeRange: `${days} days`,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics summary:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics summary",
      error: error.message,
    });
  }
});

/*
=====================================================
GET USER ACTIVITY
=====================================================
*/

const getUserActivity = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20 } = req.query;

    const safeLimit = Math.max(1, parseInt(limit));

    const userActivity = await Analytics.find({ userId })
      .sort({ createdAt: -1 })
      .limit(safeLimit)
      .populate("userId", "name email");

    res.status(200).json({
      success: true,
      data: userActivity,
    });
  } catch (error) {
    console.error("Error fetching user activity:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch user activity",
      error: error.message,
    });
  }
});

export {
  createAnalyticsRecord,
  getAllAnalytics,
  getAnalyticsSummary,
  getUserActivity,
};