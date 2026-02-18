"use client";

import { useState } from "react";
import { useFaction } from "@/context/FactionContext";
import ToolCard from "./ToolCard";

export default function CommunityTools() {
  const { faction } = useFaction();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="mb-8 flex w-full items-center justify-between rounded-lg px-1 py-2 text-left transition-colors hover:bg-surface-hover/50"
        >
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Operations Console
            </h2>
            <p className="mt-1 text-sm text-muted">
              {faction.name} tools, monitoring, and infrastructure management
            </p>
          </div>
          <svg
            className={`h-5 w-5 shrink-0 text-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="stagger-children grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {faction.tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
