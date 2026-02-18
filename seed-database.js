const { Client } = require("pg");

const DATABASE_URL =
  "postgresql://postgres:nxrXDTmRxroFJdlUSlkDOHbxNJIJjoec@nozomi.proxy.rlwy.net:15035/railway";

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// ─── Faction Standings (from CODEX_FACTION_SUMMARY) ──────────────────────────

const factionStandings = {
  fire: 71.37,
  earth: 82.56,
  water: 64.52,
  wood: 65.36,
  metal: 54.23,
};

// ─── Named Users Per Faction ─────────────────────────────────────────────────
// Combines: main userProfile, NodeChat users, and champions from factionData.ts
// Champions get balance derived from returnRate, standing from stabilityScore

const factionEmojis = {
  fire: "🔥",
  earth: "🏛️",
  water: "🌊",
  wood: "🌿",
  metal: "⚗️",
};

const friendUsersByFaction = {
  fire: ["Sere", "Jyn Ember", "Ruska Flint"],
  earth: ["Mira Copperhand", "Nella", "Felton"],
  water: ["Kai Stormbreak", "Nessa Tidecaller", "Rodge Floodgate"],
  wood: ["Brenn Rootfield", "Linna Thornbrook", "Pim"],
  metal: ["Solen Brightlens", "Fen Wirespark", "Tova Relay"],
};

