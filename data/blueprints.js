// ============================================================
// HIVE GALAXY — data/blueprints.js
// Blueprinti brodova — kombinacije opreme po klasi i moći
// Blueprint = preporučeni build za određeni stil igre
// ============================================================

// ── BLUEPRINT KATEGORIJE ──
const BLUEPRINT_ROLES = {
  glass_cannon:  { name: 'Glass Cannon',  icon: '💥', desc: 'Maksimalni DPS, minimalna odbrana.' },
  tank:          { name: 'Tank',          icon: '🛡️', desc: 'Maksimalna odbrana, žrtvuje napad.' },
  balanced:      { name: 'Balanced',      icon: '⚖️', desc: 'Balans između napada i odbrane.' },
  stealth:       { name: 'Stealth',       icon: '👻', desc: 'Izbjegavanje i iznenađenje.' },
  support:       { name: 'Support',       icon: '🌐', desc: 'Podrška floti, buffe i debuffs.' },
  speed:         { name: 'Speed',         icon: '💨', desc: 'Maksimalna brzina i inicijativa.' },
};

// ── BLUEPRINT TIERS ──
// starter = F2P prijatno, mid = Restricted content, endgame = Trial/Constellation
const BLUEPRINT_TIERS = {
  starter:  { name: 'Starter',  color: '#ffdd00', desc: 'Dostupno svim igračima od početka.'   },
  mid:      { name: 'Mid Game', color: '#4488ff', desc: 'Zahtijeva Restricted instance.'       },
  endgame:  { name: 'Endgame',  color: '#aa44ff', desc: 'Zahtijeva Trial ili Constellation.'   },
  ultimate: { name: 'Ultimate', color: '#ffaa00', desc: 'Potrebni Legendary drop i Boss Event.' },
};

