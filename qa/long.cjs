const {chromium}=require('playwright');
(async()=>{
  const b=await chromium.launch(); const errs=[];
  const p=await b.newPage({viewport:{width:1280,height:900}});
  p.on('pageerror',e=>errs.push('pageerror '+e.message+' '+e.stack.slice(0,200)));
  await p.goto('file://'+__dirname+'/../dist/index.html'); await p.waitForTimeout(300);
  await p.selectOption('#example',process.argv[2]||'strait'); await p.click('#run');
  const st=()=>p.evaluate(()=>JSON.parse(render_game_to_text()));
  const t0=Date.now();
  for(let day=0;day<(+process.env.DAYS||60);day++){
    for(let i=0;i<100;i++){ const s=await st(); if(s.mode==='over'||(s.turn===1&&s.mode==='idle')) break; await p.keyboard.press('z'); await p.waitForTimeout(150); }
    let s=await st(); if(s.mode==='over') break;
    // 내 차례를 컴퓨터 판단으로 대신 둔다(엔진 직접 호출)
    await p.evaluate(()=>{const S=__dongHyunJeon.state;for(let i=0;i<300;i++){const a=AI.next(S);if(!a||a.k==='end')break;AI.apply(S,a);if(S.winner)break;}});
    s=await st(); if(s.winner){ await p.keyboard.press('s'); }
    await p.keyboard.press('Enter'); await p.waitForTimeout(50);
    s=await st(); if(s.mode==='over') break;
    let k=0; while(s.menu && s.menu[s.menuIndex]!=='턴 종료' && k++<6){ await p.keyboard.press('ArrowDown'); s=await st(); }
    await p.keyboard.press('x'); await p.waitForTimeout(50); s=await st(); if(s.menu) { await p.keyboard.press('x'); }
    if(day%10===0) await p.screenshot({path:__dirname+`/long-${day}.png`});
  }
  const s=await st(); console.log('final day',s.day,'winner',s.winner,'mode',s.mode,'units',s.units.length,'sec',(Date.now()-t0)/1000);
  await p.screenshot({path:__dirname+'/long-final.png'});
  console.log('errors',errs.slice(0,5)); await b.close();
})();
