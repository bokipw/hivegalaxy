// ============================================================
// HIVE GALAXY — js/systems/buildings.js
// Render i logika zgrada — upgrade, renderBase, energy bilans
// ============================================================

// ── TIMER TICK — provjeri buildQueue svaku sekundu ──
function tickBuildQueue() {
  if (!buildQueue || buildQueue.length === 0) return;
  const now      = Date.now();
  let finished   = false;
  let milestoneHit = null;

  buildQueue = buildQueue.filter(item => {
    if (now < item.finishAt) return true;

    const prevLevel = buildings[item.key].level;
    buildings[item.key].level = item.targetLevel;
    const b = buildingsData[item.key];
    R.score += item.targetLevel * 50;

    // Provjeri milestone
    const milestones = getBuildingMilestones(item.key);
    if (milestones[item.targetLevel]) {
      milestoneHit = { key: item.key, level: item.targetLevel, data: milestones[item.targetLevel] };
    }

    if (item.key === 'ship_factory' && item.targetLevel === 2 && !starterGiven) {
      giveStarterBlueprints();
    }

    toast(`✅ ${b?.name} → Lv.${item.targetLevel} završeno!`, 'ok');
    addLog(`⬆️ ${b?.name} → Lv.${item.targetLevel}`);
    if (typeof trackDailyBuild === 'function') trackDailyBuild();

    // Depot: +1 ključ po levelu, +5 bonus na 25/50/75/100
    if (item.key === 'depot') {
      const depotMilestones = [25, 50, 75, 100];
      const isMilestone = depotMilestones.includes(item.targetLevel);
      const keys = isMilestone ? 5 : 1;
      R.instanceKeys = (R.instanceKeys || 0) + keys;
      if (isMilestone) {
        toast(`🗝️ Depot Lv.${item.targetLevel} — bonus +${keys} ključeva!`, 'ok');
        addLog(`🗝️ Depot milestone Lv.${item.targetLevel}: +${keys} ključeva`);
      } else {
        addLog(`🗝️ Depot Lv.${item.targetLevel}: +1 ključ`);
      }
    }

    finished = true;
    return false;
  });

  if (milestoneHit) {
    const m = milestoneHit.data;
    setTimeout(() => {
      toast(`🎯 MILESTONE! ${buildingsData[milestoneHit.key]?.name} Lv.${milestoneHit.level} — ${m.label}!`, 'ok');
      addLog(`🎯 Milestone dostignut: ${m.label} — ${m.bonus}`);
      openModal(
        `🎯 MILESTONE DOSTIGNUT!`,
        `<div style="text-align:center;padding:16px">
          <div style="font-size:3rem;margin-bottom:10px">${buildingsData[milestoneHit.key]?.icon}</div>
          <div style="font-family:'Orbitron',monospace;font-size:1rem;color:#ffcc44;margin-bottom:6px">
            ${m.label}
          </div>
          <div style="font-size:0.72rem;color:#6a90b8;margin-bottom:12px">
            ${buildingsData[milestoneHit.key]?.name} → Lv.${milestoneHit.level}
          </div>
          <div style="background:rgba(255,204,68,0.1);border:1px solid rgba(255,204,68,0.3);
            border-radius:8px;padding:12px;font-size:0.82rem;color:white">
            ✨ ${m.bonus}
          </div>
        </div>`,
        [{ label: '🎯 Odlično!', cls: 'btn-gold', fn: closeModal }]
      );
    }, 500);
  }

  if (finished) {
    updateResUI();
    renderBase();
    saveGame();
  } else if (buildQueue.length > 0) {
    buildQueue.forEach(item => {
      const timeLeft = Math.max(0, Math.ceil((item.finishAt - Date.now()) / 1000));
      document.querySelectorAll(`[data-building-key="${item.key}"]`).forEach(el => {
        el.textContent = `⏳ ${formatTimer(timeLeft)}`;
      });
    });
  }
}

// ── UPGRADE BUILDING — sa timerom ──
function upgradeBuilding(key) {
  const b = buildingsData[key];
  if (!b) { toast('Greška: zgrada ne postoji!', 'err'); return; }

  const currentLevel = buildings[key]?.level || 0;

  if (buildQueue.some(q => q.key === key)) {
    toast('⏳ Zgrada je već u izgradnji!', 'warn'); return;
  }

  if (currentLevel >= 100) { toast('✅ Zgrada je na MAX nivou!', 'warn'); return; }

  if (key !== 'hq' && key !== 'laboratory') {
    const hqLevel = buildings.hq?.level || 1;
    if (currentLevel >= hqLevel) {
      toast(`🔒 Unapredi HQ na Lv.${currentLevel + 1} prvo!`, 'warn'); return;
    }
  }

  const cost = getBuildingCost(key);
  if (!canAfford(cost)) { toast('❌ Nedovoljno resursa!', 'err'); return; }

  spendResources(cost);

  const timerSec  = getBuildingTimerSec(key);
  const finishAt  = Date.now() + timerSec * 1000;
  const boostCost = getBuildingBoostCost(key);

  buildQueue.push({ key, targetLevel: currentLevel + 1, finishAt, boostCost });

  // Provjeri da li je sljedeći level milestone
  const milestones   = getBuildingMilestones(key);
  const nextMilestone = milestones[currentLevel + 1];
  if (nextMilestone) {
    addLog(`🎯 Gradi se ka milestoneu: ${nextMilestone.label} (Lv.${currentLevel + 1})`);
  }

  updateResUI();
  renderBase();
  addLog(`🔨 ${b.name} u izgradnji → Lv.${currentLevel + 1} (${formatTimer(timerSec)})`);
  toast(`🔨 ${b.name} gradi se ${formatTimer(timerSec)}...`, 'inf');
  saveGame();
}

