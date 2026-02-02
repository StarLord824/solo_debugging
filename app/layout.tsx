import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { Share_Tech_Mono } from "next/font/google";

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-share-tech-mono",
});

export const metadata: Metadata = {
  title: "SOLO_DEBUGGER: The Arena",
  description: "Gamified debugging experience for System Collapse Hackathon 2026. Break it beautifully.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${shareTechMono.variable} ${geistSans.variable} ${geistMono.variable} antialiased font-mono`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
