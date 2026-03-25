import ejs from "ejs";
import dotenv from "dotenv";
import sendMail from "../helpers/sendMailer.js";
import Order from "../models/orderModel.js";
import path from "path";

dotenv.config();

/*
=====================================================
SEND SHIPPED ORDER EMAIL SERVICE
=====================================================
*/

const getProgressFromStatus = (status) => {
  // Map order status to progress %
  const progressMap = {
    0: 0,    // Pending
    1: 25,   // Confirmed
    2: 50,   // Processing
    3: 75,   // Shipped
    4: 100,  // Delivered
    5: 0,    // Cancelled / Unknown
  };
  return progressMap[status] ?? 0;
};

const sendShippedOrderEmail = async () => {
  try {
    // Fetch all orders that are shipped but email not yet sent
    const orders = await Order.find({
      status: 3, // Shipped
      shippedEmailSent: false,
      email: { $exists: true, $ne: null },
    })
      .limit(50)
      .lean();

    if (!orders.length) {
      console.log("No shipped orders pending email.");
      return;
    }

    for (const order of orders) {
      try {
        if (!order.products?.length) continue;

        const progress = getProgressFromStatus(order.status);

        const templatePath = path.join(
          process.cwd(),
          "templates",
          "shippingorder.ejs"
        );

        const html = await ejs.renderFile(templatePath, {
          name: order.name || "Customer",
          orderNumber: order._id.toString().slice(-8),
          products: order.products,
          total: order.total || 0,
          progress,
          statusText: "Shipped",
          estimatedDeliveryDate: order.estimatedDeliveryDate
            ? new Date(order.estimatedDeliveryDate).toDateString()
            : "To be updated",
        });

        const messageOptions = {
          from: process.env.EMAIL,
          to: order.email,
          subject: "📦 Good News! Your Order Has Been Shipped",
          html,
        };

        await sendMail(messageOptions);

        // Mark email as sent
        await Order.updateOne(
          { _id: order._id },
          { $set: { shippedEmailSent: true } }
        );

        console.log(`✅ Shipped email sent → ${order.email}`);

      } catch (err) {
        console.error(`❌ Shipped email error for order ${order._id}:`, err.message);
      }
    }

  } catch (err) {
    console.error("❌ Shipped service error:", err.message);
  }
};

export default sendShippedOrderEmail;