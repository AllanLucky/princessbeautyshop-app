// EmailServices/sendWelcomeEmail.js

import ejs from "ejs";
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
    /*
    ====================================================
    FIND NEW USERS ONLY (STATUS = 0)
    ====================================================
    */

    const users = await User.find({
      status: 0
    }).lean();

    if (!users.length) {
      console.log("ℹ️ No pending welcome emails.");
      return;
    }

    console.log(`🚀 Sending welcome emails to ${users.length} users`);

    /*
    ====================================================
    PROMISE TEMPLATE RENDERER
    ====================================================
    */

    const renderTemplate = (templatePath, data) => {
      return new Promise((resolve, reject) => {
        ejs.renderFile(templatePath, data, (err, html) => {
          if (err) reject(err);
          else resolve(html);
        });
      });
    };

    /*
    ====================================================
    EMAIL WORKER LOOP
    ====================================================
    */

    for (const user of users) {
      try {
        const html = await renderTemplate(
          "templates/welcome.ejs",
          {
            name: user.name,
            email: user.email
          }
        );

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
              welcomeEmailSentAt: new Date()
            }
          });

          console.log(`✅ Welcome email sent → ${user.email}`);
        } else {
          console.log(`❌ Welcome email failed → ${user.email}`);
        }

      } catch (error) {
        console.error(
          `❌ Welcome email worker error → ${user.email}`,
          error.message
        );

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
    console.error("❌ sendWelcomeEmail service crashed:", error);
  }
};

export default sendWelcomeEmail;