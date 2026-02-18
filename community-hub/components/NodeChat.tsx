"use client";

import { useState, useRef, useEffect } from "react";
import { FactionId, GridNode } from "@/data/factionData";

// ─── Types ──────────────────────────────────────────────────────────────────

type MessageFilter = "world" | "faction" | "node" | "friends";

export interface ChatMessage {
  id: string;
  username: string;
  factionId: FactionId;
  factionEmoji: string;
  content: string;
  timestamp: string;
  type: MessageFilter;
}

interface NodeChatProps {
  node?: GridNode;
  factionId: FactionId;
  factionName: string;
  factionEmoji: string;
  theme: { primary: string; secondary: string; gradientFrom: string; gradientTo: string };
  onReturn?: () => void;
  tickMessages?: ChatMessage[];
}

// ─── Fake User Data ─────────────────────────────────────────────────────────

const factionUsers: Record<FactionId, { name: string; emoji: string }[]> = {
  fire: [
    { name: "Hakan", emoji: "🔥" },
    { name: "Sere", emoji: "🔥" },
    { name: "Dax Kindler", emoji: "🔥" },
    { name: "Volara", emoji: "🔥" },
    { name: "Cael Ashburn", emoji: "🔥" },
    { name: "Jyn Ember", emoji: "🔥" },
    { name: "Torrin", emoji: "🔥" },
    { name: "Ruska Flint", emoji: "🔥" },
  ],
  earth: [
    { name: "Kael", emoji: "🏛️" },
    { name: "Mira Copperhand", emoji: "🏛️" },
    { name: "Aldric Stoneweave", emoji: "🏛️" },
    { name: "Brea Goldheart", emoji: "🏛️" },
    { name: "Felton", emoji: "🏛️" },
    { name: "Sula Merchant", emoji: "🏛️" },
    { name: "Orik Broadstone", emoji: "🏛️" },
    { name: "Nella", emoji: "🏛️" },
  ],
  water: [
    { name: "Dirge Gladstone", emoji: "🌊" },
    { name: "Lorinn Deepwatch", emoji: "🌊" },
    { name: "Corvatz", emoji: "🌊" },
    { name: "Shale Brine", emoji: "🌊" },
    { name: "Kai Stormbreak", emoji: "🌊" },
    { name: "Nessa Tidecaller", emoji: "🌊" },
    { name: "Rodge Floodgate", emoji: "🌊" },
    { name: "Yara Wavehand", emoji: "🌊" },
  ],
  wood: [
    { name: "Tori", emoji: "🌿" },
    { name: "Brenn Rootfield", emoji: "🌿" },
    { name: "Marda Greenshade", emoji: "🌿" },
    { name: "Olwen Seedkeeper", emoji: "🌿" },
    { name: "Fael Harrow", emoji: "🌿" },
    { name: "Linna Thornbrook", emoji: "🌿" },
    { name: "Garret Fieldhand", emoji: "🌿" },
    { name: "Pim", emoji: "🌿" },
  ],
  metal: [
    { name: "Ani Vildor", emoji: "⚗️" },
    { name: "Solen Brightlens", emoji: "⚗️" },
    { name: "Dr. Caro", emoji: "⚗️" },
    { name: "Fen Wirespark", emoji: "⚗️" },
    { name: "Tova Relay", emoji: "⚗️" },
    { name: "Kel Calibrate", emoji: "⚗️" },
    { name: "Rune Datastream", emoji: "⚗️" },
    { name: "Zara Ohmfield", emoji: "⚗️" },
  ],
};

const friendUsers: Record<FactionId, string[]> = {
  fire: ["Sere", "Jyn Ember", "Ruska Flint"],
  earth: ["Mira Copperhand", "Nella", "Felton"],
  water: ["Kai Stormbreak", "Nessa Tidecaller", "Rodge Floodgate"],
  wood: ["Brenn Rootfield", "Linna Thornbrook", "Pim"],
  metal: ["Solen Brightlens", "Fen Wirespark", "Tova Relay"],
};

// ─── Fake Message Templates ─────────────────────────────────────────────────

