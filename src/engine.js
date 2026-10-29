/* 동현전 규칙 엔진. 화면과 분리된 순수 규칙이라 Node 시험에서도 그대로 돌린다. */
(function(root){
const G = (typeof module!=='undefined') ? require('./data.js') : root.DH_DATA;
const {TERRAIN,MOVE_COST,TERRAIN_ORDER,UNITS,UNIT_ORDER,BUILD,DMG,COS,STAR_VALUE,MAPS} = G;
const TIDX = Object.fromEntries(TERRAIN_ORDER.map((t,i)=>[t,i]));
const UIDX = Object.fromEntries(UNIT_ORDER.map((t,i)=>[t,i]));
const disp = hp => Math.ceil(hp/10);
const key = (x,y) => y*1000+x;

function rng(state){ // 상태 안에 둔 결정론적 난수(재현 시험용)
  let s = state.seed>>>0; s ^= s<<13; s>>>=0; s ^= s>>>17; s ^= s<<5; s>>>=0; state.seed = s||1; return (s>>>0)/4294967296;
}

function newGame(opts){
  const m = MAPS.find(m=>m.id===opts.map) || MAPS[0];
  const grid = m.grid.map(r=>r.map(c=>({t:c.t, owner:c.owner, cp:20, capId:0})));
  const state = {
    map:{id:m.id,name:m.name,W:m.W,H:m.H,grid},
    units:[], nextId:1, day:1, turn:opts.first||1, first:opts.first||1, winner:0, reason:'',
    seed: opts.seed || (Math.floor(Math.random()*2147483646)+1),
    players:[null,
      {co:opts.co1||1, funds:opts.funds||0, meter:0, power:0, ai:false, had:false, built:0, lost:0, kills:0},
      {co:opts.co2||1, funds:opts.funds||0, meter:0, power:0, ai:true,  had:false, built:0, lost:0, kills:0}],
    events:[]
  };
  startTurn(state, state.turn, true);
  return state;
}
const coOf = (s,p) => COS[s.players[p].co-1];
const tile = (s,x,y) => (x>=0&&y>=0&&x<s.map.W&&y<s.map.H) ? s.map.grid[y][x] : null;
const unitAt = (s,x,y) => s.units.find(u=>u.x===x&&u.y===y&&!u.carried) || null;
function moveCost(type, t){ return MOVE_COST[UNITS[type].mt][TIDX[t]]; }
function event(s, e){ s.events.push(e); if(s.events.length>2000) s.events.shift(); }

/* ---- 지휘관 효과 ---- */
function isDirectNonFoot(u){ const d=UNITS[u.type]; return !d.indirect && d.cls!=='foot' && d.range; }
function atkValue(s,u){
  const p=s.players[u.owner], co=p.co, d=UNITS[u.type]; let v=100;
  if(p.power) v+=10;
  if(co===1 && p.power===2) v+=10;
  if(co===2){ if(d.indirect) v-=10; else if(isDirectNonFoot(u)) v+=20+(p.power===1?10:p.power===2?30:0); }
  if(co===3){ if(d.cls==='foot') v+=20+(p.power===1?10:p.power===2?20:0); else if(!d.indirect) v-=10; }
  return v;
}
function defValue(s,u){ return 100 + (s.players[u.owner].power?10:0); }
function luckMax(s,p){ const P=s.players[p]; if(P.co===4) return P.power===2?99:P.power===1?59:19; return 9; }
function moveOf(s,u){
  const p=s.players[u.owner], d=UNITS[u.type]; let m=d.move;
  if(p.co===1 && p.power===2) m+=1;
  if(p.co===2 && isDirectNonFoot(u)) m+= p.power===1?1:p.power===2?2:0;
  if(p.co===3){ if(d.carry && d.carry.includes('foot')) m+=1; if(d.cls==='foot') m+= p.power===1?1:p.power===2?2:0; }
  return m;
}
function rangeOf(s,u){
  const d=UNITS[u.type]; if(!d.range) return null; let [a,b]=d.range;
  if(s.players[u.owner].co===2 && d.indirect) b=Math.max(a,b-1);
  return [a,b];
}
function costMult(s,p){ const P=s.players[p]; if(P.co===5) return P.power?0.5:0.9; return 1; }
function priceOf(s,p,type){ return Math.round(UNITS[type].cost*costMult(s,p)/100)*100; }
function canBuildAt(s,p,x,y){
  const t=tile(s,x,y); if(!t||t.owner!==p) return [];
  if(BUILD[t.t]) return BUILD[t.t];
  if(t.t==='city' && s.players[p].co===5 && s.players[p].power===2) return BUILD.factory;
  return [];
}

/* ---- 이동 ---- */
function reach(s,u,opt={}){
  // 다익스트라: 이동력과 연료 중 작은 값까지. 적 유닛은 통과할 수 없다.
  const pts = Math.min(moveOf(s,u), u.fuel);
  const W=s.map.W,H=s.map.H, dist=new Map(), prev=new Map();
  const open=[[0,u.x,u.y]]; dist.set(key(u.x,u.y),0);
  while(open.length){
    let bi=0; for(let i=1;i<open.length;i++) if(open[i][0]<open[bi][0]) bi=i;
    const [c,x,y]=open.splice(bi,1)[0]; if(c>dist.get(key(x,y))) continue;
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
      const nx=x+dx, ny=y+dy; if(nx<0||ny<0||nx>=W||ny>=H) continue;
      const mc=moveCost(u.type, s.map.grid[ny][nx].t); if(!mc) continue;
      const nc=c+mc; if(nc>pts) continue;
      const o=unitAt(s,nx,ny); if(o && o.owner!==u.owner && !opt.ignoreUnits) continue;
      const k=key(nx,ny); if(!dist.has(k)||nc<dist.get(k)){ dist.set(k,nc); prev.set(k,key(x,y)); open.push([nc,nx,ny]); }
    }
  }
  return {dist, prev};
}
function pathTo(r, sx,sy, x,y){
  const p=[]; let k=key(x,y); if(!r.dist.has(k)) return null;
  while(k!==undefined){ p.unshift([k%1000, Math.floor(k/1000)]); if(k===key(sx,sy)) break; k=r.prev.get(k); }
  return p;
}
// 도착 가능한 칸: 빈 칸 · 제자리 · 탑승 가능한 수송 유닛 · 합류 가능한 같은 병종
function canLoad(s,u,t){ const d=UNITS[t.type]; return t.owner===u.owner && t!==u && d.carry && d.carry.includes(UNITS[u.type].cls) && t.cargo.length<d.cap_n; }
function canJoin(s,u,t){ return t.owner===u.owner && t!==u && t.type===u.type && disp(t.hp)<10 && !u.cargo.length && !t.cargo.length; }
function stopOK(s,u,x,y){
  const o=unitAt(s,x,y); if(!o||o===u) return true;
  return canLoad(s,u,o)||canJoin(s,u,o);
}

/* ---- 전투 ---- */
function weaponVs(s,a,d){ // 사용할 무기와 기본 피해
  if(d.dived && !(a.type==='sub'||a.type==='cruiser')) return null;
  const tab=DMG[a.type], i=UIDX[d.type];
  if(tab.pri && tab.pri[i]!=null && a.ammo>0) return {w:'pri', b:tab.pri[i]};
  if(tab.sec && tab.sec[i]!=null) return {w:'sec', b:tab.sec[i]};
  return null;
}
function terrainStars(s,u){ return UNITS[u.type].mt==='air' ? 0 : TERRAIN[tile(s,u.x,u.y).t].def; }
function damage(s,a,d,mode,ax,ay,ahp){
  const wv=weaponVs(s,a,d); if(!wv) return null;
  const HA=disp(ahp!=null?ahp:a.hp), HD=disp(d.hp);
  const L = mode==='min'?0 : mode==='max'?luckMax(s,a.owner) : Math.floor(rng(s)*(luckMax(s,a.owner)+1));
  const stars=terrainStars(s,d);
  const raw=(wv.b*atkValue(s,a)/100 + L)*(HA/10)*((200-(defValue(s,d)+stars*HD))/100);
  return {dmg:Math.max(0,Math.floor(raw+1e-9)), w:wv.w};
}
function dist(ax,ay,bx,by){ return Math.abs(ax-bx)+Math.abs(ay-by); }
function targetsFrom(s,u,x,y,moved){
  const r=rangeOf(s,u); if(!r) return [];
  if(UNITS[u.type].indirect && moved) return [];
  return s.units.filter(o=>!o.carried && o.owner!==u.owner && dist(x,y,o.x,o.y)>=r[0] && dist(x,y,o.x,o.y)<=r[1] && weaponVs(s,u,o));
}
function canCounter(s,d,a){
  if(UNITS[a.type].indirect || UNITS[d.type].indirect) return false;
  if(dist(a.x,a.y,d.x,d.y)!==1) return false;
  return !!weaponVs(s,d,a);
}
function forecast(s,a,d,ax,ay){
  // 예상 피해 범위(운 최소~최대)와 반격 예상
  const sx=a.x, sy=a.y; a.x=ax; a.y=ay;
  const lo=damage(s,a,d,'min'), hi=damage(s,a,d,'max');
  let clo=null, chi=null;
  if(lo){
    const save=d.hp;
    d.hp=Math.max(0,save-hi.dmg); if(d.hp>0&&canCounter(s,d,a)){ chi=damage(s,d,a,'max'); }
    d.hp=Math.max(0,save-lo.dmg); if(d.hp>0&&canCounter(s,d,a)){ clo=damage(s,d,a,'max'); }
    d.hp=save;
  }
  a.x=sx; a.y=sy;
  return lo ? {lo:Math.min(lo.dmg,d.hp), hi:Math.min(hi.dmg,d.hp), counter:clo?clo.dmg:0, counterMin:chi?chi.dmg:0} : null;
}
function charge(s,p,value){ const P=s.players[p]; if(P.power) return; const max=coOf(s,p).scop.stars*STAR_VALUE; P.meter=Math.min(max, P.meter+value); }
function hurt(s,attacker,victim,dmg){
  const before=disp(victim.hp); victim.hp=Math.max(0,victim.hp-dmg);
  const lost=(before-disp(victim.hp))*UNITS[victim.type].cost/10;
  charge(s,victim.owner,lost); charge(s,attacker.owner,lost/2);
  if(victim.hp<=0) destroy(s,victim,attacker.owner);
}
function destroy(s,u,by){
  for(const c of u.cargo){ const i=s.units.indexOf(c); if(i>=0) s.units.splice(i,1); }
  const i=s.units.indexOf(u); if(i>=0) s.units.splice(i,1);
  const t=tile(s,u.x,u.y); if(t && t.capId===u.id){ t.cp=20; t.capId=0; }
  s.players[u.owner].lost++; if(by) s.players[by].kills++;
  event(s,{k:'destroy', id:u.id, type:u.type, owner:u.owner, x:u.x, y:u.y});
}
function attack(s,a,d){
  const r=damage(s,a,d,'rand'); if(!r) return null;
  if(r.w==='pri') a.ammo--;
  const res={dmg:Math.min(r.dmg,d.hp), counter:0};
  hurt(s,a,d,r.dmg);
  if(d.hp>0 && canCounter(s,d,a)){
    const c=damage(s,d,a,'rand'); if(c){ if(c.w==='pri') d.ammo--; res.counter=Math.min(c.dmg,a.hp); hurt(s,d,a,c.dmg); }
  }
  event(s,{k:'attack', a:a.id, d:d.id, at:a.type, dt:d.type, ao:a.owner, do:d.owner, ax:a.x, ay:a.y, dx:d.x, dy:d.y, dmg:res.dmg, counter:res.counter});
  checkEnd(s);
  return res;
}

/* ---- 행동 ---- */
function commitMove(s,u,x,y,cost){
  if(u.x!==x||u.y!==y){
    const t=tile(s,u.x,u.y); if(t.capId===u.id){ t.cp=20; t.capId=0; }
    u.x=x; u.y=y; u.fuel=Math.max(0,u.fuel-cost);
  }
}
function capture(s,u){
  const t=tile(s,u.x,u.y);
  const P=s.players[u.owner];
  let pts=disp(u.hp); if(P.co===3) pts=Math.floor(pts*1.5);
  if(P.co===3 && P.power===2) pts=20;
  if(t.capId!==u.id){ t.cp=20; t.capId=u.id; }
  t.cp-=pts;
  const done=t.cp<=0, wasHQt=t.t==='hq';
  if(done){
    const old=t.owner, wasHQ=t.t==='hq';
    t.owner=u.owner; t.cp=20; t.capId=0;
    if(wasHQ){ t.t='city'; s.winner=u.owner; s.reason='본부 점령'; for(const r of s.map.grid) for(const c of r) if(c.owner===old) c.owner=u.owner; }
  }
  event(s,{k:'capture', id:u.id, type:u.type, owner:u.owner, tt:wasHQt?'hq':t.t, x:u.x, y:u.y, left:done?0:t.cp, done});
  checkEnd(s);
  return done;
}
function supplyAround(s,u){
  let n=0;
  for(const o of s.units) if(!o.carried && o.owner===u.owner && o!==u && dist(o.x,o.y,u.x,u.y)===1){ refill(o); n++; }
  return n;
}
function refill(u){ u.fuel=UNITS[u.type].fuel; u.ammo=UNITS[u.type].ammo; }
function load(s,u,t){ u.carried=true; u.done=true; u.x=t.x; u.y=t.y; t.cargo.push(u); const tl=tile(s,t.x,t.y); event(s,{k:'load',id:u.id,type:u.type,owner:u.owner,into:t.type}); }
function unloadSpots(s,t,c){
  if(t.type==='lander' && !['shoal','port'].includes(tile(s,t.x,t.y).t)) return [];
  const out=[];
  for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
    const x=t.x+dx,y=t.y+dy, tl=tile(s,x,y); if(!tl) continue;
    if(!moveCost(c.type,tl.t)) continue; if(unitAt(s,x,y)) continue; out.push([x,y]);
  }
  return out;
}
function unload(s,t,c,x,y){
  t.cargo.splice(t.cargo.indexOf(c),1); c.carried=false; c.x=x; c.y=y; c.done=true;
  event(s,{k:'unload',id:c.id,type:c.type,owner:c.owner,x,y});
}
function join(s,u,t){
  const sum=disp(u.hp)+disp(t.hp);
  if(sum>10) s.players[u.owner].funds+=Math.round((sum-10)*UNITS[u.type].cost/10);
  t.hp=Math.min(10,sum)*10; // 표시 체력 기준으로 합친다
  t.fuel=Math.max(t.fuel,u.fuel); t.ammo=Math.max(t.ammo,u.ammo); t.done=true;
  const i=s.units.indexOf(u); s.units.splice(i,1);
  const tl=tile(s,u.x,u.y); if(tl&&tl.capId===u.id){tl.cp=20;tl.capId=0;}
  event(s,{k:'join',id:t.id,type:t.type,owner:t.owner});
}
function build(s,p,x,y,type){
  if(!canBuildAt(s,p,x,y).includes(type)) return null;
  if(unitAt(s,x,y)) return null;
  const price=priceOf(s,p,type); if(s.players[p].funds<price) return null;
  s.players[p].funds-=price;
  const d=UNITS[type];
  const u={id:s.nextId++, type, owner:p, x, y, hp:100, fuel:d.fuel, ammo:d.ammo, done:true, cargo:[], dived:false};
  s.units.push(u); s.players[p].had=true; s.players[p].built++;
  event(s,{k:'build',id:u.id,type,x,y,owner:p});
  return u;
}
function usePower(s,p,level){
  const P=s.players[p], co=coOf(s,p), need=(level===2?co.scop:co.cop).stars*STAR_VALUE;
  if(P.power||P.meter<need) return false;
  P.meter-=need; if(level===2) P.meter=0; P.power=level;
  if(P.co===1){ const add=level===2?50:20; for(const u of s.units) if(u.owner===p) u.hp=Math.min(100,u.hp+add); }
  event(s,{k:'power',p,level,name:(level===2?co.scop:co.cop).name});
  return true;
}
function propsOf(s,p){ let n=0; for(const r of s.map.grid) for(const c of r) if(TERRAIN[c.t].prop&&c.owner===p) n++; return n; }
function repairKind(t,u){
  const cls=UNITS[u.type].cls;
  if(t.t==='airport') return cls==='plane'||cls==='copter';
  if(t.t==='port') return cls==='ship';
  if(['city','factory','hq'].includes(t.t)) return cls==='foot'||cls==='vehicle';
  return false;
}
function startTurn(s,p,first){
  s.turn=p; const P=s.players[p]; P.power=0;
  P.funds+=propsOf(s,p)*1000;
  const mine=s.units.filter(u=>u.owner===p);
  for(const u of mine){
    u.done=false;
    const d=UNITS[u.type];
    if(!first && d.daily && !u.carried){
      const t=tile(s,u.x,u.y), safe=(d.cls==='ship'&&t.t==='port')||((d.cls==='plane'||d.cls==='copter')&&t.t==='airport');
      if(!safe){
        u.fuel-=d.daily+(u.dived?4:0);
        if(u.fuel<=0){ u.fuel=0; destroy(s,u,0); event(s,{k:'crash',type:u.type,x:u.x,y:u.y,owner:p}); continue; }
      }
    }
  }
  // 아군 거점에서 체력 +2와 보급
  for(const u of s.units.filter(u=>u.owner===p&&!u.carried)){
    const t=tile(s,u.x,u.y);
    if(t.owner===p && TERRAIN[t.t].prop && repairKind(t,u)){
      refill(u);
      const room=10-disp(u.hp), step=Math.min(2,room), price=UNITS[u.type].cost/10;
      let n=step; while(n>0 && P.funds<n*price) n--;
      if(n>0){ P.funds-=n*price; u.hp=Math.min(100,(disp(u.hp)+n)*10); }
    }
  }
  for(const u of s.units.filter(u=>u.owner===p&&!u.carried&&UNITS[u.type].supply)) supplyAround(s,u);
  for(const u of s.units.filter(u=>u.owner===p&&u.carried&&s.units.find(t=>t.cargo.includes(u))?.type==='cruiser')) refill(u);
  event(s,{k:'turn',p,day:s.day,income:propsOf(s,p)*1000});
  checkEnd(s);
}
function endTurn(s){
  if(s.winner) return;
  const p=s.turn, q=3-p;
  if(q===s.first) s.day++;
  startTurn(s,q,false);
}
function checkEnd(s){
  if(s.winner) return s.winner;
  for(const p of [1,2]){
    const P=s.players[p];
    if(P.had && !s.units.some(u=>u.owner===p)){ s.winner=3-p; s.reason='전멸'; }
  }
  return s.winner;
}
function concede(s,p){ s.winner=3-p; s.reason='항복'; }
function readyUnits(s,p){ return s.units.filter(u=>u.owner===p&&!u.done&&!u.carried); }

const API={newGame,tile,unitAt,moveCost,reach,pathTo,stopOK,canLoad,canJoin,weaponVs,damage,forecast,targetsFrom,canCounter,attack,
  commitMove,capture,supplyAround,load,unload,unloadSpots,join,build,usePower,startTurn,endTurn,checkEnd,concede,readyUnits,
  priceOf,canBuildAt,moveOf,rangeOf,atkValue,propsOf,disp,dist,key,coOf,rng,terrainStars};
if(typeof module!=='undefined') module.exports=API; else root.Engine=API;
})(typeof self!=='undefined'?self:this);
