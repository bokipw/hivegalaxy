// ============================================================
// HIVE GALAXY — js/systems/missions.js
// Misije — Dnevne (10), Sedmične (3), Storyline (permanentne)
// ============================================================

// ── MISSION STATE ──
if (!window.missionState) {
  window.missionState = {
    daily: {
      date:         null,
      missions:     [],
      claimed:      [],
      bonusClaimed: false,
    },
    weekly: {
      week:     null,
      missions: [],
      claimed:  [],
    },
    storyline: {
      completed: [],
      claimed:   [],
    },
  };
}

// ── HELPER: DATUM/SEDMICA — BUGFIX ──
function getTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; // BUGFIX: +1
}

function getWeekStr() {
  const d    = new Date();
  const day  = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const mon  = new Date(d.getFullYear(), d.getMonth(), diff); // BUGFIX: novi Date, ne mutira d
  return `${mon.getFullYear()}-${mon.getMonth() + 1}-${mon.getDate()}`; // BUGFIX: +1
}

// ── DNEVNE MISIJE ──
const DAILY_MISSION_TYPES = [
  {
    id:    'login',
    name:  'Dnevna prijava',
    icon:  '📅',
    desc:  'Uloguji se u igru',
    check: () => true,
    reward: { metal: 300, crystal: 200, he3: 100, xp: 50, instanceKeys: 1 },
  },
  {
    id:    'instances',
    name:  'Galaktički Ratnik',
    icon:  '⚔️',
    desc:  () => `Pređi ${window._dailyInstTarget || 1} instanci`,
    target: () => { window._dailyInstTarget = Math.floor(Math.random() * 3) + 1; return window._dailyInstTarget; },
    check: () => (window._dailyInstCount || 0) >= (window._dailyInstTarget || 1),
    reward: { metal: 1000, crystal: 600, he3: 300, xp: 150, instanceKeys: 1 },
  },
  {
    id:    'depot',
    name:  'Logističar',
    icon:  '📦',
    desc:  () => `Pokupi resurse iz Depota ${window._dailyDepotTarget || 2} puta`,
    target: () => { window._dailyDepotTarget = Math.floor(Math.random() * 4) + 2; return window._dailyDepotTarget; },
    check: () => (window._dailyDepotCount || 0) >= (window._dailyDepotTarget || 2),
    reward: { metal: 800, crystal: 400, he3: 200, xp: 100, instanceKeys: 1 },
  },
  {
    id:    'research',
    name:  'Naučnik Dana',
    icon:  '🔬',
    desc:  () => `Istraži ${window._dailyResTarget || 1} puta`,
    target: () => { window._dailyResTarget = Math.floor(Math.random() * 3) + 1; return window._dailyResTarget; },
    check: () => (window._dailyResCount || 0) >= (window._dailyResTarget || 1),
    reward: { metal: 600, crystal: 500, he3: 250, xp: 120, instanceKeys: 1 },
  },
  {
    id:    'build_ships',
    name:  'Brodograditelj',
    icon:  '🚀',
    desc:  () => `Izgradi ${window._dailyShipTarget || 50} brodova`,
    target: () => { window._dailyShipTarget = [50,100,200,500][Math.floor(Math.random()*4)]; return window._dailyShipTarget; },
    check: () => (window._dailyShipCount || 0) >= (window._dailyShipTarget || 50), // BUGFIX: tracker se poziva iz designer.js
    reward: { metal: 1200, crystal: 700, he3: 350, xp: 180, instanceKeys: 1 },
  },
  {
    id:    'pvp_battle',
    name:  'Arena Borac',
    icon:  '🏟️',
    desc:  'Odigraj 1 PvP borbu',
    check: () => (window._dailyPvpCount || 0) >= 1,
    reward: { metal: 900, crystal: 500, he3: 250, xp: 150, instanceKeys: 1, bpw: 10 },
  },
  {
    id:    'espionage',
    name:  'Špijun Dana',
    icon:  '🕵️',
    desc:  'Uspješno špijuniraj 1 protivnika',
    check: () => (window._dailyEspCount || 0) >= 1,
    reward: { metal: 700, crystal: 600, he3: 200, xp: 120, instanceKeys: 1 },
  },
  {
    id:    'upgrade_building',
    name:  'Graditelj',
    icon:  '🏗️',
    desc:  'Unapredi 1 zgradu',
    check: () => (window._dailyBuildCount || 0) >= 1, // BUGFIX: tracker se poziva iz buildings.js
    reward: { metal: 1500, crystal: 800, he3: 400, xp: 200, instanceKeys: 1 },
  },
  {
    id:    'collect_artifacts',
    name:  'Tragač za Artefaktima',
    icon:  '💠',
    desc:  'Dobij 1 artifact fragment',
    check: () => (window._dailyArtCount || 0) >= 1,
    reward: { metal: 800, crystal: 600, he3: 300, xp: 150, instanceKeys: 1 },
  },
  {
    id:    'fleet_power',
    name:  'Komandant Galaksije',
    icon:  '💫',
    desc:  () => `Dostign ${fmt(window._dailyPowerTarget || 1000)} Fleet Power`,
    target: () => {
      // BUGFIX: target se generiše samo jednom pri generateDailyMissions, ne svaki render
      if (!window._dailyPowerTarget) {
        const cur = calcFleetTotalPower();
        window._dailyPowerTarget = Math.max(1000, Math.floor(cur * 1.1));
      }
      return window._dailyPowerTarget;
    },
    check: () => calcFleetTotalPower() >= (window._dailyPowerTarget || 1000),
    reward: { metal: 2000, crystal: 1000, he3: 500, xp: 300, instanceKeys: 1 },
  },
];

