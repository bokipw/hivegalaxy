// ============================================================
// HIVE GALAXY — data/ships.js
// Svi brodovi s pravim statistikama i RARITY poljem
// Rarity: C (Common), R (Rare), E (Epic), L (Legendary)
// ============================================================

// ── TIPOVI OKLOPA ──
const ARMOR_TYPES = {
  Nano:         { name: 'Nano',         color: '#00aaff' },
  Neutralizing: { name: 'Neutralizing', color: '#44ff88' },
  Chrome:       { name: 'Chrome',       color: '#aaaaff' },
  Regen:        { name: 'Regen',        color: '#ffaa00' },
  Light:        { name: 'Light',        color: '#ffffff' },
};

// ── OKLOP OTPORNOSTI (% primljene štete) ──
const ARMOR_RESISTANCE = {
  Nano:         { Kinetic: 100, Heat: 75,  Magnetic: 150, Explosive: 50  },
  Chrome:       { Kinetic: 75,  Heat: 50,  Magnetic: 100, Explosive: 150 },
  Neutralizing: { Kinetic: 150, Heat: 100, Magnetic: 50,  Explosive: 75  },
  Regen:        { Kinetic: 50,  Heat: 150, Magnetic: 75,  Explosive: 100 },
  Light:        { Kinetic: 10,  Heat: 10,  Magnetic: 10,  Explosive: 10  },
};

// ── KLASE BRODOVA ──
const SHIP_CLASSES = {
  scout: {
    id:       'scout',
    name:     'Izviđač',
    icon:     '🛸',
    color:    '#00e5ff',
    slots: { weapon: 2, shield: 1, engine: 1, recon: 1, special: 0 },
    classBonus: { good: 'fighter', bad: 'carrier' },
    atkBonus: 0.30, defBonus: 0.20,
    specials: ['Detection +50%', '+1% Crit', 'Movement 1'],
    desc: 'Brz i nevidljiv. Idealan za izviđanje i kontru Lovaca.',
  },
  fighter: {
    id:       'fighter',
    name:     'Lovac',
    icon:     '⚔️',
    color:    '#ff4444',
    slots: { weapon: 3, shield: 2, engine: 1, recon: 0, special: 0 },
    classBonus: { good: 'scout', bad: 'cruiser' },
    atkBonus: 0.25, defBonus: 0.15,
    specials: ['+1% Crit', 'Intercept', 'Agility +15%'],
    desc: 'Svestran borbeni brod. Idealan kao osnova svake flote.',
  },
  cruiser: {
    id:       'cruiser',
    name:     'Krstarica',
    icon:     '🛡️',
    color:    '#00ff88',
    slots: { weapon: 3, shield: 3, engine: 1, recon: 0, special: 0 },
    classBonus: { good: 'fighter', bad: 'battleship' },
    atkBonus: 0.20, defBonus: 0.30,
    specials: ['Cover Fire', 'Shield +30%', 'He3 skladište'],
    desc: 'Teška odbrana. Štiti manje brodove u floti.',
  },
  battleship: {
    id:       'battleship',
    name:     'Bojni Brod',
    icon:     '💥',
    color:    '#ffaa00',
    slots: { weapon: 4, shield: 3, engine: 1, recon: 0, special: 1 },
    classBonus: { good: 'cruiser', bad: 'scout' },
    atkBonus: 0.35, defBonus: 0.15,
    specials: ['Barrage', 'Armor +15%', 'Max slotovi'],
    desc: 'Maksimalna vatrena moć. Spor ali devastirajući.',
  },
  carrier: {
    id:       'carrier',
    name:     'Nosač',
    icon:     '🌌',
    color:    '#9933ff',
    slots: { weapon: 2, shield: 3, engine: 1, recon: 0, special: 1 },
    classBonus: { good: 'battleship', bad: 'fighter' },
    atkBonus: 0.25, defBonus: 0.20,
    specials: ['Launch Fighters', 'HP +20%', 'Može nositi 1-3 broda'],
    desc: 'Strateški brod. Lansira fighter eskadrone u borbu.',
  },
  special: {
    id:       'special',
    name:     'Flagship',
    icon:     '👑',
    color:    '#ffcc33',
    slots: { weapon: 'unique', shield: 'unique', engine: 1, recon: 0, special: 2 },
    classBonus: { good: 'all', bad: 'none' },
    atkBonus: 0.15, defBonus: 0.0,
    specials: ['Fleet Command', '+100 Effective Stack', 'Unikatne sposobnosti'],
    desc: 'Komandni brod flote. Daje bonus svim brodovima.',
  },
};

