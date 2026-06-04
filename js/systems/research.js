// ============================================================
// HIVE GALAXY — js/systems/research.js
// Sistem istraživanja — 8 grana, 100 nivoa, milestone bonusi
// ============================================================

// ── DEFINICIJA GRANA ──
const RESEARCH_BRANCHES = {
  mining_metal: {
    name:     'Rudarstvo Metal',
    icon:     '🔩',
    color:    '#ffdd00',
    desc:     'Povećava produkciju metala.',
    cost:     (lvl) => ({ metal: Math.floor(500 * Math.pow(1.08, lvl)), crystal: 0, he3: 0, energy: 5 }),
    bonus:    (lvl) => lvl,           // +1% po levelu
    unit:     '% metal produkcija',
    resource: ['metal'],
    milestones: {
      25:  { desc: '+25% bonus produkcija',    effect: 'mining_metal_25'  },
      50:  { desc: '+50% bonus produkcija',    effect: 'mining_metal_50'  },
      75:  { desc: '+75% bonus produkcija',    effect: 'mining_metal_75'  },
      100: { desc: 'Dupla produkcija metala',  effect: 'mining_metal_100' },
    },
  },
  mining_crystal: {
    name:     'Rudarstvo Crystal',
    icon:     '💎',
    color:    '#4488ff',
    desc:     'Povećava produkciju crystala.',
    cost:     (lvl) => ({ metal: 0, crystal: Math.floor(500 * Math.pow(1.08, lvl)), he3: 0, energy: 5 }),
    bonus:    (lvl) => lvl,
    unit:     '% crystal produkcija',
    resource: ['crystal'],
    milestones: {
      25:  { desc: '+25% bonus produkcija',      effect: 'mining_crystal_25'  },
      50:  { desc: '+50% bonus produkcija',      effect: 'mining_crystal_50'  },
      75:  { desc: '+75% bonus produkcija',      effect: 'mining_crystal_75'  },
      100: { desc: 'Dupla produkcija crystala',  effect: 'mining_crystal_100' },
    },
  },
  mining_he3: {
    name:     'Rudarstvo He3',
    icon:     '⛽',
    color:    '#00ff88',
    desc:     'Povećava produkciju He3.',
    cost:     (lvl) => ({ metal: 0, crystal: 0, he3: Math.floor(300 * Math.pow(1.08, lvl)), energy: 5 }),
    bonus:    (lvl) => lvl,
    unit:     '% He3 produkcija',
    resource: ['he3'],
    milestones: {
      25:  { desc: '+25% bonus produkcija',  effect: 'mining_he3_25'  },
      50:  { desc: '+50% bonus produkcija',  effect: 'mining_he3_50'  },
      75:  { desc: '+75% bonus produkcija',  effect: 'mining_he3_75'  },
      100: { desc: 'Dupla produkcija He3',   effect: 'mining_he3_100' },
    },
  },
  weapons: {
    name:     'Oružja',
    icon:     '⚔️',
    color:    '#ff4444',
    desc:     'Povećava DPS svih oružja.',
    cost:     (lvl) => ({
      metal:   Math.floor(600 * Math.pow(1.09, lvl)),
      crystal: Math.floor(400 * Math.pow(1.09, lvl)),
      he3:     0,
      energy:  10,
    }),
    bonus:    (lvl) => lvl,
    unit:     '% DPS',
    resource: ['metal', 'crystal'],
    milestones: {
      25:  { desc: '+5% kritičan udar šansa',       effect: 'weapons_25'  },
      50:  { desc: '+10% kritičan udar šansa',      effect: 'weapons_50'  },
      75:  { desc: '+15% kritičan udar šansa',      effect: 'weapons_75'  },
      100: { desc: 'Udvostruči DPS + 20% krit',     effect: 'weapons_100' },
    },
  },
  shields: {
    name:     'Štitovi',
    icon:     '🛡️',
    color:    '#00d4ff',
    desc:     'Povećava shield kapacitet i regeneraciju.',
    cost:     (lvl) => ({
      metal:   0,
      crystal: Math.floor(500 * Math.pow(1.09, lvl)),
      he3:     Math.floor(200 * Math.pow(1.09, lvl)),
      energy:  10,
    }),
    bonus:    (lvl) => lvl,
    unit:     '% shield kapacitet',
    resource: ['crystal', 'he3'],
    milestones: {
      25:  { desc: '+10% shield regeneracija',       effect: 'shields_25'  },
      50:  { desc: '+20% shield regeneracija',       effect: 'shields_50'  },
      75:  { desc: '+30% shield regeneracija',       effect: 'shields_75'  },
      100: { desc: 'Shield se ne može ugasiti',      effect: 'shields_100' },
    },
  },
  armor: {
    name:     'Oklop',
    icon:     '🔰',
    color:    '#ff8833',
    desc:     'Povećava otpornost oklopa i smanjuje primljenu štetu.',
    cost:     (lvl) => ({
      metal:   Math.floor(700 * Math.pow(1.09, lvl)),
      crystal: 0,
      he3:     Math.floor(250 * Math.pow(1.09, lvl)),
      energy:  10,
    }),
    bonus:    (lvl) => lvl,
    unit:     '% armor otpornost',
    resource: ['metal', 'he3'],
    milestones: {
      25:  { desc: '-5% primljena šteta',    effect: 'armor_25'  },
      50:  { desc: '-10% primljena šteta',   effect: 'armor_50'  },
      75:  { desc: '-15% primljena šteta',   effect: 'armor_75'  },
      100: { desc: '-25% primljena šteta',   effect: 'armor_100' },
    },
  },
  espionage: {
    name:     'Špijunaža',
    icon:     '🕵️',
    color:    '#aa44ff',
    desc:     'Povećava efikasnost špijunaže i detekciju.',
    cost:     (lvl) => ({
      metal:   0,
      crystal: Math.floor(450 * Math.pow(1.08, lvl)),
      he3:     0,
      energy:  8,
    }),
    bonus:    (lvl) => lvl,
    unit:     '% špijunaža efikasnost',
    resource: ['crystal'],
    milestones: {
      25:  { desc: 'Špijunaža otkriva HP neprijatelja',      effect: 'esp_25'  },
      50:  { desc: 'Špijunaža otkriva opremu neprijatelja',  effect: 'esp_50'  },
      75:  { desc: 'Špijunaža otkriva module neprijatelja',  effect: 'esp_75'  },
      100: { desc: 'Vidi sve + +10% krit u PvP',            effect: 'esp_100' },
    },
  },
  energy: {
    name:     'Energija',
    icon:     '⚡',
    color:    '#ffcc44',
    desc:     'Povećava kapacitet energije.',
    cost:     (lvl) => ({
      metal:   0,
      crystal: 0,
      he3:     Math.floor(400 * Math.pow(1.08, lvl)),
      energy:  15,
    }),
    bonus:    (lvl) => lvl * 2,   // +2 MWh po levelu
    unit:     'MWh kapacitet',
    resource: ['he3'],
    milestones: {
      25:  { desc: '+50 MWh bonus kapacitet',          effect: 'energy_25'  },
      50:  { desc: '+100 MWh bonus kapacitet',         effect: 'energy_50'  },
      75:  { desc: '+150 MWh bonus kapacitet',         effect: 'energy_75'  },
      100: { desc: 'Nema gubitka energije u instanci', effect: 'energy_100' },
    },
  },
};

