/**
 * THE ARK CLEANING CO. — Main JavaScript
 * Loads content.json and renders all site sections dynamically.
 * Handles nav scroll, mobile menu, gallery filter, lightbox,
 * contact form, and scroll-to-top button.
 */

/* ============================================================
   1. CONTENT LOADER — fetches data/content.json and builds site
   ============================================================ */
async function loadContent() {
  let data;
  try {
    const res = await fetch('data/content.json');
    if (!res.ok) throw new Error('Failed to load content.json');
    data = await res.json();
  } catch (err) {
    console.error('Content load error:', err);
    return; // Site still renders with placeholder content in HTML
  }

  renderMeta(data.site);
  renderNav(data.site);
  renderHero(data.hero, data.site);
  renderServices(data.services);
  renderAbout(data.about);
  renderGallery(data.gallery);
  renderPricing(data.packages);
  renderTestimonials(data.testimonials);
  renderContact(data.site);
  renderFooter(data.site);
}

/* ---- Meta & Page Title ---- */
function renderMeta(site) {
  document.title = site.title;
  setMeta('description', site.description);
  setMeta('og:title', site.title);
  setMeta('og:description', site.description);
}
function setMeta(name, content) {
  let el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
  if (el) el.setAttribute('content', content);
}

/* ---- Navigation ---- */
function renderNav(site) {
  const logo = document.querySelectorAll('.nav-logo');
  logo.forEach(l => l.textContent = site.title);
}

/* ---- Hero ---- */
function renderHero(hero, site) {
  setText('#hero-heading', hero.heading);
  setText('#hero-sub', hero.subheading);
  const ctaBtn = document.getElementById('hero-cta');
  if (ctaBtn) { ctaBtn.textContent = hero.ctaText; ctaBtn.href = hero.ctaLink; }
  // Background image
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg && hero.backgroundImage) {
    heroBg.style.backgroundImage = `url('${hero.backgroundImage}')`;
  }
  // Phone quick link
  const phoneLink = document.getElementById('hero-phone');
  if (phoneLink) {
    phoneLink.textContent = site.phone;
    phoneLink.href = `tel:${site.phone.replace(/\s/g, '')}`;
  }
}

/* ---- Services ---- */
function renderServices(services) {
  const grid = document.getElementById('services-grid');
  if (!grid || !services) return;
  grid.innerHTML = services.map(s => `
    <article class="service-card" data-id="${s.id}">
      <span class="service-icon" aria-hidden="true">${s.icon}</span>
      <h3>${s.title}</h3>
      <p>${s.description}</p>
    </article>
  `).join('');
}

/* ---- About ---- */
function renderAbout(about) {
  if (!about) return;
  setText('#about-heading', about.heading);
  setText('#about-body', about.body);
  const img = document.getElementById('about-img');
  if (img && about.image) { img.src = about.image; img.alt = 'The Ark team at work'; }
  const ul = document.getElementById('about-highlights');
  if (ul) {
    ul.innerHTML = about.highlights.map(h => `<li>${h}</li>`).join('');
  }
}

/* ---- Gallery ---- */
function renderGallery(gallery) {
  const grid = document.getElementById('gallery-grid');
  if (!grid || !gallery) return;

  grid.innerHTML = gallery.map(item => `
    <figure class="gallery-item" data-category="${item.category}"
            tabindex="0" role="button"
            aria-label="View: ${item.alt}"
            data-src="${item.src}" data-caption="${item.alt}">
      <img src="${item.src}" alt="${item.alt}" loading="lazy">
      <figcaption class="gallery-overlay">
        <span>${item.alt}</span>
      </figcaption>
    </figure>
  `).join('');

  initGalleryFilter();
  initLightbox();
}

/* ---- Pricing ---- */
function renderPricing(packages) {
  const grid = document.getElementById('pricing-grid');
  if (!grid || !packages) return;

  grid.innerHTML = packages.map(pkg => `
    <div class="pricing-card ${pkg.highlight ? 'highlight' : ''}">
      ${pkg.highlight ? '<span class="popular-badge">Most Popular</span>' : ''}
      <div class="pricing-name">${pkg.name}</div>
      <div class="pricing-price">${pkg.price} <span class="pricing-per">/ ${pkg.per}</span></div>
      <hr class="pricing-divider">
      <ul class="pricing-features">
        ${pkg.features.map(f => `<li>${f}</li>`).join('')}
      </ul>
      <a href="#contact" class="pricing-cta">Book Now</a>
    </div>
  `).join('');
}

