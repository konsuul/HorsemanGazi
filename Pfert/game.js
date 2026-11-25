(() => {
'use strict';
const canvas = document.getElementById('game');
const c = canvas.getContext('2d');
const overlay = document.getElementById('overlay');
const W = 960, H = 540, MAX_HEARTS = 5;
const reducedMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)');
const playerFireRate=1.5, playerHitDamage=.575, hostileShotSpeed=1.3*1.1;
const homingStrength=.3, seekSteering=.51*homingStrength;
const fullEnemyDensityTime=20*60;
const rageBaseDuration=12, orbXpMultiplier=1.5, snakeAmplitude=.85, comboWindow=4;
const damageFrameTime=.18;
const breakShotDamage=.126,bounceCrustDamage=.21,hitFragmentDamage=.21;
const doubleCheeseDamage=.48;
const starOrbRadius=128,starOrbFlightTime=.36,starOrbPickupDelay=.25;
const laserDamageScale=1.6,laserIntervalScale=2;
const bossHealthMultiplier=1.2;
function enemyDensity(time){
 return (25+125*clamp(time/fullEnemyDensityTime,0,1))*(firstBossDefeated?.85:1)/60;
}
const keys = new Set();
const rand = (a,b) => a + Math.random() * (b-a);
const clamp = (v,a,b) => Math.max(a,Math.min(b,v));
const types = ['Fliegender Simit','Teppichräuber','Fliegende Sucuk','Messingkanne','Basar-Fledermaus','Gewürzwirbel','Säbelteppich','Janitscharen-Kessel','Doppel-Sucuk','Panzerkarawane'];
const bosses = ['Großwesir der Teppiche','Sultan der Kaffeekessel','Pascha der Sucuk','Dschinn der Gewürzmühle','Großmeister der Basarkarawane','Krasser Schalke-04-Fan','Hochofen-Horst · Nachtschicht','Prisma-Observatorium','Gezeitenwerft'];
const mainBossOrder=[0,1,2,3,4,7,8];
const levels = ['DIE GOLDENE STADT','DER GROSSE BASAR','DIE STERNE DER WÜSTE','DER TÜRKISE BOSPORUS','DER PALAST IM MORGENROT'];
const districtDuration=180;
const powerNames = ['Rotwein','Weißwein','Rosé','Portwein','Schaumwein','Traubenmost','Riesling','Merlot','Malbec','Muskat','Sherry','Madeira','Eiswein','Cabernet','Tokaj','Burgunder'];
const weaponNames = ['GLUTSALVE','PERLMUTT-FÄCHER','ROSEN-SUCHER','PORT-LASER','KORKENBLITZ','TRAUBENMOST','PRISMA-SPLITTER','SUCHE DER SÄGE','DONNERKETTE','MONDORBIT','SHERRY-MÖRSER','ECHO-WELLE','FROSTFÄCHER','KÄSE-VORTEX','GEWITTERKANONE','PHOENIX-FLUG'];
const weaponElements=['fire','frost','fire','lightning','lightning',null,'earth','earth','lightning','earth','earth','frost','frost','earth','lightning','fire'];
const styles=['red','white','rose','port','speed',null,'prism','saw','chain','orbit','mortar','wave','frost','vortex','storm','phoenix'];
const colors=['#ffb06e','#9effe8','#ffa7d8','#c499ff','#75d9ff','#d3a9ed','#c7eeff','#e5f6b4','#83e5ff','#c2c0ff','#ffd386','#a5f8d5','#a6eaff','#b6a0ff','#e4f7ff','#ffc48e'];
const cartridges=[
 ['sunLance','Sonnenlanze','☀','AK',3.2*laserIntervalScale,'Ein schmaler Laser durchdringt die ganze Spur.'],
 ['fuseRocket','Zündrakete','➤','AL',4.6,'Eine Suchrakete explodiert beim Einschlag.'],
 ['tideBell','Gezeitenglocke','≋','AM',3.6,'Eine wachsende Druckfront durchdringt die Spur.'],
 ['cinderArc','Glutkomet','☄','AN',3.1,'Ein glühender Bogen fällt auf Gegner und setzt sie in Brand.'],
 ['iceSpindle','Eisspindel','❄','AO',2.7,'Eine Spindel trifft zwei Ziele und bremst sie.'],
 ['sparkBobbin','Funkenrolle','ϟ','AP',3.8,'Der Funke springt auf bis zu drei Nachbarn über.'],
 ['pearlPod','Perlenkapsel','✣','AQ',3.4,'Die Kapsel öffnet sich beim Treffer zu vier Splittern.'],
 ['moonHook','Mondhaken','☾','AR',2.9,'Eine Sichel trifft auf dem Hin- und Rückflug.'],
 ['railSkip','Bandenkeil','◇','AS',2.4,'Ein diagonaler Keil prallt dreimal an den Feldrändern ab.'],
 ['anchorCore','Ankerkern','◎','AT',4.8,'Ein Kern zieht Gegner heran und trifft in Pulsen.']
].map(([id,title,icon,code,reload,desc])=>({id,title,icon,code,reload,max:1,desc:desc+' Lädt in '+reload.toLocaleString('de-DE')+' s nach.'}));
const cardDefs = [
 ...cartridges,
 {id:'healing',icon:'♥',title:'Herzstück',desc:'Füllt ein Herz wieder auf.',max:Infinity},
 {id:'multiShot',icon:'⋮',title:'Doppelter Käse',desc:'Ein Zusatzschuss je Rang für Käseschüsse, Lichtlanze und Wein-Sonderangriffe. Weitere Kopien werden schwächer.',max:2},
 {id:'fanShot',icon:'⋔',title:'Streuflug',desc:'Zwei Fächerschüsse je Rang für Käseschüsse, Lichtlanze und Wein-Sonderangriffe. Weitere Kopien werden schwächer.',max:2},
 {id:'snakeShot',icon:'∿',title:'Schlangenlinie',desc:'Standardgeschosse und Wein-Sonderangriffe schwingen.',max:3},
 {id:'seekShot',icon:'◎',title:'Spürnase',desc:'Standardgeschosse, Weinangriffe und Laser verfolgen Gegner.',max:3},
 {id:'breakShot',icon:'✣',title:'Käsebruch',desc:'Treffer erzeugen Splitter mit 12,6 % des auslösenden Schadens.',max:2},
 {id:'boomerang',icon:'↶',title:'Bumerangkäse',desc:'Standardschüsse kehren nach einer Sekunde Freiflug oder beim ersten Treffer um und können auf dem Rückweg erneut treffen.',max:1},
 {id:'carousel',icon:'⟳',title:'Käsekarussell',desc:'Standardschüsse kreisen kurz um das Pfert. Die Lichtlanze dreht sich einmal und feuert dann nach vorn.',max:1},
 {id:'bounceCrust',icon:'↱',title:'Sprungkruste',desc:'Standardschüsse prallen einmal zusätzlich ab. Beim ersten Abpraller löst sich ein Splitter.',max:1},
 {id:'damage',icon:'✦',title:'Käsereifung',desc:'12 % MEHR Schaden je Rang, multipliziert mit anderen Effekten.',max:10},
 {id:'charge',icon:'ϟ',title:'Schnellgärung',desc:'+9 % Sonderangriffsschaden je Rang.',max:8},
 {id:'spread',icon:'⋔',title:'Flankenkäse',desc:'Zwei Flankenschüsse. Je Rang +15 % ihrer Stärke.',max:6},
 {id:'critical',icon:'◆',title:'Goldene Rinde',desc:'+5 % Chance auf doppelten Schaden.',max:8},
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
 {id:'execute',icon:'✧',title:'Letzter Bissen',desc:'+10 % Schaden gegen Ziele unter 35 % Leben.',max:6},
 {id:'fork',icon:'⋏',title:'Splittergelage',desc:'Splitter erben Treffer-Effekte. Pro Treffer sind höchstens sieben Splitter möglich.',max:2,rare:true,requires:[['spread','pierce']]},
 {id:'cascade',icon:'ϟ',title:'Kettenreaktion',desc:'Ketten übertragen Frost und Glut.',max:3,rare:true,requires:[['chain']]},
 {id:'shatter',icon:'❄',title:'Thermischer Schock',desc:'Frost und Glut zünden gemeinsam eine Flächenexplosion.',max:2,rare:true,requires:[['frost'],['ember']]},
 {id:'echoForge',icon:'»',title:'Echokammer',desc:'Kopiert jeden vierten Angriff. Ersetzt die Echo-Schüsse von Doppelter Boden.',max:1,rare:true,requires:[['echo']]},
 {id:'orbital',icon:'◎',title:'Mondschmelze',desc:'Sonderangriffe erschaffen zwei kreisende Käsemonde.',max:2,rare:true,requires:[['guard']]},
 {id:'mastery',icon:'✦',title:'Feinschliff',desc:'+1 % zusätzlicher Waffenschaden.',max:Infinity,repeatable:true},
 {id:'tempo',icon:'ϟ',title:'Fingerfertigkeit',desc:'+1 % Sonderangriffsschaden je Rang.',max:Infinity,repeatable:true},
 {id:'cellar',icon:'∞',title:'Gläserpflege',desc:'+1 % zusätzliche Wein- und Laserdauer.',max:Infinity,repeatable:true}
];
const baseSkills=[
 {id:'salvo',icon:'❄',title:'Eisfächer',desc:'Breite Eiskristalle bremsen Gegner. Zusatzschüsse decken mehr Fläche ab.',cards:['multiShot','frost','fanShot','spread','bounceCrust','breakShot','iceSpindle'],talents:['A1-5','A1-23']},
 {id:'precision',icon:'◆',title:'Erdbolzen',desc:'Ein schwerer Steinbolzen verursacht 18 % mehr Grundschaden gegen Einzelziele.',cards:['damage','critical','execute','pierce','velocity','seekShot'],talents:['A2-5','A2-23']},
 {id:'element',icon:'✹',title:'Glutkern',desc:'Eine flackernde Glut setzt Gegner beim ersten Treffer in Brand.',cards:['ember','chain','damage','pierce','sparkBobbin'],talents:['A3-5','A3-23']},
 {id:'laser',icon:'ϟ',title:'Lichtlanze · Wind',desc:'Ein gebündelter Windstrahl durchdringt alle Ziele in seiner Spur.',cards:['damage','size','duration','sunLance','chain','echo','carousel','fanShot','multiShot'],talents:['A1-5','A3-23']}
];
function extraShotScale(index,hasWine=false){
 const factor=!hasWine&&player.skill.id==='salvo'?1+.04*Number(owns('A1-5'))+.08*Number(owns('A1-23')):.85;
 return factor*[.24,.24,.17,.17,.11,.11][index];
}
const specialCards=new Set(['charge','blast','tempo','orbital']);
const projectileCards=new Set(['velocity','pierce','ricochet']);
const projectileSources=['spread','rear','breakShot','fork',...cartridges.filter(card=>card.id!=='sunLance').map(card=>card.id)];
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
 critical:r=>r*.05,
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
 execute:r=>r*.10,
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
 bounceCrust:r=>r?'+1 Abpraller · Splitter mit 21 % Schaden':'Kein Splitter beim Abprallen',
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
for(const cartridge of cartridges){
 cardCodes[cartridge.id]=cartridge.code;
 cardEffectLabels[cartridge.id]=rank=>rank?'Patrone aktiv':'Keine Patrone';
}
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
let buildCards=null;
function collectedCards(){
 if(buildCards)return buildCards;
 return buildCards=cardDefs.filter(card=>upgrades[card.id]>0).map(card=>({
  code:cardCodes[card.id],title:card.title,rank:upgrades[card.id]
 }));
}
function buildDetails(){
 const cards=collectedCards();
 if(!cards.length)return '';
 const entries=cards.map(card=>'<li>'+card.code+card.rank+' · '+card.title+'</li>').join('');
 return '<details class="build-details"><summary>Gesammelte Power-ups</summary><ul>'+entries+'</ul></details>';
}
const gearSlots={
 head:{label:'Kopf',pixels:['.###.','#####','##.##','##...']},
 hooves:{label:'Hufe',pixels:['#...#','#...#','#...#','#####','.###.']},
 saddle:{label:'Sattel',pixels:['#...#','#####','.###.','.###.','.#.#.']},
 harness:{label:'Geschirr',pixels:['#...#','.#.#.','..#..','.#.#.','#...#']},
 charm:{label:'Talisman',pixels:['..#..','.#.#.','#####','.###.','..#..']}
};
const gearRarities=[
 {label:'Gewöhnlich',color:'#a8dccb',rareWeight:75,bossWeight:20},
 {label:'Selten',color:'#d5acff',rareWeight:25,bossWeight:65},
 {label:'Legendär',color:'#ffd278',rareWeight:0,bossWeight:15}
];
const gearCatalog=[
 [1,'Sesamkappe','head',0,{standardDamage:.08}],
 [2,'Nazar-Visier','head',0,{criticalChance:.05}],
 [3,'Korkhelm','head',0,{hitProtection:.10}],
 [4,'Messingblende','head',0,{bossDamage:.09}],
 [5,'Mottenhaube','head',0,{standardRate:.10}],
 [6,'Ibis-Maske','head',0,{wineDamage:.08}],
 [7,'Krone der Sesamkönigin','head',1,{standardDamage:.12,criticalChance:.05}],
 [8,'Großwesir-Visier','head',1,{bossDamage:.16}],
 [9,'Helm der Nachtschicht','head',1,{hitProtection:.20,speed:.05}],
 [10,'Auge des Dschinns','head',2,{criticalChance:.10,criticalDamage:.25}],
 [11,'Kupfereisen','hooves',0,{speed:.08}],
 [12,'Korksohlen','hooves',0,{hitProtection:.12}],
 [13,'Grubenschuhe','hooves',0,{lowSpeed:.12}],
 [14,'Magnetnägel','hooves',0,{orbMagnet:24}],
 [15,'Flaschenhufe','hooves',0,{bottleMagnet:40}],
 [16,'Funkenbeschlag','hooves',0,{grazeRage:.20}],
 [17,'Eisen vom Teppichrochen','hooves',1,{speed:.11,orbMagnet:20}],
 [18,'Gluthufe','hooves',1,{rageSpeed:.20,calmSpeed:.05}],
 [19,'Hufeisen des Schlackenläufers','hooves',1,{speed:.10,hitProtection:.15}],
 [20,'Hufeisen des Rückenwinds','hooves',2,{speed:.13,orbMagnet:35,bottleMagnet:50}],
 [21,'Sattel mit Weintaschen','saddle',0,{wineDuration:.12}],
 [22,'Käsepolster','saddle',0,{standardDamage:.09}],
 [23,'Kohlesattel','saddle',0,{specialDamage:.12}],
 [24,'Kurriersattel','saddle',0,{orbXp:.10}],
 [25,'Kesseldecke','saddle',0,{shieldDuration:2}],
 [26,'Flickensattel','saddle',0,{juiceHealing:.25}],
 [27,'Sattel des Schankwirts','saddle',1,{wineDuration:.16,wineDamage:.08}],
 [28,'Horsts Stahlsattel','saddle',1,{maxHearts:1}],
 [29,'Sattel der Käsekammer','saddle',1,{rageDuration:.18,rageDamage:.08}],
 [30,'Sattel der Reserve','saddle',2,{maxHearts:1,juiceHealing:.50}],
 [31,'Kupferzügel','harness',0,{autoRate:.08}],
 [32,'Perlzügel','harness',0,{wineRate:.10}],
 [33,'Blaue Schutzriemen','harness',0,{guardCooldown:-.12}],
 [34,'Basargurt','harness',0,{fullDamage:.10}],
 [35,'Fassriemen','harness',0,{specialCost:-.10}],
 [36,'Kettenhalfter','harness',0,{lowDamage:.12}],
 [37,'Geschirr des Kupferibis','harness',1,{autoRate:.10,speed:.05}],
 [38,'Kesselgeschirr','harness',1,{guardCooldown:-.20,hitProtection:.10}],
 [39,'Zügel des Kellermeisters','harness',1,{specialCost:-.18,specialDamage:.10}],
 [40,'Geschirr des Wolkenbrechers','harness',2,{autoRate:.15,bossDamage:.12}],
 [41,'Granatapfelkern','charm',0,{orbXp:.12}],
 [42,'Kleines Blaulicht','charm',0,{blockRage:.15}],
 [43,'Zahn der Grubenmotte','charm',0,{killRage:.12}],
 [44,'Lokumsiegel','charm',0,{criticalDamage:.20}],
 [45,'Laternenfunke','charm',0,{rageDamage:.10}],
 [46,'Traubenkern aus Messing','charm',0,{juiceHealing:.30}],
 [47,'Medaille der Nachtschicht','charm',1,{orbXp:.18,orbMagnet:25}],
 [48,'Anhänger des letzten Hufs','charm',1,{lowDamage:.18,lowSpeed:.08}],
 [49,'Siegel des Käsesultans','charm',1,{rageDuration:.18,allRage:.15}],
 [50,'Herz der Basarlaterne','charm',2,{rageDamage:.18,allRage:.25}]
].map(([id,name,slot,rarity,effects])=>({id,name,slot,rarity,effects}));
const gearEffectLabels={
 standardDamage:'Standardschaden',criticalChance:'PP kritische Trefferchance',
 hitProtection:'Schutzzeit nach Herzverlust',bossDamage:'Schaden an Bosssegmenten',
 standardRate:'Feuerrate für Standardschüsse',wineDamage:'Schaden mit Weinfeuer',
 criticalDamage:'auf den Krit-Multiplikator',speed:'Flugtempo',
 lowSpeed:'Flugtempo bei höchstens zwei Herzen',orbMagnet:'Pixel XP-Orb-Magnetradius',
 bottleMagnet:'Pixel Flaschen-Magnetradius',grazeRage:'Käserausch-Ladung aus knappen Ausweichmanövern',
 rageSpeed:'Flugtempo im Käserausch',calmSpeed:'Flugtempo außerhalb des Käserauschs',
 wineDuration:'Dauer neu aufgenommener Weinwaffen',specialDamage:'Schaden mit Sonderangriffen',
 orbXp:'Erfahrung aus XP-Orbs',shieldDuration:'Sekunden Dauer für neu eingesammelte Schilde',
 juiceHealing:'Heilung durch Traubenmost',maxHearts:'maximales Herz',
 rageDuration:'Käserausch-Dauer',rageDamage:'Schaden im Käserausch',
 autoRate:'Feuerrate für automatisches Feuer',wineRate:'Feuerrate mit Weinfeuer',
 guardCooldown:'Abklingzeit des Schutzimpulses',fullDamage:'Schaden bei vollen Herzen',
 specialCost:'Weinkosten für Sonderangriffe',lowDamage:'Schaden bei höchstens zwei Herzen',
 blockRage:'Käserausch-Ladung aus Schutzblocks',killRage:'Käserausch-Ladung aus Abschüssen',
 allRage:'Käserausch-Ladung aus allen Quellen'
};
const flatGearEffects=new Set(['criticalDamage','orbMagnet','bottleMagnet','shieldDuration','maxHearts']);
const gearBagCapacity=4,gearDropDuration=20;
let wornGear={},gearBag=[],gearDrops=[],gearStats={};
let pauseView='main',gearActions=[],gearSelection=0;
function clearRunGear(){
 wornGear={};gearBag=[];gearDrops=[];gearStats={};
 pauseView='main';gearActions=[];gearSelection=0;
}
function gearBonus(stat){return gearStats[stat]||0}
function gearFactor(stat){return 1+gearBonus(stat)}
function maxHearts(){return MAX_HEARTS+gearBonus('maxHearts')}
function equipGear(item){
 wornGear[item.slot]=item;
 gearStats={};
 for(const equipped of Object.values(wornGear)){
  for(const [stat,value] of Object.entries(equipped.effects)){
   gearStats[stat]=gearBonus(stat)+value;
  }
 }
 hearts=Math.min(hearts,maxHearts());
}
function chooseGearDrop(isBoss){
 const occupied=new Set([...Object.values(wornGear),...gearBag,...gearDrops.map(drop=>drop.item)]);
 const available=gearCatalog.filter(item=>!occupied.has(item));
 const tiers=gearRarities.map((rarity,index)=>({
  weight:isBoss?rarity.bossWeight:rarity.rareWeight,
  items:available.filter(item=>item.rarity===index)
 })).filter(tier=>tier.weight>0&&tier.items.length);
 if(!tiers.length)return null;
 let roll=rand(0,tiers.reduce((sum,tier)=>sum+tier.weight,0));
 const {items}=tiers.find(tier=>(roll-=tier.weight)<0);
 return items[Math.floor(rand(0,items.length))];
}
function dropGear(x,y,isBoss=false,returning=false){
 if(state!=='playing')return;
 const item=chooseGearDrop(isBoss);
 if(item)gearDrops.push({item,x:clamp(x,22,W-22),y:clamp(y,88,H-22),w:30,h:30,life:gearDropDuration,returning});
 return item;
}
function collectGear(){
 for(const drop of gearDrops){
  if(drop.returning||!hit(player,drop))continue;
  gearDrops=gearDrops.filter(other=>other!==drop);
  const {item}=drop;
  if(!wornGear[item.slot])equipGear(item);
  else if(gearBag.length<gearBagCapacity)gearBag.push(item);
  else{openGearLoot(item);return}
  acknowledgeGear(item);
 }
}
function acknowledgeGear(item){
 sound('pickup');
 notice=2.5;
 noticeText=(wornGear[item.slot]===item?'AUSGERÜSTET · ':'IM RUCKSACK · ')+item.name.toUpperCase();
}
let metaLastCritical=false;
let transition=null;
let pausedFrom=null;
const transitionInterrupt={};
let state='menu', t=0, runTime=0, level=1, xp=0, xpNeeded=10, choices=[], score=0, hearts=MAX_HEARTS, player;
let orbs=[];
let elementalBursts=[];
let enemies=[], bullets=[], shots=[], pickups=[], particles=[], deaths=[], rings=[], beams=[];
let hostileShotCount=0, enemyShotBudget=3, bossShotCount=0;
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
const xboxButtons={0:'A',1:'B',2:'X',3:'Y',4:'LB',9:'Menü'};
const playStationButtons={0:'×',1:'○',2:'□',3:'△',4:'L1',9:'Options'};
const playStationButtonNames={0:'Kreuz',1:'Kreis',2:'Viereck',3:'Dreieck',4:'L1',9:'Options'};
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
let debugTalents=null,regularTalents=null;
if(metaAvailable){try{const loaded=PfertMeta.load(window.localStorage);metaData=loaded.data;metaWarning=loaded.error||'';}catch(e){metaWarning='Fortschritt kann nicht dauerhaft gespeichert werden.'}}
function metaSave(){
 if(regularTalents){debugTalents=metaData;return}
 try{if(PfertMeta.save(window.localStorage,metaData)){metaWarning='';return}}catch(e){}
 metaWarning='Fortschritt konnte im Browser nicht gespeichert werden. Sichere ihn als Datei.';
}

function exportTalents(){
 const file=new Blob([JSON.stringify(PfertMeta.validate(metaData),null,2)],{type:'application/json'});
 const url=URL.createObjectURL(file);
 const link=document.createElement('a');
 link.href=url;
 link.download='pfert-talente.json';
 link.click();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
async function importTalents(file){
 if(!file||state!=='talents'||regularTalents)return;
 let imported;
 try{imported=PfertMeta.validate(JSON.parse(await file.text()))}catch(error){
  if(state==='talents'&&!regularTalents)overlay.querySelector('.meta-message').textContent='Ungültige Talent-Sicherung.';
  return;
 }
 if(state!=='talents'||regularTalents||!window.confirm('Aktuellen Talentstand durch die Sicherung ersetzen?'))return;
 metaData=imported;
 metaSave();
 renderTalents();
}
function useDebugTalents(){
 if(!metaAvailable||regularTalents)return;
 regularTalents=metaData;
 metaData=debugTalents??{...metaData,purchased:[...metaData.purchased]};
}
function leaveDebugTalents(){
 if(!regularTalents)return;
 debugTalents=metaData;
 metaData=regularTalents;
 regularTalents=null;
}
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
let cachedPurchases=null,ownedTalents=new Set();
const talentCountCache=new Map();
function syncTalentCache(){
 const purchases=metaData?.purchased;
 if(purchases===cachedPurchases)return;
 cachedPurchases=purchases;
 ownedTalents=new Set(purchases);
 talentCountCache.clear();
}
function owns(id){
 syncTalentCache();
 return ownedTalents.has(id);
}
let metaNavigating=false,metaBStart=null,metaBLong=false;
function sellSelectedTalent(){const next=PfertMeta.sell(metaData,metaSelected);if(next){metaData=next;metaSave();renderTalents()}else if(PfertMeta.rank(metaData,metaSelected)>0){overlay.querySelector('.meta-message').textContent='Dieser Knoten kann nicht entfernt werden, solange dadurch andere gekaufte Knoten vom Start getrennt würden.'}}
function metaCount(prefix,numbers){
 if(!metaAvailable||!metaData)return 0;
 syncTalentCache();
 if(!ownedTalents.size)return 0;
 // A group is a subset of the 23 numbered nodes of one branch.
 let mask=0;
 for(const n of numbers)mask|=1<<n;
 let branch=talentCountCache.get(prefix);
 if(!branch){branch=new Map();talentCountCache.set(prefix,branch)}
 if(branch.has(mask))return branch.get(mask);
 const roots=new Set(numbers.map(n=>PfertMeta.canonical(prefix+'-'+n)));
 let sum=0;
 for(const id of roots)sum+=PfertMeta.rank(metaData,id);
 branch.set(mask,sum);
 return sum;
}
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
// Opaque sample points from the first, wings-up frame of horse-v3.png.
const talentAreas=[['A','Angriff'],['V','Überleben'],['K','Käserausch'],['B','Beute'],['W','Wein']];
const talentClusterSteps={
 1:[177,0],5:[224,0],6:[273,-24],10:[322,-37],
 11:[377,-68],13:[431,-62],14:[372,7],16:[429,-10],
 17:[274,31],20:[337,42],21:[387,52],22:[442,52],23:[485,8]
};
const talentWorld={width:3130,height:2460,scale:Math.sqrt(5)};
function talentClusterPoint(index,radius,side=0){
 const angle=(index-1)*Math.PI*2/15-Math.PI/2;
 return {x:Math.round(talentWorld.width/2+talentWorld.scale*1.18*(Math.cos(angle)*radius-Math.sin(angle)*side)),
  y:Math.round(talentWorld.height/2+talentWorld.scale*(Math.sin(angle)*radius+Math.cos(angle)*side))};
}
let talentLayout;
function layoutTalentNodes(){
 if(talentLayout)return talentLayout;
 const positions={S1:{x:talentWorld.width/2,y:talentWorld.height/2}};
 talentAreas.forEach(([area],i)=>{
  if(i)positions['S'+(i+1)]=talentClusterPoint(i*3+1.5,84);
  for(let branch=1;branch<=3;branch++){
   const index=i*3+branch-1;
   for(const [id,[radius,side]] of Object.entries(talentClusterSteps)){
    positions[area+branch+'-'+id]=talentClusterPoint(index,radius,side);
   }
  }
 });
 for(let i=1;i<=10;i++){
  const id='Q'+i;
  const [a,b]=PfertMeta.edges.filter(edge=>edge.includes(id)).map(edge=>positions[edge.find(node=>node!==id)]);
  const x=(a.x+b.x)/2,y=(a.y+b.y)/2,occupied=Object.values(positions);
  const offsets=[[0,0],[0,-45],[0,45],[-45,0],[45,0],[-42,-42],[42,-42],[-42,42],[42,42],[0,-90],[0,90],[-90,0],[90,0]];
  const [dx,dy]=offsets.find(([dx,dy])=>occupied.every(p=>Math.hypot(p.x-x-dx,p.y-y-dy)>39))??[0,0];
  positions[id]={x:x+dx,y:y+dy};
 }
 return talentLayout=positions;
}
function talentConstellations(positions,owned){
 return talentAreas.map(([area,title],i)=>{
  const titlePoint=talentClusterPoint(i*3+1.5,226);
  const clusters=[0,1,2].map(branch=>{
   const index=i*3+branch,prefix=area+(branch+1),{x,y}=talentClusterPoint(index,380);
   const {x:lx,y:ly}=talentClusterPoint(index,532),angle=(index-1)*24-90;
   const crown=prefix+'-23',active=owned.has(prefix+'-5'),{x:cx,y:cy}=positions[crown];
   return '<g class="meta-cluster'+(active?' active':'')+'">'+
    '<ellipse cx="'+x+'" cy="'+y+'" rx="248" ry="161" transform="rotate('+angle+' '+x+' '+y+')"/>'+
    '<circle class="meta-crown-halo" cx="'+cx+'" cy="'+cy+'" r="39"/>'+
    '<text x="'+lx+'" y="'+ly+'">'+talentTitle(crown)+'</text></g>';
  }).join('');
  return '<g class="meta-sector area-'+area+'">'+clusters+
   '<text class="meta-sector-label" x="'+titlePoint.x+'" y="'+titlePoint.y+'">'+title+'</text></g>';
 }).join('');
}
function talentVisibility(data){
 const owned=new Set(PfertMeta.nodes.filter(id=>PfertMeta.rank(data,id)>0));
 const revealed=new Set(['S1',...owned]);
 for(const [a,b] of PfertMeta.edges){
  if(owned.has(a))revealed.add(b);
  if(owned.has(b))revealed.add(a);
 }
 return {owned,revealed};
}
function talentTitle(id){
 return typeof PfertMetaData==='undefined'?'Talent':PfertMetaData.titles[id];
}
function talentDescription(id){
 if(typeof PfertMetaData==='undefined')return '';
 const description=PfertMeta.describe(metaData,id,PfertMetaData.descriptions[id]);
 const skills=baseSkills.filter(skill=>skill.talents.includes(id));
 return skills.length?description+' Verstärkt auch '+skills.map(skill=>skill.title).join(' und ')+'.':description;
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
function talentBonuses(owned){
 if(!owned.size)return '<p>Noch keine Boni freigeschaltet.</p>';
 return '<ul>'+PfertMeta.nodes.filter(id=>owned.has(id)).map(id=>
  '<li><strong>'+talentTitle(id)+'</strong><span>'+talentDescription(id)+'</span></li>'
 ).join('')+'</ul>';
}
function renderTalents(){
 const positions=metaPositions=layoutTalentNodes();
 const {owned,revealed}=talentVisibility(metaData);
 if(!revealed.has(metaSelected))metaSelected='S1';
 const lines=PfertMeta.edges.map(([a,b])=>{
  const type=owned.has(a)&&owned.has(b)?'owned':owned.has(a)||owned.has(b)?'open':'hidden';
  const cross=a.startsWith('Q')||b.startsWith('Q')?' meta-cross-edge':'';
   const rootLink=/^S[2-5]$/.test(a)||a==='S1'&&b==='S2'?' meta-area-edge':'';
  return '<line class="meta-edge-'+type+cross+rootLink+'" x1="'+positions[a].x+'" y1="'+positions[a].y+'" x2="'+positions[b].x+'" y2="'+positions[b].y+'"/>';
 }).join('');
 const locked=PfertMeta.nodes.filter(id=>!revealed.has(id)).map(id=>{
  const {x,y}=positions[id],radius=id.endsWith('-23')?23:PfertMeta.limit(id)>1?7:10;
  return '<circle class="meta-locked area-'+id[0]+'" data-id="'+id+'" cx="'+x+'" cy="'+y+'" r="'+radius+'"/>';
 }).join('');
 const nodes=PfertMeta.nodes.filter(id=>revealed.has(id)).map(id=>{
  const p=positions[id],rank=PfertMeta.rank(metaData,id),limit=PfertMeta.limit(id);
  const status=limit>1?rank+'/'+limit:rank?'✓':'';
  const tier=id.endsWith('-23')?' keystone':id[0]==='S'?' root':limit===1?' notable':' minor';
  return '<button class="meta-node area-'+id[0]+tier+(rank?' owned':' available')+(id===metaSelected?' selected':'')+'" data-id="'+id+
   '" style="left:'+p.x+'px;top:'+p.y+'px" aria-label="'+talentTitle(id)+' · '+(limit>1?'Rang '+status:rank?'Gekauft':'Verfügbar')+'">'+
   talentIcon(id)+'<span aria-hidden="true">'+status+'</span></button>';
 }).join('');
 overlay.innerHTML=
  '<header class="meta-toolbar">'+
   '<button id="meta-back">‹ Zurück</button>'+
   '<h2>Talentbaum</h2>'+
   '<span class="meta-points">'+(regularTalents?'Debug · ':'')+'<b>'+metaData.points+'</b> Talentpunkte</span>'+
  '</header>'+
  '<div class="meta-layout">'+
   '<div class="meta-chart">'+
    '<div id="meta-viewport" class="meta-viewport" aria-label="Talentpfade">'+
     '<div class="meta-map"><div class="meta-world">'+
      '<svg class="meta-paths" width="'+talentWorld.width+'" height="'+talentWorld.height+'" aria-hidden="true">'+
       '<circle class="meta-hub" cx="'+positions.S1.x+'" cy="'+positions.S1.y+'" r="88"/>'+
       '<circle class="meta-hub inner" cx="'+positions.S1.x+'" cy="'+positions.S1.y+'" r="68"/>'+
       talentConstellations(positions,owned)+lines+locked+
      '</svg>'+nodes+
     '</div></div>'+
    '</div>'+
    '<div class="meta-zoom" role="group" aria-label="Zoom">'+
     '<button id="meta-minus" aria-label="Verkleinern">−</button>'+
     '<output class="meta-scale" aria-label="Zoomstufe"></output>'+
     '<button id="meta-plus" aria-label="Vergrößern">+</button>'+
    '</div>'+
   '</div>'+
   '<aside class="meta-panel" aria-label="Talentdetails und Boni">'+
    '<div class="meta-detail">'+talentDetail()+'</div>'+
    '<p class="meta-message" role="status">'+metaWarning+'</p>'+
    '<div class="meta-management">'+
     '<button id="meta-refund">Neu verteilen</button>'+
     '<button id="meta-reset">Fortschritt löschen</button>'+
     (regularTalents?'':'<button id="meta-export">Sicherung herunterladen</button>'+
      '<button id="meta-import">Sicherung laden</button>'+
      '<input id="meta-backup-file" type="file" accept=".json,application/json" hidden>')+
    '</div>'+
    '<section class="meta-bonuses" aria-labelledby="meta-bonuses-title">'+
     '<h3 id="meta-bonuses-title">Freigeschaltete Boni</h3>'+talentBonuses(owned)+
    '</section>'+
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
 const fitZoom=()=>Math.max(.05,Math.min(viewport.clientWidth/talentWorld.width,viewport.clientHeight/talentWorld.height));
 const centerMap=()=>({x:(viewport.clientWidth-talentWorld.width*metaZoom)/2,y:(viewport.clientHeight-talentWorld.height*metaZoom)/2});
 const place=()=>{
  map.style.left=metaPan.x+'px';
  map.style.top=metaPan.y+'px';
 };
 const updateZoom=()=>{
  world.style.transform='scale('+metaZoom+')';
   world.style.setProperty?.('--talent-sector-font',Math.max(25,12/metaZoom)+'px');
   world.style.setProperty?.('--talent-cluster-font',Math.max(22,11/metaZoom)+'px');
   world.classList?.toggle?.('talent-overview',metaZoom<fitZoom()*1.6);
  scale.textContent=Math.round(metaZoom*100)+' %';
  place();
 };
 if(!metaPanReady){
  const heart=positions.S1;
  metaZoom=owned.size?fitZoom():Math.min(1.5,fitZoom()*1.35);
  metaPan=owned.size?centerMap():{x:viewport.clientWidth/2-heart.x*metaZoom,y:viewport.clientHeight/2-heart.y*metaZoom};
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
 let drag=null,didPan=false;
 viewport.addEventListener('dragstart',e=>e.preventDefault());
 viewport.addEventListener('click',e=>{
  if(didPan&&e.detail>0){
   e.preventDefault();
   e.stopPropagation();
  }
 },true);
 viewport.addEventListener('pointerdown',e=>{
  if(e.button!==0||drag)return;
  didPan=false;
  drag={id:e.pointerId,x:e.clientX,y:e.clientY,px:metaPan.x,py:metaPan.y};
 });
 viewport.addEventListener('pointermove',e=>{
  if(drag?.id!==e.pointerId)return;
  const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
  if(!didPan){
   if(Math.hypot(dx,dy)<5)return;
   didPan=true;
   viewport.setPointerCapture(e.pointerId);
   viewport.classList.add('dragging');
   tip.hidden=true;
  }
  metaPan={x:drag.px+dx,y:drag.py+dy};
  place();
 });
 const stopDrag=e=>{
  if(drag?.id!==e.pointerId)return;
  drag=null;
  viewport.classList.remove('dragging');
 };
 for(const event of ['pointerup','pointercancel','lostpointercapture'])viewport.addEventListener(event,stopDrag);
 viewport.addEventListener('pointerleave',e=>{if(!didPan)stopDrag(e)});
 viewport.addEventListener('wheel',e=>{
  e.preventDefault();
  const bounds=viewport.getBoundingClientRect();
  const delta=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?viewport.clientHeight:1);
  zoomAt(e.clientX-bounds.left,e.clientY-bounds.top,delta);
 },{passive:false});
 overlay.querySelectorAll('.meta-node, .meta-locked').forEach(node=>{
  const show=()=>{
   if(drag&&didPan)return;
   const bounds=node.getBoundingClientRect(),panel=overlay.getBoundingClientRect();
   const id=node.dataset.id;
   tip.textContent=talentTitle(id)+(revealed.has(id)?'':' · Gesperrt')+' · '+talentDescription(id);
   tip.hidden=false;
   const center=bounds.left+bounds.width/2-panel.left;
   tip.style.left=clamp(center,tip.offsetWidth/2+8,panel.width-tip.offsetWidth/2-8)+'px';
   const above=bounds.top-panel.top-8;
   const top=above>=tip.offsetHeight?above-tip.offsetHeight:bounds.bottom-panel.top+8;
   tip.style.top=clamp(top,8,Math.max(8,panel.height-tip.offsetHeight-8))+'px';
  };
  const hide=()=>tip.hidden=true;
  node.addEventListener('mouseenter',show);
  node.addEventListener('focus',show);
  node.addEventListener('mouseleave',hide);
  node.addEventListener('blur',hide);
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
 if(!regularTalents){
  const backup=document.getElementById('meta-backup-file');
  document.getElementById('meta-export').addEventListener('click',exportTalents);
  document.getElementById('meta-import').addEventListener('click',()=>backup.click());
  backup.addEventListener('change',()=>{
   const file=backup.files[0];
   backup.value='';
   importTalents(file);
  });
 }
 document.getElementById('meta-back').addEventListener('click',()=>{
  leaveDebugTalents();
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
function addRage(amount,source){const graze=source==='grazeRage';if(!player||player.overdrive>0||player.metaRageLock>0)return;const before=player.rage;const rate=(1+.0075*metaCount('K2',[1,2,3,4,6,7,8,9])+.015*(metaCount('K3',[11,12,14,15,17,18,19])+2*Number(owns('K3-21')))+(graze?.015*metaCount('K3',[1,2,3,4,6,7,8,9]):0))*(owns('S3')?1.03:1)*(owns('K1-23')?.85:1)*(owns('K2-23')?.8:1);player.rage=clamp(player.rage+amount*.5*rate*(1+gearBonus('allRage')+gearBonus(source)),0,100);if(before<100&&player.rage>=100){sound('ready');notice=2;noticeText='KÄSERAUSCH BEREIT · Q'}}
function activateRage(){if(state!=='playing'||player.rage<100||player.overdrive>0)return false;player.rage=0;player.overdrive=rageBaseDuration*(1+.03*metaCount('K1',[5,10])+.03*metaCount('K2',[5,10])+.015*(metaCount('K2',[11,12,14,15,17,18,19])+2*Number(owns('K2-21'))))*(owns('K2-23')?1.525:1)*gearFactor('rageDuration');player.metaRageMax=player.overdrive;player.metaAfterglow=0;player.metaLightning=1;heal(2);player.inv=Math.max(player.inv,owns('K3-13')?.75:.65);shots=shots.filter(s=>s.x+s.w/2<0||s.x-s.w/2>W||s.y+s.h/2<62||s.y-s.h/2>H);if(owns('K3-22'))player.inv=Math.max(player.inv,1.5);if(owns('K3-23')){player.inv=Math.max(player.inv,3);player.metaRageLock=player.overdrive+5}for(const e of enemies){if(e.hp>0&&e.x+e.w/2>=0&&e.x-e.w/2<=W&&e.y+e.h/2>=62&&e.y-e.h/2<=H){e.hp=0;death(e)}}enemies=enemies.filter(e=>e.hp>0);ring(player.x,player.y,'#b6f8ff',180);flashes.push({x:player.x,y:player.y,r:100,life:.15,maxLife:.15});shake=4;notice=2;noticeText='KÄSERAUSCH!';sound('overdrive');return true}

function clock(s){return String(Math.floor(s/60)).padStart(2,'0')+':'+String(Math.floor(s%60)).padStart(2,'0')}
function sound(kind,strong=false){if(typeof PfertSound!=='undefined')PfertSound.play(kind,strong)}
function reset(skill=baseSkills[0]){startRun('regular',skill)}
let starRoute=null,nextStarRoute=100,starRouteIndex=0;
let formation=null;
let flightStats;
function startRun(mode,skill=baseSkills[0]){
 starRoute=null;nextStarRoute=100;starRouteIndex=0;formation=null;
 flightStats={enemies:0,bosses:0,bestCombo:0,slipstreams:0,deliveries:0};
 if(mode==='regular')leaveDebugTalents();
 runMode=mode;
 if(typeof PfertSound!=='undefined'){PfertSound.wake();PfertSound.startMusic()}
 clearRunGear();
 pausedFrom=null;transition=null;t=0;runTime=0;metaBosses=0;metaTimePoints=0;metaSavedAt=0;level=1;xp=owns('B1-13')?2:0;xpNeeded=10;orbs=[];choices=[];score=0;hearts=MAX_HEARTS;lastRare=null;
 buildCards=null;
 upgrades=Object.fromEntries(cardDefs.map(card=>[card.id,0]));
 player={skill,x:135,y:H/2,w:40,h:29,inv:0,effects:Array(16).fill(0),weapon:-1,charge:0,charging:false,specials:owns('W1-23')?2:3,specialCount:0,freeSpecialUsed:false,bossSpecialUsed:false,autoCooldown:0,autoAttacks:0,podSide:1,podCooldown:0,muzzle:0,guardFlash:0,attacks:0,rage:owns('K2-13')?15:0,overdrive:0,metaAfterglow:0,chargeCue:false,readyCue:false};
 player.fieldPower={dropIn:rand(45,65),queue:[],rockets:0,launchCooldown:0,shield:0,shieldTime:0,beamTime:0};
 enemies=[];bullets=[];shots=[];pickups=[];bossPickups=[];particles=[];deaths=[];rings=[];beams=[];
 hostileShotCount=0;enemyShotBudget=3;bossShotCount=0;
 elementalBursts=[];
 boss=null;firstBossDefeated=false;rareEnemyQueue=[];nextRareEnemy=rand(120,145);spawn=1;spawnIndex=0;drop=8;nextBoss=300;bossCount=0;flash=0;shake=0;levelIndex=0;
 blockerPatrolDelay=rand(95,120);blockerPatrolQueue=[];
 secret=false;secretTime=0;secretType=0;golden=null;goldenAppeared=false;secondAppeared=false;combo=0;comboTime=0;threat=0;arcs=[];flashes=[];notice=0;noticeText='';
 keys.clear();last=0;state='playing';overlay.classList.add('hidden');
 overlay.classList.remove('upgrade-overlay','game-over','debug-overlay','talent-overlay','pause-overlay','gear-overlay','skill-overlay');
}
function cancelCharge(){keys.clear();if(player){player.charging=false;player.charge=0}}
function pauseGame(){
 if(state!=='playing'&&state!=='transition')return;
 pausedFrom=state;
 state='paused';
 cancelCharge();
 padBlocked=true;padMove={x:0,y:0};
 overlay.classList.remove('hidden');
 overlay.classList.add('pause-overlay');
 renderPauseMenu();
}
function renderPauseMenu(){
 pauseView='main';
 overlay.classList.remove('gear-overlay');
 overlay.innerHTML='<h2 id="pause-title">Pause</h2><div class="pause-actions">'+
  '<button id="resume">Fortsetzen</button><button id="gear-open">Ausrüstung</button><button id="end-run">Runde beenden</button></div>'+
  '<label class="music-volume">Musiklautstärke <input id="music-volume" type="range" min="0" max="100" step="1"></label>'+
  '<p class="hint">Windschatten · Drei Geschosse in 2,5 s knapp passieren.</p>'+
  '<p class="hint">Esc oder Controller '+padHint(9)+' zum Fortsetzen</p>'+
  '<p class="hint pad-only">Steuerkreuz ↑ / ↓ wählt · ← / → regelt Musik</p>';
 const volume=document.getElementById('music-volume');
 volume.value=Math.round((typeof PfertSound==='undefined' ? .32 : PfertSound.musicVolume)*100);
 volume.addEventListener('input',()=>applyMusicVolume(volume));
 bindGearActions([
  {id:'resume',run:resumeGame},{id:'gear-open',run:renderGearInventory},
  {id:'end-run',run:confirmEndRun},{id:'music-volume'}
 ]);
}
function applyMusicVolume(volume){
 if(typeof PfertSound!=='undefined')PfertSound.musicVolume=Number(volume.value)/100;
}
function confirmEndRun(){
 pauseView='confirmEnd';
 overlay.innerHTML='<h2>Runde beenden?</h2><p>Du siehst deine Rundenauswertung. Die Runde zählt nicht für die Punktetafel.</p>'+
  '<div class="pause-actions"><button id="keep-run">Zurück zur Pause</button><button id="confirm-end">Runde beenden</button></div>';
 bindGearActions([{id:'keep-run',run:renderPauseMenu},{id:'confirm-end',run:()=>end(false)}]);
}
function gearDetails(item){
 const rarity=gearRarities[item.rarity];
 const effects=Object.entries(item.effects).map(([stat,value])=>{
  const magnitude=flatGearEffects.has(stat)?numberLabel.format(Math.abs(value)):
   stat==='criticalChance'?numberLabel.format(Math.abs(value)*100):percent(Math.abs(value));
  return '<span>'+(value<0?'−':'+')+magnitude+' '+gearEffectLabels[stat]+'</span>';
 }).join('');
 return '<span class="gear-details" style="--gear-color:'+rarity.color+'"><strong>'+item.name+
  '</strong><small>'+rarity.label+' · '+gearSlots[item.slot].label+'</small>'+effects+'</span>';
}
function gearButton(id,label,item){
 return '<button id="'+id+'" class="gear-option">'+label+(item?gearDetails(item):'')+'</button>';
}
function bindGearActions(actions,selection=0){
 gearActions=actions;
 actions.forEach(({id,run},index)=>{
  const button=document.getElementById(id);
  if(run)button.addEventListener('click',()=>run());
  button.addEventListener('focus',()=>selectGearAction(index,false));
 });
 refreshPadHints();
 selectGearAction(selection);
}
function selectGearAction(index,focus=true){
 gearSelection=(index+gearActions.length)%gearActions.length;
 gearActions.forEach(({id},i)=>document.getElementById(id).classList.toggle?.('gear-selected',i===gearSelection));
 if(pauseView==='inventory'){
  for(const slot of Object.keys(gearSlots)){
   document.getElementById('gear-worn-'+slot).classList.toggle?.('gear-target',gearActions[gearSelection].slot===slot);
  }
 }
 if(focus)document.getElementById(gearActions[gearSelection].id).focus?.();
}
function renderGearInventory(selection=0){
 pauseView='inventory';
 overlay.classList.add('gear-overlay');
 const worn=Object.entries(gearSlots).map(([slot,{label}])=>
  '<div id="gear-worn-'+slot+'" class="gear-tile"><b>'+label+'</b>'+
  (wornGear[slot]?gearDetails(wornGear[slot]):'<small>Frei</small>')+'</div>').join('');
 const reserve=Array.from({length:gearBagCapacity},(_,index)=>gearBag[index]?
  gearButton('gear-bag-'+index,'Ausrüsten',gearBag[index]):'<div class="gear-tile"><small>Frei</small></div>').join('');
 overlay.innerHTML='<div class="gear-panel"><h2>Ausrüstung</h2><h3>Getragen</h3><div class="gear-grid gear-worn">'+worn+
  '</div><h3>Rucksack · '+gearBag.length+' / '+gearBagCapacity+'</h3><div class="gear-grid">'+reserve+
  '</div><div class="gear-footer">'+gearButton('gear-back','Zurück')+
  '<p class="hint">Pfeiltasten oder Steuerkreuz · Enter oder '+padHint(0)+' zum Ausrüsten</p></div></div>';
 const actions=gearBag.map((item,index)=>({id:'gear-bag-'+index,slot:item.slot,run:()=>{
  gearBag[index]=wornGear[item.slot];
  equipGear(item);
  renderGearInventory(index);
 }}));
 actions.push({id:'gear-back',run:renderPauseMenu});
 bindGearActions(actions,selection);
}
function openGearLoot(item){
 pausedFrom='playing';state='paused';pauseView='loot';
 cancelCharge();padBlocked=true;padMove={x:0,y:0};
 overlay.classList.remove('hidden');
 overlay.classList.add('pause-overlay','gear-overlay');
 const choices=gearBag.map((stored,index)=>gearButton('gear-replace-'+index,'Im Rucksack ersetzen',stored)).join('');
 overlay.innerHTML='<div class="gear-panel"><h2>Rucksack voll</h2><div class="gear-comparison">'+
  '<div class="gear-tile"><b>Neuer Fund</b>'+gearDetails(item)+'</div>'+
  '<div class="gear-tile"><b>Getragen</b>'+gearDetails(wornGear[item.slot])+'</div></div>'+
  '<div class="gear-grid">'+choices+'</div><div class="gear-footer">'+
  gearButton('gear-equip','Getragenes Item ersetzen')+gearButton('gear-discard','Fund zurücklassen')+
  '</div><p class="hint">Pfeiltasten oder Steuerkreuz · Enter oder '+padHint(0)+' zum Bestätigen</p></div>';
 const actions=gearBag.map((stored,index)=>({id:'gear-replace-'+index,run:()=>{
  gearBag[index]=item;acknowledgeGear(item);resumeGame();
 }}));
 actions.push({id:'gear-equip',run:()=>{equipGear(item);acknowledgeGear(item);resumeGame()}},
  {id:'gear-discard',run:resumeGame});
 bindGearActions(actions,actions.length-1);
}
function backFromGear(){
 if(pauseView==='inventory'||pauseView==='confirmEnd')renderPauseMenu();
 else resumeGame();
}
function resumeGame(){
 if(state!=='paused')return;
 state=pausedFrom;
 pausedFrom=null;
 cancelCharge();
 padBlocked=true;padMove={x:0,y:0};
 last=0;
 pauseView='main';gearActions=[];gearSelection=0;
 overlay.classList.add('hidden');
 overlay.classList.remove('pause-overlay','gear-overlay');
}
function pauseOnFocusLoss(){
 cancelCharge();
 padBlocked=true;padMove={x:0,y:0};
 pauseGame();
}
let skillSelection=0,lastChosenSkill=0,skillReturn;
function chooseBaseSkill(index){
 if(state!=='skill'||!baseSkills[index])return;
 lastChosenSkill=index;
 reset(baseSkills[index]);
}
function selectBaseSkill(index,focus=true){
 skillSelection=(index+baseSkills.length)%baseSkills.length;
 baseSkills.forEach((_,i)=>document.getElementById('skill-'+i)?.classList.toggle?.('selected',i===skillSelection));
 if(focus)document.getElementById('skill-'+skillSelection)?.focus?.();
}
function showBaseSkills(){
 if(state!=='menu'&&state!=='over')return;
 skillReturn={state,markup:overlay.innerHTML};
 state='skill';padBlocked=true;cancelCharge();
 overlay.classList.remove('game-over');
 overlay.classList.add('skill-overlay');
 overlay.innerHTML='<h2>Basisskill wählen</h2><div class="skill-options">'+baseSkills.map((skill,i)=>
  '<button id="skill-'+i+'" class="skill-option skill-'+skill.id+'"><span class="skill-icon" aria-hidden="true">'+skill.icon+
  '</span><strong>'+skill.title+'</strong><span>'+skill.desc+'</span>'+
  (metaAvailable?'<span class="skill-talent">Talentbonus · '+skill.talents.map(id=>talentTitle(id)+(owns(id)?' ✓':'')).join(' / ')+'</span>':'')+'</button>').join('')+
  '</div><p class="hint">Klicken oder Pfeile + Enter · Steuerkreuz + '+padHint(0)+'</p><button id="skill-back">Zurück</button>';
 refreshPadHints();
 baseSkills.forEach((_,i)=>{
  const button=document.getElementById('skill-'+i);
  button.addEventListener('click',()=>chooseBaseSkill(i));
  button.addEventListener('focus',()=>selectBaseSkill(i,false));
 });
 document.getElementById('skill-back').addEventListener('click',closeBaseSkills);
 selectBaseSkill(lastChosenSkill);
}
function closeBaseSkills(){
 state=skillReturn.state;
 overlay.classList.remove('skill-overlay');
 if(state==='over')overlay.classList.add('game-over');
 overlay.innerHTML=skillReturn.markup;
 padBlocked=true;bindHomeControls();
 document.getElementById(state==='menu'?'start':'again')?.focus?.({preventScroll:true});
}
function bindHomeControls(){
 refreshPadHints();
 document.getElementById(state==='menu'?'start':'again')?.addEventListener('click',showBaseSkills);
 document.getElementById('talents')?.addEventListener('click',showTalents);
}
function goToStartMenu(){
 leaveDebugTalents();
 if(typeof PfertSound!=='undefined')PfertSound.stopMusic();
 state='menu';runMode='regular';player=null;boss=null;
 overlay.classList.remove('game-over','debug-overlay','skill-overlay','hidden');
 overlay.innerHTML=startMenuMarkup;
 cancelCharge();padBlocked=true;bindHomeControls();
}
function selectDebugOption(direction){
 debugSelection=(debugSelection+direction+debugOptions.length)%debugOptions.length;
 debugOptions.forEach((option,i)=>document.getElementById(option.id)?.classList.toggle?.('debug-selected',i===debugSelection));
}
function startDebugRun(){
 if(debugTalents)useDebugTalents();
 startRun('debug');
 padBlocked=true;
 notice=4;noticeText='DEBUG · NUM 1 PUNKTE · NUM 2–9 BOSSE';
}
function debugBossJump(which,machine=false){
 boss=null;golden=null;bullets=[];beams=[];orbs=[];bossPickups=[];pickups=[];
 cancelCharge();player.inv=2;
 if(which<=6||which===9){
  secret=false;secretType=0;secretTime=0;
  bossCount=machine?which+3:which===9?0:which-2;
  nextBoss=Math.max(t,nextBoss);startBoss(which===9);
 }else{
  secret=true;secretType=which-6;secretTime=secretType===1?45:60;startRuhrBoss();
 }
}
function grantDebugTalentPoints(){
 if(!metaAvailable)return;
 if(state==='debugResult')goToStartMenu();
 const atHome=state==='menu'||state==='over';
 const openTalentTree=state==='talents'||atHome;
 if(openTalentTree||runMode==='debug'){
  if(runMode==='debug')useDebugTalents();
  metaData={...metaData,points:metaData.points+360};
  metaSave();
 }else{
  const base=debugTalents??metaData;
  debugTalents={...base,points:base.points+360};
 }
 if(atHome)showTalents();
 else if(state==='talents')renderTalents();
 else{notice=3;noticeText='DEBUG · +360 TALENTPUNKTE'}
}
function finishUnranked(){
 state='debugResult';boss=null;shots=[];
 cancelCharge();padBlocked=true;
 overlay.classList.remove('hidden','upgrade-overlay','game-over','pause-overlay','gear-overlay');
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
 if(e.altKey||e.ctrlKey||e.metaKey)return;
 if(/^Numpad[1-9]$/.test(e.code)){
  e.preventDefault();
  if(e.repeat)return;
  const which=Number(e.code.slice(-1));
  if(which===1)grantDebugTalentPoints();
  else{
   if(runMode!=='debug'||state!=='playing')startDebugRun();
   debugBossJump(which,e.shiftKey&&(which===2||which===3));
  }
  return;
 }
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
  if(e.code==='Escape'){e.preventDefault();if(!e.repeat)backFromGear()}
  else if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)&&e.target?.id!=='music-volume'){
   e.preventDefault();
   if(!e.repeat)selectGearAction(gearSelection+(['ArrowDown','ArrowRight'].includes(e.code)?1:-1));
  }else if((e.code==='Enter'||e.code==='Space')&&e.target?.id!=='music-volume'){
   e.preventDefault();
   if(!e.repeat)gearActions[gearSelection]?.run?.();
  }
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
 if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','KeyW','KeyA','KeyS','KeyD'].includes(e.code))e.preventDefault();
 if(state==='transition')return;
 if(state==='talents'){if(!e.repeat){if(e.code==='ArrowLeft')moveTalent(-1,0);else if(e.code==='ArrowRight')moveTalent(1,0);else if(e.code==='ArrowUp')moveTalent(0,-1);else if(e.code==='ArrowDown')moveTalent(0,1);else if(e.code==='Enter'&&!e.target?.closest?.('button:not(.meta-node)')){e.preventDefault();document.getElementById('meta-buy').click()}else if(e.code==='Escape')document.getElementById('meta-back').click()}return}
 if(state==='skill'){
  if(!e.repeat){
   if(e.code==='Escape')closeBaseSkills();
   else if(e.code==='Enter'){e.preventDefault();if(e.target?.id==='skill-back')closeBaseSkills();else chooseBaseSkill(skillSelection)}
   else if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.code)){
    const step=e.code==='ArrowLeft'?-1:e.code==='ArrowRight'?1:e.code==='ArrowUp'?-2:2;
    selectBaseSkill(skillSelection+step);
   }
  }
  return;
 }
 if(state==='upgrade'){if(!e.repeat){if(/^Digit[123]$/.test(e.code))chooseCard(Number(e.code.slice(-1))-1);else if(['ArrowLeft','ArrowRight','KeyA','KeyD'].includes(e.code))selectCard(selectedCard+((e.code==='ArrowRight'||e.code==='KeyD')?1:-1));else if(e.code==='Enter'){e.preventDefault();chooseCard(selectedCard)}}return}
 if(state==='playing'&&/^(?:Space|Key[WASDQ]|Arrow(?:Up|Down|Left|Right))$/.test(e.code))lastFlightInput='keyboard';
 keys.add(e.code);
 if(e.code==='Space'&&!e.repeat&&state==='playing')fireSpecial();
 if(e.code==='KeyE'&&!e.repeat&&state==='playing'){lastFlightInput='keyboard';aimSweeper()}
 if(e.code==='KeyQ'&&!e.repeat)activateRage();
 if(e.code==='KeyT'&&!e.repeat&&(state==='menu'||state==='over'))showTalents();

 if(e.code==='Enter'&&!e.repeat&&(state==='menu'||state==='over')&&e.target?.id!=='talents'){e.preventDefault();showBaseSkills()}
});
window.addEventListener('keyup',e=>{
 keys.delete(e.code);
});
function checkpointRunTalents(){
 if(player&&runTime>metaSavedAt)bankRunTalents(0,true);
}
window.addEventListener('pagehide',checkpointRunTalents);
window.addEventListener('blur',pauseOnFocusLoss);
document.addEventListener?.('visibilitychange',()=>{
 if(typeof PfertSound!=='undefined')PfertSound.setMusicHidden(!!document.hidden);
 if(document.hidden){checkpointRunTalents();pauseOnFocusLoss()}
});
function drawCard(pool){
 const weights=pool.map(card=>specialCards.has(card.id)?1:4);
 let roll=rand(0,weights.reduce((sum,weight)=>sum+weight,0));
 const index=weights.findIndex(weight=>(roll-=weight)<0);
 return pool.splice(index,1)[0];
}
function offerCards(){
 const canHeal=heartsAfterHealing(1)>hearts;
 const laserBuild=player.skill.id==='laser';
 const hasProjectiles=!laserBuild||projectileSources.some(id=>upgrades[id]>0);
 const available=cardDefs.filter(({id,max})=>upgrades[id]<max&&
  (id!=='healing'||canHeal)&&(id!=='echo'||!upgrades.echoForge)&&
  (!laserBuild||(!specialCards.has(id)&&id!=='boomerang'&&id!=='bounceCrust'))&&
  (hasProjectiles||!projectileCards.has(id)));
 const pool=available.filter(card=>!card.repeatable&&!card.rare);
 const rarePool=available.filter(card=>card.rare&&runTime>=120&&card.requires.every(group=>group.some(id=>upgrades[id]>0)));
 if(pool.length<3)pool.push(...available.filter(card=>card.repeatable));
 if(pool.length===0)return
 choices=[];
 if(rarePool.length){
  const weighted=rarePool.flatMap(card=>Array(card.id===lastRare?1:3).fill(card));
  const rare=weighted[Math.floor(rand(0,weighted.length))];
  if(!specialCards.has(rare.id)||Math.random()<.25){choices.push(rare);lastRare=rare.id}
 }
 while(choices.length<3&&pool.length){
  const preferred=choices.length===2&&!choices.some(card=>player.skill.cards.includes(card.id))?
   pool.filter(card=>player.skill.cards.includes(card.id)):[];
  const card=drawCard(preferred.length?preferred:pool);
  if(preferred.length)pool.splice(pool.indexOf(card),1);
  choices.push(card);
 }
 state='upgrade';selectedCard=0;padBlocked=true;cancelCharge();overlay.classList.remove('hidden');overlay.classList.add('upgrade-overlay');
 sound('levelUp');
 overlay.innerHTML='<h2>Verbesserung wählen</h2><div class="cards">'+choices.map(cardButton).join('')+'</div><p class="hint">Klicken, 1 / 2 / 3 oder Pfeile / A D + Enter · Controller: Steuerkreuz + '+padHint(2)+'</p>';
 refreshPadHints();
 choices.forEach((_,i)=>{
  const button=document.getElementById('card-'+i);
  button.addEventListener('click',()=>chooseCard(i));
  button.addEventListener('focus',()=>selectCard(i,false));
 });
 selectCard(0);
}
function selectCard(i,focus=true){
 if(!choices.length)return;
 selectedCard=(i+choices.length)%choices.length;
 choices.forEach((_,j)=>document.getElementById('card-'+j).classList.toggle?.('selected',j===selectedCard));
 if(focus)document.getElementById('card-'+selectedCard).focus?.();
}
function chooseCard(i){
 if(state!=='upgrade'||!choices[i])return;
 buildCards=null;
 const card=choices[i];upgrades[card.id]++;if(card.id==='healing')heal(1);sound(card.rare?'synergy':'card');xp-=xpNeeded;level++;xpNeeded=Math.min(1500,Math.ceil(xpNeeded*(level<10?1.5:1.12)));choices=[];state='playing';cancelCharge();
 overlay.classList.add('hidden');overlay.classList.remove('upgrade-overlay');notice=2.4;noticeText=card.title.toUpperCase()+' · RANG '+upgrades[card.id];if(xp>=xpNeeded)offerCards();
}
function activeWeapon(){
 if(player.weapon>=0)return player.effects[player.weapon]>0?player.weapon:-1;
 return player.effects.findIndex(v=>v>0);
}
function hit(a,b,inset=0){return Math.abs(a.x-b.x)<(a.w+b.w-inset)/2&&Math.abs(a.y-b.y)<(a.h+b.h-inset)/2}
function chargeLimit(){return Math.max(.25,1.5*Math.pow(.91,upgrades.charge)*Math.pow(.99,upgrades.tempo))}
function gearAttackFactor(stat){
 return 1+gearBonus(stat)+(player.overdrive>0?gearBonus('rageDamage'):0)+
  (hearts===maxHearts()?gearBonus('fullDamage'):0)+(hearts<=2?gearBonus('lowDamage'):0);
}
function damage(base,hasWine=activeWeapon()>=0,applyGearDamage=true){const rageBonus=.015*(metaCount('K1',[1,2,3,4,6,7,8,9,11,12,14,15,17,18,19])+2*Number(owns('K1-21')));const active=player.overdrive>0,after=player.metaAfterglow>0;const rageFactor=active?1.35*(1+rageBonus)*(owns('K2-20')&&player.metaRageMax-player.overdrive<2?1.15:1):after?1.35:1;const low=hearts<=2?1+.015*metaCount('V3',[1,2,3,4,6,7,8,9])+(owns('V3-13')?.15:0)+(owns('V3-23')?.60:0)+(hearts<=1&&owns('V3-22')?.225:0):1;metaLastCritical=Math.random()<Math.min(1,cardValues.critical(upgrades.critical)+.015*metaCount('A2',[5,10])+(owns('A2-22')?.06:0)+gearBonus('criticalChance'));const criticalFactor=metaLastCritical?2+.03*(metaCount('A2',[11,12,14,15,17,18,19])+2*Number(owns('A2-21')))+(owns('A2-23')?.75:0)+gearBonus('criticalDamage'):(owns('A2-23')?.85:1);return 1.5*playerHitDamage*base*(owns('S1')?1.03:1)*cardValues.damage(upgrades.damage)*(1+cardValues.mastery(upgrades.mastery))*rageFactor*low*(owns('Q10')&&active?1.5:1)*(1+(owns('Q1')?.045:0)+(player.metaRevenge>0?.15:0))*(hasWine?1+.03*metaCount('W2',[5,10])+.015*(metaCount('W2',[11,12,14,15,17,18,19])+2*Number(owns('W2-21'))):1)*criticalFactor*(applyGearDamage?gearAttackFactor():1)}
function heartsAfterHealing(amount,multiplier=1){
 if(owns('V3-23')&&hearts<=2)amount=Math.round(amount)*.5;
 return Math.min(maxHearts(),hearts+amount*multiplier);
}
function heal(amount,multiplier){hearts=heartsAfterHealing(amount,multiplier)}
function particle(x,y,col,n=7,speed=1){
 for(let i=0;i<n&&particles.length<260;i++){let life=rand(.2,.6);particles.push({x,y,vx:rand(-150,150)*speed,vy:rand(-150,150)*speed,life,maxLife:life,col,size:rand(1.5,4)})}
}
function ring(x,y,col,size=35){if(rings.length<22)rings.push({x,y,col,size,life:.4,maxLife:.4})}
function impact(x,y,col,n=7){particle(x,y,col,n);ring(x,y,col,20);shake=Math.max(shake,.7)}
function dropOrb(x,y,value,speed=32.5,kind='normal',tier=1){
 const orb={x:clamp(x,22,W-22),y:clamp(y,85,H-22),w:16,h:16,value,speed,age:0,kind,tier};
 orbs.push(orb);return orb;
}
function enemySpeed(e){const paused=!e.formation&&e.i===3&&e.age%3>1.25&&e.age%3<2.05;const charge=!e.formation&&e.i===6&&e.age%3>1.1&&e.age%3<1.55?180:0;return ((paused?0:e.speed)+charge)*(1-(e.slow||0));}
function death(e){
 flightStats.enemies++;
 if(e.rareEnemy&&!e.equipmentDropped){e.equipmentDropped=true;dropGear(e.x,e.y)}
 if(owns('A3-22')&&e.burnLife>0){const amount=(e.metaLastDamage||0)*.30*(owns('A3-23')?1.75:1);ring(e.x,e.y,'#ffb483',67.5);for(const target of enemies)if(target!==e&&target.hp>0&&Math.hypot(target.x-e.x,target.y-e.y)<67.5)damageEnemy(target,amount,target.x,target.y)}
 const baseXp=e.rareEnemy?4:[1,1,1,2,2,2,3,3,3,4][e.i];
 dropOrb(e.x,e.y,baseXp*(e.elite?2:1)*(player.overdrive>0&&owns('K3-16')?1.12:1),enemySpeed(e)/2,e.elite?'elite':'normal',Math.min(3,baseXp));
 sound('explode',{type:e.i,elite:e.elite||e.blocker,x:e.x});addRage((e.elite?9:3)+(e.lastCharged?2:0),'killRage');
 combo++;comboTime=comboWindow;flightStats.bestCombo=Math.max(flightStats.bestCombo,combo);
 score+=Math.round((100+e.i*35)*(e.elite?1.5:1)*(1+Math.min(2,combo*.04))*(e.lastCharged?1.2:1));deaths.push({...e,age:0,life:.72,secret:secretType,rotation:rand(-.6,.6)});
 if(deaths.length>28)deaths.shift();
 particle(e.x,e.y,e.rareEnemy?.color||colors[e.i%5],28,1.5);ring(e.x,e.y,'#ffcf7c',64);flashes.push({x:e.x,y:e.y,r:e.elite?60:40,life:.14,maxLife:.14});shake=Math.max(shake,2.2);
 if(e.bazaarWave){
  const wave=e.bazaarWave;
  e.bazaarWave=null;
  wave.defeated++;
  awardBazaarWave(wave);
 }
}
function shouldSpawnPickup(i,roll){return i===5||i===16||roll<.12}
const weaponWineTypes=styles.flatMap((style,i)=>style?[i]:[]);
function spawnPickup(i,y=rand(105,475)){
 const w=30;
 pickups.push({x:W+w/2+25,y,i,w,h:42,age:0});
}
const fieldPowerups={
 rockets:{name:'Suchraketen',color:'#ffcd6d',laserRGB:[112,0,0]},
 shield:{name:'Schutzschild',color:'#93fce0',laserRGB:[0,100,0]},
 sweeper:{name:'Räumstrahl',color:'#c1a6ff',laserRGB:[0,0,85]}
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
let reducedProjectileEffects=false;
function projectileEffectsReduced(){
 const margin=reducedProjectileEffects?12:0;
 reducedProjectileEffects=bullets.length>=48-margin||shots.length>=40-margin||bullets.length+shots.length>=64-margin;
 return reducedProjectileEffects;
}
function recordProjectileTrail(shot,dt,interval,limit,reduced){
 if(reduced){if(shot.trail?.length)shot.trail.length=0;return}
 shot.trailClock=(shot.trailClock||0)+dt;
 if(shot.trailClock<interval)return;
 shot.trailClock%=interval;
 const trail=shot.trail||(shot.trail=[]);
 const point=trail.length>=limit?trail.shift():{};
 point.x=shot.x;point.y=shot.y;
 trail.push(point);
}
function addBullet(angle,style,charged,power,scale=1,offset=0){
 if(bullets.length>=bulletLimit)return null;
 const size=(charged?22+power*18:style==='normal'?14:11)*(1+cardValues.size(upgrades.size))*Math.sqrt(scale);
 const velocity=(charged?650+power*170:470)+(style==='speed'?260:0);
 const b={x:player.x+28-offset,y:player.y-2,vx:velocity*Math.cos(angle)*(1+cardValues.velocity(upgrades.velocity)),vy:velocity*Math.sin(angle)*(1+cardValues.velocity(upgrades.velocity)),w:size,h:size,damage:damage((charged?2+power*4.5:1)*scale,undefined,false),metaCritical:metaLastCritical,charged,style,pierce:['port','speed','wave','saw','vortex','phoenix'].includes(style),remaining:upgrades.pierce,bounces:upgrades.ricochet,hit:new Set(),age:0,life:3.5,blast:charged&&(style==='red'||upgrades.blast>0),homing:style==='rose',elements:attackElements(charged)};
 bullets.push(b);return b;
}
function mutateStandardShot(b){
 if(!b)return;
 if(upgrades.carousel){
  b.carousel=true;b.orbit=.25;b.orbitRadius=114;
  b.orbitSpeed=Math.PI*2/b.orbit;
  b.orbitOffset=(b.y-player.y+2)*.25;
  b.phase=Math.atan2(b.vy,b.vx);
 }
 if(upgrades.boomerang)b.boomerangAt=(b.orbit||0)+1;
 if(upgrades.bounceCrust){b.bounces++;b.crust=true}
}
function turnBoomerang(b){
 b.returning=true;
 b.vx=-Math.abs(b.vx);b.vy=-b.vy;
 b.damage*=.55;
 b.hit.clear();
}
function finishProjectileHit(b,target){
 b.homing=false;
 b.seekRank=0;
 b.target=null;
 if(b.boomerangAt&&!b.returning){b.returnContact=target;return true}
 if(!b.pierce){if(b.remaining>0)b.remaining--;else b.dead=true}
 return b.dead;
}
function bounceCrustFragment(b){
 b.crust=false;
 const angle=Math.atan2(b.vy,b.vx)+(b.y===80?.25:-.25);
 const child=addBullet(angle,'normal',false,0,bounceCrustDamage);
 if(!child)return;
 Object.assign(child,{x:b.x,y:b.y,damage:b.damage*bounceCrustDamage,life:1.2,generation:1,
  metaCritical:b.metaCritical,bossFactor:b.bossFactor,elements:{...b.elements},seekRank:b.seekRank,snakeRank:b.snakeRank,bounces:0});
 sound('split');
}
const rocketCharges=5;
function rocketOrbitPosition(index){
 const angle=runTime*3+index*Math.PI*2/rocketCharges;
 return {x:player.x+Math.cos(angle)*57,y:player.y+Math.sin(angle)*49,angle};
}
function rocketAim(target){
 if(!target||target.hp<=0)return null;
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
 const amount=damage(6,false);
 bullets.push({x:origin.x,y:origin.y,vx:620*Math.cos(angle),vy:620*Math.sin(angle),w:12,h:10,
  style:'rocket',target,damage:amount,bossFactor:gearFactor('bossDamage'),metaCritical:metaLastCritical,hit:new Set(),age:0,life:1.35});
 power.launchCooldown=.6;
 sound('rocket',{x:origin.x});
}
function collectFieldPowerup(p){
 const power=player.fieldPower,card=fieldPowerups[p.i];
 if(p.i==='rockets')power.rockets=rocketCharges;
 if(p.i==='shield'){power.shield=2;power.shieldTime=8+gearBonus('shieldDuration')}
 if(p.i==='sweeper'){
  power.beamTime=4;power.beamTick=0;power.beamTarget=null;
  power.beamDamage=damage(1.65,false);
  power.beamBossFactor=gearFactor('bossDamage');
 }
 p.dead=true;notice=2.6;noticeText=card.name.toUpperCase();
 sound('pickup',{style:p.i,x:p.x});ring(p.x,p.y,card.color,60);particle(p.x,p.y,card.color,24);
}
function sweeperTargets(){
 return enemies.concat(boss?.parts||[]).flatMap(target=>{
  const aim=rocketAim(target);
  return aim&&aim.x>=0&&aim.x<=W&&aim.y>=62&&aim.y<=H?[{target,x:aim.x,y:aim.y}]:[];
 });
}
function aimSweeper(point){
 if(state!=='playing'||player.fieldPower.beamTime<=0)return;
 const power=player.fieldPower,targets=sweeperTargets();
 if(point){
  const picked=targets.map(t=>({...t,distance:Math.hypot(t.x-point.x,t.y-point.y)}))
   .filter(t=>t.distance<=Math.max(24,Math.min(55,Math.max(t.target.w||0,t.target.h||0)/2)))
   .sort((a,b)=>a.distance-b.distance)[0];
  if(picked)power.beamTarget=picked.target;
 }else{
  const index=targets.findIndex(t=>t.target===power.beamTarget);
  if(targets.length)power.beamTarget=targets[(index+1)%targets.length].target;
 }
}
canvas.addEventListener?.('pointerdown',event=>{
 if(state!=='playing'||!player.fieldPower.beamTime||event.button!==0)return;
 const bounds=canvas.getBoundingClientRect();
 aimSweeper({x:(event.clientX-bounds.left)*W/bounds.width,y:(event.clientY-bounds.top)*H/bounds.height});
});
function sweeperRay(lock=false){
 const power=player.fieldPower,x=player.x+27,y=player.y-2;
 let aim=(power.beamTarget?.aim||enemies.includes(power.beamTarget))?rocketAim(power.beamTarget):null;
 if(!aim||aim.x<0||aim.x>W||aim.y<62||aim.y>H){
  const closest=sweeperTargets().sort((a,b)=>Math.hypot(a.x-x,a.y-y)-Math.hypot(b.x-x,b.y-y))[0];
  if(lock)power.beamTarget=closest?.target||null;
  aim=closest;
 }
 return {x,y,tx:aim?.x??W,ty:aim?.y??y,target:aim?(aim.target||power.beamTarget):null};
}
function sweeperClears(ray,shot){
 const dx=ray.tx-ray.x,dy=ray.ty-ray.y;
 const u=clamp(((shot.x-ray.x)*dx+(shot.y-ray.y)*dy)/(dx*dx+dy*dy||1),0,1);
 return Math.hypot(shot.x-ray.x-dx*u,shot.y-ray.y-dy*u)<11+Math.max(shot.w,shot.h)/2;
}
function hitSweeperTarget(ray,dt){
 const power=player.fieldPower,target=ray.target;
 power.beamTick-=dt;
 if(power.beamTick>0||!rocketAim(target))return;
 power.beamTick=.16;
 const isBoss=!!target.aim,source={stepX:ray.tx-ray.x,stepY:ray.ty-ray.y};
 const amount=modifyDirectHit(target,power.beamDamage,source,isBoss,ray.tx,ray.ty);
 if(isBoss)damagePart(target,amount,ray.tx,ray.ty,power.beamBossFactor);
 else{target.lastImpact='port';damageEnemy(target,amount,ray.tx,ray.ty)}
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
 const base=weapon<0&&player.skill.id==='laser'?.31*laserIntervalScale:weapon===3?Math.max(.42,.34*(1+cardValues.duration(upgrades.duration)+cardValues.cellar(upgrades.cellar))+.04):(intervals[weapon]||.24);
 const rate=1+.015*(metaCount('A1',[11,12,14,15,17,18,19])+2*Number(owns('A1-21')));
 const gearRate=1+gearBonus('autoRate')+gearBonus(weapon<0?'standardRate':'wineRate');
 return base/(rate*playerFireRate*gearRate)*(owns('A1-23')?1.25:1)/(owns('W3-23')?(weapon>=0?1.375:.85):1);
}
function updateAutoFire(dt){
 const weapon=activeWeapon();
 if(weapon<0&&player.autoWeapon>=0)player.autoCooldown=Math.min(player.autoCooldown,shotInterval());
 player.autoWeapon=weapon;
 player.autoCooldown-=dt;
 if(player.autoCooldown<=0){const overdue=player.autoCooldown;fireCharge();player.autoCooldown=Math.max(0,player.autoCooldown+overdue)}
}
function specialCostFraction(){return .1*gearFactor('specialCost')}
function wineStatus(weapon){
 if(weapon<0)return null;
 const remaining=player.effects[weapon],capacity=player.effectMax||18;
 const cost=capacity*specialCostFraction(),free=owns('W1-13')&&!player.freeSpecialUsed;
 return {
  fraction:remaining/capacity,
  segments:1/specialCostFraction(),
  paid:Math.ceil(remaining/cost),
  free,
  control:lastFlightInput==='gamepad'?padButtons[0]:'LEERTASTE'
 };
}
function fireSpecial(){
 if(state!=='playing')return;
 const weapon=activeWeapon();
 if(weapon<0){notice=1.2;noticeText='KEIN SONDERANGRIFF · WEIN SAMMELN';sound('block');return}
 const cost=(player.effectMax||18)*specialCostFraction();
 const free=owns('W1-13')&&!player.freeSpecialUsed;
 const remaining=player.effects[weapon]-cost;
 player.specialCount++;
 player.metaLastSpecial=!free&&remaining<=1e-9;
 fireCharge(true);
 if(free)player.freeSpecialUsed=true;
 else player.effects[weapon]=remaining>1e-9?remaining:0;
}
function nextCartridgeIndex(){
 let earliest=-1,earliestTime=Infinity;
 for(let offset=0;offset<cartridges.length;offset++){
  const index=((player.cartridgeNext||0)+offset)%cartridges.length;
  const id=cartridges[index].id;
  if(!upgrades[id])continue;
  const at=player.cartridgeReady?.[id]||0;
  if(at<=runTime)return index;
  if(at<earliestTime){earliestTime=at;earliest=index}
 }
 return earliest;
}
function laserColor(){
 const power=player.fieldPower;
 const active={
  rockets:power.rockets>0,
  shield:power.shieldTime>0&&power.shield>0,
  sweeper:power.beamTime>0
 };
 const rgb=[118,155,164];
 for(const [id,enabled] of Object.entries(active)){
  if(enabled)fieldPowerups[id].laserRGB.forEach((value,channel)=>{rgb[channel]=Math.min(255,rgb[channel]+value)});
 }
 return 'rgb('+rgb.join(',')+')';
}
function emitLightBeam(strength,width,life){
 const beam={style:'light',pulse:true,life,maxLife:life,width,color:laserColor(),damage:damage(strength*laserDamageScale,false,false),
  metaCritical:metaLastCritical,tick:0,elements:attackElements(),x:player.x+27,y:player.y-2,
  seekRank:upgrades.seekShot,snakeRank:upgrades.snakeShot,breakRank:upgrades.breakShot,splitTargets:new Set()};
 if(beam.seekRank||beam.snakeRank)beam.hitTargets=new Set();
 beams.push(beam);
 return beam;
}
const laserCarouselTime=.25,laserCarouselRadius=114;
function addLightBeamCopy(beam,scale,offset,angle=0,lifeScale=1){
 const carousel=beam.carousel||0;
 const life=carousel+(beam.maxLife-carousel)*lifeScale;
 beams.push({...beam,opacity:.8,damage:beam.damage*scale,offset,shotAngle:angle,angle,y:beam.y+offset,life,maxLife:life,
  splitTargets:new Set(),hitTargets:beam.hitTargets?new Set():undefined});
}
function dischargeCartridge(){
 const index=nextCartridgeIndex();
 if(index<0)return;
 const {id,reload}=cartridges[index];
 const ready=player.cartridgeReady||(player.cartridgeReady={});
 if(ready[id]>runTime)return;
 const fired=()=>{
  ready[id]=runTime+reload;player.cartridgeNext=(index+1)%cartridges.length;
  (player.cartridgeFired||(player.cartridgeFired={}))[id]=runTime;
 };
 if(id==='sunLance'){
  emitLightBeam(3.2,14*(1+cardValues.size(upgrades.size)),.17).cartridge=id;
  sound('shot',{style:'port',x:player.x});
  fired();
  return;
 }
 const b=addBullet(0,'normal',false,0,1);
 if(!b)return;
 b.cartridge=id;
 switch(id){
  case 'fuseRocket': Object.assign(b,{homing:true,blast:true,vx:360});break;
  case 'tideBell': Object.assign(b,{wave:true,pierce:true,vx:320,life:1.7});break;
  case 'cinderArc': Object.assign(b,{vx:410,vy:-125,gravity:215});b.elements.fire+=.48;break;
  case 'iceSpindle': b.remaining++;b.elements.frost=Math.max(.44,b.elements.frost);break;
  case 'sparkBobbin': b.chain=3;break;
  case 'pearlPod': b.split=4;break;
  case 'moonHook': Object.assign(b,{returnAt:.82,pierce:true,life:2});break;
  case 'railSkip': Object.assign(b,{vx:235,vy:player.y<270?435:-435,bounces:b.bounces+3});break;
  case 'anchorCore': Object.assign(b,{vx:105,vortex:115,pulse:.3,life:2,pierce:true});b.damage*=.45;break;
 }
 b.seekRank=upgrades.seekShot;b.snakeRank=upgrades.snakeShot;b.breakRank=upgrades.breakShot;
 fired();
}
function fireCharge(special=false){
 const charged=special,power=special?1:0,weapon=activeWeapon();
 const style=styles[weapon]||(charged?'wave':player.skill.id==='laser'?'light':'normal');
 // Bei vollen Projektilpools bekommt der Hauptschuss weiterhin einen Platz.
 if(bullets.length>=bulletLimit&&style!=='port'&&style!=='storm'&&style!=='light')bullets.shift();
 const firstNew=bullets.length,firstBeam=beams.length;
 sound('shot',{charged,style:style==='light'?'port':styles[weapon]||'normal',x:player.x});
 const emit=(angle=0,mode=style,scale=1,offset=0)=>addBullet(angle,mode,charged,power,scale,offset);
 if(style==='light'){
  const duration=cardValues.duration(upgrades.duration)+cardValues.cellar(upgrades.cellar);
  const beam=emitLightBeam(1.22*(1+duration*.55),16*(1+cardValues.size(upgrades.size)),.13*(1+Math.min(1,duration)));
  beam.damage*=1+.04*Number(owns('A1-5'))+.08*Number(owns('A3-23'));
  if(upgrades.carousel){
   beam.carousel=laserCarouselTime;
   beam.life+=beam.carousel;beam.maxLife=beam.life;
   beam.length=laserCarouselRadius;
   beam.hitTargets=new Set();
  }
  for(let i=0;i<upgrades.multiShot;i++)addLightBeamCopy(beam,extraShotScale(i)*doubleCheeseDamage,i%2?12:-12);
  for(let i=0;i<cardValues.fanShot(upgrades.fanShot);i++){
   const ray=(i%2?1:-1)*(Math.floor(i/2)+1);
   addLightBeamCopy(beam,extraShotScale(upgrades.multiShot+i),0,ray*.09);
  }
 }else if(style==='port'||style==='storm'){
  const storm=style==='storm', life=(storm?(charged?1.05:.22):(charged?.65+power*.55:.34))*(1+cardValues.duration(upgrades.duration)+cardValues.cellar(upgrades.cellar));
  beams.push({life,maxLife:life,charged,style,width:(storm?(charged?54:13):(charged?14+power*14:9))*(1+cardValues.size(upgrades.size)),damage:damage(storm?(charged?7:2):(charged?3.5+power*2:1.8),undefined,false),metaCritical:metaLastCritical,tick:0,elements:attackElements(charged),x:player.x+27,y:player.y-2});
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
  const b=emit();if(b){b.vx=charged?110:160;b.life=charged?2.2:1.25;b.vortex=charged?188:120;b.pulse=.24;b.damage*=.35;b.w*=1.6;b.h=b.w}
 }else if(style==='phoenix'){
  for(const angle of charged?[-.12,0,.12]:[0]){const b=emit(angle);if(b){b.phoenix=true;b.baseY=b.y;b.phase=angle*12;b.life=2.6;b.damage*=.8}}
 }else if(style==='normal'&&!charged){
  const {id}=player.skill;
  const primary=emit();
  const applyShape=b=>{
   b.standardShot=true;b.skillElement=id;
   if(id==='salvo')b.elements.frost=Math.min(.65,b.elements.frost+.25);
   if(id==='element')b.elements.fire+=.64+.08*Number(owns('A3-5'))+.12*Number(owns('A3-23'));
   b.seekRank=upgrades.seekShot;b.snakeRank=upgrades.snakeShot;b.breakRank=upgrades.breakShot;
   mutateStandardShot(b);
  };
  if(primary){
   if(id==='precision'){
    primary.vx*=.9;
    primary.damage*=1.18*(1+.04*Number(owns('A2-5'))+.08*Number(owns('A2-23')));
   }else if(id==='salvo'){
    primary.w*=1.2;primary.h*=1.2;
   }else if(id==='element'){
    primary.damage*=.90;
   }
   applyShape(primary);
  }
  const copies=upgrades.multiShot+cardValues.fanShot(upgrades.fanShot);
  for(let i=0;i<copies;i++){
   const side=i%2?1:-1,offset=side*(Math.floor(i/2)+1);
   const angle=upgrades.fanShot?offset*.06:0;
   const b=emit(angle,style,extraShotScale(i));
   if(b){
     if(i<upgrades.multiShot)b.damage*=doubleCheeseDamage;
     b.y+=offset*12;if(id==='salvo')b.h*=1.7;applyShape(b);
    }
  }
 }else{
  const angles=style==='white'?(charged?[-.34,-.17,0,.17,.34]:[-.24,0,.24]):style==='rose'&&charged?[-.4,0,.4]:style==='speed'?[-.065,.065]:[0];
  for(let j=0;j<(style==='red'&&!charged?3:1);j++)for(const angle of angles)emit(angle,style,1,j*15);
 }
 if(!charged&&weapon<0&&player.verticalWine>0)for(const direction of [-1,1]){const b=addBullet(direction*Math.PI/2,'normal',false,0);if(b){b.x=player.x;b.y=player.y+direction*player.h/2;b.verticalWine=true}}
 if(!charged&&weapon<0)dischargeCartridge();
 if(!charged&&weapon>=0){for(const b of bullets.slice(firstNew))b.seekRank=upgrades.seekShot;for(const beam of beams.slice(firstBeam))beam.seekRank=upgrades.seekShot}
 if(charged&&weapon>=0){
  const primary=bullets.slice(firstNew),beamPrimary=beams.slice(firstBeam),extra=upgrades.multiShot+cardValues.fanShot(upgrades.fanShot);
  for(const b of primary){b.seekRank=upgrades.seekShot;b.snakeRank=upgrades.snakeShot;b.breakRank=upgrades.breakShot}
  for(const beam of beamPrimary){beam.seekRank=upgrades.seekShot;beam.snakeRank=upgrades.snakeShot;beam.breakRank=upgrades.breakShot;beam.splitTargets=new Set()}
  for(let i=0;i<extra;i++){
   const scale=extraShotScale(i,true)*(i<upgrades.multiShot?doubleCheeseDamage:1);
   const side=i%2?1:-1,offset=side*(Math.floor(i/2)+1),angle=upgrades.fanShot?offset*.12:0;
   if(primary.length&&bullets.length<bulletLimit){const b=primary[i%primary.length],cos=Math.cos(angle),sin=Math.sin(angle);bullets.push({...b,damage:b.damage*scale,y:b.y+offset*18,baseY:b.baseY===undefined?undefined:b.baseY+offset*18,vx:b.vx*cos-b.vy*sin,vy:b.vx*sin+b.vy*cos,phase:(b.phase||0)+angle,hit:new Set(),trail:[]})}
   if(beamPrimary.length){const beam=beamPrimary[0];beams.push({...beam,damage:beam.damage*scale,offset:offset*18,splitTargets:new Set()})}
  }
 }
 if(upgrades.echoForge&&((player.attacks+1)%4===0)){
  const primary=bullets.slice(firstNew,firstNew+2);for(const original of primary)for(const side of [-1,1])if(bullets.length<bulletLimit)bullets.push({...original,x:original.x-15,y:original.y+side*8,phase:(original.phase||0)+side*.4,damage:original.damage*cardValues.echoForge(upgrades.echoForge),life:original.life*.9,hit:new Set(),echoed:true});
  if(beams.length>firstBeam){
   const original=beams[firstBeam];
   for(const side of [-1,1]){
    if(original.style==='light')addLightBeamCopy(original,cardValues.echoForge(upgrades.echoForge),side*20,0,.65);
    else beams.push({...original,offset:side*20,damage:original.damage*cardValues.echoForge(upgrades.echoForge),life:original.life*.65,splitTargets:original.splitTargets?new Set():undefined});
    beams.at(-1).echoed=true;
   }
  }
  sound('echo');
 }
 if(charged&&upgrades.orbital>0)for(let i=0;i<2;i++){const orb=addBullet(0,'orbit',charged,power,cardValues.orbital(upgrades.orbital));if(orb){orb.orbit=1.2;orb.orbitRadius=48+i*5;orb.phase=i*Math.PI;orb.life=2.7}}
 if(player.overdrive>0)for(const angle of [-.2,.2,Math.PI,-Math.PI/2,Math.PI/2])addBullet(angle,'speed',charged,power,.45);
 if(player.overdrive>0&&!charged){const count=Number(owns('K1-13'))+Number(owns('K1-16'))+Number(owns('K1-22'));for(let i=0;i<count;i++)addBullet((i-(count-1)/2)*.22,'speed',false,0,.525)}
 if(upgrades.spread>0)for(const angle of [-.32,.32])addBullet(angle,'satellite',false,0,cardValues.spread(upgrades.spread));
 if(upgrades.rear>0)addBullet(Math.PI,'satellite',charged,power,cardValues.rear(upgrades.rear));
 player.attacks++;
 if(upgrades.echo>0&&!upgrades.echoForge&&player.attacks%6===0){
  const beam=beams[firstBeam];
  if(style==='light'){
   for(const side of [-1,1])addLightBeamCopy(beam,cardValues.echo(upgrades.echo),side*22);
  }else for(const angle of [-.1,.1]){
   const echo=addBullet(angle,'echo',charged,power,cardValues.echo(upgrades.echo));
   if(!charged&&weapon<0)mutateStandardShot(echo);
  }
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
 const attackFactor=gearAttackFactor(charged?'specialDamage':weapon>=0?'wineDamage':'standardDamage');
 const bossFactor=gearFactor('bossDamage');
 for(const attack of [...bullets.slice(firstNew),...beams.slice(firstBeam)]){
  attack.damage*=attackFactor;
  attack.bossFactor=bossFactor;
 }
 if(charged&&owns('W2-20')){if(!player.metaBombs)player.metaBombs=[];player.metaBombs.push({x:player.x+28,y:player.y,time:1,amount:damage(1.5+(owns('W2-22')?.75:0),undefined,false)*attackFactor*(owns('W2-23')?2.5:1),bossFactor,radius:90+(owns('W2-22')?30:0)})}
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
const formationWarning=1.6;
const formationSchedule=[
 // [second in district, name, [enemy type, fixed lane, left entry?] ...]
 [132,'TEPPICHSTAFFEL',[[1,176],[4,368]]],
 [27,'BASARWACHE',[[1,135],[3,285],[4,445]]],
 [129,'DÜNENPATROUILLE',[[5,176],[4,313,true],[6,439]]],
 [106,'ZANGENFLUG',[[4,136,true],[3,281],[6,420,true]]],
 [75,'PALASTGARDE',[[6,144],[8,246,true],[6,355],[9,460,true]]]
];
const blockerCycle=480, blockerOffsets=[68,153,222,367,463], blockerDuration=15;
const carpetLanes=[-48,48];
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
 const unit={i,x:W+sizes[0]/2+8,y:y??270,w:sizes[0],h:sizes[1],hp,max:hp,age:0,fire:rand(1,2.8),speed:rand(65,100)+Math.min(t/20,90),phase:rand(0,6),flash:0,elite,slow:0,slowTime:0,burnLife:0,burnDps:0};
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
function updateFormation(previousTime){
 if(secret||boss||golden){formation=null;return}
 if(!formation){
  const [offset,name,units]=formationSchedule[levelIndex];
  const start=Math.floor(t/districtDuration)*districtDuration+offset;
  if(previousTime>=start||t<start||t+12>=nextBoss||starRoute)return;
  formation={units,releaseAt:start+formationWarning};
  notice=formationWarning;noticeText=name+' · SPUREN MEIDEN';
  sound('formation');
 }
 if(t<formation.releaseAt)return;
 for(const [type,y,rear=false] of formation.units){
  const unit=enemy(type,y);
  Object.assign(unit,{formation:true,formationVolleys:2,entryDrift:0,rear,speed:rear?155:138,fire:.7});
  if(rear)unit.x=-unit.w/2-8;
 }
 formation=null;
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
const starPaths=[[0,-95,10],[0,95,35],[-45,35,110],[65,0,-85]];
function updateStarRoute(dt){
 if(boss||secret||golden){starRoute=null;return}
 if(!starRoute){
  if(t<nextStarRoute||t+14>nextBoss||notice>0||formation||enemies.some(e=>e.formation&&e.hp>0))return;
  if((t>=bazaarStart-14&&t<bazaarBossTime)||(t>=laterWaveStart-14&&t<laterWaveEnd))return;
  const lane=clamp(player.y,205,375);
  const heights=starPaths[starRouteIndex++%starPaths.length];
  starRoute={gates:heights.map((dy,i)=>({x:W+28+i*215,y:lane+dy})),index:0};
  nextStarRoute=t+110;
  notice=2;noticeText='STERNENPOST · FLIEGE DURCH DREI SIEGEL';
 }
 const route=starRoute;
 for(const gate of route.gates)gate.x-=145*dt;
 const gate=route.gates[route.index];
 if(gate.x< -28){starRoute=null;return}
 if(Math.abs(player.x-gate.x)>21||Math.abs(player.y-gate.y)>29)return;
 ring(gate.x,gate.y,'#a9edd3',32);sound('pickup',{style:'post',step:route.index,x:gate.x});
 if(++route.index<route.gates.length)return;
 flightStats.deliveries++;
 const deliveredItem=Math.random()<.3&&dropGear(player.x,player.y);
 const burst={x:player.x,y:player.y};
 const centerX=clamp(burst.x,22+starOrbRadius,W-22-starOrbRadius);
 const centerY=clamp(burst.y,85+starOrbRadius,H-22-starOrbRadius);
 for(let i=0;i<10;i++){
  const angle=i*Math.PI/5;
  const orb=dropOrb(burst.x,burst.y,1);
  orb.starBurst=burst;
  orb.starX=centerX+Math.cos(angle)*starOrbRadius;
  orb.starY=centerY+Math.sin(angle)*starOrbRadius;
 }
 ring(centerX,centerY,'#a9edd3',starOrbRadius);
 notice=2;noticeText='STERNENPOST · 10 EP-ORBS'+(deliveredItem?' + ITEM':'');
 starRoute=null;
}
function spawnRegularEnemy(){
 const unlocked=secret?4:Math.min(9,Math.floor(t/32));
 const type=spawnIndex%(unlocked+1);
 const y=regularEntryLanes[spawnIndex%regularEntryLanes.length];
 if(!secret&&t>=nextRareEnemy)spawnRareEnemy(y);
 else if(!secret&&t>=100&&spawnIndex%7===0){
  const kind=Math.floor(spawnIndex/7)%3;
  const unit=enemy([2,5,8][kind],y);
  unit.machine=['weaver','diver','beacon'][kind];
  unit.fire=1.75;
 }else enemy(type,y);
 spawnIndex++;
 spawn+=1;
}
function hostileProjectile(x,y,vx,vy,col='#e7b575',size=10,options={}){
 const pace=(1+threat*.075)*hostileShotSpeed;
 return {x,y,vx:vx*pace,vy:vy*pace,w:size,h:size,col,life:8,age:0,...options,
  gravity:(options.gravity||0)*hostileShotSpeed};
}
function extraHostileShot(shot,side){
 const angle=shot.laneLocked?0:.12*side;
 return {...shot,y:shot.y+side*(shot.h+2),
  vx:shot.vx*Math.cos(angle)-shot.vy*Math.sin(angle),
  vy:shot.vx*Math.sin(angle)+shot.vy*Math.cos(angle),
  life:shot.burstAt||shot.life,burstAt:0,bonus:true};
}
function emitHostileShot(shot){
 if(shots.length>=216)return;
 if(shot.fromBoss){
  shots.push(shot);
  if(++bossShotCount%4===0&&shots.length<216){
   shots.push(extraHostileShot(shot,bossShotCount%8===0?-1:1));
  }
  return;
 }
 // Keep mines and splitters intact and account for them in the next shots.
 enemyShotBudget+=3;
 if(enemyShotBudget<4&&!shot.burstAt)return;
 enemyShotBudget-=4;
 shots.push(shot);
}
function projectile(x,y,vx,vy,color,size,options){
 if(shots.length>=216)return;
 const shot=hostileProjectile(x,y,vx,vy,color,size,options);
 emitHostileShot(shot);
 if((shot.vx||shot.vy)&&++hostileShotCount%5===0){
  emitHostileShot(extraHostileShot(shot,hostileShotCount%10===0?-1:1));
 }
}
const enemyShotTypes=['mortar','sickle','splitter','needle','sickle','mine','needle','pulse','splitter','mortar'];
const normalPulse={reach:175,width:12,life:.16};
const bossPulse={reach:420,width:22,life:.23};
const specialPulseWidth=24;
const bossAttackPatterns=[
 ['needle','strike'],['sickle','needle'],['splitter','mortar'],['mine','sickle'],
 ['pulse','splitter'],['needle','splitter','football'],['mortar','sickle'],
 ['needle','splitter'],['mine','mortar']
];
// Each factory locks the origins and velocities of all waves at telegraph time.
const bossSpecials=[
 [
  ['Teppichwand','#ffc97a',({lane})=>[
   [100,160,220,280,340,400,460,510].filter(y=>Math.abs(y-lane)>59)
    .map(y=>[900,y,-235,0,'needle'])
  ]],
  ['Seidenzange','#ffa6b2',({lane})=>[
   [-1,1].flatMap(side=>[0,30].map(offset=>[860,lane+side*(108+offset),-215,-side*79,'sickle'])),
   [[860,lane,-280,0,'needle']]
  ]]
 ],
 [
  ['Dampfdüsen','#c0f6ff',({lane})=>[
   [lane-84,lane,lane+84].map(y=>[925,y,-325,0,'needle']),
   [lane-42,lane+42].map(y=>[925,y,-335,0,'needle'])
  ]],
  ['Kesseldruck','#f8b98d',({x})=>[
   [-90,0,90].map(offset=>[clamp(x,165,815)+offset,100,-85,104,'mortar',{gravity:70}]),
   [-135,45].map(offset=>[clamp(x,165,815)+offset,510,-70,-160,'mortar',{gravity:65}])
  ]]
 ],
 [
  ['Sucuk-Scheiben','#ffac75',()=>[
   [150,290,430].map(y=>[875,y,-198,0,'splitter',{burstAt:.72,burstCount:5,direction:-1}])
  ]],
  ['Spießregen','#ffde94',({x})=>[
   [-165,-55,55,165].map(offset=>[clamp(x,195,760)+offset,87,0,255,'needle']),
   [-110,0,110].map(offset=>[clamp(x,195,760)+offset,87,0,285,'needle'])
  ]]
 ],
 [
  ['Gewürzspirale','#f2b1ff',({lane})=>[
   [-1,1].flatMap(side=>[55,105,150].map((speed,i)=>[875,lane+side*i*32,-155,side*speed,'sickle',{curve:side*1.2,curveUntil:.85}]))
  ]],
  ['Minengirlande','#ffd07b',()=>[
   [145,290,435].map((y,i)=>[770,y,-105,i%2?35:-18,'mine',{burstAt:1.15+i*.23,burstCount:8,direction:-1}])
  ]]
 ],
 [
  ['Karawanenkreuz','#ffe4a0',({lane})=>[
   [-1,1].flatMap(side=>[-42,42].map(offset=>[side<0?46:910,lane+offset,-side*250,-offset*.42,'needle']))
  ]],
  ['Basartor','#f8b6ff',({lane})=>[
   [lane-82,lane+82].map(y=>[W/2,y,0,0,'pulse',{w:W,originX:W,life:.2}]),
   [[W/2,lane,0,0,'pulse',{w:W,originX:W,life:.2}]]
  ]]
 ],
 [
  ['Doppelpass','#91ddff',({lane})=>[
   [[875,lane-80,-245,-260,'football',{bounces:2,life:4}]],
   [[875,lane+80,-245,260,'football',{bounces:2,life:4}]]
  ]],
  ['Freistoß','#ffedaa',({x,y})=>[
   [-.34,0,.34].map(offset=>{
    const angle=Math.atan2(y-285,x-895)+offset;
    return [895,285,Math.cos(angle)*300,Math.sin(angle)*300,'football',{bounces:1,life:4}];
   })
  ]]
 ],
 [
  ['Schlackenregen','#ffc087',({x})=>[
   [-150,-50,50,150].map(offset=>[clamp(x,170,780)+offset,91,65,110,'mortar',{gravity:180}]),
   [-100,0,100].map(offset=>[clamp(x,170,780)+offset,91,-75,130,'mortar',{gravity:180}])
  ]],
  ['Glutfront','#ff9e76',({lane})=>[
   [106,178,250,322,394,466].filter(y=>Math.abs(y-lane)>50).map(y=>[920,y,-210,0,'splitter',{burstAt:1.05,burstCount:3,direction:-1}])
  ]]
 ]
];
bossSpecials.push([
 ['Spektralgitter','#bcf6ff',({lane})=>[[-100,0,100],[-50,50]].map(offsets=>offsets.map(d=>[900,lane+d,-260,0,'needle']))],
 ['Brennpunkt','#f8a8ed',({lane})=>[[-1,1].map(s=>[875,lane+s*120,-240,-s*50,'sickle']),[[875,lane,-335,0,'needle']]]]
],[
 ['Schleusentor','#83e5d2',({lane})=>[[-95,95],[-55,55]].map(offsets=>offsets.map(d=>[900,lane+d,-170,0,'mine',{burstAt:1.65,burstCount:3,direction:-1}]))],
 ['Kielwasser','#ffca83',({lane})=>[-1,1].map(s=>[-70,0,70].map(d=>[900,lane+d,-215,s*65,'mortar',{gravity:-s*48}]))]
]);
function nextBossAttack(b){
 const attacks=bossAttackPatterns[b.i];
 const index=(b.volleyIndex||0)%(attacks.length+2);
 return attacks[index]??bossSpecials[b.i][index-attacks.length];
}
function enemyAim(e){return e.fireAlongLane?{x:0,y:e.y}:e.aimTarget||player}
function hostileVolley(type,x,y,target,strong){
 const direction=target.x<x?-1:1;
 switch(type){
  case 'needle':{
   const aim=Math.atan2(target.y-y,target.x-x);
   for(const offset of strong?[-.19,0,.19]:[0]){
    projectile(x,y,Math.cos(aim+offset)*190,Math.sin(aim+offset)*190,'',strong?11:8,{fromBoss:strong,kind:type});
   }
   break;
  }
  case 'sickle':
   for(const sign of strong?[-1,1]:[y<target.y?1:-1]){
    projectile(x,y,direction*180,sign*70,'',strong?14:10,{fromBoss:strong,kind:type,curve:-direction*sign*1.15,curveUntil:.65});
   }
   break;
  case 'splitter':
   projectile(x,y,direction*155,0,'',strong?16:12,{fromBoss:strong,kind:type,burstAt:.85,burstCount:strong?5:3,direction});
   break;
  case 'mortar':
   for(const speed of strong?[145,195,240]:[150]){
    projectile(x,y,direction*speed,-125,'',strong?14:10,{fromBoss:strong,kind:type,gravity:145});
   }
   break;
  case 'mine':
   projectile(x,y,direction*(strong?65:47),0,'',strong?20:15,{fromBoss:strong,kind:type,burstAt:1.2,burstCount:strong?8:4,direction});
   break;
  case 'pulse':{
   const {reach,width,life}=strong?bossPulse:normalPulse;
   projectile(x+direction*reach/2,y,0,0,'',width,{fromBoss:strong,kind:type,w:reach,originX:x,life});
   break;
  }
  case 'football':{
   const vertical=y<270?1:-1;
   projectile(x,y,direction*225,vertical*240,'',28,{fromBoss:strong,kind:type,bounces:2,life:4});
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
 if(e.formation){
  const direction=e.rear?1:-1,x=e.x+direction*e.w/2;
  for(const dy of [-16,0,16])projectile(x,e.y+dy,direction*(dy===0?216:186),0,'#ffc48a',12,{kind:'needle',laneLocked:true});
  e.formationVolleys--;
  return;
 }
 if(e.machine){
  const x=e.x-22,y=e.y;
  if(e.machine==='weaver'){
   for(const sign of [-1,1])projectile(x,y+sign*34,-190,-sign*22,'#a4ecd7',11,{kind:'needle'});
  }else if(e.machine==='diver'){
   const sign=y<270?1:-1;
   projectile(x,y,-190,sign*215,'#efbf85',15,{kind:'football',bounces:2,life:3});
  }else{
   for(const sign of [-1,1])projectile(x,y,-85,sign*54,'#ccaeef',13,{kind:'splitter',burstAt:1.1,burstCount:2,direction:-1});
  }
  return;
 }
 if(e.rareEnemy){rareEnemyAttack(e);return}
 if(e.rear){
  projectile(e.x+e.w/2,e.y,170,e.y<player.y?50:-50,'',10,{kind:'sickle',curve:e.y<player.y?-.65:.65,curveUntil:.8});
  return;
 }
 if(e.blocker){
  const x=e.x-e.w/2;
  for(const offset of carpetLanes)projectile(x,e.y+offset,-190,0,'',8,{kind:'needle',laneLocked:true});
  return;
 }
 hostileVolley(enemyShotTypes[e.i],e.x-22,e.y,enemyAim(e),false);
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
  projectile(shot.x,shot.y,shot.direction*Math.cos(angle)*135,Math.sin(angle)*135,'',8,{kind:'needle',fromBoss:shot.fromBoss});
 }
}

const damageCauses={contact:'Gegnerkontakt',projectile:'Feindgeschoss',boss:'Bosskontakt',strike:'Bossvorstoß'};
const slipstreamWindow=2.5,slipstreamReload=1.5;
function grazeShot(shot){
 shot.grazed=true;
 if(owns('V1-13'))player.metaGrazeSpeed=2;
 if(owns('V1-22')&&player.metaGrazeInvCooldown<=0){
  player.inv=Math.max(player.inv,.3);
  player.metaGrazeInvCooldown=8;
 }
 addRage(2,'grazeRage');score+=25;
 particle((player.x+shot.x)/2,(player.y+shot.y)/2,'#b5f7ff',3);
 if(!player.slipstreamCount||player.slipstreamUntil<runTime){
  player.slipstreamCount=0;player.slipstreamUntil=runTime+slipstreamWindow;
 }
 if(++player.slipstreamCount<3){sound('graze');return}
 flightStats.slipstreams++;
 sound('slipstream',{x:player.x});
 player.slipstreamCount=0;player.slipstreamFlash=runTime+1.2;
 score+=125;
 const ready=player.cartridgeReady;
 if(ready)for(const {id} of cartridges){
  if(ready[id]>runTime)ready[id]=Math.max(runTime,ready[id]-slipstreamReload);
 }
 ring(player.x,player.y,'#b5f7dc',36);
}
function showProtection(label){
 if(!player.protectionCue||player.protectionCue.until<=runTime||label!=='UNVERWUNDBAR')player.protectionCue={label,until:runTime+.7};
}
function hurt(source,sourceX=player.x,sourceY=player.y){
 if(state!=='playing')return;
 if(player.inv>0){showProtection('UNVERWUNDBAR');return}
 player.metaLastHit=runTime;if(owns('V1-16'))player.metaHitSpeed=2;
 if(owns('Q2'))player.metaRevenge=5;
 if(owns('V2-20')&&!player.metaShieldUsed){player.metaShieldUsed=true;player.inv=.3;showProtection('TALENTSCHUTZ');if(owns('V2-22'))shots=shots.filter(s=>Math.hypot(s.x-player.x,s.y-player.y)>90);ring(player.x,player.y,'#aeeaff',90);sound('block');return}
 const lostHeart=player.effects[2]<=0;
 if(!lostHeart){
  sound('block');showProtection('WEINSCHUTZ');player.effects[2]=0;impact(player.x,player.y,'#ffc3e3',18);
 }else{
  const previousHearts=hearts;
  sound('hurt');hearts--;impact(player.x,player.y,'#f17765',22);flash=damageFrameTime;
  if(hearts<=0&&owns('V3-20')&&!player.metaLastStand){player.metaLastStand=true;hearts=1;showProtection('LETZTER STAND')}
  if(hearts<previousHearts){
   player.slipstreamCount=0;player.slipstreamFlash=0;
   const angle=sourceX===player.x&&sourceY===player.y?-Math.PI/2:Math.atan2(sourceY-player.y,sourceX-player.x);
   player.lastDamage={source,x:sourceX,y:sourceY,angle,time:runTime};
  }
  if(hearts===1&&owns('V3-16')&&!player.metaRecover){player.metaRecover=true;heal(1);showProtection('HERZ REGENERIERT')}
 }
 player.inv=1.5*(1+.03*(metaCount('V3',[11,12,14,15,17,18,19])+2*Number(owns('V3-21')))+.015*metaCount('V2',[1,2,3,4,6,7,8,9]))*(lostHeart?gearFactor('hitProtection'):1);shake=4;if(hearts<=0)end();
 if(hearts===1&&owns('K3-20')&&!player.metaNotreserve){player.metaNotreserve=true;player.rage=Math.min(100,player.rage+30*gearFactor('allRage'))}
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
function flightSummary(){
 const {enemies,bosses,bestCombo,slipstreams,deliveries}=flightStats;
 const stats=[['Abschüsse',enemies],['Bosse',bosses],['Beste Käsekette',bestCombo],['Windschatten',slipstreams],['Sternenpost',deliveries]];
 return '<dl class="flight-stats" aria-label="Rundenstatistik">'+stats.map(([label,value])=>
  '<div><dt>'+label+'</dt><dd>'+numberLabel.format(value)+'</dd></div>').join('')+'</dl>';
}
let lastRoast=-1;
function end(died=true){
 if(died?state!=='playing':state!=='paused'||pauseView!=='confirmEnd')return;
 pausedFrom=null;
 clearRunGear();
 if(typeof PfertSound!=='undefined')PfertSound.stopMusic();
 if(died)sound('die');
 if(runMode!=='regular'){finishUnranked();return}
 let talentProgress='';
 if(metaAvailable){
  bankRunTalents(0,true);
  talentProgress='<p class="run-stats">Talentpunkte · Spielzeit +'+metaTimePoints+' · Bosse +'+metaBosses+' · nächster Zeit-Punkt in '+clock(Math.ceil(600-metaData.seconds))+'</p>';
 }
 state='over';cancelCharge();overlay.classList.remove('hidden');overlay.classList.remove('upgrade-overlay','pause-overlay','gear-overlay');overlay.classList.add('game-over');
 let roast=Math.floor(rand(0,roasts.length));if(roast===lastRoast)roast=(roast+1)%roasts.length;lastRoast=roast;
 const results=died?saveScore(score,runTime):null;
 const comeback=comebacks[Math.floor(rand(0,comebacks.length))],build=Object.values(upgrades).reduce((a,b)=>a+b,0);
 overlay.innerHTML=(died?'<div class="eyebrow">✦ DER BASAR HAT DICH AUSGELACHT ✦</div><h1>OH PFERT<span>✦</span></h1>'+
  '<p class="roast">'+roasts[roast]+'</p><p class="comeback">'+comeback+'</p>':'<h1>Runde beendet</h1>')+
  '<p class="run-stats">'+numberLabel.format(score)+' Punkte · '+clock(runTime)+' überlebt · Stufe '+level+' · '+build+' Karten · '+player.skill.title+'</p>'+
  damageSummary()+flightSummary()+'<div class="result-actions"><button id="again">ICH BIN NOCH NICHT FERTIG →</button>'+
  (metaAvailable?'<button id="talents">TALENTBAUM · '+metaData.points+' PUNKTE · T / B</button>':'')+'</div>'+
  '<p class="hint">ENTER<span class="pad-only"> / '+padHint(0)+'</span></p>'+talentProgress+(results?scoreTable(results):'')+buildDetails();
 overlay.scrollTop=0;
 bindHomeControls();
}
function setupSegments(b){
 const calibratedHp={0:.35,1:.39,6:.155};
 const baseHealth=b.max*12.5*.9*(calibratedHp[b.i]||1);
 const layout=PfertArt.bossLayout(b.i),weight=layout.reduce((sum,p)=>sum+(p.weight||1),0);
 b.parts=layout.map(part=>{
  const xs=part.points.map(point=>point[0]),ys=part.points.map(point=>point[1]);
  const left=Math.min(...xs),right=Math.max(...xs),top=Math.min(...ys),bottom=Math.max(...ys);
  const hp=Math.ceil(baseHealth*(part.weight||1)/weight)*bossHealthMultiplier;
  return {...part,dx:(left+right)/2,dy:(top+bottom)/2,w:right-left,h:bottom-top,hp,max:hp,flash:0};
 });
 b.hp=b.parts.reduce((sum,p)=>sum+p.hp,0);b.max=b.hp;return b;
}
function partHit(rect,b,part){
 const x=rect.x-b.x,y=rect.y-b.y,rotated=!!rect.angle;
 const left=(rotated?0:x)-rect.w/2,right=left+rect.w,top=(rotated?0:y)-rect.h/2,bottom=top+rect.h;
 if(!rotated&&(right<part.dx-part.w/2||left>part.dx+part.w/2||bottom<part.dy-part.h/2||top>part.dy+part.h/2))return false;
 let polygon=part.points;
 if(rotated){
  const {cos,sin}=rect;
  polygon=polygon.map(([px,py])=>[(px-x)*cos+(py-y)*sin,(py-y)*cos-(px-x)*sin]);
 }
 for(const [axis,edge,sign] of [[0,left,1],[0,right,-1],[1,top,1],[1,bottom,-1]]){
  const clipped=[];for(let i=0;i<polygon.length;i++){const a=polygon[i],b=polygon[(i+1)%polygon.length],insideA=(a[axis]-edge)*sign>=0,insideB=(b[axis]-edge)*sign>=0;if(insideA)clipped.push(a);if(insideA!==insideB){const t=(edge-a[axis])/(b[axis]-a[axis]);clipped.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t])}}polygon=clipped;if(!polygon.length)return false;
 }return true;
}
function beamHitsBox(rect,box){
 const dx=box.x-rect.x,dy=box.y-rect.y;
 const {cos,sin}=rect,c=Math.abs(cos),s=Math.abs(sin);
 return 2*Math.abs(dx)<box.w+rect.w*c+rect.h*s&&
  2*Math.abs(dy)<box.h+rect.w*s+rect.h*c&&
  2*Math.abs(dx*cos+dy*sin)<rect.w+box.w*c+box.h*s&&
  2*Math.abs(dy*cos-dx*sin)<rect.h+box.w*s+box.h*c;
}
function traceBeam(beam,angle,length,dealsDamage){
 beam.angle=angle;beam.length=length;
 const cos=Math.cos(angle),sin=Math.sin(angle);
 const rect={x:beam.x+cos*length/2,y:beam.y+sin*length/2,w:length,h:beam.width,angle,cos,sin};
 const forward=!angle&&length===W-beam.x;
 if(golden&&(forward?golden.x>=beam.x&&Math.abs(golden.y-beam.y)<golden.h/2+beam.width:
  beamHitsBox({...rect,h:beam.width*2},golden))){
  score+=500;beginTransition('enter');return true;
 }
 if(!dealsDamage)return false;
 const impactPoint=(x,y)=>{
  if(!angle)return {x,y:beam.y};
  const along=clamp((x-beam.x)*cos+(y-beam.y)*sin,0,length);
  return {x:beam.x+cos*along,y:beam.y+sin*along};
 };
 const beamHit=(target,amount,x,y)=>{
  beam.hitTargets?.add(target);
  const split=beam.breakRank&&beam.splitTargets&&!beam.splitTargets.has(target)?beam.breakRank:0;
  if(split)beam.splitTargets.add(target);
  onHit({damage:amount,bossFactor:beam.bossFactor,style:'prism',vx:cos,vy:sin,charged:beam.charged,
   elements:beam.elements,metaCritical:beam.metaCritical,breakRank:split,snakeRank:beam.snakeRank},target,x,y);
 };
 const source={charged:beam.charged,metaCritical:beam.metaCritical,vx:cos,vy:sin};
 for(const e of enemies){
  if(e.hp<=0||beam.hitTargets?.has(e))continue;
  const inBeam=forward?e.x>beam.x&&e.x<=W+e.w/2&&Math.abs(e.y-beam.y)<e.h/2+beam.width/2:beamHitsBox(rect,e);
  if(!inBeam)continue;
  const {x,y}=impactPoint(e.x,e.y);
  e.lastCharged=!!beam.charged;e.lastImpact=beam.style||'port';
  damageEnemy(e,modifyDirectHit(e,beam.damage,source,false,x,y),x,y);
  beamHit(e,beam.damage,x,y);
 }
 if(boss)for(const part of [...boss.parts]){
  if(!boss)break;
  if(part.hp<=0||beam.hitTargets?.has(part)||!partHit(rect,boss,part))continue;
  const {x,y}=impactPoint(boss.x+part.aim[0],boss.y+part.aim[1]);
  const amount=beam.damage*(beam.charged?.35:1)*(beam.charged&&owns('Q8')?1.075:1);
  damagePart(part,modifyDirectHit(part,amount,source,true,x,y),x,y,beam.bossFactor??1);
  beamHit(part,amount,x,y);
 }
 return false;
}
function updateBeam(beam,dt){
 const age=beam.maxLife-beam.life,shotAngle=beam.shotAngle||0;
 const carousel=beam.carousel||0,nextAge=age+Math.min(dt,beam.life);
 const baseY=player.y-2+(beam.offset||0);
 beam.x=player.x+27;beam.y=baseY;
 beam.life-=dt;beam.tick-=dt;
 if(age<carousel){
  // Auch bei langen Frames wird zwischen den sichtbaren Strahlpositionen getroffen.
  const end=Math.min(nextAge,carousel);
  const steps=Math.max(1,Math.ceil((end-age)/carousel*48));
  for(let i=0;i<=steps;i++){
   const angle=shotAngle+(age+(end-age)*i/steps)/carousel*Math.PI*2;
   if(traceBeam(beam,angle,laserCarouselRadius,true))return true;
  }
  if(nextAge<carousel)return false;
 }
 beam.seekOffset=beam.seekOffset||0;
 if(beam.seekRank){
  const target=enemies.find(e=>e.hp>0&&e.x>beam.x&&Math.abs(e.y-baseY)<300)||bossAimPoint(beam.x,baseY+beam.seekOffset);
  if(target)beam.seekOffset+=(target.y-baseY-beam.seekOffset)*Math.min(1,dt*cardValues.seekShot(beam.seekRank,true));
 }
 const snakeAge=(beam.pulse?nextAge:age)-carousel;
 beam.y=baseY+beam.seekOffset+Math.sin(snakeAge*8)*cardValues.snakeShot(beam.snakeRank||0,true);
 const dealsDamage=!!beam.hitTargets||beam.tick<=0;
 if(dealsDamage)beam.tick=beam.pulse?Infinity:.12;
 return traceBeam(beam,shotAngle,(W-beam.x)/Math.cos(shotAngle),dealsDamage);
}
function startBoss(bazaarEncounter=false){
 starRoute=null;formation=null;
 const i=mainBossOrder[bossCount%mainBossOrder.length],cycle=Math.floor(bossCount/mainBossOrder.length);
 const attackRate=i===1?1.5:1;
 boss=setupSegments({i,x:830,y:270,w:150,h:146,hp:0,max:(90+cycle*30+i*15)*(1+threat*.2),age:0,fire:1.5/attackRate,warning:0,attackRate});
 if(i===1||i>=7||(bazaarEncounter&&bossCount===0))boss.encounter={phase:1};
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
function leaveRuhr(){
 const defeated=boss?.hp===0?bosses[boss.i]:null;
 for(const loot of gearDrops)loot.returning=false;
 secret=false;secretType=0;boss=null;enemies=[];shots=[];bullets=[];beams=[];
 restoreBossPickups();spawn=2;notice=4;player.inv=2;
 noticeText=defeated?'BESIEGT · '+defeated.toUpperCase():'ZURÜCK IN DIE WOLKEN!';
}
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
function damageEnemy(e,amount,x,y){
 if(e.hp<=0)return;
 e.metaLastDamage=amount;
 const armored=e.patrol?.sprite==='lantern'||e.patrol?.sprite==='bird';
 sound('hit',{type:e.i,x,armored});
 const finisher=e.hp/e.max<.35?1+cardValues.execute(upgrades.execute):1;
 e.hp-=amount*finisher;e.flash=.085;
 particle(x,y,'#e8faff',5);
 if(flashes.length<28)flashes.push({x,y,r:12,life:.08,maxLife:.08,magic:['frost','chain','port','storm','light','vortex','prism','orbit'].includes(e.lastImpact)});
 if(e.hp<=0)death(e);
}
function applyAilment(b,e){
 const duration=1+.06*metaCount('A3',[5,10]);
 const elements=b.elements||attackElements(!!b.charged),slow=Math.min(.65,Math.max(b.slow||0,elements.frost));
 if(slow>0){
  const existing=e.slowTime>0?e.slow:0;
  e.slow=Math.min(.65,existing+(1-existing)*slow);
  e.slowTime=Math.max(e.slowTime||0,1.8*duration);
 }
 const burnBonus=1+.03*(metaCount('A3',[11,12,14,15,17,18,19])+2*Number(owns('A3-21')))+(owns('Q3')&&player.overdrive>0?.12:0)+(owns('Q9')&&activeWeapon()>=0?.12:0);
 if(elements.fire>0){e.burnLife=1.8*duration;e.burnDps=Math.max(e.burnDps||0,b.damage*elements.fire*(e.aim?b.bossFactor??1:1)*burnBonus*(owns('A3-23')?1.75:1))}
}
function eruptElement(kind,target,x,y){
 if(elementalBursts.some(effect=>effect.target===target&&effect.kind===kind&&effect.life>.36))return;
 if(elementalBursts.length>=24)elementalBursts.shift();
 if(target?.aim&&boss){x=boss.x+target.aim[0];y=boss.y+target.aim[1]}
 else if(target&&!target.aim){x=target.x;y=target.y}
 elementalBursts.push({kind,target,x,y,offset:Math.min(22,(target?.w||24)*.3),life:.52,maxLife:.52});
}
function showElementalHit(elements,target,x,y){
 if(elements.fire>0)eruptElement('fire',target,x,y);
 if(elements.frost>0)eruptElement('frost',target,x,y);
 if(elements.lightning||elements.chainBonus>0)eruptElement('lightning',target,x,y);
 if(elements.earth)eruptElement('earth',target,x,y);
}
function onHit(b,e,x,y){
 if(e){applyAilment(b,e);
  player.metaElementHits=(player.metaElementHits||0)+1;
  if(player.metaElementHits%10===0){const duration=1+.06*metaCount('A3',[5,10]);if(owns('A3-13')){const burnBonus=1+.03*(metaCount('A3',[11,12,14,15,17,18,19])+2*Number(owns('A3-21')));e.burnLife=Math.max(e.burnLife||0,2*duration);e.burnDps=Math.max(e.burnDps||0,b.damage*.225*(e.aim?b.bossFactor??1:1)*burnBonus*(owns('A3-23')?1.75:1))}if(owns('A3-16')){e.slow=Math.max(e.slow||0,.225);e.slowTime=Math.max(e.slowTime||0,2*duration)}}
  if(owns('A3-20')&&runTime>=(player.metaSparkReady||0)){const target=enemies.filter(v=>v!==e&&v.hp>0).sort((a,b)=>Math.hypot(a.x-x,a.y-y)-Math.hypot(b.x-x,b.y-y))[0];if(target){player.metaSparkReady=runTime+1;arcs.push({x,y,tx:target.x,ty:target.y,life:.16,maxLife:.16});damageEnemy(target,b.damage*.375*(owns('A3-23')?1.75:1),target.x,target.y);eruptElement('lightning',target)}}
  if(upgrades.shatter>0&&e.slowTime>0&&e.burnLife>0&&!(e.shatterCooldown>0)){
   e.shatterCooldown=.4;ring(x,y,'#bbf4ff',62+upgrades.shatter*8);flashes.push({x,y,r:35,life:.1,maxLife:.1});sound('shatter');
   for(const target of enemies)if(target.hp>0&&Math.hypot(target.x-x,target.y-y)<70){
    damageEnemy(target,b.damage*cardValues.shatter(upgrades.shatter),target.x,target.y);
    showElementalHit({fire:1,frost:1},target);
   }
  }
 }
 const elements=b.elements||attackElements(!!b.charged);
 showElementalHit(elements,e,x,y);
 if(b.skillElement==='precision'&&!elements.earth)eruptElement('earth',e,x,y);
 const count=Math.max(b.chain||0,elements.lightning?1:0)+elements.chainBonus;
 if(count>0){let origin={x,y};const used=new Set(e?[e]:[]);for(let i=0;i<count;i++){
  let target=null,nearest=(b.chain?175:120)**2;
  for(const candidate of enemies){
   if(candidate.hp<=0||used.has(candidate))continue;
   const distance=(candidate.x-origin.x)**2+(candidate.y-origin.y)**2;
   if(distance<nearest){target=candidate;nearest=distance}
  }
  if(!target)break;
  used.add(target);
  if(arcs.length<36)arcs.push({x:origin.x,y:origin.y,tx:target.x,ty:target.y,life:.16,maxLife:.16});
  target.lastCharged=!!(b.charged||b.sourceCharged);damageEnemy(target,b.damage*(b.chain?.5:.2)*cardValues.cascade(upgrades.cascade)*(owns('A3-23')?1.75:1),target.x,target.y);applyAilment(b,target);
  showElementalHit({...elements,lightning:true},target,target.x,target.y);origin=target;
 }}
 const baseSplit=Math.max(b.split||0,elements.earth?2:0),cardSplit=cardValues.breakShot(b.breakRank,baseSplit>0);
 const split=(b.generation||0)<1?Math.min(7,baseSplit+cardSplit+elements.forkBonus):0;
 if(split&&!b.fragmented&&Number.isFinite(b.vx)&&Number.isFinite(b.vy)){
  b.fragmented=true;const angle=Math.atan2(b.vy,b.vx);for(let i=0;i<split;i++){
   const child=addBullet(angle+(i-(split-1)/2)*.23,b.split?'prism':b.style,false,0,.5);
   if(!child)continue;
   child.x=x+8;child.y=y;child.split=0;child.generation=1;
   if(e)child.hit.add(e);
   child.elements={...elements};child.chain=b.chain||0;child.slow=b.slow||0;child.blast=b.blast;
   child.homing=false;child.snakeRank=b.snakeRank||0;child.sourceCharged=!!(b.charged||b.sourceCharged);
   child.bossFactor=b.bossFactor;child.damage=b.damage*(i>=baseSplit&&i<baseSplit+cardSplit?breakShotDamage:hitFragmentDamage);child.life=1.2;
  }ring(x,y,'#c7ffff',34);sound('split');
 }
}
function damagePart(part,amount,x,y,bossFactor=1){
 if(!boss||part.hp<=0)return;
 part.hp=Math.max(0,part.hp-amount*bossFactor*(part.hp/part.max<.35?1+cardValues.execute(upgrades.execute):1));part.flash=.1;particle(x,y,'#fff0c8',8);if(flashes.length<28)flashes.push({x,y,r:18,life:.09,maxLife:.09});
 if(part.hp===0){sound('segment',{x});addRage(15,'killRage');score+=500;ring(x,y,'#ffb86b',72);particle(x,y,'#ffbe7b',30);shake=4;notice=1.5;noticeText='SEGMENT ZERSTÖRT!'}
 boss.hp=boss.parts.reduce((sum,p)=>sum+p.hp,0);
 if(boss.hp>0)return;
 const defeated=boss;
 flightStats.bosses++;
 sound('bossClear');
 dropGear(defeated.x,defeated.y,true,secret);
 if(defeated.i===0)firstBossDefeated=true;
 bankRunTalents(1);
 if(owns('B3-20'))player.metaBossSpeed=5;
 if(owns('W1-20')&&!player.bossSpecialUsed){
  const weapon=activeWeapon(),max=player.effectMax||18;
  if(weapon>=0&&player.effects[weapon]<max){
   player.effects[weapon]=Math.min(max,player.effects[weapon]+max/(owns('W1-23')?2:3));
   player.bossSpecialUsed=true;
  }
 }
 dropOrb(defeated.x,defeated.y,10,32.5,'boss',3);
 score+=2000+defeated.i*500;
 ring(defeated.x,defeated.y,'#fff1ba',150);
 particle(defeated.x,defeated.y,'#ffbd7c',60,2);
 deaths.push({...defeated,boss:true,secret,life:1.2,age:0,rotation:.3});shake=5;
 if(secret)beginTransition('leave');
 boss=null;shots=[];restoreBossPickups();
 notice=3;noticeText='BESIEGT · '+bosses[defeated.i].toUpperCase();
}
function splash(b){
 const explosive=b.style==='red'||b.cartridge==='fuseRocket';
 const radius=(explosive?54:30)+upgrades.blast*5,amount=b.damage*(explosive?.4:cardValues.blast(upgrades.blast));
 ring(b.x,b.y,b.style==='red'?'#ff8b5b':'#ffe9aa',radius);particle(b.x,b.y,'#ffbe72',20,1.3);
 for(const e of enemies)if(e.hp>0&&Math.hypot(e.x-b.x,e.y-b.y)<radius)damageEnemy(e,amount,e.x,e.y);
}
const bossWarningTime=1.1, bossTravelTime=.65;
const vizierStrike={distance:W*.75,warning:1.15,duration:.55};
const bossPhaseProfiles={
 0:{x:740,top:155,bottom:385,opening:2.75,interval:3.4},
 1:{x:755,top:135,bottom:405,opening:2.75,interval:2.3},
 5:{x:710,top:165,bottom:375,opening:2.5,interval:2.2},
 6:{x:775,top:120,bottom:420,opening:2.75,interval:2.35},
 7:{x:745,top:145,bottom:385,opening:2.6,interval:2.25},
 8:{x:765,top:165,bottom:390,opening:3,interval:2.4}
};
function updateBossEncounter(b,dt){
 const encounter=b.encounter;
 if(!encounter)return false;
 const profile=bossPhaseProfiles[b.i];
 if(encounter.phase===1&&b.hp<=b.max/2){
  b.special=null;
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
  b.fire=1/(b.attackRate??1);
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
  projectile(b.x-30,b.y,-260,0,'#e8b68a',18,{kind:'needle',fromBoss:true});
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
  projectile(x,y,direction*180,side*70,'',14,{fromBoss:true,kind:'sickle',curve:-direction*side*1.15,curveUntil:.65});
 }else{
  const laneY=second?clamp(y,395,475):clamp(y,125,200);
  const speeds=second?[210,255]:[235,280];
  for(const speed of speeds){
   projectile(x,laneY,direction*speed,second?-72:-105,'',14,{fromBoss:true,kind:'mortar',gravity:second?72:80,life:2.3});
  }
 }
}
function bossVolley(b,profile){
 const part=bossFiringPart(b);
 if(!part)return;
 const attack=nextBossAttack(b);
 b.volleyIndex=(b.volleyIndex||0)+1;
 const target=b.aimTarget||{x:player.x,y:player.y};
 if(Array.isArray(attack)){
  const [name,color,buildWaves]=attack;
  const {x,y}=target;
  b.special={name,color,waves:buildWaves({x,y,lane:clamp(y,200,385)}),index:0,wait:profile ? .65 : .85};
  sound('bossSpecial');
 }else if(attack==='strike'){
  b.strike={elapsed:0,warning:vizierStrike.warning,fromX:b.x,toX:Math.max(80,b.x-vizierStrike.distance)};
 }else if(profile&&(attack==='mortar'&&b.i===6||attack==='sickle'&&b.i===1)){
  fireBossPhaseSalvo(b,part,target,false);
  b.delayedVolley={part,target,wait:b.i===1?.25:.4};
 }else{
  hostileVolley(attack,b.x+part.aim[0],b.y+part.aim[1],target,true);
 }
}
function updateBossSpecial(b,dt){
 const special=b.special;
 if(!special)return false;
 special.wait-=dt;
 if(special.wait>0)return true;
 for(const [x,y,vx,vy,kind,options] of special.waves[special.index]){
  const size={needle:12,sickle:15,splitter:17,mortar:15,mine:20,football:28,pulse:specialPulseWidth}[kind];
  projectile(x,y,vx,vy,special.color,size,{fromBoss:true,kind,bossSpecial:special.name,...options});
 }
 if(++special.index<special.waves.length){
  special.wait=.55;
  sound('bossSpecial');
 }else{
  b.special=null;
 }
 return true;
}
function updateBoss(dt){
 if(!boss)return;let chill=0;
 for(const part of [...boss.parts]){part.flash=Math.max(0,part.flash-dt);part.slowTime=Math.max(0,(part.slowTime||0)-dt);if(part.slowTime<=0)part.slow=0;part.shatterCooldown=Math.max(0,(part.shatterCooldown||0)-dt);if(part.hp>0)chill=Math.max(chill,part.slow||0);
  if(part.hp>0&&part.burnLife>0){part.burnLife-=dt;part.burnTick=(part.burnTick||0)+dt;if(part.burnTick>=.25){const elapsed=part.burnTick;part.burnTick=0;eruptElement('fire',part);damagePart(part,part.burnDps*elapsed,boss.x+part.aim[0],boss.y+part.aim[1],1);if(!boss)return}}
 }
 const strike=boss.strike;
 const phaseMovement=updateBossEncounter(boss,dt);
 const strikeMovement=!phaseMovement&&updateVizierStrike(boss,dt);
 const repositioning=phaseMovement||strikeMovement;
 if(!repositioning){
  const step=dt*(1-chill*.5);
  const specialActive=updateBossSpecial(boss,dt);
  boss.age+=step;
  if(!specialActive)boss.fire-=step;
  boss.x+=(830-boss.x)*Math.min(1,dt*2);
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
  if(!specialActive&&boss.fire<=.55&&!boss.aimTarget)boss.aimTarget={x:player.x,y:player.y};
 }else{
  boss.aimTarget=null;
 }
 if(!repositioning&&!boss.special&&boss.fire<=0){
  const profile=boss.encounter?.phase===2?bossPhaseProfiles[boss.i]:null;
  bossVolley(boss,profile);
  boss.aimTarget=null;
  boss.fire=(profile?.interval??(boss.i===4?1.8:2.5))/((1+threat*.12)*(boss.attackRate??1));
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
 if(gearDrops.length){
  for(const drop of gearDrops)if(!drop.returning)drop.life-=dt;
  gearDrops=gearDrops.filter(drop=>drop.life>1e-7);
 }
 bankRunTalents();
 for(let milestone=Math.floor(previousRunTime/300)+1;milestone<=Math.floor(runTime/300);milestone++)heal(1);
 if(player.metaBombs){for(const bomb of player.metaBombs){bomb.time-=dt;if(bomb.time<=0&&!bomb.exploded){bomb.exploded=true;ring(bomb.x,bomb.y,'#ffd58b',bomb.radius);for(const e of enemies)if(e.hp>0&&Math.hypot(e.x-bomb.x,e.y-bomb.y)<bomb.radius)damageEnemy(e,bomb.amount,e.x,e.y);if(boss)for(const part of [...boss.parts]){if(!boss)break;const x=boss.x+part.aim[0],y=boss.y+part.aim[1];if(part.hp>0&&Math.hypot(x-bomb.x,y-bomb.y)<bomb.radius)damagePart(part,bomb.amount,x,y,bomb.bossFactor??1)}}}player.metaBombs=player.metaBombs.filter(b=>!b.exploded)}
 const previousTime=t;
 if(secret)secretTime+=dt;else t+=dt;
 notice=Math.max(0,notice-dt);flash=Math.max(0,flash-dt);shake=Math.max(0,shake-dt*18);
 const nextLevel=Math.floor(t/districtDuration)%levels.length;if(!secret&&nextLevel!==levelIndex){levelIndex=nextLevel;notice=4;noticeText=levels[levelIndex]}
 player.metaQ10Speed=Math.max(0,(player.metaQ10Speed||0)-dt);player.metaRevenge=Math.max(0,(player.metaRevenge||0)-dt);player.metaBottleSpeed=Math.max(0,(player.metaBottleSpeed||0)-dt);player.guardFlash=Math.max(0,player.guardFlash-dt);player.metaAfterSpecial=Math.max(0,(player.metaAfterSpecial||0)-dt);player.metaGuardCooldown=Math.max(0,(player.metaGuardCooldown||0)-dt);player.metaGrazeSpeed=Math.max(0,(player.metaGrazeSpeed||0)-dt);player.metaHitSpeed=Math.max(0,(player.metaHitSpeed||0)-dt);player.metaGrazeInvCooldown=Math.max(0,(player.metaGrazeInvCooldown||0)-dt);const previousRage=player.overdrive;player.overdrive=Math.max(0,player.overdrive-dt);player.metaRageLock=Math.max(0,(player.metaRageLock||0)-dt);if(previousRage>0&&player.overdrive===0)player.metaAfterglow=1.5*(Number(owns('K2-16'))+Number(owns('K2-22')));else player.metaAfterglow=Math.max(0,player.metaAfterglow-dt);player.inv=Math.max(0,player.inv-dt);player.podCooldown=Math.max(0,player.podCooldown-dt);player.muzzle=Math.max(0,player.muzzle-dt);
 if(player.overdrive>0&&owns('K1-20')){player.metaLightning=(player.metaLightning||0)-dt;if(player.metaLightning<=0){player.metaLightning+=1;const targets=enemies.filter(e=>e.hp>0).sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y)).slice(0,owns('K1-23')?2:1);for(const e of targets){arcs.push({x:player.x,y:player.y,tx:e.x,ty:e.y,life:.16,maxLife:.16});damageEnemy(e,damage(.6),e.x,e.y)}}}
 player.verticalWine=Math.max(0,(player.verticalWine||0)-dt);
 for(let i=0;i<player.effects.length;i++)player.effects[i]=Math.max(0,player.effects[i]-dt);
 const dx=clamp(Number(keys.has('ArrowRight')||keys.has('KeyD'))-Number(keys.has('ArrowLeft')||keys.has('KeyA'))+padMove.x,-1,1);
 const dy=clamp(Number(keys.has('ArrowDown')||keys.has('KeyS'))-Number(keys.has('ArrowUp')||keys.has('KeyW'))+padMove.y,-1,1);
 player.metaBossSpeed=Math.max(0,(player.metaBossSpeed||0)-dt);
 const v1=.0075*(metaCount('V1',[1,2,3,4,6,7,8,9,11,12,14,15,17,18,19])+2*Number(owns('V1-21')))+(owns('V1-23')?.375:0)+(player.metaGrazeSpeed>0?.12:0)+(player.metaHitSpeed>0?.225:0)+(owns('V1-20')&&runTime-(player.metaLastHit||0)>=2?.075:0)+(hearts<=2?.045*metaCount('V3',[5,10]):0)+(hearts<=1&&owns('V3-22')?.225:0);
 const len=Math.max(1,Math.hypot(dx,dy)),speed=(activeWeapon()===4?300:220)*1.15*1.05*1.15*(1+cardValues.agility(upgrades.agility))*(owns('S2')?1.03:1)*(owns('B2-23')?.9:1)*(owns('V2-23')?.88:1)*(player.metaBossSpeed>0?1.15:1)*(1+v1+(owns('Q1')?.045:0)+(player.metaQ10Speed>0&&owns('Q10')?.12:0))*(player.metaBottleSpeed>0?1.15:1);
 player.bank=(player.bank||0)+(dy/len-(player.bank||0))*Math.min(1,dt*9);
 const gearSpeed=1+gearBonus('speed')+gearBonus(player.overdrive>0?'rageSpeed':'calmSpeed')+(hearts<=2?gearBonus('lowSpeed'):0);
 const travel=speed*gearSpeed*dt/len;
 player.x=clamp(player.x+dx*travel,30,W-32);
 player.y=clamp(player.y+dy*travel,90,H-34);
 const power=player.fieldPower;
 const clearing=power.beamTime>0?sweeperRay(true):null;
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
 updateFormation(previousTime);
 updateStarRoute(dt);
 const reducedEffects=projectileEffectsReduced();
 for(let i=0,count=bullets.length;i<count;i++){
  const b=bullets[i];
  const previousX=b.x,previousY=b.y;
  recordProjectileTrail(b,dt,.025,7,reducedEffects);
  b.age=(b.age||0)+dt;b.life=(b.life===undefined?4:b.life)-dt;
  const carousel=b.carousel,orbiting=b.orbit&&b.age<b.orbit;
  const leavingCarousel=carousel&&!orbiting&&b.age-dt<b.orbit;
  if(orbiting||leavingCarousel){
   const angle=Math.min(b.age,b.orbit)*(b.orbitSpeed||7)+b.phase;
   b.x=player.x+22+Math.cos(angle)*b.orbitRadius;
   b.y=player.y+Math.sin(angle)*b.orbitRadius+(b.orbitOffset||0);
  }
  if(b.boomerangAt&&!b.returning&&!orbiting&&(b.age>=b.boomerangAt||b.returnContact))turnBoomerang(b);
  if(b.target)steerProjectile(b,rocketAim(b.target),12*homingStrength,dt);
  if((b.homing||b.seekRank)&&!(carousel&&(orbiting||leavingCarousel))){
   const direction=b.boomerangAt&&b.returning?-1:1;
   let target=null,nearest=Infinity;
   for(const e of enemies){
    const dx=e.x-b.x;
    if(e.hp<=0||dx*direction<=0||e.x-e.w/2>=W||e.x+e.w/2<=0||e===b.returnContact||b.hit.has(e))continue;
    const dy=e.y-b.y,distance=dx*dx+dy*dy;
    if(distance<nearest){nearest=distance;target=e}
   }
   steerProjectile(b,target||bossAimPoint(b.x,b.y,b.hit,direction),b.seekRank?cardValues.seekShot(b.seekRank):3*homingStrength,dt);
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
 for(let i=0,count=shots.length;i<count;i++){
  const s=shots[i];
  recordProjectileTrail(s,dt,.035,4,reducedEffects);
  moveHostileShot(s,dt);s.life-=dt;
  if(s.life>0&&clearing&&sweeperClears(clearing,s)){s.life=0;particle(s.x,s.y,fieldPowerups.sweeper.color,3)}
  if(s.life>0&&s.burstAt&&s.age>=s.burstAt)burstHostileShot(s);
 }
 const pickupRadius=pickups.length?(78+cardValues.magnet(upgrades.magnet))*(1+.045*metaCount('B2',[1,2,3,4,6,7,8,9])+(owns('B2-23')?1.5:0))+(owns('B2-13')?60:0)+gearBonus('bottleMagnet'):0;
 for(const p of pickups){const dx=player.x-p.x,dy=player.y-p.y,distance=Math.hypot(dx,dy);p.x-=100*dt;if(distance<pickupRadius&&distance>1){p.x+=dx/distance*80*dt;p.y+=dy/distance*80*dt}p.age=(p.age||0)+dt;if(styles[p.i]&&p.x-p.w/2<W)player.weaponWineSeen=true}
 const orbRadius=orbs.length?(78+cardValues.magnet(upgrades.magnet,true))*(1+(owns('S4')?.075:0)+.03*metaCount('B1',[1,2,3,4,6,7,8,9])+.03*metaCount('B3',[5,10])+(player.overdrive>0?.045*metaCount('K3',[5,10]):0))+gearBonus('orbMagnet'):0;
 const eliteReach=orbs.length&&owns('B3-16')?45:0;
 for(const orb of orbs){
  orb.age+=dt;
  if(orb.starBurst){
   const burst=orb.starBurst;
   const progress=Math.min(1,orb.age/starOrbFlightTime);
   const ease=1-(1-progress)**2;
   orb.x=burst.x+(orb.starX-burst.x)*ease;
   orb.y=burst.y+(orb.starY-burst.y)*ease;
   continue;
  }
  orb.x-=(orb.speed||0)*dt;
  const dx=player.x-orb.x,dy=player.y-orb.y,d=Math.hypot(dx,dy);
  if(d===0)continue;
  const radius=orbRadius+(orb.kind==='elite'?eliteReach:0);
  if(d>=radius)continue;
  const step=Math.min(d,260*dt);
  orb.x+=dx/d*step;
  orb.y+=dy/d*step;
 }
 for(const e of enemies){
  e.age+=dt;e.shatterCooldown=Math.max(0,(e.shatterCooldown||0)-dt);e.flash=Math.max(0,e.flash-dt);e.slowTime=Math.max(0,(e.slowTime||0)-dt);if(e.slowTime<=0)e.slow=0;
  if(e.burnLife>0&&e.hp>0){e.burnLife-=dt;e.metaLastDamage=e.burnDps*dt;e.hp-=e.metaLastDamage;eruptElement('fire',e);if(e.hp<=0)death(e)}
  if(e.hp<=0)continue;
  if(e.patrol){
   if(e.age>=e.lifetime){e.hp=0;continue}
   moveBlockerPatrol(e,dt);
  }else{
   const entering=e.blocker&&e.x>W-e.w/2;
   e.x+=(e.rear?1:-1)*enemySpeed(e)*(entering?3:1)*dt;
   if(e.rear){
    if(!e.formation&&e.x<player.x)e.y+=clamp(player.y-e.y,-38*dt,38*dt);
   }else if(e.blocker){
    if(e.age>=e.lifetime){e.hp=0;continue}
   }else{
    const wave=[0,30,45,0,55,20,0,0,42,12][e.i];
    const verticalSpeed=e.entryDrift??Math.cos(e.age*(e.i===4?6:2)+e.phase)*wave;
    e.y=clamp(e.y+verticalSpeed*(1-(e.slow||0))*dt,95,495);
   }
  }
  if(!e.patrol&&e.x-e.w/2<W&&e.x+e.w/2>0){
   e.fire-=dt*(1-(e.slow||0)*.4);
   if(e.fire<=.55&&!e.aimTarget)e.aimTarget={x:player.x,y:player.y};
   if(e.fire<=0){
    enemyAttack(e);e.aimTarget=null;
    if(e.formation)e.fire=e.formationVolleys>0?1.25:Infinity;
    else e.fire=e.blocker?4:e.rear?3.4:e.rareEnemy?4.8:e.introSimit?4:rand(1.8,3.1)/(1+threat*.16)/(e.elite?1.12:1);
   }
  }
  if(hit(player,e,8)){
   hurt('contact',e.x,e.y);
   if(state!=='playing')return;
  }
 }
 updateBoss(dt);
 if(state!=='playing')return;
 launchOrbitRocket();
 if(clearing)hitSweeperTarget(sweeperRay(true),dt);
 for(const beam of beams)if(updateBeam(beam,dt))break;
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
   damagePart(part,modifyDirectHit(part,amount,b,true,b.x,b.y),b.x,b.y,b.bossFactor??1);
   if(!rocket){
    const impact={...b,damage:amount};
    onHit(impact,part,b.x,b.y);b.fragmented=impact.fragmented;
   }
   if(b.cartridge==='fuseRocket')splash(b);
   if(finishProjectileHit(b,part))break;
  }
 }
 const grazeRadiusSquared=shots.length?(42*(1+.03*metaCount('V1',[5,10])))**2:0;
 const pod={x:player.x,y:player.y,w:player.w+14,h:player.h+14};
 for(const s of shots){
  if(s.life>0&&clearing&&sweeperClears(clearing,s)){s.life=0;particle(s.x,s.y,fieldPowerups.sweeper.color,3)}
  else if(s.life>0&&power.shieldTime>0&&power.shield>0&&hit(player,s)){
   s.life=0;power.shield--;showProtection('SCHILD');impact(s.x,s.y,fieldPowerups.shield.color);sound('block');addRage(10,'blockRage');
  }
  else if(s.life>0&&owns('V2-13')&&player.metaGuardCooldown<=0&&Math.hypot(s.x-player.x,s.y-player.y)<55){s.life=0;showProtection('TALENTWACHE');player.metaGuardCooldown=(owns('V2-16')?13.33:16.67)/(owns('V2-23')?1.6:1);impact(s.x,s.y,'#aeeaff',12);sound('block')}
  else if(s.life>0&&player.podCooldown<=0&&hit(pod,s)){s.life=0;showProtection('SCHUTZKAPSEL');player.guardFlash=.16;const reduction=.045*metaCount('V2',[5,10])+.015*(metaCount('V2',[11,12,14,15,17,18,19])+2*Number(owns('V2-21')));player.podCooldown=2.5*cardValues.guard(upgrades.guard)*(1-reduction-(owns('Q4')&&player.overdrive>0?.075:0))/(owns('V2-23')?1.6:1)*gearFactor('guardCooldown');impact(pod.x,pod.y,'#aeeaff',12);addRage(10,'blockRage');sound('block')}
  else if(s.life>0&&hit(player,s)){
   s.life=0;
   hurt('projectile',s.originX??(s.x-s.vx*.05),s.y-s.vy*.05);
   if(state!=='playing')return;
  }
  else if(s.life>0&&!s.grazed&&player.inv<=0&&(s.x-player.x)**2+(s.y-player.y)**2<grazeRadiusSquared){
   grazeShot(s);
  }
 }
 power.shieldTime=Math.max(0,power.shieldTime-dt);
 if(power.shieldTime===0)power.shield=0;
 power.beamTime=Math.max(0,power.beamTime-dt);
 if(state!=='playing')return;
 for(const orb of orbs)if((!orb.starBurst||orb.age>=starOrbFlightTime+starOrbPickupDelay)&&hit(player,orb)){const elite=orb.kind==='elite',bossOrb=orb.kind==='boss';const bonus=.015*(metaCount('B1',[5,10,11,12,14,15,17,18,19])+2*Number(owns('B1-21')))+(owns('B1-16')&&elite?.15:0)+(owns('B1-23')?.30:0)+(owns('Q5')&&player.overdrive>0?.075:0)+(elite?.015*metaCount('B3',[1,2,3,4,6,7,8,9]):0)+(bossOrb?.015*(metaCount('B3',[11,12,14,15,17,18,19])+2*Number(owns('B3-21'))):0)+(bossOrb&&owns('B3-13')?.225:0)+(owns('B3-23')?(elite||bossOrb?.45:-.10):0);xp+=orb.value*(1+bonus)*1.25*orbXpMultiplier*gearFactor('orbXp');orb.collected=true;player.metaOrbs=(player.metaOrbs||0)+1;const wave=(owns('B1-20')&&player.metaOrbs%25===0)||(bossOrb&&owns('B3-22'));if(wave){const radius=112.5+(owns('B1-22')?37.5:0),amount=damage(1.5+(owns('B1-22')?.75:0));ring(player.x,player.y,'#80faff',radius);for(const e of enemies)if(e.hp>0&&Math.hypot(e.x-player.x,e.y-player.y)<radius)damageEnemy(e,amount,e.x,e.y)}}
 orbs=orbs.filter(orb=>!orb.collected&&orb.x+orb.w/2>=0);if(xp>=xpNeeded){offerCards();return}
 for(const p of pickups)if(!p.dead&&hit(player,p)){
  if(fieldPowerups[p.i]){collectFieldPowerup(p);continue}
  if(p.i!==5&&p.i!==16){if(owns('Q10'))player.metaQ10Speed=3;if(owns('W3-22'))player.metaWeaponSpecial=true;if(owns('W3-13')){ring(player.x,player.y,'#ffd58b',90);for(const e of enemies)if(e.hp>0&&Math.hypot(e.x-player.x,e.y-player.y)<90)damageEnemy(e,damage(.75),e.x,e.y)}}
  if(p.i===16){const weapon=activeWeapon();if(weapon>=0)player.effects[weapon]=player.effectMax||18;else player.verticalWine=10}else if(p.i===5)heal(1,gearFactor('juiceHealing'));else{const first=!player.metaWeaponFound;player.metaWeaponFound=true;if(first&&owns('Q7'))player.rage=Math.min(100,player.rage+7.5*gearFactor('allRage'));player.weapon=p.i;player.effects=player.effects.map((v,i)=>i===2?v:0);if(owns('W2-16'))player.metaBottleSpeed=2;const duration=1+.015*metaCount('W2',[1,2,3,4,6,7,8,9])+.045*metaCount('B2',[5,10])+.015*(metaCount('B2',[11,12,14,15,17,18,19])+2*Number(owns('B2-21')))+(owns('S5')?.045:0)+(owns('Q6')&&player.overdrive>0?.075:0)+(first&&owns('B2-16')?.30:0)+(first&&owns('B2-20')?1/3:0);player.effectMax=player.effects[p.i]=18*(1+cardValues.duration(upgrades.duration)+cardValues.cellar(upgrades.cellar))*duration*gearFactor('wineDuration')*(owns('V1-23')?.85:1)*(owns('W2-23')?.8:1);if(owns('B2-22')&&!player.metaBottleHealed&&hearts<maxHearts()){heal(1);player.metaBottleHealed=true}}
  sound(p.i===5?'heal':'pickup',{style:styles[p.i]||'normal'});p.dead=true;notice=2.6;noticeText=p.i===16?(player.verticalWine>0&&activeWeapon()<0?'SONDERWEIN · OBEN UND UNTEN':'SONDERWEIN · WEIN AUFGEFÜLLT'):p.i===5?(gearBonus('juiceHealing')?'TRAUBENMOST · +'+numberLabel.format(gearFactor('juiceHealing'))+' HEILUNG':'TRAUBENMOST · EIN HERZ'):powerNames[p.i].toUpperCase()+' · '+weaponNames[p.i];ring(p.x,p.y,colors[p.i]||'#ffd34e',60);particle(p.x,p.y,colors[p.i]||'#ffd34e',24);
 }
 for(const p of particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=100*dt;p.life-=dt}
 for(const d of deaths){d.age+=dt;d.life-=dt}
 for(const r of rings)r.life-=dt;for(const a of arcs)a.life-=dt;for(const f of flashes)f.life-=dt;
 for(const effect of elementalBursts)effect.life-=dt;
 elementalBursts=elementalBursts.filter(effect=>effect.life>0);
 enemies=enemies.filter(e=>e.hp>0&&(e.patrol||e.x>-100&&(!e.rear||e.x-e.w/2<W)));bullets=bullets.filter(b=>!b.dead&&b.life>0&&b.x<W+60&&b.x>-60&&b.y>-50&&b.y<H+50);
 shots=shots.filter(s=>s.life>0&&s.x>-30&&s.x<W+30&&s.y>-30&&s.y<H+30);pickups=pickups.filter(p=>!p.dead&&p.x>-30);
 particles=particles.filter(p=>p.life>0);deaths=deaths.filter(d=>d.life>0);rings=rings.filter(r=>r.life>0);beams=beams.filter(b=>b.life>0);arcs=arcs.filter(a=>a.life>0);flashes=flashes.filter(f=>f.life>0).slice(-28);
 collectGear();
}
function drawFieldPickup(p){
 const color=fieldPowerups[p.i].color;
 c.save();c.translate(Math.round(p.x),Math.round(p.y+Math.sin(p.age*4)*3));
 c.fillStyle='#172135';c.fillRect(-13,-13,26,26);c.fillRect(-16,-9,32,18);c.fillRect(-9,-16,18,32);
 c.fillStyle='#47526a';c.fillRect(-12,-11,24,22);
 c.fillStyle='#202f45';c.fillRect(-11,-10,22,20);
 c.fillStyle=color;c.fillRect(-8,-14,16,2);c.fillRect(-14,-8,2,10);c.fillRect(12,3,2,5);
 if(p.i==='rockets'){
  drawRocket(0,0,0,false);
 }else if(p.i==='shield'){
  c.fillRect(-7,-7,14,9);c.fillRect(-5,2,10,3);c.fillRect(-2,5,4,3);
  c.fillStyle='#478b98';c.fillRect(0,-5,5,7);c.fillRect(0,2,3,3);
 }else{
  c.fillRect(-8,-5,4,10);c.fillRect(-4,-2,13,4);c.fillRect(2,-7,6,2);c.fillRect(2,5,6,2);
  c.fillStyle='#fff1ff';c.fillRect(-3,-1,12,2);
 }
 c.fillStyle='#fff5d9';c.fillRect(-10,-12,4,2);c.restore();
}
function drawRocket(x,y,angle,launched){
 c.save();c.translate(Math.round(x),Math.round(y));c.rotate(angle);
 if(launched){
  const plume=12+Math.round(3*Math.sin(runTime*48));
  c.fillStyle='#d9714e';c.fillRect(-7-plume,-2,plume,4);
  c.fillStyle='#ffde83';c.fillRect(-13,-1,7,2);
 }
 c.fillStyle='#342a39';c.fillRect(-8,-4,15,8);c.fillRect(-8,-6,5,12);c.fillRect(7,-2,3,4);
 c.fillStyle='#a75b49';c.fillRect(-7,-5,4,10);
 c.fillStyle='#c89b58';c.fillRect(-6,-3,12,6);
 c.fillStyle='#ffdfa0';c.fillRect(-5,-3,11,2);c.fillRect(6,-1,3,2);
 c.fillStyle='#486980';c.fillRect(1,-2,3,3);
 c.fillStyle='#cbffff';c.fillRect(1,-2,2,1);c.restore();
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
  const ray=sweeperRay();
  PfertArt.focusBeam(c,{...ray,color:laserColor()},runTime,reducedMotion?.matches);
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
function drawFormationWarning(){
 if(!formation)return;
 const fraction=clamp((formation.releaseAt-t)/formationWarning,0,1);
 c.save();
 for(const [,y,rear=false] of formation.units){
  const x=rear?0:W-66;
  c.fillStyle='#232237';c.fillRect(x,y-19,66,38);
  c.fillStyle='#f2b778';c.fillRect(x,y-19,66,2);c.fillRect(x,y+17,66,2);
  c.fillStyle='#815363';c.fillRect(x+5,y+11,56,2);
  c.fillStyle='#f9d99b';c.fillRect(x+5,y+11,Math.round(56*fraction),2);
  for(let i=0;i<3;i++){
   const left=x+12+i*16,tip=left+(rear?9:0),base=left+(rear?0:9);
   c.beginPath();c.moveTo(base,y-11);c.lineTo(tip,y-2);c.lineTo(base,y+7);
   c.lineTo(base,y+3);c.lineTo(tip+(rear?-4:4),y-2);c.lineTo(base,y-7);
   c.closePath();c.fill();
  }
 }
 c.restore();
}
function drawGearDrop(drop){
 const {x,y,life,item}=drop;
 const color=gearRarities[item.rarity].color;
 const pixels=gearSlots[item.slot].pixels;
 c.save();
 c.globalAlpha=life<3&&Math.floor(life*6)%2===0?.62:1;
 c.fillStyle='#14253b';
 c.fillRect(x-15,y-15,30,30);
 c.lineWidth=2;c.strokeStyle=color;
 c.strokeRect(x-14,y-14,28,28);
 c.fillStyle=color;
 pixels.forEach((row,j)=>{
  for(let i=0;i<row.length;i++)if(row[i]==='#')c.fillRect(x-10+i*4,y-pixels.length*2+j*4,4,4);
 });
 c.fillRect(x-12,y+11,Math.ceil(24*life/gearDropDuration),2);
 c.restore();
}
function drawDamageFrame(){
 const top=62,bottom=H-7;
 c.save();
 c.fillStyle='#ef7968';
 for(const [inset,width,opacity] of [[0,3,.85],[3,4,.36],[7,5,.12]]){
  const sideTop=top+inset+width,sideHeight=bottom-top-2*(inset+width);
  c.globalAlpha=flash/damageFrameTime*opacity;
  c.fillRect(inset,top+inset,W-inset*2,width);
  c.fillRect(inset,bottom-inset-width,W-inset*2,width);
  c.fillRect(inset,sideTop,width,sideHeight);
  c.fillRect(W-inset-width,sideTop,width,sideHeight);
 }
 c.restore();
}
function render(){
 const reducedEffects=projectileEffectsReduced();
 const now=secret?secretTime:t;
 c.save();
 if(shake>0&&!reducedMotion?.matches)c.translate(Math.sin(now*83)*shake,Math.cos(now*77)*shake*.5);
 const arrival=!secret&&t>=districtDuration&&!reducedMotion?.matches?Math.min(1,(t%districtDuration)/.8):1;
 PfertArt.background(c,levelIndex,now,secret?secretType:0,arrival);
 for(const p of pickups){
  if(fieldPowerups[p.i])drawFieldPickup(p);
  else PfertArt.bottle(c,{...p,element:weaponElements[p.i]});
 }
 if(player&&player.metaBombs)for(const b of player.metaBombs){c.fillStyle='#ffd58b';c.beginPath();c.arc(b.x,b.y,6,0,Math.PI*2);c.fill()}
 for(const orb of orbs)PfertArt.experienceOrb(c,orb);
 if(golden)PfertArt.golden(c,golden);
 const sceneLights=[];
 for(let i=Math.max(0,flashes.length-4);i<flashes.length;i++){
  const f=flashes[i];
  sceneLights.push({x:f.x,y:f.y,strength:f.life/f.maxLife,color:f.magic?'#a4ddff':'#ffcd8c'});
 }
 for(let i=bullets.length-1,count=0;i>=0&&count<3;i--){
  const b=bullets[i];
  if(!b.charged&&b.cartridge!=='sunLance'&&b.cartridge!=='fuseRocket')continue;
  const warm=b.cartridge==='sunLance'||b.cartridge==='fuseRocket'||b.style==='red'||b.style==='phoenix'||b.style==='mortar';
  sceneLights.push({x:b.x,y:b.y,strength:.6,color:warm?'#ffba80':'#9edbff'});
  count++;
 }
 for(const e of enemies){
  let strength=0,color;
  for(const source of sceneLights){
   const dx=e.x-source.x,dy=e.y-source.y,distanceSquared=dx*dx+dy*dy;
   if(distanceSquared>=110*110)continue;
   const amount=source.strength*(1-Math.sqrt(distanceSquared)/110);
   if(amount>strength){strength=amount;color=source.color}
  }
  PfertArt.enemy(c,e,levelIndex,secret?secretType:0,strength?{strength,color}:null);
  if(e.patrol?.sprite==='lantern')drawLanternArmor(e);
 }
 if(boss){
  PfertArt.boss(c,boss,secret);
  for(const part of boss.parts)if(vizierGuard(part))drawVizierArmor(part);
 }
 for(const d of deaths)PfertArt.death(c,d,levelIndex);
 for(const drop of gearDrops)if(!drop.returning)drawGearDrop(drop);
 for(const b of bullets){
  if(!reducedEffects)PfertArt.trail(c,b);
  if(b.style==='rocket')drawRocket(b.x,b.y,Math.atan2(b.vy,b.vx),true);
  else PfertArt.bullet(c,b,reducedEffects);
 }
 for(const beam of beams)PfertArt.beam(c,beam,now,reducedEffects);
 for(const arc of arcs)PfertArt.arc(c,arc);for(const f of flashes)PfertArt.flash(c,f);
 for(const effect of elementalBursts)PfertArt.elementalBurst(c,effect);
 for(const r of rings)PfertArt.ring(c,r);
 for(const p of particles)PfertArt.spark(c,p);c.globalAlpha=1;
 drawFormationWarning();
 if(boss)PfertArt.bossStrikeWarning(c,boss);
 if(starRoute)for(let i=starRoute.index;i<starRoute.gates.length;i++){
  const gate=starRoute.gates[i];
  if(gate.x<=W+28){
   const next=starRoute.gates[i+1];
   PfertArt.starGate(c,gate,i,i===starRoute.index,runTime,next?Math.sign(next.y-gate.y):0);
  }
 }
 PfertArt.horse(c,player||{x:140,y:300,effects:[],charge:0},now,player?chargeLimit():1.5);
 if(player&&state==='playing'){
  const extra=owns('V2-13');
  const mask=Number(player.effects[2]>0)|
   (Number(owns('V2-20')&&!player.metaShieldUsed)<<1)|
   (Number(player.podCooldown<=0)<<2)|
   (Number(extra&&player.metaGuardCooldown<=0)<<3);
  PfertArt.shieldDial(c,player,mask,extra?4:3);
 }
 if(player&&state==='playing'&&owns('V2-13')){const angle=runTime*2; c.fillStyle=player.metaGuardCooldown>0?'#71888b':'#fff0aa';c.beginPath();c.arc(player.x+Math.cos(angle)*45,player.y+Math.sin(angle)*32,6,0,Math.PI*2);c.fill()}
 if(player)drawFieldPowerEffects();
 for(const s of shots)if(s.life>0)PfertArt.hostile(c,s,reducedEffects);
 if(player)PfertArt.hitCue(c,player,runTime);
 c.restore();
 if(player&&(state==='playing'||state==='upgrade'||state==='transition'||state==='paused')){
  if(flash>0&&!reducedMotion?.matches)drawDamageFrame();
  const weapon=activeWeapon();
  PfertArt.hud(c,{hearts,score,t,runTime,secret,secretType,secretTime,player,boss,weapon,cartridges,wine:wineStatus(weapon),weaponNames,level,xp,xpNeeded,upgrades,build:collectedCards(),combo,comboRemaining:comboTime/comboWindow,threat,maxHearts:maxHearts(),talentPoints:metaTimePoints+metaBosses});
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
 const left=b(14)||axis(0)<-.5,right=b(15)||axis(0)>.5,up=b(12)||axis(1)<-.5,down=b(13)||axis(1)>.5,a=b(0),rage=b(1),confirm=b(2),target=b(3),menu=b(9);
 padMove={x:clamp(axis(0)+Number(b(15))-Number(b(14)),-1,1),y:clamp(axis(1)+Number(b(13))-Number(b(12)),-1,1)};
 if((state==='playing'||state==='menu'||state==='over')&&(a||rage||padMove.x||padMove.y))lastFlightInput='gamepad';
 if(padBlocked){
  if(!a&&!confirm&&!target&&!b(12)&&!b(13)&&!b(14)&&!b(15)&&!axis(0)&&!axis(1)&&!rage&&!menu)padBlocked=false;
  padMove={x:0,y:0};
  padPrev={a,confirm,target,left,right,up,down,rage,menu};
  metaBStart=null;metaBLong=false;
  return;
 }
 if(state==='paused'){
  if(menu&&!padPrev.menu||rage&&!padPrev.rage)backFromGear();
  else{
   const horizontal=Number(right&&!padPrev.right)-Number(left&&!padPrev.left);
   if(horizontal&&gearActions[gearSelection]?.id==='music-volume'){
    const volume=document.getElementById('music-volume');
    volume.value=clamp(Number(volume.value)+horizontal*5,0,100);
    applyMusicVolume(volume);
   }else if(horizontal>0||down&&!padPrev.down)selectGearAction(gearSelection+1);
   else if(horizontal<0||up&&!padPrev.up)selectGearAction(gearSelection-1);
   if(a&&!padPrev.a)gearActions[gearSelection]?.run?.();
  }
  padMove={x:0,y:0};padPrev={a,confirm,target,left,right,up,down,rage,menu};return;
 }
 if(menu&&!padPrev.menu&&(state==='playing'||state==='transition'))pauseGame();
 if(padBlocked){
  padMove={x:0,y:0};padPrev={a,confirm,target,left,right,up,down,rage,menu};return;
 }
 if(state==='transition'){padMove={x:0,y:0};padPrev={a,confirm,target,left,right,up,down,rage,menu};return}
  if(state==='talents'){if(left&&!padPrev.left)moveTalent(-1,0);if(right&&!padPrev.right)moveTalent(1,0);if(up&&!padPrev.up)moveTalent(0,-1);if(down&&!padPrev.down)moveTalent(0,1);if(a&&!padPrev.a)document.getElementById('meta-buy').click();if(rage&&!padPrev.rage){metaBStart=now;metaBLong=false}if(rage&&metaBStart!==null&&!metaBLong&&now-metaBStart>=700){metaBLong=true;document.getElementById('meta-back').click()}if(!rage&&padPrev.rage&&metaBStart!==null){if(!metaBLong)sellSelectedTalent();metaBStart=null;metaBLong=false}if(menu&&!padPrev.menu)document.getElementById('meta-back').click()}else if(state==='upgrade'){if(left&&!padPrev.left)selectCard(selectedCard-1);if(right&&!padPrev.right)selectCard(selectedCard+1);if(confirm&&!padPrev.confirm)chooseCard(selectedCard)}else if(state==='skill'){
  if(left&&!padPrev.left)selectBaseSkill(skillSelection-1);
  if(right&&!padPrev.right)selectBaseSkill(skillSelection+1);
  if(up&&!padPrev.up)selectBaseSkill(skillSelection-2);
  if(down&&!padPrev.down)selectBaseSkill(skillSelection+2);
  if(a&&!padPrev.a)chooseBaseSkill(skillSelection);
  else if(rage&&!padPrev.rage||menu&&!padPrev.menu)closeBaseSkills();
 }else if(state==='menu'||state==='over'){if(rage&&!padPrev.rage&&metaAvailable){showTalents();padBlocked=true}else if(a&&!padPrev.a)showBaseSkills()}else if(state==='playing'){
  if(a&&!padPrev.a)fireSpecial();
  if(rage&&!padPrev.rage)activateRage();
  if(target&&!padPrev.target){lastFlightInput='gamepad';aimSweeper()}
 }
 padPrev={a,confirm,target,left,right,up,down,rage,menu};
}
let lastRenderedState=null,lastRenderedMotion=null;
if(typeof PfertAssets!=='undefined')PfertAssets.ready.then(()=>{lastRenderedState=null});
function frame(now){
 if(document.hidden){last=0;lastRenderedState=null}
 else{
  pollGamepad(now);
  const dt=last===0?0:Math.min((now-last)/1000,.05);last=now;
  update(dt);
  const motion=!!reducedMotion?.matches;
  if(state==='playing'||state==='transition'||state!==lastRenderedState||motion!==lastRenderedMotion){
   if(state==='transition'||(state==='paused'&&pausedFrom==='transition'))renderTransition();
   else render();
   lastRenderedState=state;
   lastRenderedMotion=motion;
  }
 }
 requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
 function snapshot(){const image=document.createElement('canvas');image.width=W;image.height=H;image.getContext('2d').drawImage(canvas,0,0);return image}
 function beginTransition(direction){
  starRoute=null;formation=null;
  render();const image=snapshot();cancelCharge();padBlocked=true;padMove={x:0,y:0};
  transition={direction,elapsed:0,image,switched:false};state='transition';sound('transition');throw transitionInterrupt;
 }
 function advanceTransition(dt){
  transition.elapsed=Math.min(3,transition.elapsed+dt);
  if(!transition.switched&&transition.elapsed>=1.5){
   transition.switched=true;elementalBursts=[];if(transition.direction==='enter')enterRuhr();else leaveRuhr();
   render();transition.image=snapshot();
  }
  if(transition.elapsed>=3){transition=null;state='playing';keys.clear();padBlocked=true}
 }
 function renderTransition(){
  const progress=transition.switched?(transition.elapsed-1.5)/1.5:1-transition.elapsed/1.5;
  const scale=Math.max(0,Math.min(1,progress)),twist=(1-scale)*Math.PI*2;
  c.fillStyle='#080d1b';c.fillRect(0,0,W,H);
  if(scale<=0)return;
  if(reducedMotion?.matches){
   c.save();c.globalAlpha=scale;c.drawImage(transition.image,0,0);c.restore();return;
  }
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
