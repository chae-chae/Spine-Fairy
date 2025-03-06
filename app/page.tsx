"use client";

import { useState, useEffect } from "react";
import TimerCard from "./components/TimerCard";
import NavigationBar from "./components/NavigationBar";
import PushNotificationTestButton from "./components/PushNotificationTestButton";

// 테마 관련 상태와 클래스 정의
const themes = ["default", "forest", "ocean", "sunset"];
const themeClasses: { [key: string]: string } = {
  default:
    "bg-gradient-to-br from-green-200 to-green-600 dark:from-green-900 dark:to-green-800",
  forest:
    "bg-gradient-to-br from-green-300 to-green-700 dark:from-green-800 dark:to-green-900",
  ocean:
    "bg-gradient-to-br from-blue-200 to-blue-500 dark:from-blue-800 dark:to-blue-900",
  sunset:
    "bg-gradient-to-br from-yellow-200 to-pink-500 dark:from-purple-800 dark:to-pink-900",
};

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [theme, setTheme] = useState("default");

  const changeTheme = () => {
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
    localStorage.setItem("selectedTheme", themes[nextIndex]);
  };

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <main
      className={`flex flex-col items-center justify-center min-h-screen ${themeClasses[theme]} p-6`}
    >
      <h1 className="text-5xl font-bold mb-8">Spine Fairy 🧚‍♂️</h1>
      <TimerCard />
      <NavigationBar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        changeTheme={changeTheme}
      />
      <PushNotificationTestButton />
    </main>
  );
}
