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
    // FIND NEW USERS ONLY (status = 0)
    // ====================================================
    const users = await User.find({ status: 0 }).lean();

    if (!users.length) {
      console.log(`[${new Date().toISOString()}] ℹ️ No pending welcome emails.`);
      return;
    }

    console.log(`[${new Date().toISOString()}] 🚀 Sending welcome emails to ${users.length} user(s)`);

    // ====================================================
    // TEMPLATE RENDERER
    // ====================================================
    const renderTemplate = async (templateName, data) => {
      const templatePath = path.join(process.cwd(), "templates", `${templateName}.ejs`);
      return ejs.renderFile(templatePath, data);
    };

    // ====================================================
    // EMAIL WORKER LOOP
    // ====================================================
    for (const user of users) {
      try {
        if (!user.email) {
          console.warn(`[${new Date().toISOString()}] ⚠️ Skipping user without email: ${user._id}`);
          continue;
        }

        const html = await renderTemplate("welcome", {
          name: user.name || "Valued Customer",
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
          console.log(`[${new Date().toISOString()}] ✅ Welcome email sent → ${user.email}`);
        } else {
          console.log(`[${new Date().toISOString()}] ❌ Welcome email failed → ${user.email}`);
          // Optional: implement retry logic here
          await User.findByIdAndUpdate(user._id, { $set: { status: 0 } });
        }

      } catch (error) {
        console.error(`[${new Date().toISOString()}] ❌ Error sending to ${user.email}:`, error.message);
        await User.findByIdAndUpdate(user._id, {
          $set: {
            error: error.message,
            status: 0
          }
        });
      }
    }

    console.log(`[${new Date().toISOString()}] ✅ Welcome email process completed.`);

  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ sendWelcomeEmail service crashed:`, error.message);
  }
};

export default sendWelcomeEmail;