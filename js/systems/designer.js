// ============================================================
// HIVE GALAXY — js/systems/designer.js
// Ship Designer — kreiranje dizajna, hangar, gradnja brodova
// ============================================================

function genDesignId() {
  return 'design_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
}

// ── SLOTOVI PO KLASI ──
function getClassSlots(cls) {
  const s = SHIP_CLASSES[cls]?.slots || {};
  return {
    weapon:  typeof s.weapon  === 'number' ? s.weapon  : 4,
    shield:  typeof s.shield  === 'number' ? s.shield  : 1,
    engine:  s.engine  || 1,
    recon:   s.recon   || 0,
    special: typeof s.special === 'number' ? s.special : 0,
  };
}

// ── IZRAČUNAJ SVE STATISTIKE ZA JEDAN BROD IZ DIZAJNA ──
function calcDesignStats(design) {
  const ship = getShipById(design.ship_id);
  if (!ship) return { shield: 0, hp: 0, speed: 0, dps: 0, armor: 0, structure: 0 };

  let totalShield = ship.shield || 0;
  for (let i = 1; i <= 3; i++) {
    const sid = design[`shield_${i}`];
    if (sid) {
      const sh = getShieldById(sid);
      if (sh) totalShield += sh.shield;
    }
  }

  const totalHP = (ship.armor_val || 0) + totalShield + (ship.structure || 0);

  let speed = ship.movement || 0;
  const engineId = design.engine_1;
  if (engineId) {
    const eng = getEngineById(engineId);
    if (eng && eng.speed) speed += eng.speed;
  }

  let dps = 0;
  for (let i = 1; i <= 4; i++) {
    const wid = design[`weapon_${i}`];
    if (wid) {
      const wpn = getWeaponById(wid);
      if (wpn) dps += wpn.dps;
    }
  }

  return { shield: totalShield, hp: totalHP, speed: speed, dps: dps, armor: ship.armor_val || 0, structure: ship.structure || 0 };
}

