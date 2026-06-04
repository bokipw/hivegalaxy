// ============================================================
// HIVE GALAXY — js/systems/instances.js
// Instance sistem — odabir, borba, nagrade
// ============================================================

// ── DIFFICULTY MODOVI ──
const INST_DIFFICULTY_MODES = {
  easy: {
    label:       '😊 Easy',
    color:       '#00ff88',
    cmdLevel:    [0, 25],
    commanders:  1,
    bpTier:      'I',
    enemyMult:   0.7,
    rewardMult:  1.0,
    energyMult:  0.8,
    keyCost:     1,
    desc:        'Komandir Lv 0-25 · 1 komandant · Blueprint Tier I',
  },
  normal: {
    label:       '⚔️ Normal',
    color:       '#ffcc44',
    cmdLevel:    [25, 50],
    commanders:  3,
    bpTier:      'II',
    enemyMult:   1.0,
    rewardMult:  1.5,
    energyMult:  1.0,
    keyCost:     1,
    desc:        'Komandir Lv 25-50 · do 3 komandanta · Blueprint Tier II',
  },
  nightmare: {
    label:       '💀 Nightmare',
    color:       '#ff8833',
    cmdLevel:    [50, 75],
    commanders:  6,
    bpTier:      'III',
    enemyMult:   1.5,
    rewardMult:  2.5,
    energyMult:  1.2,
    keyCost:     2,
    desc:        'Komandir Lv 50-75 · do 6 komandanata · Blueprint Tier III',
  },
  hell: {
    label:       '🔥 Hell',
    color:       '#ff3355',
    cmdLevel:    [75, 100],
    commanders:  9,
    bpTier:      'IV',
    enemyMult:   2.5,
    rewardMult:  5.0,
    energyMult:  1.5,
    keyCost:     3,
    desc:        'Komandir Lv 75-100 · do 9 komandanata · Blueprint Tier IV/Legendary',
  },
};

// ── BLUEPRINT TIER DROPOVI PO MODU ──
const BP_TIER_DROPS = {
  I:   { rarity: ['C'],       label: 'Tier I',       color: '#6a90b8' },
  II:  { rarity: ['C', 'R'],  label: 'Tier II',      color: '#00ff88' },
  III: { rarity: ['R', 'E'],  label: 'Tier III',     color: '#aa44ff' },
  IV:  { rarity: ['E', 'L'],  label: 'Tier IV',      color: '#ffcc44' },
};

// ── STATE ──
let _instTab          = 'standard';
let _instFilter       = 'available';
let _instDifficultyMode = 'easy'; // easy | normal | nightmare | hell

// ── PROVJERA DOSTUPNOSTI MODA ──
function isDifficultyModeAvailable(mode) {
  const cmdLvl = commander.level;
  switch(mode) {
    case 'easy':      return true;
    case 'normal':    return cmdLvl >= 25;
    case 'nightmare': return cmdLvl >= 50;
    case 'hell':      return cmdLvl >= 75;
    default:          return false;
  }
}

// ── ENERGIJA PO INSTANCI (skalirana po modu) ──
function getInstanceEnergyCost(inst) {
  const n    = inst.number || 1;
  const mode = INST_DIFFICULTY_MODES[_instDifficultyMode] || INST_DIFFICULTY_MODES.easy;
  let base;
  switch(inst.type) {
    case 'standard':      base = 7  + (n - 1) * 2;   break;
    case 'restricted':    base = 70 + (n - 1) * 10;  break;
    case 'trial':         base = 100 + (n - 1) * 15; break;
    case 'humanoid':      base = 80 + (n - 1) * 10;  break;
    case 'pirate':        base = 75 + (n - 1) * 10;  break;
    case 'constellation': base = 200 + (n - 1) * 50; break;
    case 'boss':          base = 300;                 break;
    case 'boss_rare':     base = 40;                  break;
    case 'boss_epic':     base = 80;                  break;
    case 'boss_legendary':base = 150;                 break;
    case 'boss_master':   base = 300;                 break;
    default:              base = 50;
  }
  return Math.floor(base * mode.energyMult);
}

