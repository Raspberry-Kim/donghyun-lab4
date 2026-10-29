const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();
await p.goto('file://'+__dirname+'/../dist/index.html');await p.waitForTimeout(300);
await p.selectOption('#example','strait');await p.click('#run');await p.waitForTimeout(500);
const r=await p.evaluate(()=>{const S=__dongHyunJeon.state;const c=Render.terrainLayer(S.map);const d=c.getContext('2d').getImageData(0,0,c.width,4).data;const out=[];for(let i=0;i<d.length;i+=4)if(d[i+3])out.push([(i/4)%c.width,Math.floor(i/4/c.width)]);return out.slice(0,20);});
console.log(JSON.stringify(r));await b.close();})();
