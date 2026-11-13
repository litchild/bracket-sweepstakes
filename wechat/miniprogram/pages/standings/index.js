const L=require('../../utils/logic');
const S=require('../../utils/store');
const V=require('../../utils/view');
Page({
  data:{panel:'board',showDemo:false},
  onShow(){this.refresh();},
  refresh(){
    const state=S.load(),rows=state.entries.map(e=>({id:e.id,name:e.name,champion:V.team(e.picks['F6-0']),points:L.score(e.picks,state.results),correct:Object.keys(state.results).filter(id=>e.picks[id]===state.results[id]).length})).sort((a,b)=>b.points-a.points);
    rows.forEach((row,i)=>{row.rank=i&&rows[i-1].points===row.points?rows[i-1].rank:i+1;});
    const games=L.GAMES.filter(g=>state.results[g.id]).map(g=>Object.assign(V.game(g,state.results),{winner:V.team(state.results[g.id])}));
    this.setData({rows,count:state.entries.length,round:L.latestRound(state.results),decided:games.length,games,finished:games.length===63});
  },
  panel(e){this.setData({panel:e.currentTarget.dataset.value});},
  demo(){this.setData({showDemo:!this.data.showDemo});},
  simulate(){
    const action=()=>{S.change(s=>{const result=L.nextRound(s.results);if(result)s.results=result.winners;});this.refresh();};
    if(!this.data.decided)wx.showModal({title:'Start demo results?',content:'Simulated results lock picks on this device. You can reset the demo to unlock them.',success:r=>{if(r.confirm)action();}});else action();
  },
  reset(){wx.showModal({title:'Reset demo results?',content:'Saved entries and practice progress stay. Picks will unlock.',success:r=>{if(r.confirm){S.change(s=>{s.results={};});this.refresh();}}});},
  bracket(){V.go('bracket');},
  onShareAppMessage(){return V.share('Bring a little competition. Make your NCAA bracket.','/pages/standings/index');}
});
