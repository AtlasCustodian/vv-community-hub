"use client";

import Link from "next/link";
import AvatarSection from "@/components/AvatarSection";
import AchievementCenter from "@/components/AchievementCenter";
import ChampionRoster from "@/components/ChampionRoster";
import CommunityTools from "@/components/CommunityTools";
import { useFaction } from "@/context/FactionContext";

export default function Home() {
  const { faction } = useFaction();

  return (
    <div className="pb-20">
      <div className="flex justify-end px-4 pt-4 sm:px-6 lg:px-8">
        <Link
          href="/protocols"
          className="rounded-lg border border-border bg-surface/50 px-4 py-2 text-sm font-medium text-muted transition-all hover:border-accent-primary/30 hover:text-foreground hover:bg-surface-hover"
        >
          Protocols
        </Link>
      </div>
      {/* Hero / Avatar Section */}
      <AvatarSection />

      {/* Divider */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Community Tools */}
      <CommunityTools />

      {/* Divider */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Active Champion Roster */}
      <ChampionRoster />

      {/* Divider */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Achievement Center */}
      <AchievementCenter />

      {/* Footer */}
      <footer className="mt-12 border-t border-border py-8 px-4 text-center">
        <p className="text-xs text-muted">
          {faction.name} &mdash; {faction.tagline}
        </p>
      </footer>
    </div>
  );
}
