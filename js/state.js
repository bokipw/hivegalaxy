// ============================================================
// HIVE GALAXY — js/state.js
// Centralni state igre — sve varijable na jednom mjestu
// ============================================================

const R = {
  metal:        50000,
  crystal:      30000,
  he3:          15000,
  energy:       100,
  score:        0,
  spCard:       0,    // BPW satoshi
  instanceKeys: 0,    // 🗝️ Instance ključevi
  bcm:          0,    // BCM token
  bocrypto:     0,    // BoCrypto token
};

// MAGACIN BUFFER — resursi čekaju na pickup
let storageBuffer = { metal: 0, crystal: 0, he3: 0 };

// ZGRADE — samo nivoi, definicije su u data/buildings.js
const buildings = {
  hq:           { level: 1 },
  metal_mine:   { level: 1 },
  crystal_mine: { level: 1 },
  he3_refinery: { level: 1 },
  depot:        { level: 1 },
  ship_factory: { level: 1 },
  solar:        { level: 1 },
  fusion:       { level: 0 },
  battery:      { level: 0 },
  grid:         { level: 0 },
  turret:       { level: 0 },
  missile_bat:  { level: 0 },
  shield_gen:   { level: 0 },
  sensor:       { level: 0 },
  jump_gate:    { level: 0 },
  laboratory:   { level: 0 },
  recycler:     { level: 0 },
};

// BUILDING QUEUE — timer sistem
// { key, targetLevel, finishAt, boostCost }
let buildQueue = [];

// RECYCLE QUEUE — brodovi za reciklažu
// { design_id, ship_id, count }
let recycleQueue = [];

// KOMANDIR
const commander = {
  level:   1,
  exp:     0,
  nextExp: 1000,
  title:   'Kadet',
};

// ISTRAŽIVANJE — nivoi po grani (8 grana, max 100 svaka)
const research = {
  mining_metal:   { level: 0 },
  mining_crystal: { level: 0 },
  mining_he3:     { level: 0 },
  weapons:        { level: 0 },
  shields:        { level: 0 },
  armor:          { level: 0 },
  espionage:      { level: 0 },
  energy:         { level: 0 },
};

// FLOTA — 3x3 grid, 9 slotova
// Slot struktura po klasi:
// scout:      weapon_1-2, shield_1, engine_1, recon_1
// fighter:    weapon_1-3, shield_1-2, engine_1
// cruiser:    weapon_1-3, shield_1-3, engine_1
// battleship: weapon_1-4, shield_1-3, engine_1, special_1
// carrier:    weapon_1-2, shield_1-3, engine_1, special_1
// flagship:   weapon_1-4, shield_1-2, engine_1, special_1-2
// null = prazan slot
let fleet = [
  null, null, null,
  null, null, null,
  null, null, null,
];

// BLUEPRINTI — koje blueprinte igrač posjeduje
// key: item_id, value: true/false
let ownedBlueprints = {};

// BLUEPRINT FRAGMENTI — koliko fragmenata igrač ima po blueprintu
// key: item_id, value: count
let blueprintFragments = {};

// CRAFTING COST po rarity
const BP_FRAGMENT_COST = { C: 25, R: 15, E: 10, L: 5 };

// KOLONIJE
let colonies = [];

// PvP
const pvp = {
  wins:    0,
  losses:  0,
  rating:  1000,
  history: [],
};

// ŠPIJUNAŽA
let espDrones  = 0;
let espReports = [];

// ARTEFAKTI
let artifactFragments = 0;

// FORMACIJE
let activeFormation = 0;

// DOSTIGNUĆA
let ACHIEVES = [];

// STARTER PAKET
let starterGiven = false;

// SHIP DESIGNER — sačuvani dizajni
// Struktura dizajna zavisi od klase broda
// { id, name, ship_id,
//   weapon_1..4, shield_1..3, engine_1,
//   recon_1 (samo scout), special_1..2 (battleship/carrier/flagship) }
let shipDesigns = [];

// HANGAR — napravljeni brodovi, čekaju raspoređivanje u flotu
// { design_id, count }
let hangar = [];

// ── FLAGS ──
window._storageWarned = false;

// INSTANCE PROGRESS — napredak po instanci
// { [instanceId]: { completed, clear_count, best_rank, best_time } }
window._instProgress = {};