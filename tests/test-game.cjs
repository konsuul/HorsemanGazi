'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const noop=()=>{};
const ctx=()=>new Proxy({createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:(...coords)=>{assert.ok(coords.every(Number.isFinite),'Radialgradient mit endlichen Koordinaten');return {addColorStop:noop}}},{get:(o,k)=>o[k]||noop,set:(o,k,v)=>(o[k]=v,true)});
const events={},elements={};
const makeElement=()=>({classList:{add:noop,remove:noop},innerHTML:'',addEventListener:noop});
elements.game={getContext:ctx};elements.overlay=makeElement();elements.start=makeElement();
let gamepad=null;
const sandbox={navigator:{getGamepads:()=>gamepad?[gamepad]:[]},console,Math,Set,requestAnimationFrame:noop,document:{getElementById:id=>elements[id]||(elements[id]=makeElement()),createElement:()=>({width:0,height:0,getContext:ctx})},window:{addEventListener:(name,fn)=>events[name]=fn}};
vm.createContext(sandbox);vm.runInContext(fs.readFileSync(__dirname+'/../Pfert/art.js','utf8'),sandbox);
const source=fs.readFileSync(__dirname+'/../Pfert/game.js','utf8').replace('})();',
 'globalThis.testApi={reset,update,render,renderTransition,pollGamepad,offerCards,enemy,enemyAttack,startBoss,partHit,activateRage,hurt,keys,chooseCard,cardDefs,fireCharge,get:()=>({selectedCard,lastRare,t,runTime,level,xp,xpNeeded,orbs,choices,upgrades,hearts,score,player,enemies,bullets,beams,shots,pickups,boss,nextBoss,bossCount,state,transition,levelIndex,secret,secretTime,golden,goldenAppeared,secondAppeared,secretType,particles,deaths,arcs,flashes,threat}),setXp:v=>xp=v,setTime:v=>t=v,setFirstSeen:v=>goldenAppeared=v,setRunTime:v=>runTime=v,setNextBoss:v=>nextBoss=v,setSecretTime:v=>secretTime=v,setSpawn:v=>spawn=v,setDrop:v=>drop=v};})();');
vm.runInContext(source.replace('globalThis.testApi={','globalThis.testApi={goToStartMenu,shouldSpawnPickup,damagePart,art:PfertArt,startDebugRun,modifyDirectHit,updateFieldPowerupSpawns,getElementalBursts:()=>elementalBursts,'),sandbox);const a=sandbox.testApi;
for(let i=0;i<17;i++){const count=Array.from({length:100},(_,n)=>a.shouldSpawnPickup(i,(n+.5)/100)).filter(Boolean).length;assert.equal(count,i===5||i===16?100:12,'Dropchance Flasche '+i)}
function reset(){a.reset();a.setSpawn(999);a.setDrop(999);a.get().player.autoCooldown=Infinity}
function debugReset(){a.startDebugRun();a.setSpawn(999);a.setDrop(999);a.get().player.autoCooldown=Infinity}
function press(){events.keydown({code:'Space',repeat:false,preventDefault:noop})}
function release(){events.keyup({code:'Space',preventDefault:noop});a.get().player.autoCooldown=Infinity}
function shoot(duration=0){a.fireCharge(duration>0);a.get().player.autoCooldown=Infinity}
function bullet(x,y){return {x,y,vx:0,vy:0,w:10,h:10,pierce:false,damage:1,hit:new Set(),life:1}}
// Numpad 0 is a menu-only toggle, ignores repeats and protects every damage source.
{
 const toggle=(repeat=false)=>events.keydown({code:'Numpad0',repeat,preventDefault:noop});
 toggle();toggle(true);reset();
 assert.equal(a.get().player.immortal,true);
 for(const source of ['projectile','contact','boss','arcade']){
  a.get().player.inv=0;a.hurt(source);
  assert.equal(a.get().hearts,5,source+' wird durch Unsterblichkeit abgefangen');
 }
 toggle();assert.equal(a.get().player.immortal,true,'Im Spiel kein Umschalten');
 a.goToStartMenu();toggle();reset();
 assert.equal(a.get().player.immortal,false);
 a.hurt('contact');assert.equal(a.get().hearts,4,'Nach Abschalten wieder normaler Schaden');
}
// Normal enemy timers run at 70%; special encounters retain their rate.
for(const special of [null,'machine','formation','rareEnemy','rear','blocker']){
 reset();
 const unit=a.enemy(3,170);Object.assign(unit,{x:700,fire:2,speed:0});
 if(special)unit[special]=special==='machine'?'weaver':true;
 a.update(.1);
 assert.ok(Math.abs(unit.fire-(special?1.9:1.93))<1e-9,'Feuertimer '+special);
}
function testSeekingAfterHit(){
 reset();
 const first=placeTarget(400,270),second=placeTarget(620,420);
 const shot={...bullet(275,220),style:'rose',vx:220,pierce:true,homing:true,seekRank:1,breakRank:1};
 a.get().bullets.push(shot);
 a.update(.05);
 assert.ok(shot.vy>0,'Suchgeschoss lenkt vor dem ersten Treffer');
 shot.x=first.x;shot.y=first.y;
 a.update(.01);
 assert.ok(shot.hit.has(first));
 const fragments=a.get().bullets.filter(b=>b.generation===1);
 assert.equal(fragments.length,2);
 assert.ok(fragments.every(b=>b.damage===shot.damage*.126&&!b.homing&&!b.seekRank));
 const velocities=Array.from([shot,...fragments],b=>[b.vx,b.vy]);
 a.update(.05);
 assert.deepEqual(Array.from([shot,...fragments],b=>[b.vx,b.vy]),velocities,'Kein Umlenken auf den zweiten Gegner');
 shot.x=second.x;shot.y=second.y;
 a.update(.01);
 assert.ok(shot.hit.has(second),'Durchschlag kann Gegner auf seiner Flugbahn weiter treffen');

 reset();a.startBoss();
 const {boss,bullets}=a.get();
 const part=boss.parts[0];
 const bossShot={...bullet(boss.x+part.aim[0],boss.y+part.aim[1]),pierce:true,seekRank:1};
 bullets.push(bossShot);
 a.update(.01);
 assert.ok(bossShot.hit.size>0);
 assert.equal(bossShot.seekRank,0,'Bosssegment zählt als erster Treffer');
 console.log('OK: Zielsuche endet nach Treffer, Durchschlag und Splitterflug bleiben wirksam.');
}
testSeekingAfterHit();
if(process.argv.includes('--boomerang')){
 reset();
 a.get().upgrades.boomerang=1;
 a.get().upgrades.pierce=2;
 shoot();
 const [shot]=a.get().bullets;
 const outbound=shot.damage;
 const targets=[300,400,500].map(x=>placeTarget(x,268));
 for(const [index,target] of targets.entries()){
  shot.x=target.x;
  a.update(.01);
  assert.equal(target.hp,100-outbound);
  assert.equal(shot.returning,undefined);
  assert.equal(shot.returnContact,index===2?target:undefined);
 }
 a.update(.01);
 assert.ok(shot.returning&&shot.vx<0);
 assert.equal(shot.damage,outbound*.55);
 assert.equal(targets[2].hp,100-outbound);
 shot.x=targets[1].x;
 a.update(.01);
 assert.equal(targets[1].hp,100-outbound-shot.damage);
 console.log('OK: Bumerang durchschlägt zwei Ziele vor der Umkehr und trifft auf dem Rückflug erneut.');
 process.exit(0);
}
reset();shoot();
assert.ok(Math.abs(a.get().bullets[0].damage-.75*1.15)<1e-9);
reset();
for(const id of ['multiShot','fanShot','breakShot']){
 const card=a.cardDefs.find(card=>card.id===id);
 assert.equal(card.max,2);
 a.get().upgrades[id]=card.max;
}
shoot();
assert.equal(a.get().bullets.length,7);
if(process.argv.includes('--seek-hit'))process.exit(0);
if(process.argv.includes('--rockets')){testRocketPickup();testBossRocketTarget();console.log('OK: Fünf Suchraketen, doppelter Schaden und Bosssegment-Zielwahl.');process.exit(0)}
reset();a.get().pickups.push({x:135,y:270,w:30,h:42,i:16});a.update(.01);assert.equal(a.get().player.verticalWine,10);shoot();let vertical=a.get().bullets.filter(b=>b.verticalWine);assert.equal(vertical.length,2);assert.ok(vertical[0].vy<0&&vertical[1].vy>0);a.get().player.effects[1]=5;a.get().player.weapon=1;a.get().bullets.length=0;shoot();assert.ok(a.get().bullets.every(b=>!b.verticalWine),'keine Zusatzschüsse mit Weinwaffe');a.get().player.effects[1]=0;a.update(10);assert.equal(a.get().player.verticalWine,0);a.get().bullets.length=0;shoot();assert.ok(a.get().bullets.every(b=>!b.verticalWine),'Effekt endet nach zehn Sekunden');
function defeatBoss(){const count=a.get().boss.parts.length;for(let i=0;i<count;i++){const q=a.get(),p=q.boss.parts[i];p.hp=1;q.bullets.push(bullet(q.boss.x+p.aim[0],q.boss.y+p.aim[1]));a.update(.01);if(i<count-1){assert.ok(a.get().boss,'Boss bleibt bis zum letzten Bereich');assert.equal(a.get().boss.parts[i].hp,0,'Bereich '+i+' besiegt')}}if(a.get().state!=='transition')assert.equal(a.get().boss,null)}
for(const [key,index] of [['Numpad2',0],['Numpad3',1],['Numpad4',2],['Numpad5',3],['Numpad6',4],['Numpad7',5],['Numpad8',6],['Numpad9',0]]){debugReset();events.keydown({code:key,repeat:false,preventDefault:noop});assert.equal(a.get().boss.i,index,'Debug-Bosssprung '+key)}
function finishTransition(){assert.equal(a.get().state,'transition');const before=a.get();const t=before.t,run=before.runTime,secretTime=before.secretTime,orb=before.orbs[0],x=orb?.x;press();a.pollGamepad();a.update(.75);a.renderTransition();a.update(.74);assert.equal(a.get().t,t);assert.equal(a.get().runTime,run);assert.equal(a.get().secretTime,secretTime);assert.equal(orb?.x,x);assert.equal(a.get().player.charging,false);assert.equal(a.get().state,'transition');a.update(.02);a.renderTransition();assert.equal(a.get().transition.switched,true);assert.equal(a.get().player.inv,2);a.update(1.48);assert.equal(a.get().state,'transition');a.update(.01);assert.equal(a.get().state,'playing');assert.equal(a.get().player.inv,2);release();assert.equal(a.get().player.charging,false)}

