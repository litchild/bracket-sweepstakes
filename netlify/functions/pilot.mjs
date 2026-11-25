import {getStore} from '@netlify/blobs';
import {handle} from '../../server/pilot.mjs';
import namespace from '../../server/deploy-store.json' with {type:'json'};
export default function(req) {
  return handle(req,getStore({name:namespace,consistency:'strong'}));
}
export const config = {path:'/api/pilot'};
