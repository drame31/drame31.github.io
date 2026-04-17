/* =============================================================
   DEREK MUÑOZ — PORTFOLIO
   Lightweight vanilla JS — no dependencies
   ============================================================= */

(() => {
  'use strict';

  /* ---------- Deploy date ---------- */
  const dep = document.getElementById('dep');
  if (dep) {
    dep.textContent = new Date().toLocaleDateString('en', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  }

  /* ---------- Nav scroll state ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const closeMenu = () => {
    navToggle.classList.remove('is-open');
    navMenu.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  navToggle.addEventListener('click', () => {
    const open = navToggle.classList.toggle('is-open');
    navMenu.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });
  navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navMenu.classList.contains('is-open')) closeMenu();
  });

  /* ---------- Smooth scroll for in-page anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ---------- Reveal on scroll ---------- */
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.reveal');

  if (reduced || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger siblings within the same parent for a nicer cascade
          const parent = entry.target.parentElement;
          const siblings = Array.from(parent.children).filter(c => c.classList.contains('reveal'));
          const idx = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = `${Math.min(idx, 4) * 80}ms`;
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => io.observe(el));
  }

  /* ---------- Subtle parallax on hero title (mouse move) ---------- */
  if (!reduced && window.matchMedia('(pointer: fine)').matches) {
    const title = document.querySelector('.hero__title');
    if (title) {
      let raf = null;
      const onMove = (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          const { innerWidth: w, innerHeight: h } = window;
          const x = (e.clientX / w - 0.5) * 6;
          const y = (e.clientY / h - 0.5) * 4;
          title.style.transform = `translate3d(${x}px, ${y}px, 0)`;
          raf = null;
        });
      };
      window.addEventListener('mousemove', onMove, { passive: true });
    }
  }

  /* ---------- Active nav link on scroll ---------- */
  const sections = ['work', 'about', 'stack', 'timeline', 'contact']
    .map(id => document.getElementById(id))
    .filter(Boolean);
  const linkMap = new Map();
  navMenu.querySelectorAll('a[href^="#"]').forEach(a => {
    const id = a.getAttribute('href').slice(1);
    linkMap.set(id, a);
  });

  if ('IntersectionObserver' in window && sections.length) {
    const navIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const link = linkMap.get(entry.target.id);
        if (!link) return;
        if (entry.isIntersecting) {
          linkMap.forEach(l => l.removeAttribute('data-active'));
          link.setAttribute('data-active', '');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => navIO.observe(s));
  }
})();
