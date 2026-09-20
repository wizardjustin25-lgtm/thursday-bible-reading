import fs from 'node:fs/promises';

// Unmodified Pretendard v1.3.9, redistributed with its SIL OFL 1.1 notice.
const base='https://raw.githubusercontent.com/orioncactus/pretendard/v1.3.9';
await fs.mkdir('public/fonts',{recursive:true});
for(const [name,path] of [
 ['PretendardVariable.woff2','packages/pretendard/dist/web/variable/woff2/PretendardVariable.woff2'],
 ['LICENSE.txt','LICENSE'],
]){
 const target=`public/fonts/${name}`;
 try{await fs.access(target);continue;}catch{}
 const response=await fetch(`${base}/${path}`,{signal:AbortSignal.timeout(60000)});
 if(!response.ok)throw new Error(`Pretendard download failed: ${response.status}`);
 const bytes=Buffer.from(await response.arrayBuffer());
 if(name.endsWith('.woff2')&&bytes.toString('ascii',0,4)!=='wOF2')throw new Error('Invalid font file');
 if(name==='LICENSE.txt'&&!bytes.toString().includes('SIL OPEN FONT LICENSE'))throw new Error('Missing font license');
 await fs.writeFile(target,bytes);
}
