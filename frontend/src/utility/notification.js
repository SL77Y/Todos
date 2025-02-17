import { subscribeNotifications } from "./utils";

// Frontend: Request permission to send push notifications
export const requestNotificationPermission = async () => {
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    console.log("Notification permission granted.");

    // Get the service worker registration (you need to register a service worker for push notifications)
    const registration = await navigator.serviceWorker.ready;

    console.log("Public VAPID key:", import.meta.env.VITE_PUBLIC_VAPID_KEY);

    // Subscribe to push notifications
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: import.meta.env.VITE_PUBLIC_VAPID_KEY, // Your public VAPID key
    });

    // Send the subscription to the server for future notifications
    await subscribeNotifications(subscription);
  } else {
    console.error("Notification permission denied.");
  }
};
