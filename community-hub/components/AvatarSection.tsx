"use client";

import { useFaction } from "@/context/FactionContext";
import StatCard from "./StatCard";

export default function AvatarSection() {
  const { faction } = useFaction();
  const { userProfile, stats, theme } = faction;

  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8">
      {/* Background gradient glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="h-[400px] w-[400px] rounded-full blur-3xl"
          style={{ background: `${theme.primary}08` }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-center gap-6 lg:gap-10">
          {/* Left badges (first 3) */}
          <div className="hidden lg:flex flex-col items-end gap-4 stagger-children">
            {stats.slice(0, 3).map((stat, index) => (
              <div key={stat.label} className="w-44">
                <StatCard stat={stat} index={index} />
              </div>
            ))}
          </div>

          {/* Avatar + Profile Info */}
          <div className="flex flex-col items-center text-center animate-fade-in-up">
            <div
              className="avatar-ring relative mb-6 rounded-full p-1"
              style={{
                backgroundImage: `linear-gradient(135deg, ${theme.gradientFrom}, ${theme.gradientTo})`,
              }}
            >
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-surface text-5xl sm:h-32 sm:w-32">
                {userProfile.avatarEmoji}
              </div>
              <span
                className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-[3px] border-background"
                style={{ background: theme.primary }}
              />
            </div>

            <h2 className="mb-1 text-2xl font-bold tracking-tight sm:text-3xl">
              {userProfile.name}
            </h2>
            <p className="mb-2 text-sm font-medium text-accent-primary">
              {userProfile.role}
            </p>
            <p className="max-w-md text-sm text-muted">{userProfile.bio}</p>
            <p className="mt-2 text-xs text-muted/60">
              Serving since {userProfile.joinDate}
            </p>
          </div>

          {/* Right badges (last 3) */}
          <div className="hidden lg:flex flex-col items-start gap-4 stagger-children">
            {stats.slice(3, 6).map((stat, index) => (
              <div key={stat.label} className="w-44">
                <StatCard stat={stat} index={index + 3} />
              </div>
            ))}
          </div>

          {/* Mobile/tablet: all 6 badges in a grid below the profile */}
          <div className="lg:hidden col-span-full stagger-children grid grid-cols-2 gap-3 sm:grid-cols-3 mt-8">
            {stats.map((stat, index) => (
              <StatCard key={stat.label} stat={stat} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
