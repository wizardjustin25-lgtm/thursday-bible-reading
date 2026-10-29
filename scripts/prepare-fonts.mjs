import fs from 'node:fs/promises';

// Official, unmodified Paperlogy web fonts with the author's SIL OFL notice.
const base='https://raw.githubusercontent.com/Freesentation/paperlogy/8ef35f53b318c7ca914c52b1b382b9a8bad07a61';
const styles=["1Thin","2ExtraLight","3Light","4Regular","5Medium","6SemiBold","7Bold","8ExtraBold","9Black"];
await fs.mkdir('public/fonts',{recursive:true});
for(const [name,path] of [
 ...styles.map(style=>[`Paperlogy-${style}.woff2`,`woff2/Paperlogy-${style}.woff2`]),
 ['Paperlogy-LICENSE.txt','OFL%20license.txt'],
]){
 const target=`public/fonts/${name}`;
 try{await fs.access(target);continue;}catch{}
 const response=await fetch(`${base}/${path}`,{signal:AbortSignal.timeout(60000)});
 if(!response.ok)throw new Error(`Paperlogy download failed: ${response.status}`);
 const bytes=Buffer.from(await response.arrayBuffer());
 if(name.endsWith('.woff2')&&bytes.toString('ascii',0,4)!=='wOF2')throw new Error('Invalid font file');
 if(name.endsWith('LICENSE.txt')&&!bytes.toString().includes('SIL OPEN FONT LICENSE'))throw new Error('Missing font license');
 await fs.writeFile(target,bytes);
}
