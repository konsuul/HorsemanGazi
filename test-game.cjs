'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const noop=()=>{};
const ctx=()=>new Proxy({createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]||noop,set:(o,k,v)=>(o[k]=v,true)});
const events={},elements={};
const makeElement=()=>({classList:{add:noop,remove:noop},innerHTML:'',addEventListener:noop});
elements.game={getContext:ctx};elements.overlay=makeElement();elements.start=makeElement();
let gamepad=null;
const sandbox={navigator:{getGamepads:()=>gamepad?[gamepad]:[]},console,Math,Set,requestAnimationFrame:noop,document:{getElementById:id=>elements[id]||(elements[id]=makeElement()),createElement:()=>({width:0,height:0,getContext:ctx})},window:{addEventListener:(name,fn)=>events[name]=fn}};
vm.createContext(sandbox);vm.runInContext(fs.readFileSync(__dirname+'/art.js','utf8'),sandbox);
const source=fs.readFileSync(__dirname+'/game.js','utf8').replace('})();',
 'globalThis.testApi={reset,update,render,renderTransition,pollGamepad,offerCards,enemy,enemyAttack,startBoss,partHit,activateRage,hurt,keys,chooseCard,cardDefs,fireCharge,get:()=>({selectedCard,lastRare,t,runTime,level,xp,xpNeeded,orbs,choices,upgrades,hearts,score,player,enemies,bullets,beams,shots,pickups,boss,nextBoss,bossCount,state,transition,levelIndex,secret,secretTime,golden,goldenAppeared,secondAppeared,secretType,particles,deaths,arcs,flashes,threat}),setXp:v=>xp=v,setTime:v=>t=v,setFirstSeen:v=>goldenAppeared=v,setRunTime:v=>runTime=v,setNextBoss:v=>nextBoss=v,setSecretTime:v=>secretTime=v,setSpawn:v=>spawn=v,setDrop:v=>drop=v};})();');
vm.runInContext(source,sandbox);const a=sandbox.testApi;
function reset(){a.reset();a.setSpawn(999);a.setDrop(999);a.get().player.autoCooldown=Infinity}
function press(){events.keydown({code:'Space',repeat:false,preventDefault:noop})}
function release(){events.keyup({code:'Space',preventDefault:noop});a.get().player.autoCooldown=Infinity}
function shoot(duration=0){a.fireCharge(duration>0);a.get().player.autoCooldown=Infinity}
function bullet(x,y){return {x,y,vx:0,vy:0,w:10,h:10,pierce:false,damage:1,hit:new Set(),life:1}}
function defeatBoss(){const count=a.get().boss.parts.length;for(let i=0;i<count;i++){const q=a.get(),p=q.boss.parts[i];p.hp=1;q.bullets.push(bullet(q.boss.x+p.aim[0],q.boss.y+p.aim[1]));a.update(.01);if(i<count-1){assert.ok(a.get().boss,'Boss bleibt bis zum letzten Bereich');assert.equal(a.get().boss.parts[i].hp,0,'Bereich '+i+' besiegt')}}if(a.get().state!=='transition')assert.equal(a.get().boss,null)}
for(const [key,index] of [['Numpad1',0],['Numpad2',1],['Numpad3',5],['Numpad4',6]]){reset();events.keydown({code:key,repeat:false,preventDefault:noop});assert.equal(a.get().boss.i,index,'Debug-Bosssprung '+key)}
function finishTransition(){assert.equal(a.get().state,'transition');const before=a.get();const t=before.t,run=before.runTime,secretTime=before.secretTime,orb=before.orbs[0],x=orb?.x;press();a.pollGamepad();a.update(.75);a.renderTransition();a.update(.74);assert.equal(a.get().t,t);assert.equal(a.get().runTime,run);assert.equal(a.get().secretTime,secretTime);assert.equal(orb?.x,x);assert.equal(a.get().player.charging,false);assert.equal(a.get().state,'transition');a.update(.02);a.renderTransition();assert.equal(a.get().transition.switched,true);assert.equal(a.get().player.inv,2);a.update(1.48);assert.equal(a.get().state,'transition');a.update(.01);assert.equal(a.get().state,'playing');assert.equal(a.get().player.inv,2);release();assert.equal(a.get().player.charging,false)}

