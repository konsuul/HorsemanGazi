'use strict';
const fs=require('fs');
const source=fs.readFileSync('Meta progression.md','utf8');
const iconPaths=require('./assets/tabler-talent-icons.json');
const descriptions={S1:'Erste Reifung: +3 % Schaden',S2:'Flinke Hufe: +3 % Bewegungsgeschwindigkeit',S3:'Käsefunke: +3 % Käserausch-Aufladung',S4:'Spürnase: +7,5 % Orb-Ansaugradius',S5:'Kellermeister: +4,5 % Waffen-Power-up-Dauer'};
const titles=Object.fromEntries(Object.entries(descriptions).map(([id,text])=>[id,text.split(':')[0]]));
const icons={S1:'sword',S2:'run',S3:'bolt',S4:'magnet',S5:'bottle'};
const improvements={
 A1:[['Dauerfeuer','sword'],['Schnelle Geschosse','bolt'],['Feuerrate','bolt']],
 A2:[['Erstschlag','target'],['Kritische Trefferchance','target'],['Kritischer Schaden','sword']],
 A3:[['Elementartreffer','sparkles'],['Elementardauer','clock'],['Brennschaden','flame']],
 V1:[['Flugtempo','run'],['Ausweichabstand','run'],['Reisetempo','run']],
 V2:[['Trefferschutz','shield'],['Schneller Geschossblock','shield'],['Blockerholung','clock']],
 V3:[['Schaden in letzter Not','sword'],['Flucht in letzter Not','run'],['Letzter Schutz','heart']],
 K1:[['Rauschschaden','sword'],['Rauschzeit','clock'],['Rauschsalve','bolt']],
 K2:[['Rauschladung','bolt'],['Rauschverlängerung','clock'],['Anhaltender Rausch','clock']],
 K3:[['Ladung beim Ausweichen','run'],['Orb-Sog im Rausch','magnet'],['Schnellere Rauschladung','bolt']],
 B1:[['Orb-Magnet','magnet'],['Orb-Erfahrung','diamond'],['Erfahrungsgewinn','diamond']],
 B2:[['Flaschenmagnet','magnet'],['Längerer Weineffekt','clock'],['Weinvorrat','bottle']],
 B3:[['Elite-Erfahrung','diamond'],['Orb-Reichweite','magnet'],['Boss-Erfahrung','diamond']],
 W1:[['Sonderangriffsschaden','bolt'],['Stärkere Sonderangriffe','sword'],['Sonderangriffskraft','bolt']],
 W2:[['Waffendauer','clock'],['Weinwaffenschaden','sword'],['Weinverstärkung','bottle']],
 W3:[['Weingeschosse','bolt'],['Wein-Sonderangriff','sparkles'],['Automatische Weinsalven','sword']]
};
const branchIcons={A1:'sword',A2:'target',A3:'flame',V1:'run',V2:'shield',V3:'heart',K1:'bolt',K2:'clock',K3:'shield',B1:'diamond',B2:'magnet',B3:'target',W1:'bolt',W2:'bottle',W3:'sparkles'};
const roman=['I','II','III','IV','V','VI','VII','VIII'];
const pattern=/^### ((?:A|V|K|B|W)[1-3]) · (.+)\r?\n([\s\S]*?)(?=^### |^## |(?![\s\S]))/gm;
for(const m of source.matchAll(pattern)){
 const [,id,,body]=m;
 const abc=body.match(/^- A: (.+?)\. B: (.+?)\. C: (.+?)\.$/m);
 if(!abc)throw Error('A/B/C fehlen: '+id);
 for(const [group,numbers] of [[0,[1,2,3,4,6,7,8,9]],[1,[5,10]],[2,[11,12,14,15,17,18,19,21]]]){
  const [title,icon]=improvements[id][group];
  numbers.forEach((n,index)=>{
   const key=id+'-'+n;
   titles[key]=title+' '+roman[index];
   icons[key]=icon;
   descriptions[key]=(n===21?'Doppelt: ':'')+abc[group+1];
  });
 }
 for(const n of [13,16,20,22,23]){
  const match=body.match(new RegExp('^- '+n+' · ([^:]+): (.+)$','m'));
  if(!match)throw Error(id+'-'+n);
  const key=id+'-'+n;
  titles[key]=match[1].trim();
  descriptions[key]=match[2].trim();
  icons[key]=n===23?'star':branchIcons[id];
 }
}
for(const [,id,title,description] of source.matchAll(/^\| (Q\d+) · ([^|]+) \| [^|]+ \| ([^|]+) \|/gm)){
 titles[id]=title.trim();
 descriptions[id]=description.trim();
 icons[id]='link';
}
for(const id of ['S1','S2','S3','S4','S5'])descriptions[id]=descriptions[id].split(': ')[1];
if(Object.keys(descriptions).length!==360)throw Error('Knotenbeschreibungen: '+Object.keys(descriptions).length);
if(Object.keys(descriptions).some(id=>!titles[id]||!iconPaths[icons[id]]?.length))throw Error('Talentname oder Icon fehlt');
fs.writeFileSync('meta-data.js',"/* Aus Meta progression.md und assets/tabler-talent-icons.json erzeugt. */\n(function(root){root.PfertMetaData="+JSON.stringify({titles,descriptions,icons,iconPaths})+";})(globalThis);\n");
