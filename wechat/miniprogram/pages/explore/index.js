const L=require('../../utils/logic');
const C=require('../../utils/catalog');
const S=require('../../utils/store');
const V=require('../../utils/view');
const Map=require('../../utils/regions');
Page({
  data:{section:'regions',region:'east',meaning:'home',showExplain:false,showAmbassadors:false,mapWidth:300,mapHeight:178},
  onLoad(){const w=wx.getWindowInfo?wx.getWindowInfo().windowWidth:wx.getSystemInfoSync().windowWidth;this.resizeMap(w);this.refresh();},
  onShow(){this.refresh();},
  onReady(){this.mapReady=true;this.drawMap();},
  onResize(e){this.resizeMap(e.size.windowWidth);this.drawMap();},
  resizeMap(width){const w=Math.min(520,width-56);this.setData({mapWidth:w,mapHeight:w*380/640});},
  refresh(){
    const root=L.ROOTS[this.data.region],bracket={east:'E',west:'W',south:'S',midwest:'M'}[this.data.region];
    const schools=Object.keys(L.TEAMS).filter(id=>this.data.meaning==='home'?L.TEAMS[id].home===this.data.region:L.TEAMS[id].br===bracket).map(V.team).sort((a,b)=>a.seed-b.seed);
    this.setData({roots:V.roots(),selected:Object.assign({},root,{color:V.colors[this.data.region]}),schools:schools.map(t=>Object.assign(t,{context:this.data.meaning==='home'?L.BR[t.br].name+' tournament group':L.ROOTS[t.home].name+' school'})),
      players:L.CN_IDS.map(id=>Object.assign({id,school:L.TEAMS[id].name},C.players[id])),locked:!!Object.keys(S.load().results).length},()=>this.drawMap());
  },
  section(e){this.setData({section:e.currentTarget.dataset.value});this.refresh();},
  meaning(e){this.setData({meaning:e.currentTarget.dataset.value});this.refresh();},
  region(e){const id=e.currentTarget.dataset.id;if(L.ROOTS[id]){this.setData({region:id});this.refresh();}},
  explain(){this.setData({showExplain:!this.data.showExplain});},
  ambassadors(){this.setData({showAmbassadors:!this.data.showAmbassadors});},
  profile:V.profile,
  player(e){wx.navigateTo({url:'/pages/profile/index?id='+e.currentTarget.dataset.id+'&type=player'});},
  archive(){wx.navigateTo({url:'/pages/archive/index'});},
  root(){
    const action=()=>{S.autoFill(this.data.region);V.go('bracket');};
    if(L.countPicks(S.load().picks))wx.showModal({title:'Pick for the '+this.data.selected.name+'?',content:'This replaces your draft with 63 region-based picks. You can edit each one.',success:r=>{if(r.confirm)action();}});else action();
  },
  mapTouch(e){const t=e.touches&&e.touches[0];if(!t)return;const key=Map.regionAt(t.x*640/this.data.mapWidth,t.y*640/this.data.mapWidth);if(key){this.setData({region:key});this.refresh();}},
  drawMap(){
    if(!this.mapReady||this.data.section!=='regions'||this.data.meaning!=='home')return;
    const ctx=wx.createCanvasContext('regionMap',this),s=this.data.mapWidth/640;
    ctx.clearRect(0,0,this.data.mapWidth,this.data.mapHeight);ctx.scale(s,s);
    const shape=(points,color,selected)=>{ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.setFillStyle(color);ctx.fill();ctx.setStrokeStyle(selected?'#17191F':'#FFFFFF');ctx.setLineWidth(selected?5:3);ctx.stroke();};
    Object.keys(Map.polygons).forEach(id=>{
      shape(Map.polygons[id],V.colors[id],id===this.data.region);const p=Map.labels[id];
      ctx.setTextAlign('center');ctx.setFillStyle('#FFFFFF');ctx.setFontSize(28);ctx.fillText(p[2],p[0],p[1]);ctx.setFontSize(12);ctx.fillText(p[3],p[0],p[1]+(id==='east'?23:28));
    });
    shape([[90,300],[107,306],[102,316],[86,311]],V.colors.west,false);shape([[119,314],[139,322],[134,334],[114,326]],V.colors.west,false);
    ctx.setTextAlign('left');ctx.setFillStyle('#626875');ctx.setFontSize(12);ctx.fillText('Hawaii',155,327);ctx.draw();
  },
  onShareAppMessage(){return V.share('Find your NCAA team.','/pages/explore/index');}
});
