"""Offline-safe globe/approach/discovery interactions. Run with Chromium and Playwright."""
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parent.parent
html=(root/'index.html').read_text()
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage','--disable-web-security'])
 for name,w,h in [('desktop',1440,900),('mobile',390,844)]:
  page=browser.new_page(viewport={'width':w,'height':h},device_scale_factor=1)
  errors=[];page.on('pageerror',lambda err: errors.append(str(err)))
  page.route('https://*',lambda route: route.abort())  # deterministic offline fallback
  page.set_content(html);page.wait_for_timeout(450)
  assert page.locator('.marker').count()==25
  assert page.locator('#surfaceMode').get_attribute('class')=='surface-view'
  (root/f'preview_earth_{name}.png').write_bytes(page.screenshot())
  page.locator('#surfaceEnter').click(force=True)
  assert page.locator('#surfaceMode').evaluate("e=>e.classList.contains('active')")
  page.wait_for_timeout(550)
  (root/f'preview_surface_{name}.png').write_bytes(page.screenshot())
  page.locator('#surfaceExit').click(force=True)
  assert not page.locator('#surfaceMode').evaluate("e=>e.classList.contains('active')")
  page.locator('[data-nav="discoveries"]').click(force=True)
  assert page.locator('#discoveryLab').is_visible()
  assert page.locator('.discovery-option').count()==5
  page.locator('.discovery-option').nth(1).click(force=True)
  assert 'Caracol' in page.locator('#discoveryStory').inner_text()
  page.locator('#revealTerrain').fill('98')
  page.locator('[data-discovery-mode="structures"]').click(force=True)
  (root/f'preview_discovery_{name}.png').write_bytes(page.screenshot())
  page.locator('#discoveryExit').click(force=True)
  assert not page.locator('#discoveryLab').is_visible()
  assert not errors,(name,errors)
  print(name,'globe, surface, lab PASS')
  page.close()
 browser.close()
