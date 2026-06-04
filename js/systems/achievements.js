// ============================================================
// HIVE GALAXY — js/systems/achievements.js
// Dostignuća — NOVI SISTEM sa milestone nagradama
// ============================================================

// ============================================================
// 1. BAZA — 17 zgrada, svaka do 100 levela
// ============================================================

function generateBuildingAchievements() {
  const buildingsList = [
    'hq', 'metal_mine', 'crystal_mine', 'he3_refinery', 'depot', 'ship_factory',
    'solar', 'fusion', 'battery', 'grid',
    'turret', 'missile_bat', 'shield_gen', 'sensor',
    'jump_gate', 'laboratory', 'recycler'
  ];
  
  const achievements = [];
  
  buildingsList.forEach(buildingKey => {
    const building = buildingsData[buildingKey];
    if (!building) return;
    
    // Svakih 5 levela (5,10,15,20...100)
    for (let level = 5; level <= 100; level += 5) {
      let reward = { metal: level * 200, crystal: level * 100, he3: level * 50, xp: level * 10 };
      
      // Posebne nagrade na milestone levelima
      if (level === 25) {
        reward.art_fragment = 'C';
        reward.instanceKeys = 2;
      } else if (level === 50) {
        reward.art_fragment = 'R';
        reward.instanceKeys = 5;
        reward.bpw = 100;
      } else if (level === 75) {
        reward.art_fragment = 'E';
        reward.instanceKeys = 10;
        reward.bpw = 250;
      } else if (level === 100) {
        reward.fullBlueprint = true;
        reward.instanceKeys = 20;
        reward.bpw = 500;
        reward.art_fragment = 'L';
      } else if (level % 10 === 0) {
        reward.instanceKeys = 1;
      }
      
      achievements.push({
        category: 'base',
        id: `${buildingKey}_lvl_${level}`,
        tier: Math.ceil(level / 20),
        name: `${building.name} Lv.${level}`,
        icon: building.icon,
        desc: `Unapredi ${building.name} na Lv.${level}`,
        check: () => (buildings[buildingKey]?.level || 0) >= level,
        reward: reward,
        requires: level > 5 ? `${buildingKey}_lvl_${level-5}` : null
      });
    }
  });
  
  return achievements;
}

// ============================================================
// 2. BORBA — Instance, PvP, Fleet Power
// ============================================================

// Instance završene (ukupno)
const INSTANCE_COUNTS = [1, 5, 10, 25, 50, 100, 250, 500, 1000];
// Instance milestone nagrade
const INSTANCE_MILESTONES = [
  { count: 1, reward: { metal: 2000, crystal: 1000, he3: 500, xp: 200, instanceKeys: 1 } },
  { count: 5, reward: { metal: 5000, crystal: 2500, he3: 1000, xp: 500, instanceKeys: 2 } },
  { count: 10, reward: { metal: 10000, crystal: 5000, he3: 2000, xp: 1000, instanceKeys: 3, bpw: 50 } },
  { count: 25, reward: { metal: 25000, crystal: 12000, he3: 5000, xp: 2500, instanceKeys: 5, art_fragment: 'C' } },
  { count: 50, reward: { metal: 50000, crystal: 25000, he3: 10000, xp: 5000, instanceKeys: 10, bpw: 150, art_fragment: 'R' } },
  { count: 100, reward: { metal: 100000, crystal: 50000, he3: 20000, xp: 10000, instanceKeys: 15, bpw: 300, art_fragment: 'E' } },
  { count: 250, reward: { metal: 250000, crystal: 125000, he3: 50000, xp: 25000, instanceKeys: 25, bpw: 750, art_fragment: 'E' } },
  { count: 500, reward: { metal: 500000, crystal: 250000, he3: 100000, xp: 50000, instanceKeys: 40, bpw: 1500, art_fragment: 'L' } },
  { count: 1000, reward: { metal: 1000000, crystal: 500000, he3: 200000, xp: 100000, instanceKeys: 75, bpw: 3000, art_fragment: 'L' } }
];

