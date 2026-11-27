'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const Ranch=require('../Pfert/ranch.js');
const values=new Map([['pfert-scoreboard-v1','[]'],['pfert-meta-v1','untouched']]);
const storage={getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value)};
let data=Ranch.load(storage).data;
const sequence=(...rolls)=>()=>{assert.ok(rolls.length,'unexpected RNG draw');return rolls.shift()};
assert.equal(Ranch.rollDrop(data,1799,0,sequence()),null);
assert.equal(Ranch.rollDrop(data,1800,0,sequence(.007)),null);
const drop=Ranch.rollDrop(data,1800,0,sequence(.006,.995,.51,.99));
assert.deepEqual(drop,{tier:'hengst',palette:2,pattern:3});
assert.deepEqual([0,.639,.64,.9,.989,.99].map(roll=>Ranch.rollTier(roll).id),
 ['pleb','pleb','otto','wallach','wallach','hengst']);
assert.deepEqual(Ranch.tiers.map(t=>t.minutes),[5,10,20,60]);
const distribution={};
for(let i=0;i<100;i++){const id=Ranch.rollTier((i+.5)/100).id;distribution[id]=(distribution[id]||0)+1}
assert.deepEqual(distribution,{pleb:64,otto:26,wallach:9,hengst:1});
assert.equal(Ranch.rollDrop(data,1800,3,sequence()),null);
const oldEgg={tier:'pleb'};
for(let i=0;i<6;i++)assert.ok(Ranch.collect(data,oldEgg));
assert.equal(Ranch.collect(data,oldEgg),null);
assert.equal(Ranch.rollDrop(data,1800,0,sequence()),null);
values.set(Ranch.key,JSON.stringify({version:2,eggs:[]}));
assert.equal(Ranch.load(storage).writable,false);
values.set(Ranch.key,'not JSON');
data=Ranch.load(storage).data;
const egg=Ranch.collect(data,{...drop,tier:'pleb'});
assert.equal(egg.variantId,11);
Ranch.advance(data,299.9);
assert.ok(Ranch.save(storage,data));
data=Ranch.load(storage).data;
assert.equal(data.eggs[0].id,egg.id);assert.equal(data.foals.length,0);
assert.equal(Ranch.advance(data,.1),1);
assert.ok(Ranch.save(storage,data));
data=Ranch.load(storage).data;
assert.equal(Ranch.advance(data,0),0);assert.equal(data.eggs.length,0);
assert.deepEqual(data.foals[0],{id:egg.id,tier:'pleb',palette:2,pattern:3,variantId:11,hatchedAt:300});
assert.ok(Ranch.collect(data,oldEgg).id>egg.id);
const legacy={version:1,nextId:1,active:50,eggs:[{id:22,tier:'otto',hatchAt:610}],foals:[]};
values.set(Ranch.key,JSON.stringify(legacy));
data=Ranch.load(storage).data;
assert.equal(data.eggs[0].variantId,0);assert.equal(data.nextId,23);
assert.equal(Ranch.save({setItem(){throw Error('quota')}},data),false);

const noop=()=>{};
const ctx=new Proxy({createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop})},
 {get:(obj,key)=>obj[key]||noop});
const elements=new Map(),handlers={};
const el=id=>{
 if(!elements.has(id))elements.set(id,{innerHTML:'',classList:{add:noop,remove:noop,toggle:noop},getContext:()=>ctx,addEventListener(type,fn){this[type]=fn}});
 return elements.get(id);
};
let padButtons=Array.from({length:16},()=>({pressed:false}));
const sandbox={assert,console,requestAnimationFrame:noop,navigator:{getGamepads:()=>[{mapping:'standard',axes:[0,0],buttons:padButtons}]},
 document:{getElementById:el,createElement:()=>el('canvas'),addEventListener:noop},
 window:{localStorage:storage,addEventListener:(type,fn)=>{handlers[type]=fn}}};
const source=name=>fs.readFileSync(__dirname+'/../Pfert/'+name,'utf8');
vm.createContext(sandbox);
for(const name of ['ranch.js','ranch-art.js','art.js'])vm.runInContext(source(name),sandbox);
vm.runInContext(source('game.js').replace(/\}\)\(\);\s*$/, `
 globalThis.test=()=>{
  reset();spawn=drop=xpNeeded=Infinity;player.autoCooldown=Infinity;
  const time=ranchData.active;
  update(.05);assert.equal(ranchData.active,time+.05);
  pauseGame();update(5);assert.equal(ranchData.active,time+.05);resumeGame();
  for(const mode of ['training','courier','debug']){
   startRun(mode);update(.05);assert.equal(ranchData.active,time+.05);
  }
  reset();
  let rolls=[0,.995,.5,.75];PfertRanch.rollDrop=new Proxy(PfertRanch.rollDrop,{apply(fn,self,args){return Reflect.apply(fn,self,[...args,()=>rolls.shift()])}});
  const enemy= {regularSpawn:true,x:player.x,y:player.y,w:40,h:30};
  t=1799;maybeDropEgg(enemy);assert.equal(ranchDrops.length,0);
  t=1800;maybeDropEgg(enemy);assert.equal(ranchDrops.length,1);
  maybeDropEgg(enemy);assert.equal(ranchDrops.length,1);
  const hatchCount=ranchData.foals.length;
  moveEggDrops(.05);assert.equal(ranchDrops.length,0);
  const picked=ranchData.eggs.at(-1);
  assert.equal(picked.tier,'hengst');assert.equal(picked.variantId,11);
  assert.equal(ranchData.foals.length,hatchCount);
  assert.ok(JSON.parse(window.localStorage.getItem(PfertRanch.key)).eggs.some(egg=>egg.id===picked.id));
  goToStartMenu();pollGamepad();
 };
 globalThis.pollRanchPad=pollGamepad;
 })();`),sandbox);
sandbox.test();
padButtons[9].pressed=true;sandbox.pollRanchPad();
assert.match(el('overlay').innerHTML,/Pferteranch/);
padButtons[9].pressed=false;sandbox.pollRanchPad();sandbox.pollRanchPad();
padButtons[1].pressed=true;sandbox.pollRanchPad();
assert.doesNotMatch(el('overlay').innerHTML,/class="ranch-panel"/);
padButtons[1].pressed=false;sandbox.pollRanchPad();
handlers.keydown({code:'KeyH',preventDefault:noop});
assert.match(el('overlay').innerHTML,/Pferteranch/);
assert.match(el('overlay').innerHTML,/Rauchblau|Pflaume/);
handlers.keydown({code:'Escape',preventDefault:noop});
assert.equal(values.get('pfert-scoreboard-v1'),'[]');
assert.equal(values.get('pfert-meta-v1'),'untouched');
console.log('OK: Pferteranch, gewichtete Eier, aktive Brutzeit, stabile Varianten und einmaliger Schlupf.');
