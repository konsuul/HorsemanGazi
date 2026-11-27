'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const noop = () => {};
const drawLabels = [],drawBars=[];
const dangerTracks=[];
let line;
const random=Object.create(Math);
const canvas = new Proxy({
 fillText(label){drawLabels.push(label);},
 fillRect(x,y,w,h){if(w>0&&h===3)drawBars.push({x,y,w,color:this.fillStyle});},
 moveTo(x,y){line=[x,y];},
 lineTo(x,y){if(line)line.push(x,y);},
 stroke(){if(line?.length===4&&this.lineWidth===2&&['#ffcd86','#ffb382'].includes(this.strokeStyle))dangerTracks.push([this.strokeStyle,...line]);},
 createLinearGradient(){return {addColorStop:noop};},
 createRadialGradient(...coords){
  assert.ok(coords.every(Number.isFinite),'Endliche Koordinaten beim Aufladen');
  return {addColorStop:noop};
 }
},{get:(target,key)=>target[key]||noop});
const classList = {add: noop, remove: noop, toggle: noop};
const elements = new Map();
const sandbox = {
 console,Math:random,
 requestAnimationFrame: noop,
 navigator: {getGamepads: () => []},
 document: {
  createElement: () => ({getContext: () => canvas}),
  getElementById(id) {
   if (!elements.has(id)) elements.set(id, {classList, getContext: () => canvas, addEventListener: noop});
   return elements.get(id);
  },
  addEventListener: noop
 },
 window: {addEventListener: noop}
};
const code = filename => fs.readFileSync(path.join(__dirname,'../Pfert',filename), 'utf8');
vm.createContext(sandbox);
vm.runInContext(code('art.js'), sandbox);
vm.runInContext(code('game.js').replace(/\}\)\(\);\s*$/, `
globalThis.encounters = {
 cartridges:()=>cartridges,chooseCartridge:id=>{choices=[cardDefs.find(c=>c.id===id)];state='upgrade';chooseCard(0);xp=0},
 fireCharge,bullets:()=>bullets,beams:()=>beams,readyTime:time=>{runTime=time},damagePart,enemy,
 spawnsFrom:index=>{spawnIndex=index;nextRareEnemy=Infinity},
 mode:()=>state,gear:()=>gearDrops,worn:()=>wornGear,route:()=>starRoute,xp:()=>xp,orbs:()=>orbs,pauseGame,resumeGame,hurt,
 reset, update, render, startBoss, startRuhrBoss, damageEnemy, spawnRegularEnemy, enemyAttack,moveHostileShot,projectile,
 drawEnemy: unit => PfertArt.enemy(document.createElement('canvas').getContext('2d'), unit, 0, 0),
 state: () => ({boss, enemies, shots, player, score, combo, noticeText, t, nextRareEnemy, blockerPatrolDelay,hearts,threat,formation,arcadeFire}),
 skipTo: (clock, bosses = 0) => { t = clock; bossCount = bosses; nextBoss = (bosses + 1) * 300; },
 prepare: () => { spawn = 999; drop = 999; xpNeeded = Infinity; player.autoCooldown = Infinity; player.inv = Infinity; },
 setSpawn: value => { spawn = value; },
 setShotBudget: value => { enemyShotBudget = value; },
 setPatrolDelay: value => { blockerPatrolDelay = value; },
 allowContact: () => { player.inv = 0; },
 setRuhr: (type = 2) => { secret = true; secretType = type; },
 skipPortals: () => { goldenAppeared = true; secondAppeared = true; }
};
})();`), sandbox);
const game = sandbox.encounters;
function setup(clock = 0, bosses = 0) {
 game.reset();
 game.prepare();
 game.skipTo(clock, bosses);
}
function advance(seconds) {
 for (let i = 0; i < Math.round(seconds * 20); i++) game.update(.05);
}

