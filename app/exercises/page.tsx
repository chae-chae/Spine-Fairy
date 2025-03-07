"use client";
import Link from "next/link";

export default function ExercisesPage() {
  const recommendations = [
    {
      title: "어깨 스트레칭",
      description:
        "어깨를 천천히 돌리며 스트레칭을 해주세요. 올바른 자세 유지를 돕습니다.",
    },
    {
      title: "목 스트레칭",
      description:
        "목을 좌우로 천천히 돌리고, 각 방향으로 15초간 유지해 주세요.",
    },
    {
      title: "허리 풀기 운동",
      description:
        "의자에서 일어나 가볍게 허리를 풀어주는 스트레칭을 해보세요.",
    },
    {
      title: "손목 스트레칭",
      description:
        "타이핑이나 장시간 컴퓨터 사용 후에는 손목을 부드럽게 돌리며 스트레칭하세요.",
    },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-400 p-6 dark:from-blue-900 dark:to-blue-700">
      <h1 className="text-4xl font-bold text-blue-900 mb-6 drop-shadow-lg dark:text-blue-100">
        개인화된 운동 및 스트레칭 추천
      </h1>
      <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-xl w-full max-w-2xl text-center border border-blue-300 dark:bg-blue-800 dark:border-blue-600">
        {recommendations.map((rec, index) => (
          <div key={index} className="mb-4">
            <h2 className="text-2xl font-semibold text-blue-800 dark:text-blue-200">
              {rec.title}
            </h2>
            <p className="text-blue-700 dark:text-blue-100">
              {rec.description}
            </p>
            {index < recommendations.length - 1 && (
              <hr className="my-4 border-blue-300 dark:border-blue-600" />
            )}
          </div>
        ))}
      </div>
      <div className="mt-6">
        <Link href="/">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300">
            홈으로 돌아가기
          </button>
        </Link>
      </div>
    </main>
  );
}
