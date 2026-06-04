// ============================================================
// HIVE GALAXY — data/instances.js
// Sve instance (dungeoni) s nagradama i zahtjevima
// ============================================================

// ── INSTANCE TIPOVI ──
const INSTANCE_TYPES = {
  standard:    { name: 'Standard',    icon: '🌌', color: '#4488ff', desc: 'Obična instanca. Otvoren pristup.' },
  restricted:  { name: 'Restricted',  icon: '🔒', color: '#aa44ff', desc: 'Zahtijeva određenu moć flote.' },
  trial:       { name: 'Trial',       icon: '⚔️', color: '#ffaa00', desc: 'Timed challenge. Nagrade po ranku.' },
  humanoid:    { name: 'Humanoid',    icon: '👤', color: '#ff6644', desc: 'Humanoidni protivnici. Specijalne nagrade.' },
  pirate:      { name: 'Pirate',      icon: '🏴‍☠️', color: '#884400', desc: 'Piratska flota. Ekskluzivni dropovi.' },
  constellation: { name: 'Constellation', icon: '⭐', color: '#ffcc33', desc: 'Endgame zona. Samo elitni igrači.' },
  boss:        { name: 'Boss Event',  icon: '👹', color: '#ff0044', desc: 'Globalni boss event. Drop only nagrade.' },
  boss_rare:   { name: 'Rare Boss',   icon: '💀', color: '#4488ff', desc: 'Rare Boss — cooldown 4-8h.' },
  boss_epic:   { name: 'Epic Boss',   icon: '👹', color: '#aa44ff', desc: 'Epic Boss — cooldown 24-48h.' },
  boss_legendary: { name: 'Legendary Boss', icon: '🌑', color: '#ffaa00', desc: 'Legendary Boss — cooldown 7 dana.' },
  boss_master: { name: 'THE HIVE GOD', icon: '👑', color: '#ffffff', desc: 'Master Boss — The Hive God.' },
};

// ── DIFFICULTY SKALA ──
// 1 = početnik, 10 = endgame hardcore
const DIFFICULTY = {
  1:  { label: '⭐',          color: '#aaffaa' },
  2:  { label: '⭐⭐',        color: '#88ff88' },
  3:  { label: '⭐⭐⭐',      color: '#ffff66' },
  4:  { label: '⭐⭐⭐⭐',    color: '#ffcc44' },
  5:  { label: '★★★★★',      color: '#ffaa22' },
  6:  { label: '★★★★★★',    color: '#ff8800' },
  7:  { label: '★★★★★★★',  color: '#ff6600' },
  8:  { label: '💀',          color: '#ff4400' },
  9:  { label: '💀💀',        color: '#ff2200' },
  10: { label: '💀💀💀',      color: '#ff0000' },
};

