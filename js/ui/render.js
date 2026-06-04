// ============================================================
// HIVE GALAXY — js/ui/render.js
// UI render funkcije — resursi, navigacija, log, modal
// ============================================================

// ── FORMAT BROJEVA ──
function fmt(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return Math.floor(n).toString();
}

// ── UPDATE RESOURCE BAR ──
function updateResUI() {
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

  set('rMetal',   fmt(R.metal));
  set('rCrystal', fmt(R.crystal));
  set('rHe3',     fmt(R.he3));
  set('rEnergy',  Math.floor(R.energy));
  set('rScore',   fmt(R.score));
  set('rKeys',    R.instanceKeys || 0);
  // HIVE tokeni
  set('hBCM',     R.bcm     || 0);
  set('hBoCrypto',R.bocrypto|| 0);
  set('hBPW',     R.spCard  || 0);

  const prod = getProd();
  set('rMetalProd',   `+${(prod.metal).toFixed(3)}/s`);
  set('rCrystalProd', `+${(prod.crystal).toFixed(3)}/s`);
  set('rHe3Prod',     `+${(prod.he3).toFixed(3)}/s`);

  set('cmdLevel',   commander.level);
  set('cmdExp',     fmt(commander.exp));
  set('cmdNextExp', fmt(commander.nextExp));
  const expBar = document.getElementById('expBar');
  if (expBar) expBar.style.width = Math.min(100, (commander.exp / commander.nextExp) * 100) + '%';

  // Komandir titula
  if (typeof getCommanderTitle === 'function') {
    const titleData = getCommanderTitle();
    const titleEl   = document.getElementById('cmdTitle');
    if (titleEl) {
      titleEl.textContent = titleData.title;
      titleEl.style.color = titleData.color;
    }
  }

  set('fleetPowerDisplay', fmt(calcFleetTotalPower()));

  updateDepotStatus();
  updateFormationStatus();
  if (typeof updateHangarStatus === 'function') updateHangarStatus();
}

// ── DEPOT STATUS (desni panel) ──
function updateDepotStatus() {
  const el = document.getElementById('depotStatus');
  if (!el) return;
  const cap   = getDepotCapacity();
  const total = storageBuffer.metal + storageBuffer.crystal + storageBuffer.he3;
  const pct   = cap > 0 ? Math.min(100, (total / cap) * 100) : 0;
  const color = pct >= 90 ? '#ff3355' : pct >= 70 ? '#ffcc44' : '#00ff88';
  el.innerHTML = `
    <div style="font-size:0.72rem;color:${color};margin-bottom:4px">
      ${pct >= 90 ? '⚠️ Skoro pun!' : pct >= 70 ? '📦 Punjenje...' : '✅ OK'}
    </div>
    <div class="pbar"><div class="pbar-fill" style="width:${pct}%;background:${color}"></div></div>
    <div style="font-size:0.65rem;color:#6a90b8;margin-top:4px">${fmt(Math.floor(total))} / ${fmt(cap)}</div>
    ${pct >= 70 ? `<button class="btn btn-gold" style="width:100%;margin-top:6px;font-size:0.72rem" onclick="pickupResources()">📦 Pokupi</button>` : ''}
  `;
}

// ── FORMACIJA STATUS (desni panel) ──
function updateFormationStatus() {
  const el = document.getElementById('formationStatus');
  if (!el) return;
  if (typeof getActiveFormation !== 'function') {
    el.innerHTML = '<div style="font-size:0.7rem;color:#6a90b8">—</div>';
    return;
  }
  const form  = getActiveFormation();
  const bonus = typeof getFormationBonus === 'function' ? getFormationBonus() : {};
  const hasBonus = Object.values(bonus).some(v => v !== 0);
  el.innerHTML = `
    <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
      <span style="font-size:1rem">${form.icon}</span>
      <span style="font-size:0.72rem;color:${form.color};font-weight:700">${form.name}</span>
    </div>
    ${hasBonus ? `<div style="display:flex;flex-wrap:wrap;gap:3px">
      ${bonus.dps     ? `<span style="font-size:0.58rem;color:#ff4444;background:rgba(255,68,68,0.1);border-radius:3px;padding:1px 4px">⚔️+${bonus.dps}%</span>` : ''}
      ${bonus.shield  ? `<span style="font-size:0.58rem;color:#4488ff;background:rgba(68,136,255,0.1);border-radius:3px;padding:1px 4px">🛡️${bonus.shield > 0 ? '+' : ''}${bonus.shield}%</span>` : ''}
      ${bonus.armor   ? `<span style="font-size:0.58rem;color:#ff8833;background:rgba(255,136,51,0.1);border-radius:3px;padding:1px 4px">🔩+${bonus.armor}%</span>` : ''}
      ${bonus.agility ? `<span style="font-size:0.58rem;color:#00ff88;background:rgba(0,255,136,0.1);border-radius:3px;padding:1px 4px">💨+${bonus.agility}</span>` : ''}
      ${bonus.speed   ? `<span style="font-size:0.58rem;color:#00d4ff;background:rgba(0,212,255,0.1);border-radius:3px;padding:1px 4px">🚀${bonus.speed > 0 ? '+' : ''}${bonus.speed}</span>` : ''}
    </div>` : `<div style="font-size:0.62rem;color:#6a90b8">Bez bonusa</div>`}
    <button class="btn" style="width:100%;margin-top:6px;font-size:0.65rem"
      onclick="showPanel('formations')">⬛ Promijeni</button>
  `;
}

