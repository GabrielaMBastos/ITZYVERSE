/* =========================================
   LABELS
========================================= */
const typeLabels = {
  album: "Full Album",
  mini: "Mini Album",
  single: "Single",
  ost: "OST",
  collab: "Collab",
};

const langLabels = {
  kr: "Korean",
  jp: "Japanese",
  en: "English",
};

const artistLabels = {
  all: "ITZY",
  yeji: "YEJI",
  lia: "LIA",
  ryujin: "RYUJIN",
  chaeryeong: "CHAERYEONG",
  yuna: "YUNA",
};

/* =========================================
   STATE
========================================= */
let currentArtist = "all";
let currentCat    = "all";
let currentLang   = "all";
let currentSort   = "newest";
let releases      = [];

// estado temporário do drawer (antes de aplicar)
let drawerCat  = "all";
let drawerLang = "all";

/* =========================================
   HELPERS
========================================= */
function formatName(name) {
  return artistLabels[name] || name.replaceAll("_", " ").toUpperCase();
}

function isCollabRelease(r) {
  return (
    (r.collabWith && r.collabWith.length > 0) ||
    (r.artist === "all" && r.featuring?.length > 0)
  );
}

function removeDuplicates(arr) {
  const seen = new Set();
  return arr.filter((r) => {
    const key = r.title + "_" + r.date;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const isMobileView = () => window.innerWidth <= 768;

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

/* =========================================
   FILTER DRAWER — abrir / fechar
========================================= */
function openDrawer() {
  // sincroniza estado temporário com o atual
  drawerCat  = currentCat;
  drawerLang = currentLang;

  // marca pills do drawer conforme estado atual
  document.querySelectorAll(".drawer-pill[data-cat]").forEach((p) => {
    p.classList.toggle("active", p.dataset.cat === drawerCat);
  });
  document.querySelectorAll(".drawer-pill[data-lang]").forEach((p) => {
    p.classList.toggle("active", p.dataset.lang === drawerLang);
  });

  document.getElementById("filterDrawer").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeDrawer() {
  document.getElementById("filterDrawer").classList.remove("open");
  document.body.style.overflow = "";
}

function applyDrawer() {
  currentCat  = drawerCat;
  currentLang = drawerLang;
  closeDrawer();
  renderGrid();
  updateMobileFilterBar();
}

function clearDrawer() {
  drawerCat  = "all";
  drawerLang = "all";
  document.querySelectorAll(".drawer-pill[data-cat]").forEach((p) => {
    p.classList.toggle("active", p.dataset.cat === "all");
  });
  document.querySelectorAll(".drawer-pill[data-lang]").forEach((p) => {
    p.classList.toggle("active", p.dataset.lang === "all");
  });
}

/* =========================================
   MOBILE FILTER BAR — atualiza
========================================= */
function updateMobileFilterBar() {
  // botão artista
  const artistBtn = document.getElementById("mfbArtist");
  if (artistBtn) artistBtn.textContent = artistLabels[currentArtist] + " ▾";

  // badge e botão filtros
  const filtersBtn = document.getElementById("mfbFilters");
  const badge      = document.getElementById("mfbBadge");
  const activeCount = (currentCat !== "all" ? 1 : 0) + (currentLang !== "all" ? 1 : 0);

  if (filtersBtn) filtersBtn.classList.toggle("has-filters", activeCount > 0);
  if (badge) badge.textContent = activeCount;

  // tags de filtros ativos
  const tagsEl = document.getElementById("mfbTags");
  if (!tagsEl) return;
  tagsEl.innerHTML = "";

  if (currentCat !== "all") {
    const tag = document.createElement("div");
    tag.className = "mfb-active-tag";
    tag.innerHTML = `${typeLabels[currentCat] || currentCat} <span class="remove">✕</span>`;
    tag.addEventListener("click", () => {
      currentCat = "all";
      drawerCat  = "all";
      renderGrid();
      updateMobileFilterBar();
    });
    tagsEl.appendChild(tag);
  }

  if (currentLang !== "all") {
    const tag = document.createElement("div");
    tag.className = "mfb-active-tag";
    tag.innerHTML = `${langLabels[currentLang] || currentLang} <span class="remove">✕</span>`;
    tag.addEventListener("click", () => {
      currentLang = "all";
      drawerLang  = "all";
      renderGrid();
      updateMobileFilterBar();
    });
    tagsEl.appendChild(tag);
  }
}

/* =========================================
   RENDER GRID
========================================= */
function renderGrid() {
  const grid    = document.getElementById("discGrid");
  const empty   = document.getElementById("emptyState");
  const countEl = document.getElementById("resultsCount");

  if (!releases.length) {
    grid.innerHTML = `<div class="loading">Loading discography...</div>`;
    return;
  }

  let filtered = releases.filter((r) => {
    let matchArtist = false;
    if (currentArtist === "all") {
      matchArtist = r.artist === "all";
    } else {
      matchArtist =
        r.artist === currentArtist || r.featuring?.includes(currentArtist);
    }

    let matchCat = false;
    const cat = String(currentCat).toLowerCase().trim();
    if (cat === "all") {
      matchCat = true;
    } else if (cat === "collab") {
      if (currentArtist === "all") {
        matchCat =
          r.artist === "all" &&
          ((r.featuring && r.featuring.length > 0) ||
            (r.collabWith && r.collabWith.length > 0));
      } else {
        matchCat =
          r.featuring?.includes(currentArtist) ||
          (r.artist === currentArtist &&
            (r.featuring?.length || r.collabWith?.length));
      }
    } else {
      matchCat = r.type === cat;
    }

    const matchLang = currentLang === "all" || r.lang === currentLang;
    return matchArtist && matchCat && matchLang;
  });

  filtered = removeDuplicates(filtered);

  filtered.sort((a, b) => {
    const sort = String(currentSort).toLowerCase().trim();
    if (sort === "az") return a.title.localeCompare(b.title);
    const dateA = a._date.getTime();
    const dateB = b._date.getTime();
    if (sort === "newest") return dateB - dateA;
    if (sort === "oldest") return dateA - dateB;
    return dateB - dateA;
  });

  countEl.textContent =
    filtered.length + " release" + (filtered.length !== 1 ? "s" : "");

  if (!filtered.length) {
    grid.innerHTML = "";
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";

  grid.innerHTML = filtered
    .map((r) => {
      const coverHtml = r.cover
        ? `<img src="${r.cover}" alt="${r.title}" loading="lazy">`
        : `<div class="d-cover-placeholder">${r.title}</div>`;

      const linkYt = r.links?.youtube
        ? `<a class="c-link yt" href="${r.links.youtube}" target="_blank"><i class="fa-brands fa-youtube"></i></a>`
        : "";
      const linkSp = r.links?.spotify
        ? `<a class="c-link sp" href="${r.links.spotify}" target="_blank"><i class="fa-brands fa-spotify"></i></a>`
        : "";
      const linkAm = r.links?.appleMusic
        ? `<a class="c-link am" href="${r.links.appleMusic}" target="_blank"><i class="fa-brands fa-apple"></i></a>`
        : "";

      const artistTag   = `<div class="d-artist-tag main">${formatName(r.artist)}</div>`;
      const collabTag   = r.collabWith?.length
        ? `<div class="d-artist-tag collab">${r.collabWith.map(formatName).join(" & ")}</div>`
        : "";
      const featuringTag = r.featuring?.length
        ? `<div class="d-artist-tag feat">feat. ${r.featuring.map(formatName).join(", ")}</div>`
        : "";

      return `
        <div class="d-card">
          <div class="d-cover">
            ${coverHtml}
            <div class="card-links">${linkYt}${linkSp}${linkAm}</div>
          </div>
          <div class="d-body">
            <span class="d-lang-badge ${r.lang}">${langLabels[r.lang]}</span>
            <div class="d-type">${typeLabels[r.type] || r.type}</div>
            <div class="d-title">${r.title}</div>
            <div class="d-year">${r.year}</div>
            ${artistTag}${collabTag}${featuringTag}
          </div>
        </div>`;
    })
    .join("");
}

/* =========================================
   EVENTS — desktop filters
========================================= */
document.getElementById("artistTabs")?.addEventListener("click", (e) => {
  const btn = e.target.closest(".atab");
  if (!btn) return;
  document.querySelectorAll(".atab").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  currentArtist = btn.dataset.artist;
  renderGrid();
  updateMobileFilterBar();
});

document.getElementById("catFilter")?.addEventListener("click", (e) => {
  const btn = e.target.closest(".pill");
  if (!btn) return;
  document.querySelectorAll("#catFilter .pill").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  currentCat = btn.dataset.cat.toLowerCase().trim();
  renderGrid();
});

document.getElementById("langFilter")?.addEventListener("click", (e) => {
  const btn = e.target.closest(".pill");
  if (!btn) return;
  document.querySelectorAll("#langFilter .pill").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  currentLang = btn.dataset.lang;
  renderGrid();
});

document.getElementById("sortSelect")?.addEventListener("change", (e) => {
  currentSort = e.target.value;
  renderGrid();
});

/* =========================================
   EVENTS — mobile filter bar
========================================= */
document.getElementById("mfbArtist")?.addEventListener("click", () => {
  // abre um mini sheet para artista, ou cicla — aqui usamos o drawer com só artistas
  openArtistSheet();
});

document.getElementById("mfbFilters")?.addEventListener("click", openDrawer);

/* Sheet de artista (simples — cicla pelos artistas) */
function openArtistSheet() {
  const sheet = document.getElementById("artistSheet");
  if (sheet) {
    sheet.classList.add("open");
    document.body.style.overflow = "hidden";
  }
}

function closeArtistSheet() {
  const sheet = document.getElementById("artistSheet");
  if (sheet) {
    sheet.classList.remove("open");
    document.body.style.overflow = "";
  }
}

document.getElementById("artistSheet")?.addEventListener("click", (e) => {
  const btn = e.target.closest(".sheet-atab");
  if (!btn) return;
  currentArtist = btn.dataset.artist;

  // sincroniza desktop tabs também
  document.querySelectorAll(".atab").forEach((b) => {
    b.classList.toggle("active", b.dataset.artist === currentArtist);
  });

  document.querySelectorAll(".sheet-atab").forEach((b) => {
    b.classList.toggle("active", b.dataset.artist === currentArtist);
  });

  renderGrid();
  updateMobileFilterBar();
  closeArtistSheet();
});

document.getElementById("artistSheetOverlay")?.addEventListener("click", closeArtistSheet);

/* =========================================
   EVENTS — drawer pills
========================================= */
document.getElementById("filterDrawer")?.addEventListener("click", (e) => {
  // overlay fecha
  if (e.target === e.currentTarget || e.target.classList.contains("drawer-overlay")) {
    closeDrawer();
    return;
  }

  const pill = e.target.closest(".drawer-pill");
  if (!pill) return;

  if (pill.dataset.cat !== undefined) {
    drawerCat = pill.dataset.cat;
    document.querySelectorAll(".drawer-pill[data-cat]").forEach((p) => {
      p.classList.toggle("active", p.dataset.cat === drawerCat);
    });
  }

  if (pill.dataset.lang !== undefined) {
    drawerLang = pill.dataset.lang;
    document.querySelectorAll(".drawer-pill[data-lang]").forEach((p) => {
      p.classList.toggle("active", p.dataset.lang === drawerLang);
    });
  }
});

document.getElementById("drawerApply")?.addEventListener("click", applyDrawer);
document.getElementById("drawerClear")?.addEventListener("click", clearDrawer);
document.getElementById("drawerOverlay")?.addEventListener("click", closeDrawer);

/* =========================================
   FETCH
========================================= */
fetch("/data/discography.json")
  .then((res) => res.json())
  .then((data) => {
    releases = data.map((r) => {
      const parsedDate = r.date
        ? new Date(r.date + "T00:00:00")
        : new Date(`${r.year}-01-01`);
      return {
        ...r,
        type: r.type?.toLowerCase().trim(),
        _date: parsedDate,
        year: r.year || parsedDate.getFullYear(),
        featuring:  r.featuring  || [],
        collabWith: r.collabWith || [],
      };
    });
    renderGrid();
    updateMobileFilterBar();
  });