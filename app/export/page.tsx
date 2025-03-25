"use client";

import { useState } from "react";
import Link from "next/link";

export default function ExportPage() {
  const [exportData, setExportData] = useState("");

  const generateExportData = () => {
    // 내보낼 데이터 객체 구성
    const data = {
      postureFeedbackHistory:
        localStorage.getItem("postureFeedbackHistory") || "[]",
      dailyCheckInHistory: localStorage.getItem("dailyCheckInHistory") || "[]",
      dailyPoints: localStorage.getItem("dailyPoints") || "0",
      notificationHistory: localStorage.getItem("notificationHistory") || "[]",
      weeklyGoal: localStorage.getItem("weeklyGoal") || "",
      pushFrequency: localStorage.getItem("pushFrequency") || "",
      autoPushNotification:
        localStorage.getItem("autoPushNotification") || "false",
      // 필요에 따라 추가 데이터 포함 가능
    };

    // JSON 형태로 문자열 변환
    setExportData(JSON.stringify(data, null, 2));
  };

  const downloadData = () => {
    // 내보낼 데이터를 JSON 파일로 다운로드
    const blob = new Blob([exportData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "spine_fairy_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 to-indigo-300 p-6 dark:from-indigo-900 dark:to-indigo-700">
      <h1 className="text-4xl font-bold text-indigo-900 mb-6 dark:text-indigo-100">
        데이터 내보내기
      </h1>
      <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-xl w-full max-w-md text-center border border-indigo-300 dark:bg-indigo-800 dark:border-indigo-600">
        <p className="text-indigo-700 dark:text-indigo-100">
          아래 버튼을 눌러, 현재 저장된 데이터를 JSON 형식으로 내보낼 수
          있습니다.
        </p>
        <button
          onClick={generateExportData}
          className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors duration-300"
        >
          데이터 생성
        </button>
        {exportData && (
          <>
            <textarea
              readOnly
              value={exportData}
              className="mt-4 w-full p-2 border border-indigo-400 rounded bg-gray-50 text-sm dark:bg-gray-700 dark:text-gray-200"
              rows={10}
            />
            <button
              onClick={downloadData}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-300"
            >
              다운로드
            </button>
          </>
        )}
      </div>
      <div className="mt-6">
        <Link href="/">
          <button className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors duration-300">
            홈으로 돌아가기
          </button>
        </Link>
      </div>
    </main>
  );
}
