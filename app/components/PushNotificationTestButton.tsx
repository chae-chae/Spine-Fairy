"use client";

export default function PushNotificationTestButton() {
  const sendPushNotification = async () => {
    console.log("푸시 알림 버튼 클릭됨");
    if (Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();
      console.log("Notification permission:", permission);
      if (permission !== "granted") {
        console.warn("푸시 알림 권한이 거부되었습니다.");
        return;
      }
    }
    const registration = await navigator.serviceWorker.getRegistration();
    console.log("Service Worker registration:", registration);
    if (registration) {
      registration.showNotification("Spine Fairy 푸시 알림", {
        body: "이것은 테스트 푸시 알림입니다.",
        icon: "/icon.png",
      });
      console.log("푸시 알림 발송됨");
    } else {
      console.error("Service Worker registration not found.");
    }
  };

  return (
    <button
      onClick={sendPushNotification}
      className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-transform duration-300"
    >
      푸시 알림 테스트
    </button>
  );
}