// Boss instance završene
const BOSS_INSTANCES = [
  { id: 'inst_30', name: 'Instanca 30', reward: { metal: 200000, crystal: 100000, he3: 50000, xp: 20000, instanceKeys: 10, bpw: 500, fullBlueprint: true } },
  { id: 'rest_10', name: 'Restricted 10', reward: { metal: 500000, crystal: 250000, he3: 125000, xp: 50000, instanceKeys: 20, bpw: 1000, fullBlueprint: true } },
  { id: 'trial_10', name: 'Trial 10', reward: { metal: 1000000, crystal: 500000, he3: 250000, xp: 100000, instanceKeys: 30, bpw: 2000, fullBlueprint: true, art_fragment: 'L' } },
  { id: 'const_3', name: 'Constellation 3', reward: { metal: 2000000, crystal: 1000000, he3: 500000, xp: 200000, instanceKeys: 50, bpw: 5000, fullBlueprint: true, art_fragment: 'L' } }
];

// PvP pobede
const PVP_WINS = [1, 5, 10, 25, 50, 100, 250, 500];
// PvP rating
const PVP_RATINGS = [1100, 1200, 1300, 1400, 1500, 1750, 2000, 2500];

// Fleet Power
const FLEET_POWERS = [10000, 25000, 50000, 100000, 250000, 500000, 1000000, 5000000, 10000000];

// ============================================================
// 3. ISTRAŽIVANJE — 8 grana, svaka do 100 levela
// ============================================================

const RESEARCH_BRANCHES_ACH = [
  'mining_metal', 'mining_crystal', 'mining_he3', 'weapons', 'shields', 'armor', 'espionage', 'energy'
];

function generateResearchAchievements() {
  const achievements = [];
  
  RESEARCH_BRANCHES_ACH.forEach(branch => {
    const branchName = RESEARCH_BRANCHES[branch]?.name || branch;
    const branchIcon = RESEARCH_BRANCHES[branch]?.icon || '🔬';
    
    // Svakih 10 levela
    for (let level = 10; level <= 100; level += 10) {
      let reward = { metal: level * 500, crystal: level * 300, he3: level * 150, xp: level * 50 };
      
      if (level === 25) reward.art_fragment = 'C';
      else if (level === 50) { reward.art_fragment = 'R'; reward.bpw = 100; }
      else if (level === 75) { reward.art_fragment = 'E'; reward.bpw = 250; }
      else if (level === 100) { reward.fullBlueprint = true; reward.bpw = 500; reward.art_fragment = 'L'; }
      
      achievements.push({
        category: 'research',
        id: `${branch}_lvl_${level}`,
        tier: Math.ceil(level / 25),
        name: `${branchName} Lv.${level}`,
        icon: branchIcon,
        desc: `Istraži ${branchName} na Lv.${level}`,
        check: () => (research[branch]?.level || 0) >= level,
        reward: reward,
        requires: level > 10 ? `${branch}_lvl_${level-10}` : null
      });
    }
  });
  
  return achievements;
}

// ============================================================
// 4. KOLEKCIJA — Skupljanje blueprinta po klasama i rarity
// ============================================================

function getBlueprintsByClassAndRarity(shipClass, rarity) {
  const ships = SHIPS[shipClass] || [];
  return ships.filter(s => s.rarity === rarity).map(s => s.id);
}

const COLLECTION_MILESTONES = {
  scout: { C: 10, R: 10, E: 8, L: 4 },
  fighter: { C: 12, R: 12, E: 9, L: 5 },
  cruiser: { C: 10, R: 14, E: 12, L: 6 },
  battleship: { C: 9, R: 9, E: 9, L: 6 },
  carrier: { C: 8, R: 8, E: 8, L: 6 },
  special: { C: 0, R: 0, E: 2, L: 8 }
};

