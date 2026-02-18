/**
 * Static presentation config for each faction.
 * These values are NOT stored in the database — they are frontend-only
 * UI configuration: themes, colors, icons, page titles, achievements,
 * tools, protocols, and per-section visual mappings.
 *
 * Dynamic data (champions, infrastructure health, user profiles, chat users,
 * friend lists, etc.) is fetched from the Railway database and merged at
 * runtime. The userProfileDefaults here serve as fallback only — the DB is
 * the canonical source for name, role, joinDate, bio, and avatarEmoji.
 */

import type {
  FactionId,
  FactionTheme,
  NavItem,
  Stat,
  Achievement,
  Tool,
  FactionProtocol,
} from "@/data/factionData";

// ─── Per-section icon and color mappings ────────────────────────────────────
// Maps DB infrastructure IDs to their frontend visual presentation

export interface SectionVisuals {
  icon: string;
  color: string;
}

export interface StatTemplate {
  label: string;
  dbKey: string;
  description: string;
}

export interface SectionTemplate {
  visuals: SectionVisuals;
  statTemplates: StatTemplate[];
}

// ─── Static config interface ─────────────────────────────────────────────────

export interface FactionConfig {
  id: FactionId;
  name: string;
  shortName: string;
  emoji: string;
  tagline: string;
  theme: FactionTheme;
  navItems: NavItem[];
  userProfileDefaults: {
    role: string;
    joinDate: string;
    bio: string;
    avatarEmoji: string;
  };
  stats: Stat[];
  achievements: Achievement[];
  tools: Tool[];
  facilityPageTitle: string;
  facilityPageSubtitle: string;
  facilityLabel: string;
  gridPageTitle: string;
  gridPageSubtitle: string;
  gridLabel: string;
  gridNodeEmoji: string;
  protocolCategories: string[];
  protocols: FactionProtocol[];
  sectionTemplates: Record<string, SectionTemplate>;
}

// ─── Fire / The Marshalls ───────────────────────────────────────────────────

