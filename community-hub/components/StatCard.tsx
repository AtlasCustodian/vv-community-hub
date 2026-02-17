import { Stat } from "@/data/factionData";

interface StatCardProps {
  stat: Stat;
  index: number;
}

export default function StatCard({ stat, index }: StatCardProps) {
  return (
    <div
      className="glass-card group relative flex flex-col items-center gap-2 rounded-2xl p-5 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
      style={{
        animationDelay: `${index * 0.08}s`,
      }}
    >
      {/* Colored top accent line */}
      <div
        className="absolute inset-x-0 top-0 h-px rounded-full opacity-50 transition-opacity group-hover:opacity-100"
        style={{ background: stat.color }}
      />

      {/* Icon */}
      <div
        className="flex h-11 w-11 items-center justify-center rounded-xl text-xl"
        style={{ background: `${stat.color}15` }}
      >
        {stat.icon}
      </div>

      {/* Value */}
      <span
        className="text-2xl font-bold tracking-tight"
        style={{ color: stat.color }}
      >
        {stat.value}
      </span>

      {/* Label */}
      <span className="text-xs font-medium uppercase tracking-wider text-muted">
        {stat.label}
      </span>
    </div>
  );
}
