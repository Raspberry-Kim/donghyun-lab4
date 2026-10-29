const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({acceptDownloads:true,viewport:{width:1280,height:900}});const p=await ctx.newPage();const errs=[];
p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+__dirname+'/../dist/index.html');await p.waitForTimeout(300);
await p.selectOption('#example','strait');await p.click('#run');
const st=()=>p.evaluate(()=>JSON.parse(render_game_to_text()));
for(let i=0;i<80;i++){const s=await st();if(s.turn===1&&s.mode==='idle')break;await p.keyboard.press('z');await p.waitForTimeout(150);}
await p.waitForTimeout(1500);
// 내 차례 몇 수: 컴퓨터 판단으로 진행 + 수송 탑승 상황 만들기
await p.evaluate(()=>{const S=__dongHyunJeon.state;for(let i=0;i<60;i++){const a=AI.next(S);if(!a||a.k==='end')break;AI.apply(S,a);}
 const inf=S.units.find(u=>u.owner===1&&u.type==='inf'); if(inf){ const t={id:S.nextId++,type:'apc',owner:1,x:inf.x,y:inf.y,hp:100,fuel:70,ammo:0,done:true,cargo:[inf],dived:false}; inf.carried=true; S.units.push(t);} });
const before=await p.evaluate(()=>{const S=__dongHyunJeon.state;return JSON.stringify({d:S.day,f:S.players[1].funds,n:S.units.length,seed:S.seed,cargo:S.units.filter(u=>u.cargo.length).map(u=>[u.id,u.cargo.map(c=>c.id)])});});
// Enter → 저장 → 칸 1
async function pick(label){ for(let i=0;i<10;i++){const s=await st(); if(s.menu&&s.menu[s.menuIndex]===label) break; await p.keyboard.press('ArrowDown');} await p.keyboard.press('x'); await p.waitForTimeout(80); }
await p.keyboard.press('Enter'); let s=await st(); console.log('menu',s.menu);
await pick('저장'); s=await st(); console.log('save menu',s.menu);
await pick('브라우저 칸 1'); 
const dl=p.waitForEvent('download'); await p.keyboard.press('Enter'); await pick('저장'); await pick('파일로 내려받기'); const d=await dl; await d.saveAs(__dirname+'/test.dhsave');
// 상태를 바꾼 뒤 불러오기
await p.evaluate(()=>{__dongHyunJeon.state.players[1].funds=1;});
await p.keyboard.press('Enter'); await pick('불러오기'); await pick('브라우저 칸 1'); s=await st(); console.log('confirm',s.menu); await pick('불러온다');
const after=await p.evaluate(()=>{const S=__dongHyunJeon.state;const c=S.units.find(u=>u.cargo.length);return JSON.stringify({d:S.day,f:S.players[1].funds,n:S.units.length,seed:S.seed,cargo:S.units.filter(u=>u.cargo.length).map(u=>[u.id,u.cargo.map(c=>c.id)])})+' same-ref:'+(c?S.units.includes(c.cargo[0]):'none');});
console.log('before',before);console.log('after ',after);
// 새로고침 후 첫 화면 칸 목록과 파일 불러오기
await p.reload(); await p.waitForTimeout(300);
console.log('slots',await p.$$eval('.slot-btn',bs=>bs.map(b=>b.disabled?'empty':b.textContent)));
await p.setInputFiles('#load-file-setup',__dirname+'/test.dhsave'); await p.waitForTimeout(300);
await p.waitForTimeout(800); s=await st(); console.log('file load day',s.day,'mode',s.mode,'units',s.units.length);
await p.screenshot({path:__dirname+'/shot-load.png'});
// 잘못된 파일
fs.writeFileSync(__dirname+'/bad.dhsave','{"format":"x"}'); await p.keyboard.press('Enter'); await pick('불러오기'); await pick('파일에서 불러오기');
await p.setInputFiles('#load-file',__dirname+'/bad.dhsave'); await p.waitForTimeout(200);
console.log('bad status',await p.textContent('#status'));
// 컴퓨터 차례 진행이 이어지는지
await p.keyboard.press('Enter'); await pick('턴 종료'); s=await st(); if(s.menu) await p.keyboard.press('x');
for(let i=0;i<80;i++){s=await st();if(s.turn===1&&s.mode==='idle')break;await p.keyboard.press('z');await p.waitForTimeout(150);}
await p.waitForTimeout(1500); s=await st(); console.log('next day',s.day,s.mode);
await p.goto('file://'+__dirname+'/../dist/index.html');await p.waitForTimeout(300);await p.screenshot({path:__dirname+'/shot-setup-slots.png'});
console.log('errors',errs);await b.close();})();
