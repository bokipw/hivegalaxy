// ============================================================
// HIVE GALAXY — js/ui/battle-anim.js
// ============================================================
// Spaja: vizuelni izgled iz "animacija bitke.html"
//        i logiku iz tvog originalnog battle-anim.js
// ============================================================

// ── MAPA ship_id → naziv slike ──
function getShipImageName(shipId) {
  if (!shipId) return null;
  const parts = shipId.split('_');
  if (parts.length < 2) return null;
  const namePart = parts[1].toLowerCase();
  const variantPart = parts[parts.length - 1];
  const variantNum = variantPart === 'I' ? '1' : variantPart === 'II' ? '2' : variantPart === 'III' ? '3' : '1';
  return `${namePart}${variantNum}`;
}

function getShipImageSrc(shipId) {
  const name = getShipImageName(shipId);
  if (!name) return null;
  return `img/${name}.png`;
}

// ── STANJE ANIMACIJE ──
window._battleAnim = {
  battle: null, logIndex: 0, timer: null, speed: 180, paused: false, done: false, onFinish: null,
  hpState: {}, shldState: {}, aliveState: {}
};

// ── EFEKTI ──
let beams = [], impacts = [], particles = [];
let ctxFX = null, fxCanvas = null, glassPanel = null;
let lastTimestamp = 0;
let animFrameId = null;

// ── POKRENI ANIMACIJU ──
function startBattleAnim(battle, onFinish) {
  const anim = window._battleAnim;
  anim.battle = battle;
  anim.logIndex = 0;
  anim.paused = false;
  anim.done = false;
  anim.onFinish = onFinish || null;

  anim.hpState = {};
  anim.shldState = {};
  anim.aliveState = {};
  [...battle.player, ...battle.enemy].forEach(u => {
    anim.hpState[u.id] = u.maxHp;
    anim.shldState[u.id] = u.maxShield || 0;
    anim.aliveState[u.id] = true;
  });

  const logLen = battle.log.length;
  anim.speed = logLen > 200 ? 80 : logLen > 100 ? 120 : 180;

  openBattleAnimModal(battle);
  scheduleTick();
}

function scheduleTick() {
  const anim = window._battleAnim;
  if (anim.timer) clearTimeout(anim.timer);
  if (anim.speed <= 0) anim.speed = 180;
  anim.timer = setTimeout(battleAnimTick, anim.speed);
}

function battleAnimTick() {
  const anim = window._battleAnim;
  if (!anim.battle || anim.paused || anim.done) return;
  const log = anim.battle.log;
  if (anim.logIndex >= log.length) { finishBattleAnim(); return; }
  const entry = log[anim.logIndex];
  anim.logIndex++;

  if (entry.type === 'attack' && entry.target) {
    const dmg = entry.dmg || 0;
    anim.hpState[entry.target] = Math.max(0, (anim.hpState[entry.target] || 0) - dmg);
    if (entry.shieldDmg) anim.shldState[entry.target] = Math.max(0, (anim.shldState[entry.target] || 0) - entry.shieldDmg);
    animAttackFlash(entry.attacker, entry.target, dmg, entry.shieldDmg > 0);
  }
  if (entry.type === 'destroy' && entry.target && anim.battle.shipsById[entry.target]) {
    anim.aliveState[entry.target] = false;
    animDestroyEffect(entry.target);
  }

  appendAnimEntry(entry);
  updateBattlefield();
  updateAnimProgress(anim.logIndex, log.length);
  scheduleTick();
}

function finishBattleAnim() {
  const anim = window._battleAnim;
  anim.done = true;
  if (anim.timer) clearTimeout(anim.timer);
  const finEl = document.getElementById('battleAnimFinish');
  if (finEl) finEl.style.display = 'flex';
}

