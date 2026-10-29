const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:900}});
await p.goto('file://'+__dirname+'/../dist/index.html');await p.waitForTimeout(300);
await p.evaluate(d=>localStorage.setItem('donghyun-jeon:slot2',d),require('fs').readFileSync(__dirname+'/test.dhsave','utf8'));
await p.reload();await p.waitForTimeout(300);
const el=await p.$('#setup-panel');await el.screenshot({path:__dirname+'/slots.png'});
await p.setViewportSize({width:375,height:800});await p.waitForTimeout(200);const e2=await p.$('.load-box');await e2.screenshot({path:__dirname+'/slots-m.png'});
await b.close();})();
