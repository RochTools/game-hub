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
const searchToggle = document.getElementById('searchToggle');
const searchPanel = document.getElementById('searchPanel');
const searchClose = document.getElementById('searchClose');
const noResults = document.getElementById('noResults');
const recentSection = document.getElementById('recentSection');
const recentCard = document.getElementById('recentCard');
const featuredTrack = document.getElementById('featuredTrack');
const sliderDots = document.getElementById('sliderDots');
const gameCount = document.getElementById('gameCount');
const genresEl = document.getElementById('genres');
const recentClearBtn = document.getElementById('recentClear');
const offlineBar = document.getElementById('offlineBar');
const toastEl = document.getElementById('toast');

/* ---------- آئیکنز (Font Awesome جیسے، خود بنائے ہوئے SVG) ---------- */
const ICONS = {
  gamepad: '<path d="M6 7h12a4 4 0 0 1 4 4v3a3 3 0 0 1-5.2 2L15 14H9l-1.8 2A3 3 0 0 1 2 14v-3a4 4 0 0 1 4-4zM6.5 9v1.5H5v1h1.5V13h1v-1.5H9v-1H7.5V9zM16 9a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM18.5 11.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>',
  joystick: '<circle cx="12" cy="6" r="4"/><rect x="11" y="9" width="2" height="6"/><path d="M4 15h16a1 1 0 0 1 1 1v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a1 1 0 0 1 1-1z"/>',
  dice: '<path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM8 6.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM16 6.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM12 10.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM8 14.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM16 14.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>',
  puzzle: '<path d="M4 8h4a2.5 2.5 0 1 1 5 0h4a1 1 0 0 1 1 1v4a2.5 2.5 0 1 1 0 5v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/>',
  car: '<path d="M3 14l2-4.6A2 2 0 0 1 6.85 8h10.3A2 2 0 0 1 19 9.4l2 4.6v4a1 1 0 0 1-1 1h-1a2.5 2.5 0 0 0-5 0h-4a2.5 2.5 0 0 0-5 0H4a1 1 0 0 1-1-1zM7.2 9.5L6.2 12h11.6l-1-2.5z"/><circle cx="16.5" cy="19" r="2"/><circle cx="7.5" cy="19" r="2"/>',
  ball: '<path d="M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19zM12 8.2l3.4 2.5-1.3 4H9.9l-1.3-4z"/>',
  fire: '<path d="M12 2c1 3.5 5.5 5.5 5.5 11a5.5 5.5 0 0 1-11 0c0-2 1-3.4 2-4.4.2 1.4.8 2.2 1.6 2.6C10 8 10.5 4.5 12 2zM12 20a2.6 2.6 0 0 1-2.6-2.6c0-1.6 1.3-2.4 2.6-4 1.3 1.6 2.6 2.4 2.6 4A2.6 2.6 0 0 1 12 20z"/>',
  target: '<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 5a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/>',
  clock: '<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM11 6h2v5.6l3.4 2-1 1.7L11 12.7z"/>',
  trophy: '<path d="M7 3h10v5.5a5 5 0 0 1-10 0zM11 14h2v3h-2zM8 18h8a1 1 0 0 1 1 1v2H7v-2a1 1 0 0 1 1-1zM7 5H3.5v2.5A3.5 3.5 0 0 0 7 11V9.5a2 2 0 0 1-2-2V6.5H7zM17 5h3.5v2.5A3.5 3.5 0 0 1 17 11V9.5a2 2 0 0 0 2-2V6.5H17z"/>',
  lock: '<path d="M7 10V7a5 5 0 0 1 10 0v3h1a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1zm2 0h6V7a3 3 0 0 0-6 0z"/>',
  compass: '<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM16.5 7.5l-2 5-5 2 2-5z"/>',
  star: '<path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8-6.1-3.5-6.1 3.5 1.4-6.8L2.2 9.1l6.9-.8z"/>',
  bolt: '<path d="M13 2L4 14h6l-1 8 9-12h-6z"/>',
  stopwatch: '<path d="M10 2h4v2h-4zM12 5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zM11 9h2v4.5l2.5 1.5-1 1.6-3.5-2z"/>',
  rocket: '<path d="M12 2c3 2 5 5 5 9l2 3v3l-3-1.5H8L5 17v-3l2-3c0-4 2-7 5-9zM12 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM10 19h4l-2 3z"/>',
  heart: '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>',
  chart: '<path d="M4 13h4v8H4zM10 3h4v18h-4zM16 8h4v13h-4z"/>',
  check: '<path d="M9 16.2L4.8 12l-1.8 1.8L9 19.8 21 7.8 19.2 6z"/>',
  play: '<path d="M7 4l13 8-13 8z"/>',
  medal: '<path d="M7 2h4l2 6h-3zM17 2h-4l-2 6h3z"/><circle cx="12" cy="15" r="6"/>',
  monitor: '<path d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-6v2h3v2H7v-2h3v-2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 2v9h16V6z"/>',
  moon: '<path d="M20.5 14.2A8.6 8.6 0 0 1 9.8 3.5a8.6 8.6 0 1 0 10.7 10.7z"/>',
  sun: '<circle cx="12" cy="12" r="4.5"/><path d="M11 1.5h2v3h-2zM11 19.5h2v3h-2zM1.5 11h3v2h-3zM19.5 11h3v2h-3z"/><path transform="rotate(45 12 12)" d="M11 1.5h2v3h-2zM11 19.5h2v3h-2zM1.5 11h3v2h-3zM19.5 11h3v2h-3z"/>',
  chevron: '<path d="M8 5l8 7-8 7-1.6-1.8L12.8 12 6.4 6.8z"/>',
  gear: '<path d="M12 4.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15zM12 9.3a2.7 2.7 0 1 1 0 5.4 2.7 2.7 0 0 1 0-5.4z"/><path d="M10.5 1.5h3v4h-3zM10.5 18.5h3v4h-3zM1.5 10.5h4v3h-4zM18.5 10.5h4v3h-4z"/><path transform="rotate(45 12 12)" d="M10.5 1.5h3v4h-3zM10.5 18.5h3v4h-3zM1.5 10.5h4v3h-4zM18.5 10.5h4v3h-4z"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M6 12l12-7M6 12l12 7" stroke="currentColor" stroke-width="1.8" fill="none"/>',
  sort: '<path d="M7 3l4 5H8v13H6V8H3zM17 21l-4-5h3V3h2v13h3z"/>',
  trash: '<path d="M9 2h6l1 2h5v2H3V4h5zM5 8h14l-1 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1z"/>',
  undo: '<path d="M12 5V2L7 6l5 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z"/>',
  spark: '<path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z"/>',
};
function ic(name, extra = '') {
  return `<svg class="ic ic-${name} ${extra}" viewBox="0 0 24 24" fill="currentColor" fill-rule="evenodd" aria-hidden="true">${ICONS[name] || ICONS.gamepad}</svg>`;
}
// HTML میں data-ic="نام" والی جگہوں پر آئیکن ڈالنا
document.querySelectorAll('[data-ic]').forEach((el) => el.insertAdjacentHTML('afterbegin', ic(el.dataset.ic)));

