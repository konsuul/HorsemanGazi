'use strict';
const {execFileSync}=require('node:child_process');
const {readdirSync}=require('node:fs');
const {join}=require('node:path');

const suites=readdirSync(__dirname)
 .filter(file=>/^test-.*\.cjs$/.test(file)&&file!=='test-all.cjs')
 .sort()
 .map(file=>[file]);

// These cases run only when their suite is called with the corresponding option.
const targetedCases=[
 ['test-game.cjs','--boomerang'],
 ['test-encounters.cjs','--telegraphs'],
 ['test-encounters.cjs','--formation'],
 ['test-encounters.cjs','--wind'],
 ['test-encounters.cjs','--caravan']
];
for(const [file,...args] of [...suites,...targetedCases]){
 console.log('\n'+[file,...args].join(' '));
 execFileSync(process.execPath,[join(__dirname,file),...args],{stdio:'inherit'});
}
