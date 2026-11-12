'use strict';
const fs=require('fs');
const source=fs.readFileSync('Meta progression.md','utf8');
const descriptions={S1:'Erste Reifung: +3 % Schaden',S2:'Flinke Hufe: +3 % Bewegungsgeschwindigkeit',S3:'Käsefunke: +3 % Käserausch-Aufladung',S4:'Spürnase: +7,5 % Orb-Ansaugradius',S5:'Kellermeister: +4,5 % Waffen-Power-up-Dauer'};
const names={};
const pattern=/^### ((?:A|V|K|B|W)[1-3]) · (.+)\r?\n([\s\S]*?)(?=^### |^## |(?![\s\S]))/gm;
for(const m of source.matchAll(pattern)){
 const [,id,name,body]=m;names[id]=name;
 const abc=body.match(/^- A: (.+?)\. B: (.+?)\. C: (.+?)\.$/m);
 if(!abc)throw Error('A/B/C fehlen: '+id);
 for(const n of [1,2,3,4,6,7,8,9])descriptions[id+'-'+n]=abc[1];
 for(const n of [5,10])descriptions[id+'-'+n]=abc[2];
 for(const n of [11,12,14,15,17,18,19])descriptions[id+'-'+n]=abc[3];
 descriptions[id+'-21']='Doppelt: '+abc[3];
 for(const n of [13,16,20,22,23]){const match=body.match(new RegExp('^- '+n+' · (.+)$','m'));if(!match)throw Error(id+'-'+n);descriptions[id+'-'+n]=match[1].trim();}
}
for(const m of source.matchAll(/^\| (Q\d+) · ([^|]+) \| [^|]+ \| ([^|]+) \|/gm))descriptions[m[1]]=m[2].trim()+': '+m[3].trim();
descriptions.Q10='Eichelkranzkäse: Während des Käserauschs +50 % Schaden; beim Aufsammeln einer Waffenflasche drei Sekunden +12 % Bewegung.';
if(Object.keys(descriptions).length!==360)throw Error('Knotenbeschreibungen: '+Object.keys(descriptions).length);
fs.writeFileSync('meta-data.js',"/* Aus Meta progression.md erzeugt. */\n(function(root){root.PfertMetaData="+JSON.stringify({names,descriptions})+";})(globalThis);\n");
