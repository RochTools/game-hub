const grid = document.getElementById('grid');
const player = document.getElementById('player');
const frame = document.getElementById('frame');
const closeBtn = document.getElementById('closeBtn');
const menuBtn = document.getElementById('menuBtn');
const drawer = document.getElementById('drawer');
const backdrop = document.getElementById('backdrop');
const drawerClose = document.getElementById('drawerClose');
const savedList = document.getElementById('savedList');
const cats = document.getElementById('cats');
const searchInput = document.getElementById('search');
const noResults = document.getElementById('noResults');

const HOLD_MS = 2000; // X کو اتنی دیر دبائے رکھنا ہے
closeBtn.style.setProperty('--hold', HOLD_MS + 'ms'); // سرکل کی اینیمیشن بھی اتنی ہی لمبی

let GAMES = [];
const TILES = [];      // ہر گیم کا کارڈ، فلٹر کے لیے
let activeCat = null;  // 1 / 2 / 4 یا null (سب گیمز)
let query = '';

/* ---------- آئیکن خود ڈھونڈنا (گیم کے اپنے ہوم اسکرین آئیکن) ---------- */
function iconCache() {
  try { return JSON.parse(localStorage.getItem('hubIconCache') || '{}'); } catch { return {}; }
}
function saveIcon(url, href) {
  try {
    const c = iconCache();
    c[url] = href;
    localStorage.setItem('hubIconCache', JSON.stringify(c));
  } catch {}
}
function sizeOf(icon) {
  const n = parseInt(String(icon.sizes || '').split(/[x\s]/)[0], 10);
  return isNaN(n) ? 0 : n;
}

async function findIcon(game) {
  // games.json میں "icon" لکھ دیا ہو تو وہی استعمال ہوگا
  if (game.icon) return new URL(game.icon, location.href).href;

  const cached = iconCache()[game.url];
  if (cached) return cached;

  try {
    const base = new URL(game.url, location.href);
    const html = await (await fetch(base)).text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    let href = null;

    // 1) گیم کی manifest سے 192 کے قریب ترین آئیکن
    const link = doc.querySelector('link[rel~="manifest"]');
    if (link) {
      try {
        const murl = new URL(link.getAttribute('href'), base);
        const m = await (await fetch(murl)).json();
        const icons = (m.icons || []).slice()
          .sort((a, b) => Math.abs(sizeOf(a) - 192) - Math.abs(sizeOf(b) - 192));
        if (icons[0]) href = new URL(icons[0].src, murl).href;
      } catch {}
    }
    // 2) ورنہ apple-touch-icon یا favicon
    if (!href) {
      const l = doc.querySelector('link[rel~="apple-touch-icon"]') ||
                doc.querySelector('link[rel~="icon"]');
      if (l) href = new URL(l.getAttribute('href'), base).href;
    }
    if (href) saveIcon(game.url, href);
    return href;
  } catch {
    return null;
  }
}

// کسی بھی خانے میں آئیکن ڈالنا؛ نہ ملے تو حرف والا رنگین خانہ رہے گا
function fillIcon(box, game) {
  findIcon(game).then((href) => {
    if (!href) return;
    const img = new Image();
    img.alt = '';
    img.onload = () => { box.textContent = ''; box.appendChild(img); };
    img.src = href;
  });
}
function letterOf(game) {
  return (game.title || '?').trim().charAt(0).toUpperCase();
}

/* ---------- محفوظ گیمز (دل) ---------- */
function loadSaved() {
  try { return JSON.parse(localStorage.getItem('hubSaved') || '[]'); } catch { return []; }
}
function storeSaved(list) {
  try { localStorage.setItem('hubSaved', JSON.stringify(list)); } catch {}
}
// محفوظ کر دے تو true، ہٹا دے تو false
function toggleSaved(url) {
  const list = loadSaved();
  const i = list.indexOf(url);
  if (i >= 0) list.splice(i, 1); else list.push(url);
  storeSaved(list);
  return i < 0;
}

function renderSaved() {
  const games = loadSaved()
    .map((u) => GAMES.find((g) => g.url === u))
    .filter(Boolean);

  savedList.textContent = '';

  if (!games.length) {
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = 'No saved games yet. Tap the heart under a game to save it.';
    savedList.appendChild(empty);
    return;
  }

  games.forEach((g) => {
    const row = document.createElement('button');
    row.className = 'saved-row';

    const thumb = document.createElement('div');
    thumb.className = 'thumb';
    thumb.style.background = g.color || '#2a2545';
    thumb.textContent = letterOf(g);

    const label = document.createElement('div');
    label.className = 'label';
    label.textContent = g.title;

    row.append(thumb, label);
    row.addEventListener('click', () => {
      closeDrawer();
      openGame(g);
    });
    fillIcon(thumb, g);
    savedList.appendChild(row);
  });
}

