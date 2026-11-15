const C=require('../../utils/catalog');
const S=require('../../utils/store');
const V=require('../../utils/view');
Page({
  data:{collection:'2026',clips:[],progress:{},hero:'/assets/moments/michigan-champions.jpg'},
  onLoad(){this.refresh();},
  onShow(){this.refresh();},
  refresh(){this.setData({progress:S.stats(),clips:C.moments.filter(m=>m.id!=='michigan'&&m.collection===this.data.collection)});},
  collection(e){this.setData({collection:e.currentTarget.dataset.value});this.refresh();},
  clip(e){wx.navigateTo({url:'/pages/clip/index?id='+(e.currentTarget.dataset.id||'michigan')});},
  warmup(){wx.navigateTo({url:'/pages/learn/index'});},
  bracket(){V.go('bracket');},
  archive(){wx.navigateTo({url:'/pages/archive/index'});},
  standings(){V.go('standings');},
  onShareAppMessage(){return V.share('Your picks. Your team. Your March.');}
});
