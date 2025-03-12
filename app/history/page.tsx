"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface NotificationRecord {
  time: string;
  message: string;
  feedback?: "correct" | "incorrect";
}

export default function HistoryPage() {
  const [history, setHistory] = useState<NotificationRecord[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    const storedHistory = localStorage.getItem("notificationHistory");
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("notificationHistory");
    setHistory([]);
  };

  const toggleDetails = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const formatTime = (timeStr: string) => {
    const date = new Date(timeStr);
    return date.toLocaleString();
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-200 to-green-600 p-6 dark:from-green-900 dark:to-green-800">
      <h1 className="text-4xl font-bold text-green-900 mb-6 drop-shadow-lg dark:text-green-100">
        알림 히스토리 기록
      </h1>

      {history.length === 0 ? (
        <p className="text-green-800 dark:text-green-100">기록이 없습니다.</p>
      ) : (
        <ul className="bg-white bg-opacity-90 p-4 rounded-lg shadow-xl w-full max-w-md border border-green-300 dark:bg-green-800 dark:border-green-600">
          {history
            .slice()
            .reverse()
            .map((entry, index) => (
              <li
                key={index}
                className="mb-2 border-b border-green-200 dark:border-green-600 pb-2 cursor-pointer"
                onClick={() => toggleDetails(index)}
              >
                <p className="text-green-800 dark:text-green-100">
                  <span className="font-semibold">시간:</span>{" "}
                  {formatTime(entry.time)}
                </p>
                <p className="text-green-700 dark:text-green-200">
                  <span className="font-semibold">메시지:</span> {entry.message}
                </p>
                {expandedIndex === index && (
                  <div className="mt-2 text-green-700 dark:text-green-200 text-sm">
                    {entry.feedback ? (
                      <p>
                        <span className="font-semibold">자세 피드백:</span>{" "}
                        {entry.feedback === "correct"
                          ? "네, 잘했어요"
                          : "아니요"}
                      </p>
                    ) : (
                      <p>
                        <span className="font-semibold">자세 피드백:</span>{" "}
                        기록되지 않음
                      </p>
                    )}
                  </div>
                )}
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
