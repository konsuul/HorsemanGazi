'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const noop=()=>{};
const ctx=()=>new Proxy({createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]||noop,set:(o,k,v)=>(o[k]=v,true)});
const events={},elements={};
const makeElement=()=>({classList:{add:noop,remove:noop},innerHTML:'',addEventListener:noop});
elements.game={getContext:ctx};elements.overlay=makeElement();elements.start=makeElement();
const sandbox={console,Math,Set,requestAnimationFrame:noop,document:{getElementById:id=>elements[id]||(elements[id]=makeElement()),createElement:()=>({width:0,height:0,getContext:ctx})},window:{addEventListener:(name,fn)=>events[name]=fn}};
vm.createContext(sandbox);vm.runInContext(fs.readFileSync(__dirname+'/art.js','utf8'),sandbox);
const source=fs.readFileSync(__dirname+'/game.js','utf8').replace('})();',
 'globalThis.testApi={reset,update,render,enemy,enemyAttack,startBoss,partHit,activateRage,hurt,keys,chooseCard,cardDefs,fireCharge,get:()=>({t,runTime,nextUpgrade,choices,upgrades,hearts,score,player,enemies,bullets,beams,shots,pickups,boss,nextBoss,bossCount,state,levelIndex,secret,secretTime,golden,goldenAppeared,secondAppeared,secretType,particles,deaths,arcs,flashes,threat}),setTime:v=>t=v,setFirstSeen:v=>goldenAppeared=v,setRunTime:v=>runTime=v,setNextBoss:v=>nextBoss=v,setSecretTime:v=>secretTime=v,setSpawn:v=>spawn=v,setDrop:v=>drop=v};})();');
vm.runInContext(source,sandbox);const a=sandbox.testApi;
function reset(){a.reset();a.setSpawn(999);a.setDrop(999);a.get().player.autoCooldown=Infinity}
function press(){events.keydown({code:'Space',repeat:false,preventDefault:noop})}
function release(){events.keyup({code:'Space',preventDefault:noop});a.get().player.autoCooldown=Infinity}
function shoot(duration=0){if(duration===0){a.fireCharge();a.get().player.autoCooldown=Infinity;return}press();for(let i=0;i<Math.round(duration/.05);i++)a.update(.05);release()}
function bullet(x,y){return {x,y,vx:0,vy:0,w:10,h:10,pierce:false,damage:1,hit:new Set(),life:1}}
function defeatBoss(){const count=a.get().boss.parts.length;for(let i=0;i<count;i++){const q=a.get(),p=q.boss.parts[i];p.hp=1;q.bullets.push(bullet(q.boss.x+p.aim[0],q.boss.y+p.aim[1]));a.update(.01);if(i<count-1){assert.ok(a.get().boss,'Boss bleibt bis zum letzten Bereich');assert.equal(a.get().boss.parts[i].hp,0,'Bereich '+i+' besiegt')}}assert.equal(a.get().boss,null)}

