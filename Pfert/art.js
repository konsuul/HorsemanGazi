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
 const surfaceLight={
  brass:[1.31,1.22,1.07],
  steel:[1.12,1.24,1.34],
  glass:[1.12,1.32,1.26],
  fabric:[1.23,1.16,1.16],
  organic:[1.23,1.17,1.10]
 };
 const enemySurfaces=['organic','fabric','organic','brass','fabric','organic','fabric','steel','organic','brass'];
 const rareSurfaces={fan:'brass',dive:'organic',aim:'glass',split:'glass',arc:'brass',cross:'fabric',mine:'steel',pulse:'brass',lanes:'fabric',scissor:'organic'};
 const blockerSurfaces={carpet:'fabric',lantern:'brass',bird:'brass',barge:'fabric'};
 const bossSurfaces=['fabric','brass','organic','organic','brass','fabric','steel','glass','steel'];
 const rimLift=[5,7,9],rimShadow=[.78,.80,.87],shadowLift=[1,3,7],materialContrast=[.91,.94,1.04];
 function crispCharacter(ctx,width,height,surface){
  if(typeof ctx.getImageData!=='function'||typeof ctx.putImageData!=='function')return;
  let pixels;
  try{pixels=ctx.getImageData(0,0,width,height)}catch{return}
  if(!pixels?.data)return;
  const data=pixels.data,solid=new Uint8Array(width*height);
  for(let i=0;i<solid.length;i++)solid[i]=Number(data[i*4+3]>=144);
  const light=surfaceLight[surface];
  for(let y=0;y<height;y++)for(let x=0;x<width;x++){
   const i=y*width+x,p=i*4;
   const left=x>0&&solid[i-1],right=x+1<width&&solid[i+1];
   const above=y>0&&solid[i-width],below=y+1<height&&solid[i+width];
   if(solid[i]){
    data[p+3]=255;
    if(light){
     const luminance=(data[p]*3+data[p+1]*6+data[p+2])/10;
     const diagonallyLit=x>2&&y>2&&!solid[i-width*2-2];
     const diagonallyShaded=x<width-3&&y<height-3&&!solid[i+width*2+2];
     // Rim light follows the inner contour. Deep lines, eyes and metal joints stay intact.
     const lit=luminance>47&&diagonallyLit&&(left||above);
     const shaded=luminance>24&&diagonallyShaded&&!lit;
     for(let channel=0;channel<3;channel++){
      const value=data[p+channel];
      if(lit)data[p+channel]=Math.round(value*light[channel]+rimLift[channel]);
      else if(shaded)data[p+channel]=Math.round(value*rimShadow[channel]+shadowLift[channel]);
      else if(luminance<90&&luminance>26)data[p+channel]=Math.round(value*materialContrast[channel]);
     }
    }else if(!right||!below){
     data[p]=Math.round(data[p]*.84);
     data[p+1]=Math.round(data[p+1]*.8);
     data[p+2]=Math.round(data[p+2]*.86+4);
    }
   }else if(left||right||above||below){
    data[p]=23;data[p+1]=18;data[p+2]=36;data[p+3]=255;
   }else data[p+3]=0;
  }
  ctx.putImageData(pixels,0,0);
 }
 function makeSprite(key,draw,size=104,surface){
  if(!cache.has(key)){
   const off=document.createElement('canvas');off.width=size;off.height=size;
   const old=g;g=off.getContext('2d');g.imageSmoothingEnabled=false;
   g.save();g.translate(size/2,size/2);g.scale(1.3,1.3);draw();g.restore();
   if(/^(enemy|pfert|boss|rare|blocker)-/.test(key))crispCharacter(g,size,size,surface);
   g=old;cache.set(key,off);
  }
  return cache.get(key);
 }
 function rasterSprite(index,size=104,surface){
  if(typeof PfertAssets==='undefined')return null;const image=PfertAssets.get('characters'),rect=PfertAssets.frames[index];if(!image||!rect)return null;
  const fit=size===104?86:size*.86;
  return fittedCharacter(image,rect,'raster-'+index+'-'+size,size,size,fit,fit,surface);
 }
 function fittedCharacter(image,rect,key,width,height,fitWidth,fitHeight=fitWidth,surface){
  if(!cache.has(key)){
   const sprite=document.createElement('canvas');sprite.width=width;sprite.height=height;
   const context=sprite.getContext('2d');
   const scale=Math.min(fitWidth/rect.w,fitHeight/rect.h);
   const w=Math.max(1,Math.round(rect.w*scale)),h=Math.max(1,Math.round(rect.h*scale));
   context.imageSmoothingEnabled=false;
   context.drawImage(image,rect.x,rect.y,rect.w,rect.h,Math.round((width-w)/2),Math.round((height-h)/2),w,h);
   crispCharacter(context,width,height,surface);
   cache.set(key,sprite);
  }
  return cache.get(key);
 }
 function enemySprite(i,theme=0,frame=0,ruhr=false){
  if(ruhr)return ruhrEnemySprite(i%5,frame,ruhr===2);
  const raster=rasterSprite(i,104,enemySurfaces[i]);
  if(raster)return raster;
  return makeSprite('enemy-'+i+'-'+theme+'-'+frame,()=>{
  if(i===0)simit();else if(i===1||i===6)rider(i===6);else if(i===2||i===8)sausage(i===8);else if(i===3||i===7)pot(i===7);else if(i===4)bat(frame);else if(i===5)vortex();else camel();
  if(i===1||i===6){for(let j=0;j<4;j++){box(-18+j*10,18,3,2,'#fff1b5');box(-13+j*8,1,2,2,'#d4aa76')}box(-7,-28,7,2,'#d6bb98');box(-10,-8,2,4,'#c4a27f')}
  if(i===2||i===8){for(let j=0;j<5;j++){box(-18+j*8,-9,2,4,'#d87565');box(-16+j*8,-1,2,2,'#ffd1a5')}box(23,-7,2,7,'#713746')}
  if(i===3||i===7){for(let j=-1;j<2;j++){poly([[j*8-4,8],[j*8,5],[j*8+4,8],[j*8,12]],'#745c49');box(j*8-1,7,2,2,'#e6ca82')}box(-13,-18,22,2,'#f4e2a1')}
  if(i===4){for(const side of [-1,1])poly([[side*11,-3],[side*19,-11],[side*26,-12],[side*17,-5]],'#b08ba5')}
  if(i===9){for(let j=0;j<4;j++){box(-21+j*9,1,3,4,'#d9d3b6');box(-20+j*9,1,1,2,'#fff0bd')}box(21,-15,3,14,'#ebc18c')}
  const accent=['#f6db98','#eeb18b','#beb4e7','#a6e2d7','#efcad2'][theme];
  if(theme>0){glint(i===3?-6:12,-23,accent);if(i===1||i===6){box(-13,6,22,2,accent)}if(i===7||i===9){box(-10,2,5,5,accent)}}
  },104,enemySurfaces[i]);
 }
 const gunmetal=['#b9c9c4','#758c91','#485d71','#29374a'];
 const enamel=['#c7e1ed','#6f9ac4','#3e648d','#263b60'];
 const copper=['#f5c48e','#c68964','#99594e','#513646'];
 function workshopSprite(index,surface,fit=86){
  const atlas=typeof PfertAssets!=='undefined'&&PfertAssets.get('workshop');
  const rect=atlas&&PfertAssets.workshopFrames?.[index];
  return rect?fittedCharacter(atlas,rect,'workshop-'+index,104,104,fit,fit,surface):null;
 }
 function rivet(x,y,metal=brass){
  box(x,y,4,4,metal[3]);box(x,y,3,3,metal[1]);box(x,y,2,1,metal[0]);
 }
 function louvers(x,y,count,metal){
  for(let i=0;i<count;i++){
   box(x,y+i*4,9,3,metal[3]);box(x,y+i*4+2,8,1,metal[1]);
  }
 }
 function ruhrEnemySprite(i,frame,night){
  const surface=['organic','steel','fabric','brass','steel'][i];
  const raster=workshopSprite(i,surface);
  if(raster)return raster;
  return makeSprite('enemy-ruhr-'+i+'-'+frame+'-'+night,()=>{
   const metal=night?copper:gunmetal;
   if(i===0){
    // Toasted cut edges and a darker crust wrap a short currywurst.
    oval(0,6,31,16,['#f5d18f','#d69c62','#a76043','#663b37']);
    sausage(false);
    poly([[-29,4],[-14,9],[0,7],[17,5],[29,2],[26,14],[13,19],[-9,20],[-24,15]],'#a05b44',2);
    poly([[-27,4],[-12,8],[4,6],[24,2],[28,6],[10,13],[-10,15],[-23,12]],'#e8b271');
    stipple(-20,8,39,6,'#ffe4a5','#9a583f',1);
    for(let x=-23;x<23;x+=9)box(x,7+(x<0?2:0),3,2,'#d47a52');
   }else if(i===1){
    // A deep coal bed sits above sloped, riveted pit-cart sides.
    for(const x of [-15,16]){oval(x,21,9,8,metal);oval(x,21,4,4,brass)}
    poly([[-32,-11],[-22,-19],[-11,-18],[-6,-25],[9,-27],[22,-19],[30,-19],[33,-9]],'#302b3b',2);
    for(let j=0;j<6;j++){
     const x=-27+j*9,y=-12-[3,7,6,12,8,3][j];
     poly([[x,y],[x+7,y-4],[x+12,y],[x+8,y+6],[x+2,y+6]],j%2?'#4d4b57':'#585965');
     box(x+3,y,5,1,'#83828a');
    }
    poly([[-34,-10],[27,-10],[33,-16],[26,12],[16,21],[-22,18]],metal[2],2);
    poly([[21,-8],[33,-15],[26,12],[16,21],[15,14]],metal[3]);
    box(-32,-9,54,4,metal[0]);box(-28,13,47,4,metal[3]);louvers(-7,-3,3,metal);
    for(const x of [-24,-13,12])rivet(x,-1,metal);
    box(-37,4,6,4,metal[1]);box(-38,4,3,2,metal[0]);
   }else if(i===2){
    // A work cap and striped scarf give the rider a separate silhouette from the boss.
    carpet(17);
    poly([[-16,14],[-16,-1],[-6,-12],[11,-10],[22,12],[15,17]],enamel[2],2);
    poly([[-12,-2],[-4,-8],[4,-6],[3,12],[-11,12]],enamel[1]);
    oval(-2,-15,12,12,['#ffe1ab','#d9aa80','#a97255','#643d41']);
    eye(-11,-15,true);box(-8,-8,12,3,'#63434a');
    poly([[-17,-20],[-13,-31],[2,-33],[12,-26],[14,-19],[-20,-19]],metal[2],2);
    box(-13,-28,16,3,metal[0]);box(-23,-20,31,3,metal[3]);box(-20,-21,25,2,metal[1]);
    poly([[-13,-4],[11,-5],[24,0],[31,-2],[35,4],[26,8],[11,5],[-12,4]],enamel[2],2);
    for(const x of [-11,-1,10,21,30])box(x,x<12?-3:0,4,6,'#e7ded1');
    for(let x=-15;x<=15;x+=10)rivet(x,13);
   }else if(i===3){
    // Pressure vessel with a curved hose, valve wheel and porcelain gauge.
    poly([[15,-7],[24,-7],[29,-12],[28,-22],[23,-22],[22,-16]],metal[3],3);
    box(25,-20,2,9,metal[0]);
    oval(-3,6,24,21,metal);
    oval(-4,-14,20,8,metal);
    box(-23,-12,38,3,metal[0]);box(-22,13,37,4,metal[3]);
    for(const x of [-17,11])rivet(x,10,metal);
    oval(-4,-1,11,11,brass);oval(-4,-1,8,8,cream);
    poly([[-6,1],[-10,-5],[-7,-4],[-2,0]],'#8b4c4e');
    box(-5,-2,3,3,metal[3]);box(-7,-29,6,11,metal[2]);
    oval(-4,-29,10,4,copper);box(-10,-30,11,2,copper[0]);
    louvers(-9,8,2,metal);
   }else{
    // A mine moth has caged wing ribs and a lamp under the antennae.
    const lift=frame?3:-4;
    for(const side of [-1,1]){
     const wing=[[-2*side,4],[5*side,-9],[24*side,-20+lift],[35*side,-10+lift],[29*side,5+lift],[18*side,16],[6*side,9]];
     poly(wing,metal[2],2);
     poly([[5*side,-6],[24*side,-16+lift],[31*side,-10+lift],[18*side,-2],[9*side,5]],metal[1]);
     poly([[24*side,-16+lift],[27*side,-12+lift],[18*side,10],[14*side,12],[17*side,2]],metal[3]);
     box(side*22-3,-13+lift,6,2,metal[0]);
     rivet(side*15-2,4,metal);
    }
    oval(0,4,9,17,metal);box(-5,-3,3,21,metal[0]);oval(-1,-7,7,8,brass);
    oval(-2,-8,4,4,['#fff7c3','#ffcc72','#c77e52','#6b4143']);
    box(-3,-10,2,2,'#fff6db');box(-6,-19,2,6,metal[1]);box(3,-19,2,6,metal[1]);
   }
  },104,surface);
 }
 function horseSprite(frame){
  // Both wing poses share a fixed crop and scale, keeping the body steady during flight.
  const pose=frame%4<2?0:1,image=typeof PfertAssets!=='undefined'&&PfertAssets.get('horse');
  if(image){
   const key='horse-v2-'+pose;
   if(!cache.has(key)){const off=document.createElement('canvas');off.width=104;off.height=104;const c=off.getContext('2d');c.imageSmoothingEnabled=false;c.drawImage(image,pose*336,0,336,264,3,13,98,77);crispCharacter(c,104,104);cache.set(key,off)}
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
 const cityPanorama={speed:7,width:1200,height:675,bottom:540};
 const industrialPanorama={speed:10,width:1200,height:675,bottom:540};
 const cityMiddle={speed:23,height:196,bottom:510};
 const cityNear={speed:39,height:113,bottom:540};
 const districtPanoramas=[
  null,['bazaar',8],['desert',5],['strait',10],['palace',7]
 ];

 function paintedLayer(ctx,id,time,{speed,height,bottom,width}){
  if(typeof PfertAssets==='undefined')return false;
  const image=PfertAssets.get(id);
  if(!image)return false;
  const key='panorama-'+id;
  if(!cache.has(key)){
   const span=width??Math.round(image.width*height/image.height);
   const tile=document.createElement('canvas');
   tile.width=span*2;
   tile.height=height;
   const layer=tile.getContext('2d');
   layer.imageSmoothingEnabled=false;
   layer.drawImage(image,0,0,span,height);
   layer.translate(tile.width,0);
   layer.scale(-1,1);
   layer.drawImage(image,0,0,span,height);
   cache.set(key,tile);
  }
  const tile=cache.get(key);
  const x=-Math.round((time*speed)%tile.width);
  for(let left=x;left<960;left+=tile.width)ctx.drawImage(tile,left,bottom-height);
  return true;
 }
 // Separate props keep their lettering readable when the panorama repeats.
 const ruhrShops=[
  {source:[3,2,243,252],height:169,bottom:510,start:104,speed:23},
  {source:[257,28,249,226],height:168,bottom:536,start:370,speed:36},
  {source:[517,61,248,193],height:155,bottom:536,start:676,speed:36}
 ];
 function ruhrStreetTile(near,period){
  const key=near?'ruhr-street-near':'ruhr-street-middle';
  if(cache.has(key))return cache.get(key);
  const tile=document.createElement('canvas');
  tile.width=period;tile.height=155;
  const previous=g;g=tile.getContext('2d');
  if(!near){
   for(let x=0;x<period;x+=146){
    const y=32+(x/146%3)*11;
    poly([[x,y+21],[x+26,y],[x+104,y],[x+131,y+21]],'#283442');
    box(x+8,y+21,115,115-y,'#4d494b');
    box(x+8,y+22,115,3,'#666064');
    for(let row=y+27;row<114;row+=6){
     for(let col=x+10+(row%4)*3;col<x+114;col+=13)box(col,row,8,1,'#665b59');
    }
    for(let row=y+33;row<112;row+=23)for(let col=x+19;col<x+108;col+=25){
     box(col,row,13,16,'#283541');
     box(col+2,row+2,9,11,(row+col)%3===0?'#a7825e':'#596773');
     box(col+6,row+2,1,11,'#38424a');
    }
   }
  }
  box(0,near?140:114,period,near?15:20,near?'#30343d':'#494951');
  box(0,near?141:115,period,2,'#777073');
  for(let x=0;x<period;x+=20){
   box(x,near?146:120,18,1,'#59565c');
   box(x,near?143:117,1,6,'#252932');
  }
  if(near)box(0,128,period,2,'#444a52');
  if(near)for(let x=30;x<period;x+=146){
   box(x,104,3,37,'#323b43');
   box(x-5,102,13,4,'#5a6569');
   box(x-3,106,9,3,'#c79e71');
   box(x+63,134,18,7,'#52424a');
   box(x+65,131,14,4,'#536052');
  }
  g=previous;cache.set(key,tile);
  return tile;
 }
 function drawRuhrShops(ctx,atlas,time){
  const period=1460;
  ctx.save();
  ctx.imageSmoothingEnabled=false;
  for(const shop of ruhrShops){
   if(shop===ruhrShops[0]||shop===ruhrShops[1]){
    const near=shop===ruhrShops[1],tile=ruhrStreetTile(near,period);
    const offset=-Math.round((time*shop.speed)%period);
    for(let x=offset;x<960;x+=period)ctx.drawImage(tile,x,shop.bottom-(near?140:114));
   }
   const [sx,sy,sw,sh]=shop.source;
   const width=Math.round(shop.height*sw/sh);
   const phase=(shop.start-time*shop.speed+width)%period;
   const x=Math.round((phase+period)%period-width);
   if(x<960&&x+width>0)ctx.drawImage(atlas,sx,sy,sw,sh,x,shop.bottom-shop.height,width,shop.height);
  }
  ctx.restore();
 }
 function ruhrLandmark(kind){
  const atlas=typeof PfertAssets!=='undefined'&&PfertAssets.get('ruhrLandmarks');
  const rect=atlas&&PfertAssets.landmarkFrames?.[kind];
  const key='ruhr-landmark-'+kind+(rect?'-raster':'-fallback');
  if(cache.has(key))return cache.get(key);
  const tile=document.createElement('canvas'),previous=g;
  const hall=kind==='zweckel';
  tile.width=hall?382:302;tile.height=hall?189:134;
  g=tile.getContext('2d');
  const ctx=g;
  if(rect){
   const width=tile.width-10,height=Math.round(width*rect.h/rect.w);
   ctx.imageSmoothingEnabled=false;
   ctx.drawImage(atlas,rect.x,rect.y,rect.w,rect.h,5,tile.height-height-3,width,height);
   crispCharacter(ctx,tile.width,tile.height,'fabric');
   if(hall){
    box(85,176,212,12,'#322d32');
    label(ctx,'MASCHINENHALLE ZWECKEL',191,185,9,'#ffdfb0','center');
   }else{
    const signY=tile.height-height-3+Math.round(height*.41);
    oval(39,signY-1,7,4,['#e3ab96','#b05754','#723d48','#4b3640']);
    label(ctx,'GETRÄNKE JÖRG KOPATZ',158,signY+5,14,'#433039','center');
   }
  }else if(hall){
   poly([[4,70],[74,38],[308,38],[348,51],[378,70]],'#343845');
   poly([[4,70],[74,38],[308,38],[315,45],[77,45],[25,69]],'#59515a');
   poly([[342,70],[378,70],[378,160],[353,173],[342,173]],'#583c3b');
   box(15,70,353,100,'#844a3f');
   box(15,137,353,33,'#62413d');
   box(15,68,353,4,'#bd8b73');box(15,73,353,3,'#653d3d');
   for(let y=72;y<169;y+=7){
    box(17,y,348,1,'#a16551');
    for(let x=24+(y%2)*7;x<367;x+=17)box(x,y,1,6,'#683b36');
   }
   for(const x of [32,76,120,232,276,320]){
    for(const [inset,color] of [[0,'#b87d61'],[4,'#253745']]){
     const windowX=x+inset,w=29-inset*2;
     ctx.fillStyle=color;ctx.beginPath();ctx.arc(windowX+w/2,96,w/2,Math.PI,0);ctx.fill();
     box(windowX,96,w,35-inset,color);
    }
    box(x+13,89,2,38,'#aa896b');box(x+4,106,21,2,'#aa896b');
   }
   for(const x of [24,66,110,151,227,267,311,355]){
    box(x,77,5,89,'#704541');box(x,77,2,87,'#bb8065');
    box(x-2,132,9,3,'#d29e7c');
   }
   box(153,61,77,113,'#9c5a46');
   poly([[147,62],[191,23],[236,62]],'#bd8a6b');
   poly([[158,59],[191,32],[225,59]],'#694748');
   for(const x of [166,182,198,214]){
    box(x,78,8,23,'#303b42');box(x,78,2,23,'#c39476');
   }
   box(168,109,46,2,'#dfa987');
   box(169,116,45,55,'#253540');
   box(176,122,31,49,'#594949');
   for(let i=0;i<4;i++)box(163-i*4,165+i*5,57+i*8,5,i%2?'#686063':'#9b8480');
   box(85,176,212,12,'#322d32');
   label(ctx,'MASCHINENHALLE ZWECKEL',191,185,9,'#ffdfb0','center');
  }else{
   poly([[3,47],[37,20],[259,20],[296,47]],'#4c4654');
   box(12,47,279,79,'#65564f');
   for(let x=17;x<292;x+=12)box(x,48,1,76,'#827267');
   box(22,52,251,27,'#3b3642');box(22,49,251,27,'#dccfbb');
   box(22,72,251,4,'#943e49');
   label(ctx,'GETRÄNKE KOPATZ',149,66,15,'#433039','center');
   oval(49,61,9,6,['#efc4ab','#a95055','#723d48','#4b3640']);
   box(128,83,104,43,'#2b3543');
   box(132,86,96,10,'#828485');
   for(let x=33;x<=100;x+=32){
    box(x,88,23,25,'#293945');box(x+3,91,17,19,'#c3a26e');
    box(x+10,91,2,19,'#4b535b');
   }
   for(let i=0;i<10;i++){
    const x=237+(i%3)*15,y=116-Math.floor(i/3)*8;
    box(x,y,14,7,i%2?'#af7850':'#547d79');box(x+3,y+2,8,3,'#2e3e47');
   }
   label(ctx,'GROSS- UND EINZELHANDEL',153,132,9,'#ffdc9c','center');
  }
  g=previous;cache.set(key,tile);
  return tile;
 }
 function drawRuhrLandmark(ctx,kind,time,start,speed,bottom){
  const tile=ruhrLandmark(kind),period=1460;
  const x=Math.round(((start-time*speed+tile.width)%period+period)%period-tile.width);
  if(x<960&&x+tile.width>0)ctx.drawImage(tile,x,bottom-tile.height);
 }
 function industrialScene(ctx,time,type,hasShops){
  if(!paintedLayer(ctx,type===2?'industryNight':'industry',time,industrialPanorama))return false;
  g=ctx;
  if(type===2){box(0,528,960,12,'#1a2d3e');box(0,533,960,7,'#a06641');for(let i=0;i<18;i++)box((i*63+time*30)%1000,534,23,2,'#f3cc8f');glow(ctx,730,520,100,'#f8994f24')}
  else{
   box(0,533,960,7,'#27394b');
   if(!hasShops){
    const sx=990-(time*24)%1300;
    box(sx,464,123,59,'#314453');box(sx-6,458,135,8,'#bdb598');
    box(sx+5,471,113,17,'#7a4444');label(ctx,'CURRYWURST',sx+61,483,10,'#f1d4a0','center');
    for(let i=0;i<3;i++)window(sx+12+i*34,493,cream,true);
   }
  }
  return true;
 }
 function fallbackScenery(ctx,theme,time,layer,speed){
  const tile=scenery(theme,layer),x=-Math.round((time*speed)%tile.width);
  ctx.drawImage(tile,x,0);
  ctx.drawImage(tile,x+tile.width,0);
 }
 // Two repeating masonry courses use different projection angles and scroll rates.
 function parapet(ctx,time,theme){
  const key='parapet-'+theme;
  let tile=cache.get(key);
  if(!tile){
   tile=document.createElement('canvas');tile.width=192;tile.height=20;
   const old=g;g=tile.getContext('2d');
   const p=themes[theme].stone;
   for(let x=-64;x<192;x+=64){
    poly([[x,10],[x+14,2],[x+77,2],[x+63,10]],p[1]);
    box(x+1,10,62,9,p[3]);box(x+2,10,60,2,p[0]);box(x+7,14,47,2,p[2]);
   }
   g=old;cache.set(key,tile);
  }
  for(const [speed,y,scale] of parapetCourses){
   const width=tile.width*scale;
   for(let x=-Math.floor(time*speed)%width;x<960;x+=width)ctx.drawImage(tile,x,y,width,tile.height*scale);
  }
 }
 const parapetCourses=[[34,524,.75],[82,532,1]];
 const frontageColors=[
  ['#57484d','#967169','#c49b7b','#6b7a68'],
  ['#433147','#865268','#be917c','#716376'],
  ['#3c354b','#7f6575','#a88791','#695d78'],
  ['#1c4b62','#356a77','#77a6a3','#284d61'],
  ['#4b3a54','#a46e72','#d09b8a','#44736f'],
  ['#253141','#50505a','#99827e','#684c48'],
  ['#263241','#62474b','#ac795d','#744439']
 ];
 const foregroundProps=[
  null,[0,[[36,77,148],[357,73,112],[644,82,186],[1008,76,133]]],
  [1,[[8,84,127],[233,83,191],[553,84,126],[824,81,199]]],
  null,[2,[[0,87,212],[338,86,170],[636,87,226],[987,86,164]]],
  [3,[[24,84,200],[354,86,214],[728,87,202]]],
  [3,[[115,87,207],[474,88,230],[845,85,173]]]
 ];
 function frontageTile(scene){
  const props=foregroundProps[scene];
  const atlas=props&&typeof PfertAssets!=='undefined'&&PfertAssets.get('foreground');
  const rect=atlas&&PfertAssets.foregroundFrames?.[props[0]];
  const key='frontage-'+scene+(rect?'-raster':'-fallback');
  if(cache.has(key))return cache.get(key);
  const tile=document.createElement('canvas');
  tile.width=1152;tile.height=82;
  const previous=g;g=tile.getContext('2d');
  const [shadow,base,light,accent]=frontageColors[scene];
  if(rect){
   g.imageSmoothingEnabled=false;
   for(const [x,bottom,width] of props[1]){
    const height=Math.round(width*rect.h/rect.w);
    g.drawImage(atlas,rect.x,rect.y,rect.w,rect.h,x,bottom-height,width,height);
   }
   crispCharacter(g,tile.width,tile.height,scene>=5?'steel':'fabric');
  }else if(scene===0||scene===4){
   // Stone terraces with recessed Iznik panels and raised coping.
   box(0,66,1152,16,shadow);box(0,65,1152,2,light);
   for(let x=0;x<1152;x+=96){
    box(x+5,68,86,11,base);box(x+6,69,84,1,light);box(x+8,72,80,5,accent);
    for(let j=0;j<5;j++){
     const cx=x+16+j*16;
     poly([[cx,72],[cx+3,74],[cx,77],[cx-3,74]],j%2?light:shadow);
    }
   }
   for(const x of [97,387,713,961]){
    box(x,58,11,13,shadow);box(x,57,8,3,light);box(x+1,61,3,9,base);
    if(scene===4){
     for(let j=0;j<5;j++)oval(x+5+j*7,59-(j%2)*4,8,7,['#698379','#426357','#31514e','#283946'],false);
     box(x,64,39,7,base);box(x,64,36,1,light);
    }
   }
  }else if(scene===1){
   // Low foreground awnings. Warm windows are framed by dark timber and canvas seams.
   for(const [x,y,w] of [[26,39,152],[365,48,104],[642,42,132],[941,49,126]]){
    box(x+5,y+16,w-10,27,shadow);box(x+10,y+22,w-20,19,base);
    for(let u=x+17;u<x+w-12;u+=23){
     box(u,y+22,2,21,shadow);box(u+4,y+24,11,10,'#694853');box(u+4,y+24,7,2,'#c9966d');
    }
    poly([[x,y+19],[x+16,y],[x+w-13,y],[x+w,y+19]],shadow);
    for(let u=x+16;u<x+w-17;u+=16){
     poly([[u,y+2],[u+8,y+2],[u+6,y+15],[u-5,y+15]],(u-x)%32===16?base:accent);
     box(u-3,y+16,8,2,light);
    }
    box(x+3,y+19,w-6,3,shadow);
   }
  }else if(scene===2){
   // Broken sandstone strata pass in front of the darker foothills.
   for(const [x,y,w] of [[-15,67,114],[189,56,160],[411,65,94],[628,57,157],[895,62,130],[1095,63,96]]){
    poly([[x,y+16],[x+17,y+6],[x+46,y+6],[x+58,y],[x+w-31,y+1],[x+w,y+13],[x+w,82],[x,82]],shadow);
    poly([[x+4,y+15],[x+20,y+7],[x+w-29,y+6],[x+w-6,y+12],[x+50,y+13],[x+32,y+18]],base);
    box(x+22,y+9,w*.3,1,light);box(x+30,y+15,w*.52,2,accent);
   }
  }else if(scene===3){
   // A second plane of wind ripples crosses the open water at a faster rate.
   for(let i=0;i<58;i++){
    const x=(i*113+47)%1152,y=17+(i*13)%65,w=9+(i%7)*7;
    box(x,y,w,1,i%5===0?'#77a6a366':'#356a7766');
    box(x+4,y+1,Math.floor(w*.68),1,'#1c4b6255');
   }
  }else{
   // Rails, sleepers and plates sit below the playable silhouette of the buildings.
   box(0,75,1152,7,shadow);box(0,76,1152,1,light);
   for(let x=0;x<1152;x+=36){
    poly([[x,79],[x+7,72],[x+19,72],[x+13,81]],base);
    box(x+7,73,5,1,light);box(x+9,77,5,2,accent);
   }
   for(const x of [116,484,858,1089]){
    if(scene===5){
     box(x,56,5,21,shadow);box(x+1,56,2,18,base);
     box(x-3,50,11,10,shadow);box(x-1,52,6,4,'#b49772');
    }else{
     box(x,64,47,7,shadow);box(x,63,46,2,base);
     for(let j=2;j<40;j+=8)box(x+j,65,3,2,light);
    }
   }
  }
  g=previous;cache.set(key,tile);
  return tile;
 }
 function frontage(ctx,time,scene){
  const tile=frontageTile(scene),speed=scene===3?43:scene>=5?48:56;
  for(let x=-Math.floor(time*speed)%tile.width;x<960;x+=tile.width)ctx.drawImage(tile,x,458);
 }
 let districtSnapshot,districtSnapshotTime=-1;
 function background(ctx,theme,time,ruhr,arrival=1){
  drawBackdrop(ctx,theme,time,ruhr);
  if(ruhr||arrival>=1)return;
  const snapshotTime=Math.floor(time);
  if(districtSnapshotTime!==snapshotTime){
   if(!districtSnapshot){
    districtSnapshot=document.createElement('canvas');
    districtSnapshot.width=960;districtSnapshot.height=540;
   }
   drawBackdrop(districtSnapshot.getContext('2d'),(theme+themes.length-1)%themes.length,time,0);
   districtSnapshotTime=snapshotTime;
  }
  ctx.save();
  ctx.globalAlpha=1-arrival;
  ctx.drawImage(districtSnapshot,0,0);
  ctx.restore();
  g=ctx;
 }
 function drawBackdrop(ctx,theme,time,ruhr){
  g=ctx;
  if(ruhr){
   const shops=ruhr===1&&typeof PfertAssets!=='undefined'&&PfertAssets.get('ruhrShops');
   if(!industrialScene(ctx,time,ruhr,shops)){
    if(ruhr===2)nightshift(ctx,time);
    else ruhrBackground(ctx,time,shops);
   }
   if(ruhr===1){
    drawRuhrLandmark(ctx,'zweckel',time,720,23,439);
    if(shops)drawRuhrShops(ctx,shops,time);
    drawRuhrLandmark(ctx,'kopatz',time,1020,36,535);
   }
   frontage(ctx,time,ruhr===2?6:5);
   atmosphere(ctx,time,ruhr===2?6:5);
   return;
  }
  const district=districtPanoramas[theme];
  if(district&&paintedLayer(ctx,district[0],time,{speed:district[1],height:595,bottom:540})){
   frontage(ctx,time,theme);
   atmosphere(ctx,time,theme);
   return;
  }
  const q=themes[theme];
  const skyKey='sky-'+theme;
  let sky=cache.get(skyKey);
  if(!sky){
   sky=document.createElement('canvas');sky.width=960;sky.height=540;g=sky.getContext('2d');
   const gradient=g.createLinearGradient(0,0,0,540);q.sky.forEach((col,i)=>gradient.addColorStop(i/2,col));g.fillStyle=gradient;g.fillRect(0,0,960,540);
   const sunX=745;glow(g,sunX,130,68,theme===2?'#cad8ff0c':'#ffcd9818');oval(sunX,130,42,42,theme===2?['#fff5ce','#eee4be','#c9c4b9','#9b9eac']:['#fff5cb','#ffe0a2','#f3bd87','#dd9c7b'],false);
   if(theme===2){g.fillStyle=q.sky[0];g.beginPath();g.arc(sunX+16,117,36,0,7);g.fill();for(let i=0;i<47;i++){box((i*137+53)%960,82+(i*83)%210,i%4===0?2:1,2,'#eee5d5')}}
   cache.set(skyKey,sky);
  }
  g=ctx;ctx.drawImage(sky,0,0);
  for(let i=0;i<4;i++){const x=((i*290-time*6+29000)%1160)-120;box(x,140+(i%2)*48,90,3,'#ffead51a');box(x+15,135+(i%2)*48,50,3,'#ffead51a')}
  if(!paintedLayer(ctx,'city',time,cityPanorama))fallbackScenery(ctx,theme,time,0,10);
  if(!paintedLayer(ctx,'cityMiddle',time,cityMiddle))fallbackScenery(ctx,theme,time,1,cityMiddle.speed);
  const hasNearArt=paintedLayer(ctx,'cityNear',time,cityNear);
  if(!hasNearArt)fallbackScenery(ctx,theme,time,2,cityNear.speed);
  if(theme===3){box(0,516,960,24,'#43888e');for(let i=0;i<20;i++)box((i*73-time*40+14600)%1020-30,520+(i%3)*5,26,2,'#b8d6b3')}
  else{box(0,533,960,7,q.stone[3]);box(0,533,960,2,q.stone[0])}
  if(theme===1&&!hasNearArt){
   // The market awnings stay below the flight area and move faster than the skyline.
   for(let i=0;i<6;i++){
    const x=Math.round((i*200-(time*52)%1200+1200)%1200)-190;
    poly([[x,540],[x+30,508],[x+140,508],[x+170,540]],'#342840',2);
    for(let j=0;j<5;j++)box(x+35+j*21,510,11,5,'#965d59');
   }
  }
  parapet(ctx,time,theme);
  frontage(ctx,time,theme);
  atmosphere(ctx,time,theme);
 }

 // Grade the scenery behind all actors, then drift low-contrast pixel flecks across it.
 const atmosphereColors=[
  ['#161a382d','#42376024','#d5835228','#e6ac8254'],
  ['#30183c4d','#69274636','#bb623451','#ffc28755'],
  ['#13172f77','#1c244652','#3932603c','#aeb9e65c'],
  ['#08304c59','#16467536','#1b777a43','#9ed5d955'],
  ['#35193757','#65306536','#a0556646','#ebacd65c'],
  ['#121f3752','#243e5245','#7e6d5c3b','#b8c8c94f'],
  ['#13162f61','#251e3b43','#8f391e37','#f2985e6b']
 ];
 function atmosphere(ctx,time,scene){
  const [zenith,air,horizon,mote]=atmosphereColors[scene];
  const key='fog-'+scene;
  if(!cache.has(key)){
   const tile=document.createElement('canvas');tile.width=1;tile.height=540;
   const layer=tile.getContext('2d'),fog=layer.createLinearGradient(0,0,0,540);
   fog.addColorStop(0,zenith);fog.addColorStop(.48,air);fog.addColorStop(1,horizon);
   layer.fillStyle=fog;layer.fillRect(0,0,1,540);cache.set(key,tile);
  }
  ctx.drawImage(cache.get(key),0,0,960,540);
  g=ctx;

  const width=1024;
  for(let i=0;i<24;i++){
   const near=i%3===0;
   const x=((i*149-time*(near?17:7))%width+width)%width-24;
   const rise=scene===6?-time*(4+i%3):Math.sin(time*.7+i)*5;
   const y=scene===6?90+((i*67+rise)%415+415)%415:114+(i*71)%375+rise;
   box(x,y,near?4:2,2,mote);
   if(near)box(x-3,y+2,2,1,air);
  }
  for(let i=0;i<8;i++){
   const x=((i*157-time*18)%width+width)%width-36;
   const y=302+(i*37)%144;
   box(x,y,10+(i%4)*7,1,air);
   box(x+7,y+2,6+(i%3)*4,1,air);
  }
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
 function ruhrBackground(ctx,time,hasShops){
  g=ctx;const gr=g.createLinearGradient(0,0,0,540);gr.addColorStop(0,'#3b4e66');gr.addColorStop(1,'#b4aaa0');g.fillStyle=gr;g.fillRect(0,0,960,540);
  oval(755,135,38,38,['#e1d6ad','#c7bc99','#a7a595','#7d8992']);
  for(let i=0;i<7;i++){const x=((i*190-time*14+19000)%1330)-130;box(x,350,145,190,'#5e6b76');box(x+20,222,22,140,'#5e6b76');box(x+22,222,5,140,'#8b9292');box(x+18,216,26,6,'#374c5c');for(let j=0;j<4;j++){oval(x+31+j*13,201-j*13,15+j*2,12,['#b8b6ac','#a4a5a0','#929ca0','#82929a'])}}
  for(let i=0;i<5;i++){const x=((i*260-time*30+26000)%1300)-100;
   box(x+20,310,8,230,'#334657');box(x+110,310,8,230,'#334657');box(x+12,298,116,14,'#334657');box(x+24,300,98,3,'#91a3a3');
   poly([[x+25,320],[x+116,510],[x+110,510],[x+20,320]],'#465868');poly([[x+113,320],[x+23,510],[x+30,510],[x+119,320]],'#465868');
   oval(x+65,300,15,15,['#bbc1b3','#839a9a','#597580','#314c61']);
   if(!hasShops){
    box(x+145,448,90,92,'#906454');for(let yy=454;yy<540;yy+=10)for(let xx=148;xx<235;xx+=17)box(xx+(yy%20?0:6),yy,12,2,'#c48d6c');
    box(x+140,435,100,14,'#e3cd9d');box(x+143,438,94,8,'#913f40');label(g,'CURRYWURST',x+190,445,8,'#fff3bf','center');window(x+155,470,cream,true);window(x+194,470,cream,true);
   }
  }
  for(let i=0;i<3;i++){const x=((i*390-time*22+39000)%1170)-100;poly([[x-55,530],[x-22,487],[x+13,503],[x+55,530]],'#334759');box(x-7,492,6,3,'#7e8f91')}box(25,390,113,27,'#263f50');label(ctx,'GLÜCK AUF!',81,408,13,'#e7d5a4','center');
  box(0,533,960,7,'#293c4e');
 }
 function whiteMask(sprite){const key='white-'+spriteKey(sprite);if(cache.has(key))return cache.get(key);const off=document.createElement('canvas');off.width=sprite.width;off.height=sprite.height;const c=off.getContext('2d');c.drawImage(sprite,0,0);c.globalCompositeOperation='source-in';c.fillStyle='#fffdf3';c.fillRect(0,0,off.width,off.height);cache.set(key,off);return off}
 const spriteIds=new WeakMap();let nextSpriteId=0;function spriteKey(sprite){if(!spriteIds.has(sprite))spriteIds.set(sprite,++nextSpriteId);return spriteIds.get(sprite)}
 function lightMask(sprite,color){const key='light-'+spriteKey(sprite)+'-'+color;if(cache.has(key))return cache.get(key);const off=document.createElement('canvas');off.width=sprite.width;off.height=sprite.height;const c=off.getContext('2d');c.drawImage(sprite,0,0);c.globalCompositeOperation='source-in';c.fillStyle=color;c.fillRect(0,0,off.width,off.height);cache.set(key,off);return off}
 function blockerCarpet(frame){
  for(let x=-39;x<39;x+=2){
   const fold=Math.round(Math.sin(x*.09+frame*Math.PI/4)*2);
   const top=-27+fold,bottom=26+fold;
   box(x,top,2,bottom-top,'#351c36');
   box(x,top+2,2,bottom-top-4,fold<0?'#a13a56':'#853049');
   box(x,top+4,2,2,'#f5be75');box(x,bottom-5,2,2,'#ed9959');
   box(x,top+8,2,1,'#e47378');box(x,bottom-9,2,1,'#511d41');
   for(let row=-16;row<=16;row+=4)box(x,row+fold+(x%4!==0?1:0),1,1,'#bd5262');
   if((x+39)%4===0){box(x,bottom,1,3,'#f5be75');box(x+1,bottom-1,1,2,'#b87050')}
  }
  for(const x of [-34,34]){
   box(x-2,-20,4,40,'#4a2847');box(x,-19,1,38,'#f1b872');
   for(let y=-18;y<=18;y+=6)box(x-2,y,3,2,'#dc635c');
  }
  for(const x of [-21,0,21]){
   const size=x===0?10:7;
   poly([[x-size,0],[x,-17],[x+size,0],[x,17]],'#542951');
   poly([[x-size+2,0],[x,-13],[x+size-2,0],[x,13]],'#f3b772');
   poly([[x-4,0],[x,-7],[x+4,0],[x,7]],'#3a686c');
   box(x-1,-2,2,4,'#e1e4a1');
   for(const y of [-17,17])box(x-1,y,2,2,'#ffda91');
  }
 }
 function blockerLantern(){
  poly([[-39,-20],[-27,-28],[26,-28],[39,-20],[39,19],[28,28],[-28,28],[-39,19]],'#2f3448',2);
  box(-35,-20,70,40,'#174b56');
  for(const x of [-25,0,25]){
   poly([[x-10,-17],[x,-23],[x+10,-17],[x+10,18],[x,23],[x-10,18]],'#4d9e91',2);
   box(x-6,-14,12,28,'#82d5a2');box(x-4,-10,8,20,'#e8df93');box(x+1,-10,4,20,'#aecf87');
   for(let y=-13;y<=14;y+=6)box(x-7,y,14,2,'#3d7e77');
  }
  for(const y of [-26,23]){box(-33,y,66,3,'#cb9c61');box(-25,y+3,50,2,'#735145')}
  for(const x of [-32,-16,16,32]){box(x,-29,3,6,'#f8d695');box(x,24,3,6,'#ad7c53')}
 }
 function blockerBird(frame){
  const wing=Math.round(Math.sin(frame*Math.PI/4)*3);
  poly([[-39,-19],[-26,-28+wing],[-7,-25],[12,-18],[27,-23],[35,-11],[39,-4],[33,4],
   [24,7],[13,25],[-9,29-wing],[-29,23],[-39,15],[-32,1]],'#81543c',2);
  for(const side of [-1,1])for(let i=0;i<5;i++){
   const x=-35+i*8,y=side*(22-i*2)+wing;
   poly([[x,y],[x+6,y+side*3],[x+18,side*4],[x+9,side*5]],i%2?'#c28550':'#e6a969');
  }
  oval(10,0,20,13,brass);oval(27,-10,9,10,gold);
  poly([[32,-13],[40,-5],[33,0]],'#ffc582');box(28,-13,3,3,'#383144');
  box(3,-4,11,8,'#4c3c4b');box(5,-3,7,5,'#86d7cf');box(7,-2,3,2,'#e5f2c8');
 }
 function blockerBarge(){
  poly([[-40,-13],[-34,-24],[-19,-28],[27,-28],[38,-20],[39,17],[29,27],[-24,27],[-37,16]],'#4b345b',2);
  box(-34,-16,69,35,'#6b4665');
  for(const x of [-23,0,23]){
   const spice=x<0?['#ffc57c','#d77e51']:x===0?['#f5dc84','#c7a150']:['#ef9b8a','#bd5361'];
   box(x-10,-19,20,36,'#412e4c');box(x-8,-14,16,25,'#8c634c');
   poly([[x-7,2],[x-5,-8],[x,-14],[x+4,-10],[x+7,2]],spice[1]);
   box(x-1,-11,2,3,spice[0]);stipple(x-6,-7,12,9,spice[0],'#a2634d',x+23);
   box(x-8,3,16,3,'#e5b786');box(x-7,8,14,2,'#ba8b69');
  }
  box(-34,-23,67,4,'#d2a768');box(-30,18,63,4,'#d2a768');box(-24,23,50,2,'#7b5773');
  for(let x=-29;x<=30;x+=9)box(x,19,2,3,'#fce2a0');
 }
 const blockerSprites={carpet:blockerCarpet,lantern:blockerLantern,bird:blockerBird,barge:blockerBarge};
 function blockerSprite(e){
  const kind=e.patrol?.sprite||'carpet';
  const art=typeof PfertAssets!=='undefined'&&PfertAssets.get('blockers');
  const rect=art&&PfertAssets.blockerFrames?.[kind];
  if(rect)return fittedCharacter(art,rect,'blocker-raster-'+kind,rect.w+4,rect.h+4,rect.w,rect.h,blockerSurfaces[kind]);
  const frame=kind==='carpet'||kind==='bird'?Math.floor(e.age*10)%8:0;
  return makeSprite('blocker-'+kind+'-'+frame,()=>blockerSprites[kind](frame),112,blockerSurfaces[kind]);
 }
 function blocker(ctx,e){
  const sprite=blockerSprite(e);
  const width=Math.round(e.w*1.08),height=Math.round(e.h*(sprite.width===112?1.4:1.06));
  const x=Math.round(e.x-width/2),y=Math.round(e.y-height/2);
  ctx.save();ctx.imageSmoothingEnabled=false;
  ctx.globalAlpha=Math.max(0,Math.min(1,(e.lifetime-e.age)/.45));
  const surface=e.flash>0?whiteMask(sprite):sprite;
  const fade=ctx.globalAlpha,shadow=lightMask(sprite,enemyShadow);
  if(e.patrol?.sprite==='bird'&&e.patrol.side===-1){
   ctx.save();ctx.translate(x+width,y);ctx.scale(-1,1);
   ctx.globalAlpha=fade*.16;ctx.drawImage(shadow,-8,11,width,height);
   ctx.globalAlpha=fade*.36;ctx.drawImage(shadow,-3,4,width,height);
   ctx.globalAlpha=fade;ctx.drawImage(surface,0,0,width,height);ctx.restore();
  }else{
   ctx.globalAlpha=fade*.16;ctx.drawImage(shadow,x+8,y+11,width,height);
   ctx.globalAlpha=fade*.36;ctx.drawImage(shadow,x+3,y+4,width,height);
   ctx.globalAlpha=fade;ctx.drawImage(surface,x,y,width,height);
  }
  if(e.hp<e.max){
   g=ctx;box(e.x-23,e.y+e.h/2-12,46,4,'#302435');
   box(e.x-22,e.y+e.h/2-11,44*e.hp/e.max,2,'#ffd28e');
  }
  ctx.restore();
 }
 function rareEnemySprite(rare){
  const art=typeof PfertAssets!=='undefined'&&PfertAssets.get('rareEnemies');
  const rect=art&&PfertAssets.rareFrames?.[rare.attack];
  if(rect)return fittedCharacter(art,rect,'rare-raster-'+rare.attack,104,104,92,92,rareSurfaces[rare.attack]);
  return makeSprite('rare-'+rare.attack,()=>{
   const color=rare.color,dark='#604359',light='#fff0bf';
   const shell=[light,color,dark,'#443448'];
   switch(rare.attack){
    case 'fan':
     poly([[-26,-4],[-25,-22],[-11,-12],[0,-26],[12,-12],[26,-22],[25,9],[-25,9]],color,3);
     oval(0,7,25,16,['#ffe4a1','#cf9556','#a56449','#693e3a']);
     for(let i=-16;i<=16;i+=8)box(i,12+(i%3)*2,3,2,light);
     for(const [x,y] of [[-24,-20],[-3,-24],[23,-21]])rivet(x,y);
     stipple(-18,6,36,11,'#efce87','#975f4a',3);
     eye(-12,-1,true);eye(3,-1,true);
     break;
    case 'dive':
     poly([[-10,-6],[5,-12],[20,-25],[29,-23],[22,-7],[29,-1],[14,15],[-2,18]],color,3);
     poly([[1,3],[22,-20],[18,-4],[26,-1],[12,10]],light);
     oval(-11,-8,11,12,shell);eye(-17,-12);
     poly([[-19,-7],[-32,-3],[-33,5],[-20,0]],'#edb363',2);
     for(let j=0;j<4;j++)poly([[2+j*4,1-j*4],[15+j*3,-3-j*4],[10+j*3,2-j*4],[5+j*3,6-j*4]],j%2?'#934a46':'#cf8c62');
     break;
    case 'aim':
     poly([[0,-25],[16,-15],[28,0],[16,15],[0,25],[-16,15],[-28,0],[-16,-15]],color,3);
     oval(0,0,22,13,['#fff9ec','#cbe7f1','#76a5bf','#46688e']);
     oval(-4,0,10,10,['#a6f3ff','#4198ba','#2b607f','#23334c']);
     oval(-5,1,5,6,[ink,ink,ink,ink]);glint(-7,-3,'#ffffff');
     for(const [x,y] of [[-22,-5],[-11,-14],[5,-19],[15,-10],[16,5],[-2,17]])rivet(x,y);
     break;
    case 'split':
     poly([[-25,-12],[-5,-25],[24,-15],[25,12],[4,25],[-25,15]],color,3);
     poly([[-25,-12],[-5,-25],[24,-15],[2,-3]],'#ffe4dc');
     poly([[2,-3],[24,-15],[25,12],[4,25]],'#ab587e');
     for(let i=0;i<4;i++)box(-18+i*5,8+(i%2)*5,3,3,'#ffd4cd');
     eye(-17,-8);eye(-6,-6);
     poly([[-16,-16],[-4,-22],[8,-18],[-4,-12]],'#fff0ed');
     poly([[13,-7],[21,-9],[21,5],[11,14]],'#8b496e');
     break;
    case 'arc':
     poly([[-18,-10],[-28,-14],[-29,-22],[-21,-23],[-13,-15],[15,-14],[12,-24],[18,-25],[26,-18],[27,0],[18,10]],brass[2],3);
     oval(0,4,23,18,brass);box(-16,-14,29,4,light);box(-4,-19,8,5,brass[1]);
     eye(-13,-1,true);eye(1,-1,true);
     box(-18,11,34,2,brass[3]);box(-15,12,30,2,brass[0]);
     for(let x=-12;x<=12;x+=8)rivet(x,15);
     break;
    case 'cross':
     for(const sign of [-1,1]){
      poly([[0,-5],[22*sign,-24],[29*sign,-19],[25*sign,1],[15*sign,17],[4*sign,11]],color,3);
      poly([[5*sign,-2],[22*sign,-18],[21*sign,-2],[14*sign,6]],'#8c70b1');
      box(19*sign-2,-13,4,4,light);
      poly([[9*sign,4],[22*sign,-4],[19*sign,4],[12*sign,12]],'#bb879c');
     }
     oval(0,2,8,18,['#ead9ff','#ad8fc9','#685579','#483950']);eye(-5,-10);
     break;
    case 'mine':
     for(const sign of [-1,1]){
      poly([[3*sign,8],[21*sign,10],[28*sign,19],[21*sign,22],[15*sign,16],[7*sign,16]],dark,2);
      poly([[17*sign,3],[21*sign,-11],[28*sign,-17],[30*sign,-7],[26*sign,5]],color,2);
     }
     oval(0,4,20,14,['#ffe0a5',color,'#a1544e','#70394a']);
     eye(-11,-6,true);eye(3,-6,true);
     for(const sign of [-1,1]){rivet(sign*15-2,8,copper);box(sign*23-2,12,5,2,copper[0])}
     louvers(-4,5,2,copper);
     break;
    case 'pulse':
     box(-4,-27,8,5,brass[2]);
     poly([[0,-24],[18,-16],[23,13],[9,23],[-9,23],[-23,13],[-18,-16]],brass[1],3);
     poly([[-12,-13],[12,-13],[16,11],[0,18],[-16,11]],light,2);
     box(-2,-13,4,29,brass[2]);box(-19,12,38,4,brass[2]);
     glint(-8,0,'#ffffff');glint(8,-5,'#ffffff');
     box(-15,-13,30,2,brass[0]);box(-14,15,28,2,brass[0]);
     rivet(-19,5);rivet(16,5);
     break;
    case 'lanes':
     poly([[-30,-10],[-19,-17],[0,-8],[19,-17],[30,-10],[25,12],[9,16],[0,23],[-9,16],[-25,12]],color,3);
     poly([[-26,-9],[-17,-12],[0,-4],[17,-12],[26,-9],[16,7],[0,14],[-16,7]],'#427f86');
     for(let i=-21;i<=21;i+=7)box(i,8+Math.abs(i)%5,3,4,light);
     eye(-10,-5);eye(3,-5);
     for(const sign of [-1,1]){
      poly([[8*sign,4],[22*sign,-10],[24*sign,-4],[16*sign,5]],'#7ab9aa');
      box(sign*15-2,9,4,2,'#d2bd8d');
     }
     break;
    case 'scissor':
     poly([[-16,-14],[-13,-24],[-6,-20],[0,-28],[6,-20],[14,-24],[17,-14]],'#adc083',2);
     poly([[-21,-12],[-25,2],[-17,17],[-20,24],[-9,21],[-2,26],[6,19],[16,23],[12,15],[23,7],[23,-9],[14,-16],[-13,-16]],color,3);
     oval(0,1,15,13,['#ffe0be','#bb4d70','#8b345d','#60324f']);
     for(let i=0;i<5;i++)box(-12+i*5,7+(i%2)*3,3,3,'#ffb5a3');
     eye(-12,-6);eye(2,-6);
     stipple(-14,0,29,11,'#ec8b96','#762e53',8);
     break;
   }
  },104,rareSurfaces[rare.attack]);
 }
 function crystal(x,y,w,h,p){
  const left=[x-w,y],top=[x,y-h],right=[x+w,y],foot=[x,y+h],ridge=[x-2,y+2];
  poly([left,top,right,foot],ink,2);
  poly([left,top,ridge],p[0]);poly([top,right,ridge],p[1]);
  poly([right,foot,ridge],p[3]);poly([foot,left,ridge],p[2]);
  poly([[x-w*.72,y-h*.04],[x-1,y-h*.72],[x-4,y-h*.22],[x-w*.52,y+h*.08]],p[0]);
  poly([[x+1,y-h*.82],[x+w*.75,y-2],[x+w*.34,y-5],[x+2,y-h*.45]],p[2]);
  poly([[x-1,y+4],[x+w*.7,y+2],[x+1,y+h*.75],[x+w*.32,y+h*.28]],p[2]);
  box(x-w*.55,y-h*.21,Math.max(2,Math.floor(w*.2)),2,'#fff4d9');
 }
 const glass=['#e2fff2','#70d9c8','#39848e','#29465e'];
 const amethyst=['#ffe4fb','#bf94e3','#795b9d','#403b66'];
 function machineSprite(kind){
  const index=['weaver','diver','beacon'].indexOf(kind);
  const surface=kind==='diver'?'brass':'glass';
  const raster=workshopSprite(5+index,surface,70);
  if(raster)return raster;
  return makeSprite('enemy-machine-'+kind,()=>{
   if(kind==='weaver'){
    for(const side of [-1,1]){
     poly([[-28,side*16],[3,side*21],[26,side*11],[2,side*8]],glass[2],2);
     poly([[-27,side*16],[-7,side*18],[8,side*18],[19,side*13],[3,side*14]],glass[3]);
     box(-27,side*16,22,2,glass[1]);box(9,side*11,12,5,gold[2]);box(9,side*11,8,1,gold[0]);
     poly([[-28,side*16],[-14,side*18],[-12,side*14],[-22,side*12]],gunmetal[2]);
     for(const x of [-24,-16,13])rivet(x,side*14-2);
    }
    oval(2,0,23,15,gunmetal);louvers(-22,-4,2,gunmetal);
    crystal(1,0,19,13,glass);
    rivet(15,-8);rivet(15,5);
   }else if(kind==='diver'){
    poly([[-21,5],[2,-24],[17,-17],[8,0],[22,17],[9,23]],gold[2],2);
    poly([[-21,5],[2,-24],[9,-19],[-5,5]],gold[0]);
    poly([[2,-23],[16,-17],[9,-7],[5,-7],[10,-17]],copper[3]);
    poly([[10,8],[22,17],[9,23],[0,17]],copper[2]);
    oval(0,3,17,13,brass);oval(0,3,12,9,gunmetal);
    crystal(-2,2,8,7,copper);box(-19,1,9,4,'#ae6b5e');box(-18,1,7,2,'#ffac73');
    for(const [x,y] of [[-10,8],[7,8],[2,-19],[10,14]])rivet(x,y);
   }else{
    for(const side of [-1,1]){
     const x=side*18;
     box(x-5,-13,10,32,brass[3]);box(x-5,-13,3,29,brass[1]);
     box(x-7,12,14,5,brass[2]);box(x-7,12,11,1,brass[0]);rivet(x-2,13);
     crystal(x,-12,8,9,amethyst);
    }
    poly([[-20,10],[-9,4],[8,4],[21,10],[12,23],[-12,23]],gunmetal[2],2);
    box(-12,18,22,2,gunmetal[0]);louvers(-4,12,2,gunmetal);
    crystal(0,-2,17,22,amethyst);
   }
  },104,surface);
 }
 const enemyShadow='#22283e';
 function spriteShadow(ctx,sprite,x,y,scale=1){
  const shadow=lightMask(sprite,enemyShadow);
  ctx.globalAlpha=.16;placeSprite(ctx,shadow,x+9,y+11,scale);
  ctx.globalAlpha=.36;placeSprite(ctx,shadow,x+3,y+4,scale);
  ctx.globalAlpha=1;
 }
 function rightFacingSprite(sprite,surface){
  const key='right-facing-'+spriteKey(sprite);
  if(!cache.has(key)){
   const mirrored=document.createElement('canvas');
   mirrored.width=sprite.width;mirrored.height=sprite.height;
   const ctx=mirrored.getContext('2d');
   ctx.imageSmoothingEnabled=false;
   ctx.save();ctx.translate(mirrored.width,0);ctx.scale(-1,1);ctx.drawImage(sprite,0,0);ctx.restore();
   crispCharacter(ctx,mirrored.width,mirrored.height,surface);
   cache.set(key,mirrored);
  }
  return cache.get(key);
 }
 function enemy(ctx,e,theme,ruhr,light=null){
  if(e.blocker){blocker(ctx,e);return}
  const frame=e.i===4?Math.floor(e.age*8)%2:0;
  const base=e.machine?machineSprite(e.machine):e.rareEnemy?rareEnemySprite(e.rareEnemy):enemySprite(e.i,theme,frame,ruhr);
  const sprite=e.rear?rightFacingSprite(base,enemySurfaces[e.i]):base;
  if(e.machine&&e.aimTarget){g=ctx;glint(e.x-26,e.y,'#fff0ac')}
  ctx.save();ctx.translate(Math.round(e.x),Math.round(e.y));
  spriteShadow(ctx,sprite,0,0,e.i===9?1:.85);
  placeSprite(ctx,sprite,0,0,e.i===9?1:.85);
  if(e.flash>0)placeSprite(ctx,whiteMask(sprite),0,0,e.i===9?1:.85);else if(light&&light.strength>.05){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=light.strength*.3;placeSprite(ctx,lightMask(sprite,light.color),0,0,e.i===9?1:.85)}ctx.restore();
  if(e.elite){g=ctx;poly([[e.x-8,e.y-e.h/2-13],[e.x,e.y-e.h/2-22],[e.x+8,e.y-e.h/2-13],[e.x,e.y-e.h/2-9]],'#ffdf9a',2)}
  if(e.slowTime>0){ctx.save();ctx.strokeStyle='#8ce7ff';ctx.lineWidth=1;ctx.beginPath();ctx.arc(e.x,e.y,e.w*.48,.2,4.9);ctx.stroke();ctx.restore()}
  if(e.hp<e.max){ctx.fillStyle='#302c3a';ctx.fillRect(e.x-16,e.y-e.h/2-10,32,3);ctx.fillStyle='#f0bd7d';ctx.fillRect(e.x-16,e.y-e.h/2-10,32*Math.max(0,e.hp/e.max),2)}
 }
 function horse(ctx,p,time,limit){
  g=ctx;const frame=Math.floor(time*9)%4;const blink=p.inv>0&&Math.floor(p.inv*12)%2;
  if(p.overdrive>0){
   glow(ctx,p.x,p.y,58,'#81eaff55');ctx.save();ctx.strokeStyle='#d6faff99';ctx.lineWidth=1.5;for(let i=0;i<2;i++){ctx.beginPath();ctx.ellipse(p.x,p.y,38+i*6,22+i*5,time*(i?2:-2),0,7);ctx.stroke()}ctx.restore();for(let i=0;i<6;i++){const angle=time*4+i*1.047;glint(p.x+Math.cos(angle)*42,p.y+Math.sin(angle)*31,'#d3f9ff')}
  }
  if(!blink){
   // Sparse, stepped flecks behind the silhouette use no particle slots.
   const wind=p.overdrive>0?'#b8f4ff':'#f6bd7d';
   ctx.save();
   for(let i=0;i<6;i++){
    const age=(time*2.2+i/6)%1;
    const x=p.x-27-age*40,y=p.y+7+((i*7)%17-8)*age;
    ctx.globalAlpha=(1-age)*.48;
    box(x,y,i%3===0?5:2,2,wind);
    if(i%3===0)box(x-3,y+2,2,1,wind);
   }
   ctx.restore();
   const mount=horseSprite(frame),pitch=Math.round((p.bank||0)*3);
   ctx.save();ctx.translate(Math.round(p.x),Math.round(p.y));ctx.rotate(pitch*Math.PI/96);
   ctx.globalAlpha=.23;placeSprite(ctx,lightMask(mount,'#202638'),4,7,.67);ctx.globalAlpha=1;
   placeSprite(ctx,mount,0,0,.67);
   if(p.charging||p.muzzle>0){
    ctx.globalCompositeOperation='lighter';ctx.globalAlpha=p.muzzle>0?.22:.05+Math.min(1,p.charge/limit)*.14;
    placeSprite(ctx,lightMask(mount,'#b5e9ff'),0,0,.67);
   }
   ctx.restore();
  }
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
  const f=Math.min(1,d.age/(d.boss?1.2:.72));
  const base=d.boss?bossSprite(d.i,theme):d.machine?machineSprite(d.machine):d.blocker?blockerSprite(d):d.rareEnemy?rareEnemySprite(d.rareEnemy):enemySprite(d.i,theme,0,d.secret);
  const sprite=d.rear?rightFacingSprite(base,enemySurfaces[d.i]):base;
  if(d.age<(d.boss?.95:.62)){ctx.save();ctx.globalAlpha=Math.min(1,(1-f)*1.25);placeSprite(ctx,explosionSprite(Math.min(7,Math.floor(d.age/(d.boss?.12:.08))),!!d.boss,[3,7,9].includes(d.i)),d.x,d.y,1);ctx.restore()}
  ctx.save();ctx.globalAlpha=(1-f)*.85;
  const width=d.boss?sprite.width:d.blocker?d.w:80;
  const height=d.blocker?d.h:width;
  for(let i=0;i<3;i++){ctx.save();ctx.translate(d.x+(i-1)*f*55,d.y+f*f*80-(i===1?f*35:0));ctx.rotate((i-1)*f*1.7);ctx.drawImage(sprite,0,i*sprite.height/3,sprite.width,sprite.height/3,-width/2,-height/2+i*height/3,width,height/3);ctx.restore()}
  ctx.restore();
  if(d.boss||d.blocker){
   g=ctx;
   ctx.save();
   ctx.globalAlpha=Math.pow(1-f,2)*.85;
   const sparks=['#ffeed0','#f6ae71','#e36f57','#ae6d85'];
   for(let i=0;i<24;i++){
    const angle=i*2.39996,radius=38+f*(95+(i*37)%135);
    const x=d.x+Math.cos(angle)*radius,y=d.y+Math.sin(angle)*radius*.66+f*f*35;
    box(x,y,2+(i%3)*2,2,sparks[i%4]);
    if(i%3===0)box(x+2,y-2,2,2,sparks[0]);
   }
   ctx.restore();
  }
  if(!d.boss&&!d.rareEnemy&&!d.blocker){g=ctx;ctx.save();ctx.globalAlpha=1-f;
   if(d.i===2||d.i===8){for(let i=0;i<3;i++){const x=d.x+(i-1)*f*85,y=d.y-20*f+f*f*85;oval(x,y,6,8,['#f2bb93','#d28f70','#9e5a54','#683e4b']);box(x-1,y-2,2,2,'#fff1ce')}}
   else if(d.i===3||d.i===7){ctx.save();ctx.translate(d.x+f*25,d.y-45*f);ctx.rotate(f*3);oval(0,0,13,4,brass);box(-3,-8,6,5,gold[1]);ctx.restore();for(let i=0;i<3;i++)glow(ctx,d.x+(i-1)*11,d.y-f*(35+i*20),8+f*7,'#edf2dc44')}
   else if(d.i===0){for(let i=0;i<9;i++)box(d.x+Math.sin(i*7)*f*65,d.y+Math.cos(i*7)*f*45+f*f*30,3,2,'#f9db9a')}
   else if(d.i===4){for(let i=0;i<5;i++)poly([[d.x+(i-2)*f*24,d.y+f*40],[d.x+(i-2)*f*24+7,d.y+f*40-4],[d.x+(i-2)*f*24+3,d.y+f*40+5]],'#92769b')}
   else if(d.i===1||d.i===6){for(let i=0;i<5;i++)box(d.x+(i-2)*f*16,d.y+18+f*35,2,7,'#edbf7c')}
   ctx.restore();
  }
 }

 function machineBoss(i){
  const atlas=typeof PfertAssets!=='undefined'&&PfertAssets.get('workshopBosses');
  const rect=atlas&&PfertAssets.workshopBossFrames?.[i-7];
  if(rect){
   const width=i===7?186:213;
   return fittedCharacter(atlas,rect,'workshop-boss-'+i,256,256,width,200,bossSurfaces[i]);
  }
  return makeSprite('boss-machine-'+i,()=>{
   if(i===7){
    // A brass orrery cradles three cut lenses.
    oval(0,16,67,23,gunmetal);
    oval(0,7,67,23,brass);oval(0,4,55,15,['#586e72','#3e505b','#314355','#263447']);
    for(let j=0;j<11;j++){
     const x=-58+j*11,y=23+Math.round(6*(1-Math.abs(x)/60));
     box(x,y,8,6,gunmetal[3]);box(x,y,8,1,brass[1]);box(x+2,y+2,3,2,j%3?gunmetal[1]:glass[1]);
    }
    for(const side of [-1,1]){
     poly([[side*67,9],[side*59,-39],[side*38,-51],[side*32,-12],[side*42,14]],gold[2],2);
     poly([[side*59,-37],[side*61,-22],[side*65,9],[side*58,13],[side*53,-21]],gold[3]);
     poly([[side*39,-48],[side*42,-42],[side*37,-13],[side*33,-12]],gold[0]);
     crystal(side*51,-28,15,26,amethyst);
     for(const y of [-1,9])rivet(side*52-2,y);
    }
    poly([[-25,36],[-12,62],[0,71],[14,61],[26,34],[15,25],[-18,25]],brass[3],2);
    poly([[-24,33],[-9,61],[-2,60],[-16,33]],brass[0]);
    crystal(0,42,20,24,amethyst);
    oval(0,12,34,8,brass);
    crystal(0,-20,36,51,glass);
    poly([[-35,-21],[-25,-21],[-20,-17],[-13,-17],[-14,-15],[-27,-15]],'#aeecd7');
    box(-17,-37,6,2,'#e7fae0');box(-16,-39,3,2,'#fff5cc');
    rivet(-28,10);rivet(25,10);
   }else{
    poly([[-82,5],[-49,-16],[61,-16],[81,1],[52,40],[-47,40]],glass[3],3);
    poly([[-82,5],[-42,-17],[64,-17],[79,1],[33,13],[-61,14]],glass[1]);
    poly([[-61,17],[36,16],[77,3],[49,34],[-43,34]],glass[2]);
    poly([[-60,30],[-12,32],[48,30],[52,35],[41,40],[-43,40]],gunmetal[3]);
    poly([[-76,5],[-51,-9],[64,-10],[70,-4],[26,6],[-59,9]],gunmetal[2]);
    poly([[-71,3],[-50,-8],[50,-8],[42,-6],[-47,-4],[-64,5]],gunmetal[0]);
    for(const y of [18,24,30]){
     box(-42,y,29,2,gunmetal[3]);box(-40,y+1,24,1,glass[1]);
     box(23,y,25,2,gunmetal[3]);box(24,y+1,22,1,glass[1]);
    }
    for(const x of [-26,44]){
     box(x-12,-44,24,38,brass[3]);box(x-11,-44,9,38,brass[1]);box(x-11,-43,3,34,brass[0]);
     box(x-8,-28,19,3,brass[2]);box(x-8,-16,19,3,gunmetal[2]);
     for(const y of [-29,-17])rivet(x+4,y,copper);
     oval(x,-44,17,7,brass);box(x-9,-46,18,3,ink);
     oval(x,14,13,8,gunmetal);crystal(x,14,8,5,gold);
    }
    for(let x=-22;x<28;x+=10){
     box(x,-4,7,5,gunmetal[3]);box(x+1,-3,4,2,glass[x<0?0:1]);
     rivet(x,26,gunmetal);
    }
    poly([[-24,37],[-17,55],[18,55],[26,37],[19,26],[-16,26]],gunmetal[3],2);
    box(-18,35,36,3,gunmetal[1]);
    crystal(0,40,17,15,glass);
   }
  },256,bossSurfaces[i]);
 }
 function bossSprite(i,theme){
  if(i>=7)return machineBoss(i);
  if(i>=2&&i<=4&&typeof PfertAssets!=='undefined'){
   const atlas=PfertAssets.get('caravanBosses'),rect=atlas&&PfertAssets.caravanBossFrames?.[i-2];
   if(rect)return fittedCharacter(atlas,rect,'caravan-boss-'+i,256,256,220,220,bossSurfaces[i]);
  }
  const raster=rasterSprite([12,13,2,5,9,14,15][i],256,bossSurfaces[i]);
  if(raster)return raster;
  return makeSprite('boss-'+i+'-'+theme,()=>{
  g.scale(2.0,2.0);g.translate(7,0);
  if(i===0){carpet(26);rider();poly([[-26,-25],[-18,-41],[-2,-31],[13,-43],[25,-23]],gold[1],2);box(-18,-25,35,3,gold[0])}
  else if(i===1){pot();poly([[-16,-29],[-14,-40],[-5,-34],[3,-42],[12,-30]],gold[1],2)}
  else if(i===2){g.rotate(-.4);sausage(true);box(-14,-30,26,8,gold[2]);poly([[-12,-30],[-11,-41],[-2,-34],[7,-42],[12,-30]],gold[1],2)}
  else if(i===3){vortex();oval(0,-28,18,8,['#c4bbf3','#8a80c8','#655f99','#434b78']);glint(0,-29,'#fff2bd')}
  else if(i===4){g.save();g.scale(-1,1);camel();g.restore()}
  else if(i===6){poly([[-26,29],[-26,-18],[-18,-30],[18,-30],[26,-18],[26,29]],'#496273',2);box(-20,-17,8,44,'#96a7a0');box(14,-14,9,42,'#243e54');box(-18,-42,11,16,'#5d7e88');box(8,-46,11,20,'#5d7e88');box(-20,-43,15,4,'#abbfb3');box(6,-47,15,4,'#abbfb3');oval(0,-5,15,17,['#ffe5ad','#e8a064','#b76645','#6e4242']);box(-11,-9,23,4,'#f9d19a');box(-8,3,16,11,'#7c463f');for(let k=0;k<3;k++)box(-6+k*5,3,2,10,'#ffe7a0');box(-24,21,48,8,'#283c51')}
  else{poly([[-24,-5],[-19,-24],[18,-24],[26,-2],[21,31],[-22,31]],'#2f6ca9',2);box(-20,-1,42,6,'#efe9d3');box(-21,18,42,5,'#efe9d3');oval(0,-24,18,15,['#ffdfb2','#e7b887','#ba8968','#785962']);box(-21,-38,42,8,'#e7e5d2');box(-18,-44,36,7,'#2965a3');eye(-11,-26,true);eye(2,-26,true);box(-8,-12,18,4,'#754d48');label(g,'04',0,16,17,'#fff4d6','center')}
  },256,bossSurfaces[i]);
 }
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
   {name:'Vordere Beine',points:[[-70,42],[10,42],[7,49],[-23,55],[-30,76],[-46,93],[-59,92],[-58,77],[-80,71],[-84,59]],aim:[-44,64],role:2},
   {name:'Hintere Beine',points:[[14,42],[100,42],[111,51],[112,62],[107,72],[90,82],[76,81],[63,66],[44,55],[34,49]],aim:[76,63],role:2}
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
 function region(name,points,aim,role){return {name,points,aim,role}}
 bodyRegions.push([
  region('Zenitprisma',[[-39,-26],[7,-93],[53,-26],[7,38]],[8,-30],0),
  region('Westlinse',[[-80,6],[-65,-61],[-38,-67],[-48,4]],[-60,-30],2),
  region('Ostlinse',[[58,4],[54,-67],[79,-58],[95,8]],[73,-30],2),
  region('Messingwiege',[[-84,6],[97,8],[93,35],[72,48],[36,48],[8,90],[-22,48],[-59,47],[-82,33]],[6,55],1)
 ],[
  region('Bugschlot',[[-49,-63],[-6,-63],[-9,-18],[-46,-18]],[-27,-41],2),
  region('Heckschlot',[[44,-63],[88,-63],[85,-18],[47,-18]],[64,-41],2),
  region('Schleusendeck',[[-100,7],[-55,-22],[87,-22],[112,1],[53,20],[-73,21]],[0,0],0),
  region('Turbinenkiel',[[-74,21],[53,20],[111,2],[74,52],[30,54],[8,72],[-18,54],[-54,52]],[0,37],1)
 ]);
 function bossLayout(i){return bodyRegions[i].map((part,index)=>({...part,index,points:part.points.map(p=>[...p]),aim:[...part.aim]}))}
 function boss(ctx,b,ruhr){
  const sprite=bossSprite(b.i,ruhr?3:0);
  ctx.save();ctx.translate(Math.round(b.x),Math.round(b.y));
  spriteShadow(ctx,sprite,7,0);
  placeSprite(ctx,sprite,7,0);
  for(const part of b.parts){
   ctx.save();ctx.beginPath();part.points.forEach((point,i)=>i?ctx.lineTo(point[0],point[1]):ctx.moveTo(point[0],point[1]));ctx.closePath();ctx.clip();
   if(part.flash>0){placeSprite(ctx,whiteMask(sprite),7,0,1)}
   else if(part.hp>0&&part.slowTime>0){ctx.globalAlpha=.17;placeSprite(ctx,lightMask(sprite,'#8be3ff'),7,0,1)}
   else if(part.hp<=0){ctx.globalAlpha=.76;placeSprite(ctx,lightMask(sprite,'#101d2c'),7,0,1)}
   else if(part.hp/part.max<.5){ctx.globalAlpha=.18;placeSprite(ctx,lightMask(sprite,'#3f2b38'),7,0,1)}
   ctx.restore();
  }
  ctx.restore();
  if(b.encounter?.cue==='warning'){
   const direction=Math.sign(b.encounter.toY-b.y),x=b.x-105,y=b.y;
   ctx.save();ctx.strokeStyle='#ffe4af';ctx.lineWidth=4;ctx.beginPath();
   ctx.moveTo(x,y-direction*20);ctx.lineTo(x,y+direction*20);
   ctx.moveTo(x-10,y+direction*10);ctx.lineTo(x,y+direction*20);ctx.lineTo(x+10,y+direction*10);
   ctx.stroke();ctx.restore();
  }
 }
 function bossStrikeWarning(ctx,b){
  const strike=b.strike;
  if(!strike||strike.elapsed>=strike.warning)return;
  ctx.save();
  ctx.beginPath();ctx.moveTo(strike.toX,b.y);ctx.lineTo(b.x-70,b.y);
  ctx.strokeStyle='#25191f';ctx.lineWidth=7;ctx.stroke();
  ctx.strokeStyle='#ffd18c';ctx.lineWidth=3;ctx.setLineDash([12,6]);ctx.stroke();
  ctx.restore();
 }

 // Only 8 three-segment and 16 four-segment combinations are possible.
 const shieldDials=new Map();
 function shieldDial(ctx,player,mask,segments){
  const key=segments*16+mask;
  let dial=shieldDials.get(key);
  if(!dial){
   dial=document.createElement('canvas');dial.width=128;dial.height=128;
   const pen=dial.getContext('2d');
   pen.translate(64,64);pen.lineWidth=3;pen.shadowBlur=10;pen.shadowColor='#8df6ff';
   for(let i=0;i<segments;i++){
    const ready=!!(mask&(1<<i)),start=-Math.PI/2+i*Math.PI*2/segments;
    pen.strokeStyle=ready?'#9ffaff':'#50686a';pen.globalAlpha=ready?.95:.35;
    pen.beginPath();pen.arc(0,0,43,start+.08,start+Math.PI*2/segments-.08);pen.stroke();
   }
   pen.globalAlpha=1;pen.shadowBlur=0;
   shieldDials.set(key,dial);
  }
  ctx.drawImage(dial,Math.round(player.x)-64,Math.round(player.y)-64);
 }
 function hitCue(ctx,p,now){
  const age=now-(p.lastDamage?.time??-Infinity);
  if(age<0||age>=.35)return;
  g=ctx;
  ctx.save();
  ctx.translate(p.x,p.y);
  ctx.rotate(p.lastDamage.angle);
  ctx.globalAlpha=Math.min(1,(.35-age)*6);
  poly([[27,0],[42,-9],[39,0],[42,9]],'#ff836a',2);
  poly([[30,0],[37,-4],[37,4]],'#fff2d0');
  ctx.restore();
 }
 const orbPalettes=[
  ['#589bff','#3250a6','#b4e9ff'],['#64e48c','#257b64','#daffc1'],
  ['#ff6565','#a23d57','#ffe2a6'],['#ffd163','#a36737','#fff4b0']
 ];
 // Octagonal enamel seal. Leave its centre transparent so incoming shots stay visible.
 function starGate(ctx,gate,index,active,time,nextDirection){
  const seal=makeSprite('star-post',()=>{
   const outer=[[-9,-30],[9,-30],[20,-19],[20,19],[9,30],[-9,30],[-20,19],[-20,-19]];
   const inner=outer.map(([x,y])=>[Math.round(x*.75),Math.round(y*.82)]);
   const facets=['#fff0b5','#c6d7a6','#568981','#356174','#35546a','#6c9992','#c7dfb3','#fff0b5'];
   for(let i=0;i<8;i++){
    const j=(i+1)%8;
    poly([outer[i],outer[j],inner[j],inner[i]],facets[i],1);
   }
   crystal(0,-30,6,5,glass);
   box(-4,30,8,3,brass[2]);box(-2,33,4,5,gold[1]);
  });
  ctx.save();ctx.globalAlpha=active?1:.58;
  placeSprite(ctx,seal,gate.x,gate.y,.98);
  g=ctx;
  const x=Math.round(gate.x),y=Math.round(gate.y);
  for(let i=0;i<3;i++)box(x-8+i*6,y+49,4,3,i<=index?'#ffebad':'#4a6465');
  if(active){
   const drift=Math.floor(time*6)%4;
   glint(x-17,y-27+drift,'#f7f4bf');
   if(nextDirection){
    const tx=x+31,ty=y+nextDirection*20;
    box(tx-5,ty-5,11,11,'#294558');
    for(let i=0;i<3;i++)box(tx-i*2,ty+nextDirection*(3-i*2),1+i*4,2,'#c7f2d4');
   }
  }
  ctx.restore();
 }
 function experienceOrb(ctx,orb){
  const tier=orb.tier||1,palette=orbPalettes[orb.kind==='boss'?3:tier-1];
  const x=Math.round(orb.x),y=Math.round(orb.y);
  g=ctx;
  ctx.save();
  ctx.beginPath();ctx.arc(x,y,7,0,Math.PI*2);
  ctx.fillStyle=palette[0];ctx.fill();
  ctx.strokeStyle='#162033';ctx.lineWidth=2;ctx.stroke();
  box(x-4,y+4,8,2,palette[1]);box(x+4,y+2,2,3,palette[1]);
  box(x-4,y-4,6,2,palette[2]);box(x-5,y-2,2,2,palette[2]);
  for(let i=0;i<tier;i++){
   const markX=x-(tier-1)*2+i*4-1;
   box(markX-1,y-2,4,4,'#192333');
   box(markX,y-1,2,2,'#f3ffff');
  }
  ctx.restore();
 }
 function elementalAura(ctx,b){const e=b.elements;if(!e)return;const r=Math.max(5,Math.min(20,b.w*.65)),age=b.age||0;g=ctx;ctx.save();ctx.translate(Math.round(b.x),Math.round(b.y));
  if(e.frost>0){ctx.shadowColor='#8feaff';ctx.shadowBlur=12;ctx.globalAlpha=.85;for(let i=0;i<6;i++){const angle=age*3+i*Math.PI/3;box(Math.cos(angle)*r,Math.sin(angle)*r,2,3,'#c9f9ff')}}
  if(e.fire>0){ctx.shadowColor='#ff732f';ctx.shadowBlur=12;ctx.globalAlpha=.85;for(let i=0;i<6;i++){const x=-r-i*5,y=Math.sin(age*17+i)*r*.5;poly([[x,y],[x-7,y-3],[x-4,y+3]],i%2?'#ffe0a4':'#ff9565')}}
  if(e.lightning||e.chainBonus>0){ctx.shadowColor='#ffe26b';ctx.shadowBlur=10;ctx.globalAlpha=.9;ctx.strokeStyle='#e2f5ff';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-r,-r*.4);ctx.lineTo(-r*.4,-r*.7);ctx.lineTo(r*.3,-r*.3);ctx.lineTo(r,r*.2);ctx.stroke()}
  if(e.earth||e.forkBonus>0){ctx.shadowColor='#e9b477';ctx.shadowBlur=8;ctx.globalAlpha=.9;for(let i=0;i<4;i++){const angle=age*4+i*Math.PI;poly([[Math.cos(angle)*r,Math.sin(angle)*r-3],[Math.cos(angle)*r+3,Math.sin(angle)*r],[Math.cos(angle)*r-2,Math.sin(angle)*r+2]],'#e4bd87')}}ctx.restore();
 }
 const shotColors={red:'#ffbb77',white:'#a7ffdd',rose:'#ffbde5',port:'#d8baff',speed:'#a8eaff',prism:'#b6f7ff',saw:'#d3e7ae',chain:'#c3ecff',orbit:'#d3c6ff',mortar:'#ffd7a2',wave:'#c4ffe7',frost:'#c9f6ff',vortex:'#c7adff',phoenix:'#ffcf96',echo:'#edc8ff',satellite:'#f5b4db'};
 function pixelRibbon(ctx,x1,y1,x2,y2,thickness,stride=3){
  const steps=Math.max(1,Math.ceil(Math.max(Math.abs(x2-x1),Math.abs(y2-y1))/stride));
  for(let i=0;i<=steps;i++){
   const x=Math.round((x1+(x2-x1)*i/steps)/2)*2,y=Math.round((y1+(y2-y1)*i/steps)/2)*2;
   ctx.fillRect(x,y-Math.floor(thickness/2),stride,thickness);
  }
 }
 function trail(ctx,b){
  elementalAura(ctx,b);
  if(!b.trail||b.trail.length<2)return;
  const col=shotColors[b.style]||'#b8edff';
  ctx.save();
  for(let i=1;i<b.trail.length;i++){
   const p=b.trail[i-1],q=b.trail[i],f=i/b.trail.length;
   const thickness=Math.max(1,Math.round(Math.min(6,b.w*.18)*f));
   ctx.globalAlpha=f*(b.charged?.52:.32);
   ctx.fillStyle=col;
   pixelRibbon(ctx,p.x,p.y,q.x,q.y,thickness);
   if(b.charged&&i%2===0){
    ctx.fillRect(Math.round(q.x),Math.round(q.y-4-Math.sin(i*3+(b.age||0)*9)*4),2,2);
   }
  }
  ctx.restore();
 }
 function spark(ctx,p){const f=Math.max(0,p.life/p.maxLife),x=Math.round(p.x),y=Math.round(p.y),size=Math.max(1,Math.round(p.size*f));ctx.save();ctx.globalAlpha=f;ctx.strokeStyle=p.col;ctx.lineWidth=Math.max(1,size*.65);ctx.beginPath();ctx.moveTo(x-Math.round(p.vx*.022),y-Math.round(p.vy*.022));ctx.lineTo(x,y);ctx.stroke();ctx.fillStyle=p.col;ctx.fillRect(x,y,size,size);if(f>.55&&size>2){ctx.fillStyle='#fff6df';ctx.fillRect(x,y,1,1)}ctx.restore()}
 const projectileFrames=['normal','red','white','rose','speed','prism','saw','chain','orbit','mortar','wave','frost','vortex','phoenix','echo','satellite'];
 function paintProjectile(ctx,b,age){
  const sheet=typeof PfertAssets==='undefined'?null:PfertAssets.get('projectiles');
  const frame=projectileFrames.indexOf(b.style);
  if(!sheet||frame<0)return false;
  const column=frame%4,row=Math.floor(frame/4);
  const left=Math.round(column*sheet.width/4),top=Math.round(row*sheet.height/4);
  const right=Math.round((column+1)*sheet.width/4),bottom=Math.round((row+1)*sheet.height/4);
  const size=2*Math.max(14,Math.round(b.w*1.575));
  ctx.save();
  ctx.imageSmoothingEnabled=false;
  if(b.style==='saw'||b.style==='vortex')ctx.rotate(age*(b.style==='saw'?12:4));
  ctx.drawImage(sheet,left,top,right-left,bottom-top,-size/2,-size/2,size,size);
  ctx.restore();
  return true;
 }
 const ammoPixels={
  sunLance:['#ffe38a',['000011111111110','123333333333331','000022222222210']],
  fuseRocket:['#ff9969',['00110000','01223310','33333223','01222210','00110000']],
  tideBell:['#8fe8cd',['11000','02100','00210','00031','00210','02100','11000']],
  cinderArc:['#ff9157',['30001000','02312210','00233321','01222210','10001100']],
  iceSpindle:['#98deff',['000011000','001233210','123333332','001222210','000011000']],
  sparkBobbin:['#ffe573',['00003310','00233100','02322210','00023100','00310000']],
  pearlPod:['#ffaeca',['0011100','0123320','12322321','12233221','01222210','0011100']],
  moonHook:['#c6b7ff',['001233','012100','123000','122100','012211','001122']],
  railSkip:['#efb077',['0003100','0033210','0332221','0022210','0002100']],
  anchorCore:['#b6a3ed',['0033300','0121210','3213123','3212123','0121210','0022200']]
 };
 const ammoSprites=new Map();
 function drawCartridge(ctx,b){
  let sprite=ammoSprites.get(b.cartridge);
  if(!sprite){
   const [tint,rows]=ammoPixels[b.cartridge];
   sprite=document.createElement('canvas');sprite.width=Math.max(...rows.map(row=>row.length));sprite.height=rows.length;
   const pen=sprite.getContext('2d'),palette=['','#343951',tint,'#fff9e6'];
   rows.forEach((row,y)=>{for(let x=0;x<row.length;x++){if(row[x]==='0')continue;pen.fillStyle=palette[row[x]];pen.fillRect(x,y,1,1)}});
   ammoSprites.set(b.cartridge,sprite);
  }
  const w=b.cartridge==='sunLance'?b.w:sprite.width*2,h=b.cartridge==='tideBell'?b.h:sprite.height*2;
  ctx.save();ctx.translate(Math.round(b.x),Math.round(b.y));ctx.rotate(Math.round(Math.atan2(b.vy,b.vx)*8/Math.PI)*Math.PI/8);
  ctx.imageSmoothingEnabled=false;ctx.drawImage(sprite,-Math.round(w/2),-Math.round(h/2),Math.round(w),Math.round(h));ctx.restore();
 }
 function startProjectile(ctx,b,reduced){
  const radius=Math.max(4,b.w*.5);
  g=ctx;ctx.save();ctx.translate(Math.round(b.x),Math.round(b.y));
  ctx.rotate(Math.atan2(b.vy,b.vx));
  if(b.skillElement==='salvo'){
   poly([[-radius,0],[-radius*.3,-radius*.68],[radius*.85,-radius*.45],[radius,0],[radius*.85,radius*.45],[-radius*.3,radius*.68]],'#73cffa');
   poly([[-radius*.6,0],[0,-radius*.55],[radius*.85,0],[0,radius*.35]],'#c3faff');
   box(-radius*.22,-1,radius,2,'#efffff');
  }else if(b.skillElement==='precision'){
   poly([[-radius*.75,-radius*.68],[radius*.36,-radius*.8],[radius,-radius*.2],[radius*.65,radius*.65],[-radius*.4,radius*.8],[-radius,radius*.28]],'#795341');
   poly([[-radius*.75,-radius*.68],[radius*.36,-radius*.8],[radius*.55,-radius*.2],[-radius*.38,0]],'#dab17a');
   poly([[-radius*.38,0],[radius,-radius*.2],[radius*.65,radius*.65],[-radius*.4,radius*.8]],'#a17555');
  }else{
   const flicker=reduced?.8:.8+.2*Math.sin(b.age*38);
   poly([[-radius*1.6*flicker,0],[-radius*.52,-radius*.58],[radius*.38,-radius*.55],[radius,0],[radius*.38,radius*.55],[-radius*.52,radius*.58]],'#f25b3d');
   poly([[-radius*flicker,0],[0,-radius*.43],[radius*.78,0],[0,radius*.43]],'#ffb457');
   box(0,-1,radius*.48,3,'#fff1c4');
  }
  ctx.restore();
 }
 function bullet(ctx,b,reduced=false){
  if(b.cartridge){drawCartridge(ctx,b);return}
  if(b.skillElement){startProjectile(ctx,b,reduced);return}
  if(reduced){
   const x=Math.round(b.x),y=Math.round(b.y);
   const radius=b.generation?2:Math.min(b.charged?9:6,Math.max(3,Math.round(b.w*.25)));
   ctx.fillStyle=shotColors[b.style]||'#b8edff';
   ctx.fillRect(x-radius,y-1,radius*2+1,3);
   if(!b.generation){
    ctx.fillRect(x-1,y-radius,3,radius*2+1);
    ctx.fillStyle='#eaffff';
    ctx.fillRect(x-1,y-1,3,3);
   }
   return;
  }
  const x=Math.round(b.x),y=Math.round(b.y),r=b.w/2,age=b.age||0;g=ctx;
  ctx.save();ctx.translate(x,y);
  ctx.rotate(Math.round(Math.atan2(b.vy,b.vx)*16/Math.PI)*Math.PI/16);
  if(b.standardShot)ctx.scale(.7,.7);
  if(b.style==='saw')ctx.scale(1.25,1.25);
  if(b.echoed){ctx.globalAlpha=.78;glow(ctx,-r,0,r*2,'#e4baff33')}
  if(b.charged){ctx.strokeStyle='#e2f9ff55';ctx.lineWidth=1;ctx.beginPath();ctx.arc(-r*.5,0,r*1.4,-age*10,-age*10+1.4);ctx.stroke()}
  const detailed=b.style==='normal'&&b.charged?8:b.style==='frost'?9:b.style==='phoenix'?10:b.style==='vortex'?11:b.style==='red'&&b.charged?12:-1;
  if(b.chargedStandard&&paintEffect(ctx,8,0,0,b.w*3)){ctx.restore();return}
  if(paintProjectile(ctx,b,age)){
   if(b.charged){
    const color=shotColors[b.style]||'#b8edff';
    for(let i=0;i<4;i++){
     const phase=(age*12+i*.25)%1;
     box(-r*(1+phase*1.8),((i%2)*2-1)*(2+phase*r*.7),i%2?2:4,2,color);
    }
   }
   ctx.restore();return;
  }
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
  ctx.save();
  ctx.translate(b.x+7,b.y);
  if(!paintProjectile(ctx,{style:b.style==='storm'?'chain':'satellite',w:Math.min(36,b.width+5)},time)){
   paintEffect(ctx,b.style==='storm'?4:13,0,0,Math.min(115,b.width*2.7+20),0,.8);
  }
  ctx.restore();
  ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(b.x,b.y,b.width*.35+4,b.width*.8+7,Math.sin(time*8)*.2,0,7);ctx.stroke();ctx.restore();
 }
 function focusBeam(ctx,b,time,reduced=false){
  g=ctx;ctx.save();
  const sweep=b.target!==undefined||b.tx!==undefined,length=b.length??960-b.x;
  const tx=b.tx??b.x+Math.cos(b.angle||0)*length,ty=b.ty??b.y+Math.sin(b.angle||0)*length;
  const width=(sweep?22:b.width)*.5,col=b.color||(sweep?'#c681ff':'#6ef8db');
  const opacity=b.opacity??1;
  const core=reduced?1:Math.max(1,width*.19),body=reduced?2:width*.68;
  const drawLine=(size,color,alpha,dx=0,dy=0)=>{
   ctx.globalAlpha=alpha;ctx.strokeStyle=color;ctx.lineWidth=size;
   ctx.beginPath();ctx.moveTo(b.x+dx,b.y+dy);ctx.lineTo(tx+dx,ty+dy);ctx.stroke();
  };
  if(opacity<1){
   const length=Math.hypot(tx-b.x,ty-b.y)||1,offset=(body+core)/4;
   for(const side of [-1,1]){
    drawLine((body-core)/2,col,opacity,side*(b.y-ty)/length*offset,side*(tx-b.x)/length*offset);
   }
   drawLine(core,'#fff9f0',opacity);
  }else{
   if(!reduced)drawLine(width*1.7,col,.14);
   drawLine(body,col,1);
   drawLine(core,'#fff9f0',1);
  }
  if(!reduced&&opacity===1){
   ctx.globalAlpha=.55*opacity;
   glow(ctx,b.x,b.y,width*1.45,sweep?'#be87f76c':'#7fffcc61');
   for(let i=0;i<6;i++){
    const fraction=(time*4+i/6)%1;
    box(b.x+(tx-b.x)*fraction,b.y+(ty-b.y)*fraction-2,5,2,'#fff9e0');
   }
  }
  if(b.target){
   const radius=12+Math.sin(time*16)*3;
   ctx.globalAlpha=.93;ctx.strokeStyle='#f3bbff';ctx.lineWidth=2;
   ctx.beginPath();ctx.arc(tx,ty,radius,0,Math.PI*2);ctx.stroke();
   for(const side of [-1,1]){
    box(tx+side*radius-2,ty-1,5,2,'#fff9e0');
    box(tx-1,ty+side*radius-2,2,5,'#fff9e0');
   }
  }
  ctx.restore();
 }
 function beam(ctx,b,time,reduced=false){
  g=ctx;
  if(b.style==='light'){focusBeam(ctx,b,time,reduced);return}
  if(reduced){
   const width=Math.min(8,Math.max(2,Math.round(b.width*.25))),length=960-b.x;
   ctx.fillStyle=b.style==='storm'?'#c0ebfa88':'#c899ec88';
   ctx.fillRect(b.x,Math.round(b.y-width/2),length,width);
   return;
  }
  if(b.elements)for(let i=0;i<6;i++)elementalAura(ctx,{x:b.x+40+i*(920-b.x)/6,y:b.y,w:Math.min(40,b.width),age:time+i*.2,elements:b.elements});
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
  ctx.fillStyle='#e5bbff';
  for(let x=Math.round(b.x);x<960;x+=16){
   const y=b.y+Math.sin(x*.05+time*28)*w*.68;
   pixelRibbon(ctx,x,y,x+12,b.y+Math.sin((x+12)*.05+time*28)*w*.68,2,4);
  }
  ctx.restore();glow(ctx,b.x,b.y,w*1.6,'#ccb4ff55');beamPulse(ctx,b,time);
 }
 const hostileGlowColors={needle:'#ff795980',sickle:'#f4aa6780',splitter:'#df617480',mortar:'#f8a16880',mine:'#e86a6180',pulse:'#ff704b80',football:'#ffa17f90',orb:'#e96b5380'};
 function hostile(ctx,s,reduced=false){g=ctx;const x=Math.round(s.x),y=Math.round(s.y),r=Math.max(7,s.w*.75)*(s.w<=8?1.5:1),kind=s.kind||'orb';ctx.save();
  if(!reduced&&s.trail&&s.trail.length>1){ctx.strokeStyle='#ff694a';ctx.lineWidth=2;ctx.globalAlpha=.25;ctx.beginPath();s.trail.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke();ctx.globalAlpha=1}
  ctx.translate(x,y);
  if(kind==='pulse'){
   const height=s.h*1.25;
   box(-s.w/2,-height/2,s.w,height,'#211629');
   box(-s.w/2+2,-height/2+2,s.w-4,height-4,'#ff704b');
   box(-s.w/2+3,-height/2+3,s.w-6,2,'#ffbc86');
   box(-s.w/2+3,height/2-4,s.w-6,2,'#a13c50');
   box(-s.w/2+4,-2,s.w-8,4,'#fff1b4');
  }else{
   if(!reduced)glow(ctx,0,0,r*1.8,hostileGlowColors[kind]||hostileGlowColors.orb);
   ctx.rotate(Math.round(Math.atan2(s.vy,s.vx)*16/Math.PI)*Math.PI/16);
    if(kind==='needle'){
     poly([[-r,-r*.48],[r,0],[-r,r*.48],[-r*.55,0]],'#ff7959',2);
     poly([[-r*.7,1],[r*.78,0],[-r*.76,r*.37]],'#9a3850');
     poly([[0,-1],[r*.65,0],[0,1]],'#ffe4ac');
    }else if(kind==='sickle'){
     poly([[-r,-r],[r,0],[-r,r],[-r*.25,0]],'#f4aa67',2);
     poly([[-r*.72,r*.75],[r*.78,0],[-r*.25,r*.29]],'#9e4556');
     poly([[.1*r,-.22*r],[.72*r,0],[.1*r,.22*r]],'#fff0c2');
    }else if(kind==='splitter'){
     poly([[-r,0],[0,-r],[r,0],[0,r]],'#df6174',2);
     poly([[-r*.72,0],[0,r*.76],[r*.72,0],[0,r*.28]],'#963e5c');
     poly([[-r*.5,0],[0,-r*.5],[r*.5,0],[0,r*.5]],'#ffdeb0');
    }else if(kind==='mortar'){
     poly([[-r*.9,-r*.65],[r*.55,-r*.65],[r,0],[r*.55,r*.65],[-r*.9,r*.65]],'#f8a168',2);
     box(-r*.63,-r*.45,r,2,'#ffd0a2');box(-r*.63,r*.32,r,2,'#a54d57');
     poly([[0,-r*.28],[r*.6,0],[0,r*.28]],'#fff0c2');
    }
   else if(kind==='mine'){
    const points=Array.from({length:16},(_,i)=>{const a=i*Math.PI/8,len=i%2?r*.6:r;return [Math.cos(a)*len,Math.sin(a)*len]});
     poly(points,'#e86a61',2);
   }else if(kind==='football'){
    ctx.rotate(s.age*10);
    const radius=s.w/2;
    ctx.beginPath();ctx.arc(0,0,radius,0,Math.PI*2);
    ctx.fillStyle='#fff4dc';ctx.fill();
    ctx.strokeStyle='#dc634d';ctx.lineWidth=3;ctx.stroke();
    const panel=Array.from({length:5},(_,i)=>[Math.cos(i*2*Math.PI/5)*5,Math.sin(i*2*Math.PI/5)*5]);
    ctx.beginPath();
    for(const [px,py] of panel){ctx.moveTo(px,py);ctx.lineTo(px*2.55,py*2.55)}
    ctx.strokeStyle='#343347';ctx.lineWidth=1.5;ctx.stroke();
    poly(panel,'#343347');
   }else poly([[-r,0],[0,-r],[r,0],[0,r]],'#e96b53',2);
   if(kind!=='football')box(-2,-2,4,4,'#fff0bb');
   }
   ctx.shadowBlur=0;
   const untilBurst=s.burstAt-s.age;
   if(untilBurst>0&&untilBurst<=.3){
    const progress=1-untilBurst/.3;
    const radius=r+2+progress*5;
    if(kind==='mine'){
     ctx.beginPath();ctx.arc(0,0,radius,0,Math.PI*2);
     ctx.strokeStyle='#201829';ctx.lineWidth=4;ctx.stroke();
     ctx.strokeStyle='#ffb48e';ctx.lineWidth=1.5;ctx.stroke();
    }else if(kind==='splitter'){
     for(const side of [-1,1])poly([[0,side*(radius-3)],[-4,side*radius],[0,side*(radius+3)],[4,side*radius]],'#fff2cc',1);
    }
   }
  ctx.restore();
 }
 function flash(ctx,f){if(f.elements)elementalAura(ctx,{x:f.x,y:f.y,w:f.r*2,age:(f.maxLife-f.life)*10,elements:f.elements});const alpha=Math.max(0,f.life/f.maxLife);g=ctx;ctx.save();ctx.globalAlpha=alpha;glow(ctx,f.x,f.y,f.r*1.5,'#eefbff70');if(!paintEffect(ctx,f.magic?4:0,f.x,f.y,f.r*3.3)){poly([[f.x-f.r,f.y],[f.x-f.r*.2,f.y-f.r*.12],[f.x,f.y-f.r*.7],[f.x+f.r*.2,f.y-f.r*.12],[f.x+f.r,f.y],[f.x+f.r*.2,f.y+f.r*.12],[f.x,f.y+f.r*.7],[f.x-f.r*.2,f.y+f.r*.12]],'#fffdf1')}ctx.restore()}
 function arc(ctx,a){const f=Math.max(0,a.life/a.maxLife);ctx.save();ctx.globalAlpha=f;for(const [width,color] of [[7,'#182c48'],[4,'#59caff'],[1.5,'#efffff']]){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();for(let i=0;i<=8;i++){const u=i/8,x=a.x+(a.tx-a.x)*u,y=a.y+(a.ty-a.y)*u+(i&&i<8?Math.sin(i*7)*8:0);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)}ctx.stroke()}ctx.restore()}
 function ring(ctx,r){const f=1-r.life/r.maxLife,rx=r.size*(.25+f*.75),ry=r.size*(.2+f*.6);ctx.save();ctx.globalAlpha=(1-f)*.6;ctx.strokeStyle=r.col;ctx.lineWidth=f<.35?3:1;ctx.beginPath();for(let i=0;i<=20;i++){const angle=i*Math.PI/10,x=Math.round((r.x+Math.cos(angle)*rx)/2)*2,y=Math.round((r.y+Math.sin(angle)*ry)/2)*2;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)}ctx.stroke();if(f<.7){ctx.globalAlpha=(1-f)*.4;ctx.fillStyle=r.col;for(let i=0;i<12;i++){const angle=i*Math.PI/6;ctx.fillRect(Math.round(r.x+Math.cos(angle)*rx*1.08),Math.round(r.y+Math.sin(angle)*ry*1.08),2,2)}}ctx.restore()}
 function bottle(ctx,p){g=ctx;const x=p.x,y=p.y+Math.sin((p.age||0)*4)*3;const cols=['#ba4f59','#bde1bd','#e3a2bb','#986ab9','#85c7e0','#baa0cb','#b9e0e9','#c5d89d','#9fdcea','#b6acd9','#e9bc79','#a2d9bc','#a5d8ec','#9988c9','#d7e8ed','#e8ac79'];
  const elementColors={fire:'#ff6b36',frost:'#6edfff',lightning:'#f7e65c',earth:'#cda46a'};if(p.element)cols[p.i]=elementColors[p.element];
  glow(ctx,x,y,34,'#75f3dc44');for(let i=0;i<3;i++){const phase=(p.age||0)*1.7+i*2.094,xx=x+Math.cos(phase)*21,yy=y+Math.sin(phase)*25;box(xx,yy,2,2,'#c5ffe8')}ctx.save();ctx.strokeStyle='#182e44';ctx.lineWidth=5;ctx.strokeRect(x-16,y-26,32,54);ctx.strokeStyle='#83f5d8';ctx.lineWidth=2;ctx.strokeRect(x-16,y-26,32,54);ctx.restore();for(const side of [-1,1]){box(x+side*16-2,y-27,5,2,'#dbffed');box(x+side*16-2,y+27,5,2,'#b7fce5')}
  if(p.i===16)cols[16]='#ffd34e';box(x-4,y-22,8,6,'#654b48');box(x-3,y-22,4,2,'#d9bd8c');box(x-4,y-15,8,8,'#8eafb0');
  poly([[x-4,y-9],[x-10,y-5],[x-10,y+17],[x-7,y+21],[x+7,y+21],[x+10,y+17],[x+10,y-5],[x+4,y-9]],'#34495e');box(x-8,y-4,16,21,cols[p.i]);box(x-7,y-3,3,17,'#fff6d480');box(x+5,y-2,3,20,'#453e5a77');box(x-7,y+3,14,9,'#f6e6bd');
  const icons=['III','⋔','✿','—','ϟ','♥','◆','✺','ϟ','◉','●',')))','❄','◎','✧','➤','★'];label(ctx,icons[p.i]||'✦',x,y+10,9,'#384f5d','center');box(x+12,y-34,12,12,'#17354a');label(ctx,'+',x+18,y-24,14,'#a8ffdc','center');
 }
 function goldenSausage(){
  const base=rasterSprite(2,104,'organic');
  if(!base)return makeSprite('enemy-golden-sausage',()=>sausage(false,true),104,'brass');
  const key='golden-sausage-raster';
  if(!cache.has(key)){
   const sprite=document.createElement('canvas');
   sprite.width=base.width;sprite.height=base.height;
   const ctx=sprite.getContext('2d');
   ctx.drawImage(base,0,0);
   ctx.globalCompositeOperation='color';ctx.fillStyle='#dba650';
   ctx.fillRect(0,0,sprite.width,sprite.height);
   ctx.globalCompositeOperation='destination-in';ctx.drawImage(base,0,0);
   cache.set(key,sprite);
  }
  return cache.get(key);
 }
 function golden(ctx,p){
  const lamp=p.kind===2,x=Math.round(p.x),y=Math.round(p.y);
  const sprite=lamp?rareEnemySprite({attack:'pulse',color:'#bfcabd'}):goldenSausage();
  const scale=lamp?.65:.83,highlight=lamp?'#c5f4fa':'#fff0b6';
  ctx.save();
  glow(ctx,x,y,42,lamp?'#8ce5ff42':'#ffd46942');
  spriteShadow(ctx,sprite,x,y,scale);
  placeSprite(ctx,sprite,x,y,scale);
  g=ctx;glint(x+(lamp?14:30),y-18,highlight);
  ctx.restore();
 }
 const heartSpans=[[2,0,4],[8,0,4],[0,2,14],[0,4,14],[2,6,10],[4,8,6],[6,10,2]];
 function pixelHeart(ctx,x,y,filled){
  ctx.fillStyle='#12263a';
  for(const [dx,dy,w] of heartSpans)ctx.fillRect(x+dx-1,y+dy-1,w+2,4);
  for(const [dx,dy,w] of heartSpans){
   ctx.fillStyle=filled?(dy<4?'#ffc8bd':dy<8?'#ed929b':'#b96783'):(dy<4?'#708a9b':'#465e76');
   ctx.fillRect(x+dx,y+dy,w,2);
  }
  if(filled){ctx.fillStyle='#fff0d4';ctx.fillRect(x+3,y+2,2,2)}
 }
 function cartridgeGrid(ctx,s){
  label(ctx,'PATRONEN',622,14,9,'#e9e6d3');
  const columns=Math.ceil(s.cartridges.length/2),width=Math.floor(112/columns);
  s.cartridges.forEach(({id,reload,icon},i)=>{
   const x=622+i%columns*width,y=17+Math.floor(i/columns)*18;
   const unlocked=!!s.upgrades[id];
   const left=Math.max(0,(s.player.cartridgeReady?.[id]||0)-s.runTime);
   const justFired=s.runTime-(s.player.cartridgeFired?.[id]??-Infinity)<.12;
   box(x,y,width-2,16,unlocked?'#283a51':'#212937');
   label(ctx,icon,x+(width-2)/2,y+10,10,justFired?'#fff1b2':unlocked?'#e2faef':'#788292','center');
   box(x+2,y+12,width-6,3,'#344252');
   const fill=unlocked?Math.round((width-6)*Math.max(0,1-left/reload)):0;
   if(fill)box(x+2,y+12,fill,3,left?'#64abbd':'#b3f4d1');
   if(justFired)box(x,y,width-2,1,'#fff1b2');
  });
 }
 function hud(ctx,s){
  g=ctx;
  box(0,0,960,62,'#101728');
  box(0,0,960,2,'#8b6461');
  box(0,59,960,3,'#302b45');
  box(0,61,960,1,'#d49b68');
  for(const [x,w] of [[9,110],[129,184],[346,268],[618,242],[869,82]]){
   box(x,5,w,50,'#1c2a42');
   box(x+2,6,w-4,47,'#141e32');
   box(x+3,6,13,1,'#ba8f72');
   box(x+w-16,53,13,1,'#62718b');
  }
  label(ctx,'LEBEN',18,20,11,'#f0d4a2');
  const maxHearts=s.maxHearts||5,heartSpacing=maxHearts>5?16:19;
  for(let i=0;i<maxHearts;i++){
   const x=18+i*heartSpacing,fill=s.hearts-i;
   pixelHeart(ctx,x,33,fill>=1);
   if(fill>0&&fill<1){
    ctx.save();ctx.beginPath();ctx.rect(x-1,30,Math.round(16*fill)+1,20);ctx.clip();pixelHeart(ctx,x,33,true);ctx.restore();
   }
  }
  const rage=s.player.overdrive>0?s.player.overdrive/(s.player.metaRageMax||s.player.overdrive):(s.player.rage||0)/100,ready=s.player.rage>=100;
  label(ctx,s.player.overdrive>0?'KÄSERAUSCH!':ready?'KÄSERAUSCH BEREIT':'KÄSERAUSCH',138,19,11,ready||s.player.overdrive>0?'#d7faff':'#d0e3eb');
  box(138,25,166,8,'#2a3b54');
  const rageWidth=Math.round(164*Math.max(0,Math.min(1,rage)));
  if(rageWidth){
   box(139,26,rageWidth,6,ready?'#aceee8':'#53a1b7');
   box(139,26,rageWidth,2,'#b2ebe9');
  }
  for(let i=1;i<10;i++)box(139+i*16,26,1,6,'#131b2b66');
  const boosted=s.player.slipstreamFlash>s.runTime;
  const weaving=s.player.slipstreamCount>0&&s.player.slipstreamUntil>=s.runTime;
  if(boosted||weaving){
   label(ctx,boosted?'WINDSCHATTEN +125':'WINDSCHATTEN',138,49,10,boosted?'#fff2bc':'#b3e2d3');
   for(let i=0;i<3;i++){
    const x=272+i*11,lit=boosted||i<s.player.slipstreamCount;
    box(x,40,5,7,lit?'#80cbb9':'#334759');
    box(x-2,42,9,3,lit?'#80cbb9':'#334759');
    if(lit)box(x,41,3,2,'#effbd9');
   }
  }else label(ctx,'TALENTPUNKTE  +'+(s.talentPoints||0),138,49,11,'#ffdb92');
  label(ctx,s.secret?(s.secretType===2?'NACHTSCHICHT ':'RUHRPOTT ')+format(s.secretTime):format(s.t),480,22,17,'#ead9c3','center');
  if(s.cartridges?.length){
   cartridgeGrid(ctx,s);
   box(737,10,1,40,'#344252');
   label(ctx,'KARTEN',743,14,9,'#e9e6d3');
   const cards=(s.build||[]).filter(card=>!s.cartridges.some(attack=>attack.code===card.code));
   ctx.fillStyle='#e2f8e9';ctx.font='bold 7px monospace';ctx.textAlign='center';
   cards.forEach((card,i)=>ctx.fillText(card.code+card.rank,749+(i%9)*12.5,23+Math.floor(i/9)*8,12));
  }else if(s.build?.length){
   label(ctx,'KARTEN',622,13,9,'#e9e6d3');
   const dense=s.build.length>33,columns=dense?12:11;
   ctx.fillStyle='#e2f8e9';ctx.font=dense?'bold 9px monospace':'bold 10px monospace';ctx.textAlign='center';
   s.build.forEach((card,i)=>ctx.fillText(card.code+card.rank,631+(i%columns)*(dense?19:21),(dense?24:27)+Math.floor(i/columns)*(dense?10:13),dense?18:20));
  }
  label(ctx,'PUNKTE',941,13,9,'#e9e6d3','right');
  label(ctx,String(s.score).padStart(6,'0'),941,33,19,'#fff0c5','right');
  label(ctx,'STUFE '+s.level,941,51,11,'#d4ece9','right');
  box(0,533,960,7,'#121a2b');
  box(0,533,960,1,'#57637c');
  const xpWidth=Math.round(960*Math.max(0,Math.min(1,s.xp/s.xpNeeded)));
  if(xpWidth){
   box(0,534,xpWidth,5,'#53bbb8');
   box(0,534,xpWidth,2,'#b3efe2');
  }
  const name=s.weapon>=0?s.weaponNames[s.weapon]:(s.player.skill?.title.toUpperCase()||'KLASSISCHER KÄSE');const col=['#ffad85','#b9f5db','#efb4db','#c8b0ec','#9cdef6','#d3b4eb','#c7eeff','#dcf3ad','#83e5ff','#ccc4ff','#ffd386','#a5f8d5','#a6eaff','#b6a0ff','#e4f7ff','#ffc48e'][s.weapon]||'#f0cf91';
  label(ctx,name,480,s.wine?37:44,11,col,'center');
  if(s.wine){
   const wine=s.wine,segmentWidth=250/wine.segments;
   for(let i=0;i<wine.segments;i++){
    const x=355+i*segmentWidth;
    const segment=Math.min(1,wine.segments-i),width=segmentWidth*segment-2;
    if(width<=0)continue;
    box(x,52,width,4,'#3b5065');
    const fill=Math.max(0,Math.min(1,(wine.fraction*wine.segments-i)/segment));
    if(fill>0)box(x,52,Math.min(width,Math.max(2,width*fill)),4,col);
   }
   const free=wine.free?' + 1 frei':'';
   label(ctx,'['+wine.control+'] SONDERANGRIFF · '+wine.paid+free,480,48,9,'#ebf6eb','center');
  }
  if(s.combo>2){
   const width=Math.round(111*s.comboRemaining);
   box(830,82,111,2,'#4c4350');
   if(width>0)box(830,82,width,2,s.comboRemaining>.25?'#ffce83':'#f58e82');
  }
  if(s.boss){
   const b=s.boss,n=b.parts.length,width=(312-(n-1)*5)/n;
   box(310,68,340,19,'#14192ce8');
   box(320,68,320,2,b.special?.color||'#be815f');
   b.parts.forEach((part,i)=>{
    const x=324+i*(width+5),fill=(width-2)*Math.max(0,part.hp/part.max);
    box(x,75,width,7,'#3b334c');
    if(fill>0){
     box(x+1,76,fill,5,part.flash>0?'#fff':'#d17a63');
     box(x+1,76,fill,1,'#ffd59a');
    }
   });
  }
 }
 function format(s){return String(Math.floor(s/60)).padStart(2,'0')+':'+String(Math.floor(s%60)).padStart(2,'0')}
 const elementalSprites={
  fire:{palette:['#a62d21','#ff632d','#ffe071'],rows:['..1..','.12..','.123.','12231','12321','.111.'],dx:24,dy:-48},
  lightning:{palette:['#8e60e8','#eed656','#fffccb'],rows:['..231','..31.','.31..','.2331','..31.','.31..','31...'],dx:50,dy:-24},
  frost:{palette:['#3875b6','#78dbff','#e9fdff'],rows:['..2..','1.3.1','.232.','23332','.232.','1.3.1','..2..'],dx:40,dy:18},
  earth:{palette:['#604336','#bb8654','#efd39a'],rows:['..12.','.1332','12321','12211','.111.'],dx:36,dy:40}
 };
 const elementalPieces=new Map();
 function elementalPiece(kind,pixel){
  const key=kind+pixel;
  if(!elementalPieces.has(key)){
   const {palette,rows}=elementalSprites[kind];
   const sprite=document.createElement('canvas');
   sprite.width=rows[0].length*pixel;
   sprite.height=rows.length*pixel;
   const pen=sprite.getContext('2d');
   rows.forEach((row,y)=>{
    for(let x=0;x<row.length;x++){
     if(row[x]==='.')continue;
     pen.fillStyle=palette[Number(row[x])-1];
     pen.fillRect(x*pixel,y*pixel,pixel,pixel);
    }
   });
   elementalPieces.set(key,sprite);
  }
  return elementalPieces.get(key);
 }
 function elementalBurst(ctx,e){
  const art=elementalSprites[e.kind],age=1-e.life/e.maxLife;
  ctx.save();
  ctx.globalAlpha=Math.min(1,(1-age)*3.5);
  for(let i=0;i<5;i++){
   const flight=age-i*.085;
   if(flight<0)continue;
   const side=i%2===0?1:-1,pixel=i===0?3:2;
   const x=Math.round(e.x+side*(e.offset*.45+art.dx*flight)*(1-i*.11));
   const y=Math.round(e.y+art.dy*(flight+.18)+(i%3-1)*11*(1+flight));
   ctx.drawImage(elementalPiece(e.kind,pixel),x-2*pixel,y-3*pixel);
  }
  ctx.restore();
 }
 return {background,enemy,horse,boss,bossStrikeWarning,shieldDial,hitCue,starGate,experienceOrb,bullet,beam,focusBeam,hostile,ring,bottle,golden,death,hud,arc,flash,elementalBurst,trail,spark,bossLayout};
})();
