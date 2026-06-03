// ============================================================
// HIVE GALAXY — data/buildings.js
// Samo podaci o zgradama — nula logike
// ============================================================

const buildingsData = {

  // ── BAZA ──
  hq: {
    name:     'HQ',
    icon:     '🏛️',
    baseCost: 500,
    category: 'base',
    desc:     'Komandni centar. Određuje max nivo svih ostalih zgrada.',
    milestones: {
      25:  { label: 'Napredna komanda',   bonus: 'Sve zgrade -10% cijena nadogradnje',      cmdProdBonus: 10 },
      50:  { label: 'Strateški centar',   bonus: 'Build timer -25% za sve zgrade',          buildSpeedBonus: 25 },
      75:  { label: 'Galaktički štab',    bonus: 'Sve zgrade -20% cijena nadogradnje',      cmdProdBonus: 20 },
      100: { label: 'LEGENDARNI KOMAND',  bonus: 'Build timer -50%, sve zgrade -30% cijena', buildSpeedBonus: 50, cmdProdBonus: 30 },
    },
  },

  metal_mine: {
    name:     'Metal Rudnik',
    icon:     '⚙️',
    baseCost: 200,
    category: 'base',
    desc:     'Proizvodi metal. Svaki level +0.01/s.',
    prodRate: 0.01,
    energyDrain: 2,
    milestones: {
      25:  { label: 'Duboko bušenje',      bonus: '+25% metal produkcija',       metalBonus: 25 },
      50:  { label: 'Automatizovani rudnik',bonus: '+50% metal produkcija',       metalBonus: 50 },
      75:  { label: 'Nano-ekstrakcija',    bonus: '+100% metal produkcija',      metalBonus: 100 },
      100: { label: 'TITAN RUDNIK',        bonus: '+200% metal produkcija + -50% energija drain', metalBonus: 200, energyReduction: 50 },
    },
  },

  crystal_mine: {
    name:     'Crystal Rudnik',
    icon:     '💎',
    baseCost: 250,
    category: 'base',
    desc:     'Proizvodi crystal. Svaki level +0.007/s.',
    prodRate: 0.007,
    energyDrain: 2,
    milestones: {
      25:  { label: 'Kristalna rezonanca',  bonus: '+25% crystal produkcija',      crystalBonus: 25 },
      50:  { label: 'Frekventni laserski rez', bonus: '+50% crystal produkcija',   crystalBonus: 50 },
      75:  { label: 'Kvantna ekstrakcija',  bonus: '+100% crystal produkcija',     crystalBonus: 100 },
      100: { label: 'KRISTALNA MATRICA',    bonus: '+200% crystal produkcija + metal rudnik +10%', crystalBonus: 200, metalSynergyBonus: 10 },
    },
  },

  he3_refinery: {
    name:     'He3 Rafinerija',
    icon:     '⛽',
    baseCost: 300,
    category: 'base',
    desc:     'Proizvodi He3. Svaki level +0.003/s.',
    prodRate: 0.003,
    energyDrain: 3,
    milestones: {
      25:  { label: 'Fuzijska filtracija',   bonus: '+25% He3 produkcija',         he3Bonus: 25 },
      50:  { label: 'Plazmatski separator',  bonus: '+50% He3 produkcija',         he3Bonus: 50 },
      75:  { label: 'Izotopska destilacija', bonus: '+100% He3 produkcija',        he3Bonus: 100 },
      100: { label: 'SINGULARNA RAFINERIJA', bonus: '+200% He3 + energetske zgrade +10%', he3Bonus: 200, energySynergyBonus: 10 },
    },
  },

  depot: {
    name:     'Depot',
    icon:     '📦',
    baseCost: 180,
    category: 'base',
    desc:     'Magacin resursa. Igrač mora pokupiti resurse. Ako je pun — produkcija staje.',
    energyDrain: 1,
    milestones: {
      25:  { label: 'Prošireni magacin',   bonus: '+2% kapacitet  +🗝️5',  capBonus: 2  },
      50:  { label: 'Industrijska pohrana',bonus: '+5% kapacitet  +🗝️5',  capBonus: 5  },
      75:  { label: 'Kvantni kontejneri',  bonus: '+8% kapacitet  +🗝️5',  capBonus: 8  },
      100: { label: 'MEGA DEPOT',          bonus: '+15% kapacitet  +🗝️5', capBonus: 15 },
    },
  },

  ship_factory: {
    name:     'Ship Factory',
    icon:     '🏭',
    baseCost: 400,
    category: 'base',
    desc:     'Brodogradilište. Otključava klase brodova i ubrzava gradnju.',
    energyDrain: 4,
    unlocks: {
      1:  ['scout'],
      2:  ['fighter'],
      3:  ['cruiser'],
      4:  ['battleship'],
      5:  ['carrier'],
      6:  ['special'],
    },
    milestones: {
      25:  { label: 'Automatizovana linija', bonus: '+5% brzina gradnje, -5% cijena',   speedBonus: 5,  discountBonus: 5  },
      50:  { label: 'Napredno brodogradilište', bonus: '+10% brzina, -10% cijena',      speedBonus: 10, discountBonus: 10 },
      75:  { label: 'Mega fabrika',          bonus: '+15% brzina, -15% cijena',         speedBonus: 15, discountBonus: 15 },
      100: { label: 'GALAKTIČKI ARSENAL',    bonus: '+25% brzina, -20% cijena, svi brodovi +5% stats', speedBonus: 25, discountBonus: 20, shipStatBonus: 5 },
    },
  },

  // ── ENERGIJA ──
  solar: {
    name:     'Solarni Panel',
    icon:     '☀️',
    baseCost: 160,
    category: 'energy',
    desc:     'Generiše energiju. Svaki level +4 MWh/s.',
    genRate:  4,
    milestones: {
      25:  { label: 'Fotonaponska mreža',    bonus: '+25% solarna generacija',     genBonus: 25 },
      50:  { label: 'Orbitalni kolektori',   bonus: '+50% solarna generacija',     genBonus: 50 },
      75:  { label: 'Solarni prsten',        bonus: '+100% solarna generacija',    genBonus: 100 },
      100: { label: 'DYSON SFERA',           bonus: '+200% solarna + sve energetske zgrade +15%', genBonus: 200, energySynergyBonus: 15 },
    },
  },

  fusion: {
    name:     'Fuzijski Reaktor',
    icon:     '⚛️',
    baseCost: 500,
    category: 'energy',
    desc:     'Snažna energija. Svaki level +12 MWh/s, +1 MWh kapacitet.',
    genRate:  12,
    capRate:  1,      // PROMIJENJENO: sa 50 na 1
    milestones: {
      25:  { label: 'Magnetna kavez',         bonus: '+25% fuzijska generacija',    genBonus: 25 },
      50:  { label: 'Tokamak optimizacija',   bonus: '+50% fuzijska generacija',   genBonus: 50 },
      75:  { label: 'Antimaterija boost',     bonus: '+100% fuzijska generacija',  genBonus: 100 },
      100: { label: 'ZVJEZDANA SRCA',         bonus: '+200% fuzijska + kapacitet x3', genBonus: 200, capMultiplier: 3 },
    },
  },

  battery: {
    name:     'Baterijski Blok',
    icon:     '🔋',
    baseCost: 220,
    category: 'energy',
    desc:     'Skladišti energiju. Svaki level +1 MWh/s, +97 MWh kapacitet.',
    genRate:  1,      // PROMIJENJENO: sa 3 na 1
    capRate:  97,     // PROMIJENJENO: sa 30 na 97
    milestones: {
      25:  { label: 'Superkondenzator',       bonus: '+25% kapacitet',             capBonus: 25 },
      50:  { label: 'Nano-ćelije',            bonus: '+50% kapacitet',             capBonus: 50 },
      75:  { label: 'Kvantna baterija',       bonus: '+100% kapacitet',            capBonus: 100 },
      100: { label: 'PERPETUUM MOBILE',       bonus: '+200% kapacitet + ne može pasti ispod 20%', capBonus: 200, minEnergyPct: 20 },
    },
  },

  grid: {
    name:     'Električna Mreža',
    icon:     '⚡',
    baseCost: 180,
    category: 'energy',
    desc:     'Optimizuje distribuciju energije. Svaki level -0.5% drain svih zgrada. Lv100 = -50% drain.',
    genRate:  1,      // PROMIJENJENO: sa 2/5 na 1
    capRate:  1,      // PROMIJENJENO: sa 20/25 na 1
    milestones: {
      25:  { label: 'Optimizovana mreža',    bonus: '-12.5% drain svih zgrada' },
      50:  { label: 'Supravodič',            bonus: '-25% drain svih zgrada'   },
      75:  { label: 'Kvantna distribucija',  bonus: '-37.5% drain svih zgrada' },
      100: { label: 'BESKONAČNA EFIKASNOST', bonus: '-50% drain svih zgrada'   },
    },
  },

  // ── ODBRANA ──
  turret: {
    name:     'Laserski Top',
    icon:     '🔫',
    baseCost: 280,
    category: 'defense',
    desc:     'Osnovna odbrana baze. Svaki level +80 odbrana.',
    defRate:  80,
    energyDrain: 2,
    milestones: {
      25:  { label: 'Automatsko ciljanje',    bonus: '+25% odbrana, +10% napad flote', defBonus: 25, fleetAtkBonus: 10 },
      50:  { label: 'Plazmeni top',           bonus: '+50% odbrana',                  defBonus: 50 },
      75:  { label: 'Anti-capital oružje',    bonus: '+100% odbrana',                 defBonus: 100 },
      100: { label: 'ORBITALN KANON',         bonus: '+200% odbrana + razara sve neprijatelje Lv<5', defBonus: 200 },
    },
  },

  missile_bat: {
    name:     'Raketna Baterija',
    icon:     '🚀',
    baseCost: 350,
    category: 'defense',
    desc:     'Protivraketna odbrana. Svaki level +80 odbrana.',
    defRate:  80,
    energyDrain: 3,
    milestones: {
      25:  { label: 'Višestepene rakete',     bonus: '+25% odbrana, blokira špijunažu',  defBonus: 25, blockEsp: true },
      50:  { label: 'Nuklearni bojevi',       bonus: '+50% odbrana',                     defBonus: 50 },
      75:  { label: 'Orbitalni interceptor',  bonus: '+100% odbrana',                    defBonus: 100 },
      100: { label: 'APOKALIPSA',             bonus: '+200% odbrana + kontranapd pri PvP porazu', defBonus: 200 },
    },
  },

  shield_gen: {
    name:     'Shield Generator',
    icon:     '🛡️',
    baseCost: 420,
    category: 'defense',
    desc:     'Energetski štit baze. Svaki level +80 odbrana.',
    defRate:  80,
    energyDrain: 4,
    milestones: {
      25:  { label: 'Fazni štit',             bonus: '+25% odbrana baze, flota +10% shield', defBonus: 25, fleetShieldBonus: 10 },
      50:  { label: 'Harmonični štit',        bonus: '+50% odbrana',                        defBonus: 50 },
      75:  { label: 'Kvantni štit',           bonus: '+100% odbrana',                       defBonus: 100 },
      100: { label: 'NEPROBOJAN ŠTIT',        bonus: '+200% odbrana + baza ne može biti uništena', defBonus: 200 },
    },
  },

  sensor: {
    name:     'Senzorski Toranj',
    icon:     '📡',
    baseCost: 190,
    category: 'defense',
    desc:     'Detekcija neprijatelja. Svaki level +80 odbrana.',
    defRate:  80,
    energyDrain: 1,
    milestones: {
      25:  { label: 'Dubok sken',             bonus: '+25% odbrana, +25% špijunažna šansa', defBonus: 25, espBonus: 25 },
      50:  { label: 'Kvantni senzori',        bonus: '+50% odbrana',                        defBonus: 50 },
      75:  { label: 'Galaktički radar',       bonus: '+100% odbrana + detektuje špijune',   defBonus: 100 },
      100: { label: 'SVEVIDEĆE OKO',          bonus: '+200% odbrana + znaš sve o neprijatelju', defBonus: 200 },
    },
  },

  // ── SPECIJALNE ZGRADE ──
  jump_gate: {
    name:     'Jump Gate',
    icon:     '🌀',
    baseCost: 800,
    category: 'special',
    desc:     'Prebacuje brodove na kolonije. Svaki level +1 sistem dometa.',
    energyDrain: 5,
    milestones: {
      25:  { label: 'Stabilni koridor',       bonus: '+1 max kolonija, brži transit',    extraColony: 1 },
      50:  { label: 'Wormhole mreža',         bonus: '+2 max kolonije, instant transit', extraColony: 2 },
      75:  { label: 'Galaktički portali',     bonus: '+3 max kolonije',                  extraColony: 3 },
      100: { label: 'BESKONAČNI SKOK',        bonus: '+5 max kolonija + teleport svuda', extraColony: 5 },
    },
  },

  laboratory: {
    name:     'Laboratory',
    icon:     '🔬',
    baseCost: 600,
    category: 'special',
    desc:     'Limitira max nivo istraživanja. Lv1 = Research Lv1, Lv100 = Research Lv100.',
    energyDrain: 4,
    milestones: {
      25:  { label: 'Napredni lab',           bonus: 'Istraživanje -20% cijena',         researchDiscount: 20 },
      50:  { label: 'Kvantni lab',            bonus: 'Istraživanje -35% cijena',         researchDiscount: 35 },
      75:  { label: 'Xenotehnološki centar',  bonus: 'Istraživanje -50% cijena',         researchDiscount: 50 },
      100: { label: 'SINGULARNOST',           bonus: 'Sva istraživanja instant + -75% cijena', researchDiscount: 75, researchInstant: true },
    },
  },

  recycler: {
    name:     'Recycler',
    icon:     '♻️',
    baseCost: 450,
    category: 'special',
    desc:     'Reciklira brodove za resurse. Lv1=20%, Lv100=100% original cijene.',
    energyDrain: 3,
    milestones: {
      25:  { label: 'Napredna reciklaža',     bonus: 'Povrat +5% bonus (iznad osnovnog)',   rateBonus: 5 },
      50:  { label: 'Nano-rastavljač',        bonus: 'Povrat +10% bonus + brza reciklaža',  rateBonus: 10 },
      75:  { label: 'Atomski reprocessor',    bonus: 'Povrat +15% bonus',                   rateBonus: 15 },
      100: { label: 'MATERIJA RECIKLER',      bonus: 'Povrat 100% + šansa za blueprint fragment', rateBonus: 20, bpFragmentChance: 10 },
    },
  },
};

