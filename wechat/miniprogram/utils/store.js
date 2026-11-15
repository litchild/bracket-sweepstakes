const L=require('./logic');
const C=require('./catalog');
const Camp=require('./camp');
const KEY='bs-wechat-v1';
function cleanPicks(value){
  const out={};
  if(!value||typeof value!=='object')return out;
  L.GAMES.forEach(g=>{const candidate=value[g.id];if(candidate&&L.cands(g,out).indexOf(candidate)>=0)out[g.id]=candidate;});
  return out;
}
function clean(value){
  const v=value&&typeof value==='object'?value:{};
  const practice={};
  C.practice.forEach((d,i)=>{if(v.practice&&d.game.teams.some(t=>t.id===v.practice[i]))practice[i]=v.practice[i];});
  const entries=Array.isArray(v.entries)?v.entries.filter(e=>e&&typeof e.name==='string').map(e=>({
    id:String(e.id||''),name:e.name.slice(0,24),picks:cleanPicks(e.picks),root:L.ROOTS[e.root]||e.root==='cn'?e.root:''
  })).filter(e=>L.countPicks(e.picks)===63).slice(0,100):[];
  return {picks:cleanPicks(v.picks),practice,camp:Camp.cleanCampState(v.camp),entries,
    results:cleanPicks(v.results),root:L.ROOTS[v.root]||v.root==='cn'?v.root:'',submittedId:String(v.submittedId||'')};
}
function load(){try{return clean(wx.getStorageSync(KEY));}catch(e){return clean(null);}}
function save(state){
  const next=clean(state);
  try{wx.setStorageSync(KEY,next);}catch(e){wx.showToast({title:'Could not save. Free device storage and try again.',icon:'none'});throw e;}
  return next;
}
function change(update){const state=load();update(state);return save(state);}
function pick(gid,tid){return change(s=>{
  if(Object.keys(s.results).length||!L.G[gid]||L.cands(L.G[gid],s.picks).indexOf(tid)<0)return;
  s.picks=L.applyPick(s.picks,gid,tid);
});}
function autoFill(root,cnTeam){return change(s=>{
  if(Object.keys(s.results).length)return;
  s.picks=L.randomBracket(L.helperFor(root,cnTeam));s.root=root||'';
});}
function submit(name){
  const state=load(), text=String(name||'').trim().slice(0,24);
  if(!text||L.countPicks(state.picks)!==63||Object.keys(state.results).length)return false;
  if(state.entries.length>=100&&!state.entries.some(e=>e.id===state.submittedId))return false;
  const id=state.submittedId||'local-'+Date.now()+'-'+Math.random().toString(36).slice(2,8);
  const entry={id,name:text,picks:state.picks,root:state.root};
  state.entries=state.entries.filter(e=>e.id!==id);state.entries.push(entry);state.submittedId=id;save(state);return true;
}
function practicePick(index,tid){return change(s=>{
  const item=C.practice[index];if(!item||s.practice[index]||!item.game.teams.some(t=>t.id===tid))return;
  s.practice[index]=tid;
});}
function miniPick(slot,tid){return change(s=>{s.camp.mini=Camp.applyMiniPick(s.camp.mini,slot,tid);if(s.camp.mini.final)s.camp.miniDone=true;});}
function quizPick(id,index){
  const question=Camp.QUIZ_ITEMS.find(q=>q.id===id);if(!question||question.answer!==index)return false;
  change(s=>{s.camp.quiz[id]=index;});return true;
}
function stats(){const s=load();return Camp.campStats(s.practice,s.camp);}
module.exports={KEY,cleanPicks,clean,load,save,change,pick,autoFill,submit,practicePick,miniPick,quizPick,stats};
