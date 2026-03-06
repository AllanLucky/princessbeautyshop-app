// EmailServices/sendShippedOrderEmail.js

import ejs from "ejs";
import dotenv from "dotenv";
import sendMail from "../helpers/sendMailer.js";
import Order from "../models/orderModel.js";

dotenv.config();

/*
=====================================================
SEND SHIPPED ORDER EMAIL SERVICE
=====================================================
*/

const sendShippedOrderEmail = async () => {
  try {
    const orders = await Order.find({
      status: 3, // Shipped status
      shippedEmailSent: false,
    });

    if (!orders.length) return;

    for (const order of orders) {
      try {
        const html = await ejs.renderFile(
          "templates/shippingorder.ejs",
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
          subject: "📦 Good News! Your Order Has Been Shipped",
          html,
        };

        await sendMail(messageOptions);

        await Order.findByIdAndUpdate(order._id, {
          $set: {
            shippedEmailSent: true,
          },
        });

      } catch (error) {
        console.error("Shipped order email error:", error);
      }
    }

  } catch (error) {
    console.error("Shipped service error:", error);
  }
};

export default sendShippedOrderEmail;