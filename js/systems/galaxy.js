// ============================================================
// HIVE GALAXY — PRO V4 COMPLETE (zvezde + imena + baza centar)
// ============================================================

const PLANET_ICONS = {rocky:'🪨',crystal:'💎',gas:'💨',balanced:'🌍',barren:'🏜️',volcanic:'🌋',frozen:'❄️',nebula:'🌌'};
const FALLBACK = [
  {id:'xerath_iv',name:'Xerath IV',type:'rocky',distance:1},{id:'kelos_prime',name:'Kelos Prime',type:'crystal',distance:1},
  {id:'vorn_ii',name:'Vorn II',type:'gas',distance:2},{id:'draxis_vii',name:'Draxis VII',type:'balanced',distance:2},
  {id:'solenne_iii',name:'Solenne III',type:'barren',distance:2},{id:'tyrant_belt',name:'Tyrant Belt',type:'volcanic',distance:3},
  {id:'nova_kesh',name:'Nova Kesh',type:'frozen',distance:3},{id:'ashfall_v',name:'Ashfall V',type:'nebula',distance:3},
  {id:'cryonex_ii',name:'Cryonex II',type:'rocky',distance:3},{id:'vaelmor',name:'Vaelmor',type:'crystal',distance:4},
  {id:'dust_ring',name:'Dust Ring',type:'gas',distance:4},{id:'pyros_ix',name:'Pyros IX',type:'balanced',distance:4},
  {id:'aquillon',name:'Aquillon',type:'barren',distance:4},{id:'greystone_vi',name:'Greystone VI',type:'volcanic',distance:5},
  {id:'ember_prime',name:'Ember Prime',type:'frozen',distance:5},{id:'coldpeak',name:'Coldpeak',type:'nebula',distance:5},
  {id:'starfall_ii',name:'Starfall II',type:'rocky',distance:5},{id:'iridion_iv',name:'Iridion IV',type:'crystal',distance:6},
  {id:'halcyon_iii',name:'Halcyon III',type:'gas',distance:6},{id:'vexius',name:'Vexius',type:'balanced',distance:6},
];

window._galaxySelected = window._galaxySelected || {};
let _galaxyEngine = null;

function getThreatColor(t){ if(t<=2)return'#00ff88'; if(t<=4)return'#ffcc44'; if(t<=6)return'#ff8833'; if(t<=8)return'#ff4444'; return'#ff0044'; }

function renderGalaxy(){
  const el=document.getElementById('galaxyContent'); if(!el) return;
  const hq=buildings.hq?.level||1;
  el.innerHTML = `
    <div class="card" style="margin-bottom:12px">
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;text-align:center">
        <div><div style="font-size:0.6rem;color:#6a90b8">HQ</div><div style="font-size:1.1rem;color:#00d4ff;font-family:Orbitron">${hq}</div></div>
        <div><div style="font-size:0.6rem;color:#6a90b8">SEKTORA</div><div style="font-size:1.1rem;color:#00ff88;font-family:Orbitron">1/1</div></div>
        <div><div style="font-size:0.6rem;color:#6a90b8">KOLONIJA</div><div style="font-size:1.1rem;color:#aa44ff;font-family:Orbitron">${colonies.length}/${getMaxColonies()}</div></div>
        <div><div style="font-size:0.6rem;color:#6a90b8">FLOTA</div><div style="font-size:1.1rem;color:#ffcc44;font-family:Orbitron">${fleet.filter(Boolean).length}/6</div></div>
      </div>
    </div>
    <div class="card" style="padding:0;overflow:hidden;position:relative;height:380px;background:#020408">
      <canvas id="galaxyCanvas" style="width:100%;height:100%;display:block;cursor:grab"></canvas>
    </div>
    <div id="galaxyDetails" style="margin-top:12px"></div>
  `;
  setTimeout(initGalaxyEngine, 30);
}