// Power-ups freeze through boss fights and can be collected once after victory.
for(const type of [0,1]){
 reset();
 if(type===1){
  a.setTime(420);a.setNextBoss(600);a.update(.01);
  Object.assign(a.get().golden,{x:500,y:270});
  a.get().bullets.push(bullet(500,270));a.update(.01);finishTransition();
 }
 const bottle={x:300,y:290,w:30,h:42,i:1,age:1.25};
 a.get().pickups.push(bottle,{...bottle,dead:true});
 if(type===1){a.setSecretTime(45);a.update(.01)}else a.startBoss();
 assert.equal(a.get().pickups.length,0);
 a.update(.35);
 assert.equal(bottle.x,300);assert.equal(bottle.age,1.25);
 defeatBoss();
 if(type===1)finishTransition();
 assert.equal(a.get().pickups.length,1);
 assert.equal(a.get().pickups[0],bottle);
 Object.assign(bottle,{x:a.get().player.x,y:a.get().player.y});
 a.update(.01);
 assert.equal(a.get().pickups.length,0);
 assert.equal(a.get().player.weapon,1);
}

// Follow the existing main-game clock through all four Bazaar waves.
{
 reset();
 a.setTime(239.95);
 a.get().player.inv=100;
 const waves=[[],[],[],[]],seen=new Set();
 for(let frame=0;frame<1203;frame++){
  a.update(.05);
  const current=a.get();
  for(const enemy of current.enemies){
   if(seen.has(enemy)||enemy.rear||enemy.blocker)continue;
   seen.add(enemy);
   waves[Math.floor((current.t-240)/14)].push(enemy.i);
  }
 }
 assert.deepEqual(waves,[
  [3,3,3,3,3,3],[6,6,6,6,6,6],[7,7,7,7,7,7],[3,6,6,7,3,7,6,3,7]
 ]);
 const encounter=a.get().boss;
 assert.equal(encounter.i,0);
 assert.equal(encounter.encounter.phase,1);
 assert.equal(a.get().nextBoss,600);
 encounter.fire=0;
 a.update(.01);
 assert.ok(a.get().shots.length>0);
 assert.equal(encounter.warning,0);
 for(const part of encounter.parts)a.damagePart(part,part.max*.51,encounter.x,encounter.y);
 assert.ok(encounter.parts.every(part=>part.flash>0));
 a.update(.01);
 assert.equal(encounter.encounter.phase,2);
 assert.equal(encounter.encounter.cue,'warning');
 const warnedY=encounter.y,shotsBefore=a.get().shots.length;
 a.render();
 for(let i=0;i<20;i++)a.update(.05);
 assert.equal(encounter.y,warnedY);
 for(let i=0;i<16;i++)a.update(.05);
 assert.equal(encounter.y,encounter.encounter.toY);
 assert.equal(encounter.x,740);
 assert.equal(encounter.encounter.cue,'opening');
 a.render();
 for(let i=0;i<40;i++)a.update(.05);
 assert.equal(encounter.y,encounter.encounter.toY);
 assert.ok(a.get().shots.length<=shotsBefore);
 defeatBoss();
 assert.ok(a.get().orbs.some(orb=>orb.value===20));
 a.setSpawn(0);
 a.update(.01);
 assert.equal(a.get().enemies.length,1);
}

// Each of the other three selectable bosses has a distinct second-phase attack.
for(const [key,index,x,signature] of [
 ['Numpad3',1,755,s=>s.kind==='needle'],
 ['Numpad7',5,710,s=>s.kind==='splitter'],
 ['Numpad8',6,775,s=>s.kind==='sickle']
]){
 debugReset();
 events.keydown({code:key,repeat:false,preventDefault:noop});
 const current=a.get().boss;
 assert.equal(current.i,index);
 assert.equal(current.encounter.phase,1);
 current.fire=0;
 a.update(.01);
 assert.ok(a.get().shots.length>0);
 assert.equal(a.get().shots.some(signature),false);
 a.get().shots.length=0;
 for(const part of current.parts)a.damagePart(part,part.max*.51,current.x,current.y);
 const initialY=current.y;
 a.update(.05);
 assert.equal(current.encounter.cue,'warning');
 assert.equal(current.y,initialY);
 a.render();
 for(let i=0;i<36;i++)a.update(.05);
 assert.equal(current.encounter.cue,'opening');
 assert.equal(current.x,x);
 assert.equal(current.y,current.encounter.toY);
 for(let i=0;i<45;i++)a.update(.05);
 assert.equal(current.encounter.cue,'opening');
 assert.equal(a.get().shots.length,0);
 const volleyBefore=current.volleyIndex;
 for(let i=0;i<40&&current.volleyIndex===volleyBefore;i++)a.update(.05);
 assert.equal(current.encounter.phase,2);
 assert.equal(current.encounter.cue,null);
 assert.equal(current.volleyIndex,volleyBefore+1);
 assert.ok(a.get().shots.some(signature),'Erste Salve nach dem Phasenwechsel hat den erwarteten Geschosstyp');
 defeatBoss();
 if(index>=5){
  finishTransition();
  assert.equal(a.get().secret,false);
 }else{
  assert.equal(a.get().state,'playing');
 }
 assert.ok(a.get().orbs.some(orb=>orb.value===20));
}

// The existing hit protection stays active while the wave clock runs.
{
 reset();
 a.setTime(240.95);
 a.hurt();
 assert.equal(a.get().hearts,4);
 a.hurt();
 assert.equal(a.get().hearts,4);
 a.update(.1);
 assert.equal(a.get().enemies[0].i,3);
 assert.ok(a.get().player.inv>0);
 for(let i=0;i<30;i++)a.update(.05);
 assert.equal(a.get().player.inv,0);
 assert.equal(a.get().state,'playing');
}

// Regular hits flash, and hostile projectiles are painted after the effects.
{
 reset();
 a.enemy(3);
 const {enemies,bullets,shots}=a.get(),target=enemies[0];
 Object.assign(target,{x:500,y:270,speed:0});
 bullets.push(bullet(500,270));
 shots.push({x:500,y:270,w:8,h:8,vx:0,vy:0,life:1});
 a.update(.01);
 assert.ok(target.flash>0);
 const order=[],names=['flash','spark','hostile'];
 const originals=names.map(name=>a.art[name]);
 try{
  names.forEach(name=>a.art[name]=()=>order.push(name));
  a.render();
  assert.ok(order.includes('flash')&&order.includes('spark'));
  assert.equal(order.at(-1),'hostile');
 }finally{
  names.forEach((name,index)=>a.art[name]=originals[index]);
 }
}

