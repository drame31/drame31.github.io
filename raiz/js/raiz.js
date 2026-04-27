/* ============================================================
   RAÍZ — Main JavaScript
   Vanilla ES6+, no dependencies except AOS
   ============================================================ */

const API_URL = 'https://api.raiz.demo'; // Replace with Render.com URL after backend deploy

/* ---- AOS Init ---- */
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({
    duration: 700,
    easing: 'ease-out-quad',
    once: true,
    offset: 80,
    disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  });

  initNav();
  initMobileMenu();
  initGallery();
  initWhatsAppFloat();
  initActiveNavLinks();
  initForms();
});

/* ---- Navigation scroll behavior ---- */
function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---- Mobile menu ---- */
function initMobileMenu() {
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileNav  = document.querySelector('.nav__mobile');
  if (!hamburger || !mobileNav) return;

  const mobileLinks = mobileNav.querySelectorAll('.nav__mobile-link');

  const open = () => {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileNav.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    mobileLinks[0]?.focus();
  };

  const close = () => {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    hamburger.focus();
  };

  hamburger.addEventListener('click', () => {
    mobileNav.classList.contains('open') ? close() : open();
  });

  mobileLinks.forEach(link => link.addEventListener('click', close));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) close();
  });
}

/* ---- Gallery lightbox ---- */
function initGallery() {
  const lightbox   = document.querySelector('.lightbox');
  const lightboxImg = lightbox?.querySelector('.lightbox__img');
  const closeBtn   = lightbox?.querySelector('.lightbox__close');
  const items      = document.querySelectorAll('.gallery__item');

  if (!lightbox || !lightboxImg) return;

  const openLightbox = (src, alt) => {
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn?.focus();
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  items.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('.gallery__img');
      if (img) openLightbox(img.src, img.alt);
    });
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const img = item.querySelector('.gallery__img');
        if (img) openLightbox(img.src, img.alt);
      }
    });
  });

  closeBtn?.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });
}

/* ---- WhatsApp floating button ---- */
function initWhatsAppFloat() {
  const btn = document.querySelector('.whatsapp-float');
  if (!btn) return;

  const onScroll = () => {
    btn.classList.toggle('visible', window.scrollY > 300);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---- Active nav link on scroll ---- */
function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      });
    },
    { rootMargin: '-50% 0px -45% 0px' }
  );

  sections.forEach(section => observer.observe(section));
}

/* ---- Reservation & Contact forms ---- */
function initForms() {
  const reservationForm = document.getElementById('reservation-form');
  const contactForm     = document.getElementById('contact-form');

  if (reservationForm) {
    reservationForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await handleFormSubmit(
        reservationForm,
        `${API_URL}/api/reservations`,
        'reservation-feedback'
      );
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await handleFormSubmit(
        contactForm,
        `${API_URL}/api/contact`,
        'contact-feedback'
      );
    });
  }
}

async function handleFormSubmit(form, endpoint, feedbackId) {
  const submitBtn  = form.querySelector('[type="submit"]');
  const feedback   = document.getElementById(feedbackId);
  const data       = Object.fromEntries(new FormData(form));

  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando…';

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Error al enviar el formulario.');
    }

    const result = await res.json();
    showFeedback(feedback, result.message, 'success');
    form.reset();
  } catch (err) {
    showFeedback(feedback, err.message, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = submitBtn.dataset.label || 'Enviar';
  }
}

function showFeedback(el, message, type) {
  if (!el) return;
  el.textContent = message;
  el.className = `form-feedback form-feedback--${type}`;
  el.removeAttribute('hidden');
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  if (type === 'success') {
    setTimeout(() => el.setAttribute('hidden', ''), 8000);
  }
}
