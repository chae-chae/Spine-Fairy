"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface FeedbackEntry {
  time: string;
  feedback: "correct" | "incorrect";
}

export default function StatisticsPage() {
  const [weeklyStats, setWeeklyStats] = useState({ correct: 0, incorrect: 0 });
  const [monthlyStats, setMonthlyStats] = useState({
    correct: 0,
    incorrect: 0,
  });

  useEffect(() => {
    const storedFeedback = localStorage.getItem("postureFeedbackHistory");
    const feedbackHistory: FeedbackEntry[] = storedFeedback
      ? JSON.parse(storedFeedback)
      : [];

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    let weeklyCorrect = 0;
    let weeklyIncorrect = 0;
    let monthlyCorrect = 0;
    let monthlyIncorrect = 0;

    feedbackHistory.forEach((entry) => {
      const entryDate = new Date(entry.time);
      if (entryDate >= oneWeekAgo) {
        if (entry.feedback === "correct") weeklyCorrect++;
        else if (entry.feedback === "incorrect") weeklyIncorrect++;
      }
      if (entryDate >= oneMonthAgo) {
        if (entry.feedback === "correct") monthlyCorrect++;
        else if (entry.feedback === "incorrect") monthlyIncorrect++;
      }
    });

    setWeeklyStats({ correct: weeklyCorrect, incorrect: weeklyIncorrect });
    setMonthlyStats({ correct: monthlyCorrect, incorrect: monthlyIncorrect });
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-200 to-green-600 p-6 dark:from-green-900 dark:to-green-800">
      <h1 className="text-4xl font-bold text-green-900 mb-6 drop-shadow-lg dark:text-green-100">
        자세 피드백 통계
      </h1>

      <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-xl w-full max-w-md text-center border border-green-300 dark:bg-green-800 dark:border-green-600">
        <h2 className="text-2xl font-semibold text-green-800 dark:text-green-200 mb-4">
          지난 7일간
        </h2>
        <p className="text-green-700 dark:text-green-100">
          정상: <span className="font-bold">{weeklyStats.correct}</span>
        </p>
        <p className="text-green-700 dark:text-green-100">
          교정 필요: <span className="font-bold">{weeklyStats.incorrect}</span>
        </p>
      </div>

      <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-xl w-full max-w-md text-center border border-green-300 dark:bg-green-800 dark:border-green-600 mt-6">
        <h2 className="text-2xl font-semibold text-green-800 dark:text-green-200 mb-4">
          지난 30일간
        </h2>
        <p className="text-green-700 dark:text-green-100">
          정상: <span className="font-bold">{monthlyStats.correct}</span>
        </p>
        <p className="text-green-700 dark:text-green-100">
          교정 필요: <span className="font-bold">{monthlyStats.incorrect}</span>
        </p>
      </div>

      <div className="mt-6">
        <Link href="/">
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-300">
            홈으로 돌아가기
          </button>
        </Link>
      </div>
    </main>
  );
}
