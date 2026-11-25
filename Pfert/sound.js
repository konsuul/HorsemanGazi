/* Procedural sound effects and a shuffled soundtrack. */
const PfertSound=(()=>{
 let ctx=null,master=null,combat=null,noiseBuffer=null,muted=false,voices=0,sequence=0,duckUntil=0;
 const last={};const LIMIT=16, RESERVE=4;let priority=false;
 const tracks=['ken','zangief','vega','blanka','cammy','chun-li','ryu','guile','balrog'];
 let music=null,playlist=[],previousTrack=null,musicActive=false,musicEnabled=true,musicVolume=.32;
 function playMusic(){
  if(musicActive&&musicEnabled)music.play().catch(()=>{});
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
   music.volume=musicVolume;
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
 function toggleMusic(){
  musicEnabled=!musicEnabled;
  if(musicEnabled)playMusic();
  else if(music)music.pause();
  return musicEnabled;
 }
 const profiles={
  normal:['triangle',760,370,.07,.026],red:['square',260,75,.09,.023],white:['sine',1220,760,.09,.036],rose:['sine',570,940,.13,.033],port:['sawtooth',200,128,.23,.019],speed:['triangle',1680,450,.065,.026],prism:['triangle',1120,1680,.12,.024],saw:['sawtooth',145,92,.18,.023],chain:['square',1380,460,.075,.017],orbit:['sine',340,530,.16,.038],mortar:['triangle',115,38,.2,.05],wave:['sine',280,85,.22,.05],frost:['triangle',1900,900,.12,.019],vortex:['sine',145,58,.27,.053],storm:['sawtooth',95,44,.34,.03],phoenix:['triangle',720,155,.16,.03],satellite:['sine',1000,750,.07,.02],echo:['sine',820,560,.12,.027]
 };
 const foleyProfiles={
  wood:[.13,[112,187,291],.53,30],
  metal:[.22,[435,754,1291,2179],.33,16],
  blast:[.29,[62,94,147],.8,20],
  heavy:[.46,[44,71,108],.86,15],
  crystal:[.22,[880,1229,1758],.14,15],
  shield:[.19,[290,486,954,1532],.38,17],
  portal:[.41,[134,203,311,477],.21,9]
 };
 const foleyBuffers=new Map();
 const priorityCues=new Set(['hurt','die','boss','bossSpecial','formation','transition','overdrive','ready','levelUp']);
 const throttle={hit:.065,explode:.055,graze:.18,shot:.035,split:.1,shatter:.12,levelUp:.24,bossSpecial:.22};
 const pitchSteps=[1,.97,1.04,1.015];
 const shotBodies={normal:155,red:96,white:240,rose:185,port:80,speed:195,prism:220,saw:72,chain:130,orbit:165,mortar:62,wave:100,frost:260,vortex:55,storm:68,phoenix:115};
 const accents={pickup:[.035,.008,3200],card:[.055,.009,1100],synergy:[.13,.012,2800],heal:[.11,.008,850],charge:[.18,.01,700],charged:[.06,.012,1800],ready:[.08,.014,1400],graze:[.045,.009,5000],shatter:[.16,.022,5600],split:[.05,.012,2600],echo:[.13,.009,950]};
 function reflectedCombat(){
  if(!ctx.createDelay||!ctx.createBiquadFilter)return;
  for(const [seconds,cutoff,amount,position] of [[.036,2850,.075,-.56],[.062,1950,.057,.51],[.097,1260,.025,0]]){
   const delay=ctx.createDelay(.12),damp=ctx.createBiquadFilter(),wet=ctx.createGain();
   delay.delayTime.value=seconds;damp.type='lowpass';damp.frequency.value=cutoff;wet.gain.value=amount;
   combat.connect(delay);delay.connect(damp);damp.connect(wet);
   if(ctx.createStereoPanner){
    const pan=ctx.createStereoPanner();pan.pan.setValueAtTime(position,ctx.currentTime);
    wet.connect(pan);pan.connect(master);
   }else wet.connect(master);
  }
 }
 function seededNoise(seed){
  return ()=>{
   seed=(Math.imul(seed,1664525)+1013904223)>>>0;
   return seed/2147483648-1;
  };
 }
 function foleyBuffer(key){
  if(foleyBuffers.has(key))return foleyBuffers.get(key);
  const [length,modes,noiseMix,decay]=foleyProfiles[key];
  const sampleRate=ctx.sampleRate||44100;
  const buffer=ctx.createBuffer(1,Math.ceil(length*sampleRate),sampleRate);
  const data=buffer.getChannelData(0),random=seededNoise(key.charCodeAt(0)*971);
  const airy=key==='crystal'||key==='metal';
  let grit=0;
  for(let i=0;i<data.length;i++){
   const time=i/sampleRate,progress=time/length;
   const white=random();
   grit+=(white-grit)*(airy?.21:.085);
   const attack=Math.min(1,time/.0025);
   const finish=Math.min(1,(1-progress)*7);
   const flutter=key==='portal'?.65+.35*Math.sin(time*64)**2:1;
   let resonance=0;
   for(let j=0;j<modes.length;j++){
    const bend=key==='portal'?1+time*.92:1-time*.48;
    resonance+=Math.sin(6.283185*modes[j]*time*bend)*Math.exp(-time*decay*(1+j*.65))/(j+1);
   }
   const texture=(airy?white-grit:grit*2.7)*Math.exp(-time*decay*1.15);
   data[i]=Math.round(2048*attack*finish*flutter*(resonance*.35*(1-noiseMix)+texture*.53*noiseMix))/2048;
  }
  foleyBuffers.set(key,buffer);
  return buffer;
 }
 function wake(){
  if(muted)return;
  try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;
   if(!ctx){ctx=new Audio();master=ctx.createGain();master.gain.setValueAtTime(.7,ctx.currentTime);combat=ctx.createGain();combat.connect(master);
    reflectedCombat();

    if(ctx.createDynamicsCompressor){const limiter=ctx.createDynamicsCompressor();limiter.threshold.value=-14;limiter.knee.value=9;limiter.ratio.value=7;limiter.attack.value=.004;limiter.release.value=.16;master.connect(limiter);limiter.connect(ctx.destination)}else master.connect(ctx.destination);
    if(ctx.createBuffer){noiseBuffer=ctx.createBuffer(1,Math.floor((ctx.sampleRate||44100)*.5),ctx.sampleRate||44100);const data=noiseBuffer.getChannelData(0),random=seededNoise(6093);for(let i=0;i<data.length;i++)data[i]=random()*.65}
   }
   if(ctx.state==='suspended')ctx.resume().catch(()=>{});
  }catch{ctx=null;master=null;noiseBuffer=null;foleyBuffers.clear()}
 }
 function wire(source,volume,length,start,pan=0,cutoff=0){
  const gain=ctx.createGain(),nodes=[source,gain];gain.gain.setValueAtTime(.0001,start);gain.gain.linearRampToValueAtTime?gain.gain.linearRampToValueAtTime(volume,start+.006):gain.gain.setValueAtTime(volume,start);
  // Fast impact, short body, then a separate tail instead of a single fading beep.
  if(gain.gain.linearRampToValueAtTime){gain.gain.linearRampToValueAtTime(volume*.48,start+Math.min(.045,length*.35));gain.gain.linearRampToValueAtTime(volume*.3,start+length*.6)}
  gain.gain.exponentialRampToValueAtTime(.0001,start+length);let tail=source;
  if(cutoff&&ctx.createBiquadFilter){const filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.setValueAtTime(cutoff,start);if(filter.frequency.exponentialRampToValueAtTime)filter.frequency.exponentialRampToValueAtTime(Math.max(180,cutoff*.28),start+length);tail.connect(filter);tail=filter;nodes.push(filter)}tail.connect(gain);tail=gain;
  if(ctx.createStereoPanner){const p=ctx.createStereoPanner();p.pan.setValueAtTime(pan,start);tail.connect(p);tail=p;nodes.push(p)}tail.connect(priority?master:combat);voices++;
  source.onended=()=>{voices=Math.max(0,voices-1);nodes.forEach(node=>node.disconnect())};source.start(start);source.stop(start+length+.02);
 }
 function tone(type,from,to,length,volume,start,pan=0,cutoff=0){if(voices>=(priority?LIMIT:LIMIT-RESERVE))return;const osc=ctx.createOscillator();osc.type=type;osc.frequency.setValueAtTime(Math.max(20,from),start);osc.frequency.exponentialRampToValueAtTime(Math.max(20,to),start+length);wire(osc,volume,length,start,pan,cutoff)}
 function noise(length,volume,start,cutoff=1800,pan=0){if(voices>=(priority?LIMIT:LIMIT-RESERVE)||!noiseBuffer||!ctx.createBufferSource)return;const source=ctx.createBufferSource();source.buffer=noiseBuffer;source.playbackRate&&(source.playbackRate.value=.88+Math.random()*.24);wire(source,volume,length,start,pan,cutoff)}
 function foley(key,volume,start,pan=0){
  if(voices>=(priority?LIMIT:LIMIT-RESERVE)||!ctx.createBufferSource||!ctx.createBuffer)return;
  const source=ctx.createBufferSource();
  source.buffer=foleyBuffer(key);
  wire(source,volume,foleyProfiles[key][0],start,pan);
 }
 function play(kind,options={}){
  if(muted)return false;wake();if(!ctx||ctx.state!=='running')return false;
  const o=typeof options==='boolean'?{charged:options}:options||{},now=ctx.currentTime;
  priority=priorityCues.has(kind);
  if(last[kind]!==undefined&&now-last[kind]<(throttle[kind]||0))return false;last[kind]=now;
  // Briefly clear space for player feedback without raising its peak volume.
  if(priority&&combat.gain.cancelScheduledValues){duckUntil=Math.max(duckUntil,now+(kind==='die'?.7:.32));combat.gain.cancelScheduledValues(now);combat.gain.setValueAtTime(combat.gain.value,now);combat.gain.linearRampToValueAtTime(.32,now+.012);combat.gain.setValueAtTime(.32,duckUntil);combat.gain.linearRampToValueAtTime(1,duckUntil+.18)}
  const pan=o.x===undefined?0:Math.max(-.65,Math.min(.65,(o.x/960-.5)*1.3));const variation=pitchSteps[sequence++%4];
  if(kind==='shot'){
   const style=o.style||'normal',p=profiles[style]||profiles.normal,m=o.charged?.75:1,length=p[3]*(o.charged?1.65:1);
   const v=variation*m;
   tone(p[0],p[1]*v,p[2]*v,length,p[4],now,pan,1800);
   // Body and transient are deliberately different for each weapon family.
   const body=shotBodies[style]||150;
   tone('triangle',body*v,body*.48,length*1.15,.025,now,pan,1100);
   const n=(d,vol,cut,delay=0)=>noise(d,vol,now+delay,cut,pan);
   const t=(wave,from,to,d,vol,delay=0,offset=0)=>tone(wave,from*v,to*v,d,vol,now+delay,Math.max(-.8,Math.min(.8,pan+offset)),2600);
   switch(style){
    case 'normal': n(.035,.018,1500);break;
    case 'red': n(.16,.033,2200);t('square',180,55,.1,.013,.025);break;
    case 'white': n(.065,.016,5400);t('sine',720,410,.11,.017,.025,.15);break;
    case 'rose': t('triangle',285,570,.16,.017,.035);t('sine',430,650,.12,.013,.075,.18);break;
    case 'port': t('sawtooth',95,190,length,.018,.012);n(.045,.014,3000);break;
    case 'speed': n(.025,.025,3800);t('square',390,180,.045,.012,.018);break;
    case 'prism': foley('crystal',.04,now+.02,pan);t('triangle',810,760,.1,.012,.055,.18);break;
    case 'saw': t('square',110,80,.2,.016,.018);n(.14,.018,1700);break;
    case 'chain': n(.035,.028,4800);t('square',280,90,.045,.019,.04,.2);break;
    case 'orbit': t('sine',250,370,.22,.018,.025,-.2);t('triangle',375,250,.16,.013,.065,.2);break;
    case 'mortar': foley('blast',.053,now,pan);t('sine',95,32,.27,.033);break;
    case 'wave': t('triangle',180,65,.28,.025,.035);n(.15,.016,1200);break;
    case 'frost': n(.11,.022,6200);t('sine',880,640,.15,.012,.045,.18);break;
    case 'vortex': t('sawtooth',70,140,.26,.018,.025);n(.22,.018,650);break;
    case 'storm': n(.19,.035,2400);t('square',150,48,.26,.021,.025);break;
    case 'phoenix': n(.2,.025,3400);t('triangle',180,540,.18,.021,.025);break;
    default: n(.06,.012,1800);
   }
   if(o.charged){tone('sine',90,28,.32,.045,now,pan);noise(.25,.026,now,1500,pan)}
  }else if(kind==='rocket'){
   tone('triangle',145*variation,58,.15,.039,now,pan,1250);
   noise(.19,.036,now,3200,pan);
   tone('sine',340,760,.12,.014,now+.018,pan);
  }else if(kind==='hit'){
   const hard=o.type===3||o.type===7||o.armored;
   tone(hard?'square':'triangle',(hard?520:380)*variation,150,.045,.012,now,pan);
   foley(hard?'metal':'wood',hard?.032:.038,now,pan);
  }
  else if(kind==='explode'||kind==='segment'){
   const big=kind==='segment'||o.elite;
   tone('triangle',big?150:185+(o.type||0)*9,32,big?.28:.17,big?.06:.045,now,pan);
   foley(big?'heavy':'blast',big?.094:.068,now,pan);
   tone('sine',big?85:115,28,big?.45:.23,.027,now,pan);
   if(big||o.type===3||o.type===7)foley('metal',.024,now+.043,pan);
  }
  else if(kind==='pickup'){
   if(o.style==='post'){
    const note=[523.25,659.25,783.99][o.step]||523.25;
    tone('triangle',note,note*1.005,.13,.028,now,pan);
    if(o.step===2)tone('sine',1046.5,1046.5,.2,.019,now+.085,pan);
   }else if(o.style==='shield'){
    tone('sine',330,495,.19,.04,now,pan);
    foley('shield',.052,now+.025,pan);
   }else if(o.style==='rockets'){
    for(let i=0;i<3;i++)tone('triangle',440+i*110,540+i*110,.075,.025,now+i*.048,pan);
   }else if(o.style==='sweeper'){
    tone('triangle',330,990,.18,.028,now,pan);
    tone('sine',660,1320,.14,.019,now+.055,pan);
   }else{
    tone('triangle',420,630,.12,.032,now,pan);
    tone('square',630,840,.1,.012,now+.065,pan);
   }
  }
  else if(kind==='card'){tone('triangle',330,495,.16,.029,now);tone('triangle',495,660,.16,.026,now+.08)}
  else if(kind==='synergy'){tone('square',330,495,.18,.024,now);tone('triangle',495,660,.18,.03,now+.08);tone('triangle',660,990,.24,.026,now+.16)}
  else if(kind==='heal'){tone('sine',440,880,.24,.034,now);tone('sine',660,1320,.2,.018,now+.03)}
  else if(kind==='charge'){tone('sine',70,245,.26,.018,now);noise(.19,.006,now,1000)}
  else if(kind==='charged'||kind==='ready'){tone('triangle',kind==='ready'?920:740,kind==='ready'?1380:1100,.13,.026,now);tone('sine',1480,1320,.09,.013,now+.025)}
  else if(kind==='block'){tone('triangle',1250,360,.1,.029,now,pan);foley('shield',.054,now,pan)}
  else if(kind==='graze'){tone('sine',2100,1400,.045,.016,now)}
  else if(kind==='slipstream'){
   tone('sine',1397,1760,.09,.022,now,pan);
   tone('triangle',880,1175,.12,.017,now+.045,pan);
  }
  else if(kind==='hurt'){tone('square',85,45,.18,.025,now,0,700);tone('sawtooth',180,52,.24,.045,now);noise(.16,.024,now,1300)}
  else if(kind==='die'){tone('triangle',120,30,.75,.035,now);tone('square',220,65,.45,.016,now+.1,0,900);tone('sawtooth',310,32,.65,.035,now);noise(.35,.025,now,1600)}
  else if(kind==='boss'){tone('sine',60,32,.65,.045,now);tone('sawtooth',110,55,.48,.04,now,0,1100);tone('square',220,165,.38,.025,now+.08);noise(.3,.025,now,1200)}
  else if(kind==='bossSpecial'){
   tone('triangle',290,385,.11,.043,now,0,2100);
   tone('triangle',480,645,.13,.038,now+.12,0,2400);
  }
  else if(kind==='formation'){
   tone('triangle',493,370,.15,.036,now,0,1900);
   tone('triangle',493,370,.16,.033,now+.18,0,1900);
  }
  else if(kind==='transition'){tone('triangle',120,480,.45,.032,now,-.22);tone('sine',240,960,.4,.023,now+.04,.22);foley('portal',.067,now)}
  else if(kind==='overdrive'){tone('sawtooth',90,280,.4,.04,now,0,1800);tone('square',220,440,.32,.028,now+.04);tone('triangle',440,880,.28,.026,now+.1);noise(.25,.025,now,2200)}
  else if(kind==='levelUp'){
   tone('triangle',392,394,.14,.033,now,-.23);
   tone('triangle',494,497,.18,.036,now+.052,.18);
   tone('triangle',659,664,.24,.036,now+.105,0);
   foley('crystal',.06,now+.11);
  }
  else if(kind==='shatter'||kind==='split'||kind==='echo'){tone('triangle',kind==='shatter'?1300:900,kind==='echo'?650:350,.12,.019,now);if(kind!=='echo')noise(.08,.012,now,5000)}
  // Short material tails give feedback a physical edge without constant ambience.
  if(accents[kind]){const [d,v,f]=accents[kind];noise(d,v,now,f,pan)}
  return true;
 }
 function toggle(){
  muted=!muted;
  if(master){
   const gain=master.gain,now=ctx.currentTime,target=muted?0:.7;
   if(gain.cancelScheduledValues&&gain.linearRampToValueAtTime){
    gain.cancelScheduledValues(now);
    gain.setValueAtTime(gain.value,now);
    gain.linearRampToValueAtTime(target,now+.015);
   }else gain.setValueAtTime(target,now);
  }
  if(!muted)wake();
  return muted;
 }
 return {wake,play,startMusic,stopMusic,toggleMusic,toggle,get musicVolume(){return musicVolume},set musicVolume(value){musicVolume=value;if(music)music.volume=value},get muted(){return muted},get activeVoices(){return voices}};
})();
