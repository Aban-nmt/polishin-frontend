(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, mouse = { x: 0.5, y: 0.5 }, target = { x: 0.5, y: 0.5 };
  let points = [], scrollY = 0;
  const COUNT = 120;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    init();
  }

  function init() {
    points = [];
    for (let i = 0; i < COUNT; i++) {
      points.push({
        x:    Math.random() * W,
        y:    Math.random() * H,
        z:    Math.random() * 2.5 + 0.2,
        vx:   (Math.random() - 0.5) * 0.25,
        vy:   (Math.random() - 0.5) * 0.25,
        r:    Math.random() * 1.8 + 0.4,
        gold: Math.random() < 0.2,
        pulse: Math.random() * Math.PI * 2,
      });
    }
  }

  window.addEventListener('mousemove', e => {
    target.x = e.clientX / W;
    target.y = e.clientY / H;
  });

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  });

  function lerp(a, b, t) { return a + (b - a) * t; }

  function draw() {
    mouse.x = lerp(mouse.x, target.x, 0.035);
    mouse.y = lerp(mouse.y, target.y, 0.035);

    ctx.clearRect(0, 0, W, H);

    const mx = mouse.x * W;
    const my = mouse.y * H;
    const tx = (mouse.x - 0.5) * 80;
    const ty = (mouse.y - 0.5) * 50;

    // connections
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      const px = p.x + tx * p.z * 0.25 - (scrollY * 0.02 * p.z);
      const py = p.y + ty * p.z * 0.25;

      for (let j = i + 1; j < points.length; j++) {
        const q = points[j];
        const qx = q.x + tx * q.z * 0.25 - (scrollY * 0.02 * q.z);
        const qy = q.y + ty * q.z * 0.25;

        const dx = px - qx, dy = py - qy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const thr  = 120 + ((p.z + q.z) / 2) * 25;

        if (dist < thr) {
          const alpha = (1 - dist / thr) * 0.22 * ((p.z + q.z) / 2);
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(qx, qy);
          ctx.strokeStyle = (p.gold || q.gold)
            ? `rgba(200,168,75,${alpha})`
            : `rgba(192,192,192,${alpha * 0.55})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // points
    for (const p of points) {
      p.pulse += 0.018;
      const pulseFactor = 1 + Math.sin(p.pulse) * 0.15;

      const px = p.x + tx * p.z * 0.25 - (scrollY * 0.02 * p.z);
      const py = p.y + ty * p.z * 0.25;

      const mdx = px - mx, mdy = py - my;
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      const glow  = Math.max(0, 1 - mdist / 160);

      const alpha  = (0.2 + p.z * 0.28 + glow * 0.65) * pulseFactor;
      const radius = p.r * p.z * pulseFactor + glow * 3;

      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);
      ctx.fillStyle = p.gold
        ? `rgba(200,168,75,${alpha})`
        : `rgba(192,192,192,${alpha * 0.65})`;
      ctx.fill();

      if (glow > 0.25 || (p.gold && glow > 0.1)) {
        ctx.beginPath();
        ctx.arc(px, py, radius + 4, 0, Math.PI * 2);
        ctx.strokeStyle = p.gold
          ? `rgba(200,168,75,${glow * 0.45})`
          : `rgba(255,255,255,${glow * 0.18})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // mouse repulsion
      if (mdist < 120 && mdist > 0) {
        const force = (120 - mdist) / 120 * 0.55;
        p.vx += (mdx / mdist) * force;
        p.vy += (mdy / mdist) * force;
      }

      p.vx *= 0.978;
      p.vy *= 0.978;
      p.x  += p.vx;
      p.y  += p.vy;

      if (p.x < -20) p.x = W + 20;
      if (p.x > W + 20) p.x = -20;
      if (p.y < -20) p.y = H + 20;
      if (p.y > H + 20) p.y = -20;
    }

    // mouse glow
    const grd = ctx.createRadialGradient(mx, my, 0, mx, my, 200);
    grd.addColorStop(0,   'rgba(200,168,75,0.055)');
    grd.addColorStop(0.5, 'rgba(200,168,75,0.018)');
    grd.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, H);

    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();
})();
