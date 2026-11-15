// Reuse the website's verified data and pure rules. Never load browser UI in WeChat.
const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const repo = path.resolve(__dirname, '../..');
const mini = path.resolve(__dirname, '../miniprogram');
const profiles = require(path.join(repo,'js/profiles'));
const players = require(path.join(repo,'js/players'));
const archive = require(path.join(repo,'js/history-data'));
const {PRACTICE_GAMES, practiceGame} = require(path.join(repo,'js/experience'));
const {MOMENTS, videoOrder, momentPoster} = require(path.join(repo,'js/home'));
function write(name, contents) {
  const file=path.join(mini,name); fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,contents);
}
write('utils/logic.js', fs.readFileSync(path.join(repo,'js/logic.js')));
const pureCamp=fs.readFileSync(path.join(repo,'js/camp.js'),'utf8').split('let campState=')[0];
write('utils/camp.js',pureCamp+'\nmodule.exports={MINI_SIDES,QUIZ_ITEMS,applyMiniPick,cleanCampState,campStats};\n');
const archiveHelper=fs.readFileSync(path.join(repo,'js/experience.js'),'utf8').split('function archiveRoundGames')[1].split('function rankBrackets')[0];
write('utils/archive.js','function archiveRoundGames'+archiveHelper+'\nmodule.exports={archiveRoundGames};\n');
const moments=videoOrder().map(id=>Object.assign({id},MOMENTS[id],{
  poster:'/assets/moments/'+path.basename(momentPoster(id)),
  url:'https://www.youtube.com/watch?v='+MOMENTS[id].video
}));
const practice=PRACTICE_GAMES.map(d=>Object.assign({},d,{game:practiceGame(d,archive)}));
const playerCopy=JSON.parse(JSON.stringify(players));
for(const id of Object.keys(playerCopy))playerCopy[id].photo='/assets/players/'+id+'.jpg';
write('utils/catalog.js','// Generated from the website by scripts/sync-content.js.\nmodule.exports='+JSON.stringify({profiles,players:playerCopy,archive,practice,moments})+';\n');
// Small local images keep the development package usable without external CDNs.
for(const folder of ['teams','history','players','moments']){
  const dir=path.join(repo,'images',folder);
  for(const file of fs.readdirSync(dir)){
    if(!/\.(png|jpg)$/.test(file))continue;
    const target=path.join(mini,'assets',folder,file);fs.mkdirSync(path.dirname(target),{recursive:true});
    const size=folder==='teams'||folder==='history'?'80':folder==='players'?'320':file==='michigan-champions.jpg'?'900':'480';
    const args=['-Z',size];if(file.endsWith('.jpg'))args.push('-s','formatOptions','58');
    execFileSync('/usr/bin/sips',[...args,path.join(dir,file),'--out',target],{stdio:'ignore'});
  }
}
for(const name of ['your-turn.svg','trophy.svg'])write('assets/'+name,fs.readFileSync(path.join(repo,'images',name)));
console.log('Synced NCAA data, pure rules and local mobile images.');
