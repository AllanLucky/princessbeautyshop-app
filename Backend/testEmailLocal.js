// backend/testlocal.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ debug: true });

const sendTestEmail = async () => {
  const toEmail = "allandevtech@gmail.com"; // Change to your test recipient

  // Try first with SSL/TLS on port 465
  const configs = [
    {
      port: Number(process.env.EMAIL_PORT) || 465,
      secure: true, // SSL/TLS
      description: "Port 465 SSL/TLS",
    },
    {
      port: 587,
      secure: false, // STARTTLS
      description: "Port 587 STARTTLS",
    },
  ];

  for (let config of configs) {
    try {
      console.log(`\n🔹 Attempting to send via ${config.description}...`);

      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || "lim117.truehost.cloud",
        port: config.port,
        secure: config.secure,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false, // for testing
        },
        family: 4, // force IPv4
        connectionTimeout: 10000, // 10s timeout
      });

      // Verify SMTP connection
      await transporter.verify();
      console.log("✅ SMTP server is ready to send emails");

      // Send email
      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: toEmail,
        subject: "DigitalOcean SMTP Test",
        text: "Hello! This is a test email from your backend folder.",
        html: "<h1>Test Email</h1><p>This email is sent from DigitalOcean using Truehost SMTP.</p>",
      });

      console.log("📧 Email sent successfully!");
      console.log("➡️ To:", toEmail);
      console.log("➡️ Response:", info.response);
      return; // success, exit loop
    } catch (error) {
      console.error(`❌ Failed with ${config.description}:`, error.message);
      // try next config if exists
    }
  }

  console.error("⚠️ All SMTP attempts failed. Check firewall or credentials.");
};

sendTestEmail();
