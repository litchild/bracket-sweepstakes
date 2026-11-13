// Official players load only after an explicit Play action. Previews are local.
const MOMENTS = {
  title:{video:'igDpFxg60qU',title:'Florida vs. Houston · 2025 championship',practice:2},
  oakland:{video:'PwY129KC_30',title:'Oakland vs. Kentucky · 2024 highlights',practice:0},
  fdu:{video:'fPN0AlPBRvA',title:'FDU vs. Purdue · The final-buzzer reactions',practice:1}
};
let videoTrigger, activeMoment;
function startWarmup(index) {
  practiceIndex=index;renderPractice();navigateTo('learn',false);
  $('practiceLab').scrollIntoView({block:'start'});$('practiceTitle').focus({preventScroll:true});
}
function playMoment(key) {
  const moment=MOMENTS[key]; if(!moment)return;
  activeMoment=moment;videoTrigger=document.activeElement;
  $('videoTitle').textContent=moment.title;
  $('videoExternal').href=`https://www.youtube.com/watch?v=${moment.video}`;
  $('videoStory').href=PRACTICE_GAMES[moment.practice].source;
  const frame=document.createElement('iframe');
  frame.title=moment.title;frame.src=`https://www.youtube-nocookie.com/embed/${moment.video}?autoplay=1&rel=0`;
  frame.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';frame.allowFullscreen=true;
  frame.referrerPolicy='strict-origin-when-cross-origin';
  $('videoPlayer').replaceChildren(frame);$('videoDialog').showModal();$('videoClose').focus();
}
function initHome() {
  document.querySelectorAll('[data-video]').forEach(b=>b.addEventListener('click',()=>playMoment(b.dataset.video)));
  document.querySelectorAll('[data-warmup]').forEach(b=>b.addEventListener('click',()=>startWarmup(Number(b.dataset.warmup))));
  document.querySelector('[data-home-archive]').addEventListener('click',()=>{discoverMode='archive';renderDiscovery();navigateTo('explore');});
  $('videoClose').addEventListener('click',()=>$('videoDialog').close());
  $('videoDialog').addEventListener('close',()=>{$('videoPlayer').replaceChildren();if(videoTrigger?.isConnected)videoTrigger.focus({preventScroll:true});});
  $('videoPractice').addEventListener('click',()=>{const index=activeMoment.practice;$('videoDialog').close();startWarmup(index);});
}
