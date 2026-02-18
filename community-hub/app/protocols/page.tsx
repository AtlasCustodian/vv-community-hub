"use client";

import { useState } from "react";
import Link from "next/link";
import { useFaction } from "@/context/FactionContext";
import { FactionProtocol } from "@/data/factionData";

function CategorySection({
  category,
  items,
  isOpen,
  onToggle,
}: {
  category: string;
  items: FactionProtocol[];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div>
      {/* Category header — clickable toggle */}
      <button
        type="button"
        onClick={onToggle}
        className="mb-4 flex w-full items-center gap-3 group/toggle cursor-pointer"
      >
        <svg
          className={`h-4 w-4 shrink-0 text-muted transition-transform duration-300 ${isOpen ? "rotate-90" : "rotate-0"}`}
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z" />
        </svg>
        <h2 className="text-lg font-bold tracking-tight group-hover/toggle:text-accent-primary transition-colors duration-200">
          {category}
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
        <span className="rounded-full border border-border bg-surface/50 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted">
          {items.length} {items.length === 1 ? "protocol" : "protocols"}
        </span>
      </button>

      {/* Protocol cards — collapsible */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <div className="stagger-children grid grid-cols-1 gap-4 sm:grid-cols-2">
            {items.map((protocol) => (
              <div
                key={protocol.id}
                className="glass-card group relative flex flex-col rounded-2xl p-6 transition-all duration-300 hover:scale-[1.01] hover:-translate-y-0.5"
              >
                {/* Colored accent line */}
                <div className="absolute inset-x-0 top-0 h-px rounded-full bg-accent-primary opacity-30 transition-opacity group-hover:opacity-80" />

                {/* Header */}
                <div className="mb-4 flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-primary/10 text-2xl transition-transform duration-300 group-hover:scale-110">
                    {protocol.icon}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold leading-tight">
                      {protocol.title}
                    </h3>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-accent-primary/70">
                      {protocol.category}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="mb-4 text-sm leading-relaxed text-muted">
                  {protocol.description}
                </p>

                {/* Feature list */}
                <div className="mt-auto flex flex-col gap-2">
                  {protocol.details.map((detail, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 rounded-lg bg-background/30 px-3 py-2"
                    >
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent-primary/15 text-[8px] font-bold text-accent-primary">
                        {i + 1}
                      </span>
                      <span className="text-xs leading-relaxed text-muted/90">
                        {detail}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProtocolsPage() {
  const { faction } = useFaction();
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(
        faction.protocolCategories.map((cat) => [cat, true])
      )
  );

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  return (
    <div className="pb-20">
      <div className="flex justify-start px-4 pt-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface/50 px-4 py-2 text-sm font-medium text-muted transition-all hover:border-accent-primary/30 hover:text-foreground hover:bg-surface-hover"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Return to Dashboard
        </Link>
      </div>
      {/* Quick navigation */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap justify-center gap-2">
            {faction.protocolCategories.map((cat) => (
              <a
                key={cat}
                href={`#${cat.toLowerCase().replace(/\s+/g, "-")}`}
                className="rounded-full border border-border bg-surface/50 px-4 py-1.5 text-xs font-medium text-muted transition-all hover:border-accent-primary/30 hover:text-foreground hover:bg-surface-hover"
              >
                {cat}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Protocol sections by category */}
      <section className="py-4 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl flex flex-col gap-12">
          {faction.protocolCategories.map((category) => {
            const categoryProtocols = faction.protocols.filter(
              (p) => p.category === category
            );
            if (categoryProtocols.length === 0) return null;
            return (
              <div key={category} id={category.toLowerCase().replace(/\s+/g, "-")}>
                <CategorySection
                  category={category}
                  items={categoryProtocols}
                  isOpen={openCategories[category] ?? true}
                  onToggle={() => toggleCategory(category)}
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom note */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="glass-card rounded-2xl p-8">
            <h3 className="mb-2 text-lg font-bold">Need Help?</h3>
            <p className="text-sm text-muted leading-relaxed">
              If you have questions about any system or need assistance with your
              duties, contact your supervisor or visit the dispatch center.{" "}
              {faction.tagline}
            </p>
            <div className="mt-4 text-xs text-muted/60">
              Last updated: Cycle 14, Day 287
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-4 border-t border-border py-8 px-4 text-center">
        <p className="text-xs text-muted">
          {faction.name} &mdash; {faction.tagline}
        </p>
      </footer>
    </div>
  );
}
