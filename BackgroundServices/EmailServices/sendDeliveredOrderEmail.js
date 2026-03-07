import ejs from "ejs";
import dotenv from "dotenv";
import sendMail from "../helpers/sendMailer.js";
import Order from "../models/orderModel.js";
import path from "path";

dotenv.config();

/*
================================================
SEND DELIVERED ORDER EMAIL SERVICE
================================================
*/

const sendDeliveredOrderEmail = async () => {
  try {

    const orders = await Order.find({
      status: 4, // Delivered
      deliveredEmailSent: false,
      email: { $exists: true, $ne: null },
    }).limit(50);

    if (!orders.length) return;

    for (const order of orders) {

      try {

        if (!order.products || !order.products.length) continue;

        const templatePath = path.join(
          process.cwd(),
          "templates",
          "deliveredorder.ejs"
        );

        const html = await ejs.renderFile(templatePath, {

          name: order.name || "Customer",

          orderNumber: order._id.toString().slice(-8),

          products: order.products,

          total: order.total || 0,

          progress: order.progress || 100,

          statusText: order.statusText || "Delivered",

          estimatedDeliveryDate: order.estimatedDeliveryDate
            ? new Date(order.estimatedDeliveryDate).toDateString()
            : new Date().toDateString(),

        });

        const messageOptions = {
          from: process.env.EMAIL,
          to: order.email,
          subject:
            "🎉 Your order has been delivered successfully!",
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
          { $set: { deliveredEmailSent: true } }
        );

      } catch (error) {

        console.error(
          `Delivered email error for order ${order._id}:`,
          error.message
        );

      }

    }

  } catch (error) {

    console.error("Delivered email service error:", error.message);

  }
};

export default sendDeliveredOrderEmail;