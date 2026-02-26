"use client";

import { useEffect, useRef } from "react";

export interface ContextMenuOption {
  label: string;
  icon?: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onSelect: () => void;
}

interface ContextMenuProps {
  x: number;
  y: number;
  options: ContextMenuOption[];
  onClose: () => void;
}

export default function ContextMenu({ x, y, options, onClose }: ContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  const adjustedX = Math.min(x, window.innerWidth - 200);
  const adjustedY = Math.min(y, window.innerHeight - options.length * 40 - 20);

  return (
    <div
      ref={ref}
      className="context-menu"
      style={{ left: adjustedX, top: adjustedY }}
    >
      {options.map((opt, i) => (
        <button
          key={i}
          className={`context-menu-item ${opt.danger ? "danger" : ""}`}
          disabled={opt.disabled}
          onClick={() => {
            opt.onSelect();
            onClose();
          }}
          style={{ opacity: opt.disabled ? 0.4 : 1, cursor: opt.disabled ? "not-allowed" : "pointer" }}
        >
          {opt.icon && <span style={{ display: "flex", width: 16, height: 16, alignItems: "center", justifyContent: "center" }}>{opt.icon}</span>}
          {opt.label}
        </button>
      ))}
    </div>
  );
}