// ── RENDER DESIGNER PANELA ──
function renderDesigner() {
  const el = document.getElementById('designerContent');
  if (!el) return;
  el.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div>
        <div class="page-title" style="font-size:0.85rem">➕ NOVI DIZAJN</div>
        <div class="card" id="designerForm">${renderDesignerForm()}</div>
      </div>
      <div>
        <div class="page-title" style="font-size:0.85rem">📋 MOJI DIZAJNI (${shipDesigns.length})</div>
        <div id="designList">${renderDesignList()}</div>
      </div>
    </div>
  `;
}

// ── DESIGNER FORM ──
function renderDesignerForm(prefill = {}) {
  const unlocked = getUnlockedShipClasses();
  const allShips = [];
  unlocked.forEach(cls => {
    (SHIPS[cls] || []).forEach(s => {
      if (ownedBlueprints[s.id]) allShips.push({ ...s, cls });
    });
  });

  if (allShips.length === 0) {
    return `<div style="text-align:center;color:#6a90b8;padding:20px">🔒 Nemaš blueprinte brodova.<br><span style="font-size:0.72rem">Unapredi Ship Factory na Lv.2 ili igraj instance.</span></div>`;
  }

  const prefillCls = prefill.ship_id ? getShipClass(prefill.ship_id) : null;
  const prefillSlots = prefillCls ? getClassSlots(prefillCls) : null;

  return `
    <div style="display:flex;flex-direction:column;gap:10px">
      <div>
        <div style="font-size:0.7rem;color:#6a90b8;margin-bottom:4px">IME DIZAJNA</div>
        <input id="dName" type="text" placeholder="npr. Swift Laser Alpha" value="${prefill.name || ''}" style="width:100%;background:#070c1a;border:1px solid rgba(0,212,255,0.3);color:white;padding:6px 10px;border-radius:4px;font-size:0.82rem">
      </div>
      <div>
        <div style="font-size:0.7rem;color:#6a90b8;margin-bottom:4px">BROD</div>
        <select id="dShip" style="width:100%;background:#070c1a;border:1px solid rgba(0,212,255,0.3);color:white;padding:6px 10px;border-radius:4px;font-size:0.82rem" onchange="refreshDesignerSlots()">
          <option value="">-- Odaberi brod --</option>
          ${allShips.map(s => `<option value="${s.id}" ${prefill.ship_id === s.id ? 'selected' : ''}>${s.name} (${SHIP_CLASSES[s.cls]?.name || s.cls})</option>`).join('')}
        </select>
      </div>
      <div id="dynamicSlots">${prefill.ship_id ? renderDynamicSlots(prefillCls, prefillSlots, prefill) : '<div style="font-size:0.72rem;color:#6a90b8">Odaberi brod da vidiš slotove...</div>'}</div>
      <div id="designPreview" style="background:rgba(0,0,0,0.3);border-radius:6px;padding:10px;font-size:0.68rem;font-family:'Share Tech Mono',monospace;color:#6a90b8;min-height:50px">${prefill.ship_id ? getShipPreviewHTML(prefill.ship_id) : 'Odaberi brod da vidiš statistike...'}</div>
      <button class="btn btn-g" style="width:100%" onclick="saveDesign('${prefill.id || ''}')">💾 Sačuvaj dizajn</button>
    </div>
  `;
}

// ── REFRESH SLOTOVA ──
function refreshDesignerSlots() {
  const shipId = document.getElementById('dShip')?.value;
  const slotsEl = document.getElementById('dynamicSlots');
  const prevEl = document.getElementById('designPreview');
  if (!slotsEl) return;
  if (!shipId) {
    slotsEl.innerHTML = '<div style="font-size:0.72rem;color:#6a90b8">Odaberi brod da vidiš slotove...</div>';
    if (prevEl) prevEl.innerHTML = 'Odaberi brod da vidiš statistike...';
    return;
  }
  const cls = getShipClass(shipId);
  const slots = getClassSlots(cls);
  slotsEl.innerHTML = renderDynamicSlots(cls, slots, {});
  if (prevEl) prevEl.innerHTML = getShipPreviewHTML(shipId);
}

// ── RENDER DINAMIČKIH SLOTOVA ──
function renderDynamicSlots(cls, slots, prefill) {
  const myWeapons = typeof WEAPONS !== 'undefined' ? WEAPONS.filter(w => ownedBlueprints[w.id]) : [];
  const myShields = typeof SHIELDS !== 'undefined' ? SHIELDS.filter(s => ownedBlueprints[s.id]) : [];
  const myEngines = typeof ENGINES !== 'undefined' ? ENGINES.filter(e => ownedBlueprints[e.id]) : [];

  let html = '';
  for (let i = 1; i <= slots.weapon; i++) {
    html += `<div style="margin-bottom:4px"><div style="font-size:0.7rem;color:#ff4444;margin-bottom:2px">⚔️ ORUŽJE ${i}</div><select id="dWeapon${i}" style="width:100%;background:#070c1a;border:1px solid rgba(255,68,68,0.3);color:white;padding:5px 8px;border-radius:4px;font-size:0.78rem"><option value="">-- Bez oružja --</option>${myWeapons.map(w => `<option value="${w.id}" ${prefill[`weapon_${i}`] === w.id ? 'selected' : ''}>${w.name} (${w.rarity}) ⚔️${w.dps}</option>`).join('')}</select></div>`;
  }
  for (let i = 1; i <= slots.shield; i++) {
    html += `<div style="margin-bottom:4px"><div style="font-size:0.7rem;color:#00d4ff;margin-bottom:2px">🛡️ ŠTIT ${i}</div><select id="dShield${i}" style="width:100%;background:#070c1a;border:1px solid rgba(0,212,255,0.3);color:white;padding:5px 8px;border-radius:4px;font-size:0.78rem"><option value="">-- Bez štita --</option>${myShields.map(s => `<option value="${s.id}" ${prefill[`shield_${i}`] === s.id ? 'selected' : ''}>${s.name} (${s.rarity}) 🛡️+${s.shield}</option>`).join('')}</select></div>`;
  }
  html += `<div style="margin-bottom:4px"><div style="font-size:0.7rem;color:#ffcc44;margin-bottom:2px">🔩 MOTOR</div><select id="dEngine1" style="width:100%;background:#070c1a;border:1px solid rgba(255,204,68,0.3);color:white;padding:5px 8px;border-radius:4px;font-size:0.78rem"><option value="">-- Bez motora --</option>${myEngines.map(e => `<option value="${e.id}" ${prefill.engine_1 === e.id ? 'selected' : ''}>${e.name} (${e.rarity}) 💨+${e.speed}</option>`).join('')}</select></div>`;
  if (slots.recon > 0) html += `<div style="margin-bottom:4px"><div style="font-size:0.7rem;color:#00e5ff;margin-bottom:2px">📡 RECON</div><select id="dRecon1" style="width:100%;background:#070c1a;border:1px solid rgba(0,229,255,0.3);color:white;padding:5px 8px;border-radius:4px;font-size:0.78rem"><option value="">-- Bez recon opreme --</option><option value="recon_placeholder" disabled>🔒 Recon blueprinti — uskoro dostupno</option></select></div>`;
  for (let i = 1; i <= slots.special; i++) {
    html += `<div style="margin-bottom:4px"><div style="font-size:0.7rem;color:#aa44ff;margin-bottom:2px">⭐ SPECIAL ${i}</div><select id="dSpecial${i}" style="width:100%;background:#070c1a;border:1px solid rgba(170,68,255,0.3);color:white;padding:5px 8px;border-radius:4px;font-size:0.78rem" disabled><option value="">🔒 Special blueprinti — uskoro dostupno</option></select></div>`;
  }
  return html;
}

// ── SHIP PREVIEW HTML ──
function getShipPreviewHTML(shipId) {
  const ship = getShipById(shipId);
  if (!ship) return '';
  const cls = SHIP_CLASSES[getShipClass(shipId)];
  return `<span style="color:${cls?.color || 'white'};font-weight:700">${ship.name}</span> · ${ship.armor} oklop<br>🛡️ Armor: ${ship.armor_val} &nbsp; 💠 Shield: ${ship.shield} &nbsp; ❤️ HP: ${ship.structure}<br>⚡ Agility: ${ship.agility} &nbsp; 💨 Speed: ${ship.movement} &nbsp; 🏆 Stability: ${ship.stability}`;
}

// ── SAČUVAJ DIZAJN ──
function saveDesign(existingId = '') {
  const name = document.getElementById('dName')?.value?.trim();
  const shipId = document.getElementById('dShip')?.value;
  if (!name) { toast('❌ Upiši ime dizajna!', 'err'); return; }
  if (!shipId) { toast('❌ Odaberi brod!', 'err'); return; }
  const cls = getShipClass(shipId);
  const slots = getClassSlots(cls);
  const design = { id: existingId || genDesignId(), name, ship_id: shipId, cls };
  for (let i = 1; i <= slots.weapon; i++) design[`weapon_${i}`] = document.getElementById(`dWeapon${i}`)?.value || null;
  for (let i = 1; i <= slots.shield; i++) design[`shield_${i}`] = document.getElementById(`dShield${i}`)?.value || null;
  design.engine_1 = document.getElementById('dEngine1')?.value || null;
  if (slots.recon > 0) design.recon_1 = null;
  for (let i = 1; i <= slots.special; i++) design[`special_${i}`] = null;
  if (existingId) {
    const idx = shipDesigns.findIndex(d => d.id === existingId);
    if (idx !== -1) shipDesigns[idx] = design;
  } else {
    shipDesigns.push(design);
  }
  toast(`✅ Dizajn "${name}" sačuvan!`, 'ok');
  addLog(`📋 Dizajn sačuvan: ${name}`);
  saveGame();
  renderDesigner();
}

// ── OBRIŠI DIZAJN ──
function deleteDesign(designId) {
  const design = shipDesigns.find(d => d.id === designId);
  if (!design) return;
  if (!confirm(`Obrisati dizajn "${design.name}"?`)) return;
  shipDesigns = shipDesigns.filter(d => d.id !== designId);
  hangar = hangar.filter(h => h.design_id !== designId);
  toast('🗑️ Dizajn obrisan.', 'warn');
  saveGame();
  renderDesigner();
}

// ── EDIT DIZAJN ──
function editDesign(designId) {
  const design = shipDesigns.find(d => d.id === designId);
  if (!design) return;
  const formEl = document.getElementById('designerForm');
  if (formEl) formEl.innerHTML = renderDesignerForm(design);
}

// ── RENDER LISTA DIZAJNA ──
function renderDesignList() {
  if (shipDesigns.length === 0) return `<div class="card" style="text-align:center;color:#6a90b8">📋 Nemaš sačuvanih dizajna.<br><span style="font-size:0.72rem">Kreiraj novi dizajn lijevo.</span></div>`;
  return shipDesigns.map(d => {
    const ship = getShipById(d.ship_id);
    const cls = SHIP_CLASSES[d.cls || getShipClass(d.ship_id)];
    const slots = getClassSlots(d.cls || getShipClass(d.ship_id));
    const hangarCount = hangar.find(h => h.design_id === d.id)?.count || 0;
    const stats = calcDesignStats(d);
    let equipLines = '';
    for (let i = 1; i <= slots.weapon; i++) if (d[`weapon_${i}`]) equipLines += `⚔️ ${d[`weapon_${i}`]}<br>`;
    for (let i = 1; i <= slots.shield; i++) if (d[`shield_${i}`]) equipLines += `🛡️ ${d[`shield_${i}`]}<br>`;
    if (d.engine_1) equipLines += `🔩 ${d.engine_1}`;
    return `<div class="card" style="margin-bottom:8px;border-color:${cls?.color || '#00d4ff'}33"><div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:6px"><div><div style="font-size:0.82rem;font-weight:700;color:${cls?.color || 'white'}">${d.name}</div><div style="font-size:0.65rem;color:#6a90b8">${ship?.name || d.ship_id} · ${cls?.name || ''}</div></div><div style="display:flex;gap:4px"><button class="btn" style="font-size:0.6rem;padding:2px 6px" onclick="editDesign('${d.id}')">✏️</button><button class="btn btn-r" style="font-size:0.6rem;padding:2px 6px" onclick="deleteDesign('${d.id}')">🗑️</button></div></div><div style="font-size:0.6rem;color:#6a90b8;margin-bottom:6px;padding:4px 6px;background:rgba(0,0,0,0.2);border-radius:4px">🛡️${stats.shield} ❤️${stats.hp} 💨${stats.speed} ⚔️${stats.dps}</div><div style="font-size:0.62rem;color:#6a90b8;margin-bottom:8px;line-height:1.6">${equipLines || '<span style="opacity:0.5">Bez opreme</span>'}</div><div style="display:flex;justify-content:space-between;align-items:center"><span style="font-size:0.65rem;color:#6a90b8">🏠 Hangar: <strong style="color:white">${fmt(hangarCount)}</strong></span><button class="btn btn-gold" style="font-size:0.65rem" onclick="openBuildModal('${d.id}')">🏭 Gradi</button></div></div>`;
  }).join('');
}

