// ============================================================
// HIVE GALAXY — js/systems/blueprints.js
// Prikaz svih blueprinta — otključani/zaključani + Crafting
// ============================================================

const BP_CATEGORIES = [
  { key: 'ships',   label: 'Brodovi',  icon: '🚀', subcats: ['scout','fighter','cruiser','battleship','carrier','special'] },
  { key: 'weapons', label: 'Oružja',   icon: '⚔️', subcats: null },
  { key: 'shields', label: 'Štitovi',  icon: '🛡️', subcats: null },
  { key: 'engines', label: 'Motori',   icon: '🔩', subcats: null },
  { key: 'modules', label: 'Moduli',   icon: '⚙️', subcats: null },
];

let _bpTab    = 'ships';
let _bpSubcat = 'scout';
let _bpFilter = 'all';

function getRarityColor(rarity) {
  const map = { C: '#ffdd00', R: '#4488ff', E: '#aa44ff', L: '#ffaa00' };
  return map[rarity] || '#ffdd00';
}

function getBpFragmentCost(rarity) {
  return { C: 25, R: 15, E: 10, L: 5 }[rarity] || 25;
}

function getBpName(itemId) {
  for (const cls in SHIPS) {
    const s = (SHIPS[cls] || []).find(x => x.id === itemId);
    if (s) return s.name;
  }
  for (const arr of [WEAPONS, SHIELDS, ENGINES, MODULES]) {
    if (!arr) continue;
    const i = arr.find(x => x.id === itemId);
    if (i) return i.name;
  }
  return itemId;
}

function countAllBlueprints() {
  let total = 0;
  Object.values(SHIPS || {}).forEach(arr => total += arr.length);
  if (typeof WEAPONS !== 'undefined') total += WEAPONS.length;
  if (typeof SHIELDS !== 'undefined') total += SHIELDS.length;
  if (typeof ENGINES !== 'undefined') total += ENGINES.length;
  if (typeof MODULES !== 'undefined') total += MODULES.length;
  return total;
}

function unlockBlueprint(itemId) {
  if (ownedBlueprints[itemId]) return false;
  ownedBlueprints[itemId] = true;
  toast('📋 Novi blueprint: ' + getBpName(itemId) + '!', 'ok');
  addLog('📋 Blueprint otključan: ' + getBpName(itemId));
  saveGame();
  return true;
}

function craftBlueprint(itemId) {
  let rarity = 'C';
  if (typeof getBlueprintRarity === 'function') {
    rarity = getBlueprintRarity(itemId);
  } else {
    for (const cls in SHIPS) {
      const s = (SHIPS[cls] || []).find(x => x.id === itemId);
      if (s) { rarity = s.rarity || 'C'; break; }
    }
    for (const arr of [WEAPONS, SHIELDS, ENGINES, MODULES]) {
      if (!arr) continue;
      const i = arr.find(x => x.id === itemId);
      if (i) { rarity = i.rarity || 'C'; break; }
    }
  }
  
  const needed = getBpFragmentCost(rarity);
  if ((blueprintFragments[itemId] || 0) < needed) {
    toast('❌ Nedovoljno fragmenata!', 'err');
    return false;
  }
  blueprintFragments[itemId] -= needed;
  ownedBlueprints[itemId]    = true;
  saveGame();
  toast('✅ Craftovan blueprint: ' + getBpName(itemId) + '!', 'ok');
  addLog('🔨 Craftovan blueprint: ' + getBpName(itemId));
  renderBlueprints();
  return true;
}

function filterBps(items, ownedFn) {
  if (_bpFilter === 'owned')  return items.filter(i => ownedFn(i));
  if (_bpFilter === 'locked') return items.filter(i => !ownedFn(i));
  return items;
}

