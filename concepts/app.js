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

// Concepts 04 to 06: feature ideas. Read-only data from ../js/logic.js (field, game tree, seed strength, points)
// and ../js/history-data.js (verified 2026 results). Practice saves nothing and never touches the prototype.
const real=(()=>{const A=ARCHIVE['2026'],ids={},out={};A.games.filter(g=>g.round===1).forEach(g=>g.teams.forEach(t=>{ids[t.id]=RX.find(X=>BR[X].name===g.region)+t.seed;}));A.games.forEach(g=>g.teams.forEach(t=>{const id=ids[t.id],o=out[id]=out[id]||{last:0,games:{}};o.last=Math.max(o.last,g.round);const w=g.teams.find(x=>x.won);o.games[g.round]={winner:ids[w.id],score:`${w.score}–${g.teams.find(x=>!x.won).score}`};if(!t.won){o.lostTo=ids[w.id];o.score=o.games[g.round].score;}}));return out;})();
const teamNamed=n=>Object.values(TEAMS).find(t=>t.name===n);
function runText(id){const o=real[id];if(!o.lostTo)return 'won the title';const w=TEAMS[o.lostTo];return `${o.last===6?'lost the championship game':`lost in the ${ROUND_NAME[o.last]}`} to No. ${w.seed} ${w.name}, ${o.score}`;}

