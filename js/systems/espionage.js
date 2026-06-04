// ============================================================
// HIVE GALAXY — js/systems/espionage.js
// Špijunaža — izviđanje protivnika prije PvP napada
// ============================================================

// ── DRONE CIJENA ──
const ESP_DRONE_COST = { metal: 500, crystal: 800, he3: 200 };
const ESP_DRONE_MAX  = 50;
const ESP_DRONE_MAX_BONUS = 30; // max +30% od dronova

// ── ŠANSA USPJEHA ──
function getEspSuccessChance(targetEspLevel, numDrones) {
  const myLevel    = getEspionageLevel();
  const drones     = Math.min(numDrones || 0, ESP_DRONE_MAX_BONUS);
  const baseChance = 40;
  const myBonus    = myLevel * 0.5;                        // +0.5% po research lvl
  const droneBonus = drones;                               // +1% po dronu
  const penalty    = (targetEspLevel || 0) * 0.3;         // -0.3% po protivnik lvl
  return Math.min(95, Math.max(5, baseChance + myBonus + droneBonus - penalty));
}

// ── ŠTA VIDIMO (po research milestonu) ──
function getEspionageRevealLevel() {
  const lvl = getEspionageLevel();
  if (lvl >= 100) return 4;
  if (lvl >= 75)  return 3;
  if (lvl >= 50)  return 2;
  if (lvl >= 25)  return 1;
  return 0;
}

// ── KUPI DRONE ──
function buyEspDrone(count = 1) {
  const cost = {
    metal:   ESP_DRONE_COST.metal   * count,
    crystal: ESP_DRONE_COST.crystal * count,
    he3:     ESP_DRONE_COST.he3     * count,
  };
  if (espDrones + count > ESP_DRONE_MAX) {
    toast(`⚠️ Maksimum ${ESP_DRONE_MAX} dronova!`, 'warn');
    return;
  }
  if (!canAfford(cost)) { toast('❌ Nedovoljno resursa!', 'err'); return; }
  spendResources(cost);
  espDrones += count;
  toast(`🤖 +${count} špijunski dron${count > 1 ? 'a' : ''}!`, 'ok');
  addLog(`🤖 Kupljeno ${count} špijunskih dronova.`);
  updateResUI();
  renderEspionage();
  saveGame();
}

// ── OTVORI MODAL ZA SLANJE DRONOVA ──
function openSendDronesModal(opponentIdx) {
  const opp = window._currentOpponents?.[opponentIdx];
  if (!opp) { toast('❌ Protivnik nije pronađen!', 'err'); return; }

  if (espDrones <= 0) {
    toast('❌ Nemaš špijunskih dronova! Kupi ih ispod.', 'err');
    return;
  }

  const targetEspLvl = opp.espLevel || 0;
  const maxSend      = Math.min(espDrones, ESP_DRONE_MAX_BONUS);

  const body = `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
      <div style="font-size:2rem">${opp.avatar}</div>
      <div>
        <div style="font-size:0.9rem;font-weight:700;color:white">${opp.name}</div>
        <div style="font-size:0.65rem;color:#6a90b8">
          Power: ${fmt(opp.power)} · Rating: ${opp.rating}
          ${targetEspLvl > 0 ? ` · ESP Lv.${targetEspLvl}` : ''}
        </div>
      </div>
    </div>

    <div style="margin-bottom:14px">
      <label style="font-size:0.72rem;color:#6a90b8;display:block;margin-bottom:6px">
        Koliko dronova poslati? (imaš ${espDrones}, max bonus ${ESP_DRONE_MAX_BONUS}):
      </label>
      <input id="droneCount" type="range" min="1" max="${maxSend}" value="1"
        style="width:100%;accent-color:#aa44ff"
        oninput="updateDroneModal(${opponentIdx})">
      <div style="display:flex;justify-content:space-between;margin-top:4px">
        <span style="font-size:0.65rem;color:#6a90b8">1</span>
        <span style="font-size:0.65rem;color:#6a90b8">${maxSend}</span>
      </div>
    </div>

    <div id="droneModalInfo" style="background:rgba(0,0,0,0.3);border-radius:8px;
      padding:12px;font-size:0.72rem;font-family:'Share Tech Mono',monospace;line-height:2">
    </div>

    <div style="margin-top:12px;font-size:0.65rem;color:#ff3355;background:rgba(255,51,85,0.05);
      border:1px solid rgba(255,51,85,0.2);padding:8px;border-radius:6px">
      ⚠️ Ako špijunaža neuspješna — svi poslani dronovi su izgubljeni!
    </div>
  `;

  openModal(`🕵️ Špijuniraj: ${opp.name}`, body, [
    {
      label: '🚀 Pošalji dronove',
      cls:   'btn-gold',
      fn: () => {
        const count = parseInt(document.getElementById('droneCount')?.value || '1');
        closeModal();
        espionageTarget(opp, count);
      }
    },
    { label: 'Odustani', fn: closeModal }
  ]);

  setTimeout(() => updateDroneModal(opponentIdx), 50);
}

