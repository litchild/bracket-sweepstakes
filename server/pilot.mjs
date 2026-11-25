import { createHash, timingSafeEqual } from 'node:crypto';
import bracket from '../js/logic.js';
import adminDigest from './admin-digest.json' with { type: 'json' };

const { GAMES, TEAMS, cands } = bracket;
export const closesAt = '2026-12-02T16:00:00.000Z';
const digest = value => createHash('sha256').update(value).digest('hex');
const fail = (status, code) => { throw Object.assign(new Error(code), { status }); };
const read = (db, key) => db.get(key, { type: 'json' });
const emptyResults = () => ({draft:{}, released:{}, version:0});

export function validPicks(picks, full) {
  if (!picks || typeof picks !== 'object' || Array.isArray(picks)) return false;
  const n = Object.keys(picks).length;
  const known = GAMES.filter(g => Object.hasOwn(picks,g.id));
  return known.length === n && (!full || n === 63) && known.every(g => {
    const teams = cands(g,picks);
    return teams.every(t => Object.hasOwn(TEAMS,t)) && teams.includes(picks[g.id]);
  });
}

async function entries(db) {
  const {blobs} = await db.list({prefix:'entries/'});
  const rows = [];
  for (let i=0;i<blobs.length;i+=25) {
    rows.push(...await Promise.all(blobs.slice(i,i+25).map(b=>read(db,b.key))));
  }
  return rows.filter(Boolean);
}

export function standings(rows, winners) {
  const games = Object.entries(winners);
  const board = rows.map(e => ({ id:e.id, name:e.name, correct:games.filter(([id,w])=>e.picks[id]===w).length }));
  board.sort((a,b)=>b.correct-a.correct || a.id.localeCompare(b.id));
  board.forEach((row,i)=>{row.rank=!games.length?null:i && row.correct===board[i-1].correct?board[i-1].rank:i+1;});
  return board;
}

export async function handle(req, db, now=Date.now(), organizerDigest=adminDigest) {
  const send = (payload,status=200)=>Response.json(payload,{status, headers:{'Cache-Control':'private, no-store','Vary':'Authorization','X-Content-Type-Options':'nosniff'}});
  try {
    const url=new URL(req.url), action=url.searchParams.get('action') || 'board';
    const token=(req.headers.get('authorization') || '').replace(/^Bearer /,'');
    const visitor=/^[0-9a-f]{64}$/.test(token)?digest(token):null;
    const closed=now>=Date.parse(closesAt);
    if (req.method==='POST' && (req.headers.get('origin') && req.headers.get('origin')!==url.origin)) fail(403,'origin');
    const admin=['admin','results'].includes(action);
    if (admin && !timingSafeEqual(Buffer.from(digest(token)),Buffer.from(organizerDigest))) fail(403,'access');
    if (req.method==='GET' && (action==='board'||action==='admin')) {
      const [rows, baseline]=await Promise.all([entries(db),read(db,'baseline')]);
      const state=baseline || emptyResults();
      if (admin) {
        const stats={};
        for(const type of ['visit','session','start','complete']) stats[type]=(await db.list({prefix:'metrics/'+type+'/'})).blobs.length;
        return send({stats, entries:rows, baseline:state, closesAt, closed});
      }
      const mine=rows.find(e=>e.id===visitor);
      const crowd={champions:{},roots:{},games:{}};
      for(const e of rows){
        const champ=e.picks['F6-0'];
        crowd.champions[champ]=(crowd.champions[champ]||0)+1;
        crowd.roots[e.root]=(crowd.roots[e.root]||0)+1;
        for(const [g,t] of Object.entries(e.picks)){
          const counts=crowd.games[g] ||= {};
          counts[t]=(counts[t]||0)+1;
        }
      }
      return send({closed,closesAt,scored:Object.keys(state.released).length,board:standings(rows,state.released),mine:mine||null,crowd});
    }
    if(req.method!=='POST') fail(405,'method');
    if(!req.headers.get('content-type')?.includes('application/json')) fail(415,'format');
    const raw=await req.text();
    if(raw.length>8192) fail(413,'size');
    let body; try { body=JSON.parse(raw); } catch { fail(400,'format'); }
    if(!body || typeof body!=='object') fail(400,'format');
    if(action==='results'){
      if(!validPicks(body.picks,false) || !['save','publish'].includes(body.mode)) fail(400,'picks');
      if(body.mode==='publish' && !closed) fail(409,'early');
      const record=await db.getWithMetadata('baseline',{type:'json'});
      const state=record?.data || emptyResults();
      if(body.version!==state.version) fail(409,'stale');
      if(Object.entries(state.released).some(([g,t])=>body.picks[g]!==t)) fail(409,'released');
      const next={draft:body.picks,released:body.mode==='publish'?body.picks:state.released,version:state.version+1};
      const saved=await db.setJSON('baseline',next,record?{onlyIfMatch:record.etag}:{onlyIfNew:true});
      if(!saved.modified) fail(409,'stale');
      return send(next);
    }
    if(!visitor) fail(401,'identity');
    if(action==='event'){
      if(!['visit','start','complete'].includes(body.event)) fail(400,'event');
      if(body.event==='visit'){
        if(!/^[a-z0-9-]{16,64}$/.test(body.session||'')) fail(400,'session');
        await db.set('metrics/session/'+digest(visitor+body.session),'1',{onlyIfNew:true});
      }
      await db.set('metrics/'+body.event+'/'+visitor,'1',{onlyIfNew:true});
      return send({ok:true});
    }
    if(action!=='entry') fail(404,'missing');
    if(closed) fail(409,'closed');
    if(!validPicks(body.picks,true)) fail(400,'picks');
    const name=typeof body.name==='string'?body.name.trim():'';
    if(!name || [...name].length>32 || /[\u0000-\u001f\u007f]/u.test(name)) fail(400,'name');
    const row={id:visitor,name,picks:body.picks,root:['star','cn'].includes(body.root)?body.root:'manual',updatedAt:new Date(now).toISOString()};
    await db.setJSON('entries/'+visitor,row);
    return send({entry:row});
  } catch(e) {
    if(!e.status) console.error('Pilot storage request failed',e.name);
    return send({error:e.status?e.message:'storage'},e.status||503);
  }
}
