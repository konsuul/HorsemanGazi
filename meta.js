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
 const legacyNodes=nodes.slice(), legacyEdges=edges.slice();
 const groups=ids.flatMap(id=>[[1,2,3,4],[6,7,8,9],[11,12],[14,15],[17,18,19]].map(ns=>ns.map(n=>id+'-'+n)));
 const aliases=new Map(),members=new Map();for(const group of groups){const root=group[0];members.set(root,group);for(const id of group)aliases.set(id,root)}
 const canonical=id=>aliases.get(id)||id;
 const extras=group=>Array.from({length:5-group.length},(_,i)=>group[0]+'+'+(i+1));
 const extraIds=groups.flatMap(extras);
 const valid = new Set([...legacyNodes,...extraIds]);
 nodes.splice(0,nodes.length,...legacyNodes.filter(id=>canonical(id)===id));
 edges.splice(0,edges.length);const pairs=new Set();for(const [a,b] of legacyEdges){const x=canonical(a),y=canonical(b),key=[x,y].sort().join('|');if(x!==y&&!pairs.has(key)){pairs.add(key);edges.push([x,y])}}
 function rank(data,id){const group=members.get(canonical(id));return group?group.reduce((n,x)=>n+Number(data.purchased.includes(x)),0)+extras(group).reduce((n,x)=>n+Number(data.purchased.includes(x)),0):Number(data.purchased.includes(id))}
 function limit(id){return members.has(canonical(id))?5:1}
 function describe(data,id,description){
  if(limit(id)===1)return description;
  const current=rank(data,id),base=String(description);
  if(!current)return base+' pro Rang · Rang 0/'+limit(id);
  const total=base.replace(/([+−-])(\d+(?:[,.]\d+)?)\s*(%|Prozentpunkte)/,(_,sign,value,unit)=>sign+String(Math.round(Number(value.replace(',','.'))*current*10000)/10000).replace('.',',')+' '+unit);
  return total+' insgesamt · Rang '+current+'/'+limit(id);
 }

 const fresh = () => ({version:1, points:0, seconds:0, purchased:[]});
 function validate(data){
  if(!data||data.version!==1||!Number.isSafeInteger(data.points)||data.points<0||!Number.isFinite(data.seconds)||data.seconds<0||data.seconds>=600||!Array.isArray(data.purchased)||new Set(data.purchased).size!==data.purchased.length||data.purchased.some(id=>!valid.has(id))) throw new Error('Ungültiger Talentstand');
  const owned=new Set(data.purchased.map(id=>canonical(id.replace(/\+\d+$/, '')))), reached=new Set(); if(owned.has('S1'))reached.add('S1');
  let changed=true;while(changed){changed=false;for(const [a,b] of edges){if(reached.has(a)&&owned.has(b)&&!reached.has(b)){reached.add(b);changed=true}if(reached.has(b)&&owned.has(a)&&!reached.has(a)){reached.add(a);changed=true}}}
  if(reached.size!==owned.size)throw new Error('Nicht verbundener Talentstand');
  return {version:1,points:data.points,seconds:data.seconds,purchased:[...data.purchased]};
 }
 function load(storage){try{const raw=storage.getItem(key);return {data:raw?validate(JSON.parse(raw)):fresh(),error:null};}catch(e){return {data:fresh(),error:'Fortschritt konnte nicht geladen werden.'};}}
 function save(storage,data){try{storage.setItem(key,JSON.stringify(validate(data)));return true;}catch(e){return false;}}
 function buy(data,id){const d=validate(data),root=canonical(id),group=members.get(root);if(!nodes.includes(root)||d.points<1||rank(d,root)>=limit(root))return null;const owned=new Set(d.purchased.map(x=>canonical(x.replace(/\+\d+$/, ''))));if(!owned.has(root)&&root!=='S1'&&!edges.some(([a,b])=>(a===root&&owned.has(b))||(b===root&&owned.has(a))))return null;const candidates=group?[...group,...extras(group)]:[root];const next=candidates.find(x=>!d.purchased.includes(x));d.points--;d.purchased.push(next);return d;}
 function refund(data){const d=validate(data);d.points+=d.purchased.length;d.purchased=[];return d;}
 function sell(data,id){const d=validate(data),root=canonical(id),group=members.get(root);if(!nodes.includes(root)||rank(d,root)<1)return null;const candidates=group?[...group,...extras(group)]:[root];const chosen=candidates.filter(x=>d.purchased.includes(x)).at(-1);d.purchased.splice(d.purchased.indexOf(chosen),1);d.points++;try{return validate(d)}catch(e){return null}}
 function reward(data,seconds,bosses){
  const next=validate(data);
  if(!Number.isFinite(seconds)||seconds<0||!Number.isSafeInteger(bosses)||bosses<0)throw new Error('Ungültige Belohnung');
  const elapsed=next.seconds+seconds,timePoints=Math.floor(elapsed/600);
  next.points+=timePoints+bosses;
  next.seconds=elapsed%600;
  return {data:next,timePoints,bossPoints:bosses,nextIn:600-next.seconds};
 }
 function award(data,seconds,bosses){return reward(data,seconds,bosses).data}
 const api={key,nodes,edges,fresh,validate,load,save,buy,sell,refund,award,reward,canonical,rank,limit,describe};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PfertMeta=api;
})(typeof globalThis!=='undefined'?globalThis:this);
