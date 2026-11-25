import {getStore} from '@netlify/blobs';
import {createHash} from 'node:crypto';
import {handle} from '../../server/pilot.mjs';
import namespace from '../../server/deploy-store.json' with {type:'json'};
export default function(req) {
  const password=globalThis.Netlify?.env.get('PILOT_ADMIN_TOKEN');
  const hash=password?createHash('sha256').update(password).digest('hex'):undefined;
  return handle(req,getStore({name:namespace,consistency:'strong'}),Date.now(),hash);
}
export const config = {path:'/api/pilot'};
