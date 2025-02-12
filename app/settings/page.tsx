"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function SettingsPage() {
  const [customMessage, setCustomMessage] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  // 컴포넌트가 마운트될 때 localStorage에서 기존 설정을 불러옴
  useEffect(() => {
    const storedMessage = localStorage.getItem("customAlertMessage");
    if (storedMessage) {
      setCustomMessage(storedMessage);
      setSavedMessage(storedMessage);
    } else {
      // 기본 알림 메시지 설정 (없을 경우)
      const defaultMessage = "바로 앉으세요! 🪑";
      setCustomMessage(defaultMessage);
      setSavedMessage(defaultMessage);
      localStorage.setItem("customAlertMessage", defaultMessage);
    }
  }, []);

  // 저장 버튼 클릭 시 localStorage에 메시지 저장
  const handleSave = () => {
    localStorage.setItem("customAlertMessage", customMessage);
    setSavedMessage(customMessage);
    alert("설정이 저장되었습니다!");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-200 to-green-600 p-6">
      <h1 className="text-4xl font-bold text-green-900 mb-6">
        사용자 맞춤 설정
      </h1>

      <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-xl w-80 text-center border border-green-300">
        <label className="block text-lg font-medium text-green-700 mb-2">
          알림 메시지
        </label>
        <textarea
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          className="w-full p-2 border border-green-400 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          rows={3}
        />
        <button
          onClick={handleSave}
          className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors duration-300"
        >
          저장하기
        </button>
      </div>

      <div className="mt-6">
        <Link href="/">
          <span className="text-green-900 underline cursor-pointer">
            홈으로 돌아가기
          </span>
        </Link>
      </div>
    </main>
  );
}
