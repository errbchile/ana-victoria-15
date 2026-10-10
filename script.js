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
    // picsum legacy: usa versión grande; fotos locales: mismo src
    lbImg.src = img.src.includes('picsum.photos')
      ? img.src.replace('/600/760', '/900/1100')
      : img.src;
    lbImg.alt = img.alt;
    lightbox.classList.remove('hidden');
  });
});
$('lbClose').addEventListener('click', () => lightbox.classList.add('hidden'));
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.add('hidden'); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') lightbox.classList.add('hidden'); });

// ---------- Escarcha dorada victoriana (polvo + estrellas) ----------
const canvas = $('petals');
const ctx = canvas.getContext('2d');
let motes = [];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = window.innerWidth < 480;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const COLORS = ['#8a6a2e', '#A87C33', '#C25A6B', '#C99A4A', '#FFF6E5'];

function makeMote(init) {
  const isSpark = Math.random() < 0.3; // 30% estrellas, 70% polvo
  return {
    type: isSpark ? 'spark' : 'dust',
    x: Math.random() * canvas.width,
    y: init ? Math.random() * canvas.height : -20,
    r: isSpark ? 6 + Math.random() * 6 : 1.6 + Math.random() * 1.8,
    vy: 0.15 + Math.random() * 0.4,
    vx: -0.4 + Math.random() * 0.8,
    swayAmp: 0.3 + Math.random() * 0.4,
    swayFreq: 0.008 + Math.random() * 0.02,
    phase: Math.random() * Math.PI * 2,
    rot: Math.random() * Math.PI * 2,
    vr: -0.01 + Math.random() * 0.02,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    alpha: 0.75 + Math.random() * 0.25,
    twinkleSpeed: 0.02 + Math.random() * 0.05,
  };
}
let rafId = null;
function drawFrost() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  motes.forEach((p) => {
    // misma caída que los pétalos + titileo de escarcha
    p.phase += p.swayFreq * 2;
    p.x += p.vx + Math.sin(p.phase) * p.swayAmp * 0.4;
    p.y += p.vy;
    p.rot += p.vr;
    p.twinklePhase = (p.twinklePhase || Math.random() * 10) + p.twinkleSpeed;
    if (p.y > canvas.height + 20) Object.assign(p, makeMote(false));
    const tw = 0.72 + 0.28 * Math.sin(p.twinklePhase);
    ctx.save();
    ctx.globalAlpha = p.alpha * tw * (isMobile ? 0.9 : 1.0);
    ctx.translate(p.x, p.y);
    if (p.type === 'dust') {
      ctx.shadowBlur = isMobile ? 5 : 6;
      ctx.shadowColor = 'rgba(110,20,40,0.55)';
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(0, 0, p.r, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const s = p.r * (0.7 + 0.45 * tw);
      ctx.rotate(p.rot * 0.3);
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1.8;
      ctx.lineCap = 'round';
      ctx.shadowBlur = isMobile ? 5 : 10;
      ctx.shadowColor = 'rgba(110,20,40,0.55)';
      // cruz de 4 puntas
      ctx.beginPath();
      ctx.moveTo(-s, 0); ctx.lineTo(s, 0);
      ctx.moveTo(0, -s); ctx.lineTo(0, s);
      ctx.stroke();
      // punto central marfil (no blanco puro para no quemar)
      ctx.fillStyle = '#FFFDF9';
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(1.2, p.r * 0.22), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  });
  rafId = requestAnimationFrame(drawFrost);
}
if (!reducedMotion) {
  const MOTE_COUNT = isMobile ? 35 : 60;
  for (let i = 0; i < MOTE_COUNT; i++) motes.push(makeMote(true));
  drawFrost();
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
    } else if (!rafId && !reducedMotion) {
      drawFrost();
    }
  });
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
