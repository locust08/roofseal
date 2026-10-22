"""Normalize the previously audited source snapshot, without fetching the website."""
import json
import re
import sys
from pathlib import Path

source = Path(sys.argv[1] if len(sys.argv) > 1 else 'temp/source-inventory-2026-10-21')
sys.path.insert(0, str(source.resolve()))
from extract import Tree

destination = Path('data/roofseal-source')
destination.mkdir(parents=True, exist_ok=True)
read = lambda name: json.loads((source / name).read_text())
media = {}


def add_media(url, alt=''):
    if url and (url.startswith('https://www.roofseal.com.my/wp-content/uploads/') or url.startswith('local:')):
        media.setdefault(url, {'url': url, 'alt': alt or Path(url).stem.replace('-', ' ')})
    return url


assets_text = Path('src/components/sites/roofseal/shared/assets.ts').read_text()
assets = dict(re.findall(r'"([^"\n]+)":\s*\{\s*local:\s*"([^"\n]+)"', assets_text))


def presentation(node, variable, alt):
    url = 'local:' + assets[node.replace(':', '-') + ':' + variable]
    return add_media(url, alt)


categories = read('categories.json')
category_slots = {'roof-covering': 1, 'insulation': 2, 'gutter-roof-component': 3, 'skylights': 4, 'structural': 5}
faqs = read('faqs.json')
for index, item in enumerate(categories):
    tree = Tree((source / item.pop('rawHtml')).read_text()).root
    nodes = list(tree.nodes())
    intro = next((n for n in nodes if n.has('left-col')), None)
    item['description'] = intro.text().removeprefix(item['title']).strip() if intro else ''
    item['displayOrder'] = index
    item['faqs'] = [{**f, 'group': 'metal' if i < 3 else 'shingles'} for i, f in enumerate(faqs)] if item['slug'] == 'roof-covering' else []
    item['presentationImage'] = None
    if item['slug'] in category_slots:
        item['presentationImage'] = presentation('28318:4046', 'imgComponent' + str(category_slots[item['slug']]), item['name'])
    elif item['slug'] == 'metal-deck-roofing-sheets':
        item['presentationImage'] = presentation('28352:1920', 'imgComponent1', item['name'])
    elif item['slug'] == 'roof-shingles-system-malaysia':
        item['presentationImage'] = presentation('28352:1920', 'imgComponent2', item['name'])
    for image in item.get('images', []): add_media(image['url'], image.get('alt'))

roof_order = ['roofseal-deck762', 'roofseal-deck762-with-pu-foammetal', 'roofseal-euro762', 'roofseal-high-rib-30', 'roofseal-clip720', 'roofseal-span', 'roofseal-clad']
products = read('products.json')
def bullet_text(node):
    if isinstance(node, str): return node
    if node.tag in ('ul', 'ol', 'script', 'style'): return ''
    return ' '.join(bullet_text(child) for child in node.children)

for item in products:
    raw_html = item.pop('rawHtml', None)
    if raw_html:
        tree = Tree((source / raw_html).read_text()).root
        desc = next((n for n in tree.nodes() if n.has('woocommerce-product-details__short-description')), None)
        # Nested lists must not duplicate all child bullets inside their parent.
        item['descriptionItems'] = [text for n in desc.nodes() if n.tag == 'li' if (text := re.sub(r'\s+', ' ', bullet_text(n)).strip())] if desc else []
    item['displayOrder'] = roof_order.index(item['slug']) if item['slug'] in roof_order else 100
    item['presentationImage'] = None
    item['presentationGallery'] = []
    item['editorialNotes'] = 'Two original pages use this title. Retained separately by original ID; verify their intended product distinction.' if item['title'] == 'Glasswool Insulation' else ''
    if item['slug'] in roof_order:
        i = roof_order.index(item['slug'])
        item['presentationImage'] = presentation('28318:4214', 'imgFeatureCardBackground' + (str(i) if i else ''), item['title'])
    if item['slug'] == 'roofseal-deck762':
        item['sku'] = 'Deck762'
        item['presentationGallery'] = [presentation('28318:4413', 'imgProductImage', item['title']), presentation('28318:4413', 'imgProductImage1', 'Roofseal colour and profile options')]
    for image in item['images']: add_media(image['url'], image.get('alt'))
    for url in item['catalogueUrls']: add_media(url, item['title'] + ' catalogue')

