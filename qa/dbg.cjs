const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>errs.push('c:'+m.text()));
await p.goto('file://'+__dirname+'/../dist/index.html');await p.waitForTimeout(300);
await p.selectOption('#example','strait');await p.click('#run');await p.waitForTimeout(2500);
console.log(await p.evaluate(()=>render_game_to_text().slice(0,120)), await p.evaluate(()=>document.activeElement.id));
await p.keyboard.press('Enter');await p.waitForTimeout(100);
console.log(await p.evaluate(()=>render_game_to_text().slice(0,200)));console.log(errs);await b.close();})();
