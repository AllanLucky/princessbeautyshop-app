import express from "express";
import dotenv from "dotenv";
import dbConnection from "./config/dbConfig.js";
import sendWelcomeEmail from "./EmailServices/sendWelcome.js";
import sendPendingOrderEmail from "./EmailServices/sendPendingOrderEmail.js";
import sendDeliveredOrderEmail from "./EmailServices/sendDeliveredOrderEmail.js";
import sendPromotionEmail from "./EmailServices/sendPromotionEmail.js";
import cron from "node-cron";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8001;

// Helper to get last day of month
const getLastDayOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

// SCHEDULE SERVICES
const scheduleServices = () => {
  // Run welcome, pending, delivered emails every minute (for testing)
  cron.schedule('* * * * *', async () => {
    console.log("Running scheduled emails...");
    await sendWelcomeEmail();
    await sendPendingOrderEmail();
    await sendDeliveredOrderEmail();
  });

  // Promotion email on 15th at 9 AM
  cron.schedule('0 9 15 * *', async () => {
    console.log("Running promotion emails for 15th of month...");
    await sendPromotionEmail();
  });

  // Promotion email on last day of month at 9 AM
  cron.schedule('0 9 * * *', async () => {
    const today = new Date();
    if (today.getDate() === getLastDayOfMonth(today)) {
      console.log("Running promotion emails for last day of month...");
      await sendPromotionEmail();
    }
  });
};

// Connect to DB and start server
dbConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Background services running on port ${PORT}`);
      scheduleServices(); // start all cron jobs after DB connection
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err.message);
  });