if(process.argv.length===2||process.argv.includes('--arcade')){
 function approachArcade(time=169,bosses=0){
  setup(time-.02,bosses);
  game.skipPortals();
  game.state().player.y=110;
  game.update(.04);
  return game.state().arcadeFire;
 }

 const clean=approachArcade();
 assert.equal(clean.halfGap,72);
 assert.equal(clean.remaining,2);
 assert.equal(clean.center,324,'Die erste freie Flugspur fordert eine Kurskorrektur');
 game.allowContact();
 advance(1.35);
 assert.equal(game.state().hearts,5,'Warnbereiche richten noch keinen Schaden an');
 assert.equal(clean.firing,false);
 game.pauseGame();
 const pausedAt=game.state().t;
 advance(2);
 assert.equal(game.state().t,pausedAt,'Pause hält die Vorwarnzeit an');
 assert.equal(game.state().arcadeFire,clean);
 game.resumeGame();
 game.state().player.y=324;
 advance(.45);
 assert.equal(clean.firing,false);
 assert.equal(clean.remaining,1);
 assert.equal(clean.center,216);
 game.state().player.y=216;
 advance(1.4);
 assert.equal(game.state().arcadeFire,null);
 assert.equal(game.state().hearts,5);
 assert.equal(game.state().score,350);
 assert.equal(game.state().player.arcadeReward.points,350);

 const grazedEdge=approachArcade();
 game.allowContact();
 const {player}=game.state();
 player.y=grazedEdge.center-grazedEdge.halfGap+player.h/2-1;
 advance(1.5);
 assert.equal(grazedEdge.firing,true);
 assert.equal(game.state().hearts,4,'Ein überstehender Pixel berührt die Gefahrenzone');
 assert.equal(player.lastDamage.source,'arcade');
 game.allowContact();
 advance(.2);
 assert.equal(game.state().hearts,4,'Eine Feuerwelle löst höchstens einen Treffer aus');
 player.y=216;
 advance(1.6);
 assert.equal(game.state().arcadeFire,null);
 assert.equal(game.state().score,0);

 const protectedFlight=approachArcade();
 advance(1.5);
 assert.equal(game.state().hearts,5);
 assert.equal(protectedFlight.clean,false,'Unverwundbarkeit vergibt keine Bonuspunkte für die Gefahrenzone');

 for(const [time,bosses,axis,halfGap,waves] of [[196,0,'x',115,2],[452,1,'y',60,3],[610,2,'y',60,3],[830,2,'x',113,3]]){
  const fire=approachArcade(time,bosses);
  assert.equal(fire.axis,axis);
  assert.equal(fire.halfGap,halfGap);
  assert.equal(fire.remaining,waves);
  assert.equal(game.route(),null);
 }
 const vertical=approachArcade(196);
 game.allowContact();
 game.state().player.x=vertical.center-vertical.halfGap+game.state().player.w/2-1;
 advance(1.5);
 assert.equal(game.state().hearts,4,'Senkrechte Gefahren prüfen die Breite des Pferts');
 assert.equal(game.state().player.lastDamage.angle,Math.PI);
 const cross=approachArcade(452,1);
 game.state().player.y=cross.center;
 advance(1.8);
 assert.equal(cross.axis,'x');
 assert.equal(cross.halfGap,110);
 game.state().player.x=cross.center;
 advance(1.8);
 assert.equal(cross.axis,'y');
 assert.equal(cross.halfGap,54);
 game.startBoss();
 assert.equal(game.state().arcadeFire,null,'Boss-Start beendet die Begegnung');
 setup(168.98);
 game.setRuhr(1);
 game.update(.04);
 assert.equal(game.state().arcadeFire,null,'Im Ruhrpott startet kein Arkadenfeuer');
 setup(167);
 advance(.05);
 assert.ok(game.route(),'Die Strecke ist bereits von der Sternenpost belegt');
 advance(2);
 assert.equal(game.state().arcadeFire,null,'Aktive Sternenpost hat Vorrang');
 setup(451.98,1);
 game.update(.04);
 assert.equal(game.state().arcadeFire,null,'Ein Portalziel hat Vorrang');
 console.log('OK: Fünf Arkadenfeuer, Warnzeit, Pause, Treffergrenze, Schutz und Punkte sowie Ausschluss bei Boss, Portal, Ruhrpott und Sternenpost.');
 if(process.argv.includes('--arcade'))process.exit(0);
}

{
 setup();
 const charger=game.enemy(6,270);
 Object.assign(charger,{x:880,age:1.05,speed:100,fire:Infinity});
 advance(.75);
 assert.ok(Math.abs(charger.x-(880-100*.75-180*.63))<1e-8,'Der vollständige Vorstoß legt exakt 40 % mehr Strecke zurück');
}

if(process.argv.includes('--telegraphs')){
 function drawTracks(){
  dangerTracks.length=0;
  game.render();
  return dangerTracks.slice();
 }
 setup(67.99);
 game.update(.02);
 const carpet=game.state().enemies.find(unit=>unit.blocker);
 const starts=[];
 let checkedBeforeShot=false;
 for(let i=0;i<100&&!starts.length;i++){
  game.update(.05);
  starts.push(...game.state().shots.filter(s=>s.age===0&&!s.bonus&&s.kind==='needle'&&s.vy===0));
  if(!starts.length&&carpet.aimTarget){
   assert.deepEqual(drawTracks(),[]);
   checkedBeforeShot=true;
  }
 }
 assert.ok(checkedBeforeShot);
 assert.equal(starts.length,2);
 assert.equal(starts[0].x,carpet.x-carpet.w/2);
 assert.deepEqual(starts.map(s=>s.y-carpet.y),[-48,48]);

 for(const playerX of [100,880]){
  setup(190);
  const {player}=game.state();
  player.x=playerX;
  const enemy=game.enemy(7,250);
  Object.assign(enemy,{x:600,speed:0,fire:.4});
  game.update(.02);
  const tracks=drawTracks().filter(([color])=>color==='#ffb382');
  advance(.4);
  const shot=game.state().shots.find(s=>s.kind==='pulse');
  assert.equal(shot.w,175);
  assert.deepEqual(tracks,[]);
 }
 setup(905,4);
 game.startBoss();
 const boss=game.state().boss;
 Object.assign(boss,{fire:.1});
 game.update(.05);
 const tracks=drawTracks().filter(([color])=>color==='#ffb382');
 game.update(.05);
 const shot=game.state().shots.find(s=>s.kind==='pulse');
 assert.equal(shot.w,420);
 assert.deepEqual(tracks,[]);
 console.log('OK: Teppich, Standardgegner und Boss schießen ohne Warnspuren.');
 process.exit(0);
}

