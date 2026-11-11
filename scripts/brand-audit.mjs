#!/usr/bin/env node
/** MOST visual consistency inventory. Node 20+, no dependencies.
 * Run: node scripts/brand-audit.mjs
 * Produces reports/brand-audit.json and reports/brand-audit.md.
 * Reports observed CSS colors, NOT approved brand colors.
 */
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {join} from 'node:path';
const root=process.cwd();
const files=['public/styles.css','public/home-refresh.css'];
const colors={};
for(const file of files){
 const css=readFileSync(join(root,file),'utf8');
 const matches=[...css.matchAll(/#[0-9a-fA-F]{3,8}\b/g)];
 const count={};for(const m of matches){const key=m[0].toUpperCase();count[key]=(count[key]||0)+1;}
 colors[file]=Object.entries(count).sort((a,b)=>b[1]-a[1]).map(([hex,uses])=>({hex,uses}));
}
const html=readFileSync(join(root,'public/index.html'),'utf8');
const logo=[...html.matchAll(/<img\b[^>]*src=["']([^"']*MOST[^"']*)["'][^>]*>/gi)].map(m=>m[1]);
const output={generatedAt:new Date().toISOString(),status:'INVENTORY_ONLY_NOT_BRAND_APPROVAL',logo,colors};
mkdirSync(join(root,'reports'),{recursive:true});
writeFileSync(join(root,'reports/brand-audit.json'),JSON.stringify(output,null,2));
const lines=['# MOST Petersburg — CSS color inventory','','**Status: inventory only. No palette approved.**','','Original brand logo referenced on homepage: '+(logo.join(', ')||'not found'),''];
for(const [file,items] of Object.entries(colors)){
 lines.push('## '+file,'','| CSS color | Occurrences |','|---|---:|',...items.map(x=>('| `'+x.hex+'` | '+x.uses+' |')),'');
}
lines.push('## Design approval gate','','1. Visually inspect original MOST-8.png and original archival brand artwork.','2. Sample and verify primary/secondary logo colors and approved clear space.','3. Check typography against original identity, not a generic editorial theme.','4. Resolve conflicts in styles.css and home-refresh.css only after approval.','5. Review desktop, mobile, RTL, five locales and image treatment before release.','');
writeFileSync(join(root,'reports/brand-audit.md'),lines.join('\n'));
console.log('Wrote reports/brand-audit.json and reports/brand-audit.md');
console.log('Distinct CSS colors:',Object.fromEntries(Object.entries(colors).map(([f,v])=>[f,v.length])));
