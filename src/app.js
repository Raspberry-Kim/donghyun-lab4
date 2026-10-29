/* 동현전 화면: 동현랭 출전 → 키보드 전투 → 결과 → 다시 출전 준비 */
(function(){
const $=s=>document.querySelector(s), E=window.Engine, AI=window.AI, R=window.Render;
const canvas=$('#board'), g=canvas.getContext('2d');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const MAPNAME=id=>MAPS.find(m=>m.id===id).name;
const coName=n=>COS[n-1].name;
const UN=t=>UNITS[t].name;
const won=n=>n.toLocaleString('ko-KR');

/* ---------- 화면 전환과 탭 ---------- */
$('#theme').onclick=()=>{const dark=document.documentElement.dataset.theme!=='dark';document.documentElement.dataset.theme=dark?'dark':'light';$('#theme').setAttribute('aria-pressed',String(dark));};
let tab='play';
document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{
  tab=b.dataset.tab;
  document.querySelectorAll('[data-tab]').forEach(x=>{x.classList.toggle('active',x===b);if(x===b)x.setAttribute('aria-current','page');else x.removeAttribute('aria-current');});
  document.querySelectorAll('.tab-panel').forEach(p=>p.hidden=p.id!=='tab-'+tab);
  if(tab==='play'){ fit(); if(S) $('#board-wrap').focus({preventScroll:true}); }
});
$('.brand').onclick=e=>{e.preventDefault();document.querySelector('[data-tab=play]').click();scrollTo({top:0,behavior:'smooth'});};

/* ---------- 규칙 문서 표 ---------- */
$('#co-grid').innerHTML=COS.map(c=>`<article><h4>${c.id} · ${c.name}<small>${c.role}</small></h4><p>${c.passive}</p><p><b>${c.cop.name}</b> ${'★'.repeat(c.cop.stars)} · ${c.cop.text}</p><p><b>${c.scop.name}</b> ${'★'.repeat(c.scop.stars)} · ${c.scop.text}</p><q>“${c.line}”</q></article>`).join('');
const MT={foot:'보병',mech:'기계화',tread:'궤도',tire:'바퀴',air:'항공',ship:'함선',lander:'수송함'};
$('#unit-table').innerHTML='<thead><tr><th>병종</th><th>가격</th><th>이동</th><th>이동 유형</th><th>연료</th><th>탄약</th><th>사거리</th><th>생산</th></tr></thead><tbody>'+
  UNIT_ORDER.map(t=>{const d=UNITS[t];const where=Object.keys(BUILD).find(k=>BUILD[k].includes(t));return `<tr><td>${d.name}</td><td>${won(d.cost)}</td><td>${d.move}</td><td>${MT[d.mt]}</td><td>${d.fuel}${d.daily?` (−${d.daily}/일)`:''}</td><td>${d.ammo||'—'}</td><td>${d.range?(d.range[0]===d.range[1]?d.range[0]:d.range.join('~')):'—'}</td><td>${{factory:'공장',airport:'공항',port:'항구'}[where]}</td></tr>`;}).join('')+'</tbody>';

/* ---------- 동현랭 편집기(동현랭 시리즈와 같은 모양) ---------- */
for(const ex of examples){const o=document.createElement('option');o.value=ex.id;o.textContent=ex.title;$('#example').append(o);}
const DH_TOKEN=/(ㅋㅋ.*$)|(나는 동현이냐\?|동현이구나)|(오겡끼데스까)|(신중동역|신중동|뭉치)|(뿡뿡뿡|뿡뿡|포동이)|(꽥꽥)|(동+현아)|(동+현)|(도오*옹)|(ㅠ+)|(뚱띠|또치)/g;
const DH_CLS=[null,'t-cmt','t-frame','t-halt','t-ctl','t-out','t-in','t-assign','t-var','t-num','t-minus','t-op'];
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
function dhLine(line){let html='',last=0;line.replace(DH_TOKEN,(m,...gr)=>{const idx=gr[gr.length-2];html+=esc(line.slice(last,idx));const k=gr.slice(0,11).findIndex(x=>x!==undefined)+1;html+=`<span class="${DH_CLS[k]}">${esc(m)}</span>`;last=idx+m.length;return m;});return html+esc(line.slice(last));}
const code=$('#code'), area=document.createElement('div'), hl=document.createElement('div');
area.className='code-area'; hl.id='hl'; hl.setAttribute('aria-hidden','true'); code.parentNode.insertBefore(area,code); area.append(hl,code);
function hlSync(){hl.scrollTop=code.scrollTop;hl.scrollLeft=code.scrollLeft;}
function hlMetrics(){const cs=getComputedStyle(code);for(const p of ['paddingTop','paddingRight','paddingBottom','paddingLeft','fontFamily','fontSize','lineHeight','tabSize','letterSpacing'])hl.style[p]=cs[p];}
function highlight(){hlMetrics();hl.innerHTML=code.value.split('\n').map(l=>`<span class="ln">${dhLine(l)||' '}</span>`).join('')+'<span class="ln"> </span>';hlSync();}
code.addEventListener('scroll',()=>{hlSync();$('#lines').scrollTop=code.scrollTop;});addEventListener('resize',()=>{highlight();fit();});
function indent(){
  const text=code.value,lines=text.split('\n'),lead=l=>l.length-l.replace(/^[ \t]+/,'').length;
  const next=lines.map(l=>{const b=l.slice(lead(l));if(!b)return '';if(b.startsWith('ㅋㅋ'))return '   '+b;const s=b.split('~')[0].replace(/ㅋㅋ.*$/,'').trim();return (s==='나는 동현이냐?'||s==='동현이구나'?'':'  ')+b;});
  const {selectionStart:a,selectionEnd:b,selectionDirection:dir,scrollTop:y,scrollLeft:x}=code;
  const moved=p=>{let o=0,n=0;for(let i=0;i<lines.length;i++){const L=lines[i].length;if(p<=o+L){const c=p-o,ol=lead(lines[i]),nl=lead(next[i]);return n+Math.min(next[i].length,c<ol?nl:c-ol+nl);}o+=L+1;n+=next[i].length+1;}return n;};
  const value=next.join('\n'),na=moved(a),nb=moved(b);if(value===text&&na===a&&nb===b)return;if(value!==text)code.value=value;code.setSelectionRange(na,nb,dir);code.scrollTop=y;code.scrollLeft=x;
}
function codeChanged(e){if(!e?.isComposing)indent();const n=code.value.split('\n').length;$('#line-count').textContent=n+'줄';$('#lines').textContent=Array.from({length:n},(_,i)=>i+1).join('\n');highlight();}
code.addEventListener('compositionend',()=>codeChanged());
code.oninput=codeChanged;
code.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key==='Enter'){e.preventDefault();sortie();}});
function selectExample(){const ex=examples.find(e=>e.id===$('#example').value);code.value=ex.code;$('#example-note').textContent=ex.note;codeChanged();}
$('#example').onchange=selectExample; selectExample();
$('#save').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([code.value+'\n'],{type:'text/plain;charset=utf-8'}));a.download='sortie.dh';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);};
$('#open').onchange=async e=>{const f=e.target.files[0];if(!f)return;code.value=(await f.text()).replace(/\r/g,'').replace(/\n$/,'');codeChanged();e.target.value='';};
$('#run').onclick=()=>sortie();

