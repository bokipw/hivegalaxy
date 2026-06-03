// ============================================================
// HIVE GALAXY — js/save.js
// Save / Load — localStorage (privremeno, later Supabase)
// ============================================================

function saveGame() {
  try {
    const saveData = {
      R,
      buildings,
      commander,
      research,
      fleet,
      ownedBlueprints,
      blueprintFragments,
      colonies,
      pvp,
      espDrones,
      espReports,
      artifactFragments,
      activeFormation,
      starterGiven,
      shipDesigns,
      hangar,
      instProgress: window._instProgress,
      pvpShield: window.pvpShield,
      artifactState: window.artifactState,
      achievementState: window.achievementState,
      missionState: window.missionState,
      missionCounters: {
        dailyInst: window._dailyInstCount||0,
        dailyDepot: window._dailyDepotCount||0,
        dailyRes: window._dailyResCount||0,
        dailyShip: window._dailyShipCount||0,
        dailyPvp: window._dailyPvpCount||0,
        dailyEsp: window._dailyEspCount||0,
        dailyBuild: window._dailyBuildCount||0,
        dailyArt: window._dailyArtCount||0,
        weeklyInst: window._weeklyInstCount||0,
        weeklyPvp: window._weeklyPvpCount||0,
        weeklyRes: window._weeklyResCount||0,
      },
      totalMetalMined: window._totalMetalMined,
      totalDepotPickups: window._totalDepotPickups,
      storageBuffer,
      buildQueue,
      recycleQueue,
      ACHIEVES,
    };
    localStorage.setItem('hive_save', JSON.stringify(saveData));
    const btn = document.getElementById('saveBtn');
    if (btn) { btn.textContent = '✅ Sačuvano'; setTimeout(() => btn.textContent = '💾 Sačuvaj', 1500); }
  } catch(e) {
    console.error('Save error:', e);
  }
}

function loadGame() {
  const raw = localStorage.getItem('hive_save');
  if (!raw) return false;
  try {
    const s = JSON.parse(raw);

    if (s.R)               Object.assign(R, s.R);
    if (s.storageBuffer)   Object.assign(storageBuffer, s.storageBuffer);
    if (s.buildQueue)      buildQueue = s.buildQueue;
    if (s.recycleQueue)    recycleQueue = s.recycleQueue;
    if (s.buildings)       Object.keys(s.buildings).forEach(k => { if (buildings[k]) buildings[k].level = s.buildings[k].level; });
    if (s.commander)       Object.assign(commander, s.commander);
    if (s.research)        Object.keys(s.research).forEach(k => { if (research[k]) research[k].level = s.research[k].level; });
    if (s.fleet)           fleet = s.fleet;
    if (s.ownedBlueprints)     Object.assign(ownedBlueprints, s.ownedBlueprints);
    if (s.blueprintFragments) Object.assign(blueprintFragments, s.blueprintFragments);
    if (s.colonies)        colonies = s.colonies;
    if (s.pvp)             Object.assign(pvp, s.pvp);
    if (s.espDrones != null)       espDrones = s.espDrones;
    if (s.espReports)              espReports = s.espReports;
    if (s.artifactFragments != null) artifactFragments = s.artifactFragments;
    if (s.activeFormation != null) activeFormation = s.activeFormation;
    if (s.starterGiven != null)    starterGiven = s.starterGiven;
    if (s.shipDesigns)             shipDesigns = s.shipDesigns;
    if (s.hangar)                  hangar = s.hangar;
    if (s.instProgress)            window._instProgress = s.instProgress;
    if (s.pvpShield)               window.pvpShield = s.pvpShield;
    if (s.artifactState)           window.artifactState = s.artifactState;
    if (s.achievementState)        window.achievementState = s.achievementState;
    if (s.missionState)            window.missionState = s.missionState;
    if (s.missionCounters) {
      const mc = s.missionCounters;
      window._dailyInstCount  = mc.dailyInst  || 0;
      window._dailyDepotCount = mc.dailyDepot || 0;
      window._dailyResCount   = mc.dailyRes   || 0;
      window._dailyShipCount  = mc.dailyShip  || 0;
      window._dailyPvpCount   = mc.dailyPvp   || 0;
      window._dailyEspCount   = mc.dailyEsp   || 0;
      window._dailyBuildCount = mc.dailyBuild || 0;
      window._dailyArtCount   = mc.dailyArt   || 0;
      window._weeklyInstCount = mc.weeklyInst || 0;
      window._weeklyPvpCount  = mc.weeklyPvp  || 0;
      window._weeklyResCount  = mc.weeklyRes  || 0;
    }
    if (s.totalMetalMined != null) window._totalMetalMined = s.totalMetalMined;
    if (s.totalDepotPickups != null) window._totalDepotPickups = s.totalDepotPickups;
    if (s.ACHIEVES)                ACHIEVES = s.ACHIEVES;

    return true;
  } catch(e) {
    console.error('Load error:', e);
    return false;
  }
}

function resetGame() {
  if (confirm('⚠️ SIGURNO? Ovo će obrisati SAV napredak!')) {
    localStorage.removeItem('hive_save');
    location.reload();
  }
}

function addTestResources() {
  R.metal   += 10000;
  R.crystal += 20000;
  R.he3     += 10000;
  R.energy   = getEnergyMax();
  R.instanceKeys = (R.instanceKeys || 0) + 100;  // DODATO: +100 ključeva
  if (typeof updateResUI === 'function') updateResUI();
  if (typeof toast === 'function') toast('➕ Test resursi + 100 ključeva dodani!', 'ok');
  saveGame();
}