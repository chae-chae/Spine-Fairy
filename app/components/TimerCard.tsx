"use client";
import { useState, useEffect } from "react";
import CircularProgressBar from "./CircularProgressBar";

export default function TimerCard() {
  const [minutes, setMinutes] = useState<number | "">("");
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [initialSeconds, setInitialSeconds] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (secondsLeft !== null && secondsLeft > 0 && !isPaused) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (secondsLeft === 0) {
      setShowModal(true);

      // 자동 푸시 알림 활성화 옵션 확인
      const autoPush = localStorage.getItem("autoPushNotification");
      if (autoPush && JSON.parse(autoPush) === true) {
        if (Notification.permission === "granted") {
          navigator.serviceWorker.getRegistration().then((registration) => {
            if (registration) {
              registration.showNotification("Spine Fairy 푸시 알림", {
                body: "타이머 종료: 올바른 자세를 유지하세요!",
                icon: "/icon.png", // 아이콘 경로 확인
              });
            }
          });
        }
      }
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
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

  const pauseTimer = () => setIsPaused(true);
  const resumeTimer = () => setIsPaused(false);
  const resetTimer = () => {
    setSecondsLeft(null);
    setInitialSeconds(null);
    setIsPaused(false);
    setShowModal(false);
  };

  const snoozeTimer = () => {
    setShowModal(false);
    const snoozeMinutes = 5;
    const snoozeSeconds = snoozeMinutes * 60;
    setInitialSeconds(snoozeSeconds);
    setSecondsLeft(snoozeSeconds);
    setIsPaused(false);
  };

  // 기존 자세 피드백 기록 함수 등은 그대로 유지

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

  return (
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
        className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-transform duration-300"
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
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-transform duration-300"
              >
                일시정지
              </button>
            ) : (
              <button
                onClick={resumeTimer}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-transform duration-300"
              >
                재시작
              </button>
            )}
            <button
              onClick={resetTimer}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-transform duration-300"
            >
              리셋
            </button>
          </div>
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-green-900 bg-opacity-50 dark:bg-green-800 dark:bg-opacity-70">
          <div className="bg-white bg-opacity-95 p-6 rounded-lg shadow-xl border border-green-400 dark:bg-green-800 dark:border-green-600">
            <p className="text-xl font-bold text-green-800 dark:text-green-100">
              🪑 바로 앉으세요!
            </p>
            <p className="mt-2 text-md text-green-800 dark:text-green-100">
              자세를 교정하셨나요?
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => recordFeedback("correct")}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-transform duration-300"
              >
                네, 잘했어요
              </button>
              <button
                onClick={() => recordFeedback("incorrect")}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-transform duration-300"
              >
                아니요
              </button>
              <button
                onClick={snoozeTimer}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-transform duration-300"
              >
                스누즈
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-transform duration-300"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