reset();shoot();assert.equal(a.get().bullets.length,1);assert.equal(a.get().bullets[0].charged,false);
// Tatsächliche Kartenauswahl: Die zusätzlichen Schüsse existieren, liegen ohne Streuflug aber deckungsgleich.
reset();a.setXp(a.get().xpNeeded);a.update(.01);a.get().choices[0]=a.cardDefs.find(card=>card.id==='multiShot');a.chooseCard(0);assert.equal(a.get().upgrades.multiShot,1);a.get().player.autoCooldown=Infinity;shoot();assert.equal(a.get().bullets.length,2,'Doppelter Käse erzeugt zwei Geschosse');assert.equal(a.get().bullets[0].x,a.get().bullets[1].x);assert.notEqual(a.get().bullets[0].y,a.get().bullets[1].y);assert.equal(a.get().bullets[0].vx,a.get().bullets[1].vx);assert.ok(Math.abs(a.get().bullets[0].vy-a.get().bullets[1].vy)<1e-9);
reset();a.get().upgrades.snakeShot=1;shoot();let snake=a.get().bullets[0],snakeY=snake.y;a.update(.1);assert.ok(Math.abs(snake.y-snakeY)>15,'Schlangenlinie schwingt sichtbar');
reset();press();assert.equal(a.get().bullets.length,0,'kein Sonderangriff ohne Wein');release();
for(const i of [0,1,2,3,4,6,7,8,9,10,11,12,13,14,15]){reset();a.get().player.weapon=i;a.get().player.effects[i]=18;press();assert.equal(a.get().player.effects[i],12);assert.ok(a.get().bullets.some(b=>b.charged)||a.get().beams.some(b=>b.charged),'Sonderangriff '+i);events.keydown({code:'Space',repeat:true,preventDefault:noop});assert.equal(a.get().player.effects[i],12);a.render();release()}
reset();a.get().player.weapon=1;a.get().player.effects[1]=18;press();release();press();release();press();release();let count=a.get().bullets.length;press();assert.equal(a.get().player.effects[1],0);assert.equal(a.get().bullets.length,count,'leerer Wein');a.get().player.effects[1]=5;a.get().pickups.push({x:135,y:270,w:30,h:42,i:16});a.update(.01);assert.equal(a.get().player.effects[1],18);release();
reset();a.get().upgrades.magnet=1;let distantBottle={x:400,y:270,w:30,h:42,i:16},distantOrb={x:400,y:270,w:16,h:16,value:1,age:0};a.get().pickups.push(distantBottle);a.get().orbs.push(distantOrb);a.update(.05);assert.ok(distantBottle.x<400);assert.equal(distantOrb.x,400,'Orb hat kleinere Reichweite');
for(let i=0;i<6;i++){reset();let q=a.get();q.pickups.push({x:q.player.x,y:q.player.y,w:30,h:42,i});a.update(.01);assert.equal(a.get().pickups.length,0);if(i<5)assert.ok(a.get().player.effects[i]>0);a.render()}
for(let i=0;i<5;i++){reset();a.get().player.weapon=i;a.get().player.effects[i]=18;shoot();let q=a.get();if(i===0)assert.equal(q.bullets.length,3,'Rotwein-Salve');if(i===1){assert.equal(q.bullets.length,3,'Dreifachfächer beim Tippen');assert.ok(q.bullets[0].vy<0&&q.bullets[2].vy>0)}if(i===2)assert.ok(q.bullets[0].homing);if(i===3){assert.equal(q.bullets.length,0);assert.equal(q.beams.length,1);assert.ok(q.beams[0].life>0)}if(i===4){assert.equal(q.bullets.length,2);assert.ok(q.bullets[0].vx>700)}a.render()}
reset();a.get().player.effects[1]=18;shoot(1);assert.equal(a.get().bullets.length,5,'Weißwein geladen: fünf Richtungen');
reset();a.get().player.effects[0]=18;shoot(1);assert.ok(a.get().bullets[0].blast,'Rotwein geladen: Flächentreffer');
reset();a.get().player.effects[3]=18;a.enemy(0);let target=a.get().enemies[0];target.x=400;target.y=268;target.speed=0;target.hp=.1;shoot();a.update(.01);assert.equal(a.get().enemies.length,0,'Laser trifft Gegner');
for(let i=0;i<10;i++){reset();a.enemy(i);let e=a.get().enemies[0];assert.ok(e.hp>=2,'stärkere Gegner');e.x=135;e.y=270;e.speed=0;e.fire=999;a.update(.01);assert.equal(a.get().hearts,4,'Gegnerkontakt '+i);reset();a.enemy(i);e=a.get().enemies[0];e.x=400;e.y=270;e.speed=0;e.fire=999;e.hp=1;a.get().bullets.push(bullet(400,270));a.update(.01);assert.equal(a.get().enemies.length,0);assert.equal(a.get().deaths.length,1,'Todesanimation');a.render()}
for(const i of [3,5,7,8,9]){reset();a.enemy(i);const e=a.get().enemies[0];e.x=650;e.speed=0;e.fire=0;a.update(.01);assert.ok(a.get().shots.length,'Gegnerangriff '+i)}
for(let i=0;i<5;i++){reset();for(let j=0;j<=i;j++)a.startBoss();a.get().boss.fire=0;a.update(.01);assert.ok(a.get().shots.length);a.render();defeatBoss()}
reset();a.get().orbs.push({x:300,y:400,w:16,h:16,value:3,age:0});a.setTime(419.99);a.setNextBoss(600);a.update(.02);assert.ok(a.get().golden);let q=a.get();q.golden.x=500;q.golden.y=270;q.bullets.push(bullet(500,270));press();a.update(.01);assert.equal(a.get().player.charging,false,'Ladeangriff abgebrochen');finishTransition();assert.equal(a.get().secret,true);assert.equal(a.get().orbs.length,1,'Orb bleibt beim Eintritt');const mainTime=a.get().t;a.update(.1);assert.equal(a.get().t,mainTime);a.render();a.setSecretTime(44.99);a.update(.02);assert.equal(a.get().boss.i,5);a.render();defeatBoss();finishTransition();assert.equal(a.get().secret,false);assert.ok(a.get().orbs.some(o=>o.value===3),'Orb bleibt bei Rückkehr');a.update(.01);assert.ok(a.get().t>mainTime);assert.equal(a.get().golden,null);
reset();a.setTime(419.99);a.setNextBoss(600);a.update(.02);a.get().golden.x=-59;a.update(.05);a.update(.1);assert.equal(a.get().secret,false);assert.equal(a.get().golden,null);
reset();a.setTime(419.99);a.startBoss();a.update(.02);assert.equal(a.get().golden,null);defeatBoss();a.update(.01);assert.ok(a.get().golden);
reset();a.setXp(a.get().xpNeeded);a.update(.02);q=a.get();assert.equal(q.state,'upgrade');assert.equal(q.choices.length,3);assert.equal(new Set(q.choices.map(c=>c.id)).size,3);const frozen=q.t;a.update(2);assert.equal(a.get().t,frozen,'Auswahl pausiert Spiel');const selected=q.choices[0].id;a.chooseCard(0);assert.equal(a.get().upgrades[selected],1);assert.equal(a.get().xpNeeded,15);a.chooseCard(0);assert.equal(a.get().upgrades[selected],1,'kein doppelter Kauf');
a.setRunTime(120);a.setXp(a.get().xpNeeded);a.update(.02);assert.equal(a.get().state,'upgrade');events.keydown({code:'Digit2',repeat:false,preventDefault:noop});assert.equal(a.get().state,'playing');assert.equal(Object.values(a.get().upgrades).reduce((x,y)=>x+y,0),2);
reset();a.get().upgrades.spread=1;shoot();assert.equal(a.get().bullets.length,3,'dauerhafte Flankenschüsse');reset();a.get().upgrades.damage=2;shoot();assert.ok(a.get().bullets[0].damage>1);reset();a.get().upgrades.charge=4;shoot(1.15);assert.ok(a.get().bullets[0].charged);assert.ok(a.get().bullets[0].w>32);
reset();let p=a.get().player;a.get().shots.push({x:p.x+25,y:p.y,vx:0,vy:0,w:10,h:10,life:1});a.update(.01);assert.equal(a.get().shots.length,0);assert.equal(a.get().hearts,5);assert.ok(p.guardFlash>0,'Schutzimpuls wird kurz angezeigt');
for(let i=0;i<5;i++){p.inv=0;a.get().shots.push({x:p.x,y:p.y,vx:0,vy:0,w:8,h:8,life:1});a.update(.01)}assert.equal(a.get().state,'over');reset();assert.equal(a.get().hearts,5);assert.equal(Object.values(a.get().upgrades).reduce((x,y)=>x+y,0),0);
for(let i=0;i<5;i++){reset();a.setTime(i*180);a.update(.01);a.render()}
reset();for(const card of a.cardDefs)if(!card.repeatable)a.get().upgrades[card.id]=card.max;a.setXp(a.get().xpNeeded);a.update(.01);assert.equal(a.get().choices.length,3,'auch nach allen normalen Upgrades drei Karten');assert.ok(a.get().choices.every(c=>c.repeatable));
reset();let targetPickup={x:190,y:270,w:30,h:42,i:1};a.get().pickups.push(targetPickup);a.update(.05);assert.ok(targetPickup.x<185,'Flaschen werden in Reichweite angesaugt');

