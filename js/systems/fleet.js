// ============================================================
// HIVE GALAXY — js/systems/fleet.js
// Fleet menadžment — 3x3 grid, stack sistem, statistike
// ============================================================

// ── CIJENA GRADNJE BRODA (sa Factory discountom) ──
function getShipBuildCost(ship) {
  const base     = ship.armor_val + ship.shield * 0.3 + ship.structure * 0.5;
  const discount = getShipFactoryDiscount() / 100;
  return {
    metal:   Math.floor(base * 8  * (1 - discount)),
    crystal: Math.floor(base * 4  * (1 - discount)),
    he3:     Math.floor(base * 2  * (1 - discount)),
  };
}

// ── STATISTIKE JEDNOG SLOTA ──
function calcSlotStats(slot) {
  if (!slot) return null;
  const ship = getShipById(slot.ship_id);
  if (!ship) return null;
  const count = slot.count || 1;

  let dps = 0;
  for (let i = 1; i <= 4; i++) {
    const wid = slot[`weapon_${i}`];
    if (wid && typeof getWeaponById === 'function') {
      const wpn = getWeaponById(wid);
      if (wpn) dps += (wpn.dps || 0);
    }
  }

  // Izračunaj shield od opreme
  let totalShield = ship.shield;
  for (let i = 1; i <= 3; i++) {
    const sid = slot[`shield_${i}`];
    if (sid) {
      const sh = getShieldById(sid);
      if (sh) totalShield += sh.shield;
    }
  }

  // Brzina od motora
  let speed = ship.movement;
  const engineId = slot.engine_1 || slot.engine_id;
  if (engineId) {
    const eng = getEngineById(engineId);
    if (eng && eng.speed) speed += eng.speed;
  }

  // Agilnost od motora
  let agility = ship.agility;
  if (engineId) {
    const eng = getEngineById(engineId);
    if (eng && eng.agility_bonus) agility += eng.agility_bonus;
  }

  return {
    hp:        (ship.armor_val + totalShield + ship.structure) * count,
    dps:       dps * count,
    armor:     ship.armor_val * count,
    shield:    totalShield * count,
    structure: ship.structure * count,
    agility:   agility,
    speed:     speed,
    stability: ship.stability,
    count,
    power:     calcSlotPower(ship, dps, count),
  };
}

// ── POWER SCORE ──
function calcSlotPower(ship, dps, count) {
  return Math.floor((ship.armor_val + ship.shield * 0.5 + ship.structure + ship.agility * 10 + dps * 10) * count);
}

// ── STATISTIKE CIJELE FLOTE ──
function calcFleetStats(fleetSlots) {
  let total = { hp: 0, dps: 0, armor: 0, shield: 0, structure: 0, power: 0, count: 0 };
  let minSpeed = 99, minAgility = 99;

  fleetSlots.forEach(slot => {
    if (!slot) return;
    const s = calcSlotStats(slot);
    if (!s) return;
    total.hp        += s.hp;
    total.dps       += s.dps;
    total.armor     += s.armor;
    total.shield    += s.shield;
    total.structure += s.structure;
    total.power     += s.power;
    total.count     += s.count;
    if (s.speed   < minSpeed)   minSpeed   = s.speed;
    if (s.agility < minAgility) minAgility = s.agility;
  });

  total.speed   = minSpeed   === 99 ? 0 : minSpeed;
  total.agility = minAgility === 99 ? 0 : minAgility;
  return total;
}

function calcFleetTotalPower() {
  return calcFleetStats(fleet).power;
}

// ── VALIDACIJA SLOTA ──
function slotMatches(slot, shipId, loadout) {
  if (!slot) return false;
  if (slot.ship_id !== shipId) return false;
  if (loadout.design_id && slot.design_id) return slot.design_id === loadout.design_id;
  return true;
}

// ── DODAJ BRODOVE U FLOTU ──
function addShipsToFleet(shipId, loadout, count) {
  const existingIdx = fleet.findIndex(s => slotMatches(s, shipId, loadout));

  if (existingIdx !== -1) {
    const newCount = fleet[existingIdx].count + count;
    fleet[existingIdx].count = Math.min(3000, newCount);
    if (newCount > 3000) toast('⚠️ Maksimum 3000 brodova po slotu!', 'warn');
    else toast(`✅ Dodano ${count}x u slot ${existingIdx + 1}`, 'ok');
    renderFleet();
    if (typeof updateHangarStatus === 'function') updateHangarStatus();
    saveGame();
    return true;
  }

  const emptyIdx = fleet.findIndex(s => s === null);
  if (emptyIdx === -1) {
    toast('❌ Flota je puna! Svih 9 slotova je zauzeto.', 'err');
    return false;
  }

  fleet[emptyIdx] = { ship_id: shipId, count: Math.min(count, 3000), ...loadout };
  toast(`✅ ${count}x dodano u slot ${emptyIdx + 1}`, 'ok');
  addLog(`🚀 ${count}x ${shipId} dodano u flotu.`);
  renderFleet();
  if (typeof updateHangarStatus === 'function') updateHangarStatus();
  saveGame();
  return true;
}

