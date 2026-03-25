// analyticsCleanup.js

import cron from 'node-cron';
import Analytics from '../models/analyticsModel.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Cleanup old analytics records
 * @param {number} retentionDays - number of days to keep data (default: 7)
 */
const cleanupOldAnalytics = async (retentionDays = 7) => {
  try {
    const now = new Date();
    console.log(`📊 [${now.toISOString()}] Starting analytics cleanup...`);

    // Calculate cutoff date
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    // Delete old analytics records
    const result = await Analytics.deleteMany({
      createdAt: { $lt: cutoffDate }
    });

    console.log(
      `✅ [${now.toISOString()}] Analytics cleanup completed: Deleted ${result.deletedCount} record(s) older than ${retentionDays} day(s)`
    );
  } catch (error) {
    console.error(`❌ [${new Date().toISOString()}] Analytics cleanup failed:`, error);

    // Optional: implement retry logic or notify admin via email/slack
    // e.g., notifyAdmin(error);
  }
};

/**
 * Schedule cleanup using cron
 * Runs daily at 2:00 AM New York time
 * @param {number} retentionDays - number of days to keep data
 */
const scheduleAnalyticsCleanup = (retentionDays = process.env.ANALYTICS_RETENTION_DAYS || 7) => {
  cron.schedule(
    '0 2 * * *', // 2:00 AM daily
    async () => {
      console.log(`⏰ [${new Date().toISOString()}] Running scheduled analytics cleanup...`);
      await cleanupOldAnalytics(Number(retentionDays));
    },
    {
      scheduled: true,
      timezone: 'America/New_York'
    }
  );

  console.log(`⏰ Analytics cleanup scheduled: Daily at 2:00 AM New York time (Retention: ${retentionDays} days)`);
};

export { cleanupOldAnalytics, scheduleAnalyticsCleanup };