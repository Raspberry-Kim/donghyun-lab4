const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();p.on('pageerror',e=>console.log('PE',e.message,e.stack.slice(0,300)));p.on('console',m=>console.log('C',m.text()));
await p.goto('file:///home/user/workspace/donghyun-jeon/dist/index.html');await p.waitForTimeout(800);await b.close();})();