reset();shoot();assert.equal(a.get().bullets.length,1);assert.equal(a.get().bullets[0].charged,false);
reset();press();for(let i=0;i<30;i++)a.update(.05);assert.equal(a.get().bullets.length,0);release();assert.ok(a.get().bullets[0].w>14);assert.ok(a.get().bullets[0].vx>490);
reset();press();events.blur();release();assert.equal(a.get().bullets.length,0);
for(let i=0;i<6;i++){reset();let q=a.get();q.pickups.push({x:q.player.x,y:q.player.y,w:30,h:42,i});a.update(.01);assert.equal(a.get().pickups.length,0);if(i<5)assert.ok(a.get().player.effects[i]>0);a.render()}
for(let i=0;i<5;i++){reset();a.get().player.weapon=i;a.get().player.effects[i]=18;shoot();let q=a.get();if(i===0)assert.equal(q.bullets.length,3,'Rotwein-Salve');if(i===1){assert.equal(q.bullets.length,3,'Dreifachfächer beim Tippen');assert.ok(q.bullets[0].vy<0&&q.bullets[2].vy>0)}if(i===2)assert.ok(q.bullets[0].homing);if(i===3){assert.equal(q.bullets.length,0);assert.equal(q.beams.length,1);assert.ok(q.beams[0].life>0)}if(i===4){assert.equal(q.bullets.length,2);assert.ok(q.bullets[0].vx>700)}a.render()}
reset();a.get().player.effects[1]=18;shoot(1);assert.equal(a.get().bullets.length,5,'Weißwein geladen: fünf Richtungen');
reset();a.get().player.effects[0]=18;shoot(1);assert.ok(a.get().bullets[0].blast,'Rotwein geladen: Flächentreffer');
reset();a.get().player.effects[3]=18;a.enemy(0);let target=a.get().enemies[0];target.x=400;target.y=268;target.speed=0;target.hp=1;shoot();a.update(.01);assert.equal(a.get().enemies.length,0,'Laser trifft Gegner');
for(let i=0;i<10;i++){reset();a.enemy(i);let e=a.get().enemies[0];assert.ok(e.hp>=2,'stärkere Gegner');e.x=135;e.y=270;e.speed=0;e.fire=999;a.update(.01);assert.equal(a.get().hearts,4,'Gegnerkontakt '+i);reset();a.enemy(i);e=a.get().enemies[0];e.x=400;e.y=270;e.speed=0;e.fire=999;e.hp=1;a.get().bullets.push(bullet(400,270));a.update(.01);assert.equal(a.get().enemies.length,0);assert.equal(a.get().deaths.length,1,'Todesanimation');a.render()}
for(const i of [3,5,7,8,9]){reset();a.enemy(i);const e=a.get().enemies[0];e.x=650;e.speed=0;e.fire=0;a.update(.01);assert.ok(a.get().shots.length,'Gegnerangriff '+i)}
for(let i=0;i<5;i++){reset();for(let j=0;j<=i;j++)a.startBoss();a.get().boss.fire=0;a.update(.01);assert.ok(a.get().shots.length);a.render();defeatBoss()}
reset();a.setTime(419.99);a.setNextBoss(600);a.update(.02);assert.ok(a.get().golden);let q=a.get();q.golden.x=500;q.golden.y=270;q.bullets.push(bullet(500,270));a.update(.01);assert.equal(a.get().secret,true);const mainTime=a.get().t;a.update(.1);assert.equal(a.get().t,mainTime);a.render();a.setSecretTime(44.99);a.update(.02);assert.equal(a.get().boss.i,5);a.render();defeatBoss();assert.equal(a.get().secret,false);a.update(.01);assert.ok(a.get().t>mainTime);assert.equal(a.get().golden,null);
reset();a.setTime(419.99);a.setNextBoss(600);a.update(.02);a.get().golden.x=-59;a.update(.05);a.update(.1);assert.equal(a.get().secret,false);assert.equal(a.get().golden,null);
reset();a.setTime(419.99);a.startBoss();a.update(.02);assert.equal(a.get().golden,null);defeatBoss();a.update(.01);assert.ok(a.get().golden);
reset();a.setRunTime(59.99);a.update(.02);q=a.get();assert.equal(q.state,'upgrade');assert.equal(q.choices.length,3);assert.equal(new Set(q.choices.map(c=>c.id)).size,3);const frozen=q.t;a.update(2);assert.equal(a.get().t,frozen,'Auswahl pausiert Spiel');const selected=q.choices[0].id;a.chooseCard(0);assert.equal(a.get().upgrades[selected],1);assert.equal(a.get().nextUpgrade,120);a.chooseCard(0);assert.equal(a.get().upgrades[selected],1,'kein doppelter Kauf');
a.setRunTime(119.99);a.update(.02);assert.equal(a.get().state,'upgrade');events.keydown({code:'Digit2',repeat:false,preventDefault:noop});assert.equal(a.get().state,'playing');assert.equal(Object.values(a.get().upgrades).reduce((x,y)=>x+y,0),2);
reset();a.get().upgrades.spread=1;shoot();assert.equal(a.get().bullets.length,3,'dauerhafte Flankenschüsse');reset();a.get().upgrades.damage=2;shoot();assert.ok(a.get().bullets[0].damage>1);reset();a.get().upgrades.charge=4;shoot(1.15);assert.ok(a.get().bullets[0].charged);assert.ok(a.get().bullets[0].w>32);
reset();let p=a.get().player;a.get().shots.push({x:p.x+25,y:p.y,vx:0,vy:0,w:10,h:10,life:1});a.update(.01);assert.equal(a.get().shots.length,0);assert.equal(a.get().hearts,5);assert.ok(p.guardFlash>0,'Schutzimpuls wird kurz angezeigt');
for(let i=0;i<5;i++){p.inv=0;a.get().shots.push({x:p.x,y:p.y,vx:0,vy:0,w:8,h:8,life:1});a.update(.01)}assert.equal(a.get().state,'over');reset();assert.equal(a.get().hearts,5);assert.equal(Object.values(a.get().upgrades).reduce((x,y)=>x+y,0),0);
for(let i=0;i<5;i++){reset();a.setTime(i*180);a.update(.01);a.render()}
reset();for(const card of a.cardDefs)if(!card.repeatable)a.get().upgrades[card.id]=card.max;a.setRunTime(60);a.update(.01);assert.equal(a.get().choices.length,3,'auch nach allen normalen Upgrades drei Karten');assert.ok(a.get().choices.every(c=>c.repeatable));
reset();let targetPickup={x:190,y:270,w:30,h:42,i:1};a.get().pickups.push(targetPickup);a.update(.05);assert.ok(targetPickup.x<185,'Flaschen werden in Reichweite angesaugt');