// ── UKLONI SVE IZ SLOTA → hangar ──
function removeFleetSlot(slotIdx) {
  if (slotIdx < 0 || slotIdx >= 9) return;
  const slot = fleet[slotIdx];
  if (!slot) return;
  const ship = getShipById(slot.ship_id);
  if (!confirm(`Vratiti sve (${slot.count}x ${ship?.name || slot.ship_id}) u hangar?`)) return;

  if (slot.design_id) {
    const existing = hangar.find(h => h.design_id === slot.design_id);
    if (existing) existing.count += slot.count;
    else hangar.push({ design_id: slot.design_id, count: slot.count });
    toast(`🏠 ${slot.count}x vraćeno u hangar.`, 'ok');
  } else {
    toast('🗑️ Uklonjeno (bez dizajna — nije vraćeno u hangar).', 'warn');
  }

  fleet[slotIdx] = null;
  renderFleet();
  if (typeof updateHangarStatus === 'function') updateHangarStatus();
  saveGame();
  addLog(`🏠 Slot ${slotIdx + 1} obrisan.`);
}

// ── PREMJESTI SLOT ──
function moveFleetSlot(fromIdx, toIdx) {
  if (fromIdx === toIdx) return;
  const temp     = fleet[fromIdx];
  fleet[fromIdx] = fleet[toIdx];
  fleet[toIdx]   = temp;
  renderFleet();
  saveGame();
}

// ── RENDER FLOTE ──
function renderFleet() {
  const el = document.getElementById('fleetGrid');
  if (!el) return;

  const stats = calcFleetStats(fleet);

  el.innerHTML = `
    <div class="card" style="margin-bottom:16px">
      <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:12px;text-align:center">
        <div><div style="font-size:0.65rem;color:#6a90b8;margin-bottom:4px">MOĆ</div>
          <div style="font-size:1.1rem;font-family:'Orbitron',monospace;color:#00d4ff">${fmt(stats.power)}</div></div>
        <div><div style="font-size:0.65rem;color:#6a90b8;margin-bottom:4px">UKUPNO HP</div>
          <div style="font-size:1.1rem;font-family:'Orbitron',monospace;color:#00ff88">${fmt(stats.hp)}</div></div>
        <div><div style="font-size:0.65rem;color:#6a90b8;margin-bottom:4px">UKUPNO DPS</div>
          <div style="font-size:1.1rem;font-family:'Orbitron',monospace;color:#ff4444">${fmt(stats.dps)}</div></div>
        <div><div style="font-size:0.65rem;color:#6a90b8;margin-bottom:4px">BRODOVI</div>
          <div style="font-size:1.1rem;font-family:'Orbitron',monospace;color:#ffcc44">${fmt(stats.count)}</div></div>
        <div><div style="font-size:0.65rem;color:#6a90b8;margin-bottom:4px">BRZINA</div>
          <div style="font-size:1.1rem;font-family:'Orbitron',monospace;color:#aa44ff">${stats.speed}</div></div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
      ${fleet.map((slot, idx) => renderFleetSlot(slot, idx)).join('')}
    </div>`;
}

