"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// 원형 진행바 컴포넌트
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
      {/* 배경 원 */}
      <circle
        className="text-green-300"
        stroke="currentColor"
        strokeWidth="8"
        fill="transparent"
        r={radius}
        cx="50"
        cy="50"
      />
      {/* 진행 원 */}
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
      {/* 중앙 텍스트 */}
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

  // const triggerNotification = () => {
  //   const message =
  //     localStorage.getItem("customAlertMessage") || "바로 앉으세요! 🪑";
  //   if (typeof window !== "undefined" && "Notification" in window) {
  //     if (Notification.permission === "granted") {
  //       new Notification("Spine Fairy 🧚‍♂️", { body: message });
  //     } else if (Notification.permission !== "denied") {
  //       Notification.requestPermission().then((permission) => {
  //         if (permission === "granted") {
  //           new Notification("Spine Fairy 🧚‍♂️", { body: message });
  //         }
  //       });
  //     }
  //   }
  // };

  const triggerNotification = () => {
    const message =
      localStorage.getItem("customAlertMessage") || "바로 앉으세요! 🪑";

    // 알림 히스토리 기록 추가
    const now = new Date().toISOString();
    const historyEntry = { time: now, message };
    const historyString = localStorage.getItem("notificationHistory");
    const history = historyString ? JSON.parse(historyString) : [];
    history.push(historyEntry);
    localStorage.setItem("notificationHistory", JSON.stringify(history));

    // 브라우저 알림 실행
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
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-200 to-green-600 p-6">
      <h1 className="text-5xl font-bold text-green-900 mb-8 drop-shadow-lg">
        Spine Fairy 🧚‍♂️
      </h1>

      <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-xl w-80 text-center border border-green-300">
        {/* 기존 타이머 설정 UI */}
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

        {secondsLeft !== null && initialSeconds !== null && (
          <>
            {/* 원형 진행바 및 타이머 제어 UI */}
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

      {/* 하단에 설정 및 히스토리 페이지로 이동하는 버튼 추가 */}
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
