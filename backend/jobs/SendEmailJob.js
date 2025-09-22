import logger from "../config/logger.js";
import { sendEmail } from "../config/mailer.js";

export const emailQueueName = "email-queue";

function normalizeJobs(data) {
  if (!data) {
    return [];
  }

  if (Array.isArray(data)) {
    return data;
  }

  // Support single job objects by converting them to an array
  return [data];
}

function resolveRecipient(job) {
  return job?.toEmail || job?.to || job?.email || null;
}

function resolveBody(job) {
  return job?.body || job?.html || job?.message || null;
}

export const emailQueue = {
  async add(_queueName, data) {
    const jobs = normalizeJobs(data);
    if (jobs.length === 0) {
      logger.warn("Email queue received an empty batch");
      return [];
    }

    const results = [];

    for (const item of jobs) {
      const toEmail = resolveRecipient(item);
      if (!toEmail) {
        const error = new Error("Missing recipient email address");
        logger.error("Email send failed due to missing recipient", { item });
        results.push({ email: null, status: "failed", error: error.message });
        continue;
      }

      const emailBody = resolveBody(item);
      if (!emailBody) {
        const error = new Error("Missing email body");
        logger.error("Email send failed due to missing body", { item });
        results.push({ email: toEmail, status: "failed", error: error.message });
        continue;
      }

      try {
        const subject = item?.subject || "";
        logger.info(`Sending email to: ${toEmail}`);
        await sendEmail(toEmail, subject, emailBody);
        logger.info(`Email sent successfully to: ${toEmail}`);
        results.push({ email: toEmail, status: "success" });
      } catch (error) {
        logger.error(`Email send failed for ${toEmail}:`, error);
        results.push({ email: toEmail, status: "failed", error: error.message });
      }
    }

    const successCount = results.filter((r) => r.status === "success").length;
    if (successCount === 0) {
      throw new Error("All email sends failed");
    }

    logger.info({
      message: "Email batch processed",
      queue: emailQueueName,
      successCount,
      failureCount: results.length - successCount,
    });

    return results;
  },
};
