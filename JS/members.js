const members = {
  yeji: {
    stage:    'YEJI',
    hangul:   '황예지 (Hwang Ye-ji)',
    birth:    'May 26, 2000 · Korean',
    photoBg:  '#1a0812',
    photoTxt: '#3a0a1e',
    photoSrc: '/assets/members/yeji2.jpg',
    instagram: 'https://www.instagram.com/yezyizhere?utm_source=ig_web_button_share_sheet',
    youtube:   '',
    spotify:   'https://open.spotify.com/artist/3skli1w2n0nOZ4qkDbvV2m?si=40fttXVhSLezsjNMVAMiCw',
    roles: [
      { label: 'Leader',        main: true },
      { label: 'Main Dancer',   main: true },
      { label: 'Lead Vocalist', main: true },
      { label: 'Sub Rapper',    main: true },
    ],
    info: [
      ['Full Name',    'Hwang Ye-ji'],
      ['Stage Name',   'Yeji'],
      ['English Name', 'Lucy Hwang'],
      ['Zodiac',       'Gemini'],
    ],
  },
  lia: {
    stage:    'LIA',
    hangul:   '최지수 (Choi Ji-su)',
    birth:    'July 21, 2000 · Korean',
    photoBg:  '#0a121a',
    photoTxt: '#0a1f2e',
    photoSrc: '/assets/members/lia2.jpg',
    instagram: 'https://www.instagram.com/lia_loves___/',
    youtube:   'https://youtube.com/@liachoi_0721?si=VAJr7KIS4AK4aW3b',
    spotify:   'https://open.spotify.com/artist/19Io533x1pKQu6ZuisGek5?si=nBTcPI2NSE6E4E_9Mhe6xQ',
    roles: [
      { label: 'Main Vocalist', main: true },
      { label: 'Sub Rapper',    main: true },
    ],
    info: [
      ['Full Name',    'Choi Ji-su'],
      ['Stage Name',   'Lia'],
      ['English Name', 'Julia Choi'],
      ['Zodiac',       'Cancer'],
    ],
  },
  ryujin: {
    stage:    'RYUJIN',
    hangul:   '신류진 (Shin Ryu-jin)',
    birth:    'April 17, 2001 · Korean',
    photoBg:  '#130a1a',
    photoTxt: '#200a30',
    photoSrc: '/assets/members/ryujin2.jpg',
    instagram: 'https://www.instagram.com/iamfinethankyouandryu/',
    youtube:   '',
    spotify:   '',
    roles: [
      { label: 'Center',       main: true },
      { label: 'Main Rapper',  main: true },
      { label: 'Lead Dancer',  main: true },
      { label: 'Sub Vocalist', main: true },
    ],
    info: [
      ['Full Name',    'Shin Ryu-jin'],
      ['Stage Name',   'Ryujin'],
      ['English Name', 'Joanne Shin'],
      ['Zodiac',       'Aries'],
    ],
  },
  chaeryeong: {
    stage:    'CHAERYEONG',
    hangul:   '이채령 (Lee Chae-ryeong)',
    birth:    'June 5, 2001 · Korean',
    photoBg:  '#0a1a0f',
    photoTxt: '#0a2a14',
    photoSrc: '/assets/members/chaery2.jpg',
    instagram: 'https://www.instagram.com/chaerrry0/',
    youtube:   '',
    spotify:   'https://open.spotify.com/artist/73nPXEFs9tGCNmSOcqFHPs?si=NNJ8PtRHSROjPP-y_l77kg',
    roles: [
      { label: 'Main Dancer',  main: true },
      { label: 'Sub Vocalist', main: true },
      { label: 'Sub Rapper',   main: true },
    ],
    info: [
      ['Full Name',    'Lee Chae-ryeong'],
      ['Stage Name',   'Chaeryeong'],
      ['English Name', 'Serena Lee'],
      ['Zodiac',       'Gemini'],
    ],
  },
  yuna: {
    stage:    'YUNA',
    hangul:   '신유나 (Shin Yu-na)',
    birth:    'December 9, 2003 · Korean',
    photoBg:  '#1a1200',
    photoTxt: '#2a1c00',
    photoSrc: '/assets/members/yuna2.jpg',
    instagram: 'https://www.instagram.com/igotyuandme/',
    youtube:   'https://youtube.com/@yunani_bit2na?si=ycpEjVb-SMBclkR7',
    spotify:   'https://open.spotify.com/artist/6FsEIvsTuqjpejg2jDbYdv?si=fXISXhLLRu2NwqVCVyrprQ',
    roles: [
      { label: 'Maknae',       main: true },
      { label: 'Lead Dancer',  main: true },
      { label: 'Lead Rapper',  main: true },
      { label: 'Sub Vocalist', main: true },
      { label: 'Visual',       main: true },
    ],
    info: [
      ['Full Name',    'Shin Yu-na'],
      ['Stage Name',   'Yuna'],
      ['English Name', 'Hussey Shin'],
      ['Zodiac',       'Sagittarius'],
    ],
  },
};

