// EmailServices/sendProcessingOrderEmail.js

import ejs from "ejs";
import dotenv from "dotenv";
import sendMailer from "../helpers/sendMailer.js"; // ✅ updated
import Order from "../models/orderModel.js";

dotenv.config();

/*
=====================================================
PROGRESS CALCULATION
=====================================================
*/

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

/*
=====================================================
SEND PROCESSING ORDER EMAIL SERVICE
=====================================================
*/

const sendProcessingOrderEmail = async () => {
  try {
    const orders = await Order.find({
      status: 2,
      processingEmailSent: false,
      email: { $exists: true, $ne: null },
    })
      .limit(50)
      .sort({ createdAt: 1 }); // ✅ FIFO (important)

    if (!orders.length) return;

    for (const order of orders) {
      try {
        if (!order.products?.length) continue;

        const progress = calculateProgress(order.status);

        const html = await ejs.renderFile(
          "templates/processingorder.ejs",
          {
            name: order.name || "Customer",
            orderNumber: order._id.toString().slice(-8),
            products: order.products,
            total: order.total || 0,
            status: order.status,
            progress,
          }
        );

        /*
        =============================================
        SEND EMAIL VIA BREVO
        =============================================
        */

        const mailResult = await sendMailer({
          to: order.email,
          subject: "🔄 Your Order Is Being Processed",
          htmlContent: html,
        });

        /*
        =============================================
        MARK EMAIL AS SENT (WITH TIMESTAMP ⭐)
        =============================================
        */

        if (mailResult) {
          await Order.updateOne(
            { _id: order._id },
            {
              $set: {
                processingEmailSent: true,
                processingEmailSentAt: new Date(), // ✅ better tracking
              },
            }
          );

          console.log(`✅ Processing email sent: ${order._id}`);
        }

      } catch (error) {
        console.error(
          `❌ Processing order email error (${order._id}):`,
          error.message
        );
      }
    }

  } catch (error) {
    console.error("❌ Processing service error:", error.message);
  }
};

export default sendProcessingOrderEmail;