// ── RENDER GLAVNOG PANELA ──
function renderBlueprints() {
  const el = document.getElementById('blueprintGrid');
  if (!el) return;

  const fragCount  = Object.keys(blueprintFragments || {}).filter(k => (blueprintFragments[k]||0) > 0).length;
  const tabsHtml   = '<div style="display:flex;gap:6px;margin-bottom:14px">' +
    '<button class="btn ' + (_bpTab !== 'crafting' ? 'btn-gold' : '') + '" onclick="_bpTab=\'ships\';_bpSubcat=\'scout\';renderBlueprints()">📋 Kolekcija</button>' +
    '<button class="btn ' + (_bpTab === 'crafting' ? 'btn-gold' : '') + '" onclick="_bpTab=\'crafting\';renderBlueprints()">🔨 Crafting' +
    (fragCount > 0 ? ' <span style="background:#aa44ff;color:white;border-radius:10px;padding:1px 5px;font-size:0.6rem">' + fragCount + '</span>' : '') +
    '</button></div>';

  if (_bpTab === 'crafting') {
    el.innerHTML = tabsHtml + renderBpCrafting();
    return;
  }

  const totalOwned = Object.keys(ownedBlueprints).filter(k => ownedBlueprints[k]).length;
  const totalAll   = countAllBlueprints();
  const pct        = Math.min(100, (totalOwned / totalAll) * 100);

  const statsHtml = '<div class="card" style="margin-bottom:16px;display:flex;gap:24px;align-items:center">' +
    '<div style="text-align:center"><div style="font-size:0.65rem;color:#6a90b8;margin-bottom:2px">OTKLJUČANO</div>' +
    '<div style="font-size:1.3rem;font-family:\'Orbitron\',monospace;color:#00ff88">' + totalOwned + '</div></div>' +
    '<div style="flex:1"><div class="pbar" style="height:8px"><div class="pbar-fill" style="width:' + pct.toFixed(1) + '%;background:#00ff88"></div></div>' +
    '<div style="font-size:0.62rem;color:#6a90b8;margin-top:4px">' + totalOwned + ' / ' + totalAll + ' blueprinta</div></div>' +
    '<div style="display:flex;gap:6px">' +
    ['all','owned','locked'].map(f =>
      '<button class="btn ' + (_bpFilter===f?'btn-g':'') + '" style="font-size:0.65rem;padding:4px 10px" onclick="_bpFilter=\'' + f + '\';renderBlueprints()">' +
      (f==='all'?'Sve':f==='owned'?'✅ Imam':'🔒 Nemam') + '</button>'
    ).join('') + '</div></div>';

  const catHtml = '<div style="display:flex;gap:6px;margin-bottom:16px;flex-wrap:wrap">' +
    BP_CATEGORIES.map(cat =>
      '<button class="btn ' + (_bpTab===cat.key?'btn-gold':'') + '" style="font-size:0.78rem;padding:6px 14px"' +
      ' onclick="_bpTab=\'' + cat.key + '\';' + (cat.subcats ? '_bpSubcat=\'' + cat.subcats[0] + '\';' : '') + 'renderBlueprints()">' +
      cat.icon + ' ' + cat.label + '</button>'
    ).join('') + '</div>';

  el.innerHTML = tabsHtml + statsHtml + catHtml + renderSubcats() + '<div id="bpContent">' + renderBpGrid() + '</div>';
}

function renderSubcats() {
  const cat = BP_CATEGORIES.find(c => c.key === _bpTab);
  if (!cat?.subcats) return '';
  return '<div style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap">' +
    cat.subcats.map(sub => {
      const cls = SHIP_CLASSES[sub];
      const active = _bpSubcat === sub;
      return '<button class="btn ' + (active?'btn-g':'') + '" style="font-size:0.72rem;padding:4px 12px;border-color:' +
        (active ? (cls?.color||'#00ff88') : 'rgba(0,212,255,0.15)') + '" onclick="_bpSubcat=\'' + sub + '\';renderBlueprints()">' +
        (cls?.icon||'') + ' ' + (cls?.name||sub) + '</button>';
    }).join('') + '</div>';
}

