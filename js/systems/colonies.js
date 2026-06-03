// ============================================================
// HIVE GALAXY — js/systems/colonies.js
// Kolonije — kolonizacija planeta, produkcija, odbrana
// ============================================================

// ── TIPOVI PLANETA ──
const PLANET_TYPES = {
  rocky:    { name: 'Kameni',    icon: '🪨', color: '#ff8833', metalBonus: 30,  crystalBonus: 5,   he3Bonus: 5   },
  crystal:  { name: 'Kristalni', icon: '💎', color: '#4488ff', metalBonus: 5,   crystalBonus: 30,  he3Bonus: 5   },
  gas:      { name: 'Plinski',   icon: '🌫️', color: '#00ff88', metalBonus: 5,   crystalBonus: 5,   he3Bonus: 30  },
  balanced: { name: 'Balansiran',icon: '🌍', color: '#00d4ff', metalBonus: 15,  crystalBonus: 15,  he3Bonus: 15  },
  barren:   { name: 'Pustošan',  icon: '🏜️', color: '#ffcc44', metalBonus: 10,  crystalBonus: 10,  he3Bonus: 10  },
  volcanic: { name: 'Vulkanski', icon: '🌋', color: '#ff4444', metalBonus: 40,  crystalBonus: 0,   he3Bonus: 20  },
  frozen:   { name: 'Zaleđen',   icon: '❄️', color: '#aaddff', metalBonus: 0,   crystalBonus: 40,  he3Bonus: 10  },
  nebula:   { name: 'Maglinska', icon: '🌌', color: '#aa44ff', metalBonus: 10,  crystalBonus: 20,  he3Bonus: 40  },
};

// ── MAX KOLONIJE PO JUMP GATE ──
function getMaxColonies() {
  const jgLevel = buildings.jump_gate?.level || 0;
  if (jgLevel === 0) return 0;
  let base  = Math.min(9, Math.floor(jgLevel / 10) + 1);
  // Milestone bonusi iz data/buildings.js
  let extra = 0;
  if (typeof getBuildingMilestones === 'function') {
    const m = getBuildingMilestones('jump_gate');
    Object.entries(m).forEach(([mlvl, data]) => {
      if (jgLevel >= parseInt(mlvl) && data.extraColony) extra = Math.max(extra, data.extraColony);
    });
  }
  return Math.min(12, base + extra);
}

// ── GENERIŠI DOSTUPNE PLANETE ZA KOLONIZACIJU ──
function generateAvailablePlanets() {
  if (!window._availablePlanets || window._availablePlanets.length === 0) {
    const types  = Object.keys(PLANET_TYPES);
    const names  = [
      'Xerath IV', 'Kelos Prime', 'Vorn II', 'Draxis VII', 'Solenne III',
      'Tyrant Belt', 'Nova Kesh', 'Ashfall V', 'Cryonex II', 'Vaelmor',
      'Dust Ring', 'Pyros IX', 'Aquillon', 'Greystone VI', 'Ember Prime',
      'Coldpeak', 'Starfall II', 'Iridion IV', 'Halcyon III', 'Vexius',
    ];
    window._availablePlanets = names.map((name, i) => ({
      id:       `planet_${i}`,
      name,
      type:     types[i % types.length],
      distance: Math.floor(i / 4) + 1, // 1-5 sistema udaljenosti
      slots:    Math.floor(Math.random() * 3) + 3, // 3-5 building slotova
      colonized: false,
    }));
  }
  return window._availablePlanets;
}

// ── CIJENA KOLONIZACIJE ──
function getColonyCost(planet) {
  const dist = planet.distance || 1;
  return {
    metal:   Math.floor(5000  * Math.pow(1.5, dist - 1)),
    crystal: Math.floor(3000  * Math.pow(1.5, dist - 1)),
    he3:     Math.floor(2000  * Math.pow(1.5, dist - 1)),
  };
}