function generateCollectionAchievements() {
  const achievements = [];
  
  // Po klasama i rarity
  Object.entries(COLLECTION_MILESTONES).forEach(([className, rarities]) => {
    Object.entries(rarities).forEach(([rarity, totalCount]) => {
      if (totalCount === 0) return;
      
      const milestones = [Math.floor(totalCount * 0.25), Math.floor(totalCount * 0.5), Math.floor(totalCount * 0.75), totalCount].filter(m => m > 0);
      
      milestones.forEach((count, idx) => {
        const percent = idx === 0 ? 25 : idx === 1 ? 50 : idx === 2 ? 75 : 100;
        achievements.push({
          category: 'collection',
          id: `${className}_${rarity}_${percent}`,
          tier: idx + 1,
          name: `${SHIP_CLASSES[className]?.name || className} ${rarity} kolekcija`,
          icon: SHIP_CLASSES[className]?.icon || '🚀',
          desc: `Skupi ${percent}% ${rarity} ${SHIP_CLASSES[className]?.name || className} brodova (${count}/${totalCount})`,
          check: () => {
            const ships = SHIPS[className] || [];
            const owned = ships.filter(s => s.rarity === rarity && ownedBlueprints[s.id]).length;
            return owned >= count;
          },
          reward: percent === 100 ? { art_fragment: rarity === 'C' ? 'C' : rarity === 'R' ? 'R' : rarity === 'E' ? 'E' : 'L', bpw: rarity === 'L' ? 500 : 100, fullBlueprint: true }
                               : { art_fragment: rarity === 'C' ? 'C' : rarity === 'R' ? 'R' : rarity === 'E' ? 'E' : 'L', bpw: 50 }
        });
      });
    });
  });
  
  return achievements;
}

// ============================================================
// 5. EKONOMIJA — Resursi i Depot
// ============================================================

const RESOURCE_MILESTONES = {
  metal: [1000000, 5000000, 10000000, 25000000, 50000000, 100000000, 500000000, 1000000000],
  crystal: [500000, 2000000, 5000000, 10000000, 25000000, 50000000, 250000000, 500000000],
  he3: [250000, 1000000, 2500000, 5000000, 10000000, 25000000, 100000000, 250000000]
};

const DEPOT_PICKUPS = [10, 50, 100, 250, 500, 1000];

// ============================================================
// 6. ŠPIJUNAŽA
// ============================================================

const ESPIONAGE_MILESTONES = [1, 5, 10, 25, 50, 100];
const ESP_RESEARCH_MILESTONES = [25, 50, 75, 100];

// ============================================================
// GENERIŠI SVE ACHIEVEMENTE
// ============================================================

let ACHIEVEMENTS = [];

// Baza
ACHIEVEMENTS.push(...generateBuildingAchievements());

// Instance ukupno
INSTANCE_MILESTONES.forEach(m => {
  ACHIEVEMENTS.push({
    category: 'combat', id: `inst_total_${m.count}`, tier: m.count <= 10 ? 1 : m.count <= 50 ? 2 : m.count <= 250 ? 3 : 4,
    name: `Osvajač Instanci`, icon: '⚔️', desc: `Pređi ${m.count} instanci ukupno`,
    check: () => { const prog = window._instProgress; return prog && Object.values(prog).reduce((a, p) => a + (p?.clear_count || 0), 0) >= m.count; },
    reward: m.reward, requires: m.count > 1 ? `inst_total_${INSTANCE_MILESTONES[INSTANCE_MILESTONES.findIndex(x => x.count === m.count) - 1]?.count}` : null
  });
});

// Boss instance
BOSS_INSTANCES.forEach(boss => {
  ACHIEVEMENTS.push({
    category: 'combat', id: `boss_${boss.id}`, tier: 5,
    name: `${boss.name} Osvajač`, icon: '👹', desc: `Završi ${boss.name}`,
    check: () => window._instProgress?.[boss.id]?.completed,
    reward: boss.reward
  });
});

// PvP pobede
PVP_WINS.forEach((count, idx) => {
  ACHIEVEMENTS.push({
    category: 'combat', id: `pvp_wins_${count}`, tier: count <= 10 ? 1 : count <= 50 ? 2 : count <= 250 ? 3 : 4,
    name: `Arena Borac`, icon: '🏟️', desc: `Pobijedi u ${count} PvP borbi`,
    check: () => pvp.wins >= count,
    reward: { metal: count * 500, crystal: count * 250, he3: count * 100, xp: count * 50, bpw: count <= 10 ? 10 : count <= 50 ? 50 : count <= 250 ? 150 : 300 },
    requires: idx > 0 ? `pvp_wins_${PVP_WINS[idx-1]}` : null
  });
});

