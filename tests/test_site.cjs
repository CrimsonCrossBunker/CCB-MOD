const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const core = require('../site/catalog-core.js');
const catalog = require('../site/mods.json');
const values = {id:'fixture_mod', version:'0.1.0', name_en:'A MOD', description_zh:'民间测试', authors:'Author, Author', maintainers:'Maintainer', ccb_adapters:'', license:'MIT', source:'https://example.invalid/repo', issues:'https://example.invalid/issues', download:'https://example.invalid/v1.zip', ccb_versions:'0.Ag-Candidate-2026-09-05-0219', dependencies:'dda', updated_at:'2026-09-05', lua_api:'1'};
test('generator creates community entry with truthful initial validation', () => {
  const entry = core.submission(values);
  assert.equal(entry.type, 'community');
  assert.deepEqual(entry.authors, ['Author']);
  assert.equal(entry.validation.status, 'not-tested');
  assert.equal(entry.validation.ccb_version, null);
  const url = new URL(core.issueURL(entry));
  assert.equal(url.origin, 'https://github.com');
  const manifest = JSON.parse(url.searchParams.get('body').split('```json\n')[1].split('\n```')[0]);
  assert.deepEqual(manifest, entry);
});
test('unsafe links, IDs, versions and Lua API values are rejected', () => {
  for (const change of [{source:'javascript:alert(1)'}, {download:'http://example.invalid/a.zip'}, {issues:'https://name:secret@example.invalid'}, {id:'../../bad'}, {version:'../bad'}, {lua_api:'1.5'}, {authors:''}]) assert.throws(() => core.submission({...values, ...change}));
});
test('one language is enough; JSON-only MODs omit Lua API', () => {
  const entry = core.submission({...values, lua_api:''});
  assert.equal('lua_api' in entry, false);
  assert.equal(entry.description['zh-Hans'], '民间测试');
});
test('both maintenance types and multilingual searching work', () => {
  const mods = [...catalog.mods, core.submission(values)];
  assert.equal(core.select(mods, 'community', '', 'updated', 'en').length, 1);
  assert.equal(core.select(mods, 'ccb-maintained', '', 'updated', 'en').length, 4);
  assert.equal(core.select(mods, 'all', '民间测试', 'name', 'en')[0].id, 'fixture_mod');
  assert.equal(core.select(mods, 'all', 'MAINTAINER', 'name', 'zh-Hans')[0].id, 'fixture_mod');
  assert.equal(core.select(mods, 'all', 'missing!', 'updated', 'en').length, 0);
});
test('site scripts parse and both HTML routes contain entrypoints', () => {
  for (const name of ['app.js', 'submit.js', 'catalog-core.js']) new vm.Script(fs.readFileSync(require.resolve('../site/' + name), 'utf8'));
  for (const name of ['index.html', 'submit.html']) {
    const html = fs.readFileSync(require.resolve('../site/' + name), 'utf8');
    assert.match(html, /data-lang="zh-Hans"/);
    assert.match(html, /data-lang="en"/);
    assert.match(html, /catalog-core.js/);
  }
});
