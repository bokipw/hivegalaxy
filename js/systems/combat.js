// ============================================================
// HIVE GALAXY — js/systems/combat.js
// Automatska simulacija borbe — rundni sistem
// ============================================================

// ── STANJE AKTIVNE BORBE ──
let activeBattle = null;

// ── OKLOP OTPORNOSTI ──
// ARMOR_RESISTANCE je definisan u data/ships.js
// Vrijednosti su u % (75 = 75% damage = 0.75x multiplikator)

// ── INICIJALIZACIJA BORBE ──
function initBattle(playerSlots, enemyGroups, instanceData) {
  // Pripremi igrača
  const playerSide = playerSlots
    .filter(s => s !== null)
    .map((slot, idx) => {
      const ship   = getShipById(slot.ship_id);
      const stats  = calcSlotStats(slot);
      return {
        id:         `p_${idx}`,
        side:       'player',
        name:       shipDesigns.find(d => d.id === slot.design_id)?.name || ship?.name || 'Brod',
        ship_id:    slot.ship_id,
        slot,
        ship,
        count:      slot.count,
        hp:         stats.hp,
        maxHp:      stats.hp,
        shield:     stats.shield,
        maxShield:  stats.shield,
        dps:        stats.dps,
        agility:    stats.agility,
        speed:      stats.speed,
        armor:      ship?.armor || 'Light',
        effects:    [],   // burn, shield_disable, stun
        alive:      true,
      };
    });

  // Pripremi neprijatelja
  const enemySide = enemyGroups.map((group, idx) => {
    return {
      id:        `e_${idx}`,
      side:      'enemy',
      name:      group.name,
      ship_id:   group.ship_id || null,
      count:     group.count,
      hp:        group.hp,
      maxHp:     group.hp,
      shield:    group.shield || 0,
      maxShield: group.shield || 0,
      dps:       group.dps,
      agility:   group.agility || 0,
      speed:     group.speed || 1,
      armor:     group.armor || 'Light',
      effects:   [],
      alive:     true,
    };
  });

  activeBattle = {
    instance:    instanceData,
    player:      playerSide,
    enemy:       enemySide,
    round:       0,
    maxRounds:   50,
    log:         [],
    status:      'active',  // active, victory, defeat, draw
    rewards:     null,
  };

  return activeBattle;
}

// ── SIMULIRAJ CIJELU BORBU ──
function simulateBattle(playerSlots, enemyGroups, instanceData) {
  const battle = initBattle(playerSlots, enemyGroups, instanceData);

  while (battle.status === 'active' && battle.round < battle.maxRounds) {
    simulateRound(battle);
  }

  if (battle.status === 'active') {
    battle.status = 'draw';
    battle.log.push({ round: battle.round, type: 'info', msg: '⏱️ Borba je završena izjednačenjem (max rundi).' });
  }

  return battle;
}

// ── JEDNA RUNDA ──
function simulateRound(battle) {
  battle.round++;
  const round = battle.round;
  battle.log.push({ round, type: 'round', msg: `━━━ RUNDA ${round} ━━━` });

  // Svi aktivni učesnici
  const allUnits = [...battle.player, ...battle.enemy].filter(u => u.alive);

  // Sortiraj po speed (brži napada prvi)
  allUnits.sort((a, b) => b.speed - a.speed);

  for (const attacker of allUnits) {
    if (!attacker.alive) continue;

    // Procesiraj efekte na početku poteza
    processEffects(attacker, battle);
    if (!attacker.alive) continue;

    // Odaberi metu
    const enemies = attacker.side === 'player' ? battle.enemy : battle.player;
    const targets = enemies.filter(e => e.alive);
    if (targets.length === 0) break;

    // Napadni
    performAttack(attacker, targets, battle, round);
  }

  // Provjeri kraj borbe
  const playerAlive = battle.player.some(u => u.alive);
  const enemyAlive  = battle.enemy.some(u => u.alive);

  if (!playerAlive && !enemyAlive) {
    battle.status = 'draw';
    battle.log.push({ round, type: 'result', msg: '💥 Obje strane uništene — izjednačenje!' });
  } else if (!enemyAlive) {
    battle.status = 'victory';
    battle.log.push({ round, type: 'result', msg: '🏆 POBJEDA!' });
  } else if (!playerAlive) {
    battle.status = 'defeat';
    battle.log.push({ round, type: 'result', msg: '💀 PORAZ!' });
  }
}