// ── BOOST BUILDING (BPW) ──
function boostBuilding(key) {
  const item = buildQueue.find(q => q.key === key);
  if (!item) return;
  openModal('⚡ Ubrzaj Izgradnju', `
    <div style="text-align:center;padding:20px">
      <div style="font-size:2rem;margin-bottom:12px">⚡</div>
      <div style="font-size:0.9rem;color:white;margin-bottom:8px">
        Ubrzaj izgradnju ${buildingsData[key]?.name}
      </div>
      <div style="font-size:1.2rem;color:#ffcc44;font-family:'Orbitron',monospace;margin-bottom:16px">
        ${item.boostCost} satoshi BPW
      </div>
      <div style="font-size:0.72rem;color:#6a90b8">BPW token integracija — uskoro dostupno.</div>
    </div>
  `, [{ label: 'Zatvori', fn: closeModal }]);
}

// ── STARTER BLUEPRINTI ──
function giveStarterBlueprints() {
  const starterItems = ['scout_Swift_I', 'w_kinetic_cannon_I', 'eng_basic_I', 'mod_targeting_I'];
  starterItems.forEach(id => { ownedBlueprints[id] = true; });
  starterGiven = true;
  toast('🎁 Starter paket otključan! Swift I, Kinetic Cannon I, Basic Drive I, Targeting I', 'ok');
  addLog('🎁 Starter blueprinti dodani u kolekciju.');
}

// ── RENDER BAZE ──
function renderBase() {
  renderBuildingGrid('baseGrid',   ['hq', 'metal_mine', 'crystal_mine', 'he3_refinery', 'depot', 'ship_factory']);
  renderBuildingGrid('energyGrid', ['solar', 'fusion', 'battery', 'grid']);
  renderBuildingGrid('defenseGrid',['turret', 'missile_bat', 'shield_gen', 'sensor']);
  renderBuildingGrid('specialGrid',['jump_gate', 'laboratory', 'recycler']);
  updateEnergyBalanceCard();
}