function renderBpGrid() {
  switch(_bpTab) {
    case 'ships':   return renderShipBps();
    case 'weapons': return renderItemBps(WEAPONS,  'Oružja');
    case 'shields': return renderItemBps(SHIELDS,  'Štitovi');
    case 'engines': return renderItemBps(ENGINES,  'Motori');
    case 'modules': return renderItemBps(MODULES,  'Moduli');
    default: return '';
  }
}

// ── AUTOMATSKO MAPIRANJE ID BRODA → IME FAJLA SLIKE ──
// Konvertuje: scout_Swift_I → swift1.png
//             scout_Phantom_II → phantom2.png
//             scout_Stinger_III → stinger3.png
//             fighter_Fury_I → fury1.png
//             cruiser_Defender_I → defender1.png
//             itd.
function getShipImagePath(shipId) {
  // Razdvoji ID na delove: [klasa, ime, varijanta]
  const parts = shipId.split('_');
  if (parts.length < 3) return null;  // nije validan format
  
  const className = parts[0];     // scout, fighter, cruiser, battleship, carrier, special
  const shipName  = parts[1];     // Swift, Phantom, Stinger, Fury, Defender, itd.
  let variant     = parts[2];     // I, II, III
  
  // Pretvori rimski broj u običan: I → 1, II → 2, III → 3
  const romanToNum = { 'I': '1', 'II': '2', 'III': '3' };
  const number = romanToNum[variant];
  if (!number) return null;  // nije I, II ili III
  
  // Napravi ime fajla: sve mala slova
  const fileName = `${shipName.toLowerCase()}${number}.png`;
  
  return `img/${fileName}`;
}

// ── RENDER BRODSKIH KARTICA ──
function renderShipBps() {
  const ships    = SHIPS[_bpSubcat] || [];
  const cls      = SHIP_CLASSES[_bpSubcat];
  const filtered = filterBps(ships, s => ownedBlueprints[s.id]);
  if (filtered.length === 0) return '<div class="card" style="text-align:center;color:#6a90b8">Nema rezultata.</div>';

  return '<div class="grid-3">' + filtered.map(ship => {
    const owned    = !!ownedBlueprints[ship.id];
    let rarity = ship.rarity;
    if (!rarity && typeof getShipRarity === 'function') {
      rarity = getShipRarity(ship.id);
    }
    const rarColor = getRarityColor(rarity || 'C');
    const frags    = blueprintFragments[ship.id] || 0;
    const needed   = getBpFragmentCost(rarity || 'C');
    const fragBar  = !owned && frags > 0
      ? '<div style="margin-top:6px"><div style="font-size:0.6rem;color:#aa44ff;margin-bottom:2px">🧩 ' + frags + '/' + needed + ' fragmenta</div>' +
        '<div class="pbar"><div class="pbar-fill" style="width:' + Math.min(100,(frags/needed)*100) + '%;background:#aa44ff"></div></div></div>'
      : '';

    const rarityLetter = rarity || 'C';
    const displayText = rarityLetter;

    // Generički prikaz broda
    let shipHtml = '';
    shipHtml += '<div>🛡️ Oklop tip: ' + (ship.armor || 'Light') + '</div>';
    shipHtml += '<div>🔩 Armor: ' + ship.armor_val + '</div>';
    shipHtml += '<div>💠 Shield: ' + ship.shield + '</div>';
    shipHtml += '<div>❤️ HP: ' + ship.structure + '</div>';
    shipHtml += '<div>💨 Agility: ' + ship.agility + '</div>';
    shipHtml += '<div>🚀 Speed: ' + (ship.movement || 1) + '</div>';

    // Slika broda (automatska putanja)
    const imgPath = getShipImagePath(ship.id);
    const imageHtml = imgPath 
      ? `<img src="${imgPath}" style="width:80px; height:80px; object-fit:contain; margin-left:12px;" onerror="this.style.display='none'">`
      : `<div style="width:80px; height:80px; display:flex; align-items:center; justify-content:center; font-size:2.5rem; margin-left:12px;">${cls?.icon || '🚀'}</div>`;

    // BOJA BORDER-A: otključan = puna boja, zaključan = providna boja
    const borderColor = owned ? rarColor : rarColor + '44';
    const isLegendary = (rarity === 'L');
    const borderStyle = isLegendary ? `3px solid ${rarColor}` : `1px solid ${borderColor}`;
    const boxShadow = isLegendary ? `0 0 12px ${rarColor}` : 'none';

    return '<div class="card" style="border:' + borderStyle + ';box-shadow:' + boxShadow + ';opacity:' + (owned?1:0.7) + ';position:relative;overflow:hidden;display:flex;flex-direction:column;">' +
      (!owned ? '<div style="position:absolute;inset:0;background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;z-index:2;font-size:2rem">🔒</div>' : '') +
      (isLegendary ? '<div style="position:absolute;top:-5px;right:-5px;background:linear-gradient(135deg,#ffaa00,#ff6600);color:black;font-size:0.55rem;font-weight:700;padding:2px 12px;border-radius:0 8px 0 8px;z-index:3">⭐ LEGENDARY</div>' : '') +
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">' +
        '<div style="font-size:0.82rem;font-weight:700;color:' + (owned?(cls?.color||'white'):'#6a90b8') + '">' + ship.name + '</div>' +
        '<span class="lv-badge" style="color:' + rarColor + ';border-color:' + rarColor + '44;font-weight:700">' + displayText + '</span>' +
      '</div>' +
      '<div style="display:flex; flex:1;">' +
        '<div style="flex:1;">' +
          '<div style="font-size:0.6rem;color:#6a90b8;margin-bottom:8px;line-height:1.6">' + shipHtml + '</div>' +
          '<div style="font-size:0.62rem;padding:4px 8px;border-radius:4px;background:' + (owned?'rgba(0,255,136,0.08)':'rgba(255,255,255,0.04)') + ';color:' + (owned?'#00ff88':'#6a90b8') + '">' +
            (owned ? '✅ Otključan' : '🔒 ' + (ship.source||'Nepoznato')) +
          '</div>' +
          fragBar +
          (owned ? '<button class="btn btn-g" style="width:100%;margin-top:8px;font-size:0.68rem" onclick="showPanel(\'designer\')">🔧 Koristi u Designeru</button>' : '') +
        '</div>' +
        '<div style="display:flex; align-items:center;">' + imageHtml + '</div>' +
      '</div>' +
      '</div>';
  }).join('') + '</div>';
}

