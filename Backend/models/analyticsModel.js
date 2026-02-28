import mongoose from "mongoose";

const AnalyticsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    userEmail: String,
    userName: String,

    ipAddress: String,

    userAgent: String,

    deviceType: {
      type: String,
      enum: ["desktop", "mobile", "tablet", "unknown"],
      default: "unknown",
    },

    browser: String,
    os: String,

    country: String,
    city: String,
    region: String,
    timezone: String,

    pageUrl: {
      type: String,
      required: true,
      trim: true,
    },

    pageTitle: String,

    referrer: String,

    action: {
      type: String,
      required: true,
    },

    actionType: {
      type: String,
      default: "page_view",
    },

    sessionId: {
      type: String,
    },

    screenResolution: String,
    language: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/*
==============================
INDEX OPTIMIZATION ⭐
==============================
*/

// Dashboard analytics queries
AnalyticsSchema.index({ createdAt: -1 });
AnalyticsSchema.index({ userId: 1, createdAt: -1 });
AnalyticsSchema.index({ pageUrl: 1, createdAt: -1 });
AnalyticsSchema.index({ action: 1, createdAt: -1 });
AnalyticsSchema.index({ deviceType: 1 });

const Analytics =
  mongoose.models.Analytics ||
  mongoose.model("Analytics", AnalyticsSchema);

export default Analytics;