if(process.argv.includes('--formation')){
 for(const [at,expected] of [
  [132,[[1,176,false],[4,368,false]]],
  [207,[[1,135,false],[3,285,false],[4,445,false]]],
  [489,[[5,176,false],[4,313,true],[6,439,false]]],
  [646,[[4,136,true],[3,281,false],[6,420,true]]],
  [795,[[6,144,false],[8,246,true],[6,355,false],[9,460,true]]]
 ]){
  setup(at-.04,Math.floor(at/300));
  game.skipPortals();game.setPatrolDelay(Infinity);
  game.update(.05);
  assert.ok(game.state().formation,at+' kündigt die Formation an');
  assert.match(game.state().noticeText,/SPUREN MEIDEN$/);
  assert.equal(game.state().enemies.length,0);
  game.render();
  if(at===132){
   game.pauseGame();advance(2);
   assert.ok(game.state().formation,'Die Vorwarnung pausiert');game.resumeGame();
  }
  advance(1.55);
  assert.equal(game.state().enemies.length,0,'Die Vorwarnung dauert 1,6 Sekunden');
  assert.equal(game.state().shots.length,0);
  game.update(.05);
  const units=game.state().enemies.filter(unit=>unit.formation);
  assert.deepEqual(Array.from(units,unit=>[unit.i,unit.y,unit.rear]),expected);
  assert.ok(units.every(unit=>unit.rear?unit.x+unit.w/2<=0:unit.x-unit.w/2>=960));
  advance(2.4);
  assert.ok(units.every(unit=>unit.formationVolleys===0&&unit.fire===Infinity),'Jede Staffel feuert zwei Salven');
  const shots=game.state().shots;
  const primary=units.length*6,baseline=primary+Math.floor(primary/5);
  assert.ok(shots.length>0&&shots.length<=Math.ceil(baseline*.75),'Auch Formationssalven haben weniger Projektile');
  assert.ok(shots.every(shot=>shot.vy===0),'Auch Zusatzgeschosse bleiben auf geraden Spuren');
  assert.equal(game.route(),null,'Fällige Sternenpost wartet während der Formation');
  if(expected.some(([, ,rear])=>rear))assert.ok(shots.some(shot=>shot.vx>0));
 }
 setup(131.96);game.update(.05);
 assert.ok(game.state().formation);
 game.startBoss();assert.equal(game.state().formation,null);
 setup(131.96);game.setRuhr(1);game.update(.05);
 assert.equal(game.state().formation,null);
 console.log('OK: Fünf Formationen mit Vorwarnung, Spuren, je zwei Salven, Pause und Ausschluss bei Bossen und im Ruhrpott.');
 process.exit(0);
}

