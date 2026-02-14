import ActivityLog from "../models/activityLogModel.js";

/**
 * Log user activities for audit and monitoring.
 * @param {String} userId - User performing the action
 * @param {String} action - Description of the action
 * @param {Object} req - Express request object (for IP & user-agent)
 */
const logActivity = async (userId, action, req) => {
  try {
    await ActivityLog.create({
      user: userId,
      action,
      ip: req?.ip,
      userAgent: req?.headers["user-agent"],
    });
  } catch (error) {
    console.error("Failed to log activity:", error.message);
  }
};

export default logActivity;
