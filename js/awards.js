
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenu   = document.getElementById('mobileMenu');

const navHeight = document.querySelector('.nav').offsetHeight;
mobileMenu.style.top = navHeight + 'px';

if (hamburgerBtn && mobileMenu) {
  hamburgerBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburgerBtn.setAttribute('aria-expanded', isOpen);
    const spans = hamburgerBtn.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      const spans = hamburgerBtn.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    });
  });
}


let data = {};
let currentYear = 'all';
let currentSolo = '';


async function loadData() {
  const res = await fetch('../data/awards.json');
  data      = await res.json();
  currentSolo = data.soloAwards[0].member;
  renderAll();
}

function buildAwardCard(ceremony, wins) {
  const items = wins.map(w => `<div class="award-item">${w}</div>`).join('');
  return `
    <div class="award-card">
      <div class="award-ceremony">${ceremony}</div>
      ${items}
    </div>
  `;
}

function renderGroup() {
  const years    = Object.keys(data.groupAwards).map(Number).sort((a, b) => a - b);
  const totalAll = years.reduce((s, y) => s + data.groupAwards[y].count, 0);

  document.getElementById('totalCount').textContent = totalAll + '+';

  const filterEl = document.getElementById('yearFilter');
  filterEl.innerHTML = `
    <button class="ypill active" data-year="all">ALL YEARS · ${totalAll}</button>
    ${years.map(y => `
      <button class="ypill" data-year="${y}">${y} · ${data.groupAwards[y].count}</button>
    `).join('')}
  `;

  filterEl.addEventListener('click', e => {
    const btn = e.target.closest('.ypill');
    if (!btn) return;
    document.querySelectorAll('.ypill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentYear = btn.dataset.year;
    updateGroupVisibility();
  });

const selectEl = document.getElementById('yearFilterSelect');
if (selectEl) {
  selectEl.innerHTML = `
    <option value="all">ALL YEARS · ${totalAll}</option>
    ${years.map(y => `
      <option value="${y}">${y} · ${data.groupAwards[y].count} awards</option>
    `).join('')}
  `;

  selectEl.addEventListener('change', (e) => {
    currentYear = e.target.value;

    document.querySelectorAll('.ypill').forEach(b => {
      b.classList.toggle('active', b.dataset.year === currentYear);
    });
    updateGroupVisibility();
  });
}

  document.getElementById('groupGrid').innerHTML = years.map(y => {
    const cards = data.groupAwards[y].ceremonies
      .map(c => buildAwardCard(c.ceremony, c.wins))
      .join('');
    return `
      <div class="year-block visible" data-year="${y}">
        <div class="year-header">
          <div class="year-num">${y}</div>
          <div class="year-count">${data.groupAwards[y].count} awards</div>
        </div>
        <div class="awards-grid">${cards}</div>
      </div>
    `;
  }).join('');
}

function updateGroupVisibility() {
  document.querySelectorAll('.year-block').forEach(b => {
    b.classList.toggle('visible', currentYear === 'all' || b.dataset.year === currentYear);
  });
}

function renderShows() {
  const total = data.showWins.reduce((s, w) => s + w.wins, 0);
  document.getElementById('showTotal').textContent = total;

  document.getElementById('winsGrid').innerHTML = [...data.showWins]
    .sort((a, b) => b.wins - a.wins)
    .map(w => `
      <div class="win-card">
        <div class="win-trophy">🏆</div>
        <div class="win-song">${w.song}</div>
        <div class="win-count">${w.wins}</div>
        <div class="win-label">${w.wins === 1 ? 'win' : 'wins'}</div>
      </div>
    `).join('');
}

function renderSolo() {
  const tabsEl = document.getElementById('soloTabs');
  tabsEl.innerHTML = data.soloAwards
    .map((s, i) => `
      <button class="stab${i === 0 ? ' active' : ''}" data-member="${s.member}">
        ${s.label} · ${s.count}
      </button>
    `).join('');

  tabsEl.addEventListener('click', e => {
    const btn = e.target.closest('.stab');
    if (!btn) return;
    document.querySelectorAll('.stab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentSolo = btn.dataset.member;
    updateSoloVisibility();
  });

  document.getElementById('soloGrid').innerHTML = data.soloAwards.map((s, i) => {
    const cards = s.ceremonies
      .map(c => buildAwardCard(c.ceremony, c.wins))
      .join('');
    return `
      <div class="solo-section${i === 0 ? ' visible' : ''}" data-member="${s.member}">
        <div class="solo-grid">${cards}</div>
      </div>
    `;
  }).join('');
}

function updateSoloVisibility() {
  document.querySelectorAll('.solo-section').forEach(s => {
    s.classList.toggle('visible', s.dataset.member === currentSolo);
  });
}

function initTabs() {
  document.querySelectorAll('.mtab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mtab').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('visible'));
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab).classList.add('visible');
    });
  });
}

function renderAll() {
  renderGroup();
  renderShows();
  renderSolo();
  initTabs();
}

document.addEventListener('DOMContentLoaded', loadData);