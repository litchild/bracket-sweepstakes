// Official players load only after an explicit Play action. Previews are local.
const FEATURED_MOMENT='michigan';
const MOMENTS = {
  michigan:{video:'2ZLXQ62lWlQ',title:'Michigan vs. UConn · 2026 championship',collection:'2026',year:2026,tag:'The title',headline:'Michigan takes the title.',caption:'The 2026 final against UConn.',archive:2026,round:6,region:'Final Four',team:'Michigan',practice:5},
  mullins:{video:'vHOJ4Gsk7oE',title:'UConn vs. Duke · The 2026 Elite Eight finish',collection:'2026',year:2026,tag:'The finish',headline:'0.4 seconds. Pure chaos.',caption:'Braylon Mullins. One shot. A place in the Final Four.',archive:2026,round:4,region:'East',team:'UConn',practice:3},
  iowa:{video:'1RY_UbM3BeY',title:'Iowa vs. Florida · 2026 second round',collection:'2026',year:2026,tag:'The upset',headline:'The champs get challenged.',caption:'No. 9 Iowa takes on defending champion Florida.',archive:2026,round:2,region:'South',team:'Iowa',practice:4},
  arizona:{video:'-OmxGRrPry4',title:'Michigan vs. Arizona · 2026 Final Four',collection:'2026',year:2026,tag:'Final Four',headline:'One win from the final.',caption:'Michigan and Arizona meet in Indianapolis.',archive:2026,round:5,region:'Final Four',team:'Michigan'},
  tennessee:{video:'jZXyRxUWuG4',title:'Michigan vs. Tennessee · 2026 Elite Eight',collection:'2026',year:2026,tag:'Elite Eight',headline:'The road through Chicago.',caption:'Michigan takes on Tennessee for a Final Four place.',archive:2026,round:4,region:'Midwest',team:'Michigan'},
  best2026:{video:'r2gg4c0zhNY',title:'The best moments of the 2026 tournament',collection:'2026',year:2026,tag:'The whole ride',headline:'March in 26 minutes.',caption:'Big finishes and tournament memories from 2026.',source:'https://www.ncaa.com/march-madness-live/watch',sourceLabel:'More on NCAA ↗'},
  title:{video:'igDpFxg60qU',title:'Florida vs. Houston · 2025 championship',poster:'images/moments/florida.jpg',collection:'classics',year:2025,tag:'The comeback',headline:'Down 12. Still dreaming.',caption:'Florida and Houston in a two-point title game.',practice:2},
  oakland:{video:'PwY129KC_30',title:'Oakland vs. Kentucky · 2024 highlights',collection:'classics',year:2024,tag:'Ten threes',headline:'Ten threes. One wild night.',caption:'Jack Gohlke and No. 14 Oakland shake up March.',practice:0},
  fdu:{video:'fPN0AlPBRvA',title:'FDU vs. Purdue · The final-buzzer reactions',collection:'classics',year:2023,tag:'Giant killers',headline:'A No. 16 with other plans.',caption:'The players. The fans. The moment it sinks in.',practice:1},
  poole:{video:'47W42BPvU4o',title:'Michigan vs. Houston · The final 90 seconds in 2018',collection:'classics',year:2018,tag:'Last-second shot',headline:'One shot to keep going.',caption:'The final 90 seconds of Michigan’s 2018 escape.',source:'https://www.youtube.com/watch?v=47W42BPvU4o',sourceLabel:'Open the official clip ↗'},
  jenkins:{video:'L7FFJUz0tdo',title:'Villanova vs. North Carolina · The 2016 title winner',collection:'classics',year:2016,tag:'At the buzzer',headline:'A shot for the title.',caption:'Kris Jenkins lets it fly as the clock hits zero.',source:'https://www.ncaa.com/basketball-men/d1/villanova-college-basketball-championships-complete-history'}
};
function videoOrder(){return [FEATURED_MOMENT,...Object.keys(MOMENTS).filter(k=>k!==FEATURED_MOMENT&&MOMENTS[k].collection==='2026'),...Object.keys(MOMENTS).filter(k=>MOMENTS[k].collection==='classics')];}
function momentPoster(key){return MOMENTS[key].poster||`images/moments/${key}.jpg`;}
let videoTrigger, activeMoment, activeMomentKey, momentCollection='2026';
function renderMoments() {
  const grid=$('momentGrid');grid.textContent='';grid.setAttribute('aria-label',momentCollection==='2026'?'2026 highlights':'Classic NCAA moments');
  $('videoLibraryCount').textContent=`${Object.keys(MOMENTS).length} videos & clips`;
  document.querySelectorAll('[data-moments]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.moments===momentCollection)));
  Object.entries(MOMENTS).filter(([key,m])=>key!==FEATURED_MOMENT&&m.collection===momentCollection).forEach(([key,m])=>{
    const card=el('article','moment-card'),play=el('button','moment-thumb');play.type='button';play.dataset.video=key;play.setAttribute('aria-label',`Play ${m.title}`);
    const img=el('img');img.src=momentPoster(key);img.alt=`${m.title} video preview`;img.width=1280;img.height=720;img.loading='lazy';img.decoding='async';
    const icon=el('span','play-disc','▶');icon.setAttribute('aria-hidden','true');play.append(img,icon,el('span','moment-mini-tag',`${m.year} · ${m.tag}`));
    const copy=el('div','moment-card-copy');copy.append(el('h4','',m.headline),el('p','',m.caption));card.append(play,copy);grid.append(card);
  });
}
function startWarmup(index) {
  practiceIndex=index;renderPractice();setCampMode('games');navigateTo('learn',false);
  $('practiceLab').scrollIntoView({block:'start'});$('practiceTitle').focus({preventScroll:true});
}
function playMoment(key) {
  const moment=MOMENTS[key]; if(!moment)return;
  const opening=!$('videoDialog').open;if(opening)videoTrigger=document.activeElement;
  activeMoment=moment;activeMomentKey=key;
  $('videoTitle').textContent=moment.title;
  $('videoExternal').href=`https://www.youtube.com/watch?v=${moment.video}`;
  const game=moment.archive?ARCHIVE[moment.archive].games.find(g=>g.round===moment.round&&g.region===moment.region&&g.teams.some(t=>t.name===moment.team)):null;
  $('videoStory').href=game?.url||moment.source||PRACTICE_GAMES[moment.practice].source;
  $('videoStory').textContent=game?'Game box score ↗':moment.sourceLabel||'Read the game story ↗';
  $('videoStory').hidden=$('videoStory').href===$('videoExternal').href;
  $('videoPractice').textContent=moment.practice!==undefined?'Try this game →':moment.archive?'Explore the 2026 bracket →':'Start the warm-up →';
  const position=videoOrder().indexOf(key);
  $('videoPosition').textContent=`${position+1} / ${videoOrder().length}`;
  $('videoPrev').disabled=position===0;$('videoNext').disabled=position===videoOrder().length-1;
  const frame=document.createElement('iframe');
  frame.title=moment.title;frame.src=`https://www.youtube-nocookie.com/embed/${moment.video}?autoplay=1&rel=0`;
  frame.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';frame.allowFullscreen=true;
  frame.referrerPolicy='strict-origin-when-cross-origin';
  $('videoPlayer').replaceChildren(frame);
  if(opening){$('videoDialog').showModal();$('videoClose').focus();}
}
function initHome() {
  renderMoments();
  document.addEventListener('click',e=>{const b=e.target.closest('[data-video]');if(b)playMoment(b.dataset.video);});
  document.querySelectorAll('[data-moments]').forEach(b=>b.addEventListener('click',()=>{momentCollection=b.dataset.moments;renderMoments();}));
  document.querySelector('[data-home-archive]').addEventListener('click',()=>{discoverMode='archive';renderDiscovery();navigateTo('explore');});
  $('videoPrev').addEventListener('click',()=>{const list=videoOrder();playMoment(list[list.indexOf(activeMomentKey)-1]);});
  $('videoNext').addEventListener('click',()=>{const list=videoOrder();playMoment(list[list.indexOf(activeMomentKey)+1]);});
  $('videoClose').addEventListener('click',()=>$('videoDialog').close());
  $('videoDialog').addEventListener('close',()=>{$('videoPlayer').replaceChildren();if(videoTrigger?.isConnected)videoTrigger.focus({preventScroll:true});});
  $('videoPractice').addEventListener('click',()=>{
    const moment=activeMoment;$('videoDialog').close();
    if(moment.practice!==undefined)startWarmup(moment.practice);
    else if(moment.archive){archiveYear=moment.archive;archiveView='full';archiveRegion=moment.region;archiveRound=Math.min(moment.round,4);discoverMode='archive';renderDiscovery();navigateTo('explore');}
    else resumeCamp();
  });
}
if(typeof module!=='undefined'&&module.exports)module.exports={MOMENTS,FEATURED_MOMENT,videoOrder,momentPoster};
