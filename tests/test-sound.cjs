'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const noop=()=>{};
// Audio is optional, gesture-initialized, muteable, and bounded.
const soundSource=fs.readFileSync(__dirname+'/../Pfert/sound.js','utf8')+';globalThis.sfx=PfertSound;';
const noAudio={window:{}};vm.createContext(noAudio);vm.runInContext(soundSource,noAudio);assert.doesNotThrow(()=>noAudio.sfx.play('shot'));
let audioStarts=0,audioClock=0;const pending=[],audioLog=[],gainLog=[];
function fakeSource(type){const o={type,connect:noop,disconnect:noop,start(time){audioStarts++;o.started=time;audioLog.push(o)},stop(time){o.stopped=time;pending.push(o)}};o.frequency={setValueAtTime(v){o.from=v},exponentialRampToValueAtTime(v){o.to=v}};return o}
class FakeAudio{constructor(){this.state='running';this.destination={};this.sampleRate=8000}get currentTime(){return audioClock}createDelay(){return {delayTime:{value:0},connect:noop,disconnect:noop}}createOscillator(){return fakeSource('sine')}createBufferSource(){return fakeSource('noise')}createBuffer(ch,length){const samples=new Float32Array(length);return {getChannelData:()=>samples}}createGain(){return {gain:{value:1,cancelScheduledValues(t){gainLog.push(['cancel',t])},setValueAtTime(v,t){gainLog.push(['set',v,t]);this.value=v},linearRampToValueAtTime(v,t){gainLog.push(['ramp',v,t])},exponentialRampToValueAtTime:noop},connect:noop,disconnect:noop}}createBiquadFilter(){return {frequency:{setValueAtTime:noop},connect:noop,disconnect:noop}}createStereoPanner(){return {pan:{setValueAtTime:noop},connect:noop,disconnect:noop}}}
const withAudio={window:{AudioContext:FakeAudio}};vm.createContext(withAudio);vm.runInContext(soundSource,withAudio);assert.equal(audioStarts,0);
for(let i=0;i<22;i++){audioClock+=.04;withAudio.sfx.play('shot')}assert.equal(withAudio.sfx.activeVoices,12,'vier Audio-Stimmen für wichtige Ereignisse reserviert');const beforePriority=audioStarts;withAudio.sfx.play('hurt');assert.ok(audioStarts>beforePriority,'Schaden bleibt bei vielen Schüssen hörbar');assert.ok(gainLog.some(e=>e[0]==='ramp'&&e[1]===.32),'Kampfklänge weichen bei Schaden zurück');assert.ok(withAudio.sfx.activeVoices<=16,'maximal 16 Audio-Stimmen');const beforeMute=audioStarts;withAudio.sfx.toggle();withAudio.sfx.play('shot');assert.equal(audioStarts,beforeMute);pending.splice(0).forEach(o=>o.onended());assert.equal(withAudio.sfx.activeVoices,0);withAudio.sfx.toggle();
const signatures=new Set();for(const style of ['normal','red','white','rose','port','speed','prism','saw','chain','orbit','mortar','wave','frost','vortex','storm','phoenix']){audioClock+=.2;const start=audioLog.length;withAudio.sfx.play('shot',{style,charged:true});assert.ok(audioLog.length>start,style+' hat Klang');signatures.add(audioLog[start].type+':'+Math.round(audioLog[start].from));pending.splice(0).forEach(o=>o.onended())}assert.ok(signatures.size>=14,'Waffen klingen unterschiedlich');
for(const event of ['hit','explode','pickup','card','synergy','heal','charge','charged','ready','block','graze','hurt','die','boss','bossClear','hammer','steam','formation','transition','overdrive','shatter','split','echo','segment','levelUp']){audioClock+=.4;const before=audioStarts;withAudio.sfx.play(event);assert.ok(audioStarts>before,event+' hat Cue');pending.splice(0).forEach(o=>o.onended())}
// Entire weapon recipes must differ, and specials need a longer low-frequency tail.
const recipes=new Set();for(const style of ['normal','red','white','rose','port','speed','prism','saw','chain','orbit','mortar','wave','frost','vortex','storm','phoenix']){audioClock+=1;let i=audioLog.length;withAudio.sfx.play('shot',{style});const normal=audioLog.slice(i);recipes.add(JSON.stringify(normal.map(o=>[o.type,Math.round(o.from||0),Math.round(o.to||0),+(o.stopped-o.started).toFixed(3)])));pending.splice(0).forEach(o=>o.onended());audioClock+=1;i=audioLog.length;withAudio.sfx.play('shot',{style,charged:true});assert.ok(audioLog.slice(i).some(o=>o.from===90&&o.to===28),'Sonderangriff hat eigenen Basston: '+style);pending.splice(0).forEach(o=>o.onended())}assert.equal(recipes.size,16,'alle Waffenrezepte unterscheiden sich');
audioClock+=1;withAudio.sfx.play('shot');const count=audioStarts;assert.equal(withAudio.sfx.play('shot'),false);assert.equal(audioStarts,count,'Dauerfeuer wird begrenzt');pending.splice(0).forEach(o=>o.onended());
assert.ok(audioLog.every(o=>o.stopped>o.started),'alle Stimmen haben ein Ende');

