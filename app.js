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

const HOLD_MS = 1500; // X کو اتنی دیر دبائے رکھنا ہے
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

function openGame(game) {
  setBarColor(game.bar || game.color || '#ffffff');
  frame.src = game.url;
  player.hidden = false;
  lock = { w: innerWidth, h: innerHeight };
  applyLock();
}
function closeGame() {
  player.hidden = true;
  frame.src = 'about:blank';
  setBarColor('#ffffff');
  lock = null;
  frame.style.width = '';
  frame.style.height = '';
}

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
loadGames();
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
