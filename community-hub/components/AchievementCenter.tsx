"use client";

import { useState } from "react";
import { useFaction } from "@/context/FactionContext";
import AchievementBadge from "./AchievementBadge";

export default function AchievementCenter() {
  const { faction } = useFaction();
  const { achievements } = faction;
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Section header (toggle button) */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="mb-8 flex w-full items-center justify-between rounded-lg px-1 py-2 text-left transition-colors hover:bg-surface-hover/50"
        >
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Achievement Center
            </h2>
            <p className="mt-1 text-sm text-muted">
              Track your progress and unlock new milestones
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-6 items-center rounded-full bg-accent-primary/10 px-2.5 text-xs font-medium text-accent-primary">
              {unlockedCount}/{achievements.length} Unlocked
            </span>
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
          </div>
        </button>

        {/* Achievement grid */}
        {isOpen && (
          <div className="stagger-children grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {achievements.map((achievement) => (
              <AchievementBadge key={achievement.id} achievement={achievement} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