const fireConfig: FactionConfig = {
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
    { label: "The Chronicles", href: "/chronicles" },
  ],
  userProfileDefaults: {
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
  gridPageTitle: "Faction HQ",
  gridPageSubtitle: "Network map of all 13 lava-powered generators across the island. Hover over any generator to view its health, connections, and assigned Fire faction crew.",
  gridLabel: "Island-Wide Grid — Live",
  gridNodeEmoji: "⚙️",
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
  sectionTemplates: {
    fire_boiler_core: { visuals: { icon: "🔥", color: "#f97316" }, statTemplates: [{ label: "Core Temp", dbKey: "core_temp", description: "Internal temperature of the boiler chamber. Optimal range: 1,700–2,000°F." }, { label: "Water Pressure", dbKey: "water_pressure", description: "Pressure of superheated water within the boiler." }, { label: "Lava Flow Rate", dbKey: "lava_flow_rate", description: "Volume of molten lava channeled through the core per minute." }] },
    fire_turbine_assembly: { visuals: { icon: "⚙️", color: "#ea580c" }, statTemplates: [{ label: "RPM", dbKey: "rpm", description: "Rotations per minute of the primary turbine shaft." }, { label: "Efficiency", dbKey: "efficiency", description: "Percentage of thermal energy converted to mechanical energy." }, { label: "Blade Wear", dbKey: "blade_wear", description: "Cumulative erosion on turbine blades. Replace at 40%." }] },
    fire_pressure_regulators: { visuals: { icon: "💨", color: "#d97706" }, statTemplates: [{ label: "Valve Status", dbKey: "valve_status", description: "Pressure valves currently operational." }, { label: "Bypass Flow", dbKey: "bypass_flow", description: "Steam diverted through bypass channels." }, { label: "Relief Events", dbKey: "relief_events", description: "Emergency pressure relief triggers this cycle." }] },
    fire_condenser_unit: { visuals: { icon: "🌊", color: "#3b82f6" }, statTemplates: [{ label: "Coolant Temp", dbKey: "coolant_temp", description: "Seawater coolant temperature." }, { label: "Recovery Rate", dbKey: "recovery_rate", description: "Steam successfully condensed to water." }, { label: "Scaling", dbKey: "scaling", description: "Mineral buildup on condenser surfaces." }] },
    fire_lava_intake: { visuals: { icon: "🌋", color: "#dc2626" }, statTemplates: [{ label: "Channel Temp", dbKey: "channel_temp", description: "Lava channel wall temperature." }, { label: "Lining Integrity", dbKey: "lining_integrity", description: "Heat-resistant channel lining. Replace below 50%." }, { label: "Flow Control", dbKey: "flow_control", description: "Automated lava flow control gate status." }] },
    fire_power_coupling: { visuals: { icon: "⚡", color: "#fbbf24" }, statTemplates: [{ label: "Output", dbKey: "output", description: "Electrical output to the island grid." }, { label: "Voltage", dbKey: "voltage", description: "Transmission voltage at coupling point." }, { label: "Load Factor", dbKey: "load_factor", description: "Percentage of maximum capacity utilized." }] },
    fire_exhaust_stack: { visuals: { icon: "🏭", color: "#8b5cf6" }, statTemplates: [{ label: "Emission Rate", dbKey: "emission_rate", description: "Volcanic gas emission level." }, { label: "Stack Temp", dbKey: "stack_temp", description: "Gas temperature at exhaust point." }, { label: "Scrubber Health", dbKey: "scrubber_health", description: "Exhaust scrubber filtration efficiency." }] },
    // Earth sections
    earth_central_market: { visuals: { icon: "🏪", color: "#c4a35a" }, statTemplates: [{ label: "Active Stalls", dbKey: "active_stalls", description: "Currently occupied vendor stalls out of total capacity." }, { label: "Daily Revenue", dbKey: "daily_revenue", description: "Total market revenue for the current day." }, { label: "Foot Traffic", dbKey: "foot_traffic", description: "Current pedestrian density in the market district." }] },
    earth_artisan_quarter: { visuals: { icon: "🎨", color: "#d4af37" }, statTemplates: [{ label: "Active Guilds", dbKey: "active_guilds", description: "Operating artisan guilds with active membership." }, { label: "Output Rate", dbKey: "output_rate", description: "Guild production relative to quota targets." }, { label: "Apprentices", dbKey: "apprentices", description: "Apprentices currently training across all guilds." }] },
    earth_residential_hub: { visuals: { icon: "🏠", color: "#a08040" }, statTemplates: [{ label: "Occupancy", dbKey: "occupancy", description: "Current housing occupancy rate." }, { label: "Maintenance", dbKey: "maintenance", description: "Scheduled maintenance and repair status." }, { label: "Comfort Index", dbKey: "comfort_index", description: "Average citizen satisfaction rating." }] },
    earth_council_hall: { visuals: { icon: "⚖️", color: "#b8860b" }, statTemplates: [{ label: "Next Session", dbKey: "next_session", description: "Time until next scheduled Council assembly." }, { label: "Active Statutes", dbKey: "active_statutes", description: "Currently active governing statutes." }, { label: "Open Petitions", dbKey: "open_petitions", description: "Citizen petitions awaiting Council review." }] },
    earth_bakery_district: { visuals: { icon: "🍞", color: "#cd853f" }, statTemplates: [{ label: "Daily Output", dbKey: "daily_output", description: "Loaves and goods produced per day." }, { label: "Grain Supply", dbKey: "grain_supply", description: "Current grain reserve status from Wood faction." }, { label: "Ovens Active", dbKey: "ovens_active", description: "Working ovens out of total baker capacity." }] },
    earth_cultural_center: { visuals: { icon: "🎭", color: "#8b6914" }, statTemplates: [{ label: "Events/Week", dbKey: "events_per_week", description: "Cultural events scheduled per week." }, { label: "Attendance", dbKey: "attendance", description: "Average weekly attendance." }, { label: "Artists Active", dbKey: "artists_active", description: "Registered performing and visual artists." }] },
    // Water sections
    water_wall_north: { visuals: { icon: "🏰", color: "#3b82f6" }, statTemplates: [{ label: "Guard Towers", dbKey: "guard_towers", description: "Manned guard towers along the northern perimeter." }, { label: "Wall Integrity", dbKey: "wall_integrity", description: "Structural condition of northern wall sections." }, { label: "Last Breach", dbKey: "last_breach", description: "Time since last Veil breach attempt." }] },
    water_wall_south: { visuals: { icon: "🏰", color: "#2563eb" }, statTemplates: [{ label: "Guard Towers", dbKey: "guard_towers", description: "Manned guard towers along the southern perimeter." }, { label: "Wall Integrity", dbKey: "wall_integrity", description: "Structural condition of southern wall sections." }, { label: "Fishing Gates", dbKey: "fishing_gates", description: "Controlled access points for fishing operations." }] },
    water_breaker_alpha: { visuals: { icon: "🌊", color: "#1d4ed8" }, statTemplates: [{ label: "Hydraulic PSI", dbKey: "hydraulic_psi", description: "Current hydraulic pressure in the Breaker arms." }, { label: "Rail Position", dbKey: "rail_position", description: "Current cardinal position on the underwater rail." }, { label: "Rotation Time", dbKey: "rotation_time", description: "Time to rotate to next position." }] },
    water_breaker_beta: { visuals: { icon: "🌊", color: "#60a5fa" }, statTemplates: [{ label: "Hydraulic PSI", dbKey: "hydraulic_psi", description: "Current hydraulic pressure. Below optimal." }, { label: "Rail Position", dbKey: "rail_position", description: "Current cardinal position on the underwater rail." }, { label: "Rotation Time", dbKey: "rotation_time", description: "Slightly over target." }] },
    water_observation_post: { visuals: { icon: "🔭", color: "#3b82f6" }, statTemplates: [{ label: "Veil Status", dbKey: "veil_status", description: "Current Veil storm activity level." }, { label: "Signal Strength", dbKey: "signal_strength", description: "Terminal network signal from Metal's instruments." }, { label: "Crew on Watch", dbKey: "crew_on_watch", description: "Total personnel currently on active watch." }] },
    water_dive_bay: { visuals: { icon: "🤿", color: "#1e40af" }, statTemplates: [{ label: "Divers Ready", dbKey: "divers_ready", description: "Certified divers on standby." }, { label: "Equipment", dbKey: "equipment", description: "Overall condition of dive equipment." }, { label: "Dives Today", dbKey: "dives_today", description: "Completed maintenance dives in current shift." }] },
    // Wood sections
    wood_upper_terrace: { visuals: { icon: "🏔️", color: "#22c55e" }, statTemplates: [{ label: "Crop Health", dbKey: "crop_health", description: "Overall health of upper terrace plantings." }, { label: "Soil Moisture", dbKey: "soil_moisture", description: "Current soil moisture for high-altitude crops." }, { label: "Wind Exposure", dbKey: "wind_exposure", description: "Current wind conditions." }] },
    wood_mid_terrace: { visuals: { icon: "🌾", color: "#16a34a" }, statTemplates: [{ label: "Active Plots", dbKey: "active_plots", description: "Currently planted plots out of capacity." }, { label: "Irrigation", dbKey: "irrigation", description: "Irrigation system flow rate." }, { label: "Yield Forecast", dbKey: "yield_forecast", description: "Projected harvest yield relative to quota." }] },
    wood_lower_terrace: { visuals: { icon: "🍎", color: "#15803d" }, statTemplates: [{ label: "Orchard Health", dbKey: "orchard_health", description: "Fruit tree condition." }, { label: "Flood Risk", dbKey: "flood_risk", description: "Current flood risk assessment." }, { label: "Channel Status", dbKey: "channel_status", description: "Flood channels currently clear." }] },
    wood_flatland_ranch: { visuals: { icon: "🐄", color: "#4ade80" }, statTemplates: [{ label: "Herd Count", dbKey: "herd_count", description: "Total livestock across all Flatland ranches." }, { label: "Grazing Status", dbKey: "grazing_status", description: "Current grazing rotation status." }, { label: "Flood Exposure", dbKey: "flood_exposure", description: "Vulnerability when Breakers misalign." }] },
    wood_irrigation_hub: { visuals: { icon: "💧", color: "#059669" }, statTemplates: [{ label: "Pump Pressure", dbKey: "pump_pressure", description: "Main irrigation pump pressure." }, { label: "Distribution", dbKey: "distribution", description: "Water distribution balance." }, { label: "Reserve Tank", dbKey: "reserve_tank", description: "Emergency water reserve tank capacity." }] },
    wood_grain_storage: { visuals: { icon: "🏗️", color: "#166534" }, statTemplates: [{ label: "Capacity Used", dbKey: "capacity_used", description: "Current usage of grain storage capacity." }, { label: "Temp Control", dbKey: "temp_control", description: "Storage temperature." }, { label: "Days Reserve", dbKey: "days_reserve", description: "Food reserve in days of supply." }] },
    // Metal sections
    metal_academy_hall: { visuals: { icon: "🎓", color: "#94a3b8" }, statTemplates: [{ label: "Active Courses", dbKey: "active_courses", description: "Currently running academic courses." }, { label: "Library Access", dbKey: "library_access", description: "Current Academy library access status." }, { label: "Students", dbKey: "students", description: "Enrolled students across all departments." }] },
    metal_veil_observatory: { visuals: { icon: "🔭", color: "#64748b" }, statTemplates: [{ label: "EM Signature", dbKey: "em_signature", description: "Current electromagnetic shift direction." }, { label: "Detection Range", dbKey: "detection_range", description: "Instrument detection range status." }, { label: "Data Feed", dbKey: "data_feed", description: "Real-time feed status." }] },
    metal_research_lab_a: { visuals: { icon: "🔬", color: "#475569" }, statTemplates: [{ label: "Active Experiments", dbKey: "active_experiments", description: "Currently running experiments." }, { label: "EM Shielding", dbKey: "em_shielding", description: "Electromagnetic shielding effectiveness." }, { label: "Air Quality", dbKey: "air_quality", description: "Laboratory air filtration status." }] },
    metal_research_lab_b: { visuals: { icon: "⚙️", color: "#94a3b8" }, statTemplates: [{ label: "Fabrication Queue", dbKey: "fabrication_queue", description: "Instruments being built or repaired." }, { label: "Materials Stock", dbKey: "materials_stock", description: "Raw materials inventory level." }, { label: "3D Printer", dbKey: "printer_status", description: "Precision fabrication printer status." }] },
    metal_terminal_hub: { visuals: { icon: "📡", color: "#64748b" }, statTemplates: [{ label: "Nodes Online", dbKey: "nodes_online", description: "Active Terminal relay nodes." }, { label: "Signal Integrity", dbKey: "signal_integrity", description: "Average signal quality." }, { label: "Latency", dbKey: "latency", description: "Average signal propagation delay." }] },
    metal_obelisk_station: { visuals: { icon: "🗿", color: "#475569" }, statTemplates: [{ label: "Researchers", dbKey: "researchers", description: "Active researchers stationed at the Obelisk." }, { label: "Anomaly Level", dbKey: "anomaly_level", description: "Electromagnetic anomaly readings." }, { label: "Funding", dbKey: "funding", description: "Research funding status." }] },
  },
};

