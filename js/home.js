// Official players load only after an explicit Play action. Previews are local.
const MOMENTS = {
  title:{video:'igDpFxg60qU',title:'Florida vs. Houston · 2025 championship',practice:2},
  michigan:{video:'2ZLXQ62lWlQ',title:'Michigan vs. UConn · 2026 championship',collection:'2026',year:2026,tag:'The title',headline:'Back on top.',caption:'Michigan’s title night against UConn.',archive:2026,round:6,region:'Final Four',team:'Michigan'},
  mullins:{video:'vHOJ4Gsk7oE',title:'UConn vs. Duke · The 2026 Elite Eight finish',collection:'2026',year:2026,tag:'The finish',headline:'0.4 seconds. Pure chaos.',caption:'Braylon Mullins. One shot. A place in the Final Four.',archive:2026,round:4,region:'East',team:'UConn'},
  iowa:{video:'1RY_UbM3BeY',title:'Iowa vs. Florida · 2026 second round',collection:'2026',year:2026,tag:'The upset',headline:'The champs get challenged.',caption:'No. 9 Iowa takes on defending champion Florida.',archive:2026,round:2,region:'South',team:'Iowa'},
  oakland:{video:'PwY129KC_30',title:'Oakland vs. Kentucky · 2024 highlights',collection:'classics',year:2024,tag:'Ten threes',headline:'Ten threes. One wild night.',caption:'Jack Gohlke and No. 14 Oakland shake up March.',practice:0},
  fdu:{video:'fPN0AlPBRvA',title:'FDU vs. Purdue · The final-buzzer reactions',collection:'classics',year:2023,tag:'Giant killers',headline:'A No. 16 with other plans.',caption:'The players. The fans. The moment it sinks in.',practice:1},
  jenkins:{video:'L7FFJUz0tdo',title:'Villanova vs. North Carolina · The 2016 title winner',collection:'classics',year:2016,tag:'At the buzzer',headline:'A shot for the title.',caption:'Kris Jenkins lets it fly as the clock hits zero.',source:'https://www.ncaa.com/basketball-men/d1/villanova-college-basketball-championships-complete-history'}
};
let videoTrigger, activeMoment, momentCollection='2026';
function renderMoments() {
  const grid=$('momentGrid');grid.textContent='';grid.setAttribute('aria-label',momentCollection==='2026'?'2026 highlights':'Classic NCAA moments');
  document.querySelectorAll('[data-moments]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.moments===momentCollection)));
  Object.entries(MOMENTS).filter(([,m])=>m.collection===momentCollection).forEach(([key,m])=>{
    const card=el('article','moment-card'),play=el('button','moment-thumb');play.type='button';play.dataset.video=key;play.setAttribute('aria-label',`Play ${m.title}`);
    const img=el('img');img.src=`images/moments/${key}.jpg`;img.alt=`${m.title} video preview`;img.width=1280;img.height=720;img.loading='lazy';img.decoding='async';
    const icon=el('span','play-disc','▶');icon.setAttribute('aria-hidden','true');play.append(img,icon,el('span','moment-mini-tag',`${m.year} · ${m.tag}`));
    const copy=el('div','moment-card-copy');copy.append(el('h4','',m.headline),el('p','',m.caption));card.append(play,copy);grid.append(card);
  });
}
function startWarmup(index) {
  practiceIndex=index;renderPractice();navigateTo('learn',false);
  $('practiceLab').scrollIntoView({block:'start'});$('practiceTitle').focus({preventScroll:true});
}
function playMoment(key) {
  const moment=MOMENTS[key]; if(!moment)return;
  activeMoment=moment;videoTrigger=document.activeElement;
  $('videoTitle').textContent=moment.title;
  $('videoExternal').href=`https://www.youtube.com/watch?v=${moment.video}`;
  const game=moment.archive?ARCHIVE[moment.archive].games.find(g=>g.round===moment.round&&g.region===moment.region&&g.teams.some(t=>t.name===moment.team)):null;
  $('videoStory').href=game?.url||moment.source||PRACTICE_GAMES[moment.practice].source;
  $('videoStory').textContent=game?'Game box score ↗':'Read the game story ↗';
  $('videoPractice').textContent=moment.archive?'Explore the 2026 bracket →':moment.practice!==undefined?'Try this game →':'Try a practice game →';
  const frame=document.createElement('iframe');
  frame.title=moment.title;frame.src=`https://www.youtube-nocookie.com/embed/${moment.video}?autoplay=1&rel=0`;
  frame.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';frame.allowFullscreen=true;
  frame.referrerPolicy='strict-origin-when-cross-origin';
  $('videoPlayer').replaceChildren(frame);$('videoDialog').showModal();$('videoClose').focus();
}
function initHome() {
  renderMoments();
  document.addEventListener('click',e=>{const b=e.target.closest('[data-video]');if(b)playMoment(b.dataset.video);});
  document.querySelectorAll('[data-moments]').forEach(b=>b.addEventListener('click',()=>{momentCollection=b.dataset.moments;renderMoments();}));
  document.querySelector('[data-home-archive]').addEventListener('click',()=>{discoverMode='archive';renderDiscovery();navigateTo('explore');});
  $('videoClose').addEventListener('click',()=>$('videoDialog').close());
  $('videoDialog').addEventListener('close',()=>{$('videoPlayer').replaceChildren();if(videoTrigger?.isConnected)videoTrigger.focus({preventScroll:true});});
  $('videoPractice').addEventListener('click',()=>{
    const moment=activeMoment;$('videoDialog').close();
    if(moment.archive){archiveYear=moment.archive;archiveView='full';archiveRegion=moment.region;archiveRound=Math.min(moment.round,4);discoverMode='archive';renderDiscovery();navigateTo('explore');}
    else startWarmup(moment.practice??0);
  });
}
if(typeof module!=='undefined'&&module.exports)module.exports={MOMENTS};
