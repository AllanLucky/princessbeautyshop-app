import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

/**
 * Create the nodemailer transporter
 */
const createTransporter = () => {
  return nodemailer.createTransport({
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
};

/**
 * Sends a single email
 */
const sendMail = async (mailOptions) => {
  try {
    const transporter = createTransporter();

    // Verify connection
    await transporter.verify();
    console.log("✅ SMTP connection verified");

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Email sent:", info.response);

    return info;
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    throw error;
  }
};

/**
 * Send multiple emails with rate limiting
 * @param {Array} emails - array of mailOptions objects
 * @param {Number} limit - max emails per batch
 * @param {Number} delay - delay in ms between emails
 */
export const sendEmailsWithRateLimit = async (emails, limit = 5, delay = 1000) => {
  for (let i = 0; i < emails.length; i++) {
    try {
      await sendMail(emails[i]);
    } catch (err) {
      console.error(`❌ Failed to send email to ${emails[i].to}:`, err.message);
    }

    // Wait between emails
    if ((i + 1) % limit === 0) {
      console.log(`💤 Rate limit reached, waiting 1 minute before next batch...`);
      await new Promise((resolve) => setTimeout(resolve, 60 * 1000)); // 1 minute
    } else {
      await new Promise((resolve) => setTimeout(resolve, delay)); // delay between emails
    }
  }
};

export default sendMail;