if(process.argv.includes('--wind')){
 setup(95);
 game.chooseCartridge('fuseRocket');game.fireCharge();game.prepare();game.allowContact();
 const pilot=game.state().player;
 const initialReady=pilot.cartridgeReady.fuseRocket;
 const nearMiss=()=>{
  game.projectile(pilot.x+39,pilot.y,0,0,'#fff',8,{life:.15});
  game.update(.01);
 };
 nearMiss();game.update(.01);
 assert.equal(pilot.slipstreamCount,1,'Ein Geschoss zählt genau einmal');
 nearMiss();
 assert.equal(pilot.slipstreamCount,2);
 game.pauseGame();game.update(4);game.resumeGame();
 nearMiss();
 assert.equal(game.state().score,200);
 assert.equal(pilot.cartridgeReady.fuseRocket,initialReady-1.5);
 assert.ok(pilot.slipstreamFlash>0);
 drawLabels.length=0;game.render();
 assert.ok(drawLabels.includes('WINDSCHATTEN +125'));
  assert.ok(drawLabels.includes('PATRONEN'));
  assert.ok(drawBars.some(bar=>bar.color==='#64abbd'),'Zündrakete lädt im Raster nach');
 nearMiss();advance(2.6);nearMiss();
 assert.equal(pilot.slipstreamCount,1,'Das Kettenfenster läuft ab');
 game.hurt('contact');assert.equal(pilot.slipstreamCount,0);
  game.readyTime(initialReady);drawLabels.length=0;drawBars.length=0;game.render();
 assert.ok(drawBars.some(bar=>bar.color==='#b3f4d1'),'Zündrakete ist bereit');
 for(const [roll,expectItem,tier,value] of [[.29,true,1,1],[.3,false,1,1],[.499,false,1,1],[.5,false,2,2],[.799,false,2,2],[.8,false,3,6],[.949,false,3,6],[.95,false,4,20]]){
  random.random=()=>roll;
  setup(100);game.update(.05);
  const route=game.route();
  assert.ok(route);
  game.pauseGame();const startX=route.gates[0].x;game.update(2);game.resumeGame();
  assert.equal(route.gates[0].x,startX);
  const fly=game.state().player;
  for(const [i,gate] of route.gates.entries()){
   gate.x=fly.x;fly.y=gate.y;game.update(.01);
   assert.equal(route.index,i+1);
   game.render();
  }
  assert.equal(game.route(),null);
  assert.equal(game.state().score,0);
  assert.equal(game.orbs().length,10);
  assert.ok(game.orbs().every(orb=>orb.tier===tier&&orb.value===value));
  assert.equal(Object.keys(game.worn()).length,expectItem?1:0);
  {
   const first=game.orbs()[0];
   fly.x=first.x;fly.y=first.y;
   game.update(.01);
   assert.equal(game.xp(),0,'Während der Explosion sind Orbs gesperrt');
   advance(.4);
   fly.x=first.x;fly.y=first.y;
   game.update(.1);
   assert.equal(game.xp(),0,'Nach dem Flug bleiben Orbs kurz gesperrt');
   assert.equal(game.xp(),0);
   const orbs=game.orbs();
   const center={x:orbs.reduce((sum,orb)=>sum+orb.x,0)/10,y:orbs.reduce((sum,orb)=>sum+orb.y,0)/10};
   assert.ok(orbs.every(orb=>Math.abs(Math.hypot(orb.x-center.x,orb.y-center.y)-128)<1e-8));
   fly.x=orbs[0].x;fly.y=orbs[0].y;
   game.update(.11);
   assert.equal(game.orbs().length,9);
   assert.ok(game.xp()>0,'Beim Anfliegen wird der Orb eingesammelt');
  }
 }
 random.random=Math.random;
 setup(0);game.allowContact();
 const shielded=game.state().player;
 shielded.podCooldown=10;shielded.fieldPower.shield=1;shielded.fieldPower.shieldTime=5;
 const collide=()=>{game.projectile(shielded.x,shielded.y,0,0,'#fff',8,{life:.15});game.update(.01)};
 collide();assert.equal(shielded.fieldPower.shield,0);assert.equal(game.state().hearts,5);
 collide();assert.equal(game.state().hearts,4,'Erster gültiger Treffer nach der letzten Schildladung');
 setup(100);game.update(.05);game.state().player.y=95;advance(8);
 assert.equal(game.route(),null);assert.equal(game.state().hearts,5);assert.equal(game.state().score,0);
 setup(100);game.update(.05);game.startBoss();assert.equal(game.route(),null);
 setup(100);game.setRuhr();game.update(.05);assert.equal(game.route(),null);
 console.log('OK: Windschatten, Nachladeschub, Zeitfenster, Pause, Sternenpost, Boss- und Geheimlevelwechsel.');
 process.exit(0);
}
if(process.argv.includes('--caravan')){
 const ids=game.cartridges().map(c=>c.id);
 assert.equal(new Set(ids).size,10);
 const original=[6.4,4.6,3.6,3.1,2.7,3.8,3.4,2.9,2.4,4.8];
 for(const [index,{id,reload}] of game.cartridges().entries()){
  assert.ok(Math.abs(reload*1.3-original[index])<1e-9,id+' feuert 30 Prozent häufiger');
  setup();game.chooseCartridge(id);
  game.fireCharge();game.fireCharge();
  const fired=()=>[...game.bullets(),...game.beams()].filter(b=>b.cartridge===id);
  assert.equal(fired().length,1,id+' wartet auf Nachladung');
  assert.equal(game.bullets().filter(b=>b.standardShot).length,2);
  game.readyTime(reload-.001);game.fireCharge();assert.equal(fired().length,1);
  game.readyTime(reload);game.fireCharge();
  assert.equal(fired().length,2,id+' lädt nach');
  game.update(.05);game.render();
 }
 for(const [id,check] of [
  ['fuseRocket',(victim,neighbor)=>assert.ok(neighbor.hp<neighbor.max,'Raketentreffer verursacht Flächenschaden')],
  ['iceSpindle',victim=>assert.ok(victim.slowTime>0)],
  ['cinderArc',victim=>assert.ok(victim.burnLife>0)],
  ['sparkBobbin',(victim,neighbor)=>assert.ok(neighbor.hp<neighbor.max,'Funke springt zum Nachbarn')],
  ['pearlPod',()=>assert.equal(game.bullets().filter(b=>b.generation===1).length,4)]
 ]){
  setup();game.chooseCartridge(id);game.fireCharge();
  const shot=game.bullets().find(b=>b.cartridge===id);
  Object.assign(shot,{x:400,y:270,vx:0,vy:0});
  const targets=[400,440].map(x=>Object.assign(game.enemy(0,270),{x,speed:0,hp:50,max:50}));
  game.update(.01);check(...targets);
 }
 setup();
 for(const id of ids)game.chooseCartridge(id);
 for(const id of ids){game.fireCharge();assert.equal((id==='sunLance'?game.beams():game.bullets()).at(-1).cartridge,id)}
 setup(110);
 for(const [index,kind,shot] of [[0,'weaver','needle'],[7,'diver','football'],[14,'beacon','splitter']]){
  game.spawnsFrom(index);game.spawnRegularEnemy();
  const e=game.state().enemies.at(-1);
  assert.equal(e.machine,kind);game.drawEnemy(e);
  game.enemyAttack(e);assert.equal(game.state().shots.at(-1).kind,shot);
 }
 for(const index of [5,6]){
  setup(180,index);game.startBoss();
  const b=game.state().boss;
  assert.equal(b.i,index+2);
  game.damagePart(b.parts[0],Infinity,b.x,b.y);
  game.damagePart(b.parts[1],Infinity,b.x,b.y);
  game.update(.05);assert.equal(b.encounter.phase,2);
  for(const part of b.parts.filter(p=>p.hp>0))game.damagePart(part,Infinity,b.x,b.y);
  assert.equal(game.state().boss,null);assert.equal(game.mode(),'playing');
  assert.equal(game.gear().at(-1).returning,false);
 }
 console.log('OK: Zehn Karten, Nachladung, Rotation, drei Maschinen und zwei Bossabschlüsse.');
 process.exit(0);
}
for(const [fromBoss,expected] of [[false,9],[true,15]]){
 setup();
 for(let i=0;i<10;i++)game.projectile(900,270,-200,0,'',10,{fromBoss});
 assert.equal(game.state().shots.length,expected);
}
for(const [phase,baseInterval] of [[1,2.5],[2,2.3]]){
 setup(180,1);
 game.startBoss();
 const {boss}=game.state();
 assert.equal(boss.fire,1);
 Object.assign(boss.encounter,{phase,elapsed:Infinity});
 boss.fire=0;
 game.update(.05);
 const {threat}=game.state();
 assert.ok(Math.abs(boss.fire*(1+threat*.12)*1.5-baseInterval)<1e-9);
}
testBossAttacks();
for(const [index,id,baseHp] of [
 [0,0,90],[1,1,105],[2,2,120],[3,3,135],[4,4,150],
 [5,7,195],[6,8,210],[0,5,120],[0,6,155]
]){
 setup(0,index);
 if(id===5||id===6){game.setRuhr(id===6?2:1);game.startRuhrBoss()}else game.startBoss();
 const {boss}=game.state();
 assert.equal(boss.i,id);
 const weight=boss.parts.reduce((sum,part)=>sum+(part.weight||1),0);
 const oldHp=baseHp*11.25*({0:.35,1:.39,6:.155}[id]||1);
 for(const part of boss.parts){
  const previousHp=Math.ceil(oldHp*(part.weight||1)/weight)*1.2;
  assert.ok(Math.abs(part.hp-previousHp*(id===5?.6:1))<1e-9);
 }
 assert.equal(boss.hp,boss.parts.reduce((sum,part)=>sum+part.hp,0));
}
console.log('OK: Segment-Lebenspunkte aller neun Bosse, inklusive 40 % Reduktion beim Schalke-Fan.');
if(process.argv.includes('--boss-attacks'))process.exit(0);

