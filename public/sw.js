// public/sw.js
self.addEventListener("push", function (event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "Spine Fairy";
  const options = {
    body: data.body || "바로 앉으세요! 🪑",
    icon: data.icon || "/icon.png", // 프로젝트 내 아이콘 경로
    badge: data.badge || "/badge.png", // 프로젝트 내 배지 아이콘 경로
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window" }).then(function (clientList) {
      if (clientList.length > 0) {
        let client = clientList[0];
        return client.focus();
      }
      return clients.openWindow("/");
    })
  );
});
