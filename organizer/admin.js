const byId=id=>document.getElementById(id);
const make=(tag,text)=>{const node=document.createElement(tag);node.textContent=text;return node;};
let key='', baseline=null, picks={}, closed=false, dirty=false;
async function request(action,body){
  const res=await fetch('/api/pilot?action='+action,{method:body?'POST':'GET',cache:'no-store',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});
  const data=await res.json();if(!res.ok)throw Error(data.error);return data;
}
function message(text){byId('notice').textContent=text;}
function error(e){message(({access:'Invalid organizer key.',early:'Scores can be released after the deadline.',stale:'Another session changed the result bracket. Refresh to load the latest version.',released:'A released winner cannot be changed.'})[e.message]||'Could not reach the shared store. Please retry.');}
function draw(){
  const round=Number(byId('round').value),host=byId('games');host.replaceChildren();
  for(const game of GAMES.filter(g=>g.round===round)){
    const line=make('label',(BR[game.br]?.name||'Final Four')+' · '+(game.idx+1)+' '),select=make('select','');
    const blank=new Option('Choose winner','');select.add(blank);
    const choices=cands(game,picks);
    choices.filter(Boolean).forEach(t=>select.add(new Option(TEAMS[t].name,t)));
    select.value=picks[game.id]||'';select.disabled=!choices.every(Boolean)||!!baseline.released[game.id];
    select.onchange=()=>{picks=applyPick(picks,game.id,select.value);if(!select.value)delete picks[game.id];dirty=true;draw();};
    line.append(select);host.append(line);
  }
  byId('progress').textContent=Object.keys(picks).length+' / 63 winners selected · '+Object.keys(baseline.released).length+' scored';
  byId('release').disabled=!closed || !Object.keys(picks).length;
}
async function refresh(){
  if(dirty && !confirm('Discard unsaved winner changes and refresh?'))return;
  try {
    const data=await request('admin');closed=data.closed;baseline=data.baseline;picks={...baseline.draft};dirty=false;
    const metrics=byId('metrics');metrics.replaceChildren();
    for(const [label,n] of [['Unique browsers',data.stats.visit],['Visits (browser sessions)',data.stats.session],['Started a bracket',data.stats.start],['Filled all 63 picks',data.stats.complete],['Submitted entries',data.entries.length]])metrics.append(make('p',label+' · '+n));
    const entries=byId('entries');entries.replaceChildren();if(!data.entries.length)entries.append(make('p','No entries yet.'));
    for(const entry of data.entries){const details=make('details','');details.append(make('summary',entry.name+' · '+new Date(entry.updatedAt).toLocaleString()));for(const g of GAMES)details.append(make('p',ROUND_NAME[g.round]+' · '+(BR[g.br]?.name||'Final Four')+' · '+(g.idx+1)+' · '+TEAMS[entry.picks[g.id]].name));entries.append(details);}
    byId('private').hidden=false;byId('login').hidden=true;message('Connected. Entry deadline: December 2, 23:59 Beijing time.');draw();
  }catch(e){error(e);}
}
async function save(mode){
  if(mode==='publish'&&!confirm('Release scores for these winners? Released winners are final.'))return;
  try{baseline=await request('results',{mode,version:baseline.version,picks});picks={...baseline.draft};dirty=false;draw();message(mode==='save'?'Private bracket saved.':'Scores released.');}catch(e){error(e);}
}
Object.entries(ROUND_NAME).forEach(([v,label])=>byId('round').add(new Option(label,v)));
byId('round').onchange=draw;byId('refresh').onclick=refresh;byId('save').onclick=()=>save('save');byId('release').onclick=()=>save('publish');
byId('login').onsubmit=e=>{e.preventDefault();key=byId('key').value.trim();byId('key').value='';refresh();};
byId('logout').onclick=()=>location.reload();
