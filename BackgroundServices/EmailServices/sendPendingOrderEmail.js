// EmailServices/sendPendingOrderEmail.js

import ejs from "ejs";
import dotenv from "dotenv";
import path from "path";
import sendMailer from "../helpers/sendMailer.js"; 
import Order from "../models/orderModel.js";

dotenv.config();

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

          const progress = 20; // Pending confirmation

          const templatePath = path.join(
            process.cwd(),
            "templates",
            "pendingorder.ejs"
          );

          const html = await ejs.renderFile(templatePath, {
            name: order.name || "Customer",
            orderNumber: order._id.toString().slice(-8),
            products: order.products,
            total: order.total || 0,
            status: order.status,
            statusText: "Pending Confirmation",
            progress,
            estimatedDeliveryDate: new Date(
              Date.now() + 7 * 24 * 60 * 60 * 1000
            ).toDateString(),
          });

          const mailResult = await sendMailer({
            to: order.email,
            subject:
              "🛍️ Your order has been placed successfully. We are preparing it for you.",
            htmlContent: html,
          });

          if (mailResult) {
            await Order.updateOne(
              { _id: order._id },
              { $set: { pendingEmailSent: true } }
            );
            console.log(`[${new Date().toISOString()}] ✅ Pending email sent → ${order._id}`);
          }

        } catch (error) {
          console.error(
            `[${new Date().toISOString()}] ❌ Pending order email error → ${order._id}`,
            error.message
          );
        }
      })
    );

    // Rate limit between batches
    if (i + batchSize < orders.length) {
      console.log(`[${new Date().toISOString()}] ⏳ Cooling down for ${delayMs}ms before next batch...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
};

/* ====================================================
   MAIN SERVICE
==================================================== */
const sendPendingOrderEmail = async () => {
  try {
    const orders = await Order.find({
      status: 0, // Pending
      pendingEmailSent: false,
      email: { $exists: true, $ne: null },
    })
      .limit(50)
      .sort({ createdAt: 1 })
      .lean();

    if (!orders.length) {
      console.log(`[${new Date().toISOString()}] ℹ️ No pending orders to email.`);
      return;
    }

    await sendEmailsInBatches(orders);

    console.log(`[${new Date().toISOString()}] 🎯 Pending order email worker completed.`);

  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Pending order service error:`, error.message);
  }
};

export default sendPendingOrderEmail;