// ── RESEARCH STATE (u state.js je definisan kao obj sa level:0) ──
// Proširujemo da podrži sve grane
function initResearch() {
  Object.keys(RESEARCH_BRANCHES).forEach(key => {
    if (!research[key]) research[key] = { level: 0 };
  });
}

// ── GETTER FUNKCIJE ZA BONUSE ──

function getResearchBonus(branch) {
  const lvl  = research[branch]?.level || 0;
  const def  = RESEARCH_BRANCHES[branch];
  if (!def) return 0;
  let bonus = def.bonus(lvl);
  // Dodaj milestone bonuse
  Object.entries(def.milestones).forEach(([mlvl, data]) => {
    if (lvl >= parseInt(mlvl)) {
      bonus += getMilestoneBonusValue(data.effect);
    }
  });
  return bonus;
}

function getMilestoneBonusValue(effect) {
  const map = {
    mining_metal_25:   25, mining_metal_50:   50, mining_metal_75:   75, mining_metal_100:  100,
    mining_crystal_25: 25, mining_crystal_50: 50, mining_crystal_75: 75, mining_crystal_100: 100,
    mining_he3_25:     25, mining_he3_50:     50, mining_he3_75:     75, mining_he3_100:    100,
    energy_25:         50, energy_50:        100, energy_75:         150,
  };
  return map[effect] || 0;
}