reset();shoot();assert.equal(a.get().bullets.length,1);assert.equal(a.get().bullets[0].charged,false);
// Tatsächliche Kartenauswahl: Die zusätzlichen Schüsse existieren, liegen ohne Streuflug aber deckungsgleich.
reset();a.setXp(a.get().xpNeeded);a.update(.01);a.get().choices[0]=a.cardDefs.find(card=>card.id==='multiShot');a.chooseCard(0);assert.equal(a.get().upgrades.multiShot,1);a.get().player.autoCooldown=Infinity;shoot();assert.equal(a.get().bullets.length,2,'Doppelter Käse erzeugt zwei Geschosse');assert.equal(a.get().bullets[0].x,a.get().bullets[1].x);assert.notEqual(a.get().bullets[0].y,a.get().bullets[1].y);assert.equal(a.get().bullets[0].vx,a.get().bullets[1].vx);assert.ok(Math.abs(a.get().bullets[0].vy-a.get().bullets[1].vy)<1e-9);
reset();a.get().upgrades.snakeShot=1;shoot();let snake=a.get().bullets[0],snakeY=snake.y;a.update(.1);assert.ok(Math.abs(snake.y-snakeY-Math.sin(.8)*20.4)<1e-8,'Schlangenlinie schwingt sichtbar');
reset();press();assert.equal(a.get().bullets.length,0,'kein Sonderangriff ohne Wein');release();
for(const weapon of [1,3,13]){
 a.reset();a.setDrop(Infinity);
 const p=a.get().player;p.weapon=weapon;p.effects[weapon]=18;
 a.update(.01);
 for(let i=0;i<10;i++){
  press();
  events.keyup({code:'Space',preventDefault:noop});
 }
 assert.equal(p.effects[weapon],0,'zehn schnelle Sonderangriffe leeren den Balken');
 // A saturated projectile pool must still emit the next automatic main shot.
 const projectiles=a.get().bullets;
 while(projectiles.length<360)projectiles.push(bullet(700,100));
 for(let i=0;i<9;i++)a.update(.02);
 assert.ok(a.get().bullets.some(b=>b.style==='normal'&&!b.charged),'Standardschuss innerhalb eines Standardintervalls');
 assert.ok(a.get().bullets.length<=360);
}
{
 a.reset();a.setDrop(Infinity);
 const p=a.get().player;p.weapon=13;p.effects[13]=.04;
 a.update(.01);
 assert.ok(a.get().bullets.some(b=>b.style==='vortex'));
 for(let i=0;i<10;i++)a.update(.02);
 assert.equal(p.effects[13],0);
 assert.ok(a.get().bullets.some(b=>b.style==='normal'),'Standardschuss bei natürlichem Ablauf');
}
for(const i of [0,1,2,3,4,6,7,8,9,10,11,12,13,14,15]){reset();a.get().player.weapon=i;a.get().player.effects[i]=18;press();assert.equal(a.get().player.effects[i],16.2);assert.ok(a.get().bullets.some(b=>b.charged)||a.get().beams.some(b=>b.charged),'Sonderangriff '+i);events.keydown({code:'Space',repeat:true,preventDefault:noop});assert.equal(a.get().player.effects[i],16.2);a.render();release()}
reset();a.get().player.weapon=1;a.get().player.effects[1]=18;press();release();press();release();a.get().player.effects[1]=1;press();release();let count=a.get().bullets.length;press();assert.equal(a.get().player.effects[1],0);assert.equal(a.get().bullets.length,count,'leerer Wein');a.get().player.effects[1]=5;a.get().pickups.push({x:135,y:270,w:30,h:42,i:16});a.update(.01);assert.equal(a.get().player.effects[1],18);release();
reset();a.get().upgrades.magnet=1;let distantBottle={x:400,y:270,w:30,h:42,i:16},distantOrb={x:400,y:270,w:16,h:16,value:1,age:0};a.get().pickups.push(distantBottle);a.get().orbs.push(distantOrb);a.update(.05);assert.ok(distantBottle.x<395);assert.equal(distantOrb.x,400,'Die Flaschenreichweite zieht keine Orbs an');
for(let i=0;i<6;i++){reset();let q=a.get();q.pickups.push({x:q.player.x,y:q.player.y,w:30,h:42,i});a.update(.01);assert.equal(a.get().pickups.length,0);if(i<5)assert.ok(a.get().player.effects[i]>0);a.render()}
for(let i=0;i<5;i++){reset();a.get().player.weapon=i;a.get().player.effects[i]=18;shoot();let q=a.get();if(i===0)assert.equal(q.bullets.length,3,'Rotwein-Salve');if(i===1){assert.equal(q.bullets.length,3,'Dreifachfächer beim Tippen');assert.ok(q.bullets[0].vy<0&&q.bullets[2].vy>0)}if(i===2)assert.ok(q.bullets[0].homing);if(i===3){assert.equal(q.bullets.length,0);assert.equal(q.beams.length,1);assert.ok(q.beams[0].life>0)}if(i===4){assert.equal(q.bullets.length,2);assert.ok(q.bullets[0].vx>700)}a.render()}
reset();a.get().player.effects[1]=18;shoot(1);assert.equal(a.get().bullets.length,5,'Weißwein geladen: fünf Richtungen');
reset();a.get().player.effects[0]=18;shoot(1);assert.ok(a.get().bullets[0].blast,'Rotwein geladen: Flächentreffer');
reset();a.get().player.effects[3]=18;a.enemy(0);let target=a.get().enemies[0];target.x=400;target.y=268;target.speed=0;target.hp=.1;shoot();a.update(.01);assert.equal(a.get().enemies.length,0,'Laser trifft Gegner');
for(let i=0;i<10;i++){reset();a.enemy(i);let e=a.get().enemies[0];assert.ok(e.hp>=1.8,'Gegnerleben mit 10 % Abzug');e.x=135;e.y=270;e.speed=0;e.fire=999;a.update(.01);assert.equal(a.get().hearts,4,'Gegnerkontakt '+i);reset();a.enemy(i);e=a.get().enemies[0];e.x=400;e.y=270;e.speed=0;e.fire=999;e.hp=1;a.get().bullets.push(bullet(400,270));a.update(.01);assert.equal(a.get().enemies.length,0);assert.equal(a.get().deaths.length,1,'Todesanimation');a.render()}
for(let i=0;i<10;i++){reset();a.enemy(i);const e=a.get().enemies[0];e.x=650;e.speed=0;e.fire=0;a.update(.01);assert.ok(a.get().shots.length,'Gegnerangriff '+i)}
for(let i=0;i<5;i++){reset();for(let j=0;j<=i;j++)a.startBoss();a.get().boss.fire=0;a.update(.01);assert.ok(a.get().shots.length);a.render();defeatBoss()}
reset();a.get().orbs.push({x:300,y:400,w:16,h:16,value:3,age:0});a.setTime(419.99);a.setNextBoss(600);a.update(.02);assert.ok(a.get().golden);let q=a.get();q.golden.x=500;q.golden.y=270;q.bullets.push(bullet(500,270));press();a.update(.01);assert.equal(a.get().player.charging,false,'Ladeangriff abgebrochen');finishTransition();assert.equal(a.get().secret,true);assert.equal(a.get().orbs.length,1,'Orb bleibt beim Eintritt');const mainTime=a.get().t;a.update(.1);assert.equal(a.get().t,mainTime);a.render();a.setSecretTime(44.99);a.update(.02);assert.equal(a.get().boss.i,5);a.render();defeatBoss();finishTransition();assert.equal(a.get().secret,false);assert.ok(a.get().orbs.some(o=>o.value===3),'Orb bleibt bei Rückkehr');a.update(.01);assert.ok(a.get().t>mainTime);assert.equal(a.get().golden,null);
reset();a.setTime(419.99);a.setNextBoss(600);a.update(.02);a.get().golden.x=-59;a.update(.05);a.update(.1);assert.equal(a.get().secret,false);assert.equal(a.get().golden,null);
reset();a.setTime(419.99);a.startBoss();a.update(.02);assert.equal(a.get().golden,null);defeatBoss();a.update(.01);assert.ok(a.get().golden);
reset();a.setXp(a.get().xpNeeded);a.update(.02);q=a.get();assert.equal(q.state,'upgrade');assert.equal(q.choices.length,3);assert.equal(new Set(q.choices.map(c=>c.id)).size,3);const frozen=q.t;a.update(2);assert.equal(a.get().t,frozen,'Auswahl pausiert Spiel');const selected=q.choices[0].id;a.chooseCard(0);assert.equal(a.get().upgrades[selected],1);assert.equal(a.get().xpNeeded,15);a.chooseCard(0);assert.equal(a.get().upgrades[selected],1,'kein doppelter Kauf');
a.setRunTime(120);a.setXp(a.get().xpNeeded);a.update(.02);assert.equal(a.get().state,'upgrade');events.keydown({code:'Digit2',repeat:false,preventDefault:noop});assert.equal(a.get().state,'playing');assert.equal(Object.values(a.get().upgrades).reduce((x,y)=>x+y,0),2);
reset();a.get().upgrades.spread=1;shoot();assert.equal(a.get().bullets.length,3,'dauerhafte Flankenschüsse');reset();a.get().upgrades.damage=2;shoot();assert.ok(Math.abs(a.get().bullets[0].damage-.8625*1.12**2)<1e-9);reset();a.get().upgrades.charge=4;shoot(1.15);assert.ok(a.get().bullets[0].charged);assert.ok(a.get().bullets[0].w>32);
reset();let p=a.get().player;a.get().shots.push({x:p.x+25,y:p.y,vx:0,vy:0,w:10,h:10,life:1});a.update(.01);assert.equal(a.get().shots.length,0);assert.equal(a.get().hearts,5);assert.ok(p.guardFlash>0,'Schutzimpuls wird kurz angezeigt');
for(let i=0;i<5;i++){p.inv=0;a.get().shots.push({x:p.x,y:p.y,vx:0,vy:0,w:8,h:8,life:1});a.update(.01)}assert.equal(a.get().state,'over');reset();assert.equal(a.get().hearts,5);assert.equal(Object.values(a.get().upgrades).reduce((x,y)=>x+y,0),0);
for(let i=0;i<5;i++){reset();a.setTime(i*180);a.update(.01);a.render()}
reset();for(const card of a.cardDefs)if(!card.repeatable)a.get().upgrades[card.id]=card.max;a.setXp(a.get().xpNeeded);a.update(.01);assert.equal(a.get().choices.length,3,'auch nach allen normalen Upgrades drei Karten');assert.ok(a.get().choices.every(c=>c.repeatable));
reset();let targetPickup={x:190,y:270,w:30,h:42,i:1};a.get().pickups.push(targetPickup);a.update(.05);assert.ok(targetPickup.x<185,'Flaschen werden in Reichweite angesaugt');