/* ---------- 출전 규약 ---------- */
const DEFAULT={map:1,co1:1,co2:1,first:1,funds:0,seed:0};
let cfg={...DEFAULT};
function parseSortie(out){
  const tok=out.split(/\s+/).filter(Boolean).map(Number), c={...DEFAULT}, err=[];
  let go=false;
  const rule={1:['지도','map',v=>v>=1&&v<=MAPS.length,'1~'+MAPS.length],2:['나의 지휘관','co1',v=>v>=1&&v<=5,'1~5'],3:['CPU 지휘관','co2',v=>v>=1&&v<=5,'1~5'],
    4:['선공','first',v=>v===1||v===2,'1 또는 2'],5:['시작 자금','funds',v=>v>=0&&v<=30000&&v%1000===0,'0~30000, 1000 단위'],7:['난수 시드','seed',v=>v>=1&&v<=2147483646,'1~2147483646']};
  for(let i=0;i<tok.length;i++){
    const n=tok[i];
    if(go){ err.push(`출전 명령 6 뒤에 ${tok.length-i}개의 정수가 더 나왔다. 6은 마지막에 출력하자.`); break; }
    if(n===6){ go=true; continue; }
    const r=rule[n];
    if(!r){ err.push(`${i+1}번째 정수 ${n}은 출전 명령이 아니다. 명령은 1~7이다.`); break; }
    if(i+1>=tok.length){ err.push(`명령 ${n}(${r[0]}) 뒤에 값이 없다.`); break; }
    const v=tok[++i];
    if(!r[2](v)){ err.push(`${r[0]} 값 ${v}은 쓸 수 없다. ${r[3]}만 된다.`); break; }
    c[r[1]]=v;
  }
  return {c,go,err};
}
function sortieCard(c){
  $('#sortie-card').innerHTML=[['지도',`${c.map} · ${MAPNAME(c.map)}`],['나의 지휘관',`${c.co1} · ${coName(c.co1)}`],['CPU',`${c.co2} · ${coName(c.co2)}`],
    ['선공',c.first===1?'나':'CPU'],['시작 자금',won(c.funds)],['난이도 · 안개','보통 · 없음']].map(([a,b])=>`<div><span>${a}</span><strong>${b}</strong></div>`).join('');
}
function result(text,kind){ const r=$('#result'); r.textContent=text; r.dataset.kind=kind||''; }
function sortie(){
  if(S) return;
  let out;
  try{ const r=Donghyun.run(code.value,{maxSteps:300000}); out=r.output; if(r.halted && !out.trim()){} }
  catch(e){ result(`동현랭 오류${e.line?` (${e.line}줄)`:''}: ${e.message}`,'error'); status('동현랭 오류','error'); return; }
  const p=parseSortie(out);
  if(p.err.length){ result('출전 규약 오류: '+p.err[0],'error'); status('출전 규약 오류','error'); return; }
  cfg=p.c; sortieCard(cfg); preview(cfg);
  if(!p.go){ result(`설정을 읽었다(${MAPNAME(cfg.map)} · ${coName(cfg.co1)} 대 ${coName(cfg.co2)}). 출전 명령 6을 마지막에 출력하면 전장에 나간다.`); status('설정만 읽음'); return; }
  startGame(cfg);
}
function status(t,kind){ const s=$('#status'); s.textContent=t; s.dataset.kind=kind||''; }

