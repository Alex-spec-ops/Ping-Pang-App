import type { Metadata, Viewport } from "next";
import { Lexend, Manrope, Caveat } from "next/font/google";
import "./globals.css";
import "./profile.css";
import "./clubs.css";
import AppShell from "../components/AppShell";

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ui",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-handwriting",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ping Pang & Co. Elite — FOR ATHLETES, by athletes",
  description:
    "Club de tennis de table nouvelle génération, entièrement digitalisé. Réservez votre table, suivez vos matchs, défiez le monde.",
  applicationName: "Ping Pang & Co. Elite",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Ping Pang Elite",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A241E",
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
    <html lang="fr" className={`h-full ${lexend.variable} ${manrope.variable} ${caveat.variable}`}>
      <body className="min-h-full">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
