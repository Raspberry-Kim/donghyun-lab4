const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
const go=async()=>{await p.goto('file://'+__dirname+'/../dist/index.html');await p.waitForTimeout(300);};await go();
for(const n of (process.env.MAPS||'5,11,13,15,18,20').split(',')){ await go(); await p.selectOption('#example',n<=4?['practice','field','strait','ridge'][n-1]:'map'+n); await p.click('#run'); await p.waitForTimeout(2200);
 const el=await p.$('#board-wrap'); await el.screenshot({path:__dirname+'/map'+n+'.png'}); }
console.log('errors',errs);await b.close();})();
