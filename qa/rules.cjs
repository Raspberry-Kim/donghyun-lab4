const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:1000}});
await p.goto('file://'+__dirname+'/../dist/index.html');await p.waitForTimeout(300);
await p.screenshot({path:__dirname+'/top.png',clip:{x:0,y:0,width:1280,height:300}});
await p.click('[data-tab=rules]').catch(()=>p.click('text=규칙과 지휘관'));await p.waitForTimeout(300);
await p.screenshot({path:__dirname+'/rules.png',fullPage:false});await b.close();})();
