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
const PORT = process.env.PORT ||8001;

/*
=====================================================
SAFE SERVICE EXECUTION WRAPPER
=====================================================
*/

const safeExecute = async (serviceName, fn) => {
  try {
    console.log(`[${new Date().toISOString()}] ▶ Running service: ${serviceName}`);
    await fn();
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Service error (${serviceName}):`, error.message);
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
  ORDER LIFECYCLE EMAILS (every 5 minutes)
  -------------------------------------------------
  */
  cron.schedule(
    "*/5 * * * *",
    async () => {
      await safeExecute("WelcomeEmail", sendWelcomeEmail);
      await safeExecute("PendingOrderEmail", sendPendingOrderEmail);
      await safeExecute("ConfirmedOrderEmail", sendConfirmedOrderEmail);
      await safeExecute("ProcessingOrderEmail", sendProcessingOrderEmail);
      await safeExecute("ShippedOrderEmail", sendShippedOrderEmail);
      await safeExecute("DeliveredOrderEmail", sendDeliveredOrderEmail);
      await safeExecute("CancelledOrderEmail", sendCancelledOrderEmail);
      await safeExecute("TimetableEmail", sendTimetableEmail);
    },
    { timezone: "Africa/Nairobi" }
  );

  /*
  -------------------------------------------------
  SKINCARE REMINDERS
  -------------------------------------------------
  */

  // Morning reminders (5:00 AM EAT)
  cron.schedule(
    "0 5 * * *",
    async () => {
      console.log(`[${new Date().toISOString()}] 🌅 Starting morning skincare reminders...`);
      await safeExecute("MorningReminder", () => sendSkincareReminder("morning"));
    },
    { timezone: "Africa/Nairobi" }
  );

  // Evening reminders (7:00 PM EAT)
  cron.schedule(
    "0 19 * * *",
    async () => {
      console.log(`[${new Date().toISOString()}] 🌙 Starting evening skincare reminders...`);
      await safeExecute("EveningReminder", () => sendSkincareReminder("evening"));
    },
    { timezone: "Africa/Nairobi" }
  );

  /*
  -------------------------------------------------
  PROMOTIONAL EMAILS
  -------------------------------------------------
  */

  // Friday 5:30 AM EAT (Weekly promotion blast)
  cron.schedule(
    "30 5 * * 5",
    async () => {
      await safeExecute("PromotionEmail", sendPromotionEmail);
    },
    { timezone: "Africa/Nairobi" }
  );
};

/*
=====================================================
BOOTSTRAP SERVICES
=====================================================
*/

const startServer = async () => {
  try {
    await dbConnection();

    // Start cron services
    services();

    // Analytics cleanup wrapped in safeExecute
    await safeExecute("AnalyticsCleanup", scheduleAnalyticsCleanup);

    app.listen(PORT, () => {
      console.log(`[${new Date().toISOString()}] 🚀 Background service running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Server bootstrap error:`, error.message);
    process.exit(1);
  }
};

startServer();
