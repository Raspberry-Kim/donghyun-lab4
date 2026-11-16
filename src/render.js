/* 동현전 그림: 16px 칸의 도트 지형과 유닛. 모든 그림은 이 파일의 코드로 새로 그린다. */
(function(root){
const T=16, PAD=4; // PAD: 맨 윗줄 산·건물 꼭대기가 잘리지 않게 둔 위 여백
const PAL={
  1:{m:'#ce5146',d:'#823738',l:'#f49b7c'},
  2:{m:'#467fc0',d:'#294d7b',l:'#9dc8e8'},
  0:{m:'#a6aaa3',d:'#626f70',l:'#d8ddd3'}
};
const C={k:'#23313c',p:'#dca18b',g:'#99aab2',G:'#52636f',w:'#f5f3dc',s:'#e7bf98',y:'#efc45e',b:'#29343c',o:'#d89152',c:'#86e1df',n:'#e391b4',B:'#384957',v:'#8bbecf',V:'#40677a'};

/* 유닛 도트(오른쪽을 본다). m 진영색 · d 진영 어두운색 · l 진영 밝은색 · k 윤곽 · g/G 금속 · w 흰색 · s 피부 · y 노랑 · c 네온 청록 · n 네온 분홍 · B 장갑판 */
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
'.....kkkk.......',
'....kgGGgk......',
'..kkkkkkkkkk....',
'.kmmmmmmmmmmkkkk',
'.kmmmmmmmmmmgggk',
'.kddddddddddkkkk',
'kkkkkkkkkkkkkkk.',
'kmmmmmmmmmmmmmyk',
'kddddddddddddddk',
'kkkkkkkkkkkkkkkk',
'kGGgGGGgGGGgGGGk',
'kGgGgGgGgGgGgGGk',
'kGGgGGGgGGGgGGGk',
'.kkkkkkkkkkkkkk.'],
md:[
'...........k....',
'..........knk...',
'...kkkkkkkkkk...',
'..kmmmmmmmmmmkkk',
'..kmcccmmmmmmgGk',
'..kmmmmmmmmmmkkk',
'..kddddddddddgGk',
'kkkkkkkkkkkkkkkk',
'kmmmmmmmmmmmmmmk',
'kmBBmmmnnmmmBBmk',
'kmmmmmmmmmmmmmck',
'kddccccccccccddk',
'kkkkkkkkkkkkkkkk',
'kGgGgGgGgGgGgGgk',
'kgGgGgGgGgGgGgGk',
'kkkkkkkkkkkkkkkk'],
neo:[
'...kkkkkkk......',
'..kmmmmmmmkk....',
'.kmmmmmmmmmmk...',
'kmmmmmmmmmmmmk..',
'kmmmmmmmkwwkmkkk',
'kmmmmmmmkwkkmgGk',
'kmmmmmmmmmmmmgGk',
'kddmmmmmmmmmkkkk',
'.kddddddddddk...',
'kmmkmmmkmmmkmmk.',
'kmmkmmmkmmmkmmk.',
'kgGkgGgkgGgkgGk.',
'kmmkmmmkmmmkmmmk',
'kmmmkmmmkkmmmkmk',
'kGGGkGGGk.kGGGGk',
'.kkk.kkk...kkkk.'],
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
stealth:[
'................',
'................',
'................',
'................',
'.kk.............',
'.kBkk...........',
'..kBBkkk........',
'..kBmmmBBkkk....',
'.kBBmmmmmBBcwkk.',
'kBBBBBBBBBBBBBBk',
'.kkkdddddddkkkk.',
'...kBBmmk.......',
'...kBBk.........',
'...kkk..........',
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
'...k............',
'..kGk...........',
'.kgggk.kkk......',
'.kGwGk.kGGkkkkkk',
'kkgggkkGGGgggggg',
'gkGGGkkGGGgggggg',
'kkkkkkkkkkkkkkkk',
'kmmmmmmmmmmmmmmk',
'kmwmmwmmwmmmmmk.',
'.kddddddddddddk.',
'..kkkkkkkkkkkk..',
'................',
'................'],
cruiser:[
'................',
'................',
'................',
'................',
'.............k..',
'......k.....kGk.',
'.....kGk...kGk..',
'....kgggk.kGk...',
'....kGwGkkGGk...',
'..kkkgggkkggkkk.',
'.kmmmmmmmmmmmmmk',
'..kddddddddddk..',
'...kkkkkkkkkk...',
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
carrier:[
'................',
'................',
'................',
'................',
'...........kkk..',
'..........kGGGk.',
'..........kGwGk.',
'kkkkkkkkkkkGGGkk',
'kGwGGGwGGGwGGGGk',
'kkkkkkkkkkkkkkkk',
'kmmmmmmmmmmmmmmk',
'.kmwmmwmmwmmmmk.',
'..kddddddddddk..',
'...kkkkkkkkkk...',
'................',
'................'],
bboat:[
'................',
'................',
'................',
'................',
'....k...........',
'....k...kkkk....',
'...kyk.kwwvlk...',
'....k..kmmmmk...',
'.kkkkkkkkkkkkkk.',
'kbBbBbBbBbBbBbBk',
'kmmmmmmmmmmmmmk.',
'.kbbbbbbbbbbbk..',
'..kkkkkkkkkkk...',
'................',
'................',
'................'],
sub:[
'................',
'................',
'................',
'................',
'................',
'.........k......',
'.........k......',
'.......kkkkk....',
'.......kmmmk....',
'.......kdddk....',
'.k..kkkkdddkkkk.',
'kdkkdddddddddddk',
'kddddddddddddddk',
'kdkkddddddddddk.',
'.k..kkkkkkkkkkk.',
'................']
};
const DIG={0:['111','101','101','101','111'],1:['010','110','010','010','111'],2:['111','001','111','100','111'],3:['111','001','111','001','111'],4:['101','101','111','001','001'],5:['111','100','111','001','111'],6:['111','100','111','101','111'],7:['111','001','010','010','010'],8:['111','101','111','101','111'],9:['111','101','111','001','111']};

function mk(w,h){ const c=document.createElement('canvas'); c.width=w; c.height=h; return c; }
const cache={};
function sprite(type,owner,gray){
  const k=type+owner+(gray?'g':'');
  if(cache[k]) return cache[k];
  const c=mk(T,T), x=c.getContext('2d'), P=PAL[owner], rows=shade(detailPixels(type));
  for(let y=0;y<T;y++){ const r=(rows[y]||'').padEnd(T,'.').slice(0,T);
    for(let i=0;i<T;i++){ const ch=r[i]; if(ch==='.') continue;
      let col=P[ch]||C[ch]; if(!col) continue;
      if(gray) col=grayify(col);
      const px=owner===2?T-1-i:i; x.fillStyle=col; x.fillRect(px,y,1,1); } }
  return cache[k]=c;
}
// 기존 병종의 외곽은 보존하고 유리·장갑 이음·차륜을 구분한다.
const detailCache={};
function detailPixels(type){
  if(detailCache[type]) return detailCache[type];
  const rows=SPR[type].map(r=>r.padEnd(T,'.').slice(0,T).split(''));
  const set=(x,y,ch)=>{ if(rows[y][x]!=='.') rows[y][x]=ch; };
  if(['recon','apc','rocket','missile','fighter','bomber','bcopter','tcopter'].includes(type)){
    rows.forEach((row,y)=>row.forEach((ch,x)=>{ if(ch==='w' && y<9) row[x]=x%3===0?'V':'v'; }));
  }
  if(['tank','md','neo','apc','art','aa'].includes(type)){
    // 장갑판 위의 짧은 밝은 모서리와 낮은 차체의 어두운 이음.
    const y={tank:9,md:8,neo:3,apc:8,art:9,aa:9}[type];
    for(let x=3;x<7;x++) if(rows[y][x]==='m') set(x,y,'l');
    if(type==='tank'){ set(5,5,'l');set(6,5,'l');set(4,6,'d');set(9,6,'d'); }
    if(type==='neo'){ set(3,5,'l');set(4,5,'l');set(9,3,'B');set(9,4,'B'); }
  }
  if(['inf','mech'].includes(type)){
    set(4,9,'G');set(4,10,'g');set(4,11,'G');set(7,11,'d');set(8,11,'d');
  }
  if(['bship','cruiser','carrier','lander'].includes(type)){
    // 함정의 갑판은 냉회색, 현측은 진영색. 밝은 수선으로 바다와 분리.
    const y={bship:12,cruiser:11,carrier:12,lander:10}[type];
    for(let x=4;x<11;x++) if(rows[y][x]==='d') set(x,y,'l');
  }
  return detailCache[type]=rows.map(r=>r.join(''));
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
/* 기본 색. 지도마다 색조(theme)를 덧입힌다: 원작의 날씨 화면처럼 타일 모양은 두고 색만 바꾼다. */
const TC0={grass:'#a6b98b',grassB:'#acbe91',grass2:'#91a879',grass3:'#bed0a5',tree:'#567c61',tree2:'#355947',trunk:'#77644c',
  rock:'#9ba29b',rock2:'#707e7d',snow:'#eeeede',water:'#548f9f',water2:'#3b7389',wave:'#a9c9ce',sand:'#ddd3ad',sand2:'#b8ac86',
  road:'#a3aba7',road2:'#798b85',road3:'#e4e2cc',plank:'#a3ada9',plank2:'#61777c',plank3:'#d1d8cb',foam:'#dfebe3',deep:'#437c90',bank:'#6b8973',river:'#6ba4ae',river2:'#4d8596',
  fl:['#fff7e0','#ffd34d','#ffb3c7'],flRate:3,treeTop:null,sparkle:'rgba(235,246,255,.85)'};
const THEMES={
  coast:{grass:'#b1bd94',grassB:'#b6c29a',tree:'#4e8270',tree2:'#315e52',water:'#4d91a3',water2:'#316f87',deep:'#3b7d94',sand:'#e4d6b0',wave:'#b4d5d4',foam:'#edf0d9'},
  highland:{grass:'#a1b29f',grassB:'#a7b8a5',grass2:'#8b9f90',grass3:'#c0cdb6',tree:'#527766',tree2:'#35554d',rock:'#a9b1ab',rock2:'#77888b',road:'#a6ada8'},
  harvest:{grass:'#c2bd8c',grassB:'#c7c294',grass2:'#a9a679',grass3:'#d8d0a5',tree:'#8b8b59',tree2:'#58664b',rock:'#a69c85',rock2:'#807b6d'},
  // 눈 덮인 고원: 포근한 흰 눈, 눈 얹은 나무, 잿빛 바위
  snow:{grass:'#f2f3ef',grassB:'#ecedea',grass2:'#d9dcd8',grass3:'#ffffff',tree:'#5d8c78',tree2:'#3f6a58',trunk:'#5a4634',treeTop:'#f7fbff',
    rock:'#9aa3ad',rock2:'#6b7480',water:'#a4cde8',water2:'#86b6da',wave:'#eaf6fd',deep:'#97c3e3',foam:'#ffffff',sand:'#e9e6dd',sand2:'#cfcbc0',bank:'#c9d6e2',
    river:'#a9d0ea',river2:'#86b6da',road:'#d8dde1',road2:'#a6adb4',road3:'#eef1f3',plank:'#a98a68',plank2:'#755a40',plank3:'#cdb08a',fl:['#ffffff','#e6e9ec','#d4d9de'],flRate:2},
  // 얼음 들판: 푸른 기가 도는 언 땅, 서리 낀 나무, 얼어붙은 물
  ice:{grass:'#dfeaf3',grassB:'#d7e4ef',grass2:'#bfd3e3',grass3:'#f6fbff',tree:'#4f8a86',tree2:'#356a66',trunk:'#4e4a3e',treeTop:'#eef8ff',
    rock:'#8c9db0',rock2:'#5e6f84',water:'#b9dcef',water2:'#9cc8e4',wave:'#ffffff',deep:'#add4ec',foam:'#ffffff',sand:'#dfe3e4',sand2:'#c3cacd',bank:'#b5cadb',
    river:'#bcdcee',river2:'#9cc8e4',road:'#ccd6dd',road2:'#9aa8b3',road3:'#e4ebf0',plank:'#a08466',plank2:'#6e553d',plank3:'#c6a986',fl:['#ffffff','#cfe4f3','#b6d4ea'],flRate:2,sparkle:'rgba(255,255,255,.95)'},
  // 검은 하늘: 어두운 들과 검은 물. 건물·유닛은 그대로 밝아 불 켠 듯 보인다
  night:{grass:'#46693f',grassB:'#4b6f44',grass2:'#385634',grass3:'#587e4f',tree:'#254f2a',tree2:'#18371c',trunk:'#3a281a',
    rock:'#625648',rock2:'#41382e',water:'#1c3152',water2:'#162844',wave:'#4a6a95',deep:'#1a2e4e',foam:'#8ea4c4',sand:'#9a9270',sand2:'#7e7659',bank:'#34522f',
    river:'#1f3a60',river2:'#162c4c',road:'#948d76',road2:'#6b6452',road3:'#a39c85',fl:['#b9b99a','#a89850','#a07a8c'],flRate:5,sparkle:'rgba(190,210,250,.6)'},
  // 푸른 달: 달빛에 식은 풀과 깊은 쪽빛 바다
  bluemoon:{grass:'#58907e',grassB:'#5e9684',grass2:'#477a68',grass3:'#74aa95',tree:'#2b6652',tree2:'#1c473a',trunk:'#463827',
    rock:'#75828a',rock2:'#4d5862',water:'#1f45a0',water2:'#19378a',wave:'#8fb0ff',deep:'#1d4098',foam:'#cfdcff',sand:'#c6c8b6',sand2:'#a6a894',bank:'#437064',
    river:'#244fb0',river2:'#19378a',road:'#aeb0a1',road2:'#808273',road3:'#c1c3b6',fl:['#eef4ff','#b9d0ff','#d3c0ff'],flRate:4,sparkle:'rgba(215,230,255,.95)'},
  // 달빛 항구: 은빛 달 아래 잿빛 풀과 짙은 남빛 바다
  moonlight:{grass:'#73937a',grassB:'#7a9980',grass2:'#618368',grass3:'#8ead94',tree:'#38664c',tree2:'#264836',trunk:'#4a3b2d',
    rock:'#83857f',rock2:'#595c56',water:'#2c4c86',water2:'#243f72',wave:'#a7bce6',deep:'#29477f',foam:'#dbe4f7',sand:'#d1cfc0',sand2:'#b1afa0',bank:'#587660',
    road:'#bbb8a9',road2:'#898678',road3:'#cecbbe',river:'#355a98',river2:'#243f72',fl:['#f4f6ff','#d6dcf0','#c8d4ea'],flRate:4,sparkle:'rgba(240,245,255,.95)'},
  // 들꽃: 봄빛 풀밭과 평지마다 피는 여러 색 들꽃
  meadow:{grass:'#9ad364',grassB:'#a2d96c',grass2:'#84bf52',grass3:'#b7e283',fl:['#fff7e0','#ffd34d','#ff9fc0','#c79bff','#ffffff','#ff8a65'],flRate:1}
};
let TC=TC0;
function setTheme(name){ TC=name&&THEMES[name]?Object.assign({},TC0,THEMES[name]):TC0; }
function mix(a,b,t){ const A=parseInt(a.slice(1),16),B=parseInt(b.slice(1),16);return '#'+[16,8,0].map(n=>Math.round(((A>>n)&255)*(1-t)+((B>>n)&255)*t).toString(16).padStart(2,'0')).join(''); }
const isWater=t=>t==='sea'||t==='reef'||t==='river'||t==='shoal'||t==='bridge';
const seaLike=t=>t==='sea'||t==='reef';
function drawTerrain(g,map,x,y){
  const cell=map.grid[y][x], t=cell.t, X=x*T, Y=y*T;
  const tAt=(xx,yy)=>(yy<0||xx<0||yy>=map.H||xx>=map.W)?null:map.grid[yy][xx].t;
  const at=(dx,dy)=>tAt(x+dx,y+dy);
  const R=(a,b,w,h,c)=>{ g.fillStyle=c; g.fillRect(X+a,Y+b,w,h); };
  const P=(a,b,c)=>{ g.fillStyle=c; g.fillRect(X+a,Y+b,1,1); };
  const landT=n=>n&&!isWater(n), seaT=n=>n&&seaLike(n);
  // 얕은 바다: 여덟 방향 가운데 한 칸이라도 바다가 아니면 얕다(대각선까지 봐서 계단 모양을 없앤다)
  const shallowAt=(xx,yy)=>{ for(let dy=-1;dy<=1;dy++) for(let dx=-1;dx<=1;dx++){ if(!dx&&!dy) continue; const n=tAt(xx+dx,yy+dy); if(n&&!seaLike(n)) return true; } return false; };
  const cS=mix(TC.water,TC.wave,.18), cD=TC.deep;
  /* 가장자리까지의 거리: 맞닿은 네 변은 곧은 띠, 대각선만 닿으면 둥근 모서리, 두 변이 만나는 안쪽 모서리도 한 점 굴린다. */
  const edgeDist=(is,open)=>{ const U=is(at(0,-1)),D=is(at(0,1)),L=is(at(-1,0)),Rt=is(at(1,0)), o=(dx,dy)=>!is(at(dx,dy))&&(!open||open(at(dx,dy)));
    const dg=[[o(0,-1)&&o(-1,0)&&is(at(-1,-1)),0,0],[o(0,-1)&&o(1,0)&&is(at(1,-1)),1,0],[o(0,1)&&o(-1,0)&&is(at(-1,1)),0,1],[o(0,1)&&o(1,0)&&is(at(1,1)),1,1]];
    return (px,py)=>{ let d=99,side='';
      const set=(v,s)=>{ if(v<d){ d=v; side=s; } };
      const a=py, b=T-1-py, c=px, e=T-1-px;
      if(U) set(a,'U'); if(D) set(b,'D'); if(L) set(c,'L'); if(Rt) set(e,'R');
      const round=(p,q)=>{ if(p===q&&p>=2&&p<=3) d=Math.min(d,p-1); };
      if(U&&L) round(c,a); if(U&&Rt) round(e,a); if(D&&L) round(c,b); if(D&&Rt) round(e,b);
      for(const [on,rx,ry] of dg){ if(!on) continue; const p=rx?e:c, q=ry?b:a, v=Math.floor(Math.sqrt(p*p+q*q)+.3); set(v,ry?'D':'U'); }
      return [d,side]; }; };
  const grass=()=>{ R(0,0,T,T,(x+y)%2?TC.grass:mix(TC.grass,TC.grassB,.45));
    const h=hash(x,y,1), dk=mix(TC.grass,TC.grass2,.6), lt=mix(TC.grass,TC.grass3,.6);
    // 풀포기: 짧은 풀잎 두세 가닥
    const tuft=(a,b)=>{ P(a,b+1,dk); P(a+1,b,dk); P(a+2,b+1,dk); P(a+1,b-1,lt); };
    tuft(2+h%10,3+(h>>>4)%10); if((h>>>8)%3===0) tuft(2+(h>>>10)%10,3+(h>>>14)%10);
    R((h>>>18)%11+2,(h>>>22)%12+2,2,1,lt);
    // 바다로 튀어나온 땅 모서리는 모래로 한 점 굴린다
    const w=(dx,dy)=>seaT(at(dx,dy));
    if(w(0,-1)&&w(-1,0)){ R(0,0,2,1,TC.sand); P(0,1,TC.sand); } if(w(0,-1)&&w(1,0)){ R(T-2,0,2,1,TC.sand); P(T-1,1,TC.sand); }
    if(w(0,1)&&w(-1,0)){ R(0,T-1,2,1,TC.sand); P(0,T-2,TC.sand); } if(w(0,1)&&w(1,0)){ R(T-2,T-1,2,1,TC.sand); P(T-1,T-2,TC.sand); } };
  const sea=()=>{ const sh=shallowAt(x,y); R(0,0,T,T,sh?cS:cD);
    const h=hash(x,y,7);
    if(!sh){ // 깊은 바다: 얕은 칸 쪽 가장자리를 두 줄 점묘로 풀어 준다
      const s=(dx,dy)=>seaT(at(dx,dy))&&shallowAt(x+dx,y+dy);
      const U=s(0,-1),D=s(0,1),L=s(-1,0),Rt=s(1,0);
      for(let i=0;i<T;i++){ const e=(i+x+y)%2===0, q=(i+2*(x+y))%4===1;
        if(U){ if(e) P(i,0,cS); if(q) P(i,1,cS); } if(D){ if(e) P(i,T-1,cS); if(q) P(i,T-2,cS); }
        if(L){ if(e) P(0,i,cS); if(q) P(1,i,cS); } if(Rt){ if(e) P(T-1,i,cS); if(q) P(T-2,i,cS); } }
      for(const [dx,dy] of [[-1,-1],[1,-1],[-1,1],[1,1]]) if(s(dx,dy)&&!s(dx,0)&&!s(0,dy)){ const cx=dx<0?0:T-1, cy=dy<0?0:T-1; P(cx,cy,cS); P(cx-dx*2,cy,cS); P(cx,cy-dy*2,cS); }
    } else { // 얕은 바다: 땅에서 대각선으로만 닿는 바깥 모서리는 깊은 색으로 깎아 둥글린다
      const non=(dx,dy)=>{ const n=at(dx,dy); return n&&!seaLike(n); };
      if(![[0,-1],[0,1],[-1,0],[1,0]].some(([a,b])=>non(a,b))){
        const ds=[[-1,-1],[1,-1],[-1,1],[1,1]].filter(([a,b])=>non(a,b));
        if(ds.length===1){ const [dx,dy]=ds[0];
          for(let j=0;j<7;j++) for(let i=0;i<7-j;i++){ const px=dx<0?T-1-i:i, py=dy<0?T-1-j:j; if(i+j<5||(i+j===5&&(i%2===0))) P(px,py,cD); } } }
      // 깊은 칸 쪽 가장자리에 깊은 색을 성기게 섞는다
      const dp=(dx,dy)=>seaT(at(dx,dy))&&!shallowAt(x+dx,y+dy);
      for(let i=0;i<T;i++){ const q=(i+2*(x+y))%4===3;
        if(q&&dp(0,-1)) P(i,0,cD); if(q&&dp(0,1)) P(i,T-1,cD); if(q&&dp(-1,0)) P(0,i,cD); if(q&&dp(1,0)) P(T-1,i,cD); } }
    // 잔물결: 작은 호 모양과 짧은 줄
    const wc=mix(sh?cS:cD,TC.wave,sh?.5:.42), wd=mix(sh?cS:cD,TC.water2,.55);
    if(h%3===0){ const a=3+h%7, b=4+(h>>>5)%8; P(a,b+1,wc); R(a+1,b,2,1,wc); P(a+3,b+1,wc); R(a+1,b+1,2,1,wd); }
    else if(h%3===1){ const a=3+(h>>>3)%9, b=4+(h>>>7)%8; R(a,b,2,1,wc); }
    if((h>>>11)%4===0){ const a=2+(h>>>13)%10, b=3+(h>>>17)%10; R(a,b,3,1,wc); }
    // 땅과 맞닿은 쪽: 모래 두 줄, 흰 물결 한 줄, 그 바깥에 끊어진 잔물결
    const dist=edgeDist(landT,n=>!n||seaLike(n)), surf=mix(cS,TC.foam,.5), wet=mix(TC.sand,TC.sand2,.6);
    for(let py=0;py<T;py++) for(let px=0;px<T;px++){ const [d,side]=dist(px,py); if(d>3) continue;
      if(d<2) P(px,py,(d===1&&side==='U')?wet:TC.sand); else if(d===2) P(px,py,TC.foam);
      else { const c=side==='U'||side==='D'?px:py; if(((hash(x,y,side.charCodeAt(0))>>>((c>>1)*2))&3)===0) P(px,py,surf); } } };
  // 도로·강: 꺾이는 곳의 바깥 모서리는 굴리고, 안쪽 모서리에는 풀을 남긴다
  const lane=(col,edge,B,conn)=>{ const up=conn(at(0,-1)),dn=conn(at(0,1)),lf=conn(at(-1,0)),rt=conn(at(1,0));
    R(0,0,T,T,col);
    if(!up){ R(0,0,T,B,TC.grass); R(0,B,T,1,edge); } if(!dn){ R(0,T-B,T,B,TC.grass); R(0,T-B-1,T,1,edge); }
    if(!lf){ R(0,0,B,T,TC.grass); R(B,up?0:B,1,T-(up?0:B)-(dn?0:B),edge); } if(!rt){ R(T-B,0,B,T,TC.grass); R(T-B-1,up?0:B,1,T-(up?0:B)-(dn?0:B),edge); }
    for(const [a,b,sx,sy] of [[up,lf,0,0],[up,rt,1,0],[dn,lf,0,1],[dn,rt,1,1]]){
      const cx=sx?T-1:0, cy=sy?T-1:0, ix=sx?-1:1, iy=sy?-1:1, Q=(i,j,c)=>P(cx+ix*i,cy+iy*j,c);
      if(!a&&!b){ for(let i=0;i<=B;i++) for(let j=0;j<=B;j++) Q(i,j,TC.grass); Q(B+1,B,TC.grass); Q(B,B+1,TC.grass); Q(B+1,B+1,edge); Q(B+2,B,edge); Q(B,B+2,edge); }
      else if(a&&b&&!conn(at(sx?1:-1,sy?1:-1))){ for(let i=0;i<B;i++) for(let j=0;j<B;j++) Q(i,j,TC.grass); for(let i=0;i<B;i++){ Q(i,B,edge); Q(B,i,edge); } Q(B-1,B-1,edge); } }
    return {up,dn,lf,rt}; };
  if(t==='plain'){ grass(); const h=hash(x,y,11), F=TC.fl; if(h%TC.flRate===0){ const fx=2+h%11, fy=3+(h>>>5)%10; R(fx,fy,1,1,F[0]); R(fx+1,fy+1,1,1,F[1+(h>>>9)%(F.length-1)]); }
    if(TC.flRate===1&&h%2){ const fx=1+(h>>>13)%12, fy=1+(h>>>17)%12; R(fx,fy,1,1,F[1+(h>>>21)%(F.length-1)]); R(fx+1,fy,1,1,F[0]); } }
  else if(t==='forest'){ grass(); const pp={...propPal(0),k:mix(TC.tree2,'#23313c',.3)}, f=(dx,dy)=>at(dx,dy)==='forest';
    // 숲 그늘: 나무 밑을 어둡게 깔고 이웃한 숲과 이어 붙인다
    const sd=mix(TC.grass,TC.tree2,.3); R(2,9,12,5,sd); R(1,10,14,3,sd); if(f(-1,0)) R(0,10,2,3,sd); if(f(1,0)) R(14,10,2,3,sd); if(f(0,1)) R(3,14,10,2,sd); if(f(0,-1)) R(3,0,10,2,sd);
    const lay=[[[5,-3],[0,3],[8,4]],[[1,-3],[8,-2],[4,4]],[[6,-3],[0,1],[9,3],[4,5]],[[0,-2],[8,-3],[3,3],[9,5]]][hash(x,y,13)%4];
    for(const [a,b] of lay) stamp(g,PROP.tree,X+a,Y+b,pp); }
  else if(t==='mountain'){ grass(); const k=mix(TC.rock2,'#23313c',.45);
    stamp(g,hash(x,y,9)%2?PROP.mountain:PROP.mountain2,X,Y-4,{...propPal(0),k,w:TC.snow,x:mix(TC.snow,TC.rock,.4),v:mix(TC.rock,TC.snow,.4),D:mix(TC.rock2,'#23313c',.22),G:mix(TC.grass,TC.tree2,.35)}); }
  else if(t==='road'||t==='bridge'||t==='river'){
    grass();
    const conn=n=>{ if(!n) return false; if(t==='river') return n==='river'||n==='bridge'||seaLike(n)||n==='shoal';
      return n==='road'||n==='bridge'||['city','factory','airport','port','hq'].includes(n); };
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
      const {up,dn,lf,rt}=lane(TC.road,TC.road2,3,conn), h=hash(x,y,17);
      // 아스팔트 결: 어두운 점 하나, 밝은 점 하나
      P(5+h%6,5+(h>>>4)%6,mix(TC.road,TC.road2,.45)); P(5+(h>>>8)%6,5+(h>>>12)%6,mix(TC.road,TC.road3,.4));
      if(lf&&rt&&!up&&!dn){ R(1,7,5,1,TC.road3); R(10,7,5,1,TC.road3); }
      if(up&&dn&&!lf&&!rt){ R(7,1,1,5,TC.road3); R(7,10,1,5,TC.road3); }
    } else {
      lane(TC.river,TC.bank,3,conn);
      const h=hash(x,y,3); R(5+(h%4),5+(h>>>3)%3,3,1,TC.wave); R(4+(h>>>6)%5,9+(h>>>9)%2,2,1,TC.river2);
    }
  }
  else if(t==='sea') sea();
  else if(t==='reef'){ sea(); const fm=mix(cS,TC.foam,.6); R(2,10,6,1,fm); R(8,6,5,1,fm); R(9,12,5,1,fm);
    R(3,8,4,3,TC.rock2); R(4,7,2,1,TC.rock); R(4,8,2,1,TC.rock); R(9,4,3,3,TC.rock2); R(10,3,1,1,TC.rock); R(9,4,2,1,TC.rock); R(10,10,3,2,TC.rock2); R(10,10,2,1,TC.rock); }
  else if(t==='shoal'){ R(0,0,T,T,TC.sand); const h=hash(x,y,5); R(h%10+2,(h>>>4)%10+3,2,1,TC.sand2); R((h>>>8)%10+3,(h>>>12)%10+2,1,1,TC.sand2); P((h>>>16)%10+3,(h>>>20)%10+3,mix(TC.sand,'#ffffff',.5));
    // 바다 쪽: 얕은 물 두 줄, 흰 물결, 젖은 모래 순으로 풀어 준다
    const dist=edgeDist(seaT), wet=mix(TC.sand,TC.sand2,.55);
    for(let py=0;py<T;py++) for(let px=0;px<T;px++){ const [d]=dist(px,py); if(d>3) continue; P(px,py,d<2?cS:d===2?TC.foam:wet); } }
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
'................','.......kk.......','......kwwk......','......kwwxk.....','.....kwwwxxk....','.....kvwvxRk....',
'....kvvvrxRRk...','....kvvrrRRDk...','...kvvvrrRRRDk..','...kvvrvrRRRDk..','..kvvvrrrRRRDDk.','..kvvrvrrRRRDDk.',
'.kvvvrrvrRRRRDDk','.kvvrrvrrRRRRDDk','kvvvrrvrrrRRRDDk','kkvvrkkrrRRkkDDk','.GGkkGGkkkkGGkk.'],
mountain2:[
'................','................','.........kk.....','........kwwk....','........kwwxk...','...kk..kvwwxxk..',
'..kwwk.kvvwxRk..','..kwwxkvvvrxRRk.','.kvwwxxkvvrRRDk.','.kvvvrRkvrrRRDk.','kvvvrrRRkrrRRDDk','kvvvrrRRkrRRRDDk',
'kvvrvrRRDkRRRDDk','kvvrrvRRDkRRRDDk','kvvrrrRRRDkRRDDk','kkvrrkkRRDkkRDDk','.GGkkGGkkkGGkkk.'],
tree:[
'...k...','..kak..','.kaabk.','kaabbbk','.kbbck.','kbbbcck','.kccck.','..ktk..']
};
function stamp(g,rows,X,Y,pal){
  for(let y=0;y<rows.length;y++){ const r=rows[y];
    for(let i=0;i<r.length;i++){ const ch=r[i]; if(ch==='.') continue; const c=pal[ch]||C[ch]; if(!c) continue; g.fillStyle=c; g.fillRect(X+i,Y+y,1,1); } }
}
function propPal(owner){ const P=PAL[owner||0]; return {m:P.m,d:P.d,l:P.l,S:'rgba(20,30,10,.28)',y:owner?C.y:P.l,
  r:TC.rock,R:TC.rock2,a:TC.treeTop||TC.grass3,b:TC.tree,c:TC.tree2,t:TC.trunk}; }