// ═══════════════════════════════════════════════════════════
// 🛸 IZVIĐAČI (scout)
// ═══════════════════════════════════════════════════════════
const SCOUTS = [
  // Swift I-III (prosečan, standardni izviđač)
  { id:'scout_Swift_I',     name:'Swift I',     rarity:'C', armor:'Nano',         armor_val:200, shield:600,  structure:80,  slots:2, agility:22, stability:18, movement:2, source:'Instanca 1'  },
  { id:'scout_Swift_II',    name:'Swift II',    rarity:'R', armor:'Nano',         armor_val:228, shield:688,  structure:128, slots:3, agility:25, stability:20, movement:2, source:'Instanca 11' },
  { id:'scout_Swift_III',   name:'Swift III',   rarity:'E', armor:'Nano',         armor_val:270, shield:810,  structure:170, slots:3, agility:30, stability:24, movement:2, source:'Instanca 23' },

  // Phantom (stealth specijalista) — III je Legendary
  { id:'scout_Phantom_I',   name:'Phantom I',   rarity:'C', armor:'Neutralizing', armor_val:220, shield:660,  structure:90,  slots:2, agility:20, stability:16, movement:2, source:'Instanca 1'  },
  { id:'scout_Phantom_II',  name:'Phantom II',  rarity:'E', armor:'Neutralizing', armor_val:252, shield:756,  structure:144, slots:3, agility:23, stability:18, movement:2, source:'Instanca 11' },
  { id:'scout_Phantom_III', name:'Phantom III', rarity:'L', armor:'Neutralizing', armor_val:297, shield:891,  structure:190, slots:3, agility:28, stability:22, movement:3, source:'Instanca 23' },

  // Stinger (brzi napadač)
  { id:'scout_Stinger_I',   name:'Stinger I',   rarity:'C', armor:'Nano',         armor_val:210, shield:630,  structure:85,  slots:2, agility:21, stability:17, movement:2, source:'Instanca 2'  },
  { id:'scout_Stinger_II',  name:'Stinger II',  rarity:'R', armor:'Nano',         armor_val:240, shield:720,  structure:136, slots:3, agility:24, stability:19, movement:2, source:'Instanca 11' },
  { id:'scout_Stinger_III', name:'Stinger III', rarity:'E', armor:'Nano',         armor_val:283, shield:849,  structure:180, slots:3, agility:29, stability:23, movement:2, source:'Instanca 23' },

  // Razor (kritični udarač)
  { id:'scout_Razor_I',     name:'Razor I',     rarity:'R', armor:'Neutralizing', armor_val:230, shield:690,  structure:95,  slots:2, agility:19, stability:15, movement:2, source:'Instanca 2'  },
  { id:'scout_Razor_II',    name:'Razor II',    rarity:'E', armor:'Neutralizing', armor_val:263, shield:789,  structure:152, slots:3, agility:22, stability:17, movement:2, source:'Instanca 12' },
  { id:'scout_Razor_III',   name:'Razor III',   rarity:'L', armor:'Neutralizing', armor_val:310, shield:930,  structure:200, slots:3, agility:27, stability:21, movement:3, source:'Instanca 24' },

  // Wisp (energetski)
  { id:'scout_Wisp_I',      name:'Wisp I',      rarity:'C', armor:'Nano',         armor_val:215, shield:645,  structure:88,  slots:2, agility:23, stability:19, movement:2, source:'Instanca 3'  },
  { id:'scout_Wisp_II',     name:'Wisp II',     rarity:'R', armor:'Nano',         armor_val:246, shield:738,  structure:140, slots:3, agility:26, stability:21, movement:2, source:'Instanca 12' },
  { id:'scout_Wisp_III',    name:'Wisp III',    rarity:'E', armor:'Nano',         armor_val:290, shield:870,  structure:186, slots:3, agility:31, stability:25, movement:2, source:'Instanca 25' },

  // Glimmer (podrška)
  { id:'scout_Glimmer_I',   name:'Glimmer I',   rarity:'C', armor:'Neutralizing', armor_val:225, shield:675,  structure:92,  slots:2, agility:20, stability:16, movement:2, source:'Instanca 3'  },
  { id:'scout_Glimmer_II',  name:'Glimmer II',  rarity:'R', armor:'Neutralizing', armor_val:257, shield:771,  structure:147, slots:3, agility:23, stability:18, movement:2, source:'Instanca 12' },
  { id:'scout_Glimmer_III', name:'Glimmer III', rarity:'E', armor:'Neutralizing', armor_val:303, shield:909,  structure:195, slots:3, agility:28, stability:22, movement:2, source:'Instanca 26' },

  // Shadow (nevidljivi ubica) — Legendary na III
  { id:'scout_Shadow_I',    name:'Shadow I',    rarity:'R', armor:'Nano',         armor_val:235, shield:705,  structure:97,  slots:2, agility:22, stability:18, movement:2, source:'Instanca 4'  },
  { id:'scout_Shadow_II',   name:'Shadow II',   rarity:'E', armor:'Nano',         armor_val:269, shield:807,  structure:155, slots:3, agility:25, stability:20, movement:2, source:'Instanca 13' },
  { id:'scout_Shadow_III',  name:'Shadow III',  rarity:'L', armor:'Nano',         armor_val:317, shield:951,  structure:205, slots:3, agility:30, stability:24, movement:3, source:'Instanca 27' },

  // Viper (otrovni)
  { id:'scout_Viper_I',     name:'Viper I',     rarity:'C', armor:'Neutralizing', armor_val:240, shield:720,  structure:100, slots:2, agility:21, stability:17, movement:2, source:'Instanca 4'  },
  { id:'scout_Viper_II',    name:'Viper II',    rarity:'R', armor:'Neutralizing', armor_val:274, shield:822,  structure:160, slots:3, agility:24, stability:19, movement:2, source:'Instanca 13' },
  { id:'scout_Viper_III',   name:'Viper III',   rarity:'E', armor:'Neutralizing', armor_val:323, shield:969,  structure:212, slots:3, agility:29, stability:23, movement:2, source:'Instanca 28' },

  // Specter (duh)
  { id:'scout_Specter_I',   name:'Specter I',   rarity:'C', armor:'Nano',         armor_val:245, shield:735,  structure:102, slots:2, agility:24, stability:20, movement:2, source:'Instanca 5'  },
  { id:'scout_Specter_II',  name:'Specter II',  rarity:'E', armor:'Nano',         armor_val:280, shield:840,  structure:163, slots:3, agility:27, stability:22, movement:2, source:'Instanca 14' },
  { id:'scout_Specter_III', name:'Specter III', rarity:'L', armor:'Nano',         armor_val:330, shield:990,  structure:216, slots:3, agility:32, stability:26, movement:3, source:'Instanca 29' },

  // Phantom-X (eksperimentalni)
  { id:'scout_PhantomX_I',  name:'Phantom-X I', rarity:'R', armor:'Neutralizing', armor_val:260, shield:780,  structure:110, slots:3, agility:22, stability:18, movement:2, source:'Instanca 5'  },
  { id:'scout_PhantomX_II', name:'Phantom-X II',rarity:'E', armor:'Neutralizing', armor_val:297, shield:891,  structure:176, slots:3, agility:25, stability:20, movement:2, source:'Instanca 15' },
  { id:'scout_PhantomX_III',name:'Phantom-X III',rarity:'L', armor:'Neutralizing', armor_val:350, shield:1050, structure:233, slots:4, agility:30, stability:24, movement:4, source:'Instanca 30' },
];

