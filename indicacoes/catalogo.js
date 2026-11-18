const searchBox = document.querySelector('#busca');
const searchPanel = document.querySelector('.search');
const reset = document.querySelector('#limpar');
const statusLine = document.querySelector('#resultados');
const index = document.querySelector('.category-index');
const groups = [...document.querySelectorAll('.group')];

function normalize(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

const catalog = groups.map(group => {
  const category = group.querySelector('h3').textContent;
  const entries = [...group.querySelectorAll('.cards li')].map(item => ({
    item,
    terms: normalize([category, item.querySelector('h4').textContent, item.querySelector('p').textContent, item.dataset.terms || ''].join(' '))
  }));
  return {group, entries};
});

function applySearch() {
  const words = normalize(searchBox.value).trim().split(/\s+/).filter(Boolean);
  let total = 0;
  let sections = 0;
  for (const {group, entries} of catalog) {
    let visible = 0;
    for (const {item, terms} of entries) {
      item.hidden = !words.every(word => terms.includes(word));
      if (!item.hidden) visible++;
    }
    group.hidden = visible === 0;
    if (visible) sections++;
    total += visible;
  }
  reset.hidden = !searchBox.value;
  statusLine.textContent = total
    ? total + (total === 1 ? ' indicação em ' : ' indicações em ') + sections + (sections === 1 ? ' categoria.' : ' categorias.')
    : 'Nenhuma indicação encontrada. Tente outra palavra, como “quilhas” ou “neoprene”.';
}

function clearSearch() {
  searchBox.value = '';
  applySearch();
}

searchPanel.hidden = false;
searchBox.addEventListener('input', applySearch);
reset.addEventListener('click', () => { clearSearch(); searchBox.focus(); });
const compact = window.matchMedia('(max-width: 52rem)');
function sizeIndex() { index.open = !compact.matches; }
sizeIndex();
compact.addEventListener('change', sizeIndex);
index.addEventListener('click', event => {
  if (event.target.closest('a[href^="#"]')) {
    clearSearch();
    if (compact.matches) index.open = false;
  }
});
window.addEventListener('hashchange', () => {
  const group = groups.find(section => '#' + section.id === location.hash);
  if (group && group.hidden) {
    clearSearch();
    group.scrollIntoView();
  }
});