// ── RENDER HANGARA ──
function renderHangarList() {
  if (hangar.length === 0) return `<div class="card" style="text-align:center;color:#6a90b8;padding:20px">🏠 Hangar je prazan.<br><span style="font-size:0.72rem">Izgradi brodove u Ship Factory ili kroz Designer.</span></div>`;
  return `<div class="grid-3">` + hangar.map(h => {
    const design = shipDesigns.find(d => d.id === h.design_id);
    if (!design) return '';
    const ship = getShipById(design.ship_id);
    const cls = SHIP_CLASSES[design.cls || getShipClass(design.ship_id)];
    const inFleet = fleet.reduce((a, s) => a + (s?.design_id === design.id ? (s.count || 0) : 0), 0);
    return `<div class="card" style="border-color:${cls?.color || '#00d4ff'}33"><div style="font-size:0.82rem;font-weight:700;color:${cls?.color || 'white'};margin-bottom:2px">${design.name}</div><div style="font-size:0.65rem;color:#6a90b8;margin-bottom:10px">${ship?.name || ''} · ${cls?.name || ''}</div><div style="font-size:1.6rem;font-family:'Orbitron',monospace;color:white;text-align:center;margin-bottom:4px">${fmt(h.count)}</div><div style="font-size:0.62rem;color:#6a90b8;text-align:center;margin-bottom:10px">brodova u hangaru<br><span style="color:#ffcc44">⚔️ ${fmt(inFleet)} u floti</span></div><button class="btn btn-g" style="width:100%;font-size:0.72rem" onclick="deployToFleet('${h.design_id}')">🚀 Rasporedi u flotu</button></div>`;
  }).join('') + `</div>`;
}

