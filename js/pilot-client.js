const pilot = {
  board: [], mine:null, scored:0, closed:false, closesAt:'2026-12-02T16:00:00Z',
  crowd:{roots:{},champions:{},games:{}}, serial:0, loaded:false, error:false
};
function visitorToken() {
  let token=localStorage.getItem('pilot-dec-token');
  if(!token){
    token=Array.from(crypto.getRandomValues(new Uint8Array(32)),b=>b.toString(16).padStart(2,'0')).join('');
    localStorage.setItem('pilot-dec-token',token);
  }
  return token;
}
async function pilotRequest(action,body) {
  const response=await fetch('/api/pilot?action='+action,{
    method:body?'POST':'GET',cache:'no-store',
    headers:{'Content-Type':'application/json',Authorization:'Bearer '+visitorToken()},
    body:body?JSON.stringify(body):undefined
  });
  const data=await response.json();
  if(!response.ok)throw new Error(data.error||'storage');
  return data;
}
async function refreshPilot() {
  const serial=++pilot.serial;
  try {
    const data=await pilotRequest('board');
    if(serial!==pilot.serial)return;
    Object.assign(pilot,data,{loaded:true,error:false});
    S.dbState='on';
    if(data.mine && !countPicks(S.picks) && !load('bs-draft')){
      S.picks={...data.mine.picks}; S.root=data.mine.root==='manual'?null:data.mine.root;
      S.cnTeam=S.root?S.picks['F6-0']:null;
    }
    if(data.mine && !$('pilotName').value)$('pilotName').value=data.mine.name;
  } catch {
    if(serial!==pilot.serial)return;
    pilot.error=true; S.dbState='off';
  }
  renderLive(); renderBar();
  if(S.tab==='standings')renderPilotBoard();
  if(S.tab==='crowd')renderCrowd();
}
const sendingEvents=new Set();
async function pilotEvent(event) {
  try {
    let session=sessionStorage.getItem('pilot-session');
    if(!session){session=crypto.randomUUID();sessionStorage.setItem('pilot-session',session);}
    const store=event==='visit'?sessionStorage:localStorage, key='pilot-event-'+event;
    if(store.getItem(key)||sendingEvents.has(event))return;
    sendingEvents.add(event);
    await pilotRequest('event',{event,session});store.setItem(key,'1');
  } catch { /* A failed visit count must never prevent entry. */ }
  finally {sendingEvents.delete(event);}
}
function recordProgress(count) {
  if(count)pilotEvent('start');
  if(count===63)pilotEvent('complete');
}
function renderPilotBoard() {
  $('boardProgress').textContent=pilot.scored+' / 63';
  const own=pilot.board.find(e=>e.id===pilot.mine?.id);
  $('myStanding').textContent=own && own.rank ? 'Your rank: #'+own.rank+' · '+own.correct+' / '+pilot.scored : 'Your standing';
  $('boardStatus').textContent=pilot.error?'Could not refresh standings. Try again.':
    !pilot.loaded?'Loading standings…':!pilot.board.length?'Be the first to submit a bracket.':
    !pilot.scored?'Entries received. Scores appear when the organizer releases results.':own?'Your submitted picks are scored below.':'Ranked by correct picks.';
  const list=$('leaderRows');list.replaceChildren();
  for(const row of pilot.board) {
    const li=el('li'), name=el('b','',row.name);
    name.translate=false;
    li.append(el('span','',row.rank?'#'+row.rank:'·'),name);
    if(row.id===pilot.mine?.id){li.classList.add('is-mine');li.append(el('small','','You'));}
    li.append(el('strong','',pilot.scored?row.correct+' / '+pilot.scored:'—'));list.append(li);
  }
}
function openEntryDialog(){
  if(locked()||countPicks(S.picks)!==63)return;
  $('entryError').textContent='';$('entryDialog').showModal();$('pilotName').focus();
}
function initPilot(){
  $('boardRefresh').addEventListener('click',refreshPilot);
  $('entryCancel').addEventListener('click',()=>$('entryDialog').close());
  $('entryForm').addEventListener('submit',async e=>{
    e.preventDefault();if(S.busy)return;
    const submit=e.submitter; S.busy=true;submit.disabled=true;renderBar();
    try {
      const {entry}=await pilotRequest('entry',{name:$('pilotName').value,picks:S.picks,root:S.root});
      pilot.mine=entry;$('entryDialog').close();$('sMsg').textContent='Entry saved.';
      navigateTo('standings');await refreshPilot();
    } catch(error) {
      if(error.message==='closed')pilot.closed=true;
      $('entryError').textContent=error.message==='closed'?'The entry deadline has passed.':error.message==='name'?'Use a nickname of 1 to 32 characters.':'Could not save. Check your connection and try again.';
    } finally {S.busy=false;submit.disabled=false;renderBar();}
  });
  refreshPilot();pilotEvent('visit');recordProgress(countPicks(S.picks));
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshPilot();});
  setInterval(()=>{if(!document.hidden && S.tab==='standings')refreshPilot();},45000);
  const untilClose=Date.parse(pilot.closesAt)-Date.now();
  if(untilClose>0 && untilClose<2147483647)setTimeout(()=>{pilot.closed=true;renderAll();},untilClose);
}