function openBattleAnimModal(battle) {
  const isVictory = battle.status === 'victory';
  const isDraw = battle.status === 'draw';
  const statusColor = isVictory ? '#00ff88' : isDraw ? '#ffcc44' : '#ff3355';
  const statusIcon = isVictory ? '🏆' : isDraw ? '⚖️' : '💀';

  const body = `
    <style>
      @keyframes grainAnim { to { transform: translate(-3%, 2%); } }
      @keyframes victoryGlow { 0%,100% { text-shadow: 0 0 10px var(--vc); } 50% { text-shadow: 0 0 35px var(--vc); } }
      @keyframes dmgFloat { 0%{opacity:1;transform:translate(-50%,-50%) scale(.8)}70%{opacity:1}100%{opacity:0;transform:translate(-50%,-130%) scale(1.15)} }
      @keyframes shake { 0%,100%{transform:translate(0)}15%{transform:translate(-4px,2px)}30%{transform:translate(3px,-3px)}45%{transform:translate(-3px,1px)}60%{transform:translate(2px,2px)}75%{transform:translate(-1px,-2px)} }
      @keyframes logIn { to { opacity:1; } }
      .grain-overlay { position:fixed; inset:0; pointer-events:none; opacity:0.06; mix-blend-mode:screen; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); animation:grainAnim .4s steps(2) infinite; z-index:100; }
      .flash-overlay { position:fixed; inset:0; pointer-events:none; background:radial-gradient(circle at 50% 40%,rgba(255,255,255,.2),transparent 70%); opacity:0; transition:opacity .15s; z-index:90; mix-blend-mode:screen; }
      .flash-overlay.active { opacity:1; }
      .aberration { filter: hue-rotate(5deg) saturate(1.3) contrast(1.12); transition:filter 0.16s; }
      .damage-float { position:absolute; font-family:Orbitron; font-weight:800; font-size:20px; pointer-events:none; transform:translate(-50%,-50%); text-shadow:0 0 12px currentColor,0 0 24px currentColor; animation:dmgFloat 0.9s cubic-bezier(.2,.7,.2,1) forwards; z-index:30; }
      .log-entry { opacity:0; animation:logIn 0.25s forwards; }
      .shake { animation:shake 0.5s; }
      .pill { background:rgba(8,16,28,.8); border:1px solid rgba(0,212,255,.3); color:#bfefff; padding:7px 14px; border-radius:999px; font-family:'Share Tech Mono'; font-size:12px; cursor:pointer; transition:.2s; backdrop-filter:blur(6px); }
      .pill:hover { box-shadow:0 0 14px rgba(0,212,255,.5); transform:translateY(-1px); border-color:#00d4ff; }
      .progress { height:8px; background:rgba(255,255,255,.06); border-radius:6px; overflow:hidden; border:1px solid rgba(0,212,255,.25); box-shadow:inset 0 0 12px rgba(0,212,255,.15); }
      .progress-fill { height:100%; width:0%; background:linear-gradient(90deg,#00d4ff,#7b61ff); box-shadow:0 0 18px #00d4ff; transition:width .3s; }
      .log-panel { position:relative; background:linear-gradient(to top,rgba(2,4,10,.96),rgba(2,4,10,.78)); border-top:1px solid rgba(0,212,255,.22); border-radius:16px; backdrop-filter:blur(10px); margin-top:8px; }
      .log-header { padding:7px 16px; font-family:Orbitron; font-size:11px; letter-spacing:1px; color:#7dd3fc; border-bottom:1px solid rgba(255,255,255,.06); display:flex; justify-content:space-between; opacity:.9; }
      #battleAnimLog { height:130px; overflow-y:auto; padding:8px 16px; font-size:12.5px; line-height:1.5; font-family:'Share Tech Mono',monospace; display:flex; flex-direction:column-reverse; }
      .fleets { position:relative; display:flex; justify-content:space-between; gap:28px; }
      .fleet { width:44%; display:grid; grid-template-columns:repeat(2,1fr); grid-template-rows:repeat(3,1fr); gap:14px; }
      .fleet.enemy { direction:rtl; }
      .fleet.enemy .ship { direction:ltr; }
      .ship { position:relative; background:linear-gradient(180deg,rgba(14,22,38,.9),rgba(6,10,18,.7)); border:1px solid rgba(255,255,255,.08); border-radius:16px; padding:10px 10px 12px; backdrop-filter:blur(6px); transition:transform .25s,border-color .25s; animation:float 3.6s ease-in-out infinite; }
      .player .ship { border-color:rgba(0,212,255,.28); box-shadow:inset 0 0 20px rgba(0,212,255,.06),0 0 14px rgba(0,212,255,.08); }
      .enemy .ship { border-color:rgba(255,51,85,.28); box-shadow:inset 0 0 20px rgba(255,51,85,.06),0 0 14px rgba(255,51,85,.08); }
      .ship:hover { transform:translateY(-5px) scale(1.02); border-color:#00d4ff; }
      .enemy .ship:hover { border-color:#ff3355; }
      .ship.destroyed { opacity:.32; filter:grayscale(.9) brightness(.6); transform:scale(.9); }
      .ship.destroyed .engine-glow { opacity:0; }
      .fleet.victory .ship { animation:float 3.6s ease-in-out infinite, victoryGlow 1.8s infinite; }
      .player.victory .ship { box-shadow:0 0 30px rgba(0,212,255,.4),inset 0 0 20px rgba(0,212,255,.2); }
      .enemy.victory .ship { box-shadow:0 0 30px rgba(255,51,85,.4),inset 0 0 20px rgba(255,51,85,.2); }
      .ship-inner { position:relative; z-index:2; }
      .ship-image { display:flex; justify-content:center; align-items:center; height:54px; margin-bottom:6px; }
      .ship-image svg { width:72px; height:48px; filter:drop-shadow(0 0 10px currentColor); transition:.3s; }
      .enemy .ship-image svg { filter:drop-shadow(0 0 10px #ff3355); }
      .engine-glow { position:absolute; bottom:26px; left:50%; transform:translateX(-50%); width:48px; height:16px; border-radius:50%; background:radial-gradient(ellipse,currentColor,transparent 65%); filter:blur(7px); opacity:.85; animation:pulse 1.7s infinite; }
      @keyframes pulse { 0%,100% { opacity:.7; transform:translateX(-50%) scale(.9); } 50% { opacity:1; transform:translateX(-50%) scale(1.1); } }
      @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-6px); } }
      .ship-name { font-family:Orbitron; font-size:10px; text-align:center; letter-spacing:1px; opacity:.85; margin-bottom:7px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
      .bars { display:flex; flex-direction:column; gap:5px; }
      .bar { height:7px; background:rgba(0,0,0,.65); border-radius:4px; overflow:hidden; border:1px solid rgba(255,255,255,.06); position:relative; }
      .bar i { display:block; height:100%; width:100%; transition:width .5s cubic-bezier(.2,.8,.2,1); }
      .bar.hp i { background:linear-gradient(90deg,#ff1a40,#ffcc44 45%,#2dfe9a); box-shadow:inset 0 0 8px rgba(45,254,154,.3); }
      .bar.shield i { background:linear-gradient(90deg,#00d4ff,#7b61ff); box-shadow:inset 0 0 10px rgba(0,212,255,.5); position:relative; overflow:hidden; }
      .bar.shield i::after { content:''; position:absolute; inset:0; background:linear-gradient(90deg,transparent,rgba(255,255,255,.7),transparent); transform:translateX(-100%); animation:shimmer 2.3s infinite; }
      @keyframes shimmer { to { transform:translateX(200%); } }
      @keyframes victoryGlow { 0%,100% { filter:brightness(1); } 50% { filter:brightness(1.4); } }
    </style>
    <div class="grain-overlay"></div>
    <div class="flash-overlay" id="flashOverlay"></div>
    <div id="battlefieldWrap" style="background: radial-gradient(ellipse at center, #0a0f1e 0%, #020408 100%); border:1px solid rgba(0,212,255,0.3); border-radius:28px; padding:20px; margin-bottom:16px; position:relative; overflow:hidden; box-shadow:0 0 80px rgba(0,212,255,0.12), inset 0 0 40px rgba(123,97,255,0.08);">
      <div style="position:absolute;inset:0;pointer-events:none;z-index:0">${generateBattleStars(120)}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;position:relative;z-index:1">
        <div style="font-family:Orbitron; font-size:0.75rem;color:#7dd3fc">⚔️ <span id="battleAnimRound">Runda 1</span></div>
        <div style="font-size:0.7rem;color:#6a90b8"><span id="battleAnimPct">0%</span></div>
      </div>
      <div class="progress" style="margin-bottom:18px;"><div class="progress-fill" id="battleAnimProgressBar"></div></div>
      <div class="fleets">
        <div class="fleet player" id="player-fleet"></div>
        <div style="text-align:center;display:flex;align-items:center"><div style="font-size:2rem;color:#ffcc44;text-shadow:0 0 20px #ffcc44;opacity:0.7;animation:pulse 1.5s infinite">⚔️</div></div>
        <div class="fleet enemy" id="enemy-fleet"></div>
      </div>
      <canvas id="battleCanvas" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:15"></canvas>
    </div>
    <div style="display:flex;gap:10px;margin-bottom:12px;justify-content:center">
      <button class="pill" onclick="battleAnimTogglePause()" id="battleAnimPauseBtn">⏸ PAUSE</button>
      <button class="pill" onclick="battleAnimSetSpeed(500)">🐢 SPORO</button>
      <button class="pill" onclick="battleAnimSetSpeed(180)">▶ NORMALNO</button>
      <button class="pill" onclick="battleAnimSetSpeed(40)">⚡ BRZO</button>
      <button class="pill" onclick="battleAnimSkipToEnd()">⏭ SKIP</button>
    </div>
    <div class="log-panel">
      <div class="log-header">COMBAT LOG // HIVE_NET<span>LIVE</span></div>
      <div id="battleAnimLog"></div>
    </div>
    <div id="battleAnimFinish" style="display:none;flex-direction:column;align-items:center;gap:12px;margin-top:16px">
      <div style="font-family:Orbitron;font-size:1.8rem;color:${statusColor};text-shadow:0 0 20px ${statusColor};animation:victoryGlow 1.2s infinite">${statusIcon} ${isVictory ? 'POBJEDA!' : isDraw ? 'IZJEDNAČENJE' : 'PORAZ'}</div>
      <div style="font-size:0.8rem;color:#6a90b8">${battle.round} rundi · ${battle.log.length} akcija</div>
      <button class="pill" onclick="battleAnimClose()">✅ NASTAVI</button>
    </div>
  `;

  const modal = document.getElementById('modal');
  const mTitle = document.getElementById('mTitle');
  const mBody = document.getElementById('mBody');
  const mAct = document.getElementById('mActions');
  if (!modal) return;
  if (mTitle) mTitle.textContent = `⚔️ ${battle.instance?.name || 'Borba'} — Bitka`;
  if (mBody) mBody.innerHTML = body;
  if (mAct) mAct.innerHTML = '';
  modal.style.display = 'flex';
  const modalInner = modal.querySelector('div');
  if (modalInner) modalInner.style.maxWidth = '1100px';

  renderFleets(battle);
  setTimeout(() => {
    const wrap = document.getElementById('battlefieldWrap');
    const canvas = document.getElementById('battleCanvas');
    if (wrap && canvas) {
      canvas.width = wrap.offsetWidth;
      canvas.height = wrap.offsetHeight;
      ctxFX = canvas.getContext('2d');
      fxCanvas = canvas;
      glassPanel = wrap;
      if (animFrameId) cancelAnimationFrame(animFrameId);
      animFrameId = requestAnimationFrame(effectLoop);
    }
  }, 50);
}