function renderItemBps(dataArray, label) {
  if (!dataArray || dataArray.length === 0) return '<div class="card" style="text-align:center;color:#6a90b8">📋 ' + label + ' data nije učitan.</div>';

  const byVariant = { I: [], II: [], III: [] };
  dataArray.forEach(item => { const v = item.variant || 'I'; if (byVariant[v]) byVariant[v].push(item); });

  let html = '';
  ['I','II','III'].forEach(v => {
    const items    = filterBps(byVariant[v], i => ownedBlueprints[i.id]);
    if (items.length === 0) return;
    const rarColor = v === 'I' ? '#ffdd00' : v === 'II' ? '#4488ff' : '#aa44ff';
    html += '<div style="margin-bottom:20px"><div style="font-size:0.75rem;color:' + rarColor + ';letter-spacing:2px;margin-bottom:10px;font-weight:700">TIER ' + v + '</div>' +
      '<div class="grid-3">' + items.map(item => renderItemBpCard(item)).join('') + '</div></div>';
  });

  return html || '<div class="card" style="text-align:center;color:#6a90b8">Nema rezultata.</div>';
}

// ── GENERIČKI PRIKAZ ZA SVE ITEME (oružja, štitovi, motori, moduli) ──
function renderItemBpCard(item) {
  const owned    = !!ownedBlueprints[item.id];
  const rarColor = getRarityColor(item.rarity || 'C');
  const frags    = blueprintFragments[item.id] || 0;
  const needed   = getBpFragmentCost(item.rarity || 'C');

  let effectHtml = '';

  // Oružja
  if (item.dps !== undefined) {
    if (item.dmgType)  effectHtml += '<div>💥 Tip štete: ' + item.dmgType + '</div>';
    if (item.range)    effectHtml += '<div>📏 Domet: ' + item.range.min + '-' + item.range.max + '</div>';
    if (item.cooldown !== undefined) effectHtml += '<div>⏱️ Cooldown: ' + item.cooldown + ' runde</div>';
    if (item.dps)      effectHtml += '<div>⚔️ DPS: ' + item.dps + '</div>';
    if (item.special)  effectHtml += '<div>✨ ' + (item.special.desc || '') + '</div>';
  }
  // Štitovi
  else if (item.shield !== undefined) {
    effectHtml += '<div>🛡️ Kapacitet: ' + item.shield + '</div>';
    effectHtml += '<div>⚡ Regen po rundi: ' + item.regen + '</div>';
    if (item.special) effectHtml += '<div>✨ ' + (item.special.desc || '') + '</div>';
  }
  // Motori
  else if (item.speed !== undefined) {
    effectHtml += '<div>🚀 Brzina: ' + item.speed + '</div>';
    if (item.agility_bonus) effectHtml += '<div>💨 Agilnost: +' + item.agility_bonus + '</div>';
    if (item.evasion_bonus) effectHtml += '<div>👻 Izbjegavanje: +' + item.evasion_bonus + '%</div>';
    if (item.special) effectHtml += '<div>✨ ' + (item.special.desc || '') + '</div>';
  }
  // Moduli
  else if (item.effect) {
    effectHtml += '<div>⚙️ ' + (item.effect.desc || '') + '</div>';
  }
  
  if (!effectHtml) effectHtml = '<div style="opacity:0.5">Bez opisa</div>';

  const fragBar = !owned && frags > 0
    ? '<div style="margin-top:4px"><div style="font-size:0.6rem;color:#aa44ff">🧩 ' + frags + '/' + needed + '</div>' +
      '<div class="pbar"><div class="pbar-fill" style="width:' + Math.min(100,(frags/needed)*100) + '%;background:#aa44ff"></div></div></div>'
    : '';

  const borderColor = owned ? rarColor : rarColor + '44';
  const isLegendary = (item.rarity === 'L');
  const borderStyle = isLegendary ? `3px solid ${rarColor}` : `1px solid ${borderColor}`;
  const boxShadow = isLegendary ? `0 0 12px ${rarColor}` : 'none';

  return '<div class="card" style="border:' + borderStyle + ';box-shadow:' + boxShadow + ';opacity:' + (owned?1:0.7) + ';position:relative;overflow:hidden">' +
    (!owned ? '<div style="position:absolute;inset:0;background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;z-index:2;font-size:2rem">🔒</div>' : '') +
    (isLegendary ? '<div style="position:absolute;top:-5px;right:-5px;background:linear-gradient(135deg,#ffaa00,#ff6600);color:black;font-size:0.55rem;font-weight:700;padding:2px 12px;border-radius:0 8px 0 8px;z-index:3">⭐ LEGENDARY</div>' : '') +
    '<div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:4px">' +
      '<div style="font-size:0.78rem;font-weight:700;color:' + (owned?rarColor:'#6a90b8') + '">' + item.name + '</div>' +
      '<span class="lv-badge" style="color:' + rarColor + ';border-color:' + rarColor + '44;font-size:0.58rem">' + (item.rarity||'C') + '</span>' +
    '</div>' +
    '<div style="font-size:0.6rem;color:#6a90b8;margin-bottom:6px;line-height:1.6">' + effectHtml + '</div>' +
    '<div style="font-size:0.6rem;padding:3px 6px;border-radius:4px;background:' + (owned?'rgba(0,255,136,0.08)':'rgba(255,255,255,0.04)') + ';color:' + (owned?'#00ff88':'#6a90b8') + '">' +
      (owned ? '✅ Otključan' : '🔒 ' + (item.source||'Nepoznato')) +
    '</div>' + fragBar + '</div>';
}

