'use strict';

const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const directory=__dirname;
const gameTests=fs.readFileSync(path.join(directory,'test-game.cjs'),'utf8');
const harnessEnd=gameTests.indexOf('for(let i=0;i<17;i++)');
assert.ok(harnessEnd>0,'Spieltest-Hülle ist vorhanden');
const harness=gameTests.slice(0,harnessEnd).replace(
 'shouldSpawnPickup,damagePart,art:PfertArt,',
 'activeWeapon,nextBossAttack,encounterThreat,startRuhrBoss,setBossCount:value=>bossCount=value,setThreat:value=>threat=value,setSecret:type=>{secret=true;secretType=type},shouldSpawnPickup,damagePart,art:PfertArt,'
);
const {game,seed,press}=new Function('require','__dirname',harness+`
 return {
  game:a,
  seed(start){
   const seeded=Object.create(Math);
   seeded.random=()=>{start=(Math.imul(start,1664525)+1013904223)>>>0;return start/4294967296};
   sandbox.Math=seeded;
  },
  press(code){events.keydown({code,repeat:false,preventDefault:noop})}
 };
`)(require,directory);

const step=.025;
const round=number=>Number(number.toFixed(1));
const priority=['damage','multiShot','seekShot','frost','fanShot','magnet'];

function chooseCard(){
 const state=game.get();
 const priorities=state.hearts<=3?['healing',...priority]:priority;
 for(const id of priorities){
  const index=state.choices.findIndex(card=>card.id===id);
  if(index!==-1){game.chooseCard(index);return}
 }
 game.chooseCard(0);
}

function steer(player,targetY){
 game.keys.delete('ArrowUp');game.keys.delete('ArrowDown');
 if(player.y>targetY+4)game.keys.add('ArrowUp');
 if(player.y<targetY-4)game.keys.add('ArrowDown');
}

function flightLane(state,preferred,collect){
 const player=state.player;
 const shots=state.shots.filter(shot=>shot.life>0&&Math.abs(shot.x-player.x)<230);
 let best={y:player.y,value:-Infinity};
 for(let y=96;y<=500;y+=8){
  let value=-Math.abs(y-preferred)*.11-Math.abs(y-player.y)*.023;
  for(const shot of shots){
   if(shot.kind==='pulse'&&Math.abs(shot.x-player.x)<shot.w/2+20&&Math.abs(y-shot.y)<shot.h/2+20)value-=85;
   const arrival=(player.x-shot.x)/(shot.vx||1);
   if(arrival<-.10||arrival>.55)continue;
   const gap=Math.abs(y-shot.y-shot.vy*arrival);
   value-=Math.max(0,35-gap)*1.5;
  }
  for(const unit of state.enemies){
   if(Math.abs(unit.x-player.x)<unit.w/2+85&&Math.abs(y-unit.y)<unit.h/2+30)value-=85;
  }
  if(state.boss?.strike&&Math.abs(y-state.boss.y)<94)value-=120;
  if(collect){
   for(const orb of state.orbs)if(orb.x>=player.x-20&&orb.x<player.x+160){
    value+=Math.max(0,1-Math.abs(orb.y-y)/58)*Math.min(13,orb.value*4);
   }
   for(const pickup of state.pickups)if(pickup.x>player.x-15&&pickup.x<player.x+145){
    value+=Math.max(0,1-Math.abs(pickup.y-y)/65)*(pickup.i===5&&state.hearts<5?31:16);
   }
  }
  if(value>best.value)best={y,value};
 }
 return best.y;
}

function opening(strategy){
 seed(291);
 game.reset();
 const orbs=new Set(),rage={firstReady:null,full:0,low:0,mid:0,bossStart:0};
 let firstCard=null,firstWine=null,spentXp=0,generatedOrbs=0,hitCount=0,wineTime=0,targetY=270,bossStart=null;
 for(let i=0;i<14400;i++){
  const state=game.get(),player=state.player;
  if(state.state==='over')break;
  if(state.state==='upgrade'){
   if(firstCard===null)firstCard=state.t;
   spentXp+=state.xpNeeded;chooseCard();continue;
  }
  if(state.state==='transition'){game.update(step);continue}
  if(state.boss&&bossStart===null)bossStart=state.runTime;
  if(game.activeWeapon()>=0){
   wineTime+=step;
   if(firstWine===null)firstWine=state.t;
  }
  if(player.rage>=100&&rage.firstReady===null)rage.firstReady=state.runTime;
  const atBossStart=state.boss&&state.runTime-bossStart<10;
  if(player.rage>=100&&(strategy==='sofort'||state.hearts<=3||atBossStart)){
   if(game.activateRage()){
    rage[state.hearts===5?'full':state.hearts<=3?'low':'mid']++;
    if(atBossStart)rage.bossStart++;
   }
  }
  if(i%6===0){
   const target=state.enemies.find(unit=>unit.x>player.x&&unit.x<960)||state.boss;
   targetY=flightLane(state,target?.y??255,true);
  }
  steer(player,targetY);
  game.update(step);
  const next=game.get();
  if(next.hearts<state.hearts)hitCount++;
  for(const orb of [...state.orbs,...next.orbs])if(!orbs.has(orb)){orbs.add(orb);generatedOrbs++}
 }
 const state=game.get();
 return {strategy,firstCard:firstCard===null?null:round(firstCard),firstWine:firstWine===null?null:round(firstWine),
  seconds:round(state.runTime),level:state.level,xp:round(state.xp+spentXp),generatedOrbs,
  collectedOrbs:[...orbs].filter(orb=>orb.collected).length,hits:hitCount,wineSeconds:round(wineTime),
  rage:{...rage,firstReady:rage.firstReady===null?null:round(rage.firstReady)}};
}

