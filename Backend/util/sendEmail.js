import nodemailer from "nodemailer";

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
};

export default sendEmail;