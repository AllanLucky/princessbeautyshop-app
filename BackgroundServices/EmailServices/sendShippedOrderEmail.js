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

const getProgressFromStatus = (status) => {
  const map = {
    0: 0,
    1: 25,
    2: 50,
    3: 75,
    4: 100,
    5: 0,
  };

  return map[status] ?? 0;
};

const sendShippedOrderEmail = async () => {
  try {
    const orders = await Order.find({
      status: 3,
      shippedEmailSent: false,
      email: { $exists: true, $ne: null },
    })
      .limit(50)
      .lean();

    if (!orders.length) return;

    for (const order of orders) {
      try {
        if (!order.products?.length) continue;

        const progress = getProgressFromStatus(order.status);

        const html = await ejs.renderFile(
          "templates/shippingorder.ejs",
          {
            name: order.name || "Customer",
            orderNumber: order._id.toString().slice(-8),
            products: order.products,
            total: order.total || 0,
            progress,
          }
        );

        await sendMail({
          from: process.env.EMAIL,
          to: order.email,
          subject: "📦 Good News! Your Order Has Been Shipped",
          html,
        });

        await Order.updateOne(
          { _id: order._id },
          {
            $set: {
              shippedEmailSent: true,
            },
          }
        );

        console.log(`✅ Shipped email sent → ${order.email}`);

      } catch (error) {
        console.error(
          `❌ Shipped email error (${order.email}):`,
          error.message
        );
      }
    }

  } catch (error) {
    console.error("❌ Shipped service error:", error.message);
  }
};

export default sendShippedOrderEmail;