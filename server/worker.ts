import {questionsApi,cleanup,type QuestionEnv} from "./question-service";
export default {
  async fetch(request:Request,env:QuestionEnv,ctx:ExecutionContext){
    const origin=request.headers.get("origin"),allowed=env.ALLOWED_ORIGIN||"https://wizardjustin25-lgtm.github.io";
    const headers=new Headers({"Cache-Control":"no-store","Vary":"Origin","X-Content-Type-Options":"nosniff"});
    if(origin===allowed){headers.set("Access-Control-Allow-Origin",allowed);headers.set("Access-Control-Allow-Methods","GET, POST, OPTIONS");headers.set("Access-Control-Allow-Headers","Content-Type");headers.set("Access-Control-Max-Age","3600");}
    if(origin&&origin!==allowed)return new Response("Forbidden",{status:403,headers});
    const path=new URL(request.url).pathname;
    if(path!=="/api/questions"&&path!=="/health")return new Response("Not found",{status:404,headers});
    if(request.method==="OPTIONS")return new Response(null,{status:204,headers});
    if(path==="/health")return Response.json({service:"thursday-bible-reading",configured:Boolean(env.DB&&env.RATE_LIMIT_SALT),aiEnabled:Boolean(env.OPENAI_API_KEY)},{headers});
    const response=await questionsApi(request,{...env,ALLOWED_ORIGIN:allowed},ctx);
    response.headers.forEach((value,key)=>headers.set(key,value));
    return new Response(response.body,{status:response.status,headers});
  },
  async scheduled(_event:ScheduledController,env:QuestionEnv,ctx:ExecutionContext){ctx.waitUntil(cleanup(env));},
};
