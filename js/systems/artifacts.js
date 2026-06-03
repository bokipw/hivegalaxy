// ============================================================
// HIVE GALAXY — js/systems/artifacts.js
// Artefakt sistem — 43 artefakta, fragmenti, max 3 opremljena
// ============================================================

// ── SVI ARTEFAKTI ──
const ARTIFACTS_DATA = [
  // ── COMMON (20) ──
  { id:'art_1',  name:'Metal Shard',     icon:'🔩', rarity:'C', type:'metal_prod',      bonus:{ metal_prod:5 },                    fragments:10 },
  { id:'art_2',  name:'Ore Fragment',    icon:'⛏️', rarity:'C', type:'metal_prod',      bonus:{ metal_prod:5 },                    fragments:10 },
  { id:'art_3',  name:'Smelting Core',   icon:'🔥', rarity:'C', type:'metal_prod',      bonus:{ metal_prod:5 },                    fragments:10 },
  { id:'art_4',  name:'Crystal Shard',   icon:'💎', rarity:'C', type:'crystal_prod',    bonus:{ crystal_prod:5 },                  fragments:10 },
  { id:'art_5',  name:'Gem Fragment',    icon:'✨', rarity:'C', type:'crystal_prod',    bonus:{ crystal_prod:5 },                  fragments:10 },
  { id:'art_6',  name:'He3 Bubble',      icon:'⛽', rarity:'C', type:'he3_prod',        bonus:{ he3_prod:5 },                      fragments:10 },
  { id:'art_7',  name:'Gas Cloud',       icon:'🌫️', rarity:'C', type:'he3_prod',        bonus:{ he3_prod:5 },                      fragments:10 },
  { id:'art_8',  name:'Harvester Core',  icon:'🌾', rarity:'C', type:'all_prod',        bonus:{ all_prod:3 },                      fragments:10 },
  { id:'art_9',  name:'Rusty Blade',     icon:'⚔️', rarity:'C', type:'attack',          bonus:{ attack:3 },                        fragments:10 },
  { id:'art_10', name:'Broken Spear',    icon:'🏹', rarity:'C', type:'attack',          bonus:{ attack:3 },                        fragments:10 },
  { id:'art_11', name:'Wooden Shield',   icon:'🛡️', rarity:'C', type:'defense',         bonus:{ defense:3 },                       fragments:10 },
  { id:'art_12', name:'Leather Armor',   icon:'🧥', rarity:'C', type:'defense',         bonus:{ defense:3 },                       fragments:10 },
  { id:'art_13', name:'Small Battery',   icon:'🔋', rarity:'C', type:'energy',          bonus:{ energy:10 },                       fragments:10 },
  { id:'art_14', name:'Solar Cell',      icon:'☀️', rarity:'C', type:'energy',          bonus:{ energy:10 },                       fragments:10 },
  { id:'art_15', name:'Research Notes',  icon:'📜', rarity:'C', type:'research',        bonus:{ research:5 },                      fragments:10 },
  { id:'art_16', name:'Old Scroll',      icon:'📖', rarity:'C', type:'research',        bonus:{ research:5 },                      fragments:10 },
  { id:'art_17', name:'Luck Charm',      icon:'🍀', rarity:'C', type:'crit',            bonus:{ crit:2 },                          fragments:10 },
  { id:'art_18', name:'Sharp Stone',     icon:'🪨', rarity:'C', type:'attack',          bonus:{ attack:3 },                        fragments:10 },
  { id:'art_19', name:'Copper Ring',     icon:'💍', rarity:'C', type:'all_prod',        bonus:{ all_prod:3 },                      fragments:10 },
  { id:'art_20', name:'Tiny Reactor',    icon:'⚡', rarity:'C', type:'energy',          bonus:{ energy:10 },                       fragments:10 },

  // ── RARE (12) ──
  { id:'art_21', name:'Titanium Alloy',  icon:'🔩', rarity:'R', type:'metal_prod',      bonus:{ metal_prod:10 },                   fragments:10 },
  { id:'art_22', name:'Diamond Core',    icon:'💎', rarity:'R', type:'crystal_prod',    bonus:{ crystal_prod:10 },                 fragments:10 },
  { id:'art_23', name:'He3 Canister',    icon:'🧪', rarity:'R', type:'he3_prod',        bonus:{ he3_prod:10 },                     fragments:10 },
  { id:'art_24', name:'Iron Sword',      icon:'⚔️', rarity:'R', type:'attack',          bonus:{ attack:8 },                        fragments:10 },
  { id:'art_25', name:'Steel Shield',    icon:'🛡️', rarity:'R', type:'defense',         bonus:{ defense:8 },                       fragments:10 },
  { id:'art_26', name:'Energy Cell',     icon:'🔋', rarity:'R', type:'energy',          bonus:{ energy:25 },                       fragments:10 },
  { id:'art_27', name:'Research Chip',   icon:'💾', rarity:'R', type:'research',        bonus:{ research:10 },                     fragments:10 },
  { id:'art_28', name:'Lucky Coin',      icon:'🪙', rarity:'R', type:'crit',            bonus:{ crit:5 },                          fragments:10 },
  { id:'art_29', name:'War Banner',      icon:'🚩', rarity:'R', type:'attack+defense',  bonus:{ attack:5, defense:5 },             fragments:10 },
  { id:'art_30', name:'Trade Ledger',    icon:'📒', rarity:'R', type:'trade',           bonus:{ trade:10 },                        fragments:10 },
  { id:'art_31', name:'Fleet Manual',    icon:'📘', rarity:'R', type:'fleet',           bonus:{ fleet:5 },                         fragments:10 },
  { id:'art_32', name:'Plasma Core',     icon:'⚡', rarity:'R', type:'energy',          bonus:{ energy:25 },                       fragments:10 },

  // ── EPIC (7) ──
  { id:'art_33', name:'Star Metal',      icon:'⭐', rarity:'E', type:'all_prod',        bonus:{ all_prod:20 },                     fragments:10 },
  { id:'art_34', name:'Void Crystal',    icon:'🌑', rarity:'E', type:'attack',          bonus:{ attack:15 },                       fragments:10 },
  { id:'art_35', name:'Aegis Shield',    icon:'🛡️', rarity:'E', type:'defense+hp',      bonus:{ defense:15, hp:10 },               fragments:10 },
  { id:'art_36', name:'Infinity Core',   icon:'♾️', rarity:'E', type:'energy',          bonus:{ energy:50 },                       fragments:10 },
  { id:'art_37', name:'Ancient Tablet',  icon:'📜', rarity:'E', type:'research',        bonus:{ research:15, expedition:10 },      fragments:10 },
  { id:'art_38', name:'Skull of Vex',    icon:'💀', rarity:'E', type:'crit+attack',     bonus:{ crit:10, attack:10 },              fragments:10 },
  { id:'art_39', name:'War Drums',       icon:'🥁', rarity:'E', type:'fleet',           bonus:{ fleet:12 },                        fragments:10 },

  // ── LEGENDARY (4) ──
  { id:'art_40', name:'Heart of Galaxy', icon:'❤️', rarity:'L', type:'all_prod',        bonus:{ all_prod:50 },                     fragments:10 },
  { id:'art_41', name:'Divine Blade',    icon:'⚔️', rarity:'L', type:'attack+crit',     bonus:{ attack:30, crit:15 },              fragments:10 },
  { id:'art_42', name:'Immortal Shield', icon:'🛡️', rarity:'L', type:'defense+hp',      bonus:{ defense:25, hp:20, resist:10 },    fragments:10 },
  { id:'art_43', name:'Crown of Vex',    icon:'👑', rarity:'L', type:'all_stats',       bonus:{ all_prod:20, attack:20, defense:20, crit:10 }, fragments:10 },
];

