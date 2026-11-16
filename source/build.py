#!/usr/bin/env python3
"""Rebuild the WonderTime single HTML file (Python 3, standard library only)."""
from pathlib import Path
import json, gzip, base64

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT/'source'
SITES = json.loads((SRC/'sites.json').read_text(encoding='utf-8'))
EVENTS = json.loads((SRC/'chronology.json').read_text(encoding='utf-8'))
PORTALS = json.loads((SRC/'portals.json').read_text(encoding='utf-8'))
CIVILIZATIONS = json.loads((SRC/'civilization.json').read_text(encoding='utf-8'))
LEGACY = (SRC/'legacy_giza_hawara_v2.html').read_text(encoding='utf-8')
WORLD_TEXTURE = (ROOT/'assets/earth.webp').read_bytes()

def embedded(obj):
    return json.dumps(obj, ensure_ascii=False, separators=(',',':')).replace('</','<\\/')

page = (SRC/'template.html').read_text(encoding='utf-8')
page = page.replace('__SITES_JSON__',embedded(SITES))
page = page.replace('__HISTORY_JSON__',embedded(EVENTS))
page = page.replace('__PORTALS_JSON__',embedded(PORTALS))
page = page.replace('__CIVILIZATION_JSON__',embedded(CIVILIZATIONS))
page = page.replace('__TIMEPORTAL_CSS__',(SRC/'timeportal.css').read_text(encoding='utf-8'))
page = page.replace('__TIMEPORTAL_ENGINE__',(SRC/'timeportal_engine.js').read_text(encoding='utf-8'))
page = page.replace('__TIMEPORTAL_MARKUP__',(SRC/'timeportal_markup.html').read_text(encoding='utf-8'))
page = page.replace('__EARTH_DATA__','data:image/webp;base64,'+base64.b64encode(WORLD_TEXTURE).decode('ascii'))
page = page.replace('__LEGACY_GZIP__',base64.b64encode(gzip.compress(LEGACY.encode('utf-8'),compresslevel=9,mtime=0)).decode('ascii'))
assert all(x not in page for x in ('__SITES_JSON__','__HISTORY_JSON__','__PORTALS_JSON__','__TIMEPORTAL_CSS__','__TIMEPORTAL_ENGINE__','__TIMEPORTAL_MARKUP__','__CIVILIZATION_JSON__'))
out=ROOT/'index.html'
out.write_text(page,encoding='utf-8')
print(f'Built {out} ({out.stat().st_size:,} bytes) with {len(SITES)} sites and {len(EVENTS)} events and {len(PORTALS)} Timeportals.')