// New weapon pickups and both tap/charge variants.
assert.equal(a.cardDefs.length,32,'Geschosskarten ergänzt');
for(let i=6;i<16;i++){
 reset();let q=a.get();q.pickups.push({x:135,y:270,w:30,h:42,i});a.update(.01);assert.equal(a.get().player.weapon,i);assert.ok(a.get().player.effects[i]>0);shoot();q=a.get();assert.ok(q.bullets.length||q.beams.length,'Mutator feuert '+i);a.render();
 reset();a.get().player.weapon=i;a.get().player.effects[i]=18;shoot(1);q=a.get();assert.ok(q.bullets.some(b=>b.charged)||q.beams.some(b=>b.charged),'Ladevariante '+i);a.render();
}
function equip(i){reset();a.get().player.weapon=i;a.get().player.effects[i]=18}
function placeTarget(x=400,y=270,hp=100){a.enemy(0);const e=a.get().enemies.at(-1);e.x=x;e.y=y;e.speed=0;e.fire=999;e.hp=hp;e.max=hp;return e}
for(const weapon of [0,1,2,3,4,6,7,8,9,10,11,12,13,14,15]){equip(weapon);for(const id of ['multiShot','fanShot','snakeShot','seekShot','breakShot'])a.get().upgrades[id]=1;shoot(1);const q=a.get(),attacks=q.bullets.length?q.bullets:q.beams;assert.ok(attacks.length>=4,'Wein-Sonderangriff vervielfacht '+weapon);assert.ok(attacks.every(b=>b.seekRank===1&&b.snakeRank===1&&b.breakRank===1),'Karteneffekte auf Wein-Sonderangriff '+weapon);a.render()}
equip(3);a.get().upgrades.breakShot=1;let beamTarget=placeTarget(400,270,1000);shoot(1);a.update(.01);assert.equal(a.get().bullets.filter(b=>b.generation===1).length,2,'Sonderlaser splittert');for(let i=0;i<5;i++)a.update(.03);assert.ok(a.get().bullets.filter(b=>b.generation===1).length<=2,'Laser splittert je Ziel nur einmal');
reset();for(const id of ['multiShot','fanShot','snakeShot','seekShot','breakShot'])a.get().upgrades[id]=1;let target9=placeTarget(400,320,1);shoot();assert.equal(a.get().bullets.length,4);assert.ok(a.get().bullets[0].vy<0&&a.get().bullets[3].vy>0);let shot9=a.get().bullets[0],vy9=shot9.vy;a.update(.05);assert.ok(shot9.vy>vy9,'Verfolgung lenkt zum Gegner');shot9.x=400;shot9.y=target9.y;a.update(.01);let fragments9=a.get().bullets.filter(b=>b.generation===1);assert.equal(fragments9.length,2);assert.ok(fragments9.every(b=>b.seekRank===1&&b.snakeRank===1));a.update(.01);assert.ok(a.get().bullets.every(b=>(b.generation||0)<=1),'keine weitere Splittergeneration');
reset();for(const id of ['multiShot','fanShot','snakeShot','seekShot','breakShot'])a.get().upgrades[id]=3;a.get().player.weapon=0;a.get().player.effects[0]=18;shoot();assert.equal(a.get().bullets.length,3);assert.ok(a.get().bullets.every(b=>!b.standardShot&&!b.seekRank&&!b.breakRank));a.get().player.effects[0]=0;a.get().bullets.length=0;shoot();assert.equal(a.get().bullets.length,10,'Standardschuss nach Wein');a.get().bullets.length=0;shoot(1);assert.ok(a.get().bullets.every(b=>!b.standardShot),'Sonderangriff unverändert');
equip(6);let e=placeTarget(400,268,1);shoot();a.get().bullets[0].x=400;a.update(.01);assert.ok(a.get().bullets.length>=3,'Prisma zerfällt in Splitter');
equip(7);shoot();for(let i=0;i<13;i++)a.update(.05);assert.ok(a.get().bullets[0].vx<0,'Säge kehrt um');
equip(8);let first=placeTarget(400,268,1),second=placeTarget(490,290,100);shoot();a.get().bullets[0].x=400;a.update(.01);assert.ok(second.hp<100,'Kettenblitz springt');assert.ok(a.get().arcs.length>0);
equip(9);shoot();a.update(.1);let orb=a.get().bullets[0],pl=a.get().player;assert.ok(Math.abs(Math.hypot(orb.x-pl.x-22,orb.y-pl.y)-35)<1,'Orbit bleibt am Pfert');
equip(10);shoot();let shell=a.get().bullets[0],vy=shell.vy;a.update(.1);assert.ok(shell.vy>vy,'Mörser folgt Ballistik');
equip(11);shoot();let wave=a.get().bullets[0],height=wave.h;a.update(.1);assert.ok(wave.h>height&&wave.pierce,'Echo-Welle wächst');
equip(12);e=placeTarget(400,268);shoot();a.get().bullets[0].x=400;a.update(.01);assert.ok(e.slow>=.28,'Frost bremst');
equip(13);e=placeTarget(300,268);shoot();let vortex=a.get().bullets[0];vortex.x=300;vortex.vx=0;a.update(.01);let hp=e.hp;for(let i=0;i<8;i++)a.update(.05);assert.ok(e.hp<hp,'Vortex pulsiert mehrfach');
equip(14);shoot();let tapWidth=a.get().beams[0].width;equip(14);shoot(1);assert.ok(a.get().beams[0].width>tapWidth*3,'Gewitter-Ladung ist großer Strahl');assert.equal(a.get().beams.length,1);
equip(15);shoot(1);assert.equal(a.get().bullets.length,3,'Drei Phönixbahnen');let bird=a.get().bullets[0],y=bird.y;a.update(.1);assert.notEqual(bird.y,y);
// Every new card changes actual play.
reset();a.keys.add('KeyD');let px=a.get().player.x;a.update(.1);assert.ok(Math.abs(a.get().player.x-px-26.565)<.01,'Pfert nochmals fünf Prozent schneller');
reset();a.get().upgrades.agility=1;a.keys.add('KeyD');px=a.get().player.x;a.update(.1);assert.ok(a.get().player.x-px>26.565);
reset();a.get().upgrades.magnet=3;let bottle={x:240,y:270,w:30,h:42,i:1};a.get().pickups.push(bottle);a.update(.05);assert.ok(bottle.x<235,'Korkenzieher zieht aus größerer Entfernung');
reset();a.get().upgrades.ricochet=1;shoot();let bouncing=a.get().bullets[0];bouncing.y=81;bouncing.vy=-150;a.update(.05);assert.ok(bouncing.vy>0&&bouncing.bounces===0);
reset();a.get().upgrades.chain=1;first=placeTarget(400,268,1);second=placeTarget(490,280);shoot();a.get().bullets[0].x=400;a.update(.01);assert.ok(second.hp<100,'Kettenkarte wirkt auf Basiswaffe');
reset();a.get().upgrades.frost=1;e=placeTarget(400,268);shoot();a.get().bullets[0].x=400;a.update(.01);assert.ok(e.slow>=.04);
reset();a.get().upgrades.ember=1;e=placeTarget(400,268);shoot();a.get().bullets[0].x=400;a.update(.01);hp=e.hp;a.update(.2);assert.ok(e.hp<hp&&e.burnLife>0);
reset();a.get().upgrades.echo=1;for(let i=0;i<6;i++)shoot();assert.equal(a.get().bullets.length,8,'Sechster Angriff erzeugt Echo');
reset();a.get().upgrades.rear=1;shoot();assert.ok(a.get().bullets.some(b=>b.vx<0));
reset();a.get().upgrades.guard=1;pl=a.get().player;a.get().shots.push({x:pl.x+25,y:pl.y,vx:0,vy:0,w:10,h:10,life:1});a.update(.01);assert.ok(pl.podCooldown<2.5);
reset();a.get().upgrades.execute=1;e=placeTarget(400,268);e.hp=30;shoot();a.get().bullets[0].x=400;a.update(.01);assert.ok(e.hp<29,'Letzter Bissen wirkt');
// Fair curved attacks stop tracking and continue along the tangent.
reset();a.enemy(3);e=a.get().enemies[0];e.x=700;e.y=220;e.speed=0;e.fire=0;a.update(.01);let dart=a.get().shots[0];assert.ok(dart.follow);for(let i=0;i<14;i++)a.update(.05);let tangent=[dart.vx,dart.vy];a.get().player.y=450;a.update(.1);assert.equal(dart.vx,tangent[0]);assert.equal(dart.vy,tangent[1]);
reset();a.enemy(2);e=a.get().enemies[0];e.x=700;e.fire=0;a.update(.01);let lob=a.get().shots[0],initialVy=lob.vy;a.update(.1);assert.ok(lob.vy>initialVy);
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
reset();a.get().upgrades.damage=3;shoot();assert.ok(Math.abs(a.get().bullets[0].damage-1.5*Math.pow(1.12,3))<.0001,'Schaden multipliziert je Rang');
reset();a.get().upgrades.fork=1;e=placeTarget(400,268,1);shoot();a.get().bullets[0].x=400;a.update(.01);assert.equal(a.get().bullets.length,2,'Basisschuss verzweigt');assert.ok(a.get().bullets.every(b=>b.generation===1));second=placeTarget(450,268,100);for(const b of a.get().bullets){b.x=450;b.y=268}a.update(.01);assert.ok(a.get().bullets.length<=2,'Kinder verzweigen nicht endlos');
reset();a.get().upgrades.chain=1;a.get().upgrades.cascade=2;a.get().upgrades.frost=1;a.get().upgrades.ember=1;first=placeTarget(400,268,1);second=placeTarget(490,280,100);shoot();a.get().bullets[0].x=400;a.update(.01);assert.ok(second.hp<99.6,'multiplikativer Kettenschaden');assert.ok(second.slowTime>0&&second.burnLife>0,'Kette überträgt Elemente');
reset();a.get().upgrades.frost=1;a.get().upgrades.ember=1;a.get().upgrades.shatter=1;first=placeTarget(400,268,100);second=placeTarget(445,278,100);shoot();a.get().bullets[0].x=400;a.update(.01);assert.ok(first.shatterCooldown>0&&second.hp<100,'Frost und Glut zünden Flächentreffer');
reset();a.get().upgrades.echo=1;a.get().upgrades.echoForge=1;for(let i=0;i<4;i++)shoot();assert.equal(a.get().bullets.length,6,'vierter Angriff wiederholt echte Geschosse');assert.equal(a.get().bullets.filter(b=>b.echoed).length,2);
equip(3);a.get().upgrades.echoForge=1;for(let i=0;i<4;i++)shoot();assert.equal(a.get().beams.length,6,'auch Laser erhält Echos');assert.equal(a.get().beams.filter(b=>b.echoed).length,2);a.render();
reset();a.get().upgrades.guard=1;a.get().upgrades.orbital=1;shoot(1);assert.equal(a.get().bullets.filter(b=>b.orbit).length,2,'geladener Basisangriff erhält Monde');
// Risk charging is per hostile projectile and activation is explicit.
reset();pl=a.get().player;a.get().shots.push({x:pl.x,y:pl.y+35,vx:0,vy:0,w:8,h:8,life:1});a.update(.01);assert.equal(pl.rage,1);a.update(.01);assert.equal(pl.rage,1,'Vorbeiflug nur einmal gewertet');a.get().shots.push({x:pl.x+25,y:pl.y,vx:0,vy:0,w:8,h:8,life:1});a.update(.01);assert.equal(pl.rage,6,'Satellit lädt Rausch');
pl.rage=100;events.keydown({code:'KeyQ',repeat:false,preventDefault:noop});assert.equal(pl.rage,0);assert.equal(pl.overdrive,8);assert.equal(a.get().shots.length,0);shoot();assert.equal(a.get().bullets.length,3,'Rausch ergänzt Seitenangriffe');assert.ok(a.get().bullets[0].damage>1.3);assert.equal(a.activateRage(),false);a.render();a.update(1);assert.ok(pl.overdrive<8);a.update(8);assert.equal(pl.overdrive,0);
reset();for(let i=0;i<5;i++){a.get().player.inv=0;a.hurt()}const firstRoast=elements.overlay.innerHTML;assert.ok(firstRoast.includes('class="roast"')&&firstRoast.includes('class="comeback"'));reset();for(let i=0;i<5;i++){a.get().player.inv=0;a.hurt()}assert.notEqual(elements.overlay.innerHTML,firstRoast,'Roast wiederholt sich nicht direkt');reset();assert.equal(a.get().player.rage,0);assert.equal(a.get().player.overdrive,0);
// A maximal combination cannot create an unbounded projectile recursion.
equip(6);for(const id of ['fork','chain','cascade','ember','frost','shatter','echoForge','orbital','spread'])a.get().upgrades[id]=2;for(let i=0;i<10;i++)placeTarget(350+i*38,240+i%3*20,500);shoot(1);for(let i=0;i<60;i++)a.update(.05);assert.ok(a.get().bullets.length<=360&&a.get().arcs.length<=36);assert.ok(a.get().bullets.every(b=>Number.isFinite(b.x)&&Number.isFinite(b.y)&&Number.isFinite(b.damage)),'alle Synergiegeschosse bleiben endlich');a.render();
// Visual histories are bounded and do not change collision or lifetime rules.
reset();shoot();for(let i=0;i<20;i++)a.update(.016);assert.ok(a.get().bullets[0].trail.length>1&&a.get().bullets[0].trail.length<=7);a.render();
reset();a.get().shots.push({x:700,y:160,vx:-60,vy:20,w:10,h:10,life:4});for(let i=0;i<16;i++)a.update(.02);assert.ok(a.get().shots[0].trail.length<=4);a.render();
for(const age of [.02,.12,.28,.5,.65]){reset();e=placeTarget(400,268,1);shoot();a.get().bullets[0].x=400;a.update(.01);a.get().deaths[0].age=age;a.render()}
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
autoReset();a.get().player.weapon=0;a.get().player.effects[0]=18;press();assert.equal(a.get().player.attacks,1);assert.equal(a.get().player.effects[0],12);for(let i=0;i<20;i++)a.update(.05);assert.ok(a.get().player.attacks>1,'Dauerfeuer läuft weiter');events.keyup({code:'Space',preventDefault:noop});
autoReset();a.get().player.weapon=0;a.get().player.effects[0]=18;press();events.keyup({code:'Space',preventDefault:noop});assert.equal(a.get().player.attacks,1);a.update(.01);assert.equal(a.get().player.attacks,2,'Automatik läuft weiter');
autoReset();a.get().player.weapon=1;a.get().player.effects[1]=18;a.update(.01);assert.equal(a.get().bullets.length,3,'Automatik nutzt Weinwaffe');
autoReset();a.get().player.weapon=3;a.get().player.effects[3]=18;press();const chargedBeam=a.get().beams[0];a.update(.05);assert.ok(a.get().beams.includes(chargedBeam),'Automatik überschreibt Sonderlaser nicht');assert.ok(a.get().player.attacks>1);events.keyup({code:'Space',preventDefault:noop});
autoReset();a.setXp(a.get().xpNeeded);a.update(.02);assert.equal(a.get().state,'upgrade');let attacks=a.get().player.attacks;a.update(.5);assert.equal(a.get().player.attacks,attacks,'kein Feuer bei Kartenauswahl');a.chooseCard(0);a.update(.01);assert.ok(a.get().player.attacks>attacks);
autoReset();for(let i=0;i<5;i++){a.get().player.inv=0;a.hurt()}attacks=a.get().player.attacks;a.update(1);assert.equal(a.get().player.attacks,attacks,'kein Feuer nach Game Over');
for(const step of [.01,.05]){autoReset();for(let i=0;i<Math.round(2/step);i++)a.update(step);assert.ok(a.get().player.attacks>=8&&a.get().player.attacks<=9,'zeitbasierte Schussfolge')}
// Audio is optional, gesture-initialized, muteable, and bounded.
const soundSource=fs.readFileSync(__dirname+'/sound.js','utf8')+';globalThis.sfx=PfertSound;';
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
for(let i=1;i<8;i++)musicEvents.ended();
const firstRound=played.slice();
assert.equal(new Set(firstRound).size,8,'alle acht Titel kommen genau einmal');
for(const path of firstRound)assert.ok(fs.existsSync(__dirname+'/'+path),path);
random=0;
for(let i=0;i<8;i++)musicEvents.ended();
const secondRound=played.slice(8);
assert.deepEqual(secondRound.slice().sort(),firstRound.slice().sort());
assert.notDeepEqual(secondRound,firstRound,'nächste Runde wird neu gemischt');
assert.notEqual(secondRound[0],firstRound.at(-1),'kein doppelter Titel am Rundenwechsel');
soundtrack.toggle();assert.equal(music.paused,true);
soundtrack.toggle();assert.equal(played.at(-1),secondRound.at(-1),'Fortsetzung beim aktuellen Titel');
soundtrack.stopMusic();assert.equal(music.paused,true);
const stoppedCount=played.length;
musicEvents.ended();musicEvents.keydown();
assert.equal(played.length,stoppedCount,'keine Wiedergabe nach Spielende');
soundtrack.startMusic();
assert.notEqual(played.at(-1),firstRound[0],'Neustart mischt die Playlist neu');

