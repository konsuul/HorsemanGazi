/* Original pixel artwork. Each material uses stepped light, midtone and shadow palettes. */
const PfertArt = (() => {
 'use strict';
 let g;
 const cache=new Map(), ink='#292536', gold=['#fff2b7','#eac46e','#ba824b','#72513d'], brass=['#fff0a2','#ddb85b','#a97940','#604535'], cream=['#fff6dd','#e4cb9e','#b18a69','#725342'];
 const box=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(Math.round(x),Math.round(y),w,h)};
 function poly(points,col,outline=0){g.fillStyle=col;g.beginPath();points.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fill();if(outline){g.strokeStyle=ink;g.lineWidth=outline;g.lineJoin='bevel';g.stroke()}}
 function oval(x,y,rx,ry,pal,outline=true){
  for(let yy=-ry;yy<=ry;yy+=2){let xx=Math.floor(rx*Math.sqrt(Math.max(0,1-yy*yy/(ry*ry))));if(!xx)continue;box(x-xx,y+yy,xx*2,2,outline?(pal.every(col=>col===pal[0])?pal[0]:ink):pal[1]);if(xx>2){let shade=yy< -ry*.25?pal[0]:yy<ry*.25?pal[1]:yy<ry*.65?pal[2]:pal[3];box(x-xx+2,y+yy,xx*2-4,2,shade);if(yy<ry*.3&&xx>7)box(x-xx+3,y+yy,3,2,pal[0])}}
 }
 function stipple(x,y,w,h,light,shadow,seed=0){for(let yy=0;yy<h;yy+=3)for(let xx=0;xx<w;xx+=4){const n=(xx*7+yy*13+seed*11)%17;if(n<3)box(x+xx,y+yy,1,1,light);else if(n>14)box(x+xx,y+yy,2,1,shadow)}}
 function glint(x,y,col='#fff3bf'){box(x-4,y,9,1,col);box(x,y-4,1,9,col);box(x-1,y-1,3,3,col)}
 function eye(x,y,angry=false){box(x-1,y-1,7,7,ink);box(x,y,5,5,'#fff1cf');box(x,y+2,2,3,'#3c2730');if(angry)poly([[x-1,y-2],[x+7,y+1],[x+7,y+3],[x-1,y]],ink)}
 function carpet(y=12,weapon=false){
  poly([[-30,y],[-17,y-7],[29,y-3],[34,y+5],[19,y+12],[-27,y+7]],'#582e4e',2);
  poly([[-26,y],[-15,y-4],[27,y],[26,y+5],[-22,y+4]],'#be5970');
  poly([[-20,y],[-13,y-2],[19,y+1],[17,y+4],[-18,y+2]],'#f1c47e');
  poly([[-7,y],[0,y-2],[9,y+1],[0,y+4]],'#594f6a');
  for(let x=-23;x<28;x+=9){box(x,y+6,3,5,'#d4a35f');box(x,y+5,2,2,'#ffdf9b')}
  if(weapon){poly([[-22,-2],[-43,-8],[-47,-4],[-25,6]],'#fff3cb',2);box(-35,-4,12,2,'#7b91a4');box(-24,-3,4,11,'#dcaa62')}
 }
 function rider(weapon=false){
  carpet(15,weapon);poly([[-15,11],[-14,-5],[-7,-12],[8,-9],[17,10],[7,15]],'#426b74',2);box(-11,-5,4,14,'#79a4a0');box(5,-5,8,13,'#294a60');
  oval(-2,-17,11,12,['#ffe4b4','#e6b77e','#b67e57','#704e44']);
  oval(-3,-26,13,7,cream);box(-14,-26,24,3,'#fff5d7');box(6,-28,8,5,'#a48c7b');
  poly([[-11,-10],[-6,-4],[2,-1],[8,-9]],'#453039');eye(-8,-18,true);box(2,-13,5,2,'#633c3b');
  box(-9,9,22,4,'#ca9559');box(-3,9,4,5,'#f4d187');stipple(-10,-2,17,10,'#94b0a6','#324b60',2);for(let j=0;j<5;j++){box(-12+j*4,-28,2,1,'#b9a58e');box(-18+j*10,16,4,1,'#fff1bd')}box(-6,-9,3,2,'#fff0ce');
 }
 function sausage(double=false,golden=false){
  const pal=golden?gold:['#e8a481','#bc5a48','#873b3d','#4e2937'];
  if(double){oval(6,9,24,12,pal);poly([[-18,8],[-25,4],[-26,13]],pal[2],2)}
  oval(-1,-4,27,13,pal);poly([[-26,-6],[-33,-12],[-34,2],[-26,-1]],pal[2],2);poly([[25,-6],[32,-12],[34,1],[26,-1]],pal[2],2);
  for(let i=0;i<6;i++){let x=-20+i*8;box(x,-8+(i%2)*5,3,2,pal[0]);box(x+2,-2+(i%3)*3,2,2,'#f3c79c')}
  box(-19,-14,30,2,pal[0]);eye(-12,-6,true);eye(-2,-6,true);box(-9,3,9,2,'#4c2631');
  stipple(-21,-9,40,15,pal[0],pal[3],4);for(let j=0;j<4;j++){poly([[-17+j*11,-12],[-14+j*11,-10],[-12+j*11,-6]],pal[2]);box(-16+j*11,-12,2,1,pal[0])}box(-27,-6,2,8,'#d29976');box(26,-6,2,8,'#e6b18d');
  if(double){box(-1,7,3,4,'#fff2ba');box(8,9,3,3,'#fff2ba')}
 }
 function pot(armored=false){
  const p=armored?['#d6e4db','#9ca9a4','#5f7374','#3d4b57']:brass;
  poly([[14,-11],[27,-23],[30,-20],[26,-3],[16,4]],p[1],3);poly([[19,-10],[25,-17],[25,-10],[18,-1]],p[0]);
  oval(-22,-2,13,17,p);g.globalCompositeOperation='destination-out';oval(-23,-3,7,10,['#000','#000','#000','#000']);g.globalCompositeOperation='source-over';
  oval(-2,2,24,23,p);box(-19,-10,6,21,p[0]);box(13,0,5,14,p[3]);
  oval(-2,-19,18,6,p);box(-7,-27,10,7,p[2]);box(-6,-28,7,3,p[0]);box(-14,23,5,5,p[3]);box(10,23,5,5,p[3]);
  if(armored){poly([[-22,-19],[-16,-30],[9,-33],[22,-22],[17,-17]],'#71536e',2);box(-16,-25,30,3,'#b3949a');poly([[-5,-32],[0,-43],[5,-32]],'#d9565d',2);for(let y=-4;y<15;y+=8)box(14,y,3,3,'#e4cf9e')}
  stipple(-16,-8,30,25,p[0],p[3],3);for(let j=0;j<3;j++){box(-17+j*12,15,8,1,p[3]);box(-15+j*12,14,5,1,p[0])}poly([[7,-15],[12,-12],[10,-5]],p[0]);box(-10,-22,17,1,p[0]);eye(-11,-1,true);eye(1,-1,true);box(-7,10,11,3,'#665245');
 }
 function bat(frame=0){
  const f=frame%2?4:-3;
  poly([[-6,0],[-16,-15-f],[-34,-17-f],[-29,-4],[-21,-4],[-18,7],[-11,5],[-5,14]],'#4d3c66',2);
  poly([[6,0],[16,-15-f],[34,-17-f],[29,-4],[21,-4],[18,7],[11,5],[5,14]],'#4d3c66',2);
  poly([[-12,-1],[-20,-10-f],[-29,-12-f],[-22,-1],[-16,1]],'#967595');poly([[12,-1],[20,-10-f],[29,-12-f],[22,-1],[16,1]],'#967595');
  oval(0,2,11,14,['#c1a3ad','#796083','#4b3f65','#2d304c']);poly([[-10,-6],[-10,-20],[-2,-11]],'#775c80',2);poly([[10,-6],[10,-20],[2,-11]],'#775c80',2);
  eye(-7,-3,true);eye(2,-3,true);box(-3,6,2,5,'#fff4d7');box(3,6,2,5,'#fff4d7');
 }
 function vortex(){
  for(let i=0;i<7;i++){let y=-24+i*8,w=24-i*2;oval(Math.sin(i)*4,y,w,6,i%2?['#e5c98f','#bf8a65','#846279','#4f465f']:['#f8de9b','#d5ab66','#a76d53','#71515a'])}
  eye(-12,-12,true);eye(0,-12,true);for(let i=0;i<7;i++)box(-24+i*8,-31+(i%3)*4,2,3,'#edc46c');
 }
 function camel(){
  const p=['#f6d19b','#d6a46f','#a47558','#674b48'];
  oval(-2,7,30,17,p);oval(-12,-4,12,14,p);oval(10,-4,13,15,p);
  poly([[17,5],[20,-21],[28,-26],[33,-21],[30,8]],p[1],3);oval(30,-23,11,8,p);box(24,-30,3,8,p[0]);box(34,-18,8,3,p[3]);
  for(const x of [-20,-5,11,24]){poly([[x,15],[x+5,15],[x+1,29],[x-5,27]],p[2],2);box(x-4,26,7,3,ink)}
  poly([[-25,-3],[-8,-10],[16,-7],[23,5],[12,13],[-20,10]],'#617575',2);box(-21,0,32,3,'#a8b6aa');box(-15,4,24,3,'#82978c');
  for(let i=0;i<4;i++){box(-20+i*10,7,3,3,'#edd3a1');box(-20+i*10,7,1,1,'#fff9d3');poly([[-21+i*9,-1],[-15+i*9,0],[-17+i*9,5]],'#475e68')}stipple(-22,-1,36,10,'#bcc2a6','#3f5363',7);eye(28,-25,true);box(-34,6,7,3,p[3]);
 }
 function simit(){
  oval(0,0,22,22,['#ffdfa0','#cf9556','#9c603c','#613e38']);
  g.globalCompositeOperation='destination-out';oval(0,0,9,10,['#000','#000','#000','#000']);g.globalCompositeOperation='source-over';
  for(let i=0;i<18;i++){let a=i*.35;box(Math.cos(a)*15-1,Math.sin(a)*16-1,i%2?3:2,2,i%3?'#ffedbc':'#8d573e')}
  eye(-10,-14,true);eye(3,-14,true);
 }
 function makeSprite(key,draw,size=104){
  if(!cache.has(key)){const off=document.createElement('canvas');off.width=size;off.height=size;const old=g;g=off.getContext('2d');g.imageSmoothingEnabled=false;g.translate(size/2,size/2);g.scale(1.3,1.3);draw();g=old;cache.set(key,off)}return cache.get(key);
 }
 function rasterSprite(index,size=104){
  if(typeof PfertAssets==='undefined')return null;const image=PfertAssets.get('characters'),rect=PfertAssets.frames[index];if(!image||!rect)return null;
  const key='raster-'+index+'-'+size;if(cache.has(key))return cache.get(key);const off=document.createElement('canvas');off.width=size;off.height=size;const c=off.getContext('2d');c.imageSmoothingEnabled=false;const fit=size===104?86:size*.86,scale=fit/Math.max(rect.w,rect.h),w=Math.round(rect.w*scale),h=Math.round(rect.h*scale);c.drawImage(image,rect.x,rect.y,rect.w,rect.h,Math.round((size-w)/2),Math.round((size-h)/2),w,h);cache.set(key,off);return off;
 }
 function enemySprite(i,theme=0,frame=0,ruhr=false){const raster=rasterSprite(ruhr?[2,15,14,3,4][i%5]:i);if(raster)return raster;return makeSprite('enemy-'+i+'-'+theme+'-'+frame+'-'+ruhr,()=>{
  if(ruhr){if(i===0){oval(0,4,26,10,cream);sausage(false);box(-20,1,40,3,'#dba94d')}else if(i===1){poly([[-25,-16],[24,-16],[18,19],[-20,19]],'#586b70',2);box(-20,-12,40,4,'#91a5a4');for(let j=0;j<7;j++)oval(-16+j*5,-14+(j%2)*3,5,4,['#5d6466','#424b54','#273442','#202733']);oval(-17,22,6,6,brass);oval(17,22,6,6,brass)}else if(i===2){rider();box(-15,-5,29,11,'#376ca5');box(-12,0,23,3,'#f3eadc')}else if(i===3){pot();box(-17,-11,30,4,'#fff0c6')}else bat(frame);return}
  if(i===0)simit();else if(i===1||i===6)rider(i===6);else if(i===2||i===8)sausage(i===8);else if(i===3||i===7)pot(i===7);else if(i===4)bat(frame);else if(i===5)vortex();else camel();
  if(i===1||i===6){for(let j=0;j<4;j++){box(-18+j*10,18,3,2,'#fff1b5');box(-13+j*8,1,2,2,'#d4aa76')}box(-7,-28,7,2,'#d6bb98');box(-10,-8,2,4,'#c4a27f')}
  if(i===2||i===8){for(let j=0;j<5;j++){box(-18+j*8,-9,2,4,'#d87565');box(-16+j*8,-1,2,2,'#ffd1a5')}box(23,-7,2,7,'#713746')}
  if(i===3||i===7){for(let j=-1;j<2;j++){poly([[j*8-4,8],[j*8,5],[j*8+4,8],[j*8,12]],'#745c49');box(j*8-1,7,2,2,'#e6ca82')}box(-13,-18,22,2,'#f4e2a1')}
  if(i===4){for(const side of [-1,1])poly([[side*11,-3],[side*19,-11],[side*26,-12],[side*17,-5]],'#b08ba5')}
  if(i===9){for(let j=0;j<4;j++){box(-21+j*9,1,3,4,'#d9d3b6');box(-20+j*9,1,1,2,'#fff0bd')}box(21,-15,3,14,'#ebc18c')}
  const accent=['#f6db98','#eeb18b','#beb4e7','#a6e2d7','#efcad2'][theme];
  if(theme>0){glint(i===3?-6:12,-23,accent);if(i===1||i===6){box(-13,6,22,2,accent)}if(i===7||i===9){box(-10,2,5,5,accent)}}
 })}
 function horseSprite(frame){
  // Both wing poses share a fixed crop and scale, keeping the body steady during flight.
  const pose=frame%4<2?0:1,image=typeof PfertAssets!=='undefined'&&PfertAssets.get('horse');
  if(image){
   const key='horse-v2-'+pose;
   if(!cache.has(key)){const off=document.createElement('canvas');off.width=104;off.height=104;const c=off.getContext('2d');c.imageSmoothingEnabled=false;c.drawImage(image,pose*336,0,336,264,3,13,98,77);cache.set(key,off)}
   return cache.get(key);
  }
  const raster=rasterSprite(frame%4<2?10:11);if(raster)return raster;return makeSprite('pfert-'+frame,()=>{
  const p=['#ffedc5','#ebc18c','#bb875e','#75534b'];
  poly([[-17,-6],[-31,-19],[-34,-15],[-28,-7],[-34,-1],[-24,2]],'#79534e',2);
  oval(-4,3,21,12,p);box(-16,7,24,5,p[2]);
  const leg=[-2,1,4,1][frame%4];poly([[-17,10],[-21,19+leg],[-15,20+leg],[-8,12]],p[1],2);poly([[7,11],[15,22-leg],[21,20-leg],[14,9]],p[1],2);box(-22,18+leg,8,4,'#473842');box(16,18-leg,8,4,'#473842');
  poly([[-3,-5],[2,-18],[10,-22],[18,-14],[17,6],[7,10]],p[1],2);box(3,-13,5,17,p[0]);box(13,-10,4,15,p[2]);
  poly([[2,-20],[-3,-33],[2,-35],[10,-22]],p[1],2);poly([[12,-22],[19,-32],[23,-28],[20,-16]],p[1],2);box(0,-31,3,7,'#c78e7c');
  poly([[-3,-16],[-7,-11],[-3,0],[2,-4],[6,-16]],'#805448');box(-4,-15,3,5,'#ae7560');
  oval(17,-6,14,10,p);oval(24,-1,12,7,['#f6c7ae','#d79a85','#ab6c65','#6f4a50']);box(28,-3,3,3,'#69424b');box(20,4,10,3,'#503740');box(21,7,6,7,'#e87e90');box(22,7,2,6,'#ffb4b4');
  oval(9,-15,7,9,['#fffdf0','#fff2d8','#ded9bb','#a89b87']);oval(20,-13,6,8,['#fffdf0','#fff2d8','#ded9bb','#a89b87']);box(11,-14,3,4,'#343048');box(17,-17,3,4,'#343048');box(8,-24,3,2,'#75524e');box(23,-22,4,2,'#75524e');
  const wing=[-7,-1,5,-1][frame%4];poly([[-15,-2],[-24,-13+wing],[-20,-17+wing],[-16,-14+wing],[-15,-22+wing],[-10,-19+wing],[-7,-12+wing],[0,-8]],'#f4e9c9',2);box(-17,-13+wing,4,4,'#fffbe4');box(-11,-11+wing,4,3,'#cabfa7');
  stipple(-17,0,27,8,'#fff2ca','#ca996d',1);box(-14,0,5,1,'#fff2cf');box(-10,1,3,1,'#f8deb2');box(28,1,3,2,'#e8a58f');box(10,-19,2,2,'#fff');box(20,-15,2,2,'#fff');box(23,8+frame%2,2,6,'#ffb4be');
  box(0,-3,15,3,'#ab5074');box(2,0,11,3,'#e69a9d');poly([[0,-2],[-12,-5],[-18,-2],[-7,2]],'#c25f7b');
 },104)}
 function placeSprite(ctx,sprite,x,y,scale=1){ctx.imageSmoothingEnabled=false;ctx.drawImage(sprite,Math.round(x-sprite.width*scale/2),Math.round(y-sprite.height*scale/2),Math.round(sprite.width*scale),Math.round(sprite.height*scale))}
 function glow(ctx,x,y,r,col){ctx.save();ctx.globalCompositeOperation='lighter';const light=ctx.createRadialGradient(x,y,0,x,y,r);light.addColorStop(0,col);light.addColorStop(.25,col);light.addColorStop(1,col.slice(0,7)+'00');ctx.fillStyle=light;ctx.fillRect(x-r,y-r,r*2,r*2);ctx.restore()}
 function label(ctx,str,x,y,size=12,col='#fff0c5',align='left'){ctx.fillStyle=col;ctx.font='bold '+size+'px monospace';ctx.textAlign=align;ctx.fillText(str,x,y)}

 const themes=[
  {sky:['#394a76','#b47988','#edb986'],far:'#88758b',stone:['#ffe2ac','#dfb27e','#b17a68','#744e60'],roof:['#a8d5cc','#5b9997','#3d6c7e','#304b66'],accent:'#d19b76'},
  {sky:['#514465','#b26f75','#efb379'],far:'#99728b',stone:['#f5d5a0','#ce9c75','#9f6e63','#6c4a5c'],roof:['#f0c28c','#ad6877','#7b4b6a','#503e59'],accent:'#edc485'},
  {sky:['#17263f','#394a70','#9b7b8b'],far:'#4a526f',stone:['#b9bdd0','#858ba9','#5b647f','#3b435f'],roof:['#9cadd2','#65799f','#475c83','#2c3d62'],accent:'#d9c9b2'},
  {sky:['#315e7c','#77abae','#cbd6be'],far:'#6f9ca7',stone:['#f3deb3','#c7b69d','#9a8b88','#626877'],roof:['#bde4ce','#78b6ac','#4e8c91','#346b7c'],accent:'#d0d8b4'},
  {sky:['#5b466f','#be8a9c','#f3caa6'],far:'#9b7f9e',stone:['#fff0d0','#e4ccb0','#ba9aa2','#846c87'],roof:['#dfc8e5','#ac91ba','#826b9b','#574e7e'],accent:'#f2d7b2'}
 ];
 function dome(x,y,r,pal){oval(x,y,r,r*.65,pal);box(x-r,y,r*2,9,pal[2]);box(x-r+3,y,5,8,pal[0]);box(x+r-7,y,5,8,pal[3]);box(x-2,y-r*.65-12,3,13,gold[1]);box(x-5,y-r*.65-14,9,3,gold[0]);for(let i=-r+12;i<r-5;i+=12)box(x+i,y+2,3,4,pal[1])}
 function arch(x,y,w,h,stone,fill){
  box(x,y,w,h,stone[3]);box(x+3,y+2,w-6,h-2,stone[1]);box(x+4,y+2,4,h-2,stone[0]);box(x+w-9,y+5,5,h-5,stone[2]);
  const ix=x+12,iw=w-24,top=y+15;
  poly([[ix,y+h],[ix,top+iw*.4],[ix+iw*.1,top+iw*.17],[ix+iw*.5,top-6],[ix+iw*.9,top+iw*.17],[ix+iw,top+iw*.4],[ix+iw,y+h]],fill);
  for(let j=0;j<h;j+=18){box(x+1,y+j,10,2,stone[2]);box(x+w-12,y+j+8,10,2,stone[3])}
  for(let j=0;j<4;j++){box(x+15+j*(w-30)/3,y+6,3,3,stone[0])}
 }
 function window(x,y,pal,lit=false){arch(x,y,18,30,pal,lit?'#efcb87':'#4b4a64');box(x+8,y+13,2,17,pal[2]);box(x+6,y+19,6,2,pal[2])}
 function lantern(x,y,pal){box(x,y-27,1,23,pal[3]);poly([[x-6,y],[x-4,y-5],[x+4,y-5],[x+6,y],[x+4,y+12],[x-4,y+12]],pal[3]);box(x-3,y-1,6,11,'#eecb8c');box(x-1,y,2,9,'#fff0b4');box(x-5,y+12,10,2,gold[2]);glint(x,y+17,gold[1])}
 function ornamentalBand(x,y,w,pal){box(x,y,w,13,pal[3]);box(x,y,w,2,pal[0]);box(x,y+11,w,2,pal[2]);for(let j=5;j<w-8;j+=20){poly([[x+j,y+6],[x+j+5,y+2],[x+j+10,y+6],[x+j+5,y+10]],pal[1]);box(x+j+4,y+5,3,3,pal[0])}}
 function scenery(theme,layer){
  const key='scene-'+theme+'-'+layer;if(cache.has(key))return cache.get(key);
  const off=document.createElement('canvas');off.width=1200;off.height=540;const old=g;g=off.getContext('2d');const q=themes[theme];
  if(layer===0){
   for(let i=0;i<7;i++){const x=i*190+20,y=345+(i%3)*17;box(x,y,172,195,q.far);oval(x+85,y,83,52,[q.far,q.far,q.far,q.far]);box(x+22,y-108,10,110,q.far);box(x+19,y-115,16,9,q.far);poly([[x+18,y-117],[x+27,y-143],[x+36,y-117]],q.far);box(x+142,y-60,8,66,q.far)}
  }else if(layer===1){
   for(let i=0;i<5;i++){const x=i*250-10,y=410+(i%2)*23;
    box(x,y,220,130,q.stone[2]);box(x+2,y,7,130,q.stone[0]);box(x+191,y,29,130,q.stone[3]);
    dome(x+106,y-2,83,q.roof);ornamentalBand(x,y+8,220,q.stone);
    for(let j=0;j<5;j++)window(x+16+j*37,y+28,q.stone,theme===2||j%3===1);
    box(x+8,y+69,179,3,q.stone[0]);
    if(i%2===0){box(x-1,y-146,16,150,q.stone[2]);box(x,y-145,4,146,q.stone[0]);box(x-8,y-137,29,7,q.stone[0]);box(x-8,y-129,29,5,q.stone[3]);poly([[x-5,y-148],[x+8,y-180],[x+20,y-148]],q.roof[2]);box(x+6,y-186,3,10,gold[1])}
   }
  }else{
   // Different landmark at each third of the tile: gates, market stalls, tiled terraces.
   for(let i=0;i<3;i++){const x=220+i*370;poly([[x,61],[x+20,61],[x+15,69],[x+5,69]],q.stone[2]);lantern(x+10,99+(i%2)*24,q.stone)}
   arch(70,362,102,178,q.stone,q.stone[3]);dome(121,361,53,q.roof);ornamentalBand(65,400,112,q.roof);lantern(121,425,q.stone);
   box(350,467,182,73,q.stone[3]);box(355,470,170,70,q.stone[1]);
   for(let j=0;j<9;j++){poly([[348+j*21,451],[355+j*21,438],[372+j*21,451],[372+j*21,465],[348+j*21,465]],j%2?q.roof[2]:q.stone[0]);box(349+j*21,464,22,4,j%2?q.roof[3]:q.stone[2])}
   for(let j=0;j<8;j++){oval(365+j*19,490+(j%2)*7,8,6,['#e9c28a','#c78d66','#945b54','#603e4e']);box(360+j*19,503,13,8,q.roof[2])}
   box(355,512,171,6,q.stone[0]);
   box(690,471,213,69,q.roof[3]);ornamentalBand(688,472,217,q.roof);
   for(let j=0;j<10;j++)poly([[695+j*21,508],[704+j*21,493],[713+j*21,508],[704+j*21,523]],j%2?q.roof[1]:q.roof[2]);
   for(let j=0;j<6;j++){const x=970+j*32;box(x,499,6,41,q.stone[3]);box(x+1,499,2,41,q.stone[0]);dome(x+3,495,12,q.roof)}
  }
  g=old;cache.set(key,off);return off;
 }
 function paintedLayer(ctx,id,theme,time){
  if(typeof PfertAssets==='undefined')return false;const image=PfertAssets.get(id);if(!image)return false;const key='panorama-'+id;
  if(!cache.has(key)){const off=document.createElement('canvas');off.width=2400;off.height=675;const c=off.getContext('2d');c.imageSmoothingEnabled=false;c.drawImage(image,0,0,1200,675);c.save();c.translate(2400,0);c.scale(-1,1);c.drawImage(image,0,0,1200,675);c.restore();c.globalCompositeOperation='destination-in';const mask=c.createLinearGradient(0,0,0,675);mask.addColorStop(0,'#00000000');mask.addColorStop(.3,'#00000022');mask.addColorStop(.55,'#000000ff');mask.addColorStop(1,'#000000ff');c.fillStyle=mask;c.fillRect(0,0,2400,675);cache.set(key,off)}
  const tile=cache.get(key),x=-Math.round((time*(id==='city'?7:10))%2400);ctx.save();ctx.globalAlpha=id==='city'?.82:.92;ctx.drawImage(tile,x,-135);ctx.drawImage(tile,x+2400,-135);ctx.restore();
  ctx.save();ctx.fillStyle=id==='city'?['#af6d5e10','#b77b5a18','#0f244c3b','#35798a16','#9f668b22'][theme]:theme===2?'#082d4a3c':'#9d6e571c';ctx.fillRect(0,62,960,478);ctx.restore();return true;
 }
 function industrialScene(ctx,time,type){
  const backgroundId=type===2?'industryNight':'industry';if(typeof PfertAssets==='undefined'||!PfertAssets.get(backgroundId))return false;g=ctx;const sky=ctx.createLinearGradient(0,0,0,540);sky.addColorStop(0,type===2?'#101e36':'#364252');sky.addColorStop(1,type===2?'#47616b':'#8a7c79');ctx.fillStyle=sky;ctx.fillRect(0,0,960,540);paintedLayer(ctx,backgroundId,type,time);
  const x=((time*24)%1300);if(type===2){box(0,528,960,12,'#1a2d3e');box(0,533,960,7,'#a06641');for(let i=0;i<18;i++)box((i*63+time*30)%1000,534,23,2,'#f3cc8f');glow(ctx,730,520,100,'#f8994f24')}else{box(0,533,960,7,'#27394b');const sx=990-x;box(sx,464,123,59,'#314453');box(sx-6,458,135,8,'#bdb598');box(sx+5,471,113,17,'#7a4444');label(ctx,'CURRYWURST',sx+61,483,10,'#f1d4a0','center');for(let i=0;i<3;i++)window(sx+12+i*34,493,cream,true)}return true;
 }
 function background(ctx,theme,time,ruhr){
  g=ctx;if(ruhr){if(!industrialScene(ctx,time,ruhr)){if(ruhr===2)nightshift(ctx,time);else ruhrBackground(ctx,time)}haze(ctx,time,ruhr);return}const q=themes[theme];
  const gradient=g.createLinearGradient(0,0,0,540);q.sky.forEach((col,i)=>gradient.addColorStop(i/2,col));g.fillStyle=gradient;g.fillRect(0,0,960,540);
  const sunX=745;glow(g,sunX,130,68,theme===2?'#cad8ff0c':'#ffcd9818');oval(sunX,130,42,42,theme===2?['#fff5ce','#eee4be','#c9c4b9','#9b9eac']:['#fff5cb','#ffe0a2','#f3bd87','#dd9c7b'],false);
  if(theme===2){g.fillStyle=q.sky[0];g.beginPath();g.arc(sunX+16,117,36,0,7);g.fill();for(let i=0;i<47;i++){box((i*137+53)%960,82+(i*83)%210,i%4===0?2:1,2,'#eee5d5')}}
  for(let i=0;i<4;i++){const x=((i*290-time*6+29000)%1160)-120;box(x,140+(i%2)*48,90,3,'#ffead51a');box(x+15,135+(i%2)*48,50,3,'#ffead51a')}
  const painted=paintedLayer(ctx,'city',theme,time);
  for(let layer=0;layer<3;layer++){if(painted)continue;const tile=scenery(theme,layer),x=-((time*[10,23,39][layer])%1200);g.save();g.globalAlpha=[.46,.63,.66][layer];g.drawImage(tile,Math.round(x),0);g.drawImage(tile,Math.round(x+1200),0);g.restore()}
  if(theme===3){box(0,516,960,24,'#43888e');for(let i=0;i<20;i++)box((i*73-time*40+14600)%1020-30,520+(i%3)*5,26,2,'#b8d6b3')}
  else{box(0,533,960,7,q.stone[3]);box(0,533,960,2,q.stone[0])}
  haze(ctx,time,0);
 }
 function haze(ctx,time,ruhr){
  ctx.save();const fog=ctx.createLinearGradient(0,70,0,540);fog.addColorStop(0,ruhr===2?'#1b354b2e':'#263f5666');fog.addColorStop(.6,ruhr===2?'#39586c55':'#607f947c');fog.addColorStop(1,'#314e6668');ctx.fillStyle=fog;ctx.fillRect(0,62,960,478);
  for(let i=0;i<3;i++){const x=((time*10+i*390)%1400)-220,y=200+i*92;ctx.save();ctx.translate(x,y);ctx.scale(1,.34);const cloud=ctx.createRadialGradient(0,0,0,0,0,210);cloud.addColorStop(0,'#9ab9c023');cloud.addColorStop(1,'#acc1bf00');ctx.fillStyle=cloud;ctx.fillRect(-210,-210,420,420);ctx.restore()}ctx.restore();
 }
 function nightshift(ctx,time){
  g=ctx;const sky=g.createLinearGradient(0,0,0,540);sky.addColorStop(0,'#101f36');sky.addColorStop(.7,'#28455b');sky.addColorStop(1,'#796259');g.fillStyle=sky;g.fillRect(0,0,960,540);
  for(let i=0;i<4;i++){const x=((i*310-time*13+31000)%1240)-130;box(x,315,210,225,'#253c50');poly([[x+20,320],[x+38,230],[x+80,190],[x+125,230],[x+145,320]],'#314c60');box(x+40,227,9,95,'#587084');box(x+120,227,9,95,'#152c40');box(x+65,150,28,85,'#334b5b');box(x+63,145,32,8,'#79919a');for(let j=0;j<5;j++){const y=130-j*16;glow(ctx,x+78+Math.sin(time+j)*7,y,18+j*5,'#9eb3b41a')}for(let j=0;j<4;j++){box(x+25+j*42,353,18,8,'#a66f55');box(x+27+j*42,354,13,3,'#e2b07a')}}
  for(let i=0;i<4;i++){const x=((i*300-time*28+30000)%1200)-170;
   poly([[x+25,530],[x+38,445],[x+66,400],[x+127,400],[x+154,445],[x+168,530]],'#31485b',3);box(x+62,395,70,11,'#94a6a5');box(x+58,409,5,85,'#738b94');box(x+132,409,13,85,'#1c3149');
   box(x+86,420,30,45,'#111f34');glow(ctx,x+101,448,55,'#ff8c4033');box(x+90,423,22,36,'#cd794c');box(x+95,429,12,25,'#ffe7a0');
   box(x-28,340,12,200,'#345264');box(x-26,341,3,194,'#6d939d');box(x-34,332,212,12,'#365266');box(x-32,333,205,3,'#91b1b0');box(x+135,344,2,59,'#7a9a9b');poly([[x+126,400],[x+144,400],[x+139,412],[x+131,412]],'#a6b3aa');
   for(let j=0;j<8;j++){box(x-10+j*26,485,22,8,'#25384a');box(x-8+j*26,486,18,2,'#8a8f85')}
  }
  box(0,520,960,20,'#222f43');box(0,527,960,10,'#ad5b3c');for(let i=0;i<20;i++){const x=((i*60+time*43)%1200)-60;box(x,530,29,3,'#ffd08c');box(x+9,528,9,2,'#fff1bf')}
  box(32,412,127,28,'#172e42');box(34,414,123,2,'#75c6c5');label(ctx,'NACHTSCHICHT',96,430,12,'#b9eadb','center');
 }
 function ruhrBackground(ctx,time){
  g=ctx;const gr=g.createLinearGradient(0,0,0,540);gr.addColorStop(0,'#3b4e66');gr.addColorStop(1,'#b4aaa0');g.fillStyle=gr;g.fillRect(0,0,960,540);
  oval(755,135,38,38,['#e1d6ad','#c7bc99','#a7a595','#7d8992']);
  for(let i=0;i<7;i++){const x=((i*190-time*14+19000)%1330)-130;box(x,350,145,190,'#5e6b76');box(x+20,222,22,140,'#5e6b76');box(x+22,222,5,140,'#8b9292');box(x+18,216,26,6,'#374c5c');for(let j=0;j<4;j++){oval(x+31+j*13,201-j*13,15+j*2,12,['#b8b6ac','#a4a5a0','#929ca0','#82929a'])}}
  for(let i=0;i<5;i++){const x=((i*260-time*30+26000)%1300)-100;
   box(x+20,310,8,230,'#334657');box(x+110,310,8,230,'#334657');box(x+12,298,116,14,'#334657');box(x+24,300,98,3,'#91a3a3');
   poly([[x+25,320],[x+116,510],[x+110,510],[x+20,320]],'#465868');poly([[x+113,320],[x+23,510],[x+30,510],[x+119,320]],'#465868');
   oval(x+65,300,15,15,['#bbc1b3','#839a9a','#597580','#314c61']);
   box(x+145,448,90,92,'#906454');for(let yy=454;yy<540;yy+=10)for(let xx=148;xx<235;xx+=17)box(xx+(yy%20?0:6),yy,12,2,'#c48d6c');
   box(x+140,435,100,14,'#e3cd9d');box(x+143,438,94,8,'#913f40');label(g,'CURRYWURST',x+190,445,8,'#fff3bf','center');window(x+155,470,cream,true);window(x+194,470,cream,true);
  }
  for(let i=0;i<3;i++){const x=((i*390-time*22+39000)%1170)-100;poly([[x-55,530],[x-22,487],[x+13,503],[x+55,530]],'#334759');box(x-7,492,6,3,'#7e8f91')}box(25,390,113,27,'#263f50');label(ctx,'GLÜCK AUF!',81,408,13,'#e7d5a4','center');
  box(0,533,960,7,'#293c4e');
 }
 function whiteMask(sprite){const key='white-'+spriteKey(sprite);if(cache.has(key))return cache.get(key);const off=document.createElement('canvas');off.width=sprite.width;off.height=sprite.height;const c=off.getContext('2d');c.drawImage(sprite,0,0);c.globalCompositeOperation='source-in';c.fillStyle='#fffdf3';c.fillRect(0,0,off.width,off.height);cache.set(key,off);return off}
 const spriteIds=new WeakMap();let nextSpriteId=0;function spriteKey(sprite){if(!spriteIds.has(sprite))spriteIds.set(sprite,++nextSpriteId);return spriteIds.get(sprite)}
 function lightMask(sprite,color){const key='light-'+spriteKey(sprite)+'-'+color;if(cache.has(key))return cache.get(key);const off=document.createElement('canvas');off.width=sprite.width;off.height=sprite.height;const c=off.getContext('2d');c.drawImage(sprite,0,0);c.globalCompositeOperation='source-in';c.fillStyle=color;c.fillRect(0,0,off.width,off.height);cache.set(key,off);return off}
 function enemy(ctx,e,theme,ruhr,light=null){
  const frame=e.i===4?Math.floor(e.age*8)%2:0;const sprite=enemySprite(e.i,theme,frame,ruhr);
  ctx.save();ctx.translate(Math.round(e.x),Math.round(e.y));if([0,2,4,8].includes(e.i)){ctx.scale(1+Math.sin(e.age*5)*.018,1+Math.cos(e.age*5)*.025)}if(e.i===2||e.i===8)ctx.rotate(Math.sin(e.age*3)*.08);
  placeSprite(ctx,sprite,0,0,e.i===9?1:.85);
  if(e.flash>0)placeSprite(ctx,whiteMask(sprite),0,0,e.i===9?1:.85);else if(light&&light.strength>.05){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=light.strength*.3;placeSprite(ctx,lightMask(sprite,light.color),0,0,e.i===9?1:.85)}ctx.restore();
  if(e.elite){g=ctx;poly([[e.x-8,e.y-e.h/2-13],[e.x,e.y-e.h/2-22],[e.x+8,e.y-e.h/2-13],[e.x,e.y-e.h/2-9]],'#ffdf9a',2)}
  if(e.slowTime>0){ctx.save();ctx.strokeStyle='#8ce7ff';ctx.lineWidth=1;ctx.beginPath();ctx.arc(e.x,e.y,e.w*.48,.2,4.9);ctx.stroke();ctx.restore()}
  if(e.hp<e.max){ctx.fillStyle='#302c3a';ctx.fillRect(e.x-16,e.y-e.h/2-10,32,3);ctx.fillStyle='#f0bd7d';ctx.fillRect(e.x-16,e.y-e.h/2-10,32*Math.max(0,e.hp/e.max),2)}
  if(e.warning){label(ctx,'!',e.x-38,e.y-13,19,'#ffe7a0');ctx.save();ctx.strokeStyle='#ffd18a88';ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(e.x-110,e.y);ctx.lineTo(e.x-34,e.y);ctx.stroke();ctx.restore()}
 }
 function horse(ctx,p,time,limit){
  g=ctx;const frame=Math.floor(time*9)%4;const blink=p.inv>0&&Math.floor(p.inv*12)%2;
  if(p.overdrive>0){
   glow(ctx,p.x,p.y,58,'#81eaff55');ctx.save();ctx.strokeStyle='#d6faff99';ctx.lineWidth=1.5;for(let i=0;i<2;i++){ctx.beginPath();ctx.ellipse(p.x,p.y,38+i*6,22+i*5,time*(i?2:-2),0,7);ctx.stroke()}ctx.restore();for(let i=0;i<6;i++){const angle=time*4+i*1.047;glint(p.x+Math.cos(angle)*42,p.y+Math.sin(angle)*31,'#d3f9ff')}
  }
  if(!blink){placeSprite(ctx,horseSprite(frame),p.x,p.y,.67);if(p.charging||p.muzzle>0){ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=p.muzzle>0?.22:.05+Math.min(1,p.charge/limit)*.14;placeSprite(ctx,lightMask(horseSprite(frame),'#b5e9ff'),p.x,p.y,.67);ctx.restore()}}
  if(p.guardFlash>0){ctx.save();ctx.globalAlpha=p.guardFlash/.16;ctx.strokeStyle='#bcefff';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(p.x,p.y,29,25,0,0,7);ctx.stroke();ctx.restore()}

  if(p.effects[2]>0){ctx.save();ctx.strokeStyle='#f9b6dba6';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(p.x,p.y,30,28,Math.sin(time)*.15,0,7);ctx.stroke();ctx.restore()}
  if(p.effects[4]>0){for(let i=0;i<3;i++)glow(ctx,p.x-27-i*13,p.y+Math.sin(time*9+i)*4,5-i,'#86dfff66')}
  if(p.charging){const fill=Math.min(1,p.charge/limit),x=p.x+28,y=p.y-2;glow(ctx,x,y,9+fill*18,'#ffd47730');
   ctx.save();ctx.strokeStyle=fill>=1?'#fff8d3':'#eecf90';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,8+fill*7,-time*5,-time*5+Math.PI*1.5);ctx.stroke();ctx.restore();
   for(let i=0;i<5;i++){const a=time*5+i*1.256,r=24-fill*10;glow(ctx,x+Math.cos(a)*r,y+Math.sin(a)*r,2,'#ffedbb99')}
   ctx.fillStyle='#272e40';ctx.fillRect(p.x-22,p.y-32,44,5);ctx.fillStyle=fill>=1?'#fff8ca':'#f0c476';ctx.fillRect(p.x-20,p.y-31,40*fill,2);
  }
  if(p.muzzle>0){g=ctx;paintEffect(ctx,p.effects[3]>0?13:12,p.x+36,p.y-2,40,0,Math.min(1,p.muzzle/.06));const x=p.x+27;poly([[x-3,p.y-2],[x+15,p.y-10],[x+7,p.y-2],[x+19,p.y+5],[x+2,p.y+3]],'#ffedbe');glow(ctx,x+6,p.y,18,'#ffca7b25')}
 }
 function effectSprite(index,size=128){
  if(typeof PfertAssets==='undefined')return null;const image=PfertAssets.get('effects'),r=PfertAssets.effectFrames&&PfertAssets.effectFrames[index];if(!image||!r)return null;const key='effect-'+index+'-'+size;if(cache.has(key))return cache.get(key);const off=document.createElement('canvas');off.width=size;off.height=size;const c=off.getContext('2d');c.imageSmoothingEnabled=false;c.drawImage(image,r.x,r.y,r.w,r.h,0,0,size,size);cache.set(key,off);return off;
 }
 function paintEffect(ctx,index,x,y,size,angle=0,opacity=1){const sprite=effectSprite(index);if(!sprite)return false;ctx.save();ctx.globalAlpha*=opacity;ctx.translate(Math.round(x),Math.round(y));ctx.rotate(angle);placeSprite(ctx,sprite,0,0,size/128);ctx.restore();return true}
 function explosionSprite(frame,big,metal){const detailed=effectSprite([0,0,1,1,2,2,3,3][frame]+(metal?4:0),big?192:128);if(detailed)return detailed;return makeSprite('blast-'+frame+'-'+big+'-'+metal,()=>{
  const f=frame/7,radius=(big?43:27)*(.28+f),warm=frame<2?['#fff9df','#fff0b0','#f2b771','#bd795e']:frame<5?['#ffe0a2','#e6a06f','#a66a65','#654e65']:metal?['#a8b5bd','#748693','#4d6179','#34465f']:['#b89b9e','#937e90','#655e79','#40455f'];
  for(let i=0;i<9;i++){const angle=i*2.399,x=Math.round(Math.cos(angle)*radius/2)*2,y=Math.round(Math.sin(angle)*radius*.75/2)*2,size=(big?13:9)*(1-f*.48)+(i%3);poly([[x-size,y-size*.4],[x-size*.6,y-size],[x+size*.5,y-size],[x+size,y-size*.3],[x+size*.7,y+size*.7],[x-size*.5,y+size]],warm[3]);poly([[x-size*.8,y-size*.3],[x-size*.5,y-size*.8],[x+size*.4,y-size*.8],[x+size*.8,y],[x+size*.4,y+size*.65],[x-size*.5,y+size*.7]],warm[1]);box(x-size*.4,y-size*.65,size*.7,2,warm[0]);box(x+size*.4,y+size*.2,2,size*.4,warm[2])}
  if(frame<3){const r=(big?24:16)*(1-frame*.16);poly([[-r*1.5,0],[-r*.25,-r*.2],[0,-r],[r*.25,-r*.2],[r*1.5,0],[r*.25,r*.2],[0,r],[-r*.25,r*.2]],'#fff8d4');box(-3,-3,6,6,'#fff')}
  for(let i=0;i<11;i++){const angle=i*2.399,dist=radius+6+frame*2,x=Math.cos(angle)*dist,y=Math.sin(angle)*dist;box(x,y,frame<4?3:2,2,frame<4?'#ffe3a4':'#ae93a3')}
 },big?192:128)}
 function death(ctx,d,theme){
  const f=Math.min(1,d.age/(d.boss?1.2:.72)),sprite=d.boss?bossSprite(d.i,theme):enemySprite(d.i,theme,0,d.secret);
  if(d.age<(d.boss?.95:.62)){ctx.save();ctx.globalAlpha=Math.min(1,(1-f)*1.25);placeSprite(ctx,explosionSprite(Math.min(7,Math.floor(d.age/(d.boss?.12:.08))),!!d.boss,[3,7,9].includes(d.i)),d.x,d.y,1);ctx.restore()}
  ctx.save();ctx.globalAlpha=(1-f)*.85;
  for(let i=0;i<3;i++){ctx.save();ctx.translate(d.x+(i-1)*f*55,d.y+f*f*80-(i===1?f*35:0));ctx.rotate((i-1)*f*1.7);const size=d.boss?sprite.width:80;ctx.drawImage(sprite,0,i*sprite.height/3,sprite.width,sprite.height/3,-size/2,-size/2+i*size/3,size,size/3);ctx.restore()}
  ctx.restore();
  if(!d.boss){g=ctx;ctx.save();ctx.globalAlpha=1-f;
   if(d.i===2||d.i===8){for(let i=0;i<3;i++){const x=d.x+(i-1)*f*85,y=d.y-20*f+f*f*85;oval(x,y,6,8,['#f2bb93','#d28f70','#9e5a54','#683e4b']);box(x-1,y-2,2,2,'#fff1ce')}}
   else if(d.i===3||d.i===7){ctx.save();ctx.translate(d.x+f*25,d.y-45*f);ctx.rotate(f*3);oval(0,0,13,4,brass);box(-3,-8,6,5,gold[1]);ctx.restore();for(let i=0;i<3;i++)glow(ctx,d.x+(i-1)*11,d.y-f*(35+i*20),8+f*7,'#edf2dc44')}
   else if(d.i===0){for(let i=0;i<9;i++)box(d.x+Math.sin(i*7)*f*65,d.y+Math.cos(i*7)*f*45+f*f*30,3,2,'#f9db9a')}
   else if(d.i===4){for(let i=0;i<5;i++)poly([[d.x+(i-2)*f*24,d.y+f*40],[d.x+(i-2)*f*24+7,d.y+f*40-4],[d.x+(i-2)*f*24+3,d.y+f*40+5]],'#92769b')}
   else if(d.i===1||d.i===6){for(let i=0;i<5;i++)box(d.x+(i-2)*f*16,d.y+18+f*35,2,7,'#edbf7c')}
   ctx.restore();
  }
 }

 function bossSprite(i,theme){const raster=rasterSprite([12,13,2,5,9,14,15][i],256);if(raster)return raster;return makeSprite('boss-'+i+'-'+theme,()=>{
  g.scale(2.0,2.0);g.translate(7,0);
  if(i===0){carpet(26);rider();poly([[-26,-25],[-18,-41],[-2,-31],[13,-43],[25,-23]],gold[1],2);box(-18,-25,35,3,gold[0])}
  else if(i===1){pot();poly([[-16,-29],[-14,-40],[-5,-34],[3,-42],[12,-30]],gold[1],2)}
  else if(i===2){g.rotate(-.4);sausage(true);box(-14,-30,26,8,gold[2]);poly([[-12,-30],[-11,-41],[-2,-34],[7,-42],[12,-30]],gold[1],2)}
  else if(i===3){vortex();oval(0,-28,18,8,['#c4bbf3','#8a80c8','#655f99','#434b78']);glint(0,-29,'#fff2bd')}
  else if(i===4)camel();
  else if(i===6){poly([[-26,29],[-26,-18],[-18,-30],[18,-30],[26,-18],[26,29]],'#496273',2);box(-20,-17,8,44,'#96a7a0');box(14,-14,9,42,'#243e54');box(-18,-42,11,16,'#5d7e88');box(8,-46,11,20,'#5d7e88');box(-20,-43,15,4,'#abbfb3');box(6,-47,15,4,'#abbfb3');oval(0,-5,15,17,['#ffe5ad','#e8a064','#b76645','#6e4242']);box(-11,-9,23,4,'#f9d19a');box(-8,3,16,11,'#7c463f');for(let k=0;k<3;k++)box(-6+k*5,3,2,10,'#ffe7a0');box(-24,21,48,8,'#283c51')}
  else{poly([[-24,-5],[-19,-24],[18,-24],[26,-2],[21,31],[-22,31]],'#2f6ca9',2);box(-20,-1,42,6,'#efe9d3');box(-21,18,42,5,'#efe9d3');oval(0,-24,18,15,['#ffdfb2','#e7b887','#ba8968','#785962']);box(-21,-38,42,8,'#e7e5d2');box(-18,-44,36,7,'#2965a3');eye(-11,-26,true);eye(2,-26,true);box(-8,-12,18,4,'#754d48');label(g,'04',0,16,17,'#fff4d6','center')}
 },256)}
 // Local body regions, shared by collision, hit flashes and health display.
 const bodyRegions=[
  [
   {name:'Turban & Kopf',points:[[-110,-115],[115,-115],[115,-25],[-110,-25]],aim:[20,-68],role:0},
   {name:'Arme & Gewand',points:[[-110,-25],[115,-25],[115,55],[-110,55]],aim:[0,12],role:1,weight:1.5},
   {name:'Teppich',points:[[-110,55],[115,55],[115,115],[-110,115]],aim:[0,82],role:2}
  ],
  [
   {name:'Deckel',points:[[-55,-115],[62,-115],[72,-52],[-55,-52]],aim:[10,-78],role:0},
   {name:'Ausguss',points:[[-115,-66],[-52,-62],[-25,8],[-44,63],[-62,48],[-65,-9],[-99,-34]],aim:[-72,-32],role:2},
   {name:'Kessel',points:[[-43,-52],[53,-52],[66,69],[37,115],[-35,115],[-55,68]],aim:[0,30],role:1,weight:2},
   {name:'Henkel',points:[[60,-75],[111,-68],[120,-20],[97,47],[61,55],[52,26],[78,9],[85,-28],[62,-47]],aim:[99,-15],role:2}
  ],
  [
   {name:'Vorderer Wurstbogen',points:[[-115,-45],[-10,-112],[61,-80],[15,-25],[-10,25],[-86,60]],aim:[-46,-32],role:0},
   {name:'Hinterer Wurstbogen',points:[[61,-91],[117,-42],[111,53],[56,108],[-10,113],[-86,60],[-10,25],[30,-15]],aim:[65,35],role:1}
  ],
  [
   {name:'Wirbelspitze',points:[[-80,-115],[105,-115],[98,-32],[-95,-32]],aim:[20,-65],role:0},
   {name:'Wirbelkern',points:[[-95,-32],[98,-32],[70,36],[-80,36]],aim:[0,0],role:1,weight:1.5},
   {name:'Wirbelschweif',points:[[-80,36],[70,36],[32,116],[-33,116]],aim:[0,66],role:2}
  ],
  [
   {name:'Kopf & Hals',points:[[-115,-83],[-51,-96],[-33,-29],[-54,23],[-84,6],[-91,-35],[-115,-40]],aim:[-78,-48],role:0},
   {name:'Vordere Rüstung',points:[[-52,-40],[16,-42],[16,42],[-58,42]],aim:[-20,0],role:1},
   {name:'Hintere Rüstung',points:[[16,-42],[110,-37],[116,42],[16,42]],aim:[61,0],role:1},
   {name:'Vordere Beine',points:[[-65,42],[8,42],[8,100],[-65,100]],aim:[-28,65],role:2},
   {name:'Hintere Beine',points:[[8,42],[112,42],[105,100],[8,100]],aim:[49,65],role:2}
  ],
  [
   {name:'Kopf & Mütze',points:[[-48,-116],[56,-116],[56,-35],[-48,-35]],aim:[0,-70],role:0},
   {name:'Linker Arm',points:[[-112,-92],[-73,-100],[-48,-69],[-48,26],[-97,17],[-115,-32]],aim:[-78,-36],role:2},
   {name:'Rechter Arm',points:[[56,-98],[101,-98],[119,-43],[101,23],[56,26]],aim:[88,-40],role:2},
   {name:'Trikot & Beine',points:[[-48,-35],[56,-35],[67,56],[86,116],[-79,116],[-63,58]],aim:[0,34],role:1,weight:2}
  ],
  [
   {name:'Linker Schlot',points:[[-68,-118],[-10,-118],[-10,-52],[-68,-52]],aim:[-38,-80],role:0},
   {name:'Rechter Schlot',points:[[2,-118],[65,-118],[65,-52],[2,-52]],aim:[30,-81],role:0},
   {name:'Feuerkammer',points:[[-107,-52],[50,-52],[50,65],[-107,65]],aim:[-27,20],role:1,weight:2},
   {name:'Ventilblock',points:[[50,-52],[119,-52],[119,65],[50,65]],aim:[88,12],role:2},
   {name:'Fahrwerk',points:[[-111,65],[120,65],[120,118],[-111,118]],aim:[0,89],role:2}
  ]
 ];
 function bossLayout(i){return bodyRegions[i].map((part,index)=>({...part,index,points:part.points.map(p=>[...p]),aim:[...part.aim]}))}
 function boss(ctx,b,ruhr){
  const sprite=bossSprite(b.i,ruhr?3:0);ctx.save();ctx.translate(b.x,b.y);placeSprite(ctx,sprite,7,0,1);
  for(const part of b.parts){
   ctx.save();ctx.beginPath();part.points.forEach((point,i)=>i?ctx.lineTo(point[0],point[1]):ctx.moveTo(point[0],point[1]));ctx.closePath();ctx.clip();
   if(part.flash>0){placeSprite(ctx,whiteMask(sprite),7,0,1)}
   else if(part.hp>0&&part.slowTime>0){ctx.globalAlpha=.17;placeSprite(ctx,lightMask(sprite,'#8be3ff'),7,0,1)}
   else if(part.hp<=0){ctx.globalAlpha=.76;placeSprite(ctx,lightMask(sprite,'#101d2c'),7,0,1)}
   else if(part.hp/part.max<.5){ctx.globalAlpha=.18;placeSprite(ctx,lightMask(sprite,'#3f2b38'),7,0,1)}
   ctx.restore();
  }
  ctx.restore();
  if(b.warning>0){ctx.save();ctx.strokeStyle='#ffcb8a77';ctx.lineWidth=2;ctx.setLineDash([12,8]);ctx.beginPath();ctx.moveTo(0,b.y);ctx.lineTo(b.x-70,b.y);ctx.stroke();ctx.restore();label(ctx,'ATTENTION',b.x-85,b.y-15,10,'#ffe4af','right')}
 }
 function elementalAura(ctx,b){const e=b.elements;if(!e)return;const r=Math.max(5,Math.min(20,b.w*.65)),age=b.age||0;g=ctx;ctx.save();ctx.translate(Math.round(b.x),Math.round(b.y));
  if(e.frost>0){ctx.globalAlpha=.7;for(let i=0;i<3;i++){const angle=age*3+i*2.094;box(Math.cos(angle)*r,Math.sin(angle)*r,2,3,'#c9f9ff')}}
  if(e.fire>0){ctx.globalAlpha=.7;for(let i=0;i<3;i++){const x=-r-i*5,y=Math.sin(age*17+i)*r*.5;poly([[x,y],[x-7,y-3],[x-4,y+3]],i%2?'#ffe0a4':'#ff9565')}}
  if(e.lightning||e.chainBonus>0){ctx.globalAlpha=.7;ctx.strokeStyle='#e2f5ff';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-r,-r*.4);ctx.lineTo(-r*.4,-r*.7);ctx.lineTo(r*.3,-r*.3);ctx.lineTo(r,r*.2);ctx.stroke()}
  if(e.earth||e.forkBonus>0){ctx.globalAlpha=.8;for(let i=0;i<2;i++){const angle=age*4+i*Math.PI;poly([[Math.cos(angle)*r,Math.sin(angle)*r-3],[Math.cos(angle)*r+3,Math.sin(angle)*r],[Math.cos(angle)*r-2,Math.sin(angle)*r+2]],'#e4bd87')}}ctx.restore();
 }
 function trail(ctx,b){
  elementalAura(ctx,b);if(!b.trail||b.trail.length<2)return;const palette={red:'#ffbb77',white:'#a7ffdd',rose:'#ffbde5',port:'#d8baff',speed:'#a8eaff',prism:'#b6f7ff',saw:'#d3e7ae',chain:'#c3ecff',orbit:'#d3c6ff',mortar:'#ffd7a2',wave:'#c4ffe7',frost:'#c9f6ff',vortex:'#c7adff',phoenix:'#ffcf96',echo:'#edc8ff'};
  const col=palette[b.style]||'#b8edff';ctx.save();ctx.lineCap='butt';
  for(let i=1;i<b.trail.length;i++){const p=b.trail[i-1],q=b.trail[i],f=i/b.trail.length;ctx.globalAlpha=f*(b.charged?.48:.32);ctx.strokeStyle=col;ctx.lineWidth=Math.max(1,Math.min(8,b.w*.2)*f);ctx.beginPath();ctx.moveTo(Math.round(p.x/2)*2,Math.round(p.y/2)*2);ctx.lineTo(Math.round(q.x/2)*2,Math.round(q.y/2)*2);ctx.stroke();if(b.charged&&i%2===0){ctx.fillStyle=col;ctx.fillRect(Math.round(q.x),Math.round(q.y-4-Math.sin(i*3+(b.age||0)*9)*4),2,2)}}ctx.restore();
 }
 function spark(ctx,p){const f=Math.max(0,p.life/p.maxLife),x=Math.round(p.x),y=Math.round(p.y),size=Math.max(1,Math.round(p.size*f));ctx.save();ctx.globalAlpha=f;ctx.strokeStyle=p.col;ctx.lineWidth=Math.max(1,size*.65);ctx.beginPath();ctx.moveTo(x-Math.round(p.vx*.022),y-Math.round(p.vy*.022));ctx.lineTo(x,y);ctx.stroke();ctx.fillStyle=p.col;ctx.fillRect(x,y,size,size);if(f>.55&&size>2){ctx.fillStyle='#fff6df';ctx.fillRect(x,y,1,1)}ctx.restore()}
 function bullet(ctx,b){
  const x=b.x,y=b.y,r=b.w/2,age=b.age||0;g=ctx;ctx.save();ctx.translate(x,y);ctx.rotate(Math.atan2(b.vy,b.vx));
  if(b.echoed){ctx.globalAlpha=.78;glow(ctx,-r,0,r*2,'#e4baff33')}
  if(b.charged){ctx.strokeStyle='#e2f9ff55';ctx.lineWidth=1;ctx.beginPath();ctx.arc(-r*.5,0,r*1.4,-age*10,-age*10+1.4);ctx.stroke()}
  const detailed=b.style==='normal'&&b.charged?8:b.style==='frost'?9:b.style==='phoenix'?10:b.style==='vortex'?11:b.style==='red'&&b.charged?12:-1;
  if(detailed===10)ctx.scale(1,.94+Math.sin(age*18)*.09);
  if(detailed>=0&&paintEffect(ctx,detailed,0,0,b.w*(detailed===11?2.7:detailed===10?2.6:3),detailed===11?age*.9:0)){ctx.restore();return}
  if(b.style==='prism'){
   glow(ctx,0,0,r*2.4,'#a9ffff55');poly([[-r*1.4,0],[0,-r],[r*1.6,0],[0,r]],'#152d4b',3);poly([[-r,0],[0,-r*.7],[r*1.2,0],[0,r*.7]],'#89cadd');poly([[0,-r*.7],[r*1.2,0],[0,0]],'#efffff');poly([[-r,0],[0,0],[0,r*.7]],'#b7a7ff');glint(r*.2,-r*.1,'#fff');
  }else if(b.style==='saw'){
   glow(ctx,0,0,r*2,'#d1f89a40');ctx.save();ctx.rotate(age*13);for(let i=0;i<8;i++){ctx.rotate(Math.PI/4);poly([[-3,-r*.7],[r*.4,-r*1.3],[r*.5,-r*.5]],'#d7e3b5',2)}oval(0,0,r*.7,r*.7,['#ffffd5','#c3cda2','#7c9a8a','#3d5b66']);oval(0,0,r*.25,r*.25,['#b5efff','#68d4e9','#3a8ba8','#29465f']);ctx.restore();
  }else if(b.style==='chain'){
   glow(ctx,0,0,r*2.1,'#9adfff66');poly([[-r*1.7,-r*.8],[r*.5,-r*.3],[-r*.1,0],[r*1.6,r*.4],[-r*.8,r*.7],[-r*.2,r*.2]],'#1d344e',3);poly([[-r*1.3,-r*.6],[r*.3,-r*.2],[-r*.2,.5],[r*1.1,r*.4],[-r*.5,r*.4],[0,0]],'#ebffff');
  }else if(b.style==='orbit'){
   glow(ctx,0,0,r*2.4,'#a7a5ff55');ctx.strokeStyle='#d7ccff';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,0,r*1.5,r*.6,age*6,0,7);ctx.stroke();oval(0,0,r*.7,r*.7,['#fff6df','#b6b7ef','#7c8cc5','#425f8e']);glint(-r*.2,-r*.3,'#fff');
  }else if(b.style==='mortar'){
   glow(ctx,-r,0,r*2.5,'#ffc06b44');oval(0,0,r,r,['#bfdae0','#6d97a4','#405a73','#233950']);box(-r*.25,-r,3,r*2,'#ffe9aa');poly([[-r,-r*.3],[-r*2.5,-r*.6],[-r*2,0],[-r*2.5,r*.6],[-r,r*.3]],'#ffa765');glint(-r*2,0,'#fff0bb');
  }else if(b.style==='wave'){
   glow(ctx,0,0,r*1.6,'#9beecd35');for(const [offset,width,col] of [[0,7,'#16374e'],[0,4,'#8bf4cd'],[-4,1.5,'#efffe5']]){ctx.strokeStyle=col;ctx.lineWidth=width;ctx.beginPath();ctx.ellipse(offset,0,r*.7,b.h*.5,-.0,-1.45,1.45);ctx.stroke()}box(-r*.25,-2,r*.7,4,'#ddfff3');
  }else if(b.style==='frost'){
   glow(ctx,0,0,r*2,'#abedff55');poly([[-r*1.5,-r*.55],[r*1.7,0],[-r*1.5,r*.55],[-r*.8,0]],'#143853',3);poly([[-r*1.2,-r*.4],[r*1.3,0],[-r*1.2,r*.4],[-r*.65,0]],'#abe9f8');poly([[-r,-r*.4],[r*1.3,0],[-r*.5,0]],'#fff');
  }else if(b.style==='vortex'){
   glow(ctx,0,0,r*2.8,'#9d8eff66');for(let j=0;j<3;j++){ctx.strokeStyle=['#d2b5ff','#8f8fcf','#e7e3ff'][j];ctx.lineWidth=j===0?3:1;ctx.beginPath();ctx.ellipse(0,0,r*(1+j*.4),r*(.4+j*.14),age*5+j,0,5.5);ctx.stroke()}oval(0,0,r*.7,r*.7,['#443c6a','#272844','#161c30','#12192b']);
  }else if(b.style==='phoenix'){
   const flap=Math.sin(age*20)*r*.25;glow(ctx,0,0,r*2.6,'#ffc78055');poly([[-r*2,0],[-r,-r*.25],[-r*.8,-r*1.35-flap],[0,-r*.4],[r*.8,-r*.2],[r*1.4,0],[r*.4,r*.3],[-r*.8,r*1.35+flap],[-r,r*.3]],'#50384d',3);poly([[-r*1.8,0],[-r*.6,-r*.2],[-r*.7,-r*1.1-flap],[.1,-r*.2],[r*1.1,0],[0,r*.2],[-r*.7,r*1.1+flap],[-r*.6,r*.2]],'#ffae62');poly([[-r,0],[0,-r*.25],[r*.9,0],[0,r*.2]],'#fff5c2');
  }else if(b.style==='echo'){
   glow(ctx,0,0,r*2,'#d3b5ff55');ctx.strokeStyle='#f4d4ff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,r,-1.5,1.5);ctx.stroke();
  }else if(b.style==='red'){
   glow(ctx,-r,0,r*1.5,'#ff603724');poly([[-r*4,0],[-r,-r*.7],[r*.7,-r*.4],[r,0],[r*.7,r*.4],[-r,r*.7]],'#a34345');
   poly([[-r*3,0],[-r,-r*.4],[r*.5,-r*.3],[r*.85,0],[r*.5,r*.3],[-r,r*.4]],'#f78950');
   poly([[-r*1.7,0],[r*.5,-r*.15],[r*.7,0],[r*.4,r*.18]],'#fff0b0');
   if(b.charged){glow(ctx,0,0,r*1.6,'#ff754a22');for(let i=0;i<3;i++)box(-r*2-i*8,Math.sin(age*16+i)*r,3,2,'#ffaf65')}
  }else if(b.style==='white'){
   glow(ctx,0,0,r*1.7,'#76e5df28');poly([[-r*1.8,-r*.7],[r*.7,-r*.2],[r*1.2,0],[r*.7,r*.2],[-r*1.8,r*.7],[-r*.6,0]],'#469da9');
   poly([[-r*1.5,-r*.5],[r*.9,0],[-r*1.5,r*.5],[-r*.2,0]],'#c0ffdf');box(-r*.2,-1,r*1.2,2,'#fffde1');
  }else if(b.style==='rose'){
   glow(ctx,0,0,r*1.8,'#ef83bf28');for(let i=0;i<3;i++){ctx.save();ctx.rotate(age*5+i*2.094);poly([[0,0],[-r*.5,-r],[r*.1,-r*1.5],[r*.6,-r*.7]],i===0?'#ffdcdf':i===1?'#df7da9':'#a24d8c');ctx.restore()}oval(0,0,r*.45,r*.45,['#fff4e4','#ffc2dd','#da7fb3','#b35a94']);
  }else if(b.style==='speed'){
   glow(ctx,-r,0,r*1.5,'#78ceff24');poly([[-r*3,0],[-r,-r*.55],[r*1.2,0],[-r,r*.55]],'#74bdeb');poly([[-r*2,0],[r*.7,-1],[r,0],[r*.7,1]],'#e2fcff');
   ctx.strokeStyle='#bceeff';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-r*3,-3);ctx.lineTo(-r*2,-6);ctx.lineTo(-r*1.7,2);ctx.lineTo(-r,-2);ctx.stroke();
  }else if(b.style==='satellite'){
   poly([[-5,-3],[5,0],[-5,3]],'#f5c4e8');
  }else{
   glow(ctx,-r,0,r*2.8,'#8fdfff66');poly([[-r*3.5,0],[-r*.2,-r*.85],[r*.9,0],[-r*.2,r*.85]],'#132c4c',3);poly([[-r*3,0],[-r*.1,-r*.5],[r*.5,0],[-r*.1,r*.5]],'#a9f4ff');oval(0,0,r+2,r+2,['#e0fbff','#c3f0ff','#4f9ebf','#203d5a']);oval(0,0,r*.78,r*.78,['#fffde0','#ffe89a','#dfa85a','#996a45']);box(-r*.2,-r*.4,2,2,'#fffdf1');box(r*.3,r*.2,2,2,'#c88d41');
   if(b.charged){ctx.strokeStyle='#ffe8a280';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,r+5,-age*9,-age*9+4.7);ctx.stroke()}
  }
  ctx.restore();
 }
 function beamPulse(ctx,b,time){
  const span=Math.max(1,960-b.x),col=b.style==='storm'?'#d6f9ff':'#eddbff';g=ctx;ctx.save();ctx.globalAlpha=Math.min(1,b.life/.1)*.65;
  for(let i=0;i<6;i++){const x=b.x+((time*540+i*span/6)%span),h=Math.min(18,b.width*.45);box(x,b.y-h,2,h*2,col);box(x-3,b.y-h-2,6,2,col);box(x-3,b.y+h,6,2,col)}
  paintEffect(ctx,b.style==='storm'?4:13,b.x+7,b.y,Math.min(115,b.width*2.7+20),0,.8);ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(b.x,b.y,b.width*.35+4,b.width*.8+7,Math.sin(time*8)*.2,0,7);ctx.stroke();ctx.restore();
 }
 function beam(ctx,b,time){
  if(b.style==='storm'){
   const fade=Math.min(1,b.life/.12),w=b.width,edges=[[-w*.7,'#f9db8b40',12],[w*.7,'#9cdbff55',12],[0,'#e8faff',w*.4]];ctx.save();ctx.globalAlpha=fade;
   ctx.fillStyle='#132c4877';ctx.fillRect(b.x,b.y-w*1.1,960-b.x,w*2.2);glow(ctx,b.x,b.y,w*2.2,'#d0f6ff66');
   for(const [offset,color,line] of edges){ctx.strokeStyle=color;ctx.lineWidth=line;ctx.beginPath();for(let x=b.x;x<980;x+=18){const y=b.y+offset+Math.sin(x*.08+time*42)*w*.18;if(x===b.x)ctx.moveTo(x,y);else ctx.lineTo(x,y)}ctx.stroke()}
   ctx.fillStyle='#fff9df';ctx.fillRect(b.x,b.y-2,960-b.x,4);
   for(let i=0;i<(b.charged?7:3);i++){const x=b.x+40+i*115,y=b.y+Math.sin(time*13+i)*w;arc(ctx,{x:x-30,y:b.y,tx:x+35,ty:y,life:1,maxLife:1})}
   ctx.restore();beamPulse(ctx,b,time);return;
  }
  const fade=Math.min(1,b.life/.12),w=b.width*(.8+.12*Math.sin(time*59)),length=960-b.x;ctx.save();ctx.globalAlpha=fade;ctx.globalCompositeOperation='lighter';
  ctx.fillStyle='#8d5fe71c';ctx.fillRect(b.x,b.y-w*1.8,length,w*3.6);ctx.fillStyle='#b281f44a';ctx.fillRect(b.x,b.y-w*.8,length,w*1.6);
  ctx.fillStyle='#bc95eb';ctx.fillRect(b.x,b.y-w*.4,length,w*.8);ctx.fillStyle='#e8d5ff';ctx.fillRect(b.x,b.y-w*.18,length,w*.36);ctx.fillStyle='#fff9ee';ctx.fillRect(b.x,b.y-1,length,3);
  ctx.strokeStyle='#d1afff';ctx.lineWidth=2;ctx.beginPath();for(let x=b.x;x<960;x+=21){const y=b.y+Math.sin(x*.05+time*28)*w*.7;if(x===b.x)ctx.moveTo(x,y);else ctx.lineTo(x,y)}ctx.stroke();
  ctx.restore();glow(ctx,b.x,b.y,w*1.6,'#ccb4ff55');beamPulse(ctx,b,time);
 }
 function hostile(ctx,s){g=ctx;const x=s.x,y=s.y,r=Math.max(5,s.w*.6),kind=s.kind||'orb';ctx.save();
  if(s.trail&&s.trail.length>1){ctx.strokeStyle='#ff694a';ctx.lineWidth=2;ctx.globalAlpha=.25;ctx.beginPath();s.trail.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke();ctx.globalAlpha=1}
  // Hostile fire is always a hollow ember silhouette with a dark outer border.
  glow(ctx,x,y,r*2.3,'#ff492d55');ctx.translate(x,y);ctx.rotate(kind==='needle'?Math.atan2(s.vy,s.vx):0);
  if(kind==='needle'||kind==='spike'){poly([[-r*1.5,-r*.6],[r*1.2,0],[-r*1.5,r*.6],[-r*.7,0]],'#191f32',3);poly([[-r*1.3,-r*.4],[r*.85,0],[-r*1.3,r*.4],[-r*.6,0]],'#ff6b4d');poly([[-r*.7,-1],[r*.5,0],[-r*.7,1]],'#ffe0a5')}
  else{ctx.strokeStyle='#111d32';ctx.lineWidth=5;ctx.beginPath();ctx.arc(0,0,r,0,7);ctx.stroke();ctx.strokeStyle='#ff6345';ctx.lineWidth=3;ctx.stroke();ctx.fillStyle='#311e32';ctx.beginPath();ctx.arc(0,0,r*.6,0,7);ctx.fill();box(-1,-r-1,2,3,'#ffe2aa')}
  ctx.restore();
 }
 function flash(ctx,f){const alpha=Math.max(0,f.life/f.maxLife);g=ctx;ctx.save();ctx.globalAlpha=alpha;glow(ctx,f.x,f.y,f.r*1.5,'#eefbff70');if(!paintEffect(ctx,f.magic?4:0,f.x,f.y,f.r*3.3)){poly([[f.x-f.r,f.y],[f.x-f.r*.2,f.y-f.r*.12],[f.x,f.y-f.r*.7],[f.x+f.r*.2,f.y-f.r*.12],[f.x+f.r,f.y],[f.x+f.r*.2,f.y+f.r*.12],[f.x,f.y+f.r*.7],[f.x-f.r*.2,f.y+f.r*.12]],'#fffdf1')}ctx.restore()}
 function arc(ctx,a){const f=Math.max(0,a.life/a.maxLife);ctx.save();ctx.globalAlpha=f;for(const [width,color] of [[7,'#182c48'],[4,'#59caff'],[1.5,'#efffff']]){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();for(let i=0;i<=8;i++){const u=i/8,x=a.x+(a.tx-a.x)*u,y=a.y+(a.ty-a.y)*u+(i&&i<8?Math.sin(i*7)*8:0);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)}ctx.stroke()}ctx.restore()}
 function ring(ctx,r){const f=1-r.life/r.maxLife,rx=r.size*(.25+f*.75),ry=r.size*(.2+f*.6);ctx.save();ctx.globalAlpha=(1-f)*.6;ctx.strokeStyle=r.col;ctx.lineWidth=f<.35?3:1;ctx.beginPath();for(let i=0;i<=20;i++){const angle=i*Math.PI/10,x=Math.round((r.x+Math.cos(angle)*rx)/2)*2,y=Math.round((r.y+Math.sin(angle)*ry)/2)*2;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)}ctx.stroke();if(f<.7){ctx.globalAlpha=(1-f)*.4;ctx.fillStyle=r.col;for(let i=0;i<12;i++){const angle=i*Math.PI/6;ctx.fillRect(Math.round(r.x+Math.cos(angle)*rx*1.08),Math.round(r.y+Math.sin(angle)*ry*1.08),2,2)}}ctx.restore()}
 function bottle(ctx,p){g=ctx;const x=p.x,y=p.y+Math.sin((p.age||0)*4)*3;const cols=['#ba4f59','#bde1bd','#e3a2bb','#986ab9','#85c7e0','#baa0cb','#b9e0e9','#c5d89d','#9fdcea','#b6acd9','#e9bc79','#a2d9bc','#a5d8ec','#9988c9','#d7e8ed','#e8ac79'];
  glow(ctx,x,y,34,'#75f3dc44');for(let i=0;i<3;i++){const phase=(p.age||0)*1.7+i*2.094,xx=x+Math.cos(phase)*21,yy=y+Math.sin(phase)*25;box(xx,yy,2,2,'#c5ffe8')}ctx.save();ctx.strokeStyle='#182e44';ctx.lineWidth=5;ctx.strokeRect(x-16,y-26,32,54);ctx.strokeStyle='#83f5d8';ctx.lineWidth=2;ctx.strokeRect(x-16,y-26,32,54);ctx.restore();for(const side of [-1,1]){box(x+side*16-2,y-27,5,2,'#dbffed');box(x+side*16-2,y+27,5,2,'#b7fce5')}
  if(p.i===16)cols[16]='#ffd34e';box(x-4,y-22,8,6,'#654b48');box(x-3,y-22,4,2,'#d9bd8c');box(x-4,y-15,8,8,'#8eafb0');
  poly([[x-4,y-9],[x-10,y-5],[x-10,y+17],[x-7,y+21],[x+7,y+21],[x+10,y+17],[x+10,y-5],[x+4,y-9]],'#34495e');box(x-8,y-4,16,21,cols[p.i]);box(x-7,y-3,3,17,'#fff6d480');box(x+5,y-2,3,20,'#453e5a77');box(x-7,y+3,14,9,'#f6e6bd');
  const icons=['III','⋔','✿','—','ϟ','♥','◆','✺','ϟ','◉','●',')))','❄','◎','✧','➤','★'];label(ctx,icons[p.i]||'✦',x,y+10,9,'#384f5d','center');box(x+12,y-34,12,12,'#17354a');label(ctx,'+',x+18,y-24,14,'#a8ffdc','center');
  const names=['ROTWEIN','WEISSWEIN','ROSÉ','PORTWEIN','SCHAUMWEIN','TRAUBENMOST','RIESLING','MERLOT','MALBEC','MUSKAT','SHERRY','MADEIRA','EISWEIN','CABERNET','TOKAJ','BURGUNDER','SONDERWEIN'];box(x-37,y+31,74,13,'#1c3249e8');label(ctx,names[p.i]||'WEIN',x,y+41,8,'#baf8df','center');
 }
 function golden(ctx,p){if(p.kind===2){g=ctx;const x=p.x,y=p.y;glow(ctx,x,y,42,'#8ce5ff66');box(x-12,y-15,24,37,'#314c5e');box(x-9,y-11,18,28,'#c7c7a5');box(x-5,y-8,10,22,'#fff4ba');box(x-15,y+20,30,5,'#8babb0');box(x-11,y-24,22,8,'#77929d');box(x-5,y-31,10,8,'#b7cacc');label(ctx,'GEHEIM',x,y+42,9,'#cff8f4','center');return}ctx.save();ctx.translate(p.x,p.y);glow(ctx,0,0,42,'#ffd46933');const sprite=makeSprite('golden',()=>sausage(false,true));placeSprite(ctx,sprite,0,0,1);g=ctx;glint(34,-21,'#fff0b6');glint(-30,17,'#fff0b6');ctx.restore()}
 function pixelHeart(ctx,x,y,filled){const rows=['.##.##.','#######','#######','.#####.','..###..','...#...'];for(let yy=0;yy<rows.length;yy++)for(let xx=0;xx<7;xx++)if(rows[yy][xx]==='#'){ctx.fillStyle='#12263a';ctx.fillRect(x+xx*2-1,y+yy*2-1,4,4)}for(let yy=0;yy<rows.length;yy++)for(let xx=0;xx<7;xx++)if(rows[yy][xx]==='#'){ctx.fillStyle=filled?(yy<2?'#ffc8bd':yy<4?'#ed929b':'#b96783'):(yy<2?'#708a9b':'#465e76');ctx.fillRect(x+xx*2,y+yy*2,2,2)}if(filled){ctx.fillStyle='#fff0d4';ctx.fillRect(x+3,y+2,2,2)}}
 function hud(ctx,s){
  g=ctx;const panel=ctx.createLinearGradient(0,0,0,62);panel.addColorStop(0,'#253b50');panel.addColorStop(1,'#14273c');ctx.fillStyle=panel;ctx.fillRect(0,0,960,62);box(0,60,960,2,'#a88c69');box(0,57,960,1,'#53687a');for(const side of [0,1]){const x=side?948:8;poly([[x,56],[x+4,52],[x+8,56],[x+4,60]],'#c5a980');box(side?885:22,59,53,1,'#dbc69b')}
  label(ctx,'PFERT',18,21,13,'#f0d4a2');for(let i=0;i<(s.maxHearts||5);i++)pixelHeart(ctx,18+i*19,33,i<s.hearts);
  const rage=s.player.overdrive>0?s.player.overdrive/8:(s.player.rage||0)/100,ready=s.player.rage>=100;label(ctx,s.player.overdrive>0?'KÄSERAUSCH!':ready?'[Q] RAUSCH BEREIT':'Q · KÄSERAUSCH',163,21,9,ready||s.player.overdrive>0?'#d7faff':'#9fb5bf');box(163,30,140,8,'#13283d');box(164,31,138*rage,6,s.player.overdrive>0?'#d7faff':ready?'#a9efff':'#6b9eaf');
  label(ctx,s.secret?(s.secretType===2?'NACHTSCHICHT ':'RUHRPOTT ')+format(s.secretTime):format(s.t),480,22,17,'#ead9c3','center');
  label(ctx,String(s.score).padStart(6,'0'),941,24,21,'#fff0c5','right');
  label(ctx,'STUFE '+s.level+' · ORBS '+s.xp+' / '+s.xpNeeded,941,43,10,'#b5c3bf','right');box(781,49,160,7,'#13283d');box(782,50,158*Math.max(0,Math.min(1,s.xp/s.xpNeeded)),5,'#83e5ef');
  const name=s.weapon>=0?s.weaponNames[s.weapon]:'KLASSISCHER KÄSE';const col=['#ffad85','#b9f5db','#efb4db','#c8b0ec','#9cdef6','#d3b4eb','#c7eeff','#dcf3ad','#83e5ff','#ccc4ff','#ffd386','#a5f8d5','#a6eaff','#b6a0ff','#e4f7ff','#ffc48e'][s.weapon]||'#f0cf91';
  label(ctx,name,480,44,11,col,'center');if(s.weapon>=0){box(355,50,250,2,'#384d5d');box(355,50,Math.min(250,s.player.effects[s.weapon]/(18*(1+s.upgrades.duration*.08+s.upgrades.cellar*.01))*250),2,col)}
  label(ctx,'SONDER [LEER]',320,21,9,'#e9dcae');for(let i=0;i<3;i++)label(ctx,i<(s.player.specials||0)?'★':'☆',322+i*18,39,16,'#ffd66d');
  label(ctx,'◇ GEFAHR',18,77,8,'#ff9f82');label(ctx,'+ FLASCHE',18,89,8,'#99f4d5');if(s.combo>2)label(ctx,'KÄSEKETTE ×'+s.combo,941,79,10,'#ffe4aa','right');
  if(s.notice>0&&!s.boss){ctx.save();ctx.globalAlpha=Math.min(1,s.notice);box(255,78,450,30,'#26374dea');box(255,78,450,1,'#c5a274');label(ctx,s.noticeText,480,98,12,'#f5dfb4','center');ctx.restore()}
  const elements=s.elements||{},elementNames=[];if(elements.frost>0)elementNames.push('FROST');if(elements.fire>0)elementNames.push('FEUER');if(elements.lightning||elements.chainBonus>0)elementNames.push('BLITZ');if(elements.earth||elements.forkBonus>0)elementNames.push('ERDE');if(elementNames.length){box(671,519,271,15,'#24334ce8');label(ctx,elementNames.join(' · '),678,530,9,'#d9ecd6')}
  const tags=[];if(s.upgrades.fork)tags.push('SPLITTER ×'+(2*s.upgrades.fork));if(s.upgrades.cascade)tags.push('KETTENREAKTION');if(s.upgrades.shatter)tags.push('THERMOSCHOCK');if(s.upgrades.echoForge)tags.push('ECHOKAMMER');if(s.upgrades.orbital)tags.push('MONDSCHMELZE');
  for(let i=0;i<Math.min(4,tags.length);i++){box(18+i*149,519,143,15,'#24334ce8');label(ctx,tags[i],25+i*149,530,9,'#d7c4ef')}
  if(s.boss){const b=s.boss,n=b.parts.length,width=(312-(n-1)*5)/n;label(ctx,s.bosses[b.i].toUpperCase(),480,83,12,'#fff0cc','center');b.parts.forEach((part,i)=>{box(324+i*(width+5),91,width,6,'#354359');box(325+i*(width+5),92,(width-2)*Math.max(0,part.hp/part.max),4,part.flash>0?'#fff':part.hp>0?'#f0b581':'#606e7c')});label(ctx,b.parts.filter(p=>p.hp>0).length+' / '+n+' KÖRPERBEREICHE',480,111,8,'#e4cba8','center')}
 }
 function format(s){return String(Math.floor(s/60)).padStart(2,'0')+':'+String(Math.floor(s%60)).padStart(2,'0')}
 return {background,enemy,horse,boss,bullet,beam,hostile,ring,bottle,golden,death,hud,arc,flash,trail,spark,bossLayout};
})();
