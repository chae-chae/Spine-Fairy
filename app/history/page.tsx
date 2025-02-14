"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function HistoryPage() {
  const [history, setHistory] = useState<
    Array<{ time: string; message: string }>
  >([]);

  useEffect(() => {
    const storedHistory = localStorage.getItem("notificationHistory");
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  // 기록 초기화 함수
  const clearHistory = () => {
    localStorage.removeItem("notificationHistory");
    setHistory([]);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-200 to-green-600 p-6">
      <h1 className="text-4xl font-bold text-green-900 mb-6 drop-shadow-lg">
        알림 히스토리 기록
      </h1>

      {history.length === 0 ? (
        <p className="text-green-800">기록이 없습니다.</p>
      ) : (
        <ul className="bg-white bg-opacity-90 p-4 rounded-lg shadow-xl w-full max-w-md border border-green-300">
          {history
            .slice()
            .reverse()
            .map((entry, index) => (
              <li key={index} className="mb-2 border-b border-green-200 pb-2">
                <p className="text-green-800">
                  <span className="font-semibold">시간:</span>{" "}
                  {new Date(entry.time).toLocaleString()}
                </p>
                <p className="text-green-700">
                  <span className="font-semibold">메시지:</span> {entry.message}
                </p>
              </li>
            ))}
        </ul>
      )}

      <div className="mt-6 flex gap-4">
        <Link href="/">
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-300">
            홈으로 돌아가기
          </button>
        </Link>
        <button
          onClick={clearHistory}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-300"
        >
          기록 초기화
        </button>
      </div>
    </main>
  );
}
