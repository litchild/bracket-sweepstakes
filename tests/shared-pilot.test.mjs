import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {handle,closesAt,standings} from '../server/pilot.mjs';
import logic from '../js/logic.js';

function memoryStore(){
 const data=new Map();
 const put=(key,v,o={})=>{
   const old=data.get(key);
   if((o.onlyIfNew && old) || (o.onlyIfMatch && o.onlyIfMatch!==old?.etag))return {modified:false};
   data.set(key,{data:v,etag:String(Number(old?.etag||0)+1)});
   return {modified:true};
 };
 return {get:k=>data.get(k)?.data,getWithMetadata:k=>data.get(k),set:put,setJSON:put,list:({prefix})=>({blobs:[...data.keys()].filter(k=>k.startsWith(prefix)).map(key=>({key}))})};
}
test('private winners, server deadline, entry ownership, ranks, concurrency and event counts',async()=>{
 const db=memoryStore(), end=Date.parse(closesAt), alice='a'.repeat(64),bob='b'.repeat(64);
 const admin='private-test-key',digest=createHash('sha256').update(admin).digest('hex');
 async function call(action,key,body,now=end-1){
   const req=new Request('https://example.org/api/pilot?action='+action,{method:body?'POST':'GET',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});
   const r=await handle(req,db,now,digest);return {status:r.status,json:await r.json()};
 }
 const picks=logic.decode('0'.repeat(63)),other=logic.decode('1'.repeat(63));
 assert.equal((await call('admin',alice)).status,403);
 assert.equal((await call('entry',alice,{name:'A',picks:{}})).status,400);
 assert.equal((await call('entry',alice,{name:'A',picks})).status,200);
 assert.equal((await call('entry',alice,{name:'A2',picks})).status,200);
 assert.equal((await call('entry',bob,{name:'B',picks:other})).status,200);
 assert.equal((await call('results',admin,{mode:'save',version:0,picks})).status,200);
 assert.equal((await call('results',admin,{mode:'save',version:0,picks:other})).status,409);
 assert.equal((await call('results',admin,{mode:'publish',version:1,picks})).status,409);
 assert.equal((await call('entry',alice,{name:'A',picks:other},end)).status,409);
 const pre=(await call('board',bob)).json;
 assert.equal(pre.board.length,2);assert.equal(pre.mine.name,'B');assert.equal(pre.scored,0);assert.equal(pre.board[0].rank,null);
 assert.equal((await call('results',admin,{mode:'publish',version:1,picks},end)).status,200);
 const publicView=(await call('board','',undefined,end)).json;
 assert.deepEqual(Object.keys(publicView).sort(),['board','closed','closesAt','crowd','mine','scored'].sort());
 assert.equal(publicView.mine,null);assert.equal(publicView.board[0].correct,63);assert.equal(publicView.board[0].name,'A2');assert.equal(publicView.board[0].rank,1);
 assert.deepEqual(Object.keys(publicView.board[0]).sort(),['id','name','correct','rank'].sort());
 assert.equal((await call('results',admin,{mode:'save',version:2,picks:other},end)).status,409);
 for(let i=0;i<2;i++)await call('event',alice,{event:'visit',session:'abcdefghijklmnop'});
 const dash=(await call('admin',admin)).json;assert.equal(dash.stats.visit,1);assert.equal(dash.stats.session,1);assert.equal(dash.entries.length,2);
 assert.deepEqual(standings([{id:'a',picks},{id:'b',picks}],picks).map(r=>r.rank),[1,1]);
});
