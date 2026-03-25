// EmailServices/sendDeliveredOrderEmail.js

import ejs from "ejs";
import dotenv from "dotenv";
import sendMail from "../helpers/sendMailer.js";
import Order from "../models/orderModel.js";
import path from "path";

dotenv.config();

/*
================================================
SEND DELIVERED ORDER EMAIL SERVICE ⭐ PRODUCTION READY
================================================
*/

const sendDeliveredOrderEmail = async () => {
  try {
    // Fetch orders that are delivered but email not yet sent
    const orders = await Order.find({
      status: 4, // Delivered
      deliveredEmailSent: false,
      email: { $exists: true, $ne: null },
    }).limit(50);

    if (!orders.length) {
      console.log("ℹ️ No delivered orders pending email.");
      return;
    }

    for (const order of orders) {
      try {
        // Skip orders without products
        if (!order.products || !order.products.length) continue;

        const templatePath = path.join(
          process.cwd(),
          "templates",
          "deliveredorder.ejs"
        );

        // Render EJS template with amountPaid included
        const html = await ejs.renderFile(templatePath, {
          name: order.name || "Customer",
          orderNumber: order._id.toString().slice(-8),
          products: order.products,
          total: order.total || 0,
          amountPaid: order.amountPaid || 0, // ✅ NEW: amount paid
          progress: 100, // Delivered is always 100%
          statusText: order.statusText || "Delivered",
          estimatedDeliveryDate: order.estimatedDeliveryDate
            ? new Date(order.estimatedDeliveryDate).toDateString()
            : new Date().toDateString(),
        });

        const messageOptions = {
          from: process.env.EMAIL,
          to: order.email,
          subject: "🎉 Your order has been delivered successfully!",
          html,
        };

        // Send email
        await sendMail(messageOptions);

        // Mark order as email sent
        await Order.updateOne(
          { _id: order._id },
          { $set: { deliveredEmailSent: true } }
        );

        console.log(`✅ Delivered email sent for order ${order._id}`);

      } catch (error) {
        console.error(`❌ Delivered email error for order ${order._id}:`, error.message);
      }
    }
  } catch (error) {
    console.error("❌ Delivered email service error:", error.message);
  }
};

export default sendDeliveredOrderEmail;