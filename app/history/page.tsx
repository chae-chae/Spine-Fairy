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
  const [filter, setFilter] = useState<"all" | "correct" | "incorrect">("all");

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

  const deleteRecord = (time: string) => {
    const newHistory = history.filter((record) => record.time !== time);
    setHistory(newHistory);
    localStorage.setItem("notificationHistory", JSON.stringify(newHistory));
  };

  const toggleDetails = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const formatTime = (timeStr: string) => {
    const date = new Date(timeStr);
    return date.toLocaleString();
  };

  // 필터 조건에 따라 기록 필터링
  const filteredHistory = history.filter((record) => {
    if (filter === "all") return true;
    return record.feedback === filter;
  });

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-200 to-green-600 p-6 dark:from-green-900 dark:to-green-800">
      <h1 className="text-4xl font-bold text-green-900 mb-6 drop-shadow-lg dark:text-green-100">
        알림 히스토리 기록
      </h1>

      {/* 필터 선택 */}
      <div className="mb-4">
        <label className="mr-2 text-green-800 dark:text-green-100">필터:</label>
        <select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value as "all" | "correct" | "incorrect")
          }
          className="p-2 border border-green-400 rounded focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-green-700 dark:text-green-100 dark:border-green-600"
        >
          <option value="all">전체</option>
          <option value="correct">정상</option>
          <option value="incorrect">교정 필요</option>
        </select>
      </div>

      {filteredHistory.length === 0 ? (
        <p className="text-green-800 dark:text-green-100">기록이 없습니다.</p>
      ) : (
        <ul className="bg-white bg-opacity-90 p-4 rounded-lg shadow-xl w-full max-w-md border border-green-300 dark:bg-green-800 dark:border-green-600">
          {filteredHistory
            .slice()
            .reverse()
            .map((record, index) => (
              <li
                key={record.time}
                className="mb-2 border-b border-green-200 dark:border-green-600 pb-2 cursor-pointer flex flex-col"
                onClick={() => toggleDetails(index)}
              >
                <div className="flex justify-between items-center">
                  <p className="text-green-800 dark:text-green-100">
                    <span className="font-semibold">시간:</span>{" "}
                    {formatTime(record.time)}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteRecord(record.time);
                    }}
                    className="text-sm text-red-500 hover:underline"
                  >
                    삭제
                  </button>
                </div>
                <p className="text-green-700 dark:text-green-200">
                  <span className="font-semibold">메시지:</span>{" "}
                  {record.message}
                </p>
                {expandedIndex === index && (
                  <div className="mt-2 text-green-700 dark:text-green-200 text-sm">
                    {record.feedback ? (
                      <p>
                        <span className="font-semibold">자세 피드백:</span>{" "}
                        {record.feedback === "correct"
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
