'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const noop=()=>{};
const hudLabels=[];
const ctx=()=>new Proxy({fillText:text=>hudLabels.push(text),createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]||noop,set:(o,k,v)=>(o[k]=v,true)});
const events={},elements={};
const makeElement=()=>({classList:{add:noop,remove:noop},innerHTML:'',addEventListener:noop});
elements.game={getContext:ctx,getBoundingClientRect:()=>({left:0,top:0,width:960,height:540}),addEventListener:(name,fn)=>events[name]=fn};elements.overlay=makeElement();elements.start=makeElement();
let hints=[];
elements.overlay.querySelectorAll=selector=>{
 assert.equal(selector,'[data-pad-button]');
 hints=Array.from(elements.overlay.innerHTML.matchAll(/data-pad-button="(\d+)"/g),match=>({
  dataset:{padButton:match[1]},
  setAttribute(name,value){this[name]=value}
 }));
 return hints;
};
let gamepad=null;
const sandbox={navigator:{getGamepads:()=>gamepad?[gamepad]:[]},console,Math,Set,requestAnimationFrame:noop,document:{getElementById:id=>elements[id]||(elements[id]=makeElement()),createElement:()=>({width:0,height:0,getContext:ctx})},window:{addEventListener:(name,fn)=>events[name]=fn}};
vm.createContext(sandbox);vm.runInContext(fs.readFileSync(__dirname+'/../Pfert/art.js','utf8'),sandbox);
const source=fs.readFileSync(__dirname+'/../Pfert/game.js','utf8').replace('})();',
 'globalThis.testApi={baseSkills,shotInterval,goToStartMenu,collectFieldPowerup,reset,update,render,renderTransition,pollGamepad,offerCards,enemy,enemyAttack,startBoss,partHit,activateRage,hurt,keys,chooseCard,cardDefs,fireCharge,get:()=>({selectedCard,lastRare,t,runTime,level,xp,xpNeeded,orbs,choices,upgrades,hearts,score,player,enemies,bullets,beams,shots,pickups,boss,nextBoss,bossCount,state,transition,levelIndex,secret,secretTime,golden,goldenAppeared,secondAppeared,secretType,particles,deaths,arcs,flashes,threat}),setXp:v=>xp=v,setTime:v=>t=v,setFirstSeen:v=>goldenAppeared=v,setRunTime:v=>runTime=v,setNextBoss:v=>nextBoss=v,setSecretTime:v=>secretTime=v,setSpawn:v=>spawn=v,setDrop:v=>drop=v};})();');
vm.runInContext(source,sandbox);const a=sandbox.testApi;
function reset(){a.reset();a.setSpawn(999);a.setDrop(999);a.get().player.autoCooldown=Infinity}
function press(){events.keydown({code:'Space',repeat:false,preventDefault:noop})}
function release(){events.keyup({code:'Space',preventDefault:noop});a.get().player.autoCooldown=Infinity}
function shoot(duration=0){a.fireCharge(duration>0);a.get().player.autoCooldown=Infinity}
function bullet(x,y){return {x,y,vx:0,vy:0,w:10,h:10,pierce:false,damage:1,hit:new Set(),life:1}}
function defeatBoss(){const count=a.get().boss.parts.length;for(let i=0;i<count;i++){const q=a.get(),p=q.boss.parts[i];p.hp=1;q.bullets.push(bullet(q.boss.x+p.aim[0],q.boss.y+p.aim[1]));a.update(.01);if(i<count-1){assert.ok(a.get().boss,'Boss bleibt bis zum letzten Bereich');assert.equal(a.get().boss.parts[i].hp,0,'Bereich '+i+' besiegt')}}if(a.get().state!=='transition')assert.equal(a.get().boss,null)}
function finishTransition(){assert.equal(a.get().state,'transition');const before=a.get();const t=before.t,run=before.runTime,secretTime=before.secretTime,orb=before.orbs[0],x=orb?.x;press();a.pollGamepad();a.update(.75);a.renderTransition();a.update(.74);assert.equal(a.get().t,t);assert.equal(a.get().runTime,run);assert.equal(a.get().secretTime,secretTime);assert.equal(orb?.x,x);assert.equal(a.get().player.charging,false);assert.equal(a.get().state,'transition');a.update(.02);a.renderTransition();assert.equal(a.get().transition.switched,true);assert.equal(a.get().player.inv,2);a.update(1.48);assert.equal(a.get().state,'transition');a.update(.01);assert.equal(a.get().state,'playing');assert.equal(a.get().player.inv,2);release();assert.equal(a.get().player.charging,false)}


