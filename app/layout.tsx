import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "여의도침례교회 목요성경통독",
  description: "성경을 읽다가 궁금한 질문을 남기고, 목요일에 함께 나누는 성경통독 게시판.",
  metadataBase: new URL('https://wizardjustin25-lgtm.github.io/thursday-bible-reading/'),
  alternates: {canonical: 'https://wizardjustin25-lgtm.github.io/thursday-bible-reading/'},
  openGraph: {type:'website',locale:'ko_KR',url:'https://wizardjustin25-lgtm.github.io/thursday-bible-reading/',title:'여의도침례교회 목요성경통독',description:'성경을 읽다가 궁금한 질문을 남기고, 목요일에 함께 나누는 성경통독 게시판.',images:[{url:'https://wizardjustin25-lgtm.github.io/thursday-bible-reading/church-mark.png',width:1080,height:1080,alt:'여의도침례교회 목요일 성경통독'}]},
  twitter: {card:'summary_large_image',title:'여의도침례교회 목요성경통독',description:'성경을 읽다가 궁금한 질문을 남기고, 목요일에 함께 나누는 성경통독 게시판.',images:['https://wizardjustin25-lgtm.github.io/thursday-bible-reading/church-mark.png']},
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