const factionUsers = {
  fire: {
    main: {
      name: "Hakan",
      role: "Thermtech — Generator 4",
      joinDate: "Year 12 of the Current Cycle",
      bio: "Assigned to Generator 4 in the Deeps. Loves the machines, takes double shifts without complaint. Nothing works without us.",
      avatarEmoji: "🔥",
    },
    chatUsers: [
      "Sere",
      "Dax Kindler",
      "Volara",
      "Cael Ashburn",
      "Jyn Ember",
      "Torrin",
      "Ruska Flint",
    ],
    champions: [
      { id: "f-01", name: "Tormund Ashvane", returnRate: 0.0047, startingReturnRate: 0.0047, stabilityScore: 92 },
      { id: "f-02", name: "Brega Ironhearth", returnRate: 0.0083, startingReturnRate: 0.0083, stabilityScore: 88 },
      { id: "f-03", name: "Sultar Emberclaw", returnRate: -0.0012, startingReturnRate: -0.0012, stabilityScore: 71 },
      { id: "f-04", name: "Vyra Cindersteel", returnRate: 0.0065, startingReturnRate: 0.0065, stabilityScore: 97 },
      { id: "f-05", name: "Kelso Magmafist", returnRate: 0.0028, startingReturnRate: 0.0028, stabilityScore: 84 },
      { id: "f-06", name: "Drenna Boilerwright", returnRate: 0.0091, startingReturnRate: 0.0091, stabilityScore: 90 },
      { id: "f-07", name: "Hask Sootwalker", returnRate: -0.0018, startingReturnRate: -0.0018, stabilityScore: 67 },
      { id: "f-08", name: "Morra Forgehammer", returnRate: 0.0054, startingReturnRate: 0.0054, stabilityScore: 85 },
      { id: "f-09", name: "Ozen Lavathroat", returnRate: 0.0002, startingReturnRate: 0.0002, stabilityScore: 79 },
      { id: "f-10", name: "Fennick Steamborn", returnRate: 0.0076, startingReturnRate: 0.0076, stabilityScore: 93 },
      { id: "f-11", name: "Zara Heatspur", returnRate: 0.0039, startingReturnRate: 0.0039, stabilityScore: 76 },
      { id: "f-12", name: "Grint Ashbelcher", returnRate: -0.0007, startingReturnRate: -0.0007, stabilityScore: 69 },
      { id: "f-13", name: "Pell Turbinecrank", returnRate: 0.0061, startingReturnRate: 0.0061, stabilityScore: 82 },
      { id: "f-14", name: "Russka Pyreblade", returnRate: 0.0015, startingReturnRate: 0.0015, stabilityScore: 91 },
      { id: "f-15", name: "Dorn Coalhand", returnRate: 0.0088, startingReturnRate: 0.0088, stabilityScore: 80 },
      { id: "f-16", name: "Agna Vulcanis", returnRate: -0.0003, startingReturnRate: -0.0003, stabilityScore: 86 },
      { id: "f-17", name: "Therrik Moltencore", returnRate: 0.0044, startingReturnRate: 0.0044, stabilityScore: 65 },
    ],
  },
  earth: {
    main: {
      name: "Kael",
      role: "Master Artisan — The Roots Market",
      joinDate: "Year 8 of the Current Cycle",
      bio: "Master craftsman and guild coordinator in the Roots. Keeps the market thriving, the trades moving, and the culture alive. The island is more than survival — it's a society.",
      avatarEmoji: "🏛️",
    },
    chatUsers: [
      "Mira Copperhand",
      "Aldric Stoneweave",
      "Brea Goldheart",
      "Felton",
      "Sula Merchant",
      "Orik Broadstone",
      "Nella",
    ],
    champions: [
      { id: "e-01", name: "Aldric Goldenhand", returnRate: 0.0072, startingReturnRate: 0.0072, stabilityScore: 89 },
      { id: "e-02", name: "Seraphine Marketweave", returnRate: -0.0015, startingReturnRate: -0.0015, stabilityScore: 95 },
      { id: "e-03", name: "Burchard Stonemantle", returnRate: 0.0033, startingReturnRate: 0.0033, stabilityScore: 77 },
      { id: "e-04", name: "Lirael Coinsworth", returnRate: 0.0097, startingReturnRate: 0.0097, stabilityScore: 72 },
      { id: "e-05", name: "Theron Guildcrest", returnRate: 0.0008, startingReturnRate: 0.0008, stabilityScore: 83 },
      { id: "e-06", name: "Maren Copperbell", returnRate: 0.0056, startingReturnRate: 0.0056, stabilityScore: 91 },
      { id: "e-07", name: "Gavros Hearthstone", returnRate: -0.0011, startingReturnRate: -0.0011, stabilityScore: 80 },
      { id: "e-08", name: "Pia Silverbraid", returnRate: 0.0069, startingReturnRate: 0.0069, stabilityScore: 68 },
      { id: "e-09", name: "Cornelius Brasswright", returnRate: 0.0021, startingReturnRate: 0.0021, stabilityScore: 87 },
      { id: "e-10", name: "Ivy Loamcroft", returnRate: 0.0084, startingReturnRate: 0.0084, stabilityScore: 98 },
      { id: "e-11", name: "Desmond Archway", returnRate: -0.0005, startingReturnRate: -0.0005, stabilityScore: 74 },
      { id: "e-12", name: "Olenna Tavernkeep", returnRate: 0.0042, startingReturnRate: 0.0042, stabilityScore: 85 },
      { id: "e-13", name: "Rufus Wallmender", returnRate: 0.0017, startingReturnRate: 0.0017, stabilityScore: 66 },
      { id: "e-14", name: "Callista Threadgold", returnRate: 0.0093, startingReturnRate: 0.0093, stabilityScore: 88 },
      { id: "e-15", name: "Hadwin Brickford", returnRate: -0.0019, startingReturnRate: -0.0019, stabilityScore: 81 },
      { id: "e-16", name: "Nessa Lampwright", returnRate: 0.0036, startingReturnRate: 0.0036, stabilityScore: 93 },
      { id: "e-17", name: "Jareth Plazaguard", returnRate: 0.0078, startingReturnRate: 0.0078, stabilityScore: 75 },
      { id: "e-18", name: "Wren Festivale", returnRate: 0.0051, startingReturnRate: 0.0051, stabilityScore: 70 },
    ],
  },
  water: {
    main: {
      name: "Dirge Gladstone",
      role: "Breaker — Winter Wall Detail",
      joinDate: "Year 9 of the Current Cycle",
      bio: "Low-ranked but always present. First witness to The First's message. Faces the Veil every shift so the rest of the island sleeps easy.",
      avatarEmoji: "🌊",
    },
    chatUsers: [
      "Lorinn Deepwatch",
      "Corvatz",
      "Shale Brine",
      "Kai Stormbreak",
      "Nessa Tidecaller",
      "Rodge Floodgate",
      "Yara Wavehand",
    ],
    champions: [
      { id: "w-01", name: "Corvus Stormbreak", returnRate: 0.0063, startingReturnRate: 0.0063, stabilityScore: 90 },
      { id: "w-02", name: "Neria Tidecaller", returnRate: -0.0009, startingReturnRate: -0.0009, stabilityScore: 84 },
      { id: "w-03", name: "Brok Waverender", returnRate: 0.0087, startingReturnRate: 0.0087, stabilityScore: 69 },
      { id: "w-04", name: "Selke Deepwatch", returnRate: 0.0014, startingReturnRate: 0.0014, stabilityScore: 94 },
      { id: "w-05", name: "Harken Saltgrave", returnRate: 0.0052, startingReturnRate: 0.0052, stabilityScore: 73 },
      { id: "w-06", name: "Mira Ripthorn", returnRate: -0.0016, startingReturnRate: -0.0016, stabilityScore: 87 },
      { id: "w-07", name: "Dorin Breachwall", returnRate: 0.0071, startingReturnRate: 0.0071, stabilityScore: 82 },
      { id: "w-08", name: "Ysa Foamwalker", returnRate: 0.0029, startingReturnRate: 0.0029, stabilityScore: 71 },
      { id: "w-09", name: "Tarn Veilpiercer", returnRate: 0.0095, startingReturnRate: 0.0095, stabilityScore: 96 },
      { id: "w-10", name: "Kessa Drifthelm", returnRate: -0.0002, startingReturnRate: -0.0002, stabilityScore: 78 },
      { id: "w-11", name: "Garron Undertow", returnRate: 0.0046, startingReturnRate: 0.0046, stabilityScore: 86 },
      { id: "w-12", name: "Penna Surgebane", returnRate: 0.0038, startingReturnRate: 0.0038, stabilityScore: 65 },
      { id: "w-13", name: "Leith Stormhull", returnRate: -0.0013, startingReturnRate: -0.0013, stabilityScore: 81 },
      { id: "w-14", name: "Ondra Kelpmire", returnRate: 0.0081, startingReturnRate: 0.0081, stabilityScore: 89 },
      { id: "w-15", name: "Crag Barnaclefast", returnRate: 0.0005, startingReturnRate: 0.0005, stabilityScore: 76 },
      { id: "w-16", name: "Sable Dawnshore", returnRate: 0.0059, startingReturnRate: 0.0059, stabilityScore: 92 },
    ],
  },
  wood: {
    main: {
      name: "Tori",
      role: "Steward — Terrace Farmer, Eastern Slopes",
      joinDate: "Year 6 of the Current Cycle",
      bio: "Experienced terrace farmer on the eastern slopes. Manages flood channels under pressure. Decisive, natural leader. The quota holds because we make it hold.",
      avatarEmoji: "🌿",
    },
    chatUsers: [
      "Brenn Rootfield",
      "Marda Greenshade",
      "Olwen Seedkeeper",
      "Fael Harrow",
      "Linna Thornbrook",
      "Garret Fieldhand",
      "Pim",
    ],
    champions: [
      { id: "wd-01", name: "Bryn Deeproot", returnRate: 0.0067, startingReturnRate: 0.0067, stabilityScore: 88 },
      { id: "wd-02", name: "Tallow Greenhollow", returnRate: -0.0008, startingReturnRate: -0.0008, stabilityScore: 94 },
      { id: "wd-03", name: "Moss Terracewalker", returnRate: 0.0043, startingReturnRate: 0.0043, stabilityScore: 70 },
      { id: "wd-04", name: "Elska Grainsorrow", returnRate: 0.0092, startingReturnRate: 0.0092, stabilityScore: 82 },
      { id: "wd-05", name: "Rowan Floodmender", returnRate: 0.0011, startingReturnRate: 0.0011, stabilityScore: 91 },
      { id: "wd-06", name: "Fern Loamtender", returnRate: -0.0017, startingReturnRate: -0.0017, stabilityScore: 76 },
      { id: "wd-07", name: "Cedric Harrowfield", returnRate: 0.0055, startingReturnRate: 0.0055, stabilityScore: 97 },
      { id: "wd-08", name: "Willa Vinereach", returnRate: 0.0034, startingReturnRate: 0.0034, stabilityScore: 66 },
      { id: "wd-09", name: "Oakheart Millward", returnRate: 0.0079, startingReturnRate: 0.0079, stabilityScore: 85 },
      { id: "wd-10", name: "Sage Thornbarrow", returnRate: -0.0001, startingReturnRate: -0.0001, stabilityScore: 79 },
      { id: "wd-11", name: "Lark Meadowsong", returnRate: 0.0086, startingReturnRate: 0.0086, stabilityScore: 90 },
      { id: "wd-12", name: "Gale Stormchannel", returnRate: 0.0023, startingReturnRate: 0.0023, stabilityScore: 73 },
      { id: "wd-13", name: "Thicket Ploughborn", returnRate: 0.0048, startingReturnRate: 0.0048, stabilityScore: 83 },
      { id: "wd-14", name: "Rill Canalkeeper", returnRate: -0.0014, startingReturnRate: -0.0014, stabilityScore: 87 },
      { id: "wd-15", name: "Bramble Orchardwild", returnRate: 0.0074, startingReturnRate: 0.0074, stabilityScore: 77 },
      { id: "wd-16", name: "Clover Silowatch", returnRate: 0.0006, startingReturnRate: 0.0006, stabilityScore: 95 },
      { id: "wd-17", name: "Barleycroft Dunn", returnRate: 0.0098, startingReturnRate: 0.0098, stabilityScore: 68 },
      { id: "wd-18", name: "Hazel Creekbend", returnRate: -0.001, startingReturnRate: -0.001, stabilityScore: 81 },
      { id: "wd-19", name: "Nettle Ridgeplow", returnRate: 0.0031, startingReturnRate: 0.0031, stabilityScore: 89 },
    ],
  },
  metal: {
    main: {
      name: "Ani Vildor",
      role: "Artificer — Obelisk Researcher, The Gardens",
      joinDate: "Year 14 of the Current Cycle",
      bio: "Graduate student researching the Obelisk — the fringe topic everyone else abandoned. Bookish, curious, not excited about fieldwork. The vindicated researcher when The First's message arrived.",
      avatarEmoji: "⚗️",
    },
    chatUsers: [
      "Solen Brightlens",
      "Dr. Caro",
      "Fen Wirespark",
      "Tova Relay",
      "Kel Calibrate",
      "Rune Datastream",
      "Zara Ohmfield",
    ],
    champions: [
      { id: "m-01", name: "Silvan Lensgrind", returnRate: 0.0041, startingReturnRate: 0.0041, stabilityScore: 88 },
      { id: "m-02", name: "Etta Waveform", returnRate: -0.0006, startingReturnRate: -0.0006, stabilityScore: 95 },
      { id: "m-03", name: "Calder Spectralis", returnRate: 0.0073, startingReturnRate: 0.0073, stabilityScore: 71 },
      { id: "m-04", name: "Lyris Datacrest", returnRate: 0.0019, startingReturnRate: 0.0019, stabilityScore: 84 },
      { id: "m-05", name: "Oberon Circuitmend", returnRate: 0.0089, startingReturnRate: 0.0089, stabilityScore: 91 },
      { id: "m-06", name: "Quill Parchmentis", returnRate: -0.002, startingReturnRate: -0.002, stabilityScore: 75 },
      { id: "m-07", name: "Thane Calibrax", returnRate: 0.0057, startingReturnRate: 0.0057, stabilityScore: 98 },
      { id: "m-08", name: "Nyx Oscilline", returnRate: 0.0003, startingReturnRate: 0.0003, stabilityScore: 66 },
      { id: "m-09", name: "Praxis Nodeheart", returnRate: 0.0066, startingReturnRate: 0.0066, stabilityScore: 82 },
      { id: "m-10", name: "Vera Signalwright", returnRate: 0.0082, startingReturnRate: 0.0082, stabilityScore: 86 },
      { id: "m-11", name: "Ione Relaybinder", returnRate: -0.0004, startingReturnRate: -0.0004, stabilityScore: 78 },
      { id: "m-12", name: "Castor Theoris", returnRate: 0.0035, startingReturnRate: 0.0035, stabilityScore: 69 },
      { id: "m-13", name: "Maren Electropis", returnRate: 0.0094, startingReturnRate: 0.0094, stabilityScore: 92 },
      { id: "m-14", name: "Dex Aethervault", returnRate: 0.0016, startingReturnRate: 0.0016, stabilityScore: 80 },
      { id: "m-15", name: "Sage Inkwell", returnRate: 0.0068, startingReturnRate: 0.0068, stabilityScore: 89 },
      { id: "m-16", name: "Finch Alloymere", returnRate: -0.0012, startingReturnRate: -0.0012, stabilityScore: 74 },
      { id: "m-17", name: "Orin Scopewright", returnRate: 0.0049, startingReturnRate: 0.0049, stabilityScore: 96 },
      { id: "m-18", name: "Zephyr Filamentis", returnRate: 0.0027, startingReturnRate: 0.0027, stabilityScore: 67 },
      { id: "m-19", name: "Corvid Archivex", returnRate: 0.01, startingReturnRate: 0.01, stabilityScore: 83 },
      { id: "m-20", name: "Lucen Beaconspire", returnRate: 0.0053, startingReturnRate: 0.0053, stabilityScore: 81 },
    ],
  },
};