// ─── Earth / The Ironlord ───────────────────────────────────────────────────

const earthConfig: FactionConfig = {
  id: "earth",
  name: "The Ironlord",
  shortName: "Earth",
  emoji: "🏛️",
  tagline: "The energy of the island. Culture, commerce, and community.",
  theme: { primary: "#c4a35a", secondary: "#a08040", gradientFrom: "#c4a35a", gradientTo: "#8b6914" },
  navItems: [
    { label: "Dashboard", href: "/" },
    { label: "Faction HQ", href: "/grid-status" },
    { label: "The Roots", href: "/generators" },
    { label: "The Chronicles", href: "/chronicles" },
  ],
  userProfileDefaults: { role: "Master Artisan — The Roots Market", joinDate: "Year 8 of the Current Cycle", bio: "Master craftsman and guild coordinator in the Roots. Keeps the market thriving, the trades moving, and the culture alive. The island is more than survival — it's a society.", avatarEmoji: "🏛️" },
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
  gridPageTitle: "Trade Network",
  gridPageSubtitle: "Map of trade routes and commercial connections between districts. Monitor flow of goods, merchant activity, and supply chain health.",
  gridLabel: "Trade Routes — Live",
  gridNodeEmoji: "🏪",
  protocolCategories: ["Core Systems", "Operations", "Civic Services", "Community", "Reference"],
  protocols: [
    { id: "dashboard", title: "Faction Dashboard", icon: "📊", category: "Core Systems", description: "Your personal command center within the Earth faction.", details: ["View your current rank and civic contribution metrics", "Track market performance and trade route activity", "See your profile and community reputation", "Quick access to all faction tools"] },
    { id: "roots", title: "The Roots Overview", icon: "🏛️", category: "Core Systems", description: "Interactive overview of the Roots — the island's residential and commercial heart.", details: ["Monitor market district health and vendor activity", "Track housing occupancy and maintenance schedules", "View Council session schedules and open petitions", "Cultural center event tracking"] },
    { id: "trade-network", title: "Trade Network", icon: "🛤️", category: "Core Systems", description: "Map of trade routes connecting markets, guilds, and residential districts.", details: ["Visual network of all trade connections", "Supply chain health monitoring", "Merchant activity and route efficiency", "District population and assignment data"] },
    { id: "market-ops", title: "Market Operations", icon: "🏪", category: "Operations", description: "Daily management of vendor stalls, pricing, and market logistics.", details: ["Manage vendor assignments and stall allocation", "Track daily revenue and foot traffic", "Coordinate supply deliveries from Wood faction", "Handle merchant disputes and licensing"] },
    { id: "housing", title: "Housing Authority", icon: "🏠", category: "Civic Services", description: "Residential management for 5,000 citizens across the Roots.", details: ["Track occupancy rates and housing requests", "Schedule maintenance and renovations", "Manage community spaces and bathhouses", "Citizen satisfaction monitoring"] },
    { id: "events", title: "Cultural Events", icon: "🎭", category: "Community", description: "Plan and coordinate festivals, performances, and community gatherings.", details: ["Schedule events across multiple venues", "Track attendance and community engagement", "Coordinate with artists and performers", "Manage festival budgets and resources"] },
    { id: "protocols-guide", title: "Protocols & Documentation", icon: "📖", category: "Reference", description: "Comprehensive guide to every feature available to Earth faction citizens.", details: ["Complete documentation for all civic tools", "Searchable by category", "Updated with each deployment", "Accessible to all citizens"] },
  ],
  sectionTemplates: {},
};

