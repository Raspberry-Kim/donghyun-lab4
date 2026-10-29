const E=require('../src/engine.js'), AI=require('../src/ai.js');
const res=[];
for(const map of [1,2,3,4]) for(const [c1,c2] of [[1,1],[2,3],[4,5],[5,2]]){
  const s=E.newGame({map,co1:c1,co2:c2,first:1,funds:0,seed:map*100+c1*10+c2});
  s.players[1].ai=true;
  let acts=0, t0=Date.now(), stuck=0;
  while(!s.winner && s.day<=40 && acts<20000){
    const a=AI.next(s); if(!a) break; const ok=AI.apply(s,a); acts++;
    if(ok===false||ok===null){ if(a.k==='build'){} else {stuck++; if(stuck>50){console.log('stuck',a);break;}} }
  }
  const u=p=>s.units.filter(x=>x.owner===p).length;
  res.push(`map${map} co${c1}v${c2} day${s.day} win${s.winner}(${s.reason}) acts${acts} units ${u(1)}/${u(2)} props ${E.propsOf(s,1)}/${E.propsOf(s,2)} ${Date.now()-t0}ms`);
}
console.log(res.join('\n'));
