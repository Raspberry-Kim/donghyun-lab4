const {chromium}=require('playwright');
(async()=>{
  const b=await chromium.launch(); const errs=[];
  const p=await b.newPage({viewport:{width:1440,height:1000}});
  p.on('pageerror',e=>errs.push('pageerror '+e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
  await p.goto('file://'+__dirname+'/../dist/index.html'); await p.waitForTimeout(500);
  await p.screenshot({path:__dirname+'/shot-setup.png'});
  await p.click('#run'); await p.waitForTimeout(1500);
  const st=()=>p.evaluate(()=>JSON.parse(render_game_to_text()));
  console.log('after sortie',JSON.stringify(await st()).slice(0,300));
  // 생산: 커서는 본부. 공장으로 이동
  const s=await st();
  const fac=await p.evaluate(()=>{const S=__dongHyunJeon.state;for(let y=0;y<S.map.H;y++)for(let x=0;x<S.map.W;x++){const t=S.map.grid[y][x];if(t.t==='factory'&&t.owner===1)return [x,y];}});
  const go=async([tx,ty])=>{let c=(await st()).cursor;while(c[0]!==tx){await p.keyboard.press(c[0]<tx?'ArrowRight':'ArrowLeft');c=(await st()).cursor;}while(c[1]!==ty){await p.keyboard.press(c[1]<ty?'ArrowDown':'ArrowUp');c=(await st()).cursor;}};
  await go(fac); await p.keyboard.press('z'); await p.waitForTimeout(100);
  console.log('build menu',JSON.stringify((await st()).menu));
  await p.screenshot({path:__dirname+'/shot-build.png'});
  await p.keyboard.press('z'); await p.waitForTimeout(100);
  console.log('after build',JSON.stringify((await st()).units),(await st()).funds);
  await p.keyboard.press('Enter'); await p.waitForTimeout(100);
  console.log('menu',JSON.stringify((await st()).menu));
  // 턴 종료 선택
  let m=(await st()); while(m.menu[m.menuIndex]!=='턴 종료'){await p.keyboard.press('ArrowDown');m=await st();}
  await p.keyboard.press('z'); await p.waitForTimeout(400);
  console.log('mode',(await st()).mode);
  await p.screenshot({path:__dirname+'/shot-cpu.png'});
  for(let i=0;i<40;i++){ await p.waitForTimeout(500); if((await st()).mode==='idle') break; }
  const s2=await st(); console.log('day',s2.day,'turn',s2.turn,'mode',s2.mode,'units',JSON.stringify(s2.units));
  // 내 보병 선택 후 이동
  const inf=s2.units.find(u=>u.o===1);
  await go([inf.x,inf.y]); await p.keyboard.press('z'); await p.waitForTimeout(100);
  console.log('mode',(await st()).mode);
  await p.keyboard.press('ArrowUp'); await p.keyboard.press('ArrowUp'); await p.keyboard.press('ArrowRight');
  await p.screenshot({path:__dirname+'/shot-move.png'});
  await p.keyboard.press('z'); await p.waitForTimeout(500);
  console.log('action',JSON.stringify((await st()).menu));
  await p.screenshot({path:__dirname+'/shot-action.png'});
  await p.keyboard.press('x'); await p.waitForTimeout(100); console.log('after x mode',(await st()).mode, JSON.stringify((await st()).units.find(u=>u.id===inf.id)));
  await p.keyboard.press('z'); await p.waitForTimeout(500); 
  let a=await st(); while(a.menu[a.menuIndex]!=='대기'){await p.keyboard.press('ArrowDown');a=await st();}
  await p.keyboard.press('z'); await p.waitForTimeout(100);
  console.log('after wait',JSON.stringify((await st()).units.find(u=>u.id===inf.id)));
  await p.setViewportSize({width:375,height:812}); await p.waitForTimeout(300);
  await p.screenshot({path:__dirname+'/shot-mobile.png',fullPage:true});
  console.log('errors',errs);
  await b.close();
})();
