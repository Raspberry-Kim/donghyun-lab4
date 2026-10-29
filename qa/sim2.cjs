const E=require('../src/engine.js'), AI=require('../src/ai.js');
const map=+process.argv[2]||1;
const s=E.newGame({map,co1:1,co2:1,first:1,funds:0,seed:7}); s.players[1].ai=true;
let lastDay=0;
while(!s.winner&&s.day<=30){const a=AI.next(s);AI.apply(s,a);
 if(s.day!==lastDay&&s.turn===1){lastDay=s.day; if(s.day%5===0){console.log('day',s.day,'kills',s.players[1].kills,s.players[2].kills,'funds',s.players[1].funds,s.players[2].funds,'units',s.units.filter(u=>u.owner===1).map(u=>u.type).join(','));
 const g=s.map.grid.map(r=>r.map(c=>c.t[0]));for(const u of s.units)g[u.y][u.x]=u.owner===1?'1':'2';console.log(g.map(r=>r.join('')).join('\n'));}}}
