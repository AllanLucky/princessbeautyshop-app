// EmailServices/sendTimetableEmail.js
import ejs from "ejs";
import path from "path";
import dotenv from "dotenv";
import sendMail from "../helpers/sendMailer.js";
import Timetable from "../models/timetableModel.js";
import { generateSkincareRoutine, generateSkincarePDF } from "./createTimetableEmail.js";
import { fileURLToPath } from "url";

dotenv.config();

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Send emails in batches with rate-limiting
 * @param {Array} emails - array of email objects { options, requestId }
 * @param {number} batchSize - number of emails per batch
 * @param {number} delayMs - delay between batches in ms
 */
const sendEmailsInBatches = async (emails, batchSize = 5, delayMs = 1000) => {
  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize);

    await Promise.all(
      batch.map(async ({ options, requestId }) => {
        try {
          const result = await sendMail(options);

          if (result.success) {
            // Update request status to processed
            await Timetable.findByIdAndUpdate(requestId, {
              $set: { status: 1, processedAt: new Date() },
            });
            console.log(`✅ Timetable sent successfully to ${options.to}`);
          } else {
            console.error(`❌ Failed to send email to ${options.to}:`, result.error);
            // leave status as 0 for retry
          }
        } catch (error) {
          console.error(`❌ Error sending email to ${options.to}:`, error.message);

          if (error.code === "EENVELOPE" || error.message.includes("Temporary System Problem")) {
            console.log(`⚠️ Temporary email error for ${options.to}. Will retry later.`);
          } else {
            // Permanent error: mark as failed
            await Timetable.findByIdAndUpdate(requestId, {
              $set: { status: 2, processedAt: new Date(), error: error.message },
            });
            console.log(`❌ Permanent error for ${options.to}. Marked as failed.`);
          }
        }
      })
    );

    if (i + batchSize < emails.length) {
      console.log(`⏳ Waiting ${delayMs}ms before sending next batch...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
};

const sendTimetableEmail = async () => {
  try {
    // Find pending timetable requests (status: 0)
    const timetableRequests = await Timetable.find({ status: 0 });

    if (!timetableRequests.length) {
      console.log("No pending timetable requests found.");
      return;
    }

    console.log(`Processing ${timetableRequests.length} timetable requests...`);

    const templatePath = path.join(__dirname, "../templates/timetable.ejs");
    const emailsToSend = [];

    for (const request of timetableRequests) {
      try {
        const routine = generateSkincareRoutine(
          request.skinType,
          request.concerns,
          request.morningTime,
          request.eveningTime
        );

        const pdfBuffer = await generateSkincarePDF(request, routine);

        const emailHtml = await ejs.renderFile(templatePath, {
          name: request.name,
          skinType: request.skinType,
          concerns: request.concerns,
          morningTime: request.morningTime,
          eveningTime: request.eveningTime,
          products: routine.products,
          weeklySchedule: routine.weeklySchedule,
          instructions: routine.instructions,
        });

        emailsToSend.push({
          requestId: request._id,
          options: {
            from: process.env.EMAIL,
            to: request.email,
            subject: `Your Personalized Skincare Timetable - ${request.name}`,
            html: emailHtml,
            attachments: [
              {
                filename: `Skincare-Timetable-${request.name.replace(/\s+/g, '-')}.pdf`,
                content: pdfBuffer,
                contentType: "application/pdf",
              },
            ],
          },
        });
      } catch (error) {
        console.error(`❌ Error preparing email for ${request.email}:`, error.message);
        await Timetable.findByIdAndUpdate(request._id, {
          $set: { status: 2, processedAt: new Date(), error: error.message },
        });
      }
    }

    // Send all prepared emails in batches
    if (emailsToSend.length > 0) {
      await sendEmailsInBatches(emailsToSend, 5, 1000);
    }

    console.log("✅ All timetable emails have been processed.");
  } catch (error) {
    console.error("❌ Error in sendTimetableEmail:", error);
  }
};

export default sendTimetableEmail;