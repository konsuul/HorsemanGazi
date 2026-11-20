'use strict';
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const noop=()=>{};
function context(){
 return new Proxy({createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop})},{
  get:(obj,key)=>obj[key]||noop,
  set:(obj,key,value)=>(obj[key]=value,true)
 });
}
const dom={},keys={},page={};
const pad={mapping:'standard',axes:[0,0],buttons:Array.from({length:16},()=>({pressed:false}))};
const random=Object.create(Math);
random.random=()=>0;
const sandbox={Math:random,requestAnimationFrame:noop,navigator:{getGamepads:()=>[pad]},window:{Audio:class {constructor(){dom.music=this} addEventListener(){} play(){this.paused=false;return Promise.resolve()} pause(){this.paused=true}},addEventListener:(name,fn)=>{keys[name]??=fn}},document:{
 hidden:false,
 addEventListener:(name,fn)=>page[name]=fn,
 getElementById:id=>dom[id]||(dom[id]={classList:{add:noop,remove:noop,toggle:noop},addEventListener(name,fn){this['on'+name]=fn},getContext:context}),
 createElement:()=>({getContext:context})
}};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(__dirname+'/art.js','utf8'),sandbox);
vm.runInContext(fs.readFileSync(__dirname+'/sound.js','utf8'),sandbox);
const source=fs.readFileSync(__dirname+'/game.js','utf8').replace('})();',`
 globalThis.testApi={reset,update,render,pollGamepad,offerCards,chooseCard,cardDefs,cardEffect,
  get:()=>({state,t,runTime,player,hearts,choices,upgrades,transition,enemies,shots,bullets}),
  setHearts:value=>hearts=value,setTime:value=>runTime=value,
  startPortal(){try{beginTransition('enter')}catch(error){if(error!==transitionInterrupt)throw error}}
 };
})();`);
vm.runInContext(source,sandbox);
const a=sandbox.testApi;
const press=(code,repeat=false)=>keys.keydown({code,repeat,preventDefault:noop});
const poll=()=>a.pollGamepad();

// Escape opens the music slider, whose setting survives reopening the pause menu.
a.reset();
press('Escape');
assert.equal(a.get().state,'paused');
assert.match(dom.overlay.innerHTML,/id="music-volume" type="range" min="0" max="100"/);
const volume=dom['music-volume'];
assert.equal(Number(volume.value),32);
for(const value of [0,100,58]){
 volume.value=String(value);
 volume.oninput();
 assert.equal(dom.music.volume,value/100);
 assert.equal(a.get().state,'paused');
}
press('KeyN');assert.equal(dom.music.paused,true);
press('KeyN');assert.equal(dom.music.paused,false);
press('Escape');press('Escape');
assert.equal(Number(volume.value),58);
press('Escape');

// Visibility and focus pauses freeze gameplay and require an explicit resume.
a.reset();a.update(.05);
const old=a.get();const weapon=old.player;
weapon.effects[0]=4;weapon.weapon=0;
const playerX=weapon.x,bulletX=old.bullets[0].x;
pad.axes[0]=.4;
keys.blur();a.update(.5);a.render();
assert.equal(a.get().state,'paused');
assert.match(dom.overlay.innerHTML,/Fortsetzen/);
assert.equal(a.get().runTime,old.runTime);
assert.equal(weapon.effects[0],4);
assert.equal(old.bullets[0].x,bulletX);
press('Escape',true);assert.equal(a.get().state,'paused');
press('Enter');assert.equal(a.get().state,'playing');
poll();a.update(.05);assert.equal(weapon.x,playerX,'gehaltener Stick bewegt nach der Pause nicht');
pad.axes[0]=0;poll();
sandbox.document.hidden=true;page.visibilitychange();
assert.equal(a.get().state,'paused');
sandbox.document.hidden=false;page.visibilitychange();
assert.equal(a.get().state,'paused','Fokusgewinn setzt die Runde nicht automatisch fort');
press('Escape');poll();

// A controller menu press during the portal freezes its own timeline.
a.startPortal();a.update(.5);poll();
pad.buttons[9].pressed=true;poll();assert.equal(a.get().state,'paused');
a.update(2);assert.equal(a.get().transition.elapsed,.5);
poll();assert.equal(a.get().state,'paused','gehaltene Menütaste schaltet Pause nicht um');
pad.buttons[9].pressed=false;poll();
pad.buttons[9].pressed=true;poll();assert.equal(a.get().state,'transition');
pad.buttons[9].pressed=false;poll();a.update(.25);assert.equal(a.get().transition.elapsed,.75);

// A menu that is already waiting for a card remains open.
a.reset();a.offerCards();
const current=a.get().choices;
keys.blur();a.update(.5);assert.equal(a.get().state,'upgrade');assert.equal(a.get().choices,current);
assert.ok(current.every(card=>card.id!=='healing'));

// Full hearts exclude healing even when all limited cards are maxed out.
a.reset();
for(const card of a.cardDefs)if(Number.isFinite(card.max))a.get().upgrades[card.id]=card.max;
a.offerCards();
assert.equal(a.get().choices.length,3);
assert.ok(a.get().choices.every(card=>card.repeatable));
assert.match(dom.overlay.innerHTML,/Rang 0 → 1 · unbegrenzt/);
assert.match(dom.overlay.innerHTML,/\+0 % Waffenschaden → \+1 % Waffenschaden/);

// A fraction of a heart and all named synergy prerequisites are visible.
a.reset();a.setHearts(4.5);a.offerCards();
assert.equal(a.get().choices[0].id,'healing');
assert.match(dom.overlay.innerHTML,/4,5 → 5 Herzen/);
a.reset();a.setTime(121);a.get().upgrades.frost=1;a.get().upgrades.ember=1;a.offerCards();
assert.equal(a.get().choices[0].id,'shatter');
assert.match(dom.overlay.innerHTML,/Benötigt Kühlkette \+ Räucherkammer/);
assert.match(dom.overlay.innerHTML,/0 % Trefferschaden als Explosion → 40 % Trefferschaden als Explosion/);
assert.equal(a.cardEffect('damage',2),'+25,44 % Schaden');
console.log('OK: Pausen, Fokusverlust, Portal, sinnvolle Kartenangebote und Rangvorschau.');
