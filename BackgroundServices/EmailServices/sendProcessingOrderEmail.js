// EmailServices/sendProcessingOrderEmail.js

import ejs from "ejs";
import dotenv from "dotenv";
import sendMail from "../helpers/sendMailer.js";
import Order from "../models/orderModel.js";

dotenv.config();

/*
=====================================================
SEND PROCESSING ORDER EMAIL SERVICE
=====================================================
*/

const sendProcessingOrderEmail = async () => {
  try {
    const orders = await Order.find({
      status: 2, // Processing stage
      processingEmailSent: false,
    });

    if (!orders.length) return;

    for (const order of orders) {
      try {
        const html = await ejs.renderFile(
          "templates/processingorder.ejs",
          {
            name: order.name,
            orderNumber: order._id.toString().slice(-8),
            products: order.products,
            total: order.total,
          }
        );

        const messageOptions = {
          from: process.env.EMAIL,
          to: order.email,
          subject: "🔄 Your Order Is Being Processed",
          html,
        };

        await sendMail(messageOptions);

        await Order.findByIdAndUpdate(order._id, {
          $set: {
            processingEmailSent: true,
          },
        });

      } catch (error) {
        console.error("Processing order email error:", error);
      }
    }

  } catch (error) {
    console.error("Processing service error:", error);
  }
};

export default sendProcessingOrderEmail;