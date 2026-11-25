// Translate display text only. IDs, team keys, submitted nicknames and stored picks stay stable.
const languageLinks=document.querySelectorAll('.lang-switch a');
let useChinese=new URLSearchParams(location.search).get('lang')!=='en';
const originals=new WeakMap();
const initialEnglish = Object.fromEntries(Object.entries(ZH_COPY).map(([en,zh])=>[zh,en]));
const attributes=['aria-label','aria-valuetext','placeholder','title','alt'];
const formats=[
  [/^(\d+) of 63 (?:games )?picked$/, '已选 $1 / 63 场'],
  [/^(\d+) of 3 picked · Choose your champion\.$/,'已选 $1 / 3 场，选出你的冠军。'],
  [/^Pick (\d+) winners?\.$/,'还需选出 $1 支胜队。'],
  [/^Game (\d+) of (\d+)$/,'第 $1 场，共 $2 场'],
  [/^(.+): pick every game\. Winners move right\.$/,'$1：点选胜队，胜者将进入右侧下一轮。'],
  [/^Next round: (.+)$/,'下一轮：$1'],[/^Next: (.+) bracket$/,'下一区：$1'],
  [/^Your rank: #(\d+) · (.+)$/,'我的排名：第 $1 名 · $2'],
  [/^brackets? entered$/,'份已提交'],[/^Pick (.+), seed (\d+)$/,'选择$1（$2号种子）'],
  [/^(.+), (\d+) seed$/,'$1，$2号种子'],[/^About (.+)$/,'查看$1资料'],
  [/^(.+) is your champion$/,'我的冠军：$1'],[/^(.+?)’s school wins every game\. Edit any pick below\.$/,'$1的母校将夺冠，可逐场修改。'],
  [/^(.+): make (.+) your champion$/,'选择$1的母校$2夺冠'],[/^(.+)’s games →$/,'查看$1的比赛 →'],
  [/^Go to (.+)’s games$/,'查看$1的比赛'],[/^View (.+) profile$/,'查看$1的资料'],
  [/^More from (.+)$/,'更多$1校友'],[/^Explore (.+) and (.+)$/,'了解$1与$2'],
  [/^(.+) alumnus$/,'$1校友'],[/^Follow (.+)’s college team$/,'关注$1校队'],
  [/^(\d+) · Round (\d+) · Pick (\d+)$/,'$1年 · 第$2轮 · 第$3顺位'],
  [/^NBA: (.+) · (\d+) draft, No. (\d+)$/,'NBA：$1 · $2年第$3顺位'],
  [/^NBA: (.+)$/,'NBA：$1'],[/^(.+) NBA players from (.+) schools in this bracket\. Best-known names first\.$/,'本届$2所大学共收录$1位NBA校友。'],
  [/^NBA teams checked .+\. A snapshot, not a live roster feed\.$/,'NBA球队资料更新于2026年11月25日。'],
  [/^NBA status checked .+$/,'NBA资料核对于2026年11月25日'],
  [/^Showing (\d+) of (\d+) players?$/,'已显示 $1 / $2 名球员'],[/^Show (\d+) more players$/,'再显示$1名球员'],
  [/^Browse all (.+) connections$/,'查看$1的所有球员'],[/^(\d+) featured NBA alumni$/,'$1名NBA校友'],
  [/^#?(\d+) seed$/,'$1号种子'],[/^#?(\d+) seed · (.+?) (?:bracket|tournament group)$/,'$2 · $1号种子'],
  [/^2026 tournament field · Seed (\d+) · (.+) bracket$/,'2026年参赛球队 · $2 · $1号种子'],
  [/^(\d+) seed · (.+)$/,'$2 · $1号种子'],[/^No\. (\d+) pick$/,'第$1顺位'],
  [/^Out in the (.+)$/,'止步$1'],[/^(\d+) national champion$/,'$1年全国冠军'],
  [/^([\d–-]+) over (.+)$/,'$1 击败$2'],[/^(\d+) first-round picks came from the champion, (.+)\.$/,'冠军球队$2有$1人入选首轮。'],
  [/^Pick (.+) as champion$/,'选择$1夺冠'],[/^Pick (.+) to win it all$/,'选择$1夺冠'],
  [/^Player: (.+)$/,'球员：$1'],[/^(\d+) \/ 6 tried$/,'已练习 $1 / 6 场'],
  [/^(\d+) \/ 10 challenges complete$/,'已完成 $1 / 10 项'],[/^Question (\d+)(.*)$/,'第$1题$2'],
  [/^Game (\d+) \/ 6 · (\d+) · (.+)$/,'第$1场（共6场）· $2年 · $3'],
  [/^(\d+) practice XP · (.+)$/,'$1点练习经验 · $2'],[/^(\d+) (.+)$/,'$1 $2'],
  [/^NBA alumni face-off: (.+) vs\. (.+)$/,'NBA校友对比：$1 对 $2']
];
function chinese(text,depth=0){
  if(Object.hasOwn(ZH_COPY,text))return ZH_COPY[text];
  if(depth>3)return text;
  for(const [pattern,format] of formats){
    const match=text.match(pattern);
    if(match)return format.replace(/\$(\d+)/g,(_,n)=>chinese(match[Number(n)],depth+1));
  }
  if(text.includes(' · '))return text.split(' · ').map(t=>chinese(t,depth+1)).join(' · ');
  return text;
}
function translateValue(node,field,current,set){
  if(!current?.trim())return;
  let record=originals.get(node);
  if(!record){record={};originals.set(node,record);}
  const old=record[field];
  const source=old && current===old.display ? old.source : (initialEnglish[current.trim()] ? current.replace(current.trim(),initialEnglish[current.trim()]) : current);
  const display=useChinese?source.replace(/\S(?:[\s\S]*\S)?/,s=>chinese(s)):source;
  record[field]={source,display};if(display!==current)set(display);
}
function translateNode(node){
  if(node.nodeType===3){
    if(node.parentElement && !node.parentElement.closest('script,style,[translate=no]'))
      translateValue(node,'text',node.data,v=>node.data=v);
    return;
  }
  if(node.nodeType!==1 || node.matches('script,style,[translate=no]'))return;
  attributes.forEach(a=>translateValue(node,a,node.getAttribute(a),v=>node.setAttribute(a,v)));
  node.childNodes.forEach(translateNode);
}
function syncLanguage(){
  document.documentElement.lang=useChinese?'zh-CN':'en-US';
  languageLinks.forEach(a=>a.setAttribute('aria-current',(a.lang==='zh-CN')===useChinese?'true':'false'));
  translateNode(document.documentElement);
  const hand=document.querySelector('.court-art img');
  if(hand)hand.src=useChinese?'images/your-turn-zh.svg':'images/your-turn.svg';
}
languageLinks.forEach(a=>a.addEventListener('click',e=>{
  e.preventDefault();useChinese=a.lang==='zh-CN';history.replaceState(null,'',a.href);syncLanguage();
}));
syncLanguage();
new MutationObserver(records=>{
  for(const r of records){
    if(r.type==='childList')r.addedNodes.forEach(translateNode);
    else if(r.type==='attributes')translateValue(r.target,r.attributeName,r.target.getAttribute(r.attributeName),v=>r.target.setAttribute(r.attributeName,v));
    else translateNode(r.target);
  }
}).observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:attributes});