// PvP rating
PVP_RATINGS.forEach((rating, idx) => {
  ACHIEVEMENTS.push({
    category: 'combat', id: `pvp_rating_${rating}`, tier: rating <= 1200 ? 1 : rating <= 1500 ? 2 : rating <= 2000 ? 3 : 4,
    name: `Rating ${rating}`, icon: '📈', desc: `Dostigni PvP rating ${rating}`,
    check: () => pvp.rating >= rating,
    reward: { bpw: rating === 2500 ? 1000 : rating === 2000 ? 500 : rating === 1500 ? 200 : 100, instanceKeys: rating === 2500 ? 20 : rating === 2000 ? 10 : rating === 1500 ? 5 : 2 }
  });
});

// Fleet Power
FLEET_POWERS.forEach((power, idx) => {
  ACHIEVEMENTS.push({
    category: 'combat', id: `fleet_power_${power}`, tier: power <= 100000 ? 1 : power <= 500000 ? 2 : power <= 2000000 ? 3 : 4,
    name: `Flota Moć ${typeof fmt === 'function' ? fmt(power) : power}`, icon: '💫', desc: `Dostigni ${typeof fmt === 'function' ? fmt(power) : power} Fleet Power`,
    check: () => (typeof calcFleetTotalPower === 'function' ? calcFleetTotalPower() : 0) >= power,
    reward: { metal: power / 10, crystal: power / 20, he3: power / 40, xp: power / 100, instanceKeys: power <= 100000 ? 2 : power <= 500000 ? 5 : power <= 2000000 ? 10 : 20 }
  });
});

// Istraživanje
ACHIEVEMENTS.push(...generateResearchAchievements());

// Kolekcija
ACHIEVEMENTS.push(...generateCollectionAchievements());

// Ekonomija — Metal
RESOURCE_MILESTONES.metal.forEach((amount, idx) => {
  ACHIEVEMENTS.push({
    category: 'economy', id: `metal_${amount}`, tier: amount <= 10000000 ? 1 : amount <= 100000000 ? 2 : 3,
    name: `Rudar Metala`, icon: '🔩', desc: `Skupi ukupno ${typeof fmt === 'function' ? fmt(amount) : amount} metala`,
    check: () => (window._totalMetalMined || 0) >= amount,
    reward: { metal: amount * 0.1, crystal: amount * 0.05, he3: amount * 0.02, xp: amount / 1000, bpw: amount <= 10000000 ? 50 : amount <= 100000000 ? 200 : 500 }
  });
});

// Ekonomija — Crystal
RESOURCE_MILESTONES.crystal.forEach((amount, idx) => {
  ACHIEVEMENTS.push({
    category: 'economy', id: `crystal_${amount}`, tier: amount <= 5000000 ? 1 : amount <= 50000000 ? 2 : 3,
    name: `Rudar Crystala`, icon: '💎', desc: `Skupi ukupno ${typeof fmt === 'function' ? fmt(amount) : amount} crystala`,
    check: () => (window._totalCrystalMined || 0) >= amount,
    reward: { metal: amount * 0.05, crystal: amount * 0.1, he3: amount * 0.02, xp: amount / 1000, bpw: amount <= 5000000 ? 50 : amount <= 50000000 ? 200 : 500 }
  });
});

// Ekonomija — He3
RESOURCE_MILESTONES.he3.forEach((amount, idx) => {
  ACHIEVEMENTS.push({
    category: 'economy', id: `he3_${amount}`, tier: amount <= 2500000 ? 1 : amount <= 25000000 ? 2 : 3,
    name: `Rudar He3`, icon: '⛽', desc: `Skupi ukupno ${typeof fmt === 'function' ? fmt(amount) : amount} He3`,
    check: () => (window._totalHe3Mined || 0) >= amount,
    reward: { metal: amount * 0.05, crystal: amount * 0.02, he3: amount * 0.1, xp: amount / 1000, bpw: amount <= 2500000 ? 50 : amount <= 25000000 ? 200 : 500 }
  });
});

// Depot pickups
DEPOT_PICKUPS.forEach((count, idx) => {
  ACHIEVEMENTS.push({
    category: 'economy', id: `depot_${count}`, tier: count <= 100 ? 1 : count <= 500 ? 2 : 3,
    name: `Sakupljač Resursa`, icon: '📦', desc: `Pokupi resurse iz Depota ${count} puta`,
    check: () => (window._totalDepotPickups || 0) >= count,
    reward: { metal: count * 100, crystal: count * 50, he3: count * 25, xp: count * 10, instanceKeys: count <= 100 ? 1 : count <= 500 ? 3 : 5 }
  });
});