setup(67.99);
game.setPatrolDelay(0);
game.update(.02);
const carpet=game.state().enemies.find(unit=>unit.blocker);
assert.ok(carpet&&!carpet.patrol,'Der bisherige Teppich hat bei 1:08 Vorrang');
game.drawEnemy(carpet);
let carpetFired=false;
for(let frame=0;frame<100;frame++){
 game.update(.05);
 carpetFired||=game.state().shots.some(shot=>shot.kind==='needle'&&shot.age===0&&!shot.bonus&&shot.vx<0&&shot.vy===0&&Math.abs(shot.y-carpet.y)===48);
}
assert.ok(carpetFired);
advance(9);
assert.ok(!game.state().enemies.some(unit=>unit.patrol));
advance(1.1);
assert.ok(game.state().enemies.some(unit=>unit.patrol),'Fälliger Auftritt wird nach dem Teppich nachgeholt');

const patrolStarts={lantern:178,bird:435,barge:184};
const patrolMidpoints={lantern:302,bird:291.5,barge:426};
const patrolEnds={lantern:426,bird:148,barge:184};
setup(125);
assert.ok(game.state().blockerPatrolDelay>=95&&game.state().blockerPatrolDelay<=120);
const seenPatrols=new Set();
for(let i=0;i<3;i++){
 game.skipTo(110);
 game.prepare();
 game.setPatrolDelay(.12);
 advance(.1);
 assert.ok(!game.state().enemies.some(unit=>unit.patrol),'Der Cooldown läuft vor dem Auftritt ab');
 game.update(.05);
 const {enemies,blockerPatrolDelay}=game.state();
 const unit=enemies.find(enemy=>enemy.patrol),kind=unit.patrol.sprite;
 assert.ok(blockerPatrolDelay>=65&&blockerPatrolDelay<=95);
 assert.ok(kind==='bird'?unit.x+unit.w/2<0:unit.x-unit.w/2>960,'Einflug beginnt außerhalb des Bilds');
 assert.equal(unit.y,patrolStarts[kind]);
 advance(2.35);
 const middleX=unit.x;
 assert.ok(middleX-unit.w/2>0&&middleX+unit.w/2<960);
 advance(4.3);
 assert.ok(Math.abs(unit.x-middleX)<.01,'Gegner bleibt während des Höhenwechsels auf seiner horizontalen Position');
 assert.ok(Math.abs(unit.y-patrolMidpoints[kind])<.01);
 game.drawEnemy(unit);
 if(kind==='barge'){
  Object.assign(game.state().player,{x:unit.x,y:unit.y});
  game.allowContact();
  game.update(.05);
  assert.equal(game.state().hearts,4,'Treffer durch Kontakt');
  Object.assign(game.state().player,{x:100,y:270,inv:Infinity});
  advance(4.25);
 }else advance(4.3);
 assert.ok(Math.abs(unit.y-patrolEnds[kind])<.01);
 assert.equal(game.state().shots.length,0,'Die isolierte Blockerpatrouille feuert keine Geschosse');
 advance(1.95);
 assert.ok(kind==='bird'?unit.x+unit.w/2<0:unit.x-unit.w/2>960,'Ausflug endet außerhalb des Bilds');
 advance(.1);
 assert.ok(!game.state().enemies.includes(unit));
 seenPatrols.add(kind);
}
assert.deepEqual([...seenPatrols].sort(),['barge','bird','lantern']);
game.skipTo(125);
game.setPatrolDelay(0);
advance(3);
const target=game.state().enemies.find(unit=>unit.patrol);
game.damageEnemy(target,1,target.x,target.y);
assert.ok(target.hp<target.max&&target.hp>0);
game.drawEnemy(target);
game.damageEnemy(target,1000,target.x,target.y);
advance(.05);
assert.ok(!game.state().enemies.includes(target));
setup(152);
game.setPatrolDelay(0);
game.update(.05);
assert.ok(!game.state().enemies.some(unit=>unit.patrol),'Vor einem Teppich bleibt die Zone frei');
setup(299);
game.setPatrolDelay(0);
advance(2);
assert.ok(game.state().boss);
assert.ok(!game.state().enemies.some(unit=>unit.blocker));
setup(126);
game.setRuhr();
game.setPatrolDelay(0);
advance(1);
assert.ok(!game.state().enemies.some(unit=>unit.blocker));
assert.equal(game.state().blockerPatrolDelay,0);
console.log('OK: Teppich und drei Blocker mit Ausweichrouten, Kontakt, Cooldown und Abflug.');

