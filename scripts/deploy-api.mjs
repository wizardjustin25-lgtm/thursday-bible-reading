import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import {randomBytes} from 'node:crypto';
const file='.cloudflare/deploy-secrets.json';
try{
  fs.writeFileSync(file,JSON.stringify({OPENAI_API_KEY:process.env.OPENAI_API_KEY,RATE_LIMIT_SALT:process.env.RATE_LIMIT_SALT||randomBytes(32).toString('hex')}),{mode:0o600});
  const result=spawnSync(process.execPath,['node_modules/wrangler/bin/wrangler.js','deploy','--config','.cloudflare/wrangler.json','--secrets-file',file],{stdio:'inherit'});
  if(result.error)throw result.error;
  if(result.status!==0)throw new Error('Worker deployment failed');
}finally{fs.rmSync(file,{force:true});}
const {url}=JSON.parse(fs.readFileSync('.cloudflare/endpoint.json','utf8'));
const health=await fetch(`${url}/health`,{signal:AbortSignal.timeout(30000)});
const status=await health.json();
if(!health.ok||!status.configured||!status.aiEnabled)throw new Error('Worker health check did not confirm configuration');
const list=await fetch(`${url}/api/questions`,{signal:AbortSignal.timeout(30000)});
if(!list.ok)throw new Error('Database read check failed');
console.log('Worker and database read checks passed.');
if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,`\nServer deployed: ${url}\n\nSet repository variable API_BASE_URL to this URL, then run the Pages deployment.\n`);
