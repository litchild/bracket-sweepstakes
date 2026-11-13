const L=require('./logic');
const C=require('./catalog');
const colors={east:'#E0252B',south:'#AA2332',west:'#14366A',midwest:'#1C65B8'};
function team(id){const t=L.TEAMS[id];return t?Object.assign({},t,{logo:'/assets/teams/'+id+'.png',cn:!!L.CN_PLAYERS[id]}):null;}
function historical(t){
  const current=Object.keys(C.profiles).find(id=>C.profiles[id].espnId===t.id);
  return Object.assign({},t,{logo:current?'/assets/teams/'+current+'.png':'/assets/history/'+t.id+'.png'});
}
function game(g,picks){return {id:g.id,round:g.round,label:L.ROUND_NAME[g.round],teams:L.cands(g,picks).map((id,i)=>{
  const t=team(id);return t?Object.assign(t,{picked:picks[g.id]===id,slot:i}):{id:'',name:'Pick the previous round',seed:'',logo:'',picked:false,slot:i};
})};}
function historyGame(g){return Object.assign({},g,{teams:g.teams.map(historical),label:L.ROUND_NAME[g.round]});}
function roots(){return L.ROOT_ORDER.map(id=>Object.assign({},L.ROOTS[id],{id,color:colors[id]}));}
function profile(event){const id=event.currentTarget.dataset.id;if(L.TEAMS[id])wx.navigateTo({url:'/pages/profile/index?id='+id});}
function share(title,path){return {title,path:path||'/pages/home/index',imageUrl:'/assets/moments/michigan-champions.jpg'};}
function go(page){wx.switchTab({url:'/pages/'+page+'/index'});}
function copy(url){if(/^https:\/\//.test(url))wx.setClipboardData({data:url});}
module.exports={team,historical,game,historyGame,roots,colors,profile,share,go,copy};
