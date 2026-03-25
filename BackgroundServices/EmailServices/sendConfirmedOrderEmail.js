// EmailServices/sendConfirmedOrderEmail.js

import ejs from "ejs";
import dotenv from "dotenv";
import path from "path";
import sendMail from "../helpers/sendMailer.js";
import Order from "../models/orderModel.js";

dotenv.config();

/*
=====================================================
SEND CONFIRMED ORDER EMAIL SERVICE ⭐ PRODUCTION READY
=====================================================
*/

const calculateProgress = (status) => {
  // Progress Mapping: Pending → Confirmed → Processing → Shipped → Delivered
  const progressMap = {
    0: 20,
    1: 40, // Confirmed
    2: 60,
    3: 80,
    4: 100,
    5: 0, // Cancelled
  };
  return progressMap[status] || 0;
};

const sendConfirmedOrderEmail = async () => {
  try {
    // Fetch confirmed orders that haven't had confirmation emails sent yet
    const orders = await Order.find({
      status: 1, // Confirmed
      confirmedEmailSent: false,
      email: { $exists: true, $ne: null },
    })
      .limit(50)
      .sort({ createdAt: 1 });

    if (!orders.length) {
      console.log("ℹ️ No new confirmed orders to send emails.");
      return;
    }

    for (const order of orders) {
      try {
        if (!order.products?.length) continue;

        const progress = calculateProgress(order.status);

        const templatePath = path.join(
          process.cwd(),
          "templates",
          "confirmorder.ejs"
        );

        // Fallback for amountPaid to be at least total if missing
        const amountPaid = order.amountPaid ?? order.total ?? 0;

        const html = await ejs.renderFile(templatePath, {
          name: order.name || "Customer",
          orderNumber: order._id.toString().slice(-8),
          products: order.products,
          total: order.total || 0,
          amountPaid,
          progress,
          estimatedDeliveryDate: order.estimatedDeliveryDate
            ? new Date(order.estimatedDeliveryDate).toDateString()
            : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toDateString(),
          statusText: "Confirmed",
        });

        const messageOptions = {
          from: `"Kilifonia Beauty" <${process.env.EMAIL}>`,
          to: order.email,
          subject: "✅ Your Order Has Been Confirmed",
          html,
        };

        const mailResult = await sendMail(messageOptions);

        if (mailResult?.success !== false) {
          await Order.updateOne(
            { _id: order._id },
            { $set: { confirmedEmailSent: true } }
          );
          console.log(`✅ Confirmation email sent to ${order.email}`);
        } else {
          console.error(`❌ Failed to send confirmation email to ${order.email}`);
        }
      } catch (error) {
        console.error(
          `❌ Error sending confirmed email for order ${order._id}:`,
          error.message
        );
      }
    }
  } catch (error) {
    console.error("❌ Confirmed order service error:", error.message);
  }
};

export default sendConfirmedOrderEmail;