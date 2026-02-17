import { Achievement } from "@/data/factionData";

interface AchievementBadgeProps {
  achievement: Achievement;
}

const rarityColors: Record<Achievement["rarity"], string> = {
  common: "#8a7460",
  rare: "#f97316",
  epic: "#dc2626",
  legendary: "#fbbf24",
};

const rarityLabels: Record<Achievement["rarity"], string> = {
  common: "Common",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
};

export default function AchievementBadge({
  achievement,
}: AchievementBadgeProps) {
  const color = rarityColors[achievement.rarity];

  return (
    <div
      className={`glass-card group relative flex flex-col items-center gap-3 rounded-2xl p-5 text-center transition-all duration-300 hover:scale-105 hover:-translate-y-1 ${
        !achievement.unlocked ? "opacity-60" : ""
      } ${achievement.rarity === "legendary" ? "legendary-shimmer" : ""}`}
    >
      {/* Rarity indicator */}
      <div
        className="absolute inset-x-0 top-0 h-px rounded-full opacity-60"
        style={{ background: color }}
      />

      {/* Badge icon */}
      <div
        className="relative flex h-14 w-14 items-center justify-center rounded-2xl text-2xl transition-transform duration-300 group-hover:scale-110"
        style={{ background: `${color}15` }}
      >
        {achievement.unlocked ? (
          achievement.icon
        ) : (
          <span className="opacity-40">{achievement.icon}</span>
        )}

        {/* Lock overlay */}
        {!achievement.unlocked && (
          <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-surface text-[10px] ring-2 ring-background">
            🔒
          </div>
        )}

        {/* Checkmark for unlocked */}
        {achievement.unlocked && (
          <div
            className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] text-white ring-2 ring-background"
            style={{ background: color }}
          >
            ✓
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold leading-tight">
        {achievement.title}
      </h3>

      {/* Description */}
      <p className="text-xs leading-relaxed text-muted">
        {achievement.description}
      </p>

      {/* Progress bar */}
      <div className="w-full">
        <div className="mb-1 flex items-center justify-between">
          <span
            className="text-[10px] font-medium uppercase tracking-wider"
            style={{ color }}
          >
            {rarityLabels[achievement.rarity]}
          </span>
          <span className="text-[10px] font-medium text-muted">
            {achievement.progress}%
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-border/50">
          <div
            className="progress-animated h-full rounded-full transition-all"
            style={{
              width: `${achievement.progress}%`,
              background: `linear-gradient(90deg, ${color}, ${color}aa)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
