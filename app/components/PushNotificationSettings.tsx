"use client";
import { useState, useEffect } from "react";

export default function PushNotificationSettings() {
  const [autoPush, setAutoPush] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("autoPushNotification");
    if (stored !== null) {
      setAutoPush(JSON.parse(stored));
    }
  }, []);

  const toggleAutoPush = async () => {
    const newValue = !autoPush;
    setAutoPush(newValue);
    localStorage.setItem("autoPushNotification", JSON.stringify(newValue));

    // 만약 활성화하면 자동으로 권한 요청
    if (newValue && Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();
      console.log("Notification permission after toggle:", permission);
    }
  };

  return (
    <div className="mt-4">
      <label className="inline-flex items-center">
        <input
          type="checkbox"
          checked={autoPush}
          onChange={toggleAutoPush}
          className="form-checkbox h-5 w-5 text-green-600"
        />
        <span className="ml-2 text-green-700 dark:text-green-200">
          자동 푸시 알림 활성화
        </span>
      </label>
    </div>
  );
}