// ── SEDMIČNE MISIJE ──
const WEEKLY_MISSION_TYPES = [
  {
    id:    'weekly_instances',
    name:  'Tjedni Osvajač',
    icon:  '🌌',
    desc:  () => `Pređi ${window._weeklyInstTarget || 5} instanci`,
    target: () => { window._weeklyInstTarget = Math.floor(Math.random() * 6) + 5; return window._weeklyInstTarget; },
    check: () => (window._weeklyInstCount || 0) >= (window._weeklyInstTarget || 5),
    reward: { metal: 10000, crystal: 5000, he3: 2500, xp: 1000, instanceKeys: 5, bpw: 50 },
  },
  {
    id:    'weekly_pvp',
    name:  'Arena Šampion',
    icon:  '⚔️',
    desc:  () => `Pobijedi u ${window._weeklyPvpTarget || 2} PvP borbi`,
    target: () => { window._weeklyPvpTarget = Math.floor(Math.random() * 4) + 2; return window._weeklyPvpTarget; },
    check: () => (window._weeklyPvpCount || 0) >= (window._weeklyPvpTarget || 2),
    reward: { metal: 8000, crystal: 6000, he3: 3000, xp: 1500, bpw: 100, instanceKeys: 3 },
  },
  {
    id:    'weekly_research',
    name:  'Tjedni Istraživač',
    icon:  '🔬',
    desc:  () => `Istraži ${window._weeklyResTarget || 10} puta`,
    target: () => { window._weeklyResTarget = Math.floor(Math.random() * 10) + 10; return window._weeklyResTarget; },
    check: () => (window._weeklyResCount || 0) >= (window._weeklyResTarget || 10),
    reward: { metal: 12000, crystal: 8000, he3: 4000, xp: 2000, art_fragment: 'R', instanceKeys: 5 },
  },
];