const memberKeys = ['yeji', 'lia', 'ryujin', 'chaeryeong', 'yuna'];
let currentCarouselIndex = 0;
const isMobile = () => window.innerWidth <= 1024;

// ===== HAMBURGER =====

const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenu   = document.getElementById('mobileMenu');

// posiciona o menu abaixo da nav dinamicamente
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

// ===== CARROSSEL =====
let isScrollingByButton = false;
let scrollEndTimer = null;

function updateDotsAndActive(index) {
  document.querySelectorAll('.carousel-dot').forEach((d, i) => {
    d.classList.toggle('active', i === index);
  });
  document.querySelectorAll('.carousel-slide').forEach((s, i) => {
    s.classList.toggle('active', i === index);
  });
}

function goToSlide(index, openPanel = false) {
  currentCarouselIndex = index;

  const track = document.getElementById('carouselTrack');
  if (track) {
    const slide = track.querySelectorAll('.carousel-slide')[index];
    if (slide) {
      isScrollingByButton = true;

      // limpa timer anterior se ainda estava rodando
      clearTimeout(scrollEndTimer);

      const targetScroll = slide.offsetLeft - (track.offsetWidth / 2) + (slide.offsetWidth / 2);
      track.scrollTo({ left: targetScroll, behavior: 'smooth' });

      // reativa o listener após a animação terminar (~400ms)
      scrollEndTimer = setTimeout(() => {
        isScrollingByButton = false;
      }, 400);
    }
  }

  updateDotsAndActive(index);
  if (openPanel) selectMember(memberKeys[index]);
}

function buildCarousel() {
  const grid = document.getElementById('membersGrid');
  grid.innerHTML = '';
  grid.classList.add('carousel-mode');

  const track = document.createElement('div');
  track.className = 'carousel-track';
  track.id = 'carouselTrack';

  memberKeys.forEach((id) => {
    const m = members[id];
    const cardPhoto = `/assets/members/${id === 'chaeryeong' ? 'chaery' : id}1.jpg`;
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    slide.dataset.id = id;
    slide.innerHTML = `
      <div class="carousel-photo" onclick="selectMember('${id}')">
        <img src="${cardPhoto}" alt="${m.stage}" />
        <div class="carousel-overlay"></div>
        <div class="carousel-label">
          <div class="member-name">${m.stage}</div>
          <div class="member-hangul">${m.hangul.split('(')[0].trim()}</div>
        </div>
        <div class="carousel-tap-hint">TAP TO VIEW PROFILE</div>
      </div>
    `;
    track.appendChild(slide);
  });

  const nav = document.createElement('div');
  nav.className = 'carousel-nav';
  nav.innerHTML = `
    <button class="carousel-btn" id="carouselPrev" aria-label="Previous member">
      <i class="ti ti-chevron-left"></i>
    </button>
    <div class="carousel-dots" id="carouselDots">
      ${memberKeys.map((_, i) => `
        <button class="carousel-dot${i === 0 ? ' active' : ''}" data-index="${i}" aria-label="Member ${i + 1}"></button>
      `).join('')}
    </div>
    <button class="carousel-btn" id="carouselNext" aria-label="Next member">
      <i class="ti ti-chevron-right"></i>
    </button>
  `;

  grid.appendChild(track);
  grid.appendChild(nav);

  document.getElementById('carouselPrev').addEventListener('click', () => {
    goToSlide((currentCarouselIndex - 1 + memberKeys.length) % memberKeys.length);
  });
  document.getElementById('carouselNext').addEventListener('click', () => {
    goToSlide((currentCarouselIndex + 1) % memberKeys.length);
  });
  document.querySelectorAll('.carousel-dot').forEach(dot => {
    dot.addEventListener('click', () => goToSlide(Number(dot.dataset.index)));
  });

  // Só atualiza dots pelo scroll se NÃO foi acionado por botão
  track.addEventListener('scroll', () => {
    if (isScrollingByButton) return;

    const slides = track.querySelectorAll('.carousel-slide');
    if (!slides.length) return;

    const trackCenter = track.scrollLeft + track.offsetWidth / 2;
    let closest = 0;
    let minDist  = Infinity;
    slides.forEach((s, i) => {
      const slideCenter = s.offsetLeft + s.offsetWidth / 2;
      const dist = Math.abs(trackCenter - slideCenter);
      if (dist < minDist) { minDist = dist; closest = i; }
    });

    if (closest !== currentCarouselIndex) {
      currentCarouselIndex = closest;
      updateDotsAndActive(closest);
    }
  }, { passive: true });

  goToSlide(0, false);
}

