// Shared nav HTML — injected by each page
const NAV_HTML = `
<canvas id="bg-canvas"></canvas>
<nav>
  <a href="../index.html" class="logo">Poli<span>Shin</span></a>
  <ul class="nav-links">
    <li><a href="../index.html">خانه</a></li>
    <li><a href="product.html">محصول</a></li>
    <li><a href="features.html">مزایا</a></li>
    <li><a href="specs.html">مشخصات فنی</a></li>
    <li><a href="articles.html">مقالات</a></li>
    <li><a href="about.html">درباره ما</a></li>
    <li><a href="contact.html" class="nav-cta">تماس و سفارش</a></li>
  </ul>
  <button class="nav-toggle" aria-label="منو"><span></span><span></span><span></span></button>
</nav>`;

const NAV_HTML_ROOT = `
<canvas id="bg-canvas"></canvas>
<nav>
  <a href="index.html" class="logo">Poli<span>Shin</span></a>
  <ul class="nav-links">
    <li><a href="index.html">خانه</a></li>
    <li><a href="pages/product.html">محصول</a></li>
    <li><a href="pages/features.html">مزایا</a></li>
    <li><a href="pages/specs.html">مشخصات فنی</a></li>
    <li><a href="pages/articles.html">مقالات</a></li>
    <li><a href="pages/about.html">درباره ما</a></li>
    <li><a href="pages/contact.html" class="nav-cta">تماس و سفارش</a></li>
  </ul>
  <button class="nav-toggle" aria-label="منو"><span></span><span></span><span></span></button>
</nav>`;

const FOOTER_HTML = `
<footer>
  <div class="footer-grid">
    <div class="footer-about">
      <a href="../index.html" class="logo">Poli<span>Shin</span></a>
      <p>PoliShin پیشرو در ارائه راهکارهای حرفه‌ای پولیش ظروف برای کافه‌ها و رستوران‌های ایران.</p>
    </div>
    <div class="footer-col">
      <h4>صفحات</h4>
      <ul>
        <li><a href="product.html">محصول</a></li>
        <li><a href="features.html">مزایا</a></li>
        <li><a href="specs.html">مشخصات فنی</a></li>
        <li><a href="articles.html">مقالات</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>اطلاعات</h4>
      <ul>
        <li><a href="about.html">درباره ما</a></li>
        <li><a href="contact.html">تماس</a></li>
        <li><a href="../admin/index.html">پنل مدیریت</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <p>© ۱۴۰۳ PoliShin — تمامی حقوق محفوظ است</p>
    <p>ساخته شده با ❤️ برای کافه‌های ایران</p>
  </div>
</footer>`;

const FOOTER_HTML_ROOT = FOOTER_HTML.replace(/href="/g, 'href="pages/').replace(/href="pages\/\.\.\/admin/g, 'href="admin').replace(/href="pages\/\.\.\/index/g, 'href="index');
