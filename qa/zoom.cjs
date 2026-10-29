const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:900}});
await p.goto('file://'+__dirname+'/../dist/index.html');await p.waitForTimeout(300);
await p.selectOption('#example',process.argv[2]||'ridge');await p.click('#run');await p.waitForTimeout(2500);
for(let i=0;i<30;i++){const s=await p.evaluate(()=>JSON.parse(render_game_to_text()));if(s.turn===1&&s.mode==='idle')break;await p.keyboard.press('z');await p.waitForTimeout(200);}
const c=await p.$('canvas');await c.screenshot({path:__dirname+'/zoom.png'});await b.close();})();
