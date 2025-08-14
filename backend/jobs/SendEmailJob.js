import { Queue, Worker } from "bullmq";
import { defaultQueueConfig, redisConnection } from "../config/queue.js";
import logger from "../config/logger.js";
import { sendEmail } from "../config/mailer.js";

//! Queue: Redis e entry dibe
//! Worker: Listens entries from Redis and processes them

export const emailQueueName = "email-queue";
export const emailQueue = new Queue(emailQueueName, {
  // ami queue ke bujhacchi kon redis e entry korbe
  connection: redisConnection,
  defaultJobOptions: defaultQueueConfig,
});

//! Define workers
export const handler = new Worker(
  emailQueueName,
  async (job) => {
    //!The name inside Worker() must match the queue name "email-queue" .
    //* for example the variable name is " emailQueueName" here
    console.log("The email worker data is", job.data);
    const data = job.data;
    data?.map(async (item) => {
        console.log(`Sending email to: ${item.toEmail}`);
        await sendEmail(item.toEmail, item.subject, item.body);
        console.log(`Email sent successfully to: ${item.toEmail}`);
    });
  },
  {
    connection: redisConnection,
  }
);

//! Worker listeners
handler.on("completed", (job) => {
  logger.info({
    job: job,
    message: "Job completed.",
  });
  console.log(`The job ${job.id} is completed.`);
});

handler.on("failed", (job) => {
  console.log(`The job ${job.id} is failed.`);
});

// Add to SendEmailJob.js
handler.on('error', (err) => {
  console.error('Worker error:', err);
  logger.error('Worker error:', err);
});

emailQueue.on('error', (err) => {
  console.error('Queue error:', err);
  logger.error('Queue error:', err);
});