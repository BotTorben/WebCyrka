/* AMC CZYRKA — Interaction Layer */

(function () {
  'use strict';

  /* -------- Header scroll state -------- */
  const header = document.querySelector('.site-header');
  if (header && !header.classList.contains('scrolled')) {
    const onScroll = () => {
      if (window.scrollY > 30) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* -------- Mobile nav toggle -------- */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(navLinks.classList.contains('open')));
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  /* -------- Scroll reveal -------- */
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          observer.unobserve(e.target);
        }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in-view'));
  }

  /* -------- Portfolio filters -------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  if (filterButtons.length && projectCards.length) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        projectCards.forEach(card => {
          const tags = (card.dataset.category || '').split(' ');
          card.hidden = filter !== 'all' && !tags.includes(filter);
        });
      });
    });
  }

  /* -------- Product gallery (model detail page) -------- */
  const galleryMain = document.getElementById('gallery-main-img');
  const galleryThumbs = document.getElementById('gallery-thumbs');
  if (galleryMain && galleryThumbs) {
    galleryThumbs.querySelectorAll('.product-gallery-thumb').forEach(thumb => {
      thumb.addEventListener('click', () => {
        galleryThumbs.querySelectorAll('.product-gallery-thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        const newSrc = thumb.dataset.img;
        const fallback = thumb.dataset.fallback;
        // Test if image actually exists by loading it
        const test = new Image();
        test.onload = () => { galleryMain.src = newSrc; };
        test.onerror = () => { galleryMain.src = fallback; };
        test.src = newSrc;
      });
    });
  }

  /* -------- Catalog sort -------- */
  const sortSelect = document.querySelector('[data-sort-target]');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      const grid = document.querySelector(sortSelect.dataset.sortTarget);
      if (!grid) return;
      const cards = Array.from(grid.querySelectorAll('.catalog-card'));
      const sortBy = sortSelect.value;
      const priceOf = card => parseFloat(card.querySelector('.catalog-card-price strong').textContent.replace('.', '').replace(',', '.').replace(/[^\d.]/g, '')) || 0;
      const nameOf = card => card.querySelector('.catalog-card-name').textContent;
      cards.sort((a, b) => {
        if (sortBy === 'price-asc') return priceOf(a) - priceOf(b);
        if (sortBy === 'price-desc') return priceOf(b) - priceOf(a);
        if (sortBy === 'name-asc') return nameOf(a).localeCompare(nameOf(b));
        return 0;
      });
      cards.forEach(c => grid.appendChild(c));
    });
  }

  /* -------- Quote form: read URL params, pre-fill, show banner -------- */
  const form = document.getElementById('quote-form');
  if (form) {
    const params = new URLSearchParams(window.location.search);
    const modell = params.get('modell');
    const kategorie = params.get('kategorie');
    const breite = params.get('breite');
    const hoehe = params.get('hoehe');
    const farbe = params.get('farbe');
    const menge = params.get('menge');

    // Show preselected banner
    if (modell) {
      const banner = document.getElementById('preselected-banner');
      const prod = document.getElementById('preselected-product');
      const det = document.getElementById('preselected-details');
      if (banner && prod && det) {
        banner.style.display = 'flex';
        prod.textContent = 'Vorausgewählt: ' + modell;
        const parts = [];
        if (kategorie) parts.push(kategorie);
        if (breite) parts.push('Breite/Fläche: ' + breite);
        if (hoehe) parts.push('Höhe: ' + hoehe);
        if (farbe) parts.push('Farbe/Stil: ' + farbe);
        if (menge && menge !== '1') parts.push('Menge: ' + menge);
        det.textContent = parts.join(' · ');
      }
      // Set hidden form fields
      const hModell = document.getElementById('hidden-modell');
      const hKat = document.getElementById('hidden-kategorie');
      if (hModell) hModell.value = modell;
      if (hKat) hKat.value = kategorie || '';
    }

    // Map kategorie → produkt radio button
    if (kategorie) {
      const map = {
        'Schiebetore': 'schiebetor',
        'Pforten': 'schiebetor',  // pforten use same group (closest match)
        'Garagentore': 'garagentor',
        'Fenster & Türen': 'fenster-tueren',
        'Bad-Sanierung & Fliesen': 'bad',
      };
      const target = map[kategorie];
      if (target) {
        const radio = document.querySelector(`input[name="produkt"][value="${target}"]`);
        if (radio) radio.checked = true;
      }
    }

    // Pre-fill dimensions (extract numeric part from "400 cm")
    const extractNum = s => {
      if (!s) return '';
      const m = s.match(/\d+/);
      return m ? m[0] : '';
    };
    const setVal = (id, val) => { const el = document.getElementById(id); if (el && val) el.value = val; };
    setVal('breite', extractNum(breite));
    setVal('hoehe', extractNum(hoehe));
    setVal('anzahl', menge || '1');
    setVal('farbe', farbe);

    // Auto-fill nachricht field with product info
    if (modell) {
      const nachricht = document.getElementById('nachricht');
      if (nachricht) {
        const lines = ['--- Vorausgewähltes Produkt ---'];
        lines.push('Modell: ' + modell);
        if (kategorie) lines.push('Kategorie: ' + kategorie);
        if (breite) lines.push('Breite/Fläche: ' + breite);
        if (hoehe) lines.push('Höhe: ' + hoehe);
        if (farbe) lines.push('Farbe/Stil: ' + farbe);
        if (menge && menge !== '1') lines.push('Menge: ' + menge);
        lines.push('--- Ihre Anmerkungen ---');
        lines.push('');
        nachricht.value = lines.join('\n');
      }
    }

    /* -------- Form submission via Formspree (fetch) -------- */
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const formContainer = form.closest('.form-container');
      if (!formContainer) return;

      // Check if Formspree is configured
      const action = form.getAttribute('action');
      if (action.includes('YOUR_FORMSPREE_ID')) {
        alert('Das Formular ist noch nicht konfiguriert.\n\n' +
              'Bitte FORMULAR-EMAIL-SETUP.md im Projekt-Ordner lesen ' +
              'und die Formspree-ID einsetzen.');
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Wird gesendet…';
      }

      try {
        const formData = new FormData(form);
        const response = await fetch(action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          showSuccess(formContainer);
        } else {
          const data = await response.json();
          const error = (data.errors && data.errors.map(e => e.message).join(', ')) || 'Bitte erneut versuchen.';
          alert('Es gab ein Problem beim Senden: ' + error);
          if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = originalText; }
        }
      } catch (err) {
        alert('Verbindungsfehler. Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.');
        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = originalText; }
      }
    });

    function showSuccess(container) {
      container.innerHTML = `
        <div class="form-success">
          <div class="form-success-icon" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h3>Vielen Dank für Ihre Anfrage</h3>
          <p>Wir melden uns innerhalb von 24 Stunden persönlich bei Ihnen mit einem unverbindlichen Angebot.</p>
          <a href="index.html" class="btn btn-primary">
            Zurück zur Startseite
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </a>
        </div>
      `;
      window.scrollTo({ top: container.offsetTop - 100, behavior: 'smooth' });
    }

    // Hide setup notice if Formspree is properly configured
    const notice = document.getElementById('formspree-setup-notice');
    if (notice && !form.getAttribute('action').includes('YOUR_FORMSPREE_ID')) {
      notice.style.display = 'none';
    }
  }

  /* -------- Smooth anchor scroll with header offset -------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        window.scrollTo({
          top: target.offsetTop - headerHeight - 20,
          behavior: 'smooth'
        });
      }
    });
  });
})();

/* ============================================================================
   Katalog / Produkt-Detail / Angebots-Vorausfüllung / Formspree-Submit
   ============================================================================ */

