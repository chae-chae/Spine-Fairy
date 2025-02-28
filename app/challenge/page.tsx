"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface FeedbackEntry {
  time: string;
  feedback: "correct" | "incorrect";
}

// 피드백 기록을 바탕으로 연속 성공 일수를 계산하는 함수
function getStreak(feedbackHistory: FeedbackEntry[]): number {
  // 각 날짜(YYYY-MM-DD)마다 "correct" 피드백이 있는지 체크
  const datesWithCorrect = new Set<string>();
  feedbackHistory.forEach((entry) => {
    if (entry.feedback === "correct") {
      const date = new Date(entry.time);
      const dateString = date.toISOString().split("T")[0]; // "YYYY-MM-DD"
      datesWithCorrect.add(dateString);
    }
  });

  // 오늘부터 거슬러 올라가면서 연속 성공 일수를 계산
  let streak = 0;
  let currentDate = new Date();
  while (true) {
    const dateString = currentDate.toISOString().split("T")[0];
    if (datesWithCorrect.has(dateString)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export default function ChallengePage() {
  const [streak, setStreak] = useState<number>(0);

  useEffect(() => {
    const storedFeedback = localStorage.getItem("postureFeedbackHistory");
    const history: FeedbackEntry[] = storedFeedback
      ? JSON.parse(storedFeedback)
      : [];
    setStreak(getStreak(history));
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-200 to-green-600 p-6 dark:from-green-900 dark:to-green-800">
      <h1 className="text-4xl font-bold text-green-900 mb-6 drop-shadow-lg dark:text-green-100">
        자세 챌린지
      </h1>
      <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-xl w-full max-w-md text-center border border-green-300 dark:bg-green-800 dark:border-green-600">
        <p className="text-green-700 dark:text-green-100 text-lg">
          현재 연속 정상 자세 유지 일수:
        </p>
        <p className="mt-2 text-3xl font-bold text-green-800 dark:text-green-200">
          {streak}일
        </p>
        {streak >= 7 && (
          <p className="mt-4 text-green-800 dark:text-green-200 text-xl font-semibold">
            축하합니다! 1주일 챌린지 달성!
          </p>
        )}
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
