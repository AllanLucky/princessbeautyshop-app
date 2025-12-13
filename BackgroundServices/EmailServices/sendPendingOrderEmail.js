import ejs from "ejs";
import dotenv from "dotenv";
import sendMail from "../helpers/sendMailer.js";
import Order from "../models/orderModel.js";

dotenv.config();
const sendPendingOrderEmail = async () => {
  try {
    const orders = await Order.find({ status: 0 }); // pending orders

    if (orders.length === 0) return;

    for (let order of orders) {
      const data = await ejs.renderFile(
        "templates/pendingorder.ejs",
        {
          name: order.name,
          products: order.products,
        }
      );

      const messageOptions = {
        from: process.env.EMAIL,
        to: order.email,
        subject: "Your order has been placed",
        html: data,
      };

      await sendMail(messageOptions);

      // mark as processing / email sent
      await Order.findByIdAndUpdate(order._id, {
        $set: { status: 1 },
      });
    }
  } catch (error) {
    console.log("Email error:", error);
  }
};

export default sendPendingOrderEmail;
