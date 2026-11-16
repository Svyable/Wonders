"""Optional smoke tests: pip install playwright; install a Chromium browser."""
from pathlib import Path
import shutil
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parent.parent
HTML=(ROOT/'index.html').read_text(encoding='utf-8')
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path=shutil.which('chromium') or shutil.which('google-chrome') or None,args=['--no-sandbox','--disable-dev-shm-usage'])
    for name,w,h in [('desktop',1440,900),('mobile',390,844)]:
        page=browser.new_page(viewport={'width':w,'height':h})
        errors=[]
        page.on('pageerror',lambda err:errors.append(str(err)))
        page.set_content(HTML)
        page.wait_for_timeout(500)
        assert page.locator('.marker').count()==25   # 24 sites plus custom waypoint marker
        page.locator('#query').fill('take me to Machu Picchu')
        page.locator('#queryForm button').click()
        assert page.locator('#tpTitle').inner_text()=='Machu Picchu'
        page.locator('#tpClose').click()
        page.locator('#query').fill('compare Giza and Hawara')
        page.locator('#queryForm button').click()
        assert page.locator('.compare-card').count()==2
        page.locator('#closeSheet').click()
        page.locator('button[data-nav="timeline"]').click()
        assert page.locator('#eventCards .event-row').count()==82
        page.locator('#eventSite').select_option('hawara')
        assert page.locator('#eventCards .event-row').count()==17
        page.locator('#closeSheet').click()
        page.locator('button[data-nav="places"]').click() if w>680 else page.locator('button[data-open="places"]').click()
        assert page.locator('.catalog-card').count()==24
        page.locator('#closeSheet').click()
        assert not errors,errors
        print(f'{name}: PASS, no page exceptions')
        page.close()
    browser.close()