/* -------- Produkt-Detailseite: Thumbnail-Wechsel -------- */
(function initProductGallery() {
  const main = document.getElementById('mainProductImage');
  if (!main) return;

  const thumbs = document.querySelectorAll('.product-gallery-thumb');
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');

      const newSrc = thumb.dataset.img;
      const fallback = thumb.dataset.fallback;
      if (fallback) {
        main.onerror = function() { this.onerror = null; this.src = fallback; };
      }
      if (newSrc) main.src = newSrc;
    });
  });
})();

/* -------- "Angebot anfordern" Button auf Modell-Seite -------- */
function requestQuote() {
  const form = document.getElementById('configForm');
  if (!form) return;

  const params = new URLSearchParams();
  params.set('modell', form.dataset.modell || '');
  params.set('kategorie', form.dataset.kategorie || '');

  const breite = form.querySelector('#opt-breite');
  const hoehe = form.querySelector('#opt-hoehe');
  const farbe = form.querySelector('#opt-farbe');
  const menge = form.querySelector('#opt-menge');

  if (breite) params.set('breite', breite.value);
  if (hoehe) params.set('hoehe', hoehe.value);
  if (farbe) params.set('farbe', farbe.value);
  if (menge) params.set('menge', menge.value);

  window.location.href = 'angebot.html?' + params.toString();
}

