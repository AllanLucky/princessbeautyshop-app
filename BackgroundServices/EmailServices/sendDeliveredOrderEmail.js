// EmailServices/sendDeliveredOrderEmailSafe.js
import ejs from "ejs";
import path from "path";
import dotenv from "dotenv";
import sendMail from "../helpers/sendMailer.js";
import Order from "../models/orderModel.js";

dotenv.config();

/**
 * Send emails in batches with rate-limiting
 * @param {Array} emails - array of mailOptions
 * @param {number} batchSize - number of emails per batch
 * @param {number} delayMs - delay between batches (ms)
 */
const sendEmailsWithRateLimit = async (emails, batchSize = 5, delayMs = 1000) => {
  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize);

    await Promise.all(
      batch.map(async (mailOptions) => {
        try {
          const info = await sendMail(mailOptions);
          console.log(`✅ Email sent to ${mailOptions.to}`);
        } catch (error) {
          console.error(`❌ Failed to send email to ${mailOptions.to}:`, error.message);
        }
      })
    );

    if (i + batchSize < emails.length) {
      console.log(`⏳ Waiting ${delayMs}ms before next batch...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
};

const sendDeliveredOrderEmailSafe = async () => {
  try {
    // Fetch orders with status 2 (delivered but not emailed)
    const orders = await Order.find({ status: 2 });
    if (!orders.length) {
      console.log("No delivered orders to notify.");
      return;
    }

    const emails = [];

    for (const order of orders) {
      const templatePath = path.resolve(
        "BackgroundServices/templates/deliveredorder.ejs"
      );

      const html = await ejs.renderFile(templatePath, {
        name: order.name,
        products: order.products,
        pickupStation: order.pickupStation || "Not Specified",
        supportLink: "https://support.beautybliss.com",
      });

      emails.push({
        from: process.env.EMAIL,
        to: order.email,
        subject: "Your order has been delivered! 🎉",
        html,
      });
    }

    // Send emails in batches (5 emails per batch, 1 second delay)
    await sendEmailsWithRateLimit(emails, 5, 1000);

    // Update all orders to status 3 (emailed)
    const orderIds = orders.map((o) => o._id);
    await Order.updateMany(
      { _id: { $in: orderIds } },
      { $set: { status: 3 } }
    );

    console.log("✅ All delivered orders have been processed.");
  } catch (error) {
    console.error("❌ Error in sendDeliveredOrderEmailSafe:", error.message);
  }
};

export default sendDeliveredOrderEmailSafe;