// ── OPEN BUILD MODAL ──
function openBuildModal(designId) {
  const design = shipDesigns.find(d => d.id === designId);
  if (!design) return;
  const ship = getShipById(design.ship_id);
  if (!ship) return;
  const cls = SHIP_CLASSES[design.cls || getShipClass(design.ship_id)];
  const cost = getShipBuildCost(ship);
  const stats = calcDesignStats(design);

  const body = `
    <div style="margin-bottom:12px">
      <div style="font-size:0.9rem;font-weight:700;color:${cls?.color || 'white'}">${design.name}</div>
      <div style="font-size:0.72rem;color:#6a90b8">${ship.name} · ${cls?.name || ''}</div>
    </div>
    <div style="background:rgba(0,0,0,0.3);border-radius:6px;padding:8px;margin-bottom:12px;font-size:0.65rem;font-family:'Share Tech Mono',monospace">
      <div>🛡️ Shield: <span style="color:#00d4ff">${stats.shield}</span></div>
      <div>❤️ HP: <span style="color:white">${stats.hp}</span></div>
      <div>💨 Speed: <span style="color:#aa44ff">${stats.speed}</span></div>
      <div>⚔️ DPS: <span style="color:#ff4444">${stats.dps}</span></div>
    </div>
    <div style="margin-bottom:12px">
      <label style="font-size:0.72rem;color:#6a90b8">Broj brodova (1-3000):</label>
      <input id="buildCount" type="number" min="1" max="3000" value="100"
        style="width:100%;background:#070c1a;border:1px solid rgba(0,212,255,0.3);color:white;padding:6px 10px;border-radius:4px;margin-top:4px;font-size:0.82rem"
        oninput="updateBuildCost('${designId}')" onchange="fixBuildCount(this)">
    </div>
    <div id="buildCostBlock" style="background:rgba(0,0,0,0.3);padding:10px;border-radius:6px;font-size:0.72rem;font-family:'Share Tech Mono',monospace;margin-bottom:12px"></div>
    <div style="font-size:0.65rem;color:#6a90b8">Ship Factory Lv.${buildings.ship_factory?.level || 1} · Popust: -${getShipFactoryDiscount()}% · Brzina: +${getShipFactorySpeedBonus()}%</div>`;

  openModal(`🏭 Gradi: ${design.name}`, body, [
    {
      label: '🏭 Izgradi',
      cls: 'btn-g',
      fn: () => {
        let rawCount = parseInt(document.getElementById('buildCount')?.value || '1');
        let count = rawCount;
        if (rawCount > 3000) { count = 3000; toast(`⚠️ Maksimum je 3000 brodova. Napravljeno ${count}.`, 'warn'); }
        if (count < 1) count = 1;
        const total = { metal: cost.metal * count, crystal: cost.crystal * count, he3: cost.he3 * count };
        if (!canAfford(total)) { toast('❌ Nedovoljno resursa!', 'err'); return; }
        spendResources(total);
        const existing = hangar.find(h => h.design_id === designId);
        if (existing) existing.count += count;
        else hangar.push({ design_id: designId, count });
        closeModal();
        updateResUI();
        if (typeof trackDailyShips === 'function') trackDailyShips(count);
        addLog(`🏭 Izgrađeno ${count}x ${design.name} → Hangar.`);
        toast(`✅ ${fmt(count)}x ${design.name} dodano u hangar!`, 'ok');
        saveGame();
        if (typeof renderHangar === 'function') renderHangar();
      }
    },
    { label: 'Odustani', fn: closeModal }
  ]);
  setTimeout(() => updateBuildCost(designId), 50);
}

