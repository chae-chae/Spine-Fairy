"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function GoalPage() {
  const [weeklyGoal, setWeeklyGoal] = useState<number>(7); // 기본 목표: 7일 체크인
  const [checkInHistory, setCheckInHistory] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  // 지난 7일간의 체크인 기록 불러오기
  useEffect(() => {
    const storedHistory = localStorage.getItem("dailyCheckInHistory");
    if (storedHistory) {
      setCheckInHistory(JSON.parse(storedHistory));
    }
  }, []);

  // 지난 7일간 체크인한 날짜의 수를 계산하여 진행률을 구함
  useEffect(() => {
    const today = new Date();
    let count = 0;
    const weekDates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      weekDates.push(d.toISOString().split("T")[0]);
    }
    weekDates.forEach((dateStr) => {
      if (checkInHistory.includes(dateStr)) {
        count++;
      }
    });
    setProgress(count);
    const percent = Math.min((count / weeklyGoal) * 100, 100);
    setProgressPercent(percent);
  }, [checkInHistory, weeklyGoal]);

  const handleGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setWeeklyGoal(value);
    localStorage.setItem("weeklyGoal", value.toString());
  };

  useEffect(() => {
    const storedGoal = localStorage.getItem("weeklyGoal");
    if (storedGoal) {
      setWeeklyGoal(parseInt(storedGoal, 10));
    }
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 to-pink-200 p-6 dark:from-purple-900 dark:to-pink-900">
      <h1 className="text-4xl font-bold text-purple-900 mb-6 dark:text-purple-100">
        목표 설정 및 진행 상황
      </h1>
      <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-xl w-full max-w-md text-center border border-purple-300 dark:bg-purple-800 dark:border-purple-600">
        <div>
          <label className="block text-lg font-medium text-purple-700 dark:text-purple-200">
            이번 주 체크인 목표 (일)
          </label>
          <input
            type="number"
            min="1"
            value={weeklyGoal}
            onChange={handleGoalChange}
            className="mt-2 w-full p-2 border border-purple-400 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-purple-700 dark:text-purple-100 dark:border-purple-600"
          />
        </div>
        <div className="mt-4">
          <p className="text-lg text-purple-700 dark:text-purple-200">
            이번 주 체크인 진행: <span className="font-bold">{progress}</span>일
            / <span className="font-bold">{weeklyGoal}</span>일
          </p>
          <div className="w-full bg-gray-300 rounded-full h-4 mt-2">
            <div
              className="bg-green-500 h-4 rounded-full"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p className="mt-2 text-sm text-purple-700 dark:text-purple-200">
            진행률: {Math.round(progressPercent)}%
          </p>
          {progress >= weeklyGoal && (
            <p className="mt-2 text-xl font-semibold text-green-700 dark:text-green-300">
              축하합니다! 목표 달성!
            </p>
          )}
        </div>
      </div>
      <div className="mt-6">
        <Link href="/">
          <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors duration-300">
            홈으로 돌아가기
          </button>
        </Link>
      </div>
    </main>
  );
}
