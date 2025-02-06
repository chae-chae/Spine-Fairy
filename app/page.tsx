"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [minutes, setMinutes] = useState<number | "">("");
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (secondsLeft !== null && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (secondsLeft === 0) {
      setShowModal(true);
      triggerNotification();
    }
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const startTimer = () => {
    if (!minutes || minutes <= 0) {
      alert("1분 이상 입력해주세요!");
      return;
    }
    setSecondsLeft(minutes * 60);
  };

  const triggerNotification = () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("Spine Fairy 🧚‍♂️", { body: "바로 앉으세요! 🪑" });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification("Spine Fairy 🧚‍♂️", { body: "바로 앉으세요! 🪑" });
          }
        });
      }
    }
  };

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-200 to-green-600 p-6">
      {/* 사이트 제목 */}
      <h1 className="text-5xl font-bold text-green-900 mb-8 drop-shadow-lg">
        Spine Fairy 🧚‍♂️
      </h1>

      {/* 알림 설정 카드 */}
      <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-xl w-80 text-center border border-green-300">
        <label className="block text-lg font-medium text-green-700 mb-2">
          알림 받을 시간 (분)
        </label>
        <input
          type="number"
          min="1"
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value))}
          className="w-full p-2 border border-green-400 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={startTimer}
          className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors duration-300"
        >
          설정하기
        </button>

        {/* 남은 시간 표시 */}
        {secondsLeft !== null && (
          <p className="mt-4 text-lg font-semibold text-green-800">
            남은 시간: {formatTime(secondsLeft)}
          </p>
        )}
      </div>

      {/* 모달 창 (알림) */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-green-900 bg-opacity-50">
          <div className="bg-white bg-opacity-95 p-6 rounded-lg shadow-xl border border-green-400">
            <p className="text-xl font-bold text-green-800">
              🪑 바로 앉으세요!
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-300"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