/* ---------- سیٹنگز (localStorage) ---------- */
const SET_KEY = 'hubSettings';
const settings = { hold: 1000, vibe: true };
try { Object.assign(settings, JSON.parse(localStorage.getItem(SET_KEY) || '{}')); } catch {}
settings.hold = Math.min(3000, Math.max(500, Number(settings.hold) || 1000));
function saveSettings() { try { localStorage.setItem(SET_KEY, JSON.stringify(settings)); } catch {} }
let HOLD_MS = settings.hold; // X کو اتنی دیر دبائے رکھنا ہے
closeBtn.style.setProperty('--hold', HOLD_MS + 'ms'); // سرکل کی اینیمیشن بھی اتنی ہی لمبی
function buzz(ms = 14) { if (settings.vibe && navigator.vibrate) { try { navigator.vibrate(ms); } catch {} } }

let GAMES = [];
const TILES = [];      // ہر گیم کا کارڈ، فلٹر کے لیے
let activeCat = null;  // 1 / 2 / 4 یا null (سب گیمز)
let query = '';
let activeTag = null;  // genre: 'racing' / 'board' ... یا null (سب)
let featuredIndex = 0;
let featuredTimer = null;

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
  setTimeout(checkAch, 0);
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
  renderStats();
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
    buzz(12);
    heart.classList.toggle('on', on);
    heart.classList.remove('pop');
    void heart.offsetWidth; // اینیمیشن دوبارہ چلانے کے لیے
    heart.classList.add('pop');
  });

  const share = document.createElement('button');
  share.className = 'share';
  share.innerHTML = ic('share');
  share.setAttribute('aria-label', 'Share ' + game.title);
  share.addEventListener('click', () => shareGame(game));

  const actions = document.createElement('div');
  actions.className = 'tile-actions';
  actions.append(heart, share);
  card.append(open, actions);
  fillIcon(icon, game);
  TILES.push({ game, card });
  return card;
}