// ── PRODUKCIJA KOLONIJE ──
function getColonyProduction(colony) {
  const pType   = PLANET_TYPES[colony.type] || PLANET_TYPES.balanced;
  const lvl     = colony.level || 1;
  const base    = lvl * 0.005;

  return {
    metal:   parseFloat((base * (1 + pType.metalBonus   / 100)).toFixed(4)),
    crystal: parseFloat((base * (1 + pType.crystalBonus / 100)).toFixed(4)),
    he3:     parseFloat((base * (1 + pType.he3Bonus     / 100)).toFixed(4)),
  };
}

// ── UKUPNA PRODUKCIJA SVIH KOLONIJA ──
function getTotalColonyProduction() {
  return colonies.reduce((acc, col) => {
    const prod = getColonyProduction(col);
    acc.metal   += prod.metal;
    acc.crystal += prod.crystal;
    acc.he3     += prod.he3;
    return acc;
  }, { metal: 0, crystal: 0, he3: 0 });
}

// ── CIJENA NADOGRADNJE KOLONIJE ──
function getColonyUpgradeCost(colony) {
  const lvl = colony.level || 1;
  return {
    metal:   Math.floor(2000 * Math.pow(1.14, lvl)),
    crystal: Math.floor(1200 * Math.pow(1.14, lvl)),
    he3:     Math.floor(800  * Math.pow(1.14, lvl)),
  };
}

// ── KOLONIZUJ PLANET ──
function colonizePlanet(planetId) {
  const planets = generateAvailablePlanets();
  const planet  = planets.find(p => p.id === planetId);
  if (!planet) return;

  const maxCol  = getMaxColonies();
  if (colonies.length >= maxCol) {
    toast(`❌ Maksimum ${maxCol} kolonija! Unapredi Jump Gate.`, 'warn');
    return;
  }

  const jgRange = buildings.jump_gate?.level || 0;
  if (jgRange < planet.distance) {
    toast(`❌ Jump Gate Lv.${planet.distance} potreban za ovaj sistem!`, 'warn');
    return;
  }

  const cost = getColonyCost(planet);
  if (!canAfford(cost)) {
    toast('❌ Nedovoljno resursa za kolonizaciju!', 'err');
    return;
  }

  spendResources(cost);

  const newColony = {
    id:       `col_${Date.now()}`,
    planetId: planet.id,
    name:     planet.name,
    type:     planet.type,
    level:    1,
    distance: planet.distance,
    slots:    planet.slots,
    defense:  0,
    colonizedAt: Date.now(),
  };

  colonies.push(newColony);
  planet.colonized = true;

  updateResUI();
  renderColonies();
  saveGame();

  toast(`🪐 ${planet.name} kolonizovan!`, 'ok');
  addLog(`🪐 Nova kolonija: ${planet.name} (${PLANET_TYPES[planet.type]?.name || planet.type})`);
  R.score += 500 * planet.distance;
}

// ── UNAPREDI KOLONIJU ──
function upgradeColony(colonyId) {
  const colony = colonies.find(c => c.id === colonyId);
  if (!colony) return;

  if (colony.level >= 100) { toast('✅ Kolonija je na MAX nivou!', 'warn'); return; }

  const cost = getColonyUpgradeCost(colony);
  if (!canAfford(cost)) { toast('❌ Nedovoljno resursa!', 'err'); return; }

  spendResources(cost);
  colony.level++;

  updateResUI();
  renderColonies();
  saveGame();

  toast(`⬆️ ${colony.name} → Lv.${colony.level}!`, 'ok');
  addLog(`⬆️ Kolonija ${colony.name} unaprijeđena na Lv.${colony.level}`);
}

