// EmailServices/sendTimetableEmail.js

import ejs from "ejs";
import path from "path";
import dotenv from "dotenv";
import sendMail from "../helpers/sendMailer.js";
import Timetable from "../models/timetableModel.js";
import { generateSkincareRoutine, generateSkincarePDF } from "./createTimetableEmail.js";
import { fileURLToPath } from "url";

dotenv.config();

/* ====================================================
   ES MODULE DIRECTORY FIX
==================================================== */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ====================================================
   BATCH EMAIL WORKER
   Sends emails in batches to avoid throttling limits
==================================================== */
const sendEmailsInBatches = async (emails, batchSize = 5, delayMs = 1000) => {
  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize);

    await Promise.all(
      batch.map(async ({ options, requestId }) => {
        try {
          const result = await sendMail(options);

          if (result?.success) {
            await Timetable.findByIdAndUpdate(requestId, {
              $set: {
                status: 1, // Sent successfully
                processedAt: new Date(),
                error: null
              }
            });
            console.log(`✅ Timetable email sent → ${options.to}`);
          } else {
            console.error(`❌ Mail sending failed → ${options.to}`);
            await Timetable.findByIdAndUpdate(requestId, {
              $set: {
                error: result?.error || "Unknown email failure"
              }
            });
          }
        } catch (error) {
          console.error(`❌ Email worker error → ${options.to}`, error.message);

          // Determine permanent vs temporary failure
          const permanent = !(
            error.code === "EENVELOPE" ||
            error.message?.includes("Temporary")
          );

          await Timetable.findByIdAndUpdate(requestId, {
            $set: {
              status: permanent ? 2 : 0,
              processedAt: new Date(),
              error: error.message
            }
          });
        }
      })
    );

    // Rate limit control between batches
    if (i + batchSize < emails.length) {
      console.log(`⏳ Cooling down for ${delayMs}ms before next batch...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
};

/* ====================================================
   TIMETABLE EMAIL SERVICE
==================================================== */
const sendTimetableEmail = async () => {
  try {
    // Fetch pending timetable requests
    const timetableRequests = await Timetable.find({ status: 0 }).lean();

    if (!timetableRequests.length) {
      console.log("ℹ️ No pending timetable emails to send.");
      return;
    }

    console.log(`🚀 Processing ${timetableRequests.length} timetable emails...`);

    const templatePath = path.join(__dirname, "../templates/timetable.ejs");
    const emailsQueue = [];

    // Prepare all emails first
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
          instructions: routine.instructions
        });

        emailsQueue.push({
          requestId: request._id,
          options: {
            from: process.env.EMAIL,
            to: request.email,
            subject: `Your Personalized Skincare Timetable - ${request.name}`,
            html: emailHtml,
            attachments: [
              {
                filename: `Skincare-Timetable-${request.name.replace(/\s+/g, "-").toLowerCase()}.pdf`,
                content: pdfBuffer,
                contentType: "application/pdf"
              }
            ]
          }
        });

      } catch (error) {
        console.error(`❌ Preparation error → ${request.email}:`, error.message);
        await Timetable.findByIdAndUpdate(request._id, {
          $set: {
            status: 2,
            processedAt: new Date(),
            error: error.message
          }
        });
      }
    }

    // Send emails in batches
    if (emailsQueue.length > 0) {
      await sendEmailsInBatches(emailsQueue, 5, 1000);
    }

    console.log("✅ Timetable email worker completed.");

  } catch (error) {
    console.error("❌ Timetable email service crashed:", error);
  }
};

export default sendTimetableEmail;