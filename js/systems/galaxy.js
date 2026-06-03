// ============================================================
// HIVE GALAXY — js/systems/galaxy.js
// Mapa galaksije — sistemi, sektori, navigacija
// ============================================================

// ── DEFINICIJA GALAKSIJE ──
const GALAXY_MAP = {
  sectors: [
    {
      id:    'alpha',
      name:  'Alpha Sektor',
      icon:  '🔵',
      color: '#00d4ff',
      x: 50, y: 50,
      desc:  'Početni sektor. Sigurno područje sa bogatim resursima.',
      minHQ: 1,
      systems: [
        { id: 'sol_prime',    name: 'Sol Prime',    icon: '☀️', type: 'home',    threat: 0,  resources: 'high',   x: 50, y: 50 },
        { id: 'nova_belt',    name: 'Nova Belt',    icon: '💫', type: 'mining',  threat: 1,  resources: 'medium', x: 70, y: 40 },
        { id: 'cryon_ii',     name: 'Cryon II',     icon: '❄️', type: 'crystal', threat: 2,  resources: 'medium', x: 35, y: 65 },
      ],
    },
    {
      id:    'beta',
      name:  'Beta Sektor',
      icon:  '🟢',
      color: '#00ff88',
      x: 25, y: 25,
      desc:  'Periferija sigurne zone. Povremeni piratski napadi.',
      minHQ: 5,
      systems: [
        { id: 'ashfall',      name: 'Ashfall',      icon: '🌋', type: 'volcanic', threat: 3, resources: 'high',   x: 25, y: 30 },
        { id: 'dust_ring',    name: 'Dust Ring',    icon: '🪐', type: 'mining',   threat: 3, resources: 'medium', x: 15, y: 20 },
        { id: 'vorn_gate',    name: 'Vorn Gate',    icon: '🌀', type: 'transit',  threat: 4, resources: 'low',    x: 30, y: 15 },
      ],
    },
    {
      id:    'gamma',
      name:  'Gamma Sektor',
      icon:  '🟡',
      color: '#ffcc44',
      x: 75, y: 25,
      desc:  'Zona sukoba. Visoki prihodi, visok rizik.',
      minHQ: 15,
      systems: [
        { id: 'kesh_prime',   name: 'Kesh Prime',   icon: '⚔️', type: 'combat',  threat: 5, resources: 'high',   x: 75, y: 20 },
        { id: 'xerath_iv',    name: 'Xerath IV',    icon: '💠', type: 'crystal', threat: 6, resources: 'high',   x: 85, y: 35 },
        { id: 'tyrant_belt',  name: 'Tyrant Belt',  icon: '☠️', type: 'combat',  threat: 7, resources: 'medium', x: 70, y: 10 },
      ],
    },
    {
      id:    'delta',
      name:  'Delta Sektor',
      icon:  '🟠',
      color: '#ff8833',
      x: 25, y: 75,
      desc:  'Drevni sektor. Artefakti i napredna tehnologija.',
      minHQ: 25,
      systems: [
        { id: 'vaelmor',      name: 'Vaelmor',      icon: '🔮', type: 'artifact', threat: 7, resources: 'medium', x: 20, y: 70 },
        { id: 'iridion_iv',   name: 'Iridion IV',   icon: '🌌', type: 'nebula',   threat: 8, resources: 'low',    x: 30, y: 80 },
        { id: 'halcyon',      name: 'Halcyon III',  icon: '⭐', type: 'colony',   threat: 6, resources: 'high',   x: 15, y: 85 },
      ],
    },
    {
      id:    'omega',
      name:  'Omega Sektor',
      icon:  '🔴',
      color: '#ff3355',
      x: 75, y: 75,
      desc:  'Jezgro galaksije. Legendarni neprijatelji i najrjeđi plijen.',
      minHQ: 50,
      systems: [
        { id: 'vexius_core',  name: 'Vexius Core',  icon: '🔱', type: 'boss',    threat: 10, resources: 'high',  x: 75, y: 80 },
        { id: 'void_rift',    name: 'Void Rift',    icon: '🕳️', type: 'anomaly', threat: 9,  resources: 'rare',  x: 85, y: 70 },
        { id: 'hive_prime',   name:  'Hive Prime',  icon: '⬡',  type: 'hive',   threat: 10, resources: 'rare',  x: 80, y: 85 },
      ],
    },
  ],
};

