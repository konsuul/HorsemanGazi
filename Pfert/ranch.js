/* The ranch owns its versioned save. Its clock advances only when gameplay supplies dt. */
const PfertRanch=(()=>{
 const key='pfert-ranch-v1';
 const tiers=[
  {id:'pleb',name:'Pleb',minutes:5,weight:64,glyph:1},
  {id:'otto',name:'Otto',minutes:10,weight:26,glyph:2},
  {id:'wallach',name:'Wallach',minutes:20,weight:9,glyph:3},
  {id:'hengst',name:'Hengst',minutes:60,weight:1,glyph:4}
 ];
 const palettes=[
  {name:'Honig',shell:'#f0c879',shade:'#a06042',light:'#fff0b0'},
  {name:'Rauchblau',shell:'#8fbaca',shade:'#425a79',light:'#cdebf3'},
  {name:'Pflaume',shell:'#cb9aba',shade:'#714b75',light:'#f8d4eb'},
  {name:'Salbei',shell:'#a8bd85',shade:'#536750',light:'#e5edb5'}
 ];
 const patterns=['Kreis','Rechteck','Raute','Kreuz'];
 const maxEggs=6,maxDrops=3,maxFoals=128;
 const fresh=()=>({version:1,active:0,nextId:1,eggs:[],foals:[]});
 const validIndex=(n,list)=>Number.isInteger(n)&&n>=0&&n<list.length;
 const tierOf=id=>tiers.find(tier=>tier.id===id);
 const validTime=n=>Number.isFinite(n)&&n>=0&&n<Number.MAX_SAFE_INTEGER;
 function traits(item){
  const palette=validIndex(item.palette,palettes)?item.palette:0;
  const pattern=validIndex(item.pattern,patterns)?item.pattern:0;
  return {palette,pattern,variantId:palette*patterns.length+pattern};
 }
 function clean(raw){
  const data=fresh(),used=new Set();
  if(!raw||raw.version!==1)return data;
  if(validTime(raw.active))data.active=raw.active;
  for(const collection of ['foals','eggs']){
   const limit=collection==='eggs'?Math.min(maxEggs,maxFoals-data.foals.length):maxFoals;
   if(!Array.isArray(raw[collection]))continue;
   for(const item of raw[collection]){
    if(data[collection].length===limit)break;
    if(!item||!Number.isSafeInteger(item.id)||item.id<1||item.id>=Number.MAX_SAFE_INTEGER-1||used.has(item.id)||!tierOf(item.tier))continue;
    const timer=collection==='eggs'?'hatchAt':'hatchedAt';
    if(!validTime(item[timer]))continue;
    used.add(item.id);
    data[collection].push({id:item.id,tier:item.tier,...traits(item),[timer]:item[timer]});
    data.nextId=Math.max(data.nextId,item.id+1);
   }
  }
  if(Number.isSafeInteger(raw.nextId)&&raw.nextId>0&&raw.nextId<Number.MAX_SAFE_INTEGER)data.nextId=Math.max(data.nextId,raw.nextId);
  return data;
 }
 function load(storage){
  try{
   const raw=JSON.parse(storage?.getItem(key)??'null');
   if(raw&&Number.isInteger(raw.version)&&raw.version!==1)return {data:fresh(),writable:false};
   return {data:clean(raw),writable:!!storage};
  }catch{return {data:fresh(),writable:!!storage}}
 }
 function save(storage,data){
  try{storage.setItem(key,JSON.stringify(data));return true}catch{return false}
 }
 function rollTier(value){
  let roll=value*100;
  return tiers.find(tier=>(roll-=tier.weight)<0)??tiers[tiers.length-1];
 }
 function canStore(data,pending=0){
  return data.eggs.length+pending<maxEggs&&data.eggs.length+data.foals.length+pending<maxFoals;
 }
 function rollDrop(data,time,pending,rng=Math.random){
  if(time<1800||pending>=maxDrops||!canStore(data,pending)||rng()>=.007)return null;
  return {tier:rollTier(rng()).id,palette:Math.floor(rng()*palettes.length),pattern:Math.floor(rng()*patterns.length)};
 }
 function collect(data,item){
  const tier=tierOf(item.tier);
  if(!tier||!canStore(data)||data.nextId>=Number.MAX_SAFE_INTEGER-1)return null;
  const egg={id:data.nextId++,tier:tier.id,...traits(item),hatchAt:data.active+tier.minutes*60};
  data.eggs.push(egg);
  return egg;
 }
 function advance(data,dt){
  if(dt>0&&validTime(data.active+dt))data.active+=dt;
  let count=0;
  data.eggs=data.eggs.filter(egg=>{
   if(data.active+1e-8<egg.hatchAt)return true;
   const {hatchAt,...foal}=egg;
   data.foals.push({...foal,hatchedAt:hatchAt});
   count++;
   return false;
  });
  return count;
 }
 return {key,tiers,palettes,patterns,load,save,rollDrop,rollTier,canStore,collect,advance,tierOf,traits};
})();
if(typeof module!=='undefined')module.exports=PfertRanch;