// Jede Karte muss auch ohne andere Karten wirken.
for(let rank=1;rank<=3;rank++){
 reset();a.get().upgrades.fanShot=rank;shoot();assert.equal(a.get().bullets.length,1+2*rank);assert.ok(a.get().bullets[0].vy<0&&a.get().bullets.at(-1).vy>0);
 reset();a.get().upgrades.multiShot=rank;shoot();assert.equal(a.get().bullets.length,1+rank);assert.equal(new Set(a.get().bullets.map(b=>b.y)).size,1+rank);
 reset();a.get().upgrades.snakeShot=rank;shoot();let b=a.get().bullets[0],y=b.y;a.update(.1);assert.ok(Math.abs(b.y-y)>rank*15);
 reset();a.get().upgrades.seekShot=rank;let e=placeTarget(400,350,100);shoot();let b2=a.get().bullets[0];a.update(.05);assert.ok(b2.vy>0);
 reset();a.get().upgrades.breakShot=rank;let e2=placeTarget(400,270,100);shoot();a.get().bullets[0].x=400;a.get().bullets[0].y=270;a.update(.001);assert.equal(a.get().bullets.filter(b=>b.generation===1).length,rank+1);
}
reset();a.get().upgrades.multiShot=1;let wide=placeTarget(400,270,100);wide.w=80;wide.h=100;shoot();for(const b of a.get().bullets){b.x=400;b.vx=0;b.vy=0}a.update(.001);assert.ok(wide.hp<=97,'beide Standardschüsse verursachen Schaden');


