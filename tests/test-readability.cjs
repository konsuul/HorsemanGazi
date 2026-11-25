'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const PfertMeta=require('../Pfert/meta.js');
const noop=()=>{};
const makeContext=()=>{
 const calls=[];
 const context=new Proxy({
  calls,createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop}),
  fillText:(...args)=>calls.push(['text',...args]),
  fillRect:(...args)=>calls.push(['box',context.fillStyle,...args]),
  arc:(...args)=>calls.push(['arc',...args]),
  stroke:()=>calls.push(['stroke',context.strokeStyle])
 },{get:(object,key)=>object[key]??noop});
 return context;
};
const elements={},events={},context=makeContext();
const makeElement=()=>({classList:{add:noop,remove:noop},innerHTML:'',addEventListener:noop,appendChild:noop,getContext:()=>context});
let pad=null;
const motion={matches:false};
const sandbox={
 PfertMeta,navigator:{getGamepads:()=>pad?[pad]:[]},requestAnimationFrame:noop,
 document:{getElementById:id=>elements[id]||=makeElement(),addEventListener:noop,createElement:makeElement},
 window:{matchMedia:()=>motion,addEventListener:(event,listener)=>events[event]=listener,localStorage:{getItem:()=>null,setItem:noop}}
};
vm.createContext(sandbox);
const read=file=>fs.readFileSync(path.join(__dirname,'../Pfert',file),'utf8');
vm.runInContext(read('art.js'),sandbox);
vm.runInContext(read('game.js').replace('})();',`globalThis.check={
 art:PfertArt,reset,update,render,pollGamepad,enemy,fireSpecial,drawFieldPickup,
 setRunTime:value=>runTime=value,
 state:()=>({hearts,player,enemies,shots,bullets}),setMeta:value=>metaData=value,
 wine:()=>wineStatus(activeWeapon())
};})();`),sandbox);
const a=sandbox.check;

const pickupShapes=new Set();
for(const i of ['rockets','shield','sweeper']){
 context.calls.length=0;
 a.drawFieldPickup({i,x:200,y:150,age:1});
 const boxes=context.calls.filter(call=>call[0]==='box');
 assert.ok(boxes.length>0);
 pickupShapes.add(JSON.stringify(boxes.map(call=>call.slice(2))));
 assert.ok(!context.calls.some(call=>call[0]==='text'),'Power-up-Symbole sind Pixelgrafiken');
}
assert.equal(pickupShapes.size,3,'Jedes Feld-Power-up hat eine eigene Silhouette');

// A moving shield dial reuses its sprite until a shield changes.
const dials=[];
const dialCtx={drawImage:(...args)=>dials.push(args)};
a.art.shieldDial(dialCtx,{x:150,y:210},4,3);
a.art.shieldDial(dialCtx,{x:170,y:210},4,3);
a.art.shieldDial(dialCtx,{x:170,y:210},0,3);
assert.equal(dials[0][0],dials[1][0]);assert.equal(dials[1][1]-dials[0][1],20);
assert.notEqual(dials[1][0],dials[2][0]);

// Shield blocks leave the latest damage cause alone. Collision and real projectile damage record it.
a.reset();
const enemy=a.enemy(0);
Object.assign(enemy,{x:135,y:270,speed:0,fire:999});
a.state().player.effects[2]=5;
a.update(.01);
assert.equal(a.state().hearts,5);
assert.equal(a.state().player.lastDamage,undefined);
a.state().player.inv=0;
a.update(.01);
assert.equal(a.state().hearts,4);
assert.equal(a.state().player.lastDamage.source,'contact');
context.calls.length=0;a.render();
const damagePixels=context.calls.filter(call=>call[0]==='box'&&call[1]==='#ef7968');
assert.equal(damagePixels.length,12);
assert.ok(damagePixels.every(([, ,x,y,w,h])=>y>=62&&y+h<=533&&(w<=5||h<=5)));
motion.matches=true;
context.calls.length=0;a.render();
assert.ok(!context.calls.some(call=>call[0]==='box'&&call[1]==='#ef7968'));
motion.matches=false;
enemy.hp=0;
const p=a.state().player;
for(let i=0;i<4;i++){
 p.inv=0;
 p.podCooldown=100;
 a.state().shots.push({x:p.x+5,y:p.y,vx:-100,vy:0,w:10,h:10,life:1,age:0});
 a.update(.01);
}
assert.equal(a.state().hearts,0);
assert.equal(p.lastDamage.source,'projectile');
assert.equal(p.lastDamage.angle,0);
assert.match(elements.overlay.innerHTML,/Letzter Herzverlust · Feindgeschoss/);

// A fractional paid charge and an unused free attack are both shown and consumed in order.
a.reset();
const meta=PfertMeta.fresh();
meta.purchased=['W1-13'];
a.setMeta(meta);
const winePlayer=a.state().player;
assert.equal(a.wine(),null);
winePlayer.weapon=4;
winePlayer.effects[4]=.25;
assert.equal(a.wine().segments,10);
assert.equal(a.wine().paid,1);
assert.equal(a.wine().free,true);
assert.equal(a.wine().control,'LEERTASTE');
pad={mapping:'standard',axes:[.6,0],buttons:[]};
a.pollGamepad();
assert.equal(a.wine().control,'A');
events.keydown({code:'KeyD',repeat:false,preventDefault:noop});
assert.equal(a.wine().control,'LEERTASTE');
a.fireSpecial();
assert.equal(a.wine().free,false);
assert.equal(a.wine().paid,1);
a.fireSpecial();
assert.equal(a.wine(),null);

