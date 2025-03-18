"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [checkInHistory, setCheckInHistory] = useState<string[]>([]);
  const [points, setPoints] = useState<number>(0);
  const [feedbackStats, setFeedbackStats] = useState({
    correct: 0,
    incorrect: 0,
  });
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);

  // 체크인 기록과 포인트 불러오기
  useEffect(() => {
    const storedHistory = localStorage.getItem("dailyCheckInHistory");
    if (storedHistory) {
      setCheckInHistory(JSON.parse(storedHistory));
    }
    const storedPoints = localStorage.getItem("dailyPoints");
    if (storedPoints) {
      setPoints(parseInt(storedPoints, 10));
    }
  }, []);

  // 자세 피드백 통계 계산
  useEffect(() => {
    const storedFeedback = localStorage.getItem("postureFeedbackHistory");
    let correct = 0;
    let incorrect = 0;
    if (storedFeedback) {
      const history = JSON.parse(storedFeedback);
      history.forEach((entry: { feedback: string }) => {
        if (entry.feedback === "correct") {
          correct++;
        } else if (entry.feedback === "incorrect") {
          incorrect++;
        }
      });
    }
    setFeedbackStats({ correct, incorrect });
  }, []);

  // 알림 기록 개수 불러오기
  useEffect(() => {
    const storedNotifications = localStorage.getItem("notificationHistory");
    if (storedNotifications) {
      const notifications = JSON.parse(storedNotifications);
      setNotificationCount(notifications.length);
    }
  }, []);

  // 오늘 날짜를 기준으로 연속 체크인 일수(스토릭) 계산
  useEffect(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    const history = checkInHistory;
    let currentStreak = 0;
    // 오늘부터 거슬러 올라가며 연속 체크인 여부 확인
    let date = new Date();
    while (true) {
      const dateStr = date.toISOString().split("T")[0];
      if (history.includes(dateStr)) {
        currentStreak++;
        date.setDate(date.getDate() - 1);
      } else {
        break;
      }
    }
    setStreak(currentStreak);
  }, [checkInHistory]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-400 p-6 dark:from-blue-900 dark:to-blue-700">
      <h1 className="text-4xl font-bold text-blue-900 mb-6 drop-shadow-lg dark:text-blue-100">
        사용자 대시보드
      </h1>
      <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-xl w-full max-w-md text-center border border-blue-300 dark:bg-blue-800 dark:border-blue-600">
        <p className="text-lg text-blue-700 dark:text-blue-100">
          <span className="font-semibold">총 체크인 횟수:</span>{" "}
          {checkInHistory.length}
        </p>
        <p className="text-lg text-blue-700 dark:text-blue-100">
          <span className="font-semibold">현재 체크인 스토릭:</span> {streak}일
        </p>
        <p className="text-lg text-blue-700 dark:text-blue-100">
          <span className="font-semibold">누적 포인트:</span> {points}
        </p>
        <p className="text-lg text-blue-700 dark:text-blue-100">
          <span className="font-semibold">자세 피드백 (정상/교정 필요):</span>{" "}
          {feedbackStats.correct} / {feedbackStats.incorrect}
        </p>
        <p className="text-lg text-blue-700 dark:text-blue-100">
          <span className="font-semibold">알림 기록 개수:</span>{" "}
          {notificationCount}
        </p>
      </div>
      <div className="mt-6">
        <Link href="/">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300">
            홈으로 돌아가기
          </button>
        </Link>
      </div>
    </main>
  );
}