// ── STORYLINE MISIJE ──
const STORYLINE_MISSIONS = [
  {
    id: 'story_1', tier: 1,
    name: 'Prve Korake', icon: '🚀',
    desc: 'Unapredi HQ na Lv.2',
    check: () => (buildings.hq?.level || 0) >= 2,
    reward: { metal: 5000, crystal: 2000, he3: 1000, xp: 300, instanceKeys: 2 },
  },
  {
    id: 'story_2', tier: 2,
    name: 'Brodograditelj', icon: '🏭',
    desc: 'Napravi prvi brod i rasporedi ga u flotu',
    check: () => fleet.some(s => s !== null),
    reward: { metal: 8000, crystal: 4000, he3: 2000, xp: 500, instanceKeys: 3 },
    requires: 'story_1',
  },
  {
    id: 'story_3', tier: 3,
    name: 'Krstim Galaksiju', icon: '⚔️',
    desc: 'Pređi prvu instancu',
    check: () => Object.values(window._instProgress || {}).some(p => p.completed),
    reward: { metal: 15000, crystal: 8000, he3: 4000, xp: 1000, instanceKeys: 5, bpw: 50 },
    requires: 'story_2',
  },
  {
    id: 'story_4', tier: 4,
    name: 'Naučni Um', icon: '🔬',
    desc: 'Istraži prvu granu istraživanja na Lv.10',
    check: () => Object.values(research).some(r => (r.level||0) >= 10),
    reward: { metal: 20000, crystal: 10000, he3: 5000, xp: 1500, instanceKeys: 5, bpw: 100 },
    requires: 'story_3',
  },
  {
    id: 'story_5', tier: 5,
    name: 'Arena Debi', icon: '🏟️',
    desc: 'Odigraj prvu PvP borbu',
    check: () => (pvp.wins + pvp.losses) >= 1,
    reward: { metal: 25000, crystal: 12000, he3: 6000, xp: 2000, instanceKeys: 8, bpw: 150 },
    requires: 'story_4',
  },
  {
    id: 'story_6', tier: 6,
    name: 'Sakupljač Tajni', icon: '🕵️',
    desc: 'Uspješno špijuniraj prvog protivnika',
    check: () => espReports.some(r => r.success),
    reward: { metal: 30000, crystal: 15000, he3: 7500, xp: 2500, instanceKeys: 10, bpw: 200 },
    requires: 'story_5',
  },
  {
    id: 'story_7', tier: 7,
    name: 'Kolekcionar Sile', icon: '💠',
    desc: 'Otključaj prvi artefakt',
    check: () => (window.artifactState?.unlocked?.length || 0) >= 1,
    reward: { metal: 40000, crystal: 20000, he3: 10000, xp: 3000, instanceKeys: 10, bpw: 300, art_fragment: 'R' },
    requires: 'story_6',
  },
  {
    id: 'story_8', tier: 8,
    name: 'Gospodar Baze', icon: '🏛️',
    desc: 'Dostign HQ Lv.25',
    check: () => (buildings.hq?.level || 0) >= 25,
    reward: { metal: 80000, crystal: 40000, he3: 20000, xp: 5000, instanceKeys: 15, bpw: 500, art_fragment: 'E' },
    requires: 'story_7',
  },
  {
    id: 'story_9', tier: 9,
    name: 'Restriktivna Zona', icon: '🔒',
    desc: 'Pređi prvu Restricted instancu',
    check: () => Object.keys(window._instProgress || {}).some(k => k.startsWith('rest_') && window._instProgress[k].completed),
    reward: { metal: 100000, crystal: 50000, he3: 25000, xp: 8000, instanceKeys: 20, bpw: 1000, art_fragment: 'E' },
    requires: 'story_8',
  },
  {
    id: 'story_10', tier: 10,
    name: 'Legenda Galaksije', icon: '👑',
    desc: 'Dostign Fleet Power 1.000.000',
    check: () => calcFleetTotalPower() >= 1000000,
    reward: { metal: 500000, crystal: 250000, he3: 125000, xp: 20000, instanceKeys: 50, bpw: 5000, art_fragment: 'L' },
    requires: 'story_9',
  },
];

// ── GENERIŠI DNEVNE MISIJE ──
function generateDailyMissions() {
  const today = getTodayStr();
  if (window.missionState.daily.date === today) return;

  // Reset countera
  window._dailyInstCount  = 0;
  window._dailyDepotCount = 0;
  window._dailyResCount   = 0;
  window._dailyShipCount  = 0;
  window._dailyPvpCount   = 0;
  window._dailyEspCount   = 0;
  window._dailyBuildCount = 0;
  window._dailyArtCount   = 0;
  window._dailyPowerTarget = null; // BUGFIX: reset power target

  // Generiši targete
  DAILY_MISSION_TYPES.forEach(m => { if (m.target) m.target(); });

  window.missionState.daily = {
    date:         today,
    missions:     DAILY_MISSION_TYPES.map(m => m.id),
    claimed:      [],
    bonusClaimed: false,
  };

  addLog('📅 Nove dnevne misije dostupne!');
  toast('📅 Nove dnevne misije! Možeš zaraditi do 20 🗝️ danas.', 'inf');
  saveGame();
}

