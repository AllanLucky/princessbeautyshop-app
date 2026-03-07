// EmailServices/sendProcessingOrderEmail.js

import ejs from "ejs";
import dotenv from "dotenv";
import sendMail from "../helpers/sendMailer.js";
import Order from "../models/orderModel.js";

dotenv.config();

/*
=====================================================
SEND PROCESSING ORDER EMAIL SERVICE ⭐ PRODUCTION READY
=====================================================
*/

const calculateProgress = (status) => {
  /*
  Progress Mapping For Email UI Timeline

  Pending → Confirmed → Processing → Shipped → Delivered
  */

  const progressMap = {
    0: 20,
    1: 40,
    2: 60,
    3: 80,
    4: 100,
    5: 0,
  };

  return progressMap[status] || 0;
};

const sendProcessingOrderEmail = async () => {
  try {
    const orders = await Order.find({
      status: 2,
      processingEmailSent: false,
      email: { $exists: true, $ne: null },
    }).limit(50);

    if (!orders.length) return;

    for (const order of orders) {
      try {
        if (!order.products || !order.products.length) continue;

        const progress = calculateProgress(order.status);

        const html = await ejs.renderFile(
          "templates/processingorder.ejs",
          {
            name: order.name || "Customer",
            orderNumber: order._id.toString().slice(-8),
            products: order.products,
            total: order.total || 0,
            status: order.status,
            progress
          }
        );

        const messageOptions = {
          from: process.env.EMAIL,
          to: order.email,
          subject: "🔄 Your Order Is Being Processed",
          html,
        };

        await sendMail(messageOptions);

        /*
        =============================================
        MARK EMAIL AS SENT
        =============================================
        */

        await Order.updateOne(
          { _id: order._id },
          {
            $set: {
              processingEmailSent: true,
            },
          }
        );

      } catch (error) {
        console.error("Processing order email error:", error.message);
      }
    }

  } catch (error) {
    console.error("Processing service error:", error.message);
  }
};

export default sendProcessingOrderEmail;