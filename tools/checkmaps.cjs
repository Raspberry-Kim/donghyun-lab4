const D=require('../src/data.js');
for(const m of D.MAPS){
  const cnt={};let bad=[];
  for(const r of m.grid) for(const c of r){ if(!m.grid[0]||r.length!==m.W) bad.push('width'); if(D.TERRAIN[c.t].prop){const k=c.t+c.owner;cnt[k]=(cnt[k]||0)+1;} }
  // foot reachability from player factories to enemy HQ (land, incl bridge/shoal/river)
  const land=t=>!['sea','reef'].includes(t);
  const start=[];m.grid.forEach((r,y)=>r.forEach((c,x)=>{if(c.t==='factory'&&c.owner===1)start.push([x,y]);}));
  const seen=new Set(start.map(p=>p+''));const q=[...start];
  while(q.length){const [x,y]=q.shift();for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=m.W||ny>=m.H)continue;const k=nx+','+ny;if(seen.has(k)||!land(m.grid[ny][nx].t))continue;seen.add(k);q.push([nx,ny]);}}
  // 무한궤도 차량(전차)도 공장에서 적 본부까지 땅으로 가는가
  const tread=x=>D.MOVE_COST.tread[D.TERRAIN_ORDER.indexOf(x)]>0;
  const tv=new Set(start.map(p=>p+''));const tq=[...start];
  while(tq.length){const [x,y]=tq.shift();for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=m.W||ny>=m.H)continue;const k=nx+','+ny;if(tv.has(k)||!tread(m.grid[ny][nx].t))continue;tv.add(k);tq.push([nx,ny]);}}
  let hq2;m.grid.forEach((r,y)=>r.forEach((c,x)=>{if(c.t==='hq'&&c.owner===2)hq2=x+','+y;}));
  // 뱃길: 양 진영 항구(없으면 중립 항구까지)가 한 바다로 이어지는가
  const ship=t=>['sea','reef','port'].includes(t), ports=[];m.grid.forEach((r,y)=>r.forEach((c,x)=>{if(c.t==='port')ports.push([x,y,c.owner]);}));
  let sea='-';
  if(ports.length){const [sx,sy]=ports[0];const S=new Set([sx+','+sy]);const Q=[[sx,sy]];while(Q.length){const [x,y]=Q.shift();for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=m.W||ny>=m.H)continue;const k=nx+','+ny;if(S.has(k)||!ship(m.grid[ny][nx].t))continue;S.add(k);Q.push([nx,ny]);}}sea=ports.every(([x,y])=>S.has(x+','+y));}
  const f=t=>(cnt[t+'0']||0)+'/'+(cnt[t+'1']||0);
  console.log(m.id,m.name,m.W+'x'+m.H,'city',f('city'),'fac',f('factory'),'air',f('airport'),'port',f('port'),'hqReach',seen.has(hq2),'treadReach',tv.has(hq2),'seaLink',sea,bad.length?'BAD':'');
}