/* ---------- مینیو (تین لکیریں) ---------- */
function openDrawer() {
  renderSaved();
  drawer.classList.add('open');
  backdrop.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
  menuBtn.setAttribute('aria-expanded', 'true');
}
function closeDrawer() {
  drawer.classList.remove('open');
  backdrop.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
  menuBtn.setAttribute('aria-expanded', 'false');
}
menuBtn.addEventListener('click', openDrawer);
drawerClose.addEventListener('click', closeDrawer);
backdrop.addEventListener('click', closeDrawer);

/* ---------- ٹائلیں بنانا ---------- */
const HEART_SVG =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';

function makeTile(game) {
  const card = document.createElement('div');
  card.className = 'tile';

  const open = document.createElement('button');
  open.className = 'open';

  const icon = document.createElement('div');
  icon.className = 'icon';
  icon.style.background = game.color || '#2a2545';
  const letter = document.createElement('span');
  letter.textContent = letterOf(game);
  icon.appendChild(letter);

  const name = document.createElement('div');
  name.className = 'name';
  name.textContent = game.title;

  open.append(icon, name);
  open.addEventListener('click', () => openGame(game));

  const heart = document.createElement('button');
  heart.className = 'heart';
  heart.innerHTML = HEART_SVG;
  heart.setAttribute('aria-label', 'Save ' + game.title);
  if (loadSaved().includes(game.url)) heart.classList.add('on');
  heart.addEventListener('click', () => {
    const on = toggleSaved(game.url);
    heart.classList.toggle('on', on);
    heart.classList.remove('pop');
    void heart.offsetWidth; // اینیمیشن دوبارہ چلانے کے لیے
    heart.classList.add('pop');
  });

  card.append(open, heart);
  fillIcon(icon, game);
  TILES.push({ game, card });
  return card;
}

async function loadGames() {
  try {
    GAMES = await (await fetch('games.json')).json();
    GAMES.forEach((g) => grid.appendChild(makeTile(g)));
  } catch {
    grid.textContent = "Couldn't load games.json";
  }
}

/* ---------- کیٹیگری اور سرچ ---------- */
function applyFilters() {
  const q = query.trim().toLowerCase();
  let shown = 0;

  TILES.forEach(({ game, card }) => {
    const okCat = activeCat === null || (game.players || []).includes(activeCat);
    const okQuery = !q || (game.title || '').toLowerCase().includes(q);
    const show = okCat && okQuery;
    card.hidden = !show;
    if (show) shown++;
  });

  if (TILES.length && shown === 0) {
    noResults.textContent = q ? 'No games found.' : 'No games in this category yet.';
    noResults.hidden = false;
  } else {
    noResults.hidden = true;
  }
}

// چپ دبائیں تو فلٹر لگے، اسی کو دوبارہ دبائیں تو ہٹ جائے
cats.addEventListener('click', (e) => {
  const chip = e.target.closest('.chip');
  if (!chip) return;
  const n = Number(chip.dataset.players);
  activeCat = activeCat === n ? null : n;
  cats.querySelectorAll('.chip').forEach((c) => {
    c.setAttribute('aria-pressed', String(Number(c.dataset.players) === activeCat));
  });
  applyFilters();
});

searchInput.addEventListener('input', () => {
  query = searchInput.value;
  applyFilters();
});

/* ---------- گیم کھولنا / بند کرنا ---------- */
// اوپر کی اسٹیٹس بار کا رنگ: گیم میں گیم کا، ہوم پر سفید
const themeMeta = document.querySelector('meta[name="theme-color"]');
function setBarColor(color) {
  if (themeMeta) themeMeta.setAttribute('content', color);
}

function openGame(game) {
  setBarColor(game.bar || game.color || '#ffffff');
  frame.src = game.url;
  player.hidden = false;
}
function closeGame() {
  player.hidden = true;
  frame.src = 'about:blank';
  setBarColor('#ffffff');
}

/* ---------- X کو دبا کر بند کرنا ---------- */
let holdTimer = null;

function startHold(e) {
  e.preventDefault();
  try { closeBtn.setPointerCapture(e.pointerId); } catch {}
  closeBtn.classList.add('holding');          // سرکل بھرنا شروع (CSS میں HOLD_MS جتنا)
  clearTimeout(holdTimer);
  holdTimer = setTimeout(() => {
    cancelHold();
    closeGame();
  }, HOLD_MS);
}
function cancelHold() {
  clearTimeout(holdTimer);
  holdTimer = null;
  closeBtn.classList.remove('holding');       // سرکل واپس خالی، گیم چلتی رہے گی
}

closeBtn.addEventListener('pointerdown', startHold);
closeBtn.addEventListener('pointerup', cancelHold);
closeBtn.addEventListener('pointercancel', cancelHold);
closeBtn.addEventListener('lostpointercapture', cancelHold);
closeBtn.addEventListener('contextmenu', (e) => e.preventDefault());

/* ---------- شروع ---------- */
loadGames();
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
