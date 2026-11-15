const L=require('../../utils/logic');
const C=require('../../utils/catalog');
const S=require('../../utils/store');
const V=require('../../utils/view');
Page({
  data:{type:'school'},
  onLoad(q){const id=L.TEAMS[q.id]?q.id:'E1';this.setData({id,type:q.type==='player'&&C.players[id]?'player':'school',team:V.team(id),school:C.profiles[id],player:C.players[id]||null,home:L.ROOTS[L.TEAMS[id].home].name,group:L.BR[L.TEAMS[id].br].name,locked:!!Object.keys(S.load().results).length});},
  type(e){this.setData({type:e.currentTarget.dataset.value});},
  source(){V.copy(this.data.type==='player'?this.data.player.source:this.data.school.url);},
  champion(){
    if(this.data.locked)return;
    const action=()=>{S.autoFill('cn',this.data.id);V.go('bracket');};
    if(L.countPicks(S.load().picks))wx.showModal({title:'Make '+this.data.team.name+' your champion?',content:'This auto-fills all 63 picks. You can edit each game.',success:r=>{if(r.confirm)action();}});else action();
  },
  onShareAppMessage(){return V.share('Meet '+(this.data.type==='player'?this.data.player.name:this.data.team.name),'/pages/profile/index?id='+this.data.id+'&type='+this.data.type);}
});
