import SibApiV3Sdk from "sib-api-v3-sdk";
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
};

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

/*
=====================================================
GENERIC EMAIL SENDER (REUSABLE)
=====================================================
*/

const sendMailer = async ({ to, subject, htmlContent, textContent }) => {
  try {
    const response = await tranEmailApi.sendTransacEmail({
      sender: {
        email: process.env.EMAIL_FROM.split("<")[1].replace(">", ""),
        name: process.env.EMAIL_FROM.split("<")[0].trim(),
      },
      to: [{ email: to }],
      subject,
      htmlContent,
      textContent: textContent || "Kilifonia Beauty Notification",
    });

    console.log(`📧 Email sent to ${to}:`, response.messageId);
    return response;

  } catch (error) {
    console.error("❌ Email failed:", error.response?.body || error.message);
  }
};

export default sendMailer;