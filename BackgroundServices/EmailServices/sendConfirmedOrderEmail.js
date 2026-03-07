// EmailServices/sendConfirmedOrderEmail.js

import ejs from "ejs";
import dotenv from "dotenv";
import sendMail from "../helpers/sendMailer.js";
import Order from "../models/orderModel.js";
import path from "path";

dotenv.config();

/*
=====================================================
SEND CONFIRMED ORDER EMAIL SERVICE
=====================================================
*/

const sendConfirmedOrderEmail = async () => {
  try {

    const orders = await Order.find({
      status: 1, // Confirmed
      confirmedEmailSent: false,
    });

    if (!orders.length) return;

    for (const order of orders) {
      try {

        const templatePath = path.join(
          process.cwd(),
          "templates",
          "confirmorder.ejs"
        );

        const html = await ejs.renderFile(templatePath, {
          name: order.name,
          orderNumber: order._id.toString().slice(-8),
          products: order.products,
          total: order.total,
          progress: order.progress,
          estimatedDeliveryDate: order.estimatedDeliveryDate
            ? new Date(order.estimatedDeliveryDate).toDateString()
            : "To be announced",
          statusText: order.statusText,
        });

        const messageOptions = {
          from: process.env.EMAIL,
          to: order.email,
          subject: "✅ Your Order Has Been Confirmed",
          html,
        };

        await sendMail(messageOptions);

        await Order.findByIdAndUpdate(order._id, {
          $set: {
            confirmedEmailSent: true,
          },
        });

      } catch (error) {
        console.error("Confirmed order email error:", error);
      }
    }

  } catch (error) {
    console.error("Confirmed service error:", error);
  }
};

export default sendConfirmedOrderEmail;