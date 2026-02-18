// ─── Shared Types ───────────────────────────────────────────────────────────

export type FactionId = "fire" | "earth" | "water" | "wood" | "metal";

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
  progress: number;
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

export interface UserProfile {
  name: string;
  role: string;
  joinDate: string;
  bio: string;
  avatarEmoji: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface FacilityStat {
  label: string;
  value: string;
  description: string;
}

export interface FacilitySection {
  id: string;
  name: string;
  description: string;
  health: number;
  icon: string;
  color: string;
  stats: FacilityStat[];
}

export interface GridNode {
  id: string;
  name: string;
  health: number;
  x: number;
  y: number;
  assignedUsers: number;
}

export interface GridEdge {
  from: string;
  to: string;
  health: number;
}

export interface FactionProtocol {
  id: string;
  title: string;
  icon: string;
  category: string;
  description: string;
  details: string[];
}

export interface Champion {
  id: string;
  name: string;
  returnRate: number;
  startingReturnRate: number;
  stabilityScore: number;
  currentAssignment: string;
}

export interface FactionTheme {
  primary: string;
  secondary: string;
  gradientFrom: string;
  gradientTo: string;
}

export interface FactionData {
  id: FactionId;
  name: string;
  shortName: string;
  emoji: string;
  tagline: string;
  theme: FactionTheme;
  navItems: NavItem[];
  userProfile: UserProfile;
  stats: Stat[];
  achievements: Achievement[];
  tools: Tool[];
  facilityPageTitle: string;
  facilityPageSubtitle: string;
  facilityLabel: string;
  facilitySections: FacilitySection[];
  gridPageTitle: string;
  gridPageSubtitle: string;
  gridLabel: string;
  gridNodeEmoji: string;
  gridNodes: GridNode[];
  gridEdges: GridEdge[];
  protocolCategories: string[];
  protocols: FactionProtocol[];
  champions: Champion[];
}

// ─── Fire / The Marshalls ───────────────────────────────────────────────────

const fireFaction: FactionData = {
  id: "fire",
  name: "The Marshalls",
  shortName: "Fire",
  emoji: "🔥",
  tagline: "Nothing works without us. Power from the Deeps.",
  theme: {
    primary: "#f97316",
    secondary: "#ea580c",
    gradientFrom: "#f97316",
    gradientTo: "#dc2626",
  },
  navItems: [
    { label: "Dashboard", href: "/" },
    { label: "Faction HQ", href: "/grid-status" },
    { label: "Generators", href: "/generators" },
    { label: "Protocols", href: "/protocols" },
  ],
  userProfile: {
    name: "Hakan",
    role: "Thermtech — Generator 4",
    joinDate: "Year 12 of the Current Cycle",
    bio: "Assigned to Generator 4 in the Deeps. Loves the machines, takes double shifts without complaint. Nothing works without us.",
    avatarEmoji: "🔥",
  },
  stats: [
    { label: "Power Output", value: "9.4 GW", icon: "⚡", color: "#f97316" },
    { label: "Shifts Logged", value: "1,847", icon: "🔥", color: "#ea580c" },
    { label: "Generators", value: 6, icon: "⚙️", color: "#d97706" },
    { label: "Heat Rating", value: "A+", icon: "🌡️", color: "#dc2626" },
    { label: "Rank", value: "Thermtech", icon: "🛡️", color: "#b45309" },
    { label: "Pressure (PSI)", value: "2,140", icon: "💨", color: "#c2410c" },
  ],
  achievements: [
    { id: "first-shift", title: "First Shift", description: "Completed your first rotation in the Deeps", icon: "🔥", unlocked: true, progress: 100, rarity: "common" },
    { id: "valve-runner", title: "Valve Runner", description: "Replaced 10 pressure valves without a single shutdown", icon: "🔧", unlocked: true, progress: 100, rarity: "common" },
    { id: "heat-endurance", title: "Heat Endurance", description: "Survived 50 consecutive hour-long lava-proximity shifts", icon: "🌡️", unlocked: true, progress: 100, rarity: "rare" },
    { id: "steam-master", title: "Steam Master", description: "Maintained turbine efficiency above 98% for a full cycle", icon: "💨", unlocked: false, progress: 82, rarity: "rare" },
    { id: "lava-walker", title: "Lava Walker", description: "Completed a coolant-suit inspection within 3 meters of an active lava pool", icon: "🌋", unlocked: false, progress: 55, rarity: "epic" },
    { id: "grid-savior", title: "Grid Savior", description: "Prevented a full island blackout during a Veil surge", icon: "⚡", unlocked: false, progress: 40, rarity: "epic" },
    { id: "the-marshall", title: "The Marshall's Trust", description: "Earned a personal commendation from Marshall Herman", icon: "🛡️", unlocked: false, progress: 30, rarity: "legendary" },
    { id: "deeps-veteran", title: "Deeps Veteran", description: "One of the first 100 to serve in the Deeps when the generators were built", icon: "🏗️", unlocked: true, progress: 100, rarity: "legendary" },
  ],
  tools: [
    { id: "shift-scheduler", title: "Shift Scheduler", description: "View and manage rotation schedules for all Deeps-level shifts and coolant-suit assignments", icon: "📋", color: "#f97316", memberCount: 312 },
    { id: "generator-status", title: "Generator Status", description: "Real-time monitoring of all six lava-powered generators — output, temperature, and fault alerts", icon: "⚙️", color: "#ea580c", memberCount: 248 },
    { id: "power-grid", title: "Power Grid Monitor", description: "Track island-wide power distribution to the Breakers, irrigation pumps, Metal labs, and the Roots", icon: "⚡", color: "#d97706", memberCount: 186 },
    { id: "coolant-inventory", title: "Coolant Suit Inventory", description: "Check suit availability, maintenance status, and schedule fittings for lava-proximity work", icon: "🧥", color: "#dc2626", memberCount: 145 },
    { id: "pressure-logs", title: "Steam Pressure Logs", description: "Historical and live pressure readings across all turbine lines and seawater intake systems", icon: "📊", color: "#b45309", memberCount: 198 },
    { id: "maintenance-dispatch", title: "Maintenance Dispatch", description: "Submit and track repair orders for valves, turbines, elevator brakes, and grid infrastructure", icon: "🔧", color: "#c2410c", memberCount: 267 },
  ],
  facilityPageTitle: "Generator Diagnostics",
  facilityPageSubtitle: "Interactive schematic of Generator 04 in the Deeps. Hover over any section to view real-time health data, statistics, and subsystem descriptions.",
  facilityLabel: "Generator 04 — Live Monitoring",
  facilitySections: [
    { id: "boiler-core", name: "Boiler Core", description: "The primary heat chamber where lava superheats pressurized water into high-energy steam. The heart of every Deeps generator.", health: 94, icon: "🔥", color: "#f97316", stats: [{ label: "Core Temp", value: "1,847°F", description: "Internal temperature of the boiler chamber. Optimal range: 1,700–2,000°F." }, { label: "Water Pressure", value: "2,140 PSI", description: "Pressure of superheated water within the boiler." }, { label: "Lava Flow Rate", value: "48 gal/min", description: "Volume of molten lava channeled through the core per minute." }] },
    { id: "turbine-assembly", name: "Turbine Assembly", description: "Massive reinforced steam turbines converting thermal energy into rotational mechanical energy at over 3,600 RPM.", health: 87, icon: "⚙️", color: "#ea580c", stats: [{ label: "RPM", value: "3,612", description: "Rotations per minute of the primary turbine shaft." }, { label: "Efficiency", value: "97.3%", description: "Percentage of thermal energy converted to mechanical energy." }, { label: "Blade Wear", value: "12%", description: "Cumulative erosion on turbine blades. Replace at 40%." }] },
    { id: "pressure-regulators", name: "Pressure Regulators", description: "A network of valves and bypass channels maintaining safe steam pressure throughout the generator.", health: 72, icon: "💨", color: "#d97706", stats: [{ label: "Valve Status", value: "11/12 Active", description: "Pressure valves currently operational." }, { label: "Bypass Flow", value: "6.2%", description: "Steam diverted through bypass channels." }, { label: "Relief Events", value: "3 this cycle", description: "Emergency pressure relief triggers this cycle." }] },
    { id: "condenser-unit", name: "Condenser Unit", description: "Cools exhausted steam back into water using seawater intake, completing the thermal cycle.", health: 91, icon: "🌊", color: "#3b82f6", stats: [{ label: "Coolant Temp", value: "62°F", description: "Seawater coolant temperature." }, { label: "Recovery Rate", value: "98.1%", description: "Steam successfully condensed to water." }, { label: "Scaling", value: "Low", description: "Mineral buildup on condenser surfaces." }] },
    { id: "lava-intake", name: "Lava Intake", description: "Armored channels drawing molten lava from deep volcanic vents into the boiler core.", health: 68, icon: "🌋", color: "#dc2626", stats: [{ label: "Channel Temp", value: "2,680°F", description: "Lava channel wall temperature." }, { label: "Lining Integrity", value: "68%", description: "Heat-resistant channel lining. Replace below 50%." }, { label: "Flow Control", value: "Active", description: "Automated lava flow control gate status." }] },
    { id: "power-coupling", name: "Power Coupling", description: "High-voltage electrical coupling converting turbine rotation into grid electricity.", health: 96, icon: "⚡", color: "#fbbf24", stats: [{ label: "Output", value: "1.6 GW", description: "Electrical output to the island grid." }, { label: "Voltage", value: "138 kV", description: "Transmission voltage at coupling point." }, { label: "Load Factor", value: "82%", description: "Percentage of maximum capacity utilized." }] },
    { id: "exhaust-stack", name: "Exhaust Stack", description: "Reinforced chimney venting excess steam and volcanic gases above the Deeps.", health: 85, icon: "🏭", color: "#8b5cf6", stats: [{ label: "Emission Rate", value: "Low", description: "Volcanic gas emission level." }, { label: "Stack Temp", value: "412°F", description: "Gas temperature at exhaust point." }, { label: "Scrubber Health", value: "85%", description: "Exhaust scrubber filtration efficiency." }] },
  ],
  gridPageTitle: "Faction HQ",
  gridPageSubtitle: "Network map of all 13 lava-powered generators across the island. Hover over any generator to view its health, connections, and assigned Fire faction crew.",
  gridLabel: "Island-Wide Grid — Live",
  gridNodeEmoji: "⚙️",
  gridNodes: [
    { id: "gen-01", name: "Gen-01", health: 94, x: 400, y: 80, assignedUsers: 47 },
    { id: "gen-02", name: "Gen-02", health: 87, x: 230, y: 170, assignedUsers: 52 },
    { id: "gen-03", name: "Gen-03", health: 72, x: 570, y: 170, assignedUsers: 38 },
    { id: "gen-04", name: "Gen-04", health: 96, x: 120, y: 290, assignedUsers: 61 },
    { id: "gen-05", name: "Gen-05", health: 68, x: 400, y: 270, assignedUsers: 44 },
    { id: "gen-06", name: "Gen-06", health: 91, x: 680, y: 290, assignedUsers: 55 },
    { id: "gen-07", name: "Gen-07", health: 85, x: 80, y: 420, assignedUsers: 33 },
    { id: "gen-08", name: "Gen-08", health: 45, x: 280, y: 400, assignedUsers: 71 },
    { id: "gen-09", name: "Gen-09", health: 78, x: 520, y: 400, assignedUsers: 49 },
    { id: "gen-10", name: "Gen-10", health: 93, x: 720, y: 420, assignedUsers: 40 },
    { id: "gen-11", name: "Gen-11", health: 62, x: 180, y: 530, assignedUsers: 58 },
    { id: "gen-12", name: "Gen-12", health: 88, x: 400, y: 520, assignedUsers: 36 },
    { id: "gen-13", name: "Gen-13", health: 55, x: 620, y: 530, assignedUsers: 42 },
  ],
  gridEdges: [
    { from: "gen-01", to: "gen-02", health: 90 }, { from: "gen-01", to: "gen-03", health: 85 }, { from: "gen-01", to: "gen-05", health: 78 },
    { from: "gen-02", to: "gen-04", health: 92 }, { from: "gen-02", to: "gen-05", health: 65 }, { from: "gen-04", to: "gen-07", health: 88 },
    { from: "gen-07", to: "gen-08", health: 42 }, { from: "gen-07", to: "gen-11", health: 70 }, { from: "gen-03", to: "gen-06", health: 94 },
    { from: "gen-03", to: "gen-05", health: 60 }, { from: "gen-06", to: "gen-09", health: 82 }, { from: "gen-06", to: "gen-10", health: 91 },
    { from: "gen-08", to: "gen-11", health: 55 }, { from: "gen-08", to: "gen-12", health: 48 }, { from: "gen-09", to: "gen-12", health: 76 },
    { from: "gen-09", to: "gen-13", health: 58 }, { from: "gen-10", to: "gen-13", health: 85 }, { from: "gen-11", to: "gen-12", health: 72 },
    { from: "gen-12", to: "gen-13", health: 66 }, { from: "gen-04", to: "gen-08", health: 75 }, { from: "gen-05", to: "gen-08", health: 50 },
    { from: "gen-05", to: "gen-09", health: 68 },
  ],
  protocolCategories: ["Core Systems", "Operations", "Monitoring", "Community", "Reference"],
  protocols: [
    { id: "dashboard", title: "Faction Dashboard", icon: "📊", category: "Core Systems", description: "Your personal command center within the Fire faction. At-a-glance view of your status, rank, and contributions.", details: ["View your current rank, power output contribution, and shift history", "Track personal stats including Heat Rating and Pressure metrics", "See your avatar and profile information", "Quick access to all faction tools and notifications"] },
    { id: "generators", title: "Generator Monitoring", icon: "⚙️", category: "Core Systems", description: "Real-time monitoring and diagnostics for lava-powered generators in the Deeps.", details: ["Interactive schematic view of generator internals", "Health bars and real-time statistics for every subsystem", "Track maintenance needs: lining integrity, blade wear, valve status", "Color-coded warnings when subsystems approach critical thresholds"] },
    { id: "grid-status", title: "Faction HQ Network", icon: "⚡", category: "Core Systems", description: "Live network map showing all 13 generators and their interconnections.", details: ["Visual network map with health indicators", "Connection lines color-coded by signal integrity", "Fire faction member assignments per generator", "Monitor overall grid stability and power distribution"] },
    { id: "shift-scheduler", title: "Shift Scheduler", icon: "📋", category: "Operations", description: "Manage rotation schedules for all Deeps-level shifts.", details: ["View weekly and monthly rotation schedules", "Request shift swaps with other faction members", "Track coolant-suit availability", "Receive notifications for upcoming shifts"] },
    { id: "coolant-suits", title: "Coolant Suit Inventory", icon: "🧥", category: "Operations", description: "Track availability and maintenance of coolant suits for lava proximity work.", details: ["Real-time inventory by size and certification level", "Maintenance status tracking", "Schedule fittings and certifications", "Report suit malfunctions for replacement"] },
    { id: "pressure-logs", title: "Steam Pressure Logs", icon: "📈", category: "Monitoring", description: "Historical and live pressure readings across all turbine lines.", details: ["Live pressure readings from every turbine line", "Historical pressure graphs with trend analysis", "Automated alerts for deviations", "Export data for engineering reports"] },
    { id: "maintenance", title: "Maintenance Dispatch", icon: "🔧", category: "Operations", description: "Submit and track repair orders for valves, turbines, and grid infrastructure.", details: ["Submit requests with priority levels", "Track repair order status", "View maintenance history", "Coordinate with other factions for parts"] },
    { id: "achievements", title: "Achievement Center", icon: "🏆", category: "Community", description: "Track your progress toward Fire faction milestones and badges.", details: ["Four rarity tiers: Common, Rare, Epic, Legendary", "Progress bars for each achievement", "Achievements tied to real contributions", "Faction-wide leaderboards"] },
    { id: "protocols-guide", title: "Protocols & Documentation", icon: "📖", category: "Reference", description: "Comprehensive guide to every feature and system available to Fire faction members.", details: ["Complete documentation for all faction tools", "Searchable by category", "Updated with each deployment", "Accessible to all ranks"] },
  ],
  champions: [
    { id: "f-01", name: "Tormund Ashvane", returnRate: 0.0047, startingReturnRate: 0.0047, stabilityScore: 92, currentAssignment: "Not Assigned" },
    { id: "f-02", name: "Brega Ironhearth", returnRate: 0.0083, startingReturnRate: 0.0083, stabilityScore: 88, currentAssignment: "Not Assigned" },
    { id: "f-03", name: "Sultar Emberclaw", returnRate: -0.0012, startingReturnRate: -0.0012, stabilityScore: 71, currentAssignment: "Not Assigned" },
    { id: "f-04", name: "Vyra Cindersteel", returnRate: 0.0065, startingReturnRate: 0.0065, stabilityScore: 97, currentAssignment: "Not Assigned" },
    { id: "f-05", name: "Kelso Magmafist", returnRate: 0.0028, startingReturnRate: 0.0028, stabilityScore: 84, currentAssignment: "Not Assigned" },
    { id: "f-06", name: "Drenna Boilerwright", returnRate: 0.0091, startingReturnRate: 0.0091, stabilityScore: 90, currentAssignment: "Not Assigned" },
    { id: "f-07", name: "Hask Sootwalker", returnRate: -0.0018, startingReturnRate: -0.0018, stabilityScore: 67, currentAssignment: "Not Assigned" },
    { id: "f-08", name: "Morra Forgehammer", returnRate: 0.0054, startingReturnRate: 0.0054, stabilityScore: 85, currentAssignment: "Not Assigned" },
    { id: "f-09", name: "Ozen Lavathroat", returnRate: 0.0002, startingReturnRate: 0.0002, stabilityScore: 79, currentAssignment: "Not Assigned" },
    { id: "f-10", name: "Fennick Steamborn", returnRate: 0.0076, startingReturnRate: 0.0076, stabilityScore: 93, currentAssignment: "Not Assigned" },
    { id: "f-11", name: "Zara Heatspur", returnRate: 0.0039, startingReturnRate: 0.0039, stabilityScore: 76, currentAssignment: "Not Assigned" },
    { id: "f-12", name: "Grint Ashbelcher", returnRate: -0.0007, startingReturnRate: -0.0007, stabilityScore: 69, currentAssignment: "Not Assigned" },
    { id: "f-13", name: "Pell Turbinecrank", returnRate: 0.0061, startingReturnRate: 0.0061, stabilityScore: 82, currentAssignment: "Not Assigned" },
    { id: "f-14", name: "Russka Pyreblade", returnRate: 0.0015, startingReturnRate: 0.0015, stabilityScore: 91, currentAssignment: "Not Assigned" },
    { id: "f-15", name: "Dorn Coalhand", returnRate: 0.0088, startingReturnRate: 0.0088, stabilityScore: 80, currentAssignment: "Not Assigned" },
    { id: "f-16", name: "Agna Vulcanis", returnRate: -0.0003, startingReturnRate: -0.0003, stabilityScore: 86, currentAssignment: "Not Assigned" },
    { id: "f-17", name: "Therrik Moltencore", returnRate: 0.0044, startingReturnRate: 0.0044, stabilityScore: 65, currentAssignment: "Not Assigned" },
  ],
};

// ─── Earth / The Ironlord ───────────────────────────────────────────────────

const earthFaction: FactionData = {
  id: "earth",
  name: "The Ironlord",
  shortName: "Earth",
  emoji: "🏛️",
  tagline: "The energy of the island. Culture, commerce, and community.",
  theme: {
    primary: "#c4a35a",
    secondary: "#a08040",
    gradientFrom: "#c4a35a",
    gradientTo: "#8b6914",
  },
  navItems: [
    { label: "Dashboard", href: "/" },
    { label: "Faction HQ", href: "/grid-status" },
    { label: "The Roots", href: "/generators" },
    { label: "Protocols", href: "/protocols" },
  ],
  userProfile: {
    name: "Kael",
    role: "Master Artisan — The Roots Market",
    joinDate: "Year 8 of the Current Cycle",
    bio: "Master craftsman and guild coordinator in the Roots. Keeps the market thriving, the trades moving, and the culture alive. The island is more than survival — it's a society.",
    avatarEmoji: "🏛️",
  },
  stats: [
    { label: "Market Revenue", value: "14.2K", icon: "💰", color: "#c4a35a" },
    { label: "Citizens Served", value: "4,891", icon: "👥", color: "#a08040" },
    { label: "Artisan Guilds", value: 12, icon: "🎨", color: "#d4af37" },
    { label: "Civic Rating", value: "A", icon: "⭐", color: "#b8860b" },
    { label: "Rank", value: "Master Artisan", icon: "🏅", color: "#8b6914" },
    { label: "Trade Routes", value: 8, icon: "🛤️", color: "#cd853f" },
  ],
  achievements: [
    { id: "market-day", title: "Market Day", description: "Served your first 100 customers in the Roots Market", icon: "🛍️", unlocked: true, progress: 100, rarity: "common" },
    { id: "guild-initiate", title: "Guild Initiate", description: "Joined an artisan guild and completed your apprenticeship", icon: "🎨", unlocked: true, progress: 100, rarity: "common" },
    { id: "crowd-pleaser", title: "Crowd Pleaser", description: "Organized a cultural event attended by over 500 citizens", icon: "🎭", unlocked: true, progress: 100, rarity: "rare" },
    { id: "bridge-builder", title: "Bridge Builder", description: "Brokered a trade agreement between two rival merchant houses", icon: "🤝", unlocked: false, progress: 72, rarity: "rare" },
    { id: "voice-of-the-people", title: "Voice of the People", description: "Represented civilian interests in a full Council assembly", icon: "📢", unlocked: false, progress: 45, rarity: "epic" },
    { id: "roots-keeper", title: "Roots Keeper", description: "Maintained the market district for 10 consecutive cycles without incident", icon: "🏠", unlocked: false, progress: 60, rarity: "epic" },
    { id: "ironlords-counsel", title: "Ironlord's Counsel", description: "Earned an advisory seat with the Ironlord on a critical island matter", icon: "👑", unlocked: false, progress: 20, rarity: "legendary" },
    { id: "foundation-stone", title: "Foundation Stone", description: "Laid one of the original cornerstones when the Roots were first built", icon: "🧱", unlocked: true, progress: 100, rarity: "legendary" },
  ],
  tools: [
    { id: "market-manager", title: "Market Manager", description: "Manage vendor stalls, pricing, inventory, and daily operations across the Roots Market", icon: "🏪", color: "#c4a35a", memberCount: 1240 },
    { id: "guild-registry", title: "Guild Registry", description: "Browse and join artisan guilds — bakers, tailors, smiths, artists, builders, and more", icon: "📜", color: "#a08040", memberCount: 890 },
    { id: "cultural-events", title: "Cultural Events", description: "Plan and attend festivals, performances, exhibitions, and community gatherings", icon: "🎭", color: "#d4af37", memberCount: 2100 },
    { id: "housing-authority", title: "Housing Authority", description: "Manage residential assignments, construction projects, and community spaces in the Roots", icon: "🏠", color: "#b8860b", memberCount: 760 },
    { id: "trade-ledger", title: "Trade Ledger", description: "Track interfaction trade agreements, supply contracts, and economic metrics", icon: "📊", color: "#8b6914", memberCount: 430 },
    { id: "civic-dispatch", title: "Civic Dispatch", description: "Submit and track civic requests — infrastructure repairs, public services, and community needs", icon: "📋", color: "#cd853f", memberCount: 580 },
  ],
  facilityPageTitle: "The Roots",
  facilityPageSubtitle: "Interactive overview of the Roots — the residential and commercial heart of the island. Monitor markets, housing, and community infrastructure.",
  facilityLabel: "The Roots — Live Status",
  facilitySections: [
    { id: "central-market", name: "Central Market", description: "The bustling heart of the Roots where hundreds of vendors trade goods daily. Everything from bread to art to tools passes through here.", health: 92, icon: "🏪", color: "#c4a35a", stats: [{ label: "Active Stalls", value: "186/200", description: "Currently occupied vendor stalls out of total capacity." }, { label: "Daily Revenue", value: "14.2K", description: "Total market revenue for the current day." }, { label: "Foot Traffic", value: "High", description: "Current pedestrian density in the market district." }] },
    { id: "artisan-quarter", name: "Artisan Quarter", description: "The guild workshops, studios, and ateliers where the island's craftspeople create everything the community needs.", health: 88, icon: "🎨", color: "#d4af37", stats: [{ label: "Active Guilds", value: "12", description: "Operating artisan guilds with active membership." }, { label: "Output Rate", value: "94%", description: "Guild production relative to quota targets." }, { label: "Apprentices", value: "47", description: "Apprentices currently training across all guilds." }] },
    { id: "residential-hub", name: "Residential Hub", description: "The main housing district in the upper volcano interior. Homes, communal spaces, bathhouses, and recreation areas for 5,000 citizens.", health: 85, icon: "🏠", color: "#a08040", stats: [{ label: "Occupancy", value: "96%", description: "Current housing occupancy rate across all districts." }, { label: "Maintenance", value: "On Track", description: "Scheduled maintenance and repair status." }, { label: "Comfort Index", value: "8.2/10", description: "Average citizen satisfaction rating for living conditions." }] },
    { id: "council-hall", name: "Council Hall", description: "The amphitheater where the Council convenes. Home to the Ironlord's seat and the governance apparatus of the island.", health: 98, icon: "⚖️", color: "#b8860b", stats: [{ label: "Next Session", value: "3 days", description: "Time until next scheduled Council assembly." }, { label: "Active Statutes", value: "24", description: "Currently active governing statutes and resolutions." }, { label: "Open Petitions", value: "7", description: "Citizen petitions awaiting Council review." }] },
    { id: "bakery-district", name: "Bakery District", description: "The aromatic stretch of the Roots where bakers transform Wood's grain into bread, pastries, and staples that feed daily life.", health: 90, icon: "🍞", color: "#cd853f", stats: [{ label: "Daily Output", value: "8,400", description: "Loaves and goods produced per day across all bakeries." }, { label: "Grain Supply", value: "Stable", description: "Current grain reserve status from Wood faction supply." }, { label: "Ovens Active", value: "28/30", description: "Working ovens out of total baker capacity." }] },
    { id: "cultural-center", name: "Cultural Center", description: "Performance halls, galleries, and storytelling circles. The heart of island culture and the place where art gives meaning to survival.", health: 82, icon: "🎭", color: "#8b6914", stats: [{ label: "Events/Week", value: "14", description: "Cultural events scheduled per week." }, { label: "Attendance", value: "2,100", description: "Average weekly attendance across all events." }, { label: "Artists Active", value: "64", description: "Registered performing and visual artists." }] },
  ],
  gridPageTitle: "Trade Network",
  gridPageSubtitle: "Map of trade routes and commercial connections between districts. Monitor flow of goods, merchant activity, and supply chain health.",
  gridLabel: "Trade Routes — Live",
  gridNodeEmoji: "🏪",
  gridNodes: [
    { id: "market-central", name: "Central Market", health: 92, x: 400, y: 80, assignedUsers: 186 },
    { id: "market-east", name: "East Bazaar", health: 85, x: 600, y: 160, assignedUsers: 94 },
    { id: "market-west", name: "West Market", health: 78, x: 200, y: 160, assignedUsers: 82 },
    { id: "guild-row", name: "Guild Row", health: 90, x: 400, y: 260, assignedUsers: 120 },
    { id: "bakery-st", name: "Bakery Street", health: 88, x: 150, y: 340, assignedUsers: 68 },
    { id: "textile-sq", name: "Textile Square", health: 76, x: 650, y: 340, assignedUsers: 55 },
    { id: "housing-north", name: "North Housing", health: 82, x: 300, y: 420, assignedUsers: 210 },
    { id: "housing-south", name: "South Housing", health: 80, x: 500, y: 420, assignedUsers: 195 },
    { id: "council-plaza", name: "Council Plaza", health: 98, x: 400, y: 520, assignedUsers: 45 },
  ],
  gridEdges: [
    { from: "market-central", to: "market-east", health: 88 }, { from: "market-central", to: "market-west", health: 82 },
    { from: "market-central", to: "guild-row", health: 95 }, { from: "market-east", to: "textile-sq", health: 78 },
    { from: "market-west", to: "bakery-st", health: 85 }, { from: "guild-row", to: "housing-north", health: 80 },
    { from: "guild-row", to: "housing-south", health: 82 }, { from: "guild-row", to: "bakery-st", health: 76 },
    { from: "guild-row", to: "textile-sq", health: 72 }, { from: "housing-north", to: "council-plaza", health: 90 },
    { from: "housing-south", to: "council-plaza", health: 92 }, { from: "bakery-st", to: "housing-north", health: 84 },
    { from: "textile-sq", to: "housing-south", health: 70 },
  ],
  protocolCategories: ["Core Systems", "Operations", "Civic Services", "Community", "Reference"],
  protocols: [
    { id: "dashboard", title: "Faction Dashboard", icon: "📊", category: "Core Systems", description: "Your personal command center within the Earth faction. View your civic contributions, guild status, and community standing.", details: ["View your current rank and civic contribution metrics", "Track market performance and trade route activity", "See your profile and community reputation", "Quick access to all faction tools"] },
    { id: "roots", title: "The Roots Overview", icon: "🏛️", category: "Core Systems", description: "Interactive overview of the Roots — the island's residential and commercial heart.", details: ["Monitor market district health and vendor activity", "Track housing occupancy and maintenance schedules", "View Council session schedules and open petitions", "Cultural center event tracking"] },
    { id: "trade-network", title: "Trade Network", icon: "🛤️", category: "Core Systems", description: "Map of trade routes connecting markets, guilds, and residential districts.", details: ["Visual network of all trade connections", "Supply chain health monitoring", "Merchant activity and route efficiency", "District population and assignment data"] },
    { id: "market-ops", title: "Market Operations", icon: "🏪", category: "Operations", description: "Daily management of vendor stalls, pricing, and market logistics.", details: ["Manage vendor assignments and stall allocation", "Track daily revenue and foot traffic", "Coordinate supply deliveries from Wood faction", "Handle merchant disputes and licensing"] },
    { id: "housing", title: "Housing Authority", icon: "🏠", category: "Civic Services", description: "Residential management for 5,000 citizens across the Roots.", details: ["Track occupancy rates and housing requests", "Schedule maintenance and renovations", "Manage community spaces and bathhouses", "Citizen satisfaction monitoring"] },
    { id: "events", title: "Cultural Events", icon: "🎭", category: "Community", description: "Plan and coordinate festivals, performances, and community gatherings.", details: ["Schedule events across multiple venues", "Track attendance and community engagement", "Coordinate with artists and performers", "Manage festival budgets and resources"] },
    { id: "protocols-guide", title: "Protocols & Documentation", icon: "📖", category: "Reference", description: "Comprehensive guide to every feature available to Earth faction citizens.", details: ["Complete documentation for all civic tools", "Searchable by category", "Updated with each deployment", "Accessible to all citizens"] },
  ],
  champions: [
    { id: "e-01", name: "Aldric Goldenhand", returnRate: 0.0072, startingReturnRate: 0.0072, stabilityScore: 89, currentAssignment: "Not Assigned" },
    { id: "e-02", name: "Seraphine Marketweave", returnRate: -0.0015, startingReturnRate: -0.0015, stabilityScore: 95, currentAssignment: "Not Assigned" },
    { id: "e-03", name: "Burchard Stonemantle", returnRate: 0.0033, startingReturnRate: 0.0033, stabilityScore: 77, currentAssignment: "Not Assigned" },
    { id: "e-04", name: "Lirael Coinsworth", returnRate: 0.0097, startingReturnRate: 0.0097, stabilityScore: 72, currentAssignment: "Not Assigned" },
    { id: "e-05", name: "Theron Guildcrest", returnRate: 0.0008, startingReturnRate: 0.0008, stabilityScore: 83, currentAssignment: "Not Assigned" },
    { id: "e-06", name: "Maren Copperbell", returnRate: 0.0056, startingReturnRate: 0.0056, stabilityScore: 91, currentAssignment: "Not Assigned" },
    { id: "e-07", name: "Gavros Hearthstone", returnRate: -0.0011, startingReturnRate: -0.0011, stabilityScore: 80, currentAssignment: "Not Assigned" },
    { id: "e-08", name: "Pia Silverbraid", returnRate: 0.0069, startingReturnRate: 0.0069, stabilityScore: 68, currentAssignment: "Not Assigned" },
    { id: "e-09", name: "Cornelius Brasswright", returnRate: 0.0021, startingReturnRate: 0.0021, stabilityScore: 87, currentAssignment: "Not Assigned" },
    { id: "e-10", name: "Ivy Loamcroft", returnRate: 0.0084, startingReturnRate: 0.0084, stabilityScore: 98, currentAssignment: "Not Assigned" },
    { id: "e-11", name: "Desmond Archway", returnRate: -0.0005, startingReturnRate: -0.0005, stabilityScore: 74, currentAssignment: "Not Assigned" },
    { id: "e-12", name: "Olenna Tavernkeep", returnRate: 0.0042, startingReturnRate: 0.0042, stabilityScore: 85, currentAssignment: "Not Assigned" },
    { id: "e-13", name: "Rufus Wallmender", returnRate: 0.0017, startingReturnRate: 0.0017, stabilityScore: 66, currentAssignment: "Not Assigned" },
    { id: "e-14", name: "Callista Threadgold", returnRate: 0.0093, startingReturnRate: 0.0093, stabilityScore: 88, currentAssignment: "Not Assigned" },
    { id: "e-15", name: "Hadwin Brickford", returnRate: -0.0019, startingReturnRate: -0.0019, stabilityScore: 81, currentAssignment: "Not Assigned" },
    { id: "e-16", name: "Nessa Lampwright", returnRate: 0.0036, startingReturnRate: 0.0036, stabilityScore: 93, currentAssignment: "Not Assigned" },
    { id: "e-17", name: "Jareth Plazaguard", returnRate: 0.0078, startingReturnRate: 0.0078, stabilityScore: 75, currentAssignment: "Not Assigned" },
    { id: "e-18", name: "Wren Festivale", returnRate: 0.0051, startingReturnRate: 0.0051, stabilityScore: 70, currentAssignment: "Not Assigned" },
  ],
};

// ─── Water / Bluecrest ──────────────────────────────────────────────────────

const waterFaction: FactionData = {
  id: "water",
  name: "Bluecrest",
  shortName: "Water",
  emoji: "🌊",
  tagline: "We face the Veil so the rest of the island can live.",
  theme: {
    primary: "#3b82f6",
    secondary: "#2563eb",
    gradientFrom: "#3b82f6",
    gradientTo: "#1d4ed8",
  },
  navItems: [
    { label: "Dashboard", href: "/" },
    { label: "Faction HQ", href: "/grid-status" },
    { label: "Wall & Breakers", href: "/generators" },
    { label: "Protocols", href: "/protocols" },
  ],
  userProfile: {
    name: "Dirge Gladstone",
    role: "Breaker — Winter Wall Detail",
    joinDate: "Year 9 of the Current Cycle",
    bio: "Low-ranked but always present. First witness to The First's message. Knows he can't keep his mouth shut. Faces the Veil every shift so the rest of the island sleeps easy.",
    avatarEmoji: "🌊",
  },
  stats: [
    { label: "Veil Alerts", value: 23, icon: "⚠️", color: "#3b82f6" },
    { label: "Patrols Done", value: "1,204", icon: "🛡️", color: "#2563eb" },
    { label: "Breaker Cycles", value: 847, icon: "🌊", color: "#1d4ed8" },
    { label: "Storm Rating", value: "B+", icon: "⛈️", color: "#60a5fa" },
    { label: "Rank", value: "Breaker", icon: "🎖️", color: "#3b82f6" },
    { label: "Wall Coverage", value: "94%", icon: "🏰", color: "#1e40af" },
  ],
  achievements: [
    { id: "first-watch", title: "First Watch", description: "Completed your first wall patrol along the perimeter", icon: "🛡️", unlocked: true, progress: 100, rarity: "common" },
    { id: "storm-reader", title: "Storm Reader", description: "Correctly predicted a Veil shift direction 10 times", icon: "⛈️", unlocked: true, progress: 100, rarity: "common" },
    { id: "breaker-diver", title: "Breaker Diver", description: "Completed 50 maintenance dives on the underwater Breaker structures", icon: "🤿", unlocked: true, progress: 100, rarity: "rare" },
    { id: "flood-responder", title: "Flood Responder", description: "Led flood response when the Breakers missed a rotation", icon: "💪", unlocked: false, progress: 68, rarity: "rare" },
    { id: "veil-walker", title: "Veil Walker", description: "Survived a patrol during a Class-4 Veil surge without retreat", icon: "🌀", unlocked: false, progress: 40, rarity: "epic" },
    { id: "veilfish-hunter", title: "Veilfish Hunter", description: "Caught a Veilfish near the storm barrier and returned alive", icon: "🐟", unlocked: false, progress: 35, rarity: "epic" },
    { id: "leviathans-eye", title: "Leviathan's Eye", description: "Earned recognition from Leviathan Corvatz for exceptional duty", icon: "👁️", unlocked: false, progress: 25, rarity: "legendary" },
    { id: "wall-founder", title: "Wall Founder", description: "Served on the original detail that established the Winter Wall perimeter", icon: "🏗️", unlocked: true, progress: 100, rarity: "legendary" },
  ],
  tools: [
    { id: "patrol-scheduler", title: "Patrol Scheduler", description: "View and manage wall patrol rotations, guard tower assignments, and shift handoffs", icon: "📋", color: "#3b82f6", memberCount: 280 },
    { id: "breaker-controls", title: "Breaker Controls", description: "Monitor and coordinate the two massive hydraulic Breaker structures on the underwater rail", icon: "🌊", color: "#2563eb", memberCount: 165 },
    { id: "storm-tracker", title: "Storm Tracker", description: "Real-time Veil monitoring — storm direction, intensity, and breach probability from Metal's instruments", icon: "⛈️", color: "#1d4ed8", memberCount: 210 },
    { id: "dive-operations", title: "Dive Operations", description: "Coordinate underwater maintenance dives for Breaker hydraulics, rail, and structural patches", icon: "🤿", color: "#60a5fa", memberCount: 95 },
    { id: "flood-response", title: "Flood Response", description: "Emergency flood management — deploy barriers, coordinate evacuations, and manage water routing", icon: "🚨", color: "#3b82f6", memberCount: 320 },
    { id: "watch-dispatch", title: "Watch Dispatch", description: "Submit reports, track incidents, and coordinate with other wall sections and guard towers", icon: "📡", color: "#1e40af", memberCount: 245 },
  ],
  facilityPageTitle: "Wall & Breakers",
  facilityPageSubtitle: "Status overview of the perimeter Wall and the two hydraulic Breaker structures. Monitor defenses, storm readiness, and structural integrity.",
  facilityLabel: "Winter Wall — Live Status",
  facilitySections: [
    { id: "wall-north", name: "Northern Wall", description: "The northern perimeter section facing the most frequent Veil storm approaches. Highest alert section with reinforced guard towers.", health: 88, icon: "🏰", color: "#3b82f6", stats: [{ label: "Guard Towers", value: "8/8 Active", description: "Manned guard towers along the northern perimeter." }, { label: "Wall Integrity", value: "88%", description: "Structural condition of northern wall sections." }, { label: "Last Breach", value: "14 days ago", description: "Time since last Veil breach attempt on this section." }] },
    { id: "wall-south", name: "Southern Wall", description: "The calmer southern section with fewer storm approaches but critical fishing access points and Veilfish patrol routes.", health: 92, icon: "🏰", color: "#2563eb", stats: [{ label: "Guard Towers", value: "6/6 Active", description: "Manned guard towers along the southern perimeter." }, { label: "Wall Integrity", value: "92%", description: "Structural condition of southern wall sections." }, { label: "Fishing Gates", value: "3 Open", description: "Controlled access points for fishing operations." }] },
    { id: "breaker-alpha", name: "Breaker Alpha", description: "The primary hydraulic Breaker structure. Massive arms on an underwater rail that deflect incoming storm surges. Powered by Fire, guided by Metal.", health: 82, icon: "🌊", color: "#1d4ed8", stats: [{ label: "Hydraulic PSI", value: "4,200", description: "Current hydraulic pressure in the Breaker arms." }, { label: "Rail Position", value: "NNE", description: "Current cardinal position on the underwater rail." }, { label: "Rotation Time", value: "4.2 min", description: "Time to rotate to next position. Target: under 4 min." }] },
    { id: "breaker-beta", name: "Breaker Beta", description: "The secondary Breaker structure covering the opposite arc. Together, Alpha and Beta cover approximately 10% of the perimeter at any time.", health: 76, icon: "🌊", color: "#60a5fa", stats: [{ label: "Hydraulic PSI", value: "3,800", description: "Current hydraulic pressure. Below optimal — maintenance flagged." }, { label: "Rail Position", value: "SSW", description: "Current cardinal position on the underwater rail." }, { label: "Rotation Time", value: "4.8 min", description: "Slightly over target. Power supply from Fire may be reduced." }] },
    { id: "observation-post", name: "Observation Post", description: "The elevated command post on the Winter Wall where Deepwatch Lorinn oversees operations. Feeds from Metal's instruments arrive here first.", health: 95, icon: "🔭", color: "#3b82f6", stats: [{ label: "Veil Status", value: "Moderate", description: "Current Veil storm activity level." }, { label: "Signal Strength", value: "Strong", description: "Terminal network signal from Metal's instruments." }, { label: "Crew on Watch", value: "24", description: "Total personnel currently on active watch." }] },
    { id: "dive-bay", name: "Dive Bay", description: "The staging area for underwater maintenance crews. Equipment storage, decompression chambers, and the launch point for Breaker hull dives.", health: 86, icon: "🤿", color: "#1e40af", stats: [{ label: "Divers Ready", value: "12", description: "Certified divers on standby for emergency maintenance." }, { label: "Equipment", value: "Good", description: "Overall condition of dive equipment and suits." }, { label: "Dives Today", value: "3", description: "Completed maintenance dives in current shift." }] },
  ],
  gridPageTitle: "Patrol Network",
  gridPageSubtitle: "Map of patrol routes, guard towers, and watch positions along the island perimeter. Monitor coverage, response times, and crew deployment.",
  gridLabel: "Perimeter Patrol — Live",
  gridNodeEmoji: "🛡️",
  gridNodes: [
    { id: "tower-01", name: "Tower N-1", health: 90, x: 400, y: 60, assignedUsers: 8 },
    { id: "tower-02", name: "Tower NE-1", health: 85, x: 600, y: 120, assignedUsers: 6 },
    { id: "tower-03", name: "Tower NW-1", health: 88, x: 200, y: 120, assignedUsers: 7 },
    { id: "tower-04", name: "Tower E-1", health: 78, x: 700, y: 280, assignedUsers: 8 },
    { id: "tower-05", name: "Tower W-1", health: 82, x: 100, y: 280, assignedUsers: 7 },
    { id: "tower-06", name: "Tower SE-1", health: 72, x: 620, y: 440, assignedUsers: 9 },
    { id: "tower-07", name: "Tower SW-1", health: 75, x: 180, y: 440, assignedUsers: 8 },
    { id: "tower-08", name: "Tower S-1", health: 92, x: 400, y: 520, assignedUsers: 6 },
    { id: "breaker-a", name: "Breaker α", health: 82, x: 520, y: 200, assignedUsers: 18 },
    { id: "breaker-b", name: "Breaker β", health: 76, x: 280, y: 380, assignedUsers: 16 },
    { id: "command", name: "Command Post", health: 95, x: 400, y: 290, assignedUsers: 24 },
  ],
  gridEdges: [
    { from: "tower-01", to: "tower-02", health: 88 }, { from: "tower-01", to: "tower-03", health: 85 },
    { from: "tower-02", to: "tower-04", health: 80 }, { from: "tower-03", to: "tower-05", health: 82 },
    { from: "tower-04", to: "tower-06", health: 72 }, { from: "tower-05", to: "tower-07", health: 75 },
    { from: "tower-06", to: "tower-08", health: 78 }, { from: "tower-07", to: "tower-08", health: 80 },
    { from: "command", to: "tower-01", health: 95 }, { from: "command", to: "tower-04", health: 88 },
    { from: "command", to: "tower-05", health: 86 }, { from: "command", to: "tower-08", health: 92 },
    { from: "command", to: "breaker-a", health: 90 }, { from: "command", to: "breaker-b", health: 82 },
    { from: "breaker-a", to: "tower-02", health: 85 }, { from: "breaker-b", to: "tower-07", health: 76 },
  ],
  protocolCategories: ["Core Systems", "Operations", "Defense", "Community", "Reference"],
  protocols: [
    { id: "dashboard", title: "Faction Dashboard", icon: "📊", category: "Core Systems", description: "Your personal command center within Bluecrest. View patrol stats, storm alerts, and duty status.", details: ["View your patrol count and storm response history", "Track Breaker cycle contributions", "See your rank and commendation status", "Quick access to all defense tools"] },
    { id: "wall-breakers", title: "Wall & Breakers", icon: "🌊", category: "Core Systems", description: "Status overview of the Wall and hydraulic Breaker structures.", details: ["Monitor wall integrity across all sections", "Track Breaker positions and rotation times", "View guard tower manning status", "Dive bay readiness indicators"] },
    { id: "patrol-net", title: "Patrol Network", icon: "🛡️", category: "Core Systems", description: "Map of patrol routes and watch positions along the perimeter.", details: ["Visual network of guard towers and routes", "Coverage gap identification", "Crew deployment tracking", "Response time monitoring"] },
    { id: "patrol-schedule", title: "Patrol Scheduler", icon: "📋", category: "Operations", description: "Manage wall patrol rotations and guard tower assignments.", details: ["View weekly rotation schedules", "Request shift swaps", "Track guard tower staffing", "Handoff coordination"] },
    { id: "storm-response", title: "Storm Response", icon: "🚨", category: "Defense", description: "Emergency protocols for Veil surges, breaches, and flood events.", details: ["Active storm alert management", "Breaker rotation coordination", "Flood barrier deployment", "Evacuation route monitoring"] },
    { id: "dive-ops", title: "Dive Operations", icon: "🤿", category: "Operations", description: "Coordinate underwater maintenance on Breaker structures.", details: ["Schedule maintenance dives", "Equipment readiness checks", "Decompression tracking", "Structural inspection reports"] },
    { id: "protocols-guide", title: "Protocols & Documentation", icon: "📖", category: "Reference", description: "Comprehensive guide to every system available to Bluecrest members.", details: ["Complete defense protocol documentation", "Searchable by category", "Updated with each deployment", "Accessible to all ranks"] },
  ],
  champions: [
    { id: "w-01", name: "Corvus Stormbreak", returnRate: 0.0063, startingReturnRate: 0.0063, stabilityScore: 90, currentAssignment: "Not Assigned" },
    { id: "w-02", name: "Neria Tidecaller", returnRate: -0.0009, startingReturnRate: -0.0009, stabilityScore: 84, currentAssignment: "Not Assigned" },
    { id: "w-03", name: "Brok Waverender", returnRate: 0.0087, startingReturnRate: 0.0087, stabilityScore: 69, currentAssignment: "Not Assigned" },
    { id: "w-04", name: "Selke Deepwatch", returnRate: 0.0014, startingReturnRate: 0.0014, stabilityScore: 94, currentAssignment: "Not Assigned" },
    { id: "w-05", name: "Harken Saltgrave", returnRate: 0.0052, startingReturnRate: 0.0052, stabilityScore: 73, currentAssignment: "Not Assigned" },
    { id: "w-06", name: "Mira Ripthorn", returnRate: -0.0016, startingReturnRate: -0.0016, stabilityScore: 87, currentAssignment: "Not Assigned" },
    { id: "w-07", name: "Dorin Breachwall", returnRate: 0.0071, startingReturnRate: 0.0071, stabilityScore: 82, currentAssignment: "Not Assigned" },
    { id: "w-08", name: "Ysa Foamwalker", returnRate: 0.0029, startingReturnRate: 0.0029, stabilityScore: 71, currentAssignment: "Not Assigned" },
    { id: "w-09", name: "Tarn Veilpiercer", returnRate: 0.0095, startingReturnRate: 0.0095, stabilityScore: 96, currentAssignment: "Not Assigned" },
    { id: "w-10", name: "Kessa Drifthelm", returnRate: -0.0002, startingReturnRate: -0.0002, stabilityScore: 78, currentAssignment: "Not Assigned" },
    { id: "w-11", name: "Garron Undertow", returnRate: 0.0046, startingReturnRate: 0.0046, stabilityScore: 86, currentAssignment: "Not Assigned" },
    { id: "w-12", name: "Penna Surgebane", returnRate: 0.0038, startingReturnRate: 0.0038, stabilityScore: 65, currentAssignment: "Not Assigned" },
    { id: "w-13", name: "Leith Stormhull", returnRate: -0.0013, startingReturnRate: -0.0013, stabilityScore: 81, currentAssignment: "Not Assigned" },
    { id: "w-14", name: "Ondra Kelpmire", returnRate: 0.0081, startingReturnRate: 0.0081, stabilityScore: 89, currentAssignment: "Not Assigned" },
    { id: "w-15", name: "Crag Barnaclefast", returnRate: 0.0005, startingReturnRate: 0.0005, stabilityScore: 76, currentAssignment: "Not Assigned" },
    { id: "w-16", name: "Sable Dawnshore", returnRate: 0.0059, startingReturnRate: 0.0059, stabilityScore: 92, currentAssignment: "Not Assigned" },
  ],
};

// ─── Wood / Stewards ────────────────────────────────────────────────────────

const woodFaction: FactionData = {
  id: "wood",
  name: "The Stewards",
  shortName: "Wood",
  emoji: "🌿",
  tagline: "We feed the island. The quota holds. The terraces endure.",
  theme: {
    primary: "#22c55e",
    secondary: "#16a34a",
    gradientFrom: "#22c55e",
    gradientTo: "#15803d",
  },
  navItems: [
    { label: "Dashboard", href: "/" },
    { label: "Faction HQ", href: "/grid-status" },
    { label: "Terraces", href: "/generators" },
    { label: "Protocols", href: "/protocols" },
  ],
  userProfile: {
    name: "Tori",
    role: "Steward — Terrace Farmer, Eastern Slopes",
    joinDate: "Year 6 of the Current Cycle",
    bio: "Experienced terrace farmer on the eastern slopes. Manages flood channels under pressure. Decisive, natural leader. Stiff shoulders from years of hard work. The quota holds because we make it hold.",
    avatarEmoji: "🌿",
  },
  stats: [
    { label: "Harvest Yield", value: "94%", icon: "🌾", color: "#22c55e" },
    { label: "Quota Met", value: "12/12", icon: "✅", color: "#16a34a" },
    { label: "Terraces Active", value: 18, icon: "🏔️", color: "#15803d" },
    { label: "Soil Quality", value: "A-", icon: "🪴", color: "#4ade80" },
    { label: "Rank", value: "Steward", icon: "🌱", color: "#22c55e" },
    { label: "Flood Channels", value: "14/15", icon: "💧", color: "#059669" },
  ],
  achievements: [
    { id: "first-harvest", title: "First Harvest", description: "Brought in your first crop from the eastern terraces", icon: "🌾", unlocked: true, progress: 100, rarity: "common" },
    { id: "channel-keeper", title: "Channel Keeper", description: "Maintained 5 flood channels through a full storm season", icon: "💧", unlocked: true, progress: 100, rarity: "common" },
    { id: "quota-streak", title: "Quota Streak", description: "Met or exceeded the harvest quota for 6 consecutive cycles", icon: "📊", unlocked: true, progress: 100, rarity: "rare" },
    { id: "terrace-builder", title: "Terrace Builder", description: "Designed and built a new terrace level on the mountain slopes", icon: "🏗️", unlocked: false, progress: 78, rarity: "rare" },
    { id: "flood-master", title: "Flood Master", description: "Prevented a terrace slide during a Category-3 flood event", icon: "🌊", unlocked: false, progress: 50, rarity: "epic" },
    { id: "livestock-lord", title: "Livestock Lord", description: "Managed a Flatland ranch through two flood seasons with zero losses", icon: "🐄", unlocked: false, progress: 42, rarity: "epic" },
    { id: "stewards-trust", title: "Harvest Steward's Trust", description: "Earned the personal trust of the Harvest Steward for exceptional service", icon: "🌟", unlocked: false, progress: 28, rarity: "legendary" },
    { id: "first-sowing", title: "First Sowing", description: "Planted the first seeds when the terraces were originally carved into the mountainside", icon: "🌱", unlocked: true, progress: 100, rarity: "legendary" },
  ],
  tools: [
    { id: "harvest-tracker", title: "Harvest Tracker", description: "Monitor crop yields, quota progress, and seasonal projections across all terraces", icon: "🌾", color: "#22c55e", memberCount: 340 },
    { id: "terrace-monitor", title: "Terrace Monitor", description: "Real-time monitoring of terrace conditions — soil moisture, irrigation flow, and structural integrity", icon: "🏔️", color: "#16a34a", memberCount: 275 },
    { id: "irrigation-control", title: "Irrigation Control", description: "Manage the irrigation network powered by Fire's pumps — flow rates, pressure, and distribution", icon: "💧", color: "#15803d", memberCount: 190 },
    { id: "livestock-registry", title: "Livestock Registry", description: "Track herd counts, health status, and grazing rotations on the Flatland ranches", icon: "🐄", color: "#4ade80", memberCount: 155 },
    { id: "flood-channels", title: "Flood Channel Status", description: "Monitor the network of flood channels protecting terraces from storm runoff and Breaker failures", icon: "🚿", color: "#059669", memberCount: 220 },
    { id: "supply-dispatch", title: "Supply Dispatch", description: "Coordinate food deliveries to the Roots, manage storage, and track distribution quotas", icon: "🚛", color: "#166534", memberCount: 280 },
  ],
  facilityPageTitle: "The Terraces",
  facilityPageSubtitle: "Interactive overview of the mountain slope terraces and Flatland ranches. Monitor crops, irrigation, flood channels, and soil conditions.",
  facilityLabel: "Eastern Terraces — Live Status",
  facilitySections: [
    { id: "upper-terrace", name: "Upper Terraces", description: "The highest crop levels on the mountain slopes. Less flood-prone but exposed to rain and wind. Specialized high-altitude crops and herbs.", health: 90, icon: "🏔️", color: "#22c55e", stats: [{ label: "Crop Health", value: "92%", description: "Overall health of upper terrace plantings." }, { label: "Soil Moisture", value: "Optimal", description: "Current soil moisture for high-altitude crops." }, { label: "Wind Exposure", value: "Moderate", description: "Current wind conditions affecting upper terraces." }] },
    { id: "mid-terrace", name: "Mid Terraces", description: "The primary food production engine. Layered farms with flood channels, irrigation networks, and the bulk of the island's grain and vegetable output.", health: 86, icon: "🌾", color: "#16a34a", stats: [{ label: "Active Plots", value: "142/150", description: "Currently planted plots out of available capacity." }, { label: "Irrigation", value: "98% Flow", description: "Irrigation system flow rate from Fire-powered pumps." }, { label: "Yield Forecast", value: "94%", description: "Projected harvest yield relative to quota." }] },
    { id: "lower-terrace", name: "Lower Terraces", description: "The lowest level before the Flats. Fruit orchards, root vegetables, and the first line of flood channel defense.", health: 78, icon: "🍎", color: "#15803d", stats: [{ label: "Orchard Health", value: "78%", description: "Fruit tree condition. Some storm damage from last season." }, { label: "Flood Risk", value: "Moderate", description: "Current flood risk assessment from Water faction data." }, { label: "Channel Status", value: "12/14 Clear", description: "Flood channels currently clear and operational." }] },
    { id: "flatland-ranch", name: "Flatland Ranches", description: "The outer radius ranches on the Flats. Livestock, grazing land, and the eastern forest. Most exposed to flooding when Breakers miss.", health: 72, icon: "🐄", color: "#4ade80", stats: [{ label: "Herd Count", value: "1,840", description: "Total livestock across all Flatland ranches." }, { label: "Grazing Status", value: "Active", description: "Current grazing rotation status." }, { label: "Flood Exposure", value: "High", description: "Flatlands are most vulnerable when Breakers misalign." }] },
    { id: "irrigation-hub", name: "Irrigation Hub", description: "Central control point for the Fire-powered irrigation network. Distributes water across all terrace levels via pressurized pipes.", health: 88, icon: "💧", color: "#059669", stats: [{ label: "Pump Pressure", value: "1,200 PSI", description: "Main irrigation pump pressure from Fire's systems." }, { label: "Distribution", value: "Even", description: "Water distribution balance across terrace levels." }, { label: "Reserve Tank", value: "78%", description: "Emergency water reserve tank capacity." }] },
    { id: "grain-storage", name: "Grain Storage", description: "Climate-controlled storage silos holding the island's food reserves. Maintained at precise humidity and temperature for long-term preservation.", health: 94, icon: "🏗️", color: "#166534", stats: [{ label: "Capacity Used", value: "62%", description: "Current usage of total grain storage capacity." }, { label: "Temp Control", value: "Stable", description: "Storage temperature within optimal range." }, { label: "Days Reserve", value: "45", description: "Food reserve measured in days of island-wide supply." }] },
  ],
  gridPageTitle: "Supply Network",
  gridPageSubtitle: "Map of food supply routes from terraces and ranches to the Roots. Monitor delivery schedules, storage levels, and distribution efficiency.",
  gridLabel: "Supply Chain — Live",
  gridNodeEmoji: "🌾",
  gridNodes: [
    { id: "upper-t", name: "Upper Terraces", health: 90, x: 400, y: 60, assignedUsers: 85 },
    { id: "mid-t-east", name: "Mid-East Terrace", health: 88, x: 580, y: 140, assignedUsers: 120 },
    { id: "mid-t-west", name: "Mid-West Terrace", health: 84, x: 220, y: 140, assignedUsers: 115 },
    { id: "lower-t", name: "Lower Terraces", health: 78, x: 400, y: 240, assignedUsers: 95 },
    { id: "ranch-east", name: "East Ranch", health: 72, x: 650, y: 300, assignedUsers: 60 },
    { id: "ranch-west", name: "West Ranch", health: 70, x: 150, y: 300, assignedUsers: 55 },
    { id: "irrigation", name: "Irrigation Hub", health: 88, x: 400, y: 380, assignedUsers: 40 },
    { id: "storage", name: "Grain Storage", health: 94, x: 250, y: 460, assignedUsers: 35 },
    { id: "market-drop", name: "Market Delivery", health: 90, x: 550, y: 460, assignedUsers: 70 },
    { id: "roots-dest", name: "The Roots", health: 92, x: 400, y: 540, assignedUsers: 45 },
  ],
  gridEdges: [
    { from: "upper-t", to: "mid-t-east", health: 90 }, { from: "upper-t", to: "mid-t-west", health: 88 },
    { from: "mid-t-east", to: "lower-t", health: 82 }, { from: "mid-t-west", to: "lower-t", health: 80 },
    { from: "mid-t-east", to: "ranch-east", health: 75 }, { from: "mid-t-west", to: "ranch-west", health: 72 },
    { from: "lower-t", to: "irrigation", health: 85 }, { from: "ranch-east", to: "market-drop", health: 78 },
    { from: "ranch-west", to: "storage", health: 76 }, { from: "irrigation", to: "storage", health: 88 },
    { from: "irrigation", to: "market-drop", health: 86 }, { from: "storage", to: "roots-dest", health: 92 },
    { from: "market-drop", to: "roots-dest", health: 90 },
  ],
  protocolCategories: ["Core Systems", "Operations", "Land Management", "Community", "Reference"],
  protocols: [
    { id: "dashboard", title: "Faction Dashboard", icon: "📊", category: "Core Systems", description: "Your personal command center within the Stewards. View harvest metrics, quota status, and contributions.", details: ["View your harvest yield and quota progress", "Track terrace assignments and seasonal goals", "See your rank and service history", "Quick access to all farming tools"] },
    { id: "terraces", title: "The Terraces", icon: "🏔️", category: "Core Systems", description: "Interactive overview of the mountain slope terraces and Flatland ranches.", details: ["Monitor crop health across all terrace levels", "Track irrigation system performance", "View flood channel status and risk assessments", "Livestock herd management"] },
    { id: "supply-net", title: "Supply Network", icon: "🚛", category: "Core Systems", description: "Map of food supply routes from terraces to the Roots.", details: ["Visual supply chain from farm to market", "Delivery schedule tracking", "Storage capacity monitoring", "Distribution efficiency metrics"] },
    { id: "harvest-ops", title: "Harvest Operations", icon: "🌾", category: "Operations", description: "Day-to-day management of crop cycles, harvesting, and quota fulfillment.", details: ["Crop rotation scheduling", "Harvest crew assignments", "Yield tracking and forecasting", "Quota compliance reporting"] },
    { id: "flood-mgmt", title: "Flood Management", icon: "💧", category: "Land Management", description: "Monitor and maintain the flood channel network protecting the terraces.", details: ["Real-time flood channel monitoring", "Storm runoff predictions", "Emergency channel clearing coordination", "Integration with Water faction alerts"] },
    { id: "achievements", title: "Achievement Center", icon: "🏆", category: "Community", description: "Track your progress toward Steward milestones and farming badges.", details: ["Four rarity tiers of farming achievements", "Progress toward quota streaks and land milestones", "Community recognition for exceptional harvests", "Seasonal competition leaderboards"] },
    { id: "protocols-guide", title: "Protocols & Documentation", icon: "📖", category: "Reference", description: "Comprehensive guide to every feature available to Steward members.", details: ["Complete farming and land management documentation", "Searchable by category", "Updated each growing season", "Accessible to all Stewards"] },
  ],
  champions: [
    { id: "wd-01", name: "Bryn Deeproot", returnRate: 0.0067, startingReturnRate: 0.0067, stabilityScore: 88, currentAssignment: "Not Assigned" },
    { id: "wd-02", name: "Tallow Greenhollow", returnRate: -0.0008, startingReturnRate: -0.0008, stabilityScore: 94, currentAssignment: "Not Assigned" },
    { id: "wd-03", name: "Moss Terracewalker", returnRate: 0.0043, startingReturnRate: 0.0043, stabilityScore: 70, currentAssignment: "Not Assigned" },
    { id: "wd-04", name: "Elska Grainsorrow", returnRate: 0.0092, startingReturnRate: 0.0092, stabilityScore: 82, currentAssignment: "Not Assigned" },
    { id: "wd-05", name: "Rowan Floodmender", returnRate: 0.0011, startingReturnRate: 0.0011, stabilityScore: 91, currentAssignment: "Not Assigned" },
    { id: "wd-06", name: "Fern Loamtender", returnRate: -0.0017, startingReturnRate: -0.0017, stabilityScore: 76, currentAssignment: "Not Assigned" },
    { id: "wd-07", name: "Cedric Harrowfield", returnRate: 0.0055, startingReturnRate: 0.0055, stabilityScore: 97, currentAssignment: "Not Assigned" },
    { id: "wd-08", name: "Willa Vinereach", returnRate: 0.0034, startingReturnRate: 0.0034, stabilityScore: 66, currentAssignment: "Not Assigned" },
    { id: "wd-09", name: "Oakheart Millward", returnRate: 0.0079, startingReturnRate: 0.0079, stabilityScore: 85, currentAssignment: "Not Assigned" },
    { id: "wd-10", name: "Sage Thornbarrow", returnRate: -0.0001, startingReturnRate: -0.0001, stabilityScore: 79, currentAssignment: "Not Assigned" },
    { id: "wd-11", name: "Lark Meadowsong", returnRate: 0.0086, startingReturnRate: 0.0086, stabilityScore: 90, currentAssignment: "Not Assigned" },
    { id: "wd-12", name: "Gale Stormchannel", returnRate: 0.0023, startingReturnRate: 0.0023, stabilityScore: 73, currentAssignment: "Not Assigned" },
    { id: "wd-13", name: "Thicket Ploughborn", returnRate: 0.0048, startingReturnRate: 0.0048, stabilityScore: 83, currentAssignment: "Not Assigned" },
    { id: "wd-14", name: "Rill Canalkeeper", returnRate: -0.0014, startingReturnRate: -0.0014, stabilityScore: 87, currentAssignment: "Not Assigned" },
    { id: "wd-15", name: "Bramble Orchardwild", returnRate: 0.0074, startingReturnRate: 0.0074, stabilityScore: 77, currentAssignment: "Not Assigned" },
    { id: "wd-16", name: "Clover Silowatch", returnRate: 0.0006, startingReturnRate: 0.0006, stabilityScore: 95, currentAssignment: "Not Assigned" },
    { id: "wd-17", name: "Barleycroft Dunn", returnRate: 0.0098, startingReturnRate: 0.0098, stabilityScore: 68, currentAssignment: "Not Assigned" },
    { id: "wd-18", name: "Hazel Creekbend", returnRate: -0.0010, startingReturnRate: -0.0010, stabilityScore: 81, currentAssignment: "Not Assigned" },
    { id: "wd-19", name: "Nettle Ridgeplow", returnRate: 0.0031, startingReturnRate: 0.0031, stabilityScore: 89, currentAssignment: "Not Assigned" },
  ],
};

// ─── Metal / Artificers ─────────────────────────────────────────────────────

const metalFaction: FactionData = {
  id: "metal",
  name: "The Artificers",
  shortName: "Metal",
  emoji: "⚗️",
  tagline: "Patterns over drama. Observation over assumption. The data speaks.",
  theme: {
    primary: "#94a3b8",
    secondary: "#64748b",
    gradientFrom: "#94a3b8",
    gradientTo: "#475569",
  },
  navItems: [
    { label: "Dashboard", href: "/" },
    { label: "Faction HQ", href: "/grid-status" },
    { label: "The Relay Network", href: "/generators" },
    { label: "Protocols", href: "/protocols" },
  ],
  userProfile: {
    name: "Ani Vildor",
    role: "Artificer — Obelisk Researcher, The Gardens",
    joinDate: "Year 14 of the Current Cycle",
    bio: "Graduate student researching the Obelisk — the fringe topic everyone else abandoned. Bookish, curious, not excited about fieldwork. The vindicated researcher when The First's message arrived.",
    avatarEmoji: "⚗️",
  },
  stats: [
    { label: "Research Points", value: "3,247", icon: "🔬", color: "#94a3b8" },
    { label: "Papers Published", value: 14, icon: "📝", color: "#64748b" },
    { label: "Instruments", value: 8, icon: "🔭", color: "#475569" },
    { label: "Veil Readings", value: "1,024", icon: "🌀", color: "#94a3b8" },
    { label: "Rank", value: "Artificer", icon: "⚗️", color: "#64748b" },
    { label: "Terminal Uptime", value: "99.2%", icon: "📡", color: "#475569" },
  ],
  achievements: [
    { id: "first-reading", title: "First Reading", description: "Recorded your first electromagnetic reading from the Veil", icon: "📡", unlocked: true, progress: 100, rarity: "common" },
    { id: "lab-certified", title: "Lab Certified", description: "Completed full safety certification for Gardens laboratory access", icon: "🔬", unlocked: true, progress: 100, rarity: "common" },
    { id: "pattern-finder", title: "Pattern Finder", description: "Identified a recurring pattern in Veil electromagnetic data over 100 cycles", icon: "📊", unlocked: true, progress: 100, rarity: "rare" },
    { id: "terminal-builder", title: "Terminal Builder", description: "Designed and installed a new Terminal network relay station", icon: "📡", unlocked: false, progress: 74, rarity: "rare" },
    { id: "obelisk-scholar", title: "Obelisk Scholar", description: "Published original research on the Obelisk that changed mainstream understanding", icon: "📜", unlocked: false, progress: 55, rarity: "epic" },
    { id: "veil-cartographer", title: "Veil Cartographer", description: "Mapped a previously unknown electromagnetic boundary within the Veil", icon: "🗺️", unlocked: false, progress: 38, rarity: "epic" },
    { id: "ascendants-notice", title: "Ascendant's Notice", description: "Research cited by the Artificer Ascendant in a Council presentation", icon: "✨", unlocked: false, progress: 22, rarity: "legendary" },
    { id: "first-calibration", title: "First Calibration", description: "Calibrated the original Veil detection instruments when the Gardens were established", icon: "🔧", unlocked: true, progress: 100, rarity: "legendary" },
  ],
  tools: [
    { id: "research-console", title: "Research Console", description: "Access the Academy's research database — papers, datasets, and active experiments across all departments", icon: "🔬", color: "#94a3b8", memberCount: 420 },
    { id: "veil-monitor", title: "Veil Monitor", description: "Real-time electromagnetic readings from the Veil. Storm direction, intensity, and anomaly detection for Water faction relay", icon: "🌀", color: "#64748b", memberCount: 310 },
    { id: "terminal-network", title: "Terminal Network", description: "Monitor the island-wide wired communication system. Signal integrity, relay status, and faction segment health", icon: "📡", color: "#475569", memberCount: 280 },
    { id: "lab-scheduler", title: "Lab Scheduler", description: "Book laboratory time, equipment access, and coordinate shared research resources at the Gardens", icon: "📋", color: "#94a3b8", memberCount: 195 },
    { id: "instrument-cal", title: "Instrument Calibration", description: "Schedule and track calibration cycles for Veil detection instruments and weather stations", icon: "🔧", color: "#64748b", memberCount: 145 },
    { id: "academy-dispatch", title: "Academy Dispatch", description: "Submit research proposals, track peer review status, and manage academic communications", icon: "🎓", color: "#475569", memberCount: 230 },
  ],
  facilityPageTitle: "The Relay Network",
  facilityPageSubtitle: "Interactive overview of the Relay Network — the observatories and relay nodes that form the island's information backbone. Monitor signal integrity, research operations, and instrument status.",
  facilityLabel: "Relay Network — Live Status",
  facilitySections: [
    { id: "academy-hall", name: "Academy Hall", description: "The main academic building at the summit. Lecture halls, libraries, and the administrative offices of the Artificer Ascendant.", health: 95, icon: "🎓", color: "#94a3b8", stats: [{ label: "Active Courses", value: "24", description: "Currently running academic courses and seminars." }, { label: "Library Access", value: "Open", description: "Current Academy library access status." }, { label: "Students", value: "186", description: "Enrolled students across all departments." }] },
    { id: "veil-observatory", name: "Veil Observatory", description: "The primary instrument array for monitoring the Veil's electromagnetic signature. Data feeds directly to Water faction for Breaker guidance.", health: 88, icon: "🔭", color: "#64748b", stats: [{ label: "EM Signature", value: "+12° N", description: "Current electromagnetic shift direction from baseline." }, { label: "Detection Range", value: "Full", description: "Instrument detection range status." }, { label: "Data Feed", value: "Active", description: "Real-time feed status to Water faction Terminal." }] },
    { id: "research-lab-a", name: "Research Lab A", description: "The primary research laboratory for Veil studies. Environmental controls, electromagnetic shielding, and specimen storage.", health: 82, icon: "🔬", color: "#475569", stats: [{ label: "Active Experiments", value: "7", description: "Currently running experiments in Lab A." }, { label: "EM Shielding", value: "98%", description: "Electromagnetic shielding effectiveness." }, { label: "Air Quality", value: "Clean", description: "Laboratory air filtration status." }] },
    { id: "research-lab-b", name: "Research Lab B", description: "The secondary lab focused on materials science, instrument fabrication, and Terminal network engineering.", health: 90, icon: "⚙️", color: "#94a3b8", stats: [{ label: "Fabrication Queue", value: "3 items", description: "Instruments currently being built or repaired." }, { label: "Materials Stock", value: "Good", description: "Raw materials inventory level." }, { label: "3D Printer", value: "Idle", description: "Precision fabrication printer status." }] },
    { id: "terminal-hub", name: "Terminal Hub", description: "The central node of the island-wide Terminal network. Metal engineers the system; this is where signals converge and data is processed.", health: 92, icon: "📡", color: "#64748b", stats: [{ label: "Nodes Online", value: "42/44", description: "Active Terminal relay nodes across the island." }, { label: "Signal Integrity", value: "99.2%", description: "Average signal quality across all segments." }, { label: "Latency", value: "12ms", description: "Average signal propagation delay." }] },
    { id: "obelisk-station", name: "Obelisk Station", description: "The small, marginalized research outpost at the base of the Obelisk. Once dismissed as fringe — now the most important research site on the island.", health: 65, icon: "🗿", color: "#475569", stats: [{ label: "Researchers", value: "4", description: "Active researchers stationed at the Obelisk." }, { label: "Anomaly Level", value: "Rising", description: "Electromagnetic anomaly readings near the Obelisk." }, { label: "Funding", value: "Pending", description: "Research funding status. Recently requested increase after The First's message." }] },
  ],
  gridPageTitle: "Terminal Network",
  gridPageSubtitle: "Map of the island-wide wired communication system. Monitor signal integrity, relay nodes, and faction segment health. Metal designs it; everyone depends on it.",
  gridLabel: "Terminal Network — Live",
  gridNodeEmoji: "📡",
  gridNodes: [
    { id: "hub-central", name: "Central Hub", health: 95, x: 400, y: 80, assignedUsers: 28 },
    { id: "relay-gardens", name: "Gardens Relay", health: 92, x: 400, y: 200, assignedUsers: 15 },
    { id: "relay-roots-n", name: "Roots North", health: 88, x: 250, y: 160, assignedUsers: 8 },
    { id: "relay-roots-s", name: "Roots South", health: 85, x: 550, y: 160, assignedUsers: 8 },
    { id: "relay-deeps", name: "Deeps Relay", health: 82, x: 200, y: 320, assignedUsers: 12 },
    { id: "relay-wall-n", name: "Wall North", health: 78, x: 600, y: 320, assignedUsers: 10 },
    { id: "relay-wall-s", name: "Wall South", health: 72, x: 500, y: 440, assignedUsers: 10 },
    { id: "relay-flats", name: "Flats Relay", health: 68, x: 150, y: 440, assignedUsers: 6 },
    { id: "relay-terraces", name: "Terraces Relay", health: 80, x: 300, y: 440, assignedUsers: 7 },
    { id: "relay-breaker-a", name: "Breaker α Link", health: 76, x: 700, y: 240, assignedUsers: 5 },
    { id: "relay-breaker-b", name: "Breaker β Link", health: 70, x: 100, y: 240, assignedUsers: 5 },
    { id: "relay-obelisk", name: "Obelisk Link", health: 58, x: 400, y: 540, assignedUsers: 4 },
  ],
  gridEdges: [
    { from: "hub-central", to: "relay-gardens", health: 95 }, { from: "hub-central", to: "relay-roots-n", health: 90 },
    { from: "hub-central", to: "relay-roots-s", health: 88 }, { from: "relay-gardens", to: "relay-deeps", health: 82 },
    { from: "relay-gardens", to: "relay-wall-n", health: 80 }, { from: "relay-roots-n", to: "relay-deeps", health: 78 },
    { from: "relay-roots-n", to: "relay-breaker-b", health: 72 }, { from: "relay-roots-s", to: "relay-wall-n", health: 85 },
    { from: "relay-roots-s", to: "relay-breaker-a", health: 76 }, { from: "relay-deeps", to: "relay-flats", health: 65 },
    { from: "relay-deeps", to: "relay-terraces", health: 75 }, { from: "relay-wall-n", to: "relay-wall-s", health: 78 },
    { from: "relay-wall-s", to: "relay-obelisk", health: 55 }, { from: "relay-terraces", to: "relay-obelisk", health: 60 },
    { from: "relay-flats", to: "relay-terraces", health: 70 }, { from: "relay-breaker-a", to: "relay-wall-n", health: 72 },
    { from: "relay-breaker-b", to: "relay-deeps", health: 68 },
  ],
  protocolCategories: ["Core Systems", "Research", "Infrastructure", "Community", "Reference"],
  protocols: [
    { id: "dashboard", title: "Faction Dashboard", icon: "📊", category: "Core Systems", description: "Your personal command center within the Artificers. View research metrics, instrument status, and academic standing.", details: ["View research points and publication count", "Track instrument assignments and calibration schedules", "See your academic rank and department affiliation", "Quick access to all research tools"] },
    { id: "gardens", title: "The Gardens", icon: "🎓", category: "Core Systems", description: "Interactive overview of the Gardens — Academy, labs, and instrument arrays at the summit.", details: ["Monitor lab utilization and experiment status", "Track Veil observatory readings", "View Terminal hub signal integrity", "Obelisk research station status"] },
    { id: "terminal-net", title: "Terminal Network", icon: "📡", category: "Core Systems", description: "Map of the island-wide wired communication system.", details: ["Visual network of all relay nodes", "Signal integrity monitoring per segment", "Faction segment health tracking", "Latency and throughput metrics"] },
    { id: "research-ops", title: "Research Operations", icon: "🔬", category: "Research", description: "Manage active experiments, data collection, and peer review processes.", details: ["Submit and track research proposals", "Schedule laboratory time and equipment", "Access shared datasets and archives", "Peer review management"] },
    { id: "veil-studies", title: "Veil Studies", icon: "🌀", category: "Research", description: "Specialized tools for Veil electromagnetic monitoring and analysis.", details: ["Real-time EM signature tracking", "Historical pattern analysis", "Storm prediction modeling", "Cross-reference with Obelisk data"] },
    { id: "terminal-ops", title: "Terminal Maintenance", icon: "🔧", category: "Infrastructure", description: "Maintain and upgrade the Terminal network relay stations.", details: ["Relay node status monitoring", "Schedule maintenance windows", "Signal routing optimization", "Emergency failover procedures"] },
    { id: "protocols-guide", title: "Protocols & Documentation", icon: "📖", category: "Reference", description: "Comprehensive guide to every feature available to Artificer members.", details: ["Complete research and infrastructure documentation", "Searchable by category", "Updated with each deployment", "Accessible to all ranks"] },
  ],
  champions: [
    { id: "m-01", name: "Silvan Lensgrind", returnRate: 0.0041, startingReturnRate: 0.0041, stabilityScore: 88, currentAssignment: "Not Assigned" },
    { id: "m-02", name: "Etta Waveform", returnRate: -0.0006, startingReturnRate: -0.0006, stabilityScore: 95, currentAssignment: "Not Assigned" },
    { id: "m-03", name: "Calder Spectralis", returnRate: 0.0073, startingReturnRate: 0.0073, stabilityScore: 71, currentAssignment: "Not Assigned" },
    { id: "m-04", name: "Lyris Datacrest", returnRate: 0.0019, startingReturnRate: 0.0019, stabilityScore: 84, currentAssignment: "Not Assigned" },
    { id: "m-05", name: "Oberon Circuitmend", returnRate: 0.0089, startingReturnRate: 0.0089, stabilityScore: 91, currentAssignment: "Not Assigned" },
    { id: "m-06", name: "Quill Parchmentis", returnRate: -0.0020, startingReturnRate: -0.0020, stabilityScore: 75, currentAssignment: "Not Assigned" },
    { id: "m-07", name: "Thane Calibrax", returnRate: 0.0057, startingReturnRate: 0.0057, stabilityScore: 98, currentAssignment: "Not Assigned" },
    { id: "m-08", name: "Nyx Oscilline", returnRate: 0.0003, startingReturnRate: 0.0003, stabilityScore: 66, currentAssignment: "Not Assigned" },
    { id: "m-09", name: "Praxis Nodeheart", returnRate: 0.0066, startingReturnRate: 0.0066, stabilityScore: 82, currentAssignment: "Not Assigned" },
    { id: "m-10", name: "Vera Signalwright", returnRate: 0.0082, startingReturnRate: 0.0082, stabilityScore: 86, currentAssignment: "Not Assigned" },
    { id: "m-11", name: "Ione Relaybinder", returnRate: -0.0004, startingReturnRate: -0.0004, stabilityScore: 78, currentAssignment: "Not Assigned" },
    { id: "m-12", name: "Castor Theoris", returnRate: 0.0035, startingReturnRate: 0.0035, stabilityScore: 69, currentAssignment: "Not Assigned" },
    { id: "m-13", name: "Maren Electropis", returnRate: 0.0094, startingReturnRate: 0.0094, stabilityScore: 92, currentAssignment: "Not Assigned" },
    { id: "m-14", name: "Dex Aethervault", returnRate: 0.0016, startingReturnRate: 0.0016, stabilityScore: 80, currentAssignment: "Not Assigned" },
    { id: "m-15", name: "Sage Inkwell", returnRate: 0.0068, startingReturnRate: 0.0068, stabilityScore: 89, currentAssignment: "Not Assigned" },
    { id: "m-16", name: "Finch Alloymere", returnRate: -0.0012, startingReturnRate: -0.0012, stabilityScore: 74, currentAssignment: "Not Assigned" },
    { id: "m-17", name: "Orin Scopewright", returnRate: 0.0049, startingReturnRate: 0.0049, stabilityScore: 96, currentAssignment: "Not Assigned" },
    { id: "m-18", name: "Zephyr Filamentis", returnRate: 0.0027, startingReturnRate: 0.0027, stabilityScore: 67, currentAssignment: "Not Assigned" },
    { id: "m-19", name: "Corvid Archivex", returnRate: 0.0100, startingReturnRate: 0.0100, stabilityScore: 83, currentAssignment: "Not Assigned" },
    { id: "m-20", name: "Lucen Beaconspire", returnRate: 0.0053, startingReturnRate: 0.0053, stabilityScore: 81, currentAssignment: "Not Assigned" },
  ],
};

// ─── Exports ────────────────────────────────────────────────────────────────

export const factions: Record<FactionId, FactionData> = {
  fire: fireFaction,
  earth: earthFaction,
  water: waterFaction,
  wood: woodFaction,
  metal: metalFaction,
};

export const factionIds: FactionId[] = ["fire", "earth", "water", "wood", "metal"];

export function getFaction(id: FactionId): FactionData {
  return factions[id];
}
