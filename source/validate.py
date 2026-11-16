#!/usr/bin/env python3
"""Validate geospatial, provenance, and chronology invariants."""
import json
from pathlib import Path
from urllib.parse import urlparse
ROOT=Path(__file__).resolve().parent
sites=json.loads((ROOT/'sites.json').read_text())
events=json.loads((ROOT/'chronology.json').read_text())
ids=set()
for s in sites:
    assert s['id'] not in ids, f'duplicate site {s["id"]}'
    ids.add(s['id'])
    assert all(s.get(k) for k in ('id','name','place','country','region','date','era','desc','source'))
    assert -90<=s['lat']<=90 and -180<=s['lon']<=180
    assert -12000<=s['start']<=2026
    assert s['status'] in ('preview','immersive')
    assert urlparse(s['source']).scheme=='https',s['source']
for e in events:
    assert e['site_id'] in ids, e['site_id']
    assert isinstance(e['year'],(int,float)),e
    assert -12000<=e['year']<=2026
    assert e.get('title') and e.get('description')
assert sum(s['status']=='immersive' for s in sites)==2
print('Validated',len(sites),'unique locations and',len(events),'chronicle entries.')

portals=json.loads((ROOT/'portals.json').read_text())
assert len(portals)==22
assert {p['id'] for p in portals}=={s['id'] for s in sites if s['status']!='immersive'}
for p in portals:
    assert len(p['stages'])==3 and p['source'].startswith('https://')
    assert all(isinstance(x['year'],int) for x in p['stages'])
    years=[x['year'] for x in p['stages']]
    assert years==sorted(years),p['id']
    assert all(x.get('story') and x.get('name') for x in p['stages'])
    assert p.get('caveat') and p['renderer']=='procedural-interpretive'
print('Validated 22 evidence-labelled 4D Timeportals.')