const RECENT_MAX = 8;
function getRecentList() {
  try {
    const l = JSON.parse(localStorage.getItem('hubRecent') || 'null');
    if (Array.isArray(l)) return l;
    // پرانا ورژن: صرف ایک گیم یاد تھی
    const old = localStorage.getItem('hubLastPlayed');
    return old ? [old] : [];
  } catch { return []; }
}
function setRecent(url) {
  const l = getRecentList().filter((u) => u !== url);
  l.unshift(url);
  try { localStorage.setItem('hubRecent', JSON.stringify(l.slice(0, RECENT_MAX))); } catch {}
}
function clearRecent() {
  try { localStorage.removeItem('hubRecent'); localStorage.removeItem('hubLastPlayed'); } catch {}
  renderRecent();
}
function renderRecent() {
  const games = getRecentList().map((u) => GAMES.find((g) => g.url === u)).filter(Boolean);
  recentSection.hidden = !games.length;
  recentCard.textContent = '';
  recentClearBtn.hidden = games.length === 0;
  games.forEach((game, i) => {
    const card = document.createElement('button');
    card.className = 'recent-item' + (i === 0 ? ' first' : '');
    card.type = 'button';
    const art = document.createElement('div');
    art.className = 'recent-art';
    art.style.background = `linear-gradient(135deg, ${game.color || '#253b85'}, #17152f)`;
    art.textContent = letterOf(game);
    fillIcon(art, game);
    const name = document.createElement('span');
    name.className = 'recent-name';
    name.textContent = game.title;
    card.append(art, name);
    if (i === 0) {
      const tag = document.createElement('span');
      tag.className = 'mini-tag';
      tag.textContent = 'CONTINUE';
      card.appendChild(tag);
    }
    card.addEventListener('click', () => openGame(game));
    recentCard.appendChild(card);
  });
}
recentClearBtn.addEventListener('click', clearRecent);
function renderFeatured() {
  featuredTrack.textContent = ''; sliderDots.textContent = '';
  let featured = GAMES.filter((g) => g.featured)
    .sort((a, b) => (a.order || 99) - (b.order || 99))
    .slice(0, 6);
  if (!featured.length) featured = GAMES.slice(0, Math.min(5, GAMES.length)); // کوئی نشان زدہ نہ ہو تو پہلی 5
  featured.forEach((game, i) => {
    const card = document.createElement('button'); card.className = 'featured-card'; card.type = 'button';
    card.style.setProperty('--game-glow', game.color || '#526dff');
    const art = document.createElement('div'); art.className = 'featured-art'; art.style.background = `linear-gradient(135deg, ${game.color || '#263b86'}, #15152e)`; art.textContent = letterOf(game); fillIcon(art, game);
    const copy = document.createElement('div'); copy.className = 'featured-copy';
    const tag = document.createElement('span'); tag.className = 'mini-tag'; tag.textContent = i === 0 ? 'FEATURED GAME' : 'TOP PICK';
    const title = document.createElement('strong'); title.textContent = game.title;
    const hint = document.createElement('small'); hint.textContent = 'Tap to jump in  →';
    copy.append(tag, title, hint); card.append(art, copy); card.addEventListener('click', () => openGame(game)); featuredTrack.appendChild(card);
    const dot = document.createElement('button'); dot.className = 'slider-dot'; dot.type = 'button'; dot.setAttribute('aria-label', `Show ${game.title}`); dot.addEventListener('click', () => showFeatured(i)); sliderDots.appendChild(dot);
  });
  showFeatured(0);
  clearInterval(featuredTimer);
  if (featured.length > 1) featuredTimer = setInterval(() => showFeatured((featuredIndex + 1) % featured.length), 4200);
}
function showFeatured(index) {
  const count = featuredTrack.children.length;
  if (!count) return;
  featuredIndex = (index + count) % count;
  featuredTrack.style.transform = `translateX(-${featuredIndex * 100}%)`;
  [...sliderDots.children].forEach((dot, i) => dot.classList.toggle('active', i === featuredIndex));
}

async function loadGames() {
  try {
    GAMES = await (await fetch('games.json')).json();
    GAMES.forEach((g) => grid.appendChild(makeTile(g)));
    gameCount.innerHTML = ic('gamepad') + ` ${GAMES.length} GAMES`;
    renderGenres();
    applySort();
    renderRecent();
    renderDaily();
    renderFeatured();
    updateOnline();
  } catch {
    grid.textContent = "Couldn't load games.json";
  }
}

let swipeStartX = null;
const featuredWindow = document.querySelector('.featured-window');
featuredWindow.addEventListener('touchstart', (e) => { swipeStartX = e.touches[0].clientX; }, { passive: true });
featuredWindow.addEventListener('touchend', (e) => {
  if (swipeStartX === null) return;
  const dx = e.changedTouches[0].clientX - swipeStartX;
  if (Math.abs(dx) > 35) { showFeatured(featuredIndex + (dx < 0 ? 1 : -1)); clearInterval(featuredTimer); featuredTimer = setInterval(() => showFeatured(featuredIndex + 1), 4200); }
  swipeStartX = null;
}, { passive: true });

/* ---------- کیٹیگری اور سرچ ---------- */
const GENRE_ICON = { racing: 'car', board: 'dice', puzzle: 'puzzle', arcade: 'joystick', sports: 'ball' };
function renderGenres() {
  const tags = [...new Set(GAMES.flatMap((g) => g.tags || []))].sort();
  genresEl.textContent = '';
  genresEl.hidden = tags.length === 0;
  [null, ...tags].forEach((t) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'genre';
    b.dataset.tag = t || '';
    b.setAttribute('aria-pressed', String(t === activeTag));
    b.innerHTML = ic(t ? (GENRE_ICON[t] || 'gamepad') : 'gamepad') + `<span>${t ? t[0].toUpperCase() + t.slice(1) : 'All'}</span>`;
    genresEl.appendChild(b);
  });
}
genresEl.addEventListener('click', (e) => {
  const b = e.target.closest('.genre');
  if (!b) return;
  activeTag = b.dataset.tag || null;
  genresEl.querySelectorAll('.genre').forEach((c) =>
    c.setAttribute('aria-pressed', String((c.dataset.tag || null) === activeTag)));
  applyFilters();
});

