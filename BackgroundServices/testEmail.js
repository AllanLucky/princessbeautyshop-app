import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ debug: true });

(async () => {
  try {
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "****" : "undefined");

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "lim117.truehost.cloud",
      port: Number(process.env.EMAIL_PORT) || 465,
      secure: process.env.EMAIL_SECURE === "true", // true for 465, false for 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
      family: 4,
      logger: true,
      debug: true,
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: "allandevtech@gmail.com", // change recipient if needed
      subject: "Local SMTP Test",
      text: "Hello Allan, this is a test email sent from your backend via Truehost.",
      html: "<p>Hello Allan, this is a <b>test email</b> sent from your backend via Truehost.</p>",
    });

    console.log("✅ Email sent:", info.messageId);
    console.log("➡️ Response:", info.response);
  } catch (err) {
    console.error("❌ Email sending failed:", err);
  }
})();