// ── DOBIJ DOSTUPNE SEKTORE ──
function getAvailableSectors() {
  const hqLevel = buildings.hq?.level || 1;
  return GALAXY_MAP.sectors.filter(s => hqLevel >= s.minHQ);
}

// ── DOBIJ THREAT COLOR ──
function getThreatColor(threat) {
  if (threat <= 2) return '#00ff88';
  if (threat <= 4) return '#ffcc44';
  if (threat <= 6) return '#ff8833';
  if (threat <= 8) return '#ff4444';
  return '#ff0044';
}

function getThreatLabel(threat) {
  if (threat === 0) return 'Nema';
  if (threat <= 2) return 'Nizak';
  if (threat <= 4) return 'Umjeren';
  if (threat <= 6) return 'Visok';
  if (threat <= 8) return 'Kritičan';
  return 'EKSTREMNI';
}

function getSystemTypeIcon(type) {
  const icons = {
    home:     '🏰', mining:  '⛏️', crystal: '💎',
    volcanic: '🌋', transit: '🌀', combat:  '⚔️',
    artifact: '🔮', nebula:  '🌌', colony:  '🌍',
    boss:     '👹', anomaly: '🕳️', hive:   '⬡',
  };
  return icons[type] || '⭐';
}

// ── SELECTED STATE ──
window._galaxySelected = window._galaxySelected || { sector: null, system: null };

