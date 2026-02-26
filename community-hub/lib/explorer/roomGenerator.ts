import type { ExplorerStat, StatBlock } from "@/types/explorer/explorer";
import type {
  RoomSize,
  RoomType,
  RoomMaterial,
  RoomTemplate,
  RoomInstance,
  RoomChallenge,
  ChallengeOption,
  AbilityCategory,
  VantheonState,
  EnemyInstance,
} from "@/types/explorer/vantheon";
import { ABILITY_CATEGORIES, CATEGORY_STATS } from "@/types/explorer/vantheon";
import { generateLoot } from "./lootGenerator";
import { generateEnemies } from "./combatEngine";

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function weightedPick<T>(items: T[], weights: number[]): T {
  const total = weights.reduce((s, w) => s + w, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

const ROOM_TYPES_BY_FLOOR: { type: RoomType; minFloor: number }[] = [
  { type: "hallway", minFloor: 1 },
  { type: "cave", minFloor: 1 },
  { type: "chamber", minFloor: 1 },
  { type: "camp", minFloor: 1 },
  { type: "shrine", minFloor: 1 },
  { type: "pit", minFloor: 2 },
  { type: "library", minFloor: 2 },
  { type: "fungal", minFloor: 2 },
  { type: "armory", minFloor: 3 },
  { type: "flooded", minFloor: 3 },
  { type: "crypt", minFloor: 1 },
  { type: "sewer", minFloor: 1 },
  { type: "ruins", minFloor: 1 },
  { type: "garden", minFloor: 2 },
  { type: "prison", minFloor: 2 },
  { type: "nest", minFloor: 2 },
  { type: "web", minFloor: 2 },
  { type: "bridge", minFloor: 2 },
  { type: "forge", minFloor: 3 },
  { type: "laboratory", minFloor: 3 },
  { type: "throne", minFloor: 3 },
  { type: "crystal", minFloor: 3 },
  { type: "frozen", minFloor: 4 },
  { type: "volcanic", minFloor: 4 },
  { type: "clockwork", minFloor: 4 },
];

const ADJECTIVES: Record<RoomType, string[]> = {
  hallway: ["Narrow", "Winding", "Dusty", "Crumbling", "Long", "Dim", "Echoing"],
  cave: ["Dark", "Dripping", "Moss-Covered", "Stalactite", "Cramped", "Vast", "Glowing"],
  chamber: ["Ancient", "Vaulted", "Ruined", "Grand", "Forgotten", "Sealed", "Ornate"],
  camp: ["Abandoned", "Quiet", "Makeshift", "Warm", "Scattered", "Lone", "Guarded"],
  shrine: ["Sacred", "Defiled", "Glimmering", "Silent", "Overgrown", "Blessed", "Fractured"],
  pit: ["Deep", "Jagged", "Treacherous", "Bottomless", "Slippery", "Echoing", "Rocky"],
  library: ["Dusty", "Towering", "Forbidden", "Scattered", "Ancient", "Crumbling", "Vast"],
  armory: ["Rusted", "Stocked", "Ransacked", "Hidden", "Fortified", "Old", "Locked"],
  fungal: ["Spore-Filled", "Luminous", "Damp", "Toxic", "Overgrown", "Pulsing", "Strange"],
  flooded: ["Submerged", "Murky", "Rushing", "Stagnant", "Icy", "Knee-Deep", "Drowned"],
  crypt: ["Haunted", "Crumbling", "Sealed", "Bone-Lined", "Silent", "Cursed", "Forgotten"],
  forge: ["Smoldering", "Abandoned", "Roaring", "Ancient", "Molten", "Soot-Choked", "Ruined"],
  sewer: ["Fetid", "Dripping", "Narrow", "Rat-Infested", "Slick", "Reeking", "Crumbling"],
  garden: ["Overgrown", "Wild", "Thorny", "Lush", "Withered", "Tangled", "Blooming"],
  prison: ["Rusted", "Abandoned", "Dark", "Shackled", "Cramped", "Haunted", "Iron"],
  laboratory: ["Bubbling", "Shattered", "Arcane", "Unstable", "Cluttered", "Forbidden", "Stained"],
  throne: ["Crumbling", "Grand", "Shadowed", "Golden", "Forsaken", "Imperial", "Ruined"],
  bridge: ["Narrow", "Swaying", "Crumbling", "Ancient", "Rope-Slung", "Stone", "Precarious"],
  nest: ["Chittering", "Dark", "Webbed", "Bone-Strewn", "Warm", "Pulsing", "Foul"],
  crystal: ["Glittering", "Resonant", "Fractured", "Prismatic", "Humming", "Jagged", "Luminous"],
  frozen: ["Glacial", "Frost-Crusted", "Silent", "Bitter", "Icy", "Shimmering", "Frozen"],
  volcanic: ["Scorching", "Ashen", "Molten", "Smoking", "Cracked", "Obsidian", "Rumbling"],
  clockwork: ["Ticking", "Rusted", "Whirring", "Precise", "Jammed", "Intricate", "Grinding"],
  web: ["Silken", "Sticky", "Dense", "Layered", "Thick", "Glistening", "Tangled"],
  ruins: ["Collapsed", "Ancient", "Overgrown", "Shattered", "Sunken", "Weathered", "Buried"],
};

const NOUNS: Record<RoomType, string[]> = {
  hallway: ["Corridor", "Passage", "Tunnel", "Walkway", "Gallery"],
  cave: ["Cavern", "Grotto", "Cave", "Hollow", "Burrow"],
  chamber: ["Chamber", "Hall", "Room", "Vault", "Sanctum"],
  camp: ["Camp", "Shelter", "Rest Stop", "Bivouac", "Den"],
  shrine: ["Shrine", "Altar", "Chapel", "Sanctum", "Reliquary"],
  pit: ["Pit", "Chasm", "Abyss", "Crevasse", "Sinkhole"],
  library: ["Library", "Archive", "Study", "Repository", "Collection"],
  armory: ["Armory", "Arsenal", "Stockpile", "Forge", "Vault"],
  fungal: ["Garden", "Grove", "Bloom", "Colony", "Thicket"],
  flooded: ["Basin", "Pool", "Channel", "Cistern", "Spring"],
  crypt: ["Crypt", "Tomb", "Mausoleum", "Catacomb", "Ossuary"],
  forge: ["Forge", "Foundry", "Crucible", "Smithy", "Kiln"],
  sewer: ["Sewer", "Drain", "Culvert", "Gutter", "Pipe"],
  garden: ["Garden", "Greenhouse", "Arboretum", "Thicket", "Grove"],
  prison: ["Cell Block", "Dungeon", "Cage", "Stockade", "Oubliette"],
  laboratory: ["Laboratory", "Workshop", "Experiment", "Distillery", "Study"],
  throne: ["Throne Room", "Court", "Dais", "Audience Hall", "Gallery"],
  bridge: ["Bridge", "Span", "Crossing", "Causeway", "Overpass"],
  nest: ["Nest", "Lair", "Den", "Hive", "Warren"],
  crystal: ["Geode", "Crystal Hall", "Prism", "Vein", "Formation"],
  frozen: ["Glacier", "Ice Cave", "Frost Chamber", "Tundra", "Rime Hall"],
  volcanic: ["Caldera", "Lava Tube", "Vent", "Magma Chamber", "Crater"],
  clockwork: ["Gearworks", "Mechanism", "Engine Room", "Clock Tower", "Assembly"],
  web: ["Web", "Cocoon Chamber", "Silk Hollow", "Spinner Den", "Tangle"],
  ruins: ["Ruins", "Wreckage", "Remnants", "Rubble Hall", "Foundation"],
};

interface ChallengeThemeDef {
  name: string;
  description: string;
  options: {
    label: string;
    description: string;
    category: AbilityCategory;
    triggersCombat?: boolean;
    triggersParkour?: boolean;
    triggersPuzzle?: boolean;
  }[];
}

const CHALLENGE_THEMES: Record<RoomType, ChallengeThemeDef[]> = {
  hallway: [
    {
      name: "Collapsing Ceiling",
      description: "Stones crack and begin to fall from above.",
      options: [
        { label: "Sprint Through", description: "Run as fast as you can before it collapses.", category: "physical" },
        { label: "Spot Safe Path", description: "Read the cracks and find a safe route.", category: "skill" },
      ],
    },
    {
      name: "Tripwire Trap",
      description: "A thin wire stretches across the passage at ankle height.",
      options: [
        { label: "Disarm Trap", description: "Carefully disable the mechanism.", category: "skill" },
        { label: "Steel Yourself", description: "Brace for impact and power through.", category: "physical" },
      ],
    },
    {
      name: "Wandering Shade",
      description: "A ghostly figure blocks the corridor, moaning softly.",
      options: [
        { label: "Calm the Spirit", description: "Speak soothingly to ease its passage.", category: "mental" },
        { label: "Dodge Past", description: "Slip by before it can react.", category: "skill" },
      ],
    },
    {
      name: "Crumbling Corridor",
      description: "The passage ahead is falling apart — sections of floor have given way entirely.",
      options: [
        { label: "Sprint the Route", description: "Find a path through the crumbling hallway at full speed.", category: "physical", triggersParkour: true },
        { label: "Steady Crawl", description: "Move slowly and carefully across the debris.", category: "skill" },
      ],
    },
    {
      name: "Poison Dart Wall",
      description: "Tiny holes line both walls, and a faint click echoes as you step forward.",
      options: [
        { label: "Dodge the Darts", description: "Weave through the hail of poison darts.", category: "skill" },
        { label: "Block with Shield", description: "Raise your guard and absorb the impacts.", category: "physical" },
      ],
    },
    {
      name: "Shifting Walls",
      description: "The walls grind inward, slowly closing the passage.",
      options: [
        { label: "Sprint Before They Close", description: "Race through before the walls crush you.", category: "physical", triggersParkour: true },
        { label: "Find the Switch", description: "Search for the mechanism to stop the walls.", category: "skill" },
      ],
    },
    {
      name: "Dark Ambush",
      description: "Shapes lunge from the shadows ahead — an ambush!",
      options: [
        { label: "Fight Back", description: "Draw your weapon and meet them head-on.", category: "physical", triggersCombat: true },
        { label: "Sense the Trap", description: "Trust your instincts and react first.", category: "mental" },
      ],
    },
  ],
  cave: [
    {
      name: "Hostile Creatures",
      description: "Chitinous creatures click in the darkness, eyes reflecting your light.",
      options: [
        { label: "Fight Them Off", description: "Stand your ground and strike.", category: "physical", triggersCombat: true },
        { label: "Sneak Past", description: "Move silently through the shadows.", category: "skill" },
      ],
    },
    {
      name: "Rockfall",
      description: "The cave shudders and loose stones cascade from above.",
      options: [
        { label: "Dodge the Rocks", description: "Roll and weave between the falling debris.", category: "skill" },
        { label: "Endure the Impact", description: "Shield yourself and take the hits.", category: "physical" },
      ],
    },
    {
      name: "Narrow Squeeze",
      description: "The passage narrows to a tight crevice you must pass through.",
      options: [
        { label: "Force Through", description: "Use brute strength to push through.", category: "physical" },
        { label: "Find Another Way", description: "Study the rock for a hidden route.", category: "skill" },
      ],
    },
    {
      name: "Ledge Run",
      description: "A series of narrow rock ledges jut out over a dark chasm below.",
      options: [
        { label: "Run the Ledges", description: "Leap between the rocky ledges at speed.", category: "physical", triggersParkour: true },
        { label: "Rope Swing", description: "Use old rope anchors to swing across safely.", category: "skill" },
      ],
    },
    {
      name: "Underground River",
      description: "A roaring underground river cuts across the cave floor.",
      options: [
        { label: "Swim Across", description: "Plunge in and fight the current.", category: "physical" },
        { label: "Find a Crossing", description: "Look for fallen rocks or a natural bridge.", category: "skill" },
      ],
    },
    {
      name: "Bat Swarm",
      description: "A deafening screech fills the air as hundreds of bats descend from above.",
      options: [
        { label: "Cover and Endure", description: "Shield yourself and wait for them to pass.", category: "physical" },
        { label: "Stay Calm", description: "Keep your nerve and avoid startling them further.", category: "mental" },
      ],
    },
    {
      name: "Crystal Crawl",
      description: "Razor-sharp crystal formations jut from every surface, creating a deadly obstacle course.",
      options: [
        { label: "Navigate Carefully", description: "Thread your way between the crystals.", category: "skill", triggersParkour: true },
        { label: "Smash a Path", description: "Break through the formations by force.", category: "physical" },
      ],
    },
  ],
  chamber: [
    {
      name: "Animated Guardian",
      description: "A stone construct stirs to life, blocking the exit.",
      options: [
        { label: "Overpower It", description: "Engage the guardian in direct combat.", category: "physical", triggersCombat: true },
        { label: "Find Its Weakness", description: "Study the construct for a flaw.", category: "skill" },
      ],
    },
    {
      name: "Puzzle Lock",
      description: "Intricate mechanisms bar the way forward.",
      options: [
        { label: "Solve the Puzzle", description: "Work through the logic of the mechanism.", category: "skill" },
        { label: "Intimidate", description: "Shout commands at the ancient lock.", category: "mental" },
      ],
    },
    {
      name: "Ancient Ward",
      description: "A shimmering barrier of old magic blocks the path.",
      options: [
        { label: "Dispel It", description: "Use your knowledge to unravel the ward.", category: "skill" },
        { label: "Resist and Push Through", description: "Endure the pain and walk through.", category: "physical" },
      ],
    },
    {
      name: "Rune Alignment",
      description: "Pairs of glowing runes are etched into stone tablets scattered across the floor. They must be matched to open the way.",
      options: [
        { label: "Match the Runes", description: "Use your intuition to pair the ancient symbols.", category: "mental", triggersPuzzle: true },
        { label: "Smash Through", description: "Ignore the puzzle and break the barrier by force.", category: "physical" },
      ],
    },
    {
      name: "The Gauntlet",
      description: "Pressure plates and swinging blades line a long trapped corridor.",
      options: [
        { label: "Run the Gauntlet", description: "Dodge through the traps at full speed.", category: "physical", triggersParkour: true },
        { label: "Dismantle Traps", description: "Carefully disarm each mechanism one by one.", category: "skill" },
      ],
    },
    {
      name: "Spinning Blade Floor",
      description: "Blades whirl across the floor in unpredictable patterns, driven by hidden machinery.",
      options: [
        { label: "Time Your Run", description: "Study the pattern and dash through gaps.", category: "skill" },
        { label: "Jump Over", description: "Leap above the blades with raw athleticism.", category: "physical" },
      ],
    },
    {
      name: "Possessed Armor",
      description: "A suit of armor steps off its stand, empty helm turning toward you.",
      options: [
        { label: "Destroy It", description: "Smash the haunted armor to pieces.", category: "physical", triggersCombat: true },
        { label: "Banish the Spirit", description: "Command the possessing spirit to depart.", category: "mental" },
      ],
    },
  ],
  camp: [
    {
      name: "Suspicious Merchant",
      description: "A hooded figure offers goods at steep prices.",
      options: [
        { label: "Haggle", description: "Negotiate for a better deal.", category: "mental" },
        { label: "Pickpocket", description: "Lift items while they're distracted.", category: "skill" },
      ],
    },
    {
      name: "Wounded Survivor",
      description: "A fellow explorer lies injured, begging for help.",
      options: [
        { label: "Tend Wounds", description: "Use your knowledge to treat their injuries.", category: "skill" },
        { label: "Encourage Them", description: "Inspire them to push through the pain.", category: "mental" },
      ],
    },
    {
      name: "Campfire Stories",
      description: "Survivors share rumors about the floors ahead.",
      options: [
        { label: "Listen Carefully", description: "Absorb every detail of their warnings.", category: "mental" },
        { label: "Trade Intel", description: "Offer your own knowledge for theirs.", category: "mental" },
      ],
    },
    {
      name: "Thief in the Night",
      description: "You catch a shadowy figure rummaging through a sleeping traveler's pack.",
      options: [
        { label: "Grab the Thief", description: "Lunge and pin them before they can flee.", category: "physical" },
        { label: "Talk Them Down", description: "Convince them to drop the goods peacefully.", category: "mental" },
      ],
    },
    {
      name: "Poisoned Rations",
      description: "A generous stranger offers you food, but something smells off.",
      options: [
        { label: "Inspect the Food", description: "Examine the rations for signs of tampering.", category: "skill" },
        { label: "Read Their Intent", description: "Study their face for signs of deception.", category: "mental" },
      ],
    },
    {
      name: "Rival Gang",
      description: "A group of hostile explorers blocks the path, demanding a toll.",
      options: [
        { label: "Stand Your Ground", description: "Refuse to pay and prepare to fight.", category: "physical", triggersCombat: true },
        { label: "Negotiate Passage", description: "Talk your way through with charm and wit.", category: "mental" },
      ],
    },
  ],
  shrine: [
    {
      name: "Offering Required",
      description: "The altar demands a sacrifice of will or body.",
      options: [
        { label: "Pray", description: "Open your mind to the shrine's power.", category: "mental" },
        { label: "Blood Offering", description: "Cut your palm and let blood flow.", category: "physical" },
      ],
    },
    {
      name: "Guardian Spirit",
      description: "A spectral guardian tests your worthiness.",
      options: [
        { label: "Prove Your Worth", description: "Demonstrate your strength of character.", category: "mental" },
        { label: "Outmaneuver It", description: "Dodge its ethereal attacks.", category: "skill" },
      ],
    },
    {
      name: "Memory of the Ancients",
      description: "Sacred symbols float in the air, flickering in and out of sight. Only a focused mind can match them all.",
      options: [
        { label: "Match the Symbols", description: "Concentrate and pair the sacred glyphs.", category: "mental", triggersPuzzle: true },
        { label: "Pray for Guidance", description: "Appeal to the shrine for safe passage.", category: "mental" },
      ],
    },
    {
      name: "Cursed Idol",
      description: "A dark idol radiates malevolent energy from the altar, warping the air around it.",
      options: [
        { label: "Destroy It", description: "Shatter the idol with a powerful blow.", category: "physical" },
        { label: "Resist Its Pull", description: "Steel your mind against the idol's influence.", category: "mental" },
      ],
    },
    {
      name: "Trial of Faith",
      description: "The shrine presents a vision — you must walk blindly across a chasm on an invisible bridge.",
      options: [
        { label: "Leap of Faith", description: "Trust the vision and step forward blindly.", category: "mental" },
        { label: "Feel the Way", description: "Probe ahead carefully with your feet.", category: "skill" },
      ],
    },
    {
      name: "Whispering Voices",
      description: "Disembodied voices fill the chamber, each urging a different path. Only one speaks truth.",
      options: [
        { label: "Discern the Truth", description: "Focus your mind to identify the honest voice.", category: "mental" },
        { label: "Ignore Them All", description: "Block out the noise and trust your own senses.", category: "skill" },
      ],
    },
  ],
  pit: [
    {
      name: "Crumbling Edge",
      description: "The ground gives way beneath your feet.",
      options: [
        { label: "Leap Across", description: "Jump to the other side.", category: "physical" },
        { label: "Find Handholds", description: "Climb along the wall instead.", category: "skill" },
      ],
    },
    {
      name: "Thing in the Depths",
      description: "Something stirs below, reaching upward.",
      options: [
        { label: "Strike Down", description: "Attack before it can grab you.", category: "physical", triggersCombat: true },
        { label: "Calm It", description: "Project an aura of peace to soothe the beast.", category: "mental" },
      ],
    },
    {
      name: "Chasm Crossing",
      description: "Floating stone platforms hover over a bottomless abyss, shifting unpredictably.",
      options: [
        { label: "Platform Hop", description: "Navigate the shifting platforms at speed.", category: "physical", triggersParkour: true },
        { label: "Study the Pattern", description: "Watch the platforms and time your crossings carefully.", category: "mental" },
      ],
    },
    {
      name: "Rope Bridge",
      description: "A fraying rope bridge sways over the abyss. Several planks are missing.",
      options: [
        { label: "Run Across", description: "Sprint across before it gives way.", category: "physical" },
        { label: "Test Each Step", description: "Probe each plank before putting your weight on it.", category: "skill" },
      ],
    },
    {
      name: "Rising Lava",
      description: "Magma bubbles up from below, slowly filling the pit. The heat is already intense.",
      options: [
        { label: "Climb Fast", description: "Scale the walls as fast as you can.", category: "physical", triggersParkour: true },
        { label: "Find Cool Spots", description: "Identify safe footholds away from the rising heat.", category: "skill" },
      ],
    },
  ],
  library: [
    {
      name: "Cursed Tome",
      description: "A book flies open, releasing a wave of dark energy.",
      options: [
        { label: "Read the Counter-Spell", description: "Find the right page to shut it down.", category: "skill" },
        { label: "Resist the Curse", description: "Fortify your mind against the assault.", category: "mental" },
      ],
    },
    {
      name: "Animated Books",
      description: "Shelves of books swirl into a defensive formation.",
      options: [
        { label: "Smash Through", description: "Barrel through the paper barricade.", category: "physical" },
        { label: "Command Order", description: "Assert authority over the enchanted texts.", category: "mental" },
      ],
    },
    {
      name: "Scattered Pages",
      description: "Torn pages from ancient tomes litter the floor. Each page has a twin — match them to restore the texts and unlock the door.",
      options: [
        { label: "Match the Pages", description: "Study the pages and pair each to its twin.", category: "mental", triggersPuzzle: true },
        { label: "Search for the Key", description: "Ignore the pages and rummage for another way out.", category: "skill" },
      ],
    },
    {
      name: "Ink Golem",
      description: "A creature formed of living ink oozes from a shattered inkwell, growing larger by the second.",
      options: [
        { label: "Destroy It", description: "Attack the golem before it fully forms.", category: "physical", triggersCombat: true },
        { label: "Contain the Ink", description: "Use nearby materials to seal it back.", category: "skill" },
      ],
    },
    {
      name: "Riddle Lock",
      description: "An ancient riddle is carved into the door — only the correct answer will open it.",
      options: [
        { label: "Solve the Riddle", description: "Reason through the ancient wordplay.", category: "mental" },
        { label: "Search the Shelves", description: "Look for the answer hidden in nearby texts.", category: "skill" },
      ],
    },
  ],
  armory: [
    {
      name: "Trapped Weapon Rack",
      description: "A rack of gleaming weapons is rigged with pressure plates.",
      options: [
        { label: "Disarm the Trap", description: "Carefully bypass the pressure mechanism.", category: "skill" },
        { label: "Grab and Roll", description: "Snatch a weapon and dive clear.", category: "physical" },
      ],
    },
    {
      name: "Rival Scavenger",
      description: "Another explorer claims this haul as theirs.",
      options: [
        { label: "Intimidate", description: "Assert dominance and make them back down.", category: "mental" },
        { label: "Fight for It", description: "Settle the dispute with force.", category: "physical", triggersCombat: true },
      ],
    },
    {
      name: "Animated Armor",
      description: "Several suits of armor clank to life, forming a defensive line.",
      options: [
        { label: "Charge Through", description: "Smash through the animated sentinels.", category: "physical", triggersCombat: true },
        { label: "Find the Control Rune", description: "Locate and deactivate whatever animates them.", category: "skill" },
      ],
    },
    {
      name: "Explosive Barrel",
      description: "Barrels of unstable alchemical powder sit among the weapons. A spark could ignite them.",
      options: [
        { label: "Move Them Carefully", description: "Gently relocate the barrels to safety.", category: "skill" },
        { label: "Shield and Brace", description: "Prepare for the worst and protect yourself.", category: "physical" },
      ],
    },
    {
      name: "Weapon Spirit",
      description: "A sentient sword floats from its rack, demanding you prove your worth before it lets you pass.",
      options: [
        { label: "Duel the Spirit", description: "Accept the challenge and cross blades.", category: "physical", triggersCombat: true },
        { label: "Outsmart It", description: "Trick the spirit with wordplay and cunning.", category: "mental" },
      ],
    },
  ],
  fungal: [
    {
      name: "Spore Cloud",
      description: "A mushroom erupts, filling the air with toxic spores.",
      options: [
        { label: "Hold Breath", description: "Power through on a single lungful.", category: "physical" },
        { label: "Find Clean Air", description: "Identify a safe path through the bloom.", category: "skill" },
      ],
    },
    {
      name: "Hallucinogenic Mist",
      description: "The air shimmers with mind-altering vapors.",
      options: [
        { label: "Resist the Visions", description: "Keep your mind anchored to reality.", category: "mental" },
        { label: "Navigate Blind", description: "Close your eyes and feel your way through.", category: "skill" },
      ],
    },
    {
      name: "Carnivorous Plant",
      description: "A massive fungal maw opens in the floor, tendrils reaching hungrily toward you.",
      options: [
        { label: "Hack It Apart", description: "Cut the tendrils and destroy the maw.", category: "physical", triggersCombat: true },
        { label: "Lure It Away", description: "Toss something to distract the hungry plant.", category: "skill" },
      ],
    },
    {
      name: "Mycelium Maze",
      description: "A dense network of glowing mycelium creates a shifting labyrinth across the floor.",
      options: [
        { label: "Run the Maze", description: "Navigate the twisting paths at speed.", category: "physical", triggersParkour: true },
        { label: "Read the Glow", description: "Follow the brightest threads to find the way.", category: "mental" },
      ],
    },
    {
      name: "Blooming Terror",
      description: "A massive fungal bloom is about to release a wave of choking spores. You have seconds.",
      options: [
        { label: "Destroy the Bloom", description: "Strike it down before it erupts.", category: "physical" },
        { label: "Seal Your Lungs", description: "Focus your willpower to endure the toxins.", category: "mental" },
      ],
    },
  ],
  flooded: [
    {
      name: "Strong Current",
      description: "Rushing water threatens to sweep you away.",
      options: [
        { label: "Swim Against It", description: "Power through the current with raw strength.", category: "physical" },
        { label: "Find a Route", description: "Spot submerged handholds and stepping stones.", category: "skill" },
      ],
    },
    {
      name: "Submerged Predator",
      description: "Something large moves beneath the surface.",
      options: [
        { label: "Distract It", description: "Throw something to lure it away.", category: "skill" },
        { label: "Stare It Down", description: "Project calm authority to ward it off.", category: "mental" },
      ],
    },
    {
      name: "Rapids",
      description: "Stepping stones and fallen pillars form a precarious path across a rushing underground river.",
      options: [
        { label: "Run the Rapids", description: "Leap between the stepping stones at speed.", category: "physical", triggersParkour: true },
        { label: "Wade Through", description: "Brave the current with sheer endurance.", category: "physical" },
      ],
    },
    {
      name: "Electrified Water",
      description: "Arcs of energy crackle across the water's surface from a damaged conduit above.",
      options: [
        { label: "Time Your Crossing", description: "Watch the discharge pattern and move between pulses.", category: "skill" },
        { label: "Endure the Shock", description: "Grit your teeth and push through.", category: "physical" },
      ],
    },
    {
      name: "Sunken Passage",
      description: "The only way forward is a fully submerged tunnel. You can't see the other end.",
      options: [
        { label: "Dive Through", description: "Hold your breath and swim for it.", category: "physical" },
        { label: "Sense the Current", description: "Feel the water flow to gauge the tunnel's length.", category: "mental" },
      ],
    },
  ],
  crypt: [
    {
      name: "Restless Dead",
      description: "Skeletal hands claw out of crumbling sarcophagi as the dead rise around you.",
      options: [
        { label: "Fight the Dead", description: "Smash the skeletons before they fully rise.", category: "physical", triggersCombat: true },
        { label: "Speak the Rites", description: "Recite words of rest to quiet the spirits.", category: "mental" },
      ],
    },
    {
      name: "Coffin Trap",
      description: "The lid of a grand sarcophagus slides open, releasing a cloud of noxious gas.",
      options: [
        { label: "Hold Your Breath", description: "Seal your lungs and push through the gas.", category: "physical" },
        { label: "Detect the Trigger", description: "Identify and disable the trap mechanism.", category: "skill" },
      ],
    },
    {
      name: "Death Shroud",
      description: "A spectral mist descends, sapping your will and chilling you to the bone.",
      options: [
        { label: "Resist the Cold", description: "Fortify your mind against the deathly chill.", category: "mental" },
        { label: "Move Quickly", description: "Outrun the mist before it drains your strength.", category: "physical" },
      ],
    },
    {
      name: "Bone Puzzle",
      description: "Skulls are arranged on pedestals in pairs. Match each skull to its twin to unlock the crypt door.",
      options: [
        { label: "Match the Skulls", description: "Study the markings and pair the bones.", category: "mental", triggersPuzzle: true },
        { label: "Kick the Door Down", description: "Ignore the puzzle and force the door.", category: "physical" },
      ],
    },
  ],
  forge: [
    {
      name: "Molten Metal",
      description: "A crucible tips, sending a river of molten metal flowing across the floor.",
      options: [
        { label: "Leap Over", description: "Jump across the molten stream.", category: "physical" },
        { label: "Redirect the Flow", description: "Use tools to channel the metal away.", category: "skill" },
      ],
    },
    {
      name: "Animated Hammer",
      description: "A massive forge hammer begins swinging on its own, crashing against the anvil in a deadly rhythm.",
      options: [
        { label: "Time Your Dash", description: "Sprint past between the hammer's strikes.", category: "skill", triggersParkour: true },
        { label: "Jam the Mechanism", description: "Force something into the gears to stop it.", category: "physical" },
      ],
    },
    {
      name: "Smoke Inhalation",
      description: "Thick black smoke pours from the forge, choking the air and blinding you.",
      options: [
        { label: "Power Through", description: "Hold your breath and push through the smoke.", category: "physical" },
        { label: "Find the Vent", description: "Feel along the walls for a draft of clean air.", category: "skill" },
      ],
    },
    {
      name: "Forge Guardian",
      description: "A hulking figure of molten iron rises from the forge pit, hammer in hand.",
      options: [
        { label: "Fight It", description: "Engage the searing construct in combat.", category: "physical", triggersCombat: true },
        { label: "Quench It", description: "Douse it with water to cool and shatter it.", category: "skill" },
      ],
    },
  ],
  sewer: [
    {
      name: "Toxic Fumes",
      description: "Noxious gases rise from the muck, burning your eyes and throat.",
      options: [
        { label: "Endure the Stench", description: "Push through the fumes with sheer grit.", category: "physical" },
        { label: "Find Fresh Air", description: "Locate a vent or pocket of clean air.", category: "skill" },
      ],
    },
    {
      name: "Swarm of Rats",
      description: "A writhing mass of rats pours from a crack in the wall, screeching and biting.",
      options: [
        { label: "Fight Through", description: "Stomp and kick your way through the swarm.", category: "physical", triggersCombat: true },
        { label: "Scare Them Off", description: "Use fire or noise to scatter the rats.", category: "skill" },
      ],
    },
    {
      name: "Slippery Passage",
      description: "The sewer floor is coated in slick algae, and the tunnel slopes downward sharply.",
      options: [
        { label: "Slide Down", description: "Ride the slope and try to control your descent.", category: "physical", triggersParkour: true },
        { label: "Careful Footing", description: "Move slowly, testing each step.", category: "skill" },
      ],
    },
    {
      name: "Flooded Grate",
      description: "A heavy iron grate blocks the passage, half-submerged in filthy water.",
      options: [
        { label: "Wrench It Open", description: "Grab the bars and heave with all your might.", category: "physical" },
        { label: "Pick the Lock", description: "Work the rusted lock mechanism underwater.", category: "skill" },
      ],
    },
  ],
  garden: [
    {
      name: "Thorny Vines",
      description: "Writhing thorny vines block every path forward, reaching for anything that moves.",
      options: [
        { label: "Hack Through", description: "Cut a path through the tangled vines.", category: "physical" },
        { label: "Find a Gap", description: "Study the growth pattern for an opening.", category: "skill" },
      ],
    },
    {
      name: "Predatory Plant",
      description: "A massive flower opens its petals, revealing rows of sharp teeth within.",
      options: [
        { label: "Kill the Plant", description: "Strike at the stem before it can attack.", category: "physical", triggersCombat: true },
        { label: "Feed It Something", description: "Toss a distraction into its maw.", category: "skill" },
      ],
    },
    {
      name: "Pollen Storm",
      description: "A sudden gust sends clouds of choking pollen swirling through the air.",
      options: [
        { label: "Push Through", description: "Cover your face and barrel through.", category: "physical" },
        { label: "Clear Your Mind", description: "Resist the disorienting effects through focus.", category: "mental" },
      ],
    },
    {
      name: "Living Hedge",
      description: "The garden's hedgerows have grown into a shifting maze that rearranges itself.",
      options: [
        { label: "Run the Maze", description: "Sprint through before the walls close in.", category: "physical", triggersParkour: true },
        { label: "Sense the Path", description: "Feel for the correct route through intuition.", category: "mental" },
      ],
    },
  ],
  prison: [
    {
      name: "Chained Beast",
      description: "A massive creature strains against its chains, snarling at you. The chains are weakening.",
      options: [
        { label: "Kill It Quickly", description: "Strike before it breaks free.", category: "physical", triggersCombat: true },
        { label: "Calm the Beast", description: "Project soothing energy to settle it.", category: "mental" },
      ],
    },
    {
      name: "Lock Sequence",
      description: "A series of cell doors must be opened in the correct order to proceed. Symbols on each door hint at the sequence.",
      options: [
        { label: "Decode the Sequence", description: "Match the door symbols to find the right order.", category: "mental", triggersPuzzle: true },
        { label: "Pick Every Lock", description: "Bypass the puzzle by picking each lock individually.", category: "skill" },
      ],
    },
    {
      name: "Ghost Warden",
      description: "The spectral form of an ancient jailer materializes, keys jangling, demanding you return to your cell.",
      options: [
        { label: "Defy the Warden", description: "Stand your ground against the ghost's commands.", category: "mental" },
        { label: "Steal the Keys", description: "Snatch the ghostly keys before it can react.", category: "skill" },
      ],
    },
    {
      name: "Collapsing Cells",
      description: "The cell block groans and shifts — walls are caving in one by one.",
      options: [
        { label: "Sprint Through", description: "Race through the collapsing cells.", category: "physical", triggersParkour: true },
        { label: "Brace the Walls", description: "Hold back debris long enough to pass.", category: "physical" },
      ],
    },
  ],
  laboratory: [
    {
      name: "Volatile Chemicals",
      description: "Glass beakers bubble and hiss. One wrong step could trigger a chain reaction.",
      options: [
        { label: "Navigate Carefully", description: "Step precisely between the unstable mixtures.", category: "skill" },
        { label: "Shield Yourself", description: "Brace for an explosion and charge through.", category: "physical" },
      ],
    },
    {
      name: "Living Experiment",
      description: "A creature grows rapidly in a shattered containment vat, lashing out with malformed limbs.",
      options: [
        { label: "Destroy It", description: "Kill the aberration before it reaches full size.", category: "physical", triggersCombat: true },
        { label: "Sedate It", description: "Find a reagent to put it back to sleep.", category: "skill" },
      ],
    },
    {
      name: "Acid Pool",
      description: "A wide pool of bubbling acid separates you from the exit. Fumes rise in wisps.",
      options: [
        { label: "Leap Across", description: "Jump over the pool with all your strength.", category: "physical" },
        { label: "Neutralize It", description: "Find a base compound to create a safe crossing.", category: "skill" },
      ],
    },
    {
      name: "Alchemical Puzzle",
      description: "Pairs of reagent bottles sit on a workbench. Mix the correct pairs to create the key compound.",
      options: [
        { label: "Match the Reagents", description: "Pair the bottles by their markings.", category: "mental", triggersPuzzle: true },
        { label: "Brute-Force Mixing", description: "Try random combinations and hope for the best.", category: "physical" },
      ],
    },
  ],
  throne: [
    {
      name: "Phantom King",
      description: "The ghost of an ancient ruler rises from the throne, crown ablaze with spectral fire.",
      options: [
        { label: "Challenge the King", description: "Face the phantom in single combat.", category: "physical", triggersCombat: true },
        { label: "Kneel and Speak", description: "Show respect and negotiate passage.", category: "mental" },
      ],
    },
    {
      name: "Throne Guardian",
      description: "Stone lions flanking the throne animate, blocking your path with rumbling growls.",
      options: [
        { label: "Fight Past Them", description: "Engage the stone guardians head-on.", category: "physical", triggersCombat: true },
        { label: "Command Authority", description: "Speak with the voice of a ruler to still them.", category: "mental" },
      ],
    },
    {
      name: "Royal Trap",
      description: "The floor tiles around the throne are pressure-sensitive. Step wrong and darts fly.",
      options: [
        { label: "Dance Through", description: "Navigate the trapped floor with precision.", category: "skill", triggersParkour: true },
        { label: "Spot the Safe Tiles", description: "Study the pattern of wear on the tiles.", category: "mental" },
      ],
    },
  ],
  bridge: [
    {
      name: "Collapsing Bridge",
      description: "The bridge groans and begins to crumble from the far end. You need to cross now.",
      options: [
        { label: "Sprint Across", description: "Run with everything you have.", category: "physical", triggersParkour: true },
        { label: "Read the Cracks", description: "Step only on the sections that will hold.", category: "skill" },
      ],
    },
    {
      name: "Wind Blast",
      description: "A howling gale tears across the bridge, threatening to hurl you into the abyss.",
      options: [
        { label: "Brace and Push", description: "Plant your feet and fight the wind.", category: "physical" },
        { label: "Time the Gusts", description: "Move between blasts when the air stills.", category: "skill" },
      ],
    },
    {
      name: "Troll Challenge",
      description: "A massive troll blocks the bridge, demanding a toll — or a fight.",
      options: [
        { label: "Fight the Troll", description: "Draw your weapon and attack.", category: "physical", triggersCombat: true },
        { label: "Outwit the Troll", description: "Trick the brute with a clever riddle.", category: "mental" },
      ],
    },
    {
      name: "Swaying Ropes",
      description: "The bridge is nothing but ropes and loose planks swinging wildly over the void.",
      options: [
        { label: "Grip and Climb", description: "Haul yourself across hand over hand.", category: "physical" },
        { label: "Balance Walk", description: "Walk the ropes with careful balance.", category: "skill" },
      ],
    },
  ],
  nest: [
    {
      name: "Hatchling Swarm",
      description: "Dozens of newly hatched creatures pour from cracked eggs, hungry and aggressive.",
      options: [
        { label: "Crush the Swarm", description: "Stomp and strike the hatchlings down.", category: "physical", triggersCombat: true },
        { label: "Dodge Through", description: "Weave between the swarming creatures.", category: "skill" },
      ],
    },
    {
      name: "Mother Beast",
      description: "A massive creature guards its nest, eyes fixed on you with murderous intent.",
      options: [
        { label: "Fight the Mother", description: "Engage the beast in a desperate battle.", category: "physical", triggersCombat: true },
        { label: "Back Away Slowly", description: "Show no threat and retreat carefully.", category: "mental" },
      ],
    },
    {
      name: "Egg Minefield",
      description: "The floor is covered in eggs that burst with acidic fluid when disturbed.",
      options: [
        { label: "Navigate the Eggs", description: "Step carefully between the eggs.", category: "skill", triggersParkour: true },
        { label: "Clear a Path", description: "Pop them from a distance with thrown objects.", category: "skill" },
      ],
    },
  ],
  crystal: [
    {
      name: "Resonance Shatter",
      description: "The crystals vibrate at a dangerous frequency. One wrong note and they explode into shrapnel.",
      options: [
        { label: "Dampen the Sound", description: "Muffle the resonance before it peaks.", category: "skill" },
        { label: "Shield and Endure", description: "Protect yourself from the inevitable shatter.", category: "physical" },
      ],
    },
    {
      name: "Reflected Light",
      description: "Beams of searing light bounce between crystals, creating a deadly grid.",
      options: [
        { label: "Thread the Beams", description: "Dodge between the light beams.", category: "skill", triggersParkour: true },
        { label: "Shatter a Crystal", description: "Break a crystal to disrupt the grid.", category: "physical" },
      ],
    },
    {
      name: "Crystal Golem",
      description: "A towering figure of jagged crystal rises from the formations, refracting light into blinding arcs.",
      options: [
        { label: "Shatter It", description: "Strike at the golem's weak joints.", category: "physical", triggersCombat: true },
        { label: "Find Its Flaw", description: "Spot the impure crystal that holds it together.", category: "mental" },
      ],
    },
    {
      name: "Prismatic Riddle",
      description: "Colored crystals sit in pairs on pedestals. Match the colors correctly to open the way.",
      options: [
        { label: "Match the Prisms", description: "Pair each crystal with its chromatic twin.", category: "mental", triggersPuzzle: true },
        { label: "Smash Through the Wall", description: "Forget the puzzle and break the crystal barrier.", category: "physical" },
      ],
    },
  ],
  frozen: [
    {
      name: "Ice Slick",
      description: "The entire floor is a sheet of ice, and the far exit is uphill.",
      options: [
        { label: "Charge Up", description: "Dig in and power your way up the slope.", category: "physical" },
        { label: "Carve Footholds", description: "Use your blade to cut grips in the ice.", category: "skill" },
      ],
    },
    {
      name: "Frozen Guardian",
      description: "An ancient warrior encased in ice suddenly cracks free, weapon raised.",
      options: [
        { label: "Battle the Guardian", description: "Fight the frost-coated warrior.", category: "physical", triggersCombat: true },
        { label: "Refreeze It", description: "Drive it back toward the coldest part of the room.", category: "skill" },
      ],
    },
    {
      name: "Hypothermia",
      description: "The cold is unbearable. Your fingers go numb and your vision blurs.",
      options: [
        { label: "Willpower Through", description: "Force your body to keep moving.", category: "mental" },
        { label: "Generate Heat", description: "Sprint and move to warm yourself.", category: "physical" },
      ],
    },
    {
      name: "Icicle Corridor",
      description: "Massive icicles hang from the ceiling. A wrong step sends vibrations that break them loose.",
      options: [
        { label: "Run the Gauntlet", description: "Sprint through before they all fall.", category: "physical", triggersParkour: true },
        { label: "Tiptoe Through", description: "Move silently to avoid triggering any falls.", category: "skill" },
      ],
    },
  ],
  volcanic: [
    {
      name: "Lava Flow",
      description: "A river of molten rock cuts across the chamber, heat waves distorting the air.",
      options: [
        { label: "Leap the Flow", description: "Jump across the narrowest point.", category: "physical" },
        { label: "Find Cooled Stone", description: "Locate a path of hardened lava to walk on.", category: "skill" },
      ],
    },
    {
      name: "Eruption",
      description: "Geysers of lava erupt from cracks in the floor in a lethal pattern.",
      options: [
        { label: "Dodge the Geysers", description: "Navigate the eruptions at speed.", category: "physical", triggersParkour: true },
        { label: "Predict the Pattern", description: "Study the timing and find safe spots.", category: "mental" },
      ],
    },
    {
      name: "Fire Elemental",
      description: "A being of pure flame coalesces from the lava, its eyes burning with malice.",
      options: [
        { label: "Extinguish It", description: "Attack with everything you have.", category: "physical", triggersCombat: true },
        { label: "Resist Its Heat", description: "Fortify yourself against the searing aura.", category: "mental" },
      ],
    },
    {
      name: "Obsidian Maze",
      description: "Sharp obsidian walls form a labyrinth above the volcanic floor.",
      options: [
        { label: "Navigate Quickly", description: "Find the way through before the heat overwhelms you.", category: "skill" },
        { label: "Smash the Walls", description: "Break through the brittle obsidian by force.", category: "physical" },
      ],
    },
  ],
  clockwork: [
    {
      name: "Gear Trap",
      description: "Massive interlocking gears spin across the floor, their teeth ready to crush anything caught between them.",
      options: [
        { label: "Time Your Sprint", description: "Run between the rotating gear teeth.", category: "skill", triggersParkour: true },
        { label: "Jam the Gears", description: "Force something into the mechanism to stop it.", category: "physical" },
      ],
    },
    {
      name: "Steam Vent",
      description: "Scalding steam blasts from pipes at random intervals, filling the room with searing mist.",
      options: [
        { label: "Dodge the Vents", description: "Predict the bursts and weave between them.", category: "skill" },
        { label: "Endure the Burns", description: "Push through the steam with raw toughness.", category: "physical" },
      ],
    },
    {
      name: "Automaton",
      description: "A brass automaton whirs to life, its blade-arms spinning with mechanical precision.",
      options: [
        { label: "Destroy the Machine", description: "Smash the automaton before it locks on.", category: "physical", triggersCombat: true },
        { label: "Find the Off Switch", description: "Locate the automaton's shutdown mechanism.", category: "skill" },
      ],
    },
    {
      name: "Clockwork Puzzle",
      description: "Pairs of numbered dials line the wall. Set matching pairs to the same value to open the vault.",
      options: [
        { label: "Match the Dials", description: "Turn each dial to match its twin.", category: "mental", triggersPuzzle: true },
        { label: "Override the Lock", description: "Bypass the mechanism with brute-force tinkering.", category: "skill" },
      ],
    },
  ],
  web: [
    {
      name: "Web Snare",
      description: "Sticky webs span the entire passage. One wrong move and you're stuck.",
      options: [
        { label: "Cut Through", description: "Slash the webs apart with your blade.", category: "physical" },
        { label: "Navigate the Gaps", description: "Thread through openings in the web.", category: "skill" },
      ],
    },
    {
      name: "Spider Ambush",
      description: "Giant spiders drop from the ceiling, fangs dripping with venom.",
      options: [
        { label: "Fight Them Off", description: "Engage the spiders in combat.", category: "physical", triggersCombat: true },
        { label: "Use the Webs", description: "Entangle the spiders in their own silk.", category: "skill" },
      ],
    },
    {
      name: "Cocoon Rescue",
      description: "A fellow explorer hangs in a silk cocoon, still alive but fading. Spiders approach.",
      options: [
        { label: "Cut Them Free", description: "Slash the cocoon open quickly.", category: "physical" },
        { label: "Distract the Spiders", description: "Lure the spiders away first.", category: "skill" },
      ],
    },
    {
      name: "Silk Bridge",
      description: "The only path forward is a tangle of silk strands stretched over a dark pit.",
      options: [
        { label: "Walk the Silk", description: "Balance across the sticky strands.", category: "skill", triggersParkour: true },
        { label: "Swing Across", description: "Grab a strand and swing to the other side.", category: "physical" },
      ],
    },
  ],
  ruins: [
    {
      name: "Falling Debris",
      description: "The ancient ceiling groans and chunks of stone rain down without warning.",
      options: [
        { label: "Sprint Through", description: "Run full speed before it all comes down.", category: "physical" },
        { label: "Read the Cracks", description: "Predict where the next collapse will be.", category: "skill" },
      ],
    },
    {
      name: "Ancient Trap",
      description: "A preserved trap mechanism activates — darts, blades, and falling blocks.",
      options: [
        { label: "Dodge Everything", description: "React and weave through the ancient defenses.", category: "skill", triggersParkour: true },
        { label: "Tank the Damage", description: "Raise your guard and push through.", category: "physical" },
      ],
    },
    {
      name: "Buried Alive",
      description: "The floor gives way and you tumble into a collapsed section. Rubble pins you down.",
      options: [
        { label: "Dig Yourself Out", description: "Push the rubble aside with raw strength.", category: "physical" },
        { label: "Stay Calm", description: "Conserve energy and find the weakness in the debris.", category: "mental" },
      ],
    },
    {
      name: "Ruin Guardians",
      description: "Crumbling stone statues stir to life, their ancient enchantments barely holding together.",
      options: [
        { label: "Smash the Statues", description: "Destroy them before they fully animate.", category: "physical", triggersCombat: true },
        { label: "Break the Enchantment", description: "Find and disrupt the rune powering them.", category: "mental" },
      ],
    },
  ],
};

function rollSize(): RoomSize {
  return weightedPick<RoomSize>(
    ["small", "medium", "large"],
    [60, 30, 10],
  );
}

function challengeCountForSize(size: RoomSize): number {
  if (size === "small") return 1;
  if (size === "medium") return 2;
  return 3;
}

function pickRoomType(floor: number): RoomType {
  const available = ROOM_TYPES_BY_FLOOR
    .filter((rt) => floor >= rt.minFloor)
    .map((rt) => rt.type);
  return pick(available);
}

function pickMaterial(): RoomMaterial {
  return pick<RoomMaterial>(["dirt", "metal", "wood", "brick"]);
}

function generateRoomName(roomType: RoomType): string {
  return `${pick(ADJECTIVES[roomType])} ${pick(NOUNS[roomType])}`;
}

function generateChallenges(
  roomType: RoomType,
  count: number,
  floor: number,
): RoomChallenge[] {
  const themeDefs = CHALLENGE_THEMES[roomType];
  const shuffled = [...themeDefs].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  while (selected.length < count) {
    selected.push(pick(themeDefs));
  }

  const baseDC = 4 + floor * 2;

  return selected.map((theme) => {
    const options: ChallengeOption[] = theme.options.map((opt) => {
      const stats = CATEGORY_STATS[opt.category];
      const stat = pick(stats);
      const dcVariance = randInt(-1, 1);
      const option: ChallengeOption = {
        label: opt.label,
        description: opt.description,
        category: opt.category,
        stat,
        difficultyBase: baseDC + dcVariance,
      };
      if (opt.triggersCombat) option.triggersCombat = true;
      if (opt.triggersParkour) option.triggersParkour = true;
      if (opt.triggersPuzzle) option.triggersPuzzle = true;
      return option;
    });

    return {
      name: theme.name,
      description: theme.description,
      options,
    };
  });
}

function generateDescription(roomType: RoomType, size: RoomSize): string {
  const sizeDesc = size === "small" ? "cramped" : size === "medium" ? "moderately sized" : "vast";
  const typeDescs: Record<RoomType, string[]> = {
    hallway: ["A passage stretches ahead, worn by countless footsteps.", "The corridor twists into the dark."],
    cave: ["Natural stone formations surround you.", "Water drips from the ceiling above."],
    chamber: ["Carved walls hint at ancient purpose.", "This room was built with intention."],
    camp: ["Signs of habitation dot the area.", "A campfire's embers still glow faintly."],
    shrine: ["An otherworldly aura fills the space.", "Ancient symbols glow on the walls."],
    pit: ["The ground drops away dangerously.", "Echoes rise from an unseen depth."],
    library: ["Shelves of forgotten knowledge line the walls.", "Dust motes dance in the stale air."],
    armory: ["Weapon racks and armor stands fill the room.", "The smell of oil and old metal hangs heavy."],
    fungal: ["Bioluminescent fungi cast an eerie glow.", "Spores drift lazily through the air."],
    flooded: ["Water covers the floor, its depth uncertain.", "The sound of dripping echoes endlessly."],
    crypt: ["Stone sarcophagi line the walls in silent rows.", "The air is cold and smells of dust and old bone."],
    forge: ["Heat radiates from the ancient furnace.", "Soot and slag cover every surface."],
    sewer: ["Filthy water trickles through cracked channels.", "The stench is almost unbearable."],
    garden: ["Twisted roots and tangled vines consume the space.", "Strange flowers bloom in the dim light."],
    prison: ["Iron bars and heavy chains hang from the walls.", "Scratches mark the walls — someone counted the days."],
    laboratory: ["Shattered glass and spilled reagents cover the tables.", "Strange apparatus hums with residual energy."],
    throne: ["A grand chair looms at the far end of the hall.", "Faded banners hang from the walls in tatters."],
    bridge: ["The span stretches over a dizzying void.", "Wind howls through the open expanse below."],
    nest: ["Bones and scraps litter the floor among crude bedding.", "A rank animal musk fills the air."],
    crystal: ["Light refracts through countless crystalline surfaces.", "A low hum resonates through the formations."],
    frozen: ["Ice coats every surface in a thick rime.", "Your breath hangs in visible clouds before you."],
    volcanic: ["The air shimmers with intense heat.", "Cracks in the floor glow with molten light."],
    clockwork: ["Gears and cogs turn endlessly in the walls.", "A rhythmic ticking fills the mechanical space."],
    web: ["Thick silk strands crisscross in every direction.", "Something moves in the shadows between the webs."],
    ruins: ["Toppled columns and shattered walls speak of past grandeur.", "Vegetation pushes through cracks in the ancient stone."],
  };
  return `A ${sizeDesc} space. ${pick(typeDescs[roomType])}`;
}

export function generateRoom(state: VantheonState, playerEffectiveStats?: StatBlock): RoomInstance {
  const floor = state.currentFloor;

  if (state.hasKey && state.roomsSinceLastKey >= 2) {
    const doorChance = Math.min(0.9, 0.2 + (state.roomsSinceLastKey - 2) * 0.1);
    if (Math.random() < doorChance) {
      return generateDoorRoom(floor);
    }
  }

  const nextKeyIn = 10 - state.roomsSinceLastKey;
  if (nextKeyIn <= 0 || (state.roomsSinceLastKey >= 1 && Math.random() < 1 / Math.max(1, nextKeyIn))) {
    if (!state.hasKey) {
      return generateKeyRoom(floor);
    }
  }

  if (!state.merchantVisitedThisFloor && state.roomsOnCurrentFloor >= 2) {
    const merchantChance = 1 / Math.max(1, 8 - state.roomsOnCurrentFloor);
    if (Math.random() < merchantChance) {
      return generateMerchantRoom(floor);
    }
  }

  const size = rollSize();
  const roomType = pickRoomType(floor);
  const material = pickMaterial();
  const challengeCount = challengeCountForSize(size);
  const challenges = generateChallenges(roomType, challengeCount, floor);
  const name = generateRoomName(roomType);

  const template: RoomTemplate = {
    id: `room-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name,
    size,
    roomType,
    description: generateDescription(roomType, size),
    materials: [material],
    minFloor: 1,
    tags: [roomType, size],
    challengeCount,
    challengeThemes: challenges.map((c) => c.name),
  };

  let loot: ReturnType<typeof generateLoot> | null = null;
  let goldLoot: number | null = null;

  if (Math.random() < 0.25) {
    if (Math.random() < 0.5) {
      loot = generateLoot(floor);
    } else {
      goldLoot = randInt(1, 5) * floor;
    }
  }

  let enemies: EnemyInstance[] | undefined;
  const hasCombatOption = challenges.some((c) =>
    c.options.some((o) => o.triggersCombat),
  );
  if (hasCombatOption && playerEffectiveStats) {
    enemies = generateEnemies(floor, playerEffectiveStats, size);
  }

  return {
    instanceId: template.id,
    template,
    status: "entered",
    challenges,
    challengeResults: [],
    currentChallengeIndex: 0,
    loot,
    goldLoot,
    enemies,
  };
}

function generateKeyRoom(floor: number): RoomInstance {
  const template: RoomTemplate = {
    id: `key-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: "Key Chamber",
    size: "key",
    roomType: "shrine",
    description: "A small alcove holds a glowing key on a stone pedestal. It pulses with the energy of the Vantheon.",
    materials: [pickMaterial()],
    minFloor: 1,
    tags: ["key"],
    challengeCount: 0,
    challengeThemes: [],
  };

  return {
    instanceId: template.id,
    template,
    status: "entered",
    challenges: [],
    challengeResults: [],
    currentChallengeIndex: 0,
    loot: null,
    goldLoot: null,
  };
}

function generateDoorRoom(floor: number): RoomInstance {
  const template: RoomTemplate = {
    id: `door-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: "The Door",
    size: "door",
    roomType: "chamber",
    description: `A massive door stands before you, inscribed with the sigil of Floor ${floor + 1}. Your key resonates with its lock.`,
    materials: ["metal"],
    minFloor: 1,
    tags: ["door"],
    challengeCount: 0,
    challengeThemes: [],
  };

  return {
    instanceId: template.id,
    template,
    status: "entered",
    challenges: [],
    challengeResults: [],
    currentChallengeIndex: 0,
    loot: null,
    goldLoot: null,
  };
}

function generateMerchantRoom(floor: number): RoomInstance {
  const template: RoomTemplate = {
    id: `merchant-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: "Wandering Merchant",
    size: "merchant",
    roomType: "camp",
    description: "A hooded figure tends a makeshift stall, lantern light glinting off wares laid out on a threadbare cloth.",
    materials: [pickMaterial()],
    minFloor: 1,
    tags: ["merchant", "trade"],
    challengeCount: 0,
    challengeThemes: [],
  };

  const merchantItems = [
    generateLoot(floor),
    generateLoot(floor),
    generateLoot(floor),
  ];

  return {
    instanceId: template.id,
    template,
    status: "entered",
    challenges: [],
    challengeResults: [],
    currentChallengeIndex: 0,
    loot: null,
    goldLoot: null,
    merchantItems,
  };
}

export function initVantheonState(maxHP: number): VantheonState {
  return {
    currentFloor: 1,
    currentRoomIndex: 0,
    currentHP: maxHP,
    maxHP,
    floors: [],
    keyItems: [],
    hasKey: false,
    roomsSinceLastKey: 0,
    roomsExplored: 0,
    roomsAtLastLevelUp: 0,
    roomsOnCurrentFloor: 0,
    merchantVisitedThisFloor: false,
    events: [],
  };
}
