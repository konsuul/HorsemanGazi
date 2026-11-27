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
const dom={},keys={},page={},storage=new Map();
let focused;
const pad={mapping:'standard',axes:[0,0],buttons:Array.from({length:16},()=>({pressed:false}))};
const random=Object.create(Math);
random.random=()=>0;
const sandbox={Math:random,requestAnimationFrame:noop,navigator:{getGamepads:()=>[pad]},window:{Audio:class {constructor(){dom.music=this} addEventListener(){} play(){this.paused=false;return Promise.resolve()} pause(){this.paused=true}},localStorage:{getItem:key=>storage.get(key)??null,setItem:(key,value)=>storage.set(key,value)},addEventListener:(name,fn)=>{keys[name]??=fn}},document:{
 hidden:false,
 addEventListener:(name,fn)=>page[name]=fn,
 getElementById:id=>dom[id]||(dom[id]={id,classList:{add:noop,remove:noop,toggle:noop},addEventListener(name,fn){this['on'+name]=fn},setAttribute(name,value){this[name]=value},focus(){focused=this;this.onfocus?.()},getContext:context}),
 createElement:()=>({getContext:context})
}};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(__dirname+'/../Pfert/art.js','utf8'),sandbox);
vm.runInContext(fs.readFileSync(__dirname+'/../Pfert/sound.js','utf8'),sandbox);
const source=fs.readFileSync(__dirname+'/../Pfert/game.js','utf8').replace('})();',`
 globalThis.testApi={reset,update,render,frame,pollGamepad,hurt,offerCards,chooseCard,cardDefs,cardEffect,drawCard,startBoss,damagePart,
  get:()=>({state,t,runTime,player,hearts,choices,upgrades,transition,enemies,shots,bullets,boss}),
  setHearts:value=>hearts=value,setTime:value=>runTime=value,
  startPortal(){try{beginTransition('enter')}catch(error){if(error!==transitionInterrupt)throw error}}
 };
})();`);
vm.runInContext(source,sandbox);
const a=sandbox.testApi;
const press=(code,repeat=false)=>keys.keydown({code,repeat,target:focused,preventDefault:noop});
const poll=()=>a.pollGamepad();
function pressPad(button){
 pad.buttons[button].pressed=true;poll();
 pad.buttons[button].pressed=false;poll();
}

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
poll();pressPad(12);
assert.equal(focused,volume);
pressPad(15);
assert.equal(dom.music.volume,.63);
assert.equal(storage.get('pfert-music-volume'),'0.63');
press('Enter');assert.equal(a.get().state,'paused');
press('Escape');

// Power-ups are visible immediately; keyboard navigation goes straight to volume.
a.reset();a.get().upgrades.damage=2;a.get().upgrades.pierce=1;
press('Escape');
assert.match(dom.overlay.innerHTML,/id="pause-build-title">Power-ups <span>2/);
assert.match(dom.overlay.innerHTML,/<div id="pause-build-list">/);
assert.doesNotMatch(dom.overlay.innerHTML,/pause-build-toggle|aria-expanded|id="pause-build-list" hidden/);
assert.match(dom.overlay.innerHTML,/Käsereifung<\/span><small>Rang 2/);
assert.match(dom.overlay.innerHTML,/Harte Kruste<\/span><small>Rang 1/);
for(let i=0;i<3;i++)press('ArrowRight');
assert.equal(focused.id,'music-volume');
press('Enter');
assert.equal(a.get().state,'paused');
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
assert.equal(dom.music.paused,true);
sandbox.document.hidden=false;page.visibilitychange();
assert.equal(dom.music.paused,false);
assert.equal(a.get().state,'paused','Fokusgewinn setzt die Runde nicht automatisch fort');
press('KeyN');
sandbox.document.hidden=true;page.visibilitychange();
sandbox.document.hidden=false;page.visibilitychange();
assert.equal(dom.music.paused,true,'Ein ausgeblendeter Tab setzt die Musik-Stummschaltung nicht zurück');
press('KeyN');
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
assert.match(dom.overlay.innerHTML,/\+0 % Waffenschaden → \+2 % Waffenschaden/);