// ── NAPAD ──
function performAttack(attacker, targets, battle, round) {
  // Odaberi primarnu metu (najmanji HP)
  const target = targets.reduce((a, b) => a.hp < b.hp ? a : b);

  // Izračunaj štetu
  let dmg = attacker.dps;

  // Oklop otpornost — iz ships.js ARMOR_RESISTANCE (vrijednosti u %)
  const armorType     = target.armor || 'Light';
  const resistance    = (typeof ARMOR_RESISTANCE !== 'undefined' && ARMOR_RESISTANCE[armorType])
                        ? ARMOR_RESISTANCE[armorType]
                        : { Kinetic: 100, Heat: 100, Magnetic: 100, Explosive: 100 };
  const weaponDmgType = getAttackerDmgType(attacker);
  const resistPct     = resistance[weaponDmgType] ?? 100;
  dmg = Math.floor(dmg * (resistPct / 100));

  // Agility = šansa izbjegavanja
  const evadeChance = Math.min(60, target.agility * 0.5);
  if (Math.random() * 100 < evadeChance) {
    battle.log.push({ round, type: 'miss', msg: `💨 ${target.name} izbjegao napad od ${attacker.name}!` });
    return;
  }

  // Kritičan udar (Directional +10%)
  let isCrit = false;
  if (Math.random() < 0.05) {
    dmg    = Math.floor(dmg * 1.5);
    isCrit = true;
  }

  // Primijeni štetu — prvo na shield
  let shieldDmg = 0;
  let hpDmg     = 0;

  if (target.shield > 0) {
    shieldDmg = Math.min(target.shield, dmg);
    target.shield -= shieldDmg;
    hpDmg = dmg - shieldDmg;
  } else {
    hpDmg = dmg;
  }

  target.hp = Math.max(0, target.hp - hpDmg);

  // Log
  const critTxt  = isCrit ? ' 💥KRIT!' : '';
  const shldTxt  = shieldDmg > 0 ? ` (${shieldDmg} shield, ${hpDmg} HP)` : '';
  battle.log.push({
    round,
    type: 'attack',
    msg:  `⚔️ ${attacker.name} → ${target.name}: ${dmg} štete${shldTxt}${critTxt}`,
    dmg, attacker: attacker.id, target: target.id,
  });

  // Specijalni efekti
  applyWeaponEffect(attacker, target, battle, round);

  // Provjeri da li je meta uništena
  if (target.hp <= 0) {
    target.alive = false;
    target.hp    = 0;
    battle.log.push({ round, type: 'destroy', msg: `💀 ${target.name} UNIŠTEN!` });
  }
}

// ── TIP ŠTETE NAPADAČA ──
function getAttackerDmgType(attacker) {
  if (!attacker.slot) return 'Kinetic';
  const weapons = ['weapon_1','weapon_2','weapon_3','weapon_4'];
  for (const w of weapons) {
    const wid = attacker.slot[w];
    if (wid) {
      const wpn = getWeaponById(wid);
      if (wpn) return wpn.dmgType || 'Kinetic';
    }
  }
  return 'Kinetic';
}