// ── GENERIŠI SEDMIČNE MISIJE ──
function generateWeeklyMissions() {
  const week = getWeekStr();
  if (window.missionState.weekly.week === week) return;

  window._weeklyInstCount = 0;
  window._weeklyPvpCount  = 0;
  window._weeklyResCount  = 0;

  WEEKLY_MISSION_TYPES.forEach(m => { if (m.target) m.target(); });

  window.missionState.weekly = {
    week:     week,
    missions: WEEKLY_MISSION_TYPES.map(m => m.id),
    claimed:  [],
  };

  addLog('📅 Nove sedmične misije dostupne!');
  saveGame();
}

// ── PREUZMI NAGRADU ──
function claimMissionReward(missionId, type) {
  const state = type === 'daily'
    ? window.missionState.daily
    : type === 'weekly'
      ? window.missionState.weekly
      : window.missionState.storyline;

  if (state.claimed.includes(missionId)) return;

  const mission = type === 'storyline'
    ? STORYLINE_MISSIONS.find(m => m.id === missionId)
    : type === 'daily'
      ? DAILY_MISSION_TYPES.find(m => m.id === missionId)
      : WEEKLY_MISSION_TYPES.find(m => m.id === missionId);

  if (!mission) return;

  const r = mission.reward;
  if (r.metal)        R.metal        += r.metal;
  if (r.crystal)      R.crystal      += r.crystal;
  if (r.he3)          R.he3          += r.he3;
  if (r.xp)           addExp(r.xp);
  if (r.bpw)          R.spCard        = (R.spCard || 0) + r.bpw;
  if (r.instanceKeys) R.instanceKeys  = (R.instanceKeys || 0) + r.instanceKeys;
  if (r.art_fragment && typeof addArtifactFragment === 'function') {
    if (window.ARTIFACTS_DATA) {
      const pool = ARTIFACTS_DATA.filter(a => a.rarity === r.art_fragment &&
        !window.artifactState?.unlocked?.includes(a.id));
      if (pool.length > 0) {
        const art = pool[Math.floor(Math.random() * pool.length)];
        addArtifactFragment(art.id, 1);
      }
    }
  }

  state.claimed.push(missionId);
  if (type === 'storyline') {
    window.missionState.storyline.completed.push(missionId);
  }

  updateResUI();
  saveGame();
  renderMissions();
  toast(`🎁 ${mission.icon} ${mission.name}: +${r.instanceKeys ? r.instanceKeys + '🗝️ ' : ''}nagrada preuzeta!`, 'ok');
  addLog(`🎁 Misija završena: ${mission.name}`);
}

// ── BONUS NAGRADA (10/10) ──
function claimDailyBonus() {
  if (window.missionState.daily.bonusClaimed) return;
  const completed = DAILY_MISSION_TYPES.filter(m => {
    try { return m.check(); } catch(e) { return false; }
  }).length;
  if (completed < 10) { toast('⚠️ Završi svih 10 dnevnih misija!', 'warn'); return; }

  // AŽURIRANE NAGRADE
  R.metal        += 10000;
  R.crystal      += 10000;
  R.he3          += 10000;
  R.instanceKeys  = (R.instanceKeys || 0) + 10;
  R.spCard        = (R.spCard || 0) + 100;
  addExp(1000);

  window.missionState.daily.bonusClaimed = true;

  updateResUI();
  saveGame();
  renderMissions();
  toast('🎉 BONUS 10/10! +10k metal, +10k crystal, +10k he3, +10🗝️, +100 BPW!', 'ok');
  addLog('🎉 Dnevni bonus 10/10 preuzet!');
}

