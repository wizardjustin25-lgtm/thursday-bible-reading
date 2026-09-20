import {env} from 'cloudflare:workers';
import {questionsApi} from '../../../server/question-service';
async function handle(request:Request){
  if(!env.DB)return Response.json({error:'질문 저장 서버를 준비 중입니다.'},{status:503});
  return questionsApi(request,{...env,DB:env.DB});
}
export const GET=handle;
export const POST=handle;
