import type { Metadata } from 'next';
import { Geist_Mono } from 'next/font/google';
// 한글 본문 글꼴 — 화면에 나온 글자 범위의 조각(woff2)만 내려받는 동적 서브셋 (앱과 같은 Pretendard)
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css';
import './globals.css';
import { Providers } from './providers';

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Noturi Admin',
  description: 'Noturi 관리자 대시보드',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // next-themes가 렌더 전에 <html>에 class를 붙이므로 그 차이는 경고하지 않음
    <html lang="ko" suppressHydrationWarning>
      <body className={`${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
