// EmailServices/sendWelcomeEmail.js

import ejs from "ejs";
import path from "path";
import dotenv from "dotenv";
import sendMail from "../helpers/sendMailer.js";
import User from "../models/userModel.js";

dotenv.config();

/*
====================================================
WELCOME EMAIL SERVICE
====================================================
*/

const sendWelcomeEmail = async () => {
  try {
    // ====================================================
    // FIND NEW USERS ONLY (STATUS = 0)
    // ====================================================
    const users = await User.find({ status: 0 }).lean();

    if (!users.length) {
      console.log("ℹ️ No pending welcome emails.");
      return;
    }

    console.log(`🚀 Sending welcome emails to ${users.length} user(s)`);

    // ====================================================
    // PROMISE TEMPLATE RENDERER
    // ====================================================
    const renderTemplate = (templateName, data) => {
      const templatePath = path.join(
        process.cwd(),
        "templates",
        `${templateName}.ejs`
      );

      return new Promise((resolve, reject) => {
        ejs.renderFile(templatePath, data, (err, html) => {
          if (err) reject(err);
          else resolve(html);
        });
      });
    };

    // ====================================================
    // EMAIL WORKER LOOP
    // ====================================================
    for (const user of users) {
      try {
        const html = await renderTemplate("welcome", {
          name: user.name,
          email: user.email
        });

        const messageOptions = {
          from: process.env.EMAIL,
          to: user.email,
          subject: "🎉 Welcome to Beauty Bliss",
          html
        };

        const result = await sendMail(messageOptions);

        if (result?.success) {
          await User.findByIdAndUpdate(user._id, {
            $set: {
              status: 1,
              welcomeEmailSentAt: new Date(),
              error: null
            }
          });

          console.log(`✅ Welcome email sent → ${user.email}`);
        } else {
          console.log(`❌ Welcome email failed → ${user.email}`);
          await User.findByIdAndUpdate(user._id, { $set: { status: 0 } });
        }

      } catch (error) {
        console.error(`❌ Error sending to ${user.email}:`, error.message);
        await User.findByIdAndUpdate(user._id, {
          $set: {
            error: error.message,
            status: 0
          }
        });
      }
    }

    console.log("✅ Welcome email process completed.");

  } catch (error) {
    console.error("❌ sendWelcomeEmail service crashed:", error.message);
  }
};

export default sendWelcomeEmail;