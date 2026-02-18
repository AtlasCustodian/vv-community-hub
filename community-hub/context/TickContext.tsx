"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

interface TickContextValue {
  /** Current tick number (starts at 0) */
  tick: number;
  /** Advance the simulation by one tick */
  advanceTick: () => void;
}

const TickContext = createContext<TickContextValue | null>(null);

export function TickProvider({ children }: { children: ReactNode }) {
  const [tick, setTick] = useState(0);

  const advanceTick = useCallback(() => {
    setTick((prev) => prev + 1);
  }, []);

  return (
    <TickContext.Provider value={{ tick, advanceTick }}>
      {children}
    </TickContext.Provider>
  );
}

export function useTick(): TickContextValue {
  const ctx = useContext(TickContext);
  if (!ctx) throw new Error("useTick must be used within a TickProvider");
  return ctx;
}