// ── TRACKER FUNKCIJE ──
function trackDailyInstance()   { window._dailyInstCount  = (window._dailyInstCount  || 0) + 1; window._weeklyInstCount = (window._weeklyInstCount || 0) + 1; }
function trackDailyDepot()      { window._dailyDepotCount = (window._dailyDepotCount || 0) + 1; }
function trackDailyResearch()   { window._dailyResCount   = (window._dailyResCount   || 0) + 1; window._weeklyResCount = (window._weeklyResCount || 0) + 1; }
function trackDailyShips(n)     { window._dailyShipCount  = (window._dailyShipCount  || 0) + (n || 1); }
function trackDailyPvp()        { window._dailyPvpCount   = (window._dailyPvpCount   || 0) + 1; window._weeklyPvpCount = (window._weeklyPvpCount || 0) + 1; }
function trackDailyEsp()        { window._dailyEspCount   = (window._dailyEspCount   || 0) + 1; }
function trackDailyBuild()      { window._dailyBuildCount = (window._dailyBuildCount || 0) + 1; }
function trackDailyArt()        { window._dailyArtCount   = (window._dailyArtCount   || 0) + 1; }
function trackWeeklyInstance()  { /* već u trackDailyInstance */ }
function trackWeeklyPvp()       { /* već u trackDailyPvp */ }
function trackWeeklyResearch()  { /* već u trackDailyResearch */ }

// ── RENDER ──
let _missionTab = 'daily';

function renderMissions() {
  const el = document.getElementById('missionsContent');
  if (!el) return;

  generateDailyMissions();
  generateWeeklyMissions();

  const dailyCompleted  = DAILY_MISSION_TYPES.filter(m => { try { return m.check(); } catch(e){ return false; } }).length;
  const weeklyCompleted = WEEKLY_MISSION_TYPES.filter(m => { try { return m.check(); } catch(e){ return false; } }).length;
  const storyCompleted  = window.missionState.storyline.completed.length;

  el.innerHTML = `
    <!-- Tabs -->
    <div style="display:flex;gap:6px;margin-bottom:16px">
      ${[
        { key:'daily',     label:`📅 Dnevne (${dailyCompleted}/10)`,       color:'#00d4ff' },
        { key:'weekly',    label:`📆 Sedmične (${weeklyCompleted}/3)`,      color:'#ffcc44' },
        { key:'storyline', label:`📖 Priča (${storyCompleted}/${STORYLINE_MISSIONS.length})`, color:'#aa44ff' },
      ].map(t => `
        <button class="btn ${_missionTab===t.key?'btn-gold':''}"
          style="font-size:0.78rem;${_missionTab===t.key?'border-color:'+t.color+';color:'+t.color:''}"
          onclick="_missionTab='${t.key}';renderMissions()">
          ${t.label}
        </button>`).join('')}
    </div>

    ${_missionTab === 'daily'     ? renderDailyMissions(dailyCompleted)  : ''}
    ${_missionTab === 'weekly'    ? renderWeeklyMissions()                : ''}
    ${_missionTab === 'storyline' ? renderStorylineMissions()             : ''}
  `;
}