function updateDroneModal(opponentIdx) {
  const opp    = window._currentOpponents?.[opponentIdx];
  const count  = parseInt(document.getElementById('droneCount')?.value || '1');
  const info   = document.getElementById('droneModalInfo');
  if (!info || !opp) return;

  const targetEspLvl = opp.espLevel || 0;
  const chance       = getEspSuccessChance(targetEspLvl, count);
  const revealLevel  = getEspionageRevealLevel();
  const droneBonus   = Math.min(count, ESP_DRONE_MAX_BONUS);

  const chanceColor = chance >= 80 ? '#00ff88' : chance >= 60 ? '#ffcc44' : chance >= 40 ? '#ff8833' : '#ff3355';

  info.innerHTML = `
    <div>🤖 Dronovi: <span style="color:#aa44ff">${count}</span>
      ${count > ESP_DRONE_MAX_BONUS ? `<span style="color:#6a90b8"> (max bonus: ${ESP_DRONE_MAX_BONUS})</span>` : ''}</div>
    <div>📊 Bonus od dronova: <span style="color:#aa44ff">+${droneBonus}%</span></div>
    <div>🔬 Research bonus: <span style="color:#4488ff">+${(getEspionageLevel() * 0.5).toFixed(1)}%</span></div>
    ${targetEspLvl > 0 ? `<div>🛡️ Protivnik penalizuje: <span style="color:#ff3355">-${(targetEspLvl * 0.3).toFixed(1)}%</span></div>` : ''}
    <div style="margin-top:6px;padding-top:6px;border-top:1px solid rgba(255,255,255,0.05)">
      🎯 Šansa uspjeha: <span style="color:${chanceColor};font-size:1rem;font-weight:700">${chance.toFixed(1)}%</span>
    </div>
    <div>👁️ Otkriva: <span style="color:#ffcc44">${
      revealLevel === 0 ? 'Power + Rating' :
      revealLevel === 1 ? 'Power + HP' :
      revealLevel === 2 ? 'Power + HP + Oprema' :
      revealLevel === 3 ? 'Power + HP + Oprema + Module' :
      'SVE informacije'
    }</span></div>
  `;
}

// ── ŠPIJUNIRAJ PROTIVNIKA ──
function espionageTarget(opponent, numDrones) {
  const dronesToSend = Math.min(numDrones || 1, espDrones, ESP_DRONE_MAX_BONUS);
  if (espDrones <= 0 || dronesToSend <= 0) {
    toast('❌ Nemaš špijunskih dronova!', 'err');
    return;
  }

  // Troši dronove
  espDrones -= dronesToSend;

  const targetEspLvl  = opponent.espLevel || 0;
  const successChance = getEspSuccessChance(targetEspLvl, dronesToSend);
  const success       = Math.random() * 100 < successChance;
  const revealLevel   = getEspionageRevealLevel();

  const report = {
    id:        Date.now(),
    opponent:  opponent.name,
    avatar:    opponent.avatar || '👤',
    success,
    dronesSent: dronesToSend,
    chance:    successChance,
    date:      new Date().toLocaleString('sr'),
    data:      success ? buildEspReport(opponent, revealLevel) : null,
  };

  espReports.unshift(report);
  if (espReports.length > 20) espReports.pop();

  if (success) {
    toast(`✅ Špijunaža uspješna! (${dronesToSend} dronova, ${successChance.toFixed(0)}% šansa)`, 'ok');
    addLog(`🕵️ Špijunaža uspješna: ${opponent.name} — ${dronesToSend} dronova potrošeno`);
    if (typeof trackDailyEsp === 'function') trackDailyEsp();;
  } else {
    toast(`❌ Špijunaža neuspješna! ${dronesToSend} dronova izgubljeno.`, 'err');
    addLog(`❌ Špijunaža neuspješna: ${opponent.name} — ${dronesToSend} dronova izgubljeno`);
  }

  updateResUI();
  renderEspionage();
  saveGame();
  showEspReport(report);
}

