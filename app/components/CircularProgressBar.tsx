"use client";

interface CircularProgressBarProps {
  secondsLeft: number;
  initialSeconds: number;
}

export default function CircularProgressBar({
  secondsLeft,
  initialSeconds,
}: CircularProgressBarProps) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const progress = (initialSeconds - secondsLeft) / initialSeconds;
  const offset = circumference - progress * circumference;

  return (
    <svg className="w-24 h-24 mx-auto" viewBox="0 0 100 100">
      <circle
        className="text-green-300"
        stroke="currentColor"
        strokeWidth="8"
        fill="transparent"
        r={radius}
        cx="50"
        cy="50"
      />
      <circle
        className="text-green-700 transition-all duration-500"
        stroke="currentColor"
        strokeWidth="8"
        fill="transparent"
        r={radius}
        cx="50"
        cy="50"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        className="text-green-800 font-bold text-lg"
      >
        {Math.floor(secondsLeft / 60)}:
        {(secondsLeft % 60).toString().padStart(2, "0")}
      </text>
    </svg>
  );
}
