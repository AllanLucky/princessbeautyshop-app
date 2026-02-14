import nodemailer from "nodemailer";

/**
 * Send an email to a user
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Plain text message
 * @param {string} [html] - Optional HTML message
 */
const sendEmail = async (to, subject, text, html = null) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"BeautyBlis Shop Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: html || undefined,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId, "to:", to);
  } catch (error) {
    console.error("Email sending failed:", error.message);
  }
};

export default sendEmail;