/* ---------- 상태 ---------- */
let S=null, mode='setup', ui={cursor:null,fx:[],terrainVer:0}, sel=null, orig=null, reachR=null, menu=null, tgt=null, spots=null, busy=false, fast=false, committed=false, info=null;
let previewS=null;
function preview(c){ previewS=E.newGame({map:c.map,co1:c.co1,co2:c.co2,first:1,funds:0,seed:1}); previewS.units=[]; ui={cursor:null,fx:[],terrainVer:(ui.terrainVer||0)+1}; size(previewS); $('#day').textContent=MAPNAME(c.map); $('#turn-badge').textContent=''; $('#turn-badge').className=''; $('#tile-info').textContent=MAPS.find(m=>m.id===c.map).note; }
function size(s){ canvas.width=s.map.W*R.T; canvas.height=s.map.H*R.T+R.PAD; fit(); }
function fit(){
  const st=canvas.parentElement, w=st.clientWidth; if(!w||!canvas.width) return;
  // 화면 높이에 맞춰 너무 커지지 않게 한다(가로 기준 비율 유지)
  const maxH=Math.max(260,innerHeight-230), byH=maxH*canvas.width/canvas.height;
  canvas.style.width=Math.min(w,byH)+'px'; canvas.style.margin='0 auto';
}
function frame(now){
  const s=S||previewS;
  if(s){ g.clearRect(0,0,canvas.width,canvas.height); R.draw(g,s,ui,now); }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

/* ---------- 게임 시작·종료 ---------- */
function startGame(c){
  S=E.newGame({map:c.map,co1:c.co1,co2:c.co2,first:c.first,funds:c.funds,seed:c.seed||undefined});
  S.events.length=0;
  ui={cursor:null,fx:[],terrainVer:(ui.terrainVer||0)+1}; size(S);
  const hq=findHQ(1); ui.cursor=[hq[0],hq[1]];
  $('#setup-panel').hidden=true; $('#hud').hidden=false; $('#board-wrap').classList.add('live'); $('#touchpad').classList.add('on');
  $('#log').innerHTML=''; log(`${MAPNAME(c.map)} · ${coName(c.co1)} 대 ${coName(c.co2)} · 출전.`,0);
  fit(); $('#board-wrap').focus({preventScroll:true}); $('#board-wrap').scrollIntoView({block:'nearest',behavior:reduced?'auto':'smooth'});
  mode='idle'; hud();
  beginTurn();
}
function findHQ(p){ for(let y=0;y<S.map.H;y++) for(let x=0;x<S.map.W;x++){ const t=S.map.grid[y][x]; if(t.t==='hq'&&t.owner===p) return [x,y]; } return [0,0]; }
function backToSetup(){
  S=null; mode='setup'; closeMenu(); $('#result-card').hidden=true; $('#banner').hidden=true;
  $('#setup-panel').hidden=false; $('#hud').hidden=true; $('#board-wrap').classList.remove('live'); $('#touchpad').classList.remove('on');
  preview(cfg); renderSlotList(); status('출전 준비'); result('다시 출전하려면 코드를 고치거나 그대로 출전을 누르자.'); $('#hint').textContent='X 확인 · Z 취소 · Enter 메뉴';
}
$('#concede').onclick=()=>{ if(!S||S.winner||mode==='cpu') return; confirmMenu('항복하고 출전 준비로 돌아갈까?',[['항복한다',()=>{E.concede(S,1);finishCheck();}],['계속 싸운다',()=>{}]]); };
async function banner(text,sub,cls,ms=950){
  const b=$('#banner'); b.className='banner '+(cls||''); b.innerHTML=esc(text)+(sub?`<small>${esc(sub)}</small>`:''); b.hidden=false;
  await sleep(reduced||fast?Math.min(ms,350):ms); b.hidden=true;
}
async function beginTurn(){
  busy=true; processEvents(); $('#hint').textContent='X 확인 · Z 취소 · Enter 메뉴';
  const p=S.turn; if(p===2) mode='cpu'; hud();
  await banner(`${S.day}일째 · ${p===1?'나의 차례':'CPU 차례'}`,`${coName(S.players[p].co)} · 자금 ${won(S.players[p].funds)}`,'p'+p);
  busy=false;
  if(finishCheck()) return;
  if(p===2) runCPU(); else { mode='idle'; const r=E.readyUnits(S,1); if(r.length){} hud(); }
}
function finishCheck(){
  if(!S||!S.winner) return false;
  processEvents(); mode='over'; closeMenu(); hud();
  const win=S.winner===1, P=S.players;
  const card=$('#result-card');
  card.innerHTML=`<div><h3>${win?'승리':'패배'}</h3><p>${S.day}일째 · ${esc(S.reason)}${win?' · 붉은 진영이 이겼다.':' · 푸른 진영이 이겼다.'}</p>
  <dl><dt></dt><dt>나</dt><dt>CPU</dt><dt>만든 유닛</dt><dd>${P[1].built}</dd><dd>${P[2].built}</dd><dt>무찌른 유닛</dt><dd>${P[1].kills}</dd><dd>${P[2].kills}</dd><dt>잃은 유닛</dt><dd>${P[1].lost}</dd><dd>${P[2].lost}</dd><dt>거점</dt><dd>${E.propsOf(S,1)}</dd><dd>${E.propsOf(S,2)}</dd></dl>
  <button id="again">출전 준비로 <kbd>X</kbd></button></div>`;
  card.hidden=false; $('#again').onclick=backToSetup;
  status(win?'승리':'패배'); log(`${win?'승리':'패배'} · ${S.reason}`,0);
  return true;
}

/* ---------- 기록과 효과 ---------- */
function log(html,p){ const li=document.createElement('li'); li.className=p?'p'+p:''; li.innerHTML=html; const l=$('#log'); l.prepend(li); while(l.children.length>80) l.lastChild.remove(); }
const side=p=>p===1?'나':'CPU';
const TN=t=>TERRAIN[t].name;
function processEvents(){
  if(!S) return; const now=performance.now();
  for(const e of S.events){
    if(e.k==='attack'){ log(`<b>${UN(e.at)}</b> → ${UN(e.dt)} ${e.dmg}%${e.counter?` · 반격 ${e.counter}%`:''}`,e.ao);
      ui.fx.push({k:'hit',x:e.dx,y:e.dy,t0:now,dur:420},{k:'num',x:e.dx,y:e.dy,t0:now,dur:900,text:'-'+e.dmg,col:'#ffe27a'});
      if(e.counter) ui.fx.push({k:'hit',x:e.ax,y:e.ay,t0:now+260,dur:420},{k:'num',x:e.ax,y:e.ay,t0:now+260,dur:900,text:'-'+e.counter,col:'#ffb0a0'}); }
    else if(e.k==='destroy'){ log(`${side(e.owner)}의 <b>${UN(e.type)}</b> 격파`,3-e.owner); ui.fx.push({k:'boom',x:e.x,y:e.y,t0:now+120,dur:650}); }
    else if(e.k==='crash'){ log(`${side(e.owner)}의 <b>${UN(e.type)}</b> 연료가 떨어져 사라졌다`,e.owner); }
    else if(e.k==='capture'){ log(e.done?`<b>${UN(e.type)}</b> ${TN(e.tt)} 점령 완료`:`<b>${UN(e.type)}</b> ${TN(e.tt)} 점령 중 · 남은 ${e.left}`,e.owner); if(e.done) ui.terrainVer++; }
    else if(e.k==='build'){ log(`<b>${UN(e.type)}</b> 생산`,e.owner); }
    else if(e.k==='power'){ log(`<b>${coName(S.players[e.p].co)}</b> · ${e.name}`,e.p); ui.fx.push({k:'power',x:0,y:0,t0:now,dur:900}); }
    else if(e.k==='load'){ log(`<b>${UN(e.type)}</b> ${UN(e.into)}에 탑승`,e.owner); }
    else if(e.k==='unload'){ log(`<b>${UN(e.type)}</b> 하차`,e.owner); }
    else if(e.k==='join'){ log(`<b>${UN(e.type)}</b> 합류`,e.owner); }
    else if(e.k==='turn'){ log(`${e.day}일째 · ${side(e.p)} 차례 · 수입 ${won(e.income)}`,e.p); }
  }
  S.events.length=0;
}

/* ---------- 정보 표시 ---------- */
function stars(P,co){ const max=co.scop.stars, have=P.meter/STAR_VALUE; let h='';
  for(let i=0;i<max;i++){ const on=have>=i+1; h+=`<i class="${on?'on':''} ${i>=co.cop.stars?'big':''}" title="${i+1}"></i>`; } return h; }
function hud(){
  if(!S) return;
  $('#co-cards').innerHTML=[1,2].map(p=>{const P=S.players[p], co=COS[P.co-1], n=S.units.filter(u=>u.owner===p).length;
    return `<div class="co-card p${p} ${S.turn===p&&!S.winner?'turn':''}"><div class="who"><span>${p===1?'나 · 붉은 진영':'CPU · 푸른 진영'}</span><span>${S.turn===p?'차례':''}</span></div>
    <div class="nm"><span class="co-face">${co.name[0]}</span><div><strong>${co.name}</strong><small>${co.role}</small></div></div>
    <dl><dt>자금</dt><dd>${won(P.funds)}</dd><dt>거점</dt><dd>${E.propsOf(S,p)}</dd><dt>유닛</dt><dd>${n}</dd></dl>
    <div class="stars" aria-label="지휘관 능력 별 ${Math.floor(P.meter/STAR_VALUE)}개">${stars(P,co)}</div>
    ${P.power?`<span class="power-tag">${P.power===2?co.scop.name:co.cop.name} 사용 중</span>`:''}</div>`;}).join('');
  $('#day').textContent=`${S.day}일째`;
  const tb=$('#turn-badge'); tb.textContent=S.turn===1?'나의 차례':'CPU 차례'; tb.className='p'+S.turn;
  if(!S.winner) status(mode==='cpu'||S.turn===2?'CPU가 생각하는 중':'나의 차례 · '+({idle:'유닛을 고르자',move:'갈 곳을 고르자',action:'명령을 고르자',target:'공격 대상을 고르자',unload:'내릴 곳을 고르자',menu:'메뉴',build:'생산',info:'정보'}[mode]||''));
  infoCard();
}
function infoCard(){
  const box=$('#info-card'); if(!S||!ui.cursor){ box.innerHTML=''; return; }
  if(mode==='target'&&tgt){ const t=tgt.list[tgt.i], f=E.forecast(S,sel,t,sel.x,sel.y);
    box.innerHTML=`<h3>${UN(sel.type)} → ${UN(t.type)}<small>예상</small></h3><div class="forecast"><div><span>내 공격</span><strong>${f.lo}~${f.hi}%</strong></div><div><span>상대 반격</span><strong>${f.counterMin===f.counter?f.counter:f.counterMin+'~'+f.counter}%</strong></div></div><p>상대 체력 ${Math.ceil(t.hp/10)} · ${TN(S.map.grid[t.y][t.x].t)} ★${UNITS[t.type].mt==='air'?0:TERRAIN[S.map.grid[t.y][t.x].t].def}. 운에 따라 범위 안에서 정해진다.</p>`;
    $('#tile-info').textContent=`예상 피해 ${f.lo}~${f.hi}% · 반격 최대 ${f.counter}%`; return; }
  const [x,y]=ui.cursor, t=S.map.grid[y][x], u=E.unitAt(S,x,y), td=TERRAIN[t.t];
  let h=`<h3>${td.name}${td.prop?` · ${t.owner?side(t.owner):'중립'}`:''}<small>방어 ★${td.def}</small></h3>`;
  if(td.prop) h+=`<div class="row"><span>점령값 <b>${t.capId?t.cp:20}</b>/20</span><span>${t.t==='hq'?'점령하면 승리':t.t==='city'?'수입 1000 · 회복':'수입 1000 · 생산'}</span></div>`;
  if(u){ const d=UNITS[u.type], r=E.rangeOf(S,u);
    h+=`<h3 style="margin-top:8px">${d.name} · ${side(u.owner)}<small>체력 ${Math.ceil(u.hp/10)}/10</small></h3><div class="row"><span>이동 <b>${E.moveOf(S,u)}</b></span><span>연료 <b>${u.fuel}</b>/${d.fuel}</span><span>탄약 <b>${d.ammo?u.ammo+'/'+d.ammo:'—'}</b></span><span>사거리 <b>${r?(r[0]===r[1]?r[0]:r.join('~')):'—'}</b></span>${u.cargo.length?`<span>탑재 <b>${u.cargo.map(c=>UN(c.type)).join(', ')}</b></span>`:''}${u.dived?'<span><b>잠항 중</b></span>':''}</div>`;
    if(u.owner===1&&S.turn===1&&mode==='idle') h+=`<p>${u.done?'이번 차례에 행동을 마쳤다.':'X로 고르면 이동 범위가 보인다.'}</p>`;
  } else if(mode==='idle'&&S.turn===1){ const b=E.canBuildAt(S,1,x,y); h+=`<p>${b.length?'X로 생산 메뉴를 연다.':'Enter로 메뉴(지휘관 능력 · 턴 종료)를 연다.'}</p>`; }
  box.innerHTML=h;
  $('#tile-info').textContent=`${td.name} ★${td.def}${u?` · ${UNITS[u.type].name} ${Math.ceil(u.hp/10)}`:''}`;
}

/* ---------- 메뉴 ---------- */
function openMenu(title,items,onCancel){
  menu={title,items,i:Math.max(0,items.findIndex(it=>!it.off)),onCancel};
  drawMenu(); hud();
}
function drawMenu(){
  const m=$('#menu'); if(!menu){ m.hidden=true; return; }
  m.innerHTML=(menu.title?`<h4>${esc(menu.title)}</h4>`:'')+menu.items.map((it,i)=>`<div class="mi ${i===menu.i?'sel':''} ${it.off?'off':''}" role="menuitem" data-i="${i}"><span>${esc(it.label)}</span>${it.note?`<small>${esc(it.note)}</small>`:''}</div>`).join('');
  m.hidden=false;
  const right=ui.cursor && ui.cursor[0] < S.map.W/2;
  m.style.left=right?'auto':'8px'; m.style.right=right?'8px':'auto'; m.style.top='8px';
  m.querySelectorAll('.mi').forEach(el=>el.onclick=()=>{menu.i=+el.dataset.i;drawMenu();key('z');});
  m.querySelector('.sel')?.scrollIntoView({block:'nearest'});
}
function closeMenu(){ menu=null; $('#menu').hidden=true; }
function confirmMenu(q,opts){ const prev=mode; mode='menu'; openMenu(q,opts.map(([label,fn])=>({label,fn:()=>{closeMenu();mode=prev==='menu'?'idle':prev;fn();hud();}})),()=>{mode=prev==='menu'?'idle':prev;}); }
function mainMenu(){
  const P=S.players[1], co=COS[P.co-1], items=[];
  if(!P.power){
    items.push({label:co.cop.name,note:'★'.repeat(co.cop.stars),off:P.meter<co.cop.stars*STAR_VALUE,fn:()=>usePower(1)});
    items.push({label:co.scop.name,note:'★'.repeat(co.scop.stars),off:P.meter<co.scop.stars*STAR_VALUE,fn:()=>usePower(2)});
  }
  items.push({label:'턴 종료',fn:endTurnAsk});
  items.push({label:'저장',fn:saveMenu});
  items.push({label:'불러오기',fn:loadMenu});
  items.push({label:'항복',fn:()=>$('#concede').click()});
  mode='menu'; openMenu(`${S.day}일째 · ${co.name}`,items,()=>{mode='idle';});
}

/* ---------- 저장 · 불러오기 ----------
   판 전체(지도 점령 상태·유닛·자금·별·날짜·차례·난수 상태)를 JSON으로 옮긴다.
   수송 유닛의 cargo는 유닛 객체를 직접 가리키므로 id로 바꿔 저장하고, 불러올 때 다시 잇는다. */
const SAVE_FORMAT='donghyun-jeon-save', SAVE_VERSION=1, SLOT_KEY=n=>'donghyun-jeon:slot'+n, SLOTS=3;
function snapshot(){
  const state=JSON.parse(JSON.stringify(S,(k,v)=>k==='cargo'?v.map(c=>c.id):(k==='events'?[]:v)));
  const logs=[...$('#log').children].reverse().map(li=>({c:li.className,h:li.innerHTML}));
  return {format:SAVE_FORMAT,version:SAVE_VERSION,savedAt:new Date().toISOString(),
    summary:{map:S.map.id,mapName:MAPNAME(S.map.id),day:S.day,co1:coName(S.players[1].co),co2:coName(S.players[2].co)},state,logs};
}
function restore(data){
  if(!data||data.format!==SAVE_FORMAT) throw new Error('동현전 저장 파일이 아니다.');
  if(data.version!==SAVE_VERSION) throw new Error('지원하지 않는 저장 형식 버전이다('+data.version+').');
  const st=data.state, m=MAPS.find(m=>m.id===st?.map?.id);
  if(!m||st.map.W!==m.W||st.map.H!==m.H||!Array.isArray(st.map.grid)||st.map.grid.length!==m.H) throw new Error('지도 정보가 맞지 않는다.');
  if(!Array.isArray(st.units)||st.units.some(u=>!UNITS[u.type])) throw new Error('유닛 정보가 맞지 않는다.');
  if(!st.players||!st.players[1]||!st.players[2]||!COS[st.players[1].co-1]||!COS[st.players[2].co-1]) throw new Error('지휘관 정보가 맞지 않는다.');
  if(st.winner) throw new Error('이미 끝난 판이다.');
  const byId=new Map(st.units.map(u=>[u.id,u]));
  for(const u of st.units){ u.cargo=(u.cargo||[]).map(id=>byId.get(id)).filter(Boolean); }
  st.events=[];
  closeMenu(); $('#result-card').hidden=true; $('#banner').hidden=true; clearSel();
  S=st; ui={cursor:null,fx:[],terrainVer:(ui.terrainVer||0)+1}; size(S);
  const hq=findHQ(1); ui.cursor=[hq[0],hq[1]];
  $('#setup-panel').hidden=true; $('#hud').hidden=false; $('#board-wrap').classList.add('live'); $('#touchpad').classList.add('on');
  const l=$('#log'); l.innerHTML=''; for(const e of (data.logs||[]).slice(-79)){ const li=document.createElement('li'); li.className=String(e.c||'').replace(/[^a-z0-9 ]/gi,''); li.innerHTML=String(e.h||''); l.prepend(li); }
  log(`${S.day}일째 판을 불러왔다.`,0);
  fit(); $('#board-wrap').focus({preventScroll:true});
  busy=false; fast=false; mode='idle'; $('#hint').textContent='X 확인 · Z 취소 · Enter 메뉴'; hud();
  if(S.turn===2) runCPU();
}
function readSlot(n){ try{ const t=localStorage.getItem(SLOT_KEY(n)); return t?JSON.parse(t):null; }catch(e){ return null; } }
function slotNote(d){ if(!d) return '비어 있음'; const t=new Date(d.savedAt); const pad=v=>String(v).padStart(2,'0');
  return `${d.summary.mapName} · ${d.summary.day}일째 · ${t.getMonth()+1}/${t.getDate()} ${pad(t.getHours())}:${pad(t.getMinutes())}`; }
function toast(t){ log(t,0); status(t); }
function saveToSlot(n){
  try{ localStorage.setItem(SLOT_KEY(n),JSON.stringify(snapshot())); toast(`브라우저 칸 ${n}에 저장했다.`); }
  catch(e){ toast('브라우저 저장에 실패했다. 파일로 내려받아 저장하자.'); }
}
function saveToFile(){
  const d=snapshot(), a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([JSON.stringify(d)],{type:'application/json'}));
  a.download=`donghyun-jeon-map${d.summary.map}-day${d.summary.day}.dhsave`; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  toast('저장 파일을 내려받았다.');
}
function saveMenu(){
  const items=[];
  for(let n=1;n<=SLOTS;n++){ const d=readSlot(n);
    items.push({label:`브라우저 칸 ${n}`,note:slotNote(d),fn:()=>{ if(d) confirmMenu(`칸 ${n}에 덮어쓸까?`,[['덮어쓴다',()=>saveToSlot(n)],['그만둔다',()=>{}]]); else { closeMenu(); mode='idle'; saveToSlot(n); hud(); } }}); }
  items.push({label:'파일로 내려받기',note:'.dhsave',fn:()=>{ closeMenu(); mode='idle'; saveToFile(); hud(); }});
  mode='menu'; openMenu('저장',items,()=>{ mainMenu(); return false; });
}
function loadFrom(d){ try{ restore(d); }catch(e){ const msg='불러오기 실패: '+e.message; if(S){ toast(msg); } else { result(msg,'error'); status('불러오기 실패','error'); } } }
function loadMenu(){
  const items=[];
  for(let n=1;n<=SLOTS;n++){ const d=readSlot(n);
    items.push({label:`브라우저 칸 ${n}`,note:slotNote(d),off:!d,fn:()=>confirmMenu('지금 판을 버리고 불러올까?',[['불러온다',()=>loadFrom(readSlot(n))],['그만둔다',()=>{}]])}); }
  items.push({label:'파일에서 불러오기',note:'.dhsave',fn:()=>{ closeMenu(); mode='idle'; hud(); $('#load-file').click(); }});
  mode='menu'; openMenu('불러오기',items,()=>{ mainMenu(); return false; });
}
$('#load-file').onchange=async e=>{ const f=e.target.files[0]; e.target.value=''; if(!f) return;
  try{ loadFrom(JSON.parse(await f.text())); }catch(err){ loadFrom(null); } };
