// ============================================================
// HIVE GALAXY — js/systems/events.js
// Galaktički eventi — random pojave tokom igre
// ============================================================

// ── DEFINICIJE EVENATA ──
const GALAXY_EVENTS = [
  // ── POZITIVNI ──
  {
    id:       'meteor_shower',
    name:     'Meteorska Kiša',
    icon:     '☄️',
    type:     'positive',
    color:    '#ffcc44',
    desc:     'Meteor pljusak donosi sirove materijale!',
    weight:   20,
    effect: (mult) => {
      const metal = Math.floor(500 * mult);
      R.metal += metal;
      updateResUI();
      return `+${fmt(metal)} metala`;
    },
  },
  {
    id:       'crystal_nebula',
    name:     'Kristalna Magla',
    icon:     '💎',
    type:     'positive',
    color:    '#4488ff',
    desc:     'Rijetka magla kristalizira materije u vakuumu.',
    weight:   15,
    effect: (mult) => {
      const crystal = Math.floor(300 * mult);
      R.crystal += crystal;
      updateResUI();
      return `+${fmt(crystal)} crystala`;
    },
  },
  {
    id:       'he3_deposit',
    name:     'He3 Naslage',
    icon:     '⛽',
    type:     'positive',
    color:    '#00ff88',
    desc:     'Sonde otkrile bogato He3 nalazište.',
    weight:   15,
    effect: (mult) => {
      const he3 = Math.floor(200 * mult);
      R.he3 += he3;
      updateResUI();
      return `+${fmt(he3)} He3`;
    },
  },
  {
    id:       'energy_surge',
    name:     'Energetski Pulsni Val',
    icon:     '⚡',
    type:     'positive',
    color:    '#00d4ff',
    desc:     'Kosmički val puni energetske sisteme baze!',
    weight:   12,
    effect: () => {
      R.energy = getEnergyMax();
      updateResUI();
      return 'Energija popunjena na MAX';
    },
  },
  {
    id:       'ancient_signal',
    name:     'Drevni Signal',
    icon:     '📡',
    type:     'positive',
    color:    '#aa44ff',
    desc:     'Dekodiran signal drevne civilizacije — donosi znanje.',
    weight:   8,
    effect: (mult) => {
      const xp = Math.floor(500 * mult);
      addExp(xp);
      return `+${fmt(xp)} XP`;
    },
  },
  {
    id:       'salvage_field',
    name:     'Polje Ostataka',
    icon:     '🔧',
    type:     'positive',
    color:    '#ff8833',
    desc:     'Ostataci bitke sadrže upotrebljive dijelove.',
    weight:   10,
    effect: (mult) => {
      const m = Math.floor(300 * mult);
      const c = Math.floor(150 * mult);
      R.metal   += m;
      R.crystal += c;
      updateResUI();
      return `+${fmt(m)} metala, +${fmt(c)} crystala`;
    },
  },
  {
    id:       'instance_key_found',
    name:     'Pronađen Ključ Instance',
    icon:     '🗝️',
    type:     'positive',
    color:    '#ffcc44',
    desc:     'Patrol naišao na izgubljen ključ instance!',
    weight:   6,
    effect: () => {
      R.instanceKeys = (R.instanceKeys || 0) + 1;
      updateResUI();
      return '+1 🗝️ Ključ Instance';
    },
  },
  {
    id:       'friendly_trader',
    name:     'Prijateljski Trader',
    icon:     '🤝',
    type:     'positive',
    color:    '#00ff88',
    desc:     'Trgovac nudi povoljnu razmjenu resursa.',
    weight:   8,
    effect: (mult) => {
      const m = Math.floor(200 * mult);
      const c = Math.floor(200 * mult);
      const h = Math.floor(100 * mult);
      R.metal   += m;
      R.crystal += c;
      R.he3     += h;
      updateResUI();
      return `+${fmt(m)} 🔩 +${fmt(c)} 💎 +${fmt(h)} ⛽`;
    },
  },

  // ── NEGATIVNI ──
  {
    id:       'pirate_raid',
    name:     'Piratski Napad',
    icon:     '☠️',
    type:     'negative',
    color:    '#ff3355',
    desc:     'Pirati su napali transportne brodove!',
    weight:   18,
    effect: (mult) => {
      const lost = Math.floor(Math.min(R.metal * 0.05, 500 * mult));
      R.metal = Math.max(0, R.metal - lost);
      updateResUI();
      return `-${fmt(lost)} metala (pirati)`;
    },
  },
  {
    id:       'solar_flare',
    name:     'Solarna Baklja',
    icon:     '☀️',
    type:     'negative',
    color:    '#ff8833',
    desc:     'Solarna baklja oštećuje energetsku mrežu!',
    weight:   12,
    effect: () => {
      const lost = Math.floor(R.energy * 0.3);
      R.energy   = Math.max(0, R.energy - lost);
      updateResUI();
      return `-${lost} energije (baklja)`;
    },
  },
  {
    id:       'crystal_storm',
    name:     'Kristalna Oluja',
    icon:     '🌪️',
    type:     'negative',
    color:    '#4488ff',
    desc:     'Kristalna oluja oštećuje rudnike!',
    weight:   10,
    effect: (mult) => {
      const lost = Math.floor(Math.min(R.crystal * 0.05, 300 * mult));
      R.crystal  = Math.max(0, R.crystal - lost);
      updateResUI();
      return `-${fmt(lost)} crystala (oluja)`;
    },
  },
  {
    id:       'equipment_failure',
    name:     'Kvar Opreme',
    icon:     '⚙️',
    type:     'negative',
    color:    '#ffcc44',
    desc:     'Tehnički kvar privremeno smanjuje produkciju.',
    weight:   8,
    effect: () => {
      // Privremena redukcija produkcije — 30 sekundi
      window._prodPenalty = 0.5;
      setTimeout(() => { window._prodPenalty = 1.0; }, 30000);
      return 'Produkcija -50% na 30s';
    },
  },

  // ── NEUTRALNI ──
  {
    id:       'unknown_signal',
    name:     'Nepoznat Signal',
    icon:     '❓',
    type:     'neutral',
    color:    '#6a90b8',
    desc:     'Tajnovit signal iz dubine galaksije.',
    weight:   5,
    effect: () => {
      R.score += 100;
      updateResUI();
      return 'Zabilježen u evidenciju. +100 score';
    },
  },
  {
    id:       'void_anomaly',
    name:     'Anomalija Praznine',
    icon:     '🌀',
    type:     'neutral',
    color:    '#aa44ff',
    desc:     'Prostorno-vremenska anomalija detektovana.',
    weight:   4,
    effect: (mult) => {
      // Nasumično: dobij ili izgubi
      if (Math.random() > 0.5) {
        const m = Math.floor(400 * mult);
        R.metal += m;
        updateResUI();
        return `Anomalija stabilizovana — +${fmt(m)} metala`;
      } else {
        R.energy = Math.max(0, R.energy - 20);
        updateResUI();
        return 'Anomalija destabilizovana — -20 energije';
      }
    },
  },
];

