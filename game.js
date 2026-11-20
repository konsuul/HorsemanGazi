(() => {
'use strict';
const canvas = document.getElementById('game');
const c = canvas.getContext('2d');
const overlay = document.getElementById('overlay');
const W = 960, H = 540, MAX_HEARTS = 5;
const playerFireRate=1.5, playerHitDamage=.5, hostileShotSpeed=1.3*1.1, seekSteering=.7;
const fullEnemyDensityTime=20*60;
const rageBaseDuration=12, orbXpMultiplier=1.5, snakeAmplitude=.85;
const cardProjectileDamage=.3;
function enemyDensity(time){
 return (25+125*clamp(time/fullEnemyDensityTime,0,1))*(firstBossDefeated?.85:1)/60;
}
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
 {id:'healing',icon:'♥',title:'Herzstück',desc:'Füllt ein Herz wieder auf.',max:Infinity},
 {id:'multiShot',icon:'⋮',title:'Doppelter Käse',desc:'Ein Zusatzgeschoss je Rang mit 30 % Schaden. Gilt für Standard- und Wein-Sonderangriffe.',max:3},
 {id:'fanShot',icon:'⋔',title:'Streuflug',desc:'Zwei zusätzliche Fächerschüsse je Rang mit 30 % Schaden. Gilt auch für Wein-Sonderangriffe.',max:3},
 {id:'snakeShot',icon:'∿',title:'Schlangenlinie',desc:'Standardgeschosse und Wein-Sonderangriffe schwingen.',max:3},
 {id:'seekShot',icon:'◎',title:'Spürnase',desc:'Standardgeschosse, Weinangriffe und Laser verfolgen Gegner.',max:3},
 {id:'breakShot',icon:'✣',title:'Käsebruch',desc:'Treffer erzeugen Splitter mit 30 % des auslösenden Schadens.',max:3},
 {id:'boomerang',icon:'↶',title:'Bumerangkäse',desc:'Standardschüsse kehren nach 0,5 Sekunden oder beim ersten Treffer um und können auf dem Rückweg erneut treffen.',max:1},
 {id:'carousel',icon:'⟳',title:'Käsekarussell',desc:'Standardschüsse kreisen kurz um das Pfert, bevor sie im Abschusswinkel ausbrechen.',max:1},
 {id:'bounceCrust',icon:'↱',title:'Sprungkruste',desc:'Standardschüsse prallen einmal zusätzlich ab. Beim ersten Abpraller löst sich ein Splitter.',max:1},
 {id:'damage',icon:'✦',title:'Käsereifung',desc:'12 % MEHR Schaden je Rang, multipliziert mit anderen Effekten.',max:10},
 {id:'charge',icon:'ϟ',title:'Schnellgärung',desc:'+9 % Sonderangriffsschaden je Rang.',max:8},
 {id:'spread',icon:'⋔',title:'Flankenkäse',desc:'Zwei Flankenschüsse. Je Rang +15 % ihrer Stärke.',max:6},
 {id:'critical',icon:'◆',title:'Goldene Rinde',desc:'+3 % Chance auf doppelten Schaden.',max:8},
 {id:'size',icon:'◉',title:'Große Portion',desc:'+6 % Geschossgröße und Laserbreite.',max:8},
 {id:'duration',icon:'∞',title:'Langer Abgang',desc:'+8 % Dauer für Wein und Laser.',max:8},
 {id:'velocity',icon:'➤',title:'Rückenwind',desc:'+6 % Geschossgeschwindigkeit.',max:8},
 {id:'pierce',icon:'➶',title:'Harte Kruste',desc:'Ein zusätzliches Ziel durchdringen.',max:3},
 {id:'blast',icon:'✺',title:'Käsefondue',desc:'+12 % Trefferfläche für Sonderangriffe je Rang.',max:6},
 {id:'agility',icon:'➟',title:'Flotte Hufe',desc:'+3 % Pfert-Geschwindigkeit.',max:6},
 {id:'magnet',icon:'⊕',title:'Korkenzieher',desc:'+240 Pixel Ansaugreichweite für Flaschen, +12 für Orbs.',max:5},
 {id:'ricochet',icon:'↗',title:'Billardkäse',desc:'Ein zusätzlicher Abpraller an Ober- und Unterkante.',max:3},
 {id:'chain',icon:'ϟ',title:'Statische Rinde',desc:'Treffer springen mit 20 % Schaden auf ein weiteres Ziel über.',max:3},
 {id:'frost',icon:'❄',title:'Kühlkette',desc:'Treffer bremsen Gegner kurz um zusätzliche 4 %.',max:5},
 {id:'ember',icon:'✹',title:'Räucherkammer',desc:'Treffer glimmen nach: +8 % Schaden pro Sekunde.',max:5},
 {id:'echo',icon:'»',title:'Doppelter Boden',desc:'Jeder sechste Angriff sendet zwei schwache Echo-Schüsse.',max:4},
 {id:'rear',icon:'↤',title:'Rückendeckung',desc:'Ein Rückwärtsschuss mit 20 % Stärke je Rang.',max:4},
 {id:'guard',icon:'◈',title:'Wachsamer Mond',desc:'Schutzimpuls lädt 8 % schneller nach.',max:5},
 {id:'execute',icon:'✧',title:'Letzter Bissen',desc:'+6 % Schaden gegen Ziele unter 35 % Leben.',max:6},
 {id:'fork',icon:'⋏',title:'Splittergelage',desc:'Splitter erben Treffer-Effekte. Pro Treffer sind höchstens sieben Splitter möglich.',max:2,rare:true,requires:[['spread','pierce']]},
 {id:'cascade',icon:'ϟ',title:'Kettenreaktion',desc:'Ketten übertragen Frost und Glut.',max:3,rare:true,requires:[['chain']]},
 {id:'shatter',icon:'❄',title:'Thermischer Schock',desc:'Frost und Glut zünden gemeinsam eine Flächenexplosion.',max:2,rare:true,requires:[['frost'],['ember']]},
 {id:'echoForge',icon:'»',title:'Echokammer',desc:'Kopiert jeden vierten Angriff. Ersetzt die Echo-Schüsse von Doppelter Boden.',max:1,rare:true,requires:[['echo']]},
 {id:'orbital',icon:'◎',title:'Mondschmelze',desc:'Sonderangriffe erschaffen zwei kreisende Käsemonde.',max:2,rare:true,requires:[['guard']]},
 {id:'mastery',icon:'✦',title:'Feinschliff',desc:'+1 % zusätzlicher Waffenschaden.',max:Infinity,repeatable:true},
 {id:'tempo',icon:'ϟ',title:'Fingerfertigkeit',desc:'+1 % Sonderangriffsschaden je Rang.',max:Infinity,repeatable:true},
 {id:'cellar',icon:'∞',title:'Gläserpflege',desc:'+1 % zusätzliche Wein- und Laserdauer.',max:Infinity,repeatable:true}
];
const standardCards=new Set(['multiShot','fanShot','snakeShot','seekShot','breakShot','boomerang','carousel','bounceCrust']);
const specialCards=new Set(['charge','blast','tempo','orbital']);
const cardCodes={
 healing:'A',multiShot:'B',fanShot:'C',snakeShot:'D',seekShot:'E',breakShot:'F',
 damage:'G',charge:'H',spread:'I',critical:'J',size:'K',duration:'L',velocity:'M',
 pierce:'N',blast:'O',agility:'P',magnet:'Q',ricochet:'R',chain:'S',frost:'T',
 ember:'U',echo:'V',rear:'W',guard:'X',execute:'Y',fork:'Z',cascade:'AA',
 shatter:'AB',echoForge:'AC',orbital:'AD',mastery:'AE',tempo:'AF',cellar:'AG',boomerang:'AH',carousel:'AI',bounceCrust:'AJ'
};
const cardValues={
 fanShot:r=>2*r,
 snakeShot:(r,beam=false)=>(beam?12:24)*snakeAmplitude*r,
 seekShot:(r,beam=false)=>r?(beam?r*1.2:4+r*2)*seekSteering:0,
 breakShot:(r,hasSplit=false)=>r?r+Number(!hasSplit):0,
 damage:r=>Math.pow(1.12,r),
 charge:r=>r*.09,
 spread:r=>r?.15+r*.15:0,
 critical:r=>r*.03,
 size:r=>r*.06,
 duration:r=>r*.08,
 velocity:r=>r*.06,
 blast:r=>r*.12,
 agility:r=>r*.03,
 magnet:(r,orb=false)=>r*(orb?12:240),
 frost:r=>r*.04,
 ember:r=>r*.08,
 echo:r=>r?.3+r*.05:0,
 rear:r=>r*.2,
 guard:r=>Math.pow(.92,r),
 execute:r=>r*.06,
 fork:r=>r*2,
 cascade:r=>Math.pow(1.45,r),
 shatter:r=>r*.4,
 echoForge:r=>r?.45:0,
 orbital:r=>r?.25+r*.15:0,
 mastery:r=>r*.01,
 tempo:r=>r*.01,
 cellar:r=>r*.01
};
const numberLabel=new Intl.NumberFormat('de-DE',{maximumFractionDigits:2});
const percent=value=>numberLabel.format(100*value)+' %';
const cardEffectLabels={
 healing:()=>numberLabel.format(hearts)+' → '+numberLabel.format(heartsAfterHealing(1))+' Herzen',
 multiShot:r=>r+' Zusatzgeschosse',
 fanShot:r=>r+' Fächerschüsse',
 snakeShot:(r,rank)=>'±'+numberLabel.format(r)+' / '+numberLabel.format(cardValues.snakeShot(rank,true))+' px (Geschoss / Laser)',
 seekShot:(r,rank)=>numberLabel.format(r)+' / '+numberLabel.format(cardValues.seekShot(rank,true))+' Lenkstärke (Geschoss / Laser)',
 breakShot:(r,rank)=>r+' Splitter · '+cardValues.breakShot(rank,true)+' zusätzlich bei Waffen-Splittern',
 boomerang:r=>r?'55 % Schaden auf dem Rückweg':'Kein Rückflug',
 carousel:r=>r?'0,25 Sekunden Kreisflug':'Kein Kreisflug',
 bounceCrust:r=>r?'+1 Abpraller · Splitter mit 30 % Schaden':'Kein Splitter beim Abprallen',
 damage:r=>'+'+percent(r-1)+' Schaden',
 charge:r=>'+'+percent(r)+' Sonderangriffsschaden',
 spread:r=>percent(r)+' Schaden je Flankenschuss',
 critical:r=>'+'+numberLabel.format(100*r)+' Prozentpunkte Krit-Chance',
 size:r=>'+'+percent(r)+' Geschossgröße und Laserbreite',
 duration:r=>'+'+percent(r)+' Wein- und Laserdauer',
 velocity:r=>'+'+percent(r)+' Geschosstempo',
 pierce:r=>r+' weitere Ziele',
 blast:r=>'+'+percent(r)+' Trefferbreite bei Sonderangriffen',
 agility:r=>'+'+percent(r)+' Flugtempo',
 magnet:(r,rank)=>'+'+r+' / '+cardValues.magnet(rank,true)+' px (Flaschen / Orbs)',
 ricochet:r=>r+' Abpraller',
 chain:r=>r+' weitere Ziele',
 frost:r=>'+'+numberLabel.format(r*100)+' Prozentpunkte Frost je Treffer',
 ember:r=>'+'+percent(r)+' Trefferschaden pro Sekunde',
 echo:r=>percent(r)+' Schaden je Echo-Schuss',
 rear:r=>percent(r)+' Schaden nach hinten',
 guard:r=>'−'+percent(1-r)+' Abklingzeit des Schutzimpulses',
 execute:r=>'+'+percent(r)+' Schaden gegen geschwächte Ziele',
 fork:r=>'+'+r+' Splitter je Treffer',
 cascade:r=>'+'+percent(r-1)+' Kettenschaden',
 shatter:r=>percent(r)+' Trefferschaden als Explosion',
 echoForge:r=>r?percent(r)+' Schaden je Waffenkopie':'Keine Waffenkopie',
 orbital:r=>percent(r)+' Schaden je Käsemond',
 mastery:r=>'+'+percent(r)+' Waffenschaden',
 tempo:r=>'+'+percent(r)+' Sonderangriffsschaden',
 cellar:r=>'+'+percent(r)+' Wein- und Laserdauer'
};
function cardEffect(id,rank){
 return cardEffectLabels[id](cardValues[id]?.(rank)??rank,rank);
}
function cardPrerequisite(card){
 if(!card.requires)return '';
 return card.requires.map(group=>group.map(id=>cardDefs.find(def=>def.id===id).title).join(' oder ')).join(' + ');
}
function cardButton(card,i){
 const rank=upgrades[card.id],prerequisite=cardPrerequisite(card);
 const ranks=Number.isFinite(card.max)?' / '+card.max:' · unbegrenzt';
 const effect=card.id==='healing'?cardEffect(card.id,rank):cardEffect(card.id,rank)+' → '+cardEffect(card.id,rank+1);
 return '<button class="upgrade-card'+(card.rare?' rare':'')+'" id="card-'+i+'"><span class="card-number">'+(i+1)+'</span><span class="card-icon">'+card.icon+'</span><strong>'+cardCodes[card.id]+' · '+card.title+'</strong><span class="card-effect">'+effect+'</span><span class="card-description">'+card.desc+'</span>'+(prerequisite?'<span class="card-prerequisite">Benötigt '+prerequisite+'</span>':'')+'<span class="card-rank">Rang '+rank+' → '+(rank+1)+ranks+'</span></button>';
}
function collectedCards(){
 return cardDefs.filter(card=>upgrades[card.id]>0).map(card=>({
  code:cardCodes[card.id],title:card.title,rank:upgrades[card.id]
 }));
}
function buildDetails(){
 const cards=collectedCards();
 if(!cards.length)return '';
 const entries=cards.map(card=>'<li>'+card.code+card.rank+' · '+card.title+'</li>').join('');
 return '<details class="build-details"><summary>Gesammelte Power-ups</summary><ul>'+entries+'</ul></details>';
}
let metaLastCritical=false;
let transition=null;
let pausedFrom=null;
const transitionInterrupt={};
let state='menu', t=0, runTime=0, level=1, xp=0, xpNeeded=10, choices=[], score=0, hearts=MAX_HEARTS, player;
let orbs=[], introOrbHintShown=false;
let enemies=[], bullets=[], shots=[], pickups=[], particles=[], deaths=[], rings=[], beams=[];
let bossPickups=[];
let firstBossDefeated=false;
let rareEnemyQueue=[],nextRareEnemy=0;
let blockerPatrolDelay=0,blockerPatrolQueue=[];
const rareEnemies=[
 {name:'Sesamkrone',color:'#efba72',attack:'fan'},
 {name:'Kupferibis',color:'#f19675',attack:'dive'},
 {name:'Nazar-Auge',color:'#77c5ef',attack:'aim'},
 {name:'Lokumwürfel',color:'#f394bc',attack:'split'},
 {name:'Messingkessel',color:'#edcb82',attack:'arc'},
 {name:'Grubenmotte',color:'#c2abe8',attack:'cross'},
 {name:'Schlackenkrabbe',color:'#e98e68',attack:'mine'},
 {name:'Basarlaterne',color:'#ffdc8c',attack:'pulse'},
 {name:'Teppichrochen',color:'#80d0bc',attack:'lanes'},
 {name:'Granatapfelgeist',color:'#ee7792',attack:'scissor'}
];
let boss=null, spawn=1, spawnIndex=0, drop=8, nextBoss=300, bossCount=0, last=0, flash=0, shake=0;
let notice=0, noticeText='', levelIndex=0, secret=false, secretTime=0, golden=null, goldenAppeared=false, secondAppeared=false, secretType=0, combo=0, comboTime=0, threat=0, arcs=[], flashes=[];
let upgrades={}, selectedCard=0, lastRare=null, padPrev={}, padMove={x:0,y:0}, padBlocked=false;
const xboxButtons={0:'A',1:'B',2:'X',3:'Y',9:'Menü'};
const playStationButtons={0:'×',1:'○',2:'□',3:'△',9:'Options'};
const playStationButtonNames={0:'Kreuz',1:'Kreis',2:'Viereck',3:'Dreieck',9:'Options'};
let padId=null,padButtons=xboxButtons,lastFlightInput='keyboard';
function padHint(button){
 return '<kbd role="img" class="pad-key" data-pad-button="'+button+'"></kbd>';
}
function refreshPadHints(){
 const names=padButtons===playStationButtons?playStationButtonNames:xboxButtons;
 for(const hint of overlay.querySelectorAll?.('[data-pad-button]')||[]){
  const button=hint.dataset?.padButton;
  if(button===undefined)continue;
  hint.textContent=padButtons[button];
  hint.setAttribute('aria-label',names[button]);
 }
}
const startMenuMarkup=overlay.innerHTML;
let runMode='regular',debugSelection=0,debugOptions=[];
const metaAvailable=typeof PfertMeta!=='undefined';
let metaData=metaAvailable?PfertMeta.fresh():null, metaWarning='', metaBosses=0, metaReturn='menu', metaOverlay='', metaSelected='S1', metaZoom=.3, metaPositions={}, metaPan={x:0,y:0}, metaPanReady=false;
let metaTimePoints=0,metaSavedAt=0;
if(metaAvailable){try{const loaded=PfertMeta.load(window.localStorage);metaData=loaded.data;metaWarning=loaded.error||'';}catch(e){metaWarning='Fortschritt kann nicht dauerhaft gespeichert werden.'}}
function metaSave(){try{if(!PfertMeta.save(window.localStorage,metaData))metaWarning='Fortschritt kann nicht dauerhaft gespeichert werden.'}catch(e){metaWarning='Fortschritt kann nicht dauerhaft gespeichert werden.'}}
function bankRunTalents(bossPoints=0,finish=false){
 if(!metaAvailable||runMode!=='regular')return;
 const elapsed=runTime-metaSavedAt;
 if(!finish&&!bossPoints&&metaData.seconds+elapsed<600)return;
 const reward=PfertMeta.reward(metaData,elapsed,bossPoints);
 metaData=reward.data;
 metaTimePoints+=reward.timePoints;
 metaBosses+=reward.bossPoints;
 metaSavedAt=runTime;
 metaSave();
}
function owns(id){return !!(metaData&&metaData.purchased.includes(id))}
let metaNavigating=false,metaBStart=null,metaBLong=false;
function sellSelectedTalent(){const next=PfertMeta.sell(metaData,metaSelected);if(next){metaData=next;metaSave();renderTalents()}else if(PfertMeta.rank(metaData,metaSelected)>0){overlay.querySelector('.meta-message').textContent='Dieser Knoten kann nicht entfernt werden, solange dadurch andere gekaufte Knoten vom Start getrennt würden.'}}
function metaCount(prefix,numbers){if(!metaAvailable||!metaData)return 0;const roots=new Set(numbers.map(n=>PfertMeta.canonical(prefix+'-'+n)));return [...roots].reduce((sum,id)=>sum+(PfertMeta.limit(id)>1?PfertMeta.rank(metaData,id):Number(owns(id))),0)}
function talentReady(id){return /^S[1-5]$/.test(id)||/^Q(?:[1-9]|10)$/.test(id)||/^(?:A1|A2|A3|V1|V2|V3|K1|K2|K3|B1|B2|B3|W1|W2|W3)-(?:[1-9]|1[0-9]|2[0-3])$/.test(id)}
function showTalents(){
 if(!metaAvailable||(state!=='menu'&&state!=='over'))return;
 metaSelected=PfertMeta.nodes.find(talentReady)||'S1';
 metaReturn=state;metaOverlay=overlay.innerHTML;state='talents';metaZoom=0;metaPanReady=false;overlay.classList.remove('game-over');overlay.classList.add('talent-overlay');padBlocked=true;renderTalents();
 overlay.querySelector('[data-id="'+metaSelected+'"]')?.focus?.({preventScroll:true});
}
function talentWheelZoom(zoom,pan,x,y,delta,minZoom=.15){
 const next=clamp(zoom*Math.exp(-delta*.0015),minZoom,1.5),ratio=next/zoom;
 return {zoom:next,pan:{x:x-(x-pan.x)*ratio,y:y-(y-pan.y)*ratio}};
}
function spreadTalentNodes(ids,positions){
 const occupied=new Set(),cols=20,rows=27,stepX=70,stepY=40;
 const ordered=[...ids].sort((a,b)=>(a==='Q10'?-2:a==='S1'?-1:0)-(b==='Q10'?-2:b==='S1'?-1:0));
 for(const id of ordered){const anchor=positions[id];let best=null,bestDistance=Infinity;
  for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){const key=row*cols+col;if(occupied.has(key))continue;const x=35+col*stepX,y=20+row*stepY,d=(x-anchor.x)**2+(y-anchor.y)**2;if(d<bestDistance){bestDistance=d;best={key,x,y}}}
  if(!best)throw new Error('Nicht genügend Platz für Talentknoten');occupied.add(best.key);positions[id]={x:best.x,y:best.y};
 }
 return positions;
}
function talentTitle(id){
 return typeof PfertMetaData==='undefined'?'Talent':PfertMetaData.titles[id];
}
function talentDescription(id){
 return typeof PfertMetaData==='undefined'?'':PfertMeta.describe(metaData,id,PfertMetaData.descriptions[id]);
}
function talentIcon(id){
 if(typeof PfertMetaData==='undefined')return '';
 const paths=PfertMetaData.iconPaths[PfertMetaData.icons[id]];
 return '<svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+paths.map(path=>'<path d="'+path+'"/>').join('')+'</svg>';
}
function talentDetail(){
 const rank=PfertMeta.rank(metaData,metaSelected),limit=PfertMeta.limit(metaSelected);
 const maxed=rank>=limit;
 const label=maxed?'Maximaler Rang':metaData.points<1?'1 Punkt benötigt':'Kaufen · 1 Punkt';
 return '<div class="meta-emblem area-'+metaSelected[0]+'">'+talentIcon(metaSelected)+'</div>'+
  '<span class="meta-rank">Rang '+rank+' / '+limit+'</span>'+
  '<h3>'+talentTitle(metaSelected)+'</h3>'+
  '<p class="meta-description">'+talentDescription(metaSelected)+'</p>'+
  '<button id="meta-buy" aria-disabled="'+(maxed||metaData.points<1)+'">'+label+'</button>';
}
function renderTalents(){
 const positions={};
 for(let i=1;i<=5;i++)positions['S'+i]={x:1190+(i-3)*75,y:700};
 const groups=['A1','A2','A3','V1','V2','V3','K1','K2','K3','B1','B2','B3','W1','W2','W3'];
 const offsets={1:[0,0],2:[1,0],3:[2,0],4:[3,0],5:[4,0],6:[5,-35],7:[6,-35],8:[7,-35],9:[8,-35],10:[9,-35],11:[10,-55],12:[11,-55],13:[12,-55],14:[10,-15],15:[11,-15],16:[12,-15],17:[5,35],18:[6,35],19:[7,35],20:[8,35],21:[9,20],22:[10,20],23:[9,55]};
 const centers=[[810,640],[900,540],[990,300],[1100,200],[1220,350],[1330,480],[1460,450],[1580,350],[1700,300],[1780,430],[1650,550],[1500,690],[1280,740],[1000,790],[800,830]];
 const shuffle=[7,0,11,4,13,1,9,5,14,2,12,6,10,3,8];
 groups.forEach((id,i)=>{const [cx,cy]=centers[shuffle[i]];for(let n=1;n<=23;n++){const [x,dy]=offsets[n];positions[id+'-'+n]={x:cx+(x-6)*24,y:cy+dy*1.05}}});
 PfertMeta.edges.forEach(([a,b])=>{if(a[0]==='Q'&&!positions[a]){const other=PfertMeta.edges.find(([c,d])=>(c===a&&d!==b)||(d===a&&c!==b));const end=other&&(other[0]===a?other[1]:other[0]);if(end&&positions[b]&&positions[end])positions[a]={x:(positions[b].x+positions[end].x)/2,y:(positions[b].y+positions[end].y)/2}}});
 for(let i=1;i<=10;i++)if(!positions['Q'+i]){const connected=PfertMeta.edges.filter(e=>e.includes('Q'+i)).map(e=>e[0]==='Q'+i?e[1]:e[0]);const a=positions[connected[0]],b=positions[connected[1]];positions['Q'+i]={x:(a.x+b.x)/2,y:(a.y+b.y)/2}}
 for(let i=1;i<=10;i++){const id='Q'+i,neighbors=PfertMeta.edges.filter(e=>e.includes(id)).map(e=>e[0]===id?e[1]:e[0]);if(neighbors.length===2){const a=positions[neighbors[0]],b=positions[neighbors[1]];positions[id]={x:(a.x+b.x)/2,y:(a.y+b.y)/2}}}
 positions.Q10={x:1150,y:820};
 for(const pos of Object.values(positions))pos.x-=550;
 spreadTalentNodes(PfertMeta.nodes,positions);
 metaPositions=positions;
 const revealed=new Set(['S1']);for(const id of PfertMeta.nodes)if(PfertMeta.rank(metaData,id)>0)revealed.add(id);for(const [a,b] of PfertMeta.edges){if(PfertMeta.rank(metaData,a)>0)revealed.add(b);if(PfertMeta.rank(metaData,b)>0)revealed.add(a)}
 const lines=PfertMeta.edges.filter(([a,b])=>revealed.has(a)&&revealed.has(b)&&(PfertMeta.rank(metaData,a)>0||PfertMeta.rank(metaData,b)>0)).map(([a,b])=>'<line class="'+(PfertMeta.rank(metaData,a)>0&&PfertMeta.rank(metaData,b)>0?'meta-edge-owned':'meta-edge-open')+'" x1="'+positions[a].x+'" y1="'+positions[a].y+'" x2="'+positions[b].x+'" y2="'+positions[b].y+'"/>').join('');
 const nodes=PfertMeta.nodes.filter(id=>revealed.has(id)).map(id=>{
  const p=positions[id],rank=PfertMeta.rank(metaData,id),limit=PfertMeta.limit(id);
  const status=limit>1?rank+'/'+limit:rank?'✓':'';
  return '<button class="meta-node area-'+id[0]+(rank?' owned':' available')+(id===metaSelected?' selected':'')+'" data-id="'+id+
   '" style="left:'+p.x+'px;top:'+p.y+'px" aria-label="'+talentTitle(id)+' · '+(limit>1?'Rang '+status:rank?'Gekauft':'Verfügbar')+'">'+
   talentIcon(id)+'<span aria-hidden="true">'+status+'</span></button>';
 }).join('');
 overlay.innerHTML=
  '<header class="meta-toolbar">'+
   '<button id="meta-back">‹ Zurück</button>'+
   '<h2>Talentbaum</h2>'+
   '<span class="meta-points"><b>'+metaData.points+'</b> Talentpunkte</span>'+
  '</header>'+
  '<div class="meta-layout">'+
   '<div class="meta-chart">'+
    '<div id="meta-viewport" class="meta-viewport" aria-label="Talentpfade">'+
     '<div class="meta-map"><div class="meta-world">'+
      '<svg class="meta-paths" width="1400" height="1100" aria-hidden="true">'+
       '<svg x="0" y="0" width="1400" height="1100" viewBox="0 0 336 264">'+
        '<image class="horse-silhouette" href="assets/horse-v2.png" x="0" y="0" width="672" height="264"/>'+
       '</svg>'+lines+
      '</svg>'+nodes+
     '</div></div>'+
    '</div>'+
    '<div class="meta-zoom" role="group" aria-label="Zoom">'+
     '<button id="meta-minus" aria-label="Verkleinern">−</button>'+
     '<output class="meta-scale" aria-label="Zoomstufe"></output>'+
     '<button id="meta-plus" aria-label="Vergrößern">+</button>'+
    '</div>'+
   '</div>'+
   '<aside class="meta-panel" aria-label="Talentdetails">'+
    '<div class="meta-detail">'+talentDetail()+'</div>'+
    '<p class="meta-message" role="status">'+metaWarning+'</p>'+
    '<div class="meta-management">'+
     '<button id="meta-refund">Neu verteilen</button>'+
     '<button id="meta-reset">Fortschritt löschen</button>'+
    '</div>'+
   '</aside>'+
  '</div>'+
  '<footer class="meta-controls">'+
   '<span><kbd>↑ ↓ ← →</kbd> / Steuerkreuz wählen</span>'+
   '<span><kbd>Enter</kbd> / '+padHint(0)+' kaufen</span>'+
   '<span>Rechtsklick / '+padHint(1)+' zurückgeben</span>'+
   '<span>Mausrad zoomen · Ziehen verschieben</span>'+
   '<span><kbd>Esc</kbd> / '+padHint(1)+' halten zurück</span>'+
  '</footer>';
 refreshPadHints();
 const viewport=document.getElementById('meta-viewport');
 const map=viewport.querySelector('.meta-map'),world=map.querySelector('.meta-world'),scale=overlay.querySelector('.meta-scale');
 const fitZoom=()=>Math.max(.05,Math.min(viewport.clientWidth/1400,viewport.clientHeight/1100));
 const centerMap=()=>({x:(viewport.clientWidth-1400*metaZoom)/2,y:(viewport.clientHeight-1100*metaZoom)/2});
 const place=()=>{
  map.style.left=metaPan.x+'px';
  map.style.top=metaPan.y+'px';
 };
 const updateZoom=()=>{
  world.style.transform='scale('+metaZoom+')';
  scale.textContent=Math.round(metaZoom*100)+' %';
  place();
 };
 if(!metaPanReady){
  metaZoom=fitZoom();
  metaPan=centerMap();
  metaPanReady=true;
 }
 updateZoom();
 const tip=document.createElement('div');
 tip.className='meta-tooltip';
 tip.hidden=true;
 overlay.appendChild(tip);
 const zoomAt=(x,y,delta)=>{
  const minimum=fitZoom();
  const result=talentWheelZoom(metaZoom,metaPan,x,y,delta,minimum);
  metaZoom=result.zoom;
  metaPan=metaZoom===minimum?centerMap():result.pan;
  tip.hidden=true;
  updateZoom();
 };
 let drag=null;
 viewport.addEventListener('pointerdown',e=>{
  if(e.button!==0||e.target.closest('.meta-node'))return;
  drag={x:e.clientX,y:e.clientY,px:metaPan.x,py:metaPan.y};
  viewport.setPointerCapture(e.pointerId);
  viewport.classList.add('dragging');
  tip.hidden=true;
 });
 viewport.addEventListener('pointermove',e=>{
  if(!drag)return;
  metaPan={x:drag.px+e.clientX-drag.x,y:drag.py+e.clientY-drag.y};
  place();
 });
 viewport.addEventListener('lostpointercapture',()=>{
  drag=null;
  viewport.classList.remove('dragging');
 });
 viewport.addEventListener('wheel',e=>{
  e.preventDefault();
  const bounds=viewport.getBoundingClientRect();
  const delta=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?viewport.clientHeight:1);
  zoomAt(e.clientX-bounds.left,e.clientY-bounds.top,delta);
 },{passive:false});
 overlay.querySelectorAll('.meta-node').forEach(button=>{
  const show=()=>{
   const node=button.getBoundingClientRect(),panel=overlay.getBoundingClientRect();
   const id=button.dataset.id;
   tip.textContent=talentTitle(id)+' · '+talentDescription(id);
   tip.hidden=false;
   const center=node.left+node.width/2-panel.left;
   tip.style.left=clamp(center,tip.offsetWidth/2+8,panel.width-tip.offsetWidth/2-8)+'px';
   const above=node.top-panel.top-8;
   const top=above>=tip.offsetHeight?above-tip.offsetHeight:node.bottom-panel.top+8;
   tip.style.top=clamp(top,8,Math.max(8,panel.height-tip.offsetHeight-8))+'px';
  };
  const hide=()=>tip.hidden=true;
  button.addEventListener('mouseenter',show);
  button.addEventListener('focus',show);
  button.addEventListener('mouseleave',hide);
  button.addEventListener('blur',hide);
 });
 overlay.querySelectorAll('.meta-node').forEach(button=>button.addEventListener('click',()=>{
  metaSelected=button.dataset.id;
  overlay.querySelector('.meta-detail').innerHTML=talentDetail();
  overlay.querySelector('.meta-message').textContent=metaWarning;
  refreshPadHints();
  overlay.querySelectorAll('.meta-node').forEach(n=>n.classList.toggle('selected',n.dataset.id===metaSelected));
  document.getElementById('meta-buy').addEventListener('click',buySelected);
 }));
 function buySelected(){if(!talentReady(metaSelected))return;const next=PfertMeta.buy(metaData,metaSelected);if(next){metaData=next;metaSave();renderTalents()}}
 overlay.querySelectorAll('.meta-node').forEach(button=>{button.addEventListener('click',()=>{if(!metaNavigating)buySelected()});button.addEventListener('contextmenu',e=>{e.preventDefault();metaSelected=button.dataset.id;sellSelectedTalent()})});
 document.getElementById('meta-buy').addEventListener('click',buySelected);
 const zoomSelected=delta=>{
  const selected=metaPositions[metaSelected];
  const x=metaPan.x+selected.x*metaZoom,y=metaPan.y+selected.y*metaZoom;
  const visible=x>=0&&x<=viewport.clientWidth&&y>=0&&y<=viewport.clientHeight;
  zoomAt(visible?x:viewport.clientWidth/2,visible?y:viewport.clientHeight/2,delta);
 };
 document.getElementById('meta-minus').addEventListener('click',()=>zoomSelected(180));
 document.getElementById('meta-plus').addEventListener('click',()=>zoomSelected(-180));
 document.getElementById('meta-refund').addEventListener('click',()=>{metaData=PfertMeta.refund(metaData);metaSave();renderTalents()});
 document.getElementById('meta-reset').addEventListener('click',()=>{if(window.confirm('Gesamten Talentfortschritt unwiderruflich löschen?')){metaData=PfertMeta.fresh();metaSave();renderTalents()}});
 document.getElementById('meta-back').addEventListener('click',()=>{
  state=metaReturn;
  overlay.classList.remove('talent-overlay');
  if(state==='over')overlay.classList.add('game-over');
  overlay.innerHTML=metaOverlay;
  bindHomeControls();
  padBlocked=true;
 });
}
function moveTalent(dx,dy){
 const p=metaPositions[metaSelected];if(!p)return;
 const neighbors=PfertMeta.edges.filter(edge=>edge.includes(metaSelected)).map(edge=>edge[0]===metaSelected?edge[1]:edge[0]).filter(id=>overlay.querySelector('[data-id="'+id+'"]'));
 const choices=neighbors.map(id=>{const q=metaPositions[id],x=q.x-p.x,y=q.y-p.y,forward=x*dx+y*dy;return {id,forward,score:forward>0?Math.hypot(x,y)/forward*Math.hypot(x,y):Infinity}}).filter(c=>c.forward>0).sort((a,b)=>a.score-b.score);
 if(!choices.length)return;const node=overlay.querySelector('[data-id="'+choices[0].id+'"]');if(node){metaNavigating=true;try{node.click()}finally{metaNavigating=false}const view=document.getElementById('meta-viewport');const pos=metaPositions[choices[0].id];metaPan={x:view.clientWidth/2-pos.x*metaZoom,y:view.clientHeight/2-pos.y*metaZoom};const map=view.querySelector('.meta-map');map.style.left=metaPan.x+'px';map.style.top=metaPan.y+'px';node.focus()}
}
if(metaAvailable){const button=document.getElementById('talents');if(button)button.addEventListener('click',showTalents)}
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
function addRage(amount,graze=false){if(!player||player.overdrive>0||player.metaRageLock>0)return;const before=player.rage;const rate=(1+.0075*metaCount('K2',[1,2,3,4,6,7,8,9])+.015*(metaCount('K3',[11,12,14,15,17,18,19])+2*Number(owns('K3-21')))+(graze?.015*metaCount('K3',[1,2,3,4,6,7,8,9]):0))*(owns('S3')?1.03:1)*(owns('K1-23')?.85:1)*(owns('K2-23')?.8:1);player.rage=clamp(player.rage+amount*.5*rate,0,100);if(before<100&&player.rage>=100){sound('ready');notice=2;noticeText='KÄSERAUSCH BEREIT · Q'}}
function activateRage(){if(state!=='playing'||player.rage<100||player.overdrive>0)return false;player.rage=0;player.overdrive=rageBaseDuration*(1+.03*metaCount('K1',[5,10])+.03*metaCount('K2',[5,10])+.015*(metaCount('K2',[11,12,14,15,17,18,19])+2*Number(owns('K2-21'))))*(owns('K2-23')?1.525:1);player.metaRageMax=player.overdrive;player.metaAfterglow=0;player.metaLightning=1;heal(2);player.inv=Math.max(player.inv,owns('K3-13')?.75:.65);shots=shots.filter(s=>s.x+s.w/2<0||s.x-s.w/2>W||s.y+s.h/2<62||s.y-s.h/2>H);if(owns('K3-22'))player.inv=Math.max(player.inv,1.5);if(owns('K3-23')){player.inv=Math.max(player.inv,3);player.metaRageLock=player.overdrive+5}for(const e of enemies){if(e.hp>0&&e.x+e.w/2>=0&&e.x-e.w/2<=W&&e.y+e.h/2>=62&&e.y-e.h/2<=H){e.hp=0;death(e)}}enemies=enemies.filter(e=>e.hp>0);ring(player.x,player.y,'#b6f8ff',180);flashes.push({x:player.x,y:player.y,r:100,life:.15,maxLife:.15});shake=4;notice=2;noticeText='KÄSERAUSCH!';sound('overdrive');return true}