// Eingaben und gewichtete Synergien
function pad(){return {mapping:'standard',axes:[0,0],buttons:Array.from({length:16},()=>({pressed:false}))}}
gamepad=pad();a.pollGamepad();reset();let x=a.get().player.x;gamepad.axes[0]=1;a.pollGamepad();a.update(.05);assert.ok(a.get().player.x>x,'Stick bewegt');gamepad.axes[0]=.1;a.pollGamepad();x=a.get().player.x;a.update(.05);assert.equal(a.get().player.x,x,'Totzone');a.get().player.weapon=0;a.get().player.effects[0]=18;gamepad.buttons[0].pressed=true;a.pollGamepad();assert.equal(a.get().player.effects[0],16.2,'A löst aus');a.pollGamepad();assert.equal(a.get().player.effects[0],16.2,'Halten löst nicht erneut aus');gamepad.buttons[0].pressed=false;a.pollGamepad();assert.ok(a.get().bullets.length);a.get().player.rage=100;gamepad.buttons[1].pressed=true;a.pollGamepad();assert.ok(a.get().player.overdrive>0,'B aktiviert Käserausch');gamepad.buttons[1].pressed=false;a.pollGamepad();
a.setXp(a.get().xpNeeded);a.update(.01);assert.equal(a.get().selectedCard,0);events.keydown({code:'ArrowRight',repeat:false,preventDefault:noop});assert.equal(a.get().selectedCard,1);press();assert.equal(a.get().state,'upgrade','Leertaste bestätigt keine Karte');events.keydown({code:'Enter',repeat:false,preventDefault:noop});assert.equal(a.get().state,'playing');
a.setRunTime(120);a.setXp(a.get().xpNeeded);a.update(.01);a.pollGamepad();gamepad.buttons[15].pressed=true;a.pollGamepad();assert.equal(a.get().selectedCard,1);a.pollGamepad();assert.equal(a.get().selectedCard,1,'gehaltene Richtung wiederholt nicht');gamepad.buttons[15].pressed=false;a.pollGamepad();gamepad.buttons[0].pressed=true;a.pollGamepad();assert.equal(a.get().state,'upgrade','A bestätigt keine Karte');gamepad.buttons[0].pressed=false;gamepad.buttons[2].pressed=true;a.pollGamepad();assert.equal(a.get().state,'playing');gamepad.buttons[2].pressed=false;a.pollGamepad();
reset();a.get().upgrades.spread=1;a.setRunTime(120);a.setXp(10);a.offerCards();assert.equal(a.get().choices[0].id,'fork');a.chooseCard(1);for(const id of Object.keys(a.get().upgrades))a.get().upgrades[id]=0;a.get().upgrades.spread=1;a.setXp(15);a.offerCards();assert.equal(a.get().choices[0].id,'fork','einzige berechtigte Karte bleibt verfügbar');
console.log('OK: Controller, Tastatur und seltene Karten gezielt geprüft.');


// Ein bereits geöffnetes Kartenmenü aktualisiert seine Symbole beim Controllerwechsel.
reset();
a.offerCards();
assert.deepEqual(hints.map(hint=>hint.textContent),['X']);
for(const id of ['Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 09cc)','54c-ce6-Wireless Controller','DualSense Wireless Controller']){
 gamepad={...pad(),id};
 a.pollGamepad();
 assert.deepEqual(hints.map(hint=>hint.textContent),['□']);
 assert.equal(hints[0]['aria-label'],'Viereck');
}
gamepad={...pad(),id:'Xbox Wireless Controller'};
a.pollGamepad();
assert.deepEqual(hints.map(hint=>hint.textContent),['X']);
gamepad={...pad(),id:'Unbekannter Standard-Controller'};
a.pollGamepad();
assert.deepEqual(hints.map(hint=>hint.textContent),['X']);