/* ---- Testimonials ---- */
function renderTestimonials(testimonials) {
  const grid = document.getElementById('testimonials-grid');
  if (!grid || !testimonials) return;

  grid.innerHTML = testimonials.map(t => `
    <blockquote class="testimonial-card">
      <div class="stars" aria-label="${t.rating} out of 5 stars">
        ${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}
      </div>
      <p class="testimonial-quote">${t.quote}</p>
      <footer>
        <div class="testimonial-author">${t.name}</div>
        <div class="testimonial-location">${t.location}</div>
      </footer>
    </blockquote>
  `).join('');
}

/* ---- Contact ---- */
function renderContact(site) {
  setText('#contact-phone', site.phone);
  setText('#contact-email', site.email);
  setText('#contact-address', site.address);

  const phoneLink = document.getElementById('contact-phone-link');
  if (phoneLink) phoneLink.href = `tel:${site.phone.replace(/\s/g, '')}`;
  const emailLink = document.getElementById('contact-email-link');
  if (emailLink) emailLink.href = `mailto:${site.email}`;
  const waLink = document.getElementById('contact-whatsapp');
  if (waLink && site.social.whatsapp) waLink.href = site.social.whatsapp;

  // Set Formspree endpoint
  const form = document.getElementById('contact-form');
  if (form && site.formspreeEndpoint) form.action = site.formspreeEndpoint;

  // Social links
  const fbLink = document.getElementById('social-facebook');
  if (fbLink && site.social.facebook) fbLink.href = site.social.facebook;
  const igLink = document.getElementById('social-instagram');
  if (igLink && site.social.instagram) igLink.href = site.social.instagram;
}

/* ---- Footer ---- */
function renderFooter(site) {
  setText('#footer-title', site.title);
  setText('#footer-desc', site.description);
  setText('#footer-copy', `© ${new Date().getFullYear()} ${site.title}. All rights reserved.`);
}

/* ---- Helper ---- */
function setText(selector, text) {
  const el = document.querySelector(selector);
  if (el) el.textContent = text;
}

/* ============================================================
   2. NAVIGATION — Scroll effect + mobile toggle
   ============================================================ */
function initNav() {
  const navbar = document.getElementById('navbar');
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  // Scrolled class
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    const scrollBtn = document.getElementById('scrollTop');
    if (scrollBtn) scrollBtn.classList.toggle('visible', window.scrollY > 400);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile toggle
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open);
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Scroll-to-top button
  const scrollBtn = document.getElementById('scrollTop');
  if (scrollBtn) {
    scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
}

/* ============================================================
   3. GALLERY FILTER
   ============================================================ */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      items.forEach(item => {
        const show = cat === 'all' || item.dataset.category === cat;
        item.classList.toggle('hidden', !show);
      });
    });
  });
}

/* ============================================================
   4. LIGHTBOX
   ============================================================ */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbCaption = document.getElementById('lightbox-caption');
  const lbClose = document.getElementById('lightbox-close');
  if (!lightbox || !lbImg) return;

  const openLightbox = (src, caption) => {
    lbImg.src = src;
    lbImg.alt = caption || '';
    if (lbCaption) lbCaption.textContent = caption || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  // Delegate click on gallery items (dynamic)
  document.getElementById('gallery-grid')?.addEventListener('click', e => {
    const item = e.target.closest('.gallery-item');
    if (item) openLightbox(item.dataset.src, item.dataset.caption);
  });

  // Keyboard: Enter/Space opens, Escape closes
  document.getElementById('gallery-grid')?.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      const item = e.target.closest('.gallery-item');
      if (item) { e.preventDefault(); openLightbox(item.dataset.src, item.dataset.caption); }
    }
  });

  lbClose?.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
}

/* ============================================================
   5. CONTACT FORM — Formspree AJAX submission
   ============================================================ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      });
      if (res.ok) {
        status.className = 'form-status success';
        status.textContent = '✓ Message sent! We will be in touch shortly.';
        form.reset();
      } else {
        throw new Error('Server error');
      }
    } catch {
      status.className = 'form-status error';
      status.textContent = '✗ Something went wrong. Please call or WhatsApp us directly.';
    } finally {
      submitBtn.textContent = 'Send Message';
      submitBtn.disabled = false;
    }
  });
}

/* ============================================================
   6. INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initContactForm();
  loadContent(); // Renders all dynamic sections from content.json
});