// New weapon pickups and both tap/charge variants.
assert.equal(a.cardDefs.length,27,'fünf neue Synergie-Karten');
for(let i=6;i<16;i++){
 reset();let q=a.get();q.pickups.push({x:135,y:270,w:30,h:42,i});a.update(.01);assert.equal(a.get().player.weapon,i);assert.ok(a.get().player.effects[i]>0);shoot();q=a.get();assert.ok(q.bullets.length||q.beams.length,'Mutator feuert '+i);a.render();
 reset();a.get().player.weapon=i;a.get().player.effects[i]=18;shoot(1);q=a.get();assert.ok(q.bullets.some(b=>b.charged)||q.beams.some(b=>b.charged),'Ladevariante '+i);a.render();
}
function equip(i){reset();a.get().player.weapon=i;a.get().player.effects[i]=18}
function placeTarget(x=400,y=270,hp=100){a.enemy(0);const e=a.get().enemies.at(-1);e.x=x;e.y=y;e.speed=0;e.fire=999;e.hp=hp;e.max=hp;return e}
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
reset();a.get().upgrades.magnet=3;let bottle={x:240,y:270,w:30,h:42,i:1};a.get().pickups.push(bottle);a.update(.05);assert.ok(bottle.x<230,'Korkenzieher zieht aus größerer Entfernung');
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
reset();a.setFirstSeen(true);a.setTime(839.99);a.setNextBoss(900);a.update(.02);q=a.get();assert.equal(q.golden.kind,2,'Grubenlampe bei Minute 14');q.golden.x=500;q.golden.y=270;q.bullets.push(bullet(500,270));a.update(.01);assert.equal(a.get().secretType,2);const returnTime=a.get().t;a.setSecretTime(59.99);a.update(.02);assert.equal(a.get().boss.i,6);a.render();defeatBoss();assert.equal(a.get().secret,false);assert.equal(a.get().nextBoss,900);assert.equal(a.get().t,returnTime);a.update(.01);assert.equal(a.get().golden,null,'zweiter Zugang erscheint nur einmal');
reset();a.setFirstSeen(true);a.setTime(839.99);a.setNextBoss(900);a.update(.02);a.get().golden.x=500;a.get().golden.y=268;a.get().player.weapon=3;a.get().player.effects[3]=18;shoot();a.update(.01);assert.equal(a.get().secretType,2,'Laser kann Grubenlampe treffen');
reset();a.get().player.weapon=1;a.get().player.effects[1]=18;for(let i=0;i<120;i++)shoot();assert.ok(a.get().bullets.length<=360);a.update(.01);assert.ok(a.get().particles.length<=260&&a.get().flashes.length<=28,'Effektbudgets begrenzt');
reset();a.setTime(840);a.setNextBoss(900);a.update(.01);assert.equal(a.get().golden.kind,1,'verspäteter erster Zugang geht nicht verloren');a.get().golden.x=-59;a.update(.05);a.update(.01);assert.equal(a.get().golden.kind,2,'zweiter Zugang wartet auf ersten');
// Five-heart rules, motivational roasts and rare-card prerequisites.
reset();assert.equal(a.get().hearts,5);a.hurt();assert.equal(a.get().hearts,4);a.get().pickups.push({x:135,y:270,i:5,w:30,h:42});a.update(.01);assert.equal(a.get().hearts,5);a.get().pickups.push({x:135,y:270,i:5,w:30,h:42});a.update(.01);assert.equal(a.get().hearts,5,'Heilung bleibt bei fünf');
reset();a.get().upgrades.spread=1;a.setRunTime(119.99);a.update(.02);assert.ok(a.get().choices.some(c=>c.id==='fork'),'passende seltene Karte angeboten');a.chooseCard(a.get().choices.findIndex(c=>c.id==='fork'));assert.equal(a.get().upgrades.fork,1);
reset();a.setRunTime(119.99);a.update(.02);assert.ok(a.get().choices.every(c=>!c.rare),'keine unpassende Synergie');
reset();a.get().upgrades.damage=3;shoot();assert.ok(Math.abs(a.get().bullets[0].damage-Math.pow(1.12,3))<.0001,'Schaden multipliziert je Rang');
reset();a.get().upgrades.fork=1;e=placeTarget(400,268,1);shoot();a.get().bullets[0].x=400;a.update(.01);assert.equal(a.get().bullets.length,2,'Basisschuss verzweigt');assert.ok(a.get().bullets.every(b=>b.generation===1));second=placeTarget(450,268,100);for(const b of a.get().bullets){b.x=450;b.y=268}a.update(.01);assert.ok(a.get().bullets.length<=2,'Kinder verzweigen nicht endlos');
reset();a.get().upgrades.chain=1;a.get().upgrades.cascade=2;a.get().upgrades.frost=1;a.get().upgrades.ember=1;first=placeTarget(400,268,1);second=placeTarget(490,280,100);shoot();a.get().bullets[0].x=400;a.update(.01);assert.ok(second.hp<99.6,'multiplikativer Kettenschaden');assert.ok(second.slowTime>0&&second.burnLife>0,'Kette überträgt Elemente');
reset();a.get().upgrades.frost=1;a.get().upgrades.ember=1;a.get().upgrades.shatter=1;first=placeTarget(400,268,100);second=placeTarget(445,278,100);shoot();a.get().bullets[0].x=400;a.update(.01);assert.ok(first.shatterCooldown>0&&second.hp<100,'Frost und Glut zünden Flächentreffer');
reset();a.get().upgrades.echo=1;a.get().upgrades.echoForge=1;for(let i=0;i<4;i++)shoot();assert.equal(a.get().bullets.length,6,'vierter Angriff wiederholt echte Geschosse');assert.equal(a.get().bullets.filter(b=>b.echoed).length,2);
equip(3);a.get().upgrades.echoForge=1;for(let i=0;i<4;i++)shoot();assert.equal(a.get().beams.length,3,'auch Laser erhält Echos');assert.ok(a.get().beams[1].offset);a.render();
reset();a.get().upgrades.guard=1;a.get().upgrades.orbital=1;shoot(1);assert.equal(a.get().bullets.filter(b=>b.orbit).length,2,'geladener Basisangriff erhält Monde');
// Risk charging is per hostile projectile and activation is explicit.
reset();pl=a.get().player;a.get().shots.push({x:pl.x,y:pl.y+35,vx:0,vy:0,w:8,h:8,life:1});a.update(.01);assert.equal(pl.rage,2);a.update(.01);assert.equal(pl.rage,2,'Vorbeiflug nur einmal gewertet');a.get().shots.push({x:pl.x+25,y:pl.y,vx:0,vy:0,w:8,h:8,life:1});a.update(.01);assert.equal(pl.rage,12,'Satellit lädt Rausch');
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
autoReset();press();for(let i=0;i<20;i++)a.update(.05);assert.equal(a.get().player.attacks,0,'Laden pausiert Dauerfeuer');events.keyup({code:'Space',preventDefault:noop});assert.equal(a.get().player.attacks,1);assert.ok(a.get().bullets[0].charged,'Loslassen feuert Ladung');for(let i=0;i<20;i++)a.update(.02);assert.ok(a.get().player.attacks>1,'Dauerfeuer setzt nach Ladung wieder ein');assert.ok(a.get().bullets.some(b=>!b.charged));
autoReset();press();events.keyup({code:'Space',preventDefault:noop});assert.equal(a.get().player.attacks,0,'kurzer Tap erzeugt keinen Zusatzschuss');a.update(.01);assert.equal(a.get().player.attacks,1,'Automatik läuft weiter');
autoReset();a.get().player.weapon=1;a.get().player.effects[1]=18;a.update(.01);assert.equal(a.get().bullets.length,3,'Automatik nutzt Weinwaffe');
autoReset();a.get().player.weapon=3;a.get().player.effects[3]=18;press();for(let i=0;i<30;i++)a.update(.05);events.keyup({code:'Space',preventDefault:noop});const chargedBeam=a.get().beams[0];for(let i=0;i<12;i++)a.update(.05);assert.equal(a.get().beams[0],chargedBeam,'Automatik überschreibt Ladelaser nicht');for(let i=0;i<20;i++)a.update(.05);assert.ok(a.get().player.attacks>1,'Laserautomatik setzt wieder ein');
autoReset();a.setRunTime(59.99);a.update(.02);assert.equal(a.get().state,'upgrade');let attacks=a.get().player.attacks;a.update(.5);assert.equal(a.get().player.attacks,attacks,'kein Feuer bei Kartenauswahl');a.chooseCard(0);a.update(.01);assert.ok(a.get().player.attacks>attacks);
autoReset();for(let i=0;i<5;i++){a.get().player.inv=0;a.hurt()}attacks=a.get().player.attacks;a.update(1);assert.equal(a.get().player.attacks,attacks,'kein Feuer nach Game Over');
for(const step of [.01,.05]){autoReset();for(let i=0;i<Math.round(2/step);i++)a.update(step);assert.ok(a.get().player.attacks>=8&&a.get().player.attacks<=9,'zeitbasierte Schussfolge')}
// Audio is optional, gesture-initialized, muteable, and bounded.
const soundSource=fs.readFileSync(__dirname+'/sound.js','utf8')+';globalThis.sfx=PfertSound;';
const noAudio={window:{}};vm.createContext(noAudio);vm.runInContext(soundSource,noAudio);assert.doesNotThrow(()=>noAudio.sfx.play('shot'));
let audioStarts=0,audioClock=0;const pending=[],audioLog=[];
function fakeSource(type){const o={type,connect:noop,disconnect:noop,start(time){audioStarts++;o.started=time;audioLog.push(o)},stop(time){o.stopped=time;pending.push(o)}};o.frequency={setValueAtTime(v){o.from=v},exponentialRampToValueAtTime(v){o.to=v}};return o}
class FakeAudio{constructor(){this.state='running';this.destination={};this.sampleRate=8000}get currentTime(){return audioClock}createOscillator(){return fakeSource('sine')}createBufferSource(){return fakeSource('noise')}createBuffer(ch,length){return {getChannelData:()=>new Float32Array(length)}}createGain(){return {gain:{setValueAtTime:noop,linearRampToValueAtTime:noop,exponentialRampToValueAtTime:noop},connect:noop,disconnect:noop}}createBiquadFilter(){return {frequency:{setValueAtTime:noop},connect:noop,disconnect:noop}}createStereoPanner(){return {pan:{setValueAtTime:noop},connect:noop,disconnect:noop}}}
const withAudio={window:{AudioContext:FakeAudio}};vm.createContext(withAudio);vm.runInContext(soundSource,withAudio);assert.equal(audioStarts,0);
for(let i=0;i<22;i++){audioClock+=.04;withAudio.sfx.play('shot')}assert.equal(withAudio.sfx.activeVoices,16,'maximal 16 Audio-Stimmen');const beforeMute=audioStarts;withAudio.sfx.toggle();withAudio.sfx.play('shot');assert.equal(audioStarts,beforeMute);pending.splice(0).forEach(o=>o.onended());assert.equal(withAudio.sfx.activeVoices,0);withAudio.sfx.toggle();
const signatures=new Set();for(const style of ['normal','red','white','rose','port','speed','prism','saw','chain','orbit','mortar','wave','frost','vortex','storm','phoenix']){audioClock+=.2;const start=audioLog.length;withAudio.sfx.play('shot',{style,charged:true});assert.ok(audioLog.length>start,style+' hat Klang');signatures.add(audioLog[start].type+':'+Math.round(audioLog[start].from));pending.splice(0).forEach(o=>o.onended())}assert.ok(signatures.size>=14,'Waffen klingen unterschiedlich');
for(const event of ['hit','explode','pickup','card','synergy','heal','charge','charged','ready','block','graze','hurt','die','boss','transition','overdrive','shatter','split','echo','segment']){audioClock+=.4;const before=audioStarts;withAudio.sfx.play(event);assert.ok(audioStarts>before,event+' hat Cue');pending.splice(0).forEach(o=>o.onended())}
assert.ok(audioLog.every(o=>o.stopped>o.started),'alle Stimmen haben ein Ende');
console.log('OK: 5 Herzen, Tempo, 15 Waffen, 27 Karten, Dauerfeuer und Ladeunterbrechung, Elementarkombinationen, echte Synergien, Käserausch, Game-Over-Roasts, verschiedene Audio-Profile, Geheimlevel, Bosssegmente und Effektbudgets.');

