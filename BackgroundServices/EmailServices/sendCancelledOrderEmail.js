// EmailServices/sendCancelledOrderEmail.js
import ejs from "ejs";
import dotenv from "dotenv";
import sendMail from "../helpers/sendMailer.js";
import Order from "../models/orderModel.js";

dotenv.config();

/*
=====================================================
SEND CANCELLED ORDER EMAIL SERVICE
=====================================================
*/

const sendCancelledOrderEmail = async () => {
  try {
    const orders = await Order.find({
      status: 5, // Cancelled order status
      cancelledEmailSent: false,
    });

    if (!orders.length) return;

    for (const order of orders) {
      try {
        const html = await ejs.renderFile(
          "templates/cancelledorder.ejs",
          {
            name: order.name,
            orderNumber: order._id.toString().slice(-8),
            products: order.products,
            total: order.total,
            reason: order.declineReason || "No reason provided",
          }
        );

        const messageOptions = {
          from: process.env.EMAIL,
          to: order.email,
          subject: "❌ Your Order Has Been Cancelled",
          html,
        };

        await sendMail(messageOptions);

        await Order.findByIdAndUpdate(order._id, {
          $set: {
            cancelledEmailSent: true,
          },
        });
      } catch (error) {
        console.error("Cancelled order email error:", error);
      }
    }
  } catch (error) {
    console.error("Cancelled service error:", error);
  }
};

export default sendCancelledOrderEmail;