const BLUEPRINTS = [

  // ════════════════════════════════════════════
  // 🛸 IZVIĐAČ BLUEPRINTI
  // ════════════════════════════════════════════

  {
    id: 'bp_scout_starter',
    name: 'Scout — Starter Build',
    shipClass: 'scout',
    role: 'balanced',
    tier: 'starter',
    icon: '🛸',
    ship: 'scout_Phantom_I',
    loadout: {
      weapons: ['w_kinetic_cannon_I', 'w_heat_cannon_I'],
      shield:  'sh_mali_I',
      engine:  'eng_tactical_I',
      modules: ['mod_targeting_I', 'mod_cargo_I'],
    },
    stats_estimate: { dps: 155, ehp: 1200, speed: 1, evasion: 3 },
    tips: 'Idealan za prve misije i farming Common instanci. Fokusiraj se na detekciju.',
    source_req: 'Instanca 1-5',
  },

  {
    id: 'bp_scout_stealth',
    name: 'Scout — Ghost Runner',
    shipClass: 'scout',
    role: 'stealth',
    tier: 'mid',
    icon: '👻',
    ship: 'scout_Shadow_II',
    loadout: {
      weapons: ['w_magnetic_cannon_II', 'w_directional_pulse_II'],
      shield:  'sh_phase_II',
      engine:  'eng_stealth_III',
      modules: ['mod_scanner_II', 'mod_warp_jammer_I'],
    },
    stats_estimate: { dps: 260, ehp: 3500, speed: 1, evasion: 27 },
    tips: 'Stealth runner. -45% detekcija. Idealan za izviđanje Restricted zona.',
    source_req: 'Restricted 1-4',
  },

  {
    id: 'bp_scout_speed',
    name: 'Scout — Lightning Strike',
    shipClass: 'scout',
    role: 'speed',
    tier: 'mid',
    icon: '⚡',
    ship: 'scout_Spectre_II',
    loadout: {
      weapons: ['w_kinetic_cannon_II', 'w_heat_cannon_II'],
      shield:  'sh_particle_II',
      engine:  'eng_sprint_III',
      modules: ['mod_crit_amp_II', 'mod_targeting_II'],
    },
    stats_estimate: { dps: 300, ehp: 2800, speed: 2, evasion: 17 },
    tips: 'Uvijek napada prvi. Ubijaš prije nego što te pogode.',
    source_req: 'Restricted 1-3',
  },

  {
    id: 'bp_scout_endgame',
    name: 'Scout — Phantom Elite',
    shipClass: 'scout',
    role: 'glass_cannon',
    tier: 'endgame',
    icon: '💥',
    ship: 'scout_Phantom_III',
    loadout: {
      weapons: ['w_quantum_lance_III', 'w_plasma_burst_III'],
      shield:  'sh_eos_II',
      engine:  'eng_quantum_III',
      modules: ['mod_crit_amp_III', 'mod_emp_burst_II'],
    },
    stats_estimate: { dps: 680, ehp: 7500, speed: 2, evasion: 40 },
    tips: 'Endgame izviđač. Teleport izbjegavanje + enorman DPS. Trial 5+ sadržaj.',
    source_req: 'Trial 3-6',
  },

  // ════════════════════════════════════════════
  // ⚔️ LOVAC BLUEPRINTI
  // ════════════════════════════════════════════

  {
    id: 'bp_fighter_starter',
    name: 'Fighter — Starter Build',
    shipClass: 'fighter',
    role: 'balanced',
    tier: 'starter',
    icon: '⚔️',
    ship: 'fighter_Falcon_I',
    loadout: {
      weapons: ['w_kinetic_cannon_I', 'w_heat_cannon_I', 'w_kinetic_cannon_I'],
      shield:  'sh_srednji_I',
      engine:  'eng_tactical_I',
      modules: ['mod_targeting_I', 'mod_armor_plating_I'],
    },
    stats_estimate: { dps: 235, ehp: 2100, speed: 1, evasion: 4 },
    tips: 'Pouzdani starter lovac. Tri oružna slota čine razliku od prvog dana.',
    source_req: 'Instanca 1-6',
  },

  {
    id: 'bp_fighter_glass',
    name: 'Fighter — Glass Cannon',
    shipClass: 'fighter',
    role: 'glass_cannon',
    tier: 'mid',
    icon: '💥',
    ship: 'fighter_Raven_II',
    loadout: {
      weapons: ['w_kinetic_cannon_III', 'w_heat_cannon_II', 'w_directional_pulse_II'],
      shield:  'sh_particle_I',
      engine:  'eng_berserker_II',
      modules: ['mod_crit_amp_II', 'mod_overload_I'],
    },
    stats_estimate: { dps: 620, ehp: 3200, speed: 2, evasion: 9 },
    tips: 'Maksimalni DPS. Overload + berserker = razoran u prvim rundama. Rizičan.',
    source_req: 'Restricted 2-5',
  },

  {
    id: 'bp_fighter_balanced',
    name: 'Fighter — All-Rounder',
    shipClass: 'fighter',
    role: 'balanced',
    tier: 'mid',
    icon: '⚖️',
    ship: 'fighter_Harrier_II',
    loadout: {
      weapons: ['w_magnetic_cannon_II', 'w_heat_cannon_II', 'w_explosive_cannon_II'],
      shield:  'sh_phase_II',
      engine:  'eng_sprint_II',
      modules: ['mod_crit_amp_I', 'mod_repair_nano_II'],
    },
    stats_estimate: { dps: 380, ehp: 5500, speed: 2, evasion: 12 },
    tips: 'All-rounder. Solidan u svakoj situaciji. Idealan za PvP i PvE.',
    source_req: 'Restricted 1-4',
  },

  {
    id: 'bp_fighter_endgame',
    name: 'Fighter — Apex Predator',
    shipClass: 'fighter',
    role: 'glass_cannon',
    tier: 'endgame',
    icon: '💀',
    ship: 'fighter_Tempest_III',
    loadout: {
      weapons: ['w_quantum_lance_III', 'w_plasma_burst_III', 'w_magnetic_cannon_III'],
      shield:  'sh_aegis_II',
      engine:  'eng_hyperdrive_II',
      modules: ['mod_annihilator_II', 'mod_chrono_matrix_I'],
    },
    stats_estimate: { dps: 980, ehp: 9500, speed: 3, evasion: 38 },
    tips: 'Apex endgame lovac. Chrono matrix smanjuje cooldown. Execute + double move.',
    source_req: 'Trial 5-8',
  },

  // ════════════════════════════════════════════
  // 🛡️ KRSTARICA BLUEPRINTI
  // ════════════════════════════════════════════

  {
    id: 'bp_cruiser_starter',
    name: 'Cruiser — Shield Wall',
    shipClass: 'cruiser',
    role: 'tank',
    tier: 'starter',
    icon: '🛡️',
    ship: 'cruiser_Bastion_I',
    loadout: {
      weapons: ['w_kinetic_cannon_I', 'w_heat_cannon_I', 'w_kinetic_cannon_I'],
      shield:  'sh_jaki_I',
      engine:  'eng_heavy_I',
      modules: ['mod_armor_plating_II', 'mod_structure_reinf_II', 'mod_repair_nano_I'],
    },
    stats_estimate: { dps: 230, ehp: 7500, speed: 1, evasion: 0 },
    tips: 'Tank krstarica. Drži liniju i apsorbuje štetu umjesto slabijih brodova.',
    source_req: 'Instanca 4-8',
  },

  {
    id: 'bp_cruiser_balanced',
    name: 'Cruiser — Iron Fist',
    shipClass: 'cruiser',
    role: 'balanced',
    tier: 'mid',
    icon: '⚖️',
    ship: 'cruiser_Aegis_II',
    loadout: {
      weapons: ['w_kinetic_cannon_II', 'w_explosive_cannon_II', 'w_directional_pulse_II'],
      shield:  'sh_spacetime_II',
      engine:  'eng_sentinel_II',
      modules: ['mod_fortress_core_I', 'mod_repair_nano_II', 'mod_targeting_II'],
    },
    stats_estimate: { dps: 395, ehp: 13000, speed: 1, evasion: 7 },
    tips: 'Balansirana krstarica. Dobra odbrana + solidan DPS. Idealna za dugačke borbe.',
    source_req: 'Restricted 3-6',
  },

  {
    id: 'bp_cruiser_endgame',
    name: 'Cruiser — Immortal Bastion',
    shipClass: 'cruiser',
    role: 'tank',
    tier: 'endgame',
    icon: '🏰',
    ship: 'cruiser_Citadel_III',
    loadout: {
      weapons: ['w_magnetic_cannon_III', 'w_plasma_burst_III', 'w_quantum_lance_II'],
      shield:  'sh_void_II',
      engine:  'eng_sentinel_III',
      modules: ['mod_fortress_core_III', 'mod_repair_nano_III', 'mod_countermeasure_III'],
    },
    stats_estimate: { dps: 560, ehp: 28000, speed: 1, evasion: 14 },
    tips: 'Gotovo neunišitv. -35% štete + void shield + nano repair. Endgame tanking.',
    source_req: 'Trial 5-9',
  },

  // ════════════════════════════════════════════
  // 💥 BOJNI BROD BLUEPRINTI
  // ════════════════════════════════════════════

  {
    id: 'bp_battleship_starter',
    name: 'Battleship — Iron Hammer',
    shipClass: 'battleship',
    role: 'balanced',
    tier: 'starter',
    icon: '💥',
    ship: 'battleship_Colossus_I',
    loadout: {
      weapons: ['w_kinetic_cannon_I', 'w_heat_cannon_I', 'w_explosive_cannon_I', 'w_kinetic_cannon_I'],
      shield:  'sh_jaki_I',
      engine:  'eng_heavy_I',
      modules: ['mod_armor_plating_II', 'mod_targeting_I'],
    },
    stats_estimate: { dps: 320, ehp: 9000, speed: 1, evasion: 0 },
    tips: 'Solidan starter bojni brod. Četiri oružna slota daju odlični DPS od prvog dana.',
    source_req: 'Instanca 6-10',
  },

  {
    id: 'bp_battleship_glass',
    name: 'Battleship — Death Star',
    shipClass: 'battleship',
    role: 'glass_cannon',
    tier: 'mid',
    icon: '💀',
    ship: 'battleship_Devastator_II',
    loadout: {
      weapons: ['w_kinetic_cannon_III', 'w_heat_cannon_III', 'w_magnetic_cannon_II', 'w_plasma_burst_II'],
      shield:  'sh_phase_I',
      engine:  'eng_berserker_III',
      modules: ['mod_overload_III', 'mod_crit_amp_II'],
    },
    stats_estimate: { dps: 1150, ehp: 8500, speed: 2, evasion: 5 },
    tips: 'Maksimalni DPS. Overload III + berserker = prva runda je gotova. Nije za dugo.',
    source_req: 'Restricted 5-8',
  },

  {
    id: 'bp_battleship_endgame',
    name: 'Battleship — Armageddon',
    shipClass: 'battleship',
    role: 'glass_cannon',
    tier: 'endgame',
    icon: '☄️',
    ship: 'battleship_Obliterator_III',
    loadout: {
      weapons: ['w_quantum_lance_III', 'w_plasma_burst_III', 'w_heat_cannon_III', 'w_magnetic_cannon_III'],
      shield:  'sh_immortal_II',
      engine:  'eng_hyperdrive_III',
      modules: ['mod_annihilator_III', 'mod_chrono_matrix_II', 'mod_emp_burst_III'],
    },
    stats_estimate: { dps: 1800, ehp: 20000, speed: 3, evasion: 45 },
    tips: 'Endgame boss brod. Chrono matrix + quantum lance = razara sve u 1-2 runde.',
    source_req: 'Trial 8-10',
  },

  // ════════════════════════════════════════════
  // 🌌 NOSAČ BLUEPRINTI
  // ════════════════════════════════════════════

  {
    id: 'bp_carrier_starter',
    name: 'Carrier — Hangar Bay',
    shipClass: 'carrier',
    role: 'support',
    tier: 'mid',
    icon: '🌌',
    ship: 'carrier_Atlas_I',
    loadout: {
      weapons: ['w_light_fighters_I', 'w_heavy_fighters_I'],
      shield:  'sh_fortress_I',
      engine:  'eng_heavy_II',
      modules: ['mod_armor_plating_II', 'mod_structure_reinf_II', 'mod_repair_nano_I'],
    },
    stats_estimate: { dps: 200, ehp: 22000, speed: 1, evasion: 3 },
    tips: 'Starter nosač. Drži se nazad, leti Fighter Bay. Tanki po prirodi.',
    source_req: 'Restricted 8',
  },

  {
    id: 'bp_carrier_balanced',
    name: 'Carrier — Strike Carrier',
    shipClass: 'carrier',
    role: 'balanced',
    tier: 'endgame',
    icon: '⚔️',
    ship: 'carrier_Dominion_II',
    loadout: {
      weapons: ['w_heavy_fighters_II', 'w_bomber_squadron_I'],
      shield:  'sh_void_I',
      engine:  'eng_heavy_III',
      modules: ['mod_countermeasure_II', 'mod_fortress_core_II', 'mod_warp_jammer_II'],
    },
    stats_estimate: { dps: 480, ehp: 35000, speed: 1, evasion: 6 },
    tips: 'Strike carrier. Bomber squadron pogađa više meta odjednom. Zaključava neprijatelje.',
    source_req: 'Trial 5-8',
  },

  {
    id: 'bp_carrier_endgame',
    name: 'Carrier — Galactic Overlord',
    shipClass: 'carrier',
    role: 'support',
    tier: 'ultimate',
    icon: '🌠',
    ship: 'carrier_Sanctuary_III',
    loadout: {
      weapons: ['w_elite_squadron_III', 'w_bomber_squadron_III'],
      shield:  'sh_aegis_III',
      engine:  'eng_celestial_II',
      modules: ['mod_fortress_core_III', 'mod_fleet_commander_II', 'mod_chrono_matrix_I'],
    },
    stats_estimate: { dps: 700, ehp: 60000, speed: 3, evasion: 15 },
    tips: 'Flagship-grade nosač. Elite squadron bira najslabiji oklop svake mete. Ubojit u floti.',
    source_req: 'Trial 9-10, Constellation',
  },

  // ════════════════════════════════════════════
  // 👑 FLAGSHIP BLUEPRINTI
  // ════════════════════════════════════════════

  {
    id: 'bp_special_support',
    name: 'Flagship — Fleet Admiral',
    shipClass: 'special',
    role: 'support',
    tier: 'endgame',
    icon: '👑',
    ship: 'special_AllianceAdmiral_I',
    loadout: {
      weapons: ['w_quantum_lance_II', 'w_plasma_burst_II'],
      shield:  'sh_eos_II',
      engine:  'eng_celestial_I',
      modules: ['mod_fleet_commander_II', 'mod_fortress_core_I', 'mod_repair_nano_III'],
    },
    stats_estimate: { dps: 420, ehp: 32000, speed: 3, evasion: 30 },
    tips: 'Flota support flagship. Fleet Commander daje +18% napad i odbrana svim brodovima.',
    source_req: 'Constellation 1-2',
  },

  {
    id: 'bp_special_glass',
    name: 'Flagship — Black Hole Striker',
    shipClass: 'special',
    role: 'glass_cannon',
    tier: 'endgame',
    icon: '🕳️',
    ship: 'special_BlackHole_I',
    loadout: {
      weapons: ['w_quantum_lance_III', 'w_plasma_burst_III'],
      shield:  'sh_immortal_I',
      engine:  'eng_hyperdrive_II',
      modules: ['mod_annihilator_II', 'mod_chrono_matrix_II', 'mod_emp_burst_II'],
    },
    stats_estimate: { dps: 1100, ehp: 22000, speed: 3, evasion: 42 },
    tips: 'Black Hole daje +300% štete vs Light armor. EMP + execute = instant kill combo.',
    source_req: 'Trial 8-10, Pirate 3',
  },

  {
    id: 'bp_special_ultimate',
    name: 'Flagship — Divine Warlord',
    shipClass: 'special',
    role: 'balanced',
    tier: 'ultimate',
    icon: '✨',
    ship: 'special_PresidioOfGlory_I',
    loadout: {
      weapons: ['w_elite_squadron_III', 'w_quantum_lance_III'],
      shield:  'sh_divine_I',
      engine:  'eng_divine_I',
      modules: ['mod_divine_core_I', 'mod_fleet_commander_III', 'mod_chrono_matrix_III'],
    },
    stats_estimate: { dps: 1500, ehp: 55000, speed: 3, evasion: 60 },
    tips: 'Ultimate build. Sve divine komponente. 50% blok + uvijek prvi + +50% DPS. Boss Event drop potreban.',
    source_req: 'Boss Event, Constellation 3, Trial 10',
  },
];

