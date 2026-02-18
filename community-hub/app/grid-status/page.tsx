"use client";

import FactionGridMap from "@/components/FactionGridMap";
import { useFaction } from "@/context/FactionContext";

export default function GridStatusPage() {
  const { faction } = useFaction();

  return (
    <div className="pb-20">
      {/* Grid Map */}
      <section className="pt-4 pb-10">
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