// Shift und die linke Schultertaste ändern das Flugtempo nicht.
reset();
gamepad=null;a.pollGamepad();
const pilot=a.get().player;
function stride(){
 const x=pilot.x;a.update(.04);return pilot.x-x;
}
events.keydown({code:'KeyD',preventDefault:noop});
const fullStride=stride();
events.keydown({code:'ShiftLeft',preventDefault:noop});
assert.ok(Math.abs(stride()-fullStride)<1e-8);
events.keyup({code:'ShiftLeft',preventDefault:noop});
assert.ok(Math.abs(stride()-fullStride)<1e-8);
events.keyup({code:'KeyD',preventDefault:noop});
gamepad={...pad(),id:'Xbox Wireless Controller',axes:[1,0]};
gamepad.buttons[4].pressed=true;a.pollGamepad();
assert.ok(Math.abs(stride()-fullStride)<1e-8);
gamepad.buttons[4].pressed=false;a.pollGamepad();
assert.ok(Math.abs(stride()-fullStride)<1e-8);
gamepad=null;a.pollGamepad();

// Beim Sonderangriff folgt das HUD der letzten Eingabe und dem erkannten Gamepad.
reset();
a.get().player.weapon=0;
a.get().player.effects[0]=18;
gamepad={...pad(),id:'DualShock 4',axes:[1,0]};
a.pollGamepad();
hudLabels.length=0;
a.render();
assert.ok(hudLabels.some(label=>label.startsWith('[×] SONDERANGRIFF')));
gamepad=null;
a.pollGamepad();
hudLabels.length=0;
a.render();
assert.ok(hudLabels.some(label=>label.startsWith('[LEERTASTE] SONDERANGRIFF')));

// Auch wiederholte Sonderangriffe bestätigen im Kartenmenü keine Karte.
reset();a.setXp(a.get().xpNeeded);a.update(.01);events.keydown({code:'ArrowRight',repeat:false,preventDefault:noop});const chosen=a.get().choices[1].id;const before=a.get().upgrades[chosen];press();release();press();assert.equal(a.get().state,'upgrade');assert.equal(a.get().upgrades[chosen],before);events.keydown({code:'Enter',repeat:false,preventDefault:noop});assert.equal(a.get().state,'playing');assert.equal(a.get().upgrades[chosen],before+1);assert.equal(a.get().bullets.length,0);events.keyup({code:'Space',preventDefault:noop});a.setXp(a.get().xpNeeded);a.update(.01);events.keydown({code:'Space',repeat:true,preventDefault:noop});assert.equal(a.get().state,'upgrade','gehaltene Leertaste bestätigt nicht erneut');a.chooseCard(0);a.get().player.weapon=0;a.get().player.effects[0]=18;events.keydown({code:'Space',repeat:false,preventDefault:noop});assert.ok(a.get().player.effects[0]<18,'Leertaste löst im Spiel den Sonderangriff aus');

// A und D navigieren Karten, bleiben im Spiel Bewegungstasten.
reset();a.setXp(a.get().xpNeeded);a.update(.01);events.keydown({code:'KeyD',repeat:false,preventDefault:noop});assert.equal(a.get().selectedCard,1);events.keydown({code:'KeyD',repeat:true,preventDefault:noop});assert.equal(a.get().selectedCard,1);events.keydown({code:'KeyA',repeat:false,preventDefault:noop});assert.equal(a.get().selectedCard,0);events.keydown({code:'KeyA',repeat:false,preventDefault:noop});assert.equal(a.get().selectedCard,2);a.chooseCard(0);let oldX=a.get().player.x;events.keydown({code:'KeyD',repeat:false,preventDefault:noop});a.update(.05);assert.ok(a.get().player.x>oldX);events.keyup({code:'KeyD',preventDefault:noop});oldX=a.get().player.x;events.keydown({code:'KeyA',repeat:false,preventDefault:noop});a.update(.05);assert.ok(a.get().player.x<oldX);events.keyup({code:'KeyA',preventDefault:noop});


