const messages = {
  'zh-Hans': {
    mainSite: '主站', docs: '文档', guide: '数据百科', contribute: '登记 / 贡献',
    title: '寻找并安装 CCB MOD', intro: '这里同时收录 CCB 维护的外部 MOD 和作者自行维护的社区 MOD。',
    searchLabel: '搜索 MOD', search: '搜索名称、简介或作者', all: '全部', maintained: 'CCB 维护', community: '社区维护',
    loading: '正在读取 MOD 列表……', empty: '没有符合条件的 MOD。', failed: 'MOD 列表读取失败，请稍后重试。',
    version: 'MOD 版本', ccbVersion: '适配 CCB', authors: '原作者', maintainers: '维护者', adapters: '适配人',
    dependencies: '依赖', conflicts: '冲突', license: '许可证', updated: '更新时间', checked: '验证时间',
    download: '下载 ZIP', source: '查看源码', issues: '反馈问题', none: '暂无',
    passed: '已验证', failedStatus: '验证失败', notTested: '未验证'
  },
  en: {
    mainSite: 'Main site', docs: 'Docs', guide: 'Game data', contribute: 'Register / contribute',
    title: 'Find and install CCB MODs', intro: 'Browse external MODs maintained by CCB and community MODs maintained by their authors.',
    searchLabel: 'Search MODs', search: 'Search names, descriptions, or authors', all: 'All', maintained: 'CCB maintained', community: 'Community',
    loading: 'Loading the MOD catalog…', empty: 'No MODs match these filters.', failed: 'The MOD catalog could not be loaded. Try again later.',
    version: 'MOD version', ccbVersion: 'CCB compatibility', authors: 'Authors', maintainers: 'Maintainers', adapters: 'CCB adapters',
    dependencies: 'Dependencies', conflicts: 'Conflicts', license: 'License', updated: 'Updated', checked: 'Validated',
    download: 'Download ZIP', source: 'View source', issues: 'Report an issue', none: 'None',
    passed: 'Verified', failedStatus: 'Failed validation', notTested: 'Not tested'
  }
};

let language = localStorage.getItem('ccb-mod-language') || (navigator.language.startsWith('zh') ? 'zh-Hans' : 'en');
let selectedType = 'all';
let mods = [];

function text(key) { return messages[language][key]; }
function localized(value) { return value[language] || value['zh-Hans'] || value.en || ''; }

function translate(root = document) {
  document.documentElement.lang = language;
  root.querySelectorAll('[data-i18n]').forEach((node) => { node.textContent = text(node.dataset.i18n); });
  root.querySelectorAll('[data-i18n-placeholder]').forEach((node) => { node.placeholder = text(node.dataset.i18nPlaceholder); });
  document.querySelectorAll('[data-lang]').forEach((button) => button.classList.toggle('active', button.dataset.lang === language));
}

function render() {
  const query = document.querySelector('#search').value.trim().toLocaleLowerCase(language);
  const filtered = mods.filter((mod) => {
    if (selectedType !== 'all' && mod.type !== selectedType) return false;
    const haystack = [localized(mod.name), localized(mod.description), ...mod.authors, ...mod.maintainers].join(' ').toLocaleLowerCase(language);
    return haystack.includes(query);
  });
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
    card.querySelector('h2').textContent = localized(mod.name);
    card.querySelector('.description').textContent = localized(mod.description);
    card.querySelector('.version').textContent = mod.version;
    card.querySelector('.ccb-version').textContent = mod.ccb_versions.join(', ');
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
    card.querySelector('.download').href = mod.download;
    card.querySelector('.source').href = mod.source;
    card.querySelector('.issues').href = mod.issues;
    catalog.append(card);
  });
  const status = document.querySelector('#status');
  status.textContent = filtered.length ? '' : text('empty');
}

document.querySelectorAll('[data-lang]').forEach((button) => button.addEventListener('click', () => {
  language = button.dataset.lang;
  localStorage.setItem('ccb-mod-language', language);
  translate();
  render();
}));
document.querySelectorAll('[data-type]').forEach((button) => button.addEventListener('click', () => {
  selectedType = button.dataset.type;
  document.querySelectorAll('[data-type]').forEach((item) => item.classList.toggle('active', item === button));
  render();
}));
document.querySelector('#search').addEventListener('input', render);

translate();
fetch('mods.json', { cache: 'no-cache' })
  .then((response) => { if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.json(); })
  .then((catalog) => { mods = catalog.mods || []; render(); })
  .catch((error) => { console.error(error); document.querySelector('#status').textContent = text('failed'); });