// ── RENDER BUILDING GRID ──
function renderBuildingGrid(containerId, keys) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  for (const key of keys) {
    const b = buildingsData[key];
    if (!b) continue;

    const currentLevel = buildings[key]?.level || 0;
    const nextLevel    = currentLevel + 1;
    const cost         = getBuildingCost(key);
    const affordable   = canAfford(cost);
    const hqLevel      = buildings.hq?.level || 1;
    const nameColor    = getBuildingNameColor(currentLevel);

    let extra = '';

    // Metal Rudnik
    if (key === 'metal_mine') {
      const milestoneBonus = getMetalMilestoneBonus();
      const multiplier     = 1 + milestoneBonus / 100;
      const cur   = (currentLevel * 0.01 * multiplier).toFixed(4);
      const next  = (nextLevel   * 0.01 * multiplier).toFixed(4);
      extra = `
        <div class="prod-rate">📈 TRENUTNO: +${cur}/s metal</div>
        <div class="prod-rate" style="color:#00ff88">⬆️ SLJEDEĆI: +${next}/s metal</div>
        ${milestoneBonus > 0 ? `<div style="font-size:0.6rem;color:#ffcc44">✨ Milestone bonus: +${milestoneBonus}%</div>` : ''}
        <div style="font-size:0.62rem;color:#ff6644">⚡ TROŠI: -${currentLevel * 2} → -${nextLevel * 2} MWh/s</div>
        ${renderMilestoneBar(key)}`;
    }

    // Crystal Rudnik
    else if (key === 'crystal_mine') {
      const milestoneBonus = getCrystalMilestoneBonus();
      const multiplier     = 1 + milestoneBonus / 100;
      const cur   = (currentLevel * 0.007 * multiplier).toFixed(4);
      const next  = (nextLevel   * 0.007 * multiplier).toFixed(4);
      extra = `
        <div class="prod-rate">📈 TRENUTNO: +${cur}/s crystal</div>
        <div class="prod-rate" style="color:#00ff88">⬆️ SLJEDEĆI: +${next}/s crystal</div>
        ${milestoneBonus > 0 ? `<div style="font-size:0.6rem;color:#ffcc44">✨ Milestone bonus: +${milestoneBonus}%</div>` : ''}
        <div style="font-size:0.62rem;color:#ff6644">⚡ TROŠI: -${currentLevel * 2} → -${nextLevel * 2} MWh/s</div>
        ${renderMilestoneBar(key)}`;
    }

    // He3 Rafinerija
    else if (key === 'he3_refinery') {
      const milestoneBonus = getHe3MilestoneBonus();
      const multiplier     = 1 + milestoneBonus / 100;
      const cur   = (currentLevel * 0.003 * multiplier).toFixed(4);
      const next  = (nextLevel   * 0.003 * multiplier).toFixed(4);
      extra = `
        <div class="prod-rate">📈 TRENUTNO: +${cur}/s He3</div>
        <div class="prod-rate" style="color:#00ff88">⬆️ SLJEDEĆI: +${next}/s He3</div>
        ${milestoneBonus > 0 ? `<div style="font-size:0.6rem;color:#ffcc44">✨ Milestone bonus: +${milestoneBonus}%</div>` : ''}
        <div style="font-size:0.62rem;color:#ff6644">⚡ TROŠI: -${currentLevel * 3} → -${nextLevel * 3} MWh/s</div>
        ${renderMilestoneBar(key)}`;
    }

    // Energetske zgrade
    else if (b.category === 'energy') {
      const genMap = { solar: 4, fusion: 12, battery: 1, grid: 1 };
      const capMap = { fusion: 1, battery: 97, grid: 1 };
      const curGen  = (genMap[key] || 0) * currentLevel;
      const nextGen = (genMap[key] || 0) * nextLevel;
      const curCap  = (capMap[key] || 0) * currentLevel;
      const nextCap = (capMap[key] || 0) * nextLevel;
      extra = `
        <div class="prod-rate" style="color:#00ff88">⚡ GENERIRA: +${curGen} → +${nextGen} MWh/s</div>`;
      if (capMap[key]) {
        extra += `<div style="font-size:0.62rem;color:#00d4ff">🔋 KAPACITET: +${curCap} → +${nextCap} MWh</div>`;
      }
      extra += `<div style="font-size:0.62rem;color:#6a90b8;margin-top:2px">📊 UKUPNO: ${getEnergyGen()} gen / ${getEnergyDrain()} drain</div>`;
      extra += renderMilestoneBar(key);
    }

    // Odbrambene zgrade
    else if (b.category === 'defense') {
      const drainMap = { shield_gen: 4, missile_bat: 3, turret: 2, sensor: 1 };
      const drain    = drainMap[key] || 2;
      extra = `
        <div class="bonus-line">🛡️ ODBRANA: +${currentLevel * 80} → +${nextLevel * 80}</div>
        <div style="font-size:0.62rem;color:#ff6644">⚡ TROŠI: -${drain * currentLevel} → -${drain * nextLevel} MWh/s</div>
        ${renderMilestoneBar(key)}`;
    }

    // Depot
    else if (key === 'depot') {
      const curCap  = getDepotCapacity();
      const nextCap = Math.floor(220 + (nextLevel - 1) * (22000 - 220) / 99);
      const total   = storageBuffer.metal + storageBuffer.crystal + storageBuffer.he3;
      const pct     = curCap > 0 ? (total / curCap) * 100 : 0;
      extra = `
        <div class="prod-rate">📦 KAPACITET: ${fmt(curCap)} → ${fmt(nextCap)}</div>
        <div class="pbar"><div class="pbar-fill" style="width:${Math.min(100,pct)}%;background:#ffcc44"></div></div>
        <div class="prod-rate" style="color:#ffcc44">📊 ${fmt(Math.floor(total))} / ${fmt(curCap)}</div>
        <button class="btn btn-gold" style="width:100%;margin-top:6px" onclick="pickupResources()">📦 POKUPI RESURSE</button>
        ${renderMilestoneBar(key)}`;
    }

    // Ship Factory
    else if (key === 'ship_factory') {
      const speedBonus      = getShipFactorySpeedBonus();
      const discount        = getShipFactoryDiscount();
      const unlockedClasses = getUnlockedShipClasses();
      const nextUnlock      = Object.entries(buildingsData.ship_factory.unlocks)
        .find(([lvl]) => parseInt(lvl) > currentLevel);
      extra = `
        <div class="prod-rate">🚀 OTKLJUČANE KLASE: ${unlockedClasses.length > 0 ? unlockedClasses.join(', ') : 'Nijedna'}</div>
        <div class="prod-rate" style="color:#00ff88">⚡ BRZINA GRADNJE: +${speedBonus}%</div>
        <div class="prod-rate" style="color:#ffcc44">💰 POPUST: -${discount}%</div>
        ${nextUnlock ? `<div style="font-size:0.62rem;color:#6a90b8">🔓 Lv.${nextUnlock[0]}: ${nextUnlock[1].join(', ')}</div>` : ''}
        <div style="font-size:0.62rem;color:#ff6644">⚡ TROŠI: -${currentLevel * 4} → -${nextLevel * 4} MWh/s</div>
        ${renderMilestoneBar(key)}`;
    }

    // HQ
    else if (key === 'hq') {
      const buildSpeedBonus = (() => {
        const m = getBuildingMilestones('hq');
        let b   = 0;
        Object.entries(m).forEach(([mlvl, data]) => {
          if (currentLevel >= parseInt(mlvl) && data.buildSpeedBonus) b = Math.max(b, data.buildSpeedBonus);
        });
        return b;
      })();
      const costReduction = (() => {
        const m = getBuildingMilestones('hq');
        let r   = 0;
        Object.entries(m).forEach(([mlvl, data]) => {
          if (currentLevel >= parseInt(mlvl) && data.cmdProdBonus) r = Math.max(r, data.cmdProdBonus);
        });
        return r;
      })();
      extra = `
        <div class="prod-rate">🏛️ MAX nivo zgrada: ${currentLevel}</div>
        <div class="prod-rate" style="color:#00ff88">⬆️ SLJEDEĆI: max nivo ${nextLevel}</div>
        ${buildSpeedBonus > 0 ? `<div style="font-size:0.6rem;color:#ffcc44">⚡ Build speed: -${buildSpeedBonus}%</div>` : ''}
        ${costReduction > 0 ? `<div style="font-size:0.6rem;color:#ffcc44">💰 Cijena zgrada: -${costReduction}%</div>` : ''}
        ${renderMilestoneBar(key)}`;
    }

    // Specijalne zgrade
    else if (b.category === 'special') {
      if (key === 'jump_gate') {
        extra = `
          <div class="prod-rate">🌀 DOMET: ${currentLevel} sistem${currentLevel !== 1 ? 'a' : ''}</div>
          <div class="prod-rate" style="color:#aa44ff">🪐 MAX KOLONIJA: ${getMaxColonies()}</div>
          <div style="font-size:0.62rem;color:#ff6644">⚡ TROŠI: -${currentLevel * 5} → -${nextLevel * 5} MWh/s</div>
          ${renderMilestoneBar(key)}`;
      } else if (key === 'laboratory') {
        const discount = getResearchDiscount();
        extra = `
          <div class="prod-rate">🔬 MAX RESEARCH: Lv.${currentLevel}</div>
          ${discount > 0 ? `<div style="font-size:0.6rem;color:#ffcc44">💰 Research popust: -${discount}%</div>` : ''}
          <div style="font-size:0.62rem;color:#ff6644">⚡ TROŠI: -${currentLevel * 4} → -${nextLevel * 4} MWh/s</div>
          ${renderMilestoneBar(key)}`;
      } else if (key === 'recycler') {
        const rate = getRecycleRate();
        extra = `
          <div class="prod-rate">♻️ POVRAT: ${rate.toFixed(1)}%</div>
          <div style="font-size:0.62rem;color:#ff6644">⚡ TROŠI: -${currentLevel * 3} → -${nextLevel * 3} MWh/s</div>
          ${renderMilestoneBar(key)}`;
      }
    }

    // Timer
    const inQueue   = buildQueue.some(q => q.key === key);
    const queueItem = buildQueue.find(q => q.key === key);
    const timeLeft  = queueItem ? Math.max(0, Math.ceil((queueItem.finishAt - Date.now()) / 1000)) : 0;

    const isMaxed   = currentLevel >= 100;
    const isLocked  = key !== 'hq' && key !== 'laboratory' && currentLevel >= hqLevel;
    let btnText     = '⬆️ Nadogradi';
    let btnDisabled = !affordable;

    // Provjeri je li sljedeći level milestone
    const milestones    = getBuildingMilestones(key);
    const isMilestoneNext = !!milestones[nextLevel];

    if (isLocked)  { btnText = `🔒 HQ Lv${hqLevel + 1} potreban`; btnDisabled = true; }
    if (isMaxed)   { btnText = '✅ MAX';                             btnDisabled = true; }
    if (inQueue)   { btnText = `⏳ ${formatTimer(timeLeft)}`;        btnDisabled = true; }
    if (!btnDisabled && isMilestoneNext) btnText = `🎯 Nadogradi → MILESTONE!`;

    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <div class="card-icon">${b.icon}</div>
      <div class="card-title" style="color:${nameColor};text-align:center">${b.name}</div>
      <div class="lv-badge" style="display:block;text-align:center;margin:4px 0">Lv. ${currentLevel} / 100</div>
      ${extra}
      <div class="cost-block" style="text-align:center;margin-top:8px">
        <span class="${affordable ? 'ck' : 'cn'}">🔩 ${fmt(cost.metal)}</span>
        <span class="${affordable ? 'ck' : 'cn'}"> 💎 ${fmt(cost.crystal)}</span>
        <span class="${affordable ? 'ck' : 'cn'}"> ⛽ ${fmt(cost.he3)}</span>
      </div>
      <button class="btn ${!btnDisabled && !inQueue ? (isMilestoneNext ? 'btn-gold' : 'btn-g') : ''}"
        style="width:100%;margin-top:8px"
        data-building-key="${inQueue ? key : ''}"
        onclick="${inQueue ? `boostBuilding('${key}')` : `upgradeBuilding('${key}')`}"
        ${btnDisabled && !inQueue ? 'disabled' : ''}>
        ${inQueue ? `⏳ ${formatTimer(timeLeft)}` : btnText}
      </button>
      ${inQueue ? `<button class="btn btn-gold" style="width:100%;margin-top:4px;font-size:0.68rem"
        onclick="boostBuilding('${key}')">⚡ Ubrzaj — ${getBuildingBoostCost(key)} BPW</button>` : ''}
    `;
    container.appendChild(div);
  }
}

// ── ENERGETSKI BILANS CARD ──
function updateEnergyBalanceCard() {
  const gen   = getEnergyGen();
  const drain = getEnergyDrain();
  const max   = getEnergyMax();
  const net   = gen - drain;
  const cur   = Math.floor(R.energy);
  const pct   = max > 0 ? (cur / max) * 100 : 0;
  const el    = document.getElementById('energyBalanceCard');
  if (!el) return;

  el.innerHTML = `
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;text-align:center">
      <div>
        <div style="font-size:0.65rem;color:#6a90b8;margin-bottom:4px">POHRANA</div>
        <div style="font-size:1.4rem;font-family:'Orbitron',monospace;color:#00d4ff">${cur}</div>
        <div style="font-size:0.65rem;color:#6a90b8">/ ${max} MWh</div>
        <div class="pbar" style="margin-top:6px"><div class="pbar-fill" style="width:${pct}%"></div></div>
      </div>
      <div>
        <div style="font-size:0.65rem;color:#6a90b8;margin-bottom:4px">GENERACIJA</div>
        <div style="font-size:1.4rem;font-family:'Orbitron',monospace;color:#00ff88">${gen}</div>
        <div style="font-size:0.65rem;color:#6a90b8">MWh/s</div>
      </div>
      <div>
        <div style="font-size:0.65rem;color:#6a90b8;margin-bottom:4px">POTROŠNJA</div>
        <div style="font-size:1.4rem;font-family:'Orbitron',monospace;color:#ff6644">${drain}</div>
        <div style="font-size:0.65rem;color:#6a90b8">MWh/s</div>
      </div>
      <div>
        <div style="font-size:0.65rem;color:#6a90b8;margin-bottom:4px">NETO</div>
        <div style="font-size:1.4rem;font-family:'Orbitron',monospace;color:${net >= 0 ? '#00ff88' : '#ff6644'}">${net >= 0 ? '+' : ''}${net}</div>
        <div style="font-size:0.65rem;color:#6a90b8">MWh/s</div>
      </div>
    </div>
    <div style="margin-top:12px;font-size:0.78rem;padding:8px 12px;border-radius:6px;
      ${net < 0
        ? 'background:rgba(255,51,85,0.1);border:1px solid rgba(255,51,85,0.3);color:#ff3355'
        : cur < max * 0.2
          ? 'background:rgba(255,150,0,0.1);border:1px solid rgba(255,150,0,0.3);color:#ff8833'
          : 'display:none'}">
      ${net < 0
        ? `⚠️ <strong>Deficit energije: ${net} MWh/s!</strong> Produkcija pada na ${Math.round(getEnergyPenalty() * 100)}%.`
        : cur < max * 0.2
          ? `⚡ Niska energija (${cur}/${max} MWh). Izgradi više energetskih zgrada.`
          : ''}
    </div>
  `;
}

// ── RENDER SHIP FACTORY PANEL ──
function renderShipFactory() {
  const el = document.getElementById('shipFactoryCard');
  if (!el) return;

  const level       = buildings.ship_factory?.level || 1;
  const speedBonus  = getShipFactorySpeedBonus();
  const discount    = getShipFactoryDiscount();
  const unlocked    = getUnlockedShipClasses();
  const cost        = getBuildingCost('ship_factory');
  const affordable  = canAfford(cost);
  const hqLevel     = buildings.hq?.level || 1;
  const isLocked    = level >= hqLevel;
  const isMaxed     = level >= 100;
  const nameColor   = getBuildingNameColor(level);
  const inQueue     = buildQueue.some(q => q.key === 'ship_factory');
  const queueItem   = buildQueue.find(q => q.key === 'ship_factory');
  const timeLeft    = queueItem ? Math.max(0, Math.ceil((queueItem.finishAt - Date.now()) / 1000)) : 0;
  const nextMilestone = getNextMilestone('ship_factory');

  el.innerHTML = `
    <div class="card">
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px">
        <div style="font-size:3rem">🏭</div>
        <div style="flex:1">
          <div style="font-size:1rem;font-weight:700;color:${nameColor}">Ship Factory</div>
          <div class="lv-badge">Lv. ${level} / 100</div>
        </div>
        ${nextMilestone ? `<div style="font-size:0.62rem;color:#ffcc44;text-align:right">
          🎯 ${nextMilestone - level} lv do milestonea
        </div>` : ''}
      </div>

      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px;text-align:center">
        <div style="background:rgba(0,0,0,0.3);padding:8px;border-radius:6px">
          <div style="font-size:0.6rem;color:#6a90b8;margin-bottom:4px">BRZINA</div>
          <div style="font-size:1rem;font-family:'Orbitron',monospace;color:#00ff88">+${speedBonus}%</div>
        </div>
        <div style="background:rgba(0,0,0,0.3);padding:8px;border-radius:6px">
          <div style="font-size:0.6rem;color:#6a90b8;margin-bottom:4px">POPUST</div>
          <div style="font-size:1rem;font-family:'Orbitron',monospace;color:#ffcc44">-${discount}%</div>
        </div>
        <div style="background:rgba(0,0,0,0.3);padding:8px;border-radius:6px">
          <div style="font-size:0.6rem;color:#6a90b8;margin-bottom:4px">KLASE</div>
          <div style="font-size:1rem;font-family:'Orbitron',monospace;color:#aa44ff">${unlocked.length}</div>
        </div>
      </div>

      ${renderMilestoneBar('ship_factory')}

      <div class="cost-block" style="margin:12px 0">
        <span class="${affordable ? 'ck' : 'cn'}">🔩 ${fmt(cost.metal)}</span>
        <span class="${affordable ? 'ck' : 'cn'}"> 💎 ${fmt(cost.crystal)}</span>
        <span class="${affordable ? 'ck' : 'cn'}"> ⛽ ${fmt(cost.he3)}</span>
      </div>

      <button class="btn ${!isLocked && !isMaxed && !inQueue && affordable ? 'btn-g' : ''}"
        style="width:100%" data-building-key="${inQueue ? 'ship_factory' : ''}"
        onclick="${inQueue ? `boostBuilding('ship_factory')` : `upgradeBuilding('ship_factory')`}"
        ${isLocked || isMaxed ? 'disabled' : ''}>
        ${isMaxed ? '✅ MAX' : isLocked ? `🔒 HQ Lv${level + 1}` : inQueue ? `⏳ ${formatTimer(timeLeft)}` : '⬆️ Nadogradi'}
      </button>
      ${inQueue ? `<button class="btn btn-gold" style="width:100%;margin-top:4px;font-size:0.68rem"
        onclick="boostBuilding('ship_factory')">⚡ Ubrzaj — ${getBuildingBoostCost('ship_factory')} BPW</button>` : ''}
    </div>
  `;

  renderShipBuildGrid();
}

// ── SLJEDEĆI MILESTONE ZA SHIP FACTORY ──
function getNextShipFactoryMilestone(level) {
  const milestones = buildingsData.ship_factory.milestones;
  const next       = Object.keys(milestones).map(Number).sort((a, b) => a - b).find(lvl => lvl > level);
  if (!next) return `<div style="font-size:0.72rem;color:#ffcc44">👑 MAX nivo dostignut!</div>`;
  const data = milestones[next];
  return `<div style="font-size:0.72rem;color:#6a90b8">
    Lv.${next}: <span style="color:#ffcc44">+${data.speedBonus}% brzina</span>,
    <span style="color:#ffcc44">-${data.discountBonus}% cijena</span>
    <span style="color:#6a90b8">(još ${next - level} levela)</span>
  </div>`;
}

// ── RENDER SHIP BUILD GRID ──
function renderShipBuildGrid() {
  const el = document.getElementById('shipBuildGrid');
  if (!el) return;

  if (shipDesigns.length === 0) {
    el.innerHTML = `
      <div class="card" style="text-align:center;color:#6a90b8;padding:20px">
        📋 Nemaš sačuvanih dizajna.<br>
        <span style="font-size:0.72rem">Idi u <strong style="color:#00d4ff">Ship Designer</strong> i kreiraj dizajn broda.</span>
        <br><br>
        <button class="btn btn-gold" onclick="showPanel('designer')">🔧 Otvori Designer</button>
      </div>`;
    return;
  }

  // Sigurnosna funkcija ako calcDesignStats nije dostupan (iz designer.js)
  const getDesignStats = typeof calcDesignStats === 'function' ? calcDesignStats : function(design) {
    const s = getShipById(design.ship_id);
    let dps = 0;
    for (let i = 1; i <= 4; i++) {
      const wid = design[`weapon_${i}`];
      if (wid) {
        const wpn = getWeaponById(wid);
        if (wpn) dps += wpn.dps;
      }
    }
    let shield = s?.shield || 0;
    for (let i = 1; i <= 3; i++) {
      const sid = design[`shield_${i}`];
      if (sid) {
        const sh = getShieldById(sid);
        if (sh) shield += sh.shield;
      }
    }
    let speed = s?.movement || 0;
    const engineId = design.engine_1;
    if (engineId) {
      const eng = getEngineById(engineId);
      if (eng && eng.speed) speed += eng.speed;
    }
    const hp = (s?.armor_val || 0) + shield + (s?.structure || 0);
    return { shield, hp, speed, dps };
  };

  el.innerHTML = '<div class="grid-3">' + shipDesigns.map(d => {
    const ship = getShipById(d.ship_id);
    if (!ship) return '';
    const cls = SHIP_CLASSES[getShipClass(d.ship_id)];
    const cost = getShipBuildCost(ship);
    const affordable = canAfford(cost);
    const hangarCount = hangar.find(h => h.design_id === d.id)?.count || 0;
    const stats = getDesignStats(d);

    // Prikaz opreme (kratki)
    let weapons = [];
    for (let i = 1; i <= 4; i++) {
      if (d[`weapon_${i}`]) weapons.push(d[`weapon_${i}`]);
    }
    let shields = [];
    for (let i = 1; i <= 3; i++) {
      if (d[`shield_${i}`]) shields.push(d[`shield_${i}`]);
    }

    return `
      <div class="card" style="border-color:${cls?.color || '#00d4ff'}33">
        <div style="font-size:0.82rem;font-weight:700;color:${cls?.color || 'white'};margin-bottom:2px">${d.name}</div>
        <div style="font-size:0.65rem;color:#6a90b8;margin-bottom:8px">${ship.name} · ${cls?.name || ''}</div>
        
        <!-- Statistike jednog broda (izračunate sa opremom) -->
        <div style="background:rgba(0,0,0,0.2);border-radius:4px;padding:4px 6px;margin-bottom:8px;font-size:0.6rem;font-family:'Share Tech Mono',monospace">
          🛡️${stats.shield} ❤️${stats.hp} 💨${stats.speed} ⚔️${stats.dps}
        </div>
        
        <!-- Oprema (kratki prikaz) -->
        <div style="font-size:0.6rem;color:#6a90b8;margin-bottom:8px">
          ${weapons.length ? '⚔️ ' + weapons.join(', ') : ''}
          ${weapons.length && shields.length ? ' · ' : ''}
          ${shields.length ? '🛡️ ' + shields.join(', ') : ''}
          ${d.engine_1 ? ' · 🔩 ' + d.engine_1 : ''}
        </div>
        
        <div style="font-size:0.65rem;color:#6a90b8;margin-bottom:8px">
          🏠 U hangaru: <strong style="color:white">${fmt(hangarCount)}</strong>
        </div>
        <div class="cost-block" style="margin-bottom:8px">
          <div style="font-size:0.6rem;color:#6a90b8">Cijena po brodu:</div>
          <span class="${affordable ? 'ck' : 'cn'}">🔩${fmt(cost.metal)}</span>
          <span class="${affordable ? 'ck' : 'cn'}"> 💎${fmt(cost.crystal)}</span>
          <span class="${affordable ? 'ck' : 'cn'}"> ⛽${fmt(cost.he3)}</span>
        </div>
        <button class="btn btn-gold" style="width:100%;font-size:0.72rem" onclick="openBuildModal('${d.id}')">
          🏭 Gradi
        </button>
      </div>`;
  }).join('') + '</div>';
}

// ── RENDER DEPOT PANEL ──
function renderDepot() {
  const el       = document.getElementById('depotCard');
  if (!el) return;

  const level    = buildings.depot?.level || 1;
  const cap      = getDepotCapacity();
  const total    = Math.floor(storageBuffer.metal + storageBuffer.crystal + storageBuffer.he3);
  const pct      = cap > 0 ? Math.min(100, (total / cap) * 100) : 0;
  const cost     = getBuildingCost('depot');
  const affordable = canAfford(cost);
  const hqLevel  = buildings.hq?.level || 1;
  const isLocked = level >= hqLevel;
  const isMaxed  = level >= 100;
  const nameColor = getBuildingNameColor(level);
  const nextCap  = Math.floor(220 + (level) * (22000 - 220) / 99);
  const barColor = pct >= 90 ? '#ff3355' : pct >= 70 ? '#ffcc44' : '#00ff88';
  const inQueue  = buildQueue.some(q => q.key === 'depot');
  const queueItem = buildQueue.find(q => q.key === 'depot');
  const timeLeft  = queueItem ? Math.max(0, Math.ceil((queueItem.finishAt - Date.now()) / 1000)) : 0;

  el.innerHTML = `
    <div class="card">
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px">
        <div style="font-size:3rem">📦</div>
        <div style="flex:1">
          <div style="font-size:1rem;font-weight:700;color:${nameColor}">Depot</div>
          <div class="lv-badge">Lv. ${level} / 100</div>
        </div>
      </div>

      <div style="margin-bottom:16px">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px">
          <span style="font-size:0.72rem;color:#6a90b8">Popunjenost</span>
          <span style="font-size:0.72rem;color:${barColor}">${Math.floor(pct)}%</span>
        </div>
        <div class="pbar" style="height:10px">
          <div class="pbar-fill" style="width:${pct}%;background:${barColor}"></div>
        </div>
        <div style="font-size:0.68rem;color:#6a90b8;margin-top:4px">${fmt(total)} / ${fmt(cap)} resursa</div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:16px;text-align:center">
        <div>
          <div style="font-size:0.65rem;color:#6a90b8">🔩 METAL</div>
          <div style="font-size:0.9rem;color:white;font-family:'Share Tech Mono',monospace">${fmt(Math.floor(storageBuffer.metal))}</div>
        </div>
        <div>
          <div style="font-size:0.65rem;color:#6a90b8">💎 CRYSTAL</div>
          <div style="font-size:0.9rem;color:white;font-family:'Share Tech Mono',monospace">${fmt(Math.floor(storageBuffer.crystal))}</div>
        </div>
        <div>
          <div style="font-size:0.65rem;color:#6a90b8">⛽ HE3</div>
          <div style="font-size:0.9rem;color:white;font-family:'Share Tech Mono',monospace">${fmt(Math.floor(storageBuffer.he3))}</div>
        </div>
      </div>

      ${pct >= 90 ? `<div style="background:rgba(255,51,85,0.1);border:1px solid rgba(255,51,85,0.3);color:#ff3355;padding:8px 12px;border-radius:6px;font-size:0.78rem;margin-bottom:12px">⚠️ Depot je skoro pun! Pokupi resurse.</div>` : ''}

      <button class="btn btn-gold" style="width:100%;margin-bottom:8px;font-size:0.85rem" onclick="pickupResources()">
        📦 POKUPI RESURSE
      </button>

      ${renderMilestoneBar('depot')}

      <div style="font-size:0.68rem;color:#6a90b8;margin:8px 0 12px">
        Sljedeći nivo kapacitet: ${fmt(nextCap)} resursa
      </div>

      <div class="cost-block" style="margin-bottom:8px">
        <span class="${affordable ? 'ck' : 'cn'}">🔩 ${fmt(cost.metal)}</span>
        <span class="${affordable ? 'ck' : 'cn'}"> 💎 ${fmt(cost.crystal)}</span>
        <span class="${affordable ? 'ck' : 'cn'}"> ⛽ ${fmt(cost.he3)}</span>
      </div>
      <button class="btn ${!isLocked && !isMaxed && !inQueue && affordable ? 'btn-g' : ''}" style="width:100%"
        onclick="${inQueue ? `boostBuilding('depot')` : `upgradeBuilding('depot')`}"
        ${isLocked || isMaxed ? 'disabled' : ''}>
        ${isMaxed ? '✅ MAX' : isLocked ? `🔒 HQ Lv${level + 1} potreban` : inQueue ? `⏳ ${formatTimer(timeLeft)}` : '⬆️ Nadogradi Depot'}
      </button>
    </div>
  `;
}


// ── RENDER RECYCLER PANELA ──
function renderRecycler() {
  const lvl       = buildings.recycler?.level || 0;
  const rate      = getRecycleRate();
  const nameColor = getBuildingNameColor(lvl);
  const inQueue   = buildQueue.find(q => q.key === 'recycler');

  const queueHTML = recycleQueue.length === 0
    ? '<div style="text-align:center;color:#6a90b8;padding:12px;font-size:0.72rem">Nema brodova u recycle redu.</div>'
    : recycleQueue.map((item, idx) => {
        const ship = getShipById(item.ship_id);
        const res  = ship ? getRecycleResources(ship, item.count) : { metal:0, crystal:0, he3:0 };
        return `
          <div style="display:flex;justify-content:space-between;align-items:center;
            padding:8px 10px;background:rgba(0,0,0,0.3);border-radius:6px;margin-bottom:6px;
            border-left:3px solid #ff8833">
            <div>
              <div style="font-size:0.78rem;color:white">${item.designName || ship?.name || item.ship_id}</div>
              <div style="font-size:0.62rem;color:#6a90b8">×${fmt(item.count)} brodova</div>
            </div>
            <div style="text-align:right;font-size:0.62rem;font-family:'Share Tech Mono',monospace;color:#00ff88">
              🔩${fmt(res.metal)} 💎${fmt(res.crystal)} ⛽${fmt(res.he3)}
            </div>
            <button class="btn btn-r" style="font-size:0.6rem;padding:2px 6px;margin-left:8px"
              onclick="removeFromRecycleQueue(${idx})">✕</button>
          </div>`;
      }).join('');

  const totalRes = recycleQueue.reduce((acc, item) => {
    const ship = getShipById(item.ship_id);
    if (!ship) return acc;
    const r = getRecycleResources(ship, item.count);
    acc.metal   += r.metal;
    acc.crystal += r.crystal;
    acc.he3     += r.he3;
    return acc;
  }, { metal:0, crystal:0, he3:0 });

  const el = document.getElementById('recyclerContent');
  if (!el) return;

  el.innerHTML = `
    <div class="card" style="margin-bottom:16px;border-color:#ff883344">
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:12px">
        <div style="font-size:3rem">♻️</div>
        <div style="flex:1">
          <div style="font-size:1rem;font-weight:700;color:${nameColor}">Recycler</div>
          <div class="lv-badge">Lv. ${lvl} / 100</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:0.65rem;color:#6a90b8">Povrat resursa</div>
          <div style="font-size:1.5rem;font-family:'Orbitron',monospace;color:#ff8833">${rate.toFixed(1)}%</div>
        </div>
      </div>
      ${renderMilestoneBar('recycler')}
      ${lvl === 0 ? '<div style="color:#ff3355;font-size:0.78rem;margin-top:8px">⚠️ Izgradi Recycler zgradu da koristiš reciklažu.</div>' : ''}
    </div>

    <div class="card" style="margin-bottom:16px">
      <div style="font-size:0.82rem;font-weight:700;color:#ff8833;margin-bottom:10px">📦 DODAJ IZ HANGARA</div>
      ${hangar.length === 0
        ? '<div style="font-size:0.72rem;color:#6a90b8">Hangar je prazan.</div>'
        : '<div class="grid-3">' + hangar.map((h, idx) => {
            const design    = shipDesigns.find(d => d.id === h.design_id);
            const ship      = design ? getShipById(design.ship_id) : null;
            const res       = ship ? getRecycleResources(ship, h.count) : { metal:0, crystal:0, he3:0 };
            const alreadyIn = recycleQueue.some(r => r.design_id === h.design_id);
            return `
              <div class="card" style="border-color:rgba(255,136,51,0.3)">
                <div style="font-size:0.78rem;font-weight:700;color:white;margin-bottom:4px">
                  ${design?.name || ship?.name || '?'}
                </div>
                <div style="font-size:0.62rem;color:#6a90b8;margin-bottom:6px">×${fmt(h.count)} u hangaru</div>
                <div style="font-size:0.6rem;color:#6a90b8;margin-bottom:6px">
                  💰 Povrat: 🔩${fmt(res.metal)} 💎${fmt(res.crystal)} ⛽${fmt(res.he3)}
                </div>
                <div style="display:flex;gap:4px;align-items:center;margin-bottom:6px">
                  <input id="recycleCount_${idx}" type="number" min="1" max="${h.count}" value="${h.count}"
                    style="flex:1;background:#070c1a;border:1px solid rgba(255,136,51,0.3);
                      color:white;padding:4px 6px;border-radius:4px;font-size:0.72rem">
                </div>
                <button class="btn ${alreadyIn?'':'btn-gold'}" style="width:100%;font-size:0.65rem"
                  onclick="addToRecycleQueue('${h.design_id}', ${idx})"
                  ${alreadyIn || lvl === 0 ? 'disabled' : ''}>
                  ${alreadyIn ? '✅ Dodano' : '♻️ Dodaj u red'}
                </button>
              </div>`;
          }).join('') + '</div>'}
    </div>

    <div class="card">
      <div style="font-size:0.82rem;font-weight:700;color:#ff8833;margin-bottom:10px">
        ♻️ RECYCLE RED (${recycleQueue.length} stavki)
      </div>
      ${queueHTML}
      ${recycleQueue.length > 0 ? `
        <div style="background:rgba(0,255,136,0.05);border:1px solid rgba(0,255,136,0.2);
          border-radius:6px;padding:10px;margin-top:10px;margin-bottom:10px">
          <div style="font-size:0.65rem;color:#6a90b8;margin-bottom:4px">UKUPNI POVRAT:</div>
          <div style="font-size:0.78rem;font-family:'Share Tech Mono',monospace;color:#00ff88">
            🔩${fmt(totalRes.metal)} 💎${fmt(totalRes.crystal)} ⛽${fmt(totalRes.he3)}
          </div>
        </div>
        <button class="btn btn-g" style="width:100%;font-size:0.82rem" onclick="recycleAll()">♻️ Recikliraj sve</button>
      ` : ''}
    </div>
  `;
}

// ── RECYCLE QUEUE FUNKCIJE ──
function addToRecycleQueue(designId, hangarIdx) {
  const h      = hangar.find(h => h.design_id === designId);
  const design = shipDesigns.find(d => d.id === designId);
  if (!h || !design) return;

  const countInput = document.getElementById(`recycleCount_${hangarIdx}`);
  const count      = Math.min(h.count, Math.max(1, parseInt(countInput?.value || h.count)));

  if (recycleQueue.some(r => r.design_id === designId)) {
    toast('⚠️ Već dodano u red!', 'warn'); return;
  }

  recycleQueue.push({ design_id: designId, designName: design.name, ship_id: design.ship_id, count });
  toast(`♻️ ${design.name} ×${count} dodano u recycle red.`, 'ok');
  saveGame();
  renderRecycler();
}

function removeFromRecycleQueue(idx) {
  recycleQueue.splice(idx, 1);
  saveGame();
  renderRecycler();
}

function recycleAll() {
  if (recycleQueue.length === 0) return;
  if (buildings.recycler?.level === 0) { toast('❌ Izgradi Recycler zgradu!', 'err'); return; }

  let totalMetal = 0, totalCrystal = 0, totalHe3 = 0;

  recycleQueue.forEach(item => {
    const ship = getShipById(item.ship_id);
    if (!ship) return;
    const res = getRecycleResources(ship, item.count);
    totalMetal   += res.metal;
    totalCrystal += res.crystal;
    totalHe3     += res.he3;

    const hEntry = hangar.find(h => h.design_id === item.design_id);
    if (hEntry) {
      hEntry.count -= item.count;
      if (hEntry.count <= 0) hangar.splice(hangar.indexOf(hEntry), 1);
    }
  });

  R.metal   += totalMetal;
  R.crystal += totalCrystal;
  R.he3     += totalHe3;
  recycleQueue = [];

  updateResUI();
  if (typeof updateHangarStatus === 'function') updateHangarStatus();
  saveGame();
  renderRecycler();

  toast(`♻️ Reciklirano! +🔩${fmt(totalMetal)} +💎${fmt(totalCrystal)} +⛽${fmt(totalHe3)}`, 'ok');
  addLog(`♻️ Recikliranje završeno: +${fmt(totalMetal)} metal, +${fmt(totalCrystal)} crystal, +${fmt(totalHe3)} he3`);
}