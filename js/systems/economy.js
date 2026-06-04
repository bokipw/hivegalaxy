// ============================================================
// HIVE GALAXY — js/systems/economy.js
// Produkcija, storage, energy, canAfford
// ============================================================

// ── CAN AFFORD ──
function canAfford(cost) {
  return R.metal   >= (cost.metal   || 0) &&
         R.crystal >= (cost.crystal || 0) &&
         R.he3     >= (cost.he3     || 0);
}

function spendResources(cost) {
  R.metal   -= (cost.metal   || 0);
  R.crystal -= (cost.crystal || 0);
  R.he3     -= (cost.he3     || 0);
}

// ── ENERGY FUNKCIJE ──
function getEnergyGen() {
  const b = buildings;
  return 0.005
    + (b.solar?.level   || 0) * 4
    + (b.fusion?.level  || 0) * 12
    + (b.battery?.level || 0) * 1
    + (b.grid?.level    || 0) * 1;
}

function getEnergyDrain() {
  const b = buildings;
  let drain = 2; // bazni drain
  drain += (b.metal_mine?.level   || 0) * 2;
  drain += (b.crystal_mine?.level || 0) * 2;
  drain += (b.he3_refinery?.level || 0) * 3;
  drain += (b.ship_factory?.level || 0) * 4;
  drain += (b.hq?.level           || 0) * 1;
  drain += (b.depot?.level        || 0) * 1;
  drain += (b.turret?.level       || 0) * 2;
  drain += (b.missile_bat?.level  || 0) * 3;
  drain += (b.shield_gen?.level   || 0) * 4;
  drain += (b.sensor?.level       || 0) * 1;
  // Grid redukcija draina — 0.5% po levelu, max 50% na Lv100
  const gridLevel     = b.grid?.level || 0;
  const gridReduction = gridLevel * 0.5;
  return Math.floor(drain * (1 - gridReduction / 100));
}

function getEnergyMax() {
  const b = buildings;
  const resBonus = typeof getEnergyCapBonus === 'function' ? getEnergyCapBonus() : 0;
  const artBonus = typeof getArtifactEnergyBonus === 'function' ? getArtifactEnergyBonus() : 0;
  return 100
    + (b.battery?.level || 0) * 97
    + (b.grid?.level    || 0) * 1
    + (b.fusion?.level  || 0) * 1
    + resBonus + artBonus;
}

function getEnergyNet() {
  return getEnergyGen() - getEnergyDrain();
}

function getEnergyPenalty() {
  const energy = R.energy;
  const net    = getEnergyNet();
  if (energy > 10 || net >= 0) return 1.0;
  if (energy > 0)              return 0.5;
  return 0.2;
}

// ── PRODUKCIJA ──
function getBaseProd() {
  const b  = buildings;
  const ep = getEnergyPenalty();
  // Research bonusi
  const metalBonus   = typeof getMetalProdBonus   === 'function' ? (1 + getMetalProdBonus()   / 100) : 1;
  const crystalBonus = typeof getCrystalProdBonus === 'function' ? (1 + getCrystalProdBonus() / 100) : 1;
  const he3Bonus     = typeof getHe3ProdBonus     === 'function' ? (1 + getHe3ProdBonus()     / 100) : 1;
  // Milestone bonusi rudnika
  const metalMilestone   = typeof getMetalMilestoneBonus   === 'function' ? (1 + getMetalMilestoneBonus()   / 100) : 1;
  const crystalMilestone = typeof getCrystalMilestoneBonus === 'function' ? (1 + getCrystalMilestoneBonus() / 100) : 1;
  const he3Milestone     = typeof getHe3MilestoneBonus     === 'function' ? (1 + getHe3MilestoneBonus()     / 100) : 1;
  // Commander bonus
  const cmdBonus = typeof getCmdProdBonus === 'function' ? (1 + getCmdProdBonus() / 100) : 1;
  return {
    metal:   (b.metal_mine?.level   || 1) * 0.01  * ep * metalBonus   * metalMilestone   * cmdBonus,
    crystal: (b.crystal_mine?.level || 1) * 0.007 * ep * crystalBonus * crystalMilestone * cmdBonus,
    he3:     (b.he3_refinery?.level || 1) * 0.003 * ep * he3Bonus     * he3Milestone     * cmdBonus,
  };
}

