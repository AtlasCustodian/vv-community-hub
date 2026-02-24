"use client";

import { useFaction } from "@/context/FactionContext";

export default function ArenaRecordPage() {
  const { faction } = useFaction();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
      <h1
        className="text-2xl font-bold bg-clip-text text-transparent"
        style={{
          backgroundImage: `linear-gradient(to right, ${faction.theme.gradientFrom}, ${faction.theme.gradientTo})`,
        }}
      >
        Arena Record
      </h1>
      <p className="text-sm text-muted">Coming soon.</p>
    </div>
  );
}
