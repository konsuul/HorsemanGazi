/* Optional original raster assets, with a code-drawn fallback for loading failures. */
const PfertAssets=(()=>{
 const frames=[{"x":32,"y":48,"w":247,"h":243},{"x":316,"y":26,"w":305,"h":279},{"x":657,"y":43,"w":254,"h":245},{"x":963,"y":12,"w":272,"h":285},{"x":8,"y":342,"w":297,"h":225},{"x":341,"y":326,"w":243,"h":282},{"x":617,"y":338,"w":327,"h":267},{"x":979,"y":317,"w":245,"h":291},{"x":24,"y":654,"w":260,"h":222},{"x":313,"y":629,"w":309,"h":255},{"x":636,"y":636,"w":294,"h":251},{"x":952,"y":652,"w":297,"h":225},{"x":1,"y":913,"w":313,"h":319},{"x":317,"y":911,"w":310,"h":319},{"x":626,"y":947,"w":299,"h":284},{"x":940,"y":905,"w":314,"h":327}];
 const effectFrames=[{"x":0,"y":0,"w":314,"h":314},{"x":314,"y":0,"w":313,"h":314},{"x":627,"y":0,"w":314,"h":314},{"x":941,"y":0,"w":313,"h":314},{"x":0,"y":314,"w":314,"h":313},{"x":314,"y":314,"w":313,"h":313},{"x":627,"y":314,"w":314,"h":313},{"x":941,"y":314,"w":313,"h":313},{"x":0,"y":627,"w":314,"h":314},{"x":314,"y":627,"w":313,"h":314},{"x":627,"y":627,"w":314,"h":314},{"x":941,"y":627,"w":313,"h":314},{"x":0,"y":941,"w":314,"h":313},{"x":314,"y":941,"w":313,"h":313},{"x":627,"y":941,"w":314,"h":313},{"x":941,"y":941,"w":313,"h":313}];
 const images={},failures=[];
 const manifest={characters:'assets/characters-v1.png',city:'assets/bosporus-v1.png',industry:'assets/ruhrgebiet-v1.png',industryNight:'assets/ruhrgebiet-nachtschicht-v1.png',effects:'assets/effects-v1.png'};
 function load(id,path){return new Promise(resolve=>{if(typeof Image!=='function'){failures.push(id);resolve(false);return}const image=new Image();image.onload=()=>{images[id]=image;resolve(true)};image.onerror=()=>{failures.push(id);resolve(false)};image.src=path})}
 const ready=Promise.all(Object.entries(manifest).map(([id,path])=>load(id,path)));
 return {frames,effectFrames,ready,get:id=>images[id]||null,get failures(){return [...failures]}};
})();
