import webPush from "web-push";
import dotenv from "dotenv";
import {
  readSubscriptions,
  saveSubscriptions,
} from "../routes/notificationRoute.js";

dotenv.config();

// Set up VAPID keys
const publicVapidKey = process.env.VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.VAPID_PRIVATE_KEY;

const removeExpiredSubscription = (subscription) => {
  const subscriptions = readSubscriptions(); // Read the current subscriptions
  const updatedSubscriptions = subscriptions.filter(
    (sub) => sub.endpoint !== subscription.endpoint
  );
  saveSubscriptions(updatedSubscriptions); // Save the updated list back to the file
  console.log("Expired subscription removed.");
};

// Configure the web-push library
webPush.setVapidDetails(
  "mailto:mr.singh160320@gmail.com", // Your email here
  publicVapidKey,
  privateVapidKey
);

// Function to send a push notification
const sendPushNotification = async (subscription, message) => {
  const payload = JSON.stringify({
    title: "Task Reminder",
    body: message,
  });

  try {
    // Attempt to send the push notification
    await webPush.sendNotification(subscription, payload);
    console.log("Push notification sent successfully!");
  } catch (error) {
    console.error("Error sending push notification:", error);

    // Handle the specific case where the subscription has expired
    if (error.statusCode === 410) {
      console.log("Subscription expired. Removing it.");
      // Remove the subscription from the database or stored list
      removeExpiredSubscription(subscription);
    }
  }
};

// Export function for use in your routes
export { sendPushNotification };
