import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "여의도침례교회 목요성경통독",
  description: "성경을 읽다가 궁금한 질문을 남기고, 목요일에 함께 나누는 성경통독 게시판.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
