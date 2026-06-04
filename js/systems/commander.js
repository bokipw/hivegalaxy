// ============================================================
// HIVE GALAXY — js/systems/commander.js
// Komandir — titule, sposobnosti, level bonusi
// ============================================================

// ── TITULE PO LEVELU ──
const COMMANDER_TITLES = [
  { level: 1,   title: 'Kadet',             color: '#6a90b8', icon: '🎖️'  },
  { level: 5,   title: 'Narednik',           color: '#00ff88', icon: '⭐'  },
  { level: 10,  title: 'Poručnik',           color: '#00ff88', icon: '⭐⭐' },
  { level: 20,  title: 'Kapetan',            color: '#4488ff', icon: '🌟'  },
  { level: 30,  title: 'Major',              color: '#4488ff', icon: '🌟🌟'},
  { level: 40,  title: 'Pukovnik',           color: '#aa44ff', icon: '💫'  },
  { level: 50,  title: 'Brigadir',           color: '#aa44ff', icon: '💫💫'},
  { level: 60,  title: 'General',            color: '#ffcc44', icon: '👑'  },
  { level: 75,  title: 'Admiral',            color: '#ffaa00', icon: '👑⭐' },
  { level: 90,  title: 'Fleet Admiral',      color: '#ff6600', icon: '👑🌟' },
  { level: 100, title: 'Galaktički Komandir', color: '#ff3355', icon: '🔱' },
];

// ── SPOSOBNOSTI PO LEVELU ──
const COMMANDER_ABILITIES = [
  {
    level: 1,
    id:    'basic_command',
    name:  'Osnovna Komanda',
    icon:  '📡',
    desc:  'Povećava produkciju svih resursa za 2% po levelu komandira.',
    type:  'passive',
  },
  {
    level: 5,
    id:    'fleet_discipline',
    name:  'Disciplina Flote',
    icon:  '⚔️',
    desc:  'Flota dobija +1% napad po levelu komandira.',
    type:  'passive',
  },
  {
    level: 10,
    id:    'tactical_shield',
    name:  'Taktički Štit',
    icon:  '🛡️',
    desc:  'Baza dobija +1% odbrane po levelu komandira.',
    type:  'passive',
  },
  {
    level: 20,
    id:    'resource_mastery',
    name:  'Majstorstvo Resursa',
    icon:  '⚙️',
    desc:  'Depot kapacitet +10% i produkcija metalnih rudnika +5%.',
    type:  'passive',
  },
  {
    level: 30,
    id:    'rally_cry',
    name:  'Borbeni Poklik',
    icon:  '📣',
    desc:  'Aktivna sposobnost: +25% napad flote za 60s. Cooldown: 10 min.',
    type:  'active',
    cooldown: 600,
  },
  {
    level: 40,
    id:    'energy_surge',
    name:  'Energetski Val',
    icon:  '⚡',
    desc:  'Aktivna: Energija se trenutno popunjava na MAX. Cooldown: 15 min.',
    type:  'active',
    cooldown: 900,
  },
  {
    level: 50,
    id:    'veteran_tactics',
    name:  'Veteranske Taktike',
    icon:  '🗺️',
    desc:  'Instance nagrade +15%. Misije se završavaju 10% brže.',
    type:  'passive',
  },
  {
    level: 60,
    id:    'galactic_presence',
    name:  'Galaktičko Prisustvo',
    icon:  '🌌',
    desc:  'PvP rating ne može pasti ispod 800. +10% nagrade za PvP pobjedu.',
    type:  'passive',
  },
  {
    level: 75,
    id:    'admirals_will',
    name:  'Admiralova Volja',
    icon:  '⚓',
    desc:  'Aktivna: Sve kolonije +50% produkcija 5 min. Cooldown: 30 min.',
    type:  'active',
    cooldown: 1800,
  },
  {
    level: 90,
    id:    'supreme_command',
    name:  'Vrhovna Komanda',
    icon:  '👑',
    desc:  'Sve pasivne sposobnosti +50% efikasnosti. Flota +20% ukupno.',
    type:  'passive',
  },
  {
    level: 100,
    id:    'galaxy_conqueror',
    name:  'Osvajač Galaksije',
    icon:  '🔱',
    desc:  'Aktivna: 30s god mode — sve nagrade x3, nema gubitaka. Cooldown: 2h.',
    type:  'active',
    cooldown: 7200,
  },
];

