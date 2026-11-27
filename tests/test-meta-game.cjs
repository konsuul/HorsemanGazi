'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const PfertMeta=require('../Pfert/meta.js');
const noop=()=>{};
const element=()=>({classList:{add:noop,remove:noop},addEventListener(name,fn){this[name]=fn},innerHTML:'',style:{},
 querySelector:()=>element(),querySelectorAll:()=>[],clientWidth:900,clientHeight:620});
const elements={game:{getContext:()=>({})},overlay:element(),start:element(),talents:element()};
const stored=new Map(),localStorage={getItem:key=>stored.get(key)??null,setItem:(key,value)=>stored.set(key,value)};
const events={};
let backup,download;
const sandbox={PfertMeta,Blob,URL:{createObjectURL:file=>{backup=file;return "blob:backup"},revokeObjectURL:noop},setTimeout:fn=>fn(),window:{localStorage,confirm:()=>true,addEventListener:(name,fn)=>events[name]=fn},document:{getElementById:id=>elements[id]||(elements[id]=element()),createElement:tag=>tag==="a"?{click(){download=this.download}}:element()},navigator:{},requestAnimationFrame:noop,Math,Set,console};
elements.overlay.appendChild=noop;
vm.createContext(sandbox);
for(const file of ['meta-data.js','art.js'])vm.runInContext(fs.readFileSync(__dirname+'/../Pfert/'+file,'utf8'),sandbox);
const src=fs.readFileSync(__dirname+'/../Pfert/game.js','utf8').replace('})();','globalThis.check={talentWheelZoom,layoutTalentNodes,talentVisibility,renderTalents,showTalents,exportTalents,importTalents,talentTitle,talentIcon,reset,activateRage,fireCharge,fireSpecial,update,hurt,damage,modifyDirectHit,onHit,keys,startBoss,damagePart,end,startDebugRun,goToStartMenu,get:()=>({player,bullets,enemies,shots,pickups,hearts,orbs,xp,boss,secretType,runTime,metaTimePoints,metaBosses,metaData}),setData:d=>metaData=d};})();');
vm.runInContext(src,sandbox);
const a=sandbox.check;
for(const id of PfertMeta.nodes){
 assert.ok(a.talentTitle(id)&&!a.talentTitle(id).includes(id),'Verständlicher Name für '+id);
 assert.match(a.talentIcon(id),/<svg[^>]+aria-hidden="true"><path d="/);
}
{
 const saved=()=>PfertMeta.load(localStorage).data;
 a.setData({...PfertMeta.fresh(),seconds:599.8});a.reset();
 a.update(.1);
 assert.equal(saved().points,0);
 a.update(.15);
 assert.equal(saved().points,1,'Zeitpunkt wird im laufenden Run gespeichert');
 a.startBoss();
 const boss=a.get().boss;
 for(const part of boss.parts)a.damagePart(part,part.hp,boss.x,boss.y);
 assert.equal(saved().points,2,'Boss-Punkt ist vor dem Rundenende gespeichert');
 assert.equal(a.get().metaTimePoints+a.get().metaBosses,2);
 a.update(.2);a.end();
 assert.equal(saved().points,2,'Rundenende vergibt gespeicherte Punkte nicht doppelt');
 assert.ok(Math.abs(saved().seconds-.25)<1e-8);
 a.setData(saved());a.reset();
 assert.equal(a.get().metaTimePoints+a.get().metaBosses,0);
 a.startBoss();
 const next=a.get().boss;
 for(const part of next.parts)a.damagePart(part,part.hp,next.x,next.y);
 assert.equal(saved().points,3,'Neuer Run beginnt mit geladenem Fortschritt');
 a.setData(saved());a.startDebugRun();a.update(600);a.end();
 assert.equal(saved().points,3,'Bossprobe zählt nicht für den Talentfortschritt');
 a.setData(saved());a.reset();a.update(.2);
 const priorSeconds=saved().seconds;
 events.pagehide();events.pagehide();
 assert.ok(Math.abs(saved().seconds-priorSeconds-.2)<1e-8,'Beim Seitenwechsel wird Spielzeit genau einmal gespeichert');
}
for(const ending of ['credits','encore']){
 a.setData({...PfertMeta.fresh(),seconds:599.8});a.reset();a.update(.25);
 a.startBoss();a.startBoss();a.startBoss();
 const boss=a.get().boss;for(const p of boss.parts)a.damagePart(p,Infinity,boss.x,boss.y);
 assert.equal(PfertMeta.load(localStorage).data.points,2);
 elements[ending].click();
 if(ending==='encore')a.end();
 events.pagehide();
 assert.equal(PfertMeta.load(localStorage).data.points,2,'Zeit und Pascha genau einmal: '+ending);
}
{const initial={x:40,y:-20},x=200,y=120,zoom=.3;const result=a.talentWheelZoom(zoom,initial,x,y,-37);assert.ok(result.zoom>zoom&&result.zoom<.4);assert.ok(Math.abs((x-result.pan.x)/result.zoom-(x-initial.x)/zoom)<1e-9);assert.ok(Math.abs((y-result.pan.y)/result.zoom-(y-initial.y)/zoom)<1e-9);assert.equal(a.talentWheelZoom(zoom,initial,x,y,1e6).zoom,.15);assert.equal(a.talentWheelZoom(zoom,initial,x,y,-1e6).zoom,1.5);}
assert.equal(a.talentWheelZoom(.4,{x:0,y:0},100,100,1e6,.25).zoom,.25,'Herauszoomen bleibt bei der bildfüllenden Übersicht stehen');
{
 const listeners={},viewport=element(),map=element();
 viewport.querySelector=()=>map;
 viewport.addEventListener=(name,handler)=>listeners[name]=handler;
 let capture=null,prevented=false,stopped=false;
 viewport.setPointerCapture=id=>capture=id;
 elements['meta-viewport']=viewport;
 a.renderTalents();
 const pointer={pointerId:1,button:0,clientX:100,clientY:100};
 const click={detail:1,preventDefault:()=>prevented=true,stopPropagation:()=>stopped=true};
 listeners.dragstart(click);
 assert.ok(prevented,'Native Drag-and-drop-Aktion verhindern');
 prevented=false;
 const left=parseFloat(map.style.left),top=parseFloat(map.style.top);
 listeners.pointerdown(pointer);
 listeners.pointermove({...pointer,clientX:102});
 listeners.pointerup(pointer);
 listeners.click(click);
 assert.equal(capture,null,'Ein normaler Klick bleibt möglich');
 assert.ok(!prevented&&!stopped);
 listeners.pointerdown(pointer);
 listeners.pointermove({...pointer,clientX:124,clientY:115});
 assert.equal(capture,1);
 assert.equal(parseFloat(map.style.left),left+24);
 assert.equal(parseFloat(map.style.top),top+15);
 listeners.pointerup(pointer);
 listeners.click(click);
 assert.ok(prevented&&stopped,'Loslassen nach dem Ziehen löst keinen Knotenklick aus');
 delete elements['meta-viewport'];
}
{
 const positions=a.layoutTalentNodes();
 assert.deepEqual(Object.keys(positions).sort(),[...PfertMeta.nodes].sort());
 assert.equal(new Set(Object.values(positions).map(({x,y})=>x+','+y)).size,PfertMeta.nodes.length);
 assert.equal(positions.S1.x,1565);
 assert.equal(positions.S1.y,1230);
 const fresh={...PfertMeta.fresh(),points:400};
 assert.deepEqual([...a.talentVisibility(fresh).revealed],['S1']);
 const bought=PfertMeta.buy(fresh,'S1');
 const entries=[...PfertMeta.nodes].filter(id=>id.endsWith('-1'));
  assert.equal(entries.length,15);
  for(const entry of entries)assert.ok(PfertMeta.buy(bought,entry),entry+' ist direkt nach S1 kaufbar');
  assert.deepEqual([...a.talentVisibility(bought).revealed].sort(),[...entries,'S1','S2'].sort());
 a.setData(fresh);a.renderTalents();
 assert.match(elements.overlay.innerHTML,/Noch keine Boni freigeschaltet/);
 assert.equal((elements.overlay.innerHTML.match(/class="meta-cluster"/g)||[]).length,15);
 assert.match(elements.overlay.innerHTML,/Schwere Salve/);
 assert.equal((elements.overlay.innerHTML.match(/class="meta-node /g)||[]).length,1);
 const lockedId='W3-23',hoverEvents={};
 const lockedNode={dataset:{id:lockedId},addEventListener:(name,handler)=>hoverEvents[name]=handler,
  getBoundingClientRect:()=>({left:190,top:130,width:10,bottom:140})};
 let tooltip;
 elements.overlay.querySelectorAll=selector=>selector==='.meta-node, .meta-locked'?[lockedNode]:[];
 elements.overlay.appendChild=node=>tooltip=node;
 elements.overlay.getBoundingClientRect=()=>({left:0,top:0,width:900,height:620});
 a.renderTalents();
 assert.match(elements.overlay.innerHTML,/class="meta-locked area-W" data-id="W3-23"/);
 hoverEvents.mouseenter();
 assert.equal(tooltip.hidden,false);
 assert.ok(tooltip.textContent.startsWith(a.talentTitle(lockedId)+' · Gesperrt · '));
 const description=vm.runInContext('PfertMetaData.descriptions["W3-23"]',sandbox);
 assert.ok(description&&tooltip.textContent.includes(PfertMeta.describe(fresh,lockedId,description)));
 hoverEvents.mouseleave();
 assert.equal(tooltip.hidden,true);
 assert.equal(PfertMeta.buy(fresh,lockedId),null);
 elements.overlay.querySelectorAll=()=>[];
 elements.overlay.appendChild=noop;
 a.setData(bought);a.renderTalents();
 const bonusPanel=()=>elements.overlay.innerHTML.match(/<section class="meta-bonuses"[^>]*>(.*?)<\/section>/)[1];
 assert.ok(bonusPanel().includes(a.talentTitle('S1')));
 assert.equal((bonusPanel().match(/<li>/g)||[]).length,1);
 assert.equal((elements.overlay.innerHTML.match(/class="meta-node /g)||[]).length,17);
 const ranked=PfertMeta.buy(PfertMeta.buy(bought,'A1-1'),'A1-1');
 a.setData(ranked);a.renderTalents();
 assert.match(bonusPanel(),/insgesamt · Rang 2\/5/);
 assert.equal((bonusPanel().match(/<li>/g)||[]).length,2);
 a.setData(PfertMeta.sell(ranked,'A1-1'));a.renderTalents();
 assert.match(bonusPanel(),/insgesamt · Rang 1\/5/);
 let complete=fresh;
 while(a.talentVisibility(complete).owned.size<PfertMeta.nodes.length){
  const {revealed,owned}=a.talentVisibility(complete);
  const next=[...revealed].find(id=>!owned.has(id));
  assert.ok(next);
  complete=PfertMeta.buy(complete,next);
 }
 a.setData(complete);a.renderTalents();
 assert.doesNotMatch(elements.overlay.innerHTML,/class="meta-locked/);
  assert.equal((elements.overlay.innerHTML.match(/ keystone /g)||[]).length,15);
}
{
 const regular={...PfertMeta.fresh(),points:7};
 const press=(code,repeat=false)=>events.keydown({code,repeat,preventDefault:noop});
 a.setData(regular);a.goToStartMenu();
 press('Numpad1');press('Numpad1',true);
 assert.equal(a.get().metaData.points,367);
 assert.equal(PfertMeta.load(localStorage).data.points,367);
 assert.match(elements.overlay.innerHTML,/<b>367<\/b> Talentpunkte/);
 elements['meta-buy'].click();
 elements['meta-back'].click();
 a.showTalents();
 assert.equal(a.get().metaData.points,366);
 assert.deepEqual(PfertMeta.load(localStorage).data.purchased,['S1']);
 a.goToStartMenu();
 a.setData(PfertMeta.load(localStorage).data);
 assert.equal(a.get().metaData.points,366);
 const after=stored.get(PfertMeta.key);
 for(let key=2;key<=9;key++){
  a.goToStartMenu();
  press('Numpad'+key);
  assert.equal(a.get().boss.i,key===9?0:key-2);
  assert.equal(a.get().secretType,key===7?1:key===8?2:0);
  assert.equal(a.get().metaData.points,366);
  if(key===9)assert.equal(a.get().boss.encounter.phase,1);
 }
 a.reset();assert.equal(a.get().metaData.points,366);
 press('Numpad1');
 assert.equal(a.get().metaData.points,366,'Reguläre Runde behält ihren Talentstand');
 assert.equal(a.get().boss,null);
 press('Numpad2');
 const boss=a.get().boss;
 assert.equal(boss.i,0);
 assert.equal(a.get().metaData.points,726);
 press('Numpad2',true);
 assert.equal(a.get().boss,boss,'Gedrückthalten startet den Boss nur einmal');
 press('Numpad8');
 assert.equal(a.get().boss.i,6,'Bosswechsel während der Debug-Runde');
 assert.equal(stored.get(PfertMeta.key),after);
 a.reset();
}
let data=PfertMeta.fresh();data.points=100;
for(const id of ['S1','S2','S3',...Array.from({length:23},(_,i)=>'K1-'+(i+1))]){data=PfertMeta.buy(data,id);assert.ok(data,id)}
a.setData(data);a.reset();a.get().player.rage=100;assert(a.activateRage());
assert.ok(Math.abs(a.get().player.overdrive-12.72)<1e-8,'Käserausch-Dauer');
a.fireCharge();assert.equal(a.get().bullets.length,9,'drei Talent-Projektile zusätzlich zu Standardschuss und fünf Rauschprojektilen');
assert.equal(a.get().bullets.filter(b=>Math.abs(b.damage-a.get().bullets[0].damage*.525)<1e-8).length,3);
console.log('Meta-Spieltest: Käsegewitter-Projektile und Dauer OK');
data=PfertMeta.fresh();data.points=100;
for(const id of ['S1',...Array.from({length:23},(_,i)=>'A1-'+(i+1))]){data=PfertMeta.buy(data,id);assert.ok(data,id)}
a.setData(data);a.reset();a.fireCharge();
assert.ok(a.get().bullets[0].damage>.8625*1.03,'automatischer Schaden erhöht');
assert.ok(a.get().bullets[0].vx>470,'Geschwindigkeit erhöht');
assert.ok(a.get().bullets[0].life>3.5,'Geschosslebensdauer erhöht');
const initial=a.get().bullets.length;for(let i=1;i<15;i++)a.fireCharge();
assert.equal(a.get().bullets.length-initial,15,'zusätzlicher Schuss beim 15. Angriff');
console.log('Meta-Spieltest: Salvenkunst OK');

// Zusammengefasste Ränge und vorhandene Käufe behalten ihre Spielwirkung.
{let d=PfertMeta.fresh();d.points=20;d=PfertMeta.buy(d,'S1');for(let i=0;i<5;i++)d=PfertMeta.buy(d,'A1-1');a.setData(d);a.reset();a.fireCharge();assert.ok(Math.abs(a.get().bullets[0].damage-.8625*1.03*1.075)<1e-9,'fünf Schadensränge wirken');
 const old={version:1,points:0,seconds:0,purchased:['S1','A1-1','A1-2','A1-3','A1-4']};a.setData(PfertMeta.validate(old));a.reset();a.fireCharge();assert.ok(Math.abs(a.get().bullets[0].damage-.8625*1.03*1.06)<1e-9,'alte vier Käufe behalten ihren Schaden');}

data=PfertMeta.fresh();data.points=100;
for(const id of ['S1','S2','S3','S4','S5',...Array.from({length:23},(_,i)=>'W1-'+(i+1))]){data=PfertMeta.buy(data,id);assert.ok(data,id)}
a.setData(data);a.reset();a.get().player.weapon=15;a.get().player.effects[15]=18;a.get().player.effectMax=18;a.fireSpecial();
assert.equal(a.get().player.effects[15],18,'erster Sonderangriff kostenlos');
assert.ok(a.get().bullets[0].damage>.8625*6.5*2,'Sonderangriff gestärkt');
a.fireSpecial();assert.equal(a.get().player.effects[15],16.2);a.get().player.effects[15]=1;a.fireSpecial();assert.equal(a.get().player.effects[15],0);
console.log('Meta-Spieltest: Sonderreserve OK');
data=PfertMeta.fresh();data.points=100;
for(const id of ['S1','S2','S3',...Array.from({length:23},(_,i)=>'K2-'+(i+1))]){data=PfertMeta.buy(data,id);assert.ok(data,id)}
a.setData(data);a.reset();assert.equal(a.get().player.rage,15);a.get().player.rage=100;a.activateRage();
assert.ok(a.get().player.overdrive>12,'Marathonrausch verlängert die Dauer');
a.get().player.overdrive=.01;a.update(.02);assert.equal(a.get().player.metaAfterglow,3);
console.log('Meta-Spieltest: Rauschdauer und Restwärme OK');
data=PfertMeta.fresh();data.points=100;
for(const id of ['S1','S2','S3',...Array.from({length:23},(_,i)=>'K3-'+(i+1))]){data=PfertMeta.buy(data,id);assert.ok(data,id)}
a.setData(data);a.reset();a.get().player.rage=100;a.get().shots.push({x:400,y:200});assert(a.activateRage());assert.equal(a.get().shots.length,0);assert.equal(a.get().player.inv,3);assert.equal(a.get().player.metaRageLock,17);
console.log('Meta-Spieltest: Notfallkäse OK');

for(const [ids,inv,lock] of [[[],.65,false],[['K3-22'],1.5,false],[['K3-23'],3,true]]){
 a.setData({version:1,points:0,seconds:0,purchased:ids});a.reset();a.get().player.rage=100;
 a.get().shots.push({x:400,y:200,w:8,h:8},{x:-20,y:200,w:8,h:8});assert(a.activateRage());assert.equal(a.get().player.inv,inv);assert.equal(a.get().shots.length,1);assert.equal(a.get().shots[0].x,-20);assert.equal(a.get().player.metaRageLock>0,lock);
 a.get().shots.push({x:400,y:200,w:8,h:8,vx:0,vy:0,life:2});a.update(.01);assert.ok(a.get().shots.some(s=>s.x===400),'neue Geschosse bleiben');
}

data=PfertMeta.fresh();data.points=100;
for(const id of ['S1','S2','S3','S4',...Array.from({length:23},(_,i)=>'B1-'+(i+1))]){data=PfertMeta.buy(data,id);assert.ok(data,id)}
a.setData(data);a.reset();assert.equal(a.get().xp,2);a.get().orbs.push({x:135,y:270,w:16,h:16,value:1,speed:0,age:0,kind:'elite'});a.update(.01);assert.ok(a.get().xp>3.5,'Elite-Erfahrung erhöht');
console.log('Meta-Spieltest: Orbjagd OK');
data=PfertMeta.fresh();data.points=100;
for(const id of ['S1','S2','S3','S4',...Array.from({length:23},(_,i)=>'B2-'+(i+1))]){data=PfertMeta.buy(data,id);assert.ok(data,id)}
a.setData(data);a.reset();a.hurt();a.get().pickups.push({x:135,y:270,w:30,h:42,i:0});a.update(.01);assert.equal(a.get().hearts,5);assert.ok(a.get().player.effects[0]>18);
console.log('Meta-Spieltest: Flaschensammler OK');
data=PfertMeta.fresh();data.points=100;
for(const id of ['S1','S2','S3','S4',...Array.from({length:23},(_,i)=>'B3-'+(i+1))]){data=PfertMeta.buy(data,id);assert.ok(data,id)}
a.setData(data);a.reset();a.get().orbs.push({x:135,y:270,w:16,h:16,value:1,speed:0,age:0,kind:'elite'});a.update(.01);assert.ok(a.get().xp>1.5,'Elite-Erfahrung erhöht');
a.reset();a.get().orbs.push({x:135,y:270,w:16,h:16,value:1,speed:0,age:0,kind:'normal'});a.update(.01);assert.equal(a.get().xp,1.6875,'normale Orbs erhalten den Nachteil');
console.log('Meta-Spieltest: Entdecker OK');
data=PfertMeta.fresh();data.points=100;
for(const id of ['S1','S2',...Array.from({length:23},(_,i)=>'V1-'+(i+1))]){data=PfertMeta.buy(data,id);assert.ok(data,id)}
a.setData(data);a.reset();a.keys.add('ArrowRight');a.update(.05);assert.ok(a.get().player.x>150,'Bewegung durch Talent erhöht');
a.keys.clear();a.get().shots.push({x:a.get().player.x+40,y:a.get().player.y,vx:0,vy:0,w:8,h:8,life:1});a.update(.01);assert.ok(a.get().player.metaGrazeSpeed>0);assert.ok(a.get().player.inv>0);
console.log('Meta-Spieltest: Fluchtwege OK');
data=PfertMeta.fresh();data.points=100;
for(const id of ['S1','S2',...Array.from({length:23},(_,i)=>'V3-'+(i+1))]){data=PfertMeta.buy(data,id);assert.ok(data,id)}
a.setData(data);a.reset();for(let i=0;i<4;i++){a.get().player.inv=0;a.hurt()}assert.equal(a.get().hearts,1.5,'Aufrappeln mit halbierter Heilung');
a.get().player.inv=0;a.hurt();a.get().player.inv=0;a.hurt();assert.equal(a.get().hearts,1,'tödlicher Treffer wird einmal verhindert');
console.log('Meta-Spieltest: Letzter Galopp OK');
data=PfertMeta.fresh();data.points=100;
for(const id of ['S1','S2',...Array.from({length:23},(_,i)=>'V2-'+(i+1))]){data=PfertMeta.buy(data,id);assert.ok(data,id)}
a.setData(data);a.reset();a.hurt();assert.equal(a.get().hearts,5,'erster Treffer verhindert');a.get().player.inv=0;a.hurt();assert.equal(a.get().hearts,4,'zweiter Treffer trifft');
a.reset();a.get().shots.push({x:175,y:270,vx:0,vy:0,w:8,h:8,life:1});a.update(.01);assert.ok(a.get().player.metaGuardCooldown>0,'Käsegarde blockt');
console.log('Meta-Spieltest: Schutzgarde OK');
data=PfertMeta.fresh();data.points=100;
for(const id of ['S1','S2','S3','S4','S5',...Array.from({length:23},(_,i)=>'W3-'+(i+1))]){data=PfertMeta.buy(data,id);assert.ok(data,id)}
a.setData(data);a.reset();a.get().pickups.push({x:135,y:270,w:30,h:42,i:1});a.update(.01);assert.equal(a.get().player.metaWeaponSpecial,true);a.fireSpecial();assert.equal(a.get().player.metaWeaponSpecial,false);assert.equal(a.get().player.metaAfterSpecial,3);a.fireCharge();assert.ok(a.get().bullets.some(b=>b.damage>2),'Waffenangriff verstärkt');
console.log('Meta-Spieltest: Waffenkombinationen OK');
data=PfertMeta.fresh();data.points=100;
for(const id of ['S1','S2','S3','S4','S5',...Array.from({length:23},(_,i)=>'W2-'+(i+1))]){data=PfertMeta.buy(data,id);assert.ok(data,id)}
a.setData(data);a.reset();a.get().pickups.push({x:135,y:270,w:30,h:42,i:1});a.update(.01);assert.ok(a.get().player.metaBottleSpeed>0);a.fireSpecial();assert.equal(a.get().player.metaBombs.length,1);assert.equal(a.get().player.metaBombs[0].radius,120);a.update(1.01);assert.equal(a.get().player.metaBombs.length,0);
console.log('Meta-Spieltest: Waffenliebhaber OK');
data=PfertMeta.fresh();data.points=100;
for(const id of ['S1',...Array.from({length:10},(_,i)=>'A1-'+(i+1)),'Q1']){data=PfertMeta.buy(data,id);assert.ok(data,id)}
a.setData(data);a.reset();a.fireCharge();assert.ok(a.get().bullets[0].damage>.8625*1.03*1.12,'Querverbindung erhöht Schaden');
console.log('Meta-Spieltest: Querverbindung OK');
data=PfertMeta.fresh();data.points=100;
for(const id of ['S1',...Array.from({length:23},(_,i)=>'A2-'+(i+1))]){data=PfertMeta.buy(data,id);assert.ok(data,id)}
a.setData(data);a.reset();let target={hp:100,max:100};
assert.ok(Math.abs(a.modifyDirectHit(target,100,{metaCritical:true},true)-157)<1e-8,'Eröffnung, hoher Lebensstand und Boss-Krit');
for(let i=0;i<2;i++)a.modifyDirectHit(target,100,{},false);assert.ok(Math.abs(a.modifyDirectHit(target,100,{},false)-149.5)<1e-8,'vierter Treffer');
const fixedMath=Object.create(Math);fixedMath.random=()=>1;sandbox.Math=fixedMath;const normal=a.damage(1);fixedMath.random=()=>0;const critical=a.damage(1);assert.ok(critical>normal*3,'kritischer Schaden und Nachteil');sandbox.Math=Math;
console.log('Meta-Spieltest: Präzision OK');
data=PfertMeta.fresh();data.points=100;
for(const id of ['S1',...Array.from({length:23},(_,i)=>'A3-'+(i+1))]){data=PfertMeta.buy(data,id);assert.ok(data,id)}
a.setData(data);a.reset();target={hp:100,max:100,x:400,y:270,slow:0,slowTime:0,burnLife:0,burnDps:0};const nearby={hp:100,max:100,x:420,y:270,slow:0,slowTime:0,burnLife:0,burnDps:0,i:0};a.get().enemies.push(target,nearby);
const source={damage:10,style:'normal',vx:1,vy:0,elements:{frost:0,fire:0,lightning:false,earth:false,chainBonus:0,forkBonus:0}};for(let i=0;i<10;i++)a.onHit(source,target,400,270);
assert.ok(target.burnDps>0&&target.burnLife>=2,'Glutspur');assert.ok(target.slow>=.225&&target.slowTime>=2,'Kälteschock');assert.ok(nearby.hp<100,'Funkenflug');
console.log('Meta-Spieltest: Elementarschmiede OK');
data=PfertMeta.fresh();data.points=360;let progress=true;
while(progress){progress=false;for(const id of PfertMeta.nodes){const next=PfertMeta.buy(data,id);if(next){data=next;progress=true}}}
assert.equal(data.purchased.length,360,'gesamter Baum erreichbar');assert.equal(data.points,0);
a.setData(data);a.reset();a.get().player.rage=100;a.activateRage();for(let i=0;i<30;i++){a.fireCharge();a.update(.05)}assert.ok(Number.isFinite(a.get().player.x));assert.ok(a.get().bullets.every(b=>Number.isFinite(b.damage)));
console.log('Meta-Spieltest: vollständiger Baum und Kombinationen OK');

(async()=>{
 const original={...PfertMeta.fresh(),points:4,seconds:123,purchased:['S1','A1-1']};
 a.goToStartMenu();
 a.setData(original);
 a.showTalents();
 a.exportTalents();
 assert.equal(download,'pfert-talente.json');
 stored.clear();
 a.setData(PfertMeta.fresh());
 await a.importTalents(backup);
 assert.deepEqual(PfertMeta.load(localStorage).data,original);
 await a.importTalents(new Blob(['{"version":1,"points":-1}']));
 assert.deepEqual(PfertMeta.load(localStorage).data,original);
 console.log('Meta-Spieltest: Wiederherstellung nach Löschen der Browserdaten und Dateiprüfung OK');
})().catch(error=>{console.error(error);process.exitCode=1});