// ── SPECIJALNI EFEKTI ORUŽJA ──
function applyWeaponEffect(attacker, target, battle, round) {
  if (!attacker.slot) return;

  const weapons = ['weapon_1','weapon_2','weapon_3','weapon_4'];
  for (const w of weapons) {
    const wid = attacker.slot[w];
    if (!wid) continue;
    const wpn = getWeaponById(wid);
    if (!wpn?.special) continue;

    const spec = wpn.special;
    const roll = Math.random() * 100;

    // BURN — gorenje
    if (spec.type === 'burn' && roll < spec.chance) {
      target.effects.push({ type: 'burn', duration: spec.duration, dmgPerRound: spec.duration === 2 ? 20 : 35 });
      battle.log.push({ round, type: 'effect', msg: `🔥 ${target.name} gori! (${spec.duration} runde)` });
    }

    // SHIELD DISABLE
    if (spec.type === 'shield_disable' && roll < spec.chance) {
      target.effects.push({ type: 'shield_disable', duration: spec.duration || 1 });
      battle.log.push({ round, type: 'effect', msg: `🧲 ${target.name} shield onesposobljen!` });
    }

    // AREA — pogađa još brodova
    if (spec.type === 'area' && roll < spec.chance) {
      const otherTargets = (attacker.side === 'player' ? battle.enemy : battle.player)
        .filter(e => e.alive && e.id !== target.id)
        .slice(0, spec.extra_targets || 1);
      otherTargets.forEach(t => {
        const areaDmg = Math.floor(attacker.dps * 0.5);
        t.hp = Math.max(0, t.hp - areaDmg);
        battle.log.push({ round, type: 'effect', msg: `💣 Area šteta: ${t.name} -${areaDmg} HP` });
        if (t.hp <= 0) { t.alive = false; battle.log.push({ round, type: 'destroy', msg: `💀 ${t.name} UNIŠTEN!` }); }
      });
    }
  }
}

// ── PROCESIRAJ EFEKTE NA POČETKU POTEZA ──
function processEffects(unit, battle) {
  if (!unit.effects || unit.effects.length === 0) return;

  unit.effects = unit.effects.filter(eff => {
    if (eff.type === 'burn') {
      unit.hp = Math.max(0, unit.hp - eff.dmgPerRound);
      battle.log.push({ round: battle.round, type: 'effect', msg: `🔥 ${unit.name} gori: -${eff.dmgPerRound} HP` });
      if (unit.hp <= 0) {
        unit.alive = false;
        battle.log.push({ round: battle.round, type: 'destroy', msg: `💀 ${unit.name} UNIŠTEN od gorenja!` });
      }
      eff.duration--;
      return eff.duration > 0;
    }

    if (eff.type === 'shield_disable') {
      unit.shield = 0;
      eff.duration--;
      return eff.duration > 0;
    }

    return true;
  });
}

// ── DROP ŠANSE PO TEŽINI INSTANCE ──
function getDropRates(difficulty, type) {
  // Boss i Trial
  if (type === 'boss' || type === 'trial') {
    return { C: 5, R: 25, E: 35, L: 25 };
  }
  // Constellation
  if (type === 'constellation') {
    return { C: 0, R: 10, E: 35, L: 40 };
  }
  // Restricted
  if (type === 'restricted') {
    return { C: 10, R: 30, E: 35, L: 20 };
  }
  // Standard po težini
  if (difficulty <= 5)  return { C: 60, R: 25, E: 10, L: 0  };
  if (difficulty <= 10) return { C: 45, R: 35, E: 15, L: 1  };
  if (difficulty <= 15) return { C: 35, R: 35, E: 20, L: 2  };
  if (difficulty <= 20) return { C: 25, R: 35, E: 25, L: 5  };
  if (difficulty <= 25) return { C: 15, R: 30, E: 30, L: 10 };
  return { C: 15, R: 30, E: 30, L: 15 }; // 26-30
}

// ── RARITY BLUEPRINTA ──
function getBlueprintRarity(itemId) {
  // Prvo provjeri weapons, shields, engines, modules (oni imaju rarity polje)
  const allArrays = [
    ...(typeof WEAPONS !== 'undefined' ? WEAPONS : []),
    ...(typeof SHIELDS !== 'undefined' ? SHIELDS : []),
    ...(typeof ENGINES !== 'undefined' ? ENGINES : []),
    ...(typeof MODULES !== 'undefined' ? MODULES : []),
  ];
  const item = allArrays.find(x => x.id === itemId);
  if (item) return item.rarity || 'C';

  // Zatim provjeri brodove – koristi getShipRarity iz ships.js
  if (typeof getShipRarity === 'function') {
    return getShipRarity(itemId);
  }
  
  // Fallback – stara logika (za svaki slučaj ako getShipRarity ne postoji)
  if (itemId.endsWith('_III')) return 'E';
  if (itemId.endsWith('_II'))  return 'R';
  if (itemId.includes('special')) return 'L';
  return 'C';
}

