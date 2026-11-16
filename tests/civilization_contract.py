"""Data integrity tests. Run `python tests/civilization_contract.py` (no dependencies)."""
from pathlib import Path
import json
root=Path(__file__).resolve().parent.parent
portals=json.loads((root/'source/portals.json').read_text())
civ=json.loads((root/'source/civilization.json').read_text())
assert len(portals)==len(civ)==22
m={x['id']:x for x in civ}; assert len(m)==22
for portal in portals:
    c=m[portal['id']]
    assert all(c.get(k) for k in ('languages','writing','polity','engineering','ecology','source'))
    assert len(c['stages'])==3
    for i,(stage,moment) in enumerate(zip(portal['stages'],c['stages'])):
        assert moment['phase']==i and stage['year']==moment['year']
        if moment.get('population'):
            pop=moment['population']
            assert all(pop.get(k) for k in ('value','scope','method','url','confidence'))
        if moment['year']>=2025:assert not moment.get('population')
assert m['angkor']['stages'][1]['population']['value']=='700–900k'
assert m['pompeii']['stages'][2]['population']['scope'].startswith('Estimated city population before')
print('PASS: 22 site profiles, 66 period snapshots, scoped numbers, no modern-city census substitution')
