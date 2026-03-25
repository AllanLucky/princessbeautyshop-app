import sendEmail from "./sendMailer.js";

(async () => {
  try {
    await sendEmail(
      "yourpersonalemail@example.com", // replace with your real email
      "Test Email - BeautyBliss",
      "This is a test email from Truehost SMTP setup.",
      "<h2>✅ Success!</h2><p>Your backend can now send emails via Truehost.</p>"
    );
    console.log("Test email sent successfully!");
  } catch (err) {
    console.error("Test email failed:", err);
  }
})();