// Produkcija metal bonus %
function getMetalProdBonus()   { return getResearchBonus('mining_metal'); }
function getCrystalProdBonus() { return getResearchBonus('mining_crystal'); }
function getHe3ProdBonus()     { return getResearchBonus('mining_he3'); }

// DPS bonus %
function getWeaponsDpsBonus() {
  const lvl = research.weapons?.level || 0;
  let bonus = lvl; // +1% po levelu
  if (lvl >= 100) bonus += 100; // udvostruči DPS
  return bonus;
}

// Krit šansa bonus
function getWeaponsCritBonus() {
  const lvl = research.weapons?.level || 0;
  if (lvl >= 100) return 20;
  if (lvl >= 75)  return 15;
  if (lvl >= 50)  return 10;
  if (lvl >= 25)  return 5;
  return 0;
}

// Shield kapacitet bonus %
function getShieldBonus() {
  const lvl = research.shields?.level || 0;
  return lvl;
}

// Shield regen bonus %
function getShieldRegenBonus() {
  const lvl = research.shields?.level || 0;
  if (lvl >= 75) return 30;
  if (lvl >= 50) return 20;
  if (lvl >= 25) return 10;
  return 0;
}

// Shield immune (ne može ugasiti)
function isShieldImmune() {
  return (research.shields?.level || 0) >= 100;
}

// Armor damage reduction %
function getArmorDmgReduction() {
  const lvl = research.armor?.level || 0;
  let red = Math.floor(lvl * 0.3); // +0.3% po levelu (do ~30%)
  if (lvl >= 100) red = 25;
  else if (lvl >= 75) red = Math.max(red, 15);
  else if (lvl >= 50) red = Math.max(red, 10);
  else if (lvl >= 25) red = Math.max(red, 5);
  return red;
}

// Energija kapacitet bonus
function getEnergyCapBonus() {
  const lvl = research.energy?.level || 0;
  let bonus = lvl * 2;
  if (lvl >= 75) bonus += 150;
  else if (lvl >= 50) bonus += 100;
  else if (lvl >= 25) bonus += 50;
  return bonus;
}

// Nema gubitka energije u instanci
function isEnergyFreeInstance() {
  return (research.energy?.level || 0) >= 100;
}

// Špijunaža level
function getEspionageLevel() { return research.espionage?.level || 0; }

// ── CIJENA ISTRAŽIVANJA ──
function getResearchCost(branch) {
  const def = RESEARCH_BRANCHES[branch];
  if (!def) return { metal: 0, crystal: 0, he3: 0, energy: 0 };
  const lvl = research[branch]?.level || 0;
  return def.cost(lvl + 1);
}

