#!/usr/bin/env node
/** Conservative MOST SEO metadata repair; no invented structured data.
 * node scripts/fix-seo.mjs --dry-run
 * node scripts/fix-seo.mjs --write
 */
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {join} from 'node:path';
const write=process.argv.includes('--write');
const sitemap=readFileSync('public/sitemap.xml','utf8');
const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(x=>x[1]);
const esc=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
let changed=0;const details=[];
for(const url of urls){
 const pathname=new URL(url).pathname;
 const file=join('public',pathname.endsWith('/')?pathname+'index.html':pathname);
 if(!existsSync(file))continue;
 const before=readFileSync(file,'utf8');
 let html=before;const edits=[];
 const title=html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
 const description=html.match(/<meta\s+[^>]*name=["']description["'][^>]*>/i)?.[0]?.match(/content=["']([^"']*)["']/i)?.[1];
 const canonical=html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*>/i)?.[0];
 if(canonical&&canonical.match(/href=["']([^"']*)["']/i)?.[1]!==url){
   html=html.replace(canonical,canonical.replace(/href=["'][^"']*["']/i,'href="'+url+'"'));
   edits.push('canonical');
 }
 const hasOG=/<meta\s+[^>]*property=["']og:title["']/i.test(html);
 if(title&&description&&!hasOG){
   const tags='<meta property="og:type" content="website"><meta property="og:site_name" content="MOST Petersburg"><meta property="og:title" content="'+esc(title.replace(/&amp;/g,'&'))+'"><meta property="og:description" content="'+esc(description.replace(/&amp;/g,'&'))+'"><meta property="og:url" content="'+esc(url)+'">';
   html=html.replace(/<\/head>/i,tags+'</head>');
   edits.push('open-graph');
 }
 if(edits.length){changed++;details.push({url,edits});if(write)writeFileSync(file,html);}
}
console.log(JSON.stringify({mode:write?'write':'dry-run',changed,details},null,2));
