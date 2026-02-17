export interface GeneratorStat {
  label: string;
  value: string;
  description: string;
}

export interface GeneratorSection {
  id: string;
  name: string;
  description: string;
  health: number;
  icon: string;
  color: string;
  stats: GeneratorStat[];
}

export const generatorSections: GeneratorSection[] = [
  {
    id: "boiler-core",
    name: "Boiler Core",
    description:
      "The primary heat chamber where lava superheats pressurized water into high-energy steam. The heart of every Deeps generator.",
    health: 94,
    icon: "🔥",
    color: "#f97316",
    stats: [
      {
        label: "Core Temp",
        value: "1,847°F",
        description:
          "Internal temperature of the boiler chamber. Optimal range: 1,700–2,000°F.",
      },
      {
        label: "Water Pressure",
        value: "2,140 PSI",
        description:
          "Pressure of superheated water within the boiler. High pressure = high energy output.",
      },
      {
        label: "Lava Flow Rate",
        value: "48 gal/min",
        description:
          "Volume of molten lava channeled through the core per minute. Controls heat input.",
      },
    ],
  },
  {
    id: "turbine-assembly",
    name: "Turbine Assembly",
    description:
      "A massive array of reinforced steam turbines converting thermal energy into rotational mechanical energy at over 3,600 RPM.",
    health: 87,
    icon: "⚙️",
    color: "#ea580c",
    stats: [
      {
        label: "RPM",
        value: "3,612",
        description:
          "Rotations per minute of the primary turbine shaft. Target: 3,600 RPM for optimal output.",
      },
      {
        label: "Efficiency",
        value: "97.3%",
        description:
          "Percentage of thermal energy successfully converted to mechanical energy.",
      },
      {
        label: "Blade Wear",
        value: "12%",
        description:
          "Cumulative erosion on turbine blades. Replacement recommended at 40%.",
      },
    ],
  },
  {
    id: "pressure-regulators",
    name: "Pressure Regulators",
    description:
      "A network of valves and bypass channels that maintain safe steam pressure throughout the generator. Prevents catastrophic overpressure events.",
    health: 72,
    icon: "💨",
    color: "#d97706",
    stats: [
      {
        label: "Valve Status",
        value: "11/12 Active",
        description:
          "Number of pressure valves currently operational. One valve is flagged for maintenance.",
      },
      {
        label: "Bypass Flow",
        value: "6.2%",
        description:
          "Percentage of steam being diverted through bypass channels. Increases during overpressure.",
      },
      {
        label: "Relief Events",
        value: "3 this cycle",
        description:
          "Number of times emergency pressure relief has been triggered this operational cycle.",
      },
    ],
  },
  {
    id: "condenser-unit",
    name: "Condenser Unit",
    description:
      "Cools exhausted steam back into water using seawater intake, completing the thermal cycle. Essential for water recovery in the Deeps.",
    health: 91,
    icon: "🌊",
    color: "#3b82f6",
    stats: [
      {
        label: "Coolant Temp",
        value: "62°F",
        description:
          "Temperature of the seawater coolant flowing through condenser coils.",
      },
      {
        label: "Recovery Rate",
        value: "98.1%",
        description:
          "Percentage of steam successfully condensed back to usable water.",
      },
      {
        label: "Scaling",
        value: "Low",
        description:
          "Mineral buildup on condenser surfaces. High scaling reduces efficiency.",
      },
    ],
  },
  {
    id: "lava-intake",
    name: "Lava Intake",
    description:
      "Armored channels that draw molten lava from deep volcanic vents into the boiler core. Protected by heat-resistant lining rated to 3,000°F.",
    health: 68,
    icon: "🌋",
    color: "#dc2626",
    stats: [
      {
        label: "Channel Temp",
        value: "2,680°F",
        description:
          "Temperature of the lava channel walls. Lining failure occurs above 3,000°F.",
      },
      {
        label: "Lining Integrity",
        value: "68%",
        description:
          "Structural integrity of the heat-resistant channel lining. Replace below 50%.",
      },
      {
        label: "Flow Control",
        value: "Active",
        description:
          "Status of the automated lava flow control gate. Regulates volume entering the boiler.",
      },
    ],
  },
  {
    id: "power-coupling",
    name: "Power Coupling",
    description:
      "High-voltage electrical coupling that converts the turbine's mechanical rotation into usable electricity for the island-wide grid.",
    health: 96,
    icon: "⚡",
    color: "#fbbf24",
    stats: [
      {
        label: "Output",
        value: "1.6 GW",
        description:
          "Current electrical output being fed into the island power grid from this generator.",
      },
      {
        label: "Voltage",
        value: "138 kV",
        description:
          "Transmission voltage at the coupling point. Standard for long-distance grid distribution.",
      },
      {
        label: "Load Factor",
        value: "82%",
        description:
          "Percentage of maximum rated capacity currently being utilized.",
      },
    ],
  },
  {
    id: "exhaust-stack",
    name: "Exhaust Stack",
    description:
      "Massive reinforced chimney that vents excess steam and volcanic gases safely above the Deeps. Equipped with filtration scrubbers.",
    health: 85,
    icon: "🏭",
    color: "#8b5cf6",
    stats: [
      {
        label: "Emission Rate",
        value: "Low",
        description:
          "Current level of volcanic gas emission. Scrubbers filter 99.2% of harmful particles.",
      },
      {
        label: "Stack Temp",
        value: "412°F",
        description:
          "Temperature of gas at the exhaust point. Higher temps indicate inefficient cooling.",
      },
      {
        label: "Scrubber Health",
        value: "85%",
        description:
          "Filtration efficiency of the exhaust scrubber system. Service recommended below 70%.",
      },
    ],
  },
];
