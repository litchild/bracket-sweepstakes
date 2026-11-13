const C=require('../../utils/catalog');
const Sources=require('../../utils/videos');
const V=require('../../utils/view');
Page({
  data:{index:0,playing:false,failed:false},
  onLoad(q){const i=C.moments.findIndex(m=>m.id===q.id);this.setData({index:Math.max(0,i)});this.refresh();},
  refresh(){const moment=C.moments[this.data.index],source=Sources[moment.id],url=source&&/^https:\/\//.test(source.url)?source.url:'';this.setData({moment,total:C.moments.length,videoUrl:url,playing:false,failed:false});wx.setNavigationBarTitle({title:moment.tag});},
  previous(){if(this.data.index>0){this.stop();this.setData({index:this.data.index-1});this.refresh();}},
  next(){if(this.data.index<C.moments.length-1){this.stop();this.setData({index:this.data.index+1});this.refresh();}},
  play(){if(this.data.videoUrl)this.setData({playing:true});},
  error(){this.stop();this.setData({failed:true,playing:false});},
  stop(){if(this.data.playing)wx.createVideoContext('momentVideo',this).stop();},
  onHide(){this.stop();this.setData({playing:false});},
  onUnload(){this.stop();},
  source(){V.copy(this.data.moment.url);},
  practice(){const i=this.data.moment.practice;wx.navigateTo({url:'/pages/learn/index'+(i!==undefined?'?practice='+i:'')});},
  archive(){wx.navigateTo({url:'/pages/archive/index?year='+(this.data.moment.archive||2026)});},
  onShareAppMessage(){return V.share(this.data.moment.headline,'/pages/clip/index?id='+this.data.moment.id);}
});