function generateTimestamp(minutesAgo: number): string {
  const d = new Date(Date.now() - minutesAgo * 60000);
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

const worldMessages: Record<FactionId, string[]> = {
  fire: [
    "Anyone else feel that tremor from the Deeps? Turbine 3 is rattling again.",
    "Power output is stable — good work tonight, everyone.",
    "The Ironlord's people are complaining about the heat vents near the Roots Market again.",
    "Bluecrest just called in — the Breakers need more power for the rotation tonight.",
    "Has anyone seen the latest Veil readings from Metal? The EM spike is unusual.",
    "Reminder: double shifts are optional this cycle, not mandatory. Talk to your foreman.",
    "Wood faction reported the irrigation pumps are running smooth. Nice to hear.",
    "Council session tomorrow — something about resource allocation. Stay tuned.",
  ],
  earth: [
    "Market traffic is heavier than usual today. Must be festival prep.",
    "The bakers on Third Street need more grain from Wood — supply running low.",
    "Anyone heading to the Cultural Center tonight? Live music from Terrace Row.",
    "Fire faction just increased power to the residential district. Finally warm enough.",
    "Council postponed the trade hearing by two days. Merchants aren't happy.",
    "Bluecrest is recruiting volunteers for wall-side cleanup after the last storm.",
    "The new artisan guild apprentices are showing real promise this cycle.",
    "Metal sent word: Terminal relay in the Roots district is back online.",
  ],
  water: [
    "Veil is calm tonight. Enjoy it while it lasts.",
    "Breaker Alpha rotation was clean — 3.9 minutes. Getting faster.",
    "Storm tracker shows a low-pressure system building to the north-northeast.",
    "Fire says they can boost power to Breaker hydraulics if we need it.",
    "Flood barriers on the southern access are deployed as a precaution.",
    "Metal's instruments are picking up something weird near the Obelisk. Typical.",
    "Wood's flood channels held during the last surge. Good coordination.",
    "Reminder: dive bay equipment check is mandatory before every shift.",
  ],
  wood: [
    "Harvest projections look strong this cycle. Quota is in sight.",
    "Eastern slope terraces are getting more rain than forecast. Watch the channels.",
    "Fire's irrigation pumps are running at 98% — no complaints here.",
    "The Flatland ranchers reported a fence breach near the western pastures.",
    "Grain storage is at 62% capacity. Comfortable for now.",
    "Bluecrest asked if we can divert extra food reserves for the wall crews.",
    "Metal is sending a tech to fix the monitoring station on the lower terraces.",
    "Council wants an updated harvest report by end of the cycle.",
  ],
  metal: [
    "Signal integrity across the network is holding at 99.2%. Good numbers.",
    "Relay node on the Flats is degrading again. Sending a crew tomorrow.",
    "The Obelisk readings are... unusual today. More analysis needed.",
    "Fire's power fluctuations are causing minor interference on the Deeps relay.",
    "Water faction needs the storm data feed prioritized — switching routing now.",
    "Lab A has an opening for the EM shielding experiment. Sign up if interested.",
    "New research paper from Dr. Caro on Veil pattern cycles. Recommended reading.",
    "Terminal network maintenance window: 0200-0400 tonight. Brief outages expected.",
  ],
};

const factionMessages: Record<FactionId, string[]> = {
  fire: [
    "Turbine 5 blade wear is at 28%. We should schedule replacement soon.",
    "Night shift report: all six generators running clean. Output at 9.4 GW.",
    "Coolant suits in bay 3 need inspection. Two had pressure seal warnings.",
    "Who's covering the morning rotation at Gen-04? I need a swap.",
    "Marshall Herman wants a full status update by dawn. Let's look sharp.",
    "Lava intake channel 2 lining is at 72%. Flagging for next maintenance window.",
    "Great work on the pressure valve replacement yesterday — zero downtime.",
    "New recruits start in the Deeps next cycle. Be patient with them.",
    "The exhaust scrubbers on Gen-01 are pulling overtime. Check the filters.",
    "Condensers running perfectly. Recovery rate hasn't dipped below 98% all week.",
  ],
  earth: [
    "Stall 47 in the Central Market is vacant — any vendors interested?",
    "The Weaver's Guild finished 200 bolts of fabric ahead of schedule. Impressive.",
    "Housing maintenance on Block C is complete. Residents can return.",
    "Festival planning committee meets at dusk in the Council Hall.",
    "Baker's union is requesting additional oven capacity. Space is tight.",
    "The comfort index dropped to 7.8 in the southern housing. Investigating.",
    "Trade ledger shows we're running a surplus on textiles. Good problem to have.",
    "Cultural Center needs volunteers for the storytelling circle tomorrow evening.",
    "New petition to expand the artisan quarter workshop space. Signatures needed.",
    "Market revenue hit a new high today. The economy is healthy.",
  ],
  water: [
    "Tower NE-1 reporting all clear. Veil activity minimal on the eastern approach.",
    "Dive team completed hull inspection on Breaker Beta. Patch needed on section 7.",
    "Guard rotation for the southern wall is set. Check the board for your slot.",
    "Storm response kit in Tower W-1 needs restocking. Adding to dispatch.",
    "Breaker Alpha hydraulics are running smooth after yesterday's maintenance.",
    "Deepwatch Lorinn wants all tower leads at 0600 for briefing.",
    "Veilfish sighting reported near fishing gate 2. Patrol dispatched.",
    "Emergency drill scheduled for third watch. Treat it like the real thing.",
    "New dive certifications posted. Congratulations to this cycle's graduates.",
    "Wall integrity check on the northwest section came back clean. Solid work.",
  ],
  wood: [
    "Upper terrace herb beds are thriving. Best growth we've seen in cycles.",
    "Flood channel 14 is partially blocked. Clearing crew headed out now.",
    "Livestock count from the eastern ranch: 847 head, all healthy.",
    "The mid-terrace irrigation valve near plot 78 is sticking. Need a repair tag.",
    "Harvest crew alpha finished the eastern plots ahead of schedule.",
    "Soil moisture sensors on the lower terraces are reading optimal. Good signs.",
    "Grain delivery to the Roots is on track for tomorrow morning.",
    "Rancher Jorik reports the western grazing rotation is proceeding well.",
    "We need three more hands on the flood channel clearing crew. Volunteers?",
    "Terrace Builder certification exam is open for registration. Study up.",
  ],
  metal: [
    "Lab A experiment 7 results are in. Promising data on EM frequency isolation.",
    "Relay node at the Breaker Alpha link needs a signal amplifier replacement.",
    "Obelisk Station reporting elevated anomaly levels for the third day running.",
    "Terminal hub latency spiked to 18ms during the power fluctuation. Logged.",
    "Calibration schedule for the Veil observatory instruments is posted.",
    "Research Console database updated with this cycle's storm pattern data.",
    "The fabrication queue is backed up. Priority items first — check the board.",
    "Student cohort 14 begins orientation in the Academy Hall tomorrow.",
    "Dr. Caro's lecture on electromagnetic mapping is at 1400 in the main hall.",
    "Signal routing to the Obelisk link has been optimized. Down to 55ms from 72ms.",
  ],
};

const friendMessages: Record<FactionId, string[]> = {
  fire: [
    "Hey, want to grab food after the shift? I'm starving.",
    "Did you see the new coolant suit designs? Way more comfortable.",
    "I covered your rotation last night — you owe me one! 😄",
    "Thinking about applying for the Thermtech exam next cycle. Advice?",
    "That sunset from the exhaust platform was incredible yesterday.",
    "Be careful near Gen-08 today. The readings looked off this morning.",
  ],
  earth: [
    "Save me a spot at the festival tonight? I'll be late finishing inventory.",
    "The new honey from the Bakery District is amazing. You need to try it.",
    "Council meeting was tense. I'll fill you in when I see you.",
    "Want to check out the new gallery in the Cultural Center this weekend?",
    "I'm thinking of switching from textiles to metalwork. Crazy, right?",
    "Nella said to tell you the housing paperwork is approved. Congratulations!",
  ],
  water: [
    "Night watch with you was fun. Same time next rotation?",
    "I found a calm spot by fishing gate 3. Perfect for breaks between patrols.",
    "Be careful out there tonight. The Veil looks angry.",
    "Rodge says he can get us spots on the next dive certification class.",
    "You were right about that current pattern. Your instincts are sharp.",
    "Mess hall has fish stew tonight. Race you there after the shift ends.",
  ],
  wood: [
    "The seedlings we planted last cycle are actually sprouting. Come see!",
    "Brenn found a wild herb patch above the upper terraces. Smells amazing.",
    "I'm making that mushroom bread recipe tonight. Stop by if you're free.",
    "Pim wants to know if you're joining the flood channel crew tomorrow.",
    "The view from the irrigation hub at sunset is worth the climb. Trust me.",
    "Linna said the terrace builder exam isn't as hard as people say. Let's do it.",
  ],
  metal: [
    "I think I found a new pattern in the Veil data. Can we talk?",
    "Solen invited us to the observatory tonight. Clear skies.",
    "The Academy library just got new volumes. Want to check them out?",
    "Fen built a miniature relay model. It's actually adorable.",
    "Coffee at the Terminal Hub after your shift? I have news.",
    "You should read Dr. Caro's latest. It references your thesis data.",
  ],
};

// ─── Node Chat Config ────────────────────────────────────────────────────────

const nodeChatLabels: Record<FactionId, string> = {
  fire: "Generator Chat",
  earth: "District Chat",
  water: "Post Chat",
  wood: "Terrace Chat",
  metal: "Relay Chat",
};

const nodeFilterEmojis: Record<FactionId, string> = {
  fire: "⚙️",
  earth: "🏪",
  water: "🛡️",
  wood: "🌾",
  metal: "📡",
};

const nodeMessageTemplates: Record<FactionId, string[]> = {
  fire: [
    "Status check on {NODE}: all readings nominal.",
    "{NODE} crew reporting in — turbine running clean this shift.",
    "Anyone at {NODE} noticed the slight vibration near the secondary housing?",
    "Coolant pressure at {NODE} holding steady at 2,100 PSI.",
    "{NODE} maintenance window starts at 0300. Plan accordingly.",
    "Great output from {NODE} today — 1.62 GW and climbing.",
    "Shift change at {NODE} in 45 minutes. Night crew, start prepping.",
    "Exhaust scrubbers at {NODE} are pulling overtime. Worth a look.",
    "{NODE} lava intake flow is smooth. No blockages this cycle.",
    "Safety briefing for all {NODE} crew at the start of next shift.",
  ],
  earth: [
    "Foot traffic near {NODE} is heavier than usual today.",
    "{NODE} vendor report: all stalls accounted for, revenue on target.",
    "Anyone at {NODE} hear about the new artisan apprentices starting?",
    "Maintenance crew heading to {NODE} for the water pipe repair.",
    "{NODE} is buzzing — must be the pre-festival rush.",
    "Lost item reported near {NODE}. Leather satchel with guild papers.",
    "Supply delivery to {NODE} arrived ahead of schedule. Nice work.",
    "Civic request filed for better lighting near {NODE}. Noted.",
    "{NODE} satisfaction survey results are in — 8.4 out of 10.",
    "Reminder: {NODE} district meeting at dusk in the main square.",
  ],
  water: [
    "{NODE} reporting all clear. Veil activity minimal.",
    "Watch rotation at {NODE} confirmed for third shift.",
    "Visibility from {NODE} is excellent tonight. Calm seas.",
    "Structural check at {NODE} came back clean. Solid work.",
    "{NODE} crew — storm kit has been restocked and ready.",
    "Minor current shift detected from {NODE} position. Logging it.",
    "Shift handoff at {NODE} went smooth. Good crew tonight.",
    "Signal from Metal's instruments at {NODE} is strong. No anomalies.",
    "{NODE} needs one more volunteer for the morning watch.",
    "Flood barrier near {NODE} deployed as a precaution.",
  ],
  wood: [
    "Crop check at {NODE}: everything looking healthy this morning.",
    "{NODE} soil moisture is optimal after last night's rain.",
    "Harvest crew at {NODE} finished ahead of schedule. Well done.",
    "Irrigation flow to {NODE} is running at full pressure.",
    "{NODE} flood channel is clear — no debris this cycle.",
    "Livestock near {NODE} all accounted for. Grazing rotation on track.",
    "New seedlings at {NODE} are showing strong growth. Promising.",
    "Weather report for {NODE} area: light rain expected tonight.",
    "{NODE} needs three more hands for the afternoon planting shift.",
    "Grain yield from {NODE} is tracking above quota. Good signs.",
  ],
  metal: [
    "Signal integrity at {NODE} is holding at 99.4%. Good numbers.",
    "{NODE} relay check complete. All frequencies nominal.",
    "Latency through {NODE} down to 11ms after the routing update.",
    "Calibration at {NODE} is due next cycle. Adding to the schedule.",
    "{NODE} picked up an unusual EM signature. Logging for analysis.",
    "Power fluctuation caused a brief spike at {NODE}. Stable now.",
    "Data throughput at {NODE} hit a new high this shift.",
    "Maintenance window for {NODE} tonight at 0200. Brief interruption expected.",
    "{NODE} hardware swap went clean. Signal restored in under 4 minutes.",
    "Researchers at {NODE} reporting elevated Veil activity. Monitoring.",
  ],
};

// ─── Message Generator ──────────────────────────────────────────────────────

function generateMessages(
  factionId: FactionId,
  nodeName?: string,
): ChatMessage[] {
  const msgs: ChatMessage[] = [];
  const allFactionIds: FactionId[] = ["fire", "earth", "water", "wood", "metal"];
  const friends = friendUsers[factionId];
  let minutesAgo = 2;

  // World messages — from various factions
  const wMsgs = worldMessages[factionId];
  for (let i = 0; i < wMsgs.length; i++) {
    const srcFaction = allFactionIds[i % allFactionIds.length];
    const users = factionUsers[srcFaction];
    const user = users[i % users.length];
    msgs.push({
      id: `w-${i}`,
      username: user.name,
      factionId: srcFaction,
      factionEmoji: user.emoji,
      content: wMsgs[i],
      timestamp: generateTimestamp(minutesAgo),
      type: "world",
    });
    minutesAgo += Math.floor(Math.random() * 5) + 2;
  }

  // Faction messages
  const fMsgs = factionMessages[factionId];
  minutesAgo = 1;
  for (let i = 0; i < fMsgs.length; i++) {
    const users = factionUsers[factionId];
    const user = users[i % users.length];
    msgs.push({
      id: `f-${i}`,
      username: user.name,
      factionId: factionId,
      factionEmoji: user.emoji,
      content: fMsgs[i],
      timestamp: generateTimestamp(minutesAgo),
      type: "faction",
    });
    minutesAgo += Math.floor(Math.random() * 6) + 3;
  }

  // Friend messages
  const frMsgs = friendMessages[factionId];
  minutesAgo = 3;
  for (let i = 0; i < frMsgs.length; i++) {
    const friendName = friends[i % friends.length];
    const user = factionUsers[factionId].find((u) => u.name === friendName) ?? {
      name: friendName,
      emoji: factionUsers[factionId][0].emoji,
    };
    msgs.push({
      id: `fr-${i}`,
      username: user.name,
      factionId: factionId,
      factionEmoji: user.emoji,
      content: frMsgs[i],
      timestamp: generateTimestamp(minutesAgo),
      type: "friends",
    });
    minutesAgo += Math.floor(Math.random() * 8) + 5;
  }

  // Node-specific messages (only when a node is specified)
  if (!nodeName) return msgs;
  const nTemplates = nodeMessageTemplates[factionId];
  const nodeSpecificMsgs = nTemplates.map((t) =>
    t.replace(/\{NODE\}/g, nodeName),
  );
  minutesAgo = 2;
  for (let i = 0; i < nodeSpecificMsgs.length; i++) {
    const users = factionUsers[factionId];
    const user = users[i % users.length];
    msgs.push({
      id: `n-${i}`,
      username: user.name,
      factionId: factionId,
      factionEmoji: user.emoji,
      content: nodeSpecificMsgs[i],
      timestamp: generateTimestamp(minutesAgo),
      type: "node",
    });
    minutesAgo += Math.floor(Math.random() * 6) + 3;
  }

  // Sort by timestamp (most recent first for display, we'll reverse for chat order)
  return msgs;
}

// ─── Tick Message Generator (exported for parent components) ────────────────

export function generateTickMessages(
  tick: number,
  factionId: FactionId,
  nodeName?: string,
): ChatMessage[] {
  const newMessages: ChatMessage[] = [];
  const allFactionIds: FactionId[] = ["fire", "earth", "water", "wood", "metal"];

  // World message
  const wMsgs = worldMessages[factionId];
  const wMsg = wMsgs[Math.floor(Math.random() * wMsgs.length)];
  const srcFaction = allFactionIds[Math.floor(Math.random() * allFactionIds.length)];
  const srcUsers = factionUsers[srcFaction];
  const srcUser = srcUsers[Math.floor(Math.random() * srcUsers.length)];
  newMessages.push({
    id: `tick-w-${tick}`,
    username: srcUser.name,
    factionId: srcFaction,
    factionEmoji: srcUser.emoji,
    content: wMsg,
    timestamp: generateTimestamp(0),
    type: "world",
  });

  // Faction message
  const fMsgs = factionMessages[factionId];
  const fMsg = fMsgs[Math.floor(Math.random() * fMsgs.length)];
  const fUsers = factionUsers[factionId];
  const fUser = fUsers[Math.floor(Math.random() * fUsers.length)];
  newMessages.push({
    id: `tick-f-${tick}`,
    username: fUser.name,
    factionId: factionId,
    factionEmoji: fUser.emoji,
    content: fMsg,
    timestamp: generateTimestamp(0),
    type: "faction",
  });

  // Node message (60% chance, only if a node is specified)
  if (nodeName && Math.random() > 0.4) {
    const nTemplates = nodeMessageTemplates[factionId];
    const nMsg = nTemplates[Math.floor(Math.random() * nTemplates.length)].replace(
      /\{NODE\}/g,
      nodeName,
    );
    const nUser = fUsers[Math.floor(Math.random() * fUsers.length)];
    newMessages.push({
      id: `tick-n-${tick}`,
      username: nUser.name,
      factionId: factionId,
      factionEmoji: nUser.emoji,
      content: nMsg,
      timestamp: generateTimestamp(0),
      type: "node",
    });
  }

  // Friend message (50% chance)
  if (Math.random() > 0.5) {
    const frMsgs = friendMessages[factionId];
    const frMsg = frMsgs[Math.floor(Math.random() * frMsgs.length)];
    const friends = friendUsers[factionId];
    const friendName = friends[Math.floor(Math.random() * friends.length)];
    const friendUser = factionUsers[factionId].find(
      (u) => u.name === friendName,
    ) ?? { name: friendName, emoji: factionUsers[factionId][0].emoji };
    newMessages.push({
      id: `tick-fr-${tick}`,
      username: friendUser.name,
      factionId: factionId,
      factionEmoji: friendUser.emoji,
      content: frMsg,
      timestamp: generateTimestamp(0),
      type: "friends",
    });
  }

  return newMessages;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function NodeChat({
  node,
  factionId,
  factionName,
  factionEmoji,
  theme,
  onReturn,
  tickMessages = [],
}: NodeChatProps) {
  const isWorldMode = !node;
  const [filter, setFilter] = useState<MessageFilter>(isWorldMode ? "world" : "node");
  const [inputValue, setInputValue] = useState("");
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Generate seed messages once on mount
  const [messages] = useState(() => generateMessages(factionId, node?.name));

  const filteredMessages = [...messages, ...tickMessages, ...localMessages]
    .filter((m) => filter === "world" ? true : m.type === filter)
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  // Scroll to bottom when messages change or filter changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [filteredMessages.length, filter]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const newMsg: ChatMessage = {
      id: `local-${Date.now()}`,
      username: "You",
      factionId: factionId,
      factionEmoji: factionEmoji,
      content: inputValue.trim(),
      timestamp: generateTimestamp(0),
      type: filter === "world" ? "world" : filter === "friends" ? "friends" : filter === "node" ? "node" : "faction",
    };
    setLocalMessages((prev) => [...prev, newMsg]);
    setInputValue("");
  };

  const nodeChatLabel = nodeChatLabels[factionId];
  const nodeEmoji = nodeFilterEmojis[factionId];

  const filters: { key: MessageFilter; label: string; icon: string }[] = [
    { key: "world", label: "All World", icon: "🌍" },
    { key: "faction", label: `${factionName}`, icon: factionEmoji },
    ...(node ? [{ key: "node" as MessageFilter, label: nodeChatLabel, icon: nodeEmoji }] : []),
    { key: "friends", label: "Friends", icon: "👥" },
  ];

  return (
    <div className="animate-fade-in-up">
      {/* Chat Header */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg text-sm"
              style={{ background: `${theme.primary}20` }}
            >
              💬
            </div>
            <div>
              <h3 className="text-sm font-bold">
                {node ? node.name : "World"}{" "}
                <span className="font-normal text-muted">— Channel</span>
              </h3>
              <div className="flex items-center gap-1.5">
                <span
                  className="h-1.5 w-1.5 rounded-full animate-pulse"
                  style={{ background: theme.primary }}
                />
                <span className="text-[10px] text-muted">
                  {node ? `${node.assignedUsers} members online` : "All factions online"}
                </span>
              </div>
            </div>
          </div>

          {/* Return Button (only when viewing a node) */}
          {node && onReturn && (
            <button
              onClick={onReturn}
              className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted transition-all duration-200 hover:border-accent-primary hover:text-foreground hover:bg-surface-hover"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Return
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 px-4 py-2.5 border-b border-border bg-background/30">
          {filters.map((f) => {
            const isActive = filter === f.key;
            const allMsgs = [...messages, ...tickMessages, ...localMessages];
            const count =
              f.key === "world"
                ? allMsgs.length
                : allMsgs.filter(
                    (m) => m.type === f.key,
                  ).length;

            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200"
                style={{
                  background: isActive ? `${theme.primary}18` : "transparent",
                  color: isActive ? theme.primary : "var(--color-muted)",
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderColor: isActive ? `${theme.primary}40` : "transparent",
                }}
              >
                <span className="text-[11px]">{f.icon}</span>
                {f.label}
                <span
                  className="ml-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold"
                  style={{
                    background: isActive
                      ? `${theme.primary}25`
                      : "var(--color-border)",
                    color: isActive ? theme.primary : "var(--color-muted)",
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Message Area */}
        <div
          ref={chatContainerRef}
          className="flex flex-col gap-1 overflow-y-auto px-4 py-3"
          style={{ maxHeight: "420px", minHeight: "280px" }}
        >
          {/* Channel intro */}
          <div className="mb-3 text-center">
            <div
              className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl text-lg"
              style={{ background: `${theme.primary}15` }}
            >
              💬
            </div>
            <p className="text-xs font-semibold">
              {node ? node.name : "World"} —{" "}
              {filter === "world"
                ? "World Channel"
                : filter === "faction"
                  ? `${factionName} Channel`
                  : filter === "node"
                    ? `${node?.name ?? ""} Channel`
                    : "Friends Channel"}
            </p>
            <p className="mt-1 text-[10px] text-muted">
              {filter === "world"
                ? "Messages from all factions across the island"
                : filter === "faction"
                  ? `Private channel for ${factionName} faction members`
                  : filter === "node"
                    ? `Messages specific to ${node?.name ?? ""} operations and crew`
                    : "Messages from your friends list"}
            </p>
          </div>

          {filteredMessages.map((msg) => {
            const isYou = msg.username === "You";
            return (
              <div
                key={msg.id}
                className="group flex gap-2.5 rounded-lg px-2 py-2 transition-colors duration-150 hover:bg-surface/60"
              >
                {/* Avatar */}
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs"
                  style={{
                    background: isYou
                      ? `${theme.primary}25`
                      : `${theme.primary}10`,
                    border: isYou
                      ? `1.5px solid ${theme.primary}60`
                      : "1px solid var(--color-border)",
                  }}
                >
                  {msg.factionEmoji}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-bold"
                      style={{ color: isYou ? theme.primary : "var(--color-foreground)" }}
                    >
                      {msg.username}
                    </span>
                    {filter === "world" && !isYou && (
                      <span
                        className="rounded px-1 py-0.5 text-[8px] font-bold uppercase tracking-wider"
                        style={{
                          background: `${theme.primary}10`,
                          color: "var(--color-muted)",
                        }}
                      >
                        {msg.factionId}
                      </span>
                    )}
                    {msg.type === "friends" && !isYou && (
                      <span className="text-[9px] text-muted">★ friend</span>
                    )}
                    <span className="ml-auto text-[10px] text-muted opacity-0 transition-opacity group-hover:opacity-100">
                      {msg.timestamp}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs leading-relaxed text-foreground/85">
                    {msg.content}
                  </p>
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-border px-4 py-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={`Message ${node ? node.name : "world"} ${filter === "world" ? "world" : filter === "faction" ? factionName : filter === "node" ? (node?.name ?? "") : "friends"} channel...`}
              className="flex-1 rounded-lg border border-border bg-background/60 px-3 py-2 text-xs text-foreground placeholder:text-muted/60 outline-none transition-colors duration-200 focus:border-accent-primary"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold text-background transition-all duration-200 disabled:opacity-30"
              style={{
                background: `linear-gradient(135deg, ${theme.gradientFrom}, ${theme.gradientTo})`,
              }}
            >
              Send
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
