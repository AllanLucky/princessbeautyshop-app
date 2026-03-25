// EmailServices/sendCancelledOrderEmail.js

import ejs from "ejs";
import dotenv from "dotenv";
import sendMail from "../helpers/sendMailer.js";
import Order from "../models/orderModel.js";

dotenv.config();

/*
=====================================================
SEND CANCELLED ORDER EMAIL SERVICE ⭐ UPDATED
=====================================================
*/

const sendCancelledOrderEmail = async () => {
  try {
    const orders = await Order.find({
      status: 5, // Cancelled
      cancelledEmailSent: false,
      email: { $exists: true, $ne: null },
    })
      .limit(50)
      .lean();

    if (!orders.length) {
      console.log("ℹ️ No cancelled orders to send emails for.");
      return;
    }

    for (const order of orders) {
      try {
        // Safe fallback for amountPaid
        const amountPaid = order.amountPaid ?? order.total ?? 0;

        const html = await ejs.renderFile(
          "templates/cancelledorder.ejs",
          {
            name: order.name || "Customer",
            orderNumber: order._id.toString().slice(-8),
            products: order.products || [],
            total: order.total || 0,
            amountPaid,
            reason: order.declineReason || "No reason provided",
          }
        );

        const messageOptions = {
          from: `"Kilifonia Beauty" <${process.env.EMAIL}>`,
          to: order.email,
          subject: "❌ Your Order Has Been Cancelled",
          html,
        };

        await sendMail(messageOptions);

        // Mark as sent
        await Order.updateOne(
          { _id: order._id },
          { $set: { cancelledEmailSent: true } }
        );

        console.log(`✅ Cancelled email sent → ${order.email}`);

      } catch (error) {
        console.error(
          `❌ Cancelled email error for order ${order._id}:`,
          error.message
        );
      }
    }

  } catch (error) {
    console.error("❌ Cancelled email service error:", error.message);
  }
};

export default sendCancelledOrderEmail;