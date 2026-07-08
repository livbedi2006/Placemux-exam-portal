import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ExamAI Pro – AI-Powered Smart Online Examination Platform",
    template: "%s | ExamAI Pro",
  },
  description:
    "ExamAI Pro is a production-ready, enterprise-grade AI-powered online examination platform featuring adaptive learning, AI proctoring, gamification, and smart analytics.",
  keywords: [
    "online exam",
    "AI examination",
    "adaptive learning",
    "proctoring",
    "EdTech",
    "student portal",
  ],
  authors: [{ name: "ExamAI Pro" }],
  creator: "ExamAI Pro",
  metadataBase: new URL("https://examaipro.com"),
  openGraph: {
    title: "ExamAI Pro – AI-Powered Examination Platform",
    description:
      "Smart online examination with AI proctoring, adaptive questions, and personalized learning paths.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ExamAI Pro",
    description: "AI-Powered Online Examination Platform",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <ThemeProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
