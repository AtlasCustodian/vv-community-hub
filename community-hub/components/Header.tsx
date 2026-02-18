"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useFaction } from "@/context/FactionContext";
import { useTick } from "@/context/TickContext";
import { factionIds, factions } from "@/data/factionData";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [factionDropdownOpen, setFactionDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { factionId, faction, setFactionId } = useFaction();
  const { tick, advanceTick } = useTick();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setFactionDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo / Faction Switcher */}
        <div className="relative flex items-center gap-3" ref={dropdownRef}>
          <button
            onClick={() => setFactionDropdownOpen(!factionDropdownOpen)}
            className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface-hover"
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{
                background: `linear-gradient(135deg, ${faction.theme.gradientFrom}, ${faction.theme.gradientTo})`,
              }}
            >
              <span className="text-lg">{faction.emoji}</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(to right, ${faction.theme.gradientFrom}, ${faction.theme.gradientTo})`,
                }}
              >
                {faction.name}
              </span>
            </h1>
            <svg
              className={`h-4 w-4 text-muted transition-transform duration-200 ${factionDropdownOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Faction Dropdown */}
          {factionDropdownOpen && (
            <div className="dropdown-enter absolute left-0 top-full mt-2 w-64 overflow-hidden rounded-xl border border-border bg-surface shadow-2xl">
              <div className="px-3 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                  Switch Faction
                </p>
              </div>
              <div className="flex flex-col gap-0.5 px-1.5 pb-1.5">
                {factionIds.map((id) => {
                  const f = factions[id];
                  const isActive = id === factionId;
                  return (
                    <button
                      key={id}
                      onClick={() => {
                        setFactionId(id);
                        setFactionDropdownOpen(false);
                      }}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-150 ${
                        isActive
                          ? "bg-accent-primary/10"
                          : "hover:bg-surface-hover"
                      }`}
                    >
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm"
                        style={{
                          background: `linear-gradient(135deg, ${f.theme.gradientFrom}, ${f.theme.gradientTo})`,
                        }}
                      >
                        {f.emoji}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-sm font-semibold"
                            style={{ color: isActive ? f.theme.primary : undefined }}
                          >
                            {f.name}
                          </span>
                          {isActive && (
                            <span
                              className="rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase"
                              style={{
                                background: `${f.theme.primary}20`,
                                color: f.theme.primary,
                              }}
                            >
                              Active
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-muted">
                          {f.shortName} Faction
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {faction.navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-accent-primary/10 text-accent-primary"
                    : "text-muted hover:text-foreground hover:bg-surface-hover"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <button
            onClick={advanceTick}
            className="hidden sm:flex h-9 items-center gap-2 rounded-lg border border-border bg-surface px-3 text-sm font-medium transition-all duration-200 hover:border-accent-primary/50 hover:bg-surface-hover hover:text-foreground active:scale-[0.97]"
            style={{ color: faction.theme.primary }}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Next Tick
            <span
              className="rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums"
              style={{
                background: `${faction.theme.primary}15`,
                color: faction.theme.primary,
              }}
            >
              {tick}
            </span>
          </button>

          <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface transition-colors hover:border-accent-primary/30">
            <svg className="h-4 w-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-accent-primary ring-2 ring-background" />
          </button>

          {/* Mobile menu button */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="h-4 w-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-surface/95 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-1 p-4">
            {faction.navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-accent-primary/10 text-accent-primary"
                      : "text-muted hover:text-foreground hover:bg-surface-hover"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
