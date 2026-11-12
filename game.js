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
 {id:'multiShot',icon:'⋮',title:'Doppelter Käse',desc:'Zusätzliche Standardgeschosse und Wein-Sonderangriffe.',max:3},
 {id:'fanShot',icon:'⋔',title:'Streuflug',desc:'Zwei zusätzliche Fächerschüsse je Rang; auch für Wein-Sonderangriffe.',max:3},
 {id:'snakeShot',icon:'∿',title:'Schlangenlinie',desc:'Standardgeschosse und Wein-Sonderangriffe schwingen.',max:3},
 {id:'seekShot',icon:'◎',title:'Spürnase',desc:'Standardgeschosse und Wein-Sonderangriffe verfolgen Gegner.',max:3},
 {id:'breakShot',icon:'✣',title:'Käsebruch',desc:'Standardgeschosse und Wein-Sonderangriffe splittern beim Treffer.',max:3},
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
 {id:'fork',icon:'⋏',title:'Splittergelage',desc:'Treffer verzweigen in zwei weitere Geschosse. Splitter erben deine Treffer-Effekte.',max:2,rare:true,requires:u=>u.spread>0||u.pierce>0},
 {id:'cascade',icon:'ϟ',title:'Kettenreaktion',desc:'45 % MEHR Kettenschaden je Rang. Ketten übertragen Frost und Glut.',max:3,rare:true,requires:u=>u.chain>0},
 {id:'shatter',icon:'❄',title:'Thermischer Schock',desc:'Frost + Glut zünden eine Flächenexplosion mit 40 % Trefferschaden je Rang.',max:2,rare:true,requires:u=>u.frost>0&&u.ember>0},
 {id:'echoForge',icon:'»',title:'Echokammer',desc:'Jeder vierte Angriff wiederholt deine echte Waffe mit 45 % Stärke.',max:1,rare:true,requires:u=>u.echo>0},
 {id:'orbital',icon:'◎',title:'Mondschmelze',desc:'Jeder Sonderangriff erschafft zusätzlich zwei kreisende Käsemonde.',max:2,rare:true,requires:u=>u.guard>0},
 {id:'mastery',icon:'✦',title:'Feinschliff',desc:'+1 % zusätzlicher Waffenschaden.',max:Infinity,repeatable:true},
 {id:'tempo',icon:'ϟ',title:'Fingerfertigkeit',desc:'+1 % Sonderangriffsschaden je Rang.',max:Infinity,repeatable:true},
 {id:'cellar',icon:'∞',title:'Gläserpflege',desc:'+1 % zusätzliche Wein- und Laserdauer.',max:Infinity,repeatable:true}
];
let metaLastCritical=false;
let transition=null;
const transitionInterrupt={};
let state='menu', t=0, runTime=0, level=1, xp=0, xpNeeded=10, choices=[], score=0, hearts=MAX_HEARTS, player;
let orbs=[];
let enemies=[], bullets=[], shots=[], pickups=[], particles=[], deaths=[], rings=[], beams=[];
let boss=null, spawn=1, drop=8, nextBoss=300, bossCount=0, last=0, flash=0, shake=0;
let notice=0, noticeText='', levelIndex=0, secret=false, secretTime=0, golden=null, goldenAppeared=false, secondAppeared=false, secretType=0, combo=0, comboTime=0, threat=0, arcs=[], flashes=[];
let upgrades={}, selectedCard=0, lastRare=null, padPrev={}, padMove={x:0,y:0}, padBlocked=false;
const metaAvailable=typeof PfertMeta!=='undefined';
let metaData=metaAvailable?PfertMeta.fresh():null, metaWarning='', metaBosses=0, metaReturn='menu', metaOverlay='', metaSelected='S1', metaZoom=.3, metaPositions={}, metaPan={x:0,y:0}, metaPanReady=false;
if(metaAvailable){try{const loaded=PfertMeta.load(window.localStorage);metaData=loaded.data;metaWarning=loaded.error||'';}catch(e){metaWarning='Fortschritt kann nicht dauerhaft gespeichert werden.'}}
function metaSave(){try{if(!PfertMeta.save(window.localStorage,metaData))metaWarning='Fortschritt kann nicht dauerhaft gespeichert werden.'}catch(e){metaWarning='Fortschritt kann nicht dauerhaft gespeichert werden.'}}
function owns(id){return !!(metaData&&metaData.purchased.includes(id))}
let metaNavigating=false,metaBStart=null,metaBLong=false;
function sellSelectedTalent(){const next=PfertMeta.sell(metaData,metaSelected);if(next){metaData=next;metaSave();renderTalents()}else if(PfertMeta.rank(metaData,metaSelected)>0){overlay.querySelector('.meta-detail').textContent='Dieser Knoten kann nicht entfernt werden, solange dadurch andere gekaufte Knoten vom Start getrennt würden.'}}
function metaCount(prefix,numbers){if(!metaAvailable||!metaData)return 0;const roots=new Set(numbers.map(n=>PfertMeta.canonical(prefix+'-'+n)));return [...roots].reduce((sum,id)=>sum+(PfertMeta.limit(id)>1?PfertMeta.rank(metaData,id):Number(owns(id))),0)}
function talentReady(id){return /^S[1-5]$/.test(id)||/^Q(?:[1-9]|10)$/.test(id)||/^(?:A1|A2|A3|V1|V2|V3|K1|K2|K3|B1|B2|B3|W1|W2|W3)-(?:[1-9]|1[0-9]|2[0-3])$/.test(id)}
function showTalents(){
 if(!metaAvailable||(state!=='menu'&&state!=='over'))return;
 metaReturn=state;metaOverlay=overlay.innerHTML;state='talents';metaZoom=0;metaPanReady=false;overlay.classList.add('talent-overlay');padBlocked=true;renderTalents();
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
 const lines=PfertMeta.edges.filter(([a,b])=>revealed.has(a)&&revealed.has(b)&&(PfertMeta.rank(metaData,a)>0||PfertMeta.rank(metaData,b)>0)).map(([a,b])=>'<line x1="'+positions[a].x+'" y1="'+positions[a].y+'" x2="'+positions[b].x+'" y2="'+positions[b].y+'"/>').join('');
 const nodes=PfertMeta.nodes.filter(id=>revealed.has(id)).map(id=>{const p=positions[id];return '<button class="meta-node area-'+id[0]+(PfertMeta.rank(metaData,id)>0?' owned':'')+(id===metaSelected?' selected':'')+'" data-id="'+id+'" style="left:'+p.x+'px;top:'+p.y+'px" aria-label="'+id+'">'+(PfertMeta.rank(metaData,id)>0?'✓ ':'')+id+(PfertMeta.limit(id)>1?' '+PfertMeta.rank(metaData,id)+'/5':'')+'</button>'}).join('');
 const description=typeof PfertMetaData!=='undefined'?PfertMeta.describe(metaData,metaSelected,PfertMetaData.descriptions[metaSelected]):metaSelected;
 overlay.innerHTML='<div class="meta-toolbar"><strong>TALENTBAUM · '+metaData.points+' Punkte</strong> <button id="meta-minus">−</button> <button id="meta-plus">+</button> <button id="meta-refund">NEU VERTEILEN</button> <button id="meta-reset">FORTSCHRITT LÖSCHEN</button> <button id="meta-back">ZURÜCK</button></div><div class="meta-detail"><strong>'+metaSelected+'</strong> · '+description+' <button id="meta-buy">'+(PfertMeta.rank(metaData,metaSelected)>=PfertMeta.limit(metaSelected)?'MAXIMAL':talentReady(metaSelected)?'KAUFEN · 1 PUNKT':'NOCH NICHT VERFÜGBAR')+'</button><br><small>Linksklick: kaufen · Rechtsklick: zurückgeben · Hell mit ✓: gekauft · Dunkel: nicht gekauft · Türkiser Rahmen: angewählt. Wiederholbare Knoten: bis zu 5 Ränge. Mausrad: zoomen · Ziehen: verschieben · Pfeile / Steuerkreuz: wählen · Enter / A: kaufen · B kurz: zurückgeben · B halten: verlassen · Esc: zurück. '+metaWarning+'</small></div><div id="meta-viewport" class="meta-viewport"><div class="meta-map" style="width:'+(1400*metaZoom)+'px;height:'+(1100*metaZoom)+'px"><div class="meta-world" style="transform:scale('+metaZoom+')"><svg width="1400" height="1100"><svg x="0" y="0" width="1400" height="1100" viewBox="0 0 336 264"><image class="horse-silhouette" href="assets/horse-v2.png" x="0" y="0" width="672" height="264"/></svg>'+lines+'</svg>'+nodes+'</div></div></div>';
 const viewport=document.getElementById('meta-viewport'),map=viewport.querySelector('.meta-map');
 const fitZoom=Math.min(viewport.clientWidth/1400,viewport.clientHeight/1100);
 if(!metaPanReady){metaZoom=Math.max(fitZoom,metaZoom);map.style.width=(1400*metaZoom)+'px';map.style.height=(1100*metaZoom)+'px';map.querySelector('.meta-world').style.transform='scale('+metaZoom+')';metaPan={x:(viewport.clientWidth-1400*metaZoom)/2,y:(viewport.clientHeight-1100*metaZoom)/2};metaPanReady=true}
 const place=()=>{map.style.left=metaPan.x+'px';map.style.top=metaPan.y+'px'};place();
 let drag=null;viewport.addEventListener('pointerdown',e=>{if(e.target.closest('.meta-node'))return;drag={x:e.clientX,y:e.clientY,px:metaPan.x,py:metaPan.y};viewport.setPointerCapture(e.pointerId)});viewport.addEventListener('pointermove',e=>{if(drag){metaPan={x:drag.px+e.clientX-drag.x,y:drag.py+e.clientY-drag.y};place()}});viewport.addEventListener('pointerup',()=>drag=null);
 const tip=document.createElement('div');tip.className='meta-tooltip';overlay.appendChild(tip);
 viewport.addEventListener('wheel',e=>{e.preventDefault();const rect=viewport.getBoundingClientRect(),delta=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?viewport.clientHeight:1),result=talentWheelZoom(metaZoom,metaPan,e.clientX-rect.left,e.clientY-rect.top,delta,fitZoom);metaZoom=result.zoom;metaPan=result.pan;map.style.width=(1400*metaZoom)+'px';map.style.height=(1100*metaZoom)+'px';map.querySelector('.meta-world').style.transform='scale('+metaZoom+')';place();tip.hidden=true},{passive:false});
 overlay.querySelectorAll('.meta-node').forEach(button=>{const show=()=>{const r=button.getBoundingClientRect(),o=overlay.getBoundingClientRect();tip.textContent=button.dataset.id+' · '+PfertMeta.describe(metaData,button.dataset.id,PfertMetaData.descriptions[button.dataset.id]);tip.style.left=(r.left+r.width/2-o.left)+'px';tip.style.top=(r.top-o.top-8)+'px';tip.hidden=false};button.addEventListener('mouseenter',show);button.addEventListener('focus',show);button.addEventListener('mouseleave',()=>tip.hidden=true);button.addEventListener('blur',()=>tip.hidden=true)});tip.hidden=true;
 overlay.querySelectorAll('.meta-node').forEach(button=>button.addEventListener('click',()=>{metaSelected=button.dataset.id;const detail=overlay.querySelector('.meta-detail');detail.innerHTML='<strong>'+metaSelected+'</strong> · '+PfertMeta.describe(metaData,metaSelected,PfertMetaData.descriptions[metaSelected])+' <button id="meta-buy">'+(PfertMeta.rank(metaData,metaSelected)>=PfertMeta.limit(metaSelected)?'MAXIMAL':talentReady(metaSelected)?'KAUFEN · 1 PUNKT':'NOCH NICHT VERFÜGBAR')+'</button><br><small>Linksklick: kaufen · Rechtsklick: zurückgeben · Hell mit ✓: gekauft · Dunkel: nicht gekauft · Türkiser Rahmen: angewählt. Wiederholbare Knoten: bis zu 5 Ränge. Pfeile / Steuerkreuz: wählen · Enter / A: kaufen · B kurz: zurückgeben · B halten: verlassen · Esc: zurück. '+metaWarning+'</small>';overlay.querySelectorAll('.meta-node').forEach(n=>n.classList.toggle('selected',n.dataset.id===metaSelected));document.getElementById('meta-buy').addEventListener('click',buySelected)}));
 function buySelected(){if(!talentReady(metaSelected))return;const next=PfertMeta.buy(metaData,metaSelected);if(next){metaData=next;metaSave();renderTalents()}}
 overlay.querySelectorAll('.meta-node').forEach(button=>{button.addEventListener('click',()=>{if(!metaNavigating)buySelected()});button.addEventListener('contextmenu',e=>{e.preventDefault();metaSelected=button.dataset.id;sellSelectedTalent()})});
 document.getElementById('meta-buy').addEventListener('click',buySelected);
 document.getElementById('meta-minus').addEventListener('click',()=>{metaZoom=Math.max(fitZoom,metaZoom-.1);metaPanReady=false;renderTalents()});
 document.getElementById('meta-plus').addEventListener('click',()=>{metaZoom=Math.min(1.5,metaZoom+.1);metaPanReady=false;renderTalents()});
 document.getElementById('meta-refund').addEventListener('click',()=>{metaData=PfertMeta.refund(metaData);metaSave();renderTalents()});
 document.getElementById('meta-reset').addEventListener('click',()=>{if(window.confirm('Gesamten Talentfortschritt unwiderruflich löschen?')){metaData=PfertMeta.fresh();metaSave();renderTalents()}});
 document.getElementById('meta-back').addEventListener('click',()=>{state=metaReturn;overlay.classList.remove('talent-overlay');overlay.innerHTML=metaOverlay;const button=document.getElementById(state==='menu'?'start':'again');if(button)button.addEventListener('click',reset);const talent=document.getElementById('talents');if(talent)talent.addEventListener('click',showTalents);padBlocked=true});
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
function activateRage(){if(state!=='playing'||player.rage<100||player.overdrive>0)return false;player.rage=0;player.overdrive=8*(1+.03*metaCount('K1',[5,10])+.03*metaCount('K2',[5,10])+.015*(metaCount('K2',[11,12,14,15,17,18,19])+2*Number(owns('K2-21'))))*(owns('K2-23')?1.525:1);player.metaRageMax=player.overdrive;player.metaAfterglow=0;player.metaLightning=1;heal(2);player.inv=Math.max(player.inv,owns('K3-13')?.75:.65);shots=shots.filter(s=>s.x+s.w/2<0||s.x-s.w/2>W||s.y+s.h/2<62||s.y-s.h/2>H);if(owns('K3-22'))player.inv=Math.max(player.inv,1.5);if(owns('K3-23')){player.inv=Math.max(player.inv,3);player.metaRageLock=player.overdrive+5}for(const e of enemies){if(e.hp>0&&e.x+e.w/2>=0&&e.x-e.w/2<=W&&e.y+e.h/2>=62&&e.y-e.h/2<=H){e.hp=0;death(e)}}enemies=enemies.filter(e=>e.hp>0);ring(player.x,player.y,'#b6f8ff',180);flashes.push({x:player.x,y:player.y,r:100,life:.15,maxLife:.15});shake=4;notice=2;noticeText='KÄSERAUSCH!';sound('overdrive');return true}

