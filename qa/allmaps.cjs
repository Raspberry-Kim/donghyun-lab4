// 엔진만으로 20개 지도를 컴퓨터 대 컴퓨터로 끝까지(최대 40일) 둔다.
const D=require('../src/data.js');
const E=require('../src/engine.js'); const AI=require('../src/ai.js');
for(const m of D.MAPS){
  const S=E.newGame({map:m.id,co1:1+(m.id%5),co2:1+((m.id+2)%5),first:1,funds:0,seed:m.id});
  const t0=Date.now(); let maxTurn=0; let acts=0;
  while(!S.winner && S.day<=40){ const t1=Date.now();
    for(let i=0;i<400;i++){ const a=AI.next(S); if(!a||a.k==='end') break; AI.apply(S,a); acts++; if(S.winner) break; }
    maxTurn=Math.max(maxTurn,Date.now()-t1); if(S.winner) break; E.endTurn(S); }
  const n=o=>S.units.filter(u=>u.owner===o).length;
  console.log(String(m.id).padStart(2),m.name.padEnd(7),'day',S.day,'winner',S.winner||'-','units',n(1)+'/'+n(2),'maxTurnMs',maxTurn,'total',Date.now()-t0);
}
