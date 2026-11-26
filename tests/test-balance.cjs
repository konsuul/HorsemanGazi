'use strict';
const fs=require('node:fs'),vm=require('node:vm');
const test=fs.readFileSync(__dirname+'/test-game.cjs','utf8');
const setup=test.slice(0,test.indexOf('for(let i=0;i<17;i++)')).replace(
 'shouldSpawnPickup,damagePart,art:PfertArt,',
 'isolateDps:()=>{secret=true;secretTime=-1000;spawn=999;drop=999},shouldSpawnPickup,damagePart,art:PfertArt,'
);
vm.runInThisContext('(function(require,__dirname){'+setup+`
const results=[];
for(const weapon of [-1,0,1,2,3,4,6,7,8,9,10,11,12,13,14,15]){
 a.reset();a.isolateDps();a.enemy(0);
 const e=a.get().enemies[0];Object.assign(e,{x:430,y:270,w:180,h:180,speed:0,fire:99999,hp:1000000,max:1000000,phase:0});
 const player=a.get().player;player.inv=Infinity;player.weapon=weapon;if(weapon>=0)player.effects[weapon]=1000;
 let before=0;for(let i=0;i<7000;i++){if(i===1000)before=e.hp;a.update(.01)}
 results.push([weapon,(before-e.hp)/60]);
}
console.log('Waffen-DPS am Einzelziel: '+results.map(([id,dps])=>id+':'+dps.toFixed(2)).join(' '));
const baseline=results[0][1];
assert.ok(Math.abs(baseline-.8625/.16)<.01,'Standardschaden pro Sekunde folgt Trefferwert und Feuerrate');
for(const [weapon,dps] of results.slice(1)){
 // Cabernet trifft das breite Ziel durch seine Pulse wiederholt.
 const expected=weapon===13?15.21:baseline*1.15;
 assert.ok(Math.abs(dps/expected-1)<=.05,'Waffe '+weapon+' DPS '+dps+' statt '+expected);
}
`+'})',{filename:'balance-runner.cjs'})(require,__dirname);