const INSTANCES = [

  // ════════════════════════════════════════════
  // STANDARDNE INSTANCE (1-30)
  // ════════════════════════════════════════════

  {
    id: 'inst_1', name: 'Instanca 1', type: 'standard', number: 1,
    difficulty: 1,
    min_power: 0,
    icon: '🌌',
    enemies: ['Rogue Drones I', 'Pirate Scout I'],
    boss: 'Alpha Drone',
    drops: {
      guaranteed: ['w_kinetic_cannon_I', 'sh_mali_I', 'mod_cargo_I'],
      chance: [
        { item: 'w_heat_cannon_I', rate: 40 },
        { item: 'eng_basic_I', rate: 30 },
        { item: 'mod_targeting_I', rate: 50 },
        { item: 'scout_Swift_I', rate: 15 },
        { item: 'scout_Phantom_I', rate: 15 }
      ],
    },
    resources: { metal: [200, 500], crystal: [100, 300], he3: [50, 150] },
    desc: 'Prva instanca. Savršena za početnike i Common opremu.',
    unlock: 'Dostupna od starta',
  },

  {
    id: 'inst_2', name: 'Instanca 2', type: 'standard', number: 2,
    difficulty: 1,
    min_power: 500,
    icon: '🌌',
    enemies: ['Rogue Drones I', 'Pirate Scout I'],
    boss: 'Beta Drone',
    drops: {
      guaranteed: ['sh_mali_I', 'mod_armor_plating_I'],
      chance: [
        { item: 'w_kinetic_cannon_I', rate: 50 },
        { item: 'eng_tactical_I', rate: 30 },
        { item: 'sh_mali_II', rate: 15 },
        { item: 'scout_Stinger_I', rate: 15 },
        { item: 'scout_Razor_I', rate: 15 }
      ],
    },
    resources: { metal: [250, 600], crystal: [120, 350], he3: [60, 180] },
    desc: 'Nastavak početne zone. Mali Štit I garantirani drop.',
    unlock: 'Instanca 1 završena',
  },

  {
    id: 'inst_3', name: 'Instanca 3', type: 'standard', number: 3,
    difficulty: 1,
    min_power: 800,
    icon: '🌌',
    enemies: ['Rogue Drones II', 'Marauder Scout I'],
    boss: 'Gamma Drone',
    drops: {
      guaranteed: ['mod_armor_plating_I', 'eng_tactical_I'],
      chance: [
        { item: 'w_heat_cannon_I', rate: 45 },
        { item: 'mod_structure_reinf_I', rate: 40 },
        { item: 'mod_armor_plating_II', rate: 20 },
        { item: 'scout_Wisp_I', rate: 15 },
        { item: 'scout_Glimmer_I', rate: 15 }
      ],
    },
    resources: { metal: [300, 700], crystal: [150, 400], he3: [70, 200] },
    desc: 'Taktički pogon garantiran. Dobra za early armor buildup.',
    unlock: 'Instanca 2 završena',
  },

  {
    id: 'inst_4', name: 'Instanca 4', type: 'standard', number: 4,
    difficulty: 2,
    min_power: 1200,
    icon: '🌌',
    enemies: ['Rogue Drones II', 'Marauder Scout I'],
    boss: 'Delta Commander',
    drops: {
      guaranteed: ['sh_srednji_I'],
      chance: [
        { item: 'w_kinetic_cannon_II', rate: 20 },
        { item: 'eng_tactical_II', rate: 25 },
        { item: 'mod_structure_reinf_II', rate: 30 },
        { item: 'scout_Shadow_I', rate: 15 },
        { item: 'scout_Viper_I', rate: 15 }
      ],
    },
    resources: { metal: [400, 900], crystal: [200, 500], he3: [90, 250] },
    desc: 'Srednji Štit I uvijek pada. Prijelaz u mid-tier opremu.',
    unlock: 'Instanca 3 završena',
  },

  {
    id: 'inst_5', name: 'Instanca 5', type: 'standard', number: 5,
    difficulty: 2,
    min_power: 1600,
    icon: '🌌',
    enemies: ['Marauder Fighter I', 'Rogue Drones III'],
    boss: 'Epsilon Warlord',
    drops: {
      guaranteed: ['eng_heavy_I'],
      chance: [
        { item: 'w_heat_cannon_II', rate: 25 },
        { item: 'sh_srednji_II', rate: 20 },
        { item: 'mod_cargo_II', rate: 35 },
        { item: 'scout_Specter_I', rate: 15 },
        { item: 'scout_PhantomX_I', rate: 15 }
      ],
    },
    resources: { metal: [500, 1100], crystal: [250, 600], he3: [110, 300] },
    desc: 'Teški Drive I garantiran. Dobar za Lovce i Krstarice.',
    unlock: 'Instanca 4 završena',
  },

  {
    id: 'inst_6', name: 'Instanca 6', type: 'standard', number: 6,
    difficulty: 2,
    min_power: 2000,
    icon: '🌌',
    enemies: ['Marauder Fighter I', 'Vex Cruiser I'],
    boss: 'Zeta Commander',
    drops: {
      guaranteed: ['sh_jaki_I'],
      chance: [
        { item: 'w_explosive_cannon_I', rate: 40 },
        { item: 'eng_tactical_II', rate: 30 },
        { item: 'mod_targeting_II', rate: 35 },
        { item: 'fighter_Fury_I', rate: 15 },
        { item: 'fighter_Talon_I', rate: 15 }
      ],
    },
    resources: { metal: [600, 1300], crystal: [300, 700], he3: [130, 360] },
    desc: 'Jaki Štit I. Ključna instanca za Krstarice i Bojne Brodove.',
    unlock: 'Instanca 5 završena',
  },

  {
    id: 'inst_7', name: 'Instanca 7', type: 'standard', number: 7,
    difficulty: 2,
    min_power: 2500,
    icon: '🌌',
    enemies: ['Marauder Fighter II', 'Vex Cruiser I'],
    boss: 'Eta Overlord',
    drops: {
      guaranteed: ['eng_basic_II'],
      chance: [
        { item: 'w_kinetic_cannon_II', rate: 35 },
        { item: 'mod_cargo_II', rate: 40 },
        { item: 'eng_tactical_II', rate: 25 },
        { item: 'fighter_Reaper_I', rate: 15 },
        { item: 'fighter_Striker_I', rate: 15 }
      ],
    },
    resources: { metal: [700, 1500], crystal: [350, 800], he3: [150, 420] },
    desc: 'Basic Drive II garantiran. Dobar za early farming.',
    unlock: 'Instanca 6 završena',
  },

  {
    id: 'inst_8', name: 'Instanca 8', type: 'standard', number: 8,
    difficulty: 3,
    min_power: 3000,
    icon: '🌌',
    enemies: ['Vex Cruiser I', 'Marauder Fighter II'],
    boss: 'Theta Admiral',
    drops: {
      guaranteed: ['sh_mali_II'],
      chance: [
        { item: 'w_heat_cannon_II', rate: 30 },
        { item: 'eng_heavy_II', rate: 25 },
        { item: 'mod_armor_plating_III', rate: 20 },
        { item: 'fighter_Vengeance_I', rate: 15 },
        { item: 'fighter_Tempest_I', rate: 15 }
      ],
    },
    resources: { metal: [800, 1800], crystal: [400, 950], he3: [180, 500] },
    desc: 'Mali Štit II garantiran. Prelazak u mid-tier instance.',
    unlock: 'Instanca 7 završena',
  },

  {
    id: 'inst_9', name: 'Instanca 9', type: 'standard', number: 9,
    difficulty: 3,
    min_power: 3600,
    icon: '🌌',
    enemies: ['Vex Cruiser II', 'Khal Battleship I'],
    boss: 'Iota Warlord',
    drops: {
      guaranteed: ['eng_tactical_II'],
      chance: [
        { item: 'w_magnetic_cannon_I', rate: 30 },
        { item: 'mod_structure_reinf_II', rate: 40 },
        { item: 'sh_srednji_II', rate: 25 },
        { item: 'fighter_Outlaw_I', rate: 15 },
        { item: 'fighter_Ravager_I', rate: 15 }
      ],
    },
    resources: { metal: [900, 2000], crystal: [450, 1100], he3: [200, 560] },
    desc: 'Taktički Drive II garantiran. Uvod u Magnetic oružja.',
    unlock: 'Instanca 8 završena',
  },

  {
    id: 'inst_10', name: 'Instanca 10', type: 'standard', number: 10,
    difficulty: 3,
    min_power: 4200,
    icon: '🌌',
    enemies: ['Vex Cruiser II', 'Khal Battleship I'],
    boss: 'Kappa Commander',
    drops: {
      guaranteed: ['sh_srednji_II'],
      chance: [
        { item: 'w_explosive_cannon_II', rate: 25 },
        { item: 'eng_heavy_II', rate: 30 },
        { item: 'mod_crit_amp_I', rate: 20 },
        { item: 'fighter_Corsair_I', rate: 15 },
        { item: 'fighter_Nemesis_I', rate: 15 }
      ],
    },
    resources: { metal: [1100, 2400], crystal: [550, 1300], he3: [240, 660] },
    desc: 'Srednji Štit II garantiran. Solid mid-game instanca.',
    unlock: 'Instanca 9 završena',
  },

  {
    id: 'inst_11', name: 'Instanca 11', type: 'standard', number: 11,
    difficulty: 3,
    min_power: 5000,
    icon: '🌌',
    enemies: ['Khal Battleship I', 'Vex Cruiser III'],
    boss: 'Lambda Dreadnought',
    drops: {
      guaranteed: ['w_kinetic_cannon_II'],
      chance: [
        { item: 'eng_heavy_II', rate: 30 },
        { item: 'mod_crit_amp_I', rate: 35 },
        { item: 'w_heat_cannon_II', rate: 30 },
        { item: 'scout_Swift_II', rate: 8 },
        { item: 'scout_Phantom_II', rate: 8 },
        { item: 'scout_Stinger_II', rate: 8 }
      ],
    },
    resources: { metal: [1300, 2800], crystal: [650, 1500], he3: [280, 760] },
    desc: 'Kinetic Cannon II garantiran. Važna instanca za DPS buildove.',
    unlock: 'Instanca 10 završena',
  },

  {
    id: 'inst_12', name: 'Instanca 12', type: 'standard', number: 12,
    difficulty: 4,
    min_power: 6000,
    icon: '🌌',
    enemies: ['Khal Battleship II', 'Nexus Carrier I'],
    boss: 'Mu Overlord',
    drops: {
      guaranteed: ['sh_jaki_II'],
      chance: [
        { item: 'w_magnetic_cannon_II', rate: 20 },
        { item: 'mod_shield_booster_I', rate: 25 },
        { item: 'eng_sprint_I', rate: 20 },
        { item: 'scout_Razor_II', rate: 8 },
        { item: 'scout_Wisp_II', rate: 8 },
        { item: 'scout_Glimmer_II', rate: 8 }
      ],
    },
    resources: { metal: [1600, 3500], crystal: [800, 1900], he3: [350, 950] },
    desc: 'Jaki Štit II garantiran. Uvod u Rare-tier opremu.',
    unlock: 'Instanca 11 završena',
  },

  {
    id: 'inst_13', name: 'Instanca 13', type: 'standard', number: 13,
    difficulty: 4,
    min_power: 7000,
    icon: '🌌',
    enemies: ['Khal Battleship II', 'Nexus Carrier I'],
    boss: 'Nu Admiral',
    drops: {
      guaranteed: ['eng_basic_III'],
      chance: [
        { item: 'w_heat_cannon_III', rate: 15 },
        { item: 'mod_cargo_III', rate: 30 },
        { item: 'sh_mali_III', rate: 20 },
        { item: 'scout_Shadow_II', rate: 8 },
        { item: 'scout_Viper_II', rate: 8 },
        { item: 'scout_Specter_II', rate: 8 },
        { item: 'scout_PhantomX_II', rate: 8 }
      ],
    },
    resources: { metal: [1900, 4200], crystal: [950, 2200], he3: [420, 1100] },
    desc: 'Basic Drive III garantiran. Dobar za sve klase.',
    unlock: 'Instanca 12 završena',
  },

  {
    id: 'inst_14', name: 'Instanca 14', type: 'standard', number: 14,
    difficulty: 4,
    min_power: 8000,
    icon: '🌌',
    enemies: ['Nexus Carrier I', 'Khal Battleship III'],
    boss: 'Xi Warlord',
    drops: {
      guaranteed: ['sh_mali_III'],
      chance: [
        { item: 'w_kinetic_cannon_III', rate: 15 },
        { item: 'mod_targeting_III', rate: 25 },
        { item: 'eng_tactical_III', rate: 20 },
        { item: 'fighter_Fury_II', rate: 8 },
        { item: 'fighter_Talon_II', rate: 8 }
      ],
    },
    resources: { metal: [2200, 4800], crystal: [1100, 2600], he3: [500, 1300] },
    desc: 'Mali Štit III garantiran. Ključan za Izviđače.',
    unlock: 'Instanca 13 završena',
  },

  {
    id: 'inst_15', name: 'Instanca 15', type: 'standard', number: 15,
    difficulty: 4,
    min_power: 9500,
    icon: '🌌',
    enemies: ['Nexus Carrier II', 'Omega Battleship I'],
    boss: 'Omicron Dreadnought',
    drops: {
      guaranteed: ['eng_tactical_III'],
      chance: [
        { item: 'sh_srednji_III', rate: 15 },
        { item: 'mod_structure_reinf_III', rate: 20 },
        { item: 'w_explosive_cannon_III', rate: 15 },
        { item: 'fighter_Reaper_II', rate: 8 },
        { item: 'fighter_Striker_II', rate: 8 },
        { item: 'fighter_Vengeance_II', rate: 8 }
      ],
    },
    resources: { metal: [2600, 5500], crystal: [1300, 3000], he3: [580, 1550] },
    desc: 'Taktički Drive III garantiran. Kraj early-mid game zone.',
    unlock: 'Instanca 14 završena',
  },

  {
    id: 'inst_16', name: 'Instanca 16', type: 'standard', number: 16,
    difficulty: 5,
    min_power: 11000,
    icon: '🌌',
    enemies: ['Omega Battleship I', 'Nexus Carrier II'],
    boss: 'Pi Commander',
    drops: {
      guaranteed: ['sh_srednji_III'],
      chance: [
        { item: 'w_magnetic_cannon_II', rate: 20 },
        { item: 'mod_repair_nano_I', rate: 25 },
        { item: 'eng_heavy_III', rate: 20 },
        { item: 'fighter_Tempest_II', rate: 8 },
        { item: 'fighter_Outlaw_II', rate: 8 },
        { item: 'fighter_Ravager_II', rate: 8 },
        { item: 'fighter_Corsair_II', rate: 8 },
        { item: 'fighter_Nemesis_II', rate: 8 }
      ],
    },
    resources: { metal: [3000, 6500], crystal: [1500, 3500], he3: [680, 1800] },
    desc: 'Srednji Štit III garantiran. Ulazak u late-mid game.',
    unlock: 'Instanca 15 završena',
  },

  {
    id: 'inst_17', name: 'Instanca 17', type: 'standard', number: 17,
    difficulty: 5,
    min_power: 13000,
    icon: '🌌',
    enemies: ['Omega Battleship II', 'Void Cruiser I'],
    boss: 'Rho Admiral',
    drops: {
      guaranteed: ['eng_heavy_III'],
      chance: [
        { item: 'sh_jaki_III', rate: 15 },
        { item: 'mod_crit_amp_II', rate: 20 },
        { item: 'w_kinetic_cannon_III', rate: 20 },
        { item: 'cruiser_Defender_I', rate: 15 },
        { item: 'cruiser_Guardian_I', rate: 15 }
      ],
    },
    resources: { metal: [3500, 7500], crystal: [1750, 4000], he3: [800, 2100] },
    desc: 'Heavy Drive III garantiran. Solid za Bojne Brodove i Nosače.',
    unlock: 'Instanca 16 završena',
  },

  {
    id: 'inst_18', name: 'Instanca 18', type: 'standard', number: 18,
    difficulty: 5,
    min_power: 15000,
    icon: '🌌',
    enemies: ['Void Cruiser I', 'Omega Battleship II'],
    boss: 'Sigma Warlord',
    drops: {
      guaranteed: ['sh_jaki_III'],
      chance: [
        { item: 'w_heat_cannon_III', rate: 20 },
        { item: 'eng_sprint_II', rate: 20 },
        { item: 'mod_shield_booster_II', rate: 18 },
        { item: 'cruiser_Sentinel_I', rate: 15 },
        { item: 'cruiser_Bulwark_I', rate: 15 }
      ],
    },
    resources: { metal: [4000, 8500], crystal: [2000, 4600], he3: [920, 2400] },
    desc: 'Jaki Štit III garantiran. Kraj standardnih instanci mid-tiera.',
    unlock: 'Instanca 17 završena',
  },

  {
    id: 'inst_19', name: 'Instanca 19', type: 'standard', number: 19,
    difficulty: 6,
    min_power: 18000,
    icon: '🌌',
    enemies: ['Void Cruiser II', 'Phantom Battleship I'],
    boss: 'Tau Overlord',
    drops: {
      guaranteed: ['mod_repair_nano_II'],
      chance: [
        { item: 'sh_phase_I', rate: 15 },
        { item: 'eng_stealth_I', rate: 20 },
        { item: 'mod_scanner_I', rate: 22 },
        { item: 'cruiser_Citadel_I', rate: 15 },
        { item: 'cruiser_Rampart_I', rate: 15 }
      ],
    },
    resources: { metal: [4800, 10000], crystal: [2400, 5500], he3: [1100, 2900] },
    desc: 'Ulazak u Rare zonu. Šansa za Phase Štit i Stealth Drive.',
    unlock: 'Instanca 18 završena',
  },

  {
    id: 'inst_20', name: 'Instanca 20', type: 'standard', number: 20,
    difficulty: 6,
    min_power: 21000,
    icon: '🌌',
    enemies: ['Phantom Battleship I', 'Void Carrier I'],
    boss: 'Upsilon Dreadnought',
    drops: {
      guaranteed: ['eng_sprint_I'],
      chance: [
        { item: 'sh_particle_I', rate: 15 },
        { item: 'mod_crit_amp_II', rate: 20 },
        { item: 'eng_he3_saver_I', rate: 22 },
        { item: 'cruiser_Paladin_I', rate: 15 },
        { item: 'cruiser_Protector_I', rate: 15 }
      ],
    },
    resources: { metal: [5500, 12000], crystal: [2750, 6500], he3: [1300, 3400] },
    desc: 'Sprint Drive I garantiran. Particle Štit šansa.',
    unlock: 'Instanca 19 završena',
  },

  {
    id: 'inst_21', name: 'Instanca 21', type: 'standard', number: 21,
    difficulty: 6,
    min_power: 25000,
    icon: '🌌',
    enemies: ['Void Carrier I', 'Phantom Battleship II'],
    boss: 'Phi Commander',
    drops: {
      guaranteed: ['sh_heat_diff_I'],
      chance: [
        { item: 'eng_stealth_II', rate: 15 },
        { item: 'mod_shield_booster_II', rate: 20 },
        { item: 'w_plasma_burst_I', rate: 18 },
        { item: 'cruiser_Shield_I', rate: 15 },
        { item: 'cruiser_Bastion_I', rate: 15 }
      ],
    },
    resources: { metal: [6500, 14000], crystal: [3250, 7500], he3: [1550, 4000] },
    desc: 'Heat Diffusion Štit I garantiran. Ulazak u visoke standard instance.',
    unlock: 'Instanca 20 završena',
  },

  {
    id: 'inst_22', name: 'Instanca 22', type: 'standard', number: 22,
    difficulty: 7,
    min_power: 30000,
    icon: '🌌',
    enemies: ['Phantom Battleship II', 'Void Carrier II'],
    boss: 'Chi Warlord',
    drops: {
      guaranteed: ['eng_stealth_I'],
      chance: [
        { item: 'sh_particle_II', rate: 12 },
        { item: 'mod_warp_jammer_I', rate: 18 },
        { item: 'w_quantum_lance_I', rate: 12 },
        { item: 'cruiser_Haven_I', rate: 15 },
        { item: 'cruiser_Fortress_I', rate: 15 }
      ],
    },
    resources: { metal: [8000, 17000], crystal: [4000, 9000], he3: [1900, 4800] },
    desc: 'Stealth Drive I garantiran. Šansa za Quantum Lance.',
    unlock: 'Instanca 21 završena',
  },

  {
    id: 'inst_23', name: 'Instanca 23', type: 'standard', number: 23,
    difficulty: 7,
    min_power: 35000,
    icon: '🌌',
    enemies: ['Void Carrier II', 'Nexus Flagship I'],
    boss: 'Psi Admiral',
    drops: {
      guaranteed: ['mod_repair_nano_I'],
      chance: [
        { item: 'eng_sprint_III', rate: 10 },
        { item: 'sh_heat_diff_II', rate: 12 },
        { item: 'mod_countermeasure_I', rate: 15 },
        { item: 'scout_Swift_III', rate: 4 },
        { item: 'scout_Phantom_III', rate: 4 },
        { item: 'scout_Stinger_III', rate: 4 }
      ],
    },
    resources: { metal: [9500, 20000], crystal: [4750, 10500], he3: [2200, 5600] },
    desc: 'Uvod u endgame standardnih instanci. Šansa za Rare-Epic opremu.',
    unlock: 'Instanca 22 završena',
  },

  {
    id: 'inst_24', name: 'Instanca 24', type: 'standard', number: 24,
    difficulty: 7,
    min_power: 40000,
    icon: '🌌',
    enemies: ['Nexus Flagship I', 'Omega Carrier I'],
    boss: 'Omega Warlord',
    drops: {
      guaranteed: ['eng_sprint_II'],
      chance: [
        { item: 'sh_particle_II', rate: 12 },
        { item: 'mod_scanner_II', rate: 18 },
        { item: 'w_plasma_burst_II', rate: 10 },
        { item: 'scout_Razor_III', rate: 4 },
        { item: 'scout_Wisp_III', rate: 4 },
        { item: 'scout_Glimmer_III', rate: 4 }
      ],
    },
    resources: { metal: [11000, 23000], crystal: [5500, 12500], he3: [2600, 6600] },
    desc: 'Sprint Drive II garantiran.',
    unlock: 'Instanca 23 završena',
  },

  {
    id: 'inst_25', name: 'Instanca 25', type: 'standard', number: 25,
    difficulty: 8,
    min_power: 48000,
    icon: '🌌',
    enemies: ['Omega Carrier I', 'Nexus Flagship II'],
    boss: 'Omega Admiral',
    drops: {
      guaranteed: ['sh_heat_diff_II'],
      chance: [
        { item: 'eng_he3_saver_II', rate: 15 },
        { item: 'mod_shield_booster_III', rate: 12 },
        { item: 'w_kinetic_cannon_III', rate: 15 },
        { item: 'scout_Shadow_III', rate: 4 },
        { item: 'scout_Viper_III', rate: 4 },
        { item: 'scout_Specter_III', rate: 4 },
        { item: 'scout_PhantomX_III', rate: 4 }
      ],
    },
    resources: { metal: [13000, 28000], crystal: [6500, 15000], he3: [3100, 7900] },
    desc: 'Heat Diffusion II garantiran. Kraj mid standardnih instanci.',
    unlock: 'Instanca 24 završena',
  },

  {
    id: 'inst_26', name: 'Instanca 26', type: 'standard', number: 26,
    difficulty: 8,
    min_power: 58000,
    icon: '🌌',
    enemies: ['Nexus Flagship II', 'Omega Carrier II'],
    boss: 'Titan Warlord',
    drops: {
      guaranteed: ['eng_stealth_II'],
      chance: [
        { item: 'sh_particle_III', rate: 10 },
        { item: 'mod_emp_burst_I', rate: 15 },
        { item: 'w_heat_cannon_III', rate: 15 },
        { item: 'fighter_Fury_III', rate: 4 },
        { item: 'fighter_Talon_III', rate: 4 },
        { item: 'fighter_Reaper_III', rate: 4 },
        { item: 'fighter_Striker_III', rate: 4 },
        { item: 'fighter_Vengeance_III', rate: 4 },
        { item: 'fighter_Tempest_III', rate: 4 },
        { item: 'fighter_Outlaw_III', rate: 4 },
        { item: 'fighter_Ravager_III', rate: 4 },
        { item: 'fighter_Corsair_III', rate: 4 },
        { item: 'fighter_Nemesis_III', rate: 4 }
      ],
    },
    resources: { metal: [16000, 34000], crystal: [8000, 18000], he3: [3800, 9500] },
    desc: 'Stealth Drive II garantiran. Ulazak u endgame standardnih instanci.',
    unlock: 'Instanca 25 završena',
  },

  {
    id: 'inst_27', name: 'Instanca 27', type: 'standard', number: 27,
    difficulty: 8,
    min_power: 70000,
    icon: '🌌',
    enemies: ['Omega Carrier II', 'Void Flagship I'],
    boss: 'Colossus Commander',
    drops: {
      guaranteed: ['mod_repair_nano_II'],
      chance: [
        { item: 'eng_sprint_III', rate: 12 },
        { item: 'sh_heat_diff_III', rate: 10 },
        { item: 'mod_crit_amp_III', rate: 12 },
        { item: 'cruiser_Defender_II', rate: 8 },
        { item: 'cruiser_Guardian_II', rate: 8 },
        { item: 'cruiser_Sentinel_II', rate: 8 }
      ],
    },
    resources: { metal: [19000, 40000], crystal: [9500, 21500], he3: [4500, 11500] },
    desc: 'Teška instanca. Dobar izvor Epic komponenti.',
    unlock: 'Instanca 26 završena',
  },

  {
    id: 'inst_28', name: 'Instanca 28', type: 'standard', number: 28,
    difficulty: 9,
    min_power: 85000,
    icon: '🌌',
    enemies: ['Void Flagship I', 'Omega Carrier III'],
    boss: 'Destroyer Prime',
    drops: {
      guaranteed: ['sh_particle_III'],
      chance: [
        { item: 'eng_quantum_I', rate: 8 },
        { item: 'mod_overload_II', rate: 12 },
        { item: 'w_explosive_cannon_III', rate: 15 },
        { item: 'cruiser_Bulwark_II', rate: 8 },
        { item: 'cruiser_Citadel_II', rate: 8 },
        { item: 'cruiser_Rampart_II', rate: 8 },
        { item: 'cruiser_Paladin_II', rate: 8 },
        { item: 'cruiser_Protector_II', rate: 8 },
        { item: 'cruiser_Shield_II', rate: 8 },
        { item: 'cruiser_Bastion_II', rate: 8 },
        { item: 'cruiser_Haven_II', rate: 8 },
        { item: 'cruiser_Fortress_II', rate: 8 }
      ],
    },
    resources: { metal: [23000, 48000], crystal: [11500, 26000], he3: [5500, 14000] },
    desc: 'Particle Stun III garantiran. Šansa za Quantum Drive.',
    unlock: 'Instanca 27 završena',
  },

  {
    id: 'inst_29', name: 'Instanca 29', type: 'standard', number: 29,
    difficulty: 9,
    min_power: 100000,
    icon: '🌌',
    enemies: ['Omega Carrier III', 'Void Flagship II'],
    boss: 'Annihilator Prime',
    drops: {
      guaranteed: ['sh_heat_diff_III'],
      chance: [
        { item: 'w_heavy_fighters_I', rate: 12 },
        { item: 'eng_berserker_I', rate: 10 },
        { item: 'mod_warp_jammer_II', rate: 12 },
      ],
    },
    resources: { metal: [28000, 58000], crystal: [14000, 31000], he3: [6600, 17000] },
    desc: 'Heat Diffusion III garantiran. Predposljednja standardna instanca.',
    unlock: 'Instanca 28 završena',
  },

  {
    id: 'inst_30', name: 'Instanca 30', type: 'standard', number: 30,
    difficulty: 10,
    min_power: 120000,
    icon: '🌌',
    enemies: ['Void Flagship II', 'Omega Dreadnought'],
    boss: 'Omega Supreme',
    drops: {
      guaranteed: ['eng_quantum_I', 'mod_scanner_III'],
      chance: [
        { item: 'eng_berserker_II', rate: 8 },
        { item: 'sh_spacetime_III', rate: 6 },
        { item: 'mod_countermeasure_II', rate: 10 },
        { item: 'w_heavy_fighters_I', rate: 12 },
      ],
    },
    resources: { metal: [35000, 72000], crystal: [17500, 37000], he3: [8500, 21000] },
    desc: 'Posljednja standardna instanca. Quantum Drive garantiran. Prolaz za Restricted.',
    unlock: 'Instanca 29 završena',
  },

  // ════════════════════════════════════════════
  // RESTRICTED INSTANCE (1-10)
  // ════════════════════════════════════════════

  {
    id: 'rest_1', name: 'Restricted 1', type: 'restricted', number: 1,
    difficulty: 5,
    min_power: 20000,
    icon: '🔒',
    enemies: ['Elite Marauder I', 'Phase Hunter I'],
    boss: 'Phase Lord I',
    drops: {
      guaranteed: ['sh_phase_I'],
      chance: [
        { item: 'eng_sprint_II', rate: 20 },
        { item: 'mod_crit_amp_II', rate: 18 },
        { item: 'w_magnetic_cannon_III', rate: 12 },
        { item: 'cruiser_Defender_III', rate: 4 },
        { item: 'cruiser_Guardian_III', rate: 4 }
      ],
    },
    resources: { metal: [5000, 11000], crystal: [3000, 7000], he3: [1500, 4000] },
    desc: 'Prva Restricted instanca. Phase Štit I garantiran.',
    unlock: 'Instanca 15+ završena',
  },

  {
    id: 'rest_2', name: 'Restricted 2', type: 'restricted', number: 2,
    difficulty: 6,
    min_power: 30000,
    icon: '🔒',
    enemies: ['Elite Marauder II', 'Quantum Hunter I'],
    boss: 'Quantum Lord I',
    drops: {
      guaranteed: ['sh_spacetime_I'],
      chance: [
        { item: 'eng_quantum_I', rate: 15 },
        { item: 'mod_emp_burst_I', rate: 18 },
        { item: 'eng_berserker_I', rate: 18 },
        { item: 'cruiser_Sentinel_III', rate: 4 },
        { item: 'cruiser_Bulwark_III', rate: 4 }
      ],
    },
    resources: { metal: [8000, 17000], crystal: [5000, 11000], he3: [2500, 6500] },
    desc: 'Space-Time Magnetic Štit I garantiran. Epic Motori šansa.',
    unlock: 'Restricted 1 završena',
  },

  {
    id: 'rest_3', name: 'Restricted 3', type: 'restricted', number: 3,
    difficulty: 6,
    min_power: 40000,
    icon: '🔒',
    enemies: ['Elite Cruiser I', 'Phase Hunter II'],
    boss: 'Phase Lord II',
    drops: {
      guaranteed: ['sh_phase_II'],
      chance: [
        { item: 'eng_stealth_III', rate: 12 },
        { item: 'mod_countermeasure_I', rate: 18 },
        { item: 'mod_overload_I', rate: 15 },
        { item: 'eng_sprint_III', rate: 12 },
        { item: 'cruiser_Citadel_III', rate: 4 },
        { item: 'cruiser_Rampart_III', rate: 4 },
        { item: 'cruiser_Paladin_III', rate: 4 }
      ],
    },
    resources: { metal: [11000, 23000], crystal: [7000, 15000], he3: [3500, 9000] },
    desc: 'Phase Štit II garantiran.',
    unlock: 'Restricted 2 završena',
  },

  {
    id: 'rest_4', name: 'Restricted 4', type: 'restricted', number: 4,
    difficulty: 7,
    min_power: 55000,
    icon: '🔒',
    enemies: ['Elite Battleship I', 'Quantum Hunter II'],
    boss: 'Quantum Lord II',
    drops: {
      guaranteed: ['sh_spacetime_II'],
      chance: [
        { item: 'eng_quantum_II', rate: 10 },
        { item: 'mod_warp_jammer_II', rate: 15 },
        { item: 'mod_emp_burst_II', rate: 12 },
        { item: 'eng_berserker_II', rate: 12 },
        { item: 'cruiser_Protector_III', rate: 4 },
        { item: 'cruiser_Shield_III', rate: 4 },
        { item: 'cruiser_Bastion_III', rate: 4 },
        { item: 'cruiser_Haven_III', rate: 4 },
        { item: 'cruiser_Fortress_III', rate: 4 }
      ],
    },
    resources: { metal: [15000, 32000], crystal: [9500, 20000], he3: [4800, 12000] },
    desc: 'Space-Time Magnetic II garantiran. Epic zone.',
    unlock: 'Restricted 3 završena',
  },

  {
    id: 'rest_5', name: 'Restricted 5', type: 'restricted', number: 5,
    difficulty: 7,
    min_power: 70000,
    icon: '🔒',
    enemies: ['Elite Carrier I', 'Phase Dreadnought I'],
    boss: 'Phase Dreadnought Alpha',
    drops: {
      guaranteed: ['sh_phase_III'],
      chance: [
        { item: 'eng_berserker_III', rate: 8 },
        { item: 'mod_overload_II', rate: 12 },
        { item: 'mod_countermeasure_II', rate: 12 },
      ],
    },
    resources: { metal: [20000, 42000], crystal: [13000, 27000], he3: [6500, 16500] },
    desc: 'Phase Štit III garantiran. Polovina Restricted zone.',
    unlock: 'Restricted 4 završena',
  },

  {
    id: 'rest_6', name: 'Restricted 6', type: 'restricted', number: 6,
    difficulty: 8,
    min_power: 90000,
    icon: '🔒',
    enemies: ['Elite Battleship II', 'Void Hunter I'],
    boss: 'Void Hunter Prime',
    drops: {
      guaranteed: ['sh_spacetime_III', 'mod_emp_burst_II'],
      chance: [
        { item: 'eng_quantum_III', rate: 8 },
        { item: 'mod_warp_jammer_III', rate: 10 },
        { item: 'sh_fortress_I', rate: 12 },
      ],
    },
    resources: { metal: [26000, 55000], crystal: [16500, 35000], he3: [8200, 21000] },
    desc: 'Space-Time Magnetic III garantiran. Ulazak u endgame Restricted.',
    unlock: 'Restricted 5 završena',
  },

  {
    id: 'rest_7', name: 'Restricted 7', type: 'restricted', number: 7,
    difficulty: 8,
    min_power: 115000,
    icon: '🔒',
    enemies: ['Elite Carrier II', 'Void Hunter II'],
    boss: 'Void Destroyer',
    drops: {
      guaranteed: ['eng_berserker_III'],
      chance: [
        { item: 'mod_overload_III', rate: 8 },
        { item: 'sh_fortress_II', rate: 10 },
        { item: 'eng_sentinel_III', rate: 10 },
        { item: 'mod_emp_burst_III', rate: 8 },
      ],
    },
    resources: { metal: [33000, 69000], crystal: [21000, 44000], he3: [10500, 27000] },
    desc: 'Berserker Drive III garantiran. Visoka Restricted zona.',
    unlock: 'Restricted 6 završena',
  },

  {
    id: 'rest_8', name: 'Restricted 8', type: 'restricted', number: 8,
    difficulty: 9,
    min_power: 145000,
    icon: '🔒',
    enemies: ['Apex Battleship I', 'Void Flagship I'],
    boss: 'Apex Destroyer I',
    drops: {
      guaranteed: ['sh_eos_I'],
      chance: [
        { item: 'carrier_Atlas_I', rate: 5 },
        { item: 'w_elite_squadron_I', rate: 8 },
        { item: 'mod_countermeasure_III', rate: 10 },
        { item: 'eng_voidwarp_I', rate: 8 },
      ],
    },
    resources: { metal: [42000, 88000], crystal: [26000, 56000], he3: [13000, 34000] },
    desc: 'Eos Phase Štit I garantiran. Pristup Carrier brodovima.',
    unlock: 'Restricted 7 završena',
  },

  {
    id: 'rest_9', name: 'Restricted 9', type: 'restricted', number: 9,
    difficulty: 9,
    min_power: 185000,
    icon: '🔒',
    enemies: ['Apex Battleship II', 'Void Flagship II'],
    boss: 'Apex Destroyer II',
    drops: {
      guaranteed: ['sh_eos_II'],
      chance: [
        { item: 'mod_annihilator_I', rate: 8 },
        { item: 'eng_voidwarp_II', rate: 7 },
        { item: 'mod_fortress_core_I', rate: 10 },
        { item: 'sh_fortress_III', rate: 8 },
      ],
    },
    resources: { metal: [55000, 115000], crystal: [34000, 72000], he3: [17000, 44000] },
    desc: 'Eos Phase II garantiran. Predposljednja Restricted instanca.',
    unlock: 'Restricted 8 završena',
  },

  {
    id: 'rest_10', name: 'Restricted 10', type: 'restricted', number: 10,
    difficulty: 10,
    min_power: 240000,
    icon: '🔒',
    enemies: ['Apex Carrier I', 'Omega Flagship I'],
    boss: 'Omega Apex Supreme',
    drops: {
      guaranteed: ['sh_eos_III', 'eng_voidwarp_II'],
      chance: [
        { item: 'mod_annihilator_II', rate: 6 },
        { item: 'eng_voidwarp_III', rate: 5 },
        { item: 'mod_chrono_matrix_I', rate: 7 },
        { item: 'sh_aegis_I', rate: 6 },
      ],
    },
    resources: { metal: [70000, 145000], crystal: [44000, 92000], he3: [22000, 57000] },
    desc: 'Zadnja Restricted instanca. Eos III + VoidWarp II garantirani. Ključ za Trial.',
    unlock: 'Restricted 9 završena',
  },

  // ════════════════════════════════════════════
  // TRIAL INSTANCE (1-10) — timed, ranked
  // ════════════════════════════════════════════

  {
    id: 'trial_1', name: 'Trial 1', type: 'trial', number: 1,
    difficulty: 6,
    min_power: 50000,
    icon: '⚔️',
    time_limit_minutes: 30,
    ranks: { S: 25, A: 20, B: 15, C: 10 },
    enemies: ['Trial Drone Wave I', 'Trial Cruiser I'],
    boss: 'Trial Commander Alpha',
    drops: {
      rank_S: ['mod_crit_amp_III', 'eng_sprint_III'],
      rank_A: ['mod_shield_booster_III', 'eng_he3_saver_III'],
      rank_B: ['mod_repair_nano_III', 'sh_fortress_I'],
      rank_C: ['mod_scanner_III', 'eng_stealth_III'],
    },
    resources: { metal: [15000, 35000], crystal: [10000, 22000], he3: [5000, 13000] },
    desc: 'Prva Trial instanca. Zahtijeva brzinu. S rank = Epic modul.',
    unlock: 'Restricted 5 završena',
  },

  {
    id: 'trial_2', name: 'Trial 2', type: 'trial', number: 2,
    difficulty: 7,
    min_power: 70000,
    icon: '⚔️',
    time_limit_minutes: 28,
    ranks: { S: 25, A: 20, B: 15, C: 10 },
    enemies: ['Trial Fighter Wave I', 'Trial Battleship I'],
    boss: 'Trial Admiral Beta',
    drops: {
      rank_S: ['mod_overload_III', 'eng_berserker_III'],
      rank_A: ['mod_emp_burst_II', 'eng_quantum_II'],
      rank_B: ['sh_immortal_I', 'mod_warp_jammer_III'],
      rank_C: ['mod_fortress_core_I', 'sh_fortress_II'],
    },
    resources: { metal: [20000, 44000], crystal: [13000, 29000], he3: [6500, 17000] },
    desc: 'Trial 2. Overload III i Berserker III za S rank.',
    unlock: 'Trial 1 završena',
  },

  {
    id: 'trial_3', name: 'Trial 3', type: 'trial', number: 3,
    difficulty: 7,
    min_power: 90000,
    icon: '⚔️',
    time_limit_minutes: 25,
    ranks: { S: 25, A: 20, B: 15, C: 10 },
    enemies: ['Trial Carrier Wave I', 'Trial Battleship II'],
    boss: 'Trial Overlord Gamma',
    drops: {
      rank_S: ['eng_hyperdrive_I', 'mod_annihilator_I'],
      rank_A: ['eng_quantum_III', 'mod_chrono_matrix_I'],
      rank_B: ['sh_immortal_II', 'mod_fortress_core_II'],
      rank_C: ['sh_aegis_I', 'mod_emp_burst_III'],
    },
    resources: { metal: [27000, 56000], crystal: [17000, 37000], he3: [8500, 22000] },
    desc: 'Trial 3. Hyperdrive I i Annihilator I za S rank.',
    unlock: 'Trial 2 završena',
  },

  {
    id: 'trial_4', name: 'Trial 4', type: 'trial', number: 4,
    difficulty: 8,
    min_power: 120000,
    icon: '⚔️',
    time_limit_minutes: 22,
    ranks: { S: 25, A: 20, B: 15, C: 10 },
    enemies: ['Trial Flagship Wave I', 'Trial Carrier II'],
    boss: 'Trial Warlord Delta',
    drops: {
      rank_S: ['mod_annihilator_I', 'eng_voidwarp_II'],
      rank_A: ['eng_hyperdrive_II', 'mod_chrono_matrix_II'],
      rank_B: ['sh_aegis_II', 'mod_fortress_core_II'],
      rank_C: ['sh_void_I', 'mod_annihilator_I'],
    },
    resources: { metal: [36000, 74000], crystal: [22500, 47000], he3: [11000, 28000] },
    desc: 'Trial 4. Mid-tier Trial. Brodovi klase special pojavljuju se.',
    unlock: 'Trial 3 završena',
  },

  {
    id: 'trial_5', name: 'Trial 5', type: 'trial', number: 5,
    difficulty: 8,
    min_power: 155000,
    icon: '⚔️',
    time_limit_minutes: 20,
    ranks: { S: 25, A: 20, B: 15, C: 10 },
    enemies: ['Trial Dreadnought I', 'Trial Carrier III'],
    boss: 'Trial Dreadnought Alpha',
    drops: {
      rank_S: ['eng_hyperdrive_II', 'sh_void_I'],
      rank_A: ['mod_annihilator_II', 'eng_celestial_I'],
      rank_B: ['sh_aegis_II', 'mod_chrono_matrix_II'],
      rank_C: ['sh_immortal_II', 'mod_fortress_core_III'],
    },
    resources: { metal: [46000, 96000], crystal: [29000, 62000], he3: [14500, 37000] },
    desc: 'Trial 5. Hyperdrive II šansa za S rank.',
    unlock: 'Trial 4 završena',
  },

  {
    id: 'trial_6', name: 'Trial 6', type: 'trial', number: 6,
    difficulty: 9,
    min_power: 200000,
    icon: '⚔️',
    time_limit_minutes: 18,
    ranks: { S: 25, A: 20, B: 15, C: 10 },
    enemies: ['Trial Flagship II', 'Trial Dreadnought II'],
    boss: 'Trial Flagship Commander',
    drops: {
      rank_S: ['eng_hyperdrive_III', 'sh_fortress_II'],
      rank_A: ['mod_chrono_matrix_I', 'eng_voidwarp_II'],
      rank_B: ['sh_void_II', 'mod_annihilator_II'],
      rank_C: ['sh_immortal_III', 'eng_celestial_I'],
    },
    resources: { metal: [60000, 125000], crystal: [38000, 80000], he3: [19000, 48000] },
    desc: 'Trial 6. Hyperdrive III za S rank. Endgame Trial zona počinje.',
    unlock: 'Trial 5 završena',
  },

  {
    id: 'trial_7', name: 'Trial 7', type: 'trial', number: 7,
    difficulty: 9,
    min_power: 260000,
    icon: '⚔️',
    time_limit_minutes: 15,
    ranks: { S: 25, A: 20, B: 15, C: 10 },
    enemies: ['Trial Omega Carrier I', 'Trial Flagship III'],
    boss: 'Trial Omega Warlord',
    drops: {
      rank_S: ['eng_celestial_II', 'mod_fleet_commander_I'],
      rank_A: ['sh_void_II', 'eng_hyperdrive_III'],
      rank_B: ['mod_annihilator_III', 'sh_aegis_III'],
      rank_C: ['eng_voidwarp_III', 'sh_void_III'],
    },
    resources: { metal: [78000, 162000], crystal: [49000, 103000], he3: [24500, 62000] },
    desc: 'Trial 7. Celestial II i Fleet Commander I za S rank.',
    unlock: 'Trial 6 završena',
  },

  {
    id: 'trial_8', name: 'Trial 8', type: 'trial', number: 8,
    difficulty: 9,
    min_power: 330000,
    icon: '⚔️',
    time_limit_minutes: 12,
    ranks: { S: 25, A: 20, B: 15, C: 10 },
    enemies: ['Trial Apex Carrier I', 'Trial Omega Flagship I'],
    boss: 'Trial Apex Commander',
    drops: {
      rank_S: ['mod_chrono_matrix_II', 'eng_voidwarp_III'],
      rank_A: ['mod_fortress_core_III', 'sh_void_III'],
      rank_B: ['sh_aegis_III', 'eng_celestial_II'],
      rank_C: ['mod_fleet_commander_II', 'mod_annihilator_III'],
    },
    resources: { metal: [100000, 210000], crystal: [63000, 133000], he3: [31500, 80000] },
    desc: 'Trial 8. Chrono Matrix II i VoidWarp III za S rank.',
    unlock: 'Trial 7 završena',
  },

  {
    id: 'trial_9', name: 'Trial 9', type: 'trial', number: 9,
    difficulty: 10,
    min_power: 420000,
    icon: '⚔️',
    time_limit_minutes: 10,
    ranks: { S: 25, A: 20, B: 15, C: 10 },
    enemies: ['Trial Apex Flagship I', 'Trial Omega Carrier II'],
    boss: 'Trial Supreme Alpha',
    drops: {
      rank_S: ['eng_celestial_III', 'sh_immortal_III'],
      rank_A: ['mod_chrono_matrix_III', 'eng_hyperdrive_III'],
      rank_B: ['mod_fleet_commander_II', 'sh_void_III'],
      rank_C: ['sh_aegis_III', 'mod_fortress_core_III'],
    },
    resources: { metal: [130000, 270000], crystal: [82000, 172000], he3: [41000, 104000] },
    desc: 'Trial 9. Celestial III za S rank. Gotovo nemoguće bez endgame opreme.',
    unlock: 'Trial 8 završena',
  },

  {
    id: 'trial_10', name: 'Trial 10', type: 'trial', number: 10,
    difficulty: 10,
    min_power: 540000,
    icon: '⚔️',
    time_limit_minutes: 8,
    ranks: { S: 25, A: 20, B: 15, C: 10 },
    enemies: ['Trial Supreme Flagship', 'Trial Apex Carrier II'],
    boss: 'Trial Supreme Omega — Final Boss',
    drops: {
      rank_S: ['mod_fleet_commander_III', 'mod_chrono_matrix_III'],
      rank_A: ['eng_celestial_III', 'sh_void_III'],
      rank_B: ['sh_aegis_III', 'mod_annihilator_III'],
      rank_C: ['mod_fortress_core_III', 'eng_voidwarp_III'],
    },
    resources: { metal: [170000, 350000], crystal: [107000, 225000], he3: [53000, 135000] },
    desc: 'Zadnja Trial instanca. Fleet Commander III za S rank. Samo endgame elite.',
    unlock: 'Trial 9 završena',
  },

  // ════════════════════════════════════════════
  // HUMANOID INSTANCE (1-10)
  // ════════════════════════════════════════════

  {
    id: 'human_1', name: 'Humanoid 1', type: 'humanoid', number: 1,
    difficulty: 4, min_power: 15000, icon: '👤',
    enemies: ['Humanoid Militia', 'Humanoid Light Cruiser'],
    boss: 'Commander Rook',
    drops: {
      guaranteed: ['sh_aegis_I'],
      chance: [{ item: 'eng_sentinel_I', rate: 15 }],
    },
    resources: { metal: [5000, 10000], crystal: [3000, 7000], he3: [1500, 4000] },
    desc: 'Uvod u Humanoid zone. Aegis Shield I garantiran.',
    unlock: 'Instanca 15 završena',
  },

  {
    id: 'human_2', name: 'Humanoid 2', type: 'humanoid', number: 2,
    difficulty: 5, min_power: 25000, icon: '👤',
    enemies: ['Humanoid Marine Squad', 'Humanoid Destroyer'],
    boss: 'Admiral Vance',
    drops: {
      guaranteed: ['eng_sentinel_I'],
      chance: [{ item: 'mod_countermeasure_I', rate: 12 }],
    },
    resources: { metal: [8000, 18000], crystal: [5000, 12000], he3: [2500, 6500] },
    desc: 'Sentinel Drive I garantiran.',
    unlock: 'Humanoid 1 završena',
  },

  {
    id: 'human_3', name: 'Humanoid 3', type: 'humanoid', number: 3,
    difficulty: 6, min_power: 40000, icon: '👤',
    enemies: ['Humanoid Fighter Squadron', 'Humanoid Cruiser Wing'],
    boss: 'Humanoid Admiral Kara',
    drops: {
      guaranteed: ['sh_aegis_I'],
      chance: [
        { item: 'special_Independence_I', rate: 3 },
        { item: 'mod_countermeasure_II', rate: 12 },
        { item: 'eng_sentinel_II', rate: 15 },
      ],
    },
    resources: { metal: [12000, 26000], crystal: [8000, 17000], he3: [4000, 10500] },
    desc: 'Aegis Štit I garantiran. Šansa za Independence Flagship.',
    unlock: 'Humanoid 2 završena',
  },

  {
    id: 'human_4', name: 'Humanoid 4', type: 'humanoid', number: 4,
    difficulty: 6, min_power: 55000, icon: '👤',
    enemies: ['Humanoid Battlegroup', 'Humanoid Carrier Wing'],
    boss: 'Fleet Admiral Seras',
    drops: {
      guaranteed: ['sh_aegis_II'],
      chance: [{ item: 'mod_countermeasure_II', rate: 12 }],
    },
    resources: { metal: [16000, 34000], crystal: [10000, 22000], he3: [5000, 13000] },
    desc: 'Aegis II garantiran.',
    unlock: 'Humanoid 3 završena',
  },

  {
    id: 'human_5', name: 'Humanoid 5', type: 'humanoid', number: 5,
    difficulty: 7, min_power: 65000, icon: '👤',
    enemies: ['Humanoid Battleship Wing', 'Humanoid Carrier'],
    boss: 'Humanoid Warlord Vex',
    drops: {
      guaranteed: ['sh_aegis_II'],
      chance: [
        { item: 'special_IntrepidNexus_I', rate: 3 },
        { item: 'special_GrimReaper_I', rate: 3 },
        { item: 'mod_warp_jammer_III', rate: 10 },
      ],
    },
    resources: { metal: [20000, 42000], crystal: [13000, 28000], he3: [6500, 17000] },
    desc: 'Aegis II garantiran. Intrepid Nexus ili Grim Reaper Flagship šansa.',
    unlock: 'Humanoid 4 završena',
  },

  {
    id: 'human_6', name: 'Humanoid 6', type: 'humanoid', number: 6,
    difficulty: 7, min_power: 90000, icon: '👤',
    enemies: ['Humanoid Heavy Battleship', 'Humanoid Flagship'],
    boss: 'Grand Admiral Kael',
    drops: {
      guaranteed: ['eng_sentinel_II'],
      chance: [{ item: 'mod_fleet_commander_I', rate: 5 }],
    },
    resources: { metal: [28000, 58000], crystal: [18000, 38000], he3: [9000, 23000] },
    desc: 'Sentinel II garantiran.',
    unlock: 'Humanoid 5 završena',
  },

  {
    id: 'human_7', name: 'Humanoid 7', type: 'humanoid', number: 7,
    difficulty: 8, min_power: 140000, icon: '👤',
    enemies: ['Humanoid Apex Carrier', 'Humanoid Dreadnought'],
    boss: 'Supreme Commander Voss',
    drops: {
      guaranteed: ['sh_aegis_III'],
      chance: [{ item: 'special_Independence_II', rate: 2 }],
    },
    resources: { metal: [42000, 88000], crystal: [26000, 56000], he3: [13000, 34000] },
    desc: 'Aegis III garantiran. Independence II šansa.',
    unlock: 'Humanoid 6 završena',
  },

  {
    id: 'human_8', name: 'Humanoid 8', type: 'humanoid', number: 8,
    difficulty: 9, min_power: 180000, icon: '👤',
    enemies: ['Humanoid Apex Carrier', 'Humanoid Supreme Flagship'],
    boss: 'Humanoid Supreme Commander',
    drops: {
      guaranteed: ['sh_aegis_III'],
      chance: [
        { item: 'special_QuickAssault_I', rate: 3 },
        { item: 'mod_fleet_commander_I', rate: 8 },
        { item: 'eng_hyperdrive_II', rate: 8 },
      ],
    },
    resources: { metal: [55000, 115000], crystal: [35000, 73000], he3: [17500, 44500] },
    desc: 'Aegis III garantiran. Quick Assault Flagship šansa.',
    unlock: 'Humanoid 7 završena',
  },

  {
    id: 'human_9', name: 'Humanoid 9', type: 'humanoid', number: 9,
    difficulty: 9, min_power: 260000, icon: '👤',
    enemies: ['Humanoid Omega Fleet', 'Humanoid Colossus'],
    boss: 'Emperor Valerius',
    drops: {
      guaranteed: ['eng_sentinel_III'],
      chance: [{ item: 'special_IntrepidNexus_II', rate: 2 }],
    },
    resources: { metal: [80000, 166000], crystal: [50000, 106000], he3: [25000, 64000] },
    desc: 'Sentinel III garantiran.',
    unlock: 'Humanoid 8 završena',
  },

  {
    id: 'human_10', name: 'Humanoid 10', type: 'humanoid', number: 10,
    difficulty: 10, min_power: 400000, icon: '👤',
    enemies: ['Humanoid Ultimate Fleet', 'Humanoid God Flagship'],
    boss: 'God-Emperor Hyperion',
    drops: {
      guaranteed: ['sh_aegis_III', 'eng_sentinel_III'],
      chance: [{ item: 'special_QuickAssault_II', rate: 2 }],
    },
    resources: { metal: [120000, 250000], crystal: [76000, 160000], he3: [38000, 96000] },
    desc: 'Kraj Humanoid zone. Quick Assault II šansa.',
    unlock: 'Humanoid 9 završena',
  },

  // ════════════════════════════════════════════
  // PIRATE INSTANCE (1-10)
  // ════════════════════════════════════════════

  {
    id: 'pirate_1', name: 'Pirate 1', type: 'pirate', number: 1,
    difficulty: 4, min_power: 15000, icon: '🏴‍☠️',
    enemies: ['Raider Corvette', 'Marauder Frigate'],
    boss: 'Captain Scar',
    drops: {
      guaranteed: ['sh_void_I'],
      chance: [{ item: 'mod_emp_burst_I', rate: 12 }],
    },
    resources: { metal: [5000, 10000], crystal: [3000, 7000], he3: [1500, 4000] },
    desc: 'Void Shield I garantiran.',
    unlock: 'Instanca 15 završena',
  },

  {
    id: 'pirate_2', name: 'Pirate 2', type: 'pirate', number: 2,
    difficulty: 5, min_power: 25000, icon: '🏴‍☠️',
    enemies: ['Pirate Destroyer', 'Raider Cruiser'],
    boss: 'Commodore Blackfang',
    drops: {
      guaranteed: ['eng_voidwarp_I'],
      chance: [{ item: 'mod_overload_I', rate: 10 }],
    },
    resources: { metal: [8000, 17000], crystal: [5000, 11000], he3: [2500, 6500] },
    desc: 'Voidwarp I garantiran.',
    unlock: 'Pirate 1 završena',
  },

  {
    id: 'pirate_3', name: 'Pirate 3', type: 'pirate', number: 3,
    difficulty: 6, min_power: 40000, icon: '🏴‍☠️',
    enemies: ['Pirate Raider Squadron', 'Pirate Battlecruiser'],
    boss: 'Captain Void',
    drops: {
      guaranteed: ['sh_void_I'],
      chance: [
        { item: 'special_BlackHole_I', rate: 3 },
        { item: 'special_Conquistador_I', rate: 3 },
        { item: 'special_AggressiveWarlord_I', rate: 3 },
        { item: 'mod_emp_burst_II', rate: 12 },
      ],
    },
    resources: { metal: [12000, 25000], crystal: [8000, 17000], he3: [4000, 10000] },
    desc: 'Void Štit I garantiran. Šansa za 3 različita Pirate Flagship.',
    unlock: 'Pirate 2 završena',
  },

  {
    id: 'pirate_4', name: 'Pirate 4', type: 'pirate', number: 4,
    difficulty: 6, min_power: 55000, icon: '🏴‍☠️',
    enemies: ['Pirate Battleship', 'Raider Carrier'],
    boss: 'Admiral Bloodmoon',
    drops: {
      guaranteed: ['sh_void_II'],
      chance: [{ item: 'special_Conquistador_I', rate: 2 }],
    },
    resources: { metal: [16000, 33000], crystal: [10000, 21000], he3: [5000, 13000] },
    desc: 'Void II garantiran.',
    unlock: 'Pirate 3 završena',
  },

  {
    id: 'pirate_5', name: 'Pirate 5', type: 'pirate', number: 5,
    difficulty: 7, min_power: 90000, icon: '🏴‍☠️',
    enemies: ['Pirate Dreadnought', 'Raider Flagship'],
    boss: 'Warlord Ironhook',
    drops: {
      guaranteed: ['eng_voidwarp_II'],
      chance: [{ item: 'special_BlackHole_I', rate: 2 }],
    },
    resources: { metal: [28000, 59000], crystal: [18000, 38000], he3: [9000, 23000] },
    desc: 'Voidwarp II garantiran.',
    unlock: 'Pirate 4 završena',
  },

  {
    id: 'pirate_6', name: 'Pirate 6', type: 'pirate', number: 6,
    difficulty: 8, min_power: 120000, icon: '🏴‍☠️',
    enemies: ['Pirate Elite Carrier', 'Pirate Apex Battleship'],
    boss: 'Admiral Blackvoid',
    drops: {
      guaranteed: ['sh_void_II'],
      chance: [
        { item: 'mod_overload_III', rate: 8 },
        { item: 'eng_voidwarp_I', rate: 10 },
        { item: 'mod_chrono_matrix_I', rate: 8 },
      ],
    },
    resources: { metal: [36000, 76000], crystal: [23000, 49000], he3: [11500, 29500] },
    desc: 'Void Štit II garantiran. Voidwarp Engine šansa.',
    unlock: 'Pirate 5 završena',
  },

  {
    id: 'pirate_7', name: 'Pirate 7', type: 'pirate', number: 7,
    difficulty: 8, min_power: 180000, icon: '🏴‍☠️',
    enemies: ['Pirate Colossus', 'Raider Titan'],
    boss: 'Overlord Nightwind',
    drops: {
      guaranteed: ['sh_void_III'],
      chance: [{ item: 'special_AggressiveWarlord_II', rate: 1.5 }],
    },
    resources: { metal: [50000, 105000], crystal: [32000, 67000], he3: [16000, 41000] },
    desc: 'Void III garantiran.',
    unlock: 'Pirate 6 završena',
  },

  {
    id: 'pirate_8', name: 'Pirate 8', type: 'pirate', number: 8,
    difficulty: 9, min_power: 250000, icon: '🏴‍☠️',
    enemies: ['Pirate Omega Fleet', 'Raider Apocalypse'],
    boss: 'Emperor Blackvoid',
    drops: {
      guaranteed: ['eng_voidwarp_III'],
      chance: [{ item: 'mod_annihilator_II', rate: 6 }],
    },
    resources: { metal: [78000, 163000], crystal: [49000, 104000], he3: [24500, 63000] },
    desc: 'Voidwarp III garantiran.',
    unlock: 'Pirate 7 završena',
  },

  {
    id: 'pirate_9', name: 'Pirate 9', type: 'pirate', number: 9,
    difficulty: 10, min_power: 350000, icon: '🏴‍☠️',
    enemies: ['Pirate Supreme Carrier', 'Pirate Omega Flagship'],
    boss: 'Supreme Pirate Overlord',
    drops: {
      guaranteed: ['sh_void_III'],
      chance: [
        { item: 'eng_voidwarp_III', rate: 6 },
        { item: 'mod_annihilator_III', rate: 6 },
        { item: 'mod_fleet_commander_II', rate: 6 },
      ],
    },
    resources: { metal: [105000, 220000], crystal: [66000, 140000], he3: [33000, 84000] },
    desc: 'Void III garantiran. Voidwarp III šansa. Piratski ekskluziv.',
    unlock: 'Pirate 8 završena',
  },

  {
    id: 'pirate_10', name: 'Pirate 10', type: 'pirate', number: 10,
    difficulty: 10, min_power: 500000, icon: '🏴‍☠️',
    enemies: ['Pirate Ultimate Fleet', 'Pirate God Emperor'],
    boss: 'The Pirate God-King',
    drops: {
      guaranteed: ['sh_void_III', 'eng_voidwarp_III'],
      chance: [{ item: 'mod_fleet_commander_III', rate: 3 }],
    },
    resources: { metal: [160000, 335000], crystal: [100000, 210000], he3: [50000, 126000] },
    desc: 'Final Pirate instance. Fleet Commander III šansa.',
    unlock: 'Pirate 9 završena',
  },

  // ════════════════════════════════════════════
  // BOSS SISTEM (6 RARE + 3 EPIC + 1 LEGENDARY)
  // ════════════════════════════════════════════

  // ---- 6 RARE BOSSOVA (R1-R6) ----
  {
    id: 'boss_r1', name: 'Void Scavenger', type: 'boss_rare', number: 1,
    difficulty: 5, min_power: 30000, icon: '💀',
    xp: 5000,
    cooldown_hours: 4,
    boss_ability: 'scavenger',
    enemies: ['Void Scavenger Drones', 'Scavenger Fleet'],
    boss: 'Void Scavenger',
    boss_stats: { hp: 15000, shield: 5000, dps: 800, agility: 20, speed: 2, armor: 'Light' },
    drops: { guaranteed: [], chance: [{ item: 'eng_sprint_II', rate: 20 }, { item: 'sh_particle_II', rate: 15 }, { item: 'mod_crit_amp_II', rate: 18 }] },
    resources: { metal: [5000, 12000], crystal: [3000, 7000], he3: [1500, 4000] },
    desc: 'Void Scavenger — krade resurse! Izgubi borbu = -10% nagrade.',
    unlock: 'Min 30k power',
  },

  {
    id: 'boss_r2', name: 'Corsair Marauder', type: 'boss_rare', number: 2,
    difficulty: 5, min_power: 35000, icon: '💀',
    xp: 5000,
    cooldown_hours: 4,
    boss_ability: 'spawn_reinforcements',
    enemies: ['Corsair Escort', 'Corsair Marauder Fleet'],
    boss: 'Corsair Marauder',
    boss_stats: { hp: 18000, shield: 6000, dps: 900, agility: 18, speed: 2, armor: 'Chrome' },
    drops: { guaranteed: [], chance: [{ item: 'eng_tactical_III', rate: 18 }, { item: 'w_magnetic_cannon_II', rate: 20 }, { item: 'sh_heat_diff_I', rate: 15 }] },
    resources: { metal: [5000, 12000], crystal: [3000, 7000], he3: [1500, 4000] },
    desc: 'Corsair Marauder — poziva 2 pomoćna broda u rundi 3!',
    unlock: 'Min 35k power',
  },

  {
    id: 'boss_r3', name: 'Nebula Stalker', type: 'boss_rare', number: 3,
    difficulty: 6, min_power: 45000, icon: '💀',
    xp: 6000,
    cooldown_hours: 6,
    boss_ability: 'stealth_first_round',
    enemies: ['Nebula Shadow Drones', 'Nebula Stalker Pack'],
    boss: 'Nebula Stalker',
    boss_stats: { hp: 20000, shield: 8000, dps: 1100, agility: 35, speed: 3, armor: 'Nano' },
    drops: { guaranteed: [], chance: [{ item: 'eng_stealth_II', rate: 15 }, { item: 'mod_scanner_II', rate: 18 }, { item: 'sh_phase_II', rate: 12 }] },
    resources: { metal: [7000, 15000], crystal: [4500, 10000], he3: [2200, 5500] },
    desc: 'Nebula Stalker — nevidljiv u prvoj rundi! Igrač ne može napadati.',
    unlock: 'Min 45k power',
  },

  {
    id: 'boss_r4', name: 'Solar Predator', type: 'boss_rare', number: 4,
    difficulty: 6, min_power: 50000, icon: '💀',
    xp: 6000,
    cooldown_hours: 6,
    boss_ability: 'aoe_damage',
    enemies: ['Solar Drone Swarm', 'Solar Predator Pack'],
    boss: 'Solar Predator',
    boss_stats: { hp: 22000, shield: 7000, dps: 1200, agility: 15, speed: 2, armor: 'Light' },
    drops: { guaranteed: [], chance: [{ item: 'mod_overload_II', rate: 12 }, { item: 'w_heat_cannon_III', rate: 18 }, { item: 'sh_spacetime_II', rate: 12 }] },
    resources: { metal: [7000, 15000], crystal: [4500, 10000], he3: [2200, 5500] },
    desc: 'Solar Predator — AoE napadi! Svaki hit pogađa sve tvoje slotove za 20%.',
    unlock: 'Min 50k power',
  },

  {
    id: 'boss_r5', name: 'Frost Reaver', type: 'boss_rare', number: 5,
    difficulty: 7, min_power: 70000, icon: '💀',
    xp: 7000,
    cooldown_hours: 8,
    boss_ability: 'freeze_slot',
    enemies: ['Frost Drone Pack', 'Frost Reaver Fleet'],
    boss: 'Frost Reaver',
    boss_stats: { hp: 28000, shield: 10000, dps: 1400, agility: 20, speed: 2, armor: 'Chrome' },
    drops: { guaranteed: [], chance: [{ item: 'eng_quantum_I', rate: 10 }, { item: 'mod_emp_burst_II', rate: 15 }, { item: 'sh_eos_I', rate: 8 }] },
    resources: { metal: [10000, 22000], crystal: [6500, 14000], he3: [3200, 8000] },
    desc: 'Frost Reaver — zamrzava random slot! Taj slot preskače 1 rundu.',
    unlock: 'Min 70k power',
  },

  {
    id: 'boss_r6', name: 'Plasma Wraith', type: 'boss_rare', number: 6,
    difficulty: 7, min_power: 80000, icon: '💀',
    xp: 7000,
    cooldown_hours: 8,
    boss_ability: 'death_explosion',
    enemies: ['Plasma Ghost Pack', 'Plasma Wraith Fleet'],
    boss: 'Plasma Wraith',
    boss_stats: { hp: 30000, shield: 12000, dps: 1500, agility: 22, speed: 2, armor: 'Neutralizing' },
    drops: { guaranteed: [], chance: [{ item: 'eng_berserker_II', rate: 10 }, { item: 'mod_warp_jammer_III', rate: 12 }, { item: 'sh_eos_I', rate: 8 }] },
    resources: { metal: [10000, 22000], crystal: [6500, 14000], he3: [3200, 8000] },
    desc: 'Plasma Wraith — eksplodira kad umre! 20% štete svim tvojim brodovima.',
    unlock: 'Min 80k power',
  },

  // ---- 3 EPIC BOSSOVA (E1-E3) ----
  {
    id: 'boss_e1', name: 'Quantum Hydra', type: 'boss_epic', number: 1,
    difficulty: 8, min_power: 150000, icon: '👹',
    xp: 8000,
    cooldown_hours: 24,
    boss_ability: 'hydra_respawn',
    enemies: ['Hydra Head Alpha', 'Hydra Head Beta', 'Hydra Head Gamma'],
    boss: 'Quantum Hydra',
    boss_stats: { hp: 80000, shield: 30000, dps: 3000, agility: 15, speed: 2, armor: 'Chrome' },
    drops: { guaranteed: ['mod_crit_amp_III'], chance: [{ item: 'eng_hyperdrive_I', rate: 8 }, { item: 'sh_void_II', rate: 8 }, { item: 'mod_annihilator_I', rate: 6 }] },
    resources: { metal: [30000, 65000], crystal: [19000, 41000], he3: [9500, 24000] },
    desc: 'Quantum Hydra — 3 glave! Respawnuje jednom na 30% HP.',
    unlock: 'Pobijedi R1+R2+R3',
  },

  {
    id: 'boss_e2', name: 'Chrono Warden', type: 'boss_epic', number: 2,
    difficulty: 9, min_power: 250000, icon: '👹',
    xp: 9000,
    cooldown_hours: 24,
    boss_ability: 'hp_reset',
    enemies: ['Time Guardian I', 'Chrono Sentinel'],
    boss: 'Chrono Warden',
    boss_stats: { hp: 100000, shield: 40000, dps: 4000, agility: 12, speed: 1, armor: 'Regen' },
    drops: { guaranteed: ['eng_hyperdrive_II'], chance: [{ item: 'sh_immortal_I', rate: 6 }, { item: 'mod_chrono_matrix_I', rate: 8 }, { item: 'mod_fortress_core_II', rate: 6 }] },
    resources: { metal: [50000, 105000], crystal: [32000, 67000], he3: [16000, 40000] },
    desc: 'Chrono Warden — vraća HP! Jednom u borbi resetuje HP na 50%.',
    unlock: 'Pobijedi R4+R5+R6',
  },

  {
    id: 'boss_e3', name: 'Dreadnought Titan', type: 'boss_epic', number: 3,
    difficulty: 9, min_power: 350000, icon: '👹',
    xp: 9000,
    cooldown_hours: 48,
    boss_ability: 'titan_rage',
    enemies: ['Titan Escort Fleet', 'Dreadnought Titan'],
    boss: 'Dreadnought Titan',
    boss_stats: { hp: 150000, shield: 60000, dps: 5000, agility: 5, speed: 1, armor: 'Neutralizing' },
    drops: { guaranteed: ['eng_celestial_I', 'mod_annihilator_II'], chance: [{ item: 'sh_void_III', rate: 5 }, { item: 'mod_fleet_commander_I', rate: 6 }] },
    resources: { metal: [80000, 168000], crystal: [50000, 106000], he3: [25000, 63000] },
    desc: 'Dreadnought Titan — Titan Rage! Svaki preživljeni napad +10% boss DPS.',
    unlock: 'Pobijedi E1+E2',
  },

  // ---- 1 LEGENDARY BOSS (L1) ----
  {
    id: 'boss_l1', name: 'Galaxy Eater', type: 'boss_legendary', number: 1,
    difficulty: 10, min_power: 700000, icon: '🌑',
    xp: 10000,
    cooldown_hours: 168,
    boss_ability: 'four_phases',
    boss_phases: [
      { name: 'Phase 1 — Awakening', hp_pct: 100, ability: 'normal' },
      { name: 'Phase 2 — Devouring', hp_pct: 75, ability: 'aoe_damage' },
      { name: 'Phase 3 — Consuming', hp_pct: 50, ability: 'ship_absorb' },
      { name: 'Phase 4 — Ascension', hp_pct: 25, ability: 'self_heal' },
    ],
    enemies: ['Galaxy Eater Void Spawn', 'Galaxy Eater Core'],
    boss: 'Galaxy Eater',
    boss_stats: { hp: 600000, shield: 200000, dps: 8000, agility: 8, speed: 1, armor: 'Neutralizing' },
    drops: { guaranteed: ['eng_celestial_III', 'mod_fleet_commander_II'], chance: [{ item: 'sh_immortal_III', rate: 5 }, { item: 'mod_chrono_matrix_III', rate: 5 }, { item: 'mod_annihilator_III', rate: 4 }] },
    resources: { metal: [250000, 530000], crystal: [158000, 334000], he3: [79000, 167000] },
    desc: 'Galaxy Eater — 4 faze! Faza 3: apsorb jednog slota. Faza 4: self-heal.',
    unlock: 'Pobijedi E1+E2+E3',
  },

  // ════════════════════════════════════════════
  // CONSTELLATION (1-3)
  // ════════════════════════════════════════════

  {
    id: 'const_1', name: 'Constellation 1', type: 'constellation', number: 1,
    difficulty: 9,
    min_power: 500000,
    icon: '⭐',
    enemies: ['Constellation Guardian I', 'Star Dreadnought I'],
    boss: 'Constellation Prime',
    drops: {
      guaranteed: ['sh_immortal_I', 'eng_celestial_I'],
      chance: [
        { item: 'special_AllianceAdmiral_I', rate: 4 },
        { item: 'special_PresidioOfGlory_I', rate: 4 },
        { item: 'mod_fleet_commander_I', rate: 8 },
      ],
    },
    resources: { metal: [150000, 320000], crystal: [95000, 200000], he3: [47500, 120000] },
    desc: 'Immortal I i Celestial I garantirani. Alliance Admiral šansa.',
    unlock: 'Trial 8 završena + min 500k power',
  },

  {
    id: 'const_2', name: 'Constellation 2', type: 'constellation', number: 2,
    difficulty: 10,
    min_power: 750000,
    icon: '⭐',
    enemies: ['Constellation Guardian II', 'Star Carrier I'],
    boss: 'Constellation Overlord',
    drops: {
      guaranteed: ['sh_immortal_II', 'eng_celestial_II'],
      chance: [
        { item: 'mod_fleet_commander_II', rate: 6 },
        { item: 'mod_chrono_matrix_II', rate: 6 },
        { item: 'sh_void_II', rate: 8 },
      ],
    },
    resources: { metal: [220000, 460000], crystal: [140000, 295000], he3: [70000, 178000] },
    desc: 'Immortal II i Celestial II garantirani. Fleet Commander II šansa.',
    unlock: 'Constellation 1 završena',
  },

  {
    id: 'const_3', name: 'Constellation 3', type: 'constellation', number: 3,
    difficulty: 10,
    min_power: 1000000,
    icon: '⭐',
    enemies: ['Constellation Supreme', 'Star Flagship'],
    boss: 'Constellation God-Emperor',
    drops: {
      guaranteed: ['sh_immortal_III', 'eng_celestial_III'],
      chance: [
        { item: 'special_StrikingSword_I', rate: 4 },
        { item: 'mod_fleet_commander_III', rate: 4 },
        { item: 'mod_chrono_matrix_III', rate: 4 },
      ],
    },
    resources: { metal: [320000, 670000], crystal: [202000, 425000], he3: [101000, 255000] },
    desc: 'Immortal III i Celestial III garantirani. Striking Sword i Fleet Commander III šansa.',
    unlock: 'Constellation 2 završena',
  },

  // ════════════════════════════════════════════
  // MASTER BOSS — THE HIVE GOD
  // ════════════════════════════════════════════

  {
    id: 'boss_master', name: 'THE HIVE GOD', type: 'boss_master', number: 0,
    difficulty: 10,
    min_power: 1000000,
    icon: '👑',
    xp: 100000,
    cooldown_hours: 168,
    boss_ability: 'all_abilities',
    enemies: ['Hive God Spawn Wave 1', 'Hive God Spawn Wave 2', 'Hive God Core'],
    boss: 'THE HIVE GOD',
    boss_stats: { hp: 1000000, shield: 400000, dps: 12000, agility: 10, speed: 2, armor: 'Neutralizing' },
    drops: {
      guaranteed: ['sh_divine_I', 'mod_divine_core_I', 'eng_divine_I'],
      chance: [
        { item: 'w_elite_squadron_III', rate: 20 },
        { item: 'w_bomber_squadron_III', rate: 20 },
      ],
    },
    resources: { metal: [500000, 1000000], crystal: [315000, 630000], he3: [157500, 315000] },
    desc: 'THE HIVE GOD — Master Boss. Sve mehanike kombinovano. Jedino mjesto za Divine opremu.',
    unlock: 'Min 1M power + pobijedi Galaxy Eater',
    respawn: 'weekly',
  },

  // ════════════════════════════════════════════
  // BOSS EVENT (globalni, rijedak) — LEGACY
  // ════════════════════════════════════════════

  {
    id: 'boss_event', name: 'Boss Event', type: 'boss', number: null,
    difficulty: 10,
    min_power: 800000,
    icon: '👹',
    xp: 100000,
    enemies: ['Global Boss Phase 1', 'Global Boss Phase 2', 'Global Boss Phase 3'],
    boss: 'THE HIVE GOD',
    drops: {
      participation: ['sh_divine_I', 'mod_divine_core_I', 'eng_divine_I', 'w_bomber_squadron_III', 'w_elite_squadron_III'],
      note: 'Drop only — ne može se craftati. Max 1 divine komponenta po igraču per event.',
    },
    resources: { metal: [500000, 1000000], crystal: [315000, 630000], he3: [157500, 315000] },
    desc: 'Globalni Boss Event. Jedino mjesto za Divine opremu. Svi igrači napadaju isti boss.',
    unlock: 'Min 800k power. Event se pojavljuje jednom sedmično.',
    respawn: 'weekly',
  },
];