// New weapon pickups and both tap/charge variants.
assert.equal(a.cardDefs.length,46,'Kartenkatalog mit zehn nachladenden Patronen');
for(let i=6;i<16;i++){
 reset();let q=a.get();q.pickups.push({x:135,y:270,w:30,h:42,i});a.update(.01);assert.equal(a.get().player.weapon,i);assert.ok(a.get().player.effects[i]>0);shoot();q=a.get();assert.ok(q.bullets.length||q.beams.length,'Mutator feuert '+i);a.render();
 reset();a.get().player.weapon=i;a.get().player.effects[i]=18;shoot(1);q=a.get();assert.ok(q.bullets.some(b=>b.charged)||q.beams.some(b=>b.charged),'Ladevariante '+i);a.render();
}
function equip(i){reset();a.get().player.weapon=i;a.get().player.effects[i]=18}
function placeTarget(x=400,y=270,hp=100){a.enemy(0);const e=a.get().enemies.at(-1);e.x=x;e.y=y;e.speed=0;e.fire=999;e.hp=hp;e.max=hp;return e}
for(const [weapon,kind] of [[0,'fire'],[3,'lightning'],[1,'frost'],[6,'earth']]){
 equip(weapon);
 const target=placeTarget(400,268),neighbor=placeTarget(475,268);
 shoot();
 const first=a.get().bullets[0];
 if(first){first.x=target.x;first.y=target.y;first.vx=0;first.vy=0}
 a.update(.01);
 const effect=a.getElementalBursts().find(effect=>effect.target===target&&effect.kind===kind);
 assert.ok(effect,kind+' erzeugt einen eigenen Treffereffekt');
 assert.equal(effect.x,target.x);
 if(kind==='lightning')assert.ok(a.getElementalBursts().some(effect=>effect.target===neighbor&&effect.kind===kind),'Kettenblitz zeigt Effekte an Folgezielen');
 a.render();
 if(kind==='fire'){
  for(let i=0;i<5;i++)a.update(.05);
  assert.ok(a.getElementalBursts().some(next=>next!==effect&&next.target===target&&next.kind==='fire'),'Nachbrennen erzeugt weitere Flammen');
 }
}
equip(0);a.startBoss();
{
 const boss=a.get().boss,part=boss.parts[0];
 a.get().upgrades.frost=1;shoot();
 const projectile=a.get().bullets[0];
 projectile.x=boss.x+part.aim[0];projectile.y=boss.y+part.aim[1];projectile.vx=0;projectile.vy=0;
 a.update(.01);
 const kinds=new Set(a.getElementalBursts().filter(effect=>effect.target===part).map(effect=>effect.kind));
 assert.deepEqual(kinds,new Set(['fire','frost']),'Ein Bosssegment kann mehrere Elemente gleichzeitig zeigen');
 a.render();
}
reset();assert.equal(a.getElementalBursts().length,0);
for(const [special,radius] of [[0,120],[1,188]]){
 equip(13);shoot(special);
 const [vortex]=a.get().bullets;
 assert.equal(vortex.vortex,radius);
 vortex.x=400;vortex.y=270;vortex.vx=0;
 const inside=placeTarget(400+radius-5,270),outside=placeTarget(400+radius+5,270);
 a.update(.05);
 assert.ok(inside.x<400+radius-5,'Vortex zieht Gegner innerhalb des größeren Radius an');
 assert.equal(outside.x,400+radius+5);
}
{
 reset();const {upgrades,player}=a.get();
 Object.assign(upgrades,{carousel:1,boomerang:1,bounceCrust:1,fanShot:1,snakeShot:1,seekShot:1});
 shoot();const [main]=a.get().bullets;
 const orb=player.orbiters[0];
 a.update(.05);
 assert.ok(main.x>player.x+46&&main.vx>0,'Der Standardschuss fliegt sofort aus');
 assert.ok(Math.abs(Math.hypot(orb.x-player.x,orb.y-player.y)-96)<1e-9);
 assert.equal(main.boomerangAt,1);
 const outbound=main.damage;
 for(let i=0;i<10;i++)a.update(.05);
 assert.ok(!main.returning&&main.vx>0,'Nach einer halben Sekunde fliegt der Bumerang noch auswärts');
 for(let i=0;i<10;i++)a.update(.05);
 assert.ok(main.returning&&main.vx<0);
 assert.equal(main.damage,outbound*.55);
 for(let i=0;i<80;i++)a.update(.05);
 assert.equal(player.orbiters[0],orb,'Das Käsekarussell bleibt über die Projektil-Lebensdauer hinaus aktiv');
 player.weapon=1;player.effects[1]=18;
 a.get().bullets.length=0;shoot();shoot(1);
 assert.ok(a.get().bullets.every(b=>!b.boomerangAt&&!b.crust),'Wein-Dauerfeuer und Sonderangriffe behalten ihre Formen');
 player.effects[1]=0;
 const projectiles=a.get().bullets;
 while(projectiles.length<360)projectiles.push(bullet(700,100));
 shoot();
 assert.equal(projectiles.length,360);
 assert.equal(projectiles.at(-1).damage,outbound,'Platz für Hauptschuss vor Fächerkopien');
 assert.equal(player.orbiters[0],orb,'Der Projektilpool verdrängt das Karussell nicht');
}
{
 reset();const {player}=a.get();
 player.weapon=9;player.effects[9]=8;
 shoot();
 const [,left,right]=player.orbiters;
 assert.ok(left&&right);
 assert.ok(a.get().bullets.some(b=>b.style==='normal'&&b.vx>0&&!b.orbit));
 for(let i=0;i<80;i++)a.update(.05);
 assert.equal(player.orbiters[1],left);
 assert.equal(player.orbiters[2],right);
 assert.ok(Math.abs(Math.hypot(left.x-player.x,left.y-player.y)-46)<1e-9);
 player.effects[9]=.01;a.update(.05);
 assert.equal(player.orbiters.length,0,'Die Muskat-Monde enden mit dem Wein');
}
{
 reset();const {upgrades}=a.get();Object.assign(upgrades,{boomerang:1,bounceCrust:1,ricochet:2,seekShot:1,snakeShot:1,breakShot:1});
 shoot();const [main]=a.get().bullets;
 main.y=74;main.vy=-100;
 a.update(.05);
 const [edgeSplit]=a.get().bullets.filter(b=>b.generation===1);
 assert.ok(edgeSplit&&edgeSplit.damage===main.damage*.21&&edgeSplit.seekRank===1&&edgeSplit.snakeRank===1);
 assert.ok(!edgeSplit.boomerangAt&&!edgeSplit.crust&&!edgeSplit.bounces);
 main.y=515;main.vy=100;
 a.update(.05);
 assert.equal(a.get().bullets.filter(b=>b.generation===1).length,1,'nur der erste Abpraller splittert');
 main.y=268;main.vy=0;
 const target=placeTarget(main.x+8,268);
 a.update(.02);
 assert.equal(target.hp,100-main.damage);
 assert.equal(a.get().bullets.filter(b=>b.generation===1).length,3,'Käsebruch bleibt nach dem Sprung verfügbar');
 a.update(.05);
 assert.ok(main.returning,'Treffer löst den Rückflug vor Ablauf aus');
 const afterOutbound=target.hp;
 a.update(.05);
 assert.equal(main.returnContact,null,'vor einem erneuten Treffer muss der Schuss das Ziel verlassen');
 target.x=main.x-45;target.y=main.y;
 a.update(.05);a.update(.05);
 assert.ok(Math.abs(target.hp-(afterOutbound-main.damage))<1e-9,'ein erneuter Treffer auf dem Rückweg');
}
function collectFieldPickup(i){
 const {player,pickups}=a.get();
 pickups.push({x:player.x,y:player.y,w:30,h:42,i,age:0});
 a.update(.01);
}
function testRocketPickup(){
 reset();const {player}=a.get(),power=player.fieldPower;
 const found=new Set();
 for(let i=0;i<3;i++){
  power.dropIn=.01;a.updateFieldPowerupSpawns(.02);
  const pickup=a.get().pickups.at(-1);
  found.add(pickup.i);assert.ok(pickup.x>960);
  assert.ok(power.dropIn>=45&&power.dropIn<=65);
 }
 assert.equal(found.size,3,'gemischte Reihenfolge ohne Wiederholung');
 a.render();
 collectFieldPickup('rockets');assert.equal(power.rockets,5);
 const far=placeTarget(player.x+220,player.y);
 a.update(.05);assert.equal(power.rockets,5);
 const near=placeTarget(player.x-75,player.y);
 player.weapon=1;player.effects[1]=18;
 a.update(.01);
 const rocket=a.get().bullets.find(b=>b.style==='rocket');
 assert.equal(rocket.w,24);assert.equal(rocket.h,20,'Doppelte Raketengröße');
 assert.equal(rocket.target,near);assert.ok(Math.abs(rocket.damage-.8625*6)<1e-9);assert.equal(power.rockets,4);
 a.render();
 for(let i=0;i<6;i++)a.update(.05);
 assert.ok(Math.abs(near.hp-(100-.8625*6))<1e-9);assert.equal(far.hp,100);assert.equal(power.rockets,4);
 for(let i=0;i<7;i++)a.update(.05);
 assert.equal(power.rockets,3,'weitere Rakete nach dem Startintervall');
 collectFieldPickup('rockets');assert.equal(power.rockets,5);
 events.keydown({code:'Escape',preventDefault:noop});
 const frozen=power.launchCooldown;a.update(2);assert.equal(power.launchCooldown,frozen);
 reset();assert.equal(a.get().player.fieldPower.rockets,0);
}
testRocketPickup();
function testBossRocketTarget(){
 for(let phase=0;phase<6;phase++){
  reset();a.startBoss();a.setRunTime(phase*Math.PI/9);
  const {boss,player}=a.get(),armor=boss.parts.find(part=>part.role===1);
  boss.fire=999;
  player.x=boss.x-195;player.y=boss.y+armor.aim[1];
  const power=player.fieldPower,nextPickup=power.dropIn;
  power.rockets=1;
  a.update(.01);
  const rocket=a.get().bullets.find(b=>b.style==='rocket');
  assert.ok(rocket,'Rakete bleibt vor dem Boss im Flug, Orbitphase '+phase);
  assert.equal(rocket.target,armor,'Nächstes lebendes Bosssegment wird anvisiert');
  assert.equal(power.rockets,0,'Ein Start verbraucht eine Ladung');
  assert.ok(boss.parts.every(part=>!a.partHit(rocket,boss,part)),'Startposition liegt außerhalb der Bosssegmente');
  assert.equal(power.dropIn,nextPickup,'keine neuen Power-ups während des Bosskampfs');
  const hp=armor.hp;
  rocket.x=boss.x+armor.aim[0];rocket.y=boss.y+armor.aim[1];
  rocket.vx=0;rocket.vy=0;
  a.update(.01);
  assert.ok(Math.abs(armor.hp-(hp-rocket.damage))<1e-9,'Rakete trifft das anvisierte Bosssegment');
  assert.ok(!a.get().bullets.includes(rocket),'Treffer entfernt die Rakete');
 }
 console.log('OK: Bosssegment-Zielwahl und Raketentreffer in sechs Orbitphasen.');
}
testBossRocketTarget();
{
 reset();a.setTime(419.99);a.setNextBoss(600);a.update(.02);
 const {player,golden,bullets}=a.get(),power=player.fieldPower;
 power.rockets=2;power.launchCooldown=5;
 golden.x=500;golden.y=270;bullets.push(bullet(500,270));
 a.update(.01);finishTransition();assert.equal(a.get().secret,true);
 const nextPickup=power.dropIn;
 a.update(.02);
 assert.equal(power.rockets,2,'Raketenladungen bleiben im Abstecher erhalten');
 assert.equal(power.dropIn,nextPickup,'Power-up-Uhr pausiert im Abstecher');
 a.setSecretTime(44.99);a.update(.02);defeatBoss();finishTransition();
 assert.equal(a.get().secret,false);assert.equal(power.rockets,2);
}
{
 reset();const {player}=a.get(),power=player.fieldPower;
 const projectile=(x,y)=>({x,y,vx:0,vy:0,w:8,h:8,life:10});
 collectFieldPickup('shield');assert.equal(power.shield,2);
 player.podCooldown=10;
 a.get().shots.push(projectile(player.x,player.y),projectile(player.x,player.y));
 a.update(.01);assert.equal(power.shield,0);assert.equal(a.get().hearts,5);
 collectFieldPickup('shield');
 placeTarget(player.x,player.y);a.update(.01);assert.equal(a.get().hearts,4);assert.equal(power.shield,2);
 power.shieldTime=.01;a.update(.02);assert.equal(power.shield,0);
 a.get().enemies.length=0;
 const locked=placeTarget(player.x+200,player.y-2,100);
 collectFieldPickup('sweeper');
 const inBeam=projectile(player.x+80,player.y),beside=projectile(player.x+80,player.y+40);
 a.get().shots.push(inBeam,beside);a.render();a.update(.05);
 assert.equal(inBeam.life,0);assert.ok(beside.life>0);
 assert.ok(locked.hp<100,'Räumstrahl trifft das anvisierte Ziel');
 for(let i=0;i<81;i++)a.update(.05);
 assert.equal(power.beamTime,0);
}
{
 reset();const enemy=placeTarget();enemy.patrol={sprite:'lantern'};
 assert.equal(a.modifyDirectHit(enemy,10,{vx:2,vy:0},false,enemy.x,enemy.y),5.5);
 assert.equal(a.modifyDirectHit(enemy,10,{vx:-2,vy:0},false,enemy.x,enemy.y),10);
 assert.equal(a.modifyDirectHit(enemy,10,{vx:1,vy:2},false,enemy.x,enemy.y),10);
 assert.equal(a.modifyDirectHit(enemy,10,{charged:true},false,enemy.x,enemy.y),5.5,'Sonderlaser trifft von vorn');
 a.render();a.startBoss();
 const {boss}=a.get(),armor=boss.parts.find(part=>part.role===1),exposed=boss.parts[0];
 const hitPart=(part,attack)=>a.modifyDirectHit(part,10,attack,true,boss.x,boss.y);
 assert.equal(hitPart(armor,{vx:1}),10);
 boss.strike={elapsed:0,warning:1.15,fromX:boss.x,toX:boss.x-300};
 assert.equal(hitPart(armor,{vx:-1}),6.5);
 assert.equal(hitPart(armor,{charged:true}),6.5);
 assert.equal(hitPart(exposed,{vx:1}),10);
 a.render();
}
equip(15);a.get().upgrades.seekShot=1;placeTarget(650,400);shoot();let tracking=a.get().bullets[0];a.update(.05);assert.ok(tracking.vy>0,'Weingeschoss verfolgt auch entfernten Gegner');
for(const weapon of [0,1,2,3,4,6,7,8,9,10,11,12,13,14,15]){equip(weapon);for(const id of ['multiShot','fanShot','snakeShot','seekShot','breakShot'])a.get().upgrades[id]=1;shoot(1);const q=a.get(),attacks=q.bullets.length?q.bullets:q.beams;assert.ok(attacks.length>=4,'Wein-Sonderangriff vervielfacht '+weapon);assert.ok(attacks.every(b=>b.seekRank===1&&b.snakeRank===1&&b.breakRank===1),'Karteneffekte auf Wein-Sonderangriff '+weapon);a.render()}
equip(3);a.get().upgrades.breakShot=1;let beamTarget=placeTarget(400,270,1000);shoot(1);a.update(.01);assert.equal(a.get().bullets.filter(b=>b.generation===1).length,2,'Sonderlaser splittert');for(let i=0;i<5;i++)a.update(.03);assert.ok(a.get().bullets.filter(b=>b.generation===1).length<=2,'Laser splittert je Ziel nur einmal');
reset();for(const id of ['multiShot','fanShot','snakeShot','seekShot','breakShot'])a.get().upgrades[id]=1;let target9=placeTarget(400,320,1);shoot();assert.equal(a.get().bullets.length,4);assert.ok(a.get().bullets[1].vy<0&&a.get().bullets[2].vy>0);let shot9=a.get().bullets[1],vy9=shot9.vy;a.update(.05);assert.ok(shot9.vy>vy9,'Verfolgung lenkt zum Gegner');shot9.x=400;shot9.y=target9.y;a.update(.01);let fragments9=a.get().bullets.filter(b=>b.generation===1);assert.equal(fragments9.length,2);assert.ok(fragments9.every(b=>!b.seekRank&&!b.homing&&b.snakeRank===1));a.update(.01);assert.ok(a.get().bullets.every(b=>(b.generation||0)<=1),'keine weitere Splittergeneration');
reset();for(const id of ['multiShot','fanShot','snakeShot','seekShot','breakShot'])a.get().upgrades[id]=2;a.get().player.weapon=0;a.get().player.effects[0]=18;shoot();assert.equal(a.get().bullets.length,3);assert.ok(a.get().bullets.every(b=>!b.standardShot&&b.seekRank===2&&!b.breakRank));a.get().player.effects[0]=0;a.get().bullets.length=0;shoot();assert.equal(a.get().bullets.length,7,'Standardschuss nach Wein');a.get().bullets.length=0;shoot(1);assert.ok(a.get().bullets.every(b=>!b.standardShot),'Sonderangriff unverändert');
equip(6);let e=placeTarget(400,268,1);shoot();a.get().bullets[0].x=400;a.update(.01);assert.ok(a.get().bullets.length>=3,'Prisma zerfällt in Splitter');
equip(7);shoot();for(let i=0;i<13;i++)a.update(.05);assert.ok(a.get().bullets[0].vx<0,'Säge kehrt um');
equip(8);let first=placeTarget(400,268,1),second=placeTarget(490,290,100);shoot();a.get().bullets[0].x=400;a.update(.01);assert.ok(second.hp<100,'Kettenblitz springt');assert.ok(a.get().arcs.length>0);
equip(9);shoot(1);a.update(.1);let pl=a.get().player;assert.equal(a.get().bullets.length,3);assert.ok(a.get().bullets.every(orb=>Math.abs(Math.hypot(orb.x-pl.x-22,orb.y-pl.y)-56)<1),'Muskat-Sonderangriff lädt drei Monde am Pfert');
equip(10);shoot();let shell=a.get().bullets[0],vy=shell.vy;a.update(.1);assert.ok(shell.vy>vy,'Mörser folgt Ballistik');
equip(11);shoot();let wave=a.get().bullets[0],height=wave.h;a.update(.1);assert.ok(wave.h>height&&wave.pierce,'Echo-Welle wächst');
equip(12);e=placeTarget(400,268);shoot();a.get().bullets[0].x=400;a.update(.01);assert.ok(e.slow>=.28,'Frost bremst');
equip(13);e=placeTarget(300,268);shoot();let vortex=a.get().bullets[0];vortex.x=300;vortex.vx=0;a.update(.01);let hp=e.hp;for(let i=0;i<8;i++)a.update(.05);assert.ok(e.hp<hp,'Vortex pulsiert mehrfach');
equip(14);shoot();let tapWidth=a.get().beams[0].width;equip(14);shoot(1);assert.ok(a.get().beams[0].width>tapWidth*3,'Gewitter-Ladung ist großer Strahl');assert.equal(a.get().beams.length,1);
equip(15);shoot(1);assert.equal(a.get().bullets.length,3,'Drei Phönixbahnen');let bird=a.get().bullets[0],y=bird.y;a.update(.1);assert.notEqual(bird.y,y);
// Every new card changes actual play.
reset();a.keys.add('KeyD');let px=a.get().player.x;a.update(.1);assert.ok(Math.abs(a.get().player.x-px-30.54975)<.01,'Pfert bewegt sich 15 Prozent schneller');
reset();a.get().upgrades.agility=1;a.keys.add('KeyD');px=a.get().player.x;a.update(.1);assert.ok(a.get().player.x-px>30.54975);
reset();a.get().upgrades.magnet=3;let bottle={x:240,y:270,w:30,h:42,i:1};a.get().pickups.push(bottle);a.update(.05);assert.ok(bottle.x<235,'Korkenzieher zieht aus größerer Entfernung');
reset();a.get().upgrades.ricochet=1;shoot();let bouncing=a.get().bullets[0];bouncing.y=81;bouncing.vy=-150;a.update(.05);assert.ok(bouncing.vy>0&&bouncing.bounces===0);
reset();a.get().upgrades.chain=1;first=placeTarget(400,268,1);second=placeTarget(490,280);shoot();a.get().bullets[0].x=400;a.update(.01);assert.ok(second.hp<100,'Kettenkarte wirkt auf Basiswaffe');
reset();a.get().upgrades.frost=1;e=placeTarget(400,268);shoot();a.get().bullets[0].x=400;a.update(.01);assert.ok(e.slow>=.04);
reset();a.get().upgrades.ember=1;e=placeTarget(400,268);shoot();a.get().bullets[0].x=400;a.update(.01);hp=e.hp;a.update(.2);assert.ok(e.hp<hp&&e.burnLife>0);
reset();a.get().upgrades.echo=1;for(let i=0;i<6;i++)shoot();assert.equal(a.get().bullets.length,8,'Sechster Angriff erzeugt Echo');
for(const rank of [1,2,3,4]){
 reset();a.get().upgrades.rear=rank;shoot();
 const front=a.get().bullets.find(b=>b.vx>0),rear=a.get().bullets.find(b=>b.vx<0);
 assert.ok(Math.abs(rear.damage-front.damage*1.2*rank)<1e-9,'Rückwärtsschuss: sechsfacher bisheriger Schaden je Rang');
}
reset();a.get().upgrades.guard=1;pl=a.get().player;a.get().shots.push({x:pl.x+25,y:pl.y,vx:0,vy:0,w:10,h:10,life:1});a.update(.01);assert.ok(pl.podCooldown<2.5);
reset();a.get().upgrades.execute=1;e=placeTarget(400,268);e.hp=30;shoot();a.get().bullets[0].x=400;a.update(.01);assert.ok(Math.abs(e.hp-(30-.8625*1.10))<1e-9,'Letzter Bissen wirkt');
// An aimed shot keeps its locked direction even if the player moves before it fires.
{
 reset();const shooter=a.enemy(3,220);
 Object.assign(shooter,{x:700,speed:0,fire:.5});
 a.update(.05);
 assert.equal(a.art.shotPreview,undefined);
 a.render();
 a.get().player.y=450;
 for(let i=0;i<10;i++)a.update(.05);
 const dart=a.get().shots[0];
 assert.ok(dart);
 const expectedAngle=Math.atan2(270-220,135-(700-22));
 assert.ok(Math.abs(Math.atan2(dart.vy,dart.vx)-expectedAngle)<1e-9);
 assert.ok(Math.abs(Math.hypot(dart.vx,dart.vy)-190*1.3*1.1*(1+a.get().threat*.075))<.001);
 const velocity=[dart.vx,dart.vy];
 a.get().player.y=100;a.update(.05);
 assert.deepEqual([dart.vx,dart.vy],velocity);
}
reset();a.enemy(9);e=a.get().enemies[0];e.x=700;e.fire=0;a.update(.01);let lob=a.get().shots[0],initialVy=lob.vy;a.update(.1);assert.ok(lob.vy>initialVy);
reset();a.setTime(300);for(const card of a.cardDefs)if(!card.repeatable)a.get().upgrades[card.id]=2;a.update(1);a.enemy(0);assert.ok(a.get().enemies[0].max>2,'Schwierigkeit wächst mit Zeit und Karten');
// Minute 14 takes the distinct second route and preserves the main schedule.
reset();a.setFirstSeen(true);a.setTime(839.99);a.setNextBoss(900);a.update(.02);q=a.get();assert.equal(q.golden.kind,2,'Grubenlampe bei Minute 14');q.golden.x=500;q.golden.y=270;q.bullets.push(bullet(500,270));a.update(.01);finishTransition();assert.equal(a.get().secretType,2);const returnTime=a.get().t;a.setSecretTime(59.99);a.update(.02);assert.equal(a.get().boss.i,6);a.render();defeatBoss();finishTransition();assert.equal(a.get().secret,false);assert.equal(a.get().nextBoss,900);assert.equal(a.get().t,returnTime);a.update(.01);assert.equal(a.get().golden,null,'zweiter Zugang erscheint nur einmal');
reset();a.setFirstSeen(true);a.setTime(839.99);a.setNextBoss(900);a.update(.02);a.get().golden.x=500;a.get().golden.y=268;a.get().player.weapon=3;a.get().player.effects[3]=18;shoot();a.update(.01);finishTransition();assert.equal(a.get().secretType,2,'Laser kann Grubenlampe treffen');
reset();a.get().player.weapon=1;a.get().player.effects[1]=18;for(let i=0;i<120;i++)shoot();assert.ok(a.get().bullets.length<=360);a.update(.01);assert.ok(a.get().particles.length<=260&&a.get().flashes.length<=28,'Effektbudgets begrenzt');
reset();a.setTime(840);a.setNextBoss(900);a.update(.01);assert.equal(a.get().golden.kind,1,'verspäteter erster Zugang geht nicht verloren');a.get().golden.x=-59;a.update(.05);a.update(.01);assert.equal(a.get().golden.kind,2,'zweiter Zugang wartet auf ersten');
// Five-heart rules, motivational roasts and rare-card prerequisites.
reset();assert.equal(a.get().hearts,5);a.hurt();assert.equal(a.get().hearts,4);a.get().pickups.push({x:135,y:270,i:5,w:30,h:42});a.update(.01);assert.equal(a.get().hearts,5);a.get().pickups.push({x:135,y:270,i:5,w:30,h:42});a.update(.01);assert.equal(a.get().hearts,5,'Heilung bleibt bei fünf');
reset();a.get().upgrades.spread=1;a.setRunTime(120);a.setXp(a.get().xpNeeded);a.update(.02);assert.ok(a.get().choices.some(c=>c.id==='fork'),'passende seltene Karte angeboten');a.chooseCard(a.get().choices.findIndex(c=>c.id==='fork'));assert.equal(a.get().upgrades.fork,1);
reset();a.setRunTime(120);a.setXp(a.get().xpNeeded);a.update(.02);assert.ok(a.get().choices.every(c=>!c.rare),'keine unpassende Synergie');
reset();a.get().upgrades.damage=3;shoot();assert.ok(Math.abs(a.get().bullets[0].damage-.8625*Math.pow(1.12,3))<.0001,'Schaden multipliziert je Rang');
reset();a.get().upgrades.fork=1;e=placeTarget(400,268,1);shoot();a.get().bullets[0].x=400;a.update(.01);assert.equal(a.get().bullets.length,2,'Basisschuss verzweigt');assert.ok(a.get().bullets.every(b=>b.generation===1));second=placeTarget(450,268,100);for(const b of a.get().bullets){b.x=450;b.y=268}a.update(.01);assert.ok(a.get().bullets.length<=2,'Kinder verzweigen nicht endlos');
reset();a.get().upgrades.chain=1;a.get().upgrades.cascade=2;a.get().upgrades.frost=1;a.get().upgrades.ember=1;first=placeTarget(400,268,1);second=placeTarget(490,280,100);shoot();a.get().bullets[0].x=400;a.update(.01);assert.ok(Math.abs(second.hp-(100-.8625*.2*1.45**2))<1e-9,'multiplikativer Kettenschaden');assert.ok(second.slowTime>0&&second.burnLife>0,'Kette überträgt Elemente');
reset();a.get().upgrades.frost=1;a.get().upgrades.ember=1;a.get().upgrades.shatter=1;first=placeTarget(400,268,100);second=placeTarget(445,278,100);shoot();a.get().bullets[0].x=400;a.update(.01);assert.ok(first.shatterCooldown>0&&second.hp<100,'Frost und Glut zünden Flächentreffer');
reset();a.get().upgrades.echo=1;a.get().upgrades.echoForge=1;for(let i=0;i<4;i++)shoot();assert.equal(a.get().bullets.length,6,'vierter Angriff wiederholt echte Geschosse');assert.equal(a.get().bullets.filter(b=>b.echoed).length,2);
equip(3);a.get().upgrades.echoForge=1;for(let i=0;i<4;i++)shoot();assert.equal(a.get().beams.length,6,'auch Laser erhält Echos');assert.equal(a.get().beams.filter(b=>b.echoed).length,2);a.render();
reset();a.get().upgrades.guard=1;a.get().upgrades.orbital=1;shoot(1);assert.equal(a.get().bullets.filter(b=>b.orbit).length,2,'geladener Basisangriff erhält Monde');
// Risk charging is per hostile projectile and activation is explicit.
reset();pl=a.get().player;a.get().shots.push({x:pl.x,y:pl.y+35,vx:0,vy:0,w:8,h:8,life:1});a.update(.01);assert.equal(pl.rage,1);a.update(.01);assert.equal(pl.rage,1,'Vorbeiflug nur einmal gewertet');a.get().shots.push({x:pl.x+25,y:pl.y,vx:0,vy:0,w:8,h:8,life:1});a.update(.01);assert.equal(pl.rage,6,'Satellit lädt Rausch');
pl.rage=100;events.keydown({code:'KeyQ',repeat:false,preventDefault:noop});assert.equal(pl.rage,0);assert.equal(pl.overdrive,12);assert.equal(a.get().shots.length,0);shoot();assert.equal(a.get().bullets.length,6,'Rausch ergänzt Seitenangriffe');assert.ok(Math.abs(a.get().bullets[0].damage-.8625*1.35)<1e-9);assert.ok(a.get().bullets.some(b=>b.vx<0));assert.ok(a.get().bullets.some(b=>Math.abs(b.vx)<1e-8&&b.vy<0));assert.ok(a.get().bullets.some(b=>Math.abs(b.vx)<1e-8&&b.vy>0));assert.equal(a.activateRage(),false);a.render();a.update(1);assert.ok(pl.overdrive<12);a.update(12);assert.equal(pl.overdrive,0);
reset();for(let i=0;i<5;i++){a.get().player.inv=0;a.hurt()}const firstRoast=elements.overlay.innerHTML;assert.ok(firstRoast.includes('class="scoreboard"')&&firstRoast.includes('score-current')&&firstRoast.includes('PLATZ 1'),'Punktetafel erscheint beim Spielende');assert.ok(firstRoast.includes('class="roast"')&&firstRoast.includes('class="comeback"'));reset();for(let i=0;i<5;i++){a.get().player.inv=0;a.hurt()}assert.notEqual(elements.overlay.innerHTML,firstRoast,'Roast wiederholt sich nicht direkt');reset();assert.equal(a.get().player.rage,0);assert.equal(a.get().player.overdrive,0);
// A maximal combination cannot create an unbounded projectile recursion.
equip(6);for(const id of ['fork','chain','cascade','ember','frost','shatter','echoForge','orbital','spread'])a.get().upgrades[id]=2;for(let i=0;i<10;i++)placeTarget(350+i*38,240+i%3*20,500);shoot(1);for(let i=0;i<60;i++)a.update(.05);assert.ok(a.get().bullets.length<=360&&a.get().arcs.length<=36);assert.ok(a.get().bullets.every(b=>Number.isFinite(b.x)&&Number.isFinite(b.y)&&Number.isFinite(b.damage)),'alle Synergiegeschosse bleiben endlich');a.render();
// Visual histories are bounded and do not change collision or lifetime rules.
reset();shoot();for(let i=0;i<20;i++)a.update(.016);assert.ok(a.get().bullets[0].trail.length>1&&a.get().bullets[0].trail.length<=7);a.render();
reset();a.get().shots.push({x:700,y:160,vx:-60,vy:20,w:10,h:10,life:4});for(let i=0;i<16;i++)a.update(.02);assert.ok(a.get().shots[0].trail.length<=4);a.render();
for(const age of [.02,.12,.28,.5,.65]){reset();e=placeTarget(400,268,.5);shoot();a.get().bullets[0].x=400;a.update(.01);a.get().deaths[0].age=age;a.render()}
reset();a.startBoss();for(const part of a.get().boss.parts)part.hp=part.max*.2;a.render();
// Boss body layouts have different counts and isolated hit reactions.
for(let i=0;i<7;i++){reset();for(let j=0;j<=Math.min(i,4);j++)a.startBoss();let boss=a.get().boss;if(i>=5){boss.i=i;const layout=vm.runInContext('PfertArt.bossLayout('+i+')',sandbox);boss.parts=layout.map(p=>{const xs=p.points.map(v=>v[0]),ys=p.points.map(v=>v[1]);return {...p,dx:(Math.min(...xs)+Math.max(...xs))/2,dy:(Math.min(...ys)+Math.max(...ys))/2,w:Math.max(...xs)-Math.min(...xs),h:Math.max(...ys)-Math.min(...ys),hp:20,max:20,flash:0}})}assert.equal(boss.parts.length,[3,4,2,3,5,4,5][i]);for(const part of boss.parts){assert.ok(a.partHit({x:boss.x+part.aim[0],y:boss.y+part.aim[1],w:2,h:2},boss,part),'Treffpunkt liegt im Bereich '+i+':'+part.name);assert.equal(a.partHit({x:boss.x-300,y:boss.y,w:2,h:2},boss,part),false)}const target=boss.parts[0],before=boss.parts.map(p=>p.hp);a.get().bullets.push(bullet(boss.x+target.aim[0],boss.y+target.aim[1]));a.update(.01);assert.ok(target.hp<before[0]&&target.flash>0,'getroffene Fläche blitzt');for(let j=1;j<boss.parts.length;j++)assert.equal(boss.parts[j].hp,before[j],'andere Bereiche bleiben unbeschädigt');a.render()}
// Elemental powerups apply to taps, charge shots, echoes, shards and beams.
for(const [weapon,element] of [[0,'fire'],[1,'frost'],[3,'lightning'],[6,'earth']]){equip(weapon);shoot();const attack=a.get().bullets[0]||a.get().beams[0];assert.ok(attack.elements[element],'Powerup verleiht '+element)}
equip(0);e=placeTarget(400,268,100);shoot();a.get().bullets[0].x=400;a.update(.01);assert.ok(e.burnLife>0&&e.burnDps>0,'Rotwein brennt ohne Karte');hp=e.hp;a.update(.1);assert.ok(e.hp<hp,'Feuer verursacht Folgeschaden');
equip(1);e=placeTarget(400,268,100);shoot();a.get().bullets[1].x=400;a.update(.01);assert.ok(e.slow>=.25,'Weißwein verlangsamt ohne Karte');
equip(3);first=placeTarget(400,268,100);second=placeTarget(480,320,100);shoot();a.update(.01);assert.ok(second.hp<100,'Laser-Blitz springt auf Ziel außerhalb des Strahls');
equip(7);e=placeTarget(400,268,1);shoot();a.get().bullets[0].x=400;a.update(.01);assert.ok(a.get().bullets.some(b=>b.generation===1),'Erde splittert auch ohne Prisma-Waffe');
equip(0);for(const id of ['frost','chain','fork'])a.get().upgrades[id]=1;first=placeTarget(400,268,1);second=placeTarget(480,280,100);shoot();let attack=a.get().bullets[0];assert.ok(attack.elements.fire>0&&attack.elements.frost>0&&attack.elements.chainBonus>0&&attack.elements.forkBonus>0);attack.x=400;a.update(.01);assert.ok(second.slowTime>0&&second.burnLife>0,'Blitz überträgt kombinierte Elemente');const shards=a.get().bullets.filter(b=>b.generation===1);assert.ok(shards.length>0&&shards.every(b=>b.elements.fire>0&&b.elements.frost>0),'Splitter erben Elemente');
equip(0);shoot();attack=a.get().bullets[0];a.get().player.weapon=12;a.get().player.effects[0]=0;a.get().player.effects[12]=18;assert.ok(attack.elements.fire>0&&attack.elements.frost===0,'Elemente eines abgefeuerten Angriffs bleiben stabil');
equip(3);a.get().upgrades.ember=1;a.get().upgrades.frost=1;a.startBoss();let burningBoss=a.get().boss;a.get().player.y=burningBoss.y+burningBoss.parts[1].aim[1];shoot();a.update(.01);let burningPart=burningBoss.parts.find(p=>p.burnLife>0);assert.ok(burningPart&&burningPart.slowTime>0,'Laser-Elemente wirken auf Bossflächen');hp=burningPart.hp;a.get().beams.length=0;a.update(.3);assert.ok(burningPart.hp<hp,'Boss-Fläche erhält Feuerschaden über Zeit');
equip(12);a.get().upgrades.frost=1;e=placeTarget(400,268,100);shoot();a.get().bullets[0].x=400;a.update(.01);assert.ok(Math.abs(e.slow-.32)<.0001,'Frost-Karte addiert sich zu Eiswein');
// Real input/update integration: automatic fire, charging, resume and pauses.
function autoReset(){a.reset();a.setSpawn(999);a.setDrop(999)}
autoReset();a.update(.01);assert.equal(a.get().player.attacks,1,'feuert ohne Tastendruck');for(let i=0;i<30;i++)a.update(.02);assert.ok(a.get().player.attacks>=3,'Dauerfeuer setzt sich fort');
autoReset();a.get().player.weapon=0;a.get().player.effects[0]=18;press();assert.equal(a.get().player.attacks,1);assert.equal(a.get().player.effects[0],16.2);for(let i=0;i<20;i++)a.update(.05);assert.ok(a.get().player.attacks>1,'Dauerfeuer läuft weiter');events.keyup({code:'Space',preventDefault:noop});
autoReset();a.get().player.weapon=0;a.get().player.effects[0]=18;press();events.keyup({code:'Space',preventDefault:noop});assert.equal(a.get().player.attacks,1);a.update(.01);assert.equal(a.get().player.attacks,2,'Automatik läuft weiter');
autoReset();a.get().player.weapon=1;a.get().player.effects[1]=18;a.update(.01);assert.equal(a.get().bullets.length,3,'Automatik nutzt Weinwaffe');
autoReset();a.get().player.weapon=3;a.get().player.effects[3]=18;press();const chargedBeam=a.get().beams[0];a.update(.05);assert.ok(a.get().beams.includes(chargedBeam),'Automatik überschreibt Sonderlaser nicht');assert.ok(a.get().player.attacks>1);events.keyup({code:'Space',preventDefault:noop});
autoReset();a.setXp(a.get().xpNeeded);a.update(.02);assert.equal(a.get().state,'upgrade');let attacks=a.get().player.attacks;a.update(.5);assert.equal(a.get().player.attacks,attacks,'kein Feuer bei Kartenauswahl');a.chooseCard(0);a.update(.01);assert.ok(a.get().player.attacks>attacks);
autoReset();for(let i=0;i<5;i++){a.get().player.inv=0;a.hurt()}attacks=a.get().player.attacks;a.update(1);assert.equal(a.get().player.attacks,attacks,'kein Feuer nach Game Over');
for(const step of [.01,.05]){autoReset();for(let i=0;i<Math.round(2/step);i++)a.update(step);assert.ok(a.get().player.attacks===13,'zeitbasierte Schussfolge')}
// Audio is optional, gesture-initialized, muteable, and bounded.
const soundSource=fs.readFileSync(__dirname+'/../Pfert/sound.js','utf8')+';globalThis.sfx=PfertSound;';
const noAudio={window:{}};vm.createContext(noAudio);vm.runInContext(soundSource,noAudio);assert.doesNotThrow(()=>noAudio.sfx.play('shot'));
let audioStarts=0,audioClock=0;const pending=[],audioLog=[];
function fakeSource(type){const o={type,connect:noop,disconnect:noop,start(time){audioStarts++;o.started=time;audioLog.push(o)},stop(time){o.stopped=time;pending.push(o)}};o.frequency={setValueAtTime(v){o.from=v},exponentialRampToValueAtTime(v){o.to=v}};return o}
class FakeAudio{constructor(){this.state='running';this.destination={};this.sampleRate=8000}get currentTime(){return audioClock}createOscillator(){return fakeSource('sine')}createBufferSource(){return fakeSource('noise')}createBuffer(ch,length){return {getChannelData:()=>new Float32Array(length)}}createGain(){return {gain:{setValueAtTime:noop,linearRampToValueAtTime:noop,exponentialRampToValueAtTime:noop},connect:noop,disconnect:noop}}createBiquadFilter(){return {frequency:{setValueAtTime:noop},connect:noop,disconnect:noop}}createStereoPanner(){return {pan:{setValueAtTime:noop},connect:noop,disconnect:noop}}}
const withAudio={window:{AudioContext:FakeAudio}};vm.createContext(withAudio);vm.runInContext(soundSource,withAudio);assert.equal(audioStarts,0);
for(let i=0;i<22;i++){audioClock+=.04;withAudio.sfx.play('shot')}assert.equal(withAudio.sfx.activeVoices,12,'vier Audio-Stimmen für wichtige Ereignisse reserviert');const beforePriority=audioStarts;withAudio.sfx.play('hurt');assert.ok(audioStarts>beforePriority,'Schaden bleibt bei vielen Schüssen hörbar');assert.ok(withAudio.sfx.activeVoices<=16,'maximal 16 Audio-Stimmen');const beforeMute=audioStarts;withAudio.sfx.toggle();withAudio.sfx.play('shot');assert.equal(audioStarts,beforeMute);pending.splice(0).forEach(o=>o.onended());assert.equal(withAudio.sfx.activeVoices,0);withAudio.sfx.toggle();
const signatures=new Set();for(const style of ['normal','red','white','rose','port','speed','prism','saw','chain','orbit','mortar','wave','frost','vortex','storm','phoenix']){audioClock+=.2;const start=audioLog.length;withAudio.sfx.play('shot',{style,charged:true});assert.ok(audioLog.length>start,style+' hat Klang');signatures.add(audioLog[start].type+':'+Math.round(audioLog[start].from));pending.splice(0).forEach(o=>o.onended())}assert.ok(signatures.size>=14,'Waffen klingen unterschiedlich');
for(const event of ['hit','explode','pickup','card','synergy','heal','charge','charged','ready','block','graze','hurt','die','boss','transition','overdrive','shatter','split','echo','segment']){audioClock+=.4;const before=audioStarts;withAudio.sfx.play(event);assert.ok(audioStarts>before,event+' hat Cue');pending.splice(0).forEach(o=>o.onended())}
assert.ok(audioLog.every(o=>o.stopped>o.started),'alle Stimmen haben ein Ende');