// ── RARITY BOJE PO NIVOU (svaka zgrada) ──
function getBuildingNameColor(level) {
  if (level >= 75) return '#ff6600';  // Legendary — narandžasta
  if (level >= 50) return '#cc33ff';  // Epic      — ljubičasta
  if (level >= 25) return '#3399ff';  // Rare      — plava
  return '#ffcc00';                   // Common    — žuta
}

// ── MILESTONE INFO ZA ZGRADU ──
function getBuildingMilestones(key) {
  return buildingsData[key]?.milestones || {};
}

// ── SLJEDEĆI MILESTONE ──
function getNextMilestone(key) {
  const level      = buildings[key]?.level || 0;
  const milestones = getBuildingMilestones(key);
  const levels     = Object.keys(milestones).map(Number).sort((a, b) => a - b);
  return levels.find(lvl => lvl > level) || null;
}

// ── PRETHODNI (aktivni) MILESTONE ──
function getActiveMilestone(key) {
  const level      = buildings[key]?.level || 0;
  const milestones = getBuildingMilestones(key);
  const levels     = Object.keys(milestones).map(Number).sort((a, b) => b - a);
  const reached    = levels.find(lvl => lvl <= level);
  return reached ? milestones[reached] : null;
}

// ── MILESTONE HTML ZA KARTICU ──
function renderMilestoneBar(key) {
  const level      = buildings[key]?.level || 0;
  const milestones = getBuildingMilestones(key);
  const mLevels    = Object.keys(milestones).map(Number).sort((a, b) => a - b);
  if (mLevels.length === 0) return '';

  const nextMlvl   = mLevels.find(lvl => lvl > level);
  const activeMlvl = [...mLevels].reverse().find(lvl => lvl <= level);

  let html = `<div style="margin:8px 0">`;

  // Progress do sljedećeg milestonea
  if (nextMlvl) {
    const prevMlvl = activeMlvl || 0;
    const pct      = ((level - prevMlvl) / (nextMlvl - prevMlvl)) * 100;
    const m        = milestones[nextMlvl];
    html += `
      <div style="display:flex;justify-content:space-between;font-size:0.58rem;
        color:#6a90b8;margin-bottom:3px">
        <span>🎯 ${m.label}</span>
        <span style="color:#ffcc44">Lv.${nextMlvl} (još ${nextMlvl - level})</span>
      </div>
      <div style="background:rgba(0,0,0,0.4);border-radius:3px;height:4px;overflow:hidden;margin-bottom:4px">
        <div style="height:100%;width:${Math.min(100,pct)}%;
          background:linear-gradient(90deg,#ffcc44aa,#ffcc44);transition:width 0.3s"></div>
      </div>
      <div style="font-size:0.55rem;color:#ffcc4488">${m.bonus}</div>`;
  }

  // Aktivni milestone badge
  if (activeMlvl) {
    const m = milestones[activeMlvl];
    html += `
      <div style="margin-top:5px;background:rgba(255,204,68,0.08);border:1px solid rgba(255,204,68,0.25);
        border-radius:4px;padding:3px 7px;display:inline-block;font-size:0.55rem;color:#ffcc44">
        ✨ ${m.label}: ${m.bonus}
      </div>`;
  }

  // Milestone markeri (sve 4 tačke)
  html += `<div style="display:flex;gap:3px;margin-top:5px;align-items:center">`;
  mLevels.forEach(mlvl => {
    const reached = level >= mlvl;
    const isNext  = mlvl === nextMlvl;
    html += `
      <div title="Lv.${mlvl}: ${milestones[mlvl].label}" style="
        width:${isNext ? 10 : 8}px;height:${isNext ? 10 : 8}px;border-radius:50%;
        background:${reached ? '#ffcc44' : isNext ? '#ffcc4444' : '#1a2540'};
        border:1px solid ${reached ? '#ffcc44' : isNext ? '#ffcc44' : '#2a3a5a'};
        box-shadow:${reached ? '0 0 4px #ffcc4466' : 'none'};
        transition:all 0.3s;cursor:help;
      "></div>`;
  });
  html += `<span style="font-size:0.55rem;color:#6a90b8;margin-left:4px">${level}/100</span>`;
  html += `</div>`;

  html += `</div>`;
  return html;
}

