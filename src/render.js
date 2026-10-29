/* 동현전 그림: 16px 칸의 도트 지형과 유닛. 모든 그림은 이 파일의 코드로 새로 그린다. */
(function(root){
const T=16, PAD=4; // PAD: 맨 윗줄 산·건물 꼭대기가 잘리지 않게 둔 위 여백
const PAL={
  1:{m:'#d8483a',d:'#8e2a22',l:'#f39a7c'},
  2:{m:'#3a6fd8',d:'#22408f',l:'#8db2f2'},
  0:{m:'#b9b1a2',d:'#7a7266',l:'#e2dccf'}
};
const C={k:'#231d18',g:'#9a978c',G:'#5d5b53',w:'#f6f2e8',s:'#f1c493',y:'#f2b705',b:'#2c2722',o:'#e08a2e'};

/* 유닛 도트(오른쪽을 본다). m 진영색 · d 진영 어두운색 · l 진영 밝은색 · k 윤곽 · g/G 금속 · w 흰색 · s 피부 · y 노랑 */
const SPR={
inf:[
'................',
'................',
'......kkkk......',
'.....kmmmmk.....',
'.....kddddkk....',
'.....kssssk.....',
'......kssk......',
'.....kmmmmkkkkk.',
'....kmmmmmgggggk',
'....kmkmmmkkkkk.',
'.....kmmmmk.....',
'.....kddddk.....',
'.....kdkkdk.....',
'.....kdk.kdk....',
'....kkk..kkk....',
'................'],
mech:[
'................',
'................',
'......kkkk......',
'.....kddddk.....',
'.....kddddkk....',
'...kkkkkkkkkkkk.',
'..kGggggggggggGk',
'...kkkskkkkkkkk.',
'....kmmmmmk.....',
'...kmmmmmmmk....',
'...kmkmmmmkk....',
'....kmmmmmk.....',
'....kddddddk....',
'....kddkkddk....',
'...kkkk..kkkk...',
'................'],
recon:[
'................',
'................',
'................',
'................',
'.......kkkk.....',
'......kwwwlk....',
'.....kmmmmmmkkk.',
'...kkmmmmmmmgggk',
'..kmmmmmmmmmmmk.',
'..kmmlllllllmmk.',
'..kddddddddddddk',
'..kkkGkkkkkGkkk.',
'...kGgGk..kGgGk.',
'....kGk....kGk..',
'................',
'................'],
tank:[
'................',
'................',
'................',
'................',
'......kkkkk.....',
'.....kmmmmmkkkkk',
'.....kmlmmmggggk',
'....kkmmmmmkkkkk',
'..kkkkkkkkkkkk..',
'..kmmmmmmmmmmmk.',
'..kddddddddddddk',
'.kGgGgGgGgGgGgk.',
'.kgGgGgGgGgGgGk.',
'..kkkkkkkkkkkk..',
'................',
'................'],
md:[
'................',
'................',
'................',
'.....kkkkkk.....',
'....kmmmmmmkkkkk',
'....kmlmmmmggggk',
'....kmmmmmmggggk',
'...kkkkkkkkkkkkk',
'.kkmmmmmmmmmmmk.',
'.kmmmmmmmmmmmmmk',
'.kddddddddddddddk',
'kGgGgGgGgGgGgGgk',
'kgGgGgGgGgGgGgGk',
'.kkkkkkkkkkkkkk.',
'................',
'................'],
neo:[
'................',
'................',
'................',
'................',
'.....kkkkkkk....',
'....kmmlllmmkkkk',
'....kmmmmmmmgggk',
'...kkkkkkkkkkkk.',
'..kmmmmmmmmmmmmk',
'.kmyyyyyyyyyyymk',
'.kddddddddddddk.',
'.kGgGgGgGgGgGgk.',
'.kgGgGgGgGgGgGk.',
'..kkkkkkkkkkkk..',
'................',
'................'],
apc:[
'................',
'................',
'................',
'................',
'...kkkkkkkkk....',
'..kmmmmmmmmmkk..',
'..kmmwwmmmmmmmk.',
'..kmmwwmmmmmmmmk',
'..kmmmmmmmmmmmmk',
'..kddddddddddddk',
'..kdddyddddddddk',
'.kGgGgGgGgGgGgk.',
'.kgGgGgGgGgGgGk.',
'..kkkkkkkkkkkk..',
'................',
'................'],
art:[
'................',
'................',
'................',
'.............kk.',
'............kgk.',
'...........kgk..',
'.....kkkk.kgk...',
'....kmmmmkgk....',
'....kmmmmmgk....',
'..kkkkkkkkkkkk..',
'..kmmmmmmmmmmmk.',
'..kddddddddddddk',
'.kGgGgGgGgGgGgk.',
'.kgGgGgGgGgGgGk.',
'..kkkkkkkkkkkk..',
'................'],
rocket:[
'................',
'................',
'................',
'.......kkkkkkk..',
'......kGgGgGgGk.',
'.....kGwGwGwGk..',
'....kGgGgGgGk...',
'...kkkkkkkkk....',
'..kmmmmmmmmkkkk.',
'..kmmmmmmmmkwwmk',
'..kddddddddkmmmk',
'..kkkkkkkkkkkkkk',
'...kGgGk..kGgGk.',
'....kGk....kGk..',
'................',
'................'],
aa:[
'................',
'................',
'................',
'........k..k....',
'.......kgkkgk...',
'.......kgkkgk...',
'......kkgkkgk...',
'.....kmmmmmmk...',
'.....kmlmmmmk...',
'..kkkkkkkkkkkk..',
'..kmmmmmmmmmmmk.',
'..kddddddddddddk',
'.kGgGgGgGgGgGgk.',
'.kgGgGgGgGgGgGk.',
'..kkkkkkkkkkkk..',
'................'],
missile:[
'................',
'................',
'.........k...k..',
'........kwk.kwk.',
'........kyk.kyk.',
'........kwk.kwk.',
'.......kkgkkkgk.',
'......kGgggggGk.',
'...kkkkkkkkkkk..',
'..kmmmmmmmkkkkk.',
'..kmmmmmmmkwwmmk',
'..kddddddddkmmmk',
'..kkkkkkkkkkkkkk',
'...kGgGk..kGgGk.',
'....kGk....kGk..',
'................'],
fighter:[
'................',
'................',
'................',
'...kk...........',
'...kmk..........',
'...kmmk.........',
'...kmmmkkkkkk...',
'..kmmmmmmmmwwkk.',
'.kGmmmmmmmmmmmmk',
'..kkkddddddddkk.',
'.....kmmmk......',
'.....kmmk.......',
'.....kkk........',
'................',
'................',
'................'],
bomber:[
'................',
'................',
'................',
'..kk............',
'..kmk...kkkk....',
'..kmmkkkmmmmk...',
'.kkmmmmmmmmmwkk.',
'kmmmmmmmmmmmmmmk',
'kdddddddddddddk.',
'.kkkkdmmmmmdkk..',
'.....kdmmmdk....',
'......kkdkk.....',
'.......kGk......',
'................',
'................',
'................'],
bcopter:[
'................',
'.kkkkkkkkkkkkkk.',
'.......kk.......',
'.......kk.......',
'.....kkkkkkk....',
'....kmmmmmwwk...',
'kk.kmmmmmmwwwk..',
'kmkmmmmmmmmmmmk.',
'kmmmmmmmmmmmmmk.',
'.kkkkddddddddk..',
'.....kGgGgGkk...',
'.....kkkkkkkGk..',
'.....k.....kk...',
'....kkkkkkkk....',
'................',
'................'],
tcopter:[
'................',
'kkkkkkk..kkkkkkk',
'...kk......kk...',
'...kk......kk...',
'..kkkkkkkkkkkk..',
'.kmmmmmmmmmmwwk.',
'kmmmmmmmmmmmwwwk',
'kmwwmwwmmmmmmmmk',
'kmmmmmmmmmmmmmmk',
'kddddddddddddddk',
'.kkkkkkkkkkkkkk.',
'...kk......kk...',
'..kkkk....kkkk..',
'................',
'................',
'................'],
bship:[
'................',
'................',
'................',
'.......kk.......',
'......kGGk......',
'..kk.kGggGk.kk..',
'.kgGkkkkkkkkGgk.',
'..kkmmmmmmmmkk..',
'.kkmmmmmmmmmmkk.',
'kmmmmmmmmmmmmmmk',
'kddddddddddddddk',
'.kdwdwdwdwdwdwk.',
'..kkkkkkkkkkkk..',
'................',
'................',
'................'],
cruiser:[
'................',
'................',
'................',
'................',
'........k.......',
'.......kgk......',
'....kkkkgkkk.k..',
'...kmmmmmmmmkgk.',
'..kmmmmmmmmmmkk.',
'.kmmmmmmmmmmmmmk',
'kddddddddddddddk',
'.kdwdwdwdwdwdwk.',
'..kkkkkkkkkkkk..',
'................',
'................',
'................'],
lander:[
'................',
'................',
'................',
'................',
'................',
'..........kkk...',
'.........kmwmk..',
'.kkkkkkkkkmmmmk.',
'kmmmmmmmmmmmmmmk',
'kmGgGgGgGgGmmmmk',
'kddddddddddddddk',
'.kddddddddddddk.',
'..kkkkkkkkkkkk..',
'................',
'................',
'................'],
sub:[
'................',
'................',
'................',
'................',
'................',
'.......k........',
'......kgk.......',
'.....kmmmk......',
'....kmmmmmk.....',
'..kkmmmmmmmkkk..',
'.kmmmmmmmmmmmmk.',
'kmmmmmmmmmmmmmmk',
'.kddddddddddddk.',
'..kkkkkkkkkkkk..',
'................',
'................']
};
const DIG={0:['111','101','101','101','111'],1:['010','110','010','010','111'],2:['111','001','111','100','111'],3:['111','001','111','001','111'],4:['101','101','111','001','001'],5:['111','100','111','001','111'],6:['111','100','111','101','111'],7:['111','001','010','010','010'],8:['111','101','111','101','111'],9:['111','101','111','001','111']};

function mk(w,h){ const c=document.createElement('canvas'); c.width=w; c.height=h; return c; }
const cache={};
function sprite(type,owner,gray){
  const k=type+owner+(gray?'g':'');
  if(cache[k]) return cache[k];
  const c=mk(T,T), x=c.getContext('2d'), P=PAL[owner], rows=SPR[type];
  for(let y=0;y<T;y++){ const r=(rows[y]||'').padEnd(T,'.').slice(0,T);
    for(let i=0;i<T;i++){ const ch=r[i]; if(ch==='.') continue;
      let col=P[ch]||C[ch]; if(!col) continue;
      if(gray) col=grayify(col);
      const px=owner===2?T-1-i:i; x.fillStyle=col; x.fillRect(px,y,1,1); } }
  return cache[k]=c;
}
function grayify(hex){
  const n=parseInt(hex.slice(1),16), r=n>>16&255,g=n>>8&255,b=n&255, v=Math.round((r*.3+g*.55+b*.15)*.72+30);
  return `rgb(${v},${v},${v-6})`;
}
function hash(x,y,s=0){ let h=(x*374761393+y*668265263+s*982451653)>>>0; h=(h^(h>>>13))*1274126177>>>0; return (h^(h>>>16))>>>0; }

/* ---- 지형 ---- */
const TC={grass:'#8fc85b',grassB:'#96cd63',grass2:'#7ab349',grass3:'#a6d872',tree:'#3f8a3a',tree2:'#2d6b2c',trunk:'#6b4a2c',
  rock:'#a08467',rock2:'#7a604a',snow:'#f4efe4',water:'#4c8fd9',water2:'#3b78c4',wave:'#9cc6f2',sand:'#e9d79a',sand2:'#cdb876',
  road:'#d3c7a6',road2:'#a39578',plank:'#a8784a',plank2:'#7d5530'};
const isWater=t=>t==='sea'||t==='reef'||t==='river'||t==='shoal'||t==='bridge';
const seaLike=t=>t==='sea'||t==='reef';
function drawTerrain(g,map,x,y){
  const cell=map.grid[y][x], t=cell.t, X=x*T, Y=y*T;
  const at=(dx,dy)=>{ const yy=y+dy,xx=x+dx; if(yy<0||xx<0||yy>=map.H||xx>=map.W) return null; return map.grid[yy][xx].t; };
  const R=(a,b,w,h,c)=>{ g.fillStyle=c; g.fillRect(X+a,Y+b,w,h); };
  const grass=()=>{ R(0,0,T,T,(x+y)%2?TC.grass:TC.grassB); for(let i=0;i<3;i++){ const h=hash(x,y,i); R(h%14+1,(h>>>4)%14+1,1,1,TC.grass2); R((h>>>8)%14+1,(h>>>12)%14+1,1,1,TC.grass3);} };
  const sea=()=>{ R(0,0,T,T,TC.water); const h=hash(x,y,7); R(h%10+2,(h>>>5)%10+3,3,1,TC.wave); R((h>>>9)%10+2,(h>>>13)%10+3,2,1,TC.water2);
    // 땅과 맞닿은 쪽에 모래 가장자리
    const land=(dx,dy)=>{ const n=at(dx,dy); return n && !isWater(n); };
    if(land(0,-1)) R(0,0,T,2,TC.sand); if(land(0,1)) R(0,T-2,T,2,TC.sand); if(land(-1,0)) R(0,0,2,T,TC.sand); if(land(1,0)) R(T-2,0,2,T,TC.sand); };
  if(t==='plain') grass();
  else if(t==='forest'){ grass(); const pp=propPal(0); R(1,13,14,2,'rgba(20,30,10,.22)'); for(const [a,b] of [[5,-3],[1,3],[8,4]]) stamp(g,PROP.tree,X+a,Y+b,pp); }
  else if(t==='mountain'){ grass(); stamp(g,PROP.mountain,X,Y-4,propPal(0)); }
  else if(t==='road'||t==='bridge'||t==='river'){
    if(t==='road') grass(); else { grass(); }
    const conn=n=>{ if(!n) return false; if(t==='river') return n==='river'||n==='bridge'||seaLike(n)||n==='shoal';
      return n==='road'||n==='bridge'||['city','factory','airport','port','hq'].includes(n); };
    const col=t==='road'?TC.road:TC.water, edge=t==='road'?TC.road2:TC.water2;
    const up=conn(at(0,-1)),dn=conn(at(0,1)),lf=conn(at(-1,0)),rt=conn(at(1,0));
    const any=up||dn||lf||rt;
    if(t==='bridge'){ // 다리 밑 물: 강이나 바다 쪽 방향
      const wv=n=>n&&(n==='river'||seaLike(n)||n==='shoal'||n==='bridge');
      const vert=wv(at(0,-1))||wv(at(0,1));
      R(0,0,T,T,TC.water); if(vert){ R(0,3,T,10,TC.plank); for(let i=0;i<T;i+=3) R(i,3,1,10,TC.plank2); R(0,3,T,1,TC.plank2); R(0,12,T,1,TC.plank2);} else { R(3,0,10,T,TC.plank); for(let i=0;i<T;i+=3) R(3,i,10,1,TC.plank2); R(3,0,1,T,TC.plank2); R(12,0,1,T,TC.plank2);} 
    } else if(t==='road'){
      // 도로는 칸을 채우고, 이어지지 않은 쪽에만 풀밭 가장자리를 남긴다
      R(0,0,T,T,col);
      if(!up){ R(0,0,T,3,TC.grass); R(0,3,T,1,edge); }
      if(!dn){ R(0,T-3,T,3,TC.grass); R(0,T-4,T,1,edge); }
      if(!lf){ R(0,0,3,T,TC.grass); R(3,up?0:3,1,T-(up?0:3)-(dn?0:3),edge); }
      if(!rt){ R(T-3,0,3,T,TC.grass); R(T-4,up?0:3,1,T-(up?0:3)-(dn?0:3),edge); }
      if(!up&&!lf) R(0,0,4,4,TC.grass); if(!up&&!rt) R(T-4,0,4,4,TC.grass); if(!dn&&!lf) R(0,T-4,4,4,TC.grass); if(!dn&&!rt) R(T-4,T-4,4,4,TC.grass);
      const h=hash(x,y,9); R(4+h%8,4+(h>>>4)%8,1,1,edge);
    } else {
      R(4,4,8,8,col);
      if(up||!any) R(4,0,8,5,col); if(dn||!any) R(4,11,8,5,col); if(lf) R(0,4,5,8,col); if(rt) R(11,4,5,8,col);
      const h=hash(x,y,3); R(6+(h%3),6+(h>>>3)%3,2,1,TC.wave);
    }
  }
  else if(t==='sea') sea();
  else if(t==='reef'){ sea(); R(3,8,4,3,TC.rock2); R(4,7,2,1,TC.rock); R(9,4,3,3,TC.rock2); R(10,3,1,1,TC.rock); R(10,10,3,2,TC.rock); }
  else if(t==='shoal'){ R(0,0,T,T,TC.sand); const h=hash(x,y,5); R(h%10+2,(h>>>4)%10+3,2,1,TC.sand2); R((h>>>8)%10+3,(h>>>12)%10+2,1,1,TC.sand2);
    const w=(dx,dy)=>{const n=at(dx,dy);return n&&seaLike(n);};
    if(w(0,-1)) R(0,0,T,3,TC.water); if(w(0,1)) R(0,T-3,T,3,TC.water); if(w(-1,0)) R(0,0,3,T,TC.water); if(w(1,0)) R(T-3,0,3,T,TC.water); }
  else { if(cell.t!=='port') grass(); drawProperty(g,cell,X,Y,at); }
}
/* 건물·산·나무 도트: 칸보다 4px 높게 그려 위 칸에 살짝 겹친다(아래 줄이 나중에 그려진다). */
const PROP={
city:[
'................','..kkkkk.........','.klllllk........','.kmmmmmdk.......','.kmwmwmdk.......','.kmmmmmdk.......',
'.kmwmwmdkkkkkk..','.kmmmmmdklllldk.','.kmwmwmdkmmmmdk.','.kmmmmmdkmwwmdk.','.kmwmwmdkmmmmdk.','.kmmmmmdkmwwmdk.',
'.kmwmwmdkmmmmdk.','.kmmmmmdkmmmmdk.','.kmmkkmdkmkkmdk.','.kmmkkmdkmkkmdk.','.kkkkkkkkkkkkkk.','..SSSSSSSSSSSSS.'],
factory:[
'...........kk...','..........kGGk..','..........kggk..','..........kggk..','..........kggk..','.kk..kk...kggk..',
'kmmk.kmmk.kggk..','kmmmkkmmmkkggkk.','kllllllllllllldk','kmmmmmmmmmmmmmdk','kmkkkkkkkkkkkmdk','kmkGgGgGgGgGkmdk',
'kmkgGgGgGgGgkmdk','kmkGgGgGgGgGkmdk','kmkgGgGgGgGgkmdk','kmkkkkkkkkkkkmdk','kkkkkkkkkkkkkkkk','.SSSSSSSSSSSSSS.'],
airport:[
'................','..........kkkkk.','..........kwwwk.','..........kkkkk.','...........kmk..','...........kdk..',
'...kkkk....kmk..','.kkllllkk..kdk..','kllllllllk.kmk..','kmmmmmmmdk.kdk..','kmkkkkkmdk.kmk..','kmkGgGkmdk.kdk..',
'kmkgGgkmdk.kmk..','kmkGgGkmdkkkkkk.','kkkkkkkkkk.SSSS.','.SSSSSSSS.......'],
port:[
'........kkkkkkk.','.......kmmmmmmmk','.......kkkkkkkk.','........kgk..k..','........kgk..k..','........kgk.kGk.',
'........kgk.kkk.','........kgk.....','...kkkkkkgkk....','..kmmmmmmmmdk...','..kmwwmmmmmdk...','..kmmmmmmmmdk...','..kkkkkkkkkkk...'],
hq:[
'.......kyyyk....','.......kyyk.....','.......kk.......','.......kk.......','.....kkkkkk.....','....kllllldk....',
'....kmmmmmdk....','...kkkkkkkkkk...','..klllllllllk...','.kkkkkkkkkkkkkk.','.kmmmmmmmmmmmdk.','.kmwkmwkmwkmmdk.',
'.kmwkmwkmwkmmdk.','.kmwkmwkmwkmmdk.','.kmmmmmmmmmmmdk.','.kmmmmkkkmmmmdk.','.kkkkkkkkkkkkkk.','..SSSSSSSSSSSSS.'],
mountain:[
'................','.......kk.......','......kwwk......','.....kwwwRk.....','.....kwwrRk.....','....krrwrRRk....',
'....krrrrRRk....','...krrrrrRRRk...','...krrrrrRRRk...','..krrrrrrRRRRk..','..krrrrrRRRRRk..','.krrrrrrRRRRRRk.',
'.krrrrrrRRRRRRk.','krrrrrrrRRRRRRRk','krrrrrrRRRRRRRRk','kkkkkkkkkkkkkkkk','.SSSSSSSSSSSSSS.'],
tree:[
'..kkk..','.kaabk.','kaabbbk','kabbbck','kbbbcck','.kccck.','..ktk..','..kkk..']
};
function stamp(g,rows,X,Y,pal){
  for(let y=0;y<rows.length;y++){ const r=rows[y];
    for(let i=0;i<r.length;i++){ const ch=r[i]; if(ch==='.') continue; const c=pal[ch]||C[ch]; if(!c) continue; g.fillStyle=c; g.fillRect(X+i,Y+y,1,1); } }
}
function propPal(owner){ const P=PAL[owner||0]; return {m:P.m,d:P.d,l:P.l,S:'rgba(20,30,10,.28)',y:owner?C.y:P.l,
  r:TC.rock,R:TC.rock2,a:TC.grass3,b:TC.tree,c:TC.tree2,t:TC.trunk}; }
function drawProperty(g,cell,X,Y,at){
  const t=cell.t, pal=propPal(cell.owner);
  const R=(a,b,w,h,c)=>{ g.fillStyle=c; g.fillRect(X+a,Y+b,w,h); };
  if(t==='port'){ R(0,0,T,T,TC.water); R(0,7,T,9,TC.road2); R(0,7,T,1,C.k); for(let i=1;i<T;i+=4) R(i,9,2,6,TC.road); R(0,15,T,1,TC.plank2);
    stamp(g,PROP.port,X,Y-4,pal); return; }
  if(t==='airport'){ R(0,11,T,5,TC.road2); R(0,11,T,1,TC.sand2); for(let i=1;i<T;i+=5) R(i,13,3,1,C.w); stamp(g,PROP.airport,X,Y-4,pal); return; }
  stamp(g,PROP[t],X,Y-4,pal);
}
function terrainLayer(map){
  const c=mk(map.W*T,map.H*T+PAD), g=c.getContext('2d'); g.translate(0,PAD);
  for(let y=0;y<map.H;y++) for(let x=0;x<map.W;x++) drawTerrain(g,map,x,y);
  return c;
}
function digit(g,n,x,y,col){ const s=String(n); let ox=x;
  for(const ch of s){ const d=DIG[ch]; g.fillStyle=C.k; g.fillRect(ox-1,y-1,5,7); g.fillStyle=col||C.w;
    for(let r=0;r<5;r++) for(let i=0;i<3;i++) if(d[r][i]==='1') g.fillRect(ox+i,y+r,1,1); ox+=4; } }

/* ---- 장면 ---- */
function draw(g, s, ui, now){
  const map=s.map;
  if(!ui.terrain || ui.terrainKey!==ui.terrainVer){ ui.terrain=terrainLayer(map); ui.terrainKey=ui.terrainVer; }
  g.imageSmoothingEnabled=false;
  g.drawImage(ui.terrain,0,0); g.save(); g.translate(0,PAD);
  // 이동 · 공격 범위
  if(ui.moveSet){ g.fillStyle='rgba(120,190,255,.48)'; for(const k of ui.moveSet){ g.fillRect((k%1000)*T,Math.floor(k/1000)*T,T,T);} }
  if(ui.atkSet){ g.fillStyle='rgba(240,70,50,.42)'; for(const k of ui.atkSet){ g.fillRect((k%1000)*T,Math.floor(k/1000)*T,T,T);} }
  if(ui.spots){ g.fillStyle='rgba(255,220,80,.55)'; for(const [x,y] of ui.spots) g.fillRect(x*T,y*T,T,T); }
  // 경로 화살표
  if(ui.path && ui.path.length>1){
    g.fillStyle='rgba(255,246,214,.95)';
    for(let i=0;i<ui.path.length;i++){ const [x,y]=ui.path[i]; g.fillRect(x*T+6,y*T+6,4,4);
      if(i){ const [px,py]=ui.path[i-1]; g.fillRect(Math.min(px,x)*T+6,Math.min(py,y)*T+6,Math.abs(px-x)*T+4,Math.abs(py-y)*T+4); } }
    const [ex,ey]=ui.path[ui.path.length-1]; g.fillStyle=C.k; g.fillRect(ex*T+5,ey*T+5,6,6); g.fillStyle=C.y; g.fillRect(ex*T+6,ey*T+6,4,4);
  }
  // 점령 중 표시
  for(let y=0;y<map.H;y++) for(let x=0;x<map.W;x++){ const c=map.grid[y][x]; if(c.capId && c.cp<20){ g.fillStyle=C.k; g.fillRect(x*T,y*T,7,7); g.fillStyle=C.y; g.fillRect(x*T+1,y*T+1,5,5); g.fillStyle=C.k; g.fillRect(x*T+2,y*T+2,1,4); g.fillRect(x*T+3,y*T+2,2,2);} }
  // 유닛
  for(const u of s.units){
    if(u.carried) continue;
    let px=u.x*T, py=u.y*T;
    if(ui.anim && ui.anim.id===u.id){ const a=ui.anim, f=Math.min(1,(now-a.t0)/a.dur)*(a.path.length-1), i=Math.min(a.path.length-2,Math.floor(f)), r=f-i;
      if(a.path.length>1){ const [x0,y0]=a.path[Math.max(0,i)],[x1,y1]=a.path[Math.max(0,i)+1]; px=(x0+(x1-x0)*r)*T; py=(y0+(y1-y0)*r)*T; } }
    if(ui.hide===u.id) continue;
    const bob=(!u.done && u.owner===s.turn && !ui.anim && Math.floor(now/400)%2)?1:0;
    const spr=sprite(u.type,u.owner,u.done&&u.owner===s.turn);
    const air=UNITS[u.type].cls==='air'||['fighter','bomber','bcopter','tcopter'].includes(u.type);
    if(!u.dived){ g.fillStyle='rgba(15,20,10,.26)'; if(air) g.fillRect(Math.round(px)+4,Math.round(py)+14,8,2); else g.fillRect(Math.round(px)+2,Math.round(py)+13,12,2); }
    g.globalAlpha=u.dived?.55:1;
    g.drawImage(spr,Math.round(px),Math.round(py)-bob);
    g.globalAlpha=1;
    const hp=Math.ceil(u.hp/10);
    if(hp<10) digit(g,hp,Math.round(px)+12,Math.round(py)+10);
    const d=UNITS[u.type];
    if((d.fuel && u.fuel<=Math.max(10,(d.daily||0)*3)) || (d.ammo && u.ammo===0)){ if(Math.floor(now/500)%2){ g.fillStyle=C.k; g.fillRect(px+1,py+10,5,5); g.fillStyle=C.o; g.fillRect(px+2,py+11,3,3);} }
    if(u.cargo.length){ g.fillStyle=C.k; g.fillRect(px+1,py+1,5,5); g.fillStyle=C.w; g.fillRect(px+2,py+2,3,3); }
  }
  // 효과
  ui.fx=(ui.fx||[]).filter(f=>now-f.t0<f.dur);
  for(const f of ui.fx){ const p=(now-f.t0)/f.dur, X=f.x*T, Y=f.y*T;
    if(f.k==='boom'){ const r=2+p*9; g.fillStyle=p<.5?'#fff3c0':'#f08a2e'; g.fillRect(X+8-r,Y+8-r/1.4,r*2,r*1.4*2/1.4); g.fillStyle='#d8483a'; for(let i=0;i<6;i++){ const a=i*1.05+p, rr=r*1.2; g.fillRect(X+8+Math.cos(a)*rr-1,Y+8+Math.sin(a)*rr-1,2,2);} }
    else if(f.k==='hit'){ if(Math.floor(p*6)%2===0){ g.fillStyle='rgba(255,255,255,.7)'; g.fillRect(X,Y,T,T);} }
    else if(f.k==='num'){ g.font='bold 8px monospace'; g.textAlign='center'; const yy=Y+2-p*8; g.fillStyle=C.k; g.fillText(f.text,X+9,yy+1); g.fillStyle=f.col||'#fff'; g.fillText(f.text,X+8,yy); }
    else if(f.k==='power'){ g.fillStyle=`rgba(242,183,5,${.35*(1-p)})`; g.fillRect(0,0,map.W*T,map.H*T); }
  }
  // 커서
  if(ui.cursor && ui.showCursor!==false){ const [cx,cy]=ui.cursor, o=Math.floor(now/300)%2?0:1, X=cx*T, Y=cy*T;
    g.fillStyle=C.k; for(const [a,b] of [[-1-o,-1-o],[T-4+o,-1-o],[-1-o,T-4+o],[T-4+o,T-4+o]]){ g.fillRect(X+a,Y+b,5,5);} 
    g.fillStyle='#fff'; for(const [a,b,w,h] of [[-o,-o,4,1],[-o,-o,1,4],[T-4+o,-o,4,1],[T-1+o,-o,1,4],[-o,T-1+o,4,1],[-o,T-4+o,1,4],[T-4+o,T-1+o,4,1],[T-1+o,T-4+o,1,4]]) g.fillRect(X+a,Y+b,w,h);
  }
  g.restore();
}
const Render={T,PAD,draw,sprite,terrainLayer,PAL};
root.Render=Render;
})(typeof self!=='undefined'?self:this);