function clock(s){return String(Math.floor(s/60)).padStart(2,'0')+':'+String(Math.floor(s%60)).padStart(2,'0')}
function sound(kind,strong=false){if(typeof PfertSound!=='undefined')PfertSound.play(kind,strong)}
function reset(){startRun('regular')}
function startRun(mode){
 runMode=mode;
 if(typeof PfertSound!=='undefined'){PfertSound.wake();PfertSound.startMusic()}
 transition=null;t=0;runTime=0;metaBosses=0;metaTimePoints=0;metaSavedAt=0;level=1;xp=owns('B1-13')?2:0;xpNeeded=10;orbs=[];choices=[];score=0;hearts=MAX_HEARTS;lastRare=null;
 upgrades=Object.fromEntries(cardDefs.map(card=>[card.id,0]));
 player={x:135,y:H/2,w:40,h:29,inv:0,effects:Array(16).fill(0),weapon:-1,charge:0,charging:false,specials:owns('W1-23')?2:3,specialCount:0,freeSpecialUsed:false,bossSpecialUsed:false,autoCooldown:0,autoAttacks:0,podSide:1,podCooldown:0,muzzle:0,guardFlash:0,attacks:0,rage:owns('K2-13')?15:0,overdrive:0,metaAfterglow:0,chargeCue:false,readyCue:false};
 player.fieldPower={dropIn:rand(45,65),queue:[],rockets:0,launchCooldown:0,shield:0,shieldTime:0,beamTime:0};
 enemies=[];bullets=[];shots=[];pickups=[];bossPickups=[];particles=[];deaths=[];rings=[];beams=[];
 boss=null;firstBossDefeated=false;rareEnemyQueue=[];nextRareEnemy=rand(120,145);spawn=1;spawnIndex=0;drop=8;nextBoss=300;bossCount=0;flash=0;shake=0;levelIndex=0;
 blockerPatrolDelay=rand(95,120);blockerPatrolQueue=[];
 secret=false;secretTime=0;secretType=0;golden=null;goldenAppeared=false;secondAppeared=false;combo=0;comboTime=0;threat=0;arcs=[];flashes=[];notice=3;noticeText=levels[0];
 keys.clear();state='playing';overlay.classList.add('hidden');overlay.classList.remove('upgrade-overlay');overlay.classList.remove('game-over');overlay.classList.remove('debug-overlay');
}
function cancelCharge(){keys.clear();if(player){player.charging=false;player.charge=0}}
function pauseGame(){
 if(state!=='playing'&&state!=='transition')return;
 pausedFrom=state;
 state='paused';
 cancelCharge();
 padBlocked=true;padMove={x:0,y:0};
 overlay.innerHTML='<h2 id="pause-title">Pause</h2><button id="resume">Fortsetzen</button>'+
  '<label class="music-volume">Musiklautstärke <input id="music-volume" type="range" min="0" max="100" step="1"></label>'+
  '<p class="hint">Esc oder Controller '+padHint(9)+' zum Fortsetzen</p>';
 refreshPadHints();
 overlay.classList.remove('hidden');
 overlay.classList.add('pause-overlay');
 const resume=document.getElementById('resume');
 const volume=document.getElementById('music-volume');
 volume.value=Math.round((typeof PfertSound==='undefined' ? .32 : PfertSound.musicVolume)*100);
 volume.addEventListener('input',()=>{if(typeof PfertSound!=='undefined')PfertSound.musicVolume=Number(volume.value)/100});
 resume.addEventListener('click',resumeGame);
 resume.focus?.({preventScroll:true});
}
function resumeGame(){
 if(state!=='paused')return;
 state=pausedFrom;
 pausedFrom=null;
 cancelCharge();
 padBlocked=true;padMove={x:0,y:0};
 last=0;
 overlay.classList.add('hidden');
 overlay.classList.remove('pause-overlay');
}
function pauseOnFocusLoss(){
 cancelCharge();
 padBlocked=true;padMove={x:0,y:0};
 pauseGame();
}
function bindHomeControls(){
 refreshPadHints();
 document.getElementById(state==='menu'?'start':'again')?.addEventListener('click',reset);
 document.getElementById('talents')?.addEventListener('click',showTalents);
}
function goToStartMenu(){
 if(typeof PfertSound!=='undefined')PfertSound.stopMusic();
 state='menu';runMode='regular';player=null;boss=null;
 overlay.classList.remove('game-over','debug-overlay','hidden');
 overlay.innerHTML=startMenuMarkup;
 cancelCharge();padBlocked=true;bindHomeControls();
}
function selectDebugOption(direction){
 debugSelection=(debugSelection+direction+debugOptions.length)%debugOptions.length;
 debugOptions.forEach((option,i)=>document.getElementById(option.id)?.classList.toggle?.('debug-selected',i===debugSelection));
}
function startDebugRun(){
 startRun('debug');
 padBlocked=true;
 notice=4;noticeText='DEBUG · NUM 1–4';
}
function debugBossJump(which){
 boss=null;golden=null;enemies=[];shots=[];bullets=[];beams=[];cancelCharge();player.inv=2;
 if(which<=2){
  secret=false;secretType=0;secretTime=0;bossCount=which-1;
  nextBoss=Math.max(t,nextBoss);startBoss(which===1);
 }else{
  secret=true;secretType=which-2;secretTime=secretType===1?45:60;startRuhrBoss();
 }
}
function finishUnranked(){
 state='debugResult';boss=null;shots=[];
 cancelCharge();padBlocked=true;
 overlay.classList.remove('hidden','upgrade-overlay','game-over');
 overlay.classList.add('debug-overlay');
 const title='Debug-Runde beendet';
 const recap=clock(runTime);
 const lastHit=typeof damageSummary==='function'?damageSummary():'';
 overlay.innerHTML='<h2>'+title+'</h2><p>'+recap+'</p>'+lastHit+
  '<div class="debug-actions"><button id="debug-retry">Erneut starten</button><button id="debug-exit">Hauptmenü</button></div>';
 debugOptions=[
  {id:'debug-retry',action:startDebugRun},
  {id:'debug-exit',action:goToStartMenu}];
 debugSelection=0;selectDebugOption(0);
 for(const option of debugOptions)document.getElementById(option.id).addEventListener('click',option.action);
}
bindHomeControls();
window.addEventListener('keydown',e=>{
 if(e.code==='KeyM'||e.code==='KeyN'){
  if(e.repeat)return;
  if(e.code==='KeyN'){
   if(typeof PfertSound!=='undefined')noticeText=PfertSound.toggleMusic()?'MUSIK AN':'MUSIK AUS';
  }else if(typeof PfertSound!=='undefined'){
   noticeText=PfertSound.toggle()?'SOUNDEFFEKTE AUS':'SOUNDEFFEKTE AN';
  }
  notice=1;return;
 }
 if(state==='paused'){
  if(e.code==='Escape'||e.code==='Enter'){e.preventDefault();if(!e.repeat)resumeGame()}
  return;
 }
 if((state==='playing'||state==='transition')&&e.code==='Escape'){
  e.preventDefault();if(!e.repeat)pauseGame();return;
 }
 if(!e.repeat&&(state==='menu'||state==='over')){
  if(e.code==='F9'&&e.shiftKey){e.preventDefault();startDebugRun();return}
 }
 if(state==='debugResult'){
  if(e.repeat)return;
  if(e.code==='Escape'){goToStartMenu();e.preventDefault()}
  else if(e.code==='Enter'){
   if(e.target?.tagName!=='BUTTON'){e.preventDefault();debugOptions[debugSelection].action()}
  }else if(['ArrowDown','ArrowRight','ArrowUp','ArrowLeft'].includes(e.code)){
   e.preventDefault();selectDebugOption(e.code==='ArrowDown'||e.code==='ArrowRight'?1:-1);
   document.getElementById(debugOptions[debugSelection].id)?.focus?.();
  }
  return;
 }
 if(!e.repeat&&runMode==='debug'&&state==='playing'&&/^Numpad[1-4]$/.test(e.code)){
  e.preventDefault();debugBossJump(Number(e.code.slice(-1)));return;
 }
 if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','KeyW','KeyA','KeyS','KeyD'].includes(e.code))e.preventDefault();
 if(state==='transition')return;
 if(state==='talents'){if(!e.repeat){if(e.code==='ArrowLeft')moveTalent(-1,0);else if(e.code==='ArrowRight')moveTalent(1,0);else if(e.code==='ArrowUp')moveTalent(0,-1);else if(e.code==='ArrowDown')moveTalent(0,1);else if(e.code==='Enter'&&!e.target?.closest?.('button:not(.meta-node)')){e.preventDefault();document.getElementById('meta-buy').click()}else if(e.code==='Escape')document.getElementById('meta-back').click()}return}
 if(state==='upgrade'){if(!e.repeat){if(/^Digit[123]$/.test(e.code))chooseCard(Number(e.code.slice(-1))-1);else if(['ArrowLeft','ArrowRight','KeyA','KeyD'].includes(e.code))selectCard(selectedCard+((e.code==='ArrowRight'||e.code==='KeyD')?1:-1));else if(e.code==='Enter'||e.code==='Space')chooseCard(selectedCard)}return}
 if(state==='playing'&&/^(?:Space|Key[WASDQ]|Arrow(?:Up|Down|Left|Right))$/.test(e.code))lastFlightInput='keyboard';
 keys.add(e.code);
 if(e.code==='Space'&&!e.repeat&&state==='playing')fireSpecial();
 if(e.code==='KeyQ'&&!e.repeat)activateRage();
 if(e.code==='KeyT'&&!e.repeat&&(state==='menu'||state==='over'))showTalents();

 if(e.code==='Enter'&&(state==='menu'||state==='over'))reset();
});
window.addEventListener('keyup',e=>{
 keys.delete(e.code);
});
window.addEventListener('blur',pauseOnFocusLoss);
document.addEventListener?.('visibilitychange',()=>{if(document.hidden)pauseOnFocusLoss()});
function drawCard(pool){
 const weights=pool.map(card=>specialCards.has(card.id)?1:4);
 let roll=rand(0,weights.reduce((sum,weight)=>sum+weight,0));
 const index=weights.findIndex(weight=>(roll-=weight)<0);
 return pool.splice(index,1)[0];
}
function offerCards(){
 const canHeal=heartsAfterHealing(1)>hearts;
 const pool=cardDefs.filter(card=>!card.repeatable&&!card.rare&&upgrades[card.id]<card.max&&(card.id!=='healing'||canHeal));
 const rarePool=cardDefs.filter(card=>card.rare&&runTime>=120&&upgrades[card.id]<card.max&&card.requires.every(group=>group.some(id=>upgrades[id]>0)));
 if(pool.length<3)pool.push(...cardDefs.filter(card=>card.repeatable));
 if(pool.length===0)return
 choices=[];
 if(rarePool.length){
  const weighted=rarePool.flatMap(card=>Array(card.id===lastRare?1:3).fill(card));
  const rare=weighted[Math.floor(rand(0,weighted.length))];
  if(!specialCards.has(rare.id)||Math.random()<.25){choices.push(rare);lastRare=rare.id}
 }
 while(choices.length<3&&pool.length){
  const standard=choices.length===2&&!choices.some(card=>standardCards.has(card.id))?pool.filter(card=>standardCards.has(card.id)):[];
  choices.push(drawCard(standard.length?standard:pool));
 }
 state='upgrade';selectedCard=0;padBlocked=true;cancelCharge();overlay.classList.remove('hidden');overlay.classList.add('upgrade-overlay');
 sound('levelUp');
 overlay.innerHTML='<h2>Verbesserung wählen</h2><div class="cards">'+choices.map(cardButton).join('')+'</div><p class="hint">Klicken, 1 / 2 / 3 oder Pfeile / A D + Enter / Leertaste · Controller: Steuerkreuz + '+padHint(0)+'</p>';
 refreshPadHints();
 choices.forEach((_,i)=>document.getElementById('card-'+i).addEventListener('click',()=>chooseCard(i)));selectCard(0);
}
function selectCard(i){if(!choices.length)return;selectedCard=(i+choices.length)%choices.length;choices.forEach((_,j)=>{const el=document.getElementById('card-'+j);if(el.classList.toggle)el.classList.toggle('selected',j===selectedCard)});}
function chooseCard(i){
 if(state!=='upgrade'||!choices[i])return;
 const card=choices[i];upgrades[card.id]++;if(card.id==='healing')heal(1);sound(card.rare?'synergy':'card');xp-=xpNeeded;level++;xpNeeded=Math.min(1500,Math.ceil(xpNeeded*(level<10?1.5:1.12)));choices=[];state='playing';cancelCharge();
 overlay.classList.add('hidden');overlay.classList.remove('upgrade-overlay');notice=2.4;noticeText=card.title.toUpperCase()+' · RANG '+upgrades[card.id];if(xp>=xpNeeded)offerCards();
}
function activeWeapon(){
 if(player.weapon>=0)return player.effects[player.weapon]>0?player.weapon:-1;
 return player.effects.findIndex(v=>v>0);
}
function hit(a,b){return Math.abs(a.x-b.x)<(a.w+b.w)/2&&Math.abs(a.y-b.y)<(a.h+b.h)/2}
function chargeLimit(){return Math.max(.25,1.5*Math.pow(.91,upgrades.charge)*Math.pow(.99,upgrades.tempo))}
function damage(base,hasWine=activeWeapon()>=0){const rageBonus=.015*(metaCount('K1',[1,2,3,4,6,7,8,9,11,12,14,15,17,18,19])+2*Number(owns('K1-21')));const active=player.overdrive>0,after=player.metaAfterglow>0;const rageFactor=active?1.35*(1+rageBonus)*(owns('K2-20')&&player.metaRageMax-player.overdrive<2?1.15:1):after?1.35:1;const low=hearts<=2?1+.015*metaCount('V3',[1,2,3,4,6,7,8,9])+(owns('V3-13')?.15:0)+(owns('V3-23')?.60:0)+(hearts<=1&&owns('V3-22')?.225:0):1;metaLastCritical=Math.random()<Math.min(1,cardValues.critical(upgrades.critical)+.015*metaCount('A2',[5,10])+(owns('A2-22')?.06:0));const criticalFactor=metaLastCritical?2+.03*(metaCount('A2',[11,12,14,15,17,18,19])+2*Number(owns('A2-21')))+(owns('A2-23')?.75:0):(owns('A2-23')?.85:1);return 1.5*playerHitDamage*base*(owns('S1')?1.03:1)*cardValues.damage(upgrades.damage)*(1+cardValues.mastery(upgrades.mastery))*rageFactor*low*(owns('Q10')&&active?1.5:1)*(1+(owns('Q1')?.045:0)+(player.metaRevenge>0?.15:0))*(hasWine?1+.03*metaCount('W2',[5,10])+.015*(metaCount('W2',[11,12,14,15,17,18,19])+2*Number(owns('W2-21'))):1)*criticalFactor}
function heartsAfterHealing(amount){
 if(owns('V3-23')&&hearts<=2)amount=Math.round(amount)*.5;
 return Math.min(MAX_HEARTS,hearts+amount);
}
function heal(amount){hearts=heartsAfterHealing(amount)}
function particle(x,y,col,n=7,speed=1){
 for(let i=0;i<n&&particles.length<260;i++){let life=rand(.2,.6);particles.push({x,y,vx:rand(-150,150)*speed,vy:rand(-150,150)*speed,life,maxLife:life,col,size:rand(1.5,4)})}
}
function ring(x,y,col,size=35){if(rings.length<22)rings.push({x,y,col,size,life:.4,maxLife:.4})}
function impact(x,y,col,n=7){particle(x,y,col,n);ring(x,y,col,20);shake=Math.max(shake,.7)}
function dropOrb(x,y,value,speed=32.5,kind='normal',tier=1){orbs.push({x:clamp(x,22,W-22),y:clamp(y,85,H-22),w:16,h:16,value,speed,age:0,kind,tier});}
function enemySpeed(e){const paused=e.i===3&&e.age%3>1.25&&e.age%3<2.05;const charge=e.i===6&&e.age%3>1.1&&e.age%3<1.55?180:0;return ((paused?0:e.speed)+charge)*(1-(e.slow||0));}
function death(e){
 if(owns('A3-22')&&e.burnLife>0){const amount=(e.metaLastDamage||0)*.30*(owns('A3-23')?1.75:1);ring(e.x,e.y,'#ffb483',67.5);for(const target of enemies)if(target!==e&&target.hp>0&&Math.hypot(target.x-e.x,target.y-e.y)<67.5)damageEnemy(target,amount,target.x,target.y)}
 const baseXp=e.rareEnemy?4:[1,1,1,2,2,2,3,3,3,4][e.i];
 dropOrb(e.x,e.y,baseXp*(e.elite?2:1)*(player.overdrive>0&&owns('K3-16')?1.12:1),enemySpeed(e)/2,e.elite?'elite':'normal',Math.min(3,baseXp));
 if(e.introSimit&&!introOrbHintShown){
  introOrbHintShown=true;
  notice=3;
  noticeText='ORBS FÜLLEN DIE KARTENLEISTE';
 }
 sound('explode',{type:e.i,elite:e.elite,x:e.x});addRage((e.elite?9:3)+(e.lastCharged?2:0));
 combo++;comboTime=4;score+=Math.round((100+e.i*35)*(e.elite?1.5:1)*(1+Math.min(2,combo*.04))*(e.lastCharged?1.2:1));deaths.push({...e,age:0,life:.72,secret,rotation:rand(-.6,.6)});
 if(deaths.length>28)deaths.shift();
 particle(e.x,e.y,e.rareEnemy?.color||colors[e.i%5],28,1.5);ring(e.x,e.y,'#ffcf7c',64);flashes.push({x:e.x,y:e.y,r:e.elite?60:40,life:.14,maxLife:.14});shake=Math.max(shake,2.2);
 if(e.bazaarWave){
  const wave=e.bazaarWave;
  e.bazaarWave=null;
  wave.defeated++;
  awardBazaarWave(wave);
 }
}
function shouldSpawnPickup(i,roll){return i===5||i===16||roll<.4}
const weaponWineTypes=styles.flatMap((style,i)=>style?[i]:[]);
function spawnPickup(i,y=rand(105,475)){
 const w=30;
 pickups.push({x:W+w/2+25,y,i,w,h:42,age:0});
}
const fieldPowerups={
 rockets:{name:'Suchraketen',color:'#ffcd6d',icon:'↗'},
 shield:{name:'Schutzschild',color:'#93fce0',icon:'⬡'},
 sweeper:{name:'Räumstrahl',color:'#c1a6ff',icon:'ϟ'}
};
function updateFieldPowerupSpawns(dt){
 if(secret||boss)return;
 const power=player.fieldPower;
 power.dropIn-=dt;
 if(power.dropIn>0)return;
 if(!power.queue.length)power.queue=Object.keys(fieldPowerups);
 const [type]=power.queue.splice(Math.floor(rand(0,power.queue.length)),1);
 spawnPickup(type);
 power.dropIn=rand(45,65);
}
function updatePickupSpawns(dt){
 drop-=dt;
 if(drop<=0){
  const i=Math.floor(rand(0,17));
  if(shouldSpawnPickup(i,Math.random()))spawnPickup(i);
  drop=rand(12,19);
 }
 if(secret||boss||t<45||t>=introDuration||player.weaponWineSeen||player.metaWeaponFound)return;
 if(pickups.some(p=>styles[p.i]&&!p.dead))return;
 const i=weaponWineTypes[Math.floor(rand(0,weaponWineTypes.length))];
 spawnPickup(i,clamp(player.y,120,460));
 player.weaponWineSeen=true;
}
function attackElements(charged=false){const base=weaponElements[activeWeapon()];return {frost:Math.min(.65,(base==='frost'?(charged?.4:.25):0)+cardValues.frost(upgrades.frost)),fire:(base==='fire'?.28:0)+cardValues.ember(upgrades.ember),lightning:base==='lightning',earth:base==='earth',chainBonus:upgrades.chain,forkBonus:cardValues.fork(upgrades.fork)}}
const bulletLimit=360;
function addBullet(angle,style,charged,power,scale=1,offset=0){
 if(bullets.length>=bulletLimit)return null;
 const size=(charged?22+power*18:style==='normal'?14:11)*(1+cardValues.size(upgrades.size))*Math.sqrt(scale);
 const velocity=(charged?650+power*170:470)+(style==='speed'?260:0);
 const b={x:player.x+28-offset,y:player.y-2,vx:velocity*Math.cos(angle)*(1+cardValues.velocity(upgrades.velocity)),vy:velocity*Math.sin(angle)*(1+cardValues.velocity(upgrades.velocity)),w:size,h:size,damage:damage((charged?2+power*4.5:1)*scale),metaCritical:metaLastCritical,charged,style,pierce:['port','speed','wave','saw','vortex','phoenix'].includes(style),remaining:upgrades.pierce,bounces:upgrades.ricochet,hit:new Set(),age:0,life:3.5,blast:charged&&(style==='red'||upgrades.blast>0),homing:style==='rose',elements:attackElements(charged)};
 bullets.push(b);return b;
}
function mutateStandardShot(b){
 if(!b)return;
 if(upgrades.carousel){
  b.carousel=true;b.orbit=.25;b.orbitRadius=38;
  b.orbitSpeed=Math.PI*2/b.orbit;
  b.orbitOffset=(b.y-player.y+2)*.25;
  b.phase=Math.atan2(b.vy,b.vx);
 }
 if(upgrades.boomerang)b.boomerangAt=(b.orbit||0)+.5;
 if(upgrades.bounceCrust){b.bounces++;b.crust=true}
}
function turnBoomerang(b){
 b.returning=true;
 b.vx=-Math.abs(b.vx);b.vy=-b.vy;
 b.damage*=.55;
 b.hit.clear();
}
function finishProjectileHit(b,target){
 if(b.boomerangAt&&!b.returning){b.returnContact=target;return true}
 if(!b.pierce){if(b.remaining>0)b.remaining--;else b.dead=true}
 return b.dead;
}
function bounceCrustFragment(b){
 b.crust=false;
 const angle=Math.atan2(b.vy,b.vx)+(b.y===80?.25:-.25);
 const child=addBullet(angle,'normal',false,0,cardProjectileDamage);
 if(!child)return;
 Object.assign(child,{x:b.x,y:b.y,damage:b.damage*cardProjectileDamage,life:1.2,generation:1,
  metaCritical:b.metaCritical,elements:{...b.elements},seekRank:b.seekRank,snakeRank:b.snakeRank,bounces:0});
 sound('split');
}
function rocketOrbitPosition(index){
 const angle=runTime*3+index*Math.PI*2/3;
 return {x:player.x+Math.cos(angle)*57,y:player.y+Math.sin(angle)*49,angle};
}
function rocketAim(target){
 if(target.hp<=0)return null;
 if(!target.aim)return target;
 return boss?.parts.includes(target)?{x:boss.x+target.aim[0],y:boss.y+target.aim[1]}:null;
}
function launchOrbitRocket(){
 const power=player.fieldPower;
 if(!power.rockets||power.launchCooldown>0||bullets.length>=bulletLimit)return;
 let target=null,nearest=200;
 for(const candidate of enemies.concat(boss?.parts||[])){
  const aim=rocketAim(candidate);
  if(!aim||aim.x<0||aim.x>W||aim.y<62||aim.y>H)continue;
  const distance=Math.hypot(aim.x-player.x,aim.y-player.y);
  if(distance<=nearest){target=candidate;nearest=distance}
 }
 if(!target)return;
 const origin=rocketOrbitPosition(--power.rockets),aim=rocketAim(target);
 const angle=Math.atan2(aim.y-origin.y,aim.x-origin.x);
 const amount=damage(3,false);
 bullets.push({x:origin.x,y:origin.y,vx:620*Math.cos(angle),vy:620*Math.sin(angle),w:12,h:10,
  style:'rocket',target,damage:amount,metaCritical:metaLastCritical,hit:new Set(),age:0,life:1.35});
 power.launchCooldown=.6;
 sound('shot',{style:'speed',x:origin.x});
}
function collectFieldPowerup(p){
 const power=player.fieldPower,card=fieldPowerups[p.i];
 if(p.i==='rockets')power.rockets=3;
 if(p.i==='shield'){power.shield=2;power.shieldTime=8}
 if(p.i==='sweeper')power.beamTime=1;
 p.dead=true;notice=2.6;noticeText=card.name.toUpperCase();
 sound('pickup');ring(p.x,p.y,card.color,60);particle(p.x,p.y,card.color,24);
}
function sweeperArea(){
 const start=player.x+28;
 return {x:(W+start)/2,y:player.y-2,w:W-start,h:28};
}
function steerProjectile(b,target,turn,dt){
 if(!target)return;
 const angle=Math.atan2(target.y-b.y,target.x-b.x),speed=Math.hypot(b.vx,b.vy);
 const step=Math.min(1,dt*turn);
 b.vx+=(Math.cos(angle)*speed-b.vx)*step;
 b.vy+=(Math.sin(angle)*speed-b.vy)*step;
}
function shotInterval(){
 const intervals=[.24,.30,.28,.42,.20,.24,.32,.40,.32,.45,.48,.42,.28,.70,.60,.40],weapon=activeWeapon();
 const base=weapon===3?Math.max(.42,.34*(1+cardValues.duration(upgrades.duration)+cardValues.cellar(upgrades.cellar))+.04):(intervals[weapon]||.24);
 const rate=1+.015*(metaCount('A1',[11,12,14,15,17,18,19])+2*Number(owns('A1-21')));
 return base/(rate*playerFireRate)*(owns('A1-23')?1.25:1)/(owns('W3-23')?(weapon>=0?1.375:.85):1);
}
function updateAutoFire(dt){
 const weapon=activeWeapon();
 if(weapon<0&&player.autoWeapon>=0)player.autoCooldown=Math.min(player.autoCooldown,shotInterval());
 player.autoWeapon=weapon;
 player.autoCooldown-=dt;
 if(player.autoCooldown<=0){const overdue=player.autoCooldown;fireCharge();player.autoCooldown=Math.max(0,player.autoCooldown+overdue)}
}
const specialCostFraction=.1;
function wineStatus(weapon){
 if(weapon<0)return null;
 const remaining=player.effects[weapon],capacity=player.effectMax||18;
 const cost=capacity*specialCostFraction,free=owns('W1-13')&&!player.freeSpecialUsed;
 return {
  fraction:remaining/capacity,
  segments:1/specialCostFraction,
  paid:Math.ceil(remaining/cost),
  free,
  control:lastFlightInput==='gamepad'?padButtons[0]:'LEERTASTE'
 };
}
function fireSpecial(){
 if(state!=='playing')return;
 const weapon=activeWeapon();
 if(weapon<0){notice=1.2;noticeText='KEIN SONDERANGRIFF · WEIN SAMMELN';sound('block');return}
 const cost=(player.effectMax||18)*specialCostFraction;
 const free=owns('W1-13')&&!player.freeSpecialUsed;
 const remaining=player.effects[weapon]-cost;
 player.specialCount++;
 player.metaLastSpecial=!free&&remaining<=1e-9;
 fireCharge(true);
 if(free)player.freeSpecialUsed=true;
 else player.effects[weapon]=remaining>1e-9?remaining:0;
}
function fireCharge(special=false){
 const charged=special,power=special?1:0,weapon=activeWeapon();
 const style=styles[weapon]||(charged?'wave':'normal');
 // Bei vollen Projektilpools bekommt der Hauptschuss weiterhin einen Platz.
 if(bullets.length>=bulletLimit&&style!=='port'&&style!=='storm')bullets.shift();
 const firstNew=bullets.length,firstBeam=beams.length;
 sound('shot',{charged,style:styles[weapon]||'normal',x:player.x});
 const emit=(angle=0,mode=style,scale=1,offset=0)=>addBullet(angle,mode,charged,power,scale,offset);
 if(style==='port'||style==='storm'){
  const storm=style==='storm', life=(storm?(charged?1.05:.22):(charged?.65+power*.55:.34))*(1+cardValues.duration(upgrades.duration)+cardValues.cellar(upgrades.cellar));
  beams.push({life,maxLife:life,charged,style,width:(storm?(charged?54:13):(charged?14+power*14:9))*(1+cardValues.size(upgrades.size)),damage:damage(storm?(charged?7:2):(charged?3.5+power*2:1.8)),metaCritical:metaLastCritical,tick:0,elements:attackElements(charged),x:player.x+27,y:player.y-2});
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
  const b=emit();if(b){b.wave=true;b.chargedStandard=weapon<0;b.life=charged?1.8:1.1;b.vx=charged?380:430;b.damage*=.9}
 }else if(style==='frost'){
  for(const angle of charged?[-.28,-.14,0,.14,.28]:[-.1,.1]){const b=emit(angle);if(b){b.slow=charged?.42:.28;b.elements.frost=Math.min(.65,b.slow+cardValues.frost(upgrades.frost))}}
 }else if(style==='vortex'){
  const b=emit();if(b){b.vx=charged?110:160;b.life=charged?2.2:1.25;b.vortex=charged?94:60;b.pulse=.24;b.damage*=.35;b.w*=1.6;b.h=b.w}
 }else if(style==='phoenix'){
  for(const angle of charged?[-.12,0,.12]:[0]){const b=emit(angle);if(b){b.phoenix=true;b.baseY=b.y;b.phase=angle*12;b.life=2.6;b.damage*=.8}}
 }else if(style==='normal'&&!charged){
  const count=1+upgrades.multiShot+cardValues.fanShot(upgrades.fanShot),step=upgrades.fanShot?.12:0;
  const mainIndex=Math.floor((count-1)/2);
  const order=Array.from({length:count},(_,i)=>i);
  if(bullets.length+count>bulletLimit)order.unshift(...order.splice(mainIndex,1));
  for(const i of order){const b=emit((i-(count-1)/2)*step,style,i===mainIndex?1:cardProjectileDamage);if(b){b.y+=(i-(count-1)/2)*18;b.standardShot=true;b.seekRank=upgrades.seekShot;b.snakeRank=upgrades.snakeShot;b.breakRank=upgrades.breakShot;mutateStandardShot(b)}}
 }else{
  const angles=style==='white'?(charged?[-.34,-.17,0,.17,.34]:[-.24,0,.24]):style==='rose'&&charged?[-.4,0,.4]:style==='speed'?[-.065,.065]:[0];
  for(let j=0;j<(style==='red'&&!charged?3:1);j++)for(const angle of angles)emit(angle,style,1,j*15);
 }
 if(!charged&&weapon<0&&player.verticalWine>0)for(const direction of [-1,1]){const b=addBullet(direction*Math.PI/2,'normal',false,0);if(b){b.x=player.x;b.y=player.y+direction*player.h/2;b.verticalWine=true}}
 if(!charged&&weapon>=0){for(const b of bullets.slice(firstNew))b.seekRank=upgrades.seekShot;for(const beam of beams.slice(firstBeam))beam.seekRank=upgrades.seekShot}
 if(charged&&weapon>=0){
  const primary=bullets.slice(firstNew),beamPrimary=beams.slice(firstBeam),extra=upgrades.multiShot+cardValues.fanShot(upgrades.fanShot);
  for(const b of primary){b.seekRank=upgrades.seekShot;b.snakeRank=upgrades.snakeShot;b.breakRank=upgrades.breakShot}
  for(const beam of beamPrimary){beam.seekRank=upgrades.seekShot;beam.snakeRank=upgrades.snakeShot;beam.breakRank=upgrades.breakShot;beam.splitTargets=new Set()}
  for(let i=0;i<extra;i++){
   const side=i%2?1:-1,offset=side*(Math.floor(i/2)+1),angle=upgrades.fanShot?offset*.12:0;
   if(primary.length&&bullets.length<bulletLimit){const b=primary[i%primary.length],cos=Math.cos(angle),sin=Math.sin(angle);bullets.push({...b,damage:b.damage*cardProjectileDamage,y:b.y+offset*18,baseY:b.baseY===undefined?undefined:b.baseY+offset*18,vx:b.vx*cos-b.vy*sin,vy:b.vx*sin+b.vy*cos,phase:(b.phase||0)+angle,hit:new Set(),trail:[]})}
   if(beamPrimary.length){const beam=beamPrimary[0];beams.push({...beam,damage:beam.damage*cardProjectileDamage,offset:offset*18,splitTargets:new Set()})}
  }
 }
 if(upgrades.echoForge&&((player.attacks+1)%4===0)){
  const primary=bullets.slice(firstNew,firstNew+2);for(const original of primary)for(const side of [-1,1])if(bullets.length<bulletLimit)bullets.push({...original,x:original.x-15,y:original.y+side*8,phase:(original.phase||0)+side*.4,damage:original.damage*cardValues.echoForge(upgrades.echoForge),life:original.life*.9,hit:new Set(),echoed:true});
  if(beams.length>firstBeam){const original=beams[firstBeam];for(const side of [-1,1])beams.push({...original,offset:side*20,damage:original.damage*cardValues.echoForge(upgrades.echoForge),life:original.life*.65,splitTargets:original.splitTargets?new Set():undefined,echoed:true})}sound('echo');
 }
 if(charged&&upgrades.orbital>0)for(let i=0;i<2;i++){const orb=addBullet(0,'orbit',charged,power,cardValues.orbital(upgrades.orbital));if(orb){orb.orbit=1.2;orb.orbitRadius=48+i*5;orb.phase=i*Math.PI;orb.life=2.7}}
 if(player.overdrive>0)for(const angle of [-.2,.2,Math.PI,-Math.PI/2,Math.PI/2])addBullet(angle,'speed',charged,power,.45);
 if(player.overdrive>0&&!charged){const count=Number(owns('K1-13'))+Number(owns('K1-16'))+Number(owns('K1-22'));for(let i=0;i<count;i++)addBullet((i-(count-1)/2)*.22,'speed',false,0,.525)}
 if(upgrades.spread>0)for(const angle of [-.32,.32])addBullet(angle,'satellite',false,0,cardValues.spread(upgrades.spread));
 if(upgrades.rear>0)addBullet(Math.PI,'satellite',charged,power,cardValues.rear(upgrades.rear));
 player.attacks++;if(upgrades.echo>0&&!upgrades.echoForge&&player.attacks%6===0)for(const angle of [-.1,.1]){
  const echo=addBullet(angle,'echo',charged,power,cardValues.echo(upgrades.echo));
  if(!charged&&weapon<0)mutateStandardShot(echo);
 }
 if(charged){player.metaAfterSpecial=3;const w1=.015*metaCount('W1',[1,2,3,4,6,7,8,9,11,12,14,15,17,18,19])+.03*metaCount('W1',[5,10])+.03*Number(owns('W1-21'));const meta=1+w1+(weapon>=0?.03*metaCount('W3',[5,10]):0)+(owns('W3-22')&&player.metaWeaponSpecial?.30:0)+(owns('W1-16')&&player.specialCount===1?.30:0)+(owns('W1-22')&&player.metaLastSpecial?.30:0)+(owns('W1-23')?.90:0);const multiplier=(1+cardValues.charge(upgrades.charge)+cardValues.tempo(upgrades.tempo))*meta;for(const b of bullets.slice(firstNew)){b.damage*=multiplier;b.w*=3*(1+cardValues.blast(upgrades.blast));b.h*=3*(1+cardValues.blast(upgrades.blast))}for(const beam of beams.slice(firstBeam)){beam.damage*=multiplier;beam.width*=3*(1+cardValues.blast(upgrades.blast))}player.metaWeaponSpecial=false}
 const speedMultiplier=1+.03*metaCount('A1',[5,10])+(weapon>=0?.015*metaCount('W3',[1,2,3,4,6,7,8,9]):0);
 for(const b of bullets.slice(firstNew)){b.vx*=speedMultiplier;b.vy*=speedMultiplier;if(!charged&&owns('A1-16'))b.life*=1.225}
 if(!charged){
  const balance=[.325,.419,1.084,.3225,.415,1,1.339,.83,1.339,.922,1.976,1.921,.585,4.089,.619,1.866];
  if(weapon>=0){for(const b of bullets.slice(firstNew))b.damage*=balance[weapon];for(const beam of beams.slice(firstBeam))beam.damage*=balance[weapon]}
  player.autoAttacks++;
  let bonus=1+.015*metaCount('A1',[1,2,3,4,6,7,8,9])+(weapon>=0?.015*(metaCount('W3',[11,12,14,15,17,18,19])+2*Number(owns('W3-21')))+(owns('W2-13')?.12:0):0)+(player.metaAfterSpecial>0&&owns('W3-20')?.15:0);
  if(owns('A1-13')&&player.autoAttacks%12===0)bonus+=.45;
  if(owns('A1-20')&&player.autoAttacks%6===0)bonus+=.30;
  if(owns('A1-23'))bonus+=.60;
  for(const b of bullets.slice(firstNew))b.damage*=bonus;
  for(const beam of beams.slice(firstBeam))beam.damage*=bonus;
  if(owns('A1-22')&&player.autoAttacks%15===0){const extra=addBullet(0,'normal',false,0,.6);if(extra)extra.damage*=bonus}
  if(weapon>=0&&owns('W3-16')&&player.autoAttacks%15===0){const extra=addBullet(0,'echo',false,0,.6);if(extra)extra.damage*=bonus}
  player.autoCooldown=shotInterval();player.autoWeapon=weapon;
 }
 if(weapon>=0){for(const b of bullets.slice(firstNew))b.damage*=1.15;for(const beam of beams.slice(firstBeam))beam.damage*=1.15}
 if(charged&&owns('W2-20')){if(!player.metaBombs)player.metaBombs=[];player.metaBombs.push({x:player.x+28,y:player.y,time:1,amount:damage(1.5+(owns('W2-22')?.75:0))*(owns('W2-23')?2.5:1),radius:90+(owns('W2-22')?30:0)})}
 player.muzzle=charged?.2:.12;impact(player.x+28,player.y,colors[weapon]||'#a8edff',charged?18:7);
 if(charged){ring(player.x+27,player.y,colors[weapon]||'#d6f5ff',48);shake=Math.max(shake,1.8)}
}
const introDuration=90;
const introWaves=[
 // [Spielzeit, Gegnertyp, Eintrittshöhe, vertikales Tempo]
 [3,0,270],[5,0,340],[7,0,254],[9,0,195],[11,0,286],[13,0,380],
 [15,0,270],[17,0,185],[19,0,360],[20,0,250],[22,0,310],[24,0,420],
 [25,0,290],[27,0,155],[29,0,390],[31,0,235],[33,3,210],[35,0,310],
 [38,3,350],[41,3,170],[45,3,420],[49,3,260],
 [54,4,145,38],[57,3,320],[59,4,435,-38],
 [61,0,210],[63,3,415],[65,0,275],[66,4,345,-30],[68,3,155],
 [70,0,365],[72,3,245],[74,0,430],[76,3,205],[78,0,300],
 [80,4,440,-38],[81,3,170],[83,0,375],[85,4,150,38],[87,3,320],[89,0,235]
];
const bazaarStart=240, bazaarBossTime=300;
const rearWaveCycle=480, rearWaveOffsets=[113,268,397], rearLanes=[145,243,345,443];
const blockerCycle=480, blockerOffsets=[68,153,222,367,463], blockerDuration=15;
const patrolEntry=2.4,patrolHold=8.6,patrolExit=2,patrolDuration=patrolEntry+patrolHold+patrolExit;
const blockerPatrols=[
 {sprite:'lantern',w:116,h:178,side:1,x:666,fromY:178,toY:426,hp:32},
 {sprite:'bird',w:180,h:104,side:-1,x:330,fromY:435,toY:148,hp:28},
 {sprite:'barge',w:226,h:108,side:1,x:505,fromY:184,toY:426,hp:38,returnSweep:true}
];
const bazaarWaves=[
 // Four ordered waves. Entries are [second, enemy type, height].
 [[1,3,220],[3,3,355],[5,3,155],[7,3,295],[9,3,420],[11,3,240]],
 [[15,6,170],[17,6,360],[19,6,240],[21,6,430],[23,6,155],[25,6,310]],
 [[29,7,345],[31,7,185],[33,7,400],[35,7,230],[37,7,310],[39,7,165]],
 [[43,3,185],[44.5,6,345],[46,6,415],[47.5,7,225],[49,3,295],
  [50.5,7,155],[52,6,425],[53.5,3,350],[55,7,260]]
];
const bazaarWaveBonus=250;
function awardBazaarWave(wave){
 if(!wave.closed||wave.awarded||wave.spawned===0||wave.defeated!==wave.spawned)return;
 wave.awarded=true;
 score+=bazaarWaveBonus;
 notice=2.5;noticeText='BASARWELLE KOMPLETT · +'+bazaarWaveBonus;
}
function spawnBazaarWave(previousTime){
 const progress=player.bazaarWaves??=(bazaarWaves.map(()=>({spawned:0,defeated:0,closed:false,awarded:false})));
 for(let i=0;i<bazaarWaves.length;i++){
  const entries=bazaarWaves[i],wave=progress[i];
  for(const [offset,type,y] of entries){
   const at=bazaarStart+offset;
   if(at>t)break;
   if(previousTime<at){
    enemy(type,y).bazaarWave=wave;
    wave.spawned++;
   }
  }
  if(!wave.closed&&t>=bazaarStart+entries.at(-1)[0]){
   wave.closed=true;
   awardBazaarWave(wave);
  }
 }
}
const laterWaveStart=720,laterWaveEnd=748;
const laterWaveEntries=[
 // Shoot from above and below, then cross the height bands before the combined wave.
 [0,3,150],[2,3,402],[4,3,185],
 [8,4,145,36],[10,4,415,-36],[12,4,145,36],
 [17,3,145],[17,6,418],[19.5,6,145],[19.5,3,418],[22,3,145],[22,6,418]
];
function spawnLaterMainWaves(previousTime){
 for(const [offset,type,y,drift] of laterWaveEntries){
  const at=laterWaveStart+offset;
  if(previousTime>=at||t<at)continue;
  const unit=enemy(type,y);
  if(drift)unit.entryDrift=drift;
  if(offset>=17)unit.fireAlongLane=true;
 }
}
function enemy(i,y){
 const elite=t>120&&Math.random()<Math.min(.22,.06+t/4500), hp=Math.round([2,3,4,5,4,6,6,9,9,14][i]*(1+threat*.6)*(elite?1.4:1))*(elite?1:.9);
 const sizes=[[42,42],[56,46],[54,34],[46,54],[58,34],[46,58],[60,44],[52,54],[60,48],[78,62]][i];
 const unit={i,x:W+sizes[0]/2+8,y:y??270,w:sizes[0],h:sizes[1],hp,max:hp,age:0,fire:rand(1,2.8),speed:rand(65,100)+Math.min(t/20,90),phase:rand(0,6),warning:false,flash:0,elite,slow:0,slowTime:0,burnLife:0,burnDps:0};
 enemies.push(unit);
 return unit;
}
function spawnIntroWave(previousTime){
 for(const [at,type,y,entryDrift] of introWaves){
  if(at>t)break;
  if(previousTime>=at)continue;
  const unit=enemy(type,y);
  if(type===0)Object.assign(unit,{speed:85,introSimit:true});
  if(entryDrift)unit.entryDrift=entryDrift;
 }
}
function spawnRearWave(previousTime){
 const cycleStart=Math.floor(t/rearWaveCycle)*rearWaveCycle;
 if(!rearWaveOffsets.some(offset=>previousTime<cycleStart+offset&&t>=cycleStart+offset))return;
 const lanes=rearLanes.filter(y=>Math.abs(y-player.y)>=90);
 for(const y of lanes.slice(0,2)){
  const unit=enemy(4,y);
   Object.assign(unit,{rear:true,x:-unit.w/2-8,speed:195,elite:false,hp:4,max:4});
 }
}
function spawnBlocker(previousTime){
 const cycle=Math.floor(t/blockerCycle),cycleStart=cycle*blockerCycle;
 const index=blockerOffsets.findIndex(offset=>previousTime<cycleStart+offset&&t>=cycleStart+offset);
 if(index<0||enemies.some(unit=>unit.blocker))return;
 const unit=enemy(9,(cycle+index)%2===0?205:395);
 const hp=Math.round(55*(1+threat*.6));
 Object.assign(unit,{blocker:true,lifetime:blockerDuration,x:W+165+8,w:330,h:210,speed:24,elite:false,hp,max:hp});
}
function spawnBlockerPatrol(dt){
 blockerPatrolDelay-=dt;
 if(blockerPatrolDelay>0||enemies.some(unit=>unit.blocker&&unit.hp>0))return;
 const cycleTime=t%blockerCycle;
 const nextCarpet=blockerOffsets.find(offset=>offset>cycleTime)??blockerCycle+blockerOffsets[0];
 if(nextCarpet-cycleTime<=patrolDuration||nextBoss-t<=patrolDuration)return;
 if(!blockerPatrolQueue.length)blockerPatrolQueue=blockerPatrols.slice();
 const index=Math.floor(Math.random()*blockerPatrolQueue.length);
 const [patrol]=blockerPatrolQueue.splice(index,1);
 const unit=enemy(9,patrol.fromY),hp=Math.round(patrol.hp*(1+threat*.6));
 const edge=patrol.side===1?W+patrol.w/2+8:-patrol.w/2-8;
 Object.assign(unit,{blocker:true,patrol,edge,x:edge,w:patrol.w,h:patrol.h,hp,max:hp,
  elite:false,lifetime:patrolDuration,sweepTime:0});
 blockerPatrolDelay=rand(65,95);
}
function moveBlockerPatrol(e,dt){
 const {patrol,edge,age}=e;
 const entry=clamp(age/patrolEntry,0,1);
 const exit=clamp((age-patrolEntry-patrolHold)/patrolExit,0,1);
 const progress=Math.min(entry,1-exit);
 e.x=edge+(patrol.x-edge)*progress*progress*(3-2*progress);
 const sweepStep=Math.max(0,Math.min(age,patrolEntry+patrolHold)-Math.max(age-dt,patrolEntry));
 e.sweepTime+=sweepStep*(1-e.slow);
 const phase=e.sweepTime/patrolHold*Math.PI*(patrol.returnSweep?2:1);
 e.y=patrol.fromY+(patrol.toY-patrol.fromY)*(1-Math.cos(phase))/2;
}
const regularEntryLanes=[270,170,375,225,425,125,320,460,200,345,285];
function spawnRareEnemy(y){
 if(!rareEnemyQueue.length){
  rareEnemyQueue=rareEnemies.slice();
  for(let i=rareEnemyQueue.length-1;i>0;i--){
   const j=Math.floor(Math.random()*(i+1));
   [rareEnemyQueue[i],rareEnemyQueue[j]]=[rareEnemyQueue[j],rareEnemyQueue[i]];
  }
 }
 const rareEnemy=rareEnemyQueue.pop(),hp=8*(1+threat*.6);
 enemies.push({i:0,rareEnemy,x:W+38,y,w:60,h:54,hp,max:hp,age:0,fire:1.45,
  speed:112,phase:0,flash:0,elite:false,slow:0,slowTime:0,burnLife:0,burnDps:0});
 nextRareEnemy=t+rand(120,145);
 notice=2;noticeText=rareEnemy.name.toUpperCase();
}
function spawnRegularEnemy(){
 const unlocked=secret?4:Math.min(9,Math.floor(t/32));
 const type=spawnIndex%(unlocked+1);
 const y=regularEntryLanes[spawnIndex%regularEntryLanes.length];
 if(!secret&&t>=nextRareEnemy)spawnRareEnemy(y);
 else enemy(type,y);
 spawnIndex++;
 spawn+=1;
}
function hostileProjectile(x,y,vx,vy,col='#e7b575',size=10,options={}){
 const pace=(1+threat*.075)*hostileShotSpeed;
 return {x,y,vx:vx*pace,vy:vy*pace,w:size,h:size,col,life:8,age:0,...options,
  gravity:(options.gravity||0)*hostileShotSpeed};
}
function projectile(...args){
 if(shots.length<180)shots.push(hostileProjectile(...args));
}
const enemyShotTypes=['mortar','sickle','splitter','needle','sickle','mine','needle','pulse','splitter','mortar'];
const bossAttackPatterns=[
 ['needle','strike'],['sickle','needle'],['splitter','mortar'],['mine','sickle'],
 ['pulse','splitter'],['needle','splitter','football'],['mortar','sickle']
];
function nextBossAttack(b){
 const attacks=bossAttackPatterns[b.i];
 return attacks[(b.volleyIndex||0)%attacks.length];
}
function hostileVolley(type,x,y,target,strong){
 const direction=target.x<x?-1:1;
 switch(type){
  case 'needle':{
   const aim=Math.atan2(target.y-y,target.x-x);
   for(const offset of strong?[-.19,0,.19]:[0]){
    projectile(x,y,Math.cos(aim+offset)*190,Math.sin(aim+offset)*190,'',strong?11:8,{kind:type});
   }
   break;
  }
  case 'sickle':
   for(const sign of strong?[-1,1]:[y<target.y?1:-1]){
    projectile(x,y,direction*180,sign*70,'',strong?14:10,{kind:type,curve:-direction*sign*1.15,curveUntil:.65});
   }
   break;
  case 'splitter':
   projectile(x,y,direction*155,0,'',strong?16:12,{kind:type,burstAt:.85,burstCount:strong?5:3,direction});
   break;
  case 'mortar':
   for(const speed of strong?[145,195,240]:[150]){
    projectile(x,y,direction*speed,-125,'',strong?14:10,{kind:type,gravity:145});
   }
   break;
  case 'mine':
   projectile(x,y,direction*(strong?65:47),0,'',strong?20:15,{kind:type,burstAt:1.2,burstCount:strong?8:4,direction});
   break;
  case 'pulse':{
   const reach=strong?420:175,width=strong?22:12;
   projectile(x+direction*reach/2,y,0,0,'',width,{kind:type,w:reach,originX:x,life:strong?.23:.16});
   break;
  }
  case 'football':{
   const vertical=y<270?1:-1;
   projectile(x,y,direction*225,vertical*240,'',28,{kind:type,bounces:2,life:4});
   break;
  }
 }
}
function rareEnemyAttack(e){
 const {attack,color}=e.rareEnemy,x=e.x-25,y=e.y;
 const target=e.aimTarget||player;
 const aim=Math.atan2(target.y-y,target.x-x);
 const direction=target.x<x?-1:1;
 switch(attack){
  case 'fan':
   for(const offset of [-.4,0,.4])projectile(x,y,-165*Math.cos(offset),165*Math.sin(offset),color,10,{kind:'needle'});
   break;
  case 'dive':
   projectile(x,y,-205,105,color,13,{kind:'sickle',curve:.65,curveUntil:.9});
   break;
  case 'aim':
   projectile(x,y,Math.cos(aim)*230,Math.sin(aim)*230,color,13,{kind:'needle'});
   break;
  case 'split':
   projectile(x,y,direction*135,0,color,16,{kind:'splitter',burstAt:.9,burstCount:3,direction});
   break;
  case 'arc':
   projectile(x,y,-155,-155,color,15,{kind:'mortar',gravity:190});
   break;
  case 'cross':
   for(const sign of [-1,1])projectile(x,y+sign*23,-142,-sign*86,color,12,{kind:'sickle'});
   break;
  case 'mine':
   projectile(x,y,-52,0,color,18,{kind:'mine',burstAt:1.6,burstCount:4,direction:-1});
   break;
  case 'pulse':
   hostileVolley('pulse',x,y,{x:x-1,y},false);
   break;
  case 'lanes':
   for(const offset of [-29,29])projectile(x,y+offset,-168,0,color,12,{kind:'needle'});
   break;
  case 'scissor':
   for(const sign of [-1,1])projectile(x,y,-150,sign*92,color,13,{kind:'sickle',curve:sign*1.6,curveUntil:1.1});
   break;
 }
}
function enemyAttack(e){
 if(e.rareEnemy){rareEnemyAttack(e);return}
 if(e.rear){
  projectile(e.x+e.w/2,e.y,170,e.y<player.y?50:-50,'',10,{kind:'sickle',curve:e.y<player.y?-.65:.65,curveUntil:.8});
  return;
 }
 if(e.blocker){
  const x=e.x-e.w/2;
  for(const offset of [-48,48])hostileVolley('needle',x,e.y+offset,{x:0,y:e.y+offset},false);
  return;
 }
 const target=e.fireAlongLane?{x:0,y:e.y}:e.aimTarget||player;
 hostileVolley(enemyShotTypes[e.i],e.x-22,e.y,target,false);
}
function moveHostileShot(shot,dt){
 shot.age=(shot.age||0)+dt;
 if(shot.curve&&shot.age<(shot.curveUntil||1)){
  const angle=Math.atan2(shot.vy,shot.vx)+shot.curve*dt,speed=Math.hypot(shot.vx,shot.vy);
  shot.vx=Math.cos(angle)*speed;shot.vy=Math.sin(angle)*speed;
 }
 if(shot.gravity)shot.vy+=shot.gravity*dt;
 shot.x+=shot.vx*dt;shot.y+=shot.vy*dt;
 if(shot.bounces>0){
  const top=62+shot.h/2,bottom=H-shot.h/2;
  if(shot.y<top||shot.y>bottom){
   const edge=shot.y<top?top:bottom;
   shot.y=edge*2-shot.y;shot.vy=-shot.vy;shot.bounces--;
  }
 }
}
function burstHostileShot(shot){
 shot.life=0;
 if(shot.x<0||shot.x>W||shot.y<62||shot.y>H)return;
 for(let i=0;i<shot.burstCount;i++){
  const angle=shot.kind==='mine'?i*2*Math.PI/shot.burstCount:(i-(shot.burstCount-1)/2)*.23;
  projectile(shot.x,shot.y,shot.direction*Math.cos(angle)*135,Math.sin(angle)*135,'',8,{kind:'needle'});
 }
}

