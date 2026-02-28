import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// ====================================================
// CREATE SINGLE REUSABLE TRANSPORTER
// ====================================================
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // must be false for 587
  requireTLS: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD, // must be App Password
  },
});

// Verify transporter once at startup
transporter.verify()
  .then(() => console.log("✅ SMTP transporter verified"))
  .catch((err) => console.error("❌ SMTP verification failed:", err.message));

// ====================================================
// SEND SINGLE EMAIL WITH ERROR HANDLING & RETRY
// ====================================================
const sendMail = async (mailOptions, retries = 3, delay = 2000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`📧 Email sent to ${mailOptions.to}:`, info.response);
      return info;
    } catch (err) {
      console.error(
        `❌ Attempt ${attempt} failed to send email to ${mailOptions.to}:`,
        err.message
      );
      if (attempt < retries) {
        console.log(`⏳ Retrying in ${delay / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw err; // final attempt failed
      }
    }
  }
};

// ====================================================
// SEND MULTIPLE EMAILS WITH RATE LIMIT
// ====================================================
export const sendEmailsWithRateLimit = async (emails, limit = 5, delay = 1000) => {
  for (let i = 0; i < emails.length; i++) {
    try {
      await sendMail(emails[i]);
    } catch (err) {
      console.error(`❌ Failed to send email to ${emails[i].to}:`, err.message);
      // Optionally, log to DB or EmailJob for retry later
    }

    // Wait between emails
    if ((i + 1) % limit === 0) {
      console.log(`💤 Rate limit reached, waiting 1 minute before next batch...`);
      await new Promise((resolve) => setTimeout(resolve, 60 * 1000)); // 1 min
    } else {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

export default sendMail;