// ── CRAFTING ──
function renderBpCrafting() {
  const allItems = [];
  Object.values(SHIPS || {}).forEach(arr => arr.forEach(s => allItems.push({ id: s.id, name: s.name, rarity: s.rarity })));
  [WEAPONS, SHIELDS, ENGINES, MODULES].forEach(arr => {
    if (!arr) return;
    arr.forEach(i => allItems.push({ id: i.id, name: i.name, rarity: i.rarity || 'C' }));
  });

  const withFragments = allItems.filter(i => (blueprintFragments[i.id] || 0) > 0);
  if (withFragments.length === 0) {
    return '<div class="card" style="text-align:center;color:#6a90b8;padding:30px">🧩 Nemaš fragmenata.<br><span style="font-size:0.72rem">Fragmenti padaju iz instanci.</span></div>';
  }

  const craftable = withFragments.filter(i => !ownedBlueprints[i.id]);
  const extra     = withFragments.filter(i =>  ownedBlueprints[i.id]);

  let html = '<div class="card" style="margin-bottom:16px"><div style="font-size:0.82rem;font-weight:700;color:#aa44ff;margin-bottom:4px">🔨 CRAFTING</div>' +
    '<div style="font-size:0.65rem;color:#6a90b8">Common: 25 frag · Rare: 15 frag · Epic: 10 frag · Legendary: 5 frag</div></div>';

  if (craftable.length > 0) {
    html += '<div class="page-title" style="font-size:0.82rem">🔨 MOŽE SE CRAFTATI</div>';
    html += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px">';
    craftable.forEach(item => { html += renderCraftCard(item, false); });
    html += '</div>';
  }

  if (extra.length > 0) {
    html += '<div class="page-title" style="font-size:0.82rem;margin-top:16px">📦 VIŠKOVI FRAGMENATA</div>';
    html += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px">';
    extra.forEach(item => { html += renderCraftCard(item, true); });
    html += '</div>';
  }

  return html;
}

