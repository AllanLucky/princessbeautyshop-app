// src/EmailServices/sendDeliveredOrderEmail.js

import ejs from "ejs";
import path from "path";
import dotenv from "dotenv";
import sendMail from "../helpers/sendMailer.js";
import Order from "../models/orderModel.js";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rate-limited batch email sender
const sendEmailsWithRateLimit = async (emails, batchSize = 5, delayMs = 1000) => {
  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async (mailOptions) => {
        try {
          await sendMail(mailOptions);
          console.log(`✅ Email sent to ${mailOptions.to}`);
        } catch (error) {
          console.error(`❌ Failed to send email to ${mailOptions.to}:`, error.message);
        }
      })
    );

    if (i + batchSize < emails.length) {
      console.log(`⏳ Waiting ${delayMs}ms before next batch...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
};

const sendDeliveredOrderEmail = async () => {
  try {
    // ✅ Find orders that are delivered but not yet notified
    const orders = await Order.find({
      orderStatus: "delivered",
      deliveredEmailSent: false,
    });

    if (!orders.length) return console.log("No delivered orders to notify.");

    const emails = [];

    for (const order of orders) {
      if (!order.email) {
        console.warn(`⚠️ Order ${order._id} has no email. Skipping...`);
        continue;
      }

      const templatePath = path.join(
        __dirname,
        "../BackgroundServices/templates/deliveredorder.ejs"
      );

      const html = await ejs.renderFile(templatePath, {
        name: order.name,
        products: order.products,
        pickupStation: order.pickupStation || "Not Specified",
        supportLink: "https://support.beautybliss.com",
      });

      emails.push({
        from: process.env.EMAIL,
        to: order.email,
        subject: "Your order has been delivered! 🎉",
        html,
      });
    }

    // Send emails in batches
    await sendEmailsWithRateLimit(emails, 5, 1000);

    // Mark deliveredEmailSent = true for all processed orders
    const orderIds = orders.map((o) => o._id);
    await Order.updateMany(
      { _id: { $in: orderIds } },
      { $set: { deliveredEmailSent: true } }
    );

    console.log("✅ All delivered orders have been processed.");
  } catch (error) {
    console.error("❌ Error in sendDeliveredOrderEmail:", error.message);
  }
};

export default sendDeliveredOrderEmail;