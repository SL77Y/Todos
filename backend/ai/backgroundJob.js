import cron from "node-cron";
import { sendRemindersForOverdueTasks } from "./ai.js";
import { getAllTask } from "../services/blockChain.js";

// Schedule a cron job to run every day at midnight
cron.schedule("0 0 * * *", async () => {
  console.log("Running background job to check for overdue tasks...");

  try {
    const tasks = await getAllTask();
    const reminders = await sendRemindersForOverdueTasks(tasks);

    if (reminders) {
      // Here you can send the reminders as notifications
      // For example, using a notification service or email service
      console.log("Sending reminders:", reminders);
    }
  } catch (error) {
    console.error("Error in background job:", error);
  }
});