// ═══════════════════════════════════════════════════════════
// ⚔️ LOVCI (fighter)
// ═══════════════════════════════════════════════════════════
const FIGHTERS = [
  { id:'fighter_Fury_I',        name:'Fury I',        rarity:'C', armor:'Nano',         armor_val:300, shield:850,  structure:120, slots:3, agility:18, stability:15, movement:1, source:'Instanca 6'  },
  { id:'fighter_Fury_II',       name:'Fury II',       rarity:'R', armor:'Nano',         armor_val:342, shield:972,  structure:192, slots:4, agility:21, stability:17, movement:1, source:'Instanca 14' },
  { id:'fighter_Fury_III',      name:'Fury III',      rarity:'E', armor:'Nano',         armor_val:403, shield:1145, structure:255, slots:4, agility:25, stability:20, movement:1, source:'Instanca 25' },

  { id:'fighter_Talon_I',       name:'Talon I',       rarity:'C', armor:'Neutralizing', armor_val:320, shield:910,  structure:130, slots:3, agility:17, stability:14, movement:1, source:'Instanca 6'  },
  { id:'fighter_Talon_II',      name:'Talon II',      rarity:'R', armor:'Neutralizing', armor_val:365, shield:1040, structure:208, slots:4, agility:20, stability:16, movement:1, source:'Instanca 14' },
  { id:'fighter_Talon_III',     name:'Talon III',     rarity:'E', armor:'Neutralizing', armor_val:430, shield:1225, structure:276, slots:4, agility:24, stability:19, movement:1, source:'Instanca 26' },

  { id:'fighter_Reaper_I',      name:'Reaper I',      rarity:'C', armor:'Nano',         armor_val:310, shield:880,  structure:125, slots:3, agility:19, stability:16, movement:1, source:'Instanca 7'  },
  { id:'fighter_Reaper_II',     name:'Reaper II',     rarity:'R', armor:'Nano',         armor_val:354, shield:1006, structure:200, slots:4, agility:22, stability:18, movement:1, source:'Instanca 15' },
  { id:'fighter_Reaper_III',    name:'Reaper III',    rarity:'E', armor:'Nano',         armor_val:417, shield:1185, structure:266, slots:4, agility:26, stability:21, movement:1, source:'Instanca 26' },

  { id:'fighter_Striker_I',     name:'Striker I',     rarity:'R', armor:'Neutralizing', armor_val:330, shield:940,  structure:135, slots:3, agility:16, stability:13, movement:1, source:'Instanca 7'  },
  { id:'fighter_Striker_II',    name:'Striker II',    rarity:'E', armor:'Neutralizing', armor_val:377, shield:1074, structure:216, slots:4, agility:19, stability:15, movement:1, source:'Instanca 15' },
  { id:'fighter_Striker_III',   name:'Striker III',   rarity:'L', armor:'Neutralizing', armor_val:444, shield:1265, structure:287, slots:5, agility:23, stability:18, movement:1, source:'Instanca 26' },

  { id:'fighter_Vengeance_I',   name:'Vengeance I',   rarity:'C', armor:'Nano',         armor_val:340, shield:970,  structure:138, slots:3, agility:18, stability:15, movement:1, source:'Instanca 8'  },
  { id:'fighter_Vengeance_II',  name:'Vengeance II',  rarity:'R', armor:'Nano',         armor_val:388, shield:1108, structure:221, slots:4, agility:21, stability:17, movement:1, source:'Instanca 15' },
  { id:'fighter_Vengeance_III', name:'Vengeance III', rarity:'E', armor:'Nano',         armor_val:457, shield:1305, structure:293, slots:5, agility:25, stability:20, movement:1, source:'Instanca 26' },

  { id:'fighter_Tempest_I',     name:'Tempest I',     rarity:'R', armor:'Neutralizing', armor_val:350, shield:1000, structure:142, slots:3, agility:17, stability:14, movement:1, source:'Instanca 8'  },
  { id:'fighter_Tempest_II',    name:'Tempest II',    rarity:'E', armor:'Neutralizing', armor_val:399, shield:1140, structure:227, slots:4, agility:20, stability:16, movement:1, source:'Instanca 16' },
  { id:'fighter_Tempest_III',   name:'Tempest III',   rarity:'L', armor:'Neutralizing', armor_val:470, shield:1342, structure:301, slots:5, agility:24, stability:19, movement:1, source:'Instanca 26' },

  { id:'fighter_Outlaw_I',      name:'Outlaw I',      rarity:'C', armor:'Nano',         armor_val:360, shield:1025, structure:146, slots:3, agility:20, stability:17, movement:1, source:'Instanca 9'  },
  { id:'fighter_Outlaw_II',     name:'Outlaw II',     rarity:'R', armor:'Nano',         armor_val:411, shield:1170, structure:234, slots:4, agility:23, stability:19, movement:1, source:'Instanca 16' },
  { id:'fighter_Outlaw_III',    name:'Outlaw III',    rarity:'E', armor:'Nano',         armor_val:484, shield:1378, structure:310, slots:5, agility:27, stability:22, movement:1, source:'Instanca 27' },

  { id:'fighter_Ravager_I',     name:'Ravager I',     rarity:'C', armor:'Neutralizing', armor_val:370, shield:1055, structure:150, slots:4, agility:16, stability:13, movement:1, source:'Instanca 9'  },
  { id:'fighter_Ravager_II',    name:'Ravager II',    rarity:'R', armor:'Neutralizing', armor_val:422, shield:1203, structure:240, slots:5, agility:19, stability:15, movement:1, source:'Instanca 16' },
  { id:'fighter_Ravager_III',   name:'Ravager III',   rarity:'E', armor:'Neutralizing', armor_val:497, shield:1416, structure:318, slots:6, agility:23, stability:18, movement:1, source:'Instanca 28' },

  { id:'fighter_Corsair_I',     name:'Corsair I',     rarity:'R', armor:'Nano',         armor_val:380, shield:1080, structure:154, slots:4, agility:19, stability:16, movement:1, source:'Instanca 10' },
  { id:'fighter_Corsair_II',    name:'Corsair II',    rarity:'E', armor:'Nano',         armor_val:433, shield:1232, structure:246, slots:5, agility:22, stability:18, movement:1, source:'Instanca 16' },
  { id:'fighter_Corsair_III',   name:'Corsair III',   rarity:'L', armor:'Nano',         armor_val:511, shield:1455, structure:326, slots:6, agility:26, stability:21, movement:1, source:'Instanca 29' },

  { id:'fighter_Nemesis_I',     name:'Nemesis I',     rarity:'R', armor:'Neutralizing', armor_val:404, shield:1155, structure:160, slots:4, agility:18, stability:15, movement:1, source:'Instanca 10' },
  { id:'fighter_Nemesis_II',    name:'Nemesis II',    rarity:'E', armor:'Neutralizing', armor_val:461, shield:1320, structure:256, slots:5, agility:21, stability:17, movement:1, source:'Instanca 16' },
  { id:'fighter_Nemesis_III',   name:'Nemesis III',   rarity:'L', armor:'Neutralizing', armor_val:543, shield:1540, structure:340, slots:6, agility:25, stability:20, movement:1, source:'Instanca 30' },
];