function initGalaxyEngine(){
  const canvas=document.getElementById('galaxyCanvas'); if(!canvas) return;
  const ctx=canvas.getContext('2d'); const DPR=Math.min(devicePixelRatio||1,2);
  let W=canvas.clientWidth, H=canvas.clientHeight;
  const resize=()=>{W=canvas.clientWidth;H=canvas.clientHeight;canvas.width=W*DPR;canvas.height=H*DPR;ctx.setTransform(1,0,0,1,0,0);ctx.scale(DPR,DPR);};
  resize(); new ResizeObserver(resize).observe(canvas);

  const stars = Array(350).fill(0).map(()=>({
    x:Math.random(), y:Math.random(),
    r:Math.random()*1.3+0.3,
    b:Math.random()*6.28,
    s:0.015+Math.random()*0.025,
    c: Math.random()<0.7? '#a0e0ff' : (Math.random()<0.5? '#ffd4a0' : '#d4a0ff')
  }));

  const planets = (typeof generateAvailablePlanets==='function'?generateAvailablePlanets():FALLBACK);
  const systems=[];
  systems.push({id:'base',name:'Baza',icon:'⬢',type:'home',threat:0,sector:{name:'Home',color:'#00d4ff'},x:0,y:0,z:0,owner:'player',isBase:true});
  planets.slice(0,20).forEach((p,i)=>{
    const a=(i/20)*Math.PI*2, ring=Math.floor(i/5), r=160+ring*70;
    const x=Math.cos(a)*r, y=Math.sin(a)*r*0.6, z=(i%3-1)*35;
    const owned=colonies.some(c=>c.name===p.name);
    systems.push({...p, id:p.id, name:p.name, icon:PLANET_ICONS[p.type]||'🪐', type:p.type, threat:Math.min(10,(p.distance||1)+1), sector:{name:'Kolonije',color:'#aa44ff'}, x,y,z, owner:owned?'player':'neutral', isBase:false });
  });

  let rotX=-0.25, rotY=0.6, zoom=1, dragging=false, lx=0, ly=0, hover=null, t=0;
  const project=p=>{ const cy=Math.cos(rotY),sy=Math.sin(rotY); const x1=p.x*cy-p.z*sy, z1=p.x*sy+p.z*cy; const cx=Math.cos(rotX),sx=Math.sin(rotX); const y1=p.y*cx-z1*sx, z2=p.y*sx+z1*cx; const s=800/(800+z2)*zoom; return {x:W/2+x1*s,y:H/2+y1*s,z:z2,s}; };

  function draw(){
    t+=16; if(!dragging) rotY+=0.00035;
    ctx.fillStyle='#000308'; ctx.fillRect(0,0,W,H);
    const grad = ctx.createRadialGradient(W*0.3,H*0.7,0,W*0.3,H*0.7,W*0.8);
    grad.addColorStop(0,'rgba(0,80,120,0.15)'); grad.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=grad; ctx.fillRect(0,0,W,H);
    stars.forEach(st=>{
      st.b += st.s;
      const alpha = 0.3 + 0.7 * Math.abs(Math.sin(st.b));
      ctx.globalAlpha = alpha;
      ctx.fillStyle = st.c;
      ctx.shadowColor = st.c;
      ctx.shadowBlur = st.r*3;
      ctx.beginPath();
      ctx.arc(st.x*W, st.y*H, st.r, 0, 7);
      ctx.fill();
    });
    ctx.globalAlpha=1; ctx.shadowBlur=0;
    const projs=systems.map(s=>({...s,p:project(s)})).sort((a,b)=>a.p.z-b.p.z);
    projs.forEach(s=>{
      const {x,y,z,s:sc}=s.p; if(z>480)return;
      const ip=s.owner==='player', col=ip?'#00e5ff':s.sector.color, mult=s.isBase?1.6:1, r=(ip?5.5:3.8)*sc*mult;
      ctx.beginPath();ctx.arc(x,y,r+9,0,7);ctx.fillStyle=ip?'rgba(0,229,255,0.12)':'rgba(255,255,255,0.04)';ctx.fill();
      ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fillStyle=col;ctx.shadowColor=col;ctx.shadowBlur=ip?22:12;ctx.fill();ctx.shadowBlur=0;
      if(hover===s.id){ctx.beginPath();ctx.arc(x,y,r+6,0,7);ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.stroke();}
      ctx.font=`${Math.max(9,10*sc)}px Orbitron`;
      ctx.textAlign='center';
      ctx.fillStyle = hover===s.id? '#ffffff' : (ip? '#00e5ff' : '#6a90b8');
      ctx.shadowColor='rgba(0,0,0,0.9)'; ctx.shadowBlur=4;
      ctx.fillText(s.name, x, y + r + 14);
      ctx.shadowBlur=0;
    });
    requestAnimationFrame(draw);
  }
  draw();

  canvas.onmousedown=e=>{dragging=true;lx=e.clientX;ly=e.clientY;};
  addEventListener('mouseup',()=>dragging=false);
  addEventListener('mousemove',e=>{if(dragging){rotY+=(e.clientX-lx)*0.005;rotX+=(e.clientY-ly)*0.005;rotX=Math.max(-1.2,Math.min(1.2,rotX));lx=e.clientX;ly=e.clientY;return;} const r=canvas.getBoundingClientRect();const mx=e.clientX-r.left,my=e.clientY-r.top;hover=null;for(const s of systems){const p=project(s);if(Math.hypot(mx-p.x,my-p.y)<(s.isBase?22:15)*p.s){hover=s.id;break;}}});
  canvas.onwheel=e=>{e.preventDefault();zoom*=1-e.deltaY*0.001;zoom=Math.max(0.6,Math.min(2.3,zoom));};
  canvas.onclick=e=>{const r=canvas.getBoundingClientRect();const mx=e.clientX-r.left,my=e.clientY-r.top;let pick=null;for(const s of systems){const p=project(s);if(Math.hypot(mx-p.x,my-p.y)<(s.isBase?24:16)*p.s){pick=s;break;}}if(pick)updateGalaxyDetails(pick);};

  updateGalaxyDetails(systems[0]);
}

