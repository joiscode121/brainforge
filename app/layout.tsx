import type { Metadata } from "next";
import { Fraunces, DM_Sans, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BrainForge — Master Everything",
  description: "Mobile-first PWA for rapid skill progression across AI/ML, Math, CS, STEM, Languages, and more",
  manifest: "/manifest.json",
  themeColor: "#f5f0e8",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BrainForge"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="scholar" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon-192.png" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var t = localStorage.getItem('brainforge-theme');
                if (t === 'forge' || t === 'scholar') {
                  document.documentElement.setAttribute('data-theme', t);
                }
              } catch(e) {}
            })();
          `
        }} />
      </head>
      <body className={`${fraunces.variable} ${dmSans.variable} ${inter.variable} font-sans`}
            style={{ fontFamily: 'var(--font-body), system-ui, sans-serif' }}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
