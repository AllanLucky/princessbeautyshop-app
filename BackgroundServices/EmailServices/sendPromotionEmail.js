// EmailServices/sendPromotionEmail.js

import ejs from "ejs";
import dotenv from "dotenv";
import path from "path";
import sendMail from "../helpers/sendMailer.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

dotenv.config();

/* ====================================================
   BATCH EMAIL WORKER
   Sends emails in small batches with delay to prevent throttling
==================================================== */
const sendEmailsInBatches = async (emails, batchSize = 10, delayMs = 1000) => {
  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize);

    await Promise.all(
      batch.map(async ({ options, userId }) => {
        try {
          if (!options.to) {
            console.warn(`[${new Date().toISOString()}] ⚠️ Skipping missing email for user ${userId}`);
            return;
          }

          const result = await sendMail(options);

          if (result?.success) {
            await User.findByIdAndUpdate(userId, {
              $set: {
                promotionEmailSent: true,
                promotionEmailSentAt: new Date(),
                error: null
              }
            });
            console.log(`[${new Date().toISOString()}] ✅ Promotion email sent → ${options.to}`);
          } else {
            console.error(`[${new Date().toISOString()}] ❌ Email failed → ${options.to}`);
            await User.findByIdAndUpdate(userId, {
              $set: { error: result?.error || "Unknown email failure" }
            });
          }

        } catch (error) {
          console.error(`[${new Date().toISOString()}] ❌ Email worker error → ${options.to}`, error.message);

          const permanent = !(
            error.code === "EENVELOPE" || 
            error.message?.includes("Temporary")
          );

          await User.findByIdAndUpdate(userId, {
            $set: {
              promotionEmailSent: permanent ? true : false,
              error: error.message,
              promotionEmailSentAt: permanent ? new Date() : null
            }
          });
        }
      })
    );

    if (i + batchSize < emails.length) {
      console.log(`[${new Date().toISOString()}] ⏳ Cooling down for ${delayMs}ms before next batch...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
};

/* ====================================================
   PROMOTION EMAIL SERVICE
==================================================== */
const sendPromotionEmail = async () => {
  try {
    console.log(`[${new Date().toISOString()}] 🚀 Starting promotion email broadcast...`);

    const users = await User.find({
      email: { $exists: true, $ne: null },
      promotionEmailSent: false
    }).limit(50).lean();

    if (!users.length) {
      console.log(`[${new Date().toISOString()}] ℹ️ No users available for promotion email.`);
      return;
    }

    const products = await Product.aggregate([
      { $match: { price: { $gt: 0 } } },
      { $sample: { size: 5 } },
    ]);

    if (!products.length) {
      console.warn(`[${new Date().toISOString()}] ⚠️ No products available for promotion emails.`);
    }

    const templatePath = path.join(process.cwd(), "templates", "promotion.ejs");
    const emailsQueue = [];

    for (const user of users) {
      try {
        const html = await ejs.renderFile(templatePath, {
          name: user.name || "Valued Customer",
          products: products
        });

        emailsQueue.push({
          userId: user._id,
          options: {
            from: process.env.EMAIL,
            to: user.email,
            subject: "🔥 This Week’s Featured Beauty Products",
            html
          }
        });

      } catch (error) {
        console.error(`[${new Date().toISOString()}] ❌ Template rendering failed for ${user.email}:`, error.message);
      }
    }

    if (emailsQueue.length > 0) {
      await sendEmailsInBatches(emailsQueue, 10, 1000);
    }

    console.log(`[${new Date().toISOString()}] 🎯 Promotion email broadcast completed.`);

  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Promotion service error:`, error.message);
  }
};

export default sendPromotionEmail;