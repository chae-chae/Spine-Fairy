"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [minutes, setMinutes] = useState<number | "">(""); // 입력된 시간 (분)
  const [showModal, setShowModal] = useState(false); // 모달 상태

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (showModal) {
      // 모달이 표시될 때 자동으로 닫히도록 설정
      timer = setTimeout(() => setShowModal(false), 5000);
    }

    return () => clearTimeout(timer);
  }, [showModal]);

  // 타이머 시작 함수
  const startTimer = () => {
    if (!minutes || minutes <= 0) {
      alert("1분 이상 입력해주세요!");
      return;
    }

    const delay = minutes * 60 * 1000; // 입력된 시간을 밀리초로 변환

    setTimeout(() => {
      setShowModal(true); // 모달 표시
      triggerNotification(); // 브라우저 알림 실행
    }, delay);
  };

  // 브라우저 알림
  const triggerNotification = () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("Spine Fairy 🧚‍♂️", { body: "바로 앉으세요! 🪑" });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification("Spine Fairy 🧚‍♂️", { body: "바로 앉으세요! 🪑" });
          }
        });
      }
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      {/* 웹사이트 제목 */}
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Spine Fairy 🧚‍♂️</h1>

      {/* 알림 설정 창 */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          알림 받을 시간 (분)
        </label>
        <input
          type="number"
          min="1"
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value))}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={startTimer}
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          설정하기
        </button>
      </div>

      {/* 모달 창 */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-xl font-bold">🪑 바로 앉으세요!</p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