// ── FRAGMENT COST PO RARITY ──
function getBpFragmentCost(rarity) {
  return BP_FRAGMENT_COST?.[rarity] || 25;
}

// ── DODAJ FRAGMENT ──
function addBlueprintFragment(itemId, count = 1) {
  if (!blueprintFragments[itemId]) blueprintFragments[itemId] = 0;
  blueprintFragments[itemId] += count;

  const needed = getBpFragmentCost(getBlueprintRarity(itemId));
  const current = blueprintFragments[itemId];
  const name = getBpName(itemId);

  toast(`🧩 +${count} fragment: ${name} (${current}/${needed})`, 'inf');
  addLog(`🧩 Fragment: ${name} (${current}/${needed})`);

  // Auto-craft ako ima dovoljno
  if (current >= needed && !ownedBlueprints[itemId]) {
    craftBlueprint(itemId);
  }
}

// ── CRAFT BLUEPRINT IZ FRAGMENATA ──
function craftBlueprint(itemId) {
  const needed = getBpFragmentCost(getBlueprintRarity(itemId));
  if ((blueprintFragments[itemId] || 0) < needed) {
    toast('❌ Nedovoljno fragmenata!', 'err');
    return false;
  }
  blueprintFragments[itemId] -= needed;
  unlockBlueprint(itemId);
  toast(`✅ Blueprint craftovan: ${getBpName(itemId)}!`, 'ok');
  addLog(`✅ Blueprint craftovan iz fragmenata: ${getBpName(itemId)}`);
  if (typeof trackDailyArt === 'function') trackDailyArt();
  saveGame();
  return true;
}

// ── GARANT FRAGMENT — po broju pokušaja ──
function getGuaranteedFragment(instance, prog) {
  const clearCount = prog?.clear_count || 0;
  // Garant fragment svakih X pokušaja bez blueprint dropa
  const guaranteeEvery = instance.difficulty <= 5  ? 5  :
                         instance.difficulty <= 10 ? 8  :
                         instance.difficulty <= 20 ? 10 :
                         instance.difficulty <= 30 ? 12 : 15;

  if (clearCount > 0 && clearCount % guaranteeEvery === 0) {
    // Daj fragment za random neposjedovani blueprint iz instance
    const allDrops = [
      ...(instance.drops?.guaranteed || []),
      ...(instance.drops?.chance || []).map(c => c.item),
    ];
    const missing = allDrops.filter(id => !ownedBlueprints[id]);
    if (missing.length > 0) {
      return missing[Math.floor(Math.random() * missing.length)];
    }
  }
  return null;
}

// ── IZRAČUNAJ NAGRADE ──
function calculateRewards(battle, instanceData, prog) {
  if (battle.status !== 'victory') return null;

  const instance = instanceData;
  const rates    = getDropRates(instance.difficulty, instance.type);

  const rewards = {
    metal:      randomRange(instance.resources.metal[0],   instance.resources.metal[1]),
    crystal:    randomRange(instance.resources.crystal[0], instance.resources.crystal[1]),
    he3:        randomRange(instance.resources.he3[0],     instance.resources.he3[1]),
    blueprints: [],
    fragments:  [], // { itemId, count }
    xp: instance.xp || instance.difficulty * 100,
  };

  // Svi mogući blueprinti iz instance
  const allDrops = [
    ...(instance.drops?.guaranteed || []),
    ...(instance.drops?.chance || []).map(c => c.item),
  ];

  // Filtriraj one koje igrač već nema
  const available = allDrops.filter(id => !ownedBlueprints[id]);

  if (available.length === 0) {
    rewards.allFound = true;
  } else {
    // Za svaki dostupan blueprint — baci kocku po rarity
    available.forEach(id => {
      const rarity = getBlueprintRarity(id);
      const chance = rates[rarity] || 5;
      if (Math.random() * 100 < chance) {
        rewards.blueprints.push(id);
      }
    });

    // Garant fragment po broju pokušaja
    const garantFragment = getGuaranteedFragment(instance, prog);
    if (garantFragment) {
      rewards.fragments.push({ itemId: garantFragment, count: 1, garant: true });
    }

    // Random fragment šansa (20% po prelasku)
    if (Math.random() < 0.20 && available.length > 0) {
      const randomBp = available[Math.floor(Math.random() * available.length)];
      // Dodaj samo ako već nije u fragments
      if (!rewards.fragments.some(f => f.itemId === randomBp)) {
        rewards.fragments.push({ itemId: randomBp, count: 1 });
      }
    }

    const remaining = available.filter(id => !rewards.blueprints.includes(id));
    if (remaining.length === 0) rewards.allFound = true;
  }

  return rewards;
}

