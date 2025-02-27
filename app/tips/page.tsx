"use client";

import Link from "next/link";

export default function TipsPage() {
  const tips = [
    {
      title: "올바른 앉은 자세 유지하기",
      description: "등을 곧게 펴고 어깨를 내리며, 발을 바닥에 평평하게 두세요.",
    },
    {
      title: "정기적인 스트레칭",
      description: "매 30분마다 간단한 스트레칭으로 근육을 풀어주면 좋습니다.",
    },
    {
      title: "적절한 의자 선택",
      description:
        "허리를 잘 지지해 주는 의자를 사용하면 자세 유지에 도움이 됩니다.",
    },
    {
      title: "화면과 눈 사이 거리 유지",
      description:
        "화면과 눈 사이의 거리를 적절히 유지해 목에 무리를 주지 않도록 하세요.",
    },
    {
      title: "정기적인 휴식",
      description: "오랜 시간 앉아 있지 않고 짧은 휴식으로 몸을 움직여 주세요.",
    },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-200 to-green-600 p-6 dark:from-green-900 dark:to-green-800">
      <h1 className="text-4xl font-bold text-green-900 mb-6 drop-shadow-lg dark:text-green-100">
        자세 개선 팁
      </h1>
      <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-xl w-full max-w-2xl border border-green-300 dark:bg-green-800 dark:border-green-600">
        {tips.map((tip, index) => (
          <div key={index} className="mb-4">
            <h2 className="text-2xl font-semibold text-green-800 dark:text-green-200">
              {tip.title}
            </h2>
            <p className="text-green-700 dark:text-green-100">
              {tip.description}
            </p>
            {index < tips.length - 1 && (
              <hr className="my-4 border-green-300 dark:border-green-600" />
            )}
          </div>
        ))}
      </div>
      <div className="mt-6">
        <Link href="/">
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-300">
            홈으로 돌아가기
          </button>
        </Link>
      </div>
    </main>
  );
}
