import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

function createTransporter(config) {
  const transporter = nodemailer.createTransport(config);
  return transporter;
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
};

export default sendMail;
