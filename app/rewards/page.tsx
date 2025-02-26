"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface FeedbackEntry {
  time: string;
  feedback: "correct" | "incorrect";
}

export default function RewardsPage() {
  const [correctCount, setCorrectCount] = useState<number>(0);

  useEffect(() => {
    const storedFeedback = localStorage.getItem("postureFeedbackHistory");
    const feedbackHistory: FeedbackEntry[] = storedFeedback
      ? JSON.parse(storedFeedback)
      : [];
    const count = feedbackHistory.filter(
      (entry) => entry.feedback === "correct"
    ).length;
    setCorrectCount(count);
  }, []);

  // 배지 조건 (예: 10회 이상이면 Bronze, 50회 이상이면 Silver, 100회 이상이면 Gold)
  let badge = "";
  if (correctCount >= 100) {
    badge = "Gold Badge 🎖️";
  } else if (correctCount >= 50) {
    badge = "Silver Badge 🥈";
  } else if (correctCount >= 10) {
    badge = "Bronze Badge 🥉";
  } else {
    badge = "No badge yet. Keep trying!";
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-200 to-green-600 p-6 dark:from-green-900 dark:to-green-800">
      <h1 className="text-4xl font-bold text-green-900 mb-6 drop-shadow-lg dark:text-green-100">
        보상 시스템
      </h1>
      <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-xl w-full max-w-md text-center border border-green-300 dark:bg-green-800 dark:border-green-600">
        <p className="text-green-700 dark:text-green-100 text-lg">
          정상 자세 피드백 횟수:{" "}
          <span className="font-bold">{correctCount}</span>
        </p>
        <p className="mt-4 text-green-700 dark:text-green-100 text-xl font-semibold">
          {badge}
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
