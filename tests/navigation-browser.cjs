// Browser regression: real homepage layout/scripts, isolated from external APIs.
// Usage: NODE_PATH=<playwright install>/node_modules node tests/navigation-browser.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'test-results/navigation');
const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.webp':'image/webp'};
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  let file = path.resolve(root, '.' + pathname);
  if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404).end(); return; }
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
const menuTargets = [...fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/class="menu-item" onclick="showSection\('([^']+)'\)[^"]*">([\s\S]*?)<\/button>/g)].map(m=>({id:m[1],label:m[2].replace(/<[^>]*>/g,'').trim()}));
const pageTargets = [...fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/class="menu-item" onclick="(?:window\.)?location\.href='([^']+)'[^"]*">([\s\S]*?)<\/button>/g)].map(m=>({href:m[1],label:m[2].replace(/<[^>]*>/g,'').trim()}));
async function waitFor(check, label) {
  for (let i=0;i<40;i++) { if(await check()) return; await new Promise(r=>setTimeout(r,50)); }
  throw Error(label);
}
async function hitCheck(locator) {
  return locator.evaluateAll(els=>els.map(el=>{const r=el.getBoundingClientRect(); const hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2); return {label:el.getAttribute('aria-label')||el.textContent.trim(),reachable:!!hit&&el.contains(hit),target:hit?.id||hit?.tagName};}));
}
(async()=>{
  fs.mkdirSync(output,{recursive:true});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const origin='http://127.0.0.1:'+server.address().port;
  const browser=await chromium.launch({headless:true,...(process.env.ASF_CHROMIUM_PATH?{executablePath:process.env.ASF_CHROMIUM_PATH}:{})});
  const summary=[];
  try {
    const noJS=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
    const fallbackPage=await noJS.newPage();
    await fallbackPage.route('**/*',r=>new URL(r.request().url()).origin===origin?r.continue():r.abort());
    await fallbackPage.goto(origin+'/');
    assert.equal(await fallbackPage.locator('.asf-bottom-nav a[href]').count(),5,'Five native links without JavaScript');
    assert.ok((await hitCheck(fallbackPage.locator('.asf-bottom-nav a'))).every(x=>x.reachable),'No-script bottom navigation remains tappable');
    await noJS.close();
    for (const width of [390,768,1365]) {
      const context=await browser.newContext({viewport:{width,height:844},isMobile:width<600,hasTouch:width<600,reducedMotion:'reduce',serviceWorkers:'block'});
      await context.route('**/*',route=> {
        const request=route.request();
        if (new URL(request.url()).origin===origin) return route.continue();
        // Confirm destination URLs without fetching third-party data or submitting forms.
        if (request.isNavigationRequest()) return route.fulfill({status:200,contentType:'text/html',body:'<h1>Destino externo de navegação</h1>'});
        return route.abort();
      });
      const page=await context.newPage();
      const errors=[]; page.on('pageerror',e=>errors.push(e.message));
      page.on('console',m=>{if(m.type()==='error' && /asf-ux:/.test(m.text())) errors.push(m.text());});
      const click=async locator=>width<600?locator.tap():locator.click();
      async function home() {
        await page.goto(origin+'/');
        await page.locator('#asf-explore-directory').waitFor();
        await page.locator('.asf-bottom-nav').waitFor();
        const consent=page.getByRole('button',{name:'Somente essenciais',exact:true});
        if(await consent.isVisible()) await click(consent);
      }
      try {
        await home();
        assert.equal(await page.locator('.asf-bottom-nav').count(),1);
        for(const location of ['top','bottom']) {
          await page.evaluate(position=>window.scrollTo(0,position==='bottom'?document.body.scrollHeight:0),location);
          await waitFor(async()=> (await hitCheck(page.locator('#menu-toggle,.asf-bottom-nav > a'))).every(x=>x.reachable),`Unreachable controls at ${width}px/${location}: ${JSON.stringify(await hitCheck(page.locator('#menu-toggle,.asf-bottom-nav > a')))}`);
          await click(page.locator('#menu-toggle'));
          await page.locator('#header-menu.open').waitFor();
          await waitFor(()=>page.locator('#menu-toggle').getAttribute('aria-expanded').then(x=>x==='true'),'Menu ARIA state');
          assert.equal(await page.locator('#header-menu .menu-item').count(),23);
          await page.locator('#header-menu .menu-item').first().press('End');
          assert.equal(await page.locator('#header-menu .menu-item').last().evaluate(e=>e===document.activeElement),true);
          await page.locator('#header-menu .menu-item').last().press('Escape');
          await page.locator('#header-menu.open').waitFor({state:'hidden'});
          assert.equal(await page.locator('#menu-toggle').evaluate(e=>e===document.activeElement),true);
        }
        // Every internal menu action must reveal its original section and close the menu.
        for(const target of menuTargets) {
          await click(page.locator('#menu-toggle'));
          await click(page.locator('#header-menu').getByRole('button',{name:target.label,exact:true}));
          await page.locator('#header-menu.open').waitFor({state:'hidden'});
          assert.equal(await page.locator('#'+target.id).isVisible(),true,`Hidden target ${target.id} at ${width}px`);
        }
        await home();
        await page.screenshot({path:path.join(output,`home-${width}.png`)});
        await click(page.locator('#menu-toggle'));
        await page.locator('#header-menu.open').waitFor();
        await page.screenshot({path:path.join(output,`menu-${width}.png`)});
        await page.locator('#header-menu .menu-item').first().press('Escape');
        for (const target of pageTargets) {
          await home();
          await click(page.locator('#menu-toggle'));
          await click(page.locator('#header-menu').getByRole('button',{name:target.label,exact:true}));
          const expected=target.href==='previsao-surf/'?'https://previsao.asf.surf/':new URL(target.href,origin+'/').href;
          await page.waitForURL(expected);
        }
        const destinations=[['Início','/index.html'],['Previsão','https://previsao.asf.surf/'],['Mural','/mural/'],['Diário','/diario/'],['Carteirinha','/emitir.html']];
        for(const [label,target] of destinations) {
          await home();
          await click(page.locator('.asf-bottom-nav').getByRole('link',{name:label,exact:true}));
          await page.waitForURL(target.startsWith('https:')?target:origin+target);
        }
        assert.deepEqual(errors.filter(e=>/lq is not defined|asf-ux:/.test(e)),[]);
        summary.push({width,menuItems:23,internalActions:menuTargets.length,pageActions:pageTargets.length,bottomDestinations:5,hitTargets:'top and bottom',status:'passed'});
      } catch(error) {
        await page.screenshot({path:path.join(output,`failure-${width}.png`),fullPage:true});
        throw error;
      } finally {await context.close();}
    }
    fs.writeFileSync(path.join(output,'results.json'),JSON.stringify(summary,null,2));
    console.log(JSON.stringify(summary,null,2));
  } finally {await browser.close();server.close();}
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