// ── MIN POWER SKALIRAN PO MODU ──
function getInstanceMinPower(inst) {
  const mode = INST_DIFFICULTY_MODES[_instDifficultyMode] || INST_DIFFICULTY_MODES.easy;
  return Math.floor(inst.min_power * mode.enemyMult);
}

// ── RENDER INSTANCE PANELA ──
function renderInstances() {
  const el = document.getElementById('instanceContent');
  if (!el) return;

  const playerPower = calcFleetTotalPower();
  const mode        = INST_DIFFICULTY_MODES[_instDifficultyMode];
  const bpTier      = BP_TIER_DROPS[mode.bpTier];

  el.innerHTML = `
    <!-- ── DIFFICULTY MOD DUGMAD ── -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:16px">
      ${Object.entries(INST_DIFFICULTY_MODES).map(([key, m]) => {
        const isActive  = _instDifficultyMode === key;
        const available = isDifficultyModeAvailable(key);
        const locked    = !available;
        return `
          <div style="
            background:${isActive ? m.color + '18' : 'rgba(0,0,0,0.3)'};
            border:2px solid ${isActive ? m.color : locked ? '#1a2540' : m.color + '44'};
            border-radius:8px;
            padding:10px 8px;
            text-align:center;
            cursor:${locked ? 'not-allowed' : 'pointer'};
            opacity:${locked ? 0.4 : 1};
            transition:all 0.2s;
          " onclick="${locked ? '' : `_instDifficultyMode='${key}';renderInstances()`}">
            <div style="font-size:1.1rem;margin-bottom:4px">${m.label.split(' ')[0]}</div>
            <div style="font-size:0.75rem;font-weight:700;color:${isActive ? m.color : locked ? '#6a90b8' : 'white'}">
              ${m.label.split(' ').slice(1).join(' ')}
            </div>
            <div style="font-size:0.55rem;color:${locked ? '#444' : '#6a90b8'};margin-top:3px;line-height:1.4">
              ${locked ? `🔒 Komandir Lv${m.cmdLevel[0]}` : `BP ${BP_TIER_DROPS[m.bpTier].label}`}
            </div>
            ${isActive ? `<div style="width:100%;height:2px;background:${m.color};border-radius:2px;margin-top:6px"></div>` : ''}
          </div>`;
      }).join('')}
    </div>

    <!-- ── INFO BAR AKTIVNOG MODA ── -->
    <div class="card" style="margin-bottom:16px;border-color:${mode.color}44;
      background:${mode.color}08">
      <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">
        <div style="flex:1">
          <div style="font-size:0.65rem;color:#6a90b8;letter-spacing:2px;margin-bottom:4px">AKTIVAN MOD</div>
          <div style="font-size:0.9rem;font-weight:700;color:${mode.color};font-family:'Orbitron',monospace">
            ${mode.label}
          </div>
          <div style="font-size:0.62rem;color:#6a90b8;margin-top:2px">${mode.desc}</div>
        </div>
        <div style="display:flex;gap:12px;flex-wrap:wrap">
          <div style="text-align:center">
            <div style="font-size:0.58rem;color:#6a90b8;margin-bottom:2px">BLUEPRINT</div>
            <div style="font-size:0.78rem;font-weight:700;color:${bpTier.color}">${bpTier.label}</div>
            <div style="font-size:0.55rem;color:${bpTier.color}">${bpTier.rarity.join(', ')}</div>
          </div>
          <div style="text-align:center">
            <div style="font-size:0.58rem;color:#6a90b8;margin-bottom:2px">NAGRADE</div>
            <div style="font-size:0.78rem;font-weight:700;color:#00ff88">×${mode.rewardMult}</div>
          </div>
          <div style="text-align:center">
            <div style="font-size:0.58rem;color:#6a90b8;margin-bottom:2px">KEY COST</div>
            <div style="font-size:0.78rem;font-weight:700;color:#ffcc44">${mode.keyCost}🗝️</div>
          </div>
          <div style="text-align:center">
            <div style="font-size:0.58rem;color:#6a90b8;margin-bottom:2px">KOMANDANTI</div>
            <div style="font-size:0.78rem;font-weight:700;color:#aa44ff">max ${mode.commanders}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── PLAYER POWER + FILTER ── -->
    <div class="card" style="margin-bottom:16px;display:flex;gap:24px;align-items:center">
      <div style="text-align:center">
        <div style="font-size:0.65rem;color:#6a90b8;margin-bottom:2px">FLOTA MOĆ</div>
        <div style="font-size:1.3rem;font-family:'Orbitron',monospace;color:#00d4ff">
          ${fmt(playerPower)}
        </div>
      </div>
      <div style="flex:1">
        <div style="font-size:0.72rem;color:#6a90b8;margin-bottom:4px">
          Aktivnih slotova: ${fleet.filter(s => s !== null).length} / 9
        </div>
        ${fleet.filter(s => s !== null).length === 0
          ? `<div style="font-size:0.72rem;color:#ff3355">⚠️ Flota je prazna! Rasporedi brodove iz Hangara.</div>`
          : `<div style="font-size:0.72rem;color:#00ff88">✅ Flota spremna za borbu</div>`}
      </div>
      <div style="display:flex;gap:6px">
        ${['available','all','completed'].map(f => `
          <button class="btn ${_instFilter===f?'btn-g':''}" style="font-size:0.65rem;padding:4px 10px"
            onclick="_instFilter='${f}';renderInstances()">
            ${f==='available'?'Dostupne':f==='all'?'Sve':'✅ Završene'}
          </button>`).join('')}
      </div>
    </div>

    <!-- ── TIP TABOVI ── -->
    <div style="display:flex;gap:6px;margin-bottom:16px;flex-wrap:wrap">
      ${[
        { key: 'standard',      label: '🌌 Standard',       color: '#4488ff' },
        { key: 'restricted',    label: '🔒 Restricted',     color: '#aa44ff' },
        { key: 'trial',         label: '⚔️ Trial',           color: '#ffaa00' },
        { key: 'humanoid',      label: '👤 Humanoid',       color: '#ff6644' },
        { key: 'pirate',        label: '🏴‍☠️ Pirate',        color: '#884400' },
        { key: 'constellation', label: '⭐ Constellation',  color: '#ffcc33' },
        { key: 'boss_rare',     label: '💀 Rare Boss',      color: '#4488ff' },
        { key: 'boss_epic',     label: '👹 Epic Boss',      color: '#aa44ff' },
        { key: 'boss_legendary',label: '🌑 Legendary Boss', color: '#ffaa00' },
        { key: 'boss_master',   label: '👑 Master Boss',    color: '#ffffff' },
        { key: 'boss',          label: '👹 Boss Event',     color: '#ff0044' },
      ].map(t => `
        <button class="btn ${_instTab===t.key?'btn-gold':''}"
          style="font-size:0.72rem;padding:5px 12px;
            ${_instTab===t.key ? 'border-color:'+t.color+';color:'+t.color : ''}"
          onclick="_instTab='${t.key}';renderInstances()">
          ${t.label}
        </button>`).join('')}
    </div>

    <!-- ── INSTANCE GRID ── -->
    <div id="instanceGrid">
      ${renderInstanceGrid(playerPower)}
    </div>
  `;
}

