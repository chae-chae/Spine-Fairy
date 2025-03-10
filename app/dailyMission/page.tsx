"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function DailyMissionPage() {
  const [checkedIn, setCheckedIn] = useState(false);
  const [today, setToday] = useState("");

  useEffect(() => {
    const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD 형식
    setToday(todayStr);
    const checkInHistory = localStorage.getItem("dailyCheckInHistory");
    if (checkInHistory) {
      const history = JSON.parse(checkInHistory);
      if (history.includes(todayStr)) {
        setCheckedIn(true);
      }
    }
  }, []);

  const handleCheckIn = () => {
    if (!checkedIn) {
      const todayStr = today;
      const checkInHistory = localStorage.getItem("dailyCheckInHistory");
      let history = checkInHistory ? JSON.parse(checkInHistory) : [];
      if (!history.includes(todayStr)) {
        history.push(todayStr);
        localStorage.setItem("dailyCheckInHistory", JSON.stringify(history));
        setCheckedIn(true);
        alert("오늘의 미션 완료! 축하합니다!");
      }
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 to-orange-200 p-6 dark:from-yellow-900 dark:to-orange-800">
      <h1 className="text-4xl font-bold text-orange-800 mb-6 drop-shadow-lg dark:text-orange-100">
        오늘의 미션
      </h1>
      <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-xl w-full max-w-md text-center border border-orange-300 dark:bg-orange-800 dark:border-orange-600">
        <p className="text-orange-700 dark:text-orange-100 text-lg">
          오늘 올바른 자세로 앉아 계셨다면, 아래 버튼을 눌러 체크인하세요.
        </p>
        <button
          onClick={handleCheckIn}
          disabled={checkedIn}
          className={`mt-4 px-4 py-2 ${
            checkedIn ? "bg-gray-400" : "bg-orange-500 hover:bg-orange-600"
          } text-white rounded transition-colors duration-300`}
        >
          {checkedIn ? "체크인 완료됨" : "오늘 체크인"}
        </button>
      </div>
      <div className="mt-6">
        <Link href="/">
          <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors duration-300">
            홈으로 돌아가기
          </button>
        </Link>
      </div>
    </main>
  );
}