// ── CIJENA NADOGRADNJE ──
function getBuildingCost(key) {
  const b = buildingsData[key];
  if (!b) return { metal: 0, crystal: 0, he3: 0 };
  const level = buildings[key]?.level || 1;
  const metal = Math.floor(b.baseCost * Math.pow(1.15, level));
  return {
    metal:   metal,
    crystal: Math.floor(metal * 0.6),
    he3:     Math.floor(metal * 0.35),
  };
}

// ── DEPOT KAPACITET ──
function getDepotCapacity() {
  const level    = buildings.depot?.level || 1;
  const base     = Math.floor(220 + (level - 1) * (22000 - 220) / 99);
  const milestoneM = getBuildingMilestones('depot');
  // Saberi sve dostignute capBonus vrijednosti
  let capBonus   = 0;
  Object.entries(milestoneM).forEach(([mlvl, data]) => {
    if (level >= parseInt(mlvl) && data.capBonus) {
      capBonus += data.capBonus;
    }
  });
  return Math.floor(base * (1 + capBonus / 100));
}

// ── PRODUKCIJA BONUS IZ MILESTONA ──
function getMetalMilestoneBonus() {
  const level = buildings.metal_mine?.level || 0;
  const m     = getBuildingMilestones('metal_mine');
  let bonus   = 0;
  Object.entries(m).forEach(([mlvl, data]) => {
    if (level >= parseInt(mlvl) && data.metalBonus) bonus = Math.max(bonus, data.metalBonus);
  });
  return bonus; // u %
}

