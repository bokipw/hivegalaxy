// ============================================================
// HIVE GALAXY — js/main.js
// Inicijalizacija i game loop — zadnji fajl koji se učitava
// CSS stilovi su u css/ fajlovima
// ============================================================

// ── INICIJALIZACIJA ──
function init() {
  const loaded = loadGame();

  // Inicijalizacija energije na max ako je novi igrač
  if (!loaded) {
    R.energy = getEnergyMax();
    addLog('🚀 Dobrodošao, Admirale! Izgradi svoju bazu i osvoji galaksiju.');
    toast('🚀 HIVE GALAXY — Dobrodošao!', 'ok');
  } else {
    toast('💾 Igra učitana!', 'inf');
    addLog('💾 Igra učitana.');
  }

  updateResUI();
  renderBase();
  if (typeof generateDailyMissions  === 'function') generateDailyMissions();
  if (typeof generateWeeklyMissions === 'function') generateWeeklyMissions();

  // Game loop
  setInterval(tickProduction,  1000);
  setInterval(tickEnergy,      1000);
  setInterval(tickBuildQueue,  1000);
  setInterval(() => { if (typeof checkAchievements === 'function') checkAchievements(); }, 5000);
  setInterval(saveGame,      60000); // auto-save svaku minutu
}

// ── POKRETANJE ──
init();