"""Timeportal smoke tests. Requires Playwright and Chromium."""
from pathlib import Path
import shutil,json,hashlib
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parent.parent
html=(root/'index.html').read_text()
portals=json.loads((root/'source/portals.json').read_text())
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path=shutil.which('chromium') or None,args=['--no-sandbox','--disable-dev-shm-usage'])
    for name,w,h in [('desktop',1440,900),('mobile',390,844)]:
        page=browser.new_page(viewport={'width':w,'height':h})
        errors=[]
        page.on('pageerror',lambda err: errors.append(str(err)))
        page.set_content(html)
        page.wait_for_timeout(200)
        assert page.locator('.marker').count()==25
        page.locator('button[data-site="petra"]').click()
        assert page.locator('#tpTitle').inner_text()=='Petra'
        checksums=[]
        for stage in range(3):
            page.locator(f'[data-tp-stage="{stage}"]').click()
            checksums.append(hashlib.md5(page.locator('#tpCanvas').screenshot()).hexdigest())
        assert len(set(checksums))==3,'Temporal phases do not visibly differ'
        page.locator('#tpPlay').click()
        page.wait_for_timeout(200)
        assert page.locator('#tpStatus').inner_text()=='PLAY HISTORY' or page.locator('#tpStatus').inner_text()=='PAUSE'
        page.locator('#tpClose').click()
        assert not page.locator('#timeportal').is_visible()
        assert not errors,errors
        print(name,'phase/camera navigation PASS')
        page.close()
    page=browser.new_page(viewport={'width':1200,'height':800})
    errors=[];page.on('pageerror',lambda err:errors.append(str(err)))
    page.set_content(html)
    for portal in portals:
        page.locator('[data-nav="places"]').click()
        page.locator(f'.catalog-card[data-id="{portal["id"]}"]').click()
        page.locator(f'[data-action="portal"][data-id="{portal["id"]}"]').click()
        colorCount=page.locator('#tpCanvas').evaluate('''canvas=>{const d=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;const set=new Set();for(let i=0;i<d.length;i+=4096)set.add(d[i]+'-'+d[i+1]+'-'+d[i+2]);return set.size}''')
        assert colorCount>3,(portal['id'],colorCount)
        page.locator('#tpClose').click()
    assert not errors,errors
    print('22 individual 3D scene paths PASS')
    browser.close()