function applyFilters() {
  const q = query.trim().toLowerCase();
  let shown = 0;

  TILES.forEach(({ game, card }) => {
    const okCat = activeCat === null || (game.players || []).includes(activeCat);
    const okQuery = !q || (game.title || '').toLowerCase().includes(q);
    const okTag = activeTag === null || (game.tags || []).includes(activeTag);
    const show = okCat && okQuery && okTag;
    card.hidden = !show;
    if (show) shown++;
  });

  gameCount.innerHTML = ic('gamepad') + ` ${shown} / ${GAMES.length} GAMES`;

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

function openSearch() {
  searchPanel.hidden = false;
  searchToggle.setAttribute('aria-expanded', 'true');
  searchToggle.setAttribute('aria-label', 'Search is open');
  requestAnimationFrame(() => searchInput.focus());
}
function closeSearch() {
  searchPanel.hidden = true;
  searchToggle.setAttribute('aria-expanded', 'false');
  searchToggle.setAttribute('aria-label', 'Open search');
  if (!searchInput.value) { query = ''; applyFilters(); }
}
searchToggle.addEventListener('click', () => searchPanel.hidden ? openSearch() : closeSearch());
searchClose.addEventListener('click', () => {
  searchInput.value = ''; query = ''; applyFilters(); closeSearch();
});
searchInput.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSearch(); });

/* ---------- گیم کھولنا / بند کرنا ---------- */
// اوپر کی اسٹیٹس بار کا رنگ: گیم میں گیم کا، ہوم پر سفید
const themeMeta = document.querySelector('meta[name="theme-color"]');
function setBarColor(color) {
  if (themeMeta) themeMeta.setAttribute('content', color);
}

// فل اسکرین اب manifest.json سے پوری ایپ کے لیے ہے، الگ سے مانگنے کی ضرورت نہیں
// گیم کے آئی فریم کا سائز پکا رکھنا: اینڈرائیڈ کی پٹیاں آئیں تو گیم سکڑے نہیں،
// پٹی بس اس کے نچلے حصے کے اوپر آ جائے۔ صرف فون گھمانے (چوڑائی بدلنے) پر سائز بدلتا ہے،
// اور اونچائی صرف بڑھنے پر بڑھتی ہے، گھٹنے پر نہیں۔
let lock = null;
function applyLock() {
  if (!lock) return;
  frame.style.width = lock.w + 'px';
  frame.style.height = lock.h + 'px';
}
window.addEventListener('resize', () => {
  if (!lock) return;
  if (innerWidth !== lock.w) lock = { w: innerWidth, h: innerHeight };
  else if (innerHeight > lock.h) lock.h = innerHeight;
  applyLock();
});

/* ---------- اسٹیٹس، اسٹریک، ڈیلی چیلنج اور بیجز ---------- */
const dayKey = (d = new Date()) =>
  d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

function loadStats() {
  try {
    const s = JSON.parse(localStorage.getItem('hubStats') || '{}');
    return { games: s.games || {}, days: s.days || [], daily: s.daily || [], best: s.best || 0 };
  } catch { return { games: {}, days: [], daily: [], best: 0 }; }
}
function saveStats(s) { try { localStorage.setItem('hubStats', JSON.stringify(s)); } catch {} }

