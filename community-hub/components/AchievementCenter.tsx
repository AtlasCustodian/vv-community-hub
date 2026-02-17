"use client";

import { useFaction } from "@/context/FactionContext";
import AchievementBadge from "./AchievementBadge";

export default function AchievementCenter() {
  const { faction } = useFaction();
  const { achievements } = faction;
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Achievement Center
            </h2>
            <p className="mt-1 text-sm text-muted">
              Track your progress and unlock new milestones
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted">
            <span className="flex h-6 items-center rounded-full bg-accent-primary/10 px-2.5 text-xs font-medium text-accent-primary">
              {unlockedCount}/{achievements.length} Unlocked
            </span>
          </div>
        </div>

        {/* Achievement grid */}
        <div className="stagger-children grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {achievements.map((achievement) => (
            <AchievementBadge key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </div>
    </section>
  );
}
