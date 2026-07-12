import cron from "cron";
import http from "http";

const job = new cron.CronJob("*/14 * * * *", function () {
  const url = process.env.BACKEND_SITE_URL || "http://localhost:4000";

  http
    .get(`${url}/api/v1/server/wakeup`, (res) => {
      if (res.statusCode === 200) {
        console.log(
          "✓ Keep-alive ping sent successfully at",
          new Date().toISOString(),
        );
      } else {
        console.log("✗ Keep-alive ping failed with status", res.statusCode);
      }
    })
    .on("error", (e) => console.error("✗ Keep-alive ping error:", e.message));
});

export const startCronJob = () => {
  job.start();
  console.log("✓ Keep-alive cron job started (every 14 minutes)");
};

export const stopCronJob = () => {
  job.stop();
  console.log("✓ Keep-alive cron job stopped");
};

export default job;

// CRON JOB EXPLANATION:
// Cron jobs are scheduled tasks that run periodically at fixed intervals
// we want to send 1 GET request for every 14 minutes

// How to define a "Schedule"?
// You define a schedule using a cron expression, which consists of 5 fields representing:

//! MINUTE, HOUR, DAY OF THE MONTH, MONTH, DAY OF THE WEEK

//? EXAMPLES && EXPLANATION:
//* 14 * * * * - Every 14 minutes
//* 0 0 * * 0 - At midnight on every Sunday
//* 30 3 15 * * - At 3:30 AM, on the 15th of every month
//* 0 0 1 1 * - At midnight, on January 1st
//* 0 * * * * - Every hour
