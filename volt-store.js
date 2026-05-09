/**
 * volt-store.js
 * Complete client-side logic for the Volt Store single-page e-commerce experience.
 * Vanilla JS only. No frameworks, no dependencies.
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1. PRODUCT DATA & CONSTANTS
  // ---------------------------------------------------------------------------

  const PRODUCTS = [
    {
      id: 'arkive-h1',
      name: 'Arkive H1',
      category: 'audio',
      badge: 'bestseller',
      price: 189.00,
      originalPrice: null,
      rating: 4.8,
      reviewCount: 1847,
      description: 'Over-ear wireless with 40-hour battery and hybrid noise cancellation that holds up in real noise — not just the quiet of a lab. Aluminum headband, memory foam cushions, USB-C.',
      shortCode: 'AH1',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=450&fit=crop&auto=format&q=80',
      featured: true,
      lowStock: false
    },
    {
      id: 'nuvox-air-pro',
      name: 'Nuvox Air Pro',
      category: 'audio',
      badge: 'new',
      price: 129.00,
      originalPrice: null,
      rating: 4.6,
      reviewCount: 932,
      description: 'True wireless earbuds with adaptive EQ that adjusts to your actual ear fit. IPX5-rated, 28-hour total with the case. The stem doesn\'t look like a science experiment.',
      shortCode: 'NAP',
      image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&h=450&fit=crop&auto=format&q=80',
      featured: false,
      lowStock: false
    },
    {
      id: 'crestline-s3',
      name: 'Crestline S3',
      category: 'audio',
      badge: null,
      price: 249.00,
      originalPrice: null,
      rating: 4.9,
      reviewCount: 411,
      description: 'Open-back studio monitors for people who work with sound. 250-ohm impedance, hand-stitched velour pads, detachable braided cable. Not for the subway.',
      shortCode: 'CS3',
      image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&h=450&fit=crop&auto=format&q=80',
      featured: false,
      lowStock: true,
      lowStockText: 'Only a few left'
    },
    {
      id: 'orbis-watch-gt',
      name: 'Orbis Watch GT',
      category: 'wearables',
      badge: null,
      price: 219.00,
      originalPrice: null,
      rating: 4.7,
      reviewCount: 2103,
      description: 'Ceramic case, always-on AMOLED display, standalone GPS. Seven-day battery. The sleep tracking is useful enough to change your habits rather than just give you data to ignore.',
      shortCode: 'OWG',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=450&fit=crop&auto=format&q=80',
      featured: true,
      lowStock: false
    },
    {
      id: 'pulse-band-2',
      name: 'Pulse Band 2',
      category: 'wearables',
      badge: 'sale',
      price: 79.00,
      originalPrice: 109.00,
      rating: 4.4,
      reviewCount: 3290,
      description: 'Tracks heart rate, SpO2, steps, and sleep stages without getting in the way. Light enough to forget it\'s on. Charges fully in 45 minutes.',
      shortCode: 'PB2',
      image: 'https://images.unsplash.com/photo-1510017803434-a899398421b3?w=600&h=450&fit=crop&auto=format&q=80',
      featured: false,
      lowStock: false
    },
    {
      id: 'tactix-tkl-carbon',
      name: 'Tactix TKL Carbon',
      category: 'input',
      badge: 'premium',
      price: 159.00,
      originalPrice: null,
      rating: 4.8,
      reviewCount: 678,
      description: 'Tenkeyless mechanical keyboard with a POM plate — slightly bouncy, noticeably quiet. Gateron G Pro yellows stock. Hot-swap PCB, aluminum top case, south-facing RGB.',
      shortCode: 'TTC',
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=450&fit=crop&auto=format&q=80',
      featured: true,
      lowStock: false
    },
    {
      id: 'tactix-65-fog',
      name: 'Tactix 65 Fog',
      category: 'input',
      badge: 'new',
      price: 129.00,
      originalPrice: null,
      rating: 4.5,
      reviewCount: 293,
      description: '65% layout in a frosted polycarbonate case. Gasket-mounted, pre-lubed stabilizers. Sits low on the desk. Available in Fog (white) and Slate (dark grey).',
      shortCode: 'T65',
      image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=600&h=450&fit=crop&auto=format&q=80',
      featured: false,
      lowStock: true,
      lowStockText: 'Low stock — order soon'
    },
    {
      id: 'meridian-g-pro',
      name: 'Meridian G Pro',
      category: 'input',
      badge: null,
      price: 89.00,
      originalPrice: null,
      rating: 4.7,
      reviewCount: 4512,
      description: '26,000 DPI sensor, symmetrical shape, 65 grams. 80-hour wireless battery over 2.4GHz. The receiver fits in a USB port — no dongle drawer needed.',
      shortCode: 'MGP',
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=450&fit=crop&auto=format&q=80',
      featured: false,
      lowStock: false
    },
    {
      id: 'meridian-ergo',
      name: 'Meridian Ergo',
      category: 'input',
      badge: null,
      price: 69.00,
      originalPrice: null,
      rating: 4.3,
      reviewCount: 1204,
      description: 'Vertical ergonomic mouse for people who work long hours and started feeling it. Wired, 6 buttons, adjustable angle. Not glamorous. Stops hurting you.',
      shortCode: 'MER',
      image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&h=450&fit=crop&auto=format&q=80',
      featured: false,
      lowStock: false
    },
    {
      id: 'voltra-140w',
      name: 'Voltra 140W GaN Desk',
      category: 'power',
      badge: 'new',
      price: 74.00,
      originalPrice: null,
      rating: 4.6,
      reviewCount: 887,
      description: 'Three-port GaN charger: 140W USB-C plus two 12W USB-A ports. Small enough to hide behind a monitor. Charges a MacBook Pro and phone at the same time without throttling.',
      shortCode: 'V140',
      image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=450&fit=crop&auto=format&q=80',
      featured: false,
      lowStock: false
    },
    {
      id: 'voltra-30w-nano',
      name: 'Voltra 30W Nano',
      category: 'power',
      badge: 'sale',
      price: 29.00,
      originalPrice: 39.00,
      rating: 4.5,
      reviewCount: 2671,
      description: '30W USB-C wall charger roughly the size of a thick coin. Foldable prongs, fast enough for any phone or small tablet. This is the one that stays in the bag permanently.',
      shortCode: 'V30',
      image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&h=450&fit=crop&auto=format&q=80',
      featured: false,
      lowStock: false
    },
    {
      id: 'corebank-26k',
      name: 'Corebank 26K Ultra',
      category: 'power',
      badge: null,
      price: 64.00,
      originalPrice: null,
      rating: 4.4,
      reviewCount: 1093,
      description: '26,800mAh with a 65W USB-C output. The built-in display shows watt-hours remaining — not a vague four-LED bar. Charges itself in 1.5 hours. Airline carry-on approved.',
      shortCode: 'CB26',
      image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&h=450&fit=crop&auto=format&q=80',
      featured: false,
      lowStock: false
    },
    {
      id: 'vysor-cam-2k',
      name: 'Vysor Cam 2K',
      category: 'cameras',
      badge: 'new',
      price: 99.00,
      originalPrice: null,
      rating: 4.6,
      reviewCount: 549,
      description: '2K indoor security camera with local microSD storage and no mandatory subscription. Motion zones, two-way audio, night vision to 10 meters. Works with Home Assistant.',
      shortCode: 'VC2K',
      image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&h=450&fit=crop&auto=format&q=80',
      featured: false,
      lowStock: false
    },
    {
      id: 'deskview-pro',
      name: 'Deskview Pro Webcam',
      category: 'cameras',
      badge: 'bestseller',
      price: 119.00,
      originalPrice: null,
      rating: 4.8,
      reviewCount: 1382,
      description: '4K 30fps with a Sony STARVIS sensor that handles backlit rooms. Physical privacy shutter. Plug-and-play on Mac, Windows, and Linux. No driver installation.',
      shortCode: 'DPW',
      image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&h=450&fit=crop&auto=format&q=80',
      featured: true,
      lowStock: false
    },
    {
      id: 'arcline-light',
      name: 'Arcline Monitor Light',
      category: 'workspace',
      badge: null,
      price: 54.00,
      originalPrice: null,
      rating: 4.7,
      reviewCount: 766,
      description: 'Screenbar light with a rotating dial for temperature (2700K–6500K) and brightness. No glare on the screen by design. Fits monitors 1–30mm thick. USB-A powered.',
      shortCode: 'AML',
      image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&h=450&fit=crop&auto=format&q=80',
      featured: false,
      lowStock: false
    },
    {
      id: 'deskpad-xl',
      name: 'Deskpad XL Graphite',
      category: 'workspace',
      badge: null,
      price: 44.00,
      originalPrice: null,
      rating: 4.3,
      reviewCount: 2018,
      description: '90x40cm extended mat in graphite micro-textured fabric. Stitched edges, non-slip rubber base, consistent surface for both mousing and writing. Covers most desks fully.',
      shortCode: 'DXG',
      image: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=600&h=450&fit=crop&auto=format&q=80',
      featured: false,
      lowStock: false
    }
  ];

  const CATEGORY_COLORS = {
    audio:     '#1a1a2e',
    wearables: '#1a2e1a',
    input:     '#2e1a1a',
    power:     '#2e2a1a',
    cameras:   '#1a2a2e',
    workspace: '#1e1e1e'
  };

  const FREE_SHIPPING_THRESHOLD = 75;
  const CART_STORAGE_KEY = 'volt_cart';
  const BAR_DISMISSED_KEY = 'volt_bar_dismissed';

  // ---------------------------------------------------------------------------
  // 2. STATE
  // ---------------------------------------------------------------------------

  const state = {
    cart: [],
    activeCategory: 'all',
    activeSort: 'featured',
    searchQuery: '',
    panelProduct: null
  };

  // ---------------------------------------------------------------------------
  // 3. HELPERS
  // ---------------------------------------------------------------------------

  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function badgeLabel(badge) {
    const labels = { bestseller: 'Bestseller', new: 'New', sale: 'Sale', premium: 'Premium' };
    return labels[badge] || badge;
  }

  function renderStars(rating) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
      const filled = i <= Math.round(rating);
      html += `<svg class="star-icon${filled ? ' star--filled' : ''}" width="12" height="12" viewBox="0 0 24 24" fill="${filled ? 'var(--color-star)' : 'none'}" stroke="${filled ? 'var(--color-star)' : 'currentColor'}" stroke-width="2" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
    }
    return html;
  }

  function trashIconSVG() {
    return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>`;
  }

  function saveCartToStorage() {
    try { localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart)); } catch (e) { /* private browsing or storage quota */ }
  }

  function loadCartFromStorage() {
    try {
      const raw = JSON.parse(localStorage.getItem(CART_STORAGE_KEY));
      if (!Array.isArray(raw)) { state.cart = []; return; }
      state.cart = raw.reduce((acc, item) => {
        const product = findProduct(item.id);
        if (!product) return acc;
        const qty = Number.isInteger(item.quantity) && item.quantity > 0 ? item.quantity : 1;
        acc.push({ id: product.id, name: product.name, price: product.price, quantity: qty });
        return acc;
      }, []);
    } catch (_) {
      state.cart = [];
    }
  }

  function findProduct(productId) {
    return PRODUCTS.find(p => p.id === productId);
  }

  function findCartItem(productId) {
    return state.cart.find(item => item.id === productId);
  }

  function cartSubtotal() {
    return state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  function cartItemCount() {
    return state.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // ---------------------------------------------------------------------------
  // 4. PRODUCT RENDERING & FILTERING
  // ---------------------------------------------------------------------------

  function buildCardHTML(p) {
    const imageHTML = p.image
      ? `<img src="${p.image}" alt="${p.name} — VOLT Store product photo" class="card-img" loading="lazy" decoding="async" />`
      : `<div class="card-placeholder" style="background-color:${CATEGORY_COLORS[p.category]}"><span class="placeholder-label">${p.shortCode}</span></div>`;
    return `<article class="product-card reveal" role="listitem" data-product-id="${p.id}" data-category="${p.category}">
  <div class="card-image">
    ${imageHTML}
    ${p.badge ? `<span class="badge badge--${p.badge}">${badgeLabel(p.badge)}</span>` : ''}
    <button class="quick-add-btn" data-product-id="${p.id}" aria-label="Quick add ${p.name} to cart">Add to Cart</button>
  </div>
  <div class="card-body">
    <h3 class="card-name">${p.name}</h3>
    <p class="card-desc">${p.description}</p>
    <div class="card-price-row">
      ${p.originalPrice ? `<span class="price-original">$${p.originalPrice.toFixed(2)}</span>` : ''}
      <span class="price-current ${p.badge === 'sale' ? 'price--sale' : ''}">$${p.price.toFixed(2)}</span>
    </div>
    <div class="card-rating" aria-label="Rated ${p.rating} out of 5, ${p.reviewCount.toLocaleString()} reviews">
      ${renderStars(p.rating)}
      <span class="rating-score">${p.rating}</span>
      <span class="rating-count">(${p.reviewCount.toLocaleString()})</span>
    </div>
    ${p.lowStock ? `<p class="low-stock-label">${p.lowStockText}</p>` : ''}
    <button class="btn-primary btn--full add-to-cart-btn" data-product-id="${p.id}">Add to Cart</button>
  </div>
</article>`;
  }

  function getFilteredProducts() {
    let list = PRODUCTS.slice();

    if (state.activeCategory !== 'all') {
      list = list.filter(p => p.category === state.activeCategory);
    }

    if (state.searchQuery.trim() !== '') {
      const q = state.searchQuery.trim().toLowerCase();
      list = list.filter(p =>
        (p.name + ' ' + p.description + ' ' + p.category).toLowerCase().includes(q)
      );
    }

    switch (state.activeSort) {
      case 'featured':
        list.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
        break;
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'name-az':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return list;
  }

  function renderProducts() {
    const grid = document.getElementById('product-grid');
    const countEl = document.getElementById('product-count');
    const emptyState = document.getElementById('empty-state');
    if (!grid) return;

    const filtered = getFilteredProducts();

    if (filtered.length === 0) {
      grid.innerHTML = '';
      if (emptyState) emptyState.hidden = false;
      if (countEl) countEl.textContent = 'Showing 0 of ' + PRODUCTS.length + ' products';
      return;
    }

    if (emptyState) emptyState.hidden = true;
    grid.innerHTML = filtered.map(buildCardHTML).join('');
    if (countEl) {
      countEl.textContent = 'Showing ' + filtered.length + ' of ' + PRODUCTS.length + ' products';
    }

    initReveal();
  }

  // ---------------------------------------------------------------------------
  // 5. CART OPERATIONS & RENDERING
  // ---------------------------------------------------------------------------

  function addToCart(productId) {
    const product = findProduct(productId);
    if (!product) return;

    const existing = findCartItem(productId);
    if (existing) {
      existing.quantity += 1;
    } else {
      state.cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1 });
    }

    saveCartToStorage();
    renderCart();
    animateCartBadge();
    animateAddButton(productId);

    if (window.innerWidth <= 768) {
      showToast('Added to cart: ' + product.name);
    }
  }

  function removeFromCart(productId) {
    state.cart = state.cart.filter(item => item.id !== productId);
    saveCartToStorage();
    renderCart();
  }

  const MAX_CART_QTY = 10;

  function updateQuantity(productId, delta) {
    const item = findCartItem(productId);
    if (!item) return;
    if (delta > 0 && item.quantity >= MAX_CART_QTY) {
      showToast(`Max quantity is ${MAX_CART_QTY} per item.`);
      return;
    }
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    saveCartToStorage();
    renderCart();
  }

  function animateCartBadge() {
    const badge = document.getElementById('cart-count');
    if (!badge) return;
    badge.classList.remove('badge-bump');
    void badge.offsetWidth;
    badge.classList.add('badge-bump');
    setTimeout(() => badge.classList.remove('badge-bump'), 400);
  }

  function animateAddButton(productId) {
    const buttons = document.querySelectorAll(
      `.add-to-cart-btn[data-product-id="${productId}"],
       .quick-add-btn[data-product-id="${productId}"],
       .panel-add-to-cart[data-product-id="${productId}"]`
    );
    buttons.forEach(btn => {
      const original = btn.textContent;
      btn.textContent = 'Added \u2713';
      btn.classList.add('btn--added');
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove('btn--added');
        btn.disabled = false;
      }, 1200);
    });
  }

  function renderCart() {
    const countEl = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const subtotalEl = document.getElementById('cart-subtotal');
    const progressBar = document.getElementById('shipping-progress-bar');
    const progressLabel = document.getElementById('shipping-progress-label');

    const count = cartItemCount();
    const subtotal = cartSubtotal();

    if (countEl) {
      countEl.textContent = count;
      countEl.hidden = count === 0;
    }

    if (!cartItems) return;

    if (state.cart.length === 0) {
      if (cartEmpty) cartEmpty.hidden = false;
      cartItems.innerHTML = '';
      cartItems.hidden = true;
      const footerEl = subtotalEl ? subtotalEl.closest('.cart-footer') : null;
      if (footerEl) footerEl.hidden = true;
    } else {
      if (cartEmpty) cartEmpty.hidden = true;
      cartItems.hidden = false;

      const footerEl = subtotalEl ? subtotalEl.closest('.cart-footer') : null;
      if (footerEl) footerEl.hidden = false;

      cartItems.innerHTML = state.cart.map(item => {
        const product = findProduct(item.id);
        const bgColor = product ? CATEGORY_COLORS[product.category] : '#1e1e1e';
        const shortCode = product ? product.shortCode : '?';
        return `<div class="cart-item" data-product-id="${item.id}">
  <div class="cart-item-thumb" style="background: ${bgColor}">
    <span>${shortCode}</span>
  </div>
  <div class="cart-item-details">
    <span class="cart-item-name">${item.name}</span>
    <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
    <div class="qty-stepper">
      <button class="qty-btn" data-action="decrement" data-product-id="${item.id}" ${item.quantity === 1 ? 'disabled' : ''} aria-label="Decrease quantity">−</button>
      <span class="qty-value">${item.quantity}</span>
      <button class="qty-btn" data-action="increment" data-product-id="${item.id}" ${item.quantity >= MAX_CART_QTY ? 'disabled' : ''} aria-label="Increase quantity">+</button>
    </div>
  </div>
  <button class="cart-item-remove" data-product-id="${item.id}" aria-label="Remove ${item.name}">
    ${trashIconSVG()}
  </button>
</div>`;
      }).join('');

      if (subtotalEl) subtotalEl.textContent = '$' + subtotal.toFixed(2);

      if (progressBar && progressLabel) {
        const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
        if (remaining <= 0) {
          progressBar.style.width = '100%';
          progressLabel.textContent = 'You qualify for free shipping!';
        } else {
          const pct = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
          progressBar.style.width = pct + '%';
          progressLabel.textContent = '$' + remaining.toFixed(2) + ' more for free shipping';
        }
      }
    }
  }

  // ---------------------------------------------------------------------------
  // 6. CART DRAWER
  // ---------------------------------------------------------------------------

  let cartIsOpen = false;

  function openCart() {
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-backdrop');
    if (!drawer) return;
    drawer.classList.add('open');
    drawer.removeAttribute('aria-hidden');
    if (backdrop) { backdrop.hidden = false; backdrop.classList.add('visible'); }
    cartIsOpen = true;
    document.body.style.overflow = 'hidden';
    const closeBtn = document.getElementById('cart-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeCart() {
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-backdrop');
    if (!drawer) return;
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    if (backdrop) { backdrop.classList.remove('visible'); setTimeout(() => { backdrop.hidden = true; }, 300); }
    const cartTrigger = document.getElementById('cart-icon-btn');
    if (cartTrigger) cartTrigger.focus();
    cartIsOpen = false;
    document.body.style.overflow = '';
  }

  function initCart() {
    const cartIconBtn = document.getElementById('cart-icon-btn');
    const cartClose = document.getElementById('cart-close');
    const cartBackdrop = document.getElementById('cart-backdrop');
    const continueShopping = document.getElementById('continue-shopping');
    const checkoutBtn = document.getElementById('checkout-btn');

    if (cartIconBtn) cartIconBtn.addEventListener('click', () => cartIsOpen ? closeCart() : openCart());
    if (cartClose) cartClose.addEventListener('click', closeCart);
    if (cartBackdrop) cartBackdrop.addEventListener('click', closeCart);
    if (continueShopping) continueShopping.addEventListener('click', (e) => { e.preventDefault(); closeCart(); });
    if (checkoutBtn) checkoutBtn.addEventListener('click', () => { closeCart(); openCheckout(checkoutBtn); });
  }

  // ---------------------------------------------------------------------------
  // 7. PRODUCT DETAIL PANEL
  // ---------------------------------------------------------------------------

  let panelIsOpen = false;
  let panelTriggerEl = null;

  function buildPanelHTML(p) {
    const priceHTML = p.originalPrice
      ? `<span class="price-original">$${p.originalPrice.toFixed(2)}</span><span class="price-current price--sale">$${p.price.toFixed(2)}</span>`
      : `<span class="price-current">$${p.price.toFixed(2)}</span>`;
    const unitsSold = p.reviewCount > 1000 && p.badge === 'bestseller'
      ? '<span class="units-sold">Over 1,200 sold</span>' : '';
    return `<div class="panel-header">
  <button class="panel-back-btn" id="panel-close">&#8592; Back</button>
</div>
<div class="panel-body">
  ${p.image
      ? `<img src="${p.image}" alt="${p.name} — product detail photo — VOLT Store" class="panel-img" loading="lazy" decoding="async" />`
      : `<div class="panel-image" style="background:${CATEGORY_COLORS[p.category]}"><span>${p.shortCode}</span></div>`
    }
  ${p.badge ? `<span class="badge badge--${p.badge}">${badgeLabel(p.badge)}</span>` : ''}
  <h2 class="panel-name">${p.name}</h2>
  <div class="panel-rating" aria-label="Rated ${p.rating} out of 5, ${p.reviewCount.toLocaleString()} reviews">
    ${renderStars(p.rating)}
    <span class="rating-score">${p.rating}</span>
    <span class="rating-count">(${p.reviewCount.toLocaleString()})</span>
  </div>
  ${unitsSold}
  <div class="panel-price">${priceHTML}</div>
  <p class="panel-trust">Free shipping on orders over $75 &middot; 30-day returns &middot; 2-year warranty</p>
  <p class="panel-desc">${p.description}</p>
  ${p.lowStock ? `<p class="low-stock-label">${p.lowStockText}</p>` : ''}
  <button class="btn-primary btn--full panel-add-to-cart" data-product-id="${p.id}">Add to Cart</button>
</div>`;
  }

  function openPanel(productId, triggerEl) {
    const product = findProduct(productId);
    if (!product) return;
    const panel = document.getElementById('product-panel');
    const backdrop = document.getElementById('panel-backdrop');
    if (!panel) return;
    panelTriggerEl = triggerEl || null;
    state.panelProduct = product;
    panel.innerHTML = buildPanelHTML(product);
    panel.classList.add('open');
    panel.removeAttribute('aria-hidden');
    if (backdrop) { backdrop.hidden = false; backdrop.classList.add('visible'); }
    panelIsOpen = true;
    document.body.style.overflow = 'hidden';
    const panelClose = panel.querySelector('#panel-close');
    if (panelClose) { panelClose.addEventListener('click', closePanel); panelClose.focus(); }
    const panelAddBtn = panel.querySelector('.panel-add-to-cart');
    if (panelAddBtn) panelAddBtn.addEventListener('click', (e) => addToCart(e.currentTarget.dataset.productId));
  }

  function closePanel() {
    const panel = document.getElementById('product-panel');
    const backdrop = document.getElementById('panel-backdrop');
    if (panel) { panel.classList.remove('open'); panel.setAttribute('aria-hidden', 'true'); }
    if (backdrop) { backdrop.classList.remove('visible'); setTimeout(() => { backdrop.hidden = true; }, 300); }
    panelIsOpen = false;
    state.panelProduct = null;
    document.body.style.overflow = '';
    if (panelTriggerEl) { panelTriggerEl.focus(); panelTriggerEl = null; }
  }

  function initPanel() {
    const grid = document.getElementById('product-grid');
    const backdrop = document.getElementById('panel-backdrop');
    if (grid) {
      grid.addEventListener('click', (e) => {
        if (e.target.closest('.add-to-cart-btn, .quick-add-btn')) return;
        const card = e.target.closest('.product-card');
        if (card && card.dataset.productId) openPanel(card.dataset.productId, card);
      });
    }
    if (backdrop) backdrop.addEventListener('click', closePanel);
  }

  // ---------------------------------------------------------------------------
  // 8. FILTERS, SEARCH, SORT
  // ---------------------------------------------------------------------------

  let searchDebounceTimer = null;

  function setCategory(category) {
    state.activeCategory = category;
    document.querySelectorAll('[data-filter]').forEach(btn => {
      const isActive = btn.dataset.filter === category;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
    renderProducts();
    renderActiveChips();
  }

  function renderActiveChips() {
    const chipsContainer = document.getElementById('active-chips');
    if (!chipsContainer) return;
    const chips = [];
    if (state.activeCategory !== 'all') chips.push({ label: state.activeCategory, type: 'category' });
    if (state.searchQuery.trim() !== '') chips.push({ label: 'Search: ' + state.searchQuery.trim(), type: 'search' });

    if (chips.length === 0) {
      chipsContainer.innerHTML = '';
      chipsContainer.hidden = true;
      return;
    }

    chipsContainer.hidden = false;
    let html = chips.map(chip => {
      const safeLabel = escapeHTML(chip.label);
      const safeType  = escapeHTML(chip.type);
      return `<span class="filter-chip" data-chip-type="${safeType}">
  ${safeLabel}
  <button class="chip-remove" data-chip-type="${safeType}" aria-label="Remove ${safeLabel} filter">&times;</button>
</span>`;
    }).join('');
    if (chips.length >= 2) html += `<button class="chip-clear-all">Clear all</button>`;
    chipsContainer.innerHTML = html;
  }

  function initFilters() {
    document.querySelectorAll('[data-filter]').forEach(btn => {
      btn.setAttribute('aria-pressed', btn.dataset.filter === state.activeCategory ? 'true' : 'false');
      btn.addEventListener('click', () => setCategory(btn.dataset.filter));
    });

    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        state.activeSort = sortSelect.value;
        renderProducts();
      });
    }

    document.querySelectorAll('[data-category]').forEach(tile => {
      function activateTile(e) {
        e.preventDefault();
        setCategory(tile.dataset.category);
        const productsSection = document.getElementById('products');
        if (productsSection) productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      tile.addEventListener('click', activateTile);
      tile.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') activateTile(e); });
    });

    const chipsContainer = document.getElementById('active-chips');
    if (chipsContainer) {
      chipsContainer.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('.chip-remove');
        const clearAll = e.target.closest('.chip-clear-all');
        if (removeBtn) {
          if (removeBtn.dataset.chipType === 'category') {
            setCategory('all');
          } else if (removeBtn.dataset.chipType === 'search') {
            state.searchQuery = '';
            const searchInput = document.getElementById('search-input');
            if (searchInput) searchInput.value = '';
            renderProducts();
            renderActiveChips();
          }
        }
        if (clearAll) {
          state.searchQuery = '';
          const searchInput = document.getElementById('search-input');
          if (searchInput) searchInput.value = '';
          setCategory('all');
        }
      });
    }
  }

  function initSearch() {
    const searchTrigger = document.getElementById('search-trigger');
    const searchInput = document.getElementById('search-input');
    const header = document.getElementById('site-header');

    if (searchTrigger && header) {
      searchTrigger.addEventListener('click', () => {
        const expanded = header.classList.toggle('search-expanded');
        searchTrigger.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        if (expanded && searchInput) {
          searchInput.value = '';
          searchInput.focus();
        } else {
          state.searchQuery = '';
          if (searchInput) searchInput.value = '';
          renderProducts();
          renderActiveChips();
        }
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', () => {
        clearTimeout(searchDebounceTimer);
        searchDebounceTimer = setTimeout(() => {
          state.searchQuery = searchInput.value;
          renderProducts();
          renderActiveChips();
        }, 200);
      });

      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          state.searchQuery = '';
          searchInput.value = '';
          if (header) header.classList.remove('search-expanded');
          renderProducts();
          renderActiveChips();
        }
      });
    }
  }

  function initProductGridDelegation() {
    document.body.addEventListener('click', (e) => {
      const btn = e.target.closest('.add-to-cart-btn, .quick-add-btn');
      if (!btn) return;
      const productId = btn.dataset.productId;
      if (productId) {
        e.stopPropagation();
        addToCart(productId);
      }
    });

    const cartItemsEl = document.getElementById('cart-items');
    if (cartItemsEl) {
      cartItemsEl.addEventListener('click', (e) => {
        const qtyBtn = e.target.closest('.qty-btn');
        const removeBtn = e.target.closest('.cart-item-remove');
        if (qtyBtn) {
          const { productId, action } = qtyBtn.dataset;
          if (action === 'increment') updateQuantity(productId, 1);
          if (action === 'decrement') updateQuantity(productId, -1);
        }
        if (removeBtn && removeBtn.dataset.productId) removeFromCart(removeBtn.dataset.productId);
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 9. HEADER SCROLL
  // ---------------------------------------------------------------------------

  function initScrollBehavior() {
    const header = document.getElementById('site-header');
    if (!header) return;
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---------------------------------------------------------------------------
  // 10. ANNOUNCEMENT BAR
  // ---------------------------------------------------------------------------

  function initAnnouncementBar() {
    const bar = document.getElementById('announcement-bar');
    const dismissBtn = document.getElementById('dismiss-bar');
    if (!bar) return;
    if (sessionStorage.getItem(BAR_DISMISSED_KEY)) { bar.style.display = 'none'; return; }
    if (dismissBtn) {
      dismissBtn.addEventListener('click', () => {
        bar.style.transition = 'height 0.3s ease, opacity 0.3s ease, padding 0.3s ease';
        bar.style.overflow = 'hidden';
        bar.style.opacity = '0';
        bar.style.height = bar.offsetHeight + 'px';
        void bar.offsetHeight;
        bar.style.height = '0';
        bar.style.padding = '0';
        setTimeout(() => { bar.style.display = 'none'; }, 320);
        sessionStorage.setItem(BAR_DISMISSED_KEY, '1');
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 11. MOBILE NAV
  // ---------------------------------------------------------------------------

  function initDesktopNavAriaHidden() {
    const desktopNav = document.getElementById('desktop-nav');
    if (!desktopNav) return;
    const mq = window.matchMedia('(max-width: 1023px)');
    function update(e) { desktopNav.setAttribute('aria-hidden', e.matches ? 'true' : 'false'); }
    update(mq);
    mq.addEventListener('change', update);
  }

  let closeMobileNav = null;

  function initMobileNav() {
    const nav = document.getElementById('mobile-nav');
    const closeBtn = document.getElementById('mobile-nav-close');
    const menuTrigger = document.getElementById('menu-trigger');

    closeMobileNav = function () {
      if (!nav) return;
      nav.classList.remove('open');
      nav.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (menuTrigger) menuTrigger.setAttribute('aria-expanded', 'false');
      if (menuTrigger) menuTrigger.focus();
    };

    function openMobileNav() {
      if (!nav) return;
      nav.classList.add('open');
      nav.removeAttribute('aria-hidden');
      document.body.style.overflow = 'hidden';
      if (menuTrigger) menuTrigger.setAttribute('aria-expanded', 'true');
      if (closeBtn) closeBtn.focus();
    }

    if (closeBtn) closeBtn.addEventListener('click', closeMobileNav);
    if (menuTrigger) menuTrigger.addEventListener('click', openMobileNav);

    if (nav) {
      nav.addEventListener('click', (e) => {
        if (e.target === nav) closeMobileNav();
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 12. SCROLL REVEAL
  // ---------------------------------------------------------------------------

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  function initReveal() {
    const elements = document.querySelectorAll('.reveal:not(.is-revealed)');
    if (prefersReducedMotion()) {
      elements.forEach(el => el.classList.add('is-revealed'));
      return;
    }
    elements.forEach(el => revealObserver.observe(el));
  }

  // ---------------------------------------------------------------------------
  // 13. CHECKOUT
  // ---------------------------------------------------------------------------

  let checkoutTriggerEl = null;

  function openCheckout(triggerEl) {
    const overlay = document.getElementById('checkout-overlay');
    if (!overlay) return;
    checkoutTriggerEl = triggerEl || null;
    overlay.classList.add('open');
    overlay.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
    populateCheckoutSummary();
    const firstInput = overlay.querySelector('input');
    if (firstInput) firstInput.focus();
  }

  function closeCheckout() {
    const overlay = document.getElementById('checkout-overlay');
    if (!overlay) return;
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (checkoutTriggerEl) { checkoutTriggerEl.focus(); checkoutTriggerEl = null; }
    const form = overlay.querySelector('form');
    if (form) {
      form.reset();
      form.querySelectorAll('.field-error').forEach(el => el.remove());
      form.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    }
    const confirmation = document.getElementById('order-confirmation');
    if (confirmation) confirmation.hidden = true;
    overlay.querySelectorAll('.checkout-form-section, .checkout-form').forEach(el => el.hidden = false);
  }

  function populateCheckoutSummary() {
    const summaryList = document.getElementById('checkout-summary-items');
    const summaryTotal = document.getElementById('checkout-summary-total');
    if (summaryList) {
      summaryList.innerHTML = state.cart.map(item =>
        `<div class="checkout-summary-item">
  <span class="checkout-item-name">${item.name} <span class="checkout-item-qty">x${item.quantity}</span></span>
  <span class="checkout-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
</div>`
      ).join('');
    }
    if (summaryTotal) summaryTotal.textContent = '$' + cartSubtotal().toFixed(2);
  }

  function validateField(input, isValid, message) {
    const existingError = input.parentElement.querySelector('.field-error');
    if (existingError) existingError.remove();
    input.classList.remove('input-error');
    if (!isValid) {
      input.classList.add('input-error');
      const error = document.createElement('span');
      error.className = 'field-error';
      error.textContent = message;
      input.parentElement.appendChild(error);
      return false;
    }
    return true;
  }

  function validateCheckoutForm(form) {
    if (!form) return false;
    let allValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;

    const checks = [
      { name: 'email',       test: v => emailRegex.test(v.trim()),               msg: 'Please enter a valid email address.' },
      { name: 'full-name',   test: v => v.trim().length > 0,                     msg: 'Full name is required.' },
      { name: 'address',     test: v => v.trim().length > 0,                     msg: 'Address is required.' },
      { name: 'city',        test: v => v.trim().length > 0,                     msg: 'City is required.' },
      { name: 'state',       test: v => v.trim().length > 0,                     msg: 'State / region is required.' },
      { name: 'zip',         test: v => v.trim().length > 0,                     msg: 'ZIP / postal code is required.' },
      { name: 'country',     test: v => v.trim().length > 0,                     msg: 'Country is required.' },
      { name: 'card-number', test: v => /^\d{16}$/.test(v.replace(/\s/g, '')),  msg: 'Enter a valid 16-digit card number.' },
      { name: 'expiry',      test: v => expiryRegex.test(v.trim()),              msg: 'Enter expiry in MM/YY format.' },
      { name: 'cvv',         test: v => /^\d{3,4}$/.test(v.trim()),             msg: 'Enter a 3 or 4 digit CVV.' }
    ];

    checks.forEach(({ name, test, msg }) => {
      const input = form.querySelector(`[name="${name}"]`);
      if (input && !validateField(input, test(input.value), msg)) allValid = false;
    });

    return allValid;
  }

  function showOrderConfirmation(email) {
    const overlay = document.getElementById('checkout-overlay');
    if (!overlay) return;
    overlay.querySelectorAll('.checkout-form-section, .checkout-form').forEach(el => el.hidden = true);

    const confirmation = document.getElementById('order-confirmation');
    if (!confirmation) return;

    const orderNumber = 'VLT-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    const orderNumEl = confirmation.querySelector('.order-number');
    const orderEmailEl = confirmation.querySelector('.order-email');
    const orderItemsEl = confirmation.querySelector('.order-items-list');

    if (orderNumEl) orderNumEl.textContent = orderNumber;
    if (orderEmailEl) orderEmailEl.textContent = email;
    if (orderItemsEl) {
      orderItemsEl.innerHTML = state.cart.map(item =>
        `<li>${item.name} x${item.quantity} — $${(item.price * item.quantity).toFixed(2)}</li>`
      ).join('');
    }

    confirmation.hidden = false;
    state.cart = [];
    saveCartToStorage();
    renderCart();
  }

  function initCheckout() {
    const overlay = document.getElementById('checkout-overlay');
    if (!overlay) return;

    const placeOrderBtn = document.getElementById('place-order-btn');
    const form = overlay.querySelector('form');

    if (placeOrderBtn && form) {
      placeOrderBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!validateCheckoutForm(form)) return;
        const emailInput = form.querySelector('[name="email"]');
        const emailValue = emailInput ? emailInput.value.trim() : '';
        placeOrderBtn.disabled = true;
        placeOrderBtn.textContent = 'Processing...';
        setTimeout(() => {
          placeOrderBtn.disabled = false;
          placeOrderBtn.textContent = 'Place Order';
          showOrderConfirmation(emailValue);
        }, 1500);
      });
    }

    const confirmation = document.getElementById('order-confirmation');
    if (confirmation) {
      const backBtn = confirmation.querySelector('.back-to-store-btn');
      if (backBtn) backBtn.addEventListener('click', closeCheckout);
    }

    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeCheckout(); });
  }

  // ---------------------------------------------------------------------------
  // 14. NEWSLETTER
  // ---------------------------------------------------------------------------

  function initNewsletter() {
    const input = document.getElementById('newsletter-input');
    const btn = document.getElementById('newsletter-submit');
    const errorEl = document.getElementById('newsletter-error');
    const successEl = document.getElementById('newsletter-success');
    const wrapper = document.getElementById('newsletter-form-wrapper');
    if (!btn) return;

    function showError(msg) {
      if (errorEl) { errorEl.textContent = msg; errorEl.style.display = 'block'; }
      if (input) { input.classList.add('input-error'); input.focus(); }
    }

    function clearError() {
      if (errorEl) { errorEl.textContent = ''; errorEl.style.display = 'none'; }
      if (input) input.classList.remove('input-error');
    }

    function submit() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const email = input ? input.value.trim() : '';
      if (!email) { showError('Please enter your email address.'); return; }
      if (!emailRegex.test(email)) { showError('That doesn\'t look like a valid email address.'); return; }
      clearError();
      btn.disabled = true;
      btn.textContent = 'Subscribing...';
      setTimeout(() => {
        if (wrapper) wrapper.style.display = 'none';
        if (successEl) successEl.style.display = 'block';
      }, 1000);
    }

    btn.addEventListener('click', submit);
    if (input) {
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); submit(); } });
    }
  }

  // ---------------------------------------------------------------------------
  // 15. TOAST
  // ---------------------------------------------------------------------------

  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => toast.classList.add('toast--visible'));
    });
    setTimeout(() => {
      toast.classList.remove('toast--visible');
      setTimeout(() => { if (toast.parentElement) toast.parentElement.removeChild(toast); }, 400);
    }, 3000);
  }

  // ---------------------------------------------------------------------------
  // 16. GLOBAL KEY LISTENERS
  // ---------------------------------------------------------------------------

  function initGlobalKeyListeners() {
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (cartIsOpen) { closeCart(); return; }
      if (panelIsOpen) { closePanel(); return; }
      const checkoutOverlay = document.getElementById('checkout-overlay');
      if (checkoutOverlay && checkoutOverlay.classList.contains('open')) { closeCheckout(); return; }
      const mobileNav = document.getElementById('mobile-nav');
      if (mobileNav && mobileNav.classList.contains('open')) {
        if (closeMobileNav) closeMobileNav();
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 17. INLINE ACTION WIRING (replaces HTML onclick attributes)
  // ---------------------------------------------------------------------------

  function initInlineActions() {
    // Desktop nav category links
    document.querySelectorAll('.nav-links a[data-filter]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        setCategory(link.dataset.filter);
        document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
      });
    });

    // Hero "Shop the Arkive H1"
    const shopBtn = document.querySelector('.hero-shop-arkive');
    if (shopBtn) {
      shopBtn.addEventListener('click', () => {
        document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          document.querySelector('[data-product-id="arkive-h1"] .add-to-cart-btn')?.click();
        }, 600);
      });
    }

    // Hero "See all products"
    const seeAllBtn = document.querySelector('.hero-see-all');
    if (seeAllBtn) {
      seeAllBtn.addEventListener('click', () => {
        document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
      });
    }

    // Featured "See full specs"
    const specsBtn = document.querySelector('.featured-specs-btn');
    if (specsBtn) {
      specsBtn.addEventListener('click', () => openPanel('arkive-h1'));
    }

    // Empty state "Clear all filters"
    const emptyStateBtn = document.querySelector('.empty-clear-btn');
    if (emptyStateBtn) {
      emptyStateBtn.addEventListener('click', () => setCategory('all'));
    }

    // Cart browse products
    const cartBrowseBtn = document.getElementById('cart-browse');
    if (cartBrowseBtn) {
      cartBrowseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeCart();
        document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }

  // ---------------------------------------------------------------------------
  // INIT
  // ---------------------------------------------------------------------------

  document.addEventListener('DOMContentLoaded', () => {
    loadCartFromStorage();
    renderProducts();
    renderCart();
    initReveal();
    initScrollBehavior();
    initFilters();
    initSearch();
    initCart();
    initProductGridDelegation();
    initPanel();
    initCheckout();
    initNewsletter();
    initAnnouncementBar();
    initDesktopNavAriaHidden();
    initMobileNav();
    initGlobalKeyListeners();
    initInlineActions();
  });

})();