// ── EVENT STATE ──
window._eventHistory    = window._eventHistory    || [];
window._lastEventTime   = window._lastEventTime   || 0;
window._eventCooldown   = 120; // sekunde između evenata
window._prodPenalty     = window._prodPenalty     || 1.0;

// ── POKRETANJE EVENTOVA (tick) ──
function tickEvents() {
  const now     = Math.floor(Date.now() / 1000);
  const elapsed = now - window._lastEventTime;

  if (elapsed < window._eventCooldown) return;

  // 30% šansa po tick intervalu
  if (Math.random() > 0.30) return;

  window._lastEventTime = now;
  triggerRandomEvent();
}

// ── OKINUTI RANDOM EVENT ──
function triggerRandomEvent() {
  // Weighted random odabir
  const totalWeight = GALAXY_EVENTS.reduce((sum, e) => sum + e.weight, 0);
  let rand          = Math.random() * totalWeight;
  let event         = GALAXY_EVENTS[0];

  for (const e of GALAXY_EVENTS) {
    rand -= e.weight;
    if (rand <= 0) { event = e; break; }
  }

  // Mult baziran na progresu (HQ level)
  const mult   = Math.max(1, (buildings.hq?.level || 1) * 0.5);

  // Primijeni efekat
  const result = event.effect(mult);

  // Loguj
  const typeText = event.type === 'positive' ? '🌟' : event.type === 'negative' ? '⚠️' : 'ℹ️';
  addLog(`${event.icon} ${event.name}: ${result}`);
  toast(`${event.icon} ${event.name} — ${result}`, event.type === 'positive' ? 'ok' : event.type === 'negative' ? 'warn' : 'inf');

  // Spremi u historiju
  window._eventHistory.unshift({
    id:        event.id,
    name:      event.name,
    icon:      event.icon,
    type:      event.type,
    color:     event.color,
    result,
    time:      Date.now(),
  });

  // Max 20 u historiji
  if (window._eventHistory.length > 20) window._eventHistory.pop();

  // Ažuriraj panel ako je otvoren
  if (document.getElementById('panel-missions')?.classList.contains('active')) {
    if (typeof renderMissions === 'function') renderMissions();
  }
}

// ── RENDER EVENTS HISTORIJA (za missions panel) ──
function renderEventHistory() {
  const history = window._eventHistory;
  if (history.length === 0) {
    return `<div style="text-align:center;color:#6a90b8;padding:20px;font-size:0.75rem">
      Nema zabilježenih galaktičkih evenata.
    </div>`;
  }

  return history.map(ev => {
    const time = new Date(ev.time).toLocaleTimeString('sr', {
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    const bgColor = ev.type === 'positive' ? 'rgba(0,255,136,0.05)' :
                    ev.type === 'negative' ? 'rgba(255,51,85,0.05)' :
                    'rgba(106,144,184,0.05)';

    return `
      <div style="background:${bgColor};border:1px solid ${ev.color}22;
        border-radius:6px;padding:10px;margin-bottom:6px;
        display:flex;align-items:center;gap:10px">
        <div style="font-size:1.5rem">${ev.icon}</div>
        <div style="flex:1">
          <div style="font-size:0.78rem;font-weight:700;color:${ev.color}">${ev.name}</div>
          <div style="font-size:0.65rem;color:#6a90b8;margin-top:2px">${ev.result}</div>
        </div>
        <div style="font-size:0.58rem;color:#6a90b8;white-space:nowrap">${time}</div>
      </div>`;
  }).join('');
}

// ── POKRETANJE TICK-A (dodaj u main.js) ──
// setInterval(tickEvents, 30000); // svakih 30s provjera
// Automatski start ako main.js već radi
if (typeof setInterval !== 'undefined') {
  setInterval(tickEvents, 30000);
}