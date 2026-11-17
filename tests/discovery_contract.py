from pathlib import Path
import json
root=Path(__file__).resolve().parent.parent
records=json.loads((root/'source/discoveries.json').read_text())
assert len(records)==5
assert len({d['id'] for d in records})==len(records)
for d in records:
    assert -90<=d['lat']<=90 and -180<=d['lon']<=180
    assert d['source'].startswith('https://')
    assert d['anchor'] and d['evidence'] and d['visual']
    assert d['studyYear']>2000 and d['heritageEra']
    assert any(v in d['visual'].lower() for v in ('not', 'no ')), d['id']
print('Validated 5 discovery dossiers, evidence, map anchors, and source links')