function drawProperty(g,cell,X,Y,at){
  const t=cell.t, pal=propPal(cell.owner);
  const R=(a,b,w,h,c)=>{ g.fillStyle=c; g.fillRect(X+a,Y+b,w,h); };
  if(t==='port'){ R(0,0,T,T,TC.water); R(0,7,T,9,TC.road2); R(0,7,T,1,C.k); for(let i=1;i<T;i+=4) R(i,9,2,6,TC.road); R(0,15,T,1,TC.plank2);
    stamp(g,PROP.port,X,Y-4,pal); return; }
  if(t==='airport'){ R(0,11,T,5,TC.road2); R(0,11,T,1,TC.sand2); for(let i=1;i<T;i+=5) R(i,13,3,1,C.w); stamp(g,PROP.airport,X,Y-4,pal); return; }
  stamp(g,PROP[t],X,Y-4,pal);
}
function themeOf(map){ const D=root.DH_DATA, m=D&&D.MAPS.find(m=>m.id===map.id), explicit=map.theme||(m&&m.theme);
  return explicit||([3,7,9,11,15,18,19,20,24].includes(map.id)?'coast':[4,10,17,22].includes(map.id)?'highland':map.id===23?'harvest':null); }
function terrainLayer(map){
  setTheme(themeOf(map));
  const c=mk(map.W*T,map.H*T+PAD), g=c.getContext('2d'); g.translate(0,PAD);
  for(let y=0;y<map.H;y++) for(let x=0;x<map.W;x++) drawTerrain(g,map,x,y);
  return c;
}
function digit(g,n,x,y,col){ const s=String(n); let ox=x;
  for(const ch of s){ const d=DIG[ch]; g.fillStyle=C.k; g.fillRect(ox-1,y-1,5,7); g.fillStyle=col||C.w;
    for(let r=0;r<5;r++) for(let i=0;i<3;i++) if(d[r][i]==='1') g.fillRect(ox+i,y+r,1,1); ox+=4; } }

