// PoliShin API Connector
// وقتی بک‌اند رو روی Railway دپلوی کردی، آدرسش رو اینجا بذار
const API_BASE = window.location.hostname === 'localhost'
  ? 'http://localhost:5000/api'
  : : 'https://polishin-backend-production.up.railway.app/api'; // ← بعد از deploy عوض کن

// ── CONTACT FORM ──
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type=submit]');
    const originalText = btn.textContent;

    btn.textContent = 'در حال ارسال...';
    btn.disabled = true;

    const data = {
      name:     contactForm.querySelector('input[type=text]').value,
      phone:    contactForm.querySelector('input[type=tel]').value,
      business: contactForm.querySelector('select')?.value || '',
      message:  contactForm.querySelector('textarea').value,
    };

    try {
      const res = await fetch(`${API_BASE}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (json.success) {
        btn.textContent = '✓ پیام ارسال شد';
        btn.style.background = '#2a7a4a';
        contactForm.reset();
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 4000);
      } else {
        throw new Error(json.message);
      }
    } catch (err) {
      btn.textContent = '⚠ خطا — دوباره تلاش کنید';
      btn.style.background = '#7a2a2a';
      btn.disabled = false;
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
      }, 3000);
    }
  });
}

// ── LOAD ARTICLES FROM API ──
async function loadArticles() {
  const grid = document.querySelector('.articles-grid');
  if (!grid) return;

  try {
    const res  = await fetch(`${API_BASE}/articles?limit=3`);
    const json = await res.json();
    if (!json.success || !json.data.length) return;

    grid.innerHTML = json.data.map(a => `
      <a href="pages/article.html?slug=${a.slug}" class="article-card fade-up">
        <div class="article-thumb">
          ${a.image
            ? `<img src="${API_BASE.replace('/api','')}${a.image}" alt="${a.title}" style="width:100%;height:100%;object-fit:cover;"/>`
            : '<span style="color:#444;font-size:0.75rem;">تصویر مقاله</span>'
          }
        </div>
        <div class="article-body">
          <span class="article-tag">${a.category}</span>
          <h3>${a.title}</h3>
          <p>${a.summary.substring(0, 100)}...</p>
          <div class="article-meta">
            <span class="article-date">${new Date(a.createdAt).toLocaleDateString('fa-IR')}</span>
            <span class="article-read">${a.readTime} مطالعه ←</span>
          </div>
        </div>
      </a>
    `).join('');

    // re-observe new elements for animations
    document.querySelectorAll('.fade-up').forEach(el => {
      if (!el.classList.contains('visible')) observer.observe(el);
    });
  } catch (err) {
    console.log('API not connected yet — showing static content');
  }
}

loadArticles();