// Funkcija koja automatski ispravlja broj u input polju na 3000 ako je veći
function fixBuildCount(input) {
  let val = parseInt(input.value);
  if (isNaN(val)) val = 1;
  if (val > 3000) { input.value = 3000; toast('⚠️ Maksimum je 3000 brodova. Ispravljeno na 3000.', 'warn'); }
  else if (val < 1) input.value = 1;
  const designId = input.closest('.modal-content')?.querySelector('[onclick*="openBuildModal"]')?.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
  if (designId && typeof updateBuildCost === 'function') updateBuildCost(designId);
}

function updateBuildCost(designId) {
  const design = shipDesigns.find(d => d.id === designId);
  if (!design) return;
  const ship = getShipById(design.ship_id);
  if (!ship) return;
  let count = parseInt(document.getElementById('buildCount')?.value || '1');
  if (count > 3000) count = 3000;
  if (count < 1) count = 1;
  const cost = getShipBuildCost(ship);
  const total = { metal: cost.metal * count, crystal: cost.crystal * count, he3: cost.he3 * count };
  const af = canAfford(total);
  const block = document.getElementById('buildCostBlock');
  if (!block) return;
  block.innerHTML = `<div class="${af ? 'ck' : 'cn'}">🔩 Metal: ${fmt(total.metal)}</div><div class="${af ? 'ck' : 'cn'}">💎 Crystal: ${fmt(total.crystal)}</div><div class="${af ? 'ck' : 'cn'}">⛽ He3: ${fmt(total.he3)}</div><div style="margin-top:6px;color:${af ? '#00ff88' : '#ff3355'}">${af ? '✅ Možeš izgraditi' : '❌ Nedovoljno resursa'}</div>`;
}

