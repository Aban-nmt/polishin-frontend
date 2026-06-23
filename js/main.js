// ── API CONFIG ──
const API = 'https://polishin-backend-production.up.railway.app/api';

// ── NAV SCROLL ──
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => nav?.classList.toggle('scrolled', window.scrollY > 50));

// ── MOBILE MENU ──
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
toggle?.addEventListener('click', () => navLinks?.classList.toggle('open'));

// ── ACTIVE NAV LINK ──
const path = window.location.pathname;
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href && path.endsWith(href)) a.classList.add('active');
});

// ── SCROLL ANIMATIONS ──
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// ── COUNTER ANIMATION ──
function animateCount(el, target, suffix) {
  let start = 0;
  const dur = 1800;
  const step = ts => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(e * target) + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const statsObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('[data-count]').forEach(el => {
        animateCount(el, +el.dataset.count, el.dataset.suffix || '');
      });
      statsObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelector('.stats-bar') && statsObs.observe(document.querySelector('.stats-bar'));

// ── SMOOTH ANCHORS ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    navLinks?.classList.remove('open');
  });
});

// ── 3D BACKGROUND ──
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, points = [];
  let mouse = { x: 0.5, y: 0.5 }, target = { x: 0.5, y: 0.5 };
  const COUNT = 110;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    init();
  }

  function init() {
    points = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      z: Math.random() * 2.2 + 0.3,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r: Math.random() * 1.6 + 0.4,
      gold: Math.random() < 0.2,
      pulse: Math.random() * Math.PI * 2,
    }));
  }

  window.addEventListener('mousemove', e => { target.x = e.clientX / W; target.y = e.clientY / H; });
  window.addEventListener('mouseleave', () => { target.x = 0.5; target.y = 0.5; });

  const lerp = (a, b, t) => a + (b - a) * t;

  function draw() {
    mouse.x = lerp(mouse.x, target.x, 0.035);
    mouse.y = lerp(mouse.y, target.y, 0.035);
    ctx.clearRect(0, 0, W, H);
    const mx = mouse.x * W, my = mouse.y * H;
    const tx = (mouse.x - 0.5) * 80, ty = (mouse.y - 0.5) * 50;

    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      const px = p.x + tx * p.z * 0.25;
      const py = p.y + ty * p.z * 0.25;
      for (let j = i + 1; j < points.length; j++) {
        const q = points[j];
        const qx = q.x + tx * q.z * 0.25;
        const qy = q.y + ty * q.z * 0.25;
        const dx = px - qx, dy = py - qy;
        const d = Math.sqrt(dx * dx + dy * dy);
        const thr = 115 + ((p.z + q.z) / 2) * 22;
        if (d < thr) {
          const a = (1 - d / thr) * 0.2 * ((p.z + q.z) / 2);
          ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(qx, qy);
          ctx.strokeStyle = (p.gold || q.gold) ? `rgba(200,168,75,${a})` : `rgba(192,192,192,${a * 0.5})`;
          ctx.lineWidth = 0.5; ctx.stroke();
        }
      }
    }

    for (const p of points) {
      p.pulse += 0.016;
      const pf = 1 + Math.sin(p.pulse) * 0.12;
      const px = p.x + tx * p.z * 0.25;
      const py = p.y + ty * p.z * 0.25;
      const mdx = px - mx, mdy = py - my;
      const md = Math.sqrt(mdx * mdx + mdy * mdy);
      const glow = Math.max(0, 1 - md / 155);
      const alpha = (0.18 + p.z * 0.26 + glow * 0.65) * pf;
      const rad = p.r * p.z * pf + glow * 3;

      ctx.beginPath(); ctx.arc(px, py, rad, 0, Math.PI * 2);
      ctx.fillStyle = p.gold ? `rgba(200,168,75,${alpha})` : `rgba(192,192,192,${alpha * 0.6})`;
      ctx.fill();

      if (glow > 0.2) {
        ctx.beginPath(); ctx.arc(px, py, rad + 4, 0, Math.PI * 2);
        ctx.strokeStyle = p.gold ? `rgba(200,168,75,${glow * 0.4})` : `rgba(255,255,255,${glow * 0.15})`;
        ctx.lineWidth = 0.8; ctx.stroke();
      }

      if (md < 120 && md > 0) { const f = (120 - md) / 120 * 0.5; p.vx += (mdx / md) * f; p.vy += (mdy / md) * f; }
      p.vx *= 0.978; p.vy *= 0.978; p.x += p.vx; p.y += p.vy;
      if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20;
      if (p.y < -20) p.y = H + 20; if (p.y > H + 20) p.y = -20;
    }

    const grd = ctx.createRadialGradient(mx, my, 0, mx, my, 200);
    grd.addColorStop(0, 'rgba(200,168,75,0.05)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grd; ctx.fillRect(0, 0, W, H);
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();
})();
