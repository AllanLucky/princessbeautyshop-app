// BackgroundServices/cronService.js

import express from "express";
import dotenv from "dotenv";
import dbConnection from "./config/dbConfig.js";
import cron from "node-cron";

/*
=====================================================
EMAIL SERVICES
=====================================================
*/

import sendWelcomeEmail from "./EmailServices/sendWelcomeEmail.js";
import sendPendingOrderEmail from "./EmailServices/sendPendingOrderEmail.js";
import sendConfirmedOrderEmail from "./EmailServices/sendConfirmedOrderEmail.js";
import sendProcessingOrderEmail from "./EmailServices/sendProcessingOrderEmail.js";
import sendShippedOrderEmail from "./EmailServices/sendShippedOrderEmail.js";
import sendDeliveredOrderEmail from "./EmailServices/sendDeliveredOrderEmail.js";
import sendCancelledOrderEmail from "./EmailServices/sendCancelledOrderEmail.js";

import sendPromotionEmail from "./EmailServices/sendPromotionEmail.js";
import sendTimetableEmail from "./EmailServices/sendTimetabeEmail.js";
import sendSkincareReminder from "./EmailServices/sendingSkincareReminder.js";

import { scheduleAnalyticsCleanup } from "./EmailServices/clearAnalytics.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/*
=====================================================
SAFE SERVICE EXECUTION WRAPPER
=====================================================
*/

const safeExecute = async (serviceName, fn) => {
  try {
    console.log(`▶ Running service: ${serviceName}`);
    await fn();
  } catch (error) {
    console.error(`❌ Service error (${serviceName}):`, error.message);
  }
};

/*
=====================================================
SCHEDULE SERVICES
=====================================================
*/

const services = () => {
  /*
  -------------------------------------------------
  ORDER LIFECYCLE EMAILS
  -------------------------------------------------
  */

  cron.schedule("*/10 * * * * *", async () => {
    await safeExecute("WelcomeEmail", sendWelcomeEmail);
    await safeExecute("PendingOrderEmail", sendPendingOrderEmail);
    await safeExecute("ConfirmedOrderEmail", sendConfirmedOrderEmail);
    await safeExecute("ProcessingOrderEmail", sendProcessingOrderEmail);
    await safeExecute("ShippedOrderEmail", sendShippedOrderEmail);
    await safeExecute("DeliveredOrderEmail", sendDeliveredOrderEmail);
    await safeExecute("CancelledOrderEmail", sendCancelledOrderEmail);

    await safeExecute("TimetableEmail", sendTimetableEmail);
  });

  /*
  -------------------------------------------------
  SKINCARE REMINDERS
  -------------------------------------------------
  */

  // Morning reminders (5:00 AM EAT)
  cron.schedule("0 2 * * *", async () => {
    console.log("🌅 Starting morning skincare reminders...");
    await safeExecute("MorningReminder", () =>
      sendSkincareReminder("morning")
    );
  });

  // Evening reminders (7:00 PM EAT)
  cron.schedule("0 16 * * *", async () => {
    console.log("🌙 Starting evening skincare reminders...");
    await safeExecute("EveningReminder", () =>
      sendSkincareReminder("evening")
    );
  });

  /*
  -------------------------------------------------
  PROMOTIONAL EMAILS
  -------------------------------------------------
  */

  // Friday 5:30 AM UTC (Weekly promotion blast)
  cron.schedule("30 5 * * 5", async () => {
    await safeExecute("PromotionEmail", sendPromotionEmail);
  });
};

/*
=====================================================
BOOTSTRAP SERVICES
=====================================================
*/

const startServer = async () => {
  try {
    await dbConnection();

    services();
    scheduleAnalyticsCleanup();

    app.listen(PORT, () => {
      console.log(`🚀 Background service running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server bootstrap error:", error.message);
    process.exit(1);
  }
};

startServer();
