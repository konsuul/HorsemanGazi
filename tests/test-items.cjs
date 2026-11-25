'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const noop = () => {};
const canvas = new Proxy({
 createLinearGradient: () => ({addColorStop: noop}),
 createRadialGradient: () => ({addColorStop: noop})
}, {get: (target, key) => target[key] || noop});
const elements = new Map(), events = new Map();
function element(id){
 if(!elements.has(id)){
  const handlers = new Map(), classes = new Set();
  elements.set(id,{
   id, innerHTML:'', getContext:()=>canvas,
   classList:{
    add:(...names)=>names.forEach(name=>classes.add(name)),
    remove:(...names)=>names.forEach(name=>classes.delete(name)),
    toggle:(name,active)=>active?classes.add(name):classes.delete(name),
    contains:name=>classes.has(name)
   },
   addEventListener:(event,handler)=>handlers.set(event,handler),
   click:()=>handlers.get('click')?.(),
   focus:()=>handlers.get('focus')?.()
  });
 }
 return elements.get(id);
}
const pad = {id:'Xbox', mapping:'standard', axes:[0,0], buttons:Array.from({length:16},()=>({pressed:false}))};
const random = Object.create(Math);
random.random = () => .4;
const context = vm.createContext({
 Math:random, requestAnimationFrame:noop,
 navigator:{getGamepads:()=>[pad]},
 document:{getElementById:element,createElement:()=>({getContext:()=>canvas})},
 window:{addEventListener:(event,fn)=>events.set(event,fn)}
});
const read = name => fs.readFileSync(path.join(__dirname,'../Pfert',name),'utf8');
vm.runInContext(read('art.js'),context);
vm.runInContext(read('game.js').replace(/\}\)\(\);\s*$/, `
 globalThis.itemsTest={
  reset,update,render,keys,pollGamepad,gearCatalog,gearEffectLabels,gearSlots,
  equipGear,chooseGearDrop,dropGear,damageEnemy,death,enemy,spawnRareEnemy,activateRage,addRage,
  fireCharge,fireSpecial,shotInterval,startBoss,startRuhrBoss,damagePart,applyAilment,updateBoss,
  chooseCard,dropOrb,collectFieldPowerup,hurt,maxHearts,
  scene:()=>({state,pauseView,wornGear,gearBag,gearDrops,player,hearts,xp,boss,enemies,bullets,shots,pickups}),
  debug:()=>startDebugRun(),
  isolate:()=>{spawn=999;drop=999;nextRareEnemy=999;blockerPatrolDelay=999;player.autoCooldown=Infinity},
  mainBoss:index=>{bossCount=index;startBoss()},
  secretBoss:type=>{secret=true;secretType=type;startRuhrBoss()},
  defeatSegment:part=>{try{damagePart(part,1000,boss.x,boss.y)}catch(error){if(error!==transitionInterrupt)throw error}},
  setHearts:value=>{hearts=value},
  setXp:value=>{xp=value}
 };
})();`),context);
const a = context.itemsTest, catalog = a.gearCatalog, item = id => catalog[id-1], scene = a.scene;
function reset(){a.reset();a.isolate();random.random=()=>.4}
function key(code){events.get('keydown')({code,repeat:false,preventDefault:noop})}
function pressPad(button){
 a.pollGamepad();
 pad.buttons[button].pressed=true;a.pollGamepad();
 pad.buttons[button].pressed=false;a.pollGamepad();
}
function place(gear,at=scene().player,life=20){
 const drop={item:gear,x:at.x,y:at.y,w:30,h:30,life,returning:false};
 scene().gearDrops.push(drop);
 return drop;
}
function bottle(i){
 const {x,y}=scene().player;
 scene().pickups.push({i,x,y,w:30,h:42});
 a.update(.01);
}
function fill(){
 for(const id of [1,11,21,31,41])a.equipGear(item(id));
 scene().gearBag.push(...[2,12,24,42].map(item));
}
function near(actual,expected){
 assert.ok(Math.abs(actual-expected)<1e-8,`Erwartet ${expected}, erhalten ${actual}`);
}

// Katalog und gewichtet gezogene Stufen.
assert.equal(catalog.length,50);
assert.equal(new Set(catalog.map(gear=>gear.id)).size,50);
assert.equal(new Set(catalog.map(gear=>gear.name)).size,50);
for(const slot of Object.keys(a.gearSlots)){
 const gear=catalog.filter(item=>item.slot===slot);
 assert.deepEqual([0,1,2].map(rarity=>gear.filter(item=>item.rarity===rarity).length),[6,3,1]);
}
assert.ok(catalog.every(gear=>Object.keys(gear.effects).every(effect=>Object.hasOwn(a.gearEffectLabels,effect))));
reset();
for(const [isBoss,roll,rarity] of [
 [false,.749,0],[false,.75,1],[false,.99,1],
 [true,.199,0],[true,.2,1],[true,.849,1],[true,.85,2]
]){
 random.random=()=>roll;
 assert.equal(a.chooseGearDrop(isBoss).rarity,rarity);
}
random.random=()=>0;
a.equipGear(item(1));
scene().gearBag.push(item(2));
place(item(3));
assert.equal(a.chooseGearDrop(false).id,4);
for(const gear of catalog.filter(item=>item.rarity===0&&item.id>3))place(gear);
assert.equal(a.chooseGearDrop(false).rarity,1);
for(const gear of catalog.filter(item=>item.rarity===1))place(gear);
assert.equal(a.chooseGearDrop(true).rarity,2);