// ── RASPOREDI U FLOTU ──
function deployToFleet(designId) {
  const h = hangar.find(h => h.design_id === designId);
  if (!h || h.count === 0) { toast('🏠 Hangar je prazan!', 'warn'); return; }
  const design = shipDesigns.find(d => d.id === designId);
  if (!design) return;
  const body = `<div style="margin-bottom:12px;font-size:0.82rem;color:#6a90b8">Dostupno u hangaru: <strong style="color:white">${fmt(h.count)}</strong> brodova</div><div style="margin-bottom:12px"><label style="font-size:0.72rem;color:#6a90b8">Koliko rasporediti:</label><input id="deployCount" type="number" min="1" max="${Math.min(h.count, 3000)}" value="${Math.min(h.count, 3000)}" style="width:100%;background:#070c1a;border:1px solid rgba(0,212,255,0.3);color:white;padding:6px 10px;border-radius:4px;margin-top:4px;font-size:0.82rem"></div><div style="font-size:0.72rem;color:#6a90b8">💡 Brodovi s istim dizajnom idu u isti slot (max 3000 po slotu).</div>`;
  openModal(`🚀 Rasporedi: ${design.name}`, body, [
    {
      label: '🚀 Rasporedi',
      cls: 'btn-g',
      fn: () => {
        const count = Math.max(1, Math.min(h.count, parseInt(document.getElementById('deployCount')?.value || '1')));
        const cls = design.cls || getShipClass(design.ship_id);
        const slots = getClassSlots(cls);
        const loadout = { design_id: design.id, engine_id: design.engine_1 || null };
        for (let i = 1; i <= slots.weapon; i++) loadout[`weapon_${i}`] = design[`weapon_${i}`] || null;
        for (let i = 1; i <= slots.shield; i++) loadout[`shield_${i}`] = design[`shield_${i}`] || null;
        if (slots.recon > 0) loadout.recon_1 = design.recon_1 || null;
        for (let i = 1; i <= slots.special; i++) loadout[`special_${i}`] = design[`special_${i}`] || null;
        const success = addShipsToFleet(design.ship_id, loadout, count);
        if (success) {
          h.count -= count;
          if (h.count <= 0) hangar = hangar.filter(x => x.design_id !== designId);
          closeModal();
          saveGame();
          if (typeof renderHangar === 'function') renderHangar();
        }
      }
    },
    { label: 'Odustani', fn: closeModal }
  ]);
}