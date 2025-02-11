"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [minutes, setMinutes] = useState<number | "">("");
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (secondsLeft !== null && secondsLeft > 0 && !isPaused) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (secondsLeft === 0) {
      setShowModal(true);
      triggerNotification();
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [secondsLeft, isPaused]);

  const startTimer = () => {
    if (!minutes || minutes <= 0) {
      alert("1분 이상 입력해주세요!");
      return;
    }
    setSecondsLeft(minutes * 60);
    setIsPaused(false); // 타이머 시작 시 일시정지 상태 해제
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const resumeTimer = () => {
    setIsPaused(false);
  };

  // 타이머 리셋 함수: 모든 상태를 초기화
  const resetTimer = () => {
    setSecondsLeft(null);
    setIsPaused(false);
    // 필요하다면 minutes 상태도 초기화할 수 있음
    // setMinutes("");
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
      <h1 className="text-5xl font-bold text-green-900 mb-8 drop-shadow-lg">
        Spine Fairy 🧚‍♂️
      </h1>

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

        {secondsLeft !== null && (
          <>
            <p className="mt-4 text-lg font-semibold text-green-800">
              남은 시간: {formatTime(secondsLeft)}
            </p>
            <div className="mt-4 flex justify-center gap-2">
              {!isPaused ? (
                <button
                  onClick={pauseTimer}
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors duration-300"
                >
                  일시정지
                </button>
              ) : (
                <button
                  onClick={resumeTimer}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
                >
                  재시작
                </button>
              )}
              <button
                onClick={resetTimer}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-300"
              >
                리셋
              </button>
            </div>
          </>
        )}
      </div>

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