function renderDailyMissions(completedCount) {
  const bonusReady   = completedCount >= 10;
  const bonusClaimed = window.missionState.daily.bonusClaimed;

  return `
    <div class="card" style="margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <div>
          <div style="font-size:0.82rem;font-weight:700;color:#00d4ff">DNEVNE MISIJE</div>
          <div style="font-size:0.62rem;color:#6a90b8;margin-top:2px">
            Max danas: <span style="color:#ffcc44">20🗝️</span>
            (10 iz misija + 10 bonus)
          </div>
        </div>
        <div style="font-size:0.72rem;color:#6a90b8">Reset: ponoć</div>
      </div>
      <div class="pbar" style="height:10px;margin-bottom:8px">
        <div class="pbar-fill" style="width:${(completedCount/10)*100}%;background:#00d4ff"></div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span style="font-size:0.72rem;color:#6a90b8">${completedCount}/10 završeno</span>
        <button class="btn ${bonusReady && !bonusClaimed ? 'btn-g' : ''}"
          style="font-size:0.72rem" onclick="claimDailyBonus()"
          ${!bonusReady || bonusClaimed ? 'disabled' : ''}>
          ${bonusClaimed ? '✅ Bonus preuzet' : bonusReady ? '🎉 Preuzmi bonus!' : `🎁 Bonus (${completedCount}/10)`}
        </button>
      </div>
      ${bonusReady && !bonusClaimed ? `
        <div style="font-size:0.65rem;color:#00ff88;margin-top:6px">
          🎁 Bonus: +10k metal, +10k crystal, +10k he3, +10🗝️, +100 BPW
        </div>` : ''}
    </div>

    <div class="grid-2">
      ${DAILY_MISSION_TYPES.map(m => {
        let completed = false;
        try { completed = m.check(); } catch(e){}
        const claimed = window.missionState.daily.claimed.includes(m.id);
        const desc    = typeof m.desc === 'function' ? m.desc() : m.desc;
        const r       = m.reward;

        return `
          <div class="card" style="border-color:${claimed?'rgba(255,204,68,0.2)':completed?'rgba(0,255,136,0.3)':'rgba(255,255,255,0.08)'}">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
              <div style="font-size:1.4rem">${m.icon}</div>
              <div style="flex:1">
                <div style="font-size:0.78rem;font-weight:700;
                  color:${claimed?'#ffcc44':completed?'#00ff88':'white'}">${m.name}</div>
                <div style="font-size:0.62rem;color:#6a90b8">${desc}</div>
              </div>
              ${completed ? `<div style="color:${claimed?'#ffcc44':'#00ff88'};font-size:1rem">${claimed?'✅':'✅'}</div>` : ''}
            </div>
            <div style="font-size:0.6rem;color:#6a90b8;margin-bottom:6px;line-height:1.6">
              ${r.metal        ? `🔩${fmt(r.metal)} `         : ''}
              ${r.crystal      ? `💎${fmt(r.crystal)} `       : ''}
              ${r.he3          ? `⛽${fmt(r.he3)} `           : ''}
              ${r.xp           ? `⭐${fmt(r.xp)}XP `         : ''}
              ${r.instanceKeys ? `<span style="color:#ffcc44">🗝️${r.instanceKeys}</span> ` : ''}
              ${r.bpw          ? `<span style="color:#ffcc44">🐝${r.bpw}BPW</span>`        : ''}
            </div>
            ${completed && !claimed ? `
              <button class="btn btn-g" style="width:100%;font-size:0.68rem"
                onclick="claimMissionReward('${m.id}','daily')">🎁 Preuzmi</button>
            ` : claimed ? `
              <div style="font-size:0.65rem;color:#ffcc44;text-align:center">✅ Preuzeto</div>
            ` : `
              <div style="font-size:0.65rem;color:#6a90b8;text-align:center">⏳ U toku...</div>
            `}
          </div>`;
      }).join('')}
    </div>`;
}

function renderWeeklyMissions() {
  return `
    <div class="card" style="margin-bottom:16px">
      <div style="font-size:0.82rem;font-weight:700;color:#ffcc44;margin-bottom:4px">SEDMIČNE MISIJE</div>
      <div style="font-size:0.65rem;color:#6a90b8">Reset: svaki ponedjeljak u ponoć</div>
    </div>
    <div style="display:flex;flex-direction:column;gap:10px">
      ${WEEKLY_MISSION_TYPES.map(m => {
        let completed = false;
        try { completed = m.check(); } catch(e){}
        const claimed = window.missionState.weekly.claimed.includes(m.id);
        const desc    = typeof m.desc === 'function' ? m.desc() : m.desc;
        const r       = m.reward;

        return `
          <div class="card" style="border-color:${completed?'rgba(255,204,68,0.3)':'rgba(255,255,255,0.08)'}">
            <div style="display:flex;align-items:center;gap:12px">
              <div style="font-size:1.8rem">${m.icon}</div>
              <div style="flex:1">
                <div style="font-size:0.85rem;font-weight:700;
                  color:${completed?'#ffcc44':'white'}">${m.name}</div>
                <div style="font-size:0.7rem;color:#6a90b8;margin-top:2px">${desc}</div>
                <div style="font-size:0.62rem;color:#6a90b8;margin-top:6px;line-height:1.8">
                  ${r.metal        ? `🔩${fmt(r.metal)} `         : ''}
                  ${r.crystal      ? `💎${fmt(r.crystal)} `       : ''}
                  ${r.he3          ? `⛽${fmt(r.he3)} `           : ''}
                  ${r.xp           ? `⭐${fmt(r.xp)}XP `         : ''}
                  ${r.instanceKeys ? `<span style="color:#ffcc44">🗝️${r.instanceKeys}</span> ` : ''}
                  ${r.bpw          ? `<span style="color:#ffcc44">🐝${r.bpw}BPW</span> `       : ''}
                  ${r.art_fragment ? `<span style="color:#4488ff">🧩${r.art_fragment}</span>`  : ''}
                </div>
              </div>
              <div>
                ${completed && !claimed ? `
                  <button class="btn btn-g" style="font-size:0.72rem"
                    onclick="claimMissionReward('${m.id}','weekly')">🎁 Preuzmi</button>
                ` : claimed ? `
                  <div style="color:#ffcc44;font-size:0.72rem">✅ Preuzeto</div>
                ` : `
                  <div style="color:#6a90b8;font-size:0.72rem">⏳ U toku</div>
                `}
              </div>
            </div>
          </div>`;
      }).join('')}
    </div>`;
}