/* -------- Angebot-Seite: URL-Parameter auslesen und Formular vorausfüllen -------- */
(function initQuotePrefill() {
  const form = document.getElementById('quote-form');
  if (!form) return;

  const params = new URLSearchParams(window.location.search);
  const modell = params.get('modell');
  const kategorie = params.get('kategorie');

  if (modell || kategorie) {
    const hiddenModell = document.getElementById('hidden-modell');
    const hiddenKategorie = document.getElementById('hidden-kategorie');
    if (hiddenModell) hiddenModell.value = modell || '';
    if (hiddenKategorie) hiddenKategorie.value = kategorie || '';

    // Banner anzeigen
    const banner = document.getElementById('preselected-banner');
    if (banner) {
      banner.style.display = 'flex';
      const prodEl = document.getElementById('preselected-product');
      const detEl = document.getElementById('preselected-details');
      if (prodEl) prodEl.textContent = modell || kategorie;

      const detailParts = [];
      const b = params.get('breite');
      const h = params.get('hoehe');
      const f = params.get('farbe');
      const m = params.get('menge');
      if (b) detailParts.push(b);
      if (h) detailParts.push(h);
      if (f) detailParts.push(f);
      if (m) detailParts.push(m + 'x');
      if (detEl) detEl.textContent = detailParts.join(' · ');
    }

    // Produkt-Radio vorauswählen, falls Kategorie eindeutig
    if (kategorie) {
      const radios = form.querySelectorAll('input[name="produkt"]');
      radios.forEach(r => {
        const labelText = (r.parentElement?.textContent || '').toLowerCase();
        const catLower = kategorie.toLowerCase();
        if (labelText.includes(catLower.split(' ')[0])) r.checked = true;
      });
    }

    // Konfiguration in Nachricht eintragen
    const nachrichtFeld = form.querySelector('textarea[name="nachricht"], textarea[name="message"], textarea#nachricht, textarea#message');
    if (nachrichtFeld && modell) {
      const details = [];
      details.push(`Anfrage zu: ${modell}`);
      if (params.get('breite')) details.push(`Breite/Fläche: ${params.get('breite')}`);
      if (params.get('hoehe')) details.push(`Höhe/Variante: ${params.get('hoehe')}`);
      if (params.get('farbe')) details.push(`Farbe/Stil: ${params.get('farbe')}`);
      if (params.get('menge')) details.push(`Menge: ${params.get('menge')}`);
      nachrichtFeld.value = details.join('\n') + '\n\n';
      nachrichtFeld.focus();
      // Cursor ans Ende setzen
      setTimeout(() => nachrichtFeld.setSelectionRange(nachrichtFeld.value.length, nachrichtFeld.value.length), 50);
    }
  }
})();

/* -------- Angebot-Seite: Formspree AJAX Submission -------- */
(function initFormspreeSubmit() {
  const form = document.getElementById('quote-form');
  if (!form) return;

  const action = form.getAttribute('action') || '';
  const setupNotice = document.getElementById('formspree-setup-notice');
  const successBox = document.getElementById('form-success');

  // Setup-Hinweis verstecken wenn ID schon gesetzt wurde
  if (setupNotice && !action.includes('YOUR_FORMSPREE_ID')) {
    setupNotice.style.display = 'none';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Wenn Formspree-ID noch nicht eingetragen ist: Hinweis anzeigen
    if (action.includes('YOUR_FORMSPREE_ID')) {
      alert(
        'Hinweis für den Website-Betreiber:\n\n' +
        'Es wurde noch keine Formspree-ID hinterlegt. Bitte ersetze "YOUR_FORMSPREE_ID" ' +
        'in angebot.html durch deine tatsächliche Formspree-Form-ID.\n\n' +
        'Anleitung: siehe FORMULAR-EMAIL-SETUP.md'
      );
      return;
    }

    // Native HTML5-Validation prüfen
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Wird gesendet…';
    }

    try {
      const formData = new FormData(form);
      const res = await fetch(action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        // Erfolg: Formular ausblenden, Erfolgs-Box zeigen
        form.style.display = 'none';
        if (setupNotice) setupNotice.style.display = 'none';
        if (successBox) {
          successBox.classList.add('active');
          successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        form.reset();
      } else {
        const data = await res.json().catch(() => ({}));
        const msg = (data.errors && data.errors[0]?.message) || 'Senden fehlgeschlagen. Bitte versuchen Sie es erneut oder rufen Sie uns direkt an.';
        alert(msg);
        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = originalText; }
      }
    } catch (err) {
      alert('Verbindungsfehler. Bitte versuchen Sie es erneut oder rufen Sie uns direkt an: +49 15510 147781');
      if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = originalText; }
    }
  });
})();

