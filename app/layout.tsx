import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter_Tight, Caveat } from "next/font/google";
import "./globals.css";
import "./profile.css";
import "./clubs.css";
import AppShell from "../components/AppShell";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${playfair.variable} ${interTight.variable} ${caveat.variable} h-full`}
    >
      <body className="min-h-full">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
