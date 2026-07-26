self.addEventListener("push", (event) => {
  let data = { title: "Neues Signal", body: "" };

  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch {
    data.body = event.data ? event.data.text() : "";
  }

  event.waitUntil(
    self.registration.showNotification(data.title || "Neues Signal", {
      body: data.body || "",
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      data: { url: data.url || "/signale" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/signale";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(url) && "focus" in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(url);
        }
      })
  );
});
