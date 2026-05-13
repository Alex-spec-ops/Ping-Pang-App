import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomNav from "../components/BottomNav";
import { headers } from "next/headers";

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

const NO_NAV_PATHS = ["/login", "/signup"];

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const showNav = !NO_NAV_PATHS.some((p) => pathname.startsWith(p));

  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-50">
        <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-white shadow-sm dark:bg-zinc-950">
          <main className={showNav ? "flex-1 pb-20" : "flex-1"}>{children}</main>
        </div>
        {showNav && <BottomNav />}
      </body>
    </html>
  );
}