const damageCauses={contact:'Gegnerkontakt',projectile:'Feindgeschoss',boss:'Bosskontakt',strike:'Bossvorstoß'};
function hurt(source,sourceX=player.x,sourceY=player.y){
 if(player.inv>0||state!=='playing')return;
 player.metaLastHit=runTime;if(owns('V1-16'))player.metaHitSpeed=2;
 if(owns('Q2'))player.metaRevenge=5;
 if(owns('V2-20')&&!player.metaShieldUsed){player.metaShieldUsed=true;player.inv=.3;if(owns('V2-22'))shots=shots.filter(s=>Math.hypot(s.x-player.x,s.y-player.y)>90);ring(player.x,player.y,'#aeeaff',90);sound('block');return}
 if(player.effects[2]>0){
  sound('block');player.effects[2]=0;impact(player.x,player.y,'#ffc3e3',18);
 }else{
  const previousHearts=hearts;
  sound('hurt');hearts--;impact(player.x,player.y,'#f17765',22);flash=.18;
  if(hearts<=0&&owns('V3-20')&&!player.metaLastStand){player.metaLastStand=true;hearts=1}
  if(hearts<previousHearts){
   const angle=sourceX===player.x&&sourceY===player.y?-Math.PI/2:Math.atan2(sourceY-player.y,sourceX-player.x);
   player.lastDamage={source,x:sourceX,y:sourceY,angle,time:runTime};
  }
  if(hearts===1&&owns('V3-16')&&!player.metaRecover){player.metaRecover=true;heal(1)}
 }
 player.inv=1.5*(1+.03*(metaCount('V3',[11,12,14,15,17,18,19])+2*Number(owns('V3-21')))+.015*metaCount('V2',[1,2,3,4,6,7,8,9]));shake=4;if(hearts<=0)end();
 if(hearts===1&&owns('K3-20')&&!player.metaNotreserve){player.metaNotreserve=true;player.rage=Math.min(100,player.rage+30)}
}
const scoreKey='pfert-scoreboard-v1';
let recentScores=[],scoreStorageDirty=false;
function saveScore(points,seconds){
 let available=true;
 try{const raw=scoreStorageDirty?null:window.localStorage.getItem(scoreKey);if(raw!==null){const data=JSON.parse(raw);if(!Array.isArray(data))throw new Error('invalid scores');recentScores=data.filter(entry=>entry&&Number.isFinite(entry.points)&&entry.points>=0&&Number.isFinite(entry.seconds)&&entry.seconds>=0).slice(0,10)}}catch(error){available=false}
 const current={points:Math.max(0,Math.floor(points)),seconds:Math.max(0,Math.floor(seconds))};
 recentScores=[current,...recentScores].slice(0,10);
 try{window.localStorage.setItem(scoreKey,JSON.stringify(recentScores));scoreStorageDirty=false}catch(error){scoreStorageDirty=true;available=false}
 const ranked=recentScores.map((entry,index)=>({...entry,current:index===0,index})).sort((a,b)=>b.points-a.points||a.index-b.index);
 return {ranked,available};
}
function scoreTable(result){
 const rows=result.ranked.map((entry,index)=>'<li'+(entry.current?' class="score-current" aria-current="true"':'')+'><span>'+(index+1)+'. '+(entry.current?'▶ ':'')+'</span><strong>'+entry.points+' Punkte</strong><span>'+clock(entry.seconds)+'</span></li>').join('');
 return '<section class="scoreboard" aria-label="Punktetafel"><h2>LETZTE 10 RUNDEN · PLATZ '+(result.ranked.findIndex(entry=>entry.current)+1)+'</h2><ol>'+rows+'</ol>'+(result.available?'':'<p>Speicherung nicht verfügbar – Ergebnisse gelten nur für diese Sitzung.</p>')+'</section>';
}
function damageSummary(){
 const cause=damageCauses[player.lastDamage?.source];
 return cause?'<p class="run-stats">Letzter Herzverlust · '+cause+'</p>':'';
}
let lastRoast=-1;
function end(){
 if(state!=='playing')return;
 if(runMode!=='regular'){sound('die');finishUnranked();return}
 let talentProgress='';
 if(metaAvailable){
  bankRunTalents(0,true);
  talentProgress='<p class="run-stats">Talentpunkte · Spielzeit +'+metaTimePoints+' · Bosse +'+metaBosses+' · nächster Zeit-Punkt in '+clock(Math.ceil(600-metaData.seconds))+'</p>';
 }
 state='over';if(typeof PfertSound!=='undefined')PfertSound.stopMusic();sound('die');cancelCharge();overlay.classList.remove('hidden');overlay.classList.remove('upgrade-overlay');overlay.classList.add('game-over');
 let roast=Math.floor(rand(0,roasts.length));if(roast===lastRoast)roast=(roast+1)%roasts.length;lastRoast=roast;
 const results=saveScore(score,runTime);
 const comeback=comebacks[Math.floor(rand(0,comebacks.length))],build=Object.values(upgrades).reduce((a,b)=>a+b,0);
  overlay.innerHTML='<div class="eyebrow">✦ DER BASAR HAT DICH AUSGELACHT ✦</div><h1>OH PFERT<span>✦</span></h1><p class="roast">'+roasts[roast]+'</p><p class="comeback">'+comeback+'</p><p class="run-stats">'+score+' Punkte · '+clock(runTime)+' überlebt · '+build+' Karten</p>'+scoreTable(results)+damageSummary()+talentProgress+buildDetails()+'<button id="again">ICH BIN NOCH NICHT FERTIG →</button><p class="hint">ENTER<span class="pad-only"> / '+padHint(0)+'</span> oder den Knopf drücken</p>';
 if(metaAvailable){const button=document.createElement('button');button.id='talents';button.textContent='TALENTBAUM · '+metaData.points+' PUNKTE · T / B';overlay.appendChild(button)}
 bindHomeControls();
}
function setupSegments(b){
 const calibratedHp={0:.35,1:.26,6:.155};
 b.max*=12.5*.9*(calibratedHp[b.i]||1);
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
function startBoss(bazaarEncounter=false){
 const i=bossCount%5,cycle=Math.floor(bossCount/5);
 boss=setupSegments({i,x:830,y:270,w:150,h:146,hp:0,max:(90+cycle*30+i*15)*(1+threat*.2),age:0,fire:1.5,warning:0});
 if(i===1||(bazaarEncounter&&bossCount===0))boss.encounter={phase:1};
 stashBossPickups();
 sound('boss');bossCount++;nextBoss+=300;enemies=[];shots=[];notice=3;noticeText=bosses[i].toUpperCase();ring(830,270,'#ffd58b',130);
}
function stashBossPickups(){
 bossPickups.push(...pickups.filter(p=>!p.dead));
 pickups=[];
}
function restoreBossPickups(){
 pickups.push(...bossPickups);
 bossPickups=[];
}
function enterRuhr(){secretType=golden&&golden.kind===2?2:1;secret=true;secretTime=0;golden=null;boss=null;enemies=[];shots=[];bullets=[];beams=[];pickups=[];spawn=1;notice=4;noticeText=secretType===2?'NACHTSCHICHT AM HOCHOFEN':'GEHEIMLEVEL: GLÜCK AUF, PFERT!';player.inv=2}
function leaveRuhr(){secret=false;secretType=0;boss=null;enemies=[];shots=[];bullets=[];beams=[];restoreBossPickups();spawn=2;notice=4;noticeText='ZURÜCK IN DIE WOLKEN!';player.inv=2}
function startRuhrBoss(){sound('boss');const i=secretType===2?6:5;boss=setupSegments({i,x:830,y:270,w:150,h:146,max:(i===6?155:120)*(1+threat*.22),age:0,fire:1.5,warning:0,encounter:{phase:1}});stashBossPickups();enemies=[];shots=[];notice=3;noticeText=bosses[i].toUpperCase()}
function vizierGuard(part){return boss?.i===0&&boss.strike&&part.role===1&&part.hp>0}
function directHitGuard(target,source,isBoss,x,y){
 const moved=source.stepX||source.stepY;
 const vx=moved?source.stepX:source.vx??1,vy=moved?source.stepY:source.vy??0;
 const lanternFrontHit=target.patrol?.sprite==='lantern'&&vx>0&&vx>=Math.abs(vy);
 const scale=isBoss&&vizierGuard(target) ? .65 : lanternFrontHit ? .55 : 1;
 if(scale<1){
  target.armorFlash=runTime+.10;
  particle(x,y,'#ffd284',4,.7);
 }
 return scale;
}
function modifyDirectHit(target,amount,source,isBoss,x,y){
 const high=target.hp/target.max>.70;let bonus=high?.015*metaCount('A2',[1,2,3,4,6,7,8,9]):0;
 if(!target.metaOpened&&owns('A2-13'))bonus+=.30;target.metaOpened=true;
 if(player.metaPrecisionTarget!==target){player.metaPrecisionTarget=target;player.metaPrecisionCount=0}player.metaPrecisionCount++;
 if(owns('A2-20')&&player.metaPrecisionCount%4===0)bonus+=.375;
 if(isBoss&&source.metaCritical&&owns('A2-16'))bonus+=.15;
 if(target.burnLife>0||target.slowTime>0)bonus+=.015*metaCount('A3',[1,2,3,4,6,7,8,9]);
 return amount*(1+bonus)*(owns('A3-23')?.9:1)*directHitGuard(target,source,isBoss,x,y);
}
function damageEnemy(e,amount,x,y){if(e.hp<=0)return;e.metaLastDamage=amount;sound('hit',{type:e.i,x});const finisher=e.hp/e.max<.35?1+cardValues.execute(upgrades.execute):1;e.hp-=amount*finisher;e.flash=.085;particle(x,y,'#e8faff',5);if(flashes.length<28)flashes.push({x,y,r:12,life:.08,maxLife:.08,magic:['frost','chain','port','storm','vortex','prism','orbit'].includes(e.lastImpact)});if(e.hp<=0)death(e)}
function applyAilment(b,e){
 const duration=1+.06*metaCount('A3',[5,10]);
 const elements=b.elements||attackElements(!!b.charged),slow=Math.min(.65,Math.max(b.slow||0,elements.frost));
 if(slow>0){
  const existing=e.slowTime>0?e.slow:0;
  e.slow=Math.min(.65,existing+(1-existing)*slow);
  e.slowTime=Math.max(e.slowTime||0,1.8*duration);
 }
 const burnBonus=1+.03*(metaCount('A3',[11,12,14,15,17,18,19])+2*Number(owns('A3-21')))+(owns('Q3')&&player.overdrive>0?.12:0)+(owns('Q9')&&activeWeapon()>=0?.12:0);
 if(elements.fire>0){e.burnLife=1.8*duration;e.burnDps=Math.max(e.burnDps||0,b.damage*elements.fire*burnBonus*(owns('A3-23')?1.75:1))}
}
function onHit(b,e,x,y){
 if(e){applyAilment(b,e);
  player.metaElementHits=(player.metaElementHits||0)+1;
  if(player.metaElementHits%10===0){const duration=1+.06*metaCount('A3',[5,10]);if(owns('A3-13')){const burnBonus=1+.03*(metaCount('A3',[11,12,14,15,17,18,19])+2*Number(owns('A3-21')));e.burnLife=Math.max(e.burnLife||0,2*duration);e.burnDps=Math.max(e.burnDps||0,b.damage*.225*burnBonus*(owns('A3-23')?1.75:1))}if(owns('A3-16')){e.slow=Math.max(e.slow||0,.225);e.slowTime=Math.max(e.slowTime||0,2*duration)}}
  if(owns('A3-20')&&runTime>=(player.metaSparkReady||0)){const target=enemies.filter(v=>v!==e&&v.hp>0).sort((a,b)=>Math.hypot(a.x-x,a.y-y)-Math.hypot(b.x-x,b.y-y))[0];if(target){player.metaSparkReady=runTime+1;arcs.push({x,y,tx:target.x,ty:target.y,life:.16,maxLife:.16});damageEnemy(target,b.damage*.375*(owns('A3-23')?1.75:1),target.x,target.y)}}
  if(upgrades.shatter>0&&e.slowTime>0&&e.burnLife>0&&!(e.shatterCooldown>0)){
   e.shatterCooldown=.4;ring(x,y,'#bbf4ff',62+upgrades.shatter*8);flashes.push({x,y,r:35,life:.1,maxLife:.1});sound('shatter');
   for(const target of enemies)if(target.hp>0&&Math.hypot(target.x-x,target.y-y)<70)damageEnemy(target,b.damage*cardValues.shatter(upgrades.shatter),target.x,target.y);
  }
 }
 const elements=b.elements||attackElements(!!b.charged);if(flashes.length<28&&(elements.fire||elements.frost||elements.lightning||elements.earth))flashes.push({x,y,r:20,life:.18,maxLife:.18,elements:{...elements}});const count=Math.max(b.chain||0,elements.lightning?1:0)+elements.chainBonus;
 if(count>0){let origin={x,y};const used=new Set(e?[e]:[]);for(let i=0;i<count;i++){
  const target=enemies.filter(v=>v.hp>0&&!used.has(v)&&Math.hypot(v.x-origin.x,v.y-origin.y)<(b.chain?175:120)).sort((a,b)=>Math.hypot(a.x-origin.x,a.y-origin.y)-Math.hypot(b.x-origin.x,b.y-origin.y))[0];if(!target)break;used.add(target);
  if(arcs.length<36)arcs.push({x:origin.x,y:origin.y,tx:target.x,ty:target.y,life:.16,maxLife:.16});
  target.lastCharged=!!(b.charged||b.sourceCharged);damageEnemy(target,b.damage*(b.chain?.5:.2)*cardValues.cascade(upgrades.cascade)*(owns('A3-23')?1.75:1),target.x,target.y);applyAilment(b,target);origin=target;
 }}
 const baseSplit=Math.max(b.split||0,elements.earth?2:0),cardSplit=cardValues.breakShot(b.breakRank,baseSplit>0);
 const split=(b.generation||0)<1?Math.min(7,baseSplit+cardSplit+elements.forkBonus):0;
 if(split&&!b.fragmented&&Number.isFinite(b.vx)&&Number.isFinite(b.vy)){
  b.fragmented=true;const angle=Math.atan2(b.vy,b.vx);for(let i=0;i<split;i++){
   const child=addBullet(angle+(i-(split-1)/2)*.23,b.split?'prism':b.style,false,0,.5);if(child){child.x=x+8;child.y=y;child.split=0;child.generation=1;if(e)child.hit.add(e);child.elements={...elements};child.chain=b.chain||0;child.slow=b.slow||0;child.blast=b.blast;child.seekRank=b.seekRank||0;child.snakeRank=b.snakeRank||0;child.sourceCharged=!!(b.charged||b.sourceCharged);child.damage=b.damage*(i>=baseSplit&&i<baseSplit+cardSplit?cardProjectileDamage:.5);child.life=1.2}
  }ring(x,y,'#c7ffff',34);sound('split');
 }
}
function damagePart(part,amount,x,y){
 if(!boss||part.hp<=0)return;
 part.hp=Math.max(0,part.hp-amount*(part.hp/part.max<.35?1+cardValues.execute(upgrades.execute):1));part.flash=.1;particle(x,y,'#fff0c8',8);if(flashes.length<28)flashes.push({x,y,r:18,life:.09,maxLife:.09});
 if(part.hp===0){sound('segment');addRage(15);score+=500;ring(x,y,'#ffb86b',72);particle(x,y,'#ffbe7b',30);shake=4;notice=1.5;noticeText='SEGMENT ZERSTÖRT!'}
 boss.hp=boss.parts.reduce((sum,p)=>sum+p.hp,0);
 if(boss.hp<=0){const defeated=boss;if(defeated.i===0)firstBossDefeated=true;bankRunTalents(1);if(owns('B3-20'))player.metaBossSpeed=5;if(owns('W1-20')&&!player.bossSpecialUsed){const weapon=activeWeapon(),max=player.effectMax||18;if(weapon>=0&&player.effects[weapon]<max){player.effects[weapon]=Math.min(max,player.effects[weapon]+max/(owns('W1-23')?2:3));player.bossSpecialUsed=true}}dropOrb(boss.x,boss.y,10,32.5,'boss',3);score+=2000+boss.i*500;ring(boss.x,boss.y,'#fff1ba',150);particle(boss.x,boss.y,'#ffbd7c',60,2);deaths.push({...boss,boss:true,secret,life:1.2,age:0,rotation:.3});shake=5;if(defeated.i>=5)beginTransition('leave');else{boss=null;shots=[];restoreBossPickups()}}
}
function splash(b){
 const radius=(b.style==='red'?54:30)+upgrades.blast*5, amount=b.damage*(b.style==='red'?.4:cardValues.blast(upgrades.blast));
 ring(b.x,b.y,b.style==='red'?'#ff8b5b':'#ffe9aa',radius);particle(b.x,b.y,'#ffbe72',20,1.3);
 for(const e of enemies)if(e.hp>0&&Math.hypot(e.x-b.x,e.y-b.y)<radius)damageEnemy(e,amount,e.x,e.y);
}
const bossWarningTime=1.1, bossTravelTime=.65;
const vizierStrike={distance:W*.75,warning:1.15,duration:.55};
const bossPhaseProfiles={
 0:{x:740,top:155,bottom:385,opening:2.75,interval:3.4},
 1:{x:755,top:135,bottom:405,opening:2.75,interval:2.3},
 5:{x:710,top:165,bottom:375,opening:2.5,interval:2.2},
 6:{x:775,top:120,bottom:420,opening:2.75,interval:2.35}
};
function updateBossEncounter(b,dt){
 const encounter=b.encounter;
 if(!encounter)return false;
 const profile=bossPhaseProfiles[b.i];
 if(encounter.phase===1&&b.hp<=b.max/2){
  Object.assign(encounter,{phase:2,elapsed:0,fromX:b.x,fromY:b.y,toY:b.y<270?profile.bottom:profile.top});
 }
 const arrival=bossWarningTime+bossTravelTime;
 if(encounter.phase===1||encounter.elapsed>=arrival+profile.opening){
  encounter.cue=null;
  return false;
 }
 const previousElapsed=encounter.elapsed;
 encounter.elapsed+=dt;
 const travel=clamp((encounter.elapsed-bossWarningTime)/bossTravelTime,0,1);
 b.x=encounter.fromX+(profile.x-encounter.fromX)*travel;
 b.y=encounter.fromY+(encounter.toY-encounter.fromY)*travel;
 encounter.cue=encounter.elapsed<bossWarningTime?'warning':encounter.elapsed<arrival?'moving':'opening';
 if(encounter.elapsed>=arrival&&previousElapsed<arrival){
  b.fire=1;
 }
 return true;
}
function updateVizierStrike(b,dt){
 const strike=b.strike;
 if(!strike)return false;
 strike.elapsed+=dt;
 if(strike.elapsed<vizierStrike.warning)return true;
 if(!strike.launched){
  strike.launched=true;
  projectile(b.x-30,b.y,-260,0,'#e8b68a',18,{kind:'needle'});
 }
 const progress=clamp((strike.elapsed-vizierStrike.warning)/vizierStrike.duration,0,1);
 b.x=strike.fromX+(strike.toX-strike.fromX)*progress;
 if(progress===1)b.strike=null;
 return true;
}
function bossFiringPart(b){
 const live=b.parts.filter(part=>part.hp>0);
 return live[(b.volleyIndex||0)%live.length];
}
function fireBossPhaseSalvo(b,part,target,second){
 const x=b.x+part.aim[0];
 const y=b.y+part.aim[1];
 const direction=target.x<x?-1:1;
 if(b.i===1){
  const side=second?1:-1;
  projectile(x,y,direction*180,side*70,'',14,{kind:'sickle',curve:-direction*side*1.15,curveUntil:.65});
 }else{
  const laneY=second?clamp(y,395,475):clamp(y,125,200);
  const speeds=second?[210,255]:[235,280];
  for(const speed of speeds){
   projectile(x,laneY,direction*speed,second?-72:-105,'',14,{kind:'mortar',gravity:second?72:80,life:2.3});
  }
 }
}
function bossVolley(b,profile){
 const part=bossFiringPart(b);
 if(!part)return;
 const attack=nextBossAttack(b);
 b.volleyIndex=(b.volleyIndex||0)+1;
 const target=b.aimTarget||{x:player.x,y:player.y};
 if(attack==='strike'){
  b.strike={elapsed:0,warning:vizierStrike.warning,fromX:b.x,toX:Math.max(80,b.x-vizierStrike.distance)};
 }else if(profile&&(attack==='mortar'&&b.i===6||attack==='sickle'&&b.i===1)){
  fireBossPhaseSalvo(b,part,target,false);
  b.delayedVolley={part,target,wait:b.i===1?.25:.4};
 }else{
  hostileVolley(attack,b.x+part.aim[0],b.y+part.aim[1],target,true);
 }
}
function updateBoss(dt){
 if(!boss)return;let chill=0;
 for(const part of [...boss.parts]){part.flash=Math.max(0,part.flash-dt);part.slowTime=Math.max(0,(part.slowTime||0)-dt);if(part.slowTime<=0)part.slow=0;part.shatterCooldown=Math.max(0,(part.shatterCooldown||0)-dt);if(part.hp>0)chill=Math.max(chill,part.slow||0);
  if(part.hp>0&&part.burnLife>0){part.burnLife-=dt;part.burnTick=(part.burnTick||0)+dt;if(part.burnTick>=.25){const elapsed=part.burnTick;part.burnTick=0;damagePart(part,part.burnDps*elapsed,boss.x+part.aim[0],boss.y+part.aim[1]);if(!boss)return}}
 }
 const strike=boss.strike;
 const phaseMovement=updateBossEncounter(boss,dt);
 const strikeMovement=!phaseMovement&&updateVizierStrike(boss,dt);
 const repositioning=phaseMovement||strikeMovement;
 if(!repositioning){
  const step=dt*(1-chill*.5);
  boss.age+=step;boss.fire-=step;boss.x+=(830-boss.x)*Math.min(1,dt*2);
  const targetY=270+Math.sin(boss.age*.8)*120;
  boss.y=boss.encounter?.phase===2?boss.y+(targetY-boss.y)*Math.min(1,dt*3):targetY;
  const delayed=boss.delayedVolley;
  if(delayed){
   delayed.wait-=step;
   if(delayed.wait<=0){
    if(delayed.part.hp>0)fireBossPhaseSalvo(boss,delayed.part,delayed.target,true);
    boss.delayedVolley=null;
   }
  }
   if(boss.fire<=.55&&!boss.aimTarget)boss.aimTarget={x:player.x,y:player.y};
 }else{
  boss.aimTarget=null;
 }
 if(!repositioning&&boss.fire<=0){
  const profile=boss.encounter?.phase===2?bossPhaseProfiles[boss.i]:null;
  bossVolley(boss,profile);
  boss.aimTarget=null;
  boss.fire=(profile?.interval??(boss.i===4?1.8:2.5))/(1+threat*.12);
 }

 const impactPart=boss.parts.find(part=>part.hp>0&&partHit(player,boss,part));
 if(impactPart)hurt(strikeMovement&&strike.launched?'strike':'boss',boss.x+impactPart.aim[0],boss.y+impactPart.aim[1]);
}
function bossAimPoint(x,y,excluded,direction=1){
 if(!boss)return null;
 let target=null,closest=Infinity;
 for(const part of boss.parts){
  if(part.hp<=0||excluded?.has(part))continue;
  const aimX=boss.x+part.aim[0],aimY=boss.y+part.aim[1];
  const distance=Math.hypot(aimX-x,aimY-y);
  if((aimX-x)*direction>0&&distance<closest){
   target={x:aimX,y:aimY};
   closest=distance;
  }
 }
 return target;
}
function update(dt){
 if(state==='transition'){advanceTransition(dt);return}
 try{updateGameplay(dt)}catch(error){if(error!==transitionInterrupt)throw error}
}
function encounterThreat(time,cards,hasWine){
 const ranks=Object.values(cards).reduce((sum,rank)=>sum+rank,0);
 const comfort=(cards.healing||0)+(cards.agility||0)+(cards.magnet||0)+(cards.guard||0);
 const synergies=(cards.fork||0)*.3+(cards.cascade||0)*.25+(cards.shatter||0)*.3+
  (cards.echoForge||0)*.35+(cards.orbital||0)*.3;
 return Math.min(4.5,time/440+(ranks-comfort)*.055+synergies*.5+(hasWine?.1:0));
}
function updateGameplay(dt){
 if(state!=='playing')return;
 if(xp>=xpNeeded){offerCards();return}
 comboTime=Math.max(0,comboTime-dt);if(comboTime<=0)combo=0;
 const targetThreat=encounterThreat(t,upgrades,activeWeapon()>=0);
 threat+=(targetThreat-threat)*Math.min(1,dt*.25);
 const previousRunTime=runTime;runTime+=dt;
 bankRunTalents();
 for(let milestone=Math.floor(previousRunTime/300)+1;milestone<=Math.floor(runTime/300);milestone++)heal(1);
 if(player.metaBombs){for(const bomb of player.metaBombs){bomb.time-=dt;if(bomb.time<=0&&!bomb.exploded){bomb.exploded=true;ring(bomb.x,bomb.y,'#ffd58b',bomb.radius);for(const e of enemies)if(e.hp>0&&Math.hypot(e.x-bomb.x,e.y-bomb.y)<bomb.radius)damageEnemy(e,bomb.amount,e.x,e.y);if(boss)for(const part of [...boss.parts]){if(!boss)break;const x=boss.x+part.aim[0],y=boss.y+part.aim[1];if(part.hp>0&&Math.hypot(x-bomb.x,y-bomb.y)<bomb.radius)damagePart(part,bomb.amount,x,y)}}}player.metaBombs=player.metaBombs.filter(b=>!b.exploded)}
 const previousTime=t;
 if(secret)secretTime+=dt;else t+=dt;
 notice=Math.max(0,notice-dt);flash=Math.max(0,flash-dt);shake=Math.max(0,shake-dt*18);
 const nextLevel=Math.floor(t/180)%levels.length;if(!secret&&nextLevel!==levelIndex){levelIndex=nextLevel;notice=4;noticeText=levels[levelIndex]}
 player.metaQ10Speed=Math.max(0,(player.metaQ10Speed||0)-dt);player.metaRevenge=Math.max(0,(player.metaRevenge||0)-dt);player.metaBottleSpeed=Math.max(0,(player.metaBottleSpeed||0)-dt);player.guardFlash=Math.max(0,player.guardFlash-dt);player.metaAfterSpecial=Math.max(0,(player.metaAfterSpecial||0)-dt);player.metaGuardCooldown=Math.max(0,(player.metaGuardCooldown||0)-dt);player.metaGrazeSpeed=Math.max(0,(player.metaGrazeSpeed||0)-dt);player.metaHitSpeed=Math.max(0,(player.metaHitSpeed||0)-dt);player.metaGrazeInvCooldown=Math.max(0,(player.metaGrazeInvCooldown||0)-dt);const previousRage=player.overdrive;player.overdrive=Math.max(0,player.overdrive-dt);player.metaRageLock=Math.max(0,(player.metaRageLock||0)-dt);if(previousRage>0&&player.overdrive===0)player.metaAfterglow=1.5*(Number(owns('K2-16'))+Number(owns('K2-22')));else player.metaAfterglow=Math.max(0,player.metaAfterglow-dt);player.inv=Math.max(0,player.inv-dt);player.podCooldown=Math.max(0,player.podCooldown-dt);player.muzzle=Math.max(0,player.muzzle-dt);
 if(player.overdrive>0&&owns('K1-20')){player.metaLightning=(player.metaLightning||0)-dt;if(player.metaLightning<=0){player.metaLightning+=1;const targets=enemies.filter(e=>e.hp>0).sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y)).slice(0,owns('K1-23')?2:1);for(const e of targets){arcs.push({x:player.x,y:player.y,tx:e.x,ty:e.y,life:.16,maxLife:.16});damageEnemy(e,damage(.6),e.x,e.y)}}}
 player.verticalWine=Math.max(0,(player.verticalWine||0)-dt);
 for(let i=0;i<player.effects.length;i++)player.effects[i]=Math.max(0,player.effects[i]-dt);
 const dx=clamp(Number(keys.has('ArrowRight')||keys.has('KeyD'))-Number(keys.has('ArrowLeft')||keys.has('KeyA'))+padMove.x,-1,1);
 const dy=clamp(Number(keys.has('ArrowDown')||keys.has('KeyS'))-Number(keys.has('ArrowUp')||keys.has('KeyW'))+padMove.y,-1,1);
 player.metaBossSpeed=Math.max(0,(player.metaBossSpeed||0)-dt);
 const v1=.0075*(metaCount('V1',[1,2,3,4,6,7,8,9,11,12,14,15,17,18,19])+2*Number(owns('V1-21')))+(owns('V1-23')?.375:0)+(player.metaGrazeSpeed>0?.12:0)+(player.metaHitSpeed>0?.225:0)+(owns('V1-20')&&runTime-(player.metaLastHit||0)>=2?.075:0)+(hearts<=2?.045*metaCount('V3',[5,10]):0)+(hearts<=1&&owns('V3-22')?.225:0);
 const len=Math.max(1,Math.hypot(dx,dy)),speed=(activeWeapon()===4?300:220)*1.15*1.05*1.15*(1+cardValues.agility(upgrades.agility))*(owns('S2')?1.03:1)*(owns('B2-23')?.9:1)*(owns('V2-23')?.88:1)*(player.metaBossSpeed>0?1.15:1)*(1+v1+(owns('Q1')?.045:0)+(player.metaQ10Speed>0&&owns('Q10')?.12:0))*(player.metaBottleSpeed>0?1.15:1);
 player.x=clamp(player.x+dx/len*speed*dt,30,W-32);player.y=clamp(player.y+dy/len*speed*dt,90,H-34);
 const power=player.fieldPower;
 const clearing=power.beamTime>0?sweeperArea():null;
 power.launchCooldown=Math.max(0,power.launchCooldown-dt);
 updateAutoFire(dt);
 if(!secret&&!golden&&!goldenAppeared&&t>=420&&!boss&&t<nextBoss){goldenAppeared=true;golden={x:1000,y:clamp(player.y,110,460),w:64,h:38,age:0,kind:1};notice=4;noticeText='GOLDENE SUCUK! SCHIESS SIE AB!'}
 if(!secret&&!golden&&!secondAppeared&&t>=840&&!boss&&t<nextBoss){secondAppeared=true;golden={x:1000,y:clamp(player.y,110,460),w:44,h:50,age:0,kind:2};notice=4;noticeText='GRUBENLAMPE! SCHIESS SIE AB!'}
 if(golden){golden.x-=80*dt;golden.age+=dt;golden.y=clamp(golden.y+Math.sin(golden.age*3)*20*dt,90,490);if(golden.x< -60)golden=null}
 if(!secret&&!boss&&t>=nextBoss)startBoss(nextBoss===bazaarBossTime);if(secret&&!boss&&secretTime>=(secretType===2?60:45))startRuhrBoss();
 if(!boss){
  if(!secret&&t<introDuration)spawnIntroWave(previousTime);
  else if(!secret&&bossCount===0&&t>=bazaarStart&&t<bazaarBossTime)spawnBazaarWave(previousTime);
  else if(!secret&&bossCount===2&&t>=laterWaveStart&&t<laterWaveEnd)spawnLaterMainWaves(previousTime);
  else{
   spawn-=dt*enemyDensity((previousTime+t)/2);
   if(spawn<=0)spawnRegularEnemy();
  }
  if(!secret){
   spawnRearWave(previousTime);
   spawnBlocker(previousTime);
   spawnBlockerPatrol(dt);
  }
 }
 updatePickupSpawns(dt);
 updateFieldPowerupSpawns(dt);
 for(const b of bullets.slice()){
  const previousX=b.x,previousY=b.y;
  b.trailClock=(b.trailClock||0)+dt;if(b.trailClock>=.025){b.trailClock%=.025;(b.trail||(b.trail=[])).push({x:b.x,y:b.y});if(b.trail.length>7)b.trail.shift()}
  b.age=(b.age||0)+dt;b.life=(b.life===undefined?4:b.life)-dt;
  const carousel=b.carousel,orbiting=b.orbit&&b.age<b.orbit;
  const leavingCarousel=carousel&&!orbiting&&b.age-dt<b.orbit;
  if(orbiting||leavingCarousel){
   const angle=Math.min(b.age,b.orbit)*(b.orbitSpeed||7)+b.phase;
   b.x=player.x+22+Math.cos(angle)*b.orbitRadius;
   b.y=player.y+Math.sin(angle)*b.orbitRadius+(b.orbitOffset||0);
  }
  if(b.boomerangAt&&!b.returning&&!orbiting&&(b.age>=b.boomerangAt||b.returnContact))turnBoomerang(b);
  if(b.target)steerProjectile(b,rocketAim(b.target),12,dt);
  if((b.homing||b.seekRank)&&!(carousel&&(orbiting||leavingCarousel))){
   const direction=b.boomerangAt&&b.returning?-1:1;
   const target=enemies.filter(e=>e.hp>0&&(e.x-b.x)*direction>0&&e.x-e.w/2<W&&e.x+e.w/2>0&&!b.hit.has(e)&&e!==b.returnContact)
    .reduce((best,e)=>!best||Math.hypot(e.x-b.x,e.y-b.y)<Math.hypot(best.x-b.x,best.y-b.y)?e:best,null)||bossAimPoint(b.x,b.y,b.hit,direction);
   steerProjectile(b,target,b.seekRank?cardValues.seekShot(b.seekRank):3,dt);
  }
  if(b.gravity)b.vy+=b.gravity*dt;
  if(b.returnAt&&b.age>b.returnAt&&!b.returning){b.returning=true;b.vx=-Math.abs(b.vx);b.hit.clear()}
  if(b.wave){b.w+=dt*38;b.h+=dt*(b.charged?105:65)}
  if(b.vortex){b.pulse-=dt;if(b.pulse<=0){b.pulse=.3;b.hit.clear()}for(const e of enemies)if(e.hp>0&&Math.hypot(e.x-b.x,e.y-b.y)<b.vortex){e.x+=(b.x-e.x)*dt*.3;e.y+=(b.y-e.y)*dt*.7}}
  if(!orbiting){const flightDt=leavingCarousel?b.age-b.orbit:dt;b.x+=b.vx*flightDt;b.y+=b.vy*flightDt}
  if(b.phoenix){b.baseY+=b.vy*dt;b.y=b.baseY+Math.sin(b.age*9+b.phase)*22}
  if(b.snakeRank&&!(carousel&&orbiting)){
   const age=carousel?b.age-b.orbit:b.age,phase=age*8;
   const start=carousel?Math.max(0,age-dt):age-dt;
   b.y+=(b.phoenix||orbiting?Math.sin(phase):Math.sin(phase)-Math.sin(start*8))*cardValues.snakeShot(b.snakeRank);
  }
  if(!orbiting&&(b.y<80||b.y>510)&&b.bounces>0){b.y=clamp(b.y,80,510);b.vy=-b.vy;b.bounces--;if(b.crust)bounceCrustFragment(b)}
  if(b.returning&&b.returnContact){
   const target=b.returnContact;
   if(!(target.aim?boss&&partHit(b,boss,target):hit(b,target)))b.returnContact=null;
  }
  b.stepX=b.x-previousX;b.stepY=b.y-previousY;

 }
 for(const s of shots.slice()){s.trailClock=(s.trailClock||0)+dt;if(s.trailClock>=.035){s.trailClock%=.035;(s.trail||(s.trail=[])).push({x:s.x,y:s.y});if(s.trail.length>4)s.trail.shift()}
  moveHostileShot(s,dt);s.life-=dt;
  if(s.life>0&&clearing&&hit(clearing,s)){s.life=0;particle(s.x,s.y,fieldPowerups.sweeper.color,3)}
  if(s.life>0&&s.burstAt&&s.age>=s.burstAt)burstHostileShot(s);
 }
 for(const p of pickups){const dx=player.x-p.x,dy=player.y-p.y,distance=Math.hypot(dx,dy);const radius=(78+cardValues.magnet(upgrades.magnet))*(1+.045*metaCount('B2',[1,2,3,4,6,7,8,9])+(owns('B2-23')?1.5:0))+(owns('B2-13')?60:0);p.x-=100*dt;if(distance<radius&&distance>1){p.x+=dx/distance*80*dt;p.y+=dy/distance*80*dt}p.age=(p.age||0)+dt;if(styles[p.i]&&p.x-p.w/2<W)player.weaponWineSeen=true}
 for(const orb of orbs){
  orb.age+=dt;
  orb.x-=(orb.speed||0)*dt;
  const dx=player.x-orb.x,dy=player.y-orb.y,d=Math.hypot(dx,dy);
  if(d===0)continue;
  const radius=(78+cardValues.magnet(upgrades.magnet,true))*(1+(owns('S4')?.075:0)+.03*metaCount('B1',[1,2,3,4,6,7,8,9])+.03*metaCount('B3',[5,10])+(player.overdrive>0?.045*metaCount('K3',[5,10]):0))+(orb.kind==='elite'&&owns('B3-16')?45:0);
  if(d>=radius)continue;
  const step=Math.min(d,260*dt);
  orb.x+=dx/d*step;
  orb.y+=dy/d*step;
 }
 for(const e of enemies){
  e.age+=dt;e.shatterCooldown=Math.max(0,(e.shatterCooldown||0)-dt);e.flash=Math.max(0,e.flash-dt);e.slowTime=Math.max(0,(e.slowTime||0)-dt);if(e.slowTime<=0)e.slow=0;
  if(e.burnLife>0&&e.hp>0){e.burnLife-=dt;e.metaLastDamage=e.burnDps*dt;e.hp-=e.metaLastDamage;if(e.hp<=0)death(e);else if(Math.random()<dt*8)particle(e.x,e.y,'#ffb483',1)}
  if(e.hp<=0)continue;
  if(e.patrol){
   if(e.age>=e.lifetime){e.hp=0;continue}
   moveBlockerPatrol(e,dt);
  }else{
   const entering=e.blocker&&e.x>W-e.w/2;
   e.x+=(e.rear?1:-1)*enemySpeed(e)*(entering?3:1)*dt;
   if(e.rear){
    if(e.x<player.x)e.y+=clamp(player.y-e.y,-38*dt,38*dt);
   }else if(e.blocker){
    if(e.age>=e.lifetime){e.hp=0;continue}
   }else{
    const wave=[0,30,45,0,55,20,0,0,42,12][e.i];
    const verticalSpeed=e.entryDrift??Math.cos(e.age*(e.i===4?6:2)+e.phase)*wave;
    e.y=clamp(e.y+verticalSpeed*(1-(e.slow||0))*dt,95,495);
    if(e.i===6){const phase=e.age%3;e.warning=phase>.7&&phase<=1.1}
   }
  }
  if(!e.patrol&&e.x-e.w/2<W&&e.x+e.w/2>0){
   e.fire-=dt*(1-(e.slow||0)*.4);
   if(e.fire<=.55&&!e.aimTarget)e.aimTarget={x:player.x,y:player.y};
   e.pulseCharging=(e.rareEnemy?e.rareEnemy.attack==='pulse':e.i===7)&&e.fire<=.55;
   if(e.fire<=0){
    enemyAttack(e);e.aimTarget=null;e.pulseCharging=false;
    e.fire=e.blocker?4:e.rear?3.4:e.rareEnemy?4.8:e.introSimit?4:rand(1.8,3.1)/(1+threat*.16)/(e.elite?1.12:1);
   }
  }
  if(hit(player,{...e,w:e.w-8,h:e.h-8}))hurt('contact',e.x,e.y);
 }
 updateBoss(dt);
 if(state!=='playing')return;
 launchOrbitRocket();
 for(const beam of beams){
  beam.x=player.x+27;const baseY=player.y-2+(beam.offset||0);beam.seekOffset=beam.seekOffset||0;if(beam.seekRank){const target=enemies.find(e=>e.hp>0&&e.x>beam.x&&Math.abs(e.y-baseY)<300)||bossAimPoint(beam.x,baseY+beam.seekOffset);if(target)beam.seekOffset+=(target.y-baseY-beam.seekOffset)*Math.min(1,dt*cardValues.seekShot(beam.seekRank,true))}beam.y=baseY+beam.seekOffset+(beam.snakeRank?Math.sin((beam.maxLife-beam.life)*8)*cardValues.snakeShot(beam.snakeRank,true):0);beam.life-=dt;beam.tick-=dt;
  if(golden&&golden.x>=beam.x&&Math.abs(golden.y-beam.y)<golden.h/2+beam.width){score+=500;beginTransition('enter');break}
  if(beam.tick<=0){beam.tick=.12;const beamHit=(target,amount,x,y)=>{const split=beam.breakRank&&beam.splitTargets&&!beam.splitTargets.has(target)?beam.breakRank:0;if(split)beam.splitTargets.add(target);onHit({damage:amount,style:'prism',vx:1,vy:0,charged:beam.charged,elements:beam.elements,metaCritical:beam.metaCritical,breakRank:split,seekRank:beam.seekRank,snakeRank:beam.snakeRank},target,x,y)};for(const e of enemies)if(e.x>beam.x&&Math.abs(e.y-beam.y)<e.h/2+beam.width/2){e.lastCharged=!!beam.charged;e.lastImpact=beam.style||'port';damageEnemy(e,modifyDirectHit(e,beam.damage,beam,false,e.x,beam.y),e.x,beam.y);beamHit(e,beam.damage,e.x,beam.y)};
   if(boss)for(const part of [...boss.parts]){if(!boss)break;if(part.hp>0&&partHit({x:(W+beam.x)/2,y:beam.y,w:W-beam.x,h:beam.width},boss,part)){const x=boss.x+part.aim[0],amount=beam.damage*(beam.charged?.35:1)*(beam.charged&&owns('Q8')?1.075:1);damagePart(part,modifyDirectHit(part,amount,beam,true,x,beam.y),x,beam.y);beamHit(part,amount,x,beam.y)}}
  }
 }
 for(const b of bullets){
  if(b.dead||b.returnContact&&!b.returning)continue;
  const rocket=b.style==='rocket';
  if(rocket&&b.life<=0)continue;
  if(!rocket&&golden&&hit(b,golden)){score+=500;beginTransition('enter');break}
  for(const e of enemies){if(e.hp<=0||e===b.returnContact||b.hit.has(e)||!hit(b,e))continue;
   b.hit.add(e);e.lastCharged=!!(b.charged||b.sourceCharged);e.lastImpact=b.style;
   damageEnemy(e,modifyDirectHit(e,b.damage||1,b,false,b.x,b.y),b.x,b.y);
   if(!rocket)onHit(b,e,b.x,b.y);
   if(b.blast)splash(b);
   if(finishProjectileHit(b,e))break;
  }
  if(boss&&!b.dead&&(!b.returnContact||b.returning))for(const part of [...boss.parts]){
   if(!boss)break;if(part.hp<=0||part===b.returnContact||b.hit.has(part)||!partHit(b,boss,part))continue;
   b.hit.add(part);const amount=(b.damage||1)*(b.charged?.35:1)*(b.charged&&owns('Q8')?1.075:1);
   damagePart(part,modifyDirectHit(part,amount,b,true,b.x,b.y),b.x,b.y);
   if(!rocket){
    const impact={...b,damage:amount};
    onHit(impact,part,b.x,b.y);b.fragmented=impact.fragmented;
   }
   if(finishProjectileHit(b,part))break;
  }
 }
 for(const s of shots){
  const pod={x:player.x,y:player.y,w:player.w+14,h:player.h+14};
  if(s.life>0&&clearing&&hit(clearing,s)){s.life=0;particle(s.x,s.y,fieldPowerups.sweeper.color,3)}
  else if(s.life>0&&power.shieldTime>0&&power.shield>0&&hit(player,s)){
   s.life=0;power.shield--;impact(s.x,s.y,fieldPowerups.shield.color);sound('block');addRage(10);
  }
  else if(s.life>0&&owns('V2-13')&&player.metaGuardCooldown<=0&&Math.hypot(s.x-player.x,s.y-player.y)<55){s.life=0;player.metaGuardCooldown=(owns('V2-16')?13.33:16.67)/(owns('V2-23')?1.6:1);impact(s.x,s.y,'#aeeaff',12);sound('block')}
  else if(s.life>0&&player.podCooldown<=0&&hit(pod,s)){s.life=0;player.guardFlash=.16;const reduction=.045*metaCount('V2',[5,10])+.015*(metaCount('V2',[11,12,14,15,17,18,19])+2*Number(owns('V2-21')));player.podCooldown=2.5*cardValues.guard(upgrades.guard)*(1-reduction-(owns('Q4')&&player.overdrive>0?.075:0))/(owns('V2-23')?1.6:1);impact(pod.x,pod.y,'#aeeaff',12);addRage(10);sound('block')}
  else if(s.life>0&&hit(player,s)){
   s.life=0;
   hurt('projectile',s.originX??(s.x-s.vx*.05),s.y-s.vy*.05);
  }
  else if(s.life>0&&!s.grazed&&player.inv<=0&&Math.hypot(s.x-player.x,s.y-player.y)<42*(1+.03*metaCount('V1',[5,10]))){s.grazed=true;if(owns('V1-13'))player.metaGrazeSpeed=2;if(owns('V1-22')&&player.metaGrazeInvCooldown<=0){player.inv=Math.max(player.inv,.3);player.metaGrazeInvCooldown=8}addRage(2,true);score+=25;particle(player.x,player.y,'#b5f7ff',3);sound('graze')}
 }
 power.shieldTime=Math.max(0,power.shieldTime-dt);
 if(power.shieldTime===0)power.shield=0;
 power.beamTime=Math.max(0,power.beamTime-dt);
 if(state!=='playing')return;
 for(const orb of orbs)if(hit(player,orb)){const elite=orb.kind==='elite',bossOrb=orb.kind==='boss';const bonus=.015*(metaCount('B1',[5,10,11,12,14,15,17,18,19])+2*Number(owns('B1-21')))+(owns('B1-16')&&elite?.15:0)+(owns('B1-23')?.30:0)+(owns('Q5')&&player.overdrive>0?.075:0)+(elite?.015*metaCount('B3',[1,2,3,4,6,7,8,9]):0)+(bossOrb?.015*(metaCount('B3',[11,12,14,15,17,18,19])+2*Number(owns('B3-21'))):0)+(bossOrb&&owns('B3-13')?.225:0)+(owns('B3-23')?(elite||bossOrb?.45:-.10):0);xp+=orb.value*(1+bonus)*1.25*orbXpMultiplier;orb.collected=true;player.metaOrbs=(player.metaOrbs||0)+1;const wave=(owns('B1-20')&&player.metaOrbs%25===0)||(bossOrb&&owns('B3-22'));if(wave){const radius=112.5+(owns('B1-22')?37.5:0),amount=damage(1.5+(owns('B1-22')?.75:0));ring(player.x,player.y,'#80faff',radius);for(const e of enemies)if(e.hp>0&&Math.hypot(e.x-player.x,e.y-player.y)<radius)damageEnemy(e,amount,e.x,e.y)}}
 orbs=orbs.filter(orb=>!orb.collected&&orb.x+orb.w/2>=0);if(xp>=xpNeeded){offerCards();return}
 for(const p of pickups)if(!p.dead&&hit(player,p)){
  if(fieldPowerups[p.i]){collectFieldPowerup(p);continue}
  if(p.i!==5&&p.i!==16){if(owns('Q10'))player.metaQ10Speed=3;if(owns('W3-22'))player.metaWeaponSpecial=true;if(owns('W3-13')){ring(player.x,player.y,'#ffd58b',90);for(const e of enemies)if(e.hp>0&&Math.hypot(e.x-player.x,e.y-player.y)<90)damageEnemy(e,damage(.75),e.x,e.y)}}
  if(p.i===16){const weapon=activeWeapon();if(weapon>=0)player.effects[weapon]=player.effectMax||18;else player.verticalWine=10}else if(p.i===5)heal(1);else{const first=!player.metaWeaponFound;player.metaWeaponFound=true;if(first&&owns('Q7'))player.rage=Math.min(100,player.rage+7.5);player.weapon=p.i;player.effects=player.effects.map((v,i)=>i===2?v:0);if(owns('W2-16'))player.metaBottleSpeed=2;const duration=1+.015*metaCount('W2',[1,2,3,4,6,7,8,9])+.045*metaCount('B2',[5,10])+.015*(metaCount('B2',[11,12,14,15,17,18,19])+2*Number(owns('B2-21')))+(owns('S5')?.045:0)+(owns('Q6')&&player.overdrive>0?.075:0)+(first&&owns('B2-16')?.30:0)+(first&&owns('B2-20')?1/3:0);player.effectMax=player.effects[p.i]=18*(1+cardValues.duration(upgrades.duration)+cardValues.cellar(upgrades.cellar))*duration*(owns('V1-23')?.85:1)*(owns('W2-23')?.8:1);if(owns('B2-22')&&!player.metaBottleHealed&&hearts<MAX_HEARTS){heal(1);player.metaBottleHealed=true}}
  sound(p.i===5?'heal':'pickup',{style:styles[p.i]||'normal'});p.dead=true;notice=2.6;noticeText=p.i===16?(player.verticalWine>0&&activeWeapon()<0?'SONDERWEIN · OBEN UND UNTEN':'SONDERWEIN · WEIN AUFGEFÜLLT'):p.i===5?'TRAUBENMOST · EIN HERZ':powerNames[p.i].toUpperCase()+' · '+weaponNames[p.i];ring(p.x,p.y,colors[p.i]||'#ffd34e',60);particle(p.x,p.y,colors[p.i]||'#ffd34e',24);
 }
 for(const p of particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=100*dt;p.life-=dt}
 for(const d of deaths){d.age+=dt;d.life-=dt}
 for(const r of rings)r.life-=dt;for(const a of arcs)a.life-=dt;for(const f of flashes)f.life-=dt;
 enemies=enemies.filter(e=>e.hp>0&&(e.patrol||e.x>-100&&(!e.rear||e.x-e.w/2<W)));bullets=bullets.filter(b=>!b.dead&&b.life>0&&b.x<W+60&&b.x>-60&&b.y>-50&&b.y<H+50);
 shots=shots.filter(s=>s.life>0&&s.x>-30&&s.x<W+30&&s.y>-30&&s.y<H+30);pickups=pickups.filter(p=>!p.dead&&p.x>-30);
 particles=particles.filter(p=>p.life>0);deaths=deaths.filter(d=>d.life>0);rings=rings.filter(r=>r.life>0);beams=beams.filter(b=>b.life>0);arcs=arcs.filter(a=>a.life>0);flashes=flashes.filter(f=>f.life>0).slice(-28);
}
function drawFieldPickup(p){
 const {color,icon}=fieldPowerups[p.i],y=p.y+Math.sin(p.age*4)*3;
 c.save();c.translate(p.x,y);c.rotate(Math.PI/4);
 c.fillStyle='#18262f';c.strokeStyle=color;c.lineWidth=2;
 c.fillRect(-12,-12,24,24);c.strokeRect(-12,-12,24,24);
 c.rotate(-Math.PI/4);c.fillStyle=color;c.font='bold 18px monospace';c.textAlign='center';c.textBaseline='middle';c.fillText(icon,0,1);c.restore();
}
function drawRocket(x,y,angle,launched){
 c.save();c.translate(x,y);c.rotate(angle);
 if(launched){c.fillStyle='#ff9656';c.fillRect(-13,-2,9,4)}
 c.fillStyle='#402c26';c.fillRect(-7,-5,12,10);
 c.fillStyle=fieldPowerups.rockets.color;c.fillRect(-6,-3,11,6);c.fillRect(5,-2,3,4);c.fillRect(8,-1,2,2);
 c.fillStyle='#fffae1';c.fillRect(0,-2,4,2);c.restore();
}
function drawFieldPowerEffects(){
 const power=player.fieldPower;
 for(let i=0;i<power.rockets;i++){
  const {x,y,angle}=rocketOrbitPosition(i);
  drawRocket(x,y,angle+Math.PI/2,false);
 }
 if(power.shield>0){
  c.save();c.strokeStyle=fieldPowerups.shield.color;c.lineWidth=3;
  c.globalAlpha=power.shieldTime<2?.45+Math.sin(runTime*20)*.25:.9;
  for(let i=0;i<power.shield;i++){
   c.beginPath();c.arc(player.x,player.y,49,i*Math.PI+.18,(i+1)*Math.PI-.18);c.stroke();
  }
  c.restore();
 }
 if(power.beamTime>0){
  const {x,y,w,h}=sweeperArea();
  c.save();c.fillStyle=fieldPowerups.sweeper.color;c.globalAlpha=.32;c.fillRect(x-w/2,y-h/2,w,h);
  c.fillStyle='#fff2ff';c.globalAlpha=.85;c.fillRect(x-w/2,y-2,w,4);c.restore();
 }
}
function drawLanternArmor(e){
 const x=e.x-e.w/2+6,y=e.y-e.h*.36,height=e.h*.72;
 c.save();c.fillStyle=e.armorFlash>runTime?'#fff4be':'#cd9c56';
 c.fillRect(x,y+6,4,height-12);c.fillRect(x+4,y,5,7);c.fillRect(x+4,y+height-7,5,7);c.restore();
}
function drawVizierArmor(part){
 c.save();c.translate(boss.x,boss.y);c.beginPath();
 c.moveTo(...part.points[0]);for(const point of part.points.slice(1))c.lineTo(...point);
 c.closePath();c.fillStyle=part.armorFlash>runTime?'#fff8c7':'#df9f55';c.globalAlpha=.24;c.fill();
 c.globalAlpha=.85;c.strokeStyle='#f4cc83';c.lineWidth=2;c.stroke();c.restore();
}
function render(){
 c.save();const now=secret?secretTime:t;c.translate(shake>0?Math.sin(now*83)*shake:0,shake>0?Math.cos(now*77)*shake*.5:0);
 PfertArt.background(c,levelIndex,now,secret?secretType:0);
 for(const p of pickups){
  if(fieldPowerups[p.i])drawFieldPickup(p);
  else PfertArt.bottle(c,{...p,element:weaponElements[p.i]});
 }
 if(player&&player.metaBombs)for(const b of player.metaBombs){c.fillStyle='#ffd58b';c.beginPath();c.arc(b.x,b.y,6,0,Math.PI*2);c.fill()}
 for(const orb of orbs)PfertArt.experienceOrb(c,orb);
 if(golden)PfertArt.golden(c,golden);
 const sceneLights=flashes.slice(-4).map(f=>({x:f.x,y:f.y,strength:f.life/f.maxLife,color:f.magic?'#a4ddff':'#ffcd8c'}));for(const b of bullets.filter(b=>b.charged).slice(-3))sceneLights.push({x:b.x,y:b.y,strength:.6,color:['red','phoenix','mortar'].includes(b.style)?'#ffba80':'#9edbff'});
 for(const e of enemies){let light=null;for(const source of sceneLights){const strength=source.strength*Math.max(0,1-Math.hypot(e.x-source.x,e.y-source.y)/110);if(strength>(light?light.strength:0))light={strength,color:source.color}}PfertArt.enemy(c,e,levelIndex,secret?secretType:0,light);
  if(e.patrol?.sprite==='lantern')drawLanternArmor(e);
 }
 if(boss){
  PfertArt.boss(c,boss,secret);
  for(const part of boss.parts)if(vizierGuard(part))drawVizierArmor(part);
  if(boss.aimTarget&&nextBossAttack(boss)==='pulse'){
   const part=bossFiringPart(boss);
   if(part)PfertArt.pulseCharge(c,boss.x+part.aim[0],boss.y+part.aim[1]);
  }
 }
 for(const d of deaths)PfertArt.death(c,d,levelIndex);
 for(const b of bullets){PfertArt.trail(c,b);if(b.style==='rocket')drawRocket(b.x,b.y,Math.atan2(b.vy,b.vx),true);else PfertArt.bullet(c,b)}
 for(const beam of beams)PfertArt.beam(c,beam,now);
 for(const arc of arcs)PfertArt.arc(c,arc);for(const f of flashes)PfertArt.flash(c,f);
 for(const r of rings)PfertArt.ring(c,r);
 for(const p of particles)PfertArt.spark(c,p);c.globalAlpha=1;
 PfertArt.horse(c,player||{x:140,y:300,effects:[],charge:0},now,player?chargeLimit():1.5);
 if(player&&state==='playing'){const shields=[player.effects[2]>0,owns('V2-20')&&!player.metaShieldUsed,player.podCooldown<=0];if(owns('V2-13'))shields.push(player.metaGuardCooldown<=0);c.save();c.lineWidth=3;c.shadowBlur=10;c.shadowColor='#8df6ff';shields.forEach((ready,i)=>{const start=-Math.PI/2+i*Math.PI*2/shields.length;c.strokeStyle=ready?'#9ffaff':'#50686a';c.globalAlpha=ready?.95:.35;c.beginPath();c.arc(player.x,player.y,43,start+.08,start+Math.PI*2/shields.length-.08);c.stroke()});c.globalAlpha=1;c.shadowBlur=0;c.fillStyle='#eaffff';c.font='bold 10px monospace';c.textAlign='center';c.fillText(String(shields.filter(Boolean).length),player.x,player.y-47);c.restore()}
 if(player&&state==='playing'&&owns('V2-13')){const angle=runTime*2; c.fillStyle=player.metaGuardCooldown>0?'#71888b':'#fff0aa';c.beginPath();c.arc(player.x+Math.cos(angle)*45,player.y+Math.sin(angle)*32,6,0,Math.PI*2);c.fill()}
 if(player)drawFieldPowerEffects();
 for(const s of shots)if(s.life>0)PfertArt.hostile(c,s);
 if(player)PfertArt.hitCue(c,player,runTime);
 if(boss)PfertArt.bossStrikeWarning(c,boss);
 c.restore();
 if(player&&(state==='playing'||state==='upgrade'||state==='transition'||state==='paused')){
  const weapon=activeWeapon();
  const hudNotice=noticeText==='KÄSERAUSCH BEREIT · Q'&&lastFlightInput==='gamepad'?'KÄSERAUSCH BEREIT · ['+padButtons[1]+']':noticeText;
  PfertArt.hud(c,{hearts,score,t,runTime,secret,secretType,secretTime,player,boss,weapon,wine:wineStatus(weapon),weaponNames,bosses,level,xp,xpNeeded,notice,noticeText:hudNotice,upgrades,build:collectedCards(),combo,threat,elements:attackElements(),maxHearts:MAX_HEARTS,talentPoints:metaTimePoints+metaBosses});
  if(flash>0){c.fillStyle='rgba(255,80,60,'+flash+')';c.fillRect(0,0,W,H)}
 }
}
function pollGamepad(now=Date.now()){
 const pads=typeof navigator!=='undefined'&&navigator.getGamepads?navigator.getGamepads():[];const pad=Array.from(pads||[]).find(p=>p&&p.mapping==='standard');
 const id=pad?(pad.id||''):null;
 if(id!==padId){
  padId=id;
  padButtons=/(?:dual\s*(?:sense|shock)|play\s*station|sony|vendor:\s*0?54c\b|^0?54c-)/i.test(id||'')?playStationButtons:xboxButtons;
  if(!pad)lastFlightInput='keyboard';
  if(pad)overlay.classList.add('has-gamepad');
  else overlay.classList.remove('has-gamepad');
  refreshPadHints();
 }
 const b=i=>!!(pad&&pad.buttons[i]&&pad.buttons[i].pressed),axis=i=>pad&&Math.abs(pad.axes[i]||0)>.2?pad.axes[i]:0;
 const left=b(14)||axis(0)<-.5,right=b(15)||axis(0)>.5,up=b(12)||axis(1)<-.5,down=b(13)||axis(1)>.5,a=b(0),rage=b(1),menu=b(9);
 padMove={x:clamp(axis(0)+Number(b(15))-Number(b(14)),-1,1),y:clamp(axis(1)+Number(b(13))-Number(b(12)),-1,1)};
 if((state==='playing'||state==='menu'||state==='over')&&(a||rage||padMove.x||padMove.y))lastFlightInput='gamepad';
 if(padBlocked){
  if(!a&&!b(12)&&!b(13)&&!b(14)&&!b(15)&&!axis(0)&&!axis(1)&&!rage&&!menu)padBlocked=false;
  padMove={x:0,y:0};
  padPrev={a,left,right,up,down,rage,menu};
  metaBStart=null;metaBLong=false;
  return;
 }
 if(menu&&!padPrev.menu){
  if(state==='paused')resumeGame();
  else if(state==='playing'||state==='transition')pauseGame();
 }
 if(state==='paused'||padBlocked){
  padMove={x:0,y:0};padPrev={a,left,right,up,down,rage,menu};return;
 }
 if(state==='transition'){padMove={x:0,y:0};padPrev={a,left,right,up,down,rage,menu};return}
  if(padBlocked){metaBStart=null;metaBLong=false;if(!a&&!left&&!right&&!up&&!down&&!rage&&!menu)padBlocked=false}else if(state==='talents'){if(left&&!padPrev.left)moveTalent(-1,0);if(right&&!padPrev.right)moveTalent(1,0);if(up&&!padPrev.up)moveTalent(0,-1);if(down&&!padPrev.down)moveTalent(0,1);if(a&&!padPrev.a)document.getElementById('meta-buy').click();if(rage&&!padPrev.rage){metaBStart=now;metaBLong=false}if(rage&&metaBStart!==null&&!metaBLong&&now-metaBStart>=700){metaBLong=true;document.getElementById('meta-back').click()}if(!rage&&padPrev.rage&&metaBStart!==null){if(!metaBLong)sellSelectedTalent();metaBStart=null;metaBLong=false}if(menu&&!padPrev.menu)document.getElementById('meta-back').click()}else if(state==='upgrade'){if(left&&!padPrev.left)selectCard(selectedCard-1);if(right&&!padPrev.right)selectCard(selectedCard+1);if(a&&!padPrev.a)chooseCard(selectedCard)}else if(state==='menu'||state==='over'){if(rage&&!padPrev.rage&&metaAvailable){showTalents();padBlocked=true}else if(a&&!padPrev.a){reset();padBlocked=true}}else if(state==='playing'){
 if(a&&!padPrev.a)fireSpecial();if(rage&&!padPrev.rage)activateRage();}
 padPrev={a,left,right,up,down,rage,menu};
}
function frame(now){pollGamepad(now);const dt=last===0?0:Math.min((now-last)/1000,.05);last=now;update(dt);if(state==='transition'||(state==='paused'&&pausedFrom==='transition'))renderTransition();else render();requestAnimationFrame(frame)}
requestAnimationFrame(frame);
 function snapshot(){const image=document.createElement('canvas');image.width=W;image.height=H;image.getContext('2d').drawImage(canvas,0,0);return image}
 function beginTransition(direction){
  render();const image=snapshot();cancelCharge();padBlocked=true;padMove={x:0,y:0};
  transition={direction,elapsed:0,image,switched:false};state='transition';sound('transition');throw transitionInterrupt;
 }
 function advanceTransition(dt){
  transition.elapsed=Math.min(3,transition.elapsed+dt);
  if(!transition.switched&&transition.elapsed>=1.5){
   transition.switched=true;if(transition.direction==='enter')enterRuhr();else leaveRuhr();
   render();transition.image=snapshot();
  }
  if(transition.elapsed>=3){transition=null;state='playing';keys.clear();padBlocked=true}
 }
 function renderTransition(){
  const progress=transition.switched?(transition.elapsed-1.5)/1.5:1-transition.elapsed/1.5;
  const scale=Math.max(0,Math.min(1,progress)),twist=(1-scale)*Math.PI*2;
  c.fillStyle='#080d1b';c.fillRect(0,0,W,H);
  if(scale<=0)return;
  // Small independently rotated tiles make the entire captured frame spiral inward.
  const cols=24,rows=14,tw=W/cols,th=H/rows;
  for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
   const sx=x*tw,sy=y*th,dx=sx+tw/2-W/2,dy=sy+th/2-H/2;
   const angle=twist*(1-Math.min(1,Math.hypot(dx/(W/2),dy/(H/2)))*.45),cos=Math.cos(angle),sin=Math.sin(angle);
   c.save();c.translate(W/2+scale*(dx*cos-dy*sin),H/2+scale*(dx*sin+dy*cos));c.rotate(angle);c.scale(scale,scale);
   c.drawImage(transition.image,sx,sy,tw,th,-tw/2,-th/2,tw+.5,th+.5);c.restore();
  }
 }


})();