// ── RARITY BOJE ──
const ART_RARITY_COLOR = {
  C: '#ffdd00',
  R: '#4488ff',
  E: '#aa44ff',
  L: '#ffaa00',
};

// ── STATE (u state.js dodati) ──
// artifacts: { fragments: {art_id: count}, unlocked: [art_id], equipped: [art_id, art_id, art_id] }
if (!window.artifactState) {
  window.artifactState = {
    fragments: {},   // { art_1: 5, art_2: 3, ... }
    unlocked:  [],   // ['art_1', 'art_5', ...]
    equipped:  [null, null, null], // max 3
  };
}

// ── HELPER FUNKCIJE ──
function getArtifactById(id) {
  return ARTIFACTS_DATA.find(a => a.id === id) || null;
}

function getArtifactFragments(id) {
  return window.artifactState.fragments[id] || 0;
}

function isArtifactUnlocked(id) {
  return window.artifactState.unlocked.includes(id);
}

function isArtifactEquipped(id) {
  return window.artifactState.equipped.includes(id);
}

// ── DODAJ FRAGMENT ──
function addArtifactFragment(artifactId, count = 1) {
  const art = getArtifactById(artifactId);
  if (!art) return;

  if (!window.artifactState.fragments[artifactId]) {
    window.artifactState.fragments[artifactId] = 0;
  }
  window.artifactState.fragments[artifactId] += count;

  const current = window.artifactState.fragments[artifactId];
  const needed  = art.fragments;

  toast(`🧩 +${count} fragment: ${art.icon} ${art.name} (${current}/${needed})`, 'inf');
  if (typeof trackDailyArt === 'function') trackDailyArt();
  addLog(`🧩 Fragment dobijen: ${art.name} (${current}/${needed})`);

  // Auto-unlock ako ima dovoljno
  if (current >= needed && !isArtifactUnlocked(artifactId)) {
    unlockArtifact(artifactId);
  }

  saveGame();
}

