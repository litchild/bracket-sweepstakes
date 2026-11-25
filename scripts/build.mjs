import {cpSync,mkdirSync,writeFileSync} from 'node:fs';
const target='dist';
mkdirSync(target,{recursive:true});
for(const asset of ['index.html','404.html','css','fonts','images','js','organizer','concepts']) cpSync(asset,target+'/'+asset,{recursive:true,filter:path=>!path.startsWith('images/brand')});
mkdirSync(target+'/admin/history',{recursive:true});
cpSync('admin',target+'/admin/history',{recursive:true});
const store=process.env.CONTEXT==='production'?'friends-dec-2026':'friends-preview-'+(process.env.REVIEW_ID || process.env.DEPLOY_ID || 'local');
writeFileSync('server/deploy-store.json',JSON.stringify(store));