function clock(s){return String(Math.floor(s/60)).padStart(2,'0')+':'+String(Math.floor(s%60)).padStart(2,'0')}
function sound(kind,strong=false){if(typeof PfertSound!=='undefined')PfertSound.play(kind,strong)}
function reset(){
 if(typeof PfertSound!=='undefined')PfertSound.wake();
 transition=null;t=0;runTime=0;metaBosses=0;level=1;xp=owns('B1-13')?2:0;xpNeeded=10;orbs=[];choices=[];score=0;hearts=MAX_HEARTS;lastRare=null;
 upgrades=Object.fromEntries(cardDefs.map(card=>[card.id,0]));
 player={x:135,y:H/2,w:40,h:29,inv:0,effects:Array(16).fill(0),weapon:-1,charge:0,charging:false,specials:owns('W1-23')?2:3,specialCount:0,freeSpecialUsed:false,bossSpecialUsed:false,autoCooldown:0,autoAttacks:0,podSide:1,podCooldown:0,muzzle:0,guardFlash:0,attacks:0,rage:owns('K2-13')?15:0,overdrive:0,metaAfterglow:0,chargeCue:false,readyCue:false};
 enemies=[];bullets=[];shots=[];pickups=[];particles=[];deaths=[];rings=[];beams=[];
 boss=null;spawn=1;drop=8;nextBoss=300;bossCount=0;flash=0;shake=0;levelIndex=0;
 secret=false;secretTime=0;secretType=0;golden=null;goldenAppeared=false;secondAppeared=false;combo=0;comboTime=0;threat=0;arcs=[];flashes=[];notice=3;noticeText=levels[0];
 keys.clear();state='playing';overlay.classList.add('hidden');overlay.classList.remove('upgrade-overlay');overlay.classList.remove('game-over');
}
function cancelCharge(){keys.clear();if(player){player.charging=false;player.charge=0}}
document.getElementById('start').addEventListener('click',reset);
window.addEventListener('keydown',e=>{
 if(!e.repeat&&state==='talents'&&e.code==='Numpad5'&&metaAvailable){e.preventDefault();metaData.points+=360;metaSave();renderTalents();return}
 if(!e.repeat&&state==='playing'&&/^Numpad[1-4]$/.test(e.code)){e.preventDefault();const which=Number(e.code.slice(-1));boss=null;golden=null;enemies=[];shots=[];bullets=[];beams=[];cancelCharge();player.inv=2;if(which<=2){secret=false;secretType=0;secretTime=0;bossCount=which-1;nextBoss=Math.max(t,nextBoss);startBoss()}else{secret=true;secretType=which-2;secretTime=secretType===1?45:60;startRuhrBoss()}return}
 if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','KeyW','KeyA','KeyS','KeyD'].includes(e.code))e.preventDefault();
 if(state==='transition')return;
 if(state==='talents'){if(!e.repeat){if(e.code==='ArrowLeft')moveTalent(-1,0);else if(e.code==='ArrowRight')moveTalent(1,0);else if(e.code==='ArrowUp')moveTalent(0,-1);else if(e.code==='ArrowDown')moveTalent(0,1);else if(e.code==='Enter')document.getElementById('meta-buy').click();else if(e.code==='Escape')document.getElementById('meta-back').click()}return}
 if(state==='upgrade'){if(!e.repeat){if(/^Digit[123]$/.test(e.code))chooseCard(Number(e.code.slice(-1))-1);else if(e.code==='ArrowLeft'||e.code==='ArrowRight')selectCard(selectedCard+(e.code==='ArrowRight'?1:-1));else if(e.code==='Enter')chooseCard(selectedCard)}return}
 keys.add(e.code);if(e.code==='KeyM'&&!e.repeat&&typeof PfertSound!=='undefined'){const muted=PfertSound.toggle();notice=1;noticeText=muted?'TON AUS':'TON AN'}
 if(e.code==='Space'&&!e.repeat&&state==='playing')fireSpecial();
 if(e.code==='KeyQ'&&!e.repeat)activateRage();
 if(e.code==='KeyT'&&!e.repeat&&(state==='menu'||state==='over'))showTalents();

 if(e.code==='Enter'&&(state==='menu'||state==='over'))reset();
});
window.addEventListener('keyup',e=>{
 keys.delete(e.code);
});
window.addEventListener('blur',cancelCharge);
function offerCards(){
 const pool=cardDefs.filter(card=>!card.repeatable&&!card.rare&&upgrades[card.id]<card.max);
 const rarePool=cardDefs.filter(card=>card.rare&&runTime>=120&&upgrades[card.id]<card.max&&card.requires(upgrades));
 if(pool.length<3)pool.push(...cardDefs.filter(card=>card.repeatable));
 if(pool.length===0)return
 choices=[];if(rarePool.length){const weighted=rarePool.flatMap(card=>Array(card.id===lastRare?1:3).fill(card));const rare=weighted[Math.floor(rand(0,weighted.length))];choices.push(rare);lastRare=rare.id;}while(choices.length<3&&pool.length){choices.push(pool.splice(Math.floor(rand(0,pool.length)),1)[0])}
 state='upgrade';selectedCard=0;padBlocked=true;cancelCharge();overlay.classList.remove('hidden');overlay.classList.add('upgrade-overlay');
 overlay.innerHTML='<div class="eyebrow">MINUTE '+Math.floor(runTime/60)+' · DEIN PFERT WIRD STÄRKER</div><h2>Ein bisschen mehr Wumms.</h2><p class="upgrade-copy">Wähle eine Verbesserung. Sie bleibt bis zum Ende der Runde.</p><div class="cards">'+choices.map((card,i)=>'<button class="upgrade-card'+(card.rare?' rare':'')+'" id="card-'+i+'"><span class="card-number">'+(i+1)+'</span><span class="card-icon">'+card.icon+'</span><strong>'+card.title+'</strong><span class="card-description">'+card.desc+'</span><span class="card-rank">'+(card.rare?'SYNERGIE · ':'')+'RANG '+(upgrades[card.id]+1)+' / '+(Number.isFinite(card.max)?card.max:'∞')+'</span></button>').join('')+'</div><p class="hint">Klicken, 1 / 2 / 3 oder Pfeile + Enter · Controller: Steuerkreuz + A · Das Spiel pausiert.</p>';
 choices.forEach((_,i)=>document.getElementById('card-'+i).addEventListener('click',()=>chooseCard(i)));selectCard(0);
}
function selectCard(i){if(!choices.length)return;selectedCard=(i+choices.length)%choices.length;choices.forEach((_,j)=>{const el=document.getElementById('card-'+j);if(el.classList.toggle)el.classList.toggle('selected',j===selectedCard)});}
function chooseCard(i){
 if(state!=='upgrade'||!choices[i])return;
 const card=choices[i];upgrades[card.id]++;sound(card.rare?'synergy':'card');xp-=xpNeeded;level++;xpNeeded=Math.min(1500,Math.ceil(xpNeeded*(level<10?1.5:1.12)));choices=[];state='playing';cancelCharge();
 overlay.classList.add('hidden');overlay.classList.remove('upgrade-overlay');notice=2.4;noticeText=card.title.toUpperCase()+' · RANG '+upgrades[card.id];if(xp>=xpNeeded)offerCards();
}
function activeWeapon(){
 if(player.weapon>=0)return player.effects[player.weapon]>0?player.weapon:-1;
 return player.effects.findIndex(v=>v>0);
}
function hit(a,b){return Math.abs(a.x-b.x)<(a.w+b.w)/2&&Math.abs(a.y-b.y)<(a.h+b.h)/2}
function chargeLimit(){return Math.max(.25,1.5*Math.pow(.91,upgrades.charge)*Math.pow(.99,upgrades.tempo))}
function damage(base){const rageBonus=.015*(metaCount('K1',[1,2,3,4,6,7,8,9,11,12,14,15,17,18,19])+2*Number(owns('K1-21')));const active=player.overdrive>0,after=player.metaAfterglow>0;const rageFactor=active?1.35*(1+rageBonus)*(owns('K2-20')&&player.metaRageMax-player.overdrive<2?1.15:1):after?1.35:1;const low=hearts<=2?1+.015*metaCount('V3',[1,2,3,4,6,7,8,9])+(owns('V3-13')?.15:0)+(owns('V3-23')?.60:0)+(hearts<=1&&owns('V3-22')?.225:0):1;metaLastCritical=Math.random()<Math.min(1,upgrades.critical*.03+.015*metaCount('A2',[5,10])+(owns('A2-22')?.06:0));const criticalFactor=metaLastCritical?2+.03*(metaCount('A2',[11,12,14,15,17,18,19])+2*Number(owns('A2-21')))+(owns('A2-23')?.75:0):(owns('A2-23')?.85:1);return 1.5*base*(owns('S1')?1.03:1)*Math.pow(1.12,upgrades.damage)*(1+upgrades.mastery*.01)*rageFactor*low*(owns('Q10')&&active?1.5:1)*(1+(owns('Q1')?.045:0)+(player.metaRevenge>0?.15:0))*(activeWeapon()>=0?1+.03*metaCount('W2',[5,10])+.015*(metaCount('W2',[11,12,14,15,17,18,19])+2*Number(owns('W2-21'))):1)*criticalFactor}
function heal(amount){if(owns('V3-23')&&hearts<=2)amount=Math.round(amount)*.5;hearts=Math.min(MAX_HEARTS,hearts+amount)}
function particle(x,y,col,n=7,speed=1){
 for(let i=0;i<n&&particles.length<260;i++){let life=rand(.2,.6);particles.push({x,y,vx:rand(-150,150)*speed,vy:rand(-150,150)*speed,life,maxLife:life,col,size:rand(1.5,4)})}
}
function ring(x,y,col,size=35){if(rings.length<22)rings.push({x,y,col,size,life:.4,maxLife:.4})}
function impact(x,y,col,n=7){particle(x,y,col,n);ring(x,y,col,20);shake=Math.max(shake,.7)}
function dropOrb(x,y,value,speed=32.5,kind='normal'){orbs.push({x:clamp(x,22,W-22),y:clamp(y,85,H-22),w:16,h:16,value,speed,age:0,kind});}
function enemySpeed(e){const paused=e.i===3&&e.age%3>1.25&&e.age%3<2.05;const charge=e.i===6&&e.age%3>1.1&&e.age%3<1.55?180:0;return (paused?0:e.speed*(1-(e.slow||0)))+charge;}
function death(e){
 if(owns('A3-22')&&e.burnLife>0){const amount=(e.metaLastDamage||0)*.30*(owns('A3-23')?1.75:1);ring(e.x,e.y,'#ffb483',67.5);for(const target of enemies)if(target!==e&&target.hp>0&&Math.hypot(target.x-e.x,target.y-e.y)<67.5)damageEnemy(target,amount,target.x,target.y)}
 dropOrb(e.x,e.y,[1,1,1,2,2,2,3,3,3,4][e.i]*(e.elite?2:1)*(player.overdrive>0&&owns('K3-16')?1.12:1),enemySpeed(e)/2,e.elite?'elite':'normal');
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
 const b={x:player.x+28-offset,y:player.y-2,vx:velocity*Math.cos(angle)*(1+upgrades.velocity*.06),vy:velocity*Math.sin(angle)*(1+upgrades.velocity*.06),w:size,h:size,damage:damage((charged?2+power*4.5:1)*scale),metaCritical:metaLastCritical,charged,style,pierce:['port','speed','wave','saw','vortex','phoenix'].includes(style),remaining:upgrades.pierce,bounces:upgrades.ricochet,hit:new Set(),age:0,life:3.5,blast:charged&&(style==='red'||upgrades.blast>0),homing:style==='rose',elements:attackElements(charged)};
 bullets.push(b);return b;
}
function shotInterval(){
 const intervals=[.24,.30,.28,.42,.20,.24,.32,.40,.32,.45,.48,.42,.28,.70,.60,.40],weapon=activeWeapon();
 const base=weapon===3?Math.max(.42,.34*(1+upgrades.duration*.08+upgrades.cellar*.01)+.04):(intervals[weapon]||.24);
 const rate=1+.015*(metaCount('A1',[11,12,14,15,17,18,19])+2*Number(owns('A1-21')));
 return base/rate*(owns('A1-23')?1.25:1)/(owns('W3-23')?(weapon>=0?1.375:.85):1);
}
function updateAutoFire(dt){
 player.autoCooldown-=dt;
 if(player.autoCooldown<=0){const overdue=player.autoCooldown;fireCharge();player.autoCooldown=Math.max(0,player.autoCooldown+overdue)}
}
function fireSpecial(){
 if(state!=='playing')return;
 const weapon=activeWeapon();
 if(weapon<0){notice=1.2;noticeText='KEIN SONDERANGRIFF · WEIN SAMMELN';sound('block');return}
 const cost=(player.effectMax||18)/(owns('W1-23')?2:3);
 player.specialCount++;player.metaLastSpecial=player.effects[weapon]<=cost;
 if(owns('W1-13')&&!player.freeSpecialUsed)player.freeSpecialUsed=true;else player.effects[weapon]=Math.max(0,player.effects[weapon]-cost);
 // Der Angriff verwendet auch dann die Weinwaffe, wenn der Balken dabei leer wird.
 const remaining=player.effects[weapon];if(!remaining)player.effects[weapon]=Number.EPSILON;
 fireCharge(true);
 player.effects[weapon]=remaining;
}
function fireCharge(special=false){
 const charged=special, power=special?1:0, weapon=activeWeapon(), firstNew=bullets.length, firstBeam=beams.length;
 sound('shot',{charged,style:styles[weapon]||'normal',x:player.x});
 const style=styles[weapon]||(charged?'wave':'normal'),emit=(angle=0,mode=style,scale=1,offset=0)=>addBullet(angle,mode,charged,power,scale,offset);
 if(style==='port'||style==='storm'){
  const storm=style==='storm', life=(storm?(charged?1.05:.22):(charged?.65+power*.55:.34))*(1+upgrades.duration*.08+upgrades.cellar*.01);
  beams.push({life,maxLife:life,charged,style,width:(storm?(charged?54:13):(charged?14+power*14:9))*(1+upgrades.size*.06),damage:damage(storm?(charged?7:2):(charged?3.5+power*2:1.8)),metaCritical:metaLastCritical,tick:0,elements:attackElements(charged),x:player.x+27,y:player.y-2});
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
 }else if(style==='normal'&&!charged){
  const count=1+upgrades.multiShot+2*upgrades.fanShot,step=upgrades.fanShot?.12:0;
  for(let i=0;i<count;i++){const b=emit((i-(count-1)/2)*step);if(b){b.y+=(i-(count-1)/2)*18;b.standardShot=true;b.seekRank=upgrades.seekShot;b.snakeRank=upgrades.snakeShot;b.breakRank=upgrades.breakShot}}
 }else{
  const angles=style==='white'?(charged?[-.34,-.17,0,.17,.34]:[-.24,0,.24]):style==='rose'&&charged?[-.4,0,.4]:style==='speed'?[-.065,.065]:[0];
  for(let j=0;j<(style==='red'&&!charged?3:1);j++)for(const angle of angles)emit(angle,style,1,j*15);
 }
 if(charged&&weapon>=0){
  const primary=bullets.slice(firstNew),beamPrimary=beams.slice(firstBeam),extra=upgrades.multiShot+2*upgrades.fanShot;
  for(const b of primary){b.seekRank=upgrades.seekShot;b.snakeRank=upgrades.snakeShot;b.breakRank=upgrades.breakShot}
  for(const beam of beamPrimary){beam.seekRank=upgrades.seekShot;beam.snakeRank=upgrades.snakeShot;beam.breakRank=upgrades.breakShot;beam.splitTargets=new Set()}
  for(let i=0;i<extra;i++){
   const side=i%2?1:-1,offset=side*(Math.floor(i/2)+1),angle=upgrades.fanShot?offset*.12:0;
   if(primary.length&&bullets.length<360){const b=primary[i%primary.length],cos=Math.cos(angle),sin=Math.sin(angle);bullets.push({...b,y:b.y+offset*18,baseY:b.baseY===undefined?undefined:b.baseY+offset*18,vx:b.vx*cos-b.vy*sin,vy:b.vx*sin+b.vy*cos,phase:(b.phase||0)+angle,hit:new Set(),trail:[]})}
   if(beamPrimary.length){const beam=beamPrimary[0];beams.push({...beam,offset:offset*18,splitTargets:new Set()})}
  }
 }
 if(upgrades.echoForge&&((player.attacks+1)%4===0)){
  const primary=bullets.slice(firstNew,firstNew+2);for(const original of primary)for(const side of [-1,1])if(bullets.length<360)bullets.push({...original,x:original.x-15,y:original.y+side*8,phase:(original.phase||0)+side*.4,damage:original.damage*.45,life:original.life*.9,hit:new Set(),echoed:true});
  if(beams.length>firstBeam){const original=beams[firstBeam];for(const side of [-1,1])beams.push({...original,offset:side*20,damage:original.damage*.45,life:original.life*.65,splitTargets:original.splitTargets?new Set():undefined,echoed:true})}sound('echo');
 }
 if(charged&&upgrades.orbital>0)for(let i=0;i<2;i++){const orb=addBullet(0,'orbit',charged,power,.25+upgrades.orbital*.15);if(orb){orb.orbit=1.2;orb.orbitRadius=48+i*5;orb.phase=i*Math.PI;orb.life=2.7}}
 if(player.overdrive>0)for(const angle of [-.2,.2])addBullet(angle,'speed',charged,power,.45);
 if(player.overdrive>0&&!charged){const count=Number(owns('K1-13'))+Number(owns('K1-16'))+Number(owns('K1-22'));for(let i=0;i<count;i++)addBullet((i-(count-1)/2)*.22,'speed',false,0,.525)}
 if(upgrades.spread>0)for(const angle of [-.32,.32])addBullet(angle,'satellite',false,0,.15+upgrades.spread*.15);
 if(upgrades.rear>0)addBullet(Math.PI,'satellite',charged,power,upgrades.rear*.2);
 player.attacks++;if(upgrades.echo>0&&!upgrades.echoForge&&player.attacks%6===0)for(const angle of [-.1,.1])addBullet(angle,'echo',charged,power,.3+upgrades.echo*.05);
 if(charged){player.metaAfterSpecial=3;const w1=.015*metaCount('W1',[1,2,3,4,6,7,8,9,11,12,14,15,17,18,19])+.03*metaCount('W1',[5,10])+.03*Number(owns('W1-21'));const meta=1+w1+(weapon>=0?.03*metaCount('W3',[5,10]):0)+(owns('W3-22')&&player.metaWeaponSpecial?.30:0)+(owns('W1-16')&&player.specialCount===1?.30:0)+(owns('W1-22')&&player.metaLastSpecial?.30:0)+(owns('W1-23')?.90:0);const multiplier=(1+upgrades.charge*.09+upgrades.tempo*.01)*meta;for(const b of bullets.slice(firstNew)){b.damage*=multiplier;b.w*=3*(1+upgrades.blast*.12);b.h*=3*(1+upgrades.blast*.12)}for(const beam of beams.slice(firstBeam)){beam.damage*=multiplier;beam.width*=3*(1+upgrades.blast*.12)}player.metaWeaponSpecial=false}
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
  player.autoCooldown=shotInterval();
 }
 if(weapon>=0){for(const b of bullets.slice(firstNew))b.damage*=1.15;for(const beam of beams.slice(firstBeam))beam.damage*=1.15}
 if(charged&&owns('W2-20')){if(!player.metaBombs)player.metaBombs=[];player.metaBombs.push({x:player.x+28,y:player.y,time:1,amount:damage(1.5+(owns('W2-22')?.75:0))*(owns('W2-23')?2.5:1),radius:90+(owns('W2-22')?30:0)})}
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
 player.metaLastHit=runTime;if(owns('V1-16'))player.metaHitSpeed=2;
 if(owns('Q2'))player.metaRevenge=5;
 if(owns('V2-20')&&!player.metaShieldUsed){player.metaShieldUsed=true;player.inv=.3;if(owns('V2-22'))shots=shots.filter(s=>Math.hypot(s.x-player.x,s.y-player.y)>90);ring(player.x,player.y,'#aeeaff',90);sound('block');return}
 if(player.effects[2]>0){sound('block');player.effects[2]=0;impact(player.x,player.y,'#ffc3e3',18)}else{sound('hurt');hearts--;impact(player.x,player.y,'#f17765',22);flash=.18;if(hearts<=0&&owns('V3-20')&&!player.metaLastStand){player.metaLastStand=true;hearts=1}if(hearts===1&&owns('V3-16')&&!player.metaRecover){player.metaRecover=true;heal(1)}}
 player.inv=1.5*(1+.03*(metaCount('V3',[11,12,14,15,17,18,19])+2*Number(owns('V3-21')))+.015*metaCount('V2',[1,2,3,4,6,7,8,9]));shake=4;if(hearts<=0)end();
 if(hearts===1&&owns('K3-20')&&!player.metaNotreserve){player.metaNotreserve=true;player.rage=Math.min(100,player.rage+30)}
}
let lastRoast=-1;
function end(){
 if(state!=='playing')return;
 if(metaAvailable){metaData=PfertMeta.award(metaData,runTime,metaBosses);metaSave()}
 state='over';sound('die');cancelCharge();overlay.classList.remove('hidden');overlay.classList.remove('upgrade-overlay');overlay.classList.add('game-over');
 let roast=Math.floor(rand(0,roasts.length));if(roast===lastRoast)roast=(roast+1)%roasts.length;lastRoast=roast;
 const comeback=comebacks[Math.floor(rand(0,comebacks.length))],build=Object.values(upgrades).reduce((a,b)=>a+b,0);
 overlay.innerHTML='<div class="eyebrow">✦ DER BASAR HAT DICH AUSGELACHT ✦</div><h1>OH PFERT<span>✦</span></h1><p class="roast">'+roasts[roast]+'</p><p class="comeback">'+comeback+'</p><p class="run-stats">'+score+' Punkte · '+clock(runTime)+' überlebt · '+build+' Karten</p><button id="again">ICH BIN NOCH NICHT FERTIG →</button><p class="hint">ENTER oder den Knopf drücken</p>';
 document.getElementById('again').addEventListener('click',reset);
 if(metaAvailable){const button=document.createElement('button');button.id='talents';button.textContent='TALENTBAUM · '+metaData.points+' PUNKTE · T / B';button.addEventListener('click',showTalents);overlay.appendChild(button)}
}
function setupSegments(b){
 b.max*=12.5;
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
function enterRuhr(){secretType=golden&&golden.kind===2?2:1;secret=true;secretTime=0;golden=null;boss=null;enemies=[];shots=[];bullets=[];beams=[];pickups=[];spawn=1;notice=4;noticeText=secretType===2?'NACHTSCHICHT AM HOCHOFEN':'GEHEIMLEVEL: GLÜCK AUF, PFERT!';player.inv=2}
function leaveRuhr(){secret=false;secretType=0;boss=null;enemies=[];shots=[];bullets=[];beams=[];pickups=[];spawn=2;notice=4;noticeText='ZURÜCK IN DIE WOLKEN!';player.inv=2}
function startRuhrBoss(){sound('boss');const i=secretType===2?6:5;boss=setupSegments({i,x:830,y:270,w:150,h:146,max:(i===6?155:120)*(1+threat*.22),age:0,fire:1.5,warning:0});enemies=[];shots=[];notice=3;noticeText=bosses[i].toUpperCase()}
function modifyDirectHit(target,amount,source,isBoss){
 const high=target.hp/target.max>.70;let bonus=high?.015*metaCount('A2',[1,2,3,4,6,7,8,9]):0;
 if(!target.metaOpened&&owns('A2-13'))bonus+=.30;target.metaOpened=true;
 if(player.metaPrecisionTarget!==target){player.metaPrecisionTarget=target;player.metaPrecisionCount=0}player.metaPrecisionCount++;
 if(owns('A2-20')&&player.metaPrecisionCount%4===0)bonus+=.375;
 if(isBoss&&source.metaCritical&&owns('A2-16'))bonus+=.15;
 if(target.burnLife>0||target.slowTime>0)bonus+=.015*metaCount('A3',[1,2,3,4,6,7,8,9]);
 return amount*(1+bonus)*(owns('A3-23')?.9:1);
}
function damageEnemy(e,amount,x,y){if(e.hp<=0)return;e.metaLastDamage=amount;sound('hit',{type:e.i,x});const finisher=e.hp/e.max<.35?1+upgrades.execute*.06:1;e.hp-=amount*finisher;e.flash=.085;particle(x,y,'#e8faff',5);if(flashes.length<28)flashes.push({x,y,r:12,life:.08,maxLife:.08,magic:['frost','chain','port','storm','vortex','prism','orbit'].includes(e.lastImpact)});if(e.hp<=0)death(e)}
function applyAilment(b,e){
 const duration=1+.06*metaCount('A3',[5,10]);const elements=b.elements||attackElements(!!b.charged),slow=Math.min(.65,Math.max(b.slow||0,elements.frost));if(slow>0){e.slow=Math.max(e.slow||0,slow);e.slowTime=1.8*duration}
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
   for(const target of enemies)if(target.hp>0&&Math.hypot(target.x-x,target.y-y)<70)damageEnemy(target,b.damage*.4*upgrades.shatter,target.x,target.y);
  }
 }
 const elements=b.elements||attackElements(!!b.charged);if(flashes.length<28&&(elements.fire||elements.frost||elements.lightning||elements.earth))flashes.push({x,y,r:20,life:.18,maxLife:.18,elements:{...elements}});const count=Math.max(b.chain||0,elements.lightning?1:0)+elements.chainBonus;
 if(count>0){let origin={x,y};const used=new Set(e?[e]:[]);for(let i=0;i<count;i++){
  const target=enemies.filter(v=>v.hp>0&&!used.has(v)&&Math.hypot(v.x-origin.x,v.y-origin.y)<(b.chain?175:120)).sort((a,b)=>Math.hypot(a.x-origin.x,a.y-origin.y)-Math.hypot(b.x-origin.x,b.y-origin.y))[0];if(!target)break;used.add(target);
  if(arcs.length<36)arcs.push({x:origin.x,y:origin.y,tx:target.x,ty:target.y,life:.16,maxLife:.16});
  target.lastCharged=!!(b.charged||b.sourceCharged);damageEnemy(target,b.damage*(b.chain?.5:.2)*Math.pow(1.45,upgrades.cascade)*(owns('A3-23')?1.75:1),target.x,target.y);applyAilment(b,target);origin=target;
 }}
 const baseSplit=Math.max(b.split||0,elements.earth?2:0),cardSplit=b.breakRank?(baseSplit?b.breakRank:b.breakRank+1):0;
 const split=(b.generation||0)<1?Math.min(7,baseSplit+cardSplit+elements.forkBonus):0;
 if(split&&!b.fragmented&&Number.isFinite(b.vx)&&Number.isFinite(b.vy)){
  b.fragmented=true;const angle=Math.atan2(b.vy,b.vx);for(let i=0;i<split;i++){
   const child=addBullet(angle+(i-(split-1)/2)*.23,b.split?'prism':b.style,false,0,.5);if(child){child.x=x+8;child.y=y;child.split=0;child.generation=1;if(e)child.hit.add(e);child.elements={...elements};child.chain=b.chain||0;child.slow=b.slow||0;child.blast=b.blast;child.seekRank=b.seekRank||0;child.snakeRank=b.snakeRank||0;child.sourceCharged=!!(b.charged||b.sourceCharged);child.damage=b.damage*.5;child.life=1.2}
  }ring(x,y,'#c7ffff',34);sound('split');
 }
}
function damagePart(part,amount,x,y){
 if(!boss||part.hp<=0)return;
 part.hp=Math.max(0,part.hp-amount*(part.hp/part.max<.35?1+upgrades.execute*.06:1));part.flash=.1;particle(x,y,'#fff0c8',8);if(flashes.length<28)flashes.push({x,y,r:18,life:.09,maxLife:.09});
 if(part.hp===0){sound('segment');addRage(15);score+=500;ring(x,y,'#ffb86b',72);particle(x,y,'#ffbe7b',30);shake=4;notice=1.5;noticeText='SEGMENT ZERSTÖRT!'}
 boss.hp=boss.parts.reduce((sum,p)=>sum+p.hp,0);
 if(boss.hp<=0){const defeated=boss;metaBosses++;if(owns('B3-20'))player.metaBossSpeed=5;if(owns('W1-20')&&!player.bossSpecialUsed){const weapon=activeWeapon(),max=player.effectMax||18;if(weapon>=0&&player.effects[weapon]<max){player.effects[weapon]=Math.min(max,player.effects[weapon]+max/(owns('W1-23')?2:3));player.bossSpecialUsed=true}}dropOrb(boss.x,boss.y,10,32.5,'boss');score+=2000+boss.i*500;ring(boss.x,boss.y,'#fff1ba',150);particle(boss.x,boss.y,'#ffbd7c',60,2);deaths.push({...boss,boss:true,secret,life:1.2,age:0,rotation:.3});shake=5;if(defeated.i>=5)beginTransition('leave');else{boss=null;shots=[]}}
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
 if(state==='transition'){advanceTransition(dt);return}
 try{updateGameplay(dt)}catch(error){if(error!==transitionInterrupt)throw error}
}
function updateGameplay(dt){
 if(state!=='playing')return;
 if(xp>=xpNeeded){offerCards();return}
 comboTime=Math.max(0,comboTime-dt);if(comboTime<=0)combo=0;
 const build=Object.values(upgrades).reduce((a,b)=>a+b,0);const synergyPressure=upgrades.fork*.3+upgrades.cascade*.25+upgrades.shatter*.3+upgrades.echoForge*.35+upgrades.orbital*.3;const targetThreat=Math.min(4.5,t/440+build*.055+synergyPressure+(activeWeapon()>=0?.1:0));threat+=(targetThreat-threat)*Math.min(1,dt*.25);
 runTime+=dt;
 if(player.metaBombs){for(const bomb of player.metaBombs){bomb.time-=dt;if(bomb.time<=0&&!bomb.exploded){bomb.exploded=true;ring(bomb.x,bomb.y,'#ffd58b',bomb.radius);for(const e of enemies)if(e.hp>0&&Math.hypot(e.x-bomb.x,e.y-bomb.y)<bomb.radius)damageEnemy(e,bomb.amount,e.x,e.y);if(boss)for(const part of [...boss.parts]){if(!boss)break;const x=boss.x+part.aim[0],y=boss.y+part.aim[1];if(part.hp>0&&Math.hypot(x-bomb.x,y-bomb.y)<bomb.radius)damagePart(part,bomb.amount,x,y)}}}player.metaBombs=player.metaBombs.filter(b=>!b.exploded)}
 if(secret)secretTime+=dt;else t+=dt;
 notice=Math.max(0,notice-dt);flash=Math.max(0,flash-dt);shake=Math.max(0,shake-dt*18);
 const nextLevel=Math.floor(t/180)%levels.length;if(!secret&&nextLevel!==levelIndex){levelIndex=nextLevel;notice=4;noticeText=levels[levelIndex]}
 player.metaQ10Speed=Math.max(0,(player.metaQ10Speed||0)-dt);player.metaRevenge=Math.max(0,(player.metaRevenge||0)-dt);player.metaBottleSpeed=Math.max(0,(player.metaBottleSpeed||0)-dt);player.guardFlash=Math.max(0,player.guardFlash-dt);player.metaAfterSpecial=Math.max(0,(player.metaAfterSpecial||0)-dt);player.metaGuardCooldown=Math.max(0,(player.metaGuardCooldown||0)-dt);player.metaGrazeSpeed=Math.max(0,(player.metaGrazeSpeed||0)-dt);player.metaHitSpeed=Math.max(0,(player.metaHitSpeed||0)-dt);player.metaGrazeInvCooldown=Math.max(0,(player.metaGrazeInvCooldown||0)-dt);const previousRage=player.overdrive;player.overdrive=Math.max(0,player.overdrive-dt);player.metaRageLock=Math.max(0,(player.metaRageLock||0)-dt);if(previousRage>0&&player.overdrive===0)player.metaAfterglow=1.5*(Number(owns('K2-16'))+Number(owns('K2-22')));else player.metaAfterglow=Math.max(0,player.metaAfterglow-dt);player.inv=Math.max(0,player.inv-dt);player.podCooldown=Math.max(0,player.podCooldown-dt);player.muzzle=Math.max(0,player.muzzle-dt);
 if(player.overdrive>0&&owns('K1-20')){player.metaLightning=(player.metaLightning||0)-dt;if(player.metaLightning<=0){player.metaLightning+=1;const targets=enemies.filter(e=>e.hp>0).sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y)).slice(0,owns('K1-23')?2:1);for(const e of targets){arcs.push({x:player.x,y:player.y,tx:e.x,ty:e.y,life:.16,maxLife:.16});damageEnemy(e,damage(.6),e.x,e.y)}}}
 for(let i=0;i<player.effects.length;i++)player.effects[i]=Math.max(0,player.effects[i]-dt);
 const dx=clamp(Number(keys.has('ArrowRight')||keys.has('KeyD'))-Number(keys.has('ArrowLeft')||keys.has('KeyA'))+padMove.x,-1,1);
 const dy=clamp(Number(keys.has('ArrowDown')||keys.has('KeyS'))-Number(keys.has('ArrowUp')||keys.has('KeyW'))+padMove.y,-1,1);
 player.metaBossSpeed=Math.max(0,(player.metaBossSpeed||0)-dt);
 const v1=.0075*(metaCount('V1',[1,2,3,4,6,7,8,9,11,12,14,15,17,18,19])+2*Number(owns('V1-21')))+(owns('V1-23')?.375:0)+(player.metaGrazeSpeed>0?.12:0)+(player.metaHitSpeed>0?.225:0)+(owns('V1-20')&&runTime-(player.metaLastHit||0)>=2?.075:0)+(hearts<=2?.045*metaCount('V3',[5,10]):0)+(hearts<=1&&owns('V3-22')?.225:0);
 const len=Math.max(1,Math.hypot(dx,dy)),speed=(activeWeapon()===4?300:220)*1.15*1.05*(1+upgrades.agility*.03)*(owns('S2')?1.03:1)*(owns('B2-23')?.9:1)*(owns('V2-23')?.88:1)*(player.metaBossSpeed>0?1.15:1)*(1+v1+(owns('Q1')?.045:0)+(player.metaQ10Speed>0&&owns('Q10')?.12:0))*(player.metaBottleSpeed>0?1.15:1);
 player.x=clamp(player.x+dx/len*speed*dt,30,W-32);player.y=clamp(player.y+dy/len*speed*dt,90,H-34);
 updateAutoFire(dt);
 if(!secret&&!golden&&!goldenAppeared&&t>=420&&!boss&&t<nextBoss){goldenAppeared=true;golden={x:1000,y:clamp(player.y,110,460),w:64,h:38,age:0,kind:1};notice=4;noticeText='GOLDENE SUCUK! SCHIESS SIE AB!'}
 if(!secret&&!golden&&!secondAppeared&&t>=840&&!boss&&t<nextBoss){secondAppeared=true;golden={x:1000,y:clamp(player.y,110,460),w:44,h:50,age:0,kind:2};notice=4;noticeText='GRUBENLAMPE! SCHIESS SIE AB!'}
 if(golden){golden.x-=80*dt;golden.age+=dt;golden.y=clamp(golden.y+Math.sin(golden.age*3)*20*dt,90,490);if(golden.x< -60)golden=null}
 if(!secret&&!boss&&t>=nextBoss)startBoss();if(secret&&!boss&&secretTime>=(secretType===2?60:45))startRuhrBoss();
 if(!boss){spawn-=dt;if(spawn<=0){const unlocked=Math.min(9,Math.floor(t/32));enemy(secret?Math.floor(rand(0,5)):Math.floor(rand(0,unlocked+1)));spawn=1.25*Math.max(.48,1.65-t/450)*rand(.8,1.2)}}
 drop-=dt;if(drop<=0){pickups.push({x:1000,y:rand(105,475),i:Math.floor(rand(0,17)),w:30,h:42,age:0});drop=rand(12,19)}
 for(const b of bullets){
  b.trailClock=(b.trailClock||0)+dt;if(b.trailClock>=.025){b.trailClock%=.025;(b.trail||(b.trail=[])).push({x:b.x,y:b.y});if(b.trail.length>7)b.trail.shift()}
  b.age=(b.age||0)+dt;b.life=(b.life===undefined?4:b.life)-dt;
  if(b.homing||b.seekRank){const target=enemies.find(e=>e.hp>0&&e.x>b.x-20&&(!b.seekRank||Math.hypot(e.x-b.x,e.y-b.y)<300))||boss;if(target){const angle=Math.atan2(target.y-b.y,target.x-b.x);const speed=Math.hypot(b.vx,b.vy),turn=b.seekRank?b.seekRank*1.2:3;b.vx+=(Math.cos(angle)*speed-b.vx)*Math.min(1,dt*turn);b.vy+=(Math.sin(angle)*speed-b.vy)*Math.min(1,dt*turn)}}
  if(b.gravity)b.vy+=b.gravity*dt;
  if(b.returnAt&&b.age>b.returnAt&&!b.returning){b.returning=true;b.vx=-Math.abs(b.vx);b.hit.clear()}
  if(b.wave){b.w+=dt*38;b.h+=dt*(b.charged?105:65)}
  if(b.vortex){b.pulse-=dt;if(b.pulse<=0){b.pulse=.3;b.hit.clear()}for(const e of enemies)if(e.hp>0&&Math.hypot(e.x-b.x,e.y-b.y)<b.vortex){e.x+=(b.x-e.x)*dt*.3;e.y+=(b.y-e.y)*dt*.7}}
  if(b.orbit&&b.age<b.orbit){b.x=player.x+22+Math.cos(b.age*7+b.phase)*b.orbitRadius;b.y=player.y+Math.sin(b.age*7+b.phase)*b.orbitRadius}else{b.x+=b.vx*dt;b.y+=b.vy*dt}
  if(b.phoenix){b.baseY+=b.vy*dt;b.y=b.baseY+Math.sin(b.age*9+b.phase)*22}
  if(b.snakeRank){const phase=b.age*8;b.y+=(b.phoenix||b.orbit&&b.age<b.orbit?Math.sin(phase):Math.sin(phase)-Math.sin(phase-dt*8))*b.snakeRank*24}
  if((b.y<80||b.y>510)&&b.bounces>0){b.y=clamp(b.y,80,510);b.vy=-b.vy;b.bounces--}

 }
 for(const s of shots){s.trailClock=(s.trailClock||0)+dt;if(s.trailClock>=.035){s.trailClock%=.035;(s.trail||(s.trail=[])).push({x:s.x,y:s.y});if(s.trail.length>4)s.trail.shift()}s.age=(s.age||0)+dt;
  if(s.follow&&s.age<s.follow){const desired=Math.atan2(player.y-s.y,player.x-s.x),current=Math.atan2(s.vy,s.vx),difference=Math.atan2(Math.sin(desired-current),Math.cos(desired-current)),angle=current+clamp(difference,-dt*.75,dt*.75),speed=Math.hypot(s.vx,s.vy);s.vx=Math.cos(angle)*speed;s.vy=Math.sin(angle)*speed}
  if(s.curve&&s.age<(s.curveUntil||1)){const angle=Math.atan2(s.vy,s.vx)+s.curve*dt,speed=Math.hypot(s.vx,s.vy);s.vx=Math.cos(angle)*speed;s.vy=Math.sin(angle)*speed}
  if(s.gravity)s.vy+=s.gravity*dt;s.x+=s.vx*dt;s.y+=s.vy*dt;s.life-=dt;
 }
 for(const p of pickups){const dx=player.x-p.x,dy=player.y-p.y,distance=Math.hypot(dx,dy);const radius=(78+upgrades.magnet*240)*(1+.045*metaCount('B2',[1,2,3,4,6,7,8,9])+(owns('B2-23')?1.5:0))+(owns('B2-13')?60:0);p.x-=100*dt;if(distance<radius&&distance>1){p.x+=dx/distance*80*dt;p.y+=dy/distance*80*dt}p.age=(p.age||0)+dt}
 for(const orb of orbs){orb.age+=dt;orb.x-=(orb.speed||0)*dt;const dx=player.x-orb.x,dy=player.y-orb.y,d=Math.hypot(dx,dy);const radius=(78+upgrades.magnet*12)*(1+(owns('S4')?.075:0)+.03*metaCount('B1',[1,2,3,4,6,7,8,9])+.03*metaCount('B3',[5,10])+(player.overdrive>0?.045*metaCount('K3',[5,10]):0))+(orb.kind==='elite'&&owns('B3-16')?45:0);if(d<radius&&d>1){const step=Math.min(d,260*dt);orb.x+=dx/d*step;orb.y+=dy/d*step}}
 for(const e of enemies){
  e.age+=dt;e.shatterCooldown=Math.max(0,(e.shatterCooldown||0)-dt);e.flash=Math.max(0,e.flash-dt);e.slowTime=Math.max(0,(e.slowTime||0)-dt);if(e.slowTime<=0)e.slow=0;
  if(e.burnLife>0&&e.hp>0){e.burnLife-=dt;e.metaLastDamage=e.burnDps*dt;e.hp-=e.metaLastDamage;if(e.hp<=0)death(e);else if(Math.random()<dt*8)particle(e.x,e.y,'#ffb483',1)}
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
  beam.x=player.x+27;const baseY=player.y-2+(beam.offset||0);beam.seekOffset=beam.seekOffset||0;if(beam.seekRank){const target=enemies.find(e=>e.hp>0&&e.x>beam.x&&Math.abs(e.y-baseY)<300)||boss;if(target)beam.seekOffset+=(target.y-baseY-beam.seekOffset)*Math.min(1,dt*beam.seekRank*1.2)}beam.y=baseY+beam.seekOffset+(beam.snakeRank?Math.sin((beam.maxLife-beam.life)*8)*beam.snakeRank*12:0);beam.life-=dt;beam.tick-=dt;
  if(golden&&golden.x>=beam.x&&Math.abs(golden.y-beam.y)<golden.h/2+beam.width){score+=500;beginTransition('enter');break}
  if(beam.tick<=0){beam.tick=.12;const beamHit=(target,amount,x,y)=>{const split=beam.breakRank&&beam.splitTargets&&!beam.splitTargets.has(target)?beam.breakRank:0;if(split)beam.splitTargets.add(target);onHit({damage:amount,style:'prism',vx:1,vy:0,charged:beam.charged,elements:beam.elements,metaCritical:beam.metaCritical,breakRank:split,seekRank:beam.seekRank,snakeRank:beam.snakeRank},target,x,y)};for(const e of enemies)if(e.x>beam.x&&Math.abs(e.y-beam.y)<e.h/2+beam.width/2){e.lastCharged=!!beam.charged;e.lastImpact=beam.style||'port';damageEnemy(e,modifyDirectHit(e,beam.damage,beam,false),e.x,beam.y);beamHit(e,beam.damage,e.x,beam.y)};
   if(boss)for(const part of [...boss.parts]){if(!boss)break;if(part.hp>0&&partHit({x:(W+beam.x)/2,y:beam.y,w:W-beam.x,h:beam.width},boss,part)){const x=boss.x+part.aim[0],amount=beam.damage*(beam.charged?.35:1)*(beam.charged&&owns('Q8')?1.075:1);damagePart(part,modifyDirectHit(part,amount,beam,true),x,beam.y);beamHit(part,amount,x,beam.y)}}
  }
 }
 for(const b of bullets){
  if(b.dead)continue;
  if(golden&&hit(b,golden)){score+=500;beginTransition('enter');break}
  for(const e of enemies){if(e.hp<=0||b.hit.has(e)||!hit(b,e))continue;
   b.hit.add(e);e.lastCharged=!!(b.charged||b.sourceCharged);e.lastImpact=b.style;damageEnemy(e,modifyDirectHit(e,b.damage||1,b,false),b.x,b.y);onHit(b,e,b.x,b.y);if(b.blast)splash(b);
   if(!b.pierce){if(b.remaining>0)b.remaining--;else b.dead=true}if(b.dead)break;
  }
  if(boss&&!b.dead)for(const part of [...boss.parts]){
   if(!boss)break;if(part.hp<=0||b.hit.has(part)||!partHit(b,boss,part))continue;
   b.hit.add(part);const amount=(b.damage||1)*(b.charged?.35:1)*(b.charged&&owns('Q8')?1.075:1);damagePart(part,modifyDirectHit(part,amount,b,true),b.x,b.y);onHit({...b,damage:amount},part,b.x,b.y);if(!b.pierce){if(b.remaining>0)b.remaining--;else b.dead=true}if(b.dead)break;
  }
 }
 for(const s of shots){
  const pod={x:player.x,y:player.y,w:player.w+14,h:player.h+14};
  if(s.life>0&&owns('V2-13')&&player.metaGuardCooldown<=0&&Math.hypot(s.x-player.x,s.y-player.y)<55){s.life=0;player.metaGuardCooldown=(owns('V2-16')?13.33:16.67)/(owns('V2-23')?1.6:1);impact(s.x,s.y,'#aeeaff',12);sound('block')}
  else if(s.life>0&&player.podCooldown<=0&&hit(pod,s)){s.life=0;player.guardFlash=.16;const reduction=.045*metaCount('V2',[5,10])+.015*(metaCount('V2',[11,12,14,15,17,18,19])+2*Number(owns('V2-21')));player.podCooldown=2.5*Math.pow(.92,upgrades.guard)*(1-reduction-(owns('Q4')&&player.overdrive>0?.075:0))/(owns('V2-23')?1.6:1);impact(pod.x,pod.y,'#aeeaff',12);addRage(10);sound('block')}
  else if(s.life>0&&hit(player,s)){s.life=0;hurt()}
  else if(s.life>0&&!s.grazed&&player.inv<=0&&Math.hypot(s.x-player.x,s.y-player.y)<42*(1+.03*metaCount('V1',[5,10]))){s.grazed=true;if(owns('V1-13'))player.metaGrazeSpeed=2;if(owns('V1-22')&&player.metaGrazeInvCooldown<=0){player.inv=Math.max(player.inv,.3);player.metaGrazeInvCooldown=8}addRage(2,true);score+=25;particle(player.x,player.y,'#b5f7ff',3);sound('graze')}
 }
 if(state!=='playing')return;
 for(const orb of orbs)if(hit(player,orb)){const elite=orb.kind==='elite',bossOrb=orb.kind==='boss';const bonus=.015*(metaCount('B1',[5,10,11,12,14,15,17,18,19])+2*Number(owns('B1-21')))+(owns('B1-16')&&elite?.15:0)+(owns('B1-23')?.30:0)+(owns('Q5')&&player.overdrive>0?.075:0)+(elite?.015*metaCount('B3',[1,2,3,4,6,7,8,9]):0)+(bossOrb?.015*(metaCount('B3',[11,12,14,15,17,18,19])+2*Number(owns('B3-21'))):0)+(bossOrb&&owns('B3-13')?.225:0)+(owns('B3-23')?(elite||bossOrb?.45:-.10):0);xp+=orb.value*(1+bonus)*1.25;orb.collected=true;player.metaOrbs=(player.metaOrbs||0)+1;const wave=(owns('B1-20')&&player.metaOrbs%25===0)||(bossOrb&&owns('B3-22'));if(wave){const radius=112.5+(owns('B1-22')?37.5:0),amount=damage(1.5+(owns('B1-22')?.75:0));ring(player.x,player.y,'#80faff',radius);for(const e of enemies)if(e.hp>0&&Math.hypot(e.x-player.x,e.y-player.y)<radius)damageEnemy(e,amount,e.x,e.y)}}
 orbs=orbs.filter(orb=>!orb.collected&&orb.x+orb.w/2>=0);if(xp>=xpNeeded){offerCards();return}
 for(const p of pickups)if(hit(player,p)){
  if(p.i!==5&&p.i!==16){if(owns('Q10'))player.metaQ10Speed=3;if(owns('W3-22'))player.metaWeaponSpecial=true;if(owns('W3-13')){ring(player.x,player.y,'#ffd58b',90);for(const e of enemies)if(e.hp>0&&Math.hypot(e.x-player.x,e.y-player.y)<90)damageEnemy(e,damage(.75),e.x,e.y)}}
  if(p.i===16){const weapon=activeWeapon();if(weapon>=0)player.effects[weapon]=player.effectMax||18}else if(p.i===5)heal(1);else{const first=!player.metaWeaponFound;player.metaWeaponFound=true;if(first&&owns('Q7'))player.rage=Math.min(100,player.rage+7.5);player.weapon=p.i;player.effects=player.effects.map((v,i)=>i===2?v:0);if(owns('W2-16'))player.metaBottleSpeed=2;const duration=1+.015*metaCount('W2',[1,2,3,4,6,7,8,9])+.045*metaCount('B2',[5,10])+.015*(metaCount('B2',[11,12,14,15,17,18,19])+2*Number(owns('B2-21')))+(owns('S5')?.045:0)+(owns('Q6')&&player.overdrive>0?.075:0)+(first&&owns('B2-16')?.30:0)+(first&&owns('B2-20')?1/3:0);player.effectMax=player.effects[p.i]=18*(1+upgrades.duration*.08+upgrades.cellar*.01)*duration*(owns('V1-23')?.85:1)*(owns('W2-23')?.8:1);if(owns('B2-22')&&!player.metaBottleHealed&&hearts<MAX_HEARTS){heal(1);player.metaBottleHealed=true}}
  sound(p.i===5?'heal':'pickup',{style:styles[p.i]||'normal'});p.dead=true;notice=2.6;noticeText=p.i===16?'SONDERWEIN · WEIN AUFGEFÜLLT':p.i===5?'TRAUBENMOST · EIN HERZ':powerNames[p.i].toUpperCase()+' · '+weaponNames[p.i];ring(p.x,p.y,colors[p.i]||'#ffd34e',60);particle(p.x,p.y,colors[p.i]||'#ffd34e',24);
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
 for(const p of pickups)PfertArt.bottle(c,{...p,element:weaponElements[p.i]});
 if(player&&player.metaBombs)for(const b of player.metaBombs){c.fillStyle='#ffd58b';c.beginPath();c.arc(b.x,b.y,6,0,Math.PI*2);c.fill()}
 for(const orb of orbs){c.save();c.shadowColor='#80faff';c.shadowBlur=15;c.fillStyle='#65e6ef';c.beginPath();c.arc(orb.x,orb.y,7,0,Math.PI*2);c.fill();c.fillStyle='#f2ffff';c.beginPath();c.arc(orb.x-2,orb.y-2,3,0,Math.PI*2);c.fill();c.restore()}
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
 if(player&&state==='playing'){const shields=[player.effects[2]>0,owns('V2-20')&&!player.metaShieldUsed,player.podCooldown<=0];if(owns('V2-13'))shields.push(player.metaGuardCooldown<=0);c.save();c.lineWidth=3;c.shadowBlur=10;c.shadowColor='#8df6ff';shields.forEach((ready,i)=>{const start=-Math.PI/2+i*Math.PI*2/shields.length;c.strokeStyle=ready?'#9ffaff':'#50686a';c.globalAlpha=ready?.95:.35;c.beginPath();c.arc(player.x,player.y,43,start+.08,start+Math.PI*2/shields.length-.08);c.stroke()});c.globalAlpha=1;c.shadowBlur=0;c.fillStyle='#eaffff';c.font='bold 10px monospace';c.textAlign='center';c.fillText(String(shields.filter(Boolean).length),player.x,player.y-47);c.restore()}
 if(player&&state==='playing'&&owns('V2-13')){const angle=runTime*2; c.fillStyle=player.metaGuardCooldown>0?'#71888b':'#fff0aa';c.beginPath();c.arc(player.x+Math.cos(angle)*45,player.y+Math.sin(angle)*32,6,0,Math.PI*2);c.fill()}
 c.restore();
 if(player&&(state==='playing'||state==='upgrade'||state==='transition')){
  PfertArt.hud(c,{hearts,score,t,runTime,secret,secretType,secretTime,player,boss,weapon:activeWeapon(),weaponNames,bosses,level,xp,xpNeeded,notice,noticeText,upgrades,combo,threat,elements:attackElements(),maxHearts:MAX_HEARTS});
  if(flash>0){c.fillStyle='rgba(255,80,60,'+flash+')';c.fillRect(0,0,W,H)}
 }
}
function pollGamepad(now=Date.now()){
 const pads=typeof navigator!=='undefined'&&navigator.getGamepads?navigator.getGamepads():[];const pad=Array.from(pads||[]).find(p=>p&&p.mapping==='standard');
 const b=i=>!!(pad&&pad.buttons[i]&&pad.buttons[i].pressed),axis=i=>pad&&Math.abs(pad.axes[i]||0)>.2?pad.axes[i]:0;
 const left=b(14)||axis(0)<-.5,right=b(15)||axis(0)>.5,up=b(12)||axis(1)<-.5,down=b(13)||axis(1)>.5,a=b(0),rage=b(1),menu=b(9);
 padMove={x:clamp(axis(0)+Number(b(15))-Number(b(14)),-1,1),y:clamp(axis(1)+Number(b(13))-Number(b(12)),-1,1)};
 if(state==='transition'){padMove={x:0,y:0};padPrev={a,left,right,up,down,rage,menu};return}
  if(padBlocked){metaBStart=null;metaBLong=false;if(!a&&!left&&!right&&!up&&!down&&!rage&&!menu)padBlocked=false}else if(state==='talents'){if(left&&!padPrev.left)moveTalent(-1,0);if(right&&!padPrev.right)moveTalent(1,0);if(up&&!padPrev.up)moveTalent(0,-1);if(down&&!padPrev.down)moveTalent(0,1);if(a&&!padPrev.a)document.getElementById('meta-buy').click();if(rage&&!padPrev.rage){metaBStart=now;metaBLong=false}if(rage&&metaBStart!==null&&!metaBLong&&now-metaBStart>=700){metaBLong=true;document.getElementById('meta-back').click()}if(!rage&&padPrev.rage&&metaBStart!==null){if(!metaBLong)sellSelectedTalent();metaBStart=null;metaBLong=false}if(menu&&!padPrev.menu)document.getElementById('meta-back').click()}else if(state==='upgrade'){if(left&&!padPrev.left)selectCard(selectedCard-1);if(right&&!padPrev.right)selectCard(selectedCard+1);if(a&&!padPrev.a)chooseCard(selectedCard)}else if(state==='menu'||state==='over'){if(rage&&!padPrev.rage&&metaAvailable){showTalents();padBlocked=true}else if(a&&!padPrev.a){reset();padBlocked=true}}else if(state==='playing'){
 if(a&&!padPrev.a)fireSpecial();if(rage&&!padPrev.rage)activateRage();}
 padPrev={a,left,right,up,down,rage,menu};
}
function frame(now){pollGamepad(now);const dt=Math.min((now-last)/1000||0,.05);last=now;update(dt);if(state==='transition')renderTransition();else render();requestAnimationFrame(frame)}
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
