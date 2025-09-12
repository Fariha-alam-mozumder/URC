import { Queue, Worker } from "bullmq";
import { defaultQueueConfig, redisConnection } from "../config/queue.js";
import logger from "../config/logger.js";
import { sendEmail } from "../config/mailer.js";

export const emailQueueName = "email-queue";
export const emailQueue = new Queue(emailQueueName, {
  connection: redisConnection,
  defaultJobOptions: {
    ...defaultQueueConfig,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
});

export const handler = new Worker(
  emailQueueName,
  async (job) => {
    console.log("Processing email job:", job.id);
    const data = job.data;
    
    if (!Array.isArray(data)) {
      throw new Error("Invalid job data format");
    }

    const results = [];
    
    for (const item of data) {
      try {
        console.log(`Sending email to: ${item.toEmail}`);
        await sendEmail(item.toEmail, item.subject, item.body);
        console.log(`Email sent successfully to: ${item.toEmail}`);
        results.push({ email: item.toEmail, status: 'success' });
      } catch (error) {
        console.error(`Failed to send email to ${item.toEmail}:`, error);
        logger.error(`Email send failed for ${item.toEmail}:`, error);
        results.push({ email: item.toEmail, status: 'failed', error: error.message });
        // Continue with other emails even if one fails
      }
    }
    
    // If all emails failed, throw error to trigger retry
    const successCount = results.filter(r => r.status === 'success').length;
    if (successCount === 0) {
      throw new Error('All email sends failed');
    }
    
    return results;
  },
  {
    connection: redisConnection,
    concurrency: 5, // Process up to 5 email jobs simultaneously
  }
);

// Enhanced error handling
handler.on("completed", (job, result) => {
  logger.info({
    jobId: job.id,
    result: result,
    message: "Email job completed successfully",
  });
  console.log(`Email job ${job.id} completed successfully`);
});

handler.on("failed", (job, err) => {
  logger.error({
    jobId: job?.id,
    error: err.message,
    stack: err.stack,
    data: job?.data,
    message: "Email job failed",
  });
  console.error(`Email job ${job?.id} failed:`, err.message);
});

handler.on("error", (err) => {
  console.error("Email worker error:", err);
  logger.error("Email worker error:", err);
});

emailQueue.on("error", (err) => {
  console.error("Email queue error:", err);
  logger.error("Email queue error:", err);
});

// Add graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down email worker gracefully...');
  await handler.close();
  await emailQueue.close();
  process.exit(0);
});