import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spine Fairy",
  description: "바른 자세를 도와주는 웹앱",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