// 04 / Your NBA star's school. Colleges verified on Basketball Reference; see docs/concept-sources.md.
const fans=[['durant','Kevin Durant','Texas'],['tatum','Jayson Tatum','Duke'],['booker','Devin Booker','Kentucky'],['westbrook','Russell Westbrook','UCLA'],['jordan','Michael Jordan','North Carolina'],['irving','Kyrie Irving','Duke'],['davis','Anthony Davis','Kentucky'],['sga','Shai Gilgeous-Alexander','Kentucky'],['embiid','Joel Embiid','Kansas'],['olajuwon','Hakeem Olajuwon','Houston'],['magic','Magic Johnson','Michigan State'],['brunson','Jalen Brunson','Villanova'],['edwards','Anthony Edwards','Georgia'],['mitchell','Donovan Mitchell','Louisville']];
let fanKey='durant';
function starPath(id){const sel={};GAMES.forEach(g=>{const [a,b]=cands(g,sel);sel[g.id]=a===id||b===id?id:Math.random()<strength(a)/(strength(a)+strength(b))?a:b;});return GAMES.filter(g=>cands(g,sel).includes(id)).map(g=>{const [a,b]=cands(g,sel);return {round:g.round,opp:TEAMS[a===id?b:a]};});}
function renderStar(key){
 $('#dialog-type').textContent='PRACTICE / YOUR STAR’S SCHOOL';content.replaceChildren();
 if(!key){content.append(node('p','STEP 1 OF 2','story-count'),title('Who do you follow?'),node('p','Choose an NBA player. His college team wins every game in your practice bracket.','dialog-copy'));const list=node('div',undefined,'pick-list');fans.forEach(([k,n,s])=>{const t=teamNamed(s),b=button('',()=>renderStar(k),'two-line');b.append(node('span',n),node('small',`${t.name} · No. ${t.seed} seed, ${BR[t.br].name}`));list.append(b);});content.append(list,node('p','Colleges from Basketball Reference · 2026 field as a stand-in for 2027.','story-source'));dialog.scrollTop=0;return;}
 const [,n,s]=fans.find(f=>f[0]===key),t=teamNamed(s),ol=node('ol',undefined,'path-list');
 content.append(node('p','STEP 2 OF 2','story-count'),title(`${t.name} wins it all.`),node('p',`${n} played college basketball at ${t.name}. In this practice bracket, ${t.name} wins all six games. Every other game is a coin flip weighted by seed.`,'dialog-copy'));
 starPath(t.id).forEach(p=>{const li=node('li');li.append(node('span',ROUND_NAME[p.round]),node('b',`Beat No. ${p.opp.seed} ${p.opp.name}`));ol.append(li);});
 const actions=node('div',undefined,'story-actions');actions.append(button('Shuffle the other games',()=>renderStar(key),'cta dark'),button('Choose another player',()=>renderStar(),'text-link'),link('Open the full prototype ↗','https://bracket-sweepstakes.netlify.app/','text-link'));
 content.append(ol,node('p',`In the real 2026 tournament, ${t.name} ${runText(t.id)}.`,'real-line'),actions,node('small','Practice only. Nothing is saved or sent to the prototype.','story-source'));dialog.scrollTop=0;
}
document.querySelectorAll('[data-fan]').forEach(b=>b.addEventListener('click',()=>{
 fanKey=b.dataset.fan;const [,n,s]=fans.find(f=>f[0]===fanKey),t=teamNamed(s);document.querySelectorAll('[data-fan]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
 $('#pennant-school').textContent=t.name.toUpperCase();$('#pennant-seed').textContent=`NO. ${t.seed} SEED · ${BR[t.br].name.toUpperCase()} BRACKET`;$('#fan-kicker').textContent=`${n.toUpperCase()} / ${t.name.toUpperCase()}`;$('#fan-cta').textContent=`Fill my bracket for ${t.name} →`;
}));
const features={d:()=>renderStar(fanKey)};
document.querySelectorAll('[data-feature]').forEach(b=>b.addEventListener('click',()=>{show('PRACTICE');features[b.dataset.feature]();}));

// 05 / Draft watch. Top 10 picks of the June 2026 draft (Basketball Reference); all ten schools were in the 2026 field.
const prospects=[[1,'AJ Dybantsa','BYU'],[2,'Darryn Peterson','Kansas'],[3,'Cameron Boozer','Duke'],[4,'Caleb Wilson','North Carolina'],[5,'Keaton Wagler','Illinois'],[6,'Mikel Brown Jr.','Louisville'],[7,'Darius Acuff Jr.','Arkansas'],[8,'Kingston Flemings','Houston'],[9,'Morez Johnson Jr.','Michigan'],[10,'Brayden Burries','Arizona']];
const outcomes=['Lost in the Round of 64','Lost in the Round of 32','Lost in the Sweet 16','Lost in the Elite 8','Lost in the Final Four','Lost in the championship game','Won the title'],reached=['Round of 64','Round of 32','Sweet 16','Elite 8','Final Four','Runner-up','Champion'];
const outcomeOf=id=>real[id].lostTo?real[id].last-1:6;
function renderDraft(pick,call){
 $('#dialog-type').textContent='PRACTICE / HOW FAR WILL HE GO?';content.replaceChildren();
 if(!pick){content.append(node('p','STEP 1 OF 2','story-count'),title('Choose a prospect.'),node('p','These were the top 10 picks in the June 2026 NBA draft. Each one came from a 2026 tournament team.','dialog-copy'));const list=node('div',undefined,'pick-list');prospects.forEach(([p,n,s])=>{const t=teamNamed(s),b=button('',()=>renderDraft(p),'two-line');b.append(node('span',n),node('small',`No. ${p} pick · No. ${t.seed} seed ${t.name}, ${BR[t.br].name}`));list.append(b);});content.append(list,node('p','Draft order from Basketball Reference · 2026 results from the official bracket.','story-source'));dialog.scrollTop=0;return;}
 const [,n,s]=prospects.find(x=>x[0]===pick),t=teamNamed(s);
 if(call===undefined){content.append(node('p','STEP 2 OF 2','story-count'),title(`How far does ${t.name} go?`),node('p',`${n} played for No. ${t.seed} seed ${t.name}. Predict where its 2026 run ended.`,'dialog-copy'));const list=node('div',undefined,'pick-list compact');outcomes.forEach((o,i)=>list.append(button(o,()=>renderDraft(pick,i),'')));content.append(list);dialog.scrollTop=0;return;}
 const actual=outcomeOf(t.id),off=Math.abs(actual-call),card=node('div',undefined,'result-card'),run=runText(t.id);
 card.append(node('span',`YOUR CALL: ${outcomes[call]}`),node('strong',`${t.name}: ${reached[actual]}`),node('p',run[0].toUpperCase()+run.slice(1)+'.'));
 const actions=node('div',undefined,'story-actions');actions.append(button('Try another prospect',()=>renderDraft(),'cta dark'),link('2026 draft: Basketball Reference ↗','https://www.basketball-reference.com/draft/NBA_2026.html'));
 content.append(title(off?`${['One','Two','Three','Four','Five','Six'][off-1]} round${off>1?'s':''} off.`:'Exactly right.'),card,node('p',`${n} went No. ${pick} in the June 2026 NBA draft. A 2027 version would show projected picks during March.`,'dialog-copy'),actions,node('small','Practice only. Nothing is saved or sent to the prototype.','story-source'));dialog.scrollTop=0;
}
features.e=()=>renderDraft();
