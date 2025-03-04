"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface FeedbackEntry {
  time: string;
  feedback: "correct" | "incorrect";
}

export default function AnalyticsPage() {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const storedFeedback = localStorage.getItem("postureFeedbackHistory");
    const feedbackHistory: FeedbackEntry[] = storedFeedback
      ? JSON.parse(storedFeedback)
      : [];

    // 지난 30일간의 날짜별 올바른 피드백 개수를 집계
    const dailyCounts: { [date: string]: number } = {};
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0]; // YYYY-MM-DD
      dailyCounts[dateStr] = 0;
    }

    feedbackHistory.forEach((entry) => {
      if (entry.feedback === "correct") {
        const dateStr = new Date(entry.time).toISOString().split("T")[0];
        if (dateStr in dailyCounts) {
          dailyCounts[dateStr]++;
        }
      }
    });

    const labels = Object.keys(dailyCounts);
    const dataPoints = Object.values(dailyCounts);

    const data = {
      labels: labels,
      datasets: [
        {
          label: "일일 올바른 자세 피드백 횟수",
          data: dataPoints,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: true,
        },
      ],
    };

    setChartData(data);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-200 to-green-600 p-6 dark:from-green-900 dark:to-green-800">
      <h1 className="text-4xl font-bold text-green-900 mb-6 drop-shadow-lg dark:text-green-100">
        자세 개선 분석
      </h1>
      <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-xl w-full max-w-2xl border border-green-300 dark:bg-green-800 dark:border-green-600">
        {chartData ? (
          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: {
                  display: true,
                  text: "지난 30일간 올바른 자세 피드백 분석",
                },
              },
            }}
          />
        ) : (
          <p className="text-green-700 dark:text-green-100">
            데이터를 불러오는 중...
          </p>
        )}
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
