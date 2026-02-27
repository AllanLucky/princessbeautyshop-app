// src/index.js — Main Cron Service File

import express from "express";
import dotenv from "dotenv";
import dbConnection from "./config/dbConfig.js";
import cron from "node-cron";
import sendWelcomeEmail from "./EmailServices/sendWelcomeEmail.js";
import sendPendingOrderEmail from "./EmailServices/sendPendingOrderEmail.js";
import sendDeliveredOrderEmail from "./EmailServices/sendDeliveredOrderEmail.js"; // rate-limited version
import sendPromotionEmail from "./EmailServices/sendPromotionEmail.js";
import sendTimetableEmail from "./EmailServices/sendTimetabeEmail.js"; 
import { scheduleAnalyticsCleanup } from "./EmailServices/clearAnalytics.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8001;

/**
 * Run scheduled email services
 */
const scheduleEmailServices = () => {
  console.log("🕒 Scheduling email services...");

  // Check for new welcome, pending, delivered, and timetable emails every 1 minute
  cron.schedule("*/1 * * * *", async () => {
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
 * Schedule weekly promotions
 */
const schedulePromotionEmails = () => {
  // Every Friday at 5:30 AM
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
 * Start background services
 */
const startBackgroundServices = () => {
  dbConnection();
  console.log(`✅ Database connected successfully`);

  scheduleEmailServices();
  schedulePromotionEmails();
  scheduleAnalyticsCleanup();

  app.listen(PORT, () => {
    console.log(`🚀 Background services running on port ${PORT}`);
  });
};

// Launch all services
startBackgroundServices();