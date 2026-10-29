const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1100,height:400}});
await p.goto('file://'+__dirname+'/../dist/index.html');await p.waitForTimeout(300);
const url=await p.evaluate(()=>{const L=['tank','md','neo','recon','apc','aa'];const S=10,T=16,Z=T*S;const c=document.createElement('canvas');c.width=L.length*(Z+10);c.height=Z*2+10+T*3*2;const g=c.getContext('2d');g.imageSmoothingEnabled=false;
const tl=Render.terrainLayer({W:1,H:1,grid:[[{t:'plain'}]]});
L.forEach((t,i)=>{for(const o of [1,2]){const x=i*(Z+10),y=(o-1)*(Z+5);g.drawImage(tl,0,Render.PAD||0,16,16,x,y,Z,Z);g.drawImage(Render.sprite(t,o,false),x,y,Z,Z);
 const yy=2*Z+10+(o-1)*T*3;g.drawImage(tl,0,Render.PAD||0,16,16,x,yy,T*3,T*3);g.drawImage(Render.sprite(t,o,false),x,yy,T*3,T*3);}});return c.toDataURL();});
require('fs').writeFileSync(process.argv[2]||'/tmp/tanks.png',Buffer.from(url.split(',')[1],'base64'));await b.close();})();
