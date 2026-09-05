const messages = {
  'zh-Hans': {
    mainSite: '主站', docs: '文档', guide: '数据百科', contribute: '申请收录',
    title: '寻找并安装 CCB MOD', intro: '这里同时收录 CCB 维护的外部 MOD 和作者自行维护的社区 MOD。',
    searchLabel: '搜索 MOD', search: '搜索名称、ID、简介或作者', all: '全部', maintained: 'CCB 维护', community: '民间维护',
    startPlaying: '下载启动器 / 安装说明', howToPlay: '安装了，怎样开始玩？',
    play1: '在启动器选择 CCB，安装与你选的 MOD 对应的完整 Candidate 版本。',
    play2: '打开 MOD 标签，选择 CCB 维护或民间维护，查看适配版本后安装。',
    play3: '启动游戏，创建新世界，在 MOD 列表里启用已安装的 MOD，再创建角色。安装不等于启用。',
    play4: '按每张卡片里的“怎么玩”确认效果。不要直接在重要存档里试装或移除 MOD。',
    trust: 'Lua MOD 是受信任的本地代码，不是安全沙箱。只安装你信任的来源；“收录”和“已验证”都不代表安全保证。',
    sort: '排序', recent: '最近更新', byName: '名称', retry: '重新加载', details: '版本、作者与适配信息', playNotes: '怎么玩：',
    communityEmpty: '暂时还没有作者提交并通过审核的民间 MOD。你的 MOD 可以成为第一批。', count: '显示 {n} / {total} 个 MOD', noLua: '不要求 Lua',
    loading: '正在读取 MOD 列表……', empty: '没有符合条件的 MOD。', failed: 'MOD 列表读取失败，请稍后重试。',
    version: 'MOD 版本', ccbVersion: '适配 CCB', authors: '原作者', maintainers: '维护者', adapters: '适配人',
    dependencies: '依赖', conflicts: '冲突', license: '许可证', updated: '更新时间', checked: '验证时间',
    download: '下载 ZIP', source: '查看源码', issues: '反馈问题', none: '暂无',
    passed: '已验证', failedStatus: '验证失败', notTested: '未验证'
  },
  en: {
    mainSite: 'Main site', docs: 'Docs', guide: 'Game data', contribute: 'Submit a MOD',
    title: 'Find and install CCB MODs', intro: 'Browse external MODs maintained by CCB and community MODs maintained by their authors.',
    searchLabel: 'Search MODs', search: 'Search names, descriptions, or authors', all: 'All', maintained: 'CCB maintained', community: 'Community',
    startPlaying: 'Get the launcher / Installation guide', howToPlay: 'Installed — how do I play?',
    play1: 'Select CCB in the launcher and install the exact Candidate version supported by your MOD.',
    play2: 'Open the MOD tab, choose CCB maintained or Community, check compatibility, then install.',
    play3: 'Launch the game, create a new world, enable the installed MODs in its MOD list, then create a character. Installed does not mean enabled.',
    play4: 'Follow each card’s How to play instructions to check the result. Do not test adding or removing MODs on important saves.',
    trust: 'Lua MODs run trusted local code, not in a security sandbox. Only install sources you trust; listing and verification are not safety guarantees.',
    sort: 'Sort', recent: 'Recently updated', byName: 'Name', retry: 'Reload', details: 'Version, credits and compatibility', playNotes: 'How to play: ',
    communityEmpty: 'No author-submitted community MODs have been approved yet. Yours could be among the first.', count: 'Showing {n} / {total} MODs', noLua: 'Lua not required',
    loading: 'Loading the MOD catalog…', empty: 'No MODs match these filters.', failed: 'The MOD catalog could not be loaded. Try again later.',
    version: 'MOD version', ccbVersion: 'CCB compatibility', authors: 'Authors', maintainers: 'Maintainers', adapters: 'CCB adapters',
    dependencies: 'Dependencies', conflicts: 'Conflicts', license: 'License', updated: 'Updated', checked: 'Validated',
    download: 'Download ZIP', source: 'View source', issues: 'Report an issue', none: 'None',
    passed: 'Verified', failedStatus: 'Failed validation', notTested: 'Not tested'
  }
};

let savedLanguage;
try { savedLanguage = localStorage.getItem('ccb-mod-language'); } catch { /* Storage may be disabled. */ }
const params = new URLSearchParams(location.search);
let language = params.get('lang') || savedLanguage || (navigator.language.startsWith('zh') ? 'zh-Hans' : 'en');
if (!messages[language]) language = 'en';
let selectedType = ['community', 'ccb-maintained'].includes(params.get('type')) ? params.get('type') : 'all';
let mods = [];
let loadState = 'loading';

function text(key) { return messages[language][key]; }
function localized(value) { return value[language] || value['zh-Hans'] || value.en || ''; }