// Die Musik verwendet ein einzelnes Audioelement für alle Durchläufe.
let music,random=.99;
const musicEvents={},played=[];
class FakeMusic{
 constructor(){music=this;this.paused=true}
 addEventListener(name,fn){musicEvents[name]=fn}
 play(){this.paused=false;played.push(this.src);return Promise.resolve()}
 pause(){this.paused=true}
}
const withMusic={Math:{floor:Math.floor,random:()=>random},window:{Audio:FakeMusic,addEventListener:(name,fn)=>{musicEvents[name]=fn}}};
vm.createContext(withMusic);vm.runInContext(soundSource,withMusic);
const soundtrack=withMusic.sfx;
assert.equal(music,undefined,'keine Musik vor Spielstart');
soundtrack.startMusic();
const expectedTracks=fs.readdirSync(__dirname+'/../Pfert/assets/music').filter(name=>name.endsWith('.mp3')).map(name=>'assets/music/'+name).sort();
const trackCount=expectedTracks.length;
for(let i=1;i<trackCount;i++)musicEvents.ended();
const firstRound=played.slice();
assert.equal(new Set(firstRound).size,trackCount,'alle Titel kommen genau einmal');
assert.deepEqual(firstRound.slice().sort(),expectedTracks,'alle Musikdateien sind in der Rotation');
for(const path of firstRound)assert.ok(fs.existsSync(__dirname+'/../Pfert/'+path),path);
random=0;
for(let i=0;i<trackCount;i++)musicEvents.ended();
const secondRound=played.slice(trackCount);
assert.deepEqual(secondRound.slice().sort(),firstRound.slice().sort());
assert.notDeepEqual(secondRound,firstRound,'nächste Runde wird neu gemischt');
assert.notEqual(secondRound[0],firstRound.at(-1),'kein doppelter Titel am Rundenwechsel');
soundtrack.toggleMusic();assert.equal(music.paused,true);
soundtrack.toggleMusic();assert.equal(played.at(-1),secondRound.at(-1),'Fortsetzung beim aktuellen Titel');
soundtrack.stopMusic();assert.equal(music.paused,true);
const stoppedCount=played.length;
musicEvents.ended();musicEvents.keydown();
assert.equal(played.length,stoppedCount,'keine Wiedergabe nach Spielende');
soundtrack.startMusic();
assert.notEqual(played.at(-1),firstRound[0],'Neustart mischt die Playlist neu');

