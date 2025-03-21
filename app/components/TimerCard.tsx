"use client";
import { useState, useEffect, useRef } from "react";
import CircularProgressBar from "./CircularProgressBar";

export default function TimerCard() {
  // 입력 필드 상태: 분과 초
  const [minutes, setMinutes] = useState<number | "">("");
  const [seconds, setSeconds] = useState<number | "">("");

  // 타이머 관련 상태
  const [totalSeconds, setTotalSeconds] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [autoRepeat, setAutoRepeat] = useState(false);

  // 소리 알림 재생을 위한 ref (public 폴더에 alarm.mp3 있어야 함)
  const audioRef = useRef<HTMLAudioElement>(null);

  // 타이머 카운트다운 로직
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (secondsLeft !== null && secondsLeft > 0 && !isPaused) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (secondsLeft === 0) {
      setShowModal(true);
      // 소리 알림 재생
      if (audioRef.current) {
        audioRef.current.play();
      }
      // 자동 반복 옵션이 활성화된 경우, 3초 후 타이머 재시작
      if (autoRepeat && totalSeconds) {
        setTimeout(() => {
          setSecondsLeft(totalSeconds);
          setShowModal(false);
        }, 3000);
      }
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [secondsLeft, isPaused, autoRepeat, totalSeconds]);

  const startTimer = () => {
    const mins = typeof minutes === "number" ? minutes : 0;
    const secs = typeof seconds === "number" ? seconds : 0;
    const total = mins * 60 + secs;
    if (total <= 0) {
      alert("시간을 0보다 크게 입력해주세요!");
      return;
    }
    setTotalSeconds(total);
    setSecondsLeft(total);
    setIsPaused(false);
  };

  const pauseTimer = () => setIsPaused(true);
  const resumeTimer = () => setIsPaused(false);
  const resetTimer = () => {
    setSecondsLeft(null);
    setTotalSeconds(null);
    setIsPaused(false);
    setShowModal(false);
  };

  const snoozeTimer = () => {
    setShowModal(false);
    const snoozeTime = 5 * 60; // 5분 스누즈
    setTotalSeconds(snoozeTime);
    setSecondsLeft(snoozeTime);
    setIsPaused(false);
  };

  // 기존 자세 피드백 기록 함수 유지
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
      {/* 시간 입력: 분 */}
      <label className="block text-lg font-medium text-green-700 mb-2 dark:text-green-200">
        분
      </label>
      <input
        type="number"
        min="0"
        value={minutes}
        onChange={(e) => setMinutes(Number(e.target.value))}
        className="w-full p-2 border border-green-400 rounded focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-green-700 dark:text-green-100 dark:border-green-600"
      />
      {/* 시간 입력: 초 */}
      <label className="block text-lg font-medium text-green-700 mt-4 mb-2 dark:text-green-200">
        초
      </label>
      <input
        type="number"
        min="0"
        max="59"
        value={seconds}
        onChange={(e) => setSeconds(Number(e.target.value))}
        className="w-full p-2 border border-green-400 rounded focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-green-700 dark:text-green-100 dark:border-green-600"
      />
      {/* 자동 반복 옵션 */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <label className="text-green-700 dark:text-green-200">자동 반복</label>
        <input
          type="checkbox"
          checked={autoRepeat}
          onChange={(e) => setAutoRepeat(e.target.checked)}
          className="form-checkbox h-5 w-5 text-green-600"
        />
      </div>
      <button
        onClick={startTimer}
        className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-transform duration-300"
      >
        시작하기
      </button>
      {secondsLeft !== null && totalSeconds !== null && (
        <>
          <div className="mt-4">
            <CircularProgressBar
              secondsLeft={secondsLeft}
              initialSeconds={totalSeconds}
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
              타이머 종료!
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
      <audio ref={audioRef} src="/alarm.mp3" preload="auto" />
    </div>
  );
}
