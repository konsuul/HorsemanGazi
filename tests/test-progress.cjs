'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const noop=()=>{};
const ctx=()=>new Proxy({createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]||noop,set:(o,k,v)=>(o[k]=v,true)});
const events={},elements={};
const makeElement=()=>({classList:{add:noop,remove:noop},innerHTML:'',addEventListener:noop});
elements.game={getContext:ctx};elements.overlay=makeElement();elements.start=makeElement();
let gamepad=null;
const sandbox={navigator:{getGamepads:()=>gamepad?[gamepad]:[]},console,Math,Set,requestAnimationFrame:noop,document:{getElementById:id=>elements[id]||(elements[id]=makeElement()),createElement:()=>({width:0,height:0,getContext:ctx})},window:{addEventListener:(name,fn)=>events[name]=fn}};
vm.createContext(sandbox);vm.runInContext(fs.readFileSync(__dirname+'/../Pfert/art.js','utf8'),sandbox);
const source=fs.readFileSync(__dirname+'/../Pfert/game.js','utf8').replace('})();',
 'globalThis.testApi={reset,update,render,renderTransition,pollGamepad,offerCards,enemy,enemyAttack,startBoss,partHit,activateRage,hurt,keys,chooseCard,cardDefs,fireCharge,get:()=>({selectedCard,lastRare,t,runTime,level,xp,xpNeeded,orbs,choices,upgrades,hearts,score,player,enemies,bullets,beams,shots,pickups,boss,nextBoss,bossCount,state,transition,levelIndex,secret,secretTime,golden,goldenAppeared,secondAppeared,secretType,particles,deaths,arcs,flashes,threat}),setXp:v=>xp=v,setTime:v=>t=v,setFirstSeen:v=>goldenAppeared=v,setRunTime:v=>runTime=v,setNextBoss:v=>nextBoss=v,setSecretTime:v=>secretTime=v,setSpawn:v=>spawn=v,setDrop:v=>drop=v};})();');
vm.runInContext(source,sandbox);const a=sandbox.testApi;
function reset(){a.reset();a.setSpawn(999);a.setDrop(999);a.get().player.autoCooldown=Infinity}
function press(){events.keydown({code:'Space',repeat:false,preventDefault:noop})}
function release(){events.keyup({code:'Space',preventDefault:noop});a.get().player.autoCooldown=Infinity}
function shoot(duration=0){a.fireCharge(duration>0);a.get().player.autoCooldown=Infinity}
function bullet(x,y){return {x,y,vx:0,vy:0,w:10,h:10,pierce:false,damage:1,hit:new Set(),life:1}}
function defeatBoss(){const count=a.get().boss.parts.length;for(let i=0;i<count;i++){const q=a.get(),p=q.boss.parts[i];p.hp=1;q.bullets.push(bullet(q.boss.x+p.aim[0],q.boss.y+p.aim[1]));a.update(.01);if(i<count-1){assert.ok(a.get().boss,'Boss bleibt bis zum letzten Bereich');assert.equal(a.get().boss.parts[i].hp,0,'Bereich '+i+' besiegt')}}if(a.get().state!=='transition')assert.equal(a.get().boss,null)}
function finishTransition(){assert.equal(a.get().state,'transition');const before=a.get();const t=before.t,run=before.runTime,secretTime=before.secretTime,orb=before.orbs[0],x=orb?.x;press();a.pollGamepad();a.update(.75);a.renderTransition();a.update(.74);assert.equal(a.get().t,t);assert.equal(a.get().runTime,run);assert.equal(a.get().secretTime,secretTime);assert.equal(orb?.x,x);assert.equal(a.get().player.charging,false);assert.equal(a.get().state,'transition');a.update(.02);a.renderTransition();assert.equal(a.get().transition.switched,true);assert.equal(a.get().player.inv,2);a.update(1.48);assert.equal(a.get().state,'transition');a.update(.01);assert.equal(a.get().state,'playing');assert.equal(a.get().player.inv,2);release();assert.equal(a.get().player.charging,false)}


// Orb-Werte, Einsammeln und Stufenfortschritt.
for(let i=0;i<10;i++){reset();a.enemy(i);let e=a.get().enemies[0];e.x=500;e.y=270;e.hp=1;e.elite=false;a.get().bullets.push(bullet(500,270));a.update(.01);assert.equal(a.get().orbs.length,1);assert.equal(a.get().orbs[0].value,[1,1,1,2,2,2,3,3,3,4][i]);}
reset();a.enemy(9);let elite=a.get().enemies[0];elite.x=500;elite.y=270;elite.hp=1;elite.elite=true;a.get().bullets.push(bullet(500,270));a.update(.01);assert.equal(a.get().orbs[0].value,8);
reset();a.startBoss();defeatBoss();assert.equal(a.get().orbs.filter(o=>o.value===10).length,1);
reset();a.setRunTime(1000);a.update(.01);assert.equal(a.get().state,'playing','keine zeitgesteuerte Karte');a.get().orbs.push({x:135,y:270,w:16,h:16,value:32,age:0});a.update(.01);assert.equal(a.get().state,'upgrade');a.chooseCard(0);assert.equal(a.get().level,2);assert.equal(a.get().xp,50);assert.equal(a.get().xpNeeded,15);assert.equal(a.get().state,'upgrade');a.chooseCard(0);assert.equal(a.get().level,3);assert.equal(a.get().xp,35);assert.equal(a.get().xpNeeded,23);assert.equal(a.get().state,'upgrade');a.chooseCard(0);assert.equal(a.get().level,4);assert.equal(a.get().xp,12);assert.equal(a.get().xpNeeded,35);assert.equal(a.get().state,'playing');
console.log('OK: Orbs und Stufenfortschritt.');
reset();let previousNeed=10;for(let i=0;i<100;i++){a.setXp(a.get().xpNeeded);a.update(.01);assert.equal(a.get().state,'upgrade');a.chooseCard(0);const current=a.get().xpNeeded;assert.ok(Number.isFinite(current)&&current>=previousNeed&&current<=1500);if(a.get().level===10)assert.equal(current,Math.ceil(previousNeed*1.12));previousNeed=current}assert.equal(a.get().xpNeeded,1500,'Endlosfortschritt bleibt begrenzt');

