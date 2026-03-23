import nodemailer from "nodemailer";
import dotenv from "dotenv";

<<<<<<< HEAD
/**
 * Send an email to a user
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Plain text message
 * @param {string} [html] - Optional HTML message
 */
const sendEmail = async (to, subject, text, html = null) => {
  try {
    // Create transporter using Truehost SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "lim117.truehost.cloud",
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === "true", // true for SSL/TLS (465)
=======
dotenv.config();

let transporter;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "lim117.truehost.cloud",
      port: Number(process.env.EMAIL_PORT) || 465,
      secure: process.env.EMAIL_SECURE === "true",
>>>>>>> 6dbac6b3bf6031d64385bebc6caa4370fe1edf3b
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
<<<<<<< HEAD
      tls: {
        rejectUnauthorized: false, // allow self-signed certs if needed
      },
      family: 4, // force IPv4
=======
      tls: { rejectUnauthorized: false },
      family: 4,
>>>>>>> 6dbac6b3bf6031d64385bebc6caa4370fe1edf3b
    });
  }
  return transporter;
};

<<<<<<< HEAD
    // Verify SMTP connection
    await transporter.verify();
    console.log("✅ SMTP server is ready to send emails");

    // Email options
    const mailOptions = {
=======
const sendEmail = async (to, subject, text, html = null) => {
  try {
    const info = await getTransporter().sendMail({
>>>>>>> 6dbac6b3bf6031d64385bebc6caa4370fe1edf3b
      from: process.env.EMAIL_FROM || `"BeautyBliss Shop Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: html || undefined,
    });

    console.log("📧 Email sent successfully to", to);
    return info;
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error);
    throw error;
  }
};

export default sendEmail;