function getCrystalMilestoneBonus() {
  const level = buildings.crystal_mine?.level || 0;
  const m     = getBuildingMilestones('crystal_mine');
  let bonus   = 0;
  Object.entries(m).forEach(([mlvl, data]) => {
    if (level >= parseInt(mlvl) && data.crystalBonus) bonus = Math.max(bonus, data.crystalBonus);
  });
  return bonus;
}

function getHe3MilestoneBonus() {
  const level = buildings.he3_refinery?.level || 0;
  const m     = getBuildingMilestones('he3_refinery');
  let bonus   = 0;
  Object.entries(m).forEach(([mlvl, data]) => {
    if (level >= parseInt(mlvl) && data.he3Bonus) bonus = Math.max(bonus, data.he3Bonus);
  });
  return bonus;
}

// ── SHIP FACTORY BONUSI ──
function getShipFactorySpeedBonus() {
  const level = buildings.ship_factory?.level || 1;
  let bonus   = level * 1;
  const m     = buildingsData.ship_factory.milestones;
  Object.entries(m).forEach(([lvl, data]) => {
    if (level >= parseInt(lvl)) bonus += data.speedBonus;
  });
  return bonus;
}

function getShipFactoryDiscount() {
  const level    = buildings.ship_factory?.level || 1;
  let discount   = 0;
  const m        = buildingsData.ship_factory.milestones;
  Object.entries(m).forEach(([lvl, data]) => {
    if (level >= parseInt(lvl)) discount += data.discountBonus;
  });
  return discount;
}

