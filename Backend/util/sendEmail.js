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
    // Create transporter using Truehost SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "lim117.truehost.cloud",
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === "true", // true for SSL/TLS (465)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // allow self-signed certs if needed
      },
      family: 4, // force IPv4
    });

    // Verify SMTP connection
    await transporter.verify();
    console.log("✅ SMTP server is ready to send emails");

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_FROM || `"BeautyBliss Shop Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: html || undefined,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log("📧 Email sent successfully:");
    console.log("➡️ To:", to);
    console.log("➡️ Response:", info.response);

    return info;
  } catch (error) {
    console.error("❌ Email sending failed:");
    console.error(error); // full error (important for debugging)
    throw error; // allow calling function to handle it
  }
};

export default sendEmail;