// Flaschen übergeben die Elementzuordnung an die Darstellung.
reset();let seen=[];const artApi=vm.runInContext("PfertArt",sandbox),originalBottle=artApi.bottle;artApi.bottle=(ctx,p)=>seen.push(p.element||null);for(let i=0;i<=16;i++)a.get().pickups.push({x:500,y:300,w:30,h:42,i});a.render();artApi.bottle=originalBottle;assert.deepEqual(seen,['fire','frost','fire','lightning','lightning',null,'earth','earth','lightning','earth','earth','frost','frost','earth','lightning','fire',null]);

console.log('OK: 5 Herzen, 15 Waffen, Sonderangriffe, Dauerfeuer, Elementarkombinationen, Synergien, Käserausch, Geheimlevel, Bosssegmente und Effektbudgets.');

// Image loading never blocks gameplay and preserves the procedural fallback.
(async()=>{
 const loader=fs.readFileSync(__dirname+'/assets.js','utf8')+';globalThis.assets=PfertAssets;';
 const absent={};vm.createContext(absent);vm.runInContext(loader,absent);await absent.assets.ready;assert.equal(absent.assets.failures.length,6);assert.equal(absent.assets.get('city'),null);
 const success={Image:class{set src(path){this.path=path;queueMicrotask(()=>this.onload())}}};vm.createContext(success);vm.runInContext(loader,success);await success.assets.ready;assert.equal(success.assets.failures.length,0);assert.ok(success.assets.get('characters'));assert.equal(success.assets.get('horse').path,'assets/horse-v2.png');assert.equal(success.assets.get('industry').path,'assets/ruhrgebiet-v1.png','erstes Ruhrpott-Bild bleibt erhalten');assert.equal(success.assets.get('industryNight').path,'assets/ruhrgebiet-nachtschicht-v1.png','zweites Ruhrpott-Bild ist eigenständig');assert.notEqual(success.assets.get('industry'),success.assets.get('industryNight'));
 const requested=[];sandbox.PfertAssets={frames:success.assets.frames,effectFrames:success.assets.effectFrames,get(id){requested.push(id);return {width:1672,height:941}}};sandbox.previewContext=ctx();vm.runInContext('PfertArt.background(previewContext,0,1,1)',sandbox);assert.ok(requested.includes('industry'));assert.ok(!requested.includes('industryNight'));requested.length=0;vm.runInContext('PfertArt.background(previewContext,0,1,2)',sandbox);assert.ok(requested.includes('industryNight'));assert.ok(!requested.includes('industry'));delete sandbox.PfertAssets;
assert.equal(success.assets.frames.length,16);assert.equal(success.assets.effectFrames.length,16);
 const broken={Image:class{set src(path){queueMicrotask(()=>this.onerror())}}};vm.createContext(broken);vm.runInContext(loader,broken);await broken.assets.ready;assert.equal(broken.assets.failures.length,6);
 const atlas=fs.readFileSync(__dirname+'/assets/characters-v1.png');const width=atlas.readUInt32BE(16),height=atlas.readUInt32BE(20);for(const r of success.assets.frames)assert.ok(r.x>=0&&r.y>=0&&r.w>0&&r.h>0&&r.x+r.w<=width&&r.y+r.h<=height,'Zuschnitt liegt im Atlas');
 const effects=fs.readFileSync(__dirname+'/assets/effects-v1.png'),ew=effects.readUInt32BE(16),eh=effects.readUInt32BE(20);for(const r of success.assets.effectFrames)assert.ok(r.x>=0&&r.y>=0&&r.w>0&&r.h>0&&r.x+r.w<=ew&&r.y+r.h<=eh,'VFX-Zuschnitt liegt im Atlas');
 const horse=fs.readFileSync(__dirname+'/assets/horse-v2.png');assert.equal(horse.readUInt32BE(16),672);assert.equal(horse.readUInt32BE(20),264);assert.equal(horse[25],6,'Pferd hat einen Alphakanal');
 assert.equal(atlas[25],6,'Figuren haben einen Alphakanal');assert.equal(effects[25],6,'VFX haben einen Alphakanal');
 assert.equal(elements.overlay.classList!==undefined,true);console.log('OK: Asset-Laden, Ladefehler, Fallback, Figuren-/VFX-Zuschnitte und Alpha.');
})().catch(error=>{console.error(error);process.exitCode=1});