function updateGalaxyDetails(sys){
  const d=document.getElementById('galaxyDetails'); if(!d) return;
  const owned=sys.owner==='player'; const pow=calcFleetStats(fleet).power; const need=sys.threat*500;
  d.innerHTML=`<div class="card" style="border-color:${sys.sector.color}55">
    <div style="display:flex;gap:12px;align-items:center;margin-bottom:10px"><div style="font-size:2.4rem">${sys.icon}</div><div><div style="font-weight:700;color:${sys.sector.color}">${sys.name}</div><div style="font-size:0.7rem;color:#6a90b8">${sys.sector.name} • Threat ${sys.threat}/10${sys.isBase?' • BAZA':''}</div></div></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;font-size:0.7rem"><div style="background:#0003;padding:6px;border-radius:6px;text-align:center">POWER<br><b style="color:${pow>=need?'#0f8':'#fa0'}">${fmt(pow)}</b></div><div style="background:#0003;padding:6px;border-radius:6px;text-align:center">POTREBNO<br><b style="color:${getThreatColor(sys.threat)}">${fmt(need)}</b></div></div>
    <button class="btn ${!owned &&!sys.isBase?'btn-g':''}" style="width:100%" onclick="window.launchGalaxyMission('${sys.id}')" ${owned||sys.isBase?'disabled':''}>${sys.isBase?'🏠 MATIČNA BAZA':owned?'✅ OSVOJENO':'🚀 NAPADNI'}</button>
  </div>`;
}

window.launchGalaxyMission = function(sysId){
  if(sysId==='base')return;
  const planets=(typeof generateAvailablePlanets==='function'?generateAvailablePlanets():FALLBACK);
  const sys=planets.find(p=>p.id===sysId); if(!sys)return;
  if(fleet.every(s=>!s)) return toast('❌ Prazna flota','err');
  const threat=Math.min(10,(sys.distance||1)+1);
  const enemies=Array(Math.min(3,Math.floor(threat/2)+1)).fill(0).map(()=>({name:`${sys.name} Def`,count:threat*2+5,hp:threat*280+180,shield:threat*90,dps:threat*22+8,agility:threat*3}));
  const battle=simulateBattle(fleet.filter(Boolean),enemies,{name:sys.name,difficulty:threat});
  const rewards=calculateRewards(battle,{name:sys.name,difficulty:threat},{});
  if(battle.status==='victory'){ applyRewards(rewards); applyPlayerLosses(battle); }
  showBattleOutcome(battle,rewards,true);
  if(battle.status!=='victory') return;
  if(colonies.some(c=>c.name===sys.name)) return;
  if(colonies.length>=getMaxColonies()) return toast(`Max kolonija!`, 'warn');
  colonies.push({id:`col_${Date.now()}`,planetId:sys.id,name:sys.name,type:sys.type,level:1,distance:sys.distance||1,slots:4,defense:0,colonizedAt:Date.now()});
  R.score+=threat*100; saveGame();
  toast(`🪐 ${sys.name} kolonizovan!`, 'ok');
  setTimeout(()=>{renderGalaxy(); if(typeof renderColonies==='function') renderColonies();},700);
}