// ── IZGRADI IZVJEŠTAJ ──
function buildEspReport(opponent, revealLevel) {
  const data = { power: opponent.power, rating: opponent.rating };

  if (revealLevel >= 1) {
    data.hp = opponent.fleet
      ? opponent.fleet.reduce((a, g) => a + g.hp, 0)
      : opponent.power * 2;
  }
  if (revealLevel >= 2) {
    data.dps    = opponent.fleet ? opponent.fleet.reduce((a, g) => a + g.dps, 0) : opponent.power * 0.1;
    data.shield = opponent.fleet ? opponent.fleet.reduce((a, g) => a + (g.shield || 0), 0) : opponent.power * 0.5;
  }
  if (revealLevel >= 3) {
    data.armors = opponent.fleet ? [...new Set(opponent.fleet.map(g => g.armor))] : ['Unknown'];
    data.groups = opponent.fleet ? opponent.fleet.length : '?';
  }
  if (revealLevel >= 4) {
    data.full      = true;
    data.critAdv   = '+10% kritičan udar u borbi vs ovog protivnika';
    if (opponent.resources) data.resources = opponent.resources;
  }
  return data;
}

// ── PRIKAŽI IZVJEŠTAJ ──
function showEspReport(report) {
  const revealLevel = getEspionageRevealLevel();
  const d           = report.data;

  const body = report.success && d ? `
    <div style="margin-bottom:12px;display:flex;align-items:center;gap:12px">
      <div style="font-size:2rem">${report.avatar}</div>
      <div>
        <div style="font-size:0.9rem;font-weight:700;color:white">${report.opponent}</div>
        <div style="font-size:0.65rem;color:#6a90b8">
          ${report.date} · ${report.dronesSent} dronova · ${report.chance?.toFixed(0)}% šansa
        </div>
      </div>
    </div>

    <div style="background:rgba(0,0,0,0.3);border-radius:8px;padding:12px;margin-bottom:12px">
      <div style="font-size:0.65rem;color:#6a90b8;margin-bottom:8px;letter-spacing:2px">IZVJEŠTAJ</div>
      <div style="font-size:0.72rem;font-family:'Share Tech Mono',monospace;line-height:2">
        <div>⚡ Power: <span style="color:#00d4ff">${fmt(d.power)}</span></div>
        <div>🏆 Rating: <span style="color:#ffcc44">${d.rating}</span></div>
        ${d.hp      !== undefined ? `<div>❤️ HP: <span style="color:#00ff88">${fmt(d.hp)}</span></div>` : ''}
        ${d.dps     !== undefined ? `<div>⚔️ DPS: <span style="color:#ff4444">${fmt(d.dps)}</span></div>` : ''}
        ${d.shield  !== undefined ? `<div>🛡️ Shield: <span style="color:#00d4ff">${fmt(d.shield)}</span></div>` : ''}
        ${d.armors  !== undefined ? `<div>🔰 Oklop: <span style="color:#ff8833">${d.armors.join(', ')}</span></div>` : ''}
        ${d.groups  !== undefined ? `<div>🚀 Grupe: <span style="color:white">${d.groups}</span></div>` : ''}
        ${d.resources ? `
          <div style="margin-top:6px;padding-top:6px;border-top:1px solid rgba(255,255,255,0.05)">
            🔩${fmt(d.resources.metal)} 💎${fmt(d.resources.crystal)} ⛽${fmt(d.resources.he3)}
          </div>` : ''}
        ${d.critAdv ? `
          <div style="margin-top:6px;padding:5px 8px;background:rgba(255,204,68,0.1);
            border-radius:4px;color:#ffcc44;font-size:0.65rem">⭐ ${d.critAdv}</div>` : ''}
      </div>
    </div>

    ${revealLevel < 4 ? `
      <div style="font-size:0.65rem;color:#6a90b8;background:rgba(0,0,0,0.2);
        padding:8px;border-radius:6px">
        🔬 Research Espionage ${
          revealLevel === 0 ? 'Lv.25 → otkrij HP' :
          revealLevel === 1 ? 'Lv.50 → otkrij opremu' :
          revealLevel === 2 ? 'Lv.75 → otkrij module' : 'Lv.100 → sve + krit'
        }
      </div>` : ''}
  ` : `
    <div style="text-align:center;padding:20px">
      <div style="font-size:2rem;margin-bottom:8px">❌</div>
      <div style="font-size:0.85rem;color:#ff3355;margin-bottom:8px">Špijunaža neuspješna!</div>
      <div style="font-size:0.72rem;color:#6a90b8;margin-bottom:8px">
        ${report.dronesSent} dronova izgubljeno. Šansa bila: ${report.chance?.toFixed(0)}%
      </div>
      <div style="font-size:0.72rem;color:#6a90b8">
        Povećaj Research Espionage ili pošalji više dronova.
      </div>
    </div>`;

  openModal(`🕵️ Izvještaj: ${report.opponent}`, body, [
    { label: 'Zatvori', fn: closeModal }
  ]);
}

// ── RENDER ESPIONAGE PANELA ──
function renderEspionage() {
  const el = document.getElementById('espionageContent');
  if (!el) return;

  const espLvl      = getEspionageLevel();
  const revealLevel = getEspionageRevealLevel();
  const successPct  = getEspSuccessChance(0, 0);
  const canBuy1     = canAfford(ESP_DRONE_COST);

  el.innerHTML = `
    <!-- Stats -->
    <div class="card" style="margin-bottom:16px">
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;text-align:center">
        <div>
          <div style="font-size:0.65rem;color:#6a90b8;margin-bottom:4px">DRONOVI</div>
          <div style="font-size:1.3rem;font-family:'Orbitron',monospace;color:#aa44ff">
            ${espDrones} / ${ESP_DRONE_MAX}
          </div>
        </div>
        <div>
          <div style="font-size:0.65rem;color:#6a90b8;margin-bottom:4px">ESP RESEARCH</div>
          <div style="font-size:1.3rem;font-family:'Orbitron',monospace;color:#4488ff">Lv.${espLvl}</div>
        </div>
        <div>
          <div style="font-size:0.65rem;color:#6a90b8;margin-bottom:4px">BAZNA ŠANSA</div>
          <div style="font-size:1.3rem;font-family:'Orbitron',monospace;color:#00ff88">${successPct.toFixed(0)}%</div>
        </div>
        <div>
          <div style="font-size:0.65rem;color:#6a90b8;margin-bottom:4px">MAX ŠANSA</div>
          <div style="font-size:1.3rem;font-family:'Orbitron',monospace;color:#ffcc44">
            ${Math.min(95, successPct + ESP_DRONE_MAX_BONUS).toFixed(0)}%
          </div>
        </div>
      </div>
    </div>

    <!-- Milestone info -->
    <div class="card" style="margin-bottom:16px">
      <div style="font-size:0.72rem;color:#6a90b8;margin-bottom:10px;font-weight:700">🔬 ESPIONAGE MILESTONES</div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">
        ${[
          { lvl:25,  label:'Vidi HP',     icon:'❤️'  },
          { lvl:50,  label:'Vidi opremu', icon:'⚔️'  },
          { lvl:75,  label:'Vidi module', icon:'⚙️'  },
          { lvl:100, label:'Sve + krit',  icon:'👑'  },
        ].map(m => `
          <div style="text-align:center;padding:8px;border-radius:6px;
            background:${espLvl >= m.lvl ? 'rgba(0,255,136,0.08)' : 'rgba(255,255,255,0.03)'};
            border:1px solid ${espLvl >= m.lvl ? 'rgba(0,255,136,0.3)' : 'rgba(255,255,255,0.08)'}">
            <div style="font-size:1.2rem">${espLvl >= m.lvl ? m.icon : '🔒'}</div>
            <div style="font-size:0.6rem;color:${espLvl >= m.lvl ? '#00ff88' : '#6a90b8'};margin-top:4px">
              Lv.${m.lvl}<br>${m.label}
            </div>
          </div>`).join('')}
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">

      <!-- Lijevo -->
      <div>
        <!-- Kupi drone -->
        <div class="card" style="margin-bottom:12px">
          <div style="font-size:0.82rem;font-weight:700;color:#aa44ff;margin-bottom:10px">🤖 KUPI DRONOVE</div>
          <div style="font-size:0.65rem;font-family:'Share Tech Mono',monospace;margin-bottom:10px;line-height:1.8;color:#6a90b8">
            <span class="${canBuy1?'ck':'cn'}">🔩 ${fmt(ESP_DRONE_COST.metal)}</span>
            <span class="${canBuy1?'ck':'cn'}"> 💎 ${fmt(ESP_DRONE_COST.crystal)}</span>
            <span class="${canBuy1?'ck':'cn'}"> ⛽ ${fmt(ESP_DRONE_COST.he3)}</span>
            <span style="color:#6a90b8"> / dron</span>
          </div>
          <div style="font-size:0.65rem;color:#6a90b8;margin-bottom:8px">
            💡 Svaki dron = +1% šansa uspjeha (max +${ESP_DRONE_MAX_BONUS}%)<br>
            ⚠️ Neuspjeh = svi poslani dronovi izgubljeni
          </div>
          <div style="display:flex;gap:6px">
            ${[1,5,10].map(n => {
              const cost = { metal: ESP_DRONE_COST.metal*n, crystal: ESP_DRONE_COST.crystal*n, he3: ESP_DRONE_COST.he3*n };
              const ok   = canAfford(cost) && espDrones + n <= ESP_DRONE_MAX;
              return `<button class="btn ${ok?'btn-g':''}" style="flex:1;font-size:0.72rem"
                onclick="buyEspDrone(${n})" ${ok?'':'disabled'}>+${n}</button>`;
            }).join('')}
          </div>
        </div>

        <!-- Špijuniraj -->
        <div class="card">
          <div style="font-size:0.82rem;font-weight:700;color:#aa44ff;margin-bottom:10px">🎯 ŠPIJUNIRAJ</div>
          ${window._currentOpponents && window._currentOpponents.length > 0 ? `
            <div style="font-size:0.65rem;color:#6a90b8;margin-bottom:8px">
              Odaberi protivnika i pošalji dronove:
            </div>
            ${window._currentOpponents.map((opp, idx) => `
              <div style="display:flex;justify-content:space-between;align-items:center;
                padding:6px 8px;background:rgba(0,0,0,0.3);border-radius:4px;margin-bottom:4px">
                <div>
                  <span style="font-size:0.8rem">${opp.avatar}</span>
                  <span style="font-size:0.72rem;color:white;margin-left:6px">${opp.name}</span>
                  <span style="font-size:0.6rem;color:#6a90b8;margin-left:4px">(${fmt(opp.power)})</span>
                </div>
                <button class="btn btn-gold" style="font-size:0.62rem;padding:2px 8px"
                  onclick="openSendDronesModal(${idx})"
                  ${espDrones <= 0 ? 'disabled' : ''}>
                  🕵️ Špijuniraj
                </button>
              </div>`).join('')}
          ` : `
            <div style="font-size:0.72rem;color:#6a90b8;text-align:center;padding:16px">
              Idi u <strong style="color:#00d4ff">PvP → Osvježi listu</strong><br>
              pa se vrati ovdje za špijunažu.
            </div>`}
        </div>
      </div>

      <!-- Desno: Izvještaji -->
      <div>
        <div class="page-title" style="font-size:0.85rem">📋 IZVJEŠTAJI</div>
        ${espReports.length === 0
          ? '<div class="card" style="text-align:center;color:#6a90b8;padding:20px">Nema izvještaja.</div>'
          : espReports.map(r => `
            <div class="card" style="margin-bottom:8px;cursor:pointer;
              border-color:${r.success ? 'rgba(0,255,136,0.2)' : 'rgba(255,51,85,0.2)'}"
              onclick="showEspReport(espReports.find(x=>x.id===${r.id}))">
              <div style="display:flex;align-items:center;gap:8px">
                <div style="font-size:1.2rem">${r.avatar}</div>
                <div style="flex:1">
                  <div style="font-size:0.78rem;font-weight:700;
                    color:${r.success ? '#00ff88' : '#ff3355'}">
                    ${r.success ? '✅' : '❌'} ${r.opponent}
                  </div>
                  <div style="font-size:0.6rem;color:#6a90b8">
                    ${r.date} · ${r.dronesSent || 1} dronova · ${r.chance?.toFixed(0) || '?'}%
                  </div>
                </div>
                <div style="font-size:0.65rem;color:#6a90b8">👁️</div>
              </div>
            </div>`).join('')}
      </div>

    </div>
  `;
}