import fs from 'node:fs';
const account=process.env.CLOUDFLARE_ACCOUNT_ID,token=process.env.CLOUDFLARE_API_TOKEN;
if(!account||!token)throw new Error('Cloudflare account ID and API token are required in GitHub Actions secrets.');
if(!process.env.OPENAI_API_KEY)throw new Error('OPENAI_API_KEY is required to deploy the AI-enabled service.');
const base=`https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(account)}`;
async function call(path,options={}){const response=await fetch(base+path,{...options,headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},signal:AbortSignal.timeout(30000)});const data=await response.json();if(!response.ok||!data.success)throw new Error(`Cloudflare request failed (${response.status}, ${path.split('?')[0]}). Check account and token permissions.`);return data;}
const databaseName='thursday-bible-reading';let database;
for(let page=1;page<=100;page++){const result=await call(`/d1/database?name=${databaseName}&per_page=100&page=${page}`);database=result.result.find(db=>db.name===databaseName);if(database||result.result.length<100)break;}
if(!database)database=(await call('/d1/database',{method:'POST',body:JSON.stringify({name:databaseName})})).result;
const subdomain=(await call('/workers/subdomain')).result.subdomain;
if(!subdomain)throw new Error('Enable a workers.dev subdomain in the Cloudflare dashboard before deploying.');
fs.mkdirSync('.cloudflare',{recursive:true});
fs.writeFileSync('.cloudflare/wrangler.json',JSON.stringify({name:'thursday-bible-reading-api',main:'../server/worker.ts',compatibility_date:'2026-09-20',workers_dev:true,d1_databases:[{binding:'DB',database_name:databaseName,database_id:database.uuid,migrations_dir:'../drizzle'}],vars:{ALLOWED_ORIGIN:'https://wizardjustin25-lgtm.github.io',OPENAI_MODEL:'gpt-4.1-mini'},triggers:{crons:['0 * * * *']}},null,2));
const url=`https://thursday-bible-reading-api.${subdomain}.workers.dev`;
fs.writeFileSync('.cloudflare/endpoint.json',JSON.stringify({url}));
console.log('Database and Worker configuration prepared.');
if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,`\nAPI endpoint (available after successful deploy): ${url}\n`);