// ── OTKLJUČAJ ARTEFAKT ──
function unlockArtifact(id) {
  const art = getArtifactById(id);
  if (!art || isArtifactUnlocked(id)) return;

  window.artifactState.unlocked.push(id);
  const rarColor = ART_RARITY_COLOR[art.rarity];

  toast(`🏆 ARTEFAKT OTKLJUČAN: ${art.icon} ${art.name}!`, 'ok');
  addLog(`🏆 Artefakt otključan: ${art.name} (${art.rarity})`);
  saveGame();
}

// ── OPREMI ARTEFAKT ──
function equipArtifact(id, slot) {
  if (!isArtifactUnlocked(id)) { toast('❌ Artefakt nije otključan!', 'err'); return; }
  if (slot < 0 || slot > 2)    { toast('❌ Neispravan slot!', 'err'); return; }

  // Ako je već opremljen u drugom slotu, ukloni ga
  const existingSlot = window.artifactState.equipped.indexOf(id);
  if (existingSlot !== -1) {
    window.artifactState.equipped[existingSlot] = null;
  }

  window.artifactState.equipped[slot] = id;
  const art = getArtifactById(id);
  toast(`✅ ${art.icon} ${art.name} opremljen u slot ${slot + 1}!`, 'ok');
  addLog(`⚙️ Artefakt opremljen: ${art.name} → Slot ${slot + 1}`);
  saveGame();
  renderArtifacts();
}

// ── SKINI ARTEFAKT ──
function unequipArtifact(slot) {
  const id  = window.artifactState.equipped[slot];
  if (!id) return;
  const art = getArtifactById(id);
  window.artifactState.equipped[slot] = null;
  toast(`🔄 ${art?.icon} ${art?.name} skinuto iz slota ${slot + 1}.`, 'warn');
  saveGame();
  renderArtifacts();
}

// ── UKUPNI BONUSI OD OPREMLJENIH ARTEFAKATA ──
function getArtifactBonuses() {
  const bonuses = {
    metal_prod: 0, crystal_prod: 0, he3_prod: 0,
    all_prod: 0, attack: 0, defense: 0, energy: 0,
    research: 0, crit: 0, fleet: 0, trade: 0,
    hp: 0, resist: 0, expedition: 0,
  };

  window.artifactState.equipped.forEach(id => {
    if (!id) return;
    const art = getArtifactById(id);
    if (!art) return;
    Object.entries(art.bonus).forEach(([key, val]) => {
      if (bonuses[key] !== undefined) bonuses[key] += val;
    });
  });

  return bonuses;
}

// Getteri za korištenje u economy/combat
function getArtifactAttackBonus()   { const b = getArtifactBonuses(); return b.attack + b.all_prod * 0.5; }
function getArtifactDefenseBonus()  { const b = getArtifactBonuses(); return b.defense; }
function getArtifactCritBonus()     { return getArtifactBonuses().crit; }
function getArtifactEnergyBonus()   { return getArtifactBonuses().energy; }
function getArtifactMetalBonus()    { const b = getArtifactBonuses(); return b.metal_prod + b.all_prod; }
function getArtifactCrystalBonus()  { const b = getArtifactBonuses(); return b.crystal_prod + b.all_prod; }
function getArtifactHe3Bonus()      { const b = getArtifactBonuses(); return b.he3_prod + b.all_prod; }

