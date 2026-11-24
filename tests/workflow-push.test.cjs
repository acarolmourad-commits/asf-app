// Execute only extracted retry logic with fake git/sleep functions. No real git or network.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const workflow = fs.readFileSync(path.join(__dirname, '../.github/workflows/main.yml'), 'utf8');
const blocks = [...workflow.matchAll(/            pushed=false\n[\s\S]*?            fi\n            echo "✅[^\n]+/g)].map(m=>m[0]);
test('both publishing jobs use an explicit bounded success guard without force',()=>{
  assert.equal(blocks.length,2);assert.doesNotMatch(blocks.join('\n'),/--force|reset --hard/);
});
for(const [idx,block] of blocks.entries()) {
  for(const succeedsOn of [1,5,99]) test(`job ${idx+1}: mocked push success on attempt ${succeedsOn}`,()=>{
    const stub=`attempt=0\npython3() { return 0; }\ngit() { if [ "$1" = pull ]; then attempt=$((attempt+1)); return 0; elif [ "$1" = push ]; then echo "ATTEMPT:$attempt"; [ "$attempt" -ge ${succeedsOn} ]; else return 0; fi; }\nsleep() { :; }\n`;
    const result=spawnSync('bash',['-e','-c',stub+block],{encoding:'utf8'});
    assert.equal(result.status,succeedsOn<=5?0:1);
    assert.equal((result.stdout.match(/ATTEMPT:/g)||[]).length,Math.min(succeedsOn,5));
    if(succeedsOn>5){assert.match(result.stdout,/::error::/);assert.doesNotMatch(result.stdout,/✅/);}else assert.match(result.stdout,/✅/);
  });
  test(`job ${idx+1}: rebase conflicts fail instead of pretending to publish`,()=>{
    const stub='git() { if [ "$1" = pull ]; then return 1; elif [ "$1" = push ]; then echo UNEXPECTED_PUSH; return 0; else return 0; fi; }\nsleep() { :; }\n';
    const result=spawnSync('bash',['-e','-c',stub+block],{encoding:'utf8'});
    assert.equal(result.status,1);assert.doesNotMatch(result.stdout,/UNEXPECTED_PUSH|✅/);
  });
}
test('daily job regenerates and checks rebased catalog before pushing',()=>{
  const block=blocks[1];
  assert.ok(block.indexOf('git pull --rebase')<block.indexOf('python3 scripts/generate_surf_tips.py'));
  assert.ok(block.indexOf('python3 scripts/generate_surf_tips.py --check')<block.indexOf('git push origin'));
  const stub='git() { if [ "$1" = push ]; then echo UNEXPECTED_PUSH; fi; return 0; }\npython3() { return 1; }\nsleep() { :; }\n';
  const result=spawnSync('bash',['-e','-c',stub+block],{encoding:'utf8'});
  assert.equal(result.status,1);assert.doesNotMatch(result.stdout,/UNEXPECTED_PUSH|✅/);assert.match(result.stdout,/nothing was pushed/);
});