// NOVO: getProd sada vraća BAZA + KOLONIJE za UI
function getProd() {
  const base = getBaseProd();
  const col = typeof getTotalColonyProduction === 'function' ? getTotalColonyProduction() : {metal:0,crystal:0,he3:0};
  return {
    metal: base.metal + col.metal,
    crystal: base.crystal + col.crystal,
    he3: base.he3 + col.he3
  };
}

// ── DEPOT / STORAGE ──
function addToStorage(prod) {
  const capacity    = getDepotCapacity();
  const currentTotal = storageBuffer.metal + storageBuffer.crystal + storageBuffer.he3;
  const incoming     = prod.metal + prod.crystal + prod.he3;
  const newTotal     = currentTotal + incoming;

  if (newTotal > capacity) {
    if (currentTotal >= capacity) return false; // pun, ništa ne prima
    const space = capacity - currentTotal;
    const ratio = space / incoming;
    storageBuffer.metal   += prod.metal   * ratio;
    storageBuffer.crystal += prod.crystal * ratio;
    storageBuffer.he3     += prod.he3     * ratio;
    return false; // pun
  }

  storageBuffer.metal   += prod.metal;
  storageBuffer.crystal += prod.crystal;
  storageBuffer.he3     += prod.he3;
  return true;
}

function pickupResources() {
  const gained = {
    metal:   Math.floor(storageBuffer.metal),
    crystal: Math.floor(storageBuffer.crystal),
    he3:     Math.floor(storageBuffer.he3),
  };

  if (gained.metal === 0 && gained.crystal === 0 && gained.he3 === 0) {
    toast('📦 Depot je prazan!', 'warn');
    return;
  }

  R.metal   += gained.metal;
  R.crystal += gained.crystal;
  R.he3     += gained.he3;

  storageBuffer = { metal: 0, crystal: 0, he3: 0 };
  window._totalDepotPickups = (window._totalDepotPickups || 0) + 1;
  if (typeof trackDailyDepot === 'function') trackDailyDepot();

  updateResUI();
  if (typeof renderDepot === 'function') renderDepot();
  toast(`📦 Pokupljeno: 🔩${fmt(gained.metal)} 💎${fmt(gained.crystal)} ⛽${fmt(gained.he3)}`, 'ok');
  addLog(`📦 Resursi pokupljeni iz Depota.`);
  saveGame();
}

// ── TICK FUNKCIJE (poziva main.js) ──
function tickProduction() {
  const baseProd = getBaseProd(); // SAMO baza ide u Depot
  const hasSpace = addToStorage(baseProd);

  if (!hasSpace && !window._storageWarned) {
    toast('📦 Depot je pun! Pokupi resurse da nastaviš produkciju.', 'warn');
    window._storageWarned = true;
    setTimeout(() => { window._storageWarned = false; }, 60000);
  }

  // Kolonije — direktno u R, bypass Depot
  if (typeof tickColonyProduction === 'function') tickColonyProduction();

  // Track ukupno metala za achievements (samo baza)
  window._totalMetalMined = (window._totalMetalMined || 0) + baseProd.metal;
  updateResUI();
}

function tickEnergy() {
  const net = getEnergyNet();
  const max = getEnergyMax();
  R.energy  = Math.max(0, Math.min(max, R.energy + net));
  updateResUI();
  if (typeof updateEnergyBalanceCard === 'function') updateEnergyBalanceCard();
}

// ── KOMANDIR XP ──
function addExp(amount) {
  commander.exp += amount;
  while (commander.exp >= commander.nextExp) {
    commander.exp     -= commander.nextExp;
    commander.level   += 1;
    commander.nextExp  = Math.floor(commander.nextExp * 1.25);
    toast(`⭐ Komandir Level Up! Lv.${commander.level}`, 'ok');
    addLog(`⭐ Komandir napredovao na Lv.${commander.level}`);
  }
  updateResUI();
}