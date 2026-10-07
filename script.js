// Fecha del evento: 14 Nov 2026 19:30 Venezuela (UTC-4)
const EVENT_DATE = new Date('2026-11-14T19:30:00-04:00');

const $ = (id) => document.getElementById(id);

// ---------- Sobre de apertura ----------
const envelope = $('envelope');
const openBtn = $('openBtn');
let opened = false;

openBtn.addEventListener('click', () => {
  if (opened) return;
  opened = true;
  envelope.classList.add('hidden');
  document.body.style.overflow = '';
  // intenta iniciar música al abrir (gesto del usuario = permite audio)
  startMusic();
  // scroll suave al inicio
  setTimeout(() => document.querySelector('.hero').scrollIntoView({ behavior: 'smooth' }), 350);
});
// bloquear scroll mientras el sobre está visible
document.body.style.overflow = 'hidden';

// ---------- Cuenta regresiva ----------
function pad(n) { return String(n).padStart(2, '0'); }

function tickCountdown() {
  const now = new Date();
  const diff = EVENT_DATE - now;
  const doneEl = $('cd-done');
  if (diff <= 0) {
    $('cd-days').textContent = '00';
    $('cd-hours').textContent = '00';
    $('cd-mins').textContent = '00';
    $('cd-secs').textContent = '00';
    doneEl.classList.remove('hidden');
    return;
  }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor(diff / 3600000) % 24;
  const m = Math.floor(diff / 60000) % 60;
  const s = Math.floor(diff / 1000) % 60;
  $('cd-days').textContent = pad(d);
  $('cd-hours').textContent = pad(h);
  $('cd-mins').textContent = pad(m);
  $('cd-secs').textContent = pad(s);
}
tickCountdown();
setInterval(tickCountdown, 1000);

// ---------- Reveal on scroll ----------
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ---------- Lightbox galería ----------
const lightbox = $('lightbox');
const lbImg = $('lbImg');
document.querySelectorAll('.g-item img').forEach(img => {
  img.parentElement.addEventListener('click', () => {
    // usa versión más grande
    lbImg.src = img.src.replace('/600/760', '/900/1100');
    lbImg.alt = img.alt;
    lightbox.classList.remove('hidden');
  });
});
$('lbClose').addEventListener('click', () => lightbox.classList.add('hidden'));
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.add('hidden'); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') lightbox.classList.add('hidden'); });

// ---------- Pétalos dorados + rosas ----------
const canvas = $('petals');
const ctx = canvas.getContext('2d');
let petals = [];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const COLORS = ['#C99A4A', '#C25A6B', '#DD8E94', '#7E1E32', '#E8C987'];

function makePetal(init) {
  return {
    x: Math.random() * canvas.width,
    y: init ? Math.random() * canvas.height : -20,
    r: 3 + Math.random() * 6,
    vy: 0.4 + Math.random() * 1.1,
    vx: -0.4 + Math.random() * 0.8,
    rot: Math.random() * Math.PI * 2,
    vr: -0.02 + Math.random() * 0.04,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    alpha: 0.5 + Math.random() * 0.5
  };
}
if (!reducedMotion) {
  for (let i = 0; i < 42; i++) petals.push(makePetal(true));
  (function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(p => {
      p.x += p.vx + Math.sin(p.rot) * 0.4;
      p.y += p.vy;
      p.rot += p.vr;
      if (p.y > canvas.height + 20) Object.assign(p, makePetal(false));
      ctx.save();
      ctx.globalAlpha = p.alpha * 0.85;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      // pétalo: elipse
      ctx.beginPath();
      ctx.ellipse(0, 0, p.r, p.r * 0.62, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    requestAnimationFrame(draw);
  })();
}

// ---------- Música: vals ----------
// 1) Intenta usar /music/vals.mp3 si existe.
// 2) Si no existe, usa un vals sintetizado con WebAudio (para que el demo suene sin archivos).
const audioEl = $('valsAudio');
const musicBtn = $('musicBtn');
const musicState = $('musicState');
let playing = false;
let audioCtx = null, waltzTimer = null, useMp3 = false;

audioEl.addEventListener('error', () => { useMp3 = false; }, true);

// Vals sintetizado 3/4: bajo en 1, acordes en 2 y 3. Progresión elegante Am - Dm - E - Am
const CHORDS = [
  [110.0, [220.0, 261.63, 329.63]],  // Am
  [146.83, [293.66, 349.23, 440.0]], // Dm
  [164.81, [329.63, 415.30, 493.88]],// E
  [110.0, [220.0, 261.63, 329.63]],  // Am
  [196.0, [392.0, 493.88, 587.33]],  // G
  [130.81, [261.63, 329.63, 392.0]], // C
  [164.81, [329.63, 415.30, 493.88]],// E
  [110.0, [440.0, 523.25, 659.25]],  // Am alto (final frase)
];
let chordIdx = 0;

function note(freq, t, dur, vol, type = 'triangle') {
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.03);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(audioCtx.destination);
  o.start(t); o.stop(t + dur + 0.05);
}

function waltzBar() {
  if (!audioCtx || !playing || useMp3) return;
  const t = audioCtx.currentTime + 0.05;
  const beat = 0.62; // ~ vals lento elegante
  const [bass, chord] = CHORDS[chordIdx % CHORDS.length];
  note(bass / 2, t, beat * 1.1, 0.22, 'sine');
  chord.forEach(f => {
    note(f, t + beat, beat * 0.9, 0.07);
    note(f, t + beat * 2, beat * 0.95, 0.07);
  });
  // melodía sencilla arriba
  const melody = chord[2] * 2;
  note(melody, t + beat * 2, beat, 0.05, 'sine');
  chordIdx++;
}

async function startMusic() {
  if (playing) return;
  // ¿hay mp3 real? intenta cargarlo
  try {
    await audioEl.play().then(() => {}).catch(() => { throw 0; });
    useMp3 = true;
    playing = true;
  } catch {
    // fallback sintetizado
    useMp3 = false;
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') await audioCtx.resume();
    playing = true;
    waltzBar();
    waltzTimer = setInterval(waltzBar, 3 * 620);
  }
  musicBtn.classList.add('playing');
  musicState.textContent = useMp3 ? 'vals mp3' : 'vals en vivo';
}

function stopMusic() {
  playing = false;
  musicBtn.classList.remove('playing');
  musicState.textContent = 'pausado';
  if (useMp3) { audioEl.pause(); }
  if (waltzTimer) { clearInterval(waltzTimer); waltzTimer = null; }
}

musicBtn.addEventListener('click', () => { playing ? stopMusic() : startMusic(); });
