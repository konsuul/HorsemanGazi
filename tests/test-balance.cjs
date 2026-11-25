'use strict';
const fs=require('node:fs'),vm=require('node:vm');
const test=fs.readFileSync(__dirname+'/test-game.cjs','utf8');
const setup=test.slice(0,test.indexOf('reset();shoot();assert.equal'));
vm.runInThisContext('(function(require,__dirname){'+setup+`
const results=[];
for(const weapon of [-1,0,1,2,3,4,6,7,8,9,10,11,12,13,14,15]){
 a.reset();a.setTime(485);a.setNextBoss(Infinity);a.setFirstSeen(true);a.setSpawn(999);a.setDrop(999);a.enemy(0);
 const e=a.get().enemies[0];Object.assign(e,{x:430,y:270,w:180,h:180,speed:0,fire:99999,hp:1000000,max:1000000,phase:0});
 const player=a.get().player;player.inv=Infinity;player.weapon=weapon;if(weapon>=0)player.effects[weapon]=1000;
 let before=0;for(let i=0;i<7000;i++){if(i===1000)before=e.hp;a.update(.01)}
 results.push([weapon,(before-e.hp)/60]);
}
const baseline=results[0][1];
assert.ok(Math.abs(baseline-.75/.16)<.01,'Standardschaden pro Sekunde folgt Trefferwert und Feuerrate');
for(const [weapon,dps] of results.slice(1)){
 assert.ok(Math.abs(dps/(baseline*1.15)-1)<=.05,'Waffe '+weapon+' DPS '+dps+' gegenüber '+baseline);
}
console.log('OK: Waffen-DPS am Einzelziel: '+results.map(([id,dps])=>id+':'+dps.toFixed(2)).join(' '));
`+'})',{filename:'balance-runner.cjs'})(require,__dirname);
