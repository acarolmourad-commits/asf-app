// Isolated regression tests: no browser, network, storage or WhatsApp send.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(process.env.HOME_REVIEW_SCRIPT || path.join(__dirname, '../assets/js/inline/asf-inline-06.js'), 'utf8');
const match = source.match(/window\.enviarCadastroParceiro = function \(\) \{([\s\S]*?)\n    \};/);
assert.ok(match, 'Expected the scoped partner handler');
function fixture() {
  const fields = Object.fromEntries(['nome','insta','site','logo','consentimento'].map(k => ['parceiro-'+k, {value:'',checked:false,focus(){this.focused=true;}}]));
  const opened = []; const status = {};
  const context = {URL,encodeURIComponent,status,document:{getElementById:id=>fields[id]},window:{open:(...args)=>opened.push(args)},say:(text,field)=>{status.textContent=text;if(field)field.focus();return false;}};
  vm.createContext(context);
  vm.runInContext('window.handler = function () {'+match[1]+'\n};',context);
  return {fields,opened,status,context,run:()=>context.window.handler()};
}
test('missing name prevents opening',()=>{const f=fixture();assert.equal(f.run(),false);assert.equal(f.opened.length,0);assert.match(f.status.textContent,/nome/);});
test('consent is required',()=>{const f=fixture();f.fields['parceiro-nome'].value='Marca de teste';assert.equal(f.run(),false);assert.equal(f.opened.length,0);assert.match(f.status.textContent,/autorização/);});
test('rejects unsafe or incomplete URLs',()=>{for(const key of ['site','logo'])for(const value of ['javascript:alert(1)','data:text/plain,test','example.com']){const f=fixture();f.fields['parceiro-nome'].value='Marca de teste';f.fields['parceiro-'+key].value=value;f.fields['parceiro-consentimento'].checked=true;assert.equal(f.run(),false);assert.equal(f.opened.length,0);}});
test('enforces field length limits',()=>{const f=fixture();f.fields['parceiro-nome'].value='x'.repeat(121);assert.equal(f.run(),false);assert.equal(f.opened.length,0);});
test('valid proposal prepares an encoded message without claiming delivery',()=>{const f=fixture();f.fields['parceiro-nome'].value='Teste & colaboração';f.fields['parceiro-site'].value='https://example.com/';f.fields['parceiro-consentimento'].checked=true;assert.equal(f.run(),true);assert.equal(f.opened.length,1);const [href,target,features]=f.opened[0];assert.equal(target,'_blank');assert.equal(features,'noopener,noreferrer');const url=new URL(href);assert.equal(url.origin,'https://wa.me');assert.match(url.searchParams.get('text'),/Teste & colaboração/);assert.doesNotMatch(url.searchParams.get('text'),/comprovante|PIX|Revisar e ativar/i);assert.match(f.status.textContent,/confirme o envio/);});
test('preview blocks even programmatic invocation',()=>{const f=fixture();f.context.window.ASF_HOME_REVIEW_PREVIEW=true;f.fields['parceiro-nome'].value='Marca de teste';f.fields['parceiro-consentimento'].checked=true;assert.equal(f.run(),false);assert.equal(f.opened.length,0);assert.match(f.status.textContent,/desativado/);});
test('handler does not persist registration or request payment',()=>{assert.doesNotMatch(match[1],/localStorage|sessionStorage|comprovante|PIX/);});
