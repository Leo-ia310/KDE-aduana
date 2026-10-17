import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {Readable} from 'node:stream';
import {handleChat} from './worker/index.mjs';
const port=Number(process.env.PORT||4173);
const root=path.resolve(import.meta.dirname,'dist');
const assets=new Set(['index.html','styles.css','app.js','chat.js','chat.css','assets/logo.jpg','assets/port.jpg']);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.jpg':'image/jpeg'};
http.createServer(async(req,res)=>{
  try{
    const base=`http://127.0.0.1:${port}`,url=new URL(req.url,base);
    if(url.pathname==='/api/chat'){
      const request=new Request(url,{method:req.method,headers:req.headers,...(!['GET','HEAD'].includes(req.method)?{body:Readable.toWeb(req),duplex:'half'}:{})});
      const response=await handleChat(request,process.env);res.writeHead(response.status,Object.fromEntries(response.headers));return res.end(Buffer.from(await response.arrayBuffer()));
    }
    if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);return res.end()}
    const file=url.pathname==='/'?'index.html':decodeURIComponent(url.pathname).slice(1);
    if(!assets.has(file)){res.writeHead(404);return res.end('Not found')}
    const bytes=await fs.readFile(path.join(root,file));res.writeHead(200,{'Content-Type':types[path.extname(file)],'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:bytes);
  }catch{res.writeHead(500);res.end('Error interno')}
}).listen(port,'127.0.0.1',()=>console.log(`KDE disponible en http://127.0.0.1:${port}`));
