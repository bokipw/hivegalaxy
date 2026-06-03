// ============================================================
// HIVE GALAXY — js/systems/pvp.js
// PvP sistem — matchmaking, borba, rating, shield, plijen
// ============================================================

if (!window.pvpShield) window.pvpShield = { active: false, expiresAt: null };

const AI_NAMES = [
  'Admiral Krix', 'Commander Vex', 'General Zara', 'Captain Nox',
  'Warlord Drath', 'Admiral Lyra', 'Commander Oryn', 'General Kael',
  'Captain Voss', 'Warlord Syra', 'Admiral Thane', 'Commander Zex',
  'General Mira', 'Captain Drax', 'Warlord Cyne', 'Admiral Rynn',
  'Commander Ash', 'General Vael', 'Captain Xorn', 'Warlord Tess',
];

const AI_AVATARS = ['🤖', '👽', '🦾', '🔮', '💀', '⚡', '🌑', '🔥'];

function generateAIOpponent(playerPower, playerRating) {
  const name      = AI_NAMES[Math.floor(Math.random() * AI_NAMES.length)];
  const avatar    = AI_AVATARS[Math.floor(Math.random() * AI_AVATARS.length)];
  // DRASTIČAN NERF: 30%-60% player power
  const powerVar  = 0.3 + Math.random() * 0.3;
  const aiPower   = Math.max(100, Math.floor(playerPower * powerVar * 0.7));
  const ratingVar = Math.floor((Math.random() - 0.5) * 150);
  const aiRating  = Math.max(100, playerRating + ratingVar);

  const aiResources = {
    metal:   Math.floor(aiPower * 0.2 + Math.random() * aiPower * 0.3),
    crystal: Math.floor(aiPower * 0.15 + Math.random() * aiPower * 0.2),
    he3:     Math.floor(aiPower * 0.05 + Math.random() * aiPower * 0.1),
  };

  const aiFleet = generateAIFleet(aiPower);

  return { name, avatar, power: aiPower, rating: aiRating, resources: aiResources, fleet: aiFleet };
}

function generateAIFleet(power) {
  const groups = [];
  const numGroups = Math.min(4, Math.max(1, Math.floor(power / 15000) + 1));

  // DRASTIČNO SMANJENE VRIJEDNOSTI
  const shipTypes = [
    { name: 'AI Fighter', armor: 'Light',  hp: power * 0.08, dps: power * 0.015, shield: power * 0.02, agility: 10, speed: 2 },
    { name: 'AI Cruiser', armor: 'Chrome', hp: power * 0.12, dps: power * 0.01, shield: power * 0.04, agility: 5,  speed: 1 },
    { name: 'AI Battleship', armor: 'Nano', hp: power * 0.18, dps: power * 0.018, shield: power * 0.03, agility: 3, speed: 1 },
  ];

  for (let i = 0; i < numGroups; i++) {
    const type  = shipTypes[i % shipTypes.length];
    const count = Math.floor(Math.random() * 60 + 10);
    groups.push({
      id:      `ai_${i}`,
      side:    'enemy',
      name:    `${type.name} x${count}`,
      count,
      hp:      type.hp * count,
      maxHp:   type.hp * count,
      shield:  type.shield * count,
      maxShield: type.shield * count,
      dps:     type.dps * count,
      agility: type.agility,
      speed:   type.speed,
      armor:   type.armor,
      effects: [],
      alive:   true,
    });
  }

  return groups;
}

function isPvpShieldActive() {
  if (!window.pvpShield?.active) return false;
  if (Date.now() > window.pvpShield.expiresAt) {
    window.pvpShield.active = false;
    return false;
  }
  return true;
}

function getPvpShieldTimeLeft() {
  if (!isPvpShieldActive()) return 0;
  return Math.max(0, window.pvpShield.expiresAt - Date.now());
}

function activatePvpShield(hours) {
  const ms = hours * 60 * 60 * 1000;
  window.pvpShield = {
    active:    true,
    expiresAt: Date.now() + ms,
  };
  saveGame();
}

