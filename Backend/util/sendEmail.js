import SibApiV3Sdk from "sib-api-v3-sdk";
import dotenv from "dotenv";

dotenv.config();

// Configure Brevo client
const defaultClient = SibApiV3Sdk.ApiClient.instance;
defaultClient.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const sendEmail = async (to, subject, text, html = null) => {
  // Brevo email object
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail({
    to: [{ email: to }],
    sender: { name: "BeautyBliss Shop Support", email: process.env.EMAIL_FROM },
    subject,
    textContent: text,
    htmlContent: html || `<p>${text}</p>`,
  });

  try {
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("📧 Email sent successfully to", to);
    return response;
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error);
    throw error;
  }
};

export default sendEmail;

