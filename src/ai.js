/* 동현전 컴퓨터(보통 난이도). 한 번에 행동 하나를 고른다: 지휘관 능력 → 유닛 행동 → 생산 → 턴 종료.
   모든 판단은 공개 정보(안개 없음)만 사용하며, 운 보정은 평균값으로 예상한다. */
(function(root){
const E = (typeof module!=='undefined') ? require('./engine.js') : root.Engine;
const D = (typeof module!=='undefined') ? require('./data.js') : root.DH_DATA;
const {UNITS,TERRAIN,BUILD,COS,STAR_VALUE,MOVE_COST,TERRAIN_ORDER}=D;
const TIDX=Object.fromEntries(TERRAIN_ORDER.map((t,i)=>[t,i]));
const PROP_VALUE={city:1600,factory:3200,airport:2600,port:1800,hq:30000};

function field(s, mt, sources){ // 여러 목표에서 거꾸로 퍼지는 이동 비용 지도(유닛 무시)
  const W=s.map.W,H=s.map.H, d=new Float64Array(W*H).fill(Infinity), open=[];
  for(const [x,y] of sources){ d[y*W+x]=0; open.push([0,x,y]); }
  while(open.length){
    let bi=0; for(let i=1;i<open.length;i++) if(open[i][0]<open[bi][0]) bi=i;
    const [c,x,y]=open.splice(bi,1)[0]; if(c>d[y*W+x]) continue;
    const here=MOVE_COST[mt][TIDX[s.map.grid[y][x].t]]||99;
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
      const nx=x+dx,ny=y+dy; if(nx<0||ny<0||nx>=W||ny>=H) continue;
      if(!MOVE_COST[mt][TIDX[s.map.grid[ny][nx].t]]) continue;
      const nc=c+here; if(nc<d[ny*W+nx]){ d[ny*W+nx]=nc; open.push([nc,nx,ny]); }
    }
  }
  return (x,y)=>d[y*W+x];
}
function avgDamage(s,a,d,ax,ay){
  const f=E.forecast(s,a,d,ax,ay); if(!f) return null;
  return {dmg:(f.lo+f.hi)/2, counter:(f.counter+f.counterMin)/2};
}

function makeCtx(s,p){
  const q=3-p, ctx={p,q,fields:{}};
  ctx.enemies=s.units.filter(u=>u.owner===q&&!u.carried);
  ctx.mine=s.units.filter(u=>u.owner===p&&!u.carried);
  // 적의 다음 턴 위협 칸
  ctx.threat=new Map();
  for(const e of ctx.enemies){
    const r=E.rangeOf(s,e); if(!r) continue;
    const cells=new Set();
    if(UNITS[e.type].indirect){
      for(let y=0;y<s.map.H;y++) for(let x=0;x<s.map.W;x++){ const dd=E.dist(x,y,e.x,e.y); if(dd>=r[0]&&dd<=r[1]) cells.add(E.key(x,y)); }
    } else {
      const R=E.reach(s,e);
      for(const k of R.dist.keys()){ const x=k%1000,y=Math.floor(k/1000); for(const [dx,dy] of [[0,0],[1,0],[-1,0],[0,1],[0,-1]]) cells.add(E.key(x+dx,y+dy)); }
    }
    ctx.threat.set(e,cells);
  }
  ctx.targetsProps=[];
  for(let y=0;y<s.map.H;y++) for(let x=0;x<s.map.W;x++){ const t=s.map.grid[y][x]; if(TERRAIN[t.t].prop && t.owner!==p) ctx.targetsProps.push([x,y]); }
  ctx.repairs=t=>{const out=[];for(let y=0;y<s.map.H;y++)for(let x=0;x<s.map.W;x++){const c=s.map.grid[y][x];if(c.owner===p&&(t==='air'?c.t==='airport':t==='ship'?c.t==='port':['city','hq','factory'].includes(c.t)))out.push([x,y]);}return out;};
  return ctx;
}
function getField(s,ctx,mt,name,srcFn){
  const k=mt+':'+name; if(!ctx.fields[k]){ const src=srcFn(); ctx.fields[k]=src.length?field(s,mt,src):()=>Infinity; } return ctx.fields[k];
}
function threatAt(s,ctx,u,x,y){
  let v=0; const saveX=u.x, saveY=u.y; u.x=x; u.y=y;
  for(const [e,cells] of ctx.threat){
    if(!cells.has(E.key(x,y))) continue;
    const w=E.weaponVs(s,e,u); if(!w) continue;
    const dm=E.damage(s,e,u,'min'); if(!dm) continue;
    v+=Math.min(u.hp,dm.dmg+3)/100*UNITS[u.type].cost;
  }
  u.x=saveX; u.y=saveY; return v;
}
function bestFor(s,ctx,u){
  const d=UNITS[u.type], R=E.reach(s,u), mt=d.mt, cost=UNITS[u.type].cost;
  const hpD=E.disp(u.hp);
  const enemyField=getField(s,ctx,mt,'enemy',()=>ctx.enemies.filter(e=>E.weaponVs(s,u,e)).map(e=>[e.x,e.y]));
  const propField=getField(s,ctx,mt,'props',()=>ctx.targetsProps);
  const hqField=getField(s,ctx,mt,'hq',()=>ctx.targetsProps.filter(([x,y])=>s.map.grid[y][x].t==='hq'));
  const repKind=d.cls==='plane'||d.cls==='copter'?'air':d.cls==='ship'?'ship':'ground';
  const repField=getField(s,ctx,mt,'rep'+repKind,()=>ctx.repairs(repKind));
  const wantRepair = hpD<=3 && !d.cap || (d.daily && u.fuel<d.daily*4+8);
  let best={v:-Infinity};
  const consider=(v,plan)=>{ if(v>best.v) best={v,...plan}; };
  for(const k of R.dist.keys()){
    const x=k%1000,y=Math.floor(k/1000), c=R.dist.get(k);
    const o=E.unitAt(s,x,y); if(o&&o!==u) continue; // AI는 탑승·합류를 쓰지 않는다
    const moved=(x!==u.x||y!==u.y), t=s.map.grid[y][x];
    const risk=threatAt(s,ctx,u,x,y)*(d.cap?0.35:0.6);
    const stars=d.mt==='air'?0:TERRAIN[t.t].def;
    // 공격
    for(const tg of E.targetsFrom(s,u,x,y,moved)){
      const a=avgDamage(s,u,tg,x,y); if(!a) continue;
      const tcost=UNITS[tg.type].cost;
      let v=a.dmg/100*tcost - a.counter/100*cost*0.9;
      if(a.dmg>=tg.hp) v+=tcost*0.35;
      const tt=s.map.grid[tg.y][tg.x]; if(tt.capId===tg.id && tt.owner===ctx.p) v+=2500+(tt.t==='hq'?20000:0);
      if(tg.cargo.length) v+=tg.cargo.reduce((n,c)=>n+UNITS[c.type].cost,0)*a.dmg/100;
      consider(v-risk*0.5+stars*30+300, {x,y,c,act:'attack',target:tg});
    }
    // 점령
    if(d.cap && TERRAIN[t.t].prop && t.owner!==ctx.p){
      const left=t.capId===u.id?t.cp:20; let pts=hpD; if(s.players[ctx.p].co===3) pts=Math.floor(pts*1.5);
      const finish=pts>=left||(s.players[ctx.p].co===3&&s.players[ctx.p].power===2);
      let v=PROP_VALUE[t.t]*(finish?1.4:0.9)+(t.owner?600:0)+(t.capId===u.id?1500:0);
      consider(v-risk*0.6, {x,y,c,act:'capture'});
    }
    // 대기(다음 목표 쪽으로 다가가기)
    let pos;
    if(wantRepair) pos=-repField(x,y)*260 + (repField(x,y)===0?1500:0);
    else if(d.cap) pos=-Math.min(propField(x,y),enemyField(x,y)+6)*180;
    else if(d.indirect){ const r=E.rangeOf(s,u); const ef=enemyField(x,y); pos=-Math.max(0,ef-r[1])*170 - (ef<r[0]?400:0); }
    else if(!d.range) pos=-propField(x,y)*40; // 수송 유닛: AI가 거의 만들지 않음
    else pos=-Math.min(enemyField(x,y), hqField(x,y)+4)*170;
    if(!isFinite(pos)) pos=-hqField(x,y)*100||-5000;
    if(!isFinite(pos)) pos=-5000;
    // 생산 거점 막지 않기
    if(['factory','airport','port'].includes(t.t)&&t.owner===ctx.p&&moved===false&&!wantRepair) pos-=600;
    if(['factory','airport','port'].includes(t.t)&&t.owner===ctx.p&&!wantRepair) pos-=250;
    consider(pos-risk+stars*40, {x,y,c,act:'wait'});
  }
  return best;
}
function chooseBuild(s,ctx,x,y,options,budget,left){
  const p=ctx.p, P=s.players[p], price=t=>E.priceOf(s,p,t);
  const cnt=(arr,f)=>arr.filter(f).length;
  const myFoot=cnt(ctx.mine,u=>UNITS[u.type].cls==='foot');
  const enemyAir=ctx.enemies.filter(u=>['plane','copter'].includes(UNITS[u.type].cls));
  const myAA=cnt(ctx.mine,u=>u.type==='aa'||u.type==='missile'||u.type==='fighter');
  const enemyArmor=cnt(ctx.enemies,u=>['tank','md','neo'].includes(u.type));
  const enemyShips=ctx.enemies.filter(u=>UNITS[u.type].cls==='ship');
  const neutralLeft=ctx.targetsProps.length;
  const affordable=t=>options.includes(t)&&price(t)<=budget;
  const kind=s.map.grid[y][x].t;
  if(kind==='airport'){
    if(enemyAir.length>myAA && affordable('fighter')) return 'fighter';
    const aaE=cnt(ctx.enemies,u=>u.type==='aa'||u.type==='missile');
    if(aaE<=1 && affordable('bomber') && budget>30000) return 'bomber';
    if(aaE<=2 && affordable('bcopter')) return 'bcopter';
    return null;
  }
  if(kind==='port'){
    if(enemyShips.some(u=>u.type==='bship'||u.type==='lander') && affordable('sub')) return 'sub';
    if(enemyShips.some(u=>u.type==='sub') && affordable('cruiser')) return 'cruiser';
    if(budget>=42000 && affordable('bship')) return 'bship';
    return null;
  }
  // 공장(또는 곳간의 도시)
  const wantFoot = myFoot < 2 + Math.min(6, Math.ceil(neutralLeft/3));
  if(wantFoot && (budget<9000 || myFoot<3 || left>1)){
    if(enemyArmor>=2 && affordable('mech') && budget>=9000) return 'mech';
    if(affordable('inf')) return 'inf';
  }
  if(enemyAir.length>myAA && affordable('aa')) return 'aa';
  const myDirect=cnt(ctx.mine,u=>['tank','md','neo'].includes(u.type)), myInd=cnt(ctx.mine,u=>['art','rocket'].includes(u.type));
  const r=E.rng(s);
  if(myInd*2<myDirect && budget<26000 && affordable('art') && r<0.6) return 'art';
  if(myInd*2<myDirect && affordable('rocket') && r<0.35) return 'rocket';
  if(affordable('neo') && enemyArmor>=2 && budget>=30000) return 'neo';
  if(affordable('md') && budget>=20000) return 'md';
  if(affordable('tank')) return 'tank';
  if(affordable('art') && r<0.5) return 'art';
  if(affordable('mech') && enemyArmor) return 'mech';
  if(affordable('inf')) return 'inf';
  return null;
}
function next(s){
  if(s.winner) return null;
  const p=s.turn, P=s.players[p], co=COS[P.co-1];
  if(!P.power){
    if(P.meter>=co.scop.stars*STAR_VALUE) return {k:'power',level:2};
    if(P.meter>=co.cop.stars*STAR_VALUE && co.scop.stars-co.cop.stars>=3 && P.meter<(co.scop.stars-1)*STAR_VALUE){
      const ctx0=makeCtx(s,p);
      if(P.co===1 ? ctx0.mine.reduce((n,u)=>n+(10-E.disp(u.hp)),0)>=8 : ctx0.mine.length>=4) return {k:'power',level:1};
    }
  }
  const ready=E.readyUnits(s,p);
  if(ready.length){
    const ctx=makeCtx(s,p);
    const order=u=>{const d=UNITS[u.type]; return d.indirect?0 : E.targetsFrom(s,u,u.x,u.y,false).length?1 : d.cap?2 : 3;};
    ready.sort((a,b)=>order(a)-order(b));
    const u=ready[0], b=bestFor(s,ctx,u);
    const R=E.reach(s,u), path=E.pathTo(R,u.x,u.y,b.x,b.y)||[[u.x,u.y]];
    return {k:'move', id:u.id, x:b.x, y:b.y, cost:b.c||0, path, act:b.act, target:b.target?b.target.id:0};
  }
  // 생산
  const ctx=makeCtx(s,p);
  const spots=[];
  for(let y=0;y<s.map.H;y++) for(let x=0;x<s.map.W;x++){ const opts=E.canBuildAt(s,p,x,y); if(opts.length&&!E.unitAt(s,x,y)) spots.push([x,y,opts]); }
  spots.sort((a,b)=>({factory:0,city:1,airport:2,port:3}[s.map.grid[a[1]][a[0]].t]-{factory:0,city:1,airport:2,port:3}[s.map.grid[b[1]][b[0]].t]));
  if(!s._aiTried) s._aiTried=new Set();
  for(const [x,y,opts] of spots){
    const k=E.key(x,y); if(s._aiTried.has(k)) continue; s._aiTried.add(k);
    const left=spots.length;
    const type=chooseBuild(s,ctx,x,y,opts,P.funds,left);
    if(type) return {k:'build',x,y,type};
  }
  s._aiTried=null;
  return {k:'end'};
}
function apply(s,a){
  if(a.k==='power') return E.usePower(s,s.turn,a.level);
  if(a.k==='build') return E.build(s,s.turn,a.x,a.y,a.type);
  if(a.k==='end'){ s._aiTried=null; E.endTurn(s); return true; }
  if(a.k==='move'){
    const u=s.units.find(u=>u.id===a.id); if(!u) return false;
    E.commitMove(s,u,a.x,a.y,a.cost);
    if(a.act==='attack'){ const t=s.units.find(v=>v.id===a.target); if(t) E.attack(s,u,t); }
    else if(a.act==='capture') E.capture(s,u);
    if(s.units.includes(u)) u.done=true;
    return true;
  }
}
const AI={next,apply};
if(typeof module!=='undefined') module.exports=AI; else root.AI=AI;
})(typeof self!=='undefined'?self:this);
