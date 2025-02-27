"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// 원형 진행바 컴포넌트 (애니메이션 효과 추가)
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
      {/* 진행 원 - transition 효과 추가 */}
      <circle
        className="text-green-700 transition-all duration-500"
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

  // 반복 알림 관련 상태
  const [recurringEnabled, setRecurringEnabled] = useState(false);
  const [recurringInterval, setRecurringInterval] = useState<number>(10); // 기본 10분

  // 다양한 테마 옵션 (이전 코드와 동일)
  const [theme, setTheme] = useState("default");
  const themes = ["default", "forest", "ocean", "sunset"];
  const themeClasses: { [key: string]: string } = {
    default:
      "bg-gradient-to-br from-green-200 to-green-600 dark:from-green-900 dark:to-green-800",
    forest:
      "bg-gradient-to-br from-green-300 to-green-700 dark:from-green-800 dark:to-green-900",
    ocean:
      "bg-gradient-to-br from-blue-200 to-blue-500 dark:from-blue-800 dark:to-blue-900",
    sunset:
      "bg-gradient-to-br from-yellow-200 to-pink-500 dark:from-purple-800 dark:to-pink-900",
  };

  // 다크 모드 적용
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

  // 스누즈 기능: 기본 스누즈 시간 5분
  const snoozeTimer = () => {
    setShowModal(false);
    const snoozeMinutes = 5;
    const snoozeSeconds = snoozeMinutes * 60;
    setInitialSeconds(snoozeSeconds);
    setSecondsLeft(snoozeSeconds);
    setIsPaused(false);
  };

  // 반복 알림 기능
  const startRecurringTimer = () => {
    setShowModal(false);
    const secs = recurringInterval * 60;
    setInitialSeconds(secs);
    setSecondsLeft(secs);
    setIsPaused(false);
  };

  // 자세 피드백 기록 함수
  const recordFeedback = (feedback: "correct" | "incorrect") => {
    const now = new Date().toISOString();
    const feedbackEntry = { time: now, feedback };
    const storedFeedback = localStorage.getItem("postureFeedbackHistory");
    const feedbackHistory = storedFeedback ? JSON.parse(storedFeedback) : [];
    feedbackHistory.push(feedbackEntry);
    localStorage.setItem(
      "postureFeedbackHistory",
      JSON.stringify(feedbackHistory)
    );
    setShowModal(false);
  };

  // 알림과 함께 히스토리 기록
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

  // 테마 변경
  const changeTheme = () => {
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
    localStorage.setItem("selectedTheme", themes[nextIndex]);
  };

  // 페이지가 마운트될 때 저장된 테마 불러오기
  useEffect(() => {
    const storedTheme = localStorage.getItem("selectedTheme");
    if (storedTheme && themes.includes(storedTheme)) {
      setTheme(storedTheme);
    }
  }, []);

  return (
    <main
      className={`flex flex-col items-center justify-center min-h-screen ${themeClasses[theme]} p-6`}
    >
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
          className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-transform duration-300 hover:scale-105"
        >
          설정하기
        </button>

        {/* 반복 알림 설정 UI */}
        <div className="mt-4 text-left">
          <label className="inline-flex items-center text-green-700 dark:text-green-200">
            <input
              type="checkbox"
              checked={recurringEnabled}
              onChange={(e) => setRecurringEnabled(e.target.checked)}
              className="form-checkbox h-5 w-5 text-green-600"
            />
            <span className="ml-2">반복 알림 활성화</span>
          </label>
          {recurringEnabled && (
            <div className="mt-2">
              <label className="block text-green-700 dark:text-green-200 text-sm">
                반복 간격 (분)
              </label>
              <input
                type="number"
                min="1"
                value={recurringInterval}
                onChange={(e) => setRecurringInterval(Number(e.target.value))}
                className="w-full p-1 border border-green-400 rounded focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-green-700 dark:text-green-100 dark:border-green-600"
              />
            </div>
          )}
        </div>

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
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-transform duration-300 hover:scale-105"
                >
                  일시정지
                </button>
              ) : (
                <button
                  onClick={resumeTimer}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-transform duration-300 hover:scale-105"
                >
                  재시작
                </button>
              )}
              <button
                onClick={resetTimer}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-transform duration-300 hover:scale-105"
              >
                리셋
              </button>
            </div>
          </>
        )}
      </div>

      <div className="mt-6 flex gap-4 flex-wrap justify-center">
        <Link href="/settings">
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-transform duration-300 hover:scale-105">
            사용자 맞춤 설정
          </button>
        </Link>
        <Link href="/history">
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-transform duration-300 hover:scale-105">
            알림 히스토리
          </button>
        </Link>
        <Link href="/statistics">
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-transform duration-300 hover:scale-105">
            피드백 통계
          </button>
        </Link>
        <Link href="/tips">
          <button className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-transform duration-300 hover:scale-105">
            자세 개선 팁
          </button>
        </Link>
        <Link href="/rewards">
          <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-transform duration-300 hover:scale-105">
            보상 확인
          </button>
        </Link>
        <button
          onClick={() => setDarkMode((prev) => !prev)}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-transform duration-300 hover:scale-105"
        >
          {darkMode ? "라이트 모드" : "다크 모드"}
        </button>
        <button
          onClick={changeTheme}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-transform duration-300 hover:scale-105"
        >
          테마 변경
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-green-900 bg-opacity-50 dark:bg-green-800 dark:bg-opacity-70">
          <div className="animate-fadeIn bg-white bg-opacity-95 p-6 rounded-lg shadow-xl border border-green-400 dark:bg-green-800 dark:border-green-600">
            <p className="text-xl font-bold text-green-800 dark:text-green-100">
              🪑 바로 앉으세요!
            </p>
            <p className="mt-2 text-md text-green-800 dark:text-green-100">
              자세를 교정하셨나요?
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => recordFeedback("correct")}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-transform duration-300 hover:scale-105"
              >
                네, 잘했어요
              </button>
              <button
                onClick={() => recordFeedback("incorrect")}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-transform duration-300 hover:scale-105"
              >
                아니요
              </button>
              <button
                onClick={snoozeTimer}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-transform duration-300 hover:scale-105"
              >
                스누즈
              </button>
              {recurringEnabled && (
                <button
                  onClick={startRecurringTimer}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-transform duration-300 hover:scale-105"
                >
                  반복 알림
                </button>
              )}
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-transform duration-300 hover:scale-105"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