// Jede Karte muss auch ohne andere Karten wirken.
for(let rank=1;rank<=2;rank++){
 reset();a.get().upgrades.fanShot=rank;shoot();assert.equal(a.get().bullets.length,1+2*rank);assert.ok(a.get().bullets[1].vy<0&&a.get().bullets.at(-1).vy>0);
 reset();a.get().upgrades.multiShot=rank;shoot();assert.equal(a.get().bullets.length,1+rank);assert.equal(new Set(a.get().bullets.map(b=>b.y)).size,1+rank);
 reset();a.get().upgrades.snakeShot=rank;shoot();let b=a.get().bullets[0],y=b.y;a.update(.1);assert.ok(Math.abs(b.y-y-Math.sin(.8)*rank*20.4)<1e-8);
 reset();a.get().upgrades.seekShot=rank;let e=placeTarget(400,350,100);shoot();let b2=a.get().bullets[0];a.update(.05);assert.ok(b2.vy>0);
 reset();a.get().upgrades.breakShot=rank;let e2=placeTarget(400,270,100);shoot();a.get().bullets[0].x=400;a.get().bullets[0].y=270;a.update(.001);assert.equal(a.get().bullets.filter(b=>b.generation===1).length,rank+1);
}
reset();a.get().upgrades.multiShot=1;let wide=placeTarget(400,270,100);wide.w=80;wide.h=100;shoot();for(const b of a.get().bullets){b.x=400;b.vx=0;b.vy=0}a.update(.001);assert.ok(Math.abs(wide.hp-(100-.8625*1.1152))<1e-9,'beide Standardschüsse verursachen Schaden');