// ─── Infrastructure Data (generators, facility sections, grid nodes) ─────────

const infrastructureData = {
  fire: {
    zone: "the_deeps",
    facilitySections: [
      { id: "fire_boiler_core", name: "Boiler Core", health: 94, details: { type: "facility_section", description: "Primary heat chamber where lava superheats pressurized water into high-energy steam", stats: { core_temp: "1,847°F", water_pressure: "2,140 PSI", lava_flow_rate: "48 gal/min" } } },
      { id: "fire_turbine_assembly", name: "Turbine Assembly", health: 87, details: { type: "facility_section", description: "Massive reinforced steam turbines converting thermal energy into rotational mechanical energy at over 3,600 RPM", stats: { rpm: "3,612", efficiency: "97.3%", blade_wear: "12%" } } },
      { id: "fire_pressure_regulators", name: "Pressure Regulators", health: 72, details: { type: "facility_section", description: "Network of valves and bypass channels maintaining safe steam pressure", stats: { valve_status: "11/12 Active", bypass_flow: "6.2%", relief_events: "3 this cycle" } } },
      { id: "fire_condenser_unit", name: "Condenser Unit", health: 91, details: { type: "facility_section", description: "Cools exhausted steam back into water using seawater intake", stats: { coolant_temp: "62°F", recovery_rate: "98.1%", scaling: "Low" } } },
      { id: "fire_lava_intake", name: "Lava Intake", health: 68, details: { type: "facility_section", description: "Armored channels drawing molten lava from deep volcanic vents", stats: { channel_temp: "2,680°F", lining_integrity: "68%", flow_control: "Active" } } },
      { id: "fire_power_coupling", name: "Power Coupling", health: 96, details: { type: "facility_section", description: "High-voltage electrical coupling converting turbine rotation into grid electricity", stats: { output: "1.6 GW", voltage: "138 kV", load_factor: "82%" } } },
      { id: "fire_exhaust_stack", name: "Exhaust Stack", health: 85, details: { type: "facility_section", description: "Reinforced chimney venting excess steam and volcanic gases above the Deeps", stats: { emission_rate: "Low", stack_temp: "412°F", scrubber_health: "85%" } } },
    ],
    gridNodes: [
      { id: "fire_gen_01", name: "Generator 01", health: 94, details: { type: "generator", x: 400, y: 80, assigned_users: 47 } },
      { id: "fire_gen_02", name: "Generator 02", health: 87, details: { type: "generator", x: 230, y: 170, assigned_users: 52 } },
      { id: "fire_gen_03", name: "Generator 03", health: 72, details: { type: "generator", x: 570, y: 170, assigned_users: 38 } },
      { id: "fire_gen_04", name: "Generator 04", health: 96, details: { type: "generator", x: 120, y: 290, assigned_users: 61 } },
      { id: "fire_gen_05", name: "Generator 05", health: 68, details: { type: "generator", x: 400, y: 270, assigned_users: 44 } },
      { id: "fire_gen_06", name: "Generator 06", health: 91, details: { type: "generator", x: 680, y: 290, assigned_users: 55 } },
      { id: "fire_gen_07", name: "Generator 07", health: 85, details: { type: "generator", x: 80, y: 420, assigned_users: 33 } },
      { id: "fire_gen_08", name: "Generator 08", health: 45, details: { type: "generator", x: 280, y: 400, assigned_users: 71 } },
      { id: "fire_gen_09", name: "Generator 09", health: 78, details: { type: "generator", x: 520, y: 400, assigned_users: 49 } },
      { id: "fire_gen_10", name: "Generator 10", health: 93, details: { type: "generator", x: 720, y: 420, assigned_users: 40 } },
      { id: "fire_gen_11", name: "Generator 11", health: 62, details: { type: "generator", x: 180, y: 530, assigned_users: 58 } },
      { id: "fire_gen_12", name: "Generator 12", health: 88, details: { type: "generator", x: 400, y: 520, assigned_users: 36 } },
      { id: "fire_gen_13", name: "Generator 13", health: 55, details: { type: "generator", x: 620, y: 530, assigned_users: 42 } },
    ],
    gridEdges: [
      { from: "fire_gen_01", to: "fire_gen_02", health: 90 }, { from: "fire_gen_01", to: "fire_gen_03", health: 85 },
      { from: "fire_gen_01", to: "fire_gen_05", health: 78 }, { from: "fire_gen_02", to: "fire_gen_04", health: 92 },
      { from: "fire_gen_02", to: "fire_gen_05", health: 65 }, { from: "fire_gen_04", to: "fire_gen_07", health: 88 },
      { from: "fire_gen_07", to: "fire_gen_08", health: 42 }, { from: "fire_gen_07", to: "fire_gen_11", health: 70 },
      { from: "fire_gen_03", to: "fire_gen_06", health: 94 }, { from: "fire_gen_03", to: "fire_gen_05", health: 60 },
      { from: "fire_gen_06", to: "fire_gen_09", health: 82 }, { from: "fire_gen_06", to: "fire_gen_10", health: 91 },
      { from: "fire_gen_08", to: "fire_gen_11", health: 55 }, { from: "fire_gen_08", to: "fire_gen_12", health: 48 },
      { from: "fire_gen_09", to: "fire_gen_12", health: 76 }, { from: "fire_gen_09", to: "fire_gen_13", health: 58 },
      { from: "fire_gen_10", to: "fire_gen_13", health: 85 }, { from: "fire_gen_11", to: "fire_gen_12", health: 72 },
      { from: "fire_gen_12", to: "fire_gen_13", health: 66 }, { from: "fire_gen_04", to: "fire_gen_08", health: 75 },
      { from: "fire_gen_05", to: "fire_gen_08", health: 50 }, { from: "fire_gen_05", to: "fire_gen_09", health: 68 },
    ],
  },
  earth: {
    zone: "the_roots",
    facilitySections: [
      { id: "earth_central_market", name: "Central Market", health: 92, details: { type: "facility_section", description: "The bustling heart of the Roots where hundreds of vendors trade goods daily", stats: { active_stalls: "186/200", daily_revenue: "14.2K", foot_traffic: "High" } } },
      { id: "earth_artisan_quarter", name: "Artisan Quarter", health: 88, details: { type: "facility_section", description: "Guild workshops, studios, and ateliers for the island's craftspeople", stats: { active_guilds: "12", output_rate: "94%", apprentices: "47" } } },
      { id: "earth_residential_hub", name: "Residential Hub", health: 85, details: { type: "facility_section", description: "Main housing district. Homes, communal spaces, bathhouses for 5,000 citizens", stats: { occupancy: "96%", maintenance: "On Track", comfort_index: "8.2/10" } } },
      { id: "earth_council_hall", name: "Council Hall", health: 98, details: { type: "facility_section", description: "The amphitheater where the Council convenes. Home to the Ironlord's seat", stats: { next_session: "3 days", active_statutes: "24", open_petitions: "7" } } },
      { id: "earth_bakery_district", name: "Bakery District", health: 90, details: { type: "facility_section", description: "Where bakers transform Wood's grain into bread and staples", stats: { daily_output: "8,400", grain_supply: "Stable", ovens_active: "28/30" } } },
      { id: "earth_cultural_center", name: "Cultural Center", health: 82, details: { type: "facility_section", description: "Performance halls, galleries, and storytelling circles", stats: { events_per_week: "14", attendance: "2,100", artists_active: "64" } } },
    ],
    gridNodes: [
      { id: "earth_market_central", name: "Central Market", health: 92, details: { type: "trade_node", x: 400, y: 80, assigned_users: 186 } },
      { id: "earth_market_east", name: "East Bazaar", health: 85, details: { type: "trade_node", x: 600, y: 160, assigned_users: 94 } },
      { id: "earth_market_west", name: "West Market", health: 78, details: { type: "trade_node", x: 200, y: 160, assigned_users: 82 } },
      { id: "earth_guild_row", name: "Guild Row", health: 90, details: { type: "trade_node", x: 400, y: 260, assigned_users: 120 } },
      { id: "earth_bakery_st", name: "Bakery Street", health: 88, details: { type: "trade_node", x: 150, y: 340, assigned_users: 68 } },
      { id: "earth_textile_sq", name: "Textile Square", health: 76, details: { type: "trade_node", x: 650, y: 340, assigned_users: 55 } },
      { id: "earth_housing_north", name: "North Housing", health: 82, details: { type: "trade_node", x: 300, y: 420, assigned_users: 210 } },
      { id: "earth_housing_south", name: "South Housing", health: 80, details: { type: "trade_node", x: 500, y: 420, assigned_users: 195 } },
      { id: "earth_council_plaza", name: "Council Plaza", health: 98, details: { type: "trade_node", x: 400, y: 520, assigned_users: 45 } },
    ],
    gridEdges: [
      { from: "earth_market_central", to: "earth_market_east", health: 88 },
      { from: "earth_market_central", to: "earth_market_west", health: 82 },
      { from: "earth_market_central", to: "earth_guild_row", health: 95 },
      { from: "earth_market_east", to: "earth_textile_sq", health: 78 },
      { from: "earth_market_west", to: "earth_bakery_st", health: 85 },
      { from: "earth_guild_row", to: "earth_housing_north", health: 80 },
      { from: "earth_guild_row", to: "earth_housing_south", health: 82 },
      { from: "earth_guild_row", to: "earth_bakery_st", health: 76 },
      { from: "earth_guild_row", to: "earth_textile_sq", health: 72 },
      { from: "earth_housing_north", to: "earth_council_plaza", health: 90 },
      { from: "earth_housing_south", to: "earth_council_plaza", health: 92 },
      { from: "earth_bakery_st", to: "earth_housing_north", health: 84 },
      { from: "earth_textile_sq", to: "earth_housing_south", health: 70 },
    ],
  },
  water: {
    zone: "the_wall",
    facilitySections: [
      { id: "water_wall_north", name: "Northern Wall", health: 88, details: { type: "facility_section", description: "Northern perimeter facing the most frequent Veil storm approaches", stats: { guard_towers: "8/8 Active", wall_integrity: "88%", last_breach: "14 days ago" } } },
      { id: "water_wall_south", name: "Southern Wall", health: 92, details: { type: "facility_section", description: "Calmer southern section with fishing access points and Veilfish patrol routes", stats: { guard_towers: "6/6 Active", wall_integrity: "92%", fishing_gates: "3 Open" } } },
      { id: "water_breaker_alpha", name: "Breaker Alpha", health: 82, details: { type: "facility_section", description: "Primary hydraulic Breaker structure on an underwater rail", stats: { hydraulic_psi: "4,200", rail_position: "NNE", rotation_time: "4.2 min" } } },
      { id: "water_breaker_beta", name: "Breaker Beta", health: 76, details: { type: "facility_section", description: "Secondary Breaker covering the opposite arc", stats: { hydraulic_psi: "3,800", rail_position: "SSW", rotation_time: "4.8 min" } } },
      { id: "water_observation_post", name: "Observation Post", health: 95, details: { type: "facility_section", description: "Elevated command post on the Winter Wall where Deepwatch Lorinn oversees operations", stats: { veil_status: "Moderate", signal_strength: "Strong", crew_on_watch: "24" } } },
      { id: "water_dive_bay", name: "Dive Bay", health: 86, details: { type: "facility_section", description: "Staging area for underwater maintenance crews", stats: { divers_ready: "12", equipment: "Good", dives_today: "3" } } },
    ],
    gridNodes: [
      { id: "water_tower_01", name: "Tower N-1", health: 90, details: { type: "guard_tower", x: 400, y: 60, assigned_users: 8 } },
      { id: "water_tower_02", name: "Tower NE-1", health: 85, details: { type: "guard_tower", x: 600, y: 120, assigned_users: 6 } },
      { id: "water_tower_03", name: "Tower NW-1", health: 88, details: { type: "guard_tower", x: 200, y: 120, assigned_users: 7 } },
      { id: "water_tower_04", name: "Tower E-1", health: 78, details: { type: "guard_tower", x: 700, y: 280, assigned_users: 8 } },
      { id: "water_tower_05", name: "Tower W-1", health: 82, details: { type: "guard_tower", x: 100, y: 280, assigned_users: 7 } },
      { id: "water_tower_06", name: "Tower SE-1", health: 72, details: { type: "guard_tower", x: 620, y: 440, assigned_users: 9 } },
      { id: "water_tower_07", name: "Tower SW-1", health: 75, details: { type: "guard_tower", x: 180, y: 440, assigned_users: 8 } },
      { id: "water_tower_08", name: "Tower S-1", health: 92, details: { type: "guard_tower", x: 400, y: 520, assigned_users: 6 } },
      { id: "water_breaker_a", name: "Breaker α", health: 82, details: { type: "breaker_station", x: 520, y: 200, assigned_users: 18 } },
      { id: "water_breaker_b", name: "Breaker β", health: 76, details: { type: "breaker_station", x: 280, y: 380, assigned_users: 16 } },
      { id: "water_command", name: "Command Post", health: 95, details: { type: "command_center", x: 400, y: 290, assigned_users: 24 } },
    ],
    gridEdges: [
      { from: "water_tower_01", to: "water_tower_02", health: 88 }, { from: "water_tower_01", to: "water_tower_03", health: 85 },
      { from: "water_tower_02", to: "water_tower_04", health: 80 }, { from: "water_tower_03", to: "water_tower_05", health: 82 },
      { from: "water_tower_04", to: "water_tower_06", health: 72 }, { from: "water_tower_05", to: "water_tower_07", health: 75 },
      { from: "water_tower_06", to: "water_tower_08", health: 78 }, { from: "water_tower_07", to: "water_tower_08", health: 80 },
      { from: "water_command", to: "water_tower_01", health: 95 }, { from: "water_command", to: "water_tower_04", health: 88 },
      { from: "water_command", to: "water_tower_05", health: 86 }, { from: "water_command", to: "water_tower_08", health: 92 },
      { from: "water_command", to: "water_breaker_a", health: 90 }, { from: "water_command", to: "water_breaker_b", health: 82 },
      { from: "water_breaker_a", to: "water_tower_02", health: 85 }, { from: "water_breaker_b", to: "water_tower_07", health: 76 },
    ],
  },
  wood: {
    zone: "terraced_farms",
    facilitySections: [
      { id: "wood_upper_terrace", name: "Upper Terraces", health: 90, details: { type: "facility_section", description: "Highest crop levels. Specialized high-altitude crops and herbs", stats: { crop_health: "92%", soil_moisture: "Optimal", wind_exposure: "Moderate" } } },
      { id: "wood_mid_terrace", name: "Mid Terraces", health: 86, details: { type: "facility_section", description: "Primary food production engine with layered farms", stats: { active_plots: "142/150", irrigation: "98% Flow", yield_forecast: "94%" } } },
      { id: "wood_lower_terrace", name: "Lower Terraces", health: 78, details: { type: "facility_section", description: "Fruit orchards, root vegetables, first line of flood defense", stats: { orchard_health: "78%", flood_risk: "Moderate", channel_status: "12/14 Clear" } } },
      { id: "wood_flatland_ranch", name: "Flatland Ranches", health: 72, details: { type: "facility_section", description: "Outer radius ranches on the Flats. Livestock, grazing land", stats: { herd_count: "1,840", grazing_status: "Active", flood_exposure: "High" } } },
      { id: "wood_irrigation_hub", name: "Irrigation Hub", health: 88, details: { type: "facility_section", description: "Central control for the Fire-powered irrigation network", stats: { pump_pressure: "1,200 PSI", distribution: "Even", reserve_tank: "78%" } } },
      { id: "wood_grain_storage", name: "Grain Storage", health: 94, details: { type: "facility_section", description: "Climate-controlled storage silos for island food reserves", stats: { capacity_used: "62%", temp_control: "Stable", days_reserve: "45" } } },
    ],
    gridNodes: [
      { id: "wood_upper_t", name: "Upper Terraces", health: 90, details: { type: "supply_node", x: 400, y: 60, assigned_users: 85 } },
      { id: "wood_mid_t_east", name: "Mid-East Terrace", health: 88, details: { type: "supply_node", x: 580, y: 140, assigned_users: 120 } },
      { id: "wood_mid_t_west", name: "Mid-West Terrace", health: 84, details: { type: "supply_node", x: 220, y: 140, assigned_users: 115 } },
      { id: "wood_lower_t", name: "Lower Terraces", health: 78, details: { type: "supply_node", x: 400, y: 240, assigned_users: 95 } },
      { id: "wood_ranch_east", name: "East Ranch", health: 72, details: { type: "supply_node", x: 650, y: 300, assigned_users: 60 } },
      { id: "wood_ranch_west", name: "West Ranch", health: 70, details: { type: "supply_node", x: 150, y: 300, assigned_users: 55 } },
      { id: "wood_irrigation", name: "Irrigation Hub", health: 88, details: { type: "supply_node", x: 400, y: 380, assigned_users: 40 } },
      { id: "wood_storage", name: "Grain Storage", health: 94, details: { type: "supply_node", x: 250, y: 460, assigned_users: 35 } },
      { id: "wood_market_drop", name: "Market Delivery", health: 90, details: { type: "supply_node", x: 550, y: 460, assigned_users: 70 } },
      { id: "wood_roots_dest", name: "The Roots", health: 92, details: { type: "supply_node", x: 400, y: 540, assigned_users: 45 } },
    ],
    gridEdges: [
      { from: "wood_upper_t", to: "wood_mid_t_east", health: 90 }, { from: "wood_upper_t", to: "wood_mid_t_west", health: 88 },
      { from: "wood_mid_t_east", to: "wood_lower_t", health: 82 }, { from: "wood_mid_t_west", to: "wood_lower_t", health: 80 },
      { from: "wood_mid_t_east", to: "wood_ranch_east", health: 75 }, { from: "wood_mid_t_west", to: "wood_ranch_west", health: 72 },
      { from: "wood_lower_t", to: "wood_irrigation", health: 85 }, { from: "wood_ranch_east", to: "wood_market_drop", health: 78 },
      { from: "wood_ranch_west", to: "wood_storage", health: 76 }, { from: "wood_irrigation", to: "wood_storage", health: 88 },
      { from: "wood_irrigation", to: "wood_market_drop", health: 86 }, { from: "wood_storage", to: "wood_roots_dest", health: 92 },
      { from: "wood_market_drop", to: "wood_roots_dest", health: 90 },
    ],
  },
  metal: {
    zone: "the_gardens",
    facilitySections: [
      { id: "metal_academy_hall", name: "Academy Hall", health: 95, details: { type: "facility_section", description: "Main academic building at the summit. Lecture halls, libraries", stats: { active_courses: "24", library_access: "Open", students: "186" } } },
      { id: "metal_veil_observatory", name: "Veil Observatory", health: 88, details: { type: "facility_section", description: "Primary instrument array for monitoring the Veil's EM signature", stats: { em_signature: "+12° N", detection_range: "Full", data_feed: "Active" } } },
      { id: "metal_research_lab_a", name: "Research Lab A", health: 82, details: { type: "facility_section", description: "Primary research lab for Veil studies. EM shielding, specimen storage", stats: { active_experiments: "7", em_shielding: "98%", air_quality: "Clean" } } },
      { id: "metal_research_lab_b", name: "Research Lab B", health: 90, details: { type: "facility_section", description: "Secondary lab focused on materials science and instrument fabrication", stats: { fabrication_queue: "3 items", materials_stock: "Good", printer_status: "Idle" } } },
      { id: "metal_terminal_hub", name: "Terminal Hub", health: 92, details: { type: "facility_section", description: "Central node of the island-wide Terminal network", stats: { nodes_online: "42/44", signal_integrity: "99.2%", latency: "12ms" } } },
      { id: "metal_obelisk_station", name: "Obelisk Station", health: 65, details: { type: "facility_section", description: "Research outpost at the base of the Obelisk. Once dismissed as fringe — now the most important research site", stats: { researchers: "4", anomaly_level: "Rising", funding: "Pending" } } },
    ],
    gridNodes: [
      { id: "metal_hub_central", name: "Central Hub", health: 95, details: { type: "relay_node", x: 400, y: 80, assigned_users: 28 } },
      { id: "metal_relay_gardens", name: "Gardens Relay", health: 92, details: { type: "relay_node", x: 400, y: 200, assigned_users: 15 } },
      { id: "metal_relay_roots_n", name: "Roots North", health: 88, details: { type: "relay_node", x: 250, y: 160, assigned_users: 8 } },
      { id: "metal_relay_roots_s", name: "Roots South", health: 85, details: { type: "relay_node", x: 550, y: 160, assigned_users: 8 } },
      { id: "metal_relay_deeps", name: "Deeps Relay", health: 82, details: { type: "relay_node", x: 200, y: 320, assigned_users: 12 } },
      { id: "metal_relay_wall_n", name: "Wall North", health: 78, details: { type: "relay_node", x: 600, y: 320, assigned_users: 10 } },
      { id: "metal_relay_wall_s", name: "Wall South", health: 72, details: { type: "relay_node", x: 500, y: 440, assigned_users: 10 } },
      { id: "metal_relay_flats", name: "Flats Relay", health: 68, details: { type: "relay_node", x: 150, y: 440, assigned_users: 6 } },
      { id: "metal_relay_terraces", name: "Terraces Relay", health: 80, details: { type: "relay_node", x: 300, y: 440, assigned_users: 7 } },
      { id: "metal_relay_breaker_a", name: "Breaker α Link", health: 76, details: { type: "relay_node", x: 700, y: 240, assigned_users: 5 } },
      { id: "metal_relay_breaker_b", name: "Breaker β Link", health: 70, details: { type: "relay_node", x: 100, y: 240, assigned_users: 5 } },
      { id: "metal_relay_obelisk", name: "Obelisk Link", health: 58, details: { type: "relay_node", x: 400, y: 540, assigned_users: 4 } },
    ],
    gridEdges: [
      { from: "metal_hub_central", to: "metal_relay_gardens", health: 95 },
      { from: "metal_hub_central", to: "metal_relay_roots_n", health: 90 },
      { from: "metal_hub_central", to: "metal_relay_roots_s", health: 88 },
      { from: "metal_relay_gardens", to: "metal_relay_deeps", health: 82 },
      { from: "metal_relay_gardens", to: "metal_relay_wall_n", health: 80 },
      { from: "metal_relay_roots_n", to: "metal_relay_deeps", health: 78 },
      { from: "metal_relay_roots_n", to: "metal_relay_breaker_b", health: 72 },
      { from: "metal_relay_roots_s", to: "metal_relay_wall_n", health: 85 },
      { from: "metal_relay_roots_s", to: "metal_relay_breaker_a", health: 76 },
      { from: "metal_relay_deeps", to: "metal_relay_flats", health: 65 },
      { from: "metal_relay_deeps", to: "metal_relay_terraces", health: 75 },
      { from: "metal_relay_wall_n", to: "metal_relay_wall_s", health: 78 },
      { from: "metal_relay_wall_s", to: "metal_relay_obelisk", health: 55 },
      { from: "metal_relay_terraces", to: "metal_relay_obelisk", health: 60 },
      { from: "metal_relay_flats", to: "metal_relay_terraces", health: 70 },
      { from: "metal_relay_breaker_a", to: "metal_relay_wall_n", health: 72 },
      { from: "metal_relay_breaker_b", to: "metal_relay_deeps", health: 68 },
    ],
  },
};

