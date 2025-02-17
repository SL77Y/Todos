self.addEventListener("push", (event) => {
  console.log(event);
  const data = event.data.json(); // Get the push message data
  console.log("Push event received:", data);

  const options = {
    body: data.body,
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options) // Show notification
  );
});
