import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./profile.css";
import "./clubs.css";
import BottomNav from "../components/BottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PingPang — Le réseau des pongistes",
  description:
    "Strava + Chess.com pour le tennis de table. Suis tes matchs, ton ELO, défie le monde.",
  applicationName: "PingPang",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PingPang",
  },
};

export const viewport: Viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-50">
        <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-white shadow-sm dark:bg-zinc-950">
          <main className="flex-1 pb-20">{children}</main>
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