// ═══════════════════════════════════════════════════════════
// 🛡️ KRSTARICE (cruiser)
// ═══════════════════════════════════════════════════════════
const CRUISERS = [
  { id:'cruiser_Defender_I',    name:'Defender I',    rarity:'C', armor:'Chrome',  armor_val:600,  shield:1800, structure:280,  slots:4, agility:10, stability:22, movement:1, source:'Instanca 17' },
  { id:'cruiser_Defender_II',   name:'Defender II',   rarity:'R', armor:'Chrome',  armor_val:685,  shield:2055, structure:448,  slots:5, agility:11, stability:25, movement:1, source:'Instanca 27' },
  { id:'cruiser_Defender_III',  name:'Defender III',  rarity:'E', armor:'Chrome',  armor_val:807,  shield:2423, structure:595,  slots:6, agility:13, stability:29, movement:1, source:'Restricted 1'},

  { id:'cruiser_Guardian_I',    name:'Guardian I',    rarity:'C', armor:'Regen',   armor_val:580,  shield:1740, structure:270,  slots:4, agility:9,  stability:24, movement:1, source:'Instanca 17' },
  { id:'cruiser_Guardian_II',   name:'Guardian II',   rarity:'R', armor:'Regen',   armor_val:662,  shield:1986, structure:432,  slots:5, agility:10, stability:27, movement:1, source:'Instanca 27' },
  { id:'cruiser_Guardian_III',  name:'Guardian III',  rarity:'E', armor:'Regen',   armor_val:780,  shield:2340, structure:573,  slots:6, agility:12, stability:31, movement:1, source:'Restricted 1'},

  { id:'cruiser_Sentinel_I',    name:'Sentinel I',    rarity:'R', armor:'Chrome',  armor_val:620,  shield:1860, structure:290,  slots:4, agility:10, stability:21, movement:1, source:'Instanca 18' },
  { id:'cruiser_Sentinel_II',   name:'Sentinel II',   rarity:'E', armor:'Chrome',  armor_val:708,  shield:2124, structure:464,  slots:5, agility:11, stability:24, movement:1, source:'Instanca 27' },
  { id:'cruiser_Sentinel_III',  name:'Sentinel III',  rarity:'L', armor:'Chrome',  armor_val:835,  shield:2505, structure:616,  slots:6, agility:13, stability:28, movement:1, source:'Restricted 2'},

  { id:'cruiser_Bulwark_I',     name:'Bulwark I',     rarity:'C', armor:'Regen',   armor_val:640,  shield:1920, structure:300,  slots:5, agility:8,  stability:25, movement:1, source:'Instanca 18' },
  { id:'cruiser_Bulwark_II',    name:'Bulwark II',    rarity:'R', armor:'Regen',   armor_val:730,  shield:2190, structure:480,  slots:6, agility:9,  stability:28, movement:1, source:'Instanca 28' },
  { id:'cruiser_Bulwark_III',   name:'Bulwark III',   rarity:'E', armor:'Regen',   armor_val:860,  shield:2580, structure:637,  slots:7, agility:11, stability:32, movement:1, source:'Restricted 2'},

  { id:'cruiser_Citadel_I',     name:'Citadel I',     rarity:'R', armor:'Chrome',  armor_val:660,  shield:1980, structure:310,  slots:5, agility:9,  stability:23, movement:1, source:'Instanca 19' },
  { id:'cruiser_Citadel_II',    name:'Citadel II',    rarity:'E', armor:'Chrome',  armor_val:753,  shield:2259, structure:496,  slots:6, agility:10, stability:26, movement:1, source:'Instanca 28' },
  { id:'cruiser_Citadel_III',   name:'Citadel III',   rarity:'L', armor:'Chrome',  armor_val:888,  shield:2664, structure:659,  slots:7, agility:12, stability:30, movement:1, source:'Restricted 3'},

  { id:'cruiser_Rampart_I',     name:'Rampart I',     rarity:'C', armor:'Regen',   armor_val:670,  shield:2010, structure:315,  slots:5, agility:8,  stability:26, movement:1, source:'Instanca 19' },
  { id:'cruiser_Rampart_II',    name:'Rampart II',    rarity:'R', armor:'Regen',   armor_val:764,  shield:2292, structure:504,  slots:6, agility:9,  stability:29, movement:1, source:'Instanca 28' },
  { id:'cruiser_Rampart_III',   name:'Rampart III',   rarity:'E', armor:'Regen',   armor_val:900,  shield:2700, structure:670,  slots:7, agility:11, stability:33, movement:1, source:'Restricted 3'},

  { id:'cruiser_Paladin_I',     name:'Paladin I',     rarity:'C', armor:'Chrome',  armor_val:680,  shield:2040, structure:320,  slots:5, agility:9,  stability:22, movement:1, source:'Instanca 20' },
  { id:'cruiser_Paladin_II',    name:'Paladin II',    rarity:'R', armor:'Chrome',  armor_val:775,  shield:2325, structure:512,  slots:6, agility:10, stability:25, movement:1, source:'Instanca 28' },
  { id:'cruiser_Paladin_III',   name:'Paladin III',   rarity:'E', armor:'Chrome',  armor_val:914,  shield:2742, structure:680,  slots:7, agility:12, stability:29, movement:1, source:'Restricted 3'},

  { id:'cruiser_Protector_I',   name:'Protector I',   rarity:'R', armor:'Regen',   armor_val:700,  shield:2100, structure:330,  slots:5, agility:8,  stability:27, movement:1, source:'Instanca 20' },
  { id:'cruiser_Protector_II',  name:'Protector II',  rarity:'E', armor:'Regen',   armor_val:798,  shield:2394, structure:528,  slots:6, agility:9,  stability:30, movement:1, source:'Instanca 28' },
  { id:'cruiser_Protector_III', name:'Protector III', rarity:'L', armor:'Regen',   armor_val:940,  shield:2820, structure:702,  slots:7, agility:11, stability:34, movement:1, source:'Restricted 4'},

  { id:'cruiser_Shield_I',      name:'Shield I',      rarity:'C', armor:'Chrome',  armor_val:720,  shield:2160, structure:340,  slots:5, agility:8,  stability:24, movement:1, source:'Instanca 21' },
  { id:'cruiser_Shield_II',     name:'Shield II',     rarity:'R', armor:'Chrome',  armor_val:821,  shield:2463, structure:544,  slots:6, agility:9,  stability:27, movement:1, source:'Instanca 28' },
  { id:'cruiser_Shield_III',    name:'Shield III',    rarity:'E', armor:'Chrome',  armor_val:968,  shield:2904, structure:723,  slots:8, agility:11, stability:31, movement:1, source:'Restricted 4'},

  { id:'cruiser_Bastion_I',     name:'Bastion I',     rarity:'C', armor:'Regen',   armor_val:740,  shield:2220, structure:350,  slots:6, agility:7,  stability:28, movement:1, source:'Instanca 21' },
  { id:'cruiser_Bastion_II',    name:'Bastion II',    rarity:'R', armor:'Regen',   armor_val:844,  shield:2532, structure:560,  slots:7, agility:8,  stability:31, movement:1, source:'Instanca 28' },
  { id:'cruiser_Bastion_III',   name:'Bastion III',   rarity:'E', armor:'Regen',   armor_val:995,  shield:2985, structure:744,  slots:8, agility:10, stability:35, movement:1, source:'Restricted 4'},

  { id:'cruiser_Haven_I',       name:'Haven I',       rarity:'R', armor:'Chrome',  armor_val:760,  shield:2280, structure:360,  slots:6, agility:8,  stability:25, movement:1, source:'Instanca 22' },
  { id:'cruiser_Haven_II',      name:'Haven II',      rarity:'E', armor:'Chrome',  armor_val:867,  shield:2601, structure:576,  slots:7, agility:9,  stability:28, movement:1, source:'Instanca 28' },
  { id:'cruiser_Haven_III',     name:'Haven III',     rarity:'L', armor:'Chrome',  armor_val:1021, shield:3063, structure:765,  slots:8, agility:11, stability:32, movement:1, source:'Restricted 4'},

  { id:'cruiser_Fortress_I',    name:'Fortress I',    rarity:'E', armor:'Regen',   armor_val:800,  shield:2400, structure:380,  slots:6, agility:7,  stability:29, movement:1, source:'Instanca 22' },
  { id:'cruiser_Fortress_II',   name:'Fortress II',   rarity:'L', armor:'Regen',   armor_val:912,  shield:2736, structure:608,  slots:7, agility:8,  stability:32, movement:1, source:'Instanca 28' },
  { id:'cruiser_Fortress_III',  name:'Fortress III',  rarity:'L', armor:'Regen',   armor_val:1075, shield:3225, structure:808,  slots:9, agility:10, stability:36, movement:1, source:'Restricted 4'},
];

