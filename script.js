/* =============================================================
   DEREK MUÑOZ — PORTFOLIO v8.0
   Vanilla ES6 — no dependencies, no framework
   Modules: nav · scroll-animations · nav-active · scroll-dots · queue-demo
   ============================================================= */

'use strict';

/* =================== UTILITY =================== */
function $(selector, ctx = document) {
  return ctx.querySelector(selector);
}

function $$(selector, ctx = document) {
  return Array.from(ctx.querySelectorAll(selector));
}

/* Check user motion preference once at load */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* =================== NAV SCROLL STATE =================== */
/*
 * Adds a border + backdrop-blur to the header after the user
 * scrolls 24px down. The CSS handles the visual transition.
 */
function initNav() {
  const header   = document.getElementById('site-header');
  const toggle   = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (!header) return;

  /* Scroll-triggered border */
  const handleScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); /* run once on init */

  /* Mobile menu toggle */
  if (!toggle || !mobileMenu) return;

  const openMenu = () => {
    toggle.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('is-open');
    mobileMenu.removeAttribute('aria-hidden');
  };

  const closeMenu = () => {
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
  };

  toggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('is-open');
    isOpen ? closeMenu() : openMenu();
  });

  /* Close when a mobile link is tapped */
  $$('.nav__mobile-link', mobileMenu).forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* Close on Escape */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
      closeMenu();
      toggle.focus();
    }
  });
}

/* =================== SMOOTH SCROLL (in-page anchors) =================== */
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id     = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();

      /* Respect prefers-reduced-motion */
      if (prefersReducedMotion) {
        target.scrollIntoView();
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }

      /* Move focus to the section for keyboard users */
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });
}

/* =================== SCROLL-TRIGGERED ANIMATIONS =================== */
/*
 * Elements with data-animate are hidden via CSS (opacity 0, translateY 16px).
 * IntersectionObserver adds .is-visible, CSS handles the transition.
 * Each element only animates once (unobserve after trigger).
 */
function initScrollAnimations() {
  if (prefersReducedMotion) {
    /* Immediately show all animated elements — don't animate */
    $$('[data-animate]').forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); /* once only */
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -48px 0px',
    }
  );

  $$('[data-animate]').forEach(el => observer.observe(el));
}

/* =================== NAV ACTIVE STATE ON SCROLL =================== */
/*
 * Watches section[id] elements with IntersectionObserver.
 * When a section is 50% visible, the matching nav link gets .active.
 * Lime dot is applied via CSS on .active::after.
 */
function initNavActive() {
  const sections  = $$('main section[id]');
  const navLinks  = $$('nav a[href^="#"]');

  if (!sections.length || !navLinks.length) return;

  const setActive = (sectionId) => {
    navLinks.forEach(link => {
      const href = link.getAttribute('href').slice(1);
      link.classList.toggle('active', href === sectionId);
    });
  };

  const navObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    },
    { threshold: 0.45 }
  );

  sections.forEach(section => navObserver.observe(section));
}

/* =================== SCROLL POSITION DOTS =================== */
/*
 * Right-edge dot nav (desktop). Same observer pattern as nav active.
 * Dot for the visible section becomes .active — larger, lime-colored via CSS.
 */
function initScrollDots() {
  const dots    = $$('.scroll-dot');
  const sections = $$('main section[id]');

  if (!dots.length || !sections.length) return;

  /* Dot buttons scroll to their target section on click */
  dots.forEach(dot => {
    const targetId = dot.dataset.target;
    dot.addEventListener('click', () => {
      const target = document.getElementById(targetId);
      if (!target) return;
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });

  const setActiveDot = (sectionId) => {
    dots.forEach(dot => {
      dot.classList.toggle('active', dot.dataset.target === sectionId);
    });
  };

  const dotObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveDot(entry.target.id);
        }
      });
    },
    { threshold: 0.45 }
  );

  sections.forEach(section => dotObserver.observe(section));
}

/* =================== LIVE QUEUE DEMO =================== */
/*
 * Simulates WebSocket-driven queue state without a backend.
 * Numbers update every 8–15 seconds on a randomised interval.
 * The number fades out, changes, fades back in (200ms CSS transition).
 *
 * Two elements are synced:
 *   #queue-serving, #queue-count, #queue-wait  (hero widget)
 *   #mockup-serving                            (QueuePilot card visual)
 */
function initQueueDemo() {
  const servingEl   = document.getElementById('queue-serving');
  const countEl     = document.getElementById('queue-count');
  const waitEl      = document.getElementById('queue-wait');
  const mockupEl    = document.getElementById('mockup-serving');

  /* All elements must exist */
  if (!servingEl || !countEl || !waitEl) return;

  /* Initial state */
  let servingNum = 7;
  let queueCount = 3;

  const waitForCount = (n) => `~${n * 4} min`;

  /* Update a value element with a fade transition */
  const updateVal = (el, newText) => {
    if (!el) return;
    el.classList.add('updating');
    setTimeout(() => {
      el.textContent = newText;
      el.classList.remove('updating');
    }, 200);
  };

  const tick = () => {
    /* Simulate realistic queue movement */
    const event = Math.random();

    if (event < 0.4) {
      /* Staff calls next ticket — serving number advances */
      servingNum++;
      queueCount = Math.max(0, queueCount - 1);
    } else if (event < 0.7) {
      /* New customer joins */
      queueCount = Math.min(12, queueCount + 1);
    } else {
      /* Someone leaves (timeout / served quickly) */
      queueCount = Math.max(0, queueCount - 1);
    }

    /* Update hero widget */
    updateVal(servingEl, `#${servingNum}`);
    updateVal(countEl, String(queueCount));
    updateVal(waitEl, waitForCount(queueCount));

    /* Sync mockup visual if present */
    if (mockupEl) {
      updateVal(mockupEl, `#${servingNum}`);
    }

    /* Schedule next tick: 8–15 seconds */
    const next = 8000 + Math.random() * 7000;
    setTimeout(tick, next);
  };

  /* First update after a random delay in range */
  const first = 8000 + Math.random() * 7000;
  setTimeout(tick, first);
}

/* =================== INIT =================== */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initSmoothScroll();
  initScrollAnimations();
  initNavActive();
  initScrollDots();
  initQueueDemo();
});