// ── NAPUSTI KOLONIJU ──
function abandonColony(colonyId) {
  if (!confirm('⚠️ Napustiti ovu koloniju? Izgubit ćeš sav napredak!')) return;

  const idx    = colonies.findIndex(c => c.id === colonyId);
  if (idx === -1) return;

  const colony  = colonies[idx];
  const planets = generateAvailablePlanets();
  const planet  = planets.find(p => p.id === colony.planetId);
  if (planet) planet.colonized = false;

  // Vrati dio resursa (20%)
  const refund = {
    metal:   Math.floor(getColonyCost({ distance: colony.distance }).metal * 0.2),
    crystal: Math.floor(getColonyCost({ distance: colony.distance }).crystal * 0.2),
    he3:     Math.floor(getColonyCost({ distance: colony.distance }).he3 * 0.2),
  };
  R.metal   += refund.metal;
  R.crystal += refund.crystal;
  R.he3     += refund.he3;

  colonies.splice(idx, 1);

  updateResUI();
  renderColonies();
  saveGame();

  toast(`🪐 ${colony.name} napuštena. Refund: 🔩${fmt(refund.metal)} 💎${fmt(refund.crystal)} ⛽${fmt(refund.he3)}`, 'warn');
  addLog(`🪐 Kolonija ${colony.name} napuštena.`);
}

// ── COLONY TICK — produkcija ide direktno u R (bypass Depot) ──
// Poziva se iz economy tickProduction
function tickColonyProduction() {
  if (colonies.length === 0) return;
  const prod = getTotalColonyProduction();
  R.metal   += prod.metal;
  R.crystal += prod.crystal;
  R.he3     += prod.he3;
}

// ── RENDER KOLONIJA ──
let _colTab = 'colonies'; // 'colonies' | 'explore'

function renderColonies() {
  const el = document.getElementById('coloniesContent');
  if (!el) return;

  const jgLevel  = buildings.jump_gate?.level || 0;
  const maxCol   = getMaxColonies();
  const colProd  = getTotalColonyProduction();

  el.innerHTML = `
    <!-- Status bar -->
    <div class="card" style="margin-bottom:16px">
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;text-align:center">
        <div>
          <div style="font-size:0.65rem;color:#6a90b8;margin-bottom:4px">KOLONIJE</div>
          <div style="font-size:1.3rem;font-family:'Orbitron',monospace;color:#00d4ff">
            ${colonies.length} / ${maxCol}
          </div>
        </div>
        <div>
          <div style="font-size:0.65rem;color:#6a90b8;margin-bottom:4px">JUMP GATE</div>
          <div style="font-size:1.3rem;font-family:'Orbitron',monospace;color:#aa44ff">
            Lv.${jgLevel}
          </div>
        </div>
        <div>
          <div style="font-size:0.65rem;color:#6a90b8;margin-bottom:4px">METAL/s</div>
          <div style="font-size:1rem;font-family:'Orbitron',monospace;color:#ffcc44">
            +${colProd.metal.toFixed(3)}
          </div>
        </div>
        <div>
          <div style="font-size:0.65rem;color:#6a90b8;margin-bottom:4px">CRYSTAL/s</div>
          <div style="font-size:1rem;font-family:'Orbitron',monospace;color:#4488ff">
            +${colProd.crystal.toFixed(3)}
          </div>
        </div>
      </div>
    </div>

    ${jgLevel === 0 ? `
      <div class="card" style="text-align:center;padding:30px;border-color:rgba(255,204,68,0.3)">
        <div style="font-size:3rem;margin-bottom:12px">🌀</div>
        <div style="font-size:0.9rem;font-weight:700;color:#ffcc44;margin-bottom:8px">
          Jump Gate Potreban
        </div>
        <div style="font-size:0.72rem;color:#6a90b8;margin-bottom:16px">
          Izgradi Jump Gate u Bazi da otključaš kolonizaciju galaksije.
        </div>
        <button class="btn btn-gold" onclick="showPanel('base')">
          🌀 Idi na Bazu → Specijalne Zgrade
        </button>
      </div>
    ` : `
      <!-- Tabovi -->
      <div style="display:flex;gap:8px;margin-bottom:16px">
        <button class="btn ${_colTab==='colonies'?'btn-gold':''}"
          onclick="_colTab='colonies';renderColonies()">
          🪐 Moje Kolonije (${colonies.length})
        </button>
        <button class="btn ${_colTab==='explore'?'btn-gold':''}"
          onclick="_colTab='explore';renderColonies()">
          🔭 Istraži Galaksiju
        </button>
      </div>

      ${_colTab === 'colonies' ? renderMyColonies(maxCol) : renderExploreGalaxy(jgLevel)}
    `}
  `;
}