function translate(root = document) {
  document.documentElement.lang = language;
  root.querySelectorAll('[data-i18n]').forEach((node) => { node.textContent = text(node.dataset.i18n); });
  root.querySelectorAll('[data-i18n-placeholder]').forEach((node) => { node.placeholder = text(node.dataset.i18nPlaceholder); });
  document.querySelectorAll('[data-lang]').forEach((button) => button.classList.toggle('active', button.dataset.lang === language));
  document.querySelectorAll('[data-type]').forEach((button) => {
    button.classList.toggle('active', button.dataset.type === selectedType);
    button.setAttribute('aria-pressed', String(button.dataset.type === selectedType));
    const count = button.dataset.type === 'all' ? mods.length : mods.filter(m => m.type === button.dataset.type).length;
    button.textContent = text(button.dataset.i18n) + ' (' + count + ')';
  });
  document.querySelector('#play-link').href = 'https://crimsoncrossbunker.github.io/' + (language === 'en' ? 'en/' : '') + 'mods';
  document.querySelectorAll('a[href^="submit.html"]').forEach(a => { a.href = 'submit.html?lang=' + language; });
}

function render() {
  const filtered = CatalogCore.select(mods, selectedType, document.querySelector('#search').value, document.querySelector('#sort').value, language);
  const catalog = document.querySelector('#catalog');
  catalog.replaceChildren();
  const template = document.querySelector('#card-template');
  filtered.forEach((mod) => {
    const card = template.content.cloneNode(true);
    translate(card);
    card.querySelector('.kind').textContent = mod.type === 'ccb-maintained' ? text('maintained') : text('community');
    const validation = card.querySelector('.validation');
    validation.textContent = mod.validation.status === 'passed' ? text('passed') : (mod.validation.status === 'failed' ? text('failedStatus') : text('notTested'));
    validation.dataset.status = mod.validation.status;
    card.querySelector('article').id = mod.id;
    card.querySelector('.permalink').textContent = localized(mod.name);
    card.querySelector('.permalink').href = '#' + mod.id;
    card.querySelector('.description').textContent = localized(mod.description);
    card.querySelector('.play-notes').textContent = mod.play_notes ? text('playNotes') + localized(mod.play_notes) : '';
    card.querySelector('.play-notes').hidden = !mod.play_notes;
    card.querySelector('.version').textContent = mod.version;
    card.querySelector('.ccb-version').textContent = mod.ccb_versions.join(', ');
    card.querySelector('.lua-api').textContent = mod.lua_api || text('noLua');
    card.querySelector('.authors').textContent = mod.authors.join(', ') || text('none');
    card.querySelector('.maintainers').textContent = mod.maintainers.join(', ') || text('none');
    card.querySelector('.adapters').textContent = mod.ccb_adapters.join(', ') || text('none');
    card.querySelector('.dependencies').textContent = mod.dependencies.join(', ');
    card.querySelector('.dependencies-row').hidden = mod.dependencies.length === 0;
    card.querySelector('.conflicts').textContent = mod.conflicts.join(', ');
    card.querySelector('.conflicts-row').hidden = mod.conflicts.length === 0;
    card.querySelector('.license').textContent = mod.license;
    card.querySelector('.updated').textContent = mod.updated_at;
    card.querySelector('.checked').textContent = [mod.validation.ccb_version, mod.validation.checked_at].filter(Boolean).join(' · ') || text('none');
    for (const key of ['download', 'source', 'issues']) {
      const link = card.querySelector('.' + key);
      if (CatalogCore.https(mod[key])) link.href = mod[key];
      else link.hidden = true;
    }
    catalog.append(card);
  });
  const status = document.querySelector('#status');
  status.textContent = loadState === 'failed' ? text('failed') : loadState === 'loading' ? text('loading') : filtered.length ? text('count').replace('{n}', filtered.length).replace('{total}', mods.length) : text('empty');
  document.querySelector('#retry').hidden = loadState !== 'failed';
  document.querySelector('#community-empty').hidden = loadState !== 'ready' || selectedType !== 'community' || mods.some(m => m.type === 'community');
}

document.querySelectorAll('[data-lang]').forEach((button) => button.addEventListener('click', () => {
  language = button.dataset.lang;
  try { localStorage.setItem('ccb-mod-language', language); } catch { /* Optional preference. */ }
  translate();
  render();
}));
document.querySelectorAll('[data-type]').forEach((button) => button.addEventListener('click', () => {
  selectedType = button.dataset.type;
  translate();
  render();
}));
document.querySelector('#search').addEventListener('input', render);
document.querySelector('#sort').addEventListener('change', render);
document.querySelector('#retry').addEventListener('click', loadCatalog);

translate();
function loadCatalog() {
  loadState = 'loading'; render();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  fetch('mods.json', { cache: 'no-cache', signal: controller.signal })
  .then((response) => { if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.json(); })
  .then((catalog) => {
    if (catalog.schema_version !== 1 || !Array.isArray(catalog.mods)) throw new Error('Invalid catalog');
    mods = catalog.mods; loadState = 'ready'; translate(); render();
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
  })
  .catch((error) => { console.error(error); loadState = 'failed'; render(); })
  .finally(() => clearTimeout(timeout));
}
loadCatalog();
