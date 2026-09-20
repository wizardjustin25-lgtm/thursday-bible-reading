import type {QuestionEnv} from './question-service';
type Env=QuestionEnv&{ADMIN_PASSWORD_HASH?:string;ADMIN_SESSION_SECRET?:string};
const json=(body:unknown,status=200)=>Response.json(body,{status});
const hex=(bytes:ArrayBuffer)=>Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('');
async function sign(value:string,secret:string){const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);return hex(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(value)));}
export async function adminApi(request:Request,env:Env){
 if(!env.ADMIN_PASSWORD_HASH||!env.ADMIN_SESSION_SECRET)return json({error:'관리자 설정을 준비 중입니다.'},503);
 const path=new URL(request.url).pathname;
 if(path==='/api/admin/login'&&request.method==='POST'){
  const bucket=Math.floor(Date.now()/600000),ip=request.headers.get('cf-connecting-ip')||'unknown';
  const key=`login:${bucket}:${await sign(ip,env.ADMIN_SESSION_SECRET)}`;
  const rows=await env.DB.batch([env.DB.prepare('INSERT OR IGNORE INTO request_limits (key,hits,expires_at) VALUES (?,0,?)').bind(key,(bucket+1)*600000),env.DB.prepare('UPDATE request_limits SET hits=hits+1 WHERE key=? AND hits<10 RETURNING hits').bind(key)]);
  if(!rows[1].results.length)return json({error:'로그인 시도가 많습니다. 10분 후 다시 시도해주세요.'},429);
  const data=await request.json() as {password?:unknown};
  if(typeof data.password!=='string'||data.password.length>200)return json({error:'비밀번호를 확인해주세요.'},401);
  const digest=hex(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(data.password)));
  if(digest!==env.ADMIN_PASSWORD_HASH)return json({error:'비밀번호를 확인해주세요.'},401);
  const value=`${Date.now()+3600000}.${crypto.randomUUID()}`;
  return json({token:`${value}.${await sign(value,env.ADMIN_SESSION_SECRET)}`});
 }
 const token=request.headers.get('Authorization')?.replace(/^Bearer /,'')||'';
 const [expires,nonce,signature,...extra]=token.split('.');
 if(extra.length||!expires||!nonce||Number(expires)<Date.now()||!Number.isFinite(Number(expires))||signature!==await sign(`${expires}.${nonce}`,env.ADMIN_SESSION_SECRET))return json({error:'관리자 로그인이 필요합니다.'},401);
 const id=path.match(/^\/api\/admin\/questions\/([0-9a-f-]{36})$/i)?.[1];
 if(!id)return json({error:'요청을 확인해주세요.'},404);
 if(request.method==='DELETE'){
  const result=await env.DB.prepare('UPDATE questions SET deleted_at=? WHERE id=? AND deleted_at IS NULL').bind(Date.now(),id).run();
  return result.meta.changes?json({ok:true}):json({error:'질문을 찾을 수 없습니다.'},404);
 }
 if(request.method==='PATCH'){
  const data=await request.json() as Record<string,unknown>;
  const passage=typeof data.passage==='string'?data.passage.trim():'',content=typeof data.content==='string'?data.content.trim():'',name=typeof data.name==='string'?data.name.trim()||'익명':'익명';
  if(!passage||passage.length>80||content.length<5||content.length>2000||name.length>30)return json({error:'본문과 질문 길이를 확인해주세요.'},400);
  const result=await env.DB.prepare("UPDATE questions SET passage=?,content=?,name=?,summary=NULL,summary_status='unavailable' WHERE id=? AND deleted_at IS NULL").bind(passage,content,name,id).run();
  return result.meta.changes?json({ok:true}):json({error:'질문을 찾을 수 없습니다.'},404);
 }
 return json({error:'지원하지 않는 요청입니다.'},405);
}
