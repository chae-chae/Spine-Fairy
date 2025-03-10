"use client";

import Link from "next/link";

interface NavigationBarProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  changeTheme: () => void;
}

export default function NavigationBar({
  darkMode,
  setDarkMode,
  changeTheme,
}: NavigationBarProps) {
  return (
    <div className="mt-6 flex flex-wrap gap-4 justify-center">
      <Link href="/settings">
        <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-transform duration-300">
          사용자 맞춤 설정
        </button>
      </Link>
      <Link href="/history">
        <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-transform duration-300">
          알림 히스토리
        </button>
      </Link>
      <Link href="/statistics">
        <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-transform duration-300">
          피드백 통계
        </button>
      </Link>
      <Link href="/tips">
        <button className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-transform duration-300">
          자세 개선 팁
        </button>
      </Link>
      <Link href="/rewards">
        <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-transform duration-300">
          보상 확인
        </button>
      </Link>
      <Link href="/challenge">
        <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-transform duration-300">
          자세 챌린지
        </button>
      </Link>
      <Link href="/dailyMission">
        <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-transform duration-300">
          오늘의 미션
        </button>
      </Link>
      <Link href="/exercises">
        <button className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-transform duration-300">
          운동 추천
        </button>
      </Link>
      <Link href="/analytics">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-transform duration-300">
          데이터 분석
        </button>
      </Link>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-transform duration-300"
      >
        {darkMode ? "라이트 모드" : "다크 모드"}
      </button>
      <button
        onClick={changeTheme}
        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-transform duration-300"
      >
        테마 변경
      </button>
    </div>
  );
}
