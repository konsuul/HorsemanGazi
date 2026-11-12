/* Permanent progression data. UI and gameplay effects are integrated separately. */
(function (root) {
 'use strict';
 const key = 'pfert.meta.v1';
 const ids = ['A1','A2','A3','V1','V2','V3','K1','K2','K3','B1','B2','B3','W1','W2','W3'];
 const edges = [];
 const connect = (a,b) => edges.push([a,b]);
 for (let i=1;i<5;i++) connect('S'+i,'S'+(i+1));
 const links = [[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11],[11,12],[12,13],[10,14],[14,15],[15,16],[5,17],[17,18],[18,19],[19,20],[20,21],[21,22],[20,23]];
 ids.forEach((id,i)=>{connect('S'+(Math.floor(i/3)+1),id+'-1');links.forEach(([a,b])=>connect(id+'-'+a,id+'-'+b));});
 const cross=[['A1-10','V1-10'],['A2-20','V3-20'],['A3-10','K1-10'],['V2-10','K3-10'],['K3-20','B1-20'],['K2-10','B2-10'],['B2-20','W1-20'],['B3-10','W1-10'],['A3-20','W2-20'],['V1-20','W3-20']];
 cross.forEach(([a,b],i)=>{connect(a,'Q'+(i+1));connect('Q'+(i+1),b);});
 const nodes = ['S1','S2','S3','S4','S5',...ids.flatMap(id=>Array.from({length:23},(_,i)=>id+'-'+(i+1))),...cross.map((_,i)=>'Q'+(i+1))];
 const valid = new Set(nodes);
 const fresh = () => ({version:1, points:0, seconds:0, purchased:[]});
 function validate(data){
  if(!data||data.version!==1||!Number.isSafeInteger(data.points)||data.points<0||!Number.isFinite(data.seconds)||data.seconds<0||data.seconds>=600||!Array.isArray(data.purchased)||new Set(data.purchased).size!==data.purchased.length||data.purchased.some(id=>!valid.has(id))) throw new Error('Ungültiger Talentstand');
  const owned=new Set(data.purchased), reached=new Set(); if(owned.has('S1'))reached.add('S1');
  let changed=true;while(changed){changed=false;for(const [a,b] of edges){if(reached.has(a)&&owned.has(b)&&!reached.has(b)){reached.add(b);changed=true}if(reached.has(b)&&owned.has(a)&&!reached.has(a)){reached.add(a);changed=true}}}
  if(reached.size!==owned.size)throw new Error('Nicht verbundener Talentstand');
  return {version:1,points:data.points,seconds:data.seconds,purchased:[...data.purchased]};
 }
 function load(storage){try{const raw=storage.getItem(key);return {data:raw?validate(JSON.parse(raw)):fresh(),error:null};}catch(e){return {data:fresh(),error:'Fortschritt konnte nicht geladen werden.'};}}
 function save(storage,data){try{storage.setItem(key,JSON.stringify(validate(data)));return true;}catch(e){return false;}}
 function buy(data,id){const d=validate(data);if(!valid.has(id)||d.points<1||d.purchased.includes(id))return null;const owned=new Set(d.purchased);if(id!=='S1'&&!edges.some(([a,b])=>(a===id&&owned.has(b))||(b===id&&owned.has(a))))return null;d.points--;d.purchased.push(id);return d;}
 function refund(data){const d=validate(data);d.points+=d.purchased.length;d.purchased=[];return d;}
 function award(data,seconds,bosses){const d=validate(data);if(!Number.isFinite(seconds)||seconds<0||!Number.isSafeInteger(bosses)||bosses<0)throw new Error('Ungültige Belohnung');const elapsed=d.seconds+seconds;d.points+=Math.floor(elapsed/600)+bosses;d.seconds=elapsed%600;return d;}
 const api={key,nodes,edges,fresh,validate,load,save,buy,refund,award};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PfertMeta=api;
})(typeof globalThis!=='undefined'?globalThis:this);
