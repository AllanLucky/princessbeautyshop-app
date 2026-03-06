import ejs from "ejs";
import dotenv from "dotenv";
import sendMail from "../helpers/sendMailer.js";
import Order from "../models/orderModel.js";

dotenv.config();

/*
================================================
SEND DELIVERED ORDER EMAIL SERVICE
================================================
*/

const sendDeliveredOrderEmail = async () => {
  try {
    const orders = await Order.find({
      status: 4, // Delivered status
      deliveredEmailSent: false,
      email: { $exists: true, $ne: null },
    }).limit(50); // Prevent memory overload

    if (!orders.length) return;

    for (const order of orders) {
      try {
        if (!order.products || !order.products.length) continue;

        const html = await ejs.renderFile(
          "templates/deliveredorder.ejs",
          {
            name: order.name || "Customer",
            orderNumber: order._id.toString().slice(-8),
            products: order.products,
            total: order.total || 0,
            status: order.status,
          }
        );

        const messageOptions = {
          from: process.env.EMAIL,
          to: order.email,
          subject:
            "🎉 Your order has been delivered successfully! Thank you for shopping with us.",
          html,
        };

        await sendMail(messageOptions);

        /*
        =============================================
        MARK EMAIL AS SENT (IMPORTANT)
        =============================================
        */

        await Order.updateOne(
          { _id: order._id },
          { $set: { deliveredEmailSent: true } }
        );

      } catch (error) {
        console.log("Order email error:", error.message);
      }
    }
  } catch (error) {
    console.log("Service error:", error.message);
  }
};

export default sendDeliveredOrderEmail;