// ── RENDER INSTANCE GRID ──
function renderInstanceGrid(playerPower) {
  const mode     = INST_DIFFICULTY_MODES[_instDifficultyMode];
  let instances  = INSTANCES.filter(i => i.type === _instTab);
  const minPower = (inst) => getInstanceMinPower(inst);

  if (_instFilter === 'available') {
    instances = instances.filter(i => playerPower >= minPower(i) || minPower(i) === 0);
  } else if (_instFilter === 'completed') {
    instances = instances.filter(i => getInstanceProgress(i.id + '_' + _instDifficultyMode).completed);
  }

  if (instances.length === 0) {
    return `<div class="card" style="text-align:center;color:#6a90b8;padding:30px">
      ${_instFilter === 'available'
        ? `🔒 Nema dostupnih instanci za tvoju flotu moć na <span style="color:${mode.color}">${mode.label}</span>. Ojačaj flotu!`
        : '📋 Nema rezultata.'}
    </div>`;
  }

  return `<div class="grid-3">` + instances.map(inst => renderInstanceCard(inst, playerPower)).join('') + '</div>';
}

// ── INSTANCE KARTICA ──
function renderInstanceCard(inst, playerPower) {
  const mode       = INST_DIFFICULTY_MODES[_instDifficultyMode];
  const bpTier     = BP_TIER_DROPS[mode.bpTier];
  const progKey    = inst.id + '_' + _instDifficultyMode;
  const prog       = getInstanceProgress(progKey);
  const scaledPow  = getInstanceMinPower(inst);
  const locked     = playerPower < scaledPow;
  const diff       = DIFFICULTY[inst.difficulty] || DIFFICULTY[1];
  const typeInfo   = INSTANCE_TYPES[inst.type] || {};
  const isTrial    = inst.type === 'trial';
  const energyCost = getInstanceEnergyCost(inst);
  const hasEnergy  = R.energy >= energyCost;

  // Nagrade preview skalirane
  const metalMin   = Math.floor(inst.resources.metal[0]   * mode.rewardMult);
  const metalMax   = Math.floor(inst.resources.metal[1]   * mode.rewardMult);
  const crystalMin = Math.floor(inst.resources.crystal[0] * mode.rewardMult);
  const crystalMax = Math.floor(inst.resources.crystal[1] * mode.rewardMult);

  return `
    <div class="card" style="
      border-color:${locked ? 'rgba(255,255,255,0.06)' : mode.color + '33'};
      opacity:${locked ? 0.55 : 1};
      position:relative">

      <!-- Difficulty badge -->
      <div style="position:absolute;top:8px;left:8px;font-size:0.55rem;
        background:${mode.color}22;border:1px solid ${mode.color}66;
        color:${mode.color};padding:1px 5px;border-radius:3px;letter-spacing:1px">
        ${mode.label.split(' ').slice(1).join(' ').toUpperCase()}
      </div>

      ${locked ? `<div style="position:absolute;top:8px;right:8px;font-size:1.2rem">🔒</div>` : ''}
      ${prog.completed ? `
        <div style="position:absolute;top:8px;right:8px;font-size:0.65rem;
          background:rgba(0,255,136,0.1);border:1px solid rgba(0,255,136,0.3);
          color:#00ff88;padding:2px 6px;border-radius:4px">✅ ${prog.clear_count}x</div>` : ''}
      ${prog.bpCompleted ? `
        <div style="position:absolute;top:34px;right:8px;font-size:0.65rem;
          background:rgba(255,204,68,0.1);border:1px solid rgba(255,204,68,0.3);
          color:#ffcc44;padding:2px 6px;border-radius:4px">📋 BP ✓</div>` : ''}

      <!-- Header -->
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;margin-top:18px">
        <div style="font-size:1.5rem">${inst.icon}</div>
        <div>
          <div style="font-size:0.85rem;font-weight:700;color:${typeInfo.color || 'white'}">
            ${inst.name}
          </div>
          <div style="font-size:0.62rem;color:#6a90b8">${typeInfo.name || ''}</div>
        </div>
      </div>

      <!-- Težina -->
      <div style="font-size:0.72rem;margin-bottom:6px">
        ${diff.label}
        <span style="font-size:0.6rem;color:#6a90b8;margin-left:6px">Težina ${inst.difficulty}/10</span>
      </div>

      <!-- Boss -->
      <div style="font-size:0.68rem;color:#6a90b8;margin-bottom:6px">
        👹 Boss: <span style="color:white">${inst.boss}</span>
      </div>

      ${isTrial ? `
        <div style="font-size:0.65rem;color:#ffcc44;margin-bottom:6px">
          ⏱️ Limit: ${inst.time_limit_minutes} min
          ${prog.best_rank ? ` · Best: <strong>${prog.best_rank}</strong>` : ''}
        </div>` : ''}

      <!-- Min power -->
      <div style="font-size:0.62rem;margin-bottom:4px;
        color:${locked ? '#ff3355' : playerPower >= scaledPow * 1.5 ? '#00ff88' : '#ffcc44'}">
        ⚡ Min moć: ${fmt(scaledPow)} ${locked ? '(nedovoljno)' : ''}
      </div>

      <!-- Energija -->
      <div style="font-size:0.62rem;margin-bottom:6px;color:${hasEnergy ? '#6a90b8' : '#ff3355'}">
        🔋 ${energyCost} MWh ${hasEnergy ? '' : '(nedovoljno)'}
      </div>

      <!-- BP tier badge -->
      <div style="display:flex;align-items:center;gap:4px;margin-bottom:8px">
        <div style="font-size:0.58rem;background:${bpTier.color}18;border:1px solid ${bpTier.color}44;
          color:${bpTier.color};padding:2px 6px;border-radius:3px">
          📋 ${bpTier.label} · ${bpTier.rarity.join('/')}
        </div>
      </div>

      <!-- Nagrade preview -->
      <div style="font-size:0.6rem;color:#6a90b8;margin-bottom:8px;
        font-family:'Share Tech Mono',monospace;line-height:1.6">
        🔩 ${fmt(metalMin)}-${fmt(metalMax)}
        💎 ${fmt(crystalMin)}-${fmt(crystalMax)}
      </div>

      <!-- Dugme -->
      <button class="btn ${!locked && hasEnergy ? 'btn-g' : ''}"
        style="width:100%;font-size:0.75rem;border-color:${!locked && hasEnergy ? mode.color : ''}"
        onclick="${locked ? '' : `openInstanceModal('${inst.id}')`}"
        ${locked || !hasEnergy ? 'disabled' : ''}>
        ${locked
          ? `🔒 Treba ${fmt(scaledPow)} moći`
          : !hasEnergy
            ? `🔋 Treba ${energyCost} MWh`
            : isTrial ? '⚔️ Pokreni Trial' : '⚔️ Napadni'}
      </button>
    </div>`;
}

// ── DROP PREVIEW ──
function getDropPreview(inst) {
  const guaranteed = inst.drops?.guaranteed || [];
  const chance     = inst.drops?.chance     || [];
  const items      = [...guaranteed.slice(0, 2), ...chance.slice(0, 1).map(c => c.item)];
  if (items.length === 0) return 'Nepoznato';
  return items.map(id => getBpName ? getBpName(id) : id).join(', ');
}

// ── OTVORI INSTANCE MODAL ──
function openInstanceModal(instId) {
  const inst       = INSTANCES.find(i => i.id === instId);
  if (!inst) return;

  const mode       = INST_DIFFICULTY_MODES[_instDifficultyMode];
  const bpTier     = BP_TIER_DROPS[mode.bpTier];
  const fleetSlots = fleet.filter(s => s !== null);
  const progKey    = inst.id + '_' + _instDifficultyMode;
  const prog       = getInstanceProgress(progKey);

  if (fleetSlots.length === 0) {
    toast('⚠️ Flota je prazna! Rasporedi brodove iz Hangara.', 'warn');
    return;
  }

  const typeInfo   = INSTANCE_TYPES[inst.type] || {};
  const diff       = DIFFICULTY[inst.difficulty] || DIFFICULTY[1];
  const playerPower = calcFleetTotalPower();
  const energyCost = getInstanceEnergyCost(inst);

  const metalMin   = Math.floor(inst.resources.metal[0]   * mode.rewardMult);
  const metalMax   = Math.floor(inst.resources.metal[1]   * mode.rewardMult);
  const crystalMin = Math.floor(inst.resources.crystal[0] * mode.rewardMult);
  const crystalMax = Math.floor(inst.resources.crystal[1] * mode.rewardMult);
  const he3Min     = Math.floor(inst.resources.he3[0]     * mode.rewardMult);
  const he3Max     = Math.floor(inst.resources.he3[1]     * mode.rewardMult);

  const body = `
    <!-- Difficulty banner -->
    <div style="background:${mode.color}18;border:1px solid ${mode.color}44;border-radius:6px;
      padding:8px 12px;margin-bottom:14px;display:flex;align-items:center;gap:10px">
      <div style="font-size:1.2rem">${mode.label.split(' ')[0]}</div>
      <div>
        <div style="font-size:0.78rem;font-weight:700;color:${mode.color}">${mode.label}</div>
        <div style="font-size:0.6rem;color:#6a90b8">${mode.desc}</div>
      </div>
      <div style="margin-left:auto;text-align:right">
        <div style="font-size:0.6rem;color:#6a90b8">Blueprint</div>
        <div style="font-size:0.72rem;color:${bpTier.color};font-weight:700">${bpTier.label}</div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">

      <!-- Lijevo: Info -->
      <div>
        <div style="font-size:0.72rem;color:#6a90b8;margin-bottom:8px">INSTANCA INFO</div>
        <div style="font-size:0.68rem;line-height:1.8;font-family:'Share Tech Mono',monospace">
          <div>📋 Tip: <span style="color:${typeInfo.color||'white'}">${typeInfo.name}</span></div>
          <div>💀 Težina: ${diff.label}</div>
          <div>👹 Boss: <span style="color:white">${inst.boss}</span></div>
          <div>⚡ Min moć: ${fmt(getInstanceMinPower(inst))}</div>
          <div>🔋 Energija: ${energyCost} MWh</div>
          <div>✅ Clearova: ${prog.clear_count}</div>
          ${prog.best_rank ? `<div>🏆 Best rank: ${prog.best_rank}</div>` : ''}
        </div>

        <div style="margin-top:12px;font-size:0.72rem;color:#6a90b8;margin-bottom:6px">NAGRADE ×${mode.rewardMult}</div>
        <div style="font-size:0.62rem;font-family:'Share Tech Mono',monospace;line-height:1.6">
          <div>🔩 ${fmt(metalMin)}-${fmt(metalMax)} metal</div>
          <div>💎 ${fmt(crystalMin)}-${fmt(crystalMax)} crystal</div>
          <div>⛽ ${fmt(he3Min)}-${fmt(he3Max)} he3</div>
          <div style="margin-top:4px;color:${bpTier.color}">
            📋 BP ${bpTier.label} (${bpTier.rarity.join('/')})
          </div>
          ${(inst.drops?.guaranteed||[]).length > 0
            ? `<div style="margin-top:4px;color:#00ff88">✅ Garantirano:<br>
               ${inst.drops.guaranteed.map(id => '📋 ' + (typeof getBpName === 'function' ? getBpName(id) : id)).join('<br>')}</div>`
            : ''}
        </div>
      </div>

      <!-- Desno: Flota -->
      <div>
        <div style="font-size:0.72rem;color:#6a90b8;margin-bottom:8px">TVOJA FLOTA</div>
        ${fleetSlots.map(slot => {
          const ship  = getShipById(slot.ship_id);
          const stats = calcSlotStats(slot);
          const cls   = SHIP_CLASSES[getShipClass(slot.ship_id)];
          return `
            <div style="display:flex;justify-content:space-between;align-items:center;
              padding:5px 8px;background:rgba(0,0,0,0.3);border-radius:4px;margin-bottom:4px;
              border-left:3px solid ${cls?.color||'#00d4ff'}">
              <div>
                <div style="font-size:0.72rem;color:${cls?.color||'white'}">${ship?.name||''}</div>
                <div style="font-size:0.6rem;color:#6a90b8">×${fmt(slot.count)}</div>
              </div>
              <div style="text-align:right;font-size:0.6rem;font-family:'Share Tech Mono',monospace;color:#6a90b8">
                <div>HP: ${fmt(stats.hp)}</div>
                <div>DPS: ${fmt(stats.dps)}</div>
              </div>
            </div>`;
        }).join('')}
        <div style="margin-top:8px;font-size:0.65rem;color:#00d4ff;font-family:'Orbitron',monospace">
          UKUPNA MOĆ: ${fmt(playerPower)}
        </div>
      </div>
    </div>

    <!-- Neprijatelji -->
    <div style="background:rgba(255,51,85,0.05);border:1px solid rgba(255,51,85,0.2);
      border-radius:6px;padding:10px;margin-bottom:16px">
      <div style="font-size:0.7rem;color:#ff3355;margin-bottom:6px;font-weight:700">
        👹 NEPRIJATELJI (×${mode.enemyMult} jačina)
      </div>
      <div style="font-size:0.65rem;color:#6a90b8">
        ${inst.enemies.join(', ')} + Boss: ${inst.boss}
      </div>
    </div>

    <div style="font-size:0.72rem;color:#6a90b8;text-align:center">
      ⚠️ Borba je automatska. Rezultat zavisi od moći flote vs neprijatelja.
    </div>
  `;

  openModal(`⚔️ ${inst.name}`, body, [
    {
      label: `⚔️ NAPADNI! (-${energyCost} MWh)`,
      cls:   'btn-r',
      fn: () => { closeModal(); startBattle(inst); }
    },
    { label: 'Odustani', fn: closeModal }
  ]);
}

// ── POKRENI BORBU ──
function startBattle(inst) {
  const fleetSlots  = fleet.filter(s => s !== null);
  if (fleetSlots.length === 0) { toast('⚠️ Flota je prazna!', 'warn'); return; }

  const energyCost  = getInstanceEnergyCost(inst);
  if (R.energy < energyCost) {
    toast(`❌ Nedovoljno energije! Treba ${energyCost} MWh, imaš ${Math.floor(R.energy)} MWh.`, 'err');
    return;
  }

  // Provjeri key cost
  const mode     = INST_DIFFICULTY_MODES[_instDifficultyMode];
  if ((R.instanceKeys || 0) < mode.keyCost) {
    toast(`❌ Nemaš dovoljno ključeva! Treba ${mode.keyCost}🗝️, imaš ${R.instanceKeys||0}.`, 'err');
    return;
  }

  R.energy       -= energyCost;
  R.instanceKeys  = (R.instanceKeys || 0) - mode.keyCost;
  updateResUI();

  const enemyGroups = generateEnemies(inst);
  toast(`⚔️ Borba u toku... (-${energyCost} MWh, -${mode.keyCost}🗝️)`, 'inf');

  setTimeout(() => {
    const battle = simulateBattle(fleetSlots, enemyGroups, inst);
    const progKey = inst.id + '_' + _instDifficultyMode;

    let rewards = null;
    if (battle.status === 'victory') {
      const prog2  = getInstanceProgress(progKey);
      rewards      = calculateRewards(battle, inst, prog2);

      // Skaliraj nagrade po modu
      rewards.metal   = Math.floor(rewards.metal   * mode.rewardMult);
      rewards.crystal = Math.floor(rewards.crystal * mode.rewardMult);
      rewards.he3     = Math.floor(rewards.he3     * mode.rewardMult);

      applyRewards(rewards);

      prog2.completed = true;
      prog2.clear_count++;
      if (rewards.allFound) {
        prog2.bpCompleted = true;
        toast('📋 Svi blueprinti iz ove instance su nađeni!', 'ok');
      }
      if (!window._instProgress) window._instProgress = {};
      window._instProgress[progKey] = prog2;

      addLog(`🏆 ${inst.name} [${mode.label}] završena! +${fmt(rewards.metal)} metal`);
      if (typeof trackDailyInstance  === 'function') trackDailyInstance();
      if (typeof trackWeeklyInstance === 'function') trackWeeklyInstance();
      if (typeof dropRandomArtifactFragment === 'function' && Math.random() < 0.3) {
        dropRandomArtifactFragment(inst.difficulty);
      }
    } else if (battle.status === 'defeat') {
      addLog(`💀 Poraz u ${inst.name} [${mode.label}]. Pokušaj ponovo.`);
    }

    applyPlayerLosses(battle);
    if (typeof showBattleOutcome === 'function') {
      showBattleOutcome(battle, rewards, true);
    } else {
      renderBattleResult(battle, rewards);
    }
    saveGame();
    updateResUI();
  }, 100);
}

// ── INSTANCE PROGRESS (po modu) ──
function getInstanceProgress(progKey) {
  if (!window._instProgress) window._instProgress = {};
  if (!window._instProgress[progKey]) {
    window._instProgress[progKey] = {
      completed:    false,
      clear_count:  0,
      best_rank:    null,
      best_time:    null,
      bpCompleted:  false,
    };
  }
  return window._instProgress[progKey];
}

// ── GENERIŠI NEPRIJATELJE OD PRAVIH BRODOVA ──
function generateEnemies(inst) {
  const mode      = INST_DIFFICULTY_MODES[_instDifficultyMode];
  const diff      = inst.difficulty;
  const playerPower = calcFleetTotalPower();
  const groups    = [];

  // Prikupi sve brodove iz svih klasa
  let allShips = [];
  if (typeof SHIPS !== 'undefined') {
    Object.values(SHIPS).forEach(arr => {
      if (Array.isArray(arr)) allShips.push(...arr);
    });
  }
  
  // Ako nema brodova, vrati prazno
  if (allShips.length === 0) return groups;
  
  // Odredi koliko neprijateljskih grupa (3-6)
  const numGroups = Math.min(6, Math.max(3, Math.ceil(diff / 2) + 1));
  
  // Odaberi brodove za svaku grupu
  for (let i = 0; i < numGroups; i++) {
    // Nasumični brod
    const ship = allShips[Math.floor(Math.random() * allShips.length)];
    if (!ship) continue;
    
    // Izračunaj snagu jednog broda
    const shipPower = (ship.armor_val + (ship.shield || 0) + (ship.structure || 0)) * 5;
    
    // Ciljna snaga za ovu grupu (skalirano na igrača i težinu)
    const targetPower = (playerPower / numGroups) * (0.5 + Math.random() * 0.5) * mode.enemyMult;
    let count = Math.max(1, Math.floor(targetPower / Math.max(1, shipPower)));
    count = Math.min(200, count);
    
    groups.push({
      name:    ship.name,
      count:   count,
      hp:      (ship.armor_val + (ship.shield || 0) + (ship.structure || 0)) * count,
      shield:  (ship.shield || 0) * count,
      dps:     (ship.armor_val * 0.5 + (ship.shield || 0) * 0.3) * count,
      agility: ship.agility || 10,
      speed:   ship.movement || 1,
      armor:   ship.armor || 'Light',
      ship_id: ship.id,
    });
  }
  
  // Dodaj bossa (jači brod)
  if (inst.boss && groups.length < 9) {
    const bossShips = allShips.filter(s => (s.rarity === 'L' || s.rarity === 'E'));
    const boss = bossShips.length > 0 ? bossShips[Math.floor(Math.random() * bossShips.length)] : allShips[0];
    if (boss) {
      const bossPower = (boss.armor_val + (boss.shield || 0) + (boss.structure || 0)) * 8;
      const bossCount = Math.max(1, Math.floor((playerPower * 0.3) / bossPower));
      groups.push({
        name:    inst.boss,
        count:   Math.min(5, bossCount),
        hp:      (boss.armor_val + (boss.shield || 0) + (boss.structure || 0)) * bossCount * 1.5,
        shield:  (boss.shield || 0) * bossCount * 1.5,
        dps:     (boss.armor_val * 0.5 + (boss.shield || 0) * 0.3) * bossCount * 1.2,
        agility: boss.agility || 10,
        speed:   boss.movement || 1,
        armor:   boss.armor || 'Chrome',
        ship_id: boss.id,
        isBoss:  true,
      });
    }
  }
  
  return groups;
}

// ── RANDOM OKLOP ──
function getRandomArmor(diff) {
  const armors = Object.keys(ARMOR_RESISTANCE);
  return armors[Math.floor(Math.random() * armors.length)];
}