$('#load-file-setup').onchange=$('#load-file').onchange;
document.querySelector('.load-head label').addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); $('#load-file-setup').click(); } });
function renderSlotList(){
  const box=$('#slot-list'); box.innerHTML='';
  for(let n=1;n<=SLOTS;n++){ const d=readSlot(n); const b=document.createElement('button'); b.className='slot-btn'; b.disabled=!d;
    b.innerHTML=`<b>칸 ${n}</b><span>${esc(slotNote(d))}</span>${d?`<small>${esc(d.summary.co1)} 대 ${esc(d.summary.co2)}</small>`:''}`;
    b.onclick=()=>loadFrom(readSlot(n)); box.append(b); }
}
async function usePower(level){
  closeMenu(); mode='idle';
  if(!E.usePower(S,1,level)) return;
  const co=COS[S.players[1].co-1], p=level===2?co.scop:co.cop;
  busy=true; processEvents(); hud(); await banner(`${co.name} · ${p.name}`,p.text,'power',1100); busy=false; hud();
}
function endTurnAsk(){
  closeMenu(); const n=E.readyUnits(S,1).length;
  if(n) confirmMenu(`아직 움직이지 않은 유닛이 ${n}개다. 턴을 끝낼까?`,[['턴을 끝낸다',endTurn],['돌아간다',()=>{}]]);
  else endTurn();
}
function endTurn(){ mode='idle'; clearSel(); E.endTurn(S); hud(); beginTurn(); }
function buildMenu(x,y){
  const P=S.players[1], list=E.canBuildAt(S,1,x,y);
  mode='build';
  openMenu(`${TN(S.map.grid[y][x].t)} · 자금 ${won(P.funds)}`,list.map(t=>{const pr=E.priceOf(S,1,t);return {label:UN(t),note:won(pr),off:pr>P.funds,type:t,fn:()=>{closeMenu();mode='idle';E.build(S,1,x,y,t);processEvents();hud();}};}),()=>{mode='idle';});
}

