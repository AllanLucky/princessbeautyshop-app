import ejs from "ejs";
import dotenv from "dotenv";
import sendMail from "../helpers/sendMailer.js";
import Timetable from "../models/timetableModel.js";
import path from "path";

dotenv.config();

/*
================================================
SKINCARE REMINDER SERVICE (PRODUCTION VERSION)
================================================
*/

const sendSkincareReminder = async (timeOfDay) => {
  try {
    console.log(`🕑 Starting ${timeOfDay} skincare reminder process...`);

    if (!["morning", "evening"].includes(timeOfDay)) {
      console.error("❌ Invalid reminder time provided. Must be 'morning' or 'evening'.");
      return;
    }

    // Determine which email flag to use
    const emailFlag =
      timeOfDay === "morning"
        ? { reminderEmailSentMorning: false }
        : { reminderEmailSentEvening: false };

    // Fetch timetable requests
    const timetableRequests = await Timetable.find({
      status: 1,
      ...emailFlag,
      email: { $exists: true, $ne: null },
    })
      .limit(50)
      .lean();

    if (!timetableRequests.length) {
      console.log(`ℹ️ No users found for ${timeOfDay} reminders.`);
      return;
    }

    console.log(`📧 Sending ${timeOfDay} reminders to ${timetableRequests.length} users...`);

    const routineType = timeOfDay === "morning" ? "AM" : "PM";
    const subjectTime = timeOfDay === "morning" ? "Morning" : "Evening";

    for (const request of timetableRequests) {
      try {
        console.log(`🔔 Preparing ${timeOfDay} reminder for ${request.email}...`);

        // Construct path to EJS template
        const templatePath = path.join(process.cwd(), "templates", "reminder.ejs");

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
          console.log(`✅ Reminder sent successfully to ${request.email}`);

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
          console.error(
            `❌ Failed to send reminder to ${request.email}`,
            result?.error
          );
        }
      } catch (error) {
        console.error(
          `❌ Error sending ${timeOfDay} reminder to ${request.email}:`,
          error.message
        );
      }
    }

    console.log(`🏁 ${timeOfDay} skincare reminder process completed.`);
  } catch (error) {
    console.error(`❌ Service error in skincare reminder:`, error.message);
  }
};

export default sendSkincareReminder;