// Orb-Bewegung und Notfallknopf.
reset();a.enemy(0);let walker=a.get().enemies[0];walker.x=500;walker.y=270;walker.speed=80;walker.hp=1;a.get().bullets.push(bullet(500,270));a.update(.01);let moving=a.get().orbs[0];assert.equal(moving.speed,40);let start=moving.x;a.update(.1);assert.ok(Math.abs(moving.x-(start-4))<1e-8);
reset();const behind={x:25,y:170,w:16,h:16,value:1,age:0};a.get().orbs.push(behind);
a.update(.1);assert.equal(behind.x,25);assert.equal(behind.y,170);
behind.x=a.get().player.x-55;behind.y=a.get().player.y;
const beforeXp=a.get().xp;
for(let i=0;i<100&&a.get().orbs.includes(behind);i++)a.update(.05);
assert.ok(!a.get().orbs.includes(behind));assert.ok(a.get().xp>beforeXp);
reset();const {player,orbs,upgrades}=a.get();
const atCardRange={x:player.x,y:player.y+84,w:16,h:16,value:1,age:0};
orbs.push(atCardRange);
a.update(.05);assert.equal(atCardRange.y,player.y+84);
upgrades.magnet=1;
a.update(.05);assert.ok(atCardRange.y<player.y+84,'Korkenzieher erweitert den Orb-Magnetradius');
reset();a.get().orbs.push({x:190,y:270,w:16,h:16,value:1,speed:40,age:0});let near=a.get().orbs[0];a.update(.05);assert.ok(near.x<185,'Magnet zieht den wandernden Orb an');
reset();a.startBoss();defeatBoss();assert.equal(a.get().orbs.find(o=>o.value===10).speed,32.5);
reset();a.startBoss();const survivingBoss=a.get().boss;for(let i=0;i<2;i++){a.enemy(i);let e=a.get().enemies.at(-1);e.x=500+i*80;e.y=200}a.get().shots.push({x:400,y:200,vx:0,vy:0,w:8,h:8,life:2});const savedOrb={x:350,y:200,w:16,h:16,value:3,speed:20,age:0},savedPickup={x:350,y:300,w:30,h:42,i:1};a.get().orbs.push(savedOrb);a.get().pickups.push(savedPickup);a.get().player.rage=100;assert.equal(a.activateRage(),true);assert.equal(a.get().enemies.length,0);assert.equal(a.get().shots.length,0);assert.equal(a.get().boss,survivingBoss);assert.equal(a.get().orbs.length,3);assert.ok(a.get().orbs.includes(savedOrb));assert.ok(a.get().pickups.includes(savedPickup));assert.ok(a.get().score>0);
reset();a.enemy(0);a.get().enemies[0].x=500;a.get().player.rage=100;a.setTime(95);a.setSpawn(0);a.activateRage();a.update(.01);assert.equal(a.get().enemies.length,1,'regulärer Spawn-Timer bleibt aktiv');
reset();a.hurt();a.get().player.inv=0;a.hurt();a.get().player.inv=0;a.hurt();a.get().player.rage=100;assert.ok(a.activateRage());assert.equal(a.get().hearts,4,'Käserausch heilt zwei Herzen');
reset();a.hurt();a.get().player.rage=100;a.activateRage();assert.equal(a.get().hearts,5,'Käserausch überschreitet Herzmaximum nicht');
reset();shoot();assert.ok(Math.abs(a.get().bullets[0].damage-.8625)<1e-9,'Grundschaden');a.startBoss();assert.ok(a.get().boss.max>=350,'Bosssegmente erhalten erhöhte Lebenspunkte');reset();
const hudctx=ctx(),art=vm.runInContext('PfertArt',sandbox);
const hud={...a.get(),maxHearts:5,weapon:-1,weaponNames:[],bosses:[],secret:false,secretType:0,secretTime:0,notice:0,noticeText:'',combo:0,threat:0,elements:{}};
for(const [value,width] of [[0,0],[5,480],[10,960],[15,960]]){
 const fills=[];
 hudctx.fillRect=(x,y,w,h)=>{if(x===0&&y===534&&h===5)fills.push(w)};
 hud.xp=value;hud.xpNeeded=10;art.hud(hudctx,hud);
 assert.deepEqual(fills,width?[width]:[],'Fortschrittsbreite '+value);
}
console.log('OK: Orb-Bewegung, Fortschrittsbalken und Notfallknopf.');

// Alle fünf Minuten wird ein Herz aufgefüllt, höchstens bis zum Maximum.
reset();a.hurt();a.get().player.inv=0;a.hurt();a.setRunTime(299.99);a.update(.02);assert.equal(a.get().hearts,4);a.update(.02);assert.equal(a.get().hearts,4);a.setRunTime(599.99);a.update(.02);assert.equal(a.get().hearts,5);a.setRunTime(899.99);a.update(.02);assert.equal(a.get().hearts,5);
reset();a.hurt();a.setRunTime(299.99);a.setXp(a.get().xpNeeded);a.update(.02);a.update(1);assert.equal(a.get().hearts,4);a.chooseCard(a.get().choices.findIndex(c=>c.id!=='healing'));a.update(.02);assert.equal(a.get().hearts,5);
