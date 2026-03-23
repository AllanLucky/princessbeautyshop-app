import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

let transporter;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "lim117.truehost.cloud",
      port: Number(process.env.EMAIL_PORT) || 465,
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: { rejectUnauthorized: false },
      family: 4,
    });
  }
  return transporter;
<<<<<<< HEAD
}

let configurations = {
  host: process.env.EMAIL_HOST || "lim117.truehost.cloud",
  port: Number(process.env.EMAIL_PORT) || 465,
  secure: process.env.EMAIL_SECURE === "true", // true for SSL/TLS
  auth: {
    user: process.env.EMAIL_USER ,
    pass: process.env.EMAIL_PASS ,
  },
  tls: {
    rejectUnauthorized: false,
  },
  family: 4, // force IPv4
};

const sendMail = async (messageoption) => {
  console.log("Creating transporter...", configurations, messageoption);
  const transporter = await createTransporter(configurations);
  console.log("Verifying transporter...");
  await transporter.verify();
  console.log("Transporter verified. Sending email...");
  await transporter.sendMail(messageoption, (error, info) => {
    if (error) {
      console.log("❌ Email sending failed:", error);
    } else {
      console.log("📧 Email sent: " + info.response);
    }
  });
=======
};

const sendEmail = async (to, subject, text, html = null) => {
  try {
    const info = await getTransporter().sendMail({
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
>>>>>>> 6dbac6b3bf6031d64385bebc6caa4370fe1edf3b
};

export default sendEmail;