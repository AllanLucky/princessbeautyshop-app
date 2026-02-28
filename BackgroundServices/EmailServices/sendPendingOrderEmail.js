// EmailServices/sendPendingOrderEmail.js
import ejs from "ejs";
import path from "path";
import dotenv from "dotenv";
import sendMail from "../helpers/sendMailer.js";
import Order from "../models/orderModel.js";
import { fileURLToPath } from "url";

dotenv.config();

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sendPendingOrderEmail = async () => {
  try {
    // Fetch orders with status 0 (pending)
    const orders = await Order.find({ status: 0 });
    if (!orders.length) {
      console.log("No pending orders to process.");
      return;
    }

    for (const order of orders) {
      if (!order.email) {
        console.warn(`⚠️ Order ${order._id} has no email. Skipping...`);
        continue;
      }

      // Absolute path to EJS template
      const templatePath = path.join(__dirname, "../templates/pendingorder.ejs");

      let html;
      try {
        html = await ejs.renderFile(templatePath, {
          name: order.name,
          products: order.products,
        });
      } catch (err) {
        console.error(`❌ Failed to render template for order ${order._id}:`, err.message);
        continue;
      }

      const mailOptions = {
        from: process.env.EMAIL,
        to: order.email,
        subject: "Your order has been placed 🎉",
        html,
      };

      try {
        await sendMail(mailOptions);
        await Order.findByIdAndUpdate(order._id, { $set: { status: 1 } });
        console.log(`✅ Email sent for order ${order._id} to ${order.email}`);
      } catch (err) {
        console.error(`❌ Failed to send email for order ${order._id}:`, err.message);
      }
    }

    console.log("✅ All pending orders have been processed.");
  } catch (error) {
    console.error("❌ Error in sendPendingOrderEmail:", error.message);
  }
};

export default sendPendingOrderEmail;