function getUnlockedShipClasses() {
  const level   = buildings.ship_factory?.level || 1;
  const unlocked = [];
  Object.entries(buildingsData.ship_factory.unlocks).forEach(([lvl, classes]) => {
    if (level >= parseInt(lvl)) unlocked.push(...classes);
  });
  return unlocked;
}

// ── JUMP GATE ──
function getJumpGateRange() {
  return buildings.jump_gate?.level || 0;
}

function getMaxColonies() {
  const jgLevel = buildings.jump_gate?.level || 0;
  if (jgLevel === 0) return 0;
  let base = Math.min(9, Math.floor(jgLevel / 10) + 1);
  // Milestone bonus
  const m  = getBuildingMilestones('jump_gate');
  let extra = 0;
  Object.entries(m).forEach(([mlvl, data]) => {
    if (jgLevel >= parseInt(mlvl) && data.extraColony) extra = Math.max(extra, data.extraColony);
  });
  return Math.min(12, base + extra);
}

// ── LABORATORY ──
function getMaxResearchLevel() {
  return buildings.laboratory?.level || 0;
}

function canResearch(branch) {
  const labLevel = getMaxResearchLevel();
  if (labLevel === 0) return false;
  return (research[branch]?.level || 0) < labLevel;
}

function getResearchDiscount() {
  const level = buildings.laboratory?.level || 0;
  const m     = getBuildingMilestones('laboratory');
  let discount = 0;
  Object.entries(m).forEach(([mlvl, data]) => {
    if (level >= parseInt(mlvl) && data.researchDiscount) discount = Math.max(discount, data.researchDiscount);
  });
  return discount;
}