// ── RENDER JEDNOG SLOTA ──
function renderFleetSlot(slot, idx) {
  if (!slot) {
    return `
      <div class="card" style="min-height:160px;display:flex;align-items:center;
        justify-content:center;border:1px dashed rgba(0,212,255,0.2);cursor:pointer;opacity:0.5"
        onclick="openShipSelector(${idx})">
        <div style="text-align:center;color:#6a90b8">
          <div style="font-size:2rem;margin-bottom:6px">+</div>
          <div style="font-size:0.72rem">Dodaj brodove</div>
          <div style="font-size:0.65rem">Slot ${idx + 1}</div>
        </div>
      </div>`;
  }

  const ship = getShipById(slot.ship_id);
  if (!ship) return `<div class="card" style="min-height:160px;color:#ff3355;text-align:center">⚠️ Greška</div>`;

  const cls     = SHIP_CLASSES[getShipClass(slot.ship_id)];
  const s       = calcSlotStats(slot);
  const pctFill = Math.min(100, (slot.count / 3000) * 100);
  const design  = slot.design_id ? shipDesigns.find(d => d.id === slot.design_id) : null;
  const hangarCount = slot.design_id ? (hangar.find(h => h.design_id === slot.design_id)?.count || 0) : 0;

  // Prikaz opreme
  let equipHtml = '';
  for (let i = 1; i <= 4; i++) {
    if (slot[`weapon_${i}`]) equipHtml += `<div>⚔️ ${slot[`weapon_${i}`]}</div>`;
  }
  for (let i = 1; i <= 3; i++) {
    if (slot[`shield_${i}`]) equipHtml += `<div>🛡️ ${slot[`shield_${i}`]}</div>`;
  }
  if (slot.engine_1 || slot.engine_id) equipHtml += `<div>🔩 ${slot.engine_1 || slot.engine_id}</div>`;
  if (!equipHtml) equipHtml = '<div style="opacity:0.4">Bez opreme</div>';

  return `
    <div class="card" style="border-color:${cls?.color || '#00d4ff'}33">

      <!-- Header -->
      <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px">
        <div>
          <div style="font-size:0.8rem;font-weight:700;color:${cls?.color || 'white'}">
            ${design?.name || ship.name}
          </div>
          <div style="font-size:0.62rem;color:#6a90b8">${ship.name} · ${cls?.name || ''}</div>
        </div>
        <button class="btn btn-r" style="font-size:0.6rem;padding:2px 6px"
          title="Vrati sve u hangar"
          onclick="removeFleetSlot(${idx})">✕</button>
      </div>

      <!-- Count bar -->
      <div style="margin-bottom:8px">
        <div style="display:flex;justify-content:space-between;margin-bottom:3px">
          <span style="font-size:0.62rem;color:#6a90b8">U floti</span>
          <span style="font-size:0.72rem;color:white;font-family:'Share Tech Mono',monospace">
            ${fmt(slot.count)} / 3000
          </span>
        </div>
        <div class="pbar"><div class="pbar-fill" style="width:${pctFill}%"></div></div>
        ${hangarCount > 0 ? `<div style="font-size:0.6rem;color:#ffcc44;margin-top:2px">🏠 ${fmt(hangarCount)} u hangaru</div>` : ''}
      </div>

      <!-- Stats -->
      <div style="font-size:0.63rem;font-family:'Share Tech Mono',monospace;line-height:1.7;color:#6a90b8;margin-bottom:8px">
        <div>🛡️ Shield: <span style="color:#00d4ff">${fmt(s.shield)}</span></div>
        <div>❤️ HP: <span style="color:white">${fmt(s.hp)}</span></div>
        <div>💨 Speed: <span style="color:#aa44ff">${s.speed}</span></div>
        <div>⚔️ DPS: <span style="color:#ff4444">${fmt(s.dps)}</span></div>
        <div>💫 Power: <span style="color:#ffcc44">${fmt(s.power)}</span></div>
      </div>

      <!-- Oprema -->
      <div style="font-size:0.6rem;color:#6a90b8;border-top:1px solid rgba(255,255,255,0.05);
        padding-top:6px;margin-bottom:8px;line-height:1.6">
        ${equipHtml}
      </div>

      <!-- Jedan gumb: Upravljaj -->
      <button class="btn btn-gold" style="width:100%;font-size:0.72rem"
        onclick="openSlotManager(${idx})">
        ⚙️ Upravljaj
      </button>

    </div>`;
}