function calcStreak(days) {
  const set = new Set(days);
  const d = new Date();
  if (!set.has(dayKey(d))) d.setDate(d.getDate() - 1); // آج ابھی نہیں کھیلا تو کل تک کی لڑی گنو
  let n = 0;
  while (set.has(dayKey(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
function fmtTime(ms) {
  const m = Math.floor(ms / 60000);
  if (m < 60) return m + 'm';
  return Math.floor(m / 60) + 'h ' + (m % 60) + 'm';
}
// آج کی گیم: تاریخ سے طے ہوتی ہے، سب کے لیے دن بھر ایک ہی
function dailyGame() {
  if (!GAMES.length) return null;
  let h = 0;
  for (const c of dayKey()) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return GAMES[h % GAMES.length];
}

const BADGES = [
  { id: 'first',   icon: 'gamepad', name: 'First Play',     desc: 'Play any game',               test: (s) => totalPlays(s) >= 1 },
  { id: 'explore', icon: 'compass', name: 'Explorer',       desc: 'Try 5 different games',       test: (s) => Object.keys(s.games).length >= 5 },
  { id: 'all',     icon: 'star', name: 'Collector',      desc: 'Try every game in the hub',   test: (s) => GAMES.length > 0 && GAMES.every((g) => s.games[g.url]) },
  { id: 'loyal',   icon: 'bolt', name: 'Loyal Fan',      desc: 'Play one game 10 times',      test: (s) => Object.values(s.games).some((g) => g.plays >= 10) },
  { id: 'hour',    icon: 'stopwatch', name: 'Marathon',       desc: 'Play for 1 hour in total',    test: (s) => totalMs(s) >= 3600000 },
  { id: 'daily',   icon: 'target', name: 'Challenger',     desc: 'Finish a Daily Challenge',    test: (s) => s.daily.length >= 1 },
  { id: 's3',      icon: 'fire', name: 'On Fire',        desc: '3 day streak',                test: (s) => s.best >= 3 },
  { id: 's7',      icon: 'rocket', name: 'Unstoppable',    desc: '7 day streak',                test: (s) => s.best >= 7 },
  { id: 'fav',     icon: 'heart', name: 'Collector\'s Heart', desc: 'Save 3 favourite games',  test: () => loadSaved().length >= 3 },
];
const totalPlays = (s) => Object.values(s.games).reduce((a, g) => a + g.plays, 0);
const totalMs = (s) => Object.values(s.games).reduce((a, g) => a + (g.ms || 0), 0);

function loadAch() { try { return JSON.parse(localStorage.getItem('hubAch') || '{}'); } catch { return {}; } }
function checkAch() {
  const s = loadStats(), got = loadAch();
  const fresh = BADGES.filter((b) => !got[b.id] && b.test(s));
  if (!fresh.length) return;
  fresh.forEach((b) => { got[b.id] = Date.now(); });
  try { localStorage.setItem('hubAch', JSON.stringify(got)); } catch {}
  toast(ic('trophy') + ' Badge unlocked: ' + fresh.map((b) => b.name).join(', '), true);
}

// گیم کھلنے پر: پلے گنتی، آج کا دن، ڈیلی چیلنج
let sess = null; // { url, t (چل رہا وقت یا null), acc }
function sessStart(game) {
  const s = loadStats();
  const g = s.games[game.url] || { plays: 0, ms: 0 };
  g.plays++;
  s.games[game.url] = g;
  const today = dayKey();
  if (!s.days.includes(today)) s.days.push(today);
  s.days = s.days.slice(-400);
  const dg = dailyGame();
  if (dg && dg.url === game.url && !s.daily.includes(today)) s.daily.push(today);
  s.best = Math.max(s.best, calcStreak(s.days));
  saveStats(s);
  sess = { url: game.url, t: Date.now(), acc: 0 };
}
function sessEnd() {
  if (!sess) return;
  if (sess.t) sess.acc += Date.now() - sess.t;
  const s = loadStats();
  const g = s.games[sess.url] || { plays: 1, ms: 0 };
  g.ms = (g.ms || 0) + sess.acc;
  s.games[sess.url] = g;
  saveStats(s);
  sess = null;
  renderDaily();
  checkAch();
  if (sortMode() === 'most') applySort();
}
// ایپ پس منظر میں جائے تو وقت رک جائے
document.addEventListener('visibilitychange', () => {
  if (!sess) return;
  if (document.hidden) { if (sess.t) { sess.acc += Date.now() - sess.t; sess.t = null; } }
  else if (!sess.t) sess.t = Date.now();
});

function renderDaily() {
  const sec = document.getElementById('dailySection');
  const game = dailyGame();
  sec.hidden = !game;
  if (!game) return;
  const s = loadStats();
  const streak = calcStreak(s.days);
  const done = s.daily.includes(dayKey());
  sec.textContent = '';

  const head = document.createElement('div');
  head.className = 'section-heading';
  head.innerHTML = '<div><span class="eyebrow">COME BACK EVERY DAY</span><h2>' + ic('target') + ' Daily Challenge</h2></div>';
  const pill = document.createElement('div');
  pill.className = 'streak-pill' + (streak ? ' on' : '');
  pill.innerHTML = ic('fire') + ' ' + streak + (streak === 1 ? ' day' : ' days');
  head.appendChild(pill);

  const card = document.createElement('div');
  card.className = 'daily-card' + (done ? ' done' : '');
  const art = document.createElement('div');
  art.className = 'recent-art';
  art.style.background = `linear-gradient(135deg, ${game.color || '#253b85'}, #17152f)`;
  art.textContent = letterOf(game);
  fillIcon(art, game);
  const info = document.createElement('div');
  info.className = 'recent-info';
  const tag = document.createElement('span'); tag.className = 'mini-tag'; tag.innerHTML = done ? 'COMPLETED TODAY ' + ic('check') : "TODAY'S PICK";
  const title = document.createElement('strong'); title.textContent = game.title;
  const week = document.createElement('div'); week.className = 'week';
  const played = new Set(s.days);
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const dot = document.createElement('span');
    dot.className = 'wd' + (played.has(dayKey(d)) ? ' on' : '') + (i === 0 ? ' today' : '');
    week.appendChild(dot);
  }
  info.append(tag, title, week);
  const play = document.createElement('button');
  play.className = 'continue-btn daily-btn'; play.type = 'button';
  play.innerHTML = ic('play') + (done ? ' Again' : ' Play');
  play.addEventListener('click', () => openGame(game));
  card.append(art, info, play);
  sec.append(head, card);
}

function renderStats() {
  const s = loadStats();
  const box = document.getElementById('statsBox');
  box.textContent = '';
  const items = [
    [totalPlays(s), 'Plays'],
    [fmtTime(totalMs(s)), 'Played'],
    [calcStreak(s.days), 'Streak'],
    [Math.max(s.best, calcStreak(s.days)), 'Best'],
  ];
  items.forEach(([v, l]) => {
    const t = document.createElement('div'); t.className = 'stat';
    t.innerHTML = '<b></b><small></small>';
    t.firstChild.textContent = v; t.lastChild.textContent = l;
    box.appendChild(t);
  });

  const mp = document.getElementById('mostPlayed');
  mp.textContent = '';
  const top = GAMES.map((g) => ({ g, p: (s.games[g.url] || {}).plays || 0 }))
    .filter((x) => x.p > 0).sort((a, b) => b.p - a.p).slice(0, 3);
  if (top.length) {
    const t = document.createElement('div'); t.className = 'mp-title'; t.textContent = 'MOST PLAYED';
    mp.appendChild(t);
    top.forEach((x, i) => {
      const r = document.createElement('div'); r.className = 'mp-row';
      const n = document.createElement('span'); n.innerHTML = ic('medal', 'm' + (i + 1)); n.append(' ' + x.g.title);
      const c = document.createElement('small');
      c.textContent = x.p + '× · ' + fmtTime((s.games[x.g.url] || {}).ms || 0);
      r.append(n, c); mp.appendChild(r);
    });
  }

  const got = loadAch();
  const grid = document.getElementById('badgeGrid');
  grid.textContent = '';
  BADGES.forEach((b) => {
    const el = document.createElement('div');
    el.className = 'badge' + (got[b.id] ? ' on' : '');
    el.innerHTML = '<i></i><b></b><small></small>';
    el.children[0].innerHTML = ic(got[b.id] ? b.icon : 'lock');
    el.children[1].textContent = b.name;
    el.children[2].textContent = b.desc;
    grid.appendChild(el);
  });
  document.getElementById('badgeCount').textContent = `${Object.keys(got).length}/${BADGES.length}`;
}

/* ---------- تھیم: System (ڈیفالٹ) / Dark / Light ---------- */
const THEME_KEY = 'hubTheme';
const MODES = { system: ['monitor', 'System'], dark: ['moon', 'Dark'], light: ['sun', 'Light'] };
const BAR = { dark: '#090d1c', light: '#f3f5fb' };   // اسٹیٹس بار کا رنگ
const mqLight = window.matchMedia('(prefers-color-scheme: light)');
function getMode() {
  try { const m = localStorage.getItem(THEME_KEY); return MODES[m] ? m : 'system'; } catch { return 'system'; }
}
const effectiveTheme = () => { const m = getMode(); return m === 'system' ? (mqLight.matches ? 'light' : 'dark') : m; };
function applyTheme() {
  const mode = getMode(), t = effectiveTheme();
  document.documentElement.dataset.theme = t;
  if (player.hidden) setBarColor(BAR[t]);
  document.getElementById('themeIc').innerHTML = ic(MODES[mode][0]);
  document.getElementById('themeCur').textContent = mode === 'system' ? `System · ${t === 'light' ? 'Light' : 'Dark'}` : MODES[mode][1];
  document.querySelectorAll('.theme-opt').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.mode === mode)));
}
const themeBtn = document.getElementById('themeBtn');
const themeOpts = document.getElementById('themeOpts');
themeBtn.addEventListener('click', () => {
  const open = themeOpts.hidden;
  themeOpts.hidden = !open;
  themeBtn.setAttribute('aria-expanded', String(open));
  themeBtn.classList.toggle('expanded', open);
});
themeOpts.addEventListener('click', (e) => {
  const b = e.target.closest('.theme-opt');
  if (!b) return;
  try { localStorage.setItem(THEME_KEY, b.dataset.mode); } catch {}
  applyTheme();
});
// سسٹم کی سیٹنگ بدلے اور ہم "System" پر ہوں تو خود بدل جائے
mqLight.addEventListener('change', () => { if (getMode() === 'system') applyTheme(); });

