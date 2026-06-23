// ── CMS LOADER ──
// Loads all settings from API and applies them to the page
const API = 'https://polishin-backend-production.up.railway.app/api';
const BACKEND = 'https://polishin-backend-production.up.railway.app';

window.SITE = {}; // global settings cache

async function loadCMS() {
  try {
    const res = await fetch(`${API}/settings`);
    const json = await res.json();
    if (!json.success) return;
    window.SITE = json.data;
    applyCMS(json.data);
  } catch (e) {
    console.log('CMS: using defaults');
  }
}

function applyCMS(s) {
  // ── SEO ──
  if (s.seo_site_title && !document.title.includes('|')) {
    // only override if page doesn't have its own title set
  }
  setMeta('description', s.seo_site_description);
  setMeta('keywords', s.seo_keywords);
  setMeta('og:title', s.seo_og_title, true);
  setMeta('og:description', s.seo_og_description, true);
  if (s.seo_og_image) setMeta('og:image', BACKEND + s.seo_og_image, true);

  // ── HERO ──
  setText('[data-cms="hero_badge"]', s.hero_badge);
  setText('[data-cms="hero_title_1"]', s.hero_title_1);
  setText('[data-cms="hero_title_2"]', s.hero_title_2);
  setText('[data-cms="hero_description"]', s.hero_description);
  setImage('[data-cms="hero_image"]', s.hero_image);

  // ── STATS ──
  setText('[data-cms="stat_1_number"]', s.stat_1_number);
  setText('[data-cms="stat_1_label"]', s.stat_1_label);
  setText('[data-cms="stat_2_number"]', s.stat_2_number);
  setText('[data-cms="stat_2_label"]', s.stat_2_label);
  setText('[data-cms="stat_3_number"]', s.stat_3_number);
  setText('[data-cms="stat_3_label"]', s.stat_3_label);
  setText('[data-cms="stat_4_number"]', s.stat_4_number);
  setText('[data-cms="stat_4_label"]', s.stat_4_label);

  // ── PRODUCT IMAGES ──
  setImage('[data-cms="product_image_main"]', s.product_image_main);
  setImage('[data-cms="product_image_side"]', s.product_image_side);
  setImage('[data-cms="product_image_top"]', s.product_image_top);
  setImage('[data-cms="product_image_poles"]', s.product_image_poles);

  // ── SPECS ──
  setText('[data-cms="spec_poles"]', s.spec_poles);
  setText('[data-cms="spec_center"]', s.spec_center);
  setText('[data-cms="spec_layout"]', s.spec_layout);
  setText('[data-cms="spec_thread"]', s.spec_thread);
  setText('[data-cms="spec_heating"]', s.spec_heating);
  setText('[data-cms="spec_display"]', s.spec_display);
  setText('[data-cms="spec_ui"]', s.spec_ui);
  setText('[data-cms="spec_usage"]', s.spec_usage);
  setText('[data-cms="spec_vessels"]', s.spec_vessels);

  // ── ABOUT ──
  setText('[data-cms="about_title"]', s.about_title);
  setText('[data-cms="about_p1"]', s.about_p1);
  setText('[data-cms="about_p2"]', s.about_p2);
  setText('[data-cms="about_p3"]', s.about_p3);
  setImage('[data-cms="about_image"]', s.about_image);

  // ── CONTACT ──
  setText('[data-cms="contact_phone"]', s.contact_phone || 'به زودی اضافه می‌شود');
  setText('[data-cms="contact_email"]', s.contact_email);
  setText('[data-cms="contact_address"]', s.contact_address);
  setText('[data-cms="contact_hours"]', s.contact_hours);
  setSocial('instagram', s.contact_instagram);
  setSocial('telegram', s.contact_telegram);
  setSocial('whatsapp', s.contact_whatsapp);
}

function setText(selector, value) {
  if (!value) return;
  document.querySelectorAll(selector).forEach(el => el.textContent = value);
}

function setImage(selector, value) {
  if (!value) return;
  document.querySelectorAll(selector).forEach(el => {
    if (el.tagName === 'IMG') {
      el.src = BACKEND + value;
      el.style.display = 'block';
      // hide placeholder if sibling
      const placeholder = el.closest('.img-placeholder, .cms-img-wrap');
      if (placeholder) {
        placeholder.querySelectorAll('.icon, .placeholder-text, span:not(img)')
          .forEach(p => p.style.display = 'none');
      }
    } else {
      // Replace placeholder div with image
      el.style.backgroundImage = `url(${BACKEND + value})`;
      el.style.backgroundSize = 'cover';
      el.style.backgroundPosition = 'center';
      el.innerHTML = `<img src="${BACKEND + value}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;"/>`;
    }
  });
}

function setMeta(name, value, isProperty = false) {
  if (!value) return;
  const attr = isProperty ? 'property' : 'name';
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

function setSocial(platform, value) {
  if (!value) return;
  const el = document.querySelector(`[data-cms="contact_${platform}"]`);
  if (!el) return;
  el.style.display = 'flex';
  if (el.tagName === 'A') el.href = value;
}

// Auto-load on every page
loadCMS();
