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
  /** Reset tick back to 0 */
  resetTick: () => void;
}

const TickContext = createContext<TickContextValue | null>(null);

export function TickProvider({ children }: { children: ReactNode }) {
  const [tick, setTick] = useState(0);

  const advanceTick = useCallback(() => {
    setTick((prev) => prev + 1);
  }, []);

  const resetTick = useCallback(() => {
    setTick(0);
  }, []);

  return (
    <TickContext.Provider value={{ tick, advanceTick, resetTick }}>
      {children}
    </TickContext.Provider>
  );
}

export function useTick(): TickContextValue {
  const ctx = useContext(TickContext);
  if (!ctx) throw new Error("useTick must be used within a TickProvider");
  return ctx;
}