// Image loading never blocks gameplay and preserves the procedural fallback.
(async()=>{
 const loader=fs.readFileSync(__dirname+'/assets.js','utf8')+';globalThis.assets=PfertAssets;';
 const absent={};vm.createContext(absent);vm.runInContext(loader,absent);await absent.assets.ready;assert.equal(absent.assets.failures.length,5);assert.equal(absent.assets.get('city'),null);
 const success={Image:class{set src(path){this.path=path;queueMicrotask(()=>this.onload())}}};vm.createContext(success);vm.runInContext(loader,success);await success.assets.ready;assert.equal(success.assets.failures.length,0);assert.ok(success.assets.get('characters'));assert.equal(success.assets.get('industry').path,'assets/ruhrgebiet-v1.png','erstes Ruhrpott-Bild bleibt erhalten');assert.equal(success.assets.get('industryNight').path,'assets/ruhrgebiet-nachtschicht-v1.png','zweites Ruhrpott-Bild ist eigenständig');assert.notEqual(success.assets.get('industry'),success.assets.get('industryNight'));
 const requested=[];sandbox.PfertAssets={frames:success.assets.frames,effectFrames:success.assets.effectFrames,get(id){requested.push(id);return {width:1672,height:941}}};sandbox.previewContext=ctx();vm.runInContext('PfertArt.background(previewContext,0,1,1)',sandbox);assert.ok(requested.includes('industry'));assert.ok(!requested.includes('industryNight'));requested.length=0;vm.runInContext('PfertArt.background(previewContext,0,1,2)',sandbox);assert.ok(requested.includes('industryNight'));assert.ok(!requested.includes('industry'));delete sandbox.PfertAssets;
assert.equal(success.assets.frames.length,16);assert.equal(success.assets.effectFrames.length,16);
 const broken={Image:class{set src(path){queueMicrotask(()=>this.onerror())}}};vm.createContext(broken);vm.runInContext(loader,broken);await broken.assets.ready;assert.equal(broken.assets.failures.length,5);
 const atlas=fs.readFileSync(__dirname+'/assets/characters-v1.png');const width=atlas.readUInt32BE(16),height=atlas.readUInt32BE(20);for(const r of success.assets.frames)assert.ok(r.x>=0&&r.y>=0&&r.w>0&&r.h>0&&r.x+r.w<=width&&r.y+r.h<=height,'Zuschnitt liegt im Atlas');
 const effects=fs.readFileSync(__dirname+'/assets/effects-v1.png'),ew=effects.readUInt32BE(16),eh=effects.readUInt32BE(20);for(const r of success.assets.effectFrames)assert.ok(r.x>=0&&r.y>=0&&r.w>0&&r.h>0&&r.x+r.w<=ew&&r.y+r.h<=eh,'VFX-Zuschnitt liegt im Atlas');
 assert.equal(atlas[25],6,'Figuren haben einen Alphakanal');assert.equal(effects[25],6,'VFX haben einen Alphakanal');
 assert.equal(elements.overlay.classList!==undefined,true);console.log('OK: Asset-Laden, Ladefehler, Fallback, Figuren-/VFX-Zuschnitte und Alpha.');
})().catch(error=>{console.error(error);process.exitCode=1});
