"""Download exact Figma asset URLs from saved design-context responses."""
import re, json, hashlib, subprocess, concurrent.futures
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public/sites/roofseal/shared'
OUT.mkdir(parents=True, exist_ok=True)
entries = {}
for source in (ROOT / 'docs/research/roofseal').glob('*.md'):
    text = source.read_text(encoding='utf-8')
    prefix = re.search(r'const assetPathPrefix = "([^"]+)"', text)
    if not prefix:
        continue
    for variable, filename in re.findall(r'const (\w+) = `\$\{assetPathPrefix\}/([^`]+)`', text):
        if not re.fullmatch(r'[a-zA-Z0-9_.-]+', filename):
            continue
        url = prefix[1] + '/' + filename
        key = source.stem + ':' + variable
        local = hashlib.sha256(url.encode()).hexdigest()[:16] + '-' + filename
        entries[key] = {'url': url, 'local': '/sites/roofseal/shared/' + local, 'file': local}

def download(item):
    key, entry = item
    target = OUT / entry['file']
    if not target.exists() or not target.stat().st_size:
        subprocess.run(['curl.exe', '-s', '-f', '-L', '--retry', '2', '--max-time', '90', '-o', str(target), entry['url']], check=True)
    if not target.stat().st_size:
        raise RuntimeError('Empty download: ' + key)
    return key, {k: v for k, v in entry.items() if k != 'url'}

with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    results = dict(pool.map(download, entries.items()))
(ROOT / 'docs/research/roofseal/assets.json').write_text(json.dumps(results, indent=2), encoding='utf-8')
print(f'Downloaded {len(results)} asset references; {len(list(OUT.iterdir()))} unique files')
