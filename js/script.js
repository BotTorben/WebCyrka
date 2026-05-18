/* AMC CZYRKA — Interaction Layer */

(function () {
  'use strict';

  /* -------- Header scroll state -------- */
  const header = document.querySelector('.site-header');
  if (header) {
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
      const isOpen = navLinks.classList.contains('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  /* -------- Scroll reveal -------- */
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
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

  /* -------- Quote form -------- */
  const form = document.querySelector('#quote-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const formContainer = form.closest('.form-container');
      if (!formContainer) return;
      // Simple success replacement (would POST to backend in production)
      formContainer.innerHTML = `
        <div class="form-success">
          <div class="form-success-icon" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h3>Vielen Dank für Ihre Anfrage</h3>
          <p>Wir melden uns innerhalb von 24 Stunden persönlich bei Ihnen mit einem unverbindlichen Angebot.</p>
          <a href="../../CyrkaWeb/index.html" class="btn btn-primary">
            Zurück zur Startseite
            <svg class="btn-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </a>
        </div>
      `;
      window.scrollTo({ top: formContainer.offsetTop - 100, behavior: 'smooth' });
    });
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