function formatShieldTime(ms) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function renderPvP() {
  const el = document.getElementById('pvpContent');
  if (!el) return;

  const shieldActive   = isPvpShieldActive();
  const shieldTimeLeft = getPvpShieldTimeLeft();
  const playerPower    = calcFleetTotalPower();

  el.innerHTML = `
    <div class="card" style="margin-bottom:16px">
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;text-align:center">
        <div><div style="font-size:0.65rem;color:#6a90b8;margin-bottom:4px">RATING</div><div style="font-size:1.3rem;font-family:'Orbitron',monospace;color:#ffcc44">${pvp.rating}</div></div>
        <div><div style="font-size:0.65rem;color:#6a90b8;margin-bottom:4px">POBJEDE</div><div style="font-size:1.3rem;font-family:'Orbitron',monospace;color:#00ff88">${pvp.wins}</div></div>
        <div><div style="font-size:0.65rem;color:#6a90b8;margin-bottom:4px">PORAZI</div><div style="font-size:1.3rem;font-family:'Orbitron',monospace;color:#ff3355">${pvp.losses}</div></div>
        <div><div style="font-size:0.65rem;color:#6a90b8;margin-bottom:4px">WIN RATE</div><div style="font-size:1.3rem;font-family:'Orbitron',monospace;color:#00d4ff">${pvp.wins + pvp.losses > 0 ? Math.round(pvp.wins / (pvp.wins + pvp.losses) * 100) : 0}%</div></div>
      </div>
    </div>

    <div class="card" style="margin-bottom:16px;border-color:${shieldActive ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.1)'}">
      <div style="display:flex;align-items:center;gap:16px">
        <div style="font-size:2rem">${shieldActive ? '🛡️' : '⚠️'}</div>
        <div style="flex:1">
          <div style="font-size:0.85rem;font-weight:700;color:${shieldActive ? '#00d4ff' : '#ff3355'}">${shieldActive ? 'SHIELD AKTIVAN' : 'SHIELD NEAKTIVAN'}</div>
          <div style="font-size:0.72rem;color:#6a90b8;margin-top:2px">${shieldActive ? `Zaštita ističe za: <strong style="color:#00d4ff">${formatShieldTime(shieldTimeLeft)}</strong>` : 'Tvoja baza je dostupna za napad!'}</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:0.65rem;color:#6a90b8;margin-bottom:4px">KUPI SHIELD (BPW)</div>
          <div style="display:flex;gap:4px">
            ${[{h:1,sat:100},{h:4,sat:400},{h:12,sat:1080},{h:24,sat:1920}].map(s => `<button class="btn btn-gold" style="font-size:0.62rem;padding:3px 8px" onclick="buyShield(${s.h})">${s.h}h<br><span style="font-size:0.52rem">${s.sat} sat</span></button>`).join('')}
          </div>
        </div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
      <div>
        <div class="page-title" style="font-size:0.85rem">⚔️ NAPADNI</div>
        <div id="opponentList">${renderOpponentList(playerPower)}</div>
        <button class="btn btn-g" style="width:100%;margin-top:10px" onclick="refreshOpponents()">🔄 Osvježi listu</button>
      </div>
      <div>
        <div class="page-title" style="font-size:0.85rem">📋 HISTORIJA</div>
        <div id="pvpLog">${renderPvpLog()}</div>
      </div>
    </div>
  `;
}

window._currentOpponents = window._currentOpponents || [];

function refreshOpponents() {
  const playerPower = calcFleetTotalPower();
  window._currentOpponents = Array.from({ length: 5 }, () => generateAIOpponent(playerPower, pvp.rating));
  const el = document.getElementById('opponentList');
  if (el) el.innerHTML = renderOpponentList(playerPower);
  toast('🔄 Lista protivnika osvježena!', 'inf');
}

function renderOpponentList(playerPower) {
  if (window._currentOpponents.length === 0) {
    window._currentOpponents = Array.from({ length: 5 }, () => generateAIOpponent(playerPower, pvp.rating));
  }

  return window._currentOpponents.map((opp, idx) => {
    const powerDiff = opp.power - playerPower;
    const diffColor = powerDiff > 0 ? '#ff3355' : '#00ff88';
    const diffText  = powerDiff > 0 ? `▲ ${fmt(powerDiff)}` : `▼ ${fmt(Math.abs(powerDiff))}`;
    return `
      <div class="card" style="margin-bottom:8px;border-color:rgba(255,51,85,0.2)">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
          <div style="font-size:1.5rem">${opp.avatar}</div>
          <div style="flex:1">
            <div style="font-size:0.82rem;font-weight:700;color:white">${opp.name}</div>
            <div style="font-size:0.65rem;color:#6a90b8">Rating: <span style="color:#ffcc44">${opp.rating}</span></div>
          </div>
          <div style="text-align:right">
            <div style="font-size:0.72rem;font-family:'Orbitron',monospace;color:#00d4ff">${fmt(opp.power)}</div>
            <div style="font-size:0.62rem;color:${diffColor}">${diffText}</div>
          </div>
        </div>
        <div style="font-size:0.62rem;color:#6a90b8;margin-bottom:8px">🎁 Plijen: 🔩${fmt(Math.floor(opp.resources.metal*0.1))} 💎${fmt(Math.floor(opp.resources.crystal*0.1))} ⛽${fmt(Math.floor(opp.resources.he3*0.1))}</div>
        <button class="btn btn-r" style="width:100%;font-size:0.72rem" onclick="startPvpBattle(${idx})">⚔️ Napadni</button>
      </div>`;
  }).join('');
}

