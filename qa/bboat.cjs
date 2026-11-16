// 블랙보트 규칙 시험(엔진만). node qa/bboat.cjs
const D=require('../src/data.js'), E=require('../src/engine.js'), AI=require('../src/ai.js');
const {UNITS,UNIT_ORDER,DMG,BUILD,MAPS}=D;
let pass=0, fail=0;
const ok=(name,c,extra)=>{ if(c) pass++; else { fail++; console.log('FAIL',name,extra===undefined?'':JSON.stringify(extra)); } };
const eq=(name,a,b)=>ok(name,JSON.stringify(a)===JSON.stringify(b),{got:a,want:b});
const mk=(S,type,o,x,y,hp=100)=>{const d=UNITS[type];const u={id:S.nextId++,type,owner:o,x,y,hp,fuel:d.fuel,ammo:d.ammo,done:false,cargo:[],dived:false};S.units.push(u);S.players[o].had=true;return u;};
const find=(S,f)=>{ for(let y=0;y<S.map.H;y++) for(let x=0;x<S.map.W;x++) if(f(x,y,S.map.grid[y][x])) return [x,y]; return null; };
const T=(S,x,y)=>{const t=E.tile(S,x,y);return t&&t.t;};
const N4=[[1,0],[-1,0],[0,1],[0,-1]];

// 1. 수치: AWBW 병종표(값 7500 · 이동 7 · 이동 유형 L · 연료 60 · 하루 1 · 무기 없음)
const d=UNITS.bboat;
eq('stats',[d.name,d.cost,d.move,d.mt,d.fuel,d.daily,d.ammo,d.range,d.cls,d.carry,d.cap_n,!!d.repair],['블랙보트',7500,7,'lander',60,1,0,null,'ship',['foot'],2,true]);
eq('order last',UNIT_ORDER[UNIT_ORDER.length-1],'bboat'); eq('22 units',UNIT_ORDER.length,22);
ok('port only',BUILD.port.includes('bboat')&&!BUILD.factory.includes('bboat')&&!BUILD.airport.includes('bboat'));
// 2. 피해표: AWBW 피해표의 Black Boat 열
const want={tank:10,md:35,neo:40,art:55,rocket:60,bomber:95,stealth:65,bcopter:25,bship:95,cruiser:25,sub:95};
const i=UNIT_ORDER.indexOf('bboat'), got={};
for(const a of UNIT_ORDER){ const w=DMG[a]; for(const z of ['pri','sec']) if(w[z]){ ok('len '+a+z,w[z].length===22); if(w[z][i]!=null) got[a]=w[z][i]; } }
eq('damage column',got,want);
eq('no weapon',DMG.bboat,{});
// 기존 21종 사이의 값은 그대로인가(v0.78 태그의 표와 비교)
try{
  const old=require('child_process').execSync('git show v0.78:src/data.js',{cwd:__dirname+'/..',maxBuffer:1e8}).toString();
  const m={exports:{}}; new Function('module','self',old)(m,{}); const O=m.exports; let diff=0;
  for(const a of O.UNIT_ORDER) for(const z of ['pri','sec']){ const x=O.DMG[a][z], y=DMG[a][z]; if(!x!==!y){diff++;continue;} if(x) for(let k=0;k<21;k++) if(x[k]!==y[k]) diff++; }
  for(const a of O.UNIT_ORDER) if(JSON.stringify(O.UNITS[a])!==JSON.stringify(UNITS[a])) diff++;
  eq('old 21 units and table unchanged',diff,0);
  eq('maps unchanged',JSON.stringify(O.MAPS)===JSON.stringify(MAPS),true);
}catch(e){ ok('compare with v0.78',false,String(e).slice(0,200)); }