// ── RENDER GALAXI PANEL ──
function renderGalaxy() {
  const el = document.getElementById('galaxyContent');
  if (!el) return;

  const hqLevel     = buildings.hq?.level || 1;
  const available   = getAvailableSectors();
  const locked      = GALAXY_MAP.sectors.filter(s => hqLevel < s.minHQ);
  const selSector   = window._galaxySelected.sector
    ? GALAXY_MAP.sectors.find(s => s.id === window._galaxySelected.sector)
    : null;

  el.innerHTML = `
    <!-- Header stats -->
    <div class="card" style="margin-bottom:16px">
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;text-align:center">
        <div>
          <div style="font-size:0.6rem;color:#6a90b8;margin-bottom:4px">HQ LEVEL</div>
          <div style="font-size:1.2rem;font-family:'Orbitron',monospace;color:#00d4ff">${hqLevel}</div>
        </div>
        <div>
          <div style="font-size:0.6rem;color:#6a90b8;margin-bottom:4px">SEKTORA</div>
          <div style="font-size:1.2rem;font-family:'Orbitron',monospace;color:#00ff88">
            ${available.length} / ${GALAXY_MAP.sectors.length}
          </div>
        </div>
        <div>
          <div style="font-size:0.6rem;color:#6a90b8;margin-bottom:4px">KOLONIJA</div>
          <div style="font-size:1.2rem;font-family:'Orbitron',monospace;color:#aa44ff">${colonies.length}</div>
        </div>
        <div>
          <div style="font-size:0.6rem;color:#6a90b8;margin-bottom:4px">KLJUČEVI</div>
          <div style="font-size:1.2rem;font-family:'Orbitron',monospace;color:#ffcc44">
            ${R.instanceKeys || 0}🗝️
          </div>
        </div>
      </div>
    </div>

    <!-- Vizuelna mapa -->
    <div class="card" style="margin-bottom:16px;padding:0;overflow:hidden">
      <div style="position:relative;width:100%;height:280px;
        background:radial-gradient(ellipse at center,#0a1020 0%,#03050e 100%)">

        <!-- Zvjezdana pozadina -->
        ${generateStarField(30)}

        <!-- Konekcione linije između sektora -->
        <svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none">
          <line x1="50%" y1="50%" x2="25%" y2="25%" stroke="rgba(0,212,255,0.1)" stroke-width="1" stroke-dasharray="4"/>
          <line x1="50%" y1="50%" x2="75%" y2="25%" stroke="rgba(0,212,255,0.1)" stroke-width="1" stroke-dasharray="4"/>
          <line x1="50%" y1="50%" x2="25%" y2="75%" stroke="rgba(0,212,255,0.1)" stroke-width="1" stroke-dasharray="4"/>
          <line x1="50%" y1="50%" x2="75%" y2="75%" stroke="rgba(0,212,255,0.1)" stroke-width="1" stroke-dasharray="4"/>
        </svg>

        <!-- Sektori na mapi -->
        ${GALAXY_MAP.sectors.map(sector => {
          const isAvail = hqLevel >= sector.minHQ;
          const isSel   = window._galaxySelected.sector === sector.id;
          const opacity = isAvail ? 1 : 0.3;

          return `
            <div style="
              position:absolute;
              left:${sector.x}%;top:${sector.y}%;
              transform:translate(-50%,-50%);
              cursor:${isAvail ? 'pointer' : 'not-allowed'};
              opacity:${opacity};
              text-align:center;
              z-index:2;
            " onclick="${isAvail ? `selectGalaxySector('${sector.id}')` : ''}">
              <div style="
                width:${isSel ? 52 : 44}px;height:${isSel ? 52 : 44}px;
                border-radius:50%;
                background:${sector.color}22;
                border:2px solid ${isSel ? sector.color : sector.color + '66'};
                display:flex;align-items:center;justify-content:center;
                font-size:1.4rem;
                box-shadow:${isSel ? `0 0 20px ${sector.color}66` : 'none'};
                transition:all 0.2s;
                margin:0 auto 4px;
              ">${sector.icon}</div>
              <div style="font-size:0.55rem;color:${isSel ? sector.color : '#6a90b8'};
                white-space:nowrap;font-weight:${isSel ? 700 : 400}">
                ${isAvail ? sector.name : `🔒 HQ ${sector.minHQ}`}
              </div>
            </div>`;
        }).join('')}
      </div>
    </div>

    <!-- Detalji odabranog sektora -->
    ${selSector ? renderSectorDetail(selSector, hqLevel) : `
      <div style="text-align:center;color:#6a90b8;padding:20px;font-size:0.75rem">
        Klikni na sektor na mapi da vidiš detalje.
      </div>`}

    <!-- Zaključani sektori -->
    ${locked.length > 0 ? `
      <div style="font-family:'Orbitron',monospace;font-size:0.7rem;color:#6a90b8;
        letter-spacing:2px;margin:16px 0 10px;padding-bottom:6px;
        border-bottom:1px solid rgba(255,255,255,0.06)">
        🔒 ZAKLJUČANO
      </div>
      <div class="grid-3">
        ${locked.map(s => `
          <div class="card" style="opacity:0.4;text-align:center;padding:12px">
            <div style="font-size:1.5rem;margin-bottom:6px">${s.icon}</div>
            <div style="font-size:0.72rem;font-weight:700;color:#6a90b8">${s.name}</div>
            <div style="font-size:0.6rem;color:#444;margin-top:4px">
              🔒 HQ Lv.${s.minHQ} potreban
            </div>
          </div>`).join('')}
      </div>
    ` : ''}
  `;
}

// ── GENERIŠI ZVJEZDANO POLJE ──
function generateStarField(count) {
  return Array.from({ length: count }, () => {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const s = Math.random() * 2 + 1;
    const o = Math.random() * 0.5 + 0.1;
    return `<div style="position:absolute;left:${x}%;top:${y}%;
      width:${s}px;height:${s}px;border-radius:50%;
      background:white;opacity:${o};pointer-events:none;z-index:1"></div>`;
  }).join('');
}