/* ---------- 유닛 조작 ---------- */
function clearSel(){ sel=null; orig=null; reachR=null; tgt=null; spots=null; committed=false; ui.moveSet=null; ui.atkSet=null; ui.path=null; ui.spots=null; }
function rangeTiles(u){
  const set=new Set(), r=E.rangeOf(S,u); if(!r) return set;
  if(UNITS[u.type].indirect){ for(let y=0;y<S.map.H;y++) for(let x=0;x<S.map.W;x++){ const d=E.dist(x,y,u.x,u.y); if(d>=r[0]&&d<=r[1]) set.add(E.key(x,y)); } }
  else { const R2=E.reach(S,u); for(const k of R2.dist.keys()){ const x=k%1000,y=Math.floor(k/1000); for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){ const nx=x+dx,ny=y+dy; if(nx>=0&&ny>=0&&nx<S.map.W&&ny<S.map.H) set.add(E.key(nx,ny)); } } }
  return set;
}
function select(u){
  sel=u; orig={x:u.x,y:u.y}; reachR=E.reach(S,u); mode='move';
  ui.moveSet=new Set([...reachR.dist.keys()]); ui.atkSet=null; ui.path=[[u.x,u.y]]; hud();
}
function updatePath(){
  if(mode!=='move') return; const [x,y]=ui.cursor;
  ui.path=reachR.dist.has(E.key(x,y))?E.pathTo(reachR,orig.x,orig.y,x,y):null;
}
async function moveTo(){
  const [x,y]=ui.cursor; if(!reachR.dist.has(E.key(x,y))||!E.stopOK(S,sel,x,y)) return;
  const path=E.pathTo(reachR,orig.x,orig.y,x,y);
  busy=true; ui.moveSet=null; ui.path=null;
  if(path.length>1){ ui.anim={id:sel.id,path,t0:performance.now(),dur:(reduced?20:70)*(path.length-1)}; await sleep(ui.anim.dur); ui.anim=null; }
  sel.x=x; sel.y=y; busy=false; actionMenu();
}
function actionMenu(){
  const u=sel, moved=u.x!==orig.x||u.y!==orig.y, t=S.map.grid[u.y][u.x], d=UNITS[u.type];
  const o=S.units.find(v=>v!==u&&!v.carried&&v.x===u.x&&v.y===u.y);
  const items=[];
  if(o){ if(E.canJoin(S,u,o)) items.push({label:'합류',fn:()=>act('join',o)}); if(E.canLoad(S,u,o)) items.push({label:'탑승',fn:()=>act('load',o)}); }
  else {
    if(!committed){
      if(E.targetsFrom(S,u,u.x,u.y,moved).length) items.push({label:'공격',fn:startTarget});
      if(d.cap && TERRAIN[t.t].prop && t.owner!==1) items.push({label:'점령',note:`남은 ${t.capId===u.id?t.cp:20}`,fn:()=>act('capture')});
      if(d.supply && S.units.some(v=>v.owner===1&&v!==u&&!v.carried&&E.dist(v.x,v.y,u.x,u.y)===1)) items.push({label:'보급',fn:()=>act('supply')});
      if(d.dive) items.push({label:u.dived?'부상':'잠항',fn:()=>act('dive')});
    }
    if(u.cargo.length && u.cargo.some(c=>E.unloadSpots(S,u,c).length)) items.push({label:'하차',fn:startUnload});
    items.push({label:'대기',fn:()=>act('wait')});
  }
  mode='action'; ui.cursor=[u.x,u.y];
  openMenu(UN(u.type),items,()=>{ if(committed) return false; sel.x=orig.x; sel.y=orig.y; select(sel); ui.cursor=[...ui.cursor]; updatePath(); });
}
function commit(){
  if(committed) return; committed=true;
  const dx=sel.x,dy=sel.y,cost=reachR.dist.get(E.key(dx,dy))||0; sel.x=orig.x; sel.y=orig.y; E.commitMove(S,sel,dx,dy,cost);
}
function act(kind,o){
  closeMenu(); commit(); const u=sel;
  if(kind==='join') E.join(S,u,o);
  else if(kind==='load') E.load(S,u,o);
  else if(kind==='capture') E.capture(S,u);
  else if(kind==='supply'){ const n=E.supplyAround(S,u); log(`<b>${UN(u.type)}</b> 이웃 ${n}개 유닛 보급`,1); }
  else if(kind==='dive'){ u.dived=!u.dived; log(`<b>${UN(u.type)}</b> ${u.dived?'잠항':'부상'}`,1); }
  if(S.units.includes(u)) u.done=true;
  done();
}
function done(){ processEvents(); const last=sel; clearSel(); mode='idle'; if(finishCheck()) return; hud(); if(!E.readyUnits(S,1).length) $('#hint').textContent='모든 유닛이 움직였다 · Enter로 턴 종료'; }
function startTarget(){
  closeMenu(); const moved=sel.x!==orig.x||sel.y!==orig.y;
  const list=E.targetsFrom(S,sel,sel.x,sel.y,moved); tgt={list,i:0}; mode='target';
  ui.atkSet=new Set(list.map(t=>E.key(t.x,t.y))); ui.cursor=[list[0].x,list[0].y]; hud();
}
async function fire(){
  const t=tgt.list[tgt.i]; commit(); ui.atkSet=null; tgt=null; busy=true;
  E.attack(S,sel,t); if(S.units.includes(sel)) sel.done=true; processEvents(); hud();
  await sleep(reduced?100:520); busy=false; done();
}
function startUnload(){
  closeMenu(); const can=sel.cargo.filter(c=>E.unloadSpots(S,sel,c).length);
  const pick=c=>{ closeMenu(); spots={c,list:E.unloadSpots(S,sel,c),i:0}; mode='unload'; ui.spots=spots.list; ui.cursor=[...spots.list[0]]; hud(); };
  if(can.length===1) pick(can[0]);
  else { mode='menu'; openMenu('누구를 내릴까',can.map(c=>({label:UN(c.type),note:'체력 '+Math.ceil(c.hp/10),fn:()=>pick(c)})),()=>{mode='action';actionMenu();}); }
}
function doUnload(){
  commit(); const [x,y]=spots.list[spots.i]; E.unload(S,sel,spots.c,x,y); processEvents(); spots=null; ui.spots=null;
  sel.done=true;
  if(sel.cargo.some(c=>E.unloadSpots(S,sel,c).length)) actionMenu(); else done();
}
function showInfo(){
  const [x,y]=ui.cursor, u=E.unitAt(S,x,y); if(!u) return;
  const d=UNITS[u.type], bs=[];
  for(const t of UNIT_ORDER){ const w=DMG[u.type]; const i=UNIT_ORDER.indexOf(t); const v=(w.pri&&w.pri[i]!=null&&u.ammo>0)?w.pri[i]:(w.sec&&w.sec[i]!=null?w.sec[i]:null); if(v!=null) bs.push([t,v]); }
  bs.sort((a,b)=>b[1]-a[1]);
  mode='info'; info=true;
  openMenu(`${d.name} · ${side(u.owner)} · ${won(d.cost)}`,[{label:`이동 ${E.moveOf(S,u)} (${MT[d.mt]}) · 연료 ${u.fuel}/${d.fuel}`},{label:`탄약 ${d.ammo?u.ammo+'/'+d.ammo:'—'} · 사거리 ${(r=>r?(r[0]===r[1]?r[0]:r.join('~')):'—')(E.rangeOf(S,u))}`},
    ...(bs.length?bs.slice(0,6).map(([t,v])=>({label:'기본 피해 → '+UN(t),note:v+'%'})):[{label:'공격할 수 없다'}])],()=>{mode='idle';info=null;});
}