function renderPvpLog() {
  if (!pvp.history || pvp.history.length === 0) return '<div style="text-align:center;color:#6a90b8;padding:20px;font-size:0.72rem">Nema historije borbi.</div>';
  return pvp.history.slice(0, 10).map(entry => {
    const isWin = entry.result === 'victory';
    return `<div style="padding:8px 10px;margin-bottom:6px;border-radius:6px;background:${isWin ? 'rgba(0,255,136,0.05)' : 'rgba(255,51,85,0.05)'};border:1px solid ${isWin ? 'rgba(0,255,136,0.2)' : 'rgba(255,51,85,0.2)'}">
      <div style="display:flex;justify-content:space-between;margin-bottom:3px"><span style="font-size:0.72rem;color:${isWin ? '#00ff88' : '#ff3355'};font-weight:700">${isWin ? '🏆 POBJEDA' : '💀 PORAZ'}</span><span style="font-size:0.62rem;color:#6a90b8">${entry.ratingChange > 0 ? '+' : ''}${entry.ratingChange}</span></div>
      <div style="font-size:0.65rem;color:#6a90b8">vs ${entry.opponent} · ${entry.rounds} rundi</div>
      ${isWin && entry.loot ? `<div style="font-size:0.6rem;color:#ffcc44;margin-top:2px">🎁 +🔩${fmt(entry.loot.metal)} +💎${fmt(entry.loot.crystal)} +⛽${fmt(entry.loot.he3)}</div>` : ''}
      <div style="font-size:0.58rem;color:#6a90b8;margin-top:2px">${entry.date}</div>
    </div>`;
  }).join('');
}

function startPvpBattle(opponentIdx) {
  const opp = window._currentOpponents[opponentIdx];
  if (!opp) return;

  const fleetSlots = fleet.filter(s => s !== null);
  if (fleetSlots.length === 0) {
    toast('⚠️ Flota je prazna! Rasporedi brodove iz Hangara.', 'warn');
    return;
  }

  toast(`⚔️ PvP borba vs ${opp.name}...`, 'inf');

  setTimeout(() => {
    const battle = simulateBattle(fleetSlots, opp.fleet, {
      name: `PvP vs ${opp.name}`,
      difficulty: Math.min(10, Math.ceil(opp.power / 10000)),
      resources: { metal: [0,0], crystal: [0,0], he3: [0,0] },
      drops: {},
      type: 'pvp',
    });

    const isVictory = battle.status === 'victory';
    const ratingChange = isVictory ? 25 : -15;
    pvp.rating = Math.max(0, pvp.rating + ratingChange);

    if (isVictory) { pvp.wins++; if (typeof trackWeeklyPvp === 'function') trackWeeklyPvp(); }
    else pvp.losses++;
    if (typeof trackDailyPvp === 'function') trackDailyPvp();

    let loot = null;
    if (isVictory) {
      loot = {
        metal: Math.floor(opp.resources.metal * 0.1),
        crystal: Math.floor(opp.resources.crystal * 0.1),
        he3: Math.floor(opp.resources.he3 * 0.1),
      };
      R.metal += loot.metal;
      R.crystal += loot.crystal;
      R.he3 += loot.he3;
    }

    pvp.history.unshift({
      opponent: opp.name,
      result: battle.status,
      rounds: battle.round,
      ratingChange,
      loot,
      date: new Date().toLocaleString('sr'),
    });
    if (pvp.history.length > 50) pvp.history.pop();

    window._currentOpponents.splice(opponentIdx, 1);
    renderPvpBattleResult(battle, opp, loot, ratingChange);
    updateResUI();
    saveGame();
  }, 150);
}