// ── ODABERI SEKTOR ──
function selectGalaxySector(sectorId) {
  window._galaxySelected.sector = sectorId;
  window._galaxySelected.system = null;
  renderGalaxy();
}

// ── RENDER DETALJI SEKTORA ──
function renderSectorDetail(sector, hqLevel) {
  const selSys = window._galaxySelected.system;

  return `
    <div style="font-family:'Orbitron',monospace;font-size:0.75rem;color:${sector.color};
      letter-spacing:2px;margin-bottom:12px;padding-bottom:8px;
      border-bottom:1px solid ${sector.color}22">
      ${sector.icon} ${sector.name.toUpperCase()}
    </div>
    <div style="font-size:0.72rem;color:#6a90b8;margin-bottom:16px">${sector.desc}</div>

    <div class="grid-3" style="margin-bottom:16px">
      ${sector.systems.map(sys => {
        const isSel   = selSys === sys.id;
        const tColor  = getThreatColor(sys.threat);
        const tLabel  = getThreatLabel(sys.threat);
        const colHere = colonies.some(c => c.name === sys.name);

        return `
          <div class="card" style="cursor:pointer;
            border-color:${isSel ? sector.color : 'rgba(0,212,255,0.1)'};
            background:${isSel ? sector.color + '11' : ''}"
            onclick="selectGalaxySystem('${sys.id}')">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
              <div style="font-size:1.5rem">${sys.icon}</div>
              <div>
                <div style="font-size:0.75rem;font-weight:700;color:${isSel ? sector.color : 'white'}">
                  ${sys.name}
                </div>
                <div style="font-size:0.6rem;color:#6a90b8">
                  ${getSystemTypeIcon(sys.type)} ${sys.type}
                </div>
              </div>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:0.6rem">
              <span style="color:${tColor}">⚠️ ${tLabel}</span>
              ${colHere ? '<span style="color:#00ff88">🪐 Kolonija</span>' : ''}
            </div>
          </div>`;
      }).join('')}
    </div>

    ${selSys ? renderSystemDetail(sector.systems.find(s => s.id === selSys), sector) : ''}
  `;
}

// ── ODABERI SISTEM ──
function selectGalaxySystem(sysId) {
  window._galaxySelected.system = sysId;
  renderGalaxy();
}

// ── RENDER DETALJI SISTEMA ──
function renderSystemDetail(sys, sector) {
  if (!sys) return '';
  const tColor    = getThreatColor(sys.threat);
  const fleetPow  = calcFleetStats(fleet).power;
  const reqPow    = sys.threat * 500;
  const canAttack = fleetPow >= reqPow;

  return `
    <div class="card" style="border-color:${sector.color}44;margin-top:8px">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
        <div style="font-size:2.5rem">${sys.icon}</div>
        <div>
          <div style="font-size:0.9rem;font-weight:700;color:${sector.color}">${sys.name}</div>
          <div style="font-size:0.65rem;color:#6a90b8">${getSystemTypeIcon(sys.type)} ${sys.type} · Sektor ${sector.name}</div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;
        margin-bottom:12px;text-align:center">
        <div style="background:rgba(0,0,0,0.3);padding:8px;border-radius:6px">
          <div style="font-size:0.58rem;color:#6a90b8;margin-bottom:2px">PRIJETNJA</div>
          <div style="font-size:0.85rem;color:${tColor}">${sys.threat}/10</div>
          <div style="font-size:0.55rem;color:${tColor}">${getThreatLabel(sys.threat)}</div>
        </div>
        <div style="background:rgba(0,0,0,0.3);padding:8px;border-radius:6px">
          <div style="font-size:0.58rem;color:#6a90b8;margin-bottom:2px">MIN MOĆ</div>
          <div style="font-size:0.85rem;color:${canAttack ? '#00ff88' : '#ff3355'}">
            ${fmt(reqPow)}
          </div>
          <div style="font-size:0.55rem;color:${canAttack ? '#00ff88' : '#ff3355'}">
            ${canAttack ? '✅ Spreman' : '❌ Preslabo'}
          </div>
        </div>
        <div style="background:rgba(0,0,0,0.3);padding:8px;border-radius:6px">
          <div style="font-size:0.58rem;color:#6a90b8;margin-bottom:2px">RESURSI</div>
          <div style="font-size:0.85rem;color:#ffcc44">${sys.resources}</div>
        </div>
      </div>

      <div style="display:flex;gap:8px">
        <button class="btn ${canAttack ? 'btn-g' : ''}" style="flex:1;font-size:0.72rem"
          onclick="launchGalaxyMission('${sys.id}')"
          ${canAttack ? '' : 'disabled'}>
          🚀 Pošalji Flotu
        </button>
        <button class="btn btn-gold" style="flex:1;font-size:0.72rem"
          onclick="showPanel('instances')">
          🌌 Instance
        </button>
      </div>
    </div>
  `;
}