// Špijunaža — uspješne
ESPIONAGE_MILESTONES.forEach((count, idx) => {
  ACHIEVEMENTS.push({
    category: 'espionage', id: `esp_success_${count}`, tier: count <= 10 ? 1 : count <= 50 ? 2 : 3,
    name: `Špijun`, icon: '🕵️', desc: `Uspješno špijuniraj ${count} puta`,
    check: () => (typeof espReports !== 'undefined' ? espReports.filter(r => r.success).length : 0) >= count,
    reward: { metal: count * 500, crystal: count * 400, he3: count * 200, xp: count * 50, bpw: count <= 10 ? 25 : count <= 50 ? 100 : 250 }
  });
});

// Špijunaža — research level
ESP_RESEARCH_MILESTONES.forEach(level => {
  ACHIEVEMENTS.push({
    category: 'espionage', id: `esp_research_${level}`, tier: level === 100 ? 4 : level === 75 ? 3 : level === 50 ? 2 : 1,
    name: `Špijunski Majstor`, icon: '🔬', desc: `Dostigni Espionage research Lv.${level}`,
    check: () => (research.espionage?.level || 0) >= level,
    reward: level === 100 ? { art_fragment: 'L', bpw: 1000 } : level === 75 ? { art_fragment: 'E', bpw: 500 } : level === 50 ? { art_fragment: 'R', bpw: 200 } : { art_fragment: 'C', bpw: 50 }
  });
});

// ============================================================
// KATEGORIJE
// ============================================================

const ACHIEVEMENT_CATEGORIES = {
  base:       { name: 'Baza',       icon: '🏗️', color: '#ffcc44' },
  combat:     { name: 'Borba',      icon: '⚔️', color: '#ff4444' },
  research:   { name: 'Research',   icon: '🔬', color: '#aa44ff' },
  collection: { name: 'Kolekcija',  icon: '💎', color: '#4488ff' },
  economy:    { name: 'Ekonomija',  icon: '💰', color: '#00ff88' },
  espionage:  { name: 'Špijunaža',  icon: '🕵️', color: '#ff8833' }
};

// ============================================================
// STATE
// ============================================================

if (typeof window !== 'undefined' && !window.achievementState) {
  window.achievementState = { completed: [], claimed: [] };
}

if (typeof window !== 'undefined') {
  if (window._totalMetalMined === undefined) window._totalMetalMined = 0;
  if (window._totalCrystalMined === undefined) window._totalCrystalMined = 0;
  if (window._totalHe3Mined === undefined) window._totalHe3Mined = 0;
  if (window._totalDepotPickups === undefined) window._totalDepotPickups = 0;
}

// ============================================================
// FUNKCIJE
// ============================================================

function checkAchievements() {
  let anyNew = false;
  ACHIEVEMENTS.forEach(ach => {
    if (typeof window === 'undefined') return;
    if (window.achievementState.completed.includes(ach.id)) return;
    if (ach.requires && !window.achievementState.completed.includes(ach.requires)) return;
    try {
      if (ach.check()) {
        window.achievementState.completed.push(ach.id);
        if (typeof toast === 'function') toast(`🏆 Dostignuće: ${ach.icon} ${ach.name}!`, 'ok');
        if (typeof addLog === 'function') addLog(`🏆 Dostignuće otključano: ${ach.name}`);
        anyNew = true;
      }
    } catch(e) {}
  });
  if (anyNew && typeof saveGame === 'function') saveGame();
}