// ── PRIMIJENI NAGRADE ──
function applyRewards(rewards) {
  if (!rewards) return;

  R.metal   += rewards.metal;
  R.crystal += rewards.crystal;
  R.he3     += rewards.he3;
  R.score   += rewards.xp;

  addExp(rewards.xp);

  // Blueprinti
  rewards.blueprints.forEach(id => unlockBlueprint(id));

  // Fragmenti
  if (rewards.fragments && rewards.fragments.length > 0) {
    rewards.fragments.forEach(f => addBlueprintFragment(f.itemId, f.count));
  }

  updateResUI();
  saveGame();
}

// ── GUBITCI IGRAČA ──
function calculatePlayerLosses(battle) {
  const losses = [];
  battle.player.forEach((unit, idx) => {
    if (!unit.alive) {
      losses.push({ slot: idx, name: unit.name, count: unit.count });
    } else if (unit.hp < unit.maxHp) {
      // Proporcionalni gubitci
      const pctLost  = 1 - (unit.hp / unit.maxHp);
      const shipsLost = Math.floor(unit.count * pctLost);
      if (shipsLost > 0) losses.push({ slot: idx, name: unit.name, count: shipsLost, partial: true });
    }
  });
  return losses;
}

function applyPlayerLosses(battle) {
  battle.player.forEach((unit, idx) => {
    const slot = fleet[idx];
    if (!slot) return;

    if (!unit.alive) {
      // Slot potpuno uništen
      fleet[idx] = null;
      addLog(`💀 ${unit.name} — svi brodovi uništeni u borbi.`);
    } else if (unit.hp < unit.maxHp) {
      // Proporcionalni gubitci
      const pctSurvived = unit.hp / unit.maxHp;
      const survived    = Math.max(1, Math.floor(slot.count * pctSurvived));
      const lost        = slot.count - survived;
      slot.count        = survived;
      if (lost > 0) addLog(`⚔️ ${unit.name} — izgubljeno ${lost} brodova.`);
    }
  });
}