// 지형 위의 부대만 한 도트 밝은 윤곽으로 분리한다. 목록용 그림 크기는 그대로다.
const rimCache=new Map();
function unitRim(spr){
  if(rimCache.has(spr))return rimCache.get(spr);
  const c=mk(T+2,T+2),g=c.getContext('2d');
  for(const [x,y] of [[0,1],[2,1],[1,0],[1,2]])g.drawImage(spr,x,y);
  g.globalCompositeOperation='source-in';g.fillStyle='#f2efda';g.fillRect(0,0,T+2,T+2);
  rimCache.set(spr,c);return c;
}
function teamMark(g,owner,x,y){
  g.fillStyle=C.k;g.fillRect(x,y,5,4);g.fillStyle=PAL[owner].l;
  if(owner===1)g.fillRect(x+1,y+1,3,2);
  else {g.fillRect(x+2,y,1,1);g.fillRect(x+1,y+1,3,2);g.fillRect(x+2,y+3,1,1);}
}
function rangeTiles(g,set,attack){
  for(const k of set){const x=(k%1000)*T,y=Math.floor(k/1000)*T;
    g.fillStyle=attack?'rgba(206,81,70,.24)':'rgba(94,165,189,.24)';g.fillRect(x,y,T,T);
    g.fillStyle=attack?'#9e3e39':'#3d778a';
    // 범위 보기(Shift·적 유닛 누르기)는 색만 칠하고 칸마다의 모서리 표시를 그리지 않는다
    if(attack){if(!set.view)for(const [a,b] of [[1,1],[12,1],[1,12],[12,12]]){g.fillRect(x+a,y+b,3,1);g.fillRect(x+a,y+b,1,3);}}
    else {g.fillRect(x+1,y+1,14,1);g.fillRect(x+1,y+14,14,1);g.fillRect(x+1,y+1,1,14);g.fillRect(x+14,y+1,1,14);}
  }
}