// Flaschen übergeben die Elementzuordnung an die Darstellung.
reset();let seen=[];const artApi=vm.runInContext("PfertArt",sandbox),originalBottle=artApi.bottle;artApi.bottle=(ctx,p)=>seen.push(p.element||null);for(let i=0;i<=16;i++)a.get().pickups.push({x:500,y:300,w:30,h:42,i});a.render();artApi.bottle=originalBottle;assert.deepEqual(seen,['fire','frost','fire','lightning','lightning',null,'earth','earth','lightning','earth','earth','frost','frost','earth','lightning','fire',null]);

// The run shows stable card codes and exact ranks, then clears them on restart.
{
 reset();
 const codes=[];
 const originalHud=a.art.hud;
 a.art.hud=(ctx,info)=>codes.push(Array.from(info.build,card=>card.code+card.rank));
 try{
  for(const id of ['seekShot','seekShot','mastery']){
   a.setXp(a.get().xpNeeded);a.update(.01);
   a.get().choices[0]=a.cardDefs.find(card=>card.id===id);
   a.chooseCard(0);
  }
  a.render();reset();a.render();
  assert.deepEqual(codes,[['E2','AE1'],[]]);
 }finally{a.art.hud=originalHud}
}

// A regular frost shot stacks against the same enemy, caps, and wears off.
{
 reset();const target=placeTarget(430,268);
 a.get().upgrades.frost=5;
 const chills=[];
 for(let i=0;i<8;i++){
  shoot();a.get().bullets.at(-1).x=430;a.update(.01);
  chills.push(target.slow);
 }
 assert.ok(chills[1]>chills[0]);
 assert.equal(target.slow,.65);
 for(let i=0;i<40;i++)a.update(.05);
 assert.equal(target.slow,0);
}

