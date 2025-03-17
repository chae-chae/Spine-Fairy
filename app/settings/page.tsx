"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import PushNotificationSettings from "../components/PushNotificationSettings";

export default function SettingsPage() {
  const [customMessage, setCustomMessage] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const [pushFrequency, setPushFrequency] = useState(10); // 기본값 10분

  // 기존 알림 메시지 불러오기
  useEffect(() => {
    const storedMessage = localStorage.getItem("customAlertMessage");
    if (storedMessage) {
      setCustomMessage(storedMessage);
      setSavedMessage(storedMessage);
    } else {
      const defaultMessage = "바로 앉으세요! 🪑";
      setCustomMessage(defaultMessage);
      setSavedMessage(defaultMessage);
      localStorage.setItem("customAlertMessage", defaultMessage);
    }
  }, []);

  // 푸시 알림 빈도 불러오기
  useEffect(() => {
    const storedFreq = localStorage.getItem("pushFrequency");
    if (storedFreq) {
      setPushFrequency(parseInt(storedFreq, 10));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("customAlertMessage", customMessage);
    setSavedMessage(customMessage);
    alert("설정이 저장되었습니다!");
  };

  const handleFrequencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setPushFrequency(value);
    localStorage.setItem("pushFrequency", value.toString());
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-200 to-green-600 p-6 dark:from-green-900 dark:to-green-800">
      <h1 className="text-4xl font-bold text-green-900 mb-6 dark:text-green-100">
        사용자 맞춤 설정
      </h1>

      {/* 알림 메시지 설정 섹션 */}
      <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-xl w-80 text-center border border-green-300 dark:bg-green-800 dark:border-green-600">
        <label className="block text-lg font-medium text-green-700 mb-2 dark:text-green-200">
          알림 메시지
        </label>
        <textarea
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          className="w-full p-2 border border-green-400 rounded focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-green-700 dark:text-green-100 dark:border-green-600"
          rows={3}
        />
        <button
          onClick={handleSave}
          className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors duration-300"
        >
          저장하기
        </button>
      </div>

      {/* 푸시 알림 설정 섹션 */}
      <div className="mt-6 bg-white bg-opacity-90 p-6 rounded-lg shadow-xl w-80 text-center border border-green-300 dark:bg-green-800 dark:border-green-600">
        <h2 className="text-2xl font-semibold text-green-800 dark:text-green-200 mb-4">
          푸시 알림 설정
        </h2>
        <PushNotificationSettings />
        {/* 푸시 알림 빈도 조절 옵션 */}
        <div className="mt-4">
          <label className="block text-green-700 dark:text-green-200 text-sm font-medium">
            푸시 알림 빈도 (분)
          </label>
          <input
            type="number"
            min="1"
            value={pushFrequency}
            onChange={handleFrequencyChange}
            className="mt-1 w-full p-2 border border-green-400 rounded focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-green-700 dark:text-green-100 dark:border-green-600"
          />
          <p className="mt-1 text-xs text-green-600 dark:text-green-300">
            이 간격으로 푸시 알림이 발송됩니다.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <Link href="/">
          <span className="text-green-900 dark:text-green-100 underline cursor-pointer">
            홈으로 돌아가기
          </span>
        </Link>
      </div>
    </main>
  );
}