/* ---------- ترتیب (Sort) ---------- */
const SORT_KEY = 'hubSort';
const sortSel = document.getElementById('sortSel');
function sortMode() { try { const m = localStorage.getItem(SORT_KEY); return ['default','az','new','most'].includes(m) ? m : 'default'; } catch { return 'default'; } }
function applySort() {
  const mode = sortMode();
  const plays = loadStats().games;
  const base = TILES.map((t, i) => ({ ...t, i }));
  base.sort((a, b) => {
    if (mode === 'az') return a.game.title.localeCompare(b.game.title, undefined, { sensitivity: 'base' });
    if (mode === 'new') return (b.game.added || '').localeCompare(a.game.added || '') || a.i - b.i;
    if (mode === 'most') return (((plays[b.game.url] || {}).plays || 0) - ((plays[a.game.url] || {}).plays || 0)) || a.i - b.i;
    return a.i - b.i;
  });
  base.forEach(({ card }) => grid.appendChild(card));
  sortSel.value = mode;
}
sortSel.addEventListener('change', () => {
  try { localStorage.setItem(SORT_KEY, sortSel.value); } catch {}
  applySort();
});

/* ---------- شیئر ---------- */
async function shareGame(game) {
  const data = { title: game.title, text: `Play ${game.title} on Games Hub`, url: game.url };
  try {
    if (navigator.share) { await navigator.share(data); return; }
  } catch (e) { if (e && e.name === 'AbortError') return; }
  try { await navigator.clipboard.writeText(game.url); toast('Link copied'); }
  catch { toast(game.url); }
}