// ── RECYCLER ──
function getRecycleRate() {
  const level = buildings.recycler?.level || 0;
  if (level === 0) return 0;
  let rate    = Math.min(100, 20 + (level - 1) * 0.8081);
  // Milestone bonus
  const m     = getBuildingMilestones('recycler');
  let bonus   = 0;
  Object.entries(m).forEach(([mlvl, data]) => {
    if (level >= parseInt(mlvl) && data.rateBonus) bonus = Math.max(bonus, data.rateBonus);
  });
  return Math.min(100, rate + bonus);
}

function getRecycleResources(ship, count) {
  const cost = getShipBuildCost(ship);
  const rate = getRecycleRate() / 100;
  return {
    metal:   Math.floor(cost.metal   * count * rate),
    crystal: Math.floor(cost.crystal * count * rate),
    he3:     Math.floor(cost.he3     * count * rate),
  };
}

// ── TIMER — GRADNJA ZGRADA ──
function getBuildingTimerSec(key) {
  const currentLevel = buildings[key]?.level || 0;
  let secs           = (currentLevel + 1) * 60;
  // HQ milestone speedBonus
  const hqLevel = buildings.hq?.level || 0;
  const hqM     = getBuildingMilestones('hq');
  let speedBonus = 0;
  Object.entries(hqM).forEach(([mlvl, data]) => {
    if (hqLevel >= parseInt(mlvl) && data.buildSpeedBonus) speedBonus = Math.max(speedBonus, data.buildSpeedBonus);
  });
  if (speedBonus > 0) secs = Math.floor(secs * (1 - speedBonus / 100));
  return Math.max(5, secs);
}

function formatTimer(seconds) {
  if (seconds <= 0) return '0s';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function getBuildingBoostCost(key) {
  const currentLevel = buildings[key]?.level || 0;
  return (currentLevel + 1) * 10;
}