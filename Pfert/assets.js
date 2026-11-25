/* Optional original raster assets, with a code-drawn fallback for loading failures. */
const PfertAssets=(()=>{
 const frames=[{"x":32,"y":48,"w":247,"h":243},{"x":316,"y":26,"w":305,"h":279},{"x":657,"y":43,"w":254,"h":245},{"x":963,"y":12,"w":272,"h":285},{"x":8,"y":342,"w":297,"h":225},{"x":341,"y":326,"w":243,"h":282},{"x":617,"y":338,"w":327,"h":267},{"x":979,"y":317,"w":245,"h":291},{"x":24,"y":654,"w":260,"h":222},{"x":313,"y":629,"w":309,"h":255},{"x":636,"y":636,"w":294,"h":251},{"x":952,"y":652,"w":297,"h":225},{"x":1,"y":913,"w":313,"h":319},{"x":317,"y":911,"w":310,"h":319},{"x":626,"y":947,"w":299,"h":284},{"x":940,"y":905,"w":314,"h":327}];
 const effectFrames=[{"x":0,"y":0,"w":314,"h":314},{"x":314,"y":0,"w":313,"h":314},{"x":627,"y":0,"w":314,"h":314},{"x":941,"y":0,"w":313,"h":314},{"x":0,"y":314,"w":314,"h":313},{"x":314,"y":314,"w":313,"h":313},{"x":627,"y":314,"w":314,"h":313},{"x":941,"y":314,"w":313,"h":313},{"x":0,"y":627,"w":314,"h":314},{"x":314,"y":627,"w":313,"h":314},{"x":627,"y":627,"w":314,"h":314},{"x":941,"y":627,"w":313,"h":314},{"x":0,"y":941,"w":314,"h":313},{"x":314,"y":941,"w":313,"h":313},{"x":627,"y":941,"w":314,"h":313},{"x":941,"y":941,"w":313,"h":313}];
 const rareFrames={
  fan:{x:19,y:13,w:104,h:104},dive:{x:139,y:13,w:128,h:109},aim:{x:282,y:13,w:121,h:104},
  split:{x:427,y:26,w:94,h:90},arc:{x:547,y:13,w:124,h:104},cross:{x:5,y:159,w:131,h:80},
  mine:{x:136,y:162,w:132,h:83},pulse:{x:310,y:140,w:98,h:123},
  lanes:{x:408,y:156,w:132,h:86},scissor:{x:571,y:143,w:79,h:117}
 };
 const blockerFrames={
  carpet:{x:4,y:30,w:230,h:109},lantern:{x:325,y:2,w:69,h:156},
  bird:{x:3,y:166,w:234,h:135},barge:{x:240,y:166,w:238,h:140}
 };
 const workshopFrames=[
  {x:68,y:119,w:323,h:241},{x:489,y:97,w:353,h:286},{x:908,y:94,w:397,h:296},{x:1401,y:59,w:323,h:331},
  {x:29,y:539,w:398,h:259},{x:490,y:530,w:352,h:271},{x:932,y:496,w:350,h:327},{x:1419,y:510,w:265,h:290}
 ];
 const workshopBossFrames=[{x:190,y:29,w:719,h:665},{x:1152,y:99,w:955,h:546}];
 const caravanBossFrames=[{x:85,y:81,w:578,h:512},{x:830,y:65,w:479,h:560},{x:1468,y:80,w:638,h:534}];
 const foregroundFrames=[
  {x:94,y:155,w:708,h:192},{x:945,y:156,w:776,h:177},
  {x:32,y:566,w:798,h:217},{x:932,y:577,w:788,h:205}
 ];
 const landmarkFrames={
  zweckel:{x:72,y:82,w:1109,h:554},kopatz:{x:1302,y:264,w:835,h:371}
 };
 const images={},failures=[];
 const manifest={horse:'assets/horse-v3.png',characters:'assets/characters-v2.png',rareEnemies:'assets/rare-enemies-v2.png',blockers:'assets/blockers-v2.png',
  workshop:'assets/gegner-ruhr-maschinen-v1.png',workshopBosses:'assets/bosse-maschinen-v1.png',caravanBosses:'assets/bosse-karawane-v1.png',
  city:'assets/bosporus-v1.png',cityMiddle:'assets/bosporus-mittelgrund-v1.png',cityNear:'assets/bosporus-vordergrund-v1.png',
  bazaar:'assets/basar-v1.png',desert:'assets/wuestenpass-v1.png',strait:'assets/bosporus-ueberfahrt-v1.png',palace:'assets/palast-morgenrot-v1.png',
  industry:'assets/ruhrgebiet-v1.png',industryNight:'assets/ruhrgebiet-nachtschicht-v1.png',ruhrShops:'assets/ruhrpott-buden-v1.png',
  foreground:'assets/kulissen-vordergrund-v1.png',ruhrLandmarks:'assets/ruhrpott-fassaden-v2.png',
  effects:'assets/effects-v1.png',projectiles:'assets/player-projectiles-v2.png'};
 function load(id,path){return new Promise(resolve=>{if(typeof Image!=='function'){failures.push(id);resolve(false);return}const image=new Image();image.onload=()=>{images[id]=image;resolve(true)};image.onerror=()=>{failures.push(id);resolve(false)};image.src=path})}
 const ready=Promise.all(Object.entries(manifest).map(([id,path])=>load(id,path)));
 return {frames,effectFrames,rareFrames,blockerFrames,workshopFrames,workshopBossFrames,caravanBossFrames,foregroundFrames,landmarkFrames,
  ready,get:id=>images[id]||null,get failures(){return [...failures]}};
})();
