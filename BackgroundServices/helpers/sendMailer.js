import SibApiV3Sdk from "sib-api-v3-sdk";
import dotenv from "dotenv";

dotenv.config();

// ✅ Initialize once
const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

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