/* ---------- سیٹنگز پینل ---------- */
const setBtn = document.getElementById('setBtn');
const setPanel = document.getElementById('setPanel');
const holdRange = document.getElementById('holdRange');
const holdVal = document.getElementById('holdVal');
const vibeSwitch = document.getElementById('vibeSwitch');
function syncSettingsUI() {
  holdRange.value = settings.hold;
  holdVal.textContent = (settings.hold / 1000).toFixed(1) + 's';
  vibeSwitch.setAttribute('aria-checked', String(settings.vibe));
}
setBtn.addEventListener('click', () => {
  const open = setPanel.hidden;
  setPanel.hidden = !open;
  setBtn.setAttribute('aria-expanded', String(open));
  setBtn.classList.toggle('expanded', open);
});
holdRange.addEventListener('input', () => {
  settings.hold = HOLD_MS = Number(holdRange.value);
  closeBtn.style.setProperty('--hold', HOLD_MS + 'ms');
  holdVal.textContent = (HOLD_MS / 1000).toFixed(1) + 's';
});
holdRange.addEventListener('change', saveSettings);
vibeSwitch.addEventListener('click', () => {
  settings.vibe = !settings.vibe;
  saveSettings(); syncSettingsUI(); buzz(30);
});
document.getElementById('resetX').addEventListener('click', () => {
  try { localStorage.removeItem('hubXPos'); } catch {}
  frac = { x: 1, y: 0.5 }; placeBtn();
  toast('Close button position reset');
});
document.getElementById('clearRecent').addEventListener('click', () => { clearRecent(); toast('Recently played cleared'); });
document.getElementById('resetStats').addEventListener('click', () => {
  if (!confirm('Reset all stats, streak and badges?')) return;
  try { localStorage.removeItem('hubStats'); localStorage.removeItem('hubAch'); } catch {}
  renderStats(); renderDaily(); applySort();
  toast('Stats & badges reset');
});

/* ---------- آف لائن ---------- */
let toastTimer = null;
function toast(msg, html = false) {
  if (html) toastEl.innerHTML = msg; else toastEl.textContent = msg;
  toastEl.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toastEl.hidden = true; }, 2600);
}
// games.json میں "offline": true لکھی گیم بغیر نیٹ بھی کھلے گی (جب وہ گیم خود آف لائن چلتی ہو)
const needsNet = (game) => game.offline !== true;
function updateOnline() {
  const off = !navigator.onLine;
  document.body.classList.toggle('offline', off);
  offlineBar.hidden = !off;
  TILES.forEach(({ game, card }) => card.classList.toggle('needs-net', off && needsNet(game)));
}
window.addEventListener('online', () => { updateOnline(); toast('Back online'); });
window.addEventListener('offline', updateOnline);

/* ---------- گیم کھولنا / بند کرنا (Back بٹن کے ساتھ) ---------- */
function openGame(game) {
  if (!navigator.onLine && needsNet(game)) {
    toast(`${game.title} needs internet`);
    return;
  }
  buzz(15);
  setRecent(game.url);
  renderRecent();
  sessEnd();
  sessStart(game);
  renderDaily();
  setBarColor(game.bar || game.color || '#ffffff');
  frame.src = game.url;
  player.hidden = false;
  lock = { w: innerWidth, h: innerHeight };
  applyLock();
  // ایک history اندراج، تاکہ فون کا Back بٹن گیم بند کرے، ایپ نہیں
  if (!(history.state && history.state.game)) history.pushState({ game: true }, '');
}
function hidePlayer() {
  sessEnd();
  player.hidden = true;
  frame.src = 'about:blank';
  setBarColor(BAR[effectiveTheme()]);
  lock = null;
  frame.style.width = '';
  frame.style.height = '';
}
function closeGame() {
  if (player.hidden) return;
  hidePlayer();
  if (history.state && history.state.game) history.back(); // اندراج صاف
}
window.addEventListener('popstate', () => {
  if (!player.hidden) hidePlayer(); // Back دبا: گیم بند، ہوم پر واپس
});