function claimAchievement(id) {
  if (typeof window === 'undefined') return;
  if (window.achievementState.claimed.includes(id)) return;
  if (!window.achievementState.completed.includes(id)) return;

  const ach = ACHIEVEMENTS.find(a => a.id === id);
  if (!ach) return;

  const r = ach.reward;
  if (r.metal && typeof R !== 'undefined') R.metal += r.metal;
  if (r.crystal && typeof R !== 'undefined') R.crystal += r.crystal;
  if (r.he3 && typeof R !== 'undefined') R.he3 += r.he3;
  if (r.xp && typeof addExp === 'function') addExp(r.xp);
  if (r.bpw && typeof R !== 'undefined') R.spCard = (R.spCard || 0) + r.bpw;
  if (r.instanceKeys && typeof R !== 'undefined') R.instanceKeys = (R.instanceKeys || 0) + r.instanceKeys;
  if (r.art_fragment && typeof ARTIFACTS_DATA !== 'undefined' && typeof addArtifactFragment === 'function') {
    const pool = ARTIFACTS_DATA.filter(a => a.rarity === r.art_fragment && !window.artifactState?.unlocked?.includes(a.id));
    if (pool.length > 0) {
      const art = pool[Math.floor(Math.random() * pool.length)];
      addArtifactFragment(art.id, 1);
    }
  }
  if (r.fullBlueprint) {
    // Daj nasumični blueprint koji igrač nema
    const allBlueprints = [];
    Object.values(SHIPS || {}).forEach(arr => arr.forEach(s => allBlueprints.push(s.id)));
    if (typeof WEAPONS !== 'undefined') WEAPONS.forEach(w => allBlueprints.push(w.id));
    if (typeof SHIELDS !== 'undefined') SHIELDS.forEach(s => allBlueprints.push(s.id));
    if (typeof ENGINES !== 'undefined') ENGINES.forEach(e => allBlueprints.push(e.id));
    if (typeof MODULES !== 'undefined') MODULES.forEach(m => allBlueprints.push(m.id));
    
    const missing = allBlueprints.filter(id => !ownedBlueprints[id]);
    if (missing.length > 0) {
      const randomBp = missing[Math.floor(Math.random() * missing.length)];
      if (typeof unlockBlueprint === 'function') unlockBlueprint(randomBp);
    }
  }

  window.achievementState.claimed.push(id);
  if (typeof updateResUI === 'function') updateResUI();
  if (typeof saveGame === 'function') saveGame();
  if (typeof renderAchievements === 'function') renderAchievements();
  if (typeof toast === 'function') toast(`🎁 Nagrada preuzeta: ${ach.icon} ${ach.name}!`, 'ok');
}

// ── RENDER ──
let _achCat = 'all';

function renderAchievements() {
  const el = document.getElementById('achievementsContent');
  if (!el) return;

  if (typeof window === 'undefined') return;
  checkAchievements();

  const completed = window.achievementState.completed.length;
  const total = ACHIEVEMENTS.length;
  const unclaimed = window.achievementState.completed.filter(id => !window.achievementState.claimed.includes(id)).length;

  el.innerHTML = `
    <div class="card" style="margin-bottom:16px;display:flex;gap:20px;align-items:center">
      <div style="text-align:center"><div style="font-size:0.65rem;color:#6a90b8;margin-bottom:2px">ZAVRŠENO</div><div style="font-size:1.3rem;font-family:'Orbitron',monospace;color:#ffcc44">${completed}/${total}</div></div>
      <div style="flex:1"><div class="pbar" style="height:8px"><div class="pbar-fill" style="width:${(completed / total * 100).toFixed(1)}%;background:#ffcc44"></div></div><div style="font-size:0.62rem;color:#6a90b8;margin-top:4px">${(completed / total * 100).toFixed(1)}% završeno</div></div>
      ${unclaimed > 0 ? `<div style="background:rgba(0,255,136,0.1);border:1px solid rgba(0,255,136,0.3);padding:6px 14px;border-radius:6px;color:#00ff88;font-size:0.78rem">🎁 ${unclaimed} nagrada čeka!</div>` : ''}
    </div>
    <div style="display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap">
      <button class="btn ${_achCat === 'all' ? 'btn-gold' : ''}" style="font-size:0.72rem" onclick="_achCat='all';renderAchievements()">Sve</button>
      ${Object.entries(ACHIEVEMENT_CATEGORIES).map(([key, cat]) => `<button class="btn ${_achCat === key ? 'btn-gold' : ''}" style="font-size:0.72rem;${_achCat === key ? 'border-color:' + cat.color + ';color:' + cat.color : ''}" onclick="_achCat='${key}';renderAchievements()">${cat.icon} ${cat.name}</button>`).join('')}
    </div>
    <div class="grid-3">${getFilteredAchievements().map(ach => renderAchievementCard(ach)).join('')}</div>
  `;
}

