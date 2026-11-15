const C=require('../../utils/catalog');
const V=require('../../utils/view');
const {archiveRoundGames}=require('../../utils/archive');
Page({
  data:{year:2026,years:[2026,2025,2024,2023],yearIndex:0,mode:'path',region:'East',round:1,regions:['East','West','South','Midwest','Final Four'],rounds:[{id:1,name:'Round of 64'},{id:2,name:'Round of 32'},{id:3,name:'Sweet 16'},{id:4,name:'Elite 8'}]},
  onLoad(q){const year=C.archive[q.year]?Number(q.year):2026;this.setData({year,yearIndex:this.data.years.indexOf(year)});this.refresh();},
  refresh(){
    const a=C.archive[this.data.year],final=a.games.find(g=>g.round===6),champion=V.historical(final.teams.find(t=>t.id===a.champion));
    const games=this.data.mode==='path'?a.games.filter(g=>g.teams.some(t=>t.id===a.champion&&t.won)).sort((a,b)=>a.round-b.round):this.data.region==='Final Four'?a.games.filter(g=>g.round>=5):archiveRoundGames(a,this.data.region,this.data.round);
    this.setData({champion,games:games.map(V.historyGame)});
  },
  year(e){const i=Number(e.detail.value);this.setData({yearIndex:i,year:this.data.years[i]});this.refresh();},
  mode(e){this.setData({mode:e.currentTarget.dataset.value});this.refresh();},
  region(e){this.setData({region:e.currentTarget.dataset.value,round:1});this.refresh();},
  round(e){this.setData({round:Number(e.currentTarget.dataset.value)});this.refresh();},
  source(e){const g=C.archive[this.data.year].games.find(g=>g.id===e.currentTarget.dataset.id);if(g)V.copy(g.url);},
  onShareAppMessage(){return V.share(this.data.year+' NCAA bracket: '+this.data.champion.name+'’s road to the title.','/pages/archive/index?year='+this.data.year);}
});