// ── HELPER ──
function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ── RENDER BATTLE REZULTATA ──
function renderBattleResult(battle, rewards) {
  const isVictory = battle.status === 'victory';
  const isDraw    = battle.status === 'draw';
  const losses    = calculatePlayerLosses(battle);

  const statusColor = isVictory ? '#00ff88' : isDraw ? '#ffcc44' : '#ff3355';
  const statusIcon  = isVictory ? '🏆' : isDraw ? '⚖️' : '💀';
  const statusText  = isVictory ? 'POBJEDA' : isDraw ? 'IZJEDNAČENJE' : 'PORAZ';

  const body = `
    <!-- Status -->
    <div style="text-align:center;margin-bottom:20px">
      <div style="font-size:2.5rem;margin-bottom:8px">${statusIcon}</div>
      <div style="font-family:'Orbitron',monospace;font-size:1.4rem;color:${statusColor};
        text-shadow:0 0 20px ${statusColor}44">${statusText}</div>
      <div style="font-size:0.72rem;color:#6a90b8;margin-top:4px">
        Završeno u ${battle.round} rundi
      </div>
    </div>

    <!-- Nagrade -->
    ${isVictory && rewards ? `
      <div style="background:rgba(0,255,136,0.05);border:1px solid rgba(0,255,136,0.2);
        border-radius:8px;padding:14px;margin-bottom:16px">
        <div style="font-size:0.72rem;color:#00ff88;font-weight:700;margin-bottom:10px">🎁 NAGRADE</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;text-align:center;margin-bottom:10px">
          <div><div style="font-size:0.62rem;color:#6a90b8">METAL</div>
            <div style="color:white;font-family:'Share Tech Mono',monospace">+${fmt(rewards.metal)}</div></div>
          <div><div style="font-size:0.62rem;color:#6a90b8">CRYSTAL</div>
            <div style="color:white;font-family:'Share Tech Mono',monospace">+${fmt(rewards.crystal)}</div></div>
          <div><div style="font-size:0.62rem;color:#6a90b8">HE3</div>
            <div style="color:white;font-family:'Share Tech Mono',monospace">+${fmt(rewards.he3)}</div></div>
        </div>
        ${rewards.blueprints.length > 0 ? `
          <div style="font-size:0.65rem;color:#6a90b8;margin-bottom:6px">BLUEPRINTI:</div>
          <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:6px">
            ${rewards.blueprints.map(id => `
              <span style="background:rgba(0,212,255,0.1);border:1px solid rgba(0,212,255,0.3);
                border-radius:4px;padding:2px 8px;font-size:0.65rem;color:#00d4ff">
                📋 ${getBpName(id)}
              </span>`).join('')}
          </div>` : ''}
        ${rewards.fragments && rewards.fragments.length > 0 ? `
          <div style="font-size:0.65rem;color:#6a90b8;margin-bottom:6px">FRAGMENTI:</div>
          <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:6px">
            ${rewards.fragments.map(f => {
              const needed  = getBpFragmentCost(getBlueprintRarity(f.itemId));
              const current = (blueprintFragments[f.itemId] || 0);
              return `<span style="background:rgba(170,68,255,0.1);border:1px solid rgba(170,68,255,0.3);
                border-radius:4px;padding:2px 8px;font-size:0.65rem;color:#aa44ff">
                🧩 ${getBpName(f.itemId)} (${current}/${needed})${f.garant ? ' ⭐GARANT' : ''}
              </span>`;
            }).join('')}
          </div>` : ''}
        <div style="font-size:0.65rem;color:#ffcc44">⭐ +${rewards.xp} XP</div>
      </div>` : ''}

    <!-- Gubitci -->
    ${losses.length > 0 ? `
      <div style="background:rgba(255,51,85,0.05);border:1px solid rgba(255,51,85,0.2);
        border-radius:8px;padding:14px;margin-bottom:16px">
        <div style="font-size:0.72rem;color:#ff3355;font-weight:700;margin-bottom:8px">💀 GUBICI</div>
        ${losses.map(l => `
          <div style="font-size:0.72rem;color:#6a90b8;margin-bottom:4px">
            ${l.partial ? '⚠️' : '💀'} ${l.name}: 
            <span style="color:white">-${fmt(l.count)} brodova</span>
          </div>`).join('')}
      </div>` : '<div style="font-size:0.72rem;color:#00ff88;margin-bottom:16px">✅ Bez gubitaka!</div>'}

    <!-- Battle Log -->
    <div style="background:rgba(0,0,0,0.4);border-radius:8px;padding:12px;
      max-height:200px;overflow-y:auto;font-size:0.65rem;font-family:'Share Tech Mono',monospace">
      <div style="color:#6a90b8;margin-bottom:6px;font-size:0.6rem">BATTLE LOG:</div>
      ${battle.log.map(entry => {
        const color = entry.type === 'round'   ? '#00d4ff' :
                      entry.type === 'attack'  ? '#b0cce8' :
                      entry.type === 'destroy' ? '#ff3355' :
                      entry.type === 'effect'  ? '#ffcc44' :
                      entry.type === 'result'  ? '#00ff88' :
                      entry.type === 'miss'    ? '#6a90b8' : '#6a90b8';
        return `<div style="color:${color};margin-bottom:2px">${entry.msg}</div>`;
      }).join('')}
    </div>
  `;

  openModal(
    `${statusIcon} Rezultat borbe — ${battle.instance?.name || 'Instanca'}`,
    body,
    [{ label: 'Zatvori', fn: closeModal }]
  );
}