// ── ISTRAŽI ──
function doResearch(branch) {
  const def = RESEARCH_BRANCHES[branch];
  if (!def) return;

  const lvl    = research[branch]?.level || 0;
  const labLvl = typeof getMaxResearchLevel === 'function' ? getMaxResearchLevel() : 0;

  if (labLvl === 0) {
    toast('🔒 Izgradi Laboratory zgradu da bi mogao istraživati!', 'warn');
    return;
  }
  if (lvl >= labLvl) {
    toast(`🔒 Laboratory Lv.${labLvl} limitira istraživanje! Unapredi Laboratory.`, 'warn');
    return;
  }
  if (lvl >= 100) { toast('✅ Grana je na MAX nivou!', 'warn'); return; }

  const cost = getResearchCost(branch);

  // Provjeri energiju
  if (R.energy < cost.energy) {
    toast(`❌ Nedovoljno energije! Treba ${cost.energy} MWh.`, 'err');
    return;
  }

  // Provjeri resurse
  if (!canAfford({ metal: cost.metal, crystal: cost.crystal, he3: cost.he3 })) {
    toast('❌ Nedovoljno resursa!', 'err');
    return;
  }

  // Troši
  spendResources({ metal: cost.metal, crystal: cost.crystal, he3: cost.he3 });
  R.energy -= cost.energy;

  // Unapredi
  research[branch].level = lvl + 1;
  const newLvl = research[branch].level;

  // Milestone poruka
  const ms = def.milestones[newLvl];
  if (ms) {
    toast(`🏆 MILESTONE! ${def.name} Lv.${newLvl}: ${ms.desc}`, 'ok');
    addLog(`🏆 Research Milestone: ${def.name} Lv.${newLvl} — ${ms.desc}`);
  } else {
    toast(`🔬 ${def.name} → Lv.${newLvl}`, 'ok');
  }

  addLog(`🔬 ${def.name} unaprijeđen na Lv.${newLvl}`);
  if (typeof trackDailyResearch  === 'function') trackDailyResearch();
  if (typeof trackWeeklyResearch === 'function') trackWeeklyResearch();;
  R.score += newLvl * 30;
  updateResUI();
  renderResearch();
  saveGame();
}

// ── RENDER RESEARCH PANELA ──
function renderResearch() {
  const el = document.getElementById('researchContent');
  if (!el) return;

  initResearch();

  // Ukupni progress
  const totalLvls = Object.keys(RESEARCH_BRANCHES).reduce((a, k) => a + (research[k]?.level || 0), 0);
  const maxLvls   = Object.keys(RESEARCH_BRANCHES).length * 100;

  el.innerHTML = `
    <!-- Progress bar -->
    <div class="card" style="margin-bottom:16px;display:flex;gap:20px;align-items:center">
      <div style="text-align:center">
        <div style="font-size:0.65rem;color:#6a90b8;margin-bottom:2px">UKUPNO</div>
        <div style="font-size:1.2rem;font-family:'Orbitron',monospace;color:#00d4ff">${totalLvls}</div>
        <div style="font-size:0.6rem;color:#6a90b8">/ ${maxLvls}</div>
      </div>
      <div style="flex:1">
        <div class="pbar" style="height:8px">
          <div class="pbar-fill" style="width:${(totalLvls/maxLvls*100).toFixed(1)}%"></div>
        </div>
        <div style="font-size:0.62rem;color:#6a90b8;margin-top:4px">
          ${(totalLvls/maxLvls*100).toFixed(1)}% istraživanja završeno
        </div>
      </div>
    </div>

    <!-- Grane -->
    <div class="grid-2">
      ${Object.entries(RESEARCH_BRANCHES).map(([key, def]) => renderResearchCard(key, def)).join('')}
    </div>
  `;
}