// Eingaben und gewichtete Synergien
function pad(){return {mapping:'standard',axes:[0,0],buttons:Array.from({length:16},()=>({pressed:false}))}}
gamepad=pad();a.pollGamepad();reset();let x=a.get().player.x;gamepad.axes[0]=1;a.pollGamepad();a.update(.05);assert.ok(a.get().player.x>x,'Stick bewegt');gamepad.axes[0]=.1;a.pollGamepad();x=a.get().player.x;a.update(.05);assert.equal(a.get().player.x,x,'Totzone');a.get().player.weapon=0;a.get().player.effects[0]=18;gamepad.buttons[0].pressed=true;a.pollGamepad();assert.equal(a.get().player.effects[0],12,'A löst aus');a.pollGamepad();assert.equal(a.get().player.effects[0],12,'Halten löst nicht erneut aus');gamepad.buttons[0].pressed=false;a.pollGamepad();assert.ok(a.get().bullets.length);a.get().player.rage=100;gamepad.buttons[1].pressed=true;a.pollGamepad();assert.ok(a.get().player.overdrive>0,'B aktiviert Käserausch');gamepad.buttons[1].pressed=false;a.pollGamepad();
a.setXp(a.get().xpNeeded);a.update(.01);assert.equal(a.get().selectedCard,0);events.keydown({code:'ArrowRight',repeat:false,preventDefault:noop});assert.equal(a.get().selectedCard,1);events.keydown({code:'Enter',repeat:false,preventDefault:noop});assert.equal(a.get().state,'playing');
a.setRunTime(120);a.setXp(a.get().xpNeeded);a.update(.01);a.pollGamepad();gamepad.buttons[15].pressed=true;a.pollGamepad();assert.equal(a.get().selectedCard,1);a.pollGamepad();assert.equal(a.get().selectedCard,1,'gehaltene Richtung wiederholt nicht');gamepad.buttons[15].pressed=false;a.pollGamepad();gamepad.buttons[0].pressed=true;a.pollGamepad();assert.equal(a.get().state,'playing');gamepad.buttons[0].pressed=false;a.pollGamepad();
reset();a.get().upgrades.spread=1;a.setRunTime(120);a.setXp(10);a.offerCards();assert.equal(a.get().choices[0].id,'fork');a.chooseCard(1);for(const id of Object.keys(a.get().upgrades))a.get().upgrades[id]=0;a.get().upgrades.spread=1;a.setXp(15);a.offerCards();assert.equal(a.get().choices[0].id,'fork','einzige berechtigte Karte bleibt verfügbar');
console.log('OK: Controller, Tastatur und seltene Karten gezielt geprüft.');

