// EmailServices/sendSkincareReminder.js

import ejs from "ejs";
import dotenv from "dotenv";
import path from "path";
import sendMail from "../helpers/sendMailer.js";
import Timetable from "../models/timetableModel.js";

dotenv.config();

/* ====================================================
   BATCH EMAIL WORKER
==================================================== */
const sendRemindersInBatches = async (requests, timeOfDay, batchSize = 10, delayMs = 1000) => {
  for (let i = 0; i < requests.length; i += batchSize) {
    const batch = requests.slice(i, i + batchSize);

    await Promise.all(
      batch.map(async (request) => {
        try {
          const templatePath = path.join(process.cwd(), "templates", "reminder.ejs");

          const routineType = timeOfDay === "morning" ? "AM" : "PM";
          const subjectTime = timeOfDay === "morning" ? "Morning" : "Evening";

          const emailHtml = await ejs.renderFile(templatePath, {
            name: request.name || "Customer",
            skinType: request.skinType || "General",
            routineType,
            timeOfDay,
            scheduledTime:
              (timeOfDay === "morning" ? request.morningTime : request.eveningTime) || "Not Set",
            concerns: request.concerns || [],
          });

          const messageOptions = {
            from: `"Kilifonia Beauty" <${process.env.EMAIL}>`,
            to: request.email,
            subject: `🌅 Skincare Reminder - Time for your ${subjectTime} Routine!`,
            html: emailHtml,
          };

          const result = await sendMail(messageOptions);

          if (result?.success) {
            console.log(`[${new Date().toISOString()}] ✅ Reminder sent → ${request.email}`);

            const updateFlag =
              timeOfDay === "morning"
                ? { reminderEmailSentMorning: true }
                : { reminderEmailSentEvening: true };

            await Timetable.updateOne(
              { _id: request._id },
              {
                $set: {
                  lastReminderSent: new Date(),
                  lastReminderType: timeOfDay,
                  ...updateFlag,
                },
              }
            );
          } else {
            console.error(`[${new Date().toISOString()}] ❌ Failed to send → ${request.email}`, result?.error);
          }
        } catch (error) {
          console.error(`[${new Date().toISOString()}] ❌ Error for ${request.email}:`, error.message);
        }
      })
    );

    // Rate limiting
    if (i + batchSize < requests.length) {
      console.log(`[${new Date().toISOString()}] ⏳ Cooling down for ${delayMs}ms before next batch...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
};

/* ====================================================
   MAIN SERVICE
==================================================== */
const sendSkincareReminder = async (timeOfDay) => {
  try {
    console.log(`[${new Date().toISOString()}] 🕑 Starting ${timeOfDay} skincare reminder process...`);

    if (!["morning", "evening"].includes(timeOfDay)) {
      console.error("❌ Invalid reminder time. Must be 'morning' or 'evening'.");
      return;
    }

    const emailFlag =
      timeOfDay === "morning"
        ? { reminderEmailSentMorning: false }
        : { reminderEmailSentEvening: false };

    const requests = await Timetable.find({
      status: 1,
      ...emailFlag,
      email: { $exists: true, $ne: null },
    })
      .limit(50)
      .lean();

    if (!requests.length) {
      console.log(`[${new Date().toISOString()}] ℹ️ No users found for ${timeOfDay} reminders.`);
      return;
    }

    console.log(`[${new Date().toISOString()}] 📧 Sending ${timeOfDay} reminders to ${requests.length} users...`);

    await sendRemindersInBatches(requests, timeOfDay);

    console.log(`[${new Date().toISOString()}] 🏁 ${timeOfDay} skincare reminder process completed.`);

  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Skincare reminder service error:`, error.message);
  }
};

export default sendSkincareReminder;