// ═══════════════════════════════════════════════════════════
// 💥 BOJNI BRODOVI (battleship)
// ═══════════════════════════════════════════════════════════
const BATTLESHIPS = [
  { id:'battleship_Titan_I',         name:'Titan I',         rarity:'C', armor:'Chrome',       armor_val:1200, shield:3600, structure:600,  slots:6,  agility:5, stability:30, movement:1, source:'Instanca 29' },
  { id:'battleship_Titan_II',        name:'Titan II',        rarity:'R', armor:'Chrome',       armor_val:1370, shield:4110, structure:960,  slots:8,  agility:6, stability:34, movement:1, source:'Restricted 5' },
  { id:'battleship_Titan_III',       name:'Titan III',       rarity:'E', armor:'Chrome',       armor_val:1614, shield:4842, structure:1275, slots:10, agility:7, stability:40, movement:1, source:'Trial 1' },

  { id:'battleship_Behemoth_I',      name:'Behemoth I',      rarity:'C', armor:'Regen',        armor_val:1150, shield:3450, structure:580,  slots:6,  agility:4, stability:32, movement:1, source:'Instanca 29' },
  { id:'battleship_Behemoth_II',     name:'Behemoth II',     rarity:'R', armor:'Regen',        armor_val:1311, shield:3933, structure:928,  slots:8,  agility:5, stability:36, movement:1, source:'Restricted 5' },
  { id:'battleship_Behemoth_III',    name:'Behemoth III',    rarity:'E', armor:'Regen',        armor_val:1545, shield:4635, structure:1232, slots:10, agility:6, stability:42, movement:1, source:'Trial 1' },

  { id:'battleship_Leviathan_I',     name:'Leviathan I',     rarity:'R', armor:'Nano',         armor_val:1100, shield:3300, structure:560,  slots:7,  agility:5, stability:28, movement:1, source:'Instanca 30' },
  { id:'battleship_Leviathan_II',    name:'Leviathan II',    rarity:'E', armor:'Nano',         armor_val:1254, shield:3762, structure:896,  slots:9,  agility:6, stability:32, movement:1, source:'Restricted 6' },
  { id:'battleship_Leviathan_III',   name:'Leviathan III',   rarity:'L', armor:'Nano',         armor_val:1479, shield:4437, structure:1190, slots:11, agility:7, stability:38, movement:1, source:'Trial 2' },

  { id:'battleship_Goliath_I',       name:'Goliath I',       rarity:'R', armor:'Neutralizing', armor_val:1050, shield:3150, structure:540,  slots:7,  agility:4, stability:30, movement:1, source:'Instanca 30' },
  { id:'battleship_Goliath_II',      name:'Goliath II',      rarity:'E', armor:'Neutralizing', armor_val:1197, shield:3591, structure:864,  slots:9,  agility:5, stability:34, movement:1, source:'Restricted 6' },
  { id:'battleship_Goliath_III',     name:'Goliath III',     rarity:'L', armor:'Neutralizing', armor_val:1411, shield:4233, structure:1148, slots:11, agility:6, stability:40, movement:1, source:'Trial 2' },

  { id:'battleship_Colossus_I',      name:'Colossus I',      rarity:'C', armor:'Chrome',       armor_val:1300, shield:3900, structure:640,  slots:8,  agility:4, stability:32, movement:1, source:'Restricted 5' },
  { id:'battleship_Colossus_II',     name:'Colossus II',     rarity:'R', armor:'Chrome',       armor_val:1482, shield:4446, structure:1024, slots:10, agility:5, stability:36, movement:1, source:'Restricted 7' },
  { id:'battleship_Colossus_III',    name:'Colossus III',    rarity:'E', armor:'Chrome',       armor_val:1747, shield:5241, structure:1360, slots:12, agility:6, stability:42, movement:1, source:'Trial 3' },

  { id:'battleship_Imperator_I',     name:'Imperator I',     rarity:'C', armor:'Regen',        armor_val:1350, shield:4050, structure:660,  slots:8,  agility:4, stability:34, movement:1, source:'Restricted 5' },
  { id:'battleship_Imperator_II',    name:'Imperator II',    rarity:'R', armor:'Regen',        armor_val:1539, shield:4617, structure:1056, slots:10, agility:5, stability:38, movement:1, source:'Restricted 7' },
  { id:'battleship_Imperator_III',   name:'Imperator III',   rarity:'E', armor:'Regen',        armor_val:1814, shield:5442, structure:1402, slots:12, agility:6, stability:44, movement:1, source:'Trial 3' },

  { id:'battleship_Annihilator_I',   name:'Annihilator I',   rarity:'E', armor:'Nano',         armor_val:1400, shield:4200, structure:680,  slots:9,  agility:5, stability:30, movement:1, source:'Restricted 6' },
  { id:'battleship_Annihilator_II',  name:'Annihilator II',  rarity:'L', armor:'Nano',         armor_val:1596, shield:4788, structure:1088, slots:11, agility:6, stability:34, movement:1, source:'Restricted 8' },
  { id:'battleship_Annihilator_III', name:'Annihilator III', rarity:'L', armor:'Nano',         armor_val:1881, shield:5643, structure:1445, slots:13, agility:7, stability:40, movement:1, source:'Trial 4' },

  { id:'battleship_Dreadnought_I',   name:'Dreadnought I',   rarity:'R', armor:'Neutralizing', armor_val:1450, shield:4350, structure:700,  slots:9,  agility:4, stability:32, movement:1, source:'Restricted 6' },
  { id:'battleship_Dreadnought_II',  name:'Dreadnought II',  rarity:'E', armor:'Neutralizing', armor_val:1653, shield:4959, structure:1120, slots:11, agility:5, stability:36, movement:1, source:'Restricted 8' },
  { id:'battleship_Dreadnought_III', name:'Dreadnought III', rarity:'L', armor:'Neutralizing', armor_val:1949, shield:5847, structure:1488, slots:13, agility:6, stability:42, movement:1, source:'Trial 4' },

  { id:'battleship_Obliterator_I',   name:'Obliterator I',   rarity:'C', armor:'Chrome',       armor_val:1540, shield:4620, structure:740,  slots:10, agility:4, stability:34, movement:1, source:'Restricted 7' },
  { id:'battleship_Obliterator_II',  name:'Obliterator II',  rarity:'R', armor:'Chrome',       armor_val:1756, shield:5268, structure:1184, slots:12, agility:5, stability:38, movement:1, source:'Restricted 9' },
  { id:'battleship_Obliterator_III', name:'Obliterator III', rarity:'E', armor:'Chrome',       armor_val:2069, shield:6207, structure:1573, slots:14, agility:6, stability:44, movement:1, source:'Trial 4' },
];