// 3. 이동·탑승·하차 (지도 15: 모래톱과 항구가 많다)
{
  const S=E.newGame({map:15,co1:1,co2:1,first:1,funds:20000,seed:5});
  const sh=find(S,(x,y,t)=>t.t==='shoal'&&N4.some(([a,b])=>T(S,x+a,y+b)==='sea')&&N4.some(([a,b])=>['plain','road','forest','city'].includes(T(S,x+a,y+b))));
  ok('map has a shoal by sea and land',!!sh);
  const [sx,sy]=sh, sea=N4.map(([a,b])=>[sx+a,sy+b]).find(([x,y])=>T(S,x,y)==='sea'), land=N4.map(([a,b])=>[sx+a,sy+b]).find(([x,y])=>['plain','road','forest','city'].includes(T(S,x,y)));
  const b=mk(S,'bboat',1,sea[0],sea[1]);
  const R=E.reach(S,b);
  ok('enters shoal',R.dist.has(E.key(sx,sy)));
  ok('never on land',[...R.dist.keys()].every(k=>['sea','shoal','reef','port'].includes(T(S,k%1000,Math.floor(k/1000)))));
  eq('move 7',E.moveOf(S,b),7);
  ok('reach within 7',[...R.dist.values()].every(v=>v<=7)&&[...R.dist.values()].some(v=>v===7));
  // 바다 위에서는 못 태우고 못 내린다
  const i1=mk(S,'inf',1,land[0],land[1]);
  ok('inf cannot reach boat at sea',!E.reach(S,i1).dist.has(E.key(b.x,b.y)));
  E.commitMove(S,b,sx,sy,1);
  ok('inf reaches boat on shoal',E.reach(S,i1).dist.has(E.key(sx,sy)) && E.stopOK(S,i1,sx,sy));
  ok('canLoad inf',E.canLoad(S,i1,b)); E.load(S,i1,b);
  const m1=mk(S,'mech',1,land[0],land[1]); ok('canLoad mech',E.canLoad(S,m1,b)); E.load(S,m1,b);
  const i3=mk(S,'inf',1,land[0],land[1]); ok('third is refused',!E.canLoad(S,i3,b));
  const tk=mk(S,'tank',1,land[0],land[1]); ok('tank is refused',!E.canLoad(S,tk,b)&&!UNITS.bboat.carry.includes('vehicle'));
  S.units.splice(S.units.indexOf(i3),1); S.units.splice(S.units.indexOf(tk),1);
  eq('cargo 2',b.cargo.length,2);
  ok('unload on shoal',E.unloadSpots(S,b,i1).some(([x,y])=>x===land[0]&&y===land[1]));
  b.x=sea[0]; b.y=sea[1]; eq('no unload at sea',E.unloadSpots(S,b,i1).length,0);
  b.x=sx; b.y=sy; E.unload(S,b,i1,land[0],land[1]); eq('unloaded',[i1.carried,i1.x,i1.y,b.cargo.length],[false,land[0],land[1],1]);
  // 격침되면 실린 유닛도 함께
  const n0=S.units.length; const bs=mk(S,'bship',2,sx,sy+0); bs.x=-9; // 자리만 빌린 공격자
  b.hp=1; E.attack(S,Object.assign(bs,{x:b.x+2,y:b.y}),b);
  ok('boat sunk with cargo',!S.units.includes(b)&&!S.units.includes(m1));
}
// 4. 수리
{
  const S=E.newGame({map:15,co1:1,co2:1,first:1,funds:0,seed:5});
  const P=S.players[1]; P.funds=10000;
  const sea=find(S,(x,y,t)=>t.t==='sea'&&T(S,x+1,y)==='sea'&&T(S,x-1,y)==='sea'&&T(S,x,y+1)==='sea');
  const [x,y]=sea, b=mk(S,'bboat',1,x,y), bs=mk(S,'bship',1,x+1,y,62), far=mk(S,'cruiser',1,x,y+1), foe=mk(S,'sub',2,x-1,y,50);
  bs.fuel=10; bs.ammo=1; far.fuel=20; far.ammo=0; far.hp=95;
  eq('targets = adjacent allies only',E.repairTargets(S,b).map(u=>u.type).sort(),['bship','cruiser']);
  eq('plan',E.repairPlan(S,b,bs),{price:2800,hp:7,heal:true,full:false,poor:false});
  E.repair(S,b,bs);
  eq('+1 hp, 10% price, refill',[bs.hp,P.funds,bs.fuel,bs.ammo],[80,7200,99,9]);
  ok('repaired unit still free',bs.done===false);
  // 체력이 가득(표시 10)하면 값 없이 보충만
  E.repair(S,b,far); eq('full hp: refill only',[far.hp,P.funds,far.fuel,far.ammo],[95,7200,99,9]);
  // 자금이 모자라면 보충만
  P.funds=2799; bs.fuel=3; bs.ammo=0; E.repair(S,b,bs); eq('poor: refill only',[bs.hp,P.funds,bs.fuel,bs.ammo],[80,2799,99,9]);
  P.funds=2800; E.repair(S,b,bs); eq('exact funds heal',[bs.hp,P.funds],[90,0]);
  eq('enemy refused',E.repair(S,b,foe),null); eq('enemy untouched',foe.hp,50);
  far.x=x; far.y=y+2; eq('not adjacent refused',E.repair(S,b,far),null);
  const inf=mk(S,'inf',1,x,y+1); eq('non repair unit has no targets',E.repairTargets(S,inf).length,0); eq('non repair unit refused',E.repair(S,inf,bs),null);
  // 육상·항공 유닛도 이웃이면 수리한다
  S.units.splice(S.units.indexOf(inf),1); const cop=mk(S,'bcopter',1,x,y+1,45); cop.fuel=5; cop.ammo=0; P.funds=5000;
  E.repair(S,b,cop); eq('copter repaired',[cop.hp,cop.fuel,cop.ammo,P.funds],[60,99,6,4100]);
  // 블랙보트끼리 서로 수리·보충
  const b2=mk(S,'bboat',1,x-1,y-1,30); foe.x=x-1; foe.y=y+1; b2.x=x-1; b2.y=y; b2.fuel=4;
  E.repair(S,b,b2); eq('boat repairs boat',[b2.hp,b2.fuel,P.funds],[40,60,3350]);
  // 매일 연료 1, 0이 되면 사라진다
  b.fuel=2; b.done=true; E.endTurn(S); E.endTurn(S); eq('daily fuel',b.fuel,1); E.endTurn(S); E.endTurn(S); ok('sinks at 0 fuel',!S.units.includes(b));
}
// 5. 또치(수송 유닛 이동 +1)
{ const S=E.newGame({map:15,co1:3,co2:1,first:1,funds:0,seed:5}); const s=find(S,(x,y,t)=>t.t==='sea'); const b=mk(S,'bboat',1,s[0],s[1]); eq('ttochi move 8',E.moveOf(S,b),8); }
// 6. 생산: 항구에서만, 값 7500(뿡뿡 90% · 쏜쏜 80%)
{
  const S=E.newGame({map:15,co1:1,co2:1,first:1,funds:7400,seed:5}); S.players[1].funds=7400;
  const port=find(S,(x,y,t)=>t.t==='port'&&t.owner===1), fac=find(S,(x,y,t)=>t.t==='factory'&&t.owner===1);
  ok('map 15 has my port',!!port);
  eq('not enough funds',E.build(S,1,port[0],port[1],'bboat'),null);
  S.players[1].funds=7500; const u=E.build(S,1,port[0],port[1],'bboat'); eq('built',[u&&u.type,S.players[1].funds,u&&u.fuel],['bboat',0,60]);
  S.players[1].funds=99999; eq('factory refuses',E.build(S,1,fac[0],fac[1],'bboat'),null);
  for(const [co,p] of [[5,6800],[8,6000]]){ const S2=E.newGame({map:15,co1:co,co2:1,first:1,funds:0,seed:5}); eq('price co'+co,E.priceOf(S2,1,'bboat'),p); }
}
// 7. 동현AI: 다친 함선 곁으로 가서 수리한다
{
  const S=E.newGame({map:15,co1:1,co2:1,first:2,funds:0,seed:9}); S.players[2].funds=9000;
  const sea=find(S,(x,y,t)=>t.t==='sea'&&[1,2,3,4].every(k=>T(S,x+k,y)==='sea'));
  const [x,y]=sea, b=mk(S,'bboat',2,x,y), bs=mk(S,'bship',2,x+4,y,40); bs.done=true;
  let acted=null; for(let n=0;n<60;n++){ const a=AI.next(S); if(!a||a.k==='end') break; if(a.k==='move'&&a.id===b.id) acted=a; AI.apply(S,a); }
  eq('AI repairs',[acted&&acted.act,bs.hp,S.players[2].funds<=9000-2800],['repair',50,true]);
}
console.log(`bboat rules: pass ${pass} · fail ${fail}`); process.exit(fail?1:0);