// ── LANSIRANJE MISIJE U SISTEM ──
function launchGalaxyMission(sysId) {
  const allSys  = GALAXY_MAP.sectors.flatMap(s => s.systems);
  const sys     = allSys.find(s => s.id === sysId);
  if (!sys) return;

  const power   = calcFleetStats(fleet).power;
  const reqPow  = sys.threat * 500;
  if (power < reqPow) {
    toast(`❌ Potrebna moć: ${fmt(reqPow)}. Tvoja flota: ${fmt(power)}`, 'err');
    return;
  }

  if (fleet.every(s => s === null)) {
    toast('❌ Flota je prazna!', 'err');
    return;
  }

  // Generiši neprijatelje na osnovu sistema
  const enemies = generateGalaxyEnemies(sys);

  // Pokušaj simulirati borbu
  if (typeof simulateBattle === 'function') {
    const instanceData = {
      name:      sys.name,
      difficulty: sys.threat,
      type:      sys.type,
      resources: {
        metal:   [sys.threat * 200, sys.threat * 500],
        crystal: [sys.threat * 100, sys.threat * 300],
        he3:     [sys.threat * 50,  sys.threat * 150],
      },
      drops: { guaranteed: [], chance: [] },
    };

    const battle  = simulateBattle(fleet.filter(s => s !== null), enemies, instanceData);
    const rewards = typeof calculateRewards === 'function'
      ? calculateRewards(battle, instanceData, {})
      : null;

    if (battle.status === 'victory' && rewards) {
      if (typeof applyRewards === 'function') applyRewards(rewards);
      if (typeof applyPlayerLosses === 'function') applyPlayerLosses(battle);
    }

    if (typeof showBattleOutcome === 'function') {
      showBattleOutcome(battle, rewards, true);
    } else if (typeof renderBattleResult === 'function') {
      renderBattleResult(battle, rewards);
    }

    R.score += sys.threat * 50;
    saveGame();
  } else {
    toast('⚠️ Combat sistem nije učitan.', 'warn');
  }
}

// ── GENERIŠI NEPRIJATELJE ──
function generateGalaxyEnemies(sys) {
  const threat = sys.threat;
  const count  = Math.floor(threat / 2) + 1;
  const enemies = [];

  for (let i = 0; i < Math.min(count, 3); i++) {
    enemies.push({
      name:    `${sys.name} Defender ${i + 1}`,
      ship_id: null,
      count:   Math.floor(threat * 2) + 5,
      hp:      threat * 300 + 200,
      shield:  threat * 100,
      dps:     threat * 25 + 10,
      agility: Math.min(50, threat * 3),
      speed:   Math.min(10, threat),
      armor:   threat >= 7 ? 'Heavy' : threat >= 4 ? 'Medium' : 'Light',
    });
  }

  return enemies;
}