// ═══════════════════════════════════════════════════════════
// 🌌 NOSAČI (carrier)
// ═══════════════════════════════════════════════════════════
const CARRIERS = [
  { id:'carrier_Atlas_I',       name:'Atlas I',       rarity:'C', armor:'Chrome', armor_val:2000, shield:8000,  structure:2000, slots:4,  agility:3, stability:40, movement:1, source:'Restricted 8' },
  { id:'carrier_Atlas_II',      name:'Atlas II',      rarity:'R', armor:'Chrome', armor_val:2280, shield:9120,  structure:3200, slots:5,  agility:4, stability:45, movement:1, source:'Trial 5' },
  { id:'carrier_Atlas_III',     name:'Atlas III',     rarity:'E', armor:'Chrome', armor_val:2690, shield:10760, structure:4250, slots:6,  agility:4, stability:52, movement:1, source:'Trial 8' },

  { id:'carrier_Titanfall_I',   name:'Titanfall I',   rarity:'C', armor:'Regen',  armor_val:1900, shield:7600,  structure:1900, slots:4,  agility:3, stability:42, movement:1, source:'Restricted 8' },
  { id:'carrier_Titanfall_II',  name:'Titanfall II',  rarity:'R', armor:'Regen',  armor_val:2166, shield:8664,  structure:3040, slots:5,  agility:4, stability:47, movement:1, source:'Trial 5' },
  { id:'carrier_Titanfall_III', name:'Titanfall III', rarity:'E', armor:'Regen',  armor_val:2556, shield:10224, structure:4038, slots:6,  agility:4, stability:54, movement:1, source:'Trial 8' },

  { id:'carrier_Nebula_I',      name:'Nebula I',      rarity:'R', armor:'Chrome', armor_val:2100, shield:8400,  structure:2100, slots:4,  agility:3, stability:38, movement:1, source:'Restricted 9' },
  { id:'carrier_Nebula_II',     name:'Nebula II',     rarity:'E', armor:'Chrome', armor_val:2394, shield:9576,  structure:3360, slots:5,  agility:4, stability:43, movement:1, source:'Trial 6' },
  { id:'carrier_Nebula_III',    name:'Nebula III',    rarity:'L', armor:'Chrome', armor_val:2824, shield:11296, structure:4463, slots:6,  agility:4, stability:50, movement:1, source:'Trial 9' },

  { id:'carrier_Dominion_I',    name:'Dominion I',    rarity:'R', armor:'Regen',  armor_val:2200, shield:8800,  structure:2200, slots:4,  agility:2, stability:44, movement:1, source:'Restricted 9' },
  { id:'carrier_Dominion_II',   name:'Dominion II',   rarity:'E', armor:'Regen',  armor_val:2508, shield:10032, structure:3520, slots:5,  agility:3, stability:49, movement:1, source:'Trial 6' },
  { id:'carrier_Dominion_III',  name:'Dominion III',  rarity:'L', armor:'Regen',  armor_val:2959, shield:11836, structure:4675, slots:6,  agility:3, stability:56, movement:1, source:'Trial 9' },

  { id:'carrier_Vanguard_I',    name:'Vanguard I',    rarity:'C', armor:'Chrome', armor_val:2300, shield:9200,  structure:2300, slots:5,  agility:3, stability:40, movement:1, source:'Restricted 10' },
  { id:'carrier_Vanguard_II',   name:'Vanguard II',   rarity:'R', armor:'Chrome', armor_val:2622, shield:10488, structure:3680, slots:6,  agility:4, stability:45, movement:1, source:'Trial 7' },
  { id:'carrier_Vanguard_III',  name:'Vanguard III',  rarity:'E', armor:'Chrome', armor_val:3093, shield:12372, structure:4888, slots:7,  agility:4, stability:52, movement:1, source:'Trial 10' },

  { id:'carrier_Harbinger_I',   name:'Harbinger I',   rarity:'C', armor:'Regen',  armor_val:2400, shield:9600,  structure:2400, slots:5,  agility:2, stability:42, movement:1, source:'Restricted 10' },
  { id:'carrier_Harbinger_II',  name:'Harbinger II',  rarity:'R', armor:'Regen',  armor_val:2736, shield:10944, structure:3840, slots:6,  agility:3, stability:47, movement:1, source:'Trial 7' },
  { id:'carrier_Harbinger_III', name:'Harbinger III', rarity:'E', armor:'Regen',  armor_val:3228, shield:12912, structure:5100, slots:7,  agility:3, stability:54, movement:1, source:'Trial 10' },

  { id:'carrier_Ark_I',         name:'Ark I',         rarity:'E', armor:'Chrome', armor_val:2500, shield:10000, structure:2500, slots:5,  agility:2, stability:44, movement:1, source:'Trial 5' },
  { id:'carrier_Ark_II',        name:'Ark II',        rarity:'L', armor:'Chrome', armor_val:2850, shield:11400, structure:4000, slots:6,  agility:3, stability:49, movement:1, source:'Trial 7' },
  { id:'carrier_Ark_III',       name:'Ark III',       rarity:'L', armor:'Chrome', armor_val:3363, shield:13452, structure:5313, slots:8,  agility:3, stability:56, movement:1, source:'Trial 10' },

  { id:'carrier_Sanctuary_I',   name:'Sanctuary I',   rarity:'R', armor:'Regen',  armor_val:2600, shield:10400, structure:2600, slots:5,  agility:2, stability:46, movement:1, source:'Trial 5' },
  { id:'carrier_Sanctuary_II',  name:'Sanctuary II',  rarity:'E', armor:'Regen',  armor_val:2964, shield:11856, structure:4160, slots:6,  agility:3, stability:51, movement:1, source:'Trial 7' },
  { id:'carrier_Sanctuary_III', name:'Sanctuary III', rarity:'L', armor:'Regen',  armor_val:3497, shield:13988, structure:5525, slots:8,  agility:3, stability:58, movement:1, source:'Trial 10' },
];

