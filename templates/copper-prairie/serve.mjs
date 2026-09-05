import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import config from './site.config.mjs';
const root=path.resolve('dist');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.webp':'image/webp','.svg':'image/svg+xml','.txt':'text/plain','.xml':'application/xml'};
const server=http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost');let name=decodeURIComponent(url.pathname);
  if(name.startsWith(config.base))name='/'+name.slice(config.base.length);
  let file=path.resolve(root,'.'+name);if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403);res.end();return;}
  let stat=await fs.stat(file);if(stat.isDirectory()){
   if(!name.endsWith('/')){res.writeHead(302,{Location:name+'/'+url.search});res.end();return;}
   file=path.join(file,'index.html');
  }
  const body=await fs.readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY'});res.end(req.method==='HEAD'?undefined:body);
 }catch{res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(await fs.readFile(path.join(root,'404.html')).catch(()=> 'Not found'));}
});
server.listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'+config.base));
