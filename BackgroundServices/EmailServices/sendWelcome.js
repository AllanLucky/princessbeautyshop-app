import ejs from "ejs";
import dotenv from "dotenv";
import sendMail from "../helpers/sendMailer.js";
import User from "../models/userModel.js";

dotenv.config();

const sendWelcomeEmail = async () => {
  try {
    const users = await User.find({ status: 0 }); // users not yet emailed

    if (!users.length) return;

    for (let user of users) {
      const data = await ejs.renderFile(
        "templates/Welcome.ejs",
        {
          name: user.name,
          supportLink: process.env.SUPPORT_LINK,
        }
      );

      const messageOptions = {
        from: process.env.EMAIL,
        to: user.email,
        subject: "Welcome to Beauty Bliss",
        html: data,
      };

      try {
        await sendMail(messageOptions);
        await User.findByIdAndUpdate(user._id, { $set: { status: 1 } }); // mark as emailed
      } catch (error) {
        console.log(`Failed to send email to ${user.email}:`, error);
      }
    }
  } catch (error) {
    console.log("Error fetching users for welcome email:", error);
  }
};

export default sendWelcomeEmail;
