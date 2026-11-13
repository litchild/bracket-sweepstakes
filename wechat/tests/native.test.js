const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {createRequire}=require('node:module');
const root=path.resolve(__dirname,'../miniprogram');
const L=require('../miniprogram/utils/logic');
const S=require('../miniprogram/utils/store');
const C=require('../miniprogram/utils/catalog');
const Map=require('../miniprogram/utils/regions');
function mock(){
  let stored;const navigations=[];
  global.wx={getStorageSync:()=>stored,setStorageSync:(key,value)=>{stored=JSON.parse(JSON.stringify(value));},
    showToast(){},vibrateShort(){},pageScrollTo(){},setNavigationBarTitle(){},setClipboardData(){},
    getWindowInfo:()=>({windowWidth:390}),showModal:o=>o.success({confirm:true}),
    switchTab:o=>navigations.push(o.url),navigateTo:o=>navigations.push(o.url),
    createVideoContext:()=>({stop(){}})};
  return {wx:global.wx,navigations,corrupt:value=>{stored=value;}};
}
function page(name,wx,overrides={}){
  const file=path.join(root,'pages',name,'index.js');let definition;
  const nativeRequire=createRequire(file);
  vm.runInNewContext(fs.readFileSync(file,'utf8'),{Page:d=>{definition=d;},require:p=>Object.hasOwn(overrides,p)?overrides[p]:nativeRequire(p),wx});
  const instance={data:JSON.parse(JSON.stringify(definition.data||{})),setData(patch,callback){Object.assign(this.data,patch);if(callback)callback();}};
  Object.keys(definition).filter(k=>typeof definition[k]==='function').forEach(k=>{instance[k]=definition[k].bind(instance);});
  return instance;
}
function event(dataset,value){return {currentTarget:{dataset},detail:{value}};}
test('native bracket rules and tournament data match the reviewed website',()=>{
  assert.equal(fs.readFileSync(path.join(root,'utils/logic.js'),'utf8'),fs.readFileSync(path.resolve(__dirname,'../../js/logic.js'),'utf8'));
  assert.deepEqual(C.archive,require('../../js/history-data'));
  assert.equal(C.moments.length,11);assert.equal(C.practice.length,6);
});
test('WeChat storage rejects invalid paths, unsafe drafts and incomplete entries',()=>{
  const m=mock();m.corrupt({picks:{'F6-0':'E1','E1-0':'fake','E1-1':'E8'},practice:{0:'fake'},camp:{quiz:{seed:2},mini:{final:'130'}},entries:[{name:'Bad',picks:{}}]});
  const s=S.load();assert.deepEqual(s.picks,{'E1-1':'E8'});assert.deepEqual(s.practice,{});assert.deepEqual(s.camp.quiz,{});assert.deepEqual(s.camp.mini,{});assert.deepEqual(s.entries,[]);
});
test('native pick handler clears dependent winners and cannot pick an unavailable team',()=>{
  const m=mock();S.autoFill('cn','W2');const ui=page('bracket',m.wx);ui.onShow();assert.equal(ui.data.count,63);
  const before=S.load().picks,first=L.GAMES.find(g=>g.srcT&&g.srcT.includes('W2')),other=first.srcT.find(id=>id!==before[first.id]);
  ui.pick(event({game:first.id,id:other}));assert.equal(S.load().picks[first.id],other);assert.ok(ui.data.count<63);
  const clean=JSON.stringify(S.load().picks);S.pick('F6-0','fake');assert.equal(JSON.stringify(S.load().picks),clean);
});
test('practice awards exactly 120 XP once, retries work, and real picks stay untouched',()=>{
  mock();
  C.practice.forEach((p,i)=>{const wrong=p.game.teams.find(t=>!t.won);S.practicePick(i,wrong.id);S.practicePick(i,p.game.teams.find(t=>t.won).id);assert.equal(S.load().practice[i],wrong.id);});
  assert.equal(S.stats().xp,60);assert.equal(S.quizPick('seed',2),false);assert.equal(S.stats().xp,60);
  const Camp=require('../miniprogram/utils/camp');Camp.QUIZ_ITEMS.forEach(q=>S.quizPick(q.id,q.answer));
  S.miniPick('a','130');S.miniPick('b','41');S.miniPick('final','130');assert.equal(S.stats().xp,120);assert.equal(S.stats().completed,10);
  S.miniPick('a','12');assert.equal(S.load().camp.mini.final,undefined);assert.equal(S.stats().xp,120);
  S.change(s=>{s.camp.mini={};});S.miniPick('a','12');S.miniPick('b','356');S.miniPick('final','356');assert.equal(S.stats().xp,120);
  assert.deepEqual(S.load().picks,{});assert.equal(S.load().entries.length,0);
});
test('Fan camp page reveals a score and loads earned progress after reopening',()=>{
  const m=mock(),ui=page('learn',m.wx);ui.onLoad({});ui.pick(event({id:C.practice[0].game.teams[0].id}));
  assert.equal(ui.data.progress.xp,10);assert.ok(ui.data.practice.answer);assert.equal(ui.data.notice,'+10 practice XP');
  const reopened=page('learn',m.wx);reopened.onLoad({});assert.equal(reopened.data.progress.xp,10);assert.ok(reopened.data.practice.answer);
  reopened.next();assert.equal(reopened.data.index,1);
});
test('local entries require 63 valid picks and a name, update once, and survive next fan',()=>{
  const m=mock();assert.equal(S.submit('Fan'),false);S.autoFill('cn','W2');assert.equal(S.submit('  '),false);
  assert.equal(S.submit('Fan One'),true);assert.equal(S.submit('Fan One Updated'),true);assert.equal(S.load().entries.length,1);
  const ui=page('bracket',m.wx);ui.onShow();assert.equal(ui.data.dirty,false);
  const g=L.GAMES.find(g=>g.srcT&&g.srcT.includes('W2'));ui.pick(event({game:g.id,id:g.srcT.find(id=>id!=='W2')}));
  assert.equal(ui.data.dirty,true);assert.equal(S.load().entries[0].picks['F6-0'],'W2');
  ui.nextFan();assert.equal(S.load().entries.length,1);assert.equal(L.countPicks(S.load().picks),0);
  S.autoFill('cn','W2');S.submit('Fan Two');const board=page('standings',m.wx);board.onShow();assert.equal(board.data.count,2);assert.equal(board.data.rows[0].rank,1);assert.equal(board.data.rows[1].rank,1);
});
test('demo results lock native picks, score entries and reset without losing progress',()=>{
  const m=mock();S.autoFill('cn','W2');S.submit('Fan');S.practicePick(0,C.practice[0].game.teams[0].id);
  const ui=page('standings',m.wx);ui.onShow();ui.simulate();assert.equal(ui.data.decided,32);
  const before=JSON.stringify(S.load().picks);S.pick('E1-0',L.G['E1-0'].srcT[0]);assert.equal(JSON.stringify(S.load().picks),before);
  for(let i=0;i<5;i++)ui.simulate();assert.equal(ui.data.decided,63);assert.equal(ui.data.finished,true);assert.equal(ui.data.rows[0].points,L.score(S.load().entries[0].picks,S.load().results));
  ui.reset();assert.equal(ui.data.decided,0);assert.equal(S.load().entries.length,1);assert.equal(S.stats().xp,10);
});
test('all four geographic labels fall inside their clickable native map region',()=>{
  for(const id of Object.keys(Map.labels)){const p=Map.labels[id];assert.equal(Map.regionAt(p[0],p[1]),id);assert.equal(Map.regionAt(p[0],p[1]+23),id);}
  assert.equal(Map.regionAt(500,350),null);assert.equal(Map.regionAt(100,308),'west');
  const m=mock(),ui=page('explore',m.wx);ui.onLoad();assert.equal(ui.data.schools.length,7);
  assert.equal(ui.data.selected.color,'#E0252B');ui.data.roots.forEach(r=>assert.match(r.color,/^#[0-9A-F]{6}$/i));
  ui.meaning(event({value:'tournament'}));assert.equal(ui.data.schools.length,16);
});
test('archives expose all 63 games per year and champion paths have six actual wins',()=>{
  const m=mock(),ui=page('archive',m.wx);for(const year of [2026,2025,2024,2023]){ui.onLoad({year});assert.equal(ui.data.games.length,6);assert.equal(C.archive[year].games.length,63);}
  ui.onLoad({year:2026});assert.equal(ui.data.champion.name,'Michigan');ui.mode(event({value:'full'}));assert.equal(ui.data.games.length,8);
});
test('player champion flow uses the existing Chinese-player rule and eleven clip pages load',()=>{
  const m=mock(),ui=page('profile',m.wx);ui.onLoad({id:'W2',type:'player'});ui.champion();assert.equal(S.load().picks['F6-0'],'W2');assert.equal(m.navigations[0],'/pages/bracket/index');
  const clip=page('clip',m.wx);C.moments.forEach(moment=>{clip.onLoad({id:moment.id});assert.equal(clip.data.moment.id,moment.id);assert.equal(clip.data.playing,false);assert.equal(clip.data.videoUrl,'');});
});
test('native video creates playback only on Play and stops when leaving or changing clips',()=>{
  const m=mock();let stopped=0;m.wx.createVideoContext=()=>({stop(){stopped++;}});
  const clip=page('clip',m.wx,{'../../utils/videos':{michigan:{url:'https://media.example.com/licensed.mp4'}}});
  clip.onLoad({id:'michigan'});assert.equal(clip.data.playing,false);assert.ok(clip.data.videoUrl.startsWith('https://'));
  clip.play();assert.equal(clip.data.playing,true);clip.onHide();assert.equal(stopped,1);assert.equal(clip.data.playing,false);
  clip.play();clip.next();assert.equal(stopped,2);assert.equal(clip.data.index,1);assert.equal(clip.data.playing,false);
  const invalid=page('clip',m.wx,{'../../utils/videos':{michigan:{url:'http://media.example.com/clip.mp4'}}});invalid.onLoad({id:'michigan'});invalid.play();assert.equal(invalid.data.playing,false);
});
test('all native templates are well formed and event bindings resolve to page handlers',()=>{
  const {execFileSync}=require('node:child_process');
  execFileSync('python3',[path.resolve(__dirname,'../scripts/preview.py'),'--check']);
  const m=mock();
  for(const dir of fs.readdirSync(path.join(root,'pages'))){
    const ui=page(dir,m.wx),source=fs.readFileSync(path.join(root,'pages',dir,'index.wxml'),'utf8');
    for(const match of source.matchAll(/\b(?:bind|catch)(?:tap|input|change|error|touchstart)="([^"]+)"/g))assert.equal(typeof ui[match[1]],'function',dir+': missing '+match[1]);
    for(const match of source.matchAll(/{{([\s\S]*?)}}/g))new Function('return ('+match[1].replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>')+');');
  }
});
test('configured native pages, local assets and tab icons fit a conservative 2 MB package',()=>{
  const app=JSON.parse(fs.readFileSync(path.join(root,'app.json'),'utf8'));
  let bytes=0;function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,e.name);if(e.isDirectory())walk(file);else bytes+=fs.statSync(file).size;}}walk(root);
  assert.ok(bytes<2000000,'Package size '+bytes+' exceeds 2,000,000 bytes');
  for(const p of app.pages)for(const ext of ['js','json','wxml','wxss'])assert.ok(fs.existsSync(path.join(root,p+'.'+ext)),p+'.'+ext);
  assert.equal(app.tabBar.list.length,5);for(const tab of app.tabBar.list){assert.ok(fs.existsSync(path.join(root,tab.iconPath)));assert.ok(fs.existsSync(path.join(root,tab.selectedIconPath)));}
  for(const id of Object.keys(L.TEAMS))assert.ok(fs.existsSync(path.join(root,'assets/teams/'+id+'.png')));
  for(const moment of C.moments)assert.ok(fs.existsSync(path.join(root,moment.poster)));
});