function renderPvpBattleResult(battle, opp, loot, ratingChange) {
  const isVictory = battle.status === 'victory';
  const statusColor = isVictory ? '#00ff88' : '#ff3355';
  const statusIcon = isVictory ? '🏆' : '💀';
  const statusText = isVictory ? 'POBJEDA' : 'PORAZ';

  const body = `
    <div style="text-align:center;margin-bottom:20px"><div style="font-size:2.5rem;margin-bottom:8px">${statusIcon}</div><div style="font-family:'Orbitron',monospace;font-size:1.4rem;color:${statusColor}">${statusText}</div><div style="font-size:0.72rem;color:#6a90b8;margin-top:4px">vs ${opp.avatar} ${opp.name} · ${battle.round} rundi</div></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;text-align:center"><div style="background:rgba(0,0,0,0.3);padding:10px;border-radius:6px"><div style="font-size:0.65rem;color:#6a90b8">RATING PROMJENA</div><div style="font-size:1.3rem;font-family:'Orbitron',monospace;color:${ratingChange > 0 ? '#00ff88' : '#ff3355'}">${ratingChange > 0 ? '+' : ''}${ratingChange}</div></div><div style="background:rgba(0,0,0,0.3);padding:10px;border-radius:6px"><div style="font-size:0.65rem;color:#6a90b8">NOVI RATING</div><div style="font-size:1.3rem;font-family:'Orbitron',monospace;color:#ffcc44">${pvp.rating}</div></div></div>
    ${loot ? `<div style="background:rgba(0,255,136,0.05);border:1px solid rgba(0,255,136,0.2);border-radius:8px;padding:12px;margin-bottom:16px"><div style="font-size:0.72rem;color:#00ff88;font-weight:700;margin-bottom:8px">🎁 PLIJEN</div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;text-align:center"><div><div style="font-size:0.62rem;color:#6a90b8">METAL</div><div style="color:white;font-family:'Share Tech Mono',monospace">+${fmt(loot.metal)}</div></div><div><div style="font-size:0.62rem;color:#6a90b8">CRYSTAL</div><div style="color:white;font-family:'Share Tech Mono',monospace">+${fmt(loot.crystal)}</div></div><div><div style="font-size:0.62rem;color:#6a90b8">HE3</div><div style="color:white;font-family:'Share Tech Mono',monospace">+${fmt(loot.he3)}</div></div></div></div>` : ''}
    <div style="background:rgba(0,0,0,0.4);border-radius:8px;padding:10px;max-height:180px;overflow-y:auto;font-size:0.62rem;font-family:'Share Tech Mono',monospace"><div style="color:#6a90b8;margin-bottom:4px">BATTLE LOG:</div>${battle.log.map(entry => `<div style="color:${entry.type === 'round' ? '#00d4ff' : entry.type === 'attack' ? '#b0cce8' : entry.type === 'destroy' ? '#ff3355' : entry.type === 'effect' ? '#ffcc44' : entry.type === 'result' ? '#00ff88' : '#6a90b8'};margin-bottom:2px">${entry.msg}</div>`).join('')}</div>
  `;

  openModal(`${statusIcon} PvP: ${opp.name}`, body, [{ label: 'Zatvori', fn: () => { closeModal(); renderPvP(); } }]);
}

const SHIELD_PRICES = { 1: { satoshi: 100 }, 4: { satoshi: 400 }, 12: { satoshi: 1080 }, 24: { satoshi: 1920 } };

function buyShield(hours) {
  const price = SHIELD_PRICES[hours] || { satoshi: hours * 100 };
  openModal('🛡️ Kupi Shield', `<div style="text-align:center;padding:20px"><div style="font-size:2.5rem;margin-bottom:12px">🛡️</div><div style="font-size:1rem;font-weight:700;color:white;margin-bottom:4px">${hours}h zaštita</div><div style="font-size:1.4rem;color:#ffcc44;font-family:'Orbitron',monospace;margin-bottom:16px">${price.satoshi} satoshi BPW</div><div style="font-size:0.72rem;color:#6a90b8;background:rgba(0,0,0,0.3);padding:10px;border-radius:6px">HIVE blockchain plaćanje — uskoro dostupno.<br>BPW token integracija u razvoju.</div></div>`, [{ label: 'Zatvori', fn: closeModal }]);
}