// ═══════════════════════════════════════════════════════════
// 👑 FLAGSHIP (special) — većinom Legendary, neki Epic
// ═══════════════════════════════════════════════════════════
const SPECIALS = [
  { id:'special_Independence_I',     name:'Independence I',     rarity:'L', armor:'Light', armor_val:500,  shield:15000, structure:5000, slots:6,  agility:15, stability:50, movement:2, source:'Humanoid 3' },
  { id:'special_BlackHole_I',        name:'Black Hole I',        rarity:'L', armor:'Light', armor_val:600,  shield:12000, structure:6000, slots:6,  agility:12, stability:45, movement:2, source:'Pirate 3' },
  { id:'special_Conquistador_I',     name:'Conquistador I',     rarity:'L', armor:'Light', armor_val:550,  shield:13000, structure:5500, slots:7,  agility:14, stability:48, movement:2, source:'Pirate 3' },
  { id:'special_IntrepidNexus_I',    name:'Intrepid Nexus I',    rarity:'E', armor:'Light', armor_val:520,  shield:11000, structure:4800, slots:6,  agility:16, stability:44, movement:2, source:'Humanoid 5' },
  { id:'special_GrimReaper_I',       name:'Grim Reaper I',       rarity:'L', armor:'Light', armor_val:580,  shield:14000, structure:5200, slots:6,  agility:13, stability:46, movement:2, source:'Humanoid 5' },
  { id:'special_AllianceAdmiral_I',  name:'Alliance Admiral I',  rarity:'L', armor:'Light', armor_val:650,  shield:16000, structure:6500, slots:8,  agility:10, stability:55, movement:1, source:'Constellation 1' },
  { id:'special_PresidioOfGlory_I',  name:'Presidio of Glory I',  rarity:'L', armor:'Light', armor_val:700,  shield:18000, structure:7000, slots:8,  agility:9,  stability:58, movement:1, source:'Constellation 1' },
  { id:'special_AggressiveWarlord_I',name:'Aggressive Warlord I',rarity:'E', armor:'Light', armor_val:620,  shield:13500, structure:5800, slots:7,  agility:11, stability:47, movement:2, source:'Pirate 3' },
  { id:'special_QuickAssault_I',     name:'Quick Assault I',     rarity:'L', armor:'Light', armor_val:560,  shield:12500, structure:5100, slots:6,  agility:18, stability:42, movement:3, source:'Humanoid 8' },
  { id:'special_StrikingSword_I',    name:'Striking Sword I',    rarity:'L', armor:'Light', armor_val:590,  shield:13800, structure:5400, slots:7,  agility:14, stability:49, movement:2, source:'Constellation 3' },
];