// The status bar reflects awarded points immediately and distinguishes them from score.
a.setMeta(PfertMeta.fresh());a.reset();
context.calls.length=0;a.render();
assert.ok(context.calls.some(call=>call[0]==='text'&&call[1]==='TALENTPUNKTE  +0'));
a.setRunTime(599.99);a.update(.02);
context.calls.length=0;a.render();
assert.ok(context.calls.some(call=>call[0]==='text'&&call[1]==='TALENTPUNKTE  +1'));

// Rendering uses separate pellet shapes, a timed ring for mines, and one to three marks for orb tiers.
for(const [kind,ringCount] of [['mine',1],['splitter',0]]){
 const early=makeContext(),late=makeContext();
 const shot={kind,x:200,y:200,vx:-50,vy:0,w:14,h:14,age:.3,burstAt:1.2};
 a.art.hostile(early,shot);
 a.art.hostile(late,{...shot,age:1});
 assert.equal(late.calls.filter(call=>call[0]==='arc').length,ringCount);
 assert.ok(late.calls.length>early.calls.length);
}
for(const tier of [1,2,3]){
 const ctx=makeContext();
 a.art.experienceOrb(ctx,{x:100,y:100,tier});
 assert.equal(ctx.calls.filter(call=>call[0]==='box'&&call[1]==='#f3ffff').length,tier);
 assert.ok(ctx.calls.some(call=>call[0]==='stroke'&&call[1]==='#162033'));
}
// Each elemental hit uses the same five raster pieces as it moves and fades.
{
 const ctx=makeContext(),pieces=[];
 ctx.drawImage=(sprite,x,y)=>pieces.push([sprite,x,y]);
 const hit={kind:'fire',x:400,y:270,offset:15,life:.12,maxLife:.52};
 a.art.elementalBurst(ctx,hit);
 a.art.elementalBurst(ctx,{...hit,x:450});
 assert.equal(pieces.length,10);
 assert.equal(new Set(pieces.map(([sprite])=>sprite)).size,2);
 for(let i=0;i<5;i++){
  assert.equal(pieces[i][0],pieces[i+5][0]);
  assert.equal(pieces[i+5][1]-pieces[i][1],50);
 }
}
// Every card stays inside the framed build panel, including a complete late run.
{
 const panel=makeContext();
 const build=Array.from({length:46},(_,i)=>({code:'TEST',rank:i+1}));
 a.art.hud(panel,{hearts:5,player:{},weapon:-1,t:0,score:0,level:1,xp:0,xpNeeded:10,build,upgrades:{}});
 const labels=panel.calls.filter(call=>call[0]==='text'&&String(call[1]).startsWith('TEST'));
 assert.equal(labels.length,46);
 assert.ok(labels.every(([,label,x,y,width])=>x-width/2>=618&&x+width/2<=860&&y<=55&&y>=22));
}
// Compare the same dense scene with and without decorative projectile effects.
a.reset();
const {player,bullets,shots}=a.state();
player.autoCooldown=Infinity;
for(let i=0;i<360;i++)bullets.push({
 x:300+i%120*4,y:120+i%70*5,vx:220,vy:0,w:14,h:14,life:3,hit:new Set(),style:'normal',
 trail:[{x:190,y:220},{x:195,y:220},{x:200,y:220}]
});
for(let i=0;i<216;i++)shots.push({
 x:550+i%80*4,y:120+i%70*5,vx:-120,vy:0,w:10,h:10,age:0,life:3,kind:'needle',
 trail:[{x:205,y:220},{x:200,y:220}]
});
const detailed=makeContext(),reduced=makeContext();
for(const shot of bullets){
 a.art.trail(detailed,shot);a.art.bullet(detailed,shot);
 a.art.bullet(reduced,shot,true);
}
for(const shot of shots){a.art.hostile(detailed,shot);a.art.hostile(reduced,shot,true)}
assert.ok(reduced.calls.length<detailed.calls.length*.65);
const previousX=shots[0].x;
a.update(.02);
assert.equal(a.state().bullets.length,360);
assert.equal(a.state().shots.length,216);
assert.ok(shots[0].x<previousX);
assert.ok([...bullets,...shots].every(shot=>!shot.trail.length));
a.render();
a.state().bullets.length=1;
a.state().shots.length=0;
a.update(.03);
assert.equal(a.state().bullets[0].trail.length,1);
console.log('OK: Geschosslast 360 + 216, protokollierte Zeichenoperationen '+detailed.calls.length+' → '+reduced.calls.length+'.');
console.log('OK: Trefferursachen, Wein-Sonderangriffe, Minenwarnung, Splitterwarnung und Orb-Kontrast.');
