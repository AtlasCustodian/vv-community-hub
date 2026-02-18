export interface Protocol {
  id: string;
  title: string;
  icon: string;
  category: string;
  description: string;
  details: string[];
}

export const protocolCategories = [
  "Core Systems",
  "Operations",
  "Monitoring",
  "Community",
  "Reference",
] as const;

export const protocols: Protocol[] = [
  {
    id: "dashboard",
    title: "Faction Dashboard",
    icon: "📊",
    category: "Core Systems",
    description:
      "Your personal command center within the Fire faction. The Dashboard provides an at-a-glance view of your status, rank, and contributions to the Marshalls.",
    details: [
      "View your current rank, power output contribution, and shift history",
      "Track your personal stats including Heat Rating, Pressure metrics, and generator assignments",
      "See your avatar and profile information, including years of service and bio",
      "Quick access to all faction tools and recent notifications",
    ],
  },
  {
    id: "generators",
    title: "Generator Monitoring",
    icon: "⚙️",
    category: "Core Systems",
    description:
      "Real-time monitoring and diagnostics for lava-powered generators in the Deeps. Each generator is a massive steampunk machine converting volcanic heat into island-wide power.",
    details: [
      "Interactive schematic view of generator internals — boiler core, turbines, condenser, and more",
      "Health bars and real-time statistics for every major subsystem",
      "Hover over any component to learn what it does and view its current operational status",
      "Track maintenance needs: lining integrity, blade wear, valve status, and scrubber health",
      "Color-coded warnings when subsystems approach critical thresholds",
    ],
  },
  {
    id: "grid-status",
    title: "Faction HQ Network",
    icon: "⚡",
    category: "Core Systems",
    description:
      "A live network map showing all 13 generators across the island and their interconnections. Understand the health of the entire power grid at a glance.",
    details: [
      "Visual network map showing all 13 generators with health indicators",
      "Connection lines between generators are color-coded: green (healthy), yellow (moderate), red (critical)",
      "See the number of Fire faction members assigned to each generator",
      "Identify weak links in the grid that may cause cascading failures",
      "Monitor overall grid stability and power distribution balance",
    ],
  },
  {
    id: "shift-scheduler",
    title: "Shift Scheduler",
    icon: "📋",
    category: "Operations",
    description:
      "Manage rotation schedules for all Deeps-level shifts. Coordinate coolant-suit assignments and ensure continuous generator coverage across all active shifts.",
    details: [
      "View weekly and monthly rotation schedules for your assigned generator",
      "Request shift swaps with other faction members",
      "Track coolant-suit availability and schedule fittings",
      "Receive notifications for upcoming shifts and schedule changes",
      "Supervisors can manage team assignments and approve time-off requests",
    ],
  },
  {
    id: "coolant-suits",
    title: "Coolant Suit Inventory",
    icon: "🧥",
    category: "Operations",
    description:
      "Track the availability and maintenance status of coolant suits — essential protective gear for anyone working within lava proximity zones in the Deeps.",
    details: [
      "Real-time inventory of all coolant suits by size and certification level",
      "Maintenance status tracking: last inspected, next service date, wear percentage",
      "Schedule suit fittings and certifications for new assignments",
      "Report suit malfunctions or damage for immediate replacement",
      "View suit assignment history and usage logs",
    ],
  },
  {
    id: "pressure-logs",
    title: "Steam Pressure Logs",
    icon: "📈",
    category: "Monitoring",
    description:
      "Historical and live pressure readings across all turbine lines and seawater intake systems. Essential data for predicting maintenance needs and preventing overpressure events.",
    details: [
      "Live pressure readings from every turbine line in real time",
      "Historical pressure graphs with trend analysis over days, weeks, and cycles",
      "Automated alerts when pressure readings deviate from safe operating ranges",
      "Seawater intake flow monitoring for condenser efficiency",
      "Export data for engineering reports and maintenance planning",
    ],
  },
  {
    id: "maintenance",
    title: "Maintenance Dispatch",
    icon: "🔧",
    category: "Operations",
    description:
      "Submit and track repair orders for valves, turbines, elevator brakes, and grid infrastructure. The backbone of keeping the Deeps operational.",
    details: [
      "Submit maintenance requests with priority levels and detailed descriptions",
      "Track repair order status from submission through completion",
      "View maintenance history for any piece of equipment",
      "Automated escalation for critical repairs that affect generator output",
      "Coordinate with other factions for cross-system maintenance (e.g., Metal faction for parts)",
    ],
  },
  {
    id: "achievements",
    title: "Achievement Center",
    icon: "🏆",
    category: "Community",
    description:
      "Track your progress toward Fire faction milestones and badges. From completing your first shift to earning the Marshall's personal trust — every contribution is recognized.",
    details: [
      "Four rarity tiers: Common, Rare, Epic, and Legendary achievements",
      "Progress bars showing how close you are to unlocking each achievement",
      "Achievements tied to real contributions: shifts completed, equipment maintained, emergencies handled",
      "Legendary achievements for extraordinary service — visible to the entire faction",
      "Achievement unlock notifications and faction-wide leaderboards",
    ],
  },
  {
    id: "power-grid",
    title: "Power Grid Monitor",
    icon: "🔋",
    category: "Monitoring",
    description:
      "Track island-wide power distribution from the generators to every major consumer: the Breakers, irrigation pumps, Metal faction labs, and the Roots underground network.",
    details: [
      "Real-time power flow visualization from generators to consumption points",
      "Load balancing dashboard showing which areas are drawing the most power",
      "Brownout and blackout warning system with predictive analytics",
      "Historical power consumption trends by region and faction",
      "Emergency power rerouting controls for authorized personnel",
    ],
  },
  {
    id: "protocols-guide",
    title: "Protocols & Documentation",
    icon: "📖",
    category: "Reference",
    description:
      "This page — a comprehensive guide to every feature and system available to Fire faction members. Consult it whenever you need to understand how something works.",
    details: [
      "Complete documentation for all faction tools and systems",
      "Searchable by category: Core Systems, Operations, Monitoring, Community, Reference",
      "Updated with each new feature deployment or system change",
      "Accessible to all faction members regardless of rank",
    ],
  },
];
