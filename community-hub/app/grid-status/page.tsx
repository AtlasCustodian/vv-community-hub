"use client";

import FactionGridMap from "@/components/FactionGridMap";
import { useFaction } from "@/context/FactionContext";

export default function GridStatusPage() {
  const { faction } = useFaction();

  return (
    <div className="pb-20">
      {/* Hero header */}
      <section className="relative py-12 px-4 sm:px-6 lg:px-8">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            className="h-[300px] w-[600px] rounded-full blur-3xl"
            style={{ background: `${faction.theme.secondary}06` }}
          />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-4 py-1.5 text-xs font-medium text-muted">
            <span
              className="h-2 w-2 rounded-full animate-pulse"
              style={{ background: faction.theme.primary }}
            />
            {faction.gridLabel}
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(to right, ${faction.theme.gradientFrom}, ${faction.theme.gradientTo})`,
              }}
            >
              {faction.gridPageTitle}
            </span>
          </h1>
          <p className="mt-3 text-sm text-muted max-w-xl mx-auto">
            {faction.gridPageSubtitle}
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Grid Map */}
      <section className="py-10">
        <FactionGridMap />
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