// ── HANGAR STATUS (desni panel) ──
function updateHangarStatus() {
  const el = document.getElementById('hangarStatus');
  if (!el) return;
  const total   = hangar.reduce((a, h) => a + h.count, 0);
  const designs = hangar.length;
  el.innerHTML = `
    <div style="font-size:0.72rem;color:#6a90b8">
      ${designs === 0
        ? '<span style="color:#6a90b8">🏠 Prazan</span>'
        : `<span style="color:white">${fmt(total)}</span> brodova · <span style="color:#ffcc44">${designs}</span> dizajna`}
    </div>
    ${designs > 0 ? `<button class="btn btn-gold" style="width:100%;margin-top:6px;font-size:0.72rem" onclick="showPanel('hangar')">🏠 Otvori Hangar</button>` : ''}
  `;
}

// ── FALLBACK FLEET POWER ──
function calcFleetTotalPower() {
  if (typeof calcFleetStats === 'function') return calcFleetStats(fleet).power;
  return 0;
}

// ── NAVIGACIJA ──
function showPanel(panelId) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  const panel = document.getElementById(`panel-${panelId}`);
  const btn   = document.querySelector(`[data-panel="${panelId}"]`);
  if (panel) panel.classList.add('active');
  if (btn)   btn.classList.add('active');

  switch(panelId) {
    case 'base':         renderBase();              break;
    case 'recycler':     renderRecycler();          break;
    case 'shipfactory':  renderShipFactory();       break;
    case 'depot':        renderDepot();             break;
    case 'fleet':        renderFleet();             break;
    case 'hangar':       renderHangar();            break;
    case 'designer':     renderDesigner();          break;
    case 'formations':   renderFormations();        break;
    case 'blueprints':   renderBlueprints();        break;
    case 'galaxy':       renderGalaxy();            break;
    case 'instances':    renderInstances();         break;
    case 'pvp':          renderPvP();               break;
    case 'research':     renderResearch();          break;
    case 'missions':     renderMissions();          break;
    case 'espionage':    renderEspionage();         break;
    case 'colonies':     renderColonies();          break;
    case 'artifacts':    renderArtifacts();         break;
    case 'achievements': renderAchievements();      break;
    case 'commander':    renderCommanderPanel();    break;
  }
}

// ── LOG ──
function addLog(msg) {
  const el = document.getElementById('logPanel');
  if (!el) return;
  const time = new Date().toLocaleTimeString('sr', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  el.innerHTML = `<div style="margin-bottom:3px">[${time}] ${msg}</div>` + el.innerHTML;
  while (el.children.length > 50) el.removeChild(el.lastChild);
}

// ── MODAL ──
function openModal(title, body, actions = []) {
  const modal  = document.getElementById('modal');
  const mTitle = document.getElementById('mTitle');
  const mBody  = document.getElementById('mBody');
  const mAct   = document.getElementById('mActions');
  if (!modal) return;

  if (mTitle) mTitle.textContent = title;
  if (mBody)  mBody.innerHTML = body;
  if (mAct) {
    mAct.innerHTML = '';
    if (actions.length === 0) {
      const btn = document.createElement('button');
      btn.className   = 'btn';
      btn.textContent = 'Zatvori';
      btn.onclick     = closeModal;
      mAct.appendChild(btn);
    } else {
      actions.forEach(a => {
        const btn = document.createElement('button');
        btn.className   = 'btn ' + (a.cls || '');
        btn.textContent = a.label;
        btn.onclick     = a.fn;
        mAct.appendChild(btn);
      });
    }
  }
  modal.style.display = 'flex';
}

function closeModal() {
  const modal = document.getElementById('modal');
  if (modal) modal.style.display = 'none';
}

document.getElementById('modal')?.addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

// ── MISSIONS — definisano u js/systems/missions.js ──

// ── KOLONIJE — delegira na colonies.js ──
function renderColonies() {
  if (typeof window !== 'undefined' && typeof colonizePlanet === 'function') {
    // colonies.js je učitan — pozovi njegovu funkciju
    const el = document.getElementById('coloniesContent');
    if (!el) return;
    // renderColonies je definisan u colonies.js, ali ovdje je placeholder
    // colonies.js override-uje ovu funkciju
  }
  const el = document.getElementById('coloniesContent');
  if (el) el.innerHTML = '<div class="card" style="text-align:center;color:#6a90b8;padding:30px">🪐 Učitavanje kolonija...</div>';
}

// ── HANGAR render (poziva designer.js funkciju) ──
function renderHangar() {
  const el = document.getElementById('hangarContent');
  if (!el) return;
  el.innerHTML = typeof renderHangarList === 'function'
    ? renderHangarList()
    : '<div class="card" style="text-align:center;color:#6a90b8;padding:30px">🏠 Hangar — u razvoju</div>';
  updateHangarStatus();
}