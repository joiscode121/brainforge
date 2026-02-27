import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BrainForge - Master Everything",
  description: "Mobile-first PWA for rapid skill progression across AI/ML, Math, CS, STEM, Languages, and more",
  manifest: "/manifest.json",
  themeColor: "#0a0a1a",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "BrainForge"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon-192.png" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