// ── RARITY COLOR ──
const INSTANCE_RARITY = {
  C: { name: 'Common',    color: '#ffdd00', label: 'Obično'  },
  R: { name: 'Rare',      color: '#4488ff', label: 'Rijetko' },
  E: { name: 'Epic',      color: '#aa44ff', label: 'Epsko'   },
  L: { name: 'Legendary', color: '#ffaa00', label: 'Legenda' },
};

// ── HELPER FUNKCIJE ──

function getInstanceById(id) {
  return INSTANCES.find(i => i.id === id) || null;
}

function getInstancesByType(type) {
  return INSTANCES.filter(i => i.type === type);
}

function getInstancesByDifficulty(min, max) {
  return INSTANCES.filter(i => i.difficulty >= min && i.difficulty <= max);
}

function getInstancesForPower(playerPower) {
  return INSTANCES.filter(i => i.min_power <= playerPower);
}

function getStandardInstances() {
  return INSTANCES.filter(i => i.type === 'standard').sort((a, b) => a.number - b.number);
}

function getDropSourceForItem(itemId) {
  const sources = [];
  for (const inst of INSTANCES) {
    const { drops } = inst;
    const allDrops = [
      ...(drops.guaranteed || []),
      ...(drops.chance || []).map(c => c.item),
      ...(drops.rank_S || []),
      ...(drops.rank_A || []),
      ...(drops.rank_B || []),
      ...(drops.rank_C || []),
      ...(drops.participation || []),
    ];
    if (allDrops.includes(itemId)) sources.push(inst.name);
  }
  return sources;
}

// Export
if (typeof module !== 'undefined') {
  module.exports = {
    INSTANCES, INSTANCE_TYPES, DIFFICULTY, INSTANCE_RARITY,
    getInstanceById, getInstancesByType,
    getInstancesByDifficulty, getInstancesForPower,
    getStandardInstances, getDropSourceForItem,
  };
}