/* Procedural sound effects and a shuffled soundtrack. */
const PfertSound=(()=>{
 let ctx=null,master=null,noiseBuffer=null,muted=false,voices=0,sequence=0;
 const last={};const LIMIT=16, RESERVE=4;let priority=false;
 const tracks=['ken','zangief','vega','blanka','cammy','chun-li','ryu','guile'];
 let music=null,playlist=[],previousTrack=null,musicActive=false;
 function playMusic(){
  if(musicActive&&!muted)music.play().catch(()=>{});
 }
 function nextTrack(){
  if(!musicActive)return;
  if(!playlist.length){
   playlist=tracks.slice();
   for(let i=playlist.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [playlist[i],playlist[j]]=[playlist[j],playlist[i]];
   }
   if(playlist[0]===previousTrack){
    const j=1+Math.floor(Math.random()*(playlist.length-1));
    [playlist[0],playlist[j]]=[playlist[j],playlist[0]];
   }
  }
  previousTrack=playlist.shift();
  music.src='assets/music/'+previousTrack+'.mp3';
  playMusic();
 }
 function startMusic(){
  if(!window.Audio)return;
  if(!music){
   music=new window.Audio();
   music.volume=.25;
   music.addEventListener('ended',nextTrack);
   // A controller start may need a keyboard or pointer gesture to unlock audio.
   const resumeMusic=()=>{if(music.paused&&!music.ended)playMusic()};
   window.addEventListener('keydown',resumeMusic);
   window.addEventListener('click',resumeMusic);
  }
  musicActive=true;
  playlist=[];
  previousTrack=null;
  nextTrack();
 }
 function stopMusic(){
  musicActive=false;
  if(music)music.pause();
 }
 const profiles={
  normal:['triangle',760,370,.07,.026],red:['square',260,75,.09,.023],white:['sine',1220,760,.09,.036],rose:['sine',570,940,.13,.033],port:['sawtooth',200,128,.23,.019],speed:['triangle',1680,450,.065,.026],prism:['triangle',1120,1680,.12,.024],saw:['sawtooth',145,92,.18,.023],chain:['square',1380,460,.075,.017],orbit:['sine',340,530,.16,.038],mortar:['triangle',115,38,.2,.05],wave:['sine',280,85,.22,.05],frost:['triangle',1900,900,.12,.019],vortex:['sine',145,58,.27,.053],storm:['sawtooth',95,44,.34,.03],phoenix:['triangle',720,155,.16,.03],satellite:['sine',1000,750,.07,.02],echo:['sine',820,560,.12,.027]
 };
 function wake(){
  if(muted)return;
  try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;
   if(!ctx){ctx=new Audio();master=ctx.createGain();master.gain.setValueAtTime(.7,ctx.currentTime);
    if(ctx.createDynamicsCompressor){const limiter=ctx.createDynamicsCompressor();limiter.threshold.value=-16;limiter.knee.value=10;limiter.ratio.value=8;master.connect(limiter);limiter.connect(ctx.destination)}else master.connect(ctx.destination);
    if(ctx.createBuffer){noiseBuffer=ctx.createBuffer(1,Math.floor((ctx.sampleRate||44100)*.5),ctx.sampleRate||44100);const data=noiseBuffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*.65}
   }
   if(ctx.state==='suspended')ctx.resume().catch(()=>{});
  }catch{ctx=null;master=null;noiseBuffer=null}
 }
 function wire(source,volume,length,start,pan=0,cutoff=0){
  const gain=ctx.createGain(),nodes=[source,gain];gain.gain.setValueAtTime(.0001,start);gain.gain.linearRampToValueAtTime?gain.gain.linearRampToValueAtTime(volume,start+.006):gain.gain.setValueAtTime(volume,start);
  gain.gain.exponentialRampToValueAtTime(.0001,start+length);let tail=source;
  if(cutoff&&ctx.createBiquadFilter){const filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.setValueAtTime(cutoff,start);tail.connect(filter);tail=filter;nodes.push(filter)}tail.connect(gain);tail=gain;
  if(ctx.createStereoPanner){const p=ctx.createStereoPanner();p.pan.setValueAtTime(pan,start);tail.connect(p);tail=p;nodes.push(p)}tail.connect(master);voices++;
  source.onended=()=>{voices=Math.max(0,voices-1);nodes.forEach(node=>node.disconnect())};source.start(start);source.stop(start+length+.02);
 }
 function tone(type,from,to,length,volume,start,pan=0,cutoff=0){if(voices>=(priority?LIMIT:LIMIT-RESERVE))return;const osc=ctx.createOscillator();osc.type=type;osc.frequency.setValueAtTime(Math.max(20,from),start);osc.frequency.exponentialRampToValueAtTime(Math.max(20,to),start+length);wire(osc,volume,length,start,pan,cutoff)}
 function noise(length,volume,start,cutoff=1800,pan=0){if(voices>=(priority?LIMIT:LIMIT-RESERVE)||!noiseBuffer||!ctx.createBufferSource)return;const source=ctx.createBufferSource();source.buffer=noiseBuffer;wire(source,volume,length,start,pan,cutoff)}
 function play(kind,options={}){
  if(muted)return false;wake();if(!ctx||ctx.state!=='running')return false;
  const o=typeof options==='boolean'?{charged:options}:options||{},now=ctx.currentTime;
  priority=['hurt','die','boss','transition','overdrive','ready'].includes(kind);
  const throttle={hit:.045,explode:.025,graze:.15,shot:.022,split:.07,shatter:.09};
  if(last[kind]!==undefined&&now-last[kind]<(throttle[kind]||0))return false;last[kind]=now;
  const pan=o.x===undefined?0:Math.max(-.65,Math.min(.65,(o.x/960-.5)*1.3));const variation=[1,.97,1.04,1.015][sequence++%4];
  if(kind==='shot'){
   const style=o.style||'normal',p=profiles[style]||profiles.normal,m=o.charged?.72:1,length=p[3]*(o.charged?1.55:1);
   tone(p[0],p[1]*variation*m,p[2]*m,length,p[4]*(o.charged?1.35:1),now,pan,style==='port'?2400:0);
   tone('triangle',Math.max(70,p[1]*.38)*m,Math.max(35,p[2]*.45)*m,length*.8,.012,now,pan,1600);
   if(['red','saw','chain','frost','storm','phoenix','mortar'].includes(style))noise(Math.min(.25,length),o.charged?.028:.012,now,style==='frost'?6500:style==='storm'?1200:2500,pan);
   if(['white','prism','orbit','rose'].includes(style))tone('sine',p[1]*1.51,p[2]*1.48,length*.7,.013,now+.012,pan);
   if(o.charged)tone('sine',105,42,.14,.036,now,pan);
  }else if(kind==='hit'){tone(o.type===3||o.type===7?'square':'triangle',o.type===3||o.type===7?520:380,150,.045,.012,now,pan);noise(.035,.008,now,3600,pan)}
  else if(kind==='explode'||kind==='segment'){const big=kind==='segment'||o.elite;tone('triangle',big?150:185+(o.type||0)*9,32,big?.28:.17,big?.06:.045,now,pan);noise(big?.32:.18,big?.045:.029,now,o.type===3||o.type===7?3000:1100,pan);if(big)tone('sawtooth',260,65,.2,.015,now+.02,pan)}
  else if(kind==='pickup'){tone('triangle',420,630,.12,.032,now);tone('square',630,840,.1,.012,now+.065)}
  else if(kind==='card'){tone('triangle',330,495,.16,.029,now);tone('triangle',495,660,.16,.026,now+.08)}
  else if(kind==='synergy'){tone('square',330,495,.18,.024,now);tone('triangle',495,660,.18,.03,now+.08);tone('triangle',660,990,.24,.026,now+.16)}
  else if(kind==='heal'){tone('sine',440,880,.24,.034,now);tone('sine',660,1320,.2,.018,now+.03)}
  else if(kind==='charge'){tone('sine',70,245,.26,.018,now);noise(.19,.006,now,1000)}
  else if(kind==='charged'||kind==='ready'){tone('triangle',kind==='ready'?920:740,kind==='ready'?1380:1100,.13,.026,now);tone('sine',1480,1320,.09,.013,now+.025)}
  else if(kind==='block'){tone('triangle',1250,360,.1,.029,now);noise(.07,.014,now,4200)}
  else if(kind==='graze'){tone('sine',2100,1400,.045,.016,now)}
  else if(kind==='hurt'){tone('sawtooth',180,52,.24,.045,now);noise(.16,.024,now,1300)}
  else if(kind==='die'){tone('sawtooth',310,32,.65,.035,now);noise(.35,.025,now,1600)}
  else if(kind==='boss'){tone('sawtooth',110,55,.48,.04,now,0,1100);tone('square',220,165,.38,.025,now+.08);noise(.3,.025,now,1200)}
  else if(kind==='transition'){tone('triangle',120,480,.45,.032,now);tone('sine',240,960,.4,.023,now+.04);noise(.3,.015,now,1800)}
  else if(kind==='overdrive'){tone('sawtooth',90,280,.4,.04,now,0,1800);tone('square',220,440,.32,.028,now+.04);tone('triangle',440,880,.28,.026,now+.1);noise(.25,.025,now,2200)}
  else if(kind==='shatter'||kind==='split'||kind==='echo'){tone('triangle',kind==='shatter'?1300:900,kind==='echo'?650:350,.12,.019,now);if(kind!=='echo')noise(.08,.012,now,5000)}
  return true;
 }
 function toggle(){
  muted=!muted;
  if(master)master.gain.setValueAtTime(muted?0:.7,ctx.currentTime);
  if(muted){
   if(music)music.pause();
  }else{
   wake();
   playMusic();
  }
  return muted;
 }
 return {wake,play,startMusic,stopMusic,toggle,get muted(){return muted},get activeVoices(){return voices}};
})();
