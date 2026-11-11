(() => {
'use strict';
const canvas = document.getElementById('game');
const c = canvas.getContext('2d');
const overlay = document.getElementById('overlay');
const W = 960, H = 540, MAX_HEARTS = 5;
const keys = new Set();
const rand = (a,b) => a + Math.random() * (b-a);
const clamp = (v,a,b) => Math.max(a,Math.min(b,v));
const types = ['Fliegender Simit','Teppichräuber','Fliegende Sucuk','Messingkanne','Basar-Fledermaus','Gewürzwirbel','Säbelteppich','Janitscharen-Kessel','Doppel-Sucuk','Panzerkarawane'];
const bosses = ['Großwesir der Teppiche','Sultan der Kaffeekessel','Pascha der Sucuk','Dschinn der Gewürzmühle','Großmeister der Basarkarawane','Krasser Schalke-04-Fan','Hochofen-Horst · Nachtschicht'];
const levels = ['DIE GOLDENE STADT','DER GROSSE BASAR','DIE STERNE DER WÜSTE','DER TÜRKISE BOSPORUS','DER PALAST IM MORGENROT'];
const powerNames = ['Rotwein','Weißwein','Rosé','Portwein','Schaumwein','Traubenmost','Riesling','Merlot','Malbec','Muskat','Sherry','Madeira','Eiswein','Cabernet','Tokaj','Burgunder'];
const weaponNames = ['GLUTSALVE','PERLMUTT-FÄCHER','ROSEN-SUCHER','PORT-LASER','KORKENBLITZ','TRAUBENMOST','PRISMA-SPLITTER','SUCHE DER SÄGE','DONNERKETTE','MONDORBIT','SHERRY-MÖRSER','ECHO-WELLE','FROSTFÄCHER','KÄSE-VORTEX','GEWITTERKANONE','PHOENIX-FLUG'];
const weaponElements=['fire','frost','fire','lightning','lightning',null,'earth','earth','lightning','earth','earth','frost','frost','earth','lightning','fire'];
const styles=['red','white','rose','port','speed',null,'prism','saw','chain','orbit','mortar','wave','frost','vortex','storm','phoenix'];
const colors=['#ffb06e','#9effe8','#ffa7d8','#c499ff','#75d9ff','#d3a9ed','#c7eeff','#e5f6b4','#83e5ff','#c2c0ff','#ffd386','#a5f8d5','#a6eaff','#b6a0ff','#e4f7ff','#ffc48e'];
const cardDefs = [
 {id:'damage',icon:'✦',title:'Käsereifung',desc:'12 % MEHR Schaden je Rang, multipliziert mit anderen Effekten.',max:10},
 {id:'charge',icon:'ϟ',title:'Schnellgärung',desc:'Ladeschuss 9 % schneller bereit je Rang.',max:8},
 {id:'spread',icon:'⋔',title:'Flankenkäse',desc:'Zwei Flankenschüsse. Je Rang +15 % ihrer Stärke.',max:6},
 {id:'critical',icon:'◆',title:'Goldene Rinde',desc:'+3 % Chance auf doppelten Schaden.',max:8},
 {id:'size',icon:'◉',title:'Große Portion',desc:'+6 % Geschossgröße und Laserbreite.',max:8},
 {id:'duration',icon:'∞',title:'Langer Abgang',desc:'+8 % Dauer für Wein und Laser.',max:8},
 {id:'velocity',icon:'➤',title:'Rückenwind',desc:'+6 % Geschossgeschwindigkeit.',max:8},
 {id:'pierce',icon:'➶',title:'Harte Kruste',desc:'Ein zusätzliches Ziel durchdringen.',max:3},
 {id:'blast',icon:'✺',title:'Käsefondue',desc:'Geladene Treffer spritzen Käse: +12 % Flächenschaden je Rang.',max:6},
 {id:'agility',icon:'➟',title:'Flotte Hufe',desc:'+3 % Pfert-Geschwindigkeit.',max:6},
 {id:'magnet',icon:'⊕',title:'Korkenzieher',desc:'+12 Pixel Ansaugreichweite für Flaschen.',max:5},
 {id:'ricochet',icon:'↗',title:'Billardkäse',desc:'Ein zusätzlicher Abpraller an Ober- und Unterkante.',max:3},
 {id:'chain',icon:'ϟ',title:'Statische Rinde',desc:'Treffer springen mit 20 % Schaden auf ein weiteres Ziel über.',max:3},
 {id:'frost',icon:'❄',title:'Kühlkette',desc:'Treffer bremsen Gegner kurz um zusätzliche 4 %.',max:5},
 {id:'ember',icon:'✹',title:'Räucherkammer',desc:'Treffer glimmen nach: +8 % Schaden pro Sekunde.',max:5},
 {id:'echo',icon:'»',title:'Doppelter Boden',desc:'Jeder sechste Angriff sendet zwei schwache Echo-Schüsse.',max:4},
 {id:'rear',icon:'↤',title:'Rückendeckung',desc:'Ein Rückwärtsschuss mit 20 % Stärke je Rang.',max:4},
 {id:'guard',icon:'◈',title:'Wachsamer Mond',desc:'Schutzimpuls lädt 8 % schneller nach.',max:5},
 {id:'execute',icon:'✧',title:'Letzter Bissen',desc:'+6 % Schaden gegen Ziele unter 35 % Leben.',max:6},
 {id:'fork',icon:'⋏',title:'Splittergelage',desc:'Treffer verzweigen in zwei weitere Geschosse. Splitter erben deine Treffer-Effekte.',max:2,rare:true,requires:u=>u.spread>0||u.pierce>0},
 {id:'cascade',icon:'ϟ',title:'Kettenreaktion',desc:'45 % MEHR Kettenschaden je Rang. Ketten übertragen Frost und Glut.',max:3,rare:true,requires:u=>u.chain>0},
 {id:'shatter',icon:'❄',title:'Thermischer Schock',desc:'Frost + Glut zünden eine Flächenexplosion mit 40 % Trefferschaden je Rang.',max:2,rare:true,requires:u=>u.frost>0&&u.ember>0},
 {id:'echoForge',icon:'»',title:'Echokammer',desc:'Jeder vierte Angriff wiederholt deine echte Waffe mit 45 % Stärke.',max:1,rare:true,requires:u=>u.echo>0},
 {id:'orbital',icon:'◎',title:'Mondschmelze',desc:'Jeder Ladeangriff erschafft zusätzlich zwei kreisende Käsemonde.',max:2,rare:true,requires:u=>u.guard>0},
 {id:'mastery',icon:'✦',title:'Feinschliff',desc:'+1 % zusätzlicher Waffenschaden.',max:Infinity,repeatable:true},
 {id:'tempo',icon:'ϟ',title:'Fingerfertigkeit',desc:'Ladeschuss noch 1 % schneller bereit.',max:Infinity,repeatable:true},
 {id:'cellar',icon:'∞',title:'Gläserpflege',desc:'+1 % zusätzliche Wein- und Laserdauer.',max:Infinity,repeatable:true}
];
let state='menu', t=0, runTime=0, nextUpgrade=60, choices=[], score=0, hearts=MAX_HEARTS, player;
let enemies=[], bullets=[], shots=[], pickups=[], particles=[], deaths=[], rings=[], beams=[];
let boss=null, spawn=1, drop=8, nextBoss=300, bossCount=0, last=0, flash=0, shake=0;
let notice=0, noticeText='', levelIndex=0, secret=false, secretTime=0, golden=null, goldenAppeared=false, secondAppeared=false, secretType=0, combo=0, comboTime=0, threat=0, arcs=[], flashes=[];
let upgrades={};
const roasts=[
 'Fünf Herzen. Und du hast wirklich alle persönlich gegen eine Wand gefahren.',
 'Dein Pfert hat zwei Augen. Offenbar hat keins davon Dienst.',
 'Das war kein Ausweichmanöver. Das war eine sehr engagierte Trefferbestätigung.',
 'Die Gegner wollten kämpfen. Du hast ihnen eine kostenlose Käseverkostung angeboten.',
 'Du fliegender Käseunfall. Selbst die Sucuk schämt sich gerade für dich.',
 'Dein Build hatte Potenzial. Leider saßest du am Steuer.',
 'Ein Teppich hat mehr Fluggefühl. Und der hat nicht einmal Hufe.',
 'Du sammelst Wein, als wäre Können eine Frage des Jahrgangs.',
 'So viele Schüsse. So wenig Überlebenswille beim Ausweichen.',
 'Das Pfert sieht dumm aus. Du musst die Rolle nicht auch noch mitspielen.',
 'Das war taktisch ungefähr auf dem Niveau eines nassen Simits.',
 'Keine Sorge, die Käsebällchen waren gut. Das Problem hing hinten dran.',
 'Der Basar sucht noch einen Türstopper. Mit deinen Reflexen wärst du perfekt.'
];
const comebacks=['Nochmal. Der Basar soll gefälligst vor dir zittern.','Neue Runde. Diesmal bitte neben die Geschosse fliegen.','Eine Runde noch. Irgendwann muss selbst dieses Pfert etwas lernen.','Du kannst das besser. Die Messlatte liegt ja bereits im Keller.'];
function addRage(amount){if(!player||player.overdrive>0)return;const before=player.rage;player.rage=clamp(player.rage+amount,0,100);if(before<100&&player.rage>=100){sound('ready');notice=2;noticeText='KÄSERAUSCH BEREIT · Q'}}
function activateRage(){if(state!=='playing'||player.rage<100||player.overdrive>0)return false;player.rage=0;player.overdrive=8;player.inv=Math.max(player.inv,.65);shots=[];ring(player.x,player.y,'#b6f8ff',180);flashes.push({x:player.x,y:player.y,r:100,life:.15,maxLife:.15});shake=4;notice=2;noticeText='KÄSERAUSCH!';sound('overdrive');return true}

function clock(s){return String(Math.floor(s/60)).padStart(2,'0')+':'+String(Math.floor(s%60)).padStart(2,'0')}
function sound(kind,strong=false){if(typeof PfertSound!=='undefined')PfertSound.play(kind,strong)}
function reset(){
 if(typeof PfertSound!=='undefined')PfertSound.wake();
 t=0;runTime=0;nextUpgrade=60;choices=[];score=0;hearts=MAX_HEARTS;
 upgrades=Object.fromEntries(cardDefs.map(card=>[card.id,0]));
 player={x:135,y:H/2,w:40,h:29,inv:0,effects:Array(16).fill(0),weapon:-1,charge:0,charging:false,autoCooldown:0,podSide:1,podCooldown:0,muzzle:0,guardFlash:0,attacks:0,rage:0,overdrive:0,chargeCue:false,readyCue:false};
 enemies=[];bullets=[];shots=[];pickups=[];particles=[];deaths=[];rings=[];beams=[];
 boss=null;spawn=1;drop=8;nextBoss=300;bossCount=0;flash=0;shake=0;levelIndex=0;
 secret=false;secretTime=0;secretType=0;golden=null;goldenAppeared=false;secondAppeared=false;combo=0;comboTime=0;threat=0;arcs=[];flashes=[];notice=3;noticeText=levels[0];
 keys.clear();state='playing';overlay.classList.add('hidden');overlay.classList.remove('upgrade-overlay');overlay.classList.remove('game-over');
}
function cancelCharge(){keys.clear();if(player){player.charging=false;player.charge=0}}
document.getElementById('start').addEventListener('click',reset);
window.addEventListener('keydown',e=>{
 if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','KeyW','KeyA','KeyS','KeyD'].includes(e.code))e.preventDefault();
 if(state==='upgrade'){if(!e.repeat&&/^Digit[123]$/.test(e.code))chooseCard(Number(e.code.slice(-1))-1);return}
 keys.add(e.code);if(e.code==='KeyM'&&!e.repeat&&typeof PfertSound!=='undefined'){const muted=PfertSound.toggle();notice=1;noticeText=muted?'TON AUS':'TON AN'}
 if(e.code==='Space'&&!e.repeat&&state==='playing'&&!player.charging){player.charging=true;player.charge=0;player.chargeCue=false;player.readyCue=false}
 if(e.code==='KeyQ'&&!e.repeat)activateRage();
 
 if(e.code==='Enter'&&(state==='menu'||state==='over'))reset();
});
window.addEventListener('keyup',e=>{
 keys.delete(e.code);
 if(e.code==='Space'&&state==='playing'&&player.charging){if(player.charge>=chargeLimit()*(.4/1.5))fireCharge();player.charging=false;player.charge=0}
});
window.addEventListener('blur',cancelCharge);
function offerCards(){
 const pool=cardDefs.filter(card=>!card.repeatable&&!card.rare&&upgrades[card.id]<card.max);
 const rarePool=cardDefs.filter(card=>card.rare&&runTime>=120&&upgrades[card.id]<card.max&&card.requires(upgrades));
 if(pool.length<3)pool.push(...cardDefs.filter(card=>card.repeatable));
 if(pool.length===0){nextUpgrade+=60;return}
 choices=[];if(rarePool.length)choices.push(rarePool.splice(Math.floor(rand(0,rarePool.length)),1)[0]);while(choices.length<3&&pool.length){choices.push(pool.splice(Math.floor(rand(0,pool.length)),1)[0])}
 state='upgrade';cancelCharge();overlay.classList.remove('hidden');overlay.classList.add('upgrade-overlay');
 overlay.innerHTML='<div class="eyebrow">MINUTE '+Math.floor(runTime/60)+' · DEIN PFERT WIRD STÄRKER</div><h2>Ein bisschen mehr Wumms.</h2><p class="upgrade-copy">Wähle eine Verbesserung. Sie bleibt bis zum Ende der Runde.</p><div class="cards">'+choices.map((card,i)=>'<button class="upgrade-card'+(card.rare?' rare':'')+'" id="card-'+i+'"><span class="card-number">'+(i+1)+'</span><span class="card-icon">'+card.icon+'</span><strong>'+card.title+'</strong><span class="card-description">'+card.desc+'</span><span class="card-rank">'+(card.rare?'SYNERGIE · ':'')+'RANG '+(upgrades[card.id]+1)+' / '+(Number.isFinite(card.max)?card.max:'∞')+'</span></button>').join('')+'</div><p class="hint">Klicken oder 1 / 2 / 3 drücken · Das Spiel pausiert.</p>';
 choices.forEach((_,i)=>document.getElementById('card-'+i).addEventListener('click',()=>chooseCard(i)));
}
function chooseCard(i){
 if(state!=='upgrade'||!choices[i])return;
 const card=choices[i];upgrades[card.id]++;sound(card.rare?'synergy':'card');nextUpgrade+=60;choices=[];state='playing';cancelCharge();
 overlay.classList.add('hidden');overlay.classList.remove('upgrade-overlay');notice=2.4;noticeText=card.title.toUpperCase()+' · RANG '+upgrades[card.id];
}
function activeWeapon(){
 if(player.weapon>=0)return player.effects[player.weapon]>0?player.weapon:-1;
 return player.effects.findIndex(v=>v>0);
}
function hit(a,b){return Math.abs(a.x-b.x)<(a.w+b.w)/2&&Math.abs(a.y-b.y)<(a.h+b.h)/2}
function chargeLimit(){return Math.max(.25,1.5*Math.pow(.91,upgrades.charge)*Math.pow(.99,upgrades.tempo))}
function damage(base){return base*Math.pow(1.12,upgrades.damage)*(1+upgrades.mastery*.01)*(player.overdrive>0?1.35:1)*(Math.random()<upgrades.critical*.03?2:1)}
function particle(x,y,col,n=7,speed=1){
 for(let i=0;i<n&&particles.length<260;i++){let life=rand(.2,.6);particles.push({x,y,vx:rand(-150,150)*speed,vy:rand(-150,150)*speed,life,maxLife:life,col,size:rand(1.5,4)})}
}
function ring(x,y,col,size=35){if(rings.length<22)rings.push({x,y,col,size,life:.4,maxLife:.4})}
function impact(x,y,col,n=7){particle(x,y,col,n);ring(x,y,col,20);shake=Math.max(shake,.7)}
function death(e){
 sound('explode',{type:e.i,elite:e.elite,x:e.x});addRage((e.elite?9:3)+(e.lastCharged?2:0));
 combo++;comboTime=4;score+=Math.round((100+e.i*35)*(e.elite?1.5:1)*(1+Math.min(2,combo*.04))*(e.lastCharged?1.2:1));deaths.push({...e,age:0,life:.72,secret,rotation:rand(-.6,.6)});
 if(deaths.length>28)deaths.shift();
 particle(e.x,e.y,colors[e.i%5],28,1.5);ring(e.x,e.y,'#ffcf7c',64);flashes.push({x:e.x,y:e.y,r:e.elite?60:40,life:.14,maxLife:.14});shake=Math.max(shake,2.2);
}
function attackElements(charged=false){const base=weaponElements[activeWeapon()];return {frost:Math.min(.65,(base==='frost'?(charged?.4:.25):0)+upgrades.frost*.04),fire:(base==='fire'?.28:0)+upgrades.ember*.08,lightning:base==='lightning',earth:base==='earth',chainBonus:upgrades.chain,forkBonus:upgrades.fork*2}}
function addBullet(angle,style,charged,power,scale=1,offset=0){
 if(bullets.length>=360)return null;
 const size=(charged?22+power*18:style==='normal'?14:11)*(1+upgrades.size*.06)*Math.sqrt(scale);
 const velocity=(charged?650+power*170:470)+(style==='speed'?260:0);
 const b={x:player.x+28-offset,y:player.y-2,vx:velocity*Math.cos(angle)*(1+upgrades.velocity*.06),vy:velocity*Math.sin(angle)*(1+upgrades.velocity*.06),w:size,h:size,damage:damage((charged?2+power*4.5:1)*scale),charged,style,pierce:['port','speed','wave','saw','vortex','phoenix'].includes(style),remaining:upgrades.pierce,bounces:upgrades.ricochet,hit:new Set(),age:0,life:3.5,blast:charged&&(style==='red'||upgrades.blast>0),homing:style==='rose',elements:attackElements(charged)};
 bullets.push(b);return b;
}
function shotInterval(){
 const intervals=[.24,.30,.28,.42,.20,.24,.32,.40,.32,.45,.48,.42,.28,.70,.60,.40],weapon=activeWeapon();
 return weapon===3?Math.max(.42,.34*(1+upgrades.duration*.08+upgrades.cellar*.01)+.04):(intervals[weapon]||.24);
}
function updateAutoFire(dt){
 player.autoCooldown-=dt;
 if(player.charging||beams.some(beam=>beam.charged&&beam.life>0)){player.autoCooldown=Math.max(0,player.autoCooldown);return}
 if(player.autoCooldown<=0){const overdue=player.autoCooldown;fireCharge();player.autoCooldown=Math.max(0,player.autoCooldown+overdue)}
}
function fireCharge(){
 const charged=player.charge>=chargeLimit()*(.4/1.5), power=clamp(player.charge/chargeLimit(),0,1), weapon=activeWeapon(), firstNew=bullets.length;
 sound('shot',{charged,style:styles[weapon]||'normal',x:player.x});
 const style=styles[weapon]||'normal',emit=(angle=0,mode=style,scale=1,offset=0)=>addBullet(angle,mode,charged,power,scale,offset);
 if(style==='port'||style==='storm'){
  const storm=style==='storm', life=(storm?(charged?1.05:.22):(charged?.65+power*.55:.34))*(1+upgrades.duration*.08+upgrades.cellar*.01);
  beams=[];beams.push({life,maxLife:life,charged,style,width:(storm?(charged?54:13):(charged?14+power*14:9))*(1+upgrades.size*.06),damage:damage(storm?(charged?7:2):(charged?3.5+power*2:1.8)),tick:0,elements:attackElements(charged),x:player.x+27,y:player.y-2});
  ring(player.x+28,player.y,colors[weapon],storm&&charged?150:35);
  if(storm&&charged){flashes.push({x:player.x+45,y:player.y,r:120,life:.16,maxLife:.16});shake=4}
 }else if(style==='prism'){
  for(const angle of charged?[-.18,0,.18]:[0]){const b=emit(angle);if(b)b.split=charged?5:3}
 }else if(style==='saw'){
  for(const angle of charged?[-.12,.12]:[0]){const b=emit(angle);if(b){b.returnAt=charged?.75:.55;b.life=1.7;b.w*=1.15;b.h=b.w}}
 }else if(style==='chain'){
  const b=emit();if(b)b.chain=charged?4:2;
 }else if(style==='orbit'){
  for(let i=0;i<(charged?3:2);i++){const b=emit(0);if(b){b.orbit=charged?1.25:.7;b.phase=i*Math.PI*2/(charged?3:2);b.orbitRadius=charged?56:35;b.life=3}}
 }else if(style==='mortar'){
  for(let i=0;i<(charged?3:1);i++){const b=emit();if(b){b.vx=350+i*60;b.vy=-200-i*35;b.gravity=330;b.blast=true;b.life=2.4}}
 }else if(style==='wave'){
  const b=emit();if(b){b.wave=true;b.life=charged?1.8:1.1;b.vx=charged?380:430;b.damage*=.9}
 }else if(style==='frost'){
  for(const angle of charged?[-.28,-.14,0,.14,.28]:[-.1,.1]){const b=emit(angle);if(b){b.slow=charged?.42:.28;b.elements.frost=Math.min(.65,b.slow+upgrades.frost*.04)}}
 }else if(style==='vortex'){
  const b=emit();if(b){b.vx=charged?110:160;b.life=charged?2.2:1.25;b.vortex=charged?94:60;b.pulse=.24;b.damage*=.35;b.w*=1.6;b.h=b.w}
 }else if(style==='phoenix'){
  for(const angle of charged?[-.12,0,.12]:[0]){const b=emit(angle);if(b){b.phoenix=true;b.baseY=b.y;b.phase=angle*12;b.life=2.6;b.damage*=.8}}
 }else{
  const angles=style==='white'?(charged?[-.34,-.17,0,.17,.34]:[-.24,0,.24]):style==='rose'&&charged?[-.4,0,.4]:style==='speed'?[-.065,.065]:[0];
  for(let j=0;j<(style==='red'&&!charged?3:1);j++)for(const angle of angles)emit(angle,style,1,j*15);
 }
 if(upgrades.echoForge&&((player.attacks+1)%4===0)){
  const primary=bullets.slice(firstNew,firstNew+2);for(const original of primary)for(const side of [-1,1])if(bullets.length<360)bullets.push({...original,x:original.x-15,y:original.y+side*8,phase:(original.phase||0)+side*.4,damage:original.damage*.45,life:original.life*.9,hit:new Set(),echoed:true});
  if(beams.length){const original=beams[0];for(const side of [-1,1])beams.push({...original,offset:side*20,damage:original.damage*.45,life:original.life*.65,echoed:true})}sound('echo');
 }
 if(charged&&upgrades.orbital>0)for(let i=0;i<2;i++){const orb=addBullet(0,'orbit',charged,power,.25+upgrades.orbital*.15);if(orb){orb.orbit=1.2;orb.orbitRadius=48+i*5;orb.phase=i*Math.PI;orb.life=2.7}}
 if(player.overdrive>0)for(const angle of [-.2,.2])addBullet(angle,'speed',charged,power,.45);
 if(upgrades.spread>0)for(const angle of [-.32,.32])addBullet(angle,'satellite',false,0,.15+upgrades.spread*.15);
 if(upgrades.rear>0)addBullet(Math.PI,'satellite',charged,power,upgrades.rear*.2);
 player.attacks++;if(upgrades.echo>0&&!upgrades.echoForge&&player.attacks%6===0)for(const angle of [-.1,.1])addBullet(angle,'echo',charged,power,.3+upgrades.echo*.05);
 player.autoCooldown=shotInterval();
 player.muzzle=charged?.2:.12;impact(player.x+28,player.y,colors[weapon]||'#a8edff',charged?18:7);
 if(charged){ring(player.x+27,player.y,colors[weapon]||'#d6f5ff',48);shake=Math.max(shake,1.8)}
}
function enemy(i){
 const elite=t>120&&Math.random()<Math.min(.22,.06+t/4500), hp=Math.round([2,3,4,5,4,6,6,9,9,14][i]*(1+threat*.6)*(elite?1.4:1));
 const sizes=[[42,42],[56,46],[54,34],[46,54],[58,34],[46,58],[60,44],[52,54],[60,48],[78,62]][i];
 enemies.push({i,x:1000,y:rand(105,475),w:sizes[0],h:sizes[1],hp,max:hp,age:0,fire:rand(1,2.8),speed:rand(65,100)+Math.min(t/20,90),phase:rand(0,6),warning:false,flash:0,elite,slow:0,slowTime:0,burnLife:0,burnDps:0});
}
function projectile(x,y,vx,vy,col='#e7b575',size=10,options={}){if(shots.length<180){const pace=1+threat*.075;shots.push({x,y,vx:vx*pace,vy:vy*pace,w:size,h:size,col,life:8,age:0,...options})}}
function aimed(x,y,speed,col,options={}){const angle=Math.atan2(player.y-y,player.x-x);projectile(x,y,Math.cos(angle)*speed,Math.sin(angle)*speed,col,10,options)}
function enemyAttack(e){
 const x=e.x-22,y=e.y;
 if(e.i===0&&t>90)projectile(x,y,-150,-65,'',9,{gravity:100,kind:'spike'});
 if(e.i===1&&t>45)for(const sign of [-1,1])projectile(x,y,-155,sign*50,'',8,{curve:sign*.8,curveUntil:.7,kind:'needle'});
 if(e.i===2)projectile(x,y,-160,-95,'',9,{gravity:140,kind:'spike'});
 if(e.i===3)aimed(x,y,160,'',{follow:.55,kind:'needle'});
 if(e.i===4)for(const sign of [-1,1])projectile(x,y,-170,sign*90,'',8,{curve:sign*-.75,curveUntil:.7,kind:'needle'});
 if(e.i===5)for(let k=-2;k<=2;k++)projectile(x,y,-125*Math.cos(k*.4),125*Math.sin(k*.4),'',10,{curve:.55,curveUntil:1,kind:'orb'});
 if(e.i===6)projectile(x,y,-210,0,'',12,{kind:'spike'});
 if(e.i===7)for(const sign of [-1,0,1])projectile(x,y,-175,sign*40,'',10,{gravity:sign*25,kind:'orb'});
 if(e.i===8)for(const sign of [-1,1])aimed(x,y+sign*12,175,'',{follow:.65,kind:'needle'});
 if(e.i===9)for(const sign of [-1,0,1])projectile(x,y,-150,sign*70-35,'',12,{gravity:75,kind:'spike'});
}
function hurt(){
 if(player.inv>0||state!=='playing')return;
 if(player.effects[2]>0){sound('block');player.effects[2]=0;impact(player.x,player.y,'#ffc3e3',18)}else{sound('hurt');hearts--;impact(player.x,player.y,'#f17765',22);flash=.18}
 player.inv=1.5;shake=4;if(hearts<=0)end();
}
let lastRoast=-1;
function end(){
 state='over';sound('die');cancelCharge();overlay.classList.remove('hidden');overlay.classList.remove('upgrade-overlay');overlay.classList.add('game-over');
 let roast=Math.floor(rand(0,roasts.length));if(roast===lastRoast)roast=(roast+1)%roasts.length;lastRoast=roast;
 const comeback=comebacks[Math.floor(rand(0,comebacks.length))],build=Object.values(upgrades).reduce((a,b)=>a+b,0);
 overlay.innerHTML='<div class="eyebrow">✦ DER BASAR HAT DICH AUSGELACHT ✦</div><h1>OH PFERT<span>✦</span></h1><p class="roast">'+roasts[roast]+'</p><p class="comeback">'+comeback+'</p><p class="run-stats">'+score+' Punkte · '+clock(runTime)+' überlebt · '+build+' Karten</p><button id="again">ICH BIN NOCH NICHT FERTIG →</button><p class="hint">ENTER oder den Knopf drücken</p>';
 document.getElementById('again').addEventListener('click',reset);
}
function setupSegments(b){
 const layout=PfertArt.bossLayout(b.i),weight=layout.reduce((sum,p)=>sum+(p.weight||1),0);
 b.parts=layout.map(p=>{const xs=p.points.map(v=>v[0]),ys=p.points.map(v=>v[1]),left=Math.min(...xs),right=Math.max(...xs),top=Math.min(...ys),bottom=Math.max(...ys),hp=Math.ceil(b.max*(p.weight||1)/weight);return {...p,dx:(left+right)/2,dy:(top+bottom)/2,w:right-left,h:bottom-top,hp,max:hp,flash:0}});
 b.hp=b.parts.reduce((sum,p)=>sum+p.hp,0);b.max=b.hp;return b;
}
function partHit(rect,b,part){
 const x=rect.x-b.x,y=rect.y-b.y,left=x-rect.w/2,right=x+rect.w/2,top=y-rect.h/2,bottom=y+rect.h/2;
 if(right<part.dx-part.w/2||left>part.dx+part.w/2||bottom<part.dy-part.h/2||top>part.dy+part.h/2)return false;
 let polygon=part.points;
 for(const [axis,edge,sign] of [[0,left,1],[0,right,-1],[1,top,1],[1,bottom,-1]]){
  const clipped=[];for(let i=0;i<polygon.length;i++){const a=polygon[i],b=polygon[(i+1)%polygon.length],insideA=(a[axis]-edge)*sign>=0,insideB=(b[axis]-edge)*sign>=0;if(insideA)clipped.push(a);if(insideA!==insideB){const t=(edge-a[axis])/(b[axis]-a[axis]);clipped.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t])}}polygon=clipped;if(!polygon.length)return false;
 }return true;
}
function startBoss(){
 const i=bossCount%5,cycle=Math.floor(bossCount/5);
 boss=setupSegments({i,x:830,y:270,w:150,h:146,hp:0,max:(90+cycle*30+i*15)*(1+threat*.2),age:0,fire:1.5,warning:0});
 sound('boss');bossCount++;nextBoss+=300;enemies=[];shots=[];notice=3;noticeText=bosses[i].toUpperCase();ring(830,270,'#ffd58b',130);
}
function enterRuhr(){sound('transition');secretType=golden&&golden.kind===2?2:1;secret=true;secretTime=0;golden=null;boss=null;enemies=[];shots=[];bullets=[];beams=[];pickups=[];spawn=1;notice=4;noticeText=secretType===2?'NACHTSCHICHT AM HOCHOFEN':'GEHEIMLEVEL: GLÜCK AUF, PFERT!';player.inv=2}
function leaveRuhr(){sound('transition');secret=false;secretType=0;boss=null;enemies=[];shots=[];bullets=[];beams=[];pickups=[];spawn=2;notice=4;noticeText='ZURÜCK IN DIE WOLKEN!';player.inv=2}
function startRuhrBoss(){sound('boss');const i=secretType===2?6:5;boss=setupSegments({i,x:830,y:270,w:150,h:146,max:(i===6?155:120)*(1+threat*.22),age:0,fire:1.5,warning:0});enemies=[];shots=[];notice=3;noticeText=bosses[i].toUpperCase()}
function damageEnemy(e,amount,x,y){if(e.hp<=0)return;sound('hit',{type:e.i,x});const finisher=e.hp/e.max<.35?1+upgrades.execute*.06:1;e.hp-=amount*finisher;e.flash=.085;particle(x,y,'#e8faff',5);if(flashes.length<28)flashes.push({x,y,r:12,life:.08,maxLife:.08,magic:['frost','chain','port','storm','vortex','prism','orbit'].includes(e.lastImpact)});if(e.hp<=0)death(e)}
function applyAilment(b,e){
 const elements=b.elements||attackElements(!!b.charged),slow=Math.min(.65,Math.max(b.slow||0,elements.frost));if(slow>0){e.slow=Math.max(e.slow||0,slow);e.slowTime=1.8}
 if(elements.fire>0){e.burnLife=1.8;e.burnDps=Math.max(e.burnDps||0,b.damage*elements.fire)}
}
function onHit(b,e,x,y){
 if(e){applyAilment(b,e);
  if(upgrades.shatter>0&&e.slowTime>0&&e.burnLife>0&&!(e.shatterCooldown>0)){
   e.shatterCooldown=.4;ring(x,y,'#bbf4ff',62+upgrades.shatter*8);flashes.push({x,y,r:35,life:.1,maxLife:.1});sound('shatter');
   for(const target of enemies)if(target.hp>0&&Math.hypot(target.x-x,target.y-y)<70)damageEnemy(target,b.damage*.4*upgrades.shatter,target.x,target.y);
  }
 }
 const elements=b.elements||attackElements(!!b.charged),count=Math.max(b.chain||0,elements.lightning?1:0)+elements.chainBonus;
 if(count>0){let origin={x,y};const used=new Set(e?[e]:[]);for(let i=0;i<count;i++){
  const target=enemies.filter(v=>v.hp>0&&!used.has(v)&&Math.hypot(v.x-origin.x,v.y-origin.y)<(b.chain?175:120)).sort((a,b)=>Math.hypot(a.x-origin.x,a.y-origin.y)-Math.hypot(b.x-origin.x,b.y-origin.y))[0];if(!target)break;used.add(target);
  if(arcs.length<36)arcs.push({x:origin.x,y:origin.y,tx:target.x,ty:target.y,life:.16,maxLife:.16});
  target.lastCharged=!!(b.charged||b.sourceCharged);damageEnemy(target,b.damage*(b.chain?.5:.2)*Math.pow(1.45,upgrades.cascade),target.x,target.y);applyAilment(b,target);origin=target;
 }}
 const split=(b.generation||0)<1?Math.min(7,Math.max(b.split||0,elements.earth?2:0)+elements.forkBonus):0;
 if(split&&!b.fragmented&&Number.isFinite(b.vx)&&Number.isFinite(b.vy)){
  b.fragmented=true;const angle=Math.atan2(b.vy,b.vx);for(let i=0;i<split;i++){
   const child=addBullet(angle+(i-(split-1)/2)*.23,b.split?'prism':b.style,false,0,.5);if(child){child.x=x+8;child.y=y;child.split=0;child.generation=1;child.elements={...elements};child.chain=b.chain||0;child.slow=b.slow||0;child.blast=b.blast;child.sourceCharged=!!(b.charged||b.sourceCharged);child.damage=b.damage*.5;child.life=1.2}
  }ring(x,y,'#c7ffff',34);sound('split');
 }
}
function damagePart(part,amount,x,y){
 if(!boss||part.hp<=0)return;
 part.hp=Math.max(0,part.hp-amount*(part.hp/part.max<.35?1+upgrades.execute*.06:1));part.flash=.1;particle(x,y,'#fff0c8',8);if(flashes.length<28)flashes.push({x,y,r:18,life:.09,maxLife:.09});
 if(part.hp===0){sound('segment');addRage(15);score+=500;ring(x,y,'#ffb86b',72);particle(x,y,'#ffbe7b',30);shake=4;notice=1.5;noticeText='SEGMENT ZERSTÖRT!'}
 boss.hp=boss.parts.reduce((sum,p)=>sum+p.hp,0);
 if(boss.hp<=0){const defeated=boss;score+=2000+boss.i*500;ring(boss.x,boss.y,'#fff1ba',150);particle(boss.x,boss.y,'#ffbd7c',60,2);deaths.push({...boss,boss:true,secret,life:1.2,age:0,rotation:.3});shake=5;if(defeated.i>=5)leaveRuhr();else{boss=null;shots=[]}}
}
function splash(b){
 const radius=(b.style==='red'?54:30)+upgrades.blast*5, amount=b.damage*(b.style==='red'?.4:upgrades.blast*.12);
 ring(b.x,b.y,b.style==='red'?'#ff8b5b':'#ffe9aa',radius);particle(b.x,b.y,'#ffbe72',20,1.3);
 for(const e of enemies)if(e.hp>0&&Math.hypot(e.x-b.x,e.y-b.y)<radius)damageEnemy(e,amount,e.x,e.y);
}
function updateBoss(dt){
 if(!boss)return;let chill=0;
 for(const part of [...boss.parts]){part.flash=Math.max(0,part.flash-dt);part.slowTime=Math.max(0,(part.slowTime||0)-dt);if(part.slowTime<=0)part.slow=0;part.shatterCooldown=Math.max(0,(part.shatterCooldown||0)-dt);if(part.hp>0)chill=Math.max(chill,part.slow||0);
  if(part.hp>0&&part.burnLife>0){part.burnLife-=dt;part.burnTick=(part.burnTick||0)+dt;if(part.burnTick>=.25){const elapsed=part.burnTick;part.burnTick=0;damagePart(part,part.burnDps*elapsed,boss.x+part.aim[0],boss.y+part.aim[1]);if(!boss)return}}
 }
 boss.age+=dt*(1-chill*.5);boss.fire-=dt*(1-chill*.5);boss.x+=(830-boss.x)*Math.min(1,dt*2);boss.y=270+Math.sin(boss.age*.8)*120;
 if(boss.fire<=0){
  const alive=boss.parts.filter(p=>p.hp>0).filter((p,i,all)=>all.findIndex(other=>other.role===p.role)===i);for(const part of alive){const y=boss.y+part.aim[1],x=boss.x+part.aim[0];
   if(part.role===0){for(const angle of [-.3,0,.3])projectile(x,y,-190*Math.cos(angle),190*Math.sin(angle),boss.i===5?'#b5dfff':'#edab72',11)}
   else if(part.role===1)aimed(x,y,190,'',{follow:.5,kind:'needle'});
   else for(const angle of [-.12,.12])projectile(x,y,-170,angle*180,'#ecc7aa',12,{gravity:boss.i===6?110:0,curve:boss.i===3?angle*3:0,curveUntil:.7,kind:'spike'});
  }
  if(boss.i===0||boss.i===3||boss.i===4)boss.warning=.8;
  boss.fire=(boss.i===4?1.8:2.5)/(1+threat*.12);
 }
 if(boss.warning>0){boss.warning-=dt;if(boss.warning<=0){boss.x=620;projectile(800,boss.y,-260,0,'#e8b68a',18)}}
 if(boss.parts.some(part=>part.hp>0&&partHit(player,boss,part)))hurt();
}
function update(dt){
 if(state!=='playing')return;
 comboTime=Math.max(0,comboTime-dt);if(comboTime<=0)combo=0;
 const build=Object.values(upgrades).reduce((a,b)=>a+b,0);const synergyPressure=upgrades.fork*.3+upgrades.cascade*.25+upgrades.shatter*.3+upgrades.echoForge*.35+upgrades.orbital*.3;const targetThreat=Math.min(4.5,t/440+build*.055+synergyPressure+(activeWeapon()>=0?.1:0));threat+=(targetThreat-threat)*Math.min(1,dt*.25);
 runTime+=dt;if(runTime>=nextUpgrade){offerCards();if(state==='upgrade')return}
 if(secret)secretTime+=dt;else t+=dt;
 notice=Math.max(0,notice-dt);flash=Math.max(0,flash-dt);shake=Math.max(0,shake-dt*18);
 const nextLevel=Math.floor(t/180)%levels.length;if(!secret&&nextLevel!==levelIndex){levelIndex=nextLevel;notice=4;noticeText=levels[levelIndex]}
 player.guardFlash=Math.max(0,player.guardFlash-dt);player.overdrive=Math.max(0,player.overdrive-dt);player.inv=Math.max(0,player.inv-dt);player.podCooldown=Math.max(0,player.podCooldown-dt);player.muzzle=Math.max(0,player.muzzle-dt);
 for(let i=0;i<player.effects.length;i++)player.effects[i]=Math.max(0,player.effects[i]-dt);
 const dx=Number(keys.has('ArrowRight')||keys.has('KeyD'))-Number(keys.has('ArrowLeft')||keys.has('KeyA'));
 const dy=Number(keys.has('ArrowDown')||keys.has('KeyS'))-Number(keys.has('ArrowUp')||keys.has('KeyW'));
 const len=Math.hypot(dx,dy)||1,speed=(activeWeapon()===4?300:220)*1.15*1.05*(1+upgrades.agility*.03);
 player.x=clamp(player.x+dx/len*speed*dt,30,W-32);player.y=clamp(player.y+dy/len*speed*dt,90,H-34);
 if(player.charging){player.charge=Math.min(chargeLimit(),player.charge+dt);if(!player.chargeCue&&player.charge>.18){player.chargeCue=true;sound('charge',{style:styles[activeWeapon()]||'normal'})}if(!player.readyCue&&player.charge>=chargeLimit()){player.readyCue=true;sound('charged')}}
 updateAutoFire(dt);
 if(!secret&&!golden&&!goldenAppeared&&t>=420&&!boss&&t<nextBoss){goldenAppeared=true;golden={x:1000,y:clamp(player.y,110,460),w:64,h:38,age:0,kind:1};notice=4;noticeText='GOLDENE SUCUK! SCHIESS SIE AB!'}
 if(!secret&&!golden&&!secondAppeared&&t>=840&&!boss&&t<nextBoss){secondAppeared=true;golden={x:1000,y:clamp(player.y,110,460),w:44,h:50,age:0,kind:2};notice=4;noticeText='GRUBENLAMPE! SCHIESS SIE AB!'}
 if(golden){golden.x-=80*dt;golden.age+=dt;golden.y=clamp(golden.y+Math.sin(golden.age*3)*20*dt,90,490);if(golden.x< -60)golden=null}
 if(!secret&&!boss&&t>=nextBoss)startBoss();if(secret&&!boss&&secretTime>=(secretType===2?60:45))startRuhrBoss();
 if(!boss){spawn-=dt;if(spawn<=0){const unlocked=Math.min(9,Math.floor(t/32));enemy(secret?Math.floor(rand(0,5)):Math.floor(rand(0,unlocked+1)));spawn=Math.max(.48,1.65-t/450)*rand(.8,1.2)}}
 drop-=dt;if(drop<=0){pickups.push({x:1000,y:rand(105,475),i:Math.floor(rand(0,16)),w:30,h:42,age:0});drop=rand(12,19)}
 for(const b of bullets){
  b.trailClock=(b.trailClock||0)+dt;if(b.trailClock>=.025){b.trailClock%=.025;(b.trail||(b.trail=[])).push({x:b.x,y:b.y});if(b.trail.length>7)b.trail.shift()}
  b.age=(b.age||0)+dt;b.life=(b.life===undefined?4:b.life)-dt;
  if(b.homing){const target=enemies.find(e=>e.hp>0&&e.x>b.x-20)||boss;if(target){const angle=Math.atan2(target.y-b.y,target.x-b.x);const speed=Math.hypot(b.vx,b.vy);b.vx+=(Math.cos(angle)*speed-b.vx)*Math.min(1,dt*3);b.vy+=(Math.sin(angle)*speed-b.vy)*Math.min(1,dt*3)}}
  if(b.gravity)b.vy+=b.gravity*dt;
  if(b.returnAt&&b.age>b.returnAt&&!b.returning){b.returning=true;b.vx=-Math.abs(b.vx);b.hit.clear()}
  if(b.wave){b.w+=dt*38;b.h+=dt*(b.charged?105:65)}
  if(b.vortex){b.pulse-=dt;if(b.pulse<=0){b.pulse=.3;b.hit.clear()}for(const e of enemies)if(e.hp>0&&Math.hypot(e.x-b.x,e.y-b.y)<b.vortex){e.x+=(b.x-e.x)*dt*.3;e.y+=(b.y-e.y)*dt*.7}}
  if(b.orbit&&b.age<b.orbit){b.x=player.x+22+Math.cos(b.age*7+b.phase)*b.orbitRadius;b.y=player.y+Math.sin(b.age*7+b.phase)*b.orbitRadius}else{b.x+=b.vx*dt;b.y+=b.vy*dt}
  if(b.phoenix){b.baseY+=b.vy*dt;b.y=b.baseY+Math.sin(b.age*9+b.phase)*22}
  if((b.y<80||b.y>510)&&b.bounces>0){b.y=clamp(b.y,80,510);b.vy=-b.vy;b.bounces--}
 
 }
 for(const s of shots){s.trailClock=(s.trailClock||0)+dt;if(s.trailClock>=.035){s.trailClock%=.035;(s.trail||(s.trail=[])).push({x:s.x,y:s.y});if(s.trail.length>4)s.trail.shift()}s.age=(s.age||0)+dt;
  if(s.follow&&s.age<s.follow){const desired=Math.atan2(player.y-s.y,player.x-s.x),current=Math.atan2(s.vy,s.vx),difference=Math.atan2(Math.sin(desired-current),Math.cos(desired-current)),angle=current+clamp(difference,-dt*.75,dt*.75),speed=Math.hypot(s.vx,s.vy);s.vx=Math.cos(angle)*speed;s.vy=Math.sin(angle)*speed}
  if(s.curve&&s.age<(s.curveUntil||1)){const angle=Math.atan2(s.vy,s.vx)+s.curve*dt,speed=Math.hypot(s.vx,s.vy);s.vx=Math.cos(angle)*speed;s.vy=Math.sin(angle)*speed}
  if(s.gravity)s.vy+=s.gravity*dt;s.x+=s.vx*dt;s.y+=s.vy*dt;s.life-=dt;
 }
 for(const p of pickups){const dx=player.x-p.x,dy=player.y-p.y,distance=Math.hypot(dx,dy);if(distance<78+upgrades.magnet*12&&distance>1){p.x+=dx/distance*260*dt;p.y+=dy/distance*260*dt}else p.x-=100*dt;p.age=(p.age||0)+dt}
 for(const e of enemies){
  e.age+=dt;e.shatterCooldown=Math.max(0,(e.shatterCooldown||0)-dt);e.flash=Math.max(0,e.flash-dt);e.slowTime=Math.max(0,(e.slowTime||0)-dt);if(e.slowTime<=0)e.slow=0;
  if(e.burnLife>0&&e.hp>0){e.burnLife-=dt;e.hp-=e.burnDps*dt;if(e.hp<=0)death(e);else if(Math.random()<dt*8)particle(e.x,e.y,'#ffb483',1)}
  const pausing=e.i===3&&e.age%3>1.25&&e.age%3<2.05;e.x-=(pausing?0:e.speed)*(1-(e.slow||0))*dt;e.fire-=dt*(1-(e.slow||0)*.4);
  const wave=[0,30,45,0,55,20,0,0,42,12][e.i];e.y=clamp(e.y+Math.cos(e.age*(e.i===4?6:2)+e.phase)*wave*dt,95,495);
  if(e.i===6){const phase=e.age%3;e.warning=phase>.7&&phase<=1.1;if(phase>1.1&&phase<1.55)e.x-=180*dt}
  e.aimWarning=e.fire<.35;
  if(e.fire<=0){enemyAttack(e);e.fire=rand(1.8,3.1)/(1+threat*.16)/(e.elite?1.12:1)}
  if(hit(player,{...e,w:e.w-8,h:e.h-8}))hurt();
 }
 updateBoss(dt);
 if(state!=='playing')return;
 for(const beam of beams){
  beam.x=player.x+27;beam.y=player.y-2+(beam.offset||0);beam.life-=dt;beam.tick-=dt;
  if(golden&&golden.x>=beam.x&&Math.abs(golden.y-beam.y)<golden.h/2+beam.width){score+=500;enterRuhr();break}
  if(beam.tick<=0){beam.tick=.12;for(const e of enemies)if(e.x>beam.x&&Math.abs(e.y-beam.y)<e.h/2+beam.width/2){e.lastCharged=!!beam.charged;e.lastImpact=beam.style||'port';damageEnemy(e,beam.damage,e.x,beam.y);onHit({damage:beam.damage,style:'prism',vx:1,vy:0,charged:beam.charged,elements:beam.elements},e,e.x,beam.y)};
   if(boss)for(const part of [...boss.parts]){if(!boss)break;if(part.hp>0&&partHit({x:(W+beam.x)/2,y:beam.y,w:W-beam.x,h:beam.width},boss,part)){const x=boss.x+part.aim[0];damagePart(part,beam.damage,x,beam.y);onHit({damage:beam.damage,style:'prism',vx:1,vy:0,charged:beam.charged,elements:beam.elements},part,x,beam.y)}}
  }
 }
 for(const b of bullets){
  if(b.dead)continue;
  if(golden&&hit(b,golden)){score+=500;enterRuhr();break}
  for(const e of enemies){if(e.hp<=0||b.hit.has(e)||!hit(b,e))continue;
   b.hit.add(e);e.lastCharged=!!(b.charged||b.sourceCharged);e.lastImpact=b.style;damageEnemy(e,b.damage||1,b.x,b.y);onHit(b,e,b.x,b.y);if(b.blast)splash(b);
   if(!b.pierce){if(b.remaining>0)b.remaining--;else b.dead=true}if(b.dead)break;
  }
  if(boss&&!b.dead)for(const part of [...boss.parts]){
   if(!boss)break;if(part.hp<=0||b.hit.has(part)||!partHit(b,boss,part))continue;
   b.hit.add(part);damagePart(part,b.damage||1,b.x,b.y);onHit(b,part,b.x,b.y);if(!b.pierce){if(b.remaining>0)b.remaining--;else b.dead=true}if(b.dead)break;
  }
 }
 for(const s of shots){
  const pod={x:player.x,y:player.y,w:player.w+14,h:player.h+14};
  if(s.life>0&&player.podCooldown<=0&&hit(pod,s)){s.life=0;player.guardFlash=.16;player.podCooldown=2.5*Math.pow(.92,upgrades.guard);impact(pod.x,pod.y,'#aeeaff',12);addRage(10);sound('block')}
  else if(s.life>0&&hit(player,s)){s.life=0;hurt()}
  else if(s.life>0&&!s.grazed&&player.inv<=0&&Math.hypot(s.x-player.x,s.y-player.y)<42){s.grazed=true;addRage(2);score+=25;particle(player.x,player.y,'#b5f7ff',3);sound('graze')}
 }
 if(state!=='playing')return;
 for(const p of pickups)if(hit(player,p)){
  if(p.i===5)hearts=Math.min(MAX_HEARTS,hearts+1);else{player.weapon=p.i;player.effects=player.effects.map((v,i)=>i===2?v:0);player.effects[p.i]=18*(1+upgrades.duration*.08+upgrades.cellar*.01)}
  sound(p.i===5?'heal':'pickup',{style:styles[p.i]||'normal'});p.dead=true;notice=2.6;noticeText=p.i===5?'TRAUBENMOST · EIN HERZ':powerNames[p.i].toUpperCase()+' · '+weaponNames[p.i];ring(p.x,p.y,colors[p.i],60);particle(p.x,p.y,colors[p.i],24);
 }
 for(const p of particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=100*dt;p.life-=dt}
 for(const d of deaths){d.age+=dt;d.life-=dt}
 for(const r of rings)r.life-=dt;for(const a of arcs)a.life-=dt;for(const f of flashes)f.life-=dt;
 enemies=enemies.filter(e=>e.x>-100&&e.hp>0);bullets=bullets.filter(b=>!b.dead&&b.life>0&&b.x<W+60&&b.x>-60&&b.y>-50&&b.y<H+50);
 shots=shots.filter(s=>s.life>0&&s.x>-30&&s.x<W+30&&s.y>-30&&s.y<H+30);pickups=pickups.filter(p=>!p.dead&&p.x>-30);
 particles=particles.filter(p=>p.life>0);deaths=deaths.filter(d=>d.life>0);rings=rings.filter(r=>r.life>0);beams=beams.filter(b=>b.life>0);arcs=arcs.filter(a=>a.life>0);flashes=flashes.filter(f=>f.life>0).slice(-28);
}
function render(){
 c.save();const now=secret?secretTime:t;c.translate(shake>0?Math.sin(now*83)*shake:0,shake>0?Math.cos(now*77)*shake*.5:0);
 PfertArt.background(c,levelIndex,now,secret?secretType:0);
 for(const p of pickups)PfertArt.bottle(c,p);
 if(golden)PfertArt.golden(c,golden);
 const sceneLights=flashes.slice(-4).map(f=>({x:f.x,y:f.y,strength:f.life/f.maxLife,color:f.magic?'#a4ddff':'#ffcd8c'}));for(const b of bullets.filter(b=>b.charged).slice(-3))sceneLights.push({x:b.x,y:b.y,strength:.6,color:['red','phoenix','mortar'].includes(b.style)?'#ffba80':'#9edbff'});
 for(const e of enemies){let light=null;for(const source of sceneLights){const strength=source.strength*Math.max(0,1-Math.hypot(e.x-source.x,e.y-source.y)/110);if(strength>(light?light.strength:0))light={strength,color:source.color}}PfertArt.enemy(c,e,levelIndex,secret?secretType:0,light)}
 if(boss)PfertArt.boss(c,boss,secret);
 for(const d of deaths)PfertArt.death(c,d,levelIndex);
 for(const b of bullets){PfertArt.trail(c,b);PfertArt.bullet(c,b)}
 for(const beam of beams)PfertArt.beam(c,beam,now);
 for(const s of shots)PfertArt.hostile(c,s);
 for(const arc of arcs)PfertArt.arc(c,arc);for(const f of flashes)PfertArt.flash(c,f);
 for(const r of rings)PfertArt.ring(c,r);
 for(const p of particles)PfertArt.spark(c,p);c.globalAlpha=1;
 PfertArt.horse(c,player||{x:140,y:300,effects:[],charge:0},now,player?chargeLimit():1.5);
 c.restore();
 if(player&&(state==='playing'||state==='upgrade')){
  PfertArt.hud(c,{hearts,score,t,runTime,secret,secretType,secretTime,player,boss,weapon:activeWeapon(),weaponNames,bosses,nextUpgrade,notice,noticeText,upgrades,combo,threat,elements:attackElements(),maxHearts:MAX_HEARTS});
  if(flash>0){c.fillStyle='rgba(255,80,60,'+flash+')';c.fillRect(0,0,W,H)}
 }
}
function frame(now){const dt=Math.min((now-last)/1000||0,.05);last=now;update(dt);render();requestAnimationFrame(frame)}
requestAnimationFrame(frame);
})();
