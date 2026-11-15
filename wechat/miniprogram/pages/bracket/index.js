const L=require('../../utils/logic');
const S=require('../../utils/store');
const V=require('../../utils/view');
Page({
  data:{region:'E',round:1,name:'',showHelpers:false,showEntry:false,showSeed:false},
  onShow(){this.refresh();},
  refresh(){
    const state=S.load(),regions=L.RX.concat('F').map(id=>({id,name:id==='F'?'Final Four':L.BR[id].name,count:L.countPicks(state.picks,id),total:id==='F'?3:15}));
    const games=L.GAMES.filter(g=>g.br===this.data.region&&(this.data.region==='F'||g.round===this.data.round));
    const total=L.countPicks(state.picks),locked=!!Object.keys(state.results).length,entry=state.entries.find(e=>e.id===state.submittedId);
    this.setData({regions,rounds:[1,2,3,4].map(id=>({id,label:L.ROUND_NAME[id]})),roots:V.roots(),players:L.CN_IDS.map(V.team),
      games:games.map(g=>V.game(g,state.picks)),count:total,locked,submitted:!!entry,name:entry?entry.name:this.data.name,
      dirty:!!entry&&(total!==63||L.encode(entry.picks)!==L.encode(state.picks)||entry.root!==state.root),
      roundComplete:games.every(g=>state.picks[g.id]),champion:V.team(state.picks['F6-0'])});
  },
  region(e){this.setData({region:e.currentTarget.dataset.id,round:1});this.refresh();wx.pageScrollTo({scrollTop:0});},
  round(e){this.setData({round:Number(e.currentTarget.dataset.id)});this.refresh();},
  pick(e){const d=e.currentTarget.dataset;if(!d.id)return;S.pick(d.game,d.id);this.refresh();wx.vibrateShort({type:'light'});},
  profile:V.profile,
  seed(){this.setData({showSeed:!this.data.showSeed});},
  helpers(){this.setData({showHelpers:!this.data.showHelpers});},
  entry(){this.setData({showEntry:!this.data.showEntry});},
  name(e){this.setData({name:e.detail.value});},
  fill(e){
    if(this.data.locked)return;
    const action=()=>{S.autoFill(e.currentTarget.dataset.root||'',e.currentTarget.dataset.team||null);this.refresh();};
    if(this.data.count)wx.showModal({title:'Replace your picks?',content:'Auto-fill makes a new bracket. You can edit every pick.',success:r=>{if(r.confirm)action();}});else action();
  },
  clear(){if(this.data.locked)return;wx.showModal({title:'Clear your draft?',content:'Saved entries and practice progress stay on this device.',success:r=>{if(r.confirm){S.change(s=>{s.picks={};s.root='';s.submittedId='';});this.refresh();}}});},
  next(){
    if(!this.data.roundComplete)return;
    if(this.data.region==='F'){this.setData({showEntry:true});return;}
    if(this.data.round<4)this.setData({round:this.data.round+1});else{const ids=L.RX.concat('F');this.setData({region:ids[ids.indexOf(this.data.region)+1],round:1});}
    this.refresh();wx.pageScrollTo({scrollTop:0});
  },
  submit(){if(S.submit(this.data.name)){wx.showToast({title:'Bracket saved',icon:'success'});this.refresh();}else wx.showToast({title:'Add a name and finish all 63 picks.',icon:'none'});},
  nextFan(){if(this.data.locked)return;S.change(s=>{s.picks={};s.root='';s.submittedId='';});this.setData({name:'',region:'E',round:1,showEntry:false});this.refresh();wx.pageScrollTo({scrollTop:0});},
  learn(){wx.navigateTo({url:'/pages/learn/index'});},
  standings(){V.go('standings');},
  onShareAppMessage(){return V.share('Who’s your champion? Make your NCAA bracket.','/pages/bracket/index');}
});
