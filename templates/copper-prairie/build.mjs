import fs from 'node:fs/promises';
import path from 'node:path';
import config from './site.config.mjs';
import {createTemplates,esc} from './src/templates.mjs';
if(!config.base.startsWith('/')||!config.base.endsWith('/')||config.base.includes('..'))throw new Error('SITE_BASE must be an absolute URL path with a trailing slash');
const origin=new URL(config.origin);if(!['https:','http:'].includes(origin.protocol))throw new Error('Invalid SITE_ORIGIN');
await fs.mkdir('dist/assets',{recursive:true});
const pages=createTemplates(config);
for(const page of pages){
  const file=path.join('dist',page.path.endsWith('.html')?page.path:page.path+'index.html');
  await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,page.html);
}
await fs.copyFile('src/style.css','dist/assets/style.css');
await fs.copyFile('src/app.js','dist/assets/app.js');
for(const file of await fs.readdir('public'))await fs.cp(path.join('public',file),path.join('dist',file),{recursive:true});
const urls=pages.filter(p=>p.path!=='404.html').map(p=>`<url><loc>${esc(config.origin+config.base+p.path)}</loc></url>`).join('\n');
await fs.writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`);
await fs.writeFile('dist/robots.txt',config.demo?'User-agent: *\nDisallow: /\n':`User-agent: *\nAllow: /\nSitemap: ${config.origin+config.base}sitemap.xml\n`);
await fs.writeFile('dist/.nojekyll','');
await fs.writeFile('dist/_headers','/*\n  X-Content-Type-Options: nosniff\n  X-Frame-Options: DENY\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n');
console.log(`Built ${pages.length} static pages at ${config.base}. Demo mode: ${config.demo}.`);