// ── COOLDOWN TRACKER ──
window._cmdCooldowns = window._cmdCooldowns || {};

// ── DOBIJ TRENUTNU TITULU ──
function getCommanderTitle() {
  const level = commander.level;
  let title   = COMMANDER_TITLES[0];
  for (const t of COMMANDER_TITLES) {
    if (level >= t.level) title = t;
  }
  return title;
}

// ── DOBIJ OTKLJUČANE SPOSOBNOSTI ──
function getUnlockedAbilities() {
  return COMMANDER_ABILITIES.filter(a => commander.level >= a.level);
}

// ── PASIVNI BONUSI ──
function getCmdProdBonus() {
  // +2% po levelu komandira na sve resurse
  const mult = commander.level >= 90 ? 1.5 : 1; // supreme_command
  return commander.level * 2 * mult; // u %
}

function getCmdFleetAttackBonus() {
  if (commander.level < 5) return 0;
  const mult = commander.level >= 90 ? 1.5 : 1;
  return commander.level * 1 * mult; // u %
}

function getCmdBaseDefenseBonus() {
  if (commander.level < 10) return 0;
  const mult = commander.level >= 90 ? 1.5 : 1;
  return commander.level * 1 * mult; // u %
}

function getCmdDepotBonus() {
  if (commander.level < 20) return 0;
  return 10; // +10% depot kapacitet
}

function getCmdInstanceBonus() {
  if (commander.level < 50) return 0;
  return 15; // +15% instance nagrade
}

function getCmdPvpRatingFloor() {
  return commander.level >= 60 ? 800 : 0;
}

// ── AKTIVNE SPOSOBNOSTI ──
function activateAbility(abilityId) {
  const ability = COMMANDER_ABILITIES.find(a => a.id === abilityId);
  if (!ability || ability.type !== 'active') return;
  if (commander.level < ability.level) {
    toast(`❌ Potreban Lv.${ability.level}!`, 'err');
    return;
  }

  const now      = Date.now();
  const lastUsed = window._cmdCooldowns[abilityId] || 0;
  const elapsed  = (now - lastUsed) / 1000;

  if (elapsed < ability.cooldown) {
    const remaining = Math.ceil(ability.cooldown - elapsed);
    toast(`⏳ Cooldown: ${formatTimer(remaining)}`, 'warn');
    return;
  }

  window._cmdCooldowns[abilityId] = now;

  switch (abilityId) {
    case 'rally_cry':
      window._rallyCryActive = true;
      setTimeout(() => { window._rallyCryActive = false; }, 60000);
      toast('📣 Borbeni Poklik! +25% napad flote 60s!', 'ok');
      addLog('📣 Komandir aktivirao Borbeni Poklik!');
      break;

    case 'energy_surge':
      R.energy = getEnergyMax();
      updateResUI();
      toast('⚡ Energetski Val! Energija popunjena!', 'ok');
      addLog('⚡ Komandir aktivirao Energetski Val!');
      break;

    case 'admirals_will':
      window._admiralsWillActive = true;
      setTimeout(() => { window._admiralsWillActive = false; }, 300000);
      toast('⚓ Admiralova Volja! Kolonije +50% produkcija 5min!', 'ok');
      addLog('⚓ Komandir aktivirao Admiralovu Volju!');
      break;

    case 'galaxy_conqueror':
      window._godModeActive = true;
      setTimeout(() => { window._godModeActive = false; }, 30000);
      toast('🔱 OSVAJAČ GALAKSIJE! God Mode 30s! x3 nagrade!', 'ok');
      addLog('🔱 Komandir aktivirao Osvajača Galaksije!');
      break;
  }

  renderCommander();
}

