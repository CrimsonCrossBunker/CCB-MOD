/* Shared, dependency-free catalog and submission logic. JSON is valid YAML 1.2. */
(function (root) {
  'use strict';
  function https(value) {
    try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password; }
    catch { return false; }
  }
  function select(mods, type, query, sort, language) {
    const needle = query.trim().toLocaleLowerCase(language);
    return mods.filter(mod => (type === 'all' || mod.type === type) &&
      [mod.id, ...Object.values(mod.name), ...Object.values(mod.description), ...mod.authors, ...mod.maintainers, ...mod.ccb_adapters]
        .join(' ').toLocaleLowerCase(language).includes(needle))
      .sort((a, b) => sort === 'name'
        ? (a.name[language] || a.name.en || a.id).localeCompare(b.name[language] || b.name.en || b.id, language)
        : b.updated_at.localeCompare(a.updated_at) || a.id.localeCompare(b.id));
  }
  function submission(values) {
    const list = key => [...new Set((values[key] || '').split(/[,，\n]/).map(s => s.trim()).filter(Boolean))];
    const localized = key => Object.fromEntries([['zh-Hans', values[key + '_zh']], ['en', values[key + '_en']]].filter(([, v]) => v && v.trim()).map(([k, v]) => [k, v.trim()]));
    if (!/^[A-Za-z0-9][A-Za-z0-9_-]{1,63}$/.test(values.id)) throw new Error('id');
    if (!/^[A-Za-z0-9][A-Za-z0-9._+-]{0,63}$/.test(values.version)) throw new Error('version');
    for (const key of ['source', 'issues', 'download']) if (!https(values[key])) throw new Error(key);
    if (!Object.keys(localized('name')).length || !Object.keys(localized('description')).length) throw new Error('name/description');
    if (!list('authors').length || !list('maintainers').length || !values.license.trim() || !list('ccb_versions').length) throw new Error('required');
    if (values.lua_api && (!/^\d+$/.test(values.lua_api) || Number(values.lua_api) < 1)) throw new Error('lua_api');
    const entry = {
      schema_version: 1, id: values.id, type: 'community', name: localized('name'), description: localized('description'),
      version: values.version, authors: list('authors'), maintainers: list('maintainers'), ccb_adapters: list('ccb_adapters'),
      license: values.license.trim(), source: values.source, issues: values.issues, download: values.download,
      ccb_versions: list('ccb_versions'), dependencies: list('dependencies'), conflicts: list('conflicts'),
      updated_at: values.updated_at, validation: {status: 'not-tested', ccb_version: null, checked_at: null}
    };
    if (values.lua_api) entry.lua_api = Number(values.lua_api);
    if (Object.keys(localized('play_notes')).length) entry.play_notes = localized('play_notes');
    return entry;
  }
  function issueURL(entry) {
    const body = '## MOD registration / MOD 收录申请\n\n```json\n' + JSON.stringify(entry, null, 2) + '\n```\n\n## Test evidence / 测试记录\n请补充实际测试的完整游戏版本、平台、启用步骤和结果。\nPlease add the exact game version, platform, activation steps and results.\n\n- [ ] I am the author or authorized maintainer / 我是作者或获授权的维护者\n- [ ] The ZIP contains one installable MOD / ZIP 中只有一个可安装的 MOD\n- [ ] I understand this application is public and requires manual review / 我了解申请公开且需要人工审核\n';
    const url = new URL('https://github.com/CrimsonCrossBunker/CCB-MOD/issues/new');
    url.search = new URLSearchParams({template: 'mod-submission.md', title: '[MOD] ' + entry.id + ' ' + entry.version, body});
    return url.href;
  }
  const api = {https, select, submission, issueURL};
  if (typeof module !== 'undefined') module.exports = api;
  else root.CatalogCore = api;
})(typeof globalThis === 'undefined' ? this : globalThis);