/* ---------- CPU 차례 ---------- */
async function runCPU(){
  mode='cpu'; hud(); let guard=0;
  const wait=ms=>sleep(fast?ms/5:ms);
  while(S && !S.winner && S.turn===2 && guard++<400){
    const a=AI.next(S);
    if(a.k==='end'){ AI.apply(S,a); break; }
    if(a.k==='power'){ AI.apply(S,a); const co=COS[S.players[2].co-1], p=a.level===2?co.scop:co.cop; processEvents(); hud(); await banner(`CPU ${co.name} · ${p.name}`,p.text,'power',1000); continue; }
    if(a.k==='build'){ ui.cursor=[a.x,a.y]; hud(); await wait(220); AI.apply(S,a); processEvents(); hud(); await wait(160); continue; }
    if(a.k==='move'){
      const u=S.units.find(v=>v.id===a.id); ui.cursor=[u.x,u.y]; hud(); await wait(240);
      if(a.path.length>1){ ui.anim={id:u.id,path:a.path,t0:performance.now(),dur:(fast||reduced?14:65)*(a.path.length-1)}; await sleep(ui.anim.dur); ui.anim=null; }
      ui.cursor=[a.x,a.y];
      AI.apply(S,a); processEvents(); hud();
      await wait(a.act==='attack'?560:a.act==='capture'?300:120);
      if(finishCheck()) return;
    }
  }
  fast=false;
  if(finishCheck()) return;
  if(S.turn===2){ E.endTurn(S); }
  const hq=findHQ(1); const first=E.readyUnits(S,1)[0]; ui.cursor=first?[first.x,first.y]:hq;
  hud(); beginTurn();
}

