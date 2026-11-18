const $=s=>document.querySelector(s), dialog=$('#story-dialog'), content=$('#dialog-content');
let star='curry',trigger=null,step=0,storyKey='',practiceOrigin='a',practicePicks=[];
const stories={
 curry:{source:'https://www.ncaa.org/stories/olympics-paralympics/olympics-ncaa-x-team-usa-fast-facts-stephen-curry/',clip:'https://www.youtube.com/watch?v=tQN9hdPNVS4',image:'assets/curry.jpg',slides:[['You know the shooter.','In 2008, Stephen Curry played for Davidson, a US college team.'],['The underdog made a run.','No. 10 seed Davidson reached the last eight teams. Curry scored 128 points across four tournament games.'],['Every game could be the last.','March Madness is knockout college basketball. One loss ends a team’s run. A bracket is your prediction of who advances.']]},
 jimmer:{source:'https://byucougars.com/news/2017/03/30/fredette-to-be-featured-on-espns-outside-the-lines',slides:[['You may know him from Shanghai.','Jimmer Fredette was named the CBA’s International MVP in 2017 while playing for the Shanghai Sharks.'],['His college chapter came first.','At BYU, Fredette was the 2011 consensus national player of the year. Familiar basketball talent has an NCAA story.'],['Find a new team to follow.','March Madness brings college teams into a knockout tournament. Try predicting winners, then follow the teams you picked.']]},
 moment:{source:'https://ukathletics.com/news/2024/03/21/kentucky-falls-to-oakland-in-ncaa-first-round/',clip:'https://www.youtube.com/watch?v=PwY129KC_30',image:'assets/oakland.jpg',slides:[['The hot hand you recognize.','Jack Gohlke made ten three-pointers against Kentucky in the 2024 NCAA tournament.'],['The favorite went home.','No. 14 Oakland beat No. 3 Kentucky, 80–76. The smaller seed number means a higher ranking.'],['One game changes everything.','An upset is a lower-ranked team beating a favorite. In March Madness, that one loss ends the favorite’s tournament.']]}
};
function node(tag,text,className){const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(className)e.className=className;return e;}
function button(text,fn,className='cta'){const b=node('button',text,className);b.type='button';b.addEventListener('click',fn);return b;}
function link(text,url,className='text-link'){const a=node('a',text,className);a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a;}
function title(text){const h=node('h2',text,'dialog-title');h.id='dialog-title';return h;}
function show(kind){$('#dialog-type').textContent=kind;trigger=document.activeElement;dialog.showModal();$('#close-dialog').focus();}
dialog.addEventListener('close',()=>{if(trigger?.isConnected)trigger.focus({preventScroll:true});});
$('#close-dialog').addEventListener('click',()=>dialog.close());
function renderStory(){
 const data=stories[storyKey],slide=data.slides[step];content.replaceChildren();
 content.append(node('p',`STORYBOARD / ${step+1} OF 3`,'story-count'));
 if(data.image){const img=node('img');img.src=data.image;img.alt=storyKey==='curry'?'NCAA Curry highlight preview':'Oakland versus Kentucky highlight preview';img.className='story-image';content.append(img);}
 content.append(title(slide[0]),node('p',slide[1],'dialog-copy'));
 const actions=node('div',undefined,'story-actions');
 if(step<2)actions.append(button('Next →',()=>{step++;renderStory();}));
 else actions.append(button(storyKey==='moment'?'Try an upset pick →':'Try three picks →',()=>{if(storyKey==='moment')renderPrediction();else startPractice('a');}));
 if(data.clip)actions.append(link('Open official NCAA highlights ▶',data.clip));
 actions.append(link('Read the source ↗',data.source));content.append(actions,node('small',data.clip?'Local storyboard preview. Official video opens separately; availability varies by location.':'Historical story preview. This is a bridge into NCAA, not a current player roster.','story-source'));dialog.scrollTop=0;
}
document.querySelectorAll('[data-story]').forEach(b=>b.addEventListener('click',()=>{show('STORY PREVIEW');if(b.dataset.story==='prediction'){renderPrediction();return;}storyKey=b.dataset.story==='star'?star:'moment';step=0;renderStory();}));
document.querySelectorAll('[data-star]').forEach(b=>b.addEventListener('click',()=>{
 star=b.dataset.star;const c=star==='curry';document.querySelectorAll('[data-star]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
 $('#star-photo').hidden=!c;$('#jimmer-art').hidden=c;
 $('#star-kicker').textContent=c?'BEFORE THE NBA / 2008':'BEFORE SHANGHAI / 2011';
 $('#star-headline').replaceChildren(...(c?['Before the rings.','There was March.']:['You know Jimmer.','Meet his first stage.']).flatMap((s,i)=>i?[document.createElement('br'),document.createTextNode(s)]:[document.createTextNode(s)]));
 $('#star-blurb').textContent=c?'Curry took little Davidson to the last eight. Meet the tournament that made his college story.':'Before his Shanghai Sharks chapter, Fredette lit up college basketball at BYU. Follow the connection.';
 $('#star-story').textContent=c?'See Curry’s March story ↗':'See Jimmer’s college story ↗';$('#star-credit').textContent=c?'Preview: NCAA March Madness · Historical story':'Jersey illustration · Historical BYU / Shanghai connection';
}));
const teams=[{name:'Michigan',image:'michigan'},{name:'Arizona',image:'arizona'},{name:'UConn',image:'uconn'},{name:'Illinois',image:'illinois'}];
function startPractice(origin){practiceOrigin=origin;practicePicks=[];renderPractice();}
function renderPractice(){
 $('#dialog-type').textContent='PRACTICE / YOUR WINNERS ADVANCE';content.replaceChildren();const round=practicePicks.length;
 const candidates=round===0?[0,1]:round===1?[2,3]:[practicePicks[0],practicePicks[1]];
 content.append(node('p',`PICK ${round+1} OF 3`,'story-count'),title(round<2?`Who wins semifinal ${round+1}?`:'Now choose your champion.'),node('p',round<2?'Choose a winner. Your two winners will meet in the final.':'These are your two earlier winners. The one you choose here completes your bracket.','dialog-copy'));
 const list=node('div',undefined,'pick-list');candidates.forEach(i=>{const t=teams[i],b=button(t.name,()=>{practicePicks.push(i);if(practicePicks.length===3)renderResult();else renderPractice();},'');const img=node('img');img.src=`assets/${t.image}.png`;img.alt='';b.prepend(img);list.append(b);});content.append(list,node('p','2026 Final Four teams · Practice predictions, separate from actual results.','story-source'));dialog.scrollTop=0;
}
function renderResult(share=false){
 content.replaceChildren();const t=teams[practicePicks[2]];content.append(title(share?'Your picks card.':'That’s a bracket.'));
 const card=node('div',undefined,'result-card'),img=node('img');img.src=`assets/${t.image}.png`;img.alt='';card.append(node('span','MY MARCH PICK'),node('strong',t.name),img,node('p',`${teams[practicePicks[0]].name} + ${teams[practicePicks[1]].name} → ${t.name}`),node('span','3 PICKS / PRACTICE CHALLENGE'));content.append(card);
 content.append(node('p',share?'Share-card mockup: in a future version, send this image or a challenge link to your group chat. No message has been sent.':'You picked two winners, then a champion. The full bracket follows the same idea across 64 teams.','dialog-copy'));
 const actions=node('div',undefined,'story-actions');actions.append(link('Open the full prototype ↗','https://bracket-sweepstakes.netlify.app/','cta'));
 if(practiceOrigin==='c'&&!share)actions.append(button('Preview my picks card ↗',()=>renderResult(true),'cta dark'));
 actions.append(button('Try different picks',()=>startPractice(practiceOrigin),'text-link'));content.append(actions,node('small','This review mockup does not save entries or prefill the live prototype.','story-source'));dialog.scrollTop=0;
}
function renderPrediction(choice){
 $('#dialog-type').textContent='ONE HISTORICAL PRACTICE PICK';content.replaceChildren();content.append(title('Could a No. 16 beat a No. 1?'),node('p','Purdue faced FDU in 2023. A No. 1 seed is the top-ranked team in its group. Choose who you think advanced.','dialog-copy'));
 if(!choice){const list=node('div',undefined,'pick-list');['Purdue / No. 1','FDU / No. 16'].forEach(t=>list.append(button(t,()=>renderPrediction(t),'')));content.append(list);}
 else{const box=node('div',undefined,'result-card');box.append(node('span',`YOUR PICK: ${choice}`),node('strong','FDU 63–58'),node('p','The underdog won. One loss ended Purdue’s run.'));content.append(box,node('p','Even the highest-ranked team can lose. Your basketball instincts are enough to start making picks.','dialog-copy'),button('Try a mini bracket →',()=>startPractice('b')),link('Official Purdue game report ↗','https://purduesports.com/news/2023/03/17/purdue-season-ends-with-first-round-upset'));}
 dialog.scrollTop=0;
}
document.querySelectorAll('[data-practice]').forEach(b=>b.addEventListener('click',()=>{show('THREE-PICK CHALLENGE');startPractice(b.dataset.practice);}));
function filter(key){document.querySelectorAll('[data-concept]').forEach(c=>c.hidden=key!=='all'&&c.dataset.concept!==key);document.querySelector('.concepts').classList.toggle('single',key!=='all');document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===key)));}
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>filter(b.dataset.filter)));
if(matchMedia('(max-width:760px)').matches)filter('a');
