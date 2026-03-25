// sendMailer.js
import SibApiV3Sdk from "sib-api-v3-sdk";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

// Configure Brevo API key
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

// Create transactional email instance
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

/**
 * Send email via Brevo
 * @param {string} toEmail - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} textContent - Plain text content
 * @param {string} htmlContent - HTML content (optional)
 * @returns {Promise<Object>}
 */
export default async function sendEmail(toEmail, subject, textContent, htmlContent) {
  try {
    const senderEmail = process.env.EMAIL_FROM;
    const senderName = process.env.EMAIL_NAME || "Kilifonia Beauty Shop";

    if (!senderEmail || !apiKey.apiKey) {
      throw new Error("⚠️ EMAIL_FROM or BREVO_API_KEY is missing in .env");
    }

    const sendSmtpEmail = {
      sender: { name: senderName, email: senderEmail },
      to: [{ email: toEmail }],
      subject,
      textContent,
      htmlContent: htmlContent || `<p>${textContent}</p>`,
    };

    console.log("📤 Email Payload:", JSON.stringify(sendSmtpEmail, null, 2));

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log(`✅ Email sent → ${toEmail}`);
    return { success: true, response };
  } catch (error) {
    console.error("❌ Failed to send email:", error.response?.body || error.message);
    return { success: false, error: error.response?.body || error.message };
  }
}