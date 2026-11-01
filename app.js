const grid = document.getElementById('grid');
const player = document.getElementById('player');
const frame = document.getElementById('frame');
const closeBtn = document.getElementById('closeBtn');

const HOLD_MS = 2000; // X کو اتنی دیر دبائے رکھنا ہے
closeBtn.style.setProperty('--hold', HOLD_MS + 'ms'); // سرکل کی اینیمیشن بھی اتنی ہی لمبی

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

/* ---------- ٹائلیں بنانا ---------- */
function makeTile(game) {
  const btn = document.createElement('button');
  btn.className = 'tile';

  const icon = document.createElement('div');
  icon.className = 'icon';
  icon.style.background = game.color || '#2a2545';
  const letter = document.createElement('span');
  letter.textContent = (game.title || '?').trim().charAt(0).toUpperCase();
  icon.appendChild(letter);

  const name = document.createElement('div');
  name.className = 'name';
  name.textContent = game.title;

  btn.append(icon, name);
  btn.addEventListener('click', () => openGame(game));

  findIcon(game).then((href) => {
    if (!href) return;
    const img = new Image();
    img.alt = '';
    img.onload = () => { icon.textContent = ''; icon.appendChild(img); };
    img.src = href; // نہ کھلے تو حرف والا ٹائل ہی رہے گا
  });

  return btn;
}

async function loadGames() {
  try {
    const games = await (await fetch('games.json')).json();
    games.forEach((g) => grid.appendChild(makeTile(g)));
  } catch {
    grid.textContent = 'games.json لوڈ نہیں ہوئی';
  }
}

/* ---------- گیم کھولنا / بند کرنا ---------- */
function openGame(game) {
  frame.src = game.url;
  player.hidden = false;
}
function closeGame() {
  player.hidden = true;
  frame.src = 'about:blank';
}

/* ---------- X کو 3 سیکنڈ دبا کر بند کرنا ---------- */
let holdTimer = null;

function startHold(e) {
  e.preventDefault();
  try { closeBtn.setPointerCapture(e.pointerId); } catch {}
  closeBtn.classList.add('holding');          // سرکل بھرنا شروع (CSS میں 3 سیکنڈ)
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