/* ---- 장면 ---- */
function draw(g, s, ui, now){
  const map=s.map;
  if(!ui.terrain || ui.terrainKey!==ui.terrainVer){ ui.terrain=terrainLayer(map); ui.terrainKey=ui.terrainVer; }
  setTheme(themeOf(map));
  g.imageSmoothingEnabled=false;
  g.drawImage(ui.terrain,0,0); g.save(); g.translate(0,PAD);
  // 물결 반짝임(지형층 위에 가볍게)
  if(ui.seaKey!==ui.terrainKey){ ui.seaTiles=[]; for(let y=0;y<map.H;y++) for(let x=0;x<map.W;x++){ const t=map.grid[y][x].t; if(t==='sea'||t==='river') ui.seaTiles.push([x,y,t]); } ui.seaKey=ui.terrainKey; }
  { const ph=Math.floor(now/650); g.fillStyle=TC.sparkle;
    for(const [x,y,t] of ui.seaTiles){ const h=hash(x,y,ph&7); if(h%4) continue; const k=t==='river'?6:10; g.fillRect(x*T+3+(h>>>3)%k,y*T+3+(h>>>7)%k,2,1); } }
  // 이동 · 공격 범위
  if(ui.moveSet) rangeTiles(g,ui.moveSet,false);
  if(ui.atkSet) rangeTiles(g,ui.atkSet,true);
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
    const air=UNITS[u.type].cls==='air'||['fighter','bomber','stealth','bcopter','tcopter'].includes(u.type);
    if(!u.dived){ const rx=Math.round(px), ry=Math.round(py), tc=u.owner===1?'rgba(229,72,58,.55)':'rgba(58,120,232,.55)';
      g.fillStyle='rgba(15,20,10,.25)'; if(air){ g.fillRect(rx+5,ry+15,6,1); } else { g.fillRect(rx+3,ry+15,10,1); }
      g.fillStyle=tc; if(air){ g.fillRect(rx+4,ry+14,8,1); } else { g.fillRect(rx+2,ry+14,12,1); g.fillRect(rx+3,ry+13,10,1); } }
    g.globalAlpha=u.dived?.55:1;
    g.drawImage(unitRim(spr),Math.round(px)-1,Math.round(py)-bob-1);
    g.drawImage(spr,Math.round(px),Math.round(py)-bob);
    g.globalAlpha=1;
    // 왼쪽의 연료·탄약 경고, 오른쪽 체력 숫자를 비워 둔다.
    teamMark(g,u.owner,Math.round(px)+6,Math.round(py)+12);
    const hp=Math.ceil(u.hp/10);
    if(hp<10) digit(g,hp,Math.round(px)+12,Math.round(py)+10);
    const d=UNITS[u.type];
    if((d.fuel && u.fuel<=Math.max(10,(d.daily||0)*3)) || (d.ammo && u.ammo===0)){ if(Math.floor(now/500)%2){ g.fillStyle=C.k; g.fillRect(px+1,py+10,5,5); g.fillStyle=C.o; g.fillRect(px+2,py+11,3,3);} }
    if(u.cargo.length){ g.fillStyle=C.k; g.fillRect(px+1,py+1,5,5); g.fillStyle=C.w; g.fillRect(px+2,py+2,3,3); }
  }
  // 눈: 꽥꽥의 능력이 켜져 있는 동안 흰빛과 눈송이
  if(s.players.some(P=>P&&(P.pw||P.co)===6&&P.power)){
    g.fillStyle='rgba(236,244,255,.24)'; g.fillRect(0,0,map.W*T,map.H*T);
    const n=Math.floor(map.W*map.H/2), t=now/1000;
    g.fillStyle='#ffffff';
    for(let i=0;i<n;i++){ const h=hash(i,7,3), X=((h%(map.W*T))+Math.sin(t*1.3+i)*3+map.W*T)%(map.W*T), Y=((h>>>9)%(map.H*T)+t*(10+(h>>>20)%10))%(map.H*T); g.fillRect(Math.round(X),Math.round(Y),(h>>>5)%3?1:2,1); }
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
