'use strict';
let savedLanguage;
try { savedLanguage = localStorage.getItem('ccb-mod-language'); } catch { /* Optional preference. */ }
let language = new URLSearchParams(location.search).get('lang') || savedLanguage || (navigator.language.startsWith('zh') ? 'zh-Hans' : 'en');
if (!['zh-Hans', 'en'].includes(language)) language = 'en';
let generatedEntry;
function translate() {
  document.documentElement.lang = language;
  document.querySelectorAll('[data-zh]').forEach(node => { node.textContent = node.dataset[language === 'en' ? 'en' : 'zh'] + (node.parentElement.matches('label') && node.parentElement.querySelector('[required]') ? ' *' : ''); });
  document.querySelectorAll('[data-lang]').forEach(button => { button.classList.toggle('active', button.dataset.lang === language); button.setAttribute('aria-pressed', String(button.dataset.lang === language)); });
  document.querySelector('#registration-guide').href = 'https://github.com/CrimsonCrossBunker/CCB-MOD/blob/main/docs/register.' + language + '.md';
  document.querySelectorAll('a[href^="./"]').forEach(link => { link.href = './?lang=' + language; });
}
document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click', () => {
  language = button.dataset.lang;
  try { localStorage.setItem('ccb-mod-language', language); } catch { /* Optional preference. */ }
  translate();
}));
const form = document.querySelector('#submission-form');
form.elements.updated_at.value = new Date().toISOString().slice(0, 10);
form.elements.dependencies.value = 'dda';
form.addEventListener('input', () => { generatedEntry = null; document.querySelector('#submission-result').hidden = true; });
form.addEventListener('submit', event => {
  event.preventDefault();
  document.querySelector('#form-error').textContent = '';
  try {
    generatedEntry = CatalogCore.submission(Object.fromEntries([...new FormData(form)].map(([k, v]) => [k, v.trim()])));
    document.querySelector('#manifest').value = JSON.stringify(generatedEntry, null, 2) + '\n';
    const url = CatalogCore.issueURL(generatedEntry);
    const tooLong = url.length > 7500;
    document.querySelector('#open-issue').hidden = tooLong;
    document.querySelector('#open-issue').href = url;
    document.querySelector('#long-application').hidden = !tooLong;
    document.querySelector('#submission-result').hidden = false;
  } catch (error) {
    generatedEntry = null;
    document.querySelector('#submission-result').hidden = true;
    document.querySelector('#form-error').textContent = (language === 'en' ? 'Please check this field: ' : '请检查字段（名称和简介至少提供一种语言）：') + error.message;
  }
});
document.querySelector('#download-manifest').addEventListener('click', () => {
  if (!generatedEntry) return;
  const url = URL.createObjectURL(new Blob([JSON.stringify(generatedEntry, null, 2) + '\n'], {type: 'application/yaml'}));
  const link = document.createElement('a');
  link.href = url; link.download = generatedEntry.id + '.yml'; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
translate();
