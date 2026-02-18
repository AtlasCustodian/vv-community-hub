export interface Stat {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number; // 0-100
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface Tool {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  memberCount?: number;
}

export const stats: Stat[] = [
  { label: "Power Output", value: "9.4 GW", icon: "⚡", color: "#f97316" },
  { label: "Shifts Logged", value: "1,847", icon: "🔥", color: "#ea580c" },
  { label: "Generators", value: 6, icon: "⚙️", color: "#d97706" },
  { label: "Heat Rating", value: "A+", icon: "🌡️", color: "#dc2626" },
  { label: "Rank", value: "Thermtech", icon: "🛡️", color: "#b45309" },
  { label: "Pressure (PSI)", value: "2,140", icon: "💨", color: "#c2410c" },
];

export const achievements: Achievement[] = [
  {
    id: "first-shift",
    title: "First Shift",
    description: "Completed your first rotation in the Deeps",
    icon: "🔥",
    unlocked: true,
    progress: 100,
    rarity: "common",
  },
  {
    id: "valve-runner",
    title: "Valve Runner",
    description: "Replaced 10 pressure valves without a single shutdown",
    icon: "🔧",
    unlocked: true,
    progress: 100,
    rarity: "common",
  },
  {
    id: "heat-endurance",
    title: "Heat Endurance",
    description: "Survived 50 consecutive hour-long lava-proximity shifts",
    icon: "🌡️",
    unlocked: true,
    progress: 100,
    rarity: "rare",
  },
  {
    id: "steam-master",
    title: "Steam Master",
    description: "Maintained turbine efficiency above 98% for a full cycle",
    icon: "💨",
    unlocked: false,
    progress: 82,
    rarity: "rare",
  },
  {
    id: "lava-walker",
    title: "Lava Walker",
    description: "Completed a coolant-suit inspection within 3 meters of an active lava pool",
    icon: "🌋",
    unlocked: false,
    progress: 55,
    rarity: "epic",
  },
  {
    id: "grid-savior",
    title: "Grid Savior",
    description: "Prevented a full island blackout during a Veil surge",
    icon: "⚡",
    unlocked: false,
    progress: 40,
    rarity: "epic",
  },
  {
    id: "the-marshall",
    title: "The Marshall's Trust",
    description: "Earned a personal commendation from Marshall Herman",
    icon: "🛡️",
    unlocked: false,
    progress: 30,
    rarity: "legendary",
  },
  {
    id: "deeps-veteran",
    title: "Deeps Veteran",
    description: "One of the first 100 to serve in the Deeps when the generators were built",
    icon: "🏗️",
    unlocked: true,
    progress: 100,
    rarity: "legendary",
  },
];

export const tools: Tool[] = [
  {
    id: "shift-scheduler",
    title: "Shift Scheduler",
    description:
      "View and manage rotation schedules for all Deeps-level shifts and coolant-suit assignments",
    icon: "📋",
    color: "#f97316",
    memberCount: 312,
  },
  {
    id: "generator-status",
    title: "Generator Status",
    description:
      "Real-time monitoring of all six lava-powered generators — output, temperature, and fault alerts",
    icon: "⚙️",
    color: "#ea580c",
    memberCount: 248,
  },
  {
    id: "power-grid",
    title: "Power Grid Monitor",
    description:
      "Track island-wide power distribution to the Breakers, irrigation pumps, Metal labs, and the Roots",
    icon: "⚡",
    color: "#d97706",
    memberCount: 186,
  },
  {
    id: "coolant-inventory",
    title: "Coolant Suit Inventory",
    description:
      "Check suit availability, maintenance status, and schedule fittings for lava-proximity work",
    icon: "🧥",
    color: "#dc2626",
    memberCount: 145,
  },
  {
    id: "pressure-logs",
    title: "Steam Pressure Logs",
    description:
      "Historical and live pressure readings across all turbine lines and seawater intake systems",
    icon: "📊",
    color: "#b45309",
    memberCount: 198,
  },
  {
    id: "maintenance-dispatch",
    title: "Maintenance Dispatch",
    description:
      "Submit and track repair orders for valves, turbines, elevator brakes, and grid infrastructure",
    icon: "🔧",
    color: "#c2410c",
    memberCount: 267,
  },
];

