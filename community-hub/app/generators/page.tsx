"use client";

import GeneratorView from "@/components/GeneratorView";
import RootsView from "@/components/RootsView";
import WallTowerView from "@/components/WallTowerView";
import TerraceView from "@/components/TerraceView";
import ObservatoryView from "@/components/ObservatoryView";
import FacilityView from "@/components/FacilityView";
import { useFaction } from "@/context/FactionContext";
import type { FactionId } from "@/data/factionData";

export default function GeneratorsPage() {
  const { faction, factionId } = useFaction();

  return (
    <div className="pb-20">
      {/* Hero header */}
      <section className="relative py-12 px-4 sm:px-6 lg:px-8">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            className="h-[300px] w-[600px] rounded-full blur-3xl"
            style={{ background: `${faction.theme.primary}06` }}
          />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-4 py-1.5 text-xs font-medium text-muted">
            <span
              className="h-2 w-2 rounded-full animate-pulse"
              style={{ background: faction.theme.primary }}
            />
            {faction.facilityLabel}
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(to right, ${faction.theme.gradientFrom}, ${faction.theme.gradientTo})`,
              }}
            >
              {faction.facilityPageTitle}
            </span>
          </h1>
          <p className="mt-3 text-sm text-muted max-w-xl mx-auto">
            {faction.facilityPageSubtitle}
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Faction-specific visual view */}
      <section className="py-10">
        {(() => {
          const views: Record<FactionId, React.ReactNode> = {
            fire: <GeneratorView />,
            earth: <RootsView />,
            water: <WallTowerView />,
            wood: <TerraceView />,
            metal: <ObservatoryView />,
          };
          return views[factionId] ?? <FacilityView />;
        })()}
      </section>

      {/* Footer */}
      <footer className="mt-8 border-t border-border py-8 px-4 text-center">
        <p className="text-xs text-muted">
          {faction.name} &mdash; {faction.tagline}
        </p>
      </footer>
    </div>
  );
}