function bossTrial(id,build){
 seed(731+id);
 game.reset();
 const time=[300,600,900,0,0,0,840][id],player=game.get().player;
 game.setTime(time);game.setRunTime(time);game.setSpawn(Infinity);game.setDrop(Infinity);game.setNextBoss(Infinity);
 if(build==='typisch')Object.assign(game.get().upgrades,{damage:3,multiShot:1,seekShot:1,frost:1});
 if(build==='stark')Object.assign(game.get().upgrades,{damage:5,multiShot:4,tempo:5,seekShot:1,frost:2,fanShot:2,ember:2});
 if(build!=='frisch'){player.weapon=1;player.effects[1]=18}
 game.setThreat(2);
 if(id===6){game.setSecret(2);game.setSecretTime(60);game.startRuhrBoss()}
 else{game.setBossCount(id);game.startBoss(id===0)}
 player.x=395;
 const boss=game.get().boss,initialHp=boss.hp;
 const announced=new Set(),released=new Set();
 let elapsed=0,reachable=0,hits=0,verticalSpeed=0,wineTime=0,targetY=270;
 for(let i=0;i<7200;i++){
  const state=game.get();
  if(!state.boss||state.state==='transition'||state.state==='over')break;
  if(state.state==='upgrade'){chooseCard();continue}
  const live=boss.parts.filter(part=>part.hp>0);
  const choice=live.reduce((best,part)=>!best||part.hp<best.hp?part:best,null);
  if(live.some(part=>boss.x+part.aim[0]>player.x+28&&
   Math.abs(boss.y+part.aim[1]-player.y)<part.h/2+9))reachable+=step;
  const projectedY=boss.y+choice.aim[1]+verticalSpeed*.48;
  if(i%4===0)targetY=flightLane(state,projectedY,false);
  steer(player,targetY);
  if(game.activeWeapon()>=0){
   wineTime+=step;
   if(i%48===0&&i>60&&i<300&&Math.abs(player.y-(boss.y+choice.aim[1]))<35)press('Space');
  }
  const previousY=boss.y,previousHearts=state.hearts;
  const volley=boss.volleyIndex||0,attack=game.nextBossAttack(boss);
  game.update(step);elapsed+=step;
  if((boss.volleyIndex||0)>volley)announced.add(Array.isArray(attack)?attack[0]:attack);
  for(const shot of game.get().shots)if(shot.bossSpecial)released.add(shot.bossSpecial);
  verticalSpeed=.85*verticalSpeed+.15*(boss.y-previousY)/step;
  if(game.get().hearts<previousHearts)hits++;
 }
 const result=game.get();
 return {id,build,seconds:round(elapsed),reachable:round(reachable),initialHp,
  remainingHp:round(result.boss?.hp||0),hits,wineSeconds:round(wineTime),announced:[...announced].join(', '),released:[...released].join(', '),
  result:result.state==='over'?'Tod':boss.hp<=0?'Sieg':'Zeitlimit'};
}

function pressureTrial(name,cards){
 seed(92);
 game.reset();
 game.setTime(180);game.setSpawn(Infinity);game.setDrop(Infinity);game.setNextBoss(Infinity);
 Object.assign(game.get().upgrades,cards);
 game.setThreat(game.encounterThreat(180,game.get().upgrades,false));
 const targets=[480,573,678].map(x=>Object.assign(game.enemy(0,268),{
  x,w:75,h:90,hp:20000,max:20000,speed:0,fire:Infinity
 }));
 for(let i=0;i<400;i++)game.update(step);
 return {name,startThreat:round(game.encounterThreat(180,game.get().upgrades,false)),
  damagePerSecond:round(targets.reduce((sum,target)=>sum+target.max-target.hp,0)/10)};
}

assert.equal(game.encounterThreat(180,{healing:2,agility:2,magnet:2,guard:2},false),game.encounterThreat(180,{},false));
assert.ok(game.encounterThreat(180,{damage:4},false)>game.encounterThreat(180,{},false));
assert.ok(game.encounterThreat(180,{fork:1},false)>game.encounterThreat(180,{damage:1},false));
const openings=[opening('sofort'),opening('aufsparen')];
const bosses=[1,2].flatMap(id=>['frisch','typisch','stark'].map(build=>bossTrial(id,build)));
const pressure=[
 ['Basis',{}],['Heilung',{healing:8}],['Komfort',{agility:3,guard:2,magnet:3}],
 ['Direktfeuer',{damage:4,fanShot:2,multiShot:2}],
 ['Synergie',{chain:2,cascade:2,frost:1,ember:1,shatter:2}]
].map(([name,cards])=>pressureTrial(name,cards));
assert.ok(openings.every(run=>run.firstCard!==null&&run.firstCard<90&&run.collectedOrbs>0));
assert.ok(bosses.every(run=>run.seconds>0&&run.reachable>0&&run.reachable<=run.seconds));
console.log('Erste Karte, XP, Orbs, Wein und Käserausch');
console.log(JSON.stringify(openings,null,2));
console.log('Bosszeiten und gemessene Zeit auf Segmenthöhe');
console.table(bosses);
if(process.argv.includes('--boss-json'))console.log(JSON.stringify(bosses));
console.log('Karten und Bedrohungsdruck am selben Abschnitt');
console.table(pressure);
