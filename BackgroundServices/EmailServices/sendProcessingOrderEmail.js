// EmailServices/sendProcessingOrderEmail.js

import ejs from "ejs";
import dotenv from "dotenv";
import path from "path";
import sendMailer from "../helpers/sendMailer.js";
import Order from "../models/orderModel.js";

dotenv.config();

/* ====================================================
   PROGRESS CALCULATION
==================================================== */
const calculateProgress = (status) => {
  const progressMap = {
    0: 20,   // Pending
    1: 40,   // Confirmed
    2: 60,   // Processing
    3: 80,   // Shipped
    4: 100,  // Delivered
    5: 0,    // Cancelled
  };
  return progressMap[status] || 0;
};

/* ====================================================
   BATCH EMAIL WORKER
==================================================== */
const sendEmailsInBatches = async (orders, batchSize = 10, delayMs = 1000) => {
  for (let i = 0; i < orders.length; i += batchSize) {
    const batch = orders.slice(i, i + batchSize);

    await Promise.all(
      batch.map(async (order) => {
        try {
          if (!order.email || !order.products?.length) {
            console.warn(`[${new Date().toISOString()}] ⚠️ Skipping order ${order._id}`);
            return;
          }

          const progress = calculateProgress(order.status);

          const templatePath = path.join(
            process.cwd(),
            "templates",
            "processingorder.ejs"
          );

          const html = await ejs.renderFile(templatePath, {
            name: order.name || "Customer",
            orderNumber: order._id.toString().slice(-8),
            products: order.products,
            total: order.total || 0,
            status: order.status,
            progress,
          });

          const mailResult = await sendMailer({
            to: order.email,
            subject: "🔄 Your Order Is Being Processed",
            htmlContent: html,
          });

          if (mailResult) {
            await Order.updateOne(
              { _id: order._id },
              {
                $set: {
                  processingEmailSent: true,
                  processingEmailSentAt: new Date(),
                },
              }
            );
            console.log(`[${new Date().toISOString()}] ✅ Processing email sent → ${order._id}`);
          }

        } catch (error) {
          console.error(
            `[${new Date().toISOString()}] ❌ Processing email error → ${order._id}`,
            error.message
          );
        }
      })
    );

    // Rate limit between batches
    if (i + batchSize < orders.length) {
      console.log(`[${new Date().toISOString()}] ⏳ Cooling down for ${delayMs}ms before next batch...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
};

/* ====================================================
   MAIN SERVICE
==================================================== */
const sendProcessingOrderEmail = async () => {
  try {
    const orders = await Order.find({
      status: 2, // Processing
      processingEmailSent: false,
      email: { $exists: true, $ne: null },
    })
      .limit(50)
      .sort({ createdAt: 1 }) // FIFO
      .lean();

    if (!orders.length) {
      console.log(`[${new Date().toISOString()}] ℹ️ No processing orders pending email.`);
      return;
    }

    await sendEmailsInBatches(orders);

    console.log(`[${new Date().toISOString()}] 🎯 Processing order email worker completed.`);

  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Processing service error:`, error.message);
  }
};

export default sendProcessingOrderEmail;