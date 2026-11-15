const L=require('../../utils/logic');
const S=require('../../utils/store');
const V=require('../../utils/view');
Page({
  data:{count:0,favorites:[],matchups:[],roots:[]},
  onShow(){
    const state=S.load(),entries=state.entries,n=entries.length,champions={};
    entries.forEach(e=>{const id=e.picks['F6-0'];champions[id]=(champions[id]||0)+1;});
    const favorites=Object.keys(champions).map(id=>Object.assign(V.team(id),{count:champions[id],percent:Math.round(champions[id]/n*100)})).sort((a,b)=>b.count-a.count).slice(0,6);
    const roots=V.roots().map(r=>Object.assign(r,{count:entries.filter(e=>e.root===r.id).length}));
    const manual=entries.filter(e=>!e.root).length,cn=entries.filter(e=>e.root==='cn').length;
    const matchups=L.GAMES.filter(g=>!state.results[g.id]&&L.cands(g,state.results).every(Boolean)).slice(0,6).map(g=>{
      const ids=L.cands(g,state.results),eligible=g.round===1?entries:entries.filter(e=>ids.indexOf(e.picks[g.id])>=0),den=eligible.length;
      return {id:g.id,label:L.ROUND_NAME[g.round],eligible:den,teams:ids.map(id=>Object.assign(V.team(id),{percent:den?Math.round(eligible.filter(e=>e.picks[g.id]===id).length/den*100):0}))};
    });
    this.setData({count:n,favorites,roots,manual,cn,matchups});
  },
  bracket(){V.go('bracket');},
  profile:V.profile,
  onShareAppMessage(){return V.share('Who would you pick? Join the NCAA bracket challenge.','/pages/crowd/index');}
});