// Alle seltenen Gegner und Bosse liefern beim Sieg genau ein Item.
reset();
const rareNames=new Set();
for(let index=0;index<10;index++){
 a.spawnRareEnemy(250);
 const enemy=scene().enemies.at(-1);
 rareNames.add(enemy.rareEnemy.name);
 a.damageEnemy(enemy,100,enemy.x,enemy.y);
 assert.equal(scene().gearDrops.length,index+1);
}
assert.equal(rareNames.size,10);
assert.ok(scene().gearDrops.every(drop=>drop.x<=938&&drop.life===20));
a.death(scene().enemies.at(-1));
assert.equal(scene().gearDrops.length,10,'derselbe Gegner erzeugt nur einen Fund');
const regular=a.enemy(0,250);
a.damageEnemy(regular,100,regular.x,regular.y);
for(const traits of [{elite:true},{blocker:true}]){
 const enemy=Object.assign(a.enemy(0,250),traits);
 a.damageEnemy(enemy,100,enemy.x,enemy.y);
}
assert.equal(scene().gearDrops.length,10);
reset();a.spawnRareEnemy(270);
Object.assign(scene().enemies[0],{x:450,hp:.01,burnLife:1,burnDps:10});
a.update(.04);
assert.equal(scene().gearDrops.length,1,'Nachbrennen');
a.spawnRareEnemy(280);
scene().enemies.at(-1).x=500;scene().player.rage=100;
a.activateRage();
assert.equal(scene().gearDrops.length,2,'Käserausch');

for(let index=0;index<7;index++){
 reset();
 if(index<5)a.mainBoss(index);
 else a.secretBoss(index-4);
 const {parts}=scene().boss;
 for(const part of parts.slice(0,-1))a.defeatSegment(part);
 assert.equal(scene().gearDrops.length,0,'Kein Fund nach Teilzerstörung');
 a.defeatSegment(parts.at(-1));
 assert.equal(scene().gearDrops.length,1);
 const [loot]=scene().gearDrops;
 if(index>=5){
  assert.equal(scene().state,'transition');
  assert.equal(loot.returning,true);
  a.update(1.5);
  assert.equal(loot.returning,false);
  a.update(1.5);
  assert.equal(loot.life,20);
  assert.equal(scene().state,'playing');
 }
 Object.assign(scene().player,{x:loot.x,y:loot.y});
 a.update(.01);
 if(scene().state==='upgrade'){a.chooseCard(0);a.update(.01)}
 assert.equal(scene().gearDrops.length,0);
 assert.equal(scene().wornGear[loot.item.slot],loot.item);
}

// Ablauf zählt nur im aktiven Spiel. Pause, Rucksack und volle Beute bedienen.
reset();
const expiring=place(item(11),{x:600,y:200},.1);
a.render();
key('Escape');a.update(.5);near(expiring.life,.1);
key('Escape');a.update(.05);near(expiring.life,.05);
a.update(.05);assert.equal(scene().gearDrops.length,0);
place(item(1));a.update(.01);
assert.equal(scene().wornGear.head,item(1));
place(item(2));a.update(.01);
assert.equal(scene().gearBag[0],item(2));
key('Escape');key('ArrowRight');key('Enter');
assert.equal(scene().pauseView,'inventory');
assert.ok(element('gear-worn-head').classList.contains('gear-target'));
element('gear-bag-0').click();
assert.equal(scene().wornGear.head,item(2));
assert.equal(scene().gearBag[0],item(1));
key('Escape');key('Enter');
pressPad(9);pressPad(15);pressPad(0);
assert.equal(scene().pauseView,'inventory');
pressPad(0);
assert.equal(scene().wornGear.head,item(1));
pressPad(1);pressPad(9);
assert.equal(scene().state,'playing');

reset();a.equipGear(item(1));
scene().gearBag.push(...[2,3,4,5].map(item));
place(item(11));a.update(.01);
assert.equal(scene().wornGear.hooves,item(11),'Freier Platz hat Vorrang vor vollem Rucksack');
assert.equal(scene().state,'playing');