// ── RARITY / TIER COLORS ──
const BLUEPRINT_RARITY = {
  C: { name: 'Common',    color: '#ffdd00', label: 'Obično'  },
  R: { name: 'Rare',      color: '#4488ff', label: 'Rijetko' },
  E: { name: 'Epic',      color: '#aa44ff', label: 'Epsko'   },
  L: { name: 'Legendary', color: '#ffaa00', label: 'Legenda' },
};

// ── HELPER FUNKCIJE ──

function getBlueprintById(id) {
  return BLUEPRINTS.find(b => b.id === id) || null;
}

function getBlueprintsByClass(shipClass) {
  return BLUEPRINTS.filter(b => b.shipClass === shipClass);
}

function getBlueprintsByRole(role) {
  return BLUEPRINTS.filter(b => b.role === role);
}

function getBlueprintsByTier(tier) {
  return BLUEPRINTS.filter(b => b.tier === tier);
}

function getStarterBlueprintsForClass(shipClass) {
  return BLUEPRINTS.filter(b => b.shipClass === shipClass && b.tier === 'starter');
}

function getEndgameBlueprintsForClass(shipClass) {
  return BLUEPRINTS.filter(b => b.shipClass === shipClass && (b.tier === 'endgame' || b.tier === 'ultimate'));
}

// Export
if (typeof module !== 'undefined') {
  module.exports = {
    BLUEPRINTS, BLUEPRINT_ROLES, BLUEPRINT_TIERS, BLUEPRINT_RARITY,
    getBlueprintById, getBlueprintsByClass,
    getBlueprintsByRole, getBlueprintsByTier,
    getStarterBlueprintsForClass, getEndgameBlueprintsForClass,
  };
}