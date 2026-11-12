'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const PfertMeta=require('./meta.js');
const noop=()=>{};
const element=()=>({classList:{add:noop,remove:noop},addEventListener:noop,innerHTML:''});
const elements={game:{getContext:()=>({})},overlay:element(),start:element(),talents:element()};
const localStorage={getItem:()=>null,setItem:noop};
const sandbox={PfertMeta,window:{localStorage,addEventListener:noop},document:{getElementById:id=>elements[id]||(elements[id]=element())},navigator:{},requestAnimationFrame:noop,Math,Set,console};
vm.createContext(sandbox);
const src=fs.readFileSync('game.js','utf8').replace('})();','globalThis.check={reset,activateRage,fireCharge,fireSpecial,update,hurt,damage,modifyDirectHit,onHit,keys,get:()=>({player,bullets,enemies,shots,pickups,hearts,orbs,xp}),setData:d=>metaData=d};})();');
vm.runInContext(src,sandbox);
const a=sandbox.check;
let data=PfertMeta.fresh();data.points=100;
for(const id of ['S1','S2','S3',...Array.from({length:23},(_,i)=>'K1-'+(i+1))]){data=PfertMeta.buy(data,id);assert.ok(data,id)}
a.setData(data);a.reset();a.get().player.rage=100;assert(a.activateRage());
assert.ok(Math.abs(a.get().player.overdrive-8.48)<1e-8,'Käserausch-Dauer');
a.fireCharge();assert.equal(a.get().bullets.length,6,'drei Talent-Projektile zusätzlich zu Standardschuss und zwei bestehenden Rauschprojektilen');
assert.equal(a.get().bullets.filter(b=>Math.abs(b.damage-a.get().bullets[0].damage*.525)<1e-8).length,3);
console.log('Meta-Spieltest: Käsegewitter-Projektile und Dauer OK');
data=PfertMeta.fresh();data.points=100;
for(const id of ['S1',...Array.from({length:23},(_,i)=>'A1-'+(i+1))]){data=PfertMeta.buy(data,id);assert.ok(data,id)}
a.setData(data);a.reset();a.fireCharge();
assert.ok(a.get().bullets[0].damage>1.5*1.03,'automatischer Schaden erhöht');
assert.ok(a.get().bullets[0].vx>470,'Geschwindigkeit erhöht');
assert.ok(a.get().bullets[0].life>3.5,'Geschosslebensdauer erhöht');
const initial=a.get().bullets.length;for(let i=1;i<15;i++)a.fireCharge();
assert.equal(a.get().bullets.length-initial,15,'zusätzlicher Schuss beim 15. Angriff');
console.log('Meta-Spieltest: Salvenkunst OK');
data=PfertMeta.fresh();data.points=100;
for(const id of ['S1','S2','S3','S4','S5',...Array.from({length:23},(_,i)=>'W1-'+(i+1))]){data=PfertMeta.buy(data,id);assert.ok(data,id)}
a.setData(data);a.reset();assert.equal(a.get().player.specials,2);a.fireSpecial();
assert.equal(a.get().player.specials,2,'erster Sonderangriff kostenlos');
assert.ok(a.get().bullets[0].damage>1.5*6.5*2,'Sonderangriff gestärkt');
a.fireSpecial();assert.equal(a.get().player.specials,1);a.fireSpecial();assert.equal(a.get().player.specials,0);
console.log('Meta-Spieltest: Sonderreserve OK');
data=PfertMeta.fresh();data.points=100;
for(const id of ['S1','S2','S3',...Array.from({length:23},(_,i)=>'K2-'+(i+1))]){data=PfertMeta.buy(data,id);assert.ok(data,id)}
a.setData(data);a.reset();assert.equal(a.get().player.rage,15);a.get().player.rage=100;a.activateRage();
assert.ok(a.get().player.overdrive>12,'Marathonrausch verlängert die Dauer');
a.get().player.overdrive=.01;a.update(.02);assert.equal(a.get().player.metaAfterglow,3);
console.log('Meta-Spieltest: Rauschdauer und Restwärme OK');
data=PfertMeta.fresh();data.points=100;
for(const id of ['S1','S2','S3',...Array.from({length:23},(_,i)=>'K3-'+(i+1))]){data=PfertMeta.buy(data,id);assert.ok(data,id)}
a.setData(data);a.reset();a.get().player.rage=100;a.get().shots.push({x:400,y:200});assert(a.activateRage());assert.equal(a.get().shots.length,0);assert.equal(a.get().player.inv,3);assert.equal(a.get().player.metaRageLock,13);
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
a.setData(data);a.reset();a.fireSpecial();a.hurt();a.get().pickups.push({x:135,y:270,w:30,h:42,i:0});a.update(.01);assert.equal(a.get().hearts,5);assert.equal(a.get().player.specials,3);assert.ok(a.get().player.effects[0]>18);
console.log('Meta-Spieltest: Flaschensammler OK');
data=PfertMeta.fresh();data.points=100;
for(const id of ['S1','S2','S3','S4',...Array.from({length:23},(_,i)=>'B3-'+(i+1))]){data=PfertMeta.buy(data,id);assert.ok(data,id)}
a.setData(data);a.reset();a.get().orbs.push({x:135,y:270,w:16,h:16,value:1,speed:0,age:0,kind:'elite'});a.update(.01);assert.ok(a.get().xp>1.5,'Elite-Erfahrung erhöht');
a.reset();a.get().orbs.push({x:135,y:270,w:16,h:16,value:1,speed:0,age:0,kind:'normal'});a.update(.01);assert.equal(a.get().xp,1.125,'normale Orbs erhalten den Nachteil');
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
a.setData(data);a.reset();a.fireCharge();assert.ok(a.get().bullets[0].damage>1.5*1.03*1.12,'Querverbindung erhöht Schaden');
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
