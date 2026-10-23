"""Extract public catalog content; retain source URLs for editorial review."""
import concurrent.futures, json, pathlib, re
from urllib.parse import urlparse
import requests
from bs4 import BeautifulSoup

ROOT = pathlib.Path(__file__).resolve().parents[1]
BASE = 'https://www.roofseal.com.my'
def get(url):
    r = requests.get(url, timeout=40); r.raise_for_status()
    r.encoding = 'utf-8'
    return BeautifulSoup(r.text, 'html.parser')
def text(node):
    return ' '.join(node.stripped_strings) if node else ''
home = get(BASE+'/product-category/insulation/')
links = {}
for a in home.select('#rmp-menu-1920 a[href*="/product-category/"]'):
    if 'aluminium-metal-ceiling' not in a['href']:
        links[a['href']] = text(a)
aliases = {'metal-deck-roofing-sheets':'metal-roof-system','roof-shingles-system-malaysia':'shingles-roof-system','glass-wool-insulation-supplier-malaysia':'glasswool','rockwool-insulation-supplier-malaysia':'rockwool','aluminium-foil-insulation-malaysia':'aluminium-foil','rain-gutter-systems-malaysia':'gutter-system','capping-flashing':'flashing-capping','fire-rated-doors-supplier-malaysia':'fire-rated-door'}
def slug(url):
    s = urlparse(url).path.strip('/').split('/')[-1]
    return aliases.get(s,s)
categories = []
def category(pair):
    url,title=pair; soup=get(url)
    feature=soup.select_one('main .product-featured-section')
    extra=soup.select_one('#wpcf-field-custom-categories-text')
    children=[]; products=[]
    for li in soup.select('#product-content ul.products > li'):
        a=li.select_one('a[href]'); h=li.select_one('h2, h3')
        if a:
            item={'slug':slug(a['href']),'name':text(h),'source':a['href']}
            (children if 'product-category' in li.get('class',[]) else products).append(item)
    paragraphs=[]
    if feature:
        f=BeautifulSoup(str(feature),'html.parser')
        for n in f.select('h1,h2,h3,h4'): n.decompose()
        paragraphs=[text(f)] if text(f) else []
    return {'slug':slug(url),'name':title,'source':url,'heading':text(feature.select_one('h1,h2,h3')) if feature else title,'intro':paragraphs,'content':text(extra),'children':children,'products':products}
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    for c in pool.map(category,links.items()): categories.append(c)
product_links={p['source']:p for c in categories for p in c['products']}
def product(pair):
    url,item=pair; soup=get(url)
    desc=soup.select_one('.woocommerce-product-details__short-description')
    full=soup.select_one('#tab-description')
    sections=[]
    if full:
        for n in full.select('script,style,iframe,form'): n.decompose()
        sections=[text(x) for x in full.select('p,li,h3,h4') if text(x)]
    name=text(soup.select_one('h1.product_title')) or item['name']
    description_items=[text(x) for x in desc.select('li,p') if text(x)] if desc else []
    return {**item,'name':name,'description':text(desc),'descriptionItems':list(dict.fromkeys(description_items)),'content':list(dict.fromkeys(sections)),'categories':[c['slug'] for c in categories if any(p['source']==url for p in c['products'])]}
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    products=list(pool.map(product,product_links.items()))
out=ROOT/'src/components/sites/roofseal/catalog/live-catalog.json'
out.write_text(json.dumps({'categories':categories,'products':products},ensure_ascii=False,indent=2),encoding='utf-8')
print(f'{len(categories)} categories, {len(products)} products -> {out}')