function renderCraftCard(item, isOwned) {
  const fragments = blueprintFragments[item.id] || 0;
  const needed    = getBpFragmentCost(item.rarity || 'C');
  const pct       = Math.min(100, (fragments / needed) * 100);
  const rarColor  = getRarityColor(item.rarity || 'C');
  const canCraft  = !isOwned && fragments >= needed;
  const rarName   = item.rarity === 'C' ? 'Common' : item.rarity === 'R' ? 'Rare' : item.rarity === 'E' ? 'Epic' : 'Legendary';

  let btnHtml = '';
  if (canCraft) {
    btnHtml = '<button class="btn btn-g" style="width:100%;font-size:0.72rem" onclick="craftBlueprint(\'' + item.id + '\')">🔨 Craftaj Blueprint</button>';
  } else if (isOwned) {
    btnHtml = '<div style="font-size:0.65rem;color:#6a90b8;text-align:center">Višak fragmenata</div>';
  } else {
    btnHtml = '<div style="font-size:0.65rem;color:#6a90b8;text-align:center">Još ' + (needed - fragments) + ' fragmenata</div>';
  }

  return '<div class="card" style="border-color:' + rarColor + '44">' +
    '<div style="font-size:0.8rem;font-weight:700;color:' + rarColor + ';margin-bottom:4px">' + item.name + '</div>' +
    '<div style="font-size:0.62rem;color:#6a90b8;margin-bottom:8px">' + rarName + (isOwned ? ' · ✅ Već posjeduješ' : '') + '</div>' +
    '<div style="display:flex;justify-content:space-between;margin-bottom:4px">' +
      '<span style="font-size:0.65rem;color:#6a90b8">Fragmenti</span>' +
      '<span style="font-size:0.72rem;color:' + (canCraft ? '#00ff88' : 'white') + '">' + fragments + '/' + needed + '</span>' +
    '</div>' +
    '<div class="pbar" style="margin-bottom:8px"><div class="pbar-fill" style="width:' + pct + '%;background:' + rarColor + '"></div></div>' +
    btnHtml + '</div>';
}