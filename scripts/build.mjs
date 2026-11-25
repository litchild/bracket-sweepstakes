import {cpSync,mkdirSync,writeFileSync,readFileSync} from 'node:fs';
import vm from 'node:vm';
const target='dist';
mkdirSync(target,{recursive:true});
for(const asset of ['index.html','404.html','css','fonts','images','js','organizer','concepts']) cpSync(asset,target+'/'+asset,{recursive:true,filter:path=>!path.startsWith('images/brand')});
mkdirSync(target+'/admin/history',{recursive:true});
cpSync('admin',target+'/admin/history',{recursive:true});
const store=process.env.CONTEXT==='production'?'friends-dec-2026':'friends-preview-'+(process.env.REVIEW_ID || process.env.DEPLOY_ID || 'local');
writeFileSync('server/deploy-store.json',JSON.stringify(store));

// Serve Chinese in the first HTML response, including on slower mobile connections.
const copy=vm.runInNewContext(readFileSync('js/zh-dictionary.js','utf8')+'; ZH_COPY');
const lookup=value=>copy[value.trim().replaceAll('&amp;','&')] || value;
let page=readFileSync('index.html','utf8');
page=page.replace(/>([^<>]+)</g,(whole,text)=>'>'+lookup(text)+'<')
  .replace(/(aria-label|placeholder|alt)="([^"]+)"/g,(_,attr,value)=>attr+'="'+lookup(value)+'"')
  .replace(/(<meta name="description" content=")[^"]+/, '$1预测63场美国大学篮球比赛，和朋友争夺500元奖金，查看你的实时排名。');
writeFileSync(target+'/index.html',page);