// ─── Water / Bluecrest ──────────────────────────────────────────────────────

const waterConfig: FactionConfig = {
  id: "water",
  name: "Bluecrest",
  shortName: "Water",
  emoji: "🌊",
  tagline: "We face the Veil so the rest of the island can live.",
  theme: { primary: "#3b82f6", secondary: "#2563eb", gradientFrom: "#3b82f6", gradientTo: "#1d4ed8" },
  navItems: [
    { label: "Dashboard", href: "/" },
    { label: "Faction HQ", href: "/grid-status" },
    { label: "Wall & Breakers", href: "/generators" },
    { label: "The Chronicles", href: "/chronicles" },
  ],
  userProfileDefaults: { role: "Breaker — Winter Wall Detail", joinDate: "Year 9 of the Current Cycle", bio: "Low-ranked but always present. First witness to The First's message. Faces the Veil every shift so the rest of the island sleeps easy.", avatarEmoji: "🌊" },
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
  gridPageTitle: "Patrol Network",
  gridPageSubtitle: "Map of patrol routes, guard towers, and watch positions along the island perimeter. Monitor coverage, response times, and crew deployment.",
  gridLabel: "Perimeter Patrol — Live",
  gridNodeEmoji: "🛡️",
  protocolCategories: ["Core Systems", "Operations", "Defense", "Community", "Reference"],
  protocols: [
    { id: "dashboard", title: "Faction Dashboard", icon: "📊", category: "Core Systems", description: "Your personal command center within Bluecrest.", details: ["View your patrol count and storm response history", "Track Breaker cycle contributions", "See your rank and commendation status", "Quick access to all defense tools"] },
    { id: "wall-breakers", title: "Wall & Breakers", icon: "🌊", category: "Core Systems", description: "Status overview of the Wall and hydraulic Breaker structures.", details: ["Monitor wall integrity across all sections", "Track Breaker positions and rotation times", "View guard tower manning status", "Dive bay readiness indicators"] },
    { id: "patrol-net", title: "Patrol Network", icon: "🛡️", category: "Core Systems", description: "Map of patrol routes and watch positions along the perimeter.", details: ["Visual network of guard towers and routes", "Coverage gap identification", "Crew deployment tracking", "Response time monitoring"] },
    { id: "patrol-schedule", title: "Patrol Scheduler", icon: "📋", category: "Operations", description: "Manage wall patrol rotations and guard tower assignments.", details: ["View weekly rotation schedules", "Request shift swaps", "Track guard tower staffing", "Handoff coordination"] },
    { id: "storm-response", title: "Storm Response", icon: "🚨", category: "Defense", description: "Emergency protocols for Veil surges, breaches, and flood events.", details: ["Active storm alert management", "Breaker rotation coordination", "Flood barrier deployment", "Evacuation route monitoring"] },
    { id: "dive-ops", title: "Dive Operations", icon: "🤿", category: "Operations", description: "Coordinate underwater maintenance on Breaker structures.", details: ["Schedule maintenance dives", "Equipment readiness checks", "Decompression tracking", "Structural inspection reports"] },
    { id: "protocols-guide", title: "Protocols & Documentation", icon: "📖", category: "Reference", description: "Comprehensive guide to every system available to Bluecrest members.", details: ["Complete defense protocol documentation", "Searchable by category", "Updated with each deployment", "Accessible to all ranks"] },
  ],
  sectionTemplates: {},
};