// ── RENDER ARTEFAKT PANELA ──
function renderArtifacts() {
  const el = document.getElementById('artifactsContent');
  if (!el) return;

  const bonuses  = getArtifactBonuses();
  const unlocked = window.artifactState.unlocked.length;
  const total    = ARTIFACTS_DATA.length;

  el.innerHTML = `
    <!-- Progress -->
    <div class="card" style="margin-bottom:16px;display:flex;gap:20px;align-items:center">
      <div style="text-align:center">
        <div style="font-size:0.65rem;color:#6a90b8;margin-bottom:2px">OTKLJUČANO</div>
        <div style="font-size:1.3rem;font-family:'Orbitron',monospace;color:#ffcc44">${unlocked}/${total}</div>
      </div>
      <div style="flex:1">
        <div class="pbar" style="height:8px">
          <div class="pbar-fill" style="width:${(unlocked/total*100).toFixed(1)}%;background:#ffcc44"></div>
        </div>
        <div style="font-size:0.62rem;color:#6a90b8;margin-top:4px">${(unlocked/total*100).toFixed(1)}% artefakata</div>
      </div>
    </div>

    <!-- Opremljeni slotovi -->
    <div class="card" style="margin-bottom:16px">
      <div style="font-size:0.82rem;font-weight:700;color:#ffcc44;margin-bottom:12px">⚙️ OPREMLJENI ARTEFAKTI (max 3)</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:12px">
        ${[0,1,2].map(slot => {
          const id  = window.artifactState.equipped[slot];
          const art = id ? getArtifactById(id) : null;
          const col = art ? ART_RARITY_COLOR[art.rarity] : 'rgba(255,255,255,0.1)';
          return `
            <div style="border:2px dashed ${col};border-radius:8px;padding:12px;text-align:center;
              min-height:100px;position:relative;background:${art?'rgba(0,0,0,0.3)':'rgba(0,0,0,0.1)'}">
              ${art ? `
                <div style="font-size:1.8rem;margin-bottom:4px">${art.icon}</div>
                <div style="font-size:0.7rem;font-weight:700;color:${col}">${art.name}</div>
                <div style="font-size:0.6rem;color:#6a90b8;margin-top:2px">${formatBonuses(art.bonus)}</div>
                <button class="btn btn-r" style="width:100%;margin-top:8px;font-size:0.62rem;padding:3px"
                  onclick="unequipArtifact(${slot})">Skini</button>
              ` : `
                <div style="font-size:1.5rem;margin-bottom:6px;opacity:0.3">⬡</div>
                <div style="font-size:0.65rem;color:#6a90b8">Slot ${slot+1}<br>Prazan</div>
              `}
            </div>`;
        }).join('')}
      </div>

      <!-- Aktivni bonusi -->
      ${getActiveBonusHTML(bonuses)}
    </div>

    <!-- Tabs po rarity -->
    <div style="display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap">
      ${['all','C','R','E','L'].map(r => `
        <button class="btn ${window._artFilter===r?'btn-gold':''}"
          style="font-size:0.75rem;${r!=='all'?'color:'+ART_RARITY_COLOR[r]:''}"
          onclick="window._artFilter='${r}';renderArtifacts()">
          ${r==='all'?'Sve':r==='C'?'Common':r==='R'?'Rare':r==='E'?'Epic':'Legendary'}
        </button>`).join('')}
      <button class="btn ${window._artFilter==='unlocked'?'btn-gold':''}"
        style="font-size:0.75rem;color:#00ff88"
        onclick="window._artFilter='unlocked';renderArtifacts()">✅ Otključani</button>
    </div>

    <!-- Grid artefakata -->
    <div class="grid-3">
      ${getFilteredArtifacts().map(art => renderArtifactCard(art)).join('')}
    </div>
  `;
}

function getFilteredArtifacts() {
  const f = window._artFilter || 'all';
  if (f === 'all')      return ARTIFACTS_DATA;
  if (f === 'unlocked') return ARTIFACTS_DATA.filter(a => isArtifactUnlocked(a.id));
  return ARTIFACTS_DATA.filter(a => a.rarity === f);
}

