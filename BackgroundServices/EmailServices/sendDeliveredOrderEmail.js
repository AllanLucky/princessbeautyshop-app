import ejs from "ejs";
import dotenv from "dotenv";
import sendMail from "../helpers/sendMailer.js";
import Order from "../models/orderModel.js";


dotenv.config();

const sendDeliveredOrderEmail = async () => {
  try {
    const orders = await Order.find({ status: 2 }); // find delivered

    if (orders.length === 0) return;

    for (let order of orders) {
      const data = await ejs.renderFile(
        "templates/deliveredorder.ejs",
        {
          name: order.name,
          products: order.products,
        }
      );

      const messageOptions = {
        from: process.env.EMAIL,
        to: order.email,
        subject: "Your order has been delivered",
        html: data,
      };

      await sendMail(messageOptions);

      // mark email sent
      await Order.findByIdAndUpdate(order._id, {
        $set: { status: 3 }, // so we do NOT email again
      });
    }
  } catch (error) {
    console.log("Email error:", error);
  }
};

export default sendDeliveredOrderEmail;