// Orb-Werte, Einsammeln und Stufenfortschritt.
for(let i=0;i<10;i++){reset();a.enemy(i);let e=a.get().enemies[0];e.x=500;e.y=270;e.hp=1;e.elite=false;a.get().bullets.push(bullet(500,270));a.update(.01);assert.equal(a.get().orbs.length,1);assert.equal(a.get().orbs[0].value,[1,1,1,2,2,2,3,3,3,4][i]);}
reset();a.enemy(9);let elite=a.get().enemies[0];elite.x=500;elite.y=270;elite.hp=1;elite.elite=true;a.get().bullets.push(bullet(500,270));a.update(.01);assert.equal(a.get().orbs[0].value,8);
reset();a.startBoss();defeatBoss();assert.equal(a.get().orbs.filter(o=>o.value===10).length,1);
reset();a.setRunTime(1000);a.update(.01);assert.equal(a.get().state,'playing','keine zeitgesteuerte Karte');a.get().orbs.push({x:135,y:270,w:16,h:16,value:50,age:0});a.update(.01);assert.equal(a.get().state,'upgrade');a.chooseCard(0);assert.equal(a.get().level,2);assert.equal(a.get().xp,52.5);assert.equal(a.get().xpNeeded,15);assert.equal(a.get().state,'upgrade');a.chooseCard(0);assert.equal(a.get().level,3);assert.equal(a.get().xp,37.5);assert.equal(a.get().xpNeeded,23);assert.equal(a.get().state,'upgrade');a.chooseCard(0);assert.equal(a.get().level,4);assert.equal(a.get().xp,14.5);assert.equal(a.get().xpNeeded,35);assert.equal(a.get().state,'playing');
console.log('OK: Orbs und Stufenfortschritt.');
reset();let previousNeed=10;for(let i=0;i<100;i++){a.setXp(a.get().xpNeeded);a.update(.01);assert.equal(a.get().state,'upgrade');a.chooseCard(0);const current=a.get().xpNeeded;assert.ok(Number.isFinite(current)&&current>=previousNeed&&current<=1500);if(a.get().level===10)assert.equal(current,Math.ceil(previousNeed*1.12));previousNeed=current}assert.equal(a.get().xpNeeded,1500,'Endlosfortschritt bleibt begrenzt');

