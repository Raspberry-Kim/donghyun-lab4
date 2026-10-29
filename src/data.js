/* 동현전 데이터: 지형·병종·피해표·지휘관·지도.
   규칙의 뼈대(격자 턴제·점령·생산·연료·탄약)는 고전 턴제 전술 게임의 일반 규칙을 따른다.
   피해표 수치, 지휘관, 지도, 그림은 동현전에서 새로 정했다. */
const TERRAIN = {
  plain:   {name:'평지',   def:1, icon:'.'},
  forest:  {name:'숲',     def:2},
  mountain:{name:'산',     def:4},
  river:   {name:'강',     def:0},
  road:    {name:'도로',   def:0},
  bridge:  {name:'다리',   def:0},
  sea:     {name:'바다',   def:0},
  shoal:   {name:'모래톱', def:0},
  reef:    {name:'암초',   def:1},
  city:    {name:'도시',   def:3, prop:true},
  factory: {name:'공장',   def:3, prop:true},
  airport: {name:'공항',   def:3, prop:true},
  port:    {name:'항구',   def:3, prop:true},
  hq:      {name:'본부',   def:4, prop:true}
};
// 이동 유형별 칸 비용 (0 = 지나갈 수 없음)
const MOVE_COST = {
  //        plain forest mountain river road bridge sea shoal reef city factory airport port hq
  foot:   [1,1,2,2,1,1,0,1,0,1,1,1,1,1],
  mech:   [1,1,1,1,1,1,0,1,0,1,1,1,1,1],
  tread:  [1,2,0,0,1,1,0,1,0,1,1,1,1,1],
  tire:   [2,3,0,0,1,1,0,1,0,1,1,1,1,1],
  air:    [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  ship:   [0,0,0,0,0,0,1,0,2,0,0,0,1,0],
  lander: [0,0,0,0,0,0,1,1,2,0,0,0,1,0]
};
const TERRAIN_ORDER = ['plain','forest','mountain','river','road','bridge','sea','shoal','reef','city','factory','airport','port','hq'];

// 병종: 가격·이동·이동유형·연료·탄약·사거리·분류
const UNITS = {
  inf:     {name:'보병',       short:'보병', cost:1000,  move:3, mt:'foot',  fuel:99, ammo:0, range:[1,1], cls:'foot',  cap:true},
  mech:    {name:'기계화보병', short:'기보', cost:3000,  move:2, mt:'mech',  fuel:70, ammo:3, range:[1,1], cls:'foot',  cap:true},
  recon:   {name:'정찰차',     short:'정찰', cost:4000,  move:8, mt:'tire',  fuel:80, ammo:0, range:[1,1], cls:'vehicle'},
  tank:    {name:'전차',       short:'전차', cost:7000,  move:6, mt:'tread', fuel:70, ammo:9, range:[1,1], cls:'vehicle'},
  md:      {name:'대형전차',   short:'대형', cost:16000, move:5, mt:'tread', fuel:50, ammo:8, range:[1,1], cls:'vehicle'},
  neo:     {name:'신형전차',   short:'신형', cost:22000, move:6, mt:'tread', fuel:99, ammo:9, range:[1,1], cls:'vehicle'},
  apc:     {name:'보급차',     short:'보급', cost:5000,  move:6, mt:'tread', fuel:70, ammo:0, range:null,  cls:'vehicle', carry:['foot'], cap_n:1, supply:true},
  art:     {name:'자주포',     short:'자주', cost:6000,  move:5, mt:'tread', fuel:50, ammo:9, range:[2,3], cls:'vehicle', indirect:true},
  rocket:  {name:'로켓포',     short:'로켓', cost:15000, move:5, mt:'tire',  fuel:50, ammo:6, range:[3,5], cls:'vehicle', indirect:true},
  aa:      {name:'대공전차',   short:'대공', cost:8000,  move:6, mt:'tread', fuel:60, ammo:9, range:[1,1], cls:'vehicle'},
  missile: {name:'대공미사일', short:'미사', cost:12000, move:4, mt:'tire',  fuel:50, ammo:6, range:[3,5], cls:'vehicle', indirect:true},
  fighter: {name:'전투기',     short:'전투', cost:20000, move:9, mt:'air',   fuel:99, ammo:9, range:[1,1], cls:'plane', daily:5},
  bomber:  {name:'폭격기',     short:'폭격', cost:22000, move:7, mt:'air',   fuel:99, ammo:9, range:[1,1], cls:'plane', daily:5},
  bcopter: {name:'공격헬기',   short:'공헬', cost:9000,  move:6, mt:'air',   fuel:99, ammo:6, range:[1,1], cls:'copter', daily:2},
  tcopter: {name:'수송헬기',   short:'수헬', cost:5000,  move:6, mt:'air',   fuel:99, ammo:0, range:null,  cls:'copter', daily:2, carry:['foot'], cap_n:1},
  bship:   {name:'전함',       short:'전함', cost:28000, move:5, mt:'ship',  fuel:99, ammo:9, range:[2,6], cls:'ship', daily:1, indirect:true},
  cruiser: {name:'순양함',     short:'순양', cost:18000, move:6, mt:'ship',  fuel:99, ammo:9, range:[1,1], cls:'ship', daily:1, carry:['copter'], cap_n:2},
  lander:  {name:'수송함',     short:'수송', cost:12000, move:6, mt:'lander',fuel:99, ammo:0, range:null,  cls:'ship', daily:1, carry:['foot','vehicle'], cap_n:2},
  sub:     {name:'잠수함',     short:'잠수', cost:20000, move:5, mt:'ship',  fuel:60, ammo:6, range:[1,1], cls:'ship', daily:1, dive:true}
};
const UNIT_ORDER = Object.keys(UNITS);
const BUILD = {
  factory:['inf','mech','recon','tank','md','neo','apc','art','rocket','aa','missile'],
  airport:['fighter','bomber','bcopter','tcopter'],
  port:['bship','cruiser','lander','sub']
};

/* 피해표(동현전 자체 조정값, 기본 피해 %).
   pri: 탄약을 쓰는 주무기, sec: 탄약 제한이 없는 부무기.
   열 순서는 UNIT_ORDER와 같다: 보병 기보 정찰 전차 대형 신형 보급 자주 로켓 대공 미사 전투 폭격 공헬 수헬 전함 순양 수송 잠수 */
const _ = null;
const DMG = {
  inf:    {sec:[55,45,12, 5, 1, 1,14,15,25, 5,25, _, _, 7,30, _, _, _, _]},
  mech:   {pri:[ _, _,85,55,15,15,75,70,85,65,85, _, _, _, _, _, _, _, _],
           sec:[65,55,18, 6, 1, 1,20,32,35, 6,35, _, _, 9,35, _, _, _, _]},
  recon:  {sec:[70,65,35, 6, 1, 1,45,45,55, 4,28, _, _,10,35, _, _, _, _]},
  tank:   {pri:[ _, _,85,55,15,15,75,70,85,65,85, _, _, _, _, 1, 5,10, 1],
           sec:[75,70,40, 6, 1, 1,45,45,55, 5,30, _, _,10,40, _, _, _, _]},
  md:     {pri:[ _, _,105,85,55,45,105,105,105,105,105, _, _, _, _,10,45,35,10],
           sec:[105,95,45, 8, 1, 1,45,45,55, 7,35, _, _,12,45, _, _, _, _]},
  neo:    {pri:[ _, _,125,105,75,55,125,115,125,115,125, _, _, _, _,15,50,40,15],
           sec:[125,115,65,10, 1, 1,65,65,75,17,55, _, _,22,55, _, _, _, _]},
  apc:    {},
  art:    {pri:[90,85,80,70,45,40,70,75,80,75,80, _, _, _, _,40,50,55,60]},
  rocket: {pri:[95,90,90,80,55,50,80,80,85,85,90, _, _, _, _,55,60,60,85]},
  aa:     {pri:[105,105,60,25,10, 5,50,50,55,45,55,65,75,120,120, _, _, _, _]},
  missile:{pri:[ _, _, _, _, _, _, _, _, _, _, _,100,100,120,120, _, _, _, _]},
  fighter:{pri:[ _, _, _, _, _, _, _, _, _, _, _,55,100,100,100, _, _, _, _]},
  bomber: {pri:[110,110,105,105,95,90,105,105,105,95,105, _, _, _, _,75,85,95,95]},
  bcopter:{pri:[ _, _,55,55,25,20,60,65,65,25,65, _, _, _, _,25,55,25,25],
           sec:[75,75,30, 6, 1, 1,20,25,35, 6,35, _, _,65,95, _, _, _, _]},
  tcopter:{},
  bship:  {pri:[95,90,90,80,55,50,80,80,85,85,90, _, _, _, _,50,95,95,95]},
  cruiser:{pri:[ _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,90],
           sec:[ _, _, _, _, _, _, _, _, _, _, _,55,65,115,115, _, _, _, _]},
  lander: {},
  sub:    {pri:[ _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,55,25,95,55]}
};

/* 지휘관: 붉은별 사령부. 이름·얼굴·대사는 동현전의 창작이다.
   능력의 틀(균형형·근접형·보병형·행운형·절약형)은 고전 전술 게임 지휘관 구성에서 흔한 원형을 참고했다. */
const COS = [
  {id:1, name:'뭉치', role:'정비형 균형 지휘관', color:'#d8483a',
   passive:'특별한 강점도 약점도 없다. 어떤 지도에서도 무난하다.',
   cop:{name:'응급 정비', stars:3, text:'모든 아군 체력 +2'},
   scop:{name:'총력 정비', stars:6, text:'모든 아군 체력 +5 · 공격 +10% · 이동 +1'},
   line:'고장 난 건 고치면 된다. 다시 가자.'},
  {id:2, name:'뚱띠', role:'근접 돌파 지휘관', color:'#b9452e',
   passive:'보병이 아닌 근접 공격 유닛 공격 +20%. 간접 공격 유닛은 공격 −10%, 최대 사거리 −1.',
   cop:{name:'철갑 돌격', stars:3, text:'근접 차량·항공·함정 공격 +10%p 추가 · 이동 +1'},
   scop:{name:'무쇠 폭풍', stars:6, text:'근접 차량·항공·함정 공격 +30%p 추가 · 이동 +2'},
   line:'정면으로 부딪치면 길이 생긴다.'},
  {id:3, name:'또치', role:'보병·점령 지휘관', color:'#e0663f',
   passive:'보병·기계화보병 공격 +20%, 점령 속도 1.5배. 수송 유닛 이동 +1. 그 밖의 근접 유닛 공격 −10%.',
   cop:{name:'새벽 행군', stars:3, text:'보병류 이동 +1 · 공격 +10%p 추가'},
   scop:{name:'해 뜨는 진격', stars:8, text:'보병류 이동 +2 · 공격 +20%p 추가 · 점령을 한 번에 끝낸다'},
   line:'깃발은 발로 꽂는 것이다.'},
  {id:4, name:'포동이', role:'행운형 지휘관', color:'#f08a4b',
   passive:'공격할 때 운 보정이 0–19로 넓다. 일반 지휘관은 0–9.',
   cop:{name:'네잎 행운', stars:3, text:'운 보정 0–59'},
   scop:{name:'대박 행운', stars:6, text:'운 보정 0–99'},
   line:'오늘은 왠지 잘 맞을 것 같아.'},
  {id:5, name:'뿡뿡', role:'절약·보급 지휘관', color:'#c75b39',
   passive:'모든 유닛 생산 비용 90%.',
   cop:{name:'반값 장터', stars:2, text:'이번 턴 생산 비용 50%'},
   scop:{name:'골목 상회', stars:5, text:'생산 비용 50% · 아군 도시에서도 지상 유닛 생산'},
   line:'아낀 만큼 한 대 더 뽑는다.'}
];
const STAR_VALUE = 9000;

/* 지도: 위쪽 절반만 적고 180° 회전으로 아래쪽 절반을 만든다(두 진영이 같은 조건).
   . 평지  f 숲  ^ 산  r 강  = 도로  # 다리  ~ 바다  _ 모래톱  * 암초
   c 중립 도시  m 중립 공장  a 중립 공항  p 중립 항구
   C/D 도시(나/컴퓨터)  M/N 공장  A/E 공항  P/R 항구  H/I 본부 */
const MAP_SRC = [
  {id:1, name:'작은 연습장', note:'12×8 · 공장 3 · 빠른 한 판', half:[
    '^..c...==DI.',
    'f..m...=.N.f',
    '.c..f..=..c.',
    '..^.====....']},
  {id:2, name:'첫 들판', note:'16×10 · 강과 다리 · 지상전', half:[
    '^f..c...r...=DI^',
    'f..=====#====N..',
    '.c.=..f.r..f=..c',
    '...=.^^.r.c.=.f.',
    'm..=...rr..f=.c.']},
  {id:3, name:'푸른 해협', note:'18×12 · 바다·공항·항구 · 육해공', half:[
    '~~~~~~_.f..c.==DI^',
    '~~*~~~_..f..==N..f',
    '~~~~~~~R==.c..=.E.',
    '~~~~~~~__.fa.^=..c',
    '~~~__.~~~~p_.^^=..',
    '~~_.c_~~..___f.=..']},
  {id:4, name:'산맥 회랑', note:'20×12 · 산맥 사이 두 길 · 공항', half:[
    '^^^ff..c...^^=..cDI^',
    '^^f...============Nf',
    '^f..c.=.ff^^.=c...E.',
    'f..f..=.f^^^.=.f...c',
    '.a...^=..^^..=c.f...',
    '..c..f=..f...=..f.m.']}
];
const CELL = {
  '.':['plain',0],'f':['forest',0],'^':['mountain',0],'r':['river',0],'=':['road',0],'#':['bridge',0],
  '~':['sea',0],'_':['shoal',0],'*':['reef',0],
  'c':['city',0],'C':['city',1],'D':['city',2],'m':['factory',0],'M':['factory',1],'N':['factory',2],
  'a':['airport',0],'A':['airport',1],'E':['airport',2],'p':['port',0],'P':['port',1],'R':['port',2],
  'H':['hq',1],'I':['hq',2]
};
function buildMap(src){
  const top=src.half, W=top[0].length, Hh=top.length, H=Hh*2;
  const grid=[];
  for(let y=0;y<H;y++){const row=[];for(let x=0;x<W;x++){
    let ch, swap=false;
    if(y<Hh) ch=top[y][x]; else {ch=top[H-1-y][W-1-x]; swap=true;}
    const c=CELL[ch]; if(!c) throw Error('지도 문자 오류: '+ch);
    let owner=c[1]; if(swap&&owner) owner=3-owner;
    row.push({t:c[0], owner});
  } grid.push(row);}
  return {id:src.id, name:src.name, note:src.note, W, H, grid};
}
const MAPS = MAP_SRC.map(buildMap);

const DH_DATA={TERRAIN,MOVE_COST,TERRAIN_ORDER,UNITS,UNIT_ORDER,BUILD,DMG,COS,STAR_VALUE,MAPS,buildMap};
if(typeof module!=='undefined') module.exports=DH_DATA; else self.DH_DATA=DH_DATA;
