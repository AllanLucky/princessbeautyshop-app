// EmailServices/sendPromotionEmail.js
import ejs from "ejs";
import path from "path";
import dotenv from "dotenv";
import sendMail from "../helpers/sendMailer.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import { fileURLToPath } from "url";

dotenv.config();

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sendPromotionEmail = async () => {
  try {
    const users = await User.find();
    if (!users.length) {
      console.log("No users found to send promotion emails.");
      return;
    }

    // Get 5 random products
    const products = await Product.aggregate([{ $sample: { size: 5 } }]);

    const templatePath = path.join(__dirname, "../templates/promotion.ejs");

    for (const user of users) {
      if (!user.email) {
        console.warn(`⚠️ User ${user._id} has no email. Skipping...`);
        continue;
      }

      let html;
      try {
        html = await ejs.renderFile(templatePath, { products });
      } catch (err) {
        console.error(`❌ Failed to render template for user ${user._id}:`, err.message);
        continue;
      }

      const mailOptions = {
        from: process.env.EMAIL,
        to: user.email,
        subject: "Your weekly products 🌟",
        html,
      };

      try {
        await sendMail(mailOptions);
        console.log(`✅ Promotion email sent to ${user.email}`);
      } catch (err) {
        console.error(`❌ Failed to send email to ${user.email}:`, err.message);
      }
    }

    console.log("✅ All promotion emails have been processed.");
  } catch (error) {
    console.error("❌ Error in sendPromotionEmail:", error.message);
  }
};

export default sendPromotionEmail;