reset();fill();
place(item(3));a.update(.01);
assert.equal(scene().pauseView,'loot');
assert.match(element('overlay').innerHTML,/Korkhelm[\s\S]*Sesamkappe/);
element('gear-replace-2').click();
assert.equal(scene().gearBag[2],item(3));
assert.equal(scene().wornGear.head,item(1));
place(item(4));a.update(.01);
key('ArrowLeft');key('Enter');
assert.equal(scene().wornGear.head,item(4));
assert.equal(scene().gearBag.length,4);
place(item(5));a.update(.01);
pressPad(0);
assert.equal(scene().wornGear.head,item(4),'Vorauswahl lässt den Fund zurück');
assert.equal(scene().gearDrops.length,0);
place(item(5));a.update(.01);
pressPad(15);pressPad(0);
assert.equal(scene().gearBag[0],item(5));
place(item(6));a.setXp(10);a.update(.01);
assert.equal(scene().state,'upgrade');
a.chooseCard(0);a.update(.01);
assert.equal(scene().pauseView,'loot');
key('Escape');
place(item(7));a.setHearts(1);
const {x,y}=scene().player;
scene().player.podCooldown=2;
scene().shots.push({x,y,vx:0,vy:0,w:10,h:10,age:0,life:2});
a.update(.01);
assert.equal(scene().state,'over','Tödlicher Treffer hat Vorrang');
assert.equal(scene().gearDrops.length,0);
assert.equal(scene().gearBag.length,0);
assert.equal(Object.keys(scene().wornGear).length,0);
reset();fill();place(item(6));
a.debug();
assert.equal(Object.keys(scene().wornGear).length+scene().gearBag.length+scene().gearDrops.length,0);
fill();a.setHearts(1);a.hurt('projectile');
assert.equal(scene().state,'debugResult');
assert.equal(Object.keys(scene().wornGear).length+scene().gearBag.length,0);

// Ausrüstung wirkt additiv, Rucksackwerte sind inaktiv und alte Effekte behalten ihre Werte.
reset();
a.fireCharge();
const standard=scene().bullets.at(-1).damage,interval=a.shotInterval();
a.equipGear(item(1));a.equipGear(item(22));a.equipGear(item(34));
scene().gearBag.push(item(45));
a.fireCharge();
near(scene().bullets.at(-1).damage,standard*1.27);
near(scene().bullets[0].damage,standard);
a.equipGear(item(5));a.equipGear(item(31));
near(a.shotInterval(),interval/1.18);
a.keys.add('KeyD');a.update(.05);
const distance=scene().player.x-135;
scene().player.x=135;a.equipGear(item(11));a.update(.05);
near(scene().player.x-135,distance*1.08);

reset();bottle(0);a.fireCharge();
const wineDamage=scene().bullets.at(-1).damage;
reset();a.equipGear(item(6));a.equipGear(item(27));bottle(0);
near(scene().player.effectMax,18*1.16);
a.fireCharge();near(scene().bullets.at(-1).damage,wineDamage*1.16);
a.equipGear(item(25));
near(scene().player.effects[0],18*1.16,'Weindauer bleibt beim Wechsel erhalten');
a.collectFieldPowerup({i:'shield',x:135,y:270});
a.equipGear(item(23));
near(scene().player.fieldPower.shieldTime,10);
a.equipGear(item(39));a.fireSpecial();
near(scene().player.effects[0],18*1.16*(1-.082));

reset();a.dropOrb(135,270,2,0);a.update(.01);
const baseXp=scene().xp;
scene().player.rage=100;a.activateRage();
const baseRageDuration=scene().player.overdrive;
reset();a.equipGear(item(24));a.equipGear(item(41));
a.dropOrb(135,270,2,0);a.update(.01);
near(scene().xp,baseXp*1.22);
a.equipGear(item(29));a.equipGear(item(49));
a.addRage(10,'killRage');near(scene().player.rage,5*1.15);
scene().player.rage=100;a.activateRage();
const rageDuration=scene().player.overdrive;
near(rageDuration,baseRageDuration*1.36);
a.equipGear(item(43));near(scene().player.overdrive,rageDuration);

reset();a.equipGear(item(30));
assert.equal(a.maxHearts(),6);
assert.equal(scene().hearts,5);
a.setHearts(4);bottle(5);near(scene().hearts,5.5);
a.equipGear(item(21));assert.equal(scene().hearts,5);
a.equipGear(item(30));assert.equal(scene().hearts,5,'Rücktausch heilt kein Herz');
a.equipGear(item(34));
scene().player.effectMax=18;scene().player.effects[0]=18;scene().player.weapon=0;
a.fireCharge();near(scene().bullets.at(-1).damage,wineDamage);
a.setHearts(6);a.fireCharge();near(scene().bullets.at(-1).damage,wineDamage*1.10);

reset();a.mainBoss(0);a.equipGear(item(8));a.fireCharge();
const attack=scene().bullets[0],part=scene().boss.parts[0];
part.hp=part.max=100;
a.equipGear(item(1));
a.damagePart(part,10,800,270,attack.bossFactor);
near(part.hp,100-10*1.16);
a.applyAilment({damage:10,bossFactor:attack.bossFactor,elements:{fire:.4,frost:0}},part);
a.updateBoss(.25);
near(part.hp,100-10*1.16-10*.4*1.16*.25);

console.log('OK: 50 Ausrüstungsitems, Beute, Übergänge, Rucksack, Eingaben und Run-Werte.');
