#!/usr/bin/env python3
"""MOST Petersburg static-site QA. Run: python3 scripts/audit_site.py
Only stdlib. Exit 1 on broken internal links, missing metadata, missing image alt.
"""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
from collections import Counter
import json, sys
ROOT=Path(__file__).resolve().parents[1]/"public"
class Page(HTMLParser):
    def __init__(self):
        super().__init__();self.links=[];self.images=[];self.title=False;self.description=False;self.canonical=[];self.lang=False;self.h1=0;self.ids=set();self.alternates=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=="html":self.lang=bool(a.get("lang"))
        if tag=="title":self.title=True
        if tag=="h1":self.h1+=1
        if tag=="meta" and a.get("name","").lower()=="description":self.description=bool(a.get("content","").strip())
        if tag=="link" and a.get("rel")=="canonical":self.canonical.append(a.get("href",""))
        if tag=="link" and a.get("rel")=="alternate" and a.get("hreflang"):self.alternates.append((a["hreflang"],a.get("href","")))
        if tag=="a" and a.get("href"):self.links.append(a["href"])
        if tag=="img":self.images.append(a)
        if a.get("id"):self.ids.add(a["id"])
def resolve(url):
    p=unquote(urlsplit(url).path)
    if not p or p=="/":p="/index.html"
    elif p.endswith("/"):p+="index.html"
    if not p.startswith("/"):return None
    target=(ROOT/p.lstrip("/")).resolve()
    if not target.is_relative_to(ROOT.resolve()):return None
    return target
issues=[];pages=list(ROOT.rglob("*.html"));all_pages={}
for path in pages:
    p=Page()
    try:p.feed(path.read_text(encoding="utf-8"))
    except Exception as e:issues.append((str(path.relative_to(ROOT)),"parse",str(e)));continue
    rel="/"+str(path.relative_to(ROOT));all_pages[rel]=p
    if not p.lang:issues.append((rel,"missing_lang",""))
    if not p.title:issues.append((rel,"missing_title",""))
    if not p.description:issues.append((rel,"missing_description",""))
    if p.h1!=1:issues.append((rel,"h1_count",str(p.h1)))
    if len(p.canonical)!=1:issues.append((rel,"canonical_count",str(len(p.canonical))))
    for link in p.links:
        u=urlsplit(link)
        if u.scheme or u.netloc or link.startswith(("mailto:","tel:","#","javascript:")):continue
        target=resolve(link)
        if target and not target.is_file():issues.append((rel,"broken_internal_link",link))
    for img in p.images:
        if not img.get("alt","").strip():issues.append((rel,"missing_image_alt",img.get("src","")))
        src=img.get("src","")
        if src.startswith("/") and not src.startswith("//"):
            target=resolve(src)
            if target and not target.is_file():issues.append((rel,"missing_local_image",src))
    for canonical in p.canonical:
        u=urlsplit(canonical)
        if u.netloc!="mostpetersburg.ru":issues.append((rel,"canonical_host",canonical))
        elif (t:=resolve(canonical)) and not t.is_file():issues.append((rel,"canonical_missing_target",canonical))
sitemap=ROOT/"sitemap.xml"
if sitemap.exists():
    import xml.etree.ElementTree as ET
    ns={"s":"http://www.sitemaps.org/schemas/sitemap/0.9"}
    for node in ET.parse(sitemap).findall(".//s:loc",ns):
        if node.text and (t:=resolve(node.text)) and not t.is_file():issues.append(("sitemap.xml","sitemap_missing_target",node.text))
counts=Counter(x[1] for x in issues)
print(json.dumps({"pages_checked":len(pages),"issue_count":len(issues),"issues_by_type":counts,"issues":[{"page":a,"type":b,"value":c} for a,b,c in issues]},ensure_ascii=False,indent=2))
sys.exit(1 if issues else 0)
