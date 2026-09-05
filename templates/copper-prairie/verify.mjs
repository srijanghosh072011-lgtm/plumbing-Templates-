import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import config from './site.config.mjs';
import {createTemplates} from './src/templates.mjs';
const pages=createTemplates(config);let checked=0;
for(const page of pages){
 const filename=path.join('dist',page.path.endsWith('.html')?page.path:page.path+'index.html');
 const html=await fs.readFile(filename,'utf8');assert.equal((html.match(/<h1[ >]/g)||[]).length,1,filename+' requires one h1');
 assert(html.includes('name="description"'),filename+' missing description');
 if(config.demo)assert(html.includes('noindex, nofollow'),filename+' preview indexing');
 for(const match of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g))JSON.parse(match[1]);
 for(const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)){
  const raw=match[1];if(!raw.startsWith('/'))continue;
  assert(raw.startsWith(config.base),'Incorrect deployment prefix: '+raw);
  const relative=raw.slice(config.base.length).split(/[?#]/)[0];
  let target=path.join('dist',relative);if(!path.extname(target))target=path.join(target,'index.html');
  await fs.access(target).catch(()=>{throw new Error(`Broken local link ${raw} in ${filename}`)});checked++;
 }
}
const client=await fs.readFile('src/app.js','utf8');assert(!/innerHTML|eval\(|localStorage|sessionStorage|fetch\(/.test(client),'Unexpected client data sink');
console.log(`Verified ${pages.length} pages, ${checked} local links/assets, metadata, JSON-LD, and demo indexing.`);