function renderFleets(battle) {
  const pf = document.getElementById('player-fleet');
  const ef = document.getElementById('enemy-fleet');
  if (!pf || !ef) return;
  pf.innerHTML = '';
  ef.innerHTML = '';
  battle.shipsById = {};
  battle.player.forEach(ship => {
    ship.el = createShipElement(ship, 'player');
    pf.appendChild(ship.el);
    battle.shipsById[ship.id] = ship;
    updateShipBars(ship);
  });
  battle.enemy.forEach(ship => {
    ship.el = createShipElement(ship, 'enemy');
    ef.appendChild(ship.el);
    battle.shipsById[ship.id] = ship;
    updateShipBars(ship);
  });
}

function createShipElement(ship, team) {
  const div = document.createElement('div');
  div.className = 'ship';
  div.dataset.id = ship.id;
  const imgSrc = ship.ship_id ? getShipImageSrc(ship.ship_id) : null;
  const hpPct = ship.maxHp > 0 ? (ship.hp / ship.maxHp) * 100 : 100;
  const shPct = ship.maxShield > 0 ? (ship.shield / ship.maxShield) * 100 : 0;
  const color = team === 'player' ? '#00d4ff' : '#ff3355';
  div.innerHTML = `
    <div class="ship-inner">
      <div class="ship-image" style="display:flex;justify-content:center;align-items:center;height:54px;margin-bottom:6px">
        ${imgSrc ? `<img src="${imgSrc}" style="width:64px;height:48px;object-fit:contain;filter:drop-shadow(0 0 10px ${color})" onerror="this.style.display='none'">` : `<svg viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 24 L16 8 L30 12 L48 5 L62 24 L48 43 L30 36 L16 40 Z" fill="currentColor" style="color:${color}"/><rect x="28" y="22" width="12" height="4" rx="1" fill="white" opacity="0.9"/></svg>`}
      </div>
      <div class="engine-glow" style="color:${color}"></div>
      <div class="ship-name">${ship.name}</div>
      <div class="bars">
        ${ship.maxShield > 0 ? `<div class="bar shield"><i style="width:${shPct}%"></i></div>` : ''}
        <div class="bar hp"><i style="width:${hpPct}%"></i></div>
      </div>
    </div>
  `;
  return div;
}

function updateShipBars(ship) {
  if (!ship.el) return;
  const anim = window._battleAnim;
  const hpPct = ship.maxHp > 0 ? ((anim.hpState[ship.id] ?? ship.hp) / ship.maxHp) * 100 : 100;
  const shPct = ship.maxShield > 0 ? ((anim.shldState[ship.id] ?? ship.shield) / ship.maxShield) * 100 : 0;
  const hpBar = ship.el.querySelector('.bar.hp i');
  const shBar = ship.el.querySelector('.bar.shield i');
  if (hpBar) hpBar.style.width = Math.max(0, hpPct) + '%';
  if (shBar) shBar.style.width = Math.max(0, shPct) + '%';
  if (!anim.aliveState[ship.id] && ship.el) ship.el.classList.add('destroyed');
}

function updateBattlefield() {
  const anim = window._battleAnim;
  if (!anim.battle) return;
  [...anim.battle.player, ...anim.battle.enemy].forEach(u => updateShipBars(u));
}

function appendAnimEntry(entry) {
  const logEl = document.getElementById('battleAnimLog');
  if (!logEl) return;
  const div = document.createElement('div');
  div.className = 'log-entry';
  let txt = '';
  if (entry.type === 'round') {
    txt = `─── ROUND ${entry.round} INITIATED ───`;
    div.style.color = '#7b61ff';
    document.getElementById('battleAnimRound').textContent = `Runda ${entry.round}`;
  } else if (entry.type === 'attack') {
    const anim = window._battleAnim;
    const a = anim.battle.shipsById[entry.attacker]?.name || entry.attacker;
    const d = anim.battle.shipsById[entry.target]?.name || entry.target;
    txt = `${a} → ${d}  |  -${entry.dmg} HP${entry.shieldDmg ? ` (${entry.shieldDmg} SHD)` : ''}`;
    div.style.color = '#b8ecff';
  } else if (entry.type === 'destroy') {
    const anim = window._battleAnim;
    const s = anim.battle.shipsById[entry.target]?.name || entry.target || 'Nepoznati';
    txt = `✖ ${s} UNIŠTEN`;
    div.style.color = '#ffcc44';
  } else {
    txt = entry.msg || '';
    div.style.color = '#6a90b8';
  }
  div.textContent = txt;
  logEl.insertBefore(div, logEl.firstChild);
  while (logEl.children.length > 50) logEl.removeChild(logEl.lastChild);
}

function updateAnimProgress(current, total) {
  const pct = total > 0 ? (current / total) * 100 : 0;
  const fill = document.getElementById('battleAnimProgressBar');
  const pctSpan = document.getElementById('battleAnimPct');
  if (fill) fill.style.width = pct + '%';
  if (pctSpan) pctSpan.textContent = Math.floor(pct) + '%';
}

// ── EFEKTI ──
function effectLoop(ts) {
  const dt = Math.min(33, ts - lastTimestamp || 16);
  lastTimestamp = ts;
  updateEffects(dt);
  animFrameId = requestAnimationFrame(effectLoop);
}

function updateEffects(dt) {
  if (!ctxFX || !fxCanvas) return;
  ctxFX.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
  ctxFX.save();
  ctxFX.globalCompositeOperation = 'lighter';

  beams = beams.filter(b => { b.life += dt / 1000; return b.life < b.maxLife; });
  beams.forEach(b => {
    const p = b.life / b.maxLife;
    const sx = b.start.x, sy = b.start.y, ex = b.end.x, ey = b.end.y;
    const mx = (sx + ex) / 2 + Math.sin(p * Math.PI) * -25 * (b.flip || 1);
    const my = (sy + ey) / 2 - 35;
    ctxFX.beginPath();
    ctxFX.moveTo(sx, sy);
    ctxFX.quadraticCurveTo(mx, my, ex, ey);
    ctxFX.strokeStyle = hexToRgba(b.color, 0.2 * (1 - p));
    ctxFX.lineWidth = b.width * 5;
    ctxFX.shadowBlur = 20;
    ctxFX.shadowColor = b.color;
    ctxFX.stroke();
    ctxFX.beginPath();
    ctxFX.moveTo(sx, sy);
    ctxFX.quadraticCurveTo(mx, my, ex, ey);
    ctxFX.strokeStyle = hexToRgba(b.color, 0.9 * (1 - p));
    ctxFX.lineWidth = b.width;
    ctxFX.shadowBlur = 0;
    ctxFX.stroke();
  });

  impacts = impacts.filter(i => { i.life += dt / 1000; return i.life < i.maxLife; });
  impacts.forEach(i => {
    const p = i.life / i.maxLife;
    const r = 22 + p * 50;
    ctxFX.beginPath();
    ctxFX.arc(i.x, i.y, r, 0, Math.PI * 2);
    ctxFX.strokeStyle = hexToRgba(i.color, 0.75 * (1 - p));
    ctxFX.lineWidth = 2.5;
    ctxFX.stroke();
    ctxFX.beginPath();
    ctxFX.arc(i.x, i.y, r * 0.4, 0, Math.PI * 2);
    ctxFX.fillStyle = hexToRgba(i.color, 0.3 * (1 - p));
    ctxFX.fill();
  });

  particles = particles.filter(p => { p.life -= dt / 1000; p.x += p.vx; p.y += p.vy; p.vy += p.gravity; return p.life > 0; });
  particles.forEach(p => {
    const a = Math.max(0, p.life / p.maxLife);
    ctxFX.globalAlpha = a;
    ctxFX.fillStyle = p.color;
    if (p.type === 'smoke') {
      ctxFX.beginPath();
      ctxFX.arc(p.x, p.y, p.size * (1.6 - a), 0, Math.PI * 2);
      ctxFX.fill();
    } else {
      ctxFX.fillRect(p.x, p.y, p.size, p.size);
    }
  });
  ctxFX.restore();
}

function hexToRgba(hex, a) {
  const h = hex.replace('#', '');
  return `rgba(${parseInt(h.slice(0,2),16)}, ${parseInt(h.slice(2,4),16)}, ${parseInt(h.slice(4,6),16)}, ${a})`;
}

function animAttackFlash(attackerId, targetId, dmg, isShield) {
  let targetEl = document.getElementById(`battleship_${targetId}`);
  if (!targetEl) targetEl = document.querySelector(`.ship[data-id="${targetId}"]`);
  if (targetEl) {
    targetEl.style.filter = 'brightness(1.8) drop-shadow(0 0 10px white)';
    setTimeout(() => { if (targetEl) targetEl.style.filter = ''; }, 150);
  }
  animProjectile(attackerId, targetId);
  showDamageNumber(targetId, dmg, isShield);
}

function animProjectile(fromId, toId) {
  if (!fxCanvas || !ctxFX) return;
  let fromEl = document.getElementById(`battleship_${fromId}`);
  if (!fromEl) fromEl = document.querySelector(`.ship[data-id="${fromId}"]`);
  let toEl = document.getElementById(`battleship_${toId}`);
  if (!toEl) toEl = document.querySelector(`.ship[data-id="${toId}"]`);
  if (!fromEl || !toEl || !glassPanel) return;
  const wrapRect = glassPanel.getBoundingClientRect();
  const fromRect = fromEl.getBoundingClientRect();
  const toRect = toEl.getBoundingClientRect();
  const start = { x: fromRect.left + fromRect.width/2 - wrapRect.left, y: fromRect.top + fromRect.height/2 - wrapRect.top };
  const end = { x: toRect.left + toRect.width/2 - wrapRect.left, y: toRect.top + toRect.height/2 - wrapRect.top };
  const color = fromId?.startsWith('p') ? '#00d4ff' : '#ff3355';
  beams.push({ start, end, life: 0, maxLife: 0.28, color, width: 2.8 + Math.random() * 1.5, flip: Math.random() > 0.5 ? 1 : -1 });
  setTimeout(() => {
    impacts.push({ x: end.x, y: end.y, life: 0, maxLife: 0.4, color: '#ffcc44' });
    for (let i = 0; i < 16; i++) {
      particles.push({
        x: end.x, y: end.y, vx: (Math.random() - 0.5) * 3.5, vy: (Math.random() - 0.5) * 3.5,
        life: 0.4, maxLife: 0.4, size: 2.5, color: '#fbbf24', type: 'spark', gravity: 0.02
      });
    }
  }, 170);
}

function showDamageNumber(targetId, amount, isShield) {
  let targetDiv = document.getElementById(`battleship_${targetId}`);
  if (!targetDiv) targetDiv = document.querySelector(`.ship[data-id="${targetId}"]`);
  if (!targetDiv) return;
  const dmgDiv = document.createElement('div');
  dmgDiv.className = 'damage-float';
  dmgDiv.style.left = '50%';
  dmgDiv.style.top = '-20px';
  dmgDiv.style.transform = 'translateX(-50%)';
  dmgDiv.style.color = isShield ? '#00d4ff' : '#ffcc44';
  dmgDiv.textContent = '-' + Math.floor(amount);
  targetDiv.style.position = 'relative';
  targetDiv.appendChild(dmgDiv);
  setTimeout(() => dmgDiv.remove(), 900);
}

function animDestroyEffect(unitId) {
  let shipEl = document.getElementById(`battleship_${unitId}`);
  if (!shipEl) shipEl = document.querySelector(`.ship[data-id="${unitId}"]`);
  if (!shipEl) return;
  shipEl.classList.add('destroyed');
  if (glassPanel) glassPanel.classList.add('shake');
  setTimeout(() => glassPanel?.classList.remove('shake'), 500);
  const flash = document.getElementById('flashOverlay');
  if (flash) { flash.classList.add('active'); setTimeout(() => flash.classList.remove('active'), 140); }
  document.body.classList.add('aberration');
  setTimeout(() => document.body.classList.remove('aberration'), 160);
  const rect = shipEl.getBoundingClientRect();
  const wrapRect = glassPanel?.getBoundingClientRect() || { left: 0, top: 0 };
  const centerX = rect.left + rect.width/2 - wrapRect.left;
  const centerY = rect.top + rect.height/2 - wrapRect.top;
  createExplosionParticles(centerX, centerY, unitId.startsWith('p') ? 'player' : 'enemy');
}

function createExplosionParticles(x, y, team) {
  const colors = team === 'player' ? ['#00d4ff', '#7b61ff', '#ffffff'] : ['#ff3355', '#ff8844', '#ffcc44'];
  const count = 85 + Math.random() * 40;
  for (let i = 0; i < count; i++) {
    const ang = Math.random() * Math.PI * 2;
    const sp = Math.random() * 4.5 + 1;
    particles.push({
      x, y,
      vx: Math.cos(ang) * sp * (0.5 + Math.random()),
      vy: Math.sin(ang) * sp * (0.5 + Math.random()) - 1.2,
      life: 0.8 + Math.random() * 0.9,
      maxLife: 1.6,
      size: Math.random() * 3.5 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      type: Math.random() < 0.7 ? 'spark' : 'smoke',
      gravity: 0.04 + Math.random() * 0.02
    });
  }
  impacts.push({ x, y, life: 0, maxLife: 0.55, color: team === 'player' ? '#7b61ff' : '#ff3355' });
}

function generateBattleStars(count) {
  return Array.from({ length: count }, () => {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const s = Math.random() * 1.8 + 0.5;
    const o = Math.random() * 0.5 + 0.1;
    return `<div style="position:absolute;left:${x}%;top:${y}%;width:${s}px;height:${s}px;border-radius:50%;background:white;opacity:${o};box-shadow:0 0 4px white"></div>`;
  }).join('');
}

// ── KONTROLE ──
function battleAnimTogglePause() {
  const anim = window._battleAnim;
  anim.paused = !anim.paused;
  const btn = document.getElementById('battleAnimPauseBtn');
  if (btn) btn.textContent = anim.paused ? '▶ RESUME' : '⏸ PAUSE';
  if (!anim.paused) scheduleTick();
}

function battleAnimSetSpeed(ms) {
  window._battleAnim.speed = ms;
  if (!window._battleAnim.paused) scheduleTick();
}

function battleAnimSkipToEnd() {
  const anim = window._battleAnim;
  if (anim.timer) clearTimeout(anim.timer);
  anim.paused = false;
  while (anim.logIndex < anim.battle.log.length) {
    const entry = anim.battle.log[anim.logIndex];
    if (entry.type === 'attack' && entry.target) {
      anim.hpState[entry.target] = Math.max(0, (anim.hpState[entry.target] || 0) - (entry.dmg || 0));
      if (entry.shieldDmg) anim.shldState[entry.target] = Math.max(0, (anim.shldState[entry.target] || 0) - entry.shieldDmg);
    }
    if (entry.type === 'destroy' && entry.target) anim.aliveState[entry.target] = false;
    appendAnimEntry(entry);
    anim.logIndex++;
  }
  updateBattlefield();
  updateAnimProgress(anim.logIndex, anim.battle.log.length);
  finishBattleAnim();
}

function battleAnimClose() {
  const anim = window._battleAnim;
  if (anim.timer) clearTimeout(anim.timer);
  if (animFrameId) cancelAnimationFrame(animFrameId);
  closeModal();
  if (typeof anim.onFinish === 'function') anim.onFinish(anim.battle);
}

// ── LEGACY ──
function showBattleResultDirect(battle, rewards) {
  if (typeof renderBattleResult === 'function') renderBattleResult(battle, rewards);
}

function showBattleOutcome(battle, rewards, useAnim = true) {
  if (useAnim && battle.log && battle.log.length > 0) {
    startBattleAnim(battle, () => showBattleResultDirect(battle, rewards));
  } else {
    showBattleResultDirect(battle, rewards);
  }
}

// Dodaj CSS ako ne postoji
if (!document.getElementById('battleAnimStyles')) {
  const style = document.createElement('style');
  style.id = 'battleAnimStyles';
  style.textContent = `
    @keyframes victoryGlow { 0%,100% { filter:brightness(1); } 50% { filter:brightness(1.4); } }
    @keyframes shimmer { to { transform:translateX(200%); } }
    .battle-ship { transition: transform 0.2s, filter 0.2s; cursor: pointer; }
    .battle-ship:hover { transform: scale(1.03); filter: drop-shadow(0 0 16px cyan); }
  `;
  document.head.appendChild(style);
}