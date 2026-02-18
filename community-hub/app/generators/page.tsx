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
      {/* Faction-specific visual view */}
      <section className="pt-4 pb-10">
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
