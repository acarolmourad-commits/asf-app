// Real rendering/input regression. Install playwright@1.56.1 and its Chromium.
// Run: node tests/navigation-browser.cjs
// Requests stay on a local server; no registration, message or live API writes.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const output = process.env.ASF_BROWSER_OUTPUT || path.join(root, 'test-results/navigation');
const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp'};
const server = http.createServer((req, res) => {
  if (req.method !== 'GET') { res.writeHead(405).end(); return; }
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  let file = path.resolve(root, '.' + pathname);
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404).end(); return; }
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
const cases = [
  {name:'desktop',width:1363,height:936,touch:false},
  {name:'mobile-360',width:360,height:800,touch:true},
  {name:'mobile-390',width:390,height:844,touch:true},
  {name:'landscape',width:844,height:390,touch:true},
  {name:'tablet',width:768,height:1024,touch:true}
];
async function hitTarget(locator) {
  return locator.evaluate(e => {
    const r=e.getBoundingClientRect();
    return r.width >= 40 && r.height >= 40 && r.left >= 0 && r.top >= 0 &&
      r.right <= innerWidth && r.bottom <= innerHeight &&
      e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));
  });
}
(async () => {
  fs.mkdirSync(output, {recursive:true});
  await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
  const origin = 'http://127.0.0.1:' + server.address().port;
  let browser;
  const results=[];
  try {
    browser=await chromium.launch({headless:true});
    for (const spec of cases) {
      const context=await browser.newContext({viewport:{width:spec.width,height:spec.height},hasTouch:spec.touch,isMobile:spec.touch,serviceWorkers:'block',reducedMotion:'reduce'});
      await context.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
      const page=await context.newPage();
      page.setDefaultTimeout(7000);
      const act=locator => spec.touch ? locator.tap() : locator.click();
      try {
        await page.goto(origin+'/index.html');
        await page.locator('#asf-explore-directory').waitFor();
        await page.waitForFunction(()=>document.getElementById('menu-toggle').getAttribute('aria-controls')==='header-menu');
        const consent=page.getByRole('button',{name:'Somente essenciais',exact:true});
        if(await consent.isVisible()) await consent.click();
        const toggle=page.locator('#menu-toggle'), menu=page.locator('#header-menu');
        const items=menu.locator('.menu-item');
        assert.equal(await menu.locator('.asf-menu-group').count(),5);
        assert.equal(await items.count(),23);
        assert.equal(await menu.locator('[role="menu"],[role="menuitem"]').count(),0);
        assert.ok(await hitTarget(toggle),'menu trigger receives pointer at its center');
        await act(toggle);
        await page.waitForFunction(()=>document.activeElement===document.querySelector('#header-menu .menu-item'));
        assert.equal(await toggle.getAttribute('aria-expanded'),'true');
        assert.ok(await items.first().evaluate(e=>getComputedStyle(e).outlineStyle!=='none'),'visible focus');
        await page.keyboard.press('ArrowDown');
        assert.ok(await items.nth(1).evaluate(e=>e===document.activeElement));
        await page.keyboard.press('End');
        assert.ok(await items.last().evaluate(e=>e===document.activeElement));
        await page.keyboard.press('ArrowDown');
        assert.ok(await items.first().evaluate(e=>e===document.activeElement));
        await page.keyboard.press('ArrowUp');
        assert.ok(await items.last().evaluate(e=>e===document.activeElement));
        await page.keyboard.press('Home');
        await page.keyboard.press('Tab');
        assert.ok(await items.nth(1).evaluate(e=>e===document.activeElement));
        await page.screenshot({path:path.join(output,spec.name+'-menu.png')});
        await page.keyboard.press('Escape');
        assert.equal(await toggle.getAttribute('aria-expanded'),'false');
        assert.ok(await toggle.evaluate(e=>e===document.activeElement));
        await toggle.press('Enter');
        await page.waitForFunction(()=>document.activeElement===document.querySelector('#header-menu .menu-item'));
        await act(menu.getByRole('button',{name:'🏆 Competições',exact:true}));
        await page.locator('#competicoes').waitFor({state:'visible'});
        assert.equal(await page.locator('#eventos-cta a').getAttribute('href'),'mural/');
        assert.equal(await toggle.getAttribute('aria-expanded'),'false');
        // Verify the fixed controls still receive input after scrolling.
        const nav=page.locator('.asf-bottom-nav a');
        assert.deepEqual(await nav.evaluateAll(es=>es.map(e=>new URL(e.href).pathname)),['/index.html','/previsao-surf/','/mural/','/diario/','/carteirinhas.html']);
        for(const link of await nav.all()) assert.ok(await hitTarget(link),'fixed footer target');
        const network=page.locator('#asf-sat-nav'), panel=page.locator('#asf-sat-nav-panel'), gallery=page.locator('#asf-galeria-btn a');
        assert.ok(await hitTarget(gallery),'gallery target');
        assert.equal(await gallery.getAttribute('href'),'https://galeria.asf.surf/');
        assert.ok(await hitTarget(network),'network target');
        for(const close of ['escape','button','outside']) {
          await act(network);
          await panel.waitFor({state:'visible'});
          await page.waitForFunction(()=>document.getElementById('asf-sat-nav-panel').contains(document.activeElement));
          assert.equal(await network.getAttribute('aria-expanded'),'true');
          assert.equal(await gallery.getAttribute('aria-hidden'),'true');
          const controls=panel.locator('button,a[href]');
          await controls.last().focus();
          await page.keyboard.press('Tab');
          assert.ok(await controls.first().evaluate(e=>e===document.activeElement));
          await page.keyboard.press('Shift+Tab');
          assert.ok(await controls.last().evaluate(e=>e===document.activeElement));
          if(close==='escape') {
            await page.screenshot({path:path.join(output,spec.name+'-network.png')});
            await page.keyboard.press('Escape');
          } else if(close==='button') await act(panel.getByRole('button',{name:'Fechar catálogo da Rede ASF',exact:true}));
          else await page.locator('#asf-sat-nav-backdrop').click({position:{x:2,y:2}});
          await panel.waitFor({state:'hidden'});
          await page.waitForFunction(()=>document.activeElement===document.getElementById('asf-sat-nav'));
          assert.equal(await gallery.getAttribute('aria-hidden'),null);
          assert.ok(await hitTarget(gallery),'gallery restored');
        }
        // Follow actual footer clicks; later responses are inert fixtures so no
        // external app/API is exercised or changed by this navigation regression.
        for(const [label,target] of [['Início','index.html'],['Previsão','previsao-surf/'],['Mural','mural/'],['Diário','diario/'],['Carteirinha','carteirinhas.html']]) {
          await page.route(origin+'/'+target, route=>route.fulfill({status:200,contentType:'text/html',body:'<h1>Navigation target</h1>'}));
          await act(page.locator('.asf-bottom-nav').getByRole('link',{name:label,exact:true}));
          await page.waitForURL(origin+'/'+target);
          await page.unroute(origin+'/'+target);
          await page.goto(origin+'/index.html');
          await page.locator('#asf-explore-directory').waitFor();
        }
        results.push({case:spec.name,status:'passed'});
        console.log('PASS '+spec.name+': menu, keyboard, competitions, network, gallery, five footer clicks');
      } catch(error) {
        results.push({case:spec.name,status:'failed',message:error.message});
        await page.screenshot({path:path.join(output,spec.name+'-failure.png'),timeout:3000}).catch(()=>{});
        throw error;
      } finally {await context.close();}
    }
  } finally {
    fs.writeFileSync(path.join(output,'results.json'),JSON.stringify(results,null,2));
    if(browser) await browser.close();
    await new Promise(resolve=>server.close(resolve));
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
