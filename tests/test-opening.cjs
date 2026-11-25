'use strict';

const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

function startOpening(random=.99){
 const noop=()=>{};
 const elements=new Map();
 const document={
  addEventListener:noop,
  getElementById(id){
   if(!elements.has(id))elements.set(id,{
    addEventListener:noop,getContext:()=>({}),innerHTML:'',
    classList:{add:noop,remove:noop,toggle:noop}
   });
   return elements.get(id);
  }
 };
 const math=Object.create(Math);
 // Ordinary rolls yield Sonderwein, so the fallback controls weapon availability.
 math.random=()=>random;
 const sandbox={document,window:{addEventListener:noop},Math:math,requestAnimationFrame:noop};
 vm.createContext(sandbox);
 const source=fs.readFileSync(path.join(__dirname,'../Pfert','game.js'),'utf8');
 vm.runInContext(source.replace(/\}\)\(\);\s*$/,`
  globalThis.test={reset,update,chooseCard,enemyDensity,setTime:value=>t=value,get:()=>({t,state,level,xp,notice,noticeText,player,pickups,enemies})};
 })();`),sandbox);
 const game=sandbox.test;
 game.reset();
 return game;
}

const game=startOpening();
// Isolate the opening and pickup checks from survival with a stationary player.
game.get().player.inv=Infinity;
for(const [minute, rate] of [[0,25],[4,50],[8,75],[12,100],[16,125],[20,150],[30,150]]){
 assert.ok(Math.abs(game.enemyDensity(minute*60)*60-rate)<1e-9);
}
const encountered=new Set();
const seenEnemies=new Set();
let firstMinuteEnemies=0;
let firstCardAt,firstWine,firstWineLeft,orbHints=0,wasOrbHint=false;
for(let step=0;step<1800;step++){
 const snapshot=game.get();
 if(snapshot.state==='upgrade')game.chooseCard(0);
 game.update(.05);
 const turn=game.get();
 if(turn.state==='upgrade'&&firstCardAt===undefined)firstCardAt=turn.t;
 const hasOrbHint=turn.notice>0&&turn.noticeText==='ORBS FÜLLEN DIE KARTENLEISTE';
 if(hasOrbHint&&!wasOrbHint)orbHints++;
 wasOrbHint=hasOrbHint;
 for(const enemy of turn.enemies){
  if(!seenEnemies.has(enemy)){
   seenEnemies.add(enemy);
   if(turn.t<60)firstMinuteEnemies++;
   assert.ok(enemy.x-enemy.w/2>=960||enemy.x+enemy.w/2<=0,'Neuer Gegner entsteht vollständig außerhalb');
  }
  if(!enemy.blocker)encountered.add(enemy.i);
 }
 if(!firstWine){
  firstWine=turn.pickups.find(p=>p.i!==5&&p.i!==16);
  if(firstWine)firstWineLeft=firstWine.x-firstWine.w/2;
 }
}
assert.deepEqual([...encountered],[0,3,4]);
assert.equal(firstMinuteEnemies,25);
assert.ok(firstCardAt>=3&&firstCardAt<=60,'Autofeuer und Orbs führen in der ersten Minute zur ersten Kartenwahl');
assert.equal(orbHints,0,'Kein Orb-Hinweis beim Einstieg');
assert.ok(firstWine&&firstWine.i===15,'Ein Waffenwein erscheint bei ausgebliebenem Zufallsfund');
assert.ok(firstWineLeft>=960,'Garantierter Waffenwein startet vollständig rechts außerhalb');
assert.ok(game.get().player.metaWeaponFound,'Flugroute erreicht den Waffenwein');

game.reset();
assert.equal(game.get().notice,0,'Kein Banner beim Rundenstart');
for(let step=0;step<210;step++)game.update(.05);
assert.notEqual(game.get().noticeText,'ORBS FÜLLEN DIE KARTENLEISTE','Kein Orb-Hinweis nach Neustart');

{
 const early=startOpening();
 const player=early.get().player;
 early.get().pickups.push({i:0,x:player.x,y:player.y,w:30,h:42});
 for(let step=0;step<940;step++){
  if(early.get().state==='upgrade')early.chooseCard(0);
  early.update(.05);
 }
 assert.ok(early.get().player.metaWeaponFound);
 assert.ok(early.get().pickups.every(p=>p.i===16),'Nach frühem Waffenwein erscheint kein garantierter Doppel-Drop');
}

function laterSpawns(random){
 const round=startOpening(random),seen=new Set(),spawns=[];
 round.setTime(180);
 round.get().player.inv=100;
 for(let i=0;i<400;i++){
  if(round.get().state==='upgrade')round.chooseCard(0);
  round.update(.05);
  const current=round.get();
  for(const enemy of current.enemies){
   if(enemy.rareEnemy||seen.has(enemy))continue;
   seen.add(enemy);
   assert.ok(enemy.x-enemy.w/2>=960||enemy.x+enemy.w/2<=0);
   spawns.push([current.t,enemy.i,Math.round(enemy.y)]);
  }
 }
 return spawns;
}
const regular=laterSpawns(.01);
const repeated=laterSpawns(.99);
assert.ok(regular.length>=5);
assert.deepEqual(regular.map(spawn=>spawn.slice(0,2)),repeated.map(spawn=>spawn.slice(0,2)),'Typen und Startzeiten sind fest geplant');
assert.ok(regular.every((spawn,i)=>Math.abs(spawn[2]-repeated[i][2])<6),'Eintrittshöhen stimmen abzüglich der Flugbewegung überein');

console.log('OK: Einstiegswellen, erreichbare erste Karte, Einstieg ohne Hinweise und garantierter erster Waffenwein.');