function renderStorylineMissions() {
  return `
    <div class="card" style="margin-bottom:16px">
      <div style="font-size:0.82rem;font-weight:700;color:#aa44ff;margin-bottom:4px">📖 PRIČA GALAKSIJE</div>
      <div style="font-size:0.65rem;color:#6a90b8">Permanentne misije — ne resetuju se</div>
    </div>
    <div style="display:flex;flex-direction:column;gap:8px">
      ${STORYLINE_MISSIONS.map(m => {
        const locked   = m.requires && !window.missionState.storyline.completed.includes(m.requires);
        let completed  = false;
        try { completed = !locked && m.check(); } catch(e){}
        const claimed  = window.missionState.storyline.claimed.includes(m.id);
        const r        = m.reward;
        const tierColor = m.tier <= 3 ? '#ffdd00' : m.tier <= 6 ? '#4488ff' : m.tier <= 8 ? '#aa44ff' : '#ffaa00';

        return `
          <div class="card" style="
            border-color:${completed?'rgba(170,68,255,0.3)':locked?'rgba(255,255,255,0.04)':'rgba(255,255,255,0.1)'};
            opacity:${locked?0.4:1}">
            <div style="display:flex;align-items:center;gap:10px">
              <div style="font-size:1.5rem">${locked?'🔒':m.icon}</div>
              <div style="flex:1">
                <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">
                  <span style="font-size:0.78rem;font-weight:700;
                    color:${completed?'#aa44ff':locked?'#6a90b8':'white'}">${m.name}</span>
                  <span style="font-size:0.58rem;padding:1px 5px;border-radius:3px;
                    background:${tierColor}22;border:1px solid ${tierColor}44;color:${tierColor}">T${m.tier}</span>
                </div>
                <div style="font-size:0.65rem;color:#6a90b8;margin-bottom:4px">${m.desc}</div>
                <div style="font-size:0.6rem;color:#6a90b8;line-height:1.6">
                  ${r.metal        ? `🔩${fmt(r.metal)} `         : ''}
                  ${r.crystal      ? `💎${fmt(r.crystal)} `       : ''}
                  ${r.he3          ? `⛽${fmt(r.he3)} `           : ''}
                  ${r.xp           ? `⭐${fmt(r.xp)}XP `         : ''}
                  ${r.instanceKeys ? `<span style="color:#ffcc44">🗝️${r.instanceKeys}</span> ` : ''}
                  ${r.bpw          ? `<span style="color:#ffcc44">🐝${r.bpw}BPW</span> `       : ''}
                  ${r.art_fragment ? `<span style="color:#4488ff">🧩${r.art_fragment}</span>`  : ''}
                </div>
              </div>
              <div style="min-width:80px;text-align:right">
                ${completed && !claimed ? `
                  <button class="btn btn-g" style="font-size:0.65rem;padding:4px 8px"
                    onclick="claimMissionReward('${m.id}','storyline')">🎁 Preuzmi</button>
                ` : claimed ? `
                  <div style="font-size:0.65rem;color:#ffcc44">✅ Završeno</div>
                ` : locked ? `
                  <div style="font-size:0.62rem;color:#6a90b8">🔒 Zaključano</div>
                ` : `
                  <div style="font-size:0.65rem;color:#6a90b8">⏳ U toku</div>
                `}
              </div>
            </div>
          </div>`;
      }).join('')}
    </div>`;
}