/* ---------- 키보드 ---------- */
const KEYMAP={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',KeyX:'z',KeyZ:'x',KeyS:'a',KeyA:'s',Enter:'enter',NumpadEnter:'enter',Space:'z'};
document.addEventListener('keydown',e=>{
  if(!S||tab!=='play') return;
  const el=document.activeElement; if(el&&(el.tagName==='TEXTAREA'||el.tagName==='SELECT'||el.tagName==='INPUT')) return;
  if(e.metaKey||e.ctrlKey||e.altKey) return;
  if(e.key==='Shift'){ if(mode==='idle'){ const u=E.unitAt(S,...ui.cursor); if(u){ ui.atkSet=rangeTiles(u); } } return; }
  const k=KEYMAP[e.code]||({x:'z',z:'x',s:'a',a:'s',X:'z',Z:'x',S:'a',A:'s'})[e.key]||(e.key==='Enter'?'enter':null)||({ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right'})[e.key];
  if(!k) return;
  e.preventDefault(); key(k);
});
document.addEventListener('keyup',e=>{ if(S&&e.key==='Shift'&&mode==='idle'){ ui.atkSet=null; } });
function key(k){
  if(!S) return;
  if(mode==='over'){ if(k==='z'||k==='enter') backToSetup(); return; }
  if(mode==='cpu'){ if(k==='x'||k==='z'){ fast=true; } return; }
  if(busy) return;
  const mv={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[k];
  if(menu){
    if(mv&&mv[1]){ const n=menu.items.length; let i=menu.i; for(let s=0;s<n;s++){ i=(i+mv[1]+n)%n; if(!menu.items[i].off||mode==='info') break; } menu.i=i; drawMenu(); }
    else if(k==='z'){ if(mode==='info'){ closeMenu(); mode='idle'; return hud(); } const it=menu.items[menu.i]; if(it&&!it.off&&it.fn) it.fn(); }
    else if(k==='x'||(k==='s'&&mode==='info')){ const cb=menu.onCancel; const keep=cb&&cb()===false; if(!keep){ closeMenu(); } hud(); }
    return;
  }
  if(mode==='target'){
    if(mv){ const n=tgt.list.length; tgt.i=(tgt.i+(mv[0]+mv[1]>0?1:-1)+n)%n; const t=tgt.list[tgt.i]; ui.cursor=[t.x,t.y]; hud(); }
    else if(k==='z') fire();
    else if(k==='x'){ tgt=null; ui.atkSet=null; actionMenu(); }
    return;
  }
  if(mode==='unload'){
    if(mv){ const n=spots.list.length; spots.i=(spots.i+(mv[0]+mv[1]>0?1:-1)+n)%n; ui.cursor=[...spots.list[spots.i]]; hud(); }
    else if(k==='z') doUnload();
    else if(k==='x'){ spots=null; ui.spots=null; actionMenu(); }
    return;
  }
  if(mv){ const [x,y]=ui.cursor; ui.cursor=[Math.max(0,Math.min(S.map.W-1,x+mv[0])),Math.max(0,Math.min(S.map.H-1,y+mv[1]))]; if(mode==='idle') ui.atkSet=null; updatePath(); hud(); return; }
  if(mode==='move'){
    if(k==='z') moveTo();
    else if(k==='x'){ ui.cursor=[orig.x,orig.y]; clearSel(); mode='idle'; hud(); }
    return;
  }
  if(mode==='idle'){
    const [x,y]=ui.cursor, u=E.unitAt(S,x,y);
    if(k==='z'){
      if(u&&u.owner===1&&!u.done) select(u);
      else if(u&&u.owner===2){ ui.atkSet=ui.atkSet?null:rangeTiles(u); }
      else if(!u&&E.canBuildAt(S,1,x,y).length) buildMenu(x,y);
      else mainMenu();
    } else if(k==='x'){ ui.atkSet=null; }
    else if(k==='a'){ const r=E.readyUnits(S,1); if(r.length){ const i=r.findIndex(v=>v.x===x&&v.y===y); const n=r[(i+1)%r.length]; ui.cursor=[n.x,n.y]; hud(); } }
    else if(k==='s') showInfo();
    else if(k==='enter') mainMenu();
  }
}
document.querySelectorAll('#touchpad [data-key]').forEach(b=>{
  b.addEventListener('pointerdown',e=>{e.preventDefault();const m={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',x:'z',z:'x',s:'a',a:'s',Enter:'enter'}[b.dataset.key];key(m);});
});
canvas.addEventListener('click',e=>{
  if(!S||mode==='cpu'||busy||menu) return;
  const r=canvas.getBoundingClientRect(), x=Math.floor((e.clientX-r.left)/r.width*S.map.W), y=Math.floor(((e.clientY-r.top)/r.height*canvas.height-R.PAD)/R.T);
  if(x<0||y<0||x>=S.map.W||y>=S.map.H) return;
  if(mode==='target'){ const i=tgt.list.findIndex(t=>t.x===x&&t.y===y); if(i<0) return; if(i===tgt.i) return key('z'); tgt.i=i; ui.cursor=[x,y]; return hud(); }
  if(ui.cursor[0]===x&&ui.cursor[1]===y) return key('z');
  ui.cursor=[x,y]; updatePath(); hud();
});

/* ---------- 시험용 연결 ---------- */
window.render_game_to_text=()=>JSON.stringify(S?{mode,day:S.day,turn:S.turn,winner:S.winner,cursor:ui.cursor,menu:menu?menu.items.map(i=>i.label):null,menuIndex:menu?menu.i:null,
  funds:[S.players[1].funds,S.players[2].funds],meter:[S.players[1].meter,S.players[2].meter],
  units:S.units.filter(u=>!u.carried).map(u=>({id:u.id,t:u.type,o:u.owner,x:u.x,y:u.y,hp:u.hp,done:u.done}))}:{mode:'setup',cfg});
window.__dongHyunJeon={get state(){return S;},key,get mode(){return mode;}};
sortieCard(cfg); preview(cfg); renderSlotList();
})();
