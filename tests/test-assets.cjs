'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const noop=()=>{};
const ctx=()=>new Proxy({createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]??noop,set:(o,k,v)=>(o[k]=v,true)});
const makeTile=()=>{
 const context=ctx();
 const tile={width:0,height:0,labels:[],bands:[],getContext:()=>context};
 context.fillText=value=>{if(tile.width===382)tile.labels.push(value)};
 context.fillRect=(x,y,w,h)=>{if(tile.width===1460&&w===1460)tile.bands.push({y,h,color:context.fillStyle})};
 return tile;
};
const events={},elements={};
const makeElement=()=>({classList:{add:noop,remove:noop},innerHTML:'',addEventListener:noop});
elements.game={getContext:ctx};elements.overlay=makeElement();elements.start=makeElement();
let gamepad=null;
const sandbox={navigator:{getGamepads:()=>gamepad?[gamepad]:[]},console,Math,Set,requestAnimationFrame:noop,document:{getElementById:id=>elements[id]||(elements[id]=makeElement()),createElement:makeTile},window:{addEventListener:(name,fn)=>events[name]=fn}};
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


// Image loading never blocks gameplay and preserves the procedural fallback.
(async()=>{
 const loader=fs.readFileSync(__dirname+'/../Pfert/assets.js','utf8')+';globalThis.assets=PfertAssets;';
 const absent={};vm.createContext(absent);vm.runInContext(loader,absent);await absent.assets.ready;assert.equal(absent.assets.failures.length,21);assert.equal(absent.assets.get('city'),null);
 const success={Image:class{set src(path){this.path=path;queueMicrotask(()=>this.onload())}}};vm.createContext(success);vm.runInContext(loader,success);await success.assets.ready;assert.equal(success.assets.failures.length,0);assert.ok(success.assets.get('characters'));assert.equal(success.assets.get('horse').path,'assets/horse-v3.png');assert.equal(success.assets.get('industry').path,'assets/ruhrgebiet-v1.png','erstes Ruhrpott-Bild bleibt erhalten');assert.equal(success.assets.get('industryNight').path,'assets/ruhrgebiet-nachtschicht-v1.png','zweites Ruhrpott-Bild ist eigenständig');assert.notEqual(success.assets.get('industry'),success.assets.get('industryNight'));
 const requested=[];sandbox.PfertAssets={frames:success.assets.frames,effectFrames:success.assets.effectFrames,get(id){requested.push(id);return {width:1672,height:941}}};sandbox.previewContext=ctx();vm.runInContext('PfertArt.background(previewContext,0,1,1)',sandbox);assert.ok(requested.includes('industry'));assert.ok(!requested.includes('industryNight'));requested.length=0;vm.runInContext('PfertArt.background(previewContext,0,1,2)',sandbox);assert.ok(requested.includes('industryNight'));assert.ok(!requested.includes('industry'));delete sandbox.PfertAssets;
 const shops=success.assets.get('ruhrShops');
 assert.equal(shops.path,'assets/ruhrpott-buden-v1.png');
 const shopPng=fs.readFileSync(__dirname+'/../Pfert/'+shops.path);
 const atlasWidth=shopPng.readUInt32BE(16),atlasHeight=shopPng.readUInt32BE(20);
 assert.equal(shopPng[25],6,'Ruhrpott-Buden haben einen Alphakanal');
 sandbox.PfertAssets=success.assets;
 sandbox.previewContext=ctx();
 const shopDraws=[],landmarks=[],plaques=[];
 sandbox.previewContext.drawImage=(image,...args)=>{
  if(image.width===382||image.width===302)landmarks.push([image.width,...args]);
  if(image.width===382)plaques.push(image);
  if(image!==shops)return;
  const [sx,sy,sw,sh]=args;
  assert.ok(sx>=0&&sy>=0&&sw>0&&sh>0&&sx+sw<=atlasWidth&&sy+sh<=atlasHeight);
  assert.equal(sandbox.previewContext.imageSmoothingEnabled,false);
  shopDraws.push(args[4]);
 };
 vm.runInContext('PfertArt.background(previewContext,0,0,1)',sandbox);
 assert.deepEqual(shopDraws.splice(0),[104,370,676]);
 vm.runInContext('PfertArt.background(previewContext,0,2,1)',sandbox);
 assert.deepEqual(shopDraws.splice(0),[58,298,604]);
 assert.deepEqual(landmarks.splice(0),[[382,720,228],[382,674,228],[302,948,401]]);
 sandbox.PfertAssets={get:id=>id==='ruhrShops'?shops:null};
 vm.runInContext('PfertArt.background(previewContext,0,0,1)',sandbox);
 assert.deepEqual(shopDraws.splice(0),[104,370,676],'Buden bleiben beim Panorama-Fallback sichtbar');
 assert.deepEqual(landmarks.splice(0),[[382,720,228]]);
 assert.equal(new Set(plaques).size,2,'Bild und Fallback verwenden jeweils das neue Schild');
 assert.ok(plaques.every(tile=>tile.labels.includes('MASCHINENHALLE')&&tile.labels.includes('Z W E C K E L')));
 sandbox.PfertAssets=success.assets;
 vm.runInContext('PfertArt.background(previewContext,0,0,2)',sandbox);
 assert.deepEqual(shopDraws,[],'Die Buden stehen im Außenlevel');
 assert.deepEqual(landmarks,[]);
 sandbox.PfertAssets={get:id=>id==='industry'?success.assets.get(id):null};
 const labels=[];
 sandbox.previewContext.fillText=label=>labels.push(label);
 vm.runInContext('PfertArt.background(previewContext,0,6,1)',sandbox);
 assert.ok(labels.includes('CURRYWURST'),'Bei fehlendem Budenbild greift die Ersatzkulisse');
 const streets=[];
 sandbox.PfertAssets=absent.assets;
 sandbox.previewContext.drawImage=(tile,x,y)=>{
  if(tile.width===1460)streets.push({tile,x,y});
 };
 const streetTiles=new Set();
 for(const [type,layers] of [[1,[[304,23],[366,36]]],[2,[[322,21],[366,39]]]]){
  vm.runInContext('PfertArt.background(previewContext,0,'+(1450/layers[1][1])+','+type+')',sandbox);
  for(const [y,speed] of layers){
   const [left,right]=streets.filter(layer=>layer.y===y);
   const offset=Math.round(1450/layers[1][1]*speed);
   assert.equal(left.x,-offset,'Gebäudereihe scrollt auch beim Panorama-Fallback');
   assert.equal(right.x,left.x+left.tile.width,'Straßenkacheln schließen bündig an');
   assert.equal(right.tile,left.tile);
   if(y!==366)assert.ok(left.tile.bands.some(({y,h})=>y===136&&h===18),'Das Mittelband reicht bis zum Kachelrand');
   streetTiles.add(left.tile);
  }
  streets.length=0;
 }
 assert.equal(streetTiles.size,4,'Beide Ruhrpott-Level haben eigene Gebäudeebenen');
 if(process.argv.includes('--ruhr')){console.log('OK: Ruhrpott-Kulissen, Parallaxen und Fallbacks.');return}
 delete sandbox.PfertAssets;
 assert.equal(success.assets.frames.length,16);assert.equal(success.assets.effectFrames.length,16);
 const districts=[['bazaar','basar-v1.png',8],['desert','wuestenpass-v1.png',5],['strait','bosporus-ueberfahrt-v1.png',10],['palace','palast-morgenrot-v1.png',7]];
 for(const [id,file] of [['cityMiddle','bosporus-mittelgrund-v1.png'],['cityNear','bosporus-vordergrund-v1.png'],...districts]){
  const image=success.assets.get(id);
  assert.equal(image.path,'assets/'+file);
  const png=fs.readFileSync(__dirname+'/../Pfert/'+image.path);
  if(id.startsWith('city'))assert.equal(png[25],6,'Stadtebene hat einen Alphakanal');
  image.width=png.readUInt32BE(16);
  image.height=png.readUInt32BE(20);
 }
 const layers=[];
 sandbox.previewContext=ctx();
 sandbox.previewContext.globalAlpha=1;
 sandbox.previewContext.drawImage=(tile,x,y)=>layers.push({x,y,width:tile.width,alpha:sandbox.previewContext.globalAlpha});
 sandbox.PfertAssets=success.assets;
 vm.runInContext('PfertArt.background(previewContext,0,250,0)',sandbox);
 assert.deepEqual(layers.filter(layer=>layer.x<0&&[-135,314,427].includes(layer.y)).map(({x,y})=>[x,y]),[[-1750,-135],[-1454,314],[-1320,427]]);
 for(const y of [-135,314,427]){
  const [left,right]=layers.filter(layer=>layer.y===y);
  assert.equal(right.x,left.x+left.width,'Kacheln schließen ohne Lücke an');
  assert.ok(right.x+right.width>=960,'Parallax-Ebene füllt das Spielfeld');
 }
 assert.ok(layers.every(layer=>layer.alpha===1));
 layers.length=0;
 for(const [index,[id,,speed]] of districts.entries()){
  const image=success.assets.get(id),span=Math.round(image.width*595/image.height)*2;
  layers.length=0;
  vm.runInContext(`PfertArt.background(previewContext,${index+1},250,0)`,sandbox);
  assert.ok(layers.some(layer=>layer.y===-55&&layer.x===-(250*speed%span)&&layer.width===span),id+' verwendet sein eigenes Panorama');
  assert.ok(layers.some(layer=>layer.y===458&&layer.width===1152),id+' hat eine eigene Vordergrundebene');
 }
 layers.length=0;
 sandbox.PfertAssets={get:id=>id==='cityNear'||id==='bazaar'?null:success.assets.get(id)};
 vm.runInContext('PfertArt.background(previewContext,1,250,0)',sandbox);
 assert.deepEqual(layers.filter(layer=>layer.x<0&&[-135,314,0].includes(layer.y)).map(({x,y})=>[x,y]),[[-1750,-135],[-1454,314],[-150,0]]);
 layers.length=0;
 sandbox.PfertAssets=absent.assets;
 vm.runInContext('PfertArt.background(previewContext,1,250,0)',sandbox);
 assert.deepEqual(layers.filter(layer=>layer.x<0&&layer.y===0).map(layer=>layer.x),[-100,-950,-150]);
 assert.ok(layers.every(layer=>layer.alpha===1));
 delete sandbox.PfertAssets;
 const broken={Image:class{set src(path){queueMicrotask(()=>this.onerror())}}};vm.createContext(broken);vm.runInContext(loader,broken);await broken.assets.ready;assert.equal(broken.assets.failures.length,21);
 const atlas=fs.readFileSync(__dirname+'/../Pfert/assets/characters-v2.png');const width=atlas.readUInt32BE(16),height=atlas.readUInt32BE(20);for(const r of success.assets.frames)assert.ok(r.x>=0&&r.y>=0&&r.w>0&&r.h>0&&r.x+r.w<=width&&r.y+r.h<=height,'Zuschnitt liegt im Atlas');
 const effects=fs.readFileSync(__dirname+'/../Pfert/assets/effects-v1.png'),ew=effects.readUInt32BE(16),eh=effects.readUInt32BE(20);for(const r of success.assets.effectFrames)assert.ok(r.x>=0&&r.y>=0&&r.w>0&&r.h>0&&r.x+r.w<=ew&&r.y+r.h<=eh,'VFX-Zuschnitt liegt im Atlas');
 for(const [id,frames,count] of [
  ['rareEnemies',success.assets.rareFrames,10],['blockers',success.assets.blockerFrames,4],
  ['workshop',success.assets.workshopFrames,8],['workshopBosses',success.assets.workshopBossFrames,2],
  ['caravanBosses',success.assets.caravanBossFrames,3],
  ['foreground',success.assets.foregroundFrames,4],['ruhrLandmarks',success.assets.landmarkFrames,2]
 ]){
  const image=success.assets.get(id),png=fs.readFileSync(__dirname+'/../Pfert/'+image.path);
  const width=png.readUInt32BE(16),height=png.readUInt32BE(20);
  assert.equal(png[25],6,id+' hat einen Alphakanal');
  assert.equal(Object.keys(frames).length,count);
  for(const rect of Object.values(frames)){
   assert.ok(rect.x>=0&&rect.y>=0&&rect.w>0&&rect.h>0&&rect.x+rect.w<=width&&rect.y+rect.h<=height);
  }
 }
 const projectiles=fs.readFileSync(__dirname+'/../Pfert/assets/player-projectiles-v2.png');
 assert.equal(projectiles[25],6,'Geschossatlas hat einen Alphakanal');
 const sheet=success.assets.get('projectiles');
 assert.equal(sheet.path,'assets/player-projectiles-v2.png');
 sheet.width=projectiles.readUInt32BE(16);sheet.height=projectiles.readUInt32BE(20);
 sandbox.PfertAssets=success.assets;
 const drawn=[];
 sandbox.previewContext=ctx();
 sandbox.previewContext.drawImage=(image,...crop)=>{if(image===sheet)drawn.push(crop.slice(0,4))};
 vm.runInContext(`
  for(const style of ['normal','red','white','rose','speed','prism','saw','chain','orbit','mortar','wave','frost','vortex','phoenix','echo','satellite']){
   PfertArt.bullet(previewContext,{x:200,y:240,vx:1,vy:0,w:14,h:14,style});
  }
 `,sandbox);
 assert.equal(drawn.length,16);
 assert.equal(new Set(drawn.map(crop=>crop.join(','))).size,16);
 assert.ok(drawn.every(([x,y,w,h])=>x>=0&&y>=0&&x+w<=sheet.width&&y+h<=sheet.height));
 delete sandbox.PfertAssets;
 const horse=fs.readFileSync(__dirname+'/../Pfert/assets/horse-v3.png');assert.equal(horse.readUInt32BE(16),672);assert.equal(horse.readUInt32BE(20),264);assert.equal(horse[25],6,'Pferd hat einen Alphakanal');
 assert.equal(atlas[25],6,'Figuren haben einen Alphakanal');assert.equal(effects[25],6,'VFX haben einen Alphakanal');
 assert.equal(elements.overlay.classList!==undefined,true);console.log('OK: Asset-Laden, Ladefehler, Fallback, Figuren-/VFX-Zuschnitte und Alpha.');
})().catch(error=>{console.error(error);process.exitCode=1});