// ── RENDER MOJIH KOLONIJA ──
function renderMyColonies(maxCol) {
  if (colonies.length === 0) {
    return `
      <div class="card" style="text-align:center;padding:30px;color:#6a90b8">
        <div style="font-size:3rem;margin-bottom:12px">🪐</div>
        <div style="font-size:0.85rem;color:white;margin-bottom:8px">Nemaš kolonija</div>
        <div style="font-size:0.72rem;margin-bottom:16px">
          Idi na <strong style="color:#00d4ff">Istraži Galaksiju</strong> da pronađeš planete.
        </div>
        <button class="btn btn-g" onclick="_colTab='explore';renderColonies()">
          🔭 Istraži Galaksiju
        </button>
      </div>`;
  }

  return `<div class="grid-3">` + colonies.map(col => {
    const pType  = PLANET_TYPES[col.type] || PLANET_TYPES.balanced;
    const prod   = getColonyProduction(col);
    const upCost = getColonyUpgradeCost(col);
    const canUp  = canAfford(upCost) && col.level < 100;
    const nameColor = col.level >= 75 ? '#ffaa00' : col.level >= 50 ? '#aa44ff' :
                      col.level >= 25 ? '#4488ff' : '#ffcc44';

    return `
      <div class="card" style="border-color:${pType.color}44">

        <!-- Header -->
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
          <div style="font-size:2rem">${pType.icon}</div>
          <div style="flex:1">
            <div style="font-size:0.85rem;font-weight:700;color:${nameColor}">${col.name}</div>
            <div style="font-size:0.62rem;color:${pType.color}">${pType.name} · Sistema ${col.distance}</div>
          </div>
          <div class="lv-badge" style="color:${pType.color};border-color:${pType.color}44">
            Lv.${col.level}
          </div>
        </div>

        <!-- Produkcija -->
        <div style="background:rgba(0,0,0,0.3);border-radius:6px;padding:8px;margin-bottom:10px;
          font-size:0.65rem;font-family:'Share Tech Mono',monospace;line-height:1.8">
          <div style="color:#6a90b8;margin-bottom:4px;font-size:0.6rem">PRODUKCIJA /s</div>
          <div style="color:#ffcc44">🔩 ${prod.metal.toFixed(4)}</div>
          <div style="color:#4488ff">💎 ${prod.crystal.toFixed(4)}</div>
          <div style="color:#00ff88">⛽ ${prod.he3.toFixed(4)}</div>
        </div>

        <!-- Upgrade cijena -->
        ${col.level < 100 ? `
          <div style="font-size:0.6rem;font-family:'Share Tech Mono',monospace;
            margin-bottom:8px;color:#6a90b8;line-height:1.6">
            <span class="${canAfford(upCost)?'ck':'cn'}">🔩${fmt(upCost.metal)}</span>
            <span class="${canAfford(upCost)?'ck':'cn'}"> 💎${fmt(upCost.crystal)}</span>
            <span class="${canAfford(upCost)?'ck':'cn'}"> ⛽${fmt(upCost.he3)}</span>
          </div>
          <div style="display:flex;gap:6px">
            <button class="btn ${canUp?'btn-g':''}" style="flex:1;font-size:0.72rem"
              onclick="upgradeColony('${col.id}')" ${canUp?'':'disabled'}>
              ⬆️ Lv.${col.level + 1}
            </button>
            <button class="btn btn-r" style="font-size:0.65rem;padding:5px 8px"
              onclick="abandonColony('${col.id}')">🗑️</button>
          </div>
        ` : `
          <div style="text-align:center;color:#ffaa00;font-size:0.72rem;margin-bottom:6px">
            👑 MAX LEVEL
          </div>
          <button class="btn btn-r" style="width:100%;font-size:0.65rem"
            onclick="abandonColony('${col.id}')">🗑️ Napusti</button>
        `}
      </div>`;
  }).join('') + `</div>`;
}

