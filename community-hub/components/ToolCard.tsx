import { Tool } from "@/data/factionData";

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <div className="glass-card group relative flex flex-col gap-4 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 cursor-pointer">
      {/* Colored top accent */}
      <div
        className="absolute inset-x-0 top-0 h-px rounded-full opacity-50 transition-opacity group-hover:opacity-100"
        style={{ background: tool.color }}
      />

      {/* Icon + Title row */}
      <div className="flex items-start gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl transition-transform duration-300 group-hover:scale-110"
          style={{ background: `${tool.color}15` }}
        >
          {tool.icon}
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-semibold leading-tight">
            {tool.title}
          </h3>
          {tool.memberCount && (
            <p className="mt-0.5 text-xs text-muted">
              {tool.memberCount.toLocaleString()} members active
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm leading-relaxed text-muted">
        {tool.description}
      </p>

      {/* Action hint */}
      <div className="mt-auto flex items-center gap-1.5 text-xs font-medium transition-colors" style={{ color: tool.color }}>
        <span>Explore</span>
        <svg
          className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </div>
  );
}
