// ===== HAMBURGER =====

    const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenu   = document.getElementById('mobileMenu');

// posiciona o menu abaixo da nav dinamicamente
const navHeight = document.querySelector('.nav').offsetHeight;
mobileMenu.style.top = navHeight + 'px';
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

    // ===== BOTTOM TAB BAR =====
    // Syncs the bottom tab bar with the desktop cat-nav buttons
    const tabItems = document.querySelectorAll('.tab-item');

    tabItems.forEach(tab => {
      tab.addEventListener('click', () => {
        const section = tab.dataset.section;

        // update active state on tab bar
        tabItems.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // also sync desktop cat-nav
        document.querySelectorAll('.cnav').forEach(b => {
          b.classList.toggle('active', b.dataset.section === section);
        });

        // trigger the same logic as desktop buttons
        document.getElementById('searchInput').value = '';
        if (typeof setActiveButton === 'function') setActiveButton(section);
        if (section === 'home') {
          if (typeof renderHome === 'function' && typeof data !== 'undefined') renderHome(data);
        } else {
          if (typeof renderCategory === 'function') renderCategory(section);
        }

        // scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    // Keep tab bar in sync when desktop nav is used
    document.querySelectorAll('.cnav').forEach(btn => {
      btn.addEventListener('click', () => {
        const section = btn.dataset.section;
        tabItems.forEach(t => {
          t.classList.toggle('active', t.dataset.section === section);
        });
      });
    });


// ================= DATA =================
let data = {};

// ================= ELEMENTS =================
const mainContent = document.getElementById("mainContent");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalLinks = document.getElementById("modalLinks");
const modalClose = document.getElementById("modalClose");

const searchInput = document.getElementById("searchInput");
const buttons = document.querySelectorAll(".cnav");

// ================= CONFIG =================
const LIMIT = 12;
const SCROLL_AMOUNT = 800;
const FALLBACK_IMG = "../assets/itzyflix.png";

// ================= CATEGORY LABELS =================
const categoryNames = {
  thisIsItzy: "This is ITZY",
  performances: "Performances",
  covers: "Covers & Live Music",
  concerts: "Concerts",
  webContent: "Variety Shows",
  more: "More"
};

// ================= ACTIVE BUTTON =================
function setActiveButton(section) {
  buttons.forEach(btn => {
    btn.classList.remove("active");

    if (btn.dataset.section === section) {
      btn.classList.add("active");
    }
  });
}

// ================= CREATE CARD =================
function createCard(item) {
  const card = document.createElement("div");
  card.className = "card";

  const imgSrc = item.img || FALLBACK_IMG;

  card.innerHTML = `
    <img src="${imgSrc}" alt="${item.title}">
    <div class="card-title">${item.title}</div>
  `;

  const img = card.querySelector("img");
  img.onerror = () => (img.src = FALLBACK_IMG);

  card.addEventListener("click", () => {
    if (item.links) openModal(item);
    else if (item.url) window.open(item.url, "_blank");
  });

  return card;
}

// ================= CREATE ROW =================
function createRow(title, items) {
  const row = document.createElement("div");
  row.className = "content-row";

  const header = document.createElement("div");
  header.className = "row-header";
  header.innerHTML = `<div class="row-title">${title}</div>`;

  const wrapper = document.createElement("div");
  wrapper.className = "row-wrapper";

  const leftBtn = document.createElement("button");
  leftBtn.className = "scroll-btn left";
  leftBtn.innerHTML = "‹";

  const rightBtn = document.createElement("button");
  rightBtn.className = "scroll-btn right";
  rightBtn.innerHTML = "›";

  const track = document.createElement("div");
  track.className = "cards-track";

  items.slice(0, LIMIT).forEach(item => {
    track.appendChild(createCard(item));
  });

  function updateButtons() {
    const maxScroll = track.scrollWidth - track.clientWidth;

    leftBtn.style.display = track.scrollLeft <= 0 ? "none" : "flex";
    rightBtn.style.display =
      track.scrollLeft >= maxScroll - 5 ? "none" : "flex";
  }

  leftBtn.onclick = () => {
    track.scrollBy({ left: -SCROLL_AMOUNT, behavior: "smooth" });
  };

  rightBtn.onclick = () => {
    track.scrollBy({ left: SCROLL_AMOUNT, behavior: "smooth" });
  };

  track.addEventListener("scroll", updateButtons);
  setTimeout(updateButtons, 100);

  wrapper.append(leftBtn, track, rightBtn);
  row.append(header, wrapper);

  return row;
}

// ================= HOME =================
function renderHome(sourceData) {
  mainContent.innerHTML = "";

  Object.keys(sourceData).forEach(section => {
    if (!sourceData[section]) return;

    const row = createRow(categoryNames[section], sourceData[section]);
    mainContent.appendChild(row);
  });
}

// ================= CATEGORY =================
function renderCategory(section) {
  mainContent.innerHTML = "";

  if (!data[section]) return;

  const container = document.createElement("div");
  container.className = "grid-mode";

  const title = document.createElement("div");
  title.className = "row-header";
  title.innerHTML = `<div class="row-title">${categoryNames[section]}</div>`;

  const grid = document.createElement("div");
  grid.className = "cards-track";

  data[section].forEach(item => {
    grid.appendChild(createCard(item));
  });

  container.append(title, grid);
  mainContent.appendChild(container);
}

// ================= SEARCH =================
function handleSearch(query) {
  query = query.toLowerCase();

  if (!query) {
    setActiveButton("home");
    renderHome(data);
    return;
  }

  const result = {};

  Object.keys(data).forEach(section => {
    const matches = data[section].filter(item =>
      item.title?.toLowerCase().includes(query)
    );

    if (matches.length > 0) {
      result[section] = matches;
    }
  });

  if (Object.keys(result).length === 0) {
    mainContent.innerHTML = `
      <div class="row-header">
        <div class="row-title">No results found</div>
      </div>
    `;
    return;
  }

  setActiveButton(null);
  renderSearchResults(result);
}

// ================= SEARCH RESULTS =================
function renderSearchResults(results) {
  mainContent.innerHTML = "";

  // flatten all results into one array
  const allItems = Object.values(results).flat();

  const container = document.createElement("div");
  container.className = "grid-mode";

  const grid = document.createElement("div");
  grid.className = "cards-track";

  allItems.forEach(item => {
    grid.appendChild(createCard(item));
  });

  container.appendChild(grid);
  mainContent.appendChild(container);
}

// ================= EVENTS =================
searchInput?.addEventListener("input", e => {
  handleSearch(e.target.value);
});

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const section = btn.dataset.section;

    searchInput.value = "";
    setActiveButton(section);

    if (section === "home") renderHome(data);
    else renderCategory(section);
  });
});

// ================= MODAL =================
function openModal(item) {
  modalTitle.textContent = item.title;
  modalLinks.innerHTML = "";

  item.links?.forEach(link => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="${link.url}" target="_blank">${link.title}</a>`;
    modalLinks.appendChild(li);
  });

  modal.classList.add("active");
}

modalClose?.addEventListener("click", () => {
  modal.classList.remove("active");
});

modal?.addEventListener("click", e => {
  if (e.target === modal) modal.classList.remove("active");
});

// ================= LOAD =================
async function loadData() {
  try {
    const res = await fetch("../data/itzyflix.json");
    data = await res.json();

    setActiveButton("home");
    renderHome(data);

  } catch (err) {
    console.error("Erro JSON:", err);
  }
}

loadData();