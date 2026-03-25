import ejs from "ejs";
import dotenv from "dotenv";
import sendMail from "../helpers/sendMailer.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import path from "path";

dotenv.config();

/*
================================================
SEND PROMOTIONAL EMAIL SERVICE (PRODUCTION READY)
================================================
*/

const sendPromotionEmail = async () => {
  try {
    console.log("🚀 Starting promotion email broadcast...");

    // Fetch users eligible for promotional emails
    const users = await User.find({
      email: { $exists: true, $ne: null },
      promotionEmailSent: false,
    })
      .limit(50)
      .lean();

    if (!users.length) {
      console.log("ℹ️ No users available for promotion email.");
      return;
    }

    // Sample 5 featured products
    const products = await Product.aggregate([
      { $match: { price: { $gt: 0 } } },
      { $sample: { size: 5 } },
    ]);

    // Path to EJS template
    const templatePath = path.join(process.cwd(), "templates", "promotion.ejs");

    for (const user of users) {
      try {
        if (!user.email) continue;

        // Render HTML from EJS template
        const html = await ejs.renderFile(templatePath, {
          name: user.name || "Valued Customer",
          products: products.length ? products : [],
        });

        // Prepare email options
        const messageOptions = {
          from: process.env.EMAIL,
          to: user.email,
          subject: "🔥 This Week’s Featured Beauty Products",
          html,
        };

        // Send email
        await sendMail(messageOptions);

        // Mark promotion email as sent
        await User.updateOne(
          { _id: user._id },
          {
            $set: {
              promotionEmailSent: true,
              promotionEmailSentAt: new Date(),
            },
          }
        );

        console.log(`✅ Promotion email sent to ${user.email}`);

      } catch (error) {
        console.error(`❌ Promotion email error for ${user.email}:`, error.message);
      }
    }

    console.log("🎯 Promotion email broadcast completed.");

  } catch (error) {
    console.error("❌ Promotion service error:", error.message);
  }
};

export default sendPromotionEmail;