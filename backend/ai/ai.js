import dotenv from "dotenv";

import { createCompletion, loadModel } from "gpt4all";

dotenv.config(); // Load environment variables

// Initialize the GPT4All Chat API
const chatAPI = await loadModel("orca-mini-3b-gguf2-q4_0.gguf", {
  verbose: false, // logs loaded model configuration
  device: "cpu", // defaults to 'cpu'
  nCtx: 2048, // the maximum sessions context window size.
});

export const prioritizeTasks = async (tasks) => {
  const prompt = `I have the following tasks to complete: ${tasks
    .map(
      (task) => ` Tasks:
  Task "${task.title}" with description "${task.description}", prority ${task.priority} and progress til now ${task.progress} and deadline ${task.deadline} completed ${task.completed}`
    )
    .join(
      ", "
    )}. Please prioritize them based on urgency and importance deadline.`;

  try {
    const response = await createCompletion(chatAPI, prompt);
    console.log(
      "Prioritization response:",
      response.choices[0].message.content
    );
    return response.choices[0].message.content; // Return the prioritized tasks or advice
  } catch (error) {
    console.error("Error prioritizing tasks:", error);
  }
};

export const getProductivityAdvice = async ({
  title,
  description,
  priority,
  progress,
  deadline,
  completed,
}) => {
  const prompt = `
  You are a productivity coach. Analyze the following tasks and suggest ways to improve productivity:
  
  Tasks:
  Task "${title}" with description "${description}", prority ${priority} and progress til now ${progress} and deadline ${deadline} and completed ${completed}
  `;
  try {
    const response = await createCompletion(chatAPI, prompt);
    // console.log("Productivity advice:", response.choices[0].message.content);
    return response.choices[0].message.content; // Return the productivity advice
  } catch (error) {
    console.error("Error fetching productivity advice:", error);
  }
};

export const sendRemindersForOverdueTasks = async (tasks) => {
  const overdueTasks = tasks.filter((task) => {
    const deadlineDate = new Date(task.deadline);
    return !task.completed && deadlineDate < new Date();
  });

  if (overdueTasks.length === 0) {
    console.log("No overdue tasks found.");
    return;
  }

  const prompt = `I have the following overdue tasks: ${overdueTasks
    .map(
      (task) =>
        ` Task "${task.title}" with description "${task.description}", priority ${task.priority}, progress ${task.progress}, deadline ${task.deadline}`
    )
    .join(", ")}. Please generate reminder messages for these tasks.`;

  try {
    const response = await createCompletion(chatAPI, prompt);
    const reminders = response.choices[0].message.content;
    console.log("Reminder messages:", reminders);
    return reminders; // Return the reminder messages
  } catch (error) {
    console.error("Error generating reminders:", error);
  }
};
