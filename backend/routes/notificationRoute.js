import { Router } from "express";
import fs from "fs";
import path from "path";
import { sendPushNotification } from "../webpush/webpush.js";

import { fileURLToPath } from "url";

// Get the directory name using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const notificationRoutes = Router();

// Path to the JSON file where subscriptions will be stored
const subscriptionFilePath = path.join(
  __dirname,
  "../webpush/subscriptions.json"
);
console.log(subscriptionFilePath);

// Helper function to read the subscriptions from the JSON file
export const readSubscriptions = () => {
  try {
    const data = fs.readFileSync(subscriptionFilePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading subscriptions:", err);
    return []; // Return an empty array if reading the file fails
  }
};

// Helper function to save the subscriptions to the JSON file
export const saveSubscriptions = (subscriptions) => {
  try {
    fs.writeFileSync(
      subscriptionFilePath,
      JSON.stringify(subscriptions, null, 2)
    );
  } catch (err) {
    console.error("Error saving subscriptions:", err);
  }
};

// Store push subscription when the client subscribes
notificationRoutes.post("/subscribe", (req, res) => {
  const { subscription } = req.body;

  // Get the existing subscriptions
  const subscriptions = readSubscriptions();

  // Check if the subscription already exists based on the endpoint
  const subscriptionExists = subscriptions.some(
    (existingSubscription) =>
      existingSubscription.endpoint === subscription.endpoint
  );

  if (subscriptionExists) {
    return res.status(200).json({ message: "Already subscribed!" });
  }

  // Add the new subscription
  subscriptions.push(subscription);

  // Save the updated subscriptions to the file
  saveSubscriptions(subscriptions);

  res.status(200).json({ message: "Subscription saved!" });
});

// Example endpoint for sending notifications
notificationRoutes.post("/sendNotification", async (req, res) => {
  const { message } = req.body;

  // Get the stored subscriptions
  const subscriptions = readSubscriptions();

  // Send push notifications to all stored subscriptions
  for (const subscription of subscriptions) {
    console.log("Sending notification to:", subscription.endpoint);
    await sendPushNotification(subscription, message);
  }

  res.status(200).json({ message: "Notification sent to all subscribers!" });
});

export default notificationRoutes;