setup(240);
advance(11.1);
const firstWave = game.state().player.bazaarWaves[0];
const members = game.state().enemies.filter(enemy => enemy.bazaarWave === firstWave);
assert.equal(members.length, 6, 'Erste Basarwelle erreicht ihre volle Besetzung');
assert.equal(firstWave.spawned, members.length);
for (const member of members.slice(0, -1)) game.damageEnemy(member, 1000, member.x, member.y);
assert.equal(firstWave.awarded, false);
const last = members.at(-1), before = game.state();
const defeatPoints = Math.round((100 + last.i * 35) * (last.elite ? 1.5 : 1) * (1 + Math.min(2, (before.combo + 1) * .04)));
game.damageEnemy(last, 1000, last.x, last.y);
assert.equal(game.state().score, before.score + defeatPoints + 250);
assert.match(game.state().noticeText, /\+250/);
advance(.5);
assert.equal(game.state().score, before.score + defeatPoints + 250);

setup(240);
advance(11.1);
const missed = game.state().player.bazaarWaves[0];
const escapees = game.state().enemies.filter(enemy => enemy.bazaarWave === missed);
escapees[0].x = -200;
game.update(.05);
assert.ok(!game.state().enemies.includes(escapees[0]));
for (const enemy of escapees.slice(1)) game.damageEnemy(enemy, 1000, enemy.x, enemy.y);
assert.equal(missed.awarded, false, 'Entkommener Gegner verhindert Wellenbonus');

