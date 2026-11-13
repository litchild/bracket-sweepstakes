function archiveRoundGames(tournament,region,round) {
  const slot={}, order=[1,8,5,4,6,3,7,2];
  tournament.games.filter(g=>g.round===1&&g.region===region).forEach(g=>{
    const index=order.indexOf(Math.min(...g.teams.map(t=>t.seed)));
    g.teams.forEach(t=>{slot[t.id]=index;});
  });
  return tournament.games.filter(g=>g.round===round&&(round>4||g.region===region)).sort((a,b)=>Math.min(...a.teams.map(t=>slot[t.id]??99))-Math.min(...b.teams.map(t=>slot[t.id]??99)));
}

module.exports={archiveRoundGames};
