/* 동현전 그림: 16px 칸의 도트 지형과 유닛. 모든 그림은 이 파일의 코드로 새로 그린다. */
(function(root){
const T=16, PAD=4; // PAD: 맨 윗줄 산·건물 꼭대기가 잘리지 않게 둔 위 여백
const PAL={
  1:{m:'#e5483a',d:'#9a2620',l:'#ff9f86'},
  2:{m:'#3a78e8',d:'#1f3f99',l:'#97c0ff'},
  0:{m:'#b9b1a2',d:'#7a7266',l:'#e2dccf'}
};
const C={k:'#231d18',p:'#f59a9a',g:'#9a978c',G:'#5d5b53',w:'#f6f2e8',s:'#f1c493',y:'#f2b705',b:'#2c2722',o:'#e08a2e'};

/* 유닛 도트(오른쪽을 본다). m 진영색 · d 진영 어두운색 · l 진영 밝은색 · k 윤곽 · g/G 금속 · w 흰색 · s 피부 · y 노랑 */
const SPR={
inf:[
'................',
'.....kkkkk......',
'....kmmlllk.....',
'...kmmmmmmmk....',
'...kddddddddk...',
'...ksssssssk....',
'...ksskssksk....',
'...kpssssspk....',
'....kkssskk.....',
'...kmmmmmmkkkkk.',
'..kmlmmmmmggggGk',
'..kmmmmmmmkkkkk.',
'...kddddddk.....',
'...kddkkddk.....',
'..kkkk..kkkk....',
'................'],
mech:[
'..........kkkk..',
'.....kkkkkgGgGk.',
'....kdddkgGgGk..',
'...kddyddkkkk...',
'...kddddddddk...',
'...ksssssssk....',
'...ksskssksk....',
'...kpssssspk....',
'....kkssskk.....',
'..kkmmmmmmmk....',
'.kmlmmmmmmmmk...',
'.kmmmmmmmmmmk...',
'..kddddddddk....',
'..kddkkkddk.....',
'.kkkkk.kkkkk....',
'................'],
recon:[
'................',
'................',
'................',
'......kkkkk.....',
'.....kwwwwlk....',
'....kmlwwwlmkk..',
'..kkmmmmmmmmmmk.',
'.kmllllllllllmyk',
'.kmmmmmmmmmmmmmk',
'.kddddddddddddk.',
'.kkGGkkkkkkGGkk.',
'.kGggGk..kGggGk.',
'.kGggGk..kGggGk.',
'..kGGk....kGGk..',
'...kk......kk...',
'................'],
tank:[
'................',
'................',
'................',
'......kkkkk.....',
'.....kmllmmk....',
'....kmlmmmmkkkkk',
'....kmmmmmmggggk',
'...kkmmmmmmkkkkk',
'..kmmmmmmmmmmmk.',
'.kmllllllllllmmk',
'.kddddddddddddyk',
'.kkkkkkkkkkkkkk.',
'.kGgGgGgGgGgGgGk',
'.kgGgGgGgGgGgGgk',
'..kkkkkkkkkkkkk.',
'................'],
md:[
'................',
'................',
'.....kkkkkkk....',
'....kmllmmmmk...',
'...kmlmmmmmmkkkk',
'...kmmmmmmmmgggk',
'...kddddddddkkkk',
'.kkkkkkkkkkkkkk.',
'kmllllllllllllmk',
'kmmmmmmmmmmmmmyk',
'kddddddddddddddk',
'kkkkkkkkkkkkkkkk',
'kGgGgGgGgGgGgGgk',
'kgGgGgGgGgGgGgGk',
'.kkkkkkkkkkkkkk.',
'................'],
neo:[
'................',
'................',
'................',
'.....kkkkkk.....',
'....kllllllkkkkk',
'...kmmmmmmmmyyyk',
'...kddddddddkkkk',
'.kkkkkkkkkkkkkk.',
'kmllllllllllllmk',
'kmyyyyyyyyyyyymk',
'kddddddddddddddk',
'.kkkkkkkkkkkkkk.',
'.kGgGgGgGgGgGgk.',
'.kgGgGgGgGgGgGk.',
'..kkkkkkkkkkkk..',
'................'],
apc:[
'................',
'................',
'................',
'..kkkkkkkkk.....',
'.kllllllllkkkk..',
'.kmmmwmmmmkwwlk.',
'.kmmwwwmmmkwwmk.',
'.kmmmwmmmmkmmmk.',
'.kmmmmmmmmmmmmyk',
'.kddddddddddddk.',
'.kkkkkkkkkkkkkk.',
'.kGgGgGgGgGgGgk.',
'.kgGgGgGgGgGgGk.',
'..kkkkkkkkkkkk..',
'................',
'................'],
art:[
'................',
'................',
'.............kk.',
'............kgGk',
'...........kgGk.',
'.....kkkkkkgGk..',
'....kmllmmkGk...',
'....kmmmmmmkk...',
'..kkkkkkkkkkkk..',
'.kmllllllllllmk.',
'.kddddddddddddk.',
'.kkkkkkkkkkkkkk.',
'.kGgGgGgGgGgGgk.',
'.kgGgGgGgGgGgGk.',
'..kkkkkkkkkkkk..',
'................'],
rocket:[
'................',
'................',
'.....kkkkkkkk...',
'....kwywywywyk..',
'...kGgGgGgGgk...',
'..kkkkkkkkkkkkk.',
'..kmllllllkwwlk.',
'..kmmmmmmmkwwmk.',
'..kmmmmmmmkmmmyk',
'..kddddddddddddk',
'..kkkkkkkkkkkkkk',
'..kGGk....kGGk..',
'.kGggGk..kGggGk.',
'.kGggGk..kGggGk.',
'..kGGk....kGGk..',
'................'],
aa:[
'................',
'................',
'.......kk..kk...',
'......kgk.kgk...',
'.....kgk.kgk....',
'....kgkkkgk.....',
'...kmllllmk.....',
'...kmmmmmmk.....',
'.kkkkkkkkkkkkk..',
'.kmllllllllllmk.',
'.kddddddddddddyk',
'.kkkkkkkkkkkkkk.',
'.kGgGgGgGgGgGgk.',
'.kgGgGgGgGgGgGk.',
'..kkkkkkkkkkkk..',
'................'],
missile:[
'................',
'.........kk.kk..',
'........kwk.kwk.',
'........kyk.kyk.',
'........kwk.kwk.',
'.......kkkkkkkk.',
'......kGgggggGk.',
'..kkkkkkkkkkkk..',
'..kmllllllkwwlk.',
'..kmmmmmmmkwwmk.',
'..kmmmmmmmkmmmyk',
'..kddddddddddddk',
'..kkkkkkkkkkkkkk',
'..kGGk....kGGk..',
'.kGggGk..kGggGk.',
'..kGGk....kGGk..'],
fighter:[
'................',
'................',
'................',
'..kk............',
'..kmk...........',
'..kmmk..........',
'..kmmmkkkkkkk...',
'.kmmmmmmmmwwlkk.',
'kGmllllllllwwmmk',
'.kddddddddddddk.',
'..kkkmmmmkkkk...',
'....kmmmk.......',
'....kmmk........',
'....kkk.........',
'................',
'................'],
bomber:[
'................',
'................',
'................',
'.kk.............',
'.kmk....kkkkk...',
'.kmmkkkkmmmmmk..',
'kkmmmmmmmmmwwlkk',
'kmllllllllllwwmk',
'kddddddddddddddk',
'.kkkkkdmmmdkkkk.',
'.....kdmmmdk....',
'.....kdmmmdk....',
'......kkkkk.....',
'................',
'................',
'................'],
bcopter:[
'................',
'................',
'.kkkkkkkkkkkkkk.',
'.......kk.......',
'....kkkkkkkk....',
'...kmmmmmmwwk...',
'kk.kmllllmwwlk..',
'kmkmmmmmmmmmmmk.',
'kmmmmmmmmmmmmmk.',
'.kkkkddddddddk..',
'.....kGgGgGkk...',
'....kkkkkkkkkk..',
'................',
'................',
'................',
'................'],
tcopter:[
'................',
'kkkkkkk..kkkkkkk',
'...kk......kk...',
'..kkkkkkkkkkkk..',
'.kmllllllllmwwk.',
'kmmmmmmmmmmmwwlk',
'kmwwmwwmwwmmmmmk',
'kmmmmmmmmmmmmmmk',
'kddddddddddddddk',
'.kkkkkkkkkkkkkk.',
'...kk......kk...',
'..kkkk....kkkk..',
'................',
'................',
'................',
'................'],
bship:[
'................',
'................',
'................',
'................',
'.......kkk......',
'......kllmk.....',
'...kkkkmmmkkkk..',
'..kGGGkmmmkGGGk.',
'..kkkkkkkkkkkkk.',
'.kmllllllllllllk',
'kmmwmmwmmwmmwmmk',
'kddddddddddddddk',
'.kddddddddddddk.',
'..kkkkkkkkkkkk..',
'................',
'................'],
cruiser:[
'................',
'................',
'................',
'................',
'........kk......',
'.......kgk......',
'....kkkkgkkkk...',
'...kmllllllmk...',
'..kkkkkkkkkkkkk.',
'.kmllllllllllllk',
'kmmwmmwmmwmmwmmk',
'kddddddddddddddk',
'.kkkkkkkkkkkkkk.',
'................',
'................',
'................'],
lander:[
'................',
'................',
'................',
'................',
'..........kkk...',
'.........kwwlk..',
'.kkkkkkkkkmmmk..',
'kmllllllllmmmmk.',
'kmGgGgGgGgGmmmmk',
'kddddddddddddddk',
'.kddddddddddddk.',
'..kkkkkkkkkkkk..',
'................',
'................',
'................',
'................'],
sub:[
'................',
'................',
'................',
'................',
'.......kk.......',
'......kgk.......',
'.....kllmk......',
'....kmmmmmk.....',
'..kkmmmmmmmkkk..',
'.kmllllllllllmk.',
'kmmwmmwmmwmmmmmk',
'.kddddddddddddk.',
'..kkkkkkkkkkkk..',
'................',
'................',
'................']
};
const DIG={0:['111','101','101','101','111'],1:['010','110','010','010','111'],2:['111','001','111','100','111'],3:['111','001','111','001','111'],4:['101','101','111','001','001'],5:['111','100','111','001','111'],6:['111','100','111','101','111'],7:['111','001','010','010','010'],8:['111','101','111','101','111'],9:['111','101','111','001','111']};

function mk(w,h){ const c=document.createElement('canvas'); c.width=w; c.height=h; return c; }
const cache={};
function sprite(type,owner,gray){
  const k=type+owner+(gray?'g':'');
  if(cache[k]) return cache[k];
  const c=mk(T,T), x=c.getContext('2d'), P=PAL[owner], rows=shade(SPR[type]);
  for(let y=0;y<T;y++){ const r=(rows[y]||'').padEnd(T,'.').slice(0,T);
    for(let i=0;i<T;i++){ const ch=r[i]; if(ch==='.') continue;
      let col=P[ch]||C[ch]; if(!col) continue;
      if(gray) col=grayify(col);
      const px=owner===2?T-1-i:i; x.fillStyle=col; x.fillRect(px,y,1,1); } }
  return cache[k]=c;
}
/* 자동 음영: 진영색(m) 칸 중 바로 위가 윤곽·빈칸이면 밝게(l), 바로 아래가 윤곽이면 어둡게(d).
   금속(g)은 위쪽을 흰빛(w)으로 살짝 띄운다. 도트 원본은 그대로 두고 그릴 때만 바꾼다. */
const shadeCache=new Map();
function shade(rows){
  if(shadeCache.has(rows)) return shadeCache.get(rows);
  const R=rows.map(r=>r.padEnd(T,'.').slice(0,T).split('')), out=R.map(r=>r.slice());
  const at=(x,y)=>(y<0||y>=R.length)?'.':R[y][x];
  for(let y=0;y<R.length;y++) for(let x=0;x<T;x++){ const ch=R[y][x];
    if(ch==='m'){ const up=at(x,y-1), dn=at(x,y+1);
      if((up==='k'||up==='.') && at(x-1,y)!=='.' ) out[y][x]='l';
      else if(dn==='k' && at(x,y+2)!=='m') out[y][x]='d'; }
    else if(ch==='g'){ const up=at(x,y-1); if(up==='k'||up==='.') out[y][x]='w'; } }
  const res=out.map(r=>r.join('')); shadeCache.set(rows,res); return res;
}
function grayify(hex){
  const n=parseInt(hex.slice(1),16), r=n>>16&255,g=n>>8&255,b=n&255, v=Math.round((r*.3+g*.55+b*.15)*.72+30);
  return `rgb(${v},${v},${v-6})`;
}
function hash(x,y,s=0){ let h=(x*374761393+y*668265263+s*982451653)>>>0; h=(h^(h>>>13))*1274126177>>>0; return (h^(h>>>16))>>>0; }

/* ---- 지형 ---- */
const TC={grass:'#8fc85b',grassB:'#96cd63',grass2:'#7ab349',grass3:'#a6d872',tree:'#3f8a3a',tree2:'#2d6b2c',trunk:'#6b4a2c',
  rock:'#a08467',rock2:'#7a604a',snow:'#f4efe4',water:'#4c8fd9',water2:'#3b78c4',wave:'#9cc6f2',sand:'#e9d79a',sand2:'#cdb876',
  road:'#d3c7a6',road2:'#a39578',road3:'#e3d9bc',plank:'#b8854f',plank2:'#7d5530',plank3:'#d9a66a',foam:'#e8f4ff',deep:'#4384d0',bank:'#6f9c3e',river:'#5aa0e6',river2:'#3f86d2'};
const isWater=t=>t==='sea'||t==='reef'||t==='river'||t==='shoal'||t==='bridge';
const seaLike=t=>t==='sea'||t==='reef';
function drawTerrain(g,map,x,y){
  const cell=map.grid[y][x], t=cell.t, X=x*T, Y=y*T;
  const at=(dx,dy)=>{ const yy=y+dy,xx=x+dx; if(yy<0||xx<0||yy>=map.H||xx>=map.W) return null; return map.grid[yy][xx].t; };
  const R=(a,b,w,h,c)=>{ g.fillStyle=c; g.fillRect(X+a,Y+b,w,h); };
  const grass=()=>{ R(0,0,T,T,(x+y)%2?TC.grass:TC.grassB); for(let i=0;i<3;i++){ const h=hash(x,y,i); R(h%14+1,(h>>>4)%14+1,1,1,TC.grass2); R((h>>>8)%14+1,(h>>>12)%14+1,1,1,TC.grass3);} };
  const sea=()=>{ R(0,0,T,T,TC.water); for(let i=0;i<T;i+=4) for(let j=(i/4)%2*2;j<T;j+=4) R(j,i,1,1,TC.deep);
    const h=hash(x,y,7); R(h%10+2,(h>>>5)%10+3,3,1,TC.wave); R((h>>>9)%10+2,(h>>>13)%10+3,2,1,TC.water2);
    // 땅과 맞닿은 쪽에 모래 가장자리와 흰 물결
    const land=(dx,dy)=>{ const n=at(dx,dy); return n && !isWater(n); };
    const U=land(0,-1),Dn=land(0,1),L=land(-1,0),Rt=land(1,0);
    if(U){ R(0,0,T,2,TC.sand); R(0,2,T,1,TC.foam); } if(Dn){ R(0,T-2,T,2,TC.sand); R(0,T-3,T,1,TC.foam); }
    if(L){ R(0,0,2,T,TC.sand); R(2,U?3:0,1,T-(U?3:0)-(Dn?3:0),TC.foam); } if(Rt){ R(T-2,0,2,T,TC.sand); R(T-3,U?3:0,1,T-(U?3:0)-(Dn?3:0),TC.foam); }
    if(!U&&!L&&land(-1,-1)){ R(0,0,2,2,TC.sand); R(2,0,1,2,TC.foam); R(0,2,3,1,TC.foam); }
    if(!U&&!Rt&&land(1,-1)){ R(T-2,0,2,2,TC.sand); R(T-3,0,1,2,TC.foam); R(T-3,2,3,1,TC.foam); }
    if(!Dn&&!L&&land(-1,1)){ R(0,T-2,2,2,TC.sand); R(2,T-2,1,2,TC.foam); R(0,T-3,3,1,TC.foam); }
    if(!Dn&&!Rt&&land(1,1)){ R(T-2,T-2,2,2,TC.sand); R(T-3,T-2,1,2,TC.foam); R(T-3,T-3,3,1,TC.foam); } };
  if(t==='plain'){ grass(); const h=hash(x,y,11); if(h%3===0){ const fx=2+h%11, fy=3+(h>>>5)%10; R(fx,fy,1,1,'#fff7e0'); R(fx+1,fy+1,1,1,(h>>>9)%2?'#ffd34d':'#ffb3c7'); } }
  else if(t==='forest'){ grass(); const pp=propPal(0); R(1,13,14,2,'rgba(20,30,10,.22)'); for(const [a,b] of [[5,-3],[1,3],[8,4]]) stamp(g,PROP.tree,X+a,Y+b,pp); }
  else if(t==='mountain'){ grass(); stamp(g,PROP.mountain,X,Y-4,propPal(0)); }
  else if(t==='road'||t==='bridge'||t==='river'){
    if(t==='road') grass(); else { grass(); }
    const conn=n=>{ if(!n) return false; if(t==='river') return n==='river'||n==='bridge'||seaLike(n)||n==='shoal';
      return n==='road'||n==='bridge'||['city','factory','airport','port','hq'].includes(n); };
    const col=t==='road'?TC.road:TC.water, edge=t==='road'?TC.road2:TC.water2;
    const up=conn(at(0,-1)),dn=conn(at(0,1)),lf=conn(at(-1,0)),rt=conn(at(1,0));
    const any=up||dn||lf||rt;
    if(t==='bridge'){
      const pass=n=>n&&!(seaLike(n)||n==='river'||n==='shoal'||n==='port');
      const hz=pass(at(-1,0))||pass(at(1,0)), vt=pass(at(0,-1))||pass(at(0,1));
      const under=[at(0,-1),at(0,1),at(-1,0),at(1,0)].some(n=>n&&seaLike(n));
      if(under) sea(); else { R(0,0,T,T,TC.river); R(2,6,3,1,TC.wave); R(10,10,3,1,TC.wave); }
      if(vt&&!hz){ R(2,0,12,T,'rgba(20,40,70,.25)'); R(3,0,10,T,TC.plank); for(let i=1;i<T;i+=3) R(3,i,10,1,TC.plank2); R(4,0,1,T,TC.plank3);
        R(2,0,1,T,C.k); R(13,0,1,T,C.k); R(1,2,1,3,TC.plank2); R(14,2,1,3,TC.plank2); R(1,10,1,3,TC.plank2); R(14,10,1,3,TC.plank2); }
      else { R(0,4,T,10,'rgba(20,40,70,.25)'); R(0,3,T,10,TC.plank); for(let i=1;i<T;i+=3) R(i,3,1,10,TC.plank2); R(0,4,T,1,TC.plank3);
        R(0,2,T,1,C.k); R(0,13,T,1,C.k); R(2,1,3,1,TC.plank2); R(10,1,3,1,TC.plank2); R(2,14,3,1,TC.plank2); R(10,14,3,1,TC.plank2); }
    } else if(t==='road'){
      // 도로는 칸을 채우고, 이어지지 않은 쪽에만 풀밭 가장자리를 남긴다
      R(0,0,T,T,col);
      if(!up){ R(0,0,T,3,TC.grass); R(0,3,T,1,edge); }
      if(!dn){ R(0,T-3,T,3,TC.grass); R(0,T-4,T,1,edge); }
      if(!lf){ R(0,0,3,T,TC.grass); R(3,up?0:3,1,T-(up?0:3)-(dn?0:3),edge); }
      if(!rt){ R(T-3,0,3,T,TC.grass); R(T-4,up?0:3,1,T-(up?0:3)-(dn?0:3),edge); }
      if(!up&&!lf) R(0,0,4,4,TC.grass); if(!up&&!rt) R(T-4,0,4,4,TC.grass); if(!dn&&!lf) R(0,T-4,4,4,TC.grass); if(!dn&&!rt) R(T-4,T-4,4,4,TC.grass);
      if(!up&&!lf) R(3,3,1,1,edge); if(!up&&!rt) R(T-4,3,1,1,edge); if(!dn&&!lf) R(3,T-4,1,1,edge); if(!dn&&!rt) R(T-4,T-4,1,1,edge);
      // 가운데 밝은 바퀴 자국
      if(lf||rt){ const a=lf?0:7,b=rt?T:8; R(a,7,b-a,1,TC.road3); }
      if(up||dn){ const a=up?0:7,b=dn?T:8; R(7,a,1,b-a,TC.road3); }
      const h=hash(x,y,9); R(4+h%8,4+(h>>>4)%8,1,1,edge); R(4+(h>>>8)%8,4+(h>>>12)%8,1,1,TC.road3);
    } else {
      // 강: 칸을 물로 채우고, 물이 이어지지 않는 쪽에 풀 둑을 남긴다
      R(0,0,T,T,TC.river);
      const B=3;
      if(!up){ R(0,0,T,B,TC.grass); R(0,B,T,1,TC.bank); }
      if(!dn){ R(0,T-B,T,B,TC.grass); R(0,T-B-1,T,1,TC.bank); }
      if(!lf){ R(0,0,B,T,TC.grass); R(B,up?0:B,1,T-(up?0:B)-(dn?0:B),TC.bank); }
      if(!rt){ R(T-B,0,B,T,TC.grass); R(T-B-1,up?0:B,1,T-(up?0:B)-(dn?0:B),TC.bank); }
      if(!up&&!lf) R(0,0,B+1,B+1,TC.grass); if(!up&&!rt) R(T-B-1,0,B+1,B+1,TC.grass); if(!dn&&!lf) R(0,T-B-1,B+1,B+1,TC.grass); if(!dn&&!rt) R(T-B-1,T-B-1,B+1,B+1,TC.grass);
      const h=hash(x,y,3); R(5+(h%4),5+(h>>>3)%3,3,1,TC.wave); R(4+(h>>>6)%5,9+(h>>>9)%2,2,1,TC.river2);
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
  // 물결 반짝임(지형층 위에 가볍게)
  if(ui.seaKey!==ui.terrainKey){ ui.seaTiles=[]; for(let y=0;y<map.H;y++) for(let x=0;x<map.W;x++){ const t=map.grid[y][x].t; if(t==='sea'||t==='river') ui.seaTiles.push([x,y,t]); } ui.seaKey=ui.terrainKey; }
  { const ph=Math.floor(now/650); g.fillStyle='rgba(235,246,255,.85)';
    for(const [x,y,t] of ui.seaTiles){ const h=hash(x,y,ph&7); if(h%4) continue; const k=t==='river'?6:10; g.fillRect(x*T+3+(h>>>3)%k,y*T+3+(h>>>7)%k,2,1); } }
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
    if(!u.dived){ const rx=Math.round(px), ry=Math.round(py), tc=u.owner===1?'rgba(229,72,58,.55)':'rgba(58,120,232,.55)';
      g.fillStyle='rgba(15,20,10,.25)'; if(air){ g.fillRect(rx+5,ry+15,6,1); } else { g.fillRect(rx+3,ry+15,10,1); }
      g.fillStyle=tc; if(air){ g.fillRect(rx+4,ry+14,8,1); } else { g.fillRect(rx+2,ry+14,12,1); g.fillRect(rx+3,ry+13,10,1); } }
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
