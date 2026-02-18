import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { TickProvider } from "@/context/TickContext";
import { FactionProvider } from "@/context/FactionContext";
import { ChampionAssignmentProvider } from "@/context/ChampionAssignmentContext";
import TickEffects from "@/components/TickEffects";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vantheon — Faction Hub",
  description:
    "The command dashboard for the five factions of Vantheon. Monitor operations, track achievements, and serve your faction.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" data-faction="fire">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <TickProvider>
          <FactionProvider>
            <ChampionAssignmentProvider>
              <TickEffects />
              <ScrollToTop />
              <Header />
              <main>{children}</main>
            </ChampionAssignmentProvider>
          </FactionProvider>
        </TickProvider>
      </body>
    </html>
  );
}
