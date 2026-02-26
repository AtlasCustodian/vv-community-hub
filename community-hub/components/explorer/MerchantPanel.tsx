"use client";

import { useState } from "react";
import type { Item } from "@/types/explorer/explorer";
import type { FactionTheme } from "@/lib/explorer/factionThemes";
import { computeItemGoldPrice } from "@/lib/explorer/salvage";
import ItemTooltip from "./ItemTooltip";

interface MerchantPanelProps {
  items: Item[];
  gold: number;
  theme: FactionTheme;
  currentFloor: number;
  currentHP: number;
  maxHP: number;
  inventoryFull: boolean;
  onBuy: (itemIndex: number) => void;
  onHeal: (amount: number) => void;
  onLeave: () => void;
}

export default function MerchantPanel({
  items,
  gold,
  theme,
  currentFloor,
  currentHP,
  maxHP,
  inventoryFull,
  onBuy,
  onHeal,
  onLeave,
}: MerchantPanelProps) {
  const [healAmount, setHealAmount] = useState(1);
  const missingHP = maxHP - currentHP;
  const healCostPerPoint = currentFloor;
  const totalHealCost = healAmount * healCostPerPoint;
  const canHeal = missingHP > 0 && gold >= healCostPerPoint;

  return (
    <div className="w-full flex flex-col items-center gap-6 animate-fade-in">
      <div className="text-center">
        <h2
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#fbbf24",
            marginBottom: 4,
          }}
        >
          Wandering Merchant
        </h2>
        <p style={{ fontSize: 12, color: "var(--color-muted)" }}>
          &ldquo;Browse my wares, traveler. Everything has a price.&rdquo;
        </p>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            marginTop: 8,
            padding: "4px 12px",
            borderRadius: 6,
            border: "1px solid rgba(251, 191, 36, 0.3)",
            background: "rgba(251, 191, 36, 0.08)",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="5.5" stroke="#fbbf24" strokeWidth="1" fill="rgba(251, 191, 36, 0.15)" />
            <text x="7" y="10" textAnchor="middle" fill="#fbbf24" fontSize="8" fontWeight="bold">G</text>
          </svg>
          <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "var(--font-mono), monospace", color: "#fbbf24" }}>
            {gold} Gold
          </span>
        </div>
      </div>

      {/* Merchant items */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", maxWidth: 720, width: "100%" }}>
        {items.map((item, i) => {
          const price = computeItemGoldPrice(item, currentFloor);
          const canAfford = gold >= price;
          return (
            <div
              key={item.id}
              style={{
                flex: "1 1 200px",
                maxWidth: 240,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div
                className={
                  item.rarity === "legendary"
                    ? "rarity-legendary"
                    : item.rarity === "cursed"
                      ? "rarity-cursed"
                      : item.rarity === "rare"
                        ? "rarity-rare"
                        : ""
                }
              >
                <ItemTooltip item={item} theme={theme} inline />
              </div>
              <button
                onClick={() => onBuy(i)}
                disabled={!canAfford || inventoryFull}
                className="btn-stone px-4 py-2 text-xs font-semibold uppercase tracking-wider"
                style={{
                  borderColor: canAfford && !inventoryFull ? "rgba(251, 191, 36, 0.4)" : "rgba(255,255,255,0.1)",
                  color: canAfford && !inventoryFull ? "#fbbf24" : "var(--color-muted)",
                  opacity: canAfford && !inventoryFull ? 1 : 0.4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1" />
                  <text x="7" y="10" textAnchor="middle" fill="currentColor" fontSize="8" fontWeight="bold">G</text>
                </svg>
                {inventoryFull ? "Full" : `Buy · ${price}g`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Heal section */}
      <div
        className="glass-card rounded-xl p-4"
        style={{
          maxWidth: 360,
          width: "100%",
          borderColor: "rgba(74, 222, 128, 0.15)",
        }}
      >
        <h3
          style={{
            fontSize: 12,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#4ade80",
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          Healing
        </h3>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: "var(--color-muted)" }}>
            HP: {currentHP} / {maxHP}
          </span>
        </div>
        {missingHP > 0 ? (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
              <button
                onClick={() => setHealAmount(Math.max(1, healAmount - 1))}
                disabled={healAmount <= 1}
                className="btn-stone"
                style={{
                  width: 28,
                  height: 28,
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  fontWeight: 700,
                  opacity: healAmount <= 1 ? 0.3 : 1,
                }}
              >
                -
              </button>
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  fontFamily: "var(--font-mono), monospace",
                  color: "#4ade80",
                  minWidth: 30,
                  textAlign: "center",
                }}
              >
                {healAmount}
              </span>
              <button
                onClick={() => setHealAmount(Math.min(missingHP, healAmount + 1))}
                disabled={healAmount >= missingHP}
                className="btn-stone"
                style={{
                  width: 28,
                  height: 28,
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  fontWeight: 700,
                  opacity: healAmount >= missingHP ? 0.3 : 1,
                }}
              >
                +
              </button>
            </div>
            <p style={{ fontSize: 10, color: "var(--color-muted)", textAlign: "center", marginBottom: 8 }}>
              Cost: {healCostPerPoint}g per HP (Floor {currentFloor})
            </p>
            <button
              onClick={() => onHeal(healAmount)}
              disabled={gold < totalHealCost}
              className="btn-stone w-full px-4 py-2 text-xs font-semibold uppercase tracking-wider"
              style={{
                borderColor: gold >= totalHealCost ? "rgba(74, 222, 128, 0.4)" : "rgba(255,255,255,0.1)",
                color: gold >= totalHealCost ? "#4ade80" : "var(--color-muted)",
                opacity: gold >= totalHealCost ? 1 : 0.4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              Heal {healAmount} HP · {totalHealCost}g
            </button>
          </>
        ) : (
          <p style={{ fontSize: 12, color: "#4ade80", textAlign: "center" }}>
            Full health
          </p>
        )}
      </div>

      {/* Leave button */}
      <button
        onClick={onLeave}
        className="btn-stone px-10 py-2.5 text-sm font-semibold uppercase tracking-wider"
        style={{ borderColor: `${theme.primary}40` }}
      >
        Leave
      </button>
    </div>
  );
}