// ── RALLY CRY BONUS (za combat.js) ──
function getRallyCryBonus() {
  return window._rallyCryActive ? 25 : 0; // u %
}

// ── ADMIRALS WILL BONUS (za colonies.js) ──
function getAdmiralsWillBonus() {
  return window._admiralsWillActive ? 50 : 0; // u %
}

// ── GOD MODE CHECK ──
function isGodModeActive() {
  return !!window._godModeActive;
}

// ── XP TABELA ──
function getXpForLevel(level) {
  return Math.floor(1000 * Math.pow(1.4, level - 1));
}

// ── RENDER KOMANDIRA ──
function renderCommander() {
  // Ažurira desni panel
  const titleData = getCommanderTitle();
  const el        = document.getElementById('cmdTitle');
  if (el) {
    el.textContent  = titleData.title;
    el.style.color  = titleData.color;
  }

  // Ažurira XP bar
  updateResUI();
}

// ── RENDER COMMANDER PANEL (ako postoji) ──
function renderCommanderPanel() {
  const el = document.getElementById('commanderContent');
  if (!el) return;

  const titleData  = getCommanderTitle();
  const unlocked   = getUnlockedAbilities();
  const passive    = unlocked.filter(a => a.type === 'passive');
  const active     = unlocked.filter(a => a.type === 'active');
  const nextTitle  = COMMANDER_TITLES.find(t => t.level > commander.level);
  const now        = Date.now();

  el.innerHTML = `
    <!-- Komandir kartica -->
    <div class="card" style="margin-bottom:20px;border-color:${titleData.color}44">
      <div style="display:flex;align-items:center;gap:16px">
        <div style="font-size:3.5rem;filter:drop-shadow(0 0 10px ${titleData.color})">${titleData.icon}</div>
        <div style="flex:1">
          <div style="font-size:1.1rem;font-weight:700;color:${titleData.color};
            font-family:'Orbitron',monospace;letter-spacing:2px">
            ${titleData.title}
          </div>
          <div style="font-size:0.75rem;color:#6a90b8;margin:4px 0">
            Level ${commander.level} Komandir
          </div>
          <div class="pbar" style="height:8px;margin:8px 0">
            <div class="pbar-fill" style="width:${Math.min(100,(commander.exp/commander.nextExp)*100)}%;
              background:linear-gradient(90deg,${titleData.color}88,${titleData.color})"></div>
          </div>
          <div style="font-size:0.65rem;color:#6a90b8">
            ${fmt(commander.exp)} / ${fmt(commander.nextExp)} XP
            ${nextTitle ? `· Sljedeće: <span style="color:${nextTitle.color}">${nextTitle.title}</span> @ Lv.${nextTitle.level}` : '· MAX TITULA'}
          </div>
        </div>
      </div>
    </div>

    <!-- Pasivni bonusi -->
    <div class="card" style="margin-bottom:20px">
      <div style="font-size:0.75rem;font-weight:700;color:white;margin-bottom:12px">
        📊 AKTIVNI BONUSI
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;text-align:center">
        ${[
          { label:'Produkcija', val:`+${getCmdProdBonus()}%`, color:'#ffcc44' },
          { label:'Napad Flote', val:`+${getCmdFleetAttackBonus()}%`, color:'#ff4444' },
          { label:'Baza Odbrana', val:`+${getCmdBaseDefenseBonus()}%`, color:'#00ff88' },
          { label:'Depot +', val:`+${getCmdDepotBonus()}%`, color:'#4488ff' },
          { label:'Instance', val:`+${getCmdInstanceBonus()}%`, color:'#aa44ff' },
          { label:'PvP Floor', val:getCmdPvpRatingFloor()||'N/A', color:'#ff8833' },
        ].map(b => `
          <div style="background:rgba(0,0,0,0.3);border-radius:6px;padding:8px">
            <div style="font-size:1rem;font-weight:700;color:${b.color};
              font-family:'Orbitron',monospace">${b.val}</div>
            <div style="font-size:0.58rem;color:#6a90b8;margin-top:2px">${b.label}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Aktivne sposobnosti -->
    ${active.length > 0 ? `
      <div style="font-family:'Orbitron',monospace;font-size:0.75rem;color:#00d4ff;
        letter-spacing:2px;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid rgba(0,212,255,0.15)">
        ⚡ AKTIVNE SPOSOBNOSTI
      </div>
      <div class="grid-3" style="margin-bottom:20px">
        ${active.map(ab => {
          const lastUsed  = window._cmdCooldowns[ab.id] || 0;
          const elapsed   = (now - lastUsed) / 1000;
          const onCd      = elapsed < ab.cooldown;
          const remaining = onCd ? Math.ceil(ab.cooldown - elapsed) : 0;
          return `
            <div class="card" style="border-color:${onCd?'rgba(106,144,184,0.2)':'rgba(0,212,255,0.3)'}">
              <div style="font-size:2rem;text-align:center;margin-bottom:8px">${ab.icon}</div>
              <div style="font-size:0.78rem;font-weight:700;color:${onCd?'#6a90b8':'white'};
                margin-bottom:6px;text-align:center">${ab.name}</div>
              <div style="font-size:0.62rem;color:#6a90b8;margin-bottom:10px;text-align:center;
                line-height:1.5">${ab.desc}</div>
              <button class="btn ${onCd?'':'btn-g'}" style="width:100%;font-size:0.72rem"
                onclick="activateAbility('${ab.id}')" ${onCd?'disabled':''}>
                ${onCd ? `⏳ ${formatTimer(remaining)}` : '▶ Aktiviraj'}
              </button>
            </div>`;
        }).join('')}
      </div>
    ` : ''}

    <!-- Pasivne sposobnosti -->
    <div style="font-family:'Orbitron',monospace;font-size:0.75rem;color:#00d4ff;
      letter-spacing:2px;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid rgba(0,212,255,0.15)">
      🛡️ PASIVNE SPOSOBNOSTI
    </div>
    <div class="grid-3" style="margin-bottom:20px">
      ${passive.map(ab => `
        <div class="card" style="border-color:rgba(170,68,255,0.2)">
          <div style="font-size:2rem;text-align:center;margin-bottom:8px">${ab.icon}</div>
          <div style="font-size:0.78rem;font-weight:700;color:#aa44ff;
            margin-bottom:6px;text-align:center">${ab.name}</div>
          <div style="font-size:0.62rem;color:#6a90b8;text-align:center;line-height:1.5">
            ${ab.desc}
          </div>
        </div>`).join('')}
    </div>

    <!-- Zaključane sposobnosti -->
    <div style="font-family:'Orbitron',monospace;font-size:0.75rem;color:#6a90b8;
      letter-spacing:2px;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.06)">
      🔒 ZAKLJUČANO
    </div>
    <div class="grid-3">
      ${COMMANDER_ABILITIES.filter(a => commander.level < a.level).map(ab => `
        <div class="card" style="opacity:0.4;border-color:rgba(106,144,184,0.1)">
          <div style="font-size:2rem;text-align:center;margin-bottom:8px;filter:grayscale(1)">${ab.icon}</div>
          <div style="font-size:0.78rem;font-weight:700;color:#6a90b8;
            margin-bottom:4px;text-align:center">${ab.name}</div>
          <div style="font-size:0.6rem;color:#444;text-align:center">
            🔒 Lv.${ab.level} potreban
          </div>
        </div>`).join('')}
    </div>
  `;
}

// ── AŽURIRANJE TITULE U STATE-U ──
function updateCommanderTitle() {
  const titleData   = getCommanderTitle();
  commander.title   = titleData.title;
}

// Hook u addExp iz economy.js — pozivaj updateCommanderTitle nakon level up
const _origAddExp = typeof addExp === 'function' ? addExp : null;
if (_origAddExp) {
  // addExp je već definisan u economy.js — dodajemo title update
  const _addExpOrig = addExp;
  window.addExp = function(amount) {
    _addExpOrig(amount);
    updateCommanderTitle();
  };
}