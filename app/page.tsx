"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// 원형 진행바 컴포넌트 (변경 없음)
function CircularProgressBar({
  secondsLeft,
  initialSeconds,
}: {
  secondsLeft: number;
  initialSeconds: number;
}) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const progress = (initialSeconds - secondsLeft) / initialSeconds;
  const offset = circumference - progress * circumference;

  return (
    <svg className="w-24 h-24 mx-auto" viewBox="0 0 100 100">
      <circle
        className="text-green-300"
        stroke="currentColor"
        strokeWidth="8"
        fill="transparent"
        r={radius}
        cx="50"
        cy="50"
      />
      <circle
        className="text-green-700"
        stroke="currentColor"
        strokeWidth="8"
        fill="transparent"
        r={radius}
        cx="50"
        cy="50"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        className="text-green-800 font-bold text-lg"
      >
        {Math.floor(secondsLeft / 60)}:
        {(secondsLeft % 60).toString().padStart(2, "0")}
      </text>
    </svg>
  );
}

export default function Home() {
  const [minutes, setMinutes] = useState<number | "">("");
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [initialSeconds, setInitialSeconds] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // 다크 모드 상태 업데이트
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // 타이머 카운트다운 로직
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
    const secs = minutes * 60;
    setInitialSeconds(secs);
    setSecondsLeft(secs);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const resumeTimer = () => {
    setIsPaused(false);
  };

  const resetTimer = () => {
    setSecondsLeft(null);
    setInitialSeconds(null);
    setIsPaused(false);
  };

  // 스누즈 기능: 기본 스누즈 시간 5분 (변경 가능)
  const snoozeTimer = () => {
    setShowModal(false);
    const snoozeMinutes = 5;
    const snoozeSeconds = snoozeMinutes * 60;
    setInitialSeconds(snoozeSeconds);
    setSecondsLeft(snoozeSeconds);
    setIsPaused(false);
  };

  const triggerNotification = () => {
    const message =
      localStorage.getItem("customAlertMessage") || "바로 앉으세요! 🪑";
    const now = new Date().toISOString();
    const historyEntry = { time: now, message };
    const historyString = localStorage.getItem("notificationHistory");
    const history = historyString ? JSON.parse(historyString) : [];
    history.push(historyEntry);
    localStorage.setItem("notificationHistory", JSON.stringify(history));

    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("Spine Fairy 🧚‍♂️", { body: message });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification("Spine Fairy 🧚‍♂️", { body: message });
          }
        });
      }
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-200 to-green-600 p-6 dark:from-green-900 dark:to-green-800">
      <h1 className="text-5xl font-bold text-green-900 mb-8 drop-shadow-lg dark:text-green-100">
        Spine Fairy 🧚‍♂️
      </h1>

      <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-xl w-80 text-center border border-green-300 dark:bg-green-800 dark:border-green-600">
        <label className="block text-lg font-medium text-green-700 mb-2 dark:text-green-200">
          알림 받을 시간 (분)
        </label>
        <input
          type="number"
          min="1"
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value))}
          className="w-full p-2 border border-green-400 rounded focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-green-700 dark:text-green-100 dark:border-green-600"
        />
        <button
          onClick={startTimer}
          className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors duration-300"
        >
          설정하기
        </button>

        {secondsLeft !== null && initialSeconds !== null && (
          <>
            <div className="mt-4">
              <CircularProgressBar
                secondsLeft={secondsLeft}
                initialSeconds={initialSeconds}
              />
            </div>
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

      <div className="mt-6 flex gap-4">
        <Link href="/settings">
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-300">
            사용자 맞춤 설정
          </button>
        </Link>
        <Link href="/history">
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-300">
            알림 히스토리
          </button>
        </Link>
        <button
          onClick={() => setDarkMode((prev) => !prev)}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors duration-300"
        >
          {darkMode ? "라이트 모드" : "다크 모드"}
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-green-900 bg-opacity-50 dark:bg-green-800 dark:bg-opacity-70">
          <div className="bg-white bg-opacity-95 p-6 rounded-lg shadow-xl border border-green-400 dark:bg-green-800 dark:border-green-600">
            <p className="text-xl font-bold text-green-800 dark:text-green-100">
              🪑 바로 앉으세요!
            </p>
            <div className="mt-4 flex justify-center gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-300"
              >
                닫기
              </button>
              <button
                onClick={snoozeTimer}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-300"
              >
                스누즈
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
