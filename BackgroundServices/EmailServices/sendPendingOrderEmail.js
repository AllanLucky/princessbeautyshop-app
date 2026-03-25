import ejs from "ejs";
import dotenv from "dotenv";
import sendMailer from "../helpers/sendMailer.js"; 
import Order from "../models/orderModel.js";

dotenv.config();

const sendPendingOrderEmail = async () => {
  try {
    const orders = await Order.find({
      status: 0,
      pendingEmailSent: false,
      email: { $exists: true, $ne: null },
    })
      .limit(50)
      .sort({ createdAt: 1 });

    if (!orders.length) return;

    for (const order of orders) {
      try {
        if (!order.products?.length) continue;

        const progress = 20;

        const html = await ejs.renderFile(
          "templates/pendingorder.ejs",
          {
            name: order.name || "Customer",
            orderNumber: order._id.toString().slice(-8),
            products: order.products,
            total: order.total || 0,
            status: order.status,
            statusText: "Pending Confirmation",
            progress,
            estimatedDeliveryDate: new Date(
              Date.now() + 7 * 24 * 60 * 60 * 1000
            ).toDateString(),
          }
        );

        // ✅ CLEAN BREVO FORMAT
        const mailResult = await sendMailer({
          to: order.email,
          subject:
            "🛍️ Your order has been placed successfully. We are preparing it for you.",
          htmlContent: html,
        });

        // ✅ mark as sent
        if (mailResult) {
          await Order.updateOne(
            { _id: order._id },
            {
              $set: {
                pendingEmailSent: true,
              },
            }
          );
        }

      } catch (error) {
        console.log("Order email error:", error.message);
      }
    }

  } catch (error) {
    console.log("Service error:", error.message);
  }
};

export default sendPendingOrderEmail;