// ── RENDER ISTRAŽUJ GALAKSIJU ──
function renderExploreGalaxy(jgLevel) {
  const planets  = generateAvailablePlanets();
  const jgRange  = jgLevel;
  const maxCol   = getMaxColonies();
  const full     = colonies.length >= maxCol;

  // Grupiši po sistemu
  const systems = {};
  planets.forEach(p => {
    if (!systems[p.distance]) systems[p.distance] = [];
    systems[p.distance].push(p);
  });

  let html = '';

  if (full) {
    html += `
      <div class="card" style="margin-bottom:16px;border-color:rgba(255,204,68,0.3);text-align:center">
        <div style="color:#ffcc44;font-size:0.82rem">
          ⚠️ Dostignut maksimum kolonija (${maxCol}/${maxCol}).<br>
          <span style="font-size:0.65rem;color:#6a90b8">Unapredi Jump Gate za više slotova.</span>
        </div>
      </div>`;
  }

  Object.entries(systems).sort(([a],[b]) => a-b).forEach(([dist, planetsInSys]) => {
    const distNum    = parseInt(dist);
    const inRange    = jgRange >= distNum;
    const sysColor   = inRange ? '#00d4ff' : '#6a90b8';

    html += `
      <div style="margin-bottom:20px">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
          <div style="font-size:0.75rem;color:${sysColor};letter-spacing:2px;font-weight:700">
            ${inRange ? '✅' : '🔒'} SISTEM ${distNum}
          </div>
          ${!inRange ? `<div style="font-size:0.62rem;color:#ff3355">
            Jump Gate Lv.${distNum} potreban
          </div>` : ''}
          <div style="flex:1;height:1px;background:rgba(255,255,255,0.06)"></div>
          <div style="font-size:0.6rem;color:#6a90b8">Udaljenost: ${distNum} skok${distNum > 1 ? 'a' : ''}</div>
        </div>

        <div class="grid-4" style="opacity:${inRange?1:0.4}">
          ${planetsInSys.map(planet => renderPlanetCard(planet, inRange, full)).join('')}
        </div>
      </div>`;
  });

  return html;
}

// ── RENDER KARTICE PLANETA ──
function renderPlanetCard(planet, inRange, full) {
  const pType      = PLANET_TYPES[planet.type] || PLANET_TYPES.balanced;
  const cost       = getColonyCost(planet);
  const affordable = canAfford(cost);
  const colonized  = planet.colonized || colonies.some(c => c.planetId === planet.id);
  const canCol     = inRange && !colonized && !full && affordable;

  return `
    <div class="card" style="
      border-color:${colonized ? 'rgba(0,255,136,0.3)' : pType.color+'33'};
      opacity:${colonized ? 0.7 : 1}">

      <div style="text-align:center;margin-bottom:8px">
        <div style="font-size:2rem">${colonized ? '✅' : pType.icon}</div>
        <div style="font-size:0.75rem;font-weight:700;color:${colonized?'#00ff88':pType.color}">
          ${planet.name}
        </div>
        <div style="font-size:0.6rem;color:#6a90b8">${pType.name}</div>
      </div>

      ${!colonized ? `
        <div style="font-size:0.6rem;font-family:'Share Tech Mono',monospace;
          margin-bottom:8px;line-height:1.7;color:#6a90b8">
          <div class="${affordable?'ck':'cn'}">🔩 ${fmt(cost.metal)}</div>
          <div class="${affordable?'ck':'cn'}">💎 ${fmt(cost.crystal)}</div>
          <div class="${affordable?'ck':'cn'}">⛽ ${fmt(cost.he3)}</div>
        </div>
        <button class="btn ${canCol?'btn-g':''}" style="width:100%;font-size:0.68rem"
          onclick="colonizePlanet('${planet.id}')"
          ${canCol?'':'disabled'}>
          ${colonized ? '✅ Kolonizovan' :
            !inRange  ? '🔒 Van dometa' :
            full      ? '🔒 Nema slotova' :
            !affordable ? '❌ Resursi' :
            '🚀 Kolonizuj'}
        </button>
      ` : `
        <div style="text-align:center;font-size:0.68rem;color:#00ff88">✅ Kolonizovan</div>
      `}
    </div>`;
}

// ── INICIJALIZACIJA ──
if (!window._availablePlanets) window._availablePlanets = [];