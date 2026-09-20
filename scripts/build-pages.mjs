import './prepare-fonts.mjs';
import fs from 'node:fs';
import ts from 'typescript';
import { build } from 'rolldown';

// The GitHub Pages preview uses the same components as the server-backed app.
fs.mkdirSync('.preview-build', { recursive: true });
fs.mkdirSync('site-preview', { recursive: true });
const source = fs.readFileSync('app/page.tsx', 'utf8');
fs.writeFileSync('.preview-build/page.jsx', ts.transpileModule(source, {
  compilerOptions: { jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
}).outputText);
fs.writeFileSync('.preview-build/entry.jsx', `import React from 'react';import {createRoot} from 'react-dom/client';import Home from './page.jsx';createRoot(document.getElementById('root')).render(<Home/>);`);
await build({ input: './.preview-build/entry.jsx', platform: 'browser', output: { file: '.preview-build/site.js', format: 'iife', minify: true } });
const css = fs.readFileSync('app/globals.css', 'utf8').replace('@import "tailwindcss";', '');
const js = fs.readFileSync('.preview-build/site.js', 'utf8');
const apiBase=(process.env.API_BASE_URL||'').trim().replace(/\/$/,'');
if(apiBase){const url=new URL(apiBase);if(url.protocol!=='https:'||url.pathname!=='/'||url.search||url.hash||url.username||url.password)throw new Error('API_BASE_URL must be an HTTPS origin');}
const adapter=apiBase?`window.BIBLE_API_BASE=${JSON.stringify(apiBase).replace(/</g,'\\u003c')};`:`window.BIBLE_DEMO=true;const originalFetch=window.fetch.bind(window);window.fetch=(url,options)=>url==='/api/questions'?Promise.resolve(new Response(JSON.stringify(options?.method==='POST'?{error:'현재는 공개 미리보기입니다. 질문 저장과 AI 자동 요약은 정식 서비스 연결 후 이용할 수 있습니다.'}:{questions:[],demo:true,aiEnabled:false}),{status:options?.method==='POST'?503:200,headers:{'Content-Type':'application/json'}})):originalFetch(url,options);`;
const banner=apiBase?'':'<div style="padding:10px 20px;background:#F1E8D7;color:#6F2228;font-size:14px;text-align:center">공개 미리보기 · 질문 저장과 AI 자동 요약은 아직 연결되지 않았습니다.</div>';
fs.writeFileSync('site-preview/index.html', `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="여의도침례교회 목요성경통독 게시판과 2026년 신약 통독 일정"><title>여의도침례교회 목요성경통독</title><link rel="icon" href="./favicon.svg"><style>${css}</style></head><body>${banner}<div id="root"></div><script>${adapter}${js.replace(/<\/script/gi, '<\\/script')}</script></body></html>`);
fs.cpSync('public/fonts','site-preview/fonts',{recursive:true});
fs.copyFileSync('public/favicon.svg', 'site-preview/favicon.svg');
fs.copyFileSync('public/church-mark.png', 'site-preview/church-mark.png');
fs.writeFileSync('site-preview/.nojekyll', '');
console.log('GitHub Pages preview built in site-preview/');