function getFilteredAchievements() {
  if (_achCat === 'all') return ACHIEVEMENTS;
  return ACHIEVEMENTS.filter(a => a.category === _achCat);
}

function renderAchievementCard(ach) {
  if (typeof window === 'undefined') return '';
  const completed = window.achievementState.completed.includes(ach.id);
  const claimed = window.achievementState.claimed.includes(ach.id);
  const locked = ach.requires && !window.achievementState.completed.includes(ach.requires);
  const cat = ACHIEVEMENT_CATEGORIES[ach.category];
  const tierColor = ach.tier === 1 ? '#ffdd00' : ach.tier === 2 ? '#4488ff' : ach.tier === 3 ? '#aa44ff' : '#ffaa00';

  return `<div class="card" style="border-color:${completed ? cat.color + '55' : locked ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.1)'};opacity:${locked ? 0.4 : 1};position:relative">
    ${completed && !claimed ? `<div style="position:absolute;top:0;right:0;background:#00ff88;color:#000;font-size:0.6rem;padding:2px 6px;border-radius:0 8px 0 4px;font-weight:700">🎁 PREUZMI</div>` : ''}
    ${claimed ? `<div style="position:absolute;top:0;right:0;background:rgba(255,204,68,0.2);color:#ffcc44;font-size:0.6rem;padding:2px 6px;border-radius:0 8px 0 4px">✅ Preuzeto</div>` : ''}
    <div style="display:flex;align-items:start;gap:10px;margin-bottom:8px">
      <div style="font-size:1.5rem">${locked ? '🔒' : ach.icon}</div>
      <div style="flex:1"><div style="font-size:0.78rem;font-weight:700;color:${completed ? cat.color : locked ? '#6a90b8' : 'white'}">${ach.name}</div><div style="font-size:0.6rem;color:#6a90b8;margin-top:2px">${ach.desc}</div></div>
      <span style="font-size:0.6rem;padding:1px 5px;border-radius:3px;background:${tierColor}22;border:1px solid ${tierColor}44;color:${tierColor}">T${ach.tier}</span>
    </div>
    <div style="font-size:0.6rem;color:#6a90b8;background:rgba(0,0,0,0.3);padding:5px 8px;border-radius:4px;margin-bottom:8px;line-height:1.7">
      ${ach.reward.metal ? `🔩${typeof fmt === 'function' ? fmt(ach.reward.metal) : ach.reward.metal} ` : ''}
      ${ach.reward.crystal ? `💎${typeof fmt === 'function' ? fmt(ach.reward.crystal) : ach.reward.crystal} ` : ''}
      ${ach.reward.he3 ? `⛽${typeof fmt === 'function' ? fmt(ach.reward.he3) : ach.reward.he3} ` : ''}
      ${ach.reward.xp ? `⭐${typeof fmt === 'function' ? fmt(ach.reward.xp) : ach.reward.xp}XP ` : ''}
      ${ach.reward.bpw ? `<span style="color:#ffcc44">🐝${ach.reward.bpw} BPW</span> ` : ''}
      ${ach.reward.instanceKeys ? `🗝️${ach.reward.instanceKeys} ` : ''}
      ${ach.reward.art_fragment ? `<span style="color:${ART_RARITY_COLOR?.[ach.reward.art_fragment] || '#ffcc44'}">🧩${ach.reward.art_fragment} frag</span>` : ''}
      ${ach.reward.fullBlueprint ? `<span style="color:#00ff88">📋 Ceo Blueprint!</span>` : ''}
    </div>
    ${completed && !claimed ? `<button class="btn btn-g" style="width:100%;font-size:0.72rem" onclick="claimAchievement('${ach.id}')">🎁 Preuzmi nagradu</button>` : locked ? `<div style="font-size:0.6rem;color:#6a90b8;text-align:center">🔒 Završi prethodno dostignuće</div>` : !completed ? `<div style="font-size:0.6rem;color:#6a90b8;text-align:center">⏳ U toku...</div>` : `<div style="font-size:0.6rem;color:#ffcc44;text-align:center">✅ Završeno</div>`}
  </div>`;
}