resources = []
pdfs = read('summary.json')['productDetails']['uniqueCatalogueUrls']
for url in pdfs:
    related = [p for p in products if url in p['catalogueUrls']]
    title = related[0]['title'] + ' Catalogue'
    slug = re.sub(r'[^a-z0-9]+', '-', Path(url).stem.lower()).strip('-')
    resources.append({'title': title, 'slug': 'catalogue-' + slug, 'type': 'catalogue', 'sourceUrl': url, 'file': url, 'images': [], 'coverImage': related[0]['images'][0]['url'], 'products': [p['sourceUrl'] for p in related], 'excerpt': 'Product information and specifications for ' + ', '.join(p['title'] for p in related) + '.', 'blocks': []})

for item in read('articles.json'):
    blocks = [{'tag': b['tag'], 'text': b['text']} for b in item['bodyBlocks'] if b['tag'] != 'h1']
    resources.append({'title': item['title'], 'slug': item['slug'], 'type': 'article', 'sourceUrl': item['sourceUrl'], 'seoTitle': item['seoTitle'], 'seoDescription': item['seoDescription'], 'excerpt': next(b['text'] for b in blocks if b['tag'] == 'p'), 'blocks': blocks, 'images': []})

pages = read('pages.json')
materials = next(p for p in pages if p['slug'] == 'materials-from-bluescope-malaysia')
tree = Tree((source / materials['rawHtml']).read_text()).root
content = next(n for n in tree.nodes() if n.has('content'))
blocks = [{'tag': n.tag, 'text': n.text()} for n in content.nodes() if n.tag in ('h2', 'h3', 'p') and n.text()]
resources.append({'title': 'Roofing Materials from BlueScope Malaysia', 'slug': 'bluescope-materials', 'type': 'material', 'sourceUrl': materials['sourceUrl'], 'seoTitle': materials['seoTitle'], 'seoDescription': materials['seoDescription'], 'excerpt': 'Roofing steel materials, coatings and colour options from BlueScope Malaysia.', 'blocks': blocks, 'images': [], 'materials': [
    {'name': 'ZINCALUME®', 'coatingMass': 'AZ150', 'warranty': 'Up to 25 years'},
    {'name': 'Clean COLORBOND®', 'coatingMass': 'AZ150', 'warranty': 'Up to 25 years'},
    {'name': 'PRIMAMAJU®', 'coatingMass': 'AZ100', 'warranty': 'Up to 15 years'},
    {'name': 'ZACS® Painted', 'coatingMass': 'AZ090', 'warranty': 'Up to 10 years'},
], 'editorialNotes': 'Coating and warranty data preserved from the original materials page. Verify current terms with Roofseal before changing claims.'})

for gallery in read('resource-checks.json'):
    if gallery['kind'] != 'gallery': continue
    name = gallery['url'].rstrip('/').rsplit('/', 1)[-1]
    images = [add_media(i['url'], i.get('caption') or name.replace('-', ' ')) for i in gallery['images']]
    resources.append({'title': name.replace('-', ' ').title(), 'slug': 'gallery-' + name, 'type': 'gallery', 'sourceUrl': gallery['url'], 'images': images, 'coverImage': images[0] if images else None, 'blocks': [], 'excerpt': 'Original Roofseal ' + name.replace('-', ' ') + ' image gallery.'})

for page in pages:
    for image in page.get('images', []): add_media(image['url'], image.get('alt'))

updates_path = Path('data/roofseal-drive-updates.json')
if updates_path.exists():
    updates = json.loads(updates_path.read_text())
    for items, key in [(products, 'retiredProducts'), (categories, 'retiredCategories'), (resources, 'retiredResources')]:
        for item in items:
            if item['slug'] in updates[key]:
                item['_status'] = 'draft'

for name, data in [('products', products), ('categories', categories), ('resources', resources), ('media', list(media.values()))]:
    (destination / (name + '.json')).write_text(json.dumps(data, indent=2, ensure_ascii=False) + '\n')
print(f'Prepared {len(products)} products, {len(categories)} categories, {len(resources)} resources, {len(media)} media sources.')
