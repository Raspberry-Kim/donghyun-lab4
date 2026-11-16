// 블랙보트 화면 흐름: 생산 → 수리 → 탑승·하차 → 저장·불러오기. NODE_PATH=... node qa/bboat-ui.cjs
const {chromium}=require('playwright');
(async()=>{
  const b=await chromium.launch(); const errs=[]; let pass=0, fail=0;
  const ok=(n,c,x)=>{ if(c) pass++; else { fail++; console.log('FAIL',n,x===undefined?'':JSON.stringify(x)); } };
  const eq=(n,a,w)=>ok(n,JSON.stringify(a)===JSON.stringify(w),{got:a,want:w});
  const p=await b.newPage({viewport:{width:1440,height:1000}});
  p.on('pageerror',e=>errs.push('pageerror '+e.message)); p.on('console',m=>{ if(m.type()==='error') errs.push('console '+m.text()); });
  await p.goto('file://'+__dirname+'/../dist/index.html'); await p.waitForTimeout(300);
  // 규칙 표
  const row=await p.$$eval('#unit-table tbody tr',rs=>rs.map(r=>[...r.cells].map(c=>c.textContent.trim())).find(r=>r[0]==='블랙보트'));
  eq('unit table row',row,['블랙보트','7,500','7','함선·모래톱','60 (−1/일)','—','—','항구']);
  eq('unit table rows',await p.$$eval('#unit-table tbody tr',rs=>rs.length),22);
  ok('rules text',(await p.textContent('#tab-rules')).includes('블랙보트: 무기가 없는 작은 배다'));
  await p.selectOption('#example','map15'); await p.click('#run');
  const st=()=>p.evaluate(()=>JSON.parse(render_game_to_text()));
  for(let i=0;i<80;i++){const s=await st(); if(s.turn===1&&s.mode==='idle') break; await p.keyboard.press('z'); await p.waitForTimeout(150);}
  await p.waitForTimeout(1200);
  const go=async([tx,ty])=>{let c=(await st()).cursor;while(c[0]!==tx){await p.keyboard.press(c[0]<tx?'ArrowRight':'ArrowLeft');c=(await st()).cursor;}while(c[1]!==ty){await p.keyboard.press(c[1]<ty?'ArrowDown':'ArrowUp');c=(await st()).cursor;}};
  const pick=async label=>{let a=await st();for(let i=0;i<12&&a.menu[a.menuIndex]!==label;i++){await p.keyboard.press('ArrowDown');a=await st();} if(a.menu[a.menuIndex]!==label) throw Error('no '+label+' in '+a.menu); await p.keyboard.press('x'); await p.waitForTimeout(120);};
  // 꾸미기: 내 항구 찾기, 바다 위 전함(체력 6.2)·블랙보트, 모래톱 위 블랙보트와 보병
  const info=await p.evaluate(()=>{const S=__dongHyunJeon.state,g=S.map.grid,T=(x,y)=>g[y]&&g[y][x]&&g[y][x].t;
    S.units=S.units.filter(u=>u.owner===2); S.players[1].funds=20000;
    const mk=(type,o,x,y,hp=100)=>{const d=DH_DATA.UNITS[type];const u={id:S.nextId++,type,owner:o,x,y,hp,fuel:d.fuel,ammo:d.ammo,done:false,cargo:[],dived:false};S.units.push(u);S.players[o].had=true;return u;};
    let port=null,sea=null,sh=null,land=null; const N=[[1,0],[-1,0],[0,1],[0,-1]];
    for(let y=0;y<S.map.H;y++)for(let x=0;x<S.map.W;x++){const t=g[y][x];
      if(!port&&t.t==='port'&&t.owner===1) port=[x,y];
      if(!sea&&t.t==='sea'&&T(x+1,y)==='sea'&&T(x+2,y)==='sea'&&T(x,y+1)==='sea'&&!S.units.some(u=>Math.abs(u.x-x)+Math.abs(u.y-y)<4)) sea=[x,y];
      if(!sh&&t.t==='shoal'){const l=N.map(([a,b])=>[x+a,y+b]).find(([a,b])=>['plain','road','forest'].includes(T(a,b))&&!S.units.some(u=>u.x===a&&u.y===b)); const w=N.some(([a,b])=>T(x+a,y+b)==='sea'); if(l&&w){sh=[x,y];land=l;}}}
    const boat=mk('bboat',1,sea[0],sea[1]), bs=mk('bship',1,sea[0]+1,sea[1],62); bs.fuel=10; bs.ammo=1;
    const boat2=mk('bboat',1,sh[0],sh[1]), inf=mk('inf',1,land[0],land[1]);
    return {port,sea,sh,land,ids:{boat:boat.id,bs:bs.id,boat2:boat2.id,inf:inf.id}};});
  ok('scene ready',info.port&&info.sea&&info.sh&&info.land,info);
  const S=f=>p.evaluate(f), unit=id=>p.evaluate(id=>{const u=__dongHyunJeon.state.units.find(u=>u.id===id);return u&&{x:u.x,y:u.y,hp:u.hp,fuel:u.fuel,ammo:u.ammo,done:u.done,carried:!!u.carried,cargo:u.cargo.length};},id);
  // 생산
  await go(info.port); await p.keyboard.press('x'); await p.waitForTimeout(120);
  let s=await st(); eq('port menu',s.menu,['전함','항공모함','순양함','수송함','블랙보트','잠수함']);
  const price=await S(()=>Engine.priceOf(__dongHyunJeon.state,1,'bboat')), co=await S(()=>__dongHyunJeon.state.players[1].co);
  eq('price by commander',price,co===5?6800:co===8?6000:7500); // 뿡뿡 90% · 쏜쏜 80%
  eq('price note',await p.$$eval('#menu .mi',ms=>ms.map(m=>m.textContent).find(t=>t.startsWith('블랙보트'))),'블랙보트'+price.toLocaleString('ko-KR'));
  await pick('블랙보트');
  eq('built',await S(()=>{const S=__dongHyunJeon.state,u=S.units[S.units.length-1];return [u.type,u.owner,u.done,S.players[1].funds];}),['bboat',1,true,20000-price]);
  ok('build log',(await p.textContent('#log li')).includes('블랙보트'));
  // 수리: 제자리에서 명령
  await go(info.sea); await p.keyboard.press('x'); await p.waitForTimeout(80); await p.keyboard.press('x'); await p.waitForTimeout(150);
  s=await st(); eq('boat menu',s.menu,['수리','대기']);
  await pick('수리'); s=await st(); eq('repair mode',[s.mode,s.cursor],['repair',[info.sea[0]+1,info.sea[1]]]);
  const card=await p.textContent('#info-card'); ok('repair card',card.includes('블랙보트 → 전함')&&card.includes('체력 7 → 8')&&card.includes('값 2,800')&&card.includes('연료 10 → 99')&&card.includes('1 → 9'),card);
  ok('status text',(await p.textContent('#status')).includes('수리할 유닛을 고르자'));
  await p.screenshot({path:__dirname+'/shot-repair.png'});
  // 취소하면 명령 메뉴로 돌아온다
  await p.keyboard.press('z'); await p.waitForTimeout(120); s=await st(); eq('cancel back to menu',[s.mode,s.menu],['action',['수리','대기']]);
  await pick('수리'); await p.keyboard.press('x'); await p.waitForTimeout(250);
  eq('battleship repaired',await unit(info.ids.bs),{x:info.sea[0]+1,y:info.sea[1],hp:80,fuel:99,ammo:9,done:false,carried:false,cargo:0});
  eq('boat done',(await unit(info.ids.boat)).done,true);
  eq('funds after repair',await S(()=>__dongHyunJeon.state.players[1].funds),20000-price-2800);
  ok('repair log',(await p.textContent('#log li')).includes('블랙보트 → 전함 수리 +1 · 값 2,800'),await p.textContent('#log li'));
  s=await st(); eq('idle after repair',s.mode,'idle');
  // 탑승: 보병이 모래톱의 블랙보트에 탄다
  await go(info.land); await p.keyboard.press('x'); await p.waitForTimeout(80); await go(info.sh); await p.keyboard.press('x'); await p.waitForTimeout(500);
  s=await st(); eq('load menu',s.menu,['탑승']); await pick('탑승');
  eq('loaded',[(await unit(info.ids.inf)).carried,(await unit(info.ids.boat2)).cargo],[true,1]);
  // 하차: 모래톱에서는 내릴 수 있다
  await go(info.sh); await p.keyboard.press('x'); await p.waitForTimeout(80); await p.keyboard.press('x'); await p.waitForTimeout(150);
  s=await st(); ok('unload offered on shoal',s.menu.includes('하차'),s.menu);
  await p.keyboard.press('z'); await p.waitForTimeout(100); await p.keyboard.press('z'); await p.waitForTimeout(100);
  // 저장 → 바꾸기 → 불러오기
  s=await st(); eq('idle before save',s.mode,'idle');
  await p.keyboard.press('Enter'); await pick('저장'); await pick('브라우저 칸 1'); await p.waitForTimeout(150);
  const snap=()=>S(()=>{const S=__dongHyunJeon.state;return S.units.filter(u=>u.owner===1).map(u=>[u.type,u.x,u.y,u.hp,u.fuel,u.ammo,u.done,!!u.carried,u.cargo.map(c=>c.type)]);});
  const before=await snap();
  await S(()=>{const S=__dongHyunJeon.state; S.units=S.units.filter(u=>u.type!=='bboat'&&!u.carried);});
  await p.keyboard.press('Enter'); await pick('불러오기'); await pick('브라우저 칸 1'); await pick('불러온다'); await p.waitForTimeout(300);
  eq('save and load keeps boats and cargo',await snap(),before);
  ok('cargo shares the unit list',await S(()=>{const S=__dongHyunJeon.state,t=S.units.find(u=>u.type==='bboat'&&u.cargo.length);return !!t&&S.units.includes(t.cargo[0])&&t.cargo[0].carried===true;}));
  // v0.78 저장 파일(블랙보트 없음)도 그대로 읽는다
  await p.keyboard.press('Enter'); await pick('불러오기'); await pick('파일에서 불러오기');
  await p.setInputFiles('#load-file',__dirname+'/test.dhsave'); await p.waitForTimeout(600);
  s=await st(); if(s.menu&&s.menu.includes('불러온다')) await pick('불러온다'); await p.waitForTimeout(400); s=await st();
  ok('old save loads',s.units.length>0&&!s.units.some(u=>u.t==='bboat')&&['idle','cpu'].includes(s.mode),{mode:s.mode,n:s.units.length,status:await p.textContent('#status')});
  eq('errors',errs,[]);
  console.log(`bboat ui: pass ${pass} · fail ${fail}`); await b.close(); process.exit(fail?1:0);
})().catch(e=>{console.error(e);process.exit(1);});