// ─── Wood / Stewards ────────────────────────────────────────────────────────

const woodConfig: FactionConfig = {
  id: "wood",
  name: "The Stewards",
  shortName: "Wood",
  emoji: "🌿",
  tagline: "We feed the island. The quota holds. The terraces endure.",
  theme: { primary: "#22c55e", secondary: "#16a34a", gradientFrom: "#22c55e", gradientTo: "#15803d" },
  navItems: [
    { label: "Dashboard", href: "/" },
    { label: "Faction HQ", href: "/grid-status" },
    { label: "Terraces", href: "/generators" },
    { label: "The Chronicles", href: "/chronicles" },
  ],
  userProfileDefaults: { role: "Steward — Terrace Farmer, Eastern Slopes", joinDate: "Year 6 of the Current Cycle", bio: "Experienced terrace farmer on the eastern slopes. Manages flood channels under pressure. Decisive, natural leader. The quota holds because we make it hold.", avatarEmoji: "🌿" },
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
    { id: "flood-channels", title: "Flood Channel Status", description: "Monitor the network of flood channels protecting terraces from storm runoff", icon: "🚿", color: "#059669", memberCount: 220 },
    { id: "supply-dispatch", title: "Supply Dispatch", description: "Coordinate food deliveries to the Roots, manage storage, and track distribution quotas", icon: "🚛", color: "#166534", memberCount: 280 },
  ],
  facilityPageTitle: "The Terraces",
  facilityPageSubtitle: "Interactive overview of the mountain slope terraces and Flatland ranches. Monitor crops, irrigation, flood channels, and soil conditions.",
  facilityLabel: "Eastern Terraces — Live Status",
  gridPageTitle: "Supply Network",
  gridPageSubtitle: "Map of food supply routes from terraces and ranches to the Roots. Monitor delivery schedules, storage levels, and distribution efficiency.",
  gridLabel: "Supply Chain — Live",
  gridNodeEmoji: "🌾",
  protocolCategories: ["Core Systems", "Operations", "Land Management", "Community", "Reference"],
  protocols: [
    { id: "dashboard", title: "Faction Dashboard", icon: "📊", category: "Core Systems", description: "Your personal command center within the Stewards.", details: ["View your harvest yield and quota progress", "Track terrace assignments and seasonal goals", "See your rank and service history", "Quick access to all farming tools"] },
    { id: "terraces", title: "The Terraces", icon: "🏔️", category: "Core Systems", description: "Interactive overview of the mountain slope terraces and Flatland ranches.", details: ["Monitor crop health across all terrace levels", "Track irrigation system performance", "View flood channel status and risk assessments", "Livestock herd management"] },
    { id: "supply-net", title: "Supply Network", icon: "🚛", category: "Core Systems", description: "Map of food supply routes from terraces to the Roots.", details: ["Visual supply chain from farm to market", "Delivery schedule tracking", "Storage capacity monitoring", "Distribution efficiency metrics"] },
    { id: "harvest-ops", title: "Harvest Operations", icon: "🌾", category: "Operations", description: "Day-to-day management of crop cycles, harvesting, and quota fulfillment.", details: ["Crop rotation scheduling", "Harvest crew assignments", "Yield tracking and forecasting", "Quota compliance reporting"] },
    { id: "flood-mgmt", title: "Flood Management", icon: "💧", category: "Land Management", description: "Monitor and maintain the flood channel network protecting the terraces.", details: ["Real-time flood channel monitoring", "Storm runoff predictions", "Emergency channel clearing coordination", "Integration with Water faction alerts"] },
    { id: "achievements", title: "Achievement Center", icon: "🏆", category: "Community", description: "Track your progress toward Steward milestones and farming badges.", details: ["Four rarity tiers of farming achievements", "Progress toward quota streaks and land milestones", "Community recognition for exceptional harvests", "Seasonal competition leaderboards"] },
    { id: "protocols-guide", title: "Protocols & Documentation", icon: "📖", category: "Reference", description: "Comprehensive guide to every feature available to Steward members.", details: ["Complete farming and land management documentation", "Searchable by category", "Updated each growing season", "Accessible to all Stewards"] },
  ],
  sectionTemplates: {},
};