// ─── Network connections stored as infrastructure entries ─────────────────────

function buildNetworkInfra(factionId, edges) {
  return {
    id: `${factionId}_network`,
    name: `${factionId.charAt(0).toUpperCase() + factionId.slice(1)} Network Connections`,
    zone_id: infrastructureData[factionId].zone,
    faction_id: factionId,
    status: "operational",
    capacity: 100,
    details: { type: "network", edges },
  };
}

// ─── Zone condition updates (average health of faction's infrastructure) ─────

const zoneConditions = {
  the_deeps: avg([94, 87, 72, 91, 68, 96, 85, 94, 87, 72, 96, 68, 91, 85, 45, 78, 93, 62, 88, 55]),
  the_roots: avg([92, 88, 85, 98, 90, 82, 92, 85, 78, 90, 88, 76, 82, 80, 98]),
  the_wall: avg([88, 92, 82, 76, 95, 86, 90, 85, 88, 78, 82, 72, 75, 92, 82, 76, 95]),
  the_breakers: avg([82, 76]),
  terraced_farms: avg([90, 86, 78, 72, 88, 94, 90, 88, 84, 78, 72, 70, 88, 94, 90, 92]),
  the_flats: avg([72, 70]),
  the_gardens: avg([95, 88, 82, 90, 92, 65, 95, 92, 88, 85, 82, 78, 72, 68, 80, 76, 70, 58]),
  the_obelisk: 58,
};

