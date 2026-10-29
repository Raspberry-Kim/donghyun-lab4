const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:900}});
await p.goto('file://'+__dirname+'/../dist/index.html');await p.waitForTimeout(300);
await p.evaluate(d=>localStorage.setItem('donghyun-jeon:slot2',d),require('fs').readFileSync(__dirname+'/test.dhsave','utf8'));
await p.selectOption('#example','strait');await p.click('#run');await p.waitForTimeout(2500);
await p.keyboard.press('Enter');for(let i=0;i<1;i++)await p.keyboard.press('ArrowDown');await p.keyboard.press('x');await p.waitForTimeout(150);
const el=await p.$('#board-wrap');await el.screenshot({path:__dirname+'/menu.png'});await b.close();})();