setup(719.95, 2);
game.setSpawn(0);
const types = new Set();
for (let i = 0; i < 450; i++) {
 game.update(.05);
 for (const enemy of game.state().enemies) types.add(enemy.i);
}
assert.deepEqual([...types].sort(), [3, 4, 6]);
const mixed = game.state().enemies.filter(enemy => enemy.fireAlongLane);
assert.ok(mixed.some(enemy => enemy.y < 180));
assert.ok(mixed.some(enemy => enemy.y > 380));
game.skipTo(747.99, 2);
game.update(.02);
assert.ok(game.state().enemies.some(enemy => !enemy.fireAlongLane && enemy.x > 980), 'Zufallsspawn kehrt zurück');

function secondPhase(index) {
 setup(655);
 if (index === 6) {
  game.setRuhr();
  game.startRuhrBoss();
 } else {
  game.skipTo(655, index);
  game.startBoss();
 }
 const boss = game.state().boss;
 boss.hp = boss.max / 2;
 advance(4.65);
 assert.equal(boss.encounter.phase, 2);
 assert.equal(boss.encounter.cue, null);
 boss.fire = 0;
 game.update(.05);
 boss.fire = Infinity;
 return boss;
}

secondPhase(1);
let shots = game.state().shots.filter(shot => shot.kind === 'sickle');
assert.equal(shots.length, 1);
advance(.2);
assert.equal(game.state().shots.filter(shot => shot.kind === 'sickle').length, 1);
advance(.1);
shots = game.state().shots.filter(shot => shot.kind === 'sickle');
assert.equal(shots.length, 2);
assert.equal(shots[0].curve, -shots[1].curve, 'Versetzte Sichel biegt in Gegenrichtung');

secondPhase(6);
const baseMortars = () => game.state().shots.filter(shot => shot.kind === 'mortar' && !shot.bonus);
assert.equal(baseMortars().length, 2);
advance(.3);
assert.equal(baseMortars().length, 2);
advance(.15);
assert.equal(baseMortars().length, 4);
for (let i = 0; i < 45; i++) {
 for (const shot of baseMortars()) {
  assert.ok(shot.y + shot.h / 2 < 245 || shot.y - shot.h / 2 > 295, 'Mörser lassen mittleres Höhenband frei');
 }
 game.update(.05);
}
console.log('OK: Basarbonus, spätere Rollenwelle und versetzte Boss-Salven.');

function rareSequence(seed, count, checkAttacks=false) {
 vm.runInContext(`globalThis.originalRandom=Math.random; Math.random=(()=>{let rareSeed=${seed};
 return ()=>{rareSeed=(rareSeed*1664525+1013904223)>>>0;return rareSeed/2**32;};})();`, sandbox);
 try {
  setup();
  const firstAt=game.state().nextRareEnemy;
  assert.ok(firstAt>=120&&firstAt<=145);
  game.skipTo(firstAt-.01);
  game.spawnRegularEnemy();
  assert.equal(game.state().enemies.at(-1).rareEnemy,undefined);
  const order=[],patterns=new Set();
  for(let i=0;i<count;i++){
   const at=game.state().nextRareEnemy;
   game.skipTo(at);
   const before=game.state().enemies.length;
   game.spawnRegularEnemy();
   const {enemies,shots,nextRareEnemy}=game.state();
   assert.equal(enemies.length,before+1,'Sondergegner belegt einen regulären Spawnplatz');
   const unit=enemies.at(-1);
   assert.ok(unit.rareEnemy);
   assert.ok(nextRareEnemy-at>=120&&nextRareEnemy-at<=145);
   order.push(unit.rareEnemy.name);
   game.spawnRegularEnemy();
   assert.equal(enemies.at(-1).rareEnemy,undefined,'Cooldown verhindert einen weiteren Sondergegner');
   if(checkAttacks&&i<10){
    game.drawEnemy(unit);
    const start=shots.length;
    game.setShotBudget(4);
    game.enemyAttack(unit);
    const volley=shots.slice(start).filter(shot=>!shot.bonus);
    assert.ok(volley.length>0&&volley.length<=3);
    assert.ok(volley.every(shot=>Number.isFinite(shot.vx)&&Number.isFinite(shot.vy)));
    patterns.add(JSON.stringify(volley.map(shot=>[shot.kind,shot.x-unit.x,shot.y-unit.y,shot.vx,shot.vy,shot.curve])));
   }
  }
  if(checkAttacks)assert.equal(patterns.size,10);
  return order;
 } finally {
  vm.runInContext('Math.random=originalRandom',sandbox);
 }
}
const rareOrder=rareSequence(123,11,true);
assert.equal(new Set(rareOrder.slice(0,10)).size,10);
assert.ok(rareOrder.slice(0,10).includes(rareOrder[10]));
assert.notDeepEqual(rareOrder.slice(0,10),rareSequence(765,10));
console.log('OK: Zehn seltene Gegner, Cooldown, Wiederkehr, Angriffe und Sprite-Zeichenpfade.');

