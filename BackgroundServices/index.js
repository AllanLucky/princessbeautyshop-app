// src/index.js — Main Cron Service File (Testing Every 5 Minutes)

import express from "express";
import dotenv from "dotenv";
import dbConnection from "./config/dbConfig.js";
import cron from "node-cron";

import sendWelcomeEmail from "./EmailServices/sendWelcomeEmail.js";
import sendPendingOrderEmail from "./EmailServices/sendPendingOrderEmail.js";
import sendDeliveredOrderEmail from "./EmailServices/sendDeliveredOrderEmail.js";
import sendPromotionEmail from "./EmailServices/sendPromotionEmail.js";
import sendTimetableEmail from "./EmailServices/sendTimetabeEmail.js"; 
import { scheduleAnalyticsCleanup } from "./EmailServices/clearAnalytics.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8001;

/**
 * Schedule recurring email services every 5 minutes for testing
 */
const scheduleEmailServices = () => {
  console.log("🕒 Scheduling recurring email services (every 5 minutes for testing)...");

  cron.schedule("*/5 * * * *", async () => {
    console.log(`🕒 Running email batch at ${new Date().toISOString()}`);

    try {
      await sendWelcomeEmail();
      await sendPendingOrderEmail();
      await sendDeliveredOrderEmail(); // rate-limited
      await sendTimetableEmail();
    } catch (error) {
      console.error("❌ Error running email services:", error.message);
    }
  });
};

/**
 * Schedule weekly promotion emails (unchanged)
 */
const schedulePromotionEmails = () => {
  // Every Friday at 5:30 AM (unchanged)
  cron.schedule("30 5 * * 5", async () => {
    console.log(`🕒 Running promotion email batch at ${new Date().toISOString()}`);

    try {
      await sendPromotionEmail();
    } catch (error) {
      console.error("❌ Error sending promotion emails:", error.message);
    }
  });
};

/**
 * Start database and all background services
 */
const startBackgroundServices = () => {
  dbConnection()
    .then(() => console.log("✅ Database connected successfully"))
    .catch((err) => console.error("❌ Database connection failed:", err.message));

  scheduleEmailServices();
  schedulePromotionEmails();
  scheduleAnalyticsCleanup();

  const server = app.listen(PORT, () => {
    console.log(`🚀 Background services running on port ${PORT}`);
  });

  // Graceful shutdown
  const shutdown = () => {
    console.log("🛑 Shutting down background services...");
    server.close(() => {
      console.log("✅ Server closed");
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

// Launch all services
startBackgroundServices();