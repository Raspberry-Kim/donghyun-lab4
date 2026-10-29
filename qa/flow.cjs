// 공격·점령·하차 흐름: 상태를 직접 꾸민 뒤 키보드로 실행
const {chromium}=require('playwright');
(async()=>{
  const b=await chromium.launch(); const errs=[];
  const p=await b.newPage({viewport:{width:1440,height:1000}});
  p.on('pageerror',e=>errs.push('pageerror '+e.message));
  await p.goto('file://'+__dirname+'/../dist/index.html'); await p.waitForTimeout(300);
  await p.selectOption('#example','field'); await p.click('#run'); await p.waitForTimeout(1600);
  const st=()=>p.evaluate(()=>JSON.parse(render_game_to_text()));
  // 꾸미기: 내 경전차와 적 보병을 붙여 두고, 내 보병을 중립 도시 위에, 내 보급차에 보병 탑재
  await p.evaluate(()=>{const S=__dongHyunJeon.state,mk=(type,o,x,y)=>{const d=DH_DATA.UNITS[type];const u={id:S.nextId++,type,owner:o,x,y,hp:100,fuel:d.fuel,ammo:d.ammo,done:false,cargo:[],dived:false};S.units.push(u);S.players[o].had=true;return u;};
    mk('tank',1,5,5); mk('inf',2,6,5); mk('inf',2,14,1);
    const c=S.map.grid[2][1]; mk('inf',1,1,2);
    const apc=mk('apc',1,8,7); const i2=mk('inf',1,8,7); i2.carried=true; apc.cargo.push(i2);
    window.__t={cityOwner:c.owner};});
  const go=async([tx,ty])=>{let c=(await st()).cursor;while(c[0]!==tx){await p.keyboard.press(c[0]<tx?'ArrowRight':'ArrowLeft');c=(await st()).cursor;}while(c[1]!==ty){await p.keyboard.press(c[1]<ty?'ArrowDown':'ArrowUp');c=(await st()).cursor;}};
  const pick=async label=>{let a=await st();for(let i=0;i<10&&a.menu[a.menuIndex]!==label;i++){await p.keyboard.press('ArrowDown');a=await st();} if(a.menu[a.menuIndex]!==label) throw Error('no '+label+' in '+a.menu); await p.keyboard.press('x'); await p.waitForTimeout(150);};
  // 공격
  await go([5,5]); await p.keyboard.press('x'); await p.waitForTimeout(50); await p.keyboard.press('x'); await p.waitForTimeout(100);
  console.log('tank menu',(await st()).menu); await pick('공격');
  console.log('target mode',(await st()).mode); await p.screenshot({path:__dirname+'/shot-target.png'});
  await p.keyboard.press('x'); await p.waitForTimeout(900);
  console.log('after attack',JSON.stringify((await st()).units.filter(u=>u.x===6&&u.y===5||u.t==='tank')));
  await p.screenshot({path:__dirname+'/shot-attacked.png'});
  // 점령
  await go([1,2]); await p.keyboard.press('x'); await p.keyboard.press('x'); await p.waitForTimeout(100);
  console.log('inf menu',(await st()).menu); await pick('점령');
  console.log('city cp',await p.evaluate(()=>{const c=__dongHyunJeon.state.map.grid[2][1];return [c.cp,c.capId,c.owner];}));
  // 하차
  await go([8,7]); await p.keyboard.press('x'); await p.keyboard.press('x'); await p.waitForTimeout(100);
  console.log('apc menu',(await st()).menu); await pick('하차'); console.log('mode',(await st()).mode);
  await p.screenshot({path:__dirname+'/shot-unload.png'});
  await p.keyboard.press('x'); await p.waitForTimeout(150);
  console.log('after unload',JSON.stringify((await st()).units.filter(u=>u.o===1)));
  // S 정보, Shift 사거리
  await go([6,5]); await p.keyboard.press('a'); await p.waitForTimeout(100); console.log('info',(await st()).menu); await p.keyboard.press('z');
  // 지휘관 능력: 별을 채워서 사용
  await p.evaluate(()=>{__dongHyunJeon.state.players[1].meter=9000*6;});
  await p.keyboard.press('Enter'); await pick('무쇠 폭풍'); await p.waitForTimeout(1400);
  console.log('power',await p.evaluate(()=>__dongHyunJeon.state.players[1].power));
  await p.screenshot({path:__dirname+'/shot-power.png'});
  // 턴 종료 확인 → CPU → 다시 내 차례
  await p.keyboard.press('Enter'); await pick('턴 종료'); const m=await st(); console.log('confirm',m.menu); if(m.menu) await pick('턴을 끝낸다');
  for(let i=0;i<60;i++){await p.waitForTimeout(400); const s=await st(); if(s.turn===1&&s.mode==='idle') break;}
  console.log('back',JSON.stringify((await st()).day));
  // 항복 → 결과 → 출전 준비
  await p.click('#concede'); await p.waitForTimeout(100); await pick('항복한다'); await p.waitForTimeout(200);
  console.log('over',(await st()).mode); await p.screenshot({path:__dirname+'/shot-over.png'});
  await p.keyboard.press('x'); await p.waitForTimeout(200); console.log('setup',(await st()).mode, await p.isVisible('#setup-panel'));
  console.log('errors',errs); await b.close();
})();
