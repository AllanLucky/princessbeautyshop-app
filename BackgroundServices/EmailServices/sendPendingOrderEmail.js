import ejs from "ejs";
import dotenv from "dotenv";
import sendMail from "../helpers/sendMailer.js";
import Order from "../models/orderModel.js";

dotenv.config();

/*
================================================
SEND PENDING ORDER EMAIL SERVICE
================================================
*/

const sendPendingOrderEmail = async () => {
  try {
    const orders = await Order.find({
      status: 0,
      pendingEmailSent: false,
      email: { $exists: true, $ne: null },
    }).limit(50);

    if (!orders.length) return;

    for (const order of orders) {
      try {
        if (!order.products || !order.products.length) continue;

        const html = await ejs.renderFile(
          "templates/pendingorder.ejs",
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
            "✅ Your order has been placed successfully. We are preparing it for you.",
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
          { $set: { pendingEmailSent: true } }
        );

      } catch (error) {
        console.log("Order email error:", error.message);
      }
    }
  } catch (error) {
    console.log("Service error:", error.message);
  }
};

export default sendPendingOrderEmail;