// Seekers and lasers hit the outer part of a boss after the other parts are destroyed.
for(const weapon of [-1,3]){
 reset();a.startBoss();
 const boss=a.get().boss;
 const outer=boss.parts.reduce((best,part)=>Math.abs(part.aim[1])>Math.abs(best.aim[1])?part:best);
 for(const part of boss.parts)if(part!==outer)a.damagePart(part,part.hp,boss.x,boss.y);
 boss.fire=999;
 a.get().player.effects[3]=weapon===3?10:0;
 a.get().upgrades.seekShot=3;
 const before=outer.hp;
 for(let i=0;i<230;i++){
  if(i%20===0){
   a.get().player.y=boss.y+outer.aim[1]+23;
   shoot();
  }
  a.update(.01);
 }
 assert.ok(outer.hp<before,'Zielverfolgung trifft das verbleibende Segment mit Waffe '+weapon);
}

// The Vizier telegraphs the charge, crosses the playfield, and then retreats.
{
 debugReset();events.keydown({code:'Numpad9',repeat:false,preventDefault:noop});
 const boss=a.get().boss;
 boss.fire=0;
 const layout=a.art.bossLayout(boss.i);
 const totalWeight=layout.reduce((sum,part)=>sum+(part.weight||1),0);
 const expected=layout.map(part=>Math.ceil(90*12.5*.9*.35*(part.weight||1)/totalWeight)*1.2);
 assert.deepEqual(Array.from(boss.parts,part=>part.max),Array.from(expected),'Kalibrierte Segmentlebenspunkte');
 assert.equal(boss.max,boss.parts.reduce((sum,part)=>sum+part.hp,0));
 a.update(.01);
 assert.equal(boss.strike,undefined);
 boss.fire=0;
 a.update(.01);
 const startX=boss.x;
 assert.ok(boss.strike);
 const warningContext=ctx(),strokes=[];
 warningContext.stroke=()=>strokes.push(warningContext.strokeStyle);
 a.art.bossStrikeWarning(warningContext,boss);
 assert.equal(strokes.length,2,'Vorstoßlinie hat Kontur und Signalfarbe');
 for(let i=0;i<22;i++)a.update(.05);
 assert.equal(boss.x,startX);
 a.art.bossStrikeWarning(warningContext,boss);
 assert.equal(strokes.length,4,'Vorstoßlinie bleibt bis kurz vor dem Angriff sichtbar');
 for(let i=0;i<12;i++)a.update(.05);
 assert.equal(startX-boss.x,720);
 a.update(.05);
 assert.ok(boss.x>startX-720);
 a.get().player.x=900;
 for(const part of boss.parts)a.damagePart(part,part.hp,boss.x,boss.y);
 assert.equal(a.get().boss,null);
 a.setTime(100);
 a.setSpawn(.075);
 a.update(.1);
 assert.equal(a.get().enemies.length,0);
 a.update(.1);
 assert.equal(a.get().enemies.length,1);
 a.setTime(900);a.setNextBoss(2000);a.setSpawn(.07);
 a.update(.1);
 assert.equal(a.get().enemies.length,2);
 a.setTime(1800);a.setSpawn(.095);
 a.update(.1);
 assert.equal(a.get().enemies.length,3);
}

// The current enemy rewards encode the three difficulty tiers.
{
 reset();
 for(const [type,tier,value] of [[0,1,1],[3,2,2],[9,3,8]]){
  a.enemy(type);
  const target=a.get().enemies.at(-1);
  Object.assign(target,{x:500,y:270,hp:1,speed:0,fire:999});
  a.get().bullets.push(bullet(500,270));a.update(.01);
  const orb=a.get().orbs.at(-1);
  assert.equal(orb.tier,tier);
  assert.equal(orb.value,value);
 }
}

// Rear waves recur without a warning and can be hit by Rückendeckung.
{
 reset();a.setTime(267.99);
 a.update(.02);
 assert.equal(a.art.rearWaveWarning,undefined);
 const rear=a.get().enemies.filter(unit=>unit.rear);
 assert.equal(rear.length,2);
 assert.ok(rear.every(unit=>unit.x<0&&Math.abs(unit.y-270)>=90));
 for(let step=0;step<9;step++)a.update(.05);
 assert.ok(rear.every(unit=>unit.x>0));
 rear[1].fire=0;a.update(.01);
 assert.ok(a.get().shots.some(s=>s.kind==='sickle'&&s.vx>0),'Heckfledermaus schießt nach rechts');
 a.get().player.y=rear[0].y;
 a.get().upgrades.rear=4;shoot();
 for(let step=0;step<3;step++)a.update(.05);
 assert.ok(rear[0].hp<rear[0].max);
 for(let step=0;step<110;step++)a.update(.05);
 assert.equal(a.get().enemies.filter(unit=>unit.rear).length,0);
 a.setTime(396.99);a.setNextBoss(600);a.update(.02);
 assert.equal(a.get().enemies.filter(unit=>unit.rear).length,2);
}

// Armored blockers slide in, leave an open lane and drift away after 15 seconds.
{
 reset();a.setTime(1027.99);a.setNextBoss(Infinity);a.update(.02);
 const blocker=a.get().enemies.find(unit=>unit.blocker);
 assert.ok(blocker);
 const area=blocker.w*blocker.h/(960*540);
 assert.ok(area>=1/8&&area<=1/7);
 a.get().player.y=440;
 let carpetFired=false;
 for(let step=0;step<100;step++){
  a.update(.05);
  carpetFired||=a.get().shots.some(s=>s.kind==='needle'&&s.age===0&&!s.bonus&&s.vx<0&&s.vy===0&&Math.abs(s.y-blocker.y)===48);
 }
 assert.ok(blocker.x+blocker.w/2<960);
 assert.equal(a.get().hearts,5);
 assert.ok(carpetFired,'Blocker feuert entlang seiner eigenen Bahnen');
 a.render();
 for(let step=0;step<180;step++)a.update(.05);
 assert.ok(a.get().enemies.includes(blocker));
 for(let step=0;step<25;step++)a.update(.05);
 assert.ok(!a.get().enemies.includes(blocker));
 assert.equal(a.get().orbs.length,0,'Abzug ohne Abschuss gibt keine Beute');
 a.setTime(1112.99);a.update(.02);
 assert.ok(a.get().enemies.some(unit=>unit.blocker&&unit.y>blocker.y));
}

// Later card copies lose damage on standard shots and wine specials.
for(const weapon of [-1,0,3]){
 reset();
 if(weapon>=0)a.get().player.effects[weapon]=18;
 a.get().upgrades.multiShot=1;
 a.get().upgrades.fanShot=1;
 shoot(weapon>=0?1:0);
 const attacks=weapon===3?a.get().beams:a.get().bullets;
 const main=Math.max(...attacks.map(attack=>attack.damage));
 assert.equal(attacks.length,4);
 const factor=weapon<0?1:.85;
 assert.equal(attacks.filter(attack=>Math.abs(attack.damage-main*.1152*factor)<1e-9).length,1);
 assert.equal(attacks.filter(attack=>Math.abs(attack.damage-main*.24*factor)<1e-9).length,1);
 assert.equal(attacks.filter(attack=>Math.abs(attack.damage-main*.17*factor)<1e-9).length,1);
}
{
 equip(6);
 const target=placeTarget(400,268,100);
 a.get().upgrades.breakShot=1;shoot(1);
 const shot=a.get().bullets[0];
 shot.x=target.x;shot.vx=0;
 a.update(.01);
 const fragments=a.get().bullets.filter(b=>b.generation===1);
 assert.equal(fragments.filter(b=>b.damage===shot.damage*.21).length,5);
 assert.equal(fragments.filter(b=>b.damage===shot.damage*.126).length,1);
}

// All six projectile profiles appear in both enemy and boss encounters.
for(const [kind,index,bossIndex,weakCount,strongCount] of [
 ['needle',3,0,1,3],['sickle',4,1,1,2],['splitter',2,2,1,1],
 ['mine',5,3,1,1],['pulse',7,4,1,1],['mortar',9,6,1,3]
]){
 reset();
 a.get().player.inv=20;
 const enemy=a.enemy(index,220);enemy.x=700;
 a.enemyAttack(enemy);
 const weak=a.get().shots.filter(s=>s.kind===kind);
 assert.equal(weak.length,weakCount);
 a.render();
 if(kind==='mine'||kind==='splitter'){
  assert.equal(weak[0].burstCount,kind==='mine'?4:3);
  for(let i=0;i<25;i++)a.update(.05);
  assert.equal(a.get().shots.filter(s=>s.kind==='needle'&&!s.bonus).length,kind==='mine'?3:2,'Splitter unterliegen dem Gegnergeschoss-Budget');
 }
 reset();
 if(bossIndex===6){a.startDebugRun();events.keydown({code:'Numpad8',repeat:false,preventDefault:noop})}
 else for(let i=0;i<=bossIndex;i++)a.startBoss();
 a.get().boss.fire=0;a.update(.01);
 const strong=a.get().shots.filter(s=>s.kind===kind);
 assert.equal(strong.length,strongCount);
 if(kind==='pulse')assert.ok(strong[0].w>weak[0].w&&strong[0].h>weak[0].h);
 else if(kind==='mine'||kind==='splitter')assert.ok(strong[0].burstCount>weak[0].burstCount);
 a.render();
}

console.log('OK: Gegnerwellen, sechs Schusstypen, Kartenschaden, Zielbindung und Bossabläufe.');
