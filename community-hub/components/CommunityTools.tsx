"use client";

import { useFaction } from "@/context/FactionContext";
import ToolCard from "./ToolCard";

export default function CommunityTools() {
  const { faction } = useFaction();

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight">
            Operations Console
          </h2>
          <p className="mt-1 text-sm text-muted">
            {faction.name} tools, monitoring, and infrastructure management
          </p>
        </div>

        {/* Tools grid */}
        <div className="stagger-children grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {faction.tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </section>
  );
}
