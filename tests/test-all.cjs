'use strict';
const {execFileSync}=require('node:child_process');
const suites=[
 'test-scoreboard.cjs','test-game.cjs','test-input.cjs','test-progress.cjs','test-sound.cjs',
 'test-assets.cjs','test-balance.cjs','test-meta.cjs','test-meta-game.cjs','test-controller-meta.cjs',
 'test-opening.cjs','test-encounters.cjs','test-pause-cards.cjs','test-readability.cjs','test-balance-profile.cjs'
];
for(const file of suites){
 console.log('\n'+file);
 execFileSync(process.execPath,[require('node:path').join(__dirname,file)],{stdio:'inherit'});
}
