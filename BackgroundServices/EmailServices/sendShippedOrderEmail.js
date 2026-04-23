import ejs from "ejs";
import dotenv from "dotenv";
import sendMail from "../helpers/sendMailer.js"; // must handle Brevo payload
import Order from "../models/orderModel.js";
import path from "path";

dotenv.config();

const getProgressFromStatus = (status) => {
  const progressMap = { 0: 0, 1: 25, 2: 50, 3: 75, 4: 100, 5: 0 };
  return progressMap[status] ?? 0;
};

const sendShippedOrderEmail = async () => {
  try {
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

        // ✅ Brevo-compatible payload
        const brevoPayload = {
          sender: {
            name: "KilifoniaBeauty Shop",
            email: process.env.EMAIL,
          },
          to: [{ email: order.email }], // must be array of objects
          subject: "📦 Good News! Your Order Has Been Shipped",
          htmlContent: html,
          textContent: `Hi ${order.name || "Customer"}, your order has been shipped!`,
        };

        await sendMail(brevoPayload); // your helper must handle Brevo format

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