function avg(arr) {
  return Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 100) / 100;
}

// ─── Sector allocation for portfolio ─────────────────────────────────────────

const SECTORS = [
  "Finance", "Real Estate", "Consumer", "Technology", "Energy",
  "Healthcare", "Industrial", "Materials", "Crypto", "Agriculture",
  "Defense", "Culture",
];

function generateAllocations() {
  const raw = SECTORS.map(() => Math.random());
  const sum = raw.reduce((a, b) => a + b, 0);
  return raw.map((v) => Math.round((v / sum) * 10000) / 10000);
}

// ─── Main Seed Function ──────────────────────────────────────────────────────

async function seed() {
  await client.connect();
  console.log("Connected to Railway PostgreSQL");

  try {
    await client.query("BEGIN");

    // ── 0. Ensure tables and columns exist ──────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS chronicle_posts (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        subtitle TEXT,
        author TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    // Add profile columns to users table
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT`);
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS join_date TEXT`);
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT`);
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_emoji TEXT`);
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_main BOOLEAN DEFAULT false`);

    // Create user_friends table for friend relationships
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_friends (
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        friend_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        PRIMARY KEY (user_id, friend_id)
      )
    `);

    console.log("  ✓ schema migrations applied (chronicle_posts, user columns, user_friends)");

    // ── 1. Update faction standings ──────────────────────────────────────────
    console.log("\n[1/7] Updating faction standings...");
    for (const [factionId, standing] of Object.entries(factionStandings)) {
      await client.query(
        "UPDATE factions SET standing = $1 WHERE id = $2",
        [standing, factionId]
      );
    }
    console.log("  ✓ Updated standings for 5 factions");

    // ── 2. Clear and re-seed users ──────────────────────────────────────────
    console.log("\n[2/7] Seeding users and citizens...");
    await client.query("DELETE FROM user_friends");
    await client.query("DELETE FROM portfolio_allocations");
    await client.query("DELETE FROM champions");
    await client.query("DELETE FROM users");

    const allUsers = [];
    let userCounter = {};
    const mainUserIds = {};

    for (const [factionId, data] of Object.entries(factionUsers)) {
      userCounter[factionId] = 0;
      const seenNames = new Set();
      const fEmoji = factionEmojis[factionId];

      // Main character
      const mainIdx = String(++userCounter[factionId]).padStart(2, "0");
      const mainId = `${factionId}_${mainIdx}`;
      const mainBalance = 25000 + Math.random() * 20000;
      mainUserIds[factionId] = mainId;
      allUsers.push({
        id: mainId,
        name: data.main.name,
        faction_id: factionId,
        balance: Math.round(mainBalance * 100) / 100,
        starting_balance: Math.round(mainBalance * 100) / 100,
        standing: factionStandings[factionId],
        is_champion: false,
        is_main: true,
        role: data.main.role,
        join_date: data.main.joinDate,
        bio: data.main.bio,
        avatar_emoji: data.main.avatarEmoji,
      });
      seenNames.add(data.main.name.toLowerCase());

      // Chat users (non-champion named characters)
      for (const chatName of data.chatUsers) {
        if (seenNames.has(chatName.toLowerCase())) continue;
        seenNames.add(chatName.toLowerCase());
        const idx = String(++userCounter[factionId]).padStart(2, "0");
        const uid = `${factionId}_${idx}`;
        const bal = 5000 + Math.random() * 35000;
        allUsers.push({
          id: uid,
          name: chatName,
          faction_id: factionId,
          balance: Math.round(bal * 100) / 100,
          starting_balance: Math.round(bal * 100) / 100,
          standing: Math.round((40 + Math.random() * 50) * 100) / 100,
          is_champion: false,
          is_main: false,
          avatar_emoji: fEmoji,
        });
      }

      // Champions
      for (const champ of data.champions) {
        if (seenNames.has(champ.name.toLowerCase())) continue;
        seenNames.add(champ.name.toLowerCase());
        const idx = String(++userCounter[factionId]).padStart(2, "0");
        const uid = `${factionId}_${idx}`;
        const champBalance = 15000 + champ.returnRate * 1000000;
        allUsers.push({
          id: uid,
          name: champ.name,
          faction_id: factionId,
          balance: Math.round(Math.max(1000, champBalance) * 100) / 100,
          starting_balance: Math.round(Math.max(1000, champBalance) * 100) / 100,
          standing: champ.stabilityScore,
          is_champion: true,
          is_main: false,
          starting_return_rate: champ.startingReturnRate,
          avatar_emoji: fEmoji,
        });
      }
    }

    // Insert users
    for (const u of allUsers) {
      await client.query(
        "INSERT INTO users (id, name, faction_id, balance, starting_balance, standing, is_champion, starting_return_rate, is_main, role, join_date, bio, avatar_emoji) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)",
        [u.id, u.name, u.faction_id, u.balance, u.starting_balance, u.standing, u.is_champion, u.starting_return_rate ?? null, u.is_main ?? false, u.role ?? null, u.join_date ?? null, u.bio ?? null, u.avatar_emoji ?? null]
      );
    }

    // Insert champions into dedicated champions table
    for (const u of allUsers.filter((u) => u.is_champion)) {
      await client.query(
        "INSERT INTO champions (id, name, faction_id, balance, starting_balance, standing, starting_return_rate) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [u.id, u.name, u.faction_id, u.balance, u.starting_balance, u.standing, u.starting_return_rate ?? null]
      );
    }

    // Seed friend relationships
    const nameToId = {};
    for (const u of allUsers) {
      const key = `${u.faction_id}:${u.name.toLowerCase()}`;
      nameToId[key] = u.id;
    }

    let friendCount = 0;
    for (const [factionId, friendNames] of Object.entries(friendUsersByFaction)) {
      const mainId = mainUserIds[factionId];
      for (const friendName of friendNames) {
        const friendId = nameToId[`${factionId}:${friendName.toLowerCase()}`];
        if (mainId && friendId) {
          await client.query(
            "INSERT INTO user_friends (user_id, friend_id) VALUES ($1, $2)",
            [mainId, friendId]
          );
          friendCount++;
        }
      }
    }

    const factionCounts = {};
    allUsers.forEach((u) => {
      factionCounts[u.faction_id] = (factionCounts[u.faction_id] || 0) + 1;
    });
    console.log(`  ✓ Inserted ${allUsers.length} users and citizens`);
    console.log("    Per faction:", JSON.stringify(factionCounts));
    console.log(`  ✓ Inserted ${friendCount} friend relationships`);

    // ── 3. Rebuild portfolio allocations ─────────────────────────────────────
    console.log("\n[3/7] Generating portfolio allocations...");
    let allocCount = 0;
    for (const u of allUsers) {
      const allocs = generateAllocations();
      for (let i = 0; i < SECTORS.length; i++) {
        await client.query(
          "INSERT INTO portfolio_allocations (user_id, sector, allocation_pct) VALUES ($1, $2, $3)",
          [u.id, SECTORS[i], allocs[i]]
        );
        allocCount++;
      }
    }
    console.log(`  ✓ Inserted ${allocCount} portfolio allocations (${allUsers.length} users × ${SECTORS.length} sectors)`);

    // ── 4. Expand infrastructure ─────────────────────────────────────────────
    console.log("\n[4/7] Expanding infrastructure...");
    await client.query("DELETE FROM infrastructure");

    let infraCount = 0;

    // Re-insert the 6 core infrastructure items
    const coreInfra = [
      { id: "power_grid", name: "Power Grid", zone_id: "the_deeps", faction_id: "fire", status: "operational", capacity: 100, details: { generators_online: 13, output_gw: 9.4, description: "Island-wide power grid powered by 13 lava generators in the Deeps" } },
      { id: "breakers", name: "The Breakers", zone_id: "the_breakers", faction_id: "water", status: "operational", capacity: 100, details: { coverage_percent: 10, alignment: "neutral", dependency_chain: ["metal", "water", "fire"], alpha_health: 82, beta_health: 76 } },
      { id: "terminal_network", name: "Terminal Network", zone_id: null, faction_id: "metal", status: "operational", capacity: 100, details: { nodes_online: 42, total_nodes: 44, signal_integrity: "99.2%", latency_ms: 12, description: "Physical hardwired communication network" } },
      { id: "elevators", name: "Elevators", zone_id: "the_deeps", faction_id: "fire", status: "operational", capacity: 100, details: { description: "Transit between Roots and Deeps with redundant brakes" } },
      { id: "flood_channels", name: "Flood Channels", zone_id: "terraced_farms", faction_id: "wood", status: "operational", capacity: 100, details: { channels_clear: 14, total_channels: 15, description: "Terrace drainage, irrigation, and flood defense system" } },
      { id: "veil_monitoring", name: "Veil Monitoring", zone_id: "the_gardens", faction_id: "metal", status: "operational", capacity: 100, details: { em_shift: "+12° N", detection_range: "Full", data_feed: "Active", description: "EM signature tracking, storm pattern analysis" } },
    ];

    for (const item of coreInfra) {
      await client.query(
        "INSERT INTO infrastructure (id, name, zone_id, faction_id, status, capacity, details) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [item.id, item.name, item.zone_id, item.faction_id, item.status, item.capacity, JSON.stringify(item.details)]
      );
      infraCount++;
    }

    // Insert facility sections and grid nodes per faction
    for (const [factionId, data] of Object.entries(infrastructureData)) {
      // Facility sections
      for (const section of data.facilitySections) {
        const status = section.health >= 80 ? "operational" : section.health >= 60 ? "degraded" : "critical";
        await client.query(
          "INSERT INTO infrastructure (id, name, zone_id, faction_id, status, capacity, details) VALUES ($1, $2, $3, $4, $5, $6, $7)",
          [section.id, section.name, data.zone, factionId, status, section.health, JSON.stringify(section.details)]
        );
        infraCount++;
      }

      // Grid nodes
      for (const node of data.gridNodes) {
        const status = node.health >= 80 ? "operational" : node.health >= 60 ? "degraded" : "critical";
        await client.query(
          "INSERT INTO infrastructure (id, name, zone_id, faction_id, status, capacity, details) VALUES ($1, $2, $3, $4, $5, $6, $7)",
          [node.id, node.name, data.zone, factionId, status, node.health, JSON.stringify(node.details)]
        );
        infraCount++;
      }

      // Network connections (single entry with all edges)
      const network = buildNetworkInfra(factionId, data.gridEdges);
      await client.query(
        "INSERT INTO infrastructure (id, name, zone_id, faction_id, status, capacity, details) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [network.id, network.name, network.zone_id, network.faction_id, network.status, network.capacity, JSON.stringify(network.details)]
      );
      infraCount++;
    }

    console.log(`  ✓ Inserted ${infraCount} infrastructure entries`);

    // ── 5. Update zone conditions ────────────────────────────────────────────
    console.log("\n[5/7] Updating zone conditions...");
    for (const [zoneId, condition] of Object.entries(zoneConditions)) {
      await client.query(
        "UPDATE zones SET condition = $1 WHERE id = $2",
        [condition, zoneId]
      );
    }
    console.log("  ✓ Updated conditions for 8 zones");

    // ── 6. Seed initial feed entries ─────────────────────────────────────────
    console.log("\n[6/7] Seeding initial feed entries...");
    await client.query("DELETE FROM feed_entries");

    const feedEntries = [
      { tick: 0, faction_id: "fire", feed_type: "status", content: "All 13 generators running. Total output: 9.4 GW. Generator 08 flagged for maintenance — lava intake lining at 45%.", narrator_type: "faction" },
      { tick: 0, faction_id: "fire", feed_type: "report", content: "Marshall Herman orders extended monitoring on Generator 08. Double shift crew assigned.", narrator_type: "faction" },
      { tick: 0, faction_id: "earth", feed_type: "status", content: "Central Market operating at 93% capacity. 186 of 200 stalls active. Daily revenue tracking at 14.2K.", narrator_type: "faction" },
      { tick: 0, faction_id: "earth", feed_type: "announcement", content: "Cultural Center hosting evening performances all week. Attendance expected: 2,100.", narrator_type: "faction" },
      { tick: 0, faction_id: "water", feed_type: "status", content: "Perimeter secure. Veil activity: moderate. Breaker Alpha at NNE, rotation time 4.2 min. Breaker Beta at SSW — hydraulic pressure below optimal.", narrator_type: "faction" },
      { tick: 0, faction_id: "water", feed_type: "alert", content: "Breaker Beta hydraulic PSI at 3,800 — below the 4,000 target. Maintenance flagged. Fire notified for power check.", narrator_type: "faction" },
      { tick: 0, faction_id: "wood", feed_type: "status", content: "Harvest yield projection: 94%. Quota on track. 142 of 150 mid-terrace plots active. Eastern flood channels holding.", narrator_type: "faction" },
      { tick: 0, faction_id: "wood", feed_type: "report", content: "Flatland ranchers report 1,840 head of livestock, all healthy. Western pasture fence breach repaired.", narrator_type: "faction" },
      { tick: 0, faction_id: "metal", feed_type: "status", content: "Terminal Network: 42 of 44 nodes online. Signal integrity 99.2%. Obelisk Link signal degraded to 58%.", narrator_type: "faction" },
      { tick: 0, faction_id: "metal", feed_type: "research", content: "Obelisk Station reporting elevated anomaly levels for the third consecutive day. Researcher Ani Vildor requests funding increase.", narrator_type: "faction" },
      { tick: 0, faction_id: null, feed_type: "world", content: "The island holds its equilibrium. Ten thousand souls in the belly of a volcano, surrounded by a storm that never ends. The Marshalls keep the lights on, the Stewards keep the food coming, Bluecrest keeps the Veil at bay, and the Artificers keep watching. The Ironlord presides. For now, it works.", narrator_type: "narrator" },
      { tick: 0, faction_id: null, feed_type: "world", content: "Council session in 3 days. Agenda: resource allocation review, Breaker maintenance schedule, and a petition to expand the Artisan Quarter.", narrator_type: "narrator" },
    ];

    for (const entry of feedEntries) {
      await client.query(
        "INSERT INTO feed_entries (tick, faction_id, feed_type, content, narrator_type, timestamp) VALUES ($1, $2, $3, $4, $5, NOW())",
        [entry.tick, entry.faction_id, entry.feed_type, entry.content, entry.narrator_type]
      );
    }
    console.log(`  ✓ Inserted ${feedEntries.length} feed entries`);

    // ── 7. Seed initial events ───────────────────────────────────────────────
    console.log("\n[7/7] Seeding initial events...");
    await client.query("DELETE FROM events");

    const events = [
      { tick: 0, source: "system", event_type: "simulation_start", raw_input: "Simulation initialized. All factions at baseline. Tick 0.", magnitude: 0, direction: "neutral", scope: "global", target_faction_id: null, narrative_data: { message: "The island begins a new cycle." }, faction_impacts: { fire: 0, earth: 0, water: 0, wood: 0, metal: 0 } },
      { tick: 0, source: "infrastructure", event_type: "maintenance_flag", raw_input: "Generator 08 lava intake lining at 45%. Maintenance required.", magnitude: 0.3, direction: "negative", scope: "faction", target_faction_id: "fire", narrative_data: { generator: "Generator 08", issue: "Lava intake lining degradation", health: 45 }, faction_impacts: { fire: -0.02, earth: 0, water: 0, wood: 0, metal: 0 } },
      { tick: 0, source: "infrastructure", event_type: "maintenance_flag", raw_input: "Breaker Beta hydraulic pressure below optimal. 3,800 PSI vs 4,000 target.", magnitude: 0.2, direction: "negative", scope: "faction", target_faction_id: "water", narrative_data: { unit: "Breaker Beta", issue: "Low hydraulic pressure", current_psi: 3800, target_psi: 4000 }, faction_impacts: { fire: 0, earth: 0, water: -0.015, wood: -0.005, metal: 0 } },
      { tick: 0, source: "infrastructure", event_type: "anomaly_detected", raw_input: "Obelisk electromagnetic anomaly readings elevated for third consecutive day.", magnitude: 0.15, direction: "uncertain", scope: "global", target_faction_id: "metal", narrative_data: { location: "Obelisk Station", anomaly: "Elevated EM readings", duration: "3 days" }, faction_impacts: { fire: 0, earth: 0, water: 0, wood: 0, metal: 0.01 } },
    ];

    for (const evt of events) {
      await client.query(
        "INSERT INTO events (tick, timestamp, source, event_type, raw_input, magnitude, direction, scope, target_faction_id, narrative_data, faction_impacts) VALUES ($1, NOW(), $2, $3, $4, $5, $6, $7, $8, $9, $10)",
        [evt.tick, evt.source, evt.event_type, evt.raw_input, evt.magnitude, evt.direction, evt.scope, evt.target_faction_id, JSON.stringify(evt.narrative_data), JSON.stringify(evt.faction_impacts)]
      );
    }
    console.log(`  ✓ Inserted ${events.length} events`);

    await client.query("COMMIT");
    console.log("\n═══════════════════════════════════════════════");
    console.log("  DATABASE SEEDED SUCCESSFULLY");
    console.log("═══════════════════════════════════════════════");

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("SEED FAILED — rolled back:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seed();