// ── SLOT MANAGER — dodaj/oduzmi iz hangara ──
function openSlotManager(slotIdx) {
  const slot = fleet[slotIdx];
  if (!slot) return;

  const ship   = getShipById(slot.ship_id);
  const cls    = SHIP_CLASSES[getShipClass(slot.ship_id)];
  const design = slot.design_id ? shipDesigns.find(d => d.id === slot.design_id) : null;
  const hEntry = slot.design_id ? hangar.find(h => h.design_id === slot.design_id) : null;
  const hangarCount = hEntry?.count || 0;
  const maxAdd  = Math.min(hangarCount, 3000 - slot.count);
  const maxBack = slot.count;

  const body = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;text-align:center">
      <div style="background:rgba(0,0,0,0.3);padding:10px;border-radius:6px">
        <div style="font-size:0.65rem;color:#6a90b8;margin-bottom:4px">U FLOTI (slot ${slotIdx+1})</div>
        <div style="font-size:1.4rem;font-family:'Orbitron',monospace;color:#00d4ff">${fmt(slot.count)}</div>
      </div>
      <div style="background:rgba(0,0,0,0.3);padding:10px;border-radius:6px">
        <div style="font-size:0.65rem;color:#6a90b8;margin-bottom:4px">U HANGARU</div>
        <div style="font-size:1.4rem;font-family:'Orbitron',monospace;color:#ffcc44">${fmt(hangarCount)}</div>
      </div>
    </div>

    <!-- Dodaj iz hangara -->
    <div style="margin-bottom:16px;padding:12px;background:rgba(0,255,136,0.05);
      border:1px solid rgba(0,255,136,0.2);border-radius:6px">
      <div style="font-size:0.72rem;color:#00ff88;margin-bottom:8px;font-weight:700">
        ➕ DODAJ IZ HANGARA U FLOTU
      </div>
      ${maxAdd > 0 ? `
        <div style="display:flex;gap:8px;align-items:center">
          <input id="addCount" type="number" min="1" max="${maxAdd}" value="${maxAdd}"
            style="flex:1;background:#070c1a;border:1px solid rgba(0,255,136,0.3);
              color:white;padding:6px 10px;border-radius:4px;font-size:0.82rem">
          <button class="btn btn-g" onclick="slotManagerAdd(${slotIdx})">➕ Dodaj</button>
        </div>
        <div style="font-size:0.62rem;color:#6a90b8;margin-top:4px">Max: ${fmt(maxAdd)}</div>
      ` : `<div style="font-size:0.72rem;color:#6a90b8">
        ${hangarCount === 0 ? '🏠 Hangar prazan.' : '⚠️ Slot je pun (3000/3000).'}
      </div>`}
    </div>

    <!-- Vrati u hangar -->
    <div style="padding:12px;background:rgba(255,204,68,0.05);
      border:1px solid rgba(255,204,68,0.2);border-radius:6px">
      <div style="font-size:0.72rem;color:#ffcc44;margin-bottom:8px;font-weight:700">
        ➖ VRATI U HANGAR
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <input id="backCount" type="number" min="1" max="${maxBack}" value="1"
          style="flex:1;background:#070c1a;border:1px solid rgba(255,204,68,0.3);
            color:white;padding:6px 10px;border-radius:4px;font-size:0.82rem">
        <button class="btn btn-gold" onclick="slotManagerReturn(${slotIdx})">🏠 Vrati</button>
      </div>
      <div style="font-size:0.62rem;color:#6a90b8;margin-top:4px">Max: ${fmt(maxBack)}</div>
    </div>
  `;

  openModal(
    `⚙️ Upravljaj — ${design?.name || ship?.name || 'Slot ' + (slotIdx+1)}`,
    body,
    [{ label: 'Zatvori', fn: closeModal }]
  );
}

// ── DODAJ IZ HANGARA U SLOT ──
function slotManagerAdd(slotIdx) {
  const slot   = fleet[slotIdx];
  if (!slot || !slot.design_id) return;
  const hEntry = hangar.find(h => h.design_id === slot.design_id);
  if (!hEntry || hEntry.count === 0) { toast('🏠 Hangar prazan!', 'warn'); return; }

  const count = Math.max(1, Math.min(hEntry.count, 3000 - slot.count, parseInt(document.getElementById('addCount')?.value || '1')));
  if (count <= 0) { toast('⚠️ Slot je pun!', 'warn'); return; }

  slot.count    += count;
  hEntry.count  -= count;
  if (hEntry.count <= 0) hangar.splice(hangar.indexOf(hEntry), 1);

  closeModal();
  renderFleet();
  if (typeof updateHangarStatus === 'function') updateHangarStatus();
  saveGame();
  toast(`✅ +${count} brodova u slot ${slotIdx + 1}`, 'ok');
  addLog(`➕ ${count}x dodano u slot ${slotIdx + 1} iz hangara.`);
}

// ── VRATI IZ SLOTA U HANGAR ──
function slotManagerReturn(slotIdx) {
  const slot = fleet[slotIdx];
  if (!slot) return;

  const count = Math.max(1, Math.min(slot.count, parseInt(document.getElementById('backCount')?.value || '1')));

  if (slot.design_id) {
    const hEntry = hangar.find(h => h.design_id === slot.design_id);
    if (hEntry) hEntry.count += count;
    else hangar.push({ design_id: slot.design_id, count });
  }

  slot.count -= count;
  if (slot.count <= 0) fleet[slotIdx] = null;

  closeModal();
  renderFleet();
  if (typeof updateHangarStatus === 'function') updateHangarStatus();
  saveGame();
  toast(`🏠 ${count} brodova vraćeno u hangar.`, 'ok');
  addLog(`➖ ${count}x vraćeno u hangar iz slota ${slotIdx + 1}.`);
}

// ── OPEN SHIP SELECTOR — iz hangara ──
function openShipSelector(slotIdx) {
  if (hangar.length === 0) {
    toast('🏠 Hangar je prazan! Dizajniraj i izgradi brodove.', 'warn');
    return;
  }

  const body = `
    <div style="font-size:0.78rem;color:#6a90b8;margin-bottom:12px">
      Odaberi brodove iz hangara za slot ${slotIdx + 1}:
    </div>
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;max-height:400px;overflow-y:auto">
      ${hangar.map(h => {
        const design = shipDesigns.find(d => d.id === h.design_id);
        if (!design) return '';
        const ship = getShipById(design.ship_id);
        const cls  = SHIP_CLASSES[design.cls || getShipClass(design.ship_id)];
        return `
          <div class="card" style="cursor:pointer;border-color:${cls?.color || '#00d4ff'}44"
            onclick="selectHangarForSlot(${slotIdx},'${h.design_id}')">
            <div style="font-size:0.78rem;font-weight:700;color:${cls?.color || 'white'}">${design.name}</div>
            <div style="font-size:0.65rem;color:#6a90b8">${ship?.name || ''} · ${cls?.name || ''}</div>
            <div style="font-size:0.72rem;color:white;margin-top:4px">🏠 ${fmt(h.count)} dostupno</div>
          </div>`;
      }).join('')}
    </div>`;

  openModal(`🚀 Hangar → Slot ${slotIdx + 1}`, body);
}

function selectHangarForSlot(slotIdx, designId) {
  closeModal();
  const h = hangar.find(h => h.design_id === designId);
  if (!h || h.count === 0) { toast('🏠 Nema brodova!', 'warn'); return; }
  const design = shipDesigns.find(d => d.id === designId);
  if (!design) return;

  const existing = fleet[slotIdx];
  if (existing && existing.design_id !== designId) {
    toast('❌ Slot je zauzet drugim dizajnom! Prvo ga oslobodi.', 'err');
    return;
  }

  const body = `
    <div style="margin-bottom:12px;font-size:0.82rem;color:#6a90b8">
      Dostupno u hangaru: <strong style="color:white">${fmt(h.count)}</strong>
      ${existing ? ` · Već u slotu: <strong style="color:#00d4ff">${fmt(existing.count)}</strong>` : ''}
    </div>
    <div>
      <label style="font-size:0.72rem;color:#6a90b8">Koliko rasporediti:</label>
      <input id="slotDeployCount" type="number" min="1"
        max="${Math.min(h.count, existing ? 3000 - existing.count : 3000)}"
        value="${Math.min(h.count, existing ? 3000 - existing.count : 3000)}"
        style="width:100%;background:#070c1a;border:1px solid rgba(0,212,255,0.3);
          color:white;padding:6px 10px;border-radius:4px;margin-top:4px;font-size:0.82rem">
    </div>`;

  openModal(`🚀 Rasporedi u slot ${slotIdx + 1}`, body, [
    {
      label: '🚀 Rasporedi',
      cls:   'btn-g',
      fn: () => {
        const maxAdd = existing ? 3000 - existing.count : 3000;
        const count  = Math.max(1, Math.min(h.count, maxAdd, parseInt(document.getElementById('slotDeployCount')?.value || '1')));

        const cls    = design.cls || getShipClass(design.ship_id);
        const slots  = typeof getClassSlots === 'function' ? getClassSlots(cls) : { weapon: 4, shield: 1 };
        const loadout = { design_id: design.id, engine_id: design.engine_1 || null, engine_1: design.engine_1 || null };
        for (let i = 1; i <= (slots.weapon || 4); i++) loadout[`weapon_${i}`] = design[`weapon_${i}`] || null;
        for (let i = 1; i <= (slots.shield || 1); i++) loadout[`shield_${i}`] = design[`shield_${i}`] || null;

        if (existing) {
          fleet[slotIdx].count = Math.min(3000, existing.count + count);
        } else {
          fleet[slotIdx] = { ...loadout, ship_id: design.ship_id, count };
        }

        h.count -= count;
        if (h.count <= 0) hangar.splice(hangar.indexOf(h), 1);

        closeModal();
        renderFleet();
        if (typeof updateHangarStatus === 'function') updateHangarStatus();
        saveGame();
        toast(`✅ ${count}x ${design.name} → slot ${slotIdx + 1}`, 'ok');
        addLog(`🚀 ${count}x ${design.name} raspoređeno u slot ${slotIdx + 1}.`);
      }
    },
    { label: 'Odustani', fn: closeModal }
  ]);
}