import {cp,mkdir,readFile,writeFile,stat} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const here=dirname(fileURLToPath(import.meta.url));
const source=resolve(process.env.PORTFOLIO_SOURCE||resolve(here,'..'));
const output=resolve(process.env.PORTFOLIO_OUTPUT||resolve(source,'dist-pages'));
await mkdir(output,{recursive:true});
await cp(resolve(source,'public'),output,{recursive:true});
await writeFile(resolve(output,'index.html'),await readFile(resolve(source,'content/portfolio.html')));
await cp(resolve(here,'worker.mjs'),resolve(output,'_worker.js'));
await writeFile(resolve(output,'_routes.json'),JSON.stringify({version:1,include:['/api/*'],exclude:[]}));
for(const name of ['index.html','style.css','app.js','ocean-journey.js','films.js','views.js','_worker.js']){
 if(!(await stat(resolve(output,name))).size)throw Error('Missing Pages file: '+name);
}
console.log('Cloudflare Pages output ready: '+output);
