#!/usr/bin/env node
/**
 * MOST Petersburg sitemap QA: Node 20+, no dependencies.
 * Usage: node scripts/audit-site.mjs [--live]
 * Default audits repository HTML. --live requests deployed pages.
 * Output: reports/site-audit.json and reports/site-audit.csv.
 */
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
const root = process.cwd();
const live = process.argv.includes('--live');
const base = 'https://mostpetersburg.ru';
const xml = readFileSync(join(root,'public/sitemap.xml'),'utf8');
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
const unique = [...new Set(urls)];
const getAttr = (tag,key) => tag.match(new RegExp('\\b'+key+'\\s*=\\s*["\\x27]([^"\\x27]*)["\\x27]','i'))?.[1] ?? null;
const tags = (html,name) => [...html.matchAll(new RegExp('<'+name+'\\b[^>]*>','gi'))].map(m=>m[0]);
const hrefs = html => [...html.matchAll(/\bhref=["']([^"']+)["']/gi)].map(m=>m[1]);
const text = s => (s??'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
const results=[];
for(const url of unique){
 const u = new URL(url);
 const rel = decodeURIComponent(u.pathname);
 const local = join(root,'public',rel.endsWith('/')?rel+'index.html':rel);
 let html='', status=null, err=null;
 try {
   if(live){const res=await fetch(url,{redirect:'follow',signal:AbortSignal.timeout(12000),headers:{'User-Agent':'MOST-QA/1.0'}});status=res.status;html=await res.text();}
   else if(existsSync(local)){html=readFileSync(local,'utf8');status=200;}
   else {status=404;err='Missing repository file';}
 } catch(e){err=String(e);status=0;}
 const titles=[...html.matchAll(/<title[^>]*>([\s\S]*?)<\/title>/gi)].map(m=>text(m[1]));
 const metas=tags(html,'meta');
 const links=tags(html,'link');
 const desc=metas.find(t=>getAttr(t,'name')?.toLowerCase()==='description');
 const canonical=links.find(t=>getAttr(t,'rel')?.toLowerCase()==='canonical');
 const og=metas.filter(t=>getAttr(t,'property')?.startsWith('og:'));
 const alternates=links.filter(t=>getAttr(t,'hreflang'));
 const imgs=tags(html,'img');
 const internal=hrefs(html).filter(h=>h.startsWith('/')&&!h.startsWith('//')&&!h.startsWith('/#'));
 const brokenLocalAssets=internal.filter(h=>/\.(?:css|js|svg|png|jpe?g|webp|gif)(?:\?|$)/i.test(h)).filter(h=>!existsSync(join(root,'public',h.split('?')[0])));
 const imgSrc=imgs.map(t=>getAttr(t,'src')).filter(Boolean);
 const brokenImages=imgSrc.filter(s=>s.startsWith('/')&&!existsSync(join(root,'public',s.split('?')[0])));
 const lang=getAttr(html.match(/<html\b[^>]*>/i)?.[0]??'','lang');
 const h1=tags(html,'h1').length;
 const issues=[];
 if(status!==200)issues.push('HTTP_OR_FILE_'+status);
 if(titles.length!==1||!titles[0])issues.push('TITLE_MISSING_OR_MULTIPLE');
 if(!desc||!getAttr(desc,'content'))issues.push('DESCRIPTION_MISSING');
 if(!canonical)issues.push('CANONICAL_MISSING');
 else if(getAttr(canonical,'href')!==url)issues.push('CANONICAL_MISMATCH');
 if(h1!==1)issues.push('H1_COUNT_'+h1);
 if(!lang)issues.push('LANG_MISSING');
 if(!html.includes('name="viewport"'))issues.push('VIEWPORT_MISSING');
 if(og.length===0)issues.push('OG_MISSING');
 if(!html.includes('application/ld+json'))issues.push('SCHEMA_MISSING');
 if(imgs.some(t=>getAttr(t,'alt')===null))issues.push('IMG_ALT_MISSING');
 if(html.includes('drive.google.com/thumbnail'))issues.push('DRIVE_IMAGE');
 if(brokenImages.length)issues.push('BROKEN_LOCAL_IMAGES');
 if(brokenLocalAssets.length)issues.push('BROKEN_LOCAL_ASSETS');
 if(rel.match(/^\/(zh-CN|ar|id|vi)\//)&&alternates.length<2)issues.push('HREFLANG_INCOMPLETE_REVIEW');
 if(lang==='ar'&&!/dir=["']rtl["']/i.test(html))issues.push('RTL_MISSING');
 results.push({url,status,title:titles[0]??'',description:getAttr(desc??'','content')??'',lang,canonical:getAttr(canonical??'','href')??'',h1,hreflang:alternates.length,og:og.length,schema:html.includes('application/ld+json'),images:imgs.length,externalDriveImages:(html.match(/drive\.google\.com\/thumbnail/g)||[]).length,brokenImages,brokenLocalAssets,issues,error:err});
}
const counts={};for(const r of results)for(const i of r.issues)counts[i]=(counts[i]||0)+1;
const summary={date:new Date().toISOString(),mode:live?'live':'repository',total:results.length,sitemapDuplicates:urls.length-unique.length,passed:results.filter(r=>r.issues.length===0).length,issueCounts:counts};
mkdirSync(join(root,'reports'),{recursive:true});
writeFileSync(join(root,'reports/site-audit.json'),JSON.stringify({summary,pages:results},null,2));
const fields=['url','status','lang','title','h1','hreflang','og','schema','images','externalDriveImages','issues'];
const esc=v=>'"'+String(Array.isArray(v)?v.join(';'):v??'').replaceAll('"','""')+'"';
writeFileSync(join(root,'reports/site-audit.csv'),[fields.join(','),...results.map(r=>fields.map(f=>esc(r[f])).join(','))].join('\n')+'\n');
console.log(JSON.stringify(summary,null,2));
if(results.some(r=>r.status!==200))process.exitCode=1;