function renderArtifactCard(art) {
  const unlocked  = isArtifactUnlocked(art.id);
  const equipped  = isArtifactEquipped(art.id);
  const fragments = getArtifactFragments(art.id);
  const needed    = art.fragments;
  const rarColor  = ART_RARITY_COLOR[art.rarity];
  const pct       = Math.min(100, (fragments / needed) * 100);

  return `
    <div class="card" style="
      border-color:${unlocked ? rarColor+'55' : 'rgba(255,255,255,0.06)'};
      opacity:${unlocked ? 1 : 0.7};
      position:relative">

      ${equipped ? `<div style="position:absolute;top:6px;right:6px;font-size:0.6rem;
        background:rgba(255,204,68,0.2);border:1px solid rgba(255,204,68,0.4);
        color:#ffcc44;padding:1px 5px;border-radius:3px">⚙️ Opremljen</div>` : ''}

      <!-- Header -->
      <div style="text-align:center;margin-bottom:8px">
        <div style="font-size:2rem">${art.icon}</div>
        <div style="font-size:0.78rem;font-weight:700;color:${rarColor}">${art.name}</div>
        <div style="font-size:0.6rem;color:#6a90b8">${art.rarity === 'C' ? 'Common' : art.rarity === 'R' ? 'Rare' : art.rarity === 'E' ? 'Epic' : 'Legendary'}</div>
      </div>

      <!-- Bonus -->
      <div style="font-size:0.65rem;color:#6a90b8;text-align:center;margin-bottom:8px">
        ${formatBonuses(art.bonus)}
      </div>

      <!-- Fragment progress -->
      ${!unlocked ? `
        <div style="margin-bottom:8px">
          <div style="display:flex;justify-content:space-between;margin-bottom:3px">
            <span style="font-size:0.6rem;color:#6a90b8">Fragmenti</span>
            <span style="font-size:0.65rem;color:white">${fragments}/${needed}</span>
          </div>
          <div class="pbar"><div class="pbar-fill" style="width:${pct}%;background:${rarColor}"></div></div>
        </div>
        <div style="font-size:0.6rem;text-align:center;color:#6a90b8">
          🔒 Treba još ${needed - fragments} fragmenta
        </div>
      ` : equipped ? `
        <button class="btn btn-r" style="width:100%;font-size:0.68rem"
          onclick="unequipArtifact(${window.artifactState.equipped.indexOf(art.id)})">
          🔄 Skini
        </button>
      ` : `
        <div style="display:flex;gap:4px">
          ${[0,1,2].map(slot => {
            const occupied = window.artifactState.equipped[slot];
            return `<button class="btn btn-g" style="flex:1;font-size:0.6rem;padding:4px"
              onclick="equipArtifact('${art.id}',${slot})">
              Slot ${slot+1}${occupied ? ' 🔄' : ''}
            </button>`;
          }).join('')}
        </div>
      `}
    </div>`;
}

function formatBonuses(bonus) {
  const labels = {
    metal_prod:'🔩+', crystal_prod:'💎+', he3_prod:'⛽+',
    all_prod:'🌟+', attack:'⚔️+', defense:'🛡️+',
    energy:'⚡+', research:'🔬+', crit:'💥+',
    fleet:'🚀+', trade:'📦+', hp:'❤️+',
    resist:'🔰-', expedition:'🗺️+',
  };
  return Object.entries(bonus).map(([k,v]) => {
    const lbl = labels[k] || k;
    const unit = k === 'energy' ? ' MWh' : '%';
    return `<span style="margin:0 3px">${lbl}${v}${unit}</span>`;
  }).join('');
}

function getActiveBonusHTML(bonuses) {
  const active = Object.entries(bonuses).filter(([,v]) => v > 0);
  if (active.length === 0) {
    return '<div style="font-size:0.65rem;color:#6a90b8;text-align:center">Nema aktivnih bonusa. Opremi artefakte gore.</div>';
  }
  const labels = {
    metal_prod:'Metal prod', crystal_prod:'Crystal prod', he3_prod:'He3 prod',
    all_prod:'Sva produkcija', attack:'Napad', defense:'Odbrana',
    energy:'Energija', research:'Istraživanje', crit:'Krit šansa',
    fleet:'Flota', trade:'Trgovina', hp:'HP',
    resist:'Rezistencija', expedition:'Ekspedicija',
  };
  return `
    <div style="display:flex;flex-wrap:wrap;gap:6px">
      ${active.map(([k,v]) => `
        <span style="font-size:0.65rem;padding:3px 8px;border-radius:4px;
          background:rgba(255,204,68,0.1);border:1px solid rgba(255,204,68,0.3);color:#ffcc44">
          ${labels[k]||k}: +${v}${k==='energy'?' MWh':'%'}
        </span>`).join('')}
    </div>`;
}

// ── RANDOM FRAGMENT DROP (poziva se iz instance sistema) ──
function dropRandomArtifactFragment(instanceDifficulty) {
  // Šansa pada po rarity
  const rates = instanceDifficulty <= 5  ? { C:70, R:25, E:5,  L:0  } :
                instanceDifficulty <= 15 ? { C:50, R:35, E:13, L:2  } :
                instanceDifficulty <= 25 ? { C:30, R:40, E:25, L:5  } :
                                           { C:15, R:35, E:35, L:15 };

  const roll = Math.random() * 100;
  let rarity;
  if (roll < rates.L)              rarity = 'L';
  else if (roll < rates.L+rates.E) rarity = 'E';
  else if (roll < rates.L+rates.E+rates.R) rarity = 'R';
  else rarity = 'C';

  const pool = ARTIFACTS_DATA.filter(a => a.rarity === rarity);
  if (pool.length === 0) return;

  const art = pool[Math.floor(Math.random() * pool.length)];
  addArtifactFragment(art.id, 1);
}

// Inicijalizacija filtera
if (!window._artFilter) window._artFilter = 'all';