// Pre-run selection, build-specific damage and cards, and the two new beam paths.
{
 gamepad=null;a.pollGamepad();
 const key=(code,repeat=false)=>events.keydown({code,repeat,preventDefault:noop});
 a.goToStartMenu();key('Enter');
 assert.equal(a.get().state,'skill');
 key('Enter',true);assert.equal(a.get().state,'skill','Gehaltenes Enter überspringt die Auswahl nicht');
 key('ArrowRight');key('Enter');assert.equal(a.get().player.skill.id,'precision');
 a.fireCharge();const bolt=a.get().bullets[0];
 assert.ok(bolt.vx<470&&Math.abs(bolt.damage-.8625*1.77)<1e-9);assert.equal(bolt.skillElement,'precision');assert.equal(a.get().bullets.length,1);
 a.offerCards();assert.ok(a.get().choices.some(card=>a.get().player.skill.cards.includes(card.id)));
 a.reset(a.baseSkills[2]);a.fireCharge();
 assert.ok(a.get().bullets[0].elements.fire>0);assert.equal(a.get().bullets[0].skillElement,'element');

 a.reset(a.baseSkills[0]);
 a.get().upgrades.multiShot=2;a.get().upgrades.fanShot=2;a.fireCharge();
 const [main,...copies]=a.get().bullets;
 assert.equal(copies.length,6);
 assert.ok(Math.abs(copies[0].damage/main.damage-.1152)<1e-9);
 assert.ok(Math.abs(copies[2].damage/main.damage-.17)<1e-9);
 assert.ok(copies[2].damage>copies[4].damage);
 assert.equal(main.elements.frost,.25);assert.equal(main.skillElement,'salvo');
 assert.equal(main.y,a.get().player.y-2);

 a.reset(a.baseSkills[3]);a.setSpawn(999);a.setDrop(999);
 const pilot=a.get().player;
 assert.equal(a.shotInterval(),.62/1.5);
 const victim=(x,y)=>Object.assign(a.enemy(0,y),{x,y,speed:0,hp:100,max:100,fire:Infinity});
 const near=victim(390,268),far=victim(590,268),offLane=victim(640,379);
 a.fireCharge();pilot.autoCooldown=Infinity;
 assert.equal(a.get().bullets.length,0);assert.equal(a.get().beams[0].style,'light');
 assert.ok(Math.abs(a.get().beams[0].damage-1.22*1.6*.75*1.15)<1e-9);
 a.update(.01);
 assert.ok(near.hp<100&&far.hp<100);assert.equal(offLane.hp,100);
 const after=near.hp;a.update(.05);assert.equal(near.hp,after,'Lichtlanze trifft jedes Ziel pro Impuls einmal');
 pilot.weapon=3;pilot.effects[3]=1;a.fireCharge();assert.equal(a.get().beams.at(-1).style,'port');
 pilot.effects[3]=0;a.fireCharge();assert.equal(a.get().beams.at(-1).style,'light','Nach Wein wieder Lichtlanze');
}
{
 a.reset(a.baseSkills[3]);a.setSpawn(999);a.setDrop(999);
 const {player,upgrades,beams}=a.get();
 upgrades.carousel=1;
 const victim=(x,y)=>Object.assign(a.enemy(0,y),{x,y,speed:0,hp:100,max:100,fire:Infinity});
 const distant=victim(500,268),above=victim(135,174),outside=victim(430,150);
 a.collectFieldPowerup({i:'rockets'});a.collectFieldPowerup({i:'shield'});a.collectFieldPowerup({i:'sweeper'});
 a.fireCharge();player.autoCooldown=Infinity;
 player.fieldPower.beamTime=0;
 player.fieldPower.rockets=0;
 a.update(.05);
 assert.ok(distant.hp<100,'Die Lichtlanze reicht sofort über das Spielfeld');
 assert.equal(beams[0].angle,0);
 assert.equal(beams[0].color,'rgb(230,255,249)');a.render();
 const after=distant.hp;
 for(let i=0;i<12;i++)a.update(.05);
 assert.ok(above.hp<100,'Der umlaufende Käse trifft über dem Pfert');
 assert.equal(distant.hp,after,'Die Lichtlanze trifft beim selben Impuls nur einmal');
 assert.equal(outside.hp,100);
}
{
 a.reset(a.baseSkills[3]);a.setSpawn(999);a.setDrop(999);
 const {player,upgrades,beams}=a.get();
 Object.assign(upgrades,{carousel:1,multiShot:1,fanShot:1,echoForge:1});
 player.attacks=3;a.fireCharge();player.autoCooldown=Infinity;
 assert.equal(beams.length,6);
 assert.deepEqual(Array.from(beams.slice(1,4),b=>b.shotAngle),[0,-.09,.09]);
 assert.ok(beams.slice(1).every(b=>b.opacity===.8&&b.damage<beams[0].damage&&b.splitTargets!==beams[0].splitTargets));
 const flank=Object.assign(a.enemy(0,307),{x:600,y:307,w:20,h:20,speed:0,hp:100,max:100,fire:Infinity});
 a.update(.05);
 assert.ok(flank.hp<100,'Ein Fächerstrahl trifft außerhalb der Spur des Hauptstrahls');
 assert.ok(beams[2].angle<0&&beams[3].angle>0,'Fächer behält seine eigenen Winkel');
}
{
 const fillRanks=()=>{const {upgrades}=a.get();for(const card of a.cardDefs)upgrades[card.id]=Number.isFinite(card.max)?card.max:0;return upgrades};
 a.reset(a.baseSkills[3]);a.setRunTime(120);
 let upgrades=fillRanks();
 const incompatible=['velocity','pierce','ricochet','boomerang','bounceCrust','charge','blast','orbital','tempo','echo'];
 for(const id of [...incompatible,'spread','rear','breakShot','fork','fuseRocket','tideBell','cinderArc','iceSpindle',
  'sparkBobbin','pearlPod','moonHook','railSkip','anchorCore'])upgrades[id]=0;
 // Sonnenlanze allein liefert keine Projektile. Prüfe den Ziehbereich mit festen Werten.
 const random=Math.random;
 try{
  for(let i=0;i<30;i++){
   Math.random=()=>i/30;
   a.offerCards();
   assert.ok(a.get().choices.every(c=>!incompatible.includes(c.id)));
  }
 }finally{Math.random=random}
 a.reset(a.baseSkills[3]);a.setRunTime(120);upgrades=fillRanks();
 Object.assign(upgrades,{pierce:0,velocity:0,ricochet:0,boomerang:0,bounceCrust:0,echo:0,orbital:0});
 a.offerCards();
 assert.deepEqual(Array.from(a.get().choices,c=>c.id).sort(),['pierce','ricochet','velocity'],'Mit eigenen Projektilen zählen Projektilkarten zum Build');
 a.reset(a.baseSkills[3]);a.setRunTime(120);fillRanks();a.offerCards();
 assert.deepEqual(Array.from(a.get().choices,c=>c.id).sort(),['cellar','mastery'],'Spätes Spiel bietet nur passende Wiederholungskarten');
}
{
 reset();
 const {player}=a.get();
 const victim=(x,y)=>Object.assign(a.enemy(0,y),{x,y,speed:0,hp:100,max:100,fire:Infinity});
 const first=victim(500,205),second=victim(605,395);
 a.collectFieldPowerup({i:'sweeper',x:player.x,y:player.y});
 a.update(.01);
 assert.ok(first.hp<100);assert.equal(second.hp,100);
 events.keydown({code:'KeyE',repeat:false,preventDefault:noop});
 const firstHp=first.hp;
 const along={...bullet((player.x+27+second.x)/2,(player.y-2+second.y)/2),life:2};
 const beside={...along,y:along.y+45};
 a.get().shots.push(along,beside);
 a.update(.17);
 assert.equal(along.life,0);assert.ok(beside.life>0);
 assert.equal(first.hp,firstHp);assert.ok(second.hp<100);
 events.pointerdown({button:0,clientX:first.x,clientY:first.y});
 assert.equal(player.fieldPower.beamTarget,first,'Klick markiert ein einzelnes Ziel');
 a.startBoss();const {boss}=a.get();boss.x=700;
 const targets=boss.parts.filter(part=>part.hp>0);
 const initial=targets.map(part=>part.hp);
 a.update(.17);
 const locked=player.fieldPower.beamTarget,index=targets.indexOf(locked);
 assert.ok(index>=0&&locked.hp<initial[index]);
 assert.ok(targets.every((part,i)=>i===index||part.hp===initial[i]));
 const next=targets[(index+1)%targets.length];
 gamepad=pad();a.pollGamepad();gamepad.buttons[3].pressed=true;a.pollGamepad();
 assert.equal(player.fieldPower.beamTarget,next,'Y wechselt zum nächsten lebenden Bosssegment');
 gamepad=null;a.pollGamepad();
}
console.log('OK: Basisskills, Laserkreisel, Zusatzstrahlen, Kartenfilter und Räumstrahl-Zielwahl.');
