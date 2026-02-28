// analyticsCleanup.js
import cron from 'node-cron';
import Analytics from '../models/analyticsModel.js';

/**
 * Cleanup old analytics records
 * @param {Number} retentionDays - number of days to keep data
 */
const cleanupOldAnalytics = async (retentionDays = 7) => {
  try {
    console.log('📊 Starting analytics cleanup...');

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const result = await Analytics.deleteMany({
      createdAt: { $lt: cutoffDate }
    });

    console.log(
      `✅ Analytics cleanup completed: Deleted ${result.deletedCount} records older than ${retentionDays} days`
    );

  } catch (error) {
    console.error('❌ Analytics cleanup failed:', error);
    // Optional: Retry logic or send alert email to admin
  }
};

/**
 * Schedule cleanup using cron
 * Runs daily at 2:00 AM New York time
 */
const scheduleAnalyticsCleanup = (retentionDays = 7) => {
  cron.schedule('0 2 * * *', () => cleanupOldAnalytics(retentionDays), {
    scheduled: true,
    timezone: 'America/New_York'
  });

  console.log('⏰ Analytics cleanup scheduled: Daily at 2:00 AM New York time');
};

export { cleanupOldAnalytics, scheduleAnalyticsCleanup };