/* -------- Katalog-Sortierung -------- */
(function initCatalogSort() {
  const sortSelect = document.getElementById('sortCatalog');
  const grid = document.getElementById('catalogGrid');
  if (!sortSelect || !grid) return;

  const originalOrder = Array.from(grid.children);

  sortSelect.addEventListener('change', () => {
    const mode = sortSelect.value;
    let sorted;

    if (mode === 'price-asc') {
      sorted = [...originalOrder].sort((a, b) => parseInt(a.dataset.price) - parseInt(b.dataset.price));
    } else if (mode === 'price-desc') {
      sorted = [...originalOrder].sort((a, b) => parseInt(b.dataset.price) - parseInt(a.dataset.price));
    } else if (mode === 'name') {
      sorted = [...originalOrder].sort((a, b) => (a.dataset.name || '').localeCompare(b.dataset.name || ''));
    } else {
      sorted = originalOrder;
    }

    sorted.forEach(card => grid.appendChild(card));
  });
})();

/* ============================================================================
   Garagentor-Portfolio — Lightbox-Funktion
   ============================================================================ */
(function initLightbox() {
  const grid = document.getElementById('galleryGrid');
  const lightbox = document.getElementById('lightbox');
  if (!grid || !lightbox) return;

  const items = Array.from(grid.querySelectorAll('.gallery-item'));
  const lightboxImg = document.getElementById('lightboxImg');
  const btnClose = lightbox.querySelector('.lightbox-close');
  const btnPrev = lightbox.querySelector('.lightbox-prev');
  const btnNext = lightbox.querySelector('.lightbox-next');
  let currentIndex = 0;

  function open(idx) {
    currentIndex = idx;
    lightboxImg.src = items[idx].dataset.img;
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function showNext() { open((currentIndex + 1) % items.length); }
  function showPrev() { open((currentIndex - 1 + items.length) % items.length); }

  items.forEach((item, idx) => item.addEventListener('click', () => open(idx)));
  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', showPrev);
  btnNext.addEventListener('click', showNext);

  // Klick auf Hintergrund schließt
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  // Keyboard-Steuerung
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') showNext();
    else if (e.key === 'ArrowLeft') showPrev();
  });
})();

/* ============================================================================
   Bad-Projekt-Detailseiten — Thumbnail-Wechsel + Hero-Lightbox
   ============================================================================ */
(function initBadProjektHero() {
  const heroMain = document.getElementById('projektHeroMain');
  const thumbs = document.getElementById('projektThumbs');
  if (!heroMain || !thumbs) return;

  const thumbButtons = Array.from(thumbs.querySelectorAll('.projekt-thumb'));

  // Sammle alle Bilder (Hero + Thumbnails) für Lightbox-Navigation
  const allImages = [
    { src: heroMain.src, alt: heroMain.alt }
  ];
  thumbButtons.forEach(btn => {
    const img = btn.querySelector('img');
    allImages.push({ src: img.src, alt: img.alt, fallback: btn.dataset.fallback });
  });

  // Thumbnail-Klick: wechselt Hero-Bild
  thumbButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const img = btn.querySelector('img');
      heroMain.style.opacity = '0';
      setTimeout(() => {
        heroMain.src = img.src;
        heroMain.alt = img.alt;
        heroMain.style.opacity = '1';
      }, 150);
      thumbButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Lightbox bei Klick auf Hero-Bild
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  if (!lightbox || !lightboxImg) return;

  const btnClose = lightbox.querySelector('.lightbox-close');
  const btnPrev = lightbox.querySelector('.lightbox-prev');
  const btnNext = lightbox.querySelector('.lightbox-next');
  let currentIdx = 0;

  function openLightbox(idx) {
    currentIdx = idx;
    lightboxImg.src = allImages[idx].src;
    lightboxImg.alt = allImages[idx].alt || '';
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  function next() { openLightbox((currentIdx + 1) % allImages.length); }
  function prev() { openLightbox((currentIdx - 1 + allImages.length) % allImages.length); }

  heroMain.parentElement.addEventListener('click', () => {
    // Find current index based on current src
    const idx = allImages.findIndex(i => i.src === heroMain.src);
    openLightbox(idx >= 0 ? idx : 0);
  });

  btnClose.addEventListener('click', closeLightbox);
  btnPrev.addEventListener('click', prev);
  btnNext.addEventListener('click', next);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowRight') next();
    else if (e.key === 'ArrowLeft') prev();
  });
})();
