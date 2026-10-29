const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1100,height:400}});
await p.goto('file://'+__dirname+'/../dist/index.html');await p.waitForTimeout(300);
const url=await p.evaluate(()=>{const order=Object.keys(UNITS);const S=6,T=16;const c=document.createElement('canvas');c.width=order.length*T*S/2+40;c.height=T*S*2+20;const g=c.getContext('2d');g.imageSmoothingEnabled=false;
const tl=Render.terrainLayer({W:1,H:1,grid:[[{t:'plain'}]]});
order.forEach((t,i)=>{for(const o of [1,2]){const x=(i%10)*T*S/2*1.05, y=(Math.floor(i/10)*2+(o-1))*T*S/2;
g.drawImage(tl,0,Render.PAD||0,16,16,x,y,T*S/2,T*S/2);g.drawImage(Render.sprite(t,o,false),x,y,T*S/2,T*S/2);}});return c.toDataURL();});
require('fs').writeFileSync(__dirname+'/sprites.png',Buffer.from(url.split(',')[1],'base64'));await b.close();})();