// ── SPREMANJE SVIH BRODOVA U JEDAN OBJEKAT ──
const SHIPS = {
  scout:      SCOUTS,
  fighter:    FIGHTERS,
  cruiser:    CRUISERS,
  battleship: BATTLESHIPS,
  carrier:    CARRIERS,
  special:    SPECIALS,
};

// ── HELPER FUNKCIJE ──
function getShipById(id) {
  for (const cls of Object.values(SHIPS)) {
    const ship = cls.find(s => s.id === id);
    if (ship) return ship;
  }
  return null;
}

function getShipsByClass(className) {
  return SHIPS[className] || [];
}

function calcShipDPS(ship, weaponModules) {
  let baseDPS = Math.floor((ship.armor_val + ship.shield * 0.1) * 0.08);
  if (weaponModules) {
    weaponModules.forEach(mod => { baseDPS += mod.dps || 0; });
  }
  return baseDPS;
}

function getShipClass(shipId) {
  for (const [cls, ships] of Object.entries(SHIPS)) {
    if (ships.find(s => s.id === shipId)) return cls;
  }
  return null;
}

function getShipRarity(shipId) {
  const ship = getShipById(shipId);
  return ship?.rarity || 'C';
}

// Export
if (typeof module !== 'undefined') {
  module.exports = { SHIPS, SHIP_CLASSES, ARMOR_TYPES, ARMOR_RESISTANCE, getShipById, getShipsByClass, calcShipDPS, getShipClass, getShipRarity };
}