// A fraction of a heart and all named synergy prerequisites are visible.
a.reset();
for(const card of a.cardDefs.filter(card=>card.reload))a.get().upgrades[card.id]=card.max;
a.setHearts(4.5);a.offerCards();
assert.equal(a.get().choices[0].id,'healing');
assert.match(dom.overlay.innerHTML,/4,5 → 5 Herzen/);
a.reset();a.setTime(121);a.get().upgrades.frost=1;a.get().upgrades.ember=1;a.offerCards();
assert.equal(a.get().choices[0].id,'shatter');
assert.match(dom.overlay.innerHTML,/Benötigt Kühlkette \+ Räucherkammer/);
assert.match(dom.overlay.innerHTML,/0 % Trefferschaden als Explosion → 80 % Trefferschaden als Explosion/);
assert.equal(a.cardEffect('damage',2),'+53,76 % Schaden');

// A build-specific choice complements a rare offer and one general offer.
assert.ok(a.get().choices.some(card=>a.get().player.skill.cards.includes(card.id)));
assert.equal(new Set(a.get().choices.map(card=>card.id)).size,3);
const focusedCard=a.get().choices[2];
dom['card-2'].focus();press('Enter');
assert.equal(a.get().upgrades[focusedCard.id],1,'Enter übernimmt die per Tab fokussierte Karte');
const findCard=id=>a.cardDefs.find(card=>card.id===id);
for(const id of ['charge','blast','tempo']){
 const offers=Array.from({length:50},(_,index)=>{
  random.random=()=>(index+.5)/50;
  return a.drawCard([findCard(id),findCard('damage')]).id;
 });
 assert.equal(offers.filter(offer=>offer===id).length,10,id+' hat ein Viertel des Normalgewichts');
}
for(const roll of [.249,.25]){
 random.random=()=>roll;
 a.reset();a.setTime(121);a.get().upgrades.guard=1;a.offerCards();
 assert.equal(a.get().choices.some(card=>card.id==='orbital'),roll<.25);
 assert.equal(a.get().choices.length,3);
}
// Paused frames keep polling inputs without repainting the stationary world.
const paints=[];
vm.runInContext('const drawBackground=PfertArt.background;PfertArt.background=(...args)=>{recordPaint();drawBackground(...args)}',Object.assign(sandbox,{recordPaint:()=>paints.push(1)}));
a.reset();a.frame(1000);a.frame(1016);
assert.equal(paints.length,2);
press('Escape');
for(let i=0;i<60;i++)a.frame(1032+i*16);
assert.equal(paints.length,3);
press('Escape');a.frame(2000);
assert.equal(paints.length,4);

// Voluntary finish uses the normal recap without saving a score or emitting the death cue.
const cues=[];
vm.runInContext('PfertSound.play=kind=>recordCue(kind)',Object.assign(sandbox,{recordCue:kind=>cues.push(kind)}));
a.reset();a.startBoss();
const boss=a.get().boss;
for(const part of boss.parts.slice(0,-1))a.damagePart(part,part.hp,0,0);
assert.equal(cues.filter(cue=>cue==='bossClear').length,0);
for(let i=0;i<2;i++)a.damagePart(boss.parts.at(-1),boss.parts.at(-1).hp,0,0);
assert.equal(cues.filter(cue=>cue==='bossClear').length,1);
a.reset();press('Escape');dom['end-run'].onclick();
assert.match(dom.overlay.innerHTML,/Runde beenden\?/);
press('Escape');assert.match(dom.overlay.innerHTML,/Fortsetzen/);
dom['end-run'].onclick();dom['confirm-end'].onclick();
assert.equal(a.get().state,'over');
assert.match(dom.overlay.innerHTML,/Runde beendet/);
assert.doesNotMatch(dom.overlay.innerHTML,/scoreboard/);
assert.equal(cues.filter(cue=>cue==='die').length,0);
a.reset();const pilot=a.get().player;
pilot.inv=0;pilot.fieldPower.shield=0;
a.hurt('contact');assert.equal(a.get().hearts,4);
a.hurt('contact');assert.equal(a.get().hearts,4);assert.equal(pilot.protectionCue.label,'UNVERWUNDBAR');
pilot.inv=0;a.setHearts(1);a.hurt('contact');a.hurt('contact');
assert.equal(a.get().state,'over');
assert.equal(cues.filter(cue=>cue==='die').length,1);
console.log('OK: Pausen, Portal, Kartenangebote, Rundenabbruch, Herzverlust und einmaliger Todessound.');
