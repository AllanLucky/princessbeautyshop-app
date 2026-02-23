import mongoose from "mongoose";

const AnalyticsSchema = new mongoose.Schema(
  {
    // User information
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    userEmail: String,
    userName: String,

    // Device and browser information
    ipAddress: String,

    userAgent: String,

    deviceType: {
      type: String,
      enum: ["desktop", "mobile", "tablet", "unknown"],
      default: "unknown",
      index: true,
    },

    browser: String,
    os: String,

    // Location information
    country: String,
    city: String,
    region: String,
    timezone: String,

    // Page information
    pageUrl: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

    pageTitle: String,

    referrer: String,

    // Action information
    action: {
      type: String,
      required: true,
      index: true,
    },

    actionType: {
      type: String,
      default: "page_view",
      index: true,
    },

    // Session tracking
    sessionId: {
      type: String,
      index: true,
    },

    screenResolution: String,
    language: String,
  },
  {
    timestamps: true,
  }
);

/*
==============================
INDEX OPTIMIZATION ⭐
==============================
*/

AnalyticsSchema.index({ createdAt: -1 });
AnalyticsSchema.index({ userId: 1, createdAt: -1 });
AnalyticsSchema.index({ pageUrl: 1, createdAt: -1 });

const Analytics = mongoose.model("Analytics", AnalyticsSchema);

export default Analytics;