// ── RENDER JEDNE GRANE ──
function renderResearchCard(key, def) {
  initResearch();
  const lvl      = research[key]?.level || 0;
  const isMax    = lvl >= 100;
  const cost     = getResearchCost(key);
  const canAff   = canAfford({ metal: cost.metal, crystal: cost.crystal, he3: cost.he3 }) && R.energy >= cost.energy;
  const pct      = lvl;
  const curBonus = def.bonus(lvl);

  // Rarity boja po nivou
  const nameColor = lvl >= 75 ? '#ffaa00' : lvl >= 50 ? '#aa44ff' : lvl >= 25 ? '#4488ff' : '#ffdd00';

  // Sljedeći milestone
  const nextMs = Object.entries(def.milestones).find(([mlvl]) => parseInt(mlvl) > lvl);

  return `
    <div class="card" style="border-color:${def.color}33">

      <!-- Header -->
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <div style="font-size:1.8rem">${def.icon}</div>
        <div style="flex:1">
          <div style="font-size:0.85rem;font-weight:700;color:${nameColor}">${def.name}</div>
          <div style="font-size:0.62rem;color:#6a90b8">${def.desc}</div>
        </div>
        <div class="lv-badge" style="color:${def.color};border-color:${def.color}44">
          Lv. ${lvl} / 100
        </div>
      </div>

      <!-- Progress bar -->
      <div style="margin-bottom:10px">
        <div class="pbar" style="height:8px">
          <div class="pbar-fill" style="width:${pct}%;background:${def.color}"></div>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:3px">
          <span style="font-size:0.62rem;color:#6a90b8">Bonus: <strong style="color:${def.color}">+${curBonus} ${def.unit}</strong></span>
          ${isMax ? '<span style="font-size:0.62rem;color:#ffaa00">👑 MAX</span>' : ''}
        </div>
      </div>

      <!-- Milestone info -->
      ${nextMs ? `
        <div style="font-size:0.62rem;background:rgba(0,0,0,0.3);padding:6px 8px;
          border-radius:4px;margin-bottom:10px;color:#6a90b8">
          🏆 Lv.${nextMs[0]}: <span style="color:#ffcc44">${nextMs[1].desc}</span>
          <span style="color:#6a90b8"> (još ${parseInt(nextMs[0]) - lvl} lvl)</span>
        </div>` : `
        <div style="font-size:0.62rem;background:rgba(255,170,0,0.08);padding:6px 8px;
          border-radius:4px;margin-bottom:10px;color:#ffaa00;border:1px solid rgba(255,170,0,0.2)">
          👑 ${def.milestones[100]?.desc || 'MAX dostignut'}
        </div>`}

      <!-- Dostignuti milestones -->
      <div style="display:flex;gap:4px;margin-bottom:10px;flex-wrap:wrap">
        ${[25,50,75,100].map(m => `
          <span style="font-size:0.6rem;padding:2px 6px;border-radius:3px;
            background:${lvl >= m ? 'rgba(255,204,68,0.1)' : 'rgba(255,255,255,0.03)'};
            border:1px solid ${lvl >= m ? 'rgba(255,204,68,0.4)' : 'rgba(255,255,255,0.08)'};
            color:${lvl >= m ? '#ffcc44' : '#6a90b8'}">
            ${lvl >= m ? '✅' : '🔒'} Lv.${m}
          </span>`).join('')}
      </div>

      <!-- Cijena -->
      ${!isMax ? `
        ${typeof getMaxResearchLevel === 'function' && lvl >= getMaxResearchLevel() ? `
          <div style="font-size:0.65rem;background:rgba(255,51,85,0.1);border:1px solid rgba(255,51,85,0.3);
            color:#ff3355;padding:5px 8px;border-radius:4px;margin-bottom:8px">
            🔒 Laboratory Lv.${getMaxResearchLevel()} limit. Unapredi Laboratory!
          </div>` : ''}
        <div style="font-size:0.65rem;font-family:'Share Tech Mono',monospace;
          margin-bottom:8px;line-height:1.8">
          ${cost.metal   > 0 ? `<span class="${canAff?'ck':'cn'}">🔩 ${fmt(cost.metal)}</span> ` : ''}
          ${cost.crystal > 0 ? `<span class="${canAff?'ck':'cn'}">💎 ${fmt(cost.crystal)}</span> ` : ''}
          ${cost.he3     > 0 ? `<span class="${canAff?'ck':'cn'}">⛽ ${fmt(cost.he3)}</span> ` : ''}
          <span class="${R.energy >= cost.energy ?'ck':'cn'}">⚡ ${cost.energy} MWh</span>
        </div>
        <button class="btn ${canAff?'btn-g':''}" style="width:100%;font-size:0.78rem"
          onclick="doResearch('${key}')" ${canAff?'':'disabled'}>
          🔬 Istraži → Lv.${lvl+1}
        </button>` : `
        <div style="text-align:center;padding:8px;font-size:0.78rem;color:#ffaa00">
          👑 MAX LEVEL DOSTIGNUT
        </div>`}
    </div>`;
}