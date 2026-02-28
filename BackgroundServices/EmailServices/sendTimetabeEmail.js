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

    for (const request of timetableRequests) {
      try {
        // Generate personalized skincare routine
        const routine = generateSkincareRoutine(
          request.skinType,
          request.concerns,
          request.morningTime,
          request.eveningTime
        );

        // Generate PDF
        const pdfBuffer = await generateSkincarePDF(request, routine);

        // Render email template
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

        // Prepare email with PDF attachment
        const messageOptions = {
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
        };

        // Send email
        const result = await sendMail(messageOptions);

        if (result.success) {
          // Update request status to processed
          await Timetable.findByIdAndUpdate(request._id, {
            $set: { status: 1, processedAt: new Date() },
          });
          console.log(`✅ Timetable sent successfully to ${request.email}`);
        } else {
          console.error(`❌ Failed to send email to ${request.email}:`, result.error);
          // Leave status as 0 to retry later
        }
      } catch (error) {
        console.error(`❌ Error processing timetable for ${request.email}:`, error.message);

        // Handle temporary Gmail errors
        if (error.code === "EENVELOPE" || error.message.includes("Temporary System Problem")) {
          console.log(`⚠️ Temporary email error for ${request.email}. Will retry later.`);
        } else {
          // Permanent error: mark as failed
          await Timetable.findByIdAndUpdate(request._id, {
            $set: {
              status: 2, // 2 = failed
              processedAt: new Date(),
              error: error.message,
            },
          });
          console.log(`❌ Permanent error for ${request.email}. Marked as failed.`);
        }
      }
    }

    console.log("✅ All timetable emails have been processed.");
  } catch (error) {
    console.error("❌ Error in sendTimetableEmail:", error);
  }
};

export default sendTimetableEmail;