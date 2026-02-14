import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    ip: String,       // optional, for tracking IP
    userAgent: String, // optional, for browser/device info
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

const ActivityLog =
  mongoose.models.ActivityLog ||
  mongoose.model("ActivityLog", activityLogSchema);

export default ActivityLog;
