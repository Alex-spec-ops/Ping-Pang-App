import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter_Tight, Caveat } from "next/font/google";
import "./globals.css";
import "./profile.css";
import "./clubs.css";
import BottomNav from "../components/BottomNav";
import { headers } from "next/headers";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ping Pang Paris — FOR ATHLETES, by athletes",
  description:
    "Club de tennis de table nouvelle génération, entièrement digitalisé. Réservez votre table, suivez vos matchs, défiez le monde.",
  applicationName: "Ping Pang Paris",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Ping Pang",
  },
};

export const viewport: Viewport = {
  themeColor: "#0e3d2e",
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
      className={`${playfair.variable} ${interTight.variable} ${caveat.variable} h-full`}
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