audioClock+=1;
const firstWarning=audioLog.length;
withAudio.sfx.play('bossSpecial');
assert.equal(audioLog.length-firstWarning,2,'Boss-Sonderangriff hat ein zweistufiges Warnsignal');
pending.splice(0).forEach(voice=>voice.onended());

const pickupSignatures=new Set();
for(const style of ['shield','rockets','sweeper']){
 audioClock+=1;
 const first=audioLog.length;
 withAudio.sfx.play('pickup',{style,x:240});
 const tones=audioLog.slice(first).filter(voice=>voice.from);
 assert.ok(tones.length>0);
 pickupSignatures.add(tones.map(voice=>voice.from+'-'+voice.to).join(','));
 pending.splice(0).forEach(voice=>voice.onended());
}
assert.equal(pickupSignatures.size,3,'Die drei Feld-Power-ups haben eigene Tonfolgen');
const postNotes=[];
for(let step=0;step<3;step++){
 audioClock+=1;
 const first=audioLog.length;
 withAudio.sfx.play('pickup',{style:'post',step});
 postNotes.push(audioLog[first].from);
 pending.splice(0).forEach(voice=>voice.onended());
}
assert.deepEqual(postNotes,[523.25,659.25,783.99]);
audioClock+=1;
const beforeWind=audioLog.length;
withAudio.sfx.play('slipstream');
assert.equal(audioLog.length-beforeWind,2);
pending.splice(0).forEach(voice=>voice.onended());

const rocketStart=audioLog.length;
withAudio.sfx.play('rocket',{x:240});
assert.ok(audioLog.slice(rocketStart).some(voice=>voice.buffer),'Raketenstart hat ein Triebwerksgeräusch');
pending.splice(0).forEach(voice=>voice.onended());

const impactSamples=[];
for(const armored of [false,true]){
 audioClock+=1;
 const start=audioLog.length;
 withAudio.sfx.play('hit',{type:1,armored});
 const layer=audioLog.slice(start).find(voice=>voice.buffer).buffer.getChannelData(0);
 assert.ok(layer.some(sample=>Math.abs(sample)>.01),'Treffertextur ist hörbar');
 assert.ok(layer.every(Number.isFinite),'Treffertextur enthält gültige Samples');
 impactSamples.push(layer);
 pending.splice(0).forEach(o=>o.onended());
}
assert.notEqual(impactSamples[0].length,impactSamples[1].length,'Metall und Holz haben unterschiedlich lange Resonanzen');

for(const [saved,expected] of [['0',0],['0.63',.63],['-1',.32],['2',.32],['kaputt',.32]]){
 const restored={window:{localStorage:{getItem:()=>saved}}};
 vm.runInNewContext(soundSource,restored);
 assert.equal(restored.sfx.musicVolume,expected);
}

console.log('OK: Soundausgabe, Stummschaltung und Stimmenbegrenzung.');
