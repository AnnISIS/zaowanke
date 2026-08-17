import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://daily-tara-prayer.shrewd-corgi-5676.chatgpt.site"),
  title: "每日晨诵｜祈请度母 · 菩提心 · 遥呼上师",
  description: "适合手机大字阅读的祈请度母、菩提心海之入口与遥呼上师祈请文。",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "每日晨诵",
    description: "祈请度母 · 菩提心 · 遥呼上师",
    images: [{ url: "/og.png", width: 1536, height: 1024 }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f0df",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
