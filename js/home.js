
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenu   = document.getElementById('mobileMenu');

const navHeight = document.querySelector('.nav').offsetHeight;
mobileMenu.style.top = navHeight + 'px';

if (hamburgerBtn && mobileMenu) {
  hamburgerBtn.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    hamburgerBtn.setAttribute("aria-expanded", isOpen);
    const spans = hamburgerBtn.querySelectorAll("span");
    if (isOpen) {
      spans[0].style.transform = "translateY(7px) rotate(45deg)";
      spans[1].style.opacity   = "0";
      spans[2].style.transform = "translateY(-7px) rotate(-45deg)";
    } else {
      spans[0].style.transform = "";
      spans[1].style.opacity   = "";
      spans[2].style.transform = "";
    }
  });
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      hamburgerBtn.setAttribute("aria-expanded", "false");
      const spans = hamburgerBtn.querySelectorAll("span");
      spans[0].style.transform = "";
      spans[1].style.opacity   = "";
      spans[2].style.transform = "";
    });
  });
}

const latestRelease = {
  youtube:    'https://music.youtube.com/playlist?list=OLAK5uy_mO0yFE2vVjgSBANDdIzpZ1ZFnMg723cC4&si=pcqHpPoQwPvIh_4f',
  spotify:    'https://open.spotify.com/prerelease/2EXpnzqbnBM6boarTu9vQY?si=a2950906a04848d6',
  appleMusic: '#',
};

function toggleStreamLinks() {
  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    openSheet();
    return;
  }

  const panel   = document.getElementById('streamPanel');
  const playBtn = document.getElementById('playBtn');
  const isOpen  = panel.classList.contains('open');

  if (isOpen) {
    panel.classList.remove('open');
    playBtn.classList.remove('active');
  } else {
    setLinks();

    panel.classList.add('open');
    playBtn.classList.add('active');
  }
}

function openSheet() {
  setLinks();

  document.getElementById('bottomSheet').classList.add('open');
}

function closeSheet() {
  document.getElementById('bottomSheet').classList.remove('open');
}

function setLinks() {
  document.getElementById('linkYoutube').href    = latestRelease.youtube;
  document.getElementById('linkSpotify').href    = latestRelease.spotify;
  document.getElementById('linkAppleMusic').href = latestRelease.appleMusic;

  document.getElementById('sheetYoutube').href = latestRelease.youtube;
  document.getElementById('sheetSpotify').href = latestRelease.spotify;
  document.getElementById('sheetApple').href   = latestRelease.appleMusic;
}