// ===== SELECT MEMBER =====
function selectMember(id) {
  const m = members[id];
  if (!m) return;

  document.querySelectorAll('.member-col').forEach(col => col.classList.remove('selected'));
  const activeCol = document.querySelector(`[data-id="${id}"]`);
  if (activeCol) activeCol.classList.add('selected');

  document.getElementById('detailStage').textContent  = m.stage;
  document.getElementById('detailHangul').textContent = m.hangul;
  document.getElementById('detailBirth').textContent  = m.birth;

  const photoBox   = document.getElementById('detailPhoto');
  const initialsEl = document.getElementById('detailInitials');
  photoBox.style.background = m.photoBg;

  if (m.photoSrc) {
    initialsEl.style.display = 'none';
    let img = photoBox.querySelector('img');
    if (!img) {
      img = document.createElement('img');
      img.alt = m.stage;
      photoBox.appendChild(img);
    }
    img.src = m.photoSrc;
    img.style.display = 'block';
  } else {
    initialsEl.style.display = 'block';
    initialsEl.style.color   = m.photoTxt;
    initialsEl.textContent   = m.stage.length > 4 ? m.stage.slice(0, 4) : m.stage;
    const existingImg = photoBox.querySelector('img');
    if (existingImg) existingImg.style.display = 'none';
  }

  document.getElementById('detailRoles').innerHTML = m.roles
    .map(r => `<span class="role-tag${r.main ? ' main' : ''}">${r.label}</span>`)
    .join('');

  document.getElementById('detailGrid').innerHTML = m.info
    .map(([label, value]) => `
      <div class="info-cell">
        <div class="info-label">${label}</div>
        <div class="info-val">${value}</div>
      </div>
    `).join('');

  let btns = '';
  if (m.instagram) btns += `<a class="social-btn ig-btn" href="${m.instagram}" target="_blank" rel="noopener"><i class="ti ti-brand-instagram" aria-hidden="true"></i> INSTAGRAM</a>`;
  if (m.youtube)   btns += `<a class="social-btn yt-btn" href="${m.youtube}"   target="_blank" rel="noopener"><i class="ti ti-brand-youtube"   aria-hidden="true"></i> YOUTUBE</a>`;
  if (m.spotify)   btns += `<a class="social-btn sp-btn" href="${m.spotify}"   target="_blank" rel="noopener"><i class="ti ti-brand-spotify"   aria-hidden="true"></i> SPOTIFY</a>`;
  document.getElementById('detailSocials').innerHTML = btns;

  document.getElementById('detailPanel').classList.add('visible');
  document.getElementById('selectHint').style.display = 'none';

  if (isMobile()) {
    setTimeout(() => {
      document.getElementById('detailPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }
}

// ===== INIT + RESIZE =====
let wasCarousel = null;

function init() {
  const mobile = isMobile();
  if (wasCarousel === mobile) return;
  wasCarousel = mobile;

  if (mobile) {
    buildCarousel();
    document.getElementById('detailPanel').classList.remove('visible');
    document.getElementById('selectHint').style.display = 'none';
  } else {
    document.getElementById('membersGrid').classList.remove('carousel-mode');
    document.getElementById('membersGrid').innerHTML = `
      <div class="member-col" data-id="yeji" onclick="selectMember('yeji')">
        <div class="member-photo">
          <div class="photo-placeholder"><img src="/assets/members/yeji1.jpg" alt="Yeji"></div>
          <div class="member-photo-overlay"></div>
          <div class="member-photo-label">
            <div class="member-name">YEJI</div>
            <div class="member-hangul">예지</div>
          </div>
        </div>
      </div>
      <div class="member-col" data-id="lia" onclick="selectMember('lia')">
        <div class="member-photo">
          <div class="photo-placeholder"><img src="/assets/members/lia1.jpg" alt="Lia"></div>
          <div class="member-photo-overlay"></div>
          <div class="member-photo-label">
            <div class="member-name">LIA</div>
            <div class="member-hangul">리아</div>
          </div>
        </div>
      </div>
      <div class="member-col" data-id="ryujin" onclick="selectMember('ryujin')">
        <div class="member-photo">
          <div class="photo-placeholder"><img src="/assets/members/ryujin1.jpg" alt="Ryujin"></div>
          <div class="member-photo-overlay"></div>
          <div class="member-photo-label">
            <div class="member-name">RYUJIN</div>
            <div class="member-hangul">류진</div>
          </div>
        </div>
      </div>
      <div class="member-col" data-id="chaeryeong" onclick="selectMember('chaeryeong')">
        <div class="member-photo">
          <div class="photo-placeholder"><img src="/assets/members/chaery1.jpg" alt="Chaeryeong"></div>
          <div class="member-photo-overlay"></div>
          <div class="member-photo-label">
            <div class="member-name">CHAERYEONG</div>
            <div class="member-hangul">채령</div>
          </div>
        </div>
      </div>
      <div class="member-col" data-id="yuna" onclick="selectMember('yuna')">
        <div class="member-photo">
          <div class="photo-placeholder"><img src="/assets/members/yuna1.jpg" alt="Yuna"></div>
          <div class="member-photo-overlay"></div>
          <div class="member-photo-label">
            <div class="member-name">YUNA</div>
            <div class="member-hangul">유나</div>
          </div>
        </div>
      </div>
    `;
    document.getElementById('detailPanel').classList.remove('visible');
    document.getElementById('selectHint').style.display = 'flex';
  }
}

init();
window.addEventListener('resize', init);