// Orb-Bewegung und Notfallknopf.
reset();a.enemy(0);let walker=a.get().enemies[0];walker.x=500;walker.y=270;walker.speed=80;walker.hp=1;a.get().bullets.push(bullet(500,270));a.update(.01);let moving=a.get().orbs[0];assert.equal(moving.speed,40);let start=moving.x;a.update(.1);assert.ok(Math.abs(moving.x-(start-4))<1e-8);moving.x=-7;moving.speed=40;a.update(.1);assert.ok(!a.get().orbs.includes(moving),'Orb verlässt das Spielfeld');
reset();a.get().orbs.push({x:190,y:270,w:16,h:16,value:1,speed:40,age:0});let near=a.get().orbs[0];a.update(.05);assert.ok(near.x<185,'Magnet zieht den wandernden Orb an');
reset();a.startBoss();defeatBoss();assert.equal(a.get().orbs.find(o=>o.value===10).speed,32.5);
reset();a.startBoss();const survivingBoss=a.get().boss;for(let i=0;i<2;i++){a.enemy(i);let e=a.get().enemies.at(-1);e.x=500+i*80;e.y=200}a.get().shots.push({x:400,y:200,vx:0,vy:0,w:8,h:8,life:2});const savedOrb={x:350,y:200,w:16,h:16,value:3,speed:20,age:0},savedPickup={x:350,y:300,w:30,h:42,i:1};a.get().orbs.push(savedOrb);a.get().pickups.push(savedPickup);a.get().player.rage=100;assert.equal(a.activateRage(),true);assert.equal(a.get().enemies.length,0);assert.equal(a.get().shots.length,0);assert.equal(a.get().boss,survivingBoss);assert.equal(a.get().orbs.length,3);assert.ok(a.get().orbs.includes(savedOrb));assert.ok(a.get().pickups.includes(savedPickup));assert.ok(a.get().score>0);
reset();a.enemy(0);a.get().enemies[0].x=500;a.get().player.rage=100;a.setSpawn(0);a.activateRage();a.update(.01);assert.equal(a.get().enemies.length,1,'regulärer Spawn-Timer bleibt aktiv');
reset();a.hurt();a.get().player.inv=0;a.hurt();a.get().player.inv=0;a.hurt();a.get().player.rage=100;assert.ok(a.activateRage());assert.equal(a.get().hearts,4,'Käserausch heilt zwei Herzen');
reset();a.hurt();a.get().player.rage=100;a.activateRage();assert.equal(a.get().hearts,5,'Käserausch überschreitet Herzmaximum nicht');
reset();shoot();assert.equal(a.get().bullets[0].damage,1.5,'Grundschaden');a.startBoss();assert.ok(a.get().boss.max>=450,'Bosssegmente erhalten erhöhte Lebenspunkte');reset();
let rects=[];let hudctx=ctx();hudctx.fillRect=(x,y,w,h)=>rects.push([x,y,w,h]);let snapshot=a.get();let hud={...snapshot,maxHearts:5,weapon:-1,weaponNames:[],bosses:[],secret:false,secretType:0,secretTime:0,notice:0,noticeText:'',combo:0,threat:0,elements:{}};for(const [value,width] of [[0,0],[5,480],[10,960],[15,960]]){rects=[];hud.xp=value;hud.xpNeeded=10;vm.runInContext("PfertArt",sandbox).hud(hudctx,hud);assert.ok(rects.some(r=>r[0]===0&&r[1]===533&&r[2]===width),'Fortschrittsbreite '+value)}
console.log('OK: Orb-Bewegung, Fortschrittsbalken und Notfallknopf.');
require('node:child_process').execFileSync(process.execPath,[__dirname+'/test-balance.cjs'],{stdio:'inherit'});