// ─── Metal / Artificers ─────────────────────────────────────────────────────

const metalConfig: FactionConfig = {
  id: "metal",
  name: "The Artificers",
  shortName: "Metal",
  emoji: "⚗️",
  tagline: "Patterns over drama. Observation over assumption. The data speaks.",
  theme: { primary: "#94a3b8", secondary: "#64748b", gradientFrom: "#94a3b8", gradientTo: "#475569" },
  navItems: [
    { label: "Dashboard", href: "/" },
    { label: "Faction HQ", href: "/grid-status" },
    { label: "The Relay Network", href: "/generators" },
    { label: "The Chronicles", href: "/chronicles" },
  ],
  userProfileDefaults: { role: "Artificer — Obelisk Researcher, The Gardens", joinDate: "Year 14 of the Current Cycle", bio: "Graduate student researching the Obelisk — the fringe topic everyone else abandoned. Bookish, curious, not excited about fieldwork. The vindicated researcher when The First's message arrived.", avatarEmoji: "⚗️" },
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
    { id: "veil-monitor", title: "Veil Monitor", description: "Real-time electromagnetic readings from the Veil. Storm direction, intensity, and anomaly detection", icon: "🌀", color: "#64748b", memberCount: 310 },
    { id: "terminal-network", title: "Terminal Network", description: "Monitor the island-wide wired communication system. Signal integrity, relay status, and faction segment health", icon: "📡", color: "#475569", memberCount: 280 },
    { id: "lab-scheduler", title: "Lab Scheduler", description: "Book laboratory time, equipment access, and coordinate shared research resources at the Gardens", icon: "📋", color: "#94a3b8", memberCount: 195 },
    { id: "instrument-cal", title: "Instrument Calibration", description: "Schedule and track calibration cycles for Veil detection instruments and weather stations", icon: "🔧", color: "#64748b", memberCount: 145 },
    { id: "academy-dispatch", title: "Academy Dispatch", description: "Submit research proposals, track peer review status, and manage academic communications", icon: "🎓", color: "#475569", memberCount: 230 },
  ],
  facilityPageTitle: "The Relay Network",
  facilityPageSubtitle: "Interactive overview of the Relay Network — observatories and relay nodes forming the island's information backbone.",
  facilityLabel: "Relay Network — Live Status",
  gridPageTitle: "Terminal Network",
  gridPageSubtitle: "Map of the island-wide wired communication system. Monitor signal integrity, relay nodes, and faction segment health.",
  gridLabel: "Terminal Network — Live",
  gridNodeEmoji: "📡",
  protocolCategories: ["Core Systems", "Research", "Infrastructure", "Community", "Reference"],
  protocols: [
    { id: "dashboard", title: "Faction Dashboard", icon: "📊", category: "Core Systems", description: "Your personal command center within the Artificers.", details: ["View research points and publication count", "Track instrument assignments and calibration schedules", "See your academic rank and department affiliation", "Quick access to all research tools"] },
    { id: "gardens", title: "The Gardens", icon: "🎓", category: "Core Systems", description: "Interactive overview of the Gardens — Academy, labs, and instrument arrays.", details: ["Monitor lab utilization and experiment status", "Track Veil observatory readings", "View Terminal hub signal integrity", "Obelisk research station status"] },
    { id: "terminal-net", title: "Terminal Network", icon: "📡", category: "Core Systems", description: "Map of the island-wide wired communication system.", details: ["Visual network of all relay nodes", "Signal integrity monitoring per segment", "Faction segment health tracking", "Latency and throughput metrics"] },
    { id: "research-ops", title: "Research Operations", icon: "🔬", category: "Research", description: "Manage active experiments, data collection, and peer review processes.", details: ["Submit and track research proposals", "Schedule laboratory time and equipment", "Access shared datasets and archives", "Peer review management"] },
    { id: "veil-studies", title: "Veil Studies", icon: "🌀", category: "Research", description: "Specialized tools for Veil electromagnetic monitoring and analysis.", details: ["Real-time EM signature tracking", "Historical pattern analysis", "Storm prediction modeling", "Cross-reference with Obelisk data"] },
    { id: "terminal-ops", title: "Terminal Maintenance", icon: "🔧", category: "Infrastructure", description: "Maintain and upgrade the Terminal network relay stations.", details: ["Relay node status monitoring", "Schedule maintenance windows", "Signal routing optimization", "Emergency failover procedures"] },
    { id: "protocols-guide", title: "Protocols & Documentation", icon: "📖", category: "Reference", description: "Comprehensive guide to every feature available to Artificer members.", details: ["Complete research and infrastructure documentation", "Searchable by category", "Updated with each deployment", "Accessible to all ranks"] },
  ],
  sectionTemplates: {},
};

// ─── Exports ────────────────────────────────────────────────────────────────

export const factionConfigs: Record<FactionId, FactionConfig> = {
  fire: fireConfig,
  earth: earthConfig,
  water: waterConfig,
  wood: woodConfig,
  metal: metalConfig,
};

export function getFactionConfig(id: FactionId): FactionConfig {
  return factionConfigs[id];
}
