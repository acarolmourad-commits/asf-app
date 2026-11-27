const assert = require('node:assert/strict');

module.exports = async function verifyGearReturn(browser, origin, viewport) {
 const tool = origin + '/devolucao-equipamento/';
 for (const mode of ['normal', 'no-storage', 'no-js']) {
  const context = await browser.newContext({
   viewport, javaScriptEnabled: mode !== 'no-js', serviceWorkers: 'block'
  });
  try {
   await context.route('**/*', route => route.request().url().startsWith(origin+'/') ? route.continue() : route.abort());
   if (mode === 'no-storage') {
    await context.addInitScript(() => {
     Object.defineProperty(window, 'sessionStorage', {get() { throw new DOMException('disabled', 'SecurityError'); }});
    });
   }
   const page = await context.newPage();
   if (mode === 'normal') {
    await page.goto(origin+'/apps/#roteiro');
    const entrance = page.getByRole('link',{name:'conferência de devolução',exact:true});
    await entrance.press('Enter');
    await page.waitForURL(tool);
   } else {
    await page.goto(tool);
   }
   assert.equal(await page.getByRole('heading',{level:1}).textContent(), 'Conferência de devolução do equipamento');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1), true);
   const pt = page.locator('fieldset[data-lang="pt"]');
   const en = page.locator('fieldset[data-lang="en"]');
   const board = pt.getByLabel('Prancha',{exact:true});
   assert.equal(await pt.getByRole('combobox').count(),6);
   assert.equal(await board.inputValue(),'pending');
   if (mode === 'no-js') {
    assert.equal(await pt.getByRole('status').count(),0);
    assert.match(await page.locator('noscript').first().textContent(),/Você pode marcar/);
    await board.selectOption('done');
    assert.equal(await board.inputValue(),'done');
    await page.locator('#english summary').press('Enter');
    assert.equal(await en.getByLabel('Surfboard',{exact:true}).isVisible(),true);
    continue;
   }
   assert.match(await pt.getByRole('status').textContent(), /^A conferir: 6/);
   await board.press('ArrowDown');
   await board.press('Enter');
   assert.equal(await board.inputValue(),'done');
   await pt.getByLabel('Quilhas removíveis',{exact:true}).selectOption('na');
   assert.match(await pt.getByRole('status').textContent(), /A conferir: 4 .* devolvidos: 1 .* aplica: 1/);
   await page.locator('#english summary').press('Enter');
   assert.equal(await en.getByLabel('Surfboard',{exact:true}).inputValue(),'done');
   await en.getByLabel('Leash',{exact:true}).selectOption('done');
   assert.equal(await pt.getByLabel('Leash',{exact:true}).inputValue(),'done');
   assert.match(await en.getByRole('status').textContent(), /To check: 3 .* returned: 2 .* applicable: 1/);
   if (mode === 'no-storage') {
    assert.match(await pt.locator('[data-storage-note]').textContent(),/não conseguiu guardar/);
   } else {
    await page.reload();
    assert.equal(await board.inputValue(),'done');
    assert.equal(await pt.getByLabel('Quilhas removíveis',{exact:true}).inputValue(),'na');
    await page.goto(tool+'#english');
    assert.equal(await en.isVisible(),true);
   }
   const reset = pt.getByRole('button',{name:'Limpar marcações'});
   await reset.press('Enter');
   assert.match(await pt.getByRole('status').textContent(),/^A conferir: 6/);
   assert.equal(await pt.getByLabel('Prancha',{exact:true}).inputValue(),'pending');
   assert.equal(await reset.evaluate(node=>node===document.activeElement),true);
   assert.match(await page.locator('p.note').first().textContent(),/Não comprova a devolução/);
   await pt.locator('xpath=..').getByRole('link',{name:'Voltar ao roteiro da sessão',exact:true}).click();
   await page.waitForURL(origin+'/apps/#roteiro');
  } finally {
   await context.close();
  }
 }
 console.log('Surf gear return: production entry parity, PT/EN, keyboard, reset, reload, blocked storage, no JS and no horizontal overflow at '+viewport.width+'px.');
};