/* ---------- X بٹن: پکڑ کر ادھر ادھر رکھیں، ٹھہر کر دبائیں تو بند ---------- */
const BTN = 56;       // بٹن کا سائز
const RING_R = 70;    // دبانے پر بڑا ہو کر بٹن اتنا پھیلتا ہے
const DRAG_PX = 10;   // اس سے زیادہ ہلے تو کھینچنا سمجھا جائے، بند نہیں ہوگا
let holdTimer = null;
let press = null;     // موجودہ دباؤ کی معلومات
let frac = { x: 1, y: 0.5 }; // مقام اسکرین کے تناسب میں، تاکہ فون گھمانے پر بھی ٹھیک رہے
try {
  const s = JSON.parse(localStorage.getItem('hubXPos'));
  if (s && isFinite(s.x) && isFinite(s.y)) frac = { x: Math.min(1, Math.max(0, s.x)), y: Math.min(1, Math.max(0, s.y)) };
} catch {}

function placeBtn() {
  closeBtn.style.left = frac.x * (innerWidth - BTN) + 'px';
  closeBtn.style.top = frac.y * (innerHeight - BTN) + 'px';
}

function startHold(e) {
  e.preventDefault();
  try { closeBtn.setPointerCapture(e.pointerId); } catch {}
  const ox = frac.x * (innerWidth - BTN);
  const oy = frac.y * (innerHeight - BTN);
  press = { sx: e.clientX, sy: e.clientY, ox, oy, moved: false };

  // دبانے پر بڑا ہو کر بھی سرکل اسکرین کے اندر رہے
  const lim = (c, max) =>
    max < 2 * RING_R ? max / 2 - c : Math.min(Math.max(c, RING_R), max - RING_R) - c;
  closeBtn.style.setProperty('--sx', lim(ox + BTN / 2, innerWidth) + 'px');
  closeBtn.style.setProperty('--sy', lim(oy + BTN / 2, innerHeight) + 'px');

  closeBtn.classList.add('holding');          // سرکل بھرنا شروع
  clearTimeout(holdTimer);
  holdTimer = setTimeout(() => {
    endPress();
    closeGame();
  }, HOLD_MS);
}

function onMove(e) {
  if (!press) return;
  const dx = e.clientX - press.sx;
  const dy = e.clientY - press.sy;
  if (!press.moved) {
    if (Math.hypot(dx, dy) < DRAG_PX) return;
    // ہاتھ ہل گیا: یہ کھینچنا ہے، بند کرنے کا ٹائمر ختم
    press.moved = true;
    clearTimeout(holdTimer);
    holdTimer = null;
    closeBtn.classList.remove('holding');
    closeBtn.classList.add('dragging');
  }
  const x = Math.min(Math.max(0, press.ox + dx), innerWidth - BTN);
  const y = Math.min(Math.max(0, press.oy + dy), innerHeight - BTN);
  frac = { x: x / (innerWidth - BTN), y: y / (innerHeight - BTN) };
  placeBtn();
}

function endPress() {
  clearTimeout(holdTimer);
  holdTimer = null;
  if (press && press.moved) {
    try { localStorage.setItem('hubXPos', JSON.stringify(frac)); } catch {}  // نئی جگہ یاد رکھو
  }
  press = null;
  closeBtn.classList.remove('holding', 'dragging'); // سرکل واپس خالی، گیم چلتی رہے گی
}

closeBtn.addEventListener('pointerdown', startHold);
closeBtn.addEventListener('pointermove', onMove);
closeBtn.addEventListener('pointerup', endPress);
closeBtn.addEventListener('pointercancel', endPress);
closeBtn.addEventListener('lostpointercapture', endPress);
closeBtn.addEventListener('contextmenu', (e) => e.preventDefault());
window.addEventListener('resize', placeBtn);
placeBtn();

/* ---------- انسٹال بٹن (صرف براؤزر میں نظر آئے) ---------- */
const installBtn = document.getElementById('installBtn');
let installEvent = null;
const isInstalled = () =>
  window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();          // براؤزر کا اپنا چھوٹا بینر روک کر ہم اپنے بٹن سے دکھائیں گے
  installEvent = e;
  if (!isInstalled()) installBtn.hidden = false;
});

installBtn.addEventListener('click', async () => {
  if (!installEvent) return;
  installEvent.prompt();       // گوگل کا انسٹال ڈائیلاگ
  try { await installEvent.userChoice; } catch {}
  installEvent = null;         // ایک ایونٹ سے ایک ہی بار prompt چلتا ہے
  installBtn.hidden = true;
});

window.addEventListener('appinstalled', () => {
  installEvent = null;
  installBtn.hidden = true;
});

/* ---------- شروع ---------- */
if (history.state && history.state.game) history.replaceState(null, ''); // ریفریش کے بعد پرانا اندراج صاف
syncSettingsUI();
applyTheme();
loadGames();
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
