import ejs from "ejs";
import dotenv from "dotenv";
import sendMail from "../helpers/sendMailer.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

dotenv.config();

/*
================================================
SEND PROMOTIONAL EMAIL SERVICE (PRODUCTION)
================================================
*/

const sendPromotionEmail = async () => {
  try {
    console.log("Starting promotion email broadcast...");

    const users = await User.find({
      email: { $exists: true, $ne: null },
      promotionEmailSent: false,
    })
      .limit(50)
      .lean();

    if (!users.length) {
      console.log("No users available for promotion email.");
      return;
    }

    /*
    ============================================
    SAMPLE FEATURED PRODUCTS
    ============================================
    */

    const products = await Product.aggregate([
      { $match: { price: { $gt: 0 } } },
      { $sample: { size: 5 } },
    ]);

    for (const user of users) {
      try {
        if (!user.email) continue;

        const html = await ejs.renderFile(
          "templates/promotion.ejs",
          {
            name: user.name || "Customer",
            products,
          }
        );

        const messageOptions = {
          from: process.env.EMAIL,
          to: user.email,
          subject: "🔥 This Week’s Featured Beauty Products",
          html,
        };

        await sendMail(messageOptions);

        /*
        ============================================
        MARK PROMOTION EMAIL SENT
        ============================================
        */

        await User.updateOne(
          { _id: user._id },
          {
            $set: {
              promotionEmailSent: true,
              promotionEmailSentAt: new Date(),
            },
          }
        );

        console.log(`Promotion email sent to ${user.email}`);

      } catch (error) {
        console.log(`Promotion email error for ${user.email}:`, error.message);
      }
    }

    console.log("Promotion broadcast completed.");

  } catch (error) {
    console.log("Promotion service error:", error.message);
  }
};

export default sendPromotionEmail;