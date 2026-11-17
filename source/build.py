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
DISCOVERIES = json.loads((SRC/'discoveries.json').read_text(encoding='utf-8'))
LEGACY = (SRC/'legacy_giza_hawara_v2.html').read_text(encoding='utf-8')
WORLD_TEXTURE = (ROOT/'assets/earth.webp').read_bytes()

def embedded(obj):
    return json.dumps(obj, ensure_ascii=False, separators=(',',':')).replace('</','<\\/')

page = (SRC/'template.html').read_text(encoding='utf-8')
page = page.replace('__SITES_JSON__',embedded(SITES))
page = page.replace('__HISTORY_JSON__',embedded(EVENTS))
page = page.replace('__PORTALS_JSON__',embedded(PORTALS))
page = page.replace('__CIVILIZATION_JSON__',embedded(CIVILIZATIONS))
page = page.replace('__DISCOVERIES_JSON__',embedded(DISCOVERIES))
page = page.replace('__SURFACE_CSS__',(SRC/'surface.css').read_text(encoding='utf-8'))
page = page.replace('__DISCOVERY_CSS__',(SRC/'discovery.css').read_text(encoding='utf-8'))
page = page.replace('__SURFACE_ENGINE__',(SRC/'surface_map.js').read_text(encoding='utf-8'))
page = page.replace('__DISCOVERY_ENGINE__',(SRC/'discovery_lab.js').read_text(encoding='utf-8'))
page = page.replace('__DISCOVERY_MARKUP__',(SRC/'discovery_markup.html').read_text(encoding='utf-8'))
page = page.replace('__TIMEPORTAL_CSS__',(SRC/'timeportal.css').read_text(encoding='utf-8'))
page = page.replace('__TIMEPORTAL_ENGINE__',(SRC/'timeportal_engine.js').read_text(encoding='utf-8'))
page = page.replace('__TIMEPORTAL_MARKUP__',(SRC/'timeportal_markup.html').read_text(encoding='utf-8'))
page = page.replace('__EARTH_DATA__','data:image/webp;base64,'+base64.b64encode(WORLD_TEXTURE).decode('ascii'))
# Freeze the legacy gzip stream: zlib output differs across Python and OS versions.
# Validate it against the editable source before embedding to prevent silent drift.
LEGACY_GZIP_BYTES = base64.b64decode((SRC/'legacy_gzip.b64').read_text(encoding='ascii').strip())
assert gzip.decompress(LEGACY_GZIP_BYTES) == LEGACY.encode('utf-8'), 'legacy gzip does not match editable source'
page = page.replace('__LEGACY_GZIP__',base64.b64encode(LEGACY_GZIP_BYTES).decode('ascii'))
assert all(x not in page for x in ('__SITES_JSON__','__HISTORY_JSON__','__PORTALS_JSON__','__TIMEPORTAL_CSS__','__TIMEPORTAL_ENGINE__','__TIMEPORTAL_MARKUP__','__CIVILIZATION_JSON__','__DISCOVERIES_JSON__','__SURFACE_CSS__','__DISCOVERY_CSS__','__SURFACE_ENGINE__','__DISCOVERY_ENGINE__','__DISCOVERY_MARKUP__'))
out=ROOT/'index.html'
out.write_text(page,encoding='utf-8')
print(f'Built {out} ({out.stat().st_size:,} bytes) with {len(SITES)} sites and {len(EVENTS)} events and {len(PORTALS)} Timeportals.')
