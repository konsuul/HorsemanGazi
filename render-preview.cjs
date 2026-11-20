(async()=>{
// Optional visual QA: uses an installed or bundled @napi-rs/canvas.
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{createRequire}=require('node:module');
let canvas;try{canvas=require('@napi-rs/canvas')}catch{canvas=createRequire(process.execPath)('@napi-rs/canvas')}
const {createCanvas}=canvas,out=createCanvas(960,540),noop=()=>{},events={},elements={};
const el=()=>({innerHTML:'',classList:{add:noop,remove:noop},addEventListener:noop});
elements.game=out;elements.overlay=el();elements.start=el();
const world={console,Math,Set,requestAnimationFrame:noop,document:{createElement:()=>createCanvas(104,104),getElementById:id=>elements[id]||(elements[id]=el())},window:{addEventListener:(event,handler)=>events[event]=handler}};
const assetImages={horse:await canvas.loadImage(__dirname+'/assets/horse-v2.png'),characters:await canvas.loadImage(__dirname+'/assets/characters-v1.png'),city:await canvas.loadImage(__dirname+'/assets/bosporus-v1.png'),cityMiddle:await canvas.loadImage(__dirname+'/assets/bosporus-mittelgrund-v1.png'),cityNear:await canvas.loadImage(__dirname+'/assets/bosporus-vordergrund-v1.png'),industry:await canvas.loadImage(__dirname+'/assets/ruhrgebiet-v1.png'),industryNight:await canvas.loadImage(__dirname+'/assets/ruhrgebiet-nachtschicht-v1.png'),effects:await canvas.loadImage(__dirname+'/assets/effects-v1.png')};world.PfertAssets={effectFrames:JSON.parse(fs.readFileSync(__dirname+'/assets/vfx-frames.json','utf8')),frames:JSON.parse(fs.readFileSync(__dirname+'/assets/frames.json','utf8')),get:id=>assetImages[id]||null};
vm.createContext(world);vm.runInContext(fs.readFileSync(__dirname+'/art.js','utf8'),world);
let code=fs.readFileSync(__dirname+'/game.js','utf8').replace('})();','globalThis.qa={reset,render,update,enemy,fireCharge,startBoss,startRuhrBoss,projectile,get:()=>({player,enemies,pickups,bullets,beams,boss,rings,flashes,upgrades,shots}),bonus:n=>{secret=true;secretType=n;secretTime=24;notice=0},scene:i=>{levelIndex=i;t=i*180+25;notice=0},quiet:()=>{spawn=999;drop=999;nextBoss=99999}};})();');
vm.runInContext(code,world);const a=world.qa;
fs.mkdirSync(__dirname+'/previews',{recursive:true});
for(let scene=0;scene<5;scene++){
 a.reset();a.quiet();a.scene(scene);let q=a.get();q.player.x=145;q.player.y=260;q.player.weapon=scene;q.player.effects[scene]=18;q.player.charge=1.25;
 for(let i=0;i<4;i++){a.enemy((i+scene*2)%10);let e=q.enemies.at(-1);e.x=440+i*130;e.y=160+(i%3)*98;e.speed=0;e.fire=999}
 a.fireCharge();for(let i=0;i<12;i++)a.update(.025);a.render();fs.writeFileSync(__dirname+'/previews/world-'+scene+'.png',out.toBuffer('image/png'));
}
a.reset();a.quiet();a.startBoss();a.get().player.y=270;a.get().player.effects[3]=18;a.get().player.weapon=3;a.get().player.charge=1.3;a.fireCharge();a.update(.02);a.render();fs.writeFileSync(__dirname+'/previews/boss-laser.png',out.toBuffer('image/png'));
const gallery=createCanvas(960,660),g=gallery.getContext('2d');g.fillStyle='#1d2d40';g.fillRect(0,0,960,660);
const sprites=vm.runInContext('PfertArt',world);
for(let i=0;i<10;i++){const x=100+(i%5)*185,y=105+Math.floor(i/5)*155;sprites.enemy(g,{i,x,y,age:1,w:56,h:46,hp:5,max:5,flash:0},0,false);g.fillStyle='#ead6af';g.font='12px monospace';g.textAlign='center';g.fillText(['Simit','Teppichräuber','Sucuk','Messingkanne','Fledermaus','Gewürzwirbel','Säbelteppich','Janitscharen-Kessel','Doppel-Sucuk','Panzerkarawane'][i],x,y+56)}
for(let i=0;i<5;i++){const x=96+i*185,y=450;sprites.bullet(g,{x,y,vx:600,vy:0,w:34,h:34,age:.3,charged:true,style:['red','white','rose','normal','speed'][i]});g.fillStyle='#ead6af';g.fillText(['Glutsalve','Perlmutt-Fächer','Rosen-Sucher','Käsebällchen','Korkenblitz'][i],x,y+56)}
sprites.beam(g,{x:100,y:575,width:25,life:.5},2);g.fillStyle='#ead6af';g.fillText('Port-Laser',480,625);fs.writeFileSync(__dirname+'/previews/weapon-and-enemy-gallery.png',gallery.toBuffer('image/png'));

const newGallery=createCanvas(960,760),ng=newGallery.getContext('2d');ng.fillStyle='#192b41';ng.fillRect(0,0,960,760);
const weaponStyles=['prism','saw','chain','orbit','mortar','wave','frost','vortex','phoenix'];
const labels=['Prisma-Splitter','Merlot-Säge','Donnerkette','Mondorbit','Sherry-Mörser','Echo-Welle','Frostfächer','Käse-Vortex','Phoenix-Flug'];
for(let i=0;i<9;i++){const x=155+(i%3)*320,y=90+Math.floor(i/3)*180;sprites.bullet(ng,{x,y,vx:400,vy:0,w:36,h:i===5?82:36,charged:true,age:.24,style:weaponStyles[i]});ng.fillStyle='#dcecf0';ng.font='14px monospace';ng.textAlign='center';ng.fillText(labels[i],x,y+68)}
sprites.beam(ng,{x:90,y:630,width:50,style:'storm',charged:true,life:.5},2);ng.fillStyle='#e2f5ff';ng.fillText('Tokaj · Gewitterkanone',480,706);fs.writeFileSync(__dirname+'/previews/new-mutators.png',newGallery.toBuffer('image/png'));
for(const n of [1,2]){a.reset();a.quiet();a.bonus(n);let q=a.get();q.player.y=230;q.player.weapon=14;q.player.effects[14]=18;q.player.charge=1.4;a.startRuhrBoss();a.fireCharge();a.update(.14);a.render();fs.writeFileSync(__dirname+'/previews/ruhrpott-'+n+'.png',out.toBuffer('image/png'))}
a.reset();a.quiet();a.scene(0);let q=a.get();q.player.weapon=-1;q.player.charge=0;a.fireCharge();for(let i=0;i<7;i++){a.enemy(i+2);const e=q.enemies.at(-1);e.x=410+i*72;e.y=155+(i%3)*110;e.fire=999;e.speed=0;if(i===2)e.flash=.08;a.projectile(400+i*72,205+(i%3)*90,-80,20,'',12,{kind:i%2?'needle':'orb'})}q.pickups.push({x:340,y:390,i:7,w:30,h:42,age:1});a.update(.07);a.render();fs.writeFileSync(__dirname+'/previews/readability.png',out.toBuffer('image/png'));
a.reset();a.quiet();a.scene(2);let build=a.get();for(const id of ['fork','chain','cascade','frost','ember','shatter','orbital','spread'])build.upgrades[id]=1;build.upgrades.echoForge=1;build.player.attacks=3;build.player.weapon=6;build.player.effects[6]=18;build.player.charge=1.4;build.player.overdrive=8;
for(let i=0;i<8;i++){a.enemy(i+1);const e=build.enemies.at(-1);e.x=350+i*70;e.y=180+(i%3)*80;e.hp=18;e.max=18;e.speed=0;e.fire=999}a.fireCharge();for(let i=0;i<10;i++)a.update(.025);a.render();fs.writeFileSync(__dirname+'/previews/synergy-overdrive.png',out.toBuffer('image/png'));
const phases=createCanvas(960,630),pc=phases.getContext('2d');pc.fillStyle='#182b40';pc.fillRect(0,0,960,630);
for(let row=0;row<3;row++)for(let col=0;col<4;col++){const age=[.025,.15,.3,.5][col],x=120+col*240,y=105+row*200;sprites.death(pc,{i:[0,2,3][row],x,y,age,life:.72-age,secret:false},0);pc.fillStyle='#c8d9d9';pc.font='11px monospace';pc.textAlign='center';pc.fillText(['Simit','Sucuk','Messingkanne'][row]+' · '+Math.round(age*1000)+' ms',x,y+78)}fs.writeFileSync(__dirname+'/previews/explosion-phases.png',phases.toBuffer('image/png'));
const bossesArt=createCanvas(1440,600),bc=bossesArt.getContext('2d');bc.fillStyle='#16283d';bc.fillRect(0,0,1440,600);for(let i=0;i<7;i++){const x=185+(i%4)*355,y=150+Math.floor(i/4)*305;sprites.boss(bc,{i,x,y,age:1.2,fire:1,warning:0,parts:sprites.bossLayout(i).map((part,index)=>({...part,hp:index===1?2:5,max:5,flash:index===0?.08:0}))},i>=5);bc.fillStyle='#d9d7be';bc.font='12px monospace';bc.textAlign='center';bc.fillText(['Großwesir','Kaffeesultan','Sucuk-Pascha','Gewürz-Dschinn','Karawanenmeister','Schalke-Fan','Hochofen-Horst'][i],x,y+126)}fs.writeFileSync(__dirname+'/previews/boss-art-gallery.png',bossesArt.toBuffer('image/png'));
const start=performance.now();for(let i=0;i<120;i++){a.update(.016);a.render()}console.log('120 native Canvas-Frames: '+Math.round(performance.now()-start)+' ms (ohne Browser/Display).');
console.log('OK: Welten, Trefferblitze, 10 neue Mutatoren, Gefahrensymbole und beide Ruhrpott-Level mit echtem Canvas gerendert.');

})().catch(error=>{console.error(error);process.exitCode=1});