setup(180);
game.setSpawn(0);
game.update(.05);
const enteringRare=game.state().enemies.find(unit=>unit.rareEnemy);
assert.ok(enteringRare&&enteringRare.x-enteringRare.w/2>=960);
enteringRare.fire=.3;
game.update(.05);
assert.ok(enteringRare.aimTarget,'Angriff wird vor dem Schuss angekündigt');
assert.ok(Number.isFinite(enteringRare.y),'Höhe bleibt ab dem ersten Bewegungsschritt endlich');
enteringRare.rareEnemy={...enteringRare.rareEnemy,attack:'pulse'};
assert.equal(game.state().shots.some(shot=>shot.kind==='pulse'),false);
game.setShotBudget(4);
advance(.3);
assert.ok(game.state().shots.some(shot=>shot.kind==='pulse'));
game.drawEnemy(enteringRare);
setup(300);
game.setSpawn(0);
game.update(.05);
assert.ok(game.state().boss);
assert.equal(game.state().enemies.some(unit=>unit.rareEnemy),false);

function assertFanBallBounces(ball){
 assert.equal(ball.bounces,5);
 assert.equal(ball.life,Infinity);
 for(const [axis,edge,velocity] of [
  ['x',ball.w/2,-200],['x',960-ball.w/2,200],
  ['y',62+ball.h/2,-200],['y',540-ball.h/2,200],['x',ball.w/2,-200]
 ]){
  ball.x=480;ball.y=270;ball.vx=0;ball.vy=0;
  ball[axis]=edge;
  ball['v'+axis]=velocity;
  const remaining=ball.bounces-1;
  game.moveHostileShot(ball,.01);
  assert.equal(ball[axis],edge-velocity*.01);
  assert.equal(ball['v'+axis],-velocity);
  assert.equal(ball.bounces,remaining);
  assert.equal(ball.life,remaining?Infinity:0);
 }
}
function testBossAttacks(){
const cases=[
 [0,['needle','strike'],['Teppichwand','Seidenzange']],
 [1,['sickle','needle'],['Dampfdüsen','Kesseldruck']],
 [2,['splitter','mortar'],['Sucuk-Scheiben','Spießregen']],
 [3,['mine','sickle'],['Gewürzspirale','Minengirlande']],
 [4,['pulse','splitter'],['Karawanenkreuz','Basartor']],
 [5,['needle','splitter','football'],['Doppelpass','Freistoß']],
 [6,['mortar','sickle'],['Schlackenregen','Glutfront']],
 [7,['needle','splitter'],['Spektralgitter','Brennpunkt']],
 [8,['mine','mortar'],['Schleusentor','Kielwasser']]
];
for(const [index,pattern,specials] of cases){
 setup(180,index>=7?index-2:index);
 if(index<5||index>=7)game.startBoss(index===0);
 else {game.setRuhr(index-4);game.startRuhrBoss();}
 const boss=game.state().boss;
 game.state().player.podCooldown=Infinity;
 for(const expected of [...pattern,...specials,pattern[0]]){
  if(boss.strike)advance(1.8);
  const before=new Set(game.state().shots);
  boss.fire=0;
  game.update(.05);
  const newShots=game.state().shots.filter(shot=>!before.has(shot));
  if(expected==='strike'){
   assert.ok(boss.strike&&boss.strike.warning>0);
   assert.equal(newShots.length,0,'Vorstoß beginnt mit einer Warnung');
  }else if(specials.includes(expected)){
   assert.equal(boss.special?.name,expected);
   assert.equal(newShots.length,0,expected+' beginnt ohne Trefferfläche');
   const attack=boss.special;
   drawLabels.length=0;
   game.render();
   assert.ok(!drawLabels.includes(expected.toUpperCase()),expected+' bleibt ohne Schriftzug');
   game.state().player.y=505;
   advance(.35);
   assert.equal(boss.special,attack);
   assert.ok(!game.state().shots.some(shot=>shot.bossSpecial===expected));
   for(let index=0;index<attack.waves.length;index++){
    const existing=new Set(game.state().shots);
    advance(attack.wait+.04);
    const emitted=game.state().shots.filter(shot=>!existing.has(shot)&&shot.bossSpecial===expected&&!shot.bonus);
    assert.equal(emitted.length,attack.waves[index].length,expected+' feuert die angekündigte Welle');
    assert.deepEqual(Array.from(emitted,shot=>shot.kind),Array.from(attack.waves[index],shot=>shot[4]));
    assert.ok(emitted.every(shot=>[shot.x,shot.y,shot.vx,shot.vy].every(Number.isFinite)));
    for(const ball of emitted.filter(shot=>shot.kind==='football'))assertFanBallBounces({...ball});
   }
   assert.equal(boss.special,null);
  }else{
   assert.ok(newShots.length>0);
   assert.ok(newShots.every(shot=>shot.kind===expected),'Boss '+index+' feuert '+expected);
   if(expected==='football'){
    const ball=newShots[0];
    assertFanBallBounces({...ball});
    vm.runInContext('PfertArt',sandbox).hostile(canvas,ball);
   }
  }
 }
}
console.log('OK: Neun Boss-Angriffsfolgen mit 18 angekündigten Sonderangriffen und Fußball-Abprallern.');
}
